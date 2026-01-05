import { get } from "svelte/store";

import { fileHeaderShift, gameTemplate } from "$lib/stores";
import { getInt, getString, setInt } from "$lib/utils/bytes";
import { formatChecksum } from "$lib/utils/checksum";
import { getHeaderShift } from "$lib/utils/common/gameBoyAdvance";
import { getItem, getShift } from "$lib/utils/parser";

import type {
  Item,
  ItemBitflag,
  ItemBitflags,
  ItemChecksum,
  ItemContainer,
  ItemInt,
  ItemString,
} from "$lib/types";

const SECTION_LENGTH = 0x2254;
const TIME_UNCLEARED = 0x34bc0;

export function initHeaderShift(dataView: DataView): number {
  return getHeaderShift(dataView);
}

let sectionIndex = -1;

export function beforeItemsParsing(): void {
  const $fileHeaderShift = get(fileHeaderShift);

  sectionIndex = getInt($fileHeaderShift + 0x10, "uint8");
}

export function overrideParseItem(item: Item): Item {
  const $gameTemplate = get(gameTemplate);

  if ("offset" in item && item.offset >= 0x9dc) {
    item.offset += sectionIndex * SECTION_LENGTH;
  }

  if ("id" in item && item.id?.match(/adventureLevels-/)) {
    const itemContainer = item as ItemContainer;

    const [index] = item.id.splitInt();

    if (index === 0) {
      itemContainer.instances = 5;
    }

    const worlds = $gameTemplate.resources!.worlds;

    if (itemContainer.instanceType === "section") {
      const itemInt = itemContainer.items[0] as ItemInt;

      itemInt.name = `${worlds[index]} %d`;
    } else if (itemContainer.instanceType === "tabs") {
      itemContainer.enumeration = `${worlds[index]} %d`;
    }

    return itemContainer;
  } else if ("id" in item && item.id?.match(/^status-/)) {
    const itemInt = item as ItemInt;

    const [, mode] = item.id.split("-");
    const [world] = item.id.splitInt();

    if (mode === "adventure" && world > 0x0) {
      itemInt.offset += getLevelIndex(mode, world, 0);
    } else if (mode === "challenge") {
      itemInt.offset += world * 0x5;
    }

    itemInt;
  }

  return item;
}

export function overrideParseContainerItemsShifts(
  item: ItemContainer,
  shifts: number[],
  index: number,
): [boolean, number[] | undefined] {
  if (item.id === "slots") {
    if (index < 4) {
      index += 1;
    } else {
      index = 0;
    }

    shifts = [...shifts, sectionIndex * SECTION_LENGTH, index * item.length];

    const char = getInt(getShift(shifts) + 0x1a, "uint8");

    if (char === 0x0) {
      return [true, [-1]];
    }

    return [true, shifts];
  } else if (item.id?.match(/^adventure-/)) {
    const [, type] = item.id.split("-");

    const base = type === "records" ? 0xf0 : 0x14;

    if (index > 0) {
      return [true, [...shifts, base + (index - 1) * item.length]];
    }
  }

  return [false, undefined];
}

export function overrideItem(item: Item): Item {
  if ("id" in item && item.id === "time") {
    const itemInt = item as ItemInt;

    const time = getInt(itemInt.offset, "uint32");

    itemInt.disabled = time === TIME_UNCLEARED;

    return itemInt;
  }

  return item;
}

export function overrideGetInt(item: Item): [boolean, number | undefined] {
  if ("id" in item && item.id === "time") {
    const itemInt = item as ItemInt;

    if (itemInt.disabled) {
      return [true, 0x0];
    }
  }

  return [false, undefined];
}

export function afterSetInt(item: Item, flag: ItemBitflag): void {
  if ("id" in item && item.id?.match(/^status-/)) {
    const itemInt = item as ItemInt;

    const [, mode] = item.id.split("-");
    const [world, level] = item.id.splitInt();

    const index = getLevelIndex(mode, world, level);

    const offset = itemInt.offset - 0x174 + index * 0x3;

    const status = getInt(itemInt.offset, "uint8");
    const time = getInt(offset, "uint32");

    if (status < 0x2) {
      setInt(offset, "uint32", TIME_UNCLEARED);
    } else if (time === TIME_UNCLEARED) {
      setInt(offset, "uint32", TIME_UNCLEARED - 0x1);
    }
  } else if ("id" in item && item.id?.match(/^makeUp-/)) {
    const itemBitflags = item as ItemBitflags;

    const [, type] = item.id.split("-");

    const index = itemBitflags.flags.findIndex(
      (item) => item.offset === flag.offset && item.bit === flag.bit,
    );

    if (type !== "siblings" && index === 0) {
      return;
    }

    const itemLevels = getItem(
      item.id.replace("unlocked", "levels"),
    ) as ItemBitflags;

    const levelFlag = itemLevels.flags[index];

    const checked = getInt(flag.offset, "bit", { bit: flag.bit });

    setInt(levelFlag.offset, "bit", checked, { bit: levelFlag.bit });
  } else if ("id" in item && item.id === "nameRecords") {
    const itemString = item as ItemString;

    const name = getString(itemString.offset, 0x8, "uint8", {
      endCode: itemString.endCode,
      resource: itemString.resource,
    });
    const time = getInt(itemString.offset - 0x4, "uint32");

    if (name === "--------") {
      setInt(itemString.offset - 0x4, "uint32", TIME_UNCLEARED);
    } else if (time === TIME_UNCLEARED) {
      setInt(itemString.offset - 0x4, "uint32", TIME_UNCLEARED - 0x1);
    }
  }
}

export function generateChecksum(item: ItemChecksum): number {
  let checksum = 0x0;

  for (let i = item.control.offsetStart; i < item.control.offsetEnd; i += 0x1) {
    checksum += getInt(i, "uint8");
  }

  return formatChecksum(checksum, item.dataType);
}

export function onReset(): void {
  sectionIndex = -1;
}

function getLevelIndex(mode: string, world: number, level: number): number {
  let index = level;

  if (mode === "adventure" && world > 0x0) {
    index += 0x5 + (world - 0x1) * 0x3;
  } else if (mode === "challenge") {
    index += 0x26 + world * 0x5;
  }

  return index;
}
