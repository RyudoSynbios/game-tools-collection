import { get } from "svelte/store";

import { gameRegion } from "$lib/stores";
import { extractBit, getInt, setInt } from "$lib/utils/bytes";
import { formatChecksum } from "$lib/utils/checksum";

import type {
  Item,
  ItemBitflags,
  ItemChecksum,
  ItemInt,
  ItemTabs,
} from "$lib/types";

export function overrideItem(item: Item): Item {
  const $gameRegion = get(gameRegion);

  if ("id" in item && item.id === "main") {
    const itemTabs = item as ItemTabs;

    if ($gameRegion !== 0) {
      itemTabs.items[3].hidden = true;
    }

    return itemTabs;
  }

  return item;
}

export function overrideGetInt(item: Item): [boolean, number | undefined] {
  if ("id" in item && item.id === "language") {
    const itemInt = item as ItemInt;

    const int = getInt(itemInt.offset, "uint8");

    let language = 0x0;

    switch (int) {
      case 0x46:
        language = 0x1;
        break;
      case 0x47:
        language = 0x2;
        break;
    }

    return [true, language];
  } else if ("id" in item && item.id?.match(/progression-cleared/)) {
    const itemInt = item as ItemInt;

    const progression = getInt(itemInt.offset, "uint8") & 0x81;

    return [true, progression];
  }

  return [false, undefined];
}

export function overrideSetInt(item: Item, value: string): boolean {
  if ("id" in item && item.id === "language") {
    const itemInt = item as ItemInt;

    const int = parseInt(value);

    let language: number[] = [];

    switch (int) {
      case 0:
        language = [0x45, 0x4e, 0x47, 0x4c, 0x49, 0x53, 0x48, 0x20]; // "ENGLISH "
        break;
      case 1:
        language = [0x46, 0x52, 0x45, 0x4e, 0x43, 0x48, 0x20, 0x20]; // "FRENCH  "
        break;
      case 2:
        language = [0x47, 0x45, 0x52, 0x4d, 0x41, 0x4e, 0x20, 0x20]; // "GERMAN  "
        break;
    }

    language.forEach((char, index) => {
      setInt(itemInt.offset + index, "uint8", char);
    });

    return true;
  } else if ("id" in item && item.id?.match(/progression-cleared/)) {
    const itemInt = item as ItemInt;

    const int = parseInt(value);

    let progression = getInt(itemInt.offset, "uint8") & 0x7e;

    if (extractBit(int, 0)) {
      progression |= 0x1;
    }

    if (extractBit(int, 7)) {
      progression |= 0x80;
    }

    setInt(itemInt.offset, "uint8", progression);

    return true;
  }

  return false;
}

export function afterSetInt(item: Item): void {
  if ("id" in item && item.id?.match(/progression-cleared/)) {
    const itemInt = item as ItemInt;

    const [shift] = item.id.splitInt();

    let offset = 0x0;

    switch (shift) {
      case 96: // Gang-Plank Galleon
        offset += 0xa;
        break;
      case 226: // Very Gnawty's Lair
        offset += 0xc;
        break;
      case 227: // Necky's Nuts
        offset += 0xc;
        break;
      case 228: // Really Gnawty Rampage
        offset += 0x6;
        break;
      case 229: // Boss Dumb Drum
        offset += 0x4;
        break;
      case 230: // Necky's Revenge
        offset += 0x2;
        break;
      case 231: // Bumble B Rumble
        offset += 0x4;
        break;
    }

    if (offset) {
      const int = getInt(itemInt.offset, "uint8") & 0x81;

      setInt(itemInt.offset + offset, "uint8", int);
    }

    updateCompletionRate(itemInt.offset - shift);
  } else if ("id" in item && item.id?.match(/progression-bonusRooms/)) {
    const itemBitflags = item as ItemBitflags;

    const [shift] = item.id.splitInt();

    updateCompletionRate(itemBitflags.flags[0].offset - shift);
  }
}

export function generateChecksum(item: ItemChecksum): number {
  let checksumByte1 = 0xa486;
  let checksumByte2 = 0x4;

  for (let i = item.control.offsetStart; i < item.control.offsetEnd; i += 0x2) {
    checksumByte1 += getInt(i, "uint16");
    checksumByte2 ^= getInt(i, "uint16");
  }

  const checksum = (checksumByte1 << 0x10) | (checksumByte2 & 0xffff);

  return formatChecksum(checksum, item.dataType);
}

function updateCompletionRate(offset: number): void {
  let percent = 0;

  for (let i = 0x1; i < 0xe2; i += 0x1) {
    if (i !== 0x6a) {
      percent += (getInt(offset + i, "uint8") & 0x7f).toBitCount();
    }
  }

  setInt(offset, "uint8", percent);
}
