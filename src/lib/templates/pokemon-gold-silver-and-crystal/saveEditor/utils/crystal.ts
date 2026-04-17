import { isInRange } from "$lib/utils/format";

import type { Item, ItemChecksum } from "$lib/types";

import { checksumShifts } from "../utils";

export function crystalParseItemAdaptater(item: Item): Item {
  if (item.type === "bitflags") {
    item.flags.forEach((flag) => {
      flag.offset = getShift(flag.offset);
    });
  } else if ("offset" in item) {
    item.offset = getShift(item.offset);
  }

  if ("id" in item && item.id === "checksum") {
    const itemChecksum = item as ItemChecksum;

    itemChecksum.offset += checksumShifts[2].offset;
    itemChecksum.control.offsetEnd += checksumShifts[2].offsetEnd;

    return itemChecksum;
  }

  return item;
}

const shifts = [
  { offset: 0x2050, shift: -0x1 },
  { offset: 0x23d8, shift: 0x2 },
  { offset: 0x2508, shift: -0x20 },
  { offset: 0x2700, shift: -0x5 },
  { offset: 0x2832, shift: 0x1 },
  { offset: 0x2865, shift: -0x2 },
];

function getShift(offset: number): number {
  if (isInRange(offset, 0x2000, 0x2c8b)) {
    shifts.forEach((step) => {
      if (offset >= step.offset) {
        offset += step.shift;
      }
    });
  } else if (isInRange(offset, 0x315e, 0x3e46)) {
    if (offset >= 0x321a) {
      offset += 0xa6;
    }
  }

  return offset;
}
