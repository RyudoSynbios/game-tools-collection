import {
  BufferAttribute,
  BufferGeometry,
  Color,
  DoubleSide,
  Euler,
  Group,
  Matrix4,
  MeshLambertMaterial,
  Vector3,
} from "three";
import { mergeGeometries } from "three/examples/jsm/utils/BufferGeometryUtils.js";

import { extractBit, getInt } from "$lib/utils/bytes";
import Canvas from "$lib/utils/canvas";
import { getGvrTexture, GvrTexture } from "$lib/utils/common/gamecube";
import debug from "$lib/utils/debug";
import Three, { TextureOptions } from "$lib/utils/three";

import type { ColorType } from "$lib/types";

import { Entity, Model, NjtlFile } from "../utils";
import { NjcmObject } from "./njcm";

// TODO
export interface Texture extends GvrTexture {
  base64: string;
  colorType: ColorType;
  name: string;
}

export async function getTextures(
  njtl: NjtlFile,
  model: Model,
  canvas: Canvas,
  texturesCache: { [key: string]: Texture },
): Promise<Texture[]> {
  const textures: Texture[] = [];

  if (njtl) {
    await njtl.textures.reduce(async (previousTexture, name) => {
      await previousTexture;

      if (!texturesCache[name]) {
        const gvrTexture = getGvrTexture(canvas, model.textures[name]);

        canvas.resize(gvrTexture.width, gvrTexture.height);

        canvas.addGraphic(
          "texture",
          gvrTexture.data,
          gvrTexture.width,
          gvrTexture.height,
        );

        const base64 = await canvas.export();

        texturesCache[name] = { ...gvrTexture, base64, name };
      }

      textures.push(texturesCache[name]);
    }, Promise.resolve());
  }

  return textures;
}

function applyTransform(
  bufferAttribute: BufferAttribute,
  object: NjcmObject,
): void {
  const translationMatrix = new Matrix4().makeTranslation(
    object.transform.positionX,
    object.transform.positionY,
    object.transform.positionZ,
  );
  const rotationMatrix = new Matrix4().makeRotationFromEuler(
    new Euler(
      object.transform.rotationX,
      object.transform.rotationY,
      object.transform.rotationZ,
      "ZYX",
    ),
  );
  const scaleMatrix = new Matrix4().makeScale(
    object.transform.scaleX,
    object.transform.scaleY,
    object.transform.scaleZ,
  );

  const matrix = new Matrix4();
  matrix.multiplyMatrices(translationMatrix, rotationMatrix);
  matrix.multiply(scaleMatrix);

  for (let i = 0; i < bufferAttribute.count; i++) {
    const vertex = new Vector3().fromBufferAttribute(bufferAttribute, i);
    vertex.applyMatrix4(matrix);

    bufferAttribute.setXYZ(i, vertex.x, vertex.y, vertex.z);
  }
}

