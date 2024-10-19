import { get } from "svelte/store";

import { dataView } from "$lib/stores";
import { getInt, setInt } from "$lib/utils/bytes";

import { Item, ItemInt } from "$lib/types";

export function beforeInitDataView(dataView: DataView): DataView {
  return decodeSave(dataView);
}

export function initShifts(shifts: number[]): number[] {
  return [...shifts, 0x2060];
}

export function overrideGetInt(item: Item): [boolean, number | undefined] {
  if ("id" in item && item.id === "sounds") {
    const itemInt = item as ItemInt;

    const int = 100 - getInt(itemInt.offset, "int8");

    return [true, int];
  } else if ("id" in item && item.id === "music") {
    const itemInt = item as ItemInt;

    const int = 100 + getInt(itemInt.offset, "int8");

    return [true, int];
  } else if ("id" in item && item.id === "vsPlayMatchTotal") {
    const itemInt = item as ItemInt;

    let count = 0x0;

    for (let i = 0x0; i < 0x5; i += 0x1) {
      count += getInt(itemInt.offset + i * 0x4, "uint32", { bigEndian: true });
    }

    return [true, count];
  }

  return [false, undefined];
}

export function overrideSetInt(item: Item, value: string): boolean {
  if ("id" in item && item.id === "sounds") {
    const itemInt = item as ItemInt;

    const int = parseInt(value);

    setInt(itemInt.offset, "uint8", 100 - int);

    return true;
  } else if ("id" in item && item.id === "music") {
    const itemInt = item as ItemInt;

    const int = parseInt(value);

    setInt(itemInt.offset, "uint8", int - 100);

    return true;
  }

  return false;
}

export function afterSetInt(item: Item): void {
  if ("id" in item && item.id?.match(/trophy-/)) {
    const itemInt = item as ItemInt;

    const split = item.id.split("-");

    const index = parseInt(split[1]);

    const offset = itemInt.offset - index * 0x2;

    let count = 0;

    for (let i = 0; i < 0x12c; i += 1) {
      const int = getInt(offset + i * 0x2, "uint8");

      let isChecked = 0;

      if (int > 0x0) {
        count += 1;
        isChecked = 1;
      }

      const flagOffset =
        offset - 0x17a + Math.floor(i / 0x20) * 0x8 - Math.floor(i / 8);

      setInt(flagOffset, "bit", isChecked, { bit: i % 8 });
    }

    setInt(offset - 0x5, "uint16", count, { bigEndian: true });
  } else if ("id" in item && item.id === "combinedVsPlayTime") {
    const itemInt = item as ItemInt;

    const int = getInt(itemInt.offset, "uint32", { bigEndian: true });

    setInt(itemInt.offset - 0x1c4, "uint32", int, { bigEndian: true });
  } else if ("id" in item && item.id?.match(/vsMatchTotal-/)) {
    const itemInt = item as ItemInt;

    const split = item.id.split("-");

    const index = parseInt(split[1]);

    const offset = itemInt.offset - index * 0x4;

    let count = 0x0;

    for (let i = 0x0; i < 0x5; i += 0x1) {
      const int = getInt(offset + i * 0x4, "uint32", {
        bigEndian: true,
      });

      if (i === 2) {
        setInt(offset - 0x17c, "uint32", int, { bigEndian: true });
      }

      count += int;
    }

    setInt(offset - 0x1a8, "uint32", count, { bigEndian: true });
    setInt(offset - 0x188, "uint32", count, { bigEndian: true });
    setInt(offset - 0x180, "uint32", count, { bigEndian: true });
  }
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
