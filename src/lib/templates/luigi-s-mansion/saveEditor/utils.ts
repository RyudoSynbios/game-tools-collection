import { get } from "svelte/store";

import { gameRegion } from "$lib/stores";
import { getInt, setInt } from "$lib/utils/bytes";
import { formatChecksum } from "$lib/utils/checksum";
import { getShift } from "$lib/utils/parser";

import {
  Item,
  ItemBitflag,
  ItemBitflags,
  ItemChecksum,
  ItemInt,
} from "$lib/types";

export function initShifts(shifts: number[]): number[] {
  const shift = getShift(shifts);

  const section1Saves = getInt(shift + 0x2040, "uint32", { bigEndian: true });
  const section2Saves = getInt(shift + 0x4040, "uint32", { bigEndian: true });

  if (section2Saves !== 0xffff && section2Saves > section1Saves) {
    return [...shifts, 0x2000];
  }

  return shifts;
}

export function overrideParseItem(item: Item): Item {
  const $gameRegion = get(gameRegion);

  if ("id" in item && item.id === "language") {
    const itemInt = item as ItemInt;

    itemInt.hidden = $gameRegion !== 0;

    return itemInt;
  }

  return item;
}

export function overrideGetInt(item: Item): [boolean, number | undefined] {
  if ("id" in item && item.id === "area") {
    const itemInt = item as ItemInt;

    let area = 1;

    area += getInt(itemInt.offset, "bit", { bit: 0 });
    area += getInt(itemInt.offset + 0x12, "bit", { bit: 5 });
    area += getInt(itemInt.offset + 0x13, "bit", { bit: 4 });

    return [true, area];
  }

  return [false, undefined];
}

export function overrideSetInt(item: Item, value: string): boolean {
  if ("id" in item && item.id === "area") {
    const itemInt = item as ItemInt;

    const area = parseInt(value);

    setInt(itemInt.offset, "bit", area >= 2 ? 1 : 0, { bit: 0 });
    setInt(itemInt.offset + 0x12, "bit", area >= 3 ? 1 : 0, { bit: 5 });
    setInt(itemInt.offset + 0x13, "bit", area >= 4 ? 1 : 0, { bit: 4 });

    return true;
  }

  return false;
}

export function afterSetInt(item: Item, flag: ItemBitflag): void {
  if ("id" in item && item.id === "equipment") {
    if (flag.label === "Boo Radar") {
      const itemBitflags = item as ItemBitflags;

      updateFlags(flag, itemBitflags.flags, 2);
    }
  } else if ("id" in item && item.id === "boos") {
    if (flag.label === "Boolossus") {
      const itemBitflags = item as ItemBitflags;

      updateFlags(flag, itemBitflags.flags, 14);
    }
  } else if ("id" in item && item.id?.match(/portraitGhost-/)) {
    const itemInt = item as ItemInt;

    const [shift, bit] = item.id.splitInt();

    const rank = getInt(itemInt.offset, "uint8", { binary: itemInt.binary });

    const checked = rank >= 1 ? 1 : 0;

    setInt(itemInt.offset - shift, "bit", checked, {
      bit,
    });

    if (shift === 911 && bit === 6) {
      // Neville
      setInt(itemInt.offset - 0x8b, "bit", checked, {
        bit: 6,
      });
    } else if (shift === 912 && bit === 3) {
      // Bogmire
      setInt(itemInt.offset - 0x78, "bit", checked, {
        bit: 5,
      });
    } else if (shift === 913 && bit === 6) {
      // Chauncey
      setInt(itemInt.offset - 0x88, "bit", checked, {
        bit: 0,
      });
    } else if (shift === 141 && bit === 1) {
      // Henry and Orville
      setInt(itemInt.offset - shift, "bit", checked, {
        bit: 2,
      });
    } else if (shift === 911 && bit === 1) {
      // Boolossus
      setInt(itemInt.offset - 0x78, "bit", checked, {
        bit: 4,
      });
      setInt(itemInt.offset - 0x2f, "uint8", checked ? 0x1f : 0x0, {
        binary: {
          bitStart: 3,
          bitLength: 5,
        },
      });
      setInt(itemInt.offset - 0x2e, "uint8", checked ? 0xff : 0x0);
      setInt(itemInt.offset - 0x2d, "uint8", checked ? 0x3 : 0x0, {
        binary: {
          bitStart: 0,
          bitLength: 2,
        },
      });
    } else if (shift === 917 && bit === 0) {
      // Jarvis
      setInt(itemInt.offset - 0x90, "bit", checked, {
        bit: 5,
      });
    }
  } else if ("id" in item && item.id === "1fHallway") {
    if (["Visited", "Cleared"].includes(flag.label)) {
      const itemBitflags = item as ItemBitflags;

      updateFlags(flag, itemBitflags.flags, 3);
    }
  } else if ("id" in item && item.id === "2fMasterBedroom") {
    if (flag.label === "Key to 2F Nursery obtained") {
      const itemBitflags = item as ItemBitflags;

      updateFlags(flag, itemBitflags.flags, 1);
    }
  } else if ("id" in item && item.id === "2fHallway") {
    if (["Visited", "Cleared"].includes(flag.label)) {
      const itemBitflags = item as ItemBitflags;

      updateFlags(flag, itemBitflags.flags, 4);
    }
  } else if (
    "id" in item &&
    (item.id === "3fEastHallway" ||
      item.id === "3fWestHallway" ||
      item.id === "bfHallway")
  ) {
    if (flag.label === "Visited") {
      const itemBitflags = item as ItemBitflags;

      updateFlags(flag, itemBitflags.flags, 1);
    }
  }
}

export function generateChecksum(item: ItemChecksum): number {
  let checksum1 = 0x0;
  let checksum2 = 0x0;

  for (let i = item.control.offsetStart; i < item.control.offsetEnd; i += 0x2) {
    checksum1 += getInt(i, "uint16", { bigEndian: true });
    checksum2 += ~getInt(i, "uint16", { bigEndian: true });
  }

  const checksum = (checksum1 << 0x10) | (checksum2 & 0xffff);

  return formatChecksum(checksum, item.dataType);
}

function updateFlags(flag: ItemBitflag, flags: ItemBitflag[], count: number) {
  const checked = getInt(flag.offset, "bit", { bit: flag.bit });

  const index = flags.findIndex(
    (item) => item.offset === flag.offset && item.bit === flag.bit,
  );

  for (let i = index + 1; i < index + 1 + count; i += 1) {
    const flag = flags[i];

    setInt(flag.offset, "bit", checked, { bit: flag.bit });
  }
}
