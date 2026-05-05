<script lang="ts">
  import FileSaver from "file-saver";

  import { page } from "$app/state";
  import Dropzone from "$lib/components/Dropzone.svelte";
  import { byteswap } from "$lib/utils/bytes";

  const metaTitle = "Byteswap";
  const metaDescription = "Byteswap your binary files.";
  const metaImage = `${page.url.origin}/img/icon.png`;

  function onFileUploaded(file: File, dataView: DataView): void {
    const buffer = byteswap(dataView).buffer as ArrayBuffer;

    const blob = new Blob([buffer], {
      type: "application/octet-stream",
    });

    FileSaver.saveAs(blob, file.name);
  }
</script>

<svelte:head>
  <title>{metaTitle} | Game Tools Collection</title>
  <meta property="og:title" content={metaTitle} />
  <meta property="description" content={metaDescription} />
  <meta property="og:description" content={metaDescription} />
  <meta property="og:image" content={metaImage} />
</svelte:head>

<Dropzone {onFileUploaded}>
  <svelte:fragment slot="dropzone-inner" let:isDragging let:isFileLoading>
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
