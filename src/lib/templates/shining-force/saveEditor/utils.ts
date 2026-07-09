import { get } from "svelte/store";

import { dataView, gameRegion } from "$lib/stores";
import {
  addPadding,
  bitToOffset,
  getInt,
  getString,
  removePadding,
  setInt,
} from "$lib/utils/bytes";
import { formatChecksum } from "$lib/utils/checksum";
import { getItem, getShift, updateResources } from "$lib/utils/parser";

import type {
  Item,
  ItemChecksum,
  ItemContainer,
  ItemInt,
  ItemString,
  Resource,
} from "$lib/types";

export function beforeInitDataView(dataView: DataView): DataView {
  return removePadding(dataView);
}

export function overrideParseItem(item: Item): Item {
  const $gameRegion = get(gameRegion);

  if ("id" in item && item.id?.match(/characterName-/) && $gameRegion === 1) {
    const itemString = item as ItemString;

    itemString.length = 0x5;
    itemString.letterIsAdaptive = true;
    itemString.regex = undefined;
    itemString.resource = "letters";

    return itemString;
  }

  return item;
}

export function overrideParseContainerItemsShifts(
  item: ItemContainer,
  shifts: number[],
  index: number,
): [boolean, number[] | undefined] {
  if (item.id === "slots") {
    const shift = getShift(shifts);

    const isActive = getInt(shift + 0x116, "bit", { bit: index + 1 });

    if (!isActive) {
      return [true, [-1]];
    }
  }

  return [false, undefined];
}

export function overrideItem(item: Item): Item {
  if ("id" in item && item.id?.match(/spellLevel|itemStatus/)) {
    const itemInt = item as ItemInt;

    const int = getInt(itemInt.offset, "uint8");

    itemInt.disabled = int === 0xff;

    return itemInt;
  }

  return item;
}

export function overrideGetInt(item: Item): [boolean, number | undefined] {
  if ("id" in item && item.id?.match(/formation-/)) {
    const itemInt = item as ItemInt;

    const [index] = item.id.splitInt();

    const formation = getFormation(itemInt.offset + bitToOffset(index) + 0x4fd);
    const hasJoigned = getInt(itemInt.offset, "bit", { bit: itemInt.bit });

    const status = hasJoigned + (formation.includes(index) ? 0x1 : 0x0);

    return [true, status];
  } else if ("id" in item && item.id?.match(/spellLevel|itemStatus/)) {
    const itemInt = item as ItemInt;

    if (itemInt.disabled) {
      return [true, 0x0];
    }
  }

  return [false, undefined];
}

export function overrideSetInt(item: Item, value: string): boolean {
  if ("id" in item && item.id === "spell") {
    const itemInt = item as ItemInt;

    const int = parseInt(value);

    const previous = getInt(itemInt.offset, "uint8", {
      binary: itemInt.binary,
    });

    if (int === 0x3f) {
      setInt(itemInt.offset, "uint8", 0x3, {
        binary: { bitStart: 6, bitLength: 2 },
      });
    } else if (previous === 0x3f) {
      setInt(itemInt.offset, "uint8", 0x0, {
        binary: { bitStart: 6, bitLength: 2 },
      });
    }

    setInt(itemInt.offset, "uint8", int, { binary: itemInt.binary });

    return true;
  } else if ("id" in item && item.id === "item") {
    const itemInt = item as ItemInt;

    const int = parseInt(value);

    const previous = getInt(itemInt.offset, "uint8", {
      binary: itemInt.binary,
    });

    if (int === 0x7f) {
      setInt(itemInt.offset, "bit", 1, { bit: 7 });
    } else if (previous === 0x7f) {
      setInt(itemInt.offset, "bit", 0, { bit: 7 });
    }

    setInt(itemInt.offset, "uint8", int, { binary: itemInt.binary });

    return true;
  } else if ("id" in item && item.id?.match(/formation-/)) {
    const itemInt = item as ItemInt;

    const [index] = item.id.splitInt();

    const status = parseInt(value);

    const offset = itemInt.offset + bitToOffset(index) + 0x4fd;

    setInt(itemInt.offset, "bit", status === 0x0 ? 0 : 1, { bit: itemInt.bit });

    updateFormation(offset, index, status);

    return true;
  }

  return false;
}

export function afterSetInt(item: Item): void {
  if ("id" in item && item.id === "chapter") {
    const itemInt = item as ItemInt;

    // Reset chapter progression

    setInt(itemInt.offset + 0x52, "uint16", 0x80);

    for (let i = 0x0; i < 0xd; i += 0x1) {
      setInt(itemInt.offset + 0x54 + i * 0x4, "uint32", 0x0);
    }
  } else if ("id" in item && item.id?.match(/characterName-/)) {
    const [slotIndex] = item.id.splitInt();

    updateCharacterNames(slotIndex);
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
  const $dataView = get(dataView);

  const paddedDataView = addPadding($dataView, 0xff);

  return paddedDataView.buffer;
}

export function getCharacterNames(slotIndex: number): Resource {
  if (typeof slotIndex === "string") {
    return {};
  }

  const names: Resource = {};

  const itemString = getItem(`characterName-${slotIndex}-0`) as ItemString;

  for (let i = 0x0; i < 0x1e; i += 0x1) {
    names[i] = getString(
      itemString.offset + i * 0x28,
      itemString.length,
      "uint8",
      {
        letterIsAdaptive: itemString.letterIsAdaptive,
        endCode: itemString.endCode,
        resource: itemString.resource,
      },
    );
  }

  return names;
}

function getFormation(offset: number): number[] {
  const characters: number[] = [];

  for (let i = 0x0; i < 0xc; i += 0x1) {
    const characterIndex = getInt(offset + i, "uint8");

    characters.push(characterIndex);
  }

  return characters;
}

function updateFormation(
  offset: number,
  characterIndex: number,
  status: number,
): void {
  const formation = getFormation(offset);

  const index = formation.findIndex((index) => index === characterIndex);

  if (status === 0x2 && index === -1) {
    formation[formation.length - 1] = characterIndex;
  } else if (status !== 0x2 && index !== -1) {
    formation[index] = 0xff;
  }

  formation
    .sort((a, b) => a - b)
    .forEach((characterIndex, index) => {
      setInt(offset + index, "uint8", characterIndex);
    });
}

export function onSlotChange(slotIndex: number): void {
  updateCharacterNames(slotIndex);
}

export function updateCharacterNames(slotIndex: number): void {
  const values = getCharacterNames(slotIndex);

  updateResources("characterNames", values);
}
