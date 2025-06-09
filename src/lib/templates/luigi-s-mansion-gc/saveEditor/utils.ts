import { get } from "svelte/store";

import { gameRegion } from "$lib/stores";
import { getInt, setInt } from "$lib/utils/bytes";
import { formatChecksum } from "$lib/utils/checksum";
import { getShift } from "$lib/utils/parser";

import { Item, ItemChecksum, ItemInt } from "$lib/types";

export function initShifts(shifts: number[]): number[] {
  const shift = getShift(shifts);

  const section1Saves = getInt(shift + 0x2040, "uint32", { bigEndian: true });
  const section2Saves = getInt(shift + 0x4040, "uint32", { bigEndian: true });

  if (section2Saves !== 0xffff && section2Saves > section1Saves) {
    return [...shifts, 0x2000];
  }

  return shifts;
}

export function overrideParseItem(item: Item): Item {
  const $gameRegion = get(gameRegion);

  if ("id" in item && item.id === "language") {
    const itemInt = item as ItemInt;

    itemInt.hidden = $gameRegion !== 0;

    return itemInt;
  }

  return item;
}

export function overrideGetInt(item: Item): [boolean, number | undefined] {
  if ("id" in item && item.id === "area") {
    const itemInt = item as ItemInt;

    let area = 1;

    area += getInt(itemInt.offset, "bit", { bit: 0 });
    area += getInt(itemInt.offset + 0x12, "bit", { bit: 5 });
    area += getInt(itemInt.offset + 0x13, "bit", { bit: 4 });

    return [true, area];
  }

  return [false, undefined];
}

export function overrideSetInt(item: Item, value: string): boolean {
  if ("id" in item && item.id === "area") {
    const itemInt = item as ItemInt;

    const area = parseInt(value);

    setInt(itemInt.offset, "bit", area >= 2 ? 1 : 0, { bit: 0 });
    setInt(itemInt.offset + 0x12, "bit", area >= 3 ? 1 : 0, { bit: 5 });
    setInt(itemInt.offset + 0x13, "bit", area >= 4 ? 1 : 0, { bit: 4 });

    return true;
  }

  return false;
}

export function generateChecksum(item: ItemChecksum): number {
  let checksum1 = 0x0;
  let checksum2 = 0xf002;

  for (let i = item.control.offsetStart; i < item.control.offsetEnd; i += 0x2) {
    checksum1 += getInt(i, "uint16", { bigEndian: true });
    checksum2 -= getInt(i, "uint16", { bigEndian: true });
  }

  const checksum = (checksum1 << 0x10) | (checksum2 & 0xffff);

  return formatChecksum(checksum, item.dataType);
}
