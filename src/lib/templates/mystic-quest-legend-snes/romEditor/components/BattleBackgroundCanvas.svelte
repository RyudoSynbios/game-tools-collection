<script lang="ts">
  import { onDestroy, onMount } from "svelte";

  import { dataView } from "$lib/stores";
  import { getInt } from "$lib/utils/bytes";
  import Canvas from "$lib/utils/canvas";
  import { getPalette } from "$lib/utils/graphics";

  import { generateBattleBackgroundCanvas, pointerToOffset } from "../utils";
  import {
    BATTLE_BACKGROUND_CHUNKS_POINTER,
    BATTLE_BACKGROUND_PALETTES_POINTER,
    BATTLE_BACKGROUND_SETS_POINTER,
    BATTLE_BACKGROUND_TILESET_POINTER,
  } from "../utils/constants";

  export let backgroundIndex: number;

  let canvasEl: HTMLDivElement;

  let canvas: Canvas;

  function updateCanvas(): void {
    const tilesetsOffset = pointerToOffset(BATTLE_BACKGROUND_SETS_POINTER);
    const chunksOffset = pointerToOffset(BATTLE_BACKGROUND_CHUNKS_POINTER);

    const tilesetTop = getInt(tilesetsOffset + backgroundIndex * 3, "uint8");

    const palettePrimaryIndex = getInt(
      tilesetsOffset + backgroundIndex * 3 + 0x2,
      "uint8",
    );

    const paletteSecondaryIndex = getInt(
      tilesetsOffset + backgroundIndex * 3 + 0x1,
      "upper4",
    );

    const palettesOffset = pointerToOffset(BATTLE_BACKGROUND_PALETTES_POINTER);

    const palettePrimary = getPalette(
      "BGR555",
      palettesOffset + palettePrimaryIndex * 0x10,
      0x8,
    );
    const paletteSecondary = getPalette(
      "BGR555",
      palettesOffset + paletteSecondaryIndex * 0x10,
      0x8,
    );

    generateBattleBackgroundCanvas(
      canvas,
      chunksOffset,
      tilesetTop,
      palettePrimary,
      paletteSecondary,
      "top",
    );

    const tilesetBottom = getInt(
      tilesetsOffset + backgroundIndex * 3 + 0x1,
      "lower4",
    );

    const tilesOffset = pointerToOffset(BATTLE_BACKGROUND_TILESET_POINTER);

    generateBattleBackgroundCanvas(
      canvas,
      tilesOffset,
      tilesetBottom,
      palettePrimary,
      paletteSecondary,
      "bottom",
    );
  }

  onMount(() => {
    canvas = new Canvas({
      canvasEl,
      width: 256,
      height: 200,
    });

    canvas.addLayer("background", "image");

    updateCanvas();
  });

  onDestroy(() => {
    canvas.destroy();
  });

  $: {
    ($dataView, backgroundIndex);

    if (canvas) {
      updateCanvas();
    }
  }
</script>

<div class="gtc-battlebackgroundcanvas">
  <div bind:this={canvasEl}></div>
</div>

<style lang="postcss">
  .gtc-battlebackgroundcanvas {
    @apply mb-4 mr-4 w-fit rounded bg-primary-700 p-2;

    height: 216px;
  }
</style>
