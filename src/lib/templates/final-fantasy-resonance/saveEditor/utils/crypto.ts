import Rijndael from "rijndael-js";

const BLOCK_SIZE = 0x10;

const KEY = "wwrqPkdwzPvgfchQ8kTYHVbn4umTf3d7";

export function decrypt(cryptedData: Uint8Array): Uint8Array {
  const cipher = new Rijndael(KEY, "ecb");

  const decryptedData = new Uint8Array(
    cipher.decrypt(cryptedData as any, `${BLOCK_SIZE}`, ""),
  );

  return decryptedData;
}

export function encrypt(data: Uint8Array): Uint8Array {
  const cipher = new Rijndael(KEY, "ecb");

  const encryptedData = new Uint8Array(
    cipher.encrypt(data as any, `${BLOCK_SIZE}`, ""),
  );

  return encryptedData;
}
