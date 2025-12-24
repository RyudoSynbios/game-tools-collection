import { Resource, ResourceGroups } from "$lib/types";

export const characterList = [
  { index: 0x0, name: "Squall", reportBit: 0 },
  { index: 0x1, name: "Zell", reportBit: 5 },
  { index: 0x2, name: "Irvine", reportBit: 10 },
  { index: 0x3, name: "Quistis", reportBit: 6 },
  { index: 0x4, name: "Rinoa", reportBit: 9 },
  { index: 0x5, name: "Selphie", reportBit: 8 },
  { index: 0x6, name: "Seifer", reportBit: 7 },
  { index: 0x7, name: "Edea", reportBit: 11 },
];

export const characters = characterList.reduce(
  (characters: Resource, character) => {
    characters[character.index] = character.name;

    return characters;
  },
  {},
);

export const angeloAbilityList = [
  { index: 0x0, name: "Angelo Rush", points: 10 },
  { index: 0x1, name: "Angelo Recover", points: 30 },
  { index: 0x2, name: "Angelo Reverse", points: 40 },
  { index: 0x3, name: "Angelo Search", points: 60 },
  { index: 0x4, name: "Angelo Cannon", points: 80 },
  { index: 0x5, name: "Angelo Strike", points: 120 },
  { index: 0x6, name: "Invincible Moon", points: 140 },
  { index: 0x7, name: "Wishing Star", points: 160 },
];

export const angeloAbilities = angeloAbilityList.reduce(
  (abilities: Resource, ability) => {
    abilities[ability.index] = ability.name;

    return abilities;
  },
  {},
);

