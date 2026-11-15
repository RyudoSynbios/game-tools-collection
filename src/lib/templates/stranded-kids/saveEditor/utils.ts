import { get } from "svelte/store";

import { gameRegion } from "$lib/stores";
import { copyInt, getInt, setInt } from "$lib/utils/bytes";
import { formatChecksum } from "$lib/utils/checksum";
import { getClosestItem, getShift } from "$lib/utils/parser";

import type {
  Item,
  ItemChecksum,
  ItemContainer,
  ItemInt,
  ItemString,
} from "$lib/types";

import { SLOT_INDEXES } from "./utils/constants";
import { locationList } from "./utils/resource";

export function overrideParseItem(item: Item): Item {
  const $gameRegion = get(gameRegion);

  if ("id" in item && item.id === "checksum" && $gameRegion === 1) {
    const itemChecksum = item as ItemChecksum;

    itemChecksum.offset -= 0x2;
    itemChecksum.control.offsetEnd -= 0x2;

    return itemChecksum;
  } else if ("id" in item && item.id?.match(/previewName-/)) {
    const itemString = item as ItemString;

    const [index] = item.id.splitInt();

    itemString.offset += SLOT_INDEXES[index] * 0x4;

    return itemString;
  } else if ("id" in item && item.id?.match(/previewDay-/)) {
    const itemInt = item as ItemInt;

    const [index] = item.id.splitInt();

    itemInt.offset += SLOT_INDEXES[index] * 0x2;

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

    const slots = getInt(shift + 0x4500, "uint8");

    index = SLOT_INDEXES[index];

    if (slots & (1 << index)) {
      return [true, [...shifts, (index === 3 ? 4 : index) * item.length]];
    }

    return [true, [-1]];
  }

  return [false, undefined];
}

export function overrideItem(item: Item): Item {
  if ("id" in item && item.id?.match(/slots-/)) {
    const itemInt = item as ItemInt;

    const [index] = item.id.splitInt();

    const slotsItem = getClosestItem("itemSlots", item) as ItemInt;

    const int = getInt(slotsItem.offset, "uint8");

    itemInt.disabled = index >= int;

    return itemInt;
  }

  return item;
}

export function overrideGetInt(item: Item): [boolean, number | undefined] {
  if ("id" in item && item.id?.match(/slots-/)) {
    const itemInt = item as ItemInt;

    if (itemInt.disabled) {
      return [true, 0x0];
    }
  } else if ("id" in item && item.id === "eventDay") {
    const itemInt = item as ItemInt;

    const day1 = getInt(itemInt.offset, "lower4");
    const day2 = getInt(itemInt.offset + 0x1, "uint8");

    const day = parseInt(((day1 << 0x8) | day2).toHex(3));

    return [true, day];
  }

  return [false, undefined];
}

export function overrideSetInt(item: Item, value: string): boolean {
  if ("id" in item && item.id === "eventDay") {
    const itemInt = item as ItemInt;

    const day = value.padStart(3, "0");

    const day1 = parseInt(day.slice(0, 1));
    const day2 = parseInt(day.slice(1, 3));

    setInt(itemInt.offset, "lower4", day1);
    setInt(itemInt.offset + 0x1, "uint8", day2, { binaryCodedDecimal: true });

    return true;
  }

  return false;
}

export function afterSetInt(item: Item): void {
  if ("id" in item && item.id === "name") {
    const itemString = item as ItemString;

    const spItem = getClosestItem(/previewName-/, item) as ItemString;

    copyInt(itemString.offset, spItem.offset, 0x4);
  } else if ("id" in item && item.id === "day") {
    const itemInt = item as ItemInt;

    const spItem = getClosestItem(/previewDay-/, item) as ItemString;

    copyInt(itemInt.offset, spItem.offset, 0x2);
  } else if ("id" in item && item.id === "location") {
    const itemInt = item as ItemInt;

    const index = getInt(itemInt.offset, "uint8");

    const location = locationList.find((location) => location.index === index);

    if (location) {
      setInt(itemInt.offset + 0x8a, "uint8", location.coordinates[0]);
      setInt(itemInt.offset + 0x89, "uint8", location.coordinates[1]);
      setInt(itemInt.offset - 0x1, "uint8", location.coordinates[2]);
      setInt(itemInt.offset - 0x2, "uint8", location.coordinates[3]);
    }
  } else if ("id" in item && item.id === "equippedItem") {
    const itemInt = item as ItemInt;

    const itemIndex = getInt(itemInt.offset, "uint8");

    let index = 0x0;

    switch (itemIndex) {
      case 0x1: // Knife
        index = 0x0c;
        break;
      case 0x2: // Axe
        index = 0x1;
        break;
      case 0x3: // Bow
        index = 0x0e;
        break;
      case 0x4: // Fishing Rod
        index = 0xa;
        break;
      case 0x5: // Hammer
        index = 0x0b;
        break;
    }

    setInt(itemInt.offset + 0x22, "uint8", index);
  } else if ("id" in item && item.id === "equippedSkin") {
    const itemInt = item as ItemInt;

    const itemIndex = getInt(itemInt.offset, "uint8");

    let index = 0x0;

    switch (itemIndex) {
      case 0x1: // Umbrella Leaf
        index = 0x06;
        break;
      case 0x2: // Bear Cap
        index = 0x08;
        break;
      case 0x3: // Deer Cap
        index = 0x09;
        break;
      case 0x4: // Fox Cap
        index = 0x07;
        break;
    }

    setInt(itemInt.offset - 0x1, "uint8", index);
  }
}

export function generateChecksum(item: ItemChecksum): number {
  let checksum = 0x0;

  for (let i = item.control.offsetStart; i < item.control.offsetEnd; i += 0x1) {
    checksum += getInt(i, "uint8");
  }

  return formatChecksum(checksum, item.dataType);
}
