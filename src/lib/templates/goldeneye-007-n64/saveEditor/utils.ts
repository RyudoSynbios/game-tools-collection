import { get } from "svelte/store";

import { fileHeaderShift, gameTemplate } from "$lib/stores";
import { getBigInt, getInt, setInt } from "$lib/utils/bytes";
import {
  byteswapDataView,
  generateRareChecksum,
  getHeaderShift,
} from "$lib/utils/common/nintendo64";
import { clone, makeOperations } from "$lib/utils/format";

import type {
  DataViewABL,
  Item,
  ItemChecksum,
  ItemContainer,
  ItemInt,
  TimeUnit,
} from "$lib/types";

export function initHeaderShift(dataView: DataView): number {
  return getHeaderShift(dataView, "eep");
}

export function beforeInitDataView(dataView: DataView): DataView {
  return byteswapDataView("eep", dataView);
}

export function overrideGetRegions(
  dataView: DataView,
  shift: number,
): string[] {
  const $gameTemplate = get(gameTemplate);

  const itemChecksum = clone($gameTemplate.items[0] as ItemContainer)
    .items[0] as ItemChecksum;

  itemChecksum.offset += shift;
  itemChecksum.control.offsetStart += shift;
  itemChecksum.control.offsetEnd += shift;

  if (dataView.byteLength < itemChecksum.control.offsetEnd) {
    return [];
  }

  const checksum = generateChecksum(itemChecksum, dataView);

  if (
    checksum ===
    getBigInt(itemChecksum.offset, "uint64", { bigEndian: true }, dataView)
  ) {
    return ["europe_usa_japan"];
  }

  return [];
}

export function overrideParseContainerItemsShifts(
  item: ItemContainer,
  shifts: number[],
  index: number,
): [boolean, number[] | undefined] {
  const $fileHeaderShift = get(fileHeaderShift);

  if (item.id === "slots") {
    for (let i = 0; i < item.instances + 1; i += 1) {
      const saveIndex = getInt(
        $fileHeaderShift + i * item.length + 0x28,
        "uint8",
      );

      if ((saveIndex & 0x7) === index && !(saveIndex & 0x80)) {
        return [true, [...shifts, i * item.length]];
      }
    }
  }

  return [false, undefined];
}

function getTime(offset: number, mode: string, timeUnit: TimeUnit): number {
  const byte1 = getInt(offset, "uint8");
  const byte2 = getInt(offset + 0x1, "uint8");

  let int = 0;

  switch (mode) {
    case "time-1":
      int = ((byte1 << 0x8) | byte2) >> 0x6;
      break;
    case "time-2":
      int = ((byte1 & 0x3f) << 0x4) | (byte2 >> 0x4);
      break;
    case "time-3":
      int = ((byte1 & 0xf) << 0x6) | (byte2 >> 0x2);
      break;
    case "time-4":
      int = ((byte1 & 0x3) << 0x8) | byte2;
      break;
  }

  int = makeOperations(int, [{ convert: { from: "seconds", to: timeUnit } }]);

  return int;
}

export function overrideGetInt(item: Item): [boolean, number | undefined] {
  if ("id" in item && item.id?.match(/time-/)) {
    const itemInt = item as ItemInt;

    const int = getTime(
      itemInt.offset,
      item.id,
      itemInt.max === 17 ? "minutes" : "seconds",
    );

    return [true, int];
  } else if ("id" in item && item.id === "controlStyle") {
    const itemInt = item as ItemInt;

    const value = getInt(itemInt.offset, "uint8");
    const ratioCinema = getInt(itemInt.offset, "bit", { bit: 3 });

    if (ratioCinema) {
      return [true, value - 0x8];
    }
  } else if ("id" in item && item.id === "ratio") {
    const itemInt = item as ItemInt;

    const ratioCinema = getInt(itemInt.offset - 0x1, "bit", { bit: 3 });

    if (ratioCinema) {
      return [true, 0x8];
    }
  }

  return [false, undefined];
}

export function overrideSetInt(item: Item, value: string): boolean {
  if ("id" in item && item.id?.match(/time-/)) {
    const itemInt = item as ItemInt;

    const int = parseInt(value);

    let base = 0;

    if (itemInt.max === 17) {
      base = int * 60 + getTime(itemInt.offset, item.id, "seconds");
    } else {
      base = getTime(itemInt.offset, item.id, "minutes") * 60 + int;
    }

    base = Math.min(base, 1023); // seconds max

    let byte1 = getInt(itemInt.offset, "uint8");
    let byte2 = getInt(itemInt.offset + 0x1, "uint8");

    if (item.id === "time-1") {
      base <<= 0x6;
      byte2 &= 0x3f;

      setInt(itemInt.offset, "uint16", base | byte2, { bigEndian: true });
    } else if (item.id === "time-2") {
      byte1 = (byte1 >> 0x6) << 0xe;
      base <<= 0x4;
      byte2 &= 0xf;

      setInt(itemInt.offset, "uint16", byte1 | base | byte2, {
        bigEndian: true,
      });
    } else if (item.id === "time-3") {
      byte1 = (byte1 >> 0x4) << 0xc;
      base <<= 0x2;
      byte2 &= 0x3;

      setInt(itemInt.offset, "uint16", byte1 | base | byte2, {
        bigEndian: true,
      });
    } else if (item.id === "time-4") {
      byte1 = (byte1 >> 0x2) << 0xa;

      setInt(itemInt.offset, "uint16", byte1 | base, { bigEndian: true });
    }

    return true;
  } else if ("id" in item && item.id === "controlStyle") {
    const itemInt = item as ItemInt;

    const int = parseInt(value);
    const ratioCinema = getInt(itemInt.offset, "bit", { bit: 3 });

    if (ratioCinema) {
      setInt(itemInt.offset, "uint8", int + 0x8);

      return true;
    }
  } else if ("id" in item && item.id === "ratio") {
    const itemInt = item as ItemInt;

    const int = parseInt(value);
    const controlStyle = getInt(itemInt.offset - 0x1, "uint8");
    const ratioCinema = getInt(itemInt.offset - 0x1, "bit", { bit: 3 });

    if (int === 0x8 && !ratioCinema) {
      setInt(itemInt.offset - 0x1, "uint8", controlStyle + 0x8);
      setInt(itemInt.offset, "bit", 0, { bit: 7 });

      return true;
    } else if (ratioCinema) {
      setInt(itemInt.offset - 0x1, "uint8", controlStyle - 0x8);
      setInt(itemInt.offset, "bit", int, { bit: 7 });

      return true;
    }
  }

  return false;
}

export function generateChecksum(
  item: ItemChecksum,
  dataView: DataViewABL = new DataView(new ArrayBuffer(0)),
): bigint {
  const [checksum1, checksum2] = generateRareChecksum(item, dataView);

  const high = checksum1.toString(16).padStart(8, "0").slice(-8);
  const low = checksum1.xor(checksum2).toString(16).padStart(8, "0").slice(-8);

  return BigInt(`0x${high}${low}`);
}

export function beforeSaving(): ArrayBufferLike {
  return byteswapDataView("eep").buffer;
}
