import { get } from "svelte/store";

import { dataViewAlt, gamePlatform, gameRegion } from "$lib/stores";
import {
  checkNextHiddenFlags,
  getBoolean,
  getInt,
  setBoolean,
  setInt,
} from "$lib/utils/bytes";
import { formatChecksum } from "$lib/utils/checksum";
import {
  extractN64SaveFromGCI,
  injectN64SaveToGCI,
} from "$lib/utils/common/gamecube/zelda";
import { byteswapDataView, getHeaderShift } from "$lib/utils/common/nintendo64";
import { SRA_SIZE } from "$lib/utils/common/nintendo64/srm";
import { round } from "$lib/utils/format";
import { getItem } from "$lib/utils/parser";
import { getPlatformRegions, getRegions } from "$lib/utils/validator";

import {
  Item,
  ItemBitflag,
  ItemBitflagChecked,
  ItemBitflags,
  ItemChecksum,
  ItemInt,
  ItemString,
  RegionValidator,
} from "$lib/types";

import { itemQuantites } from "./utils/resource";

const SAVE_FORMAT = "sra";

const poePointsSave = [0, 0, 0];

export function setGamePlatform(dataView: DataView): void {
  const gamecubeRegions = getPlatformRegions("gamecube") as {
    [key: string]: RegionValidator;
  };

  const isGamecube = getRegions(dataView, 0x0, gamecubeRegions).length > 0;

  if (isGamecube) {
    gamePlatform.set(1);
  } else {
    gamePlatform.set(0);
  }
}

export function initHeaderShift(dataView: DataView): number {
  return getHeaderShift(dataView, SAVE_FORMAT);
}

export function beforeInitDataView(
  dataView: DataView,
  shift: number,
): DataView {
  const $gamePlatform = get(gamePlatform);

  if ($gamePlatform === 1) {
    return extractN64SaveFromGCI(dataView, SRA_SIZE);
  }

  return byteswapDataView(SAVE_FORMAT, dataView, shift);
}

export function overrideGetRegions(
  dataView: DataView,
  shift: number,
): string[] {
  const $dataViewAlt = get(dataViewAlt);
  const $gamePlatform = get(gamePlatform);

  if ($gamePlatform === 1) {
    return getRegions($dataViewAlt.gci);
  }

  return getRegions(dataView, shift);
}

export function beforeItemsParsing(): void {
  const $gameRegion = get(gameRegion);
  const $gamePlatform = get(gamePlatform);

  if ($gamePlatform === 1 && $gameRegion === 3) {
    gameRegion.set(0);
  } else if ($gamePlatform === 1 && $gameRegion === 4) {
    gameRegion.set(1);
  }
}

export function overrideParseItem(item: Item): Item {
  const $gameRegion = get(gameRegion);

  if ("id" in item && item.id === "name" && $gameRegion !== 0) {
    const itemString = item as ItemString;

    if (itemString.fallback) {
      itemString.fallback = 0xdf;
    }

    return itemString;
  }

  return item;
}

export function onReady(): void {
  const itemPoints = getItem("poeCollectorPoints-0") as ItemInt;

  for (let i = 0x0; i < 0x3; i += 0x1) {
    poePointsSave[i] = getInt(itemPoints.offset + i * 0x1450, "uint16", {
      bigEndian: true,
    });

    // There's no need to save a complete points card
    if (poePointsSave[i] === 1000) {
      poePointsSave[i] = 0;
    }
  }
}

export function overrideItem(item: Item): Item {
  const $gameRegion = get(gameRegion);

  if ("id" in item && item.id?.match(/value-/)) {
    const itemInt = item as ItemInt;

    const [, type] = item.id.split("-");

    const { shift, bitStart, valuesMax } = itemQuantites[type];

    const upgrade = getInt(itemInt.offset + shift, "uint8", {
      binary: { bitStart, bitLength: 2 },
    });

    itemInt.max = valuesMax[upgrade];
  } else if ("id" in item && item.id === "magic") {
    const itemInt = item as ItemInt;

    const magicLevel = getInt(itemInt.offset - 0x1, "uint8");

    let max = 0;

    if (magicLevel === 0x1) {
      max = 48;
    } else if (magicLevel === 0x2) {
      max = 96;
    }

    itemInt.max = max;

    return itemInt;
  } else if ("id" in item && item.id === "sword") {
    const itemInt = item as ItemInt;

    const offset = itemInt.offset - 0x3b;

    let resource = "swordsGK";

    if (isSwordBroken(offset)) {
      resource = "swordsGKB";
    } else if (isBiggoronsSword(offset + 0x8)) {
      resource = "swordsBS";
    }

    itemInt.resource = resource;
  } else if ("id" in item && item.id === "obtainedSwords") {
    const itemBitflags = item as ItemBitflags;

    const offset = itemBitflags.flags[0].offset - 0x67;

    const swordBroken = isSwordBroken(offset);
    const biggoronsSword = isBiggoronsSword(offset + 0x8);

    const flags = itemBitflags.flags.reduce((flags: ItemBitflag[], flag) => {
      let hidden = flag.hidden;

      if ([2, 3].includes(flag.bit)) {
        hidden = true;

        if (
          (biggoronsSword && flag.label === "Biggoron's Sword") ||
          (!biggoronsSword &&
            ((swordBroken && flag.label === "Giant's Knife (Broken)") ||
              (!swordBroken && flag.label === "Giant's Knife")))
        ) {
          hidden = false;
        }
      }

      flags.push({
        ...flag,
        hidden,
      });

      return flags;
    }, []);

    itemBitflags.flags = flags;
  } else if ("id" in item && item.id === "giantsKnifeHealth") {
    const itemInt = item as ItemInt;

    const swordType = getInt(itemInt.offset + 0x8, "uint8");

    itemInt.disabled = swordType === 0x1;
  } else if ("id" in item && item.id === "language") {
    const itemInt = item as ItemInt;

    itemInt.hidden = $gameRegion !== 0;

    return itemInt;
  }

  return item;
}

