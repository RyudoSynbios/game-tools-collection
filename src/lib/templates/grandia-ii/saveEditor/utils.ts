import { getInt, setInt } from "$lib/utils/bytes";
import {
  customGetRegions,
  getRegionSaves,
  getSlotShifts,
  repackFile,
  resetState,
  unpackFile,
} from "$lib/utils/common/playstation2";
import { checkValidator } from "$lib/utils/validator";

import type { Item, ItemContainer, ItemInt, Resource } from "$lib/types";

let platform = "";

export function beforeInitDataView(dataView: DataView): DataView {
  platform = isPCSave(dataView) ? "pc" : "ps2";

  return unpackFile(dataView);
}

export function overrideGetRegions(): string[] {
  if (platform === "pc") {
    return ["europe"];
  }

  return customGetRegions();
}

export function onInitFailed(): void {
  resetState();
}

export function overrideParseItem(item: Item): Item {
  if ("id" in item && item.id === "slots" && platform !== "pc") {
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
  if (item.id === "slots") {
    if (platform === "pc") {
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
  return repackFile();
}

export function onReset(): void {
  resetState();
}

function isPCSave(dataView: DataView): boolean {
  const validator = [0x47, 0x52, 0x41, 0x4e, 0x44, 0x49, 0x41, 0x32]; // "GRANDIA2"

  return checkValidator(validator, 0x0, dataView);
}

export function getSlotNames(): Resource {
  const saves = getRegionSaves();

  if (platform === "pc") {
    return { 0x0: "Slot 1" };
  }

  const names = saves.reduce((names: Resource, save, index) => {
    const name = save.file.name.slice(-2);

    names[index] = `Slot ${parseInt(name) + 1}`;

    return names;
  }, {});

  return names;
}
