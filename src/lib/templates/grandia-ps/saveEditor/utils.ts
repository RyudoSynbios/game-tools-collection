import { get } from "svelte/store";

import { gameRegion } from "$lib/stores";
import { getInt, setInt, setString } from "$lib/utils/bytes";
import {
  customGetRegions,
  getHeaderShift,
  getPsvHeaderShift,
  getSlotShifts,
  isPsvHeader,
} from "$lib/utils/common/playstation";
import { getResource } from "$lib/utils/parser";

import type { Item, ItemContainer, ItemInt, Resource } from "$lib/types";

import { locationsCoordinates } from "./utils/resource";

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
  const $gameRegion = get(gameRegion);

  if (isPsvHeader()) {
    shifts = [...shifts, getPsvHeaderShift()];
  }

  if ($gameRegion === 1 || $gameRegion == 2) {
    return [...shifts, 0x180];
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
  if ("id" in item && item.id === "location") {
    const itemInt = item as ItemInt;

    let disc = getInt(itemInt.offset + 0x35, "uint8");

    if (disc === 0x82) {
      disc = 0xc;
    }

    itemInt.resource = `disc${disc}Locations`;

    return itemInt;
  }

  return item;
}

export function overrideGetInt(item: Item): [boolean, boolean | undefined] {
  if ("id" in item && item.id?.match(/skill-/)) {
    const itemInt = item as ItemInt;

    const [characterIndex] = item.id.splitInt();

    const boolean = Boolean(
      getInt(itemInt.offset, "bit", {
        bit: characterIndex,
      }),
    );

    return [true, boolean];
  }

  return [false, undefined];
}

export function overrideSetInt(item: Item, value: string): boolean {
  if ("id" in item && item.id?.match(/skill-/)) {
    const itemInt = item as ItemInt;

    const [characterIndex] = item.id.splitInt();

    setInt(itemInt.offset, "bit", value, {
      bit: characterIndex,
    });

    return true;
  }

  return false;
}

export function afterSetInt(item: Item): void {
  if ("id" in item && item.id === "disc") {
    const itemInt = item as ItemInt;

    updateLocation(itemInt.offset - 0x35);
  } else if ("id" in item && item.id === "location") {
    const itemInt = item as ItemInt;

    const int = getInt(itemInt.offset, "uint16");

    updateLocation(itemInt.offset, int);
  } else if ("id" in item && item.id === "formation") {
    const itemInt = item as ItemInt;

    const int = getInt(itemInt.offset, "uint8");

    let character2 = 0x0;
    let character3 = 0x0;
    let character4 = 0x0;

    switch (int) {
      case 0x1:
        character2 = 0x3;
        break;
      case 0x2:
        character2 = 0x3;
        character3 = 0x2;
        break;
      case 0x3:
        character2 = 0x2;
        break;
      case 0x4:
        character2 = 0x3;
        character3 = 0x2;
        break;
      case 0x5:
        character2 = 0x3;
        character3 = 0x2;
        character4 = 0x4;
        break;
      case 0x8:
        character2 = 0x2;
        character3 = 0x4;
        break;
      case 0x9:
        character2 = 0x2;
        character3 = 0x5;
        break;
      case 0xa:
        character2 = 0x2;
        character3 = 0x5;
        character4 = 0x6;
        break;
      case 0xc:
        character2 = 0x2;
        character3 = 0x5;
        character4 = 0x7;
        break;
      case 0xe:
        character2 = 0x5;
        character3 = 0x7;
        break;
      case 0xf:
        character2 = 0x2;
        character3 = 0x5;
        character4 = 0x8;
        break;
      case 0x10:
        character2 = 0x5;
        character3 = 0x8;
        break;
    }

    setInt(itemInt.offset + 0x5, "uint8", character2);
    setInt(itemInt.offset + 0x6, "uint8", character3);
    setInt(itemInt.offset + 0x7, "uint8", character4);
  }
}

function updateLocation(offset: number, value = 0x0): void {
  let disc = getInt(offset + 0x35, "uint8");

  if (disc === 0x82) {
    disc = 0xc;
  }

  const locations = getResource(`disc${disc}Locations`) as Resource;

  if (value === 0x0) {
    value = parseInt(Object.keys(locations)[0]);

    setInt(offset, "uint16", value);
  }

  const coordinates = locationsCoordinates[value] || [0, 0, 0];

  setInt(offset + 0x2, "uint16", coordinates[0]);
  setInt(offset + 0x4, "uint16", coordinates[1]);
  setInt(offset + 0x6, "uint16", coordinates[2]);

  setString(offset - 0x20, 0x1e, "uint8", locations[value] as string);
}
