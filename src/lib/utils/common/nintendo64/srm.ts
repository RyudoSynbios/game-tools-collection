import { getInt } from "$lib/utils/bytes";

const EEP_SIZE = 0x800;
const MPK_SIZE = 0x20000;
const SRA_SIZE = 0x8000;
const FLA_SIZE = 0x20000;

export type Format = "eep" | "fla" | "mpk" | "sra";

export function getSrmFormatOffset(format: Format): number {
  switch (format) {
    case "eep":
      return 0x0;
    case "mpk":
      return EEP_SIZE;
    case "sra":
      return EEP_SIZE + MPK_SIZE;
    case "fla":
      return EEP_SIZE + MPK_SIZE + SRA_SIZE;
  }
}

export function getSrmFormatSize(format: Format): number {
  switch (format) {
    case "eep":
      return EEP_SIZE;
    case "mpk":
      return MPK_SIZE;
    case "sra":
      return SRA_SIZE;
    case "fla":
      return FLA_SIZE;
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
