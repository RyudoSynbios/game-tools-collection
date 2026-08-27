import type { Item, ItemContainer, ItemString } from "$lib/types";

import { isManiax } from "../utils";

export function asiaParseItemAdaptater(item: Item): Item {
  if (item.type === "bitflags") {
    item.flags.forEach((flag) => {
      flag.offset = getShift(flag.offset);
    });
  } else if ("offset" in item) {
    item.offset = getShift(item.offset);
  }

  if ("id" in item && item.id?.match(/^name-/)) {
    const itemString = item as ItemString;

    const [, type] = item.id.split("-");

    if (type !== "nickname") {
      itemString.length = 0x10;
    }

    itemString.resource = "letters";

    return itemString;
  } else if ("id" in item && item.id?.match(/compendium-/) && !isManiax()) {
    const itemContainer = item as ItemContainer;

    itemContainer.instances = 168;

    return itemContainer;
  }

  return item;
}

const shifts = [
  { offset: 0x24, shift: -0x4 },
  { offset: 0x657c, shift: -0x2400 },
  { offset: 0x65a4, shift: -0x10 },
  { offset: 0x65c4, shift: -0x10 },
  { offset: 0x65e4, shift: -0x10 },
  { offset: 0x6604, shift: -0x10 },
  { offset: 0x6624, shift: -0x10 },
  { offset: 0x6658, shift: 0x4 },
];

function getShift(baseOffset: number): number {
  let offset = baseOffset;

  shifts.forEach((step) => {
    if (baseOffset >= step.offset) {
      offset += step.shift;
    }
  });

  return offset;
}
