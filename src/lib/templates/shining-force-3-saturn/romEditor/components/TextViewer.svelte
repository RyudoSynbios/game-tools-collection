<script lang="ts">
  import Select from "$lib/components/Select.svelte";
  import { getRegionArray } from "$lib/utils/format";

  import { dialogsStartIndexes } from "../template";
  import {
    decodeTextError,
    getFileData,
    getFilteredFiles,
    getScenario,
    getText,
  } from "../utils";

  export let assetIndex: number;

  let type = "dialogs";
  let commonTexts: string[] = [];
  let dialogsTexts: string[] = [];

  function handleTypeChange(event: Event): void {
    type = (event.target as HTMLInputElement).value;
  }

  $: {
    const scenario = getScenario();

    const files = getFilteredFiles("text");
    const file = files[assetIndex];
    const dataView = getFileData("text", assetIndex);

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

      text = `<b>${index.toHex(3)}</b>: ${text}`;

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
  <Select
    label="Type"
    value={type}
    options={[
      { key: "dialogs", value: "Dialogs" },
      { key: "common", value: "Common" },
    ]}
    onChange={handleTypeChange}
  />
  <div class="gtc-textviewer-content">
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

    & .gtc-textviewer-content {
      @apply p-2 text-sm whitespace-pre-line bg-primary-700 rounded;

      & p {
        @apply select-text;

        &:not(:last-child) {
          @apply mb-2;
        }
      }
    }
  }
</style>
