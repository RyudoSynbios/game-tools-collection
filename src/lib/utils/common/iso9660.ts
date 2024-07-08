import { get } from "svelte/store";

import { dataView, gameTemplate } from "$lib/stores";

import type { RegionValidator } from "$lib/types";

import { extractBit, getInt, getString } from "../bytes";
import { checkValidator, getRegions } from "../validator";

interface Iso {
  hasSectors: boolean;
  sectorShift: number;
  blockSize: number;
  volume: Volume;
}

interface Volume {
  type: number;
  identifier: string;
  version: number;
  systemId: string;
  volumeId: string;
  spaceSizeLE: number;
  spaceSizeBE: number;
  setSizeLE: number;
  setSizeBE: number;
  sequenceNumberLE: number;
  sequenceNumberBE: number;
  logicalBlockSizeLE: number;
  logicalBlockSizeBE: number;
  pathTableSizeLE: number;
  pathTableSizeBE: number;
  pathLBATableLE: number;
  optionalPathLBATableLE: number;
  pathLBATableBE: number;
  optionalPathLBATableBE: number;
  rootDirectory: RootDirectory;
  volumeSetIdentifier: string;
  publisherIdentifier: string;
  dataPreparerIdentifier: string;
  applicationIdentifier: string;
  copyrightIdentifier: string;
  abstractIdentifier: string;
  bibliographicIdentifier: string;
  createdAt: string;
  updatedAt: string;
  expiredAt: string;
  effectiveAt: string;
  fileStructureVersion: number;
}

interface RootDirectory {
  sectorLE: number;
  sizeLE: number;
  files: File[];
}

export interface File {
  name: string;
  offset: number;
  size: number;
}

let iso = {} as Iso;

export function customGetRegions(dataView: DataView, shift: number): string[] {
  const $gameTemplate = get(gameTemplate);

  const overridedRegions = Object.entries(
    $gameTemplate.validator.regions,
  ).reduce(
    (regions: { [key: string]: RegionValidator }, [region, condition]) => {
      const validator = Object.values(condition)[0];

      let offset = parseInt(Object.keys(condition)[0]);

      if (hasSectors(dataView)) {
        offset += 0x10;
      }

      regions[region] = { [offset]: validator };

      return regions;
    },
    {},
  );

  return getRegions(dataView, shift, overridedRegions);
}

export function hasSectors(dataView: DataView): boolean {
  const validator = [
    0x00, 0xff, 0xff, 0xff, 0xff, 0xff, 0xff, 0xff, 0xff, 0xff, 0xff, 0x00,
    0x00, 0x02, 0x00, 0x01,
  ];

  return checkValidator(validator, 0x0, dataView);
}

export function getAbsoluteOffset(offset: number): number {
  if (iso.hasSectors) {
    offset =
      iso.sectorShift +
      Math.floor(offset / (iso.volume.logicalBlockSizeLE || 0x800)) *
        (iso.blockSize || 0x930);
  }

  return offset;
}

export function getRelativeOffset(offset: number): number {
  if (
    iso.hasSectors &&
    offset % iso.blockSize >= iso.sectorShift + iso.volume.logicalBlockSizeLE
  ) {
    offset =
      iso.sectorShift +
      (Math.floor(offset / iso.blockSize) + 0x1) * iso.blockSize;
  }

  return offset;
}

