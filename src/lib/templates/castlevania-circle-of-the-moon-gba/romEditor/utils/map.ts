import { extractBinary, extractBit, getInt } from "$lib/utils/bytes";
import Canvas from "$lib/utils/canvas";
import debug from "$lib/utils/debug";
import { getRegionArray } from "$lib/utils/format";
import {
  applyPalette,
  flipTileData,
  getPalette,
  initTilesData,
  renderDebugPalettes,
  renderDebugTiles,
} from "$lib/utils/graphics";

import type { Palette } from "$lib/types";

import { getTilesData } from "../utils";
import {
  ANIMATED_TILESET_DRACULA2_OFFSET,
  ANIMATED_TILESET_TABLE_OFFSET,
  ARMOR_TILES_OFFSET,
  BACKGROUNDS_TABLE_POINTER,
  COMMON_SPRITES_TILESET_OFFSET,
  ENEMIES_GRAPHIC_TABLE_OFFSET,
  EVENT_TABLE_OFFSET,
  MAP_COLLISIONS_POINTER,
  MAP_SECTION_TABLE_OFFSET,
  MAP_SECTIONS,
  MAP_SPRITE_TABLE_POINTER,
  NATHAN_PALETTE_OFFSET,
  OBJECTS_TILESET_TABLE_OFFSET,
  SPRITES_COMMON_PALETTES_OFFSET,
  SPRITES_PALETTE_5_OFFSET,
  SPRITES_PALETTE_6_OFFSET,
  SPRITES_PALETTE_7_OFFSET,
  SPRITES_PALETTE_8_OFFSET,
  SPRITES_PALETTE_234_OFFSET,
  UNDERGROUND_WATERWAY_PALETTE_OFFSET,
} from "./constants";
import {
  getEnemySpriteInfos,
  getSpriteFrameOffset,
  SpriteType,
} from "./sprite";

interface AnimatedTilesInfos {
  offset: number;
  length: number;
  tileIndex: number;
}

interface Map {
  width: number;
  height: number;
  background1: {
    width: number;
    height: number;
    chunkSetOffset: number;
    collisionSetOffset: number;
    data: Uint16Array;
    collisions: Uint8Array;
  };
  background2: {
    width: number;
    height: number;
    chunkSetOffset: number;
    collisionSetOffset: number;
    data: Uint16Array;
    collisions: Uint8Array;
  };
}

interface Room {
  index: number;
  tileset1: {
    offset: number;
    tileIndex: number;
  };
  tileset2: {
    offset: number;
    tileIndex: number;
  };
  tileset3: {
    offset: number;
    tileIndex: number;
  };
  backgroundsPalettesOffset: number;
  background1: {
    index: number;
    mapOffset: number;
    isAboveSprites: boolean;
    isWater: boolean;
  };
  background2: {
    index: number;
    mapOffset: number;
  };
  entriesOffset: number;
}

interface Sprite {
  type: number;
  subtype: number;
  positionX: number;
  positionY: number;
  enemyId: number;
  isBoss: boolean;
  tiles: {
    x: number;
    y: number;
    data: Uint8Array;
  }[];
}

interface SpriteSet {
  enemyIndexes: number[];
  objectSetIndex: number;
}

export default class CCOTMMap {
  private room: Room;
  private map: Map;
  private spriteSet: SpriteSet;
  private sprites: Sprite[];
  private backgroundsPalettes: Palette[];
  private spritesPalettes: Palette[];
  private backgroundsTilesData: number[][];
  private spritesTilesData: number[][];

  constructor(roomIndex: number, enemySet = 0) {
    this.room = this.getRoom(roomIndex);
    this.map = this.getMap();
    this.spriteSet = this.getSpriteSet(enemySet);
    this.sprites = this.getSprites();
    this.backgroundsPalettes = this.getBackgroundsPalettes();
    this.spritesPalettes = this.getSpritesPalettes();
    this.backgroundsTilesData = this.generateBackgroundsTilesData();
    this.spritesTilesData = this.generateSpritesTilesData();

    this.generateBackgroundsData();
    this.generateSpritesData();
  }

