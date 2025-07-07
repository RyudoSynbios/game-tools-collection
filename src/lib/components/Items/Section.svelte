<script lang="ts">
  import Content from "$lib/components/Items/Content.svelte";
  import { dataView, gameUtils, isDebug } from "$lib/stores";
  import { utilsExists } from "$lib/utils/format";

  import type { ItemSection } from "$lib/types";

  interface Props {
    item: ItemSection;
  }

  let { item }: Props = $props();

  const section: ItemSection = $derived.by(() => {
    $dataView;

    if (utilsExists("overrideItem")) {
      return $gameUtils.overrideItem(item);
    }

    return item;
  });
</script>

{#if !section.hidden || $isDebug}
  <div
    class="gtc-section"
    class:gtc-section-background={section.background}
    class:gtc-section-debug={section.hidden}
    class:gtc-section-flex1={section.flex1}
    class:gtc-section-nomargin={section.noMargin}
  >
    {#if section.name}
      <p>{@html section.name}</p>
    {/if}
    <Content items={section.items} flex={section.flex} />
  </div>
{/if}

<style lang="postcss">
  @reference "../../../app.css";

  .gtc-section {
    @apply mb-4;

    min-width: 200px;

    & p {
      @apply mb-2 text-sm font-bold;
    }

    &.gtc-section-background {
      @apply bg-primary-700 mr-4 mb-4 w-fit rounded p-2;
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
