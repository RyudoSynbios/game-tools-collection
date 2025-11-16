import { get } from "svelte/store";

import { dataJson, gameTemplate } from "$lib/stores";
import { getObjKey } from "$lib/utils/format";
import Gvas, { PropertyType } from "$lib/utils/gvas";
import { getJsonInt } from "$lib/utils/json";
import { checkValidator } from "$lib/utils/validator";

import type {
  Item,
  ItemBitflag,
  ItemBitflagChecked,
  ItemBitflags,
  ItemInt,
  Validator,
} from "$lib/types";

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

export function overrideGetInt(
  item: Item,
): [boolean, number | ItemBitflagChecked[] | undefined] {
  const $dataJson = get(dataJson);

  if (!$dataJson) {
    return [false, 0x0];
  }

  if ("id" in item && item.id === "jobs") {
    const itemBitflags = item as ItemBitflags;

    const flags = itemBitflags.flags.reduce(
      (flags: ItemBitflagChecked[], flag, index) => {
        const checked = getBackpackItem(0x278b + index) !== undefined;

        flags.push({
          ...flag,
          checked,
        });

        return flags;
      },
      [],
    );

    return [true, flags];
  } else if ("id" in item && item.id === "equippedSupportSkill") {
    const itemInt = item as ItemInt;

    if (getJsonInt(itemInt.jsonPath!) === 0) {
      return [true, -1];
    }
  } else if ("id" in item && item.id?.match(/inventory-/)) {
    const [itemId] = item.id.splitInt();

    const backpackItem = getBackpackItem(itemId);

    const count = backpackItem?.Num || 0;

    return [true, count];
  }

  return [false, undefined];
}

export function overrideSetInt(
  item: Item,
  value: string,
  flag: ItemBitflag,
): boolean {
  if ("id" in item && item.id === "jobs") {
    const itemId = 0x278b + flag.bit;

    updateBackpackItem(itemId, "set", value ? 0x1 : 0x0);

    return true;
  } else if ("id" in item && item.id?.match(/inventory-/)) {
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

  const items = $dataJson.PlayerBackpack.ItemList as BackpackItem[];

  return items.findIndex((item) => item.ItemId === itemId);
}

function getBackpackItem(itemId: number): BackpackItem {
  const $dataJson = get(dataJson);

  const items = $dataJson.PlayerBackpack.ItemList as BackpackItem[];

  const index = getBackpackItemIndex(itemId);

  return items[index];
}

function updateBackpackItem(
  itemId: number,
  action: "add" | "remove" | "set",
  value: number,
): void {
  const $dataJson = get(dataJson);

  const items = $dataJson.PlayerBackpack.ItemList as BackpackItem[];

  const index = getBackpackItemIndex(itemId);

  if (action !== "set" && index !== -1) {
    if (action === "add") {
      value = Math.min(items[index].Num + value, 99);
    } else if (action === "remove") {
      value = Math.max(0, items[index].Num - value);
    }
  } else if (action === "remove") {
    value = 0;
  }

  if (index !== -1) {
    if (value === 0) {
      items.splice(index, 1);
      items.push({ ItemId: 0, Num: 0 });
    } else {
      items[index].Num = value;
    }
  } else {
    const index = items.findIndex((item) => item.ItemId === 0);

    items[index].ItemId = itemId;
    items[index].Num = value;
  }

  dataJson.set($dataJson);
}
