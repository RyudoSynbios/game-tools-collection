import { get } from "svelte/store";

import { dataView, gameRegion } from "$lib/stores";
import {
  cloneDataView,
  getBitflag,
  getInt,
  setBitflag,
  setBoolean,
  setInt,
} from "$lib/utils/bytes";
import { round } from "$lib/utils/format";
import { getItem } from "$lib/utils/parser";

import { Item, ItemBitflags, ItemChecksum, ItemInt } from "$lib/types";

import { trophiesEurope, trophiesUsaJapan } from "./utils/resource";

export function beforeInitDataView(dataView: DataView): DataView {
  return decodeSave(dataView);
}

export function initShifts(shifts: number[]): number[] {
  const $dataView = get(dataView);

  let shift = 0x0;

  for (let i = 0x2040; i < $dataView.byteLength; i += 0x2000) {
    if (getInt(i + 0x10, "uint16", { bigEndian: true }) === 0x1) {
      shift = i;
    }
  }

  return [...shifts, shift];
}

export function overrideParseItem(item: Item): Item {
  const $gameRegion = get(gameRegion);

  if ("id" in item && item.id?.match(/trophy-/)) {
    const itemInt = item as ItemInt;

    const split = item.id.split("-");

    const index = parseInt(split[1]);

    const resource: { [key: number]: string } =
      $gameRegion === 0 ? trophiesEurope : trophiesUsaJapan;

    itemInt.name = resource[index];

    if ($gameRegion === 0 && index === 0x124) {
      itemInt.hidden = true;
    }
  }

  return item;
}

export function overrideItem(item: Item): Item {
  if ("id" in item && item.id?.match(/-(count|group)-/)) {
    const itemInt = item as ItemInt;

    const [, type] = item.id.split("-");

    const progression = getItem(item.id.replace(`-${type}`, "")) as ItemInt;

    const int = getInt(progression.offset, "bit", { bit: progression.bit });

    if (type === "count" && int === 0x1) {
      itemInt.hidden = true;
    } else if (type === "group" && int === 0x0) {
      itemInt.hidden = true;
    } else {
      itemInt.hidden = false;
    }

    return itemInt;
  }

  return item;
}

export function overrideGetInt(item: Item): [boolean, number | undefined] {
  if ("id" in item && item.id?.match(/cleared-/)) {
    const itemInt = item as ItemInt;

    const split = item.id.split("-");

    const mode = parseInt(split[1]);

    const int =
      getInt(itemInt.offset - 0x4 - mode, "bit", { bit: 3 - mode }) +
      getInt(itemInt.offset, "uint8");

    return [true, int];
  } else if ("id" in item && item.id === "sounds") {
    const itemInt = item as ItemInt;

    const int = 100 + getInt(itemInt.offset, "int8");

    return [true, int];
  } else if ("id" in item && item.id === "music") {
    const itemInt = item as ItemInt;

    const int = 100 - getInt(itemInt.offset, "int8");

    return [true, int];
  } else if ("id" in item && item.id === "hitPercentage") {
    const itemInt = item as ItemInt;

    let int = 0;

    const successfulHits = getInt(itemInt.offset, "uint32", {
      bigEndian: true,
    });
    const hits = getInt(itemInt.offset + 0x4, "uint32", { bigEndian: true });

    if (hits > 0x0 && successfulHits <= hits) {
      int = round((successfulHits / hits) * 100, 2);
    }

    return [true, int];
  } else if ("id" in item && item.id === "vsPlayMatchTotal") {
    const itemInt = item as ItemInt;

    let count = 0;

    for (let i = 0x0; i < 0x5; i += 0x1) {
      count += getInt(itemInt.offset + i * 0x4, "uint32", { bigEndian: true });
    }

    return [true, count];
  }

  return [false, undefined];
}

