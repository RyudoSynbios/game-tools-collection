import { get } from "svelte/store";

import { dataView, gamePlatform } from "$lib/stores";
import { getInt, setInt } from "$lib/utils/bytes";
import {
  customGetRegions,
  getRegionSaves,
  getSlotShifts,
  repackFile,
  resetState,
  unpackFile,
} from "$lib/utils/common/playstation2";
import { getObjKey } from "$lib/utils/format";
import { checkValidator, getPlatformRegions } from "$lib/utils/validator";

import type {
  Item,
  ItemContainer,
  ItemInt,
  Resource,
  Validator,
} from "$lib/types";

export function setGamePlatform(dataView: DataView): void {
  const regionValidator = getPlatformRegions("hdremaster").europe as Validator;
  const key = parseInt(getObjKey(regionValidator, 0));
  const validator = regionValidator[key];

  if (checkValidator(validator, key, dataView)) {
    gamePlatform.set(1);
  } else {
    gamePlatform.set(0);
  }
}

export function beforeInitDataView(dataView: DataView): DataView {
  const $gamePlatform = get(gamePlatform);

  if ($gamePlatform === 0) {
    return unpackFile(dataView);
  }

  return dataView;
}

export function overrideGetRegions(): string[] {
  const $gamePlatform = get(gamePlatform);

  if ($gamePlatform === 1) {
    return ["europe"];
  }

  return customGetRegions();
}

export function onInitFailed(): void {
  resetState();
}

export function overrideParseItem(item: Item): Item {
  const $gamePlatform = get(gamePlatform);

  if ("id" in item && item.id === "slots" && $gamePlatform === 0) {
    const itemContainer = item as ItemContainer;

    const saves = getRegionSaves();

    itemContainer.instances = saves.length;
  }

  return item;
}

export function overrideParseContainerItemsShifts(
  item: ItemContainer,
  shifts: number[],
  index: number,
): [boolean, number[] | undefined] {
  const $gamePlatform = get(gamePlatform);

  if (item.id === "slots") {
    if ($gamePlatform === 1) {
      if (index === 0) {
        return [true, [0x220]];
      }

      return [true, [-1]];
    }

    return getSlotShifts(index);
  }

  return [false, undefined];
}

export function overrideItem(item: Item): Item {
  if ("id" in item && item.id?.match(/skill-/)) {
    const itemInt = item as ItemInt;

    const [index, shift] = item.id.splitInt();

    const offset = itemInt.offset - 0x1 - index * 0x4 - shift;

    const int = getInt(offset, "uint8");

    itemInt.disabled = index >= int;

    return itemInt;
  }

  return item;
}

function getFormation(offset: number, index: number): number {
  const binary = getInt(offset, "uint8").toBinary();

  let int = 0x0;

  let current = 0;

  for (let i = 0; i < 7; i += 1) {
    if (binary[i] === "1") {
      if (current === index) {
        int = 0x1 << (7 - i);
        break;
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

    const [index] = item.id.splitInt();

    const int = getFormation(itemInt.offset, index);

    return [true, int];
  } else if ("id" in item && item.id?.match(/skill-/)) {
    const itemInt = item as ItemInt;

    if (itemInt.disabled) {
      return [true, 0x0];
    }
  }

  return [false, undefined];
}

export function overrideSetInt(item: Item, value: string): boolean {
  if ("id" in item && item.id?.match(/formation-/)) {
    const itemInt = item as ItemInt;

    const [index] = item.id.splitInt();

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
  const $dataView = get(dataView);
  const $gamePlatform = get(gamePlatform);

  if ($gamePlatform === 0) {
    return repackFile();
  }

  return $dataView.buffer;
}

export function onReset(): void {
  resetState();
}

export function getSlotNames(): Resource {
  const $gamePlatform = get(gamePlatform);

  const saves = getRegionSaves();

  if ($gamePlatform === 1) {
    return { 0x0: "Slot 1" };
  }

  const names = saves.reduce((names: Resource, save, index) => {
    const name = save.file.name.slice(-2);

    names[index] = `Slot ${parseInt(name) + 1}`;

    return names;
  }, {});

  return names;
}
