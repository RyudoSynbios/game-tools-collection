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
  }
</style>
