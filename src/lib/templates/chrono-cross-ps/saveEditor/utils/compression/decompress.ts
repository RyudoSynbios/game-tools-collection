import { get } from "svelte/store";

import { dataViewAlt } from "$lib/stores";
import { getInt, setInt } from "$lib/utils/bytes";

import type { DataViewABL } from "$lib/types";

import { compressSteps } from "../resource";

let bitPosition = 0x0;
let dataViewCmp: DataViewABL = new DataView(new ArrayBuffer(0));

export function getDecompressedData(dataView: DataView): ArrayBufferLike {
  const $dataViewAlt = get(dataViewAlt);

  bitPosition = 0x0;
  dataViewCmp = dataView;

  $dataViewAlt.tmp = new DataView(new ArrayBuffer(0xe1f4));

  compressSteps.forEach((step) => {
    const [length, count, offset, special] = step.params;

    switch (step.mode) {
      case 0:
        extractSection(length, count, offset, special);
        break;

      case 1:
        for (let i = 0x0; i < count; i += 0x1) {
          for (let j = 0x0; j < special; j += 0x1) {
            generateElementQuantities(length, offset, i, j);
          }
        }
        break;

      case 2:
        for (let i = 0x0; i < count; i += 0x1) {
          extractSection(length, 0x30, offset + i * 0xcc, special);
        }
        break;

      case 3:
        for (let i = 0x0; i < count; i += 0x1) {
          generateUnlockedElementLevels(length, offset, i);
        }
        break;

      case 4:
        for (let i = 0x0; i < count; i += 0x1) {
          generateCharacterNames(length, offset, i);
        }
        break;
    }
  });

  return $dataViewAlt.tmp.buffer;
}

const mask1 = [0xff, 0x7f, 0x3f, 0x1f, 0xf, 0x7, 0x3, 0x1];
const mask2 = [0x0, 0x1, 0x3, 0x7, 0xf, 0x1f, 0x3f, 0x7f];

function extractBits(length: number): number {
  let value = 0x0;

  let totalLength = 0x0;

  while (length > 0x0) {
    let shift = bitPosition & 0x7;
    let usedLength = 0x8 - shift;

    length -= usedLength;

    let int = getInt(bitPosition >> 0x3, "uint8", {}, dataViewCmp);

    int = (int >> shift) & mask1[shift];

    if (length < 0x0) {
      usedLength += length;
      int = mask2[usedLength] & int;
    }

    value |= int << (totalLength & 0x1f);

    bitPosition += usedLength;
    totalLength += usedLength;
  }

  return value;
}

function extractSection(
  length: number,
  count: number,
  outputOffset: number,
  increment = 0x0,
): void {
  let dataType: "uint8" | "uint16" | "uint32" = "uint8";

  if (length === 0x20) {
    dataType = "uint32";
  } else if (length > 0x8) {
    dataType = "uint16";
  }

  for (let i = 0x0; i < count; i += 0x1) {
    const int = extractBits(length);

    setInt(outputOffset + i * increment, dataType, int, {}, "tmp");
  }
}

function generateCharacterNames(
  length: number,
  offset: number,
  characterIndex: number,
): void {
  offset += characterIndex * 0x10;

  for (let i = 0x0; i < 0x6; i += 0x1) {
    const char = extractBits(length);

    if ((char & 0x700) !== 0x0) {
      setInt(offset, "uint8", ((char & 0x700) >> 0x8) - 0x9, {}, "tmp");
      offset += 0x1;
    }

    setInt(offset, "uint8", char, {}, "tmp");

    offset += 0x1;
  }

  setInt(offset, "uint8", 0x0, {}, "tmp");
}

function generateElementQuantities(
  length: number,
  offset: number,
  characterIndex: number,
  index: number,
): void {
  const $dataViewAlt = get(dataViewAlt);

  offset += characterIndex * 0x18 + (index >> 0x1);

  const isLower = (index & 0x1) === 0x0;

  const value = extractBits(length) << (!isLower ? 0x4 : 0x0);
  const dataType = isLower ? "upper4" : "lower4";

  const int = getInt(offset, dataType, {}, $dataViewAlt.tmp) | value;

  setInt(offset, "uint8", int, {}, "tmp");
}

function generateUnlockedElementLevels(
  length: number,
  offset: number,
  characterIndex: number,
): void {
  offset += characterIndex * 0x10;

  for (let i = 0x0; i < 0x8; i += 0x1) {
    setInt(offset, "uint16", extractBits(length), {}, "tmp");
    offset += 0x2;
  }
}
