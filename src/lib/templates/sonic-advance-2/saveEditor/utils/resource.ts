import type { Resource } from "$lib/types";

export const progressionList = [
  { index: 0x0, min: 0x0, max: 0x2, name: "Zone 1: Leaf Forest" },
  { index: 0x1, min: 0x3, max: 0x6, name: "Zone 2: Hot Crater" },
  { index: 0x2, min: 0x7, max: 0xa, name: "Zone 3: Music Plant" },
  { index: 0x3, min: 0xb, max: 0xe, name: "Zone 4: Ice Paradise" },
  { index: 0x4, min: 0xf, max: 0x12, name: "Zone 5: Sky Canyon" },
  { index: 0x5, min: 0x13, max: 0x16, name: "Zone 6: Techno Base" },
  { index: 0x6, min: 0x17, max: 0x1a, name: "Zone 7: Egg Utopia" },
  { index: 0x7, min: 0x1b, max: 0x1c, name: "Final Zone" },
  { index: 0x8, min: 0x1d, max: 0x1d, name: "Final Zone Clear" },
];

export const progressions = progressionList.reduce(
  (items: Resource, item, index) => {
    items[index] = item.name;

    return items;
  },
  {},
);
