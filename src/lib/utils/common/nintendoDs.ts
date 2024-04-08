import { getInt } from "$lib/utils/bytes";

export function isActionReplayMaxDsHeader(dataView: DataView): boolean {
  const validator = [
    0x41, 0x52, 0x44, 0x53, 0x30, 0x30, 0x30, 0x30, 0x30, 0x30, 0x30, 0x30,
    0x30, 0x30, 0x30, 0x31,
  ];

  return validator.every((hex, index) => {
    if (getInt(index, "uint8", {}, dataView) === hex) {
      return true;
    }
  });
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
