import { get } from "svelte/store";

import { fileHeaderShift } from "$lib/stores";
import { byteswap, getInt, setInt } from "$lib/utils/bytes";
import { formatChecksum } from "$lib/utils/checksum";
import { getHeaderShift } from "$lib/utils/common/gameBoyAdvance";
import { getShift } from "$lib/utils/parser";

import type { Item, ItemChecksum, ItemInt } from "$lib/types";

export function initHeaderShift(dataView: DataView): number {
  return getHeaderShift(dataView);
}

export function beforeInitDataView(
  dataView: DataView,
  fileHeaderShift: number,
): DataView {
  return byteswap(dataView, fileHeaderShift, undefined, 0x8);
}

export function initShifts(shifts: number[]): number[] {
  const shift = getShift(shifts);

  const section1Saves = getInt(shift + 0x8, "uint32");
  const section2Saves = getInt(shift + 0x108, "uint32");

  if (section2Saves > section1Saves) {
    return [...shifts, 0x100];
  }

  return shifts;
}

export function afterSetInt(item: Item): void {
  if ("id" in item && item.id === "matchTime") {
    const itemInt = item as ItemInt;

    const time = getInt(itemInt.offset, "uint8");

    setInt(itemInt.offset - 0x2, "uint8", time === 3 ? 0 : 1);
  }
}

export function generateChecksum(item: ItemChecksum): number {
  let checksum = 0x0;

  for (let i = item.control.offsetStart; i < item.control.offsetEnd; i += 0x1) {
    checksum += getInt(i, "uint8");
  }

  checksum ^= 0xffff;

  return formatChecksum(checksum, item.dataType);
}

export function beforeSaving(): ArrayBufferLike {
  const $fileHeaderShift = get(fileHeaderShift);

  return byteswap(undefined, $fileHeaderShift, undefined, 0x8).buffer;
}
