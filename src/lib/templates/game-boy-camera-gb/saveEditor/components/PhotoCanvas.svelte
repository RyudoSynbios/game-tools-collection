<script lang="ts">
  import { onDestroy, onMount } from "svelte";

  import { getInt } from "$lib/utils/bytes";
  import Canvas from "$lib/utils/canvas";
  import { applyPalette } from "$lib/utils/graphics";

  import type { Palette } from "$lib/types";

  export let photoIndex: number;

  let canvasEl: HTMLDivElement;

  let canvas: Canvas;

  const palette: Palette = [
    [0xff, 0xff, 0xff, 0xff],
    [0x55, 0x55, 0x55, 0xff],
    [0xaa, 0xaa, 0xaa, 0xff],
    [0x0, 0x0, 0x0, 0xff],
  ];

  function updateCanvas(): void {
    canvas.reset();

    for (let row = 0x0; row < 0xe; row += 0x1) {
      for (let column = 0x0; column < 0x10; column += 0x1) {
        const tileData = [];

        for (let tile = 0x0; tile < 0x8; tile += 0x1) {
          const offset =
            0x2000 +
            photoIndex * 0x1000 +
            row * 0x100 +
            column * 0x10 +
            tile * 0x2;

          const int = getInt(offset, "uint16");

          let mask = 0x80;

          while (mask > 0x0) {
            const color1 = ((int >> 0x8) & mask) !== 0x0 ? 1 : 0;
            const color2 = (int & mask) !== 0x0 ? 2 : 0;

            tileData.push(color1 + color2);

            mask >>= 0x1;
          }
        }

        const data = applyPalette(tileData, palette);

        canvas.addGraphic("background", data, 8, 8, column * 8, row * 8);
      }
    }

    canvas.render();
  }

  onMount(() => {
    canvas = new Canvas({
      canvasEl,
      width: 128,
      height: 112,
    });

    canvas.addLayer("background", "image");

    updateCanvas();
  });

  onDestroy(() => {
    canvas.destroy();
  });

  $: {
    photoIndex;

    if (canvas) {
      updateCanvas();
    }
  }
</script>

<div class="gtc-photocanvas">
  <div bind:this={canvasEl}></div>
</div>

<style lang="postcss">
  .gtc-photocanvas {
    @apply mb-4 mr-4 w-fit rounded bg-primary-700 p-2;
  }
</style>
