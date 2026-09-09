import type { Item, ItemString } from "$lib/types";

export function japanParseItemAdaptater(item: Item): Item {
  if (item.type === "checksum") {
    return item;
  }

  if (item.type === "bitflags") {
    item.flags.forEach((flag) => {
      flag.offset = getShift(flag.offset);
    });
  } else if ("offset" in item) {
    item.offset = getShift(item.offset);
  }

  if ("id" in item && item.id?.match(/name/)) {
    const itemString = item as ItemString;

    itemString.length = 0x8;
    itemString.fallback = 0x0;

    return itemString;
  }

  return item;
}

const shifts = [
  { offset: 0xd, shift: -0x3 },
  { offset: 0x631, shift: -0x38 },
  { offset: 0x6fe, shift: -0x4 },
  { offset: 0x80d, shift: -0xc },
  { offset: 0x86d, shift: -0xc },
  { offset: 0x8cd, shift: -0xc },
  { offset: 0x92d, shift: -0xc },
  { offset: 0x98d, shift: -0xc },
  { offset: 0x9ed, shift: -0xc },
  { offset: 0xa4d, shift: -0xc },
  { offset: 0xaad, shift: -0xc },
  { offset: 0xb6d, shift: -0x18 },
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
