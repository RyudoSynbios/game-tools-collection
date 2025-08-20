import {
  customGetRegions,
  getFileOffset,
  repackMemoryCard,
  resetMemoryCard,
  unpackMemoryCard,
} from "$lib/utils/common/playstation2";

export function beforeInitDataView(dataView: DataView): DataView {
  return unpackMemoryCard(dataView);
}

export function overrideGetRegions(): string[] {
  return customGetRegions();
}

export function onInitFailed(): void {
  resetMemoryCard();
}

export function initShifts(shifts: number[]): number[] {
  return [...shifts, getFileOffset(0, "Savegame")];
}

export function beforeSaving(): ArrayBufferLike {
  return repackMemoryCard();
}

export function onReset(): void {
  resetMemoryCard();
}
