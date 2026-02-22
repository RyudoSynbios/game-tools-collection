import { get } from "svelte/store";

import { dataViewAlt, gameRegion } from "$lib/stores";
import { getInt, getString, setInt } from "$lib/utils/bytes";
import { getTileData } from "$lib/utils/common/superNintendo";
import { clone, getRegionArray } from "$lib/utils/format";
import { applyPalette } from "$lib/utils/graphics";
import { getItem, updateResources } from "$lib/utils/parser";

import type {
  Item,
  ItemBitflag,
  ItemBitflags,
  ItemContainer,
  ItemInt,
  ItemString,
  ItemTab,
  ItemTabs,
  Palette,
  Resource,
} from "$lib/types";

import { techTypes } from "../saveEditor/utils/resource";
import MapViewer from "./components/MapViewer.svelte";
import PartyPortraitSelector from "./components/PartyPortraitSelector.svelte";
import {
  CHARACTERS_EXPERIENCE_CURVE_OFFSET,
  ENEMY_NAMES_LENGTH,
  ENEMY_NAMES_OFFSET,
  ENEMY_STATS_OFFSET,
  EQUIPMENT_BONUS_STATS_TABLE_OFFSET,
  INVENTORY_NAMES_LENGTH,
  INVENTORY_NAMES_OFFSET,
  SHOP_TABLE_OFFSET,
} from "./utils/constants";

export function getComponent(
  component: string,
): typeof MapViewer | typeof PartyPortraitSelector | undefined {
  switch (component) {
    case "PartyPortraitSelector":
      return PartyPortraitSelector;
    case "MapViewer":
      return MapViewer;
  }
}

export function beforeItemsParsing(): void {
  const $dataViewAlt = get(dataViewAlt);

  const data = getDecompressedData(0x1b0000);

  $dataViewAlt.init = new DataView(data.buffer);
}

export function overrideParseItem(item: Item): Item {
  const $gameRegion = get(gameRegion);

  if ("id" in item && item.id?.match(/tech-/)) {
    const itemBitflags = item as ItemBitflags;

    const [characterIndex, typeIndex] = item.id.splitInt();

    const techs = techTypes[typeIndex];

    if (characterIndex === 6 && [1, 2].includes(typeIndex)) {
      itemBitflags.hidden = true;
    }

    itemBitflags.flags = itemBitflags.flags.reduce(
      (flags: ItemBitflag[], flag, index) => {
        flags.push({
          ...flag,
          offset: flag.offset - characterIndex * 0x50,
          hidden: !techs.tech[index].characters.includes(characterIndex),
        });

        return flags;
      },
      [],
    );

    return itemBitflags;
  } else if ("id" in item && item.id?.match(/iName-/)) {
    const itemString = item as ItemString;

    const [, type] = item.id.split("-");

    const { index } = getInventoryTypeInfos(type);

    if ($gameRegion === 0) {
      itemString.offset += INVENTORY_NAMES_OFFSET + index * 0xb;
    } else if ($gameRegion === 1) {
      itemString.offset += INVENTORY_NAMES_OFFSET + index * 0x9;
      itemString.length = 0x8;
      itemString.overrideShift!.shift = 0x9;
    }

    return itemString;
  } else if ("id" in item && item.id?.match(/iIcon-/)) {
    const itemInt = item as ItemInt;

    const [, type] = item.id.split("-");

    const { index } = getInventoryTypeInfos(type);

    if ($gameRegion === 0) {
      itemInt.offset += INVENTORY_NAMES_OFFSET + index * 0xb;
    } else if ($gameRegion === 1) {
      itemInt.offset += INVENTORY_NAMES_OFFSET + index * 0x9;
      itemInt.overrideShift!.shift = 0x9;
    }

    return itemInt;
  } else if ("id" in item && item.id === "eEnemy" && $gameRegion === 1) {
    const itemString = item as ItemString;

    itemString.offset += 0x100;
    itemString.length = 0x8;
    itemString.overrideShift!.shift = 0x8;

    return itemString;
  } else if ("id" in item && item.id === "eDrops" && $gameRegion === 1) {
    const itemInt = item as ItemInt;

    itemInt.offset += 0x100;

    return itemInt;
  } else if ("id" in item && item.id === "shops") {
    const itemTabs = item as ItemTabs;

    const shops = getShops();

    const itemTab = itemTabs.items[0] as ItemTab;

    shops.forEach((shop, index) => {
      itemTabs.items[index] = {
        name: `Shop ${index + 1}`,
        flex: true,
        items: [...Array(shop.items).keys()].map((_, index) => {
          const itemInt = clone(itemTab.items[0]) as ItemInt;

          itemInt.name = `Item ${index + 1}`;
          itemInt.offset = shop.offset + index;

          return itemInt;
        }),
      };
    });
  } else if ("id" in item && item.id === "mEquipmentBonusStats") {
    const itemBitflags = item as ItemBitflags;

    const offset = getRegionArray(EQUIPMENT_BONUS_STATS_TABLE_OFFSET);

    itemBitflags.flags = itemBitflags.flags.map((flag) => ({
      ...flag,
      offset,
    }));

    return itemBitflags;
  } else if ("id" in item && item.id?.match(/mEquipmentBonusStatsValue-/)) {
    const itemInt = item as ItemInt;

    itemInt.offset += getRegionArray(EQUIPMENT_BONUS_STATS_TABLE_OFFSET);

    return itemInt;
  }

  return item;
}

