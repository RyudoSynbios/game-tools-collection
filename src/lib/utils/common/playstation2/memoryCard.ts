import { get } from "svelte/store";

import { dataView } from "$lib/stores";
import { getInt, getString } from "$lib/utils/bytes";
import debug from "$lib/utils/debug";
import { mergeUint8Arrays, numberArrayToString } from "$lib/utils/format";
import { checkValidator, getPlatformRegions } from "$lib/utils/validator";

import {
  getEntry,
  getEntryType,
  type Directory,
  type Entry,
  type File,
  type Page,
  type Save,
} from ".";

interface Superblock {
  magic: string;
  pageLength: number;
  pagesPerCluster: number;
  pagesPerBlock: number;
  clustersPerCard: number;
  allocOffset: number;
  allocEnd: number;
  rootdirCluster: number;
  backupBlock1: number;
  backupBlock2: number;
  ifcList: number[];
  badBlockList: number[];
  cardType: number;
  cardFlags: number;
}

interface Extras {
  eccEnabled: boolean;
  eccLength: number;
  allocOffset: number;
  pageLength: number;
  clusterLength: number;
}

interface Options {
  hideWorkingDirectories: boolean;
}

// ECC constants

const parityTable = [...Array(256).keys()].map((i) => {
  i = i ^ (i >> 0x1);
  i = i ^ (i >> 0x2);
  i = i ^ (i >> 0x4);

  return i & 1;
});

const cpMasks = [0x55, 0x33, 0x0f, 0x00, 0xaa, 0xcc, 0xf0];

const columnParityMasks = [...Array(256).keys()];

[...Array(256).keys()].map((i) => {
  let mask = 0x0;

  cpMasks.forEach((_, index) => {
    mask |= parityTable[i & cpMasks[index]] << index;
    columnParityMasks[i] = mask;
  });
});

// Source from http://www.csclub.uwaterloo.ca:11068/mymc/ps2mcfs.html
export default class MemoryCard {
  private dataView: DataView;
  private superblock: Superblock;
  private extras: Extras;
  private options: Options;
  private _root: Directory[];
  private _saves: Save[];

  constructor(dataView: DataView, options?: Options) {
    this.dataView = dataView;
    this.superblock = this.generateSuperblock();
    this.extras = this.generateExtras();
    this.options = {
      hideWorkingDirectories: options?.hideWorkingDirectories || false,
    };
    this._root = [];
    this._saves = [];

    if (!isMemoryCardFile(dataView)) {
      debug.error("Not a valid Memory Card file.");
      return;
    }

    this.readDirectory(0x0, 0x0, "", this._root);
  }

  get root() {
    return this._root;
  }

  get saves() {
    return this._saves;
  }

  private generateSuperblock(): Superblock {
    return {
      magic: getString(0x0, 0x28, "uint8", { endCode: 0x0 }, this.dataView),
      pageLength: getInt(0x28, "uint16", {}, this.dataView),
      pagesPerCluster: getInt(0x2a, "uint16", {}, this.dataView),
      pagesPerBlock: getInt(0x2c, "uint16", {}, this.dataView),
      clustersPerCard: getInt(0x30, "uint32", {}, this.dataView),
      allocOffset: getInt(0x34, "uint32", {}, this.dataView),
      allocEnd: getInt(0x38, "uint32", {}, this.dataView),
      rootdirCluster: getInt(0x3c, "uint32", {}, this.dataView),
      backupBlock1: getInt(0x40, "uint32", {}, this.dataView),
      backupBlock2: getInt(0x44, "uint32", {}, this.dataView),
      ifcList: [...Array(0x20).keys()].reduce((ifc: number[], index) => {
        ifc.push(getInt(0x50 + index * 4, "uint32", {}, this.dataView));
        return ifc;
      }, []),
      badBlockList: [...Array(0x20).keys()].reduce(
        (badBlockList: number[], index) => {
          badBlockList.push(
            getInt(0xd0 + index * 4, "uint32", {}, this.dataView),
          );
          return badBlockList;
        },
        [],
      ),
      cardType: getInt(0x150, "uint8", {}, this.dataView),
      cardFlags: getInt(0x151, "uint8", {}, this.dataView),
    };
  }

  private generateExtras(): Extras {
    const eccEnabled = Boolean(this.superblock.cardFlags & 0x1);
    const eccLength = eccEnabled ? 0x10 : 0x0;
    const pageLength = this.superblock.pageLength + eccLength;
    const clusterLength = this.superblock.pagesPerCluster * pageLength;

    return {
      eccEnabled,
      eccLength,
      pageLength,
      clusterLength,
      allocOffset: this.superblock.allocOffset * clusterLength,
    };
  }

