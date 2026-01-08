<script lang="ts">
  import { onDestroy, onMount } from "svelte";

  import Checkbox from "$lib/components/Checkbox.svelte";
  import { isDebug } from "$lib/stores";
  import { getIntFromArray } from "$lib/utils/bytes";
  import Canvas from "$lib/utils/canvas";
  import { capitalize } from "$lib/utils/format";
  import { applyPalette, flipTileData } from "$lib/utils/graphics";

  import { pointerToOffset } from "../utils";
  import { ROOM_TABLE_POINTER } from "../utils/constants";
  import {
    generateTilesetData,
    getHeroTiles,
    getMap,
    getMapTiles,
    getMapValue,
    getPalettes,
    getSprites,
    getSpriteTiles,
    getUITiles,
  } from "../utils/map";

  export let roomIndex: number;

  let canvasEl: HTMLDivElement;
  let canvasDebugEl: HTMLDivElement;

  let canvas: Canvas;
  let canvasDebug: Canvas;

  const roomsTableOffset = pointerToOffset(ROOM_TABLE_POINTER);

  function handleLayerVisibilityChange(event: Event, layer: string): void {
    if ((event.target as HTMLInputElement).checked) {
      canvas.showLayer(layer);
    } else {
      canvas.hideLayer(layer);
    }
  }

  function updateCanvas(): void {
    const roomOffset = roomsTableOffset + roomIndex * 0x40;

    // Map

    const map = getMap(roomOffset);

    const mapWidth = map[0x2c00] * 0x20;
    const mapHeight = map[0x2c01] * 0x10;

    canvas.resize(mapWidth * 0x8, mapHeight * 0x10);

    // VDP

    const vdp = new Uint8Array(0x10000);

    const uiTiles = getUITiles();
    const heroTiles = getHeroTiles();
    const mapTiles1 = getMapTiles(roomOffset + 0x4);
    const mapTiles2 = getMapTiles(roomOffset + 0x5);

    const palettes = getPalettes(roomOffset + 0xc);

    vdp.set(uiTiles, 0x0);
    vdp.set(heroTiles, 0xd740);
    vdp.set(mapTiles1, 0x2000);

    let vdpOffset = 0x2000 + mapTiles1.byteLength;

    vdp.set(mapTiles2, vdpOffset);

    vdpOffset += mapTiles2.byteLength;

    // const additionalLayer = getInt(roomOffset + 0x1, "uint8");

    // Sprites

    let sprites = getSprites(roomOffset + 0x10);
    let spritesOffset = 0x0;

    if (sprites.length === 0) {
      sprites = map;
      spritesOffset = 0x2800;
    }

    // prettier-ignore
    while (true) {
      const spriteType = getIntFromArray(sprites, spritesOffset, "uint16", true);
      const x = getIntFromArray(sprites, spritesOffset + 0x2, "uint16", true);
      const y = getIntFromArray(sprites, spritesOffset + 0x4, "uint16", true);
      const spriteId = getIntFromArray(sprites, spritesOffset + 0x6, "uint16", true);

      if (x + y === 0x0) {
        break;
      }

      if (spriteType === 0x16) {
        const spriteTiles = getSpriteTiles(roomIndex, spriteId);

        vdp.set(spriteTiles, vdpOffset + 0x80);

        vdpOffset += spriteTiles.byteLength;
      }

      const tileData = [...Array(0x40).keys()].map(() => 0x0);
      const tile = applyPalette(tileData, palettes[0]);

      canvas.addGraphic("sprites", tile, 8, 8, x, y);

      spritesOffset += 0x8;
    }

    const tilesetDatas = generateTilesetData(vdp);

    // Generate map

    for (let section = 0x0; section < mapWidth / 0x40; section += 0x1) {
      let ramOffset = 0x2c04;

      let position = 0x0;

      for (let row = 0x0; row < mapHeight; row += 0x1) {
        for (let column = 0x0; column < 0x20; column += 0x1) {
          const mapOffset =
            (getMapValue(ramOffset + section * 0x40, map) & 0x3fff) * 0x8;

          [0x0, 0x2, 0x80, 0x82].forEach((offset, index) => {
            const rawTile = getMapValue(mapOffset + index * 2, map);

            const flipX = (rawTile & 0x800) >> 0xb;
            const flipY = (rawTile & 0x1000) >> 0xc;
            const paletteIndex = (rawTile & 0x6000) >> 0xd;
            const tileIndex = rawTile & 0x7ff;

            const palette = palettes[paletteIndex];

            let tileData = tilesetDatas[tileIndex];

            if (flipX) {
              tileData = flipTileData(tileData, 8, "x");
            }

            if (flipY) {
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
          const tileData = new Uint8Array(0x10 * 8 * 0x10 * 8 * 4);

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
    canvas = new Canvas({ canvasEl });

    canvas.addLayer("background", "image");
    canvas.addLayer("sprites", "image", { hidden: true });

    if ($isDebug) {
      canvasDebug = new Canvas({
        canvasEl: canvasDebugEl,
      });

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

<div class="gtc-mapviewer">
  {#if $isDebug}
    <div class="gtc-mapviewer-inputs">
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
      <div class="gtc-mapviewer-canvasdebug">
        <div bind:this={canvasDebugEl}></div>
      </div>
    {/if}
    <div class="gtc-mapviewer-canvas">
      <div bind:this={canvasEl}></div>
    </div>
  </div>
</div>

<style lang="postcss">
  .gtc-mapviewer {
    & > div {
      @apply flex;
    }

    & .gtc-mapviewer-inputs {
      @apply mb-2 flex;

      & :global(label) {
        @apply mr-4;
      }
    }

    & .gtc-mapviewer-canvasdebug,
    & .gtc-mapviewer-canvas {
      @apply w-fit self-start rounded bg-primary-700 p-2;
    }

    & .gtc-mapviewer-canvasdebug {
      @apply mr-4;
    }
  }
</style>