// Source from https://wiki.osdev.org/ISO_9660
export function readIso9660(): void {
  const $dataView = get(dataView);

  iso.hasSectors = hasSectors($dataView);
  iso.sectorShift = iso.hasSectors ? 0x10 : 0x0;

  iso.volume = {} as Volume;

  let offset = getAbsoluteOffset(0x8000);

  iso.volume.type = getInt(offset, "uint8");
  iso.volume.identifier = getString(offset + 0x1, 0x5, "uint8").trim();
  iso.volume.version = getInt(offset + 0x6, "uint8");
  iso.volume.systemId = getString(offset + 0x8, 0x20, "uint8").trim();
  iso.volume.volumeId = getString(offset + 0x28, 0x20, "uint8").trim();
  iso.volume.spaceSizeLE = getInt(offset + 0x50, "uint32");
  iso.volume.spaceSizeBE = getInt(offset + 0x54, "uint32", { bigEndian: true });
  iso.volume.setSizeLE = getInt(offset + 0x78, "uint16");
  iso.volume.setSizeBE = getInt(offset + 0x7a, "uint16", { bigEndian: true });
  iso.volume.sequenceNumberLE = getInt(offset + 0x7c, "uint16");
  iso.volume.sequenceNumberBE = getInt(offset + 0x7e, "uint16", { bigEndian: true }); // prettier-ignore
  iso.volume.logicalBlockSizeLE = getInt(offset + 0x80, "uint16");
  iso.volume.logicalBlockSizeBE = getInt(offset + 0x82, "uint16", { bigEndian: true }); // prettier-ignore
  iso.volume.pathTableSizeLE = getInt(offset + 0x84, "uint32");
  iso.volume.pathTableSizeBE = getInt(offset + 0x88, "uint32", { bigEndian: true }); // prettier-ignore
  iso.volume.pathLBATableLE = getInt(offset + 0x8c, "uint32");
  iso.volume.optionalPathLBATableLE = getInt(offset + 0x90, "uint32");
  iso.volume.pathLBATableBE = getInt(offset + 0x94, "uint32", { bigEndian: true }); // prettier-ignore
  iso.volume.optionalPathLBATableBE = getInt(offset + 0x98, "uint32", { bigEndian: true }); // prettier-ignore

  // TODO: To complete
  iso.volume.rootDirectory = {} as RootDirectory;

  iso.volume.rootDirectory.sectorLE = getInt(offset + 0x9e, "uint32");
  iso.volume.rootDirectory.sizeLE = getInt(offset + 0xa6, "uint32");

  iso.volume.volumeSetIdentifier = getString(offset + 0xbe, 0x80, "uint8").trim(); // prettier-ignore
  iso.volume.publisherIdentifier = getString(offset + 0x13e, 0x80, "uint8").trim(); // prettier-ignore
  iso.volume.dataPreparerIdentifier = getString(offset + 0x1be, 0x80, "uint8").trim(); // prettier-ignore
  iso.volume.applicationIdentifier = getString(offset + 0x23e, 0x80, "uint8").trim(); // prettier-ignore
  iso.volume.copyrightIdentifier = getString(offset + 0x2be, 0x25, "uint8").trim(); // prettier-ignore
  iso.volume.abstractIdentifier = getString(offset + 0x2e3, 0x25, "uint8").trim(); // prettier-ignore
  iso.volume.bibliographicIdentifier = getString(offset + 0x308, 0x25, "uint8").trim(); // prettier-ignore

  iso.volume.createdAt = getString(offset + 0x32d, 0x11, "uint8");
  iso.volume.updatedAt = getString(offset + 0x33e, 0x11, "uint8");
  iso.volume.expiredAt = getString(offset + 0x34f, 0x11, "uint8");
  iso.volume.effectiveAt = getString(offset + 0x360, 0x11, "uint8");

  iso.volume.fileStructureVersion = getInt(offset + 0x371, "uint8");

  iso.blockSize = iso.volume.logicalBlockSizeLE;

  if (iso.hasSectors) {
    iso.blockSize = iso.volume.logicalBlockSizeLE + 0x130;
  }

  iso.volume.rootDirectory.files = [];

  offset = iso.volume.rootDirectory.sectorLE * iso.volume.logicalBlockSizeLE;

  let offsetEnd = getAbsoluteOffset(
    iso.volume.rootDirectory.sectorLE * iso.volume.logicalBlockSizeLE +
      iso.volume.rootDirectory.sizeLE,
  );

  if (iso.hasSectors) {
    offset = getAbsoluteOffset(offset);
    offsetEnd -= 0x130;
  }

  while (true) {
    while (getInt(offset, "uint8") === 0x0) {
      offset += 0x1;
    }

    if (offset >= offsetEnd) {
      break;
    }

    offset = getRelativeOffset(offset);

    const headerSize = getInt(offset, "uint8");
    const extendedAttributeHeaderSize = getInt(offset + 0x1, "uint8");
    const sectorLE = getInt(offset + 0x2, "uint32");
    const sectorBE = getInt(offset + 0x6, "uint32", { bigEndian: true });
    const fileSizeLE = getInt(offset + 0xa, "uint32");
    const fileSizeBE = getInt(offset + 0xe, "uint32", { bigEndian: true });
    const dateYear = getInt(offset + 0x12, "uint8");
    const dateMonth = getInt(offset + 0x13, "uint8");
    const dateDay = getInt(offset + 0x14, "uint8");
    const dateHour = getInt(offset + 0x15, "uint8");
    const dateMinutes = getInt(offset + 0x16, "uint8");
    const dateSeconds = getInt(offset + 0x17, "uint8");
    const dateGreenwichOffset = getInt(offset + 0x18, "uint8");
    const flags = getInt(offset + 0x19, "uint8");
    const unitSize = getInt(offset + 0x1a, "uint8");
    const intervalGapSize = getInt(offset + 0x1b, "uint8");
    const volumeSequenceNumberLE = getInt(offset + 0x1c, "uint16");
    const volumeSequenceNumberBE = getInt(offset + 0x1e, "uint16", {
      bigEndian: true,
    });
    const nameLength = getInt(offset + 0x20, "uint8");

    let name = "";

    for (let i = 0x0; i < nameLength; i += 0x1) {
      const charCode = getInt(offset + 0x21 + i, "uint8");

      if (charCode === 0x3b) {
        i = nameLength;
      } else {
        name += String.fromCharCode(charCode);
      }
    }

    // Flags
    // 0: Existence
    // 1: Directory
    // 2: AssociatedFile
    // 3: Record
    // 4: Protection
    // 5: Reserved
    // 6: Reserved
    // 7: Multi-extent

    const isDirectory = extractBit(flags, 1);

    if (!isDirectory) {
      iso.volume.rootDirectory.files.push({
        name,
        offset: getAbsoluteOffset(sectorLE * iso.volume.logicalBlockSizeLE),
        size: fileSizeLE,
      });
    }

    offset += headerSize;
  }

  iso.volume.rootDirectory.files.sort((a, b) => a.offset - b.offset);
}

export function resetIso9660(): void {
  iso = {} as Iso;
}

export function getFile(
  name: string,
): (File & { dataView: DataView }) | undefined {
  const file = iso.volume.rootDirectory.files.find(
    (file) => file.name === name,
  );

  if (file) {
    let data = [];

    let offset = file.offset;

    while (data.length < file.size) {
      offset = getRelativeOffset(offset);

      data.push(getInt(offset, "uint8"));

      offset += 0x1;
    }

    return {
      ...file,
      dataView: new DataView(new Uint8Array(data).buffer),
    };
  }
}

export function getFiles(): File[] {
  return iso.volume.rootDirectory.files;
}
