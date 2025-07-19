import { get } from "svelte/store";

import { gameRegion } from "$lib/stores";
import { getInt, getString, setInt } from "$lib/utils/bytes";
import { formatChecksum } from "$lib/utils/checksum";
import { getHeaderShift } from "$lib/utils/common/gameBoyAdvance";
import { getItem, updateResources } from "$lib/utils/parser";

import type {
  Item,
  ItemBitflag,
  ItemBitflags,
  ItemChecksum,
  ItemContainer,
  ItemInt,
  ItemString,
  ItemTab,
  ItemTabs,
  Resource,
} from "$lib/types";

export function initHeaderShift(dataView: DataView): number {
  return getHeaderShift(dataView);
}

export function overrideParseContainerItemsShifts(
  item: ItemContainer,
  shifts: number[],
  index: number,
): [boolean, number[] | undefined] {
  if (item.id === "slots") {
    if (index === 3) {
      return [true, [...shifts, 0x2e88]];
    }
  }

  return [false, undefined];
}

export function overrideParseItem(item: Item): Item | ItemTab {
  const $gameRegion = get(gameRegion);

  if ("id" in item && item.id?.match(/checksumSlots-/)) {
    const itemChecksum = item as ItemChecksum;

    const [slotIndex] = item.id.splitInt();

    if (getCharacter(slotIndex) === "sora") {
      itemChecksum.control.offsetEnd = itemChecksum.control.offsetStart + 0xf14;

      return itemChecksum;
    }
  } else if ("id" in item && item.id?.match(/soraOnly-/)) {
    const itemInt = item as ItemInt;

    const [slotIndex] = item.id.splitInt();

    itemInt.hidden = getCharacter(slotIndex) !== "sora";

    return itemInt;
  } else if ("id" in item && item.id?.match(/rikuOnly-/)) {
    const itemInt = item as ItemInt;

    const [slotIndex] = item.id.splitInt();

    itemInt.hidden = getCharacter(slotIndex) !== "riku";

    return itemInt;
  } else if ("id" in item && item.id?.match(/progression-/)) {
    const itemInt = item as ItemInt;

    const [slotIndex] = item.id.splitInt();

    const character = getCharacter(slotIndex);

    itemInt.resource = `${character}Progressions`;

    return itemInt;
  } else if ("id" in item && item.id?.match(/floor-/)) {
    const itemInt = item as ItemInt;

    const [slotIndex] = item.id.splitInt();

    const character = getCharacter(slotIndex);

    itemInt.resource = `${character}Floors`;

    return itemInt;
  } else if ("id" in item && item.id?.match(/cards-/)) {
    const itemTabs = item as ItemTabs;

    const [slotIndex] = item.id.splitInt();

    if (getCharacter(slotIndex) === "riku") {
      itemTabs.items = [];
      itemTabs.hidden = true;
    }

    return itemTabs;
  } else if ("id" in item && item.id?.match(/deckName-/)) {
    const itemString = item as ItemString;

    switch ($gameRegion) {
      case 1:
        itemString.length = 0x10;
        itemString.letterDataType = "uint16";
        itemString.encoding = undefined;
        // itemString.regex = undefined;
        break;
      case 2:
        itemString.length = 0x10;
        itemString.letterDataType = "uint16";
        itemString.letterBigEndian = true;
        itemString.encoding = "windows31J";
        // itemString.regex = undefined;
        break;
    }

    return itemString;
  } else if ("id" in item && item.id?.match(/journal-/)) {
    const itemTab = item as ItemTab;

    const [slotIndex] = item.id.splitInt();

    if (getCharacter(slotIndex) === "riku") {
      itemTab.name = "D Report";
    }

    return itemTab;
  } else if ("id" in item && item.id?.match(/worlds-/)) {
    const itemContainer = item as ItemContainer;

    const [slotIndex] = item.id.splitInt();

    if (getCharacter(slotIndex) === "sora") {
      itemContainer.instances = 13;
      itemContainer.resource = "soraFloors";
    }
  }

  return item;
}

export function overrideItem(item: Item): Item {
  if ("id" in item && item.id?.match(/friends-/)) {
    const itemBitflags = item as ItemBitflags;

    const count = getInt(itemBitflags.flags[0].offset, "uint8").toBitCount();

    itemBitflags.flags = itemBitflags.flags.reduce(
      (flags: ItemBitflag[], flag) => {
        const checked = getInt(flag.offset, "bit", { bit: flag.bit });

        flags.push({
          ...flag,
          disabled: !checked && count === 3,
        });

        return flags;
      },
      [],
    );

    return itemBitflags;
  }

  return item;
}

export function afterSetInt(item: Item): void {
  if ("id" in item && item.id?.match(/savePreview-/)) {
    const itemInt = item as ItemInt;

    const [, type] = item.id.split("-");
    const [slotIndex] = item.id.splitInt();

    const dataType = itemInt.dataType as "uint8" | "uint16";

    const int = getInt(itemInt.offset, dataType);

    const offset = getSavePreview(itemInt.offset, slotIndex, type);

    setInt(offset, dataType, int);

    if (type === "floor") {
      setInt(itemInt.offset - 0x9, dataType, int);
    } else if (type === "world") {
      setInt(itemInt.offset - 0x8, dataType, int);
      setInt(itemInt.offset - 0xf, dataType, int);
    }
  } else if ("id" in item && item.id?.match(/deckName-/)) {
    const [slotIndex] = item.id.splitInt();

    updateResources("deckNames", getDeckNames(slotIndex));
  }
}

export function generateChecksum(item: ItemChecksum): number {
  let checksum = 0x0;

  for (let i = item.control.offsetStart; i < item.control.offsetEnd; i += 0x2) {
    checksum += getInt(i, "uint16");
  }

  while (checksum > 0xffff) {
    checksum = (checksum & 0xffff) + (checksum >> 0x10);
  }

  checksum ^= 0xffff;

  return formatChecksum(checksum, item.dataType);
}

function getCharacter(slotIndex: number): "riku" | "sora" {
  if (slotIndex >= 2) {
    return "sora";
  }

  return "riku";
}

export function getDeckNames(slotIndex: number): Resource {
  const names: Resource = {};

  const deckItem = getItem(`deckName-${slotIndex}-0`) as ItemString;

  [...Array(3).keys()].forEach((index) => {
    const name = getString(
      deckItem.offset + index * 0xe0,
      deckItem.length,
      deckItem.letterDataType,
      {
        letterBigEndian: deckItem.letterBigEndian,
        encoding: deckItem.encoding,
        zeroTerminated: true,
      },
    );

    names[index] = name;
  });

  return names;
}

function getSavePreview(
  offset: number,
  slotIndex: number,
  type: string,
): number {
  offset -= 0x1e90 + 0x830 * slotIndex;

  if (slotIndex === 3) {
    offset -= 0x15f8;
  }

  console.log(offset.toHex());

  switch (type) {
    case "floor":
      offset -= 0xb5;
      break;
    case "world":
      offset -= 0xbb;
      break;
    case "level":
      offset -= 0x2e;
      break;
    case "playtime":
      offset -= 0xac;
      break;
  }

  return offset + getShiftedSlot(slotIndex) * 0x8;
}

// Character slots are reversed on save preview
function getShiftedSlot(slotIndex: number): number {
  return (slotIndex + 2) % 4;
}

export function onSlotChange(slotIndex: number): void {
  slotIndex = getShiftedSlot(slotIndex - 1);

  if ([2, 3].includes(slotIndex)) {
    updateResources("deckNames", getDeckNames(slotIndex));
  }
}
