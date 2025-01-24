import { get } from "svelte/store";

import { dataView, gameRegion, gameTemplate } from "$lib/stores";
import { getInt, getString } from "$lib/utils/bytes";
import {
  getObjKey,
  mergeUint8Arrays,
  numberArrayToString,
} from "$lib/utils/format";

import type { Validator } from "$lib/types";

import { checkValidator } from "../validator";

type Entry = Directory | File;

interface Directory {
  type: "directory";
  name: string;
  headerOffset: number;
  content: Entry[];
}

interface File {
  type: "file";
  name: string;
  headerOffset: number;
  size: number;
  startCluster: number;
}

interface MemoryCard {
  superblock: Superblock;
  extras: Extras;
  clusters: Page[][];
  root: Directory[];
}

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

interface Page {
  entryMode: number;
  entryLength: number;
  entryCreated: {
    seconds: number;
    minutes: number;
    hours: number;
    day: number;
    month: number;
    year: number;
  };
  entryCluster: number;
  entryDirEntry: number;
  entryModified: {
    seconds: number;
    minutes: number;
    hours: number;
    day: number;
    month: number;
    year: number;
  };
  entryAttr: number;
  entryName: string;
}

interface Extras {
  eccEnabled: boolean;
  eccLength: number;
  allocOffset: number;
  clusterLength: number;
}

