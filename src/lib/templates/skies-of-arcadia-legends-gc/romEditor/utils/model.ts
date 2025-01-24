import { Group } from "three";

import { extractBit, getInt } from "$lib/utils/bytes";
import Canvas from "$lib/utils/canvas";
import { getGvrTexture, GvrTexture } from "$lib/utils/common/gamecube";
import debug from "$lib/utils/debug";
import Three, { type Side } from "$lib/utils/three";

import { NjtlFile } from "../utils";
import { NjcmObject } from "./njcm";
import { NmldFile } from "./nmld";

export function getVertices(
  offset: number,
  vertexBuffer: number[],
  dataView: DataView,
  // TODO: Remove
  object: NjcmObject,
  index: number,
): { error: boolean; vertices: number[] } {
  const vertices = [];

  let error = false;
  let iteration = 0;

  while (true) {
    const unknown1 = getInt(offset, "uint16", { bigEndian: true }, dataView); // prettier-ignore
    const unknown2 = getInt(offset + 0x2, "uint16", { bigEndian: true }, dataView); // prettier-ignore

    let mode = 0;
    let color = "blue";

    // TODO: To check "& 0xff" > 0x80xx
    switch (unknown2 & 0xff) {
      // case 0x22: // TODO: To check
      case 0x23:
        mode = 0;
        break;
      case 0x29:
        mode = 1;
        break;
      case 0x2a:
        mode = 2;
        break;
      case 0x2c:
        mode = 3;
        break;
      case 0xff:
        mode = 4;
        color = "green";
        break;
      default:
        mode = 5;
        color = "red";
        error = true;
    }

    if (mode >= 4) {
      debug.color(
        `{${object.parentIndex}} [${index}] (0x${offset.toHex(8)}) Vertices ${iteration} (mode ${mode}) > unk1: 0x${unknown1.toHex(4)}, unk2: 0x${unknown2.toHex(4)}`,
        color,
      );

      break;
    }

    const count = getInt(offset + 0x4, "uint16", { bigEndian: true }, dataView); // prettier-ignore
    const basePosition = getInt(offset + 0x6, "uint16", { bigEndian: true }, dataView); // prettier-ignore

    // TODO: unknown3 shift in vertice table, so related indexes takes account of this shift > Find a way to link indices to vertice table

    debug.color(
      `{${object.parentIndex}} [${index}] (0x${offset.toHex(8)}) Vertices ${iteration} (mode ${mode}) > unk1: 0x${unknown1.toHex(4)}, unk2: 0x${unknown2.toHex(4)}, count: ${count}, position: ${basePosition}`,
      color,
    );

    offset += 0x8;

    for (let i = 0x0; i < count; i += 0x1) {
      let position = basePosition + i;

      let x = getInt(offset, "float32", { bigEndian: true }, dataView); // prettier-ignore
      let y = getInt(offset + 0x4, "float32", { bigEndian: true }, dataView); // prettier-ignore
      let z = getInt(offset + 0x8, "float32", { bigEndian: true }, dataView); // prettier-ignore

      // const unknown1 = getInt(offset + 0xc, "float32", { bigEndian: true }, dataView); // prettier-ignore

      offset += 0x10;

      if (mode >= 1) {
        // const unknown2 = getInt(offset, "float32", { bigEndian: true }, dataView); // prettier-ignore
        // const unknown3 = getInt(offset + 0x4, "float32", { bigEndian: true }, dataView); // prettier-ignore

        offset += 0x8;
      }

      if (mode === 2) {
        // TODO: VertexColors?
        // const unknown4 = getInt(offset, "uint8", {}, dataView); // prettier-ignore
        // const unknown5 = getInt(offset + 0x1, "uint8", {}, dataView); // prettier-ignore
        // const unknown6 = getInt(offset + 0x2, "uint8", {}, dataView); // prettier-ignore
        // const unknown7 = getInt(offset + 0x3, "uint8", {}, dataView); // prettier-ignore

        offset += 0x4;
      } else if (mode === 3) {
        // const multiplicator = getInt(offset, "uint16", { bigEndian: true }, dataView) / 0xff; // prettier-ignore
        const shift = getInt(offset + 0x2, "uint16", { bigEndian: true }, dataView); // prettier-ignore

        // x *= multiplicator;
        // y *= multiplicator;
        // z *= multiplicator;

        position = basePosition + shift;

        offset += 0x4;
      }

      vertices.push(x, y, z);

      position *= 3;

      // TODO:
      if ((unknown2 & 0x7ff) >> 0x8 !== 0x0) {
        // x += vertexBuffer[position];
        // y += vertexBuffer[position + 1];
        // z += vertexBuffer[position + 2];
      }

      vertexBuffer[position] = x;
      vertexBuffer[position + 1] = y;
      vertexBuffer[position + 2] = z;

      offset += length;
    }

    iteration += 1;
  }

  return { error, vertices };
}

