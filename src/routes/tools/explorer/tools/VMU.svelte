<script lang="ts">
  import {
    dataView as dataViewStore,
    fileName as fileNameStore,
    isFileVisualizerOpen,
  } from "$lib/stores";
  import VMU, { type File } from "$lib/utils/common/dreamcast/vmu";

  import Directory from "../components/Directory.svelte";

  export let fileName = "";
  export let dataView: DataView;

  const vmu = new VMU(dataView);

  function handleFileClick(file: File): void {
    const data = vmu.getFile(file);

    $dataViewStore = new DataView(data.buffer);
    $fileNameStore = file.name;
    $isFileVisualizerOpen = true;
  }
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
