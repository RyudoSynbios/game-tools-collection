import { get } from "svelte/store";

import { gameJson } from "$lib/stores";
import { extractBit, getBitflags, getInt, setInt } from "$lib/utils/bytes";
import type Canvas from "$lib/utils/canvas";
import { getTileData } from "$lib/utils/common/superNintendo";
import { getRegionArray } from "$lib/utils/format";
import { applyPalette, flipTileData } from "$lib/utils/graphics";
import { getResource, updateResources } from "$lib/utils/parser";

import type { Item, ItemInt, Palette, Resource } from "$lib/types";

import BattleBackgroundCanvas from "./components/BattleBackgroundCanvas.svelte";
import Debug from "./components/Debug.svelte";
import MapViewer from "./components/MapViewer.svelte";
import MonsterCanvas from "./components/MonsterCanvas.svelte";
import Monsters from "./components/Monsters.svelte";
import {
  monsterNamesLength,
  pointerToBackgroundsPointers,
  pointerToBattleBackgroundGraphics,
  pointerToBattleBackgroundPalettes,
  pointerToBattleBackgroundTiles,
  pointerToCharacterNames,
  pointerToChestSet,
  pointerToMapsPointers,
  pointerToMonsterGroups,
  pointerToMonsterNames,
  pointerToMonsterSpriteSizes,
  pointerToMonstersTiles,
  pointerToMonsterTiles,
  pointerToMonsterTilesPaterns,
  pointerToMonsterTilesPaternSizes,
  pointerToMovingSprites,
  pointerToSpriteSet,
  pointerToSpritesPalettes,
  pointerToStaticSprites,
  pointerToTilemapPalettes,
  pointerToTilesChunksPalettes,
  pointerToTilesets,
  pointerToVillagersTiles,
} from "./template";

export function getComponent(
  component: string,
):
  | typeof BattleBackgroundCanvas
  | typeof Debug
  | typeof MapViewer
  | typeof MonsterCanvas
  | typeof Monsters
  | undefined {
  if (component === "BattleBackgroundCanvas") {
    return BattleBackgroundCanvas;
  } else if (component === "Debug") {
    return Debug;
  } else if (component === "MapViewer") {
    return MapViewer;
  } else if (component === "MonsterCanvas") {
    return MonsterCanvas;
  } else if (component === "Monsters") {
    return Monsters;
  }
}

export function overrideGetInt(item: Item): [boolean, number | undefined] {
  if ("id" in item && item.id === "mgBattleMusic") {
    const itemInt = item as ItemInt;

    const bitFlags = getBitflags(itemInt.offset);

    let int = 0;

    if (bitFlags[2]) {
      int += 0x4;
    }

    if (bitFlags[3]) {
      int += 0x8;
    }

    return [true, int];
  } else if ("id" in item && item.id === "mgMonster") {
    const itemInt = item as ItemInt;

    const int = getInt(itemInt.offset, "uint8");

    if (int >= 0x80 && int < 0xff) {
      return [true, int - 0x80];
    }
  } else if ("id" in item && item.id === "mgSpecial") {
    const itemInt = item as ItemInt;

    const int = getInt(itemInt.offset, "uint8");

    if (int === 0xff) {
      return [true, 0x0];
    }
  }

  return [false, undefined];
}

export function overrideSetInt(item: Item, value: string): boolean {
  if ("id" in item && item.id === "mgBattleMusic") {
    const itemInt = item as ItemInt;

    const int = parseInt(value);

    setInt(itemInt.offset, "bit", extractBit(int, 2) ? 1 : 0, { bit: 2 });
    setInt(itemInt.offset, "bit", extractBit(int, 3) ? 1 : 0, { bit: 3 });

    return true;
  } else if ("id" in item && item.id === "mgMonster") {
    const itemInt = item as ItemInt;

    const monster = getInt(itemInt.offset, "uint8");

    const int = parseInt(value);

    if (monster > 0x80 && monster < 0xff && int < 255) {
      setInt(itemInt.offset, "uint8", int + 0x80);

      return true;
    }
  }

  return false;
}

export function afterSetInt(item: Item): void {
  if ("id" in item && item.id === "pName") {
    updateResources("characterNames");
  } else if ("id" in item && item.id === "pStats") {
    const itemInt = item as ItemInt;

    const stat = getInt(itemInt.offset, "uint8");
    const previousStat = getInt(itemInt.offset - 0x26, "uint8");
    const equipmentStat = getInt(itemInt.offset - 0x2a, "uint8") - previousStat;

    setInt(itemInt.offset - 0x2a, "uint8", stat + equipmentStat);
    setInt(itemInt.offset - 0x26, "uint8", stat);
    setInt(itemInt.offset, "uint8", stat);
  } else if ("id" in item && item.id === "mName") {
    updateResources("monsterNames");
  } else if ("id" in item && item.id === "mgMonster") {
    updateResources("monsterGroupNames");
  }
}