export const gfAbilityList = [
  { index: 0x1, name: "HP-J", type: 0x0, ap: 50 },
  { index: 0x2, name: "Str-J", type: 0x0, ap: 50 },
  { index: 0x3, name: "Vit-J", type: 0x0, ap: 50 },
  { index: 0x4, name: "Mag-J", type: 0x0, ap: 50 },
  { index: 0x5, name: "Spr-J", type: 0x0, ap: 50 },
  { index: 0x6, name: "Spd-J", type: 0x0, ap: 120 },
  { index: 0x7, name: "Eva-J", type: 0x0, ap: 200 },
  { index: 0x8, name: "Hit-J", type: 0x0, ap: 120 },
  { index: 0x9, name: "Luck-J", type: 0x0, ap: 200 },
  { index: 0xa, name: "Elem-Atk-J", type: 0x0, ap: 160 },
  { index: 0xb, name: "ST-Atk-J", type: 0x0, ap: 160 },
  { index: 0xc, name: "Elem-Def-J", type: 0x0, ap: 100 },
  { index: 0xd, name: "ST-Def-J", type: 0x0, ap: 100 },
  { index: 0xe, name: "Elem-Defx2", type: 0x0, ap: 130 },
  { index: 0xf, name: "Elem-Defx4", type: 0x0, ap: 180 },
  { index: 0x10, name: "ST-Def-Jx2", type: 0x0, ap: 130 },
  { index: 0x11, name: "ST-Def-Jx4", type: 0x0, ap: 180 },
  { index: 0x12, name: "Abilityx3", type: 0x0, ap: 150 },
  { index: 0x13, name: "Abilityx4", type: 0x0, ap: 200 },
  { index: 0x14, name: "Magic", type: 0x1, ap: 1 },
  { index: 0x15, name: "GF", type: 0x1, ap: 1 },
  { index: 0x16, name: "Draw", type: 0x1, ap: 1 },
  { index: 0x17, name: "Item", type: 0x1, ap: 1 },
  { index: 0x18, name: "Empty", type: 0x1, ap: 250 },
  { index: 0x19, name: "Card", type: 0x1, ap: 40 },
  { index: 0x1a, name: "Doom", type: 0x1, ap: 60 },
  { index: 0x1b, name: "Mad Rush", type: 0x1, ap: 60 },
  { index: 0x1c, name: "Treatment", type: 0x1, ap: 100 },
  { index: 0x1d, name: "Defend", type: 0x1, ap: 100 },
  { index: 0x1e, name: "Darkside", type: 0x1, ap: 100 },
  { index: 0x1f, name: "Recover", type: 0x1, ap: 200 },
  { index: 0x20, name: "Absorb", type: 0x1, ap: 80 },
  { index: 0x21, name: "Revive", type: 0x1, ap: 200 },
  { index: 0x22, name: "LV Down", type: 0x1, ap: 100 },
  { index: 0x23, name: "LV Up", type: 0x1, ap: 100 },
  { index: 0x24, name: "Kamikaze", type: 0x1, ap: 100 },
  { index: 0x25, name: "Devour", type: 0x1, ap: 100 },
  { index: 0x26, name: "MiniMog", type: 0x1, ap: 100 },
  { index: 0x27, name: "HP+20%", type: 0x2, ap: 60 },
  { index: 0x28, name: "HP+40%", type: 0x2, ap: 120 },
  { index: 0x29, name: "HP+80%", type: 0x2, ap: 240 },
  { index: 0x2a, name: "Str+20%", type: 0x2, ap: 60 },
  { index: 0x2b, name: "Str+40%", type: 0x2, ap: 120 },
  { index: 0x2c, name: "Str+60%", type: 0x2, ap: 240 },
  { index: 0x2d, name: "Vit+20%", type: 0x2, ap: 60 },
  { index: 0x2e, name: "Vit+40%", type: 0x2, ap: 120 },
  { index: 0x2f, name: "Vit+60%", type: 0x2, ap: 240 },
  { index: 0x30, name: "Mag+20%", type: 0x2, ap: 60 },
  { index: 0x31, name: "Mag+40%", type: 0x2, ap: 120 },
  { index: 0x32, name: "Mag+60%", type: 0x2, ap: 240 },
  { index: 0x33, name: "Spr+20%", type: 0x2, ap: 60 },
  { index: 0x34, name: "Spr+40%", type: 0x2, ap: 120 },
  { index: 0x35, name: "Spr+60%", type: 0x2, ap: 240 },
  { index: 0x36, name: "Spd+20%", type: 0x2, ap: 150 },
  { index: 0x37, name: "Spd+40%", type: 0x2, ap: 200 },
  { index: 0x38, name: "Eva+30%", type: 0x2, ap: 150 },
  { index: 0x39, name: "Luck+50%", type: 0x2, ap: 200 },
  { index: 0x3a, name: "Mug", type: 0x2, ap: 200 },
  { index: 0x3b, name: "Med Data", type: 0x2, ap: 200 },
  { index: 0x3c, name: "Counter", type: 0x2, ap: 200 },
  { index: 0x3d, name: "Return Damage", type: 0x2, ap: 250 },
  { index: 0x3e, name: "Cover", type: 0x2, ap: 100 },
  { index: 0x3f, name: "Initiative", type: 0x2, ap: 160 },
  { index: 0x40, name: "Move-HP Up", type: 0x2, ap: 200 },
  { index: 0x41, name: "HP Bonus", type: 0x2, ap: 100 },
  { index: 0x42, name: "Str Bonus", type: 0x2, ap: 100 },
  { index: 0x43, name: "Vit Bonus", type: 0x2, ap: 100 },
  { index: 0x44, name: "Mag Bonus", type: 0x2, ap: 100 },
  { index: 0x45, name: "Spr Bonus", type: 0x2, ap: 100 },
  { index: 0x46, name: "Auto-Protect", type: 0x2, ap: 250 },
  { index: 0x47, name: "Auto-Shell", type: 0x2, ap: 250 },
  { index: 0x48, name: "Auto-Reflect", type: 0x2, ap: 250 },
  { index: 0x49, name: "Auto-Haste", type: 0x2, ap: 250 },
  { index: 0x4a, name: "Auto-Potion", type: 0x2, ap: 150 },
  { index: 0x4b, name: "Expendx2-1", type: 0x2, ap: 250 },
  { index: 0x4c, name: "Expendx3-1", type: 0x2, ap: 250 },
  { index: 0x4d, name: "Ribbon", type: 0x2, ap: 1 },
  { index: 0x4e, name: "Alert", type: 0x3, ap: 200 },
  { index: 0x4f, name: "Move-Find", type: 0x3, ap: 40 },
  { index: 0x50, name: "Enc-Half", type: 0x3, ap: 30 },
  { index: 0x51, name: "Enc-None", type: 0x3, ap: 100 },
  { index: 0x52, name: "Rare Item", type: 0x3, ap: 250 },
  { index: 0x53, name: "SumMag+10%", type: 0x4, ap: 40 },
  { index: 0x54, name: "SumMag+20%", type: 0x4, ap: 70 },
  { index: 0x55, name: "SumMag+30%", type: 0x4, ap: 140 },
  { index: 0x56, name: "SumMag+40%", type: 0x4, ap: 200 },
  { index: 0x57, name: "GFHP+10%", type: 0x4, ap: 40 },
  { index: 0x58, name: "GFHP+20%", type: 0x4, ap: 70 },
  { index: 0x59, name: "GFHP+30%", type: 0x4, ap: 140 },
  { index: 0x5a, name: "GFHP+40%", type: 0x4, ap: 200 },
  { index: 0x5b, name: "Boost", type: 0x4, ap: 10 },
  { index: 0x5c, name: "Haggle", type: 0x5, ap: 150 },
  { index: 0x5d, name: "Sell-High", type: 0x5, ap: 150 },
  { index: 0x5e, name: "Familiar", type: 0x5, ap: 150 },
  { index: 0x5f, name: "Call Shop", type: 0x5, ap: 200 },
  { index: 0x60, name: "Junk Shop", type: 0x5, ap: 150 },
  { index: 0x61, name: "T Mag-RF", type: 0x5, ap: 30 },
  { index: 0x62, name: "I Mag-RF", type: 0x5, ap: 30 },
  { index: 0x63, name: "F Mag-RF", type: 0x5, ap: 30 },
  { index: 0x64, name: "L Mag-RF", type: 0x5, ap: 30 },
  { index: 0x65, name: "Time Mag-RF", type: 0x5, ap: 30 },
  { index: 0x66, name: "ST Mag-RF", type: 0x5, ap: 30 },
  { index: 0x67, name: "Supt Mag-RF", type: 0x5, ap: 30 },
  { index: 0x68, name: "Forbid Mag-RF", type: 0x5, ap: 30 },
  { index: 0x69, name: "Recov Med-RF", type: 0x5, ap: 30 },
  { index: 0x6a, name: "ST Med-RF", type: 0x5, ap: 30 },
  { index: 0x6b, name: "Ammo-RF", type: 0x5, ap: 30 },
  { index: 0x6c, name: "Tool-RF", type: 0x5, ap: 30 },
  { index: 0x6d, name: "Forbid Med-RF", type: 0x5, ap: 200 },
  { index: 0x6e, name: "GFRecov Med-RF", type: 0x5, ap: 30 },
  { index: 0x6f, name: "GFAbl Med-RF", type: 0x5, ap: 30 },
  { index: 0x70, name: "Mid Mag-RF", type: 0x5, ap: 60 },
  { index: 0x71, name: "High Mag-RF", type: 0x5, ap: 60 },
  { index: 0x72, name: "Med LV Up", type: 0x5, ap: 120 },
  { index: 0x73, name: "Card Mod", type: 0x5, ap: 80 },
];

