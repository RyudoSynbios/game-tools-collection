<script lang="ts">
  import FileSaver from "file-saver";

  import { page } from "$app/state";
  import Dropzone from "$lib/components/Dropzone.svelte";
  import Iso9660, { isIso9660Valid } from "$lib/utils/common/iso9660";

  let typeEl: HTMLSelectElement;

  let iso: Iso9660 | undefined;

  function handleExportFile(event: Event): void {
    if (iso === undefined) {
      return;
    }

    let target = event.target as HTMLInputElement;

    const file = iso.getFile(target.value);

    if (file) {
      const buffer = file.dataView.buffer as ArrayBuffer;

      const blob = new Blob([buffer], {
        type: "application/octet-stream",
      });

      FileSaver.saveAs(blob, file.name);
    }

    target.value = "";
  }

  function handleIso9660(dataView: DataView): void {
    iso = new Iso9660(dataView);

    if (!isIso9660Valid(dataView)) {
      iso = undefined;
    } else {
      console.log(iso.getFiles());
    }
  }

  function handleOffsetChange(event: Event): void {
    if (iso === undefined) {
      return;
    }

    const target = event.target as HTMLInputElement;

    const files = iso.getFiles();

    if (target.value) {
      const offset = parseInt(target.value);

      files.forEach((file) => {
        if (file.offset <= offset && offset <= file.offset + file.size) {
          console.log(file.path);
        }
      });
    } else {
      console.log(files);
    }
  }

  function onFileUploaded(file: File, dataView: DataView): void {
    switch (typeEl.value) {
      case "iso9660":
        handleIso9660(dataView);
        break;
    }
  }
</script>

<svelte:head>
  <title>Explorer | Game Tools Collection</title>
  <meta property="og:title" content="Explorer" />
  <meta property="og:image" content="{page.url.origin}/img/icon.png" />
</svelte:head>

<Dropzone {onFileUploaded}>
  <svelte:fragment slot="dropzone" let:isDragging let:isFileLoading>
    <p class="gtc-explorer-title">Explorer</p>
    <div class="gtc-explorer-form">
      <select bind:this={typeEl} on:click|stopPropagation>
        <option value="iso9660">ISO 9660</option>
      </select>
      {#if iso !== undefined}
        <input
          placeholder="Offset"
          on:change={handleOffsetChange}
          on:click|stopPropagation
        />
        <select on:change={handleExportFile} on:click|stopPropagation>
          <option value="">Export file</option>
          {#each iso.getFiles() as file}
            <option value={file.path}>{file.path}</option>
          {/each}
        </select>
      {/if}
    </div>
    {#if isDragging}
      <p>Drop the file here.</p>
    {:else if !isFileLoading}
      <p>Drag 'n' drop here or click to add a file.</p>
    {:else}
      <p>Loading...</p>
    {/if}
  </svelte:fragment>
</Dropzone>

<style lang="postcss">
  .gtc-explorer-title {
    @apply mb-4 text-xl;
  }

  .gtc-explorer-form {
    @apply mb-4 flex flex-col;

    & input,
    & select {
      @apply mb-2;
    }
  }
</style>
