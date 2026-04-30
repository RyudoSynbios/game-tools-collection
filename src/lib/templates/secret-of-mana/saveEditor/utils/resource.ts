import type { Resource } from "$lib/types";

const armorList = [
  { index: 0x1, type: 0x0, name: "Bandanna" },
  { index: 0x2, type: 0x0, name: "Hair Ribbon" },
  { index: 0x3, type: 0x0, name: "Rabite Cap" },
  { index: 0x4, type: 0x0, name: "Head Gear" },
  { index: 0x5, type: 0x0, name: "Quill Cap" },
  { index: 0x6, type: 0x0, name: "Steel Cap" },
  { index: 0x7, type: 0x0, name: "Golden Tiara" },
  { index: 0x8, type: 0x0, name: "Raccoon Cap" },
  { index: 0x9, type: 0x0, name: "Quilted Hood" },
  { index: 0xa, type: 0x0, name: "Tiger Cap" },
  { index: 0xb, type: 0x0, name: "Circlet" },
  { index: 0xc, type: 0x0, name: "Ruby Armet" },
  { index: 0xd, type: 0x0, name: "Unicorn Helm" },
  { index: 0xe, type: 0x0, name: "Dragon Helm" },
  { index: 0xf, type: 0x0, name: "Duck Helm" },
  { index: 0x10, type: 0x0, name: "Needle Helm" },
  { index: 0x11, type: 0x0, name: "Cockatrice Cap" },
  { index: 0x12, type: 0x0, name: "Amulet Helm" },
  { index: 0x13, type: 0x0, name: "Griffin Helm" },
  { index: 0x14, type: 0x0, name: "Faerie Crown" },
  { index: 0x16, type: 0x1, name: "Overalls" },
  { index: 0x17, type: 0x1, name: "Kung Fu Suit" },
  { index: 0x18, type: 0x1, name: "Midge Robe" },
  { index: 0x19, type: 0x1, name: "Chain Vest" },
  { index: 0x1a, type: 0x1, name: "Spiky Suit" },
  { index: 0x1b, type: 0x1, name: "Kung Fu Dress" },
  { index: 0x1c, type: 0x1, name: "Fancy Overalls" },
  { index: 0x1d, type: 0x1, name: "Chest Guard" },
  { index: 0x1e, type: 0x1, name: "Golden Vest" },
  { index: 0x1f, type: 0x1, name: "Ruby Vest" },
  { index: 0x20, type: 0x1, name: "Tiger Suit" },
  { index: 0x21, type: 0x1, name: "Tiger Bikini" },
  { index: 0x22, type: 0x1, name: "Magical Armor" },
  { index: 0x23, type: 0x1, name: "Tortoise Mail" },
  { index: 0x24, type: 0x1, name: "Flower Suit" },
  { index: 0x25, type: 0x1, name: "Battle Suit" },
  { index: 0x26, type: 0x1, name: "Vestguard" },
  { index: 0x27, type: 0x1, name: "Vampire Cape" },
  { index: 0x28, type: 0x1, name: "Power Suit" },
  { index: 0x29, type: 0x1, name: "Faerie Cloak" },
  { index: 0x2b, type: 0x2, name: "Faerie's Ring" },
  { index: 0x2c, type: 0x2, name: "Elbow Pad" },
  { index: 0x2d, type: 0x2, name: "Power Wrist" },
  { index: 0x2e, type: 0x2, name: "Cobra Bracelet" },
  { index: 0x2f, type: 0x2, name: "Wolf's Band" },
  { index: 0x30, type: 0x2, name: "Silver Band" },
  { index: 0x31, type: 0x2, name: "Golem Ring" },
  { index: 0x32, type: 0x2, name: "Frosty Ring" },
  { index: 0x33, type: 0x2, name: "Ivy Amulet" },
  { index: 0x34, type: 0x2, name: "Gold Bracelet" },
  { index: 0x35, type: 0x2, name: "Shield Ring" },
  { index: 0x36, type: 0x2, name: "Lazuri Ring" },
  { index: 0x37, type: 0x2, name: "Guardian Ring" },
  { index: 0x38, type: 0x2, name: "Gauntlet" },
  { index: 0x39, type: 0x2, name: "Ninja Gloves" },
  { index: 0x3a, type: 0x2, name: "Dragon Ring" },
  { index: 0x3b, type: 0x2, name: "Watcher Ring" },
  { index: 0x3c, type: 0x2, name: "Imp's Ring" },
  { index: 0x3d, type: 0x2, name: "Amulet Ring" },
  { index: 0x3e, type: 0x2, name: "Wristband" },
];

