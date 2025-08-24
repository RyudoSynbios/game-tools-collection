import { get } from "svelte/store";

import { dataJson } from "$lib/stores";
import { getString } from "$lib/utils/bytes";
import { getPartialValue, lowerize, makeOperations } from "$lib/utils/format";
import { getObjValue, setObjValue } from "$lib/utils/json";
import { updateResources } from "$lib/utils/parser";
import { checkValidator } from "$lib/utils/validator";

import type { Item, ItemInt, ItemTab, Resource } from "$lib/types";

import { decrypt, encrypt } from "./utils/crypto";
import { charactersStatus, inventory } from "./utils/resource";

export async function beforeInitDataView(
  dataView: DataView,
): Promise<DataView> {
  const encodedData = getString(0x3, dataView.byteLength, "uint8", { endCode: 0xd }, dataView); // prettier-ignore

  if (!checkValidator([0xef, 0xbb, 0xbf], 0x0, dataView)) {
    return dataView;
  }

  try {
    const json = await decrypt(encodedData);

    dataJson.set(json);
  } catch (e) {
    console.error(e);
  }

  return dataView;
}

export function overrideGetRegions(): string[] {
  if (isBestiary() || isSlot()) {
    return ["world"];
  }

  return [];
}

export function overrideItem(item: Item): Item {
  const $dataJson = get(dataJson);

  if ("id" in item && item.id?.match(/addtional/)) {
    const itemInt = item as ItemInt;

    let [, type] = item.id.split(/addtional/);

    type = lowerize(type);

    if (
      type !== "maxHp" &&
      type !== "maxMp" &&
      type !== "power" &&
      type !== "agility" &&
      type !== "vitality" &&
      type !== "intelligence" &&
      type !== "spirit"
    ) {
      return itemInt;
    }

    const characterIndex = parseInt(item.id.match(/\[(\d+)\]/)![1]);

    const characterStatsIndex =
      $dataJson.userData.ownedCharacterList.target[characterIndex]
        ?.characterStatusId;

    if (characterStatsIndex === undefined) {
      return itemInt;
    }

    const characterStatus = charactersStatus[characterStatsIndex - 1];

    const base = characterStatus[type];

    itemInt.operations = [{ "+": base }];
    itemInt.min = base;

    return itemInt;
  } else if ("id" in item && item.id?.match(/equipmentList/)) {
    const itemInt = item as ItemInt;

    const indexes = [...item.id.matchAll(/\[(\d+)\]/g)];

    const characterIndex = parseInt(indexes[0][1]);
    const equipmentIndex = parseInt(indexes[1][1]);

    const characterStatsIndex =
      $dataJson.userData.ownedCharacterList.target[characterIndex]
        ?.characterStatusId;

    if (characterStatsIndex === undefined) {
      return itemInt;
    }

    const characterStatus = charactersStatus[characterStatsIndex - 1];

    console.log(characterStatus.favoredHand, equipmentIndex);

    if (equipmentIndex === 0 && characterStatus.favoredHand === "left") {
      itemInt.resource = "leftHands";
    } else if (equipmentIndex === 1 && characterStatus.favoredHand === "left") {
      itemInt.resource = "rightHands";
    } else if (equipmentIndex === 1 && characterStatus.favoredHand === "both") {
      itemInt.resource = "rightHands";
    }

    return itemInt;
  }

  return item;
}

export function overrideParseItem(item: Item): Item | ItemTab {
  const $dataJson = get(dataJson);

  if ("id" in item && item.id === "slot") {
    const itemTab = item as ItemTab;

    itemTab.disabled = !isSlot();

    return itemTab;
  } else if ("id" in item && item.id === "bestiary") {
    const itemTab = item as ItemTab;

    itemTab.disabled = !isBestiary();

    return itemTab;
  }

  return item;
}

export function overrideGetInt(
  item: Item,
): [boolean, boolean | number | undefined] {
  const $dataJson = get(dataJson);

  if ("id" in item && item.id?.match(/inventory-/)) {
    const [, type] = item.id.split("-");
    const [itemIndex] = item.id.splitInt();

    let items: { contentId: number; count: number }[];

    if (type === "fatChocobo") {
      items = $dataJson.userData.warehouseItemList.target;
    } else if (
      inventory[1].sections[0].items.find((item) => item.index === itemIndex)
    ) {
      items = $dataJson.userData.importantOwendItemList.target;
    } else {
      items = $dataJson.userData.normalOwnedItemList.target;
    }

    const index = items.findIndex((item) => item.contentId === itemIndex);

    let count = 0;

    if (index !== -1) {
      count = items[index].count;
    }

    return [true, count];
  } else if ("id" in item && item.id?.match(/monsterDefeats-/)) {
    const [enemyIndex] = item.id.splitInt();

    const keys = $dataJson.monsterDefeats.keys as number[];
    const values = $dataJson.monsterDefeats.values as number[];

    const index = keys.findIndex((index) => index === enemyIndex);

    let count = 0;

    if (index !== -1) {
      count = values[index];
    }

    return [true, count];
  } else if ("id" in item && item.id?.match(/\./)) {
    if ("dataType" in item && item.dataType === "boolean") {
      const value = getObjValue<boolean>(item.id, false);

      return [true, value];
    }

    let value = getObjValue<number>(item.id, 0x0);

    if ("operations" in item) {
      value = makeOperations(value, item.operations);
    }

    return [true, value];
  }

  return [false, undefined];
}

