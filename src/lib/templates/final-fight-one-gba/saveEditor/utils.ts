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

  const section1Saves = getInt(shift, "uint16");
  const section2Saves = getInt(shift + 0x100, "uint16");

  if (section2Saves !== 0xffff && section2Saves > section1Saves) {
    return [...shifts, 0x100];
  }

  return shifts;
}

export function overrideGetInt(item: Item): [boolean, number | undefined] {
  if ("id" in item && item.id === "score") {
    const itemInt = item as ItemInt;

    let score = "";

    for (let i = 0x0; i < 0x8; i += 0x1) {
      score += getInt(itemInt.offset + i, "uint8");
    }

    const int = parseInt(score);

    return [true, int];
  }

  return [false, undefined];
}

export function overrideSetInt(item: Item, value: string): boolean {
  if ("id" in item && item.id === "score") {
    const itemInt = item as ItemInt;

    value = value.padStart(8, "0");

    for (let i = 0x0; i < 0x8; i += 0x1) {
      const int = parseInt(value[i]);

      setInt(itemInt.offset + i, "uint8", int);
    }

    return true;
  }

  return false;
}

export function generateChecksum(item: ItemChecksum): number {
  let checksum = 0x0;

  for (let i = item.control.offsetStart; i < item.control.offsetEnd; i += 0x2) {
    checksum -= getInt(i, "uint16");
  }

  return formatChecksum(checksum, item.dataType);
}

export function beforeSaving(): ArrayBufferLike {
  const $fileHeaderShift = get(fileHeaderShift);

  return byteswap(undefined, $fileHeaderShift, undefined, 0x8).buffer;
}
