import {
  extractBinary,
  extractBit,
  getInt,
  getIntFromArray,
} from "$lib/utils/bytes";
import Canvas from "$lib/utils/canvas";
import { getTileData } from "$lib/utils/common/superNintendo";
import debug from "$lib/utils/debug";
import {
  applyPalette,
  flipTileData,
  getPalette,
  renderDebugPalettes,
} from "$lib/utils/graphics";

import type { Palette } from "$lib/types";

import { getDecompressedData, pointerToOffset } from "../utils";
import {
  CHUNK_BG3_TABLE_OFFSET,
  CHUNK_BG12_TABLE_OFFSET,
  MAP_TABLE_OFFSET,
  MAP_TILESET_TABLE_OFFSET,
  PALETTE_MAP_TABLE_OFFSET,
  ROOM_TABLE_OFFSET,
  TILESET_TABLE_OFFSET,
} from "../utils/constants";

interface Map {
  width: number;
  height: number;
  background1: {
    width: number;
    height: number;
    chunks: Uint8Array;
    data: Uint16Array;
  };
  background2: {
    width: number;
    height: number;
    animation: number;
    brightness: number;
    isFixed: boolean;
    isParallax: boolean;
    chunks: Uint8Array;
    data: Uint16Array;
  };
  background3?: {
    width: number;
    height: number;
    animation: number;
    brightness: number;
    isFixed: boolean;
    chunks: Uint8Array;
    data: Uint16Array;
  };
  flags: Uint8Array;
}

interface Room {
  index: number;
  bgmIndex: number;
  bg12TilesetSetIndex: number;
  bg3TilesetIndex: number;
  paletteSetIndex: number;
  mapIndex: number;
  view: {
    left: number;
    top: number;
    right: number;
    bottom: number;
  };
}

export default class CTMap {
  private room: Room;
  private map: Map;
  private palettes: Palette[];
  private tilesData: number[][];

  constructor(roomIndex: number) {
    this.room = this.getRoom(roomIndex);
    this.map = this.getMap();
    this.palettes = this.getPalettes();
    this.tilesData = this.generateTilesData();

    this.generateBackgroundsData();
  }

  private getRoom(index: number): Room {
    const offset = ROOM_TABLE_OFFSET + 0xe * index;

    return {
      index,
      bgmIndex: getInt(offset, "uint8"),
      bg12TilesetSetIndex: getInt(offset + 0x1, "uint8"),
      bg3TilesetIndex: getInt(offset + 0x2, "uint8"),
      paletteSetIndex: getInt(offset + 0x3, "uint8"),
      mapIndex: getInt(offset + 0x4, "uint8"),
      // unknown5: getInt(offset + 0x5, "uint8"),
      // unknown6: getInt(offset + 0x6, "uint8"),
      // unknown7: getInt(offset + 0x7, "uint8"),
      // unknown8: getInt(offset + 0x8, "uint8"),
      // unknown9: getInt(offset + 0x9, "uint8"),
      view: {
        left: getInt(offset + 0xa, "uint8"),
        top: getInt(offset + 0xb, "uint8"),
        right: getInt(offset + 0xc, "uint8"),
        bottom: getInt(offset + 0xd, "uint8"),
      },
    };
  }

  private getMap(): Map {
    const offset = pointerToOffset(MAP_TABLE_OFFSET + this.room.mapIndex * 0x3);

    const data = getDecompressedData(offset);

    const flags = data[0x0] | (data[0x1] << 0x8);

    const background1 = {
      width: (extractBinary(flags, 0, 2) + 0x1) * 0x10,
      height: (extractBinary(flags, 2, 2) + 0x1) * 0x10,
    };

    const background2 = {
      width: (extractBinary(flags, 4, 2) + 0x1) * 0x10,
      height: (extractBinary(flags, 6, 2) + 0x1) * 0x10,
      animation: data[0x2],
      brightness: data[0x4],
      isFixed: extractBit(flags, 12),
      isParallax: extractBit(flags, 14),
    };

    const background3 = {
      width: (extractBinary(flags, 8, 2) + 0x1) * 0x10,
      height: (extractBinary(flags, 10, 2) + 0x1) * 0x10,
      animation: data[0x3],
      brightness: data[0x5],
      isFixed: extractBit(flags, 13),
    };

    let chunksOffset = 0x6;

    return {
      width: Math.max(background1.width, background2.width),
      height: Math.max(background1.height, background2.height),
      background1: {
        ...background1,
        chunks: data.slice(
          chunksOffset,
          (chunksOffset += background1.width * background1.height),
        ),
        data: new Uint16Array(),
      },
      background2: {
        ...background2,
        chunks: data.slice(
          chunksOffset,
          (chunksOffset += background2.width * background2.height),
        ),
        data: new Uint16Array(),
      },
      background3: extractBit(flags, 15)
        ? {
            ...background3,
            chunks: data.slice(
              chunksOffset,
              (chunksOffset += background3.width * background3.height),
            ),
            data: new Uint16Array(),
          }
        : undefined,
      flags: this.generateBackgroundsFlags(
        data.slice(chunksOffset),
        Math.max(
          background1.width * background1.height,
          background2.width * background2.height,
        ),
      ),
    };
  }

