import type { Mesh } from "three";

import { getInt } from "$lib/utils/bytes";
import type Canvas from "$lib/utils/canvas";
import { applyPalette, flipTileData, getPalette } from "$lib/utils/graphics";
import type Three from "$lib/utils/three";

import type { Palette } from "$lib/types";

import { getDecompressedData, getScenario, isDummy } from "../utils";
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

  const geometry = three.generateGeometry(vertices, indices, materials.uvs, {
    nonIndexed: true,
  });

  const material = materials.options.map((option, index) => {
    geometry.addGroup(index * 6, 6, index);

    return three.generateMaterial(option);
  });

  const mesh = three.addMesh(geometry, material, instanceId, {
    id: offset.toHex(),
  });

  return mesh;
}

export function addFloor(texture: string, three: Three, instanceId: string) {
  const vertices = [0, 0, 0, 512, 0, 0, 512, 0, -512, 0, 0, -512];
  const indices = [0, 1, 2, 2, 3, 0];
  const uvs = [0, 0, 1, 0, 1, 1, 1, 1, 0, 1, 0, 0];

  const geometry = three.generateGeometry(vertices, indices, uvs, {
    nonIndexed: true,
  });

  const material = three.generateMaterial({
    color: 0x0,
    texture: {
      base64: texture,
      repeatX: true,
      repeatY: true,
    },
  });

  const mesh = three.addMesh(geometry, material, instanceId, { locked: true });

  if (mesh) {
    mesh.position.x -= 256;
    mesh.position.z += 128;
  }
}

export function generateFloorTexture(
  data: number[],
  width: number,
  palette: Palette,
  canvas: Canvas,
): void {
  const textureData = applyPalette(data, palette);

  const flippedTextureData = applyPalette(
    flipTileData(data, width, "y"),
    palette,
  );

  canvas.addGraphic("texture", textureData, width, 128, 0, 0);
  canvas.addGraphic("texture", flippedTextureData, width, 128, 0, 128);
}

