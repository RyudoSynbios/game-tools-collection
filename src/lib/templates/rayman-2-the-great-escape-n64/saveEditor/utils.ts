import { copyInt, getInt, setInt, setString } from "$lib/utils/bytes";
import { formatChecksum } from "$lib/utils/checksum";
import { getHeaderShift } from "$lib/utils/common/nintendo64";
import {
  getMpkNoteShift,
  getRegionsFromMpk,
  getSaves,
  repackMpk,
  resetMpk,
  unpackMpk,
} from "$lib/utils/common/nintendo64/mpk";
import { getPartialValue, makeOperations } from "$lib/utils/format";

import type {
  Item,
  ItemBitflag,
  ItemBitflags,
  ItemChecksum,
  ItemContainer,
  ItemInt,
} from "$lib/types";

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

export function overrideParseContainerItemsShifts(
  item: ItemContainer,
  shifts: number[],
  index: number,
): [boolean, number[] | undefined] {
  const saves = getSaves();

  if (item.id === "slots") {
    if (index > saves.length - 1) {
      return [true, [-1]];
    }
  }

  return [false, undefined];
}

export function overrideItem(item: Item): Item {
  if ("id" in item && item.id === "health") {
    const itemInt = item as ItemInt;

    const maxHealth = getInt(itemInt.offset - 0x1, "uint8");

    itemInt.max = maxHealth;
  }

  return item;
}

export function overrideGetInt(item: Item): [boolean, number | undefined] {
  if ("id" in item && item.id === "completionRate") {
    const itemInt = item as ItemInt;

    const offset = itemInt.offset;

    const percent = getYellowLumCount(offset) / 10;

    return [true, percent];
  } else if ("id" in item && item.id === "header-level") {
    const itemInt = item as ItemInt;

    const level = getInt(itemInt.offset, "uint8");

    if (level === 0x0) {
      return [true, 0x3];
    }
  } else if ("id" in item && item.id === "raceTime") {
    const itemInt = item as ItemInt;

    const time = getInt(itemInt.offset, "uint32", { bigEndian: true });

    if (time === 0xc) {
      return [true, itemInt.max];
    }
  }

  return [false, undefined];
}

export function overrideSetInt(item: Item, value: string): boolean {
  if ("id" in item && item.id === "raceTime") {
    const itemInt = item as ItemInt;

    let oldInt = getInt(itemInt.offset, "uint32", { bigEndian: true });

    if (oldInt === 12) {
      oldInt = 359999;
    }

    let int = makeOperations(parseInt(value), itemInt.operations, true);
    int = getPartialValue(oldInt, int, itemInt.operations!);

    if (int === 12) {
      int = 13;
    } else if (int === 359999) {
      int = 12;
    }

    setInt(itemInt.offset, "uint32", int, { bigEndian: true });

    return true;
  }

  return false;
}

export function afterSetInt(item: Item, flag: ItemBitflag): void {
  if ("id" in item && item.id?.match(/header-/)) {
    const itemInt = item as ItemInt;

    copyInt(itemInt.offset, itemInt.offset + 0xe0);
  } else if ("id" in item && item.id?.match(/yellowLums-/)) {
    const itemBitflags = item as ItemBitflags;

    const [shift] = item.id.splitInt();

    // Super Yellow Lum check

    const checked = getInt(flag.offset, "bit", { bit: flag.bit });

    const index = itemBitflags.flags.findIndex(
      (item) => item.offset === flag.offset && item.bit === flag.bit,
    );

    const hiddenFlag = itemBitflags.flags[index + 1];

    if (hiddenFlag.hidden) {
      for (let i = 1; i < 5; i += 1) {
        const flag = itemBitflags.flags[index + i];

        setInt(flag.offset, "bit", checked, { bit: flag.bit });
      }
    }

    // Count obtained Yellow Lums

    const offset = itemBitflags.flags[0].offset - shift;

    const count = `${getYellowLumCount(offset)}`.padStart(4, "0");

    setString(offset - 0x1d, 0x4, "uint8", count);
    setString(offset + 0xc3, 0x4, "uint8", count);
  } else if ("id" in item && item.id?.match(/cages-/)) {
    const itemBitflags = item as ItemBitflags;

    const [shift] = item.id.splitInt();

    const offset = itemBitflags.flags[0].offset - shift;

    let count = 0;

    for (let i = 0x0; i < 0xb; i += 0x1) {
      count += getInt(offset + i, "uint8").toBitCount();
    }

    setInt(offset - 0x43, "uint8", count);

    const maxHealth = count + 30;

    setInt(offset - 0x46, "uint8", maxHealth);
    setInt(offset - 0x47, "uint8", maxHealth);
  }
}

export function generateChecksum(item: ItemChecksum): number {
  let checksum = 0x0;

  for (let i = item.control.offsetStart; i < item.control.offsetEnd; i += 0x1) {
    if (i - item.control.offsetStart < 0x1c) {
      checksum += getInt(i, "int8");
    } else {
      checksum += getInt(i, "uint8");
    }
  }

  return formatChecksum(checksum, item.dataType);
}

export function beforeSaving(): ArrayBufferLike {
  return repackMpk();
}

export function onReset(): void {
  resetMpk();
}

function getYellowLumCount(offset: number): number {
  let count = 0;

  for (let i = 0x0; i < 0x19; i += 0x1) {
    count += getInt(offset + i, "uint8").toBitCount();
  }

  for (let i = 0x0; i < 0x64; i += 0x1) {
    count += getInt(offset + 0x4b + i, "uint8").toBitCount();
  }

  const secretYellowLum = getInt(offset + 0x30, "bit", { bit: 5 });

  if (count === 999 && secretYellowLum) {
    count = 1000;
  }

  return count;
}
