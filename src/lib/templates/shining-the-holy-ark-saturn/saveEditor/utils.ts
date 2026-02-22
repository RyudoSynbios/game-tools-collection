import { get } from "svelte/store";

import { gameTemplate } from "$lib/stores";
import { getInt, setInt } from "$lib/utils/bytes";
import { formatChecksum } from "$lib/utils/checksum";
import {
  customGetRegions,
  getSaves,
  getSlotShifts,
  isUnpackedMemorySystem,
  repackMemorySystem,
  resetMemorySystem,
  unpackMemorySystem,
} from "$lib/utils/common/saturn";
import { clone } from "$lib/utils/format";

import type {
  Item,
  ItemChecksum,
  ItemContainer,
  ItemInt,
  ItemTab,
} from "$lib/types";

import { locationList } from "./utils/resource";

export function beforeInitDataView(dataView: DataView): DataView {
  return unpackMemorySystem(dataView);
}

export function overrideGetRegions(dataView: DataView): string[] {
  const $gameTemplate = get(gameTemplate);

  const regions = customGetRegions();

  if (regions.length > 0) {
    return regions;
  }

  const itemContainer = $gameTemplate.items[0] as ItemContainer;

  // Check if save is a hook file
  for (let i = 0x0; i < 0x3; i += 0x1) {
    const itemChecksum = clone(itemContainer.items[0]) as ItemChecksum;

    itemChecksum.offset -= 0x10;
    itemChecksum.control.offsetStart -= 0x10;
    itemChecksum.control.offsetEnd -= 0x10;

    if (dataView.byteLength < itemChecksum.control.offsetEnd) {
      return [];
    }

    const checksum = generateChecksum(itemChecksum, dataView);

    if (
      checksum ===
      getInt(itemChecksum.offset, "uint32", { bigEndian: true }, dataView)
    ) {
      return ["europe_usa_japan"];
    }
  }

  return [];
}

export function onInitFailed(): void {
  resetMemorySystem();
}

export function overrideParseItem(item: Item & ItemTab): Item | ItemTab {
  if ("id" in item && item.id === "slots" && isUnpackedMemorySystem()) {
    const itemContainer = item as ItemContainer;

    const saves = getSaves();

    itemContainer.instances = saves.length;
  }

  return item;
}

export function overrideParseContainerItemsShifts(
  item: ItemContainer,
  shifts: number[],
  index: number,
): [boolean, number[] | undefined] {
  if (item.id === "slots") {
    if (isUnpackedMemorySystem()) {
      return getSlotShifts(index);
    }

    return [true, [-0x10]];
  }

  return [false, undefined];
}

export function overrideItem(item: Item): Item {
  if ("id" in item && item.id === "experience") {
    const itemInt = item as ItemInt;

    const next = getInt(itemInt.offset - 0x8, "uint32", { bigEndian: true });
    const experience = getInt(itemInt.offset, "uint32", { bigEndian: true });

    itemInt.max = experience + next - 1;

    return itemInt;
  } else if ("id" in item && item.id === "itemStatus") {
    const itemInt = item as ItemInt;

    const int = getInt(itemInt.offset, "uint8");

    itemInt.disabled = int === 0xff;

    return itemInt;
  }

  return item;
}

export function overrideGetInt(item: Item): [boolean, number | undefined] {
  if ("id" in item && item.id === "itemCollectionRatio") {
    const itemInt = item as ItemInt;

    let count = 0;

    for (let i = 0x0; i < 0x20; i += 0x4) {
      count += getInt(itemInt.offset + i, "uint32").toBitCount();
    }

    const percent = Math.floor(count / 2.21);

    return [true, percent];
  } else if ("id" in item && item.id === "formation") {
    const itemInt = item as ItemInt;

    const joined = getInt(itemInt.offset, "bit", { bit: itemInt.bit });
    const leadTeam = getInt(itemInt.offset + 0x2, "bit", { bit: itemInt.bit });

    const int = joined + leadTeam * 2;

    return [true, int];
  } else if ("id" in item && item.id === "itemStatus") {
    const itemInt = item as ItemInt;

    if (itemInt.disabled) {
      return [true, 0x0];
    }
  }

  return [false, undefined];
}

export function overrideSetInt(item: Item, value: string): boolean {
  if ("id" in item && item.id === "level") {
    const itemInt = item as ItemInt;

    const int = parseInt(value);

    const previous = getInt(itemInt.offset, "uint16", { bigEndian: true });
    let total = getInt(itemInt.offset - 0x74, "uint16", { bigEndian: true });

    total += int - previous;

    setInt(itemInt.offset - 0x74, "uint16", total, { bigEndian: true });
  } else if ("id" in item && item.id === "experience") {
    const itemInt = item as ItemInt;

    const int = parseInt(value);

    const experience = getInt(itemInt.offset, "uint32", { bigEndian: true });
    let next = getInt(itemInt.offset - 0x8, "uint32", { bigEndian: true });

    next -= int - experience;

    setInt(itemInt.offset - 0x8, "uint32", next, { bigEndian: true });
  } else if ("id" in item && item.id === "formation") {
    const itemInt = item as ItemInt;

    const int = parseInt(value);

    setInt(itemInt.offset, "bit", int & 0x1, { bit: itemInt.bit });
    setInt(itemInt.offset + 0x2, "bit", int >> 0x1, { bit: itemInt.bit });

    return true;
  } else if ("id" in item && item.id === "item") {
    const itemInt = item as ItemInt;

    const int = parseInt(value);

    const previous = getInt(itemInt.offset, "uint8");

    if (int === 0xfff) {
      setInt(itemInt.offset, "uint8", 0xf, {
        binary: { bitStart: 4, bitLength: 4 },
      });
    } else if (previous === 0xff) {
      setInt(itemInt.offset, "uint8", 0x0, {
        binary: { bitStart: 4, bitLength: 4 },
      });
    }

    setInt(itemInt.offset, "uint16", int, {
      bigEndian: true,
      binary: itemInt.binary,
    });

    return true;
  }

  return false;
}

// prettier-ignore
export function afterSetInt(item: Item): void {
  if ("id" in item && item.id === "location") {
    const itemInt = item as ItemInt;

    const int = getInt(itemInt.offset, "uint16", { bigEndian: true });

    const location = locationList[int];

    setInt(itemInt.offset - 0x4f8, "uint8", location.unknowns[0]);
    setInt(itemInt.offset + 0x4, "uint16", location.unknowns[1], { bigEndian: true });
    setInt(itemInt.offset + 0x8, "uint16", location.unknowns[2], { bigEndian: true });
    setInt(itemInt.offset + 0xc, "uint16", location.unknowns[3], { bigEndian: true });
  }
}

export function generateChecksum(
  item: ItemChecksum,
  dataView?: DataView,
): number {
  let checksum = 0x0;

  for (let i = item.control.offsetStart; i < item.control.offsetEnd; i += 0x1) {
    checksum += getInt(i, "uint8", {}, dataView);
  }

  return formatChecksum(checksum, item.dataType);
}

export function beforeSaving(): ArrayBufferLike {
  return repackMemorySystem();
}

export function onReset(): void {
  resetMemorySystem();
}
