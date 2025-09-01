<script lang="ts">
  import FileSaver from "file-saver";

  import { page } from "$app/state";
  import { byteswap } from "$lib/utils/bytes";

  let inputEl: HTMLInputElement;
  let isDragging = false;
  let fileIsLoading = false;

  function handleDragLeave(): void {
    isDragging = false;
  }

  function handleDragOver(): void {
    isDragging = true;
  }

  function handleDrop(event: DragEvent): void {
    const files = event.dataTransfer?.files;

    if (files) {
      const file = files[0];

      handleUploadedFile(file);
    }
  }

  function handleDropzoneClick(): void {
    if (!fileIsLoading) {
      inputEl.click();
    }
  }

  function handleInputChange(event: Event): void {
    const files = (event.target as HTMLInputElement).files || [];
    const file = files[0];

    handleUploadedFile(file);
  }

  function handleUploadedFile(file: File): void {
    if (!file || file.size === 0) {
      return;
    }

    isDragging = false;
    fileIsLoading = true;

    const fileReader = new FileReader();

    fileReader.onload = (event: ProgressEvent<FileReader>) => {
      const dataView = new DataView(event.target?.result as ArrayBufferLike);

      const buffer = byteswap(dataView).buffer as ArrayBuffer;

      const blob = new Blob([buffer], {
        type: "application/octet-stream",
      });

      FileSaver.saveAs(blob, file.name);

      fileIsLoading = false;
    };

    fileReader.readAsArrayBuffer(file);
  }
</script>

<svelte:head>
  <title>Byteswap | Game Tools Collection</title>
  <meta property="og:title" content="Byteswap" />
  <meta property="og:image" content="{page.url.origin}/img/icon.png" />
</svelte:head>

<!-- svelte-ignore a11y-click-events-have-key-events -->
<!-- svelte-ignore a11y-no-static-element-interactions -->
<div class="gtc-byteswap">
  <div
    class="gtc-byteswap-inner"
    on:click={handleDropzoneClick}
    on:dragleave|preventDefault={handleDragLeave}
    on:dragover|preventDefault={handleDragOver}
    on:drop|preventDefault={handleDrop}
  >
    <p class="gtc-byteswap-title">Byteswap</p>
    {#if isDragging}
      <p>Drop the file here.</p>
    {:else if !fileIsLoading}
      <p>Drag 'n' drop here or click to add a file to convert.</p>
    {:else}
      <p>Converting...</p>
    {/if}
    <p class="gtc-byteswap-hint">
      This tool will convert the endianness of a binary file.
    </p>
    <input type="file" bind:this={inputEl} on:change={handleInputChange} />
  </div>
</div>

<style lang="postcss">
  .gtc-byteswap {
    @apply m-auto select-none rounded bg-primary-900 p-2;

    width: 600px;
    height: 400px;

    & .gtc-byteswap-inner {
      @apply flex h-full w-full cursor-pointer flex-col items-center justify-center border-2 border-dashed border-primary-500 p-4 text-white;

      & .gtc-byteswap-title {
        @apply mb-4 text-xl;
      }

      & .gtc-byteswap-hint {
        @apply whitespace-pre-line text-center text-primary-400;
      }

      & input {
        @apply hidden;
      }
    }
  }
</style>
