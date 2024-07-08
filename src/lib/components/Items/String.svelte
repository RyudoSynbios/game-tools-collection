<script lang="ts">
  import Input from "$lib/components/Input.svelte";
  import { dataView, gameUtils, isDebug } from "$lib/stores";
  import { dataTypeToLength, getString, setString } from "$lib/utils/bytes";
  import { utilsExists } from "$lib/utils/format";

  import type { ItemString } from "$lib/types";

  export let item: ItemString & { hidden?: boolean };

  function handleInputChange(event: Event): void {
    const target = event.target as HTMLInputElement;

    let isOverrided = false;

    if (utilsExists("overrideSetInt")) {
      isOverrided = $gameUtils.overrideSetInt(item, target.value);
    }

    if (!isOverrided) {
      setString(
        item.offset,
        item.length,
        item.letterDataType,
        target.value,
        item.fallback,
        {
          bigEndian: item.bigEndian,
          letterBigEndian: item.letterBigEndian,
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
        letterBigEndian: item.letterBigEndian,
        resource: item.resource,
      });
    }
  }
</script>

{#if !item.hidden || $isDebug}
  <div class="gtc-string">
    <Input
      label={item.name}
      type="text"
      maxlength={item.length / dataTypeToLength(item.letterDataType)}
      {value}
      size={item.size}
      debug={item.hidden}
      disabled={item.disabled}
      test={item.test}
      onChange={handleInputChange}
    />
  </div>
{/if}

<style lang="postcss">
</style>
