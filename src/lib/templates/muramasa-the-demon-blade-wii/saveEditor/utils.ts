import { getInt, setInt } from "$lib/utils/bytes";
import { formatChecksum, generateCrcCcitt } from "$lib/utils/checksum";

import { Item, ItemChecksum, ItemInt } from "$lib/types";

import { levels, locations } from "./utils/resource";

export function overrideShift(item: Item, shifts: number[]): number[] {
  if ("id" in item && item.id === "inventoryShift") {
    if (shifts[1] !== 0) {
      return [...shifts.slice(0, -1), 0x200];
    }
  }

  return shifts;
}

export function overrideGetInt(item: Item): [boolean, number | undefined] {
  if ("id" in item && item.id === "difficulty") {
    const itemInt = item as ItemInt;

    const difficulty = getInt(itemInt.offset, "uint8") & 0xef;

    return [true, difficulty];
  } else if ("id" in item && item.id === "location") {
    const itemInt = item as ItemInt;

    const location = getInt(itemInt.offset, "uint32", { bigEndian: true });
    const room = getInt(itemInt.offset + 0x10, "uint32", { bigEndian: true });

    const int = (location << 0x8) | room;

    return [true, int];
  } else if ("id" in item && item.id === "level") {
    const itemInt = item as ItemInt;

    const experience = getInt(itemInt.offset, "uint32", { bigEndian: true });

    let level = 1;

    for (let i = 0; i < Object.values(levels).length; i += 1) {
      if (
        experience >= levels[i] &&
        (!levels[i + 1] || experience < levels[i + 1])
      ) {
        level += i;
      }
    }

    return [true, level];
  }

  return [false, undefined];
}

export function overrideSetInt(item: Item, value: string): boolean {
  if ("id" in item && item.id === "difficulty") {
    const itemInt = item as ItemInt;

    let int = parseInt(value);

    const isShiguruiUnlocked = getInt(itemInt.offset, "bit", { bit: 4 });

    int |= int === 0x25 || isShiguruiUnlocked ? 0x10 : 0x0;

    setInt(itemInt.offset, "uint8", int);

    return true;
  } else if ("id" in item && item.id === "location") {
    const itemInt = item as ItemInt;

    const int = parseInt(value);

    const location = int >> 0x8;
    const room = int & 0xff;
    const coordinates = locations[int];

    setInt(itemInt.offset, "uint32", location, { bigEndian: true });
    setInt(itemInt.offset + 0x10, "uint32", room, { bigEndian: true });

    setInt(itemInt.offset + 0x8, "uint32", coordinates[0], { bigEndian: true });
    setInt(itemInt.offset + 0xc, "uint32", coordinates[1], { bigEndian: true });

    return true;
  } else if ("id" in item && item.id === "level") {
    const itemInt = item as ItemInt;

    const level = parseInt(value);

    const experience = levels[level - 1] || levels[0];

    setInt(itemInt.offset, "uint32", experience, { bigEndian: true });

    return true;
  }

  return false;
}

export function afterSetInt(item: Item): void {
  if ("id" in item && item.id === "shiguruiDifficulty") {
    const itemInt = item as ItemInt;

    const int = getInt(itemInt.offset, "bit", { bit: 4 });

    if (int === 0) {
      setInt(itemInt.offset, "bit", 0, { bit: 5 });
    }
  }
}

export function generateChecksum(item: ItemChecksum): number {
  const checksum = generateCrcCcitt(item) ^ 0xffffffff;

  return formatChecksum(checksum, item.dataType);
}
