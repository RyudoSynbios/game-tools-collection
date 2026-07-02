import { getInt, setInt } from "$lib/utils/bytes";
import { formatChecksum } from "$lib/utils/checksum";
import { getHeaderShift } from "$lib/utils/common/gameBoyAdvance";
import { getObjKey } from "$lib/utils/format";
import { getResource, getShift } from "$lib/utils/parser";

import type {
  Item,
  ItemBitflag,
  ItemBitflagChecked,
  ItemBitflags,
  ItemChecksum,
  ItemContainer,
  ItemInt,
  ItemString,
  Resource,
} from "$lib/types";

export function initHeaderShift(dataView: DataView): number {
  return getHeaderShift(dataView);
}

export function overrideParseContainerItemsShifts(
  item: ItemContainer,
  shifts: number[],
  index: number,
): [boolean, number[] | undefined] {
  if (item.id === "slots") {
    const shift = getShift(shifts);

    const isActive = getInt(shift + 0x10, "bit", { bit: index });

    if (!isActive) {
      return [true, [-1]];
    }
  }

  return [false, undefined];
}

export function overrideItem(item: Item): Item {
  if ("id" in item && item.id === "machine") {
    const itemInt = item as ItemInt;

    const time = getInt(itemInt.offset - 0x2, "uint16");

    itemInt.resource = time === 0 ? "empty" : "machines";
    itemInt.disabled = time === 0;

    return itemInt;
  }

  return item;
}

export function overrideGetInt(
  item: Item,
): [boolean, number | string | ItemBitflagChecked[] | undefined] {
  if ("id" in item && item.id === "name") {
    const itemString = item as ItemString;

    const letters = getResource("letters") as Resource;

    let name = "";

    for (let i = 0; i < 48; i += 6) {
      const offset = itemString.offset + Math.floor(i / 24) * 0x3;
      const char = getInt(offset, "uint24", {
        binary: { bitStart: i % 24, bitLength: 6 },
      });

      name += letters[char];
    }

    return [true, name];
  } else if ("id" in item && item.id === "unlockedMachines") {
    const itemBitflags = item as ItemBitflags;

    const machines = getInt(itemBitflags.flags[0].offset, "uint8") & 0x7;
    const vermilion = getInt(itemBitflags.flags[0].offset, "bit", { bit: 5 });

    const flags = itemBitflags.flags.map((flag, index) => ({
      ...flag,
      checked: index === 5 ? Boolean(vermilion) : index < machines,
    }));

    return [true, flags];
  } else if ("id" in item && item.id === "machine") {
    const itemInt = item as ItemInt;

    if (itemInt.disabled) {
      return [true, 0x0];
    }
  }

  return [false, undefined];
}

export function overrideSetInt(
  item: Item,
  value: string,
  flag: ItemBitflag,
): boolean {
  if ("id" in item && item.id === "name") {
    const itemString = item as ItemString;

    const letters = getResource("letters") as Resource;

    for (let i = 0x0; i < 0x2; i += 0x1) {
      let int = 0x0;

      for (let j = 0x0; j < 0x4; j += 0x1) {
        const index = Object.values(letters).findIndex(
          (letter) => letter === value[i * 4 + j],
        );

        let letter = itemString.fallback || 0x0;

        if (index !== -1) {
          letter = parseInt(getObjKey(letters, index));
        }

        int |= letter << (j * 6);
      }

      setInt(itemString.offset + i * 0x3, "uint24", int);
    }

    return true;
  } else if ("id" in item && item.id === "unlockedMachines") {
    const itemBitflags = item as ItemBitflags;

    let int = itemBitflags.flags.findIndex((f) => f.label === flag.label);

    if (int === 5) {
      setInt(flag.offset, "bit", value, { bit: flag.bit });

      return true;
    }

    if (value) {
      int += 1;
    }

    setInt(flag.offset, "uint8", int, {
      binary: { bitStart: 0, bitLength: 5 },
    });

    return true;
  }

  return false;
}

export function generateChecksum(item: ItemChecksum): number {
  let checksum = 0x0;

  // prettier-ignore
  if (item.id === "checksum1") {
    for (let i = item.control.offsetStart; i < item.control.offsetEnd; i += 0x4) {
      checksum += getInt(i, "uint32");
    }
  } else if (item.id === "checksum2") {
    for (let i = item.control.offsetStart; i < item.control.offsetEnd; i += 0x4) {
      checksum += getInt(i, "uint32") ? 0x1 : 0x0;
    }
  } else if (item.id === "checksum3") {
    checksum += getInt(item.control.offsetStart, "uint32");
    checksum += getInt(item.control.offsetStart + 0x8b0, "uint32");
    checksum += getInt(item.control.offsetStart + 0xbe0, "uint32");
    checksum += getInt(item.control.offsetStart + 0xf10, "uint32");
    checksum += getInt(item.control.offsetStart + 0x1240, "uint32");
  }

  return formatChecksum(checksum, item.dataType);
}
