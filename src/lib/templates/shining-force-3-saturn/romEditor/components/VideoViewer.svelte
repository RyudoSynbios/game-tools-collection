<script lang="ts">
  import { onDestroy, onMount } from "svelte";

  import Canvas from "$lib/utils/canvas";
  import { getFileData } from "../utils";
  import { isCpk, unpackCpk } from "$lib/utils/common/saturn";

  export let assetIndex: number;

  let canvasEl: HTMLDivElement;

  let canvas: Canvas;

  function updateCanvas(): void {
    const dataView = getFileData("video", assetIndex);

    if (isCpk(dataView)) {
      const cpk = unpackCpk(dataView);

      console.log(cpk);
    }

    canvas.render();
  }

  onMount(() => {
    canvas = new Canvas({ canvasEl });

    canvas.addLayer("sprite", "image");

    updateCanvas();
  });

  onDestroy(() => {
    canvas.destroy();
  });

  $: {
    assetIndex;

    if (canvas) {
      updateCanvas();
    }
  }
</script>

<div class="gtc-videoviewer">
  <div bind:this={canvasEl} />
</div>

<style lang="postcss">
  .gtc-videoviewer {
    @apply self-start p-2 w-fit bg-primary-700 rounded;
  }
</style>
