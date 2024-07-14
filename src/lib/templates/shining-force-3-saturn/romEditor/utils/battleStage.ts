import type { Mesh } from "three";

import { getInt, getIntFromArray } from "$lib/utils/bytes";
import type Canvas from "$lib/utils/canvas";
import {
  applyPalette,
  flipTileData,
  getColor,
  getPalette,
} from "$lib/utils/graphics";
import type Three from "$lib/utils/three";

import type { Palette } from "$lib/types";

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
    },
    material: materials.options,
  });

  return mesh;
}

export function addFloor(texture: string, three: Three, instanceId: string) {
  let uvs = [0, 0, 1, 0, 1, 1, 1, 1, 0, 1, 0, 0];

  const mesh = three.addMesh(
    [0, 0, 0, 512, 0, 0, 512, 0, -512, 0, 0, -512],
    [0, 1, 2, 2, 3, 0],
    uvs,
    instanceId,
    {
      locked: true,
      geometry: {
        nonIndexed: true,
      },
      material: {
        color: 0x0,
        texture: {
          base64: texture,
          repeatX: true,
          repeatY: true,
        },
      },
    },
  );

  if (mesh) {
    mesh.position.x -= 256;
    mesh.position.z += 128;
  }
}

export function generateFloorTexture(
  data: number[],
  palette: Palette,
  canvas: Canvas,
): void {
  const textureData = applyPalette(data, palette);

  const flippedTextureData = applyPalette(
    flipTileData(data, 512, "y"),
    palette,
  );

  canvas.addGraphic("texture", textureData, 512, 128, 0, 0);
  canvas.addGraphic("texture", flippedTextureData, 512, 128, 0, 128);
}

async function getTextures(
  canvas: Canvas,
  dataView: DataView,
): Promise<Texture[]> {
  const textures: Texture[] = [];

  let offset = getInt(0x20, "uint32", { bigEndian: true }, dataView);

  const textureCount = getInt(
    offset + 0xa,
    "uint16",
    { bigEndian: true },
    dataView,
  );

  if (textureCount) {
    offset += 0x18;

    const decompressedData = getDecompressedData(
      offset + textureCount * 0x8 + 0x4,
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

      const base64 = await canvas.export();

      textures.push({
        width: width,
        height: height,
        data,
        base64,
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

  battleStage.palette = getPalette("BGR555", floorOffset + 0x4, 0x200, {
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

    const rotationX = -getInt(objectsOffset + 0x2, "int16", { bigEndian: true }, dataView) / 10430; // prettier-ignore
    const rotationY = -getInt(objectsOffset + 0x4, "int16", { bigEndian: true }, dataView) / 10430; // prettier-ignore
    const rotationZ = getInt(objectsOffset + 0x6, "int16", { bigEndian: true }, dataView) / 10430; // prettier-ignore

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

  const textures = await getTextures(canvas, dataView);

  battleStage.textures.push(...textures);

  canvas.resize(512, 256);

  const textureData = [];

  for (let i = 0x0; i < 0x10000; i += 0x1) {
    textureData.push(getInt(floorOffset + 0x204 + i, "uint8", {}, dataView));
  }

  generateFloorTexture(textureData, battleStage.palette, canvas);

  battleStage.floor.texture = await canvas.export();

  return battleStage;
}
