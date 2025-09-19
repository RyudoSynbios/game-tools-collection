import { get } from "svelte/store";

import { fileHeaderShift } from "$lib/stores";
import { byteswap, getInt, getString } from "$lib/utils/bytes";
import { formatChecksum } from "$lib/utils/checksum";
import { getHeaderShift } from "$lib/utils/common/gameBoyAdvance";

import { ItemChecksum, ItemContainer } from "$lib/types";

export function initHeaderShift(dataView: DataView): number {
  return getHeaderShift(dataView);
}

export function beforeInitDataView(
  dataView: DataView,
  fileHeaderShift: number,
): DataView {
  return byteswap(dataView, fileHeaderShift, undefined, 0x8);
}

export function overrideParseContainerItemsShifts(
  item: ItemContainer,
  shifts: number[],
  index: number,
): [boolean, number[] | undefined] {
  const $fileHeaderShift = get(fileHeaderShift);

  if (item.id === "slots") {
    const offset = $fileHeaderShift + 0x34 + index * 0x10;

    const magic = getString(offset, 0x4, "uint8");

    if (magic !== "3ZCM") {
      return [true, [-1]];
    }
  }

  return [false, undefined];
}

export function generateChecksum(item: ItemChecksum): number {
  let checksum = 0xa778;

  let j = item.control.offsetEnd - item.control.offsetStart;

  for (
    let i = item.control.offsetStart;
    i < item.control.offsetEnd;
    i += 0x2, j -= 0x2
  ) {
    checksum += getInt(i, "uint16") ^ j;
  }

  checksum = (-checksum << 0x10) | (checksum & 0xffff);

  return formatChecksum(checksum, item.dataType);
}

export function beforeSaving(): ArrayBufferLike {
  const $fileHeaderShift = get(fileHeaderShift);

  return byteswap(undefined, $fileHeaderShift, undefined, 0x8).buffer;
}
