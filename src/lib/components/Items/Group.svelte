<script lang="ts">
  import Int from "$lib/components/Items/Int.svelte";
  import { isDebug } from "$lib/stores";

  import type { ItemGroup } from "$lib/types";

  export let item: ItemGroup;
</script>

{#if !item.hidden || $isDebug}
  <div class="gtc-group" class:gtc-group-debug={item.hidden}>
    {#if item.name}
      <p>{@html item.name}</p>
    {/if}
    <div
      class="gtc-group-content"
      class:gtc-group-content-chrono={item.mode === "chrono"}
    >
      {#each item.items as subitem, index}
        {#if ["bit", "lower4", "upper4", "int8", "int16", "int24", "int32", "int64", "uint8", "uint16", "uint24", "uint32", "uint64", "float32"].includes(subitem.dataType)}
          <Int item={{ ...subitem, hidden: item.hidden }} />
          {#if item.mode === "chrono" && index === 0}
            <span>'</span>
          {:else if item.mode === "chrono" && index === 1}
            <span>"</span>
          {:else if item.mode === "fraction"}
            <span>/</span>
          {:else if item.mode === "time"}
            <span>:</span>
          {:else}
            <span />
          {/if}
        {/if}
      {/each}
    </div>
  </div>
{/if}

<style lang="postcss">
  .gtc-group {
    @apply mr-4 mb-4 w-fit bg-primary-700 rounded;

    min-width: 196px;

    &.gtc-group-debug {
      @apply text-orange-800 bg-orange-950;
    }

    & p {
      @apply px-2 pt-2 text-sm font-bold;
    }

    & .gtc-group-content {
      @apply flex items-center;

      &.gtc-group-content-chrono {
        @apply items-start;
      }

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
