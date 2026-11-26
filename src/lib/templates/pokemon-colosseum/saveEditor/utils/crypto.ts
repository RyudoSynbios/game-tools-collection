import { sha1 } from "js-sha1";
import { get } from "svelte/store";

import { gameMetas } from "$lib/stores";

const BLOCK_SIZE = 0x14;

export function extractSaveData(data: Uint8Array) {
  const $gameMetas = get(gameMetas);

  const offset = $gameMetas.offset;

  const extractedData = data.slice(offset + 0x18, offset + 0x1dfd8);
  const iv = data.slice(offset + 0x1dfec, offset + 0x1e000);

  return { extractedData, iv };
}

export function decrypt(
  encryptedData: Uint8Array,
  key: Uint8Array,
): Uint8Array {
  for (let i = 0x0; i < BLOCK_SIZE; i += 0x1) {
    key[i] = ~key[i];
  }

  for (let i = 0x0; i < encryptedData.length; i += BLOCK_SIZE) {
    const encryptedBlock = new Uint8Array(
      encryptedData.slice(i, i + BLOCK_SIZE),
    );

    const nextKey = new Uint8Array(sha1.arrayBuffer(encryptedBlock));

    for (let j = 0x0; j < 0x18; j += 0x1) {
      encryptedData[i + j] ^= key[j];
    }

    key = nextKey;
  }

  return encryptedData;
}

export function encrypt(
  decryptedData: Uint8Array,
  key: Uint8Array,
): Uint8Array {
  for (let i = 0x0; i < BLOCK_SIZE; i += 0x1) {
    key[i] = ~key[i];
  }

  for (let i = 0x0; i < decryptedData.length; i += BLOCK_SIZE) {
    for (let j = 0x0; j < 0x18; j += 0x1) {
      decryptedData[i + j] ^= key[j];
    }

    const encryptedBlock = new Uint8Array(
      decryptedData.slice(i, i + BLOCK_SIZE),
    );

    const nextKey = new Uint8Array(sha1.arrayBuffer(encryptedBlock));

    key = nextKey;
  }

  return decryptedData;
}
