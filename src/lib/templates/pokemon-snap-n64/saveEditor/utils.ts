import { get } from "svelte/store";

import { gameRegion } from "$lib/stores";
import { byteswap32, getInt, setInt } from "$lib/utils/bytes";
import { formatChecksum } from "$lib/utils/checksum";
import { byteswapDataView, getHeaderShift } from "$lib/utils/common/nintendo64";
import { clone } from "$lib/utils/format";

import {
  Item,
  ItemBitflag,
  ItemBitflagChecked,
  ItemBitflags,
  ItemChecksum,
  ItemContainer,
  ItemInt,
  ItemString,
} from "$lib/types";

import {
  photoPokemons,
  photoSigns,
  photoSignsExtended,
} from "./utils/resource";

export function initHeaderShift(dataView: DataView): number {
  return getHeaderShift(dataView, "fla");
}

export function beforeInitDataView(dataView: DataView): DataView {
  return byteswapDataView("fla", dataView);
}

export function initShifts(shifts: number[]): number[] {
  const $gameRegion = get(gameRegion);

  if ($gameRegion === 2) {
    return [...shifts, -0x4];
  }

  return shifts;
}

export function overrideParseItem(item: Item): Item {
  const $gameRegion = get(gameRegion);

  if ("id" in item && item.id?.match(/checksum-/) && $gameRegion === 2) {
    const itemChecksum = item as ItemChecksum;

    itemChecksum.offset += 0x4;
    itemChecksum.control.offsetStart += 0x4;
    itemChecksum.control.offsetEnd -= 0x784;

    return itemChecksum;
  } else if ("id" in item && item.id === "japan-unshift" && $gameRegion === 2) {
    const itemInt = item as ItemInt;

    itemInt.offset += 0x4;

    return itemInt;
  } else if ("id" in item && item.id === "name" && $gameRegion !== 0) {
    const itemString = item as ItemString;

    if ($gameRegion === 1) {
      itemString.length = 0xe;
    } else if ($gameRegion === 2) {
      itemString.offset += 0x4;
      itemString.length = 0xa;
    }

    itemString.letterDataType = "uint16";
    itemString.letterBigEndian = true;

    return itemString;
  } else if ("id" in item && item.id === "album" && $gameRegion === 2) {
    const itemContainer = item as ItemContainer;

    itemContainer.length = 0x3c0;

    return itemContainer;
  } else if ("id" in item && item.id === "comment" && $gameRegion === 2) {
    const itemString = item as ItemString;

    itemString.length = 0x1c;

    return itemString;
  }

  return item;
}

export function overrideGetInt(
  item: Item,
): [boolean, number | ItemBitflagChecked[] | undefined] {
  if ("id" in item && item.id === "unlockedCourses") {
    const itemBitflags = item as ItemBitflags;

    const offset = itemBitflags.flags[0].offset;

    const int = getInt(offset, "uint8", {
      binary: { bitStart: 5, bitLength: 3 },
    });

    const flags = itemBitflags.flags.reduce(
      (flags: ItemBitflagChecked[], flag, index) => {
        flags.push({
          ...flag,
          checked: int >= index,
        });

        return flags;
      },
      [],
    );

    return [true, flags];
  } else if ("id" in item && item.id?.match(/photoStatus-/)) {
    const itemInt = item as ItemInt;

    const int = getInt(itemInt.offset, "int32", { bigEndian: true });

    const status = int === -1 ? 0 : 1;

    return [true, status];
  }

  return [false, undefined];
}

export function overrideSetInt(
  item: Item,
  value: string,
  flag: ItemBitflag,
): boolean {
  const $gameRegion = get(gameRegion);

  if ("id" in item && item.id === "unlockedCourses") {
    const itemBitflags = item as ItemBitflags;

    let int = itemBitflags.flags.findIndex((f) => f.label === flag.label);

    if (!value) {
      int -= 1;
    }

    setInt(flag.offset, "uint8", int, {
      binary: { bitStart: 5, bitLength: 3 },
    });

    const offset = flag.offset - ($gameRegion === 2 ? 0x10 : 0x14);

    setInt(offset, "uint32", int, { bigEndian: true });

    return true;
  } else if ("id" in item && item.id?.match(/photoStatus-/)) {
    const itemInt = item as ItemInt;

    const [, type] = item.id?.split("-");
    const [index] = item.id?.splitInt();

    const int = parseInt(value);

    if (int === 0x1 && ["pokemon", "sign"].includes(type)) {
      setPhoto(itemInt.offset - 0x4, type, index);
    }

    setInt(itemInt.offset, "uint32", int === 0x0 ? -1 : 0, { bigEndian: true });

    return true;
  }

  return false;
}

