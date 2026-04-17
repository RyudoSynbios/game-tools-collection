<script lang="ts">
  import { onDestroy, onMount } from "svelte";

  import { dataView } from "$lib/stores";
  import Canvas from "$lib/utils/canvas";

  import { getIcon } from "../utils/image";

  export let itemIndex: number;

  let canvasEl: HTMLDivElement;

  let canvas: Canvas;

  function updateCanvas(): void {
    canvas.resize(24, 24);

    const icon = getIcon("item", itemIndex);

    canvas.addGraphic("sprite", icon, 24, 24);

    canvas.render();
  }

  onMount(() => {
    canvas = new Canvas({ canvasEl, scale: 2 });

    canvas.addLayer("sprite", "image");
  });

  onDestroy(() => {
    canvas.destroy();
  });

  $: {
    ($dataView, itemIndex);

    if (canvas) {
      updateCanvas();
    }
  }
</script>

<div class="gtc-iconcanvas">
  <div bind:this={canvasEl}></div>
</div>

<style lang="postcss">
  .gtc-iconcanvas {
    @apply mr-4 w-fit self-start rounded bg-primary-700 p-3.5;
  }
</style>
