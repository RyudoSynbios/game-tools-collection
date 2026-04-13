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
  import VMU, { type File } from "$lib/utils/common/dreamcast/vmu";

  export let fileName = "";
  export let dataView: DataView;

  const vmu = new VMU(dataView);

  let currentFile: File;

  function handleFileClick(file: File): void {
    const data = vmu.getFile(file);

    currentFile = file;

    $dataViewStore = new DataView(data.buffer);
    $fileNameStore = file.name;
    $isFileVisualizerOpen = true;
  }

  isFileVisualizerOpen.subscribe((isOpen) => {
    if (!isOpen && $fileNameStore) {
      vmu.writeFile(currentFile, new Uint8Array($dataViewStore.buffer));
    }
  });

  onMount(() => {
    $onSave = () => {
      const buffer = vmu.repack() as ArrayBuffer;

      const blob = new Blob([buffer], {
        type: "application/octet-stream",
      });

      FileSaver.saveAs(blob, fileName);
    };
  });

  onDestroy(() => {
    vmu.destroy();
  });
</script>

{#if vmu}
  <div class="gtc-vmu">
    <Directory
      content={vmu.root.map((file) => ({
        ...file,
        type: "file",
      }))}
      expanded
      onFileClick={handleFileClick}
    >
      {fileName}
    </Directory>
  </div>
{/if}

<style lang="postcss">
  .gtc-vmu {
    @apply w-1/2 overflow-auto rounded bg-primary-700 p-2;
  }
</style>
