import { extractBinary, getInt, setInt } from "$lib/utils/bytes";
import { formatChecksum } from "$lib/utils/checksum";
import {
  getHeaderShift,
  getMpkNoteShift,
  getRegionsFromMpk,
  repackMpk,
  resetMpk,
  unpackMpk,
} from "$lib/utils/common/nintendo64";
import { getItem } from "$lib/utils/parser";

import type {
  Item,
  ItemBitflag,
  ItemBitflags,
  ItemChecksum,
  ItemInt,
} from "$lib/types";

import { locations } from "./utils/resource";

export function initHeaderShift(dataView: DataView): number {
  return getHeaderShift(dataView, "mpk");
}

export function beforeInitDataView(
  dataView: DataView,
  shift: number,
): DataView {
  return unpackMpk(dataView, shift);
}

export function overrideGetRegions(): string[] {
  return getRegionsFromMpk();
}

export function onInitFailed(): void {
  resetMpk();
}

export function initShifts(): number[] {
  return getMpkNoteShift();
}

export function overrideGetInt(
  item: Item,
): [boolean, (ItemBitflag & { checked: boolean })[] | undefined] {
  if ("id" in item && item.id === "character") {
    const itemBitflags = item as ItemBitflags;

    const flags = itemBitflags.flags.reduce(
      (flags: (ItemBitflag & { checked: boolean })[], flag) => {
        const int = getInt(flag.offset, "uint8");

        flags.push({
          ...flag,
          checked: flag.bit > 0 ? int >= flag.bit - 1 : int > 0x0,
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
  if ("id" in item && item.id === "character") {
    if (flag.bit >= 1) {
      let int = flag.bit - 1;

      if (!value) {
        int -= 1;
      }

      setInt(flag.offset, "uint8", int);

      return true;
    }
  }

  return false;
}
export function afterSetInt(item: Item): void {
  if ("id" in item && item.id === "health") {
    const itemInt = item as ItemInt;

    let health = getInt(itemInt.offset, "uint16", { bigEndian: true });
    const healthMax = getInt(itemInt.offset - 0x4, "uint16", {
      bigEndian: true,
    });

    health = Math.min(health, healthMax);

    setInt(itemInt.offset, "uint16", health, { bigEndian: true });
  } else if ("id" in item && item.id === "healthMax") {
    const itemInt = item as ItemInt;

    let health = getInt(itemInt.offset + 0x4, "uint16", { bigEndian: true });
    const healthMax = getInt(itemInt.offset, "uint16", { bigEndian: true });

    health = Math.min(health, healthMax);

    setInt(itemInt.offset + 0x4, "uint16", health, { bigEndian: true });
  } else if ("id" in item && item.id === "location") {
    const itemInt = item as ItemInt;

    const int = getInt(itemInt.offset, "uint16", { bigEndian: true });

    const location = locations[int];

    setInt(itemInt.offset - 0x4, "uint32", location.preview, { bigEndian: true, }); // prettier-ignore
    setInt(itemInt.offset + 0x6, "uint16", location.coordinates[0], { bigEndian: true }); // prettier-ignore
    setInt(itemInt.offset + 0x8, "uint16", location.coordinates[1], { bigEndian: true }); // prettier-ignore
    setInt(itemInt.offset + 0xa, "uint16", location.coordinates[2], { bigEndian: true }); // prettier-ignore
    setInt(itemInt.offset + 0xc, "uint8", location.rotation); // prettier-ignore
  } else if ("id" in item && item.id?.match(/fortuneDolls-/)) {
    const itemBitflags = item as ItemBitflags;

    const [index] = item.id.splitInt();

    const totalItem = getItem(
      item.id.replace(`fortuneDolls-${index}`, "fortuneDollsTotal"),
    ) as ItemInt;

    let offset = 0x0;

    if (index === 0) {
      offset = itemBitflags.flags[4].offset;
    } else {
      offset = itemBitflags.flags[0].offset - 0x5;
    }

    let count = 0;

    for (let i = 0x0; i < 0x6; i += 0x1) {
      const int = getInt(offset + i, "uint8");

      if (i === 0x0) {
        count += extractBinary(int, 2, 6).toBitCount();
      } else if (i === 0x5) {
        count += extractBinary(int, 0, 7).toBitCount();
      } else {
        count += int.toBitCount();
      }
    }

    setInt(totalItem.offset, "uint32", count, { bigEndian: true });
  }
}

export function generateChecksum(
  item: ItemChecksum,
  dataView = new DataView(new ArrayBuffer(0)),
): number {
  const bitMask = 0x4c11db7;

  let checksum = 0xffffffff;

  for (let i = item.control.offsetStart; i < item.control.offsetEnd; i += 0x1) {
    let int = getInt(i, "uint8", {}, dataView);

    if (dataView.byteLength > 0x0 && i < item.control.offsetStart + 0x8) {
      int = 0x0;
    }

    checksum ^= int << 0x18;

    for (let j = 0; j < 8; j += 1) {
      if ((checksum & 0x80000000) === 0) {
        checksum = checksum << 0x1;
      } else {
        checksum = (checksum << 0x1) ^ bitMask;
      }
    }
  }

  checksum = ~checksum;

  return formatChecksum(checksum, item.dataType);
}

export function beforeSaving(): ArrayBufferLike {
  return repackMpk();
}

export function onReset(): void {
  resetMpk();
}
