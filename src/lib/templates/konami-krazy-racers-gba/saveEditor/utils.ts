import { getInt } from "$lib/utils/bytes";
import { extractGbaGameSharkHeader } from "$lib/utils/common";

import type { ItemChecksum } from "$lib/types";

export function beforeInitDataView(dataView: DataView): [DataView, Uint8Array] {
  return extractGbaGameSharkHeader(dataView);
}

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