export const accessories: Resource = {};
export const armors: Resource = {};
export const helmets: Resource = {};

armorList.forEach((item) => {
  switch (item.type) {
    case 0x0:
      helmets[item.index] = item.name;
      break;
    case 0x1:
      armors[item.index] = item.name;
      break;
    case 0x2:
      accessories[item.index] = item.name;
      break;
  }
});

// prettier-ignore
export const locationList = [
  { index: 0x00, preview: 0x00, spawns: [0x5c]                      , name: "Potos Village" },
  { index: 0x01, preview: 0x01, spawns: [0x106]                     , name: "Neko's" },
  { index: 0x02, preview: 0x02, spawns: [0x96, 0x97, 0xa1]          , name: "Water Palace" },
  { index: 0x03, preview: 0x03, spawns: [0x6d]                      , name: "Pandora" },
  { index: 0x04, preview: 0x04, spawns: [0x63]                      , name: "Kippo Village" },
  { index: 0x05, preview: 0x1e, spawns: [0x17, 0xef]                , name: "Gaia's Navel" },
  { index: 0x06, preview: 0x06, spawns: [0x1d, 0xa8]                , name: "Haunted Forest" },
  { index: 0x07, preview: 0x05, spawns: [0xf8]                      , name: "Dwarf Village" },
  { index: 0x08, preview: 0x08, spawns: [0x13c]                     , name: "Witch's Castle" },
  { index: 0x09, preview: 0x09, spawns: [0x85, 0x1df, 0x1e5, 0x1e7] , name: "Moogle Village (Forest)"  },
  { index: 0x0a, preview: 0x09, spawns: [0x1f0, 0x1f9]              , name: "Moogle Village" },
  { index: 0x0b, preview: 0x0b, spawns: [0x109, 0x10a, 0x15c, 0x15d], name: "Wind Palace" },
  { index: 0x0c, preview: 0x0c, spawns: [0x252]                     , name: "Matango" },
  { index: 0x0d, preview: 0x0d, spawns: [0x199]                     , name: "Todo Village" },
  { index: 0x0e, preview: 0x1d, spawns: [0x203]                     , name: "Frosty Forest" },
  { index: 0x0f, preview: 0x0e, spawns: [0x1ae]                     , name: "Sandship" },
  { index: 0x10, preview: 0x0f, spawns: [0x18c]                     , name: "Kakkara" },
  { index: 0x11, preview: 0x10, spawns: [0xb5, 0xb6, 0xb8]          , name: "Southtown" },
  { index: 0x12, preview: 0x11, spawns: [0xc3, 0xc4, 0xc6]          , name: "Northtown" },
  { index: 0x13, preview: 0x15, spawns: [0x120, 0x123, 0x127]       , name: "Mountain Road" },
  { index: 0x14, preview: 0x14, spawns: [0xa3]                      , name: "Mandala" },
  { index: 0x15, preview: 0x12, spawns: [0x28d, 0x28e, 0x292, 0x293], name: "Gold City" },
  { index: 0x16, preview: 0x1a, spawns: [0x37b, 0x37e, 0x382]       , name: "Pure Land (Ice Dragon)" },
  { index: 0x17, preview: 0x1a, spawns: [0x391, 0x394, 0x398]       , name: "Pure Land (Fire Dragon)" },
  { index: 0x18, preview: 0x1a, spawns: [0x3a9, 0x3ac]              , name: "Pure Land (Thunder Dragon)" },
];

export const locations: Resource = {};

locationList.forEach((location) => {
  locations[location.index] = location.name;
});
