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

import {
  getItemCount,
  getItemLength,
  loadHeroStats,
  loadInventory,
  updateHeroStats,
} from "./utils/compression";

export function beforeItemsParsing(): void {
  const $dataView = get(dataView);
  const $dataViewAlt = get(dataViewAlt);

  let offset = 0x2ff;

  offset = loadHeroStats(offset);

  $dataViewAlt.heroSkills = new DataView(
    $dataView.buffer.slice(offset, offset + 0x20),
  );

  $dataViewAlt.temporary = new DataView($dataView.buffer.slice(offset + 0x20));

  offset += 0x20;

  loadInventory(offset);
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

    itemContainer.instances = getItemCount();
  }

  return item;
}

export function afterSetInt(item: Item): void {
  const $dataViewAlt = get(dataViewAlt);

  if ("id" in item && item.id === "level") {
    const itemInt = item as ItemInt;

    const value = getInt(itemInt.offset, "uint32", {}, $dataViewAlt.heroStats);

    setInt(0x2b, "uint8", value);

    let gold = getInt(itemInt.offset + 0x8, "uint32", {}, $dataViewAlt.heroStats); // prettier-ignore

    gold = Math.min(gold, value * 10000);

    setInt(itemInt.offset + 0x8, "uint32", gold, {}, "heroStats");
  } else if ("id" in item && item.id === "gold") {
    const itemInt = item as ItemInt;

    let gold = getInt(itemInt.offset, "uint32", {}, $dataViewAlt.heroStats);
    const level = getInt(itemInt.offset - 0x8, "uint32", {}, $dataViewAlt.heroStats); // prettier-ignore

    gold = Math.min(gold, level * 10000);

    setInt(itemInt.offset, "uint32", gold, {}, "heroStats");
  } else if ("id" in item && item.id === "itemType") {
    updateResources("inventoryNames");
  }
}

export function beforeChecksum(): void {
  const $dataViewAlt = get(dataViewAlt);

  updateHeroStats();

  const uint8Array = mergeUint8Arrays(
    new Uint8Array(get(dataView).buffer),
    new Uint8Array($dataViewAlt.heroSkills.buffer),
    new Uint8Array($dataViewAlt.temporary.buffer),
  );

  dataView.set(new DataView(uint8Array.buffer));

  // Update file size
  setInt(0x8, "uint32", uint8Array.byteLength);
}

export function generateChecksum(item: ItemChecksum): number {
  let checksum = 0x0;

  for (
    let i = item.control.offsetStart;
    i < get(dataView).byteLength;
    i += 0x1
  ) {
    const carry = checksum < 0x0 ? 0x1 : 0x0;

    checksum = (checksum << 0x1) & 0xffffffff;
    checksum += carry + getInt(i, "uint8");
  }

  return formatChecksum(checksum, item.dataType);
}

export function getInventoryNames(): Resource {
  const $dataViewAlt = get(dataViewAlt);

  const itemTypes = getResource("itemTypes") as Resource;

  const names: Resource = {};

  // prettier-ignore
  for (let i = 0x0; i < getItemCount(); i += 0x1) {
    const int = getInt(0x5c + i * getItemLength(), "uint32", {}, $dataViewAlt.inventory);

    names[i] = itemTypes[int];
  }

  return names;
}
