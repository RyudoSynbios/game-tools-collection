import { extractBit, getInt } from "$lib/utils/bytes";
import Canvas from "$lib/utils/canvas";
import { generateTexture, Texture } from "$lib/utils/common/saturn/shining";
import { generateUUID } from "$lib/utils/format";
import { flipUvs, getColor } from "$lib/utils/graphics";
import type { MaterialOptions } from "$lib/utils/three";

import type { Palette } from "$lib/types";

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
