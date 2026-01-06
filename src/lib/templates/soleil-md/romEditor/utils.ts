import { extractBit, getInt } from "$lib/utils/bytes";
import { formatChecksum } from "$lib/utils/checksum";
import { getRegionArray } from "$lib/utils/format";

import type { ItemChecksum } from "$lib/types";

import MapViewer from "./components/MapViewer.svelte";

export function getComponent(component: string): typeof MapViewer | undefined {
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
  length: number,
  callback?: (
    decompressedData: number[],
    bufferIndex: number,
  ) => [number[], number],
): number[] {
  let decompressedData: number[] = [...Array(0x10000).keys()].map(() => 0x0);

  const bufferOffset = 0xe800;

  for (let i = 0x0; i < 0x100; i += 0x1) {
    for (let j = 0x0; j < 0xd; j += 0x1) {
      decompressedData[bufferOffset + i * 0xd + j] = i;
    }
  }

  for (let i = 0x0; i < 0x100; i += 0x1) {
    decompressedData[bufferOffset + 0xd00 + i] = i;
  }

  for (let i = 0x0; i < 0x100; i += 0x1) {
    decompressedData[bufferOffset + 0xe00 + i] = 0xff - i;
  }

  for (let i = 0x0; i < 0x80; i += 0x1) {
    decompressedData[bufferOffset + 0xf00 + i] = 0x0;
  }

  for (let i = 0x0; i < 0x6e; i += 0x1) {
    decompressedData[bufferOffset + 0xf80 + i] = 0x20;
  }

  let bufferIndex = 0x0;
  let d0 = 0x0;
  let d6 = 0xfee;

  let decompressedLength = 0x0;

  while (decompressedLength < length) {
    let flags = getInt(offset++, "uint8");
    let mask = 0x80;

    while (mask > 0x0) {
      if (flags & 0x1) {
        d0 = (d0 & 0xff00) | (getInt(offset, "uint8") & 0xff);

        decompressedData[bufferIndex & 0xffff] = d0 & 0xff;
        decompressedData[bufferOffset + d6] = d0 & 0xff;

        d6 = (d6 + 0x1) & 0xfff;
        bufferIndex += 0x1;

        decompressedLength += 0x1;

        offset += 0x1;
      } else {
        d0 = (d0 & 0xff00) | (getInt(offset + 0x1, "uint8") & 0xff);

        const count = (d0 & 0xf) + 0x2;

        d0 = (((d0 << 0x4) & 0xff00) | (getInt(offset, "uint8") & 0xff)) & 0xfff; // prettier-ignore

        for (let i = 0x0; i <= count; i += 0x1) {
          const value = decompressedData[bufferOffset + d0];

          decompressedData[bufferIndex & 0xffff] = value;
          decompressedData[bufferOffset + d6] = value;

          d0 = (d0 + 0x1) & 0xfff;
          d6 = (d6 + 0x1) & 0xfff;
          bufferIndex += 0x1;

          decompressedLength += 0x1;
        }

        offset += 0x2;
      }

      mask >>= 0x1;
      flags >>= 0x1;
    }

    if (callback !== undefined) {
      [decompressedData, bufferIndex] = callback(decompressedData, bufferIndex);
    }
  }

  return decompressedData;
}

export function pointerToOffset(pointer: number | number[]): number {
  if (Array.isArray(pointer)) {
    pointer = getRegionArray(pointer);
  }

  return getInt(pointer, "uint32", {
    bigEndian: true,
  });
}
