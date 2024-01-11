export function isGameSharkHeader(dataView: DataView) {
  const validator = [
    0xd, 0x0, 0x0, 0x0, 0x53, 0x68, 0x61, 0x72, 0x6b, 0x50, 0x6f, 0x72, 0x74,
    0x53, 0x61, 0x76, 0x65,
  ];

  return validator.every((hex, index) => {
    if (dataView.getUint8(index) === hex) {
      return true;
    }
  });
}

export function getGameSharkHeaderShift(dataView: DataView): number {
  let shift = 0x0;

  for (let i = 0; i < 6; i += 1) {
    const length = dataView.getUint16(shift, true);

    shift += 0x4 + length;
  }

  return shift;
}
