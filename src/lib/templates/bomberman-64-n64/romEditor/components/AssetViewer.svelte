<script lang="ts">
  import { onDestroy, onMount } from "svelte";

  import Checkbox from "$lib/components/Checkbox.svelte";
  import { isDebug } from "$lib/stores";
  import { getInt } from "$lib/utils/bytes";
  import Canvas from "$lib/utils/canvas";
  import Three from "$lib/utils/three";

  import {
    addMesh,
    applyTexture,
    getDecompressedData,
    getImage,
    resetTexture,
    setColor,
    setMesh,
    setTextureManipulations,
    setTextureOffsets,
    setTexturePaletteLength,
  } from "../utils";

  import type { Mesh, Texture } from "../utils";

  export let assetIndex: number;

  let canvasEl: HTMLDivElement;
  let threeEl: HTMLDivElement;

  let innerWidth = 0;

  let canvas: Canvas;
  let three: Three;
  let canvasTexture: Canvas;

  let hideTree = false;

  let tableOffset = 0x300000;

  const baseOffset =
    tableOffset + getInt(tableOffset, "uint32", { bigEndian: true });

  tableOffset += 0x8;

  const assets: number[] = [];

  while (true) {
    const compressedSize = getInt(tableOffset + 0x4, "uint32", {
      bigEndian: true,
    });

    const offset =
      baseOffset + getInt(tableOffset, "uint32", { bigEndian: true });

    if (compressedSize === 0xffffffff) {
      break;
    }

    assets.push(offset);

    tableOffset += 0x8;
  }

  function handleCameraFit(): void {
    three.fitCameraToScene();
  }

  function handleCameraReset(): void {
    three.resetCamera();
  }

  function handleGridHelperStatusChange(event: Event): void {
    if ((event.target as HTMLInputElement).checked) {
      three.showGridHelper();
    } else {
      three.hideGridHelper();
    }
  }

  function handleKeyDown(event: any): void {
    if (!event.ctrlKey && !event.metaKey && event.key === "f") {
      event.preventDefault();

      handleCameraFit();
    } else if (!event.ctrlKey && !event.metaKey && event.key === "r") {
      event.preventDefault();

      handleCameraReset();
    }
  }

  function handleWireframeStatusChange(event: Event): void {
    if ((event.target as HTMLInputElement).checked) {
      three.showWireframe();
    } else {
      three.hideWireframe();
    }
  }

  async function updateCanvas(): Promise<void> {
    if ($isDebug) {
      console.clear();
    }

    const decompressedData = getDecompressedData(assets[assetIndex]);

    if (decompressedData.length === 0) {
      hideTree = true;
    }

    const folderHeader = decompressedData.slice(0x0, 0xc);
    const headerCount = folderHeader[7];

    let decompressedDataPosition = 0xc;

    let headersOffsets: {
      asset: number;
      type: number;
      value: number;
      offset: number;
    }[] = [];

    for (let i = 0x0; i < headerCount; i += 0x1) {
      const header = new DataView(
        decompressedData.slice(
          decompressedDataPosition,
          decompressedDataPosition + 0xc,
        ).buffer,
      );

      headersOffsets.push({
        asset: assetIndex,
        type: header.getInt32(0x0),
        value: header.getInt32(0x4),
        offset: header.getUint32(0x8),
      });

      decompressedDataPosition += 0xc;
    }

    if (headerCount % 0x2 === 0x0) {
      decompressedDataPosition += 0x4;
    }

    const filteredHeadersOffsets = headersOffsets.filter((header) => {
      if (header.type === 0x4) {
        if ($isDebug) {
          console.warn(
            `Header has an unknown type beahviour: ${JSON.stringify(header)}`,
          );
        }

        return false;
      }

      return true;
    });

    let headers: {
      asset: number;
      type: number;
      value: number;
      offset: number;
      data: DataView;
    }[] = [];

    filteredHeadersOffsets.forEach((header, index) => {
      const offset = header.offset;
      const end =
        filteredHeadersOffsets[index + 1] &&
        filteredHeadersOffsets[index + 1].offset;

      headers[index] = {
        ...header,
        data: new DataView(decompressedData.slice(offset, end).buffer),
      };
    });

    three.reset();

    const textures: {
      width: number;
      height: number;
      texture: Uint8Array;
    }[] = [];

    let mesh: Mesh = {
      vertices: [],
      indices: [],
      uvs: [],
      uvsTmp: [],
    };

    let texture: Texture = {
      base64: "",
      color: 0xffffff,
      pixelsOffset: 0x0,
      paletteLength: 0x10,
      paletteOffset: 0x0,
      repeatX: false,
      repeatY: false,
      width: 8,
      height: 8,
    };

    await headers.reduce(async (previousHeader, header, index) => {
      await previousHeader;

      const { data } = header;

      if ($isDebug) {
        console.log("header", index, {
          type: header.type.toHex(),
          value: header.value.toHex(),
          offset: header.offset.toHex(),
        });
      }

      if ([0x0, 0x5, 0x6, 0x8].includes(header.type)) {
        // 3D Object

        hideTree = false;

        mesh = {
          vertices: [],
          indices: [],
          uvs: [],
          uvsTmp: [],
        };

        texture = {
          base64: "",
          color: 0xffffff,
          pixelsOffset: 0x0,
          paletteLength: 0x0,
          paletteOffset: 0x0,
          repeatX: false,
          repeatY: false,
          width: 8,
          height: 8,
        };

        if ($isDebug) {
          console.log(
            `%c[header ${index} [object] (0x${filteredHeadersOffsets[
              index
            ].offset.toHex()})]`,
            "color: grey;",
          );
        }

        for (let i = 0x0; i < data.byteLength - 0x7; i += 0x8) {
          const key = data.getUint8(i);

          if (header.asset !== assetIndex) {
            return previousHeader;
          }

          switch (key) {
            case 0x4:
              setMesh(data, i, decompressedData, mesh);
              break;
            case 0xb1:
              addMesh(three, data, i, mesh, texture, true);
              break;
            case 0xb8:
              if ($isDebug) {
                console.log(`%c[end of header ${index}]`, "color: grey;");
              }
              return;
            case 0xbc:
              setColor(data, i, texture);
              break;
            case 0xbf:
              addMesh(three, data, i, mesh, texture);
              break;
            case 0xf0:
              setTexturePaletteLength(data, i, texture);
              break;
            case 0xf2:
              await applyTexture(
                canvasTexture,
                data,
                i,
                decompressedData,
                texture,
                textures,
              );
              break;
            case 0xf5:
              setTextureManipulations(data, i, texture);
              break;
            case 0xfc:
              resetTexture(data, i, texture, true);
              break;
            case 0xfd:
              setTextureOffsets(data, i, texture);
              break;
            default:
              if ($isDebug) {
                console.log(
                  `%c${data.getUint8(i).toHex(2)}: ${data
                    .getUint24(i + 0x1)
                    .toHex(6)} ${data.getUint32(i + 0x4).toHex(8)}`,
                  "color: red;",
                );
              }
          }
        }
      } else if (header.type === 0x12 || header.type === 0x15) {
        // Colour Index Pixels

        texture.width = header.value >> 0x10;
        texture.height = header.value & 0xfff;
        texture.pixelsOffset = header.offset;

        if (assetIndex === 37 || assetIndex === 872) {
          texture.width -= 1;
        }

        if ($isDebug) {
          console.log(
            `%c[header ${index} [ci pixels] (0x${filteredHeadersOffsets[
              index
            ].offset.toHex()})]`,
            "color: grey;",
          );
        }
      } else if (header.type === 0x19) {
        // 32-bit Texture

        hideTree = true;

        texture.width = header.value >> 0x10;
        texture.height = header.value & 0xfff;

        const sprite = decompressedData.slice(
          header.offset,
          headers[index + 1]?.offset,
        );

        textures.push({
          width: texture.width,
          height: texture.height,
          texture: sprite,
        });

        if ($isDebug) {
          console.log(
            `%c[header ${index} [32-bit texture] (0x${filteredHeadersOffsets[
              index
            ].offset.toHex()})]`,
            "color: grey;",
          );

          console.log(
            `%ctexture format (32-bit ${texture.width}x${texture.height} ${texture.paletteLength} colors)`,
            `color: orange;`,
          );
        }
      } else if (header.type === 0x1a) {
        // Colour Index Palette

        hideTree = true;

        texture.paletteLength = header.value <= 0x10 ? 0x10 : 0x100;
        texture.paletteOffset = header.offset;

        const pixelsLength = texture.paletteOffset - texture.pixelsOffset;

        const pixelsData = decompressedData.slice(
          texture.pixelsOffset,
          texture.pixelsOffset + pixelsLength,
        );

        const paletteData = decompressedData.slice(
          texture.paletteOffset,
          texture.paletteOffset + texture.paletteLength * 2,
        );

        const textureTmp = getImage(
          pixelsData,
          paletteData,
          texture.paletteLength,
        );

        textures.push({
          width: texture.width,
          height: texture.height,
          texture: textureTmp,
        });

        if ($isDebug) {
          console.log(
            `%c[header ${index} [ci pixels] (0x${filteredHeadersOffsets[
              index
            ].offset.toHex()})]`,
            "color: grey;",
          );

          console.log(
            `%ctexture format (CI ${texture.width}x${texture.height} ${texture.paletteLength} colors)`,
            `color: orange;`,
          );
        }
      } else {
        if ($isDebug) {
          console.warn("Not a handled asset header");
        }
      }
    }, Promise.resolve());

    const coordinates: { x: number; y: number }[] = [];

    let width = hideTree ? 1 : 128;
    let height = 1;
    let previousY = 0;

    textures.forEach((texture, index) => {
      let x =
        index > 0 ? coordinates[index - 1].x + textures[index - 1].width : 0;
      let y = previousY;

      if (x + texture.width > width) {
        x = 0;
        y = height;
        previousY = height;
      }

      coordinates.push({ x, y });

      if (hideTree && texture.width > width) {
        width = texture.width;
      }

      if (y + texture.height > height) {
        height = y + texture.height;
      }
    });

    canvas.resize(width, height);

    coordinates.forEach((coordinate, index) => {
      canvas.addGraphic(
        "textures",
        textures[index].texture,
        textures[index].width,
        textures[index].height,
        coordinate.x,
        coordinate.y,
      );
    });

    canvas.render();
  }

  onMount(async () => {
    canvas = new Canvas({ canvasEl });

    canvas.addLayer("textures", "image");

    three = new Three(threeEl, {
      gridHelper: true,
    });

    canvasTexture = new Canvas({
      width: 32,
      height: 32,
    });

    canvasTexture.addLayer("texture", "image");

    updateCanvas();
  });

  onDestroy(() => {
    canvas.destroy();
    three.destroy();
    canvasTexture.destroy();
  });

  $: {
    assetIndex;

    if (three && canvasTexture) {
      updateCanvas();
    }
  }
  $: {
    innerWidth;

    if (three && canvasTexture) {
      const width = threeEl.clientWidth;
      const height = width / 1.78;

      (threeEl.children[0] as HTMLCanvasElement).style.width = "0";

      three.resize(width, height);
    }
  }
