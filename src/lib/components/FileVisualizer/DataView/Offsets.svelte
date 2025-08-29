<script lang="ts">
  import {
    rows,
    rowsOffset,
    selectedDataView,
    selectedOffset,
    selectedView,
  } from "$lib/stores/fileVisualizer";

  function handleViewClick(): void {
    $selectedView = "hexview";
  }

  function handleOffsetClick(offset: number): void {
    $selectedOffset = offset;
  }
</script>

<!-- svelte-ignore a11y-click-events-have-key-events -->
<!-- svelte-ignore a11y-no-static-element-interactions -->
<div class="gtc-filevisualizer-offsets" on:mousedown={handleViewClick}>
  {#each [...Array(Math.ceil($rows)).keys()] as index}
    {@const offset = $rowsOffset * 0x10 + index * 0x10}
    {#if offset < $selectedDataView.byteLength}
      <div on:click={() => handleOffsetClick(offset)}>
        {offset.toHex(8)}
      </div>
    {/if}
  {/each}
</div>

<style lang="postcss">
  .gtc-filevisualizer-offsets {
    @apply bg-primary-500 px-2 text-center text-sm text-gray-500;

    width: 95px;

    div {
      @apply font-source;

      height: 20px;
    }
  }
</style>
