import { checkValidator } from "$lib/utils/validator";

export const DEX_DRIVE_HEADER_SIZE = 0x1040;

export function isDexDriveFile(dataView: DataView): boolean {
  const validator = [
    0x31, 0x32, 0x33, 0x2d, 0x34, 0x35, 0x36, 0x2d, 0x53, 0x54, 0x44,
  ]; // "123-456-STD"

  return checkValidator(validator, 0x0, dataView);
}