export function overrideSetInt(item: Item, value: string): boolean {
  if ("id" in item && item.id?.match(/cleared-/)) {
    const itemInt = item as ItemInt;

    const split = item.id.split("-");

    const mode = parseInt(split[1]);
    const characterIndex = parseInt(split[2]);

    const int = parseInt(value);

    setInt(itemInt.offset - 0x4 - mode, "bit", int > 0x0 ? 0x1 : 0x0, {
      bit: 3 - mode,
    });
    setInt(itemInt.offset, "uint8", int > 0 ? int - 0x1 : 0);

    const offset =
      itemInt.offset -
      characterIndex * 0xac -
      Math.floor(characterIndex / 8) -
      (0x729 - mode * 0x3);

    setInt(offset, "bit", int, { bit: characterIndex % 8 });

    return true;
  } else if ("id" in item && item.id === "sounds") {
    const itemInt = item as ItemInt;

    const int = parseInt(value);

    setInt(itemInt.offset, "uint8", int - 100);

    return true;
  } else if ("id" in item && item.id === "music") {
    const itemInt = item as ItemInt;

    const int = parseInt(value);

    setInt(itemInt.offset, "uint8", 100 - int);

    return true;
  }

  return false;
}

export function afterSetInt(item: Item): void {
  if ("id" in item && item.id === "unlockedChallengers") {
    const itemBitflags = item as ItemBitflags;

    let allChecked = true;

    for (let i = 0; i <= 10; i += 1) {
      const flag = itemBitflags.flags[i];

      if (!getBitflag(flag.offset, flag.bit)) {
        allChecked = false;
      }
    }

    const offset = itemBitflags.flags[0].offset;

    setBoolean(offset + 0x1ab, allChecked);
  } else if ("id" in item && item.id === "unlockedStages") {
    const itemBitflags = item as ItemBitflags;

    let standardsChecked = true;
    let allChecked = true;

    for (let i = 0; i <= 10; i += 1) {
      const flag = itemBitflags.flags[i];

      if (!getBitflag(flag.offset, flag.bit)) {
        if (i <= 5) {
          standardsChecked = false;
        }
        allChecked = false;
      }
    }

    const offset = itemBitflags.flags[0].offset;

    setBoolean(offset + 0x1aa, standardsChecked);
    setBoolean(offset + 0x1ab, allChecked);
  } else if ("id" in item && item.id?.match(/targetTest-[0-9]/)) {
    const itemInt = item as ItemInt;

    const split = item.id.split("-");

    const index = parseInt(split[1]);

    const offset =
      itemInt.offset - index * 0xac - 0x719 - Math.floor(index / 0x8);

    const isCleared = getBitflag(itemInt.offset, 7);

    setBitflag(offset, index % 8, isCleared);
    setBitflag(offset + 0x8, index % 8, isCleared);
    setBitflag(offset + 0x14, index % 8, isCleared);
    setInt(itemInt.offset + 0x18, "uint32", 0x0, { bigEndian: true });
  } else if ("id" in item && item.id?.match(/targetTest-/)) {
    const itemInt = item as ItemInt;

    const split = item.id.split("-");

    const index = parseInt(split[2]);

    const offset = itemInt.offset - index * 0xac;

    const int = getInt(itemInt.offset, "uint32", { bigEndian: true });

    setInt(offset - 0x6dc + index * 0x4, "uint32", int, { bigEndian: true });
  } else if ("id" in item && item.id?.match(/homeRunContest-/)) {
    const itemInt = item as ItemInt;

    const split = item.id.split("-");

    const index = parseInt(split[1]);

    const offset = itemInt.offset - index * 0xac;

    const int = getInt(itemInt.offset, "uint32", { bigEndian: true });

    setInt(offset - 0x668 + index * 0x4, "uint32", int, { bigEndian: true });
  } else if (
    "id" in item &&
    (item.id?.match(/10ManMelee-[0-9]/) || item.id?.match(/100ManMelee-[0-9]/))
  ) {
    const itemInt = item as ItemInt;

    let shift = 0x0;

    if (item.id.match(/10ManMelee-/)) {
      shift = 0x1c;
    } else if (item.id.match(/100ManMelee-/)) {
      shift = 0x20;
    }

    setInt(itemInt.offset + shift, "uint32", 0x0, { bigEndian: true });
  } else if ("id" in item && item.id === "15MinuteMelee") {
    const itemInt = item as ItemInt;

    const int =
      getInt(itemInt.offset, "uint16", { bigEndian: true }) > 0 ? 0x1 : 0x0;

    setInt(itemInt.offset - 0x26, "bit", int, { bit: 4 });
  } else if ("id" in item && item.id?.match(/training-/)) {
    const itemInt = item as ItemInt;

    const split = item.id.split("-");

    const index = parseInt(split[1]);

    const offset = itemInt.offset - index * 0xac;

    const int = getInt(itemInt.offset, "uint16", { bigEndian: true });

    setInt(offset - 0x5fe + index * 0x4, "uint32", int, { bigEndian: true });
  } else if ("id" in item && item.id?.match(/trophy-/)) {
    const itemInt = item as ItemInt;

    const split = item.id.split("-");

    const index = parseInt(split[1]);

    const offset = itemInt.offset - index * 0x2;

    let count = 0;

    for (let i = 0; i < 0x12c; i += 1) {
      const int = getInt(offset + i * 0x2, "uint8");

      let value = 0;

      if (int > 0x0) {
        count += 1;
        value = 1;
      }

      const flagOffset =
        offset - 0x17a + Math.floor(i / 0x20) * 0x8 - Math.floor(i / 8);

      setInt(flagOffset, "bit", value, { bit: i % 8 });
    }

    setInt(offset - 0x5, "uint16", count, { bigEndian: true });
  } else if ("id" in item && item.id?.match(/kos/)) {
    const itemInt = item as ItemInt;

    const split = item.id.split("-");

    const characterIndex = parseInt(split[1]);
    const koIndex = parseInt(split[2]);

    const offset = itemInt.offset - characterIndex * 0xac - koIndex * 0x2;

    let count = 0;

    for (let i = 0x0; i <= 0x18; i += 0x1) {
      for (let j = 0x0; j <= 0x18; j += 0x1) {
        count += getInt(offset + i * 0xac + j * 0x2, "uint16", {
          bigEndian: true,
        });
      }
    }

    setInt(offset - 0x688, "uint32", count, { bigEndian: true });
    setInt(offset - 0x51c, "uint32", count, { bigEndian: true });
  } else if ("id" in item && item.id === "combinedVsPlayTime") {
    const itemInt = item as ItemInt;

    const int = getInt(itemInt.offset, "uint32", { bigEndian: true });

    setInt(itemInt.offset - 0x1c4, "uint32", int, { bigEndian: true });
  } else if ("id" in item && item.id?.match(/vsMatchTotal-/)) {
    const itemInt = item as ItemInt;

    const split = item.id.split("-");

    const index = parseInt(split[1]);

    const offset = itemInt.offset - index * 0x4;

    let count = 0;

    for (let i = 0x0; i < 0x5; i += 0x1) {
      const int = getInt(offset + i * 0x4, "uint32", {
        bigEndian: true,
      });

      if (i === 2) {
        setInt(offset - 0x17c, "uint32", int, { bigEndian: true });
      }

      count += int;
    }

    setInt(offset - 0x1a8, "uint32", count, { bigEndian: true });
    setInt(offset - 0x188, "uint32", count, { bigEndian: true });
    setInt(offset - 0x180, "uint32", count, { bigEndian: true });
  } else if ("id" in item && item.id === "totalCoinsEarned") {
    const itemInt = item as ItemInt;

    const int = getInt(itemInt.offset, "uint32", { bigEndian: true });

    setInt(itemInt.offset - 0x1a0, "uint32", int, { bigEndian: true });
  }
}

