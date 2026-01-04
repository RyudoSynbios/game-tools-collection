<script lang="ts">
  import Checkbox from "$lib/components/Checkbox.svelte";
  import Input from "$lib/components/Input.svelte";
  import Select from "$lib/components/Select.svelte";
  import {
    search,
    searchBigEndian,
    searchType,
    selectedDataView,
    selectedOffset,
  } from "$lib/stores/fileVisualizer";
  import { dataTypeToLength, getInt } from "$lib/utils/bytes";

  import type { DataTypeInt } from "$lib/types";

  import Toolbar from "./Toolbar.svelte";

  function handleSearch(direction: "previous" | "next"): void {
    const search = parseInt($search);
    const type = $searchType as Exclude<DataTypeInt, "int64" | "uint64">;
    const bigEndian = $searchBigEndian;

    const dataTypeLength = dataTypeToLength(type);

    if (isNaN(search)) {
      return;
    }

    if (direction === "previous") {
      for (let i = $selectedOffset - 0x1; i >= 0x0; i -= 0x1) {
        if (getInt(i, type, { bigEndian }, $selectedDataView) === search) {
          $selectedOffset = i;
          break;
        }
      }
    } else if (direction === "next") {
      for (
        let i = $selectedOffset + 0x1;
        i <= $selectedDataView.byteLength - dataTypeLength;
        i += 0x1
      ) {
        if (getInt(i, type, { bigEndian }, $selectedDataView) === search) {
          $selectedOffset = i;
          break;
        }
      }
    }
  }

  function handleSearchChange(event: Event): void {
    $search = (event.target as HTMLInputElement).value;
  }

  function handleSearchBigEndianChange(event: Event): void {
    $searchBigEndian = (event.target as HTMLInputElement).checked;
  }

  function handleSearchTypeChange(event: Event): void {
    $searchType = (event.target as HTMLInputElement).value;
  }
</script>

<Toolbar class="gtc-filevisualizer-inspectorsearch" title="Search">
  <div class="gtc-filevisualizer-inspectorsearch-checkbox">
    <Checkbox
      label="Big Endian"
      onChange={handleSearchBigEndianChange}
      bind:checked={$searchBigEndian}
    />
  </div>
  <Input
    type="text"
    placeholder="0x0"
    onEnter={() => handleSearch("next")}
    onChange={handleSearchChange}
    bind:value={$search}
  />
  <Select
    options={[
      { key: "uint8", value: "uint8" },
      { key: "uint16", value: "uint16" },
      { key: "uint24", value: "uint24" },
      { key: "uint32", value: "uint32" },
      { key: "float32", value: "float32" },
    ]}
    onChange={handleSearchTypeChange}
    value={$searchType}
  />
  <button type="button" on:click={() => handleSearch("previous")}>{"<"}</button>
  <button type="button" on:click={() => handleSearch("next")}>{">"}</button>
</Toolbar>

<style lang="postcss">
  :global(.gtc-filevisualizer-inspectorsearch) {
    @apply relative;

    :global(.gtc-filevisualizer-toolbar-content) {
      @apply flex;

      & .gtc-filevisualizer-inspectorsearch-checkbox {
        @apply absolute right-2.5 top-1.5;
      }

      & :global(.gtc-input) {
        & :global(input) {
          @apply w-full;
        }
      }

      & :global(.gtc-select select) {
        @apply w-20 border-l;
      }

      & button:first-of-type {
        @apply rounded-r-none;
      }

      & button:last-of-type {
        @apply border-l border-primary-300;
      }
    }
  }
</style>
