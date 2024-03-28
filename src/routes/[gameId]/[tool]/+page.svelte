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
  import {
    dataView,
    fileName,
    gameJson,
    gameTemplate,
    gameUtils,
    isDebug,
    isDirty,
    isFileVisualizerOpen,
  } from "$lib/stores";
  import { resetState } from "$lib/utils/bytes";
  import { updateChecksums } from "$lib/utils/checksum";
  import { getGame } from "$lib/utils/db.js";
  import { utilsExists } from "$lib/utils/format";
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

    resetState();
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

  onDestroy(() => {
    resetState();

    $gameTemplate = {} as GameJson;
    $gameUtils = {};
  });
</script>

<svelte:head>
  <title>
    {game.name} - {game.console.name} - {tool} | Game Tools Collection
  </title>
</svelte:head>

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
      />
      <div>
        {#if $isDebug}
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
      }
    }

    & .gtc-tool-dropzone {
      @apply flex-1 flex items-center justify-center;
    }
  }
</style>
