<script lang="ts">
  import Input from "$lib/components/Input.svelte";
  import {
    dataJson,
    dataView,
    dataViewAlt,
    gameUtils,
    isDebug,
  } from "$lib/stores";
  import {
    dataTypeToLength,
    getString,
    isDataViewAltExists,
    setString,
  } from "$lib/utils/bytes";
  import { utilsExists } from "$lib/utils/format";

  import type { ItemString } from "$lib/types";

  export let item: ItemString;

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
          encoding: item.encoding,
          endCode: item.endCode,
          regex: item.regex,
          resource: item.resource,
        },
        item.dataViewAltKey,
      );
    }

    if (utilsExists("afterSetInt")) {
      $gameUtils.afterSetInt(item);
    }
  }

  let value: string;

  $: {
    ($dataJson, $dataView);

    let isOverrided = false;

    if (utilsExists("overrideItem")) {
      item = $gameUtils.overrideItem(item);
    }

    if (utilsExists("overrideGetInt")) {
      [isOverrided, value] = $gameUtils.overrideGetInt(item);
    }

    let _dataViewAlt;

    if (isDataViewAltExists(item.dataViewAltKey || "")) {
      _dataViewAlt = $dataViewAlt[item.dataViewAltKey as string];
    }

    // prettier-ignore
    if (!isOverrided) {
      value = getString(item.offset, item.length, item.letterDataType, {
        bigEndian: item.bigEndian,
        letterBigEndian: item.letterBigEndian,
        encoding: item.encoding,
        endCode: item.endCode,
        resource: item.resource,
      }, _dataViewAlt);
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