export function getVertices(
  entityIndex: number,
  entity: Entity,
  object: NjcmObject,
  vertexBuffer: number[],
  dataView: DataView,
  // TODO: Remove
  objects: NjcmObject[],
): { error: boolean } {
  const index = object.index;
  const vertices = [];

  let offset = object.verticesOffset;

  let error = false;
  let iteration = 0;

  while (true) {
    const size = getInt(offset, "uint16", { bigEndian: true }, dataView) * 0x4;
    const unknown2 = getInt(offset + 0x2, "uint8", {}, dataView);
    const type = getInt(offset + 0x3, "uint8", {}, dataView);

    let color = "blue";

    let hasNormals = false;
    let hasVertexColors = false;
    let hasSkinWeight = false;

    let end = false;

    switch (type) {
      case 0x22:
        break;
      case 0x23:
        hasVertexColors = true;
        break;
      case 0x29:
        hasNormals = true;
        break;
      case 0x2a:
        hasNormals = true;
        hasVertexColors = true;
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
      debug
        .option("soalMld")
        .color(
          `{${entity.index}} [${index}] (0x${offset.toHex(8)}) Vertices ${iteration} > object: ${object.flags.debug}, type: 0x${type.toHex(2)}, size: 0x${size.toHex(4)}, unk2: 0x${unknown2.toHex(2)}${color === "red" ? " > TYPE NOT HANDLED" : ""}`,
          color,
        );

      break;
    }

    const count = getInt(offset + 0x4, "uint16", { bigEndian: true }, dataView);
    const basePosition = getInt(offset + 0x6, "uint16", { bigEndian: true }, dataView); // prettier-ignore

    // TODO: unknown3 shift in vertice table, so related indexes takes account of this shift > Find a way to link indices to vertice table

    debug
      .option("soalMld")
      .color(
        `{${entity.index}} [${index}] (0x${offset.toHex(8)}) Vertices ${iteration} > object: ${object.flags.debug}, type: 0x${type.toHex(2)}, size: 0x${size.toHex(4)}, unk2: 0x${unknown2.toHex(2)}, count: ${count}, position: ${basePosition}`,
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

      if (hasVertexColors) {
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

      position *= 3;

      // TODO
      if ((type & 0x7ff) >> 0x8 !== 0x0) {
        // vX += vertexBuffer[position];
        // vY += vertexBuffer[position + 1];
        // vZ += vertexBuffer[position + 2];
      }

      vertices[position] = vX;
      vertices[position + 1] = vY;
      vertices[position + 2] = vZ;

      offset += length;
    }

    const bufferAttribute = new BufferAttribute(new Float32Array(vertices), 3);

    let parent = object;

    while (parent) {
      if (entityIndex !== -1 && parent.index === 0) {
        break;
      }

      applyTransform(bufferAttribute, parent);

      if (parent.index === 0) {
        break;
      }

      parent = objects[parent.parentIndex];
    }

    for (let i = 0; i < bufferAttribute.count; i++) {
      const vertex = new Vector3().fromBufferAttribute(bufferAttribute, i);

      if (!isNaN(vertex.x)) {
        vertexBuffer[i * 3] = vertex.x;
        vertexBuffer[i * 3 + 1] = vertex.y;
        vertexBuffer[i * 3 + 2] = vertex.z;
      }
    }

    iteration += 1;
  }

  return { error };
}

export interface VerticesCache {
  instance: number;
  status: "applying" | "caching" | "complete";
  index: number;
  rewind: boolean;
}

export function addMeshs(
  entity: Entity,
  object: NjcmObject,
  partIndex: number,
  vertexBuffer: number[],
  dataView: DataView,
  three: Three,
  instanceId: string,
  group: Group,
  textures: Texture[],
  verticesCache: VerticesCache,
): { error: boolean } {
  const index = object.index;

  let offset = object.meshsOffset;

  let error = false;
  let iteration = 0;

  let geometries: BufferGeometry[] = [];
  let material = new MeshLambertMaterial();
  let textureOptions: TextureOptions | null = null;

  while (true) {
    if (instanceId !== three.getInstanceId()) {
      return { error };
    }

    const flags = getInt(offset, "uint8", {}, dataView);
    const type = getInt(offset + 0x1, "uint8", {}, dataView);

    let color = "purple";

    let isCache = false;
    let isRewind = false;
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
      case 0x4:
        color = "orange";
        isCache = true;
        break;
      case 0x5:
        color = "orange";
        isRewind = true;
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
      case 0x14:
        color = "mediumorchid";
        isMaterial = true;
        hasSpecular = true;
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

    if ((!isMesh || end) && geometries.length > 0) {
      const geometriesWithUvs = geometries.filter(
        (geometry) => geometry.attributes.uv,
      );
      const geometriesWithoutUvs = geometries.filter(
        (geometry) => !geometry.attributes.uv,
      );

      [geometriesWithUvs, geometriesWithoutUvs].forEach((geometries) => {
        if (geometries.length > 0) {
          const geometry = mergeGeometries(geometries);

          three.addMesh(geometry, material, instanceId, {
            group,
            onClick: () => {
              debug.log(
                {
                  index: entity.index,
                  name: entity.name,
                  entityId: entity.entityId,
                },
                {
                  objectId: object.index,
                  object,
                  partIndex,
                },
              );
            },
          });
        }
      });

      geometries = [];
    }

    if (end) {
      debug
        .option("soalMld")
        .color(
          `{${entity.index}} [${index}] (0x${offset.toHex(8)}) Mesh ${iteration} > object: ${object.flags.debug}, flags: ${flags.toHex()}, type: 0x${type.toHex(2)}${color === "red" ? " > TYPE NOT HANDLED" : ""}`,
          color,
        );

      break;
    }

    offset += 0x2;

    // Special

    if (isCache) {
      const unknown2 = getInt(offset, "uint16", { bigEndian: true }, dataView);

      debug
        .option("soalMld")
        .color(
          `{${entity.index}} [${index}] (0x${(offset - 0x2).toHex(8)}) Cache ${iteration} > object: ${object.flags.debug}, type: 0x${type.toHex(2)}, unk2: 0x${unknown2.toHex(4)} > ${flags}`,
          color,
        );

      if (
        verticesCache.instance === -1 ||
        (flags !== verticesCache.instance && verticesCache.status !== "caching")
      ) {
        verticesCache.instance = flags;
        verticesCache.status = "caching";
        verticesCache.index = object.index - 1;

        return { error };
      }

      offset += 0x2;
    }

    if (isRewind) {
      debug
        .option("soalMld")
        .color(
          `{${entity.index}} [${index}] (0x${(offset - 0x2).toHex(8)}) Rewind ${iteration} > object: ${object.flags.debug}, type: 0x${type.toHex(2)} > ${flags}`,
          color,
        );

      if (verticesCache.instance === flags) {
        if (verticesCache.status === "caching") {
          verticesCache.status = "applying";
          verticesCache.rewind = true;
          return { error };
        } else if (verticesCache.status === "applying") {
          verticesCache.instance = -1;
          verticesCache.status = "complete";
          verticesCache.index = -1;
        }
      }
    }

    // Texture

    if (isTexture) {
      const repeatY = !extractBit(flags, 4);
      const repeatX = !extractBit(flags, 5);
      const mirroredY = extractBit(flags, 6);
      const mirroredX = extractBit(flags, 7);

      // const textureQuality = getInt(offset, "uint8", { bigEndian: true }, dataView);
      const textureIndex = getInt(offset + 0x1, "uint8", { bigEndian: true }, dataView); // prettier-ignore

      const texture = textures[textureIndex];

      textureOptions = {
        name: texture.name,
        base64: texture.base64,
        repeatX: mirroredX ? "mirrored" : repeatX,
        repeatY: mirroredY ? "mirrored" : repeatY,
      };

      material = material.clone();
      material.color = new Color(0xffffff);
      material.map = three.generateMaterialMap(textureOptions);

      if (["ARGB8888", "RGB5A3"].includes(texture.colorType)) {
        material.transparent = true;
      }

      debug
        .option("soalMld")
        .color(
          `{${entity.index}} [${index}] (0x${(offset - 0x2).toHex(8)}) Texture ${iteration} > object: ${object.flags.debug}, flags: ${flags.toHex()}, type: 0x${type.toHex(2)}, textureIndex: ${textureIndex}`,
          color,
        );

      offset += 0x2;
    }

    // Material

    if (isMaterial) {
      const unknown2 = getInt(offset, "uint16", { bigEndian: true }, dataView);

      material = new MeshLambertMaterial({ alphaTest: 0.01, side: DoubleSide });

      if (textureOptions) {
        material.map = three.generateMaterialMap(textureOptions);
      }

      debug
        .option("soalMld")
        .color(
          `{${entity.index}} [${index}] (0x${(offset - 0x2).toHex(8)}) Material ${iteration} > object: ${object.flags.debug}, flags: ${flags.toHex()}, type: 0x${type.toHex(2)}, unknown2: ${unknown2.toHex(4)}`,
          color,
        );

      offset += 0x2;

      if (hasDiffuse) {
        const [diffuse, alpha] = getColor(offset, dataView);

        material.color = !material.map
          ? new Color(diffuse)
          : new Color(0xffffff);
        material.opacity = alpha;

        if (alpha < 1) {
          material.transparent = true;
        }

        debug
          .option("soalMld")
          .color(
            `{${entity.index}} [${index}] (0x${(offset - 0x2).toHex(8)}) Material ${iteration} > object: ${object.flags.debug}, flags: ${flags.toHex()}, type: 0x${type.toHex(2)}, diffuse: 0x${diffuse.toHex(6)}, alpha: ${alpha}`,
            color,
          );

        offset += 0x4;
      }

      if (hasAmbient) {
        const [ambient, alpha] = getColor(offset, dataView);

        // TODO

        debug
          .option("soalMld")
          .color(
            `{${entity.index}} [${index}] (0x${(offset - 0x2).toHex(8)}) Material ${iteration} > object: ${object.flags.debug}, flags: ${flags.toHex()}, type: 0x${type.toHex(2)}, ambient: 0x${ambient.toHex(6)}, alpha: ${alpha}`,
            color,
          );

        offset += 0x4;
      }

      if (hasSpecular) {
        const [specular, alpha] = getColor(offset, dataView);

        // material.specular = new Color(specular);

        debug
          .option("soalMld")
          .color(
            `{${entity.index}} [${index}] (0x${(offset - 0x2).toHex(8)}) Material ${iteration} > object: ${object.flags.debug}, flags: ${flags.toHex()}, type: 0x${type.toHex(2)}, specular: 0x${specular.toHex(6)}, alpha: ${alpha}`,
            color,
          );

        offset += 0x4;
      }
    }

    // Mesh

    if (isMesh) {
      // const applyVertexColors = extractBit(flags, 3);

      const unknown2 = getInt(offset, "uint16", { bigEndian: true }, dataView);

      const meshCount = getInt(offset + 0x2, "uint16", { bigEndian: true }, dataView); // prettier-ignore

      if (vertexBuffer.length > 0) {
        debug
          .option("soalMld")
          .color(
            `{${entity.index}} [${index}] (0x${(offset - 0x2).toHex(8)}) Mesh ${iteration} > object: ${object.flags.debug}, flags: ${flags.toHex()}, type: 0x${type.toHex(2)}, unk2: 0x${unknown2.toHex(4)}, count: ${meshCount}`,
            color,
          );
      } else {
        debug
          .option("soalMld")
          .color(
            `{${entity.index}} [${index}] (0x${(offset - 0x2).toHex(8)}) Mesh ${iteration} > object: ${object.flags.debug}, flags: ${flags.toHex()}, type: 0x${type.toHex(2)}, unk2: 0x${unknown2.toHex(4)}, count: ${meshCount} > NO VERTICES`,
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

        // TODO: Find a true way to detect dummy / collision box

        const isDummy =
          entity.name.match(/esahaiti|goscript|hasigo/) ||
          (type === 0x40 &&
            !textureOptions &&
            [0xbfbfbf, 0xffffff].includes(material.color.getHex()));

        if (isDummy) {
          material.color = new Color(0xff0000);
          material.opacity = 0.25;
          material.transparent = true;
          material.depthWrite = false;
        }

        if (vertexBuffer.length > 0 && verticesCache.status !== "caching") {
          const geometry = three.generateGeometry(vertexBuffer, indices, uvs, {
            nonIndexed: true,
            smoothAngle: Math.PI,
          });

          geometries.push(geometry);
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
