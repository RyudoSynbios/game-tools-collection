import { getInt, setInt } from "$lib/utils/bytes";
import { extractGbaGameSharkHeader } from "$lib/utils/common/gameBoyAdvance";

import type { Item, ItemChecksum, ItemInt } from "$lib/types";

export function beforeInitDataView(dataView: DataView): [DataView, Uint8Array] {
  return extractGbaGameSharkHeader(dataView);
}

export function initShifts(): number[] {
  const section1Saves = getInt(0xc, "uint32", { bigEndian: true });
  const section2Saves = getInt(0x10c, "uint32", { bigEndian: true });

  if (section2Saves > section1Saves) {
    return [0x100];
  }

  return [];
}

export function afterSetInt(item: Item): void {
  if ("id" in item && item.id === "matchTime") {
    const itemInt = item as ItemInt;

    const time = getInt(itemInt.offset, "uint8");

    setInt(itemInt.offset - 0xe, "uint8", time === 3 ? 0 : 1);
  }
}

export function generateChecksum(item: ItemChecksum): number {
  let checksum = 0xffff;

  for (
    let i = item.control.offset;
    i < item.control.offset + item.control.length;
    i += 0x1
  ) {
    if (i < item.offset || i >= item.offset + 0x1) {
      checksum -= getInt(i, "uint8");
    }
  }

  return checksum;
}
