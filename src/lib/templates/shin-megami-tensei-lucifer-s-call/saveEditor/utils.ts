import { get } from "svelte/store";

import { gameRegion } from "$lib/stores";
import {
  bitToOffset,
  copyInt,
  getInt,
  getString,
  setInt,
} from "$lib/utils/bytes";
import {
  customGetRegions,
  getRegionSaves,
  getSlotShifts,
  repackFile,
  resetState,
  unpackFile,
} from "$lib/utils/common/playstation2";
import { getClosestItem, getItem, updateResources } from "$lib/utils/parser";

import type {
  Item,
  ItemBitflagChecked,
  ItemBitflags,
  ItemContainer,
  ItemInt,
  ItemSection,
  ItemString,
  ItemTabs,
  Resource,
} from "$lib/types";

import { asiaParseItemAdaptater } from "./utils/asia";
import { COMPENDIUM_COUNT, ENDING_BITS } from "./utils/constants";
import {
  demonList,
  locationList,
  magatamaList,
  skillList,
} from "./utils/resource";

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

  if ("id" in item && item.id === "maniaxOnly-flags" && isManiax()) {
    const itemBitflags = item as ItemBitflags;

    itemBitflags.flags.map((flag) => {
      flag.hidden = false;
    });
  } else if ("id" in item && item.id?.match(/^(difficulty|maniaxOnly)$/)) {
    const itemInt = item as ItemInt;

    itemInt.hidden = !isManiax();
  } else if ("id" in item && item.id === "compendiumList" && isManiax()) {
    const itemBitflags = item as ItemBitflags;

    let hiddenIndex = -1;

    itemBitflags.flags.map((flag, index) => {
      if (flag.hidden && hiddenIndex === -1) {
        hiddenIndex = index;
      }

      flag.hidden = false;
    });

    if (hiddenIndex !== -1) {
      if (isChronicle()) {
        itemBitflags.flags[hiddenIndex].hidden = true;
      } else {
        itemBitflags.flags[hiddenIndex + 1].hidden = true;
      }
    }
  }

  if ("id" in item && item.id === "slots") {
    const itemContainer = item as ItemContainer;

    const saves = getRegionSaves();

    itemContainer.instances = saves.length;
  } else if ("id" in item && item.id?.match(/demon-party-\d+-0/)) {
    const itemInt = item as ItemInt;

    itemInt.hidden = true;
  }

  if ($gameRegion >= 2) {
    return asiaParseItemAdaptater(item);
  }

  return item;
}

export function overrideParseContainerItemsShifts(
  item: ItemContainer,
  shifts: number[],
  index: number,
): [boolean, number[] | undefined] {
  if (item.id === "slots") {
    return getSlotShifts(index);
  } else if (item.id?.match(/party-/) && index > 0) {
    return [true, [...shifts, (index + 3) * item.length]];
  }

  return [false, undefined];
}

export function overrideItem(item: Item): Item {
  if ("id" in item && item.id?.match(/^(party|compendium)-/)) {
    const itemTabs = item as ItemTabs;

    const [type] = item.id.split("-");

    const slotsItem = getItem(
      item.id.replace(`${type}-`, `slots-${type}-`),
    ) as ItemInt;

    let slots = getInt(slotsItem.offset, "uint16");

    itemTabs.items.map((item, index) => {
      item.disabled = index > slots;
    });

    return itemTabs;
  } else if ("id" in item && item.id?.match(/skill-/)) {
    const itemInt = item as ItemInt;

    const [index] = item.id.splitInt();

    const int = getInt(itemInt.offset - (index + 1) * 0x2, "uint8");

    itemInt.disabled = index >= int;

    return itemInt;
  } else if ("id" in item && item.id?.match(/magatamaSkills-0-/)) {
    const itemInt = item as ItemInt;

    const [, index] = item.id.splitInt();

    const magatamas = getMagatamas(itemInt.offset - 0x41);

    const magatama = magatamas.find((magatama) => magatama.index === index);

    itemInt.max = magatama?.max;
    itemInt.disabled = !magatama;

    return itemInt;
  } else if ("id" in item && item.id?.match(/demonStats/)) {
    const itemInt = item as ItemInt;

    const section1Item = getClosestItem("statusSection", item) as ItemSection;
    const section2Item = section1Item.items[0] as ItemSection;
    const demonItem = section2Item.items[0] as ItemInt;

    const demonIndex = getInt(demonItem.offset, "uint16");

    itemInt.disabled = !demonItem.hidden && demonIndex === 0x0;

    return itemInt;
  }

  return item;
}

