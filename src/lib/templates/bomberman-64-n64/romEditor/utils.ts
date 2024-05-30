import { extractBit, getInt } from "$lib/utils/bytes";
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
  base64: string;
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

        bufferIndex = (bufferIndex + 1) & 0x3ff;
      } else {
        const special = getInt(offset, "uint16", { bigEndian: true });
        const wordPosition = ((special & 0xc0) << 0x2) | (special >> 0x8);
        const count = 3 + (special & 0x3f);

        for (let j = 0; j < count; j += 1) {
          const value = buffer[(wordPosition + j) & 0x3ff];

          buffer[bufferIndex] = value;
          decompressedData.push(value);

          bufferIndex = (bufferIndex + 1) & 0x3ff;
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
  data: DataView,
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

  const verticesCount = data.getUint8(i + 0x2) >> 0x2;

  const offset = data.getUint24(i + 0x5);

  if (offset > decompressedData.length) {
    debug.warn(`Offset 0x${offset.toHex()} is out of decompressedData length`);

    return;
  }

  for (let i = 0x0; i < verticesCount; i += 0x1) {
    const object = new DataView(
      decompressedData.slice(offset + i * 0x10, offset + (i + 1) * 0x10).buffer,
    );

    const x = object.getInt16(0x0);
    const y = object.getInt16(0x2);
    const z = object.getInt16(0x4);

    mesh.vertices.push(x, y, z);

    const uvX = object.getInt16(0x8);
    const uvY = object.getInt16(0xa);

    mesh.uvsTmp.push(uvX, uvY);
  }

  debug.color(
    `mesh (${verticesCount} vertices): 0x${offset.toHex()} (0x${data
      .getUint32(i)
      .toHex()})`,
    "blue",
  );
}

export function resetTexture(
  data: DataView,
  offset: number,
  texture: Texture,
  log = false,
): void {
  texture.base64 = "";
  texture.pixelsOffset = 0x0;
  texture.paletteLength = 0x0;
  texture.paletteOffset = 0x0;
  texture.repeatX = false;
  texture.repeatY = false;
  texture.width = 8;
  texture.height = 8;

  if (log) {
    debug.color(
      `texture reset: ${data.getUint24(offset + 0x1).toHex(6)} ${data
        .getUint32(offset + 0x4)
        .toHex(8)}`,
      "gold",
    );
  }
}

export function setColor(
  data: DataView,
  offset: number,
  texture: Texture,
): void {
  const unknown = data.getUint24(offset + 0x1);
  const color = data.getUint24(offset + 0x4);

  if (unknown === 0x200a) {
    texture.color = color;
  }

  debug.color(
    `apply color (${unknown.toHex()}): 0x${color.toHex(6)}`,
    "magenta",
  );
}

export function setTextureOffsets(
  data: DataView,
  offset: number,
  texture: Texture,
): void {
  const type = data.getUint24(offset + 0x1);
  offset = data.getUint24(offset + 0x5);

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
  data: DataView,
  offset: number,
  texture: Texture,
): void {
  const unknown1 = data.getUint24(offset + 0x1);
  const unknown2 = data.getUint32(offset + 0x4);

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
  data: DataView,
  offset: number,
  texture: Texture,
): void {
  const unknown = data.getUint24(offset + 0x1);
  const value = data.getUint32(offset + 0x4);

  if (
    (unknown & 0x200) === 0x0 &&
    (unknown & 0x400) === 0x0 &&
    (unknown & 0x800) === 0x0
  ) {
    debug.color(
      `unknown texture manipulation ${data.getUint8(offset).toHex(2)}: ${data
        .getUint24(offset + 0x1)
        .toHex(6)} ${data.getUint32(offset + 0x4).toHex(8)}`,
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
    `texture manipulation repeat (${unknown.toHex(6)}): ${value.toHex(
      8,
    )} (repeatX: ${texture.repeatX}, repeatY: ${texture.repeatY})`,
    "cyan",
  );
}

export async function applyTexture(
  canvas: Canvas,
  data: DataView,
  offset: number,
  decompressedData: Uint8Array,
  texture: Texture,
  textures: {
    width: number;
    height: number;
    texture: Uint8Array;
  }[],
): Promise<void> {
  // TODO: Not mode but size to substract
  const mode = data.getUint8(offset + 0x1);

  texture.width = (data.getUint32(offset + 0x4) >> 0xe) + 1;
  texture.height = ((data.getUint32(offset + 0x4) & 0xfff) >> 0x2) + 1;

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

  texture.base64 = await canvas.export();

  textures.push({
    width: texture.width,
    height: texture.height,
    texture: textureTmp,
  });

  debug.color(
    `apply texture (${texture.width}x${texture.height}) [${mode}]: ${data
      .getUint24(offset + 0x1)
      .toHex(6)} ${data.getUint32(offset + 0x4).toHex(8)}`,
    "darkblue",
  );
}

export function addMesh(
  three: Three,
  data: DataView,
  offset: number,
  mesh: Mesh,
  texture: Texture,
  isFace = false,
): void {
  if (isFace) {
    for (let j = 0x0; j < 0x7; j += 0x1) {
      mesh.indices.push(data.getUint8(offset + 0x1 + j) / 0x2);

      if (j === 0x2) {
        j += 0x1;
      }
    }
  } else {
    for (let j = 0x0; j < 0x3; j += 0x1) {
      mesh.indices.push(data.getUint8(offset + 0x5 + j) / 0x2);
    }
  }

  mesh.uvsTmp.forEach((uv, index) => {
    const multiplicator =
      (index % 2 === 0x0 ? texture.width : texture.height) * 32;

    mesh.uvs.push(uv / multiplicator);
  });

  three.addMesh(mesh.vertices, mesh.indices, mesh.uvs, {
    color: texture.color,
    texture: texture.base64,
    textureRepeatX: texture.repeatX,
    textureRepeatY: texture.repeatY,
  });

  debug.color(`add mesh (${isFace ? "face" : "triangle"})`, "green");

  mesh.indices = [];
}
