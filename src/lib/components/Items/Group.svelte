<script lang="ts">
  import Int from "$lib/components/Items/Int.svelte";
  import { dataView, gameUtils, isDebug } from "$lib/stores";
  import { utilsExists } from "$lib/utils/format";

  import type { ItemGroup } from "$lib/types";

  export let item: ItemGroup;

  $: {
    $dataView;

    if (utilsExists("overrideItem")) {
      item = $gameUtils.overrideItem(item);
    }
  }
</script>

{#if !item.hidden || $isDebug}
  <div class="gtc-group" class:gtc-group-debug={item.hidden}>
    {#if item.name}
      <div class="gtc-group-label">
        <p>{@html item.name}</p>
        {#if item.hint}
          <span data-title={item.hint}>?</span>
        {/if}
      </div>
    {/if}
    <div
      class="gtc-group-content"
      class:gtc-group-content-chrono={item.mode === "chrono"}
    >
      {#each item.items as subitem, index}
        {#if ["bit", "lower4", "upper4", "int8", "int16", "int24", "int32", "int64", "uint8", "uint16", "uint24", "uint32", "uint64", "float32"].includes(subitem.dataType)}
          <Int item={{ ...subitem, hidden: Boolean(item.hidden) }} />
          {#if item.mode === "chrono" && index === 0}
            <span>'</span>
          {:else if item.mode === "chrono" && index === 1}
            <span>"</span>
          {:else if item.mode === "date" && index < 2}
            <span>/</span>
          {:else if item.mode === "date" && index >= 3}
            <span>:</span>
          {:else if item.mode === "fraction"}
            <span>/</span>
          {:else if item.mode === "time"}
            <span>:</span>
          {:else}
            <span></span>
          {/if}
        {/if}
      {/each}
    </div>
  </div>
{/if}

<style lang="postcss">
  .gtc-group {
    @apply mb-4 mr-4 h-fit w-fit rounded bg-primary-700;

    min-width: 196px;

    &.gtc-group-debug {
      @apply bg-orange-950 text-orange-800;
    }

    & .gtc-group-label {
      @apply flex items-center justify-between px-2;

      & p {
        @apply mt-2 text-sm font-bold;
      }

      & span {
        @apply mt-2 w-5 cursor-pointer rounded bg-primary-400 text-center text-sm font-bold;
      }
    }

    & .gtc-group-content {
      @apply flex items-center;

      &.gtc-group-content-chrono {
        @apply items-start;
      }

      & :global(.gtc-autocomplete),
      & :global(.gtc-input),
      & :global(.gtc-select) {
        @apply m-0;

        & :global(input[type="number"]),
        & :global(select) {
          width: initial;
        }

        & :global(select) {
          min-width: 58px;
        }
      }

      & span {
        @apply text-white;
      }

      & span:last-of-type {
        @apply hidden;
      }
    }
  }
</style>
