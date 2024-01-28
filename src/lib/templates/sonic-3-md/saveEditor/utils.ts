import { get } from "svelte/store";

import { dataView } from "$lib/stores";
import { getInt, setInt } from "$lib/utils/bytes";
import { formatChecksum } from "$lib/utils/checksum";

import type { Item, ItemBitflag, ItemChecksum } from "$lib/types";

export function beforeInitDataView(dataView: DataView): DataView {
  const array = [];

  for (let i = 0x0; i < dataView.byteLength; i += 0x1) {
    if (i % 0x2 !== 0) {
      array.push(getInt(i, "uint8", {}, dataView));
    }
  }

  const uint8Array = new Uint8Array(array);

  return new DataView(uint8Array.buffer);
}

export function afterSetInt(item: Item, flag: ItemBitflag): void {
  if ("id" in item && item.id === "chaosEmeralds") {
    const emeralds = getInt(flag.offset, "uint8").toBitCount();

    setInt(flag.offset - 0x1, "uint8", emeralds);
  }
}

// Adapted from https://gitlab.com/jcfields/sonic3-save-editor/-/blob/master/save%20format.md?ref_type=heads
export function generateChecksum(item: ItemChecksum): number {
  const bitMask = 0x8810;

  let checksum = 0x0;

  for (let i = item.control.offsetStart; i < item.control.offsetEnd; i += 0x2) {
    checksum ^= (getInt(i, "uint8") << 8) | getInt(i + 0x1, "uint8");

    const carry = checksum & 1;

    checksum >>>= 1;

    if (carry !== 0) {
      checksum ^= bitMask;
    }
  }

  return formatChecksum(checksum, item.dataType);
}

export function beforeSaving(): ArrayBufferLike {
  const $dataView = get(dataView);

  const array = [];

  let j = 0x0;

  for (let i = 0x0; i < $dataView.byteLength; i += 0x1) {
    if (j % 0x2 === 0) {
      array.push(0xff);

      j += 0x1;
    }

    array.push(getInt(i, "uint8"));

    j += 0x1;
  }

  const uint8Array = new Uint8Array(array);

  return uint8Array.buffer;
}
