import { getInt } from "$lib/utils/bytes";

import type { ItemChecksum } from "$lib/types";

export function generateChecksum(item: ItemChecksum): number {
  let checksum = 0xffff;

  for (
    let i = item.control.offset;
    i < item.control.offset + item.control.length;
    i += 0x1
  ) {
    if (i < item.offset) {
      checksum -= getInt(i, "uint8");
    }
  }

  return checksum;
}
