import { get } from "svelte/store";

import { dataView } from "$lib/stores";
import { getInt } from "$lib/utils/bytes";

export function beforeInitDataView(dataView: DataView): DataView {
  return decodeSave(dataView);
}

export function initShifts(shifts: number[]): number[] {
  return [...shifts, 0x2060];
}

export function beforeSaving(): ArrayBufferLike {
  return encodeSave();
}

const dataArray = [
  0x26, 0xff, 0xe8, 0xef, 0x42, 0xd6, 0x01, 0x54, 0x14, 0xa3, 0x80, 0xfd, 0x6e,
];

function decodeSave(dataView: DataView) {
  let previous = 0x0;

  for (let i = 0x80; i < dataView.byteLength; i += 0x1) {
    const encoded = getInt(i, "uint8", {}, dataView);

    let decoded = 0x0;

    switch (previous % 7) {
      case 0:
        decoded =
          (encoded & 0x80) |
          ((encoded >> 0x1) & 0x20) |
          ((encoded >> 0x2) & 0x8) |
          ((encoded >> 0x3) & 0x2) |
          ((encoded & 0x8) << 0x3) |
          ((encoded & 0x4) << 0x2) |
          (encoded & 0x1) |
          ((encoded & 0x2) << 0x1);
        break;
      case 1:
        decoded =
          ((encoded >> 0x1) & 0x40) |
          ((encoded >> 0x3) & 0x8) |
          ((encoded >> 0x1) & 0x10) |
          ((encoded & 0x10) << 0x1) |
          ((encoded >> 0x3) & 0x1) |
          (encoded & 0x4) |
          ((encoded & 0x1) << 0x1) |
          ((encoded & 0x2) << 0x6);
        break;
      case 2:
        decoded =
          ((encoded >> 0x2) & 0x20) |
          ((encoded >> 0x6) & 0x1) |
          ((encoded >> 0x4) & 0x2) |
          ((encoded & 0x10) << 0x3) |
          ((encoded & 0x8) << 0x1) |
          ((encoded & 0x4) << 0x4) |
          ((encoded & 0x3) << 0x2);
        break;
      case 3:
        decoded =
          ((encoded >> 0x5) & 0x4) |
          ((encoded & 0x40) << 0x1) |
          ((encoded & 0x20) << 0x1) |
          ((encoded >> 0x1) & 0x8) |
          ((encoded >> 0x2) & 0x2) |
          ((encoded & 0x4) << 0x3) |
          ((encoded & 0x1) << 0x4) |
          ((encoded >> 0x1) & 0x1);
        break;
      case 4:
        decoded =
          ((encoded >> 0x7) & 0x1) |
          ((encoded >> 0x2) & 0x10) |
          ((encoded >> 0x3) & 0x4) |
          ((encoded & 0x10) << 0x2) |
          ((encoded & 0x8) << 0x4) |
          ((encoded >> 0x1) & 0x2) |
          ((encoded & 0x1) << 0x3) |
          ((encoded & 0x2) << 0x4);
        break;
      case 5:
        decoded =
          ((encoded >> 0x3) & 0x10) |
          ((encoded >> 0x5) & 0x2) |
          ((encoded >> 0x5) & 0x1) |
          ((encoded >> 0x2) & 0x4) |
          (encoded & 0x8) |
          ((encoded & 0x7) << 0x5);
        break;
      case 6:
        decoded =
          ((encoded >> 0x4) & 0x8) |
          ((encoded >> 0x4) & 0x4) |
          ((encoded & 0x20) << 0x2) |
          (encoded & 0x10) |
          ((encoded & 0x8) << 0x2) |
          ((encoded >> 0x2) & 0x1) |
          ((encoded & 0x1) << 0x6) |
          (encoded & 0x2);
    }

    const int = decoded ^ dataArray[(previous & 0xff) % 0xd] ^ previous;

    dataView.setUint8(i, int);

    previous = encoded;
  }

  return dataView;
}

function encodeSave() {
  const $dataView = get(dataView);

  const encodedDataView = new DataView($dataView.buffer);

  let previous = 0x0;

  for (let i = 0x80; i < $dataView.byteLength; i += 0x1) {
    const decoded = getInt(i, "uint8");

    let encoded = 0x0;

    encoded = decoded ^ previous ^ dataArray[decoded % 0xd];

    let int = encoded;

    switch (decoded % 7) {
      case 0:
        int =
          (encoded & 0x80) |
          ((encoded >> 0x3) & 0x8) |
          ((encoded & 0x20) << 0x1) |
          ((encoded >> 0x2) & 0x4) |
          ((encoded & 0x8) << 0x2) |
          ((encoded >> 0x1) & 0x2) |
          (encoded & 0x1) |
          ((encoded & 0x2) << 0x3);
      case 1:
        int =
          ((encoded >> 0x6) & 0x2) |
          ((encoded & 0x40) << 0x1) |
          ((encoded >> 0x1) & 0x10) |
          ((encoded & 0x10) << 0x1) |
          ((encoded & 0x8) << 0x3) |
          (encoded & 0x4) |
          ((encoded & 0x1) << 0x3) |
          ((encoded >> 0x1) & 0x1);
      case 2:
        int =
          ((encoded >> 0x3) & 0x10) |
          ((encoded >> 0x4) & 0x4) |
          ((encoded & 0x20) << 0x2) |
          ((encoded >> 0x1) & 0x8) |
          ((encoded >> 0x2) & 0x2) |
          ((encoded >> 0x2) & 0x1) |
          ((encoded & 0x1) << 0x6) |
          ((encoded & 0x2) << 0x4);
      case 3:
        int =
          ((encoded >> 0x1) & 0x40) |
          ((encoded >> 0x1) & 0x20) |
          ((encoded >> 0x3) & 0x4) |
          ((encoded >> 0x4) & 0x1) |
          ((encoded & 0x8) << 0x1) |
          ((encoded & 0x4) << 0x5) |
          ((encoded & 0x1) << 0x1) |
          ((encoded & 0x2) << 0x2);
      case 4:
        int =
          ((encoded >> 0x4) & 0x8) |
          ((encoded >> 0x2) & 0x10) |
          ((encoded >> 0x4) & 0x2) |
          ((encoded & 0x10) << 0x2) |
          ((encoded >> 0x3) & 0x1) |
          ((encoded & 0x4) << 0x3) |
          ((encoded & 0x1) << 0x7) |
          ((encoded & 0x2) << 0x1);
      case 5:
        int =
          ((encoded >> 0x5) & 0x4) |
          ((encoded >> 0x5) & 0x2) |
          ((encoded >> 0x5) & 0x1) |
          ((encoded & 0x10) << 0x3) |
          (encoded & 0x8) |
          ((encoded & 0x4) << 0x2) |
          ((encoded & 0x3) << 0x5);
      case 6:
        int =
          ((encoded >> 0x2) & 0x20) |
          ((encoded >> 0x6) & 0x1) |
          ((encoded >> 0x2) & 0x8) |
          (encoded & 0x10) |
          ((encoded & 0x8) << 0x4) |
          ((encoded & 0x4) << 0x4) |
          ((encoded & 0x1) << 0x2) |
          (encoded & 0x2);
    }

    encodedDataView.setUint8(i, int);

    previous = decoded;
  }

  return encodedDataView.buffer;
}
