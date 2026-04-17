<script lang="ts">
  import { onDestroy, onMount } from "svelte";

  import Checkbox from "$lib/components/Checkbox.svelte";
  import Select from "$lib/components/Select.svelte";
  import { isDebug } from "$lib/stores";
  import Canvas from "$lib/utils/canvas";
  import { capitalize } from "$lib/utils/format";

  import CCOTMMap from "../utils/map";

  export let roomIndex: number;

  let canvasEl: HTMLDivElement;
  let canvasPalettesEl: HTMLDivElement;
  let canvasTilesEl: HTMLDivElement;

  let canvas: Canvas;
  let canvasPalettes: Canvas;
  let canvasTiles: Canvas;

  let enemySet = 0;

  function handleLayerVisibilityChange(event: Event, layer: string): void {
    if ((event.target as HTMLInputElement).checked) {
      canvas.showLayer(layer);
    } else {
      canvas.hideLayer(layer);
    }
  }

  function handleEnemySetChange(event: Event): void {
    enemySet = parseInt((event.target as HTMLInputElement).value);

    updateCanvas();
  }

  function updateCanvas(): void {
    const map = new CCOTMMap(roomIndex, enemySet);

    if ($isDebug) {
      map.renderDebugPalettes(canvasPalettes);
      map.renderDebugTiles(canvasTiles);
    }

    map.renderMap(canvas);
  }

  onMount(() => {
    canvas = new Canvas({ canvasEl });

    canvas.addLayer("background1", "image", { order: 2 });
    canvas.addLayer("background2", "image", { order: 1 });
    canvas.addLayer("collisions", "image", { hidden: true });
    canvas.addLayer("sprites", "image");
    canvas.addLayer("enemies", "image");

    if ($isDebug) {
      canvasPalettes = new Canvas({
        canvasEl: canvasPalettesEl,
        width: 264,
        height: 128,
      });

      canvasTiles = new Canvas({
        canvasEl: canvasTilesEl,
        width: 264,
        height: 2048,
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
        {#each ["background1", "background2", "collisions", "sprites", "enemies"] as layer}
          <Checkbox
            label={capitalize(layer)}
            checked={canvas?.getLayerVisibility(layer)}
            onChange={(event) => handleLayerVisibilityChange(event, layer)}
          />
        {/each}
      </div>
    </div>
    <Select
      label="Enemy Set"
      type="number"
      value={enemySet}
      options={[
        { key: "0", value: "Set A" },
        { key: "1", value: "Set B" },
      ]}
      onChange={handleEnemySetChange}
    />
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