export function overrideSetInt(item: Item, value: boolean | string): boolean {
  const $dataJson = get(dataJson);

  if ("id" in item && item.id?.match(/equipmentList/)) {
    // TODO: If in inventory: copy the content from inventory (check if having only 1 count for 2 characters is an issue)
    // TODO: if not in inventory: add in inventory
  } else if ("id" in item && item.id?.match(/inventory-/)) {
    const [, type] = item.id.split("-");
    const [itemIndex] = item.id.splitInt();

    const int = parseInt(value as string);

    let items: { contentId: number; count: number }[];

    if (type === "fatChocobo") {
      items = $dataJson.userData.warehouseItemList.target;
    } else if (
      inventory[1].sections[0].items.find((item) => item.index === itemIndex)
    ) {
      items = $dataJson.userData.importantOwendItemList.target;
    } else {
      items = $dataJson.userData.normalOwnedItemList.target;
    }

    const index = items.findIndex((item) => item.contentId === itemIndex);

    if (index !== -1) {
      if (int === 0) {
        items.splice(index, 1);
      } else {
        items[index].count = int;
      }
    } else {
      items.push({ contentId: itemIndex, count: int });
    }

    dataJson.set($dataJson);

    return true;
  } else if ("id" in item && item.id?.match(/monsterDefeats-/)) {
    const [enemyIndex] = item.id.splitInt();

    const int = parseInt(value as string);

    const keys = $dataJson.monsterDefeats.keys as number[];
    const values = $dataJson.monsterDefeats.values as number[];

    const index = keys.findIndex((index) => index === enemyIndex);

    if (index !== -1) {
      if (int === 0) {
        keys.splice(index, 1);
        values.splice(index, 1);
      } else {
        values[index] = int;
      }
    } else {
      keys.push(enemyIndex);
      values.push(int);
    }

    dataJson.set($dataJson);

    return true;
  } else if ("id" in item && item.id?.match(/\./)) {
    if ("dataType" in item && item.dataType === "boolean") {
      setObjValue<boolean>(item.id, value as boolean);

      return true;
    } else if ("letterDataType" in item) {
      setObjValue<string>(item.id, value as string);
    } else {
      let int = parseInt(value as string);

      if ("operations" in item) {
        const oldInt = getObjValue<number>(item.id, 0x0);

        int = makeOperations(int, item.operations, true);
        int = getPartialValue(oldInt, int, item.operations!);
      }

      setObjValue<number>(item.id, int);
    }

    return true;
  }

  return false;
}

export function afterSetInt(item: Item): void {
  if ("id" in item && item.id?.match(/\.name/)) {
    updateResources("characterEnum");
    updateResources("characterNames");
  }
}

export async function beforeSaving(): Promise<ArrayBufferLike> {
  const $dataJson = get(dataJson);

  const encoded = await encrypt($dataJson);

  const uint8Array = new Uint8Array(encoded.length + 0x5);

  uint8Array.set([0xef, 0xbb, 0xbf]);
  uint8Array.set([0xd, 0xa], encoded.length + 0x3);

  for (let i = 0x0; i < encoded.length; i += 0x1) {
    uint8Array[i + 0x3] = encoded[i].charCodeAt(0);
  }

  return uint8Array.buffer;
}

function isBestiary(): boolean {
  const $dataJson = get(dataJson);

  return $dataJson.totalSubjugationCount !== undefined;
}

function isSlot(): boolean {
  const $dataJson = get(dataJson);

  return $dataJson.pictureData;
}

export function getCharacterNames(isInput = "false"): Resource {
  const $dataJson = get(dataJson);

  const names: Resource = {};

  $dataJson.userData.ownedCharacterList.target.forEach(
    (character: any, index: number) => {
      names[index + (Boolean(isInput) ? 1 : 0)] = character.name;
    },
  );

  if (Boolean(isInput)) {
    names[0x0] = "-";
  }

  return names;
}
