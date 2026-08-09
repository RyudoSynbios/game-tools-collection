import { bitToOffset } from "$lib/utils/bytes";

import type { GameJson } from "$lib/types";

import {
  abilitiesGroups,
  abilitiesOrder,
  accessoriesOrder,
  armorOrder,
  heartlessList,
  heartlessReactionCommands,
  itemList,
  itemsOrder,
  itemTypes,
  nobodyList,
  nobodyReactionCommands,
  treasureList,
  weaponsGroups,
  weaponsOrder,
} from "./utils/resource";

const template: GameJson = {
  validator: {
    platforms: {
      playstation2: {
        europe_australia: {
          0x0: [
            0x42, 0x45, 0x53, 0x4c, 0x45, 0x53, 0x2d, 0x35, 0x34, 0x31, 0x31,
            0x34,
          ], // "BESLES-54114-"
        },
        usa: {
          0x0: [
            0x42, 0x41, 0x53, 0x4c, 0x55, 0x53, 0x2d, 0x32, 0x31, 0x30, 0x30,
            0x35, 0x2d,
          ], // "BASLUS-21005-"
        },
        japan: {
          0x0: [
            0x42, 0x49, 0x53, 0x4c, 0x50, 0x4d, 0x2d, 0x36, 0x36, 0x32, 0x33,
            0x33, 0x2d,
          ], // "BISLPM-66233-"
        },
        france: {
          0x0: [
            0x42, 0x45, 0x53, 0x4c, 0x45, 0x53, 0x2d, 0x35, 0x34, 0x32, 0x33,
            0x32, 0x2d,
          ], // "BESLES-54232-"
        },
        germany: {
          0x0: [
            0x42, 0x45, 0x53, 0x4c, 0x45, 0x53, 0x2d, 0x35, 0x34, 0x32, 0x33,
            0x33, 0x2d,
          ], // "BESLES-54233-"
        },
        italy: {
          0x0: [
            0x42, 0x45, 0x53, 0x4c, 0x45, 0x53, 0x2d, 0x35, 0x34, 0x32, 0x33,
            0x34, 0x2d,
          ], // "BESLES-54234-"
        },
        spain: {
          0x0: [
            0x42, 0x45, 0x53, 0x4c, 0x45, 0x53, 0x2d, 0x35, 0x34, 0x32, 0x33,
            0x35, 0x2d,
          ], // "BESLES-54235-"
        },
        finalMix: {
          0x0: [
            0x42, 0x49, 0x53, 0x4c, 0x50, 0x4d, 0x2d, 0x36, 0x36, 0x36, 0x37,
            0x35, 0x46, 0x4d, 0x2d,
          ], // "BISLPM-66675FM-"
        },
      },
      hd25Remix: {
        finalMix: {},
      },
    },
    text: "Drag 'n' drop here or click to add a save file.",
    error: "Not a valid save file.",
  },
  items: [
    {
      id: "slots",
      length: 0x0,
      type: "container",
      instanceType: "tabs",
      instances: 0,
      resource: "slotNames",
      items: [
        {
          id: "checksum",
          name: "Checksum",
          offset: 0x8,
          type: "checksum",
          dataType: "uint32",
          control: {
            offsetStart: 0x0,
            offsetEnd: 0xb4e0,
          },
        },
        {
          type: "tabs",
          items: [
            {
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
                              id: "finalMixOnly",
                              name: "Progression",
                              offset: 0x1099,
                              type: "variable",
                              dataType: "bit",
                              bit: 0,
                              resource: "progressions",
                            },
                            {
                              id: "difficuty",
                              name: "Difficulty",
                              offset: 0x1658,
                              type: "variable",
                              dataType: "uint8",
                              resource: "difficulties",
                            },
                            {
                              name: "Playtime",
                              type: "group",
                              mode: "time",
                              items: [
                                {
                                  id: "time-playtime",
                                  offset: 0x1604,
                                  type: "variable",
                                  dataType: "uint32",
                                  operations: [
                                    { "/": 50 },
                                    {
                                      convert: { from: "seconds", to: "hours" },
                                    },
                                  ],
                                  max: 999,
                                },
                                {
                                  id: "time-playtime",
                                  offset: 0x1604,
                                  type: "variable",
                                  dataType: "uint32",
                                  operations: [
                                    { "/": 50 },
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
                                  id: "time-playtime",
                                  offset: 0x1604,
                                  type: "variable",
                                  dataType: "uint32",
                                  operations: [
                                    { "/": 50 },
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
                              name: "Power",
                              offset: 0x166e,
                              type: "variable",
                              dataType: "uint8",
                              resource: "powers",
                            },
                            {
                              name: "Bonus Level",
                              offset: 0x2608,
                              type: "variable",
                              dataType: "uint8",
                              max: 50,
                            },
                          ],
                        },
                        {
                          type: "section",
                          flex: true,
                          items: [
                            {
                              name: "World",
                              offset: 0xc,
                              type: "variable",
                              dataType: "uint8",
                              resource: "worlds",
                              disabled: true,
                            },
                            {
                              name: "Room",
                              offset: 0xd,
                              type: "variable",
                              dataType: "uint8",
                              hidden: true,
                            },
                            {
                              name: "Spawn",
                              offset: 0xe,
                              type: "variable",
                              dataType: "uint8",
                              hidden: true,
                            },
                            {
                              name: "Munny",
                              offset: 0x1600,
                              type: "variable",
                              dataType: "uint32",
                              max: 999999,
                            },
                          ],
                        },
                      ],
                    },
                    {
                      name: "Formation",
                      flex: true,
                      items: [
                        {
                          length: 0x4,
                          type: "container",
                          instanceType: "section",
                          instances: 19,
                          resource: "worlds",
                          flex: true,
                          items: [
                            {
                              id: "formation",
                              name: "Character 1",
                              offset: 0x243c,
                              type: "variable",
                              dataType: "uint8",
                              resource: "formations",
                            },
                            {
                              id: "formation",
                              name: "Character 2",
                              offset: 0x243d,
                              type: "variable",
                              dataType: "uint8",
                              resource: "formations",
                            },
                            {
                              id: "formation",
                              name: "Character 3",
                              offset: 0x243e,
                              type: "variable",
                              dataType: "uint8",
                              resource: "formations",
                            },
                            {
                              id: "formation",
                              name: "Character 4",
                              offset: 0x243f,
                              type: "variable",
                              dataType: "uint8",
                              resource: "formations",
                            },
                          ],
                        },
                      ],
                    },
                    {
                      name: "Magic Level",
                      flex: true,
                      items: [
                        {
                          name: "Fire",
                          offset: 0x249c,
                          type: "variable",
                          dataType: "uint8",
                          resource: "magicLevelsFire",
                        },
                        {
                          name: "Blizzard",
                          offset: 0x249d,
                          type: "variable",
                          dataType: "uint8",
                          resource: "magicLevelsBlizzard",
                        },
                        {
                          name: "Thunder",
                          offset: 0x249e,
                          type: "variable",
                          dataType: "uint8",
                          resource: "magicLevelsThunder",
                        },
                        {
                          name: "Cure",
                          offset: 0x249f,
                          type: "variable",
                          dataType: "uint8",
                          resource: "magicLevelsCure",
                        },
                        {
                          name: "Magnet",
                          offset: 0x24d7,
                          type: "variable",
                          dataType: "uint8",
                          resource: "magicLevelsMagnet",
                        },
                        {
                          name: "Reflect",
                          offset: 0x24d8,
                          type: "variable",
                          dataType: "uint8",
                          resource: "magicLevelsReflect",
                        },
                      ],
                    },
                    {
                      name: "Summons",
                      items: [
                        {
                          type: "section",
                          flex: true,
                          items: [
                            {
                              name: "Level",
                              offset: 0x242e,
                              type: "variable",
                              dataType: "uint8",
                              min: 1,
                              max: 7,
                            },
                            {
                              name: "Experience",
                              offset: 0x25ec,
                              type: "variable",
                              dataType: "uint32",
                              max: 9999,
                            },
                          ],
                        },
                        {
                          name: "Acquired Summons",
                          type: "bitflags",
                          flags: [
                            { offset: 0x25c8, bit: 3, label: "Chicken Little" },
                            { offset: 0x25cc, bit: 4, label: "Genie" },
                            { offset: 0x25c8, bit: 0, label: "Stitch" },
                            { offset: 0x25cc, bit: 5, label: "Peter Pan" },
                          ],
                        },
                      ],
                    },
                  ],
                },
              ],
            },
            {
              name: "Party",
              items: [
                {
                  id: "party",
                  length: 0xf4,
                  type: "container",
                  instanceType: "tabs",
                  instances: 13,
                  resource: "characters",
                  vertical: true,
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
                              items: [
                                {
                                  name: "Level",
                                  offset: 0x166f,
                                  type: "variable",
                                  dataType: "uint8",
                                  min: 1,
                                  max: 99,
                                },
                                {
                                  name: "Experience",
                                  offset: 0x25e8,
                                  type: "variable",
                                  dataType: "uint32",
                                  max: 9999999,
                                  overrideShift: {
                                    parent: 1,
                                    shift: 0x0,
                                  },
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
                                  linked: true,
                                  items: [
                                    {
                                      id: "current",
                                      offset: 0x1664,
                                      type: "variable",
                                      dataType: "uint8",
                                    },
                                    {
                                      offset: 0x1665,
                                      type: "variable",
                                      dataType: "uint8",
                                      min: 1,
                                    },
                                  ],
                                },
                                {
                                  name: "MP",
                                  type: "group",
                                  mode: "fraction",
                                  linked: true,
                                  items: [
                                    {
                                      id: "current",
                                      offset: 0x1666,
                                      type: "variable",
                                      dataType: "uint8",
                                    },
                                    {
                                      offset: 0x1667,
                                      type: "variable",
                                      dataType: "uint8",
                                    },
                                  ],
                                },
                                {
                                  id: "drive-%index%",
                                  name: "Drive Gauge",
                                  offset: 0x2430,
                                  type: "variable",
                                  dataType: "uint8",
                                  max: 100,
                                  overrideShift: {
                                    parent: 1,
                                    shift: 0x0,
                                  },
                                },
                                {
                                  id: "drive-%index%",
                                  name: "Drive Level",
                                  type: "group",
                                  mode: "fraction",
                                  linked: true,
                                  items: [
                                    {
                                      id: "current",
                                      offset: 0x2431,
                                      type: "variable",
                                      dataType: "uint8",
                                      overrideShift: {
                                        parent: 1,
                                        shift: 0x0,
                                      },
                                    },
                                    {
                                      offset: 0x2432,
                                      type: "variable",
                                      dataType: "uint8",
                                      max: 9,
                                      overrideShift: {
                                        parent: 1,
                                        shift: 0x0,
                                      },
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
                                  name: "Bonus Strength",
                                  offset: 0x1669,
                                  type: "variable",
                                  dataType: "uint8",
                                  max: 100,
                                },
                                {
                                  name: "Bonus Magic",
                                  offset: 0x166a,
                                  type: "variable",
                                  dataType: "uint8",
                                  max: 100,
                                },
                                {
                                  name: "Bonus Defense",
                                  offset: 0x166b,
                                  type: "variable",
                                  dataType: "uint8",
                                  max: 100,
                                },
                                {
                                  name: "Bonus AP",
                                  offset: 0x1668,
                                  type: "variable",
                                  dataType: "uint8",
                                  max: 100,
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
                                  name: "Weapon",
                                  offset: 0x1660,
                                  type: "variable",
                                  dataType: "uint16",
                                  resource: "weapons",
                                  autocomplete: true,
                                },
                              ],
                            },
                            {
                              name: "Armor",
                              type: "section",
                              items: [
                                {
                                  name: "Slots",
                                  offset: 0x1670,
                                  type: "variable",
                                  dataType: "uint8",
                                  max: 8,
                                },
                              ],
                            },
                            {
                              type: "section",
                              flex: true,
                              items: [
                                {
                                  id: "item-4-0",
                                  name: "Armor 1",
                                  offset: 0x1674,
                                  type: "variable",
                                  dataType: "uint16",
                                  resource: "armors",
                                  autocomplete: true,
                                },
                                {
                                  id: "item-4-1",
                                  name: "Armor 2",
                                  offset: 0x1676,
                                  type: "variable",
                                  dataType: "uint16",
                                  resource: "armors",
                                  autocomplete: true,
                                },
                                {
                                  id: "item-4-2",
                                  name: "Armor 3",
                                  offset: 0x1678,
                                  type: "variable",
                                  dataType: "uint16",
                                  resource: "armors",
                                  autocomplete: true,
                                },
                                {
                                  id: "item-4-3",
                                  name: "Armor 4",
                                  offset: 0x167a,
                                  type: "variable",
                                  dataType: "uint16",
                                  resource: "armors",
                                  autocomplete: true,
                                },
                                {
                                  id: "item-4-4",
                                  name: "Armor 5",
                                  offset: 0x167c,
                                  type: "variable",
                                  dataType: "uint16",
                                  resource: "armors",
                                  autocomplete: true,
                                },
                                {
                                  id: "item-4-5",
                                  name: "Armor 6",
                                  offset: 0x167e,
                                  type: "variable",
                                  dataType: "uint16",
                                  resource: "armors",
                                  autocomplete: true,
                                },
                                {
                                  id: "item-4-6",
                                  name: "Armor 7",
                                  offset: 0x1680,
                                  type: "variable",
                                  dataType: "uint16",
                                  resource: "armors",
                                  autocomplete: true,
                                },
                                {
                                  id: "item-4-7",
                                  name: "Armor 8",
                                  offset: 0x1682,
                                  type: "variable",
                                  dataType: "uint16",
                                  resource: "armors",
                                  autocomplete: true,
                                },
                              ],
                            },
                            {
                              name: "Accessory",
                              type: "section",
                              items: [
                                {
                                  name: "Slots",
                                  offset: 0x1671,
                                  type: "variable",
                                  dataType: "uint8",
                                  max: 8,
                                },
                              ],
                            },
                            {
                              type: "section",
                              flex: true,
                              items: [
                                {
                                  id: "item-19-0",
                                  name: "Accessory 1",
                                  offset: 0x1684,
                                  type: "variable",
                                  dataType: "uint16",
                                  resource: "accessories",
                                  autocomplete: true,
                                },
                                {
                                  id: "item-19-1",
                                  name: "Accessory 2",
                                  offset: 0x1686,
                                  type: "variable",
                                  dataType: "uint16",
                                  resource: "accessories",
                                  autocomplete: true,
                                },
                                {
                                  id: "item-19-2",
                                  name: "Accessory 3",
                                  offset: 0x1688,
                                  type: "variable",
                                  dataType: "uint16",
                                  resource: "accessories",
                                  autocomplete: true,
                                },
                                {
                                  id: "item-19-3",
                                  name: "Accessory 4",
                                  offset: 0x168a,
                                  type: "variable",
                                  dataType: "uint16",
                                  resource: "accessories",
                                  autocomplete: true,
                                },
                                {
                                  id: "item-19-4",
                                  name: "Accessory 5",
                                  offset: 0x168c,
                                  type: "variable",
                                  dataType: "uint16",
                                  resource: "accessories",
                                  autocomplete: true,
                                },
                                {
                                  id: "item-19-5",
                                  name: "Accessory 6",
                                  offset: 0x168e,
                                  type: "variable",
                                  dataType: "uint16",
                                  resource: "accessories",
                                  autocomplete: true,
                                },
                                {
                                  id: "item-19-6",
                                  name: "Accessory 7",
                                  offset: 0x1690,
                                  type: "variable",
                                  dataType: "uint16",
                                  resource: "accessories",
                                  autocomplete: true,
                                },
                                {
                                  id: "item-19-7",
                                  name: "Accessory 8",
                                  offset: 0x1692,
                                  type: "variable",
                                  dataType: "uint16",
                                  resource: "accessories",
                                  autocomplete: true,
                                },
                              ],
                            },
                          ],
                        },
                        {
                          name: "Items",
                          items: [
                            {
                              type: "section",
                              items: [
                                {
                                  name: "Slots",
                                  offset: 0x1672,
                                  type: "variable",
                                  dataType: "uint8",
                                  max: 8,
                                },
                              ],
                            },
                            {
                              type: "section",
                              flex: true,
                              items: [
                                {
                                  id: "item-34-0",
                                  name: "Item 1",
                                  offset: 0x1694,
                                  type: "variable",
                                  dataType: "uint16",
                                  resource: "items",
                                  autocomplete: true,
                                },
                                {
                                  id: "item-34-1",
                                  name: "Item 2",
                                  offset: 0x1696,
                                  type: "variable",
                                  dataType: "uint16",
                                  resource: "items",
                                  autocomplete: true,
                                },
                                {
                                  id: "item-34-2",
                                  name: "Item 3",
                                  offset: 0x1698,
                                  type: "variable",
                                  dataType: "uint16",
                                  resource: "items",
                                  autocomplete: true,
                                },
                                {
                                  id: "item-34-3",
                                  name: "Item 4",
                                  offset: 0x169a,
                                  type: "variable",
                                  dataType: "uint16",
                                  resource: "items",
                                  autocomplete: true,
                                },
                                {
                                  id: "item-34-4",
                                  name: "Item 5",
                                  offset: 0x169c,
                                  type: "variable",
                                  dataType: "uint16",
                                  resource: "items",
                                  autocomplete: true,
                                },
                                {
                                  id: "item-34-5",
                                  name: "Item 6",
                                  offset: 0x169e,
                                  type: "variable",
                                  dataType: "uint16",
                                  resource: "items",
                                  autocomplete: true,
                                },
                                {
                                  id: "item-34-6",
                                  name: "Item 7",
                                  offset: 0x16a0,
                                  type: "variable",
                                  dataType: "uint16",
                                  resource: "items",
                                  autocomplete: true,
                                },
                                {
                                  id: "item-34-7",
                                  name: "Item 8",
                                  offset: 0x16a2,
                                  type: "variable",
                                  dataType: "uint16",
                                  resource: "items",
                                  autocomplete: true,
                                },
                              ],
                            },
                          ],
                        },
                        {
                          name: "Abilities",
                          items: [
                            {
                              type: "section",
                              flex: true,
                              items: [...Array(80).keys()].map((index) => ({
                                id: `ability-64-${index}`,
                                name: `Ability ${index + 1}`,
                                offset: 0x16b4 + index * 0x2,
                                type: "variable",
                                dataType: "uint16",
                                binary: {
                                  bitStart: 0,
                                  bitLength: 15,
                                },
                                resource: "abilities",
                                autocomplete: true,
                              })),
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
              name: "Drive Forms",
              items: [
                {
                  id: "driveForms",
                  length: 0x28,
                  type: "container",
                  instanceType: "tabs",
                  instances: 9,
                  resource: "driveForms",
                  vertical: true,
                  prependSubinstance: [
                    {
                      name: "General",
                      items: [
                        {
                          type: "section",
                          flex: true,
                          hidden: true,
                          items: [
                            {
                              id: "currentForm",
                              name: "Current Form",
                              offset: 0x242c,
                              type: "variable",
                              dataType: "uint8",
                              hidden: true,
                            },
                            {
                              name: "Current Summon",
                              offset: 0x242d,
                              type: "variable",
                              dataType: "uint8",
                              hidden: true,
                            },
                            {
                              name: "Drive Level",
                              offset: 0x2433,
                              type: "variable",
                              dataType: "uint8",
                              hidden: true,
                            },
                            {
                              name: "Active Drive Gauge",
                              type: "group",
                              mode: "fraction",
                              hidden: true,
                              items: [
                                {
                                  id: "current",
                                  offset: 0x2434,
                                  type: "variable",
                                  dataType: "float32",
                                  hidden: true,
                                },
                                {
                                  offset: 0x2438,
                                  type: "variable",
                                  dataType: "float32",
                                  max: 6000,
                                  hidden: true,
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
                              id: "finalMixExclude",
                              name: "Acquired Forms",
                              type: "bitflags",
                              flags: [
                                { offset: 0x25c8, bit: 1, label: "Valor" },
                                { offset: 0x25c8, bit: 2, label: "Wisdom" },
                                { offset: 0x25c8, bit: 4, label: "Final" },
                                { offset: 0x25c8, bit: 6, label: "Master" },
                              ],
                            },
                            {
                              id: "finalMixOnly",
                              name: "Acquired Forms",
                              type: "bitflags",
                              flags: [
                                { offset: 0x25c8, bit: 1, label: "Valor" },
                                { offset: 0x25c8, bit: 2, label: "Wisdom" },
                                { offset: 0x25d2, bit: 3, label: "Limit" },
                                { offset: 0x25c8, bit: 4, label: "Final" },
                                { offset: 0x25c8, bit: 6, label: "Master" },
                              ],
                            },
                          ],
                        },
                      ],
                    },
                  ],
                  items: [
                    {
                      type: "section",
                      flex: true,
                      items: [
                        {
                          name: "Level",
                          offset: 0x22c6,
                          type: "variable",
                          dataType: "uint8",
                          min: 1,
                          max: 7,
                        },
                        {
                          name: "???",
                          offset: 0x22c7,
                          type: "variable",
                          dataType: "uint8",
                          hidden: true,
                        },
                        {
                          name: "Experience",
                          offset: 0x22c8,
                          type: "variable",
                          dataType: "uint32",
                          max: 9999,
                        },
                        {
                          name: "Weapon",
                          offset: 0x22c4,
                          type: "variable",
                          dataType: "uint16",
                          resource: "weapons",
                          autocomplete: true,
                        },
                      ],
                    },
                    {
                      type: "section",
                      flex: true,
                      items: [...Array(24).keys()].map((index) => ({
                        id: `ability-15-${index}`,
                        name: `Ability ${index + 1}`,
                        offset: 0x22cc + index * 0x2,
                        type: "variable",
                        dataType: "uint16",
                        binary: {
                          bitStart: 0,
                          bitLength: 15,
                        },
                        resource: "abilities",
                        autocomplete: true,
                      })),
                    },
                  ],
                },
              ],
            },
            {
              name: "Stock",
              items: [
                {
                  type: "tabs",
                  vertical: true,
                  items: itemTypes.map((type) => ({
                    name: type.name,
                    items: type.subtypes.map((subtype, subTypeIndex) => ({
                      name: subtype,
                      type: "section",
                      flex: true,
                      items: itemList
                        .filter(
                          (item) =>
                            item.type === (type.index | subTypeIndex) &&
                            item.invIndex,
                        )
                        .sort((a, b) => a.order - b.order)
                        .map((item) => ({
                          id: item.finalMix ? "finalMixOnly" : undefined,
                          name: item.name,
                          offset: 0x2488 + item.invIndex!,
                          type: "variable",
                          dataType: "uint8",
                          max: 99,
                        })),
                    })),
                  })),
                },
              ],
            },
            {
              name: "Journal",
              items: [
                {
                  type: "tabs",
                  vertical: true,
                  items: [
                    {
                      name: "General",
                      items: [
                        {
                          name: "Status",
                          offset: 0x155e,
                          type: "variable",
                          dataType: "bit",
                          bit: 3,
                          resource: "booleanUnlocked",
                        },
                      ],
                    },
                    {
                      name: "Ansem Reports",
                      items: [
                        {
                          type: "bitflags",
                          flags: [
                            { offset: 0x25cc, bit: 6, label: "Secret Ansem Report 1" },
                            { offset: 0x25cc, bit: 7, label: "Secret Ansem Report 2" },
                            { offset: 0x25cd, bit: 0, label: "Secret Ansem Report 3" },
                            { offset: 0x25cd, bit: 1, label: "Secret Ansem Report 4" },
                            { offset: 0x25cd, bit: 2, label: "Secret Ansem Report 5" },
                            { offset: 0x25cd, bit: 3, label: "Secret Ansem Report 6" },
                            { offset: 0x25cd, bit: 4, label: "Secret Ansem Report 7" },
                            { offset: 0x25cd, bit: 5, label: "Secret Ansem Report 8" },
                            { offset: 0x25cd, bit: 6, label: "Secret Ansem Report 9" },
                            { offset: 0x25cd, bit: 7, label: "Secret Ansem Report 10" },
                            { offset: 0x25ce, bit: 0, label: "Secret Ansem Report 11" },
                            { offset: 0x25ce, bit: 1, label: "Secret Ansem Report 12" },
                            { offset: 0x25ce, bit: 2, label: "Secret Ansem Report 13" },
                          ],
                        },
                      ],
                    },
                    {
                      name: "Character Files",
                      planned: true,
                      items: [],
                    },
                    {
                      name: "The Heartless",
                      items: [
                        {
                          type: "section",
                          flex: true,
                          items: heartlessList.map((heartless) => {
                            const offset =
                              heartless.bit !== undefined ? 0xe50 : 0x2650;

                            return {
                              id: heartless.finalMix
                                ? "finalMixOnly"
                                : undefined,
                              name: heartless.name,
                              offset: offset + heartless.index,
                              type: "variable",
                              dataType:
                                heartless.bit !== undefined ? "bit" : "uint32",
                              bit: heartless.bit,
                              max: 9999,
                            };
                          }),
                        },
                        {
                          name: "Reaction Commands",
                          type: "section",
                          flex: true,
                          items: heartlessReactionCommands.map((command) => {
                            const heartless = heartlessList.find(
                              (heartless) =>
                                heartless.index === command.enemyIndex,
                            );
                            const name = `${heartless?.name}: ${command.name}`;

                            return {
                              id: command.finalMix ? "finalMixOnly" : undefined,
                              name,
                              offset: 0x2852 + command.index * 0x2,
                              type: "variable",
                              dataType: "uint16",
                              max: 999,
                              fixedWidth: true,
                            };
                          }),
                        },
                      ],
                    },
                    {
                      name: "The Nobodies",
                      items: [
                        {
                          type: "section",
                          flex: true,
                          items: nobodyList.map((nobody) => {
                            const offset =
                              nobody.bit !== undefined ? 0xe50 : 0x27d0;

                            return {
                              name: nobody.name,
                              offset: offset + nobody.index,
                              type: "variable",
                              dataType:
                                nobody.bit !== undefined ? "bit" : "uint32",
                              bit: nobody.bit,
                              max: 9999,
                            };
                          }),
                        },
                        {
                          name: "Reaction Commands",
                          type: "section",
                          flex: true,
                          items: nobodyReactionCommands.map((command) => {
                            const nobody = nobodyList.find(
                              (nobody) => nobody.index === command.enemyIndex,
                            );
                            const name = `${nobody?.name}: ${command.name}`;

                            return {
                              name,
                              offset: 0x2852 + command.index * 0x2,
                              type: "variable",
                              dataType: "uint16",
                              max: 999,
                              fixedWidth: true,
                            };
                          }),
                        },
                      ],
                    },
                    {
                      name: "Treasures",
                      items: [
                        {
                          type: "tabs",
                          vertical: true,
                          items: treasureList.map((world, index) => ({
                            name: world.name,
                            items: [
                              {
                                id: `treasures-${index}`,
                                type: "bitflags",
                                flags: world.treasures.map(
                                  (treasure, index) => ({
                                    offset: 0x156c + bitToOffset(treasure.index),
                                    bit: treasure.index % 8,
                                    label: `${(index + 1).leading0()} ${treasure.item}`,
                                    hidden: treasure.finalMix,
                                  }),
                                ),
                              },
                            ],
                          })),
                        },
                      ],
                    },
                    {
                      name: "Maps",
                      flex: true,
                      items: [
                        {
                          name: "Twilight Town",
                          type: "bitflags",
                          flags: [
                            { offset: 0x25d2, bit: 0, label: "Tower" },
                            { offset: 0x25cf, bit: 7, label: "Twilight Town" },
                            { offset: 0x25d1, bit: 7, label: "Mansion" },
                          ],
                        },
                        {
                          id: "finalMixFlags",
                          name: "Radiant Garden",
                          type: "bitflags",
                          flags: [
                            { offset: 0x25d1, bit: 0, label: "Castle Perimeter" },
                            { offset: 0x25d1, bit: 1, label: "The Great Maw" },
                            { offset: 0x25d2, bit: 4, label: "Dark Remembrance", hidden: true },
                            { offset: 0x25d2, bit: 5, label: "Depths of Remembrance", hidden: true },
                            { offset: 0x25d2, bit: 7, label: "Garden of Assemblage", hidden: true },
                            { offset: 0x25cf, bit: 5, label: "Marketplace" },
                          ],
                        },
                        {
                          name: "Beast's Castle",
                          type: "bitflags",
                          flags: [
                            { offset: 0x25c9, bit: 0, label: "Castle" },
                            { offset: 0x25c9, bit: 1, label: "Basement" },
                            { offset: 0x25c9, bit: 2, label: "Castle Walls" },
                          ],
                        },
                        {
                          name: "Olympus Coliseum",
                          type: "bitflags",
                          flags: [
                            { offset: 0x25cc, bit: 2, label: "Underworld" },
                            { offset: 0x25cc, bit: 3, label: "Caverns" },
                            { offset: 0x25cc, bit: 1, label: "Coliseum" },
                          ],
                        },
                        {
                          name: "Agrabah",
                          type: "bitflags",
                          flags: [
                            { offset: 0x25ca, bit: 7, label: "Cave of Wonders" },
                            { offset: 0x25cb, bit: 0, label: "Ruins" },
                            { offset: 0x25ca, bit: 6, label: "Agrabah" },
                          ],
                        },
                        {
                          name: "The Land of Dragons",
                          type: "bitflags",
                          flags: [
                            { offset: 0x25cc, bit: 0, label: "Palace" },
                            { offset: 0x25c9, bit: 6, label: "Encampment Area" },
                            { offset: 0x25c9, bit: 7, label: "Village Area" },
                          ],
                        },
                        {
                          name: "100 Acre Wood",
                          type: "bitflags",
                          flags: [
                            { offset: 0x25cb, bit: 3, label: "100 Acre Wood" },
                            { offset: 0x25cb, bit: 7, label: "Spooky Cave" },
                          ],
                        },
                        {
                          name: "Pride Lands",
                          type: "bitflags",
                          flags: [
                            { offset: 0x25d0, bit: 7, label: "Savannah" },
                            { offset: 0x25cf, bit: 4, label: "Pride Rock" },
                            { offset: 0x25d0, bit: 6, label: "Oasis" },
                          ],
                        },
                        {
                          name: "Atlantica",
                          type: "bitflags",
                          flags: [
                            { offset: 0x25cb, bit: 1, label: "Undersea Kingdom" },
                          ],
                        },
                        {
                          name: "Disney Castle",
                          type: "bitflags",
                          flags: [
                            { offset: 0x25ca, bit: 5, label: "Disney Castle" },
                          ],
                        },
                        {
                          name: "Timeless River",
                          type: "bitflags",
                          flags: [
                            { offset: 0x25ca, bit: 0, label: "Cornerstone Hill" },
                            { offset: 0x25d1, bit: 5, label: "Window of Time" },
                          ],
                        },
                        {
                          name: "Halloween Town",
                          type: "bitflags",
                          flags: [
                            { offset: 0x25cf, bit: 2, label: "Halloween Town" },
                            { offset: 0x25d0, bit: 4, label: "Christmas Town" },
                          ],
                        },
                        {
                          name: "Port Royal",
                          type: "bitflags",
                          flags: [
                            { offset: 0x25cf, bit: 3, label: "Naval" },
                            { offset: 0x25d0, bit: 2, label: "Isla de Muerta" },
                            { offset: 0x25d0, bit: 3, label: "Ship Graveyard" },
                          ],
                        },
                        {
                          name: "Space Paranoids",
                          type: "bitflags",
                          flags: [
                            { offset: 0x25cf, bit: 6, label: "Pit Cell Area" },
                            { offset: 0x25d1, bit: 2, label: "I/O Tower" },
                            { offset: 0x25d1, bit: 3, label: "Central Computer Core" },
                          ],
                        },
                        {
                          name: "The World That Never Was",
                          type: "bitflags",
                          flags: [
                            { offset: 0x25d0, bit: 0, label: "Dark City" },
                            { offset: 0x25d2, bit: 2, label: "Castle That Never Was" },
                          ],
                        },
                      ],
                    },
                    {
                      name: "Missions",
                      items: [],
                      planned: true,
                    },
                    {
                      name: "Minigames",
                      planned: true,
                      items: [],
                    },
                    {
                      name: "Combo Attacks",
                      flex: true,
                      items: [
                        {
                          name: "Donald / Fantasia",
                          offset: 0x2c5a,
                          type: "variable",
                          dataType: "uint16",
                          max: 999,
                        },
                        {
                          name: "Donald / Flare Force",
                          offset: 0x2c5c,
                          type: "variable",
                          dataType: "uint16",
                          max: 999,
                        },
                        {
                          name: "Goofy / Twister Fusion",
                          offset: 0x2c56,
                          type: "variable",
                          dataType: "uint16",
                          max: 999,
                        },
                        {
                          name: "Goofy / Teamwork",
                          offset: 0x2c58,
                          type: "variable",
                          dataType: "uint16",
                          max: 999,
                        },
                        {
                          name: "Beast / Howling Moon",
                          offset: 0x2c52,
                          type: "variable",
                          dataType: "uint16",
                          max: 999,
                        },
                        {
                          name: "Auron / Overdrive",
                          offset: 0x2c50,
                          type: "variable",
                          dataType: "uint16",
                          max: 999,
                        },
                        {
                          name: "Mulan / Dragonblaze",
                          offset: 0x2c54,
                          type: "variable",
                          dataType: "uint16",
                          max: 999,
                        },
                        {
                          name: "Aladdin / Trick Fantasy",
                          offset: 0x2c5e,
                          type: "variable",
                          dataType: "uint16",
                          max: 999,
                        },
                        {
                          name: "Jack / Applause, Applause",
                          offset: 0x2c64,
                          type: "variable",
                          dataType: "uint16",
                          max: 999,
                        },
                        {
                          name: "Jack Sparrow / Treasure Isle",
                          offset: 0x2c60,
                          type: "variable",
                          dataType: "uint16",
                          max: 999,
                        },
                        {
                          name: "Simba / King's Pride",
                          offset: 0x2c62,
                          type: "variable",
                          dataType: "uint16",
                          max: 999,
                        },
                        {
                          name: "Tron / Complete Compilement",
                          offset: 0x2c66,
                          type: "variable",
                          dataType: "uint16",
                          max: 999,
                        },
                        {
                          name: "Riku / Eternal Session",
                          offset: 0x2c68,
                          type: "variable",
                          dataType: "uint16",
                          max: 999,
                        },
                        {
                          name: "Sora / Trinity Limit",
                          offset: 0x2c6a,
                          type: "variable",
                          dataType: "uint16",
                          max: 999,
                        },
                        {
                          name: "Peter Pan / Never Land",
                          offset: 0x2c6c,
                          type: "variable",
                          dataType: "uint16",
                          max: 999,
                        },
                        {
                          name: "Chicken Little / FPS Mode",
                          offset: 0x2c70,
                          type: "variable",
                          dataType: "uint16",
                          max: 999,
                        },
                        {
                          name: "Stitch / Ohana!",
                          offset: 0x2c6e,
                          type: "variable",
                          dataType: "uint16",
                          max: 999,
                        },
                        {
                          name: '"Valor" Genie / Sonic Rave',
                          offset: 0x2c72,
                          type: "variable",
                          dataType: "uint16",
                          max: 999,
                        },
                        {
                          name: '"Wisdom" Genie / Strike Raid',
                          offset: 0x2c74,
                          type: "variable",
                          dataType: "uint16",
                          max: 999,
                        },
                        {
                          name: '"Master" Genie / Final Arcana',
                          offset: 0x2c76,
                          type: "variable",
                          dataType: "uint16",
                          max: 999,
                        },
                        {
                          name: '"Final" Genie / Infinity',
                          offset: 0x2c78,
                          type: "variable",
                          dataType: "uint16",
                          max: 999,
                        },
                      ],
                    },
                    {
                      name: "Synthesis Notes",
                      items: [],
                      planned: true,
                    },
                    {
                      name: "Battle Report",
                      items: [
                        {
                          type: "section",
                          flex: true,
                          items: [
                            {
                              name: "Healed Party Members",
                              offset: 0x2fdc,
                              type: "variable",
                              dataType: "uint16",
                              max: 999,
                            },
                          ],
                        },
                        {
                          name: "Drive Forms Times Used",
                          type: "section",
                          flex: true,
                          items: [
                            {
                              name: "Valor Form",
                              offset: 0x2fe2,
                              type: "variable",
                              dataType: "uint16",
                              max: 999,
                            },
                            {
                              name: "Wisdom Form",
                              offset: 0x2fe4,
                              type: "variable",
                              dataType: "uint16",
                              max: 999,
                            },
                            {
                              id: "finalMixOnly",
                              name: "Limit Form",
                              offset: 0x2fe6,
                              type: "variable",
                              dataType: "uint16",
                              max: 999,
                              hidden: true,
                            },
                            {
                              id: "finalMixShift-2",
                              name: "Master Form",
                              offset: 0x2fe6,
                              type: "variable",
                              dataType: "uint16",
                              max: 999,
                            },
                            {
                              id: "finalMixShift-2",
                              name: "Final Form",
                              offset: 0x2fe8,
                              type: "variable",
                              dataType: "uint16",
                              max: 999,
                            },
                            {
                              id: "finalMixShift-2",
                              name: "Antiform",
                              offset: 0x2fea,
                              type: "variable",
                              dataType: "uint16",
                              max: 999,
                            },
                          ],
                        },
                        {
                          name: "Summons Times Used",
                          type: "section",
                          flex: true,
                          items: [
                            {
                              id: "finalMixShift-2",
                              name: "Chicken Little",
                              offset: 0x2fec,
                              type: "variable",
                              dataType: "uint16",
                              max: 999,
                            },
                            {
                              id: "finalMixShift-2",
                              name: "Genie",
                              offset: 0x2fee,
                              type: "variable",
                              dataType: "uint16",
                              max: 999,
                            },
                            {
                              id: "finalMixShift-2",
                              name: "Stitch",
                              offset: 0x2ff0,
                              type: "variable",
                              dataType: "uint16",
                              max: 999,
                            },
                            {
                              id: "finalMixShift-2",
                              name: "Peter Pan",
                              offset: 0x2ff2,
                              type: "variable",
                              dataType: "uint16",
                              max: 999,
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
              name: "Worlds",
              planned: true,
              items: [],
            },
            {
              name: "Gummi",
              planned: true,
              items: [],
            },
            {
              name: "Synthesis",
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
                              name: "Moogle Level",
                              offset: 0x38ec,
                              type: "variable",
                              dataType: "uint8",
                              resource: "moogleLevels",
                            },
                            {
                              name: "Experience",
                              offset: 0x3758,
                              type: "variable",
                              dataType: "uint32",
                              max: 99999,
                            },
                          ],
                        },
                      ],
                    },
                    {
                      name: "Recipes",
                      planned: true,
                      items: [],
                    },
                    {
                      name: "Materials",
                      planned: true,
                      items: [],
                    },
                    {
                      name: "Material Logs",
                      planned: true,
                      items: [],
                    },
                    {
                      name: "Lists",
                      planned: true,
                      items: [],
                    },
                    {
                      name: "Shop",
                      items: [
                        {
                          name: "Purchasable Materials",
                          type: "bitflags",
                          flags: [
                            { offset: 0x1559, bit: 4, label: "Blazing Shard" },
                            { offset: 0x1559, bit: 5, label: "Blazing Stone" },
                            { offset: 0x1559, bit: 6, label: "Blazing Gem", separator: true },
                            { offset: 0x1559, bit: 7, label: "Frost Shard" },
                            { offset: 0x155a, bit: 0, label: "Frost Stone" },
                            { offset: 0x155a, bit: 1, label: "Frost Gem", separator: true },
                            { offset: 0x155a, bit: 2, label: "Lightning Shard" },
                            { offset: 0x155a, bit: 3, label: "Lightning Stone" },
                            { offset: 0x155a, bit: 4, label: "Lightning Gem", separator: true },
                            { offset: 0x155b, bit: 0, label: "Lucid Shard" },
                            { offset: 0x155b, bit: 1, label: "Lucid Stone" },
                            { offset: 0x155b, bit: 2, label: "Lucid Gem", separator: true },
                            { offset: 0x155a, bit: 5, label: "Power Shard" },
                            { offset: 0x155a, bit: 6, label: "Power Stone" },
                            { offset: 0x155a, bit: 7, label: "Power Gem", separator: true },
                            { offset: 0x1559, bit: 1, label: "Dark Shard" },
                            { offset: 0x1559, bit: 2, label: "Dark Stone" },
                            { offset: 0x1559, bit: 3, label: "Dark Gem", separator: true },
                            { offset: 0x155b, bit: 3, label: "Dense Shard" },
                            { offset: 0x155b, bit: 4, label: "Dense Stone" },
                            { offset: 0x155b, bit: 5, label: "Dense Gem", separator: true },
                            { offset: 0x155b, bit: 6, label: "Twilight Shard" },
                            { offset: 0x155b, bit: 7, label: "Twilight Stone" },
                            { offset: 0x155c, bit: 0, label: "Twilight Gem" },
                          ],
                        },
                      ],
                    },
                  ],
                },
              ],
            },
            {
              name: "Events",
              planned: true,
              items: [],
            },
            {
              name: "Config",
              items: [
                {
                  type: "section",
                  flex: true,
                  items: [
                    {
                      name: "Field Camera",
                      offset: 0x31b0,
                      type: "variable",
                      dataType: "bit",
                      bit: 4,
                      resource: "fieldCameras",
                    },
                    {
                      name: "Right Analog Stick",
                      offset: 0x31b0,
                      type: "variable",
                      dataType: "bit",
                      bit: 5,
                      resource: "analogSticks",
                    },
                    {
                      name: "Camera Up/Down",
                      offset: 0x31b1,
                      type: "variable",
                      dataType: "bit",
                      bit: 0,
                      resource: "cameraModes",
                    },
                    {
                      name: "Camera Left/Right",
                      offset: 0x31b0,
                      type: "variable",
                      dataType: "bit",
                      bit: 7,
                      resource: "cameraModes",
                    },
                  ],
                },
                {
                  type: "section",
                  flex: true,
                  items: [
                    {
                      name: "Summon Effects",
                      offset: 0x31b1,
                      type: "variable",
                      dataType: "uint8",
                      binary: {
                        bitStart: 1,
                        bitLength: 2,
                      },
                      resource: "summonEffects",
                    },
                    {
                      name: "Navigational Map",
                      offset: 0x31b0,
                      type: "variable",
                      dataType: "bit",
                      bit: 3,
                      resource: "optionBoolean",
                    },
                    {
                      name: "Vibration",
                      offset: 0x31b0,
                      type: "variable",
                      dataType: "bit",
                      bit: 0,
                      resource: "optionBoolean",
                    },
                    {
                      name: "Sound",
                      offset: 0x31b0,
                      type: "variable",
                      dataType: "uint8",
                      binary: {
                        bitStart: 1,
                        bitLength: 2,
                      },
                      resource: "sounds",
                    },
                    {
                      name: "Command Menu",
                      offset: 0x31b0,
                      type: "variable",
                      dataType: "bit",
                      bit: 6,
                      resource: "commandMenus",
                    },
                  ],
                },
              ],
            },
          ],
        },
      ],
    },
  ],
  resources: {
    abilities: "getAbilityNames()",
    accessories: "getItemNames('accessories')",
    analogSticks: {
      0x0: "Camera",
      0x1: "Command Menu",
    },
    armors: "getItemNames('armors')",
    booleanUnlocked: {
      0x0: "-",
      0x1: "Unlocked",
    },
    cameraModes: {
      0x0: "Original",
      0x1: "Reverse",
    },
    characters: {
      0x0: "Sora",
      0x1: "Donald",
      0x2: "Goofy",
      0x3: "Mickey",
      0x4: "Auron",
      0x5: "Mulan",
      0x6: "Aladdin",
      0x7: "Jack Sparrow",
      0x8: "Beast",
      0x9: "Jack Skellington",
      0xa: "Simba",
      0xb: "Tron",
      0xc: "Riku",
    },
    commandMenus: {
      0x0: "Kingdom Hearts II",
      0x1: "Kingdom Hearts",
    },
    difficulties: {
      0x0: "Beginner Mode",
      0x1: "Standard Mode",
      0x2: "Proud Mode",
    },
    driveForms: {
      0x0: "Valor",
      0x1: "Wisdom",
      0x2: "Master",
      0x3: "Final",
      0x4: "Antiform",
      0x5: "Lion",
    },
    fieldCameras: {
      0x0: "Auto",
      0x1: "Manual",
    },
    finalMixDifficulties: {
      0x0: "Beginner Mode",
      0x1: "Standard Mode",
      0x2: "Proud Mode",
      0x3: "Critical Mode",
    },
    finalMixDriveForms: {
      0x0: "Valor",
      0x1: "Wisdom",
      0x2: "Limit",
      0x3: "Master",
      0x4: "Final",
      0x5: "Antiform",
      0x6: "Lion",
    },
    finalMixFormations: {
      0x0: "Sora",
      0x1: "Donald",
      0x2: "Goofy",
      0x3: "World Ally",
      0x4: "Valor Form",
      0x5: "Wisdom Form",
      0x6: "Limit Form",
      0x7: "Master Form",
      0x8: "Final Form",
      0x9: "Antiform",
      0xa: "Mickey",
      0x12: "-",
    },
    formations: {
      0x0: "Sora",
      0x1: "Donald",
      0x2: "Goofy",
      0x3: "World Ally",
      0x4: "Valor Form",
      0x5: "Wisdom Form",
      0x6: "Master Form",
      0x7: "Final Form",
      0x8: "Antiform",
      0x9: "Mickey",
      0x10: "-",
    },
    items: "getItemNames('items')",
    magicLevelsBlizzard: {
      0x0: "-",
      0x1: "Blizzard",
      0x2: "Blizzara",
      0x3: "Blizzaga",
    },
    magicLevelsCure: {
      0x0: "-",
      0x1: "Cure",
      0x2: "Cura",
      0x3: "Curaga",
    },
    magicLevelsFire: {
      0x0: "-",
      0x1: "Fire",
      0x2: "Fira",
      0x3: "Firaga",
    },
    magicLevelsGravity: {
      0x0: "-",
      0x1: "Gravity",
      0x2: "Gravira",
      0x3: "Graviga",
    },
    magicLevelsMagnet: {
      0x0: "-",
      0x1: "Magnet",
      0x2: "Magnera",
      0x3: "Magnega",
    },
    magicLevelsReflect: {
      0x0: "-",
      0x1: "Reflect",
      0x2: "Reflera",
      0x3: "Reflega",
    },
    magicLevelsThunder: {
      0x0: "-",
      0x1: "Thunder",
      0x2: "Thundara",
      0x3: "Thundaga",
    },
    moogleLevels: {
      0x0: "Amateur Moogle",
      0x1: "Novice Moogle",
      0x2: "Junior Moogle",
      0x3: "Skilled Moogle",
      0x4: "Senior Moogle",
      0x5: "Artisan Moogle",
      0x6: "Master Moogle",
      0x7: "Superior Moogle",
      0x8: "Primo Moogle",
    },
    optionBoolean: {
      0x0: "Off",
      0x1: "On",
    },
    powers: {
      0x0: "Warrior",
      0x1: "Guardian",
      0x2: "Mystic",
    },
    progressions: {
      0x0: "-",
      0x1: "Game Cleared",
    },
    slotNames: "getSlotNames()",
    sounds: {
      0x0: "Mono",
      0x1: "Stereo",
      0x2: "Pro Logic II",
    },
    summonEffects: {
      0x0: "None",
      0x1: "Full",
      0x2: "Auto",
    },
    weapons: "getItemNames('weapons')",
    worlds: {
      0x0: "World ZZ",
      0x1: "End of Sea",
      0x2: "Twilight Town",
      0x3: "Destiny Islands",
      0x4: "Radiant Garden",
      0x5: "Beast's Castle",
      0x6: "Olympus Coliseum",
      0x7: "Agrabah",
      0x8: "The Land of Dragons",
      0x9: "100 Acre Wood",
      0xa: "Pride Lands",
      0xb: "Atlantica",
      0xc: "Disney Castle",
      0xd: "Timeless River",
      0xe: "Halloween Town",
      0xf: "World Map",
      0x10: "Port Royal",
      0x11: "Space Paranoids",
      0x12: "The World That Never Was",
    },
  },
  resourcesGroups: {
    abilities: abilitiesGroups,
    weapons: weaponsGroups,
  },
  resourcesOrder: {
    abilities: abilitiesOrder,
    accessories: accessoriesOrder,
    armors: armorOrder,
    finalMixFormations: [0x12],
    formations: [0x10],
    items: itemsOrder,
    weapons: weaponsOrder,
  },
};

export default template;
