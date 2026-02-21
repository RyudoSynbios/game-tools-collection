import { get } from "svelte/store";

import { gameJson } from "$lib/stores";
import { getInt } from "$lib/utils/bytes";
import debug from "$lib/utils/debug";
import { getRegionArray } from "$lib/utils/format";
import { getResource } from "$lib/utils/parser";

import type { Item, Resource } from "$lib/types";

import Debug from "./components/Debug.svelte";
import MapViewer from "./components/MapViewer.svelte";
import {
  ENEMY_TEXTS_POINTER,
  ITEM_TEXTS_POINTER,
  MAP_TEXTS_POINTER,
  TEXTS_POINTER,
} from "./utils/constants";
import { getSectionsRoomCount } from "./utils/map";
import { dssCards } from "./utils/resource";

export function getComponent(
  component: string,
): typeof Debug | typeof MapViewer | undefined {
  switch (component) {
    case "Debug":
      return Debug;
    case "MapViewer":
      return MapViewer;
  }
}

export function overrideGetInt(item: Item): [boolean, string | undefined] {
  if ("id" in item && item.id?.match(/mName-/)) {
    const [index] = item.id.splitInt();

    const names = getEnemyNames();

    return [true, names[index]];
  }

  return [false, undefined];
}

export function getDecompressedData(offset: number): Uint8Array {
  const magic = getInt(offset, "uint8");
  const decompressedLength = getInt(offset + 0x1, "uint16");

  if (magic !== 0x10) {
    debug.warn(`Image in offet 0x${offset.toHex()} is not LZSS compressed.`);

    return new Uint8Array(0);
  }

  const decompressedData = new Uint8Array(decompressedLength);

  let index = 0x0;

  offset += 0x4;

  while (index < decompressedLength) {
    const flags = getInt(offset++, "uint8");

    let mask = 0x80;

    while (mask > 0x0) {
      if ((flags & mask) === 0x0) {
        decompressedData[index++] = getInt(offset++, "uint8");
      } else {
        const special1 = getInt(offset++, "uint8");
        const special2 = getInt(offset++, "uint8");

        const position = (((special1 & 0xf) << 0x8) | special2) + 0x1;
        const count = 0x3 + ((special1 >> 0x4) & 0xf);

        for (let i = 0x0; i < count; i += 0x1) {
          decompressedData[index] = decompressedData[index - position];

          index += 0x1;
        }
      }

      mask >>= 0x1;
    }
  }

  return decompressedData;
}

export function getTilesData(offset: number, length?: number): number[][] {
  const tilesData: number[][] = [];

  const isCompressed = getInt(offset, "uint8") === 0x10 || !length;

  let data: Uint8Array;

  if (isCompressed) {
    data = getDecompressedData(offset);
  } else {
    data = new Uint8Array(length);

    for (let i = 0x0; i < length; i += 0x1) {
      data[i] = getInt(offset + i, "uint8");
    }
  }

  for (let i = 0x0; i < data.length / 0x20; i += 0x1) {
    tilesData[i] = [];

    data.slice(i * 0x20, (i + 0x1) * 0x20).forEach((value) => {
      tilesData[i].push(value & 0xf, (value & 0xf0) >> 0x4);
    });
  }

  return tilesData;
}

export function getItemNames(): Resource {
  const names: Resource = {};

  const offset = getInt(getRegionArray(ITEM_TEXTS_POINTER), "uint24");

  for (let i = 0x0; i < 0x37; i += 0x1) {
    names[i] = getText(getInt(offset + i * 0x2, "uint16"));
  }

  names[0x0] = "-";

  for (let i = 0; i < dssCards.length; i += 1) {
    const offset = Object.keys(names).length;

    names[offset] = dssCards[i];
  }

  return names;
}

export function getMapNames(): Resource {
  const names: Resource = {};

  const pointer = getRegionArray(MAP_TEXTS_POINTER);
  const offset = getInt(pointer, "uint24");

  const sections = getSectionsRoomCount();

  let total = 0;

  sections.forEach((count, index) => {
    if (index === 0xf) {
      names[total] = "??????????";
      return;
    }

    const name = getText(getInt(offset + index * 0x4 + 0x2, "uint16"));

    for (let i = 0; i < count; i += 1) {
      names[total + i] = `${name} ${i + 1}`;
    }

    total += count;
  });

  return names;
}

export function getEnemyNames(): Resource {
  const names: Resource = {};

  const offset = getInt(getRegionArray(ENEMY_TEXTS_POINTER), "uint24");

  for (let i = 0x0; i < 0x8e; i += 0x1) {
    names[i] = getText(getInt(offset + i * 0x4, "uint16"));
  }

  return names;
}

export function getText(index: number): string {
  const $gameJson = get(gameJson);

  if (!$gameJson.resources) {
    return "???";
  }

  const offsetTexts = getInt(getRegionArray(TEXTS_POINTER), "uint24");

  let offset = getInt(offsetTexts + (index - 0x8001) * 0x4, "uint24");

  const letters = getResource("letters") as Resource;

  let text = "";

  const isDialog = getInt(offset, "uint8") === 0x1d;

  while (true) {
    const int = getInt(offset, "uint8");

    text += letters[int] || `[${int.toHex(2)}]`;

    if (int === 0) {
      if (
        !isDialog ||
        (isDialog &&
          (getInt(offset - 0x1, "uint8") === 0x3 ||
            (getInt(offset - 0x2, "uint8") === 0x1d &&
              getInt(offset - 0x1, "uint8") === 0x20) ||
            (getInt(offset - 0x2, "uint8") === 0x1d &&
              getInt(offset - 0x1, "uint8") === 0xc0)))
      ) {
        break;
      }
    }

    offset += 0x1;
  }

  return text.replace(/\{.*?\}/g, "");
}
