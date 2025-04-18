import type { Resource } from "$lib/types";

export const handGlyphs = {
  0x1: "Confodere",
  0x2: "Vol Confodere",
  0x3: "Melio Confodere",
  0x4: "Secare",
  0x5: "Vol Secare",
  0x6: "Melio Secare",
  0x7: "Hasta",
  0x8: "Vol Hasta",
  0x9: "Melio Hasta",
  0xa: "Macir",
  0xb: "Vol Macir",
  0xc: "Melio Macir",
  0xd: "Arcus",
  0xe: "Vol Arcus",
  0xf: "Melio Arcus",
  0x10: "Ascia",
  0x11: "Vol Ascia",
  0x12: "Melio Ascia",
  0x13: "Falcis",
  0x14: "Vol Falcis",
  0x15: "Melio Falcis",
  0x16: "Culter",
  0x17: "Vol Culter",
  0x18: "Melio Culter",
  0x19: "Scutum",
  0x1a: "Vol Scutum",
  0x1b: "Melio Scutum",
  0x1c: "Redire",
  0x1d: "Cubus",
  0x1e: "Torpor",
  0x1f: "Lapiste",
  0x20: "Pneuma",
  0x21: "Ignis",
  0x22: "Vol Ignis",
  0x23: "Grando",
  0x24: "Vol Grando",
  0x25: "Fulgur",
  0x26: "Vol Fulgur",
  0x27: "Luminatio",
  0x28: "Vol Luminatio",
  0x29: "Umbra",
  0x2a: "Vol Umbra",
  0x2b: "Morbus",
  0x2c: "Nitesco",
  0x2d: "Acerbatus",
  0x2e: "Globus",
  0x2f: "Dextro Custos",
  0x30: "Sinestro Custos",
  0x31: "Dominus Hatred",
  0x32: "Dominus Anger",
  // 0x33: "???", // Unused
  // 0x34: "???", // Unused
  // 0x35: "???", // Unused
  // 0x36: "???", // Unused
};

export const backGlyphs = {
  0x1: "Magnes",
  0x2: "Paries",
  0x3: "Volaticus",
  0x4: "Rapidus Fio",
  0x5: "Vis Fio",
  0x6: "Fortis Fio",
  0x7: "Sapiens Fio",
  0x8: "Fides Fio",
  0x9: "Felicem Fio",
  0xa: "Inire Pecunia",
  0xb: "Arma Felix",
  0xc: "Arma Chiroptera",
  0xd: "Arma Machina",
  0xe: "Refectio",
  0xf: "Arma Custos",
  0x10: "Fidelis Caries",
  0x11: "Fidelis Alate",
  0x12: "Fidelis Polkir",
  0x13: "Fidelis Noctua",
  0x14: "Fidelis Medusa",
  0x15: "Fidelis Aranea",
  0x16: "Fidelis Mortus",
  0x17: "Dominus Agony",
  0x18: "Agartha",
};

export const items = {
  0x1: "Potion",
  0x2: "High Potion",
  0x3: "Super Potion",
  0x4: "Tonic",
  0x5: "High Tonic",
  0x6: "Super Tonic",
  0x7: "Heart Repair",
  0x8: "Magical Ticket",
  0x9: "Anti-Venom",
  0xa: "Uncurse Potion",
  0xb: "HP Max up",
  0xc: "MP Max up",
  0xd: "HEART Max Up",
  0xe: "Meat",
  0xf: "Tasty Meat",
  0x10: "Thick Steak",
  0x11: "Raw Killer Fish",
  0x12: "Rice Ball",
  0x13: "Mushroom",
  0x14: "Corn Soup",
  0x15: "Minestrone",
  0x16: "Curry",
  0x17: "Ramen Noodles",
  0x18: "Cream Puff",
  0x19: "Pudding",
  0x1a: "Mocha Eclair",
  0x1b: "Tart Tatin",
  0x1c: "Choco Souffle",
  0x1d: "Crepes Suzette",
  0x1e: "Croque Monsieur",
  0x1f: "Schnitzel",
  0x20: "Eisbein",
  0x21: "Killer Fish BBQ",
  0x22: "Salt",
  0x23: "Mint Sundae",
  0x24: "Milk",
  0x25: "Coffee",
  0x26: "Earl Grey",
  0x27: "Darjeeling Tea",
  0x28: "Red Drops",
  0x29: "Blue Drops",
  0x2a: "Green Drops",
  0x2b: "White Drops",
  0x2c: "Black Drops",
  0x2d: "Amanita",
  0x2e: "Rotten Meat",
  0x2f: "Spoiled Milk",
};

