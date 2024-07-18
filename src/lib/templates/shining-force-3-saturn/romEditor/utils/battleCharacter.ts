import type { Mesh } from "three";

import { getInt, getIntFromArray } from "$lib/utils/bytes";
import type Canvas from "$lib/utils/canvas";
import { getColor } from "$lib/utils/graphics";
import type Three from "$lib/utils/three";

import { getDecompressedData } from "../utils";
import { type Texture, getIndices, getMaterials, getVertices } from "./model";

export function addObject(
  baseOffset: number,
  offset: number,
  textures: Texture[],
  three: Three,
  instanceId: string,
  dataView: DataView,
): Mesh | null {
  const verticesOffset = baseOffset + getInt(offset, "uint32", { bigEndian: true }, dataView); // prettier-ignore
  const verticesCount = getInt(offset + 0x4, "uint32", { bigEndian: true }, dataView) * 2; // prettier-ignore
  const vertices = getVertices(verticesOffset, verticesCount, dataView);

  const indicesOffset = baseOffset + getInt(offset + 0x8, "uint32", { bigEndian: true }, dataView); // prettier-ignore
  const indicesCount = getInt(offset + 0xc, "uint32", { bigEndian: true }, dataView); // prettier-ignore
  const indices = getIndices(indicesOffset, indicesCount, dataView);

  const texturesOffset = baseOffset + getInt(offset + 0x10, "uint32", { bigEndian: true }, dataView); // prettier-ignore
  const materials = getMaterials(
    texturesOffset,
    indicesCount,
    textures,
    dataView,
  );

  const mesh = three.addMesh(vertices, indices, materials.uvs, instanceId, {
    id: offset.toHex(),
    geometry: {
      nonIndexed: true,
      smoothAngle: Math.PI,
    },
    material: materials.options.map((option) => ({
      ...option,
      model: "lambert",
    })),
  });

  return mesh;
}

function getTextures(canvas: Canvas, dataView: DataView): Texture[] {
  const textures: Texture[] = [];

  let offset = getInt(0x0, "uint32", { bigEndian: true }, dataView);

  const textureCount = getInt(
    offset + 0x6,
    "uint16",
    { bigEndian: true },
    dataView,
  );

  if (textureCount) {
    offset += 0x14;

    const texturesOffset = getInt(
      0x10,
      "uint32",
      { bigEndian: true },
      dataView,
    );

    const decompressedData = getDecompressedData(texturesOffset, dataView);

    for (let i = 0x0; i < textureCount; i += 0x1) {
      const width = getInt(
        offset + i * 0x8,
        "uint16",
        { bigEndian: true },
        dataView,
      );
      const height = getInt(
        offset + i * 0x8 + 0x2,
        "uint16",
        { bigEndian: true },
        dataView,
      );

      const textureOffset =
        getInt(
          offset + i * 0x8 + 0x4,
          "uint16",
          { bigEndian: true },
          dataView,
        ) * 0x8;

      const texture = decompressedData.slice(
        textureOffset,
        textureOffset + width * height * 0x2,
      );

      const textureData = [];

      for (let i = 0x0; i < texture.length; i += 0x1) {
        const rawColor = getIntFromArray(texture, i * 0x2, "uint16", true);

        const color = getColor(rawColor, "ABGR555");

        textureData.push(...color);
      }

      const data = new Uint8Array(textureData);

      canvas.resize(width, height);

      canvas.addGraphic("texture", data, width, height);

      textures.push({
        width: width,
        height: height,
        data,
        canvas: canvas.extract(),
      });
    }
  }

  return textures;
}

interface BattleCharacter {
  objectsBaseOffset: number;
  objects: number[];
  textures: Texture[];
}

export function unpackBattleCharacter(
  canvas: Canvas,
  dataView: DataView,
): BattleCharacter {
  const battleCharacter = {} as BattleCharacter;

  battleCharacter.objectsBaseOffset = getInt(
    0x20,
    "uint32",
    { bigEndian: true },
    dataView,
  );

  let characterOffset = getInt(
    battleCharacter.objectsBaseOffset + 0x8,
    "int32",
    { bigEndian: true },
    dataView,
  );

  let weaponOffset = getInt(
    battleCharacter.objectsBaseOffset + 0xc,
    "int32",
    { bigEndian: true },
    dataView,
  );

  battleCharacter.objects = [];

  [characterOffset, weaponOffset].forEach((offset) => {
    if (offset !== -1) {
      while (true) {
        const objectOffset = getInt(
          battleCharacter.objectsBaseOffset + offset,
          "int32",
          { bigEndian: true },
          dataView,
        );

        if (objectOffset === -1) {
          break;
        }

        battleCharacter.objects.push(
          battleCharacter.objectsBaseOffset + offset,
        );

        offset += 0x18;
      }
    }
  });

  battleCharacter.textures = [];

  const textures = getTextures(canvas, dataView);

  battleCharacter.textures.push(...textures);

  return battleCharacter;
}
