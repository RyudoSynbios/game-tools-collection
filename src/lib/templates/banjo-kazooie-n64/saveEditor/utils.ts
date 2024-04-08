import Long from "long";
import { get } from "svelte/store";

import { fileHeaderShift, gameTemplate } from "$lib/stores";
import { getInt, setInt } from "$lib/utils/bytes";
import { byteswapDataView, getHeaderShift } from "$lib/utils/common/nintendo64";
import { clone, makeOperations } from "$lib/utils/format";

import type {
  Item,
  ItemChecksum,
  ItemContainer,
  ItemInt,
  ItemTab,
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

  const itemContainer = $gameTemplate.items[0] as ItemContainer;

  const itemSubinstance = clone(itemContainer).appendSubinstance![0] as ItemTab;

  const itemChecksum = itemSubinstance.items[0] as ItemChecksum;

  itemChecksum.offset += shift;
  itemChecksum.control.offsetStart += shift;
  itemChecksum.control.offsetEnd += shift;

  const checksum = generateChecksum(itemChecksum, dataView);

  if (
    checksum ===
    getInt(itemChecksum.offset, "uint32", { bigEndian: true }, dataView)
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
      let saveIndex = getInt($fileHeaderShift + i * item.length + 0x1, "uint8");

      if (saveIndex === 2) {
        saveIndex = 3;
      } else if (saveIndex === 3) {
        saveIndex = 2;
      }

      if (saveIndex === index + 1) {
        return [true, [...shifts, i * item.length]];
      }
    }
  }

  return [false, undefined];
}

function getNotesBinary(offset: number): string {
  let binary = "";

  for (let i = 0x0; i < 0x8; i += 0x1) {
    binary += getInt(offset + i, "uint8").toBinary();
  }

  return binary.substring(1);
}

export function overrideGetInt(item: Item): [boolean, number | undefined] {
  if ("id" in item && item.id === "playTime") {
    const itemInt = item as ItemInt;

    let int = 0;

    for (let i = 0x0; i < 0xb; i += 0x1) {
      int += getInt(itemInt.offset + i * 2, "uint16", { bigEndian: true });
    }

    int = makeOperations(int, [
      {
        convert: {
          from: "seconds",
          // @ts-ignore
          to: itemInt.operations[0].convert.to,
        },
      },
    ]);

    return [true, int];
  } else if ("id" in item && item.id === "totalJigsaws") {
    const itemInt = item as ItemInt;

    let int = 0;

    for (let i = 0x0; i < 0xd; i += 0x1) {
      int += getInt(itemInt.offset + i, "uint8").toBitCount();
    }

    return [true, int];
  } else if ("id" in item && item.id === "totalNotes") {
    const itemInt = item as ItemInt;

    let int = 0;

    const binary = getNotesBinary(itemInt.offset);

    for (let i = 0; i < 9; i += 1) {
      int += parseInt(binary.substring(i * 7, (i + 1) * 7), 2);
    }

    return [true, int];
  } else if ("id" in item && item.id?.match(/notes-/)) {
    const itemInt = item as ItemInt;

    const split = item.id.split("-");

    const index = parseInt(split[1]);

    const binary = getNotesBinary(itemInt.offset);

    const int = parseInt(binary.substring(index * 7, (index + 1) * 7), 2);

    return [true, int];
  }

  return [false, undefined];
}