  private getRoom(index: number): Room {
    const sections = getSectionsRoomCount();

    let section = 0;
    let count = 0;

    for (let i = 0; i < sections.length; i += 1) {
      if (count + sections[i] >= index + 1) {
        break;
      }

      section += 1;
      count += sections[i];
    }

    const sectionsOffset = getRegionArray(MAP_SECTION_TABLE_OFFSET);
    const sectionOffset = getInt(sectionsOffset + section * 0x4, "uint24");
    const offset = sectionOffset + (index - count) * 0x60;

    return {
      index,
      tileset1: {
        offset: getInt(offset, "uint24"),
        tileIndex: getInt(offset + 0x4, "uint16") / 0x20,
      },
      tileset2: {
        offset: getInt(offset + 0xc, "uint24"),
        tileIndex: getInt(offset + 0x10, "uint16") / 0x20,
      },
      tileset3: {
        offset: getInt(offset + 0x18, "uint24"),
        tileIndex: getInt(offset + 0x1c, "uint16") / 0x20,
      },
      backgroundsPalettesOffset: getInt(offset + 0x24, "uint24"),
      background1: {
        index: getInt(offset + 0x30, "uint24"),
        mapOffset: getInt(offset + 0x38, "uint24"),
        isAboveSprites: getInt(offset + 0x59, "bit", { bit: 2 }) === 1,
        isWater: getInt(offset + 0x5a, "uint8") === 0x42,
      },
      background2: {
        index: getInt(offset + 0x40, "uint24"),
        mapOffset: getInt(offset + 0x48, "uint24"),
      },
      entriesOffset: getInt(offset + 0x5c, "uint24"),
    };
  }

  private getMap(): Map {
    const offset = getInt(getRegionArray(BACKGROUNDS_TABLE_POINTER), "uint24");

    const background1Offset = offset + this.room.background1.index * 0x40;
    const background2Offset = offset + this.room.background2.index * 0x40;

    const background1 = {
      chunkSetOffset: getInt(background1Offset + 0x4, "uint24"),
      collisionSetOffset: getInt(background1Offset + 0x8, "uint24"),
      width: getInt(background1Offset + 0x10, "uint16"),
      height: getInt(background1Offset + 0x12, "uint16"),
      data: new Uint16Array(),
      collisions: new Uint8Array(),
    };

    const background2 = {
      chunkSetOffset: getInt(background2Offset + 0x4, "uint24"),
      collisionSetOffset: getInt(background2Offset + 0x8, "uint24"),
      width: getInt(background2Offset + 0x10, "uint16"),
      height: getInt(background2Offset + 0x12, "uint16"),
      data: new Uint16Array(),
      collisions: new Uint8Array(),
    };

    return {
      width: background1.width || background2.width,
      height: background1.height || background2.height,
      background1,
      background2,
    };
  }

  private generateBackgroundsData(): void {
    const backgrounds = [this.map.background1, this.map.background2];

    backgrounds.forEach((background, index) => {
      background.data = new Uint16Array(
        background.width * background.height * 0x10,
      );

      if (background.collisionSetOffset) {
        background.collisions = new Uint8Array(
          background.width * background.height * 0x10,
        );
      }

      let chunksOffset = 0x0;

      if (index === 0) {
        chunksOffset = this.room.background1.mapOffset;
      } else if (index === 1) {
        chunksOffset = this.room.background2.mapOffset;
      }

      // prettier-ignore
      for (let i = 0x0; i < background.height; i += 0x1) {
        for (let j = 0x0; j < background.width; j += 0x1) {
          const chunkIndex = getInt(chunksOffset, "uint16");

          let chunkOffset = background.chunkSetOffset + chunkIndex * 0x20;
          let collisionOffset = background.collisionSetOffset + chunkIndex * 0x10;

          for (let k = 0x0; k < 0x4; k += 0x1) {
            for (let l = 0x0; l < 0x4; l += 0x1) {
              const rowOffset =
                i * background.width * 0x10 +
                j * 0x4 +
                k * background.width * 0x4 +
                l;

              background.data[rowOffset] = getInt(chunkOffset, "uint16");

              if (background.collisions.byteLength > 0) {
                background.collisions[rowOffset] = getInt(collisionOffset++, "uint8");
              }

              chunkOffset += 0x2;
            }
          }

          chunksOffset += 0x2;
        }
      }
    });
  }

