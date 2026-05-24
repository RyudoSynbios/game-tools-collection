import Long from "long";
import { get } from "svelte/store";

import { gamePlatform, gameRegion } from "$lib/stores";
import { getInt, setInt } from "$lib/utils/bytes";
import { getTime, setTime } from "$lib/utils/common/gamecube";
import { getPartialValue, makeOperations } from "$lib/utils/format";
import { getClosestItem } from "$lib/utils/parser";

import type {
  Item,
  ItemBitflags,
  ItemChecksum,
  ItemInt,
  ItemString,
} from "$lib/types";

import { itemQuantites, letterList } from "./utils/resource";

export function setGamePlatform(dataView: DataView, fileName: string): void {
  if (fileName.match(/zeldaTp.dat/)) {
    gamePlatform.set(1);
  } else {
    gamePlatform.set(0);
  }
}

export function initShifts(shifts: number[]): number[] {
  const $gamePlatform = get(gamePlatform);

  if ($gamePlatform === 1) {
    return [...shifts, -0x4040];
  }

  return shifts;
}

export function overrideParseItem(item: Item): Item {
  if ("id" in item && item.id?.match(/dungeon-/)) {
    const itemBitflags = item as ItemBitflags;

    const [, type] = item.id.split("-");
    const [index] = item.id.splitInt();

    if (type === "events" && index === 8) {
      itemBitflags.hidden = true;
    }

    if (type === "items" && index === 8) {
      itemBitflags.flags[3].hidden = true;
    }

    return itemBitflags;
  }

  return item;
}

export function overrideItem(item: Item): Item {
  const $gameRegion = get(gameRegion);

  if ("id" in item && item.id === "name" && $gameRegion === 2) {
    const ItemString = item as ItemString;

    ItemString.encoding = "windows31J";

    return ItemString;
  } else if ("id" in item && item.id === "valueRupees") {
    const itemInt = item as ItemInt;

    const { shift, valuesMax } = itemQuantites.rupees;

    const upgrade = getInt(itemInt.offset + shift, "uint8");

    itemInt.max = valuesMax[upgrade];
  } else if ("id" in item && item.id?.match(/valueBombs/)) {
    const itemInt = item as ItemInt;

    const [, type] = item.id.split("-");

    const { shift, valuesMax } = itemQuantites[type];

    const upgrade = getInt(itemInt.offset + shift, "bit", { bit: 7 });

    itemInt.max = valuesMax[upgrade];
  }

  return item;
}

export function overrideGetInt(item: Item): [boolean, number | undefined] {
  if ("id" in item && item.id === "playtime") {
    const itemInt = item as ItemInt;

    const playtime = getTime(itemInt.offset);

    const int = makeOperations(playtime, itemInt.operations);

    return [true, int];
  } else if ("id" in item && item.id === "heartPieces") {
    const itemInt = item as ItemInt;

    const health = getInt(itemInt.offset, "uint16", { bigEndian: true });

    return [true, health % 5];
  }

  return [false, undefined];
}

export function overrideSetInt(item: Item, value: string): boolean {
  if ("id" in item && item.id === "playtime") {
    const itemInt = item as ItemInt;

    const oldInt = getTime(itemInt.offset);

    let int = makeOperations(parseInt(value), itemInt.operations, true);
    int = getPartialValue(oldInt, int, itemInt.operations!);

    setTime(itemInt.offset, int);

    return true;
  } else if ("id" in item && item.id === "heartPieces") {
    const itemInt = item as ItemInt;

    const heartPieces = parseInt(value);

    let health = getInt(itemInt.offset, "uint16", {
      bigEndian: true,
    });

    health += -(health % 5) + heartPieces;

    setInt(itemInt.offset, "uint16", health, { bigEndian: true });

    return true;
  } else if ("id" in item && item.id === "fishSize") {
    const itemInt = item as ItemInt;

    let size = parseInt(value);

    size = makeOperations(size, [itemInt.operations![0]], true);

    setInt(itemInt.offset, "uint8", Math.ceil(size));

    return true;
  }

  return false;
}

export function afterSetInt(item: Item): void {
  if ("id" in item && item.id === "maxRupees") {
    const itemInt = item as ItemInt;

    const { shift, valuesMax } = itemQuantites.rupees;

    let value = getInt(itemInt.offset - shift, "uint16", {
      bigEndian: true,
    });

    const upgrade = getInt(itemInt.offset, "uint8");

    value = Math.min(value, valuesMax[upgrade]);

    setInt(itemInt.offset - shift, "uint16", value, {
      bigEndian: true,
    });
  } else if ("id" in item && item.id === "goldenWolf") {
    const itemBitflags = item as ItemBitflags;

    const skillsItem = getClosestItem("hiddenSkills", item) as ItemBitflags;

    const initFlag = itemBitflags.flags[0];

    let count = 0;

    itemBitflags.flags.forEach((flag) => {
      count += getInt(flag.offset, "bit", { bit: flag.bit });
    });

    if (count > 0 && !getInt(initFlag.offset, "bit", { bit: initFlag.bit })) {
      count += 1;
    }

    skillsItem.flags.forEach((flag, index) => {
      setInt(flag.offset, "bit", index < count ? 1 : 0, { bit: flag.bit });
    });
  } else if ("id" in item && item.id === "maxArrows") {
    const itemInt = item as ItemInt;

    let arrows = getInt(itemInt.offset - 0xc, "uint8");
    const maxArrows = getInt(itemInt.offset, "uint8");

    arrows = Math.min(arrows, maxArrows);

    setInt(itemInt.offset - 0xc, "uint8", arrows);
  } else if ("id" in item && item.id?.match(/maxBombs/)) {
    const itemInt = item as ItemInt;

    for (let i = 1; i < 4; i += 1) {
      const { shift, valuesMax } = Object.values(itemQuantites)[i];

      let bombs = getInt(itemInt.offset - shift, "uint8");

      const upgrade = getInt(itemInt.offset, "bit", { bit: 7 });

      bombs = Math.min(bombs, valuesMax[upgrade]);

      setInt(itemInt.offset - shift, "uint8", bombs);
    }
  } else if ("id" in item && item.id === "receivedLetters") {
    const itemBitflags = item as ItemBitflags;

    let offset = itemBitflags.flags[0].offset + 0xd;

    // We clear the letter table
    for (let i = 0x0; i < 0x10; i += 0x4) {
      setInt(offset + i, "uint32", 0x0);
    }

    itemBitflags.flags.forEach((flag, index) => {
      const letter = letterList.find((letter) => letter.order === index);

      const checked = getInt(flag.offset, "bit", { bit: flag.bit });

      setInt(offset, "uint8", letter && checked ? letter.index : 0x0);

      offset += checked ? 0x1 : 0x0;
    });
  }
}

export function generateChecksum(item: ItemChecksum): bigint {
  let high = 0x0;
  let low = 0x0;

  for (let i = item.control.offsetStart; i < item.control.offsetEnd; i += 0x1) {
    high += getInt(i, "uint8");
    low += ~getInt(i, "uint8");
  }

  return new Long(low, high).toUnsigned().toBigInt();
}
