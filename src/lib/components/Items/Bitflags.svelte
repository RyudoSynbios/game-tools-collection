<script lang="ts">
  import Checkbox from "$lib/components/Checkbox.svelte";
  import { dataView, gameUtils, isDebug } from "$lib/stores";
  import { getBitflag, setBitflag } from "$lib/utils/bytes";
  import { utilsExists } from "$lib/utils/format";

  import type {
    ItemBitflag,
    ItemBitflagDivider,
    ItemBitflags,
  } from "$lib/types";

  export let item: ItemBitflags;

  function handleInputChange(flag: ItemBitflag, event: Event): void {
    let isOverrided = false;

    if (utilsExists("overrideSetInt")) {
      isOverrided = $gameUtils.overrideSetInt(
        item,
        (event.target as HTMLInputElement).value,
      );
    }

    if (!isOverrided) {
      setBitflag(
        flag.offset,
        flag.bit,
        (event.target as HTMLInputElement).checked,
        { reversed: item.reversed },
      );
    }

    if (utilsExists("afterSetInt")) {
      $gameUtils.afterSetInt(item);
    }
  }

  let flags: (ItemBitflag | ItemBitflagDivider)[];

  $: {
    $dataView;

    flags = item.flags;
  }
</script>

{#if !item.hidden || $isDebug}
  <div
    class="gtc-bitflags"
    class:gtc-bitflags-debug={item.hidden && $isDebug}
    class:gtc-bitflags-nomargin={item.noMargin}
  >
    {#if item.name}
      <p>{@html item.name}</p>
    {/if}
    {#each flags as flag}
      {#if !("divider" in flag)}
        {#if !flag.hidden || $isDebug}
          <div
            class="gtc-bitflag"
            class:gtc-bitflag-debug={flag.hidden && $isDebug}
          >
            <Checkbox
              label={flag.name}
              checked={getBitflag(flag.offset, { reversed: item.reversed })[
                flag.bit
              ]}
              disabled={flag.disabled || item.disabled}
              onChange={(event) => handleInputChange(flag, event)}
            />
          </div>
        {/if}
      {:else}
        <p />
      {/if}
    {/each}
  </div>
{/if}

<style lang="postcss">
  .gtc-bitflags {
    @apply mr-4 mb-4 p-2 w-fit bg-primary-700 rounded;

    min-width: 200px;

    &.gtc-bitflags-debug {
      @apply text-orange-800 bg-orange-950;
    }

    &.gtc-bitflags-nomargin {
      @apply m-0 p-0;
    }

    & .gtc-bitflag {
      &.gtc-bitflag-debug {
        & :global(.gtc-checkbox) {
          @apply text-orange-800 bg-orange-950;
        }
      }
    }

    & p {
      @apply mb-2 text-sm font-bold;
    }
  }
</style>
