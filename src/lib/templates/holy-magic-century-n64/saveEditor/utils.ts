import { getInt, setInt } from "$lib/utils/bytes";
import { getHeaderShift } from "$lib/utils/common/nintendo64";
import {
  getMpkNoteShift,
  getRegionsFromMpk,
  getSaves,
  repackMpk,
  resetMpk,
  unpackMpk,
} from "$lib/utils/common/nintendo64/mpk";

import type { Item, ItemContainer, ItemInt } from "$lib/types";

export function initHeaderShift(dataView: DataView): number {
  return getHeaderShift(dataView, "mpk");
}

export function beforeInitDataView(
  dataView: DataView,
  shift: number,
): DataView {
  return unpackMpk(dataView, shift);
}

export function overrideGetRegions(): string[] {
  return getRegionsFromMpk();
}

export function onInitFailed(): void {
  resetMpk();
}

export function initShifts(): number[] {
  return getMpkNoteShift();
}

export function overrideParseContainerItemsShifts(
  item: ItemContainer,
  shifts: number[],
  index: number,
): [boolean, number[] | undefined] {
  if (item.id === "slots") {
    const saves = getSaves();

    if (index > saves.length - 1) {
      return [true, [-1]];
    }
  }

  return [false, undefined];
}

export function overrideGetInt(item: Item): [boolean, number | undefined] {
  if ("id" in item && item.id === "location") {
    const itemInt = item as ItemInt;

    const int1 = getInt(itemInt.offset, "uint32", { bigEndian: true });
    const int2 = getInt(itemInt.offset + 0x4, "uint32", { bigEndian: true });

    const location = (int1 << 0x8) | int2;

    return [true, location];
  }

  return [false, undefined];
}

export function overrideSetInt(item: Item, value: string): boolean {
  if ("id" in item && item.id === "location") {
    const itemInt = item as ItemInt;

    const int = parseInt(value);

    const location1 = int >> 0x8;
    const location2 = int & 0xff;

    setInt(itemInt.offset, "uint32", location1, { bigEndian: true });
    setInt(itemInt.offset + 0x4, "uint32", location2, { bigEndian: true });

    return true;
  }

  return false;
}

export function beforeSaving(): ArrayBufferLike {
  return repackMpk();
}

export function onReset(): void {
  resetMpk();
}
