import { getInt, getIntFromArray } from "$lib/utils/bytes";
import Canvas from "$lib/utils/canvas";
import debug from "$lib/utils/debug";
import {
  applyPalette,
  flipTileData,
  getColor,
  initTilesData,
  renderDebugPalettes,
  renderDebugTiles,
} from "$lib/utils/graphics";

import type { Palette } from "$lib/types";

import {
  getDecompressedData,
  getDecompressedTilesData,
  getOffset,
  pointerToOffset,
} from "../utils";
import {
  HERO_TILESET_OFFSET,
  MAP_OFFSET,
  MAP_TILESET_OFFSET,
  PALETTES_OFFSET,
  ROOM_TABLE_POINTER,
  SPRITES_DEFAULT_DATA_OFFSET,
  UI_TILESET_OFFSET,
} from "./constants";

interface Map {
  width: number;
  height: number;
  tiles: Uint8Array;
  sprites: Uint8Array;
  chunks: Uint8Array;
  data: Uint16Array;
}

interface Room {
  index: number;
  mapIndex: number;
  bgTilesetSetIndexes: number[];
  paletteIndexes: number[];
  spriteSetIndex: number;
}

interface Sprite {
  index: number;
  type: number;
  positionX: number;
  positionY: number;
}

export default class SMap {
  private room: Room;
  private map: Map;
  private sprites: Sprite[];
  private palettes: Palette[];
  private tilesData: number[][];

  constructor(roomIndex: number) {
    this.room = this.getRoom(roomIndex);
    this.map = this.getMap();
    this.sprites = this.getSprites();
    this.palettes = this.getPalettes();
    this.tilesData = this.generateTilesData();

    this.generateBackgroundData();
  }

  // prettier-ignore
  private getRoom(index: number): Room {
    const pointer = pointerToOffset(ROOM_TABLE_POINTER);

    const offset = pointer + index * 0x40;

    return {
      index,
      mapIndex: getInt(offset, "uint8") - 0x1,
      // unknown1: getInt(offset + 0x1, "uint8"),
      // unknown2: getInt(offset + 0x2, "uint8"),
      // unknown3: getInt(offset + 0x3, "uint8"),
      bgTilesetSetIndexes: [
        getInt(offset + 0x4, "uint8") - 0x1,
        getInt(offset + 0x5, "uint8") - 0x1,
      ],
      paletteIndexes: [
        getInt(offset + 0xc, "uint8") - 0x1,
        getInt(offset + 0xd, "uint8") - 0x1,
        getInt(offset + 0xe, "uint8") - 0x1,
        getInt(offset + 0xf, "uint8") - 0x1,
      ],
      spriteSetIndex: getInt(offset + 0x10, "uint16", { bigEndian: true }) - 0x1,
    };
  }

  private getMap(): Map {
    const offset = getOffset(MAP_OFFSET, this.room.mapIndex * 0x4);

    const data = getDecompressedData(offset + 0x4);

    for (let i = 0x0; i < 0x1000; i += 0x1) {
      data[i * 0x2] += 0x1;
    }

    return {
      width: data[0x2c00] * 0x10,
      height: data[0x2c01] * 0x10,
      tiles: data.slice(0x0, 0x2000),
      sprites: data.slice(0x2800, 0x2c00),
      chunks: data.slice(0x2c04),
      data: new Uint16Array(),
    };
  }

  private getSprites(): Sprite[] {
    const sprites = [];

    let data = this.map.sprites;

    if (this.room.spriteSetIndex !== -1) {
      const offset = getOffset(
        SPRITES_DEFAULT_DATA_OFFSET,
        this.room.spriteSetIndex * 0x4,
      );

      data = getDecompressedData(offset + 0x4);
    }

    let offset = 0x0;

    while (true) {
      const sprite = {
        type: getIntFromArray(data, offset, "uint16", true),
        positionX: getIntFromArray(data, offset + 0x2, "uint16", true),
        positionY: getIntFromArray(data, offset + 0x4, "uint16", true),
        index: getIntFromArray(data, offset + 0x6, "uint16", true),
      };

      if (sprite.positionX + sprite.positionY === 0x0) {
        break;
      }

      sprites.push(sprite);

      offset += 0x8;
    }

    return sprites;
  }

