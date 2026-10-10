import { getInt } from "$lib/utils/bytes";

import type { ItemContainer } from "$lib/types";

export function overrideParseContainerItemsShifts(
  item: ItemContainer,
  shifts: number[],
  index: number,
): [boolean, number[] | undefined] {
  if (item.id === "slots") {
    let offset = -1;
    let bestSaveCount = 0;

    for (let i = 0x0; i < item.length * 0x6; i += item.length) {
      const saveIndex = getInt(0x20a2 + i, "uint8");
      const saveCount = getInt(0x208b + i, "uint8");
      const check = getInt(0x2080 + i, "uint32", { bigEndian: true });

      if (saveIndex === index && saveCount > bestSaveCount && check !== 0x0) {
        offset = i;
        bestSaveCount = saveCount;
      }
    }

    if (offset !== -1) {
      return [true, [...shifts, offset]];
    }

    return [true, [-1]];
  }

  return [false, undefined];
}
