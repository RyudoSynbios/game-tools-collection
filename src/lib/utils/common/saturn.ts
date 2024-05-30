import { getInt } from "../bytes";

export function isCpk(dataView: DataView): boolean {
  const validator = [0x46, 0x49, 0x4c, 0x4d];

  return validator.every((hex, index) => {
    if (getInt(index, "uint8", {}, dataView) === hex) {
      return true;
    }
  });
}

export function unpackCpk(): any {
  //
}