  private getSpriteSet(index: number): SpriteSet {
    const pointer = getRegionArray(MAP_SPRITE_TABLE_POINTER);

    const offset = getInt(pointer, "uint24") + this.room.index * 0x1c;

    const enemySets = [
      [
        getInt(offset + 0x4, "int16"),
        getInt(offset + 0x6, "int16"),
        getInt(offset + 0x8, "int16"),
        getInt(offset + 0xa, "int16"),
      ],
      [
        getInt(offset + 0xc, "int16"),
        getInt(offset + 0xe, "int16"),
        getInt(offset + 0x10, "int16"),
        getInt(offset + 0x12, "int16"),
      ],
    ];

    let enemySetIndex = 0;

    if (enemySets[index].some((index) => index !== -1)) {
      enemySetIndex = index;
    }

    return {
      enemyIndexes: enemySets[enemySetIndex],
      // unknown1: getInt(offset + 0x14, "int16"),
      // unknown2: getInt(offset + 0x18, "int16"),
      objectSetIndex: getInt(offset + 0x16, "int16"),
      // unknown3: getInt(offset + 0x1a, "int16"),
    };
  }

  private getSprites(): Sprite[] {
    const sprites = [];

    const pointer = getRegionArray(MAP_SPRITE_TABLE_POINTER);

    const tableOffset = getInt(pointer, "uint24") + this.room.index * 0x1c;

    let offset = getInt(tableOffset, "uint24");

    while (true) {
      if (getInt(offset + 0xb, "bit", { bit: 7 })) {
        break;
      }

      sprites.push({
        positionX: getInt(offset, "uint16"),
        positionY: getInt(offset + 0x2, "uint16"),
        type: getInt(offset + 0x4, "uint16"),
        subtype: getInt(offset + 0x6, "uint16"),
        // unknown1: getInt(offset + 0x8, "uint16"),
        // unknown2: getInt(offset + 0xb, "uint8"),
        enemyId: -1,
        isBoss: false,
        tiles: [],
      });

      offset += 0xc;
    }

    return sprites;
  }

  private generateSpritesData(): void {
    this.sprites.forEach((sprite) => {
      if (sprite.type in SpriteType) {
        const enemy = getEnemySpriteInfos(sprite.type);

        if (enemy) {
          sprite.enemyId = enemy.index;
          sprite.isBoss = enemy.isBoss;
        }

        let frameOffset = getSpriteFrameOffset(
          sprite.type,
          sprite.subtype,
          this.spriteSet.objectSetIndex,
          enemy,
        );
        let frameSkip = enemy?.frameSkip || 0;

        while (true) {
          const anchorX = getInt(frameOffset, "int16");
          const anchorY = getInt(frameOffset + 0x2, "int16");
          let tileIndex = getInt(frameOffset + 0x4, "uint16") & 0xfff;
          let paletteIndex = getInt(frameOffset + 0x4, "uint16") >> 0xc;
          const flags = getInt(frameOffset + 0x6, "uint16");

          const layout = extractBinary(flags, 14, 2);
          let stop = extractBit(flags, 0);
          const flipX = extractBit(flags, 4);
          const flipY = extractBit(flags, 5);
          const size = 1 << extractBinary(flags, 6, 2);

          if (frameSkip > 0) {
            if (stop) {
              frameSkip -= 1;
              stop = false;
            }
          } else {
            if (enemy) {
              const index = this.spriteSet.enemyIndexes.findIndex(
                (index) => index === enemy.index,
              );

              paletteIndex += index;
              tileIndex += 0x200 + index * 0x40;

              if (!enemy.isBoss) {
                paletteIndex += 0x8;
              }
            }

            if (sprite.type === SpriteType.ShiningArmor) {
              tileIndex = 0x3e0;
            }
          }

          let width = size;
          let height = size;

          if (layout === 1) {
            width = Math.min(width * 2, 4);
            height = Math.max(1, height / 2);
          } else if (layout === 2) {
            width = Math.max(1, width / 2);
            height = Math.min(height * 2, 4);
          }

          for (let i = 0; i < height; i += 1) {
            for (let k = 0; k < width; k += 1) {
              let x = anchorX + k * 8;
              let y = anchorY + 1 + i * 8;

              let tileData = this.spritesTilesData[tileIndex + i * width + k];

              if (tileData) {
                if (flipX) {
                  tileData = flipTileData(tileData, 8, "x");
                  x = getFlippedTilePosition(x, width, k);
                }

                if (flipY) {
                  tileData = flipTileData(tileData, 8, "y");
                  y = getFlippedTilePosition(y, height, i);
                }

                const tile = applyPalette(
                  tileData,
                  this.spritesPalettes[paletteIndex],
                );

                sprite.tiles.push({ x, y, data: tile });
              } else {
                debug.warn(`tileIndex "${tileIndex.toHex()}" is out of range.`);
              }
            }
          }

          frameOffset += 0x8;

          if (stop) {
            break;
          }
        }
      }
    });
  }

