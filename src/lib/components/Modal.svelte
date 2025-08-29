<script lang="ts">
  import { onDestroy, onMount } from "svelte";

  export let onClose: () => void;

  const bodyEl = document.querySelector("body") as HTMLBodyElement;

  onMount(() => {
    bodyEl.style.overflow = "hidden";
  });

  onDestroy(() => {
    bodyEl.style.overflow = "auto";
  });
</script>

<!-- svelte-ignore a11y-click-events-have-key-events -->
<!-- svelte-ignore a11y-no-static-element-interactions -->
<div class="gtc-modal-backdrop" on:mousedown={onClose}>
  <div class="gtc-modal" on:mousedown|stopPropagation>
    <slot />
  </div>
</div>

<style lang="postcss">
  .gtc-modal-backdrop {
    @apply fixed inset-0 flex items-center justify-center bg-black/50 py-8;

    z-index: 10000;

    & .gtc-modal {
      @apply h-full rounded-xl bg-primary-800 p-4;

      max-width: calc(100vw - 4rem);

      & :global(.gtc-tabs) {
        @apply max-h-full;
      }
    }
  }
</style>
