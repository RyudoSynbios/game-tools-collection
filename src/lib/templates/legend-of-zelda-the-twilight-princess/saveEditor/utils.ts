import Long from "long";
import { get } from "svelte/store";

import { gamePlatform, gameRegion } from "$lib/stores";
import { bitToOffset, getInt, setInt } from "$lib/utils/bytes";
import { getTime, setTime } from "$lib/utils/common/gamecube";
import { capitalize, getPartialValue, makeOperations } from "$lib/utils/format";
import { getClosestItem } from "$lib/utils/parser";

import type {
  Item,
  ItemBitflag,
  ItemBitflags,
  ItemChecksum,
  ItemInt,
  ItemSection,
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
  const $gameRegion = get(gameRegion);

  if ("id" in item && item.id === "name" && $gameRegion === 2) {
    const itemString = item as ItemString;

    itemString.length = 0x10;
    itemString.encoding = "windows31J";
    itemString.regex =
      "[ ,.0-9A-Za-z\u30fc\u30a1-\u30f3\u3041-\u308d\u308f\u3092\u3093]";

    return itemString;
  } else if ("id" in item && item.id?.match(/dungeon-/)) {
    const itemBitflags = item as ItemBitflags;

    const [, type] = item.id.split("-");
    const [index] = item.id.splitInt();

    if (type === "events") {
      switch (index) {
        case 0: // Forest Temple
          itemBitflags.flags[0].hidden = false;
          itemBitflags.flags[1].hidden = false;
          break;
        case 1: // Goron Mines
          itemBitflags.flags[3].hidden = false;
          itemBitflags.flags[4].hidden = false;
          break;
        case 2: // Lakebed Temple
          itemBitflags.flags[6].hidden = false;
          itemBitflags.flags[7].hidden = false;
          break;
        case 3: // Arbiter's Grounds
          itemBitflags.flags[9].hidden = false;
          itemBitflags.flags[10].hidden = false;
          break;
        case 4: // Snowpeak Ruins
          itemBitflags.flags[12].hidden = false;
          break;
        case 5: // Temple of Time
          itemBitflags.flags[14].hidden = false;
          itemBitflags.flags[15].hidden = false;
          break;
        case 6: // City in the Sky
          itemBitflags.flags[17].hidden = false;
          itemBitflags.flags[19].hidden = false;
          break;
        case 7: // Place of Twilight
          itemBitflags.flags[21].hidden = false;
          itemBitflags.flags[22].hidden = false;
          break;
        case 8: // Hyrule Castle
          itemBitflags.flags[24].hidden = false;
          break;
      }
    }

    if (type === "items" && index === 8) {
      itemBitflags.flags[3].hidden = true;
    }

    return itemBitflags;
  } else if ("id" in item && item.id === "fishSize" && $gameRegion !== 0) {
    const itemInt = item as ItemInt;

    itemInt.operations = undefined;

    return itemInt;
  }

  return item;
}

export function overrideItem(item: Item): Item {
  if ("id" in item && item.id === "valueRupees") {
    const itemInt = item as ItemInt;

    const { shift, valuesMax } = itemQuantites.rupees;

    const upgrade = getInt(itemInt.offset + shift!, "uint8");

    itemInt.max = valuesMax[upgrade];
  } else if ("id" in item && item.id === "tunics") {
    const itemBitflags = item as ItemBitflags;

    const offset = itemBitflags.flags[0].offset;

    const tunic = getInt(offset - 0xbf, "uint8");

    itemBitflags.flags.forEach((flag) => {
      flag.disabled = tunic === 0x2e;
    });

    return itemBitflags;
  } else if ("id" in item && item.id?.match(/valueBombs-/)) {
    const itemInt = item as ItemInt;

    const [index] = item.id.splitInt();

    const type = getBombs(itemInt.offset - (0x42 + index))[index];

    const upgradeItem = getClosestItem(/maxBombs-/, item) as ItemInt;

    const upgrade = getInt(upgradeItem.offset, "bit", { bit: 7 });

    if (!type) {
      itemInt.max = 0;
    } else {
      itemInt.max = itemQuantites[type].valuesMax[upgrade];
    }
  } else if ("id" in item && item.id?.match(/maxBombs-/)) {
    const itemInt = item as ItemInt;

    const [index] = item.id.splitInt();

    const type = getBombs(itemInt.offset - 0x2b)[index];

    itemInt.disabled = !type;
    itemInt.resource = type ? `max${capitalize(type)}` : "";
  }

  return item;
}