export function generateChecksum(item: ItemChecksum): bigint {
  let checksum = BigInt(0x0);

  const buffer = [
    0x01, 0x23, 0x45, 0x67, 0x89, 0xab, 0xcd, 0xef, 0xfe, 0xdc, 0xba, 0x98,
    0x76, 0x54, 0x32, 0x10,
  ];

  for (let i = item.control.offsetStart; i < item.control.offsetEnd; i += 0x1) {
    buffer[i & 0xf] = (buffer[i & 0xf] + getInt(i, "uint8")) & 0xff;
  }

  const checksums = [0x0, 0x0, 0x0, 0x0];

  buffer.forEach((int, index) => {
    const iteration = Math.floor(index / 0x4);
    const shift = (iteration * 0x4 + 0x3 - index) * 0x8;

    checksums[iteration] |= int << shift;
    checksums[iteration] >>>= 0x0;
  });

  if (item.id === "checksum1") {
    checksum = BigInt(`0x${checksums[0].toHex(8)}${checksums[1].toHex(8)}`);
  } else if (item.id === "checksum2") {
    checksum = BigInt(`0x${checksums[2].toHex(8)}${checksums[3].toHex(8)}`);
  }

  return checksum;
}

export function beforeSaving(): ArrayBufferLike {
  return encodeSave();
}

