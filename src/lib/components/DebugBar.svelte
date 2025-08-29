<script lang="ts">
  import ChecksumsIcon from "$lib/assets/Checksums.svelte";
  import CloseIcon from "$lib/assets/Close.svelte";
  import ManageSearchIcon from "$lib/assets/ManageSearch.svelte";
  import {
    dataView,
    debugOptions,
    gameJson,
    isDebug,
    isFileVisualizerOpen,
  } from "$lib/stores";
  import { updateChecksums } from "$lib/utils/checksum";
  import { setLocalStorage } from "$lib/utils/format";

  function handleExitDebugMode(): void {
    $isDebug = false;
    setLocalStorage("debug", "false");
  }

  function handleFileChecksum(): void {
    updateChecksums();
  }

  function handleFileVisualizerOpen(): void {
    $isFileVisualizerOpen = true;
  }

  function handleOptionToggle(option: string): void {
    window.debugGTC.toggleTool(option);
  }
</script>

<div class="gtc-debugbar">
  <div>
    <button
      type="button"
      on:click={() => handleOptionToggle("showHiddenItems")}
    >
      Hidden Items
      <input type="checkbox" checked={$debugOptions.showHiddenItems} />
    </button>
    <button
      type="button"
      on:click={() => handleOptionToggle("showInputOffsets")}
    >
      Input Offsets
      <input type="checkbox" checked={$debugOptions.showInputOffsets} />
    </button>
    <button
      type="button"
      on:click={() => handleOptionToggle("showInputValues")}
    >
      Input Values
      <input type="checkbox" checked={$debugOptions.showInputValues} />
    </button>
    <button type="button" on:click={() => handleOptionToggle("showTabIndexes")}>
      Tab Indexes
      <input type="checkbox" checked={$debugOptions.showTabIndexes} />
    </button>
  </div>
  <div>
    {#if $dataView.byteLength > 0}
      <button type="button" on:click={handleFileVisualizerOpen}>
        <ManageSearchIcon /> File Visualizer
      </button>
    {/if}
    {#if $gameJson.checksums && $gameJson.checksums.length > 0}
      <button type="button" on:click={handleFileChecksum}>
        <ChecksumsIcon /> Checksums
      </button>
    {/if}
    <button type="button" on:click={handleExitDebugMode}>
      <CloseIcon />
    </button>
  </div>
</div>

<style lang="postcss">
  .gtc-debugbar {
    @apply fixed inset-x-0 bottom-0 z-10 flex h-12 justify-between bg-primary-900/50 p-2;

    & > div {
      @apply flex;

      &:first-child button:first-child {
        @apply ml-0;
      }

      &:last-child button:last-child :global(svg) {
        @apply mr-0;
      }

      & button {
        @apply ml-2 flex items-center px-3 py-1.5 text-xs;

        & input[type="checkbox"] {
          @apply ml-2 cursor-pointer accent-primary-400;
        }

        & :global(svg) {
          @apply mr-1 h-5;
        }
      }
    }
  }
</style>
