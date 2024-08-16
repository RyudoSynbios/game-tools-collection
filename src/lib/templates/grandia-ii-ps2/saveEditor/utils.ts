import { get } from "svelte/store";

import { gameRegion } from "$lib/stores";
import { getInt, setInt } from "$lib/utils/bytes";
import {
  customGetRegions,
  getSaves,
  getSlots,
  repackMemoryCard,
  resetMemoryCard,
  unpackMemoryCard,
} from "$lib/utils/common/playstation2";

import type { Item, ItemContainer, ItemInt } from "$lib/types";

export function beforeInitDataView(dataView: DataView): DataView {
  return unpackMemoryCard(dataView);
}

export function overrideGetRegions(): string[] {
  return customGetRegions();
}

export function onInitFailed(): void {
  resetMemoryCard();
}

export function overrideItem(item: Item): Item {
  if ("id" in item && item.id === "slots") {
    const itemContainer = item as ItemContainer;

    const saves = getSaves();

    itemContainer.instances = saves.length;
  }

  return item;
}

export function overrideParseContainerItemsShifts(
  item: ItemContainer,
  shifts: number[],
  index: number,
): [boolean, number[] | undefined] {
  if (item.id === "slots") {
    return getSlots(index);
  }

  return [false, undefined];
}

function getFormation(offset: number, index: number): number {
  const binary = getInt(offset, "uint8").toBinary();

  let int = 0x0;

  let current = 0;

  for (let i = 0; i < 7; i += 1) {
    if (binary[i] === "1") {
      if (current === index) {
        int = 0x1 << (7 - i);
        i = 7;
      } else {
        current += 1;
      }
    }
  }

  return int;
}

export function overrideGetInt(item: Item): [boolean, number | undefined] {
  if ("id" in item && item.id?.match(/formation-/)) {
    const itemInt = item as ItemInt;

    const split = item.id.split("-");

    const index = parseInt(split[1]);

    const int = getFormation(itemInt.offset, index);

    return [true, int];
  }

  return [false, undefined];
}

export function overrideSetInt(item: Item, value: string): boolean {
  if ("id" in item && item.id?.match(/formation-/)) {
    const itemInt = item as ItemInt;

    const split = item.id.split("-");

    const index = parseInt(split[1]);

    let int = getInt(itemInt.offset, "uint8");

    const newValue = parseInt(value);

    if ((int & newValue) !== 0x0) {
      return true;
    }

    int = int - getFormation(itemInt.offset, index) + newValue;

    setInt(itemInt.offset, "uint8", int);

    return true;
  }

  return false;
}

export function beforeSaving(): ArrayBufferLike {
  return repackMemoryCard();
}

export function onReset(): void {
  resetMemoryCard();
}

export function getSlotNames(): string[] {
  const saves = getSaves();

  const names = saves.reduce((names: string[], save) => {
    const name = save.directory.name.slice(-2);

    names.push(`Slot ${parseInt(name) + 1}`);

    return names;
  }, []);

  return names;
}
