import {
  BufferGeometry,
  MeshBasicMaterial,
  PlaneGeometry,
  type Mesh,
} from "three";

import { getInt, getIntFromArray } from "$lib/utils/bytes";
import Canvas from "$lib/utils/canvas";
import { File } from "$lib/utils/common/iso9660";
import {
  generateTexture,
  getDecompressedData,
  getIndices,
  getVertices,
  type Texture,
} from "$lib/utils/common/saturn/shining";
import { flipUvs, getPalette } from "$lib/utils/graphics";
import Three from "$lib/utils/three";

import { DataTypeInt, DataTypeUInt } from "$lib/types";

import { getMaterialOptions, type MaterialOption } from "./model";

interface Object {
  id: string;
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
  geometry: BufferGeometry;
  materialOptions: MaterialOption[];
}

interface Floor extends Object {
  texture: Texture;
}

export default class MDX {
  private file: File;
  private dataView: DataView;
  private three: Three;
  private pointers: { [key: string]: number };
  private mountedOffset: number;
  private _floor?: Floor;
  private _objects: Object[];
  private _textures: Texture[];

  constructor(file: File, dataView: DataView, three: Three) {
    this.file = file;
    this.dataView = dataView;
    this.three = three;
    this.pointers = {};
    this.mountedOffset = 0x0;
    this._objects = [];
    this._textures = [];

    this.unpack();
  }

  get floor() {
    return this._floor;
  }

  get objects() {
    return this._objects;
  }

  get textures() {
    return this._textures;
  }

  private getInt(offset: number, dataType: DataTypeInt | DataTypeUInt): number {
    return getInt(offset, dataType, { bigEndian: true }, this.dataView);
  }

  private getOffset(offset: number): number {
    return this.getInt(offset, "uint32") - this.mountedOffset;
  }

  private unpack(): void {
    this.pointers = {
      unknonw0: this.getInt(0x0, "uint32"),
      unknonw1: this.getInt(0x4, "uint32"),
      textures: this.getInt(0x8, "uint32"),
      unknonw3: this.getInt(0xc, "uint32"),
      unknonw4: this.getInt(0x10, "uint32"),
      unknonw5: this.getInt(0x14, "uint32"),
      unknonw6: this.getInt(0x18, "uint32"),
      unknonw7: this.getInt(0x1c, "uint32"),
      objects: this.getInt(0x20, "uint32"),
      unknonw9: this.getInt(0x24, "uint32"),
      unknonwA: this.getInt(0x28, "uint32"),
      unknonwB: this.getInt(0x2c, "uint32"),
    };

    this._floor = this.parseFloor();
    this._objects = this.parseObjects();
    this._textures = this.parseTextures();
  }

  private parseObjects(): Object[] {
    const objects = [];

    this.mountedOffset = 0x234000 - this.pointers.objects;

    if (this.file.name === "M521.MDX") {
      this.mountedOffset = 0x211000;
    }

    const objectCount = this.getInt(this.pointers.objects + 0x8, "uint16");

    for (let i = 0x0; i < objectCount; i += 0x1) {
      objects.push(this.parseObject(this.pointers.objects + 0xc + 0x38 * i));
    }

    return objects;
  }

  private parseFloor(): Floor | undefined {
    this.mountedOffset =
      this.getInt(this.pointers.textures, "uint32") -
      0x4 -
      this.pointers.textures;

    const flag = this.getInt(this.pointers.textures + 0x4, "uint16");

    if (flag === 0x1) {
      const dataOffset = this.getOffset(this.pointers.textures + 0x30);
      const paletteOffset = this.getOffset(this.pointers.textures + 0x2c);

      if (dataOffset > 0x0) {
        const geometry = new PlaneGeometry(20480, 20480);

        const rawData = getDecompressedData(dataOffset, this.dataView);

        const palette = getPalette("BGR555", paletteOffset, 0x100, {
          bigEndian: true,
          dataView: this.dataView,
        });

        return {
          id: "floor",
          position: { x: 0, y: 0, z: 0 },
          rotation: { x: -Math.PI / 2, y: 0, z: 0 },
          scale: { x: 1, y: 1, z: 1 },
          geometry,
          materialOptions: [
            {
              doubleSided: true,
              texture: {
                enabled: true,
                index: 0x100,
              },
            },
          ],
          texture: {
            width: 512,
            height: 256,
            palette,
            rawData,
            data: new Uint8Array(),
            base64: "",
          },
        };
      }
    }

    return;
  }

