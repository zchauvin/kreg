import { scrapeSpots, bookingUrl, ReservationInfo } from "./spotery.js";
import { geocode, geodistance, sendTextMessage } from "./utils.js";
import {
  SPOTS,
  EXAMPLE_SPOTS,
  TIMEZONE,
  RECENT_RESERVATION_THRESHOLD_DAYS,
} from "./constants.js";
import _ from "lodash";
import moment from "moment-timezone";
import User from "./models/User.js";
import Reservation from "./models/Reservation.js";
import dotenv from "dotenv";
import type { HttpFunction } from "@google-cloud/functions-framework/build/src/functions";

export { handleSMS } from "./twilio.js";

const ADVANCE_BOOKING_DAYS = 7;

const parseTime = (time: string) => moment(time, "LT");

const formattedDate = (date: string) => moment(date, "L").format("ddd, MMM D");
const formattedTime = (time: string) => moment(time, "LT").format("h:mm a");

const availableReservations = async (): Promise<ReservationInfo[]> => {
  if (process.env.USE_MOCK_DATA == "true") {
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

async function asyncFilter<T>(
  arr: T[],
  predicate: (elm: T) => Promise<boolean>
) {
  const results = await Promise.all(arr.map(predicate));

  return arr.filter((_v, index) => results[index]);
}

const reservationForUser = async (
  reservations: ReservationInfo[],
  user: User
): Promise<ReservationInfo | null> => {
  const homeLocation = await geocode(user.address);

  if (!homeLocation) return null;

  const qualifiedReservations = await asyncFilter(
    reservations,
    async ({ name, date, time }) => {
      const { location } = SPOTS[name];

      if (geodistance(homeLocation, location) > user.getDistanceFilterMiles())
        return false;

      const dayOfWeek = moment(date, "L").format("ddd").toLowerCase();
      const range = user.ranges.find((r) => r.day === dayOfWeek);

      if (!range) return false;

      const { fromTime, toTime } = range;

      const timestamp = moment(`${date} ${time}`, "L LT", TIMEZONE);

      if (
        (fromTime && parseTime(time) < parseTime(fromTime)) ||
        (toTime && parseTime(time) > parseTime(toTime)) ||
        timestamp < moment().add(2, "hour")
      )
        return false;

      const reservations = await user.reservations("booked");

      const conflictingReservationExists = reservations.some((reservation) => {
        const reservationTimestamp = moment(reservation.timestamp.toMillis());

        return (
          reservationTimestamp >
            timestamp
              .clone()
              .subtract(RECENT_RESERVATION_THRESHOLD_DAYS, "days") &&
          reservationTimestamp <
            timestamp.add(RECENT_RESERVATION_THRESHOLD_DAYS, "days")
        );
      });

      return !conflictingReservationExists;
    }
  );

  qualifiedReservations.sort((s1, s2) => {
    const l1 = SPOTS[s1.name].location;
    const l2 = SPOTS[s2.name].location;
    return geodistance(homeLocation, l1) - geodistance(homeLocation, l2);
  });

  return qualifiedReservations.length > 0 ? qualifiedReservations[0] : null;
};

const message = (user: User, reservation: ReservationInfo) =>
  `Hey ${user.firstName}, Kreg here! Want to book ${
    reservation.name
  } on ${formattedDate(reservation.date)} at ${formattedTime(
    reservation.time
  )}? If so, book at ${bookingUrl(
    reservation.name,
    reservation.date
  )} and reply "Y"`;

export const scrapeSpotery: HttpFunction = async (_message, _context) => {
  dotenv.config();

  const [reservations, users] = await Promise.all([
    availableReservations(),
    User.active(),
  ]);

  await Promise.all(
    users.map(async (user) => {
      if (process.env.ONLY_ZACK == "true" && user.firstName != "Zack") return;

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
        await r.save();

        await sendTextMessage(user.phoneNumber, message(user, reservation));
      } else {
        console.log(`No available reservations for ${user.firstName}`);
      }
    })
  );
};
