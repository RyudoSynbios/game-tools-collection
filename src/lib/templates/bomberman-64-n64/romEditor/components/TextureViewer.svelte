<script lang="ts">
  import { onDestroy, onMount } from "svelte";

  import Canvas from "$lib/utils/canvas";
  import { generateGraphicsSheet } from "$lib/utils/graphics";

  export let textures: {
    width: number;
    height: number;
    texture: Uint8Array;
  }[];

  let canvasEl: HTMLDivElement;

  let innerWidth = 0;
  let canvas: Canvas;

  async function updateCanvas(): Promise<void> {
    const width = Math.min(innerWidth - 104, 1024);

    const sheet = generateGraphicsSheet(width, textures);

    canvas.resize(sheet.width, sheet.height);

    textures.forEach((texture, index) => {
      canvas.addGraphic(
        "texture",
        texture.texture,
        texture.width,
        texture.height,
        sheet.coordinates[index].x,
        sheet.coordinates[index].y,
      );
    });

    canvas.render();
  }

  onMount(async () => {
    canvas = new Canvas({ canvasEl });

    canvas.addLayer("texture", "image");

    updateCanvas();
  });

  onDestroy(() => {
    canvas.destroy();
  });

  $: {
    innerWidth;

    if (canvas) {
      updateCanvas();
    }
  }
</script>

<svelte:window bind:innerWidth />

<div class="gtc-textureviewer">
  <div bind:this={canvasEl} />
</div>

<style lang="postcss">
  .gtc-textureviewer {
    @apply h-full overflow-auto;
  }
</style>
