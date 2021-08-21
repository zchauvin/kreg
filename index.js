import { scrapeSpots, bookingUrl } from "./spotery.js";
import { geocode, geodistance, sendTextMessage } from "./utils.js";
import { SPOTS, EXAMPLE_SPOTS, TIMEZONE } from "./constants.js";
import Distance from "geo-distance";
import _ from "lodash";
import moment from "moment-timezone";
import dotenv from "dotenv";
import User from "./models/User.js";
import Reservation from "./models/Reservation.js";

export { handleSMS } from "./twilio.js";

const ADVANCE_BOOKING_DAYS = 7;

const parseTime = (time) => moment(time, "LT");

const formattedDate = (date) => moment(date, "L").format("ddd, MMM D");
const formattedTime = (time) => moment(time, "LT").format("h:mm a");

const availableReservations = async (mockData = false) => {
  if (mockData) {
    return EXAMPLE_SPOTS;
  }

  let reservations = await Promise.all(
    [...Array(ADVANCE_BOOKING_DAYS).keys()].map(
      async (dayDelta) =>
        await scrapeSpots(moment().add(dayDelta, "days").format("L"))
    )
  );

  return _.flatten(reservations);
};

const reservationForUser = async (reservations, user) => {
  const homeLocation = await geocode(user.address);

  const qualifiedReservations = reservations.filter(({ name, date, time }) => {
    const { location } = SPOTS[name];

    if (geodistance(homeLocation, location) > Distance("2 miles")) return false;

    const dayOfWeek = moment(date, "L").format("ddd").toLowerCase();
    const range = user.ranges.find((r) => r.day === dayOfWeek);

    if (!range) return false;

    const { fromTime, toTime } = range;

    if (
      (fromTime && parseTime(time) < parseTime(fromTime)) ||
      (toTime && parseTime(time) > parseTime(toTime)) ||
      moment(`${date} ${time}`, "L LT") < moment().add(2, "hour")
    )
      return false;

    return true;
  });

  qualifiedReservations.sort((s1, s2) => {
    const l1 = SPOTS[s1.name].location;
    const l2 = SPOTS[s2.name].location;
    return geodistance(homeLocation, l1) - geodistance(homeLocation, l2);
  });

  return qualifiedReservations.length > 0 ? qualifiedReservations[0] : null;
};

const message = (user, reservation) =>
  `Hey ${user.firstName}, Kreg here! Want to book ${
    reservation.name
  } on ${formattedDate(reservation.date)} at ${formattedTime(
    reservation.time
  )}? If so, book at ${bookingUrl(
    reservation.name,
    reservation.date
  )} and reply "Y"`;

export const scrapeSpotery = async (_message, _context) => {
  dotenv.config();

  const [reservations, users] = await Promise.all([
    availableReservations(true),
    User.all(),
  ]);

  await Promise.all(
    users.map(async (user) => {
      const reservation = await reservationForUser(reservations, user);

      if (reservation) {
        const r = new Reservation({
          user: User.ref(user.id),
          spotId: SPOTS[reservation.name].id,
          timestamp: moment.tz(
            `${reservation.date} ${reservation.time}`,
            "L LT",
            TIMEZONE
          ),
        });
        r.save();

        await sendTextMessage(user.phoneNumber, message(user, reservation));
      }
    })
  );
};
