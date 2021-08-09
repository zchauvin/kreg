import { scrapeSpots } from "./spotery.js";
import { geocode, geodistance } from "./utils.js";
import { SPOT_TO_ADDRESS_LOCATION_PAIR } from "./constants.js";
import Distance from "geo-distance";
import _ from "lodash";
import moment from "moment";

const formattedTime = (time) => {
  return moment(time, "LT");
};

export const main = async (date, homeAddress, fromTime, toTime) => {
  const homeLocation = await geocode(homeAddress);
  const fromTimeFormatted = fromTime > 4 && formattedTime(fromTime);
  const toTimeFormatted = toTime && formattedTime(toTime);

  const spots = await scrapeSpots(date);

  for (var spot of spots) {
    _.remove(
      spot[1],
      (time) =>
        (fromTimeFormatted && formattedTime(time) < fromTimeFormatted) ||
        (toTimeFormatted && formattedTime(time) > toTimeFormatted)
    );
  }

  const qualifiedSpots = spots.filter(([spot, times]) => {
    const location = SPOT_TO_ADDRESS_LOCATION_PAIR[spot][1];

    if (geodistance(homeLocation, location) > Distance("2 miles")) return false;
    if (times.length == 0) return false;

    return true;
  });

  qualifiedSpots.sort((s1, s2) => {
    const l1 = SPOT_TO_ADDRESS_LOCATION_PAIR[s1[0]][1];
    const l2 = SPOT_TO_ADDRESS_LOCATION_PAIR[s2[0]][1];
    return geodistance(homeLocation, l1) - geodistance(homeLocation, l2);
  });

  console.log(qualifiedSpots);
};

export const scrapeSpotery = async (message, _context) => {
  const args = JSON.parse(Buffer.from(message.data, "base64").toString());
  console.log(`consumed: ${JSON.stringify(args)}`);

  try {
    await main(...Object.values(args));
    console.log("Successfully ran main.");
  } catch (e) {
    console.log("Failure running main: ", e);
  }
};
