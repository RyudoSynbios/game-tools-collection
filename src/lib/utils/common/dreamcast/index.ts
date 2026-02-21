import { get } from "svelte/store";

import { dataView } from "$lib/stores";
import { byteswap, getInt, setInt } from "$lib/utils/bytes";

import { isDciFile } from "./dci";

export enum FileType {
  Data = 0x33,
  Game = 0xcc,
}

export function initDataView(dataView: DataView): DataView {
  if (isDciFile(dataView)) {
    return byteswap(dataView, 0x20);
  }

  return dataView;
}

export function saveDataView(): ArrayBufferLike {
  const $dataView = get(dataView);

  if (isDciFile()) {
    generateChecksum(0x20);

    return byteswap(undefined, 0x20).buffer;
  }

  return $dataView.buffer;
}

export function getFileSize(offset: number): number {
  const icons = getInt(offset + 0x40, "uint16");
  const eyecatchType = getInt(offset + 0x42, "uint16");

  let headerSize = 0x80 + icons * 0x200;

  switch (eyecatchType) {
    case 1:
      headerSize += 0x1f80;
    case 2:
      headerSize += 0x11c0;
    case 3:
      headerSize += 0x800;
  }

  return headerSize + getInt(offset + 0x48, "uint32");
}

export function generateChecksum(offset: number): void {
  let checksum = 0x0;

  setInt(offset + 0x46, "uint16", checksum);

  const size = getFileSize(offset);

  for (let i = offset; i < offset + size; i += 0x1) {
    const int = getInt(i, "uint8");

    checksum ^= int << 0x8;

    for (let j = 0; j < 8; j += 1) {
      if (checksum & 0x8000) {
        checksum = (checksum << 0x1) ^ 0x1021;
      } else {
        checksum = checksum << 0x1;
      }
    }

    checksum &= 0xffff;
  }

  setInt(offset + 0x46, "uint16", checksum);
}
