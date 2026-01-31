import { getInt, getString, setInt } from "$lib/utils/bytes";
import { formatChecksum } from "$lib/utils/checksum";
import { getHeaderShift } from "$lib/utils/common/gameBoyAdvance";
import { getPartialValue, makeOperations } from "$lib/utils/format";
import { getShift } from "$lib/utils/parser";

import type {
  Item,
  ItemBitflag,
  ItemBitflags,
  ItemChecksum,
  ItemInt,
  ItemString,
} from "$lib/types";

export function initHeaderShift(dataView: DataView): number {
  return getHeaderShift(dataView);
}

export function initShifts(shifts: number[]): number[] {
  const shift = getShift(shifts);

  let section = 0;
  let bestSaveCount = 0;

  for (let i = 0x0; i < 0x10; i += 0x1) {
    const magic = getString(shift + i * 0x1000, 0x4, "uint8");
    const saveCount = getInt(shift + i * 0x1000 + 0x4, "uint32");

    if (magic === "LNTG" && saveCount > bestSaveCount) {
      section = i;
      bestSaveCount = saveCount;
    }
  }

  return [...shifts, section * 0x1000];
}

export function overrideParseItem(item: Item): Item {
  if ("id" in item && item.id?.match(/acts-/)) {
    const itemBitflags = item as ItemBitflags;

    const [actIndex] = item.id.splitInt();

    itemBitflags.flags = itemBitflags.flags.map((flag, index) => {
      if (index !== 0) {
        flag.offset += actIndex * 0x3;
      }

      return flag;
    });

    return itemBitflags;
  }

  return item;
}

export function overrideItem(item: Item): Item {
  if ("id" in item && item.id === "timeAttackName") {
    const itemString = item as ItemString;

    const enabled = getInt(itemString.offset - 0x8, "uint8");

    itemString.disabled = !enabled;

    return itemString;
  }

  return item;
}

export function overrideGetInt(
  item: Item,
): [boolean, number | string | undefined] {
  if ("id" in item && item.id === "timeAttackName") {
    const itemString = item as ItemString;

    if (itemString.disabled) {
      return [true, ""];
    }
  } else if ("id" in item && item.id === "time") {
    const itemInt = item as ItemInt;

    const time = getInt(itemInt.offset, "uint16");

    if (time === 36000) {
      return [true, makeOperations(time - 1, itemInt.operations)];
    }
  }

  return [false, undefined];
}

export function overrideSetInt(item: Item, value: string): boolean {
  if ("id" in item && item.id === "time") {
    const itemInt = item as ItemInt;

    const oldInt = getInt(itemInt.offset, "uint16");

    let int = makeOperations(parseInt(value), itemInt.operations, true);
    int = getPartialValue(oldInt, int, itemInt.operations!);

    if (int === 35999) {
      int = 36000;
    } else {
      int = Math.min(int, 35994);
    }

    setInt(itemInt.offset, "uint16", int);

    return true;
  }

  return false;
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
  } else if ("id" in item && item.id?.match(/vsResult-/)) {
    const itemInt = item as ItemInt;

    const [shift] = item.id.splitInt();

    const offset = itemInt.offset - shift;

    let wins = getInt(offset, "uint8");
    const losses = getInt(offset + 0x1, "uint8");
    const draws = getInt(offset + 0x2, "uint8");

    const enabled = wins + losses + draws > 0;

    setInt(offset - 0x1, "uint8", enabled ? 1 : 0);

    let hasName = false;

    for (let i = 0x0; i < 0x3; i += 0x1) {
      if (getInt(offset + 0x7 + i * 0x4, "uint32") !== 0x0) {
        hasName = true;
      }
    }

    if (enabled && !hasName) {
      for (let i = 0x0; i < 0x3; i += 0x1) {
        setInt(offset + 0x7 + i * 0x4, "uint32", 0xffffffff);
      }
    }
  }
}

export function generateChecksum(item: ItemChecksum): number {
  let checksum = 0x0;

  for (let i = item.control.offsetStart; i < item.control.offsetEnd; i += 0x4) {
    checksum += getInt(i, "uint32");
  }

  return formatChecksum(checksum, item.dataType);
}