// TODO
export interface Texture extends GvrTexture {
  base64: string;
}

export async function getTextures(
  njtl: NjtlFile,
  nmld: NmldFile,
  canvas: Canvas,
): Promise<Texture[]> {
  const textures: Texture[] = [];

  if (njtl) {
    await njtl.textures.reduce(async (previousTexture, name) => {
      await previousTexture;

      const gvrTexture = getGvrTexture(canvas, nmld.textures[name]);

      canvas.resize(gvrTexture.width, gvrTexture.height);

      canvas.addGraphic(
        "texture",
        gvrTexture.data,
        gvrTexture.width,
        gvrTexture.height,
      );

      const base64 = await canvas.export();

      textures.push({ ...gvrTexture, base64 });
    }, Promise.resolve());
  }

  return textures;
}

export function addMeshs(
  offset: number,
  vertexBuffer: number[],
  dataView: DataView,
  three: Three,
  instanceId: string,
  group: Group,
  textures: Texture[],
  // TODO: Remove
  object: NjcmObject,
  index: number,
): { error: boolean } {
  let error = false;
  let iteration = 0;

  const parameters = {
    color: 0xffffff,
    opacity: 1,
    texture: {},
  };

  while (true) {
    const unknown1 = getInt(offset, "uint16", { bigEndian: true }, dataView); // prettier-ignore

    let mode = 0;
    let color = "mediumorchid";

    if (unknown1 === 0xff) {
      mode = 7;
      color = "green";
    } else {
      switch (unknown1 & 0xff) {
        case 0x4: // # ???
          mode = 0;
          color = "orange";
          error = true;
          break;
        case 0x5: // # ???
          color = "orange";
          mode = 1;
          error = true;
          break;
        case 0x8: // # Texture
          mode = 2;
          break;
        case 0x13: // # Colors
          mode = 3;
          break;
        case 0x17: // # Colors + ???
          color = "orange";
          mode = 4;
          break;
        case 0x40: // # Mesh
          mode = 5;
          break;
        case 0x41: // # Mesh + UVs
          mode = 6;
          break;
        case 0x42: // # Mesh + UVs
          color = "orange";
          mode = 6;
          break;
        default:
          mode = 8;
          color = "red";
          error = true;
      }
    }

    if (mode >= 7) {
      debug.color(
        `{${object.parentIndex}} [${index}] (0x${offset.toHex(8)}) Mesh ${iteration} (mode ${mode}) > unk1: 0x${unknown1.toHex(4)}`,
        color,
      );

      break;
    }

    offset += 0x2;

    if (mode === 0) {
      // TODO

      debug.color(
        `{${object.parentIndex}} [${index}] (0x${(offset - 0x2).toHex(8)}) Mesh ${iteration} (mode ${mode}) > unk1: 0x${unknown1.toHex(4)}`,
        color,
      );

      offset += 0x2;
    } else if (mode === 1) {
      // TODO

      debug.color(
        `{${object.parentIndex}} [${index}] (0x${(offset - 0x2).toHex(8)}) Mesh ${iteration} (mode ${mode}) > unk1: 0x${unknown1.toHex(4)}`,
        color,
      );
    } else if (mode === 2) {
      const repeatY = !extractBit(unknown1, 12);
      const repeatX = !extractBit(unknown1, 13);
      const mirroredY = extractBit(unknown1, 14);
      const mirroredX = extractBit(unknown1, 15);

      // const textureQuality = getInt(offset, "uint8", { bigEndian: true }, dataView); // prettier-ignore
      const textureIndex = getInt(offset + 0x1, "uint8", { bigEndian: true }, dataView); // prettier-ignore

      parameters.texture = {
        base64: textures[textureIndex].base64,
        flipY: false,
        repeatX: mirroredX ? "mirrored" : repeatX,
        repeatY: mirroredY ? "mirrored" : repeatY,
      };

      debug.color(
        `{${object.parentIndex}} [${index}] (0x${(offset - 0x2).toHex(8)}) Mesh ${iteration} (mode ${mode}) > unk1: 0x${unknown1.toHex(4)}, textureIndex: ${textureIndex}`,
        color,
      );

      offset += 0x2;
    } else if (mode === 3 || mode === 4) {
      const unknown2 = getInt(offset, "uint16", { bigEndian: true }, dataView); // prettier-ignore

      const uBlue = getInt(offset + 0x2, "uint8", {}, dataView);
      const uGreen = getInt(offset + 0x3, "uint8", {}, dataView);
      const uRed = getInt(offset + 0x4, "uint8", {}, dataView);
      const uAlpha = getInt(offset + 0x5, "uint8", {}, dataView);

      const uColor = (uRed << 0x10) | (uGreen << 0x8) | uBlue;

      const cBlue = getInt(offset + 0x6, "uint8", {}, dataView);
      const cGreen = getInt(offset + 0x7, "uint8", {}, dataView);
      const cRed = getInt(offset + 0x8, "uint8", {}, dataView);
      const cAlpha = getInt(offset + 0x9, "uint8", {}, dataView);

      const cColor = (cRed << 0x10) | (cGreen << 0x8) | cBlue;

      parameters.color = cColor;
      parameters.opacity = uAlpha / 0xff;

      debug.color(
        `{${object.parentIndex}} [${index}] (0x${(offset - 0x2).toHex(8)}) Mesh ${iteration} (mode ${mode}) > unk1: 0x${unknown1.toHex(4)}, unk2: 0x${unknown2.toHex(4)}, uColor: 0x${uColor.toHex(6)}, uAlpha: ${uAlpha}, cColor: 0x${parameters.color.toHex(6)}, cAlpha: ${cAlpha}`,
        color,
      );

      offset += 0xa;

      if (mode >= 4) {
        // TODO: ???

        offset += 0x4;
      }
    } else if (mode === 5 || mode === 6) {
      const unknown2 = getInt(offset, "uint16", { bigEndian: true }, dataView); // prettier-ignore

      const meshCount = getInt(offset + 0x2, "uint16", { bigEndian: true }, dataView); // prettier-ignore

      if (vertexBuffer.length > 0) {
        debug.color(
          `{${object.parentIndex}} [${index}] (0x${(offset - 0x2).toHex(8)}) Mesh ${iteration} (mode ${mode}) > unk1: 0x${unknown1.toHex(4)}, unk2: 0x${unknown2.toHex(4)}, count: ${meshCount}`,
          color,
        );
      } else {
        debug.color(
          `{${object.parentIndex}} [${index}] (0x${(offset - 0x2).toHex(8)}) Mesh ${iteration} (mode ${mode}) > unk1: 0x${unknown1.toHex(4)}, unk2: 0x${unknown2.toHex(4)}, count: ${meshCount} > NO VERTICES`,
          "red",
        );
      }

      offset += 0x4;

      for (let i = 0x0; i < meshCount; i += 0x1) {
        const indices = [];
        const uvs = [];

        let indiceCount = getInt(offset, "int16", { bigEndian: true }, dataView); // prettier-ignore
        // let side: Side = "front";

        if (indiceCount < 0) {
          // side = "back";
          indiceCount *= -1;
        }

        offset += 0x2;

        for (let j = 0x0; j < indiceCount; j += 0x1) {
          const indice = getInt(offset, "int16", { bigEndian: true }, dataView); // prettier-ignore

          offset += 0x2;

          indices.push(indice);

          if (j && j < indiceCount - 0x1) {
            if (j % 0x2 === 0x0) {
              indices.push(indice, indices[indices.length - 0x2]);
            } else if (j > 1 && j % 0x2 !== 0x0) {
              indices.push(indices[indices.length - 0x3], indice);
            }
          }

          if (mode >= 6) {
            const uvX = getInt(offset, "int16", { bigEndian: true }, dataView) / 256; // prettier-ignore
            const uvY = getInt(offset + 0x2, "int16", { bigEndian: true }, dataView) / 256; // prettier-ignore

            uvs.push(uvX, uvY);

            if (j && j < indiceCount - 0x1) {
              if (j % 0x2 === 0x0) {
                uvs.push(uvX, uvY, uvs[uvs.length - 0x4], uvs[uvs.length - 0x3]); // prettier-ignore
              } else if (j > 1 && j % 0x2 !== 0x0) {
                uvs.push(uvs[uvs.length - 0x6], uvs[uvs.length - 0x5], uvX, uvY); // prettier-ignore
              }
            }

            offset += 0x4;
          }
        }

        if (vertexBuffer.length > 0) {
          three.addMesh(vertexBuffer, indices, uvs, instanceId, {
            group,
            geometry: {
              nonIndexed: true,
            },
            material: {
              color: parameters.color,
              model: "lambert",
              opacity: parameters.opacity,
              // side,
              side: "double", // TODO: Temporary
              texture: parameters.texture,
            },
          });
        }
      }

      offset += offset % 0x4 !== 0x0 ? 0x2 : 0x0;
    }

    iteration += 1;
  }

  return { error };
}
