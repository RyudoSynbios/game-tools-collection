export function isDexDriveHeader(dataView: DataView) {
  const validator = [
    0x31, 0x32, 0x33, 0x2d, 0x34, 0x35, 0x36, 0x2d, 0x53, 0x54, 0x44,
  ];

  return validator.every((hex, index) => {
    if (dataView.getUint8(index) === hex) {
      return true;
    }
  });
}

export function getDexDriveHeaderShift(): number {
  return 0x1540;
}

export function isSrmFile(dataView: DataView) {
  return dataView.byteLength === 0x48800;
}

export function getSrmHeaderShift(format: "eep" | "fla" | "sra"): number {
  switch (format) {
    case "eep":
      return 0x0;
    case "fla":
      return 0x28800;
    case "sra":
      return 0x20800;
  }
}