export const characterAbilities: Resource = {};
export const commandAbilities: Resource = {};
export const gfAbilities: Resource = {};

gfAbilityList.forEach((ability) => {
  gfAbilities[ability.index] = ability.name;

  switch (ability.type) {
    case 0x1:
      commandAbilities[ability.index] = ability.name;
      break;
    case 0x2:
    case 0x3:
      characterAbilities[ability.index] = ability.name;
      break;
  }
});

export const learnableAbilities = [
  // Quezacotl
  [
    0x53, 0x54, 0x55, 0x57, 0x58, 0x5b, 0x61, 0x70, 0x01, 0x30, 0x31, 0x0a,
    0x03, 0x0c, 0x0e, 0x19, 0x73, 0x04, 0x17, 0x14, 0x15,
  ],
  // Shiva
  [
    0x53, 0x54, 0x55, 0x57, 0x58, 0x17, 0x5b, 0x62, 0x03, 0x2d, 0x2e, 0x33,
    0x34, 0x0c, 0x0e, 0x02, 0x0a, 0x1a, 0x05, 0x14, 0x15,
  ],
  // Ifrit
  [
    0x53, 0x54, 0x55, 0x57, 0x58, 0x59, 0x5b, 0x63, 0x6b, 0x2a, 0x2b, 0x0a,
    0x42, 0x01, 0x17, 0x0c, 0x0e, 0x1b, 0x02, 0x14, 0x15,
  ],
  // Siren
  [
    0x57, 0x58, 0x6c, 0x53, 0x54, 0x55, 0x5b, 0x64, 0x6a, 0x30, 0x31, 0x0b,
    0x44, 0x17, 0x0d, 0x10, 0x1c, 0x4f, 0x04, 0x14, 0x15,
  ],
  // Brothers
  [
    0x53, 0x54, 0x55, 0x57, 0x58, 0x59, 0x5b, 0x27, 0x28, 0x29, 0x41, 0x02,
    0x0a, 0x05, 0x0c, 0x17, 0x3e, 0x1d, 0x01, 0x14, 0x15,
  ],
  // Diablos
  [
    0x57, 0x58, 0x59, 0x65, 0x66, 0x01, 0x27, 0x28, 0x29, 0x04, 0x30, 0x31,
    0x17, 0x08, 0x50, 0x51, 0x1e, 0x3a, 0x12, 0x14, 0x15,
  ],
  // Carbuncle
  [
    0x57, 0x58, 0x59, 0x69, 0x2d, 0x2e, 0x43, 0x01, 0x27, 0x28, 0x04, 0x0b,
    0x0d, 0x10, 0x3c, 0x48, 0x17, 0x12, 0x03, 0x14, 0x15,
  ],
  // Leviathan
  [
    0x57, 0x58, 0x59, 0x53, 0x54, 0x55, 0x5b, 0x67, 0x6e, 0x33, 0x34, 0x45,
    0x05, 0x0e, 0x04, 0x0a, 0x4a, 0x1f, 0x17, 0x14, 0x15,
  ],
  // Pandemona
  [
    0x53, 0x54, 0x55, 0x57, 0x58, 0x59, 0x5b, 0x06, 0x36, 0x37, 0x2a, 0x2b,
    0x02, 0x0c, 0x0e, 0x0a, 0x3f, 0x20, 0x17, 0x14, 0x15,
  ],
  // Cerberus
  [
    0x57, 0x58, 0x59, 0x06, 0x36, 0x37, 0x49, 0x05, 0x0d, 0x10, 0x11, 0x0b,
    0x12, 0x02, 0x4e, 0x04, 0x4b, 0x08, 0x17, 0x14, 0x15,
  ],
  // Alexander
  [
    0x57, 0x58, 0x59, 0x53, 0x54, 0x55, 0x5b, 0x3b, 0x72, 0x33, 0x34, 0x71,
    0x12, 0x0a, 0x0e, 0x0f, 0x05, 0x21, 0x17, 0x14, 0x15,
  ],
  // Doomtrain
  [
    0x53, 0x54, 0x55, 0x56, 0x57, 0x58, 0x59, 0x5a, 0x5b, 0x47, 0x20, 0x1e,
    0x60, 0x6d, 0x0f, 0x11, 0x17, 0x0a, 0x0b, 0x14, 0x15,
  ],
  // Bahamut
  [
    0x53, 0x54, 0x55, 0x56, 0x57, 0x58, 0x59, 0x5a, 0x5b, 0x3a, 0x4b, 0x46,
    0x17, 0x52, 0x40, 0x2c, 0x32, 0x68, 0x13, 0x14, 0x15,
  ],
  // Cactuar
  [
    0x57, 0x58, 0x59, 0x17, 0x07, 0x38, 0x4b, 0x09, 0x39, 0x1d, 0x4a, 0x3f,
    0x41, 0x42, 0x43, 0x44, 0x45, 0x40, 0x24, 0x14, 0x15,
  ],
  // Tonberry
  [
    0x53, 0x54, 0x55, 0x57, 0x58, 0x59, 0x5b, 0x4a, 0x40, 0x3f, 0x39, 0x17,
    0x38, 0x5c, 0x5d, 0x5e, 0x5f, 0x22, 0x23, 0x14, 0x15,
  ],
  // Eden
  [
    0x53, 0x54, 0x55, 0x56, 0x57, 0x58, 0x59, 0x5a, 0x5b, 0x6f, 0x1e, 0x1b,
    0x08, 0x06, 0x07, 0x39, 0x4c, 0x25, 0x17, 0x14, 0x15,
  ],
];

