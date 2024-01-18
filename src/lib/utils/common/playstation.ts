import { get } from "svelte/store";

import { gameTemplate } from "$lib/stores";
import { getInt } from "$lib/utils/bytes";
import { getRegions } from "$lib/utils/validator";

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

export function isDexDriveHeader(dataView: DataView) {
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

export function isPsvHeader(dataView?: DataView) {
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

export function isVmpHeader(dataView: DataView) {
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

export function customGetRegions(dataView: DataView, shift: number): string[] {
  const $gameTemplate = get(gameTemplate);

  const overridedRegions = Object.entries(
    $gameTemplate.validator.regions,
  ).reduce(
    (
      regions: { [key: string]: { [key: number]: any } },
      [region, condition],
    ) => {
      const validator = Object.values(condition)[0];

      if (isPsvHeader(dataView)) {
        regions[region] = { 0x64: validator };
      } else if (isMcr(dataView, shift)) {
        regions[region] = [
          {
            $or: [...Array(15).keys()].map((index) => ({
              [0x8a + index * 0x80]: validator,
            })),
          },
        ];
      }
      return regions;
    },
    {},
  );

  return getRegions(dataView, shift, overridedRegions);
}
