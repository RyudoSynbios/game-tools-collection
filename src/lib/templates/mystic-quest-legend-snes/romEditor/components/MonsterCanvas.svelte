<script lang="ts">
  import { onDestroy, onMount } from "svelte";

  import { dataView } from "$lib/stores";
  import { getInt } from "$lib/utils/bytes";
  import Canvas from "$lib/utils/canvas";
  import { getPalette15Bit } from "$lib/utils/graphics";

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

    const palette = getPalette15Bit(
      monsterPalettesOffset + paletteIndex * 0x10,
      0x8,
      true,
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
    $dataView;
    monsterIndex;

    if (canvas) {
      updateCanvas();
    }
  }
</script>

<div class="gtc-monstercanvas">
  <div bind:this={canvasEl} />
</div>

<style lang="postcss">
  .gtc-monstercanvas {
    @apply self-start mr-4 p-2 w-fit bg-primary-700 rounded;
  }
</style>