  private parseObject(offset: number): Object {
    const pointers = {
      geometry: this.getOffset(offset),
      unknown1: this.getInt(offset + 0x4, "uint32"),
      unknown2: this.getInt(offset + 0x8, "uint32"),
      unknown3: this.getInt(offset + 0xc, "uint32"),
      unknown4: this.getInt(offset + 0x10, "uint32"),
      unknown5: this.getInt(offset + 0x14, "uint32"),
      unknown6: this.getInt(offset + 0x18, "uint32"),
      unknown7: this.getInt(offset + 0x1c, "uint32"),
    };

    const object = {
      id: offset.toHex(),
      position: {
        x: -this.getInt(offset + 0x20, "int16"),
        y: -this.getInt(offset + 0x22, "int16"),
        z: this.getInt(offset + 0x24, "int16"),
      },
      rotation: {
        x: -this.getInt(offset + 0x26, "int16").toEuler(),
        y: -this.getInt(offset + 0x28, "int16").toEuler(),
        z: this.getInt(offset + 0x2a, "int16").toEuler(),
      },
      scale: {
        x: this.getInt(offset + 0x2c, "int32") / 0x10000,
        y: this.getInt(offset + 0x30, "int32") / 0x10000,
        z: this.getInt(offset + 0x34, "int32") / 0x10000,
      },
    };

    const verticesOffset = this.getOffset(pointers.geometry);
    const verticesCount = this.getInt(pointers.geometry + 0x4, "uint32");
    const vertices = getVertices(verticesOffset, verticesCount, this.dataView);

    const indicesOffset = this.getOffset(pointers.geometry + 0x8);
    const indicesCount = this.getInt(pointers.geometry + 0xc, "uint32");
    const indices = getIndices(indicesOffset, indicesCount, this.dataView);

    const materialsOffset = this.getOffset(pointers.geometry + 0x10);
    const materialOptions = getMaterialOptions(
      materialsOffset,
      indicesCount,
      this.dataView,
    );

    const uvs: number[] = [];

    materialOptions.forEach((material) => {
      if (material.texture) {
        let uv = [0, 1, 1, 1, 1, 0, 1, 0, 0, 0, 0, 1];

        if (material.texture.flipX) {
          uv = flipUvs(uv, "x");
        }

        if (material.texture.flipY) {
          uv = flipUvs(uv, "y");
        }

        uvs.push(...uv);
      }
    });

    const geometry = this.three.generateGeometry(vertices, indices, uvs, {
      nonIndexed: true,
    });

    return {
      ...object,
      geometry,
      materialOptions,
    };
  }

  private parseTextures(): Texture[] {
    const textures = [];

    this.mountedOffset =
      this.getInt(this.pointers.textures, "uint32") -
      0x4 -
      this.pointers.textures;

    for (let i = 0x0; i < 0x3; i += 0x1) {
      const rawData = getDecompressedData(
        this.getOffset(this.pointers.textures + 0x88 + i * 0x4),
        this.dataView,
      );

      const count = getIntFromArray(rawData, 0x0, "uint32", true);

      const baseOffset = (count + 0x1) * 0x8;

      // prettier-ignore
      for (let j = 0x0; j < count; j += 0x1) {
        const width = getIntFromArray(rawData, 0x8 + j * 0x8, "uint16", true);
        const height = getIntFromArray(rawData, 0xa + j * 0x8, "uint16", true);
        const offset = baseOffset + getIntFromArray(rawData, 0xc + j * 0x8, "uint32", true);

        textures.push({
          width,
          height,
          rawData: rawData.slice(offset),
          data: new Uint8Array(),
          base64: "",
        });
      }
    }

    if (this._floor) {
      textures[0x100] = this._floor.texture;
    }

    return textures;
  }

  public async addMesh(
    object: Object,
    three: Three,
    instanceId: string,
    canvas: Canvas,
  ): Promise<void> {
    const { id, position, rotation, scale, geometry, materialOptions } = object;

    const isFloor = id === "floor";

    let mesh: Mesh | null;

    if (three.isMeshCached(id)) {
      mesh = three.cloneCachedMesh(id, instanceId);
    } else {
      const material: MeshBasicMaterial[] = [];

      await materialOptions.reduce(async (previousMaterial, option, index) => {
        await previousMaterial;

        if (instanceId !== three.getInstanceId()) {
          return;
        }

        geometry.addGroup(index * 6, 6, index);

        let base64 = "";

        if (option.texture?.enabled) {
          const texture = this.textures[option.texture.index];

          if (texture?.base64) {
            base64 = texture.base64;
          } else if (texture) {
            base64 = await generateTexture(texture, canvas, texture.palette);
          }
        }

        const id = `${option.type}-${option.texture?.index}-${option.meshColor}`;

        if (three.isMaterialCached(id)) {
          const cachedMaterial = three.getCachedMaterial(id, instanceId) as MeshBasicMaterial; // prettier-ignore

          material.push(cachedMaterial);
        } else {
          material.push(
            three.generateMaterial({
              id,
              color: option.meshColor,
              depthWrite: isFloor ? false : true,
              side: option.doubleSided ? "double" : "front",
              texture: {
                base64,
                repeat: isFloor ? [40, 80] : undefined,
                repeatX: isFloor,
                repeatY: isFloor,
              },
            }) as MeshBasicMaterial,
          );
        }
      }, Promise.resolve());

      mesh = three.addMesh(geometry, material, instanceId, {
        id,
        locked: isFloor,
        renderOrder: isFloor ? -1 : 0,
      });

      if (mesh) {
        mesh.position.x = position.x;
        mesh.position.y = position.y;
        mesh.position.z = position.z;

        mesh.rotation.order = "ZYX";

        mesh.rotation.x = rotation.x;
        mesh.rotation.y = rotation.y;
        mesh.rotation.z = rotation.z;

        mesh.scale.x = scale.x;
        mesh.scale.y = scale.y;
        mesh.scale.z = scale.z;
      }
    }
  }
}
