import { get } from "svelte/store";

import { dataView, gameRegion, gameTemplate } from "$lib/stores";
import { getInt, setInt } from "$lib/utils/bytes";
import {
  dataViewToVmu,
  generateVmuChecksum,
  vmuToDataView,
} from "$lib/utils/common";
import { getObjKey } from "$lib/utils/format";

import type { Item, ItemChecksum, ItemInt, ItemSection } from "$lib/types";

export function beforeInitDataView(dataView: DataView): DataView {
  return vmuToDataView(dataView);
}

export function initSteps(): number[] {
  const $dataView = get(dataView);
  const $gameRegion = get(gameRegion);
  const $gameTemplate = get(gameTemplate);

  const region = Object.values($gameTemplate.validator.regions)[$gameRegion];

  const save = region[0].$or.find((condition: any) => {
    const offset = parseInt(getObjKey(condition, 0));
    const array = condition[offset];
    const length = array.length;

    for (let i = offset; i < offset + length; i += 0x1) {
      if (i >= $dataView.byteLength) {
        return false;
      }

      if ($dataView.getUint8(i) !== array[i - offset]) {
        return false;
      }
    }

    return true;
  });

  if (save) {
    const saveOffset = parseInt(getObjKey(save, 0));
    const offset = (0xff - getInt(saveOffset - 0x2, "uint16")) * 0x200;

    return [offset];
  }

  return [];
}

export function overrideItem(item: Item): Item {
  const $gameRegion = get(gameRegion);

  if ("id" in item && item.id === "europeUsaOnly" && $gameRegion === 1) {
    const itemInt = item as ItemInt;

    itemInt.hidden = true;

    return itemInt;
  } else if ("id" in item && item.id === "japanOnly" && $gameRegion === 1) {
    const itemSection = item as ItemSection;

    itemSection.hidden = false;

    return itemSection;
  }

  return item;
}

export function overrideGetInt(
  item: Item,
): [boolean, number | string | undefined] {
  if ("id" in item && item.id === "score") {
    const itemInt = item as ItemInt;

    let hex = "";

    for (let i = 0x7; i >= 0x0; i -= 0x1) {
      hex += getInt(itemInt.offset + i, "uint8").toHex(2);
    }

    const int = parseInt(hex);

    return [true, int];
  }

  return [false, undefined];
}

export function overrideSetInt(item: Item, value: string): boolean {
  if ("id" in item && item.id === "score") {
    const itemInt = item as ItemInt;

    value = value.padStart(12, "0");

    for (let i = 0x0; i < 0x6; i += 0x1) {
      const int = parseInt(`${value[i * 2]}${value[i * 2 + 1]}`, 16);

      setInt(itemInt.offset + 0x5 - i, "uint8", int);
    }

    return true;
  }

  return false;
}

export function generateChecksum(item: ItemChecksum): number {
  if ("id" in item && item.id === "checksumVmu") {
    return generateVmuChecksum(item);
  }

  let checksum1 = 0x0;
  let checksum2 = 0x0;

  for (
    let i = item.control.offset;
    i < item.control.offset + item.control.length;
    i += 0x2
  ) {
    if (i < item.offset || i > item.offset + 0x3) {
      checksum1 += getInt(i, "uint16");
      checksum2 += getInt(i, "uint8") + getInt(i + 0x1, "uint8");
    }
  }

  checksum1 &= 0xffff;
  checksum2 &= 0xffff;

  return checksum1 + (checksum2 << 16);
}

export function beforeSaving(): ArrayBufferLike {
  return dataViewToVmu();
}
