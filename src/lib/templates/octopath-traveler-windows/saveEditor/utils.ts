import { get } from "svelte/store";

import { dataJson, gameTemplate } from "$lib/stores";
import { getObjKey } from "$lib/utils/format";
import Gvas from "$lib/utils/gvas";
import { getJsonInt } from "$lib/utils/json";
import { checkValidator } from "$lib/utils/validator";

import type { Item, ItemInt, Validator } from "$lib/types";

import type { BackpackItem } from "./utils/resource";

const PARSER_OFFSET = 0x318;

let gvas: Gvas;

export function beforeInitDataView(dataView: DataView): DataView {
  const $gameTemplate = get(gameTemplate);

  const regionValidator = $gameTemplate.validator.regions.world as Validator;
  const key = parseInt(getObjKey(regionValidator, 0));
  const validator = regionValidator[key];

  if (!checkValidator(validator, key, dataView)) {
    return dataView;
  }

  gvas = new Gvas(dataView, PARSER_OFFSET);

  dataJson.set(gvas.parseToJson());

  return dataView;
}

export function overrideGetRegions(): string[] {
  const $dataJson = get(dataJson);

  if ($dataJson?.GamePlaySecond !== undefined) {
    return ["world"];
  }

  return [];
}

export function overrideGetInt(item: Item): [boolean, number | undefined] {
  const $dataJson = get(dataJson);

  if (!$dataJson) {
    return [false, 0x0];
  }

  if ("id" in item && item.id === "equippedSupportSkill") {
    const itemInt = item as ItemInt;

    if (getJsonInt(itemInt.jsonPath!) === 0) {
      return [true, -1];
    }
  } else if ("id" in item && item.id?.match(/inventory-/)) {
    const [itemId] = item.id.splitInt();

    const backpackItem = getBackpackItem(itemId);

    const count = backpackItem?.Num_5_94500A7E4AA427B66C5C57A47949F18E || 0;

    return [true, count];
  }

  return [false, undefined];
}

export function overrideSetInt(item: Item, value: string): boolean {
  if ("id" in item && item.id?.match(/inventory-/)) {
    const [itemId] = item.id.splitInt();

    updateBackpackItem(itemId, "set", parseInt(value));

    return true;
  }

  return false;
}

export function beforeSaving(): ArrayBufferLike {
  const $dataJson = get(dataJson);

  gvas.updateJson($dataJson);

  return gvas.writeToBuffer();
}

function getBackpackItemIndex(itemId: number): number {
  const $dataJson = get(dataJson);

  const items = $dataJson.PlayerBackpack
    .ItemList_8_58476D454393A7632A42B8870FCAB55A as BackpackItem[];

  return items.findIndex(
    (item) => item.ItemID_8_9DE7BACC4450597F0A7C7780E25ED27F === itemId,
  );
}

function getBackpackItem(itemId: number): BackpackItem {
  const $dataJson = get(dataJson);

  const items = $dataJson.PlayerBackpack
    .ItemList_8_58476D454393A7632A42B8870FCAB55A as BackpackItem[];

  const index = getBackpackItemIndex(itemId);

  return items[index];
}

function updateBackpackItem(
  itemId: number,
  action: "add" | "remove" | "set",
  value: number,
): void {
  const $dataJson = get(dataJson);

  const items = $dataJson.PlayerBackpack
    .ItemList_8_58476D454393A7632A42B8870FCAB55A as BackpackItem[];

  const index = getBackpackItemIndex(itemId);

  if (action !== "set" && index !== -1) {
    if (action === "add") {
      value = Math.min(
        items[index].Num_5_94500A7E4AA427B66C5C57A47949F18E + value,
        99,
      );
    } else if (action === "remove") {
      value = Math.max(
        0,
        items[index].Num_5_94500A7E4AA427B66C5C57A47949F18E - value,
      );
    }
  } else if (action === "remove") {
    value = 0;
  }

  if (index !== -1) {
    if (value === 0) {
      items.splice(index, 1);
      items.push({
        ItemID_8_9DE7BACC4450597F0A7C7780E25ED27F: 0,
        Num_5_94500A7E4AA427B66C5C57A47949F18E: 0,
      });
    } else {
      items[index].Num_5_94500A7E4AA427B66C5C57A47949F18E = value;
    }
  } else {
    const index = items.findIndex(
      (item) => item.ItemID_8_9DE7BACC4450597F0A7C7780E25ED27F === 0,
    );

    items[index].ItemID_8_9DE7BACC4450597F0A7C7780E25ED27F = itemId;
    items[index].Num_5_94500A7E4AA427B66C5C57A47949F18E = value;
  }

  dataJson.set($dataJson);
}
