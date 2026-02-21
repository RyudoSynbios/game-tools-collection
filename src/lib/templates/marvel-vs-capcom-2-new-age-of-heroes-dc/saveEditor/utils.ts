import { get } from "svelte/store";

import { gameRegion } from "$lib/stores";
import { getInt, setInt } from "$lib/utils/bytes";
import { formatChecksum } from "$lib/utils/checksum";
import { initDataView, saveDataView } from "$lib/utils/common/dreamcast";
import { isDciFile } from "$lib/utils/common/dreamcast/dci";
import VMU, { isVmuFile } from "$lib/utils/common/dreamcast/vmu";
import { getRegions } from "$lib/utils/validator";

import type { Item, ItemChecksum, ItemInt } from "$lib/types";

let vmu: VMU;

export function beforeInitDataView(dataView: DataView): DataView {
  if (isVmuFile(dataView)) {
    vmu = new VMU(dataView);

    return vmu.unpack();
  }

  return initDataView(dataView);
}

export function overrideGetRegions(
  dataView: DataView,
  shift: number,
): string[] {
  if (vmu?.isInitialized()) {
    return vmu.getRegions();
  }

  return getRegions(dataView, shift);
}

export function onInitFailed(): void {
  if (vmu?.isInitialized()) {
    vmu.destroy();
  }
}

export function initShifts(shifts: number[]): number[] {
  if (vmu?.isInitialized()) {
    return vmu.getShift();
  } else if (isDciFile()) {
    return [...shifts, 0x20];
  }

  return shifts;
}

export function overrideParseItem(item: Item): Item {
  const $gameRegion = get(gameRegion);

  if ("id" in item && item.id === "japanExclude") {
    const itemInt = item as ItemInt;

    itemInt.hidden = $gameRegion === 1;

    return itemInt;
  } else if ("id" in item && item.id === "japanOnly") {
    const itemInt = item as ItemInt;

    itemInt.hidden = $gameRegion === 0;

    return itemInt;
  }

  return item;
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
  if (vmu?.isInitialized()) {
    return vmu.repack();
  }

  return saveDataView();
}

export function onReset(): void {
  if (vmu?.isInitialized()) {
    vmu.destroy();
  }
}
