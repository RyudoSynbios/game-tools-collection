import { get } from "svelte/store";

import { fileHeaderShift } from "$lib/stores";
import { getInt, setInt } from "$lib/utils/bytes";
import {
  checkValidator,
  getRegionName,
  getRegionValidator,
} from "$lib/utils/validator";

import type {
  Item,
  ItemContainer,
  ItemInt,
  ItemTab,
  Resource,
} from "$lib/types";

export function overrideParseItem(item: Item): Item {
  if ("id" in item && item.id === "slots") {
    const itemContainer = item as ItemContainer;

    if (isGBCSave()) {
      itemContainer.length = 0x3ad;
    }

    return itemContainer;
  } else if ("id" in item && item.id === "gbcOnly") {
    (item as ItemInt | ItemTab).hidden = !isGBCSave();
  } else if ("id" in item && item.id === "dungeons") {
    const itemContainer = item as ItemContainer;

    if (isGBCSave()) {
      itemContainer.instances = 9;
    }

    return itemContainer;
  }

  return item;
}

export function overrideItem(item: Item): Item {
  if ("id" in item && item.id === "health") {
    const itemInt = item as ItemInt;

    const maxHealth = getInt(itemInt.offset + 0x1, "uint8");

    itemInt.max = maxHealth;
  } else if (
    "id" in item &&
    (item.id === "magicPowder" || item.id === "bombs")
  ) {
    const itemInt = item as ItemInt;

    const max = getInt(itemInt.offset + 0x2a, "uint8");

    itemInt.max = max;
  } else if ("id" in item && item.id === "arrows") {
    const itemInt = item as ItemInt;

    const maxArrows = getInt(itemInt.offset + 0x33, "uint8");

    itemInt.max = maxArrows;
  }

  return item;
}

export function afterSetInt(item: Item): void {
  if ("id" in item && item.id === "maxHealth") {
    const itemInt = item as ItemInt;

    let health = getInt(itemInt.offset - 0x1, "uint8");
    const maxHealth = getInt(itemInt.offset, "uint8");

    health = Math.min(health, maxHealth * 8);

    setInt(itemInt.offset - 0x1, "uint8", health);
  } else if (
    "id" in item &&
    (item.id === "maxMagicPowder" || item.id === "maxBombs")
  ) {
    const itemInt = item as ItemInt;

    let value = getInt(itemInt.offset - 0x2a, "uint8");
    const max = getInt(itemInt.offset, "uint8");

    value = Math.min(value, max);

    setInt(itemInt.offset - 0x2a, "uint8", value);
  } else if ("id" in item && item.id === "maxArrows") {
    const itemInt = item as ItemInt;

    let arrows = getInt(itemInt.offset - 0x33, "uint8");
    const maxArrows = getInt(itemInt.offset, "uint8");

    arrows = Math.min(arrows, maxArrows);

    setInt(itemInt.offset - 0x33, "uint8", arrows);
  }
}

function isGBCSave(): boolean {
  const $fileHeaderShift = get(fileHeaderShift);

  const validator = getRegionValidator(0x100, 0);

  return checkValidator(validator, $fileHeaderShift + 0x4ad);
}

export function getLocationNames(): Resource {
  const names: Resource = {};

  for (let column = 0; column < 16; column += 1) {
    for (let row = 0; row < 16; row += 1) {
      const index = (column << 0x4) | row;

      names[index] = `${column.toLetter()}${row + 1}`;
    }
  }

  return names;
}
