#!/usr/bin/env node

const utils = require("../dst/utils.js");
require("dotenv").config();

// const haversine = require("haversine");

(async () => {
  console.log(await utils.geocode("577 Howard St, San Francisco, CA 94105"));
})();

// import User from "../models/User.js";

// dotenv.config();
