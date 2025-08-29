<script lang="ts">
  export let disabled = false;
  export let onClick: () => void = () => {};

  let isMouseHold = false;

  let mouseHoldInterval: NodeJS.Timeout;
  let mouseHoldTimout: NodeJS.Timeout;

  function handleMouseDown(event: MouseEvent): void {
    if (event.which === 1) {
      if (!isMouseHold) {
        onClick();
        mouseHoldTimout = setTimeout(() => {
          isMouseHold = true;
          handleMouseDown(event);
        }, 500);
      }

      if (isMouseHold) {
        mouseHoldInterval = setInterval(() => {
          onClick();
        }, 50);
      }
    }
  }

  function handleMouseUp(): void {
    isMouseHold = false;

    clearTimeout(mouseHoldInterval);
    clearInterval(mouseHoldTimout);
  }
</script>

<svelte:window on:mouseup={handleMouseUp} />

<button
  class="gtc-filevisualizer-button"
  type="button"
  {disabled}
  on:mousedown={handleMouseDown}
>
  <slot />
</button>

<style lang="postcss">
  .gtc-filevisualizer-button {
    @apply h-4 w-4 cursor-default rounded-none bg-primary-500 p-0 text-center;

    &:disabled {
      @apply cursor-default bg-primary-500 text-primary-400;
    }

    &:hover:not(:disabled) {
      @apply bg-primary-400;
    }
  }
</style>
