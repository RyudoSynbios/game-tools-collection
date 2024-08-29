<script lang="ts">
  import RegionModal from "$lib/components/RegionModal.svelte";
  import {
    dataView,
    fileHeaderShift,
    fileIsLoading,
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
  let fileNameTmp = "";
  let regions: string[] = [];
  let error = "";

  function handleDrop(event: any): void {
    const files = event.dataTransfer.files;
    const file = files[0];

    handleUploadedFile(file);
  }

  function handleDragLeave(): void {
    isDragging = false;
  }

  function handleDragOver(): void {
    isDragging = true;
  }

  function handleDropzoneClick(): void {
    if (!$fileIsLoading) {
      inputEl.click();
    }
  }

  function handleInputChange(event: Event): void {
    const files = (event.target as HTMLInputElement).files || [];
    const file = files[0];

    handleUploadedFile(file);
  }

  function handleUploadedFile(file: File): void {
    if (file.size === 0) {
      error = $gameTemplate.validator.error;

      return;
    }

    isDragging = false;
    $fileIsLoading = true;

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
        !$gameTemplate.validator.fileNames.includes(file.name)
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

      $fileIsLoading = false;
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

<div class="gtc-dropzone">
  <div
    class="gtc-dropzone-inner"
    class:gtc-dropzone-dragging={isDragging}
    on:click={handleDropzoneClick}
    on:dragleave|preventDefault={handleDragLeave}
    on:dragover|preventDefault={handleDragOver}
    on:drop|preventDefault={handleDrop}
  >
    <img src={logo} alt={name} />
    {#if isDragging}
      <p>Drop the file here.</p>
    {:else if !$fileIsLoading}
      <p>{$gameTemplate.validator?.text || ""}</p>
    {:else}
      <p>Loading...</p>
    {/if}
    {#if $gameTemplate.validator.hint}
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
    @apply p-2 bg-primary-900 rounded select-none;

    width: 600px;
    height: 400px;

    & .gtc-dropzone-inner {
      @apply flex flex-col items-center justify-center p-4 w-full h-full text-white border-2 border-dashed cursor-pointer border-primary-500;

      &.gtc-dropzone-dragging {
      }

      & .gtc-dropzone-hint {
        @apply text-primary-400 text-center;
      }

      & .gtc-dropzone-error {
        @apply text-primary-300 text-center;
      }

      & input {
        @apply hidden;
      }
    }
  }
</style>
