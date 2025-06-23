// prettier-ignore
export const records = [
  { index: 0x4, ttIndex: 0x14, name: "Ancient Lake", vehicles: ["Car", "Hover", "Plane"] },
  { index: 0x0, ttIndex: 0x15, name: "Fossil Canyon", vehicles: ["Car", "Hover", "Plane"] },
  { index: 0x22, ttIndex: 0x16, name: "Jungle Falls", vehicles: ["Car", "Hover", "Plane"] },
  { index: 0x9, ttIndex: 0x17, name: "Hot Top Volcano", vehicles: ["Hover", "Plane"] },
  { index: 0xb, ttIndex: 0x8, name: "Whale Bay", vehicles: ["Hover"] },
  { index: 0x3, ttIndex: 0x9, name: "Pirate Lagoon", vehicles: ["Hover"] },
  { index: 0xe, ttIndex: 0xa, name: "Crescent Island", vehicles: ["Car", "Hover"] },
  { index: 0x25, ttIndex: 0xb, name: "Treasure Caves", vehicles: ["Car", "Hover", "Plane"] },
  { index: 0x10, ttIndex: 0xc, name: "Everfrost Peak", vehicles: ["Car", "Hover", "Plane"] },
  { index: 0x7, ttIndex: 0xd, name: "Walrus Cove", vehicles: ["Car", "Hover"] },
  { index: 0xc, ttIndex: 0xe, name: "Snowball Valley", vehicles: ["Car", "Hover"] },
  { index: 0x1f, ttIndex: 0xf, name: "Frosty Village", vehicles: ["Car", "Hover", "Plane"] },
  { index: 0x1b, ttIndex: 0x0, name: "Boulder Canyon", vehicles: ["Hover"] },
  { index: 0x19, ttIndex: 0x1, name: "Greenwood Village", vehicles: ["Car", "Hover"] },
  { index: 0x1c, ttIndex: 0x2, name: "Windmill Plains", vehicles: ["Car", "Hover", "Plane"] },
  { index: 0x28, ttIndex: 0x3, name: "Haunted Woods", vehicles: ["Car", "Hover"] },
  { index: 0x16, ttIndex: 0x4, name: "Spacedust Alley", vehicles: ["Car", "Hover", "Plane"] },
  { index: 0x2a, ttIndex: 0x5, name: "Darkmoon Caverns", vehicles: ["Car", "Hover"] },
  { index: 0x2c, ttIndex: 0x6, name: "Star City", vehicles: ["Car", "Hover", "Plane"] },
  { index: 0x13, ttIndex: 0x7, name: "Spaceport Alpha", vehicles: ["Car", "Hover", "Plane"] },
];

export const worlds: {
  [world: string]: {
    balloons?: {
      offset: number;
      dataType: "uint8" | "uint16";
      bitStart: number;
    };
    races?: { name: string; offset: number; bitStart: number }[];
    bosses: { name: string; offset: number; bitStart: number }[];
    tt?: { name: string; offset: number; bitStart: number };
  };
} = {
  lobby: {
    bosses: [{ name: "Wizpig Level", offset: 0x8, bitStart: 4 }],
  },
  dinoDomain: {
    balloons: { offset: 0xf, dataType: "uint8", bitStart: 2 },
    races: [
      { name: "Ancient Lake", offset: 0x2, bitStart: 0 },
      { name: "Fossil Canyon", offset: 0x2, bitStart: 4 },
      { name: "Jungle Falls", offset: 0x7, bitStart: 6 },
      { name: "Hot Top Volcano", offset: 0x3, bitStart: 4 },
    ],
    bosses: [
      { name: "Boss Level 1", offset: 0x8, bitStart: 2 },
      { name: "Boss Level 2", offset: 0x9, bitStart: 4 },
    ],
    tt: { name: "Fire Mountain", offset: 0x4, bitStart: 4 },
  },
  sherbetIsland: {
    balloons: { offset: 0x10, dataType: "uint8", bitStart: 3 },
    races: [
      { name: "Whale Bay", offset: 0x3, bitStart: 2 },
      { name: "Pirate Lagoon", offset: 0x2, bitStart: 2 },
      { name: "Crescent Island", offset: 0x4, bitStart: 6 },
      { name: "Treasure Caves", offset: 0x7, bitStart: 4 },
    ],
    bosses: [
      { name: "Boss Level 1", offset: 0x8, bitStart: 0 },
      { name: "Boss Level 2", offset: 0x9, bitStart: 0 },
    ],
    tt: { name: "Darkwater Beach", offset: 0x6, bitStart: 4 },
  },
  snowflakeMountain: {
    balloons: { offset: 0x11, dataType: "uint8", bitStart: 4 },
    races: [
      { name: "Everfrost Peak", offset: 0x4, bitStart: 2 },
      { name: "Walrus Cove", offset: 0x3, bitStart: 6 },
      { name: "Snowball Valley", offset: 0x3, bitStart: 0 },
      { name: "Frosty Village", offset: 0x6, bitStart: 0 },
    ],
    bosses: [
      { name: "Boss Level 1", offset: 0x2, bitStart: 6 },
      { name: "Boss Level 2", offset: 0x9, bitStart: 2 },
    ],
    tt: { name: "Icicle Pyramid", offset: 0x6, bitStart: 2 },
  },
  dragonForest: {
    balloons: { offset: 0x11, dataType: "uint16", bitStart: 5 },
    races: [
      { name: "Boulder Canyon", offset: 0x5, bitStart: 2 },
      { name: "Greenwood Village", offset: 0x5, bitStart: 4 },
      { name: "Windmill Plains", offset: 0x5, bitStart: 0 },
      { name: "Haunted Woods", offset: 0x7, bitStart: 2 },
    ],
    bosses: [
      { name: "Boss Level 1", offset: 0x9, bitStart: 6 },
      { name: "Boss Level 2", offset: 0xa, bitStart: 6 },
    ],
    tt: { name: "Smokey Castle", offset: 0x6, bitStart: 6 },
  },
  futureFunLand: {
    balloons: { offset: 0x12, dataType: "uint16", bitStart: 6 },
    races: [
      { name: "Spacedust Alley", offset: 0x5, bitStart: 6 },
      { name: "Darkmoon Caverns", offset: 0x7, bitStart: 0 },
      { name: "Star City", offset: 0x8, bitStart: 6 },
      { name: "Spaceport Alpha", offset: 0x4, bitStart: 0 },
    ],
    bosses: [{ name: "Wizpig Level", offset: 0xa, bitStart: 4 }],
  },
};
