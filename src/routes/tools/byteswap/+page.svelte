<script lang="ts">
  import FileSaver from "file-saver";

  import { page } from "$app/state";
  import { byteswap } from "$lib/utils/bytes";

  let inputEl = $state<HTMLInputElement>()!;
  let isDragging = $state(false);
  let fileIsLoading = $state(false);

  function handleDragLeave(event: DragEvent): void {
    event.preventDefault();

    isDragging = false;
  }

  function handleDragOver(event: DragEvent): void {
    event.preventDefault();

    isDragging = true;
  }

  function handleDrop(event: DragEvent): void {
    event.preventDefault();

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

      const dataViewByteswapped = byteswap(dataView);

      const data = new Uint8Array(dataViewByteswapped.buffer);

      const blob = new Blob([data], {
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

<!-- svelte-ignore a11y_click_events_have_key_events -->
<!-- svelte-ignore a11y_no_static_element_interactions -->
<div class="gtc-byteswap">
  <div
    class="gtc-byteswap-inner"
    onclick={handleDropzoneClick}
    ondragleave={handleDragLeave}
    ondragover={handleDragOver}
    ondrop={handleDrop}
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
    <input type="file" bind:this={inputEl} onchange={handleInputChange} />
  </div>
</div>

<style lang="postcss">
  @reference "../../../app.css";

  .gtc-byteswap {
    @apply bg-primary-900 m-auto rounded p-2 select-none;

    width: 600px;
    height: 400px;

    & .gtc-byteswap-inner {
      @apply border-primary-500 flex h-full w-full cursor-pointer flex-col items-center justify-center border-2 border-dashed p-4 text-white;

      & .gtc-byteswap-title {
        @apply mb-4 text-xl;
      }

      & .gtc-byteswap-hint {
        @apply text-primary-400 text-center whitespace-pre-line;
      }

      & input {
        @apply hidden;
      }
    }
  }
</style>
