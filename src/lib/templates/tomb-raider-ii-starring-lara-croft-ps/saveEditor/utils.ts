import { getInt } from "$lib/utils/bytes";
import { formatChecksum } from "$lib/utils/checksum";
import {
  customGetRegions,
  getHeaderShift,
  getPsvHeaderShift,
  getSlotShifts,
  isPsvHeader,
} from "$lib/utils/common/playstation";
import { makeOperations } from "$lib/utils/format";
import { getItem } from "$lib/utils/parser";

import type {
  Item,
  ItemBitflags,
  ItemChecksum,
  ItemContainer,
  ItemInt,
  ItemSection,
  ItemTabs,
} from "$lib/types";

import { locationItems } from "./utils/resource";

export function initHeaderShift(dataView: DataView): number {
  return getHeaderShift(dataView);
}

export function overrideGetRegions(
  dataView: DataView,
  shift: number,
): string[] {
  return customGetRegions(dataView, shift);
}

export function initShifts(shifts: number[]): number[] {
  if (isPsvHeader()) {
    shifts = [...shifts, getPsvHeaderShift()];
  }

  return shifts;
}

export function overrideParseContainerItemsShifts(
  item: ItemContainer,
  shifts: number[],
  index: number,
): [boolean, number[] | undefined] {
  if (item.id === "slots") {
    return getSlotShifts("memory", shifts, index);
  }

  return [false, undefined];
}

export function overrideItem(item: Item): Item {
  if ("id" in item && item.id === "locations") {
    const itemTabs = item as ItemTabs;

    itemTabs.items.map((item, index) => {
      if (index !== 0) {
        return item;
      }

      const gamePendingItem = getItem("gamePending") as ItemInt;

      const int = getInt(gamePendingItem.offset, "uint8");

      item.disabled = int === 0;
    });

    return itemTabs;
  } else if ("id" in item && item.id?.match(/secret-/)) {
    const itemBitflags = item as ItemBitflags;

    const [index] = item.id.splitInt();

    if ([16, 17].includes(index)) {
      itemBitflags.hidden = true;
    } else if (index === 99) {
      const flag = itemBitflags.flags[0];

      const location = getInt(flag.offset + 0x2, "uint16");

      if ([16, 17].includes(location)) {
        itemBitflags.hidden = true;
      }
    }

    return itemBitflags;
  } else if ("id" in item && item.id?.match(/locationItems-/)) {
    const itemSection = item as ItemSection;

    const [, type] = item.id.split("-");

    let offset = (itemSection.items[0] as ItemInt).offset;

    if (type === "key") {
      offset -= 0x13;
    } else if (type === "item") {
      offset -= 0xd;
    }

    const locationIndex = getInt(offset, "uint16");

    const location = locationItems[locationIndex];

    if (location) {
      let hasItems = false;

      itemSection.items.map((item, index) => {
        const itemInt = item as ItemInt;

        const locationItem = location[`${type}${index + 1}`];

        if (locationItem) {
          itemInt.name = locationItem.name;
          itemInt.max = locationItem.quantity;
          itemInt.hidden = false;

          hasItems = true;
        }
      });

      itemSection.hidden = !hasItems;
    }

    return itemSection;
  }

  return item;
}

export function overrideGetInt(item: Item): [boolean, number | undefined] {
  if ("id" in item && item.id?.match(/total-/)) {
    const itemInt = item as ItemInt;

    const [, type] = item.id.split("-");

    let int = 0;

    if (type === "playtime") {
      for (let i = 0x0; i < 0x12; i += 0x1) {
        int += getInt(itemInt.offset + i * 0x2c, "uint32");
      }

      int = makeOperations(int, itemInt.operations);
    } else if (type === "secrets") {
      for (let i = 0x0; i < 0x10; i += 0x1) {
        int += getInt(itemInt.offset + i * 0x2c, "uint8").toBitCount();
      }
    }

    return [true, int];
  }

  return [false, undefined];
}

export function generateChecksum(item: ItemChecksum): number {
  let checksum = 0x0;

  for (let i = item.control.offsetStart; i < item.control.offsetEnd; i += 0x1) {
    checksum += getInt(i, "uint8");
  }

  checksum = -checksum;

  return formatChecksum(checksum, item.dataType);
}
