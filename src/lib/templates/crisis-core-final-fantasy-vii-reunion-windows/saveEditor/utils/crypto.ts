import { getIntFromArray, intToArray } from "$lib/utils/bytes";

import { d0, d1, d2, d3, d4, e0, e1, e2, e3, e4 } from "./lookupTable";

// The save file appears to be encrypted with an AES ECB algorithm

const dKey = [
  0x8761b1f9, 0x7d6ea678, 0xe72f14fe, 0x10416982, 0x725158a7, 0x547ed424,
  0x8639d284, 0x44a42a1e, 0xbd9f40a9, 0xc467ef2f, 0x415bac59, 0xf434550d,
  0x5ddcd095, 0x262f8c83, 0xd24706a0, 0xc29df89a, 0x186f6dfc, 0x79f8af86,
  0x853c4376, 0xb56ff954, 0x4f9e73e8, 0x7bf35c16, 0xf4688a23, 0x10dafe3a,
  0xad580e79, 0x6197c27a, 0xfcc4ecf0, 0x3053ba22, 0xa2599748, 0x346d2ffe,
  0x8f9bd635, 0xe4b27419, 0x04e00a9d, 0xcccfcc03, 0x9d532e8a, 0xcc9756d2,
  0x53f05696, 0x9634b8b6, 0xbbf6f9cb, 0x6b29a22c, 0x2af981fe, 0xc82fc69e,
  0x519ce289, 0x51c47858, 0x59be1b1e, 0xc5c4ee20, 0x2dc2417d, 0xd0df5be7,
  0x0eeeca14, 0xe2d64760, 0x99b32417, 0x00589ad1, 0x1e8ecb1a, 0x9c7af53e,
  0xe806af5d, 0xfd1d1a9a, 0x65774b44, 0x72644972, 0x4d634165, 0x774b4472,
];

const eKey = [
  0x65774b44, 0x72644972, 0x4d634165, 0x774b4472, 0x64453353, 0x6652554c,
  0x33534c30, 0x46736134, 0xeb98531e, 0x99fc1a6c, 0xd49f5b09, 0xa3d41f7b,
  0x6e0df372, 0x085fa63e, 0x3b0cea0e, 0x7d7f8b3a, 0x3ba5d3e1, 0xa259c98d,
  0x76c69284, 0xd5128dff, 0x6dc4ae64, 0x659b085a, 0x5e97e254, 0x23e8696e,
  0xa45c4cc7, 0x0605854a, 0x70c317ce, 0xa5d19a31, 0x6bfa16a3, 0x0e611ef9,
  0x50f6fcad, 0x731e95c3, 0xde766248, 0xd873e702, 0xa8b0f0cc, 0x0d616afd,
  0xbc1514f7, 0xb2740a0e, 0xe282f6a3, 0x919c6360, 0x108db2c9, 0xc8fe55cb,
  0x604ea507, 0x6d2fcffa, 0x80009eda, 0x327494d4, 0xd0f66277, 0x416a0117,
  0x32f1424a, 0xfa0f1781, 0x9a41b286, 0xf76e7d7c, 0xe89f61ca, 0xdaebf51e,
  0x0a1d9769, 0x4b77967e, 0x8761b1f9, 0x7d6ea678, 0xe72f14fe, 0x10416982,
];

export function decryptData(cryptedData: Uint8Array): Uint8Array {
  const decryptedData = new Uint8Array(cryptedData.length);

  for (let i = 0x0; i < cryptedData.length / 0x10; i += 0x1) {
    const cryptedBlock = cryptedData.slice(i * 0x10, i * 0x10 + 0x10);

    const decryptedBlock = decryptBlock(cryptedBlock);

    decryptedData.set(decryptedBlock, i * 0x10);
  }

  return decryptedData;
}

function decryptBlock(cryptedData: Uint8Array, rounds = 14): Uint8Array {
  let table = [
    getIntFromArray(cryptedData, 0x0, "uint32", true) ^ dKey[0],
    getIntFromArray(cryptedData, 0x4, "uint32", true) ^ dKey[1],
    getIntFromArray(cryptedData, 0x8, "uint32", true) ^ dKey[2],
    getIntFromArray(cryptedData, 0xc, "uint32", true) ^ dKey[3],
  ];

  // prettier-ignore
  for (let i = 0; i < rounds - 1; i += 1) {
    table = [
      d0[(table[0] >> 0x18) & 0xff] ^ d1[(table[3] >> 0x10) & 0xff] ^ d2[(table[2] >> 0x8) & 0xff] ^ d3[table[1] & 0xff] ^ dKey[4 + i * 4],
      d0[(table[1] >> 0x18) & 0xff] ^ d1[(table[0] >> 0x10) & 0xff] ^ d2[(table[3] >> 0x8) & 0xff] ^ d3[table[2] & 0xff] ^ dKey[5 + i * 4],
      d0[(table[2] >> 0x18) & 0xff] ^ d1[(table[1] >> 0x10) & 0xff] ^ d2[(table[0] >> 0x8) & 0xff] ^ d3[table[3] & 0xff] ^ dKey[6 + i * 4],
      d0[(table[3] >> 0x18) & 0xff] ^ d1[(table[2] >> 0x10) & 0xff] ^ d2[(table[1] >> 0x8) & 0xff] ^ d3[table[0] & 0xff] ^ dKey[7 + i * 4],
    ];
  }

  let a = d4[(table[0] >> 0x18) & 0xff] & 0xff000000;
  let b = d4[(table[3] >> 0x10) & 0xff] & 0xff0000;
  let c = d4[(table[2] >> 0x8) & 0xff] & 0xff00;
  let d = d4[table[1] & 0xff] & 0xff;

  cryptedData.set(intToArray(a ^ b ^ c ^ d ^ dKey[56], "uint32", true), 0x0);

  a = d4[(table[1] >> 0x18) & 0xff] & 0xff000000;
  b = d4[(table[0] >> 0x10) & 0xff] & 0xff0000;
  c = d4[(table[3] >> 0x8) & 0xff] & 0xff00;
  d = d4[table[2] & 0xff] & 0xff;

  cryptedData.set(intToArray(a ^ b ^ c ^ d ^ dKey[57], "uint32", true), 0x4);

  a = d4[(table[2] >> 0x18) & 0xff] & 0xff000000;
  b = d4[(table[1] >> 0x10) & 0xff] & 0xff0000;
  c = d4[(table[0] >> 0x8) & 0xff] & 0xff00;
  d = d4[table[3] & 0xff] & 0xff;

  cryptedData.set(intToArray(a ^ b ^ c ^ d ^ dKey[58], "uint32", true), 0x8);

  a = d4[(table[3] >> 0x18) & 0xff] & 0xff000000;
  b = d4[(table[2] >> 0x10) & 0xff] & 0xff0000;
  c = d4[(table[1] >> 0x8) & 0xff] & 0xff00;
  d = d4[table[0] & 0xff] & 0xff;

  cryptedData.set(intToArray(a ^ b ^ c ^ d ^ dKey[59], "uint32", true), 0xc);

  return cryptedData;
}

