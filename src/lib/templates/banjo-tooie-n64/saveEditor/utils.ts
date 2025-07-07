import { get } from "svelte/store";

import { fileHeaderShift, gameRegion } from "$lib/stores";
import { getInt, getString, setInt } from "$lib/utils/bytes";
import {
  byteswapDataView,
  generateRareChecksum,
  getHeaderShift,
} from "$lib/utils/common/nintendo64";
import { makeOperations } from "$lib/utils/format";

import type { Item, ItemChecksum, ItemContainer, ItemInt } from "$lib/types";

export function initHeaderShift(dataView: DataView): number {
  return getHeaderShift(dataView, "eep");
}

export function beforeInitDataView(dataView: DataView): DataView {
  return byteswapDataView("eep", dataView);
}

export function overrideShift(item: Item, shifts: number[]): number[] {
  const $fileHeaderShift = get(fileHeaderShift);

  if ("id" in item && item.id?.match(/^extra/)) {
    for (let i = 0; i < 2; i += 1) {
      const offset = i * 0x80;

      const int = getInt($fileHeaderShift + offset, "uint32", {
        bigEndian: true,
      });

      if (int !== 0x0) {
        return [...shifts, offset];
      }
    }
  }

  return shifts;
}

function getShift(
  offset: number,
  bit: number,
  special = false,
): [number, number] {
  if (offset >= 0xa6) {
    let int = offset * 0x8 + bit + 0x1e;

    if (int >= 0x972 && int <= 0x97b && !special) {
      int += 0x2;
    }

    offset = Math.floor(int / 0x8);
    bit = int % 8;
  }

  return [offset, bit];
}

export function overrideParseItem(item: Item): Item {
  const $gameRegion = get(gameRegion);

  if ($gameRegion === 1 && (!("id" in item) || !item.id?.match(/^extra/))) {
    if (item.type === "bitflags") {
      item.flags.forEach((flag) => {
        const [offset, bit] = getShift(flag.offset, flag.bit, flag.hidden);

        flag.offset = offset;
        flag.bit = bit;

        if (item.id === "jukebox") {
          flag.hidden = false;
        }
      });
    } else if ("binary" in item && item.binary) {
      const [offset, bit] = getShift(item.offset, item.binary.bitStart);

      item.offset = offset;
      item.binary.bitStart = bit;
    } else if ("bit" in item) {
      const [offset, bit] = getShift(item.offset, item.bit!);

      item.offset = offset;
      item.bit = bit;
    }
  }

  return item;
}

export function overrideParseContainerItemsShifts(
  item: ItemContainer,
  shifts: number[],
  index: number,
): [boolean, number[] | undefined] {
  const $fileHeaderShift = get(fileHeaderShift);

  if (item.id === "slots") {
    for (let i = 0; i < item.instances + 1; i += 1) {
      const offset = 0x100 + i * item.length;

      const magic = getString($fileHeaderShift + offset + 0x0, 0x4, "uint8");
      const saveIndex = getInt($fileHeaderShift + offset + 0xa, "uint8");

      if (magic === "KHJC" && saveIndex === index + 1) {
        return [true, [...shifts, offset]];
      }
    }

    return [true, [-1]];
  }

  return [false, undefined];
}

export function overrideItem(item: Item): Item {
  const $gameRegion = get(gameRegion);

  if ("id" in item && item.id === "extra-language") {
    const itemInt = item as ItemInt;

    itemInt.hidden = $gameRegion !== 0;

    return itemInt;
  }

  return item;
}

export function overrideGetInt(item: Item): [boolean, number | undefined] {
  if ("id" in item && item.id === "playtime") {
    const itemInt = item as ItemInt;

    let int = 0;

    for (let i = 0x0; i < 0xe; i += 0x1) {
      int += getInt(itemInt.offset + i * 2, "uint16", { bigEndian: true });
    }

    int = makeOperations(int, [
      {
        convert: {
          from: "seconds",
          // @ts-ignore
          to: itemInt.operations[0].convert.to,
        },
      },
    ]);

    return [true, int];
  } else if ("id" in item && item.id?.match(/total-/)) {
    const itemInt = item as ItemInt;

    const [, type] = item.id.split("-");

    let int = 0;

    const count = type === "jiggies" ? 0x5a : 0x99;

    let offset = itemInt.offset;
    let bit = itemInt.bit as number;
    let iteration = 1;

    for (let i = 0x0; i < count; i += 0x1) {
      let value = getInt(offset, "bit", { bit });

      if (type === "notes") {
        if (iteration % 17 === 0) {
          value *= 20;
        } else {
          value *= 5;
        }
      }

      int += value;

      bit += 1;

      if (bit === 8) {
        offset += 0x1;
        bit = 0;
      }

      iteration += 1;
    }

    return [true, int];
  } else if ("id" in item && item.id?.match(/colosseumKickball$/)) {
    const itemInt = item as ItemInt;

    let int = getInt(itemInt.offset, "int16", { bigEndian: true });

    if (int > 0) {
      int -= 0x3e80;
    }

    return [true, int];
  }

  return [false, undefined];
}

export function overrideSetInt(item: Item, value: string): boolean {
  if ("id" in item && item.id?.match(/colosseumKickball$/)) {
    const itemInt = item as ItemInt;

    let int = parseInt(value);

    if (int > 0) {
      int += 0x3e80;
    }

    setInt(itemInt.offset, "int16", int, { bigEndian: true });

    return true;
  }

  return false;
}

export function generateChecksum(item: ItemChecksum): bigint {
  const [checksum1, checksum2] = generateRareChecksum(item);

  const high = checksum1.toString(16).padStart(8, "0").slice(-8);
  const low = checksum1.xor(checksum2).toString(16).padStart(8, "0").slice(-8);

  return BigInt(`0x${high}${low}`);
}

export function beforeSaving(): ArrayBufferLike {
  return byteswapDataView("eep").buffer;
}
