import { get } from "svelte/store";

import { gameRegion, gameTemplate } from "$lib/stores";
import { getInt, setInt } from "$lib/utils/bytes";
import { formatChecksum } from "$lib/utils/checksum";
import {
  customGetRegions,
  getSaves,
  getSlots,
  repackMemorySystem,
  resetMemorySystem,
  unpackMemorySystem,
} from "$lib/utils/common/saturn";
import { clone } from "$lib/utils/format";

import type {
  Item,
  ItemChecksum,
  ItemContainer,
  ItemInt,
  ItemTab,
} from "$lib/types";

export function beforeInitDataView(dataView: DataView): DataView {
  return unpackMemorySystem(dataView);
}

export function overrideGetRegions(): string[] {
  return customGetRegions();
}

export function onInitFailed(): void {
  resetMemorySystem();
}

export function overrideParseItem(
  item: Item & ItemTab,
  instanceIndex: number,
): Item | ItemTab {
  const $gameTemplate = get(gameTemplate);

  if ("id" in item && item.id === "slots") {
    const itemContainer = item as ItemContainer;

    const saves = getSaves();

    itemContainer.instances = saves.length;
  } else if ("id" in item && item.id === "friendship") {
    const itemTab = item as ItemTab;
    const itemInt = itemTab.items[0] as ItemInt;

    itemTab.items = [];

    let offset =
      itemInt.offset + instanceIndex * (Math.max(0, instanceIndex - 1) / 2);

    for (
      let i = 0;
      i < Object.keys($gameTemplate.resources!.characters).length - 1;
      i += 1
    ) {
      const characterIndexReached = i >= instanceIndex;
      const characterIndex = i + (characterIndexReached ? 1 : 0);
      const newItemInt = clone(itemInt);

      if (i > 0 && (!characterIndexReached || i === instanceIndex)) {
        offset += 1;
      }

      if (characterIndexReached) {
        offset += characterIndex - 1;
      }

      newItemInt.name = $gameTemplate.resources!.characters[
        characterIndex
      ] as string;
      newItemInt.offset = offset;

      itemTab.items.push(newItemInt);
    }

    return itemTab;
  }

  return item;
}

export function overrideParseContainerItemsShifts(
  item: ItemContainer,
  shifts: number[],
  index: number,
): [boolean, number[] | undefined] {
  if (item.id === "slots") {
    return getSlots(index);
  }

  return [false, undefined];
}

export function afterSetInt(item: Item): void {
  if ("id" in item && item.id === "location") {
    const itemInt = item as ItemInt;

    const value = getInt(itemInt.offset, "uint8");

    setInt(itemInt.offset + 0x4, "uint8", value);
  }
}

export function generateChecksum(item: ItemChecksum): number {
  let checksum = 0x0;

  for (let i = item.control.offsetStart; i < item.control.offsetEnd; i += 0x1) {
    checksum += getInt(i, "uint8");
  }

  return formatChecksum(checksum, item.dataType);
}

export function beforeSaving(): ArrayBufferLike {
  return repackMemorySystem();
}

export function onReset(): void {
  resetMemorySystem();
}
