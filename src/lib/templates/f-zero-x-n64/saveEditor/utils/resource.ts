import { getObjKey } from "$lib/utils/format";

import type { Resource } from "$lib/types";

// prettier-ignore
export const machinesDetails: {
  index: number;
  name: string;
  colors: Resource[];
}[] = [
  { index: 0x0, name: "Blue Falcon", colors: [{ 0x0000ff: "Default" }, { 0xd30066: "Pink" }, { 0x005730: "Green" }, { 0x4d4d4d: "Grey" }] },
  { index: 0x1, name: "Golden Fox", colors: [{ 0xffcd19: "Default" }, { 0xe2ffff: "Silver" }, { 0x2b85ff: "Blue" }, { 0x7850a0: "Purple" }] },
  { index: 0x2, name: "Wild Goose", colors: [{ 0x008649: "Default" }, { 0x4b51a3: "Blue" }, { 0xbe4110: "Orange" }, { 0x646464: "Grey" }] },
  { index: 0x3, name: "Fire Stingray", colors: [{ 0xf54892: "Default" }, { 0x343434: "Grey" }, { 0x4879f5: "Blue" }, { 0x2b7841: "Green" }] },
  { index: 0x4, name: "White Cat", colors: [{ 0x6f4fb8: "Default" }, { 0xff0000: "Red" }, { 0x00b685: "Green" }, { 0xffa800: "Orange" }] },
  { index: 0x5, name: "Red Gazelle", colors: [{ 0xff0000: "Default" }, { 0x0000be: "Blue" }, { 0x4a4a4a: "Grey" }, { 0x24652e: "Green" }] },
  { index: 0x6, name: "Great Star", colors: [{ 0x8f49e8: "Default" }, { 0xff6803: "Orange" }, { 0x4dc6d8: "Blue" }, { 0x39bc23: "Green" }] },
  { index: 0x7, name: "Iron Tiger", colors: [{ 0x8f90c0: "Default" }, { 0x3c3c3c: "Grey" }, { 0x92d892: "Green" }, { 0xdcdc92: "Yellow" }] },
  { index: 0x8, name: "Deep Claw", colors: [{ 0x920011: "Default" }, { 0xff6c00: "Orange" }, { 0x0e4b1a: "Green" }, { 0x2c94c4: "Blue" }] },
  { index: 0x9, name: "Twin Noritta", colors: [{ 0x646464: "Default" }, { 0xf0c940: "Yellow" }, { 0xef62c3: "Pink" }, { 0x5cc8e3: "Blue" }] },
  { index: 0xa, name: "Super Piranha", colors: [{ 0x47cac4: "Default" }, { 0xfff000: "Yellow" }, { 0x3a3a3a: "Grey" }, { 0x63df66: "Green" }] },
  { index: 0xb, name: "Mighty Hurricane", colors: [{ 0x005a5a: "Default" }, { 0xc42121: "Red" }, { 0x142979: "Blue" }, { 0x796514: "Yellow" }] },
  { index: 0xc, name: "Little Wyvern", colors: [{ 0xa0a0b4: "Default" }, { 0xffa800: "Orange" }, { 0xdf70ff: "Pink" }, { 0x7bfbff: "Blue" }] },
  { index: 0xd, name: "Space Angler", colors: [{ 0x474f97: "Default" }, { 0xffc600: "Yellow" }, { 0xff5490: "Pink" }, { 0x969696: "Grey" }] },
  { index: 0xe, name: "Green Panther", colors: [{ 0x0a3214: "Default" }, { 0x35c9ff: "Blue" }, { 0xfff000: "Yellow" }, { 0x5cee3f: "Green" }] },
  { index: 0xf, name: "Black Bull", colors: [{ 0x1e1e1e: "Default" }, { 0x3623c0: "Purple" }, { 0x523652: "Pink" }, { 0x7a6b0e: "Yellow" }] },
  { index: 0x10, name: "Wild Boar", colors: [{ 0xce5416: "Default" }, { 0x19a81d: "Green" }, { 0xf9da03: "Yellow" }, { 0x16d9ae: "Blue" }] },
  { index: 0x11, name: "Astro Robin", colors: [{ 0x474f97: "Default" }, { 0xff0000: "Red" }, { 0x1c502a: "Green" }, { 0x383838: "Grey" }] },
  { index: 0x12, name: "King Meteor", colors: [{ 0x8d0f24: "Default" }, { 0x1d15b8: "Blue" }, { 0x2e2e2e: "Grey" }, { 0x26821d: "Green" }] },
  { index: 0x13, name: "Queen Meteor", colors: [{ 0x8d0f24: "Default" }, { 0x1d15b8: "Blue" }, { 0x2e2e2e: "Grey" }, { 0x26821d: "Green" }] },
  { index: 0x14, name: "Wonder Wasp", colors: [{ 0x0e91d5: "Default" }, { 0xc833c3: "Pink" }, { 0xd50e0e: "Red" }, { 0x165f26: "Green" }] },
  { index: 0x15, name: "Hyper Speeder", colors: [{ 0x13405a: "Default" }, { 0xbebebe: "Silver" }, { 0xa50c0c: "Red" }, { 0x143c14: "Green" }] },
  { index: 0x16, name: "Death Anchor", colors: [{ 0x1a1e39: "Default" }, { 0xdbe6ff: "Silver" }, { 0xd90000: "Red" }, { 0x9b189c: "Purple" }] },
  { index: 0x17, name: "Crazy Bear", colors: [{ 0xcbcb54: "Default" }, { 0x79cdd4: "Blue" }, { 0xffffff: "White" }, { 0xff95f4: "Pink" }] },
  { index: 0x18, name: "Night Thunder", colors: [{ 0x03032e: "Default" }, { 0xda1111: "Red" }, { 0x1cb568: "Green" }, { 0x767676: "Grey" }] },
  { index: 0x19, name: "Big Fang", colors: [{ 0x33301c: "Default" }, { 0xcb0000: "Red" }, { 0x007e14: "Green" }, { 0x0983a6: "Blue" }] },
  { index: 0x1a, name: "Mighty Typhoon", colors: [{ 0x485a00: "Default" }, { 0x157895: "Blue" }, { 0xb33143: "Red" }, { 0x454889: "Purple" }] },
  { index: 0x1b, name: "Mad Wolf", colors: [{ 0xfef441: "Default" }, { 0xe33e22: "Red" }, { 0x144818: "Green" }, { 0x686396: "Purple" }] },
  { index: 0x1c, name: "Sonic Phantom", colors: [{ 0x1f3fdf: "Default" }, { 0xe80000: "Red" }, { 0xc000b0: "Pink" }, { 0x5b5b5b: "Grey" }] },
  { index: 0x1d, name: "Blood Hawk", colors: [{ 0xc80000: "Default" }, { 0x0048ff: "Blue" }, { 0x3fd62a: "Green" }, { 0x282669: "Purple" }] },
];

export const machineColors = machinesDetails.reduce(
  (colors: { [key: string]: Resource }, machine) => {
    colors[`machine${machine.index}Colors`] = machine.colors.reduce(
      (colors, color) => {
        const key = parseInt(getObjKey(color, 0));

        colors[key] = color[key];

        return colors;
      },
      {},
    );

    return colors;
  },
  {},
);

export const machineColorsOrder = machinesDetails.reduce(
  (colors: { [key: string]: number[] }, machine) => {
    colors[`machine${machine.index}Colors`] = machine.colors.map((color) => {
      return parseInt(getObjKey(color, 0));
    });

    return colors;
  },
  {},
);

export const machines = machinesDetails.reduce(
  (machines: Resource, machine) => {
    machines[machine.index] = machine.name;

    return machines;
  },
  {},
);
