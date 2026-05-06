import { md5 } from "js-md5";
import { get } from "svelte/store";

import { dataJson } from "$lib/stores";

import "$lib/utils/bytes";

import { getObjKey, mergeUint8Arrays } from "$lib/utils/format";
import Gvas, { PropertyType } from "$lib/utils/gvas";
import {
  getJsonInt,
  getJsonString,
  setJsonInt,
  setJsonString,
} from "$lib/utils/json";
import { checkValidator, getPlatformRegions } from "$lib/utils/validator";

import type {
  Item,
  ItemInt,
  ItemMessage,
  ItemTab,
  Validator,
} from "$lib/types";

import { parseJson } from "./utils/parser";
import { areas, itemList, locationList, shardList } from "./utils/resource";
import { updateJson } from "./utils/writer";

enum EPBGameLevel {
  "EPBGameLevel::Normal" = 0x0,
  "EPBGameLevel::Hard" = 0x1,
  "EPBGameLevel::Nightmare" = 0x2,
}

enum EPBGameModePlayer {
  "EPBGameModePlayer::Miriam" = 0x0,
  "EPBGameModePlayer::Zangetsu" = 0x1,
  "EPBGameModePlayer::ChildofLight" = 0x2,
}

export interface Inventory {
  Equipment: string[][];
  Inventory: InventoryItem[][];
}

export interface ShardPossession {
  Rank: number;
  Grade: number;
  Equipped: boolean;
  GradeValue: number;
  RankValue: number;
}

export interface ShardSkill {
  IsOn: boolean;
  shard: string;
  PossessionData: ShardPossession;
}

export interface Shards {
  m_Possession: Map<string, ShardPossession>[];
  m_Skill: Map<string, ShardSkill>;
  m_UpStatus: Map<string, number>;
}

export interface InventoryItem {
  id: string;
  quantity: number;
  index: number;
  unknown1: number;
  unknown2: number;
  unknown3: number;
  unknown4: number;
}

export let gvas: Gvas;

export const fieldsToParse = ["GameRecord", "StatusData"];

// prettier-ignore
export const pathsToInit = [
  { name: "GameRecordParsed.PCInfo", propertyType: `${PropertyType.Struct}:PBPCRecord`, value: {} },
  { name: "GameRecordParsed.PCInfo.m_ArtsExperience", propertyType: `${PropertyType.Array}:${PropertyType.Int}`, value: Array(48).fill(0) },
  { name: "GameRecordParsed.PCInfo.m_ArtsUseNum", propertyType: `${PropertyType.Array}:${PropertyType.Int}`, value: Array(48).fill(0) },
  { name: "GameRecordParsed.m_TotalKill", propertyType: `${PropertyType.Map}:${PropertyType.Name}-${PropertyType.Int}`, value: new Map() },
  { name: "Info.CharacterName", propertyType: PropertyType.Str, value: "Miriam" },
  { name: "Info.MapCompleteness", propertyType: PropertyType.Float, value: 0 },
  { name: "Info.TotalCoins", propertyType: PropertyType.Int, value: 0 },
  { name: "Info.TotalPlaySec", propertyType: PropertyType.Float, value: 0 },
  { name: "Info.TrueEndCount", propertyType: PropertyType.Int, value: 0 },
  { name: "StatusDataParsed.AdditionalMaxHP", propertyType: PropertyType.Float, value: 0 },
  { name: "StatusDataParsed.AdditionalMaxMP", propertyType: PropertyType.Float, value: 0 },
  { name: "StatusDataParsed.AdditionalMaxBullet", propertyType: PropertyType.Int, value: 0 },
];

export function beforeInitDataView(dataView: DataView): DataView {
  const platformRegions = getPlatformRegions().world as Validator;
  const key = parseInt(getObjKey(platformRegions, 0));
  const validator = platformRegions[key];

  if (!checkValidator(validator, key, dataView)) {
    return dataView;
  }

  const obfuscatedData = obfuscateData(new Uint8Array(dataView.buffer));

  dataView = new DataView(obfuscatedData.buffer);

  gvas = new Gvas(dataView);

  return dataView;
}

export function overrideGetRegions(): string[] {
  if (gvas?.header.saveType.match(/PBSaveGameData/)) {
    return ["world"];
  }

  return [];
}

export function beforeItemsParsing(): void {
  const json = parseJson();

  dataJson.set(json);
}

