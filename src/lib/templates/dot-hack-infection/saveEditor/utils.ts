import { get } from "svelte/store";

import { gameRegion } from "$lib/stores";
import { copyInt, getInt, setInt } from "$lib/utils/bytes";
import { formatChecksum } from "$lib/utils/checksum";
import {
  customGetRegions,
  getRegionSaves,
  getSlotShifts,
  repackFile,
  resetState,
  unpackFile,
  type Save,
} from "$lib/utils/common/playstation2";
import { isInRange } from "$lib/utils/format";
import { getItem, getShift } from "$lib/utils/parser";

import type {
  Item,
  ItemBitflags,
  ItemChecksum,
  ItemContainer,
  ItemInt,
  ItemString,
  ItemTab,
  Resource,
} from "$lib/types";

import { mailList, players } from "./utils/resource";

export function beforeInitDataView(dataView: DataView): DataView {
  return unpackFile(dataView);
}

export function overrideGetRegions(): string[] {
  return customGetRegions();
}

export function onInitFailed(): void {
  resetState();
}

export function overrideParseItem(item: Item): Item {
  const $gameRegion = get(gameRegion);

  if ("id" in item && !isExtendedSave()) {
    if (item.id === "itemCompletionNpc") {
      const itemInt = item as ItemInt;

      itemInt.hidden = true;
    } else if (item.id === "memberAddresses") {
      const itemBitflags = item as ItemBitflags;

      itemBitflags.flags[18].hidden = true;
      itemBitflags.flags[19].hidden = true;
      itemBitflags.flags[20].hidden = true;
    } else if (item.id === "party") {
      const itemContainer = item as ItemContainer;

      itemContainer.instances = 18;
    } else if (item.id === "itemCompletionList") {
      const itemTab = item as ItemTab;

      itemTab.hidden = true;
    }
  }

  if ("id" in item && item.id?.match(/system-/)) {
    const [slotIndex] = item.id.splitInt();

    const save = getSlotSave(slotIndex);

    if (save) {
      if ("offset" in item) {
        item.offset += getSlotSystemOffset(slotIndex);
      }

      if (item.type === "checksum") {
        const itemChecksum = item as ItemChecksum;

        itemChecksum.control.offsetEnd = save.file.size;
      }
    }

    return item;
  } else if ("id" in item && item.id?.match(/name-/) && $gameRegion === 2) {
    const itemString = item as ItemString;

    const [, type] = item.id.split("-");

    if (type === "character") {
      itemString.length = 0x10;
    }

    itemString.encoding = "windows31J";
    itemString.regex = undefined;

    return itemString;
  } else if ("id" in item && item.id === "ryuBook3") {
    const itemTab = item as ItemTab;

    if (isExtendedSave()) {
      players.sort((a, b) => a.order - b.order);
    }

    itemTab.items.map((subitem, index) => {
      const itemInt = subitem as ItemInt;

      itemInt.name = `${(index + 1).leading0()} ${players[index].name}`;
      itemInt.offset += index;

      if (isExtendedSave()) {
        if (isInRange(index, 0x11, 0x13)) {
          itemInt.offset += 0x240e - 0x11;
        } else if (isInRange(index, 0x14, 0x45)) {
          itemInt.offset -= 0x3;
        } else if (index >= 0x46) {
          itemInt.offset += 0x240e - 0x43;
        }
      } else {
        itemInt.hidden = index >= 67;
      }

      return itemInt;
    });
  } else if ("id" in item && item.id?.match(/affection-/)) {
    const itemInt = item as ItemInt;

    const [index] = item.id.splitInt();

    itemInt.hidden = index === 0;

    return itemInt;
  }

  return item;
}

export function overrideParseContainerItemsShifts(
  item: ItemContainer,
  shifts: number[],
  index: number,
): [boolean, number[] | undefined] {
  if (item.id === "slots") {
    const save = getSlotSave(index);

    const offset = getSlotSystemOffset(index);
    const isAllocated = getInt(offset, "uint8");

    if (save && isAllocated) {
      return [true, [...shifts, save.offset]];
    }

    return [true, [-1]];
  } else if (item.id === "party") {
    if (index >= 0x12) {
      return [true, [...shifts, 0x155c + (index - 0x12) * item.length]];
    }
  } else if (item.id?.match(/partyItems-/)) {
    const [characterIndex] = item.id.splitInt();

    const newShifts = [
      ...shifts.slice(0, -1),
      characterIndex * 0xa0,
      index * item.length,
    ];

    if (characterIndex >= 0x12) {
      newShifts.push(0x79c0);
    }

    return [true, newShifts];
  }

  return [false, undefined];
}

export function overrideItem(item: Item): Item | ItemTab {
  if ("id" in item && item.id === "weapon") {
    const itemInt = item as ItemInt;

    const cClass = getInt(itemInt.offset + 0x8, "uint16");

    switch (cClass) {
      case 0x0:
        itemInt.resource = "tbWeapons";
        break;
      case 0x1:
        itemInt.resource = "bmWeapons";
        break;
      case 0x2:
        itemInt.resource = "hbWeapons";
        break;
      case 0x3:
        itemInt.resource = "haWeapons";
        break;
      case 0x4:
        itemInt.resource = "laWeapons";
        break;
      case 0x5:
        itemInt.resource = "wmWeapons";
        break;
    }

    return itemInt;
  }

  return item;
}

export function afterSetInt(item: Item): void {
  if ("id" in item && item.id?.match(/name-character-/)) {
    const itemString = item as ItemString;

    const [slotIndex] = item.id.splitInt();

    const nameItem = getItem(`system-${slotIndex}-name`) as ItemString;

    copyInt(itemString.offset, nameItem.offset, itemString.length);
  } else if ("id" in item && item.id?.match(/savePreview-/)) {
    const itemInt = item as ItemInt;

    const [, , type] = item.id.split("-");
    const [slotIndex, characterIndex] = item.id.splitInt();

    const intItem = getItem(`system-${slotIndex}-${type}`) as ItemInt;

    if (type === "playtime") {
      const playtime = getInt(itemInt.offset, "uint32");

      setInt(intItem.offset, "uint32", Math.min(playtime, 215999940));
    } else if (type === "level" && characterIndex === 0) {
      copyInt(itemInt.offset, intItem.offset);
    }
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
  return repackFile();
}

export function onReset(): void {
  resetState();
}

export function getMailNames(): Resource {
  const names: Resource = {};

  mailList.forEach((mail) => {
    if (mail.index < 0x148 || isExtendedSave())
      names[mail.index] = `${mail.author}: ${mail.subject}`;
  });

  names[0xffff] = "-";

  return names;
}

function getSlotSave(slotIndex: number): Save | undefined {
  const saves = getRegionSaves(true);

  return saves.find(
    (save) => save.file.name === `dhdata${(slotIndex + 1).leading0()}`,
  );
}

function getSlotSystemOffset(slotIndex: number): number {
  const shifts = getSlotShifts(0)[1];

  return getShift(shifts) + slotIndex * 0x1c;
}

function isExtendedSave(): boolean {
  const save = getSlotSave(0);

  if (save?.file.size === 0x8d84) {
    return true;
  }

  return false;
}
