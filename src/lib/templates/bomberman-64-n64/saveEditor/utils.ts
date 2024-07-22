import { getInt, setInt } from "$lib/utils/bytes";
import { formatChecksum } from "$lib/utils/checksum";
import { byteswapDataView, getHeaderShift } from "$lib/utils/common/nintendo64";

import type { Item, ItemChecksum, ItemInt } from "$lib/types";

export function initHeaderShift(dataView: DataView): number {
  return getHeaderShift(dataView, "eep");
}

export function beforeInitDataView(dataView: DataView): DataView {
  return byteswapDataView("eep", dataView);
}

export function overrideGetInt(item: Item): [boolean, number | undefined] {
  if ("id" in item && item.id?.match(/time-/)) {
    const itemInt = item as ItemInt;

    let int = getInt(itemInt.offset, "uint24", {
      bigEndian: itemInt.bigEndian,
    });

    if (item.id === "time-1") {
      int += (getInt(itemInt.offset + 0x6, "uint8") & 0x7) << 0x18;
    } else if (item.id === "time-2") {
      int += (getInt(itemInt.offset + 0x3, "uint8") & 0x38) << 0x15;
    }

    return [true, int];
  }

  return [false, undefined];
}

export function overrideSetInt(item: Item, value: string): boolean {
  if ("id" in item && item.id?.match(/time-/)) {
    const itemInt = item as ItemInt;

    let int = parseInt(value);

    setInt(itemInt.offset, "uint24", int, {
      bigEndian: itemInt.bigEndian,
    });

    int >>= 0x18;

    if (item.id === "time-1") {
      int += getInt(itemInt.offset + 0x6, "uint8") & 0x38;

      setInt(itemInt.offset + 0x6, "uint8", int);
    } else if (item.id === "time-2") {
      int = (int << 0x3) | (getInt(itemInt.offset + 0x3, "uint8") & 0x7);

      setInt(itemInt.offset + 0x3, "uint8", int);
    }

    return true;
  }

  return false;
}

export function generateChecksum(item: ItemChecksum): number {
  let checksum = 0xffff;

  for (let i = item.control.offsetStart; i < item.control.offsetEnd; i += 0x1) {
    checksum -= getInt(i, "uint8");
  }

  return formatChecksum(checksum, item.dataType);
}

export function beforeSaving(): ArrayBufferLike {
  return byteswapDataView("eep").buffer;
}
