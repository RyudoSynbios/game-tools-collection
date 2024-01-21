import { getInt } from "$lib/utils/bytes";

export function isGameSharkHeader(dataView: DataView) {
  const validator = [
    0xd, 0x0, 0x0, 0x0, 0x53, 0x68, 0x61, 0x72, 0x6b, 0x50, 0x6f, 0x72, 0x74,
    0x53, 0x61, 0x76, 0x65,
  ];

  return validator.every((hex, index) => {
    if (getInt(index, "uint8", {}, dataView) === hex) {
      return true;
    }
  });
}

export function getGameSharkHeaderShift(dataView: DataView): number {
  let shift = 0x0;

  for (let i = 0; i < 6; i += 1) {
    const length = getInt(shift, "uint16", {}, dataView);

    shift += 0x4 + length;
  }

  return shift;
}

export function retrieveHeaderShift(dataView: DataView): number {
  if (isGameSharkHeader(dataView)) {
    return getGameSharkHeaderShift(dataView);
  }

  return 0x0;
}
