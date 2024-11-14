import { get } from "svelte/store";

import { gameRegion } from "$lib/stores";
import {
  extractBit,
  getBoolean,
  getInt,
  setBoolean,
  setInt,
} from "$lib/utils/bytes";
import { formatChecksum } from "$lib/utils/checksum";
import { byteswapDataView, getHeaderShift } from "$lib/utils/common/nintendo64";
import { getShift } from "$lib/utils/parser";

import type {
  Item,
  ItemBoolean,
  ItemChecksum,
  ItemContainer,
  ItemInt,
  ItemString,
  ItemTab,
} from "$lib/types";

export function initHeaderShift(dataView: DataView): number {
  return getHeaderShift(dataView, "fla");
}

export function beforeInitDataView(dataView: DataView): DataView {
  return byteswapDataView("fla", dataView);
}

export function overrideParseItem(item: Item): Item | ItemTab {
  const $gameRegion = get(gameRegion);

  if ("id" in item && item.id === "checksum" && $gameRegion === 2) {
    const itemChecksum = item as ItemChecksum;

    itemChecksum.offset += 0x384;

    return itemChecksum;
  } else if ("id" in item && item.id === "filename" && $gameRegion === 2) {
    const itemString = item as ItemString;

    if (itemString.fallback) {
      itemString.fallback = 0xdf;
    }

    return itemString;
  } else if ("id" in item && item.id === "owlFile" && $gameRegion === 2) {
    const itemTab = item as ItemTab;

    itemTab.disabled = true;

    return itemTab;
  } else if ("id" in item && item.id === "mask" && $gameRegion === 2) {
    const itemBoolean = item as ItemBoolean;

    if (itemBoolean.on) {
      itemBoolean.on += 0x1c;
    }

    return itemBoolean;
  } else if (
    "id" in item &&
    (item.id === "hideoutCode" || item.id === "coloredMasks") &&
    $gameRegion === 2
  ) {
    const itemString = item as ItemString;

    itemString.offset += 0x384;

    return itemString;
  }

  return item;
}

export function overrideParseContainerItemsShifts(
  item: ItemContainer,
  shifts: number[],
  index: number,
): [boolean, number[] | undefined] {
  const $gameRegion = get(gameRegion);

  if (item.id === "slots" && $gameRegion !== 2 && index !== 2) {
    const shift = getShift(shifts);

    let offset = 0x0;

    if (index === 0) {
      offset = 0x8000;
    } else if (index === 1) {
      offset = 0x10000;
    }

    const isValid = getInt(shift + offset + 0x24, "uint8") === 0x5a;

    if (isValid) {
      return [true, [...shifts, offset]];
    }
  } else if (item.id === "slots" && $gameRegion !== 2 && index === 2) {
    const shift = getShift(shifts);

    const offset = shift + 0x18000;

    return [true, [...shifts, offset]];
  }

  return [false, undefined];
}

export function overrideGetInt(
  item: Item,
): [boolean, number | string | undefined] {
  if ("id" in item && item.id === "heartPieces") {
    const itemInt = item as ItemInt;

    const value = getInt(itemInt.offset, "uint8");

    let int = 0;

    if (extractBit(value, 4)) {
      int += 1;
    }

    if (extractBit(value, 5)) {
      int += 2;
    }

    return [true, int];
  } else if ("id" in item && item.id === "quiver") {
    const itemInt = item as ItemInt;

    const value = getInt(itemInt.offset, "uint8");

    let int = 0;

    if (extractBit(value, 0)) {
      int += 1;
    }

    if (extractBit(value, 1)) {
      int += 2;
    }

    return [true, int];
  } else if ("id" in item && item.id === "bombBag") {
    const itemInt = item as ItemInt;

    const value = getInt(itemInt.offset, "uint8");

    let int = 0;

    if (extractBit(value, 3)) {
      int += 1;
    }

    if (extractBit(value, 4)) {
      int += 2;
    }

    return [true, int];
  } else if ("id" in item && item.id === "wallet") {
    const itemInt = item as ItemInt;

    let int = 0x0;

    const value = getInt(itemInt.offset, "uint8");

    if (extractBit(value, 4)) {
      int = 0x1;
    } else if (extractBit(value, 5)) {
      int = 0x2;
    }

    return [true, int];
  } else if ("id" in item && item.id === "hideoutCode") {
    const itemString = item as ItemString;

    let string = "";

    for (let i = 0x0; i < itemString.length; i += 0x1) {
      string += getInt(itemString.offset + i, "uint8");
    }

    return [true, string];
  } else if ("id" in item && item.id === "coloredMasks") {
    const itemString = item as ItemString;

    const colors = ["R", "B", "Y", "G"];

    let string = "";

    for (let i = 0x0; i < itemString.length; i += 0x1) {
      string += colors[getInt(itemString.offset + i, "uint8")];
    }

    return [true, string];
  }

  return [false, undefined];
}

