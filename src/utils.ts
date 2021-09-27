const BASE_URL = "https://maps.googleapis.com/maps/api/geocode/json";

import fetch from "node-fetch";
import twilio from "twilio";
import haversine from "haversine";

interface AddressComponent {
  geometry: {
    location: Location;
  };
}

interface GeocodeResponse {
  results?: AddressComponent[];
}

interface Location {
  lat: number;
  lng: number;
}

export const geocode = async (address: string): Promise<Location | null> => {
  const res = await fetch(
    BASE_URL +
      `?key=${process.env.GOOGLE_MAPS_API_KEY}&address=${encodeURIComponent(
        address
      )}`
  );
  const json = (await res.json()) as GeocodeResponse;
  if (!json.results) return null;

  return json.results[0].geometry.location;
};

export const geodistance = (l1: Location, l2: Location): number => {
  return haversine(l1, l2, { unit: "mile", format: "{lat,lng}" });
};

export const sendTextMessage = async (phoneNumber: string, message: string) => {
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
