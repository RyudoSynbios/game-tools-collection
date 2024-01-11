import { get } from "svelte/store";

import { gameJson, gameRegion } from "$lib/stores";
import { getInt, setInt, setString } from "$lib/utils/bytes";
import {
  checkPlaystationSlots,
  getDexDriveHeaderShift,
  getPsvHeaderShift,
  getVmpHeaderShift,
  isDexDriveHeader,
  isPsvHeader,
  isVmpHeader,
} from "$lib/utils/common/playstation";

import type { Bit, Item, ItemInt } from "$lib/types";

import {
  europeValidator,
  franceValidator,
  germanyValidator,
  japanValidator,
  usaValidator,
} from "./template";

export function initHeaderShift(dataView: DataView): number {
  if (isDexDriveHeader(dataView)) {
    return getDexDriveHeaderShift();
  } else if (isVmpHeader(dataView)) {
    return getVmpHeaderShift();
  }

  return 0x0;
}

export function initShifts(shifts: number[]): number[] {
  const $gameRegion = get(gameRegion);

  if (isPsvHeader()) {
    shifts = [...shifts, getPsvHeaderShift()];
  }

  if ($gameRegion === 1 || $gameRegion == 2) {
    return [...shifts, 0x180];
  }

  return shifts;
}

export function checkSlots(index: number): boolean {
  return !checkPlaystationSlots(index, [
    europeValidator,
    japanValidator,
    usaValidator,
    franceValidator,
    germanyValidator,
  ]);
}

export function overrideGetInt(item: Item): [boolean, boolean | undefined] {
  if ("id" in item && item.id?.match(/skill-/)) {
    const itemInt = item as ItemInt;

    const split = item.id.split("-");

    const characterIndex = parseInt(split[1]);

    const boolean = Boolean(
      getInt(itemInt.offset, "bit", {
        bit: characterIndex as Bit,
      }),
    );

    return [true, boolean];
  }

  return [false, undefined];
}

export function overrideSetInt(item: Item, value: string): boolean {
  if ("id" in item && item.id?.match(/skill-/)) {
    const itemInt = item as ItemInt;

    const split = item.id.split("-");

    const characterIndex = parseInt(split[1]);

    setInt(itemInt.offset, "bit", value, {
      bit: characterIndex as Bit,
    });

    return true;
  }

  return false;
}