export function overrideGetInt(
  item: Item,
): [boolean, number | string | ItemBitflagChecked[] | undefined] {
  if ("id" in item && item.id?.match(/^name-/)) {
    const itemString = item as ItemString;

    const [, type] = item.id.split("-");

    let offset = itemString.offset;
    let length = 0;

    if (type === "nickname") {
      const lengthItem = getClosestItem("charLength-nickname", item) as ItemInt;

      length = getInt(lengthItem.offset, "uint8") * 0x2;
    } else {
      const lastItem = getClosestItem("charLength-last", item) as ItemInt;
      const firstItem = getClosestItem("charLength-first", item) as ItemInt;

      const lastLength = getInt(lastItem.offset, "uint8") * 0x2;
      const firstLength = getInt(firstItem.offset, "uint8") * 0x2;

      offset += type === "first" ? lastLength : 0x0;
      length = type === "last" ? lastLength : firstLength;
    }

    const name = getString(offset, length, "uint16", {
      letterBigEndian: true,
      endCode: 0x0,
      resource: itemString.resource,
    });

    return [true, name];
  } else if ("id" in item && item.id === "ending") {
    const itemInt = item as ItemInt;

    const int = ENDING_BITS.findIndex((bit, index) => {
      if (index === 0 && !isManiax()) {
        return false;
      }

      const int = getInt(itemInt.offset + bitToOffset(bit), "bit", {
        bit: bit % 8,
      });

      return Boolean(int);
    });

    return [true, int + 1];
  } else if ("id" in item && item.id?.match(/skill-/)) {
    const itemInt = item as ItemInt;

    if (itemInt.disabled) {
      return [true, 0x0];
    }
  } else if ("id" in item && item.id?.match(/magatama-/)) {
    const itemInt = item as ItemInt;

    const [index] = item.id.splitInt();

    const magatamas = getMagatamas(itemInt.offset);

    const magatama = magatamas.find((magatama) => magatama.index === index);

    return [true, magatama ? 1 : 0];
  } else if ("id" in item && item.id?.match(/magatamaSkills-/)) {
    const itemInt = item as ItemInt;

    const [type, index] = item.id.splitInt();

    const magatamas = getMagatamas(itemInt.offset - 0x41);

    const magatama = magatamas.find((magatama) => magatama.index === index);

    let skills = 0;
    let mastered = 0;

    if (magatama) {
      skills = magatama.skills & 0x7f;
      mastered = magatama.skills >> 0x7;
    }

    return [true, type === 0 ? skills : mastered];
  } else if ("id" in item && item.id === "compendiumRegistered") {
    const itemInt = item as ItemInt;

    const count = getInt(itemInt.offset, "uint32");
    const total = COMPENDIUM_COUNT[isManiax() ? 1 : 0];

    let percent = Math.floor((count / total) * 100);

    if (count > 0 && percent === 0) {
      percent = 1;
    }

    return [true, percent];
  } else if ("id" in item && item.id === "compendiumList") {
    const itemBitflags = item as ItemBitflags;

    const demons = getCompendiumDemons(itemBitflags.flags[0].offset);

    const flags = itemBitflags.flags.reduce(
      (flags: ItemBitflagChecked[], flag) => {
        flags.push({
          ...flag,
          checked: demons[flag.bit - 1],
        });

        return flags;
      },
      [],
    );

    return [true, flags];
  }

  return [false, undefined];
}

