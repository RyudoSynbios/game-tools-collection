<script lang="ts">
  import FileSaver from "file-saver";
  import { onDestroy } from "svelte";

  import { page } from "$app/state";
  import EjectIcon from "$lib/assets/Eject.svelte";
  import PatchIcon from "$lib/assets/Patch.svelte";
  import SaveIcon from "$lib/assets/Save.svelte";
  import TranslateIcon from "$lib/assets/Translate.svelte";
  import Dropzone from "$lib/components/Dropzone.svelte";
  import FileVisualizer from "$lib/components/FileVisualizer/FileVisualizer.svelte";
  import Content from "$lib/components/Items/Content.svelte";
  import RegionModal from "$lib/components/RegionModal.svelte";
  import {
    dataView,
    fileHeaderShift,
    fileName,
    gameJson,
    gameRegion,
    gameTemplate,
    gameUtils,
    isDebug,
    isDirty,
    isFileVisualizerOpen,
    locale,
  } from "$lib/stores";
  import { updateChecksums } from "$lib/utils/checksum";
  import { getGame } from "$lib/utils/db.js";
  import { capitalize, setLocalStorage, utilsExists } from "$lib/utils/format";
  import { enrichGameJson } from "$lib/utils/parser";
  import { reset } from "$lib/utils/state";
  import {
    getRegionIndex,
    getRegionName,
    getRegions,
  } from "$lib/utils/validator";

  import type { Game, GameJson, Patch } from "$lib/types";

  const game = getGame(page.params["gameId"]!) as Game;

  let tool = "";

  switch (page.params["tool"]) {
    case "randomizer":
      tool = "Randomizer";
      break;
    case "rom-editor":
      tool = "Rom Editor";
      break;
    case "save-editor":
      tool = "Save Editor";
      break;
  }

  let logoClickCount = 0;
  let logoClickTimer: NodeJS.Timeout;

  let dataViewTmp: DataView | undefined;
  let fileHeaderShiftTmp = 0x0;
  let fileNameTmp = "";
  let regions: string[] = [];
  let error = "";

  let patchInputEl: HTMLInputElement;
  let patchToolbarOpen = false;
  let patchIsLoading = false;
  let patchError = "";
  let patchSuccess = false;

  function handleClick(): void {
    patchToolbarOpen = false;

    resetPatchStatus();
  }

  function handleFileEject(): void {
    if ($isDirty) {
      const confirmation = confirm(
        "You have unsaved changes, are you sure you want to eject your file?",
      );

      if (!confirmation) {
        return;
      }
    }

    regions = [];

    reset();
  }

  async function handleFileSave(): Promise<void> {
    updateChecksums();

    let buffer = $dataView.buffer as ArrayBuffer;

    if (utilsExists("beforeSaving")) {
      buffer = await $gameUtils.beforeSaving();
    }

    const blob = new Blob([buffer], {
      type: "application/octet-stream",
    });

    FileSaver.saveAs(blob, $fileName);

    $isDirty = false;
  }

  function handleLocaleChange(event: Event): void {
    const target = event.target as HTMLInputElement;

    $locale = target.value;
  }

  function handleLogoClick(): void {
    if (!$isDebug) {
      if (logoClickCount === 0) {
        logoClickTimer = setTimeout(() => {
          clearTimeout(logoClickTimer);
          logoClickCount = 0;
        }, 2000);
      }

      logoClickCount += 1;

      if (logoClickCount === 5) {
        $isDebug = true;
        setLocalStorage("debug", "true");
      }
    }
  }

  function isLocalized(): boolean {
    if (!$gameTemplate.localization) {
      return false;
    }

    const regions = Object.keys($gameTemplate.validator.regions);

    const isLocalized = $gameTemplate.localization.regions.includes(
      regions[$gameRegion],
    );

    if (isLocalized && $locale === "") {
      $locale = $gameTemplate.localization.languages[0];
    }

    return isLocalized;
  }

  // Tool

  function initTool(region: string): void {
    const regionIndex = getRegionIndex(region);

    if (regionIndex !== -1) {
      $dataView = dataViewTmp as DataView;
      $fileHeaderShift = fileHeaderShiftTmp;
      $fileName = fileNameTmp;
      $gameRegion = regionIndex;

      enrichGameJson();

      uploadSuccess();
    } else {
      regions = [];
      uploadFailed("region not found");
    }

    dataViewTmp = undefined;
    fileNameTmp = "";
  }

  function onFileFailed(): void {
    uploadFailed("file size is 0");
  }

  async function onFileUploaded(file: File, dataView: DataView): Promise<void> {
    dataViewTmp = dataView;
    fileNameTmp = file.name;
    fileHeaderShiftTmp = 0x0;

    if (utilsExists("initHeaderShift")) {
      fileHeaderShiftTmp = $gameUtils.initHeaderShift(dataViewTmp);
    }

    if (utilsExists("beforeInitDataView")) {
      dataViewTmp = await $gameUtils.beforeInitDataView(
        dataViewTmp,
        fileHeaderShiftTmp,
      );
    }

    if (utilsExists("overrideGetRegions")) {
      regions = $gameUtils.overrideGetRegions(dataViewTmp, fileHeaderShiftTmp);
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

      uploadFailed("invalid file");
    }
  }

  function uploadFailed(reason: string): void {
    error = $gameTemplate.validator.error;

    if (!$isDebug) {
      fetch(`${page.url.pathname}/failed`, {
        method: "POST",
        body: JSON.stringify({ reason }),
      });
    }
  }

  function uploadSuccess(): void {
    error = "";

    if (!$isDebug) {
      fetch(`${page.url.pathname}/success`, {
        method: "POST",
        body: JSON.stringify({}),
      });
    }
  }

  // Patch

  function handlePatchImportClick(): void {
    if (!patchIsLoading) {
      patchInputEl.click();
    }
  }

  function handlePatchInputChange(event: Event): void {
    const files = (event.target as HTMLInputElement).files || [];
    const file = files[0];

    handlePatchImport(file);
  }

  function handlePatchImport(file: File): void {
    resetPatchStatus();

    if (!file || file.size === 0) {
      patchError = "not a .gtc file";
      return;
    }

    patchIsLoading = true;

    const fileReader = new FileReader();

    fileReader.onload = (event: ProgressEvent<FileReader>) => {
      try {
        const patch: Patch<unknown> = JSON.parse(`${event.target?.result}`);

        if (patch.identifier !== page.params["gameId"]) {
          patchIsLoading = false;
          patchError = "bad identifier";
          return;
        }

        if (patch.regions && !patch.regions.includes(getRegionName())) {
          patchIsLoading = false;
          patchError = "bad region";
          return;
        }

        $gameUtils.importPatch(patch);

        patchError = "";
        patchSuccess = true;
      } catch {
        patchError = "not a .gtc file";
      }

      patchIsLoading = false;
    };

    fileReader.readAsText(file);
  }

  function handlePatchGenerate(): void {
    const patch = $gameUtils.generatePatch();

    const blob = new Blob([JSON.stringify(patch)], {
      type: "application/json",
    });

    FileSaver.saveAs(blob, `${patch.identifier}.gtc`);

    $isDirty = false;
  }

  function handlePatchToolbarToggle(): void {
    patchToolbarOpen = !patchToolbarOpen;

    resetPatchStatus();
  }

  function resetPatchStatus(): void {
    patchError = "";
    patchSuccess = false;
  }

  onDestroy(() => {
    reset();

    $gameTemplate = {} as GameJson;
    $gameUtils = {};
  });
