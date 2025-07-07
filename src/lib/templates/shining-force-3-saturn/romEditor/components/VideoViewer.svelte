<script lang="ts">
  import { onDestroy, onMount } from "svelte";

  import Canvas from "$lib/utils/canvas";
  import { isCpk, unpackCpk } from "$lib/utils/common/saturn";

  import { getFileData } from "../utils";

  interface Props {
    assetIndex: number;
  }

  let { assetIndex }: Props = $props();

  let canvasEl = $state<HTMLDivElement>()!;

  let canvas = $state<Canvas>()!;

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

  $effect(() => {
    if (canvas) {
      updateCanvas();
    }
  });
</script>

<div class="gtc-videoviewer">
  <div bind:this={canvasEl}></div>
</div>

<style lang="postcss">
  @reference "../../../../../app.css";

  .gtc-videoviewer {
    @apply bg-primary-700 w-fit self-start rounded p-2;
  }
</style>
