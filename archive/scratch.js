const _ = require("lodash");
const moment = require("moment");

const formattedTime = (time) => {
  return moment(time, "LT");
};

const fromTime = formattedTime("7:00 AM");
const toTime = formattedTime("10:00 AM");
