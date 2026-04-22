import Long from "long";

import { byteswap, getDataView, getInt } from "$lib/utils/bytes";

import type { ItemChecksum } from "$lib/types";

import { DEX_DRIVE_HEADER_SIZE, isDexDriveFile } from "./dexDrive";
import { isMpk } from "./mpk";
import { Format, getSrmFormatOffset, getSrmFormatSize, isSrm } from "./srm";

export function getHeaderShift(dataView: DataView, format: Format): number {
  if (isSrm(dataView)) {
    return getSrmFormatOffset(format);
  } else if (isDexDriveFile(dataView)) {
    return DEX_DRIVE_HEADER_SIZE;
  }

  return 0x0;
}

export function byteswapDataView(
  format: Format,
  dataView?: DataView,
): DataView {
  const $dataView = getDataView(dataView);

  if (format === "eep") {
    return $dataView;
  }

  if (isSrm($dataView)) {
    const offset = getSrmFormatOffset(format);
    const size = getSrmFormatSize(format);

    return byteswap($dataView, offset, offset + size);
  } else if (!isMpk($dataView)) {
    return byteswap($dataView);
  }

  return $dataView;
}

function getHash(int: number, polynormal: Long, shift: number): Long {
  const hash1 = polynormal
    .add(long(int).shiftLeft(long(shift).and(long(0xf))))
    .and(long(0x1ffffffff));

  const hash2 = hash1
    .shiftLeft(0x3f)
    .shiftRightUnsigned(0x1f)
    .or(hash1.shiftRightUnsigned(1))
    .xor(hash1.shiftLeft(0x2c).shiftRightUnsigned(0x20));

  return hash2.shiftRightUnsigned(0x14).and(long(0xfff)).xor(hash2);
}

function long(value: number): Long {
  return Long.fromNumber(value);
}

// Adapted from https://github.com/bryc/rare-n64-chksm
export function generateRareChecksum(
  item: ItemChecksum,
  dataView?: DataView,
): [Long, Long] {
  let checksum1 = long(0x0);
  let polynormal = long(0x13108b3c1);
  let shift = 0;

  for (
    let i = item.control.offsetStart;
    i < item.control.offsetEnd;
    i += 0x1, shift += 7
  ) {
    const int = getInt(i, "uint8", {}, dataView);

    polynormal = getHash(int, polynormal, shift);

    checksum1 = checksum1.xor(polynormal);
  }

  let checksum2 = checksum1;

  for (
    let i = item.control.offsetEnd - 1;
    i >= item.control.offsetStart;
    i -= 0x1, shift += 3
  ) {
    const int = getInt(i, "uint8", {}, dataView);

    polynormal = getHash(int, polynormal, shift);

    checksum2 = checksum2.xor(polynormal);
  }

  return [checksum1, checksum2];
}
