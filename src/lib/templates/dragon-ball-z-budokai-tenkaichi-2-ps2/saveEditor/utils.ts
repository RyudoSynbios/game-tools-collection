import { getInt, setInt } from "$lib/utils/bytes";
import {
  customGetRegions,
  getFileOffset,
  repackFile,
  resetState,
  unpackFile,
} from "$lib/utils/common/playstation2";

import { Item, ItemInt } from "$lib/types";

export function beforeInitDataView(dataView: DataView): DataView {
  return unpackFile(dataView);
}

export function overrideGetRegions(): string[] {
  return customGetRegions();
}

export function onInitFailed(): void {
  resetState();
}

export function initShifts(shifts: number[]): number[] {
  return [...shifts, getFileOffset(0)];
}

export function afterSetInt(item: Item): void {
  if ("id" in item && item.id === "daStatus") {
    const itemInt = item as ItemInt;

    const quantity = getInt(itemInt.offset, "uint16");

    setInt(itemInt.offset - 0x2, "bit", quantity, { bit: 0 });
  }
}

export function beforeSaving(): ArrayBufferLike {
  return repackFile();
}

export function onReset(): void {
  resetState();
}
