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

  interface Props {
    backgroundIndex: number;
  }

  let { backgroundIndex }: Props = $props();

  let canvasEl = $state<HTMLDivElement>()!;

  let canvas = $state<Canvas>()!;

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

  $effect(() => {
    $dataView;

    if (canvas) {
      updateCanvas();
    }
  });
</script>

<div class="gtc-battlebackgroundcanvas">
  <div bind:this={canvasEl}></div>
</div>

<style lang="postcss">
  @reference "../../../../../app.css";

  .gtc-battlebackgroundcanvas {
    @apply bg-primary-700 mr-4 mb-4 w-fit rounded p-2;

    height: 216px;
  }
</style>
