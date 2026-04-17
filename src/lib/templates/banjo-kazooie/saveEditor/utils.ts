import { get } from "svelte/store";

import { gameTemplate } from "$lib/stores";
import { getInt, setInt } from "$lib/utils/bytes";
import {
  byteswapDataView,
  generateRareChecksum,
  getHeaderShift,
} from "$lib/utils/common/nintendo64";
import { clone, makeOperations } from "$lib/utils/format";
import { getShift } from "$lib/utils/parser";

import type {
  Item,
  ItemChecksum,
  ItemContainer,
  ItemInt,
  ItemTab,
} from "$lib/types";

export function initHeaderShift(dataView: DataView): number {
  return getHeaderShift(dataView, "eep");
}

export function beforeInitDataView(dataView: DataView): DataView {
  return byteswapDataView("eep", dataView);
}

export function overrideGetRegions(
  dataView: DataView,
  shift: number,
): string[] {
  const $gameTemplate = get(gameTemplate);

  const itemContainer = $gameTemplate.items[0] as ItemContainer;
  const itemSubinstance = itemContainer.appendSubinstance![0] as ItemTab;
  const itemChecksum = clone(itemSubinstance.items[0] as ItemChecksum);

  itemChecksum.offset += shift;
  itemChecksum.control.offsetStart += shift;
  itemChecksum.control.offsetEnd += shift;

  if (dataView.byteLength < itemChecksum.control.offsetEnd) {
    return [];
  }

  const checksum = generateChecksum(itemChecksum, dataView);

  if (
    checksum ===
    getInt(itemChecksum.offset, "uint32", { bigEndian: true }, dataView)
  ) {
    return ["europe_usa_japan"];
  }

  return [];
}

export function overrideParseContainerItemsShifts(
  item: ItemContainer,
  shifts: number[],
  index: number,
): [boolean, number[] | undefined] {
  if (item.id === "slots") {
    for (let i = 0; i < item.instances + 1; i += 1) {
      let saveIndex = getInt(getShift(shifts) + i * item.length + 0x1, "uint8");

      if (saveIndex === 2) {
        saveIndex = 3;
      } else if (saveIndex === 3) {
        saveIndex = 2;
      }

      if (saveIndex === index + 1) {
        return [true, [...shifts, i * item.length]];
      }
    }
  }

  return [false, undefined];
}

export function overrideItem(item: Item): Item {
  if ("id" in item && item.id === "eggs") {
    const itemInt = item as ItemInt;

    const maxEggs = (getInt(itemInt.offset - 0xf, "bit", { bit: 6 }) + 1) * 100;

    itemInt.max = maxEggs;
  } else if ("id" in item && item.id === "redFeathers") {
    const itemInt = item as ItemInt;

    const maxRedFeathers =
      (getInt(itemInt.offset - 0x10, "bit", { bit: 7 }) + 1) * 50;

    itemInt.max = maxRedFeathers;
  } else if ("id" in item && item.id === "goldFeathers") {
    const itemInt = item as ItemInt;

    const maxGoldFeathers =
      (getInt(itemInt.offset - 0x10, "bit", { bit: 0 }) + 1) * 10;

    itemInt.max = maxGoldFeathers;
  }

  return item;
}

export function overrideGetInt(item: Item): [boolean, number | undefined] {
  if ("id" in item && item.id === "playtime") {
    const itemInt = item as ItemInt;

    let int = 0;

    for (let i = 0x0; i < 0xb; i += 0x1) {
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
  } else if ("id" in item && item.id === "totalJiggies") {
    const itemInt = item as ItemInt;

    let int = 0;

    for (let i = 0x0; i < 0xd; i += 0x1) {
      int += getInt(itemInt.offset + i, "uint8").toBitCount();
    }

    return [true, int];
  } else if ("id" in item && item.id === "totalNotes") {
    const itemInt = item as ItemInt;

    let binary = "";

    for (let i = 0x0; i < 0x8; i += 0x4) {
      binary += getInt(itemInt.offset + i, "uint32", {
        bigEndian: true,
      }).toBinary(32);
    }

    binary = binary.substring(1);

    let int = 0;

    for (let i = 0; i < 9; i += 1) {
      int += parseInt(binary.substring(i * 7, (i + 1) * 7), 2);
    }

    return [true, int];
  }

  return [false, undefined];
}

export function afterSetInt(item: Item): void {
  if ("id" in item && item.id === "maxEggs") {
    const itemInt = item as ItemInt;

    let eggs = getInt(itemInt.offset + 0xf, "uint8");
    const maxEggs = (getInt(itemInt.offset, "bit", { bit: 6 }) + 1) * 100;

    eggs = Math.min(eggs, maxEggs);

    setInt(itemInt.offset + 0xf, "uint8", eggs);
  } else if ("id" in item && item.id === "maxRedFeathers") {
    const itemInt = item as ItemInt;

    let redFeathers = getInt(itemInt.offset + 0x10, "uint8");
    const maxRedFeathers = (getInt(itemInt.offset, "bit", { bit: 7 }) + 1) * 50;

    redFeathers = Math.min(redFeathers, maxRedFeathers);

    setInt(itemInt.offset + 0x10, "uint8", redFeathers);
  } else if ("id" in item && item.id === "maxGoldFeathers") {
    const itemInt = item as ItemInt;

    let goldFeathers = getInt(itemInt.offset + 0x10, "uint8");
    const maxGoldFeathers =
      (getInt(itemInt.offset, "bit", { bit: 0 }) + 1) * 10;

    goldFeathers = Math.min(goldFeathers, maxGoldFeathers);

    setInt(itemInt.offset + 0x10, "uint8", goldFeathers);
  }
}

export function generateChecksum(
  item: ItemChecksum,
  dataView?: DataView,
): number {
  const [, checksum2] = generateRareChecksum(item, dataView);

  const checksum = checksum2.toString(16).padStart(8, "0").slice(-8);

  return parseInt(`0x${checksum}`);
}

export function beforeSaving(): ArrayBufferLike {
  return byteswapDataView("eep").buffer;
}
