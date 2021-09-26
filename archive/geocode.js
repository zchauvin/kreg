import { geocode } from "./utils.js";

const SPOTS = [
  ["Alice Marble Tennis Court #1", "Greenwich St & Hyde St San Francisco, CA"],
  ["Alice Marble Tennis Court #2", "Greenwich St & Hyde St San Francisco, CA"],
  ["Alice Marble Tennis Court #3", "Greenwich St & Hyde St San Francisco, CA"],
  [
    "Alice Marble Tennis Court #4 ONE HOUR SLOTS",
    "Greenwich St & Hyde St San Francisco, CA",
  ],
  ["Balboa Park Tennis Court #1", "34 Sgt John V Young Ln San Francisco, CA"],
  ["Balboa Park Tennis Court #2", "34 Sgt John V Young Ln San Francisco, CA"],
  ["Balboa Park Tennis Court #3", "34 Sgt John V Young Ln San Francisco, CA"],
  [
    "Balboa Park Tennis Court #4 ONE HOUR SLOTS",
    "34 Sgt John V Young Ln San Francisco, CA",
  ],
  ["Crocker Amazon Tennis Court #1", "Moscow St & Italy Ave San Francisco, CA"],
  ["Crocker Amazon Tennis Court #2", "Moscow St & Italy Ave San Francisco, CA"],
  [
    "Crocker Amazon Tennis Court #3 ONE HOUR SLOTS",
    "Moscow St & Italy Ave San Francisco, CA",
  ],
  ["Dolores Park Tennis Court #1", "3753 18th St San Francisco, CA"],
  ["Dolores Park Tennis Court #2", "3753 18th St San Francisco, CA"],
  [
    "Dolores Tennis Park Court #3 ONE HOUR SLOTS",
    "3753 18th St San Francisco, CA",
  ],
  ["DuPont Tennis Court #1", "30th Ave & Clement St San Francisco, CA"],
  ["DuPont Tennis Court #2", "30th Ave & Clement St San Francisco, CA"],
  ["DuPont Tennis Court #3", "30th Ave & Clement St San Francisco, CA"],
  [
    "DuPont Tennis Court #4 ONE HOUR SLOTS",
    "30th Ave & Clement St San Francisco, CA",
  ],
  ["Fulton Playground Tennis Court", "855 27th Ave San Francisco, CA"],
  [
    "Glen Park Rec Tennis Court #2 ONE HOUR SLOTS",
    "70 Elk St San Francisco, CA",
  ],
  ["Hamilton Rec Tennis Court #1", "1900 Geary Blvd San Francisco, CA"],
  ["Hamilton Rec Tennis Court #2", "1900 Geary Blvd San Francisco, CA"],
  ["J. P. Murphy Playground Tennis Court #1", "1960 9th Ave San Francisco, CA"],
  ["J. P. Murphy Playground Tennis Court #2", "1960 9th Ave San Francisco, CA"],
  ["J. P. Murphy Playground Tennis Court #3", "1960 9th Ave San Francisco, CA"],
  [
    "Jackson Playground Tennis Court",
    "17th St & Arkansas St San Francisco, CA",
  ],
  ["Joe DiMaggio Tennis Court #3", " 651 Lombard St San Francisco, CA"],
  [
    "Lafayette Tennis Court #1 ONE HOUR SLOTS",
    "Gough St & Sacramento St San Francisco, CA",
  ],
  ["Lafayette Tennis Court #2", "Gough St & Sacramento St San Francisco, CA"],
  ["Larsen Playground Tennis Court", "850 Vicente St San Francisco, CA"],
  [
    "McAteer Tennis Courts #1 at Stern Grove",
    "21st Ave & Sloat Blvd San Francisco, CA",
  ],
  [
    "McAteer Tennis Courts #2 at Stern Grove",
    "21st Ave & Sloat Blvd San Francisco, CA",
  ],
  ["McLaren Park Tennis Court #1", "1398 Mansell St San Francisco, CA"],
  ["McLaren Park Tennis Court #2", "1398 Mansell St San Francisco, CA"],
  ["McLaren Park Tennis Court #3", "1398 Mansell St San Francisco, CA"],
  ["McLaren Park Tennis Court #4", "1398 Mansell St San Francisco, CA"],
  ["McLaren Park Tennis Court #5", "1398 Mansell St San Francisco, CA"],
  ["McLaren Park Tennis Court #6", "1398 Mansell St San Francisco, CA"],
  [
    "Minnie & Lovie Ward Tennis Court #1",
    "650 Capitol Ave 650 San Francisco, CA",
  ],
  [
    "Minnie & Lovie Ward Tennis Court #2",
    "650 Capitol Ave 650 San Francisco, CA",
  ],
  ["Miraloma Park Tennis Court", "Omar & Sequoia Way San Francisco, CA"],
  ["Moscone Rec Tennis Court #1", "1800 Chestnut St San Francisco, CA"],
  ["Moscone Rec Tennis Court #2", "1800 Chestnut St San Francisco, CA"],
  ["Moscone Rec Tennis Court #3", "1800 Chestnut St San Francisco, CA"],
  [
    "Moscone Rec Tennis Court #4 ONE HOUR SLOTS",
    "1800 Chestnut St San Francisco, CA",
  ],
  [
    "Mountain Lake Park Tennis Court #1 ",
    "12th Ave & Lake St San Francisco, CA",
  ],
  [
    "Mountain Lake Park Tennis Court #2",
    "12th Ave & Lake St San Francisco, CA",
  ],
  [
    "Mountain Lake Park Tennis Court #3",
    "12th Ave & Lake St San Francisco, CA",
  ],
  [
    "Mountain Lake Park Tennis Court #4 ONE HOUR SLOTS",
    "12th Ave & Lake St San Francisco, CA",
  ],
  [
    "Parkside Square Tennis Court #1",
    "28th Ave & Vicente St San Francisco, CA",
  ],
  [
    "Parkside Square Tennis Court #2",
    "28th Ave & Vicente St San Francisco, CA",
  ],
  [
    "Parkside Square Tennis Court #3",
    "28th Ave & Vicente St San Francisco, CA",
  ],
  [
    "Parkside Square Tennis Court #4 ONE HOUR SLOTS",
    "28th Ave & Vicente St San Francisco, CA",
  ],
  ["Potrero Hill Rec Tennis Court #1", "801 Arkansas St San Francisco, CA"],
  [
    "Potrero Hill Rec Tennis Court #2 ONE HOUR SLOTS",
    "801 Arkansas St San Francisco, CA",
  ],
  [
    "Presidio Wall Playground Tennis Court #1",
    "West Pacific Ave & Spruce St San Francisco, CA",
  ],
  [
    "Presidio Wall Playground Tennis Court #2",
    "West Pacific Ave & Spruce St San Francisco, CA",
  ],
  [
    "Presidio Wall Playground Tennis Court #3",
    "West Pacific Ave & Spruce St San Francisco, CA",
  ],
  [
    "Presidio Wall Playground Tennis Court #4",
    "West Pacific Ave & Spruce St San Francisco, CA",
  ],
  ["Richmond Playground Tennis Courts", "18th Ave & Lake St San Francisco, CA"],
  [
    "Saint Mary's Playground Tennis Court #1",
    "145 Justin Dr San Francisco, CA",
  ],
  [
    "Saint Mary's Playground Tennis Court #2",
    "145 Justin Dr San Francisco, CA",
  ],
  ["Sunset Rec Tennis Court #1", "2201 Lawton St San Francisco, CA"],
  ["Sunset Rec Tennis Court #2", "2201 Lawton St San Francisco, CA"],
  ["Upper Noe Rec Tennis Court", "295 Day St San Francisco, CA"],
];

(async () => {
  const address_to_names = {};
  for (var i = 0; i < SPOTS.length; i++) {
    const [name, address] = SPOTS[i];

    const names = address_to_names[address] || [];
    names.push(name);
    address_to_names[address] = names;
  }

  const name_to_address_location_pair = {};
  for (const address in address_to_names) {
    const location = await geocode(address);

    for (const name of address_to_names[address]) {
      name_to_address_location_pair[name] = [address, location];
    }
  }

  console.log(name_to_address_location_pair);
})();
