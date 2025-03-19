<script lang="ts">
  import FileSaver from "file-saver";
  import { onDestroy } from "svelte";

  import { page } from "$app/stores";
  import ChecksumsIcon from "$lib/assets/Checksums.svelte";
  import EjectIcon from "$lib/assets/Eject.svelte";
  import ManageSearchIcon from "$lib/assets/ManageSearch.svelte";
  import PatchIcon from "$lib/assets/Patch.svelte";
  import SaveIcon from "$lib/assets/Save.svelte";
  import SettingsIcon from "$lib/assets/Settings.svelte";
  import Dropzone from "$lib/components/Dropzone.svelte";
  import FileVisualizer from "$lib/components/FileVisualizer.svelte";
  import Content from "$lib/components/Items/Content.svelte";
  import {
    dataView,
    debugOptions,
    fileName,
    gameJson,
    gameTemplate,
    gameUtils,
    isDebug,
    isDirty,
    isFileVisualizerOpen,
  } from "$lib/stores";
  import { updateChecksums } from "$lib/utils/checksum";
  import { getGame } from "$lib/utils/db.js";
  import { setLocalStorage, utilsExists } from "$lib/utils/format";
  import { reset } from "$lib/utils/state";

  import type { Game, GameJson, Patch } from "$lib/types";

  const game = getGame($page.params["gameId"]) as Game;

  let tool = $page.params["tool"];

  switch (tool) {
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
  let debugToolbarOpen = false;

  let patchInputEl: HTMLInputElement;
  let patchToolbarOpen = false;
  let patchIsLoading = false;
  let patchError = false;
  let patchSuccess = false;

  function handleClick(): void {
    debugToolbarOpen = false;
    patchToolbarOpen = false;

    resetPatchStatus();
  }

  function handleDebugToolbarToggle(): void {
    debugToolbarOpen = !debugToolbarOpen;
  }

  function handleExitDebugMode(): void {
    debugToolbarOpen = false;
    $isDebug = false;
    setLocalStorage("debug", "false");
  }

  function handleFileChecksum(): void {
    updateChecksums();
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

    reset();
  }

  function handleFileSave(): void {
    updateChecksums();

    let buffer = $dataView.buffer;

    if (utilsExists("beforeSaving")) {
      buffer = $gameUtils.beforeSaving();
    }

    const blob = new Blob([buffer], {
      type: "application/octet-stream",
    });

    FileSaver.saveAs(blob, $fileName);

    $isDirty = false;
  }

  function handleFileVisualizerOpen(): void {
    $isFileVisualizerOpen = true;
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
      patchError = true;
      return;
    }

    patchIsLoading = true;

    const fileReader = new FileReader();

    fileReader.onload = (event: ProgressEvent<FileReader>) => {
      try {
        const patch: Patch<unknown> = JSON.parse(`${event.target?.result}`);

        if (patch.identifier !== $page.params["gameId"]) {
          patchIsLoading = false;
          patchError = true;
          return;
        }

        $gameUtils.importPatch(patch);

        patchError = false;
        patchSuccess = true;
      } catch {
        patchError = true;
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

  function handleShowInputValuesToggle(): void {
    window.debugGTC.toggleTool("showInputValues");
  }

  function handleShowTabIndexesToggle(): void {
    window.debugGTC.toggleTool("showTabIndexes");
  }

  function resetPatchStatus(): void {
    patchError = false;
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
  <title>{game.name} - {game.console.name} - {tool} | Game Tools Collection</title>
  <meta property="og:title" content="{game.name} - {game.console.name} - {tool}" />
  <meta property="og:image" content="{$page.url.origin}/img/games/{game.id}/logo.png" />
</svelte:head>

<svelte:window on:click={handleClick} />

<!-- svelte-ignore a11y-click-events-have-key-events -->
<!-- svelte-ignore a11y-no-noninteractive-element-interactions -->
<!-- svelte-ignore a11y-no-static-element-interactions -->
<div class="gtc-tool">
  {#if $dataView.byteLength === 0}
    <div class="gtc-tool-dropzone">
      <Dropzone
        logo="/img/games/{game.id}/logo.png"
        name="{game.name} ({game.console.name})"
      />
    </div>
  {:else}
    <div class="gtc-tool-banner">
      <img
        src="/img/games/{game.id}/logo.png"
        alt="{game.name} ({game.console.name})"
        on:click={handleLogoClick}
      />
      <div>
        {#if $isDebug}
          <div class="gtc-tool-debugtoolbar" on:click|stopPropagation>
            <button
              type="button"
              class:gtc-tool-debugtoolbar-focus={debugToolbarOpen}
              on:click={handleDebugToolbarToggle}
            >
              <SettingsIcon />
            </button>
            {#if debugToolbarOpen}
              <ul class="gtc-tool-toolbar">
                <li on:click={handleShowTabIndexesToggle}>
                  Show tab indexes
                  <input
                    type="checkbox"
                    checked={$debugOptions.showTabIndexes}
                  />
                </li>
                <li on:click={handleShowInputValuesToggle}>
                  Show input values
                  <input
                    type="checkbox"
                    checked={$debugOptions.showInputValues}
                  />
                </li>
                <li on:click={handleExitDebugMode}>Exit debug mode</li>
              </ul>
            {/if}
          </div>
          <button
            type="button"
            class="gtc-tool-filevisualizer"
            on:click={handleFileVisualizerOpen}
          >
            <ManageSearchIcon /> File Visualizer
          </button>
          {#if $gameJson.checksums && $gameJson.checksums.length > 0}
            <button
              type="button"
              class="gtc-tool-checksums"
              on:click={handleFileChecksum}
            >
              <ChecksumsIcon /> Checksums
            </button>
          {/if}
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
                      <span>(file is invalid)</span>
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

    .gtc-tool-banner {
      @apply mb-4 flex h-10 items-center justify-between;

      & img {
        height: 180%;
      }

      & div {
        @apply flex;

        & button {
          @apply ml-2 flex;

          &.gtc-tool-checksums {
            @apply bg-blue-900 text-blue-100;

            &:hover {
              @apply bg-blue-700;
            }
          }

          &.gtc-tool-eject {
            @apply bg-red-900 text-red-100;

            &:hover {
              @apply bg-red-700;
            }
          }

          &.gtc-tool-filevisualizer {
            @apply bg-indigo-900 text-indigo-100;

            &:hover {
              @apply bg-indigo-700;
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

        &.gtc-tool-debugtoolbar {
          @apply relative;

          & .gtc-tool-debugtoolbar-focus {
            @apply bg-primary-300 text-white;
          }

          & button {
            @apply px-2;
          }

          & :global(svg) {
            @apply mx-0;
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

            & input[type="checkbox"] {
              @apply ml-2 w-2.5 cursor-pointer accent-primary-400;
            }
          }
        }
      }
    }

    & .gtc-tool-dropzone {
      @apply flex flex-1 items-center justify-center;
    }
  }
</style>
