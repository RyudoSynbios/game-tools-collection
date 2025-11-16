import { get } from "svelte/store";

import { dataView, fileHeaderShift } from "$lib/stores";
import { getInt, setInt } from "$lib/utils/bytes";
import {
  customGetRegions,
  extractCastlevaniaCollectionSaves,
  getShifts,
  injectCastlevaniaCollectionSaves,
  isCastlevaniaCollectionSave,
  resetState,
} from "$lib/utils/common/castlevania";
import {
  generateBiosChecksum,
  getHeaderShift,
} from "$lib/utils/common/nintendoDs";
import { getItem } from "$lib/utils/parser";

import type {
  Item,
  ItemBitflag,
  ItemBitflagChecked,
  ItemBitflags,
  ItemChecksum,
  ItemInt,
} from "$lib/types";

const GAME = "dos";

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

export function overrideGetInt(
  item: Item,
): [boolean, ItemBitflagChecked[] | undefined] {
  if ("id" in item && item.id === "abilities") {
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

export function afterSetInt(item: Item, flag: ItemBitflag): void {
  if ("id" in item && item.id?.match(/gold-/)) {
    const itemInt = item as ItemInt;

    const value = getInt(itemInt.offset, "uint32");

    const goldSp = getItem(item.id.replace("gold", "goldSp")) as ItemInt;

    if (goldSp) {
      setInt(goldSp.offset, "uint32", value);
    }
  } else if ("id" in item && item.id?.match(/location-/)) {
    const itemInt = item as ItemInt;

    const int = getInt(itemInt.offset, "uint8");

    let value = int;

    switch (int) {
      case 0x1:
        value = 0x4;
        break;
      case 0x2:
        value = 0x1;
        break;
      case 0x3:
        value = 0x2;
        break;
      case 0x4:
        value = 0x3;
        break;
      case 0x7:
        value = 0x8;
        break;
      case 0x8:
        value = 0x9;
        break;
      case 0x9:
        value = 0x7;
        break;
    }

    const locationSp = getItem(
      item.id.replace("location", "locationSp"),
    ) as ItemInt;

    if (locationSp) {
      setInt(locationSp.offset, "uint8", value);
    }
  } else if ("id" in item && item.id?.match(/level-/)) {
    const itemInt = item as ItemInt;

    const value = getInt(itemInt.offset, "uint8");

    const levelSp = getItem(item.id.replace("level", "levelSp")) as ItemInt;

    if (levelSp) {
      setInt(levelSp.offset, "uint8", value);
    }
  } else if ("id" in item && item.id === "abilities") {
    const isChecked = Boolean(getInt(flag.offset, "bit", { bit: flag.bit }));

    setInt(
      flag.offset,
      flag.bit === 0 ? "lower4" : "upper4",
      isChecked ? 1 : 0,
    );
  }
}

export function generateChecksum(item: ItemChecksum): number {
  const $fileHeaderShift = get(fileHeaderShift);

  if (isCastlevaniaCollectionSave(GAME)) {
    return 0x0;
  }

  let offset = $fileHeaderShift + 0x90;

  if (item.id?.match(/checksumSlot-/)) {
    const [index] = item.id.splitInt();

    offset += (index + 1) * 0x4;
  }

  const salt = getInt(offset, "uint16");

  return generateBiosChecksum(item, salt);
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