  private getBackgroundsPalettes(): Palette[] {
    const palettes: Palette[] = [];

    for (let i = 0x0; i < 0x8; i += 0x1) {
      palettes.push([...Array(0x10).fill([0, 0, 0, 0])]);
    }

    for (let i = 0x0; i < 0x8; i += 0x1) {
      const offset = this.room.backgroundsPalettesOffset + i * 0x20;

      palettes.push(
        getPalette("BGR555", offset, 0x10, {
          firstTransparent: true,
        }),
      );
    }

    // We use the cleansed palette for Underground Waterway
    if ([0xb7, 0xb9, 0xbb, 0xbc, 0xbf, 0xc0, 0xc1].includes(this.room.index)) {
      const offset = getRegionArray(UNDERGROUND_WATERWAY_PALETTE_OFFSET);

      palettes[15] = getPalette("BGR555", offset, 0x10, {
        firstTransparent: true,
      });
    }

    return palettes;
  }

  private getSpritesPalettes(): Palette[] {
    const palettes: Palette[] = [];

    const offsets = [getRegionArray(NATHAN_PALETTE_OFFSET)];

    for (let i = 0x0; i < 0x3; i += 0x1) {
      offsets.push(getRegionArray(SPRITES_PALETTE_234_OFFSET) + i * 0x20);
    }

    offsets.push(
      getRegionArray(SPRITES_PALETTE_5_OFFSET),
      getRegionArray(SPRITES_PALETTE_6_OFFSET),
      getRegionArray(SPRITES_PALETTE_7_OFFSET),
      getRegionArray(SPRITES_PALETTE_8_OFFSET),
    );

    // Dracula
    if (this.spriteSet.enemyIndexes[0] === 0x67) {
      const offset = getInt(
        getRegionArray(EVENT_TABLE_OFFSET) + 0x1ca * 0x4,
        "uint24",
      );

      for (let i = 0x0; i < 0x4; i += 0x1) {
        offsets.push(getInt(offset + 0x15f, "uint24") + i * 0x20);
      }
    } else {
      this.spriteSet.enemyIndexes.forEach((index) => {
        if (index !== -1) {
          const offset = getRegionArray(ENEMIES_GRAPHIC_TABLE_OFFSET);

          offsets.push(getInt(offset + index * 0x10, "uint24"));
        } else {
          offsets.push(-1);
        }
      });
    }

    for (let i = 0x0; i < 0x4; i += 0x1) {
      offsets.push(getRegionArray(SPRITES_COMMON_PALETTES_OFFSET) + i * 0x20);
    }

    offsets.forEach((offset) => {
      if (offset !== -1) {
        palettes.push(
          getPalette("BGR555", offset, 0x10, { firstTransparent: true }),
        );
      } else {
        palettes.push([...Array(0x10).fill([0, 0, 0, 0])]);
      }
    });

    return palettes;
  }

  private generateBackgroundsTilesData(): number[][] {
    const tilesData = initTilesData(0x800);

    // Tilsets

    const tilesets = [
      this.room.tileset1,
      this.room.tileset2,
      this.room.tileset3,
    ];

    tilesets.forEach((tileset) => {
      if (tileset.offset) {
        let tileIndex = tileset.tileIndex;

        // If is debug room
        if (this.room.index === 0x101) {
          tileIndex = 0x400;
        }

        getTilesData(tileset.offset).forEach((tileData) => {
          tilesData[tileIndex++] = tileData;
        });
      }
    });

    // Animated Tileset

    const animatedTilesInfos = getAnimatedTilesInfos(this.room.index);

    if (animatedTilesInfos) {
      let tileIndex = animatedTilesInfos.tileIndex;

      const { offset, length } = animatedTilesInfos;

      getTilesData(offset, length).forEach((tileData) => {
        tilesData[tileIndex++] = tileData;
      });
    }

    return tilesData;
  }

