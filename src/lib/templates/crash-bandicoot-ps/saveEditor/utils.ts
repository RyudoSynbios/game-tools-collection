import { getInt, setInt } from "$lib/utils/bytes";
import { formatChecksum } from "$lib/utils/checksum";
import {
  customGetRegions,
  getHeaderShift,
  getPsvHeaderShift,
  getSlotShifts,
  isPsvHeader,
} from "$lib/utils/common/playstation";
import { getItem, getShift } from "$lib/utils/parser";

import type {
  Item,
  ItemBitflag,
  ItemBitflagChecked,
  ItemBitflags,
  ItemChecksum,
  ItemContainer,
  ItemInt,
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
    const slotShifts = getSlotShifts("memory", shifts, index);

    if (isPsvHeader() && index === 0) {
      const shift = getShift(shifts);

      const iconFrames = getInt(shift + 0x2, "lower4");

      return [true, [...shifts, (iconFrames - 1) * 0x80]];
    }

    const shift = getShift(slotShifts[1] as number[]);

    if (shift !== -1) {
      const iconFrames = getInt(shift + 0x2, "lower4");

      return [true, [shift, (iconFrames - 1) * 0x80]];
    }

    return slotShifts;
  }

  return [false, undefined];
}

export function overrideGetInt(
  item: Item,
): [boolean, number | ItemBitflagChecked[] | undefined] {
  if ("id" in item && item.id?.match(/completionRate-/)) {
    const itemInt = item as ItemInt;

    let int = 0;

    for (let i = 0x0; i < 0x6; i += 0x1) {
      const number =
        getInt(itemInt.offset + i * 0x2, "uint16", { bigEndian: true }) -
        0x824f;

      if (number >= 0 && number <= 9) {
        int = int * 10 + number;
      } else {
        break;
      }
    }

    return [true, int];
  } else if ("id" in item && item.id?.match(/levels-/)) {
    const itemBitflags = item as ItemBitflags;

    const int = getInt(itemBitflags.flags[0].offset, "uint8");

    const flags = itemBitflags.flags.reduce(
      (flags: ItemBitflagChecked[], flag, index) => {
        let checked = index < int - 1;

        if (flag.bit !== 0) {
          checked = Boolean(getInt(flag.offset, "bit", { bit: flag.bit }));
        }

        flags.push({
          ...flag,
          checked: checked,
        });

        return flags;
      },
      [],
    );

    return [true, flags];
  }

  return [false, undefined];
}

export function overrideSetInt(
  item: Item,
  value: string,
  flag: ItemBitflag,
): boolean {
  if ("id" in item && item.id?.match(/levels-/) && flag.bit === 0) {
    const itemBitflags = item as ItemBitflags;

    const [slotIndex] = item.id.splitInt();

    let int = itemBitflags.flags.findIndex((f) => f.label === flag.label) + 2;

    if (!value) {
      int -= 1;
    }

    setInt(flag.offset, "uint32", int);
    setInt(flag.offset - 0x4, "uint16", int, {
      binary: { bitStart: 0, bitLength: 5 },
    });

    updateCompletionRate(slotIndex, flag.offset - 0x4);

    return true;
  }

  return false;
}

export function afterSetInt(item: Item, flag: ItemBitflag): void {
  if ("id" in item && item.id?.match(/levels-/) && flag.bit !== 0) {
    const itemBitflags = item as ItemBitflags;

    const [slotIndex] = item.id.splitInt();

    let count = 0;

    itemBitflags.flags.slice(-2).forEach((flag) => {
      count += getInt(flag.offset, "bit", { bit: flag.bit });
    });

    const offset = itemBitflags.flags[0].offset - 0x3;

    setInt(offset, "uint8", count, { binary: { bitStart: 2, bitLength: 2 } });

    updateCompletionRate(slotIndex, offset - 0x1);
  } else if ("id" in item && item.id?.match(/gems-/)) {
    const itemBitflags = item as ItemBitflags;

    const [slotIndex] = item.id.splitInt();

    let count = 0;

    itemBitflags.flags.forEach((flag) => {
      count += getInt(flag.offset, "bit", { bit: flag.bit });
    });

    const offset = itemBitflags.flags[0].offset - 0x1c;

    setInt(offset, "uint16", count, { binary: { bitStart: 5, bitLength: 5 } });

    updateCompletionRate(slotIndex, offset);
  }
}

export function generateChecksum(item: ItemChecksum): number {
  let checksum = 0x12345678;

  for (let i = item.control.offsetStart; i < item.control.offsetEnd; i += 0x1) {
    checksum += getInt(i, "uint8");
    checksum = (checksum << 0x3) | (checksum >>> 0x1d);
  }

  return formatChecksum(checksum, item.dataType);
}

function updateCompletionRate(slotIndex: number, offset: number): void {
  const completionRateItem = getItem(`completionRate-${slotIndex}`) as ItemInt;

  let levels = getInt(offset, "uint16", {
    binary: { bitStart: 0, bitLength: 5 },
  });

  levels = Math.min(levels - 1, 28);

  const gems = getInt(offset, "uint16", {
    binary: { bitStart: 5, bitLength: 5 },
  });
  const keys = getInt(offset + 0x1, "uint8", {
    binary: { bitStart: 2, bitLength: 2 },
  });

  let percent = ((levels * 2 + gems + keys * 3) / 88) * 100;

  let count = 0;

  for (let i = 0x0; i < 0x3; i += 0x1) {
    const int = Math.floor(percent / 100);

    if (int > 0 || count > 0) {
      setInt(completionRateItem.offset + count * 0x2, "uint16", int + 0x824f, {
        bigEndian: true,
      });

      count += 1;
    }

    percent = (percent - int * 100) * 10;
  }

  [0x8193, 0x816a, 0x0].forEach((int, index) => {
    const offset = completionRateItem.offset + (count + index) * 0x2;

    setInt(offset, "uint16", int, {
      bigEndian: true,
    });
  });
}
