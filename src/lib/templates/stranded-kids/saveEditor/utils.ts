import { getInt } from "$lib/utils/bytes";
import { formatChecksum } from "$lib/utils/checksum";
import { getShift } from "$lib/utils/parser";

import type { ItemChecksum, ItemContainer } from "$lib/types";

export function overrideParseContainerItemsShifts(
  item: ItemContainer,
  shifts: number[],
  index: number,
): [boolean, number[] | undefined] {
  if (item.id === "slots") {
    const shift = getShift(shifts);

    const slots = getInt(shift + 0x4500, "uint8");

    const indexes = [1, 2, 3, 0];

    index = indexes[index];

    if (slots & (1 << index)) {
      return [true, [...shifts, (index === 3 ? 4 : index) * item.length]];
    }

    return [true, [-1]];
  }

  return [false, undefined];
}

export function generateChecksum(item: ItemChecksum): number {
  let checksum = 0x0;

  for (let i = item.control.offsetStart; i < item.control.offsetEnd; i += 0x1) {
    checksum += getInt(i, "uint8");
  }

  return formatChecksum(checksum, item.dataType);
}
