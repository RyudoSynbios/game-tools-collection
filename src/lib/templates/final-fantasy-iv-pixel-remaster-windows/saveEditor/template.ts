import type { GameJson, ItemTab } from "$lib/types";

import {
  abilityTypes,
  arms,
  bestiary,
  bodies,
  bodiesGroups,
  hands,
  handsGroups,
  heads,
  inventory,
  vehicles,
} from "./utils/resource";

const template: GameJson = {
  validator: {
    regions: {
      world: true,
    },
    text: "Drag 'n' drop here or click to add a save file.",
    hint: 'Designed to work with v1.2.0.\nOther versions may work, but may corrupt the save.\nPlease make a backup before editing.\n\nQuick Save: "nRl18osV3e9kPX9SMW"...\nSlot 1: "ookrbATYovG3tEOXIH..."\nSlot 2: "7nCxyzTwG31W3Zlg70..."\nBestiary: "dp3fS2vqP7GDj8eF72..."',
    error: "Not a valid save file.",
  },
  items: [
    {
      type: "tabs",
      items: [
        {
          id: "slot",
          name: "General",
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
                          name: "Playtime",
                          type: "group",
                          mode: "time",
                          items: [
                            {
                              id: "userData.playTime",
                              offset: 0x0,
                              type: "variable",
                              dataType: "float32",
                              operations: [
                                {
                                  convert: {
                                    from: "seconds",
                                    to: "hours",
                                  },
                                },
                              ],
                              max: 99,
                            },
                            {
                              id: "userData.playTime",
                              offset: 0x0,
                              type: "variable",
                              dataType: "float32",
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
                              test: true,
                            },
                            {
                              id: "userData.playTime",
                              offset: 0x0,
                              type: "variable",
                              dataType: "float32",
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
                              test: true,
                            },
                          ],
                        },
                        {
                          id: "userData.owendGil",
                          name: "Gil",
                          offset: 0x0,
                          type: "variable",
                          dataType: "uint32",
                          max: 9999999,
                        },
                      ],
                    },
                    {
                      type: "section",
                      flex: true,
                      items: [
                        {
                          id: "userData.currentArea",
                          name: "Location",
                          offset: 0x0,
                          length: 0x10,
                          type: "variable",
                          dataType: "string",
                          letterDataType: "uint8",
                          disabled: true,
                        },
                        {
                          id: "mapData.playerEntity.position.x",
                          name: "Position X",
                          offset: 0x0,
                          type: "variable",
                          dataType: "uint8",
                        },
                        {
                          id: "mapData.playerEntity.position.y",
                          name: "Position Y",
                          offset: 0x0,
                          type: "variable",
                          dataType: "uint8",
                        },
                        {
                          id: "mapData.playerEntity.position.z",
                          name: "Position Z",
                          offset: 0x0,
                          type: "variable",
                          dataType: "uint8",
                          hidden: true,
                        },
                      ],
                    },
                  ],
                },
                {
                  name: "Formation",
                  flex: true,
                  items: [...Array(5).keys()].map((index) => ({
                    id: `userData.corpsList.target[${index}].characterId`,
                    name: `Character ${index + 1}`,
                    offset: 0x0,
                    type: "variable",
                    dataType: "uint8",
                    resource: "characterNames",
                    autocomplete: true,
                  })),
                },
                {
                  name: "Vehicles",
                  items: vehicles.map((vehicle) => ({
                    id: `transporation-${vehicle.index}`,
                    name: vehicle.name,
                    type: "section",
                    flex: true,
                    items: [
                      {
                        id: `vehicleStatus-${vehicle.index}`,
                        name: "Status",
                        offset: 0x0,
                        type: "variable",
                        dataType: "uint8",
                        resource: "booleanEnabled",
                      },
                      {
                        id: `userData.ownedTransportationList.target[${vehicle.index}].mapId`,
                        name: "Location",
                        offset: 0x0,
                        type: "variable",
                        dataType: "uint8",
                        resource: "locations",
                      },
                      {
                        id: `userData.ownedTransportationList.target[${vehicle.index}].position.x`,
                        name: "Position X",
                        offset: 0x0,
                        type: "variable",
                        dataType: "uint8",
                      },
                      {
                        id: `userData.ownedTransportationList.target[${vehicle.index}].position.y`,
                        name: "Position Y",
                        offset: 0x0,
                        type: "variable",
                        dataType: "uint8",
                      },
                      {
                        id: `userData.ownedTransportationList.target[${vehicle.index}].position.z`,
                        name: "Position Z",
                        offset: 0x0,
                        type: "variable",
                        dataType: "uint8",
                        hidden: true,
                      },
                    ],
                  })),
                },
                {
                  name: "Miscellaneous",
                  items: [
                    {
                      type: "section",
                      flex: true,
                      items: [
                        {
                          id: "userData.totalGil",
                          name: "Total Gil Earned",
                          offset: 0x0,
                          type: "variable",
                          dataType: "int32",
                          min: 0,
                          max: 999999999,
                        },
                        {
                          id: "userData.openChestCount",
                          name: "Opened Chest Count",
                          offset: 0x0,
                          type: "variable",
                          dataType: "uint32",
                          disabled: true,
                        },
                      ],
                    },
                    {
                      type: "section",
                      flex: true,
                      items: [
                        {
                          id: "userData.battleCount",
                          name: "Battle Count",
                          offset: 0x0,
                          type: "variable",
                          dataType: "int32",
                          min: 0,
                          max: 999999999,
                        },
                        {
                          id: "userData.monstersKilledCount",
                          name: "Slayed Monster Count",
                          offset: 0x0,
                          type: "variable",
                          dataType: "int32",
                          min: 0,
                          max: 999999999,
                        },
                      ],
                    },
                  ],
                },
              ],
            },
          ],
        },
        {
          id: "slot",
          name: "Party",
          items: [
            {
              id: "party",
              type: "tabs",
              vertical: true,
              resource: "characterEnum",
              items: [...Array(13).keys()].map(
                (index) =>
                  ({
                    items: [
                      {
                        type: "tabs",
                        items: [
                          {
                            name: "Status",
                            items: [
                              {
                                type: "section",
                                flex: true,
                                hidden: true,
                                items: [
                                  {
                                    id: `userData.ownedCharacterList.target[${index}].isEnableCorps`,
                                    name: "Is Enabled",
                                    offset: 0x0,
                                    type: "variable",
                                    dataType: "boolean",
                                    hidden: true,
                                  },
                                  {
                                    id: `userData.ownedCharacterList.target[${index}].id`,
                                    name: "ID",
                                    offset: 0x0,
                                    type: "variable",
                                    dataType: "uint32",
                                    hidden: true,
                                  },
                                  {
                                    id: `userData.ownedCharacterList.target[${index}].characterStatusId`,
                                    name: "Chracter Status ID",
                                    offset: 0x0,
                                    type: "variable",
                                    dataType: "uint32",
                                    hidden: true,
                                  },
                                ],
                              },
                              {
                                type: "section",
                                flex: true,
                                items: [
                                  {
                                    id: `userData.ownedCharacterList.target[${index}].name`,
                                    name: "Name",
                                    offset: 0x0,
                                    length: 0xc,
                                    type: "variable",
                                    dataType: "string",
                                    letterDataType: "uint8",
                                  },
                                  {
                                    id: `userData.ownedCharacterList.target[${index}].jobId`,
                                    name: "Character",
                                    offset: 0x0,
                                    type: "variable",
                                    dataType: "uint32",
                                    resource: "characters",
                                    disabled: true,
                                  },
                                  {
                                    id: `userData.ownedCharacterList.target[${index}].parameter.addtionalLevel`,
                                    name: "Level",
                                    offset: 0x0,
                                    type: "variable",
                                    dataType: "uint32",
                                    min: 1,
                                    max: 99,
                                  },
                                  {
                                    id: `userData.ownedCharacterList.target[${index}].currentExp`,
                                    name: "Experience",
                                    offset: 0x0,
                                    type: "variable",
                                    dataType: "uint32",
                                    max: 9999999,
                                  },
                                ],
                              },
                              {
                                type: "section",
                                flex: true,
                                items: [
                                  {
                                    name: "HP",
                                    type: "group",
                                    mode: "fraction",
                                    items: [
                                      {
                                        id: `userData.ownedCharacterList.target[${index}].parameter.currentHP`,
                                        offset: 0x0,
                                        type: "variable",
                                        dataType: "uint32",
                                        max: 9999,
                                      },
                                      {
                                        id: `userData.ownedCharacterList.target[${index}].parameter.addtionalMaxHp`,
                                        offset: 0x0,
                                        type: "variable",
                                        dataType: "uint32",
                                        max: 9999,
                                      },
                                    ],
                                  },
                                  {
                                    name: "MP",
                                    type: "group",
                                    mode: "fraction",
                                    items: [
                                      {
                                        id: `userData.ownedCharacterList.target[${index}].parameter.currentMP`,
                                        offset: 0x0,
                                        type: "variable",
                                        dataType: "uint32",
                                        max: 999,
                                      },
                                      {
                                        id: `userData.ownedCharacterList.target[${index}].parameter.addtionalMaxMp`,
                                        offset: 0x0,
                                        type: "variable",
                                        dataType: "uint32",
                                        max: 999,
                                      },
                                    ],
                                  },
                                ],
                              },
                              {
                                type: "section",
                                flex: true,
                                items: [
                                  {
                                    id: `userData.ownedCharacterList.target[${index}].parameter.addtionalPower`,
                                    name: "Base Strength",
                                    offset: 0x0,
                                    type: "variable",
                                    dataType: "uint32",
                                    max: 99,
                                  },
                                  {
                                    id: `userData.ownedCharacterList.target[${index}].parameter.addtionalAgility`,
                                    name: "Base Agility",
                                    offset: 0x0,
                                    type: "variable",
                                    dataType: "uint32",
                                    max: 99,
                                  },
                                  {
                                    id: `userData.ownedCharacterList.target[${index}].parameter.addtionalVitality`,
                                    name: "Base Stamina",
                                    offset: 0x0,
                                    type: "variable",
                                    dataType: "uint32",
                                    max: 99,
                                  },
                                  {
                                    id: `userData.ownedCharacterList.target[${index}].parameter.addtionalIntelligence`,
                                    name: "Base Intellect",
                                    offset: 0x0,
                                    type: "variable",
                                    dataType: "uint32",
                                    max: 99,
                                  },
                                  {
                                    id: `userData.ownedCharacterList.target[${index}].parameter.addtionalSpirit`,
                                    name: "Base Spirit",
                                    offset: 0x0,
                                    type: "variable",
                                    dataType: "uint32",
                                    max: 99,
                                  },
                                ],
                              },
                              {
                                type: "section",
                                flex: true,
                                items: [
                                  {
                                    id: `userData.ownedCharacterList.target[${index}].parameter.addtionalAttack`,
                                    name: "Attack",
                                    offset: 0x0,
                                    type: "variable",
                                    dataType: "uint32",
                                    hidden: true,
                                  },
                                  {
                                    id: `userData.ownedCharacterList.target[${index}].parameter.addtionalDefense`,
                                    name: "Defense",
                                    offset: 0x0,
                                    type: "variable",
                                    dataType: "uint32",
                                    hidden: true,
                                  },
                                  {
                                    id: `userData.ownedCharacterList.target[${index}].parameter.addtionalAbilityDefense`,
                                    name: "AbilityDefense",
                                    offset: 0x0,
                                    type: "variable",
                                    dataType: "uint32",
                                    hidden: true,
                                  },
                                  {
                                    id: `userData.ownedCharacterList.target[${index}].parameter.addtionalAbilityEvasionRate`,
                                    name: "AbilityEvasionRate",
                                    offset: 0x0,
                                    type: "variable",
                                    dataType: "uint32",
                                    hidden: true,
                                  },
                                  {
                                    id: `userData.ownedCharacterList.target[${index}].parameter.addtionalMagic`,
                                    name: "Magic",
                                    offset: 0x0,
                                    type: "variable",
                                    dataType: "uint32",
                                    hidden: true,
                                  },
                                  {
                                    id: `userData.ownedCharacterList.target[${index}].parameter.addtionalLuck`,
                                    name: "Luck",
                                    offset: 0x0,
                                    type: "variable",
                                    dataType: "uint32",
                                    hidden: true,
                                  },
                                  {
                                    id: `userData.ownedCharacterList.target[${index}].parameter.addtionalAccuracyRate`,
                                    name: "AccuracyRate",
                                    offset: 0x0,
                                    type: "variable",
                                    dataType: "uint32",
                                    hidden: true,
                                  },
                                  {
                                    id: `userData.ownedCharacterList.target[${index}].parameter.addtionalEvasionRate`,
                                    name: "EvasionRate",
                                    offset: 0x0,
                                    type: "variable",
                                    dataType: "uint32",
                                    hidden: true,
                                  },
                                  {
                                    id: `userData.ownedCharacterList.target[${index}].parameter.addtionalAbilityDisturbedRate`,
                                    name: "AbilityDisturbedRate",
                                    offset: 0x0,
                                    type: "variable",
                                    dataType: "uint32",
                                    hidden: true,
                                  },
                                  {
                                    id: `userData.ownedCharacterList.target[${index}].parameter.addtionalCriticalRate`,
                                    name: "CriticalRate",
                                    offset: 0x0,
                                    type: "variable",
                                    dataType: "uint32",
                                    hidden: true,
                                  },
                                  {
                                    id: `userData.ownedCharacterList.target[${index}].parameter.addtionalDamageDirmeter`,
                                    name: "DamageDirmeter",
                                    offset: 0x0,
                                    type: "variable",
                                    dataType: "uint32",
                                    hidden: true,
                                  },
                                  {
                                    id: `userData.ownedCharacterList.target[${index}].parameter.addtionalAbilityDefenseRate`,
                                    name: "AbilityDefenseRate",
                                    offset: 0x0,
                                    type: "variable",
                                    dataType: "uint32",
                                    hidden: true,
                                  },
                                  {
                                    id: `userData.ownedCharacterList.target[${index}].parameter.addtionalAccuracyCount`,
                                    name: "AccuracyCount",
                                    offset: 0x0,
                                    type: "variable",
                                    dataType: "uint32",
                                    hidden: true,
                                  },
                                  {
                                    id: `userData.ownedCharacterList.target[${index}].parameter.addtionalEvasionCount`,
                                    name: "EvasionCount",
                                    offset: 0x0,
                                    type: "variable",
                                    dataType: "uint32",
                                    hidden: true,
                                  },
                                  {
                                    id: `userData.ownedCharacterList.target[${index}].parameter.addtionalDefenseCount`,
                                    name: "DefenseCount",
                                    offset: 0x0,
                                    type: "variable",
                                    dataType: "uint32",
                                    hidden: true,
                                  },
                                  {
                                    id: `userData.ownedCharacterList.target[${index}].parameter.addtionalMagicDefenseCount`,
                                    name: "MagicDefenseCount",
                                    offset: 0x0,
                                    type: "variable",
                                    dataType: "uint32",
                                    hidden: true,
                                  },
                                  {
                                    id: `userData.ownedCharacterList.target[${index}].parameter.addionalWeight`,
                                    name: "Weight",
                                    offset: 0x0,
                                    type: "variable",
                                    dataType: "uint32",
                                    hidden: true,
                                  },
                                ],
                              },
                            ],
                          },
                          {
                            name: "Equipment",
                            items: [
                              {
                                type: "section",
                                flex: true,
                                items: [
                                  {
                                    id: `userData.ownedCharacterList.target[${index}].equipmentList.values[0].contentId`,
                                    name: "Right Hand",
                                    offset: 0x0,
                                    type: "variable",
                                    dataType: "uint32",
                                    resource: "rightHands",
                                    autocomplete: true,
                                  },
                                  {
                                    id: `userData.ownedCharacterList.target[${index}].equipmentList.values[1].contentId`,
                                    name: "Left Hand",
                                    offset: 0x0,
                                    type: "variable",
                                    dataType: "uint32",
                                    resource: "leftHands",
                                    autocomplete: true,
                                  },
                                ],
                              },
                              {
                                type: "section",
                                flex: true,
                                items: [
                                  {
                                    id: `userData.ownedCharacterList.target[${index}].equipmentList.values[3].contentId`,
                                    name: "Head",
                                    offset: 0x0,
                                    type: "variable",
                                    dataType: "uint32",
                                    resource: "heads",
                                    autocomplete: true,
                                  },
                                  {
                                    id: `userData.ownedCharacterList.target[${index}].equipmentList.values[2].contentId`,
                                    name: "Body",
                                    offset: 0x0,
                                    type: "variable",
                                    dataType: "uint32",
                                    resource: "bodies",
                                    autocomplete: true,
                                  },
                                  {
                                    id: `userData.ownedCharacterList.target[${index}].equipmentList.values[4].contentId`,
                                    name: "Arms",
                                    offset: 0x0,
                                    type: "variable",
                                    dataType: "uint32",
                                    resource: "arms",
                                    autocomplete: true,
                                  },
                                ],
                              },
                            ],
                          },
                          {
                            id: `abilities-${index}`,
                            name: "Abilities",
                            flex: true,
                            items: abilityTypes.map((type) => ({
                              id: `abilityType-${index}-${type.index}`,
                              name: type.name,
                              type: "bitflags",
                              flags: type.abilities.map((ability) => ({
                                offset: 0x0,
                                bit: 0,
                                label: ability.name,
                              })),
                            })),
                          },
                        ],
                      },
                    ],
                  }) as ItemTab,
              ),
            },
          ],
        },
        {
          id: "slot",
          name: "Items",
          items: [
            {
              type: "tabs",
              items: [
                {
                  name: "Inventory",
                  items: [
                    {
                      type: "tabs",
                      vertical: true,
                      items: inventory.map((type) => ({
                        name: type.name,
                        items: type.sections.map((section) => ({
                          name: section.name,
                          type: "section",
                          flex: true,
                          items: section.items.map((item) => ({
                            id: `inventory-items-${item.index}`,
                            name: item.name,
                            offset: 0x0,
                            type: "variable",
                            dataType: "uint32",
                            max: 99,
                          })),
                        })),
                      })),
                    },
                  ],
                },
                {
                  name: "Fat Chocobo",
                  items: [
                    {
                      type: "tabs",
                      vertical: true,
                      items: inventory
                        .filter((type) => type.name !== "Key Items")
                        .map((type) => ({
                          name: type.name,
                          items: type.sections.map((section) => ({
                            name: section.name,
                            type: "section",
                            flex: true,
                            items: section.items.map((item) => ({
                              id: `inventory-fatChocobo-${item.index}`,
                              name: item.name,
                              offset: 0x0,
                              type: "variable",
                              dataType: "uint32",
                              max: 99,
                            })),
                          })),
                        })),
                    },
                  ],
                },
              ],
            },
          ],
        },
        {
          id: "bestiary",
          name: "Bestiary",
          items: [
            {
              type: "tabs",
              vertical: true,
              items: [...Array(Math.ceil(bestiary.length / 20)).keys()].map(
                (page) => {
                  const start = page * 20;
                  const end = Math.min(start + 20, bestiary.length);

                  return {
                    name: `${`${start}`.padStart(3, "0")}-${`${end}`.padStart(3, "0")}`,
                    flex: true,
                    items: bestiary.slice(start, end).map((enemy) => ({
                      id: `monsterDefeats-${enemy.index}`,
                      name: enemy.name,
                      offset: 0x0,
                      type: "variable",
                      dataType: "uint32",
                      max: 9999,
                      test: true,
                    })),
                  };
                },
              ),
            },
          ],
        },
      ],
    },
  ],
  resources: {
    arms: {
      0xe3: "-",
      ...arms,
    },
    bodies: {
      0xe1: "-",
      ...bodies,
    },
    booleanEnabled: {
      0x0: "-",
      0x1: "Enabled",
    },
    characterEnum: "getCharacterNames()",
    characterNames: "getCharacterNames('true')",
    characters: {
      0x1: "Cecil (Paladin)",
      0x2: "Rosa",
      0x3: "Kain",
      0x4: "Rydia (Adult)",
      0x5: "Edge",
      0x6: "Cecil (Dark Knight)",
      0x7: "Rydia (Child)",
      0x8: "Tellah",
      0x9: "Edward",
      0xa: "Cid",
      0xb: "Yang",
      0xc: "Palom",
      0xd: "Porom",
      0xe: "FuSoYa",
    },
    heads: {
      0xe2: "-",
      ...heads,
    },
    leftHands: {
      0xe0: "-",
      ...hands,
    },
    locations: {
      "-1": "-",
      0x1: "Overworld",
      0x2: "Underworld",
      0x3: "Moon",
    },
    rightHands: {
      0x7f: "-",
      ...hands,
    },
  },
  resourcesGroups: {
    bodies: bodiesGroups,
    leftHands: handsGroups,
    rightHands: handsGroups,
  },
  resourcesOrder: {
    arms: [0xe3],
    bodies: [0xe2],
    heads: [0xe1],
    leftHands: [0xe0],
    locations: [-1],
    rightHands: [0x7f],
  },
};

export default template;
