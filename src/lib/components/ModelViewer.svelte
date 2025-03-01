<script lang="ts">
  import Three from "$lib/utils/three";

  export let three: Three;
  export let threeEl: HTMLDivElement;

  let innerWidth = 0;
  let innerHeight = 0;

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

  $: {
    innerWidth, innerHeight;

    if (three) {
      three.resize();
    }
  }
</script>

<svelte:window bind:innerWidth bind:innerHeight on:keydown={handleKeyDown} />

<div class="gtc-modelviewer">
  <div bind:this={threeEl} />
</div>

<style lang="postcss">
  .gtc-modelviewer {
    @apply relative z-10 w-full flex-1 rounded bg-primary-700 p-2;

    & :global(.gtc-three-message) {
      @apply absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 text-xl font-bold;
    }

    & :global(.gtc-three-progression) {
      @apply absolute left-1/2 top-1/2 w-3/4 -translate-x-1/2 rounded border border-primary-300 text-sm font-bold lg:w-1/2;

      --tw-translate-y: calc(-50% + 30px);

      & :global(div) {
        @apply h-3 bg-primary-300;
      }

      & :global(p) {
        @apply absolute right-0;
      }
    }

    & :global(.gtc-three-stats) {
      @apply absolute left-0 top-0;
    }

    & :global(.lil-gui) {
      --width: 180px;
    }

    & :global(.lil-gui.root) {
      @apply absolute right-2 top-2;
    }
  }
</style>
