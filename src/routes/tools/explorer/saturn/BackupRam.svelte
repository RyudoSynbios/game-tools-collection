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
  import BackupRam, { type File } from "$lib/utils/common/saturn/backupRam";

  export let fileName = "";
  export let dataView: DataView;

  const backupram = new BackupRam(dataView);

  let currentFile: File;

  function handleFileClick(file: File): void {
    const data = backupram.getFile(file);

    currentFile = file;

    $dataViewStore = new DataView(data.buffer);
    $fileNameStore = file.name;
    $isFileVisualizerOpen = true;
  }

  isFileVisualizerOpen.subscribe((isOpen) => {
    if (!isOpen && $fileNameStore) {
      backupram.writeFile(currentFile, new Uint8Array($dataViewStore.buffer));
      
      $dataViewStore = new DataView(new ArrayBuffer(0));
    }
  });

  onMount(() => {
    $onSave = () => {
      const buffer = backupram.repack() as ArrayBuffer;

      const blob = new Blob([buffer], {
        type: "application/octet-stream",
      });

      FileSaver.saveAs(blob, fileName);
    };
  });

  onDestroy(() => {
    backupram.destroy();
  });
</script>

{#if backupram}
  <div class="gtc-backupram">
    <Directory
      content={backupram.root.map((file) => ({
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
  .gtc-backupram {
    @apply w-1/2 overflow-auto rounded bg-primary-700 p-2;
  }
</style>
