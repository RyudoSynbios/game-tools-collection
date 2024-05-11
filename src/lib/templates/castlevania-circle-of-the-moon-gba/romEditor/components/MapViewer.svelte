<script lang="ts">
  import { onDestroy, onMount } from "svelte";

  import Checkbox from "$lib/components/Checkbox.svelte";
  import Select from "$lib/components/Select.svelte";
  import { isDebug } from "$lib/stores";
  import { getInt } from "$lib/utils/bytes";
  import { Canvas } from "$lib/utils/canvas";
  import { capitalize, getRegionArray } from "$lib/utils/format";
  import { applyPalette, getPalette15Bit } from "$lib/utils/graphics";

  import type { Palette } from "$lib/types";

  import {
    animatedTilesDracula2,
    animatedTilesTable,
    commonSpritesGraphics,
    commonSpritesPalettes,
    eventsTable,
    monstersGraphicsTable,
    pointerToMapBlocks,
    pointerToMapCollisions,
    pointerToMapSpritesTable,
    specialGraphicsTable,
    spritesetPalette1,
    spritesetPalette2,
    spritesetPalette3,
    spritesetPalette4,
    spritesetPalette5,
    spritesetPalette6,
    undergroundWaterwayPalette,
  } from "../template";
  import {
    generateMap,
    generateSprites,
    getCompressedGraphic,
    getMapsInfos,
    getSpriteData,
  } from "../utils";

  export let roomIndex: number;

  let canvasEl: HTMLDivElement;
  let canvasDebugEl: HTMLDivElement;

  let canvas: Canvas;
  let canvasDebug: Canvas;

  let monsterSet = 0;

  const mapInfos = getMapsInfos();
  const mapBlocksPointer = getRegionArray(pointerToMapBlocks);
  const mapCollisionsPointer = getRegionArray(pointerToMapCollisions);
  const mapCollisionsOffset = getInt(mapCollisionsPointer, "uint24");

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

    updateCanvas();
  }

  function handleMonsterSetChange(event: Event): void {
    let value = parseInt((event.target as HTMLInputElement).value);

    monsterSet = value;

    updateCanvas();
  }

  function updateCanvas(): void {
    const roomOffset = mapInfos[roomIndex].pointer;

    const tileset1Offset = getInt(roomOffset, "uint24");
    const tileset1VramOffset = getInt(roomOffset + 0x4, "uint16") & 0x7fff;
    const tileset2Offset = getInt(roomOffset + 0xc, "uint24");
    const tileset2VramOffset = getInt(roomOffset + 0x10, "uint16") & 0x7fff;
    const tileset3Offset = getInt(roomOffset + 0x18, "uint24");
    const tileset3VramOffset = getInt(roomOffset + 0x1c, "uint16") & 0x7fff;
    const tilesetsPalettesPointer = getInt(roomOffset + 0x24, "uint24");
    const foregroundBlockset = getInt(roomOffset + 0x30, "uint24");
    const foregroundRoomOffset = getInt(roomOffset + 0x38, "uint24");
    const backgroundBlockset = getInt(roomOffset + 0x40, "uint24");
    const backgroundRoomOffset = getInt(roomOffset + 0x48, "uint24");
    const foregroundAboveSprites = getInt(roomOffset + 0x59, "bit", { bit: 2 });
    const foregroundAlpha = getInt(roomOffset + 0x5a, "uint8") === 0x42;
    // const roomEntries = getInt(roomOffset + 0x5c, "uint24");

    // Tileset Palettes

    const tilesetsPalettes: Palette[] = [];

    for (let i = 0x0; i < 0x8; i += 0x1) {
      tilesetsPalettes.push(
        getPalette15Bit(tilesetsPalettesPointer + i * 0x20, 0x10, true),
      );
    }

    // Use the cleansed palette for Underground Waterway
    if ([0xb7, 0xb9, 0xbb, 0xbc, 0xbf, 0xc0, 0xc1].includes(roomIndex)) {
      tilesetsPalettes[7] = getPalette15Bit(
        getRegionArray(undergroundWaterwayPalette),
        0x10,
        true,
      );
    }

    // Tileset

    const vramTileset = new Uint8Array(0x10000);

    getCompressedGraphic(tileset1Offset).forEach((tile, index) => {
      vramTileset.set(
        tile,
        ((tileset1VramOffset - (roomIndex === 0x101 ? 0x4000 : 0x0)) / 0x20) *
          0x40 +
          index * 0x40,
      );
    });

    if (tileset2Offset) {
      getCompressedGraphic(tileset2Offset).forEach((tile, index) => {
        vramTileset.set(
          tile,
          (tileset2VramOffset / 0x20) * 0x40 + index * 0x40,
        );
      });
    }

    if (tileset3Offset) {
      getCompressedGraphic(tileset3Offset).forEach((tile, index) => {
        vramTileset.set(
          tile,
          (tileset3VramOffset / 0x20) * 0x40 + index * 0x40,
        );
      });
    }

    let animationTilesOffset = 0x0;
    let animationTilesLength = 0x0;
    let animationTilesPosition = 0x8000;

    const animatedTilesTableOffset = getRegionArray(animatedTilesTable);
    const animatedTilesDracula2Offset = getRegionArray(animatedTilesDracula2);

    // Load animated tiles
    switch (roomIndex) {
      case 0x2:
        animationTilesOffset = getInt(animatedTilesDracula2Offset, "uint24");
        animationTilesLength = 0x900;
        animationTilesPosition = 0xee00;
        break;
      case 0xb:
        animationTilesOffset = getInt(animatedTilesTableOffset, "uint24");
        animationTilesLength = 0x400;
        break;
      case 0x46:
        animationTilesOffset = getInt(animatedTilesTableOffset + 0x124, "uint24"); // prettier-ignore
        animationTilesLength = 0x300;
        animationTilesPosition = 0x6000;
        break;
      case 0x4d:
      case 0x4e:
      case 0x51:
      case 0x54:
      case 0x57:
      case 0x5d:
        animationTilesOffset = getInt(animatedTilesTableOffset + 0x15c, "uint24"); // prettier-ignore
        animationTilesLength = 0x5c0;
        break;
      case 0x5f:
      case 0x60:
      case 0x61:
      case 0x62:
      case 0x64:
        animationTilesOffset = getInt(animatedTilesTableOffset + 0x194, "uint24"); // prettier-ignore
        animationTilesLength = 0x120;
        break;
      case 0x6a:
      case 0x7c:
        animationTilesOffset = getInt(animatedTilesTableOffset + 0x21c, "uint24"); // prettier-ignore
        animationTilesLength = 0xb00;
        animationTilesPosition = 0xa000;
        break;
      case 0xa8:
        animationTilesOffset = getInt(animatedTilesTableOffset + 0x348, "uint24"); // prettier-ignore
        animationTilesLength = 0x1f0;
        animationTilesPosition = 0xc000;
        break;
      case 0xb7:
      case 0xb9:
      case 0xbb:
      case 0xbc:
      case 0xbf:
      case 0xc0:
      case 0xc1:
        animationTilesOffset = getInt(animatedTilesTableOffset + 0x290, "uint24"); // prettier-ignore
        animationTilesLength = 0x3e0;
        break;
    }

    if (animationTilesOffset) {
      getSpriteData(animationTilesOffset, animationTilesLength).forEach(
        (tile, index) => {
          vramTileset.set(tile, animationTilesPosition + index * 0x40);
        },
      );
    }

    // Convert vram to tilset

    const tileset: number[][] = [];

    for (let i = 0x0; i < vramTileset.length / 0x40; i += 0x1) {
      tileset[i] = [];

      for (let j = 0x0; j < 0x40; j += 0x1) {
        tileset[i].push(vramTileset[i * 0x40 + j]);
      }
    }

    // Room

    const blocksPointer = getInt(mapBlocksPointer, "uint24");

    const backgroundRoomInfosOffset = blocksPointer + backgroundBlockset * 0x40;
    const backgroundRoomWidth = getInt(backgroundRoomInfosOffset + 0x10, "uint16"); // prettier-ignore
    const backgroundRoomHeight = getInt(backgroundRoomInfosOffset + 0x12, "uint16"); // prettier-ignore

    const foregroundRoomInfosOffset = blocksPointer + foregroundBlockset * 0x40;
    const foregroundRoomWidth = getInt(foregroundRoomInfosOffset + 0x10, "uint16"); // prettier-ignore
    const foregroundRoomHeight = getInt(foregroundRoomInfosOffset + 0x12, "uint16"); // prettier-ignore

    const width = (foregroundRoomWidth || backgroundRoomWidth) * 32;
    const height = (foregroundRoomHeight || backgroundRoomHeight) * 32;

    // Collisions

    const mapCollisionsTilesOffset = getInt(mapCollisionsOffset, "uint24");
    const mapCollisionsPaletteOffset = getInt(
      mapCollisionsOffset + 0x24,
      "uint24",
    );

    const tilesColisions = getCompressedGraphic(mapCollisionsTilesOffset);
    const paletteColisions = getPalette15Bit(
      mapCollisionsPaletteOffset,
      0x10,
      true,
    );

    canvas.resize(width, height);

    // Background
    generateMap(
      canvas,
      "background",
      tileset,
      tilesetsPalettes,
      tilesColisions,
      paletteColisions,
      backgroundRoomInfosOffset,
      backgroundRoomOffset,
    );

    // Foreground
    generateMap(
      canvas,
      "foreground",
      tileset,
      tilesetsPalettes,
      tilesColisions,
      paletteColisions,
      foregroundRoomInfosOffset,
      foregroundRoomOffset,
    );

    if (foregroundAboveSprites) {
      canvas.changeLayerOrder([
        "background",
        "collisions",
        "sprites",
        "monsters",
        "foreground",
      ]);
    } else {
      canvas.changeLayerOrder([
        "background",
        "foreground",
        "collisions",
        "sprites",
        "monsters",
      ]);
    }

    if (foregroundAlpha) {
      canvas.changeLayerOpacity("foreground", 0.5);
    } else {
      canvas.changeLayerOpacity("foreground", 1);
    }

    // Sprites

    const mapSpritesTablePointer = getRegionArray(pointerToMapSpritesTable);
    const mapSpritesTableOffset =
      getInt(mapSpritesTablePointer, "uint24") + roomIndex * 0x1c;

    const monstersGraphicsTableOffset = getRegionArray(monstersGraphicsTable);
    const specialGraphicsTableOffset = getRegionArray(specialGraphicsTable);

    const spritesDetailsOffset = getInt(mapSpritesTableOffset, "uint24");
    const spriteMonsterA1 = getInt(mapSpritesTableOffset + 0x4, "int16");
    const spriteMonsterA2 = getInt(mapSpritesTableOffset + 0x6, "int16");
    const spriteMonsterA3 = getInt(mapSpritesTableOffset + 0x8, "int16");
    const spriteMonsterA4 = getInt(mapSpritesTableOffset + 0xa, "int16");
    const spriteMonsterB1 = getInt(mapSpritesTableOffset + 0xc, "int16");
    const spriteMonsterB2 = getInt(mapSpritesTableOffset + 0xe, "int16");
    const spriteMonsterB3 = getInt(mapSpritesTableOffset + 0x10, "int16");
    const spriteMonsterB4 = getInt(mapSpritesTableOffset + 0x12, "int16");
    const unknown1 = getInt(mapSpritesTableOffset + 0x14, "int16");
    const spriteSpecial = getInt(mapSpritesTableOffset + 0x16, "int16");
    const unknown3 = getInt(mapSpritesTableOffset + 0x18, "int16");
    const unknown4 = getInt(mapSpritesTableOffset + 0x1a, "int16");

    const isMonsterSetB =
      spriteMonsterB1 + spriteMonsterB2 + spriteMonsterB3 + spriteMonsterB4 !==
        -4 && monsterSet;

    let monsters = [
      {
        index: isMonsterSetB ? spriteMonsterB1 : spriteMonsterA1,
        firstTile: 0x0,
      },
      {
        index: isMonsterSetB ? spriteMonsterB2 : spriteMonsterA2,
        firstTile: 0x0,
      },
      {
        index: isMonsterSetB ? spriteMonsterB3 : spriteMonsterA3,
        firstTile: 0x0,
      },
      {
        index: isMonsterSetB ? spriteMonsterB4 : spriteMonsterA4,
        firstTile: 0x0,
      },
    ];

    // Spriteset Palettes

    const spritesetPalettes: Palette[] = [];

    const spritesetPalette1Offset = getRegionArray(spritesetPalette1);
    const spritesetPalette2Offset = getRegionArray(spritesetPalette2);
    const spritesetPalette3Offset = getRegionArray(spritesetPalette3);
    const spritesetPalette4Offset = getRegionArray(spritesetPalette4);
    const spritesetPalette5Offset = getRegionArray(spritesetPalette5);
    const spritesetPalette6Offset = getRegionArray(spritesetPalette6);

    spritesetPalettes.push(
      getPalette15Bit(spritesetPalette1Offset, 0x10, true),
    );

    for (let i = 0x0; i < 0x3; i += 0x1) {
      spritesetPalettes.push(
        getPalette15Bit(spritesetPalette2Offset + i * 0x20, 0x10, true),
      );
    }

    spritesetPalettes.push(
      getPalette15Bit(spritesetPalette3Offset, 0x10, true),
    );
    spritesetPalettes.push(
      getPalette15Bit(spritesetPalette4Offset, 0x10, true),
    );
    spritesetPalettes.push(
      getPalette15Bit(spritesetPalette5Offset, 0x10, true),
    );
    spritesetPalettes.push(
      getPalette15Bit(spritesetPalette6Offset, 0x10, true),
    );

    // Monsters Palettes

    // Dracula
    if (monsters[0].index === 0x67) {
      const eventsTableOffset = getRegionArray(eventsTable);

      const pointer = getInt(eventsTableOffset + 0x1ca * 0x4, "uint24");

      const paletteOffset = getInt(pointer + 0x15f, "uint24");

      for (let i = 0x0; i < 0x4; i += 0x1) {
        spritesetPalettes.push(
          getPalette15Bit(paletteOffset + i * 0x20, 0x10, true),
        );
      }
    } else {
      monsters.forEach((monster) => {
        if (monster.index !== -1) {
          const paletteOffset = getInt(
            monstersGraphicsTableOffset + monster.index * 0x10,
            "uint24",
          );

          spritesetPalettes.push(getPalette15Bit(paletteOffset, 0x10, true));
        } else {
          spritesetPalettes.push([...Array(0x10).keys()].map(() => [0, 0, 0]));
        }
      });
    }

    for (let i = 0x0; i < 0x4; i += 0x1) {
      spritesetPalettes.push(
        getPalette15Bit(
          getRegionArray(commonSpritesPalettes) + i * 0x20,
          0x10,
          true,
        ),
      );
    }

    // Spriteset

    const vramSpriteset = new Uint8Array(0x10000);

    let vramOffset = 0x8000;

    monsters.forEach((monster) => {
      if (monster.index !== -1) {
        const spriteOffset = getInt(
          monstersGraphicsTableOffset + monster.index * 0x10 + 0x4,
          "uint24",
        );

        monster.firstTile = (vramOffset - 0x8000) / 0x40;

        getCompressedGraphic(spriteOffset).forEach((tile) => {
          vramSpriteset.set(tile, vramOffset);

          vramOffset += 0x40;
        });

        vramOffset = Math.ceil(vramOffset / 0x400) * 0x400;
      }
    });

    if (spriteSpecial !== -1) {
      const spriteOffset = getInt(
        specialGraphicsTableOffset + spriteSpecial * 0xc,
        "uint24",
      );

      getCompressedGraphic(spriteOffset).forEach((tile, index) => {
        vramSpriteset.set(tile, 0x7000 + index * 0x40);
      });
    }

    getSpriteData(getRegionArray(commonSpritesGraphics), 0x1bc0).forEach(
      (tile, index) => {
        vramSpriteset.set(tile, 0xc000 + index * 0x40);
      },
    );

    // Convert vram to spriteset

    const spriteset: number[][] = [];

    for (let i = 0x0; i < vramSpriteset.length / 0x40; i += 0x1) {
      spriteset[i] = [];

      for (let j = 0x0; j < 0x40; j += 0x1) {
        spriteset[i].push(vramSpriteset[i * 0x40 + j]);
      }
    }

    generateSprites(
      canvas,
      spritesDetailsOffset,
      spriteset,
      spritesetPalettes,
      monsters,
      spriteSpecial,
    );

    canvas.render();

    if ($isDebug) {
      canvasDebug.resize(264, 648);

      tilesetsPalettes.forEach((palette, paletteIndex) => {
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
      });

      tileset.forEach((tileData, index) => {
        const x = (index % 0x10) * 0x8;
        const y = 0x88 + Math.floor(index / 0x10) * 0x8;

        const tile = applyPalette(tileData, tilesetsPalettes[0]);

        canvasDebug.addGraphic("debug", tile, 8, 8, x, y);
      });

      spritesetPalettes.forEach((palette, paletteIndex) => {
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
            0x11 * 0x8 + index * 0x8,
            paletteIndex * 0x8,
          );
        });
      });

      spriteset.forEach((tileData, index) => {
        const x = 0x11 * 0x8 + (index % 0x10) * 0x8;
        const y = 0x88 + Math.floor(index / 0x10) * 0x8;

        const tile = applyPalette(tileData, spritesetPalettes[0]);

        canvasDebug.addGraphic("debug", tile, 8, 8, x, y);
      });

      canvasDebug.render();
    }
  }

  onMount(() => {
    canvas = new Canvas(canvasEl);

    canvas.addLayer("background", "image");
    canvas.addLayer("foreground", "image");
    canvas.addLayer("collisions", "image", { hidden: true });
    canvas.addLayer("sprites", "image");
    canvas.addLayer("monsters", "image");

    if ($isDebug) {
      canvasDebug = new Canvas(canvasDebugEl);

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

<div class="gtc-mapViewer">
  <div class="gtc-mapViewer-inputs">
    <Select
      label="Monster Set"
      type="number"
      value={monsterSet}
      options={[
        { key: "0", value: "Set A" },
        { key: "1", value: "Set B" },
      ]}
      onChange={handleMonsterSetChange}
    />
    <div class="gtc-mapViewer-layers">
      <p>Layers</p>
      <div>
        {#each ["background", "foreground", "collisions", "sprites", "monsters"] as layer}
          <Checkbox
            label={capitalize(layer)}
            checked={canvas?.getLayerVisibility(layer)}
            onChange={(event) => handleLayerVisibilityChange(event, layer)}
          />
        {/each}
      </div>
    </div>
  </div>
  <div>
    {#if $isDebug}
      <div class="gtc-mapViewer-canvas">
        <div bind:this={canvasDebugEl} />
      </div>
    {/if}
    <div class="gtc-mapViewer-canvas">
      <div bind:this={canvasEl} />
    </div>
  </div>
</div>

<style lang="postcss">
  .gtc-mapViewer {
    & > div {
      @apply flex;
    }

    & .gtc-mapViewer-inputs {
      @apply flex;

      & .gtc-mapViewer-layers {
        @apply mr-4 mb-4 p-2 w-fit bg-primary-700 rounded;

        & p {
          @apply mb-2 text-sm font-bold;
        }

        & div {
          @apply flex;

          & :global(label) {
            @apply mr-2;
          }
        }
      }
    }

    & .gtc-mapViewer-canvas {
      @apply self-start mr-4 mb-4 p-2 w-fit bg-primary-700 rounded;
    }
  }
</style>
