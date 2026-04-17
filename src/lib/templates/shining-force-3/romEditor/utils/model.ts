import { extractBit, getInt, getIntFromArray } from "$lib/utils/bytes";
import Canvas from "$lib/utils/canvas";
import { generateUUID } from "$lib/utils/format";
import { flipUvs, getColor } from "$lib/utils/graphics";
import type { MaterialOptions } from "$lib/utils/three";

import type { Palette } from "$lib/types";

export function getVertices(
  offset: number,
  count: number,
  dataView: DataView,
): number[] {
  const vertices = [];

  // prettier-ignore
  for (let i = 0x0; i < count; i += 0x1) {
      let x = -getInt(offset + i * 0xc, "int16", { bigEndian: true }, dataView);
      let y = -getInt(offset + i * 0xc + 0x4, "int16", { bigEndian: true }, dataView);
      let z = getInt(offset + i * 0xc + 0x8, "int16", { bigEndian: true }, dataView);

      x += -getInt(offset + i * 0xc + 0x2, "uint16", { bigEndian: true }, dataView) / 0x10000;
      y += -getInt(offset + i * 0xc + 0x6, "uint16", { bigEndian: true }, dataView) / 0x10000;
      z += getInt(offset + i * 0xc + 0xa, "uint16", { bigEndian: true }, dataView) / 0x10000;

      vertices.push(x, y, z);
    }

  return vertices;
}

export function getIndices(
  offset: number,
  count: number,
  dataView: DataView,
): number[] {
  const indices: number[] = [];

  for (let i = 0x0; i < count; i += 0x1) {
    for (let j = 0x0; j < 0x4; j += 0x1) {
      const indice = getInt(
        offset + i * 0x14 + j * 0x2 + 0xc,
        "uint16",
        { bigEndian: true },
        dataView,
      );

      indices.push(indice);

      if (j === 0x2) {
        indices.push(indice);
      } else if (j === 0x3) {
        indices.push(indices[indices.length - 0x5]);
      }
    }
  }

  return indices;
}

export interface Texture {
  width: number;
  height: number;
  rawData: Uint8Array;
  data: Uint8Array;
  base64: string;
}

export interface Materials {
  uvs: number[];
  options: MaterialOptions[];
}

export async function getMaterials(
  offset: number,
  count: number,
  textures: Texture[],
  canvas: Canvas,
  dataView: DataView,
  overrideOptions: MaterialOptions = {},
  palette: Palette = [],
): Promise<Materials> {
  const uvs = [];
  const options: MaterialOptions[] = [];

  for (let i = 0x0; i < count; i += 0x1) {
    const textureType = getInt(offset + i * 0xc, "uint16", { bigEndian: true }, dataView); // prettier-ignore

    const textureIndex = getInt(offset + i * 0xc + 0x2, "uint16", { bigEndian: true }, dataView); // prettier-ignore

    const rawColor = getInt(offset + i * 0xc + 0x6, "uint16", { bigEndian: true }, dataView); // prettier-ignore

    const color = getColor(rawColor, "BGR555");

    const meshColor = (color[0] << 0x10) | (color[1] << 0x8) | color[2];

    const textureOrientation = getInt(offset + i * 0xc + 0xa, "uint16", { bigEndian: true }, dataView); // prettier-ignore

    const flipX = extractBit(textureOrientation, 4);
    const flipY = extractBit(textureOrientation, 5);

    let uv = [0, 1, 1, 1, 1, 0, 1, 0, 0, 0, 0, 1];

    if (flipX) {
      uv = flipUvs(uv, "x");
    }

    if (flipY) {
      uv = flipUvs(uv, "y");
    }

    uvs.push(...uv);

    let base64 = "";

    if (extractBit(textureType, 2)) {
      const texture = textures[textureIndex];

      if (texture.base64) {
        base64 = texture.base64;
      } else {
        base64 = await generateTexture(texture, canvas, palette);
      }
    }

    options.push({
      color:
        overrideOptions.color !== undefined ? overrideOptions.color : meshColor,
      side: (textureType & 0x100) !== 0x0 ? "double" : "front",
      opacity: overrideOptions.opacity || 1,
      texture: {
        name: generateUUID(),
        base64:
          overrideOptions?.texture?.base64 !== undefined
            ? overrideOptions.texture.base64
            : base64,
      },
    });
  }

  return {
    uvs,
    options,
  };
}

export function getTextureData(
  texture: Texture,
  palette: Palette = [],
): Uint8Array {
  const textureData = [];

  const usePalette = palette.length > 0;

  for (
    let j = 0x0;
    j < texture.rawData.length / (usePalette ? 1 : 2);
    j += 0x1
  ) {
    let rawColor = 0x0;
    let color = [];

    if (usePalette) {
      rawColor = texture.rawData[j];
      color = palette[rawColor] || [0, 0, 0, 0];
    } else {
      rawColor = getIntFromArray(texture.rawData, j * 0x2, "uint16", true);
      color = getColor(rawColor, "ABGR555");
    }

    textureData.push(...color);
  }

  return new Uint8Array(textureData);
}

export async function generateTexture(
  texture: Texture,
  canvas: Canvas,
  palette: Palette = [],
): Promise<string> {
  const data = getTextureData(texture, palette);

  canvas.resize(texture.width, texture.height);
  canvas.addGraphic("texture", data, texture.width, texture.height);

  const base64 = await canvas.export();

  texture.data = data;
  texture.base64 = base64;

  return base64;
}
