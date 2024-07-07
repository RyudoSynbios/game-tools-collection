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

import type { RegionValidator, Validator } from "$lib/types";

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

  let validator = region[0];

  if (isDexDriveHeader($dataView)) {
    return [...shifts, 0x200];
  }

  for (let i = 0; i < 15; i += 1) {
    const offset = $fileHeaderShift + 0x300 + i * 0x20;

    const isValid = validator.every((hex, j) => {
      if (getInt(offset + j, "uint8") === hex) {
        return true;
      }
    });

    if (isValid) {
      return [...shifts, getInt(offset + 0x7, "uint8") * 0x100];
    }
  }

  return shifts;
}
