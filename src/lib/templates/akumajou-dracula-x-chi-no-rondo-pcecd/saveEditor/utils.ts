import { getBitflag, getInt } from "$lib/utils/bytes";
import { formatChecksum } from "$lib/utils/checksum";

import type { Item, ItemChecksum, ItemInt } from "$lib/types";

export function overrideGetInt(
  item: Item,
): [boolean, number | string | undefined] {
  if ("id" in item && item.id === "completionRate") {
    const itemInt = item as ItemInt;

    let int = 0;

    int += getInt(itemInt.offset - 0xb, "uint8").toBitCount() * 2;

    for (
      let offset = itemInt.offset;
      offset < itemInt.offset + 0x5;
      offset += 0x1
    ) {
      const richter = getBitflag(offset);
      const maria = getBitflag(offset + 0x5);

      for (let i = 0; i < 8; i += 1) {
        if (richter[i] || maria[i]) {
          int += 4;
        }
      }
    }

    return [true, int];
  }

  return [false, undefined];
}

export function generateChecksum(item: ItemChecksum): number {
  let checksum = 0x0;

  for (
    let i = item.control.offset;
    i < item.control.offset + item.control.length;
    i += 0x1
  ) {
    checksum -= getInt(i, "uint8");
  }

  return formatChecksum(checksum, item.dataType);
}
