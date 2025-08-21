import {
  customGetRegions,
  getFileOffset,
  repackFile,
  resetState,
  unpackFile,
} from "$lib/utils/common/playstation2";

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
  return [...shifts, getFileOffset(0, "Savegame")];
}

export function beforeSaving(): ArrayBufferLike {
  return repackFile();
}

export function onReset(): void {
  resetState();
}
