<script lang="ts">
  import { onDestroy, onMount } from "svelte";

  import Checkbox from "$lib/components/Checkbox.svelte";
  import { isDebug } from "$lib/stores";
  import { extractBit, getInt } from "$lib/utils/bytes";
  import Canvas, { type Axis } from "$lib/utils/canvas";
  import debug from "$lib/utils/debug";
  import { getTileData } from "$lib/utils/common/superNintendo";
  import { capitalize, getRegionArray } from "$lib/utils/format";
  import { applyPalette, flipTileData, getPalette } from "$lib/utils/graphics";

  import type { Bit, Palette } from "$lib/types";

  import {
    pointerToBackgroundsPointers,
    pointerToChestSet,
    pointerToMapSize,
    pointerToMapsPointers,
    pointerToMonstersTiles,
    pointerToMovingSprites,
    pointerToRooms,
    pointerToRoomsTable,
    pointerToSpriteSetIndex,
    pointerToSpriteSet,
    pointerToSpritesPalettes,
    pointerToStaticSprites,
    pointerToTilemapPalettes,
    pointerToTilesChunksPalettes,
    pointerToTilesets,
    pointerToVillagersTiles,
    tilesPositionement,
  } from "../template";
  import { getMappedTiles, pointerToOffset } from "../utils";

  export let roomIndex: number;

  let canvasEl: HTMLDivElement;
  let canvasDebugEl: HTMLDivElement;

  let canvas: Canvas;
  let canvasDebug: Canvas;

  const roomsTableOffset = pointerToOffset(pointerToRoomsTable);
  const roomsOffset = pointerToOffset(pointerToRooms);
  const mapsPointers = pointerToOffset(pointerToMapsPointers);
  const mapSizeOffset = pointerToOffset(pointerToMapSize);
  const tilesetsOffset = pointerToOffset(pointerToTilesets);
  const tilemapPalettesOffset = pointerToOffset(pointerToTilemapPalettes);
  const backgroundsPointers = pointerToOffset(pointerToBackgroundsPointers);
  const tilesChunksPalettesOffset = pointerToOffset(
    pointerToTilesChunksPalettes,
  );
  const tilesChunkOffset = 0x30000;
  const tilesChunksFlipsOffset = 0x32000;
  const tilesChunksCollisionsOffset = 0x32800;
  const spritesPalettesOffset = pointerToOffset(pointerToSpritesPalettes);
  const spriteSetStartOffset = pointerToOffset(pointerToSpriteSet);
  const spriteSetIndexOffset = pointerToOffset(pointerToSpriteSetIndex);
  const chestSetOffset = pointerToOffset(pointerToChestSet);
  const movingSpritesOffset = pointerToOffset(pointerToMovingSprites);
  const staticSpritesOffset = pointerToOffset(pointerToStaticSprites);
  const tilesPositionementOffset = getRegionArray(tilesPositionement);
  const villagersTilesOffset = pointerToOffset(pointerToVillagersTiles);
  const monstersTilesOffset = pointerToOffset(pointerToMonstersTiles);

  function handleAnimationChange(event: Event): void {
    if ((event.target as HTMLInputElement).checked) {
      canvas.enableAnimation();
    } else {
      canvas.disableAnimation();
    }
  }

  function handleLayerVisibilityChange(event: Event, layer: string): void {
    if ((event.target as HTMLInputElement).checked) {
      canvas.showLayer(layer);

      if ($isDebug && layer === "collisions") {
        canvasDebug.showLayer("debugCollisions");
      }
    } else {
      canvas.hideLayer(layer);

      if ($isDebug && layer === "collisions") {
        canvasDebug.hideLayer("debugCollisions");
      }
    }
  }

  function updateCanvas(): void {
    const roomOffset = getInt(roomsTableOffset + roomIndex * 2, "uint16");

    const mapIndex = getInt(roomsOffset + roomOffset + 0x1, "uint8");
    const spriteSet = getInt(roomsOffset + roomOffset + 0x2, "uint8");
    const bgm = getInt(roomsOffset + roomOffset + 0x6, "uint8");
    const name = getInt(roomsOffset + roomOffset + 0x7, "uint8");
    const unknown = getInt(roomsOffset + roomOffset + 0x8, "uint8");

    const mapSettingsOffset = pointerToOffset(mapsPointers) + mapIndex * 0xa;

    // Tilemap Palettes

    const tilemapPalettesindex = getInt(mapSettingsOffset + 0x1, "uint8");

    const tilemapPaletteOffset =
      tilemapPalettesOffset + tilemapPalettesindex * 0x80;

    const tilemapPalettes: Palette[] = [];

    for (let i = 0x0; i < 0x8; i += 0x1) {
      tilemapPalettes.push(
        getPalette("BGR555", tilemapPaletteOffset + i * 0x10, 0x8, {
          firstTransparent: true,
        }),
      );
    }

    // Tileset

    const tilemapDatas = [];

    for (let i = 0x0; i < 0x8; i += 0x1) {
      const tilesetIndex = getInt(mapSettingsOffset + 0x2 + i, "uint8");

      for (let j = 0x0; j < 0x20; j += 0x1) {
        if (tilesetIndex !== 0xff) {
          tilemapDatas.push(
            getTileData(tilesetIndex * 0x300 + tilesetsOffset + j * 0x18),
          );
        } else {
          tilemapDatas.push([...Array(0x100).keys()].map(() => 0x0));
        }
      }
    }

    // Tiles Chunks

    const tilemapCorrespondanceIndex = getInt(mapSettingsOffset, "uint8") & 0xf;

    const tileIndexOffset =
      tilesChunkOffset + tilemapCorrespondanceIndex * 0x200;

    const tileFlipIndexOffset =
      tilesChunksFlipsOffset + tilemapCorrespondanceIndex * 0x80;

    const tilesChunks = [];

    for (let i = 0x0; i < 0x80; i += 0x1) {
      const tilesChunk = [];

      for (let j = 0x0; j < 0x4; j += 0x1) {
        const tileIndex = getInt(tileIndexOffset + i * 0x4 + j, "uint8");
        const tileFlip = getInt(tileFlipIndexOffset + i, "uint8");

        const flipX = extractBit(tileFlip, j as Bit);

        let tileData = tilemapDatas[tileIndex];

        if (flipX) {
          tileData = flipTileData(tileData, 8, "x");
        }

        const tilemapChunkIndex = Math.floor((tileIndex >> 0x4) / 2);
        const tilePosition =
          tileIndex & (0xf + ((tileIndex >> 0x4) - tilemapChunkIndex * 2) * 0x10); // prettier-ignore

        let paletteIndex = 0;

        if (
          getInt(mapSettingsOffset + 0x2 + tilemapChunkIndex, "uint8") !== 0xff
        ) {
          paletteIndex = getInt(
            tilesChunksPalettesOffset +
              getInt(mapSettingsOffset + 0x2 + tilemapChunkIndex, "uint8") *
                0x10 +
              tilePosition / 2,
            tilePosition % 2 === 0 ? "lower4" : "upper4",
          );
        }

        if (paletteIndex > 7) {
          debug.warn(`Palette ${paletteIndex} is out of range`);

          paletteIndex = 0;
        }

        const palette = tilemapPalettes[paletteIndex];

        const tile = applyPalette(tileData, palette);

        tilesChunk.push(tile);
      }

      tilesChunks.push(tilesChunk);
    }

    // Tiles Chunks Collisions

    const tilesChunkCollisionIndexOffset =
      tilesChunksCollisionsOffset + tilemapCorrespondanceIndex * 0x100;

    const tilesChunksCollisions: Uint8Array[] = [];

    for (let i = 0x0; i < 0x80; i += 0x1) {
      const tilesChunkCollision = getInt(
        tilesChunkCollisionIndexOffset + i * 0x2,
        "uint16",
      );

      const black = [0, 0, 0];
      const red = [255, 0, 0];
      const green = [0, 255, 0];
      const blue = [0, 0, 255];
      const darkblue = [0, 0, 80];
      const lightblue = [0, 80, 80];
      const yellow = [255, 255, 0];
      const orange = [127, 127, 0];
      const purple = [255, 0, 255];
      const cyan = [0, 255, 255];

      let color = black;

      switch (tilesChunkCollision) {
        case 0x0: // Walkable
        case 0xb: // World Map bridge
        case 0x800: // Stairs
        case 0x802: // Walkable
        case 0x803: // Walkable
        case 0x804: // Walkable
        case 0x806: // Walkable
        case 0x88b: // Bridge accross walkable
        case 0xa03: // Bridge
          color = cyan;
          break;

        case 0x811: // Walkable water
        case 0x870: // Walkable water
        case 0x871: // Walkable water
          color = darkblue;
          break;

        case 0x403: // Mat ship
        case 0x40b: // Mat ship
        case 0x80b: // Walkable above and below
        case 0x813: // Walkable with obstacle above
        case 0x830: // Traversable wall
        case 0x831: // Traversable wall
        case 0x832: // Traversable wall
        case 0x833: // Traversable wall
          color = purple;
          break;

        case 0x801: // Slipping ice (not sure, also on map 53)
          color = cyan;
          // color = lightblue;
          break;

        case 0x883: // Walkable push to top
        case 0x903: // Walkable push to bottom
        case 0x910: // Waterfall
        case 0x983: // Walkable push to left
        case 0xb01: // Walkable push to bottom
          color = orange;
          break;

        case 0x2: // Wall traversable with hook
          color = red;
          break;

        case 0x1: // Water
        case 0x3: // Obstacle
        case 0x5: // Obstacle
        case 0x7: // Obstacle
        case 0x10: // Obstacle
        case 0x13: // Obstacle
        case 0x37: // Obstacle
        case 0x580: // Obstacle
        case 0x805: // Obstacle
        case 0x807: // Obstacle
        case 0x80f: // Obstacle
        case 0x837: // Obstacle
        case 0xd80: // Obstacle
          color = red;
          break;

        case 0x31: // Walkable but only up/down
        case 0x400: // Walkable but only up/down
        case 0x401: // Walkable but only up/down
        case 0x500: // Climbable
        case 0xd00: // Climbable
        case 0xd70: // Climbable from water
          color = yellow;
          break;

        case 0x1807: // Wall destructible with bombs
        case 0x2801: // Wall destructible with bombs
        case 0x2807: // Wall destructible with bombs
        case 0x3803: // Tile destructible when walk on
        case 0x3807: // Bones destructible with bombs
        case 0x9101: // Tile destructible when walk on
        case 0x9301: // Tile destructible when walk on
        case 0x9401: // Tile destructible when walk on
        case 0xa003: // Wall tree mouth openable with sword
        case 0xa005: // Wall tree mouth openable with sword
        case 0xa007: // Wall tree mouth openable with sword
        case 0xc007: // Tree cutable with axe
        case 0xc003: // Mushroom cutable with axe
        case 0xc005: // Mushroom cutable with axe
        case 0xc107: // Interrupter switchable with ???
        case 0xc207: // Interrupter switchable with ???
        case 0xc307: // Interrupter switchable with ???
          color = blue;
          break;

        case 0x33: // Room Teleport on map 35?
        case 0x820: // Show hidden room
        case 0x821: // Show hidden room
        case 0x823: // Show hidden room on map 20? / Jump on map 36
        case 0x930: // Show hidden room
        case 0x8000: // Move to room
        case 0x8001: // Move to room
        case 0x8002: // Move to room
        case 0x8004: // Move to room
        case 0x8003: // Move to room
        case 0x8011: // Move to room
        case 0x8031: // Move to room
        case 0x8033: // Move to room
        case 0x8101: // Move to room
        case 0x8200: // Move to room
        case 0x8203: // Move to room
        case 0x8300: // Move to room
        case 0x8301: // Move to room
        case 0x8303: // Move to room
        case 0x8403: // Move to room
        case 0x8503: // Move to room
        case 0x8600: // Move to room
        case 0x8603: // Move to room
        case 0x8800: // Move to room
        case 0x8801: // Move to room
        case 0x8802: // Move to room
        case 0x8803: // Crest teleporters
        case 0x8804: // In front of wall destructible with bombs on map 34
        case 0x8813: // Bed sleep
        case 0x9003: // Event on map 104?
        case 0x9600: // Fall to room below
        case 0x9601: // Move to room below
        case 0x9700: // Move to room below
        case 0x9701: // Fall to room below
        case 0x9800: // Fall to room below
        case 0x9801: // Move to room below
        case 0x9900: // Fall to room below
        case 0x9901: // Fall to room below
        case 0x9a01: // Fall to room below
        case 0x9b01: // Fall to room below
        case 0x9c01: // Fall to room below
        case 0x9d01: // Fall to room below
          color = green;
          break;

        case 0x7802: // Unused
        case 0x8006: // Unused
        case 0x8a03: // Unused
        case 0x8b03: // Unused
        case 0x8c03: // Unused
        case 0x9201: // Unused
        case 0x9a00: // Unused
          color = black;
          break;
      }

      let tile = new Uint8Array(0x10 * 8 * 0x10 * 8 * 4);

      for (let j = 0; j < tile.length; j += 0x4) {
        tile[j] = color[0];
        tile[j + 1] = color[1];
        tile[j + 2] = color[2];
        tile[j + 3] = 0x80;
      }

      tilesChunksCollisions.push(tile);
    }

    // Sprites Palettes

    const spritesPalettes: Palette[] = [];

    const spriteSetOffset =
      spriteSetStartOffset +
      getInt(spriteSetIndexOffset + spriteSet * 2, "uint16");

    for (let i = 0x0; i < 0x6; i += 0x1) {
      const palette = getPalette(
        "BGR555",
        spritesPalettesOffset + getInt(spriteSetOffset + i, "uint8") * 0x10,
        0x8,
        { firstTransparent: true },
      );

      spritesPalettes.push(palette);
    }

    // Sprites

    const spritesDatas: number[][] = [];

    const array = new Uint32Array(6 * 0x20);

    let count = 0;
    let spriteChunkIndexCount = 0;

    for (let i = 0x0; i < 0x8; i += 0x1) {
      array.set([chestSetOffset + i * 0x30], 0x48 + i);
    }

    for (let i = 0x0; i < 0x6; i += 0x1) {
      let chunkPosition = getInt(spriteSetOffset + 0x6 + i, "uint8");

      if (i === 0x5) {
        chunkPosition &= 0xfe;
      }

      for (let bit = 7; bit >= 0; bit -= 1) {
        if (extractBit(chunkPosition, bit as Bit)) {
          let position =
            getInt(tilesPositionementOffset + count * 2, "uint16") / 0x40;

          let chunkIndex = getInt(
            spriteSetOffset + 0xc + spriteChunkIndexCount,
            "uint8",
          );

          let spriteOffset = movingSpritesOffset;
          let length = 0x180;

          if (chunkIndex >= 0x80) {
            chunkIndex &= 0x7f;
            spriteOffset = staticSpritesOffset;
            length = 0x60;
          }

          const offsets = [...Array(8).keys()].map(
            (i) => spriteOffset + chunkIndex * length + i * 0x30,
          );

          if (0x48 + position + 0x8 > array.length) {
            debug.warn(
              `Sprite offset ${0x48 + position + 0x8} is out of range`,
            );

            position = 0;
          }

          array.set(offsets, 0x48 + position);

          spriteChunkIndexCount += 1;
        }

        count += 1;
      }
    }

    array.forEach((offset) => {
      for (let i = 0x0; i < 0x2; i += 0x1) {
        if (offset > 0x0) {
          spritesDatas.push(getTileData(offset + i * 0x18));
        } else {
          spritesDatas.push([]);
        }
      }
    });

    const loadMonstersSprites = getInt(spriteSetOffset + 0xb, "uint8") & 0x7f;

    let spritesOffset = villagersTilesOffset;

    if (loadMonstersSprites) {
      spritesOffset = monstersTilesOffset;
    }

    for (let i = 0x0; i < 0x20 * 0x4; i += 0x1) {
      spritesDatas.push(getTileData(spritesOffset + i * 0x18));
    }

    // Sprites Chunks

    const spritesChunksDatas: number[][][] = [];

    for (let i = 0x0; i < 0x80; i += 0x1) {
      const spriteChunkDatas = [];

      for (let j = 0x0; j < 0x4; j += 0x1) {
        spriteChunkDatas.push(spritesDatas[i * 0x4 + j]);
      }

      spritesChunksDatas.push(spriteChunkDatas);
    }

    // Background

    const backgroundsOffset = pointerToOffset(backgroundsPointers, 0xa9);

    const backgroundIndex1 =
      getInt(roomsOffset + roomOffset + 0x5, "uint8") & 0xe0;
    const backgroundIndex2 =
      (getInt(roomsOffset + roomOffset + 0x6, "uint8") & 0xe0) >> 0x3;

    const backgroundIndex =
      Math.max(0, ((backgroundIndex1 | backgroundIndex2) >> 0x2) - 1) * 4;

    const backgroundMode = getInt(backgroundsOffset + backgroundIndex, "uint8");

    const backgroundTmpDuplicate = extractBit(backgroundMode, 0);
    const backgroundTmpUnknown1 = extractBit(backgroundMode, 1);
    const backgroundTmpAnimate = extractBit(backgroundMode, 2);
    const backgroundTmpUnknown2 = extractBit(backgroundMode, 3);
    const backgroundTmpUnknown3 = extractBit(backgroundMode, 4); // << Used for water transparency if player is in
    const backgroundTmpAboveEverything = extractBit(backgroundMode, 5);
    const backgroundTmpAboveForeground = extractBit(backgroundMode, 6);
    const backgroundTmpUnknown4 = extractBit(backgroundMode, 7);
    const backgroundAlpha =
      backgroundTmpUnknown3 && backgroundTmpAboveEverything;
    const backgroundAnimate = !backgroundTmpDuplicate && backgroundTmpAnimate;

    const backgroundChunkIndex = getInt(
      backgroundsOffset + backgroundIndex + 0x1,
      "uint8",
    );

    const backgroundSpeedShiftLeft = getInt(
      backgroundsOffset + backgroundIndex + 0x2,
      "uint8",
    );

    const backgroundSpeed = getInt(
      backgroundsOffset + backgroundIndex + 0x2,
      "uint8",
    );

    const backgroundDirection = getInt(
      backgroundsOffset + backgroundIndex + 0x3,
      "uint8",
    );

    const sizeIndex = (getInt(mapSettingsOffset, "uint8") & 0xf0) >> 0x3;

    const columns = getInt(mapSizeOffset + sizeIndex, "uint8");
    const rows = getInt(mapSizeOffset + sizeIndex + 0x1, "uint8");

    const width = columns * 0x10;
    const height = rows * 0x10;

    canvas.resize(width, height);

    // TODO: Pointer
    const mapPointer = 0x58735 + mapIndex * 0x3;
    const mapOffset = pointerToOffset(mapPointer, 0xbf);

    // Background
    if (canvas.getLayerVisibility("background")) {
      if (backgroundChunkIndex < 0x80) {
        tilesChunks[backgroundChunkIndex].forEach((tile, index) => {
          canvas.addGraphic(
            "background",
            tile,
            8,
            8,
            (index & 0x1) * 8,
            (index >> 0x1) * 8,
          );
        });
      }

      if (backgroundAlpha) {
        canvas.changeLayerOpacity("background", 0.5);
      } else {
        canvas.changeLayerOpacity("background", 1);
      }

      if (backgroundAnimate) {
        let axis: Axis = "x";
        let speed = 1;

        switch (backgroundDirection) {
          case 0x0:
            axis = "y";
            speed = -1;
            break;
          case 0x2:
            axis = "y";
            break;
          case 0x3:
            speed = -1;
            break;
        }

        if (backgroundSpeed) {
          speed *= (0xff - backgroundSpeed) / 2048;
        }

        canvas.startLayerAnimation("background", { axis, speed });
      } else {
        canvas.stopLayerAnimation("background");
      }
    }

    const tileOffset = mapOffset + getInt(mapOffset, "uint16") + 0x2;

    const mappedTiles = getMappedTiles(mapOffset, tileOffset, rows, columns);

    // Foreground
    if (canvas.getLayerVisibility("foreground")) {
      for (let row = 0x0; row < rows; row += 0x1) {
        for (let column = 0x0; column < columns; column += 0x1) {
          // The game add 0x80 to the tilesChunkIndex to mark it as hidden on the map
          const tilesChunkIndex = mappedTiles[row * columns + column] & 0x7f;

          tilesChunks[tilesChunkIndex].forEach((tile, index) => {
            canvas.addGraphic(
              "foreground",
              tile,
              8,
              8,
              column * 16 + (index & 0x1) * 8,
              row * 16 + (index >> 0x1) * 8,
            );
          });
        }
      }
    }

    // Collisions
    for (let row = 0x0; row < rows; row += 0x1) {
      for (let column = 0x0; column < columns; column += 0x1) {
        // The game add 0x80 to the tilesChunkIndex to mark it as hidden on the map
        const tilesChunkIndex = mappedTiles[row * columns + column] & 0x7f;

        canvas.addGraphic(
          "collisions",
          tilesChunksCollisions[tilesChunkIndex],
          16,
          16,
          column * 16,
          row * 16,
        );
      }
    }

    // Sprites
    if (canvas.getLayerVisibility("sprites")) {
      let j = 0x9;
      let end = false;

      while (!end) {
        const eventId = getInt(roomsOffset + roomOffset + j, "uint8");
        const positionY =
          getInt(roomsOffset + roomOffset + j + 0x1, "uint8") & 0x3f;
        const positionX =
          getInt(roomsOffset + roomOffset + j + 0x2, "uint8") & 0x3f;
        let paletteIndex =
          ((getInt(roomsOffset + roomOffset + j + 0x3, "uint8") & 0xe0) >> 0x4) / 2; // prettier-ignore
        const animationOffset =
          (getInt(roomsOffset + roomOffset + j + 0x3, "uint8") & 0x1f) * 2;
        const eventType = getInt(roomsOffset + roomOffset + j + 0x3, "uint16");
        const spriteIndex = getInt(roomsOffset + roomOffset + j + 0x5, "uint8");
        const unknown = getInt(roomsOffset + roomOffset + j + 0x6, "uint8");

        // TODO:
        if (paletteIndex >= 6) {
          debug.warn(`paletteIndex ${paletteIndex} is out of range`);

          paletteIndex = 0;
        }

        if (spriteIndex <= 0x80 && spritesChunksDatas[spriteIndex]) {
          if (spritesChunksDatas[spriteIndex][0].length > 0) {
            spritesChunksDatas[spriteIndex].forEach((tileData, tileIndex) => {
              const tile = applyPalette(
                tileData,
                spritesPalettes[paletteIndex],
              );

              canvas.addGraphic(
                "sprites",
                tile,
                8,
                8,
                positionX * 16 + (tileIndex & 0x1) * 8,
                positionY * 16 + (tileIndex >> 0x1) * 8,
              );
            });
          } else {
            for (let i = 0x0; i < 0x4; i += 0x1) {
              const tile = applyPalette(
                getTileData(
                  movingSpritesOffset - 0x1690 + (i >> 0x1) * 0x150 + i * 0x18,
                ),
                getPalette("BGR555", spritesPalettesOffset + 0xe0, 0x8),
              );

              canvas.addGraphic(
                "sprites",
                tile,
                8,
                8,
                positionX * 16 + (i & 0x1) * 8,
                positionY * 16 + (i >> 0x1) * 8,
              );
            }
          }
        }

        end = unknown === 0xff;

        j += 0x7;
      }
    }

    canvas.render();

    if ($isDebug) {
      canvasDebug.resize(728, 128);

      [...tilemapPalettes, ...spritesPalettes].forEach(
        (palette, paletteIndex) => {
          palette.forEach((color, index) => {
            let tileData = new Uint8Array(0x10 * 8 * 0x10 * 8 * 4);

            for (let j = 0; j < tileData.length; j += 0x4) {
              tileData[j] = color[0];
              tileData[j + 1] = color[1];
              tileData[j + 2] = color[2];
              tileData[j + 3] = 0xff;
            }

            canvasDebug.addGraphic(
              "debug",
              tileData,
              8,
              8,
              index * 8,
              paletteIndex * 0x8,
            );
          });
        },
      );

      tilemapDatas.forEach((tileData, index) => {
        const x = 0x9 * 8 + (index % 0x10) * 0x8;
        const y = Math.floor(index / 0x10) * 0x8;

        const tile = applyPalette(tileData, tilemapPalettes[0]);

        canvasDebug.addGraphic("debug", tile, 8, 8, x, y);
      });

      tilesChunks.forEach((tilesChunk, index) => {
        const x = 0x1a * 8 + (index % 0x10) * 0x10;
        const y = Math.floor(index / 0x10) * 2 * 8;

        tilesChunk.forEach((tile, tileIndex) => {
          canvasDebug.addGraphic(
            "debug",
            tile,
            8,
            8,
            x + (tileIndex & 0x1) * 8,
            y + (tileIndex >> 0x1) * 8,
          );
        });

        canvasDebug.addGraphic(
          "debugCollisions",
          tilesChunksCollisions[index],
          16,
          16,
          x,
          y,
        );
      });

      spritesDatas.forEach((spriteDatas, index) => {
        const tile = applyPalette(spriteDatas, spritesPalettes[3]);

        canvasDebug.addGraphic(
          "debug",
          tile,
          8,
          8,
          0x3b * 8 + (index % 0x20) * 8,
          Math.floor(index / 0x20) * 8,
        );
      });

      canvasDebug.render();
    }
  }

  onMount(() => {
    canvas = new Canvas({
      canvasEl,
      backgroundAlpha: 1,
    });

    canvas.addLayer("background", "tilingSprite", { width: 16, height: 16 });
    canvas.addLayer("foreground", "image");
    canvas.addLayer("collisions", "image", { hidden: true });
    canvas.addLayer("sprites", "image");

    if ($isDebug) {
      canvasDebug = new Canvas({
        canvasEl: canvasDebugEl,
      });

      canvasDebug.addLayer("debug", "image");
      canvasDebug.addLayer("debugCollisions", "image");
    }

    updateCanvas();
  });

  onDestroy(() => {
    canvas.destroy();

    if ($isDebug) {
      canvasDebug.destroy();
    }
  });

  $: {
    roomIndex;

    if (canvas) {
      updateCanvas();
    }
  }
