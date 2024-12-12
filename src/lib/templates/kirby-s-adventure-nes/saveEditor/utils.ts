import { get } from "svelte/store";

import { gameRegion, gameTemplate } from "$lib/stores";
import { getInt, setInt } from "$lib/utils/bytes";
import { formatChecksum } from "$lib/utils/checksum";
import { clone } from "$lib/utils/format";

import type {
  Item,
  ItemBitflag,
  ItemBitflags,
  ItemChecksum,
  ItemInt,
  ItemSection,
} from "$lib/types";

export function overrideGetRegions(
  dataView: DataView,
  shift: number,
): string[] {
  const $gameTemplate = get(gameTemplate);

  for (let i = 0x0; i < 0x3; i += 0x1) {
    const itemChecksum = clone(
      ($gameTemplate.items[1] as ItemSection).items[0],
    ) as ItemChecksum;

    for (let j = 0x0; j < 0x3; j += 0x1) {
      let tmpShift = shift + j * 0x4c;

      if (i > 0x0) {
        tmpShift += 0x12;
      }

      itemChecksum.offset += tmpShift;
      itemChecksum.control.offsetStart += tmpShift;
      itemChecksum.control.offsetEnd += tmpShift;

      if (dataView.byteLength < itemChecksum.control.offsetEnd) {
        return [];
      }

      const checksum = generateChecksum(itemChecksum, dataView);

      const offset = 0x18d0 + (i === 0x2 ? tmpShift : shift);

      if (
        getInt(offset, "uint8", {}, dataView) === 0xff &&
        checksum === getInt(itemChecksum.offset, "uint16", {}, dataView)
      ) {
        switch (i) {
          case 0x0:
            return ["europe_usarev1_france_germany"];
          case 0x1:
            return ["usa_japan"];
          case 0x2:
            return ["canada"];
        }
      }
    }
  }

  return [];
}

export function initShifts(shifts: number[]): number[] {
  const $gameRegion = get(gameRegion);

  if ($gameRegion !== 0) {
    return [...shifts, 0x12];
  }

  return shifts;
}

export function overrideGetInt(
  item: Item,
): [boolean, (ItemBitflag & { checked: boolean })[] | undefined] {
  if ("id" in item && item.id === "levels-0") {
    const itemBitflags = item as ItemBitflags;

    const flags = itemBitflags.flags.reduce(
      (flags: (ItemBitflag & { checked: boolean })[], flag) => {
        let checked = Boolean(getInt(flag.offset, "bit", { bit: flag.bit }));

        if (flag.bit === 7) {
          checked = getInt(flag.offset - 0x11, "uint8") >= 0x8;
        }

        flags.push({
          ...flag,
          checked,
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
  if ("id" in item && item.id === "levels-0" && flag.bit === 7) {
    let int = 0x0;

    if (value) {
      int = 0x8;
    }

    setInt(flag.offset - 0x11, "uint8", int);

    return true;
  }

  return false;
}

export function afterSetInt(item: Item, flag: ItemBitflag): void {
  if ("id" in item && item.id === "currentLevel") {
    const itemInt = item as ItemInt;

    const int = getInt(itemInt.offset, "uint8");

    setInt(itemInt.offset - 0x3, "uint8", int);
    setInt(itemInt.offset - 0x2, "uint8", int);
  } else if ("id" in item && item.id?.match(/levels-/)) {
    const [index] = item.id.splitInt();

    let offset = flag.offset - index;

    if (flag.bit === 7) {
      offset -= 0x10;
    }

    let count = 0;
    let highestLevel = 0;

    for (let i = 0x0; i < 0x17; i += 0x1) {
      const int = getInt(offset + i, "uint8");

      count += int.toBitCount();

      if (i >= 0x11 && highestLevel === 0 && int) {
        highestLevel = 0x17 - i;
      }
    }

    let level = getInt(offset - 0x1, "uint8");

    if (level >= 0x8) {
      count += 1;
    } else {
      level = highestLevel;
    }

    if (count === 63) {
      level = 0x9;
    }

    setInt(offset - 0x2, "uint8", count);
    setInt(offset - 0x1, "uint8", level);
  }
}

export function generateChecksum(
  item: ItemChecksum,
  dataView = new DataView(new ArrayBuffer(0)),
): number {
  let checksumByte1 = 0x0;
  let checksumByte2 = 0x0;

  for (let i = item.control.offsetStart; i < item.control.offsetEnd; i += 0x1) {
    checksumByte1 ^= getInt(i, "uint8", {}, dataView);
    checksumByte2 += getInt(i, "uint8", {}, dataView);
  }

  const checksum = (checksumByte1 << 0x8) | (checksumByte2 & 0xff);

  return formatChecksum(checksum, item.dataType);
}
