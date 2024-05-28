import { get } from "svelte/store";

import { gameRegion, gameTemplate } from "$lib/stores";
import { getInt, getString, setInt, setString } from "$lib/utils/bytes";
import {
  customGetRegions,
  getHeaderShift,
  getPsvHeaderShift,
  getSlots,
  isPsvHeader,
} from "$lib/utils/common/playstation";

import type { Item, ItemContainer, ItemInt, ItemString } from "$lib/types";

export function initHeaderShift(dataView: DataView): number {
  return getHeaderShift(dataView);
}

export function overrideGetRegions(
  dataView: DataView,
  shift: number,
): string[] {
  return customGetRegions(dataView, shift);
}

export function initShifts(shifts: number[]): number[] {
  const $gameRegion = get(gameRegion);

  if (isPsvHeader()) {
    shifts = [...shifts, getPsvHeaderShift()];
  }

  if ($gameRegion !== 0) {
    return [...shifts, 0x100];
  }

  return shifts;
}

export function overrideParseContainerItemsShifts(
  item: ItemContainer,
  shifts: number[],
  index: number,
): [boolean, number[] | undefined] {
  if (item.id === "slots") {
    return getSlots("memory", shifts, index);
  }

  return [false, undefined];
}

function getTime(offset: number, mode: string): number {
  const string = getInt(offset, "uint32").toString().padStart(6, "0");

  let int = 0;

  switch (mode) {
    case "ta-hours":
      int = parseInt(string.slice(0, -4));
      break;
    case "ta-minutes":
      int = parseInt(string.slice(-4, -2));
      break;
    case "ta-seconds":
      int = parseInt(string.slice(-2));
      break;
  }

  return int;
}

export function overrideGetInt(item: Item): [boolean, number | undefined] {
  if ("id" in item && item.id === "location") {
    const itemInt = item as ItemInt;

    const location1 = getInt(itemInt.offset, "uint8");
    const location2 = getInt(itemInt.offset + 0x4, "uint8");
    const location3 = getInt(itemInt.offset + 0x6, "uint8");

    const int = (location1 << 0x10) | (location2 << 0x8) | location3;

    return [true, int];
  } else if ("id" in item && item.id?.match(/ta-/)) {
    const itemInt = item as ItemInt;

    const int = getTime(itemInt.offset, item.id);

    return [true, int];
  }

  return [false, undefined];
}

export function overrideSetInt(item: Item, value: string): boolean {
  if ("id" in item && item.id === "location") {
    const itemInt = item as ItemInt;

    const hex = parseInt(value).toHex(6);

    const location1 = parseInt(hex.slice(0, -4), 16);
    const location2 = parseInt(hex.slice(-4, -2), 16);
    const location3 = parseInt(hex.slice(-2), 16);

    setInt(itemInt.offset, "uint8", location1);
    setInt(itemInt.offset + 0x4, "uint8", location2);
    setInt(itemInt.offset + 0x6, "uint8", location3);

    return true;
  } else if ("id" in item && item.id?.match(/ta-/)) {
    const itemInt = item as ItemInt;

    const hours = `${getTime(itemInt.offset, "ta-hours")}`;
    const minutes = `${getTime(itemInt.offset, "ta-minutes")}`.padStart(2, "0");
    const seconds = `${getTime(itemInt.offset, "ta-seconds")}`.padStart(2, "0");

    let int = 0;

    if (item.id === "ta-hours") {
      int = parseInt(`${value}${minutes}${seconds}`);
    } else if (item.id === "ta-minutes") {
      int = parseInt(`${hours}${value.padStart(2)}${seconds}`);
    } else if (item.id === "ta-seconds") {
      int = parseInt(`${hours}${minutes}${value.padStart(2)}`);
    }

    setInt(itemInt.offset, "uint32", int);

    return true;
  }

  return false;
}

export function afterSetInt(item: Item): void {
  const $gameTemplate = get(gameTemplate);

  if ("id" in item && item.id === "filename") {
    const itemString = item as ItemString;

    const value = getString(itemString.offset, 8, "uint8");

    setString(itemString.offset - 0x264, 8, "uint8", value);
  } else if ("id" in item && item.id === "hours") {
    const itemInt = item as ItemInt;

    const value = getInt(itemInt.offset, "uint32");

    setInt(itemInt.offset - 0x2f0, "uint32", value);
  } else if ("id" in item && item.id === "minutes") {
    const itemInt = item as ItemInt;

    const value = getInt(itemInt.offset, "uint32");

    setInt(itemInt.offset - 0x2f0, "uint32", value);
  } else if ("id" in item && item.id === "seconds") {
    const itemInt = item as ItemInt;

    const value = getInt(itemInt.offset, "uint32");

    setInt(itemInt.offset - 0x2f0, "uint32", value);
  } else if ("id" in item && item.id === "gold") {
    const itemInt = item as ItemInt;

    const value = getInt(itemInt.offset, "uint32");

    setInt(itemInt.offset - 0x2b4, "uint32", value);
  } else if ("id" in item && item.id === "buttons") {
    const itemInt = item as ItemInt;

    const value = getInt(itemInt.offset, "uint32");

    const buttonName = $gameTemplate.resources!.buttons[value];

    const buttonMapped = Object.keys(
      $gameTemplate.resources!.buttonsMapped,
    ).find(
      (key) =>
        $gameTemplate.resources!.buttonsMapped[parseInt(key)] === buttonName,
    );

    let offset = itemInt.offset;

    switch (itemInt.name) {
      case "Right hand":
        offset += 0x20;
        break;
      case "Left hand":
        offset += 0x1e;
        break;
      case "Jump":
        offset += 0x1c;
        break;
      case "Special":
        offset += 0x1a;
        break;
      case "Wolf":
        offset += 0x18;
        break;
      case "Mist":
        offset += 0x16;
        break;
      case "Bat":
        offset += 0x14;
        break;
      case "???":
        offset += 0x12;
        break;
    }

    setInt(offset, "uint16", parseInt(buttonMapped!));
  }
}
