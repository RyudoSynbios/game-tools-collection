import { get } from "svelte/store";

import { gameRegion, gameTemplate } from "$lib/stores";
import { getInt, setInt } from "$lib/utils/bytes";
import { formatChecksum } from "$lib/utils/checksum";
import {
  customGetRegions,
  getSaves,
  getSlotShifts,
  isUnpackedMemorySystem,
  repackMemorySystem,
  resetMemorySystem,
  unpackMemorySystem,
} from "$lib/utils/common/saturn";
import { clone, getRegionArray } from "$lib/utils/format";
import { getItem } from "$lib/utils/parser";

import type {
  Item,
  ItemChecksum,
  ItemContainer,
  ItemInt,
  ItemSection,
  ItemTab,
  ItemTabs,
  Resource,
  ResourceGroups,
} from "$lib/types";

export function beforeInitDataView(dataView: DataView): DataView {
  return unpackMemorySystem(dataView);
}

export function overrideGetRegions(dataView: DataView): string[] {
  const $gameTemplate = get(gameTemplate);

  const regions = customGetRegions();

  if (regions.length > 0) {
    return regions;
  }

  // const itemContainer = $gameTemplate.items[0] as ItemContainer;

  // // Check if save is a hook file
  // for (let i = 0x0; i < 0x3; i += 0x1) {
  //   const itemChecksum = clone(itemContainer.items[0]) as ItemChecksum;

  //   itemChecksum.offset -= 0x10;
  //   itemChecksum.control.offsetStart -= 0x10;
  //   itemChecksum.control.offsetEnd = [0x3288, 0x3f98, 0x5f38][i] - 0x10;

  //   if (dataView.byteLength < itemChecksum.control.offsetEnd) {
  //     return [];
  //   }

  //   const checksum = generateChecksum(itemChecksum, dataView);

  //   if (
  //     checksum ===
  //     getInt(itemChecksum.offset, "uint32", { bigEndian: true }, dataView)
  //   ) {
  //     switch (i) {
  //       case 0x0:
  //         return ["scenario1"];
  //       case 0x1:
  //         return ["scenario2"];
  //       case 0x2:
  //         return ["scenario3"];
  //     }
  //   }
  // }

  return [];
}

export function onInitFailed(): void {
  resetMemorySystem();
}

export function overrideParseItem(item: Item & ItemTab): Item | ItemTab {
  if ("id" in item && item.id === "slots" && isUnpackedMemorySystem()) {
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
  const $gameRegion = get(gameRegion);

  if (item.id === "slots") {
    if (isUnpackedMemorySystem()) {
      return getSlotShifts(index);
    }

    // return [true, [-0x10]];
  }

  return [false, undefined];
}

export function overrideGetInt(item: Item): [boolean, number | undefined] {
  if ("id" in item && item.id === "formation") {
    const itemInt = item as ItemInt;

    const joined = getInt(itemInt.offset, "bit", { bit: itemInt.bit });
    const leadTeam = getInt(itemInt.offset + 0x2, "bit", { bit: itemInt.bit });

    const int = joined + leadTeam * 2;

    return [true, int];
  }

  return [false, undefined];
}

export function overrideSetInt(item: Item, value: string): boolean {
  if ("id" in item && item.id === "formation") {
    const itemInt = item as ItemInt;

    const int = parseInt(value);

    setInt(itemInt.offset, "bit", int & 0x1, { bit: itemInt.bit });
    setInt(itemInt.offset + 0x2, "bit", int >> 0x1, { bit: itemInt.bit });

    return true;
  }

  return false;
}

export function generateChecksum(
  item: ItemChecksum,
  dataView?: DataView,
): number {
  let checksum = 0x0;

  for (let i = item.control.offsetStart; i < item.control.offsetEnd; i += 0x1) {
    checksum += getInt(i, "uint8", {}, dataView);
  }

  return formatChecksum(checksum, item.dataType);
}

export function beforeSaving(): ArrayBufferLike {
  return repackMemorySystem();
}

export function onReset(): void {
  resetMemorySystem();
}
