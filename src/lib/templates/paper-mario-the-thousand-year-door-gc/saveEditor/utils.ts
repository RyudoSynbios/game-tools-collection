import Long from "long";
import { get } from "svelte/store";

import { gameRegion } from "$lib/stores";
import {
  extractBit,
  getInt,
  getString,
  setInt,
  setString,
} from "$lib/utils/bytes";
import { formatChecksum } from "$lib/utils/checksum";
import { getPartialValue, makeOperations } from "$lib/utils/format";

import {
  Item,
  ItemBitflag,
  ItemBitflags,
  ItemChecksum,
  ItemInt,
  ItemSection,
  ItemString,
} from "$lib/types";

import { locationList } from "./utils/resource";

export function overrideParseItem(item: Item): Item {
  const $gameRegion = get(gameRegion);

  if ("id" in item && item.id === "name" && $gameRegion === 2) {
    const itemString = item as ItemString;

    itemString.length = 0x10;
    itemString.letterDataType = "uint16";
    itemString.letterBigEndian = true;
    itemString.encoding = "windows31J";
    itemString.regex =
      "[ !.?~\u3041-\u308d\u308f\u3092-\u3094\u30a1-\u30ed\u30ef\u30f2-\u30f4\u30fb\u30fc\uff10-\uff19]";

    return itemString;
  } else if ("id" in item && item.id?.match(/baseStats-/)) {
    const itemInt = item as ItemInt;

    const [shift] = item.id.splitInt();

    const calculate = getInt(itemInt.offset, "uint16", { bigEndian: true });
    const base = getInt(itemInt.offset + shift, "uint16", { bigEndian: true });

    itemInt.min = Math.max(1, calculate - base);

    return itemInt;
  } else if ("id" in item && item.id?.match(/yoshi-/)) {
    const itemSection = item as ItemSection;

    const [characterIndex] = item.id.splitInt();

    if (characterIndex !== 3) {
      itemSection.hidden = true;
    }

    return itemSection;
  } else if ("id" in item && item.id?.match(/piantaScore-/)) {
    const itemInt = item as ItemInt;

    const [, , type] = item.id.split("-");
    const [gameIndex] = item.id.splitInt();

    if (
      (type === "distance" && gameIndex === 0) ||
      (type === "place" && gameIndex === 1) ||
      (type === "time" && [2, 3].includes(gameIndex))
    ) {
      itemInt.hidden = false;
    }

    return itemInt;
  }

  return item;
}

export function overrideItem(item: Item): Item {
  if ("id" in item && item.id === "badgeEquipped") {
    const itemInt = item as ItemInt;

    const badge = getInt(itemInt.offset - 0x190, "uint16", { bigEndian: true });

    itemInt.disabled = badge === 0x0;

    return itemInt;
  }

  return item;
}

export function overrideGetInt(
  item: Item,
): [boolean, number | (ItemBitflag & { checked: boolean })[] | undefined] {
  if ("id" in item && item.id === "playtime") {
    const itemInt = item as ItemInt;

    const playtime = getPlaytime(itemInt.offset);

    const int = makeOperations(playtime, itemInt.operations);

    return [true, int];
  } else if ("id" in item && item.id === "location") {
    const itemInt = item as ItemInt;

    const locationId = getString(itemInt.offset, 0x8, "uint8", {
      endCode: 0x0,
    });

    const index = locationList.findIndex(
      (location) => location.id === locationId,
    );

    return [true, index];
  } else if ("id" in item && item.id?.match(/crystalStars-/)) {
    const itemInt = item as ItemInt;

    const [, type] = item.id.split("-");

    const int = getInt(itemInt.offset, "uint16", {
      bigEndian: true,
    });

    let count = int.toBitCount();

    if (type === "stars" && extractBit(int, 0)) {
      count -= 1;
    }

    return [true, count];
  } else if ("id" in item && item.id?.match(/equipment-/)) {
    const itemBitflags = item as ItemBitflags;

    const [, type] = item.id.split("-");

    let itemIndex = 0x0;

    switch (type) {
      case "hammers":
        itemIndex = 0x9;
        break;
      case "boots":
        itemIndex = 0x6;
        break;
      case "transformations":
        itemIndex = 0x2;
        break;
    }

    const flags = itemBitflags.flags.reduce(
      (flags: (ItemBitflag & { checked: boolean })[], flag) => {
        flags.push({
          ...flag,
          checked: hasImportantThing(flag.offset, itemIndex + flag.bit),
        });

        return flags;
      },
      [],
    );

    return [true, flags];
  } else if ("id" in item && item.id === "badgeEquipped") {
    const itemInt = item as ItemInt;

    const badge = getInt(itemInt.offset, "uint16", { bigEndian: true });

    if (badge === 0x0) {
      return [true, 0x0];
    }

    const isEquipped =
      badge === getInt(itemInt.offset - 0x190, "uint16", { bigEndian: true });

    return [true, isEquipped ? 1 : 0];
  }

  return [false, undefined];
}

