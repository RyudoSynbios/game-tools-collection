import { get } from "svelte/store";

import { dataView, gameMetas } from "$lib/stores";
import { getInt } from "$lib/utils/bytes";
import { cloneDataView } from "$lib/utils/format";
import { getRegions } from "$lib/utils/validator";

import { decrypt, encrypt, extractSaveData } from "./utils/crypto";

export function overrideGetRegions(dataView: DataView): string[] {
  const regions = getRegions(dataView);

  if (regions.length === 0) {
    return [];
  }

  const isValid = [...Array(3).keys()].some((index) => {
    const check1 = getInt(0x6040 + index * 0x1e000, "uint32", {}, dataView);
    const check2 = getInt(0x604c + index * 0x1e000, "uint32", {}, dataView);

    return check1 === 0x101 && check2 !== 0xfffe;
  });

  if (isValid) {
    return regions;
  }

  return [];
}

export function initShifts(): number[] {
  const $gameMetas = get(gameMetas);

  let offset = 0x0;
  let bestSaveCount = 0;

  for (let i = 0x6040; i < 0x60040; i += 0x1e000) {
    const saveCount = getInt(0x4 + i, "uint32", { bigEndian: true });

    if (saveCount > bestSaveCount) {
      offset = i;
      bestSaveCount = saveCount;
    }
  }

  $gameMetas.offset = offset;

  return [offset];
}

export function beforeItemsParsing(): void {
  const $dataView = get(dataView);
  const $gameMetas = get(gameMetas);

  const data = new Uint8Array($dataView.buffer);

  const { extractedData, iv } = extractSaveData(data);

  const decryptedData = decrypt(extractedData, iv);

  data.set(decryptedData, $gameMetas.offset + 0x18);

  dataView.set(new DataView(data.buffer));
}

export function beforeSaving(): ArrayBufferLike {
  const $dataView = get(dataView);
  const $gameMetas = get(gameMetas);

  const data = new Uint8Array(cloneDataView($dataView).buffer);

  const { extractedData, iv } = extractSaveData(data);

  const decryptedData = encrypt(extractedData, iv);

  data.set(decryptedData, $gameMetas.offset + 0x18);

  return data.buffer;
}
