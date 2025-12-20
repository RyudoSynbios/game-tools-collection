<script lang="ts">
  import FileSaver from "file-saver";

  import { page } from "$app/state";
  import Dropzone from "$lib/components/Dropzone.svelte";
  import { byteswap } from "$lib/utils/bytes";

  function onFileUploaded(file: File, dataView: DataView): void {
    const buffer = byteswap(dataView).buffer as ArrayBuffer;

    const blob = new Blob([buffer], {
      type: "application/octet-stream",
    });

    FileSaver.saveAs(blob, file.name);
  }
</script>

<svelte:head>
  <title>Byteswap | Game Tools Collection</title>
  <meta property="og:title" content="Byteswap" />
  <meta property="og:image" content="{page.url.origin}/img/icon.png" />
</svelte:head>

<Dropzone {onFileUploaded}>
  <svelte:fragment slot="dropzone" let:isDragging let:isFileLoading>
    <p class="gtc-byteswap-title">Byteswap</p>
    {#if isDragging}
      <p>Drop the file here.</p>
    {:else if !isFileLoading}
      <p>Drag 'n' drop here or click to add a file to convert.</p>
    {:else}
      <p>Converting...</p>
    {/if}
    <p class="gtc-byteswap-hint">
      This tool will convert the endianness of a binary file.
    </p>
  </svelte:fragment>
</Dropzone>

<style lang="postcss">
  .gtc-byteswap-title {
    @apply mb-4 text-xl;
  }

  .gtc-byteswap-hint {
    @apply whitespace-pre-line text-center text-primary-400;
  }
</style>
