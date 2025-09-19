import { get } from "svelte/store";

import { gameRegion } from "$lib/stores";
import { getInt, setInt } from "$lib/utils/bytes";
import { formatChecksum } from "$lib/utils/checksum";
import { getShift } from "$lib/utils/parser";

import {
  Item,
  ItemBitflags,
  ItemChecksum,
  ItemContainer,
  ItemInt,
} from "$lib/types";

export function overrideParseItem(item: Item): Item {
  const $gameRegion = get(gameRegion);

  if ("id" in item && item.id === "subtitles") {
    const itemInt = item as ItemInt;

    itemInt.hidden = $gameRegion === 2;

    return itemInt;
  } else if ("id" in item && item.id === "language") {
    const itemInt = item as ItemInt;

    itemInt.hidden = $gameRegion !== 0;

    return itemInt;
  }

  return item;
}

export function overrideParseContainerItemsShifts(
  item: ItemContainer,
  shifts: number[],
  index: number,
): [boolean, number[] | undefined] {
  if (item.id === "slots") {
    const shift = getShift(shifts);

    let offset = index * 0x4000 + 0x2040;

    const section1Saves = getInt(shift + offset, "uint32", { bigEndian: true });
    const section2Saves = getInt(shift + offset + 0x2000, "uint32", {
      bigEndian: true,
    });

    if (section2Saves > section1Saves) {
      offset += 0x2000;
    }

    return [true, [...shifts, offset]];
  }

  return [false, undefined];
}

export function overrideGetInt(item: Item): [boolean, number | undefined] {
  if ("id" in item && item.id === "totalBlueCoins") {
    const itemInt = item as ItemInt;

    let count = 0;

    for (let i = 0x0; i < 0x36; i += 0x1) {
      count += getInt(itemInt.offset + i, "uint8").toBitCount();
    }

    return [true, count];
  } else if ("id" in item && item.id === "sound") {
    const itemInt = item as ItemInt;

    let int = 0x0;

    int += getInt(itemInt.offset, "bit", { bit: 1 });
    int += getInt(itemInt.offset + 0x1, "bit", { bit: 1 }) << 0x1;

    return [true, int];
  }

  return [false, undefined];
}

export function overrideSetInt(item: Item, value: string): boolean {
  if ("id" in item && item.id === "sound") {
    const itemInt = item as ItemInt;

    const int = parseInt(value);

    setInt(itemInt.offset, "bit", (int & 0x1) !== 0x0 ? 1 : 0, { bit: 1 });
    setInt(itemInt.offset + 0x1, "bit", int >> 0x1 ? 1 : 0, { bit: 1 });

    return true;
  }

  return false;
}

export function afterSetInt(item: Item): void {
  if ("id" in item && item.id?.match(/shineSprites-/)) {
    const itemBitflags = item as ItemBitflags;

    const [shift] = item.id.splitInt();

    const offset = itemBitflags.flags[0].offset - shift;

    let count = 0;

    for (let i = 0x0; i < 0xf; i += 0x1) {
      count += getInt(offset + i, "uint8").toBitCount();
    }

    setInt(offset - 0x44, "uint16", count, { bigEndian: true });
  }
}

export function generateChecksum(item: ItemChecksum): number {
  let checksum1 = 0x0;
  let checksum2 = 0x0;

  for (let i = item.control.offsetStart; i < item.control.offsetEnd; i += 0x2) {
    checksum1 += getInt(i, "uint16", { bigEndian: true });
    checksum2 += ~getInt(i, "uint16", { bigEndian: true });
  }

  const checksum = (checksum1 << 0x10) | (checksum2 & 0xffff);

  return formatChecksum(checksum, item.dataType);
}
