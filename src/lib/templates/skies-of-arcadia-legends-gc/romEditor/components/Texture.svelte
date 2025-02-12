<script lang="ts">
  import { onDestroy, onMount } from "svelte";

  import Canvas from "$lib/utils/canvas";
  import { getGvrTexture } from "$lib/utils/common/gamecube";

  export let dataView: DataView;

  let canvasEl: HTMLDivElement;

  let canvas: Canvas;

  async function updateCanvas(): Promise<void> {
    canvas.reset();

    const texture = getGvrTexture(canvas, dataView);

    canvas.resize(texture.width, texture.height);

    canvas.addGraphic("texture", texture.data, texture.width, texture.height);

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
    dataView;

    if (canvas) {
      updateCanvas();
    }
  }
</script>

<div class="gtc-texture">
  <div bind:this={canvasEl} />
</div>

<style lang="postcss">
</style>
