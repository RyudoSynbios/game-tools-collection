<script lang="ts">
  import Content from "$lib/components/Items/Content.svelte";
  import { isDebug } from "$lib/stores";

  import type { ItemSection } from "$lib/types";

  export let item: ItemSection;
</script>

{#if !item.hidden || $isDebug}
  <div
    class="gtc-section"
    class:gtc-section-background={item.background}
    class:gtc-section-debug={item.hidden && $isDebug}
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
      @apply mr-4 mb-4 p-2 w-fit bg-primary-700 rounded;
    }

    &.gtc-section-debug {
      @apply text-orange-800 bg-orange-950;
    }

    &.gtc-section-nomargin {
      @apply m-0 p-0;
    }
  }
</style>
