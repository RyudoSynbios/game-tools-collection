import { get } from "svelte/store";

import { dataViewAlt } from "$lib/stores";
import { getInt, setInt } from "$lib/utils/bytes";
import { getHeaderShift } from "$lib/utils/common/nintendo64";
import {
  getMpkNoteShift,
  getRegionsFromMpk,
  getSaves,
  repackMpk,
  resetMpk,
  unpackMpk,
} from "$lib/utils/common/nintendo64/mpk";

import type { Item, ItemContainer, ItemInt } from "$lib/types";

export function initHeaderShift(dataView: DataView): number {
  return getHeaderShift(dataView, "mpk");
}

export function beforeInitDataView(
  dataView: DataView,
  shift: number,
): DataView {
  return unpackMpk(dataView, shift);
}

export function overrideGetRegions(): string[] {
  return getRegionsFromMpk();
}

export function onInitFailed(): void {
  resetMpk();
}

export function initShifts(): number[] {
  return getMpkNoteShift();
}

export function overrideShift(item: Item, shifts: number[]): number[] {
  if ("dataViewAltKey" in item) {
    return [shifts[0] >> 0x4];
  }

  return shifts;
}

export function overrideParseContainerItemsShifts(
  item: ItemContainer,
  shifts: number[],
  index: number,
): [boolean, number[] | undefined] {
  if (item.id === "slots") {
    const saves = getSaves();

    if (index > saves.length - 1) {
      return [true, [-1]];
    }

    return [true, [saves[index].offset]];
  }

  return [false, undefined];
}

export function onReady(): void {
  const $dataViewAlt = get(dataViewAlt);

  const saves = getSaves();

  const uint8Array = new Uint8Array(0x100);

  saves.forEach((save) => {
    uint8Array.set(decryptPassword(save.offset), save.offset >> 0x4);
  });

  $dataViewAlt.save = new DataView(uint8Array.buffer);
}

export function overrideGetInt(item: Item): [boolean, number | undefined] {
  const $dataViewAlt = get(dataViewAlt);

  if ("id" in item && item.id?.match(/total-/)) {
    const itemInt = item as ItemInt;

    const [type] = item.id.splitInt();

    let count = 0;

    const int1 = getInt(itemInt.offset, "uint32", {}, $dataViewAlt.save);
    const int2 = getInt(itemInt.offset + 0x4, "uint8", {}, $dataViewAlt.save);

    switch (type) {
      case 0:
        count += int1.toBitCount();
        count += ((int2 >> 0x5) & 0x7).toBitCount();
        break;
      case 1:
        count += ((int1 & 0xfeffff1f) >>> 0x0).toBitCount();
        break;
      case 2:
        count += (int1 & 0xc0ff01).toBitCount();
        break;
    }

    return [true, count];
  }

  return [false, undefined];
}

export function afterSetInt(item: Item): void {
  let offset = 0x0;

  if (item.type === "bitflags") {
    offset = item.flags[0].offset;
  } else if ("offset" in item) {
    offset = item.offset;
  }

  offset = (offset >> 0x4) * 0x10;

  encryptPassword(offset);
}

export function beforeSaving(): ArrayBufferLike {
  return repackMpk();
}

export function onReset(): void {
  resetMpk();
}

function encryptPassword(offset: number): void {
  const $dataViewAlt = get(dataViewAlt);

  const buffer = new Uint8Array(
    $dataViewAlt.save.buffer.slice(offset, offset + 0xc),
  );

  for (let i = 0x1; i < 0xc; i += 0x1) {
    buffer[0x0] += buffer[i].toBitCount();
  }

  for (let i = 0x1; i < 0xc; i += 0x1) {
    buffer[i] ^= buffer[0x0];
  }

  offset *= 0x10;

  let bufferIndex = 0;
  let bit = 0;

  for (let i = 0x0; i < 0x12; i += 0x1) {
    let letter = 0;

    for (let j = 0; j < 5; j += 1) {
      const bufferBit = 7 - (bit % 8);

      if ((buffer[bufferIndex] >> bufferBit) & 0x1) {
        letter |= 0x1;
      }

      if (bufferBit === 0) {
        bufferIndex += 1;
      }

      if (j !== 4) {
        letter <<= 0x1;
      }

      bit += 1;
    }

    setInt(offset + i, "uint8", letter);
  }
}

function decryptPassword(offset: number): Uint8Array {
  const buffer = new Uint8Array(0xc);

  let bufferIndex = 0;
  let bit = 0;

  while (bit < 90) {
    const int = getInt(offset, "uint8");

    const bufferBit = 7 - (bit % 8);
    const letterBit = 4 - (bit % 5);

    if ((int >> letterBit) & 0x1) {
      buffer[bufferIndex] |= 0x1 << bufferBit;
    }

    if (bufferBit === 0) {
      bufferIndex += 1;
    }

    if (letterBit === 0) {
      offset += 0x1;
    }

    bit += 1;
  }

  for (let i = 1; i < 12; i += 1) {
    buffer[i] = buffer[i] ^ buffer[0];
  }

  buffer[0x0] = 0x0;
  buffer[0xb] &= 0x80;

  return buffer;
}
