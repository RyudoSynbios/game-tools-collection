import type { Mesh } from "three";

import { getInt } from "$lib/utils/bytes";
import Canvas from "$lib/utils/canvas";
import type Three from "$lib/utils/three";

import { getDecompressedData, getFilteredFiles } from "../utils";
import { getIndices, getMaterials, getVertices, type Texture } from "./model";

export async function addObject(
  baseOffset: number,
  offset: number,
  textures: Texture[],
  three: Three,
  instanceId: string,
  canvas: Canvas,
  dataView: DataView,
): Promise<Mesh | null> {
  const verticesOffset = baseOffset + getInt(offset, "uint32", { bigEndian: true }, dataView); // prettier-ignore
  const verticesCount = getInt(offset + 0x4, "uint32", { bigEndian: true }, dataView) * 2; // prettier-ignore
  const vertices = getVertices(verticesOffset, verticesCount, dataView);

  const indicesOffset = baseOffset + getInt(offset + 0x8, "uint32", { bigEndian: true }, dataView); // prettier-ignore
  const indicesCount = getInt(offset + 0xc, "uint32", { bigEndian: true }, dataView); // prettier-ignore
  const indices = getIndices(indicesOffset, indicesCount, dataView);

  const materialsOffset = baseOffset + getInt(offset + 0x10, "uint32", { bigEndian: true }, dataView); // prettier-ignore
  const materials = await getMaterials(
    materialsOffset,
    indicesCount,
    textures,
    canvas,
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

export function getModels(assetIndex: number): number[] {
  const files = getFilteredFiles("battleCharacter");
  const file = files[assetIndex];

  let count = 0x1;

  switch (file.name) {
    case "X8PC00X.BIN":
    case "X8PC07X.BIN":
    case "X8PC20X.BIN":
      count = 0xc;
      break;
    case "X8PC01X.BIN":
    case "X8PC02X.BIN":
    case "X8PC03X.BIN":
    case "X8PC04X.BIN":
    case "X8PC05X.BIN":
    case "X8PC06X.BIN":
    case "X8PC08X.BIN":
    case "X8PC09X.BIN":
    case "X8PC10X.BIN":
    case "X8PC21X.BIN":
    case "X8PC22X.BIN":
    case "X8PC23X.BIN":
    case "X8PC24X.BIN":
    case "X8PC25X.BIN":
    case "X8PC26X.BIN":
    case "X8PC27X.BIN":
    case "X8PC29X.BIN":
    case "X8PC30X.BIN":
      count = 0x9;
      break;
    case "X8PC28X.BIN":
      count = 0x7;
      break;
    case "X8PC11X.BIN":
    case "X8PC12X.BIN":
    case "X8PC13X.BIN":
    case "X8PC16X.BIN":
    case "X8PC19X.BIN":
    case "X8PC31X.BIN":
    case "X8PC32X.BIN":
    case "X8PC33X.BIN":
    case "X8PC35X.BIN":
    case "X8PC36X.BIN":
    case "X8PC37X.BIN":
    case "X8PC40X.BIN":
    case "X8PC42X.BIN":
    case "X8PC43X.BIN":
    case "X8PC44X.BIN":
    case "X8PC45X.BIN":
    case "X8PC48X.BIN":
    case "X8PC49X.BIN":
    case "X8PC50X.BIN":
    case "X8PC51X.BIN":
    case "X8PC53X.BIN":
    case "X8PC56X.BIN":
      count = 0x6;
      break;
    case "X8PC15X.BIN":
    case "X8PC17X.BIN":
    case "X8PC18X.BIN":
    case "X8PC34X.BIN":
    case "X8PC54X.BIN":
    case "X8PC55X.BIN":
    case "X8PC57X.BIN":
      count = 0x4;
      break;
    case "X8PC14X.BIN":
    case "X8PC38X.BIN":
    case "X8PC41X.BIN":
      count = 0x3;
      break;
    case "X8PC39X.BIN":
    case "X8PC46X.BIN":
    case "X8PC47X.BIN":
    case "X8PC52X.BIN":
    case "X8PC58X.BIN":
      count = 0x2;
      break;
  }

  const blockSize = file.size / count;

  const offsets = [];

  for (let i = 0x0; i < count; i += 0x1) {
    offsets.push(i * blockSize);
  }

  return offsets;
}

function getTextures(dataView: DataView): Texture[] {
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

      const rawData = decompressedData.slice(
        textureOffset,
        textureOffset + width * height * 0x2,
      );

      textures.push({
        width: width,
        height: height,
        rawData,
        data: new Uint8Array(),
        base64: "",
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

export function unpackBattleCharacter(dataView: DataView): BattleCharacter {
  const battleCharacter = {} as BattleCharacter;

  battleCharacter.objectsBaseOffset = getInt(
    0x20,
    "uint32",
    { bigEndian: true },
    dataView,
  );

  const characterOffset = getInt(
    battleCharacter.objectsBaseOffset + 0x8,
    "int32",
    { bigEndian: true },
    dataView,
  );

  const weaponOffset = getInt(
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

  const textures = getTextures(dataView);

  battleCharacter.textures.push(...textures);

  return battleCharacter;
}
