<script lang="ts">
  import { onDestroy, onMount } from "svelte";

  import Modal from "$lib/components/Modal.svelte";
  import ModelViewer from "$lib/components/ModelViewer.svelte";
  import { getInt, getIntFromArray } from "$lib/utils/bytes";
  import Canvas from "$lib/utils/canvas";
  import debug from "$lib/utils/debug";
  import { generateGraphicsSheet } from "$lib/utils/graphics";
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
    type Mesh,
    type Texture,
  } from "../utils";
  import TextureViewer from "./TextureViewer.svelte";

  export let assetIndex: number;

  let canvas: Canvas;
  let canvasTexture: Canvas;
  let three: Three;

  let canvasEl: HTMLDivElement;
  let threeEl: HTMLDivElement;

  let textures: {
    width: number;
    height: number;
    texture: Uint8Array;
  }[] = [];
  let isTextureViewerOpen = false;
  let view: "canvas" | "three" = "three";

  let tableOffset = 0x300000;

  const baseOffset =
    tableOffset + getInt(tableOffset, "uint32", { bigEndian: true });

  tableOffset += 0x8;

  const assets: number[] = [];

  while (true) {
    const offset =
      baseOffset + getInt(tableOffset, "uint32", { bigEndian: true });

    const compressedSize = getInt(tableOffset + 0x4, "uint32", {
      bigEndian: true,
    });

    if (compressedSize === 0xffffffff) {
      break;
    }

    assets.push(offset);

    tableOffset += 0x8;
  }

  function handleTextureViewerClose(): void {
    isTextureViewerOpen = false;
  }

  function handleTextureViewerOpen(): void {
    isTextureViewerOpen = true;
  }

  async function updateCanvas(): Promise<void> {
    debug.clear();

    canvas.reset();
    three.reset();

    const instanceId = three.getInstanceId();

    three.setLoading(true);

    const decompressedData = getDecompressedData(assets[assetIndex]);

    if (decompressedData.length === 0) {
      view = "canvas";
    }

    const folderHeader = decompressedData.slice(0x0, 0xc);
    const headerCount = folderHeader[7];

    let decompressedDataPosition = 0xc;

    let headersOffsets: {
      type: number;
      value: number;
      offset: number;
    }[] = [];

    for (let i = 0x0; i < headerCount; i += 0x1) {
      const header = decompressedData.slice(
        decompressedDataPosition,
        decompressedDataPosition + 0xc,
      );

      headersOffsets.push({
        type: getIntFromArray(header, 0x0, "int32", true),
        value: getIntFromArray(header, 0x4, "int32", true),
        offset: getIntFromArray(header, 0x8, "uint32", true),
      });

      decompressedDataPosition += 0xc;
    }

    if (headerCount % 0x2 === 0x0) {
      decompressedDataPosition += 0x4;
    }

    const filteredHeadersOffsets = headersOffsets.filter((header) => {
      if (header.type === 0x4) {
        debug.warn(
          `Header has an unknown type beahviour: ${JSON.stringify(header)}`,
        );

        return false;
      }

      return true;
    });

    let headers: {
      type: number;
      value: number;
      offset: number;
      data: Uint8Array;
    }[] = [];

    filteredHeadersOffsets.forEach((header, index) => {
      const offset = header.offset;
      const end =
        filteredHeadersOffsets[index + 1] &&
        filteredHeadersOffsets[index + 1].offset;

      headers[index] = {
        ...header,
        data: decompressedData.slice(offset, end),
      };
    });

    textures = [];

    let mesh: Mesh = {
      vertices: [],
      indices: [],
      uvs: [],
      uvsTmp: [],
    };

    let texture: Texture = {
      name: "",
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

      if (instanceId !== three.getInstanceId()) {
        return previousHeader;
      }

      const { data } = header;

      debug.log("header", index, {
        type: header.type.toHex(),
        value: header.value.toHex(),
        offset: header.offset.toHex(),
      });

      if ([0x0, 0x5, 0x6, 0x8].includes(header.type)) {
        // 3D Object

        view = "three";

        mesh = {
          vertices: [],
          indices: [],
          uvs: [],
          uvsTmp: [],
        };

        texture = {
          name: "",
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

        debug.color(
          `[header ${index} [object] (0x${filteredHeadersOffsets[
            index
          ].offset.toHex()})]`,
          "grey",
        );

        for (let i = 0x0; i < data.byteLength - 0x7; i += 0x8) {
          const key = data[i];
          const unknown1 = getIntFromArray(data, i + 0x1, "uint24", true);
          const unknown2 = getIntFromArray(data, i + 0x4, "uint32", true);

          if (instanceId !== three.getInstanceId()) {
            return previousHeader;
          }

          switch (key) {
            case 0x4:
              setMesh(data, i, decompressedData, mesh);
              break;
            case 0xb1:
              addMesh(data, i, mesh, texture, three, instanceId, true);
              break;
            case 0xb8:
              debug.color(`[end of header ${index}]`, "grey");
              return;
            case 0xbc:
              setColor(data, i, texture);
              break;
            case 0xbf:
              addMesh(data, i, mesh, texture, three, instanceId);
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
              debug.color(
                `${key.toHex(2)}: ${unknown1.toHex(6)} ${unknown2.toHex(8)}`,
                "red",
              );
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

        debug.color(
          `[header ${index} [ci pixels] (0x${filteredHeadersOffsets[
            index
          ].offset.toHex()})]`,
          "grey",
        );
      } else if (header.type === 0x19) {
        // 32-bit Texture

        view = "canvas";

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

        debug.color(
          `[header ${index} [32-bit texture] (0x${filteredHeadersOffsets[
            index
          ].offset.toHex()})]`,
          "grey",
        );

        debug.color(
          `texture format (32-bit ${texture.width}x${texture.height} ${texture.paletteLength} colors)`,
          "orange",
        );
      } else if (header.type === 0x1a) {
        // Colour Index Palette

        view = "canvas";

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

        debug.color(
          `[header ${index} [ci pixels] (0x${filteredHeadersOffsets[
            index
          ].offset.toHex()})]`,
          "grey",
        );

        debug.color(
          `texture format (CI ${texture.width}x${texture.height} ${texture.paletteLength} colors)`,
          "orange",
        );
      } else {
        debug.warn("Not a handled asset header");
      }

      three.updateLoadingProgression((index + 1) / headers.length, instanceId);
    }, Promise.resolve());

    if (instanceId !== three.getInstanceId()) {
      return;
    }

    three.setTextureListCallback(
      textures.length > 0 ? handleTextureViewerOpen : undefined,
    );

    three.setLoading(false);

    if (view === "canvas") {
      const sheet = generateGraphicsSheet(0, textures);

      canvas.resize(sheet.width, sheet.height);

      textures.forEach((texture, index) => {
        canvas.addGraphic(
          "textures",
          texture.texture,
          texture.width,
          texture.height,
          sheet.coordinates[index].x,
          sheet.coordinates[index].y,
        );
      });

      canvas.render();
    }
  }

  onMount(async () => {
    canvas = new Canvas({ canvasEl });

    canvas.addLayer("textures", "image");

    canvasTexture = new Canvas({
      width: 32,
      height: 32,
    });

    canvasTexture.addLayer("texture", "image");

    three = new Three(threeEl, { textureFlipY: false });

    updateCanvas();
  });

  onDestroy(() => {
    canvas.destroy();
    canvasTexture.destroy();
    three.destroy();
  });

  $: {
    assetIndex;

    if (canvasTexture && three) {
      updateCanvas();
    }
  }
</script>

<div class="gtc-assetviewer">
  <div
    class="gtc-assetviewer-canvas"
    class:gtc-assetviewer-hidden={view !== "canvas"}
  >
    <div bind:this={canvasEl} />
  </div>
  <div class:gtc-assetviewer-hidden={view !== "three"}>
    <ModelViewer {three} bind:threeEl />
  </div>
  {#if isTextureViewerOpen}
    <Modal onClose={handleTextureViewerClose}>
      <TextureViewer {textures} />
    </Modal>
  {/if}
</div>

<style lang="postcss">
  .gtc-assetviewer {
    @apply z-10 w-full flex-1;

    & .gtc-assetviewer-canvas {
      @apply w-fit rounded bg-primary-700 p-2;
    }

    & .gtc-assetviewer-hidden {
      @apply hidden;
    }
  }
</style>
