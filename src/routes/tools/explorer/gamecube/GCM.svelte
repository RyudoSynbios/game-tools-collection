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
  import GCM, { type File } from "$lib/utils/common/gamecube/gcm";

  export let fileName = "";
  export let dataView: DataView;

  const gcm = new GCM(dataView);

  let currentFile: File;

  function handleFileClick(entry: File): void {
    const file = gcm.getFile(entry.path);

    if (file) {
      currentFile = file;

      $dataViewStore = file.dataView;
      $fileNameStore = file.name;
      $isFileVisualizerOpen = true;
    }
  }

  isFileVisualizerOpen.subscribe((isOpen) => {
    if (!isOpen && $fileNameStore) {
      gcm.writeFile(currentFile.path, $dataViewStore);
      
      $dataViewStore = new DataView(new ArrayBuffer(0));
    }
  });

  onMount(() => {
    $onSave = () => {
      const buffer = gcm.rebuild() as ArrayBuffer;

      const blob = new Blob([buffer], {
        type: "application/octet-stream",
      });

      FileSaver.saveAs(blob, fileName);
    };
  });

  onDestroy(() => {
    gcm.destroy();
  });
</script>

<div class="gtc-gcm">
  <Directory content={gcm.root} expanded onFileClick={handleFileClick}>
    {fileName}
  </Directory>
</div>

<style lang="postcss">
  .gtc-gcm {
    @apply w-1/2 overflow-auto rounded bg-primary-700 p-2;
  }
</style>
