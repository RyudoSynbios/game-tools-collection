<script lang="ts">
  import { onDestroy, onMount } from "svelte";

  import Input from "$lib/components/Input.svelte";
  import Select from "$lib/components/Select.svelte";
  import { dataView, gameJson, isFileVisualizerOpen } from "$lib/stores";
  import { dataTypeToLength, getInt } from "$lib/utils/bytes";
  import { parseItem } from "$lib/utils/fileVisualizer";

  import type {
    HighlightedOffset,
    HighlightedOffsets,
  } from "$lib/utils/fileVisualizer";

  import type { DataTypeInt } from "$lib/types";

  const bodyEl = document.querySelector("body") as HTMLBodyElement;

  let contentEl: HTMLDivElement;
  let tooltipEl: HTMLDivElement;

  let contentHeight = 0;
  let visibleRows: number[] = [];

  let paddingTop = 0;
  let paddingBottom = 0;

  let start = 0;
  let end = 0;

  let search: {
    text: string;
    dataType: Exclude<DataTypeInt, "int64" | "uint64">;
  } = {
    text: "",
    dataType: "uint8",
  };

  let highlightedOffsets: HighlightedOffsets = {};
  let tooltip = "";

  const rows = [...Array(Math.ceil($dataView.byteLength / 0x10)).keys()];
  const rowHeight = 24;

  function getHighlightedOffset(
    offset: number,
    searchPrevious = false,
  ): HighlightedOffset {
    if (search.text) {
      const int = parseInt(search.text);

      const highlightedOffset = highlightedOffsets[offset];

      if (!searchPrevious) {
        const previousOffsets = [
          ...Array(dataTypeToLength(search.dataType) - 1).keys(),
        ].reduce((result: HighlightedOffset | undefined, index) => {
          const previousOffset = offset - (index + 1);

          const previousHighlightedOffset = getHighlightedOffset(
            Math.max(0x0, previousOffset),
            true,
          );

          if (
            previousHighlightedOffset &&
            previousHighlightedOffset.type === "search" &&
            previousHighlightedOffset.dataType === search.dataType &&
            previousHighlightedOffset.offset === previousOffset
          ) {
            result = {
              offset: previousOffset,
              text: `Search${
                highlightedOffset ? `\n${highlightedOffset.text}` : ""
              }`,
              type: "search",
              dataType: search.dataType,
            };
          }

          return result;
        }, undefined);

        if (previousOffsets) {
          return previousOffsets;
        }
      }

      if (!isNaN(int) && getInt(offset, search.dataType) === int) {
        return {
          offset,
          text: `Search${
            highlightedOffset ? `\n${highlightedOffset.text}` : ""
          }`,
          type: "search",
          dataType: search.dataType,
        };
      }
    }

    return highlightedOffsets[offset];
  }

  function handleClose(): void {
    $isFileVisualizerOpen = false;
  }

  function handleSearchTextChange(event: Event): void {
    const target = event.target as HTMLInputElement;

    search.text = target.value;
  }

  function handleSearchTypeChange(event: Event): void {
    const target = event.target as HTMLInputElement;

    search.dataType = target.value as Exclude<DataTypeInt, "int64" | "uint64">;
  }

  function handleMouseMove(event: MouseEvent, offset: number): void {
    const highlightedOffset = getHighlightedOffset(offset);

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

  function handleScroll(): void {
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

    Object.values($gameJson.items).forEach((item) => {
      parseItem(highlightedOffsets, item);
    });
  });

  onDestroy(() => {
    bodyEl.style.overflow = "auto";
  });

  $: {
    contentHeight, search;

    if (contentEl) {
      handleScroll();

      visibleRows = rows.slice(start, end).map((i) => i * 0x10);
    }
  }
</script>

<div class="gtc-filevisualizer-backdrop" on:click={handleClose}>
  <div class="gtc-filevisualizer" on:click|stopPropagation>
    <div class="gtc-filevisualizer-toolbar">
      <Input
        type="text"
        placeholder="Search..."
        value={search.text}
        onChange={handleSearchTextChange}
      />
      <Select
        value={search.dataType}
        options={[
          { key: "uint8", value: "uint8" },
          { key: "uint16", value: "uint16" },
          { key: "uint24", value: "uint24" },
          { key: "uint32", value: "uint32" },
        ]}
        onChange={handleSearchTypeChange}
      />
    </div>
    <div
      class="gtc-filevisualizer-content"
      bind:this={contentEl}
      bind:offsetHeight={contentHeight}
      on:blur={handleMouseOut}
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
                {@const highlightedOffset = getHighlightedOffset(row + offset)}
                <div
                  class="gtc-filevisualizer-hex{highlightedOffset !==
                    undefined && highlightedOffset.dataType
                    ? ` gtc-filevisualizer-hex-${highlightedOffset.dataType}`
                    : ''}"
                  class:gtc-filevisualizer-hex-bitflags={highlightedOffset?.type ===
                    "bitflags"}
                  class:gtc-filevisualizer-hex-search={highlightedOffset?.type ===
                    "search"}
                  on:mousemove={(event) => handleMouseMove(event, row + offset)}
                >
                  {row + offset < $dataView.byteLength
                    ? getInt(row + offset, "uint8").toHex(2)
                    : ""}
                </div>
              {/each}
            </div>
            <div class="gtc-filevisualizer-ascii">
              {#each [...Array(0x10).keys()] as offset}
                {@const highlightedOffset = getHighlightedOffset(row + offset)}
                <div
                  class="gtc-filevisualizer-char{highlightedOffset !==
                    undefined && highlightedOffset.dataType
                    ? ` gtc-filevisualizer-hex-${highlightedOffset.dataType}`
                    : ''}"
                  class:gtc-filevisualizer-hex-bitflags={highlightedOffset?.type ===
                    "bitflags"}
                  class:gtc-filevisualizer-hex-search={highlightedOffset?.type ===
                    "search"}
                  on:mousemove={(event) => handleMouseMove(event, row + offset)}
                >
                  {row + offset < $dataView.byteLength
                    ? String.fromCharCode(getInt(row + offset, "uint8"))
                    : ""}
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
      @apply flex flex-col p-4 h-full bg-primary-900 rounded-xl;

      width: 790px;

      & .gtc-filevisualizer-toolbar {
        @apply flex;
      }

      & .gtc-filevisualizer-content {
        @apply overflow-y-auto;

        & .gtc-filevisualizer-row {
          @apply flex;

          & .gtc-filevisualizer-offsets {
            @apply px-4 h-6 font-source text-center uppercase bg-primary-800;
          }

          & .gtc-filevisualizer-bytes {
            width: 464px;
          }

          & .gtc-filevisualizer-ascii {
            width: 176px;
          }

          & .gtc-filevisualizer-ascii,
          & .gtc-filevisualizer-bytes {
            @apply flex content-start flex-wrap px-2;

            & .gtc-filevisualizer-hex {
              @apply px-1 w-7 h-6 font-source text-center uppercase;
            }

            & .gtc-filevisualizer-char {
              @apply h-6 font-source text-center;

              width: 0.625rem;
            }

            & .gtc-filevisualizer-hex,
            & .gtc-filevisualizer-char {
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

              &.gtc-filevisualizer-hex-search {
                @apply bg-fuchsia-700;
              }
            }
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
