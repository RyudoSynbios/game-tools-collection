<script lang="ts">
  import Input from "$lib/components/Input.svelte";
  import { dataView, gameUtils, isDebug } from "$lib/stores";
  import { dataTypeToLength, getString, setString } from "$lib/utils/bytes";
  import { utilsExists } from "$lib/utils/format";

  import type { ItemString } from "$lib/types";

  export let item: ItemString;

  function handleInputChange(event: Event): void {
    let isOverrided = false;

    if (utilsExists("overrideSetInt")) {
      isOverrided = $gameUtils.overrideSetInt(
        item,
        (event.target as HTMLInputElement).value,
      );
    }

    if (!isOverrided) {
      setString(
        item.offset,
        item.length,
        item.letterDataType,
        (event.target as HTMLInputElement).value,
        item.fallback,
        {
          bigEndian: item.bigEndian,
          resource: item.resource,
        },
      );
    }

    if (utilsExists("afterSetInt")) {
      $gameUtils.afterSetInt(item);
    }
  }

  let value: string;

  $: {
    $dataView;

    let isOverrided = false;

    if (utilsExists("overrideGetInt")) {
      [isOverrided, value] = $gameUtils.overrideGetInt(item);
    }

    if (!isOverrided) {
      value = getString(item.offset, item.length, item.letterDataType, {
        bigEndian: item.bigEndian,
        resource: item.resource,
      });
    }
  }
</script>

{#if !item.hidden || $isDebug}
  <div class="gtc-string" class:gtc-string-debug={item.hidden && $isDebug}>
    <Input
      label={item.name}
      type="text"
      maxlength={item.length / dataTypeToLength(item.letterDataType)}
      {value}
      disabled={item.disabled}
      onChange={handleInputChange}
    />
  </div>
{/if}

<style lang="postcss">
  .gtc-string {
    &.gtc-string-debug {
      & :global(.gtc-input) {
        @apply text-orange-800 bg-orange-950;
      }
    }
  }
</style>
