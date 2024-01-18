import { getInt, setInt } from "$lib/utils/bytes";
import { formatChecksum } from "$lib/utils/checksum";

import type { Item, ItemChecksum, ItemInt } from "$lib/types";

export function overrideGetInt(item: Item): [boolean, number | undefined] {
  if ("id" in item && item.id?.match(/wc-/)) {
    const itemInt = item as ItemInt;

    const int1 = getInt(itemInt.offset, "uint8");
    const int2 = getInt(itemInt.offset + 0x1, "uint8");

    let int = 0;

    if (item.id === "wc-red") {
      int = ((int1 & 0x1f) >> 2) + ((int1 & 0x1f) === 0x1f ? 0x1 : 0x0);
    } else if (item.id === "wc-green") {
      int =
        ((int2 & 0x3) << 1) +
        ((int1 & 0xe0) >> 7) +
        ((int1 & 0xe0) === 0xe0 ? 0x1 : 0x0);
    } else if (item.id === "wc-blue") {
      int = ((int2 & 0xfc) >> 4) + ((int2 & 0xfc) === 0x7c ? 0x1 : 0x0);
    }

    return [true, int];
  }

  return [false, undefined];
}

export function overrideSetInt(item: Item, value: string): boolean {
  if ("id" in item && item.id?.match(/wc-/)) {
    const itemInt = item as ItemInt;

    const int = parseInt(value);

    let value1 = getInt(itemInt.offset, "uint8");
    let value2 = getInt(itemInt.offset + 0x1, "uint8");

    if (item.id === "wc-red") {
      value1 = (value1 & 0xe0) + (int << 2) - (int === 8 ? 0x1 : 0x0);
    } else if (item.id === "wc-green") {
      value1 = (value1 & 0x1f) + ((int & 0x1) << 7) + (int === 8 ? 0xe0 : 0x0);
      value2 = (value2 & 0xfc) + (int >> 1) - (int === 8 ? 0x1 : 0x0);
    } else if (item.id === "wc-blue") {
      value2 = (value2 & 0x3) + (int << 4) - (int === 8 ? 0x4 : 0x0);
    }

    setInt(itemInt.offset, "uint8", value1);
    setInt(itemInt.offset + 0x1, "uint8", value2);

    return true;
  }

  return false;
}

export function afterSetInt(item: Item): void {
  if ("id" in item && item.id === "pStats") {
    const itemInt = item as ItemInt;

    const stat = getInt(itemInt.offset, "uint8");
    const previousStat = getInt(itemInt.offset - 0x26, "uint8");
    const equipmentStat = getInt(itemInt.offset - 0x2a, "uint8") - previousStat;

    setInt(itemInt.offset - 0x2a, "uint8", stat + equipmentStat);
    setInt(itemInt.offset - 0x26, "uint8", stat);
    setInt(itemInt.offset, "uint8", stat);
  }
}

export function generateChecksum(item: ItemChecksum): number {
  let checksum = 0x0;

  for (
    let i = item.control.offset;
    i < item.control.offset + item.control.length;
    i += 0x2
  ) {
    if (i >= item.offset + 0x2) {
      checksum += getInt(i, "uint16");
    }
  }

  while (checksum > 0x10000) {
    checksum = (checksum & 0xffff) + (checksum >> 16);
  }

  return formatChecksum(checksum, item.dataType);
}
