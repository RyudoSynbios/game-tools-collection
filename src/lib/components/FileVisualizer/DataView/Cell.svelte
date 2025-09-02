<script lang="ts">
  import {
    cellEdit,
    dataViewKey,
    editedOffsets,
    highlightsTemplate,
    selectedOffset,
    tooltipEl,
  } from "$lib/stores/fileVisualizer";
  import { getHighlight } from "$lib/utils/fileVisualizer";

  export let type: "char" | "hex";
  export let offset: number;

  let isEdit = false;
  let isEdited = false;
  let isSelected = false;
  let highlightType = "";

  function handleCellClick(): void {
    $selectedOffset = offset;
  }

  function handleMouseMove(event: MouseEvent, offset: number): void {
    const highlight = getHighlight(offset);

    let text = `[0x${offset.toHex(8)}]`;

    if (highlight !== undefined) {
      text += ` ${highlight.type} ${highlight.dataType ? `(${highlight.dataType})` : ""}\n${highlight.text} `;
    }

    $tooltipEl.innerHTML = text;

    $tooltipEl.style.top = `${event.y + 15}px`;
    $tooltipEl.style.left = `${event.x + 15}px`;
  }

  $: {
    ($dataViewKey, $highlightsTemplate);

    const highlight = getHighlight(offset);

    isEdit = Boolean(isSelected && $cellEdit);
    isEdited = $editedOffsets.includes(offset);
    isSelected = offset === $selectedOffset;
    highlightType = highlight?.dataType || highlight?.type || "";
  }
</script>

<!-- svelte-ignore a11y-click-events-have-key-events -->
<!-- svelte-ignore a11y-no-static-element-interactions -->
<div
  class="gtc-filevisualizer-cell gtc-filevisualizer-cell-{type} gtc-filevisualizer-cell-{highlightType}"
  class:gtc-filevisualizer-cell-edit={isEdit}
  class:gtc-filevisualizer-cell-edited={isEdited}
  class:gtc-filevisualizer-cell-selected={isSelected}
  class:gtc-filevisualizer-cell-highlighted={highlightType}
  on:click={handleCellClick}
  on:mousemove={(event) => handleMouseMove(event, offset)}
>
  {#if isEdit && type === "hex"}
    {$cellEdit}
  {:else}
    <slot />
  {/if}
</div>

<style lang="postcss">
  .gtc-filevisualizer-cell {
    @apply text-center font-source text-sm;

    height: 20px;

    &.gtc-filevisualizer-cell-char {
      @apply w-2.5;
    }

    &.gtc-filevisualizer-cell-hex {
      @apply w-7;
    }

    &.gtc-filevisualizer-cell-bit,
    &.gtc-filevisualizer-cell-bitflags,
    &.gtc-filevisualizer-cell-boolean {
      @apply bg-green-700/80;
    }

    &.gtc-filevisualizer-cell-int8,
    &.gtc-filevisualizer-cell-uint8 {
      @apply bg-cyan-700/80;
    }

    &.gtc-filevisualizer-cell-int16,
    &.gtc-filevisualizer-cell-uint16 {
      @apply bg-yellow-600/80;
    }

    &.gtc-filevisualizer-cell-int24,
    &.gtc-filevisualizer-cell-uint24 {
      @apply bg-orange-700/80;
    }

    &.gtc-filevisualizer-cell-int32,
    &.gtc-filevisualizer-cell-uint32 {
      @apply bg-red-700/80;
    }

    &.gtc-filevisualizer-cell-int64,
    &.gtc-filevisualizer-cell-uint64 {
      @apply bg-red-800/80;
    }

    &.gtc-filevisualizer-cell-float32 {
      @apply bg-slate-600/80;
    }

    &.gtc-filevisualizer-cell-string {
      @apply bg-indigo-700/80;
    }

    &.gtc-filevisualizer-cell-edited {
      @apply bg-amber-200/80;
    }

    &.gtc-filevisualizer-cell-highlighted {
      @apply text-gray-200;
    }

    &.gtc-filevisualizer-cell-hovered {
      @apply bg-sky-400/80;
    }

    &.gtc-filevisualizer-cell-selected {
      @apply bg-sky-600/80 text-white;

      --animate-color: theme("colors.sky.900");
    }

    &:hover {
      @apply bg-blue-300/80 text-primary-300;
    }

    &.gtc-filevisualizer-cell-edit.gtc-filevisualizer-cell-selected,
    &.gtc-filevisualizer-cell-edited.gtc-filevisualizer-cell-selected {
      @apply bg-yellow-400/80;

      --animate-color: theme("colors.amber.900");
    }
  }

  :global(.gtc-filevisualizer-cellsgrid-hexview) {
    & .gtc-filevisualizer-cell:nth-child(2n),
    & .gtc-filevisualizer-cell:hover:nth-child(2n) {
      @apply text-gray-600;
    }

    & .gtc-filevisualizer-cell-highlighted:nth-child(2n) {
      @apply text-gray-400;
    }
  }

  :global(.gtc-filevisualizer-cellsgrid-hexview.gtc-filevisualizer-selected)
    .gtc-filevisualizer-cell-selected {
    @apply animate-hex;
  }

  :global(.gtc-filevisualizer-cellsgrid-charview.gtc-filevisualizer-selected)
    .gtc-filevisualizer-cell-selected {
    @apply animate-char;
  }
</style>
