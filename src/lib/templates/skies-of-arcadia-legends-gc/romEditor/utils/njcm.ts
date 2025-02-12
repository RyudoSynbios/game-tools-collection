import { getInt } from "$lib/utils/bytes";

export interface NjcmFile {
  size: number;
  objects: NjcmObject[];
}

export function unpackNjcm(offset: number, dataView: DataView): NjcmFile {
  const file: NjcmFile = {
    size: getInt(offset + 0x4, "uint32", { bigEndian: true }, dataView),
    objects: [],
  };

  parseNjcmObject(offset + 0x8, offset + 0x8, file.objects, dataView);

  return file;
}

export interface NjcmObject {
  index: number;
  parentIndex: number;
  unknown1?: number;
  transform: {
    positionX: number;
    positionY: number;
    positionZ: number;
    rotationX: number;
    rotationY: number;
    rotationZ: number;
    scaleX: number;
    scaleY: number;
    scaleZ: number;
  };
  verticesOffset: number;
  meshsOffset: number;
  unknown2?: number;
  unknown3?: number;
  unknown4?: number;
  unknown5?: number;
}

function parseNjcmObject(
  baseOffset: number,
  offset: number,
  objects: NjcmObject[],
  dataView: DataView,
  parentIndex = 0,
): void {
  const object = {
    index: objects.length,
    parentIndex,
  } as NjcmObject;

  // TODO: Probably anchor
  object.unknown1 = getInt(offset, "uint32", { bigEndian: true }, dataView); // prettier-ignore

  const dataPointer = getInt(offset + 0x4, "uint32", { bigEndian: true }, dataView); // prettier-ignore

  object.transform = {
    positionX: getInt(offset + 0x8, "float32", { bigEndian: true }, dataView), // prettier-ignore
    positionY: getInt(offset + 0xc, "float32", { bigEndian: true }, dataView), // prettier-ignore
    positionZ: getInt(offset + 0x10, "float32", { bigEndian: true }, dataView), // prettier-ignore
    rotationX: getInt(offset + 0x14, "int32", { bigEndian: true }, dataView) / 10430, // prettier-ignore
    rotationY: getInt(offset + 0x18, "int32", { bigEndian: true }, dataView) / 10430, // prettier-ignore
    rotationZ: getInt(offset + 0x1c, "int32", { bigEndian: true }, dataView) / 10430, // prettier-ignore
    scaleX: getInt(offset + 0x20, "float32", { bigEndian: true }, dataView), // prettier-ignore
    scaleY: getInt(offset + 0x24, "float32", { bigEndian: true }, dataView), // prettier-ignore
    scaleZ: getInt(offset + 0x28, "float32", { bigEndian: true }, dataView), // prettier-ignore
  };

  const pointerToChild = getInt(offset + 0x2c, "uint32", { bigEndian: true }, dataView); // prettier-ignore
  const pointerToNext = getInt(offset + 0x30, "uint32", { bigEndian: true }, dataView); // prettier-ignore

  if (dataPointer > 0x0) {
    const dataOffset = baseOffset + dataPointer;

    const verticesPointer = getInt(dataOffset, "uint32", { bigEndian: true }, dataView); // prettier-ignore

    if (verticesPointer) {
      object.verticesOffset = baseOffset + verticesPointer;
    }

    const meshsPointer = getInt(dataOffset + 0x4, "uint32", { bigEndian: true }, dataView); // prettier-ignore

    if (meshsPointer) {
      object.meshsOffset = baseOffset + meshsPointer;
    }

    object.unknown2 = getInt(dataOffset + 0x8, "uint32", { bigEndian: true }, dataView); // prettier-ignore
    object.unknown3 = getInt(dataOffset + 0xc, "uint32", { bigEndian: true }, dataView); // prettier-ignore
    object.unknown4 = getInt(dataOffset + 0x10, "uint32", { bigEndian: true }, dataView); // prettier-ignore
    object.unknown5 = getInt(dataOffset + 0x14, "uint32", { bigEndian: true }, dataView); // prettier-ignore
  }

  objects.push(object);

  if (pointerToChild) {
    parseNjcmObject(baseOffset, baseOffset + pointerToChild, objects, dataView, object.index ); // prettier-ignore
  }

  if (pointerToNext) {
    parseNjcmObject(baseOffset, baseOffset + pointerToNext, objects, dataView, parentIndex); // prettier-ignore
  }
}
