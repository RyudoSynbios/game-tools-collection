<script lang="ts">
  import Input from "$lib/components/Input.svelte";
  import { dataJson, dataView, dataViewAlt, debugOptions, isDebug } from "$lib/stores";
  import { dataTypeToLength, getBigInt, getInt, isDataViewAltExists } from "$lib/utils/bytes";

  import type { ItemChecksum } from "$lib/types";

  export let item: ItemChecksum;

  let label: string;
  let value: string;

  $: {
    ($dataJson, $dataView);

    label = item.name || "";

    if ($isDebug && $debugOptions.showInputOffsets) {
      label = `[0x${item.offset.toHex()}] ${label}`;
    }

    let _dataViewAlt;

    if (isDataViewAltExists(item.dataViewAltKey || "")) {
      _dataViewAlt = $dataViewAlt[item.dataViewAltKey as string];
    }

    const dataTypeLength = dataTypeToLength(item.dataType) * 2;

    if (item.dataType !== "uint64") {
      value = getInt(item.offset, item.dataType, {
        bigEndian: item.bigEndian,
      }, _dataViewAlt).toHex(dataTypeLength);
    } else {
      value = getBigInt(item.offset, item.dataType, {
        bigEndian: item.bigEndian,
      }, _dataViewAlt).toHex(dataTypeLength);
    }

    value = `0x${value}`;
  }
</script>

{#if $isDebug && $debugOptions.showChecksums}
  <div class="gtc-checksum">
    <Input {label} type="text" {value} debug disabled checksum />
  </div>
{/if}
