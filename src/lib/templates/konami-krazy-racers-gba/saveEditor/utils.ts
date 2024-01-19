import { getInt } from "$lib/utils/bytes";
import { formatChecksum } from "$lib/utils/checksum";
import {
  getGameSharkHeaderShift,
  isGameSharkHeader,
} from "$lib/utils/common/gameBoyAdvance";

import type { ItemChecksum } from "$lib/types";

export function initHeaderShift(dataView: DataView): number {
  if (isGameSharkHeader(dataView)) {
    return getGameSharkHeaderShift(dataView);
  }

  return 0x0;
}

export function generateChecksum(item: ItemChecksum): number {
  let checksum = 0xffff;

  for (let i = item.control.offsetStart; i < item.control.offsetEnd; i += 0x1) {
    checksum -= getInt(i, "uint8");
  }

  return formatChecksum(checksum, item.dataType);
}
