import { get } from "svelte/store";

import { gameTemplate } from "$lib/stores";
import { extractBinary, getInt, setInt } from "$lib/utils/bytes";
import { formatChecksum } from "$lib/utils/checksum";
import { byteswapDataView, getHeaderShift } from "$lib/utils/common/nintendo64";
import { clone } from "$lib/utils/format";

import type {
  DataViewABL,
  Item,
  ItemChecksum,
  ItemInt,
  ItemTab,
  ItemTabs,
} from "$lib/types";

const TIME_UNCLEARED = 0x0927c0;

export function initHeaderShift(dataView: DataView): number {
  return getHeaderShift(dataView, "eep");
}

export function beforeInitDataView(dataView: DataView): DataView {
  return byteswapDataView("eep", dataView);
}

export function overrideGetRegions(
  dataView: DataView,
  shift: number,
): string[] {
  const $gameTemplate = get(gameTemplate);

  const itemTabs = clone($gameTemplate.items[0] as ItemTabs);
  const itemTab = itemTabs.items[0] as ItemTab;
  const itemChecksum = itemTab.items[0] as ItemChecksum;

  itemChecksum.offset += shift;
  itemChecksum.control.offsetStart += shift;
  itemChecksum.control.offsetEnd += shift;

  if (dataView.byteLength < itemChecksum.control.offsetEnd) {
    return [];
  }

  const checksum = generateChecksum(itemChecksum, dataView);

  if (
    checksum ===
    getInt(itemChecksum.offset, "uint16", { bigEndian: true }, dataView)
  ) {
    return ["europe_usa_japan"];
  }

  return [];
}

export function overrideParseItem(item: Item): Item {
  if ("id" in item && item.id?.match(/-100-/)) {
    const itemInt = item as ItemInt;

    const [, index] = item.id.splitInt();

    if (index >= 8) {
      itemInt.offset += 0x20;
    }

    return itemInt;
  }

  return item;
}

export function overrideItem(item: Item): Item {
  if ("id" in item && item.id?.match(/time-/)) {
    const itemInt = item as ItemInt;

    const int = getInt(itemInt.offset, "uint24");

    itemInt.disabled = int === TIME_UNCLEARED;

    return itemInt;
  }

  return item;
}

export function overrideGetInt(item: Item): [boolean, number | undefined] {
  if ("id" in item && item.id?.match(/character-/)) {
    const itemInt = item as ItemInt;

    const int = getInt(itemInt.offset, "uint24");

    let character = 0x0;

    const { bitStart, bitLength } = itemInt.binary!;

    if (int !== TIME_UNCLEARED) {
      character = extractBinary(int, bitStart, bitLength) + 0x1;
    }

    return [true, character];
  } else if ("id" in item && item.id?.match(/time-/)) {
    const itemInt = item as ItemInt;

    const int = getInt(itemInt.offset, "uint24");

    if (int === TIME_UNCLEARED) {
      return [true, 0x0];
    }
  }

  return [false, undefined];
}

export function overrideSetInt(item: Item, value: string): boolean {
  if ("id" in item && item.id?.match(/character-/)) {
    const itemInt = item as ItemInt;

    const int = parseInt(value);

    const previous = getInt(itemInt.offset, "uint24");

    if (int === 0x0) {
      setInt(itemInt.offset, "uint24", TIME_UNCLEARED);
    } else {
      if (previous === TIME_UNCLEARED) {
        setInt(itemInt.offset, "uint24", 0x0);
      }

      setInt(itemInt.offset, "uint24", int - 0x1, {
        binary: itemInt.binary,
      });
    }

    return true;
  }

  return false;
}

export function afterSetInt(item: Item): void {
  if ("id" in item && item.id?.match(/character-/)) {
    const itemInt = item as ItemInt;

    const [course, index] = item.id.splitInt();

    const offset = itemInt.offset - index * 0x3;

    let hasRecord = false;

    for (let i = 0x0; i < 0x6; i += 0x1) {
      if (getInt(offset + i * 0x3, "uint24") !== TIME_UNCLEARED) {
        hasRecord = true;
      }
    }

    setInt(offset + 0x12, "uint8", hasRecord ? 1 : 0);

    updateBestRecords(itemInt.offset, course, index);
  } else if ("id" in item && item.id?.match(/time-/)) {
    const itemInt = item as ItemInt;

    const [course, index] = item.id.splitInt();

    updateBestRecords(itemInt.offset, course, index);
  }
}

export function generateChecksum(
  item: ItemChecksum,
  dataView: DataViewABL = new DataView(new ArrayBuffer(0)),
): number {
  let checksum = 0x0;

  switch (item.id) {
    case "checksumBestRecords":
      checksum = generateBestRecordsChecksum(item);
      break;
    case "checksumMarioGP":
      checksum = generateMarioGPChecksum(item, dataView);
      break;
    case "checksumTimeTrials":
      checksum = generateTimeTrialsChecksum(item);
      break;
  }

  return formatChecksum(checksum, item.dataType);
}

export function beforeSaving(): ArrayBufferLike {
  return byteswapDataView("eep").buffer;
}

function generateBestRecordsChecksum(item: ItemChecksum): number {
  let checksum = 0x0;

  for (let i = item.control.offsetStart; i < item.control.offsetEnd; i += 0x1) {
    const iteration = i - item.control.offsetStart;
    const cup = Math.floor(iteration / 0x11);
    const time = iteration % 0x11;

    checksum += (getInt(i, "uint8") + 0x1) * (cup + 0x1) + time;
  }

  return (checksum << 0x8) | (0x5a + (checksum & 0xff));
}

function generateMarioGPChecksum(
  item: ItemChecksum,
  dataView: DataViewABL = new DataView(new ArrayBuffer(0)),
): number {
  let checksum = 0x0;

  for (let i = item.control.offsetStart; i < item.control.offsetEnd; i += 0x1) {
    const int = getInt(i, "uint8", {}, dataView);
    const iteration = i - item.control.offsetStart;

    checksum += (int + 0x1) * (iteration + 0x1) + iteration;
  }

  return (checksum << 0x8) | (0x5a + (checksum & 0xff));
}

function generateTimeTrialsChecksum(item: ItemChecksum): number {
  let checksum = 0x0;

  for (let i = item.control.offsetStart; i < item.control.offsetEnd; i += 0x1) {
    const iteration = i - item.control.offsetStart;
    const multiplicator = (iteration % 0x3) + 0x1;
    const course = Math.floor(iteration / 0x3);

    checksum += getInt(i, "uint8") * multiplicator + course;
  }

  return checksum;
}

function updateBestRecords(
  offset: number,
  course: number,
  index: number,
): void {
  if (index === 0 || index === 5) {
    const int = getInt(offset, "uint24");

    offset -= course * 0x18 - index * 0x3;
    offset += (course < 8 ? 0x188 : 0x1c0) + (course % 8) * 0x3;
    offset += 0x18 * (index === 5 ? 1 : 0);

    setInt(offset, "uint24", int);
  }
}
