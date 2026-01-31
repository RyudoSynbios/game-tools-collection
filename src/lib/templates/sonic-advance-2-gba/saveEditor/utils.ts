import { getInt, getString, setInt } from "$lib/utils/bytes";
import { formatChecksum } from "$lib/utils/checksum";
import { getHeaderShift } from "$lib/utils/common/gameBoyAdvance";
import { getPartialValue, isInRange, makeOperations } from "$lib/utils/format";
import { getShift } from "$lib/utils/parser";

import type { Item, ItemBitflags, ItemChecksum, ItemInt } from "$lib/types";

import { progressionList } from "./utils/resource";

export function initHeaderShift(dataView: DataView): number {
  return getHeaderShift(dataView);
}

export function initShifts(shifts: number[]): number[] {
  const shift = getShift(shifts);

  let section = 0;
  let bestSaveCount = 0;

  for (let i = 0x0; i < 0xa; i += 0x1) {
    const magic = getString(shift + i * 0x1000, 0x4, "uint8");
    const saveCount = getInt(shift + i * 0x1000 + 0x4, "uint32");

    if (magic === "MGGE" && saveCount > bestSaveCount) {
      section = i;
      bestSaveCount = saveCount;
    }
  }

  return [...shifts, section * 0x1000];
}

export function overrideGetInt(item: Item): [boolean, number | undefined] {
  if ("id" in item && item.id?.match(/progression-/)) {
    const itemInt = item as ItemInt;

    const [index] = item.id.splitInt();

    const progression = getInt(itemInt.offset, "uint8");
    const allCEClear = getInt(itemInt.offset - index - 0x5, "bit", {
      bit: 4 + index,
    });
    const extraZone = getInt(itemInt.offset - index - 0x5, "uint8", {
      binary: { bitStart: 1, bitLength: 2 },
    });

    let int = progressionList.findIndex((zone) =>
      isInRange(progression, zone.min, zone.max),
    );

    // Amy
    if (index === 4) {
      return [true, int];
    }

    if (progression === 0x1d && allCEClear) {
      int += 0x1;
    }

    // Not Sonic
    if (index !== 0) {
      return [true, int];
    }

    if (extraZone) {
      int = 0xa;
    }

    if (progression === 0x1e) {
      int = 0xb;
    }

    return [true, int];
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
  if ("id" in item && item.id?.match(/progression-/)) {
    const itemInt = item as ItemInt;

    const [index] = item.id.splitInt();

    const int = parseInt(value);

    let progression = 0x0;

    if (int <= 0x8) {
      const test = progressionList.find(
        (progression) => progression.index === int,
      );

      progression = test!.min;
    } else if (int <= 0xa) {
      progression = 0x1d;
    } else {
      progression = 0x1e;
    }

    const allCEClear = int >= 0x9;
    const extraZone = int >= 0xa;

    setInt(itemInt.offset, "uint8", progression);
    setInt(itemInt.offset - index - 0x5, "bit", allCEClear ? 1 : 0, {
      bit: 4 + index,
    });

    if (allCEClear) {
      setInt(itemInt.offset + 0x5, "uint8", 0xff);
    }

    if (index === 0) {
      setInt(itemInt.offset - index - 0x5, "uint8", extraZone ? 1 : 0, {
        binary: { bitStart: 1, bitLength: 2 },
      });
    }

    return true;
  } else if ("id" in item && item.id === "time") {
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

export function afterSetInt(item: Item): void {
  if ("id" in item && item.id?.match(/progression-/)) {
    const itemInt = item as ItemInt;

    const [index] = item.id.splitInt();

    const offset = itemInt.offset - index;

    let clearOnce = false;
    let extraZoneClear = false;

    for (let i = 0x0; i < 0x5; i += 0x1) {
      const progression = getInt(offset + i, "uint8");

      switch (progression) {
        case 0x1e:
          extraZoneClear = true;
        case 0x1d:
          clearOnce = true;
      }
    }

    setInt(offset - 0x5, "bit", clearOnce ? 1 : 0, { bit: 0 });

    if (index === 0) {
      setInt(offset - 0x5, "bit", extraZoneClear ? 1 : 0, { bit: 3 });
    }
  } else if ("id" in item && item.id === "chaosEmeralds") {
    const itemBitflags = item as ItemBitflags;

    const offset = itemBitflags.flags[0].offset;

    const chaosEmeralds = (getInt(offset, "uint8") & 0x7f).toBitCount();

    setInt(offset, "bit", chaosEmeralds >= 7 ? 1 : 0, { bit: 7 });
  } else if ("id" in item && item.id?.match(/vsResult-/)) {
    const itemInt = item as ItemInt;

    const [shift] = item.id.splitInt();

    const offset = itemInt.offset - shift;

    let wins = getInt(offset, "uint8");
    const losses = getInt(offset + 0x1, "uint8");
    const draws = getInt(offset + 0x2, "uint8");

    const enabled = wins + losses + draws > 0;

    setInt(offset - 0x1, "uint8", enabled ? 1 : 0);
  }
}

export function generateChecksum(item: ItemChecksum): number {
  let checksum = 0x0;

  for (let i = item.control.offsetStart; i < item.control.offsetEnd; i += 0x4) {
    checksum += getInt(i, "uint32");
  }

  return formatChecksum(checksum, item.dataType);
}
