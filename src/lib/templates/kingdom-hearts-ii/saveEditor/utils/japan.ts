import type { Item, ItemChecksum, ItemContainer } from "$lib/types";

export function japanParseItemAdaptater(item: Item): Item {
  if (item.type === "bitflags") {
    item.flags.forEach((flag) => {
      flag.offset = getShift(flag.offset);
    });
  } else if ("offset" in item) {
    item.offset = getShift(item.offset);
  }

  if ("id" in item && item.id === "checksum") {
    const itemChecksum = item as ItemChecksum;

    itemChecksum.control.offsetEnd += 0x350;

    return itemChecksum;
  } else if ("id" in item && item.id === "party") {
    const itemContainer = item as ItemContainer;

    itemContainer.length = 0x100;

    return itemContainer;
  }

  return item;
}

const shifts = [
  { offset: 0x22c4, shift: 0x9c },
  { offset: 0x3000, shift: 0x100 },
  { offset: 0x324c, shift: 0x104 },
  { offset: 0x370c, shift: 0x1c },
  { offset: 0x3714, shift: 0x20 },
  { offset: 0x3728, shift: 0x20 },
  { offset: 0x38f0, shift: 0x20 },
  { offset: 0x3a1c, shift: 0x34 },
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
