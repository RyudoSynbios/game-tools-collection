import { get } from "svelte/store";

import { dataView, gamePlatform } from "$lib/stores";
import {
  customGetRegions,
  getFileOffset,
  isPlaystation2SaveFile,
  repackFile,
  resetState,
  unpackFile,
} from "$lib/utils/common/playstation2";
import { getRegions } from "$lib/utils/validator";

import type { Item, ItemBitflags, ItemInt } from "$lib/types";

export function beforeInitDataView(dataView: DataView): DataView {
  if (isPlaystation2SaveFile(dataView)) {
    gamePlatform.set(1);
    return unpackFile(dataView);
  }

  gamePlatform.set(0);

  return dataView;
}

export function overrideGetRegions(dataView: DataView): string[] {
  const $gamePlatform = get(gamePlatform);

  if ($gamePlatform === 1) {
    return customGetRegions();
  }

  return getRegions(dataView);
}

export function onInitFailed(): void {
  resetState();
}

export function overrideParseItem(item: Item): Item {
  const $gamePlatform = get(gamePlatform);

  if ($gamePlatform === 0) {
    if ("dataType" in item && item.dataType === "bit") {
      const itemInt = item as ItemInt;

      itemInt.offset += 0x3;

      return itemInt;
    } else if ("dataType" in item && item.dataType === "uint32") {
      const itemInt = item as ItemInt;

      itemInt.bigEndian = true;

      return itemInt;
    } else if ("id" in item && item.id === "rewards") {
      const itemBitflags = item as ItemBitflags;

      itemBitflags.flags = itemBitflags.flags.map((flag) => ({
        ...flag,
        offset: flag.offset + 0x3,
      }));

      return itemBitflags;
    }
  }

  return item;
}

export function initShifts(shifts: number[]): number[] {
  const $gamePlatform = get(gamePlatform);

  if ($gamePlatform === 1) {
    return [...shifts, getFileOffset(0, "Savegame")];
  }

  return [...shifts, 0x48a4];
}

export function beforeSaving(): ArrayBufferLike {
  const $dataView = get(dataView);
  const $gamePlatform = get(gamePlatform);

  if ($gamePlatform === 1) {
    return repackFile();
  }

  return $dataView.buffer;
}

export function onReset(): void {
  resetState();
}
