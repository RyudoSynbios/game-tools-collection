import { isInRange } from "$lib/utils/format";

import type { Resource, ResourceGroups } from "$lib/types";

const characterList = [
  { index: 0x0, name: "Mario" },
  { index: 0x1, name: "Toadstool" },
  { index: 0x2, name: "Bowser" },
  { index: 0x3, name: "Geno" },
  { index: 0x4, name: "Mallow" },
];

export const characters = characterList.reduce(
  (characters: Resource, character) => {
    characters[character.index] = character.name;

    return characters;
  },
  {},
);

const itemTypes = [
  { index: 0x0, name: "Weapons" },
  { index: 0x1, name: "Armor" },
  { index: 0x2, name: "Accessories" },
  { index: 0x3, name: "Recovery Items" },
  { index: 0x4, name: "Support Items" },
  { index: 0x5, name: "Battle Items" },
  { index: 0x6, name: "Miscellaneous" },
];

const itemList = [
  // { index: 0x00, type: 0x0, name: "Weapon" }, // Unused
  // { index: 0x01, type: 0x0, name: "Armor" }, // Unused
  // { index: 0x02, type: 0x0, name: "Accessory" }, // Unused
  // { index: 0x03, type: 0x0, name: "Space" }, // Unused
  // { index: 0x04, type: 0x0, name: "Space" }, // Unused
  { index: 0x05, type: 0x0, character: 0x0, name: "Hammer" },
  { index: 0x06, type: 0x0, character: 0x4, name: "Froggie Stick" },
  { index: 0x07, type: 0x0, character: 0x0, name: "NokNok Shell" },
  { index: 0x08, type: 0x0, character: 0x0, name: "Punch Glove" },
  { index: 0x09, type: 0x0, character: 0x3, name: "Finger Shot" },
  { index: 0x0a, type: 0x0, character: 0x4, name: "Cymbals" },
  { index: 0x0b, type: 0x0, character: 0x2, name: "Chomp" },
  { index: 0x0c, type: 0x0, character: 0x0, name: "Masher" },
  { index: 0x0d, type: 0x0, character: 0x2, name: "Chomp Shell" },
  { index: 0x0e, type: 0x0, character: 0x0, name: "Super Hammer" },
  { index: 0x0f, type: 0x0, character: 0x3, name: "Hand Gun" },
  { index: 0x10, type: 0x0, character: 0x4, name: "Whomp Glove" },
  { index: 0x11, type: 0x0, character: 0x1, name: "Slap Glove" },
  { index: 0x12, type: 0x0, character: 0x0, name: "Troopa Shell" },
  { index: 0x13, type: 0x0, character: 0x1, name: "Parasol" },
  { index: 0x14, type: 0x0, character: 0x2, name: "Hurly Gloves" },
  { index: 0x15, type: 0x0, character: 0x3, name: "Double Punch" },
  { index: 0x16, type: 0x0, character: 0x4, name: "Ribbit Stick" },
  { index: 0x17, type: 0x0, character: 0x2, name: "Spiked Link" },
  { index: 0x18, type: 0x0, character: 0x0, name: "Mega Glove" },
  { index: 0x19, type: 0x0, character: 0x1, name: "War Fan" },
  { index: 0x1a, type: 0x0, character: 0x3, name: "Hand Cannon" },
  { index: 0x1b, type: 0x0, character: 0x4, name: "Sticky Glove" },
  { index: 0x1c, type: 0x0, character: 0x0, name: "Ultra Hammer" },
  { index: 0x1d, type: 0x0, character: 0x1, name: "Super Slap" },
  { index: 0x1e, type: 0x0, character: 0x2, name: "Drill Claw" },
  { index: 0x1f, type: 0x0, character: 0x3, name: "Star Gun" },
  { index: 0x20, type: 0x0, character: 0x4, name: "Sonic Cymbal" },
  { index: 0x21, type: 0x0, character: 0x0, name: "Lazy Shell" },
  { index: 0x22, type: 0x0, character: 0x1, name: "Frying Pan" },
  { index: 0x23, type: 0x0, character: 0x0, name: "Hammer" },
  // { index: 0x24, type: 0x0, name: "Spare" }, // Unused
  { index: 0x25, type: 0x1, character: 0x0, name: "Shirt" },
  { index: 0x26, type: 0x1, character: 0x4, name: "Pants" },
  { index: 0x27, type: 0x1, character: 0x0, name: "Thick Shirt" },
  { index: 0x28, type: 0x1, character: 0x4, name: "Thick Pants" },
  { index: 0x29, type: 0x1, character: 0x0, name: "Mega Shirt" },
  { index: 0x2a, type: 0x1, character: 0x4, name: "Mega Pants" },
  { index: 0x2b, type: 0x1, character: 0x5, name: "Work Pants" },
  { index: 0x2c, type: 0x1, character: 0x3, name: "Mega Cape" },
  { index: 0x2d, type: 0x1, character: 0x0, name: "Happy Shirt" },
  { index: 0x2e, type: 0x1, character: 0x4, name: "Happy Pants" },
  { index: 0x2f, type: 0x1, character: 0x3, name: "Happy Cape" },
  { index: 0x30, type: 0x1, character: 0x2, name: "Happy Shell" },
  { index: 0x31, type: 0x1, character: 0x1, name: "Polka Dress" },
  { index: 0x32, type: 0x1, character: 0x0, name: "Sailor Shirt" },
  { index: 0x33, type: 0x1, character: 0x4, name: "Sailor Pants" },
  { index: 0x34, type: 0x1, character: 0x3, name: "Sailor Cape" },
  { index: 0x35, type: 0x1, character: 0x1, name: "Nautica Dress" },
  { index: 0x36, type: 0x1, character: 0x2, name: "Courage Shell" },
  { index: 0x37, type: 0x1, character: 0x0, name: "Fuzzy Shirt" },
  { index: 0x38, type: 0x1, character: 0x4, name: "Fuzzy Pants" },
  { index: 0x39, type: 0x1, character: 0x3, name: "Fuzzy Cape" },
  { index: 0x3a, type: 0x1, character: 0x1, name: "Fuzzy Dress" },
  { index: 0x3b, type: 0x1, character: 0x0, name: "Fire Shirt" },
  { index: 0x3c, type: 0x1, character: 0x4, name: "Fire Pants" },
  { index: 0x3d, type: 0x1, character: 0x3, name: "Fire Cape" },
  { index: 0x3e, type: 0x1, character: 0x2, name: "Fire Shell" },
  { index: 0x3f, type: 0x1, character: 0x1, name: "Fire Dress" },
  { index: 0x40, type: 0x1, character: 0x0, name: "Hero Shirt" },
  { index: 0x41, type: 0x1, character: 0x4, name: "Prince Pants" },
  { index: 0x42, type: 0x1, character: 0x3, name: "Star Cape" },
  { index: 0x43, type: 0x1, character: 0x2, name: "Heal Shell" },
  { index: 0x44, type: 0x1, character: 0x1, name: "Royal Dress" },
  { index: 0x45, type: 0x1, character: 0x5, name: "Super Suit" },
  { index: 0x46, type: 0x1, character: 0x5, name: "Lazy Shell" },
  // { index: 0x47, type: 0x1, name: "Spare" }, // Unused
  // { index: 0x48, type: 0x1, name: "Spare" }, // Unused
  // { index: 0x49, type: 0x1, name: "Spare" }, // Unused
  { index: 0x4a, type: 0x2, character: 0xff, name: "Zoom Shoes" },
  { index: 0x4b, type: 0x2, character: 0xff, name: "Safety Badge" },
  { index: 0x4c, type: 0x2, character: 0xff, name: "Jump Shoes" },
  { index: 0x4d, type: 0x2, character: 0xff, name: "Safety Ring" },
  { index: 0x4e, type: 0x2, character: 0xff, name: "Amulet" },
  { index: 0x4f, type: 0x2, character: 0xff, name: "Scrooge Ring" },
  { index: 0x50, type: 0x2, character: 0xff, name: "Exp. Booster" },
  { index: 0x51, type: 0x2, character: 0xff, name: "Attack Scarf" },
  { index: 0x52, type: 0x2, character: 0xff, name: "Rare Scarf" },
  { index: 0x53, type: 0x2, character: 0xff, name: "B'tub Ring" },
  { index: 0x54, type: 0x2, character: 0xff, name: "Antidote Pin" },
  { index: 0x55, type: 0x2, character: 0xff, name: "Wake Up Pin" },
  { index: 0x56, type: 0x2, character: 0xff, name: "Fearless Pin" },
  { index: 0x57, type: 0x2, character: 0xff, name: "Trueform Pin" },
  { index: 0x58, type: 0x2, character: 0xff, name: "Coin Trick" },
  { index: 0x59, type: 0x2, character: 0xff, name: "Ghost Medal" },
  { index: 0x5a, type: 0x2, character: 0xff, name: "Jinx Belt" },
  { index: 0x5b, type: 0x2, character: 0xff, name: "Feather" },
  { index: 0x5c, type: 0x2, character: 0xff, name: "Troopa Pin" },
  { index: 0x5d, type: 0x2, character: 0xff, name: "Signal Ring" },
  { index: 0x5e, type: 0x2, character: 0xff, name: "Quartz Charm" },
  // { index: 0x5f, type: 0x2, name: "Spare" }, // Unused
  { index: 0x60, type: 0x3, name: "Mushroom" },
  { index: 0x61, type: 0x3, name: "Mid Mushroom" },
  { index: 0x62, type: 0x3, name: "Max Mushroom" },
  { index: 0x63, type: 0x3, name: "Honey Syrup" },
  { index: 0x64, type: 0x3, name: "Maple Syrup" },
  { index: 0x65, type: 0x3, name: "Royal Syrup" },
  { index: 0x66, type: 0x3, name: "Pick Me Up" },
  { index: 0x67, type: 0x4, name: "Able Juice" },
  { index: 0x68, type: 0x4, name: "Bracer" },
  { index: 0x69, type: 0x4, name: "Energizer" },
  { index: 0x6a, type: 0x4, name: "Yoshi-Ade" },
  { index: 0x6b, type: 0x4, name: "Red Essence" },
  { index: 0x6c, type: 0x3, name: "Kerokero Cola" },
  { index: 0x6d, type: 0x5, name: "Yoshi Cookie" },
  { index: 0x6e, type: 0x5, name: "Pure Water" },
  { index: 0x6f, type: 0x5, name: "Sleepy Bomb" },
  { index: 0x70, type: 0x5, name: "Bad Mushroom" },
  { index: 0x71, type: 0x5, name: "Fire Bomb" },
  { index: 0x72, type: 0x5, name: "Ice Bomb" },
  { index: 0x73, type: 0x3, name: "Flower Tab" },
  { index: 0x74, type: 0x3, name: "Flower Jar" },
  { index: 0x75, type: 0x3, name: "Flower Box" },
  { index: 0x76, type: 0x3, name: "Yoshi Candy" },
  { index: 0x77, type: 0x3, name: "Froggie Drink" },
  { index: 0x78, type: 0x3, name: "Muku Cookie" },
  { index: 0x79, type: 0x3, name: "Elixir" },
  { index: 0x7a, type: 0x3, name: "Megalixir" },
  { index: 0x7b, type: 0x5, name: "See Ya" },
  { index: 0x7c, type: 0x7, name: "Temple Key" },
  { index: 0x7d, type: 0x5, name: "Goodie Bag" },
  { index: 0x7e, type: 0x5, name: "Earlier Times" },
  { index: 0x7f, type: 0x4, name: "Freshen Up" },
  { index: 0x80, type: 0x7, name: "RareFrogCoin" },
  { index: 0x81, type: 0x6, name: "Wallet" },
  { index: 0x82, type: 0x7, name: "Cricket Pie" },
  { index: 0x83, type: 0x5, name: "Rock Candy" },
  { index: 0x84, type: 0x7, name: "Castle Key 1" },
  // { index: 0x85, type: 0x5, name: "Debug Bomb" }, // Unused
  { index: 0x86, type: 0x7, name: "Castle Key 2" },
  { index: 0x87, type: 0x7, name: "Bambino Bomb" },
  { index: 0x88, type: 0x5, name: "Sheep Attack" },
  { index: 0x89, type: 0x6, name: "Carbo Cookie" },
  { index: 0x8a, type: 0x6, name: "Shiny Stone" },
  // { index: 0x8b, type: 0x6, name: "DUMMY" }, // Unused
  { index: 0x8c, type: 0x7, name: "Room Key" },
  { index: 0x8d, type: 0x7, name: "Elder Key" },
  { index: 0x8e, type: 0x7, name: "Shed Key" },
  { index: 0x8f, type: 0x5, name: "Lamb's Lure" },
  { index: 0x90, type: 0x5, name: "Fright Bomb" },
  { index: 0x91, type: 0x5, name: "Mystery Egg" },
  { index: 0x92, type: 0x7, name: "Beetle Box" },
  { index: 0x93, type: 0x7, name: "Beetle Box" },
  { index: 0x94, type: 0x5, name: "Lucky Jewel" },
  // { index: 0x95, type: 0x6, name: "DUMMY" }, // Unused
  { index: 0x96, type: 0x7, name: "Soprano Card" },
  { index: 0x97, type: 0x7, name: "Alto Card" },
  { index: 0x98, type: 0x7, name: "Tenor Card" },
  { index: 0x99, type: 0x4, name: "Crystalline" },
  { index: 0x9a, type: 0x4, name: "Power Blast" },
  { index: 0x9b, type: 0x3, name: "Wilt Shroom" },
  { index: 0x9c, type: 0x3, name: "Rotten Mush" },
  { index: 0x9d, type: 0x3, name: "Moldy Mush" },
  { index: 0x9e, type: 0x6, name: "Seed" },
  { index: 0x9f, type: 0x6, name: "Fertilizer" },
  { index: 0xa0, type: 0x6, name: "Waste Basket" },
  { index: 0xa1, type: 0x7, name: "Big Boo Flag" },
  { index: 0xa2, type: 0x7, name: "DryBonesFlag" },
  { index: 0xa3, type: 0x7, name: "Greaper Flag" },
  // { index: 0xa4, type: 0x6, name: "Secret Game" }, // Unused
  // { index: 0xa5, type: 0x5, name: "S.Crow Bomb" }, // Unused
  { index: 0xa6, type: 0x7, name: "Cricket Jam" },
  // { index: 0xa7, type: 0x5, name: "Bane Bomb" }, // Unused
  // { index: 0xa8, type: 0x5, name: "Doom Bomb" }, // Unused
  // { index: 0xa9, type: 0x5, name: "Fear Bomb" }, // Unused
  // { index: 0xaa, type: 0x5, name: "Sleep Bomb" }, // Unused
  // { index: 0xab, type: 0x5, name: "Mute Bomb" }, // Unused
  { index: 0xac, type: 0x6, name: "Fireworks" },
  // { index: 0xad, type: 0x5, name: "Bomb" }, // Unused
  { index: 0xae, type: 0x6, name: "Bright Card" },
  { index: 0xaf, type: 0x3, name: "Mushroom" },
  { index: 0xb0, type: 0x5, name: "Star Egg" },
];

