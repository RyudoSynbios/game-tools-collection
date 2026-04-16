import { get } from "svelte/store";

import { gameTemplate } from "$lib/stores";
import { getInt, getString, setInt } from "$lib/utils/bytes";
import { formatChecksum } from "$lib/utils/checksum";
import { clone, isInRange } from "$lib/utils/format";
import { getItem, getShift, updateResources } from "$lib/utils/parser";
import { checkValidator } from "$lib/utils/validator";

import type {
  Item,
  ItemBitflags,
  ItemChecksum,
  ItemContainer,
  ItemInt,
  ItemString,
  Resource,
} from "$lib/types";

import { characterList, locationList } from "./utils/resource";

export function overrideGetRegions(
  dataView: DataView,
  shift: number,
): string[] {
  const $gameTemplate = get(gameTemplate);

  const itemContainer = $gameTemplate.items[0] as ItemContainer;

  // Temporary disable GBA compatibility
  if (isGBASave(dataView)) {
    return [];
  }

  for (let i = 0x0; i < itemContainer.instances; i += 0x1) {
    const itemChecksum = clone(itemContainer.items[0] as ItemChecksum);

    const tmpShift = shift + i * itemContainer.length;

    itemChecksum.offset += tmpShift;
    itemChecksum.control.offsetStart += tmpShift;
    itemChecksum.control.offsetEnd += tmpShift;

    if (dataView.byteLength < itemChecksum.control.offsetEnd) {
      return [];
    }

    const checksum = generateChecksum(itemChecksum, dataView);

    if (
      checksum !== 0x0 &&
      checksum === getInt(itemChecksum.offset, "uint16", {}, dataView)
    ) {
      return ["usa", "japan"];
    }
  }

  return [];
}

export function overrideParseContainerItemsShifts(
  item: ItemContainer,
  shifts: number[],
  index: number,
): [boolean, number[] | undefined] {
  if (item.id === "slots") {
    const shift = getShift(shifts);

    const level = getInt(shift + index * item.length + 0x8, "uint8");

    if (!isInRange(level, 1, 99)) {
      return [true, [-1]];
    }
  }

  return [false, undefined];
}

export function overrideItem(item: Item): Item {
  if ("id" in item && item.id?.match(/position-/)) {
    const itemInt = item as ItemInt;

    const [, type] = item.id.split("-");
    let [shift] = item.id.splitInt();

    if (type === "general") {
      shift *= -1;
    }

    const location = getInt(itemInt.offset + shift, "uint16") & 0x1ff;
    const isWorldmap = [0, 1].includes(location);

    itemInt.hidden =
      (type === "general" && isWorldmap) ||
      (type === "worldMap" && !isWorldmap);

    return itemInt;
  } else if ("id" in item && item.id?.match(/airshipCharacters-/)) {
    const itemBitflags = item as ItemBitflags;

    const [slotIndex] = item.id.splitInt();

    const names = getCharacterNames(slotIndex);

    const itemString = getItem(`characterName-${slotIndex}-0`) as ItemString;

    itemBitflags.flags = itemBitflags.flags.map((flag, index) => {
      const character = getInt(itemString.offset - 0x2 + index * 0x25, "uint8");

      return {
        ...flag,
        label: names[index],
        disabled: character === 0xff,
      };
    });

    return itemBitflags;
  } else if ("id" in item && item.id?.match(/spell-/)) {
    const itemInt = item as ItemInt;

    const [partyIndex, spellIndex] = item.id.splitInt();

    const shift = getSpellShift(itemInt.offset, partyIndex, spellIndex);

    itemInt.disabled = shift === -1;

    return itemInt;
  }

  return item;
}

export function overrideGetInt(item: Item): [boolean, number | undefined] {
  if ("id" in item && item.id?.match(/spell-/)) {
    const itemInt = item as ItemInt;

    const [partyIndex, spellIndex] = item.id.splitInt();

    const shift = getSpellShift(itemInt.offset, partyIndex, spellIndex);

    if (shift === -1) {
      return [true, 0];
    }

    let percent = getInt(itemInt.offset + shift, "uint8");

    if (percent === 0xff) {
      percent = 100;
    }

    return [true, percent];
  } else if ("id" in item && item.id?.match(/quantity-/)) {
    const itemInt = item as ItemInt;

    const [itemIndex] = item.id.splitInt();

    const inventory = getInventory(itemInt.offset - 0x100);

    const index = inventory.findIndex((index) => index === itemIndex);

    let quantity = 0;

    if (index !== -1) {
      quantity = getInt(itemInt.offset + index, "uint8");
    }

    return [true, quantity];
  }

  return [false, undefined];
}

