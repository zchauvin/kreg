const BASE_URL = "https://maps.googleapis.com/maps/api/geocode/json";

import fetch from "node-fetch";
import Distance from "geo-distance";

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
  // const distance = Distance.between(l1, l2);
  // console.log(distance);
  return Distance.between(l1, l2);
  // distance.human_readable()["distance"];
};
