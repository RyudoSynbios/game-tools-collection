import { extractBit, getInt, getIntFromArray } from "$lib/utils/bytes";
import type Canvas from "$lib/utils/canvas";
import debug from "$lib/utils/debug";
import { applyPalette, getPalette } from "$lib/utils/graphics";
import type Three from "$lib/utils/three";

import type { Bit } from "$lib/types";

import AssetViewer from "./components/AssetViewer.svelte";

export interface Mesh {
  vertices: number[];
  indices: number[];
  uvs: number[];
  uvsTmp: number[];
}

export interface Texture {
  canvas?: HTMLCanvasElement;
  color: number;
  pixelsOffset: number;
  paletteLength: number;
  paletteOffset: number;
  repeatX: boolean | "mirrored";
  repeatY: boolean | "mirrored";
  width: number;
  height: number;
}

export function getComponent(component: string): any {
  if (component === "AssetViewer") {
    return AssetViewer;
  }
}

export function getDecompressedData(offset: number): Uint8Array {
  const decompressedData: number[] = [];

  const size = getInt(offset, "uint32", { bigEndian: true });

  offset += 0x4;

  const buffer = [...Array(0x400).keys()].fill(0x0);

  let bufferIndex = 0x3be;

  while (decompressedData.length < size) {
    const mask = getInt(offset, "uint8");

    offset += 0x1;

    if (decompressedData.length === 0 && getInt(offset, "uint8") !== 0x36) {
      debug.warn("Not an asset file");

      return new Uint8Array();
    }

    for (let i = 0x0; i < 0x8; i += 0x1) {
      if (extractBit(mask, i as Bit)) {
        const value = getInt(offset, "uint8");

        buffer[bufferIndex] = value;
        decompressedData.push(value);

        bufferIndex = (bufferIndex + 0x1) & 0x3ff;
      } else {
        const special = getInt(offset, "uint16", { bigEndian: true });
        const wordPosition = ((special & 0xc0) << 0x2) | (special >> 0x8);
        const count = 3 + (special & 0x3f);

        for (let j = 0; j < count; j += 1) {
          const value = buffer[(wordPosition + j) & 0x3ff];

          buffer[bufferIndex] = value;
          decompressedData.push(value);

          bufferIndex = (bufferIndex + 0x1) & 0x3ff;
        }

        offset += 0x1;
      }

      offset += 0x1;
    }
  }

  return new Uint8Array(decompressedData);
}

export function getImage(
  imageData: Uint8Array,
  paletteData: Uint8Array,
  colors: number,
): Uint8Array {
  const palette = getPalette("RGBA555", 0x0, colors, {
    bigEndian: true,
    array: paletteData,
  });

  let tileData: number[] = [];

  imageData.forEach((value) => {
    if (colors === 0x10) {
      tileData.push((value & 0xf0) >> 0x4, value & 0xf);
    } else {
      tileData.push(value);
    }
  });

  return applyPalette(tileData, palette);
}

export function setMesh(
  data: Uint8Array,
  i: number,
  decompressedData: Uint8Array,
  mesh: {
    vertices: number[];
    indices: number[];
    uvs: number[];
    uvsTmp: number[];
  },
): void {
  mesh.vertices = [];
  mesh.indices = [];
  mesh.uvs = [];
  mesh.uvsTmp = [];

  const unknown = getIntFromArray(data, i, "uint32", true);

  const verticesCount = data[i + 0x2] >> 0x2;

  const offset = getIntFromArray(data, i + 0x5, "uint24", true);

  if (offset > decompressedData.length) {
    debug.warn(`Offset 0x${offset.toHex()} is out of decompressedData length`);

    return;
  }

  for (let i = 0x0; i < verticesCount; i += 0x1) {
    const object = decompressedData.slice(
      offset + i * 0x10,
      offset + (i + 0x1) * 0x10,
    );

    const x = getIntFromArray(object, 0x0, "int16", true);
    const y = getIntFromArray(object, 0x2, "int16", true);
    const z = getIntFromArray(object, 0x4, "int16", true);

    mesh.vertices.push(x, y, z);

    const uvX = getIntFromArray(object, 0x8, "int16", true);
    const uvY = getIntFromArray(object, 0xa, "int16", true);

    mesh.uvsTmp.push(uvX, uvY);
  }

  debug.color(
    `mesh (${verticesCount} vertices): 0x${offset.toHex()} (0x${unknown.toHex()})`,
    "blue",
  );
}

export function resetTexture(
  data: Uint8Array,
  offset: number,
  texture: Texture,
  log = false,
): void {
  const unknown1 = getIntFromArray(data, offset + 0x1, "uint24", true);
  const unknown2 = getIntFromArray(data, offset + 0x4, "uint32", true);

  texture.canvas = undefined;
  texture.pixelsOffset = 0x0;
  texture.paletteLength = 0x0;
  texture.paletteOffset = 0x0;
  texture.repeatX = false;
  texture.repeatY = false;
  texture.width = 8;
  texture.height = 8;

  if (log) {
    debug.color(
      `texture reset: ${unknown1.toHex(6)} ${unknown2.toHex(8)}`,
      "gold",
    );
  }
}

export function setColor(
  data: Uint8Array,
  offset: number,
  texture: Texture,
): void {
  const unknown = getIntFromArray(data, offset + 0x1, "uint24", true);
  const color = getIntFromArray(data, offset + 0x4, "uint24", true);

  if (unknown === 0x200a) {
    texture.color = color;
  }

  debug.color(
    `apply color (${unknown.toHex()}): 0x${color.toHex(6)}`,
    "magenta",
  );
}

