<script lang="ts">
  import FileSaver from "file-saver";
  import { onDestroy, onMount } from "svelte";

  import Directory from "$lib/components/Explorer/Directory.svelte";
  import {
    dataView as dataViewStore,
    fileName as fileNameStore,
    isFileVisualizerOpen,
  } from "$lib/stores";
  import { onSave } from "$lib/stores/explorer";
  import type { File } from "$lib/utils/common/playstation2";
  import MemoryCard from "$lib/utils/common/playstation2/memoryCard";

  export let fileName = "";
  export let dataView: DataView;

  const memoryCard = new MemoryCard(dataView, { hideWorkingDirectories: true });

  let currentFile: File;

  function handleFileClick(entry: File): void {
    const file = memoryCard.getFile(entry.path);

    if (file) {
      currentFile = file;
      $dataViewStore = file.dataView;
      $fileNameStore = file.name;
      $isFileVisualizerOpen = true;
    }
  }

  isFileVisualizerOpen.subscribe((isOpen) => {
    if (!isOpen && $fileNameStore) {
      memoryCard.writeFile(
        currentFile.path,
        new Uint8Array($dataViewStore.buffer),
      );
    }
  });

  onMount(() => {
    $onSave = () => {
      const buffer = memoryCard.repack() as ArrayBuffer;

      const blob = new Blob([buffer], {
        type: "application/octet-stream",
      });

      FileSaver.saveAs(blob, fileName);
    };
  });

  onDestroy(() => {
    memoryCard.destroy();
  });
</script>

{#if memoryCard}
  <div class="gtc-memorycard">
    <Directory content={memoryCard.root} expanded onFileClick={handleFileClick}>
      {fileName}
    </Directory>
  </div>
{/if}

<style lang="postcss">
  .gtc-memorycard {
    @apply w-1/2 overflow-auto rounded bg-primary-700 p-2;
  }
</style>