export const keyItems = {
  0x30: "Record 1",
  0x31: "Record 2",
  0x32: "Record 3",
  0x33: "Record 4",
  0x34: "Record 5",
  0x35: "Record 6",
  0x36: "Record 7",
  0x37: "Record 8",
  0x38: "Mouse",
  0x39: "Cat Collar",
  0x3a: "Camera",
  0x3b: "Photo 1",
  0x3c: "Photo 2",
  0x3d: "Photo 3",
  0x3e: "Poor Photo",
  0x3f: '"Frontier" Issue 1',
  0x40: '"Frontier" Issue 2',
  0x41: '"Frontier" Final',
  0x42: "Sketch Book",
  0x43: "Lighthouse Art",
  0x44: "Waterfall Art",
  0x45: "Church Art",
  0x46: "Horse Hair",
  0x47: "Eagle Feather",
  0x48: "Black Ink",
  0x49: "Cotton Thread",
  0x4a: "Silk Thread",
  0x4b: "Cashmere Thread",
  0x4c: "Sage",
  0x4d: "Chamomile",
  0x4e: "Rue",
  0x4f: "Mandrake Root",
  0x50: "Merman Meat",
  0x51: "Zircon",
  0x52: "Lapis Lazuli",
  0x53: "Chrysoberyl",
  0x54: "Ruby",
  0x55: "Sapphire",
  0x56: "Emerald",
  0x57: "Onyx",
  0x58: "Diamond",
  0x59: "Alexandrite",
  0x5a: "Copper Ore",
  0x5b: "Iron Ore",
  0x5c: "Silver Ore",
  0x5d: "Gold Ore",
  0x5e: "VIP Card",
  0x5f: "Konami Man",
  0x60: "Twinbee",
  0x61: "Vic Viper",
  0x62: "Phonograph",
  0x63: "Arthro Medal",
  0x64: "Skeleton Medal",
  0x65: "Brachyura Medal",
  0x66: "Maneater Medal",
  0x67: "Rusalka Medal",
  0x68: "Goliath Medal",
  0x69: "Gravedo Medal",
  0x6a: "Albus Medal",
  0x6b: "Barlowe Medal",
  0x6c: "Wallman Medal",
  0x6d: "Blackmore Medal",
  0x6e: "Eligor Medal",
  0x6f: "Death Medal",
  0x70: "Dracula Medal",
};

export const bodyGears = {
  0x1: "Casual Clothes",
  0x2: "Military Wear",
  0x3: "Rubber Suit",
  0x4: "Reinforced Suit",
  0x5: "Body Suit",
  0x6: "Leather Cuirass",
  0x7: "Copper Plate",
  0x8: "Iron Plate",
  0x9: "Silver Plate",
  0xa: "Gold Plate",
  0xb: "Platinum Plate",
  0xc: "Mirror Cuirass",
  0xd: "Heart Cuirass",
  0xe: "Barbarian Belt",
  0xf: "Knight Cuirass",
  0x10: "Crimson Mail",
  0x11: "Valkyrie Mail",
  0x12: "Minerva Mail",
  0x13: "Cotton Dress",
  0x14: "Silk Dress",
  0x15: "Sequined Dress",
  0x16: "Empire Dress",
  0x17: "Corset Dress",
  0x18: "Party Dress",
  0x19: "Wedding Dress",
  0x1a: "Robe Decollete",
};

