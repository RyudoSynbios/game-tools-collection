<script lang="ts">
  import { dataViewAlt } from "$lib/stores";
  import { getInt, getString } from "$lib/utils/bytes";

  import { getFileData } from "../utils";
  import {
    parseChoiceBox,
    parseDialogBox,
    parseEnd,
    parseIf,
    parseInit,
    parseItemBox,
    parseJump,
    parseLightColor,
    parseLightParameters,
    parseSetFlag,
    parseText,
    parseUnknown0b,
    parseUnknown1a,
    parseUnknown1b,
    parseUnknown1c,
    parseUnknown4c,
    parseUnknown5c,
    parseUnknown5d,
    parseUnknown28,
    parseUnknown29,
    parseUnknown41,
    parseUnsetFlag,
    parseWait,
    type Action,
  } from "../utils/script";

  export let assetIndex: number;

  let previousAssetIndex = -1;

  let dataView = new DataView(new ArrayBuffer(0));
  let scripts: {
    offset: number;
    name: string;
    expanded?: boolean;
    actions: Action[];
  }[] = [];

  function handleActionToggle(scriptIndex: number, actionIndex: number): void {
    scripts[scriptIndex].actions[actionIndex].expanded =
      !scripts[scriptIndex].actions[actionIndex].expanded;
  }

  function handleScriptToggle(index: number): void {
    scripts[index].expanded = !scripts[index].expanded;
  }

  $: {
    if (assetIndex !== previousAssetIndex) {
      scripts = [];

      dataView = getFileData("script", assetIndex);

      $dataViewAlt.debug = dataView;

      const count = getInt(0x8, "uint32", { bigEndian: true }, dataView);

      const baseOffset = 0xc + count * 0x14;

      for (let i = 0x0; i < count; i += 1) {
        let offset =
          baseOffset +
          getInt(0xc + i * 0x14, "uint32", { bigEndian: true }, dataView);

        const name = getString(0x10 + i * 0x14, 0x10, "uint8", { zeroTerminated: true }, dataView); // prettier-ignore

        scripts.push({
          offset,
          name: name,
          actions: [],
        });

        const actions = scripts[scripts.length - 1].actions;

        let end = false;

        while (offset < dataView.byteLength) {
          const instruction = getInt(offset, "uint32", { bigEndian: true }, dataView); // prettier-ignore

          if ((instruction & 0xff000000) === 0x5c000000) {
            const [length, text] = parseText(dataView, offset);

            actions.push({ color: "limegreen", offset, length, text });

            break;
          }

          const action = {
            color: "orange",
            offset: offset + 0x4,
            length: 1,
            text: instruction.toHex(8),
          };

          switch (instruction) {
            case 0x0:
              parseIf(action, dataView);
              break;
            case 0x9:
              parseInit(action, dataView);
              break;
            case 0xa:
              parseJump(action, dataView);
              break;
            case 0xb:
              parseUnknown0b(action, dataView);
              break;
            case 0xc:
              parseEnd(action);
              end = true;
              break;
            case 0x10:
              parseWait(action, dataView);
              break;
            case 0x11:
              parseSetFlag(action, dataView);
              break;
            case 0x12:
              parseUnsetFlag(action, dataView);
              break;
            case 0x1a:
              parseUnknown1a(action, dataView);
              break;
            case 0x1b:
              parseUnknown1b(action, dataView);
              break;
            case 0x1c:
              parseUnknown1c(action, dataView);
              break;
            case 0x28:
              parseUnknown28(action, dataView);
              break;
            case 0x29:
              parseUnknown29(action, dataView);
              break;
            case 0x41:
              parseUnknown41(action, dataView);
              break;
            case 0x4c:
              parseUnknown4c(action, dataView);
              break;
            case 0x52:
              parseLightColor(action, dataView);
              break;
            case 0x53:
              parseLightParameters(action, dataView);
              break;
            case 0x5c:
              parseUnknown5c(action, dataView);
              break;
            case 0x5d:
              parseUnknown5d(action, dataView);
              break;
            case 0x90:
              parseDialogBox(action, dataView);
              break;
            case 0x9a:
              parseItemBox(action, dataView);
              break;
            case 0x9b:
              parseChoiceBox(action, dataView);
              break;
            default:
              action.color = "red";
          }

          actions.push({ ...action, offset });

          offset += action.length * 0x4;

          if (
            end ||
            getInt(offset, "uint32", { bigEndian: true }, dataView) === 0x9
          ) {
            break;
          }
        }
      }
    }

    previousAssetIndex = assetIndex;
  }
</script>

<!-- svelte-ignore a11y-click-events-have-key-events -->
<!-- svelte-ignore a11y-no-noninteractive-element-interactions -->
<!-- svelte-ignore a11y-no-static-element-interactions -->
<!-- prettier-ignore -->
<div class="gtc-scriptviewer">
  {#each scripts as script, scriptIndex}
    <p style="color: gold;" on:click={() => handleScriptToggle(scriptIndex)}>
      {script.offset.toHex(8)}: {script.name}
    </p>
    {#if script.expanded}
      <div class="gtc-scriptviewer-actions">
        {#each script.actions as action, actionIndex}
          <p
            style={`color: ${action.color}`}
            on:click={() => handleActionToggle(scriptIndex, actionIndex)}
          >
            {action.offset.toHex(8)}: {action.text}
          </p>
          {#if action.expanded && (action.color !== "red" || action.length > 1)}
            <div>
              {#each Array(action.length) as _, index (index)}
                {@const offset = action.offset + index * 0x4}
                <p style="color: white;">
                  {offset.toHex(8)}: {getInt(offset, "uint32", { bigEndian: true }, dataView).toHex(8)}
                </p>
              {/each}
            </div>
          {/if}
        {/each}
      </div>
    {/if}
  {/each}
</div>

<style lang="postcss">
  .gtc-scriptviewer {
    @apply w-full whitespace-pre-line rounded bg-primary-700 p-2 text-xs;

    & p {
      @apply font-source;
    }

    & .gtc-scriptviewer-actions {
      @apply ml-4;
    }
  }
</style>
