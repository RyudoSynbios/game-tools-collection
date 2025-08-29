<script lang="ts">
  import { tooltipEl } from "$lib/stores/fileVisualizer";
</script>

<div
  class="gtc-filevisualizer-tooltip"
  class:gtc-filevisualizer-tooltip-enabled={$tooltipEl?.innerHTML}
  bind:this={$tooltipEl}
/>

<style lang="postcss">
  .gtc-filevisualizer-tooltip {
    @apply fixed right-0 top-0 hidden whitespace-pre-wrap rounded bg-primary-900 px-4 py-2 text-xs text-white opacity-90;

    width: fit-content;

    &.gtc-filevisualizer-tooltip-enabled {
      @apply block;
    }
  }
</style>
