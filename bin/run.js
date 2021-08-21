#!/usr/bin/env node

// import { scrapeSpotery } from "../index.js";

// await scrapeSpotery();

import dotenv from "dotenv";
// import Reservation from "../models/Reservation.js";
import User from "../models/User.js";

dotenv.config();

(async () => {
  const user = await User.find("Y3wLaPUBZpSOTVPcS0Yt");
  const reservation = await user.mostRecentReservation();

  await reservation.update({ status: "booked" });
})();
