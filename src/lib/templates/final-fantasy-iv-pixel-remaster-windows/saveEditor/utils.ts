import { get } from "svelte/store";

import { dataJson } from "$lib/stores";
import { extractBit, getString } from "$lib/utils/bytes";
import { getPartialValue, lowerize, makeOperations } from "$lib/utils/format";
import { getObjValue, setObjValue } from "$lib/utils/json";
import { updateResources } from "$lib/utils/parser";
import { checkValidator } from "$lib/utils/validator";

import type {
  Item,
  ItemBitflag,
  ItemBitflags,
  ItemInt,
  ItemTab,
  ItemTabs,
  Resource,
} from "$lib/types";

import { decrypt, encrypt } from "./utils/crypto";
import {
  abilityTypes,
  charactersStatus,
  inventory,
  locations,
} from "./utils/resource";

interface Character {
  characterStatusId: number;
  jobId: number;
  name: string;
  abilityList: {
    target: CharacterAbility[];
  };
  equipmentList: {
    values: UserItem[];
  };
}

interface CharacterAbility {
  abilityId: number;
  contentId: number;
  skillLevel: number;
}

interface UserItem {
  contentId: number;
  count: number;
}

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

export function overrideParseItem(item: Item): Item | ItemTab {
  const $dataJson = get(dataJson);

  if ("id" in item && item.id === "slot") {
    const itemTab = item as ItemTab;

    itemTab.disabled = !isSlot();

    return itemTab;
  } else if ("id" in item && item.id?.match(/transporation-/)) {
    const itemTab = item as ItemTab;

    const [index] = item.id.splitInt();

    itemTab.hidden = index === 0;

    return itemTab;
  } else if ("id" in item && item.id === "party") {
    const itemTabs = item as ItemTabs;

    if (!isSlot()) {
      return itemTabs;
    }

    itemTabs.items.map((item, index) => {
      item.disabled =
        index >= $dataJson.userData.ownedCharacterList.target.length;
    });

    return itemTabs;
  } else if ("id" in item && item.id?.match(/abilities-/)) {
    const itemTab = item as ItemTab;

    const [characterIndex] = item.id.splitInt();

    if (
      !isSlot() ||
      characterIndex >= $dataJson.userData.ownedCharacterList.target.length
    ) {
      return itemTab;
    }

    const jobId = getCharacter(characterIndex).jobId;

    itemTab.disabled = ![0x1, 0x2, 0x4, 0x5, 0x8, 0xc, 0xd, 0xe].includes(
      jobId,
    );

    return itemTab;
  } else if ("id" in item && item.id === "bestiary") {
    const itemTab = item as ItemTab;

    itemTab.disabled = !isBestiary();

    return itemTab;
  }

  return item;
}

