import { get } from "svelte/store";

import { gameRegion } from "$lib/stores";
import {
  customGetRegions,
  getSlotShifts,
  repackFile,
  resetState,
  unpackFile,
} from "$lib/utils/common/playstation";

import type { Item, ItemContainer, ItemInt } from "$lib/types";

export function beforeInitDataView(dataView: DataView): DataView {
  return unpackFile(dataView);
}

export function overrideGetRegions(): string[] {
  return customGetRegions();
}

export function onInitFailed(): void {
  resetState();
}

export function overrideParseItem(item: Item): Item {
  const $gameRegion = get(gameRegion);

  if ("id" in item && item.id === "time" && $gameRegion !== 0) {
    const itemInt = item as ItemInt;

    itemInt.operations![0] = { "/": 60 };

    return itemInt;
  }

  return item;
}

export function overrideParseContainerItemsShifts(
  item: ItemContainer,
): [boolean, number[] | undefined] {
  if (item.id === "slots") {
    return getSlotShifts(0);
  }

  return [false, undefined];
}

export function beforeSaving(): ArrayBufferLike {
  return repackFile();
}

export function onReset(): void {
  resetState();
}
