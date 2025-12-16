import Long from "long";
import { get } from "svelte/store";

import { dataView, gameRegion, gameTemplate } from "$lib/stores";
import { byteswap, getDataView, getInt, getString } from "$lib/utils/bytes";
import {
  getObjKey,
  mergeUint8Arrays,
  numberArrayToString,
} from "$lib/utils/format";
import { checkValidator } from "$lib/utils/validator";

import type { DataViewABL, ItemChecksum, Validator } from "$lib/types";

interface Mpk {
  pageLength: number;
  allocOffset: number;
  clustersOffset: number;
  headersOffset: number;
  notes: Note[];
}

interface Note {
  serial: string;
  publisher: string;
  name: string;
  clusters: number[];
  size: number;
}

interface Save {
  note: Note;
  offset: number;
}

export function isDexDriveHeader(dataView: DataView): boolean {
  const validator = [
    0x31, 0x32, 0x33, 0x2d, 0x34, 0x35, 0x36, 0x2d, 0x53, 0x54, 0x44,
  ]; // "123-456-STD"

  return checkValidator(validator, 0x0, dataView);
}

export function getDexDriveHeaderShift(): number {
  return 0x1040;
}

export function isSrm(dataView: DataView): boolean {
  return dataView.byteLength === 0x48800;
}

export function isSrmMpk(dataView: DataView): boolean {
  if (isSrm(dataView)) {
    for (let i = 0x0; i < 0x10; i += 0x1) {
      if (getInt(0xb00 + i * 0x20, "uint8", {}, dataView) !== 0x0) {
        return true;
      }
    }
  }

  return false;
}

type SaveFormat = "eep" | "fla" | "mpk" | "sra";

export function getSrmHeaderShift(format: SaveFormat): number {
  switch (format) {
    case "eep":
      return 0x0;
    case "mpk":
      return 0x800;
    case "sra":
      return 0x20800;
    case "fla":
      return 0x28800;
  }
}

export function getSrmHeaderEnd(format: SaveFormat): number {
  switch (format) {
    case "eep":
      return 0x800;
    case "mpk":
      return 0x20800;
    case "sra":
      return 0x28800;
    case "fla":
      return 0x48800;
  }
}

export function getHeaderShift(dataView: DataView, format: SaveFormat): number {
  if (isSrm(dataView)) {
    return getSrmHeaderShift(format);
  } else if (isDexDriveHeader(dataView)) {
    return getDexDriveHeaderShift();
  }

  return 0x0;
}

export function byteswapDataView(
  format: SaveFormat,
  dataView?: DataView,
): DataView {
  const $dataView = getDataView(dataView);

  if (format === "eep") {
    return $dataView;
  }

  if (isSrm($dataView)) {
    return byteswap(
      $dataView,
      getSrmHeaderShift(format),
      getSrmHeaderEnd(format),
    );
  } else if (!isMpk($dataView)) {
    return byteswap($dataView);
  }

  return $dataView;
}

// Global objects

let mpk = {} as Mpk;
let mpkRaw: DataViewABL = new DataView(new ArrayBuffer(0));
let saves: Save[] = [];

export function generateMpk(dataView: DataView, shift: number): void {
  mpkRaw = dataView;

  mpk.pageLength = 0x100;
  mpk.allocOffset = shift;
  mpk.clustersOffset = mpk.allocOffset + 0x1 * mpk.pageLength;
  mpk.headersOffset = mpk.allocOffset + 0x3 * mpk.pageLength;

  mpk.notes = [];

  pushNote(dataView, mpk.headersOffset);
}

export function resetMpk(): void {
  mpk = {} as Mpk;
  mpkRaw = new DataView(new ArrayBuffer(0));
  saves = [];
}

function pushNote(dataView: DataView, offset: number): void {
  if (offset >= mpk.headersOffset + 0x200) {
    return;
  }

  const serial = getString(offset, 0x4, "uint8", {}, dataView);
  const publisher = getString(offset + 0x4, 0x2, "uint8", {}, dataView);

  let clusterIndex = getInt(offset + 0x6, "uint16", { bigEndian: true }, dataView); // prettier-ignore

  const isUsed = clusterIndex > 0x0;

  if (!isUsed) {
    return pushNote(dataView, offset + 0x20);
  }

  const name = getString(offset + 0x10, 0x10, "uint8", { encoding: "nintendo64Mpk", endCode: 0x0 }, dataView); // prettier-ignore

  const clusters = [clusterIndex];

  let error = false;

  let indexOffset = mpk.clustersOffset + clusterIndex * 0x2;

  while (indexOffset < mpk.clustersOffset + 0x100) {
    clusterIndex = getInt(indexOffset, "uint16", { bigEndian: true }, dataView);

    if (clusterIndex === 0x1) {
      break;
    } else if (clusterIndex === 0x3 || clusterIndex >= 0x80) {
      error = true;
      break;
    }

    clusters.push(clusterIndex);

    indexOffset = mpk.clustersOffset + clusterIndex * 0x2;
  }

  if (!error) {
    mpk.notes.push({
      serial,
      publisher,
      name,
      clusters,
      size: clusters.length * mpk.pageLength,
    });
  }

  pushNote(dataView, offset + 0x20);
}

function readNote(dataView: DataView, note: Note): Uint8Array {
  const uint8Arrays: Uint8Array[] = [];

  note.clusters.forEach((clusterIndex) => {
    const offset = mpk.allocOffset + clusterIndex * mpk.pageLength;

    const part = new Uint8Array(
      dataView.buffer.slice(offset, offset + mpk.pageLength),
    );

    uint8Arrays.push(part);
  });

  return mergeUint8Arrays(...uint8Arrays);
}