export function overrideGetInt(item: Item): [boolean, number | undefined] {
  if ("id" in item && item.id === "playtime") {
    const itemInt = item as ItemInt;

    const playtime = getTime(itemInt.offset);

    const int = makeOperations(playtime, itemInt.operations);

    return [true, int];
  } else if ("id" in item && item.id?.match(/daytime-/)) {
    const itemInt = item as ItemInt;

    const [, type] = item.id.split("-");

    const time = getDayTime(itemInt.offset, type);

    return [true, time];
  } else if ("id" in item && item.id === "heartPieces") {
    const itemInt = item as ItemInt;

    const health = getInt(itemInt.offset, "uint16", { bigEndian: true });

    return [true, health % 5];
  } else if ("id" in item && item.id === "dominionRod") {
    const itemInt = item as ItemInt;

    let itemIndex = getInt(itemInt.offset, "uint8");

    if (itemIndex !== 0xff) {
      itemIndex |= getInt(itemInt.offset + 0x771, "bit", { bit: 7 }) << 0x8;
    }

    return [true, itemIndex];
  } else if ("id" in item && item.id?.match(/maxBombs-/)) {
    const itemInt = item as ItemInt;

    if (itemInt.disabled) {
      return [true, 0x0];
    }
  } else if ("id" in item && item.id === "caveOfOrdeals") {
    const itemInt = item as ItemInt;

    let floor = 0;

    floor += getInt(itemInt.offset, "uint32").toBitCount();
    floor += getInt(itemInt.offset + 0x4, "uint32").toBitCount();

    return [true, floor];
  }

  return [false, undefined];
}

