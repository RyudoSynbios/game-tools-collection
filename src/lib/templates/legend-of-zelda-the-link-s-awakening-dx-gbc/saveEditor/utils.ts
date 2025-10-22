import { getInt, setInt } from "$lib/utils/bytes";

import type { Item, ItemInt, Resource } from "$lib/types";

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

export function getLocationNames(): Resource {
  const names: Resource = {};

  for (let column = 0; column < 16; column += 1) {
    for (let row = 0; row < 16; row += 1) {
      const index = (column << 0x4) | row;

      names[index] = `${String.fromCharCode(0x41 + column)}${row + 1}`;
    }
  }

  return names;
}
