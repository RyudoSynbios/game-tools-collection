import { get } from "svelte/store";

import { dataView } from "$lib/stores";
import { getInt, setInt } from "$lib/utils/bytes";

import type { Item, ItemChecksum, ItemInt } from "$lib/types";

export function beforeInitDataView(dataView: DataView): DataView {
  const array = [];

  for (let i = 0x0; i < dataView.byteLength; i += 0x1) {
    if (i >= 0xc0 && i % 0x40 === 0 && dataView.getUint8(i) === 0) {
      i += 0x3;
    } else {
      array.push(dataView.getUint8(i));
    }
  }

  const uint8Array = new Uint8Array(array.length);

  uint8Array.set(array);

  return new DataView(uint8Array.buffer);
}

export function afterSetInt(item: Item): void {
  if ("id" in item && item.id === "location") {
    const itemInt = item as ItemInt;

    const value = getInt(itemInt.offset, "uint8");

    setInt(itemInt.offset + 4, "uint8", value);
  }
}

export function generateChecksum(item: ItemChecksum): number {
  let checksum = 0x0;

  for (
    let i = item.control.offset;
    i < item.control.offset + item.control.length;
    i += 0x1
  ) {
    checksum += getInt(i, "uint8");
  }

  return checksum;
}

export function beforeSaving(): ArrayBufferLike {
  const $dataView = get(dataView);

  const array = [];

  let j = 0x0;

  for (let i = 0x0; i < $dataView.byteLength; i += 0x1) {
    if (i >= 0xc0 && j % 0x40 === 0 && $dataView.getUint8(i) !== 0x80) {
      array.push(0x0, 0x0, 0x0, 0x0);

      j += 0x4;
    }

    array.push($dataView.getUint8(i));

    j += 0x1;
  }

  const uint8Array = new Uint8Array(array.length);

  uint8Array.set(array);

  return uint8Array.buffer;
}
