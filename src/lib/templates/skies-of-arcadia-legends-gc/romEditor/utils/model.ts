import { Group } from "three";

import { extractBit, getInt } from "$lib/utils/bytes";
import Canvas from "$lib/utils/canvas";
import { getGvrTexture, GvrTexture } from "$lib/utils/common/gamecube";
import debug from "$lib/utils/debug";
import Three from "$lib/utils/three";

import { Model, NjtlFile } from "../utils";
import { NjcmObject } from "./njcm";

// TODO
export interface Texture extends GvrTexture {
  base64: string;
}

export async function getTextures(
  njtl: NjtlFile,
  model: Model,
  canvas: Canvas,
): Promise<Texture[]> {
  const textures: Texture[] = [];

  if (njtl) {
    await njtl.textures.reduce(async (previousTexture, name) => {
      await previousTexture;

      const gvrTexture = getGvrTexture(canvas, model.textures[name]);

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
    const size = getInt(offset, "uint16", { bigEndian: true }, dataView) * 0x4;
    const unknown2 = getInt(offset + 0x2, "uint8", {}, dataView);
    const type = getInt(offset + 0x3, "uint8", {}, dataView);

    let color = "blue";

    let hasNormals = false;
    let hasVertexColor = false;
    let hasSkinWeight = false;

    let end = false;

    switch (type) {
      case 0x22:
        break;
      case 0x23:
        hasVertexColor = true;
        break;
      case 0x29:
        hasNormals = true;
        break;
      case 0x2a:
        hasNormals = true;
        hasVertexColor = true;
        break;
      case 0x2c:
        hasNormals = true;
        hasSkinWeight = true;
        break;
      case 0xff:
        color = "green";
        end = true;
        break;
      default:
        color = "red";
        end = true;
        error = true;
    }

    if (end) {
      debug.color(
        `{${object.parentIndex}} [${index}] (0x${offset.toHex(8)}) Vertices ${iteration} > type: 0x${type.toHex(2)}, size: 0x${size.toHex(4)}, unk2: 0x${unknown2.toHex(2)}${color === "red" ? " > TYPE NOT HANDLED" : ""}`,
        color,
      );

      break;
    }

    const count = getInt(offset + 0x4, "uint16", { bigEndian: true }, dataView);
    const basePosition = getInt(offset + 0x6, "uint16", { bigEndian: true }, dataView); // prettier-ignore

    // TODO: unknown3 shift in vertice table, so related indexes takes account of this shift > Find a way to link indices to vertice table

    debug.color(
      `{${object.parentIndex}} [${index}] (0x${offset.toHex(8)}) Vertices ${iteration} > type: 0x${type.toHex(2)}, size: 0x${size.toHex(4)}, unk2: 0x${unknown2.toHex(2)}, count: ${count}, position: ${basePosition}`,
      color,
    );

    offset += 0x8;

    for (let i = 0x0; i < count; i += 0x1) {
      let position = basePosition + i;

      const vX = getInt(offset, "float32", { bigEndian: true }, dataView);
      const vY = getInt(offset + 0x4, "float32", { bigEndian: true }, dataView);
      const vZ = getInt(offset + 0x8, "float32", { bigEndian: true }, dataView);

      offset += 0xc;

      if (hasNormals) {
        // const nX = getInt(offset + 0xc, "float32", { bigEndian: true }, dataView);
        // const nY = getInt(offset, "float32", { bigEndian: true }, dataView);
        // const nZ = getInt(offset + 0x4, "float32", { bigEndian: true }, dataView);

        offset += 0xc;
      }

      if (hasVertexColor) {
        // const vcRed = getInt(offset, "uint8", {}, dataView);
        // const vcGreen = getInt(offset + 0x1, "uint8", {}, dataView);
        // const vcBlue = getInt(offset + 0x2, "uint8", {}, dataView);
        // const vcAlpha = getInt(offset + 0x3, "uint8", {}, dataView);

        offset += 0x4;
      }

      if (hasSkinWeight) {
        // const multiplier = getInt(offset, "uint16", { bigEndian: true }, dataView) / 0xff;
        const shift = getInt(offset + 0x2, "uint16", { bigEndian: true }, dataView); // prettier-ignore

        // vX *= multiplier;
        // vY *= multiplier;
        // vZ *= multiplier;

        position = basePosition + shift;

        offset += 0x4;
      }

      vertices.push(vX, vY, vZ);

      position *= 3;

      // TODO
      if ((type & 0x7ff) >> 0x8 !== 0x0) {
        // vX += vertexBuffer[position];
        // vY += vertexBuffer[position + 1];
        // vZ += vertexBuffer[position + 2];
      }

      vertexBuffer[position] = vX;
      vertexBuffer[position + 1] = vY;
      vertexBuffer[position + 2] = vZ;

      offset += length;
    }

    iteration += 1;
  }

  return { error, vertices };
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
  objects: NjcmObject[],
): { error: boolean } {
  let error = false;
  let iteration = 0;

  const material = {
    color: 0xffffff,
    opacity: 1,
    texture: {},
  };

  while (true) {
    const flags = getInt(offset, "uint8", {}, dataView);
    const type = getInt(offset + 0x1, "uint8", {}, dataView);

    let color = "purple";

    let isSpecial1 = false;
    let isSpecial2 = false;
    let isTexture = false;
    let isMaterial = false;
    let hasDiffuse = false;
    let hasAmbient = false;
    let hasSpecular = false;
    let isMesh = false;
    let hasUvs = false;
    let uvSize = 0x100;

    let end = false;

    switch (type) {
      // case 0x4:
      //   color = "orange";
      //   isSpecial1 = true;
      //   break;
      case 0x5:
        color = "orange";
        isSpecial2 = true;
        break;
      case 0x8:
        color = "gold";
        isTexture = true;
        break;
      case 0x11:
        color = "mediumorchid";
        isMaterial = true;
        hasDiffuse = true;
        break;
      case 0x12:
        color = "mediumorchid";
        isMaterial = true;
        hasAmbient = true;
        break;
      case 0x13:
        color = "mediumorchid";
        isMaterial = true;
        hasDiffuse = true;
        hasAmbient = true;
        break;
      case 0x17:
        color = "mediumorchid";
        isMaterial = true;
        hasDiffuse = true;
        hasAmbient = true;
        hasSpecular = true;
        break;
      case 0x40:
        isMesh = true;
        break;
      case 0x41:
        isMesh = true;
        hasUvs = true;
        break;
      case 0x42:
        isMesh = true;
        hasUvs = true;
        uvSize = 0x400;
        break;
      case 0xff:
        color = "green";
        end = true;
        break;
      default:
        color = "red";
        end = true;
        error = true;
    }

    if (end) {
      debug.color(
        `{${object.parentIndex}} [${index}] (0x${offset.toHex(8)}) Mesh ${iteration} > type: 0x${type.toHex(2)}${color === "red" ? " > TYPE NOT HANDLED" : ""}`,
        color,
      );

      break;
    }

    offset += 0x2;

    // Special

    if (isSpecial1) {
      const unknown2 = getInt(offset, "uint16", { bigEndian: true }, dataView);

      // TODO

      debug.color(
        `{${object.parentIndex}} [${index}] (0x${(offset - 0x2).toHex(8)}) Special ${iteration} > type: 0x${type.toHex(2)}, unk2: 0x${unknown2.toHex(4)}`,
        color,
      );

      // for (let i = index + 1; i < objects.length - 1; i += 1) {
      //   if (objects[i].verticesOffset) {
      //     getVertices(
      //       objects[i].verticesOffset,
      //       vertexBuffer,
      //       dataView,
      //       object,
      //       index,
      //     );
      //   }

      //   if (objects[i].meshsOffset) {
      //     const type = getInt(objects[i].meshsOffset + 0x1, "uint8", {}, dataView);

      //     if (type === 0x5) {
      //       break;
      //     }
      //   }
      // }

      offset += 0x2;
    }

    if (isSpecial2) {
      // TODO

      debug.color(
        `{${object.parentIndex}} [${index}] (0x${(offset - 0x2).toHex(8)}) Special ${iteration} > type: 0x${type.toHex(2)}`,
        color,
      );
    }

    // Texture

    if (isTexture) {
      const repeatY = !extractBit(flags, 4);
      const repeatX = !extractBit(flags, 5);
      const mirroredY = extractBit(flags, 6);
      const mirroredX = extractBit(flags, 7);

      // const textureQuality = getInt(offset, "uint8", { bigEndian: true }, dataView);
      const textureIndex = getInt(offset + 0x1, "uint8", { bigEndian: true }, dataView); // prettier-ignore

      material.texture = {
        base64: textures[textureIndex].base64,
        flipY: false,
        repeatX: mirroredX ? "mirrored" : repeatX,
        repeatY: mirroredY ? "mirrored" : repeatY,
      };

      debug.color(
        `{${object.parentIndex}} [${index}] (0x${(offset - 0x2).toHex(8)}) Texture ${iteration} > type: 0x${type.toHex(2)}, textureIndex: ${textureIndex}`,
        color,
      );

      offset += 0x2;
    }

    // Material

    if (isMaterial) {
      const unknown2 = getInt(offset, "uint16", { bigEndian: true }, dataView);

      debug.color(
        `{${object.parentIndex}} [${index}] (0x${(offset - 0x2).toHex(8)}) Material ${iteration} > type: 0x${type.toHex(2)}, unknown2: ${unknown2.toHex(4)}`,
        color,
      );

      offset += 0x2;

      if (hasDiffuse) {
        const [diffuse, alpha] = getColor(offset, dataView);

        material.color = diffuse;
        material.opacity = alpha;

        debug.color(
          `{${object.parentIndex}} [${index}] (0x${(offset - 0x2).toHex(8)}) Material ${iteration} > type: 0x${type.toHex(2)}, diffuse: 0x${diffuse.toHex(6)}, alpha: ${material.opacity}`,
          color,
        );

        offset += 0x4;
      }

      if (hasAmbient) {
        const [ambient, alpha] = getColor(offset, dataView);

        // TODO

        debug.color(
          `{${object.parentIndex}} [${index}] (0x${(offset - 0x2).toHex(8)}) Material ${iteration} > type: 0x${type.toHex(2)}, ambient: 0x${ambient.toHex(6)}, alpha: ${alpha}`,
          color,
        );

        offset += 0x4;
      }

      if (hasSpecular) {
        const [specular, alpha] = getColor(offset, dataView);

        // TODO

        debug.color(
          `{${object.parentIndex}} [${index}] (0x${(offset - 0x2).toHex(8)}) Material ${iteration} > type: 0x${type.toHex(2)}, specular: 0x${specular.toHex(6)}, alpha: ${alpha}`,
          color,
        );

        offset += 0x4;
      }
    }

    // Mesh

    if (isMesh) {
      const unknown2 = getInt(offset, "uint16", { bigEndian: true }, dataView);

      const meshCount = getInt(offset + 0x2, "uint16", { bigEndian: true }, dataView); // prettier-ignore

      if (vertexBuffer.length > 0) {
        debug.color(
          `{${object.parentIndex}} [${index}] (0x${(offset - 0x2).toHex(8)}) Mesh ${iteration} > type: 0x${type.toHex(2)}, unk2: 0x${unknown2.toHex(4)}, count: ${meshCount}`,
          color,
        );
      } else {
        debug.color(
          `{${object.parentIndex}} [${index}] (0x${(offset - 0x2).toHex(8)}) Mesh ${iteration} > type: 0x${type.toHex(2)}, unk2: 0x${unknown2.toHex(4)}, count: ${meshCount} > NO VERTICES`,
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
          const indice = getInt(offset, "int16", { bigEndian: true }, dataView);

          offset += 0x2;

          indices.push(indice);

          if (j && j < indiceCount - 0x1) {
            if (j % 0x2 === 0x0) {
              indices.push(indice, indices[indices.length - 0x2]);
            } else if (j > 1 && j % 0x2 !== 0x0) {
              indices.push(indices[indices.length - 0x3], indice);
            }
          }

          if (hasUvs) {
            const uvX =
              getInt(offset, "int16", { bigEndian: true }, dataView) / uvSize;
            const uvY =
              getInt(offset + 0x2, "int16", { bigEndian: true }, dataView) /
              uvSize;

            uvs.push(uvX, uvY);

            if (j && j < indiceCount - 0x1) {
              if (j % 0x2 === 0x0) {
                uvs.push(
                  uvX,
                  uvY,
                  uvs[uvs.length - 0x4],
                  uvs[uvs.length - 0x3],
                );
              } else if (j > 1 && j % 0x2 !== 0x0) {
                uvs.push(
                  uvs[uvs.length - 0x6],
                  uvs[uvs.length - 0x5],
                  uvX,
                  uvY,
                );
              }
            }

            offset += 0x4;
          }
        }

        // TODO
        if (type === 0x40 && [0xbfbfbf, 0xffffff].includes(material.color)) {
          material.color = 0xff0000;
          material.opacity = 0.25;
        }

        if (vertexBuffer.length > 0) {
          three.addMesh(vertexBuffer, indices, uvs, instanceId, {
            group,
            renderOrder: material.opacity === 1 ? 0 : 1,
            geometry: {
              nonIndexed: true,
              smoothAngle: Math.PI,
            },
            material: {
              color: material.color,
              model: "lambert",
              opacity: material.opacity,
              // side,
              side: "double", // TODO: Temporary
              texture: material.texture,
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

function getColor(offset: number, dataView: DataView): [number, number] {
  const blue = getInt(offset, "uint8", {}, dataView);
  const green = getInt(offset + 0x1, "uint8", {}, dataView);
  const red = getInt(offset + 0x2, "uint8", {}, dataView);
  const alpha = getInt(offset + 0x3, "uint8", {}, dataView) / 0xff;

  const color = (red << 0x10) | (green << 0x8) | blue;

  return [color, alpha];
}
