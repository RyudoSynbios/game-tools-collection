import { get } from "svelte/store";

import { gameRegion } from "$lib/stores";
import { getInt, setInt } from "$lib/utils/bytes";
import {
  customGetRegions,
  getHeaderShift,
  getPsvHeaderShift,
  getSlotShifts,
  isPsvHeader,
} from "$lib/utils/common/playstation";

import type { Item, ItemContainer, ItemInt } from "$lib/types";

export function initHeaderShift(dataView: DataView): number {
  return getHeaderShift(dataView);
}

export function overrideGetRegions(
  dataView: DataView,
  shift: number,
): string[] {
  return customGetRegions(dataView, shift);
}

export function initShifts(shifts: number[]): number[] {
  if (isPsvHeader()) {
    shifts = [...shifts, getPsvHeaderShift()];
  }

  return shifts;
}

export function overrideParseItem(item: Item): Item {
  const $gameRegion = get(gameRegion);

  if (
    "id" in item &&
    item.id === "time" &&
    ($gameRegion === 1 || $gameRegion === 2)
  ) {
    const itemInt = item as ItemInt;

    itemInt.operations![0] = { "/": 60 };

    return itemInt;
  }

  return item;
}

export function overrideParseContainerItemsShifts(
  item: ItemContainer,
  shifts: number[],
  index: number,
): [boolean, number[] | undefined] {
  if (item.id === "slots") {
    return getSlotShifts("correspondance", shifts, index);
  }

  return [false, undefined];
}

export function overrideItem(item: Item): Item {
  if ("id" in item && item.id?.match(/itemSlots-/)) {
    const itemInt = item as ItemInt;

    const character = getInt(itemInt.offset + 0x24, "bit", { bit: 0 });

    if (character === 0x1) {
      itemInt.max = 6;
    }

    return itemInt;
  } else if (
    "id" in item &&
    (item.id?.match(/item-/) || item.id?.match(/quantity-/))
  ) {
    const itemInt = item as ItemInt;

    const [index] = item.id.splitInt();

    let offset = itemInt.offset - 0x11d - index * 0x2;

    if (item.id.match(/quantity-/)) {
      offset -= 0x1;
    }

    const int = getInt(offset, "uint8");

    itemInt.disabled = index >= int;

    return itemInt;
  }

  return item;
}

export function overrideGetInt(item: Item): [boolean, number | undefined] {
  if (
    "id" in item &&
    (item.id?.match(/item-/) || item.id?.match(/quantity-/))
  ) {
    const itemInt = item as ItemInt;

    if (itemInt.disabled) {
      return [true, 0x0];
    }
  }

  return [false, undefined];
}

export function afterSetInt(item: Item): void {
  if ("id" in item && item.id === "location") {
    const itemInt = item as ItemInt;

    const int = getInt(itemInt.offset, "uint16", { bigEndian: true });

    let camera = 0x0;
    let lastVisitedRoom = 0x0;
    let coordinates = [0, 0];
    let rotation = 0;

    switch (int) {
      case 0x0:
      case 0x500:
        camera = 0x5;
        lastVisitedRoom = 0x1;
        coordinates = [3145, 8286];
        rotation = 2992;
        break;
      case 0x6:
      case 0x506:
        camera = 0x5;
        lastVisitedRoom = 0x7;
        coordinates = [13236, 15957];
        rotation = 3357;
        break;
      case 0x18:
      case 0x518:
        camera = 0x0;
        lastVisitedRoom = 0xb;
        coordinates = [2478, 7634];
        rotation = 3112;
        break;
      case 0x207:
        camera = 0x3;
        lastVisitedRoom = 0x8;
        coordinates = [6860, 19326];
        rotation = 1176;
        break;
      case 0x20e:
        camera = 0x0;
        lastVisitedRoom = 0xd;
        coordinates = [3948, 4769];
        rotation = 88;
        break;
      case 0x303:
        camera = 0x2;
        lastVisitedRoom = 0x0;
        coordinates = [4362, 3576];
        rotation = 1064;
        break;
      case 0x40e:
        camera = 0x0;
        lastVisitedRoom = 0xc;
        coordinates = [2593, 8592];
        rotation = 3136;
        break;
    }

    setInt(itemInt.offset + 0x2, "uint8", camera);
    setInt(itemInt.offset + 0x3, "uint8", lastVisitedRoom);
    setInt(itemInt.offset + 0x2c, "uint16", coordinates[0]);
    setInt(itemInt.offset + 0x2e, "uint16", coordinates[1]);
    setInt(itemInt.offset + 0x30, "uint16", rotation);
  }
}