export function overrideItem(item: Item): Item {
  if ("id" in item && item.id?.match(/ownedTransportationList/)) {
    const itemInt = item as ItemInt;

    const vehicleIndex = parseInt(item.id.match(/\[(\d+)\]/)![1]);

    itemInt.disabled = !isTransporationEnabled(vehicleIndex);

    return itemInt;
  } else if ("id" in item && item.id?.match(/currentExp|addtional/)) {
    const itemInt = item as ItemInt;

    let [, type] = item.id.split(/addtional/);

    if (item.id?.match(/currentExp/)) {
      type = "currentExp";
    }

    type = lowerize(type);

    if (
      type !== "level" &&
      type !== "currentExp" &&
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

    const characterStatsIndex = getCharacter(characterIndex).characterStatusId;

    const characterStatus = charactersStatus[characterStatsIndex - 1];

    const base = characterStatus[type];

    if (type !== "level") {
      itemInt.operations = [{ "+": base }];
    }

    itemInt.min = base;

    return itemInt;
  } else if ("id" in item && item.id?.match(/equipmentList/)) {
    const itemInt = item as ItemInt;

    const indexes = [...item.id.matchAll(/\[(\d+)\]/g)];

    const characterIndex = parseInt(indexes[0][1]);
    const equipmentIndex = parseInt(indexes[1][1]);

    const characterStatsIndex = getCharacter(characterIndex).characterStatusId;

    const characterStatus = charactersStatus[characterStatsIndex - 1];

    if (equipmentIndex === 0 && characterStatus.favoredHand === "left") {
      itemInt.resource = "leftHands";
    } else if (equipmentIndex === 1 && characterStatus.favoredHand === "left") {
      itemInt.resource = "rightHands";
    } else if (equipmentIndex === 1 && characterStatus.favoredHand === "both") {
      itemInt.resource = "rightHands";
    }

    return itemInt;
  } else if ("id" in item && item.id?.match(/abilityType-/)) {
    const itemBitflags = item as ItemBitflags;

    const [characterIndex, typeIndex] = item.id.splitInt();

    const jobId = getCharacter(characterIndex).jobId;

    itemBitflags.hidden = true;

    if (
      (typeIndex === 0x7 && [0x1, 0x2, 0x7, 0x8, 0xd, 0xe].includes(jobId)) ||
      (typeIndex === 0x8 && [0x4, 0x7, 0x8, 0xc, 0xe].includes(jobId)) ||
      (typeIndex === 0x9 && [0x4, 0x7].includes(jobId)) ||
      (typeIndex === 0xf && jobId === 0x5)
    ) {
      itemBitflags.hidden = false;
    }
  } else if ("id" in item && item.id?.match(/inventory-items-/)) {
    const itemInt = item as ItemInt;

    const [itemIndex] = item.id.splitInt();

    const equipment = getEquippedItems();

    itemInt.min = equipment[itemIndex] || 0;
  }

  return item;
}

export function overrideGetInt(
  item: Item,
): [
  boolean,
  (
    | boolean
    | number
    | string
    | (ItemBitflag & { checked: boolean })[]
    | undefined
  ),
] {
  const $dataJson = get(dataJson);

  if ($dataJson === undefined) {
    return [false, 0x0];
  }

  if ("id" in item && item.id?.match(/currentArea/)) {
    const value = getObjValue<string>(item.id, "");

    const location = locations[value] || "";

    return [true, location];
  } else if ("id" in item && item.id?.match(/vehicleStatus-/)) {
    const [vehicleIndex] = item.id.splitInt();

    const enabled = isTransporationEnabled(vehicleIndex);

    return [true, enabled ? 1 : 0];
  } else if ("id" in item && item.id?.match(/abilityType-/)) {
    const itemBitflags = item as ItemBitflags;

    const [characterIndex, abilityTypeIndex] = item.id.splitInt();

    const abilityList = getCharacter(characterIndex).abilityList.target;

    const abilityType = abilityTypes.find(
      (type) => type.index === abilityTypeIndex,
    )!;

    const flags = itemBitflags.flags.reduce(
      (flags: (ItemBitflag & { checked: boolean })[], flag, index) => {
        const checked = Boolean(
          abilityList.find(
            (ability) =>
              ability.contentId === abilityType.abilities[index].index,
          ),
        );

        flags.push({
          ...flag,
          checked,
        });

        return flags;
      },
      [],
    );

    return [true, flags];
  } else if ("id" in item && item.id?.match(/inventory-/)) {
    const [, type] = item.id.split("-");
    const [itemIndex] = item.id.splitInt();

    let items: UserItem[];

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

export function overrideSetInt(
  item: Item,
  value: boolean | string,
  flag: ItemBitflag,
): boolean {
  const $dataJson = get(dataJson);

  if ("id" in item && item.id?.match(/vehicleStatus-/)) {
    const [vehicleIndex] = item.id.splitInt();

    $dataJson.dataStorage.treasure[28] ^= 1 << (vehicleIndex + 4);

    $dataJson.userData.ownedTransportationList.target[vehicleIndex].position.z =
      249;

    dataJson.set($dataJson);

    return true;
  } else if ("id" in item && item.id?.match(/corpsList/)) {
    const int = parseInt(value as string);

    const previous = getObjValue<number>(item.id, 0x0);

    if (previous !== 0) {
      setObjValue<boolean>(
        `userData.ownedCharacterList.target[${previous - 1}].isEnableCorps`,
        false,
      );
    }

    if (int !== 0) {
      setObjValue<boolean>(
        `userData.ownedCharacterList.target[${int - 1}].isEnableCorps`,
        true,
      );
    }

    setObjValue<number>(item.id, int);

    return true;
  } else if ("id" in item && item.id?.match(/equipmentList/)) {
    const int = parseInt(value as string);

    const items: UserItem[] = $dataJson.userData.normalOwnedItemList.target;

    const index = items.findIndex((item) => item.contentId === int);

    let userItem: UserItem;

    const equippedItems = getEquippedItems();

    if (index !== -1) {
      // We increment the quantity in the inventory to avoid negative numbers
      items[index].count = Math.max(
        (equippedItems[int] || 0) + 1,
        items[index].count,
      );
      userItem = items[index];
    } else {
      // We add the equipped item in the inventory
      userItem = {
        contentId: int,
        count: 1,
      };
      items.push(userItem);
    }

    if (userItem) {
      setObjValue<UserItem>(item.id.replace(".contentId", ""), userItem);
    }

    dataJson.set($dataJson);

    return true;
  } else if ("id" in item && item.id?.match(/abilityType-/)) {
    const [characterIndex, abilityTypeIndex] = item.id.splitInt();

    const abilityList = getCharacter(characterIndex).abilityList.target;

    const abilityType = abilityTypes.find(
      (type) => type.index === abilityTypeIndex,
    )!;

    const ability = abilityType.abilities.find(
      (ability) => ability.name === flag.label,
    )!;

    if (value) {
      abilityList.push({
        abilityId: ability.abilityId,
        contentId: ability.index,
        skillLevel: 0,
      });
    } else {
      const index = abilityList.findIndex((a) => a.contentId === ability.index);

      if (index !== -1) {
        abilityList.splice(index, 1);
      }
    }

    return true;
  } else if ("id" in item && item.id?.match(/inventory-/)) {
    const [, type] = item.id.split("-");
    const [itemIndex] = item.id.splitInt();

    const int = parseInt(value as string);

    let items: UserItem[];

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

function isTransporationEnabled(index: number): boolean {
  const $dataJson = get(dataJson);

  const vehicles = $dataJson.dataStorage.treasure[28];

  return extractBit(vehicles, index + 4);
}

export function getCharacter(index: number): Character {
  const $dataJson = get(dataJson);

  return $dataJson.userData.ownedCharacterList.target[index];
}

export function getCharacterNames(isInput = "false"): Resource {
  const $dataJson = get(dataJson);

  const names: Resource = {};

  if (!isSlot()) {
    return names;
  }

  $dataJson.userData.ownedCharacterList.target.forEach(
    (character: Character, index: number) => {
      names[index + (Boolean(isInput) ? 1 : 0)] = character.name;
    },
  );

  if (Boolean(isInput)) {
    names[0x0] = "-";
  }

  return names;
}

function getEquippedItems(): { [contentId: number]: number } {
  const $dataJson = get(dataJson);

  const items: { [contentId: number]: number } = {};

  $dataJson.userData.ownedCharacterList.target.forEach(
    (character: Character) => {
      character.equipmentList.values.forEach((item) => {
        if (items[item.contentId] !== undefined) {
          items[item.contentId] += 1;
        } else {
          items[item.contentId] = 1;
        }
      });
    },
  );

  return items;
}
