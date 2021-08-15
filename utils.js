const BASE_URL = "https://maps.googleapis.com/maps/api/geocode/json";
const API_KEY = "AIzaSyBrfcYKJBOUbU70Z4wfRQWyDoNVtilshvc";

import fetch from "node-fetch";
import Distance from "geo-distance";
import twilio from "twilio";

export const geocode = async (address) => {
  const res = await fetch(
    BASE_URL + `?key=${API_KEY}&address=${encodeURIComponent(address)}`
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

export const sendTextMessage = async (phoneNumber, message) => {
  console.log(message);

  if (process.env.NODE_ENV === "development") return;

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
