#!/usr/bin/env node

const main = require("../dst/index.js");

(async () => {
  await main.scrapeSpotery();
})();

// import dotenv from "dotenv";
// import User from "../models/User.js";

// dotenv.config();
