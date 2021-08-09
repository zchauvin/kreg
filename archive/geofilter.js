import { SPOT_TO_ADDRESS_LOCATION_PAIR } from "./constants.js";
import { geocode, geodistance } from "./utils.js";
import Distance from "geo-distance";

(async () => {
  const homeLocation = await geocode(process.argv[2]);

  const qualifiedSpots = {};
  for (const spot in SPOT_TO_ADDRESS_LOCATION_PAIR) {
    const spotPair = SPOT_TO_ADDRESS_LOCATION_PAIR[spot];
    const distance = geodistance(homeLocation, spotPair[1]);

    if (distance > Distance("5 km")) continue;

    qualifiedSpots[spot] = spotPair;
  }

  console.log(qualifiedSpots);
})();
