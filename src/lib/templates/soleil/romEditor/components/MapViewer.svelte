<script lang="ts">
  import { onDestroy, onMount } from "svelte";

  import Checkbox from "$lib/components/Checkbox.svelte";
  import { isDebug } from "$lib/stores";
  import Canvas from "$lib/utils/canvas";
  import { capitalize } from "$lib/utils/format";

  import SMap from "../utils/map";

  export let roomIndex: number;

  let canvasEl: HTMLDivElement;
  let canvasPalettesEl: HTMLDivElement;
  let canvasTilesEl: HTMLDivElement;

  let canvas: Canvas;
  let canvasPalettes: Canvas;
  let canvasTiles: Canvas;

  function handleLayerVisibilityChange(event: Event, layer: string): void {
    if ((event.target as HTMLInputElement).checked) {
      canvas.showLayer(layer);
    } else {
      canvas.hideLayer(layer);
    }
  }

  function updateCanvas(): void {
    const map = new SMap(roomIndex);

    if ($isDebug) {
      map.renderDebugPalettes(canvasPalettes);
      map.renderDebugTiles(canvasTiles);
    }

    map.renderMap(canvas);
  }

  onMount(() => {
    canvas = new Canvas({ canvasEl });

    canvas.addLayer("background", "image");
    canvas.addLayer("sprites", "image", { hidden: true });

    if ($isDebug) {
      canvasPalettes = new Canvas({
        canvasEl: canvasPalettesEl,
        width: 128,
        height: 32,
      });

      canvasTiles = new Canvas({
        canvasEl: canvasTilesEl,
        width: 128,
        height: 1024,
      });

      canvasPalettes.addLayer("palettes", "image");
      canvasTiles.addLayer("tiles", "image");
    }

    updateCanvas();
  });

  onDestroy(() => {
    canvas.destroy();

    if ($isDebug) {
      canvasPalettes.destroy();
      canvasTiles.destroy();
    }
  });

  $: {
    roomIndex;

    if (canvas) {
      updateCanvas();
    }
  }
</script>

<div class="gtc-mapviewer">
  {#if $isDebug}
    <div class="gtc-mapviewer-inputs">
      <div class="gtc-mapviewer-layers">
        <p>Layers</p>
        <div>
          {#each ["background", "sprites"] as layer}
            <Checkbox
              label={capitalize(layer)}
              checked={canvas?.getLayerVisibility(layer)}
              onChange={(event) => handleLayerVisibilityChange(event, layer)}
            />
          {/each}
        </div>
      </div>
    </div>
  {/if}
  <div>
    {#if $isDebug}
      <div class="gtc-mapviewer-canvasdebug">
        <div class="gtc-mapviewer-canvaspalettes">
          <div bind:this={canvasPalettesEl}></div>
        </div>
        <div class="gtc-mapviewer-canvastiles">
          <div bind:this={canvasTilesEl}></div>
        </div>
      </div>
    {/if}
    <div class="gtc-mapviewer-canvas">
      <div bind:this={canvasEl}></div>
    </div>
  </div>
</div>

<style lang="postcss">
  .gtc-mapviewer {
    & > div {
      @apply flex;
    }

    & .gtc-mapviewer-inputs {
      @apply flex;

      & .gtc-mapviewer-layers {
        @apply mb-4 mr-4 w-fit rounded bg-primary-700 p-2;

        & p {
          @apply mb-2 text-sm font-bold;
        }

        & div {
          @apply flex;

          & :global(label) {
            @apply mr-4;
          }
        }
      }
    }

    & .gtc-mapviewer-canvasdebug > div,
    & .gtc-mapviewer-canvas {
      @apply w-fit self-start rounded bg-primary-700 p-2;
    }

    & .gtc-mapviewer-canvasdebug {
      @apply mr-4;

      & .gtc-mapviewer-canvaspalettes {
        @apply mb-4;
      }
    }
  }
</style>
