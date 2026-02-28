<script lang="ts">
  import {
    dataView as dataViewStore,
    fileName as fileNameStore,
    isFileVisualizerOpen,
  } from "$lib/stores";
  import Iso9660, { type File } from "$lib/utils/common/iso9660";

  import Directory from "../../components/Directory.svelte";

  export let fileName = "";
  export let dataView: DataView;

  const iso = new Iso9660(dataView, { hideWorkingDirectories: true });

  function handleFileClick(entry: File): void {
    const file = iso.getFile(entry.path);

    if (file) {
      $dataViewStore = file.dataView;
      $fileNameStore = file.name;
      $isFileVisualizerOpen = true;
    }
  }
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
