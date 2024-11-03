import Long from "long";
import { get } from "svelte/store";

import {
  dataView,
  fileHeaderShift,
  gameRegion,
  gameTemplate,
} from "$lib/stores";
import { byteswap, getDataView, getInt } from "$lib/utils/bytes";
import { getObjKey } from "$lib/utils/format";
import { checkValidator, getRegions } from "$lib/utils/validator";

import type { ItemChecksum, RegionValidator, Validator } from "$lib/types";

export function isMpk(dataView: DataView, shift = 0x0): boolean {
  const validator = [0x81, 0x1, 0x2, 0x3];

  if (
    isDexDriveHeader(dataView) ||
    (dataView.byteLength >= 0x20000 &&
      checkValidator(validator, shift, dataView))
  ) {
    return true;
  }

  return false;
}

export function isDexDriveHeader(dataView: DataView): boolean {
  const validator = [
    0x31, 0x32, 0x33, 0x2d, 0x34, 0x35, 0x36, 0x2d, 0x53, 0x54, 0x44,
  ]; // "123-456-STD"

  return checkValidator(validator, 0x0, dataView);
}

export function getDexDriveHeaderShift(): number {
  return 0x1340;
}

export function isSrm(dataView: DataView): boolean {
  return dataView.byteLength === 0x48800;
}

export function isSrmSra(dataView: DataView): boolean {
  if (isSrm(dataView) && getInt(0xb00, "uint8", {}, dataView) === 0x0) {
    return true;
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

export function getRegionsFromMpk(dataView: DataView, shift: number): string[] {
  const $gameTemplate = get(gameTemplate);

  let overridedRegions: { [key: string]: RegionValidator } | undefined;

  if (!isDexDriveHeader(dataView)) {
    overridedRegions = Object.entries($gameTemplate.validator.regions).reduce(
      (regions: { [key: string]: RegionValidator }, [region, condition]) => {
        const validator = Object.values(condition)[0];

        regions[region] = {
          $or: [...Array(16).keys()].map((index) => ({
            [0x300 + index * 0x20]: validator,
          })),
        };

        return regions;
      },
      {},
    );
  }

  return getRegions(dataView, shift, overridedRegions);
}

export function getMpkNoteShift(shifts: number[]): number[] {
  const $dataView = get(dataView);
  const $fileHeaderShift = get(fileHeaderShift);
  const $gameRegion = get(gameRegion);
  const $gameTemplate = get(gameTemplate);

  const region = $gameTemplate.validator.regions[
    getObjKey($gameTemplate.validator.regions, $gameRegion)
  ] as Validator;

  const validator = region[0];

  if (isDexDriveHeader($dataView)) {
    return [...shifts, 0x200];
  }

  for (let i = 0; i < 15; i += 1) {
    const offset = $fileHeaderShift + 0x300 + i * 0x20;

    if (checkValidator(validator, offset)) {
      return [...shifts, getInt(offset + 0x7, "uint8") * 0x100];
    }
  }

  return shifts;
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
  dataView = new DataView(new ArrayBuffer(0)),
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
