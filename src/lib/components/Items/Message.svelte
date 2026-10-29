<script lang="ts">
  import InfoIcon from "$lib/assets/Info.svelte";
  import WarningIcon from "$lib/assets/Warning.svelte";
  import {
    dataJson,
    dataView,
    dataViewAlt,
    debugOptions,
    gameUtils,
    isDebug,
  } from "$lib/stores";
  import { utilsExists } from "$lib/utils/format";

  import type { ItemMessage } from "$lib/types";

  export let item: ItemMessage;

  $: {
    ($dataJson, $dataView, $dataViewAlt);

    if (utilsExists("overrideItem")) {
      item = $gameUtils.overrideItem(item);
    }
  }
</script>

{#if !item.hidden || ($isDebug && $debugOptions.showHiddenItems)}
  <div
    class="gtc-message"
    class:gtc-message-debug={item.hidden}
    class:gtc-message-info={item.mode === "info"}
    class:gtc-message-warning={item.mode === "warning"}
  >
    {#if item.mode === "info"}
      <InfoIcon />
    {:else if item.mode === "warning"}
      <WarningIcon />
    {/if}
    <p>{@html item.message}</p>
  </div>
{/if}

<style lang="postcss">
  .gtc-message {
    @apply mb-4 flex h-fit w-full items-center rounded p-2 text-sm;

    &.gtc-message-debug {
      @apply !bg-orange-950 !text-orange-800;
    }

    &.gtc-message-info {
      @apply bg-blue-900 text-blue-500;
    }

    &.gtc-message-warning {
      @apply bg-amber-900 text-amber-500;
    }

    & :global(svg) {
      @apply h-5;
    }

    & p {
      @apply ml-2;
    }
  }
</style>
