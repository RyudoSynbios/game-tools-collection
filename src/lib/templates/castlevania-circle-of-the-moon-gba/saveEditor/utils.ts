import { get } from "svelte/store";

import { dataView } from "$lib/stores";
import { getInt } from "$lib/utils/bytes";
import { formatChecksum } from "$lib/utils/checksum";
import {
  customGetRegions,
  extractCastlevaniaCollectionSaves,
  getShifts,
  injectCastlevaniaCollectionSaves,
  isCastlevaniaCollectionSave,
  resetState,
} from "$lib/utils/common/castlevania";
import { getHeaderShift } from "$lib/utils/common/gameBoyAdvance";

import type { ItemChecksum } from "$lib/types";

const GAME = "cotm";

export function initHeaderShift(dataView: DataView): number {
  return getHeaderShift(dataView);
}

export function beforeInitDataView(dataView: DataView): DataView {
  if (isCastlevaniaCollectionSave(GAME, dataView)) {
    dataView = extractCastlevaniaCollectionSaves(GAME, dataView);
  }

  return dataView;
}

export function overrideGetRegions(
  dataView: DataView,
  shift: number,
): string[] {
  return customGetRegions(dataView, shift);
}

export function initShifts(shifts: number[]): number[] {
  return getShifts(shifts);
}

export function generateChecksum(item: ItemChecksum): number {
  let checksum = 0x0;

  for (let i = item.control.offsetStart; i < item.control.offsetEnd; i += 0x1) {
    checksum += getInt(i, "uint8");
  }

  return formatChecksum(checksum, item.dataType);
}

export function beforeSaving(): ArrayBufferLike {
  const $dataView = get(dataView);

  if (isCastlevaniaCollectionSave(GAME)) {
    return injectCastlevaniaCollectionSaves(GAME);
  }

  return $dataView.buffer;
}

export function onReset(): void {
  resetState();
}