export function overrideSetInt(item: Item, value: string): boolean {
  const $gameRegion = get(gameRegion);

  if ("id" in item && item.id === "playtime") {
    const itemInt = item as ItemInt;

    const oldInt = getTime(itemInt.offset);

    let int = makeOperations(parseInt(value), itemInt.operations, true);
    int = getPartialValue(oldInt, int, itemInt.operations!);

    setTime(itemInt.offset, int);

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
  } else if ("id" in item && item.id === "maxHealth") {
    const itemInt = item as ItemInt;

    let maxHealth = parseInt(value) * 5;

    const healthPieces =
      getInt(itemInt.offset, "uint16", { bigEndian: true }) % 5;

    maxHealth += healthPieces;

    setInt(itemInt.offset, "uint16", maxHealth, { bigEndian: true });

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
  } else if ("id" in item && item.id === "dominionRod") {
    const itemInt = item as ItemInt;

    const itemIndex = parseInt(value);

    setInt(itemInt.offset, "uint8", itemIndex & 0xff);
    setInt(itemInt.offset + 0x771, "bit", itemIndex >> 0x8, { bit: 7 });

    return true;
  } else if ("id" in item && item.id === "fishSize" && $gameRegion === 0) {
    const itemInt = item as ItemInt;

    let size = parseInt(value);

    size = makeOperations(size, [itemInt.operations![0]], true);

    setInt(itemInt.offset, "uint8", Math.ceil(size));

    return true;
  } else if ("id" in item && item.id === "caveOfOrdeals") {
    const itemInt = item as ItemInt;

    let floor = parseInt(value);

    let offset = itemInt.offset + 0x3;

    for (let i = 0; i < 32; i += 1) {
      setInt(offset - bitToOffset(i), "bit", i < floor ? 1 : 0, { bit: i % 8 });
    }

    offset = itemInt.offset + 0x7;
    floor -= 32;

    for (let i = 0; i < 18; i += 1) {
      setInt(offset - bitToOffset(i), "bit", i < floor ? 1 : 0, { bit: i % 8 });
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

    let value = getInt(itemInt.offset - shift!, "uint16", {
      bigEndian: true,
    });

    const upgrade = getInt(itemInt.offset, "uint8");

    value = Math.min(value, valuesMax[upgrade]);

    setInt(itemInt.offset - shift!, "uint16", value, {
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
  } else if ("id" in item && item.id === "fishingRod") {
    const itemInt = item as ItemInt;

    const fishingRod = getInt(itemInt.offset, "uint8");

    if ([0x5c, 0x5e, 0x5f].includes(fishingRod)) {
      setInt(itemInt.offset + 0x20, "bit", 1, { bit: 5 });
    } else {
      setInt(itemInt.offset + 0x20, "bit", 0, { bit: 5 });
    }
  } else if ("id" in item && item.id === "maxArrows") {
    const itemInt = item as ItemInt;

    let arrows = getInt(itemInt.offset - 0xc, "uint8");
    const maxArrows = getInt(itemInt.offset, "uint8");

    arrows = Math.min(arrows, maxArrows);

    setInt(itemInt.offset - 0xc, "uint8", arrows);
  } else if ("id" in item && item.id?.match(/bombs-/)) {
    const itemInt = item as ItemInt;

    const [index] = item.id.splitInt();

    const offset = itemInt.offset - index;

    const type = getBombs(offset)[index];

    const upgrade = getInt(offset + 0x2b, "bit", { bit: 7 });

    let value = getInt(itemInt.offset + 0x42, "uint8");

    if (!type) {
      value = 0;
    } else {
      value = Math.min(value, itemQuantites[type].valuesMax[upgrade]);
    }

    setInt(itemInt.offset + 0x42, "uint8", value);
  } else if ("id" in item && item.id?.match(/maxBombs/)) {
    const itemInt = item as ItemInt;

    const types = getBombs(itemInt.offset - 0x2b);

    for (let i = 0x0; i < 0x3; i += 0x1) {
      const type = types[i];

      const upgrade = getInt(itemInt.offset, "bit", { bit: 7 });

      let value = getInt(itemInt.offset + 0x17 + i, "uint8");

      if (!type) {
        value = 0;
      } else {
        value = Math.min(value, itemQuantites[type].valuesMax[upgrade]);
      }

      setInt(itemInt.offset + 0x17 + i, "uint8", value);
    }
  } else if ("id" in item && item.id?.match(/dungeon-events|hiddenFlags/)) {
    const itemBitflags = item as ItemBitflags;

    const checked = getInt(flag.offset, "bit", { bit: flag.bit });

    const index = itemBitflags.flags.findIndex(
      (item) => item.offset === flag.offset && item.bit === flag.bit,
    );

    const hiddenFlag = itemBitflags.flags[index + 1];

    if (hiddenFlag.hidden) {
      setInt(hiddenFlag.offset, "bit", checked, { bit: hiddenFlag.bit });
    }
  } else if ("id" in item && item.id === "skyCharacters") {
    const itemBitflags = item as ItemBitflags;

    const offset = itemBitflags.flags[0].offset;

    let count = 0;

    count += (getInt(offset, "uint8") & 0xf8).toBitCount();
    count += getInt(offset + 0x2, "bit", { bit: 2 });

    setInt(offset, "bit", count === 6 ? 1 : 0, { bit: 2 });

    // We update the corresponding Map flag

    const checked = getInt(flag.offset, "bit", { bit: flag.bit });

    const index = itemBitflags.flags.findIndex(
      (item) => item.offset === flag.offset && item.bit === flag.bit,
    );

    const hiddenFlag = itemBitflags.flags[index + 1];

    if (hiddenFlag.hidden) {
      setInt(hiddenFlag.offset, "bit", checked, { bit: hiddenFlag.bit });
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
  } else if ("id" in item && item.id === "poeSouls") {
    const itemSection = getClosestItem("poeSoulsSection", item) as ItemSection;

    let count = 0;

    itemSection.items.forEach((item) => {
      const itemBitflags = item as ItemBitflags;

      itemBitflags.flags.forEach((flag) => {
        count += getInt(flag.offset, "bit", { bit: flag.bit });
      });
    });

    console.log(count);

    const totalItem = getClosestItem("poeSoulsTotal", item) as ItemInt;

    setInt(totalItem.offset, "uint8", count);
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

function getBombs(offset: number): (string | null)[] {
  const bombs = [];

  for (let i = 0x0; i < 0x3; i += 0x1) {
    const type = getInt(offset + i, "uint8");

    switch (type) {
      case 0x70:
        bombs.push("bombs");
        break;
      case 0x71:
        bombs.push("waterBombs");
        break;
      case 0x72:
        bombs.push("bomblings");
        break;
      default:
        bombs.push(null);
    }
  }

  return bombs;
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
