import { getInt, getString, setInt } from "$lib/utils/bytes";
import { formatChecksum } from "$lib/utils/checksum";
import { getItem, updateResources } from "$lib/utils/parser";

import type {
  Item,
  ItemChecksum,
  ItemInt,
  ItemString,
  Resource,
} from "$lib/types";

export function overrideItem(item: Item): Item {
  if ("id" in item && item.id?.match(/character-/)) {
    const itemInt = item as ItemInt;

    const [index] = item.id.splitInt();

    itemInt.disabled = index === 0;

    return itemInt;
  } else if ("id" in item && item.id === "characterLevel") {
    const itemInt = item as ItemInt;

    const int = getInt(itemInt.offset, "uint8");

    itemInt.disabled = int === 0xff;

    return itemInt;
  }

  return item;
}

export function overrideGetInt(item: Item): [boolean, number | undefined] {
  if ("id" in item && item.id === "windowColor") {
    const itemInt = item as ItemInt;

    let color = getInt(itemInt.offset, "uint16", {
      binary: itemInt.binary,
    });

    if (color === 0x1f) {
      color = 0x8;
    } else {
      color >>= 0x2;
    }

    return [true, color];
  }

  return [false, undefined];
}

export function overrideSetInt(item: Item, value: string): boolean {
  if ("id" in item && item.id === "windowColor") {
    const itemInt = item as ItemInt;

    let color = parseInt(value);

    if (color === 0x8) {
      color = 0x1f;
    } else {
      color <<= 0x2;
    }

    setInt(itemInt.offset, "uint16", color, { binary: itemInt.binary });

    return true;
  }

  return false;
}

export function afterSetInt(item: Item): void {
  if ("id" in item && item.id?.match(/characterName-/)) {
    const [slotIndex] = item.id.splitInt();

    updateCharacterNames(slotIndex);
  } else if ("id" in item && item.id?.match(/character-/)) {
    const itemInt = item as ItemInt;

    const character = getInt(itemInt.offset, "uint8", {
      binary: itemInt.binary,
    });

    let level = 0x1;

    if (character === 0xf) {
      level = 0xff;
    }

    setInt(itemInt.offset - 0x10, "uint8", level);
  } else if ("id" in item && item.id === "pStats") {
    const itemInt = item as ItemInt;

    const stat = getInt(itemInt.offset, "uint8");
    const previousStat = getInt(itemInt.offset - 0x26, "uint8");
    const equipmentStat = getInt(itemInt.offset - 0x2a, "uint8") - previousStat;

    setInt(itemInt.offset - 0x2a, "uint8", stat + equipmentStat);
    setInt(itemInt.offset - 0x26, "uint8", stat);
    setInt(itemInt.offset, "uint8", stat);
  }
}

export function generateChecksum(item: ItemChecksum): number {
  let checksum = 0x0;

  for (let i = item.control.offsetStart; i < item.control.offsetEnd; i += 0x2) {
    checksum += getInt(i, "uint16");
  }

  while (checksum > 0xffff) {
    checksum = (checksum & 0xffff) + (checksum >> 0x10);
  }

  return formatChecksum(checksum, item.dataType);
}

export function getCharacterNames(slotIndex: number): Resource {
  if (typeof slotIndex === "string") {
    return {};
  }

  const names: Resource = {};

  const itemString = getItem(`slot-${slotIndex}-characterName-0`) as ItemString;

  [...Array(8).keys()].forEach((index) => {
    const name = getString(
      itemString.offset + index * 0x50,
      itemString.length,
      itemString.letterDataType,
      {
        resource: "letters",
      },
    );

    names[index] = name.trim() || "???";
  });

  return names;
}

export function onSlotChange(slotIndex: number): void {
  updateCharacterNames(slotIndex);
}

export function updateCharacterNames(slotIndex: number): void {
  const values = getCharacterNames(slotIndex);

  updateResources("characterNames", values);
}
