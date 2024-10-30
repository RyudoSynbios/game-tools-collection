<script lang="ts">
  import FileSaver from "file-saver";
  import { onDestroy } from "svelte";

  import { page } from "$app/stores";
  import ChecksumsIcon from "$lib/assets/Checksums.svelte";
  import EjectIcon from "$lib/assets/Eject.svelte";
  import ManageSearchIcon from "$lib/assets/ManageSearch.svelte";
  import SaveIcon from "$lib/assets/Save.svelte";
  import Dropzone from "$lib/components/Dropzone.svelte";
  import FileVisualizer from "$lib/components/FileVisualizer.svelte";
  import Content from "$lib/components/Items/Content.svelte";
  import SettingsIcon from "$lib/assets/Settings.svelte";
  import {
    dataView,
    fileName,
    gameJson,
    gameTemplate,
    gameUtils,
    isDebug,
    isDirty,
    isFileVisualizerOpen,
    showTabIndexes,
  } from "$lib/stores";
  import { updateChecksums } from "$lib/utils/checksum";
  import { getGame } from "$lib/utils/db.js";
  import { setLocalStorage, utilsExists } from "$lib/utils/format";
  import { reset } from "$lib/utils/state";
  import type { Game, GameJson } from "$lib/types";

  const game = getGame($page.params["gameId"]) as Game;

  let tool = $page.params["tool"];

  switch (tool) {
    case "randomize":
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

  function handleDebugToolbarToggle(): void {
    debugToolbarOpen = !debugToolbarOpen;
  }

  function handleExitDebugMode(): void {
    setLocalStorage("debug", "false");
    location.reload();
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

  function handleFileVisualizer(): void {
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
        setLocalStorage("debug", "true");
        location.reload();
      }
    }
  }

  function handleShowTabIndexesToggle(): void {
    $showTabIndexes = !$showTabIndexes;
    setLocalStorage("showTabIndexes", `${$showTabIndexes}`);
  }

  onDestroy(() => {
    reset();

    $gameTemplate = {} as GameJson;
    $gameUtils = {};
  });
</script>

<svelte:head>
  <title>
    {game.name} - {game.console.name} - {tool} | Game Tools Collection
  </title>
</svelte:head>

<!-- svelte-ignore a11y-click-events-have-key-events -->
<!-- svelte-ignore a11y-no-noninteractive-element-interactions -->
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
          <div class="gtc-tool-debugtoolbar">
            <button
              type="button"
              class:gtc-tool-debugtoolbar-focus={debugToolbarOpen}
              on:click={handleDebugToolbarToggle}
            >
              <SettingsIcon />
            </button>
            {#if debugToolbarOpen}
              <ul>
                <li on:click={handleShowTabIndexesToggle}>
                  Show tab indexes
                  <input type="checkbox" checked={$showTabIndexes} />
                </li>
                <li on:click={handleExitDebugMode}>Exit debug mode</li>
              </ul>
            {/if}
          </div>
          <button
            type="button"
            class="gtc-tool-filevisualizer"
            on:click={handleFileVisualizer}
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
        <button type="button" class="gtc-tool-eject" on:click={handleFileEject}>
          <EjectIcon /> Eject
        </button>
        <button type="button" class="gtc-tool-save" on:click={handleFileSave}>
          <SaveIcon /> Save
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
    @apply flex-1 flex flex-col;

    .gtc-tool-banner {
      @apply flex items-center justify-between mb-4 h-10;

      & img {
        height: 180%;
      }

      & div {
        @apply flex;

        & button {
          @apply flex ml-2;

          &.gtc-tool-checksums {
            @apply text-blue-100 bg-blue-900;

            &:hover {
              @apply bg-blue-700;
            }
          }

          &.gtc-tool-eject {
            @apply text-red-100 bg-red-900;

            &:hover {
              @apply bg-red-700;
            }
          }

          &.gtc-tool-filevisualizer {
            @apply text-indigo-100 bg-indigo-900;

            &:hover {
              @apply bg-indigo-700;
            }
          }

          &.gtc-tool-save {
            @apply text-green-100 bg-green-900;

            &:hover {
              @apply bg-green-700;
            }
          }

          & :global(svg) {
            @apply -ml-1 mr-2 w-5 h-5;
          }
        }

        &.gtc-tool-debugtoolbar {
          @apply relative;

          & .gtc-tool-debugtoolbar-focus {
            @apply text-white bg-primary-300;
          }

          & :global(svg) {
            @apply mx-0;
          }

          & ul {
            @apply absolute top-10 left-2 py-1 w-40 text-xs bg-primary-500 rounded;

            & li {
              @apply flex px-2 py-1 cursor-pointer;

              &:hover {
                @apply bg-primary-400;
              }

              & input[type="checkbox"] {
                @apply w-2.5 ml-2 cursor-pointer accent-primary-400;
              }
            }
          }
        }
      }
    }

    & .gtc-tool-dropzone {
      @apply flex-1 flex items-center justify-center;
    }
  }
</style>