let checksums: number[] = [];
let buffer = new Uint32Array(0x10);

// It seems to be a SHA-1 hash generator
export function generateChecksum(item: ItemChecksum): number {
  const [index] = item.id!.splitInt();

  if (index !== 0) {
    return formatChecksum(checksums[index], item.dataType);
  }

  checksums = [0x67452301, 0xefcdab89, 0x98badcfe, 0x10325476];
  buffer = new Uint32Array(0x10);

  let offset = item.control.offsetStart;
  let length = item.control.offsetEnd - item.control.offsetStart;

  buffer[0xe] = byteswap32(length * 0x8);

  while (offset + 0x40 <= item.control.offsetEnd) {
    hash(offset);

    offset += 0x40;
    length -= 0x40;
  }

  const count = Math.floor(length / 0x4);

  for (let i = 0x0; i < count; i += 0x1) {
    buffer[i] = getInt(offset + i * 0x4, "uint32", { bigEndian: true });
  }

  buffer[count] = 0x80 << ((3 - (length % 0x4)) * 0x8);

  hash(0x0, buffer);

  return formatChecksum(checksums[0], item.dataType);
}

export function beforeSaving(): ArrayBufferLike {
  return byteswapDataView("fla").buffer;
}

// prettier-ignore
function setPhoto(offset: number, type: string, index: number): void {
  for (let i = 0x0; i < 0x3a0; i += 0x4) {
    setInt(offset + i, "uint32", 0x0, { bigEndian: true });
  }

  if (type === "pokemon") {
    const pokemon = photoPokemons[index];

    let unknown1 = 0x3;

    switch (pokemon.course) {
      case 0x0:
        unknown1 = 0x8;
        break;
      case 0x2:
        unknown1 = 0x1;
        break;
      case 0xa:
        unknown1 = 0x7;
        break;
    }

    setInt(offset + 0x0, "uint8", pokemon.course);
    setInt(offset + 0x1, "uint8", unknown1);
    setInt(offset + 0xc, "float32", 200, { bigEndian: true });
    setInt(offset + 0x1c, "float32", 1000, { bigEndian: true });
    setInt(offset + 0x20, "uint32", pokemon.actor, { bigEndian: true });
    setInt(offset + 0x28, "float32", pokemon.coordinates[0], { bigEndian: true });
    setInt(offset + 0x2c, "float32", pokemon.coordinates[1], { bigEndian: true });
    setInt(offset + 0x30, "float32", pokemon.coordinates[2], { bigEndian: true });
    setInt(offset + 0x34, "float32", 3.14, { bigEndian: true });
  } else if (type === "sign") {
    const sign = photoSigns[index];

    setInt(offset + 0x0, "uint8", sign.course);
    setInt(offset + 0x1, "uint8", sign.unknown);
    setInt(offset + 0x8, "float32", sign.coordinates[0], { bigEndian: true });
    setInt(offset + 0xc, "float32", sign.coordinates[1], { bigEndian: true });
    setInt(offset + 0x10, "float32", sign.coordinates[2], { bigEndian: true });
    setInt(offset + 0x14, "float32", sign.rotation[0], { bigEndian: true });
    setInt(offset + 0x18, "float32", sign.rotation[1], { bigEndian: true });
    setInt(offset + 0x1c, "float32", sign.rotation[2], { bigEndian: true });

    const extended = photoSignsExtended[index];

    if (extended) {
      setInt(offset + 0x20, "uint32", extended.actor, { bigEndian: true });
      setInt(offset + 0x28, "float32", extended.coordinates[0], { bigEndian: true });
      setInt(offset + 0x2c, "float32", extended.coordinates[1], { bigEndian: true });
      setInt(offset + 0x30, "float32", extended.coordinates[2], { bigEndian: true });
      setInt(offset + 0x34, "float32", extended.orientation, { bigEndian: true });
    }
  }
}

