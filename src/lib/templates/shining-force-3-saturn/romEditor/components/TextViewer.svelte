<script lang="ts">
  import Select from "$lib/components/Select.svelte";
  import { getRegionArray } from "$lib/utils/format";

  import type { Resource } from "$lib/types";

  import { characterNamesStartIndexes, dialogsStartIndexes } from "../template";
  import {
    decodeTextError,
    getFileData,
    getFilteredFiles,
    getScenario,
    getText,
  } from "../utils";

  export let assetIndex: number;

  let display = "formatted";
  let type = "dialogs";
  let indexFormat = "pageLine";
  let commonTexts: string[] = [];
  let dialogsTexts: string[] = [];

  function handleDisplayChange(event: Event): void {
    display = (event.target as HTMLInputElement).value;
  }

  function handleIndexFormatChange(event: Event): void {
    indexFormat = (event.target as HTMLInputElement).value;
  }

  function handleTypeChange(event: Event): void {
    type = (event.target as HTMLInputElement).value;
  }

  $: {
    const scenario = getScenario();

    const files = getFilteredFiles("text");
    const file = files[assetIndex];
    const dataView = getFileData("text", assetIndex);

    const characterNamesStartIndex = getRegionArray(characterNamesStartIndexes);

    const colors = [
      "#000000",
      "#201858",
      "#0000D8",
      "#e00808",
      "#f00888",
      "#20b818",
      "#00a8e8",
      "#f8f008",
      "#f8f8f8",
      "#000000",
      "#f86800",
      "#4800a8",
      "#006808",
      "#583008",
      "#907038",
      "#c0c0c0",
      "#808080",
      "#404040",
    ];

    const characterNames: Resource = {};

    for (let i = 0x0; i < 0x3c; i += 0x1) {
      characterNames[i] = getText(characterNamesStartIndex + i);
    }

    let dialogsStartIndex = getRegionArray(dialogsStartIndexes);

    if (scenario === "2" && file.name.match(/X5BTL(.*?).BIN$/)) {
      dialogsStartIndex += 0x25;
    } else if (
      file.name.match(/X5BTL(.*?).BIN$/) &&
      !["X5BTL02.BIN", "X5BTL24.BIN"].includes(file.name)
    ) {
      dialogsStartIndex += 0x1f;
    }

    commonTexts = [];
    dialogsTexts = [];

    let index = 0;

    while (true) {
      let text = getText(index, false, dataView);

      if (text === decodeTextError) {
        break;
      }

      if (display.match(/formatted/)) {
        let markers = display === "formattedMarkers";
        let span = false;

        text = `\n${text}`;

        while (text.match(/\{.*?\}/)) {
          const match = text.match(/\{.*?\}/);

          if (match) {
            const mode = parseInt(match[0].substring(1, 3), 16);

            let param = 0x0;
            let paramIsVariable = text[match.index! + 4] === "{";

            if (paramIsVariable) {
              param = parseInt(
                text.substring(match.index! + 5, match.index! + 7),
                16,
              );
            } else {
              param = text.charCodeAt(match.index! + 4);
            }

            let charCount = 4;
            let replace = "";

            switch (mode) {
              case 0x0: // End
                break;

              case 0x1: // Press Button to Next
                replace = markers ? " ↓\n" : "\n";
                break;

              case 0x2: // Press Button to End
                replace = markers ? " →" : "";
                break;

              case 0x3: // Carriage return
                replace = "\n";
                if (span) {
                  span = false;
                  replace = "</span>\n";
                }
                break;

              case 0x4: // Pause
                replace = markers ? "[pause]" : "";
                break;

              case 0x5: // Short Pause
                replace = markers ? "[short pause]" : "";
                break;

              case 0x6: // Long Pause
                replace = markers ? "[long pause]" : "";
                break;

              case 0x7: // Effect End
                replace = "</span>";
                break;

              case 0x8: // Color
                charCount = paramIsVariable ? 8 : 5;
                replace = `<span style="color: ${colors[param]};">`;
                break;

              case 0x9: // Effect
                charCount = paramIsVariable ? 8 : 5;
                if (param === 0x4) {
                  span = true;
                  replace = `<span style="font-weight: bold;">`;
                }
                break;

              case 0xb: // Rotation Effect
                charCount = paramIsVariable ? 8 : 5;
                break;

              case 0xc: // Size
                charCount = paramIsVariable ? 8 : 5;
                replace = `<span style="font-size: ${14 + (param - 11)}px;">`;
                break;

              case 0xf: // Explosion effect
                charCount = paramIsVariable ? 8 : 5;
                break;

              case 0x10: // Hero name
                replace = characterNames[0];
                break;

              case 0x11: // Character name
                charCount = paramIsVariable ? 8 : 5;
                replace = characterNames[param - 0x1];
                break;

              case 0x12: // Party Member
                replace = markers ? "[character]" : "?";
                break;

              case 0x13: // Class
                replace = markers ? "[class]" : "?";
                break;

              case 0x14: // Item
                replace = markers ? "[item]" : "?";
                break;

              case 0x15: // Spell
                replace = markers ? "[spell]" : "?";
                break;

              case 0x16: // Number
                replace = markers ? "[number]" : "?";
                break;

              case 0x18: // Special
                replace = markers ? "[special]" : "?";
                break;

              case 0x19: // Friendship
                replace = markers ? "[friendship]" : "?";
                break;

              case 0x1a: // JuMeSyn
                replace = `${characterNames[7].substring(0, 2)}${characterNames[20].substring(0, 2)}${characterNames[0].substring(0, 3)}`;
                break;

              case 0x1c: // Possessive noun
                replace = "('s)";
                break;

              case 0x1d: // Plurial
                replace = "(s)";
                break;

              case 0x1e: // Prompt Yes/No
                replace = markers ? "[prompt]" : "";
                break;
            }

            text = `${text.substring(0, match.index!)}${replace}${text.substring(match.index! + charCount)}`;
          }
        }
      }

      let textIndex = index.toHex(3);

      if (indexFormat === "pageLine") {
        textIndex = `P${index >> 0x8} L${(index & 0xff) + 0x1}`;
      }

      text = `<b>${textIndex}</b>: ${text}`;

      if (index >= dialogsStartIndex) {
        dialogsTexts.push(text);
      } else {
        commonTexts.push(text);
      }

      index += 1;
    }
  }
