<script lang="ts">
  import WarningIcon from "$lib/assets/Warning.svelte";
  import {
    dataJson,
    dataView,
    debugOptions,
    gameUtils,
    isDebug,
  } from "$lib/stores";
  import { utilsExists } from "$lib/utils/format";

  import type { ItemMessage } from "$lib/types";

  export let item: ItemMessage;

  $: {
    ($dataJson, $dataView);

    if (utilsExists("overrideItem")) {
      item = $gameUtils.overrideItem(item);
    }
  }
</script>

{#if !item.hidden || ($isDebug && $debugOptions.showHiddenItems)}
  <div class="gtc-message" class:gtc-message-debug={item.hidden}>
    <WarningIcon />
    <p>{@html item.message}</p>
  </div>
{/if}

<style lang="postcss">
  .gtc-message {
    @apply mb-4 flex h-fit w-full items-center rounded bg-amber-900 p-2 text-sm text-amber-500;

    &.gtc-message-debug {
      @apply bg-orange-950 text-orange-800;
    }

    & :global(svg) {
      @apply h-5;
    }

    & p {
      @apply ml-2;
    }
  }
</style>