  private readDirectory(
    clusterIndex: number,
    length: number,
    parentPath: string,
    parentDirectory: Entry[],
  ): void {
    for (let i = 0x0; i < this.superblock.pagesPerCluster; i += 0x1) {
      const entry = this.getEntry(clusterIndex, i);

      if (entry === null) {
        break;
      }

      let path = entry.name;

      if (parentPath) {
        path = `${parentPath}/${path}`;
      }

      if (length === 0) {
        length = entry.length;
      }

      const entryType = getEntryType(entry.mode);
      const isDeleted = (entry.mode & 0x8000) === 0x0;

      if (
        isDeleted ||
        ([".", ".."].includes(entry.name) &&
          this.options.hideWorkingDirectories)
      ) {
        length -= 1;

        if (parentDirectory.length === length) {
          break;
        }

        continue;
      }

      const pageIndex = clusterIndex * this.superblock.pagesPerCluster + i;

      const headerOffset =
        pageIndex * (this.superblock.pageLength + this.extras.eccLength);

      if (entryType === "directory") {
        const directory: Directory = {
          type: "directory",
          name: entry.name,
          path,
          headerOffset,
          content: [],
        };

        if (entry.startCluster > 0) {
          this.readDirectory(
            entry.startCluster,
            entry.length,
            path,
            directory.content,
          );
        }

        parentDirectory.push(directory);
      } else if (entryType === "file") {
        const file: File = {
          type: "file",
          name: entry.name,
          path,
          headerOffset,
          size: entry.length,
          clusters: [entry.startCluster],
          dataView: new DataView(new ArrayBuffer(0)),
        };

        let nextClusterIndex: number | null = entry.startCluster;

        while (true) {
          nextClusterIndex = this.getNextClusterIndex(nextClusterIndex);

          if (nextClusterIndex === null) {
            break;
          }

          file.clusters.push(nextClusterIndex);
        }

        parentDirectory.push(file);
      }

      if (parentDirectory.length === length) {
        break;
      }
    }

    const nextClusterIndex = this.getNextClusterIndex(clusterIndex);

    if (nextClusterIndex !== null && parentDirectory.length !== length) {
      this.readDirectory(nextClusterIndex, length, parentPath, parentDirectory);
    }
  }

  private getEntry(cluster: number, page: number): Page | null {
    if (
      cluster >= this.superblock.allocEnd ||
      page >= this.superblock.pagesPerCluster
    ) {
      return null;
    }

    const offset =
      this.extras.allocOffset +
      cluster * this.extras.clusterLength +
      page * this.extras.pageLength;

    return getEntry(offset, this.dataView);
  }

  private getHeader(entry: Entry): Uint8Array {
    const offset = this.extras.allocOffset + entry.headerOffset;

    return new Uint8Array(
      this.dataView.buffer.slice(offset, offset + this.superblock.pageLength),
    );
  }

  // prettier-ignore
  private getNextClusterIndex(clusterIndex: number): number | null {
    const indirectClusterTable = this.superblock.ifcList[0];

    const fatIndex = getInt(indirectClusterTable * this.extras.clusterLength, "uint32", {}, this.dataView);

    let offset = fatIndex * this.extras.clusterLength;

    const clustersPerPage = this.superblock.pageLength / 0x4;
    const eccRowsCount = Math.floor(clusterIndex / clustersPerPage);

    offset += clusterIndex * 0x4 + eccRowsCount * this.extras.eccLength;

    let nextClusterIndex = getInt(offset, "uint32", {}, this.dataView);

    const isClusterAllocated = nextClusterIndex & 0x80000000;

    nextClusterIndex &= 0x7fffffff;

    if (nextClusterIndex === 0x7fffffff || !isClusterAllocated) {
      return null;
    }

    return nextClusterIndex;
  }

  // Adapted from https://github.com/ps2dev/mymc/blob/db5d9e1c141cbbc4ba4e374f73a0518a8d75b7ef/ps2mc_ecc.py
  private generateEcc(data: Uint8Array): number[] {
    let columnParity = 0x77;
    let lineParity0 = 0x7f;
    let lineParity1 = 0x7f;

    data.forEach((int, index) => {
      columnParity ^= columnParityMasks[int];

      if (parityTable[int]) {
        lineParity0 ^= ~index;
        lineParity1 ^= index;
      }
    });

    return [columnParity, lineParity0 & 0x7f, lineParity1];
  }

  public isInitialized(): boolean {
    return this._root.length > 0;
  }

