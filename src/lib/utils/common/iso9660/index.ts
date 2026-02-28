import { get } from "svelte/store";

import { gameTemplate } from "$lib/stores";

import { RegionValidator } from "$lib/types";

import { extractBit, getInt, getString } from "../../bytes";
import debug from "../../debug";
import { getObjKey, mergeUint8Arrays } from "../../format";
import { checkValidator, getRegions, reduceConditions } from "../../validator";
import { generateEcc } from "./ecc";

export type Entry = Directory | File;

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
  sectorLE: number;
  sizeLE: number;
  root: Entry[];
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

export interface Directory {
  index: number;
  type: "directory";
  path: string;
  name: string;
  content: Entry[];
}

export interface File {
  index: number;
  type: "file";
  path: string;
  name: string;
  sector: number;
  offset: number;
  size: number;
  dataView: DataView;
  isDirty: boolean;
}

interface Options {
  hideWorkingDirectories: boolean;
}

const SECTOR_HEADER_SIZE = 0x10;
const SECTOR_XA_HEADER_SIZE = 0x8;
const LOGICAL_BLOCK_SIZE = 0x800;
const ECC_SIZE = 0x120;
const BLOCK_SIZE = SECTOR_HEADER_SIZE + LOGICAL_BLOCK_SIZE + ECC_SIZE;

// Source from https://wiki.osdev.org/ISO_9660
export default class Iso9660 {
  private dataView: DataView;
  private hasSectors: boolean;
  private hasXaSubheader: boolean;
  private sectorHeaderSize: number;
  private sectorXaHeaderSize: number;
  private blockSize: number;
  private eccSize: number;
  private volume: Volume;
  private options: Options;

  constructor(dataView: DataView, options?: Options) {
    this.dataView = dataView;
    this.hasSectors = hasSectors(this.dataView);
    this.hasXaSubheader = hasXaSubheader(this.dataView);
    this.sectorXaHeaderSize = this.hasXaSubheader ? SECTOR_XA_HEADER_SIZE : 0x0;
    this.sectorHeaderSize = this.hasSectors
      ? SECTOR_HEADER_SIZE + this.sectorXaHeaderSize
      : 0x0;
    this.eccSize = this.hasSectors ? ECC_SIZE - this.sectorXaHeaderSize : 0x0;
    this.blockSize = this.sectorHeaderSize + LOGICAL_BLOCK_SIZE + this.eccSize;
    this.volume = {} as Volume;
    this.options = {
      hideWorkingDirectories: options?.hideWorkingDirectories || false,
    };

    if (!isIso9660Valid(dataView)) {
      debug.error("Not a ISO9660 valid file.");
      return;
    }

    this.init();
  }

  get root() {
    return this.volume.root;
  }