</script>

<div class="gtc-textviewer">
  <div class="gtc-textviewer-options">
    <Select
      label="Display"
      value={display}
      options={[
        { key: "formatted", value: "Formatted" },
        { key: "formattedMarkers", value: "Formatted with markers" },
        { key: "raw", value: "Raw" },
      ]}
      onChange={handleDisplayChange}
    />
    <Select
      label="Type"
      value={type}
      options={[
        { key: "dialogs", value: "Dialogs" },
        { key: "common", value: "Common" },
      ]}
      onChange={handleTypeChange}
    />
    <Select
      label="Index Format"
      value={indexFormat}
      options={[
        { key: "hexadecimal", value: "Hexadecimal" },
        { key: "pageLine", value: "Page / Line" },
      ]}
      onChange={handleIndexFormatChange}
    />
  </div>
  <div
    class="gtc-textviewer-content"
    class:gtc-textviewer-content-formatted={display.match(/formatted/)}
  >
    {#if type === "dialogs"}
      {#each dialogsTexts as text}
        <p>{@html text}</p>
      {/each}
    {:else if type === "common"}
      {#each commonTexts as text}
        <p>{@html text}</p>
      {/each}
    {/if}
  </div>
</div>

<style lang="postcss">
  .gtc-textviewer {
    @apply w-full;

    & .gtc-textviewer-options {
      @apply flex;
    }

    & .gtc-textviewer-content {
      @apply whitespace-pre-line rounded bg-primary-700 p-2 text-sm;

      &.gtc-textviewer-content-formatted {
        @apply text-white;

        text-shadow: 1px 1px 0px black;

        & p {
          &:not(:last-child) {
            @apply mb-4;
          }

          & :global(b:first-child) {
            @apply text-primary-300;

            text-shadow: none;
          }
        }
      }

      & p {
        @apply select-text;

        &:not(:last-child) {
          @apply mb-2;
        }

        & :global(span) {
          @apply select-text;
        }
      }
    }
  }
</style>
