import { getInt } from "$lib/utils/bytes";

import type { ItemChecksum } from "$lib/types";

export function generateChecksum(item: ItemChecksum): number {
  let checksumByte1 = 0x00;
  let checksumByte2 = 0x00;

  for (
    let i = item.control.offset;
    i < item.control.offset + item.control.length;
    i += 0x1
  ) {
    if (i < item.offset) {
      checksumByte1 += getInt(i, "uint8");
      checksumByte2 ^= getInt(i, "uint8");
    }
  }

  const checksum = (checksumByte1 << 8) + checksumByte2;

  return checksum;
}
