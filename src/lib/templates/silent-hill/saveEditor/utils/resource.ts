import type { Resource, ResourceGroups } from "$lib/types";

export const buttonActions = [
  "Enter",
  "Cancel",
  "Skip",
  "Action",
  "AIM",
  "Light",
  "Run",
  "View",
  "Step L",
  "Step R",
  "Pause",
  "Item",
  "Map",
  "Option",
];

export const itemTypes = [
  { index: 0x0, name: "Medicines" },
  { index: 0x1, name: "Weapons" },
  { index: 0x2, name: "Ammo" },
  { index: 0x3, name: "Items" },
  { index: 0x4, name: "Key Items" },
  { index: 0x5, name: "Extra Items" },
];

// prettier-ignore
export const itemList = [
  { index: 0x20, type: 0x0, name: "Health drink" },
  { index: 0x21, type: 0x0, name: "First aid kit" },
  { index: 0x22, type: 0x0, name: "Ampoule" },
  { index: 0xa0, type: 0x1, name: "Handgun" },
  { index: 0x80, type: 0x1, name: "Kitchen knife"         , obtainedFlag:   67 },
  { index: 0x81, type: 0x1, name: "Steel pipe"            , obtainedFlag:  193 },
  { index: 0x86, type: 0x1, name: "Katana"                , obtainedFlag:   88 },
  { index: 0xa2, type: 0x1, name: "Shotgun"               , obtainedFlag:  127 },
  { index: 0x85, type: 0x1, name: "Chainsaw"              , obtainedFlag:   95 },
  { index: 0x82, type: 0x1, name: "Rock drill"            , obtainedFlag:   96 },
  { index: 0x84, type: 0x1, name: "Hammer"                , obtainedFlag:  321 },
  { index: 0x87, type: 0x1, name: "Axe"                   , obtainedFlag:  342 },
  { index: 0xa1, type: 0x1, name: "Hunting rifle"         , obtainedFlag:  360 },
  { index: 0xa3, type: 0x1, name: "Hyper Blaster"         , obtainedFlag: 1852 },
  { index: 0xc0, type: 0x2, name: "Handgun bullets" },
  { index: 0xc2, type: 0x2, name: "Shotgun shells" },
  { index: 0xc1, type: 0x2, name: "Rifle shells" },
  { index: 0xe0, type: 0x3, name: "Flashlight"            , obtainedFlag:   68 },
  { index: 0xe1, type: 0x3, name: "Pocket radio"          , obtainedFlag:   69 },
  { index: 0x53, type: 0x4, name: 'A note "To school"'    , obtainedFlag:  179, usedFlag:  258 },
  { index: 0x54, type: 0x4, name: 'A note "Doghouse"'     , obtainedFlag:  180, usedFlag:  181 },
  { index: 0x41, type: 0x4, name: "House key"             , obtainedFlag:  181, usedFlag:  185 },
  { index: 0x42, type: 0x4, name: 'Key of "Lion"'         , obtainedFlag:  182, usedFlag:  186 },
  { index: 0x43, type: 0x4, name: 'Key of "Woodman"'      , obtainedFlag:  183, usedFlag:  187 },
  { index: 0x44, type: 0x4, name: 'Key of "Scarecrow"'    , obtainedFlag:  184, usedFlag:  188 },
  { index: 0x60, type: 0x4, name: "Chemical"              , obtainedFlag:  100, usedFlag:  106 },
  { index: 0x61, type: 0x4, name: "Gold medallion"        , obtainedFlag:  101, usedFlag:  103 },
  { index: 0x62, type: 0x4, name: "Silver medallion"      , obtainedFlag:  102, usedFlag:  104 },
  { index: 0x63, type: 0x4, name: "Rubber ball"           , obtainedFlag:  142, usedFlag:  143 },
  { index: 0x55, type: 0x4, name: "Picture card"          , obtainedFlag:  125, usedFlag: 1239 },
  { index: 0x45, type: 0x4, name: "Library reserve key"   , obtainedFlag:  140, usedFlag: 1343 },
  { index: 0x46, type: 0x4, name: "Classroom key"         , obtainedFlag:  146, usedFlag: 1333 },
  { index: 0x47, type: 0x4, name: "K. Gordon key"         , obtainedFlag:  169, usedFlag:  194 },
  { index: 0x64, type: 0x4, name: '"Flauros"'             , obtainedFlag:  209, usedFlag:  483 },
  { index: 0x48, type: 0x4, name: "Drawbridge key"        , obtainedFlag:  210, usedFlag:  196 },
  { index: 0x49, type: 0x4, name: "Basement key"          , obtainedFlag:  241, usedFlag:  242 },
  { index: 0x65, type: 0x4, name: "Plastic bottle"        , obtainedFlag:  237, usedFlag:  238 },
  { index: 0x66, type: 0x4, name: "Unknown liquid"        , obtainedFlag:  238, usedFlag:  480 },
  { index: 0x67, type: 0x4, name: 'Plate of "Turtle"'     , obtainedFlag:  274, usedFlag:  297 },
  { index: 0x68, type: 0x4, name: 'Plate of "Hatter"'     , obtainedFlag:  275, usedFlag:  302 },
  { index: 0x69, type: 0x4, name: 'Plate of "Cat"'        , obtainedFlag:  276, usedFlag:  307 },
  { index: 0x6a, type: 0x4, name: 'Plate of "Queen"'      , obtainedFlag:  273, usedFlag:  312 },
  { index: 0x6b, type: 0x4, name: "Blood pack"            , obtainedFlag:  281, usedFlag:  282 },
  { index: 0x6d, type: 0x4, name: "Lighter"               , obtainedFlag:  284, usedFlag:  316 },
  { index: 0x6c, type: 0x4, name: "Disinfecting alcohol"  , obtainedFlag:  283, usedFlag:  315 },
  { index: 0x4a, type: 0x4, name: "Basement storeroom key", obtainedFlag:  287, usedFlag:  288 },
  { index: 0x6e, type: 0x4, name: "Video tape"            , obtainedFlag:  285 },
  { index: 0x4b, type: 0x4, name: "Examination room key"  , obtainedFlag:  289, usedFlag:  290 },
  { index: 0x4c, type: 0x4, name: "Antique shop key"      , obtainedFlag:  328, usedFlag:  222 },
  { index: 0x4d, type: 0x4, name: "Sewer key"             , obtainedFlag:  385, usedFlag: 1403 },
  { index: 0x57, type: 0x4, name: "Sewer exit key"        , obtainedFlag:  386, usedFlag: 1423 },
  { index: 0x70, type: 0x4, name: "Kaufmann key"          , obtainedFlag:  412, usedFlag:  426 },
  { index: 0x71, type: 0x4, name: "Receipt"               , obtainedFlag:  412 },
  { index: 0x72, type: 0x4, name: "Safe key"              , obtainedFlag:  408, usedFlag:  428 },
  { index: 0x73, type: 0x4, name: "Magnet"                , obtainedFlag:  418, usedFlag:  422 },
  { index: 0x74, type: 0x4, name: "Motorcycle key"        , obtainedFlag:  422, usedFlag:  427 },
  { index: 0x77, type: 0x4, name: "Screwdriver"           , obtainedFlag:  555, usedFlag:  518 },
  { index: 0x76, type: 0x4, name: "Pliers"                , obtainedFlag:  554, usedFlag:  522 },
  { index: 0x4e, type: 0x4, name: 'Key of "Ophiel"'       , obtainedFlag:  557, usedFlag:  562 },
  { index: 0x4f, type: 0x4, name: 'Key of "Hagith"'       , obtainedFlag:  558, usedFlag:  563 },
  { index: 0x50, type: 0x4, name: 'Key of "Phaleg"'       , obtainedFlag:  559, usedFlag:  564 },
  { index: 0x51, type: 0x4, name: 'Key of "Bethor"'       , obtainedFlag:  560, usedFlag:  565 },
  { index: 0x52, type: 0x4, name: 'Key of "Aratron"'      , obtainedFlag:  561, usedFlag:  566 },
  { index: 0x7a, type: 0x4, name: "Stone of time"         , obtainedFlag:  553, usedFlag:  595 },
  { index: 0x79, type: 0x4, name: "Ring of contract"      , obtainedFlag:  552, usedFlag:  584 },
  { index: 0x78, type: 0x4, name: "Camera"                , obtainedFlag:  551 },
  { index: 0x75, type: 0x4, name: "Bird cage key"         , obtainedFlag:  556, usedFlag:  523 },
  { index: 0x40, type: 0x4, name: "Lobby key" },
  { index: 0x7b, type: 0x4, name: "Amulet of Solomon"     , obtainedFlag:  567, usedFlag:  572 },
  { index: 0x7c, type: 0x4, name: "Crest of Mercury"      , obtainedFlag:  568, usedFlag:  573 },
  { index: 0x7d, type: 0x4, name: "Ankh"                  , obtainedFlag:  569, usedFlag:  574 },
  { index: 0x7e, type: 0x4, name: "Dagger of Melchior"    , obtainedFlag:  570, usedFlag:  575 },
  { index: 0x7f, type: 0x4, name: "Disk of Ouroboros"     , obtainedFlag:  571, usedFlag:  576 },
  { index: 0x58, type: 0x5, name: "Channeling stone"      , obtainedFlag:  176 },
  { index: 0xe2, type: 0x5, name: "Gasoline tank"         , obtainedFlag:   92 },
];