export function pointerToOffset(
  pointer: number | number[],
  instruction = 0,
): number {
  if (Array.isArray(pointer)) {
    pointer = getRegionArray(pointer);
  }

  if (!instruction) {
    instruction = getInt(pointer - 0x1, "uint8");
  }

  const offset = getInt(pointer, "uint16");

  let bank = 0x2;

  // LDA.W # (immediate)
  if (instruction === 0xa9) {
    bank = Math.floor(pointer / 0x8000);
  }

  // LDA.L $ (absolute long indexed, X)
  if (instruction === 0xbf) {
    bank = getInt(pointer + 0x2, "uint8");
  }

  if (
    pointerToChestSet.includes(pointer) ||
    pointerToMonstersTiles.includes(pointer) ||
    pointerToMovingSprites.includes(pointer) ||
    pointerToStaticSprites.includes(pointer) ||
    pointerToVillagersTiles.includes(pointer)
  ) {
    bank = 0x4;
  } else if (
    pointerToTilesets.includes(pointer) ||
    pointerToTilemapPalettes.includes(pointer) ||
    pointerToTilesChunksPalettes.includes(pointer)
  ) {
    bank = 0x5;
  } else if (pointerToSpritesPalettes.includes(pointer)) {
    bank = 0x7;
  } else if (
    pointerToBackgroundsPointers.includes(pointer) ||
    pointerToMapsPointers.includes(pointer) ||
    pointerToSpriteSet.includes(pointer)
  ) {
    bank = 0xb;
  } else if (
    pointer === 0x2ee ||
    pointerToBattleBackgroundGraphics.includes(pointer) ||
    pointerToBattleBackgroundPalettes.includes(pointer) ||
    pointerToBattleBackgroundTiles.includes(pointer) ||
    pointerToMonsterNames.includes(pointer)
  ) {
    bank = 0xc;
  }

  return offset - 0x8000 + bank * 0x8000;
}

export function getCharacterNames(): { [value: number]: string } {
  const offset = pointerToOffset(pointerToCharacterNames);

  const names: { [value: number]: string } = {};

  [...Array(9).keys()].forEach((index) => {
    names[index] = getText(offset + index * 0x50, 0x10);
  });

  names[0xff] = "-";

  return names;
}

// TODO: Pointers
export function getLocationNames(): { [value: number]: string } {
  const offset = 0x635eb;
  const length = 15;

  const names: { [value: number]: string } = {};

  [...Array(37).keys()].forEach((index) => {
    names[index] = getText(offset + index * length, length);
  });

  names[0xff] = "-";

  return names;
}

export function getMonsterGroupNames(): { [value: number]: string } {
  const monsterGroupsOffset = pointerToOffset(pointerToMonsterGroups);

  const offset = pointerToOffset(pointerToMonsterNames);
  const length = getRegionArray(monsterNamesLength);

  const names: { [value: number]: string } = {};

  [...Array(234).keys()].forEach((index) => {
    names[index] = getText(
      offset +
        (getInt(monsterGroupsOffset + index * 0x4, "uint8") & 0x7f) * length,
      length,
    );
  });

  return names;
}

export function getMonsterNames(): { [value: number]: string } {
  const offset = pointerToOffset(pointerToMonsterNames);
  const length = getRegionArray(monsterNamesLength);

  const names: { [value: number]: string } = {};

  [...Array(81).keys()].forEach((index) => {
    names[index] = getText(offset + index * length, length);
  });

  names[0xff] = "-";

  return names;
}

export function getText(offset: number, length: number): string {
  const $gameJson = get(gameJson);

  if (!$gameJson.resources) {
    return "???";
  }

  const letters = getResource("letters") as Resource;

  let text = "";

  for (let i = 0x0; i < length; i += 0x1) {
    const int = getInt(offset + i, "uint8");

    text += letters[int] || `[${int.toHex(2)}]`;
  }

  return text;
}

export function getMonsterSpritePattern(
  index: number,
  width: number,
  height: number,
): string {
  const tilesPatternsOffset = pointerToOffset(pointerToMonsterTilesPaterns);

  let patternPosition = -1;

  let monsterId = getInt(tilesPatternsOffset + index, "uint8");

  let monsterPatternSizesOffset = pointerToOffset(
    pointerToMonsterTilesPaternSizes,
  );

  while (patternPosition === -1) {
    if (monsterId < getInt(monsterPatternSizesOffset + 0x2, "uint8")) {
      monsterId -= getInt(monsterPatternSizesOffset, "uint8");

      const baseOffset = getInt(monsterPatternSizesOffset + 0x4, "uint8");
      const multiplierOffset = getInt(monsterPatternSizesOffset + 0x5, "uint8");
      const byteLength = getInt(monsterPatternSizesOffset + 0x6, "uint8");
      const frameCount = getInt(monsterPatternSizesOffset + 0x8, "uint8");

      patternPosition =
        baseOffset +
        multiplierOffset * 0x100 +
        monsterId * byteLength * frameCount;
    }

    monsterPatternSizesOffset += 0xa;
  }

  const tilesOffset = pointerToOffset(pointerToMonsterTiles) + patternPosition;

  let pattern = "";

  const binariesMax = (width * height) / Math.pow(8, 3);

  for (let i = 0; i < binariesMax; i += 1) {
    pattern += getInt(tilesOffset + i, "uint8").toBinary();
  }

  return pattern;
}

