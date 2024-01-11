import { getInt, setInt } from "$lib/utils/bytes";
import {
  getGameSharkHeaderShift,
  isGameSharkHeader,
} from "$lib/utils/common/gameBoyAdvance";

import type { Item, ItemInt } from "$lib/types";

export function initHeaderShift(dataView: DataView): number {
  if (isGameSharkHeader(dataView)) {
    return getGameSharkHeaderShift(dataView);
  }

  return 0x0;
}

export function afterSetInt(item: Item): void {
  if ("id" in item && item.id === "gold") {
    const itemInt = item as ItemInt;

    const value = getInt(itemInt.offset, "uint32");

    setInt(itemInt.offset + 0x170, "uint32", value);
  }
}
