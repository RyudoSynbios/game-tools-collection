import { getInt, setInt } from "$lib/utils/bytes";
import { formatChecksum } from "$lib/utils/checksum";
import { getShift } from "$lib/utils/parser";

import type {
  Item,
  ItemBitflag,
  ItemBitflags,
  ItemChecksum,
  ItemContainer,
  ItemInt,
} from "$lib/types";

export function initShifts(shifts: number[]): number[] {
  const shift = getShift(shifts);

  const section = getSaveSection(shift + 0x404);

  return [...shifts, section * 0x200];
}

export function overrideParseItem(item: Item): Item {
  if ("id" in item && item.id === "checksum") {
    const itemChecksum = item as ItemChecksum;

    const section = getSaveSection(itemChecksum.offset + 0x403);

    let index = 0;

    switch (section) {
      case 1:
        index = 2;
        break;
      case 2:
        index = 4;
        break;
      case 3:
        index = 1;
        break;
      case 4:
        index = 3;
        break;
      case 5:
        index = 5;
        break;
    }

    itemChecksum.offset += index * 0x2;

    if (![0, 3].includes(section)) {
      itemChecksum.control.offsetEnd += 0x126;
    }

    return itemChecksum;
  }

  return item;
}

export function overrideGetInt(item: Item): [boolean, number | undefined] {
  if ("id" in item && item.id === "total") {
    const itemInt = item as ItemInt;

    let percent = 0;

    percent += getInt(itemInt.offset, "uint32").toBitCount() * 2;
    percent += getInt(itemInt.offset + 0x4, "uint24").toBitCount() * 2;

    return [true, percent];
  }

  return [false, undefined];
}

export function afterSetInt(item: Item, flag: ItemBitflag): void {
  if ("id" in item && item.id === "hiddenEvents") {
    const itemBitflags = item as ItemBitflags;

    const checked = getInt(flag.offset, "bit", { bit: flag.bit });

    const index = itemBitflags.flags.findIndex(
      (item) => item.offset === flag.offset && item.bit === flag.bit,
    );

    const hiddenFlag = itemBitflags.flags[index + 1];

    if (hiddenFlag.hidden) {
      setInt(hiddenFlag.offset, "bit", checked, { bit: hiddenFlag.bit });
    }
  }
}

export function generateChecksum(item: ItemChecksum): number {
  let checksum = 0x0;

  for (let i = item.control.offsetStart; i < item.control.offsetEnd; i += 0x1) {
    checksum += getInt(i, "uint8");
  }

  return formatChecksum(checksum, item.dataType);
}

function getSaveSection(offset: number): number {
  let section = 0;
  let bestSaveCount = 0;

  for (let i = 0x0; i < 0x6; i += 0x1) {
    const saveCount = getInt(offset + i * 0x200, "uint32", {
      bigEndian: true,
    });

    if (saveCount !== 0xffffffff && saveCount > bestSaveCount) {
      section = i;
      bestSaveCount = saveCount;
    }
  }

  return section;
}