function getTextures(dataView: DataView): Texture[] {
  const textures: Texture[] = [];

  let offset = getInt(0x20, "uint32", { bigEndian: true }, dataView);

  const unknown1 = getInt(offset, "uint32", { bigEndian: true }, dataView);
  const unknown2 = getInt(
    offset + 0x4,
    "uint32",
    { bigEndian: true },
    dataView,
  );

  const shift = unknown1 === 0x14 && unknown2 !== 0x14 ? 0x0 : 0x4;

  if (isDummy(offset + 0x1e, dataView)) {
    return textures;
  }

  const textureCount = getInt(
    offset + 0x4 + shift,
    "uint32",
    { bigEndian: true },
    dataView,
  );

  if (textureCount) {
    offset += 0x14 + shift;

    const decompressedData = getDecompressedData(
      offset + textureCount * 0x8 + shift,
      dataView,
    );

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

interface BattleStage {
  palette: Palette;
  floor: {
    texture: string;
  };
  objectsBaseOffset: number;
  objects: {
    offset: number;
    position: {
      x: number;
      y: number;
      z: number;
    };
    rotation: {
      x: number;
      y: number;
      z: number;
    };
    scale: {
      x: number;
      y: number;
      z: number;
    };
  }[];
  textures: Texture[];
}

export async function unpackBattleStage(
  canvas: Canvas,
  dataView: DataView,
): Promise<BattleStage> {
  const battleStage = {} as BattleStage;

  const floorOffset = getInt(0x0, "uint32", { bigEndian: true }, dataView);

  let paletteOffset = floorOffset;

  const scenario = getScenario();

  if (scenario === "1") {
    paletteOffset += 0x4;
  }

  battleStage.palette = getPalette("BGR555", paletteOffset, 0x200, {
    bigEndian: true,
    dataView,
  });

  battleStage.floor = {
    texture: "",
  };

  battleStage.objectsBaseOffset = getInt(
    0x10,
    "uint32",
    { bigEndian: true },
    dataView,
  );

  const objectsMeshOffset =
    battleStage.objectsBaseOffset +
    getInt(
      battleStage.objectsBaseOffset + 0x4,
      "uint32",
      { bigEndian: true },
      dataView,
    );

  battleStage.objects = [];

  let objectsOffset =
    battleStage.objectsBaseOffset +
    getInt(
      battleStage.objectsBaseOffset,
      "uint32",
      { bigEndian: true },
      dataView,
    );

  while (true) {
    const objectIndex = getInt(
      objectsOffset,
      "int16",
      { bigEndian: true },
      dataView,
    );

    if (objectIndex === -1) {
      break;
    }

    const objectOffset = objectsMeshOffset + objectIndex * 0x14;

    const rotationX = -getInt(objectsOffset + 0x2, "int16", { bigEndian: true }, dataView).toEuler(); // prettier-ignore
    const rotationY = -getInt(objectsOffset + 0x4, "int16", { bigEndian: true }, dataView).toEuler(); // prettier-ignore
    const rotationZ = getInt(objectsOffset + 0x6, "int16", { bigEndian: true }, dataView).toEuler(); // prettier-ignore

    let positionX = -getInt(objectsOffset + 0x8, "int16", { bigEndian: true }, dataView); // prettier-ignore
    let positionY = -getInt(objectsOffset + 0xc, "int16", { bigEndian: true }, dataView); // prettier-ignore
    let positionZ = getInt(objectsOffset + 0x10, "int16", { bigEndian: true }, dataView); // prettier-ignore

    positionX += -getInt(objectsOffset + 0xa, "uint16", { bigEndian: true }, dataView) / 0x10000; // prettier-ignore
    positionY += -getInt(objectsOffset + 0xe, "uint16", { bigEndian: true }, dataView) / 0x10000; // prettier-ignore
    positionZ += getInt(objectsOffset + 0x12, "uint16", { bigEndian: true }, dataView) / 0x10000; // prettier-ignore

    let scaleX = getInt(objectsOffset + 0x14, "int16", { bigEndian: true }, dataView); // prettier-ignore
    let scaleY = getInt(objectsOffset + 0x18, "int16", { bigEndian: true }, dataView); // prettier-ignore
    let scaleZ = getInt(objectsOffset + 0x1c, "int16", { bigEndian: true }, dataView); // prettier-ignore

    scaleX += getInt(objectsOffset + 0x16, "uint16", { bigEndian: true }, dataView) / 0x10000; // prettier-ignore
    scaleY += getInt(objectsOffset + 0x1a, "uint16", { bigEndian: true }, dataView) / 0x10000; // prettier-ignore
    scaleZ += getInt(objectsOffset + 0x1e, "uint16", { bigEndian: true }, dataView) / 0x10000; // prettier-ignore

    battleStage.objects.push({
      offset: objectOffset,
      position: {
        x: positionX,
        y: positionY,
        z: positionZ,
      },
      rotation: {
        x: rotationX,
        y: rotationY,
        z: rotationZ,
      },
      scale: {
        x: scaleX,
        y: scaleY,
        z: scaleZ,
      },
    });

    objectsOffset += 0x20;
  }

  battleStage.textures = [];

  const textures = getTextures(dataView);

  battleStage.textures.push(...textures);

  const textureWidth = scenario === "1" ? 512 : 256;

  canvas.resize(textureWidth, 256);

  const textureData = [];

  const paletteLength = paletteOffset - 0x600;

  const textureDataLength =
    getInt(0x4, "uint32", { bigEndian: true }, dataView) - paletteLength;

  for (let i = 0x0; i < textureDataLength; i += 0x1) {
    textureData.push(
      getInt(floorOffset + paletteLength + i, "uint8", {}, dataView),
    );
  }

  generateFloorTexture(textureData, textureWidth, battleStage.palette, canvas);

  battleStage.floor.texture = await canvas.export();

  return battleStage;
}