export function getMonsterSpriteSize(index: number): [number, number] {
  let width = 0;
  let height = 0;

  let spriteSizesOffset = pointerToOffset(pointerToMonsterSpriteSizes);

  while (width + height === 0) {
    if (index <= getInt(spriteSizesOffset, "uint8")) {
      width = getInt(spriteSizesOffset + 0x4, "uint8") * 8;
      height = getInt(spriteSizesOffset + 0x5, "uint8") * 8;
    }

    spriteSizesOffset += 0x9;
  }

  return [width, height];
}

export function generateBattleBackgroundCanvas(
  canvas: Canvas,
  offset: number,
  index: number,
  palettePrimary: Palette,
  paletteSecondary: Palette,
  position: "bottom" | "top",
): void {
  const tilesOffset = pointerToOffset(pointerToBattleBackgroundTiles);

  const graphicsOffset = pointerToOffset(pointerToBattleBackgroundGraphics);

  let repeats = 4;
  let rows = 4;
  let columns = 4;

  if (position === "bottom") {
    repeats = 1;
    rows = 9;
    columns = 16;
  }

  for (let repeat = 0; repeat < repeats; repeat += 1) {
    for (let row = 0; row < rows; row += 1) {
      for (let column = 0; column < columns; column += 1) {
        let tilesChunk = 0x0;

        if (position === "top") {
          tilesChunk = getInt(
            offset + index * 0x10 + row * 0x4 + column,
            "uint8",
          );
        }

        const tileManipulation = getInt(
          tilesOffset + tilesChunk * 0x6 + 0x4,
          "uint8",
        );

        for (let i = 0; i < 4; i += 1) {
          let alternativePalette = false;
          let flipX = false;

          switch (i) {
            case 0:
              alternativePalette = extractBit(tileManipulation, 6);
              flipX = extractBit(tileManipulation, 7);
              break;
            case 1:
              alternativePalette = extractBit(tileManipulation, 4);
              flipX = extractBit(tileManipulation, 5);
              break;
            case 2:
              alternativePalette = extractBit(tileManipulation, 2);
              flipX = extractBit(tileManipulation, 3);
              break;
            case 3:
              alternativePalette = extractBit(tileManipulation, 0);
              flipX = extractBit(tileManipulation, 1);
              break;
          }

          let tileOffset = 0x0;

          if (position === "top") {
            tileOffset = getInt(tilesOffset + tilesChunk * 0x6 + i, "uint8");
          } else {
            tileOffset = getInt(offset + index * 0x6 + i, "uint8");
          }

          const spriteOffset = graphicsOffset + tileOffset * 0x18;

          const x = repeat * 64 + column * 16 + (i & 0x1) * 8;
          const y = (position === "bottom" ? 64 : 0) + row * 16 + (i >> 0x1) * 8; // prettier-ignore

          let palette = palettePrimary;

          if (alternativePalette) {
            palette = paletteSecondary;
          }

          let tileData = getTileData(spriteOffset);

          if (flipX) {
            tileData = flipTileData(tileData, 8, "x");
          }

          const tile = applyPalette(tileData, palette);

          canvas.addGraphic("background", tile, 8, 8, x, y);
        }
      }
    }
  }

  canvas.render();
}

export function generateMonsterCanvas(
  canvas: Canvas,
  offset: number,
  palette: Palette,
  width: number,
  height: number,
  pattern = "",
): void {
  canvas.resize(width, height);

  let count = 0;

  const rows = height / 8;
  const columns = width / 8;

  for (let row = 0; row < rows; row += 1) {
    for (let column = 0; column < columns; column += 1) {
      if (!pattern || pattern[row * columns + column] === "1") {
        const offsetPosition = offset + count * 0x18;

        const tileData = getTileData(offsetPosition);
        const tile = applyPalette(tileData, palette);

        canvas.addGraphic("background", tile, 8, 8, column * 8, row * 8);

        count += 1;
      }
    }
  }

  canvas.render();
}

export function getMappedTiles(
  mapOffset: number,
  tileOffset: number,
  rows: number,
  columns: number,
): number[] {
  const mappedTiles: number[] = [];

  let i = 2;
  let error = false;

  while (mappedTiles.length < columns * rows && !error) {
    const tileRomIterations = getInt(mapOffset + i, "lower4");
    const tileDataIterations = getInt(mapOffset + i, "upper4");
    const tileDataPrevious = getInt(mapOffset + i + 0x1, "uint8") + 1;

    [...Array(tileRomIterations).keys()].forEach(() => {
      mappedTiles.push(getInt(tileOffset, "uint8"));

      tileOffset += 0x1;
    });

    if (tileDataIterations === 0x0) {
      i += 1;
    } else {
      const length = mappedTiles.length;

      [...Array(tileDataIterations + 2).keys()].forEach((index) => {
        mappedTiles.push(mappedTiles[length - tileDataPrevious + index]);
      });

      i += 2;
    }

    if (mappedTiles.length === 0) {
      error = true;
    }
  }

  return mappedTiles;
}
