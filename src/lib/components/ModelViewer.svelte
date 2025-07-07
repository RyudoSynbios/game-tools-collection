<script lang="ts">
  import Three from "$lib/utils/three";

  interface Props {
    three: Three;
    threeEl: HTMLDivElement;
  }

  let { three, threeEl = $bindable() }: Props = $props();

  let innerWidth = $state(0);
  let innerHeight = $state(0);

  function handleKeyDown(event: KeyboardEvent): void {
    if (!event.ctrlKey && !event.metaKey && event.key === "f") {
      event.preventDefault();

      three.fitCameraToScene();
    } else if (!event.ctrlKey && !event.metaKey && event.key === "r") {
      event.preventDefault();

      three.resetCamera();
    } else if (three.isFullscreen() && event.key === "Escape") {
      event.preventDefault();

      three.fullscreenToggle();
    }
  }

  $effect(() => {
    innerWidth;
    innerHeight;

    if (three) {
      three.resize();
    }
  });
</script>

<svelte:window bind:innerWidth bind:innerHeight onkeydown={handleKeyDown} />

<div class="gtc-modelviewer">
  <div bind:this={threeEl}></div>
</div>

<style lang="postcss">
  @reference "../../app.css";

  .gtc-modelviewer {
    @apply bg-primary-700 z-10 w-full flex-1 rounded p-2;

    & > div {
      @apply relative;

      & :global(.gtc-three-message) {
        @apply absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-xl font-bold;
      }

      & :global(.gtc-three-progression) {
        @apply border-primary-300 absolute top-1/2 left-1/2 w-3/4 -translate-x-1/2 rounded border text-sm font-bold lg:w-1/2;

        --tw-translate-y: calc(-50% + 30px);

        & :global(div) {
          @apply bg-primary-300 h-3;
        }

        & :global(p) {
          @apply absolute right-0;
        }
      }

      & :global(.gtc-three-stats) {
        @apply absolute top-0 left-0;
      }

      & :global(.lil-gui) {
        --width: 180px;
      }

      & :global(.lil-gui.root) {
        @apply absolute top-2 right-2;
      }

      & :global(.lil-gui.root.tree) {
        @apply absolute top-2 left-2;
      }
    }
  }
</style>
