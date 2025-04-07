import { get } from "svelte/store";

import { fileHeaderShift, gameRegion } from "$lib/stores";
import { getInt, getString } from "$lib/utils/bytes";
import {
  byteswapDataView,
  generateRareChecksum,
  getHeaderShift,
} from "$lib/utils/common/nintendo64";

import type { Item, ItemChecksum, ItemContainer, ItemInt } from "$lib/types";

export function initHeaderShift(dataView: DataView): number {
  return getHeaderShift(dataView, "eep");
}

export function beforeInitDataView(dataView: DataView): DataView {
  return byteswapDataView("eep", dataView);
}

export function overrideShift(item: Item, shifts: number[]): number[] {
  const $fileHeaderShift = get(fileHeaderShift);

  if ("id" in item && item.id?.match(/^extra/)) {
    for (let i = 0; i < 2; i += 1) {
      const offset = i * 0x80;

      const int = getInt($fileHeaderShift + offset, "uint32", {
        bigEndian: true,
      });

      if (int !== 0x0) {
        return [...shifts, offset];
      }
    }
  }

  return shifts;
}

export function overrideParseContainerItemsShifts(
  item: ItemContainer,
  shifts: number[],
  index: number,
): [boolean, number[] | undefined] {
  const $fileHeaderShift = get(fileHeaderShift);

  if (item.id === "slots") {
    for (let i = 0; i < item.instances + 1; i += 1) {
      const offset = 0x100 + i * item.length;

      const magic = getString($fileHeaderShift + offset + 0x0, 0x4, "uint8");
      const saveIndex = getInt($fileHeaderShift + offset + 0xa, "uint8");

      if (magic === "KHJC" && saveIndex === index + 1) {
        return [true, [...shifts, offset]];
      }
    }

    return [true, [-1]];
  }

  return [false, undefined];
}

export function overrideItem(item: Item): Item {
  const $gameRegion = get(gameRegion);

  if ("id" in item && item.id === "extra-screenScale") {
    const itemInt = item as ItemInt;

    itemInt.hidden = $gameRegion === 1;

    return itemInt;
  } else if ("id" in item && item.id === "extra-language") {
    const itemInt = item as ItemInt;

    itemInt.hidden = $gameRegion !== 0;

    return itemInt;
  }

  return item;
}

export function generateChecksum(
  item: ItemChecksum,
  dataView = new DataView(new ArrayBuffer(0)),
): bigint {
  const [checksum1, checksum2] = generateRareChecksum(item, dataView);

  const high = checksum1.toString(16).padStart(8, "0").slice(-8);
  const low = checksum1.xor(checksum2).toString(16).padStart(8, "0").slice(-8);

  return BigInt(`0x${high}${low}`);
}

export function beforeSaving(): ArrayBufferLike {
  return byteswapDataView("eep").buffer;
}
