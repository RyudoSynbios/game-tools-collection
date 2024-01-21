import { get } from "svelte/store";

import { gameTemplate } from "$lib/stores";
import { getInt, getString, setInt, setString } from "$lib/utils/bytes";
import { formatChecksum } from "$lib/utils/checksum";
import { retrieveHeaderShift } from "$lib/utils/common/nintendo64";
import { clone } from "$lib/utils/format";

import type {
  Item,
  ItemChecksum,
  ItemInt,
  ItemSection,
  ItemString,
} from "$lib/types";

export function initHeaderShift(dataView: DataView): number {
  return retrieveHeaderShift(dataView, "sra");
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

  if (checksum === getInt(itemChecksum.offset, "uint32", {}, dataView)) {
    return ["europe", "usa_japan"];
  }

  return [];
}

export function overrideGetInt(
  item: Item,
): [boolean, number | string | undefined] {
  if ("id" in item && item.id === "board") {
    const itemInt = item as ItemInt;

    const int = (getInt(itemInt.offset, "uint8") & 0xf8) >> 3;

    return [true, int];
  } else if ("id" in item && item.id === "rider") {
    const itemInt = item as ItemInt;

    const int = getInt(itemInt.offset, "uint8") & 0x7;

    return [true, int];
  } else if ("id" in item && item.id === "rtName") {
    const itemString = item as ItemString;

    const name1 = getString(itemString.offset, 0x2, itemString.letterDataType, {
      resource: itemString.resource,
      bigEndian: itemString.bigEndian,
    });

    const name2 = getString(
      itemString.offset + 0x7,
      0x1,
      itemString.letterDataType,
      {
        resource: itemString.resource,
      },
    );

    return [true, name1 + name2];
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
  } else if ("id" in item && item.id === "rtName") {
    const itemString = item as ItemString;

    value = value.padEnd(3, " ");

    setString(
      itemString.offset,
      0x2,
      itemString.letterDataType,
      `${value[0]}${value[1]}`,
      itemString.fallback,
      {
        resource: itemString.resource,
        bigEndian: itemString.bigEndian,
      },
    );

    setString(
      itemString.offset + 0x7,
      0x1,
      itemString.letterDataType,
      value[2],
      itemString.fallback,
      {
        resource: itemString.resource,
      },
    );

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
      int += getInt(offset + i * 0x4, "uint32");
    }

    setInt(offset + 0x14, "uint32", int);
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
        {},
        dataView,
      );
      checksum += getInt(
        item.offset + offset + (item.id === "checksum1-1" ? 0x4 : 0x0),
        "uint32",
        {},
        dataView,
      );
    });
  } else {
    for (
      let i = item.control.offsetStart;
      i < item.control.offsetEnd;
      i += 0x4
    ) {
      checksum += getInt(i, "uint32", {}, dataView);
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
