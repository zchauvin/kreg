const BASE_URL = "https://maps.googleapis.com/maps/api/geocode/json";

import fetch from "node-fetch";
import Distance from "geo-distance";
import twilio from "twilio";

export const geocode = async (address) => {
  const res = await fetch(
    BASE_URL + `?key=${process.env.API_KEY}&address=${encodeURIComponent(address)}`
  );
  const json = await res.json();
  if (!json.results) return null;

  return json.results[0].geometry.location;
};

export const geodistance = (l1, l2) => {
  l1["lon"] = l1["lng"];
  l2["lon"] = l2["lng"];

  return Distance.between(l1, l2);
};

export const listToString = (elements) => {
  if (elements.length < 2) return elements[0];

  let transformedElements = elements;

  if (elements.length > 2) {
    transformedElements = elements.map(
      (e, i) => e + (i < elements.length - 1 ? "," : "")
    );
  }

  transformedElements.splice(elements.length - 1, 0, "or");

  return transformedElements.join(" ");
};

export const sendTextMessage = async (spot, date, name, phoneNumber) => {
  const message = `Hey ${name}, Kreg here! Want to book ${
    spot[0]
  } on ${date} at ${listToString(spot[1])}? If so, head to: ${spot[2]}`;

  console.log(message);

  const client = twilio(
    process.env.TWILIO_ACCOUNT_SID,
    process.env.TWILIO_AUTH_TOKEN
  );

  await client.messages.create({
    body: message,
    from: process.env.TWILIO_PHONE_NUMBER,
    to: phoneNumber,
  });
};