export const commonCards = [
  { index: 0x0, name: "Geezard" },
  { index: 0x1, name: "Funguar" },
  { index: 0x2, name: "Bite Bug" },
  { index: 0x3, name: "Red Bat" },
  { index: 0x4, name: "Blobra" },
  { index: 0x5, name: "Gayla" },
  { index: 0x6, name: "Gesper" },
  { index: 0x7, name: "Fastitocalon-F" },
  { index: 0x8, name: "Blood Soul" },
  { index: 0x9, name: "Caterchipillar" },
  { index: 0xa, name: "Cockatrice" },
  { index: 0xb, name: "Grat" },
  { index: 0xc, name: "Buel" },
  { index: 0xd, name: "Mesmerize" },
  { index: 0xe, name: "Glacial Eye" },
  { index: 0xf, name: "Belhelmel" },
  { index: 0x10, name: "Thrustaevis" },
  { index: 0x11, name: "Anacondaur" },
  { index: 0x12, name: "Creeps" },
  { index: 0x13, name: "Grendel" },
  { index: 0x14, name: "Jelleye" },
  { index: 0x15, name: "Grand Mantis" },
  { index: 0x16, name: "Forbidden" },
  { index: 0x17, name: "Armadodo" },
  { index: 0x18, name: "Tri-Face" },
  { index: 0x19, name: "Fastitocalon" },
  { index: 0x1a, name: "Snow Lion" },
  { index: 0x1b, name: "Ochu" },
  { index: 0x1c, name: "SAM08G" },
  { index: 0x1d, name: "Death Claw" },
  { index: 0x1e, name: "Cactuar" },
  { index: 0x1f, name: "Tonberry" },
  { index: 0x20, name: "Abyss Worm" },
  { index: 0x21, name: "Turtapod" },
  { index: 0x22, name: "Vysage" },
  { index: 0x23, name: "T-Rexaur" },
  { index: 0x24, name: "Bomb" },
  { index: 0x25, name: "Blitz" },
  { index: 0x26, name: "Wendigo" },
  { index: 0x27, name: "Torama" },
  { index: 0x28, name: "Imp" },
  { index: 0x29, name: "Blue Dragon" },
  { index: 0x2a, name: "Adamantoise" },
  { index: 0x2b, name: "Hexadragon" },
  { index: 0x2c, name: "Iron Giant" },
  { index: 0x2d, name: "Behemoth" },
  { index: 0x2e, name: "Chimera" },
  { index: 0x2f, name: "PuPu" },
  { index: 0x30, name: "Elastoid" },
  { index: 0x31, name: "GIM47N" },
  { index: 0x32, name: "Malboro" },
  { index: 0x33, name: "Ruby Dragon" },
  { index: 0x34, name: "Elnoyle" },
  { index: 0x35, name: "Tonberry King" },
  { index: 0x36, name: "Wedge, Biggs" },
  { index: 0x37, name: "Fujin, Raijin" },
  { index: 0x38, name: "Elvoret" },
  { index: 0x39, name: "X-ATM092" },
  { index: 0x3a, name: "Granaldo" },
  { index: 0x3b, name: "Gerogero" },
  { index: 0x3c, name: "Iguion" },
  { index: 0x3d, name: "Abadon" },
  { index: 0x3e, name: "Trauma" },
  { index: 0x3f, name: "Oilboyle" },
  { index: 0x40, name: "Shumi Tribe" },
  { index: 0x41, name: "Krysta" },
  { index: 0x42, name: "Propagator" },
  { index: 0x43, name: "Jumbo Cactuar" },
  { index: 0x44, name: "Tri-Point" },
  { index: 0x45, name: "Gargantua" },
  { index: 0x46, name: "Mobile Type 8" },
  { index: 0x47, name: "Sphinxara" },
  { index: 0x48, name: "Tiamat" },
  { index: 0x49, name: "BGH251F2" },
  { index: 0x4a, name: "Red Giant" },
  { index: 0x4b, name: "Catoblepas" },
  { index: 0x4c, name: "Ultima Weapon" },
];

