import { get } from "svelte/store";

import { dataView, gameRegion, gameTemplate } from "$lib/stores";

import { Validator } from "$lib/types";

import { addPadding, getInt, getString, removePadding } from "../bytes";
import { getObjKey, mergeUint8Arrays, numberArrayToString } from "../format";
import { checkValidator } from "../validator";

interface File {
  isUsed: boolean;
  name: string;
  offset: number;
  dataOffset: number;
  size: number;
}

interface MemorySystem {
  type: "external" | "internal";
  paddedValue?: number;
  blockSize: number;
  allocOffset: number;
  headerSize: number;
  files: File[];
}

interface Save {
  file: File;
  offset: number;
}

// Global objects

let memorySystem = {} as MemorySystem;
let memorySystemRaw = new DataView(new ArrayBuffer(0));
let saves: Save[] = [];
let filteredSaves: Save[] = [];

const blockValidator = [...new Array(0x10).fill(0x0)];

const memoryHeaderValidator = [
  0x42, 0x61, 0x63, 0x6b, 0x55, 0x70, 0x52, 0x61, 0x6d, 0x20, 0x46, 0x6f, 0x72,
  0x6d, 0x61, 0x74,
]; // "BackUpRam Format"

export function generateMemorySystem(dataView: DataView): DataView {
  const isPadded = getInt(0x0, "uint8", {}, dataView) !== 0x42;

  memorySystem.headerSize = 0x20;
  memorySystem.files = [];

  if (!checkSaturnValidator(memoryHeaderValidator, 0x0, dataView)) {
    return dataView;
  }

  let headerCount = 0;
  let blockCount = 0;

  for (let i = 0x0; i < dataView.byteLength; i += 0x10) {
    if (checkSaturnValidator(memoryHeaderValidator, i, dataView)) {
      headerCount += 1;
    } else if (
      (isPadded && checkSaturnValidator(blockValidator, i, dataView)) ||
      checkValidator(blockValidator, i, dataView)
    ) {
      blockCount += 1;
    } else {
      break;
    }
  }

  if (headerCount === 4 && blockCount === 4) {
    memorySystem.type = "internal";
    memorySystem.blockSize = 0x40;
  } else if (headerCount === 4 && blockCount === 124) {
    memorySystem.type = "external";
    memorySystem.blockSize = 0x400;
  } else {
    memorySystem.type = "external";
    memorySystem.blockSize = 0x200;
  }

  if (!memorySystem.type) {
    return dataView;
  }

  if (isPadded) {
    memorySystem.paddedValue = getInt(0x0, "uint8", {}, dataView);

    dataView = removePadding(dataView);
  }

  memorySystemRaw = dataView;

  memorySystem.allocOffset = (headerCount + blockCount) * 0x10;

  readFile(dataView, memorySystem.allocOffset);

  return dataView;
}

export function resetMemorySystem(): void {
  memorySystem = {} as MemorySystem;
  memorySystemRaw = new DataView(new ArrayBuffer(0));
  saves = [];
  filteredSaves = [];
}

function readFile(dataView: DataView, offset: number): void {
  const isUsed = getInt(offset, "uint8", {}, dataView) === 0x80;
  const size = getInt(offset + 0x20, "uint16", { bigEndian: true }, dataView);

  if (size === 0x0) {
    return;
  }

  const name = [...Array(0xc).keys()].reduce((string, index) => {
    const char = getInt(offset + 0x4 + index, "uint8", {}, dataView);

    if (char === 0x0) {
      return string;
    }

    return (string += String.fromCharCode(char));
  }, "");

  let dataOffset = offset + 0x22;

  while (true) {
    const int = getInt(dataOffset, "uint16", { bigEndian: true }, dataView);

    dataOffset += 0x2;

    if (dataOffset % memorySystem.blockSize === 0x0) {
      dataOffset += 0x4;
    }

    if (int === 0x0) {
      break;
    }
  }

  let endOffset = dataOffset;

  for (let i = 0x0; i < size; i += 0x1) {
    if (endOffset % memorySystem.blockSize === 0x0) {
      endOffset += 0x4;
      i -= 0x1;
    } else {
      endOffset += 0x1;
    }
  }

  memorySystem.files.push({
    isUsed,
    name,
    offset,
    dataOffset,
    size,
  });

  offset =
    Math.ceil(endOffset / memorySystem.blockSize) * memorySystem.blockSize;

  readFile(dataView, offset);
}