export function overrideSetInt(item: Item, value: string): boolean {
  if ("id" in item && item.id?.match(/spell-/)) {
    const itemInt = item as ItemInt;

    const [partyIndex, spellIndex] = item.id.splitInt();

    let percent = parseInt(value);

    if (percent === 100) {
      percent = 0xff;
    }

    const shift = getSpellShift(itemInt.offset, partyIndex, spellIndex);

    setInt(itemInt.offset + shift, "uint8", percent);

    return true;
  } else if ("id" in item && item.id?.match(/quantity-/)) {
    const itemInt = item as ItemInt;

    const [itemIndex] = item.id.splitInt();

    const quantity = parseInt(value);

    updateInventory(itemInt.offset - 0x100, itemIndex, quantity);

    return true;
  }

  return false;
}

export function afterSetInt(item: Item): void {
  if ("id" in item && item.id === "location") {
    const itemInt = item as ItemInt;

    const locationIndex = getInt(itemInt.offset, "uint16", {
      binary: itemInt.binary,
    });

    const location = locationList.find(
      (location) => location.index === locationIndex,
    );

    if (location) {
      setInt(itemInt.offset + 0x5c, "uint8", location.coordinates[0]);
      setInt(itemInt.offset + 0x5d, "uint8", location.coordinates[1]);
    }
  } else if ("id" in item && item.id === "character") {
    const itemInt = item as ItemInt;

    const characterIndex = getInt(itemInt.offset, "uint8");

    const character = characterList.find(
      (character) => character.index === characterIndex,
    );

    if (character) {
      setInt(itemInt.offset + 0x1, "uint8", character.graphicSet);
    }
  } else if ("id" in item && item.id?.match(/characterName-/)) {
    const [slotIndex] = item.id.splitInt();

    updateCharacterNames(slotIndex);
  } else if ("id" in item && item.id === "characterGroup") {
    const itemInt = item as ItemInt;

    const group = getInt(itemInt.offset, "uint8", { binary: itemInt.binary });

    setInt(itemInt.offset, "bit", group !== 0 ? 1 : 0, { bit: 6 });
  }
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

export function isGBASave(dataView?: DataView): boolean {
  const validator = [
    0x46, 0x49, 0x4e, 0x41, 0x4c, 0x20, 0x46, 0x41, 0x4e, 0x54, 0x41, 0x53,
    0x59, 0x20, 0x56, 0x49, 0x20, 0x20, 0x20, 0x20, 0x20, 0x41, 0x44, 0x56,
    0x41, 0x4e, 0x43, 0x45, 0x20, 0x20, 0x20, 0x20,
  ]; // "FINAL FANTASY VI     ADVANCE    "

  return checkValidator(validator, 0x1f00, dataView);
}

export function getCharacterNames(slotIndex: number): Resource {
  if (typeof slotIndex === "string") {
    return {};
  }

  const names: Resource = {};

  const itemString = getItem(`characterName-${slotIndex}-0`) as ItemString;

  for (let i = 0x0; i < 0x10; i += 0x1) {
    names[i] = getString(
      itemString.offset + i * 0x25,
      itemString.length,
      itemString.letterDataType,
      {
        resource: itemString.resource,
      },
    );

    if (!names[i].trim()) {
      names[i] = "???";
    }
  }

  return names;
}

export function onSlotChange(slotIndex: number): void {
  updateCharacterNames(slotIndex);
}

export function updateCharacterNames(slotIndex: number): void {
  const values = getCharacterNames(slotIndex);

  updateResources("characterNames", values);
}

function getInventory(offset: number): number[] {
  const inventory: number[] = [];

  for (let i = 0x0; i < 0x100; i += 0x1) {
    const itemIndex = getInt(offset + i, "uint8");

    inventory.push(itemIndex);
  }

  return inventory;
}

function updateInventory(
  offset: number,
  itemIndex: number,
  value: number,
): void {
  const inventory = getInventory(offset);

  const index = inventory.findIndex((index) => index === itemIndex);

  if (value && index !== -1) {
    setInt(offset + 0x100 + index, "uint8", value);
  } else if (value) {
    const index = inventory.findIndex((index) => index === 0xff);

    if (index !== -1) {
      setInt(offset + index, "uint8", itemIndex);
      setInt(offset + 0x100 + index, "uint8", value);
    }
  } else if (index !== -1) {
    setInt(offset + index, "uint8", 0xff);
    setInt(offset + 0x100 + index, "uint8", 0x0);
  }
}

function getSpellShift(
  offset: number,
  partyIndex: number,
  spellIndex: number,
): number {
  offset = offset - 0x46e - spellIndex + partyIndex * 0x25;

  const characterIndex = getInt(offset, "uint8");

  if (characterIndex < 0xc) {
    return characterIndex * 0x36;
  }

  return -1;
}
