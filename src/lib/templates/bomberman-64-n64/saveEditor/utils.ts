import { getInt, setInt } from "$lib/utils/bytes";

import type { Item, ItemChecksum, ItemInt } from "$lib/types";

export function overrideGetInt(
  item: Item,
): [boolean, number | string | undefined] {
  if ("id" in item && item.id?.match(/time-/)) {
    const itemInt = item as ItemInt;

    let int = 0;

    int = getInt(itemInt.offset, "uint24", {
      bigEndian: itemInt.bigEndian,
    });

    if (item.id === "time-1") {
      int += (getInt(itemInt.offset + 0x6, "uint8") & 0x7) << 24;
    } else if (item.id === "time-2") {
      int += (getInt(itemInt.offset + 0x3, "uint8") & 0x38) << 21;
    }

    return [true, int];
  }

  return [false, undefined];
}

export function overrideSetInt(item: Item, value: string): boolean {
  if ("id" in item && item.id?.match(/time-/)) {
    const itemInt = item as ItemInt;

    let int = parseInt(value);

    setInt(itemInt.offset, "uint24", int, {
      bigEndian: itemInt.bigEndian,
    });

    int >>= 24;

    if (item.id === "time-1") {
      int += getInt(itemInt.offset + 0x6, "uint8") & 0x38;

      setInt(itemInt.offset + 0x6, "uint8", int);
    } else if (item.id === "time-2") {
      int = (int << 3) + (getInt(itemInt.offset + 0x3, "uint8") & 0x7);

      setInt(itemInt.offset + 0x3, "uint8", int);
    }

    return true;
  }

  return false;
}

export function generateChecksum(item: ItemChecksum): number {
  let checksum = 0xffff;

  for (
    let i = item.control.offset;
    i < item.control.offset + item.control.length;
    i += 0x1
  ) {
    checksum -= getInt(i, "uint8");
  }

  return checksum;
}
