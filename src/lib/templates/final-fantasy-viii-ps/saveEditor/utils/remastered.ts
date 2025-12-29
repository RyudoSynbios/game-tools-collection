import { get } from "svelte/store";

import { dataView } from "$lib/stores";
import { getInt, intToArray } from "$lib/utils/bytes";
import { mergeUint8Arrays } from "$lib/utils/format";
import Lzss from "$lib/utils/lzss";
import { checkValidator } from "$lib/utils/validator";

export function isRemasteredSave(
  dataView?: DataView,
  compressed = false,
): boolean {
  let offset = 0x0;

  if (compressed) {
    if (getInt(0x0, "uint32", {}, dataView) > 0x2000) {
      return false;
    }

    offset = 0x5;
  }

  const validator = [0x53, 0x43];

  return checkValidator(validator, offset, dataView);
}

export function decompressRemasteredSave(dataView: DataView): DataView {
  const compressedData = new Uint8Array(dataView.buffer).slice(0x4);

  const decompressedData = new Lzss({
    bufferSize: 0x1000,
  }).decompress(compressedData, 0x2000);

  return new DataView(decompressedData.buffer);
}

export function compressRemasteredSave(): ArrayBufferLike {
  const $dataView = get(dataView);

  const compressedData = new Lzss({ bufferSize: 0x1000 }).compress(
    new Uint8Array($dataView.buffer),
  );

  const size = new Uint8Array(0x4);

  size.set(intToArray(compressedData.byteLength, "uint32"));

  const uint8Array = mergeUint8Arrays(size, compressedData);

  return uint8Array.buffer;
}
