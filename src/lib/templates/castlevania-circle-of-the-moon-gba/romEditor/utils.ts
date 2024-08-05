import { get } from "svelte/store";

import { gameJson } from "$lib/stores";
import { extractBinary, extractBit, getInt } from "$lib/utils/bytes";
import type Canvas from "$lib/utils/canvas";
import debug from "$lib/utils/debug";
import { getRegionArray } from "$lib/utils/format";
import { applyPalette, flipTileData } from "$lib/utils/graphics";

import type { Item, Palette } from "$lib/types";

import Debug from "./components/Debug.svelte";
import MapViewer from "./components/MapViewer.svelte";
import {
  pointerToItemTexts,
  pointerToMapTexts,
  pointerToMapsPointers,
  pointerToMonsterTexts,
  pointerToTexts,
  shinyArmorSpriteGraphics,
} from "./template";
import { getMonsterSpriteInfos, getSpriteFrameOffset } from "./utils/sprite";

export function getComponent(component: string): any {
  if (component === "Debug") {
    return Debug;
  } else if (component === "MapViewer") {
    return MapViewer;
  }
}

export function overrideGetInt(item: Item): [boolean, string | undefined] {
  if ("id" in item && item.id?.match(/mName-/)) {
    const split = item.id.split("-");

    const index = parseInt(split[1]);

    const names = getMonsterNames();

    return [true, names[index]];
  }

  return [false, undefined];
}

export function generateMap(
  canvas: Canvas,
  layer: string,
  tileset: number[][],
  palettes: Palette[],
  tilesColisions: number[][],
  paletteColisions: Palette,
  roomInfosOffset: number,
  roomOffset: number,
): void {
  const blocks: Uint8Array[][] = [];
  const blocksColisions: Uint8Array[][] = [];

  const blocksOffset = getInt(roomInfosOffset + 0x4, "uint24");
  const colisions = getInt(roomInfosOffset + 0x8, "uint24");
  const roomWidth = getInt(roomInfosOffset + 0x10, "uint16");
  const roomHeight = getInt(roomInfosOffset + 0x12, "uint16");

  for (let i = 0; i < roomWidth * roomHeight * 0x2; i += 0x2) {
    const blockX = ((i / 2) % roomWidth) * 32;
    const blockY = Math.floor(i / 2 / roomWidth) * 32;

    const blockIndex = getInt(roomOffset + i, "uint16");

    if (!blocks[blockIndex]) {
      const tiles: number[] = [];
      const collisionsTiles: number[] = [];

      for (let j = 0x0; j < 0x10; j += 0x1) {
        tiles.push(
          getInt(blocksOffset + (blockIndex * 0x10 * 0x2 + j * 0x2), "uint16"),
        );

        if (colisions) {
          collisionsTiles.push(
            getInt(colisions + (blockIndex * 0x10 + j), "uint8"),
          );
        }
      }

      blocks[blockIndex] = getBlock(tiles, tileset, palettes);

      if (colisions) {
        blocksColisions[blockIndex] = getBlock(
          collisionsTiles,
          tilesColisions,
          [paletteColisions],
        );
      }
    }

    blocks[blockIndex].forEach((tile, index) => {
      const x = blockX + (index % 0x4) * 0x8;
      const y = blockY + Math.floor(index / 0x4) * 0x8;

      canvas.addGraphic(layer, tile, 8, 8, x, y);
    });

    if (colisions) {
      blocksColisions[blockIndex].forEach((tile, index) => {
        const x = blockX + (index % 0x4) * 0x8;
        const y = blockY + Math.floor(index / 0x4) * 0x8;

        canvas.addGraphic("collisions", tile, 8, 8, x, y);
      });
    }
  }
}