function writeNote(note: Note, blob: ArrayBuffer): void {
  const mpkRawTmp = new Uint8Array(mpkRaw.buffer);

  let offset = 0x0;

  note.clusters.forEach((clusterIndex) => {
    const part = new Uint8Array(blob.slice(offset, offset + mpk.pageLength));

    mpkRawTmp.set(part, mpk.allocOffset + clusterIndex * mpk.pageLength);

    offset += part.byteLength;
  });

  mpkRaw = new DataView(mpkRawTmp.buffer);
}

export function isMpk(dataView: DataView, shift = 0x0): boolean {
  let checksum = 0x0;

  const offset = shift + 0x20;

  for (let i = 0x0; i < 0x1c; i += 0x2) {
    checksum += getInt(offset + i, "uint16", { bigEndian: true }, dataView);
  }

  checksum &= 0xffff;

  checksum = (checksum << 0x10) | (0xfff2 - checksum);

  return (
    isDexDriveHeader(dataView) ||
    checksum === getInt(offset + 0x1c, "uint32", { bigEndian: true }, dataView)
  );
}

export function isUnpackedMpk(): boolean {
  return Boolean(mpk.pageLength);
}

export function unpackMpk(dataView: DataView, shift: number): DataView {
  const $gameTemplate = get(gameTemplate);

  if (isMpk(dataView, shift)) {
    generateMpk(dataView, shift);

    const uint8Arrays: Uint8Array[] = [];

    let offset = 0x0;

    Object.values($gameTemplate.validator.regions).forEach((condition) => {
      const validator: number[] = Object.values(condition)[0];

      if (validator) {
        const validatorStringified = numberArrayToString(validator);

        mpk.notes.forEach((note) => {
          if (note.serial.includes(validatorStringified)) {
            const binary = readNote(dataView, note);

            uint8Arrays.push(binary);

            saves.push({ note, offset });

            offset += binary.byteLength;
          }
        });
      }
    });

    const uint8Array = mergeUint8Arrays(...uint8Arrays);

    return new DataView(uint8Array.buffer);
  }

  return dataView;
}

export function repackMpk(): ArrayBufferLike {
  const $dataView = get(dataView);

  if (isUnpackedMpk()) {
    saves.forEach((save) => {
      const blob = $dataView.buffer.slice(
        save.offset,
        save.offset + save.note.size,
      ) as ArrayBuffer;

      writeNote(save.note, blob);
    });

    return mpkRaw.buffer;
  }

  return $dataView.buffer;
}

export function getSaves(): Save[] {
  const $gameRegion = get(gameRegion);
  const $gameTemplate = get(gameTemplate);

  const region = $gameTemplate.validator.regions[
    getObjKey($gameTemplate.validator.regions, $gameRegion)
  ] as Validator;

  const validator = region[0];

  const validatorStringified = numberArrayToString(validator);

  const filteredSaves = saves.filter(
    (save) => save.note.serial === validatorStringified,
  );

  return filteredSaves;
}

export function getRegionsFromMpk(): string[] {
  const $gameTemplate = get(gameTemplate);

  const regions: string[] = [];

  Object.entries($gameTemplate.validator.regions).forEach(
    ([region, condition]) => {
      const validator = Object.values(condition)[0] as number[];

      const validatorStringified = numberArrayToString(validator);

      if (saves.some((save) => save.note.serial === validatorStringified)) {
        regions.push(region);
      }
    },
  );

  return regions;
}

export function getMpkNoteShift(): number[] {
  const $gameRegion = get(gameRegion);
  const $gameTemplate = get(gameTemplate);

  const region = $gameTemplate.validator.regions[
    getObjKey($gameTemplate.validator.regions, $gameRegion)
  ] as Validator;

  const validator = region[0];

  const validatorStringified = numberArrayToString(validator);

  const save = saves.find((save) =>
    save.note.serial.includes(validatorStringified),
  );

  if (save) {
    return [save.offset];
  }

  return [0x0];
}

function getHash(int: number, polynormal: Long, shift: number): Long {
  const hash1 = polynormal
    .add(long(int).shiftLeft(long(shift).and(long(0xf))))
    .and(long(0x1ffffffff));

  const hash2 = hash1
    .shiftLeft(0x3f)
    .shiftRightUnsigned(0x1f)
    .or(hash1.shiftRightUnsigned(1))
    .xor(hash1.shiftLeft(0x2c).shiftRightUnsigned(0x20));

  return hash2.shiftRightUnsigned(0x14).and(long(0xfff)).xor(hash2);
}

function long(value: number): Long {
  return Long.fromNumber(value);
}

// Adapted from https://github.com/bryc/rare-n64-chksm
export function generateRareChecksum(
  item: ItemChecksum,
  dataView: DataViewABL = new DataView(new ArrayBuffer(0)),
): [Long, Long] {
  let checksum1 = long(0x0);
  let polynormal = long(0x13108b3c1);
  let shift = 0;

  for (
    let i = item.control.offsetStart;
    i < item.control.offsetEnd;
    i += 0x1, shift += 7
  ) {
    const int = getInt(i, "uint8", {}, dataView);

    polynormal = getHash(int, polynormal, shift);

    checksum1 = checksum1.xor(polynormal);
  }

  let checksum2 = checksum1;

  for (
    let i = item.control.offsetEnd - 1;
    i >= item.control.offsetStart;
    i -= 0x1, shift += 3
  ) {
    const int = getInt(i, "uint8", {}, dataView);

    polynormal = getHash(int, polynormal, shift);

    checksum2 = checksum2.xor(polynormal);
  }

  return [checksum1, checksum2];
}
