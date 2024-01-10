export function extractN64DexDriveHeader(
  dataView: DataView,
): [DataView, Uint8Array] {
  if (dataView.getUint8(0x0) === 0x31) {
    const validator = [
      0x31, 0x32, 0x33, 0x2d, 0x34, 0x35, 0x36, 0x2d, 0x53, 0x54, 0x44,
    ];

    for (let i = 0x0; i < validator.length; i += 0x1) {
      if (dataView.getUint8(i) !== validator[i]) {
        return [dataView, new Uint8Array()];
      }
    }

    const array = [];

    for (let i = 0x0; i < 0x1540; i += 0x1) {
      array.push(dataView.getUint8(i));
    }

    const uint8Array = new Uint8Array(dataView.buffer);

    uint8Array.set(uint8Array.slice(array.length));

    return [new DataView(uint8Array.buffer), new Uint8Array(array)];
  }

  return [dataView, new Uint8Array()];
}
