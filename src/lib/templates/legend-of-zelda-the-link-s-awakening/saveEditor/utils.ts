import { get } from "svelte/store";

import { fileHeaderShift } from "$lib/stores";
import { checkValidator, getRegionValidator } from "$lib/utils/validator";

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
