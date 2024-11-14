import { get } from "svelte/store";

import { fileHeaderShift, gameRegion, gameTemplate } from "$lib/stores";
import { getInt } from "$lib/utils/bytes";
import { getObjKey } from "$lib/utils/format";
import { checkValidator, getRegions } from "$lib/utils/validator";

import type { RegionValidator, Validator } from "$lib/types";

export function isMemoryCard(dataView: DataView, shift = 0x0): boolean {
  const validator = [0x4d, 0x43]; // "MC"
  if (
    dataView.byteLength >= 0x20000 &&
    checkValidator(validator, shift, dataView)
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
  return 0xf40;
}

export function isPsvHeader(dataView?: DataView): boolean {
  const validator = [0x0, 0x56, 0x53, 0x50, 0x0]; // " VSP "

  return checkValidator(validator, 0x0, dataView);
}

export function getPsvHeaderShift(): number {
  return 0x84;
}

export function isVmpHeader(dataView: DataView): boolean {
  const validator = [0x0, 0x50, 0x4d, 0x56, 0x80]; // " PMV."

  return checkValidator(validator, 0x0, dataView);
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
      } else if (isMemoryCard(dataView, shift)) {
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
  leadingZeros = 0,
): [boolean, number[] | undefined] {
  const $fileHeaderShift = get(fileHeaderShift);
  const $gameRegion = get(gameRegion);
  const $gameTemplate = get(gameTemplate);

  const region = $gameTemplate.validator.regions[
    getObjKey($gameTemplate.validator.regions, $gameRegion)
  ] as Validator;

  let validator = region[0];

  if (order === "correspondance") {
    if (index > 9 || leadingZeros > 0) {
      validator = [...validator, 0x30 + Math.floor(index / 10)];
    }

    validator = [...validator, 0x30 + (index % 10)];
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

    if (
      checkValidator(validator, offset + 0xa) &&
      getInt(offset, "uint8") === 0x51
    ) {
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
