import { get } from "svelte/store";

import { gameRegion } from "$lib/stores";
import { getInt, setInt } from "$lib/utils/bytes";
import { formatChecksum } from "$lib/utils/checksum";
import { getHeaderShift } from "$lib/utils/common/gameBoyAdvance";
import { getItem, getShift } from "$lib/utils/parser";

import type {
  Binary,
  Item,
  ItemChecksum,
  ItemInt,
  ItemSection,
  ItemString,
  ItemTab,
  ItemTabs,
} from "$lib/types";

import { rankPoints } from "./utils/resource";

export function initHeaderShift(dataView: DataView): number {
  return getHeaderShift(dataView);
}

export function initShifts(shifts: number[]): number[] {
  const shift = getShift(shifts);

  let offset = 0x0;
  let bestSaveCount = -1;

  for (let i = 0x0; i < 0x10000; i += 0x1000) {
    const saveCount = getInt(shift + i + 0x8, "uint32");
    const type = getInt(shift + i + 0x50, "uint16");

    if (type === 0x0518 && saveCount > bestSaveCount) {
      offset = i;
      bestSaveCount = saveCount;
    }
  }

  return [...shifts, offset];
}

export function overrideParseItem(item: Item): Item {
  const $gameRegion = get(gameRegion);

  if ("id" in item && item.id === "name" && $gameRegion === 1) {
    const itemString = item as ItemString;

    itemString.length = 0xc;
    itemString.encoding = "windows31J";
    itemString.regex =
      "[\u30a1-\u30ed\u30ef\u30f2\u30f3\u30fc\uff01\uff10-\uff19\uff1f\u30fb]";
    [];
    return itemString;
  }

  return item;
}

export function onReady(): void {
  preparePendingCampaign();
}

export function overrideItem(item: Item): Item {
  if ("id" in item && item.id === "campaign") {
    const itemTabs = item as ItemTabs;

    const itemTab = itemTabs.items[2] as ItemTab;
    const itemSection = itemTab.items[0] as ItemSection;
    const itemInt = itemSection.items[1] as ItemInt;

    itemTab.disabled = getInt(itemInt.offset, "uint8") === 0x0;

    return itemTabs;
  } else if ("id" in item && item.id?.match(/missionInput-|rank-/)) {
    const itemInt = item as ItemInt;

    const [shift] = item.id.splitInt();

    let binary: Binary | undefined;

    if (itemInt.binary) {
      binary = { bitStart: 0, bitLength: 12 };
    }

    const days = getInt(itemInt.offset - shift, "uint16", { binary });

    itemInt.disabled = days === 0x0;

    return itemInt;
  }

  return item;
}

export function overrideGetInt(item: Item): [boolean, number | undefined] {
  if ("id" in item && item.id === "globalRank") {
    const itemInt = item as ItemInt;

    const points = getInt(itemInt.offset, "uint32");
    const rank = Math.min(Math.floor(points / 0x14), 0x5f);

    return [true, rank];
  } else if ("id" in item && item.id === "campaignMission") {
    const itemInt = item as ItemInt;

    const days = getInt(itemInt.offset + 0x1, "uint16", {
      binary: {
        bitStart: 0,
        bitLength: 12,
      },
    });

    if (days === 0) {
      return [true, 0xff];
    }
  } else if ("id" in item && item.id === "warRoomCo") {
    const itemInt = item as ItemInt;

    const days = getInt(itemInt.offset + 0x2, "uint16");

    if (days === 0) {
      return [true, 0xff];
    }
  } else if ("id" in item && item.id?.match(/^rank/)) {
    const itemInt = item as ItemInt;

    const points = getInt(itemInt.offset, "uint16", { binary: itemInt.binary });

    const rank = rankPoints.reduce((rank, threshold) => {
      if (points <= threshold) {
        return rank;
      }

      rank += 0x1;

      return rank;
    }, 0x0);

    return [true, rank];
  } else if ("id" in item && item.id?.match(/fieldTraining-/)) {
    const itemInt = item as ItemInt;

    const [index] = item.id.splitInt();

    const progress = getInt(itemInt.offset, "uint8");

    const unlocked = index <= progress ? 0x1 : 0x0;

    return [true, unlocked];
  }

  return [false, undefined];
}

export function overrideSetInt(item: Item, value: string): boolean {
  if ("id" in item && item.id === "globalRank") {
    const itemInt = item as ItemInt;

    const int = parseInt(value);

    setInt(itemInt.offset, "uint32", int * 0x14);

    return true;
  } else if ("id" in item && item.id === "campaignMission") {
    const itemInt = item as ItemInt;

    const int = parseInt(value);

    const days = getInt(itemInt.offset + 0x1, "uint16", {
      binary: {
        bitStart: 0,
        bitLength: 12,
      },
    });

    if (int === 0xff) {
      setInt(itemInt.offset, "uint32", 0x0);
      setInt(itemInt.offset + 0x2, "uint16", 0x0);
    } else if (days === 0x0) {
      setInt(itemInt.offset + 0x1, "uint8", 0x1); // Days
    }
  } else if ("id" in item && item.id === "warRoomCo") {
    const itemInt = item as ItemInt;

    const int = parseInt(value);

    const days = getInt(itemInt.offset + 0x2, "uint16");

    if (int === 0xff) {
      setInt(itemInt.offset + 0x2, "uint32", 0x0);
    } else if (days === 0x0) {
      setInt(itemInt.offset + 0x2, "uint16", 0x1); // Days
    }
  } else if ("id" in item && item.id?.match(/^rank/)) {
    const itemInt = item as ItemInt;

    const int = parseInt(value);

    let points = rankPoints[int - 1] || 0;

    if (points) {
      points += 1;
    }

    setInt(itemInt.offset, "uint16", points, { binary: itemInt.binary });

    return true;
  } else if ("id" in item && item.id?.match(/fieldTraining-/)) {
    const itemInt = item as ItemInt;

    const [index] = item.id.splitInt();

    const progress = index - (value === "0" ? 0x1 : 0x0);

    setInt(itemInt.offset, "uint8", progress);

    return true;
  }

  return false;
}

export function generateChecksum(item: ItemChecksum): number {
  let checksum = 0xff;

  for (let i = item.control.offsetStart; i < item.control.offsetEnd; i += 0x1) {
    checksum += getInt(i, "uint8");
  }

  checksum = (~checksum << 0x8) | (checksum & 0xff);

  return formatChecksum(checksum, item.dataType);
}

function preparePendingCampaign(): void {
  const nextMissionItem = getItem("nextMission") as ItemInt;

  const offset = nextMissionItem.offset + 0x5;

  let reset = false;

  for (let i = 0x0; i < 0x1a; i += 0x1) {
    const days = getInt(offset + i * 0x4, "uint16", {
      binary: { bitStart: 0, bitLength: 12 },
    });

    if (days === 0) {
      reset = true;
    }

    if (reset) {
      setInt(offset + i * 0x4 - 0x1, "uint32", 0x0);
    }
  }
}
