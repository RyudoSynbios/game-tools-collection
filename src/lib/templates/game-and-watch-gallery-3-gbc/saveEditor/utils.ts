import { getInt, setInt } from "$lib/utils/bytes";
import { formatChecksum } from "$lib/utils/checksum";

import type { Item, ItemChecksum, ItemInt } from "$lib/types";

export function overrideGetInt(
  item: Item,
): [boolean, number | string | undefined] {
  if ("id" in item && item.id?.match(/score-/)) {
    const itemInt = item as ItemInt;

    const digit1 = getInt(itemInt.offset, "uint8");
    const digit2 = getInt(itemInt.offset + 0x1, "uint8");
    const digit3 = getInt(itemInt.offset + 0x2, "uint8");
    const digit4 = getInt(itemInt.offset + 0x3, "uint8");

    let int = 0;

    if (item.id === "score-2") {
      int = digit1 * 10 + digit2;
    } else if (item.id === "score-4") {
      int = digit1 * 1000 + digit2 * 100 + digit3 * 10 + digit4;
    }

    return [true, int];
  }

  return [false, undefined];
}

export function overrideSetInt(item: Item, value: string): boolean {
  if ("id" in item && item.id?.match(/score-/)) {
    const itemInt = item as ItemInt;

    let array: string[] = [];

    if (item.id === "score-2") {
      array = value.padStart(2, "0").split("");
    } else if (item.id === "score-4") {
      array = value.padStart(3, "0").split("");
    }

    array.forEach((digit, index) =>
      setInt(itemInt.offset + index, "uint8", digit),
    );

    return true;
  }

  return false;
}

export function generateChecksum(item: ItemChecksum): number {
  let checksum = 0x0;

  for (
    let i = item.control.offset;
    i < item.control.offset + item.control.length;
    i += 0x1
  ) {
    if (i < item.offset) {
      checksum += getInt(i, "uint8");
    }
  }

  return formatChecksum(checksum, item.dataType);
}
