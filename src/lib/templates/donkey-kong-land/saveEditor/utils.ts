import { getInt } from "$lib/utils/bytes";
import { formatChecksum } from "$lib/utils/checksum";

import type { Item, ItemChecksum, ItemInt } from "$lib/types";

export function overrideGetInt(item: Item): [boolean, number | undefined] {
  if ("id" in item && item.id === "completionRate") {
    const itemInt = item as ItemInt;

    let int = 0;

    for (
      let offset = itemInt.offset;
      offset < itemInt.offset + 0xb;
      offset += 0x1
    ) {
      int += getInt(offset, "uint8").toBitCount();
    }

    int = Math.floor((int / 80) * 100);

    return [true, int];
  }

  return [false, undefined];
}

export function generateChecksum(item: ItemChecksum): number {
  let checksumHigh = 0x0;
  let checksumLow = 0x0;

  for (let i = item.control.offsetStart; i < item.control.offsetEnd; i += 0x1) {
    checksumHigh += getInt(i, "uint8");
    checksumLow ^= getInt(i, "uint8");
  }

  const checksum = (checksumHigh << 0x8) | (checksumLow & 0xff);

  return formatChecksum(checksum, item.dataType);
}
