import Long from "long";
import { get } from "svelte/store";

import { gameRegion } from "$lib/stores";
import {
  checkNextHiddenFlags,
  getInt,
  getString,
  setInt,
  setString,
} from "$lib/utils/bytes";
import { getClosestItem } from "$lib/utils/parser";

import type {
  Item,
  ItemBitflag,
  ItemBitflagChecked,
  ItemBitflags,
  ItemChecksum,
  ItemInt,
  ItemString,
} from "$lib/types";

import { itemQuantites, locationList } from "./utils/resource";

export function overrideParseItem(item: Item): Item {
  const $gameRegion = get(gameRegion);

  if ("id" in item && item.id === "name" && $gameRegion === 2) {
    const itemString = item as ItemString;

    itemString.length = 0x10;
    itemString.encoding = "windows31J";
    itemString.regex =
      "[ ,.0-9A-Za-z\u30fc\u30a1-\u30f3\u3041-\u308d\u308f\u3092\u3093]";

    return itemString;
  }
  return item;
}

export function overrideItem(item: Item): Item {
  if ("id" in item && item.id === "valueRupees") {
    const itemInt = item as ItemInt;

    const { shift, valuesMax } = itemQuantites.rupees;

    const upgrade = getInt(itemInt.offset + shift, "uint8");

    itemInt.max = valuesMax[upgrade];
  } else if ("id" in item && item.id === "magic") {
    const itemInt = item as ItemInt;

    itemInt.max = getInt(itemInt.offset - 0x1, "uint8");

    return itemInt;
  }

  return item;
}

export function overrideGetInt(
  item: Item,
): [boolean, number | ItemBitflagChecked[] | undefined] {
  if ("id" in item && item.id === "location") {
    const itemInt = item as ItemInt;

    const locationId = getString(itemInt.offset, 0x8, "uint8", {
      endCode: 0x0,
    });
    const room = getInt(itemInt.offset + 0x8, "uint8");

    let index = -1;

    if (locationId === "sea") {
      index = locationList.findIndex(
        (location) => location.id === locationId && location.room === room,
      );
    } else {
      index = locationList.findIndex((location) => location.id === locationId);
    }

    return [true, index];
  } else if ("id" in item && item.id === "heartPieces") {
    const itemInt = item as ItemInt;

    const health = getInt(itemInt.offset, "uint16", { bigEndian: true }) % 4;

    return [true, health];
  } else if ("id" in item && item.id?.match(/daytime-/)) {
    const itemInt = item as ItemInt;

    const [, type] = item.id.split("-");

    const time = getDayTime(itemInt.offset, type);

    return [true, time];
  } else if ("id" in item && item.id === "heartPiecesFlags") {
    const itemBitflags = item as ItemBitflags;

    const flags = itemBitflags.flags.map((flag, index) => {
      let checked = false;

      if ([4, 6].includes(index)) {
        // Salvatore's mini-games
        checked = getInt(flag.offset, "uint8") >= 0x1;
      } else if (index === 34) {
        // Orca's Rank
        checked = getInt(flag.offset, "uint8") >= 0x3;
      } else {
        checked = getInt(flag.offset, "bit", { bit: flag.bit }) === 1;
      }

      return {
        ...flag,
        checked,
      };
    });

    return [true, flags];
  }

  return [false, undefined];
}

export function overrideSetInt(
  item: Item,
  value: string,
  flag: ItemBitflag,
): boolean {
  if ("id" in item && item.id === "location") {
    const itemInt = item as ItemInt;

    const index = parseInt(value);

    const location = locationList[index];

    setString(itemInt.offset, 0x8, "uint8", location.id);

    setInt(itemInt.offset + 0x8, "uint8", location.room);
    setInt(itemInt.offset + 0x9, "uint8", location.spawn);

    return true;
  } else if ("id" in item && item.id === "maxHealth") {
    const itemInt = item as ItemInt;

    let maxHealth = parseInt(value) * 4;

    const healthPieces =
      getInt(itemInt.offset, "uint16", { bigEndian: true }) % 4;

    maxHealth += healthPieces;

    setInt(itemInt.offset, "uint16", maxHealth, { bigEndian: true });

    return true;
  } else if ("id" in item && item.id === "heartPieces") {
    const itemInt = item as ItemInt;

    const heartPieces = parseInt(value);

    let health = getInt(itemInt.offset, "uint16", {
      bigEndian: true,
    });

    health += -(health % 4) + heartPieces;

    setInt(itemInt.offset, "uint16", health, { bigEndian: true });

    return true;
  } else if ("id" in item && item.id?.match(/daytime-/)) {
    const itemInt = item as ItemInt;

    const [, type] = item.id.split("-");

    let hours = parseInt(value);
    let minutes = parseInt(value);

    if (type === "hours") {
      minutes = getDayTime(itemInt.offset, "minutes");
    } else if (type === "minutes") {
      hours = getDayTime(itemInt.offset, "hours");
    }

    const time = (hours + minutes / 60) * 15;

    setInt(itemInt.offset, "float32", time, {
      bigEndian: true,
    });

    return true;
  } else if ("id" in item && item.id === "heartPiecesFlags") {
    const itemBitflags = item as ItemBitflags;

    const index = itemBitflags.flags.findIndex((f) => f.label === flag.label);

    if (![4, 6, 34].includes(index)) {
      return false;
    }

    if ([4, 6].includes(index)) {
      // Salvatore's mini-games
      setInt(flag.offset, "uint8", value ? 0x1 : 0x0);
    } else if (index === 34) {
      // Orca's Rank
      setInt(flag.offset, "uint8", value ? 0x3 : 0x2);
      setInt(flag.offset - 0xc1, "bit", 0, { bit: 5 });
    }

    return true;
  }

  return false;
}

