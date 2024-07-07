<script lang="ts">
  import { onDestroy, onMount } from "svelte";

  import { dataView } from "$lib/stores";
  import { getInt } from "$lib/utils/bytes";
  import Canvas from "$lib/utils/canvas";
  import { getPalette } from "$lib/utils/graphics";

  import {
    pointerToBattleBackgroundChunks,
    pointerToBattleBackgroundPalettes,
    pointerToBattleBackgroundSets,
    pointerToBattleBackgroundTiles,
  } from "../template";
  import { generateBattleBackgroundCanvas, pointerToOffset } from "../utils";

  export let backgroundIndex: number;

  let canvasEl: HTMLDivElement;

  let canvas: Canvas;

  function updateCanvas(): void {
    const tilesetsOffset = pointerToOffset(pointerToBattleBackgroundSets);
    const chunksOffset = pointerToOffset(pointerToBattleBackgroundChunks);

    const tilesetTop = getInt(tilesetsOffset + backgroundIndex * 3, "uint8");

    const palettePrimaryIndex = getInt(
      tilesetsOffset + backgroundIndex * 3 + 0x2,
      "uint8",
    );

    const paletteSecondaryIndex = getInt(
      tilesetsOffset + backgroundIndex * 3 + 0x1,
      "upper4",
    );

    const palettesOffset = pointerToOffset(pointerToBattleBackgroundPalettes);

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

    const tilesOffset = pointerToOffset(pointerToBattleBackgroundTiles);

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
    $dataView, backgroundIndex;

    if (canvas) {
      updateCanvas();
    }
  }
</script>

<div class="gtc-battlebackgroundcanvas">
  <div bind:this={canvasEl} />
</div>

<style lang="postcss">
  .gtc-battlebackgroundcanvas {
    @apply mr-4 mb-4 p-2 w-fit bg-primary-700 rounded;

    height: 216px;
  }
</style>