export function overrideSetInt(
  item: Item,
  value: string,
  flag: ItemBitflag,
): boolean {
  if ("id" in item && item.id === "playtime") {
    const itemInt = item as ItemInt;

    const oldInt = getPlaytime(itemInt.offset);

    let int = makeOperations(parseInt(value), itemInt.operations, true);
    int = getPartialValue(oldInt, int, itemInt.operations!);

    const long = Long.fromNumber(int).multiply(40500000);

    setInt(itemInt.offset, "uint32", long.high, { bigEndian: true });
    setInt(itemInt.offset + 0x4, "uint32", long.low, { bigEndian: true });

    return true;
  } else if ("id" in item && item.id === "location") {
    const itemInt = item as ItemInt;

    const index = parseInt(value);

    const location = locationList[index];

    setString(itemInt.offset, 0x8, "uint8", location.id);

    setInt(itemInt.offset + 0x10a8, "float32", location.coordinates[0], {
      bigEndian: true,
    });
    setInt(itemInt.offset + 0x10ac, "float32", location.coordinates[1], {
      bigEndian: true,
    });
    setInt(itemInt.offset + 0x10b0, "float32", location.coordinates[2], {
      bigEndian: true,
    });

    return true;
  } else if ("id" in item && item.id?.match(/crystalStars-/)) {
    const itemInt = item as ItemInt;

    const [, type] = item.id.split("-");

    let int = parseInt(value);

    if (type === "stars") {
      if (int === 0x0) {
        int += getInt(itemInt.offset + 0x1, "bit", { bit: 0 });
      } else {
        int += 0x1;
      }
    }

    let units = 0x0;

    for (let i = 0x0; i < 0x7; i += 0x1) {
      // We remove all Crystal Stars
      updateImportantThing(itemInt.offset + 0x14, 0x72 + i, 0x0);
    }

    for (let i = 0x0; i < int; i += 0x1) {
      units |= 0x1 << i;

      if (i >= 0x1) {
        // We add the desired Crystal Stars
        updateImportantThing(itemInt.offset + 0x14, 0x0, 0x71 + i);
      }
    }

    setInt(itemInt.offset, "uint16", units, { bigEndian: true });
    setInt(itemInt.offset - 0x10, "uint16", int * 100, { bigEndian: true });

    return true;
  } else if ("id" in item && item.id?.match(/baseStats-/)) {
    const itemInt = item as ItemInt;

    let [shift] = item.id.splitInt();

    const int = parseInt(value);

    const calculate = getInt(itemInt.offset, "uint16", { bigEndian: true });
    const base = getInt(itemInt.offset + shift, "uint16", { bigEndian: true });

    const diff = int - calculate;

    setInt(itemInt.offset, "uint16", value, { bigEndian: true });
    setInt(itemInt.offset + shift, "uint16", base + diff, { bigEndian: true });

    return true;
  } else if ("id" in item && item.id?.match(/equipment-/)) {
    const [, type] = item.id.split("-");

    let itemIndex = flag.bit;

    switch (type) {
      case "hammers":
        itemIndex += 0x9;
        break;
      case "boots":
        itemIndex += 0x6;
        break;
      case "transformations":
        itemIndex += 0x2;
        break;
    }

    if (value) {
      updateImportantThing(flag.offset, 0x0, itemIndex);
    } else {
      updateImportantThing(flag.offset, itemIndex, 0x0);
    }

    return true;
  } else if ("id" in item && item.id === "badgeEquipped") {
    const itemInt = item as ItemInt;

    let int = 0x0;

    if (value === "1") {
      int = getInt(itemInt.offset - 0x190, "uint16", {
        bigEndian: true,
      });
    }

    setInt(itemInt.offset, "uint16", int, { bigEndian: true });

    return true;
  }

  return false;
}

export function afterSetInt(item: Item): void {
  if ("id" in item && item.id === "badge") {
    const itemInt = item as ItemInt;

    const badge = getInt(itemInt.offset, "uint16", { bigEndian: true });
    const equipped = getInt(itemInt.offset + 0x190, "uint16", {
      bigEndian: true,
    });

    if (badge === 0x0) {
      setInt(itemInt.offset + 0x190, "uint16", 0x0, { bigEndian: true });
    } else if (equipped !== 0x0) {
      setInt(itemInt.offset + 0x190, "uint16", badge, { bigEndian: true });
    }
  }
}

export function generateChecksum(item: ItemChecksum): number {
  let checksum = 0x0;

  for (let i = item.control.offsetStart; i < item.control.offsetEnd; i += 0x1) {
    checksum += getInt(i, "uint8");
  }

  if (item.id === "checksum2") {
    checksum = ~checksum;
  }

  return formatChecksum(checksum, item.dataType);
}

function getPlaytime(offset: number): number {
  const int1 = getInt(offset, "uint32", { bigEndian: true });
  const int2 = getInt(offset + 0x4, "uint32", { bigEndian: true });

  const long = new Long(int2, int1);

  return long.divide(40500000).toNumber();
}

function hasImportantThing(offset: number, value: number): boolean {
  for (let i = 0x0; i < 0x79; i += 0x1) {
    if (getInt(offset + i * 0x2, "uint16", { bigEndian: true }) === value) {
      return true;
    }
  }

  return false;
}

function updateImportantThing(
  offset: number,
  previous: number,
  value: number,
): void {
  let itemPosition = -1;

  for (let i = 0x0; i < 0x79; i += 0x1) {
    if (getInt(offset + i * 0x2, "uint16", { bigEndian: true }) === previous) {
      itemPosition = i;
      break;
    }
  }

  if (itemPosition !== -1) {
    setInt(offset + itemPosition * 0x2, "uint16", value, { bigEndian: true });
  }
}
