import Long from "long";

import { getInt, setInt } from "../../bytes";

export function getTime(offset: number): number {
  const low = getInt(offset, "uint32", { bigEndian: true });
  const high = getInt(offset + 0x4, "uint32", { bigEndian: true });

  const long = new Long(high, low);

  return long.divide(60750000).toNumber();
}

export function setTime(offset: number, value: number): void {
  const long = Long.fromNumber(value).multiply(60750000);

  setInt(offset, "uint32", long.high, { bigEndian: true });
  setInt(offset + 0x4, "uint32", long.low, { bigEndian: true });
}
