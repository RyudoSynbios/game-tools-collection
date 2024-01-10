import { get } from "svelte/store";

import { dataView } from "$lib/stores";

import type { ItemChecksum } from "$lib/types";

import { getInt } from "../bytes";

export function isDciFile(
  dataView = new DataView(new ArrayBuffer(0)),
): boolean {
  const firstHex =
    dataView.byteLength > 0 ? dataView.getUint8(0x0) : getInt(0x0, "uint8");

  if (dataView.byteLength !== 0x20000 && firstHex === 0x33) {
    return true;
  }

  return false;
}

export function dciToDataView(dataView: DataView): [DataView, Uint8Array] {
  const array = [];

  for (let i = 0x0; i < 0x20; i += 0x1) {
    array.push(dataView.getUint8(i));
  }

  for (let i = 0x20; i < dataView.byteLength; i += 0x4) {
    array.push(
      dataView.getUint8(i + 0x3),
      dataView.getUint8(i + 0x2),
      dataView.getUint8(i + 0x1),
      dataView.getUint8(i),
    );
  }

  const uint8Array = new Uint8Array(array);

  return [new DataView(uint8Array.buffer), new Uint8Array()];
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

export function vmuToDataView(dataView: DataView): [DataView, Uint8Array] {
  const array = [];

  const blocks = dataView.byteLength / 0x200;

  if (blocks !== 256) {
    return [dataView, new Uint8Array()];
  }

  for (let i = dataView.byteLength - 0x200; i >= 0; i -= 0x200) {
    for (let j = 0x0; j < 0x200; j += 0x1) {
      array.push(dataView.getUint8(i + j));
    }
  }

  const uint8Array = new Uint8Array(array);

  return [new DataView(uint8Array.buffer), new Uint8Array()];
}

export function dataViewToVmu(): ArrayBufferLike {
  const $dataView = get(dataView);

  const array = [];

  for (let i = $dataView.byteLength - 0x200; i >= 0; i -= 0x200) {
    for (let j = 0x0; j < 0x200; j += 0x1) {
      array.push(getInt(i + j, "uint8"));
    }
  }

  const uint8Array = new Uint8Array(array);

  return uint8Array.buffer;
}

export function generateVmuChecksum(item: ItemChecksum): number {
  let checksum = 0x0;

  for (
    let i = item.control.offset;
    i < item.control.offset + item.control.length;
    i += 0x1
  ) {
    let int = getInt(i, "uint8");

    if (i === item.offset || i === item.offset + 1) {
      int = 0x0;
    }

    checksum ^= int << 8;

    for (let j = 0; j < 8; j += 1) {
      if (checksum & 0x8000) {
        checksum = (checksum << 1) ^ 0x1021;
      } else {
        checksum = checksum << 1;
      }
    }

    checksum &= 0xffff;
  }

  return checksum;
}