export const accessories: Resource = {};
export const armors: Resource = {};
export const equipments: Resource = {};
export const items: Resource = {};
export const specialItems: Resource = {};
export const weapons: Resource = {};

export const armorsGroups: ResourceGroups = [
  ...characterList,
  { index: 0x5, name: "All" },
].map((type) => ({
  name: type.name,
  options: [],
}));
export const equipmentsGroups: ResourceGroups = itemTypes
  .filter((type) => isInRange(type.index, 0x0, 0x2))
  .map((type) => ({
    name: type.name,
    options: [],
  }));
export const itemsGroups: ResourceGroups = itemTypes
  .filter((type) => isInRange(type.index, 0x3, 0x6))
  .map((type) => ({
    name: type.name,
    options: [],
  }));
export const weaponsGroups: ResourceGroups = characterList.map((type) => ({
  name: type.name,
  options: [],
}));

export const equipmentsOrder: number[] = [0xff];

itemList.forEach((item) => {
  if (isInRange(item.type, 0x0, 0x2)) {
    equipments[item.index] = item.name;
    equipmentsGroups[item.type].options.push(item.index);
    equipmentsOrder.push(item.index);

    if (item.character !== undefined) {
      switch (item.type) {
        case 0x0:
          weapons[item.index] = item.name;
          weaponsGroups[item.character].options.push(item.index);
          break;
        case 0x1:
          armors[item.index] = item.name;
          armorsGroups[item.character].options.push(item.index);
          break;
        case 0x2:
          accessories[item.index] = item.name;
          break;
      }
    }
  } else if (isInRange(item.type, 0x3, 0x6)) {
    items[item.index] = item.name;
    itemsGroups[item.type - 0x3].options.push(item.index);
  } else {
    specialItems[item.index] = item.name;
  }
});

