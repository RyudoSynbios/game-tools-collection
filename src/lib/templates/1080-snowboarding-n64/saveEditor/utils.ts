import { get } from "svelte/store";

import { dataView } from "$lib/stores";
import { getInt, getString, setInt, setString } from "$lib/utils/bytes";
import { clone } from "$lib/utils/format";

import type {
  Item,
  ItemChecksum,
  ItemInt,
  ItemSection,
  ItemString,
} from "$lib/types";

import template from "./template";

export function overrideGetRegions(dataView: DataView): string[] {
  let validatorOffset = 0x0;

  if (dataView.byteLength === 0x48800) {
    validatorOffset += 0x20800;
  }

  const itemChecksum = clone(
    (template.items[0] as ItemSection).items[6],
  ) as ItemChecksum;

  itemChecksum.offset += validatorOffset;
  itemChecksum.control.offset += validatorOffset;

  const checksum = generateChecksum(itemChecksum, dataView);

  if (checksum === dataView.getUint32(itemChecksum.offset, true)) {
    return ["europe", "usa_japan"];
  }

  return [];
}

export function initSteps(): number[] {
  const $dataView = get(dataView);

  if ($dataView.byteLength === 0x48800) {
    return [0x20800];
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
      2,
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
      1,
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
      if (dataView.byteLength > 0) {
        checksum += dataView.getUint32(
          item.offset + offset - (item.id === "checksum1-2" ? 0x4 : 0x0),
          true,
        );
        checksum += dataView.getUint32(
          item.offset + offset + (item.id === "checksum1-1" ? 0x4 : 0x0),
          true,
        );
      } else {
        checksum += getInt(
          item.offset + offset - (item.id === "checksum1-2" ? 0x4 : 0x0),
          "uint32",
        );
        checksum += getInt(
          item.offset + offset + (item.id === "checksum1-1" ? 0x4 : 0x0),
          "uint32",
        );
      }
    });
  } else {
    for (
      let i = item.control.offset;
      i < item.control.offset + item.control.length;
      i += 0x4
    ) {
      if (dataView.byteLength > 0) {
        checksum += dataView.getUint32(i);
      } else {
        checksum += getInt(i, "uint32");
      }
    }
  }

  if (item.id?.match(/-1/)) {
    checksum = 0xf251f205 - (checksum & 0xffffffff);
  } else if (item.id?.match(/-2/)) {
    let base = 0xec5bc9a8;

    if (item.id === "checksum1-2") {
      base -= 0xd8769a8;
    }
    checksum = base + ((checksum * 2) & 0xffffffff);
  }

  return checksum;
}