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
  import PSV from "$lib/utils/common/playstation/psv";

  export let fileName = "";
  export let dataView: DataView;

  const psv = new PSV(dataView);

  function handleFileClick(file: File): void {
    const data = psv.getFile();

    $dataViewStore = new DataView(data.buffer);
    $fileNameStore = `${file.productCode} [${file.identifier}]`;
    $isFileVisualizerOpen = true;
  }

  isFileVisualizerOpen.subscribe((isOpen) => {
    if (!isOpen && $fileNameStore) {
      psv.writeFile(new Uint8Array($dataViewStore.buffer));
      
      $dataViewStore = new DataView(new ArrayBuffer(0));
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
    <Directory
      content={psv.root.map((file) => ({
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
  .gtc-psv {
    @apply w-1/2 overflow-auto rounded bg-primary-700 p-2;
  }
</style>
