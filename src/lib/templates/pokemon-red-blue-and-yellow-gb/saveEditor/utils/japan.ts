import { get } from "svelte/store";

import { gameRegion } from "$lib/stores";

import type {
  Item,
  ItemChecksum,
  ItemContainer,
  ItemInt,
  ItemString,
} from "$lib/types";

import { getCurrentBox } from "../utils";

export function japanShift(shift: number): number {
  const $gameRegion = get(gameRegion);

  return $gameRegion === 1 ? shift : 0x0;
}

export function japanInitShiftAdaptater(shifts: number[]): number[] {
  const $gameRegion = get(gameRegion);

  if ($gameRegion !== 1) {
    return shifts;
  }

  return [...shifts, -0xa];
}

export function japanParseItemAdaptater(item: Item): Item {
  const $gameRegion = get(gameRegion);

  if ($gameRegion !== 1) {
    return item;
  }

  if ("id" in item && item.id?.match(/^name/)) {
    const itemString = item as ItemString;

    itemString.length = 0x5;

    if (itemString.overrideShift) {
      itemString.overrideShift = { parent: 1, shift: 0x6 };
    }
  }

  if ("id" in item && item.id?.match(/japanShift/)) {
    if (item.type === "bitflags") {
      item.flags.forEach((flag) => {
        flag.offset += 0x5;
      });
    } else if ("offset" in item) {
      item.offset += 0x5;
    }
  }

  if ("id" in item && item.id === "checksum") {
    const itemChecksum = item as ItemChecksum;

    itemChecksum.offset += 0x7b;
    itemChecksum.control.offsetStart += 0xa;
    itemChecksum.control.offsetEnd += 0x7b;

    return itemChecksum;
  } else if ("id" in item && item.id === "checksumBoxes") {
    const itemChecksum = item as ItemChecksum;

    itemChecksum.offset -= 0x4aa;
    itemChecksum.control.offsetStart += 0xa;
    itemChecksum.control.offsetEnd -= 0x4aa;
    itemChecksum.disabled = true;

    return itemChecksum;
  } else if ("id" in item && item.id?.match(/checksumBox-/)) {
    const itemChecksum = item as ItemChecksum;

    itemChecksum.disabled = true;

    return itemChecksum;
  } else if ("id" in item && item.id === "name-trainerName") {
    const itemString = item as ItemString;

    itemString.offset += 0xa;

    return itemString;
  } else if ("id" in item && item.id === "playtime") {
    const itemInt = item as ItemInt;

    itemInt.offset -= 0x43;

    return itemInt;
  } else if ("id" in item && item.id === "boxes") {
    const itemContainer = item as ItemContainer;

    itemContainer.length = 0x566;
    itemContainer.instances = 8;

    return itemContainer;
  } else if ("id" in item && item.id === "pokemonSlots-party") {
    const itemInt = item as ItemInt;

    itemInt.offset -= 0x4d;

    return itemInt;
  } else if ("id" in item && item.id?.match(/pokemonSlots-box/)) {
    const itemInt = item as ItemInt;

    const [, type] = item.id.split("-");

    const boxIndex = parseInt(type.replace("box", ""));

    if (boxIndex === getCurrentBox()) {
      itemInt.offset -= 0xa;
    } else {
      itemInt.offset += 0xa;
    }

    return itemInt;
  } else if ("id" in item && item.id?.match(/pokemon-box/)) {
    const itemInt = item as ItemInt;

    itemInt.offset -= 0xa;

    return itemInt;
  } else if ("id" in item && item.id?.match(/name-pokemonName-party/)) {
    const itemString = item as ItemString;

    itemString.offset -= 0x1e;

    return itemString;
  } else if ("id" in item && item.id?.match(/pokemonTabs-box/)) {
    const itemContainer = item as ItemContainer;

    itemContainer.instances = 30;

    return itemContainer;
  } else if ("id" in item && item.id?.match(/name-pokemonName-box/)) {
    const itemString = item as ItemString;

    itemString.offset += 0x122;

    return itemString;
  } else if ("id" in item && item.id?.match(/name-originalTrainer-box/)) {
    const itemString = item as ItemString;

    itemString.offset += 0x14a;

    return itemString;
  } else if ("id" in item && item.id === "pokemonDeposited") {
    const itemInt = item as ItemInt;

    itemInt.offset += 0xa;

    return itemInt;
  } else if ("id" in item && item.id?.match(/name-pokemonName-daycare-/)) {
    const itemString = item as ItemString;

    itemString.offset -= 0x43;

    return itemString;
  } else if ("id" in item && item.id?.match(/name-originalTrainer-daycare-/)) {
    const itemString = item as ItemString;

    itemString.offset -= 0x48;

    return itemString;
  }

  return item;
}

export function japanParseContainerAdaptater(
  item: ItemContainer,
  shifts: number[],
  index: number,
): [boolean, number[] | undefined] {
  const $gameRegion = get(gameRegion);

  if ($gameRegion !== 1) {
    return [false, undefined];
  }

  if (item.id === "boxes") {
    if (index === getCurrentBox()) {
      return [true, [...shifts, -0xfbf]];
    } else if (index >= 4) {
      return [true, [...shifts, 0x2000 + item.length * (index - 0x4)]];
    }
  } else if (item.id === "bagItems") {
    return [true, [...shifts, 0x5, index * item.length]];
  } else if (item.id === "pokemonTabs-party") {
    return [true, [...shifts, -0x4d, index * item.length]];
  } else if (item.id?.match(/pokemonTabs-box/)) {
    const [, type] = item.id.split("-");

    const boxIndex = parseInt(type.replace("box", ""));

    if (boxIndex !== getCurrentBox()) {
      return [true, [...shifts, 0x14, index * item.length]];
    }
  } else if (item.id === "pokemonSection-daycare") {
    return [true, [...shifts, -0x4d]];
  } else if (item.id === "hallOfFameSections") {
    return [true, [...shifts, 0xa, index * item.length]];
  }

  return [false, undefined];
}
