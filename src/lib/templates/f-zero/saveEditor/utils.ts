import { getInt, setInt } from "$lib/utils/bytes";
import { formatChecksum } from "$lib/utils/checksum";

import type { Item, ItemBitflag, ItemChecksum, ItemInt } from "$lib/types";

export function overrideItem(item: Item): Item {
  if ("id" in item && item.id === "car") {
    const itemInt = item as ItemInt;

    const isCleared = getInt(itemInt.offset, "bit", { bit: 7 });

    itemInt.disabled = !isCleared;
    itemInt.resource = isCleared ? "cars" : "empty";

    return itemInt;
  }

  return item;
}

export function overrideGetInt(item: Item): [boolean, number | undefined] {
  if ("id" in item && item.id === "car") {
    const itemInt = item as ItemInt;

    if (itemInt.disabled) {
      return [true, 0x0];
    }
  }

  return [false, undefined];
}

export function afterSetInt(item: Item, flag: ItemBitflag): void {
  if ("id" in item && item.id === "masterClass") {
    const int = getInt(flag.offset, "lower4");

    setInt(flag.offset, "upper4", int);
  } else if ("id" in item && item.id?.match(/time-/)) {
    const itemInt = item as ItemInt;

    const [shift] = item.id.splitInt();

    const time = getInt(itemInt.offset - shift, "uint24", {
      bigEndian: true,
      binary: { bitStart: 0, bitLength: 20 },
    });

    setInt(itemInt.offset - shift, "bit", time !== 0x95999 ? 1 : 0, { bit: 7 });
  }
}

export function generateChecksum(item: ItemChecksum): number {
  let checksum = 0x0;

  for (let i = item.control.offsetStart; i < item.control.offsetEnd; i += 0x1) {
    checksum += getInt(i, "uint8");
  }

  return formatChecksum(checksum, item.dataType);
}
