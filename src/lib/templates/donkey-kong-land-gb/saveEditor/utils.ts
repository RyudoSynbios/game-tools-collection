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
  let checksumByte1 = 0x0;
  let checksumByte2 = 0x0;

  for (let i = item.control.offsetStart; i < item.control.offsetEnd; i += 0x1) {
    checksumByte1 += getInt(i, "uint8");
    checksumByte2 ^= getInt(i, "uint8");
  }

  const checksum = (checksumByte1 << 0x8) | checksumByte2;

  return formatChecksum(checksum, item.dataType);
}
