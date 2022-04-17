#!/usr/bin/env node

const main = require("../dst/index.js");
require("dotenv").config();

// const haversine = require("haversine");

(async () => {
  // await main.scrapeSpotery();
  await main.myReservations();
})();

// import User from "../models/User.js";

// dotenv.config();