  private init() {
    let offset = this.getSectorOffset(0x10);

    this.volume.type = getInt(offset, "uint8", {}, this.dataView); // prettier-ignore
    this.volume.identifier = getString(offset + 0x1, 0x5, "uint8", {}, this.dataView).trim(); // prettier-ignore
    this.volume.version = getInt(offset + 0x6, "uint8", {}, this.dataView); // prettier-ignore
    this.volume.systemId = getString(offset + 0x8, 0x20, "uint8", {}, this.dataView).trim(); // prettier-ignore
    this.volume.volumeId = getString(offset + 0x28, 0x20, "uint8", {}, this.dataView).trim(); // prettier-ignore
    this.volume.spaceSizeLE = getInt(offset + 0x50, "uint32", {}, this.dataView); // prettier-ignore
    this.volume.spaceSizeBE = getInt(offset + 0x54, "uint32", { bigEndian: true }, this.dataView); // prettier-ignore
    this.volume.setSizeLE = getInt(offset + 0x78, "uint16", {}, this.dataView); // prettier-ignore
    this.volume.setSizeBE = getInt(offset + 0x7a, "uint16", { bigEndian: true }, this.dataView); // prettier-ignore
    this.volume.sequenceNumberLE = getInt(offset + 0x7c, "uint16", {}, this.dataView); // prettier-ignore
    this.volume.sequenceNumberBE = getInt(offset + 0x7e, "uint16", { bigEndian: true }, this.dataView); // prettier-ignore
    this.volume.logicalBlockSizeLE = getInt(offset + 0x80, "uint16", {}, this.dataView); // prettier-ignore
    this.volume.logicalBlockSizeBE = getInt(offset + 0x82, "uint16", { bigEndian: true }, this.dataView); // prettier-ignore
    this.volume.pathTableSizeLE = getInt(offset + 0x84, "uint32", {}, this.dataView); // prettier-ignore
    this.volume.pathTableSizeBE = getInt(offset + 0x88, "uint32", { bigEndian: true }, this.dataView); // prettier-ignore
    this.volume.pathLBATableLE = getInt(offset + 0x8c, "uint32", {}, this.dataView); // prettier-ignore
    this.volume.optionalPathLBATableLE = getInt(offset + 0x90, "uint32", {}, this.dataView); // prettier-ignore
    this.volume.pathLBATableBE = getInt(offset + 0x94, "uint32", { bigEndian: true }, this.dataView); // prettier-ignore
    this.volume.optionalPathLBATableBE = getInt(offset + 0x98, "uint32", { bigEndian: true }, this.dataView); // prettier-ignore
    this.volume.sectorLE = getInt(offset + 0x9e, "uint32", {}, this.dataView); // prettier-ignore
    this.volume.sizeLE = getInt(offset + 0xa6, "uint32", {}, this.dataView); // prettier-ignore
    this.volume.volumeSetIdentifier = getString(offset + 0xbe, 0x80, "uint8", {}, this.dataView).trim(); // prettier-ignore
    this.volume.publisherIdentifier = getString(offset + 0x13e, 0x80, "uint8", {}, this.dataView).trim(); // prettier-ignore
    this.volume.dataPreparerIdentifier = getString(offset + 0x1be, 0x80, "uint8", {}, this.dataView).trim(); // prettier-ignore
    this.volume.applicationIdentifier = getString(offset + 0x23e, 0x80, "uint8", {}, this.dataView).trim(); // prettier-ignore
    this.volume.copyrightIdentifier = getString(offset + 0x2be, 0x25, "uint8", {}, this.dataView).trim(); // prettier-ignore
    this.volume.abstractIdentifier = getString(offset + 0x2e3, 0x25, "uint8", {}, this.dataView).trim(); // prettier-ignore
    this.volume.bibliographicIdentifier = getString(offset + 0x308, 0x25, "uint8", {}, this.dataView).trim(); // prettier-ignore
    this.volume.createdAt = getString(offset + 0x32d, 0x11, "uint8", {}, this.dataView); // prettier-ignore
    this.volume.updatedAt = getString(offset + 0x33e, 0x11, "uint8", {}, this.dataView); // prettier-ignore
    this.volume.expiredAt = getString(offset + 0x34f, 0x11, "uint8", {}, this.dataView); // prettier-ignore
    this.volume.effectiveAt = getString(offset + 0x360, 0x11, "uint8", {}, this.dataView); // prettier-ignore

    this.volume.fileStructureVersion = getInt(offset + 0x371, "uint8", {}, this.dataView); // prettier-ignore

    this.blockSize = this.volume.logicalBlockSizeLE;

    if (this.hasSectors) {
      this.blockSize =
        this.sectorHeaderSize + this.volume.logicalBlockSizeLE + this.eccSize;
    }

    this.volume.root = [];

    this.readDirectory(
      this.volume.sectorLE,
      this.volume.sizeLE,
      "",
      this.volume.root,
    );
  }

  public getBuffer(): ArrayBufferLike {
    return this.dataView.buffer;
  }

  private getSectorOffset(sector: number, addSectorHeaderSize = true): number {
    let offset = sector * this.blockSize;

    if (addSectorHeaderSize) {
      offset += this.sectorHeaderSize;
    }

    return offset;
  }

