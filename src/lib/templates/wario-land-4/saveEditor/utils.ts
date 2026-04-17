import { getInt } from "$lib/utils/bytes";
import { formatChecksum } from "$lib/utils/checksum";
import { getHeaderShift } from "$lib/utils/common/gameBoyAdvance";

import type { ItemChecksum } from "$lib/types";

export function initHeaderShift(dataView: DataView): number {
  return getHeaderShift(dataView);
}

export function generateChecksum(item: ItemChecksum): number {
  let checksum = 0xffffffff;

  for (let i = item.control.offsetStart; i < item.control.offsetEnd; i += 0x4) {
    if (
      (item.id === "checksum1" && i !== item.offset + 0x4) ||
      (item.id === "checksum2" && i !== item.offset - 0x4)
    ) {
      checksum += getInt(i, "uint32");
    }
  }

  if (item.id === "checksum2") {
    checksum = ~checksum;
  }

  return formatChecksum(checksum, item.dataType);
}
