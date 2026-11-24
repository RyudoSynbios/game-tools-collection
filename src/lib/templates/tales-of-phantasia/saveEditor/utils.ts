import { copyInt, dataTypeToLength, getInt, setInt } from "$lib/utils/bytes";
import { formatChecksum } from "$lib/utils/checksum";
import {
  customGetRegions,
  getSlotShiftsByIdentifier,
  repackFile,
  resetState,
  unpackFile,
} from "$lib/utils/common/playstation";
import { getClosestItem } from "$lib/utils/parser";

import type {
  Item,
  ItemBitflagChecked,
  ItemBitflags,
  ItemChecksum,
  ItemContainer,
  ItemInt,
  ItemSection,
  ItemString,
  ItemTab,
} from "$lib/types";

import { characterLevels } from "./utils/resource";

export function beforeInitDataView(dataView: DataView): DataView {
  return unpackFile(dataView);
}

export function overrideGetRegions(): string[] {
  return customGetRegions();
}

export function onInitFailed(): void {
  resetState();
}

export function overrideParseItem(item: Item): Item | ItemTab {
  if ("id" in item && item.id?.match(/maxHtp-/)) {
    const itemInt = item as ItemInt;

    const calculate = getInt(itemInt.offset, "uint16");
    const base = getInt(itemInt.offset - 0x2, "uint16");

    itemInt.min = Math.max(itemInt.min || 0, calculate - base);

    return itemInt;
  } else if ("id" in item && item.id?.match(/baseStats-/)) {
    const itemInt = item as ItemInt;

    const [shift] = item.id.splitInt();

    const calculate = getInt(itemInt.offset, "uint16");
    const base = getInt(itemInt.offset - shift, "uint16");

    itemInt.min = Math.max(0, calculate - base);

    return itemInt;
  } else if ("id" in item && item.id?.match(/artesTab-/)) {
    const itemTab = item as ItemTab;

    const [characterIndex] = item.id.splitInt();

    itemTab.disabled = characterIndex === 6;

    return itemTab;
  } else if ("id" in item && item.id?.match(/artes-/)) {
    const itemBitflags = item as ItemBitflags;

    const [targetedCharacter, characterIndex] = item.id.splitInt();

    itemBitflags.hidden = targetedCharacter !== characterIndex;

    return itemBitflags;
  } else if ("id" in item && item.id?.match(/artesMastery-/)) {
    const itemSection = item as ItemSection;

    const [characterIndex] = item.id.splitInt();

    itemSection.hidden = characterIndex !== 0;

    return itemSection;
  }

  return item;
}

export function overrideParseContainerItemsShifts(
  item: ItemContainer,
  shifts: number[],
  index: number,
): [boolean, number[] | undefined] {
  if (item.id === "slots") {
    return getSlotShiftsByIdentifier(".TOP.%s".format(index + 1));
  }

  return [false, undefined];
}

export function overrideGetInt(
  item: Item,
): [boolean, number | ItemBitflagChecked[] | undefined] {
  if ("id" in item && item.id === "arteMastery") {
    const itemInt = item as ItemInt;

    let percent = getInt(itemInt.offset, "int8");

    if (percent === -1) {
      percent = 100;
    }

    return [true, percent];
  } else if ("id" in item && item.id?.match(/quantity-/)) {
    const itemInt = item as ItemInt;

    const [itemIndex] = item.id.splitInt();

    const inventory = getInventory(itemInt.offset);

    const itemV = inventory.find((item) => item.index === itemIndex);

    return [true, itemV?.quantity || 0];
  }

  return [false, undefined];
}

