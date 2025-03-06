import type { Group, Mesh } from "three";

import { getInt, getIntFromArray } from "$lib/utils/bytes";
import type Canvas from "$lib/utils/canvas";
import debug from "$lib/utils/debug";
import {
  applyPalette,
  flipUvs,
  getPalette,
  rotateUvs,
} from "$lib/utils/graphics";
import type Three from "$lib/utils/three";
import type { MaterialOptions } from "$lib/utils/three";

import type { Palette } from "$lib/types";

import { getDecompressedData, getFileOffset, getScenario } from "../utils";
import {
  generateTexture,
  getIndices,
  getMaterials,
  getVertices,
  type Texture,
} from "./model";

export async function addBattlefieldFloor(
  offset: number,
  heightMap: number[],
  textures: Texture[],
  three: Three,
  instanceId: string,
  canvas: Canvas,
  dataView: DataView,
): Promise<Group> {
  const group = three.addGroup(true);

  const scenario = getScenario();

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
          const rotate90 = (tile & 0x100) !== 0x0;
          const rotate180 = (tile & 0x200) !== 0x0;
          let flipX = (tile & 0x1000) !== 0x0;
          let flipY = (tile & 0x2000) !== 0x0;
          const useMapHeight = (tile & 0x8000) !== 0x0;

          if (textureIndex !== 0xff) {
            let heights = yVertices;

            if (useMapHeight) {
              heights = yHeightMap;
            }

            let base64 = "";

            const texture = textures[textureIndex];

            if (texture) {
              if (texture.base64) {
                base64 = texture.base64;
              } else {
                base64 = await generateTexture(texture, canvas);
              }

              const vertices = [
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
              ];
              const indices = [0, 1, 2, 2, 3, 0];
              let uvs = [0, 0, 1, 0, 1, 1, 1, 1, 0, 1, 0, 0];

              if (scenario === "3" || scenario === "premium") {
                if (rotate90) {
                  uvs = rotateUvs(uvs, 90);

                  // We shouldn't have to do this, issue linked to uvs manipulation instead of texture manipulation
                  const tmp = flipX;
                  flipX = flipY;
                  flipY = tmp;
                }

                if (rotate180) {
                  uvs = rotateUvs(uvs, 180);
                }
              }

              if (flipX) {
                uvs = flipUvs(uvs, "x");
              }

              if (flipY) {
                uvs = flipUvs(uvs, "y");
              }

              const geometry = three.generateGeometry(vertices, indices, uvs, {
                nonIndexed: true,
              });

              const material = three.generateMaterial({
                color: 0x0,
                texture: {
                  base64,
                },
              });

              const mesh = three.addMesh(geometry, material, instanceId, {
                group,
              });

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
    max *= 3;
    uvs = uvs.map((uv) => uv * 3);
  }

  const vertices = [0, 0, 0, max, 0, 0, max, 0, -max, 0, 0, -max];
  const indices = [0, 1, 2, 2, 3, 0];

  const geometry = three.generateGeometry(vertices, indices, uvs, {
    nonIndexed: true,
  });

  const material = three.generateMaterial({
    color: 0x0,
    depthTest: false,
    texture: {
      base64: texture,
      repeatX: true,
      repeatY: true,
    },
  });

  const mesh = three.addMesh(geometry, material, instanceId, {
    locked: true,
    renderOrder: -1,
  });

  if (mesh) {
    mesh.position.x = position.x;
    mesh.position.y = position.y;
    mesh.position.z = position.z;

    if (repeat) {
      mesh.position.x -= 2048;
      mesh.position.z += 2048;
    }
  }
}

interface OverrideOptions {
  palette?: Palette;
  renderOrder?: number;
  materials?: MaterialOptions;
}

export async function addObject(
  baseOffset: number,
  offset: number,
  textures: Texture[],
  overrideOptions: OverrideOptions,
  three: Three,
  instanceId: string,
  canvas: Canvas,
  dataView: DataView,
): Promise<Mesh | null> {
  const verticesOffset = getFileOffset("mpd", offset, dataView, baseOffset);
  const verticesCount = getInt(offset + 0x4, "uint32", { bigEndian: true }, dataView); // prettier-ignore
  const vertices = getVertices(verticesOffset, verticesCount, dataView);

  const indicesOffset = getFileOffset("mpd", offset + 0x8, dataView, baseOffset); // prettier-ignore
  const indicesCount = getInt(offset + 0xc, "uint32", { bigEndian: true }, dataView); // prettier-ignore
  const indices = getIndices(indicesOffset, indicesCount, dataView);

  const materialsOffset = getFileOffset("mpd", offset + 0x10, dataView, baseOffset); // prettier-ignore
  const materials = await getMaterials(
    materialsOffset,
    indicesCount,
    textures,
    canvas,
    dataView,
    overrideOptions.materials,
    overrideOptions.palette,
  );

  const geometry = three.generateGeometry(vertices, indices, materials.uvs, {
    nonIndexed: true,
  });

  const material = materials.options.map((option, index) => {
    geometry.addGroup(index * 6, 6, index);

    return three.generateMaterial({
      ...option,
      depthTest: overrideOptions?.renderOrder === 2 ? false : true,
    });
  });

  const mesh = three.addMesh(geometry, material, instanceId, {
    id: offset.toHex(),
    renderOrder: overrideOptions?.renderOrder,
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

          const tileIndex = getIntFromArray(
            decompressedData,
            tileOffset,
            "uint16",
            true,
          );

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

function getTextures(offset: number, dataView: DataView): Texture[] {
  const textures: Texture[] = [];

  const decompressedData = getDecompressedData(offset, dataView);

  const textureCount = getIntFromArray(decompressedData, 0x0, "uint16", true);

  if (textureCount > 200) {
    debug.warn("Texture count", offset.toHex(), textureCount);
  } else {
    for (let i = 0x0; i < textureCount; i += 0x1) {
      const width = decompressedData[0x4 + i * 0x4];
      const height = decompressedData[0x5 + i * 0x4];

      const textureOffset = getIntFromArray(
        decompressedData,
        0x6 + i * 0x4,
        "uint16",
        true,
      );

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

function getTiles(data: number[], palette: Palette): Uint8Array[] {
  const tiles: Uint8Array[] = [];

  const length = 64;

  const tileCount = (data.length / length) * 2;

  for (let i = 0; i < tileCount; i += 1) {
    const spriteData = applyPalette(
      data.slice((i * length) / 2, (i * length) / 2 + length),
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
  palette1: Palette;
  palette2: Palette;
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
    overrideOptions: OverrideOptions;
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
    mpd.palette1 = getPalette("BGR555", paletteStartOffset, length, {
      bigEndian: true,
      dataView,
    });
  }

  const scenario = getScenario();

  let shift = 0x0;

  if (scenario === "3" || scenario === "premium") {
    const paletteStartOffset = getFileOffset(
      "mpd",
      settingsOffset + 0x44,
      dataView,
    );
    const paletteEndOffset = getFileOffset(
      "mpd",
      settingsOffset + 0x48,
      dataView,
    );

    const length = paletteEndOffset - paletteStartOffset;

    mpd.palette2 = getPalette("BGR555", paletteStartOffset, length, {
      firstTransparent: true,
      bigEndian: true,
      dataView,
    });

    shift = 0x8;
  }

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

  if (mpd.floor.position.z < -1024) {
    mpd.floor.position.z += 2048;
  }

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

    const overrideOptionsCache: {
      [offset: number]: OverrideOptions;
    } = {};

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

      const rotationX = -getInt(objectsOffset + i * 0x3c + 0x32, "int16", { bigEndian: true }, dataView).toEuler(); // prettier-ignore
      const rotationY = -getInt(objectsOffset + i * 0x3c + 0x34, "int16", { bigEndian: true }, dataView).toEuler(); // prettier-ignore
      const rotationZ = getInt(objectsOffset + i * 0x3c + 0x36, "int16", { bigEndian: true }, dataView).toEuler(); // prettier-ignore

      let scaleX = getInt(objectsOffset + i * 0x3c + 0x38, "int16", { bigEndian: true }, dataView); // prettier-ignore
      let scaleY = getInt(objectsOffset + i * 0x3c + 0x3c, "int16", { bigEndian: true }, dataView); // prettier-ignore
      let scaleZ = getInt(objectsOffset + i * 0x3c + 0x40, "int16", { bigEndian: true }, dataView); // prettier-ignore

      scaleX += getInt(objectsOffset + i * 0x3c + 0x3a, "uint16", { bigEndian: true }, dataView) / 0x10000; // prettier-ignore
      scaleY += getInt(objectsOffset + i * 0x3c + 0x3e, "uint16", { bigEndian: true }, dataView) / 0x10000; // prettier-ignore
      scaleZ += getInt(objectsOffset + i * 0x3c + 0x42, "uint16", { bigEndian: true }, dataView) / 0x10000; // prettier-ignore

      const unknown = getInt(objectsOffset + i * 0x3c + 0x44, "uint16", { bigEndian: true }, dataView) // prettier-ignore

      if ([0x7d0, 0x7e0, 0x7f0, 0x800].includes(unknown & 0xff0)) {
        overrideOptionsCache[objectOffset] = {
          palette:
            scenario === "3" || scenario === "premium"
              ? mpd.palette2
              : undefined,
          materials: {
            color: 0x0,
            opacity: 0.5,
            texture: {
              base64: scenario === "1" || scenario === "2" ? "" : undefined,
            },
          },
        };
      } else if ([0x830, 0x840].includes(unknown & 0xff0)) {
        overrideOptionsCache[objectOffset] = {
          palette:
            scenario === "3" || scenario === "premium"
              ? mpd.palette2
              : undefined,
        };
      } else if (unknown === 0xbb8) {
        overrideOptionsCache[objectOffset] = {
          renderOrder: -2,
        };
      }

      mpd.objects.push({
        offset: objectOffset,
        overrideOptions: {},
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

    Object.entries(overrideOptionsCache).forEach(
      ([offset, overrideOptions]) => {
        mpd.objects.map((object) => {
          if (object.offset === parseInt(offset)) {
            object.overrideOptions = overrideOptions;
          }
        });
      },
    );
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
      const textures = getTextures(texturesOffset, dataView);

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
      generateFloorTexture(tilesData, mpd.palette1, canvas);

      mpd.floor.repeat = true;
    } else {
      const tiles = getTiles(tilesData, mpd.palette1);

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
