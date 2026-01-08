<script lang="ts">
  import { onDestroy, onMount } from "svelte";

  import { isDebug } from "$lib/stores";
  import {
    extractBinary,
    extractBit,
    getInt,
    getIntFromArray,
  } from "$lib/utils/bytes";
  import Canvas from "$lib/utils/canvas";
  import { getTileData } from "$lib/utils/common/superNintendo";
  import { applyPalette, flipTileData, getPalette } from "$lib/utils/graphics";

  import type { Palette } from "$lib/types";

  import { getDecompressedData } from "../utils";

  export let roomIndex: number;

  let canvasEl: HTMLDivElement;
  let canvasDebugEl: HTMLDivElement;

  let canvas: Canvas;
  let canvasDebug: Canvas;

  function updateCanvas(): void {
    canvasDebug.resize(128, 1280);

    const ROOM_TABLE_OFFSET = 0x360000;
    const MAP_PALETTES_OFFSET = 0x3624c0;
    const MAP_TABLE_OFFSET = 0x361e00;

    const roomOffset = ROOM_TABLE_OFFSET + 0xe * roomIndex;

    // const bgm = getInt(roomOffset, "uint8");
    const tilesetSetIndex1 = getInt(roomOffset + 0x1, "uint8");
    // const tilesetSetIndex2 = getInt(roomOffset + 0x2, "uint8");
    const paletteSetIndex = getInt(roomOffset + 0x3, "uint8");
    const mapIndex = getInt(roomOffset + 0x4, "uint8");
    // const unknown5 = getInt(roomOffset + 0x5, "uint8");
    // const unknown6 = getInt(roomOffset + 0x6, "uint8");
    // const unknown7 = getInt(roomOffset + 0x7, "uint8");
    // const unknown8 = getInt(roomOffset + 0x8, "uint8");
    // const unknown9 = getInt(roomOffset + 0x9, "uint8");
    // const mapPositionX = getInt(roomOffset + 0xa, "uint8");
    // const mapPositionY = getInt(roomOffset + 0xb, "uint8");
    // const mapWidth = getInt(roomOffset + 0xc, "uint8");
    // const mapHeight = getInt(roomOffset + 0xd, "uint8");

    const paletteSetOffset = MAP_PALETTES_OFFSET + paletteSetIndex * 0xd2;

    const palettes: Palette[] = [];

    palettes.push([[0, 0, 0, 0], ...getPalette("BGR555", 0x3fb212, 0x7)]);

    for (let i = 0x0; i < 0x7; i += 0x1) {
      palettes.push([
        [0, 0, 0, 0],
        ...getPalette("BGR555", paletteSetOffset + i * 0x1e, 0xf),
      ]);
    }

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

    const tiles: number[][] = [...Array(0x100).keys()].map(() =>
      Array(0x40).fill(0x0),
    );

    for (let i = 0x0; i < 0x8; i += 0x1) {
      const tilesetIndex = getInt(
        0x361c00 + tilesetSetIndex1 * 0x8 + i,
        "uint8",
      );

      if (tilesetIndex !== 0xff) {
        const tilesetOffset =
          getInt(0x362220 + tilesetIndex * 0x3, "uint24") - 0xc00000;

        const data = getDecompressedData(tilesetOffset, "tiles");

        for (let row = 0x0; row < 0x8; row += 0x1) {
          for (let column = 0x0; column < 0x10; column += 0x1) {
            const tileData = getTileData(
              row * 0x200 + column * 0x20,
              "4bpp",
              data,
            );

            tiles.push(tileData);

            const tile = applyPalette(tileData, palettes[1]);

            canvasDebug.addGraphic(
              "debug",
              tile,
              8,
              8,
              column * 8,
              0x80 + i * 64 + row * 8,
            );
          }
        }
      }
    }

    canvasDebug.render();

    const mapOffset =
      getInt(MAP_TABLE_OFFSET + mapIndex * 0x3, "uint24") - 0xc00000;

    const map = getDecompressedData(mapOffset, "map");

    const unknown0 = map[0x0];
    const unknown1 = map[0x1];
    // const background2Animation = map[0x2];
    // const background3Animation = map[0x3];
    // const background2Brightness = map[0x4];
    // const background3Brightness = map[0x5];

    // const unknown1b4 = extractBit(unknown1, 4);
    // const unknown1b5 = extractBit(unknown1, 5);
    // const unknown1b6 = extractBit(unknown1, 6);
    // const unknown1b7 = extractBit(unknown1, 7);

    const bg1Width = (extractBinary(unknown1, 0, 2) + 0x1) * 0x10;
    const bg1Height = (extractBinary(unknown1, 2, 2) + 0x1) * 0x10;
    const bg2Width = (extractBinary(unknown0, 0, 2) + 0x1) * 0x10;
    const bg2Height = (extractBinary(unknown0, 2, 2) + 0x1) * 0x10;
    const bg3Width = (extractBinary(unknown0, 4, 2) + 0x1) * 0x10;
    const bg3Height = (extractBinary(unknown0, 6, 2) + 0x1) * 0x10;

    const width = Math.min(bg1Width, bg2Width, bg3Width);
    const height = Math.min(bg1Height, bg2Height, bg3Height);

    canvas.resize(width * 0x10, height * 0x10);

    const TILESET_CHUNKS_OFFSET = 0x362100; // TODO: ?

    const chunksOffset =
      getInt(TILESET_CHUNKS_OFFSET + tilesetSetIndex1 * 0x3, "uint24") -
      0xc00000;

    const chunks = getDecompressedData(chunksOffset, "map");

    const backgrounds = [
      new Uint16Array(bg1Width * bg1Height * 0x4),
      new Uint16Array(bg2Width * bg2Height * 0x4),
      new Uint16Array(bg3Width * bg3Height * 0x4),
    ];

    let tmpOffset = 0x6; // TODO:

    const special = new Uint8Array(width * height); // TODO: Seems to have collisions

    let specialIndex = 0x0;

    let testOffset = tmpOffset + bg1Width * bg1Height * 0x3;

    while (testOffset < map.byteLength) {
      const test = map[testOffset];
      // const unknown1 = map[testOffset + 0x1];
      // const unknown2 = map[testOffset + 0x2];

      testOffset += 0x3;

      const int = test & 0x7f;
      const repeat = extractBit(test, 7);

      let count = 0x1;

      if (repeat) {
        count = map[testOffset++];
      }

      for (let j = 0x0; j < count; j += 0x1) {
        special[specialIndex++] = int;
      }
    }

    for (let i = 0x0; i < 0x2; i += 0x1) {
      let specialOffset = 0x0;

      for (let j = 0x0; j < bg1Height; j += 0x1) {
        for (let k = 0x0; k < bg1Width; k += 0x1) {
          let chunkIndex = map[tmpOffset];
          const test = special[specialOffset];

          if ((test >> i) & 0x1) {
            chunkIndex += 0x100;
          }

          const chunkOffset = chunkIndex * 0x8;
          const bgLine1Offset = j * bg1Width * 0x4 + k * 0x2;
          const bgLine2Offset = j * bg1Width * 0x4 + bg1Width * 0x2 + k * 0x2;

          backgrounds[i][bgLine1Offset] = getIntFromArray(chunks, chunkOffset, "uint16"); // prettier-ignore
          backgrounds[i][bgLine1Offset + 0x1] = getIntFromArray(chunks, chunkOffset + 0x2, "uint16"); // prettier-ignore
          backgrounds[i][bgLine2Offset] = getIntFromArray(chunks, chunkOffset + 0x4, "uint16"); // prettier-ignore
          backgrounds[i][bgLine2Offset + 0x1] = getIntFromArray(chunks, chunkOffset + 0x6, "uint16"); // prettier-ignore

          tmpOffset += 0x1;
          specialOffset += 0x1;
        }
      }
    }

    const rows = height * 0x2;
    const columns = width * 0x2;

    for (let layer = 0x0; layer < 0x2; layer += 0x1) {
      for (let row = 0x0; row < rows; row += 0x1) {
        for (let column = 0x0; column < columns; column += 0x1) {
          const tileInfos = backgrounds[layer][row * columns + column];

          const tileIndex = tileInfos & 0x3ff;
          const paletteIndex = (tileInfos >> 0xa) & 0x7;
          // const priority = (tileInfos >> 0xc) & 0x1;
          const flipX = (tileInfos >> 0xe) & 0x1;
          const flipY = tileInfos >> 0xf;

          let tileData = tiles[tileIndex];

          if (flipX) {
            tileData = flipTileData(tileData, 8, "x");
          }

          if (flipY) {
            tileData = flipTileData(tileData, 8, "y");
          }

          if (tiles[tileIndex] && paletteIndex > 0) {
            const tile = applyPalette(tileData, palettes[paletteIndex]);

            canvas.addGraphic(
              `background${layer + 1}`,
              tile,
              8,
              8,
              column * 8,
              row * 8,
            );
          }
        }
      }
    }

    canvas.render();
  }

  onMount(() => {
    canvas = new Canvas({
      canvasEl,
    });

    canvas.addLayer("background1", "image", { order: 2 });
    canvas.addLayer("background2", "image", { order: 1 });
    canvas.addLayer("background3", "image", { order: 0 });

    if ($isDebug) {
      canvasDebug = new Canvas({
        canvasEl: canvasDebugEl,
        backgroundAlpha: 1,
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
    <div class="gtc-mapviewer-canvasdebug">
      <div bind:this={canvasDebugEl}></div>
    </div>
  {/if}
  <div class="gtc-mapviewer-canvas">
    <div bind:this={canvasEl}></div>
  </div>
</div>

<style lang="postcss">
  .gtc-mapviewer {
    @apply flex;

    /* & .gtc-mapviewer-inputs {
      @apply mb-2 flex;

      & :global(label) {
        @apply mr-4;
      }
    } */

    & .gtc-mapviewer-canvasdebug,
    & .gtc-mapviewer-canvas {
      @apply w-fit self-start rounded bg-primary-700 p-2;
    }

    & .gtc-mapviewer-canvasdebug {
      @apply mr-4;
    }
  }
</style>
