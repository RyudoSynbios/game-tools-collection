<script lang="ts">
  import { onDestroy, onMount } from "svelte";

  import Canvas from "$lib/utils/canvas";
  import { isCpk, unpackCpk } from "$lib/utils/common/saturn";

  import { getFileData } from "../utils";

  export let assetIndex: number;

  let canvasEl: HTMLDivElement;

  let canvas: Canvas;

  async function updateCanvas(): Promise<void> {
    const dataView = getFileData("video", assetIndex);

    if (isCpk(dataView)) {
      const cpk = unpackCpk(dataView);

      console.log(cpk);
    }

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
    @apply w-fit self-start rounded bg-primary-700 p-2;
  }
</style>
