<script lang="ts">
  import FileSaver from "file-saver";
  import { onMount } from "svelte";

  import Directory from "$lib/components/Explorer/Directory.svelte";
  import {
    dataView as dataViewStore,
    fileName as fileNameStore,
    isFileVisualizerOpen,
  } from "$lib/stores";
  import { onSave } from "$lib/stores/explorer";
  import Iso9660, { type File } from "$lib/utils/common/iso9660";

  export let fileName = "";
  export let dataView: DataView;

  const iso = new Iso9660(dataView, { hideWorkingDirectories: true });

  let currentFile: File;

  function handleFileClick(entry: File): void {
    const file = iso.getFile(entry.path);

    if (file) {
      currentFile = file;

      $dataViewStore = file.dataView;
      $fileNameStore = file.name;
      $isFileVisualizerOpen = true;
    }
  }

  isFileVisualizerOpen.subscribe((isOpen) => {
    if (!isOpen && $fileNameStore) {
      iso.writeFile(currentFile.path, $dataViewStore);
      
      $dataViewStore = new DataView(new ArrayBuffer(0));
    }
  });

  onMount(() => {
    $onSave = () => {
      const buffer = iso.buffer as ArrayBuffer;

      const blob = new Blob([buffer], {
        type: "application/octet-stream",
      });

      FileSaver.saveAs(blob, fileName);
    };
  });
</script>

<div class="gtc-iso9660">
  <Directory content={iso.root} expanded onFileClick={handleFileClick}>
    {fileName}
  </Directory>
</div>

<style lang="postcss">
  .gtc-iso9660 {
    @apply w-1/2 overflow-auto rounded bg-primary-700 p-2;
  }
</style>
