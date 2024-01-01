<script lang="ts">
  import { onDestroy, onMount } from "svelte";

  import { dataView, gameJson, isFileVisualizerOpen } from "$lib/stores";
  import { parseItem, parseValidator } from "$lib/utils/fileVisualizer";

  import type { HighlightedOffsets } from "$lib/utils/fileVisualizer";

  const bodyEl = document.querySelector("body") as HTMLBodyElement;

  let contentEl: HTMLDivElement;
  let tooltipEl: HTMLDivElement;

  let contentHeight = 0;
  let visibleRows: number[] = [];

  let paddingTop = 0;
  let paddingBottom = 0;

  let start = 0;
  let end = 0;

  let highlightedOffsets: HighlightedOffsets = {};
  let tooltip = "";

  const rows = [...Array(Math.floor($dataView.byteLength / 0x10)).keys()];
  const rowHeight = 24;

  function handleClose(): void {
    $isFileVisualizerOpen = false;
  }

  function handleMouseMove(event: MouseEvent, offset: number): void {
    const highlightedOffset = highlightedOffsets[offset];

    if (highlightedOffset !== undefined) {
      tooltip = `[0x${highlightedOffset.offset.toHex(8)}] ${
        highlightedOffset.type
      } ${
        highlightedOffset.dataType ? `(${highlightedOffset.dataType})` : ""
      }\n${highlightedOffset.text} `;
    } else {
      tooltip = `[0x${offset.toHex(8)}]`;
    }

    tooltipEl.style.top = `${event.y + 15}px`;
    tooltipEl.style.left = `${event.x + 15}px`;
  }

  function handleMouseOut(): void {
    tooltip = "";
  }

  function handleScroll() {
    const { scrollTop } = contentEl;

    let i = 0;
    let y = 0;

    while (i < rows.length) {
      if (y + rowHeight > scrollTop) {
        start = i;
        paddingTop = y;

        break;
      }

      y += rowHeight;
      i += 1;
    }

    while (i < rows.length) {
      y += rowHeight;
      i += 1;

      if (y > scrollTop + contentHeight) {
        break;
      }
    }

    end = i;

    paddingBottom = (rows.length - end) * rowHeight;
  }

  onMount(() => {
    bodyEl.style.overflow = "hidden";

    parseValidator(highlightedOffsets);

    Object.values($gameJson.items).forEach((item) => {
      parseItem(highlightedOffsets, item);
    });
  });

  onDestroy(() => {
    bodyEl.style.overflow = "auto";
  });

  $: {
    if (contentEl) {
      handleScroll();

      visibleRows = rows.slice(start, end).map((i) => i * 0x10);
    }
  }
</script>

<div class="gtc-filevisualizer-backdrop" on:click={handleClose}>
  <div class="gtc-filevisualizer">
    <div
      class="gtc-filevisualizer-content"
      bind:this={contentEl}
      bind:offsetHeight={contentHeight}
      on:blur={handleMouseOut}
      on:click|stopPropagation
      on:mouseout={handleMouseOut}
      on:scroll={handleScroll}
    >
      <div
        style="padding-top: {paddingTop}px; padding-bottom: {paddingBottom}px;"
      >
        {#each visibleRows as row}
          <div class="gtc-filevisualizer-row">
            <div class="gtc-filevisualizer-offsets">
              {row.toHex(8)}
            </div>
            <div class="gtc-filevisualizer-bytes">
              {#each [...Array(0x10).keys()] as offset}
                <div
                  class="gtc-filevisualizer-hex{highlightedOffsets[
                    row + offset
                  ] !== undefined && highlightedOffsets[row + offset].dataType
                    ? ` gtc-filevisualizer-hex-${
                        highlightedOffsets[row + offset].dataType
                      }`
                    : ''}"
                  class:gtc-filevisualizer-hex-bitflags={highlightedOffsets[
                    row + offset
                  ]?.type === "bitflags"}
                  on:mousemove={(event) => handleMouseMove(event, row + offset)}
                >
                  {$dataView.getUint8(row + offset).toHex(2)}
                </div>
              {/each}
            </div>
          </div>
        {/each}
      </div>
    </div>
    <div
      class="gtc-filevisualizer-tooltip"
      class:gtc-filevisualizer-tooltip-enabled={tooltip}
      bind:this={tooltipEl}
    >
      {tooltip}
    </div>
  </div>
</div>

<style lang="postcss">
  .gtc-filevisualizer-backdrop {
    @apply fixed inset-0 flex items-center justify-center py-8 text-white bg-black/50;

    z-index: 10000;

    & .gtc-filevisualizer {
      @apply flex justify-center p-4 h-full bg-primary-900 rounded-xl;

      width: 602px;

      & .gtc-filevisualizer-content {
        @apply overflow-y-auto;

        & .gtc-filevisualizer-row {
          @apply flex;

          & .gtc-filevisualizer-offsets {
            @apply px-4 h-6 font-source text-center uppercase bg-primary-800;
          }

          & .gtc-filevisualizer-bytes {
            @apply flex content-start flex-wrap px-2;

            width: 452px;

            & .gtc-filevisualizer-hex {
              @apply px-1 h-6;

              &.gtc-filevisualizer-hex-bitflags {
                @apply bg-green-700;
              }

              &.gtc-filevisualizer-hex-bit {
                @apply bg-emerald-700;
              }

              &.gtc-filevisualizer-hex-boolean {
                @apply bg-lime-700;
              }

              &.gtc-filevisualizer-hex-lower4,
              &.gtc-filevisualizer-hex-upper4,
              &.gtc-filevisualizer-hex-int8,
              &.gtc-filevisualizer-hex-uint8 {
                @apply bg-cyan-700;
              }

              &.gtc-filevisualizer-hex-int16,
              &.gtc-filevisualizer-hex-uint16 {
                @apply bg-yellow-700;
              }

              &.gtc-filevisualizer-hex-int24,
              &.gtc-filevisualizer-hex-uint24 {
                @apply bg-orange-700;
              }

              &.gtc-filevisualizer-hex-int32,
              &.gtc-filevisualizer-hex-uint32 {
                @apply bg-red-700;
              }

              &.gtc-filevisualizer-hex-int64,
              &.gtc-filevisualizer-hex-uint64 {
                @apply bg-amber-700;
              }

              &.gtc-filevisualizer-hex-string {
                @apply bg-indigo-700;
              }
            }
          }

          & .gtc-filevisualizer-hex {
            @apply font-source text-center uppercase;
          }
        }
      }

      & .gtc-filevisualizer-tooltip {
        @apply fixed top-0 right-0 hidden px-4 py-2 text-sm bg-primary-900 opacity-90 rounded whitespace-pre-wrap;

        width: fit-content;

        &.gtc-filevisualizer-tooltip-enabled {
          @apply block;
        }
      }
    }
  }
</style>
