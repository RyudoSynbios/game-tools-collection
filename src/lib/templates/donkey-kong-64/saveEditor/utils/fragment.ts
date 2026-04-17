import { bitToOffset } from "$lib/utils/bytes";

import type { ItemInt } from "$lib/types";

import { shiftOffset } from "../utils";

export function characterFragment(
  character: number,
  type: "bananas" | "fedBananas" | "goldenBananas",
  level: number,
): ItemInt {
  let bitShifts = character * 161;

  let name = "";

  switch (type) {
    case "bananas":
      name = "Bananas";
      bitShifts += level * 7;
      break;
    case "fedBananas":
      name = "Fed to Troff 'n' Scoff";
      bitShifts += 56 + level * 7;
      break;
    case "goldenBananas":
      name = "Golden Bananas";
      bitShifts += 112 + level * 3;
      break;
  }

  const offset = shiftOffset(0x13a, bitToOffset(4 + bitShifts));

  return {
    id: `count-${type}-%index%-${level}-${character}`,
    name,
    offset: offset,
    type: "variable",
    dataType: "uint16",
    bigEndian: true,
    binary: {
      bitStart: (4 + bitShifts) % 8,
      bitLength: type === "goldenBananas" ? 3 : 7,
    },
    max: 100,
    disabled: type === "goldenBananas",
    hidden: type === "goldenBananas" || level === 7,
  };
}
