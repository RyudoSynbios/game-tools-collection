<script lang="ts">
  import { page } from "$app/state";
  import Iso9660, { isIso9660Valid } from "$lib/utils/common/iso9660";

  let inputEl: HTMLInputElement;
  let typeEl: HTMLSelectElement;
  let isDragging = false;
  let fileIsLoading = false;

  let iso: Iso9660 | undefined;

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

  function handleIso9660(dataView: DataView): void {
    iso = new Iso9660(dataView);

    if (!isIso9660Valid(dataView)) {
      iso = undefined;
    } else {
      console.log(iso.getFiles());
    }
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

      switch (typeEl.value) {
        case "iso9660":
          handleIso9660(dataView);
          break;
      }

      fileIsLoading = false;
    };

    fileReader.readAsArrayBuffer(file);
  }

  function handleOffsetChange(event: Event): void {
    if (iso === undefined) {
      return;
    }

    const target = event.target as HTMLInputElement;

    const files = iso.getFiles();

    if (target.value) {
      const offset = parseInt(target.value, 16);

      files.forEach((file) => {
        if (file.offset <= offset && offset <= file.offset + file.size) {
          console.log(file.path);
        }
      });
    } else {
      console.log(files);
    }
  }
</script>

<svelte:head>
  <title>Explorer | Game Tools Collection</title>
  <meta property="og:title" content="Explorer" />
  <meta property="og:image" content="{page.url.origin}/img/icon.png" />
</svelte:head>

<!-- svelte-ignore a11y-click-events-have-key-events -->
<!-- svelte-ignore a11y-no-static-element-interactions -->
<div class="gtc-explorer">
  <div
    class="gtc-explorer-inner"
    on:click={handleDropzoneClick}
    on:dragleave|preventDefault={handleDragLeave}
    on:dragover|preventDefault={handleDragOver}
    on:drop|preventDefault={handleDrop}
  >
    <p class="gtc-explorer-title">Explorer</p>
    <div class="gtc-explorer-form">
      <select bind:this={typeEl} on:click|stopPropagation>
        <option value="iso9660">ISO 9660</option>
      </select>
      <input
        placeholder="Offset"
        disabled={iso === undefined}
        on:change={handleOffsetChange}
        on:click|stopPropagation
      />
    </div>
    {#if isDragging}
      <p>Drop the file here.</p>
    {:else if !fileIsLoading}
      <p>Drag 'n' drop here or click to add a file.</p>
    {:else}
      <p>Loading...</p>
    {/if}
    <input type="file" bind:this={inputEl} on:change={handleInputChange} />
  </div>
</div>

<style lang="postcss">
  .gtc-explorer {
    @apply m-auto select-none rounded bg-primary-900 p-2;

    width: 600px;
    height: 400px;

    & .gtc-explorer-inner {
      @apply flex h-full w-full cursor-pointer flex-col items-center justify-center border-2 border-dashed border-primary-500 p-4 text-white;

      & .gtc-explorer-title {
        @apply mb-4 text-xl;
      }

      & .gtc-explorer-form {
        @apply mb-4 flex flex-col;

        & select {
          @apply mb-2;
        }
      }

      & input[type="file"] {
        @apply hidden;
      }
    }
  }
</style>
