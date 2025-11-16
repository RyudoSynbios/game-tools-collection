import { get } from "svelte/store";

import { dataView, fileHeaderShift, gameRegion } from "$lib/stores";
import { byteswap32, getInt, setInt } from "$lib/utils/bytes";
import { formatChecksum } from "$lib/utils/checksum";
import {
  customGetRegions,
  extractCastlevaniaCollectionSaves,
  getShifts,
  injectCastlevaniaCollectionSaves,
  isCastlevaniaCollectionSave,
  resetState,
} from "$lib/utils/common/castlevania";
import { getHeaderShift } from "$lib/utils/common/nintendoDs";
import { clone } from "$lib/utils/format";
import { getShift } from "$lib/utils/parser";

import type {
  Item,
  ItemBitflag,
  ItemBitflagChecked,
  ItemBitflags,
  ItemChecksum,
  ItemInt,
  ItemTabs,
} from "$lib/types";

const GAME = "por";

export function initHeaderShift(dataView: DataView): number {
  return getHeaderShift(dataView);
}

export function beforeInitDataView(dataView: DataView): DataView {
  if (isCastlevaniaCollectionSave(GAME, dataView)) {
    dataView = extractCastlevaniaCollectionSaves(GAME, dataView);
  }

  return dataView;
}

export function overrideGetRegions(
  dataView: DataView,
  shift: number,
): string[] {
  return customGetRegions(dataView, shift);
}

export function initShifts(shifts: number[]): number[] {
  return getShifts(shifts);
}

export function overrideParseItem(item: Item): Item {
  const $gameRegion = get(gameRegion);

  if (isCastlevaniaCollectionSave(GAME)) {
    if (item.type === "bitflags") {
      item.flags.forEach((flag) => {
        if (flag.offset > 0x3a49) {
          flag.offset += 0x3;
        }
      });
    } else if ("offset" in item) {
      if (item.offset > 0x3a49) {
        item.offset += 0x3;
      }
    }
  }

  if ("id" in item && item.id === "language") {
    const itemInt = item as ItemInt;

    itemInt.hidden = $gameRegion !== 0;

    return itemInt;
  }

  return item;
}

export function overrideItem(item: Item): Item {
  const $fileHeaderShift = get(fileHeaderShift);

  if ("id" in item && item.id === "slots") {
    const itemTabs = item as ItemTabs;

    itemTabs.items.map((item, index) => {
      if (index === 0 || index === 7) {
        return item;
      }

      let offset = $fileHeaderShift + 0x8 + (index - 1);

      if (isCastlevaniaCollectionSave(GAME)) {
        offset += getShift(getShifts());
      }

      const int = getInt(offset, "uint8");

      item.disabled = !Boolean(int);
    });

    return itemTabs;
  } else if ("id" in item && item.id?.match(/level-/)) {
    const itemInt = item as ItemInt;

    const maxLevel = getInt(itemInt.offset - 0x11, "uint8");

    itemInt.max = maxLevel;

    return itemInt;
  } else if ("id" in item && item.id === "skillPoints") {
    const itemInt = item as ItemInt;

    const isUnlocked = getInt(itemInt.offset + 0x1, "bit", { bit: 6 });

    itemInt.disabled = !isUnlocked;

    return itemInt;
  }

  return item;
}

