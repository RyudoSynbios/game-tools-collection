<script lang="ts">
  import Int from "$lib/components/Items/Int.svelte";
  import { dataView, gameUtils, isDebug } from "$lib/stores";
  import { utilsExists } from "$lib/utils/format";

  import type { ItemGroup } from "$lib/types";

  interface Props {
    item: ItemGroup;
  }

  let { item }: Props = $props();

  const group: ItemGroup = $derived.by(() => {
    $dataView;

    if (utilsExists("overrideItem")) {
      return $gameUtils.overrideItem(item);
    }

    return item;
  });
</script>

{#if !group.hidden || $isDebug}
  <div class="gtc-group" class:gtc-group-debug={group.hidden}>
    {#if group.name}
      <div class="gtc-group-label">
        <p>{@html group.name}</p>
        {#if group.hint}
          <span data-title={group.hint}>?</span>
        {/if}
      </div>
    {/if}
    <div
      class="gtc-group-content"
      class:gtc-group-content-chrono={group.mode === "chrono"}
    >
      {#each group.items as subitem, index}
        {#if ["bit", "lower4", "upper4", "int8", "int16", "int24", "int32", "int64", "uint8", "uint16", "uint24", "uint32", "uint64", "float32"].includes(subitem.dataType)}
          <Int item={{ ...subitem, hidden: Boolean(group.hidden) }} />
          {#if group.mode === "chrono" && index === 0}
            <span>'</span>
          {:else if group.mode === "chrono" && index === 1}
            <span>"</span>
          {:else if group.mode === "date" && index < 2}
            <span>/</span>
          {:else if group.mode === "date" && index >= 3}
            <span>:</span>
          {:else if group.mode === "fraction"}
            <span>/</span>
          {:else if group.mode === "time"}
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
  @reference "../../../app.css";

  .gtc-group {
    @apply bg-primary-700 mr-4 mb-4 h-fit w-fit rounded;

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
        @apply bg-primary-400 mt-2 w-5 cursor-pointer rounded text-center text-sm font-bold;
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
