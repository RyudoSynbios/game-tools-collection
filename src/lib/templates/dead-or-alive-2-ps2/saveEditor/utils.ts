import { get } from "svelte/store";

import { gameTemplate } from "$lib/stores";
import { getInt, setBitflag, setInt } from "$lib/utils/bytes";
import { formatChecksum } from "$lib/utils/checksum";
import {
  customGetRegions,
  repackMemoryCard,
  resetMemoryCard,
  unpackMemoryCard,
} from "$lib/utils/common/playstation2";
import { clone } from "$lib/utils/format";
import { getItem } from "$lib/utils/parser";

import type {
  Item,
  ItemBitflags,
  ItemBoolean,
  ItemChecksum,
  ItemInt,
  ItemSection,
  ItemTab,
} from "$lib/types";

export function beforeInitDataView(dataView: DataView): DataView {
  return unpackMemoryCard(dataView);
}

export function overrideGetRegions(): string[] {
  return customGetRegions();
}

export function onInitFailed(): void {
  resetMemoryCard();
}

export function overrideParseItem(item: Item & ItemSection): Item | ItemTab {
  const $gameTemplate = get(gameTemplate);

  if ("id" in item && item.id === "characterPercentageTag") {
    const itemTab = item as ItemTab;
    const itemSection = itemTab.items[0] as ItemSection;
    const itemInt = itemSection.items[0] as ItemInt;

    itemTab.items = [];

    const length = Object.keys($gameTemplate.resources!.charactersEnum).length;

    for (let i = 0; i < length; i += 1) {
      const newItemSection = clone(itemSection);

      newItemSection.name = `${$gameTemplate.resources!.charactersEnum[i]} & `;
      newItemSection.items = [];

      let baseOffset = itemInt.offset;

      for (let j = 0; j < length - 1; j += 1) {
        const characterIndex = j + (j >= i ? 1 : 0);
        const newItemInt = clone(itemInt);

        let offset = 0x0;

        if (j > 0 && j <= i) {
          baseOffset += (length - j) * 0x2;
        }

        if (i > j) {
          offset = (i - j - 1) * 0x2;
        }

        if (j > i) {
          offset = (j - i) * 0x2;
        }

        newItemInt.name = $gameTemplate.resources!.charactersEnum[
          characterIndex
        ] as string;
        newItemInt.offset = baseOffset + offset;

        newItemSection.items.push(newItemInt);
      }

      itemTab.items.push(newItemSection);
    }

    return itemTab;
  }

  return item;
}

export function overrideGetInt(item: Item): [boolean, boolean | undefined] {
  if ("id" in item && item.id?.match(/costume-/)) {
    const itemBoolean = item as ItemBoolean;

    const split = item.id.split("-");

    const index = parseInt(split[1]);

    const int = getInt(itemBoolean.offset, "uint8");

    const checked = index <= int;

    return [true, checked];
  }

  return [false, undefined];
}

export function overrideSetInt(item: Item, value: string): boolean {
  if ("id" in item && item.id?.match(/costume-/)) {
    const itemBoolean = item as ItemBoolean;

    const split = item.id.split("-");

    let int = parseInt(split[1]);

    if (!value) {
      int -= 1;
    }

    setInt(itemBoolean.offset, "uint8", int);

    return true;
  }

  return false;
}

export function afterSetInt(item: Item): void {
  if ("id" in item && item.id === "storyCompletion") {
    const itemInt = item as ItemInt;

    const isChecked = getInt(itemInt.offset, "uint8") > 0;

    setBitflag(itemInt.offset - 0xec8, 0, isChecked);
  } else if ("id" in item && item.id?.match(/item-/)) {
    const itemInt = item as ItemInt;

    const split = item.id.split("-");

    const collection = getItem("collection") as ItemBitflags;

    const offset = collection.flags[0].offset + parseInt(split[1]);
    const bit = parseInt(split[2]);
    const isChecked = getInt(itemInt.offset, "uint8") > 0;

    setBitflag(offset, bit, isChecked);
  }
}

export function generateChecksum(item: ItemChecksum): number {
  let checksum = 0x0;

  for (let i = item.control.offsetStart; i < item.control.offsetEnd; i += 0x1) {
    checksum ^= getInt(i, "uint8");
  }

  return formatChecksum(checksum, item.dataType);
}

export function beforeSaving(): ArrayBufferLike {
  return repackMemoryCard();
}

export function onReset(): void {
  resetMemoryCard();
}
