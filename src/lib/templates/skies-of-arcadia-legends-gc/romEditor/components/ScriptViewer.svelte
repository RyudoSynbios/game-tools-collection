<script lang="ts">
  import { dataViewAlt, gameRegion } from "$lib/stores";
  import { getInt, getString } from "$lib/utils/bytes";
  import { decodeWindows31J } from "$lib/utils/encoding";

  import { getFileData } from "../utils";

  export let assetIndex: number;

  let previousAssetIndex = -1;

  let dataView = new DataView(new ArrayBuffer(0));
  let scripts: {
    offset: number;
    name: string;
    expanded?: boolean;
    actions: {
      color: string;
      offset: number;
      length: number;
      text: string;
      expanded?: boolean;
    }[];
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
        let offset = baseOffset + getInt(0xc + i * 0x14, 'uint32', { bigEndian: true }, dataView); // prettier-ignore
        const name = getString(0x10 + i * 0x14, 0x10, "uint8", { zeroTerminated: true }, dataView); // prettier-ignore

        scripts.push({
          offset,
          name: name,
          actions: [],
        });

        const actions = scripts[scripts.length - 1].actions;

        while (offset < dataView.byteLength) {
          const int1 = getInt(offset, "uint32", { bigEndian: true }, dataView);

          if (int1 === 0x0000000d) {
            const int2 = getInt(offset + 0x4, "uint32", { bigEndian: true }, dataView); // prettier-ignore
            const int3 = getInt(offset + 0x8, "uint32", { bigEndian: true }, dataView); // prettier-ignore
            const int5 = getInt(offset + 0x10, "uint32", { bigEndian: true }, dataView); // prettier-ignore

            let color = "orange";
            let length = 1;
            let text = "should set light";
            let shift = 0x4;

            if (int2 === 0x00000052 && int3 === 0x04000000 && int5 === 0x1d) {
              const float1 = getInt(offset + 0xc, "float32", { bigEndian: true }, dataView); // prettier-ignore
              const float2 = getInt(offset + 0x18, "float32", { bigEndian: true }, dataView); // prettier-ignore
              const float3 = getInt(offset + 0x24, "float32", { bigEndian: true }, dataView); // prettier-ignore
              const float4 = getInt(offset + 0x30, "float32", { bigEndian: true }, dataView); // prettier-ignore

              const enabled = float1 === 1 ? "enabled" : "disabled";

              color = "limegreen";
              length = 14;
              text = `set light color: "${enabled}", R = "${float2}", G = "${float3}", B = "${float4}"`;
              shift = 0x38;
            } else if (
              int2 === 0x00000053 &&
              int3 === 0x04000000 &&
              int5 === 0x1d
            ) {
              const float1 = getInt(offset + 0xc, "float32", { bigEndian: true }, dataView); // prettier-ignore
              const float2 = getInt(offset + 0x18, "float32", { bigEndian: true }, dataView); // prettier-ignore
              const float3 = getInt(offset + 0x24, "float32", { bigEndian: true }, dataView); // prettier-ignore
              const float4 = getInt(offset + 0x30, "float32", { bigEndian: true }, dataView); // prettier-ignore
              const float5 = getInt(offset + 0x3c, "float32", { bigEndian: true }, dataView); // prettier-ignore
              const float6 = getInt(offset + 0x48, "float32", { bigEndian: true }, dataView); // prettier-ignore
              const float7 = getInt(offset + 0x54, "float32", { bigEndian: true }, dataView); // prettier-ignore

              const enabled = float1 === 1 ? "enabled" : "disabled";

              color = "limegreen";
              length = 23;
              text = `set light parameters: "${enabled}", P1 = "${float2}", P2 = "${float3}", P3 = "${float4}", P4 = "${float5}", P5 = "${float6}", P6 = "${float7}"`;
              shift = 0x5c;
            }

            actions.push({ color, offset, length, text });

            offset += shift;
          } else if (int1 === 0x00000011) {
            const int2 = getInt(offset + 0x4, "uint32", { bigEndian: true }, dataView); // prettier-ignore

            let color = "orange";
            let text = "should set flag";

            if (int2 === 0x04000000) {
              const float = getInt(offset + 0x8, "float32", { bigEndian: true }, dataView); // prettier-ignore

              color = "limegreen";
              text = `set "1" to flag at position "${float}"`;
            }

            actions.push({ color, offset, length: 4, text });

            offset += 0x10;
          } else if (int1 === 0x00000090) {
            const rOffset = getInt(offset + 0x4, "int32", { bigEndian: true }, dataView); // prettier-ignore

            actions.push({
              color: "limegreen",
              offset,
              length: 2,
              text: `open dialog box and read ${(offset + 0x4 + rOffset).toHex(8)}`,
            });

            offset += 0x8;
          } else if (int1 === 0x0000009a) {
            const int2 = getInt(offset + 0x4, "uint32", { bigEndian: true }, dataView); // prettier-ignore
            const int4 = getInt(offset + 0xc, "uint32", { bigEndian: true }, dataView); // prettier-ignore

            let color = "orange";
            let text = "should open choice box";

            if (int2 === 0x04000000 && int4 === 0x1d) {
              const float = getInt(offset + 0x8, "float32", { bigEndian: true }, dataView); // prettier-ignore

              text = `open item box with item "${float}" (related to main.dol)`;
            }

            actions.push({
              color,
              offset,
              length: 4,
              text,
            });

            offset += 0x10;
          } else if (int1 === 0x0000009b) {
            const int2 = getInt(offset + 0x4, "uint32", { bigEndian: true }, dataView); // prettier-ignore
            const int4 = getInt(offset + 0xc, "uint32", { bigEndian: true }, dataView); // prettier-ignore

            let color = "orange";
            let text = "should open choice box";

            if (int2 === 0x04000000 && int4 === 0x1d) {
              const float = getInt(offset + 0x8, "float32", { bigEndian: true }, dataView); // prettier-ignore
              const rOffset = getInt(offset + 0x10, "uint32", { bigEndian: true }, dataView); // prettier-ignore

              color = "limegreen";
              text = `open choice box with "${float}" choices and read "${(offset + 0x10 + rOffset).toHex(8)}"`;
            }

            actions.push({
              color,
              offset,
              length: 5,
              text,
            });

            offset += 0x14;
          } else if (int1 === 0x08000100) {
            actions.push({
              color: "limegreen",
              offset,
              length: 2,
              text: "close dialog box",
            });

            offset += 0x8;
          } else if (int1 === 0x10000057) {
            const int2 = getInt(offset + 0x4, "uint32", { bigEndian: true }, dataView); // prettier-ignore
            const int4 = getInt(offset + 0xc, "uint32", { bigEndian: true }, dataView); // prettier-ignore
            const int5 = getInt(offset + 0x10, "uint32", { bigEndian: true }, dataView); // prettier-ignore

            let color = "orange";
            let text = "should be language condition";

            if (int2 === 0x04000000 && int4 === 0x4 && int5 === 0x1d) {
              const float = getInt(offset + 0x8, "float32", { bigEndian: true }, dataView); // prettier-ignore
              const rOffset = getInt(offset + 0x14, "int32", { bigEndian: true }, dataView); // prettier-ignore

              let language = "";

              switch (float) {
                case 0:
                  language = "english";
                  break;
                case 1:
                  language = "french";
                  break;
                case 2:
                  language = "german";
                  break;
                case 3:
                  language = "spanish";
                  break;
              }

              color = "limegreen";
              text = `if language !== "${language}", then jump to "${(offset + 0x14 + rOffset).toHex(8)}"`;
            }

            actions.push({ color, offset, length: 6, text });

            offset += 0x18;
          } else if ((int1 & 0xff000000) === 0x20000000) {
            const int2 = getInt(offset + 0x4, "uint32", { bigEndian: true }, dataView); // prettier-ignore
            const int4 = getInt(offset + 0xc, "uint32", { bigEndian: true }, dataView); // prettier-ignore
            const int5 = getInt(offset + 0x10, "uint32", { bigEndian: true }, dataView); // prettier-ignore

            let color = "orange";
            let text = "should be flag condition";

            if (int2 === 0x04000000 && int4 === 0x4 && int5 === 0x1d) {
              const value = int1 & 0xffff;
              const float = getInt(offset + 0x8, "float32", { bigEndian: true }, dataView); // prettier-ignore
              const rOffset = getInt(offset + 0x14, "int32", { bigEndian: true }, dataView); // prettier-ignore

              color = "orange";
              text = `if flag at position "${value}" !== "${float}", then jump to "${(offset + 0x14 + rOffset).toHex(8)}" << not all the time`;
            }

            actions.push({ color: color, offset, length: 6, text });

            offset += 0x18;
          } else if (int1 === 0x50000000) {
            const int2 = getInt(offset + 0x4, "uint32", { bigEndian: true }, dataView); // prettier-ignore

            let color = "orange";
            let text = "should check Gold";

            if (int2 === 0x04000000) {
              const float = getInt(offset + 0x8, "float32", { bigEndian: true }, dataView); // prettier-ignore

              color = "orange";
              text = `check or increment/decrement "${float}" Gold`;
            }

            actions.push({
              color,
              offset,
              length: 3,
              text,
            });

            offset += 0xc;
          } else if (int1 === 0x50000001) {
            const int2 = getInt(offset + 0x4, "uint32", { bigEndian: true }, dataView); // prettier-ignore

            let color = "orange";
            let text = "should check Swashblucker Rating";

            if (int2 === 0x04000000) {
              const float = getInt(offset + 0x8, "float32", { bigEndian: true }, dataView); // prettier-ignore

              color = "orange";
              text = `check or increment/decrement "${float}" Swashblucker Rating`;
            }

            actions.push({
              color,
              offset,
              length: 3,
              text,
            });

            offset += 0xc;
          } else if ((int1 & 0xff000000) === 0x5c000000) {
            let text = "";

            const savedOffset = offset;

            while (true) {
              if ($gameRegion === 2) {
                const int = getInt(
                  offset,
                  "uint16",
                  { bigEndian: true },
                  dataView,
                );

                text += decodeWindows31J(int);

                offset += 0x2;

                if (int === 0x0) {
                  break;
                }
              } else {
                let int = getInt(offset, "uint8", {}, dataView);

                if (int === 0x7f) {
                  int = 0x20;
                } else if (int === 0x0) {
                  break;
                }

                text += String.fromCharCode(int);

                offset += 0x1;
              }
            }

            actions.push({
              color: "limegreen",
              offset: savedOffset,
              length: Math.ceil((offset - savedOffset) / 0x4),
              text,
            });

            break;
          } else if (int1 === 0x04000000) {
            const float = getInt(offset + 0x4, "float32", { bigEndian: true }, dataView); // prettier-ignore

            actions.push({
              color: "cyan",
              offset,
              length: 2,
              text: `read float "${float}"`,
            });

            offset += 0x8;
          } else {
            actions.push({
              color: "red",
              offset,
              length: 1,
              text: int1.toHex(8),
            });

            offset += 0x4;
          }

          if (getInt(offset, "uint32", { bigEndian: true }, dataView) === 0x9) {
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
    {#if script.expanded }
      <div class="gtc-scriptviewer-actions">
        {#each script.actions as action, actionIndex}
          <p style={`color: ${action.color}`} on:click={() => handleActionToggle(scriptIndex, actionIndex)}>
            {action.offset.toHex(8)}: {action.text}
          </p>
          {#if action.expanded && (action.color !== 'red' || action.length > 1)}
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
