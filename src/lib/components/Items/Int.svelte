<script lang="ts">
  import Autocomplete from "$lib/components/Autocomplete.svelte";
  import Input from "$lib/components/Input.svelte";
  import Select from "$lib/components/Select.svelte";
  import {
    dataJson,
    dataView,
    dataViewAlt,
    debugOptions,
    gameJson,
    gameUtils,
    isDebug,
  } from "$lib/stores";
  import { getIntFromItem, setIntFromItem } from "$lib/utils/bytes";
  import {
    getIntMax,
    getIntMin,
    getUtils,
    objToArrayKeyValue,
    round,
    utilsExists,
  } from "$lib/utils/format";
  import { getResource } from "$lib/utils/parser";

  import type {
    ItemInt,
    ObjectKeyValue,
    ResourceGroups,
    ResourceLabels,
  } from "$lib/types";

  export let item: ItemInt;

  let previousId: string | undefined;

  function handleButtonClick(): void {
    const action = item.button!.action.replace("%value%", `${value}`);

    getUtils(action);
  }

  function handleInputChange(event: Event): void {
    let newValue = (event.target as HTMLInputElement).value;

    if (item.uncontrolled) {
      value = parseInt(newValue);
      return;
    }

    if (item.hex) {
      newValue = parseInt(newValue, 16).toString();
    }

    let isOverrided = false;

    if (utilsExists("overrideSetInt")) {
      isOverrided = $gameUtils.overrideSetInt(item, newValue);
    }

    if (!isOverrided) {
      setIntFromItem(item, newValue);
    }

    if (isLinked(item) && item.id !== "current") {
      const currentItem = item.parent!.items[0] as ItemInt;
      const maxItem = item.parent!.items[1] as ItemInt;

      let current = getIntFromItem(currentItem);
      const max = getIntFromItem(maxItem);

      if (typeof current !== "bigint" && typeof max !== "bigint") {
        current = Math.min(current, max);

        setIntFromItem(currentItem, current);
      }
    }

    if (utilsExists("afterSetInt")) {
      $gameUtils.afterSetInt(item);
    }
  }

  function isLinked(item: ItemInt): boolean {
    if (
      item.parent &&
      "type" in item.parent &&
      item.parent.type === "group" &&
      item.parent.linked
    ) {
      return true;
    }

    return false;
  }

  let label: string;
  let min: number;
  let max: number;
  let maxlength: number;
  let value: bigint | number | string = 0;
  let options: ObjectKeyValue<string>[];
  let groups: ResourceGroups;
  let labels: ResourceLabels;

  $: {
    ($dataJson, $dataView, $dataViewAlt);

    let isOverrided = false;

    if (item.uncontrolled && item.id !== previousId) {
      value = 0;
    }

    if (utilsExists("overrideItem")) {
      item = $gameUtils.overrideItem(item);
    }

    if (isLinked(item) && item.id === "current") {
      const maxItem = item.parent!.items[1] as ItemInt;

      const max = getIntFromItem(maxItem);

      if (typeof max !== "bigint") {
        item.max = max;
      }
    }

    label = item.name || "";

    if ($isDebug && $debugOptions.showInputOffsets) {
      label = `[0x${item.offset.toHex()}]${item.bit !== undefined ? ` [${item.bit}]` : ""} ${label}`;
    }

    min = getIntMin(item);
    max = getIntMax(item);

    if (utilsExists("overrideGetInt")) {
      [isOverrided, value] = $gameUtils.overrideGetInt(item);
    }

    if (!item.uncontrolled) {
      if (!isOverrided) {
        value = getIntFromItem(item);
      }

      if (item.dataType === "float32") {
        value = round(value as number, 3);
      }

      if (item.hex) {
        value = (value as number).toHex();
        maxlength = (item.leadingZeros || 0) + 1;
      }

      if (item.leadingZeros) {
        value = value.toString().padStart(item.leadingZeros + 1, "0");
      }
    }

    options = [];
    groups = [];
    labels = {};

    let resource = getResource(item.resource);

    if (item.resource && resource) {
      const order = $gameJson.resourcesOrder?.[item.resource] || [];

      options = objToArrayKeyValue(resource, order);
      groups = ($gameJson.resourcesGroups?.[item.resource] as ResourceGroups) || [];
      labels = $gameJson.resourcesLabels?.[item.resource] || {};
    }

    previousId = item.id;
  }
</script>

{#if !item.hidden || ($isDebug && $debugOptions.showHiddenItems)}
  <div class="gtc-int" class:gtc-int-button={item.button}>
    {#if options.length === 0}
      <Input
        {label}
        type={item.hex ? "text" : "number"}
        {min}
        {max}
        {maxlength}
        step={item.step || 1}
        leadingZeros={item.leadingZeros}
        hex={item.hex}
        {value}
        size={item.size}
        hint={item.hint}
        prefix={item.prefix}
        suffix={item.suffix}
        debug={item.hidden}
        disabled={item.disabled}
        test={item.test}
        onChange={handleInputChange}
      />
    {:else if item.autocomplete}
      <Autocomplete
        {label}
        {value}
        {options}
        {groups}
        {labels}
        size={item.size}
        hint={item.hint}
        debug={item.hidden}
        disabled={item.disabled}
        test={item.test}
        onChange={handleInputChange}
      />
    {:else}
      <Select
        {label}
        type="number"
        {value}
        {options}
        size={item.size}
        hint={item.hint}
        debug={item.hidden}
        disabled={item.disabled}
        test={item.test}
        onChange={handleInputChange}
      />
    {/if}
    {#if item.button}
      <button type="button" on:click={handleButtonClick}>
        {item.button.label}
      </button>
    {/if}
  </div>
{/if}

<style lang="postcss">
  .gtc-int {
    &.gtc-int-button {
      @apply mb-4 mr-4 flex w-fit items-end justify-between rounded bg-primary-700 p-2;

      & :global(.gtc-autocomplete),
      & :global(.gtc-input),
      & :global(.gtc-select) {
        @apply m-0 p-0;
      }

      & button {
        @apply rounded-l-none bg-primary-400 leading-4 text-white;

        &:hover {
          @apply bg-primary-300;
        }
      }
    }
  }
</style>
