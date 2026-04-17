import { get } from "svelte/store";

import { gameRegion } from "$lib/stores";
import { getBitflag, getInt, setInt } from "$lib/utils/bytes";
import { formatChecksum } from "$lib/utils/checksum";
import { getItem } from "$lib/utils/parser";

import type {
  Item,
  ItemBitflag,
  ItemChecksum,
  ItemInt,
  ItemString,
} from "$lib/types";

export function overrideParseItem(item: Item): Item {
  const $gameRegion = get(gameRegion);

  if ("id" in item && item.id === "name") {
    const itemString = item as ItemString;

    const isAscii = getInt(itemString.offset, "uint8") === 0x6;

    if (isAscii) {
      itemString.offset = itemString.offset + 0x1;
      itemString.letterDataType = "uint8";
      itemString.fallback = 0x20;
      itemString.resource = "lettersAscii";
    }

    return itemString;
  } else if ("id" in item && item.id === "language") {
    const itemInt = item as ItemInt;

    itemInt.hidden = $gameRegion !== 0;

    return itemInt;
  }

  return item;
}

export function overrideGetInt(item: Item): [boolean, number | undefined] {
  if ("id" in item && item.id === "duelAnimation") {
    const itemInt = item as ItemInt;

    const int =
      (getInt(itemInt.offset, "uint8") << 0x1) |
      getInt(itemInt.offset + 0x2, "uint8");

    return [true, int];
  }

  return [false, undefined];
}

export function overrideSetInt(item: Item, value: string): boolean {
  if ("id" in item && item.id === "duelAnimation") {
    const itemInt = item as ItemInt;

    const int = parseInt(value);

    setInt(itemInt.offset, "uint8", int >> 0x1);
    setInt(itemInt.offset + 0x2, "uint8", int & 0x1);

    return true;
  }

  return false;
}

export function afterSetInt(item: Item, flag: ItemBitflag): void {
  if ("id" in item && item.id === "location") {
    const itemInt = item as ItemInt;

    const int = getInt(itemInt.offset, "uint8");

    let locationSavePreview = 0x0;

    if ([0x0, 0x1, 0x2].includes(int)) {
      locationSavePreview = 0x1;
    } else if (int === 0x3) {
      locationSavePreview = 0x2;
    } else if ([0x4, 0x5, 0x6].includes(int)) {
      locationSavePreview = 0x3;
    } else if ([0x7, 0x8, 0x9].includes(int)) {
      locationSavePreview = 0x4;
    } else if ([0xa, 0xb, 0xc].includes(int)) {
      locationSavePreview = 0x5;
    } else if ([0xd, 0xe, 0xf].includes(int)) {
      locationSavePreview = 0x6;
    } else if ([0x10, 0x11, 0x12].includes(int)) {
      locationSavePreview = 0x7;
    } else if ([0x13, 0x14, 0x15].includes(int)) {
      locationSavePreview = 0x8;
    } else if ([0x16, 0x17, 0x18].includes(int)) {
      locationSavePreview = 0x9;
    } else if ([0x19, 0x1a, 0x1b].includes(int)) {
      locationSavePreview = 0xa;
    } else if ([0x1c, 0x1d, 0x1e].includes(int)) {
      locationSavePreview = 0xb;
    } else if ([0x1f, 0x20, 0x21].includes(int)) {
      locationSavePreview = 0xc;
    }

    setInt(itemInt.offset - 0x7, "uint8", locationSavePreview);
    setInt(itemInt.offset - 0x1, "uint8", locationSavePreview);
  } else if ("id" in item && item.id === "masterMedals") {
    const int = getInt(flag.offset, "uint8").toBitCount();

    setInt(flag.offset - 0x73, "uint8", int);
  } else if ("id" in item && item.id === "collection") {
    const isChecked = getBitflag(flag.offset, flag.bit, { reversed: true });

    const album = getItem("album") as ItemInt;

    const int = getInt(album.offset, "uint8") + (isChecked ? 1 : -1);

    setInt(album.offset, "uint8", int);
  }
}

export function generateChecksum(item: ItemChecksum): number {
  let checksum = 0x0;

  for (let i = item.control.offsetStart; i < item.control.offsetEnd; i += 0x1) {
    checksum += getInt(i, "uint8");
  }

  return formatChecksum(checksum, item.dataType);
}