  private generateSpritesTilesData(): number[][] {
    const tilesData = initTilesData(0x400);

    // Objects

    let tileIndex = 0x1c0;

    if (this.spriteSet.objectSetIndex !== -1) {
      const objectsOffset = getRegionArray(OBJECTS_TILESET_TABLE_OFFSET);

      const offset = getInt(
        objectsOffset + this.spriteSet.objectSetIndex * 0xc,
        "uint24",
      );

      getTilesData(offset).forEach((tileData) => {
        tilesData[tileIndex++] = tileData;
      });
    }

    this.sprites.forEach((sprite) => {
      if (sprite.type === SpriteType.ShiningArmor) {
        let tileIndex = 0x3e0;

        const offset = getRegionArray(ARMOR_TILES_OFFSET);

        getTilesData(offset + 0x500, 0x80).forEach((tileData) => {
          tilesData[tileIndex++] = tileData;
        });
      }
    });

    // Enemies

    const enemiesOffset = getRegionArray(ENEMIES_GRAPHIC_TABLE_OFFSET);

    this.spriteSet.enemyIndexes.forEach((enemyIndex, i) => {
      if (enemyIndex !== -1) {
        tileIndex = 0x200 + i * 0x40;

        const offset = getInt(
          enemiesOffset + enemyIndex * 0x10 + 0x4,
          "uint24",
        );

        getTilesData(offset).forEach((tileData) => {
          tilesData[tileIndex++] = tileData;
        });
      }
    });

    // Common

    tileIndex = 0x300;

    const commonOffset = getRegionArray(COMMON_SPRITES_TILESET_OFFSET);

    getTilesData(commonOffset, 0x1bc0).forEach((tileData) => {
      tilesData[tileIndex++] = tileData;
    });

    return tilesData;
  }

  public renderDebugPalettes(canvas: Canvas): void {
    renderDebugPalettes(this.backgroundsPalettes, canvas);
    renderDebugPalettes(this.spritesPalettes, canvas, 136);
  }

  public renderDebugTiles(canvas: Canvas): void {
    renderDebugTiles(
      this.backgroundsTilesData,
      this.backgroundsPalettes[8],
      canvas,
      128,
    );

    renderDebugTiles(
      this.spritesTilesData,
      this.spritesPalettes[0],
      canvas,
      128,
      1024,
      128,
    );
  }

  public renderMap(canvas: Canvas): void {
    canvas.resize(this.map.width * 0x20, this.map.height * 0x20);

    const collisionsTilesData = getCollisionsTilesData();
    const collisionsPalette = getCollisionsPalette();

    const backgrounds = [this.map.background1, this.map.background2];

    backgrounds.forEach((background, index) => {
      const rows = background.height * 0x4;
      const columns = background.width * 0x4;

      for (let row = 0x0; row < rows; row += 0x1) {
        for (let column = 0x0; column < columns; column += 0x1) {
          const rawTile = background.data[row * columns + column];

          const tileIndex = 0x400 + (rawTile & 0x3ff);
          const flipX = (rawTile & 0x400) >> 0xa;
          const flipY = (rawTile & 0x800) >> 0xb;
          const paletteIndex = rawTile >> 0xc;

          let tileData = this.backgroundsTilesData[tileIndex];

          if (tileData) {
            if (flipX) {
              tileData = flipTileData(tileData, 8, "x");
            }

            if (flipY) {
              tileData = flipTileData(tileData, 8, "y");
            }

            const tile = applyPalette(
              tileData,
              this.backgroundsPalettes[paletteIndex],
            );

            canvas.addGraphic(
              `background${index + 1}`,
              tile,
              8,
              8,
              column * 8,
              row * 8,
            );
          } else {
            debug.warn(`tileIndex "${tileIndex.toHex()}" is out of range.`);
          }

          const collisionTileIndex =
            background.collisions[row * columns + column];

          if (collisionTileIndex) {
            const tile = applyPalette(
              collisionsTilesData[collisionTileIndex],
              collisionsPalette,
            );

            canvas.addGraphic("collisions", tile, 8, 8, column * 8, row * 8);
          }
        }
      }
    });

    this.sprites.forEach((sprite) => {
      if (
        sprite.enemyId !== -1 &&
        !this.spriteSet.enemyIndexes.includes(sprite.enemyId)
      ) {
        return;
      }

      sprite.tiles.forEach((tile) => {
        canvas.addGraphic(
          sprite.enemyId !== -1 ? "enemies" : "sprites",
          tile.data,
          8,
          8,
          sprite.positionX + tile.x,
          sprite.positionY + tile.y,
        );
      });
    });

    if (this.room.background1.isAboveSprites) {
      canvas.changeLayerOrder([
        "background2",
        "collisions",
        "sprites",
        "enemies",
        "background1",
      ]);
    } else {
      canvas.changeLayerOrder([
        "background2",
        "background1",
        "collisions",
        "sprites",
        "enemies",
      ]);
    }

    if (this.room.background1.isWater) {
      canvas.changeLayerOpacity("background1", 0.5);
    } else {
      canvas.changeLayerOpacity("background1", 1);
    }

    canvas.render();
  }
}