const buffer = [
  0x26, 0xff, 0xe8, 0xef, 0x42, 0xd6, 0x01, 0x54, 0x14, 0xa3, 0x80, 0xfd, 0x6e,
];

function decodeSave(dataView: DataView): DataView {
  for (let i = 0x2040; i < dataView.byteLength; i += 0x2000) {
    if (dataView.byteLength < i + 0x2000) {
      return dataView;
    }

    let previous = getInt(i + 0xf, "uint8", {}, dataView);

    for (let j = i + 0x10; j < i + 0x2000; j += 0x1) {
      const encoded = getInt(j, "uint8", {}, dataView);

      let decoded = 0x0;

      switch (previous % 7) {
        case 0:
          decoded = (encoded & 0x80) | ((encoded >> 0x1) & 0x20);
          decoded |= ((encoded >> 0x2) & 0x8) | ((encoded >> 0x3) & 0x2);
          decoded |= ((encoded & 0x8) << 0x3) | ((encoded & 0x4) << 0x2);
          decoded |= (encoded & 0x1) | ((encoded & 0x2) << 0x1);
          break;
        case 1:
          decoded = ((encoded >> 0x1) & 0x40) | ((encoded >> 0x3) & 0x8);
          decoded |= ((encoded >> 0x1) & 0x10) | ((encoded & 0x10) << 0x1);
          decoded |= ((encoded >> 0x3) & 0x1) | (encoded & 0x4);
          decoded |= ((encoded & 0x1) << 0x1) | ((encoded & 0x2) << 0x6);
          break;
        case 2:
          decoded = ((encoded >> 0x2) & 0x20) | ((encoded >> 0x6) & 0x1);
          decoded |= ((encoded >> 0x4) & 0x2) | ((encoded & 0x10) << 0x3);
          decoded |= ((encoded & 0x8) << 0x1) | ((encoded & 0x4) << 0x4);
          decoded |= (encoded & 0x3) << 0x2;
          break;
        case 3:
          decoded = ((encoded >> 0x5) & 0x4) | ((encoded & 0x40) << 0x1);
          decoded |= ((encoded & 0x20) << 0x1) | ((encoded >> 0x1) & 0x8);
          decoded |= ((encoded >> 0x2) & 0x2) | ((encoded & 0x4) << 0x3);
          decoded |= ((encoded & 0x1) << 0x4) | ((encoded >> 0x1) & 0x1);
          break;
        case 4:
          decoded = ((encoded >> 0x7) & 0x1) | ((encoded >> 0x2) & 0x10);
          decoded |= ((encoded >> 0x3) & 0x4) | ((encoded & 0x10) << 0x2);
          decoded |= ((encoded & 0x8) << 0x4) | ((encoded >> 0x1) & 0x2);
          decoded |= ((encoded & 0x1) << 0x3) | ((encoded & 0x2) << 0x4);
          break;
        case 5:
          decoded = ((encoded >> 0x3) & 0x10) | ((encoded >> 0x5) & 0x2);
          decoded |= ((encoded >> 0x5) & 0x1) | ((encoded >> 0x2) & 0x4);
          decoded |= (encoded & 0x8) | ((encoded & 0x7) << 0x5);
          break;
        case 6:
          decoded = ((encoded >> 0x4) & 0x8) | ((encoded >> 0x4) & 0x4);
          decoded |= ((encoded & 0x20) << 0x2) | (encoded & 0x10);
          decoded |= ((encoded & 0x8) << 0x2) | ((encoded >> 0x2) & 0x1);
          decoded |= ((encoded & 0x1) << 0x6) | (encoded & 0x2);
      }

      const int = decoded ^ previous ^ buffer[previous % 0xd];

      dataView.setUint8(j, int);

      previous = encoded;
    }
  }

  return dataView;
}