export function overrideSetInt(item: Item, value: string): boolean {
  if ("id" in item && item.id?.match(/maxHtp-/)) {
    const itemInt = item as ItemInt;

    const htp = parseInt(value);

    const calculate = getInt(itemInt.offset, "uint16");
    const base = getInt(itemInt.offset - 0x2, "uint16");

    const diff = htp - calculate;

    setInt(itemInt.offset, "uint16", value);
    setInt(itemInt.offset - 0x2, "uint16", base + diff);
  } else if ("id" in item && item.id?.match(/baseStats-/)) {
    const itemInt = item as ItemInt;

    const [shift] = item.id.splitInt();

    const int = parseInt(value);

    const calculate = getInt(itemInt.offset, "uint16");
    const base = getInt(itemInt.offset - shift, "uint16");

    const diff = int - calculate;

    setInt(itemInt.offset, "uint16", value);
    setInt(itemInt.offset - shift, "uint16", base + diff);
  } else if ("id" in item && item.id === "arteMastery") {
    const itemInt = item as ItemInt;

    let percent = parseInt(value);

    if (percent === 100) {
      percent = -1;
    }

    setInt(itemInt.offset, "uint8", percent);

    return true;
  } else if ("id" in item && item.id?.match(/quantity-/)) {
    const itemInt = item as ItemInt;

    const [itemIndex] = item.id.splitInt();

    const quantity = parseInt(value);

    updateInventory(itemInt.offset, itemIndex, quantity);

    return true;
  }

  return false;
}

export function afterSetInt(item: Item): void {
  if ("id" in item && item.id === "mode") {
    const itemInt = item as ItemInt;

    const mode = getInt(itemInt.offset, "bit", { bit: 0 });

    setInt(itemInt.offset + 0x6d3, "bit", mode, { bit: 0 }); // Mania Rank unlocked
    setInt(itemInt.offset - 0xe28, "bit", mode, { bit: 0 }); // Save Preview
  } else if ("id" in item && item.id?.match(/savePreview-/)) {
    const itemInt = item as ItemInt;

    const [shift] = item.id.splitInt();

    const length = dataTypeToLength(itemInt.dataType);

    copyInt(itemInt.offset, itemInt.offset - shift, length);
  } else if ("id" in item && item.id?.match(/encounters-/)) {
    const itemInt = item as ItemInt;

    const [, rank] = item.id.split("-");

    updateEncounters(itemInt.offset, rank);
  } else if ("id" in item && item.id === "name") {
    const itemString = item as ItemString;

    const spSectionItem = getClosestItem("spcSection", item) as ItemSection;
    const spNameItem = spSectionItem.items[1] as ItemString;

    copyInt(itemString.offset, spNameItem.offset, itemString.length);
  } else if ("id" in item && item.id === "level") {
    const itemInt = item as ItemInt;

    const level = getInt(itemInt.offset, "uint16");
    let experience = 0;

    if (level < 100) {
      experience = characterLevels[level - 1] || characterLevels[0];
    } else {
      experience = characterLevels[98] + (level - 99) * 106920;
    }

    let nextExperience = 0;

    if (level < 99) {
      nextExperience = characterLevels[level] || characterLevels[0];
    } else if (level < 999) {
      nextExperience = experience + 106920;
    }

    if (nextExperience > 0) {
      nextExperience -= experience;
    }

    setInt(itemInt.offset + 0x2, "uint32", experience);
    setInt(itemInt.offset + 0x6, "uint32", nextExperience);

    const spSectionItem = getClosestItem("spcSection", item) as ItemSection;
    const spLevelItem = spSectionItem.items[2] as ItemInt;

    setInt(spLevelItem.offset, "uint16", level);
    setInt(spLevelItem.offset + 0x2, "uint32", experience);
    setInt(spLevelItem.offset + 0x6, "uint32", nextExperience);
  } else if ("id" in item && item.id === "experience") {
    const itemInt = item as ItemInt;

    const experience = getInt(itemInt.offset, "uint32");

    let level = 1;

    if (experience < characterLevels[98]) {
      for (let i = 0; i < characterLevels.length; i += 1) {
        if (
          experience >= characterLevels[i] &&
          (!characterLevels[i + 1] || experience < characterLevels[i + 1])
        ) {
          level += i;
        }
      }
    } else {
      level = 99 + Math.floor((experience - characterLevels[98]) / 106920);
    }

    let nextExperience = 0;

    if (level < 99) {
      nextExperience = characterLevels[level] || characterLevels[0];
    } else if (level < 999) {
      nextExperience = characterLevels[98] + (level - 98) * 106920;
    }

    if (nextExperience > 0) {
      nextExperience -= experience;
    }

    setInt(itemInt.offset - 0x2, "uint16", level);
    setInt(itemInt.offset + 0x4, "uint32", nextExperience);

    const spSectionItem = getClosestItem("spcSection", item) as ItemSection;
    const spLevelItem = spSectionItem.items[2] as ItemInt;

    setInt(spLevelItem.offset, "uint16", level);
    setInt(spLevelItem.offset + 0x2, "uint32", experience);
    setInt(spLevelItem.offset + 0x6, "uint32", nextExperience);
  } else if ("id" in item && item.id?.match(/current-htp-/)) {
    const itemInt = item as ItemInt;

    const [index] = item.id.splitInt();

    const spSectionItem = getClosestItem("spcSection", item) as ItemSection;
    const spHpItem = spSectionItem.items[index] as ItemInt;

    copyInt(itemInt.offset, spHpItem.offset, 0x2);
  } else if ("id" in item && item.id?.match(/maxHtp-/)) {
    const itemInt = item as ItemInt;

    const [index] = item.id.splitInt();

    const spSectionItem = getClosestItem("spcSection", item) as ItemSection;
    const spHpItem = spSectionItem.items[index] as ItemInt;

    copyInt(itemInt.offset + 0x2, spHpItem.offset, 0x2);
    copyInt(itemInt.offset, spHpItem.offset - 0x2, 0x2);
  }
}

