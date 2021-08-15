#!/usr/bin/env node

// import dotenv from "dotenv";

// dotenv.config();

// "Usage: node index.js <date(MM/DD/YYYY)> <address> <fromTime?(H:MM AM)> <toTime?(H:MM AM)>"

import { scrapeSpotery } from "../index.js";

await scrapeSpotery();

// import _ from "lodash"
// import { EXAMPLE_SPOTS } from "../constants.js"

// console.log(_.groupBy(EXAMPLE_SPOTS, 'title'))