</script>

<div class="gtc-mapviewer">
  <div class="gtc-mapviewer-inputs">
    {#each ["background", "foreground", "collisions", "sprites"] as layer}
      <Checkbox
        label={capitalize(layer)}
        checked={canvas?.getLayerVisibility(layer)}
        onChange={(event) => handleLayerVisibilityChange(event, layer)}
      />
    {/each}
    <Checkbox
      label="Animations"
      checked={canvas?.getAnimationStatus()}
      onChange={(event) => handleAnimationChange(event)}
    />
  </div>
  {#if $isDebug}
    <div class="gtc-mapviewer-canvasdebug">
      <div bind:this={canvasDebugEl} />
    </div>
  {/if}
  <div class="gtc-mapviewer-canvas">
    <div bind:this={canvasEl} />
  </div>
</div>

<style lang="postcss">
  .gtc-mapviewer {
    & .gtc-mapviewer-inputs {
      @apply flex mb-2;

      & :global(label) {
        @apply mr-4;
      }
    }

    & .gtc-mapviewer-canvasdebug,
    & .gtc-mapviewer-canvas {
      @apply self-start p-2 w-fit bg-primary-700 rounded;
    }

    & .gtc-mapviewer-canvasdebug {
      @apply mb-4;
    }
  }
</style>
