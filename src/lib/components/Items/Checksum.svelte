<script lang="ts">
  import Input from "$lib/components/Input.svelte";
  import { dataView } from "$lib/stores";
  import { dataTypeToLength, getBigInt, getInt } from "$lib/utils/bytes";

  import type { ItemChecksum } from "$lib/types";

  interface Props {
    item: ItemChecksum;
  }

  let { item }: Props = $props();

  const value = $derived.by(() => {
    $dataView;

    let value = "";

    const dataTypeLength = dataTypeToLength(item.dataType) * 2;

    if (item.dataType !== "int64" && item.dataType !== "uint64") {
      value = getInt(item.offset, item.dataType, {
        bigEndian: item.bigEndian,
      }).toHex(dataTypeLength);
    } else {
      value = getBigInt(item.offset, item.dataType, {
        bigEndian: item.bigEndian,
      }).toHex(dataTypeLength);
    }

    return `0x${value}`;
  });
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
