import { getInt, getString, setInt } from "$lib/utils/bytes";
import { formatChecksum } from "$lib/utils/checksum";
import { getItem, updateResources } from "$lib/utils/parser";

import type { Item, ItemChecksum, ItemInt, ItemString } from "$lib/types";

export function overrideItem(item: Item): Item {
  if ("id" in item && item.id?.match(/character-/)) {
    const itemInt = item as ItemInt;

    const split = item.id.split("-");

    const index = parseInt(split[1]);

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
  if ("id" in item && item.id?.match(/wc-/)) {
    const itemInt = item as ItemInt;

    const int1 = getInt(itemInt.offset, "uint8");
    const int2 = getInt(itemInt.offset + 0x1, "uint8");

    let int = 0;

    if (item.id === "wc-red") {
      int = ((int1 & 0x1f) >> 0x2) + ((int1 & 0x1f) === 0x1f ? 0x1 : 0x0);
    } else if (item.id === "wc-green") {
      int =
        ((int2 & 0x3) << 0x1) +
        ((int1 & 0xe0) >> 0x7) +
        ((int1 & 0xe0) === 0xe0 ? 0x1 : 0x0);
    } else if (item.id === "wc-blue") {
      int = ((int2 & 0xfc) >> 0x4) + ((int2 & 0xfc) === 0x7c ? 0x1 : 0x0);
    }

    return [true, int];
  }

  return [false, undefined];
}

export function overrideSetInt(item: Item, value: string): boolean {
  if ("id" in item && item.id?.match(/wc-/)) {
    const itemInt = item as ItemInt;

    const int = parseInt(value);

    let value1 = getInt(itemInt.offset, "uint8");
    let value2 = getInt(itemInt.offset + 0x1, "uint8");

    if (item.id === "wc-red") {
      value1 = (value1 & 0xe0) + (int << 0x2) - (int === 8 ? 0x1 : 0x0);
    } else if (item.id === "wc-green") {
      value1 = (value1 & 0x1f) + ((int & 0x1) << 0x7) + (int === 8 ? 0xe0 : 0x0); // prettier-ignore
      value2 = (value2 & 0xfc) + (int >> 0x1) - (int === 8 ? 0x1 : 0x0);
    } else if (item.id === "wc-blue") {
      value2 = (value2 & 0x3) + (int << 0x4) - (int === 8 ? 0x4 : 0x0);
    }

    setInt(itemInt.offset, "uint8", value1);
    setInt(itemInt.offset + 0x1, "uint8", value2);

    return true;
  }

  return false;
}

export function afterSetInt(item: Item): void {
  if ("id" in item && item.id?.match(/characterName-/)) {
    const split = item.id.split("-");

    const slotIndex = parseInt(split[1]);

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

  while (checksum > 0x10000) {
    checksum = (checksum & 0xffff) + (checksum >> 0x10);
  }

  return formatChecksum(checksum, item.dataType);
}

export function getCharacterNames(slotIndex: number): {
  [value: number]: string;
} {
  if (isNaN(slotIndex)) {
    return {};
  }

  const names: { [value: number]: string } = {};

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
