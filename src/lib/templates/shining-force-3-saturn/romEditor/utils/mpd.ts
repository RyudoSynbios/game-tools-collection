import type { Group, Mesh } from "three";

import { getInt, getIntFromArray } from "$lib/utils/bytes";
import type Canvas from "$lib/utils/canvas";
import debug from "$lib/utils/debug";
import {
  applyPalette,
  flipUvs,
  getColor,
  getPalette,
} from "$lib/utils/graphics";
import type Three from "$lib/utils/three";

import type { Palette } from "$lib/types";

import { getDecompressedData, getFileOffset, getScenario } from "../utils";
import { type Texture, getIndices, getMaterials, getVertices } from "./model";

export function addBattlefieldFloor(
  offset: number,
  heightMap: number[],
  textures: Texture[],
  three: Three,
  instanceId: string,
  dataView: DataView,
): Group {
  const group = three.addGroup(true);

  for (let blockRow = 0; blockRow < 16; blockRow += 1) {
    for (let blockColumn = 0; blockColumn < 16; blockColumn += 1) {
      const yHeightMap: number[] = [];
      const yVertices: number[] = [];

      for (let i = 0; i < 4; i += 1) {
        for (let j = 0; j < 4; j += 1) {
          const ref = [0, 1, 6, 5];

          ref.forEach((r, index) => {
            const yHeightMapOffset =
              blockRow * 0x400 + blockColumn * 0x10 + i * 0x100 + j * 4 + index;

            yHeightMap.push(heightMap[yHeightMapOffset] * 2);

            const uVerticesOffset =
              offset +
              0xb600 +
              blockRow * 0x190 +
              blockColumn * 0x19 +
              (r + i * 5 + j);

            yVertices.push(getInt(uVerticesOffset, "uint8", {}, dataView) * 2);
          });
        }
      }

      for (let row = 0; row < 4; row += 1) {
        for (let column = 0; column < 4; column += 1) {
          const tileOffset =
            offset +
            blockRow * 0x200 +
            blockColumn * 0x20 +
            row * 0x8 +
            column * 0x2;

          const tile = getInt(
            tileOffset,
            "uint16",
            { bigEndian: true },
            dataView,
          );

          const textureIndex = tile & 0xff;
          const flipX = (tile & 0x1000) !== 0x0;
          const flipY = (tile & 0x2000) !== 0x0;
          const useMapHeight = (tile & 0x8000) !== 0x0;

          if (textureIndex !== 0xff) {
            let heights = yVertices;

            if (useMapHeight) {
              heights = yHeightMap;
            }

            const base64 = textures[textureIndex]?.base64;

            if (base64) {
              let uvs = [0, 0, 1, 0, 1, 1, 1, 1, 0, 1, 0, 0];

              if (flipX) {
                uvs = flipUvs(uvs, "x");
              }

              if (flipY) {
                uvs = flipUvs(uvs, "y");
              }

              const mesh = three.addMesh(
                [
                  0,
                  heights[row * 16 + column * 4 + 0],
                  0,
                  32,
                  heights[row * 16 + column * 4 + 1],
                  0,
                  32,
                  heights[row * 16 + column * 4 + 2],
                  -32,
                  0,
                  heights[row * 16 + column * 4 + 3],
                  -32,
                ],
                [0, 1, 2, 2, 3, 0],
                uvs,
                instanceId,
                {
                  group,
                  geometry: {
                    nonIndexed: true,
                  },
                  material: {
                    color: 0x0,
                    texture: {
                      base64,
                    },
                  },
                },
              );

              if (mesh) {
                mesh.position.x = blockColumn * 128 + column * 32;
                mesh.position.z = -(blockRow * 128 + row * 32);
              }
            }
          }
        }
      }
    }
  }

  return group;
}

