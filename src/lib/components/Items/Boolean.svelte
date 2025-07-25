<script lang="ts">
  import Checkbox from "$lib/components/Checkbox.svelte";
  import { dataView, dataViewAlt, gameUtils, isDebug } from "$lib/stores";
  import {
    getBoolean,
    isDataViewAltExists,
    setBoolean,
  } from "$lib/utils/bytes";
  import { utilsExists } from "$lib/utils/format";

  import type { ItemBoolean } from "$lib/types";

  export let item: ItemBoolean;

  function handleInputChange(event: Event): void {
    const target = event.target as HTMLInputElement;

    let isOverrided = false;

    if (utilsExists("overrideSetInt")) {
      isOverrided = $gameUtils.overrideSetInt(item, target.checked);
    }

    // prettier-ignore
    if (!isOverrided) {
      setBoolean(item.offset, target.checked, {
        on: item.on,
        off: item.off,
        resource: item.resource,
      }, item.dataViewAltKey);
    }

    if (utilsExists("afterSetInt")) {
      $gameUtils.afterSetInt(item);
    }
  }

  let checked: boolean;

  $: {
    $dataView;

    let isOverrided = false;

    if (utilsExists("overrideItem")) {
      item = $gameUtils.overrideItem(item);
    }

    if (utilsExists("overrideGetInt")) {
      [isOverrided, checked] = $gameUtils.overrideGetInt(item);
    }

    let _dataViewAlt;

    if (isDataViewAltExists(item.dataViewAltKey || "")) {
      _dataViewAlt = $dataViewAlt[item.dataViewAltKey as string];
    }

    // prettier-ignore
    if (!isOverrided) {
      checked = getBoolean(item.offset, {
        on: item.on,
        off: item.off,
        resource: item.resource,
      }, _dataViewAlt);
    }
  }
</script>

{#if !item.hidden || $isDebug}
  <div class="gtc-boolean" class:gtc-boolean-debug={item.hidden}>
    <Checkbox
      label={item.name}
      {checked}
      disabled={item.disabled}
      onChange={handleInputChange}
    />
    {#if item.separator}
      <p></p>
    {/if}
  </div>
{/if}

<style lang="postcss">
  .gtc-boolean {
    &.gtc-boolean-debug {
      & :global(.gtc-checkbox) {
        @apply bg-orange-950 text-orange-800;
      }
    }

    & p {
      @apply mb-2 text-sm font-bold;
    }
  }
</style>
