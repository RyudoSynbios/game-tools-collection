import pako from "pako";
import Rijndael from "rijndael-js";

// Source from https://github.com/Anub1sR0cks/FFPRSaveEditor/blob/master/FFPRSaveEditor.Common/SaveGame.cs

const BLOCK_SIZE = 32;

const PASSWORD = "TKX73OHHK1qMonoICbpVT0hIDGe7SkW0";
const SALTWORD = "71Ba2p0ULBGaE6oJ7TjCqwsls1jBKmRL";

export async function decrypt(encryptedString: string): Promise<Object> {
  const ciphertext = base64ToBytes(encryptedString);

  const { key, iv } = await deriveKeyAndIV();

  const cipher = new Rijndael(key, "cbc");

  let compressedData;

  try {
    compressedData = cipher.decrypt(ciphertext, `${BLOCK_SIZE}`, iv);
  } catch (e) {
    throw new Error("Failed to decrypt string.");
  }

  try {
    const decompressedData = pako.inflateRaw(compressedData);

    const decodedString = new TextDecoder().decode(decompressedData);

    return stringToObj(decodedString) as Object;
  } catch (e) {
    throw new Error("Failed to decompress string.");
  }
}

export async function encrypt(obj: Object): Promise<string> {
  const encoder = new TextEncoder();

  const string = objToString(obj);

  let compressedData;

  try {
    compressedData = pako.deflateRaw(encoder.encode(string));
  } catch (e) {
    throw new Error("Failed to compress string.");
  }

  const { key, iv } = await deriveKeyAndIV();

  const cipher = new Rijndael(key, "cbc");

  compressedData = compressedData as Buffer;

  let encryptedString;

  try {
    encryptedString = new Uint8Array(
      cipher.encrypt(compressedData, `${BLOCK_SIZE}`, iv),
    );
  } catch (e) {
    throw new Error("Failed to encrypt string.");
  }

  return bytesToBase64(encryptedString);
}

async function deriveKeyAndIV(): Promise<{ key: Buffer; iv: Buffer }> {
  const encoder = new TextEncoder();

  const passwordKey = await crypto.subtle.importKey(
    "raw",
    encoder.encode(PASSWORD),
    { name: "PBKDF2" },
    false,
    ["deriveBits"],
  );

  const derivedBits = await crypto.subtle.deriveBits(
    {
      name: "PBKDF2",
      salt: encoder.encode(SALTWORD),
      iterations: 10,
      hash: "SHA-1",
    },
    passwordKey,
    512,
  );

  const uint8Array = new Uint8Array(derivedBits);

  const key = uint8Array.slice(0, 32) as Buffer;
  const iv = uint8Array.slice(32, 64) as Buffer;

  return { key, iv };
}

function base64ToBytes(string: string): Buffer {
  const decoded = atob(string);

  const buffer = new Uint8Array(decoded.length) as Buffer;

  for (let i = 0x0; i < buffer.byteLength; i += 0x1) {
    buffer[i] = decoded.charCodeAt(i);
  }

  return buffer;
}

function bytesToBase64(buffer: Uint8Array): string {
  const string = buffer.reduce((buffer, byte) => {
    buffer += String.fromCharCode(byte);

    return buffer;
  }, "");

  return btoa(string);
}

export function objToString(obj: Object): string {
  const replacer = (key: string, value: unknown) => {
    if (
      !["", "cheatSettingsData", "position"].includes(key) &&
      typeof value === "object" &&
      !Array.isArray(value)
    ) {
      value = objToString(value as Object);
    }

    return value;
  };

  return JSON.stringify(obj, replacer);
}

export function stringToObj(string: string): Object {
  return Object.entries(JSON.parse(string)).reduce(
    (object: { [key: string]: unknown }, [key, value]) => {
      if (
        !["cheatSettingsData", "position"].includes(key) &&
        typeof value === "string" &&
        value.match(/^{/)
      ) {
        value = stringToObj(value);
      } else if (Array.isArray(value)) {
        value = value.map((item) => {
          if (typeof item === "string" && item.match(/^{/)) {
            return stringToObj(item);
          }
          return item;
        });
      }

      object[key] = value;

      return object;
    },
    {},
  );
}
