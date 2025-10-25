import { getInt, setInt } from "$lib/utils/bytes";
import { formatChecksum } from "$lib/utils/checksum";

import { Item, ItemBitflag, ItemChecksum, ItemInt } from "$lib/types";

export function overrideParseItem(item: Item, instanceIndex: number): Item {
  if ("id" in item && item.id?.match(/checksum/)) {
    const itemChecksum = item as ItemChecksum;

    const offset =
      itemChecksum.control.offsetStart + 0x22 + instanceIndex * 0x65c;

    const maxEnergy = getInt(offset, "uint16");

    itemChecksum.disabled = maxEnergy === 0x0;

    return itemChecksum;
  }

  return item;
}

export function overrideItem(item: Item): Item {
  if ("id" in item && item.id?.match(/value-/)) {
    const itemInt = item as ItemInt;

    const [, type] = item.id.split("-");

    let shift = 0x2;

    if (type === "reserveTank") {
      shift = -0x2;
    }

    const max = getInt(itemInt.offset + shift, "uint16");

    itemInt.max = max;
  } else if ("id" in item && item.id === "supplyMode") {
    const itemInt = item as ItemInt;

    const maxReserveTank = getInt(itemInt.offset + 0x14, "uint16");

    itemInt.disabled = maxReserveTank === 0x0;

    return itemInt;
  }

  return item;
}

export function overrideGetInt(item: Item): [boolean, number | undefined] {
  if ("id" in item && item.id === "location") {
    const itemInt = item as ItemInt;

    const room = getInt(itemInt.offset, "uint16");
    const location = getInt(itemInt.offset + 0x2, "uint16");

    const int = (location << 0x8) | room;

    return [true, int];
  } else if ("id" in item && item.id === "supplyMode") {
    const itemInt = item as ItemInt;

    if (itemInt.disabled) {
      return [true, 0x2];
    }
  }

  return [false, undefined];
}

export function overrideSetInt(item: Item, value: string): boolean {
  if ("id" in item && item.id === "location") {
    const itemInt = item as ItemInt;

    const int = parseInt(value);

    const room = int & 0xff;
    const location = int >> 0x8;

    setInt(itemInt.offset, "uint16", room);
    setInt(itemInt.offset + 0x2, "uint16", location);

    return true;
  }

  return false;
}

export function afterSetInt(item: Item, flag: ItemBitflag): void {
  if ("id" in item && item.id?.match(/max-/)) {
    const itemInt = item as ItemInt;

    const [, type] = item.id.split("-");

    let shift = 0x2;

    if (type === "reserveTank") {
      shift = -0x2;
    }

    let value = getInt(itemInt.offset - shift, "uint16");
    const max = getInt(itemInt.offset, "uint16");

    value = Math.min(value, max);

    setInt(itemInt.offset - shift, "uint16", value);
  }

  if ("id" in item && item.id === "max-reserveTank") {
    const itemInt = item as ItemInt;

    const maxReserveTank = getInt(itemInt.offset, "uint16");
    const supplyMode = getInt(itemInt.offset - 0x14, "uint16");

    if (maxReserveTank === 0x0 && supplyMode !== 0x0) {
      setInt(itemInt.offset - 0x14, "uint16", 0x0);
    } else if (maxReserveTank !== 0x0 && supplyMode === 0x0) {
      setInt(itemInt.offset - 0x14, "uint16", 0x1);
    }
  } else if ("id" in item && item.id === "equippedBeams") {
    if ([2, 3].includes(flag.bit)) {
      setInt(flag.offset, "bit", 0, { bit: flag.bit === 2 ? 3 : 2 });
    }
  } else if ("id" in item && item.id === "events") {
    if (flag.label === "Map obtained") {
      const map = getInt(flag.offset, "bit", { bit: 0 });

      setInt(flag.offset, "uint8", map === 1 ? 0xff : 0x0);
    }
  }
}

export function generateChecksum(item: ItemChecksum): number {
  let checksum = 0x0;

  for (let i = item.control.offsetStart; i < item.control.offsetEnd; i += 0x2) {
    checksum += getInt(i, "uint16");
  }

  if (item.id === "checksum2") {
    checksum ^= 0xffff;
  }

  return formatChecksum(checksum, item.dataType);
}
