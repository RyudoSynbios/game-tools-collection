import { extractBit, getInt, getIntFromArray } from "$lib/utils/bytes";
import { getColor } from "$lib/utils/graphics";

import type { Palette } from "$lib/types";

import { getDecompressedData } from "../utils";
import {
  HERO_TILES_OFFSET,
  MAP_OFFSET,
  MAP_TILES_OFFSET,
  PALETTES_OFFSET,
  SPRITE_TABLE_OFFSET,
  SPRITES_BASE_TILES_OFFSET,
  SPRITES_DATA,
  SPRITES_OVERRIDE_TILES_OFFSET,
  UI_TILES_OFFSET,
} from "./constants";

export function getHeroTiles(): Uint8Array {
  const length = getInt(HERO_TILES_OFFSET + 0x4, "uint32");

  return getTiles(HERO_TILES_OFFSET + 0x8, length);
}

export function getMapTiles(baseOffset: number): Uint8Array {
  const index = getInt(baseOffset, "uint8") - 0x1;

  if (index === -1) {
    return new Uint8Array(0x0);
  }

  const offset =
    MAP_TILES_OFFSET +
    getInt(MAP_TILES_OFFSET + index * 0x4, "uint32", { bigEndian: true });

  const length = getInt(offset + 0x4, "uint32");

  return getTiles(offset + 0x8, length);
}

export function getSpriteTiles(
  roomIndex: number,
  spriteId: number,
): Uint8Array {
  const tableOffset = getInt(SPRITE_TABLE_OFFSET + roomIndex * 0x4, "uint32", {
    bigEndian: true,
  });

  const dataOffset = getInt(tableOffset + spriteId * 0x8 + 0x4, "uint32", {
    bigEndian: true,
  });

  const index = getInt(SPRITES_DATA + (dataOffset & 0xff) * 0x8, "uint8") - 0x1;

  if (index == -1) {
    return new Uint8Array();
  }

  const offset =
    SPRITES_BASE_TILES_OFFSET +
    getInt(SPRITES_BASE_TILES_OFFSET + index * 0x4, "uint32", {
      bigEndian: true,
    });

  const length = getInt(offset + 0x4, "uint32");

  return getTiles(offset + 0x8, length);
}

export function getUITiles(): Uint8Array {
  const length = getInt(UI_TILES_OFFSET + 0x4, "uint32");

  return getTiles(UI_TILES_OFFSET + 0x8, length);
}

export function getMap(baseOffset: number): number[] {
  const index = getInt(baseOffset, "uint8") - 0x1;

  const offset =
    MAP_OFFSET +
    getInt(MAP_OFFSET + index * 0x4, "uint32", { bigEndian: true });

  const length = getInt(offset + 0x4, "uint32");

  const map = getDecompressedData(offset + 0x8, length);

  for (let i = 0x0; i < 0x1000; i += 0x1) {
    map[i * 0x2] += 0x1;
  }

  return map;
}

export function getMapValue(offset: number, map: number[]): number {
  return getIntFromArray(map, offset, "uint16", true);
}

export function getSprites(baseOffset: number): number[] {
  const index = getInt(baseOffset, "uint16", { bigEndian: true }) - 0x1;

  if (index === -1) {
    return [];
  }

  const offset =
    SPRITES_OVERRIDE_TILES_OFFSET +
    getInt(SPRITES_OVERRIDE_TILES_OFFSET + index * 0x4, "uint32", {
      bigEndian: true,
    });

  const length = getInt(offset + 0x4, "uint32");

  return getDecompressedData(offset + 0x8, length);
}

export function getPalettes(baseOffset: number): Palette[] {
  const palettes: Palette[] = [];

  for (let i = 0x0; i < 0x4; i += 0x1) {
    const palette: Palette = [];

    const offset = (getInt(baseOffset + i, "uint8") - 0x1) * 0x20;

    for (let j = 0x0; j < 0x10; j += 0x1) {
      const encoded = getInt(PALETTES_OFFSET + offset + j * 0x2, "uint16", {
        bigEndian: true,
      });

      const rawColor =
        (((encoded & 0x3e) >> 0x3) << 0x9) |
        ((encoded >> 0xd) << 0x5) |
        (((encoded & 0x7c0) >> 0x8) << 0x1);

      const color = getColor(rawColor, "BGR333");

      palette.push(color);
    }

    palettes.push(palette);
  }

  return palettes;
}

export function getTiles(offset: number, length: number): Uint8Array {
  const vdp = new Uint8Array(0x10000);

  let vdpaCount = 0x0;

  const callback = (
    decompressedData: number[],
    bufferIndex: number,
  ): [number[], number] => {
    let position = 0x0;

    const count = (bufferIndex >> 0x1) - 0x1;

    for (let i = 0x0; i <= count; i += 0x1) {
      for (let j = 0x0; j < 0x2; j += 0x1) {
        vdp.set([decompressedData[position + j]], vdpaCount++);
      }

      position += 0x2;
    }

    const clearFlag = !extractBit(bufferIndex, 0);

    bufferIndex = 0x0;

    if (!clearFlag) {
      decompressedData[bufferIndex] = decompressedData[position + bufferIndex];

      bufferIndex += 0x1;
    }

    return [decompressedData, bufferIndex];
  };

  getDecompressedData(offset, length, callback);

  return vdp.slice(0x0, length);
}

export function generateTilesetData(vdp: Uint8Array): number[][] {
  const tilesetDatas: number[][] = [];

  vdp.forEach((data, index) => {
    const high = data >> 0x4;
    const low = data - (high << 0x4);

    const tileIndex = Math.floor(index / 0x20);

    if (!tilesetDatas[tileIndex]) {
      tilesetDatas[tileIndex] = [];
    }

    tilesetDatas[tileIndex].push(high, low);
  });

  return tilesetDatas;
}
