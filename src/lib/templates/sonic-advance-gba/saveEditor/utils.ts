import { get } from "svelte/store";

import { gameRegion } from "$lib/stores";
import { getInt, getString, setInt } from "$lib/utils/bytes";
import { formatChecksum } from "$lib/utils/checksum";
import { getHeaderShift } from "$lib/utils/common/gameBoyAdvance";
import { getPartialValue, makeOperations } from "$lib/utils/format";
import { getShift } from "$lib/utils/parser";

import type { Item, ItemChecksum, ItemInt } from "$lib/types";

export function initHeaderShift(dataView: DataView): number {
  return getHeaderShift(dataView);
}

export function initShifts(shifts: number[]): number[] {
  const shift = getShift(shifts);

  let section = 0;

  for (let i = 0x1; i < 0xa; i += 0x1) {
    const magic = getString(shift + i * 0x1000, 0x4, "uint8");

    if (magic !== "PIRO") {
      break;
    }

    section = i;
  }

  return [...shifts, section * 0x1000];
}

export function overrideParseItem(item: Item): Item {
  const $gameRegion = get(gameRegion);

  if (
    "id" in item &&
    item.id?.match(/language-chaos|option/) &&
    $gameRegion !== 0
  ) {
    const itemInt = item as ItemInt;

    itemInt.offset -= 0x1;

    return itemInt;
  }

  return item;
}

export function overrideGetInt(item: Item): [boolean, number | undefined] {
  if ("id" in item && item.id === "time") {
    const itemInt = item as ItemInt;

    const time = getInt(itemInt.offset, "uint32");

    if (time === 36000) {
      return [true, makeOperations(time - 1, itemInt.operations)];
    }
  } else if ("id" in item && item.id === "vsResult-0") {
    const itemInt = item as ItemInt;

    const wins = getInt(itemInt.offset, "uint8");

    if (wins === 0xff) {
      return [true, 0x0];
    }
  }

  return [false, undefined];
}

export function overrideSetInt(item: Item, value: string): boolean {
  if ("id" in item && item.id === "time") {
    const itemInt = item as ItemInt;

    const oldInt = getInt(itemInt.offset, "uint32");

    let int = makeOperations(parseInt(value), itemInt.operations, true);
    int = getPartialValue(oldInt, int, itemInt.operations!);

    if (int === 35999) {
      int = 36000;
    } else {
      int = Math.min(int, 35994);
    }

    setInt(itemInt.offset, "uint32", int);

    return true;
  }

  return false;
}

export function afterSetInt(item: Item): void {
  if ("id" in item && item.id === "progression") {
    const itemInt = item as ItemInt;

    const clear = getInt(itemInt.offset, "uint16") === 0xf;

    setInt(itemInt.offset + 0x41c, "bit", clear ? 1 : 0, { bit: 0 });
  } else if ("id" in item && item.id?.match(/vsResult-/)) {
    const itemInt = item as ItemInt;

    const [shift] = item.id.splitInt();

    const offset = itemInt.offset - shift;

    let wins = getInt(offset, "uint8");
    const losses = getInt(offset + 0x1, "uint8");
    const draws = getInt(offset + 0x2, "uint8");

    if (wins + losses + draws === 0) {
      wins = 0xff;
    } else if (wins === 0xff) {
      wins = 0x0;
    }

    setInt(offset, "uint8", wins);
  } else if ("id" in item && item.id === "language-chaos") {
    const itemInt = item as ItemInt;

    const language = getInt(itemInt.offset, "uint8");

    const menu = language === 0x0 ? 0x0 : 0x1;

    setInt(itemInt.offset - 0x1, "uint8", menu);
  }
}

export function generateChecksum(item: ItemChecksum): number {
  let checksum = 0x0;

  for (let i = item.control.offsetStart; i < item.control.offsetEnd; i += 0x4) {
    checksum += getInt(i, "uint32");
  }

  return formatChecksum(checksum, item.dataType);
}