export function overrideParseItem(item: Item): Item | ItemTab {
  const $dataJson = get(dataJson);

  if ("id" in item && item.id === "message") {
    const itemMessage = item as ItemMessage;

    itemMessage.hidden = !$dataJson.PauseSaveBinary;

    return itemMessage;
  } else if ("id" in item && item.id === "miriamOnly") {
    const itemTab = item as ItemTab;

    itemTab.disabled =
      $dataJson.Info.PlayerType &&
      $dataJson.Info.PlayerType !==
        EPBGameModePlayer["EPBGameModePlayer::Miriam"];

    return itemTab;
  }

  return item;
}

export function onReady(): void {
  const $dataJson = get(dataJson);

  pathsToInit.forEach((path) => {
    if (path.name.match(/Parsed/)) {
      return;
    }

    const names = path.name.split(".");
    const key = names.pop() as string;

    let obj = $dataJson;

    names.forEach((key) => {
      obj = obj[key];
    });

    if (obj[key] === undefined) {
      obj[key] = path.value;

      gvas.updateTypes(path.name, path.propertyType);
    }
  });
}

export function overrideGetInt(item: Item): [boolean, number | undefined] {
  const $dataJson = get(dataJson);

  if (!$dataJson) {
    return [false, 0x0];
  }

  if ("id" in item && item.id === "progression") {
    const itemInt = item as ItemInt;

    const value = getJsonString(itemInt.jsonPath!);

    return [true, value ? 0x1 : 0x0];
  } else if ("id" in item && item.id === "difficulty") {
    const itemInt = item as ItemInt;

    const value = getJsonString(itemInt.jsonPath!);

    let difficulty = 0x0;

    if (value in EPBGameLevel) {
      difficulty = EPBGameLevel[value as keyof typeof EPBGameLevel];
    }

    return [true, difficulty];
  } else if ("id" in item && item.id === "location") {
    const itemInt = item as ItemInt;

    const roomId = getJsonString(itemInt.jsonPath!);

    const location = locationList.findIndex(
      (location) => location.roomId === roomId,
    );

    return [true, location];
  } else if ("id" in item && item.id === "character") {
    const itemInt = item as ItemInt;

    const value = getJsonString(itemInt.jsonPath!);

    let character = 0x0;

    if (value in EPBGameModePlayer) {
      character = EPBGameModePlayer[value as keyof typeof EPBGameModePlayer];
    }

    return [true, character];
  } else if ("id" in item && item.id === "level") {
    const itemInt = item as ItemInt;

    const experience = getJsonInt(itemInt.jsonPath!);

    const sqrt = Math.sqrt(experience * experience + 1000);
    const float = ((sqrt + experience) * 0.125) ** 0.333333333333333 + 0.01;

    const level = Math.min(Math.floor(float - 2.5 / float + 1), 99);

    return [true, level];
  } else if ("id" in item && item.id?.match(/equipment-/)) {
    const itemInt = item as ItemInt;

    const [, type] = item.id.split("-");

    const id = getJsonString(itemInt.jsonPath!);

    let list = itemList;

    if (type === "shard") {
      list = shardList;
    }

    const equipment = list.findIndex((item) => item.id === id);

    return [true, equipment];
  } else if ("id" in item && item.id?.match(/inventory-/)) {
    const [, , id] = item.id.split("-");
    const [location] = item.id.splitInt();

    const items: InventoryItem[] =
      $dataJson.InventoryDataParsed.Inventory[location];

    const index = items.findIndex((item) => item.id === id);

    let quantity = 0;

    if (index !== -1) {
      quantity = items[index].quantity;
    }

    return [true, quantity];
  } else if ("id" in item && item.id?.match(/shardPossession-/)) {
    const [, field, , id] = item.id.split("-");
    const [possessionIndex] = item.id.splitInt();

    const shard = getShardPossession(possessionIndex, id);

    const int = shard[field as keyof ShardPossession] as number;

    return [true, int];
  }

  return [false, undefined];
}

