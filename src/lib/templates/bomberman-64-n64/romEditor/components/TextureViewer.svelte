<script lang="ts">
  import { onDestroy, onMount } from "svelte";

  import Canvas from "$lib/utils/canvas";
  import { generateGraphicsSheet } from "$lib/utils/graphics";

  interface Props {
    textures: {
      width: number;
      height: number;
      texture: Uint8Array;
    }[];
  }

  let { textures }: Props = $props();

  let canvasEl = $state<HTMLDivElement>()!;

  let innerWidth = $state(0);
  let canvas = $state<Canvas>()!;

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

  $effect(() => {
    if (canvas) {
      updateCanvas();
    }
  });
</script>

<svelte:window bind:innerWidth />

<div class="gtc-textureviewer">
  <div bind:this={canvasEl}></div>
</div>

<style lang="postcss">
  @reference "../../../../../app.css";

  .gtc-textureviewer {
    @apply h-full overflow-auto;
  }
</style>
