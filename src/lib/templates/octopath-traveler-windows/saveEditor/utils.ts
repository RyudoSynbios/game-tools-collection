import { get } from "svelte/store";

import { dataJson, gameTemplate } from "$lib/stores";
import Gvas from "$lib/utils/gvas";
import { getObjKey } from "$lib/utils/format";
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
    const [itemIndex] = item.id.splitInt();

    const items = $dataJson.PlayerBackpack
      .ItemList_8_58476D454393A7632A42B8870FCAB55A as BackpackItem[];

    const index = items.findIndex(
      (item) => item.ItemID_8_9DE7BACC4450597F0A7C7780E25ED27F === itemIndex,
    );

    let count = 0;

    if (index !== -1) {
      count = items[index].Num_5_94500A7E4AA427B66C5C57A47949F18E;
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

    const items = $dataJson.PlayerBackpack
      .ItemList_8_58476D454393A7632A42B8870FCAB55A as BackpackItem[];

    const index = items.findIndex(
      (item) => item.ItemID_8_9DE7BACC4450597F0A7C7780E25ED27F === itemIndex,
    );

    if (index !== -1) {
      if (int === 0) {
        items.splice(index, 1);
        items.push({
          ItemID_8_9DE7BACC4450597F0A7C7780E25ED27F: 0,
          Num_5_94500A7E4AA427B66C5C57A47949F18E: 0,
        });
      } else {
        items[index].Num_5_94500A7E4AA427B66C5C57A47949F18E = int;
      }
    } else {
      const index = items.findIndex(
        (item) => item.ItemID_8_9DE7BACC4450597F0A7C7780E25ED27F === 0,
      );

      items[index].ItemID_8_9DE7BACC4450597F0A7C7780E25ED27F = itemIndex;
      items[index].Num_5_94500A7E4AA427B66C5C57A47949F18E = int;
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
