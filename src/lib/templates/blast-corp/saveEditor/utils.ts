import { getInt, getIntFromArray } from "$lib/utils/bytes";
import { formatChecksum } from "$lib/utils/checksum";
import { getHeaderShift } from "$lib/utils/common/nintendo64";
import {
  getMpkNoteShift,
  getRegionsFromMpk,
  repackMpk,
  resetMpk,
  unpackMpk,
} from "$lib/utils/common/nintendo64/mpk";

import type { Item, ItemChecksum, ItemInt } from "$lib/types";

const SAVE_FORMAT = "mpk";

export function initHeaderShift(dataView: DataView): number {
  return getHeaderShift(dataView, SAVE_FORMAT);
}

export function beforeInitDataView(
  dataView: DataView,
  shift: number,
): DataView {
  return unpackMpk(dataView, shift);
}

export function overrideGetRegions(): string[] {
  return getRegionsFromMpk();
}

export function onInitFailed(): void {
  resetMpk();
}

export function initShifts(): number[] {
  return getMpkNoteShift();
}

export function overrideGetInt(item: Item): [boolean, number | undefined] {
  if ("id" in item && item.id === "progression") {
    const itemInt = item as ItemInt;

    const progression = getInt(itemInt.offset, "uint8");

    if (progression === 0x0) {
      return [true, 0x1];
    }
  } else if ("id" in item && item.id === "levelProgression") {
    const itemInt = item as ItemInt;

    const progression = getInt(itemInt.offset, "uint8");

    if (progression === 0x8) {
      return [true, 0x0];
    }
  }

  return [false, undefined];
}

export function generateChecksum(item: ItemChecksum): number {
  let checksums = [0x0, 0x0, 0x0, 0x0];

  let offset = item.control.offsetStart;
  const length = item.control.offsetEnd - item.control.offsetStart;

  for (let i = 0x0; i < length; i += 0x80) {
    for (let j = 0x0; j < 0x4; j += 0x1) {
      if (offset < item.control.offsetEnd) {
        let int = 0x0;

        for (let k = 0x0; k < 0x21; k += 0x1) {
          for (let bit = 0x7; bit >= 0x0; bit -= 0x1) {
            const xor = (int & 0x80) !== 0x0 ? 0x85 : 0x0;

            int <<= 0x1;

            if (k !== 0x20) {
              int |= getInt(offset, "bit", { bit });
            }

            int = (int ^ xor) & 0xff;
          }

          if (k !== 0x20) {
            offset += 0x1;
          }
        }

        checksums[j] = (checksums[j] + int) & 0xff;
      }
    }
  }

  const checksum = getIntFromArray(checksums, 0x0, "uint32", true);

  return formatChecksum(checksum, item.dataType);
}

export function beforeSaving(): ArrayBufferLike {
  return repackMpk();
}

export function onReset(): void {
  resetMpk();
}