export function encryptData(data: Uint8Array): Uint8Array {
  const encryptedData = new Uint8Array(data.length);

  for (let i = 0x0; i < data.length / 0x10; i += 0x1) {
    const decryptedBlock = data.slice(i * 0x10, i * 0x10 + 0x10);

    const encryptedBlock = encryptBlock(decryptedBlock);

    encryptedData.set(encryptedBlock, i * 0x10);
  }

  return encryptedData;
}

function encryptBlock(decryptedData: Uint8Array, rounds = 14): Uint8Array {
  let table = [
    getIntFromArray(decryptedData, 0x0, "uint32", true) ^ eKey[0],
    getIntFromArray(decryptedData, 0x4, "uint32", true) ^ eKey[1],
    getIntFromArray(decryptedData, 0x8, "uint32", true) ^ eKey[2],
    getIntFromArray(decryptedData, 0xc, "uint32", true) ^ eKey[3],
  ];

  // prettier-ignore
  for (let i = 0; i < rounds - 1; i += 1) {
    table = [
      e0[(table[0] >> 0x18) & 0xff] ^ e1[(table[1] >> 0x10) & 0xff] ^ e2[(table[2] >> 0x8) & 0xff] ^ e3[table[3] & 0xff] ^ eKey[4 + i * 4],
      e0[(table[1] >> 0x18) & 0xff] ^ e1[(table[2] >> 0x10) & 0xff] ^ e2[(table[3] >> 0x8) & 0xff] ^ e3[table[0] & 0xff] ^ eKey[5 + i * 4],
      e0[(table[2] >> 0x18) & 0xff] ^ e1[(table[3] >> 0x10) & 0xff] ^ e2[(table[0] >> 0x8) & 0xff] ^ e3[table[1] & 0xff] ^ eKey[6 + i * 4],
      e0[(table[3] >> 0x18) & 0xff] ^ e1[(table[0] >> 0x10) & 0xff] ^ e2[(table[1] >> 0x8) & 0xff] ^ e3[table[2] & 0xff] ^ eKey[7 + i * 4],
    ];
  }

  let a = e4[(table[0] >> 0x18) & 0xff] & 0xff000000;
  let b = e4[(table[1] >> 0x10) & 0xff] & 0xff0000;
  let c = e4[(table[2] >> 0x8) & 0xff] & 0xff00;
  let d = e4[table[3] & 0xff] & 0xff;

  decryptedData.set(intToArray(a ^ b ^ c ^ d ^ eKey[56], "uint32", true), 0x0);

  a = e4[(table[1] >> 0x18) & 0xff] & 0xff000000;
  b = e4[(table[2] >> 0x10) & 0xff] & 0xff0000;
  c = e4[(table[3] >> 0x8) & 0xff] & 0xff00;
  d = e4[table[0] & 0xff] & 0xff;

  decryptedData.set(intToArray(a ^ b ^ c ^ d ^ eKey[57], "uint32", true), 0x4);

  a = e4[(table[2] >> 0x18) & 0xff] & 0xff000000;
  b = e4[(table[3] >> 0x10) & 0xff] & 0xff0000;
  c = e4[(table[0] >> 0x8) & 0xff] & 0xff00;
  d = e4[table[1] & 0xff] & 0xff;

  decryptedData.set(intToArray(a ^ b ^ c ^ d ^ eKey[58], "uint32", true), 0x8);

  a = e4[(table[3] >> 0x18) & 0xff] & 0xff000000;
  b = e4[(table[0] >> 0x10) & 0xff] & 0xff0000;
  c = e4[(table[1] >> 0x8) & 0xff] & 0xff00;
  d = e4[table[2] & 0xff] & 0xff;

  decryptedData.set(intToArray(a ^ b ^ c ^ d ^ eKey[59], "uint32", true), 0xc);

  return decryptedData;
}