  public getFiles(directory: Entry[] = this._root): File[] {
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
    const uint8Arrays: Uint8Array[] = [];

    const file = this.getFiles().find((file) => file.path === path);

    if (file) {
      if (file.dataView.byteLength > 0) {
        return file;
      }

      let fileSize = 0x0;

      file.clusters.forEach((clusterIndex) => {
        const clusterOffset =
          (this.superblock.allocOffset + clusterIndex) *
          this.extras.clusterLength;

        for (let i = 0x0; i < this.superblock.pagesPerCluster; i += 0x1) {
          const pageOffset = clusterOffset + i * this.extras.pageLength;

          const part = new Uint8Array(
            this.dataView.buffer.slice(
              pageOffset,
              pageOffset + this.superblock.pageLength,
            ),
          );

          uint8Arrays.push(part);

          fileSize += part.length;

          if (fileSize >= file.size) {
            break;
          }
        }
      });

      const uint8Array = mergeUint8Arrays(...uint8Arrays);

      file.dataView = new DataView(uint8Array.buffer);

      return file;
    } else {
      debug.error(`File "${path}" not found.`);
    }
  }

  public writeFile(path: string, binary: Uint8Array): void {
    const buffer = new Uint8Array(this.dataView.buffer);

    const file = this.getFile(path);

    if (file) {
      let fileSize = 0x0;

      file.clusters.forEach((clusterIndex) => {
        const clusterOffset =
          (this.superblock.allocOffset + clusterIndex) *
          this.extras.clusterLength;

        for (let i = 0x0; i < this.superblock.pagesPerCluster; i += 0x1) {
          const pageOffset = clusterOffset + i * this.extras.pageLength;

          const part = new Uint8Array(
            binary.slice(fileSize, fileSize + this.superblock.pageLength),
          );

          buffer.set(part, pageOffset);

          if (this.extras.eccEnabled) {
            const eccOffset = pageOffset + this.superblock.pageLength;

            for (let j = 0x0; j < 0x4; j += 0x1) {
              const data = part.slice(j * 0x80, (j + 0x1) * 0x80);

              const ecc = this.generateEcc(data);

              buffer.set(ecc, eccOffset + j * 0x3);
            }
          }

          fileSize += part.length;

          if (fileSize >= file.size) {
            break;
          }
        }
      });

      file.dataView = new DataView(binary.buffer);
      this.dataView = new DataView(buffer.buffer);
    } else {
      debug.error(`File "${path}" not found.`);
    }
  }

  public unpack(): DataView {
    this._saves = [];

    const uint8Arrays: Uint8Array[] = [];

    let offset = 0x0;

    const platformRegions = getPlatformRegions();

    Object.values(platformRegions).forEach((condition) => {
      const validator: number[] = Object.values(condition)[0];

      if (validator) {
        const validatorStringified = numberArrayToString(validator);

        this._root.forEach((directory) => {
          if (directory.name.includes(validatorStringified)) {
            const header = this.getHeader(directory);

            uint8Arrays.push(header);

            offset += header.byteLength;

            directory.content.forEach((entry) => {
              const header = this.getHeader(entry);

              uint8Arrays.push(header);

              offset += header.byteLength;

              if (entry.type === "file") {
                const dataView = this.getFile(entry.path)!.dataView;
                const binary = new Uint8Array(dataView.buffer);

                uint8Arrays.push(binary);

                this._saves.push({ file: entry, offset });

                offset += binary.length;
              }
            });
          }
        });
      }
    });

    const uint8Array = mergeUint8Arrays(...uint8Arrays);

    return new DataView(uint8Array.buffer);
  }

  public repack(): ArrayBufferLike {
    const $dataView = get(dataView);

    this._saves.forEach((save) => {
      const binary = new Uint8Array(
        $dataView.buffer.slice(save.offset, save.offset + save.file.size),
      );

      this.writeFile(save.file.path, binary);
    });

    return this.dataView.buffer;
  }

  public destroy(): void {
    this.dataView = new DataView(new ArrayBuffer(0));
    this.superblock = {} as Superblock;
    this.extras = {} as Extras;
    this._root = [];
    this._saves = [];
  }
}

export function isMemoryCardFile(dataView: DataView): boolean {
  const validator = [
    0x53, 0x6f, 0x6e, 0x79, 0x20, 0x50, 0x53, 0x32, 0x20, 0x4d, 0x65, 0x6d,
    0x6f, 0x72, 0x79, 0x20, 0x43, 0x61, 0x72, 0x64, 0x20, 0x46, 0x6f, 0x72,
    0x6d, 0x61, 0x74, 0x20,
  ]; // "Sony PS2 Memory Card Format "

  if (
    dataView.byteLength >= 0x840000 &&
    checkValidator(validator, 0x0, dataView)
  ) {
    return true;
  }

  return false;
}
