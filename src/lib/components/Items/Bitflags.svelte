<script lang="ts">
  import Checkbox from "$lib/components/Checkbox.svelte";
  import {
    dataJson,
    dataView,
    dataViewAlt,
    debugOptions,
    gameUtils,
    isDebug,
  } from "$lib/stores";
  import {
    getBitflag,
    isDataViewAltExists,
    setBitflag,
  } from "$lib/utils/bytes";
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
        item.dataViewAltKey,
      );
    }

    if (utilsExists("afterSetInt")) {
      $gameUtils.afterSetInt(item, flag);
    }
  }

  let flags: (ItemBitflag & { checked: boolean })[];

  $: {
    ($dataJson, $dataView);

    let isOverrided = false;

    if (utilsExists("overrideItem")) {
      item = $gameUtils.overrideItem(item);
    }

    if (utilsExists("overrideGetInt")) {
      [isOverrided, flags] = $gameUtils.overrideGetInt(item);
    }

    let _dataViewAlt: DataView;

    if (isDataViewAltExists(item.dataViewAltKey || "")) {
      _dataViewAlt = $dataViewAlt[item.dataViewAltKey as string];
    }

    // prettier-ignore
    if (!isOverrided) {
      flags = item.flags.reduce(
        (flags: (ItemBitflag & { checked: boolean })[], flag) => {
          flags.push({
            ...flag,
            checked: getBitflag(flag.offset, flag.bit, {
              reversed: item.reversed || flag.reversed,
            }, _dataViewAlt),
          });

          return flags;
        },
        [],
      );
    }
  }
</script>

{#if !item.hidden || ($isDebug && $debugOptions.showHiddenItems)}
  <div
    class="gtc-bitflags"
    class:gtc-bitflags-debug={item.hidden}
    class:gtc-bitflags-maxWidth={item.maxWidth}
    class:gtc-bitflags-nomargin={item.noMargin}
  >
    {#if item.name}
      <div class="gtc-bitflags-label">
        <p>{@html item.name}</p>
        {#if item.hint}
          <span data-title={item.hint}>?</span>
        {/if}
      </div>
    {/if}
    {#each flags as flag}
      {#if !flag.hidden || ($isDebug && $debugOptions.showHiddenItems)}
        {@const label = `${$isDebug && $debugOptions.showInputOffsets ? `[0x${flag.offset.toHex()}] [${flag.bit}] ` : ""}${flag.label}`}
        <div class="gtc-bitflag" class:gtc-bitflag-debug={flag.hidden}>
          <Checkbox
            {label}
            checked={flag.checked}
            disabled={flag.disabled || item.disabled}
            onChange={(event) => handleInputChange(flag, event)}
          />
          {#if flag.separator}
            <p></p>
          {/if}
        </div>
      {/if}
    {/each}
  </div>
{/if}

<style lang="postcss">
  .gtc-bitflags {
    @apply mb-4 mr-4 h-fit w-fit rounded bg-primary-700 p-2;

    min-width: 196px;

    &.gtc-bitflags-debug {
      @apply bg-orange-950 text-orange-800;
    }

    &.gtc-bitflags-maxWidth {
      @apply w-auto;
    }

    &.gtc-bitflags-nomargin {
      @apply m-0 p-0;
    }

    & .gtc-bitflag {
      &.gtc-bitflag-debug {
        & :global(.gtc-checkbox) {
          @apply bg-orange-950 text-orange-800;
        }
      }
    }

    & .gtc-bitflags-label {
      @apply mb-2 flex items-center justify-between;

      & p {
        @apply text-sm font-bold;
      }

      & span {
        @apply w-5 cursor-pointer rounded bg-primary-400 text-center text-sm font-bold;
      }
    }

    & .gtc-bitflag p {
      @apply mb-2;
    }
  }
</style>
