import { get } from "svelte/store";

import { dataView } from "$lib/stores";
import { cloneDataView, getInt, setInt } from "$lib/utils/bytes";
import { getHeaderShift } from "$lib/utils/common/nintendo64";
import {
  getRegionsFromMpk,
  getSaves,
  repackMpk,
  resetMpk,
  unpackMpk,
} from "$lib/utils/common/nintendo64/mpk";
import { getPartialValue, makeOperations } from "$lib/utils/format";
import { getClosestItem } from "$lib/utils/parser";

import type { Item, ItemBitflag, ItemContainer, ItemInt } from "$lib/types";

import { difficulties, vehicleList } from "./utils/resource";

const SAVE_FORMAT = "mpk";

export function initHeaderShift(dataView: DataView): number {
  return getHeaderShift(dataView, SAVE_FORMAT);
}

export function beforeInitDataView(
  dataView: DataView,
  shift: number,
): DataView {
  return unpackMpk(dataView, shift);
}

export function overrideGetRegions(): string[] {
  return getRegionsFromMpk();
}

export function onReady(): void {
  const saves = getSaves();

  saves.forEach((save) => {
    deobfuscateData(save.offset);
  });
}

export function onInitFailed(): void {
  resetMpk();
}

export function overrideParseItem(item: Item): Item {
  if ("id" in item && item.id === "slots") {
    const itemContainer = item as ItemContainer;

    const saves = getSaves();

    itemContainer.instances = saves.length;
  }

  return item;
}

export function overrideParseContainerItemsShifts(
  item: ItemContainer,
  shifts: number[],
  index: number,
): [boolean, number[] | undefined] {
  if (item.id === "slots") {
    const saves = getSaves();

    return [true, [saves[index].offset]];
  }

  return [false, undefined];
}

export function overrideItem(item: Item): Item {
  if ("id" in item && item.id === "carStats") {
    const itemInt = item as ItemInt;

    const levelItem = getClosestItem(/carLevel-/, item) as ItemInt;

    const level = getInt(levelItem.offset, "uint8");

    itemInt.disabled = level === 0;

    return itemInt;
  }

  return item;
}

export function overrideGetInt(item: Item): [boolean, number | undefined] {
  if ("id" in item && item.id === "time") {
    const itemInt = item as ItemInt;

    const time = getInt(itemInt.offset, "uint32", { bigEndian: true });

    if (time === 0x7fffffff) {
      return [true, 0];
    }
  }

  return [false, undefined];
}

export function overrideSetInt(item: Item, value: string): boolean {
  if ("id" in item && item.id === "time") {
    const itemInt = item as ItemInt;

    const oldInt = getInt(itemInt.offset, "uint32", { bigEndian: true });

    let int = makeOperations(parseInt(value), itemInt.operations, true);

    if (oldInt !== 0x7fffffff) {
      int = getPartialValue(oldInt, int, itemInt.operations!);
    }

    if (int === 0) {
      int = 0x7fffffff;
    }

    setInt(itemInt.offset, "uint32", int, { bigEndian: true });

    return true;
  } else if ("id" in item && item.id?.match(/carLevel-/)) {
    const itemInt = item as ItemInt;

    const [index] = item.id.splitInt();

    const level = parseInt(value);

    const previous = getInt(itemInt.offset, "uint8");

    if (previous === 0 && level > 0) {
      const vehicle = vehicleList.find((vehicle) => vehicle.index === index);

      if (!vehicle) {
        return false;
      }

      vehicle.stats.forEach((stats, index) => {
        setInt(itemInt.offset + index + 0x1, "uint8", stats);
      });
    } else if (previous > 0 && level === 0) {
      setInt(itemInt.offset + 0x1, "uint32", 0x0);
      setInt(itemInt.offset + 0x5, "uint32", 0x0);
    }
  }

  return false;
}

export function afterSetInt(item: Item, flag: ItemBitflag): void {
  if ("id" in item && item.id === "raceBitflags") {
    const checked = getInt(flag.offset, "bit", { bit: flag.bit });

    setInt(flag.offset, "bit", checked, { bit: flag.bit + 1 });
  } else if ("id" in item && item.id?.match(/challengeRace-/)) {
    const itemInt = item as ItemInt;

    const [index] = item.id.splitInt();

    updateChallengeFlags(itemInt.offset - index);
  } else if ("id" in item && item.id?.match(/carLevel-/)) {
    const itemInt = item as ItemInt;

    const [index] = item.id.splitInt();

    const offset = itemInt.offset - index * 0xc;

    let count = 0;

    for (let i = 0x0; i < 0x1f; i += 0x1) {
      const level = getInt(offset + i * 0xc, "uint8");

      count += level > 0 ? 1 : 0;
    }

    setInt(offset - 0x2e, "uint16", count, { bigEndian: true });
  }
}

export function beforeSaving(): ArrayBufferLike {
  const $dataView = get(dataView);

  const buffer = new Uint8Array(cloneDataView($dataView).buffer);

  const saves = getSaves();

  saves.forEach((save) => {
    obfuscateData(save.offset, buffer);
  });

  const obfuscateDataView = new DataView(buffer.buffer);

  return repackMpk(obfuscateDataView);
}

export function onReset(): void {
  resetMpk();
}

const obfuscator = [0x49, 0x41, 0x49, 0x4e];

function deobfuscateData(offset: number): void {
  for (let i = 0x200; i < 0x710; i += 0x1) {
    const int = getInt(offset + i, "uint8");

    setInt(offset + i, "uint8", int - obfuscator[i % 0x4]);
  }
}

function obfuscateData(offset: number, data: Uint8Array): Uint8Array {
  for (let i = 0x200; i < 0x710; i += 0x1) {
    const int = getInt(offset + i, "uint8");

    data[offset + i] = int + obfuscator[i % 0x4];
  }

  return data;
}

function updateChallengeFlags(offset: number): void {
  let shift = 0x0;

  difficulties.forEach((difficulty, index) => {
    let count = 0;

    for (let i = 0x0; i < difficulty.courses; i += 0x1) {
      const int = getInt(offset + shift++, "uint8", {
        binary: { bitStart: 0, bitLength: 2 },
      });

      count += int !== 0x3 ? 1 : 0;
    }

    const flagsOffset = offset + 0x1d + Math.floor(index / 2);
    const cleared = count === difficulty.courses;

    setInt(flagsOffset, "uint8", cleared ? 0xff : 0x0, {
      binary: {
        bitStart: index % 2 === 0x0 ? 0 : 3,
        bitLength: index % 2 === 0x0 ? 3 : 5,
      },
    });
  });
}
