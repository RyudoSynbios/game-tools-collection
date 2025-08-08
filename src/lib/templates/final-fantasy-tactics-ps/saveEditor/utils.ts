import { getInt, getString } from "$lib/utils/bytes";
import {
  customGetRegions,
  getHeaderShift,
  getPsvHeaderShift,
  getSlotShifts,
  isPsvHeader,
} from "$lib/utils/common/playstation";
import { getItem, updateResources } from "$lib/utils/parser";

import type { Item, ItemContainer, ItemString, Resource } from "$lib/types";

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
    return getSlotShifts("correspondance", shifts, 0, {
      custom: [0x41 + index],
    });
  }

  return [false, undefined];
}

export function afterSetInt(item: Item): void {
  if ("id" in item && item.id?.match(/unitName-/)) {
    const [slotIndex] = item.id.splitInt();

    updateUnitNames(slotIndex);
  }
}

export function getUnitNames(slotIndex: number): Resource {
  if (typeof slotIndex === "string") {
    return {};
  }

  const names: Resource = {};

  const itemString = getItem(`slot-${slotIndex}-unitName-0`) as ItemString;

  [...Array(20).keys()].forEach((index) => {
    const offset = itemString.offset + index * 0xe0;

    if (getInt(offset - 0xbd, "uint8") !== 0xff) {
      const name = getString(
        offset,
        itemString.length,
        itemString.letterDataType,
        {
          endCode: itemString.endCode,
          resource: "letters",
        },
      );

      names[index] = name.trim();
    }
  });

  return names;
}

export function onSlotChange(slotIndex: number): void {
  updateUnitNames(slotIndex);
}

export function updateUnitNames(slotIndex: number): void {
  const values = getUnitNames(slotIndex);

  updateResources("unitNames", values);
}
