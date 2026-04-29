import { get } from "svelte/store";

import { dataView, dataViewAlt, gameRegion } from "$lib/stores";
import { getInt } from "$lib/utils/bytes";
import { formatChecksum } from "$lib/utils/checksum";
import {
  customGetRegions,
  getSlotShifts,
  repackFile,
  resetState,
  unpackFile,
} from "$lib/utils/common/playstation";
import { cloneArrayBuffer } from "$lib/utils/format";
import { getShift } from "$lib/utils/parser";

import type { Item, ItemChecksum, ItemInt } from "$lib/types";

export function beforeInitDataView(dataView: DataView): DataView {
  return unpackFile(dataView);
}

export function overrideGetRegions(): string[] {
  return customGetRegions();
}

export function onInitFailed(): void {
  resetState();
}

export function beforeItemsParsing(): void {
  const $dataView = get(dataView);

  const data = new Uint8Array($dataView.buffer);

  const offset = getSaveOffset();

  const deobfuscatedData = deobfuscateData(data.slice(offset, offset + 0x200));

  dataViewAlt.set({ save: new DataView(deobfuscatedData.buffer) });
}

export function overrideParseItem(item: Item): Item {
  const $gameRegion = get(gameRegion);

  if ("id" in item && item.id === "time" && $gameRegion !== 0) {
    const itemInt = item as ItemInt;

    itemInt.operations![0] = { "/": 60 };

    return itemInt;
  }

  return item;
}

export function generateChecksum(item: ItemChecksum): number {
  const $dataViewAlt = get(dataViewAlt);

  let checksum = 0x0;

  for (let i = item.control.offsetStart; i < item.control.offsetEnd; i += 0x1) {
    checksum += getInt(i, "uint8", {}, $dataViewAlt.save);
  }

  checksum = -checksum;

  return formatChecksum(checksum, item.dataType);
}

export function beforeSaving(): ArrayBufferLike {
  const $dataView = get(dataView);
  const $dataViewAlt = get(dataViewAlt);

  const data = new Uint8Array($dataView.buffer);
  const deobfuscatedData = cloneArrayBuffer($dataViewAlt.save.buffer);

  const obfuscatedData = obfuscateData(deobfuscatedData);

  const offset = getSaveOffset();

  data.set(obfuscatedData, offset);

  dataView.set(new DataView(data.buffer));

  return repackFile();
}

export function onReset(): void {
  resetState();
}

export function getSaveOffset(): number {
  const slotShifts = getSlotShifts(0);

  return getShift(slotShifts[1]) + 0x200;
}

export function deobfuscateData(data: Uint8Array): Uint8Array {
  let previous = data[0x0];

  for (let i = 0x1; i < 0x200; i += 0x1) {
    const int = data[i] - (previous * 0x5 + 0x1);

    previous = data[i];
    data[i] = int;
  }

  return data;
}

export function obfuscateData(data: Uint8Array): Uint8Array {
  let previous = data[0x0];

  for (let i = 0x1; i < 0x200; i += 0x1) {
    const int = data[i] + (previous * 0x5 + 0x1);

    data[i] = int;
    previous = data[i];
  }

  return data;
}
