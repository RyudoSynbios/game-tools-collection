<script lang="ts">
  import { debounce } from "throttle-debounce";

  import ArrowDownIcon from "$lib/assets/ArrowDown.svelte";
  import ArrowUpIcon from "$lib/assets/ArrowUp.svelte";
  import {
    rows,
    rowsOffset,
    selectedDataView,
  } from "$lib/stores/fileVisualizer";
  import { getMaxRows, scrollDataView } from "$lib/utils/fileVisualizer";

  import Button from "./Button.svelte";

  let scrollThumbContainerEl: HTMLDivElement;

  let maxRows = 0;
  let scrollThumbContainerHeight = 0;
  let thumbTop = 0;
  let thumbHeight = 0;
  let positionY = 0;
  let thumbDirection: "bottom" | "top" = "top";

  let isMouseHold = false;
  let isThumbHold = false;

  let mouseHoldInterval: NodeJS.Timeout;
  let mouseHoldTimout: NodeJS.Timeout;

  const updateRowsOffset = debounce(1, () => {
    $rowsOffset = Math.floor(
      (maxRows - Math.floor($rows)) *
        (thumbTop / (scrollThumbContainerHeight - thumbHeight)),
    );
  });

  function handleMouseMove(event: MouseEvent): void {
    if (isThumbHold) {
      thumbTop = Math.min(
        Math.max(0, -(positionY - event.y)),
        scrollThumbContainerHeight - thumbHeight,
      );

      updateRowsOffset();
    }
  }

  function handleMouseUp(): void {
    isMouseHold = false;
    isThumbHold = false;

    clearTimeout(mouseHoldInterval);
    clearInterval(mouseHoldTimout);
  }

  function handleScrollThumbMouseDown(event: MouseEvent): void {
    if (event.which === 1 && !isThumbHold) {
      isThumbHold = true;
      positionY = event.y - thumbTop;
    }
  }

  function handleScrollThumbContainer(event: MouseEvent): void {
    if (thumbDirection === "top" && event.offsetY < thumbTop) {
      $rowsOffset = Math.max(0x0, $rowsOffset - Math.floor($rows));
    } else if (
      thumbDirection === "bottom" &&
      event.offsetY > thumbTop + thumbHeight
    ) {
      $rowsOffset = Math.min($rowsOffset + Math.floor($rows), maxRows);
    }
  }

  function handleScrollThumbContainerMouseDown(event: MouseEvent): void {
    if (
      event.target === scrollThumbContainerEl &&
      event.which === 1 &&
      Math.floor($rows) < maxRows
    ) {
      if (!isMouseHold) {
        thumbDirection = event.offsetY < thumbTop ? "top" : "bottom";
        handleScrollThumbContainer(event);
        mouseHoldTimout = setTimeout(() => {
          isMouseHold = true;
          handleScrollThumbContainerMouseDown(event);
        }, 500);
      }

      if (isMouseHold) {
        mouseHoldInterval = setInterval(() => {
          handleScrollThumbContainer(event);
        }, 50);
      }
    }
  }

  function updateScrollThumb(): void {
    thumbHeight = Math.max(
      18,
      scrollThumbContainerHeight * (Math.floor($rows) / maxRows),
    );

    thumbTop =
      (scrollThumbContainerHeight - thumbHeight) *
      ($rowsOffset / (maxRows - Math.floor($rows)));
  }

  selectedDataView.subscribe(() => {
    maxRows = getMaxRows();

    updateScrollThumb();
  });

  rows.subscribe(() => {
    updateScrollThumb();
  });

  rowsOffset.subscribe(() => {
    if (!isThumbHold) {
      updateScrollThumb();
    }
  });

  $: scrollThumbContainerHeight && updateScrollThumb();
</script>

<svelte:window on:mousemove={handleMouseMove} on:mouseup={handleMouseUp} />

<!-- svelte-ignore a11y-no-static-element-interactions -->
<div class="gtc-filevisualizer-scrollbar">
  <Button disabled={$rowsOffset === 0x0} onClick={() => scrollDataView(-1)}>
    <ArrowUpIcon />
  </Button>
  <div
    class="gtc-filevisualizer-scrollthumb-container"
    bind:clientHeight={scrollThumbContainerHeight}
    bind:this={scrollThumbContainerEl}
    on:mousedown={handleScrollThumbContainerMouseDown}
  >
    {#if Math.floor($rows) < maxRows}
      <div
        class="gtc-filevisualizer-scrollthumb"
        style={`top: ${thumbTop}px; height: ${thumbHeight}px;`}
        on:mousedown={handleScrollThumbMouseDown}
      />
    {/if}
  </div>
  <Button
    disabled={Math.floor($rows) + $rowsOffset >= maxRows}
    onClick={() => scrollDataView(1)}
  >
    <ArrowDownIcon />
  </Button>
</div>

<style lang="postcss">
  .gtc-filevisualizer-scrollbar {
    @apply relative flex w-4 flex-col justify-between bg-primary-500;

    & .gtc-filevisualizer-scrollthumb-container {
      @apply relative flex-1;

      & .gtc-filevisualizer-scrollthumb {
        @apply absolute h-4 w-4 bg-primary-400 hover:bg-primary-300;
      }
    }
  }
</style>
