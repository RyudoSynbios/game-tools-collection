import { get } from "svelte/store";

import { gameRegion } from "$lib/stores";
import { getInt } from "$lib/utils/bytes";
import { formatChecksum } from "$lib/utils/checksum";
import { byteswapDataView, getHeaderShift } from "$lib/utils/common/nintendo64";

import type { Item, ItemChecksum, ItemInt } from "$lib/types";

export function initHeaderShift(dataView: DataView): number {
  return getHeaderShift(dataView, "eep");
}

export function beforeInitDataView(dataView: DataView): DataView {
  return byteswapDataView("eep", dataView);
}

export function overrideParseItem(item: Item): Item {
  const $gameRegion = get(gameRegion);

  if ("id" in item && item.id === "language") {
    const itemInt = item as ItemInt;

    itemInt.hidden = $gameRegion === 1;

    return itemInt;
  }

  return item;
}

export function overrideItem(item: Item): Item {
  if ("id" in item && item.id?.match(/capGround-/)) {
    const itemInt = item as ItemInt;

    const [shift] = item.id.splitInt();

    const location = getInt(itemInt.offset - shift + 0x9, "uint8", {
      binary: {
        bitStart: 0,
        bitLength: 4,
      },
    });

    itemInt.disabled = location !== 1;

    return itemInt;
  }

  return item;
}

export function overrideGetInt(item: Item): [boolean, number | undefined] {
  if ("id" in item && item.id === "totalStars") {
    const itemInt = item as ItemInt;

    let count = 0;

    count += getInt(itemInt.offset, "uint8", {
      binary: { bitStart: 0, bitLength: 5 },
    }).toBitCount();

    for (let i = 0x0; i < 0xf; i += 0x1) {
      count += getInt(itemInt.offset + 0x4 + i, "uint8", {
        binary: { bitStart: 0, bitLength: 7 },
      }).toBitCount();
    }

    for (let i = 0x0; i < 0x9; i += 0x1) {
      count += getInt(itemInt.offset + 0x13 + i, "bit", { bit: 0 });
    }

    count += getInt(itemInt.offset + 0x16, "bit", { bit: 1 });

    return [true, count];
  }

  return [false, undefined];
}

export function generateChecksum(item: ItemChecksum): number {
  let checksum = 0x0;

  for (let i = item.control.offsetStart; i < item.control.offsetEnd; i += 0x1) {
    checksum += getInt(i, "uint8");
  }

  return formatChecksum(checksum, item.dataType);
}

export function beforeSaving(): ArrayBufferLike {
  return byteswapDataView("eep").buffer;
}