export function generateSprites(
  canvas: Canvas,
  offset: number,
  spriteset: number[][],
  palettes: Palette[],
  monsters: { index: number; firstTile: number }[],
  spriteSpecial: number,
): void {
  while (true) {
    if (getInt(offset + 0xb, "uint8") === 0x80) {
      break;
    }

    const blockX = getInt(offset, "uint16");
    const blockY = getInt(offset + 0x2, "uint16");
    const type = getInt(offset + 0x4, "uint16");
    const spriteId = getInt(offset + 0x6, "uint16");
    const unknown = getInt(offset + 0x8, "uint16");
    const event = getInt(offset + 0xb, "uint8");

    const handledSprites = [
      0x1de, 0x1df, 0x1e4, 0x1e6, 0x1e7, 0x1e8, 0x1ea, 0x1eb, 0x1ec, 0x1ed,
      0x1ee, 0x1f1, 0x1f4, 0x1f5, 0x1f6, 0x1f7, 0x1f9, 0x1fa, 0x1fd,
    ];

    let frameSkip = 0;

    const monster = getMonsterSpriteInfos(type, monsters);

    if (monster) {
      frameSkip = monster.frameSkip;
    }

    if (monster || handledSprites.includes(type)) {
      let offset = getSpriteFrameOffset(type, spriteId, spriteSpecial, monster);

      while (true) {
        const anchorX = getInt(offset, "int16");
        const anchorY = getInt(offset + 0x2, "int16");
        let tileIndex = getInt(offset + 0x4, "uint16") & 0xfff;
        let paletteIndex = getInt(offset + 0x4, "uint16") >> 0xc;
        const effects1 = getInt(offset + 0x6, "uint8");
        const effects2 = getInt(offset + 0x7, "uint8");

        let stop = extractBit(effects1, 0);
        const flipX = extractBit(effects1, 4);
        const flipY = extractBit(effects1, 5);
        const size1 = extractBit(effects1, 6);
        const size2 = extractBit(effects1, 7);

        const layout1 = extractBit(effects2, 6);
        const layout2 = extractBit(effects2, 7);

        if (frameSkip > 0) {
          if (stop) {
            frameSkip -= 1;
            stop = false;
          }
        } else {
          if (monster) {
            tileIndex += 0x200 + monster.firstTile;
            paletteIndex += monsters.findIndex(
              (m) => m.index === monster.index,
            );

            if (!monster.isBoss) {
              paletteIndex += 0x8;
            }
          }

          if (type === 0x1e7) {
            getSpriteData(
              getRegionArray(shinyArmorSpriteGraphics) + tileIndex * 0x20,
              0x80,
            ).forEach((tile, index) => {
              spriteset[0x3e0 + index] = tile;
            });

            tileIndex = 0x3e0;
          }

          let width = 1;
          let height = 1;

          if (size1) {
            width *= 2;
            height *= 2;
          }

          if (size2) {
            width *= 4;
            height *= 4;
          }

          if (layout1) {
            height = Math.max(1, height / 2);

            if (!size2) {
              width *= 2;
            }
          }

          if (layout2) {
            width = Math.max(1, width / 2);

            if (!size2) {
              height *= 2;
            }
          }

          for (let h = 0; h < height; h += 1) {
            for (let w = 0; w < width; w += 1) {
              let x = blockX + anchorX + w * 8;
              let y = blockY + anchorY + 1 + h * 8;

              let tileData = spriteset[tileIndex + h * width + w];

              if (flipX) {
                tileData = flipTileData(tileData, 8, "x");

                if (width === 2) {
                  if (w === 0) {
                    x += 0x8;
                  } else {
                    x -= 0x8;
                  }
                } else if (width === 4) {
                  if (w === 0) {
                    x += 0x18;
                  } else if (w === 1) {
                    x += 0x8;
                  } else if (w === 2) {
                    x -= 0x8;
                  } else {
                    x -= 0x18;
                  }
                }
              }

              if (flipY) {
                tileData = flipTileData(tileData, 8, "y");

                if (height === 2) {
                  if (h === 0) {
                    y += 0x8;
                  } else {
                    y -= 0x8;
                  }
                } else if (height === 4) {
                  if (h === 0) {
                    y += 0x18;
                  } else if (h === 1) {
                    y += 0x8;
                  } else if (h === 2) {
                    y -= 0x8;
                  } else {
                    y -= 0x18;
                  }
                }
              }

              const tile = applyPalette(tileData, palettes[paletteIndex]);

              canvas.addGraphic(
                monster ? "monsters" : "sprites",
                tile,
                8,
                8,
                x,
                y,
              );
            }
          }
        }

        offset += 0x8;

        if (stop) {
          break;
        }
      }
    }

    offset += 0xc;
  }
}

export function getBlock(
  tiles: number[],
  tileset: number[][],
  palettes: Palette[],
): Uint8Array[] {
  const block: Uint8Array[] = [];

  tiles.forEach((rawTile: number) => {
    let tileIndex = rawTile & 0x3ff;

    const effects = rawTile >> 0x8;

    const flipX = extractBit(effects, 2);
    const flipY = extractBit(effects, 3);

    let paletteIndex = extractBinary(effects, 4, 3);
    let paletteSet = effects >> 0x7;

    if (effects) {
      if (paletteSet === 0) {
        debug.warn("Use paletteSet 0");
      }
    }

    let tileData = tileset[tileIndex];

    if (flipX) {
      tileData = flipTileData(tileData, 8, "x");
    }

    if (flipY) {
      tileData = flipTileData(tileData, 8, "y");
    }

    const tile = applyPalette(tileData, palettes[paletteIndex]);

    block.push(tile);
  });

  return block;
}

