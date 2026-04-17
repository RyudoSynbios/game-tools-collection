import { get } from "svelte/store";

import { dataView, dataViewAlt } from "$lib/stores";
import { getInt, setInt } from "$lib/utils/bytes";
import { formatChecksum } from "$lib/utils/checksum";
import { mergeUint8Arrays } from "$lib/utils/format";
import { getItem, getResource, updateResources } from "$lib/utils/parser";

import type {
  Item,
  ItemChecksum,
  ItemContainer,
  ItemInt,
  ItemTab,
  Resource,
} from "$lib/types";

import { ITEM_LENGTH } from "./utils/constants";
import Data from "./utils/data";

let data: Data;

export function beforeItemsParsing(): void {
  const $dataViewAlt = get(dataViewAlt);

  data = new Data();

  $dataViewAlt.heroStatus = new DataView(data.heroStatus.buffer);
  $dataViewAlt.heroSkills = new DataView(data.heroSkills.buffer);
  $dataViewAlt.inventory = new DataView(data.inventory.buffer);
  $dataViewAlt.temporary = new DataView(data.temporary.buffer);
}

export function overrideParseItem(item: Item): Item | ItemTab {
  if ("id" in item && item.id?.match(/skill-/)) {
    const itemTab = item as ItemTab;

    const [skillClass] = item.id.splitInt();

    const heroClass = getItem("class") as ItemInt;

    const int = getInt(heroClass.offset, "uint8");

    if (skillClass !== int) {
      itemTab.hidden = true;
    }

    return itemTab;
  } else if ("id" in item && item.id === "inventory") {
    const itemContainer = item as ItemContainer;

    itemContainer.instances = data.itemCount;
  }

  return item;
}

export function afterSetInt(item: Item): void {
  const $dataViewAlt = get(dataViewAlt);

  if ("id" in item && item.id === "level") {
    const itemInt = item as ItemInt;

    const value = getInt(itemInt.offset, "uint32", {}, $dataViewAlt.heroStatus);

    setInt(0x2b, "uint8", value);

    let gold = getInt(itemInt.offset + 0x8, "uint32", {}, $dataViewAlt.heroStatus); // prettier-ignore

    gold = Math.min(gold, value * 10000);

    setInt(itemInt.offset + 0x8, "uint32", gold, {}, "heroStatus");
  } else if ("id" in item && item.id === "gold") {
    const itemInt = item as ItemInt;

    let gold = getInt(itemInt.offset, "uint32", {}, $dataViewAlt.heroStatus);
    const level = getInt(itemInt.offset - 0x8, "uint32", {}, $dataViewAlt.heroStatus); // prettier-ignore

    gold = Math.min(gold, level * 10000);

    setInt(itemInt.offset, "uint32", gold, {}, "heroStatus");
  } else if ("id" in item && item.id === "itemCode") {
    updateResources("inventoryNames");
  }
}

export function beforeChecksum(): void {
  const $dataView = get(dataView);
  const $dataViewAlt = get(dataViewAlt);

  const uint8Array = mergeUint8Arrays(
    new Uint8Array($dataView.buffer.slice(0x0, 0x2ff)),
    data.compressHeroStatus(),
    new Uint8Array($dataViewAlt.heroSkills.buffer),
    new Uint8Array($dataViewAlt.temporary.buffer),
  );

  dataView.set(new DataView(uint8Array.buffer));

  // Update file size
  setInt(0x8, "uint32", uint8Array.length);
}

export function generateChecksum(item: ItemChecksum): number {
  const $dataView = get(dataView);

  let checksum = 0x0;

  for (let i = item.control.offsetStart; i < $dataView.byteLength; i += 0x1) {
    const carry = checksum < 0x0 ? 0x1 : 0x0;

    checksum = (checksum << 0x1) & 0xffffffff;
    checksum += carry + getInt(i, "uint8");
  }

  return formatChecksum(checksum, item.dataType);
}

export function getInventoryNames(): Resource {
  const $dataViewAlt = get(dataViewAlt);

  const names: Resource = {};

  const itemCodes = getResource("itemCodes") as Resource;

  // prettier-ignore
  for (let i = 0x0; i < data.itemCount; i += 0x1) {
    const int = getInt(0x5c + i * ITEM_LENGTH * 0x4, "uint32", {}, $dataViewAlt.inventory);

    names[i] = itemCodes[int];
  }

  return names;
}
