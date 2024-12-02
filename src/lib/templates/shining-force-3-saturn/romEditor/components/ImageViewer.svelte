<script lang="ts">
  import { onDestroy, onMount } from "svelte";

  import Canvas from "$lib/utils/canvas";
  import { generateGraphicsSheet } from "$lib/utils/graphics";

  import { getImagesCanvas } from "../utils/image";

  export let assetIndex: number;
  export let type: "image" | "sprite";

  let canvasEl: HTMLDivElement;

  let canvas: Canvas;

  async function updateCanvas(): Promise<void> {
    const imagesCanvas = getImagesCanvas(assetIndex, type);

    const sheet = generateGraphicsSheet(
      imagesCanvas.width,
      imagesCanvas.images,
    );

    canvas.resize(sheet.width, sheet.height);

    imagesCanvas.images.forEach((image, index) => {
      canvas.addGraphic(
        "sprite",
        image.data,
        image.width,
        image.height,
        sheet.coordinates[index].x,
        sheet.coordinates[index].y,
      );
    });

    canvas.render();
  }

  onMount(async () => {
    canvas = new Canvas({ canvasEl });

    canvas.addLayer("sprite", "image");

    updateCanvas();
  });

  onDestroy(() => {
    canvas.destroy();
  });

  $: {
    assetIndex, type;

    if (canvas) {
      updateCanvas();
    }
  }
</script>

<div class="gtc-imageviewer">
  <div bind:this={canvasEl} />
</div>

<style lang="postcss">
  .gtc-imageviewer {
    @apply w-fit self-start rounded bg-primary-700 p-2;
  }
</style>
