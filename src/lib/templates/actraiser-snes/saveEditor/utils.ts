import { get } from "svelte/store";

import { gameRegion, gameTemplate } from "$lib/stores";
import { getInt, getString, setInt } from "$lib/utils/bytes";
import { formatChecksum } from "$lib/utils/checksum";

import type { Item, ItemChecksum, ItemInt, ItemString } from "$lib/types";

import { levels } from "./utils/resource";

export function overrideGetRegions(dataView: DataView): string[] {
  const $gameTemplate = get(gameTemplate);

  const itemChecksum = $gameTemplate.items[0] as ItemChecksum;

  if (dataView.byteLength < itemChecksum.control.offsetEnd) {
    return [];
  }

  const checksum = generateChecksum(itemChecksum, dataView);

  if (checksum === getInt(itemChecksum.offset, "uint32", {}, dataView)) {
    return ["europe_france_germany", "usa", "japan"];
  }

  return [];
}

export function overrideParseItem(item: Item): Item {
  const $gameRegion = get(gameRegion);

  if ("offset" in item) {
    item.offset = getRegionOffset(item.offset);
  }

  if ("id" in item && item.id === "name" && $gameRegion === 2) {
    const itemString = item as ItemString;

    itemString.length = 0x4;
    itemString.regex =
      "[!?\u3041-\u308d\u308f\u3092-\u3094\u30a1-\u30ed\u30ef\u30f2-\u30f4\u30f7\u30fa\u30fc]";

    return itemString;
  } else if ("id" in item && item.id === "europeOnly") {
    const itemInt = item as ItemInt;

    itemInt.hidden = $gameRegion !== 0;

    return itemInt;
  } else if ("id" in item && item.id === "professionalMode") {
    const itemInt = item as ItemInt;

    itemInt.hidden = $gameRegion === 0;

    return itemInt;
  } else if ("id" in item && item.id === "lives" && $gameRegion === 2) {
    const itemInt = item as ItemInt;

    itemInt.operations = undefined;

    return itemInt;
  } else if ("id" in item && item.id === "messageSpeed" && $gameRegion === 2) {
    const itemInt = item as ItemInt;

    itemInt.max = 7;

    return itemInt;
  }

  return item;
}

export function overrideGetInt(item: Item): [boolean, number | undefined] {
  if ("id" in item && item.id === "professionalMode") {
    const itemInt = item as ItemInt;

    const magic = getString(itemInt.offset, 0x3, "uint8");

    const isUnlocked = magic === "ACT" ? 1 : 0;

    return [true, isUnlocked];
  } else if ("id" in item && item.id === "areaProgression") {
    const itemInt = item as ItemInt;

    const offset = getRegionOffset(itemInt.offset + 0x1b8);

    let int = getInt(itemInt.offset, "uint8") * 0x2;
    int += getInt(offset, "bit", { bit: 0 });

    return [true, int];
  } else if ("id" in item && item.id === "deathHeim") {
    const itemInt = item as ItemInt;

    let int = getInt(itemInt.offset, "uint8");
    int += getInt(itemInt.offset + 0x34, "bit", { bit: 0 });

    return [true, int];
  }

  return [false, undefined];
}

export function overrideSetInt(item: Item, value: string): boolean {
  if ("id" in item && item.id === "professionalMode") {
    const itemInt = item as ItemInt;

    let magic = 0xffffff;

    if (parseInt(value)) {
      magic = 0x414354;
    }

    setInt(itemInt.offset, "uint24", magic, {
      bigEndian: itemInt.bigEndian,
    });

    return true;
  } else if ("id" in item && item.id === "areaProgression") {
    const itemInt = item as ItemInt;

    const int = parseInt(value);

    const offset = getRegionOffset(itemInt.offset + 0x1b8);

    setInt(itemInt.offset, "uint8", Math.floor(int / 0x2));
    setInt(offset, "bit", int & 0x1, { bit: 0 });

    return true;
  } else if ("id" in item && item.id === "deathHeim") {
    const itemInt = item as ItemInt;

    const int = parseInt(value);

    setInt(itemInt.offset, "uint8", int === 4 ? 3 : 0);
    setInt(itemInt.offset + 0x34, "bit", int !== 0 ? 1 : 0, { bit: 0 });

    return true;
  }

  return false;
}

export function afterSetInt(item: Item): void {
  const $gameRegion = get(gameRegion);

  if ("id" in item && item.id === "level") {
    const itemInt = item as ItemInt;

    const curve = levels[$gameRegion === 2 ? 1 : 0];

    const level = getInt(itemInt.offset, "uint8");
    const experience = curve[level - 1] || 0;

    setInt(itemInt.offset + 0x6, "uint16", experience);
  } else if ("id" in item && item.id === "equippedMagic") {
    const itemInt = item as ItemInt;

    const equippedMagic = getInt(itemInt.offset, "uint8");

    const offset = itemInt.offset - 0x13;

    for (let i = 0x0; i < 0x4; i += 0x1) {
      setInt(offset + i, "bit", 0, { bit: 7 });
    }

    if (equippedMagic) {
      setInt(offset + equippedMagic - 0x1, "bit", 1, { bit: 7 });
    }
  }
}

export function generateChecksum(
  item: ItemChecksum,
  dataView?: DataView,
): number {
  let checksum1 = 0x0;
  let checksum2 = 0x0;

  for (let i = item.control.offsetStart; i < item.control.offsetEnd; i += 0x2) {
    checksum1 ^= getInt(i, "uint16", {}, dataView);
    checksum2 += getInt(i, "uint16", {}, dataView);
  }

  const checksum = (checksum1 << 0x10) | (checksum2 & 0xffff);

  return formatChecksum(checksum, item.dataType);
}

function getRegionOffset(offset: number): number {
  const $gameRegion = get(gameRegion);

  if (offset >= 0x13b7 && offset < 0x14b0) {
    if ($gameRegion === 1) {
      offset -= 0x2;
    } else if ($gameRegion === 2) {
      offset -= 0x3;
    }
  }

  return offset;
}
