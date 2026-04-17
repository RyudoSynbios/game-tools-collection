import Rijndael from "rijndael-js";

// Source from https://github.com/RyudoSynbios/game-tools-collection/issues/2

const BLOCK_SIZE = 0x80;

const KEY = "ewKDrdIrMcAewKDrdE3SfRUL3SL0Fsa4"; // Credit to https://github.com/bucanero

export function decryptData(cryptedData: Uint8Array): Uint8Array {
  const cipher = new Rijndael(KEY, "ecb");

  const decryptedData = new Uint8Array(
    cipher.decrypt(cryptedData as any, `${BLOCK_SIZE}`, ""),
  );

  return decryptedData;
}

export function encryptData(data: Uint8Array): Uint8Array {
  const cipher = new Rijndael(KEY, "ecb");

  const encryptedData = new Uint8Array(
    cipher.encrypt(data as any, `${BLOCK_SIZE}`, ""),
  );

  return encryptedData;
}
