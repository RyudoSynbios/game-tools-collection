import { getInt, setInt } from "$lib/utils/bytes";

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
  let checksumByte1 = 0x00;
  let checksumByte2 = 0x00;

  for (
    let i = item.control.offset;
    i < item.control.offset + item.control.length;
    i += 0x1
  ) {
    if (i >= item.offset + 0x2) {
      if (i % 2 === 0) {
        checksumByte1 += getInt(i, "uint8");
      } else {
        checksumByte2 += getInt(i, "uint8");
      }
    }
  }

  let carry1 = 1;
  let carry2 = 1;

  while (carry1 + carry2 > 0) {
    carry1 = checksumByte1 >> 8;
    checksumByte1 -= carry1 << 8;
    checksumByte2 += carry1;

    carry2 = checksumByte2 >> 8;
    checksumByte2 -= carry2 << 8;
    checksumByte1 += carry2;
  }

  const checksum = (checksumByte2 << 8) + checksumByte1;

  return checksum;
}
