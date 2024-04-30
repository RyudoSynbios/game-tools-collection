<script lang="ts">
  import { onDestroy, onMount } from "svelte";

  import Checkbox from "$lib/components/Checkbox.svelte";
  import { isDebug } from "$lib/stores";
  import { getInt } from "$lib/utils/bytes";
  import { Canvas } from "$lib/utils/canvas";
  import { capitalize } from "$lib/utils/format";
  import {
    applyPalette,
    convertPaletteMegaDrive,
    flipTileData,
  } from "$lib/utils/graphics";

  import type { Palette } from "$lib/types";

  import { pointerToRoomsTable } from "../template";
  import { getDecompressedData, getTiles, pointerToOffset } from "../utils";

  export let roomIndex: number;

  let canvasEl: HTMLDivElement;
  let canvasDebugEl: HTMLDivElement;

  let canvas: Canvas;
  let canvasDebug: Canvas;

  const roomsTableOffset = pointerToOffset(pointerToRoomsTable);

  function handleLayerVisibilityChange(event: Event, layer: string): void {
    if ((event.target as HTMLInputElement).checked) {
      canvas.showLayer(layer);
    } else {
      canvas.hideLayer(layer);
    }

    updateCanvas();
  }

  function updateCanvas(): void {
    const roomOffset = roomsTableOffset + roomIndex * 0x40;

    // Palettes

    const palettes: Palette[] = [];

    const palettesOffset = 0xff000;

    for (let i = 0x0; i < 0x4; i += 0x1) {
      const rawPalette = [];

      const offset = (getInt(roomOffset + 0xc + i, "uint8") - 0x1) * 0x20;

      for (let j = 0x0; j < 0x10; j += 0x1) {
        const rawColor = getInt(palettesOffset + offset + j * 0x2, "uint16", {
          bigEndian: true,
        });

        const color =
          (((rawColor & 0x3e) >> 3) << 9) |
          ((rawColor >> 0xd) << 5) |
          (((rawColor & 0x7c0) >> 8) << 1);

        rawPalette.push(color);
      }

      const palette = convertPaletteMegaDrive(rawPalette);

      palettes.push(palette);
    }

    // Tileset

    let tilesetDatas: number[][] = [];

    const vdp = new Uint8Array(0x10000);

    let vdpOffset = 0x0;

    // UI

    const uiOffset = 0xf2000;

    let tilesUncompressedSize = getInt(uiOffset + 0x4, "uint32");

    let vdpTiles = getTiles(uiOffset + 0x8, tilesUncompressedSize);

    vdp.set(vdpTiles.slice(0x0, tilesUncompressedSize), vdpOffset);

    vdpOffset = 0xd740;

    // Hero graphics

    const heroSpriteOffset = 0xf4800;

    tilesUncompressedSize = getInt(heroSpriteOffset + 0x4, "uint32");

    vdpTiles = getTiles(heroSpriteOffset + 0x8, tilesUncompressedSize);

    vdp.set(vdpTiles.slice(0x0, tilesUncompressedSize), vdpOffset);

    vdpOffset = 0x2000;

    // Base tiles

    const tilesBaseOffset = 0x120000;

    const tilesOffset = (getInt(roomOffset + 0x4, "uint8") - 0x1) * 0x4;
    const tilesCompressedDatasOffset =
      tilesBaseOffset +
      getInt(tilesBaseOffset + tilesOffset, "uint32", { bigEndian: true });

    tilesUncompressedSize = getInt(tilesCompressedDatasOffset + 0x4, "uint32");

    vdpTiles = getTiles(
      tilesCompressedDatasOffset + 0x8,
      tilesUncompressedSize,
    );

    vdp.set(vdpTiles.slice(0x0, tilesUncompressedSize), vdpOffset);

    vdpOffset += tilesUncompressedSize;

    // Additional tiles

    const additionalTilesBaseOffset = getInt(roomOffset + 0x5, "uint8");

    if (additionalTilesBaseOffset) {
      const additionalTilesOffset = (additionalTilesBaseOffset - 0x1) * 0x4;
      const additionalTilesCompressedDatasOffset =
        tilesBaseOffset +
        getInt(tilesBaseOffset + additionalTilesOffset, "uint32", {
          bigEndian: true,
        });

      tilesUncompressedSize = getInt(
        additionalTilesCompressedDatasOffset + 0x4,
        "uint32",
      );

      vdpTiles = getTiles(
        additionalTilesCompressedDatasOffset + 0x8,
        tilesUncompressedSize,
      );

      vdp.set(vdpTiles.slice(0x0, tilesUncompressedSize), vdpOffset);

      vdpOffset += tilesUncompressedSize;
    }

    // Map

    const mapsBaseOffset = 0x15e000;
    const mapOffset = (getInt(roomOffset, "uint8") - 0x1) * 0x4;
    const mapCompressedDatasOffset =
      mapsBaseOffset +
      getInt(mapsBaseOffset + mapOffset, "uint32", { bigEndian: true });

    const mapUncompressedSize = getInt(
      mapCompressedDatasOffset + 0x4,
      "uint32",
    );

    const map = getDecompressedData(
      mapCompressedDatasOffset + 0x8,
      mapUncompressedSize,
    );

    for (let i = 0x0; i <= 0xfff; i += 0x1) {
      map[i * 2] += 0x1;
    }

    const mapWidth = map[0x2c00] * 0x20;
    const mapHeight = map[0x2c01] * 0x10;

    canvas.resize(mapWidth * 0x8, mapHeight * 0x10);

    // Additional layer

    // const additionalLayer = getInt(roomOffset + 0x1, "uint8");

    // Sprites

    let sprites = map;
    let baseRamTest = 0x2800;

    const spritesOverrideOffset = getInt(roomOffset + 0x10, "uint16", {
      bigEndian: true,
    });

    if (spritesOverrideOffset) {
      const spriteOverrideBaseOffset = 0x50000;

      const spriteOverrideOffset = (spritesOverrideOffset - 0x1) * 0x4;
      const spriteOverrideCompressedDatasOffset =
        spriteOverrideBaseOffset +
        getInt(spriteOverrideBaseOffset + spriteOverrideOffset, "uint32", {
          bigEndian: true,
        });

      const spritesUncompressedSize = getInt(
        spriteOverrideCompressedDatasOffset + 0x4,
        "uint32",
      );

      sprites = getDecompressedData(
        spriteOverrideCompressedDatasOffset + 0x8,
        spritesUncompressedSize,
      );
      baseRamTest = 0x0;
    }

    while (true) {
      const spriteType =
        (sprites[baseRamTest + 0x0] << 0x8) | sprites[baseRamTest + 0x1];
      const x =
        (sprites[baseRamTest + 0x2] << 0x8) | sprites[baseRamTest + 0x3];
      const y =
        (sprites[baseRamTest + 0x4] << 0x8) | sprites[baseRamTest + 0x5];
      const spriteId =
        (sprites[baseRamTest + 0x6] << 0x8) | sprites[baseRamTest + 0x7];

      if (x + y === 0x0) {
        break;
      }

      // Sprites Graphics

      const spritesTableOffset = getInt(0x124ea + roomIndex * 0x4, "uint32", {
        bigEndian: true,
      });

      if (spriteType === 0x16) {
        const spritesDataOffset = getInt(
          spritesTableOffset + spriteId * 0x8 + 0x4,
          "uint32",
          {
            bigEndian: true,
          },
        );

        const spriteIndex = (spritesDataOffset & 0xff) * 0x8;
        const spritesOffset = getInt(0x19848 + spriteIndex, "uint8");

        if (spritesOffset !== 0x0) {
          const spritesBaseOffset = 0x59000;
          const spriteOffset = (spritesOffset - 0x1) * 0x4;
          const spriteCompressedDataOffset =
            spritesBaseOffset +
            getInt(spritesBaseOffset + spriteOffset, "uint32", {
              bigEndian: true,
            });

          tilesUncompressedSize = getInt(
            spriteCompressedDataOffset + 0x4,
            "uint32",
          );

          vdpTiles = getTiles(
            spriteCompressedDataOffset + 0x8,
            tilesUncompressedSize,
          );

          vdp.set(vdpTiles.slice(0x0, tilesUncompressedSize), vdpOffset + 0x80);

          vdpOffset += tilesUncompressedSize;
        }
      }

      const tileData = [...Array(0x40).keys()].map((_) => 0x0);
      const tile = applyPalette(tileData, palettes[0]);

      canvas.addGraphic("sprites", tile, 8, 8, x, y);

      baseRamTest += 0x8;
    }

    // Generate tilesetDatas

    vdp.forEach((data, index) => {
      const high = data >> 4;
      const low = data - (high << 4);

      const tileIndex = Math.floor(index / 0x20);

      if (!tilesetDatas[tileIndex]) {
        tilesetDatas[tileIndex] = [];
      }

      tilesetDatas[tileIndex].push(high, low);
    });

    function getMapValue(offset: number): number {
      return (map[offset] << 8) | map[offset + 0x1];
    }

    // Generate map

    for (let section = 0x0; section < mapWidth / 0x40; section += 0x1) {
      let ramOffset = 0x2c04;

      let position = 0x0;

      for (let row = 0x0; row < mapHeight; row += 0x1) {
        for (let column = 0x0; column < 0x20; column += 0x1) {
          const mapOffset =
            (getMapValue(ramOffset + section * 0x40) & 0x3fff) * 0x8;

          [0x0, 0x2, 0x80, 0x82].forEach((offset, index) => {
            const rawTile = getMapValue(mapOffset + index * 2);

            const flipHorizontal = (rawTile & 0x800) >> 0xb;
            const flipVertical = (rawTile & 0x1000) >> 0xc;
            const paletteIndex = (rawTile & 0x6000) >> 0xd;
            const tileIndex = rawTile & 0x7ff;

            const palette = palettes[paletteIndex];

            let tileData = tilesetDatas[tileIndex];

            if (flipHorizontal) {
              tileData = flipTileData(tileData, 8, "x");
            }

            if (flipVertical) {
              tileData = flipTileData(tileData, 8, "y");
            }

            const tile = applyPalette(tileData, palette);

            const x =
              section * 0x200 + (((position + offset) / 2) % 0x40) * 0x8;
            const y = Math.floor((position + offset) / 0x80) * 0x8;

            canvas.addGraphic("background", tile, 8, 8, x, y);
          });

          ramOffset += 0x2;
          position += 0x4;
        }

        ramOffset += (mapWidth / 0x40 - 0x1) * 0x40;
        position += 0x80;
      }
    }

    canvas.render();

    if ($isDebug) {
      canvasDebug.resize(128, 1064);

      palettes.forEach((palette, paletteIndex) => {
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

      tilesetDatas.forEach((tileData, index) => {
        const x = (index % 0x10) * 0x8;
        const y = 40 + Math.floor(index / 0x10) * 0x8;

        const tile = applyPalette(tileData, palettes[0]);

        canvasDebug.addGraphic("debug", tile, 8, 8, x, y);
      });

      canvasDebug.render();
    }
  }

  onMount(() => {
    canvas = new Canvas(canvasEl);

    canvas.addLayer("background", "image");
    canvas.addLayer("sprites", "image", { hidden: true });

    if ($isDebug) {
      canvasDebug = new Canvas(canvasDebugEl);

      canvasDebug.addLayer("debug", "image");
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
  {#if $isDebug}
    <div class="gtc-mapViewer-inputs">
      {#each ["background", "sprites"] as layer}
        <Checkbox
          label={capitalize(layer)}
          checked={canvas?.getLayerVisibility(layer)}
          onChange={(event) => handleLayerVisibilityChange(event, layer)}
        />
      {/each}
    </div>
  {/if}
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
      @apply flex mb-2;

      & :global(label) {
        @apply mr-2;
      }
    }

    & .gtc-mapViewer-canvas {
      @apply self-start mr-4 mb-4 p-2 w-fit bg-primary-700 rounded;
    }
  }
</style>