export function overrideGetInt(
  item: Item,
): [boolean, number | ItemBitflagChecked[] | undefined] {
  if ("id" in item && item.id === "location") {
    const itemInt = item as ItemInt;

    const age = getInt(itemInt.offset - 0x62, "uint32", { bigEndian: true });

    let location = getInt(itemInt.offset, "uint16", { bigEndian: true });

    if (location > 0xd && location !== 0x34) {
      switch (location) {
        case 0x11:
          location = 0x0; // Inside the Deku Tree
          break;
        case 0x12:
          location = 0x1; // Dodongo's Cavern
          break;
        case 0x13:
          location = 0x2; // Inside Jabu-Jabu's Belly
          break;
        case 0x14:
          location = 0x3; // Forest Temple
          break;
        case 0x15:
          location = 0x4; // Fire Temple
          break;
        case 0x16:
          location = 0x5; // Water Temple
          break;
        case 0x17:
          location = 0x6; // Spirit Temple
          break;
        case 0x18:
          location = 0x7; // Shadow Temple
          break;
        case 0xe:
        case 0xf:
        case 0x19:
        case 0x1a:
        case 0x4f:
          location = 0xa; // Ganon's Tower
          break;
        default:
          if (age === 0) {
            location = 0x43; // Temple of Time
          } else {
            location = 0x34; // Link's House
          }
      }
    }

    return [true, location];
  } else if ("id" in item && item.id === "fishWeight") {
    const itemInt = item as ItemInt;

    const int = getInt(itemInt.offset, "uint8", { binary: itemInt.binary });

    let weight = 0;

    if (int > 0) {
      weight = round(int ** 2 * 0.0036 + 0.5, 0);
    }

    return [true, weight];
  } else if ("id" in item && item.id?.match(/bottles-/)) {
    const itemBitflags = item as ItemBitflags;

    const flags = itemBitflags.flags.reduce(
      (flags: ItemBitflagChecked[], flag) => {
        let checked = false;

        if (flag.bit === 0) {
          checked = getInt(flag.offset, "uint16", { bigEndian: true }) === 1000;
        } else {
          checked = Boolean(getInt(flag.offset, "bit", { bit: flag.bit }));
        }

        flags.push({
          ...flag,
          checked,
        });

        return flags;
      },
      [],
    );

    return [true, flags];
  }

  return [false, undefined];
}

export function overrideSetInt(
  item: Item,
  value: string,
  flag: ItemBitflag,
): boolean {
  if ("id" in item && item.id === "fishWeight") {
    const itemInt = item as ItemInt;

    const int = parseInt(value);

    const weight = Math.sqrt((int - 0.5) * 277.7777777778) || 0;

    setInt(itemInt.offset, "uint8", weight, { binary: itemInt.binary });

    return true;
  } else if ("id" in item && item.id?.match(/bottles-/)) {
    const [index] = item.id.splitInt();

    if (flag.bit === 0) {
      setInt(flag.offset, "uint16", value ? 1000 : poePointsSave[index], {
        bigEndian: true,
      });

      return true;
    }
  }

  return false;
}