  private generateBackgroundData(): void {
    this.map.data = new Uint16Array(this.map.width * this.map.height * 0x4);

    const sections = this.map.width / 0x20;

    let offset = 0x0;

    // prettier-ignore
    for (let i = 0x0; i < this.map.height; i += 0x1) {
      for (let j = 0x0; j < this.map.width; j += 0x1) {
        const chunkIndex = getIntFromArray(this.map.chunks, offset, "uint16", true);

        const chunkOffset = chunkIndex * 0x8;
        const row1Offset = sections * i * 0x80 + j * 0x2;
        const row2Offset = row1Offset + 0x40 * sections;

        this.map.data[row1Offset] = getIntFromArray(this.map.tiles, chunkOffset, "uint16", true);
        this.map.data[row1Offset + 0x1] = getIntFromArray(this.map.tiles, chunkOffset + 0x2, "uint16", true);
        this.map.data[row2Offset] = getIntFromArray(this.map.tiles, chunkOffset + 0x4, "uint16", true);
        this.map.data[row2Offset + 0x1] = getIntFromArray(this.map.tiles, chunkOffset + 0x6, "uint16", true);

        offset += 0x2;
      }
    }
  }

  private getPalettes(): Palette[] {
    const palettes: Palette[] = [];

    this.room.paletteIndexes.forEach((index) => {
      const palette: Palette = [];

      for (let j = 0x0; j < 0x10; j += 0x1) {
        const encoded = getInt(
          PALETTES_OFFSET + index * 0x20 + j * 0x2,
          "uint16",
          { bigEndian: true },
        );

        const rawColor =
          (((encoded & 0x3e) >> 0x3) << 0x9) |
          ((encoded >> 0xd) << 0x5) |
          (((encoded & 0x7c0) >> 0x8) << 0x1);

        const color = getColor(rawColor, "BGR333");

        palette.push(color);
      }

      palettes.push(palette);
    });

    return palettes;
  }

  private generateTilesData(): number[][] {
    const tilesData = initTilesData(0x800);

    let tileIndex = 0x0;

    // UI

    this.getTilesData(UI_TILESET_OFFSET + 0x4).forEach((tileData) => {
      tilesData[tileIndex++] = tileData;
    });

    // Background

    this.room.bgTilesetSetIndexes.forEach((index) => {
      if (index !== -1) {
        const offset = getOffset(MAP_TILESET_OFFSET, index * 0x4);

        this.getTilesData(offset + 0x4).forEach((tileData) => {
          tilesData[tileIndex++] = tileData;
        });
      }
    });

    // Hero Sprite

    tileIndex = 0x6ba;

    this.getTilesData(HERO_TILESET_OFFSET + 0x4).forEach((tileData) => {
      tilesData[tileIndex++] = tileData;
    });

    return tilesData;
  }

  private getTilesData(offset: number): number[][] {
    const tilesData: number[][] = [];

    const data = getDecompressedTilesData(offset);

    data.forEach((data, index) => {
      const high = data >> 0x4;
      const low = data - (high << 0x4);

      const tileIndex = Math.floor(index / 0x20);

      if (!tilesData[tileIndex]) {
        tilesData[tileIndex] = [];
      }

      tilesData[tileIndex].push(high, low);
    });

    return tilesData;
  }

  public renderDebugPalettes(canvas: Canvas): void {
    renderDebugPalettes(this.palettes, canvas);
  }

  public renderDebugTiles(canvas: Canvas): void {
    renderDebugTiles(this.tilesData, this.palettes[0], canvas);
  }

  public renderMap(canvas: Canvas): void {
    canvas.resize(this.map.width * 0x10, this.map.height * 0x10);

    const rows = this.map.height * 0x2;
    const columns = this.map.width * 0x2;

    for (let row = 0x0; row < rows; row += 0x1) {
      for (let column = 0x0; column < columns; column += 0x1) {
        const rawTile = this.map.data[row * columns + column];

        const tileIndex = rawTile & 0x7ff;
        const paletteIndex = (rawTile & 0x6000) >> 0xd;
        const flipX = (rawTile & 0x800) >> 0xb;
        const flipY = (rawTile & 0x1000) >> 0xc;

        let tileData = this.tilesData[tileIndex];

        if (tileData) {
          if (flipX) {
            tileData = flipTileData(tileData, 8, "x");
          }

          if (flipY) {
            tileData = flipTileData(tileData, 8, "y");
          }

          const tile = applyPalette(tileData, this.palettes[paletteIndex]);

          canvas.addGraphic("background", tile, 8, 8, column * 8, row * 8);
        } else {
          debug.warn(`tileIndex "${tileIndex.toHex()}" is out of range.`);
        }
      }
    }

    const dummySprite = applyPalette(
      [...Array(0x40).keys()].map(() => 0x0),
      this.palettes[0],
    );

    this.sprites.forEach((sprite) => {
      canvas.addGraphic(
        "sprites",
        dummySprite,
        8,
        8,
        sprite.positionX,
        sprite.positionY,
      );
    });

    canvas.render();
  }
}
