import { get } from "svelte/store";

import { dataView, gameRegion, gameTemplate } from "$lib/stores";
import { getInt, setInt } from "$lib/utils/bytes";
import { formatChecksum } from "$lib/utils/checksum";
import { generateVmuChecksum, isDciFile } from "$lib/utils/common/dreamcast";
import { byteswapDataView } from "$lib/utils/common/dreamcast";
import { getObjKey } from "$lib/utils/format";

import type {
  Item,
  ItemChecksum,
  ItemInt,
  LogicalOperator,
  Validator,
} from "$lib/types";

export function beforeInitDataView(dataView: DataView): DataView {
  return byteswapDataView(dataView);
}

export function initShifts(shifts: number[]): number[] {
  const $dataView = get(dataView);
  const $gameRegion = get(gameRegion);
  const $gameTemplate = get(gameTemplate);

  if (isDciFile()) {
    return [...shifts, 0x20];
  }

  const region = Object.values($gameTemplate.validator.regions)[
    $gameRegion
  ] as LogicalOperator<Validator>;

  const save = region.$or!.find((condition: any) => {
    const offset = parseInt(getObjKey(condition, 0));
    const array = condition[offset];
    const length = array.length;

    for (let i = offset; i < offset + length; i += 0x1) {
      if (i >= $dataView.byteLength) {
        return false;
      }

      if (getInt(i, "uint8") !== array[i - offset]) {
        return false;
      }
    }

    return true;
  });

  if (save) {
    const saveOffset = parseInt(getObjKey(save, 0));
    const offset = (0xff - getInt(saveOffset - 0x2, "uint16")) * 0x200;

    return [...shifts, offset];
  }

  return shifts;
}

export function overrideGetInt(item: Item): [boolean, number | undefined] {
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

  for (let i = item.control.offsetStart; i < item.control.offsetEnd; i += 0x2) {
    checksum1 += getInt(i, "uint16");
    checksum2 += getInt(i, "uint8") + getInt(i + 0x1, "uint8");
  }

  checksum1 &= 0xffff;
  checksum2 &= 0xffff;

  const checksum = checksum1 | (checksum2 << 0x10);

  return formatChecksum(checksum, item.dataType);
}

export function beforeSaving(): ArrayBufferLike {
  return byteswapDataView().buffer;
}
