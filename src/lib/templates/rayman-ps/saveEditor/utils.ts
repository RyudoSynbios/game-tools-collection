import { gameRegion, gameTemplate } from "$lib/stores";
import { getInt, setInt, setString } from "$lib/utils/bytes";
import {
  customGetRegions,
  getDexDriveHeaderShift,
  getPsvHeaderShift,
  getVmpHeaderShift,
  isDexDriveHeader,
  isPsvHeader,
  isVmpHeader,
  retrieveSlots,
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
  if (isDexDriveHeader(dataView)) {
    return getDexDriveHeaderShift();
  } else if (isVmpHeader(dataView)) {
    return getVmpHeaderShift();
  }

  return 0x0;
}

export function initShifts(shifts: number[]): number[] {
  if (isPsvHeader()) {
    shifts = [...shifts, getPsvHeaderShift()];
  }

  return shifts;
}

export function overrideGetRegions(
  dataView: DataView,
  shift: number,
): string[] {
  return customGetRegions(dataView, shift);
}

export function overrideParseContainerItemsShifts(
  item: ItemContainer,
  shifts: number[],
  index: number,
): [boolean, number[] | undefined] {
  if (item.id === "slots") {
    return retrieveSlots("memory", shifts, index);
  }

  return [false, undefined];
}

export function afterSetInt(item: Item): void {
  if ("id" in item && item.id === "health") {
    const itemInt = item as ItemInt;

    let health = getInt(itemInt.offset, "uint8");
    const healthMax = getInt(itemInt.offset - 0x77, "uint8");

    health = Math.min(health, healthMax);

    setInt(itemInt.offset, "uint8", health);
  } else if ("id" in item && item.id === "healthMax") {
    const itemInt = item as ItemInt;

    let health = getInt(itemInt.offset + 0x77, "uint8");
    const healthMax = getInt(itemInt.offset, "uint8");

    health = Math.min(health, healthMax);

    setInt(itemInt.offset + 0x77, "uint8", health);
  } else if ("id" in item && item.id?.match(/level-/)) {
    const split = item.id.split("-");

    const slotIndex = split[2];

    let int = 0;

    const progression = getItem(`progression-${slotIndex}`) as ItemString;

    if (progression) {
      for (let i = 0; i < 17; i += 1) {
        let progressionCount = 0;
        let totalCount = 0;

        const itemBitflags = getItem(`level-${i}-${slotIndex}`) as ItemBitflags;

        const total = getItem(`total-level-${i}-${slotIndex}`) as ItemInt;

        if (total) {
          itemBitflags.flags.forEach((flag, index) => {
            let itemBitflag = flag as ItemBitflag;

            if (index === 0) {
              totalCount += getInt(itemBitflag.offset, "bit", {
                bit: itemBitflag.bit,
              });
            } else if (index >= 2) {
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
