<script lang="ts">
  export let title = "";

  let open = false;

  function toggleOpen(): void {
    open = !open;
  }
</script>

<!-- svelte-ignore a11y-click-events-have-key-events -->
<!-- svelte-ignore a11y-no-static-element-interactions -->
<div class="gtc-spoiler" class:gtc-spoiler-open={open}>
  <div class="gtc-spoiler-title" on:click={toggleOpen}>
    <h2>- {title}</h2>
  </div>
  <div class="gtc-spoiler-slot">
    <slot />
  </div>
</div>

<style lang="postcss">
  .gtc-spoiler {
    @apply mb-4 rounded bg-primary-800;

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
