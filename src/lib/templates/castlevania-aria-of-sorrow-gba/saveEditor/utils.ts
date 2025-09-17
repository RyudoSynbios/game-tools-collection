import { get } from "svelte/store";

import { dataView, gameRegion } from "$lib/stores";
import { getInt, setInt } from "$lib/utils/bytes";
import {
  customGetRegions,
  extractCastlevaniaCollectionSaves,
  getShifts,
  injectCastlevaniaCollectionSaves,
  isCastlevaniaCollectionSave,
  resetState,
} from "$lib/utils/common/castlevania";
import { getHeaderShift } from "$lib/utils/common/gameBoyAdvance";

import type { Item, ItemBitflag, ItemBitflags, ItemInt } from "$lib/types";

const GAME = "aos";

export function initHeaderShift(dataView: DataView): number {
  return getHeaderShift(dataView);
}

export function beforeInitDataView(dataView: DataView): DataView {
  if (isCastlevaniaCollectionSave(GAME, dataView)) {
    dataView = extractCastlevaniaCollectionSaves(GAME, dataView);
  }

  return dataView;
}

export function overrideGetRegions(
  dataView: DataView,
  shift: number,
): string[] {
  return customGetRegions(dataView, shift);
}

export function initShifts(shifts: number[]): number[] {
  return getShifts(shifts);
}

export function overrideParseItem(item: Item): Item {
  const $gameRegion = get(gameRegion);

  if ("id" in item && item.id === "language") {
    const itemInt = item as ItemInt;

    itemInt.hidden = $gameRegion !== 0;

    return itemInt;
  }

  return item;
}

export function overrideGetInt(
  item: Item,
): [boolean, (ItemBitflag & { checked: boolean })[] | undefined] {
  if ("id" in item && item.id === "abilities") {
    const itemBitflags = item as ItemBitflags;

    const flags = itemBitflags.flags.reduce(
      (flags: (ItemBitflag & { checked: boolean })[], flag) => {
        flags.push({
          ...flag,
          checked:
            getInt(flag.offset, flag.bit === 0 ? "lower4" : "upper4") > 0,
        });

        return flags;
      },
      [],
    );

    return [true, flags];
  }

  return [false, undefined];
}

export function overrideSetInt(
  item: Item,
  value: string,
  flag: ItemBitflag,
): boolean {
  if ("id" in item && item.id === "abilities") {
    setInt(flag.offset, flag.bit === 0 ? "lower4" : "upper4", value);

    return true;
  }

  return false;
}

export function afterSetInt(item: Item): void {
  if ("id" in item && item.id === "gold") {
    const itemInt = item as ItemInt;

    const value = getInt(itemInt.offset, "uint32");

    setInt(itemInt.offset + 0x170, "uint32", value);
  } else if ("id" in item && item.id === "level") {
    const itemInt = item as ItemInt;

    const value = getInt(itemInt.offset, "uint8");

    setInt(itemInt.offset + 0x17f, "uint8", value);
  }
}

export function beforeSaving(): ArrayBufferLike {
  const $dataView = get(dataView);

  if (isCastlevaniaCollectionSave(GAME)) {
    return injectCastlevaniaCollectionSaves(GAME);
  }

  return $dataView.buffer;
}

export function onReset(): void {
  resetState();
}