export function overrideSetInt(item: Item, value: string): boolean {
  if ("id" in item && item.id === "heartPieces") {
    const itemInt = item as ItemInt;

    const int = parseInt(value);

    if (int === 0x1) {
      setInt(itemInt.offset, "bit", 0x1, { bit: 4 });
      setInt(itemInt.offset, "bit", 0x0, { bit: 5 });
    } else if (int === 0x2) {
      setInt(itemInt.offset, "bit", 0x0, { bit: 4 });
      setInt(itemInt.offset, "bit", 0x1, { bit: 5 });
    } else if (int === 0x3) {
      setInt(itemInt.offset, "bit", 0x1, { bit: 4 });
      setInt(itemInt.offset, "bit", 0x1, { bit: 5 });
    } else {
      setInt(itemInt.offset, "bit", 0x0, { bit: 4 });
      setInt(itemInt.offset, "bit", 0x0, { bit: 5 });
    }

    return true;
  } else if ("id" in item && item.id === "quiver") {
    const itemInt = item as ItemInt;

    const int = parseInt(value);

    if (int === 0x1) {
      setInt(itemInt.offset, "bit", 0x1, { bit: 0 });
      setInt(itemInt.offset, "bit", 0x0, { bit: 1 });
    } else if (int === 0x2) {
      setInt(itemInt.offset, "bit", 0x0, { bit: 0 });
      setInt(itemInt.offset, "bit", 0x1, { bit: 1 });
    } else if (int === 0x3) {
      setInt(itemInt.offset, "bit", 0x1, { bit: 0 });
      setInt(itemInt.offset, "bit", 0x1, { bit: 1 });
    } else {
      setInt(itemInt.offset, "bit", 0x0, { bit: 0 });
      setInt(itemInt.offset, "bit", 0x0, { bit: 1 });
    }

    return true;
  } else if ("id" in item && item.id === "bombBag") {
    const itemInt = item as ItemInt;

    const int = parseInt(value);

    if (int === 0x1) {
      setInt(itemInt.offset, "bit", 0x1, { bit: 3 });
      setInt(itemInt.offset, "bit", 0x0, { bit: 4 });
    } else if (int === 0x2) {
      setInt(itemInt.offset, "bit", 0x0, { bit: 3 });
      setInt(itemInt.offset, "bit", 0x1, { bit: 4 });
    } else if (int === 0x3) {
      setInt(itemInt.offset, "bit", 0x1, { bit: 3 });
      setInt(itemInt.offset, "bit", 0x1, { bit: 4 });
    } else {
      setInt(itemInt.offset, "bit", 0x0, { bit: 3 });
      setInt(itemInt.offset, "bit", 0x0, { bit: 4 });
    }

    return true;
  } else if ("id" in item && item.id === "wallet") {
    const itemInt = item as ItemInt;

    const int = parseInt(value);

    if (int === 0x1) {
      setInt(itemInt.offset, "bit", 0x1, { bit: 4 });
      setInt(itemInt.offset, "bit", 0x0, { bit: 5 });
    } else if (int === 0x2) {
      setInt(itemInt.offset, "bit", 0x0, { bit: 4 });
      setInt(itemInt.offset, "bit", 0x1, { bit: 5 });
    } else {
      setInt(itemInt.offset, "bit", 0x0, { bit: 4 });
      setInt(itemInt.offset, "bit", 0x0, { bit: 5 });
    }

    return true;
  }

  return false;
}

