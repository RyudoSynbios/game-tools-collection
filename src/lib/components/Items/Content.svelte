<script lang="ts">
  import Bitflags from "$lib/components/Items/Bitflags.svelte";
  import Boolean from "$lib/components/Items/Boolean.svelte";
  import Checksum from "$lib/components/Items/Checksum.svelte";
  import Component from "$lib/components/Items/Component.svelte";
  import Group from "$lib/components/Items/Group.svelte";
  import Int from "$lib/components/Items/Int.svelte";
  import Section from "$lib/components/Items/Section.svelte";
  import String from "$lib/components/Items/String.svelte";
  import Tabs from "$lib/components/Items/Tabs.svelte";
  import { isDebug } from "$lib/stores";

  import type { Item } from "$lib/types";

  export let items: Item[];
  export let flex = false;
</script>

<div class="gtc-content" class:gtc-content-flex={flex}>
  {#each items as item}
    {#if item.type === "bitflags"}
      <Bitflags {item} />
    {:else if item.type === "checksum" && $isDebug}
      <Checksum {item} />
    {:else if item.type === "component"}
      <Component {item} />
    {:else if item.type === "group"}
      <Group {item} />
    {:else if item.type === "section"}
      <Section {item} />
    {:else if item.type === "tabs"}
      <Tabs {item} />
    {:else if item.type === "variable"}
      {#if item.dataType === "boolean"}
        <Boolean {item} />
      {:else if ["bit", "lower4", "upper4", "int8", "int16", "int24", "int32", "int64", "uint8", "uint16", "uint24", "uint32", "uint64", "float32"].includes(item.dataType) && item.dataType !== "string"}
        <Int {item} />
      {:else if item.dataType === "string"}
        <String {item} />
      {/if}
    {/if}
  {/each}
</div>

<style lang="postcss">
  .gtc-content.gtc-content-flex {
    @apply flex min-h-full flex-wrap content-start;
  }
</style>
