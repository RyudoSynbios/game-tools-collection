<script lang="ts">
  import { onDestroy, onMount, type Snippet } from "svelte";

  interface Props {
    onClose: () => void;
    children: Snippet;
  }

  let { onClose, children }: Props = $props();

  const bodyEl = document.querySelector("body") as HTMLBodyElement;

  onMount(() => {
    bodyEl.style.overflow = "hidden";
  });

  onDestroy(() => {
    bodyEl.style.overflow = "auto";
  });
</script>

<!-- svelte-ignore a11y_click_events_have_key_events -->
<!-- svelte-ignore a11y_no_static_element_interactions -->
<div class="gtc-modal-backdrop" onclick={onClose}>
  <div class="gtc-modal" onclick={(event: Event) => event.stopPropagation()}>
    {@render children()}
  </div>
</div>

<style lang="postcss">
  @reference "../../app.css";

  .gtc-modal-backdrop {
    @apply fixed inset-0 flex items-center justify-center bg-black/50 py-8;

    z-index: 10000;

    & .gtc-modal {
      @apply bg-primary-800 h-full rounded-xl p-4;

      max-width: calc(100vw - 4rem);

      & :global(.gtc-tabs) {
        @apply max-h-full;
      }
    }
  }
</style>
