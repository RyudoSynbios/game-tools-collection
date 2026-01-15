<script lang="ts">
  import { onDestroy, onMount } from "svelte";

  import Checkbox from "$lib/components/Checkbox.svelte";
  import { isDebug } from "$lib/stores";
  import Canvas from "$lib/utils/canvas";
  import { capitalize } from "$lib/utils/format";

  import CTMap from "../utils/map";

  export let roomIndex: number;

  let canvasEl: HTMLDivElement;
  let canvasPalettesEl: HTMLDivElement;
  let canvasTilesEl: HTMLDivElement;

  let canvas: Canvas;
  let canvasPalettes: Canvas;
  let canvasTiles: Canvas;

  function handleFilterStatysChange(event: Event): void {
    if ((event.target as HTMLInputElement).checked) {
      canvas.enableFilter();
    } else {
      canvas.disableFilter();
    }
  }

  function handleLayerVisibilityChange(event: Event, layer: string): void {
    if ((event.target as HTMLInputElement).checked) {
      canvas.showLayer(`${layer}H`);
      canvas.showLayer(`${layer}L`);
    } else {
      canvas.hideLayer(`${layer}H`);
      canvas.hideLayer(`${layer}L`);
    }
  }

  function updateCanvas(): void {
    const map = new CTMap(roomIndex);

    if ($isDebug) {
      map.renderDebugPalettes(canvasPalettes);
      map.renderDebugTiles(canvasTiles);
    }

    map.renderMap(canvas);
  }

  onMount(() => {
    canvas = new Canvas({
      canvasEl,
      filter: true,
    });

    canvas.addLayer("background1H", "image", { order: 5 });
    canvas.addLayer("background2H", "image", { order: 4 });
    canvas.addLayer("background1L", "image", { order: 3 });
    canvas.addLayer("background2L", "image", { order: 2 });
    canvas.addLayer("background3H", "image", { hidden: true, order: 1 });
    canvas.addLayer("background3L", "image", { hidden: true, order: 0 });

    if ($isDebug) {
      canvasPalettes = new Canvas({
        canvasEl: canvasPalettesEl,
      });

      canvasTiles = new Canvas({
        canvasEl: canvasTilesEl,
        backgroundAlpha: 1,
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
  <div class="gtc-mapviewer-inputs">
    <div class="gtc-mapviewer-layers">
      <p>Layers</p>
      <div>
        {#each ["background1", "background2", "background3"] as layer}
          <Checkbox
            label={capitalize(layer)}
            checked={canvas?.getLayerVisibility(`${layer}H`)}
            disabled={layer === "background3"}
            onChange={(event) => handleLayerVisibilityChange(event, layer)}
          />
        {/each}
      </div>
    </div>
    <div class="gtc-mapviewer-options">
      <p>Options</p>
      <div>
        <Checkbox
          label="Highlight View Area"
          checked={canvas?.getFilterStatus()}
          onChange={(event) => handleFilterStatysChange(event)}
        />
      </div>
    </div>
  </div>
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

      & .gtc-mapviewer-layers,
      & .gtc-mapviewer-options {
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
