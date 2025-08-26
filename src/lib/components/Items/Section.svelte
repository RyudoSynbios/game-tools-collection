<script lang="ts">
  import Content from "$lib/components/Items/Content.svelte";
  import { dataJson, dataView, gameUtils, isDebug } from "$lib/stores";
  import { utilsExists } from "$lib/utils/format";

  import type { ItemSection } from "$lib/types";

  export let item: ItemSection;

  $: {
    ($dataJson, $dataView);

    if (utilsExists("overrideItem")) {
      item = $gameUtils.overrideItem(item);
    }
  }
</script>

{#if !item.hidden || $isDebug}
  <div
    class="gtc-section"
    class:gtc-section-background={item.background}
    class:gtc-section-debug={item.hidden}
    class:gtc-section-flex1={item.flex1}
    class:gtc-section-nomargin={item.noMargin}
  >
    {#if item.name}
      <p>{@html item.name}</p>
    {/if}
    <Content items={item.items} flex={item.flex} />
  </div>
{/if}

<style lang="postcss">
  .gtc-section {
    @apply mb-4;

    min-width: 200px;

    & p {
      @apply mb-2 text-sm font-bold;
    }

    &.gtc-section-background {
      @apply mb-4 mr-4 w-fit rounded bg-primary-700 p-2;
    }

    &.gtc-section-debug {
      @apply bg-orange-950 text-orange-800;
    }

    &.gtc-section-flex1 {
      @apply flex-1;
    }

    &.gtc-section-nomargin {
      @apply m-0 p-0;
    }
  }
</style>