function writeFile(file: File, blob: ArrayBuffer): void {
  const memorySystemRawTmp = new Uint8Array(memorySystemRaw.buffer);

  const header = new Uint8Array(blob.slice(0x0, memorySystem.headerSize));

  memorySystemRawTmp.set(header, file.offset);

  let offset = file.dataOffset;

  let size = memorySystem.headerSize;

  while (size < file.size + memorySystem.headerSize) {
    const end = memorySystem.blockSize - (offset % memorySystem.blockSize);

    const part = new Uint8Array(blob.slice(size, size + end));

    memorySystemRawTmp.set(part, offset);

    offset += end + 0x4;
    size += end;
  }

  memorySystemRaw = new DataView(memorySystemRawTmp.buffer);
}

function checkSaturnValidator(
  validator: number[],
  offset: number,
  dataView: DataView,
): boolean {
  const isValid = checkValidator(validator, offset, dataView);

  const isPaddedValid = validator.every((int, index) => {
    if (
      getInt(offset * 0x2 + 0x1 + index * 0x2, "uint8", {}, dataView) === int
    ) {
      return true;
    }
  });

  return isValid || isPaddedValid;
}

export function isMemorySystem(dataView: DataView): boolean {
  return checkSaturnValidator(memoryHeaderValidator, 0x0, dataView);
}

export function isUnpackedMemorySystem(): boolean {
  return Boolean(memorySystem.type);
}

function getHeader(dataView: DataView, file: File): Uint8Array {
  return new Uint8Array(
    dataView.buffer.slice(file.offset, file.offset + memorySystem.headerSize),
  );
}

export function unpackMemorySystem(dataView: DataView): DataView {
  const $gameTemplate = get(gameTemplate);

  if (isMemorySystem(dataView)) {
    dataView = generateMemorySystem(dataView);

    const uint8Arrays: Uint8Array[] = [];

    let offset = 0x0;

    Object.values($gameTemplate.validator.regions).forEach((condition) => {
      const validator: number[] = Object.values(condition)[0];

      const validatorStringified = numberArrayToString(validator);

      memorySystem.files.forEach((file) => {
        if (file.isUsed && file.name.includes(validatorStringified)) {
          const header = getHeader(dataView, file);

          uint8Arrays.push(header);

          const padding = 0x10 - ((file.size + memorySystem.headerSize) % 0x10);

          const uint8Array = new Uint8Array(file.size + padding);

          let size = 0x0;

          for (let i = file.dataOffset; size < file.size; i += 0x1) {
            if (i % memorySystem.blockSize === 0x0) {
              i += 0x3;
            } else {
              uint8Array[size] = getInt(i, "uint8", {}, dataView);

              if (i >= file.dataOffset) {
                size += 0x1;
              }
            }
          }

          uint8Arrays.push(uint8Array);

          saves.push({ file, offset });

          offset += header.byteLength + uint8Array.byteLength;
        }
      });
    });

    const uint8Array = mergeUint8Arrays(...uint8Arrays);

    return new DataView(uint8Array.buffer);
  }

  return dataView;
}

export function repackMemorySystem(): ArrayBufferLike {
  const $dataView = get(dataView);

  if (isUnpackedMemorySystem()) {
    saves.forEach((save) => {
      const blob = $dataView.buffer.slice(
        save.offset,
        save.offset + save.file.size,
      );

      writeFile(save.file, blob);
    });

    if (memorySystem.paddedValue !== undefined) {
      memorySystemRaw = addPadding(memorySystemRaw, memorySystem.paddedValue);
    }

    return memorySystemRaw.buffer;
  }

  return $dataView.buffer;
}

