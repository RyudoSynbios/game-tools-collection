<script lang="ts">
  import { onMount } from "svelte";

  import { dataView, gameJson, isFileVisualizerOpen } from "$lib/stores";
  import {
    addItem,
    parseItem,
    parseValidator,
  } from "$lib/utils/fileVisualizer";

  import type { HighlightedOffsets } from "$lib/utils/fileVisualizer";

  let tooltipEl: HTMLDivElement;

  let dataLength = 0;
  let highlightedOffsets: HighlightedOffsets = {};
  let tooltip = "";

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

  onMount(() => {
    dataLength = $dataView.byteLength;

    parseValidator(highlightedOffsets);

    Object.values($gameJson.items).forEach((item) => {
      parseItem(highlightedOffsets, item);
    });
  });
</script>

<div class="gtc-filevisualizer-backdrop" on:click={handleClose}>
  <div
    class="gtc-filevisualizer"
    on:blur={handleMouseOut}
    on:click|stopPropagation
    on:mouseout={handleMouseOut}
  >
    <div class="gtc-filevisualizer-offsets">
      {#each [...Array(Math.floor(dataLength / 0x10) + 1).keys()] as offset}
        <div class="gtc-filevisualizer-hex">{(offset * 0x10).toHex(8)}</div>
      {/each}
    </div>
    <div class="gtc-filevisualizer-bytes">
      {#each [...Array(dataLength).keys()] as offset}
        <div
          class="gtc-filevisualizer-hex{highlightedOffsets[offset] !==
            undefined && highlightedOffsets[offset].dataType
            ? ` gtc-filevisualizer-hex-${highlightedOffsets[offset].dataType}`
            : ''}"
          class:gtc-filevisualizer-hex-bitflags={highlightedOffsets[offset]
            ?.type === "bitflags"}
          on:mousemove={(event) => handleMouseMove(event, offset)}
        >
          {$dataView.getUint8(offset).toHex(2)}
        </div>
      {/each}
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
      @apply flex justify-center p-4 bg-primary-900 rounded-xl overflow-auto;

      width: 602px;
      height: 100%;

      & .gtc-filevisualizer-offsets {
        & .gtc-filevisualizer-hex {
          @apply px-4 bg-primary-800;
        }
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