export function overrideSetInt(item: Item, value: string): boolean {
  if ("id" in item && item.id?.match(/notes-/)) {
    const itemInt = item as ItemInt;

    const split = item.id.split("-");

    const index = parseInt(split[1]);

    let int = parseInt(value);

    let binary = getNotesBinary(itemInt.offset);

    binary = `0${binary.substring(0, index * 7)}${int
      .toBinary()
      .substring(1)}${binary.substring((index + 1) * 7)}`;

    for (let i = 0x0; i < 0x8; i += 0x1) {
      int = parseInt(binary.substring(i * 8, (i + 1) * 8), 2);

      setInt(itemInt.offset + i, "uint8", int);
    }

    return true;
  }

  return false;
}
export function afterSetInt(item: Item): void {
  if ("id" in item && item.id === "eggs") {
    const itemInt = item as ItemInt;

    let eggs = getInt(itemInt.offset, "uint8");
    const eggsMax = (getInt(itemInt.offset - 0xf, "bit", { bit: 6 }) + 1) * 100;

    eggs = Math.min(eggs, eggsMax);

    setInt(itemInt.offset, "uint8", eggs);
  } else if ("id" in item && item.id === "eggsMax") {
    const itemInt = item as ItemInt;

    let eggs = getInt(itemInt.offset + 0xf, "uint8");
    const eggsMax = (getInt(itemInt.offset, "bit", { bit: 6 }) + 1) * 100;

    eggs = Math.min(eggs, eggsMax);

    setInt(itemInt.offset + 0xf, "uint8", eggs);
  } else if ("id" in item && item.id === "redFeathers") {
    const itemInt = item as ItemInt;

    let redFeathers = getInt(itemInt.offset, "uint8");
    const redFeathersMax =
      (getInt(itemInt.offset - 0x10, "bit", { bit: 7 }) + 1) * 50;

    redFeathers = Math.min(redFeathers, redFeathersMax);

    setInt(itemInt.offset, "uint8", redFeathers);
  } else if ("id" in item && item.id === "redFeathersMax") {
    const itemInt = item as ItemInt;

    let redFeathers = getInt(itemInt.offset + 0x10, "uint8");
    const redFeathersMax = (getInt(itemInt.offset, "bit", { bit: 7 }) + 1) * 50;

    redFeathers = Math.min(redFeathers, redFeathersMax);

    setInt(itemInt.offset + 0x10, "uint8", redFeathers);
  } else if ("id" in item && item.id === "goldFeathers") {
    const itemInt = item as ItemInt;

    let goldFeathers = getInt(itemInt.offset, "uint8");
    const goldFeathersMax =
      (getInt(itemInt.offset - 0x10, "bit", { bit: 0 }) + 1) * 10;

    goldFeathers = Math.min(goldFeathers, goldFeathersMax);

    setInt(itemInt.offset, "uint8", goldFeathers);
  } else if ("id" in item && item.id === "goldFeathersMax") {
    const itemInt = item as ItemInt;

    let goldFeathers = getInt(itemInt.offset + 0x10, "uint8");
    const goldFeathersMax =
      (getInt(itemInt.offset, "bit", { bit: 0 }) + 1) * 10;

    goldFeathers = Math.min(goldFeathers, goldFeathersMax);

    setInt(itemInt.offset + 0x10, "uint8", goldFeathers);
  }
}

function getHash(int: number, polynormal: Long, shift: number): Long {
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

function long(value: number): Long {
  return Long.fromNumber(value);
}

// Adapted from https://github.com/bryc/rare-n64-chksm
export function generateChecksum(
  item: ItemChecksum,
  dataView = new DataView(new ArrayBuffer(0)),
): number {
  let checksum1 = long(0x0);
  let polynormal = long(0x13108b3c1);
  let shift = 0;

  for (
    let i = item.control.offsetStart;
    i < item.control.offsetEnd;
    i += 0x1, shift += 7
  ) {
    const int = getInt(i, "uint8", {}, dataView);

    polynormal = getHash(int, polynormal, shift);

    checksum1 = checksum1.xor(polynormal);
  }

  let checksum2 = checksum1;

  for (
    let i = item.control.offsetEnd - 1;
    i >= item.control.offsetStart;
    i -= 0x1, shift += 3
  ) {
    const int = getInt(i, "uint8", {}, dataView);

    polynormal = getHash(int, polynormal, shift);

    checksum2 = checksum2.xor(polynormal);
  }

  const checksum = checksum2.toString(16).padStart(8, "0").slice(-8);

  return parseInt(`0x${checksum}`);
}

export function beforeSaving(): ArrayBufferLike {
  return byteswapDataView("eep").buffer;
}
