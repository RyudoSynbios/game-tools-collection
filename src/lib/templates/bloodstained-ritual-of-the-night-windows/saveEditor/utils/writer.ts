import { get } from "svelte/store";

import { dataJson } from "$lib/stores";
import Writer from "$lib/utils/gvas/writer";

import { fieldsToParse, type Inventory, type Shards } from "../utils";

export function updateJson(): void {
  const $dataJson = get(dataJson);

  fieldsToParse.forEach((field) => {
    const writer = new Writer(
      0x10000,
      $dataJson[`${field}Parsed`],
      $dataJson[`${field}Types`],
    );

    writer.write();

    $dataJson[field] = [...new Uint8Array(writer.buffer)];
  });

  writeInventoryData();
  writeShardPossession();
}

export function writeInventoryData(): void {
  const $dataJson = get(dataJson);

  const inventory = $dataJson.InventoryDataParsed as Inventory;

  const writer = new Writer(0x10000);

  for (let i = 0x0; i < 0x2; i += 0x1) {
    writer.setString(inventory.Equipment[0][i]);
  }

  writer.shiftOffset(0x4);

  inventory.Equipment.forEach((set) => {
    writer.shiftOffset(0x4);

    set.forEach((item) => {
      writer.setString(item);
    });
  });

  inventory.Inventory.forEach((type, index) => {
    writer.setInt(type.length, "uint32");

    type.forEach((item) => {
      writer.setString(item.id);
      writer.setInt(item.quantity, "uint32");
      writer.setInt(item.index, "uint32");
      writer.setInt(item.unknown1, "uint32");
      writer.setInt(item.unknown2, "uint32");
      writer.setInt(item.unknown3, "uint32");
      writer.setInt(item.unknown4, "uint32");
    });

    if (index === 0xe) {
      writer.setInt(0x1, "uint8");
    }
  });

  writer.setInt(0x4, "uint8");

  writer.end();

  $dataJson.InventoryData = [...new Uint8Array(writer.buffer)];
}

const shardsTypes = {
  m_Possession: "MapProperty:NameProperty-StructProperty:m_Possession",
  m_Possession$ID: "",
  "m_Possession.Equipped": "BoolProperty",
  "m_Possession.Grade": "IntProperty",
  "m_Possession.GradeValue": "FloatProperty",
  "m_Possession.Rank": "IntProperty",
  "m_Possession.RankValue": "FloatProperty",
  m_Skill: "MapProperty:NameProperty-StructProperty:m_Skill",
  m_Skill$ID: "",
  "m_Skill.IsOn": "BoolProperty",
  "m_Skill.PossessionData": "StructProperty:PBShardPossessionData",
  "m_Skill.PossessionData$ID": "00000000000000000000000000000000",
  "m_Skill.PossessionData.Equipped": "BoolProperty",
  "m_Skill.PossessionData.Grade": "IntProperty",
  "m_Skill.PossessionData.GradeValue": "FloatProperty",
  "m_Skill.PossessionData.Rank": "IntProperty",
  "m_Skill.PossessionData.RankValue": "FloatProperty",
  "m_Skill.shard": "NameProperty",
  m_UpStatus: "MapProperty:ByteProperty-FloatProperty",
};

export function writeShardPossession(): void {
  const $dataJson = get(dataJson);

  const shards = $dataJson.ShardPossessionParsed as Shards;

  const writer = new Writer(0x10000, {}, shardsTypes);

  for (let i = 0x0; i < 0x5; i += 0x1) {
    writer.setString("None");

    writer.shiftOffset(0x4);

    const m_Possession = shards.m_Possession[i] as any;
    const m_Skill = shards.m_Skill as any;
    const m_UpStatus = shards.m_UpStatus;

    if (i < 0x4) {
      writer.write({ m_Possession }, false);
    } else {
      writer.write({ m_Skill, m_UpStatus, m_Possession }, false);
    }
  }

  writer.setString("None");

  writer.shiftOffset(0x4);

  writer.end();

  $dataJson.ShardPossession = [...new Uint8Array(writer.buffer)];
}
