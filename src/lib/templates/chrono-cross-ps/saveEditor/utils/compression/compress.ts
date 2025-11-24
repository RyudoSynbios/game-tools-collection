import { get } from "svelte/store";

import { dataViewAlt } from "$lib/stores";
import { getInt, setInt } from "$lib/utils/bytes";

import type { DataViewABL } from "$lib/types";

import { compressSteps } from "../resource";

let bitPosition = 0x0;
let dataViewDecmp: DataViewABL = new DataView(new ArrayBuffer(0));

export function getCompressedData(dataView: DataView): Uint8Array {
  const $dataViewAlt = get(dataViewAlt);

  bitPosition = 0x0;
  dataViewDecmp = dataView;

  $dataViewAlt.tmp = new DataView(new ArrayBuffer(0x1975));

  compressSteps.forEach((step) => {
    const [length, count, offset, special] = step.params;

    switch (step.mode) {
      case 0:
        setSection(length, count, offset, special);
        break;

      case 1:
        for (let i = 0x0; i < count; i += 0x1) {
          for (let j = 0x0; j < special; j += 0x1) {
            setElementQuantities(length, offset, i, j);
          }
        }
        break;

      case 2:
        for (let i = 0x0; i < count; i += 0x1) {
          setSection(length, 0x30, offset + i * 0xcc, special);
        }
        break;

      case 3:
        for (let i = 0x0; i < count; i += 0x1) {
          setUnlockedElementLevels(length, offset, i);
        }
        break;

      case 4:
        for (let i = 0x0; i < count; i += 0x1) {
          setCharacterNames(length, offset, i);
        }
        break;
    }
  });

  return new Uint8Array($dataViewAlt.tmp.buffer);
}

const mask = [0x0, 0x1, 0x3, 0x7, 0xf, 0x1f, 0x3f, 0x7f];

function setBits(value: number, length: number) {
  const $dataViewAlt = get(dataViewAlt);

  while (length > 0) {
    let shift = bitPosition & 0x7;
    let usedLength = 0x8 - shift;

    length -= usedLength;

    const offset = bitPosition >> 3;

    const int =
      (getInt(offset, "uint8", {}, $dataViewAlt.tmp) & mask[shift]) |
      (value << shift);

    setInt(offset, "uint8", int, {}, "tmp");

    if (length < 0) {
      usedLength += length;
    }

    value >>= usedLength & 0x1f;
    bitPosition += usedLength;
  }
}

function setSection(
  length: number,
  count: number,
  inputOffset: number,
  increment = 0x0,
): void {
  let dataType: "uint8" | "uint16" | "uint32" = "uint8";

  if (length === 0x20) {
    dataType = "uint32";
  } else if (length > 0x8) {
    dataType = "uint16";
  }

  for (let i = 0x0; i < count; i += 0x1) {
    const offset = inputOffset + i * increment;

    const value = getInt(offset, dataType, {}, dataViewDecmp);

    setBits(value, length);
  }
}

function setCharacterNames(
  length: number,
  offset: number,
  characterIndex: number,
): void {
  offset += characterIndex * 0x10;

  for (let i = 0x0; i < 0x6; i += 0x1) {
    let char = getInt(offset, "uint8", {}, dataViewDecmp);

    offset += 0x1;

    if (char > 0xf7) {
      let nextChar = getInt(offset, "uint8", {}, dataViewDecmp);

      char = ((char - 0xf7) << 0x8) | nextChar;

      offset += 1;
    }

    setBits(char, length);
  }
}

function setElementQuantities(
  length: number,
  offset: number,
  characterIndex: number,
  index: number,
): void {
  offset += characterIndex * 0x18 + (index >> 0x1);

  const isLower = (index & 0x1) === 0x0;
  const dataType = isLower ? "lower4" : "upper4";

  const int = getInt(offset, dataType, {}, dataViewDecmp);

  setBits(int, length);
}

function setUnlockedElementLevels(
  length: number,
  offset: number,
  characterIndex: number,
): void {
  offset += characterIndex * 0x10;

  for (let i = 0x0; i < 0x8; i += 0x1) {
    setBits(getInt(offset, "uint16", {}, dataViewDecmp), length);
    offset += 0x2;
  }
}
