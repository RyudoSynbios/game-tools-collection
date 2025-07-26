import { get } from "svelte/store";

import { gameRegion } from "$lib/stores";

import type {
  Item,
  ItemBitflag,
  ItemBitflags,
  ItemChecksum,
  ItemContainer,
  ItemInt,
  ItemString,
} from "$lib/types";

import { getCurrentBox } from "../utils";

export function japanAdaptater(item: Item): Item {
  const $gameRegion = get(gameRegion);

  if ($gameRegion !== 1) {
    return item;
  }

  if ("id" in item && item.id?.match(/name/)) {
    const itemString = item as ItemString;

    itemString.length = 0x5;

    if (itemString.overrideShift) {
      itemString.overrideShift = { parent: 1, shift: 0x6 };
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
  } else if ("id" in item && item.id === "name-trainer") {
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
  } else if ("id" in item && item.id?.match(/pokemonSlots-box-/)) {
    const itemInt = item as ItemInt;

    const [index] = item.id.splitInt();

    const box = getCurrentBox();

    if (index === box) {
      itemInt.offset -= 0xa;
    } else {
      itemInt.offset += 0xa;
    }

    return itemInt;
  } else if ("id" in item && item.id?.match(/pokemon-box-/)) {
    const itemInt = item as ItemInt;

    itemInt.offset -= 0xa;

    return itemInt;
  } else if ("id" in item && item.id?.match(/name-pokemonParty-/)) {
    const itemString = item as ItemString;

    itemString.offset -= 0x1e;

    return itemString;
  } else if ("id" in item && item.id?.match(/pokemonTab-box-/)) {
    const itemContainer = item as ItemContainer;

    itemContainer.instances = 30;

    return itemContainer;
  } else if ("id" in item && item.id?.match(/name-pokemonBox-/)) {
    const itemString = item as ItemString;

    itemString.offset += 0x122;

    return itemString;
  } else if ("id" in item && item.id?.match(/name-originalTrainerBox-/)) {
    const itemString = item as ItemString;

    itemString.offset += 0x14a;

    return itemString;
  } else if ("id" in item && item.id === "pokemonDeposited") {
    const itemInt = item as ItemInt;

    itemInt.offset += 0xa;

    return itemInt;
  } else if ("id" in item && item.id?.match(/name-pokemonDaycare-/)) {
    const itemString = item as ItemString;

    itemString.offset += 0xa;

    return itemString;
  } else if ("id" in item && item.id?.match(/name-originalTrainerDaycare-/)) {
    const itemString = item as ItemString;

    itemString.offset -= 0x48;

    return itemString;
  } else if ("id" in item && item.id?.match(/japanShift/)) {
    if ("flags" in item) {
      const itemBitflags = item as ItemBitflags;

      itemBitflags.flags = itemBitflags.flags.reduce(
        (flags: ItemBitflag[], flag) => {
          flags.push({
            ...flag,
            offset: flag.offset + 0x5,
          });

          return flags;
        },
        [],
      );
    } else {
      const itemInt = item as ItemInt;

      itemInt.offset += 0x5;
    }
  }

  return item;
}

export function japanShift(shift: number): number {
  const $gameRegion = get(gameRegion);

  return $gameRegion === 1 ? shift : 0x0;
}
