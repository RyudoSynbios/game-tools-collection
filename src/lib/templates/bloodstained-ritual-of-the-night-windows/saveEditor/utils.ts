import { md5 } from "js-md5";
import { get } from "svelte/store";

import { dataJson, gameTemplate } from "$lib/stores";
import { intToArray, stringToArray } from "$lib/utils/bytes";
import { getObjKey, mergeUint8Arrays } from "$lib/utils/format";
import Gvas, { type StructProperty } from "$lib/utils/gvas";
import Parser from "$lib/utils/gvas/parser";
import { getJsonString, setJsonString } from "$lib/utils/json";
import { checkValidator } from "$lib/utils/validator";

import type { Item, ItemInt, Validator } from "$lib/types";

import { parseInventoryData } from "./utils/parser";

enum EPBGameLevel {
  "EPBGameLevel::Normal" = 0x0,
  "EPBGameLevel::Hard" = 0x1,
  "EPBGameLevel::Nightmare" = 0x2,
}

let gvas: Gvas;

export function beforeInitDataView(dataView: DataView): DataView {
  const $gameTemplate = get(gameTemplate);

  const regionValidator = $gameTemplate.validator.regions.world as Validator;
  const key = parseInt(getObjKey(regionValidator, 0));
  const validator = regionValidator[key];

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
  const json = generateJson();

  dataJson.set(json);
}

export function overrideGetInt(item: Item): [boolean, number | undefined] {
  if ("id" in item && item.id === "difficulty") {
    const itemInt = item as ItemInt;

    const value = getJsonString(itemInt.jsonPath!);

    let difficulty = 0x0;

    if (value in EPBGameLevel) {
      difficulty = EPBGameLevel[value as keyof typeof EPBGameLevel];
    }

    return [true, difficulty];
  }

  return [false, undefined];
}

export function overrideSetInt(item: Item, value: string): boolean {
  if ("id" in item && item.id === "difficulty") {
    const itemInt = item as ItemInt;

    const int = parseInt(value);

    const difficulty = Object.keys(EPBGameLevel).find(
      (key) => EPBGameLevel[key as keyof typeof EPBGameLevel] === int,
    );

    if (difficulty) {
      setJsonString(itemInt.jsonPath!, difficulty.length, difficulty);
    }

    return true;
  }

  return false;
}

export function beforeSaving(): ArrayBufferLike {
  const $dataJson = get(dataJson);

  gvas.updateJson($dataJson);

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

const fieldsToParse = ["StatusData"];

function generateJson(): StructProperty {
  const tmp = gvas.parseToJson();

  let json = tmp;

  if (json.PauseSaveBinary) {
    const data = new Uint8Array(tmp.PauseSaveBinary as number[]);
    const dataView = new DataView(data.buffer);

    const parser = new Parser(dataView);

    parser.parse();

    json = parser.json;
  }

  fieldsToParse.forEach((field) => {
    const data = new Uint8Array(json[field] as number[]);
    const dataView = new DataView(data.buffer);

    const parser = new Parser(dataView);

    parser.parse();

    json[`${field}Parsed`] = parser.json;
  });

  // ! !

  // const writer = new Writer(statusDataView, 0x0, json.StatusData, parser.types);

  // writer.write();

  // json.StatusData = [...new Uint8Array(writer.buffer)];

  // console.log("ED", json.StatusData);

  // ! !

  (json.InventoryDataParsed as unknown) = parseInventoryData(json);

  // ! !

  const uint8Arrays: Uint8Array[] = [];

  for (let i = 0x0; i < 0x2; i += 0x1) {
    const string = json.InventoryDataParsed.Equipment[0][i];

    const uint8Array = new Uint8Array(0x5 + string.length);

    uint8Array.set(intToArray(string.length + 0x1, "uint32"));
    uint8Array.set(stringToArray(string), 0x4);

    uint8Arrays.push(uint8Array);
  }

  uint8Arrays.push(new Uint8Array(0x4));

  json.InventoryDataParsed.Equipment.forEach((set) => {
    uint8Arrays.push(new Uint8Array(0x4));

    set.forEach((item) => {
      const uint8Array = new Uint8Array(0x5 + item.length);

      uint8Array.set(intToArray(item.length + 0x1, "uint32"));
      uint8Array.set(stringToArray(item), 0x4);

      uint8Arrays.push(uint8Array);
    });
  });

  json.InventoryDataParsed.Inventory.forEach((type, index) => {
    uint8Arrays.push(new Uint8Array(intToArray(type.length, "uint32")));

    type.forEach((item) => {
      const string = item.id;
      let lengthWrite = item.id.length + 0x1;
      let length = lengthWrite;
      let letterDataType: "uint8" | "uint16" = "uint8";

      if (string.match(/è|é|’/)) {
        lengthWrite *= -1;
        length *= 0x2;
        letterDataType = "uint16";
      }

      const uint8Array = new Uint8Array(length + 0x1c);

      uint8Array.set(intToArray(lengthWrite, "uint32"));
      uint8Array.set(stringToArray(string, 0x0, letterDataType), 0x4);
      uint8Array.set(intToArray(item.quantity, "uint32"), length + 0x4);
      uint8Array.set(intToArray(item.index, "uint32"), length + 0x8);
      uint8Array.set(intToArray(item.unknown1, "uint32"), length + 0xc);
      uint8Array.set(intToArray(item.unknown2, "uint32"), length + 0x10);
      uint8Array.set(intToArray(item.unknown3, "uint32"), length + 0x14);
      uint8Array.set(intToArray(item.unknown4, "uint32"), length + 0x18);

      uint8Arrays.push(uint8Array);
    });

    if (index === 0xe) {
      uint8Arrays.push(new Uint8Array(0x1).fill(0x1));
    }
  });

  uint8Arrays.push(new Uint8Array(0x1).fill(0x4));

  // # #

  json.InventoryData = [...mergeUint8Arrays(...uint8Arrays)];

  // # #

  return json;
}