export function overrideSetInt(item: Item, value: string): boolean {
  if ("id" in item && item.id === "ending") {
    const itemInt = item as ItemInt;

    const index = parseInt(value);

    ENDING_BITS.forEach((bit, index) => {
      if (index > 0 || isManiax()) {
        setInt(itemInt.offset + bitToOffset(bit), "bit", 0, {
          bit: bit % 8,
        });
      }
    });

    const bit = ENDING_BITS[index - 0x1];

    setInt(itemInt.offset + bitToOffset(bit), "bit", 1, {
      bit: bit % 8,
    });

    return true;
  } else if ("id" in item && item.id?.match(/magatama-/)) {
    const itemInt = item as ItemInt;

    const [index] = item.id.splitInt();

    const magatamas = getMagatamas(itemInt.offset);

    const magatamaIndex = magatamas.findIndex(
      (magatama) => magatama.index === index,
    );

    if (value === "1") {
      const slotIndex = magatamas.findIndex(
        (magatama) => magatama.index === 0xff,
      );

      if (slotIndex !== -1) {
        magatamas[slotIndex].index = index;
      }
    } else {
      magatamas[magatamaIndex].index = 0xff;
      magatamas[magatamaIndex].skills = 0x0;
    }

    let count = 0;

    magatamas
      .sort((a, b) => a.index - b.index)
      .forEach((magatama, index) => {
        const magatamaIndex = magatama.index === 0xff ? 0x0 : magatama.index;

        setInt(itemInt.offset + index, "uint8", magatamaIndex);
        setInt(itemInt.offset + 0x41 + index, "uint8", magatama.skills);

        count += magatama.index !== 0xff ? 1 : 0;
      });

    setInt(itemInt.offset + 0x80, "uint8", count);

    return true;
  } else if ("id" in item && item.id?.match(/magatamaSkills-0-/)) {
    const itemInt = item as ItemInt;

    const [, index] = item.id.splitInt();

    let int = parseInt(value);

    const magatamas = getMagatamas(itemInt.offset - 0x41);

    const magatamaIndex = magatamas.findIndex(
      (magatama) => magatama.index === index,
    );

    if (magatamaIndex !== -1) {
      if (int === magatamas[magatamaIndex].max) {
        int |= 0x80;
      }

      setInt(itemInt.offset + magatamaIndex, "uint8", int);
    }

    return true;
  }

  return false;
}

export function afterSetInt(item: Item): void {
  if ("id" in item && item.id?.match(/^name-nickname-/)) {
    const itemString = item as ItemString;

    const [slotIndex] = item.id.splitInt();

    const lengthItem = getClosestItem("charLength-nickname", item) as ItemInt;
    const nameSPItem = getClosestItem("name-nickname-savePreview", item) as ItemInt; // prettier-ignore
    const lengthSPItem = getClosestItem("charLength-nickname-savePreview", item) as ItemInt; // prettier-ignore

    const name = getString(itemString.offset, itemString.length, "uint16", {
      letterBigEndian: true,
      endCode: 0x0,
      resource: itemString.resource,
    });

    setInt(lengthItem.offset, "uint8", name.length);

    copyInt(lengthItem.offset, lengthSPItem.offset);
    copyInt(itemString.offset, nameSPItem.offset, itemString.length);

    updateCharacterNames(slotIndex);
  } else if ("id" in item && item.id === "playtime") {
    const itemInt = item as ItemInt;

    const spItem = getClosestItem(/savePreviewSection/, item) as ItemSection;
    const playtimeSpItem = spItem.items[3] as ItemInt;

    copyInt(itemInt.offset, playtimeSpItem.offset, 0x4);
  } else if ("id" in item && item.id === "difficulty") {
    const itemInt = item as ItemInt;

    const spItem = getClosestItem(/savePreviewSection/, item) as ItemSection;
    const difficultySpItem = spItem.items[2] as ItemInt;

    const difficulty = getInt(itemInt.offset, "uint8");

    setInt(difficultySpItem.offset, "uint8", difficulty === 0x4 ? 1 : 0);
  } else if ("id" in item && item.id === "location") {
    const itemInt = item as ItemInt;

    const spItem = getClosestItem(/savePreviewSection/, item) as ItemSection;
    const locationSpItem = spItem.items[0] as ItemInt;

    const type = getInt(itemInt.offset, "uint16");
    const location = getInt(itemInt.offset + 0x2, "uint16");

    const int = (location << 0x8) | type;

    setInt(locationSpItem.offset, "uint16", int);
  } else if ("id" in item && item.id?.match(/demon-/)) {
    const [, type] = item.id.split("-");
    const [slotIndex, index] = item.id.splitInt();

    updateDemonData(type, slotIndex, index - (type === "party" ? 1 : 0));
  } else if ("id" in item && item.id?.match(/demonStats-level/)) {
    const itemInt = item as ItemInt;

    const [, , type] = item.id.split("-");
    const [slotIndex, index] = item.id.splitInt();

    if (type === "party" && index === 0) {
      const spItem = getItem(`savePreviewSection-${slotIndex}`) as ItemSection;
      const levelSpItem = spItem.items[1] as ItemInt;

      const level = getInt(itemInt.offset, "uint16");

      setInt(levelSpItem.offset, "uint8", level);
    }
  }
}

