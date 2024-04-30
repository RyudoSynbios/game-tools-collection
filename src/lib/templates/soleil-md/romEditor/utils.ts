import { extractBit, getInt } from "$lib/utils/bytes";
import { formatChecksum } from "$lib/utils/checksum";
import { getRegionArray } from "$lib/utils/format";

import type { Bit, ItemChecksum } from "$lib/types";

import MapViewer from "./components/MapViewer.svelte";

export function getComponent(component: string): any {
  if (component === "MapViewer") {
    return MapViewer;
  }
}

export function generateChecksum(item: ItemChecksum): number {
  let checksum = 0x0;

  for (let i = item.control.offsetStart; i < item.control.offsetEnd; i += 0x2) {
    checksum += getInt(i, "uint16", { bigEndian: true });
  }

  return formatChecksum(checksum, item.dataType);
}

export function getDecompressedData(
  offset: number,
  size: number,
  callback?: (decompressedData: number[], a5: number) => [number[], number],
): number[] {
  let decompressedData: number[] = [...Array(0x10000).keys()].map(() => 0x0);

  let baseOffset = 0xe800;

  for (let i = 0x0; i < 0x100; i += 0x1) {
    for (let j = 0x0; j < 0xd; j += 0x1) {
      decompressedData[baseOffset + i * 0xd + j] = i;
    }
  }

  for (let i = 0x0; i < 0x100; i += 0x1) {
    decompressedData[baseOffset + 0xd00 + i] = i;
  }

  for (let i = 0x0; i < 0x100; i += 0x1) {
    decompressedData[baseOffset + 0xe00 + i] = 0xff - i;
  }

  for (let i = 0x0; i < 0x80; i += 0x1) {
    decompressedData[baseOffset + 0xf00 + i] = 0x0;
  }

  for (let i = 0x0; i < 0x6e; i += 0x1) {
    decompressedData[baseOffset + 0xf80 + i] = 0x20;
  }

  let a5 = 0x0;
  let d0 = 0x0;
  let d6 = 0xfee;

  let count = 0x0;

  while (count < size) {
    let int = getInt(offset, "uint8");

    offset += 0x1;

    for (let i = 0x0; i < 0x8; i += 0x1) {
      if (extractBit(int, i as Bit)) {
        d0 = (d0 & 0xff00) | (getInt(offset, "uint8") & 0xff);

        decompressedData[a5 & 0xffff] = d0 & 0xff;
        decompressedData[baseOffset + d6] = d0 & 0xff;

        d6 = (d6 + 0x1) & 0xfff;
        a5 += 0x1;

        count += 0x1;

        offset += 0x1;
      } else {
        d0 = (d0 & 0xff00) | (getInt(offset + 0x1, "uint8") & 0xff);

        let iterations = (d0 & 0xf) + 0x2;

        d0 = (((d0 << 4) & 0xff00) | (getInt(offset, "uint8") & 0xff)) & 0xfff;

        for (let i = 0x0; i <= iterations; i += 0x1) {
          const value = decompressedData[baseOffset + d0];

          decompressedData[a5 & 0xffff] = value;
          decompressedData[baseOffset + d6] = value;

          d0 = (d0 + 0x1) & 0xfff;
          d6 = (d6 + 0x1) & 0xfff;
          a5 += 0x1;

          count += 0x1;
        }

        offset += 0x2;
      }
    }

    if (callback !== undefined) {
      [decompressedData, a5] = callback(decompressedData, a5);
    }
  }

  return decompressedData;
}

export function getTiles(offset: number, size: number): Uint8Array {
  const vdp = new Uint8Array(0x10000);

  let vdpaCount = 0x0;

  const callback = (
    decompressedData: number[],
    a5: number,
  ): [number[], number] => {
    let d1 = a5;

    d1 >>= 0x1;

    let a6 = 0x0;

    d1 -= 0x1;

    while (d1 >= 0x0) {
      for (let i = 0x0; i < 0x2; i += 0x1) {
        vdp.set([decompressedData[a6 + i]], vdpaCount);

        vdpaCount += 0x1;
      }

      a6 += 0x2;
      d1 -= 0x1;
    }

    let clearFlag = false;

    if (!extractBit(a5, 0 as Bit)) {
      clearFlag = true;
    }

    a5 = 0x0;

    if (!clearFlag) {
      decompressedData[a5] = decompressedData[a6];

      a5 += 0x1;
      a6 += 0x1;
    }

    return [decompressedData, a5];
  };

  getDecompressedData(offset, size, callback);

  return vdp;
}

export function pointerToOffset(pointer: number | number[]): number {
  if (Array.isArray(pointer)) {
    pointer = getRegionArray(pointer);
  }

  return getInt(pointer, "uint32", {
    bigEndian: true,
  });
}
