<script lang="ts">
  import FileSaver from "file-saver";
  import { onMount } from "svelte";

  import Checkbox from "$lib/components/Checkbox.svelte";
  import Input from "$lib/components/Input.svelte";
  import Select from "$lib/components/Select.svelte";
  import {
    dataView,
    dataViewAlt,
    fileVisualizerAddress,
    fileVisualizerDataViewKey,
    gameJson,
    isFileVisualizerOpen,
  } from "$lib/stores";
  import { dataTypeToLength, getInt } from "$lib/utils/bytes";
  import {
    parseItem,
    type HighlightedOffset,
    type HighlightedOffsets,
  } from "$lib/utils/fileVisualizer";

  import type { DataTypeInt } from "$lib/types";

  import Modal from "./Modal.svelte";

  let contentEl = $state<HTMLDivElement>()!;
  let tooltipEl = $state<HTMLDivElement>()!;
  let gotoEl = $state<HTMLInputElement>()!;
  let searchTextEl = $state<HTMLInputElement>()!;
  let searchTypeEl = $state<HTMLSelectElement>()!;
  let searchBigEndianEl = $state<HTMLInputElement>()!;

  let contentHeight = $state(0);
  let rows: number[] = $state([]);
  let visibleRows: number[] = $state([]);

  let paddingTop = $state(0);
  let paddingBottom = $state(0);

  let start = $state(0);
  let end = $state(0);

  let selectedDataView = $state($dataView);
  let previousDataViewKey = $state("");

  if ($fileVisualizerDataViewKey !== "main") {
    selectedDataView = $dataViewAlt[$fileVisualizerDataViewKey];
  }

  let search: {
    text: string;
    dataType: Exclude<DataTypeInt, "int64" | "uint64">;
    bigEndian: boolean;
  } = $state({
    text: "",
    dataType: "uint8",
    bigEndian: false,
  });

  let highlightedOffsets: HighlightedOffsets = {};
  let tooltip = $state("");

  const rowHeight = 24;

  function getHighlightedOffset(
    offset: number,
    searchPrevious = false,
  ): HighlightedOffset {
    const highlightedOffset =
      highlightedOffsets[$fileVisualizerDataViewKey] &&
      highlightedOffsets[$fileVisualizerDataViewKey][offset];

    if (search.text) {
      const int = parseInt(search.text);

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

      if (
        !isNaN(int) &&
        getInt(offset, search.dataType, { bigEndian: search.bigEndian }, selectedDataView) === int // prettier-ignore
      ) {
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

    return highlightedOffset;
  }

  function handleClose(): void {
    $isFileVisualizerOpen = false;
  }

  function handleDataViewChange(event: Event): void {
    const target = event.target as HTMLInputElement;
    const value = target.value;

    if (value === "main") {
      selectedDataView = $dataView;
    } else {
      selectedDataView = $dataViewAlt[value];
    }

    $fileVisualizerDataViewKey = value;

    handleGoto(0x0);
  }

  function handleExport(): void {
    const blob = new Blob([selectedDataView], {
      type: "application/octet-stream",
    });

    FileSaver.saveAs(blob, $fileVisualizerDataViewKey);
  }

  function handleGoto(value: number | undefined = undefined): void {
    if (value === undefined) {
      value = parseInt(gotoEl.value);
    }

    if (gotoEl.value.match(/^\+|-/)) {
      $fileVisualizerAddress += value;
    } else {
      $fileVisualizerAddress = value;
    }

    const top = Math.floor($fileVisualizerAddress / 0x10) * 24;

    contentEl.scrollTo({ top });
  }

  function handleSearch(direction: "previous" | "next"): void {
    const search = parseInt(searchTextEl.value);
    const type = searchTypeEl.value as Exclude<DataTypeInt, "int64" | "uint64">;
    const bigEndian = searchBigEndianEl.checked;

    const dataTypeLength = dataTypeToLength(type);

    if (isNaN(search)) {
      return;
    }

    if (direction === "previous") {
      for (
        let i = $fileVisualizerAddress - dataTypeLength;
        i > 0x0;
        i -= dataTypeLength
      ) {
        if (getInt(i, type, { bigEndian }, selectedDataView) === search) {
          handleGoto(i);
          break;
        }
      }
    } else if (direction === "next") {
      for (
        let i = $fileVisualizerAddress + 0x10;
        i < selectedDataView.byteLength;
        i += dataTypeLength
      ) {
        if (getInt(i, type, { bigEndian }, selectedDataView) === search) {
          handleGoto(i);
          break;
        }
      }
    }
  }

  function handleSearchTextChange(event: Event): void {
    const target = event.target as HTMLInputElement;

    search.text = target.value;
  }

  function handleSearchTypeChange(event: Event): void {
    const target = event.target as HTMLInputElement;

    search.dataType = target.value as Exclude<DataTypeInt, "int64" | "uint64">;
  }

  function handleSearchBigEndianChange(event: Event): void {
    const target = event.target as HTMLInputElement;

    search.bigEndian = target.checked;
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

  function handleScroll(event?: Event): void {
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

    if (event) {
      $fileVisualizerAddress = Math.floor(paddingTop / 24) * 0x10;
    }
  }

  onMount(() => {
    if ($fileVisualizerAddress) {
      setTimeout(() => {
        handleGoto($fileVisualizerAddress);
      }, 1);
    }

    Object.values($gameJson.items).forEach((item) => {
      parseItem(highlightedOffsets, item);
    });
  });

  $effect(() => {
    if ($fileVisualizerDataViewKey !== previousDataViewKey) {
      rows = [...Array(Math.ceil(selectedDataView.byteLength / 0x10)).keys()];
    }

    previousDataViewKey = $fileVisualizerDataViewKey;
  });

  $effect(() => {
    if (contentEl) {
      handleScroll();

      visibleRows = rows.slice(start, end).map((i) => i * 0x10);
    }
  });
</script>

<!-- svelte-ignore a11y_click_events_have_key_events -->
<!-- svelte-ignore a11y_no_static_element_interactions -->
<Modal onClose={handleClose}>
  <div class="gtc-filevisualizer">
    <div class="gtc-filevisualizer-toolbar">
      <div class="gtc-filevisualizer-dataview">
        <Select
          label="DataView"
          value={$fileVisualizerDataViewKey}
          options={[
            { key: "main", value: "main" },
            ...Object.keys($dataViewAlt).map((key) => ({
              key,
              value: key,
            })),
          ]}
          onChange={handleDataViewChange}
        />
        <button type="button" onclick={() => handleExport()}>Export</button>
      </div>
      <div class="gtc-filevisualizer-goto">
        <Input
          label="Go To"
          type="text"
          placeholder="0x0"
          value=""
          onEnter={handleGoto}
          bind:inputEl={gotoEl}
        />
        <button type="button" onclick={() => handleGoto()}>Go</button>
      </div>
      <div class="gtc-filevisualizer-search">
        <Input
          label="Search"
          type="text"
          placeholder="0x0"
          value={search.text}
          onChange={handleSearchTextChange}
          onEnter={() => handleSearch("next")}
          bind:inputEl={searchTextEl}
        />
        <Select
          label="&nbsp;"
          value={search.dataType}
          options={[
            { key: "uint8", value: "uint8" },
            { key: "uint16", value: "uint16" },
            { key: "uint24", value: "uint24" },
            { key: "uint32", value: "uint32" },
            { key: "float32", value: "float32" },
          ]}
          onChange={handleSearchTypeChange}
          bind:selectEl={searchTypeEl}
        />
        <button type="button" onclick={() => handleSearch("previous")}>
          &lt;
        </button>
        <button type="button" onclick={() => handleSearch("next")}>
          &gt;
        </button>
        <Checkbox
          label="Big Endian"
          checked={search.bigEndian}
          onChange={handleSearchBigEndianChange}
          bind:inputEl={searchBigEndianEl}
        />
      </div>
    </div>
    <div
      class="gtc-filevisualizer-content"
      bind:this={contentEl}
      bind:offsetHeight={contentHeight}
      onblur={handleMouseOut}
      onmouseout={handleMouseOut}
      onscroll={handleScroll}
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
                  onmousemove={(event) => handleMouseMove(event, row + offset)}
                >
                  {row + offset < selectedDataView.byteLength
                    ? getInt(row + offset, "uint8", {}, selectedDataView).toHex(
                        2,
                      )
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
                  onmousemove={(event) => handleMouseMove(event, row + offset)}
                >
                  {row + offset < selectedDataView.byteLength
                    ? String.fromCharCode(
                        getInt(row + offset, "uint8", {}, selectedDataView),
                      )
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
</Modal>

<style lang="postcss">
  @reference "../../app.css";

  .gtc-filevisualizer {
    @apply flex h-full;

    & .gtc-filevisualizer-toolbar {
      @apply pr-4;

      & .gtc-filevisualizer-dataview,
      & .gtc-filevisualizer-goto,
      & .gtc-filevisualizer-search {
        @apply bg-primary-700 mb-4 flex items-end justify-between rounded p-2;

        & :global(.gtc-input),
        & :global(.gtc-select) {
          @apply m-0 p-0;
        }

        & button {
          @apply bg-primary-400 rounded-l-none leading-4 text-white;

          &:hover {
            @apply bg-primary-300;
          }
        }
      }

      & .gtc-filevisualizer-dataview {
        @apply mb-8;

        & :global(.gtc-select) {
          @apply flex-1;

          & :global(select) {
            @apply w-full;
          }
        }
      }

      & .gtc-filevisualizer-goto {
        & :global(.gtc-input) {
          @apply flex-1;

          & :global(input) {
            @apply w-full;
          }
        }
      }

      & .gtc-filevisualizer-search {
        @apply relative;

        & :global(.gtc-input input) {
          @apply w-28;
        }

        & :global(.gtc-select select) {
          @apply w-20 border-l;
        }

        & :global(.gtc-checkbox) {
          @apply absolute top-2 right-2;
        }
      }
    }

    & .gtc-filevisualizer-content {
      @apply overflow-y-auto text-white;

      width: 758px;

      & .gtc-filevisualizer-row {
        @apply flex;

        & .gtc-filevisualizer-offsets {
          @apply bg-primary-500 font-source h-6 px-4 text-center uppercase;
        }

        & .gtc-filevisualizer-bytes {
          width: 464px;
        }

        & .gtc-filevisualizer-ascii {
          width: 176px;
        }

        & .gtc-filevisualizer-ascii,
        & .gtc-filevisualizer-bytes {
          @apply flex flex-wrap content-start px-2;

          & .gtc-filevisualizer-hex {
            @apply font-source h-6 w-7 px-1 text-center uppercase;
          }

          & .gtc-filevisualizer-char {
            @apply font-source h-6 text-center;

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

            &.gtc-filevisualizer-hex-float32 {
              @apply bg-slate-700;
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
      @apply bg-primary-900 fixed top-0 right-0 hidden rounded px-4 py-2 text-sm whitespace-pre-wrap text-white opacity-90;

      width: fit-content;

      &.gtc-filevisualizer-tooltip-enabled {
        @apply block;
      }
    }
  }
</style>
