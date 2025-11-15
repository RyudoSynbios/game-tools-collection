import { get } from "svelte/store";

import { dataJson, gameTemplate } from "$lib/stores";
import Gvas, { PropertyType } from "$lib/utils/gvas";
import { getObjKey } from "$lib/utils/format";
import { getJsonInt } from "$lib/utils/json";
import { checkValidator } from "$lib/utils/validator";

import type { Item, ItemInt, Validator } from "$lib/types";

import type { BackpackItem } from "./utils/resource";

const PARSER_OFFSET = 0x55a;

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

export function onReady(): void {
  const $dataJson = get(dataJson);

  if ($dataJson.PlayerParty.SubMemberID === undefined) {
    $dataJson.PlayerParty.SubMemberID = [-1, -1, -1, -1, -1, -1, -1, -1];

    gvas.updateTypes(
      "PlayerParty.SubMemberID",
      `${PropertyType.Array}:${PropertyType.Int}`,
    );
  }
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
    const [itemIndex] = item.id.splitInt();

    const items = $dataJson.PlayerBackpack.ItemList as BackpackItem[];

    const index = items.findIndex((item) => item.ItemId === itemIndex);

    let count = 0;

    if (index !== -1) {
      count = items[index].Num;
    }

    return [true, count];
  }

  return [false, undefined];
}

export function overrideSetInt(item: Item, value: string): boolean {
  const $dataJson = get(dataJson);

  if ("id" in item && item.id?.match(/inventory-/)) {
    const [itemIndex] = item.id.splitInt();

    const int = parseInt(value as string);

    const items = $dataJson.PlayerBackpack.ItemList as BackpackItem[];

    const index = items.findIndex((item) => item.ItemId === itemIndex);

    if (index !== -1) {
      if (int === 0) {
        items.splice(index, 1);
        items.push({ ItemId: 0, Num: 0 });
      } else {
        items[index].Num = int;
      }
    } else {
      const index = items.findIndex((item) => item.ItemId === 0);

      items[index].ItemId = itemIndex;
      items[index].Num = int;
    }

    dataJson.set($dataJson);

    return true;
  }

  return false;
}

export function beforeSaving(): ArrayBufferLike {
  const $dataJson = get(dataJson);

  gvas.updateJson($dataJson);

  return gvas.writeToBuffer();
}
