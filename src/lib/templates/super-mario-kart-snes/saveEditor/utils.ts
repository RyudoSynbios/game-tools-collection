import { get } from "svelte/store";

import { gameTemplate } from "$lib/stores";
import { getInt, setInt } from "$lib/utils/bytes";
import { formatChecksum } from "$lib/utils/checksum";

import type {
  Item,
  ItemChecksum,
  ItemInt,
  ItemTab,
  ItemTabs,
} from "$lib/types";

export function overrideGetRegions(dataView: DataView): string[] {
  const $gameTemplate = get(gameTemplate);

  const itemTabs = $gameTemplate.items[0] as ItemTabs;
  const itemTab = itemTabs.items[0] as ItemTab;
  const itemChecksum = itemTab.items[0] as ItemChecksum;

  if (dataView.byteLength !== 0x800) {
    return [];
  }

  const checksum = generateChecksum(itemChecksum, dataView);

  if (checksum === getInt(itemChecksum.offset, "uint16", {}, dataView)) {
    return ["europe_usa_japan"];
  }

  return [];
}

export function onReady(): void {
  let sum = 0x0;

  for (let i = 0x660; i < 0x7f0; i += 0x2) {
    sum += getInt(i, "uint16", {});
  }

  if (sum === 0x0 || sum === 0xc7ff38) {
    for (let i = 0x660; i < 0x7f0; i += 0x14) {
      setInt(i, "uint32", 0x599905e8, {});
      setInt(i + 0x4, "uint32", 0x0a59990a, {});
      setInt(i + 0x8, "uint32", 0x990a5999, {});
      setInt(i + 0xc, "uint32", 0x59990a59, {});
      setInt(i + 0x10, "uint32", 0x0a59990a, {});
    }
  }
}

export function overrideItem(item: Item): Item {
  if ("id" in item && item.id?.match(/time-/)) {
    const itemInt = item as ItemInt;

    const [, type] = item.id.split("-");

    itemInt.disabled = !isTimeSet(itemInt.offset, type);

    return itemInt;
  }

  return item;
}

export function overrideGetInt(
  item: Item,
): [boolean, number | string | undefined] {
  if ("id" in item && item.id?.match(/time-/)) {
    const itemInt = item as ItemInt;

    const [, type] = item.id.split("-");

    let int = getInt(itemInt.offset, "uint8");

    if (!isTimeSet(itemInt.offset, type)) {
      int = 0x0;
    } else if (type === "minutes") {
      int &= 0xf;
    }

    return [true, int.toHex()];
  } else if ("id" in item && item.id === "character") {
    const itemInt = item as ItemInt;

    let int = getInt(itemInt.offset, "uint8");

    if (int === 0xa) {
      int = 0x0;
    } else {
      int = (int >> 0x4) + 0x1;
    }

    return [true, int];
  }

  return [false, undefined];
}

export function overrideSetInt(item: Item, value: string): boolean {
  if ("id" in item && item.id === "character") {
    const itemInt = item as ItemInt;

    const characterIndex = parseInt(value);

    let int = getInt(itemInt.offset, "uint8");

    if (characterIndex === 0x0) {
      int = 0xa;
    } else {
      if (int === 0xa) {
        int = 0x0;
      }

      int |= (characterIndex - 0x1) << 0x4;
    }

    setInt(itemInt.offset, "uint8", int);

    return true;
  }

  return false;
}

export function generateChecksum(
  item: ItemChecksum,
  dataView = new DataView(new ArrayBuffer(0)),
): number {
  let checksum = 0x0;

  const isTrial = item.id === "timeTrialChecksum";

  for (
    let i = item.control.offsetStart;
    i < item.control.offsetEnd;
    i += isTrial ? 0x1 : 0x2
  ) {
    if (isTrial) {
      checksum += getInt(i, "uint8");
    } else {
      checksum += getInt(i, "uint16", {}, dataView);
    }
  }

  return formatChecksum(checksum, item.dataType);
}

function isTimeSet(offset: number, type: string): boolean {
  switch (type) {
    case "seconds":
      offset += 0x1;
      break;
    case "milliseconds":
      offset += 0x2;
      break;
  }

  return getInt(offset, "lower4") !== 0xa;
}
