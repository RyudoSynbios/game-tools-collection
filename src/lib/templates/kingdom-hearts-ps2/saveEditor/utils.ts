import { get } from "svelte/store";

import { gameRegion } from "$lib/stores";
import { getInt, setInt } from "$lib/utils/bytes";
import {
  customGetRegions,
  getFileOffset,
  getSaves,
  repackFile,
  resetState,
  unpackFile,
} from "$lib/utils/common/playstation2";
import { getItem } from "$lib/utils/parser";

import type {
  Item,
  ItemBitflags,
  ItemContainer,
  ItemInt,
  ItemString,
  Resource,
} from "$lib/types";

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

  if ("id" in item && item.id === "slots") {
    const itemContainer = item as ItemContainer;

    const saves = getSaves();

    itemContainer.instances = saves.length;
  } else if ("id" in item && item.id?.match(/time/)) {
    const itemInt = item as ItemInt;

    if ([1, 2].includes($gameRegion)) {
      itemInt.operations![0] = { "/": 60 };
    }

    return itemInt;
  } else if ("id" in item && item.id === "name" && $gameRegion === 2) {
    const itemString = item as ItemString;

    itemString.length = 0x8;

    return itemString;
  } else if ("id" in item && item.id === "japanExclude") {
    const itemInt = item as ItemInt;

    itemInt.hidden = $gameRegion === 2;

    return itemInt;
  } else if ("id" in item && item.id?.match(/japanExclude-/)) {
    const itemBitflags = item as ItemBitflags;

    const [type] = item.id.splitInt();

    itemBitflags.flags.map((flag, index) => {
      if (
        (type === 0 && index === 0 && $gameRegion === 2) ||
        (type === 1 && [4, 5].includes(index) && $gameRegion === 2) ||
        (type === 1 && index === 6 && $gameRegion !== 2)
      ) {
        flag.hidden = true;
      }
    });

    return itemBitflags;
  }

  return item;
}

export function overrideShift(
  item: Item,
  shifts: number[],
  instanceIndex: number,
): number[] {
  if ("id" in item && item.id === "time-playtime") {
    return [...shifts.slice(0, -1), getFileOffset(instanceIndex, "system.bin")];
  }

  return shifts;
}

export function overrideParseContainerItemsShifts(
  item: ItemContainer,
  shifts: number[],
  index: number,
): [boolean, number[] | undefined] {
  if (item.id === "slots") {
    return [true, [getFileOffset(index)]];
  }

  return [false, undefined];
}

export function overrideItem(item: Item): Item {
  if ("id" in item && item.id?.match(/item-/)) {
    const itemInt = item as ItemInt;

    const [index] = item.id.splitInt();

    const int = getInt(itemInt.offset - 0x1 - index, "uint8");

    itemInt.disabled = index >= int;

    return itemInt;
  }

  return item;
}

export function afterSetInt(item: Item): void {
  if ("id" in item && item.id === "level") {
    const itemInt = item as ItemInt;

    const int = getInt(itemInt.offset, "uint8");

    setInt(itemInt.offset + 0x34, "uint8", int);
  } else if ("id" in item && item.id?.match(/trinity-/)) {
    const itemBitflags = item as ItemBitflags;

    const [, type, slotIndex] = item.id.split("-");

    const countItem = getItem(`count-trinity-${type}-${slotIndex}`) as ItemInt;

    const int = itemBitflags.flags.reduce(
      (count, flag) => count + getInt(flag.offset, "bit", { bit: flag.bit }),
      0,
    );

    setInt(countItem.offset, "uint8", int);
  }
}

export function beforeSaving(): ArrayBufferLike {
  return repackFile();
}

export function onReset(): void {
  resetState();
}

export function getSlotNames(): Resource {
  const saves = getSaves();

  const names = saves.reduce((names: Resource, save, index) => {
    const name = save.directory.name.slice(-2);

    names[index] = `Slot ${name.replace(/^0/, "")}`;

    return names;
  }, {});

  return names;
}
