import { get } from "svelte/store";

import { dataView } from "$lib/stores";
import { addPadding, getInt, removePadding, setInt } from "$lib/utils/bytes";
import { formatChecksum } from "$lib/utils/checksum";

import type { Item, ItemBitflag, ItemChecksum } from "$lib/types";

export function beforeInitDataView(dataView: DataView): DataView {
  return removePadding(dataView);
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
    checksum ^= getInt(i, "uint16", { bigEndian: true });

    const carry = checksum & 1;

    checksum >>>= 0x1;

    if (carry !== 0) {
      checksum ^= bitMask;
    }
  }

  return formatChecksum(checksum, item.dataType);
}

export function beforeSaving(): ArrayBufferLike {
  const $dataView = get(dataView);

  const paddedDataView = addPadding($dataView, 0xff);

  return paddedDataView.buffer;
}
