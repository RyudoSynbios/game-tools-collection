<script lang="ts">
  import Autocomplete from "$lib/components/Autocomplete.svelte";
  import Input from "$lib/components/Input.svelte";
  import Select from "$lib/components/Select.svelte";
  import {
    dataView,
    dataViewAlt,
    gameJson,
    gameUtils,
    isDebug,
  } from "$lib/stores";
  import {
    getBigInt,
    getInt,
    isDataViewAltExists,
    setBigInt,
    setInt,
  } from "$lib/utils/bytes";
  import {
    getIntMax,
    getIntMin,
    getUtils,
    objToArrayKeyValue,
    round,
    utilsExists,
  } from "$lib/utils/format";
  import { getResource } from "$lib/utils/parser";
  import { checkIntConditions } from "$lib/utils/validator";

  import type { ItemInt, ObjectKeyValue } from "$lib/types";

  export let item: ItemInt & { hidden?: boolean };

  function handleInputChange(event: Event): void {
    let isOverrided = false;

    const value = (event.target as HTMLInputElement).value;

    if (utilsExists("overrideSetInt")) {
      isOverrided = $gameUtils.overrideSetInt(item, value);
    }

    // prettier-ignore
    if (!isOverrided) {
      if (item.dataType !== "int64" && item.dataType !== "uint64") {
        setInt(item.offset, item.dataType, value, {
          bigEndian: item.bigEndian,
          binaryCodedDecimal: item.binaryCodedDecimal,
          binary: item.binary,
          bit: item.bit,
          operations: item.operations,
        }, item.dataViewAltKey);
      } else {
        setBigInt(item.offset, item.dataType, value, {
          bigEndian: item.bigEndian
        }, item.dataViewAltKey);
      }
    }

    if (utilsExists("afterSetInt")) {
      $gameUtils.afterSetInt(item);
    }
  }

  let min: number;
  let max: number;
  let value: bigint | number | string;
  let options: ObjectKeyValue<string>[];

  $: {
    $dataView;

    min = getIntMin(item);
    max = getIntMax(item);

    let isOverrided = false;

    let int = 0;

    if (utilsExists("overrideGetInt")) {
      [isOverrided, value] = $gameUtils.overrideGetInt(item);
    }

    let dataViewAlt;

    if (isDataViewAltExists(item.dataViewAltKey || "")) {
      dataViewAlt = $dataViewAlt[item.dataViewAltKey as string];
    }

    // prettier-ignore
    if (!isOverrided) {
      if (item.dataType !== "int64" && item.dataType !== "uint64") {
        int = getInt(item.offset, item.dataType, {
          bigEndian: item.bigEndian,
        }, dataViewAlt);

        value = getInt(item.offset, item.dataType, {
          bigEndian: item.bigEndian,
          binaryCodedDecimal: item.binaryCodedDecimal,
          binary: item.binary,
          bit: item.bit,
          operations: item.operations,
        }, dataViewAlt);
      } else {
        value = getBigInt(item.offset, item.dataType, {
          bigEndian: item.bigEndian,
        }, dataViewAlt);
      }
    }

    const isNegative = (int || value) === -1;

    if (item.disableIfNegative && isNegative) {
      item.disabled = true;
      value = 0;
    }

    if (item.hiddenConditions) {
      if (typeof item.hiddenConditions === "string") {
        item.hidden = getUtils(item.hiddenConditions);
      } else {
        item.hidden = checkIntConditions(item.hiddenConditions);
      }
    }

    if (item.dataType === "float32") {
      value = round(value as number, 3);
    }

    if (item.leadingZeros) {
      value = value.toString().padStart(item.leadingZeros + 1, "0");
    }

    options = [];

    let resource = getResource(item.resource, true);

    if (item.resource && resource) {
      const order =
        ($gameJson.resourcesOrder && $gameJson.resourcesOrder[item.resource]) ||
        [];

      options = objToArrayKeyValue(resource, order);
    }
  }
</script>

{#if !item.hidden || $isDebug}
  <div class="gtc-int">
    {#if options.length === 0}
      <Input
        label={item.name}
        type="number"
        {min}
        {max}
        step={item.step || 1}
        leadingZeros={item.leadingZeros}
        {value}
        size={item.size}
        suffix={item.suffix}
        debug={item.hidden}
        disabled={item.disabled}
        test={item.test}
        onChange={handleInputChange}
      />
    {:else if item.autocomplete}
      <Autocomplete
        label={item.name}
        {value}
        {options}
        size={item.size}
        debug={item.hidden}
        disabled={item.disabled}
        test={item.test}
        onChange={handleInputChange}
      />
    {:else}
      <Select
        label={item.name}
        type="number"
        {value}
        {options}
        size={item.size}
        debug={item.hidden}
        disabled={item.disabled}
        test={item.test}
        onChange={handleInputChange}
      />
    {/if}
  </div>
{/if}

<style lang="postcss">
</style>
