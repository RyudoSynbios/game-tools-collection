import { get } from "svelte/store";

import { fileHeaderShift } from "$lib/stores";

import { getInt } from "../bytes";

export function isDexDriveHeader(dataView: DataView) {
  const validator = [
    0x31, 0x32, 0x33, 0x2d, 0x34, 0x35, 0x36, 0x2d, 0x53, 0x54, 0x44,
  ];

  return validator.every((hex, index) => {
    if (dataView.getUint8(index) === hex) {
      return true;
    }
  });
}

export function getDexDriveHeaderShift(): number {
  return 0xf40;
}

export function checkPlaystationSlots(
  index: number,
  validators: number[][],
): boolean {
  const $fileHeaderShift = get(fileHeaderShift);

  const offset = $fileHeaderShift + (index + 1) * 0x80 + 0xa;
  const length = validators[0].length;

  for (let i = offset; i < offset + length; i += 0x1) {
    if (
      validators.every(
        (validator) => getInt(i, "uint8") !== validator[i - offset],
      )
    ) {
      return false;
    }
  }

  if (getInt(offset - 0xa, "uint8") !== 0x51) {
    return false;
  }

  return true;
}