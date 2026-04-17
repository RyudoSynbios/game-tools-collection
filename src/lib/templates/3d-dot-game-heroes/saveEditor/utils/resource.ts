import type { Resource } from "$lib/types";

export type SwordType = keyof Omit<(typeof swords)[number], "index" | "name">;

export const itemQuantites: {
  [key: string]: {
    shift: number;
    valuesMax: number[];
  };
} = {
  bombs: {
    shift: 0x4b,
    valuesMax: [0, 10, 20, 30, 40],
  },
  arrows: {
    shift: 0x55,
    valuesMax: [0, 15, 30, 60, 99],
  },
};

// prettier-ignore
export const swords: {
  index: number;
  name: string;
  potential: number;
  length: number[];
  width: number[];
  strength: number[];
  spin: number[];
  beam: number[];
  pierce: number[];
  special: number[];
}[] = [
  { index: 0x0, name: "Ancient Sword", potential: 2300, length: [2, 5], width: [1, 5], strength: [3, 9], spin: [1, 1], beam: [], pierce: [0, 1], special: [], },
  { index: 0x1, name: "Holy Sword", potential: 4800, length: [0, 9], width: [0, 9], strength: [7, 16], spin: [1], beam: [0, 1], pierce: [0, 1], special: [], },
  { index: 0x2, name: "Hero Sword", potential: 7500, length: [0, 12], width: [0, 12], strength: [15, 19], spin: [1, 1], beam: [0, 2], pierce: [0, 1], special: [], },
  { index: 0x3, name: "Luck Mallet", potential: 4400, length: [], width: [], strength: [4, 6], spin: [0, 1], beam: [], pierce: [], special: [1, 5], },
  { index: 0x4, name: "Gorgon Sword", potential: 5800, length: [0, 6], width: [0, 7], strength: [5, 9], spin: [1, 1], beam: [], pierce: [], special: [1, 5], },
  { index: 0x5, name: "Luck Sword", potential: 6800, length: [0, 8], width: [0, 5], strength: [6, 12], spin: [0, 1], beam: [], pierce: [], special: [1, 5], },
  { index: 0x6, name: "Wing Sword", potential: 4200, length: [], width: [], strength: [1, 4], spin: [], beam: [], pierce: [], special: [1, 5], },
  { index: 0x7, name: "Star Sword", potential: 7400, length: [0, 9], width: [0, 8], strength: [8, 15], spin: [0, 1], beam: [], pierce: [], special: [1, 5], },
  { index: 0x8, name: "Mage Sword", potential: 3000, length: [0, 4], width: [0, 5], strength: [9, 13], spin: [0, 1], beam: [0, 2], pierce: [], special: [1, 1], },
  { index: 0x9, name: "Rare Fish", potential: 1800, length: [0, 18], width: [0, 18], strength: [4, 4], spin: [1, 1], beam: [], pierce: [], special: [], },
  { index: 0xa, name: "Sword", potential: 0, length: [], width: [], strength: [3, 3], spin: [1, 1], beam: [], pierce: [], special: [], },
  { index: 0xb, name: "Excalibur", potential: 6600, length: [0, 17], width: [0, 17], strength: [13, 18], spin: [1, 1], beam: [], pierce: [0, 1], special: [], },
  { index: 0xc, name: "Katana", potential: 6200, length: [0, 20], width: [], strength: [9, 16], spin: [0, 1], beam: [], pierce: [1, 1], special: [], },
  { index: 0xd, name: "Moon Sword", potential: 5350, length: [0, 18], width: [0, 15], strength: [20, 20], spin: [1, 1], beam: [0, 2], pierce: [1, 1], special: [], },
  { index: 0xe, name: "Wyrm Sword", potential: 6000, length: [], width: [0, 14], strength: [10, 15], spin: [], beam: [], pierce: [1, 1], special: [], },
  { index: 0xf, name: "Orihalcon", potential: 6700, length: [], width: [0, 20], strength: [15, 20], spin: [0, 1], beam: [], pierce: [1, 1], special: [], },
  { index: 0x10, name: "Karasawa", potential: 4400, length: [], width: [], strength: [14, 19], spin: [], beam: [1, 3], pierce: [], special: [], },
  { index: 0x11, name: "Wood Bat", potential: 3000, length: [0, 8], width: [0, 4], strength: [2, 10], spin: [1, 1], beam: [], pierce: [], special: [], },
  { index: 0x12, name: "Home Run Bat", potential: 3400, length: [0, 12], width: [0, 6], strength: [7, 13], spin: [1, 1], beam: [], pierce: [], special: [], },
  { index: 0x13, name: "Giga Sword", potential: 10000, length: [0, 20], width: [0, 20], strength: [9, 20], spin: [0, 1], beam: [0, 3], pierce: [0, 1], special: [], },
  { index: 0x14, name: "Claymore", potential: 5800, length: [0, 8], width: [0, 12], strength: [6, 13], spin: [0, 1], beam: [], pierce: [0, 1], special: [], },
  { index: 0x15, name: "Beam Saber", potential: 3000, length: [0, 5], width: [], strength: [14, 16], spin: [1, 1], beam: [0, 3], pierce: [0, 1], special: [], },
  { index: 0x16, name: "Gungnir", potential: 5500, length: [0, 20], width: [], strength: [18, 19], spin: [], beam: [], pierce: [1, 1], special: [], },
  { index: 0x17, name: "Gladius", potential: 7000, length: [0, 2], width: [0, 18], strength: [13, 19], spin: [0, 1], beam: [], pierce: [0, 1], special: [], },
];

export const equipSwords: Resource = {};
export const swordNames: Resource = {};

swords.forEach((sword) => {
  equipSwords[sword.index + 0x1] = sword.name;
  swordNames[sword.index] = sword.name;
});
