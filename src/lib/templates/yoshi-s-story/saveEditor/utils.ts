import { get } from "svelte/store";

import { gameRegion } from "$lib/stores";
import { bitToOffset, getInt } from "$lib/utils/bytes";
import { formatChecksum } from "$lib/utils/checksum";
import { byteswapDataView, getHeaderShift } from "$lib/utils/common/nintendo64";

import type {
  Item,
  ItemBitflags,
  ItemChecksum,
  ItemContainer,
  ItemInt,
  ItemTab,
} from "$lib/types";

const SAVE_FORMAT = "eep";

export function initHeaderShift(dataView: DataView): number {
  return getHeaderShift(dataView, SAVE_FORMAT);
}

export function beforeInitDataView(dataView: DataView): DataView {
  return byteswapDataView(SAVE_FORMAT, dataView);
}

export function overrideParseItem(item: Item): Item | ItemTab {
  const $gameRegion = get(gameRegion);

  if ($gameRegion === 2) {
    if ("id" in item && item.id === "unlockedYoshis") {
      const itemBitflags = item as ItemBitflags;

      itemBitflags.flags[0].offset += 0x2;
      itemBitflags.flags[0].bit = 0;
      itemBitflags.flags[1].offset += 0x1;
      itemBitflags.flags[1].bit = 7;

      return itemBitflags;
    } else if ("id" in item && item.id === "continueData") {
      const itemTab = item as ItemTab;

      itemTab.hidden = true;

      return itemTab;
    } else if ("id" in item && item.id?.match(/trialStatus-/)) {
      const itemInt = item as ItemInt;

      let [index] = item.id.splitInt();

      if (index === 0) {
        itemInt.offset -= 0x4;
      }

      index += 7;

      itemInt.offset += bitToOffset(23 - index) + 0x1;
      itemInt.bit = index % 8;

      return itemInt;
    } else if ("id" in item && item.id === "audio") {
      const itemInt = item as ItemInt;

      itemInt.binary!.bitStart = 0;

      return itemInt;
    } else if ("id" in item && item.id === "language") {
      const itemInt = item as ItemInt;

      itemInt.hidden = true;

      return itemInt;
    }
  } else {
    if ("id" in item && item.id?.match(/trialStatus-/)) {
      const itemInt = item as ItemInt;

      const [index] = item.id.splitInt();

      itemInt.offset += bitToOffset(23 - index);
      itemInt.bit = index % 8;

      return itemInt;
    }
  }

  return item;
}

export function overrideParseContainerItemsShifts(
  item: ItemContainer,
  shifts: number[],
  index: number,
): [boolean, number[] | undefined] {
  const $gameRegion = get(gameRegion);

  if (item.id === "ranking" && $gameRegion === 2) {
    return [true, [...shifts, 0x4, index * item.length]];
  }

  return [false, undefined];
}

export function generateChecksum(item: ItemChecksum): number {
  let checksum = 0x0;

  for (let i = item.control.offsetStart; i < item.control.offsetEnd; i += 0x1) {
    checksum = (checksum ^ getInt(i, "uint8")) << 0x1;
    checksum %= 0xffff;
  }

  return formatChecksum(checksum, item.dataType);
}

export function beforeSaving(): ArrayBufferLike {
  return byteswapDataView(SAVE_FORMAT).buffer;
}
