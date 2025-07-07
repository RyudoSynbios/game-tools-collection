<script lang="ts">
  import type { Snippet } from "svelte";

  interface Props {
    title: string;
    children: Snippet;
  }

  let { title, children }: Props = $props();

  let open = $state(false);

  function toggleOpen(): void {
    open = !open;
  }
</script>

<!-- svelte-ignore a11y_click_events_have_key_events -->
<!-- svelte-ignore a11y_no_static_element_interactions -->
<div class="gtc-spoiler" class:gtc-spoiler-open={open}>
  <div class="gtc-spoiler-title" onclick={toggleOpen}>
    <h2>- {title}</h2>
  </div>
  <div class="gtc-spoiler-slot">
    {@render children()}
  </div>
</div>

<style lang="postcss">
  @reference "../../app.css";

  .gtc-spoiler {
    @apply bg-primary-800 mb-4 rounded;

    & .gtc-spoiler-title {
      @apply cursor-pointer p-4;
    }

    &.gtc-spoiler-open .gtc-spoiler-slot {
      @apply block;
    }

    & h2 {
      @apply mb-0;
    }

    & .gtc-spoiler-slot {
      @apply hidden px-4 pb-4;

      & :global(p) {
        @apply mt-4 text-sm;

        &:first-child {
          @apply mt-0;
        }

        & :global(a) {
          @apply font-bold;
        }
      }

      & :global(ul) {
        & :global(li) {
          @apply mb-1 text-sm;
        }
      }
    }
  }
</style>