export function afterSetInt(item: Item, flag: ItemBitflag): void {
  if ("id" in item && item.id?.match(/max-/)) {
    const itemInt = item as ItemInt;

    const [, type] = item.id.split("-");

    const { shift, dataType, valuesMax } = itemQuantites[type];

    let value = getInt(itemInt.offset - shift, dataType, {
      bigEndian: dataType === "uint16",
    });

    const upgrade = getInt(itemInt.offset, "uint8", {
      binary: itemInt.binary,
    });

    value = Math.min(value, valuesMax[upgrade]);

    setInt(itemInt.offset - shift, dataType, value, {
      bigEndian: dataType === "uint16",
    });
  } else if ("id" in item && item.id === "maxHealth") {
    const itemInt = item as ItemInt;

    const maxHealth = getInt(itemInt.offset, "uint16", { bigEndian: true });
    const hasDoubleDefense = getBoolean(itemInt.offset + 0xf);

    let int = 0;

    if (hasDoubleDefense) {
      int = maxHealth / 16;
    }

    setInt(itemInt.offset + 0xa1, "uint8", int);
  } else if ("id" in item && item.id === "magicLevel") {
    const itemInt = item as ItemInt;

    const int = getInt(itemInt.offset, "uint8");

    const magic = getInt(itemInt.offset + 0x1, "uint8");

    if (int === 0x1) {
      setBoolean(itemInt.offset + 0xa, false);
      setBoolean(itemInt.offset + 0x8, true);
      setInt(itemInt.offset + 0x1, "uint8", Math.min(48, magic));
    } else if (int === 0x2) {
      setBoolean(itemInt.offset + 0xa, true);
      setBoolean(itemInt.offset + 0x8, true);
      setInt(itemInt.offset + 0x1, "uint8", Math.min(96, magic));
    } else {
      setBoolean(itemInt.offset + 0xa, false);
      setBoolean(itemInt.offset + 0x8, false);
      setInt(itemInt.offset + 0x1, "uint8", Math.min(0, magic));
    }
  } else if ("id" in item && item.id === "doubleDefense") {
    const itemInt = item as ItemInt;

    let int = 0;

    const hasDoubleDefense = getBoolean(itemInt.offset);
    const maxHealth = getInt(itemInt.offset - 0xf, "uint16", {
      bigEndian: true,
    });

    if (hasDoubleDefense) {
      int = maxHealth / 16;
    }

    setInt(itemInt.offset + 0x92, "uint8", int);
  } else if ("id" in item && item.id === "sword") {
    const itemInt = item as ItemInt;

    const int = getInt(itemInt.offset, "lower4");

    let equippedSword = 0xff;

    switch (int) {
      case 0x0:
        equippedSword = 0xff;
        break;
      case 0x1:
        equippedSword = 0x3b;
        break;
      case 0x2:
        equippedSword = 0x3c;
        break;
      default:
        equippedSword = 0x3d;
    }

    setInt(itemInt.offset - 0x9, "uint8", equippedSword);
  } else if ("id" in item && item.id === "goronSword") {
    const itemInt = item as ItemInt;

    const int = getInt(itemInt.offset, "uint8");

    if (int === 0x1) {
      setInt(itemInt.offset - 0x8, "uint16", 8, { bigEndian: true });
    }

    updateObtainedSwords(itemInt.offset + 0x5f);
  } else if ("id" in item && item.id === "giantsKnifeHealth") {
    const itemInt = item as ItemInt;

    updateObtainedSwords(itemInt.offset + 0x67);
  } else if ("id" in item && item.id === "hiddenFlags") {
    const itemBitflags = item as ItemBitflags;

    checkNextHiddenFlags(flag, itemBitflags);
  } else if ("id" in item && item.id?.match(/poeCollectorPoints-/)) {
    const itemInt = item as ItemInt;

    const [index] = item.id.splitInt();

    poePointsSave[index] = getInt(itemInt.offset, "uint16", {
      bigEndian: true,
    });
  } else if ("id" in item && item.id === "goldSkulltulas") {
    const itemBitflags = item as ItemBitflags;

    const offset = itemBitflags.flags[0].offset;

    let count = 0;

    for (let i = 0x0; i < 0x6; i += 0x1) {
      count += getInt(offset + 0xdf7 + i * 0x4, "uint32", {
        bigEndian: true,
      }).toBitCount();
    }

    setInt(offset, "bit", count > 0 ? 1 : 0, { bit: 7 });
    setInt(offset + 0x2b, "uint16", count, { bigEndian: true });
  }
}

export function generateChecksum(item: ItemChecksum): number {
  let checksum = 0x0;

  for (let i = item.control.offsetStart; i < item.control.offsetEnd; i += 0x2) {
    checksum += getInt(i, "uint16", { bigEndian: true });
  }

  return formatChecksum(checksum, item.dataType);
}

export function beforeSaving(): ArrayBufferLike {
  const $gamePlatform = get(gamePlatform);

  if ($gamePlatform === 1) {
    return injectN64SaveToGCI(SRA_SIZE);
  }

  return byteswapDataView(SAVE_FORMAT).buffer;
}

function isBiggoronsSword(offset: number): boolean {
  return getInt(offset, "uint8") === 1;
}

function isSwordBroken(offset: number): boolean {
  return getInt(offset, "uint16", { bigEndian: true }) === 0;
}

function updateObtainedSwords(offset: number): void {
  const hasSword =
    getInt(offset, "uint8", { binary: { bitStart: 2, bitLength: 2 } }) > 0;

  if (hasSword) {
    if (isSwordBroken(offset - 0x67)) {
      setInt(offset, "bit", 0, { bit: 2 });
      setInt(offset, "bit", 1, { bit: 3 });
    } else {
      setInt(offset, "bit", 1, { bit: 2 });
      setInt(offset, "bit", 0, { bit: 3 });
    }
  }
}