export function afterSetInt(item: Item, flag: ItemBitflag): void {
  if ("id" in item && item.id === "name") {
    const itemString = item as ItemString;

    const int = getInt(itemString.offset, "uint8");

    // A slot is disable if the first character of Link's name is 0x0
    // If the input is empty because of a wrong input, we add an empty space
    if (int === 0x0) {
      setInt(itemString.offset, "uint16", 0x2000, { bigEndian: true });
    }
  } else if ("id" in item && item.id === "maxRupees") {
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
  } else if ("id" in item && item.id === "magicLevel") {
    const itemInt = item as ItemInt;

    const magic = getInt(itemInt.offset + 0x1, "uint8");
    const maxMagic = getInt(itemInt.offset, "uint8");

    setInt(itemInt.offset + 0x1, "uint8", Math.min(magic, maxMagic));
  } else if ("id" in item && item.id === "sword") {
    const itemInt = item as ItemInt;

    let int = 0x0;

    const sword = getInt(itemInt.offset, "uint8");

    switch (sword) {
      case 0x38:
        int = 0x1;
        break;
      case 0x39:
        int = 0x3;
        break;
      case 0x3a:
        int = 0x7;
        break;
      case 0x3e:
        int = 0xf;
        break;
    }

    setInt(itemInt.offset + 0xa4, "uint8", int);
  } else if ("id" in item && item.id === "shield") {
    const itemInt = item as ItemInt;

    let int = 0x0;

    const shield = getInt(itemInt.offset, "uint8");

    switch (shield) {
      case 0x3b:
        int = 0x1;
        break;
      case 0x3c:
        int = 0x3;
        break;
    }

    setInt(itemInt.offset + 0xa4, "uint8", int);
  } else if ("id" in item && item.id === "powerBracelets") {
    const itemInt = item as ItemInt;

    const powerBracelets = getInt(itemInt.offset, "uint8");

    setInt(itemInt.offset + 0xa4, "uint8", powerBracelets === 0x28 ? 0x1 : 0x0);
  } else if ("id" in item && item.id === "maxQuantities") {
    const itemInt = item as ItemInt;

    let quantity = getInt(itemInt.offset - 0x6, "uint8");
    const maxQuantity = getInt(itemInt.offset, "uint8");

    quantity = Math.min(quantity, maxQuantity);

    setInt(itemInt.offset - 0x6, "uint8", quantity);
  } else if ("id" in item && item.id?.match(/treasureCharts-/)) {
    const totalItem = getClosestItem("treasureChartsCleared", item) as ItemInt;

    let count = 0;

    count += getInt(totalItem.offset - 0x5d6, "uint32").toBitCount();
    count += getInt(totalItem.offset - 0x5d2, "uint32").toBitCount();

    setInt(totalItem.offset, "uint8", count);
  } else if ("id" in item && item.id === "swordTraining") {
    const itemInt = item as ItemInt;

    const rank = getInt(itemInt.offset, "uint8");

    setInt(itemInt.offset - 0xc1, "bit", rank === 4 ? 1 : 0, { bit: 5 });
  } else if ("id" in item && item.id === "hiddenFlags") {
    const itemBitflags = item as ItemBitflags;

    checkNextHiddenFlags(flag, itemBitflags, 2);
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

function getDayTime(offset: number, type: string): number {
  let time = getInt(offset, "float32", { bigEndian: true }) / 15;

  const hours = Math.floor(time);

  if (type === "hours") {
    return hours;
  }

  time = Math.round((time - hours) * 60);

  return time;
}
