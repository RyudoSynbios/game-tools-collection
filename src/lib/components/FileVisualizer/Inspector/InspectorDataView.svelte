<script lang="ts">
  import FileSaver from "file-saver";
  import { get } from "svelte/store";

  import Input from "$lib/components/Input.svelte";
  import Select from "$lib/components/Select.svelte";
  import { dataView, dataViewAlt, fileName } from "$lib/stores";
  import {
    dataViewKey,
    rowsOffset,
    selectedDataView,
    selectedOffset,
  } from "$lib/stores/fileVisualizer";

  import Toolbar from "./Toolbar.svelte";

  let gotoEl: HTMLInputElement;

  function handleDataViewChange(event: Event): void {
    const target = event.target as HTMLInputElement;
    const value = target.value;

    if (value === "main") {
      $dataViewKey = undefined;
    } else {
      $dataViewKey = value;
    }

    $rowsOffset = 0x0;
    $selectedOffset = 0x0;
  }

  function handleExport(): void {
    const $dataView =
      $dataViewKey !== undefined ? $dataViewAlt[$dataViewKey] : get(dataView);

    const buffer = $dataView.buffer as ArrayBuffer;

    const blob = new Blob([buffer], {
      type: "application/octet-stream",
    });

    FileSaver.saveAs(blob, $dataViewKey || $fileName);
  }

  function handleGoto(): void {
    const value = parseInt(gotoEl.value) || 0x0;

    if (gotoEl.value.match(/^\+|-/)) {
      $selectedOffset += value;
    } else {
      $selectedOffset = value;
    }

    $selectedOffset = Math.min(
      Math.max(0x0, $selectedOffset),
      $selectedDataView.byteLength - 0x1,
    );
  }
</script>

<Toolbar
  class="gtc-filevisualizer-inspectordataview"
  title="DataView"
  subtitle={$selectedOffset.toHex(0, true)}
>
  <div>
    <Select
      value={$dataViewKey || "main"}
      options={[
        { key: "main", value: "main" },
        ...Object.keys($dataViewAlt).map((key) => ({ key, value: key })),
      ]}
      onChange={handleDataViewChange}
    />
    <button type="button" on:click={() => handleExport()}>Export</button>
  </div>
  <div>
    <Input
      type="text"
      placeholder="0x0"
      value=""
      onEnter={handleGoto}
      bind:inputEl={gotoEl}
    />
    <button type="button" on:click={handleGoto}>Go</button>
  </div>
</Toolbar>

<style lang="postcss">
  :global(
    .gtc-filevisualizer-inspectordataview .gtc-filevisualizer-toolbar-content
  ) {
    & > div {
      @apply flex items-start;

      &:not(:last-child) {
        @apply mb-2;
      }

      & :global(.gtc-input),
      & :global(.gtc-select) {
        @apply w-full flex-1;

        & :global(input),
        & :global(select) {
          @apply w-full;
        }
      }
    }
  }
</style>
