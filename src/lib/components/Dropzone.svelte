<script lang="ts">
  import RegionModal from "$lib/components/RegionModal.svelte";
  import {
    dataView,
    fileHeaderShift,
    fileName,
    gameRegion,
    gameTemplate,
    gameUtils,
  } from "$lib/stores";
  import { utilsExists } from "$lib/utils/format";
  import { enrichGameJson } from "$lib/utils/parser";
  import { getRegionIndex, getRegions } from "$lib/utils/validator";

  export let logo = "";
  export let name = "";

  let inputEl: HTMLInputElement;
  let isDragging = false;
  let dataViewTmp: DataView | undefined;
  let fileHeaderShiftTmp = 0x0;
  let fileIsLoading = false;
  let fileNameTmp = "";
  let regions: string[] = [];
  let error = "";

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
      error = $gameTemplate.validator.error;
      return;
    }

    isDragging = false;
    fileIsLoading = true;

    const fileReader = new FileReader();

    fileReader.onload = (event: ProgressEvent<FileReader>) => {
      dataViewTmp = new DataView(event.target?.result as ArrayBufferLike);
      fileNameTmp = file.name;
      fileHeaderShiftTmp = 0x0;

      if (utilsExists("initHeaderShift")) {
        fileHeaderShiftTmp = $gameUtils.initHeaderShift(dataViewTmp);
      }

      if (utilsExists("beforeInitDataView")) {
        dataViewTmp = $gameUtils.beforeInitDataView(
          dataViewTmp,
          fileHeaderShiftTmp,
        );
      }

      if (utilsExists("overrideGetRegions")) {
        regions = $gameUtils.overrideGetRegions(
          dataViewTmp,
          fileHeaderShiftTmp,
        );
      } else {
        regions = getRegions(dataViewTmp as DataView, fileHeaderShiftTmp);
      }

      if (
        $gameTemplate.validator.fileNames &&
        !$gameTemplate.validator.fileNames.find((fileName) => {
          if (typeof fileName === "object") {
            return file.name.match(fileName);
          } else if (typeof fileName === "string") {
            return fileName === file.name;
          }
        })
      ) {
        regions = [];
      }

      if (regions.length === 1) {
        initTool(regions[0]);
      } else if (regions.length === 0) {
        if (utilsExists("onInitFailed")) {
          $gameUtils.onInitFailed();
        }

        error = $gameTemplate.validator.error;
      }

      fileIsLoading = false;
    };

    fileReader.readAsArrayBuffer(file);
  }

  function initTool(region: string): void {
    const regionIndex = getRegionIndex(region);

    if (regionIndex !== -1) {
      $dataView = dataViewTmp as DataView;
      $fileHeaderShift = fileHeaderShiftTmp;
      $fileName = fileNameTmp;
      $gameRegion = regionIndex;

      enrichGameJson();

      error = "";
    } else {
      regions = [];
      error = $gameTemplate.validator.error;
    }

    dataViewTmp = undefined;
    fileNameTmp = "";
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
    <img src={logo} alt={name} />
    {#if isDragging}
      <p>Drop the file here.</p>
    {:else if !fileIsLoading}
      <p>{$gameTemplate.validator?.text || ""}</p>
    {:else}
      <p>Loading...</p>
    {/if}
    {#if $gameTemplate?.validator?.hint}
      <p class="gtc-dropzone-hint">{@html $gameTemplate.validator.hint}</p>
    {/if}
    {#if error}
      <p class="gtc-dropzone-error">{@html $gameTemplate.validator.error}</p>
    {/if}
    <input type="file" bind:this={inputEl} on:change={handleInputChange} />
  </div>
  {#if regions.length > 1}
    <RegionModal {regions} onSubmit={(region) => initTool(region)} />
  {/if}
</div>

<style lang="postcss">
  .gtc-dropzone {
    @apply select-none rounded bg-primary-900 p-2;

    width: 600px;
    height: 400px;

    & .gtc-dropzone-inner {
      @apply flex h-full w-full cursor-pointer flex-col items-center justify-center border-2 border-dashed border-primary-500 p-4 text-white;

      & .gtc-dropzone-hint {
        @apply whitespace-pre-line text-center text-primary-400;
      }

      & .gtc-dropzone-error {
        @apply text-center text-primary-300;
      }

      & input {
        @apply hidden;
      }
    }
  }
</style>
