import { get } from "svelte/store";

import { dataView } from "$lib/stores";
import { byteswap, getInt } from "$lib/utils/bytes";

import type { ItemChecksum } from "$lib/types";

export function isDciFile(dataView?: DataView): boolean {
  const firstHex = getInt(0x0, "uint8", {}, dataView);

  if (dataView?.byteLength !== 0x20000 && firstHex === 0x33) {
    return true;
  }

  return false;
}

export function byteswapDataView(dataViewTmp?: DataView): DataView {
  if (isDciFile(dataViewTmp)) {
    return byteswap(dataViewTmp, 0x20);
  }

  if (dataViewTmp !== undefined) {
    return vmuToDataView(dataViewTmp);
  }

  return dataViewToVmu();
}

export function dciToDataView(dataView: DataView): DataView {
  const array = [];

  for (let i = 0x0; i < 0x20; i += 0x1) {
    array.push(getInt(i, "uint8", {}, dataView));
  }

  for (let i = 0x20; i < dataView.byteLength; i += 0x4) {
    array.push(
      getInt(i + 0x3, "uint8", {}, dataView),
      getInt(i + 0x2, "uint8", {}, dataView),
      getInt(i + 0x1, "uint8", {}, dataView),
      getInt(i, "uint8", {}, dataView),
    );
  }

  const uint8Array = new Uint8Array(array);

  return new DataView(uint8Array.buffer);
}

export function dataViewToDci(): ArrayBufferLike {
  const $dataView = get(dataView);

  const array = [];

  for (let i = 0x0; i < 0x20; i += 0x1) {
    array.push(getInt(i, "uint8"));
  }

  for (let i = 0x20; i < $dataView.byteLength; i += 0x4) {
    array.push(
      getInt(i + 0x3, "uint8"),
      getInt(i + 0x2, "uint8"),
      getInt(i + 0x1, "uint8"),
      getInt(i, "uint8"),
    );
  }

  const uint8Array = new Uint8Array(array);

  return uint8Array.buffer;
}

export function vmuToDataView(dataView: DataView): DataView {
  const array = [];

  const blocks = dataView.byteLength / 0x200;

  if (blocks !== 0x100) {
    return dataView;
  }

  for (let i = dataView.byteLength - 0x200; i >= 0; i -= 0x200) {
    for (let j = 0x0; j < 0x200; j += 0x1) {
      array.push(getInt(i + j, "uint8", {}, dataView));
    }
  }

  const uint8Array = new Uint8Array(array);

  return new DataView(uint8Array.buffer);
}

export function dataViewToVmu(): DataView {
  const $dataView = get(dataView);

  const array = [];

  for (let i = $dataView.byteLength - 0x200; i >= 0; i -= 0x200) {
    for (let j = 0x0; j < 0x200; j += 0x1) {
      array.push(getInt(i + j, "uint8"));
    }
  }

  const uint8Array = new Uint8Array(array);

  return new DataView(uint8Array.buffer);
}

export function generateVmuChecksum(item: ItemChecksum): number {
  let checksum = 0x0;

  for (let i = item.control.offsetStart; i < item.control.offsetEnd; i += 0x1) {
    const int = getInt(i, "uint8");

    checksum ^= int << 0x8;

    for (let j = 0; j < 8; j += 1) {
      if (checksum & 0x8000) {
        checksum = (checksum << 0x1) ^ 0x1021;
      } else {
        checksum = checksum << 0x1;
      }
    }

    checksum &= 0xffff;
  }

  return checksum;
}
