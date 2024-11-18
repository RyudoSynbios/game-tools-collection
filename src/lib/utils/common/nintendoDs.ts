import { ItemChecksum } from "$lib/types";

import { getInt } from "../bytes";
import { formatChecksum } from "../checksum";
import { checkValidator } from "../validator";

export function isActionReplayMaxDsHeader(dataView: DataView): boolean {
  const validator = [
    0x41, 0x52, 0x44, 0x53, 0x30, 0x30, 0x30, 0x30, 0x30, 0x30, 0x30, 0x30,
    0x30, 0x30, 0x30, 0x31,
  ]; // "ARDS000000000001"

  return checkValidator(validator, 0x0, dataView);
}

export function getActionReplayMaxDsHeaderShift(): number {
  return 0x1f4;
}

export function getHeaderShift(dataView: DataView): number {
  if (isActionReplayMaxDsHeader(dataView)) {
    return getActionReplayMaxDsHeaderShift();
  }

  return 0x0;
}

const dataArray = [
  0x0000, 0xcc01, 0xd801, 0x1400, 0xf001, 0x3c00, 0x2800, 0xe401, 0xa001,
  0x6c00, 0x7800, 0xb401, 0x5000, 0x9c01, 0x8801, 0x4400,
];

// Adapted from https://github.com/OpenEmu/DeSmuME-Core/blob/42d926603872451f1a1fb8aef16a2e65acdba76f/src/bios.cpp#L1071
export function generateBiosChecksum(
  item: ItemChecksum,
  salt: number,
  dataView = new DataView(new ArrayBuffer(0)),
): number {
  let checksum = salt;

  for (let i = item.control.offsetStart; i < item.control.offsetEnd; i += 0x2) {
    const int = getInt(i, "uint16", {}, dataView);

    for (let j = 0x0; j < 0x4; j += 0x1) {
      let value = dataArray[checksum & 0xf];

      checksum = (checksum >> 0x4) ^ value;

      const valueTmp = int >> (j * 0x4);

      value = dataArray[valueTmp & 0xf];

      checksum ^= value;
    }
  }

  return formatChecksum(checksum, item.dataType);
}