export const items: Resource = {};
export const itemsGroups: ResourceGroups = itemTypes.map((type) => ({
  name: type.name,
  options: [],
}));
export const itemsOrder: number[] = [];

itemList.forEach((item) => {
  items[item.index] = item.name;
  itemsGroups[item.type].options.push(item.index);
  itemsOrder.push(item.index);
});

export const areas = [
  { index: 0x0, name: "Residential area" },
  { index: 0x1, name: "Midwich Elementary School" },
  { index: 0x2, name: "Shopping district" },
  { index: 0x3, name: "Alchemilla Hospital" },
  { index: 0x4, name: "Sewers" },
  { index: 0x5, name: "Resort area" },
  { index: 0x6, name: "Nowhere" },
  { index: 0x7, name: "Miscellaneous" },
];

// prettier-ignore
export const locationList = [
  { index: 0x0124, area: 0x0, preview: 0x01, map: 0x01, coordinates: [  18802, 1089051], orientation:  900, name: "Cafe 5 to 2" },
  { index: 0x0203, area: 0x0, preview: 0x03, map: 0x01, coordinates: [-599645,   84879], orientation: 3940, name: "Convenience store" },
  { index: 0x0a25, area: 0x0, preview: 0x05, map: 0x01, coordinates: [ 484485,  887289], orientation: 2640, name: "Levin street house" },
  { index: 0x0202, area: 0x0, preview: 0x02, map: 0x01, coordinates: [-409803,   90912], orientation: 3360, name: "School bus" },
  { index: 0x0309, area: 0x1, preview: 0x04, map: 0x06, coordinates: [ 251386,  576053], orientation: 1340, name: "Infirmary" },
  { index: 0x0509, area: 0x1, preview: 0x04, map: 0x0a, coordinates: [ 244147,  580819], orientation: 1240, name: "Infirmary (Nightmare)" },
  { index: 0x0a26, area: 0x0, preview: 0x06, map: 0x01, coordinates: [ 473937, 1223797], orientation:  674, name: "K. Gordon house" },
  { index: 0x0b01, area: 0x0, preview: 0x07, map: 0x01, coordinates: [  75627,   56067], orientation: 3875, name: "Church" },
  { index: 0x0204, area: 0x0, preview: 0x08, map: 0x01, coordinates: [-730965,   87783], orientation:  456, name: "Garage" },
  { index: 0x0a28, area: 0x0, preview: 0x12, map: 0x01, coordinates: [-181722, 1415990], orientation: 1544, name: "Bridge control room" },
  { index: 0x0e10, area: 0x2, preview: 0x09, map: 0x02, coordinates: [-249911,   79493], orientation: 4080, name: "Police station" },
  { index: 0x1001, area: 0x3, preview: 0x0a, map: 0x11, coordinates: [ 106354,  594554], orientation: 1970, name: "Reception" },
  { index: 0x122b, area: 0x3, preview: 0x0b, map: 0x17, coordinates: [-240044, -244460], orientation:  426, name: "Room 302 (Nightmare)" },
  { index: 0x130b, area: 0x3, preview: 0x0c, map: 0x15, coordinates: [ 418203,  240452], orientation: 1096, name: "Director's office (Nightmare)" },
  { index: 0x170a, area: 0x2, preview: 0x0f, map: 0x02, coordinates: [ 748638,  251592], orientation: 1246, name: "Antique shop" },
  { index: 0x170b, area: 0x2, preview: 0x0f, map: 0x03, coordinates: [  93297,  249163], orientation:  800, name: "Antique shop (Nightmare)" },
  { index: 0x1915, area: 0x2, preview: 0x0d, map: 0x03, coordinates: [ 889110, - 91402], orientation: 2028, name: "Jewelry shop" },
  { index: 0x0e0f, area: 0x2, preview: 0x09, map: 0x03, coordinates: [-419079,  234255], orientation: 3216, name: "Police station (Nightmare)" },
  { index: 0x1a01, area: 0x3, preview: 0x0a, map: 0x15, coordinates: [ 435873,  594554], orientation: 2128, name: "Reception (Nightmare)" },
  { index: 0x1d05, area: 0x4, preview: 0x15, map: 0x0d, coordinates: [ 167101, -202148], orientation: 3960, name: "Sewer (Entrance)" },
  { index: 0x1d0e, area: 0x4, preview: 0x15, map: 0x0e, coordinates: [-356021, -422981], orientation: 1430, name: "Sewer (Exit)" },
  { index: 0x1f12, area: 0x5, preview: 0x0e, map: 0x04, coordinates: [ 555145,   86498], orientation:    0, name: "Annie's bar" },
  { index: 0x2008, area: 0x5, preview: 0x13, map: 0x04, coordinates: [ 238181,  254275], orientation: 4046, name: "Norman's motel" },
  { index: 0x2213, area: 0x5, preview: 0x11, map: 0x04, coordinates: [- 80855,  247250], orientation:  672, name: "Boat" },
  { index: 0x2315, area: 0x5, preview: 0x14, map: 0x04, coordinates: [- 78461, - 84524], orientation: 1700, name: "Lighthouse" },
  { index: 0x2504, area: 0x5, preview: 0x10, map: 0x00, coordinates: [- 55372, -113439], orientation: 2095, name: "Amusement park" },
  { index: 0x2701, area: 0x6, preview: 0x16, map: 0x00, coordinates: [  66169, -576168], orientation: 3135, name: "Examination room (Nowhere)" },
  { index: 0x2808, area: 0x6, preview: 0x16, map: 0x00, coordinates: [- 70511, -241165], orientation: 1135, name: "Antique shop (Nowhere)" },
  { index: 0x2921, area: 0x6, preview: 0x17, map: 0x00, coordinates: [ 242603, -407472], orientation: 4020, name: "Child's room" },
  { index: 0x0100, area: 0x7, preview: 0x18, map: 0x01, coordinates: [      0,       0], orientation:    0, name: "Next fear" },
];

export const locations: Resource = {};
export const locationsGroups: ResourceGroups = [];

areas.forEach((area) => {
  locationsGroups.push({ name: area.name, options: [] });
});

locationList.forEach((location) => {
  locations[location.index] = location.name;
  locationsGroups[location.area].options.push(location.index);
});
