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
  import PSV from "$lib/utils/common/playstation2/psv";

  export let fileName = "";
  export let dataView: DataView;

  const psv = new PSV(dataView);

  let currentFile: File;

  function handleFileClick(entry: File): void {
    const file = psv.getFile(entry.path);

    if (file) {
      currentFile = file;
      $dataViewStore = file.dataView;
      $fileNameStore = file.name;
      $isFileVisualizerOpen = true;
    }
  }

  isFileVisualizerOpen.subscribe((isOpen) => {
    if (!isOpen && $fileNameStore) {
      psv.writeFile(currentFile.path, new Uint8Array($dataViewStore.buffer));
    }
  });

  onMount(() => {
    $onSave = () => {
      const buffer = psv.repack() as ArrayBuffer;

      const blob = new Blob([buffer], {
        type: "application/octet-stream",
      });

      FileSaver.saveAs(blob, fileName);
    };
  });

  onDestroy(() => {
    psv.destroy();
  });
</script>

{#if psv}
  <div class="gtc-psv">
    <Directory content={psv.root} expanded onFileClick={handleFileClick}>
      {fileName}
    </Directory>
  </div>
{/if}

<style lang="postcss">
  .gtc-psv {
    @apply w-1/2 overflow-auto rounded bg-primary-700 p-2;
  }
</style>