export function overrideGetInt(
  item: Item,
): [boolean, ItemBitflagChecked[] | undefined] {
  if ("id" in item && item.id === "relics") {
    const itemBitflags = item as ItemBitflags;

    const flags = itemBitflags.flags.reduce(
      (flags: ItemBitflagChecked[], flag) => {
        flags.push({
          ...flag,
          checked:
            getInt(flag.offset, flag.bit === 0 ? "lower4" : "upper4") > 0,
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
  if ("id" in item && item.id === "relics") {
    setInt(flag.offset, flag.bit === 0 ? "lower4" : "upper4", value);

    return true;
  }

  return false;
}

export function afterSetInt(item: Item, flag: ItemBitflag): void {
  if ("id" in item && item.id === "unlockedModes") {
    const int = getInt(flag.offset, "bit", { bit: flag.bit });

    if ([1, 2, 3].includes(flag.bit) && int) {
      setInt(flag.offset, "bit", 1, { bit: 6 });
    } else if (flag.bit === 6 && !int) {
      setInt(flag.offset, "uint8", 0, {
        binary: { bitStart: 1, bitLength: 3 },
      });
    }
  } else if ("id" in item && item.id?.match(/difficulty-/)) {
    const itemInt = item as ItemInt;

    const [index] = item.id.splitInt();

    const difficulty = getInt(itemInt.offset, "uint8");

    let offset = itemInt.offset - index * 0x17d8 - 0x3f23;

    if (isCastlevaniaCollectionSave(GAME)) {
      offset -= 0x3;
    }

    setInt(offset, "uint8", difficulty);
  } else if ("id" in item && item.id?.match(/location-/)) {
    const itemInt = item as ItemInt;

    const [index] = item.id.splitInt();

    const location = getInt(itemInt.offset, "uint24", { bigEndian: true });

    const savePreview = location >> 0x8;

    let coordinates = [523000, 716800];

    switch (location) {
      case 0x109: // Entrance (Vincent Room)
        coordinates = [822200, 716800];
        break;
      case 0x704: // Tower of Death (near Death)
        coordinates = [528300, 651264];
        break;
      case 0x50015: // Nation of Fools (East)
        coordinates = [263000, 716800];
        break;
      case 0x50024: // Nation of Fools (West)
        coordinates = [822200, 716800];
        break;
      case 0x50208: // Nation of Fools (near Legion)
        coordinates = [528300, 651264];
        break;
      case 0x6000c: // Burnt Paradise (West)
        coordinates = [194500, 716800];
        break;
      case 0x6002e: // Burnt Paradise (East)
        coordinates = [854000, 716800];
        break;
    }

    setInt(itemInt.offset + 0x12, "uint32", coordinates[0]);
    setInt(itemInt.offset + 0x16, "uint32", coordinates[1]);
    setInt(itemInt.offset - index * 0x17d8 - 0x39f6, "uint16", savePreview, {
      bigEndian: true,
    });
  } else if ("id" in item && item.id?.match(/gold-/)) {
    const itemInt = item as ItemInt;

    const [index] = item.id.splitInt();

    const gold = getInt(itemInt.offset, "uint32");

    let offset = itemInt.offset - index * 0x17d8 - 0x3f7d;

    if (isCastlevaniaCollectionSave(GAME)) {
      offset -= 0x3;
    }

    setInt(offset, "uint32", gold);
  } else if ("id" in item && item.id === "rooms") {
    const int = getInt(flag.offset, "bit", { bit: flag.bit });

    setInt(flag.offset, "bit", int, { bit: flag.bit + 1 });
  } else if ("id" in item && item.id?.match(/level-/)) {
    const itemInt = item as ItemInt;

    const [index] = item.id.splitInt();

    const level = getInt(itemInt.offset, "uint8");

    const experience = getExperience(level);

    let offset = itemInt.offset - index * 0x17d8 - 0x3f2f;

    if (isCastlevaniaCollectionSave(GAME)) {
      offset -= 0x3;
    }

    setInt(itemInt.offset + 0x58, "uint32", experience);
    setInt(offset, "uint8", level);
  } else if ("id" in item && item.id?.match(/maxLevel-/)) {
    const itemInt = item as ItemInt;

    const [index] = item.id.splitInt();

    const previousLevel = getInt(itemInt.offset + 0x11, "uint8");
    const maxLevel = getInt(itemInt.offset, "uint8");

    const level = Math.min(previousLevel, maxLevel);

    let offset = itemInt.offset - index * 0x17d8 - 0x3f1e;

    if (isCastlevaniaCollectionSave(GAME)) {
      offset -= 0x3;
    }

    setInt(itemInt.offset + 0x11, "uint8", level);
    setInt(offset, "uint8", level);
    setInt(offset + 0x4, "uint8", maxLevel);

    if (level < previousLevel) {
      const experience = getExperience(level);

      setInt(itemInt.offset + 0x69, "uint32", experience);
    }
  } else if ("id" in item && item.id?.match(/experience-/)) {
    const itemInt = item as ItemInt;

    const [index] = item.id.splitInt();

    const maxLevel = getInt(itemInt.offset - 0x69, "uint8");
    const experience = getInt(itemInt.offset, "uint32");

    let level = maxLevel;

    for (let i = 2; i <= maxLevel; i += 1) {
      const nextExperience = getExperience(i);

      if (experience < nextExperience) {
        level = i - 1;
        break;
      }
    }

    let offset = itemInt.offset - index * 0x17d8 - 0x3f87;

    if (isCastlevaniaCollectionSave(GAME)) {
      offset -= 0x3;
    }

    setInt(itemInt.offset - 0x58, "uint32", level);
    setInt(offset, "uint8", level);
  } else if ("id" in item && item.id === "skillPoints") {
    const itemInt = item as ItemInt;

    const sp = getInt(itemInt.offset, "uint16", { binary: itemInt.binary });

    setInt(itemInt.offset + 0x1, "bit", sp === itemInt.max ? 1 : 0, { bit: 7 });
  }
}

let checksums: number[] = [];
let buffer = new Uint32Array(0x100);

// It seems to be a SHA-1 hash generator
export function generateChecksum(item: ItemChecksum): number {
  const [index] = item.id!.splitInt();

  if (isCastlevaniaCollectionSave(GAME)) {
    return 0x0;
  }

  if (index !== 0) {
    return formatChecksum(checksums[index], item.dataType);
  }

  checksums = [0x67452301, 0xefcdab89, 0x98badcfe, 0x10325476, 0xc3d2e1f0];
  buffer = new Uint32Array(0x10);

  let offset = item.control.offsetStart;
  let length = item.control.offsetEnd - item.control.offsetStart;

  buffer[0xf] = byteswap32(length * 0x8);

  const processedLength = length & 0xffffffc0;

  hash(offset, processedLength);

  offset += processedLength;
  length -= processedLength;

  const max = Math.floor(length / 0x4);

  for (let i = 0x0; i < max; i += 0x1) {
    buffer[i] = getInt(offset + i * 0x4, "uint32");
  }

  buffer[max] = 0x80 << ((length % 0x4) * 0x8);

  hash(0x0, 0x40, buffer);

  return formatChecksum(checksums[0], item.dataType);
}

export function beforeSaving(): ArrayBufferLike {
  const $dataView = get(dataView);

  if (isCastlevaniaCollectionSave(GAME)) {
    return injectCastlevaniaCollectionSaves(GAME);
  }

  return $dataView.buffer;
}

export function onReset(): void {
  resetState();
}

// prettier-ignore
function hash(
  offset: number,
  length: number,
  buffer: Uint32Array | undefined = undefined,
): void {
  const constants = [0x5a827999, 0x6ed9eba1, 0x8f1bbcdc, 0xca62c1d6];
  const mask = 0x00ff00ff;

  let tmp1 = 0x0;
  let tmp2 = 0x0;
  let tmp3 = 0x0;
  let tmp4 = 0x0;

  const array: number[] = [];

  const checksumTmp = clone(checksums);

  while (length !== 0x0 && length >= 0x40) {
    for (let i = 0x0; i < 0x10; i += 0x1) {
      tmp1 = checksumTmp[0];
      tmp3 = checksumTmp[3];
      checksumTmp[3] = checksumTmp[2];
      checksumTmp[2] = buffer ? buffer[Math.floor(offset / 0x4)] : getInt(offset, "uint32");
      checksumTmp[2] = (mask & ((checksumTmp[2] >>> 0x18) | (checksumTmp[2] << 0x8))) | ((checksumTmp[2] & mask) >>> 0x8) | ((checksumTmp[2] & mask) << 0x18);
      array[i] = checksumTmp[2];
      array[i + 0x10] = checksumTmp[2];
      checksumTmp[0] = constants[0] + checksumTmp[4] + ((tmp1 >>> 0x1b) | (tmp1 << 0x5)) + checksumTmp[2] + (((checksumTmp[3] ^ tmp3) & checksumTmp[1]) ^ tmp3);
      checksumTmp[2] = (checksumTmp[1] >>> 0x2) | (checksumTmp[1] << 0x1e);
      checksumTmp[1] = tmp1;
      checksumTmp[4] = tmp3;
      offset += 0x4;
    }

    for (let i = 0x0; i < 0x4; i += 0x1) {
      checksumTmp[4] = checksumTmp[3];
      checksumTmp[3] = checksumTmp[2];
      checksumTmp[1] = checksumTmp[0];
      checksumTmp[2] = array[i] ^ array[i + 0x2] ^ array[i + 0x8] ^ array[i + 0xd];
      checksumTmp[2] = (checksumTmp[2] >>> 0x1f) | (checksumTmp[2] << 0x1);
      array[i] = checksumTmp[2];
      array[i + 0x10] = checksumTmp[2];
      checksumTmp[0] = checksumTmp[2] + tmp3 + constants[0] + ((checksumTmp[1] >>> 0x1b) | (checksumTmp[1] << 0x5)) + (((checksumTmp[3] ^ checksumTmp[4]) & tmp1) ^ checksumTmp[4]);
      checksumTmp[2] = (tmp1 >>> 0x2) | (tmp1 << 0x1e);
      tmp1 = checksumTmp[1];
      tmp3 = checksumTmp[4];
    }

    for (let i = 0x4; i < 0x18; i += 0x1) {
      const iModulo = i % 0x10;

      tmp1 = checksumTmp[0];
      tmp3 = checksumTmp[3];
      checksumTmp[3] = checksumTmp[2];
      checksumTmp[2] = array[iModulo] ^ array[iModulo + 0x2] ^ array[iModulo + 0x8] ^ array[iModulo + 0xd];
      checksumTmp[2] = (checksumTmp[2] >>> 0x1f) | (checksumTmp[2] << 0x1);
      array[iModulo] = checksumTmp[2];
      array[iModulo + 0x10] = checksumTmp[2];
      checksumTmp[0] = checksumTmp[2] + checksumTmp[4] + constants[1] + ((tmp1 >>> 0x1b) | (tmp1 << 0x5)) + (checksumTmp[1] ^ checksumTmp[3] ^ tmp3);
      checksumTmp[2] = (checksumTmp[1] >>> 0x2) | (checksumTmp[1] << 0x1e);
      checksumTmp[1] = tmp1;
      checksumTmp[4] = tmp3;
    }

    for (let i = 0x8; i < 0x1c; i += 0x1) {
      const iModulo = i % 0x10;

      tmp2 = checksumTmp[0];
      tmp4 = checksumTmp[3];
      checksumTmp[3] = checksumTmp[2];
      checksumTmp[2] = array[iModulo] ^ array[iModulo + 0x2] ^ array[iModulo + 0x8] ^ array[iModulo + 0xd];
      checksumTmp[2] = (checksumTmp[2] >>> 0x1f) | (checksumTmp[2] << 0x1);
      array[iModulo] = checksumTmp[2];
      array[iModulo + 0x10] = checksumTmp[2];
      checksumTmp[0] = checksumTmp[2] + tmp3 + constants[2] + ((tmp2 >>> 0x1b) | (tmp2 << 0x5)) + (((tmp1 | checksumTmp[3]) & tmp4) | (tmp1 & checksumTmp[3]));
      checksumTmp[2] = (tmp1 >>> 0x2) | (tmp1 << 0x1e);
      tmp1 = tmp2;
      tmp3 = tmp4;
    }

    for (let i = 0xc; i < 0x20; i += 0x1) {
      checksumTmp[4] = checksumTmp[3];
      checksumTmp[3] = checksumTmp[2];
      checksumTmp[1] = checksumTmp[0];
      checksumTmp[2] = array[i] ^ array[i + 0x2] ^ array[i + 0x8] ^ array[i + 0xd];
      checksumTmp[2] = (checksumTmp[2] >>> 0x1f) | (checksumTmp[2] << 0x1);
      array[i] = checksumTmp[2];
      array[i + 0x10] = checksumTmp[2];
      checksumTmp[0] = checksumTmp[2] + tmp4 + constants[3] + ((checksumTmp[1] >>> 0x1b) | (checksumTmp[1] << 0x5)) + (tmp2 ^ checksumTmp[3] ^ checksumTmp[4]);
      checksumTmp[2] = (tmp2 >>> 0x2) | (tmp2 << 0x1e);
      tmp2 = checksumTmp[1];
      tmp4 = checksumTmp[4];
    }

    for (let i = 0x0; i < 0x5; i += 0x1) {
      checksumTmp[i] = checksums[i] += checksumTmp[i];
    }

    length -= 0x40;
  }
}

function getExperience(level: number): number {
  let experience = 0;

  if (level > 1 && level < 50) {
    experience = level * (level + 1) * (level * 3 + 2);
  } else if (level >= 50) {
    experience = level * (level + 1) * (level * 6 - 145);
  }

  return experience;
}
