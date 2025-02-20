import { getInt, getString } from "$lib/utils/bytes";
import debug from "$lib/utils/debug";

import { Entity, Model, unpackGrnd, unpackNjtl, unpackNmdm } from "../utils";
import { unpackNjcm } from "./njcm";

// prettier-ignore
export function unpackSml(dataView: DataView): Model {
  const model: Model = {
    entities: [],
    grndFiles: {},
    njcmFiles: {},
    njtlFiles: {},
    nmdmFiles: {},
    textures: {},
  };

  const count = getInt(0x4, "uint16", { bigEndian: true }, dataView);

  for (let i = 0x0; i < count; i += 0x1) {
    const baseOffset = getInt(i * 0x10 + 0xc, "uint32", { bigEndian: true }, dataView);

    const offset = baseOffset + getInt(baseOffset + 0x4, "uint32", { bigEndian: true }, dataView);
    // const tableSize = getInt(baseOffset + 0x8, "uint32", { bigEndian: true }, dataView);
    // const headerSize = getInt(baseOffset + 0xc, "uint32", { bigEndian: true }, dataView);
    const size = getInt(baseOffset + 0x10, "uint32", { bigEndian: true }, dataView);

    const entity: Entity = {
      index: getInt(i * 0x10 + 0x8, "uint32", { bigEndian: true }, dataView),
      unknown: getInt(offset + 0x4, "uint32", { bigEndian: true }, dataView),
      name: getString(offset + 0x24, 0x10, "uint8", { zeroTerminated: true }, dataView),
      linkedGrndFiles: [],
      linkedNjcmFiles: [],
      linkedNjtlFiles: [],
      linkedNmdmFiles: [],
      transform: {
        positionX: getInt(offset + 0x44, "float32", { bigEndian: true }, dataView),
        positionY: getInt(offset + 0x48, "float32", { bigEndian: true }, dataView),
        positionZ: getInt(offset + 0x4c, "float32", { bigEndian: true }, dataView),
        rotationX: getInt(offset + 0x50, "float32", { bigEndian: true }, dataView),
        rotationY: getInt(offset + 0x54, "float32", { bigEndian: true }, dataView),
        rotationZ: getInt(offset + 0x58, "float32", { bigEndian: true }, dataView),
        scaleX: getInt(offset + 0x5c, "float32", { bigEndian: true }, dataView),
        scaleY: getInt(offset + 0x60, "float32", { bigEndian: true }, dataView),
        scaleZ: getInt(offset + 0x64, "float32", { bigEndian: true }, dataView),
      },
    };

    // const offset1 = getInt(offset + 0x8, "uint32", { bigEndian: true }, dataView);
    // const offset2 = getInt(offset + 0xc, "uint32", { bigEndian: true }, dataView);
    // const offset3 = getInt(offset + 0x10, "uint32", { bigEndian: true }, dataView);
    const objectOffset = baseOffset + getInt(offset + 0x14, "uint32", { bigEndian: true }, dataView);
    // const offset5 = getInt(offset + 0x18, "uint32", { bigEndian: true }, dataView);
    // const offset6 = getInt(offset + 0x1c, "uint32", { bigEndian: true }, dataView);
    // const offset7 = getInt(offset + 0x20, "uint32", { bigEndian: true }, dataView);
    // const unknownA = getInt(offset + 0x34, "uint32", { bigEndian: true }, dataView);
    // const unknownB = getInt(offset + 0x38, "uint32", { bigEndian: true }, dataView);
    // const unknownC = getInt(offset + 0x3c, "uint32", { bigEndian: true }, dataView);
    // const unknownD = getInt(offset + 0x40, "uint32", { bigEndian: true }, dataView);

    const objectCount = getInt(objectOffset, "uint32", { bigEndian: true }, dataView);

    for (let j = 0x0; j < objectCount; j += 0x1) {
      const headerOffset = baseOffset + getInt(objectOffset + 0x4 + j * 0x4, "uint32", { bigEndian: true }, dataView);

      if (headerOffset) {
        for (let k = 0x0; k < 0x4; k += 0x1) {
          const pointer = getInt(headerOffset + k * 0x4, "uint32", { bigEndian: true }, dataView);

          if (pointer) {
            const offset = headerOffset + pointer;

            const type = getString(offset, 0x4, "uint8", { zeroTerminated: true }, dataView);

            if (type === "GRND") {
              if (!model.grndFiles[offset]) {
                const grndFile = unpackGrnd(offset, dataView);

                model.grndFiles[offset] = grndFile;
              }

              entity.linkedGrndFiles.push(offset);
            } else if (type === "NJCM") {
              if (!model.njcmFiles[offset]) {
                const njcmFile = unpackNjcm(offset, dataView);

                model.njcmFiles[offset] = njcmFile;
              }

              entity.linkedNjcmFiles.push(offset);
            } else if (type === "NJTL") {
              if (!model.njtlFiles[offset]) {
                const njtlFile = unpackNjtl(offset, dataView);

                model.njtlFiles[offset] = njtlFile;
              }

              entity.linkedNjtlFiles.push(offset);
            } else if (type === "NMDM") {
              if (!model.nmdmFiles[offset]) {
                const nmdmFile = unpackNmdm(offset, dataView);

                model.nmdmFiles[offset] = nmdmFile;
              }

              entity.linkedNmdmFiles.push(offset);
            } else if (type !== "") {
              debug.log(type);
            }
          }
        }
      }
    }

    model.entities.push(entity);

    const assetsHeaderOffset = baseOffset + size;

    const assetCount = getInt(assetsHeaderOffset, "uint32", { bigEndian: true }, dataView);

    if (assetCount === 0) {
      return model;
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
        model.textures[name] = gvrDataView;
      } else {
        debug.warn("Asset type has not a GCIX header.");
      }

      assetsOffset += size;
    }
  }

  return model;
}
