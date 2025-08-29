<script lang="ts">
  let className = "";

  export { className as class };
  export let title = "";
  export let subtitle = "";
</script>

<div class="gtc-filevisualizer-toolbar {className}">
  {#if title || subtitle}
    <div class="gtc-filevisualizer-toolbar-title">
      {#if title}
        <p>{title}</p>
      {/if}
      {#if subtitle}
        <p>{subtitle}</p>
      {/if}
    </div>
  {/if}
  <div class="gtc-filevisualizer-toolbar-content">
    <slot />
  </div>
</div>

<style lang="postcss">
  .gtc-filevisualizer-toolbar {
    @apply mb-4 w-full overflow-hidden whitespace-nowrap rounded bg-primary-500 p-2;

    & .gtc-filevisualizer-toolbar-title {
      @apply mb-2 flex justify-between text-sm font-bold;
    }

    & :global(button) {
      @apply rounded-l-none bg-primary-400 leading-4 text-white;

      &:hover {
        @apply bg-primary-300;
      }
    }

    .gtc-filevisualizer-toolbar-content {
      & :global(.gtc-input),
      & :global(.gtc-select) {
        @apply m-0 p-0;
      }
    }
  }
</style>