export function overrideSetInt(item: Item, value: string): boolean {
  const $dataJson = get(dataJson);

  if ("id" in item && item.id === "difficulty") {
    const itemInt = item as ItemInt;

    const int = parseInt(value);

    const difficulty = Object.keys(EPBGameLevel).find(
      (key) => EPBGameLevel[key as keyof typeof EPBGameLevel] === int,
    );

    if (difficulty) {
      setJsonString(itemInt.jsonPath!, difficulty);
    }

    return true;
  } else if ("id" in item && item.id === "location") {
    const index = parseInt(value);

    const location = locationList[index];
    const area = areas.find((area) => area.index === location.area);

    setJsonString("RoomID", location.roomId);
    setJsonString("AreaID", area!.areaId);
    setJsonString("Info.RoomID", location.roomId);
    setJsonString("Info.AreaID", area!.areaId.substring(6));
    setJsonInt("PCInfo.Location.x", "float32", location.coordinates.x);
    setJsonInt("PCInfo.Location.y", "float32", location.coordinates.y);
    setJsonInt("PCInfo.Location.z", "float32", location.coordinates.z);

    return true;
  } else if ("id" in item && item.id === "level") {
    const itemInt = item as ItemInt;

    const level = parseInt(value) - 1;

    const sqrt = Math.sqrt(level ** 2 + 10);
    const float = ((level + sqrt) / 2 - 0.01) ** 3;

    const experience = float / 0.25 - 125 / (float * 2) + 1;

    setJsonInt("Info.Level", "uint32", level + 1);
    setJsonInt(itemInt.jsonPath!, "uint32", experience);

    return true;
  } else if ("id" in item && item.id?.match(/equipment/)) {
    const itemInt = item as ItemInt;

    const [, type] = item.id.split("-");
    const [location] = item.id.splitInt();

    let list = itemList;

    if (type === "shard") {
      list = shardList;
    }

    const index = parseInt(value);

    let id = "None";

    if (list[index]) {
      id = list[index].id;
    }

    setJsonString(itemInt.jsonPath!, id);

    const inventory: InventoryItem[][] =
      $dataJson.InventoryDataParsed.Inventory;

    const inventoryItem = inventory[location].find((item) => item.id === id);

    if (!inventoryItem) {
      inventory[location].push({
        id,
        quantity: 1,
        index: inventory[location].length,
        unknown1: 0x0,
        unknown2: 0x0,
        unknown3: 0x0,
        unknown4: 0x0,
      });
    } else if (inventoryItem.quantity === 0) {
      inventoryItem.quantity = 1;
    }

    return true;
  } else if ("id" in item && item.id?.match(/inventory-/)) {
    const [, , id] = item.id.split("-");
    const [location, possessionIndex] = item.id.splitInt();

    const int = parseInt(value);

    const items: InventoryItem[] =
      $dataJson.InventoryDataParsed.Inventory[location];

    const index = items.findIndex((item) => item.id === id);

    if (index !== -1) {
      items[index].quantity = int;
    } else {
      items.push({
        id,
        quantity: int,
        index: items.length,
        unknown1: 0x0,
        unknown2: 0x0,
        unknown3: 0x0,
        unknown4: 0x0,
      });
    }

    if (possessionIndex !== undefined) {
      const shard = getShardPossession(possessionIndex, id);

      shard.Grade = Math.max(1, int);
    }

    dataJson.set($dataJson);

    return true;
  } else if ("id" in item && item.id?.match(/shardPossession-/)) {
    const [, field, , id] = item.id.split("-");
    const [possessionIndex] = item.id.splitInt();

    const shard = getShardPossession(possessionIndex, id);

    (shard[field as keyof ShardPossession] as number) = parseInt(value);

    return true;
  }

  return false;
}

export function beforeSaving(): ArrayBufferLike {
  updateJson();

  gvas.updateJson(get(dataJson));

  const obfuscatedData = obfuscateData(new Uint8Array(gvas.writeToBuffer()));

  const hash = md5.create();
  hash.update(obfuscatedData);

  const checksum = new Uint8Array(hash.arrayBuffer());

  return mergeUint8Arrays(obfuscatedData, checksum).buffer;
}

export function obfuscateData(data: Uint8Array): Uint8Array {
  const obfuscatedData = new Uint8Array(data.length);

  for (let i = 0x0; i < data.length; i += 0x1) {
    obfuscatedData[i] = data[i] ^ (0x3a + i) % 0xff;
  }

  return obfuscatedData;
}

function getShardPossession(index: number, id: string): ShardPossession {
  const $dataJson = get(dataJson);

  if (index === 0x5) {
    const shards: Map<string, ShardSkill> =
      $dataJson.ShardPossessionParsed.m_Skill;

    let shard = shards.get(id);

    if (!shard) {
      shard = {
        IsOn: false,
        shard: id,
        PossessionData: {
          Rank: 1,
          Grade: 1,
          Equipped: false,
          GradeValue: 0,
          RankValue: 0,
        },
      };

      shards.set(id, shard);
    }

    return shard.PossessionData;
  }

  const shards: Map<string, ShardPossession> =
    $dataJson.ShardPossessionParsed.m_Possession[index];

  let shard = shards.get(id);

  if (!shard) {
    shard = {
      Rank: 1,
      Grade: 1,
      Equipped: false,
      GradeValue: 0,
      RankValue: 0,
    };

    shards.set(id, shard);
  }

  return shard;
}