function encodeSave(): ArrayBufferLike {
  const $dataView = get(dataView);

  const encodedDataView = cloneDataView($dataView);

  for (let i = 0x2040; i < $dataView.byteLength; i += 0x2000) {
    let previous = getInt(i + 0xf, "uint8");

    for (let j = i + 0x10; j < i + 0x2000; j += 0x1) {
      const decoded = getInt(j, "uint8");

      let encoded = 0x0;

      encoded = decoded ^ previous ^ buffer[previous % 0xd];

      let int = encoded;

      switch (previous % 7) {
        case 0:
          int = (encoded & 0x80) | ((encoded >> 0x3) & 0x8);
          int |= ((encoded & 0x20) << 0x1) | ((encoded >> 0x2) & 0x4);
          int |= ((encoded & 0x8) << 0x2) | ((encoded >> 0x1) & 0x2);
          int |= (encoded & 0x1) | ((encoded & 0x2) << 0x3);
          break;
        case 1:
          int = ((encoded >> 0x6) & 0x2) | ((encoded & 0x40) << 0x1);
          int |= ((encoded >> 0x1) & 0x10) | ((encoded & 0x10) << 0x1);
          int |= ((encoded & 0x8) << 0x3) | (encoded & 0x4);
          int |= ((encoded & 0x1) << 0x3) | ((encoded >> 0x1) & 0x1);
          break;
        case 2:
          int = ((encoded >> 0x3) & 0x10) | ((encoded >> 0x4) & 0x4);
          int |= ((encoded & 0x20) << 0x2) | ((encoded >> 0x1) & 0x8);
          int |= ((encoded >> 0x2) & 0x2) | ((encoded >> 0x2) & 0x1);
          int |= ((encoded & 0x1) << 0x6) | ((encoded & 0x2) << 0x4);
          break;
        case 3:
          int = ((encoded >> 0x1) & 0x40) | ((encoded >> 0x1) & 0x20);
          int |= ((encoded >> 0x3) & 0x4) | ((encoded >> 0x4) & 0x1);
          int |= ((encoded & 0x8) << 0x1) | ((encoded & 0x4) << 0x5);
          int |= ((encoded & 0x1) << 0x1) | ((encoded & 0x2) << 0x2);
          break;
        case 4:
          int = ((encoded >> 0x4) & 0x8) | ((encoded >> 0x2) & 0x10);
          int |= ((encoded >> 0x4) & 0x2) | ((encoded & 0x10) << 0x2);
          int |= ((encoded >> 0x3) & 0x1) | ((encoded & 0x4) << 0x3);
          int |= ((encoded & 0x1) << 0x7) | ((encoded & 0x2) << 0x1);
          break;
        case 5:
          int = ((encoded >> 0x5) & 0x4) | ((encoded >> 0x5) & 0x2);
          int |= ((encoded >> 0x5) & 0x1) | ((encoded & 0x10) << 0x3);
          int |= (encoded & 0x8) | ((encoded & 0x4) << 0x2);
          int |= (encoded & 0x3) << 0x5;
          break;
        case 6:
          int = ((encoded >> 0x2) & 0x20) | ((encoded >> 0x6) & 0x1);
          int |= ((encoded >> 0x2) & 0x8) | (encoded & 0x10);
          int |= ((encoded & 0x8) << 0x4) | ((encoded & 0x4) << 0x4);
          int |= ((encoded & 0x1) << 0x2) | (encoded & 0x2);
          break;
      }

      encodedDataView.setUint8(j, int);

      previous = int;
    }
  }

  return encodedDataView.buffer;
}