export function overrideParseContainerItemsShifts(
  item: ItemContainer,
  shifts: number[],
  index: number,
): [boolean, number[] | undefined] {
  if (item.id === "enemies") {
    const offset = getRegionArray(ENEMY_STATS_OFFSET);

    return [true, [offset, index * item.length]];
  }

  return [false, undefined];
}

export function overrideSetInt(item: Item, value: string): boolean {
  if ("id" in item && item.id?.match(/baseStats-/)) {
    const itemInt = item as ItemInt;

    let [shift] = item.id.splitInt();

    const int = parseInt(value);

    if (shift !== 58) {
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
  if ("id" in item && item.id === "cLevel") {
    const itemInt = item as ItemInt;

    const characterLevels = getCharacterExperienceCurve();

    const level = getInt(itemInt.offset, "uint8");
    const experience = characterLevels[level - 2] || 0;

    let nextExperience = characterLevels[level - 1] || 0;

    if (nextExperience > 0) {
      nextExperience -= experience;
    }

    setInt(itemInt.offset + 0x1, "uint24", experience);
    setInt(itemInt.offset + 0x19, "uint16", nextExperience);
  } else if ("id" in item && item.id === "cExperience") {
    const itemInt = item as ItemInt;

    const characterLevels = getCharacterExperienceCurve();

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
  } else if ("id" in item && item.id?.match(/iName-/)) {
    const [, type] = item.id.split("-");

    updateResources(`${type}Names`);
  } else if ("id" in item && item.id === "eEnemy") {
    updateResources("enemyNames");
  } else if ("id" in item && item.id?.match(/mEquipmentBonusStats/)) {
    updateResources("equipmentBonusStatsNames");
  }
}

export function pointerToOffset(pointer: number | number[]): number {
  if (Array.isArray(pointer)) {
    pointer = getRegionArray(pointer);
  }

  return getInt(pointer, "uint24") - 0xc00000;
}

const attributesNames = [
  "Pow.",
  "Spd.",
  "Stam.",
  "Hit",
  "Ev.",
  "Mag.",
  "M Def.",
];

export function getEquipmentBonusStatsNames(): Resource {
  const names: Resource = {};

  const itemInt = getItem("mEquipmentBonusStatsValue-0") as ItemInt;

  const offset = itemInt.offset - 0x1;

  for (let i = 0x0; i < 0x16; i += 0x1) {
    const attributes = attributesNames.reduce(
      (attributes: string[], name, index) => {
        if (getInt(offset + i * 0x2, "bit", { bit: 7 - index })) {
          attributes.push(name);
        }

        return attributes;
      },
      [],
    );

    const value = getInt(offset + i * 0x2 + 0x1, "uint8");

    names[i] = `${attributes.join(", ")} +${value}`;
  }

  names[0x0] = "-";

  return names;
}

function getCharacterExperienceCurve(): number[] {
  const experiences: number[] = [];

  const offset = getRegionArray(CHARACTERS_EXPERIENCE_CURVE_OFFSET);

  let experience = 0x0;

  for (let i = 0x0; i < 0x62; i += 0x1) {
    experience += getInt(offset + i * 0x2, "uint16");

    experiences.push(experience);
  }

  return experiences;
}

export function getCharacterNames(): Resource {
  const $dataViewAlt = get(dataViewAlt);

  const names: Resource = {};

  const itemString = getItem("cName-0") as ItemString;

  for (let i = 0x0; i < 0x7; i += 0x1) {
    names[i] = getString(
      itemString.offset + i * 0x6,
      itemString.length,
      itemString.letterDataType,
      {
        endCode: itemString.endCode,
        resource: itemString.resource,
      },
      $dataViewAlt.init,
    );
  }

  return names;
}

export function getDecompressedData(
  offset: number,
  isTiles = false,
): Uint8Array {
  const decompressedData = new Uint8Array(0x10000);

  let index = 0x0;

  const length = getInt(offset, "uint16");

  offset += 0x2;

  let end = offset + length;

  let iCount = 0x8;

  while (offset < end) {
    let flags = getInt(offset++, "uint8");

    for (let i = 0x0; i < iCount; i += 0x1) {
      if ((flags & 0x1) === 0x0) {
        decompressedData[index++] = getInt(offset++, "uint8");
      } else {
        const special = getInt(offset, "uint16");

        let position = 0x0;
        let count = 0x0;

        if (isTiles) {
          position = special & 0xfff;
          count = 0x3 + ((special & 0xf000) >> 0xc);
        } else {
          position = special & 0x7ff;
          count = 0x3 + ((special & 0xf800) >> 0xb);
        }

        for (let j = 0x0; j < count; j += 0x1) {
          decompressedData[index] = decompressedData[index - position];

          index += 0x1;
        }

        offset += 0x2;
      }

      flags >>= 0x1;
    }

    // If the end is reached, we check if there's extra data
    if (offset === end) {
      iCount = getInt(offset++, "uint8") & 0x3f;

      if (iCount) {
        end += getInt(offset, "uint16");
        offset += 0x2;
      }
    }
  }

  return decompressedData.slice(0x0, index);
}

export function getEnemyNames(): Resource {
  const names: Resource = {};

  const length = getRegionArray(ENEMY_NAMES_LENGTH);

  let offset = getRegionArray(ENEMY_NAMES_OFFSET);

  for (let i = 0x0; i < 0x100; i += 0x1) {
    names[i] = getString(offset, length, "uint8", {
      resource: "letters",
    });

    offset += length;
  }

  return names;
}

export function getInventoryNames(type: string, keepIndex = "false"): Resource {
  const names: Resource = {};

  const { index, count } = getInventoryTypeInfos(type);

  const length = getRegionArray(INVENTORY_NAMES_LENGTH);

  let offset = INVENTORY_NAMES_OFFSET + index * (length + 0x1);

  const start = keepIndex === "true" ? index : 0;

  for (let i = 0; i < count; i += 1) {
    names[start + i] = getString(offset + 0x1, length, "uint8", {
      resource: "letters",
    });

    offset += length + 0x1;
  }

  if (type === "*") {
    names[0x0] = "-";
  }

  return names;
}

export function getInventoryTypeInfos(type: string): {
  index: number;
  count: number;
} {
  let index = 0x0;
  let count = 0;

  switch (type) {
    case "*":
      index = 0x0;
      count = 232;
      break;
    case "weapons":
      index = 0x0;
      count = 90;
      break;
    case "armors":
      index = 0x5a;
      count = 33;
      break;
    case "helmets":
      index = 0x7b;
      count = 25;
      break;
    case "accessories":
      index = 0x94;
      count = 40;
      break;
    case "items":
      index = 0xbc;
      count = 20;
      break;
    // case "keyItems":
    //   index = 0xd0;
    //   count = 24;
    //   break;
  }

  return { index, count };
}

export function getPortrait(offset: number, palette: Palette) {
  const spriteData = new Uint8Array(0x1000);

  for (let row = 0x0; row < 0x6; row += 0x1) {
    for (let column = 0x0; column < 0x6; column += 0x1) {
      const tileData = getTileData(offset + row * 0xc0 + column * 0x20, "4bpp");

      for (let line = 0x0; line < 0x40; line += 0x8) {
        spriteData.set(
          tileData.slice(line, line + 0x8),
          row * 0x180 + column * 0x8 + line * 0x6,
        );
      }
    }
  }

  const sprite = applyPalette(spriteData, palette);

  return sprite;
}

function getShops(): { offset: number; items: number }[] {
  const shops = [];

  let offset = getRegionArray(SHOP_TABLE_OFFSET);

  const end = getInt(offset, "uint16") + 0xc0000;

  while (offset < end) {
    const shopOffset = getInt(offset, "uint16") + 0xc0000;

    let items = 0;

    for (let i = 0x0; i < 0x100; i += 0x1) {
      const item = getInt(shopOffset + i, "uint8");

      if (item === 0x0) {
        break;
      }

      items += 0x1;
    }

    shops.push({ offset: shopOffset, items });

    offset += 0x2;
  }

  return shops;
}
