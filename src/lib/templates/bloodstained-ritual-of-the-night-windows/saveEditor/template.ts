import type { GameJson } from "$lib/types";

import {
  accessories,
  bestiary,
  bodies,
  bullets,
  conjureShards,
  directionalShards,
  familiarShards,
  heads,
  itemList,
  itemTypes,
  manipulativeShards,
  passiveShards,
  scarfs,
  shardList,
  shardTypes,
  weapons,
  weaponsGroups,
  weaponTypes,
} from "./utils/resource";

const template: GameJson = {
  validator: {
    fileNames: [/^Story_Slot([0-9]+)/],
    regions: {
      world: {
        0x0: [0x7d, 0x6d, 0x7d, 0x6e],
      },
    },
    text: "Drag 'n' drop here or click to add a save file.",
    hint: "Designed to work with v1.6.\nOther versions may work, but may corrupt the save.\nPlease make a backup before editing.",
    error: "Not a valid save file.",
  },
  items: [
    {
      type: "tabs",
      items: [
        {
          name: "General",
          items: [
            {
              id: "message",
              type: "message",
              message:
                "This file is a suspended save. You will need to return to title screen and reload the save to see the changes.",
              hidden: true,
            },
            {
              type: "section",
              flex: true,
              items: [
                {
                  name: "Name",
                  offset: 0x0,
                  jsonPath: "Info.CharacterName",
                  length: 0x11,
                  type: "variable",
                  dataType: "string",
                  letterDataType: "uint8",
                  test: true,
                },
                {
                  id: "progression",
                  name: "Progression",
                  offset: 0x0,
                  jsonPath: "Info.TrueEndCount",
                  type: "variable",
                  dataType: "uint32",
                  resource: "progressions",
                },
                {
                  id: "difficulty",
                  name: "Difficulty",
                  offset: 0x0,
                  jsonPath: "Info.GameLevel",
                  type: "variable",
                  dataType: "uint32",
                  resource: "difficulties",
                },
                {
                  name: "Playtime",
                  type: "group",
                  mode: "time",
                  items: [
                    {
                      offset: 0x0,
                      jsonPath: "Info.TotalPlaySec",
                      type: "variable",
                      dataType: "uint32",
                      bigEndian: true,
                      operations: [
                        {
                          convert: { from: "seconds", to: "hours" },
                        },
                      ],
                      max: 99,
                    },
                    {
                      offset: 0x0,
                      jsonPath: "Info.TotalPlaySec",
                      type: "variable",
                      dataType: "uint32",
                      bigEndian: true,
                      operations: [
                        {
                          convert: {
                            from: "seconds",
                            to: "minutes",
                          },
                        },
                      ],
                      leadingZeros: 1,
                      max: 59,
                    },
                    {
                      offset: 0x0,
                      jsonPath: "Info.TotalPlaySec",
                      type: "variable",
                      dataType: "uint32",
                      bigEndian: true,
                      operations: [
                        {
                          convert: {
                            from: "seconds",
                            to: "seconds",
                          },
                        },
                      ],
                      leadingZeros: 1,
                      max: 59,
                    },
                  ],
                },
                {
                  name: "Map Discovery Rate",
                  offset: 0x0,
                  jsonPath: "Info.MapCompleteness",
                  type: "variable",
                  dataType: "float32",
                  suffix: "%",
                  disabled: true,
                },
              ],
            },
            {
              type: "section",
              flex: true,
              items: [
                {
                  name: "Gold",
                  offset: 0x0,
                  jsonPath: "Info.TotalCoins",
                  type: "variable",
                  dataType: "uint32",
                  max: 9999999,
                },
              ],
            },
          ],
        },
        {
          name: "Status",
          items: [
            {
              type: "tabs",
              vertical: true,
              items: [
                {
                  name: "General",
                  items: [
                    {
                      type: "section",
                      flex: true,
                      items: [
                        {
                          id: "character",
                          name: "Character",
                          offset: 0x0,
                          jsonPath: "Info.PlayerType",
                          type: "variable",
                          dataType: "uint32",
                          resource: "characters",
                          disabled: true,
                        },
                        {
                          id: "level",
                          name: "Level",
                          offset: 0x0,
                          jsonPath: "StatusDataParsed.TotalExperience",
                          type: "variable",
                          dataType: "uint32",
                          min: 1,
                          max: 99,
                        },
                        {
                          name: "Level (Save Preview)",
                          offset: 0x0,
                          jsonPath: "Info.Level",
                          type: "variable",
                          dataType: "uint32",
                          hidden: true,
                        },
                        {
                          name: "Experience",
                          offset: 0x0,
                          jsonPath: "StatusDataParsed.TotalExperience",
                          type: "variable",
                          dataType: "int32",
                        },
                      ],
                    },
                    {
                      type: "section",
                      flex: true,
                      items: [
                        {
                          name: "HP",
                          offset: 0x0,
                          jsonPath: "StatusDataParsed.HitPoint",
                          type: "variable",
                          dataType: "uint32",
                          max: 9999,
                        },
                        {
                          name: "MP",
                          offset: 0x0,
                          jsonPath: "StatusDataParsed.MagicPoint",
                          type: "variable",
                          dataType: "uint32",
                          max: 9999,
                        },
                      ],
                    },
                    {
                      type: "section",
                      flex: true,
                      items: [
                        {
                          name: "Bonus HP",
                          offset: 0x0,
                          jsonPath: "StatusDataParsed.AdditionalMaxHP",
                          type: "variable",
                          dataType: "uint32",
                          max: 9999,
                        },
                        {
                          name: "Bonus MP",
                          offset: 0x0,
                          jsonPath: "StatusDataParsed.AdditionalMaxMP",
                          type: "variable",
                          dataType: "uint32",
                          max: 9999,
                        },
                        {
                          name: "Bonus Bullets",
                          offset: 0x0,
                          jsonPath: "StatusDataParsed.AdditionalMaxBullet",
                          type: "variable",
                          dataType: "uint32",
                          max: 999,
                        },
                      ],
                    },
                  ],
                },
                {
                  name: "Equipped Gears",
                  items: [
                    {
                      type: "section",
                      flex: true,
                      items: [
                        {
                          id: "equipment-item-0",
                          name: "Weapon",
                          offset: 0x0,
                          jsonPath: "InventoryDataParsed.Equipment[0][0]",
                          type: "variable",
                          dataType: "uint32",
                          resource: "weapons",
                          autocomplete: true,
                        },
                        {
                          id: "equipment-item-1",
                          name: "Bullets",
                          offset: 0x0,
                          jsonPath: "InventoryDataParsed.Equipment[0][1]",
                          type: "variable",
                          dataType: "uint32",
                          resource: "bullets",
                          autocomplete: true,
                        },
                      ],
                    },
                    {
                      type: "section",
                      flex: true,
                      items: [
                        {
                          id: "equipment-item-3",
                          name: "Head",
                          offset: 0x0,
                          jsonPath: "InventoryDataParsed.Equipment[0][2]",
                          type: "variable",
                          dataType: "uint32",
                          resource: "heads",
                          autocomplete: true,
                        },
                        {
                          id: "equipment-item-2",
                          name: "Body",
                          offset: 0x0,
                          jsonPath: "InventoryDataParsed.Equipment[0][3]",
                          type: "variable",
                          dataType: "uint32",
                          resource: "bodies",
                          autocomplete: true,
                        },
                        {
                          id: "equipment-item-4",
                          name: "Accessory 1",
                          offset: 0x0,
                          jsonPath: "InventoryDataParsed.Equipment[0][4]",
                          type: "variable",
                          dataType: "uint32",
                          resource: "accessories",
                          autocomplete: true,
                        },
                        {
                          id: "equipment-item-4",
                          name: "Accessory 2",
                          offset: 0x0,
                          jsonPath: "InventoryDataParsed.Equipment[0][5]",
                          type: "variable",
                          dataType: "uint32",
                          resource: "accessories",
                          autocomplete: true,
                        },
                        {
                          id: "equipment-item-5",
                          name: "Scarf",
                          offset: 0x0,
                          jsonPath: "InventoryDataParsed.Equipment[0][6]",
                          type: "variable",
                          dataType: "uint32",
                          resource: "scarfs",
                          autocomplete: true,
                        },
                      ],
                    },
                  ],
                },
                {
                  name: "Equipped Shards",
                  flex: true,
                  items: [
                    {
                      id: "equipment-shard-10",
                      name: "Conjure",
                      offset: 0x0,
                      jsonPath: "InventoryDataParsed.Equipment[0][7]",
                      type: "variable",
                      dataType: "uint32",
                      resource: "conjureShards",
                      autocomplete: true,
                    },
                    {
                      id: "equipment-shard-11",
                      name: "Manipulative",
                      offset: 0x0,
                      jsonPath: "InventoryDataParsed.Equipment[0][8]",
                      type: "variable",
                      dataType: "uint32",
                      resource: "manipulativeShards",
                      autocomplete: true,
                    },
                    {
                      id: "equipment-shard-12",
                      name: "Directional",
                      offset: 0x0,
                      jsonPath: "InventoryDataParsed.Equipment[0][9]",
                      type: "variable",
                      dataType: "uint32",
                      resource: "directionalShards",
                      autocomplete: true,
                    },
                    {
                      id: "equipment-shard-13",
                      name: "Passive",
                      offset: 0x0,
                      jsonPath: "InventoryDataParsed.Equipment[0][10]",
                      type: "variable",
                      dataType: "uint32",
                      resource: "passiveShards",
                      autocomplete: true,
                    },
                    {
                      id: "equipment-shard-14",
                      name: "Familiar",
                      offset: 0x0,
                      jsonPath: "InventoryDataParsed.Equipment[0][11]",
                      type: "variable",
                      dataType: "uint32",
                      resource: "familiarShards",
                      autocomplete: true,
                    },
                  ],
                },
              ],
            },
          ],
        },
        {
          id: "miriamOnly",
          name: "Inventory",
          items: [
            {
              type: "tabs",
              vertical: true,
              items: itemTypes.map((type) => {
                if (type.index === 0x0) {
                  return {
                    name: type.name,
                    items: weaponTypes.map((subtype) => ({
                      name: subtype.name,
                      type: "section",
                      flex: true,
                      items: itemList
                        .filter((item) => item.subtype === subtype.index)
                        .map((item) => ({
                          id: `inventory-${type.location}-${item.id}`,
                          name: item.name,
                          offset: 0x0,
                          type: "variable",
                          dataType: "uint32",
                          max: type.max,
                        })),
                    })),
                  };
                }

                return {
                  name: type.name,
                  flex: true,
                  items: itemList
                    .filter((item) => item.type === type.index)
                    .map((item) => ({
                      id: `inventory-${type.location}-${item.id}`,
                      name: item.name,
                      offset: 0x0,
                      type: "variable",
                      dataType: "uint32",
                      max: type.max,
                    })),
                };
              }),
            },
          ],
        },
        {
          id: "miriamOnly",
          name: "Shards",
          items: [
            {
              type: "tabs",
              vertical: true,
              items: shardTypes.map((type) => ({
                name: type.name,
                items: shardList
                  .filter((shard) => shard.type === type.index)
                  .map((shard) => ({
                    name: shard.name,
                    type: "section",
                    flex: true,
                    items: [
                      {
                        id: `inventory-${type.location}-${shard.id}-${type.possessionIndex}`,
                        name: "Quantity",
                        offset: 0x0,
                        type: "variable",
                        dataType: "uint32",
                        max: 9,
                      },
                      {
                        id: `shardPossession-Rank-${type.possessionIndex}-${shard.id}`,
                        name: "Rank",
                        offset: 0x0,
                        type: "variable",
                        dataType: "uint32",
                        max: 9,
                      },
                      {
                        id: `shardPossession-RankValue-${type.possessionIndex}-${shard.id}`,
                        name: "Rank Value",
                        offset: 0x0,
                        type: "variable",
                        dataType: "uint32",
                        hidden: true,
                      },
                      {
                        id: `shardPossession-Grade-${type.possessionIndex}-${shard.id}`,
                        name: "Grade",
                        offset: 0x0,
                        type: "variable",
                        dataType: "uint32",
                        disabled: true,
                      },
                      {
                        id: `shardPossession-GradeValue-${type.possessionIndex}-${shard.id}`,
                        name: "Grade Value",
                        offset: 0x0,
                        type: "variable",
                        dataType: "uint32",
                        hidden: true,
                      },
                    ],
                  })),
              })),
            },
          ],
        },
        {
          id: "miriamOnly",
          name: "Archives",
          items: [
            {
              type: "tabs",
              vertical: true,
              items: [
                {
                  name: "Demons",
                  flex: true,
                  items: bestiary.map((enemy) => ({
                    name: enemy.name,
                    offset: 0x0,
                    jsonPath: `GameRecordParsed.m_TotalKill[${enemy.id}]`,
                    type: "variable",
                    dataType: "uint32",
                    // max: 0
                  })),
                },
                {
                  name: "Items",
                  planned: true,
                  items: [],
                },
                {
                  name: "Quests",
                  planned: true,
                  items: [],
                },
                {
                  name: "Alchemy Notes",
                  planned: true,
                  items: [],
                },
                {
                  name: "Compendium",
                  planned: true,
                  items: [],
                },
                {
                  name: "Personal Data",
                  planned: true,
                  items: [],
                },
                {
                  name: "Techniques",
                  planned: true,
                  items: [],
                },
                {
                  name: "Journal",
                  planned: true,
                  items: [],
                },
              ],
            },
          ],
        },
      ],
    },
  ],
  resources: {
    accessories,
    bodies,
    bullets,
    characters: {
      0x0: "Miriam",
      0x1: "Zangetsu",
      0x2: "ChildofLight",
    },
    conjureShards,
    difficulties: {
      0x0: "Normal",
      0x1: "Hard",
      0x2: "Nightmare",
    },
    directionalShards,
    familiarShards,
    heads,
    manipulativeShards,
    passiveShards,
    progressions: {
      0x0: "-",
      0x1: "Clear",
    },
    scarfs,
    weapons,
  },
  resourcesGroups: {
    weapons: weaponsGroups,
  },
  resourcesOrder: {
    accessories: [-1],
    bodies: [-1],
    bullets: [-1],
    conjureShards: [-1],
    directionalShards: [-1],
    familiarShards: [-1],
    heads: [-1],
    manipulativeShards: [-1],
    passiveShards: [-1],
    scarfs: [-1],
    weapon: [-1],
  },
};

export default template;
