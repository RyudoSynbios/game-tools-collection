import { get } from "svelte/store";

import { dataJson } from "$lib/stores";
import { getObjKey } from "$lib/utils/format";
import Gvas from "$lib/utils/gvas";
import { checkValidator, getPlatformRegions } from "$lib/utils/validator";

import type { Validator } from "$lib/types";

import { decrypt } from "./utils/crypto";

export let gvas: Gvas;

export async function beforeInitDataView(
  dataView: DataView,
): Promise<DataView> {
  const regionValidator = getPlatformRegions().world as Validator;
  const key = parseInt(getObjKey(regionValidator, 0));
  const validator = regionValidator[key];

  if (!checkValidator(validator, key, dataView)) {
    return dataView;
  }

  const encodedData = new Uint8Array(dataView.buffer.slice(0x20));

  try {
    const decryptedData = decrypt(encodedData);

    dataView = new DataView(decryptedData.buffer);

    gvas = new Gvas(dataView);
  } catch (e) {
    console.error(e);
  }

  return dataView;
}

export function overrideGetRegions(): string[] {
  if (gvas?.header.saveType.match(/CPP_MuchaGameSaveData/)) {
    return ["world"];
  }

  return [];
}

export function beforeItemsParsing(): void {
  dataJson.set(gvas.parseToJson());
}

// export async function beforeSaving(): Promise<ArrayBufferLike> {
//   const $dataJson = get(dataJson);

//   const checksum = nawait crypto.subtle.digest(`SHA-1`, encodedData.buffer as ArrayBuffer);

//   const encoded = await encrypt($dataJson);

//   const uint8Array = new Uint8Array(encoded.length + 0x5);

//   uint8Array.set([0xef, 0xbb, 0xbf]);
//   uint8Array.set([0xd, 0xa], encoded.length + 0x3);

//   for (let i = 0x0; i < encoded.length; i += 0x1) {
//     uint8Array[i + 0x3] = encoded[i].charCodeAt(0);
//   }

//   return uint8Array.buffer;
// }