export function getDecompressedData(offset: number): number[][] {
  const header = getInt(offset, "uint24");
  const magic = header & 0xff;
  const decompressedLength = header >> 0x8;

  let decompressedData: number[] = [];

  if (magic !== 0x10) {
    debug.warn(`Image in offet 0x${offset.toHex()} is not LZ77 compressed.`);

    return [];
  }

  offset += 0x4;

  let bytesWritten = 0;
  while (bytesWritten < decompressedLength) {
    const flags = getInt(offset, "uint8");

    offset += 0x1;

    for (let i = 0x0; i < 0x8 && bytesWritten < decompressedLength; i += 0x1) {
      const type = flags & (0x80 >> i);

      if (type) {
        const value = getInt(offset, "uint16");
        const disp = ((value & 0xf) << 0x8) | (value >> 0x8);
        const n = (value >> 0x4) & 0xf;

        for (let j = 0x0; j < n + 0x3; j += 0x1) {
          decompressedData[bytesWritten] =
            decompressedData[bytesWritten - disp - 0x1];

          bytesWritten += 0x1;
        }

        offset += 0x2;
      } else {
        const value = getInt(offset, "uint8");
        decompressedData[bytesWritten] = value;

        bytesWritten += 0x1;
        offset += 0x1;
      }
    }
  }

  let blocks: number[][] = [];

  for (let i = 0x0; i < decompressedData.length / 0x20; i += 0x1) {
    blocks.push(decompressedData.slice(i * 0x20, (i + 0x1) * 0x20));
  }

  return blocks;
}

export function getDecompressedGraphic(offset: number): number[][] {
  const decompressedData = getDecompressedData(offset);

  let graphic: number[][] = [];

  decompressedData.forEach((block, index) => {
    graphic[index] = [];

    block.forEach((value) => {
      graphic[index].push(value & 0xf, (value & 0xf0) >> 0x4);
    });
  });

  return graphic;
}

export function getItemNames(): { [value: number]: string } {
  const offset = getInt(getRegionArray(pointerToItemTexts), "uint24");

  const names: { [value: number]: string } = {};

  [...Array(55).keys()].forEach((index) => {
    names[index] = getText(getInt(offset + index * 0x2, "uint16"));
  });

  names[0x0] = "-";

  const dssCards = [
    "Salamander Card",
    "Serpent Card",
    "Mandragora Card",
    "Golem Card",
    "Cockatrice Card",
    "Manticore Card",
    "Griffin Card",
    "Thunderbir Card",
    "Unicorn Card",
    "Black Dog Card",
    "Mercury Card",
    "Venus Card",
    "Jupiter Card",
    "Mars Card",
    "Diana Card",
    "Apollo Card",
    "Neptune Card",
    "Saturn Card",
    "Uranus Card",
    "Pluto Card",
  ];

  for (let i = 0; i < dssCards.length; i += 1) {
    const offset = Object.keys(names).length;

    names[offset] = dssCards[i];
  }

  return names;
}

export function getMapsInfos(): {
  index: number;
  name: string;
  pointer: number;
}[] {
  const mapsPointers = getRegionArray(pointerToMapsPointers);

  const maps = [];

  const lastMapPointer = getInt(mapsPointers + 0xf * 0x4, "uint24");

  for (let section = 0x0; section < 0xf; section += 0x1) {
    let pointer = getInt(mapsPointers + section * 0x4, "uint24");

    const nextPointer = getInt(
      getInt(mapsPointers + section * 0x4 + 0x4, "uint24") + 0x5c,
      "uint24",
    );

    const sectionNameOffset = getInt(
      getRegionArray(pointerToMapTexts),
      "uint24",
    );

    const sectionName = getText(
      getInt(sectionNameOffset + section * 0x4 + 0x2, "uint16"),
    );

    let room = 0;

    while (true) {
      maps.push({
        index: maps.length,
        name: `${sectionName} ${room}`,
        pointer,
      });

      pointer += 0x60;
      room += 1;

      if (pointer === nextPointer || pointer === lastMapPointer) {
        break;
      }
    }
  }

  maps.push({
    index: maps.length,
    name: "?????????? 00",
    pointer: lastMapPointer,
  });

  return maps;
}

export function getMapNames(): { [value: number]: string } {
  const mapInfos = getMapsInfos();

  const names: { [value: number]: string } = {};

  mapInfos.forEach((map) => {
    names[map.index] = map.name;
  });

  return names;
}

export function getMonsterNames(): { [value: number]: string } {
  const offset = getInt(getRegionArray(pointerToMonsterTexts), "uint24");

  const names: { [value: number]: string } = {};

  [...Array(142).keys()].forEach((index) => {
    names[index] = getText(getInt(offset + index * 0x4, "uint16"));
  });

  return names;
}

export function getText(index: number): string {
  const $gameJson = get(gameJson);

  if (!$gameJson.resources) {
    return "???";
  }

  const offsetTexts = getInt(getRegionArray(pointerToTexts), "uint24");

  let offset = getInt(offsetTexts + (index - 0x8001) * 0x4, "uint24");

  const letters = getRegionArray(
    $gameJson.resources.letters as { [key: number]: string }[],
  );

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

export function getSpriteData(offset: number, length: number): number[][] {
  const spriteData: number[][] = [];

  let tileData = [];

  for (let i = 0x0; i < length; i += 0x1) {
    const value = getInt(offset + i, "uint8");

    tileData.push(value & 0xf, (value & 0xf0) >> 0x4);

    if (tileData.length === 0x40) {
      spriteData.push(tileData);

      tileData = [];
    }
  }

  return spriteData;
}
