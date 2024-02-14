import { get } from "svelte/store";

import { fileHeaderShift, gameRegion, gameTemplate } from "$lib/stores";
import { getInt } from "$lib/utils/bytes";
import { getObjKey } from "$lib/utils/format";
import { getRegions } from "$lib/utils/validator";

import type { RegionValidator, Validator } from "$lib/types";

export function isMcr(dataView: DataView, shift = 0x0): boolean {
  if (
    dataView.byteLength >= 0x20000 &&
    getInt(shift + 0x0, "uint8", {}, dataView) === 0x4d &&
    getInt(shift + 0x1, "uint8", {}, dataView) === 0x43
  ) {
    return true;
  }

  return false;
}

export function isDexDriveHeader(dataView: DataView): boolean {
  const validator = [
    0x31, 0x32, 0x33, 0x2d, 0x34, 0x35, 0x36, 0x2d, 0x53, 0x54, 0x44,
  ];

  return validator.every((hex, index) => {
    if (getInt(index, "uint8", {}, dataView) === hex) {
      return true;
    }
  });
}

export function getDexDriveHeaderShift(): number {
  return 0xf40;
}

export function isPsvHeader(dataView?: DataView): boolean {
  const validator = [0x0, 0x56, 0x53, 0x50, 0x0];

  return validator.every((hex, index) => {
    if (getInt(index, "uint8", {}, dataView) === hex) {
      return true;
    }
  });
}

export function getPsvHeaderShift(): number {
  return 0x84;
}

export function isVmpHeader(dataView: DataView): boolean {
  const validator = [0x0, 0x50, 0x4d, 0x56, 0x80];

  return validator.every((hex, index) => {
    if (getInt(index, "uint8", {}, dataView) === hex) {
      return true;
    }
  });
}

export function getVmpHeaderShift(): number {
  return 0x80;
}

export function getHeaderShift(dataView: DataView): number {
  if (isDexDriveHeader(dataView)) {
    return getDexDriveHeaderShift();
  } else if (isVmpHeader(dataView)) {
    return getVmpHeaderShift();
  }

  return 0x0;
}

export function customGetRegions(dataView: DataView, shift: number): string[] {
  const $gameTemplate = get(gameTemplate);

  const overridedRegions = Object.entries(
    $gameTemplate.validator.regions,
  ).reduce(
    (regions: { [key: string]: RegionValidator }, [region, condition]) => {
      const validator = Object.values(condition)[0];

      if (isPsvHeader(dataView)) {
        regions[region] = { 0x64: validator };
      } else if (isMcr(dataView, shift)) {
        regions[region] = {
          $or: [...Array(15).keys()].map((index) => ({
            [0x8a + index * 0x80]: validator,
          })),
        };
      }
      return regions;
    },
    {},
  );

  return getRegions(dataView, shift, overridedRegions);
}

export function getSlots(
  order: "correspondance" | "memory",
  shifts: number[],
  index: number,
): [boolean, number[] | undefined] {
  const $fileHeaderShift = get(fileHeaderShift);
  const $gameRegion = get(gameRegion);
  const $gameTemplate = get(gameTemplate);

  const region = $gameTemplate.validator.regions[
    getObjKey($gameTemplate.validator.regions, $gameRegion)
  ] as Validator;

  let validator = region[0];

  if (order === "correspondance") {
    validator = [...validator, 0x30, 0x30 + index];
  }

  if (isPsvHeader()) {
    if (index === 0) {
      return [false, undefined];
    } else {
      return [true, [-1]];
    }
  }

  let validCount = 0;

  for (let i = 1; i < 16; i += 1) {
    const offset = $fileHeaderShift + i * 0x80;

    const isValid = validator.every((hex, j) => {
      if (getInt(offset + 0xa + j, "uint8") === hex) {
        return true;
      }
    });

    if (isValid && getInt(offset, "uint8") === 0x51) {
      if (
        order === "correspondance" ||
        (order === "memory" && index === validCount)
      ) {
        return [true, [...shifts, i * 0x2000]];
      }

      validCount += 1;
    }
  }

  return [true, [-1]];
}
