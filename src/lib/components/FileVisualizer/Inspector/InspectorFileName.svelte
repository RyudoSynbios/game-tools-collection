<script lang="ts">
  import SettingsIcon from "$lib/assets/Settings.svelte";
  import { fileName } from "$lib/stores";
  import { options } from "$lib/stores/fileVisualizer";
  import { setLocalStorage } from "$lib/utils/format";

  import Toolbar from "./Toolbar.svelte";

  let toolbarOpen = false;

  function handleClick(): void {
    toolbarOpen = false;
  }

  function handleOption(option: string): void {
    $options[option] = !$options[option];

    setLocalStorage("fileVisualizerOptions", `${JSON.stringify($options)}`);
  }

  function handleToolbarToggle(): void {
    toolbarOpen = !toolbarOpen;
  }
</script>

<svelte:window on:click={handleClick} />

<!-- svelte-ignore a11y-click-events-have-key-events -->
<!-- svelte-ignore a11y-no-noninteractive-element-interactions -->
<Toolbar class="gtc-filevisualizer-inspectorfilename">
  <p>{$fileName}</p>
  <button type="button" on:click|stopPropagation={handleToolbarToggle}>
    <SettingsIcon />
  </button>
  {#if toolbarOpen}
    <ul
      class="gtc-filevisualizer-inspectorfilename-toolbar"
      on:click|stopPropagation
    >
      <li on:click={() => handleOption("zeroOpacity")}>
        <input type="checkbox" checked={$options.zeroOpacity} />
        Transparent 0x0 values
      </li>
    </ul>
  {/if}
</Toolbar>

<style lang="postcss">
  :global(
    .gtc-filevisualizer-inspectorfilename .gtc-filevisualizer-toolbar-content
  ) {
    @apply relative flex justify-between;

    & p {
      @apply overflow-hidden overflow-ellipsis text-xs font-normal;
    }

    & button {
      @apply rounded-l-[4px] p-0;

      & :global(svg) {
        @apply h-4 w-4;
      }
    }

    & .gtc-filevisualizer-inspectorfilename-toolbar {
      @apply absolute right-0 top-6 z-20 w-44 rounded bg-primary-500 py-1 text-xs shadow;

      & li {
        @apply flex cursor-pointer px-2 py-1;

        & input[type="checkbox"] {
          @apply mr-2 w-2.5 cursor-pointer accent-primary-400;
        }
      }
    }
  }
</style>
