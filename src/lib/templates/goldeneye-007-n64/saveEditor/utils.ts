import Long from "long";

import { getInt, setInt } from "$lib/utils/bytes";
import { extractN64DexDriveHeader } from "$lib/utils/common";
import { makeOperations } from "$lib/utils/format";

import type {
  Item,
  ItemChecksum,
  ItemContainer,
  ItemInt,
  TimeUnit,
} from "$lib/types";

import template from "./template";

export function beforeInitDataView(dataView: DataView): [DataView, Uint8Array] {
  return extractN64DexDriveHeader(dataView);
}

export function overrideGetRegions(dataView: DataView): string[] {
  const itemChecksum = (template.items[0] as ItemContainer)
    .items[0] as ItemChecksum;

  const checksum = generateChecksum(itemChecksum, dataView);

  if (checksum === dataView.getBigUint64(itemChecksum.offset)) {
    return ["europe_usa_japan"];
  }

  return [];
}

export function overrideParseContainerItemsSteps(
  item: ItemContainer,
  steps: number[],
  index: number,
): [boolean, number[] | undefined] {
  if (item.id === "slots") {
    for (let i = 0x0; i < item.length * 0x10; i += item.length) {
      const saveIndex = getInt(i + 0x28, "uint8");

      if ((saveIndex & 0x7) === index && !(saveIndex & 0x80)) {
        return [true, [...steps, i]];
      }
    }
  }

  return [false, undefined];
}

function getTime(offset: number, mode: string, timeUnit: TimeUnit): number {
  let int = 0;
  let byte1 = getInt(offset, "uint8");
  let byte2 = getInt(offset + 0x1, "uint8");

  switch (mode) {
    case "time-1":
      int = ((byte1 << 8) + byte2) >> 6;
      break;
    case "time-2":
      int = ((byte1 & 0x3f) << 4) + (byte2 >> 4);
      break;
    case "time-3":
      int = ((byte1 & 0xf) << 6) + (byte2 >> 2);
      break;
    case "time-4":
      int = ((byte1 & 0x3) << 8) + byte2;
      break;
  }

  int = makeOperations(int, [{ convert: { from: "seconds", to: timeUnit } }]);

  return int;
}

export function overrideGetInt(
  item: Item,
): [boolean, number | string | undefined] {
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
      base <<= 6;
      byte2 &= 0x3f;

      setInt(itemInt.offset, "uint16", base + byte2, { bigEndian: true });
    } else if (item.id === "time-2") {
      byte1 = (byte1 >> 6) << 14;
      base <<= 4;
      byte2 &= 0xf;

      setInt(itemInt.offset, "uint16", byte1 + base + byte2, {
        bigEndian: true,
      });
    } else if (item.id === "time-3") {
      byte1 = (byte1 >> 4) << 12;
      base <<= 2;
      byte2 &= 0x3;

      setInt(itemInt.offset, "uint16", byte1 + base + byte2, {
        bigEndian: true,
      });
    } else if (item.id === "time-4") {
      byte1 = (byte1 >> 2) << 10;

      setInt(itemInt.offset, "uint16", byte1 + base, { bigEndian: true });
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

function getHash(int: number, polynormal: Long, shift: number) {
  const hash1 = polynormal
    .add(long(int).shiftLeft(long(shift).and(long(0xf))))
    .and(long(0x1ffffffff));

  const hash2 = hash1
    .shiftLeft(0x3f)
    .shiftRightUnsigned(0x1f)
    .or(hash1.shiftRightUnsigned(1))
    .xor(hash1.shiftLeft(0x2c).shiftRightUnsigned(0x20));

  return hash2.shiftRightUnsigned(0x14).and(long(0xfff)).xor(hash2);
}

function long(value: number) {
  return Long.fromNumber(value);
}

// Adapted from https://github.com/bryc/rare-n64-chksm
export function generateChecksum(
  item: ItemChecksum,
  dataView = new DataView(new ArrayBuffer(0)),
): bigint {
  let checksum1 = long(0);
  let polynormal = long(0x13108b3c1);
  let shift = 0;

  for (
    let i = item.control.offset;
    i < item.control.offset + item.control.length;
    i += 0x1, shift += 7
  ) {
    let int = 0x0;

    if (dataView.byteLength > 0) {
      int = dataView.getUint8(i);
    } else {
      int = getInt(i, "uint8");
    }

    polynormal = getHash(int, polynormal, shift);

    checksum1 = checksum1.xor(polynormal);
  }

  let checksum2 = checksum1;

  for (
    let i = item.control.offset + item.control.length - 1;
    i >= item.control.offset;
    i -= 0x1, shift += 3
  ) {
    let int = 0x0;

    if (dataView.byteLength > 0) {
      int = dataView.getUint8(i);
    } else {
      int = getInt(i, "uint8");
    }

    polynormal = getHash(int, polynormal, shift);

    checksum2 = checksum2.xor(polynormal);
  }

  const high = checksum1.toString(16).padStart(8, "0").slice(-8);
  const low = checksum1.xor(checksum2).toString(16).padStart(8, "0").slice(-8);

  return BigInt(`0x${high + low}`);
}
