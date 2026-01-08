import { get } from "svelte/store";

import { gameRegion } from "$lib/stores";
import { getInt, getString } from "$lib/utils/bytes";
import { getRegionArray } from "$lib/utils/format";
import { updateResources } from "$lib/utils/parser";

import type {
  Item,
  ItemContainer,
  ItemInt,
  ItemString,
  Resource,
} from "$lib/types";

import MapViewer from "./components/MapViewer.svelte";

const ENEMY_NAMES_LENGTH = [0xb, 0x8];
const ENEMY_NAMES_OFFSET = [0xc6500, 0xc6700];
const ENEMY_STATS_OFFSET = [0xc4700, 0xc4800];
const INVENTORY_NAMES_LENGTH = [0xa, 0x8];
const INVENTORY_NAMES_OFFSET = 0xc0b5f;

export function getComponent(component: string): typeof MapViewer | undefined {
  if (component === "MapViewer") {
    return MapViewer;
  }
}

export function overrideParseItem(item: Item): Item {
  const $gameRegion = get(gameRegion);

  if ("id" in item && item.id?.match(/iName-/)) {
    const itemString = item as ItemString;

    const [, type] = item.id.split("-");

    const { index } = getInventoryTypeInfos(type);

    if ($gameRegion === 0) {
      itemString.offset += index * 0xb;
    } else if ($gameRegion === 1) {
      itemString.offset += index * 0x9;
      itemString.length = 0x8;
      itemString.overrideShift!.shift = 0x9;
    }

    return itemString;
  } else if ("id" in item && item.id?.match(/iIcon-/)) {
    const itemInt = item as ItemInt;

    const [, type] = item.id.split("-");

    const { index } = getInventoryTypeInfos(type);

    if ($gameRegion === 0) {
      itemInt.offset += index * 0xb;
    } else if ($gameRegion === 1) {
      itemInt.offset += index * 0x9;
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
  }

  return item;
}

export function overrideParseContainerItemsShifts(
  item: ItemContainer,
  shifts: number[],
  index: number,
): [boolean, number[] | undefined] {
  const $gameRegion = get(gameRegion);

  if (item.id === "enemies") {
    const offset = getRegionArray(ENEMY_STATS_OFFSET);

    return [true, [offset, index * item.length]];
  }

  return [false, undefined];
}

export function afterSetInt(item: Item): void {
  if ("id" in item && item.id?.match(/iName-/)) {
    const [, type] = item.id.split("-");

    updateResources(`${type}Names`);
  } else if ("id" in item && item.id === "eEnemy") {
    updateResources("EnemyNames");
  }
}

export function getDecompressedData(
  offset: number,
  type: "map" | "tiles",
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

        switch (type) {
          case "map":
            position = special & 0x7ff;
            count = 0x3 + ((special & 0xf800) >> 0xb);
            break;
          case "tiles":
            position = special & 0xfff;
            count = 0x3 + ((special & 0xf000) >> 0xc);
            break;
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
    names[start + i] = getString(offset, length, "uint8", {
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
      count = 207;
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
      count = 19;
      break;
  }

  return { index, count };
}
