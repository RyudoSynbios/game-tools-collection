import { extractBit, getInt } from "$lib/utils/bytes";
import { flipUvs, getColor } from "$lib/utils/graphics";
import type { MaterialOptions } from "$lib/utils/three";

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
  data: Uint8Array;
  canvas?: HTMLCanvasElement;
}

export interface Materials {
  uvs: number[];
  options: MaterialOptions[];
}

export function getMaterials(
  offset: number,
  count: number,
  textures: Texture[],
  dataView: DataView,
): Materials {
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

    let canvas = undefined;

    if (extractBit(textureType, 2)) {
      canvas = textures[textureIndex]?.canvas;
    }

    options.push({
      color: meshColor,
      doubleSide: (textureType & 0x100) !== 0x0,
      texture: {
        canvas,
      },
    });
  }

  return {
    uvs,
    options,
  };
}
