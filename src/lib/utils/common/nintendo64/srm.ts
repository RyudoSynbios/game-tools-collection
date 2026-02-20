import { getInt } from "$lib/utils/bytes";

import type { SaveFormat } from ".";

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