  private readDirectory(
    sector: number,
    length: number,
    parentPath: string,
    parentDirectory: Entry[],
  ): void {
    const sectorEnd =
      sector + Math.floor(length / this.volume.logicalBlockSizeLE);

    for (let i = sector; i < sectorEnd; i += 1) {
      let offset = this.getSectorOffset(i);

      const offsetEnd = offset + this.volume.logicalBlockSizeLE;

      while (offset < offsetEnd) {
        const headerSize = getInt(offset, "uint8", {}, this.dataView);
        // const extendedAttributeHeaderSize = getInt(offset + 0x1, "uint8", {}, this.dataView);
        const sectorLE = getInt(offset + 0x2, "uint32", {}, this.dataView);
        // const sectorBE = getInt(offset + 0x6, "uint32", { bigEndian: true }, this.dataView);
        const fileSizeLE = getInt(offset + 0xa, "uint32", {}, this.dataView);
        // const fileSizeBE = getInt(offset + 0xe, "uint32", { bigEndian: true }, this.dataView);
        // const dateYear = getInt(offset + 0x12, "uint8", {}, this.dataView);
        // const dateMonth = getInt(offset + 0x13, "uint8", {}, this.dataView);
        // const dateDay = getInt(offset + 0x14, "uint8", {}, this.dataView);
        // const dateHour = getInt(offset + 0x15, "uint8", {}, this.dataView);
        // const dateMinutes = getInt(offset + 0x16, "uint8", {}, this.dataView);
        // const dateSeconds = getInt(offset + 0x17, "uint8", {}, this.dataView);
        // const dateGreenwichOffset = getInt(offset + 0x18, "uint8", {}, this.dataView);
        const flags = getInt(offset + 0x19, "uint8", {}, this.dataView);
        // const unitSize = getInt(offset + 0x1a, "uint8", {}, this.dataView);
        // const intervalGapSize = getInt(offset + 0x1b, "uint8", {}, this.dataView);
        // const volumeSequenceNumberLE = getInt(offset + 0x1c, "uint16", {}, this.dataView);
        // const volumeSequenceNumberBE = getInt(offset + 0x1e, "uint16", {
        //   bigEndian: true,
        // }, this.dataView);
        const nameLength = getInt(offset + 0x20, "uint8", {}, this.dataView);

        let name = "";

        for (let i = 0x0; i < nameLength; i += 0x1) {
          const charCode = getInt(
            offset + 0x21 + i,
            "uint8",
            {},
            this.dataView,
          );

          if (charCode === 0x0) {
            name = ".";
          } else if (charCode === 0x1) {
            name = "..";
          } else if (charCode !== 0x3b) {
            name += String.fromCharCode(charCode);
          } else {
            break;
          }
        }

        let path = name;

        if (parentPath) {
          path = `${parentPath}/${path}`;
        }

        // Flags
        // 0: Existence
        const isDirectory = extractBit(flags, 1);
        // 2: AssociatedFile
        // 3: Record
        // 4: Protection
        // 5: Reserved
        // 6: Reserved
        // 7: Multi-extent

        if (isDirectory) {
          const directory: Directory = {
            index: parentDirectory.length,
            type: "directory",
            path,
            name,
            content: [],
          };

          if (![".", ".."].includes(name)) {
            this.readDirectory(sectorLE, fileSizeLE, path, directory.content);
          }

          if (
            ![".", ".."].includes(name) ||
            !this.options.hideWorkingDirectories
          ) {
            parentDirectory.push(directory);
          }
        } else {
          parentDirectory.push({
            index: parentDirectory.length,
            type: "file",
            path,
            name,
            sector: sectorLE,
            offset: this.getSectorOffset(sectorLE),
            size: fileSizeLE,
            dataView: new DataView(new ArrayBuffer(0)),
            isDirty: false,
          });
        }

        offset += headerSize;

        if (getInt(offset, "uint8", {}, this.dataView) === 0x0) {
          break;
        }
      }
    }

    parentDirectory.sort((a, b) => {
      if (a.type === "directory" && b.type === "file") {
        return -1;
      } else if (a.type === "directory" && b.type === "directory") {
        return a.path.localeCompare(b.path);
      } else if (a.type === "file" && b.type === "directory") {
        return 1;
      } else if (a.type === "file" && b.type === "file") {
        return a.sector - b.sector;
      }

      return 0;
    });
  }

  public getFiles(directory = this.volume.root): File[] {
    return directory.reduce((files: File[], entry) => {
      if (entry.type === "directory") {
        files.push(...this.getFiles(entry.content));
      } else {
        files.push(entry);
      }

      return files;
    }, []);
  }