interface Save {
  directory: Directory;
  offset: number;
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

// Global objects

let memoryCard = {} as MemoryCard;
let memoryCardRaw = new DataView(new ArrayBuffer(0));
let saves: Save[] = [];
let filteredSaves: Save[] = [];

// Source from http://www.csclub.uwaterloo.ca:11068/mymc/ps2mcfs.html
export function generateMemoryCard(dataView: DataView): void {
  memoryCardRaw = dataView;

  // Superblock

  memoryCard.superblock = {} as Superblock;

  memoryCard.superblock.magic = getString(0x0, 0x28, "uint8", { zeroTerminated: true }, dataView);
  memoryCard.superblock.pageLength = getInt(0x28, "uint16", {}, dataView);
  memoryCard.superblock.pagesPerCluster = getInt(0x2a, "uint16", {}, dataView);
  memoryCard.superblock.pagesPerBlock = getInt(0x2c, "uint16", {}, dataView);
  memoryCard.superblock.clustersPerCard = getInt(0x30, "uint32", {}, dataView);
  memoryCard.superblock.allocOffset = getInt(0x34, "uint32", {}, dataView);
  memoryCard.superblock.allocEnd = getInt(0x38, "uint32", {}, dataView);
  memoryCard.superblock.rootdirCluster = getInt(0x3c, "uint32", {}, dataView);
  memoryCard.superblock.backupBlock1 = getInt(0x40, "uint32", {}, dataView);
  memoryCard.superblock.backupBlock2 = getInt(0x44, "uint32", {}, dataView);

  memoryCard.superblock.ifcList = [...Array(0x20).keys()].reduce(
    (ifc: number[], index) => {
      ifc.push(getInt(0x50 + index * 4, "uint32", {}, dataView));
      return ifc;
    },
    [],
  );

  memoryCard.superblock.badBlockList = [...Array(0x20).keys()].reduce(
    (badBlockList: number[], index) => {
      badBlockList.push(getInt(0xd0 + index * 4, "uint32", {}, dataView));
      return badBlockList;
    },
    [],
  );

  memoryCard.superblock.cardType = getInt(0x150, "uint8", {}, dataView);
  memoryCard.superblock.cardFlags = getInt(0x151, "uint8", {}, dataView);

  // Extras

  memoryCard.extras = {} as Extras;

  memoryCard.extras.eccEnabled = Boolean(memoryCard.superblock.cardFlags & 0x1);
  memoryCard.extras.eccLength = memoryCard.extras.eccEnabled ? 0x10 : 0x0;

  memoryCard.extras.clusterLength =
    (memoryCard.superblock.pageLength + memoryCard.extras.eccLength) *
    memoryCard.superblock.pagesPerCluster;

  memoryCard.extras.allocOffset =
    memoryCard.superblock.allocOffset * memoryCard.extras.clusterLength;

  // Clusters

  memoryCard.clusters = [];

  for (let i = 0x0; i < memoryCard.superblock.allocEnd; i += 0x1) {
    for (let j = 0x0; j < memoryCard.superblock.pagesPerCluster; j += 0x1) {
      const pageOffset =
        memoryCard.extras.allocOffset +
        i * memoryCard.extras.clusterLength +
        j * memoryCard.superblock.pageLength +
        j * memoryCard.extras.eccLength;

      const page = {} as Page;

      page.entryMode = getInt(pageOffset, "uint16", {}, dataView);
      page.entryLength = getInt(pageOffset + 0x4, "uint32", {}, dataView);

      page.entryCreated = {
        seconds: getInt(pageOffset + 0x8 + 0x1, "uint8", {}, dataView),
        minutes: getInt(pageOffset + 0x8 + 0x2, "uint8", {}, dataView),
        hours: getInt(pageOffset + 0x8 + 0x3, "uint8", {}, dataView),
        day: getInt(pageOffset + 0x8 + 0x4, "uint8", {}, dataView),
        month: getInt(pageOffset + 0x8 + 0x5, "uint8", {}, dataView),
        year: getInt(pageOffset + 0x8 + 0x6, "uint16", {}, dataView),
      };

      page.entryCluster = getInt(pageOffset + 0x10, "uint32", {}, dataView);
      page.entryDirEntry = getInt(pageOffset + 0x14, "uint32", {}, dataView);

      page.entryModified = {
        seconds: getInt(pageOffset + 0x18 + 0x1, "uint8", {}, dataView),
        minutes: getInt(pageOffset + 0x18 + 0x2, "uint8", {}, dataView),
        hours: getInt(pageOffset + 0x18 + 0x3, "uint8", {}, dataView),
        day: getInt(pageOffset + 0x18 + 0x4, "uint8", {}, dataView),
        month: getInt(pageOffset + 0x18 + 0x5, "uint8", {}, dataView),
        year: getInt(pageOffset + 0x18 + 0x6, "uint16", {}, dataView),
      };

      page.entryAttr = getInt(pageOffset + 0x20, "uint32", {}, dataView);

      page.entryName = [...Array(0x20).keys()].reduce((string, index) => {
        const char = getInt(pageOffset + 0x40 + index, "uint8", {}, dataView);

        if (char === 0x0) {
          return string;
        }

        return (string += String.fromCharCode(char));
      }, "");

      if (j === 0x0) {
        memoryCard.clusters.push([page]);
      } else {
        memoryCard.clusters[memoryCard.clusters.length - 1].push(page);
      }
    }
  }

  // Root

  memoryCard.root = [];

  readDirectory(dataView, 0x0, 0, memoryCard.root);
}

export function resetMemoryCard(): void {
  memoryCard = {} as MemoryCard;
  memoryCardRaw = new DataView(new ArrayBuffer(0));
  saves = [];
  filteredSaves = [];
}

function getDirectories(name: string, isPartial = false): Directory[] {
  return memoryCard.root.filter(
    (directory) =>
      directory.name === name || (isPartial && directory.name.includes(name)),
  );
}

function getFile(
  directory: Directory,
  name: string,
  isPartial = false,
): File | undefined {
  return directory.content.find(
    (file) => file.name === name || (isPartial && file.name.includes(name)),
  ) as File;
}

function getNextClusterIndex(dataView: DataView, clusterIndex: number): number {
  const indirectClusterTable = memoryCard.superblock.ifcList[0];

  const fatIndex = getInt(
    indirectClusterTable * memoryCard.extras.clusterLength,
    "uint32",
    undefined,
    dataView,
  );

  const offset = fatIndex * memoryCard.extras.clusterLength;
  const clustersPerPage = memoryCard.superblock.pageLength / 4;
  const eccRowsCount = Math.floor(clusterIndex / clustersPerPage);
  const clusterOffset =
    offset + clusterIndex * 0x4 + eccRowsCount * memoryCard.extras.eccLength;

  return getInt(clusterOffset, "uint32", {}, dataView);
}

function readDirectory(
  dataView: DataView,
  clusterIndex: number,
  length: number,
  parentDirectory: Entry[],
): void {
  const cluster = memoryCard.clusters[clusterIndex];

  for (let i = 0x0; i < memoryCard.superblock.pagesPerCluster; i += 0x1) {
    const page = cluster[i];

    const pageIndex = clusterIndex * memoryCard.superblock.pagesPerCluster + i;

    const headerOffset =
      pageIndex * memoryCard.superblock.pageLength +
      pageIndex * memoryCard.extras.eccLength;

    if (length === 0) {
      length = page.entryLength;
    }

    const isFile = page.entryMode & 0x10;
    const isDirectory = page.entryMode & 0x20;
    // const isUsed = page.entryMode & 0x8000;

    if (isDirectory) {
      const directory = {
        type: "directory",
        name: page.entryName,
        headerOffset,
        content: [],
      } as Directory;

      if (page.entryCluster > 0) {
        readDirectory(
          dataView,
          page.entryCluster,
          page.entryLength,
          directory.content,
        );
      }

      parentDirectory.push(directory);
    } else if (isFile) {
      const file = {
        type: "file",
        name: page.entryName,
        headerOffset,
        size: page.entryLength,
        startCluster: page.entryCluster,
      } as File;

      parentDirectory.push(file);
    }

    if (parentDirectory.length === length) {
      break;
    }
  }

  clusterIndex = getNextClusterIndex(dataView, clusterIndex);

  const isClusterAllocated = clusterIndex & 0x80000000;

  if (
    clusterIndex === 0x7fffffff ||
    clusterIndex === 0xffffffff ||
    !isClusterAllocated
  ) {
    return;
  }

  clusterIndex &= 0x7fffffff;

  readDirectory(dataView, clusterIndex, length, parentDirectory);
}

function readFile(
  dataView: DataView,
  file: File,
  clusterSize = false,
): Uint8Array {
  const uint8Arrays: Uint8Array[] = [];

  let fileSize = 0x0;

  let nextClusterIndex = file.startCluster;

  while (true) {
    const clusterIndex = nextClusterIndex;

    const clusterOffset =
      (memoryCard.superblock.allocOffset + clusterIndex) *
      memoryCard.extras.clusterLength;

    for (let i = 0x0; i < memoryCard.superblock.pagesPerCluster; i += 0x1) {
      const pageOffset =
        clusterOffset +
        i * memoryCard.superblock.pageLength +
        i * memoryCard.extras.eccLength;

      let max = Math.min(
        memoryCard.superblock.pageLength,
        file.size - fileSize,
      );

      if (clusterSize) {
        max = memoryCard.superblock.pageLength;
      }

      const part = new Uint8Array(
        dataView.buffer.slice(pageOffset, pageOffset + max),
      );

      uint8Arrays.push(part);

      fileSize += part.byteLength;
    }

    nextClusterIndex = getNextClusterIndex(dataView, clusterIndex);

    if (nextClusterIndex === 0xffffffff) {
      break;
    }

    nextClusterIndex &= 0x7fffffff;
  }

  return mergeUint8Arrays(...uint8Arrays);
}

// Adapted from https://github.com/ps2dev/mymc/blob/db5d9e1c141cbbc4ba4e374f73a0518a8d75b7ef/ps2mc_ecc.py
function generateEcc(table: Uint8Array): number[] {
  let column_parity = 0x77;
  let line_parity_0 = 0x7f;
  let line_parity_1 = 0x7f;

  table.forEach((int, index) => {
    column_parity ^= columnParityMasks[int];

    if (parityTable[int]) {
      line_parity_0 ^= ~index;
      line_parity_1 ^= index;
    }
  });

  return [column_parity, line_parity_0 & 0x7f, line_parity_1];
}

function writeFile(file: File, blob: ArrayBuffer): void {
  const memoryCardRawTmp = new Uint8Array(memoryCardRaw.buffer);

  let fileSize = 0x0;

  let nextClusterIndex = file.startCluster;

  while (true) {
    const clusterIndex = nextClusterIndex;

    const clusterOffset =
      (memoryCard.superblock.allocOffset + clusterIndex) *
      memoryCard.extras.clusterLength;

    for (let i = 0x0; i < memoryCard.superblock.pagesPerCluster; i += 0x1) {
      const pageOffset =
        clusterOffset +
        i * memoryCard.superblock.pageLength +
        i * memoryCard.extras.eccLength;

      const max = Math.min(
        memoryCard.superblock.pageLength,
        file.size - fileSize,
      );

      const part = new Uint8Array(blob.slice(fileSize, fileSize + max));

      memoryCardRawTmp.set(part, pageOffset);

      if (memoryCard.extras.eccEnabled) {
        const eccOffset = pageOffset + memoryCard.superblock.pageLength;

        for (let j = 0x0; j < 0x4; j += 0x1) {
          const table = part.slice(j * 0x80, (j + 0x1) * 0x80);

          const ecc = generateEcc(table);

          memoryCardRawTmp.set(ecc, eccOffset + j * 0x3);
        }
      }

      fileSize += part.byteLength;
    }

    nextClusterIndex = getNextClusterIndex(memoryCardRaw, clusterIndex);

    if (nextClusterIndex === 0xffffffff) {
      break;
    }

    nextClusterIndex &= 0x7fffffff;
  }

  memoryCardRaw = new DataView(memoryCardRawTmp.buffer);
}

export function isMemoryCard(dataView: DataView): boolean {
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

export function isUnpackedMemoryCard(): boolean {
  return Boolean(memoryCard.superblock);
}

function getHeader(dataView: DataView, entry: Entry): Uint8Array {
  const offset = memoryCard.extras.allocOffset + entry.headerOffset;

  return new Uint8Array(
    dataView.buffer.slice(offset, offset + memoryCard.superblock.pageLength),
  );
}

export function unpackMemoryCard(dataView: DataView): DataView {
  const $gameTemplate = get(gameTemplate);

  if (isMemoryCard(dataView)) {
    generateMemoryCard(dataView);

    const uint8Arrays: Uint8Array[] = [];

    let offset = 0x0;

    Object.values($gameTemplate.validator.regions).forEach((condition) => {
      const validator: number[] = Object.values(condition)[0];

      const validatorStringified = numberArrayToString(validator);

      const directories = getDirectories(validatorStringified, true);

      directories.forEach((directory) => {
        const fileInfos = getFile(directory, validatorStringified, true);

        if (fileInfos) {
          const header = getHeader(dataView, directory);

          uint8Arrays.push(header);

          let offsetTmp = memoryCard.superblock.pageLength;

          directory.content.forEach((entry) => {
            const header = getHeader(dataView, entry);

            uint8Arrays.push(header);

            offsetTmp += memoryCard.superblock.pageLength;

            if (entry.type === "file") {
              const file = readFile(dataView, entry, true);

              uint8Arrays.push(file);

              offsetTmp += uint8Arrays[uint8Arrays.length - 1].byteLength;
            }
          });

          saves.push({ directory, offset });

          offset += offsetTmp;
        }
      });
    });

    const uint8Array = mergeUint8Arrays(...uint8Arrays);

    return new DataView(uint8Array.buffer);
  }

  return dataView;
}

function getFileSizeOnMemoryCard(size: number): number {
  const pages = Math.ceil(size / memoryCard.superblock.pageLength);

  return pages * memoryCard.superblock.pageLength;
}

export function repackMemoryCard(): ArrayBufferLike {
  const $dataView = get(dataView);

  if (isUnpackedMemoryCard()) {
    saves.forEach((save) => {
      let offset = save.offset + memoryCard.superblock.pageLength;

      save.directory.content.forEach((entry) => {
        offset += memoryCard.superblock.pageLength;

        if (entry.type === "file") {
          const fileSizeOnMemoryCard = getFileSizeOnMemoryCard(entry.size);

          const blob = $dataView.buffer.slice(
            offset,
            offset + fileSizeOnMemoryCard,
          );

          writeFile(entry, blob);

          offset += fileSizeOnMemoryCard;
        }
      });
    });

    return memoryCardRaw.buffer;
  }

  return $dataView.buffer;
}

export function customGetRegions(): string[] {
  const $gameTemplate = get(gameTemplate);

  const regions: string[] = [];

  Object.entries($gameTemplate.validator.regions).forEach(
    ([region, condition]) => {
      const validator = Object.values(condition)[0] as number[];

      if (isUnpackedMemoryCard()) {
        const validatorStringified = numberArrayToString(validator);

        if (
          saves.some((save) =>
            save.directory.name.includes(validatorStringified),
          )
        ) {
          regions.push(region);
        }
      }
    },
  );

  return regions;
}

export function generateFilteredSaves(): void {
  const $gameRegion = get(gameRegion);
  const $gameTemplate = get(gameTemplate);

  const region = $gameTemplate.validator.regions[
    getObjKey($gameTemplate.validator.regions, $gameRegion)
  ] as Validator;

  const validator = region[0];

  const validatorStringified = numberArrayToString(validator);

  filteredSaves = saves
    .filter((save) => save.directory.name.includes(validatorStringified))
    .sort((a, b) => a.directory.name.localeCompare(b.directory.name));
}

export function getSaves(): Save[] {
  if (filteredSaves.length === 0) {
    generateFilteredSaves();
  }

  return filteredSaves;
}

export function getSlotShifts(index: number): [boolean, number[] | undefined] {
  const saves = getSaves();

  if (saves[index]) {
    return [true, [saves[index].offset]];
  }

  return [true, [-1]];
}
