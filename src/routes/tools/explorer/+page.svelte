<script lang="ts">
  import { onDestroy } from "svelte";

  import { page } from "$app/state";
  import EjectIcon from "$lib/assets/Eject.svelte";
  import Dropzone from "$lib/components/Dropzone.svelte";
  import FileVisualizer from "$lib/components/FileVisualizer/FileVisualizer.svelte";
  import { isFileVisualizerOpen } from "$lib/stores";
  import { editedOffsets, selectedOffset } from "$lib/stores/fileVisualizer";
  import { isVmuFile } from "$lib/utils/common/dreamcast/vmu";
  import { isIso9660Valid } from "$lib/utils/common/iso9660";
  import { reset } from "$lib/utils/state";

  import Iso9660 from "./tools/Iso9660/index.svelte";
  import VMU from "./tools/VMU.svelte";

  type FileType = "iso9660" | "vmu";

  let typeEl: HTMLSelectElement;

  let fileName = "";
  let fileType: FileType | null = null;
  let dataView: DataView = new DataView(new ArrayBuffer(0));
  let error = "";

  const types: { [key in FileType]: (dataView: DataView) => boolean } = {
    iso9660: isIso9660Valid,
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

    if (type) {
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
        </div>
      </div>
      <div class="gtc-explorer-content">
        {#if fileType === "iso9660"}
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

    .gtc-explorer-tool {
      @apply flex-1;

      & .gtc-explorer-banner {
        @apply mb-4 flex h-10 items-center justify-between;

        & button {
          @apply ml-2 flex;

          &.gtc-explorer-eject {
            @apply bg-red-900 text-red-100;

            &:hover {
              @apply bg-red-700;
            }
          }

          & :global(svg) {
            @apply -ml-1 mr-2 h-5 w-5;
          }
        }
      }
    }

    .gtc-explorer-content {
      @apply flex overflow-auto;

      height: calc(100vh - 144px);
    }
  }
</style>
