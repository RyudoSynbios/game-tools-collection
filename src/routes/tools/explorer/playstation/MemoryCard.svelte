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
  import type { File } from "$lib/utils/common/playstation";
  import MemoryCard from "$lib/utils/common/playstation/memoryCard";

  export let fileName = "";
  export let dataView: DataView;

  const memoryCard = new MemoryCard(dataView);

  let currentFile: File;

  function handleFileClick(file: File): void {
    const data = memoryCard.getFile(file);

    currentFile = file;

    $dataViewStore = new DataView(data.buffer);
    $fileNameStore = `${file.productCode} [${file.identifier}]`;
    $isFileVisualizerOpen = true;
  }

  isFileVisualizerOpen.subscribe((isOpen) => {
    if (!isOpen && $fileNameStore) {
      memoryCard.writeFile(currentFile, new Uint8Array($dataViewStore.buffer));
      
      $dataViewStore = new DataView(new ArrayBuffer(0));
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
    <Directory
      content={memoryCard.root.map((file) => ({
        ...file,
        type: "file",
        name: `${file.productCode} [${file.identifier}]`,
      }))}
      expanded
      onFileClick={handleFileClick}
    >
      {fileName}
    </Directory>
  </div>
{/if}

<style lang="postcss">
  .gtc-memorycard {
    @apply w-1/2 overflow-auto rounded bg-primary-700 p-2;
  }
</style>