  public getFile(path: string): File | undefined {
    const file = this.getFiles().find((file) => file.path === path);

    if (file) {
      const dataSrc = new Uint8Array(this.dataView.buffer);
      const dataDst = new Uint8Array(file.size);

      const offset = this.getSectorOffset(file.sector);

      if (this.hasSectors) {
        let offsetSrc = offset;
        let offsetDst = 0x0;

        while (offsetDst < file.size) {
          const offsetEnd =
            offsetSrc +
            Math.min(this.volume.logicalBlockSizeLE, file.size - offsetDst);

          dataDst.set(dataSrc.slice(offsetSrc, offsetEnd), offsetDst);

          offsetSrc += this.blockSize;
          offsetDst += this.volume.logicalBlockSizeLE;
        }
      } else {
        dataDst.set(dataSrc.slice(offset, offset + file.size));
      }

      return {
        ...file,
        dataView: new DataView(dataDst.buffer),
      };
    } else {
      debug.error(`File "${path}" not found.`);
    }
  }

  public writeFile(name: string, dataView: DataView): void {
    const file = this.getFile(name);

    if (file) {
      const dataSrc = new Uint8Array(dataView.buffer);
      const dataDst = new Uint8Array(this.dataView.buffer);

      if (this.hasSectors) {
        let offsetSrc = 0x0;
        let offsetDst = this.getSectorOffset(file.sector, false);

        while (offsetSrc < file.size) {
          const offsetSrcEnd =
            offsetSrc +
            Math.min(this.volume.logicalBlockSizeLE, file.size - offsetSrc);

          const sectorHeader = dataDst.slice(
            offsetDst,
            offsetDst + this.sectorHeaderSize,
          );

          const sectorData = dataSrc.slice(offsetSrc, offsetSrcEnd);

          const sectorEcc = generateEcc(
            mergeUint8Arrays(sectorHeader, sectorData),
          );

          dataDst.set(sectorData, offsetDst + this.sectorHeaderSize);
          dataDst.set(
            sectorEcc,
            offsetDst + this.sectorHeaderSize + this.volume.logicalBlockSizeLE,
          );

          offsetSrc += this.volume.logicalBlockSizeLE;
          offsetDst += this.blockSize;
        }
      } else {
        dataDst.set(dataSrc, this.getSectorOffset(file.sector));
      }

      this.dataView = new DataView(dataDst.buffer);
    } else {
      debug.error(`File "${name}" not found.`);
    }
  }
}

export function customGetRegions(dataView: DataView, shift: number): string[] {
  const $gameTemplate = get(gameTemplate);

  const overridedRegions = Object.entries(
    $gameTemplate.validator.regions,
  ).reduce(
    (regions: { [key: string]: RegionValidator }, [region, conditions]) => {
      const shiftedConditions = reduceConditions(
        conditions,
        (condition: any) => {
          const validator = Object.values(condition)[0];

          let offset = parseInt(getObjKey(condition, 0));

          if (hasSectors(dataView)) {
            offset = getAbsoluteOffset(dataView, offset);
          }

          return { [offset]: validator };
        },
      );

      regions[region] = shiftedConditions;

      return regions;
    },
    {},
  );

  return getRegions(dataView, shift, overridedRegions);
}

function getAbsoluteOffset(
  dataView: DataView,
  offset: number,
  logicalBlockSize = LOGICAL_BLOCK_SIZE,
  blockSize = BLOCK_SIZE,
): number {
  if (hasSectors(dataView)) {
    const sector = Math.floor(offset / logicalBlockSize);
    const shift = offset - sector * logicalBlockSize;

    offset = sector * blockSize + SECTOR_HEADER_SIZE + shift;

    if (hasXaSubheader(dataView)) {
      offset += SECTOR_XA_HEADER_SIZE;
    }
  }

  return offset;
}

export function hasSectors(dataView: DataView): boolean {
  const validator = [
    0x00, 0xff, 0xff, 0xff, 0xff, 0xff, 0xff, 0xff, 0xff, 0xff, 0xff, 0x00,
  ];

  return checkValidator(validator, 0x0, dataView);
}

export function hasXaSubheader(dataView: DataView): boolean {
  if (!hasSectors(dataView)) {
    return false;
  }

  const validator = [0x00, 0x00, 0x08, 0x00, 0x00, 0x00, 0x08, 0x00];

  return checkValidator(validator, 0x10, dataView);
}

export function isIso9660Valid(dataView: DataView): boolean {
  const validator = [0x43, 0x44, 0x30, 0x30, 0x31];

  let offset = 0x8000;

  if (hasSectors(dataView)) {
    offset = getAbsoluteOffset(dataView, offset);
  }

  offset += 0x1;

  return checkValidator(validator, offset, dataView);
}
