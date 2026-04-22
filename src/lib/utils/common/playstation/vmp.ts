import { checkValidator } from "$lib/utils/validator";

export const VMP_HEADER_SIZE = 0x80;

export function isVMPFile(dataView: DataView): boolean {
  const validator = [0x0, 0x50, 0x4d, 0x56, 0x80]; // " PMV."

  return checkValidator(validator, 0x0, dataView);
}