export function afterSetInt(item: Item): void {
  if ("id" in item && item.id === "health") {
    const itemInt = item as ItemInt;

    let health = getInt(itemInt.offset, "uint16", { bigEndian: true });
    const healthMax = getInt(itemInt.offset - 0x2, "uint16", {
      bigEndian: true,
    });

    health = Math.min(health, healthMax);

    setInt(itemInt.offset, "uint16", health, { bigEndian: true });
  } else if ("id" in item && item.id === "healthMax") {
    const itemInt = item as ItemInt;

    let health = getInt(itemInt.offset + 0x2, "uint16", { bigEndian: true });
    const healthMax = getInt(itemInt.offset, "uint16", { bigEndian: true });

    health = Math.min(health, healthMax);

    setInt(itemInt.offset + 0x2, "uint16", health, { bigEndian: true });

    let int = 0;

    const hasDoubleDefense = getBoolean(itemInt.offset + 0xe);

    if (hasDoubleDefense) {
      int = healthMax / 16;
    }

    setInt(itemInt.offset + 0x9f, "uint8", int);
  } else if ("id" in item && item.id === "magic") {
    const itemInt = item as ItemInt;

    let magic = getInt(itemInt.offset, "uint8");
    const magicMax = getInt(itemInt.offset - 0x1, "uint8");

    if (magicMax === 0x1) {
      magic = Math.min(48, magic);
    } else if (magicMax === 0x2) {
      magic = Math.min(96, magic);
    } else {
      magic = Math.min(0, magic);
    }

    setInt(itemInt.offset, "uint8", magic);
  } else if ("id" in item && item.id === "magicLevel") {
    const itemInt = item as ItemInt;

    const int = getInt(itemInt.offset, "uint8");

    const magic = getInt(itemInt.offset + 0x1, "uint8");

    if (int === 0x1) {
      setBoolean(itemInt.offset + 0x9, false);
      setBoolean(itemInt.offset + 0x8, true);
      setInt(itemInt.offset + 0x1, "uint8", Math.min(48, magic));
    } else if (int === 0x2) {
      setBoolean(itemInt.offset + 0x9, true);
      setBoolean(itemInt.offset + 0x8, true);
      setInt(itemInt.offset + 0x1, "uint8", Math.min(96, magic));
    } else {
      setBoolean(itemInt.offset + 0x9, false);
      setBoolean(itemInt.offset + 0x8, false);
      setInt(itemInt.offset + 0x1, "uint8", Math.min(0, magic));
    }
  } else if ("id" in item && item.id === "doubleDefense") {
    const itemInt = item as ItemInt;

    let int = 0;

    const hasDoubleDefense = getBoolean(itemInt.offset);
    const healthMax = getInt(itemInt.offset - 0xe, "uint16", {
      bigEndian: true,
    });

    if (hasDoubleDefense) {
      int = healthMax / 16;
    }

    setInt(itemInt.offset + 0x91, "uint8", int);
  } else if ("id" in item && item.id === "day") {
    const itemInt = item as ItemInt;

    const int = getInt(itemInt.offset, "uint32", { bigEndian: true });

    setInt(itemInt.offset + 0x4, "uint32", int, { bigEndian: true });
  }
}

export function generateChecksum(item: ItemChecksum): number {
  const $gameRegion = get(gameRegion);

  let checksum = 0x0;

  let isOwlFile = false;

  if ($gameRegion !== 2) {
    isOwlFile = getBoolean(item.offset - 0xfe7);
  }

  for (
    let i = item.control.offsetStart;
    i < item.control.offsetEnd + (isOwlFile ? 0x2000 : 0x0);
    i += 0x1
  ) {
    checksum += getInt(i, "uint8");
  }

  return formatChecksum(checksum, item.dataType);
}

export function beforeSaving(): ArrayBufferLike {
  return byteswapDataView("fla").buffer;
}
