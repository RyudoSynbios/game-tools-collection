<script lang="ts">
  import Checkbox from "$lib/components/Checkbox.svelte";
  import { dataView, gameUtils, isDebug } from "$lib/stores";
  import { getBitflag, setBitflag } from "$lib/utils/bytes";
  import { utilsExists } from "$lib/utils/format";

  import type { ItemBitflag, ItemBitflags } from "$lib/types";

  export let item: ItemBitflags;

  function handleInputChange(flag: ItemBitflag, event: Event): void {
    let isOverrided = false;

    if (utilsExists("overrideSetInt")) {
      isOverrided = $gameUtils.overrideSetInt(
        item,
        (event.target as HTMLInputElement).checked,
        flag,
      );
    }

    if (!isOverrided) {
      setBitflag(
        flag.offset,
        flag.bit,
        (event.target as HTMLInputElement).checked,
        { reversed: item.reversed || flag.reversed },
      );
    }

    if (utilsExists("afterSetInt")) {
      $gameUtils.afterSetInt(item, flag);
    }
  }

  let flags: (ItemBitflag & { checked: boolean })[];

  $: {
    $dataView;

    let isOverrided = false;

    if (utilsExists("overrideGetInt")) {
      [isOverrided, flags] = $gameUtils.overrideGetInt(item);
    }

    if (!isOverrided) {
      flags = item.flags.reduce(
        (flags: (ItemBitflag & { checked: boolean })[], flag) => {
          flags.push({
            ...flag,
            checked: getBitflag(flag.offset, flag.bit, {
              reversed: item.reversed || flag.reversed,
            }),
          });

          return flags;
        },
        [],
      );
    }
  }
</script>

{#if !item.hidden || $isDebug}
  <div
    class="gtc-bitflags"
    class:gtc-bitflags-debug={item.hidden}
    class:gtc-bitflags-nomargin={item.noMargin}
  >
    {#if item.name}
      <p>{@html item.name}</p>
    {/if}
    {#each flags as flag}
      {#if !flag.hidden || $isDebug}
        <div class="gtc-bitflag" class:gtc-bitflag-debug={flag.hidden}>
          <Checkbox
            label={flag.label}
            checked={flag.checked}
            disabled={flag.disabled || item.disabled}
            onChange={(event) => handleInputChange(flag, event)}
          />
          {#if flag.separator}
            <p />
          {/if}
        </div>
      {/if}
    {/each}
  </div>
{/if}

<style lang="postcss">
  .gtc-bitflags {
    @apply mr-4 mb-4 p-2 w-fit bg-primary-700 rounded;

    min-width: 196px;

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
