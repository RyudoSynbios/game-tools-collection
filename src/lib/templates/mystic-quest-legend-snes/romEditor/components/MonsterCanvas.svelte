<script lang="ts">
  import { onDestroy, onMount } from "svelte";

  import { dataView } from "$lib/stores";
  import { getInt } from "$lib/utils/bytes";
  import Canvas from "$lib/utils/canvas";
  import { getPalette } from "$lib/utils/graphics";

  import { monsterPalettesOffset, pointerToMonsterGraphics } from "../template";
  import {
    generateMonsterCanvas,
    getMonsterSpritePattern,
    getMonsterSpriteSize,
    pointerToOffset,
  } from "../utils";

  export let monsterIndex: number;

  let canvasEl: HTMLDivElement;

  let canvas: Canvas;

  function updateCanvas(): void {
    const [width, height] = getMonsterSpriteSize(monsterIndex);

    const graphicsOffset = pointerToOffset(pointerToMonsterGraphics);

    const spriteOffset = pointerToOffset(
      graphicsOffset + monsterIndex * 0x5,
      0xbf,
    );

    const paletteIndex = getInt(
      graphicsOffset + 0x3 + monsterIndex * 0x5,
      "uint8",
    );

    const palette = getPalette(
      "BGR555",
      monsterPalettesOffset + paletteIndex * 0x10,
      0x8,
      { firstTransparent: true },
    );

    const pattern = getMonsterSpritePattern(monsterIndex, width, height);

    generateMonsterCanvas(
      canvas,
      spriteOffset,
      palette,
      width,
      height,
      pattern,
    );
  }

  onMount(() => {
    canvas = new Canvas({ canvasEl });

    canvas.addLayer("background", "image");
  });

  onDestroy(() => {
    canvas.destroy();
  });

  $: {
    ($dataView, monsterIndex);

    if (canvas) {
      updateCanvas();
    }
  }
</script>

<div class="gtc-monstercanvas">
  <div bind:this={canvasEl}></div>
</div>

<style lang="postcss">
  .gtc-monstercanvas {
    @apply mr-4 w-fit self-start rounded bg-primary-700 p-2;
  }
</style>
