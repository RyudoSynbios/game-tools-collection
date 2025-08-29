<script lang="ts">
  import {
    cellEdit,
    dataViewKey,
    editedOffsets,
    rows,
    rowsOffset,
    selectedDataView,
    selectedOffset,
    selectedView,
    tooltipEl,
  } from "$lib/stores/fileVisualizer";
  import { setInt } from "$lib/utils/bytes";
  import { scrollDataView } from "$lib/utils/fileVisualizer";

  import CellsGrid from "./CellsGrid.svelte";
  import Offsets from "./Offsets.svelte";
  import Scrollbar from "./Scrollbar.svelte";
  import Tooltip from "./Tooltip.svelte";

  let height = 0;

  let rowsFloor = 0;
  let previousRowsFloor = 0;
  let previousSelectedOffset: number | null = null;

  function handleKeyDown(event: KeyboardEvent): void {
    const { key, ctrlKey, metaKey } = event;

    if ($selectedView && ["charview", "hexview"].includes($selectedView)) {
      let newselectedOffset = $selectedOffset;

      if (["ArrowUp", "ArrowRight", "ArrowDown", "ArrowLeft"].includes(key)) {
        event.preventDefault();

        switch (key) {
          case "ArrowUp":
            newselectedOffset -= 0x10;
            break;
          case "ArrowRight":
            newselectedOffset += 0x1;
            break;
          case "ArrowDown":
            newselectedOffset += 0x10;
            break;
          case "ArrowLeft":
            newselectedOffset -= 0x1;
            break;
        }
      }

      if (
        $selectedView === "hexview" &&
        key.length === 1 &&
        key.match(/[0-9A-Fa-f]/g)
      ) {
        event.preventDefault();

        if ($cellEdit === null) {
          $cellEdit = key.toUpperCase();
        } else {
          const int = parseInt($cellEdit + key, 16);

          setInt($selectedOffset, "uint8", int, {}, $dataViewKey);

          if (!$editedOffsets.includes($selectedOffset)) {
            $editedOffsets.push($selectedOffset);
          }

          $cellEdit = null;
          newselectedOffset += 0x1;
        }
      }

      if (
        $selectedView === "charview" &&
        !ctrlKey &&
        !metaKey &&
        key.length === 1
      ) {
        event.preventDefault();

        setInt($selectedOffset, "uint8", key.charCodeAt(0), {}, $dataViewKey);

        if (!$editedOffsets.includes($selectedOffset)) {
          $editedOffsets.push($selectedOffset);
        }

        newselectedOffset += 0x1;
      }

      if (newselectedOffset !== $selectedOffset) {
        $selectedOffset = Math.min(
          Math.max(0x0, newselectedOffset),
          $selectedDataView.byteLength - 0x1,
        );
      }
    }
  }

  function handleMouseWheel(event: WheelEvent): void {
    if (event.deltaY < 0) {
      scrollDataView(-1);
    } else {
      scrollDataView(1);
    }

    $tooltipEl.innerHTML = "";
  }

  $: {
    if (height) {
      $rows = (height - 56 - 40) / 20;

      rowsFloor = Math.floor($rows);

      if (
        previousSelectedOffset !== null &&
        rowsFloor > previousRowsFloor &&
        $rowsOffset > 0x0
      ) {
        $rowsOffset -= rowsFloor - previousRowsFloor;
      }

      previousRowsFloor = rowsFloor;

      if ($selectedOffset !== previousSelectedOffset) {
        if ($cellEdit !== null) {
          $cellEdit = null;
        }

        const min = $rowsOffset * 0x10;
        const max = min + rowsFloor * 0x10 - 0x1;

        if (
          previousSelectedOffset !== null &&
          ($selectedOffset < min || $selectedOffset > max)
        ) {
          const difference = $selectedOffset - previousSelectedOffset;
          const rowsSelectedOffset = Math.floor($selectedOffset / 0x10);

          if (Math.abs(difference) < 0x10) {
            $rowsOffset = Math.min(
              Math.max(0x0, rowsSelectedOffset - rowsFloor / 0x2),
              Math.floor($selectedDataView.byteLength / 0x10) - rowsFloor,
            );
          } else if ($selectedOffset < min) {
            $rowsOffset = rowsSelectedOffset;
          } else if ($selectedOffset > max) {
            $rowsOffset = Math.min(
              rowsSelectedOffset - rowsFloor + 0x1,
              Math.floor($selectedDataView.byteLength / 0x10) - rowsFloor,
            );
          }
        }

        previousSelectedOffset = $selectedOffset;
      }
    }

    $rowsOffset = Math.max(0x0, $rowsOffset);
  }
</script>

<svelte:window bind:innerHeight={height} on:keydown={handleKeyDown} />

<div class="gtc-filevisualizer-dataview" on:wheel={handleMouseWheel}>
  <Offsets />
  <CellsGrid view="hexview" />
  <CellsGrid view="charview" />
  <Scrollbar />
  <Tooltip />
</div>

<style lang="postcss">
  .gtc-filevisualizer-dataview {
    @apply flex overflow-hidden;

    height: calc(100vh - 96px);
  }
</style>
