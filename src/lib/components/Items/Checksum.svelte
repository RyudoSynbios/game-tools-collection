<script lang="ts">
  import Input from "$lib/components/Input.svelte";
  import { dataView } from "$lib/stores";
  import { dataTypeToLength, getBigInt, getInt } from "$lib/utils/bytes";

  import type { ItemChecksum } from "$lib/types";

  export let item: ItemChecksum;

  let value: string;

  $: {
    $dataView;

    const hexLength = dataTypeToLength(item.dataType) * 2;

    if (item.dataType !== "int64" && item.dataType !== "uint64") {
      value = getInt(item.offset, item.dataType, {
        bigEndian: item.bigEndian,
      }).toHex(hexLength);
    } else {
      value = getBigInt(item.offset, item.dataType, {
        bigEndian: item.bigEndian,
      }).toHex(hexLength);
    }

    value = value.replace(/(.{2})/g, "$1 ");
  }
</script>

<div class="gtc-checksum">
  <Input
    label={item.name}
    type="text"
    {value}
    debug
    disabled
    checksum
    onChange={() => {}}
  />
</div>

<style lang="postcss">
</style>
