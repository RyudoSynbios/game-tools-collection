<script lang="ts">
  import {
    rows,
    rowsOffset,
    selectedDataView,
    selectedView,
    tooltipEl,
  } from "$lib/stores/fileVisualizer";
  import { getInt } from "$lib/utils/bytes";
  import { getCellsNumber } from "$lib/utils/fileVisualizer";

  import Cell from "./Cell.svelte";

  export let view: "hexview" | "charview";

  const cellType = view === "hexview" ? "hex" : "char";

  let cellsNumber = 0;

  function handleMouseOut(): void {
    $tooltipEl.innerHTML = "";
  }

  function handleViewClick(): void {
    $selectedView = view;
  }

  $: ($rows, $selectedDataView, (cellsNumber = getCellsNumber()));
</script>

<!-- svelte-ignore a11y-no-static-element-interactions -->
<div
  class="gtc-filevisualizer-cellsgrid gtc-filevisualizer-cellsgrid-{view}"
  class:gtc-filevisualizer-selected={$selectedView === view}
  on:blur={handleMouseOut}
  on:mousedown={handleViewClick}
  on:mouseout={handleMouseOut}
>
  {#each [...Array(cellsNumber).keys()] as index}
    {@const offset = $rowsOffset * 16 + index}
    {#if offset < $selectedDataView.byteLength}
      {@const int = getInt(offset, "uint8", {}, $selectedDataView)}
      <Cell type={cellType} {offset}>
        {view === "hexview"
          ? int.toHex(2).toUpperCase()
          : String.fromCharCode(int)}
      </Cell>
    {/if}
  {/each}
</div>

<style lang="postcss">
  .gtc-filevisualizer-cellsgrid {
    @apply flex flex-shrink-0 flex-wrap content-start px-2;

    &.gtc-filevisualizer-cellsgrid-hexview {
      width: 464px;

      & :global(.gtc-filevisualizer-cell.gtc-filevisualizer-cell-selected) {
        @apply text-white;
      }

      & :global(.gtc-filevisualizer-cell:nth-child(8n)) {
        @apply border-r border-gray-600;
      }

      & :global(.gtc-filevisualizer-cell-highlighted:nth-child(8n)) {
        @apply border-gray-400;
      }

      & :global(.gtc-filevisualizer-cell:nth-child(16n)) {
        @apply border-r-0;
      }
    }

    &.gtc-filevisualizer-cellsgrid-charview {
      width: 176px;
    }
  }
</style>
