import { get } from "svelte/store";

import { gameRegion } from "$lib/stores";
import { extractBinary, getInt, getString, setInt } from "$lib/utils/bytes";
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

import { cards } from "./utils/resource";

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
  } else if ("id" in item && item.id?.match(/empty-/)) {
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
        break;
      case 2:
        itemString.length = 0x10;
        itemString.encoding = "windows31J";
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
  } else if ("id" in item && item.id === "worldCards") {
    const itemBitflags = item as ItemBitflags;

    const offset = itemBitflags.flags[0].offset;

    const worlds: number[] = [];

    for (let i = 0x0; i < 0xc; i += 0x1) {
      const world = getInt(offset + 0x22e + i * 0x4, "uint8") - 0x1;

      worlds.push(world);
    }

    itemBitflags.flags = itemBitflags.flags.reduce(
      (flags: ItemBitflag[], flag, index) => {
        flags.push({
          ...flag,
          disabled: worlds.includes(index),
        });

        return flags;
      },
      [],
    );

    return itemBitflags;
  }

  return item;
}

export function overrideGetInt(item: Item): [boolean, number | undefined] {
  if ("id" in item && item.id?.match(/card-/)) {
    const itemInt = item as ItemInt;

    const isPremium = getInt(itemInt.offset + 0x1, "bit", { bit: 7 });

    let card = getInt(itemInt.offset, "uint16", { binary: itemInt.binary });

    if (isPremium) {
      card |= 0x1000;
    }

    return [true, card];
  }

  return [false, undefined];
}

export function overrideSetInt(item: Item, value: string): boolean {
  if ("id" in item && item.id?.match(/card-/)) {
    const itemInt = item as ItemInt;

    const isPremium = extractBinary(parseInt(value), 12, 1);

    setInt(itemInt.offset, "uint16", value, { binary: itemInt.binary });
    setInt(itemInt.offset + 0x1, "bit", isPremium, { bit: 7 });

    return true;
  }

  return false;
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
      updateCurrentFloor(itemInt.offset, slotIndex);
    } else if (type === "room") {
      const room = getInt(itemInt.offset, dataType);

      if (room === 0xfe) {
        setInt(itemInt.offset + 0x1, "uint8", 0x0);
      }

      updateCurrentFloor(itemInt.offset - 0x2, slotIndex);
    }
  } else if ("id" in item && item.id?.match(/deckName-/)) {
    const [slotIndex] = item.id.splitInt();

    updateResources("deckNames", getDeckNames(slotIndex));
  } else if ("id" in item && item.id?.match(/world-/)) {
    const itemInt = item as ItemInt;

    const [slotIndex, floor] = item.id.splitInt();

    const world = getInt(itemInt.offset, "uint8");

    const offset = itemInt.offset - 0x21a - floor * 0x4;

    if (getInt(offset - 0x7, "uint8") === floor) {
      setInt(offset, "uint8", world);

      updateCurrentFloor(offset, slotIndex);
    }
  }
}

export function generateChecksum(item: ItemChecksum): number {
  let checksum = 0x0;

  for (let i = item.control.offsetStart; i < item.control.offsetEnd; i += 0x2) {
    checksum %= 0xffff;
    checksum += getInt(i, "uint16");
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

export function getDeckCardNames(slotIndex: number): Resource {
  const names: Resource = {};

  const cardItem = getItem(`card-${slotIndex}-0`) as ItemInt;

  for (let i = 0x0; i < 0x3e7; i += 0x1) {
    const offset = cardItem.offset + i * 0x2;

    const isPremium = getInt(offset + 0x1, "bit", { bit: 7 });

    let card = getInt(offset, "uint16", { binary: cardItem.binary });

    if (isPremium) {
      card |= 0x1000;
    }

    if (card !== 0xfff) {
      names[i] = cards[card];
    }
  }

  names[0xffff] = "-";

  return names;
}

export function getDeckNames(slotIndex: number): Resource {
  const names: Resource = {};

  const deckItem = getItem(`deckName-${slotIndex}-0`) as ItemString;

  for (let i = 0x0; i < 0x3; i += 0x1) {
    names[i] = getString(
      deckItem.offset + i * 0xe0,
      deckItem.length,
      deckItem.letterDataType,
      {
        letterBigEndian: deckItem.letterBigEndian,
        encoding: deckItem.encoding,
        endCode: 0x0,
      },
    );
  }

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
    updateResources("getDeckCardNames", getDeckCardNames(slotIndex));
    updateResources("deckNames", getDeckNames(slotIndex));
  }
}

function updateCurrentFloor(offset: number, slotIndex: number): void {
  let world = getInt(offset, "uint8");

  const floor = getInt(offset - 0x7, "uint8");

  setInt(offset + 0x21a + floor * 0x4, "uint8", world);

  const room = getInt(offset + 0x2, "uint8");

  if (room === 0xfe) {
    world = 0x0;
  }

  setInt(offset - 0x8, "uint8", world);
  setInt(offset - 0xf, "uint8", world);

  const savePreviewOffset = getSavePreview(offset, slotIndex, "world");

  setInt(savePreviewOffset, "uint8", world);
}
