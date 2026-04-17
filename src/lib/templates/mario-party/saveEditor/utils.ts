import { get } from "svelte/store";

import { gameRegion } from "$lib/stores";
import { bitToOffset, getInt, setInt } from "$lib/utils/bytes";
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

  if ("id" in item && item.id?.match(/time-/) && $gameRegion !== 0) {
    const itemInt = item as ItemInt;

    const [, type] = item.id.split("-");

    if (type === "25") {
      itemInt.operations![0] = { "/": 30 };
    } else if (type === "50") {
      itemInt.operations![0] = { "/": 60 };
    }

    return itemInt;
  } else if ("id" in item && item.id === "language") {
    const itemInt = item as ItemInt;

    itemInt.hidden = $gameRegion !== 0;

    return itemInt;
  }

  return item;
}

export function overrideGetInt(item: Item): [boolean, number | undefined] {
  if ("id" in item && item.id === "koopaTroopaSpace") {
    const itemInt = item as ItemInt;

    const map = getInt(itemInt.offset - 0xb, "uint8");

    const position = getInt(itemInt.offset, "uint16", {
      bigEndian: itemInt.bigEndian,
    });

    const int = (map << 0x10) | position;

    return [true, int];
  }

  return [false, undefined];
}

export function overrideSetInt(item: Item, value: string): boolean {
  if ("id" in item && item.id === "koopaTroopaSpace") {
    const itemInt = item as ItemInt;

    const int = parseInt(value);

    const map = int >> 0x10;
    const position = int & 0xffff;

    setInt(itemInt.offset - 0xb, "uint8", map);

    setInt(itemInt.offset, "uint16", position, {
      bigEndian: itemInt.bigEndian,
    });

    return true;
  }

  return false;
}

export function afterSetInt(item: Item): void {
  if ("id" in item && item.id?.match(/boardPlayed-/)) {
    const itemInt = item as ItemInt;

    const [index] = item.id.splitInt();

    const value = getInt(itemInt.offset, "uint16", {
      bigEndian: true,
      binary: itemInt.binary,
    });

    const offset = itemInt.offset - index * 0x4 + 0x2a;

    setInt(offset + bitToOffset(index + 0x1), "bit", value > 0x0 ? 0x1 : 0x0, {
      bit: (index + 1) % 8,
    });
  }
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
