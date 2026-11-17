import { getInt, setInt } from "$lib/utils/bytes";
import { formatChecksum } from "$lib/utils/checksum";
import {
  customGetRegions,
  getSlotShiftsByIdentifier,
  repackFile,
  resetState,
  unpackFile,
} from "$lib/utils/common/playstation";

import type { Item, ItemChecksum, ItemContainer, ItemInt } from "$lib/types";

import { characterLevels } from "./utils/resource";

export function beforeInitDataView(dataView: DataView): DataView {
  return unpackFile(dataView);
}

export function overrideGetRegions(): string[] {
  return customGetRegions();
}

export function onInitFailed(): void {
  resetState();
}

export function overrideParseContainerItemsShifts(
  item: ItemContainer,
  shifts: number[],
  index: number,
): [boolean, number[] | undefined] {
  if (item.id === "slots") {
    return getSlotShiftsByIdentifier(".TOP.%s".format(index + 1));
  }

  return [false, undefined];
}

export function afterSetInt(item: Item): void {
  if ("id" in item && item.id === "level") {
    const itemInt = item as ItemInt;

    const level = getInt(itemInt.offset, "uint16");
    let experience = 0;

    if (level < 100) {
      experience = characterLevels[level - 1] || characterLevels[0];
    } else {
      experience = characterLevels[98] + (level - 99) * 106920;
    }

    let nextExperience = 0;

    if (level < 99) {
      nextExperience = characterLevels[level] || characterLevels[0];
    } else if (level < 999) {
      nextExperience = experience + 106920;
    }

    if (nextExperience > 0) {
      nextExperience -= experience;
    }

    setInt(itemInt.offset + 0x2, "uint32", experience);
    setInt(itemInt.offset + 0x6, "uint32", nextExperience);
  } else if ("id" in item && item.id === "experience") {
    const itemInt = item as ItemInt;

    const experience = getInt(itemInt.offset, "uint32");

    let level = 1;

    if (experience < characterLevels[98]) {
      for (let i = 0; i < characterLevels.length; i += 1) {
        if (
          experience >= characterLevels[i] &&
          (!characterLevels[i + 1] || experience < characterLevels[i + 1])
        ) {
          level += i;
        }
      }
    } else {
      level = 99 + Math.floor((experience - characterLevels[98]) / 106920);
    }

    let nextExperience = 0;

    if (level < 99) {
      nextExperience = characterLevels[level] || characterLevels[0];
    } else if (level < 999) {
      nextExperience = characterLevels[98] + (level - 98) * 106920;
    }

    if (nextExperience > 0) {
      nextExperience -= experience;
    }

    setInt(itemInt.offset - 0x2, "uint16", level);
    setInt(itemInt.offset + 0x4, "uint32", nextExperience);
  }
}

export function generateChecksum(item: ItemChecksum): number {
  let checksum = 0x0;

  for (let i = item.control.offsetStart; i < item.control.offsetEnd; i += 0x1) {
    checksum += getInt(i, "uint8");
  }

  return formatChecksum(checksum, item.dataType);
}

export function beforeSaving(): ArrayBufferLike {
  return repackFile();
}

export function onReset(): void {
  resetState();
}