export const uniqueCards = [
  { index: 0x0, name: "Chubby Chocobo" },
  { index: 0x1, name: "Angelo" },
  { index: 0x2, name: "Gilgamesh" },
  { index: 0x3, name: "MiniMog" },
  { index: 0x4, name: "Chicobo" },
  { index: 0x5, name: "Quezacotl" },
  { index: 0x6, name: "Shiva" },
  { index: 0x7, name: "Ifrit" },
  { index: 0x8, name: "Siren" },
  { index: 0x9, name: "Sacred" },
  { index: 0xa, name: "Minotaur" },
  { index: 0xb, name: "Carbuncle" },
  { index: 0xc, name: "Diablos" },
  { index: 0xd, name: "Leviathan" },
  { index: 0xe, name: "Odin" },
  { index: 0xf, name: "Pandemona" },
  { index: 0x10, name: "Cerberus" },
  { index: 0x11, name: "Alexander" },
  { index: 0x12, name: "Phoenix" },
  { index: 0x13, name: "Bahamut" },
  { index: 0x14, name: "Doomtrain" },
  { index: 0x15, name: "Eden" },
  { index: 0x16, name: "Ward" },
  { index: 0x17, name: "Kiros" },
  { index: 0x18, name: "Laguna" },
  { index: 0x19, name: "Selphie" },
  { index: 0x1a, name: "Quistis" },
  { index: 0x1b, name: "Irvine" },
  { index: 0x1c, name: "Zell" },
  { index: 0x1d, name: "Rinoa" },
  { index: 0x1e, name: "Edea" },
  { index: 0x1f, name: "Seifer" },
  { index: 0x20, name: "Squall" },
];

