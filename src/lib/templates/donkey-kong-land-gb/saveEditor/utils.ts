import { getInt } from "$lib/utils/bytes";
import { formatChecksum } from "$lib/utils/checksum";

import type { ItemChecksum } from "$lib/types";

export function generateChecksum(item: ItemChecksum): number {
  let checksumByte1 = 0x0;
  let checksumByte2 = 0x0;

  for (let i = item.control.offsetStart; i < item.control.offsetEnd; i += 0x1) {
    checksumByte1 += getInt(i, "uint8");
    checksumByte2 ^= getInt(i, "uint8");
  }

  const checksum = (checksumByte1 << 8) + checksumByte2;

  return formatChecksum(checksum, item.dataType);
}
