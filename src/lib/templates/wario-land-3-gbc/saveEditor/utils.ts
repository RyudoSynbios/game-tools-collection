import { getInt, setInt } from "$lib/utils/bytes";
import { formatChecksum } from "$lib/utils/checksum";
import { getItem } from "$lib/utils/parser";

import {
  Item,
  ItemBitflags,
  ItemBoolean,
  ItemChecksum,
  ItemInt,
} from "$lib/types";

export function overrideGetInt(
  item: Item,
): [boolean, boolean | number | undefined] {
  if ("id" in item && item.id === "time") {
    const itemInt = item as ItemInt;

    let int = getInt(itemInt.offset, "uint8");

    if (int === 0x81 || int === 0x91) {
      int = 0x0;
    } else if (int === 0x11 || int === 0x80 || int === 0x90) {
      int = 0x1;
    }

    return [true, int];
  } else if ("id" in item && item.id?.match(/powerUp-/)) {
    const itemBoolean = item as ItemBoolean;

    const split = item.id.split("-");

    const index = parseInt(split[1]);

    const int = getInt(itemBoolean.offset, "uint8");

    const checked = index <= int;

    return [true, checked];
  } else if ("id" in item && item.id?.match(/timeAttack-/)) {
    const itemInt = item as ItemInt;

    let shift = 0x0;

    if (item.id === "timeAttack-1") {
      shift = 0x1;
    } else if (item.id === "timeAttack-2") {
      shift = -0x1;
    }

    let int1 = getInt(itemInt.offset, "uint8");
    const int2 = getInt(itemInt.offset + shift, "uint8");

    if (int1 === 0xaa && int2 === 0xaa) {
      int1 = 0x0;
    }

    return [true, int1];
  } else if ("id" in item && item.id === "golf") {
    const itemInt = item as ItemInt;

    let int = getInt(itemInt.offset, "uint8");

    if (int === 0xaa) {
      int = 0x0;
    }

    return [true, int];
  }

  return [false, undefined];
}

export function overrideSetInt(item: Item, value: string): boolean {
  if ("id" in item && item.id === "time") {
    const itemInt = item as ItemInt;

    const parsedValue = parseInt(value);

    let int = getInt(itemInt.offset, "uint8");

    switch (int) {
      case 0x0:
      case 0x11:
        int = parsedValue * 0x11;
        break;
      case 0x80:
      case 0x91:
        int = 0x91 - parsedValue * 0x11;
        break;
      case 0x81:
      case 0x90:
        int = 0x81 + parsedValue * 0xf;
        break;
    }

    setInt(itemInt.offset, "uint8", int);

    return true;
  } else if ("id" in item && item.id?.match(/powerUp-/)) {
    const itemBoolean = item as ItemBoolean;

    const split = item.id.split("-");

    let int = parseInt(split[1]);

    if (!value) {
      int -= 1;
    }

    setInt(itemBoolean.offset, "uint8", int);

    return true;
  } else if ("id" in item && item.id?.match(/timeAttack-/)) {
    const itemInt = item as ItemInt;

    let shift = 0x0;

    if (item.id === "timeAttack-1") {
      shift = 0x1;
    } else if (item.id === "timeAttack-2") {
      shift = -0x1;
    }

    let int1 = parseInt(value);
    let int2 = getInt(itemInt.offset + shift, "uint8");

    if (int1 === 0x0 && (int2 === 0x0 || int2 === 0xaa)) {
      int1 = 0xaa;
      int2 = 0xaa;
    } else if (int1 > 0x0 && int2 === 0xaa) {
      int2 = 0x0;
    }

    setInt(itemInt.offset, "uint8", int1);
    setInt(itemInt.offset + shift, "uint8", int2);

    return true;
  } else if ("id" in item && item.id === "golf") {
    const itemInt = item as ItemInt;

    let int = parseInt(value);

    if (int === 0x0) {
      int = 0xaa;
    }

    setInt(itemInt.offset, "uint8", int);

    return true;
  }

  return false;
}

export function afterSetInt(item: Item): void {
  if ("id" in item && item.id?.match(/treasures-/)) {
    let count = 0;

    for (let i = 1; i <= 5; i += 1) {
      const bitflags = getItem(`treasures-${i}`) as ItemBitflags;

      bitflags.flags.forEach((flag) => {
        count += getInt(flag.offset, "bit", { bit: flag.bit });
      });
    }

    const treasureCount = getItem("treasureCount") as ItemInt;

    setInt(treasureCount.offset, "uint16", count, {
      bigEndian: true,
      binaryCodedDecimal: true,
    });
  }
}

export function generateChecksum(item: ItemChecksum): number {
  let checksum = 0x0;

  for (let i = item.control.offsetStart; i < item.control.offsetEnd; i += 0x1) {
    checksum += getInt(i, "uint8");
  }

  return formatChecksum(checksum, item.dataType);
}