export function setTextureOffsets(
  data: Uint8Array,
  offset: number,
  texture: Texture,
): void {
  const type = getIntFromArray(data, offset + 0x1, "uint24", true);
  offset = getIntFromArray(data, offset + 0x5, "uint24", true);

  if (type === 0x100000) {
    // Palette

    texture.paletteOffset = offset;

    debug.color(`texture palette: 0x${offset.toHex()}`, "purple");
  } else if (type === 0x180000) {
    // 32-bit texture loaded from next asset

    // TODO
    debug.color(
      "texture loaded from next asset (not handled for the moment)",
      "purple",
    );
  } else if (type === 0x480003 || type === 0x48003f || type === 0x500000) {
    // Pixels

    texture.pixelsOffset = offset;

    debug.color(`texture pixels: 0x${offset.toHex()}`, "purple");
  } else {
    debug.warn(`Unknown texture type ${type.toHex(6)}`);
  }
}

export function setTexturePaletteLength(
  data: Uint8Array,
  offset: number,
  texture: Texture,
): void {
  const unknown1 = getIntFromArray(data, offset + 0x1, "uint24", true);
  const unknown2 = getIntFromArray(data, offset + 0x4, "uint32", true);

  texture.paletteLength = 0x10;

  if (unknown2 === 0x703c000) {
    texture.paletteLength = 0x10;
  } else if (unknown2 === 0x73fc000) {
    texture.paletteLength = 0x100;
  }

  debug.color(
    `texture palette length (0x${texture.paletteLength.toHex()}): ${unknown1.toHex(
      6,
    )} ${unknown2.toHex(8)}`,
    "darkgreen",
  );
}

export function setTextureManipulations(
  data: Uint8Array,
  offset: number,
  texture: Texture,
): void {
  const unknown1 = data[offset];
  const unknown2 = getIntFromArray(data, offset + 0x1, "uint24", true);
  const value = getIntFromArray(data, offset + 0x4, "uint32", true);

  if (
    (unknown2 & 0x200) === 0x0 &&
    (unknown2 & 0x400) === 0x0 &&
    (unknown2 & 0x800) === 0x0
  ) {
    debug.color(
      `unknown texture manipulation ${unknown1.toHex(2)}: ${unknown2.toHex(
        6,
      )} ${value.toHex(8)}`,
      "red",
    );

    return;
  }

  texture.repeatX = false;
  texture.repeatY = false;

  if ((value & 0x200) === 0x0) {
    if ((value & 0x40) !== 0x0) {
      texture.repeatX = true;
    } else if ((value & 0x100) !== 0x0) {
      texture.repeatX = "mirrored";
    }
  }

  if ((value & 0x80000) === 0x0) {
    if ((value & 0x4000) !== 0x0) {
      texture.repeatY = true;
    } else if ((value & 0x10000) !== 0x0) {
      texture.repeatY = "mirrored";
    }
  }

  debug.color(
    `texture manipulation repeat (${unknown2.toHex(6)}): ${value.toHex(
      8,
    )} (repeatX: ${texture.repeatX}, repeatY: ${texture.repeatY})`,
    "cyan",
  );
}

export function applyTexture(
  canvas: Canvas,
  data: Uint8Array,
  offset: number,
  decompressedData: Uint8Array,
  texture: Texture,
  textures: {
    width: number;
    height: number;
    texture: Uint8Array;
  }[],
): void {
  const unknown1 = getIntFromArray(data, offset + 0x1, "uint24", true);

  // TODO: Not mode but size to substract
  const mode = unknown1 & 0xff;
  const size = getIntFromArray(data, offset + 0x4, "uint32", true);

  texture.width = (size >> 0xe) + 1;
  texture.height = ((size & 0xfff) >> 0x2) + 1;

  canvas.resize(texture.width, texture.height);

  const pixelsLength = texture.paletteOffset - texture.pixelsOffset;

  const imageData = decompressedData.slice(
    texture.pixelsOffset,
    texture.pixelsOffset + pixelsLength,
  );

  const paletteData = decompressedData.slice(
    texture.paletteOffset,
    texture.paletteOffset + texture.paletteLength * 2,
  );

  const textureTmp = getImage(imageData, paletteData, texture.paletteLength);

  canvas.addGraphic("texture", textureTmp, texture.width, texture.height);

  texture.canvas = canvas.extract();

  textures.push({
    width: texture.width,
    height: texture.height,
    texture: textureTmp,
  });

  debug.color(
    `apply texture (${texture.width}x${
      texture.height
    }) [${mode}]: ${unknown1.toHex(6)} ${size.toHex(8)}`,
    "darkblue",
  );
}

export function addMesh(
  data: Uint8Array,
  offset: number,
  mesh: Mesh,
  texture: Texture,
  three: Three,
  instanceId: string,
  isFace = false,
): void {
  if (isFace) {
    for (let j = 0x0; j < 0x7; j += 0x1) {
      mesh.indices.push(data[offset + 0x1 + j] / 0x2);

      if (j === 0x2) {
        j += 0x1;
      }
    }
  } else {
    for (let j = 0x0; j < 0x3; j += 0x1) {
      mesh.indices.push(data[offset + 0x5 + j] / 0x2);
    }
  }

  mesh.uvsTmp.forEach((uv, index) => {
    const multiplicator =
      (index % 2 === 0x0 ? texture.width : texture.height) * 32;

    mesh.uvs.push(uv / multiplicator);
  });

  three.addMesh(mesh.vertices, mesh.indices, mesh.uvs, instanceId, {
    material: {
      color: texture.color,
      texture: {
        canvas: texture.canvas,
        flipY: false,
        repeatX: texture.repeatX,
        repeatY: texture.repeatY,
      },
    },
  });

  debug.color(`add mesh (${isFace ? "face" : "triangle"})`, "green");

  mesh.indices = [];
}
