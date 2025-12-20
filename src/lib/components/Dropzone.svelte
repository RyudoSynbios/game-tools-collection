<script lang="ts">
  export let onFileFailed: (file: File) => void = () => {};
  export let onFileUploaded: (
    file: File,
    dataView: DataView,
  ) => void | Promise<void>;

  let inputEl: HTMLInputElement;

  let isDragging = false;
  let isFileLoading = false;

  function handleDragLeave(): void {
    isDragging = false;
  }

  function handleDragOver(): void {
    isDragging = true;
  }

  function handleDrop(event: DragEvent): void {
    isDragging = false;

    const files = event.dataTransfer?.files;

    if (files) {
      const file = files[0];

      handleUploadedFile(file);
    }
  }

  function handleDropzoneClick(): void {
    if (!isFileLoading) {
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
      if (typeof onFileFailed === "function") {
        onFileFailed(file);
      }

      return;
    }

    isFileLoading = true;

    const fileReader = new FileReader();

    fileReader.onload = async (event: ProgressEvent<FileReader>) => {
      const dataView = new DataView(event.target?.result as ArrayBufferLike);

      await onFileUploaded(file, dataView);

      isFileLoading = false;
    };

    fileReader.readAsArrayBuffer(file);
  }
</script>

<!-- svelte-ignore a11y-click-events-have-key-events -->
<!-- svelte-ignore a11y-no-static-element-interactions -->
<div class="gtc-dropzone">
  <div
    class="gtc-dropzone-inner"
    on:click={handleDropzoneClick}
    on:dragleave|preventDefault={handleDragLeave}
    on:dragover|preventDefault={handleDragOver}
    on:drop|preventDefault={handleDrop}
  >
    <slot name="dropzone" {isDragging} {isFileLoading} />
    <input type="file" bind:this={inputEl} on:change={handleInputChange} />
  </div>
</div>

<style lang="postcss">
  .gtc-dropzone {
    @apply m-auto select-none rounded bg-primary-900 p-2;

    width: 600px;
    min-height: 400px;

    & .gtc-dropzone-inner {
      @apply flex h-full w-full cursor-pointer flex-col items-center justify-center border-2 border-dashed border-primary-500 p-4 text-white;

      & input[type="file"] {
        @apply hidden;
      }
    }
  }
</style>
