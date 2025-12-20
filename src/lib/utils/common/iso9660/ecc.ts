// Adapted from https://github.com/chungy/cmdpack/blob/master/cdpatch.c (originally by Neill Corlett)
const BLOCK_SIZE = 0x810;
const ECC_SIZE = 0x120;

const EDC_POLY = 0xd8018001;

const ECC_F_LUT = new Uint8Array(0x100);
const ECC_B_LUT = new Uint8Array(0x100);
const EDC_LUT = new Uint32Array(0x100);

for (let i = 0x0; i < 0x100; i += 0x1) {
  const j = (i << 0x1) ^ (i & 0x80 ? 0x11d : 0x0);

  ECC_F_LUT[i] = j;
  ECC_B_LUT[i ^ j] = i;

  let edc = i;

  for (let j = 0x0; j < 0x8; j += 0x1) {
    edc = (edc >>> 0x1) ^ (edc & 0x1 ? EDC_POLY : 0x0);
  }

  EDC_LUT[i] = edc;
}

export function generateEcc(sector: Uint8Array): Uint8Array {
  const buffer = new Uint8Array(BLOCK_SIZE + ECC_SIZE);

  buffer.set(sector);

  const sectorMode = sector[0xf];

  // Sector Mode
  switch (sectorMode) {
    case 0x1:
      const edc = edcComputeBlock(buffer.slice(0x0, BLOCK_SIZE));
      buffer.set(edc, BLOCK_SIZE);

      generateEccPQ(buffer);
      break;
    case 0x2:
      if ((sector[0x12] & 0x20) === 0x0) {
        // Form 1
        const edc = edcComputeBlock(buffer.slice(0x10, BLOCK_SIZE + 0x8));
        buffer.set(edc, BLOCK_SIZE + 0x8);

        generateEccPQ(buffer, true);
      } else {
        // Form 2
        const edc = edcComputeBlock(buffer.slice(0x10, BLOCK_SIZE + 0x10c));
        buffer.set(edc, BLOCK_SIZE + 0x11c);
      }
      break;
  }

  if (sectorMode === 2) {
    return buffer.slice(BLOCK_SIZE + 0x8);
  }

  return buffer.slice(BLOCK_SIZE);
}

function generateEccPQ(buffer: Uint8Array, zeroAddress = false): Uint8Array {
  const savedAddress = buffer.slice(0xc, 0x10);

  console.log("savedAddress", savedAddress);

  if (zeroAddress) {
    buffer.fill(0x0, 0xc, 0x10);
  }

  // Compute ECC P code
  const eccPCode = eccComputeBlock(buffer, 0x56, 0x18, 0x2, 0x56);
  buffer.set(eccPCode, BLOCK_SIZE + 0xc);

  // Compute ECC Q code
  const eccQCode = eccComputeBlock(buffer, 0x34, 0x2b, 0x56, 0x58);
  buffer.set(eccQCode, BLOCK_SIZE + 0xb8);

  if (zeroAddress) {
    buffer.set(savedAddress, 0xc);
  }

  return buffer;
}

function eccComputeBlock(
  dataSrc: Uint8Array,
  majorCount: number,
  minorCount: number,
  majorMult: number,
  minorInc: number,
): Uint8Array {
  const buffer = new Uint8Array(majorCount * 0x2);

  const size = majorCount * minorCount;

  for (let major = 0x0; major < majorCount; major += 0x1) {
    let index = (major >>> 0x1) * majorMult + (major & 0x1);

    let eccA = 0x0;
    let eccB = 0x0;

    for (let minor = 0x0; minor < minorCount; minor += 0x1) {
      const tmp = dataSrc[0xc + index];

      index += minorInc;

      if (index >= size) {
        index -= size;
      }

      eccA ^= tmp;
      eccB ^= tmp;
      eccA = ECC_F_LUT[eccA];
    }

    eccA = ECC_B_LUT[ECC_F_LUT[eccA] ^ eccB];

    buffer[major] = eccA;
    buffer[major + majorCount] = eccA ^ eccB;
  }

  return buffer;
}

function edcComputeBlock(sectorData: Uint8Array): number[] {
  let crc = 0x0;

  sectorData.forEach((int) => {
    crc = EDC_LUT[(crc ^ int) & 0xff] ^ (crc >>> 0x8);
  });

  const edc = [
    crc & 0xff,
    (crc >> 0x8) & 0xff,
    (crc >> 0x10) & 0xff,
    (crc >> 0x18) & 0xff,
  ];

  return edc;
}