  private generateBackgroundsData(): void {
    const chunksData12 = this.getChunksData("background12");
    const chunksData3 = this.getChunksData("background3");

    const backgrounds = [this.map.background1, this.map.background2];

    if (this.map.background3) {
      backgrounds.push(this.map.background3);
    }

    backgrounds.forEach((background, index) => {
      background.data = new Uint16Array(
        background.width * background.height * 0x4,
      );

      let offset = 0x0;

      // prettier-ignore
      for (let i = 0x0; i < background.height; i += 0x1) {
        for (let j = 0x0; j < background.width; j += 0x1) {
          const flag = this.map.flags[i * this.map.width + j];

          let chunkIndex = background.chunks[offset];
          let chunksData = chunksData12;

          if (index !== 2 && (flag >> index) & 0x1) {
            chunkIndex += 0x100;
          } else if (index === 2) {
            chunksData = chunksData3;
          }

          const chunkOffset = chunkIndex * 0x8;
          const offsetRow1 = i * background.width * 0x4 + j * 0x2;
          const offsetRow2 = offsetRow1 + background.width * 0x2;

          background.data[offsetRow1] = getIntFromArray(chunksData, chunkOffset, "uint16");
          background.data[offsetRow1 + 0x1] = getIntFromArray(chunksData, chunkOffset + 0x2, "uint16");
          background.data[offsetRow2] = getIntFromArray(chunksData, chunkOffset + 0x4, "uint16");
          background.data[offsetRow2 + 0x1] = getIntFromArray(chunksData, chunkOffset + 0x6, "uint16");

          offset += 0x1;
        }
      }
    });
  }

  private generateBackgroundsFlags(
    data: Uint8Array,
    length: number,
  ): Uint8Array {
    const flags: number[] = [];

    let offset = 0x0;

    while (flags.length < length) {
      const value = data[offset];
      // const unknown1 = data[offset + 0x1];
      // const unknown2 = data[offset + 0x2];

      offset += 0x3;

      const int = value & 0x7f;
      const repeat = extractBit(value, 7);

      let count = 0x1;

      if (repeat) {
        count = data[offset++] || 0x100;
      }

      for (let i = 0x0; i < count; i += 0x1) {
        flags.push(int);
      }
    }

    return new Uint8Array(flags);
  }

  private getChunksData(type: "background12" | "background3"): Uint8Array {
    if (type === "background3" && this.room.bg3TilesetIndex === 0xff) {
      return new Uint8Array();
    }

    let pointer = 0x0;

    if (type === "background12") {
      pointer = CHUNK_BG12_TABLE_OFFSET + this.room.bg12TilesetSetIndex * 0x3;
    } else if (type === "background3") {
      pointer = CHUNK_BG3_TABLE_OFFSET + this.room.bg3TilesetIndex * 0x3;
    }

    const offset = pointerToOffset(pointer);

    return getDecompressedData(offset);
  }

  private getPalettes(): Palette[] {
    const palettes: Palette[] = [];

    const offset = PALETTE_MAP_TABLE_OFFSET + this.room.paletteSetIndex * 0xd2;

    palettes.push([
      [0, 0, 0, 0],
      ...getPalette("BGR555", 0x3fb212, 0x7),
      ...Array(0x8).fill([0, 0, 0, 0]),
    ]);

    for (let i = 0x0; i < 0x7; i += 0x1) {
      palettes.push([
        [0, 0, 0, 0],
        ...getPalette("BGR555", offset + i * 0x1e, 0xf),
      ]);
    }

    for (let i = 0x0; i < 0x8; i += 0x1) {
      palettes.push([...Array(0x10).fill([0, 0, 0, 0])]);
    }

    return palettes;
  }

