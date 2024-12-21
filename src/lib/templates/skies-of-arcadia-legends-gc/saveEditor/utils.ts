import { getInt, getString } from "$lib/utils/bytes";
import { formatChecksum } from "$lib/utils/checksum";
import { getItem, updateResources } from "$lib/utils/parser";

import type {
  Item,
  ItemBitflags,
  ItemChecksum,
  ItemInt,
  ItemString,
  Resource,
} from "$lib/types";

export function overrideParseItem(item: Item): Item {
  if ("id" in item && item.id?.match(/superMove-/)) {
    const itemBitflags = item as ItemBitflags;

    const [targetedCharacter, characterIndex] = item.id.splitInt();

    itemBitflags.hidden = targetedCharacter !== characterIndex;

    return itemBitflags;
  }

  return item;
}

export function overrideItem(item: Item): Item {
  if ("id" in item && item.id === "quantity") {
    const itemInt = item as ItemInt;

    const int = getInt(itemInt.offset - 0x2, "uint16", { bigEndian: true });

    itemInt.disabled = int === 0xffff;

    return itemInt;
  }

  return item;
}

export function overrideGetInt(item: Item): [boolean, number | undefined] {
  if ("id" in item && item.id === "quantity") {
    const itemInt = item as ItemInt;

    if (itemInt.disabled) {
      return [true, 0x0];
    }
  }

  return [false, undefined];
}

export function afterSetInt(item: Item): void {
  if ("id" in item && item.id?.match(/characterName-/)) {
    updateResources("characterNames");
  }
}

export function generateChecksum(item: ItemChecksum): number {
  let checksum = 0x0;

  for (let i = item.control.offsetStart; i < item.control.offsetEnd; i += 0x4) {
    checksum ^= getInt(i, "uint32", { bigEndian: true });
  }

  return formatChecksum(checksum, item.dataType);
}

export function getCharacterNames(): Resource {
  const names: Resource = {};

  const itemString = getItem(`slot-characterName-0`) as ItemString;

  [...Array(6).keys()].forEach((index) => {
    const name = getString(
      itemString.offset + index * 0x5c,
      itemString.length,
      itemString.letterDataType,
      { zeroTerminated: true },
    );

    names[index] = name.trim() || "???";
  });

  return names;
}
