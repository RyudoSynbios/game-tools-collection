import type { Resource } from "$lib/types";

export const itemQuantites: {
  [key: string]: {
    shift?: number;
    valuesMax: number[];
  };
} = {
  rupees: {
    shift: 0x15,
    valuesMax: [300, 600, 1000],
  },
  bombs: {
    valuesMax: [30, 60],
  },
  waterBombs: {
    valuesMax: [15, 30],
  },
  bomblings: {
    valuesMax: [10, 20],
  },
};

// prettier-ignore
export const letterList = [
  { index: 0x01, flagIndex: 0x8, order: 12, name: "About Ilia's memory..." },
  { index: 0x02, flagIndex: 0x9, order:  1, name: "-Dear Adventurer-" },
  { index: 0x03, flagIndex: 0xa, order:  2, name: "-Dear Adventurer-" },
  { index: 0x04, flagIndex: 0xb, order:  0, name: "Post Office Notice" },
  { index: 0x05, flagIndex: 0xc, order:  3, name: "URGENT NOTICE!" },
  { index: 0x06, flagIndex: 0xd, order:  5, name: "Good stuff inside!" },
  { index: 0x07, flagIndex: 0xe, order:  9, name: "Rare item in stock!" },
  { index: 0x08, flagIndex: 0xf, order:  4, name: "URGENT! Bomb arrows!" },
  { index: 0x09, flagIndex: 0x0, order:  8, name: "Heroes, come together!" },
  { index: 0x0a, flagIndex: 0x1, order:  7, name: "They came so quickly!" },
  { index: 0x0b, flagIndex: 0x2, order: 14, name: "Challenge for you!" },
  { index: 0x0c, flagIndex: 0x3, order: 15, name: "Hey, kid!!!" },
  { index: 0x0d, flagIndex: 0x4, order: 10, name: "Agitha's Dream" },
  { index: 0x0e, flagIndex: 0x5, order:  6, name: "Now open for business!" },
  { index: 0x0f, flagIndex: 0x6, order: 13, name: "Update" },
  { index: 0x10, flagIndex: 0x7, order: 11, name: "From Wife of Yeto" },
];

export const letters = letterList.reduce((items: Resource, item, index) => {
  items[0x1 + index] = item.name;

  return items;
}, {});
