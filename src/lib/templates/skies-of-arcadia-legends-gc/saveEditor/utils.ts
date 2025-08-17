import { get } from "svelte/store";

import { gameRegion } from "$lib/stores";
import { getInt, getString, setInt } from "$lib/utils/bytes";
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
  const $gameRegion = get(gameRegion);
  if (
    "id" in item &&
    (item.id?.match(/characterName-/) || item.id === "name") &&
    $gameRegion === 2
  ) {
    const itemString = item as ItemString;

    itemString.letterDataType = "uint16";
    itemString.letterBigEndian = true;

    return itemString;
  } else if ("id" in item && item.id?.match(/superMove-/)) {
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
  } else if ("id" in item && item.id === "shipBonusMaxHP") {
    const itemInt = item as ItemInt;

    const type = getInt(itemInt.offset - 0x1, "uint8");

    if ([0x2, 0x3, 0x4].includes(type)) {
      itemInt.min = 36000;
      itemInt.max = 290000;
      itemInt.step = 2000;
    } else {
      itemInt.min = 10000;
      itemInt.max = 137000;
      itemInt.step = 1000;
    }

    return itemInt;
  }

  return item;
}

export function overrideGetInt(item: Item): [boolean, number | undefined] {
  if ("id" in item && item.id === "location") {
    const itemInt = item as ItemInt;

    const location = getInt(itemInt.offset, "uint16", { bigEndian: true });
    const room = getInt(itemInt.offset + 0x1a41, "uint8");

    let int = (location << 0x8) | room;

    if (location >> 0x8 === 0x63) {
      int = 0x63003c;
    }

    return [true, int];
  } else if ("id" in item && item.id === "shipBonusMaxHP") {
    const itemInt = item as ItemInt;

    const type = getInt(itemInt.offset - 0x1, "uint8");

    let int = getInt(itemInt.offset, "uint8");

    if ([0x2, 0x3, 0x4].includes(type)) {
      int = int * 2000 + 36000;
    } else {
      int = int * 1000 + 10000;
    }

    return [true, int];
  } else if ("id" in item && item.id === "quantity") {
    const itemInt = item as ItemInt;

    if (itemInt.disabled) {
      return [true, 0x0];
    }
  }

  return [false, undefined];
}

export function overrideSetInt(item: Item, value: string): boolean {
  if ("id" in item && item.id === "location") {
    const itemInt = item as ItemInt;

    const int = parseInt(value);

    const location = int >> 0x8;
    const room = int & 0xff;

    setInt(itemInt.offset, "uint16", location, { bigEndian: true });
    setInt(itemInt.offset + 0x1a41, "uint8", room);
    setInt(itemInt.offset + 0x1b36, "uint8", room);

    return true;
  } else if ("id" in item && item.id === "shipBonusMaxHP") {
    const itemInt = item as ItemInt;

    const type = getInt(itemInt.offset - 0x1, "uint8");

    let int = parseInt(value);

    if ([0x2, 0x3, 0x4].includes(type)) {
      int = (int - 36000) / 2000;
    } else {
      int = (int - 10000) / 1000;
    }

    setInt(itemInt.offset, "uint8", int);

    return true;
  }

  return false;
}

export function afterSetInt(item: Item): void {
  if ("id" in item && item.id?.match(/characterName-/)) {
    updateResources("characterNames");
  } else if ("id" in item && item.id === "item") {
    const itemInt = item as ItemInt;

    const int = getInt(itemInt.offset, "uint16", { bigEndian: true });
    const quantity = getInt(itemInt.offset + 0x2, "uint8");

    if (int !== 0xffff && quantity === 0xff) {
      setInt(itemInt.offset + 0x2, "uint8", 0x1);
    } else if (int === 0xffff) {
      setInt(itemInt.offset + 0x2, "uint8", 0xff);
    }
  } else if ("id" in item && item.id === "ship") {
    const itemInt = item as ItemInt;

    const int = getInt(itemInt.offset, "uint8");

    let value = 0xff;

    if ([0x1, 0x7].includes(int)) {
      value = 0x0;
    } else if (int === 0x5) {
      value = 0x1;
    } else if ([0x2, 0x3, 0x6, 0x8, 0xc].includes(int)) {
      value = 0x2;
    } else if ([0x9, 0xa, 0xb, 0xe, 0xf, 0x10].includes(int)) {
      value = 0x4;
    }

    setInt(itemInt.offset - 0x1b56, "uint8", value);
  } else if ("id" in item && item.id?.match(/bounty-/)) {
    const itemInt = item as ItemInt;

    const [index] = item.id.splitInt();

    const offset = itemInt.offset - index - 0xc62;
    const value = getInt(itemInt.offset, "uint8") ? 1 : 0;

    setInt(offset, "bit", value, { bit: index });
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
      {
        letterBigEndian: itemString.letterBigEndian,
        endCode: itemString.endCode,
      },
    );

    names[index] = name.trim();
  });

  names[0xff] = "-";

  return names;
}
