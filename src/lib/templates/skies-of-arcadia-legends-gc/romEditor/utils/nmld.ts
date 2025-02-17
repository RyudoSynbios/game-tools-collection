import { getInt, getString } from "$lib/utils/bytes";
import debug from "$lib/utils/debug";

import {
  GrndFile,
  NjtlFile,
  NmdmFile,
  unpackGrnd,
  unpackNjtl,
  unpackNmdm,
} from "../utils";
import { NjcmFile, unpackNjcm } from "./njcm";

export interface NmldFile {
  tableSize: number;
  headerSize: number;
  size: number;
  entities: NmldEntity[];
  grndFiles: { [key: number]: GrndFile };
  njcmFiles: { [key: number]: NjcmFile };
  njtlFiles: { [key: number]: NjtlFile };
  nmdmFiles: { [key: number]: NmdmFile };
  textures: { [key: string]: DataView };
}

export interface NmldEntity {
  index: number;
  unknown: number;
  name: string;
  linkedGrndFiles: number[];
  linkedNjcmFiles: number[];
  linkedNjtlFiles: number[];
  linkedNmdmFiles: number[];
  positionX: number;
  positionY: number;
  positionZ: number;
  rotationX: number;
  rotationY: number;
  rotationZ: number;
  scaleX: number;
  scaleY: number;
  scaleZ: number;
}

// prettier-ignore
export function unpackNmld(dataView: DataView): NmldFile {
  const file: NmldFile = {
    tableSize: getInt(0x8, "uint32", { bigEndian: true }, dataView),
    headerSize: getInt(0xc, "uint32", { bigEndian: true }, dataView),
    size: getInt(0x10, "uint32", { bigEndian: true }, dataView),
    entities: [],
    grndFiles: {},
    njcmFiles: {},
    njtlFiles: {},
    nmdmFiles: {},
    textures: {},
  };

  const count = getInt(0x0, "uint32", { bigEndian: true }, dataView);
  const nmldOffset = getInt(0x4, "uint32", { bigEndian: true }, dataView);

  for (let i = 0x0; i < count; i += 0x1) {
    const offset = nmldOffset + i * 0x68;

    const entity: NmldEntity = {
      index: getInt(offset, "uint32", { bigEndian: true }, dataView),
      unknown: getInt(offset + 0x4, "uint32", { bigEndian: true }, dataView),
      name: getString(offset + 0x24, 0x10, "uint8", { zeroTerminated: true }, dataView),
      linkedGrndFiles: [],
      linkedNjcmFiles: [],
      linkedNjtlFiles: [],
      linkedNmdmFiles: [],
      positionX: getInt(offset + 0x44, "float32", { bigEndian: true }, dataView),
      positionY: getInt(offset + 0x48, "float32", { bigEndian: true }, dataView),
      positionZ: getInt(offset + 0x4c, "float32", { bigEndian: true }, dataView),
      rotationX: getInt(offset + 0x50, "float32", { bigEndian: true }, dataView),
      rotationY: getInt(offset + 0x54, "float32", { bigEndian: true }, dataView),
      rotationZ: getInt(offset + 0x58, "float32", { bigEndian: true }, dataView),
      scaleX: getInt(offset + 0x5c, "float32", { bigEndian: true }, dataView),
      scaleY: getInt(offset + 0x60, "float32", { bigEndian: true }, dataView),
      scaleZ: getInt(offset + 0x64, "float32", { bigEndian: true }, dataView),
    };

    // const offset1 = getInt(offset + 0x8, "uint32", { bigEndian: true }, dataView);
    // const offset2 = getInt(offset + 0xc, "uint32", { bigEndian: true }, dataView);
    // const offset3 = getInt(offset + 0x10, "uint32", { bigEndian: true }, dataView);
    const objectOffset = getInt(offset + 0x14, "uint32", { bigEndian: true }, dataView);
    // const offset5 = getInt(offset + 0x18, "uint32", { bigEndian: true }, dataView);
    // const offset6 = getInt(offset + 0x1c, "uint32", { bigEndian: true }, dataView);
    // const offset7 = getInt(offset + 0x20, "uint32", { bigEndian: true }, dataView);
    // const unknownA = getInt(offset + 0x34, "uint32", { bigEndian: true }, dataView);
    // const unknownB = getInt(offset + 0x38, "uint32", { bigEndian: true }, dataView);
    // const unknownC = getInt(offset + 0x3c, "uint32", { bigEndian: true }, dataView);
    // const unknownD = getInt(offset + 0x40, "uint32", { bigEndian: true }, dataView);

    const objectCount = getInt(objectOffset, "uint32", { bigEndian: true }, dataView);

    for (let j = 0x0; j < objectCount; j += 0x1) {
      const headerOffset = getInt(objectOffset + 0x4 + j * 0x4, "uint32", { bigEndian: true }, dataView);

      if (headerOffset) {
        for (let k = 0x0; k < 0x4; k += 0x1) {
          const pointer = getInt(headerOffset + k * 0x4, "uint32", { bigEndian: true }, dataView);

          if (pointer) {
            const offset = headerOffset + pointer;

            const type = getString(offset, 0x4, "uint8", { zeroTerminated: true }, dataView);

            if (type === "GRND") {
              if (!file.grndFiles[offset]) {
                const grndFile = unpackGrnd(offset, dataView);

                file.grndFiles[offset] = grndFile;
              }

              entity.linkedGrndFiles.push(offset);
            } else if (type === "NJCM") {
              if (!file.njcmFiles[offset]) {
                const njcmFile = unpackNjcm(offset, dataView);

                file.njcmFiles[offset] = njcmFile;
              }

              entity.linkedNjcmFiles.push(offset);
            } else if (type === "NJTL") {
              if (!file.njtlFiles[offset]) {
                const njtlFile = unpackNjtl(offset, dataView);

                file.njtlFiles[offset] = njtlFile;
              }

              entity.linkedNjtlFiles.push(offset);
            } else if (type === "NMDM") {
              if (!file.nmdmFiles[offset]) {
                const nmdmFile = unpackNmdm(offset, dataView);

                file.nmdmFiles[offset] = nmdmFile;
              }

              entity.linkedNmdmFiles.push(offset);
            } else if (type !== "") {
              debug.log(type);
            }
          }
        }
      }
    }

    file.entities.push(entity);
  }

  const assetsHeaderOffset = file.size;

  const assetCount = getInt(assetsHeaderOffset, "uint32", { bigEndian: true }, dataView);

  if (assetCount === 0) {
    return file;
  }

  let assetsOffset = assetsHeaderOffset + 0x4 + assetCount * 0x2c;

  while (true) {
    if (getInt(assetsOffset, "uint8", {}, dataView) !== 0x0) {
      break;
    }

    assetsOffset += 0x1;
  }

  for (let i = 0x0; i < assetCount; i += 0x1) {
    const offset = assetsHeaderOffset + 0x4 + i * 0x2c;

    const name = getString(offset, 0x10, "uint8", { zeroTerminated: true }, dataView);
    const size = getInt(offset + 0x28, "uint32", { bigEndian: true }, dataView);

    const assetType = getString(assetsOffset, 0x4, "uint8", { zeroTerminated: true }, dataView);

    const gvrDataView = new DataView(
      dataView.buffer.slice(assetsOffset, assetsOffset + size),
    );

    if (assetType === "GCIX") {
      file.textures[name] = gvrDataView;
    } else {
      debug.warn("Asset type has not a GCIX header.");
    }

    assetsOffset += size;
  }

  return file;
}
