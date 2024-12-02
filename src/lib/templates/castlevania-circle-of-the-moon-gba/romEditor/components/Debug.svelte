<script lang="ts">
  import { onDestroy, onMount } from "svelte";

  import { getInt } from "$lib/utils/bytes";
  import Canvas from "$lib/utils/canvas";
  import { getRegionArray } from "$lib/utils/format";
  import { applyPalette, getPalette } from "$lib/utils/graphics";

  import { pointerToDssCardsGraphics } from "../template";
  import { getDecompressedGraphic } from "../utils";

  let canvasEl: HTMLDivElement;

  let canvas: Canvas;

  onMount(() => {
    canvas = new Canvas({
      canvasEl,
      width: 640,
      height: 192,
    });

    canvas.addLayer("background", "image");

    const dssCardsGraphicsPointer = getRegionArray(pointerToDssCardsGraphics);

    for (let i = 0x0; i < 0x14; i += 0x1) {
      const graphicOffset = getInt(dssCardsGraphicsPointer + i * 0x4, "uint24");
      const paletteOffset = getInt(
        dssCardsGraphicsPointer + 0x50 + i * 0x4,
        "uint24",
      );

      const graphic = getDecompressedGraphic(graphicOffset);
      const palette = getPalette("BGR555", paletteOffset, 0x10, {
        firstTransparent: true,
      });

      graphic.forEach((tileData, index) => {
        const tile = applyPalette(tileData, palette);

        const x = (i % 0xa) * 0x40 + (index % 0x8) * 0x8;
        const y = Math.floor(i / 0xa) * 0x60 + Math.floor(index / 0x8) * 0x8;

        canvas.addGraphic("background", tile, 8, 8, x, y);
      });
    }

    canvas.render();
  });

  onDestroy(() => {
    canvas.destroy();
  });
</script>

<div class="gtc-debug">
  <div bind:this={canvasEl} />
</div>

<style lang="postcss">
</style>
