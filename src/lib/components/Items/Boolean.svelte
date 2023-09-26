<script lang="ts">
  import Checkbox from "$lib/components/Checkbox.svelte";
  import { dataView, gameUtils, isDebug } from "$lib/stores";
  import { getBoolean, setBoolean } from "$lib/utils/bytes";
  import { utilsExists } from "$lib/utils/format";

  import type { ItemBoolean } from "$lib/types";

  export let item: ItemBoolean;

  function handleInputChange(event: Event): void {
    let isOverrided = false;

    if (utilsExists("overrideSetInt")) {
      isOverrided = $gameUtils.overrideSetInt(
        item,
        (event.target as HTMLInputElement).checked,
      );
    }

    if (!isOverrided) {
      setBoolean(item.offset, (event.target as HTMLInputElement).checked, {
        resource: item.resource,
      });
    }

    if (utilsExists("afterSetInt")) {
      $gameUtils.afterSetInt(item);
    }
  }

  let checked: boolean;

  $: {
    $dataView;

    let isOverrided = false;

    if (utilsExists("overrideGetInt")) {
      [isOverrided, checked] = $gameUtils.overrideGetInt(item);
    }

    if (!isOverrided) {
      checked = getBoolean(item.offset, { resource: item.resource });
    }
  }
</script>

{#if !item.hidden || $isDebug}
  <div class="gtc-boolean" class:gtc-boolean-debug={item.hidden && $isDebug}>
    <Checkbox
      label={item.name}
      {checked}
      disabled={item.disabled}
      onChange={handleInputChange}
    />
  </div>
{/if}

<style lang="postcss">
  .gtc-boolean {
    &.gtc-boolean-debug {
      & :global(.gtc-checkbox) {
        @apply text-orange-800 bg-orange-950;
      }
    }
  }
</style>
