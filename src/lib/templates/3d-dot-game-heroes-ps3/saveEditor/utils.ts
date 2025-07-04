import { get } from "svelte/store";

import { gameRegion } from "$lib/stores";
import { getInt } from "$lib/utils/bytes";

import { Item, ItemInt, ItemString } from "$lib/types";

export function initShifts(shifts: number[]): number[] {
  const nameLength = getInt(0x0, "uint32", { bigEndian: true });

  shifts = [...shifts, nameLength];

  return shifts;
}

export function overrideShift(item: Item, shifts: number[]): number[] {
  if ("id" in item && item.id === "name") {
    return shifts.slice(0, -1);
  }

  return shifts;
}

export function overrideParseItem(item: Item): Item {
  const $gameRegion = get(gameRegion);

  if ("id" in item && item.id === "japanExclude") {
    const itemInt = item as ItemInt;

    itemInt.hidden = $gameRegion === 1;

    return itemInt;
  }

  return item;
}

export function overrideItem(item: Item): Item {
  if ("id" in item && item.id === "name") {
    const itemString = item as ItemString;

    itemString.length = getInt(0x0, "uint32", { bigEndian: true });

    return itemString;
  }

  return item;
}
