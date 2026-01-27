import { bitToOffset, copyInt, getInt, setInt } from "$lib/utils/bytes";
import { formatChecksum, generateCrcCcitt } from "$lib/utils/checksum";
import { getHeaderShift } from "$lib/utils/common/nintendoDs";
import { getShift } from "$lib/utils/parser";

import type { Item, ItemBitflag, ItemChecksum, ItemInt } from "$lib/types";

export function initHeaderShift(dataView: DataView): number {
  return getHeaderShift(dataView);
}

export function initShifts(shifts: number[]): number[] {
  const shift = getShift(shifts);

  let section = 0;
  let bestSaveCount = 0;

  for (let i = 0x0; i < 0xa; i += 0x1) {
    const saveCount = getInt(shift + i * 0x320 + 0x10, "uint32");

    if (saveCount > bestSaveCount) {
      section = i;
      bestSaveCount = saveCount;
    }
  }

  return [...shifts, section * 0x320];
}

export function overrideParseItem(item: Item): Item {
  if ("id" in item && item.id?.match(/timeAttackCharacter-/)) {
    const itemInt = item as ItemInt;

    const [, zone, act, place] = item.id.splitInt();

    const bit = zone * 0x18 + act * 0x8 + place;

    itemInt.offset += bitToOffset(bit);
    itemInt.bit! = bit % 8;

    return itemInt;
  }

  return item;
}

export function overrideItem(item: Item): Item {
  if ("id" in item && item.id === "time") {
    const itemInt = item as ItemInt;

    const time = getInt(itemInt.offset, "uint16");

    itemInt.disabled = time === 0xffff;

    return itemInt;
  }

  return item;
}

export function overrideGetInt(item: Item): [boolean, number | undefined] {
  if ("id" in item && item.id?.match(/timeAttackCharacter-/)) {
    const itemInt = item as ItemInt;

    const [type, zone, act, place] = item.id.splitInt();

    const bit = zone * 0x18 + act * 0x8 + place;

    const offset = getTimeOffset(type, itemInt.offset, bit);

    const time = getInt(offset, "uint16");

    let int = 0x0;

    if (time !== 0xffff) {
      int = 1 + getInt(itemInt.offset, "bit", { bit: itemInt.bit });
    }

    return [true, int];
  } else if ("id" in item && item.id === "time") {
    const itemInt = item as ItemInt;

    if (itemInt.disabled) {
      return [true, 0x0];
    }
  }

  return [false, undefined];
}

export function overrideSetInt(item: Item, value: string): boolean {
  if ("id" in item && item.id?.match(/timeAttackCharacter-/)) {
    const itemInt = item as ItemInt;

    const [type, zone, act, place] = item.id.splitInt();

    const bit = zone * 0x18 + act * 0x8 + place;

    const int = parseInt(value);

    const offset = getTimeOffset(type, itemInt.offset, bit);

    const time = getInt(offset, "uint16");

    if (int === 0) {
      setInt(offset, "uint16", 0xffff);
    } else if (time === 0xffff) {
      setInt(offset, "uint16", 0x8c9f);
    }

    setInt(itemInt.offset, "bit", Math.max(0, int - 1), { bit: itemInt.bit });

    return true;
  }

  return false;
}

export function afterSetInt(item: Item, flag: ItemBitflag): void {
  if ("id" in item && item.id?.match(/progression-/)) {
    const itemInt = item as ItemInt;

    const [, character] = item.id.split("-");

    const progression = getInt(itemInt.offset, "uint16");

    const offset = itemInt.offset - (character === "sonic" ? 0x2 : 0x5a);

    if (character === "sonic") {
      setInt(offset, "bit", progression === 0x1a ? 1 : 0, { bit: 3 });
    } else if (character === "blaze") {
      setInt(offset, "bit", progression === 0x1c ? 1 : 0, { bit: 4 });
    }

    updateMainProgression(offset);
  } else if ("id" in item && item.id === "chaosEmeralds") {
    copyInt(flag.offset, flag.offset + 0x58);

    updateMainProgression(flag.offset - 0x5);
  }
}

export function generateChecksum(item: ItemChecksum): number {
  const checksum = ~generateCrcCcitt(item);

  return formatChecksum(checksum, item.dataType);
}

function getTimeOffset(type: number, offset: number, index: number): number {
  offset -= bitToOffset(index);

  if (type === 0) {
    offset += 0x16;
  } else if (type === 1) {
    offset += 0x4;
  }

  const actIndex = Math.floor(index / 0x8);

  index = actIndex * 0x5 + (index - actIndex * 0x8);

  return offset + index * 0x2;
}

function updateMainProgression(offset: number): void {
  const isSonicCleared = getInt(offset, "bit", { bit: 3 });
  const isBlazeCleared = getInt(offset, "bit", { bit: 4 });
  const chaosEmeralds = getInt(offset + 0x5, "uint8").toBitCount();

  const checked = isSonicCleared && isBlazeCleared && chaosEmeralds === 7;

  setInt(offset, "bit", checked ? 1 : 0, { bit: 5 });
}