export function beforeSaving(): ArrayBufferLike {
  return repackFile();
}

export function onReset(): void {
  resetState();
}

export function getCharacterNames(type: string, slotIndex: number): Resource {
  if (slotIndex === undefined) {
    return {};
  }

  const names: Resource = {};

  // prettier-ignore
  if (type === "party") {
    const itemString = getItem(`name-nickname-${slotIndex}`) as ItemString;
    const lengthItem = getClosestItem("charLength-nickname", itemString) as ItemInt;

    const length = getInt(lengthItem.offset, "uint8") * 0x2;

    names[0x0] = getString(itemString.offset, length, "uint16", {
      letterBigEndian: true,
      endCode: 0x0,
      resource: itemString.resource,
    });
  }

  const table = getDemonTableInfos(type, slotIndex);

  const start = type === "party" ? 0x1 : 0x0;
  const offset = table.offset + (type === "party" ? 0x4 : 0x0);

  for (let i = 0x0; i < table.count; i += 0x1) {
    const index = getInt(offset + i * table.length, "uint16");

    if (index !== 0x0) {
      const demon = demonList.find((demon) => demon.index === index);

      names[start + i] = demon?.name || "";
    }
  }

  return names;
}

export function getCompendiumDemons(offset: number): boolean[] {
  const count = COMPENDIUM_COUNT[isManiax() ? 1 : 0];

  const demons = Array(count).fill(false);

  for (let i = 0x0; i < count; i += 0x1) {
    const index = getInt(offset + i * 0xb0, "uint16");

    demons[index - 1] = true;
  }

  return demons;
}

export function getDemonNames(): Resource {
  const names: Resource = {};

  demonList.forEach((demon) => {
    if (
      (!demon.maniax && !demon.chronicle) ||
      (demon.maniax && isManiax()) ||
      (demon.chronicle && isChronicle())
    ) {
      names[demon.index] = demon.name;
    }
  });

  names[0x0] = "-";

  return names;
}

function getDemonTableInfos(
  type: string,
  slotIndex: number,
): {
  offset: number;
  count: number;
  length: number;
} {
  const slotsItem = getItem(`slots-${type}-${slotIndex}`) as ItemInt;

  if (type === "party") {
    return {
      offset: slotsItem.offset + 0x3b4,
      count: 0xc,
      length: 0xec,
    };
  }

  return {
    offset: slotsItem.offset + 0x10,
    count: COMPENDIUM_COUNT[isManiax() ? 1 : 0],
    length: 0xb0,
  };
}

interface Magatama {
  index: number;
  skills: number;
  max: number;
}

function getMagatamas(offset: number): Magatama[] {
  const magatamas: Magatama[] = [];

  for (let i = 0x0; i < 0x19; i += 0x1) {
    const index = getInt(offset + i, "uint8") || 0xff;
    const skills = getInt(offset + 0x41 + i, "uint8");

    const magatama = magatamaList.find((magatama) => magatama.index === index);

    let max = 0;

    if (magatama) {
      max = magatama.max + (index === 0x1 && isManiax() ? 1 : 0);
    }

    magatamas.push({ index, skills, max });
  }

  return magatamas;
}

