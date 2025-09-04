import { get } from "svelte/store";

import { fileHeaderShift } from "$lib/stores";
import { getInt, getString, setInt } from "$lib/utils/bytes";
import { formatChecksum } from "$lib/utils/checksum";
import { getItem, updateResources } from "$lib/utils/parser";

import type {
  Item,
  ItemBitflag,
  ItemBitflags,
  ItemChecksum,
  ItemInt,
  ItemString,
  ItemTabs,
  Resource,
} from "$lib/types";

import {
  characterLevels,
  locations,
  progressionList,
  tech,
} from "./utils/resource";

export function overrideParseItem(item: Item): Item {
  if ("id" in item && item.id?.match(/baseStats-/)) {
    const itemInt = item as ItemInt;

    let [shift] = item.id.splitInt();

    if (shift === 58) {
      shift = -shift;
    }

    const dataType = itemInt.dataType as "uint8" | "uint16";

    const calculate = getInt(itemInt.offset, dataType);
    const base = getInt(itemInt.offset + shift, dataType);

    itemInt.min = Math.max(1, calculate - base);

    return itemInt;
  } else if ("id" in item && item.id?.match(/tech-/)) {
    const itemBitflags = item as ItemBitflags;

    const [characterIndex, typeIndex] = item.id.splitInt();

    const techs = tech[typeIndex];

    if (characterIndex === 6 && [1, 2].includes(typeIndex)) {
      itemBitflags.hidden = true;
    }

    itemBitflags.flags = itemBitflags.flags.reduce(
      (flags: ItemBitflag[], flag, index) => {
        flags.push({
          ...flag,
          offset: flag.offset - characterIndex * 0x50,
          hidden: !techs.techs[index].characters.includes(characterIndex),
        });

        return flags;
      },
      [],
    );

    return itemBitflags;
  }

  return item;
}

export function overrideItem(item: Item): Item {
  const $fileHeaderShift = get(fileHeaderShift);

  if ("id" in item && item.id === "slots") {
    const itemTabs = item as ItemTabs;

    itemTabs.items.map((item, index) => {
      if (index === 0) {
        return item;
      }

      const int = getInt(
        $fileHeaderShift + 0x1ff8 + (index - 1) * 0x2,
        "uint16",
      );

      item.disabled = int !== 0xe41b;
    });

    return itemTabs;
  } else if ("id" in item && item.id?.match(/locationPosition-/)) {
    const itemInt = item as ItemInt;

    const [shift] = item.id.splitInt();

    const location = getInt(itemInt.offset - shift, "uint16");

    const worldMaps = [0x1f0, 0x1f1, 0x1f2, 0x1f3, 0x1f4, 0x1f5, 0x1f6, 0x1f7];

    itemInt.disabled = !worldMaps.includes(location);

    return itemInt;
  } else if ("id" in item && item.id === "quantity") {
    const itemInt = item as ItemInt;

    const itemIndex = getInt(itemInt.offset - 0x100, "uint8");

    itemInt.disabled = itemIndex === 0x0;

    return itemInt;
  }

  return item;
}

export function overrideGetInt(item: Item): [boolean, number | undefined] {
  if ("id" in item && item.id === "progression") {
    const itemInt = item as ItemInt;

    const int = getInt(itemInt.offset, "uint8");

    let progression = progressionList.findIndex(
      (progression) => progression.value > int,
    );

    if (progression === -1) {
      progression = progressionList.length;
    }

    return [true, progression - 1];
  } else if ("id" in item && item.id === "playtime") {
    const itemInt = item as ItemInt;

    const start = itemInt.dataType === "uint16" ? 0x1 : 0x2;

    let hex = "";

    for (let i = start; i >= 0x0; i -= 0x1) {
      hex += getInt(itemInt.offset + i, "lower4");
    }

    const int = parseInt(hex);

    return [true, int];
  } else if ("id" in item && item.id === "formation") {
    const itemInt = item as ItemInt;

    let int = getInt(itemInt.offset, "uint8");

    if (int > 0x80) {
      int = 0x80;
    }

    return [true, int];
  } else if ("id" in item && item.id === "epochLocation") {
    const itemInt = item as ItemInt;

    let int = getInt(itemInt.offset, "uint16");

    if (int === 0x1d9) {
      int = 0x10d0;
    }

    return [true, int];
  }

  return [false, undefined];
}