export function afterSetInt(item: Item): void {
  const $gameJson = get(gameJson);

  if ("id" in item && item.id === "formation") {
    const itemInt = item as ItemInt;

    const int = getInt(itemInt.offset, "uint8");

    let character2 = 0x0;
    let character3 = 0x0;
    let character4 = 0x0;

    switch (int) {
      case 0x1:
        character2 = 0x3;
        break;
      case 0x2:
        character2 = 0x3;
        character3 = 0x2;
        break;
      case 0x3:
        character2 = 0x2;
        break;
      case 0x4:
        character2 = 0x3;
        character3 = 0x2;
        break;
      case 0x5:
        character2 = 0x3;
        character3 = 0x2;
        character4 = 0x4;
        break;
      case 0x8:
        character2 = 0x2;
        character3 = 0x4;
        break;
      case 0x9:
        character2 = 0x2;
        character3 = 0x5;
        break;
      case 0xa:
        character2 = 0x2;
        character3 = 0x5;
        character4 = 0x6;
        break;
      case 0xc:
        character2 = 0x2;
        character3 = 0x5;
        character4 = 0x7;
        break;
      case 0xe:
        character2 = 0x5;
        character3 = 0x7;
        break;
      case 0xf:
        character2 = 0x2;
        character3 = 0x5;
        character4 = 0x8;
        break;
      case 0x10:
        character2 = 0x5;
        character3 = 0x8;
        break;
    }

    setInt(itemInt.offset + 0x5, "uint8", character2);
    setInt(itemInt.offset + 0x6, "uint8", character3);
    setInt(itemInt.offset + 0x7, "uint8", character4);
  } else if ("id" in item && item.id === "location") {
    const itemInt = item as ItemInt;

    const int = getInt(itemInt.offset, "uint16");

    let coordinates = [0, 0, 0];

    switch (int) {
      case 0x2004:
        coordinates = [-1455, 256, 1598];
        break;
      case 0x2400:
        coordinates = [230, 124, 224];
        break;
      case 0x2404:
        coordinates = [786, 0, 628];
        break;
      case 0x2406:
        coordinates = [294, 128, 1386];
        break;
      case 0x2410:
        coordinates = [-91, 0, -1789];
        break;
      case 0x2800:
        coordinates = [216, 0, 296];
        break;
      case 0x280c:
        coordinates = [-1349, 498, -187];
        break;
      case 0x2c00:
        coordinates = [28, 52, 732];
        break;
      case 0x2c04:
        coordinates = [28, 52, 732];
        break;
      case 0x2c05:
        coordinates = [28, 52, 732];
        break;
      case 0x3014:
        coordinates = [-51, 256, 48];
        break;
      case 0x3408:
        coordinates = [-34, 0, 78];
        break;
      case 0x3424:
        coordinates = [74, 256, 56];
        break;
      case 0x3c04:
        coordinates = [-349, 256, 501];
        break;
      case 0x3c58:
        coordinates = [-1425, 290, 1164];
        break;
      case 0x4004:
        coordinates = [104, 256, -55];
        break;
      case 0x4400:
        coordinates = [6, 126, -400];
        break;
      case 0x4404:
        coordinates = [525, 12, 1318];
        break;
      case 0x440c:
        coordinates = [12, 98, 624];
        break;
      case 0x4804:
        coordinates = [-178, 256, -1193];
        break;
      case 0x4808:
        coordinates = [1480, 256, 150];
        break;
      case 0x480c:
        coordinates = [-170, 256, 1060];
        break;
      case 0x4810:
        coordinates = [934, 0, -1512];
        break;
      case 0x4c0a:
        coordinates = [224, 128, 1112];
        break;
      case 0x4c0c:
        coordinates = [-750, 140, -1278];
        break;
      case 0x4c18:
        coordinates = [-120, 0, -295];
        break;
      case 0x5400:
        coordinates = [-444, 256, 431];
        break;
      case 0x5402:
        coordinates = [-444, 256, 431];
        break;
      case 0x5404:
        coordinates = [-374, 256, -586];
        break;
      case 0x5405:
        coordinates = [-374, 256, -586];
        break;
      case 0x5c04:
        coordinates = [-303, 490 - 899];
        break;
      case 0x600c:
        coordinates = [334, 202, -49];
        break;
      case 0x6018:
        coordinates = [156, 105, -50];
        break;
      case 0x6400:
        coordinates = [-1248, 130, 795];
        break;
      case 0x6414:
        coordinates = [0, 256, -100];
        break;
      case 0x6804:
        coordinates = [-990, 256, 636];
        break;
      case 0x6c08:
        coordinates = [100, 0, -1500];
        break;
      case 0x6c0c:
        coordinates = [-762, 226, -1050];
        break;
      case 0x7004:
        coordinates = [1090, 386, -1060];
        break;
      case 0x7404:
        coordinates = [-342, 256, -442];
        break;
      case 0x7405:
        coordinates = [-342, 256, -442];
        break;
      case 0x7800:
        coordinates = [580, 110, -258];
        break;
      case 0x7808:
        coordinates = [184, 310, 1038];
        break;
      case 0x7c00:
        coordinates = [384, 0, -384];
        break;
      case 0x7c10:
        coordinates = [160, 0, -260];
        break;
      case 0x7c18:
        coordinates = [-530, 256, -908];
        break;
      case 0x7c44:
        coordinates = [894, 38, -142];
        break;
      case 0x8004:
        coordinates = [-34, 54, -1500];
        break;
      case 0x8804:
        coordinates = [56, 256, 60];
        break;
      case 0x8808:
        coordinates = [0, 0, 0];
        break;
      case 0x9000:
        coordinates = [570, 256, 594];
        break;
      case 0x9008:
        coordinates = [164, 256, 218];
        break;
      case 0x9404:
        coordinates = [130, 0, -330];
        break;
      case 0x9405:
        coordinates = [130, 0, -330];
        break;
      case 0x9805:
        coordinates = [510, 0, -670];
        break;
      case 0x9808:
        coordinates = [-100, 0, -914];
        break;
      case 0x9810:
        coordinates = [-30, 106, 800];
        break;
      case 0x9c00:
        coordinates = [98, 162, 1506];
        break;
      case 0x9c04:
        coordinates = [28, 6, 1532];
        break;
      case 0x9c10:
        coordinates = [98, 162, 1506];
        break;
      case 0x9c14:
        coordinates = [28, 6, 1532];
        break;
      case 0xa004:
        coordinates = [672, 256, 908];
        break;
      case 0xa230:
        coordinates = [-540, 306, -402];
        break;
      case 0xa400:
        coordinates = [125, 0, -470];
        break;
      case 0xa404:
        coordinates = [-212, 80, -128];
        break;
      case 0xa420:
        coordinates = [120, 40, 40];
        break;
      case 0xa804:
        coordinates = [-346, 0, 190];
        break;
      case 0xac04:
        coordinates = [-160, 288, -1225];
        break;
      case 0xb400:
        coordinates = [1068, 190, 1340];
        break;
      case 0xb800:
        coordinates = [1694, 0, -154];
        break;
      case 0xb804:
        coordinates = [1495, 292, 1010];
        break;
      case 0xb806:
        coordinates = [-194, 94, -1582];
        break;
      case 0xb814:
        coordinates = [-145, 4, 136];
        break;
      case 0xba08:
        coordinates = [-1395, 190, 395];
        break;
      case 0xba0c:
        coordinates = [804, 128, -228];
        break;
      case 0xba30:
        coordinates = [68, 256, 52];
        break;
      case 0xbc00:
        coordinates = [294, 94, -1264];
        break;
      case 0xc000:
        coordinates = [402, 332, -85];
        break;
      case 0xc004:
        coordinates = [-645, 256, 214];
        break;
      case 0xc400:
        coordinates = [-258, 62, -194];
        break;
      case 0xc404:
        coordinates = [0, 46, -1344];
        break;
      case 0xc408:
        coordinates = [-1072, 0, 1474];
        break;
      case 0xc800:
        coordinates = [448, 0, -1112];
        break;
      case 0xc804:
        coordinates = [-1305, 125, -1600];
        break;
      case 0xca00:
        coordinates = [-515, 46, -1021];
        break;
      case 0xca04:
        coordinates = [-188, 382, -1090];
        break;
      case 0xca08:
        coordinates = [-515, 46, -1021];
        break;
      case 0xca0c:
        coordinates = [-188, 382, -1090];
        break;
      case 0xcc04:
        coordinates = [410, 256, -452];
        break;
      case 0xcc06:
        coordinates = [410, 256, -452];
        break;
      case 0xd000:
        coordinates = [-700, 0, 478];
        break;
      case 0xd00c:
        coordinates = [-68, 114, 620];
        break;
      case 0xd400:
        coordinates = [-558, 192, -420];
        break;
      // case 0xd800:
      // case 0xd804:
      // case 0xd808:
      case 0xdc02:
        coordinates = [-90, 0, 430];
        break;
      case 0xdc08:
        coordinates = [-484, 262, 750];
        break;
      case 0xdc0c:
        coordinates = [1322, 262, -300];
        break;
      case 0xe004:
        coordinates = [98, 0, -592];
        break;
      case 0xe006:
        coordinates = [-346, 94, -965];
        break;
      case 0xe010:
        coordinates = [-760, 166, 1685];
        break;
    }

    setInt(itemInt.offset + 0x2, "uint16", coordinates[0]);
    setInt(itemInt.offset + 0x4, "uint16", coordinates[1]);
    setInt(itemInt.offset + 0x6, "uint16", coordinates[2]);

    setString(
      itemInt.offset - 0x20,
      0x1e,
      "uint8",
      $gameJson.resources?.locations[int] as string,
    );
  }
}
