import { get } from "svelte/store";

import { gameTemplate } from "$lib/stores";
import { getInt, setInt } from "$lib/utils/bytes";
import { formatChecksum } from "$lib/utils/checksum";
import { byteswapDataView, getHeaderShift } from "$lib/utils/common/nintendo64";
import { clone } from "$lib/utils/format";

import type { Item, ItemChecksum, ItemInt, ItemSection } from "$lib/types";

export function initHeaderShift(dataView: DataView): number {
  return getHeaderShift(dataView, "sra");
}

export function beforeInitDataView(dataView: DataView): DataView {
  return byteswapDataView("sra", dataView);
}

export function overrideGetRegions(
  dataView: DataView,
  shift: number,
): string[] {
  const $gameTemplate = get(gameTemplate);

  const itemChecksum = clone(
    ($gameTemplate.items[0] as ItemSection).items[6],
  ) as ItemChecksum;

  itemChecksum.offset += shift;
  itemChecksum.control.offsetStart += shift;
  itemChecksum.control.offsetEnd += shift;

  const checksum = generateChecksum(itemChecksum, dataView);

  if (
    checksum ===
    getInt(itemChecksum.offset, "uint32", { bigEndian: true }, dataView)
  ) {
    return ["europe", "usa_japan"];
  }

  return [];
}

export function overrideGetInt(item: Item): [boolean, number | undefined] {
  if ("id" in item && item.id === "board") {
    const itemInt = item as ItemInt;

    const int = (getInt(itemInt.offset, "uint8") & 0xf8) >> 3;

    return [true, int];
  } else if ("id" in item && item.id === "rider") {
    const itemInt = item as ItemInt;

    const int = getInt(itemInt.offset, "uint8") & 0x7;

    return [true, int];
  } else if ("id" in item && item.id === "soundType") {
    const itemInt = item as ItemInt;

    const int = getInt(itemInt.offset, "uint8") & 0x3;

    return [true, int];
  } else if ("id" in item && item.id === "language") {
    const itemInt = item as ItemInt;

    const int = getInt(itemInt.offset, "uint8") & 0xfc;

    return [true, int];
  }

  return [false, undefined];
}

export function overrideSetInt(item: Item, value: string): boolean {
  if ("id" in item && item.id === "board") {
    const itemInt = item as ItemInt;

    const int =
      (getInt(itemInt.offset, "uint8") & 0x7) + (parseInt(value) << 3);

    setInt(itemInt.offset, "uint8", int);

    return true;
  } else if ("id" in item && item.id === "rider") {
    const itemInt = item as ItemInt;

    const int = (getInt(itemInt.offset, "uint8") & 0xf8) + parseInt(value);

    setInt(itemInt.offset, "uint8", int);

    return true;
  } else if ("id" in item && item.id === "soundType") {
    const itemInt = item as ItemInt;

    const int = (getInt(itemInt.offset, "uint8") & 0xfc) + parseInt(value);

    setInt(itemInt.offset, "uint8", int);

    return true;
  } else if ("id" in item && item.id === "language") {
    const itemInt = item as ItemInt;

    const int = (getInt(itemInt.offset, "uint8") & 0x3) + parseInt(value);

    setInt(itemInt.offset, "uint8", int);

    return true;
  }

  return false;
}

export function afterSetInt(item: Item): void {
  if ("id" in item && item.id?.match(/contest-/)) {
    const itemInt = item as ItemInt;

    let int = 0;

    const offset =
      itemInt.offset - (parseInt(item.id.replace("contest-", "")) - 1) * 4;

    for (let i = 0; i < 5; i += 1) {
      int += getInt(offset + i * 0x4, "uint32", { bigEndian: true });
    }

    setInt(offset + 0x14, "uint32", int, { bigEndian: true });
  }
}

export function generateChecksum(
  item: ItemChecksum,
  dataView = new DataView(new ArrayBuffer(0)),
): number {
  let checksum = 0x0;

  if (item.id?.match(/checksum1-/)) {
    const offsets = [0x188, 0x1f0, 0x210, 0x228];

    offsets.forEach((offset) => {
      checksum += getInt(
        item.offset + offset - (item.id === "checksum1-2" ? 0x4 : 0x0),
        "uint32",
        { bigEndian: true },
        dataView,
      );
      checksum += getInt(
        item.offset + offset + (item.id === "checksum1-1" ? 0x4 : 0x0),
        "uint32",
        { bigEndian: true },
        dataView,
      );
    });
  } else {
    for (
      let i = item.control.offsetStart;
      i < item.control.offsetEnd;
      i += 0x4
    ) {
      checksum += getInt(i, "uint32", { bigEndian: true }, dataView);
    }
  }

  if (item.id?.match(/-1/)) {
    checksum = 0xf251f205 - checksum;
  } else if (item.id?.match(/-2/)) {
    let base = 0xec5bc9a8;

    if (item.id === "checksum1-2") {
      base -= 0xd8769a8;
    }

    checksum = base + checksum * 2;
  }

  return formatChecksum(checksum, item.dataType);
}

export function beforeSaving(): ArrayBufferLike {
  return byteswapDataView("sra").buffer;
}
