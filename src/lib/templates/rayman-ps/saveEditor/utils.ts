import { getInt, setInt, setString } from "$lib/utils/bytes";
import {
  customGetRegions,
  getHeaderShift,
  getPsvHeaderShift,
  getSlotShifts,
  isPsvHeader,
} from "$lib/utils/common/playstation";
import { getItem } from "$lib/utils/parser";

import type {
  Item,
  ItemBitflag,
  ItemBitflags,
  ItemContainer,
  ItemInt,
  ItemString,
} from "$lib/types";

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
  if ("id" in item && item.id === "health") {
    const itemInt = item as ItemInt;

    const maxHealth = getInt(itemInt.offset - 0x77, "uint8") + 0x1;

    itemInt.max = maxHealth;
  }

  return item;
}

export function afterSetInt(item: Item): void {
  if ("id" in item && item.id === "maxHealth") {
    const itemInt = item as ItemInt;

    let health = getInt(itemInt.offset + 0x77, "uint8");
    const maxHealth = getInt(itemInt.offset, "uint8");

    health = Math.min(health, maxHealth);

    setInt(itemInt.offset + 0x77, "uint8", health);
  } else if ("id" in item && item.id?.match(/level-/)) {
    const [, , slotIndex] = item.id.split("-");

    let int = 0;

    const progression = getItem(`progression-${slotIndex}`) as ItemString;

    if (progression) {
      for (let i = 0; i < 18; i += 1) {
        let progressionCount = 0;
        let totalCount = 0;

        const itemBitflags = getItem(`level-${i}-${slotIndex}`) as ItemBitflags;

        const total = getItem(`total-level-${i}-${slotIndex}`) as ItemInt;

        if (total) {
          itemBitflags.flags.forEach((flag, index) => {
            const itemBitflag = flag as ItemBitflag;

            if (index === 0) {
              totalCount += getInt(itemBitflag.offset, "bit", {
                bit: itemBitflag.bit,
              });
            } else if (index >= 1) {
              const value = getInt(itemBitflag.offset, "bit", {
                bit: itemBitflag.bit,
              });

              progressionCount += value;
              totalCount += value * 4;
            }
          });

          if (`level-${i}-${slotIndex}` === item.id) {
            setInt(total.offset, "uint8", totalCount);
          }
        }

        int += progressionCount;
      }

      int = Math.floor((int / 102) * 100);

      setString(
        progression.offset,
        0x3,
        progression.letterDataType,
        `${int}`.padStart(3, "0"),
      );
    }
  }
}