export const headGears = {
  0x1: "Eye for Decay",
  0x2: "L. Eye of God",
  0x3: "R. Eye of Devil",
  0x4: "Cotton Hat",
  0x5: "Garbo Hat",
  0x6: "Treasure Hat",
  0x7: "Dowsing Hat",
  0x8: "Traveler's Hat",
  0x9: "Ribbon",
  0xa: "Cabriolet",
  0xb: "Babushka",
  0xc: "Caprine",
  0xd: "Crochet",
  0xe: "Barbarian Helm",
  0xf: "Knight Helm",
  0x10: "Crimson Mask",
  0x11: "Valkyrie Mask",
  0x12: "Minerva Mask",
  0x13: "Ruby Pins",
  0x14: "Sapphire Pins",
  0x15: "Emerald Pins",
  0x16: "Diamond Pins",
  0x17: "Onyx Pins",
  0x18: "Stephanie",
  0x19: "Royal Crown",
  0x1a: "Sword Helm",
  0x1b: "Rapier Helm",
  0x1c: "Lance Helm",
  0x1d: "Hammer Helm",
  0x1e: "Arrow Helm",
  0x1f: "Axe Helm",
  0x20: "Sickle Helm",
  0x21: "Knife Helm",
  0x22: "Shield Helm",
  0x23: "Queen of Hearts",
};

export const legGears = {
  0x1: "Moonwalkers",
  0x2: "Mercury Boots",
  0x3: "Winged Boots",
  0x4: "Combo Boots",
  0x5: "Sandals",
  0x6: "Sabrina Shoes",
  0x7: "Cossack Boots",
  0x8: "Baggy Boots",
  0x9: "Battle Boots",
  0xa: "Ghillie Boots",
  0xb: "Cavalier Boots",
  0xc: "Iron Leggings",
  0xd: "Silver Leggings",
  0xe: "Gold Leggings",
  0xf: "Plat Leggings",
  0x10: "Barbarian Shoes",
  0x11: "Knight Leggings",
  0x12: "Crimson Greaves",
  0x13: "Valkyrie Greaves",
  0x14: "Minerva Greaves",
};

export const accessories = {
  0x1: "Protect Ring",
  0x2: "Resist Ring",
  0x3: "Fool Ring",
  0x4: "Magician Ring",
  0x5: "Priestess Ring",
  0x6: "Empress Ring",
  0x7: "Emperor Ring",
  0x8: "Hierophant Ring",
  0x9: "Lovers Ring",
  0xa: "Chariot Ring",
  0xb: "Justice Ring",
  0xc: "Hermit Ring",
  0xd: "Fortune Ring",
  0xe: "Strength Ring",
  0xf: "Hanged Man Ring",
  0x10: "Death Ring",
  0x11: "Temperance Ring",
  0x12: "Devil Ring",
  0x13: "Tower Ring",
  0x14: "Star Ring",
  0x15: "Moon Ring",
  0x16: "Sun Ring",
  0x17: "Judgement Ring",
  0x18: "World Ring",
  0x19: "Archer Ring",
  0x1a: "Blow Ring",
  0x1b: "Wind Ring",
  0x1c: "Ruby Ring",
  0x1d: "Sapphire Ring",
  0x1e: "Emerald Ring",
  0x1f: "Diamond Ring",
  0x20: "Onyx Ring",
  0x21: "Heart Earrings",
  0x22: "Gold Ring",
  0x23: "Miser Ring",
  0x24: "Lucky Clover",
  0x25: "Thief Ring",
  0x26: "Master Ring",
};

export const inventory: Resource = {};

Object.entries({ ...items, ...keyItems }).forEach(([key, value]) => {
  inventory[parseInt(key) + 0x75] = value;
});

Object.entries(bodyGears).forEach(([key, value]) => {
  inventory[parseInt(key) + 0xe6] = value;
});

Object.entries(headGears).forEach(([key, value]) => {
  inventory[parseInt(key) + 0x101] = value;
});

Object.entries(legGears).forEach(([key, value]) => {
  inventory[parseInt(key) + 0x125] = value;
});

Object.entries(accessories).forEach(([key, value]) => {
  inventory[parseInt(key) + 0x13a] = value;
});
