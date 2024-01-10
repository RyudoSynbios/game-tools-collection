export function extractGbaGameSharkHeader(
  dataView: DataView,
): [DataView, Uint8Array] {
  if (dataView.getUint16(0x0, true) === 0xd) {
    const validator = [
      0x53, 0x68, 0x61, 0x72, 0x6b, 0x50, 0x6f, 0x72, 0x74, 0x53, 0x61, 0x76,
      0x65,
    ];

    for (let i = 0x0; i < validator.length; i += 0x1) {
      if (dataView.getUint8(i + 0x4) !== validator[i]) {
        return [dataView, new Uint8Array()];
      }
    }

    const array = [];

    let offset = 0x0;

    for (let i = 0; i < 6; i += 1) {
      const length = dataView.getUint16(offset, true);

      for (let j = 0x0; j < 0x4 + length; j += 0x1) {
        array.push(dataView.getUint8(offset + j));
      }

      offset += 0x4 + length;
    }

    const uint8Array = new Uint8Array(dataView.buffer);

    uint8Array.set(uint8Array.slice(array.length));

    return [new DataView(uint8Array.buffer), new Uint8Array(array)];
  }

  return [dataView, new Uint8Array()];
}
