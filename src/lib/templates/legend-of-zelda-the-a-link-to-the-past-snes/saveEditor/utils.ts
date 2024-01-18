import { get } from "svelte/store";

import { gameRegion } from "$lib/stores";
import { getInt, setInt, setString } from "$lib/utils/bytes";
import { clone } from "$lib/utils/format";

import type {
  Item,
  ItemChecksum,
  ItemContainer,
  ItemInt,
  ItemString,
} from "$lib/types";

import template from "./template";

export function overrideGetRegions(dataView: DataView): string[] {
  for (let i = 0; i < 3; i += 1) {
    const itemChecksum = clone(
      (template.items[0] as ItemContainer).items[0],
    ) as ItemChecksum;

    itemChecksum.offset += 0x500 * i;
    itemChecksum.control.offset += 0x500 * i;

    const checksum = generateChecksum(itemChecksum, dataView);

    if (checksum === getInt(itemChecksum.offset, "uint16", {}, dataView)) {
      return ["europe_usa", "japan", "france_canada", "germany"];
    }
  }

  return [];
}

export function overrideItem(item: Item): Item {
  const $gameRegion = get(gameRegion);

  if ("id" in item && item.id === "name" && $gameRegion === 1) {
    const itemString = item as ItemString;

    itemString.length = 0x8;

    return itemString;
  }

  return item;
}

export function overrideSetInt(item: Item, value: string): boolean {
  const $gameRegion = get(gameRegion);

  if ("id" in item && item.id === "name" && $gameRegion === 0) {
    const itemString = item as ItemString;

    value = value.replace("I", "l");

    setString(
      itemString.offset,
      itemString.length,
      itemString.letterDataType,
      value,
      itemString.fallback,
      {
        resource: itemString.resource,
      },
    );

    return true;
  }

  return false;
}

export function afterSetInt(item: Item): void {
  if ("id" in item && item.id === "health") {
    const itemInt = item as ItemInt;

    let health = getInt(itemInt.offset, "uint8");
    const healthMax = getInt(itemInt.offset - 0x1, "uint8");

    health = Math.min(health, healthMax);

    setInt(itemInt.offset, "uint8", health);
  } else if ("id" in item && item.id === "healthMax") {
    const itemInt = item as ItemInt;

    let health = getInt(itemInt.offset + 0x1, "uint8");
    const healthMax = getInt(itemInt.offset, "uint8");

    health = Math.min(health, healthMax);

    setInt(itemInt.offset + 0x1, "uint8", health);
  } else if ("id" in item && item.id === "bombs") {
    const itemInt = item as ItemInt;

    let bombs = getInt(itemInt.offset, "uint8");
    const bombsMax = getInt(itemInt.offset + 0x2d, "uint8");

    const bombsMaxRef = parseInt(
      template.resources!.bombsMax[bombsMax] as string,
    );

    bombs = Math.min(bombs, bombsMaxRef);

    setInt(itemInt.offset, "uint8", bombs);
  } else if ("id" in item && item.id === "bombsMax") {
    const itemInt = item as ItemInt;

    let bombs = getInt(itemInt.offset - 0x2d, "uint8");
    const bombsMax = getInt(itemInt.offset, "uint8");

    const bombsMaxRef = parseInt(
      template.resources!.bombsMax[bombsMax] as string,
    );

    bombs = Math.min(bombs, bombsMaxRef);

    setInt(itemInt.offset - 0x2d, "uint8", bombs);
  } else if ("id" in item && item.id === "arrows") {
    const itemInt = item as ItemInt;

    let arrows = getInt(itemInt.offset, "uint8");
    const arrowsMax = getInt(itemInt.offset - 0x6, "uint8");

    const arrowsMaxRef = parseInt(
      template.resources!.arrowsMax[arrowsMax] as string,
    );

    arrows = Math.min(arrows, arrowsMaxRef);

    setInt(itemInt.offset, "uint8", arrows);
  } else if ("id" in item && item.id === "arrowsMax") {
    const itemInt = item as ItemInt;

    let arrows = getInt(itemInt.offset + 0x6, "uint8");
    const arrowsMax = getInt(itemInt.offset, "uint8");

    const arrowsMaxRef = parseInt(
      template.resources!.arrowsMax[arrowsMax] as string,
    );

    arrows = Math.min(arrows, arrowsMaxRef);

    setInt(itemInt.offset + 0x6, "uint8", arrows);
  }
}

export function generateChecksum(
  item: ItemChecksum,
  dataView = new DataView(new ArrayBuffer(0)),
): number {
  let checksum = 0x5a5a;

  for (
    let i = item.control.offset;
    i < item.control.offset + item.control.length;
    i += 0x2
  ) {
    checksum -= getInt(i, "uint16", {}, dataView);
  }

  checksum &= 0xffff;

  return checksum;
}