const areas = [
  { index: 0x00, name: "Mario's Pad" },
  { index: 0x01, name: "Mushroom Kingdom" },
  { index: 0x02, name: "Bandit's Way" },
  { index: 0x03, name: "Kero Sewers" },
  { index: 0x04, name: "Midas River" },
  { index: 0x05, name: "Tadpole Pond" },
  { index: 0x06, name: "Rose Town" },
  { index: 0x07, name: "Forest Maze" },
  { index: 0x08, name: "Yo'ster Isle" },
  { index: 0x09, name: "Moleville" },
  { index: 0x0a, name: "Booster Tower" },
  { index: 0x0b, name: "Marrymore" },
  { index: 0x0c, name: "Seaside Town" },
  { index: 0x0d, name: "Sea" },
  { index: 0x0e, name: "Sunken Ship" },
  { index: 0x0f, name: "Land's End" },
  { index: 0x10, name: "Monstro Town" },
  { index: 0x11, name: "Bean Valley" },
  { index: 0x12, name: "Nimbus Land" },
  { index: 0x13, name: "Barrel Volcano" },
  { index: 0x14, name: "Bowser's Keep" },
  { index: 0x15, name: "Factory" },
  { index: 0x16, name: "Miscellaneous" },
];

// prettier-ignore
export const locationList = [
  { index: 0x010, area: 0x00, preview: 0x08, coordinates: [10, 16], layers: [248,   9], name: "Mario's Pad" },
  { index: 0x1ed, area: 0x01, preview: 0x0a, coordinates: [11, 40], layers: [160,  33], name: "Mushroom Kingdom (Inn)" },
  { index: 0x031, area: 0x01, preview: 0x0a, coordinates: [11, 40], layers: [160,  33], name: "Mushroom Kingdom (Inn ~ Croco)" },
  { index: 0x1e5, area: 0x01, preview: 0x0a, coordinates: [11, 40], layers: [160,  33], name: "Mushroom Kingdom (Inn ~ Mack)" },
  { index: 0x148, area: 0x01, preview: 0x0b, coordinates: [ 6, 29], layers: [  8,  23], name: "Mushroom Kingdom (Castle ~ Mack)" },
  { index: 0x04c, area: 0x02, preview: 0x0b, coordinates: [12, 25], layers: [151,  17], name: "Bandit's Way" },
  { index: 0x03e, area: 0x03, preview: 0x0e, coordinates: [13, 43], layers: [224,  32], name: "Kero Sewers (Entrance)" },
  { index: 0x12d, area: 0x03, preview: 0x0e, coordinates: [18, 51], layers: [ 16,  34], name: "Kero Sewers (near Belome)" },
  { index: 0x043, area: 0x04, preview: 0x0f, coordinates: [46, 14], layers: [ 56,   8], name: "Midas River" },
  { index: 0x04a, area: 0x05, preview: 0x10, coordinates: [41, 15], layers: [ 56,   7], name: "Tadpole Pond" },
  { index: 0x060, area: 0x06, preview: 0x12, coordinates: [ 5, 21], layers: [125,  12], name: "Rose Town" },
  { index: 0x05f, area: 0x06, preview: 0x12, coordinates: [ 5, 21], layers: [125,  12], name: "Rose Town (Bowyer)" },
  { index: 0x0e3, area: 0x07, preview: 0x13, coordinates: [22, 12], layers: [216,   4], name: "Forest Maze" },
  { index: 0x021, area: 0x08, preview: 0x34, coordinates: [10,  6], layers: [ 24,   0], name: "Yo'ster Isle" },
  { index: 0x151, area: 0x09, preview: 0x18, coordinates: [ 3,  6], layers: [ 72, 255], name: "Moleville" },
  { index: 0x120, area: 0x09, preview: 0x36, coordinates: [43, 53], layers: [140,  47], name: "Coal Mines" },
  { index: 0x0c9, area: 0x0a, preview: 0x1a, coordinates: [59, 60], layers: [239,  51], name: "Booster Tower (Part 1)" },
  { index: 0x0c7, area: 0x0a, preview: 0x1a, coordinates: [47, 39], layers: [ 88,  32], name: "Booster Tower (Part 2)" },
  { index: 0x007, area: 0x0b, preview: 0x1c, coordinates: [11, 24], layers: [184,  17], name: "Marrymore (Hotel)" },
  { index: 0x099, area: 0x0b, preview: 0x1c, coordinates: [37,  6], layers: [216, 255], name: "Marrymore (Chapel)" },
  { index: 0x131, area: 0x0c, preview: 0x20, coordinates: [ 9, 19], layers: [160,  12], name: "Seaside Town" },
  { index: 0x0d1, area: 0x0c, preview: 0x20, coordinates: [ 9, 19], layers: [160,  12], name: "Seaside Town (Yaridovich)" },
  { index: 0x084, area: 0x0d, preview: 0x21, coordinates: [19, 54], layers: [ 96,  42], name: "Sea" },
  { index: 0x0a4, area: 0x0e, preview: 0x22, coordinates: [27,  6], layers: [ 40, 255], name: "Sunken Ship (Entrance)" },
  { index: 0x0b0, area: 0x0e, preview: 0x22, coordinates: [37,  5], layers: [192, 253], name: "Sunken Ship (Middle)" },
  { index: 0x0b8, area: 0x0e, preview: 0x22, coordinates: [55, 60], layers: [  0,  51], name: "Sunken Ship (near Johnny)" },
  { index: 0x089, area: 0x0f, preview: 0x2b, coordinates: [ 4, 16], layers: [178,   8], name: "Land's End (Entrance)" },
  { index: 0x08d, area: 0x0f, preview: 0x2b, coordinates: [ 8, 22], layers: [143,  14], name: "Land's End (Middle)" },
  { index: 0x13d, area: 0x0f, preview: 0x2b, coordinates: [11,  8], layers: [119,   1], name: "Land's End (Desert)" },
  { index: 0x107, area: 0x0f, preview: 0x2b, coordinates: [15, 44], layers: [  0,  33], name: "Land's End (Undeground)" },
  { index: 0x144, area: 0x10, preview: 0x26, coordinates: [45, 44], layers: [201,  34], name: "Monstro Town" },
  { index: 0x0fb, area: 0x11, preview: 0x2d, coordinates: [14,  5], layers: [  0,   0], name: "Bean Valley" },
  { index: 0x157, area: 0x12, preview: 0x31, coordinates: [ 9, 41], layers: [152,  32], name: "Nimbus Land (Inn)" },
  { index: 0x070, area: 0x12, preview: 0x31, coordinates: [39,  5], layers: [192, 254], name: "Nimbus Land (Castle Entrance)" },
  { index: 0x19e, area: 0x12, preview: 0x31, coordinates: [57, 37], layers: [176,  30], name: "Nimbus Land (Castle)" },
  { index: 0x19b, area: 0x12, preview: 0x31, coordinates: [23, 60], layers: [120,  53], name: "Nimbus Land (near Castle Throne)" },
  { index: 0x16e, area: 0x13, preview: 0x32, coordinates: [27, 32], layers: [143,  20], name: "Barrel Volcano Volcano (Middle)" },
  { index: 0x183, area: 0x13, preview: 0x32, coordinates: [10, 11], layers: [ 47,   5], name: "Barrel Volcano Volcano (near Hino Mart)" },
  { index: 0x1c4, area: 0x14, preview: 0x04, coordinates: [25, 43], layers: [120,  36], name: "Bowser's Keep (Main Hall)" },
  { index: 0x1c0, area: 0x14, preview: 0x04, coordinates: [ 6, 21], layers: [159,  12], name: "Bowser's Keep (near Magikoopa)" },
  { index: 0x0dc, area: 0x15, preview: 0x37, coordinates: [24, 29], layers: [216,  12], name: "Factory (Part 1)" },
  { index: 0x0ed, area: 0x15, preview: 0x37, coordinates: [29, 15], layers: [176,   8], name: "Factory (Part 2)" },
  { index: 0x1b1, area: 0x15, preview: 0x37, coordinates: [ 7, 54], layers: [224,  36], name: "Factory (Part 3)" },
  { index: 0x1fc, area: 0x15, preview: 0x37, coordinates: [29, 15], layers: [152,   8], name: "Factory (Part 4)" },
  { index: 0x1d8, area: 0x15, preview: 0x37, coordinates: [11, 48], layers: [104,  36], name: "Factory (near Smithy)" },
  { index: 0x000, area: 0x16, preview: 0x00, coordinates: [10, 16], layers: [248,   9], name: "Debug Map" },
]

export const locations: Resource = {};
export const locationsGroups: ResourceGroups = areas.map((area) => ({
  name: area.name,
  options: [],
}));
export const locationsOrder: number[] = [];

locationList.forEach((location) => {
  locations[location.index] = location.name;
  locationsGroups[location.area].options.push(location.index);
  locationsOrder.push(location.index);
});