export function generateChecksum(item: ItemChecksum): number {
  let checksum = 0x0;

  for (let i = item.control.offsetStart; i < item.control.offsetEnd; i += 0x1) {
    checksum += getInt(i, "uint8");
  }

  return formatChecksum(checksum, item.dataType);
}

export function beforeSaving(): ArrayBufferLike {
  return repackFile();
}

export function onReset(): void {
  resetState();
}

function getInventory(offset: number): { index: number; quantity: number }[] {
  const inventory: { index: number; quantity: number }[] = [];

  for (let i = 0x0; i < 0x17a; i += 0x1) {
    const itemIndex = getInt(offset + 0x200 + i * 0x2, "uint16");
    const quantity = getInt(offset + itemIndex, "uint8");

    inventory.push({ index: itemIndex, quantity });
  }

  return inventory;
}

function updateInventory(
  offset: number,
  itemIndex: number,
  value: number,
): void {
  const inventory = getInventory(offset);

  const index = inventory.findIndex((item) => item.index === itemIndex);

  console.log(inventory, index, inventory[index]);

  if (value && index !== -1) {
    setInt(offset + itemIndex, "uint8", value);
  } else if (value) {
    const index = inventory.findIndex((item) => item.index === 0x0);

    if (index !== -1) {
      setInt(offset + 0x200 + index * 0x2, "uint16", itemIndex);
      setInt(offset + itemIndex, "uint8", value);
    }
  } else if (index !== -1) {
    setInt(offset + 0x200 + index * 0x2, "uint16", 0x0);
    setInt(offset + itemIndex, "uint8", 0x0);
  }
}

function updateEncounters(offset: number, rank: string): void {
  let normalOffset = offset;
  let hardOffset = offset;
  let maniaOffset = offset;

  switch (rank) {
    case "normal":
      hardOffset += 0x178;
      maniaOffset += 0x17c;
      break;
    case "hard":
      normalOffset -= 0x178;
      maniaOffset += 0x4;
      break;
    case "mania":
      normalOffset -= 0x17c;
      hardOffset -= 0x4;
      break;
  }

  let normal = getInt(normalOffset, "uint32");
  let hard = getInt(hardOffset, "uint32");
  let mania = getInt(maniaOffset, "uint32");

  switch (rank) {
    case "normal":
      hard = Math.min(normal, hard);
      mania = Math.min(normal, mania);
      break;
    case "hard":
      normal = Math.max(normal, hard);
      mania = Math.min(hard, mania);
      break;
    case "mania":
      normal = Math.max(normal, mania);
      hard = Math.max(hard, mania);
      break;
  }

  setInt(normalOffset, "uint32", normal);
  setInt(hardOffset, "uint32", hard);
  setInt(maniaOffset, "uint32", mania);

  setInt(normalOffset - 0xcc0, "uint32", normal); // Save Preview
}
