<script lang="ts">
  import { onDestroy } from "svelte";

  import { page } from "$app/state";
  import EjectIcon from "$lib/assets/Eject.svelte";
  import SaveIcon from "$lib/assets/Save.svelte";
  import Dropzone from "$lib/components/Dropzone.svelte";
  import FileVisualizer from "$lib/components/FileVisualizer/FileVisualizer.svelte";
  import { isFileVisualizerOpen } from "$lib/stores";
  import { onSave } from "$lib/stores/explorer";
  import {
    editedOffsets,
    rowsOffset,
    selectedOffset,
  } from "$lib/stores/fileVisualizer";
  import { isVmuFile } from "$lib/utils/common/dreamcast/vmu";
  import { isGCMFile } from "$lib/utils/common/gamecube/gcm";
  import { isIso9660File } from "$lib/utils/common/iso9660";
  import { reset } from "$lib/utils/state";

  import GCM from "./gcm/index.svelte";
  import Iso9660 from "./iso9660/index.svelte";
  import VMU from "./vmu/index.svelte";

  type FileType = "gcm" | "iso9660" | "vmu";

  let typeEl: HTMLSelectElement;

  let fileName = "";
  let fileType: FileType | null = null;
  let dataView: DataView = new DataView(new ArrayBuffer(0));
  let error = "";

  const types: { [key in FileType]: (dataView: DataView) => boolean } = {
    gcm: isGCMFile,
    iso9660: isIso9660File,
    vmu: isVmuFile,
  };

  function handleFileEject(): void {
    fileName = "";
    fileType = null;
    dataView = new DataView(new ArrayBuffer(0));

    reset();
  }

  function onFileUploaded(fileTmp: File, dataViewTmp: DataView): void {
    const type = types[typeEl.value as FileType];

    if (typeof type === "function") {
      if (type(dataViewTmp)) {
        fileType = typeEl.value as FileType;
      }
    } else {
      Object.entries(types).some(([type, cb]) => {
        if (cb(dataViewTmp)) {
          fileType = type as FileType;
        }
      });
    }

    if (fileType) {
      fileName = fileTmp.name;
      dataView = dataViewTmp;
      error = "";
    } else {
      error = "File not handled.";
    }
  }

  isFileVisualizerOpen.subscribe(() => {
    $editedOffsets = [];
    $rowsOffset = 0x0;
    $selectedOffset = 0x0;
  });

  onDestroy(() => {
    reset();
  });
</script>

<svelte:head>
  <title>Explorer | Game Tools Collection</title>
  <meta property="og:title" content="Explorer" />
  <meta property="og:image" content="{page.url.origin}/img/icon.png" />
</svelte:head>

<div class="gtc-explorer">
  {#if fileType === null}
    <Dropzone {onFileUploaded}>
      <svelte:fragment slot="dropzone" let:isDragging let:isFileLoading>
        <p class="gtc-explorer-title">Explorer</p>
        <div class="gtc-explorer-form">
          <select bind:this={typeEl} on:click|stopPropagation>
            <option value="">Auto-detect</option>
            <option value="iso9660">ISO 9660</option>
            <option value="gcm">GCM</option>
            <option value="vmu">VMU</option>
          </select>
        </div>
        {#if isDragging}
          <p>Drop the file here.</p>
        {:else if !isFileLoading}
          <p>Drag 'n' drop here or click to add a file.</p>
        {:else}
          <p>Loading...</p>
        {/if}
        {#if error}
          <p class="gtc-explorer-error">{error}</p>
        {/if}
      </svelte:fragment>
    </Dropzone>
  {:else}
    <div class="gtc-explorer-tool">
      <div class="gtc-explorer-banner">
        <p>{fileType.toUpperCase()}</p>
        <div>
          <button
            type="button"
            class="gtc-explorer-eject"
            on:click={handleFileEject}
          >
            <EjectIcon /> Eject
          </button>
          <button type="button" class="gtc-tool-save" on:click={$onSave}>
            <SaveIcon /> Save
          </button>
        </div>
      </div>
      <div class="gtc-explorer-content">
        {#if fileType === "gcm"}
          <GCM {fileName} {dataView} />
        {:else if fileType === "iso9660"}
          <Iso9660 {fileName} {dataView} />
        {:else if fileType === "vmu"}
          <VMU {fileName} {dataView} />
        {/if}
      </div>
    </div>
    {#if $isFileVisualizerOpen}
      <FileVisualizer />
    {/if}
  {/if}
</div>

<style lang="postcss">
  .gtc-explorer {
    @apply flex flex-1 flex-col;

    & .gtc-explorer-title {
      @apply mb-4 text-xl;
    }

    & .gtc-explorer-form {
      @apply mb-4 flex;
    }

    & .gtc-explorer-error {
      @apply text-center text-primary-300;
    }

    & .gtc-explorer-tool {
      @apply flex-1;

      & .gtc-explorer-banner {
        @apply mb-4 flex h-10 items-center justify-between;

        & div {
          @apply flex;

          & button {
            @apply ml-2 flex;

            &.gtc-explorer-eject {
              @apply bg-red-900 text-red-100;

              &:hover {
                @apply bg-red-700;
              }
            }

            &.gtc-tool-save {
              @apply bg-green-900 text-green-100;

              &:hover {
                @apply bg-green-700;
              }
            }

            & :global(svg) {
              @apply -ml-1 mr-2 h-5 w-5;
            }
          }
        }
      }
    }

    & .gtc-explorer-content {
      @apply flex overflow-auto;

      height: calc(100vh - 144px);
    }
  }
</style>
