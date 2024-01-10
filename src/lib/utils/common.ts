import { get } from "svelte/store";

import { dataView } from "$lib/stores";

import type { ItemChecksum } from "$lib/types";

import { getInt } from "./bytes";

// Nintendo: Game Boy Advance

export function extractGbaGameSharkHeader(
  dataView: DataView,
): [DataView, Uint8Array] {
  if (dataView.getUint16(0x0, true) === 0xd) {
    const validator = [
      0x53, 0x68, 0x61, 0x72, 0x6b, 0x50, 0x6f, 0x72, 0x74, 0x53, 0x61, 0x76,
      0x65,
    ];

    for (let i = 0x0; i < validator.length; i += 0x1) {
      if (dataView.getUint8(i + 0x4) !== validator[i]) {
        return [dataView, new Uint8Array()];
      }
    }

    const array = [];

    let offset = 0x0;

    for (let i = 0; i < 6; i += 1) {
      const length = dataView.getUint16(offset, true);

      for (let j = 0x0; j < 0x4 + length; j += 0x1) {
        array.push(dataView.getUint8(offset + j));
      }

      offset += 0x4 + length;
    }

    const uint8Array = new Uint8Array(dataView.buffer);

    uint8Array.set(uint8Array.slice(array.length));

    return [new DataView(uint8Array.buffer), new Uint8Array(array)];
  }

  return [dataView, new Uint8Array()];
}

// Nintendo: Nintendo 64

export function extractN64DexDriveHeader(
  dataView: DataView,
): [DataView, Uint8Array] {
  if (dataView.getUint8(0x0) === 0x31) {
    const validator = [
      0x31, 0x32, 0x33, 0x2d, 0x34, 0x35, 0x36, 0x2d, 0x53, 0x54, 0x44,
    ];

    for (let i = 0x0; i < validator.length; i += 0x1) {
      if (dataView.getUint8(i) !== validator[i]) {
        return [dataView, new Uint8Array()];
      }
    }

    const array = [];

    for (let i = 0x0; i < 0x1540; i += 0x1) {
      array.push(dataView.getUint8(i));
    }

    const uint8Array = new Uint8Array(dataView.buffer);

    uint8Array.set(uint8Array.slice(array.length));

    return [new DataView(uint8Array.buffer), new Uint8Array(array)];
  }

  return [dataView, new Uint8Array()];
}

// Sega: Dreamcast

export function vmuToDataView(dataView: DataView): DataView {
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

  const uint8Array = new Uint8Array(array.length);

  uint8Array.set(array);

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

  const uint8Array = new Uint8Array(array.length);

  uint8Array.set(array);

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

// Sony: Playstation

export function checkPlaystationSlots(
  index: number,
  validators: number[][],
): boolean {
  const offset = (index + 1) * 0x80 + 0xa;
  const length = validators[0].length;

  for (let i = offset; i < offset + length; i += 0x1) {
    if (
      validators.every(
        (validator) => getInt(i, "uint8") !== validator[i - offset],
      )
    ) {
      return false;
    }
  }

  if (getInt(offset - 0xa, "uint8") !== 0x51) {
    return false;
  }

  return true;
}
