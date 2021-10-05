#!/usr/bin/env node

const Reservation = require("../dst/models/Reservation.js");
require("dotenv").config();

// const haversine = require("haversine");

(async () => {
  const reservation = await Reservation.default.find("3RPwBU7inxRkPLncwyMt");
  await reservation.update({ status: "booked" });
})();

// import User from "../models/User.js";

// dotenv.config();
