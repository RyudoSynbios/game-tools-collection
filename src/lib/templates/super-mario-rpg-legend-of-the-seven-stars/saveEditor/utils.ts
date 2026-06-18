import { get } from "svelte/store";

import { gameRegion, gameTemplate } from "$lib/stores";
import { getInt, setInt } from "$lib/utils/bytes";
import { formatChecksum } from "$lib/utils/checksum";
import { clone } from "$lib/utils/format";

import type {
  Item,
  ItemBitflags,
  ItemChecksum,
  ItemContainer,
  ItemInt,
} from "$lib/types";

import { locationList } from "./utils/resource";

export function overrideGetRegions(dataView: DataView): string[] {
  const $gameTemplate = get(gameTemplate);

  const itemContainer = $gameTemplate.items[0] as ItemContainer;

  for (let i = 0x0; i < itemContainer.instances; i += 0x1) {
    const itemChecksum = clone(itemContainer.items[0]) as ItemChecksum;

    const tmpShift = i * itemContainer.length;

    itemChecksum.offset += tmpShift;
    itemChecksum.control.offsetStart += tmpShift;
    itemChecksum.control.offsetEnd += tmpShift;

    if (dataView.byteLength < itemChecksum.control.offsetEnd) {
      return [];
    }

    const checksum = generateChecksum(itemChecksum, dataView);

    if (checksum === getInt(itemChecksum.offset, "uint16", {}, dataView)) {
      return ["usa", "japan"];
    }
  }

  return [];
}

export function overrideParseItem(item: Item): Item {
  const $gameRegion = get(gameRegion);

  if ("id" in item && item.id === "filename" && $gameRegion === 1) {
    const itemInt = item as ItemInt;

    itemInt.resource = "letters";

    return itemInt;
  } else if ("id" in item && item.id?.match(/techniques-/)) {
    const itemBitflags = item as ItemBitflags;

    const [targetedCharacter, characterIndex] = item.id.splitInt();

    itemBitflags.hidden = targetedCharacter !== characterIndex;

    return itemBitflags;
  }

  return item;
}

export function overrideItem(item: Item): Item {
  if ("id" in item && item.id?.match(/formation-/)) {
    const itemInt = item as ItemInt;

    const [index] = item.id.splitInt();

    const count = getInt(itemInt.offset - index - 0x1, "uint8");

    itemInt.disabled = index >= count;
    itemInt.resource = index >= count ? "empty" : "characters";

    return itemInt;
  }

  return item;
}

export function overrideGetInt(item: Item): [boolean, number | undefined] {
  if ("id" in item && item.id?.match(/formation-/)) {
    const itemInt = item as ItemInt;

    if (itemInt.disabled) {
      return [true, 0x0];
    }
  }

  return [false, undefined];
}

export function afterSetInt(item: Item): void {
  if ("id" in item && item.id === "location") {
    const itemInt = item as ItemInt;

    const locationIndex = getInt(itemInt.offset, "uint16");

    const location = locationList.find(
      (location) => location.index === locationIndex,
    );

    if (location) {
      setInt(itemInt.offset + 0x11, "uint8", location.coordinates[0]);
      setInt(itemInt.offset + 0x13, "uint8", location.coordinates[1]);
      setInt(itemInt.offset + 0x20, "uint8", location.layers[0]);
      setInt(itemInt.offset + 0x21, "uint8", location.layers[1]);
      setInt(itemInt.offset + 0x22, "uint8", location.layers[0]);
      setInt(itemInt.offset + 0x23, "uint8", location.layers[1]);
      setInt(itemInt.offset + 0x24, "uint8", location.layers[0]);
      setInt(itemInt.offset + 0x25, "uint8", location.layers[1]);
      setInt(itemInt.offset + 0x26, "uint8", location.layers[0]);
      setInt(itemInt.offset + 0x27, "uint8", location.layers[1]);
      setInt(itemInt.offset + 0x10f, "uint8", location.preview);
    }
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

  checksum = ~checksum;

  return formatChecksum(checksum, item.dataType);
}