// prettier-ignore
export const locationList: {
  [key: number]: {
    preview: number;
    coordinates: [number, number, number];
    discs: number[];
    name: string;
    group: number;
    order: (number | undefined)[];
  };
} = {
  0x000: { preview: 0x00, coordinates: [24565, -29180,  -626], discs: [1, 2, 3, 4], group: 0x1 , order: [ 1,  1,  1,  1], name: "World Map" },
  0x05f: { preview: 0x00, coordinates: [ -570,   -575,     0], discs: [2, 3, 4]   , group: 0x0 , order: [  ,  0,  0,  0], name: "Start Disc" },
  0x06e: { preview: 0x54, coordinates: [  425,   -315,    44], discs: [1, 2, 3]   , group: 0x2 , order: [ 7, 13,  7,   ], name: "Balamb Hotel" },
  0x075: { preview: 0x53, coordinates: [  370,    410,    76], discs: [2]         , group: 0x2 , order: [  , 14,   ,   ], name: "Balamb- The Dincht's" },
  0x0a5: { preview: 0x46, coordinates: [ -690,  -8550,     8], discs: [1, 2, 3]   , group: 0x3 , order: [ 1,  8,  2,   ], name: "B-Garden- Hall" },
  0x0cd: { preview: 0x44, coordinates: [ -770,  -1690,   204], discs: [2, 3]      , group: 0x3 , order: [  , 12,  6,   ], name: "B-Garden- MD Level" },
  0x0da: { preview: 0x4e, coordinates: [ -995,   4360,    30], discs: [1, 2, 3]   , group: 0x3 , order: [ 6, 11,  5,   ], name: "B-Garden- Training Center" },
  0x0ed: { preview: 0x48, coordinates: [ -190,    270,    32], discs: [1]         , group: 0x3 , order: [ 2,   ,   ,   ], name: "B-Garden- Dormitory Double" },
  0x0f3: { preview: 0x48, coordinates: [ -105,    250,    32], discs: [1]         , group: 0x3 , order: [ 3,   ,   ,   ], name: "B-Garden- Dormitory Double (night)" },
  0x0f5: { preview: 0x49, coordinates: [  -50,    720,    41], discs: [1, 2, 3]   , group: 0x3 , order: [4 ,  9,  3,   ], name: "B-Garden- Dormitory Single" },
  0x0f6: { preview: 0x49, coordinates: [   75,    660,    41], discs: [1, 2, 3]   , group: 0x3 , order: [5 , 10,  4,   ], name: "B-Garden- Dormitory Single (night)" },
  0x109: { preview: 0x59, coordinates: [ -100,   -125,    83], discs: [1]         , group: 0x4 , order: [11,   ,   ,   ], name: "Train" },
  0x126: { preview: 0xda, coordinates: [-3730,    140,   100], discs: [3]         , group: 0x5 , order: [  ,   , 25,   ], name: "Deep Sea Deposit (top)" },
  0x12b: { preview: 0xda, coordinates: [-1235,    850,    20], discs: [3]         , group: 0x5 , order: [  ,   , 26,   ], name: "Deep Sea Deposit (bottom)" },
  0x135: { preview: 0x63, coordinates: [  320,  -1470,    23], discs: [1]         , group: 0x6 , order: [ 9,   ,   ,   ], name: "Dollet- Comm Tower (before Elvoret)" },
  0x136: { preview: 0x63, coordinates: [  320,  -1470,    23], discs: [1]         , group: 0x6 , order: [10,   ,   ,   ], name: "Dollet- Comm Tower (after Elvoret)" },
  0x13b: { preview: 0x5d, coordinates: [-1155,   -705,   113], discs: [1]         , group: 0x6 , order: [ 8,   ,   ,   ], name: "Dollet- Town Square (SeeD mission)" },
  0x13c: { preview: 0x5d, coordinates: [-1155,   -705,   113], discs: [1, 2, 3]   , group: 0x6 , order: [18, 20, 11,   ], name: "Dollet- Town Square" },
  0x13e: { preview: 0x61, coordinates: [ -535,    470,    86], discs: [1, 2, 3]   , group: 0x6 , order: [16, 18,  9,   ], name: "Dollet Hotel" },
  0x150: { preview: 0x60, coordinates: [  700,    990,     3], discs: [1, 2, 3]   , group: 0x6 , order: [17, 19, 10,   ], name: "Dollet Pub" },
  0x15d: { preview: 0xb5, coordinates: [  120,  -1075,    31], discs: [4]         , group: 0x7 , order: [  ,   ,   ,  4], name: "Lunatic Pandora (near Adel)" },
  0x165: { preview: 0xb6, coordinates: [  150,    335,    51], discs: [1]         , group: 0x8 , order: [19,   ,   ,   ], name: "Centra- Excavation Site (past)" },
  0x17c: { preview: 0xb5, coordinates: [ -580,  -2370,   272], discs: [3, 4]      , group: 0x7 , order: [  ,   , 40,  2], name: "Lunatic Pandora (near Ragnarok)" },
  0x191: { preview: 0xb5, coordinates: [  720,  -1740,     8], discs: [3, 4]      , group: 0x7 , order: [  ,   , 41,  3], name: "Lunatic Pandora (near Seifer)" },
  0x1bc: { preview: 0x9f, coordinates: [  300,  -1600,    48], discs: [3]         , group: 0x9 , order: [  ,   , 32,   ], name: "Esthar- City (near Highway)" },
  0x1c7: { preview: 0x9f, coordinates: [   60,   4735,    90], discs: [3]         , group: 0x9 , order: [  ,   , 31,   ], name: "Esthar- City" },
  0x1c8: { preview: 0x9f, coordinates: [   60,   4735,    90], discs: [3]         , group: 0x9 , order: [  ,   , 39,   ], name: "Esthar- City (after Ragnarok)" },
  0x1da: { preview: 0xb2, coordinates: [ -530,   1975,   195], discs: [3]         , group: 0xa , order: [  ,   , 29,   ], name: "Lunatic Pandora Laboratory (past)" },
  0x1dc: { preview: 0xb2, coordinates: [ -530,   1975,   195], discs: [3]         , group: 0xa , order: [  ,   , 33,   ], name: "Lunatic Pandora Laboratory" },
  0x1dd: { preview: 0xb2, coordinates: [ -530,   1975,   195], discs: [3]         , group: 0xa , order: [  ,   , 34,   ], name: "Lunatic Pandora Laboratory (after Ragnarok)" },
  0x208: { preview: 0x9d, coordinates: [  390,  -1940,    61], discs: [3]         , group: 0xb , order: [  ,   , 28,   ], name: "Great Salt Lake" },
  0x211: { preview: 0xa7, coordinates: [ -345,    252,    20], discs: [3]         , group: 0xa , order: [  ,   , 30,   ], name: "Dr. Odine's Laboratory- Lobby" },
  0x232: { preview: 0xf5, coordinates: [  290,   -545,    94], discs: [4]         , group: 0xc , order: [  ,   ,   ,  7], name: "Ultimecia Castle- Clock Tower" },
  0x247: { preview: 0xf6, coordinates: [  590,   6030,     7], discs: [4]         , group: 0xc , order: [  ,   ,   ,  8], name: "Ultimecia Castle- Master Room" },
  0x254: { preview: 0xf8, coordinates: [ -440,  -2630,   160], discs: [4]         , group: 0xc , order: [  ,   ,   ,  6], name: "Ultimecia Castle" },
  0x264: { preview: 0x92, coordinates: [ 1925,   -380,    24], discs: [2, 3]      , group: 0xd , order: [  ,  7, 19,   ], name: "Fishermans Horizon" },
  0x288: { preview: 0x8c, coordinates: [  315,   -320,    44], discs: [2]         , group: 0xe , order: [  ,  2,   ,   ], name: "Winhill - Vacant House (past)" },
  0x289: { preview: 0x8c, coordinates: [  315,   -320,    44], discs: [2, 3]      , group: 0xe , order: [  , 32, 23,   ], name: "Winhill - Vacant House" },
  0x2aa: { preview: 0x72, coordinates: [ -370,   2255,    15], discs: [1, 2]      , group: 0xf , order: [22, 35,   ,   ], name: "G-Garden- Hallway" },
  0x2ad: { preview: 0x71, coordinates: [  800,  -2135,   136], discs: [1, 2]      , group: 0xf , order: [20, 33,   ,   ], name: "G-Garden- Hall (1F)" },
  0x2b4: { preview: 0x71, coordinates: [ 1510,   2730,    81], discs: [1, 2]      , group: 0xf , order: [21, 34,   ,   ], name: "G-Garden- Hall (2F)" },
  0x2ca: { preview: 0x78, coordinates: [ 1185,  -2440,    46], discs: [2]         , group: 0xf , order: [  , 36,   ,   ], name: "G-Garden- Master Room" },
  0x2d6: { preview: 0x7f, coordinates: [ -500,    450,    97], discs: [1, 2, 3]   , group: 0x10, order: [27, 25, 16,   ], name: "Deling City- Caraway's Mansion" },
  0x2d7: { preview: 0x86, coordinates: [ -300,     64,    44], discs: [1]         , group: 0x10, order: [29,   ,   ,   ], name: "Deling City- Sewer" },
  0x2dd: { preview: 0x84, coordinates: [ -535,    680,    46], discs: [1, 2, 3]   , group: 0x10, order: [30, 27, 18,   ], name: "Deling City- Gateway" },
  0x2e0: { preview: 0x82, coordinates: [ -375,    490,    84], discs: [1, 2, 3]   , group: 0x10, order: [26, 24, 15,   ], name: "Deling City- Hotel" },
  0x2eb: { preview: 0x7e, coordinates: [-4840, -29720, 15424], discs: [1, 2, 3]   , group: 0x10, order: [28, 26, 17,   ], name: "Deling- Presidential Residence" },
  0x30a: { preview: 0x89, coordinates: [  391,    555,    31], discs: [2]         , group: 0x11, order: [  ,  5,   ,   ], name: "Galbadia Missile Base (entrance)" },
  0x30d: { preview: 0x89, coordinates: [ -879,   -140,   157], discs: [2]         , group: 0x11, order: [  ,  6,   ,   ], name: "Galbadia Missile Base (missile launchers room)" },
  0x314: { preview: 0x91, coordinates: [ -400,    630,    26], discs: [1, 2, 3]   , group: 0x12, order: [24, 22, 13,   ], name: "Tomb of the Unknown King (Sacred room)" },
  0x316: { preview: 0x91, coordinates: [  280,    570,    29], discs: [1, 2, 3]   , group: 0x12, order: [25, 23, 14,   ], name: "Tomb of the Unknown King (water wheel room)" },
  0x318: { preview: 0x91, coordinates: [ 1790,  -3735,    53], discs: [1, 2, 3]   , group: 0x12, order: [23, 21, 12,   ], name: "Tomb of the Unknown King (entrance)" },
  0x31b: { preview: 0x87, coordinates: [-2090,   1070,    39], discs: [2]         , group: 0x13, order: [  ,  3,   ,   ], name: "Galbadia D-District Prison" },
  0x330: { preview: 0x87, coordinates: [ 1580,    250,    72], discs: [2]         , group: 0x13, order: [  ,  4,   ,   ], name: "Galbadia D-District Prison (top)" },
  0x339: { preview: 0xd5, coordinates: [  220,   -420,    21], discs: [3]         , group: 0x14, order: [  ,   , 37,   ], name: "Ragnarok- Air Room" },
  0x346: { preview: 0xd3, coordinates: [ -330,   2160,     3], discs: [3]         , group: 0x14, order: [  ,   , 38,   ], name: "Ragnarok- Hangar" },
  0x34f: { preview: 0xd8, coordinates: [ -920,   -180,    13], discs: [3]         , group: 0x5 , order: [  ,   , 24,   ], name: "Deep Sea Research Center- Lb" },
  0x351: { preview: 0xcd, coordinates: [ -775,   1480,    41], discs: [2, 3]      , group: 0x15, order: [  , 28, 27,   ], name: "White SeeD Ship" },
  0x363: { preview: 0xdc, coordinates: [  525,   -850,    21], discs: [3]         , group: 0x16, order: [  ,   , 35,   ], name: "Lunar Base- Medical Room" },
  0x366: { preview: 0xdd, coordinates: [  230,  -1140,    21], discs: [3]         , group: 0x16, order: [  ,   , 36,   ], name: "Lunar Base- Pod" },
  0x378: { preview: 0xc2, coordinates: [ -460,    -20,    69], discs: [2, 3]      , group: 0x17, order: [  , 29, 20,   ], name: "T-Garden- Classroom" },
  0x37e: { preview: 0x67, coordinates: [  250,   -300,    85], discs: [1]         , group: 0x18, order: [12,   ,   ,   ], name: "Timber- Forest Owls' Base" },
  0x381: { preview: 0x65, coordinates: [ -190,    -80,    85], discs: [1, 2]      , group: 0x18, order: [15, 17,   ,   ], name: "Timber- City Square" },
  0x384: { preview: 0x69, coordinates: [ -340,   -485,    41], discs: [1, 2, 3]   , group: 0x18, order: [13, 15,  8,   ], name: "Timber Hotel" },
  0x39b: { preview: 0x65, coordinates: [  950,   1380,    50], discs: [1, 2]      , group: 0x18, order: [14, 16,   ,   ], name: "Timber- City Square (station)" },
  0x3ab: { preview: 0xcb, coordinates: [  540,    130,    37], discs: [2, 3]      , group: 0x19, order: [  , 30, 21,   ], name: "Shumi Village- Hotel" },
  0x3af: { preview: 0xc7, coordinates: [ -725,   -670,    65], discs: [2, 3]      , group: 0x19, order: [  , 31, 22,   ], name: "Shumi Village- Village" },
  0x3d0: { preview: 0xf9, coordinates: [  -15,    920,     9], discs: [4]         , group: 0x1a, order: [  ,   ,   ,  5], name: "Commencement Room" },
};