export function customGetRegions(): string[] {
  const $gameTemplate = get(gameTemplate);

  const regions: string[] = [];

  Object.entries($gameTemplate.validator.regions).forEach(
    ([region, condition]) => {
      const validator = Object.values(condition)[0] as number[];

      if (isUnpackedMemorySystem()) {
        const validatorStringified = numberArrayToString(validator);

        if (
          saves.some((save) => save.file.name.includes(validatorStringified))
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
    .filter((save) => save.file.name.includes(validatorStringified))
    .sort((a, b) => a.file.name.localeCompare(b.file.name));
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

interface Cpk {
  film: Film;
  fdsc: Fdsc;
  stab: Stab;
}

interface Film {
  signature: string;
  length: number;
  formatVersion: string;
}

interface Fdsc {
  signature: string;
  length: number;
  videoCodec: string;
  videoHeight: number;
  videoWidth: number;
  videoBpp: number;
  audioChannels: number;
  audioSamplingResolution: number;
  audioCompression: number;
  audioSamplingFrequency: number;
}

interface Stab {
  signature: string;
  length: number;
  baseFramerate: number;
  sampleTableEntryCount: number;
  sampleTable: SampleEntry[];
}

interface SampleEntry {
  offset: number;
  length: number;
  sampleInfo1: number;
  sampleInfo2: number;
  cvidHeader: {
    flags: number;
    length: number;
    width: number;
    height: number;
    stripCount: number;
  };
}

export function isCpk(dataView: DataView): boolean {
  const validator = [0x46, 0x49, 0x4c, 0x4d]; // "FILM"

  return checkValidator(validator, 0x0, dataView);
}

export function unpackCpk(dataView: DataView): Cpk {
  const cpk = {} as Cpk;

  // Film

  cpk.film = {} as Film;

  cpk.film.signature = getString(0x0, 0x4, "uint8", {}, dataView);
  cpk.film.length = getInt(0x4, "uint32", { bigEndian: true }, dataView);
  cpk.film.formatVersion = getString(0x8, 0x4, "uint8", {}, dataView);

  // FDSC

  cpk.fdsc = {} as Fdsc;

  cpk.fdsc.signature = getString(0x10, 0x4, "uint8", {}, dataView);
  cpk.fdsc.length = getInt(0x14, "uint32", { bigEndian: true }, dataView);
  cpk.fdsc.videoCodec = getString(0x18, 0x4, "uint8", {}, dataView);
  cpk.fdsc.videoHeight = getInt(0x1c, "uint32", { bigEndian: true }, dataView); // prettier-ignore
  cpk.fdsc.videoWidth = getInt(0x20, "uint32", { bigEndian: true }, dataView);
  cpk.fdsc.videoBpp = getInt(0x24, "uint8", {}, dataView);
  cpk.fdsc.audioChannels = getInt(0x25, "uint8", {}, dataView);
  cpk.fdsc.audioSamplingResolution = getInt(0x26, "uint8", {}, dataView);
  cpk.fdsc.audioCompression = getInt(0x27, "uint8", {}, dataView);
  cpk.fdsc.audioSamplingFrequency = getInt(0x28, "uint16", { bigEndian: true }, dataView); // prettier-ignore

  cpk.stab = {} as Stab;

  cpk.stab.signature = getString(0x30, 0x4, "uint8", {}, dataView);
  cpk.stab.length = getInt(0x34, "uint32", { bigEndian: true }, dataView);
  cpk.stab.baseFramerate = getInt(0x38, "uint32", { bigEndian: true }, dataView); // prettier-ignore
  cpk.stab.sampleTableEntryCount = getInt(0x3c, "uint32", { bigEndian: true }, dataView); // prettier-ignore

  cpk.stab.sampleTable = [
    ...Array(cpk.stab.sampleTableEntryCount).keys(),
  ].reduce((entries: SampleEntry[], index) => {
    const offset = cpk.film.length + getInt(0x40 + index * 0x10, "uint32", { bigEndian: true }, dataView); // prettier-ignore
    const length = cpk.film.length + getInt(0x44 + index * 0x10, "uint32", { bigEndian: true }, dataView); // prettier-ignore
    const sampleInfo1 = getInt(0x48 + index * 0x10, "uint32", { bigEndian: true }, dataView); // prettier-ignore
    const sampleInfo2 = getInt(0x4c + index * 0x10, "uint32", { bigEndian: true }, dataView); // prettier-ignore

    entries.push({
      offset,
      length,
      sampleInfo1,
      sampleInfo2,
      cvidHeader: {
        flags: getInt(offset, "uint8", {}, dataView),
        length: getInt(offset + 0x1, "uint24", { bigEndian: true }, dataView),
        width: getInt(offset + 0x4, "uint16", { bigEndian: true }, dataView),
        height: getInt(offset + 0x6, "uint16", { bigEndian: true }, dataView),
        stripCount: getInt(offset + 0x8, "uint16", { bigEndian: true }, dataView), // prettier-ignore
      },
    });

    return entries;
  }, []);

  return cpk;
}
