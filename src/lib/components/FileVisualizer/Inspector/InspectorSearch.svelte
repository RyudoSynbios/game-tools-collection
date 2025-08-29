<script lang="ts">
  import Input from "$lib/components/Input.svelte";
  import Select from "$lib/components/Select.svelte";
  import { selectedDataView, selectedOffset } from "$lib/stores/fileVisualizer";
  import { dataTypeToLength, getInt } from "$lib/utils/bytes";

  import type { DataTypeInt } from "$lib/types";

  import Toolbar from "./Toolbar.svelte";

  let searchEl: HTMLInputElement;
  let searchTypeEl: HTMLSelectElement;

  function handleSearch(direction: "previous" | "next"): void {
    const search = parseInt(searchEl.value);
    const type = searchTypeEl.value as Exclude<DataTypeInt, "int64" | "uint64">;
    // const bigEndian = searchBigEndianEl.checked;

    const dataTypeLength = dataTypeToLength(type);

    if (isNaN(search)) {
      return;
    }

    if (direction === "previous") {
      for (let i = $selectedOffset - 0x1; i >= 0x0; i -= 0x1) {
        if (getInt(i, type, {}, $selectedDataView) === search) {
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
        if (getInt(i, type, {}, $selectedDataView) === search) {
          $selectedOffset = i;
          break;
        }
      }
    }
  }

  function handleSearchTypeChange(): void {}
</script>

<Toolbar
  class="gtc-filevisualizer-inspectorsearch"
  title="Search"
  subtitle="BIG ENDIAN"
>
  <Input
    type="text"
    placeholder="0x0"
    value=""
    onEnter={() => handleSearch("next")}
    bind:inputEl={searchEl}
  />
  <Select
    value="uint8"
    options={[
      { key: "uint8", value: "uint8" },
      { key: "uint16", value: "uint16" },
      { key: "uint24", value: "uint24" },
      { key: "uint32", value: "uint32" },
      { key: "float32", value: "float32" },
      // { key: "string", value: "string" },
    ]}
    onChange={handleSearchTypeChange}
    bind:selectEl={searchTypeEl}
  />
  <button type="button" on:click={() => handleSearch("previous")}>{"<"}</button>
  <button type="button" on:click={() => handleSearch("next")}>{">"}</button>
</Toolbar>

<style lang="postcss">
  :global(
    .gtc-filevisualizer-inspectorsearch .gtc-filevisualizer-toolbar-content
  ) {
    @apply flex;

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
</style>