// prettier-ignore
function hash(offset: number, buffer?: Uint32Array): void {
  const constants = [0x5a827999, 0x6ed9eba1];

  const array: number[] = [];

  const checksumTmp = clone(checksums);

  let rot = 0x0;

  [0, 4, 8, 12].map((i) => {
    array[i] = buffer ? buffer[offset + 0x0] : getInt(offset, "uint32", { bigEndian: true });
    rot = array[i] + checksumTmp[0] + ((checksumTmp[1] & checksumTmp[2]) | (~checksumTmp[1] & checksumTmp[3]));
    checksumTmp[0] = (rot << 0x3) | (rot >>> 0x1d);

    array[i + 1] = buffer ? buffer[offset + 0x1] : getInt(offset + 0x4, "uint32", { bigEndian: true });
    rot = array[i + 1] + checksumTmp[3] + ((checksumTmp[0] & checksumTmp[1]) | (~checksumTmp[0] & checksumTmp[2]));
    checksumTmp[3] = (rot << 0x7) | (rot >>> 0x19);

    array[i + 2] = buffer ? buffer[offset + 0x2] : getInt(offset + 0x8, "uint32", { bigEndian: true });
    rot = array[i + 2] + checksumTmp[2] + ((checksumTmp[3] & checksumTmp[0]) | (~checksumTmp[3] & checksumTmp[1]));
    checksumTmp[2] = (rot << 0xb) | (rot >>> 0x15);

    array[i + 3] = buffer ? buffer[offset + 0x3] : getInt(offset + 0xc, "uint32", { bigEndian: true });
    rot = array[i + 3] + checksumTmp[1] + ((checksumTmp[2] & checksumTmp[3]) | (~checksumTmp[2] & checksumTmp[0]));
    checksumTmp[1] = (rot << 0x13) | (rot >>> 0xd);

    offset += buffer ? 0x4 : 0x10;
  });

  [0, 1, 2, 3].map((i) => {
    rot = array[i] + checksumTmp[0] + ((checksumTmp[1] & (checksumTmp[2] | checksumTmp[3])) | (checksumTmp[2] & checksumTmp[3])) + constants[0];
    checksumTmp[0] = (rot << 0x3) | (rot >>> 0x1d);

    rot = array[i + 4] + checksumTmp[3] + ((checksumTmp[0] & (checksumTmp[1] | checksumTmp[2])) | (checksumTmp[1] & checksumTmp[2])) + constants[0];
    checksumTmp[3] = (rot << 0x5) | (rot >>> 0x1b);

    rot = array[i + 8] + checksumTmp[2] + ((checksumTmp[3] & (checksumTmp[0] | checksumTmp[1])) | (checksumTmp[0] & checksumTmp[1])) + constants[0];
    checksumTmp[2] = (rot << 0x9) | (rot >>> 0x17);

    rot = array[i + 12] + checksumTmp[1] + ((checksumTmp[2] & (checksumTmp[3] | checksumTmp[0])) | (checksumTmp[3] & checksumTmp[0])) + constants[0];
    checksumTmp[1] = (rot << 0xd) | (rot >>> 0x13);
  });

  [0, 2, 1, 3].map((i) => {
    rot = array[i] + checksumTmp[0] + (checksumTmp[1] ^ checksumTmp[2] ^ checksumTmp[3]) + constants[1];
    checksumTmp[0] = (rot << 0x3) | (rot >>> 0x1d);

    rot = array[i + 8] + checksumTmp[3] + (checksumTmp[0] ^ checksumTmp[1] ^ checksumTmp[2]) + constants[1];
    checksumTmp[3] = (rot << 0x9) | (rot >>> 0x17);

    rot = array[i + 4] + checksumTmp[2] + (checksumTmp[3] ^ checksumTmp[0] ^ checksumTmp[1]) + constants[1];
    checksumTmp[2] = (rot << 0xb) | (rot >>> 0x15);

    rot = array[i + 12] + checksumTmp[1] + (checksumTmp[2] ^ checksumTmp[3] ^ checksumTmp[0]) + constants[1];
    checksumTmp[1] = (rot << 0xf) | (rot >>> 0x11);
  });

  for (let i = 0x0; i < 0x4; i += 0x1) {
    checksums[i] += checksumTmp[i];
  }
}