</script>

<!-- prettier-ignore -->
<svelte:head>
  <title>{game.metaName} - {game.console.name} - {tool} | Game Tools Collection</title>
  <meta property="og:title" content="{game.metaName} - {game.console.name} - {tool}" />
  <meta property="og:image" content="{page.url.origin}/img/games/{game.id}/logo.png" />
</svelte:head>

<svelte:window on:click={handleClick} />

<!-- svelte-ignore a11y-click-events-have-key-events -->
<!-- svelte-ignore a11y-no-noninteractive-element-interactions -->
<!-- svelte-ignore a11y-no-static-element-interactions -->
<div class="gtc-tool">
  {#if $dataView.byteLength === 0}
    <Dropzone {onFileFailed} {onFileUploaded}>
      <svelte:fragment slot="dropzone" let:isDragging let:isFileLoading>
        <img
          src="/img/games/{game.id}/logo.png"
          alt="{game.metaName} ({game.console.name})"
        />
        {#if isDragging}
          <p>Drop the file here.</p>
        {:else if !isFileLoading}
          <p>{$gameTemplate.validator?.text || ""}</p>
        {:else}
          <p>Loading...</p>
        {/if}
        {#if $gameTemplate?.validator?.hint}
          <p class="gtc-tool-hint">{@html $gameTemplate.validator.hint}</p>
        {/if}
        {#if error}
          <p class="gtc-tool-error">
            {@html $gameTemplate.validator.error}
          </p>
        {/if}
      </svelte:fragment>
    </Dropzone>
    {#if regions.length > 1}
      <RegionModal {regions} onSubmit={(region) => initTool(region)} />
    {/if}
  {:else}
    <div class="gtc-tool-banner">
      <img
        src="/img/games/{game.id}/logo.png"
        alt="{game.metaName} ({game.console.name})"
        on:click={handleLogoClick}
      />
      <div>
        {#if $gameTemplate.localization && isLocalized()}
          <div class="gtc-tool-locale">
            <TranslateIcon />
            <select on:change={handleLocaleChange}>
              {#each $gameTemplate.localization.languages as language}
                <option value={language}>{capitalize(language)}</option>
              {/each}
            </select>
          </div>
        {/if}
        {#if utilsExists("importPatch") || utilsExists("generatePatch")}
          <div class="gtc-tool-patchtoolbar" on:click|stopPropagation>
            <button
              type="button"
              class:gtc-tool-patchtoolbar-focus={patchToolbarOpen}
              on:click={handlePatchToolbarToggle}
            >
              <PatchIcon /> Patch
            </button>
            {#if patchToolbarOpen}
              <ul class="gtc-tool-toolbar">
                {#if utilsExists("importPatch")}
                  <li
                    class:gtc-tool-patchtoolbar-loading={patchIsLoading}
                    class:gtc-tool-patchtoolbar-error={patchError}
                    class:gtc-tool-patchtoolbar-success={patchSuccess}
                    on:click={handlePatchImportClick}
                  >
                    Import Patch
                    {#if patchIsLoading}
                      <span>(loading...)</span>
                    {:else if patchError}
                      <span>({patchError})</span>
                    {:else if patchSuccess}
                      <span>(patch applied)</span>
                    {/if}
                    <input
                      type="file"
                      bind:this={patchInputEl}
                      on:change={handlePatchInputChange}
                    />
                  </li>
                {/if}
                {#if utilsExists("generatePatch")}
                  <li on:click={handlePatchGenerate}>Generate Patch</li>
                {/if}
              </ul>
            {/if}
          </div>
        {/if}
        <button type="button" class="gtc-tool-eject" on:click={handleFileEject}>
          <EjectIcon /> Eject
        </button>
        <button type="button" class="gtc-tool-save" on:click={handleFileSave}>
          <SaveIcon />
          {tool === "Randomizer" ? "Generate" : "Save"}
        </button>
      </div>
    </div>
    <Content items={$gameJson.items} />
    {#if $isFileVisualizerOpen}
      <FileVisualizer />
    {/if}
  {/if}
</div>

<style lang="postcss">
  .gtc-tool {
    @apply flex flex-1 flex-col;

    .gtc-tool-hint {
      @apply whitespace-pre-line text-center text-primary-400;
    }

    .gtc-tool-error {
      @apply text-center text-primary-300;
    }

    .gtc-tool-banner {
      @apply mb-4 flex h-10 items-center justify-between;

      & img {
        height: 180%;
      }

      & div {
        @apply flex;

        & button {
          @apply ml-2 flex;

          &.gtc-tool-eject {
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

        &.gtc-tool-locale {
          @apply flex items-center rounded bg-primary-600 px-2;

          & select {
            @apply w-20 rounded bg-primary-600 text-xs text-white;
          }
        }

        &.gtc-tool-patchtoolbar {
          @apply relative mr-2;

          & .gtc-tool-patchtoolbar-error {
            @apply text-red-700;
          }

          & .gtc-tool-patchtoolbar-loading {
            @apply text-yellow-700;
          }

          & .gtc-tool-patchtoolbar-success {
            @apply text-green-700;
          }

          & button {
            @apply bg-blue-900 text-blue-100;

            &:hover {
              @apply bg-blue-700;
            }

            &.gtc-tool-patchtoolbar-focus {
              @apply bg-blue-700;
            }
          }

          & input {
            @apply hidden;
          }

          & span {
            @apply ml-1;
          }
        }

        .gtc-tool-toolbar {
          @apply absolute left-2 top-10 z-20 w-44 rounded bg-primary-500 py-1 text-xs;

          & li {
            @apply flex cursor-pointer px-2 py-1;

            &:hover {
              @apply bg-primary-400;
            }
          }
        }
      }
    }
  }
</style>
