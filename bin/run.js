#!/usr/bin/env node

import { scrapeSpotery } from "../index.js";
// import moment from "moment";

await scrapeSpotery();

// import dotenv from "dotenv";
// import Reservation from "../models/Reservation.js";
// import User from "../models/User.js";

// dotenv.config();

// (async () => {
//   const user = await User.find("Y3wLaPUBZpSOTVPcS0Yt");
//   const reservations = await user.reservations("booked");

//   console.log(moment(reservations[0].timestamp.toDate()));
// })();