  private generateTilesData(): number[][] {
    const tilesData: number[][] = [];

    // Fill with black tiles
    for (let i = 0x0; i < 0x200; i += 0x1) {
      tilesData.push(Array(0x40).fill(0x0));
    }

    // Background 1 & 2
    for (let i = 0x0; i < 0x8; i += 0x1) {
      const index = getInt(
        MAP_TILESET_TABLE_OFFSET + this.room.bg12TilesetSetIndex * 0x8 + i,
        "uint8",
      );

      tilesData.push(...this.getTilesData(index));
    }

    // Background 3
    tilesData.push(...this.getTilesData(this.room.bg3TilesetIndex));

    // Fill with black tiles
    while (tilesData.length < 0x800) {
      tilesData.push(Array(0x40).fill(0x0));
    }

    return tilesData;
  }

  private getTilesData(index: number): number[][] {
    if (index === 0xff) {
      return [];
    }

    const tilesData: number[][] = [];

    const offset = pointerToOffset(TILESET_TABLE_OFFSET + index * 0x3);

    const data = getDecompressedData(offset, true);

    for (let row = 0x0; row < 0x8; row += 0x1) {
      for (let column = 0x0; column < 0x10; column += 0x1) {
        const tileData = getTileData(row * 0x200 + column * 0x20, "4bpp", data);

        tilesData.push(tileData);
      }
    }

    return tilesData;
  }

  public renderDebugPalettes(canvas: Canvas): void {
    renderDebugPalettes(this.palettes, canvas);
  }

  public renderDebugTiles(canvas: Canvas): void {
    canvas.resize(128, 1024);

    let index = 0;

    for (let row = 0x0; row < 0x80; row += 0x1) {
      for (let column = 0x0; column < 0x10; column += 0x1) {
        if (this.tilesData[index]) {
          const tile = applyPalette(this.tilesData[index], this.palettes[1]);

          canvas.addGraphic("tiles", tile, 8, 8, column * 8, row * 8);
        }

        index += 1;
      }
    }

    canvas.render();
  }

  public renderMap(canvas: Canvas): void {
    canvas.resize(this.map.width * 0x10, this.map.height * 0x10);

    const backgrounds = [this.map.background1, this.map.background2];

    if (this.map.background3) {
      backgrounds.push(this.map.background3);
    }

    // Temporary hide background 3
    backgrounds.slice(0, 2).forEach((background, index) => {
      const rows = background.height * 0x2;
      const columns = background.width * 0x2;

      for (let row = 0x0; row < rows; row += 0x1) {
        for (let column = 0x0; column < columns; column += 0x1) {
          const flags = background.data[row * columns + column];

          let tileIndex = flags & 0x3ff;
          const paletteIndex = (flags >> 0xa) & 0x7;
          const priority = (flags >> 0xd) & 0x1;
          const flipX = (flags >> 0xe) & 0x1;
          const flipY = flags >> 0xf;

          if (index !== 2) {
            tileIndex += 0x100;
          } else if (index === 2 && tileIndex !== 0x0) {
            tileIndex += 0x500;
          }

          let tileData = this.tilesData[tileIndex];

          if (tileData) {
            if (flipX) {
              tileData = flipTileData(tileData, 8, "x");
            }

            if (flipY) {
              tileData = flipTileData(tileData, 8, "y");
            }

            const tile = applyPalette(tileData, this.palettes[paletteIndex]);

            canvas.addGraphic(
              `background${index + 1}${priority ? "H" : "L"}`,
              tile,
              8,
              8,
              column * 8,
              row * 8,
            );
          } else {
            debug.warn(`tileIndex "${tileIndex.toHex()}" is out of range.`);
          }
        }
      }
    });

    canvas.defineHighlightArea(
      (this.room.view.right - this.room.view.left + 1) * 16,
      (this.room.view.bottom - this.room.view.top + 1) * 16,
      this.room.view.left * 16,
      this.room.view.top * 16,
    );

    canvas.render();
  }
}