export function getEndingsNames(): Resource {
  const names: Resource = {
    0x0: "-",
    0x2: "Freedom Ending",
    0x3: "Demon Ending",
    0x4: "Shijima Ending",
    0x5: "Musubi Ending",
    0x6: "Yosuga Ending",
  };

  if (isManiax()) {
    names[0x1] = "True Demon Ending";
  }

  return names;
}

export function getLocationNames(): Resource {
  const names: Resource = {};

  locationList.forEach((location) => {
    if (!location.maniax || (location.maniax && isManiax())) {
      names[location.index] = location.name;
    }
  });

  return names;
}

export function getSkillNames(): Resource {
  const names: Resource = {};

  skillList.forEach((skill) => {
    if (!skill.maniax || (skill.maniax && isManiax())) {
      names[skill.index] = skill.name;
    }
  });

  names[0x0] = "-";

  return names;
}

export function getSlotNames(): Resource {
  const saves = getRegionSaves();

  const names = saves.reduce((names: Resource, save, index) => {
    const [, , , slotIndex] = save.file.name.split("-");

    names[index] = `Slot ${parseInt(slotIndex) + 1}`;

    return names;
  }, {});

  return names;
}

export function isChronicle(): boolean {
  const $gameRegion = get(gameRegion);

  return $gameRegion === 4;
}

export function isManiax(): boolean {
  const $gameRegion = get(gameRegion);

  return [0, 1, 3, 4, 6].includes($gameRegion);
}

export function onSlotChange(slotIndex: number): void {
  updateCharacterNames(slotIndex);
  updateCompendiumNames(slotIndex);
}

function updateCharacterNames(slotIndex: number): void {
  const values = getCharacterNames("party", slotIndex);

  updateResources("characterNames", values);
}

function updateCompendiumNames(slotIndex: number): void {
  const values = getCharacterNames("compendium", slotIndex);

  updateResources("compendiumNames", values);
}

function updateDemonData(type: string, slotIndex: number, index: number): void {
  const table = getDemonTableInfos(type, slotIndex);

  const offset = table.offset + index * table.length;

  // Update demon data

  const demonIndex = getInt(offset + (type === "party" ? 0x4 : 0x0), "uint16");
  const maxHp = getInt(offset + (type === "party" ? 0x8 : 0x4), "uint16");

  if (demonIndex !== 0x0 && maxHp === 0x0) {
    if (type === "party") {
      setInt(offset, "uint8", 1); // Joined
      setInt(offset + 0x8, "uint16", 1); // Max HP
      setInt(offset + 0xc, "uint16", 1); // Max MP
      setInt(offset + 0x14, "uint16", 1); // Level
    } else if (type === "compendium") {
      setInt(offset + 0x4, "uint16", 1); // Max HP
      setInt(offset + 0x6, "uint16", 1); // Max MP
      setInt(offset + 0xc, "uint16", 1); // Level
    }
  } else if (demonIndex === 0x0) {
    for (let i = offset; i < offset + table.length; i += 0x4) {
      setInt(i, "uint32", 0x0);
    }
  }

  // Clean compendium data

  const slots = getInt(table.offset - 0x10, "uint16");

  // If a demon is removed and is not the last one on the list, we shift the data upwards
  if (type === "compendium" && demonIndex === 0x0 && index + 1 < slots) {
    const length = (table.count - index - 1) * table.length;

    copyInt(offset + table.length, offset, length);

    // Clear last slot data

    const clearOffset = table.offset + (table.count - 1) * table.length;

    for (let i = clearOffset; i < clearOffset + table.length; i += 0x4) {
      setInt(i, "uint32", 0x0);
    }
  }

  // Update count

  let count = 0;

  const countOffset = table.offset + (type === "party" ? 0x4 : 0x0);

  for (let i = 0x0; i < table.count; i += 0x1) {
    count +=
      getInt(countOffset + i * table.length, "uint16") !== 0x0 ? 0x1 : 0x0;
  }

  if (type === "party") {
    setInt(table.offset + 0xb20, "uint32", count + 1);
  } else if (type === "compendium") {
    setInt(table.offset - 0x10, "uint32", count);
  }

  // Update names

  if (type === "party") {
    updateCharacterNames(slotIndex);
  } else if (type === "compendium") {
    updateCompendiumNames(slotIndex);
  }
}
