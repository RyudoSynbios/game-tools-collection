import { get } from "svelte/store";

import { fileHeaderShift, gameRegion } from "$lib/stores";
import { getInt, setInt } from "$lib/utils/bytes";
import {
  generateBiosChecksum,
  getHeaderShift,
} from "$lib/utils/common/nintendoDs";
import { getItem } from "$lib/utils/parser";

import type {
  Item,
  ItemBitflag,
  ItemBitflags,
  ItemChecksum,
  ItemInt,
  ItemTabs,
} from "$lib/types";

export function initHeaderShift(dataView: DataView): number {
  return getHeaderShift(dataView);
}

export function overrideParseItem(item: Item): Item {
  const $gameRegion = get(gameRegion);

  if ("id" in item && item.id === "language") {
    const itemInt = item as ItemInt;

    itemInt.hidden = $gameRegion >= 2;

    return itemInt;
  } else if ("id" in item && item.id?.match(/progression-/)) {
    const itemInt = item as ItemInt;

    const [index] = item.id.splitInt();

    itemInt.bit! += index;

    return itemInt;
  }

  return item;
}

export function overrideItem(item: Item): Item {
  const $fileHeaderShift = get(fileHeaderShift);

  if ("id" in item && item.id === "slots") {
    const itemTabs = item as ItemTabs;

    itemTabs.items.map((item, index) => {
      if (index === 0 || index === 4) {
        return item;
      }

      const int = getInt($fileHeaderShift + 0x10, "bit", { bit: index - 1 });

      item.disabled = !Boolean(int);
    });

    return itemTabs;
  } else if ("id" in item && item.id === "level") {
    const itemInt = item as ItemInt;

    const maxLevel = getInt(itemInt.offset + 0x4ea, "uint8");

    itemInt.max = maxLevel;
  }

  return item;
}

export function overrideGetInt(
  item: Item,
): [boolean, (ItemBitflag & { checked: boolean })[] | undefined] {
  if ("id" in item && item.id === "unlockedModes") {
    const itemBitflags = item as ItemBitflags;

    const flags = itemBitflags.flags.reduce(
      (flags: (ItemBitflag & { checked: boolean })[], flag) => {
        const int = getInt(flag.offset, "uint8", {
          binary: { bitStart: flag.bit, bitLength: 3 },
        });

        flags.push({
          ...flag,
          checked: int > 0,
        });

        return flags;
      },
      [],
    );

    return [true, flags];
  } else if ("id" in item && item.id === "bitToLower4") {
    const itemBitflags = item as ItemBitflags;

    const flags = itemBitflags.flags.reduce(
      (flags: (ItemBitflag & { checked: boolean })[], flag) => {
        flags.push({
          ...flag,
          checked: getInt(flag.offset, "lower4") > 0,
        });

        return flags;
      },
      [],
    );

    return [true, flags];
  }

  return [false, undefined];
}

export function overrideSetInt(
  item: Item,
  value: string,
  flag: ItemBitflag,
): boolean {
  if ("id" in item && item.id === "unlockedModes") {
    for (let i = 0; i < 3; i += 1) {
      setInt(flag.offset, "bit", value, {
        bit: flag.bit + i,
      });
    }

    return true;
  } else if ("id" in item && item.id === "bitToLower4") {
    setInt(flag.offset, "lower4", value);

    return true;
  } else if ("id" in item && item.id?.match(/bonusStats-/)) {
    const itemInt = item as ItemInt;

    const [index] = item.id.splitInt();

    const offset = itemInt.offset - index * 0x2 + 0x4e6;

    const maxValue = parseInt(value);
    const previousMaxValue = getInt(itemInt.offset, "uint16");
    let bonusValue = getInt(offset, "uint16");

    bonusValue = Math.max(0, bonusValue + (maxValue - previousMaxValue));

    setInt(itemInt.offset, "uint16", value);
    setInt(offset, "uint16", bonusValue);

    return true;
  }

  return false;
}

export function afterSetInt(item: Item, flag: ItemBitflag): void {
  if ("id" in item && item.id === "location") {
    const itemInt = item as ItemInt;

    const location = getInt(itemInt.offset, "uint24", { bigEndian: true });

    let coordinates = [514912, 716800];
    let mapType = 0x5;

    switch (location) {
      case 0x10100: // Wygol Village
        coordinates = [1083328, 1306624];
        mapType = 0x8;
        break;
      case 0x70101: // Somnus Reef
        coordinates = [647354, 716800];
        break;
      case 0xd0014: // Giant's Dwelling
        coordinates = [356501, 651264];
        break;
    }

    setInt(itemInt.offset - 0xc, "uint32", coordinates[0]);
    setInt(itemInt.offset - 0x8, "uint32", coordinates[1]);
    setInt(itemInt.offset + 0xc1, "uint8", mapType);
  } else if ("id" in item && item.id === "level") {
    const itemInt = item as ItemInt;

    const level = getInt(itemInt.offset, "uint8");

    const experience = getExperience(level);

    setInt(itemInt.offset + 0x5c, "uint32", experience);
  } else if ("id" in item && item.id === "maxLevel") {
    const itemInt = item as ItemInt;

    let level = getInt(itemInt.offset - 0x4ea, "uint8");
    const maxLevel = getInt(itemInt.offset, "uint8");

    level = Math.min(level, maxLevel);

    setInt(itemInt.offset - 0x4ea, "uint8", level);
  } else if ("id" in item && item.id === "experience") {
    const itemInt = item as ItemInt;

    const maxLevel = getInt(itemInt.offset + 0x48e, "uint8");
    const experience = getInt(itemInt.offset, "uint32");

    let level = maxLevel;

    for (let i = 2; i <= maxLevel; i += 1) {
      const nextExperience = getExperience(i);

      if (experience < nextExperience) {
        level = i - 1;
        break;
      }
    }

    setInt(itemInt.offset - 0x5c, "uint8", level);
  } else if ("id" in item && item.id?.match(/quests-/)) {
    const itemInt = item as ItemInt;

    const [, slot, , character] = item.id.split("-");
    const [, flagIndex] = item.id.splitInt();

    const questStatus = getInt(itemInt.offset, "uint8", {
      binary: itemInt.binary,
    });

    const bitflagsItem = getItem(
      `slot-${slot}-questFlags-${character}`,
    ) as ItemBitflags;

    const flag = bitflagsItem.flags[flagIndex];

    setInt(flag.offset, "bit", questStatus & 0x4, { bit: flag.bit });
  } else if ("id" in item && item.id === "rooms") {
    const int = getInt(flag.offset, "bit", { bit: flag.bit });

    setInt(flag.offset, "bit", int, { bit: flag.bit + 1 });
  }
}

export function generateChecksum(item: ItemChecksum): number {
  const salt = getInt(item.offset - 0x2, "uint16");

  return generateBiosChecksum(item, salt);
}

function getExperience(level: number): number {
  let experience = 0;

  if (level > 1) {
    experience = level * (level + 1) * (level * 3 + 2);
  }

  return experience;
}
