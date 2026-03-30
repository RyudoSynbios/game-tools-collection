import { PropertyType, type StructProperty } from "$lib/utils/gvas";
import Parser from "$lib/utils/gvas/parser";

import {
  fieldsToParse,
  gvas,
  pathsToInit,
  Shards,
  type Inventory,
  type InventoryItem,
} from "../utils";

export function parseJson(): StructProperty {
  const json = gvas.parseToJson() as any;

  fieldsToParse.forEach((field) => {
    const data = new Uint8Array(json[field] as number[]);
    const dataView = new DataView(data.buffer);

    const parser = new Parser(dataView);

    parser.parse();

    json[`${field}Parsed`] = parser.json;
    json[`${field}Types`] = parser.types;

    pathsToInit.forEach((path) => {
      if (!path.name.match(`${field}Parsed`)) {
        return;
      }

      const names = path.name.split(".");
      const key = names.pop() as string;
      const typeKey = path.name.replace(`${field}Parsed.`, "");

      let obj = json;

      names.forEach((key) => {
        obj = obj[key];
      });

      names.shift();

      if (obj[key] === undefined) {
        obj[key] = path.value;
        json[`${field}Types`][typeKey] = path.propertyType;

        // prettier-ignore
        if (path.propertyType.match(PropertyType.Struct)) {
          json[`${field}Types`][`${typeKey}$ID`] = "00000000000000000000000000000000";
        }
      }
    });
  });

  (json.InventoryDataParsed as unknown) = parseInventoryData(json);
  (json.ShardPossessionParsed as unknown) = parseShardPossession(json);

  return json;
}

export function parseInventoryData(json: StructProperty): Inventory {
  const data = new Uint8Array(json.InventoryData as number[]);
  const dataView = new DataView(data.buffer);

  const inventoryData: Inventory = {
    Equipment: [],
    Inventory: [],
  };

  const parser = new Parser(dataView);

  // Skip the first unused fields
  parser.getString();
  parser.getString();

  parser.shiftOffset(0x4);

  // Equipment

  for (let i = 0x0; i < 0x9; i += 0x1) {
    parser.shiftOffset(0x4);

    const set = [];

    for (let j = 0x0; j < 0xd; j += 0x1) {
      set.push(parser.getString());
    }

    inventoryData.Equipment.push(set);
  }

  // Inventory

  for (let i = 0x0; i < 0x10; i += 0x1) {
    const type: InventoryItem[] = [];

    const count = parser.getInt("uint32", true);

    if (count > 0) {
      for (let j = 0x0; j < count; j += 0x1) {
        type.push({
          id: parser.getString(),
          quantity: parser.getInt("uint32", true),
          index: parser.getInt("uint32", true),
          unknown1: parser.getInt("uint32", true),
          unknown2: parser.getInt("uint32", true),
          unknown3: parser.getInt("uint32", true),
          unknown4: parser.getInt("uint32", true),
        });
      }
    }

    inventoryData.Inventory.push(type);

    if (i === 0xe) {
      parser.shiftOffset(0x1);
    }
  }

  return inventoryData;
}

export function parseShardPossession(json: StructProperty): Shards {
  const data = new Uint8Array(json.ShardPossession as number[]);
  const dataView = new DataView(data.buffer);

  const shardPossession: Shards = {
    m_Possession: [],
    m_Skill: new Map(),
    m_UpStatus: new Map(),
  };

  const parser = new Parser(dataView);

  // prettier-ignore
  for (let i = 0x0; i < 0x5; i += 0x1) {
    parser.getString();

    parser.shiftOffset(0x4);

    parser.parse();

    shardPossession.m_Possession[i] = (parser.json.m_Possession as any) || new Map();
    shardPossession.m_Skill = (parser.json.m_Skill as any) || new Map();
    shardPossession.m_UpStatus = (parser.json.m_UpStatus as any) || new Map();
  }

  return shardPossession;
}
