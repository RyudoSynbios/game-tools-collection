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
  flags: {
    position: boolean;
    rotation: boolean;
    scale: boolean;
    unknown3: boolean;
    hasChildren: boolean;
    unknown5: boolean;
    unknown6: boolean;
    unknown7: boolean;
    debug: string;
  };
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

// prettier-ignore
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

  object.flags = {
    position: !getInt(offset + 0x3, "bit", { bit: 0 }, dataView),
    rotation: !getInt(offset + 0x3, "bit", { bit: 1 }, dataView),
    scale: !getInt(offset + 0x3, "bit", { bit: 2 }, dataView),
    unknown3: Boolean(getInt(offset + 0x3, "bit", { bit: 3 }, dataView)),
    hasChildren: !getInt(offset + 0x3, "bit", { bit: 4 }, dataView),
    unknown5: Boolean(getInt(offset + 0x3, "bit", { bit: 5 }, dataView)),
    unknown6: Boolean(getInt(offset + 0x3, "bit", { bit: 6 }, dataView)),
    unknown7: Boolean(getInt(offset + 0x3, "bit", { bit: 7 }, dataView)),
    debug: "",
  };

  object.flags.debug += object.flags.position ? 'p' : '-';
  object.flags.debug += object.flags.rotation ? 'r' : '-';
  object.flags.debug += object.flags.scale ? 's' : '-';
  object.flags.debug += object.flags.unknown3 ? '3' : '-';
  object.flags.debug += object.flags.hasChildren ? 'c' : '-';
  object.flags.debug += object.flags.unknown5 ? '5' : '-';
  object.flags.debug += object.flags.unknown6 ? '6' : '-';
  object.flags.debug += object.flags.unknown7 ? '7' : '-';

  const dataPointer = getInt(offset + 0x4, "uint32", { bigEndian: true }, dataView);

  object.transform = {
    positionX: getInt(offset + 0x8, "float32", { bigEndian: true }, dataView),
    positionY: getInt(offset + 0xc, "float32", { bigEndian: true }, dataView),
    positionZ: getInt(offset + 0x10, "float32", { bigEndian: true }, dataView),
    rotationX: getInt(offset + 0x14, "int32", { bigEndian: true }, dataView).toEuler(),
    rotationY: getInt(offset + 0x18, "int32", { bigEndian: true }, dataView).toEuler(),
    rotationZ: getInt(offset + 0x1c, "int32", { bigEndian: true }, dataView).toEuler(),
    scaleX: getInt(offset + 0x20, "float32", { bigEndian: true }, dataView),
    scaleY: getInt(offset + 0x24, "float32", { bigEndian: true }, dataView),
    scaleZ: getInt(offset + 0x28, "float32", { bigEndian: true }, dataView),
  };

  const pointerToChild = getInt(offset + 0x2c, "uint32", { bigEndian: true }, dataView);
  const pointerToNext = getInt(offset + 0x30, "uint32", { bigEndian: true }, dataView);

  if (dataPointer > 0x0) {
    const dataOffset = baseOffset + dataPointer;

    const verticesPointer = getInt(dataOffset, "uint32", { bigEndian: true }, dataView);

    if (verticesPointer) {
      object.verticesOffset = baseOffset + verticesPointer;
    }

    const meshsPointer = getInt(dataOffset + 0x4, "uint32", { bigEndian: true }, dataView);

    if (meshsPointer) {
      object.meshsOffset = baseOffset + meshsPointer;
    }

    object.unknown2 = getInt(dataOffset + 0x8, "uint32", { bigEndian: true }, dataView);
    object.unknown3 = getInt(dataOffset + 0xc, "uint32", { bigEndian: true }, dataView);
    object.unknown4 = getInt(dataOffset + 0x10, "uint32", { bigEndian: true }, dataView);
    object.unknown5 = getInt(dataOffset + 0x14, "uint32", { bigEndian: true }, dataView);
  }

  objects.push(object);

  if (pointerToChild) {
    parseNjcmObject(
      baseOffset,
      baseOffset + pointerToChild,
      objects,
      dataView,
      object.index,
    );
  }

  if (pointerToNext) {
    parseNjcmObject(
      baseOffset,
      baseOffset + pointerToNext,
      objects,
      dataView,
      parentIndex,
    );
  }
}