const locationGroupList: Resource = {
  0x0: "Disc %d Start",
  0x1: "World Map",
  0x2: "Balamb",
  0x3: "Balamb Garden",
  0x4: "Train",
  0x5: "Deep Sea Research",
  0x6: "Dollet",
  0x7: "Lunatic Pandora",
  0x8: "Centra",
  0x9: "Esthar",
  0xa: "Lunatic Pandora Laboratory",
  0xb: "Great Salt Lake",
  0xc: "Ultimecia Castle",
  0xd: "Fishermans Horizon",
  0xe: "Winhill",
  0xf: "Galbadia Garden",
  0x10: "Deling City",
  0x11: "Galbadia Missile Base",
  0x12: "Tomb of the Unknown King",
  0x13: "Galbadia D-District Prison",
  0x14: "Ragnarok",
  0x15: "White SeeD Ship",
  0x16: "Lunar Base",
  0x17: "Trabia Garden",
  0x18: "Timber",
  0x19: "Shumi Village",
  0x1a: "Time Distorsion",
};

export const discStartPreviews = [
  { preview: 0x0, name: "" },
  { preview: 0x85, name: "Deling City- Parade" },
  { preview: 0x79, name: "G-Garden- Auditorium" },
  { preview: 0xb5, name: "Lunatic Pandora" },
];

