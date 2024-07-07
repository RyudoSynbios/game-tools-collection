import { getInt } from "$lib/utils/bytes";

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
