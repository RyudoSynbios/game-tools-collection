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

  function parseVariable(offset: number): [number, number] {
    const instruction = getInt(offset, "uint32", { bigEndian: true }, dataView);

    let value = 0;
    let length = 1;

    switch (instruction & 0xff000000) {
      case 0x4000000: // Float
        value = getInt(offset + 0x4, "float32", { bigEndian: true }, dataView); // prettier-ignore
        length = 2;
        break;
      case 0x10000000: // ???
        value = instruction & 0xffffff;
        break;
      case 0x20000000: // ???
        value = instruction & 0xffffff;
        break;
      case 0x50000000: // ???
        value = instruction & 0xffffff;
        break;
    }

    return [value, length];
  }

  function isEnd(offset: number): boolean {
    const int = getInt(offset, "uint32", { bigEndian: true }, dataView);

    return int === 0x1d;
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

        let end = false;

        while (offset < dataView.byteLength) {
          const instruction = getInt(offset, "uint32", { bigEndian: true }, dataView); // prettier-ignore
          const initialOffset = offset;

          offset += 0x4;

          let color = "orange";
          let text = instruction.toHex(8);
          let length = 1;

          if (instruction === 0x0) {
            text = "should if";

            const [value1, varLength1] = parseVariable(offset);

            length += varLength1;
            offset += varLength1 * 0x4;

            const [value2, varLength2] = parseVariable(offset);

            length += varLength2;
            offset += varLength2 * 0x4;

            const unknown = getInt(offset, "uint32", { bigEndian: true }, dataView); // prettier-ignore

            length += 1;
            offset += 0x4;

            const end = isEnd(offset);

            length += 1;
            offset += 0x4;

            const jumpOffset = offset + getInt(offset, "uint32", { bigEndian: true }, dataView); // prettier-ignore

            length += 1;
            offset += 0x4;

            if (unknown === 0x4 && end) {
              color = "lightblue";
              text = `if "${value1}", "${value2}", "${unknown}", jump to "${jumpOffset.toHex(8)}"`;
            }
          } else if (instruction === 0x9) {
            text = "should init script";

            const [value, varLength] = parseVariable(offset);

            length += varLength;
            offset += varLength * 0x4;

            if (isEnd(offset)) {
              color = "limegreen";
              text = `init if "${value}"`;
            }

            length += 1;
            offset += 0x4;
          } else if (instruction === 0xa) {
            const jumpOffset = offset + getInt(offset, "uint32", { bigEndian: true }, dataView); // prettier-ignore

            length += 1;
            offset += 0x4;

            color = "limegreen";
            text = `jump to "${jumpOffset.toHex(8)}"`;
          } else if (instruction === 0xb) {
            text = "unknown instruction 0xb";

            const unknown = getInt(offset, "uint32", { bigEndian: true }, dataView); // prettier-ignore

            length += 1;
            offset += 0x4;

            color = "mediumorchid";
            text = `unknown instruction 0xb with value "${unknown}"`;
          } else if (instruction === 0xc) {
            color = "limegreen";
            text = "end";
            end = true;
            // } else if (instruction === 0xd) {
            //   const int2 = getInt(offset + 0x4, "uint32", { bigEndian: true }, dataView); // prettier-ignore
            //   const int3 = getInt(offset + 0x8, "uint32", { bigEndian: true }, dataView); // prettier-ignore
            //   const int5 = getInt(offset + 0x10, "uint32", { bigEndian: true }, dataView); // prettier-ignore

            //   let color = "orange";
            //   let length = 1;
            //   let text = "should set light";
            //   let shift = 0x4;

            //   if (int2 === 0x00000052 && int3 === 0x04000000 && int5 === 0x1d) {
            //     const float1 = getInt(offset + 0xc, "float32", { bigEndian: true }, dataView); // prettier-ignore
            //     const float2 = getInt(offset + 0x18, "float32", { bigEndian: true }, dataView); // prettier-ignore
            //     const float3 = getInt(offset + 0x24, "float32", { bigEndian: true }, dataView); // prettier-ignore
            //     const float4 = getInt(offset + 0x30, "float32", { bigEndian: true }, dataView); // prettier-ignore

            //     const enabled = float1 === 1 ? "enabled" : "disabled";

            //     color = "limegreen";
            //     length = 14;
            //     text = `set light color: "${enabled}", R = "${float2}", G = "${float3}", B = "${float4}"`;
            //     shift = 0x38;
            //   } else if (
            //     int2 === 0x00000053 &&
            //     int3 === 0x04000000 &&
            //     int5 === 0x1d
            //   ) {
            //     const float1 = getInt(offset + 0xc, "float32", { bigEndian: true }, dataView); // prettier-ignore
            //     const float2 = getInt(offset + 0x18, "float32", { bigEndian: true }, dataView); // prettier-ignore
            //     const float3 = getInt(offset + 0x24, "float32", { bigEndian: true }, dataView); // prettier-ignore
            //     const float4 = getInt(offset + 0x30, "float32", { bigEndian: true }, dataView); // prettier-ignore
            //     const float5 = getInt(offset + 0x3c, "float32", { bigEndian: true }, dataView); // prettier-ignore
            //     const float6 = getInt(offset + 0x48, "float32", { bigEndian: true }, dataView); // prettier-ignore
            //     const float7 = getInt(offset + 0x54, "float32", { bigEndian: true }, dataView); // prettier-ignore

            //     const enabled = float1 === 1 ? "enabled" : "disabled";

            //     color = "limegreen";
            //     length = 23;
            //     text = `set light parameters: "${enabled}", P1 = "${float2}", P2 = "${float3}", P3 = "${float4}", P4 = "${float5}", P5 = "${float6}", P6 = "${float7}"`;
            //     shift = 0x5c;
            //   }

            //   actions.push({ color, offset, length, text });

            //   offset += shift;
          } else if (instruction === 0x10) {
            text = "should wait frames";

            const [value, varLength] = parseVariable(offset);

            length += varLength;
            offset += varLength * 0x4;

            if (isEnd(offset)) {
              color = "limegreen";
              text = `wait "${value}" frames`;
            }

            length += 1;
            offset += 0x4;
          } else if (instruction === 0x11) {
            text = "should set flag";

            const [value, varLength] = parseVariable(offset);

            length += varLength;
            offset += varLength * 0x4;

            if (isEnd(offset)) {
              color = "limegreen";
              text = `set flag at position "${value}"`;
            }

            length += 1;
            offset += 0x4;
          } else if (instruction === 0x12) {
            text = "should unset flag";

            const [value, varLength] = parseVariable(offset);

            length += varLength;
            offset += varLength * 0x4;

            if (isEnd(offset)) {
              color = "limegreen";
              text = `unset flag at position "${value}"`;
            }

            length += 1;
            offset += 0x4;
          } else if (instruction === 0x1a) {
            text = "unknown instruction 0x1a";

            const [value, varLength] = parseVariable(offset);

            length += varLength;
            offset += varLength * 0x4;

            if (isEnd(offset)) {
              color = "mediumorchid";
              text = `unknown instruction 0x1a with value "${value}"`;
            }

            length += 1;
            offset += 0x4;
          } else if (instruction === 0x1b) {
            text = "unknown instruction 0x1b";

            const [value, varLength] = parseVariable(offset);

            length += varLength;
            offset += varLength * 0x4;

            if (isEnd(offset)) {
              color = "mediumorchid";
              text = `unknown instruction 0x1b with value "${value}"`;
            }

            length += 1;
            offset += 0x4;
          } else if (instruction === 0x1c) {
            text = "unknown instruction 0x1c";

            const [value1, varLength1] = parseVariable(offset);

            length += varLength1;
            offset += varLength1 * 0x4;

            const end1 = isEnd(offset);

            length += 1;
            offset += 0x4;

            const [value2, varLength2] = parseVariable(offset);

            length += varLength2;
            offset += varLength2 * 0x4;

            const end2 = isEnd(offset);

            length += 1;
            offset += 0x4;

            const unknown = getInt(offset, "uint32", { bigEndian: true }, dataView); // prettier-ignore

            length += 1;
            offset += 0x4;

            const [value3, varLength3] = parseVariable(offset);

            length += varLength3;
            offset += varLength3 * 0x4;

            const end3 = isEnd(offset);

            length += 1;
            offset += 0x4;

            if (end1 && end2 && end3) {
              color = "mediumorchid";
              text = `unknown instruction 0x1c with value "${value1}",  "${value2}",  "${unknown.toHex(8)}",  "${value3}"`;
            }
          } else if (instruction === 0x28) {
            text = "unknown instruction 0x28";

            const [value1, varLength1] = parseVariable(offset);

            length += varLength1;
            offset += varLength1 * 0x4;

            const end1 = isEnd(offset);

            length += 1;
            offset += 0x4;

            const [value2, varLength2] = parseVariable(offset);

            length += varLength2;
            offset += varLength2 * 0x4;

            const end2 = isEnd(offset);

            length += 1;
            offset += 0x4;

            const [value3, varLength3] = parseVariable(offset);

            length += varLength3;
            offset += varLength3 * 0x4;

            const end3 = isEnd(offset);

            length += 1;
            offset += 0x4;

            if (end1 && end2 && end3) {
              color = "mediumorchid";
              text = `unknown instruction 0x28 with value "${value1}",  "${value2}", "${value3}"`;
            }
          } else if (instruction === 0x5c) {
            text = "unknown instruction 0x5c";

            const [value, varLength] = parseVariable(offset);

            length += varLength;
            offset += varLength * 0x4;

            if (isEnd(offset)) {
              color = "mediumorchid";
              text = `unknown instruction 0x5c with value "${value}"`;
            }

            length += 1;
            offset += 0x4;
          } else if (instruction === 0x5d) {
            text = "unknown instruction 0x5d";

            const [value, varLength] = parseVariable(offset);

            length += varLength;
            offset += varLength * 0x4;

            if (isEnd(offset)) {
              color = "mediumorchid";
              text = `unknown instruction 0x5d with value "${value}"`;
            }

            length += 1;
            offset += 0x4;
          } else if (instruction === 0x90) {
            text = "should open dialog box";

            const rOffset = offset + getInt(offset, "int32", { bigEndian: true }, dataView); // prettier-ignore

            length += 1;
            offset += 0x4;

            const unknown = getInt(offset, "uint32", { bigEndian: true }, dataView); // prettier-ignore

            length += 1;
            offset += 0x4;

            if (unknown === 0x7fffffff) {
              color = "limegreen";
              text = `open dialog box and read ${rOffset.toHex(8)}`;
            }
            // } else if (int1 === 0x0000009a) {
            //   const int2 = getInt(offset + 0x4, "uint32", { bigEndian: true }, dataView); // prettier-ignore
            //   const int4 = getInt(offset + 0xc, "uint32", { bigEndian: true }, dataView); // prettier-ignore

            //   let color = "orange";
            //   let text = "should open choice box";

            //   if (int2 === 0x04000000 && int4 === 0x1d) {
            //     const float = getInt(offset + 0x8, "float32", { bigEndian: true }, dataView); // prettier-ignore

            //     text = `open item box with item "${float}" (related to main.dol)`;
            //   }

            //   actions.push({
            //     color,
            //     offset,
            //     length: 4,
            //     text,
            //   });

            //   offset += 0x10;
            // } else if (int1 === 0x0000009b) {
            //   const int2 = getInt(offset + 0x4, "uint32", { bigEndian: true }, dataView); // prettier-ignore
            //   const int4 = getInt(offset + 0xc, "uint32", { bigEndian: true }, dataView); // prettier-ignore

            //   let color = "orange";
            //   let text = "should open choice box";

            //   if (int2 === 0x04000000 && int4 === 0x1d) {
            //     const float = getInt(offset + 0x8, "float32", { bigEndian: true }, dataView); // prettier-ignore
            //     const rOffset = getInt(offset + 0x10, "uint32", { bigEndian: true }, dataView); // prettier-ignore

            //     color = "limegreen";
            //     text = `open choice box with "${float}" choices and read "${(offset + 0x10 + rOffset).toHex(8)}"`;
            //   }

            //   actions.push({
            //     color,
            //     offset,
            //     length: 5,
            //     text,
            //   });

            //   offset += 0x14;
            // } else if (int1 === 0x08000100) {
            //   actions.push({
            //     color: "limegreen",
            //     offset,
            //     length: 2,
            //     text: "close dialog box",
            //   });

            //   offset += 0x8;
            // } else if (int1 === 0x10000057) {
            //   const int2 = getInt(offset + 0x4, "uint32", { bigEndian: true }, dataView); // prettier-ignore
            //   const int4 = getInt(offset + 0xc, "uint32", { bigEndian: true }, dataView); // prettier-ignore
            //   const int5 = getInt(offset + 0x10, "uint32", { bigEndian: true }, dataView); // prettier-ignore

            //   let color = "orange";
            //   let text = "should be language condition";

            //   if (int2 === 0x04000000 && int4 === 0x4 && int5 === 0x1d) {
            //     const float = getInt(offset + 0x8, "float32", { bigEndian: true }, dataView); // prettier-ignore
            //     const rOffset = getInt(offset + 0x14, "int32", { bigEndian: true }, dataView); // prettier-ignore

            //     let language = "";

            //     switch (float) {
            //       case 0:
            //         language = "english";
            //         break;
            //       case 1:
            //         language = "french";
            //         break;
            //       case 2:
            //         language = "german";
            //         break;
            //       case 3:
            //         language = "spanish";
            //         break;
            //     }

            //     color = "limegreen";
            //     text = `if language !== "${language}", then jump to "${(offset + 0x14 + rOffset).toHex(8)}"`;
            //   }

            //   actions.push({ color, offset, length: 6, text });

            //   offset += 0x18;
            // } else if ((int1 & 0xff000000) === 0x20000000) {
            //   const int2 = getInt(offset + 0x4, "uint32", { bigEndian: true }, dataView); // prettier-ignore
            //   const int4 = getInt(offset + 0xc, "uint32", { bigEndian: true }, dataView); // prettier-ignore
            //   const int5 = getInt(offset + 0x10, "uint32", { bigEndian: true }, dataView); // prettier-ignore

            //   let color = "orange";
            //   let text = "should be flag condition";

            //   if (int2 === 0x04000000 && int4 === 0x4 && int5 === 0x1d) {
            //     const value = int1 & 0xffff;
            //     const float = getInt(offset + 0x8, "float32", { bigEndian: true }, dataView); // prettier-ignore
            //     const rOffset = getInt(offset + 0x14, "int32", { bigEndian: true }, dataView); // prettier-ignore

            //     color = "orange";
            //     text = `if flag at position "${value}" !== "${float}", then jump to "${(offset + 0x14 + rOffset).toHex(8)}" << not all the time`;
            //   }

            //   actions.push({ color: color, offset, length: 6, text });

            //   offset += 0x18;
            // } else if (int1 === 0x50000000) {
            //   const int2 = getInt(offset + 0x4, "uint32", { bigEndian: true }, dataView); // prettier-ignore

            //   let color = "orange";
            //   let text = "should check Gold";

            //   if (int2 === 0x04000000) {
            //     const float = getInt(offset + 0x8, "float32", { bigEndian: true }, dataView); // prettier-ignore

            //     color = "orange";
            //     text = `check or increment/decrement "${float}" Gold`;
            //   }

            //   actions.push({
            //     color,
            //     offset,
            //     length: 3,
            //     text,
            //   });

            //   offset += 0xc;
            // } else if (int1 === 0x50000001) {
            //   const int2 = getInt(offset + 0x4, "uint32", { bigEndian: true }, dataView); // prettier-ignore

            //   let color = "orange";
            //   let text = "should check Swashblucker Rating";

            //   if (int2 === 0x04000000) {
            //     const float = getInt(offset + 0x8, "float32", { bigEndian: true }, dataView); // prettier-ignore

            //     color = "orange";
            //     text = `check or increment/decrement "${float}" Swashblucker Rating`;
            //   }

            //   actions.push({
            //     color,
            //     offset,
            //     length: 3,
            //     text,
            //   });

            //   offset += 0xc;
          } else if ((instruction & 0xff000000) === 0x5c000000) {
            text = "";

            while (true) {
              if ($gameRegion === 2) {
                const int = getInt(offset, "uint16", { bigEndian: true }, dataView); // prettier-ignore

                text += decodeWindows31J(int);

                length += 2;
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

                length += 1;
                offset += 0x1;
              }
            }

            color = "limegreen";
            end = true;
          } else {
            color = "red";
          }

          actions.push({ color, offset: initialOffset, length, text });

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
