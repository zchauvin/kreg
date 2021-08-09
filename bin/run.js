#!/usr/bin/env node

import { main } from "../index.js";

if (process.argv.length < 4) {
  console.log(
    "Usage: node index.js <date(MM/DD/YYYY)> <address> <fromTime?(H:MM AM)> <toTime?(H:MM AM)>"
  );
} else {
  await main(...process.argv.slice(2));
}
