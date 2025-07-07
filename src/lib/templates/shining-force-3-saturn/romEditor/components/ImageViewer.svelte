<script lang="ts">
  import { onDestroy, onMount } from "svelte";

  import Canvas from "$lib/utils/canvas";
  import { generateGraphicsSheet } from "$lib/utils/graphics";

  import { getImagesCanvas } from "../utils/image";

  interface Props {
    assetIndex: number;
    type: "image" | "sprite";
  }

  let { assetIndex, type }: Props = $props();

  let canvasEl = $state<HTMLDivElement>()!;

  let canvas = $state<Canvas>()!;

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

  $effect(() => {
    if (canvas) {
      updateCanvas();
    }
  });
</script>

<div class="gtc-imageviewer">
  <div bind:this={canvasEl}></div>
</div>

<style lang="postcss">
  @reference "../../../../../app.css";

  .gtc-imageviewer {
    @apply bg-primary-700 w-fit self-start rounded p-2;
  }
</style>