export const disc1Locations: Resource = {};
export const disc2Locations: Resource = {};
export const disc3Locations: Resource = {};
export const disc4Locations: Resource = {};

export const disc1LocationsGroups: ResourceGroups = [];
export const disc2LocationsGroups: ResourceGroups = [];
export const disc3LocationsGroups: ResourceGroups = [];
export const disc4LocationsGroups: ResourceGroups = [];

export const disc1LocationsOrder: number[] = [0x0];
export const disc2LocationsOrder: number[] = [0x0];
export const disc3LocationsOrder: number[] = [0x0];
export const disc4LocationsOrder: number[] = [0x0];

for (let i = 0; i < 4; i += 1) {
  let discLocations: Resource = {};
  let discLocationsGroups: ResourceGroups = [];
  let discLocationsOrder: number[] = [];

  switch (i) {
    case 0:
      discLocations = disc1Locations;
      discLocationsGroups = disc1LocationsGroups;
      discLocationsOrder = disc1LocationsOrder;
      break;
    case 1:
      discLocations = disc2Locations;
      discLocationsGroups = disc2LocationsGroups;
      discLocationsOrder = disc2LocationsOrder;
      break;
    case 2:
      discLocations = disc3Locations;
      discLocationsGroups = disc3LocationsGroups;
      discLocationsOrder = disc3LocationsOrder;
      break;
    case 3:
      discLocations = disc4Locations;
      discLocationsGroups = disc4LocationsGroups;
      discLocationsOrder = disc4LocationsOrder;
      break;
  }

  const locations = Object.entries(locationList).sort(
    ([, a], [, b]) => (a.order[i] || -1) - (b.order[i] || -1),
  );

  // prettier-ignore
  locations.forEach(([key, location]) => {
    const index = parseInt(key);

    if (location.discs.includes(i + 1)) {
      discLocations[index] = location.name;

      if (index === 0x5f) {
        discLocations[index] = discStartPreviews[i].name;
      }

      const groupName = locationGroupList[location.group].replace("%d", `${i + 1}`);

      let group = discLocationsGroups.find((group) => group.name === groupName);

      if (!group) {
        group = { name: groupName, options: [] };
        discLocationsGroups.push(group);
      }

      group.options.push(index);

      discLocationsOrder.push(index);
    }
  });
}