export function addFloor(
  texture: string,
  position: { x: number; y: number; z: number },
  repeat: boolean,
  three: Three,
  instanceId: string,
) {
  let uvs = [0, 0, 1, 0, 1, 1, 1, 1, 0, 1, 0, 0];

  let max = 2048;

  if (repeat) {
    max = 32768;
    uvs = uvs.map((uv) => uv * 16);
  }

  const mesh = three.addMesh(
    [0, 0, 0, max, 0, 0, max, 0, -max, 0, 0, -max],
    [0, 1, 2, 2, 3, 0],
    uvs,
    instanceId,
    {
      locked: true,
      renderLast: true,
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
    mesh.position.x = position.x;
    mesh.position.y = position.y;
    mesh.position.z = position.z;

    if (repeat) {
      mesh.position.x -= 16384;
      mesh.position.z += 16384;
    }
  }
}

export function addObject(
  baseOffset: number,
  offset: number,
  textures: Texture[],
  three: Three,
  instanceId: string,
  dataView: DataView,
): Mesh | null {
  const verticesOffset = getFileOffset("mpd", offset, dataView, baseOffset);
  const verticesCount = getInt(offset + 0x4, "uint32", { bigEndian: true }, dataView); // prettier-ignore
  const vertices = getVertices(verticesOffset, verticesCount, dataView);

  const indicesOffset = getFileOffset("mpd", offset + 0x8, dataView, baseOffset); // prettier-ignore
  const indicesCount = getInt(offset + 0xc, "uint32", { bigEndian: true }, dataView); // prettier-ignore
  const indices = getIndices(indicesOffset, indicesCount, dataView);

  const texturesOffset = getFileOffset("mpd", offset + 0x10, dataView, baseOffset); // prettier-ignore
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

export function generateFloorTexture(
  data: number[],
  palette: Palette,
  canvas: Canvas,
): void {
  const textureData = applyPalette(data, palette);

  for (let row = 0; row < 8; row += 1) {
    for (let column = 0; column < 4; column += 1) {
      canvas.addGraphic(
        "texture",
        textureData,
        512,
        256,
        column * 512,
        row * 256,
      );
    }
  }
}

export function generateTilemap(
  offset: number,
  iteration: number,
  tiles: Uint8Array[],
  canvas: Canvas,
  dataView: DataView,
): void {
  const decompressedData = getDecompressedData(offset, dataView);

  for (let blockRow = 0; blockRow < 2; blockRow += 1) {
    for (let blockColumn = 0; blockColumn < 4; blockColumn += 1) {
      for (let row = 0; row < 64; row += 1) {
        for (let column = 0; column < 64; column += 1) {
          const tileOffset =
            blockRow * 0x8000 +
            blockColumn * 0x2000 +
            row * 0x80 +
            column * 0x2;

          const tileIndex =
            (decompressedData[tileOffset] << 0x8) |
            decompressedData[tileOffset + 1];

          canvas.addGraphic(
            "texture",
            tiles[tileIndex],
            8,
            8,
            blockColumn * 512 + column * 8,
            iteration * 1024 + blockRow * 512 + row * 8,
          );
        }
      }
    }
  }
}

async function getTextures(
  offset: number,
  canvas: Canvas,
  dataView: DataView,
): Promise<Texture[]> {
  const textures: Texture[] = [];

  const decompressedData = getDecompressedData(offset, dataView);

  const textureCount = getIntFromArray(decompressedData, 0x0, "uint16", true);

  if (textureCount > 200) {
    debug.warn("Texture count", offset.toHex(), textureCount);
  } else {
    for (let j = 0x0; j < textureCount; j += 0x1) {
      const width = decompressedData[0x4 + j * 0x4];
      const height = decompressedData[0x5 + j * 0x4];

      const textureOffset =
        (decompressedData[0x6 + j * 0x4] << 0x8) |
        decompressedData[0x7 + j * 0x4];

      const texture = decompressedData.slice(
        textureOffset,
        textureOffset + width * height * 0x2,
      );

      const textureData = [];

      for (let j = 0x0; j < texture.length; j += 0x1) {
        const rawColor = getIntFromArray(texture, j * 0x2, "uint16", true);

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

function getTiles(data: number[], palette: Palette): Uint8Array[] {
  const tiles: Uint8Array[] = [];

  let width = 8;
  let height = 8;

  const length = width * height;

  let tileCount = (data.length / length) * 2;

  for (let j = 0; j < tileCount; j += 1) {
    const spriteData = applyPalette(
      data.slice((j * length) / 2, (j * length) / 2 + length),
      palette,
    );

    tiles.push(spriteData);
  }

  return tiles;
}

interface Mpd {
  pointerTable: {
    objects: number;
    battlefieldFloor: number;
    heightMap: number;
    textures: number;
    tiledFloorTexture: number;
    unknown: number;
  };
  palette: Palette;
  floor: {
    position: {
      x: number;
      y: number;
      z: number;
    };
    battlefield?: {
      offset: number;
      heightMap: number[];
    };
    texture: string;
    repeat: boolean;
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

export async function unpackMpd(
  canvas: Canvas,
  dataView: DataView,
): Promise<Mpd> {
  const mpd = {} as Mpd;

  const entryOffset = getFileOffset("mpd", 0x0, dataView);

  const settingsOffset = getFileOffset("mpd", entryOffset, dataView);

  const paletteStartOffset = getFileOffset(
    "mpd",
    settingsOffset + 0x3c,
    dataView,
  );
  const paletteEndOffset = getFileOffset(
    "mpd",
    settingsOffset + 0x40,
    dataView,
  );

  const length = paletteEndOffset - paletteStartOffset;

  if (length > 0) {
    mpd.palette = getPalette("BGR555", paletteStartOffset, length, {
      bigEndian: true,
      dataView,
    });
  }

  const scenario = getScenario();

  const shift = scenario === "3" || scenario === "premium" ? 0x8 : 0x0;

  // prettier-ignore
  mpd.floor = {
    position: {
      x: getInt(settingsOffset + 0x44 + shift, "int16", { bigEndian: true }, dataView) % 2048,
      y: -getInt(settingsOffset + 0x46 + shift, "int16", { bigEndian: true }, dataView) % 2048,
      z: -getInt(settingsOffset + 0x48 + shift, "int16", { bigEndian: true }, dataView) % 2048,
    },
    texture: "",
    repeat: false,
  };

  const pointerTable = {
    objects: 0x2008,
    battlefieldFloor: 0x2010,
    heightMap: 0x2028,
    textures: 0x2030,
    floorGraphics: 0x2070,
    tiledFloorTexture: 0x2080,
    unknown: 0x20a0,
  };

  mpd.objects = [];

  let objectsOffset = 0x0;
  let objectSize = 0;

  const objectsOffsets = [pointerTable.objects];

  if (scenario !== "1") {
    objectsOffsets.push(pointerTable.unknown);
  }

  objectsOffsets.some((offset) => {
    objectsOffset = getFileOffset("mpd", offset, dataView);
    objectSize = getInt(offset + 0x4, "uint32", { bigEndian: true }, dataView);

    if (objectSize > 0) {
      return true;
    }
  });

  mpd.objectsBaseOffset = objectsOffset;

  if (objectSize > 0) {
    const objectCount = getInt(
      objectsOffset + 0x8,
      "uint16",
      { bigEndian: true },
      dataView,
    );

    for (let i = 0x0; i < objectCount; i += 0x1) {
      const objectOffset = getFileOffset(
        "mpd",
        objectsOffset + i * 0x3c + 0xc,
        dataView,
        mpd.objectsBaseOffset,
      );

      const positionX = -getInt(objectsOffset + i * 0x3c + 0x2c, "int16", { bigEndian: true }, dataView); // prettier-ignore
      const positionY = -getInt(objectsOffset + i * 0x3c + 0x2e, "int16", { bigEndian: true }, dataView); // prettier-ignore
      const positionZ = getInt(objectsOffset + i * 0x3c + 0x30, "int16", { bigEndian: true }, dataView); // prettier-ignore

      const rotationX = -getInt(objectsOffset + i * 0x3c + 0x32, "int16", { bigEndian: true }, dataView) / 10430; // prettier-ignore
      const rotationY = -getInt(objectsOffset + i * 0x3c + 0x34, "int16", { bigEndian: true }, dataView) / 10430; // prettier-ignore
      const rotationZ = getInt(objectsOffset + i * 0x3c + 0x36, "int16", { bigEndian: true }, dataView) / 10430; // prettier-ignore

      let scaleX = getInt(objectsOffset + i * 0x3c + 0x38, "int16", { bigEndian: true }, dataView); // prettier-ignore
      let scaleY = getInt(objectsOffset + i * 0x3c + 0x3c, "int16", { bigEndian: true }, dataView); // prettier-ignore
      let scaleZ = getInt(objectsOffset + i * 0x3c + 0x40, "int16", { bigEndian: true }, dataView); // prettier-ignore

      scaleX += getInt(objectsOffset + i * 0x3c + 0x3a, "uint16", { bigEndian: true }, dataView) / 0x10000; // prettier-ignore
      scaleY += getInt(objectsOffset + i * 0x3c + 0x3e, "uint16", { bigEndian: true }, dataView) / 0x10000; // prettier-ignore
      scaleZ += getInt(objectsOffset + i * 0x3c + 0x42, "uint16", { bigEndian: true }, dataView) / 0x10000; // prettier-ignore

      mpd.objects.push({
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
    }
  }

  let battlefieldFloorOffset = 0x0;
  let battlefieldFloorSize = 0;

  const battlefieldFloorOffsets = [pointerTable.battlefieldFloor];

  if (scenario !== "1") {
    battlefieldFloorOffsets.push(pointerTable.unknown);
  }

  battlefieldFloorOffsets.some((offset) => {
    battlefieldFloorOffset = getFileOffset(
      "mpd",
      offset,
      dataView,
      mpd.objectsBaseOffset,
    );
    battlefieldFloorSize = getInt(
      offset + 0x4,
      "uint32",
      { bigEndian: true },
      dataView,
    );

    if (battlefieldFloorSize > 0) {
      return true;
    }
  });

  if (battlefieldFloorSize > 0) {
    mpd.floor.battlefield = {
      offset: battlefieldFloorOffset,
      heightMap: [
        ...getDecompressedData(
          getFileOffset(
            "mpd",
            pointerTable.heightMap,
            dataView,
            mpd.objectsBaseOffset,
          ),
          dataView,
        ),
      ],
    };

    mpd.floor.repeat = true;
  }

  mpd.textures = [];

  for (let i = 0x0; i < 0x8; i += 0x1) {
    const texturesOffset = getFileOffset(
      "mpd",
      pointerTable.textures + i * 0x8,
      dataView,
      mpd.objectsBaseOffset,
    );
    const texturesSize = getInt(
      pointerTable.textures + i * 0x8 + 0x4,
      "uint32",
      { bigEndian: true },
      dataView,
    );

    if (texturesSize > 0) {
      const textures = await getTextures(texturesOffset, canvas, dataView);

      mpd.textures.push(...textures);
    }
  }

  canvas.resize(2048, 2048);

  const tilesData = [];

  for (let i = 0x0; i < 0x2; i += 0x1) {
    const tilesOffset = getFileOffset(
      "mpd",
      pointerTable.floorGraphics + i * 0x8,
      dataView,
      mpd.objectsBaseOffset,
    );
    const tilesSize = getInt(
      pointerTable.floorGraphics + i * 0x8 + 0x4,
      "uint32",
      { bigEndian: true },
      dataView,
    );

    if (tilesSize > 0) {
      const decompressedData = getDecompressedData(tilesOffset, dataView);

      tilesData.push(...decompressedData);
    }
  }

  if (tilesData.length > 0) {
    const tiledFloorTextureSize = getInt(
      pointerTable.tiledFloorTexture + 0x4,
      "uint32",
      { bigEndian: true },
      dataView,
    );

    if (tiledFloorTextureSize === 0) {
      generateFloorTexture(tilesData, mpd.palette, canvas);
    } else {
      const tiles = getTiles(tilesData, mpd.palette);

      for (let i = 0x0; i < 0x2; i += 0x1) {
        const tiledFloorTextureOffset = getFileOffset(
          "mpd",
          pointerTable.tiledFloorTexture + i * 0x18,
          dataView,
          mpd.objectsBaseOffset,
        );
        const tiledFloorTextureSize = getInt(
          pointerTable.tiledFloorTexture + i * 0x18 + 0x4,
          "uint32",
          { bigEndian: true },
          dataView,
        );

        if (tiledFloorTextureSize > 0) {
          generateTilemap(tiledFloorTextureOffset, i, tiles, canvas, dataView);
        }
      }
    }

    mpd.floor.texture = await canvas.export();
  }

  return mpd;
}
