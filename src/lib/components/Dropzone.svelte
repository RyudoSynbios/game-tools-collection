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

  interface Props {
    logo: string;
    name: string;
  }

  let { logo, name }: Props = $props();

  let inputEl = $state<HTMLInputElement>()!;
  let isDragging = $state(false);
  let dataViewTmp: DataView | undefined;
  let fileHeaderShiftTmp = 0x0;
  let fileIsLoading = $state(false);
  let fileNameTmp = "";
  let regions: string[] = $state([]);
  let error = $state("");

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

<!-- svelte-ignore a11y_click_events_have_key_events -->
<!-- svelte-ignore a11y_no_static_element_interactions -->
<div class="gtc-dropzone">
  <div
    class="gtc-dropzone-inner"
    onclick={handleDropzoneClick}
    ondragleave={handleDragLeave}
    ondragover={handleDragOver}
    ondrop={handleDrop}
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
    <input type="file" bind:this={inputEl} onchange={handleInputChange} />
  </div>
  {#if regions.length > 1}
    <RegionModal {regions} onSubmit={(region) => initTool(region)} />
  {/if}
</div>

<style lang="postcss">
  @reference "../../app.css";

  .gtc-dropzone {
    @apply bg-primary-900 rounded p-2 select-none;

    width: 600px;
    height: 400px;

    & .gtc-dropzone-inner {
      @apply border-primary-500 flex h-full w-full cursor-pointer flex-col items-center justify-center border-2 border-dashed p-4 text-white;

      & .gtc-dropzone-hint {
        @apply text-primary-400 text-center whitespace-pre-line;
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