function getAnimatedTilesInfos(
  roomIndex: number,
): AnimatedTilesInfos | undefined {
  let offset = 0x0;
  let length = 0x0;
  let tileIndex = 0x600;

  const backgroundOffset = getRegionArray(ANIMATED_TILESET_TABLE_OFFSET);
  const dracula2Offset = getRegionArray(ANIMATED_TILESET_DRACULA2_OFFSET);

  if (roomIndex === 0x2) {
    offset = getInt(dracula2Offset, "uint24");
    length = 0x900;
    tileIndex = 0x7b8;
  } else if (roomIndex === 0xb) {
    offset = getInt(backgroundOffset, "uint24");
    length = 0x400;
  } else if (roomIndex === 0x46) {
    offset = getInt(backgroundOffset + 0x124, "uint24");
    length = 0x300;
    tileIndex = 0x580;
  } else if ([0x4d, 0x4e, 0x51, 0x54, 0x57, 0x5d].includes(roomIndex)) {
    offset = getInt(backgroundOffset + 0x15c, "uint24");
    length = 0x5c0;
  } else if ([0x5f, 0x60, 0x61, 0x62, 0x64].includes(roomIndex)) {
    offset = getInt(backgroundOffset + 0x194, "uint24");
    length = 0x120;
  } else if ([0x6a, 0x7c].includes(roomIndex)) {
    offset = getInt(backgroundOffset + 0x21c, "uint24");
    length = 0xb00;
    tileIndex = 0x680;
  } else if (roomIndex === 0xa8) {
    offset = getInt(backgroundOffset + 0x348, "uint24");
    length = 0x1f0;
    tileIndex = 0x700;
  } else if ([0xb7, 0xb9, 0xbb, 0xbc, 0xbf, 0xc0, 0xc1].includes(roomIndex)) {
    offset = getInt(backgroundOffset + 0x290, "uint24");
    length = 0x3e0;
  }

  if (offset) {
    return { offset, length, tileIndex };
  }
}

function getCollisionsPalette(): Palette {
  const pointer = getRegionArray(MAP_COLLISIONS_POINTER);
  const offset = getInt(pointer, "uint24");

  return getPalette("BGR555", getInt(offset + 0x24, "uint24"), 0x10, {
    firstTransparent: true,
  });
}

function getCollisionsTilesData(): number[][] {
  const pointer = getRegionArray(MAP_COLLISIONS_POINTER);
  const offset = getInt(pointer, "uint24");

  return getTilesData(getInt(offset, "uint24"));
}

function getFlippedTilePosition(
  position: number,
  size: number,
  iteration: number,
): number {
  if (size === 2) {
    if (iteration === 0) {
      position += 0x8;
    } else {
      position -= 0x8;
    }
  } else if (size === 4) {
    if (iteration === 0) {
      position += 0x18;
    } else if (iteration === 1) {
      position += 0x8;
    } else if (iteration === 2) {
      position -= 0x8;
    } else {
      position -= 0x18;
    }
  }

  return position;
}

export function getSectionsRoomCount(): number[] {
  const sections = [];

  const offset = getRegionArray(MAP_SECTION_TABLE_OFFSET);

  const end = getInt(offset + MAP_SECTIONS * 0x4, "uint24");

  for (let i = 0x0; i < MAP_SECTIONS; i += 0x1) {
    const sectionOffset = getInt(offset + i * 0x4, "uint24");
    const nextSectionOffset = getInt(offset + i * 0x4 + 0x4, "uint24");
    const sectionEnd = getInt(nextSectionOffset + 0x5c, "uint24");

    const isLastSection = i === MAP_SECTIONS - 0x1;

    sections.push(((isLastSection ? end : sectionEnd) - sectionOffset) / 0x60);
  }

  // Debug Room
  sections.push(1);

  return sections;
}