</script>

<svelte:window bind:innerWidth on:keydown={handleKeyDown} />

<div class="gtc-assetviewer">
  <div class="gtc-assetviewer-inputs">
    <div>
      <p>Tools</p>
      <div>
        <Checkbox
          label="Grid"
          checked={three?.getGridHelperStatus()}
          onChange={(event) => handleGridHelperStatusChange(event)}
        />
        <Checkbox
          label="Wireframe"
          checked={three?.getWireframeStatus()}
          onChange={(event) => handleWireframeStatusChange(event)}
        />
      </div>
    </div>
    <div>
      <p>Camera</p>
      <div>
        <button class="gtc-assetviewer-button" on:click={handleCameraFit}>
          Fit
        </button>
        <button class="gtc-assetviewer-button" on:click={handleCameraReset}>
          Reset
        </button>
      </div>
    </div>
  </div>
  <div class="gtc-assetviewer-content">
    <div
      class="gtc-assetviewer-canvas"
      class:gtc-assetviewer-canvas-sprite={hideTree}
    >
      <div bind:this={canvasEl} />
    </div>
    <div
      class="gtc-assetviewer-three"
      class:gtc-assetviewer-three-hidden={hideTree}
    >
      <div bind:this={threeEl} />
    </div>
  </div>
</div>

<style lang="postcss">
  .gtc-assetviewer {
    @apply flex-1;

    & .gtc-assetviewer-inputs {
      @apply flex;

      & > div {
        @apply mr-4 mb-4 p-2 w-fit bg-primary-700 rounded;

        & p {
          @apply mb-2 text-sm font-bold;
        }

        & div {
          @apply flex;

          & :global(label) {
            @apply mr-4;
          }

          & .gtc-assetviewer-button {
            @apply text-red-100 bg-primary-400;

            &:first-of-type {
              @apply mr-2;
            }

            &:hover {
              @apply bg-primary-300;
            }
          }
        }
      }
    }

    & .gtc-assetviewer-content {
      @apply flex;

      & .gtc-assetviewer-canvas,
      & .gtc-assetviewer-three {
        @apply self-start p-2 w-fit bg-primary-700 rounded;
      }

      & .gtc-assetviewer-canvas {
        @apply shrink-0 mr-4 min-w-36;

        &.gtc-assetviewer-canvas-sprite {
          @apply min-w-0;
        }
      }

      & .gtc-assetviewer-three {
        @apply w-full;

        &.gtc-assetviewer-three-hidden {
          @apply hidden;
        }
      }
    }
  }
</style>
