#!/usr/bin/env node

import { scrapeSpotery } from "../index.js";

await scrapeSpotery();

// import dotenv from "dotenv";
// import Reservation from "../models/Reservation.js";
// import User from "../models/User.js";

// dotenv.config();

// (async () => {
//   const user = await User.find("lOIdYpZCW1tpA3hHiAfj");
//   const reservations = await user.reservations("booked");
//   console.log(reservations);

// console.log(moment(reservations[0].timestamp.toDate()));
// })();
