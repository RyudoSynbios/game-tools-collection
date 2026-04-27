import { get } from "svelte/store";

import { gameRegion } from "$lib/stores";
import { getInt, setInt } from "$lib/utils/bytes";
import { formatChecksum } from "$lib/utils/checksum";
import { getRegionArray } from "$lib/utils/format";

import type { Item, ItemChecksum, ItemInt } from "$lib/types";

import { REGION_SHIFTS } from "./utils/constants";

export function initShifts(shifts: number[]): number[] {
  return [...shifts, -getRegionArray(REGION_SHIFTS)];
}

export function overrideParseItem(item: Item): Item {
  if ("id" in item && item.id === "checksum") {
    const itemChecksum = item as ItemChecksum;

    itemChecksum.control.offsetStart += getRegionArray(REGION_SHIFTS);
    itemChecksum.control.offsetEnd += getRegionArray(REGION_SHIFTS);

    return itemChecksum;
  }

  return item;
}

export function overrideItem(item: Item): Item {
  if ("id" in item && item.id === "quantity") {
    const itemInt = item as ItemInt;

    const quantity = getInt(itemInt.offset, "uint16", { bigEndian: true });

    itemInt.disabled = quantity === 0xffff;

    return itemInt;
  }

  return item;
}

export function overrideGetInt(item: Item): [boolean, number | undefined] {
  if ("id" in item && item.id === "quantity") {
    const itemInt = item as ItemInt;

    if (itemInt.disabled) {
      return [true, 0x0];
    }
  } else if ("id" in item && item.id === "infiniteAmmo") {
    const itemInt = item as ItemInt;

    const quantity = getInt(itemInt.offset, "uint16", { bigEndian: true });

    return [true, quantity === 0xffff ? 0x1 : 0x0];
  }

  return [false, undefined];
}

export function overrideSetInt(item: Item, value: string): boolean {
  if ("id" in item && item.id === "infiniteAmmo") {
    const itemInt = item as ItemInt;

    let quantity = 0x0;

    if (value === "1") {
      quantity = 0xffff;
    }

    setInt(itemInt.offset, "uint16", quantity, { bigEndian: true });

    return true;
  }

  return false;
}

export function afterSetInt(item: Item): void {
  if ("id" in item && item.id?.match(/savePreview-/)) {
    const itemInt = item as ItemInt;

    const [shift] = item.id.splitInt();

    const offset = itemInt.offset + getRegionArray(REGION_SHIFTS) - shift;
    const dataType = itemInt.dataType as "uint8" | "uint16";

    let int = getInt(itemInt.offset, dataType, { bigEndian: true });

    if (shift === 0x166b) {
      int = Math.min(int + 1, 99);
    }

    setInt(offset, "uint8", int);
  } else if ("id" in item && item.id?.match(/item-/)) {
    const itemInt = item as ItemInt;

    const [index] = item.id.splitInt();

    const offset = itemInt.offset - index * 0x4 + 0x1e;

    const equippedSlot = getInt(offset, "uint8");

    if (index === equippedSlot) {
      setInt(offset, "uint8", 0xff);
    }
  }
}

export function generateChecksum(item: ItemChecksum): number {
  let checksum = 0xffffffff;

  for (let i = item.control.offsetStart; i < item.control.offsetEnd; i += 0x1) {
    checksum ^= getInt(i, "uint8") << 0x18;

    for (let j = 0; j < 8; j += 1) {
      if ((checksum & 0x80000000) === 0x0) {
        checksum = checksum << 0x1;
      } else {
        checksum = (checksum << 0x1) ^ 0x4c11db7;
      }
    }
  }

  checksum = ~checksum;

  return formatChecksum(checksum, item.dataType);
}
