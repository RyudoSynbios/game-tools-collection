import { get } from "svelte/store";

import { dataJson, dataView } from "$lib/stores";
import { dataViewToJson, jsonToBuffer } from "$lib/utils/format";
import { getJsonString, setJsonString } from "$lib/utils/json";

import type {
  Item,
  ItemBitflag,
  ItemBitflagChecked,
  ItemBitflags,
  ItemInt,
} from "$lib/types";

import {
  arcanaList,
  cardList,
  keyItemList,
  moveList,
  relicList,
  skinList,
  weaponList,
} from "./utils/resource";

export async function overrideGetRegions(
  dataView: DataView,
): Promise<string[]> {
  const json = await dataViewToJson(dataView);

  if (json.version) {
    return ["world"];
  }

  return [];
}

export async function beforeItemsParsing(): Promise<void> {
  const $dataView = get(dataView);

  const json = await dataViewToJson($dataView);

  dataJson.set(json);
}

export function overrideGetInt(
  item: Item,
): [boolean, number | ItemBitflagChecked[] | undefined] {
  if ("id" in item && item.id?.match(/equipment-/)) {
    const itemInt = item as ItemInt;

    const [, type] = item.id.split("-");

    const table = getInventoryTable(type);

    const itemId = getJsonString(itemInt.jsonPath!);

    const index = table.findIndex((item) => item.id === itemId);

    return [true, index];
  } else if ("id" in item && item.id?.match(/inventory-/)) {
    const itemBitflags = item as ItemBitflags;

    const [, type] = item.id.split("-");

    const table = getInventoryTable(type);

    const flags = itemBitflags.flags.map((flag) => {
      let entry = table[flag.offset];

      if (type === "cards") {
        entry = table.filter((card) => card.type === flag.bit)[flag.offset];
      } else if (type === "relics") {
        entry = table[flag.offset + flag.bit * 24];
      } else if (type === "weapons") {
        entry = table.filter((weapon) => weapon.type === flag.bit)[flag.offset];
      }

      return {
        ...flag,
        checked: hasItem(entry.id),
      };
    });

    return [true, flags];
  }

  return [false, undefined];
}

export function overrideSetInt(
  item: Item,
  value: boolean | string,
  flag: ItemBitflag,
): boolean {
  if ("id" in item && item.id?.match(/equipment-/)) {
    const itemInt = item as ItemInt;

    const [, type] = item.id.split("-");

    const index = parseInt(value as string);

    const table = getInventoryTable(type);

    setJsonString(itemInt.jsonPath!, table[index]?.id || "");

    return true;
  } else if ("id" in item && item.id?.match(/inventory-/)) {
    const [, type] = item.id.split("-");

    const table = getInventoryTable(type);

    let entry = table[flag.offset];

    if (type === "cards") {
      entry = table.filter((card) => card.type === flag.bit)[flag.offset];
    } else if (type === "relics") {
      entry = table[flag.offset + flag.bit * 24];
    } else if (type === "weapons") {
      entry = table.filter((weapon) => weapon.type === flag.bit)[flag.offset];
    }

    updateInventory(entry.id, value as boolean);

    return true;
  }

  return false;
}

export async function beforeSaving(): Promise<ArrayBufferLike> {
  const $dataJson = get(dataJson);

  const buffer = await jsonToBuffer($dataJson);

  return buffer;
}

function getInventoryTable(
  type: string,
): { id: string; type?: number; name: string }[] {
  let table: { id: string; type?: number; name: string }[] = [];

  switch (type) {
    case "arcanas":
      table = arcanaList;
      break;
    case "cards":
      table = cardList;
      break;
    case "keyItems":
      table = keyItemList;
      break;
    case "moves":
      table = moveList;
      break;
    case "relics":
      table = relicList;
      break;
    case "skins":
      table = skinList;
      break;
    case "weapons":
      table = weaponList;
      break;
  }

  return table;
}

function hasItem(id: string): boolean {
  const $dataJson = get(dataJson);

  return $dataJson.playerSave.itemsInInventory.includes(id);
}

function updateInventory(itemId: string, value: boolean): void {
  const $dataJson = get(dataJson);

  const inventory = $dataJson.playerSave.itemsInInventory as string[];

  const index = inventory.findIndex((item) => item === itemId);

  if (value && index === -1) {
    inventory.push(itemId);
  } else if (index !== -1) {
    inventory.splice(index, 1);
  }

  const moveEntry = moveList.find((move) => move.id === itemId);

  if (moveEntry) {
    const moves = $dataJson.playerSave.vaniaMoves as string[];

    const index = moves.findIndex((move) => move === moveEntry.moveId);

    if (value && index === -1) {
      moves.push(moveEntry.moveId);
    } else if (index !== -1) {
      moves.splice(index, 1);
    }
  }

  dataJson.set($dataJson);
}