export function overrideSetInt(item: Item, value: string): boolean {
  if ("id" in item && item.id === "playtime") {
    const itemInt = item as ItemInt;

    const start = itemInt.dataType === "uint16" ? 0x1 : 0x2;

    value = value.padStart(start + 1);

    for (let i = start; i >= 0x0; i -= 0x1) {
      setInt(itemInt.offset + i, "lower4", value[start - i] || 0);
    }

    return true;
  } else if ("id" in item && item.id?.match(/baseStats-/)) {
    const itemInt = item as ItemInt;

    let [shift] = item.id.splitInt();

    const int = parseInt(value);

    if (shift === 58) {
      shift = -shift;
    }

    const dataType = itemInt.dataType as "uint8" | "uint16";

    const calculate = getInt(itemInt.offset, dataType);
    const base = getInt(itemInt.offset + shift, dataType);

    const diff = int - calculate;

    setInt(itemInt.offset, dataType, value);
    setInt(itemInt.offset + shift, dataType, base + diff);

    return true;
  }

  return false;
}

export function afterSetInt(item: Item): void {
  if ("id" in item && item.id === "location") {
    const itemInt = item as ItemInt;

    const int = getInt(itemInt.offset, "uint16");

    const location = locations[int];

    setInt(itemInt.offset + 0x2, "uint8", location[0]);
    setInt(itemInt.offset + 0x3, "uint8", location[1]);
    setInt(itemInt.offset + 0x210, "uint16", 0x0);
  } else if ("id" in item && item.id?.match(/characterName-/)) {
    const [slotIndex] = item.id.splitInt();

    updateCharacterNames(slotIndex);
  } else if ("id" in item && item.id === "level") {
    const itemInt = item as ItemInt;

    const level = getInt(itemInt.offset, "uint8");
    const experience = characterLevels[level - 2] || 0;

    let nextExperience = characterLevels[level - 1] || 0;

    if (nextExperience > 0) {
      nextExperience -= experience;
    }

    setInt(itemInt.offset + 0x1, "uint24", experience);
    setInt(itemInt.offset + 0x19, "uint16", nextExperience);
  } else if ("id" in item && item.id === "experience") {
    const itemInt = item as ItemInt;

    const experience = getInt(itemInt.offset, "uint24");

    let level = 1;

    for (let i = 0; i < characterLevels.length; i += 1) {
      if (
        experience >= characterLevels[i] &&
        (!characterLevels[i + 1] || experience < characterLevels[i + 1])
      ) {
        level += i + 1;
      }
    }

    let nextExperience = characterLevels[level - 1] || 0;

    if (nextExperience > 0) {
      nextExperience -= experience;
    }

    setInt(itemInt.offset - 0x1, "uint8", level);
    setInt(itemInt.offset + 0x18, "uint16", nextExperience);
  } else if ("id" in item && item.id?.match(/tech-/)) {
    const itemBitflags = item as ItemBitflags;

    const [characterIndex, typeIndex] = item.id.splitInt();

    if (typeIndex === 0) {
      const offset = itemBitflags.flags[0].offset - 0x7;

      const count = getInt(offset + 0x7 + characterIndex, "uint8").toBitCount();

      setInt(offset + characterIndex, "uint8", count);
    }
  } else if ("id" in item && item.id === "item") {
    const itemInt = item as ItemInt;

    const itemIndex = getInt(itemInt.offset, "uint8");
    const quantity = getInt(itemInt.offset + 0x100, "uint8");

    if (itemIndex === 0x0) {
      setInt(itemInt.offset + 0x100, "uint8", 0x0);
    } else if (quantity === 0x0) {
      setInt(itemInt.offset + 0x100, "uint8", 0x1);
    }
  }
}

export function generateChecksum(item: ItemChecksum): number {
  let checksum = 0x0;

  for (
    let i = item.control.offsetEnd - 0x2;
    i >= item.control.offsetStart;
    i -= 0x2
  ) {
    checksum %= 0xffff;
    checksum += getInt(i, "uint16");
  }

  return formatChecksum(checksum, item.dataType);
}

export function getCharacterNames(slotIndex: number): Resource {
  if (typeof slotIndex === "string") {
    return {};
  }

  const names: Resource = {};

  const itemString = getItem(`slot-${slotIndex}-characterName-0`) as ItemString;

  [...Array(7).keys()].forEach((index) => {
    const name = getString(
      itemString.offset + index * 0x6,
      itemString.length,
      itemString.letterDataType,
      {
        endCode: itemString.endCode,
        resource: itemString.resource,
      },
    );

    names[index] = name;
  });

  names[0x80] = "-";

  return names;
}

export function onSlotChange(slotIndex: number): void {
  if (slotIndex !== 0) {
    slotIndex -= 1;
  }

  updateCharacterNames(slotIndex);
}

export function updateCharacterNames(slotIndex: number): void {
  const values = getCharacterNames(slotIndex);

  updateResources("characterNames", values);
}
