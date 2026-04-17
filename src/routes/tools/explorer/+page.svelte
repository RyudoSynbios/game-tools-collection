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
  import { isVMUFile } from "$lib/utils/common/dreamcast/vmu";
  import { isGCMFile } from "$lib/utils/common/gamecube/gcm";
  import { isIso9660File } from "$lib/utils/common/iso9660";
  import { isMemoryCardFile } from "$lib/utils/common/playstation2/memoryCard";
  import { isPSUFile } from "$lib/utils/common/playstation2/psu";
  import { isPSVFile } from "$lib/utils/common/playstation2/psv";
  import { isBackupRam } from "$lib/utils/common/saturn/backupRam";
  import { isGVASFile } from "$lib/utils/gvas";
  import { reset } from "$lib/utils/state";

  import VMU from "./dreamcast/VMU.svelte";
  import GCM from "./gamecube/GCM.svelte";
  import GVAS from "./miscellaneous/GVAS.svelte";
  import Iso9660 from "./miscellaneous/Iso9660.svelte";
  import MemoryCard from "./playstation2/MemoryCard.svelte";
  import PSU from "./playstation2/PSU.svelte";
  import PSV from "./playstation2/PSV.svelte";
  import BackupRam from "./saturn/BackupRam.svelte";

  let fileTypeEl: HTMLSelectElement;

  let platform = "";
  let fileType = "";
  let fileName = "";
  let dataView: DataView = new DataView(new ArrayBuffer(0));
  let error = "";

  const platforms: {
    [key: string]: {
      name: string;
      fileTypes: string[];
    };
  } = {
    gamecube: {
      name: "GameCube",
      fileTypes: ["gamecube_gcm"],
    },
    saturn: {
      name: "Saturn",
      fileTypes: ["saturn_backupRam", "miscellaneous_iso9660"],
    },
    dreamcast: {
      name: "Dreamcast",
      fileTypes: ["dreamcast_vmu"],
    },
    playstation: {
      name: "PlayStation",
      fileTypes: ["miscellaneous_iso9660"],
    },
    playstation2: {
      name: "PlayStation 2",
      fileTypes: [
        "playstation2_memoryCard",
        "playstation2_psu",
        "playstation2_psv",
      ],
    },
    miscellaneous: {
      name: "Miscellaneous",
      fileTypes: ["miscellaneous_gvas", "miscellaneous_iso9660"],
    },
  };

  const tools: {
    [key: string]: {
      name: string;
      fullName: string;
      validator: (dataView: DataView) => boolean;
    };
  } = {
    gamecube_gcm: {
      name: "GCM",
      fullName: "Gamecube - GCM",
      validator: isGCMFile,
    },
    saturn_backupRam: {
      name: "Backup Ram",
      fullName: "Saturn - Backup Ram",
      validator: isBackupRam,
    },
    dreamcast_vmu: {
      name: "VMU",
      fullName: "Dreamcast - VMU",
      validator: isVMUFile,
    },
    playstation2_memoryCard: {
      name: "Memory Card",
      fullName: "PlayStation 2 - Memory Card",
      validator: isMemoryCardFile,
    },
    playstation2_psu: {
      name: "PSU",
      fullName: "PlayStation 2 - PSU",
      validator: isPSUFile,
    },
    playstation2_psv: {
      name: "PSV",
      fullName: "PlayStation 2 - PSV",
      validator: isPSVFile,
    },
    miscellaneous_gvas: {
      name: "GVAS",
      fullName: "GVAS",
      validator: isGVASFile,
    },
    miscellaneous_iso9660: {
      name: "Iso9660",
      fullName: "Iso9660",
      validator: isIso9660File,
    },
  };

  function handleFileEject(): void {
    platform = "";
    fileName = "";
    fileType = "";
    dataView = new DataView(new ArrayBuffer(0));

    reset();
  }

  function onFileUploaded(fileTmp: File, dataViewTmp: DataView): void {
    if (platform === "") {
      Object.entries(tools).some(([subkey, value]) => {
        if (value.validator(dataViewTmp)) {
          fileType = subkey;
        }
      });
    } else {
      const tool = tools[fileTypeEl.value];

      if (typeof tool.validator === "function") {
        if (tool.validator(dataViewTmp)) {
          fileType = fileTypeEl.value;
        }
      }
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
  {#if fileName === ""}
    <Dropzone {onFileUploaded}>
      <svelte:fragment slot="dropzone-inner" let:isDragging let:isFileLoading>
        <p class="gtc-explorer-title">Explorer</p>
        <div class="gtc-explorer-form">
          <select bind:value={platform} on:click|stopPropagation>
            <option value="">Auto-detect</option>
            {#each Object.entries(platforms) as [key, value]}
              <option value={key}>{value.name}</option>
            {/each}
          </select>
          {#if platform}
            <select bind:this={fileTypeEl} on:click|stopPropagation>
              {#each platforms[platform].fileTypes as fileType}
                {@const tool = tools[fileType]}
                <option value={fileType}>{tool.name}</option>
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
        {#if error}
          <p class="gtc-explorer-error">{error}</p>
        {/if}
      </svelte:fragment>
    </Dropzone>
  {:else}
    <div class="gtc-explorer-tool">
      <div class="gtc-explorer-banner">
        <p>{tools[fileType].fullName}</p>
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
        {#if fileType === "gamecube_gcm"}
          <GCM {fileName} {dataView} />
        {:else if fileType === "saturn_backupRam"}
          <BackupRam {fileName} {dataView} />
        {:else if fileType === "dreamcast_vmu"}
          <VMU {fileName} {dataView} />
        {:else if fileType === "playstation2_memoryCard"}
          <MemoryCard {fileName} {dataView} />
        {:else if fileType === "playstation2_psu"}
          <PSU {fileName} {dataView} />
        {:else if fileType === "playstation2_psv"}
          <PSV {fileName} {dataView} />
        {:else if fileType === "miscellaneous_gvas"}
          <GVAS {fileName} {dataView} />
        {:else if fileType === "miscellaneous_iso9660"}
          <Iso9660 {fileName} {dataView} />
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
      @apply mb-2 flex flex-col;

      & select {
        @apply mb-2;
      }
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
