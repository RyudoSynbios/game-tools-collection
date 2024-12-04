import type { GameJson, ItemTab } from "$lib/types";

import {
  accessories,
  accessoryTypes,
  armgears,
  bodywears,
  characters,
  headgears,
  items,
  itemTypes,
  summons,
  summonstones,
  weapons,
} from "./utils/resource";

const template: GameJson = {
  validator: {
    regions: {
      europe_usa: {
        0x1eed0: [0x46, 0x52, 0x4e, 0x44, 0x43, 0x41, 0x52, 0x44], // "FRNDCARD"
      },
      japan: {
        0x22294: [0x46, 0x52, 0x4e, 0x44, 0x43, 0x41, 0x52, 0x44], // "FRNDCARD"
      },
      asia: {
        0x1eed0: [0x46, 0x52, 0x4e, 0x44, 0x43, 0x41, 0x52, 0x44], // "FRNDCARD"
      },
    },
    text: "Drag 'n' drop here or click to add a save file.",
    hint: "Only works with decrypted saves (see FAQ).",
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
              type: "section",
              flex: true,
              items: [
                {
                  name: "Name",
                  offset: 0x1ef00,
                  length: 0x18,
                  type: "variable",
                  dataType: "string",
                  letterDataType: "uint16",
                  zeroTerminated: true,
                },
                {
                  name: "Play Time",
                  type: "group",
                  mode: "time",
                  items: [
                    {
                      offset: 0x1eef0,
                      type: "variable",
                      dataType: "uint32",
                      operations: [
                        {
                          convert: {
                            from: "seconds",
                            to: "hours",
                          },
                        },
                      ],
                      max: 999,
                    },
                    {
                      offset: 0x1eef0,
                      type: "variable",
                      dataType: "uint32",
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
                      offset: 0x1eef0,
                      type: "variable",
                      dataType: "uint32",
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
                  name: "Gil",
                  offset: 0xfdc0,
                  type: "variable",
                  dataType: "uint32",
                  // max:
                },
                {
                  name: "PP",
                  offset: 0x1cef8,
                  type: "variable",
                  dataType: "uint32",
                  // max:
                },
              ],
            },
            {
              type: "section",
              flex: true,
              items: [
                {
                  name: "Unlock?",
                  type: "bitflags",
                  hidden: true,
                  flags: [
                    { offset: 0x1d080, bit: 0, label: "???", hidden: true }, // prettier-ignore
                    { offset: 0x1d080, bit: 2, label: "Imported Dissidia Save Flag" }, // prettier-ignore
                    { offset: 0x1d080, bit: 3, label: "???", hidden: true }, // prettier-ignore
                    { offset: 0x1d080, bit: 4, label: "???", hidden: true }, // prettier-ignore
                    { offset: 0x1d080, bit: 5, label: "???", hidden: true }, // prettier-ignore
                    { offset: 0x1d080, bit: 6, label: "???", hidden: true }, // prettier-ignore
                    { offset: 0x1d080, bit: 7, label: "???", hidden: true }, // prettier-ignore
                    { offset: 0x1d081, bit: 0, label: "Vested Researcher title related", hidden: true }, // prettier-ignore
                    { offset: 0x1d081, bit: 1, label: "???", hidden: true }, // prettier-ignore
                    { offset: 0x1d081, bit: 2, label: "???", hidden: true }, // prettier-ignore
                    { offset: 0x1d081, bit: 3, label: "???", hidden: true }, // prettier-ignore
                    { offset: 0x1d081, bit: 4, label: "???", hidden: true }, // prettier-ignore
                    { offset: 0x1d081, bit: 5, label: "???", hidden: true }, // prettier-ignore
                    { offset: 0x1d081, bit: 6, label: "???", hidden: true }, // prettier-ignore
                    { offset: 0x1d081, bit: 7, label: "???", hidden: true }, // prettier-ignore
                    { offset: 0x1d082, bit: 0, label: "???", hidden: true }, // prettier-ignore
                    { offset: 0x1d082, bit: 1, label: "???", hidden: true }, // prettier-ignore
                    { offset: 0x1d082, bit: 2, label: "???", hidden: true }, // prettier-ignore
                    { offset: 0x1d082, bit: 3, label: "???", hidden: true }, // prettier-ignore
                    { offset: 0x1d082, bit: 4, label: "Shop Unlocked" }, // prettier-ignore
                    { offset: 0x1d082, bit: 5, label: "Museum Unlocked" }, // prettier-ignore
                    { offset: 0x1d082, bit: 6, label: "Labyrinth Unlocked" }, // prettier-ignore
                    { offset: 0x1d082, bit: 7, label: "Introduction Completed" }, // prettier-ignore
                    { offset: 0x1d083, bit: 0, label: "Main Scenario: An Untold Tale (Unlocked)" }, // prettier-ignore
                    { offset: 0x1d083, bit: 1, label: "???", hidden: true }, // prettier-ignore
                    { offset: 0x1d083, bit: 2, label: "???", hidden: true }, // prettier-ignore
                    { offset: 0x1d083, bit: 3, label: "???", hidden: true }, // prettier-ignore
                    { offset: 0x1d083, bit: 4, label: "???", hidden: true }, // prettier-ignore
                    { offset: 0x1d083, bit: 5, label: "???", hidden: true }, // prettier-ignore
                    { offset: 0x1d083, bit: 6, label: "???", hidden: true }, // prettier-ignore
                    { offset: 0x1d083, bit: 7, label: "Greenhorn Labyrinth route goal Reached" }, // prettier-ignore
                    { offset: 0x1d084, bit: 0, label: "Intermediary Labyrinth route goal Reached" }, // prettier-ignore
                    { offset: 0x1d084, bit: 1, label: "Virtuoso Labyrinth route goal Reached" }, // prettier-ignore
                    { offset: 0x1d084, bit: 2, label: "???", hidden: true }, // prettier-ignore
                    { offset: 0x1d084, bit: 3, label: "???", hidden: true }, // prettier-ignore
                    { offset: 0x1d084, bit: 4, label: "???", hidden: true }, // prettier-ignore
                    { offset: 0x1d084, bit: 5, label: "???", hidden: true }, // prettier-ignore
                    { offset: 0x1d084, bit: 6, label: "???", hidden: true }, // prettier-ignore
                    { offset: 0x1d084, bit: 7, label: "???", hidden: true }, // prettier-ignore
                    { offset: 0x1d085, bit: 0, label: "True Expliorer title related", hidden: true }, // prettier-ignore
                    { offset: 0x1d085, bit: 1, label: "???", hidden: true }, // prettier-ignore
                    { offset: 0x1d085, bit: 2, label: "???", hidden: true }, // prettier-ignore
                    { offset: 0x1d085, bit: 3, label: "???", hidden: true }, // prettier-ignore
                    { offset: 0x1d085, bit: 4, label: "???", hidden: true }, // prettier-ignore
                    { offset: 0x1d085, bit: 5, label: "???", hidden: true }, // prettier-ignore
                    { offset: 0x1d085, bit: 6, label: "???", hidden: true }, // prettier-ignore
                    { offset: 0x1d085, bit: 7, label: "???", hidden: true }, // prettier-ignore
                    { offset: 0x1d086, bit: 0, label: "???", hidden: true }, // prettier-ignore
                    { offset: 0x1d086, bit: 1, label: "???", hidden: true }, // prettier-ignore
                    { offset: 0x1d086, bit: 2, label: "???", hidden: true }, // prettier-ignore
                    { offset: 0x1d086, bit: 3, label: "???", hidden: true }, // prettier-ignore
                    { offset: 0x1d086, bit: 4, label: "???", hidden: true }, // prettier-ignore
                    { offset: 0x1d086, bit: 5, label: "???", hidden: true }, // prettier-ignore
                    { offset: 0x1d086, bit: 6, label: "???", hidden: true }, // prettier-ignore
                    { offset: 0x1d086, bit: 7, label: "???", hidden: true }, // prettier-ignore
                    { offset: 0x1d087, bit: 0, label: "???", hidden: true }, // prettier-ignore
                    { offset: 0x1d087, bit: 1, label: "???", hidden: true }, // prettier-ignore
                    { offset: 0x1d087, bit: 2, label: "Accomplishments Unlocked" }, // prettier-ignore
                    { offset: 0x1d087, bit: 3, label: "Battlegen Unlocked" }, // prettier-ignore
                    { offset: 0x1d087, bit: 4, label: "???", hidden: true }, // prettier-ignore
                    { offset: 0x1d087, bit: 5, label: "???", hidden: true }, // prettier-ignore
                    { offset: 0x1d087, bit: 6, label: "???", hidden: true }, // prettier-ignore
                    { offset: 0x1d087, bit: 7, label: "???", hidden: true }, // prettier-ignore
                    { offset: 0x1d088, bit: 0, label: "Artifact created for the first time", hidden: true }, // prettier-ignore
                    { offset: 0x1d088, bit: 1, label: "???", hidden: true }, // prettier-ignore
                    { offset: 0x1d088, bit: 2, label: "PP Catalog Unlocked" }, // prettier-ignore
                    { offset: 0x1d088, bit: 3, label: "???", hidden: true }, // prettier-ignore
                    { offset: 0x1d088, bit: 4, label: "???", hidden: true }, // prettier-ignore
                    { offset: 0x1d088, bit: 5, label: "???", hidden: true }, // prettier-ignore
                    { offset: 0x1d088, bit: 6, label: "???", hidden: true }, // prettier-ignore
                    { offset: 0x1d088, bit: 7, label: "???", hidden: true }, // prettier-ignore
                    { offset: 0x1d089, bit: 0, label: "???", hidden: true }, // prettier-ignore
                    { offset: 0x1d089, bit: 1, label: "???", hidden: true }, // prettier-ignore
                    { offset: 0x1d089, bit: 2, label: "???", hidden: true }, // prettier-ignore
                    { offset: 0x1d089, bit: 3, label: "???", hidden: true }, // prettier-ignore
                    { offset: 0x1d089, bit: 4, label: "Formidable Ghouls title related", hidden: true }, // prettier-ignore
                    { offset: 0x1d089, bit: 5, label: "???", hidden: true }, // prettier-ignore
                    { offset: 0x1d089, bit: 6, label: "???", hidden: true }, // prettier-ignore
                    { offset: 0x1d089, bit: 7, label: "???", hidden: true }, // prettier-ignore
                    { offset: 0x1d08a, bit: 0, label: "???", hidden: true }, // prettier-ignore
                    { offset: 0x1d08a, bit: 1, label: "Arcade related", hidden: true }, // prettier-ignore
                    { offset: 0x1d08a, bit: 2, label: "Arcade related", hidden: true }, // prettier-ignore
                    { offset: 0x1d08a, bit: 3, label: "Arcade related", hidden: true }, // prettier-ignore
                    { offset: 0x1d08a, bit: 4, label: "Arcade related", hidden: true }, // prettier-ignore
                    { offset: 0x1d08a, bit: 5, label: "Arcade related", hidden: true }, // prettier-ignore
                    { offset: 0x1d08a, bit: 6, label: "Arcade related", hidden: true }, // prettier-ignore
                    { offset: 0x1d08a, bit: 7, label: "Arcade related", hidden: true }, // prettier-ignore
                    { offset: 0x1d08b, bit: 0, label: "???", hidden: true }, // prettier-ignore
                    { offset: 0x1d08b, bit: 1, label: "???", hidden: true }, // prettier-ignore
                    { offset: 0x1d08b, bit: 2, label: "???", hidden: true }, // prettier-ignore
                    { offset: 0x1d08b, bit: 3, label: "???", hidden: true }, // prettier-ignore
                    { offset: 0x1d08b, bit: 4, label: "???", hidden: true }, // prettier-ignore
                    { offset: 0x1d08b, bit: 5, label: "???", hidden: true }, // prettier-ignore
                    { offset: 0x1d08b, bit: 6, label: "???", hidden: true }, // prettier-ignore
                    { offset: 0x1d08b, bit: 7, label: "???", hidden: true }, // prettier-ignore
                    { offset: 0x1d08c, bit: 0, label: "???", hidden: true }, // prettier-ignore
                    { offset: 0x1d08c, bit: 1, label: "???", hidden: true }, // prettier-ignore
                    { offset: 0x1d08c, bit: 2, label: "???", hidden: true }, // prettier-ignore
                    { offset: 0x1d08c, bit: 3, label: "???", hidden: true }, // prettier-ignore
                    { offset: 0x1d08c, bit: 4, label: "???", hidden: true }, // prettier-ignore
                    { offset: 0x1d08c, bit: 5, label: "???", hidden: true }, // prettier-ignore
                    { offset: 0x1d08c, bit: 6, label: "Answer to first question of Moogle: This is my first time. / I am not experienced.", hidden: true }, // prettier-ignore
                    { offset: 0x1d08c, bit: 7, label: "Answer to first question of Moogle: I have played before. / I am experienced.", hidden: true }, // prettier-ignore
                    { offset: 0x1d08d, bit: 0, label: "Answer to second question of Moogle: Well, I wouldn't say that...", hidden: true }, // prettier-ignore
                    { offset: 0x1d08d, bit: 1, label: "Answer to second question of Moogle: I am a master!", hidden: true }, // prettier-ignore
                    { offset: 0x1d08d, bit: 2, label: "???", hidden: true }, // prettier-ignore
                    { offset: 0x1d08d, bit: 3, label: "???", hidden: true }, // prettier-ignore
                    { offset: 0x1d08d, bit: 4, label: "???", hidden: true }, // prettier-ignore
                    { offset: 0x1d08d, bit: 5, label: "???", hidden: true }, // prettier-ignore
                    { offset: 0x1d08d, bit: 6, label: "???", hidden: true }, // prettier-ignore
                    { offset: 0x1d08d, bit: 7, label: "???", hidden: true }, // prettier-ignore
                    { offset: 0x1d08e, bit: 0, label: "???", hidden: true }, // prettier-ignore
                    { offset: 0x1d08e, bit: 1, label: "???", hidden: true }, // prettier-ignore
                    { offset: 0x1d08e, bit: 2, label: "???", hidden: true }, // prettier-ignore
                    { offset: 0x1d08e, bit: 3, label: "???", hidden: true }, // prettier-ignore
                    { offset: 0x1d08e, bit: 4, label: "???", hidden: true }, // prettier-ignore
                    { offset: 0x1d08e, bit: 5, label: "???", hidden: true }, // prettier-ignore
                    { offset: 0x1d08e, bit: 6, label: "???", hidden: true }, // prettier-ignore
                    { offset: 0x1d08e, bit: 7, label: "???", hidden: true }, // prettier-ignore
                    { offset: 0x1d12b, bit: 4, label: "Museum Complete" }, // prettier-ignore
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
              length: 0x778,
              type: "container",
              instanceType: "tabs",
              instances: 31,
              resource: "charactersParty",
              vertical: true,
              items: [
                {
                  length: 0xc6,
                  type: "container",
                  instanceType: "tabs",
                  instances: 5,
                  resource: "sets",
                  prependSubinstance: [
                    {
                      name: "Status",
                      items: [
                        {
                          type: "section",
                          flex: true,
                          items: [
                            {
                              name: "ID",
                              offset: 0x50,
                              type: "variable",
                              dataType: "uint8",
                              hidden: true,
                            },
                            {
                              name: "Level",
                              offset: 0x51,
                              type: "variable",
                              dataType: "uint8",
                              max: 100,
                            },
                            {
                              name: "Experience",
                              offset: 0x54,
                              type: "variable",
                              dataType: "uint16",
                              max: 1964655,
                            },
                            {
                              name: "Rank Points",
                              offset: 0x52,
                              type: "variable",
                              dataType: "uint8",
                              max: 150,
                            },
                            {
                              name: "Current Lost HP",
                              offset: 0x5c,
                              type: "variable",
                              dataType: "uint32",
                              max: 99999,
                            },
                          ],
                        },
                      ],
                    },
                    {
                      name: "Ability List",
                      items: [
                        {
                          length: 0x6,
                          type: "container",
                          instanceType: "section",
                          instances: 150,
                          flex: true,
                          items: [
                            {
                              id: "ability",
                              name: "Ability %d",
                              offset: 0x43e,
                              type: "variable",
                              dataType: "uint16",
                              resource: "abilities",
                              autocomplete: true,
                            },
                            {
                              id: "abilityAp",
                              name: "AP",
                              offset: 0x440,
                              type: "variable",
                              dataType: "uint16",
                              max: 300,
                            },
                            {
                              name: "Bitflags",
                              offset: 0x442,
                              type: "variable",
                              dataType: "uint16",
                              hidden: true,
                            },
                          ],
                        },
                      ],
                    },
                  ],
                  items: [
                    {
                      type: "tabs",
                      items: [
                        {
                          name: "General",
                          flex: true,
                          items: [
                            {
                              name: "Adjusted Level",
                              offset: 0x125,
                              type: "variable",
                              dataType: "uint8",
                              max: 100,
                            },
                            {
                              id: "assist",
                              name: "Assist",
                              offset: 0x118,
                              type: "variable",
                              dataType: "uint8",
                              resource: "assists",
                              autocomplete: true,
                            },
                            {
                              name: "Assist Enabled",
                              offset: 0x119,
                              type: "variable",
                              dataType: "uint8",
                              hidden: true,
                            },
                          ],
                        },
                        { name: "Abilities", items: [] },
                        {
                          name: "Equipment",
                          flex: true,
                          items: [
                            {
                              name: "Weapon",
                              offset: 0xfa,
                              type: "variable",
                              dataType: "uint16",
                              resource: "weapons",
                              autocomplete: true,
                            },
                            {
                              name: "Armgear",
                              offset: 0xfc,
                              type: "variable",
                              dataType: "uint16",
                              resource: "armgears",
                              autocomplete: true,
                            },
                            {
                              name: "Headgear",
                              offset: 0xfe,
                              type: "variable",
                              dataType: "uint16",
                              resource: "headgears",
                              autocomplete: true,
                            },
                            {
                              name: "Bodywear",
                              offset: 0x100,
                              type: "variable",
                              dataType: "uint16",
                              resource: "bodywears",
                              autocomplete: true,
                            },
                          ],
                        },
                        {
                          name: "Accessories",
                          items: [
                            {
                              name: "Slots",
                              offset: 0x7c5,
                              type: "variable",
                              dataType: "uint8",
                              overrideShift: {
                                parent: 1,
                                shift: 0x0,
                              },
                              min: 3,
                              max: 10,
                            },
                            {
                              type: "section",
                              flex: true,
                              items: [
                                {
                                  id: "accessory-%index%-0",
                                  name: "Accessory 1",
                                  offset: 0x102,
                                  type: "variable",
                                  dataType: "uint16",
                                  resource: "accessories",
                                  autocomplete: true,
                                },
                                {
                                  id: "accessory-%index%-1",
                                  name: "Accessory 2",
                                  offset: 0x104,
                                  type: "variable",
                                  dataType: "uint16",
                                  resource: "accessories",
                                  autocomplete: true,
                                },
                                {
                                  id: "accessory-%index%-2",
                                  name: "Accessory 3",
                                  offset: 0x106,
                                  type: "variable",
                                  dataType: "uint16",
                                  resource: "accessories",
                                  autocomplete: true,
                                },
                                {
                                  id: "accessory-%index%-3",
                                  name: "Accessory 4",
                                  offset: 0x108,
                                  type: "variable",
                                  dataType: "uint16",
                                  resource: "accessories",
                                  autocomplete: true,
                                },
                                {
                                  id: "accessory-%index%-4",
                                  name: "Accessory 5",
                                  offset: 0x10a,
                                  type: "variable",
                                  dataType: "uint16",
                                  resource: "accessories",
                                  autocomplete: true,
                                },
                                {
                                  id: "accessory-%index%-5",
                                  name: "Accessory 6",
                                  offset: 0x10c,
                                  type: "variable",
                                  dataType: "uint16",
                                  resource: "accessories",
                                  autocomplete: true,
                                },
                                {
                                  id: "accessory-%index%-6",
                                  name: "Accessory 7",
                                  offset: 0x10e,
                                  type: "variable",
                                  dataType: "uint16",
                                  resource: "accessories",
                                  autocomplete: true,
                                },
                                {
                                  id: "accessory-%index%-7",
                                  name: "Accessory 8",
                                  offset: 0x110,
                                  type: "variable",
                                  dataType: "uint16",
                                  resource: "accessories",
                                  autocomplete: true,
                                },
                                {
                                  id: "accessory-%index%-8",
                                  name: "Accessory 9",
                                  offset: 0x112,
                                  type: "variable",
                                  dataType: "uint16",
                                  resource: "accessories",
                                  autocomplete: true,
                                },
                                {
                                  id: "accessory-%index%-9",
                                  name: "Accessory 10",
                                  offset: 0x114,
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
                          name: "Summons",
                          items: [
                            {
                              name: "Equipped Summonstone",
                              offset: 0x11a,
                              type: "variable",
                              dataType: "uint8",
                              resource: "summonstones",
                              autocomplete: true,
                            },
                            {
                              type: "section",
                              flex: true,
                              items: [
                                {
                                  id: "reserve-0",
                                  name: "Reserve 1",
                                  offset: 0x11b,
                                  type: "variable",
                                  dataType: "uint8",
                                  resource: "summonstones",
                                  autocomplete: true,
                                },
                                {
                                  name: "Order",
                                  offset: 0x11c,
                                  type: "variable",
                                  dataType: "uint8",
                                  hidden: true,
                                },
                                {
                                  id: "reserve-1",
                                  name: "Reserve 2",
                                  offset: 0x11d,
                                  type: "variable",
                                  dataType: "uint8",
                                  resource: "summonstones",
                                  autocomplete: true,
                                },
                                {
                                  name: "Order",
                                  offset: 0x11e,
                                  type: "variable",
                                  dataType: "uint8",
                                  hidden: true,
                                },
                                {
                                  id: "reserve-2",
                                  name: "Reserve 3",
                                  offset: 0x11f,
                                  type: "variable",
                                  dataType: "uint8",
                                  resource: "summonstones",
                                  autocomplete: true,
                                },
                                {
                                  name: "Order",
                                  offset: 0x120,
                                  type: "variable",
                                  dataType: "uint8",
                                  hidden: true,
                                },
                                {
                                  id: "reserve-3",
                                  name: "Reserve 4",
                                  offset: 0x121,
                                  type: "variable",
                                  dataType: "uint8",
                                  resource: "summonstones",
                                  autocomplete: true,
                                },
                                {
                                  name: "Order",
                                  offset: 0x122,
                                  type: "variable",
                                  dataType: "uint8",
                                  hidden: true,
                                },
                                {
                                  id: "reserve-4",
                                  name: "Reserve 5",
                                  offset: 0x123,
                                  type: "variable",
                                  dataType: "uint8",
                                  resource: "summonstones",
                                  autocomplete: true,
                                },
                                {
                                  name: "Order",
                                  offset: 0x124,
                                  type: "variable",
                                  dataType: "uint8",
                                  hidden: true,
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
            },
          ],
        },
        {
          name: "Inventory",
          items: [
            {
              type: "tabs",
              vertical: true,
              items: [
                ...itemTypes.map(
                  (type) =>
                    ({
                      name: type.name,
                      items: [
                        {
                          type: "tabs",
                          vertical: true,
                          items: type.subtypes.map((subtype) => ({
                            name: subtype.name,
                            flex: true,
                            items: items
                              .filter((item) => item.type === subtype.index)
                              .map((item) => ({
                                name: item.name,
                                offset: 0xe7da + item.index * 0x4,
                                type: "variable",
                                dataType: "uint8",
                                max: 99,
                              })),
                          })),
                        },
                      ],
                    }) as ItemTab,
                ),
                {
                  name: "Accessories",
                  items: [
                    {
                      type: "tabs",
                      vertical: true,
                      items: accessoryTypes.map((type) => ({
                        name: type.name,
                        flex: true,
                        items: accessories
                          .filter((item) => item.type === type.index)
                          .map((item) => ({
                            name: item.name,
                            offset: 0xf286 + item.index * 0x4,
                            type: "variable",
                            dataType: "uint8",
                            max: 99,
                          })),
                      })),
                    },
                  ],
                },
                {
                  name: "Summonstones",
                  items: [
                    {
                      type: "tabs",
                      vertical: true,
                      items: [
                        {
                          name: "Obtained",
                          flex: true,
                          items: [
                            {
                              name: "Auto",
                              type: "bitflags",
                              flags: summonstones
                                .filter((item) => item.type === 0x0)
                                .map((item) => ({
                                  offset: 0xfc5f + item.index * 0x4,
                                  bit: 1,
                                  label: item.name,
                                })),
                            },
                            {
                              name: "Manual",
                              type: "bitflags",
                              flags: summonstones
                                .filter((item) => item.type === 0x1)
                                .map((item) => ({
                                  offset: 0xfc5f + item.index * 0x4,
                                  bit: 1,
                                  label: item.name,
                                })),
                            },
                          ],
                        },
                        {
                          name: "Remaining Usage",
                          flex: true,
                          items: summonstones.map((item) => ({
                            name: item.name,
                            offset: 0xfc5d + item.index * 0x4,
                            type: "variable",
                            dataType: "uint8",
                            max: item.type === 0x0 ? 3 : 2,
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
          name: "PP Catalog",
          items: [
            {
              type: "tabs",
              items: [
                {
                  name: "Characters",
                  flex: true,
                  items: [
                    {
                      name: "Characters",
                      type: "bitflags",
                      flags: [
                        { offset: 0x1d0d7, bit: 0, label: "???", hidden: true }, // prettier-ignore
                        { offset: 0x1d0d7, bit: 1, label: "???", hidden: true }, // prettier-ignore
                        { offset: 0x1d0d7, bit: 2, label: "???", hidden: true }, // prettier-ignore
                        { offset: 0x1d0d7, bit: 3, label: "???", hidden: true }, // prettier-ignore
                        { offset: 0x1d0d7, bit: 4, label: "Warrior of Light" }, // prettier-ignore
                        { offset: 0x1d0d7, bit: 5, label: "Garland" }, // prettier-ignore
                        { offset: 0x1d0d7, bit: 6, label: "Firion" }, // prettier-ignore
                        { offset: 0x1d0d7, bit: 7, label: "The Emperor" }, // prettier-ignore
                        { offset: 0x1d0d8, bit: 0, label: "Onion Knight" }, // prettier-ignore
                        { offset: 0x1d0d8, bit: 1, label: "Cloud of Darkness" }, // prettier-ignore
                        { offset: 0x1d0d8, bit: 2, label: "Cecil Harvey" }, // prettier-ignore
                        { offset: 0x1d0d8, bit: 3, label: "Golbez" }, // prettier-ignore
                        { offset: 0x1d0d8, bit: 4, label: "Bartz Klauser" }, // prettier-ignore
                        { offset: 0x1d0d8, bit: 5, label: "Exdeath" }, // prettier-ignore
                        { offset: 0x1d0d8, bit: 6, label: "Terra Branford" }, // prettier-ignore
                        { offset: 0x1d0d8, bit: 7, label: "Kefka Palazzo" }, // prettier-ignore
                        { offset: 0x1d0d9, bit: 0, label: "Cloud Strife" }, // prettier-ignore
                        { offset: 0x1d0d9, bit: 1, label: "Sephiroth" }, // prettier-ignore
                        { offset: 0x1d0d9, bit: 2, label: "Squall Leonhart" }, // prettier-ignore
                        { offset: 0x1d0d9, bit: 3, label: "Ultimecia" }, // prettier-ignore
                        { offset: 0x1d0d9, bit: 4, label: "Zidane Tribal" }, // prettier-ignore
                        { offset: 0x1d0d9, bit: 5, label: "Kuja" }, // prettier-ignore
                        { offset: 0x1d0d9, bit: 6, label: "Tidus" }, // prettier-ignore
                        { offset: 0x1d0d9, bit: 7, label: "Jecht" }, // prettier-ignore
                        { offset: 0x1d0da, bit: 0, label: "Shantotto" }, // prettier-ignore
                        { offset: 0x1d0da, bit: 1, label: "Gabranth" }, // prettier-ignore
                        { offset: 0x1d0da, bit: 2, label: "Kain Highwind" }, // prettier-ignore
                        { offset: 0x1d0da, bit: 3, label: "Gilgamesh" }, // prettier-ignore
                        { offset: 0x1d0da, bit: 4, label: "Tifa Lockhart" }, // prettier-ignore
                        { offset: 0x1d0da, bit: 5, label: "Laguna Loire" }, // prettier-ignore
                        { offset: 0x1d0da, bit: 6, label: "Yuna" }, // prettier-ignore
                        { offset: 0x1d0da, bit: 7, label: "Prishe" }, // prettier-ignore
                        { offset: 0x1d0db, bit: 0, label: "Vaan" }, // prettier-ignore
                        { offset: 0x1d0db, bit: 1, label: "Lightning" }, // prettier-ignore
                        { offset: 0x1d0db, bit: 2, label: "Feral Chaos" }, // prettier-ignore
                        { offset: 0x1d0f3, bit: 5, label: "Chaos (CPU)" }, // prettier-ignore
                      ],
                    },
                    {
                      name: "Alternate Looks 1",
                      type: "bitflags",
                      flags: [
                        { offset: 0x1d0db, bit: 3, label: "???", hidden: true }, // prettier-ignore
                        { offset: 0x1d0db, bit: 4, label: "???", hidden: true }, // prettier-ignore
                        { offset: 0x1d0db, bit: 5, label: "???", hidden: true }, // prettier-ignore
                        { offset: 0x1d0db, bit: 6, label: "???", hidden: true }, // prettier-ignore
                        { offset: 0x1d0db, bit: 7, label: "Warrior of Light" }, // prettier-ignore
                        { offset: 0x1d0dc, bit: 0, label: "Garland" }, // prettier-ignore
                        { offset: 0x1d0dc, bit: 1, label: "Firion" }, // prettier-ignore
                        { offset: 0x1d0dc, bit: 2, label: "The Emperor" }, // prettier-ignore
                        { offset: 0x1d0dc, bit: 3, label: "Onion Knight" }, // prettier-ignore
                        { offset: 0x1d0dc, bit: 4, label: "Cloud of Darkness" }, // prettier-ignore
                        { offset: 0x1d0dc, bit: 5, label: "Cecil Harvey" }, // prettier-ignore
                        { offset: 0x1d0dc, bit: 6, label: "Golbez" }, // prettier-ignore
                        { offset: 0x1d0dc, bit: 7, label: "Bartz Klauser" }, // prettier-ignore
                        { offset: 0x1d0dd, bit: 0, label: "Exdeath" }, // prettier-ignore
                        { offset: 0x1d0dd, bit: 1, label: "Terra Branford" }, // prettier-ignore
                        { offset: 0x1d0dd, bit: 2, label: "Kefka Palazzo" }, // prettier-ignore
                        { offset: 0x1d0dd, bit: 3, label: "Cloud Strife" }, // prettier-ignore
                        { offset: 0x1d0dd, bit: 4, label: "Sephiroth" }, // prettier-ignore
                        { offset: 0x1d0dd, bit: 5, label: "Squall Leonhart" }, // prettier-ignore
                        { offset: 0x1d0dd, bit: 6, label: "Ultimecia" }, // prettier-ignore
                        { offset: 0x1d0dd, bit: 7, label: "Zidane Tribal" }, // prettier-ignore
                        { offset: 0x1d0de, bit: 0, label: "Kuja" }, // prettier-ignore
                        { offset: 0x1d0de, bit: 1, label: "Tidus" }, // prettier-ignore
                        { offset: 0x1d0de, bit: 2, label: "Jecht" }, // prettier-ignore
                        { offset: 0x1d0de, bit: 3, label: "Shantotto" }, // prettier-ignore
                        { offset: 0x1d0de, bit: 4, label: "Gabranth" }, // prettier-ignore
                        { offset: 0x1d0de, bit: 5, label: "Kain Highwind" }, // prettier-ignore
                        { offset: 0x1d0de, bit: 6, label: "Gilgamesh" }, // prettier-ignore
                        { offset: 0x1d0de, bit: 7, label: "Tifa Lockhart" }, // prettier-ignore
                        { offset: 0x1d0df, bit: 0, label: "Laguna Loire" }, // prettier-ignore
                        { offset: 0x1d0df, bit: 1, label: "Yuna" }, // prettier-ignore
                        { offset: 0x1d0df, bit: 2, label: "Prishe" }, // prettier-ignore
                        { offset: 0x1d0df, bit: 3, label: "Vaan" }, // prettier-ignore
                        { offset: 0x1d0df, bit: 4, label: "Lightning" }, // prettier-ignore
                        { offset: 0x1d0df, bit: 5, label: "Feral Chaos" }, // prettier-ignore
                      ],
                    },
                    {
                      name: "Alternate Looks 2",
                      type: "bitflags",
                      flags: [
                        { offset: 0x1d0df, bit: 6, label: "???", hidden: true }, // prettier-ignore
                        { offset: 0x1d0df, bit: 7, label: "???", hidden: true }, // prettier-ignore
                        { offset: 0x1d0e0, bit: 0, label: "???", hidden: true }, // prettier-ignore
                        { offset: 0x1d0e0, bit: 1, label: "???", hidden: true }, // prettier-ignore
                        { offset: 0x1d0e0, bit: 2, label: "Warrior of Light" }, // prettier-ignore
                        { offset: 0x1d0e0, bit: 3, label: "Garland" }, // prettier-ignore
                        { offset: 0x1d0e0, bit: 4, label: "Firion" }, // prettier-ignore
                        { offset: 0x1d0e0, bit: 5, label: "The Emperor" }, // prettier-ignore
                        { offset: 0x1d0e0, bit: 6, label: "Onion Knight" }, // prettier-ignore
                        { offset: 0x1d0e0, bit: 7, label: "Cloud of Darkness" }, // prettier-ignore
                        { offset: 0x1d0e1, bit: 0, label: "Cecil Harvey" }, // prettier-ignore
                        { offset: 0x1d0e1, bit: 1, label: "Golbez" }, // prettier-ignore
                        { offset: 0x1d0e1, bit: 2, label: "Bartz Klauser" }, // prettier-ignore
                        { offset: 0x1d0e1, bit: 3, label: "Exdeath" }, // prettier-ignore
                        { offset: 0x1d0e1, bit: 4, label: "Terra Branford" }, // prettier-ignore
                        { offset: 0x1d0e1, bit: 5, label: "Kefka Palazzo" }, // prettier-ignore
                        { offset: 0x1d0e1, bit: 6, label: "Cloud Strife" }, // prettier-ignore
                        { offset: 0x1d0e1, bit: 7, label: "Sephiroth" }, // prettier-ignore
                        { offset: 0x1d0e2, bit: 0, label: "Squall Leonhart" }, // prettier-ignore
                        { offset: 0x1d0e2, bit: 1, label: "Ultimecia" }, // prettier-ignore
                        { offset: 0x1d0e2, bit: 2, label: "Zidane Tribal" }, // prettier-ignore
                        { offset: 0x1d0e2, bit: 3, label: "Kuja" }, // prettier-ignore
                        { offset: 0x1d0e2, bit: 4, label: "Tidus" }, // prettier-ignore
                        { offset: 0x1d0e2, bit: 5, label: "Jecht" }, // prettier-ignore
                        { offset: 0x1d0e2, bit: 6, label: "Shantotto" }, // prettier-ignore
                        { offset: 0x1d0e2, bit: 7, label: "Gabranth" }, // prettier-ignore
                        { offset: 0x1d0e3, bit: 0, label: "Kain Highwind" }, // prettier-ignore
                        { offset: 0x1d0e3, bit: 1, label: "Gilgamesh" }, // prettier-ignore
                        { offset: 0x1d0e3, bit: 2, label: "Tifa Lockhart" }, // prettier-ignore
                        { offset: 0x1d0e3, bit: 3, label: "Laguna Loire" }, // prettier-ignore
                        { offset: 0x1d0e3, bit: 4, label: "Yuna" }, // prettier-ignore
                        { offset: 0x1d0e3, bit: 5, label: "Prishe" }, // prettier-ignore
                        { offset: 0x1d0e3, bit: 6, label: "Vaan" }, // prettier-ignore
                        { offset: 0x1d0e3, bit: 7, label: "Lightning" }, // prettier-ignore
                        { offset: 0x1d0e4, bit: 0, label: "Feral Chaos", disabled: true }, // prettier-ignore
                        { offset: 0x1d0e4, bit: 1, label: "???", hidden: true }, // prettier-ignore
                        { offset: 0x1d0e4, bit: 2, label: "???", hidden: true }, // prettier-ignore
                        { offset: 0x1d0e4, bit: 3, label: "???", hidden: true }, // prettier-ignore
                        { offset: 0x1d0e4, bit: 4, label: "???", hidden: true }, // prettier-ignore
                        { offset: 0x1d0e4, bit: 5, label: "???", hidden: true }, // prettier-ignore
                        { offset: 0x1d0e4, bit: 6, label: "???", hidden: true }, // prettier-ignore
                        { offset: 0x1d0e4, bit: 7, label: "???", hidden: true }, // prettier-ignore
                        { offset: 0x1d0e5, bit: 0, label: "???", hidden: true }, // prettier-ignore
                        { offset: 0x1d0e5, bit: 1, label: "???", hidden: true }, // prettier-ignore
                        { offset: 0x1d0e5, bit: 2, label: "???", hidden: true }, // prettier-ignore
                        { offset: 0x1d0e5, bit: 3, label: "???", hidden: true }, // prettier-ignore
                        { offset: 0x1d0e5, bit: 4, label: "???", hidden: true }, // prettier-ignore
                        { offset: 0x1d0e5, bit: 5, label: "???", hidden: true }, // prettier-ignore
                        { offset: 0x1d0e5, bit: 6, label: "???", hidden: true }, // prettier-ignore
                        { offset: 0x1d0e5, bit: 7, label: "???", hidden: true }, // prettier-ignore
                        { offset: 0x1d0e6, bit: 0, label: "???", hidden: true }, // prettier-ignore
                        { offset: 0x1d0e6, bit: 1, label: "???", hidden: true }, // prettier-ignore
                        { offset: 0x1d0e6, bit: 2, label: "???", hidden: true }, // prettier-ignore
                        { offset: 0x1d0e6, bit: 3, label: "???", hidden: true }, // prettier-ignore
                        { offset: 0x1d0e6, bit: 4, label: "???", hidden: true }, // prettier-ignore
                        { offset: 0x1d0e6, bit: 5, label: "???", hidden: true }, // prettier-ignore
                        { offset: 0x1d0e6, bit: 6, label: "???", hidden: true }, // prettier-ignore
                        { offset: 0x1d0e6, bit: 7, label: "???", hidden: true }, // prettier-ignore
                        { offset: 0x1d0e7, bit: 0, label: "???", hidden: true }, // prettier-ignore
                        { offset: 0x1d0e7, bit: 1, label: "???", hidden: true }, // prettier-ignore
                        { offset: 0x1d0e7, bit: 2, label: "???", hidden: true }, // prettier-ignore
                        { offset: 0x1d0e7, bit: 3, label: "???", hidden: true }, // prettier-ignore
                        { offset: 0x1d0e7, bit: 4, label: "???", hidden: true }, // prettier-ignore
                        { offset: 0x1d0e7, bit: 5, label: "???", hidden: true }, // prettier-ignore
                        { offset: 0x1d0e7, bit: 6, label: "???", hidden: true }, // prettier-ignore
                        { offset: 0x1d0e7, bit: 7, label: "???", hidden: true }, // prettier-ignore
                        { offset: 0x1d0e8, bit: 0, label: "???", hidden: true }, // prettier-ignore
                        { offset: 0x1d0e8, bit: 1, label: "???", hidden: true }, // prettier-ignore
                        { offset: 0x1d0e8, bit: 2, label: "???", hidden: true }, // prettier-ignore
                        { offset: 0x1d0e8, bit: 3, label: "???", hidden: true }, // prettier-ignore
                        { offset: 0x1d0e8, bit: 4, label: "???", hidden: true }, // prettier-ignore
                      ],
                    },
                    {
                      name: "Secret Voices",
                      type: "bitflags",
                      flags: [
                        { offset: 0x1d0e8, bit: 5, label: "???", hidden: true }, // prettier-ignore
                        { offset: 0x1d0e8, bit: 6, label: "???", hidden: true }, // prettier-ignore
                        { offset: 0x1d0e8, bit: 7, label: "???", hidden: true }, // prettier-ignore
                        { offset: 0x1d0e9, bit: 0, label: "???", hidden: true }, // prettier-ignore
                        { offset: 0x1d0e9, bit: 1, label: "Warrior of Light", disabled: true }, // prettier-ignore
                        { offset: 0x1d0e9, bit: 1, label: "Garland", disabled: true }, // prettier-ignore
                        { offset: 0x1d0e9, bit: 1, label: "Firion", disabled: true }, // prettier-ignore
                        { offset: 0x1d0e9, bit: 1, label: "The Emperor", disabled: true }, // prettier-ignore
                        { offset: 0x1d0e9, bit: 1, label: "Onion Knight", disabled: true }, // prettier-ignore
                        { offset: 0x1d0e9, bit: 1, label: "Cloud of Darkness", disabled: true }, // prettier-ignore
                        { offset: 0x1d0e9, bit: 1, label: "Cecil Harvey", disabled: true }, // prettier-ignore
                        { offset: 0x1d0e9, bit: 2, label: "Golbez" }, // prettier-ignore
                        { offset: 0x1d0e9, bit: 1, label: "Bartz Klauser", disabled: true }, // prettier-ignore
                        { offset: 0x1d0e9, bit: 3, label: "Exdeath" }, // prettier-ignore
                        { offset: 0x1d0e9, bit: 1, label: "Terra Branford", disabled: true }, // prettier-ignore
                        { offset: 0x1d0e9, bit: 1, label: "Kefka Palazzo", disabled: true }, // prettier-ignore
                        { offset: 0x1d0e9, bit: 1, label: "Cloud Strife", disabled: true }, // prettier-ignore
                        { offset: 0x1d0e9, bit: 1, label: "Sephiroth", disabled: true }, // prettier-ignore
                        { offset: 0x1d0e9, bit: 1, label: "Squall Leonhart", disabled: true }, // prettier-ignore
                        { offset: 0x1d0e9, bit: 1, label: "Ultimecia", disabled: true }, // prettier-ignore
                        { offset: 0x1d0e9, bit: 1, label: "Zidane Tribal", disabled: true }, // prettier-ignore
                        { offset: 0x1d0e9, bit: 1, label: "Kuja", disabled: true }, // prettier-ignore
                        { offset: 0x1d0e9, bit: 1, label: "Tidus", disabled: true }, // prettier-ignore
                        { offset: 0x1d0e9, bit: 1, label: "Jecht", disabled: true }, // prettier-ignore
                        { offset: 0x1d0e9, bit: 1, label: "Shantotto", disabled: true }, // prettier-ignore
                        { offset: 0x1d0e9, bit: 1, label: "Gabranth", disabled: true }, // prettier-ignore
                        { offset: 0x1d0e9, bit: 4, label: "Kain Highwind" }, // prettier-ignore
                        { offset: 0x1d0e9, bit: 5, label: "Gilgamesh", disabled: true }, // prettier-ignore
                        { offset: 0x1d0e9, bit: 6, label: "Tifa Lockhart" }, // prettier-ignore
                        { offset: 0x1d0e9, bit: 7, label: "Laguna Loire" }, // prettier-ignore
                        { offset: 0x1d0ea, bit: 0, label: "Yuna" }, // prettier-ignore
                        { offset: 0x1d0ea, bit: 1, label: "Prishe" }, // prettier-ignore
                        { offset: 0x1d0ea, bit: 2, label: "Vaan" }, // prettier-ignore
                        { offset: 0x1d0ea, bit: 3, label: "Lightning", disabled: true }, // prettier-ignore
                        { offset: 0x1d0e9, bit: 1, label: "Feral Chaos", disabled: true }, // prettier-ignore
                      ],
                    },
                    {
                      name: "Encounter Voices",
                      type: "bitflags",
                      flags: [
                        { offset: 0x1d0ea, bit: 4, label: "???", hidden: true }, // prettier-ignore
                        { offset: 0x1d0ea, bit: 5, label: "???", hidden: true }, // prettier-ignore
                        { offset: 0x1d0ea, bit: 6, label: "???", hidden: true }, // prettier-ignore
                        { offset: 0x1d0ea, bit: 7, label: "???", hidden: true }, // prettier-ignore
                        { offset: 0x1d0eb, bit: 0, label: "Warrior of Light" }, // prettier-ignore
                        { offset: 0x1d0eb, bit: 1, label: "Garland" }, // prettier-ignore
                        { offset: 0x1d0eb, bit: 2, label: "Firion" }, // prettier-ignore
                        { offset: 0x1d0eb, bit: 3, label: "The Emperor" }, // prettier-ignore
                        { offset: 0x1d0eb, bit: 4, label: "Onion Knight" }, // prettier-ignore
                        { offset: 0x1d0eb, bit: 5, label: "Cloud of Darkness" }, // prettier-ignore
                        { offset: 0x1d0eb, bit: 6, label: "Cecil Harvey" }, // prettier-ignore
                        { offset: 0x1d0eb, bit: 7, label: "Golbez" }, // prettier-ignore
                        { offset: 0x1d0ec, bit: 0, label: "Bartz Klauser" }, // prettier-ignore
                        { offset: 0x1d0ec, bit: 1, label: "Exdeath" }, // prettier-ignore
                        { offset: 0x1d0ec, bit: 2, label: "Terra Branford" }, // prettier-ignore
                        { offset: 0x1d0ec, bit: 3, label: "Kefka Palazzo" }, // prettier-ignore
                        { offset: 0x1d0ec, bit: 4, label: "Cloud Strife" }, // prettier-ignore
                        { offset: 0x1d0ec, bit: 5, label: "Sephiroth" }, // prettier-ignore
                        { offset: 0x1d0ec, bit: 6, label: "Squall Leonhart" }, // prettier-ignore
                        { offset: 0x1d0ec, bit: 7, label: "Ultimecia" }, // prettier-ignore
                        { offset: 0x1d0ed, bit: 0, label: "Zidane Tribal" }, // prettier-ignore
                        { offset: 0x1d0ed, bit: 1, label: "Kuja" }, // prettier-ignore
                        { offset: 0x1d0ed, bit: 2, label: "Tidus" }, // prettier-ignore
                        { offset: 0x1d0ed, bit: 3, label: "Jecht" }, // prettier-ignore
                        { offset: 0x1d0ed, bit: 4, label: "Shantotto" }, // prettier-ignore
                        { offset: 0x1d0ed, bit: 5, label: "Gabranth" }, // prettier-ignore
                        { offset: 0x1d0ed, bit: 6, label: "Kain Highwind" }, // prettier-ignore
                        { offset: 0x1d0ed, bit: 7, label: "Gilgamesh" }, // prettier-ignore
                        { offset: 0x1d0ee, bit: 0, label: "Tifa Lockhart" }, // prettier-ignore
                        { offset: 0x1d0ee, bit: 1, label: "Laguna Loire" }, // prettier-ignore
                        { offset: 0x1d0ee, bit: 2, label: "Yuna" }, // prettier-ignore
                        { offset: 0x1d0ee, bit: 3, label: "Prishe" }, // prettier-ignore
                        { offset: 0x1d0ee, bit: 4, label: "Vaan" }, // prettier-ignore
                        { offset: 0x1d0ee, bit: 5, label: "Lightning" }, // prettier-ignore
                        { offset: 0x1d0ee, bit: 6, label: "Feral Chaos" }, // prettier-ignore
                        { offset: 0x1d0ee, bit: 7, label: "Chaos" }, // prettier-ignore
                      ],
                    },
                  ],
                },
                {
                  name: "System",
                  flex: true,
                  items: [
                    {
                      name: "Stages",
                      type: "bitflags",
                      flags: [
                        { offset: 0x1d0ef, bit: 0, label: "???", hidden: true }, // prettier-ignore
                        { offset: 0x1d0ef, bit: 1, label: "???", hidden: true }, // prettier-ignore
                        { offset: 0x1d0ef, bit: 2, label: "???", hidden: true }, // prettier-ignore
                        { offset: 0x1d0ef, bit: 3, label: "???", hidden: true }, // prettier-ignore
                        { offset: 0x1d0f0, bit: 1, label: "???", hidden: true }, // prettier-ignore
                        { offset: 0x1d0f0, bit: 2, label: "???", hidden: true }, // prettier-ignore
                        { offset: 0x1d0f0, bit: 3, label: "???", hidden: true }, // prettier-ignore
                        { offset: 0x1d0f0, bit: 4, label: "???", hidden: true }, // prettier-ignore
                        { offset: 0x1d0f0, bit: 5, label: "Old Chaos Shrine Ω" }, // prettier-ignore
                        { offset: 0x1d0f0, bit: 6, label: "Pandaemonium Ω" }, // prettier-ignore
                        { offset: 0x1d0f0, bit: 7, label: "World of Darkness Ω" }, // prettier-ignore
                        { offset: 0x1d0f1, bit: 0, label: "Lunar Subterrane Ω" }, // prettier-ignore
                        { offset: 0x1d0f1, bit: 1, label: "The Rift Ω" }, // prettier-ignore
                        { offset: 0x1d0f1, bit: 2, label: "Kefka Tower Ω" }, // prettier-ignore
                        { offset: 0x1d0f1, bit: 3, label: "Planet's Core Ω" }, // prettier-ignore
                        { offset: 0x1d0f1, bit: 4, label: "Ultimecia's Castle Ω" }, // prettier-ignore
                        { offset: 0x1d0f1, bit: 5, label: "Crystal World Ω" }, // prettier-ignore
                        { offset: 0x1d0f1, bit: 6, label: "Dream's End Ω" }, // prettier-ignore
                        { offset: 0x1d0f1, bit: 7, label: "Empyreal Paradox Ω" }, // prettier-ignore
                        { offset: 0x1d0f2, bit: 0, label: "Sky Fortress Bahamut Ω" }, // prettier-ignore
                        { offset: 0x1d0f2, bit: 1, label: "Orphan's Cradle Ω" }, // prettier-ignore
                        { offset: 0x1d0f2, bit: 3, label: "Order's Sanctuary Ω" }, // prettier-ignore
                        { offset: 0x1d0ef, bit: 4, label: "Edge of Madness" }, // prettier-ignore
                        { offset: 0x1d0f2, bit: 2, label: "Edge of Madness Ω" }, // prettier-ignore
                        { offset: 0x1d0f0, bit: 0, label: "Pandaemonium - Top Floor" }, // prettier-ignore
                        { offset: 0x1d0ef, bit: 7, label: "Crystal Tower" }, // prettier-ignore
                        { offset: 0x1d0ef, bit: 5, label: "Phantom Train" }, // prettier-ignore
                        { offset: 0x1d0ef, bit: 6, label: "M.S. Prima Vista" }, // prettier-ignore
                        { offset: 0x1d0f2, bit: 4, label: "???", hidden: true }, // prettier-ignore
                        { offset: 0x1d0f2, bit: 5, label: "???", hidden: true }, // prettier-ignore
                        { offset: 0x1d0f2, bit: 6, label: "???", hidden: true }, // prettier-ignore
                        { offset: 0x1d0f2, bit: 7, label: "???", hidden: true }, // prettier-ignore
                      ],
                    },
                    {
                      type: "section",
                      items: [
                        {
                          name: "Presets",
                          type: "bitflags",
                          flags: [
                            { offset: 0x1d0f7, bit: 4, label: "Preset - Lv 50" }, // prettier-ignore
                            { offset: 0x1d0f7, bit: 5, label: "Preset - Lv 100" }, // prettier-ignore
                          ],
                        },
                        {
                          name: "CPU Level Caps",
                          type: "bitflags",
                          flags: [
                            { offset: 0x1d0f4, bit: 2, label: "CPU Level Cap + 10" }, // prettier-ignore
                            { offset: 0x1d0f4, bit: 3, label: "CPU Level Cap + 20" }, // prettier-ignore
                            { offset: 0x1d0f4, bit: 4, label: "CPU Level Cap + 30" }, // prettier-ignore
                            { offset: 0x1d0f4, bit: 5, label: "CPU Level Cap + 40" }, // prettier-ignore
                            { offset: 0x1d0f4, bit: 6, label: "CPU Level Cap + 50" }, // prettier-ignore
                            { offset: 0x1d0f4, bit: 7, label: "CPU Level Cap + 60" }, // prettier-ignore
                            { offset: 0x1d0f5, bit: 0, label: "CPU Level Cap + 70" }, // prettier-ignore
                            { offset: 0x1d0f5, bit: 1, label: "CPU Level Cap + 80" }, // prettier-ignore
                            { offset: 0x1d0f5, bit: 2, label: "CPU Level Cap + 90" }, // prettier-ignore
                            { offset: 0x1d0f5, bit: 3, label: "CPU Level Cap + 100" }, // prettier-ignore
                          ],
                        },
                        {
                          name: "Rulesets",
                          type: "bitflags",
                          flags: [
                            { offset: 0x1d0f3, bit: 0, label: "Chaos Judgment" }, // prettier-ignore
                            { offset: 0x1d0f3, bit: 1, label: "Cosmos Judgment" }, // prettier-ignore
                            { offset: 0x1d0f3, bit: 2, label: "Double Judgment" }, // prettier-ignore
                          ],
                        },
                      ],
                    },
                    {
                      name: "Matchs",
                      type: "bitflags",
                      flags: [
                        { offset: 0x1d0f6, bit: 2, label: "Online Match - Gain AP After Loss" }, // prettier-ignore
                        { offset: 0x1d0f6, bit: 3, label: "Online Match - Gain Gil After Loss" }, // prettier-ignore
                        { offset: 0x1d0f6, bit: 4, label: "Online Match - Gain Item After Loss" }, // prettier-ignore
                        { offset: 0x1d0f6, bit: 5, label: "Online Match - Gain Accessories After Loss" }, // prettier-ignore
                        { offset: 0x1d0f6, bit: 7, label: "Ghost Match - Battlegen OK" }, // prettier-ignore
                        { offset: 0x1d0f6, bit: 6, label: "Online Match - Battlegen OK" }, // prettier-ignore
                      ],
                    },
                    {
                      name: "Miscellaneous",
                      type: "bitflags",
                      flags: [
                        { offset: 0x1d083, bit: 0, label: "Main Scenario: An Untold Tale" }, // prettier-ignore
                        { offset: 0x1d0f7, bit: 3, label: "Arcade Mode - Time Attack" }, // prettier-ignore
                        { offset: 0x1d0f6, bit: 1, label: "Trade Component Drop OK" }, // prettier-ignore
                      ],
                    },
                  ],
                },
                {
                  name: "Calendar",
                  flex: true,
                  items: [
                    {
                      name: "EXP Icon Boosts",
                      type: "bitflags",
                      flags: [
                        { offset: 0x1d0fa, bit: 6, label: "EXP Icon Boost Lv 2" }, // prettier-ignore
                        { offset: 0x1d0fa, bit: 7, label: "EXP Icon Boost Lv 3" }, // prettier-ignore
                        { offset: 0x1d0fb, bit: 0, label: "EXP Icon Boost Lv 4" }, // prettier-ignore
                        { offset: 0x1d0fb, bit: 1, label: "EXP Icon Boost Lv 5" }, // prettier-ignore
                        { offset: 0x1d0fb, bit: 2, label: "EXP Icon Boost Lv 6" }, // prettier-ignore
                        { offset: 0x1d0fb, bit: 3, label: "EXP Icon Boost Lv 7" }, // prettier-ignore
                        { offset: 0x1d0fb, bit: 4, label: "EXP Icon Boost Lv 8" }, // prettier-ignore
                        { offset: 0x1d0fb, bit: 5, label: "EXP Icon Boost Lv 9" }, // prettier-ignore
                        { offset: 0x1d0fb, bit: 6, label: "EXP Icon Boost Lv 10" }, // prettier-ignore
                      ],
                    },
                    {
                      type: "section",
                      items: [
                        {
                          name: "PP Icon Boosts",
                          type: "bitflags",
                          flags: [
                            { offset: 0x1d0fc, bit: 3, label: "PP Icon Boost Lv 2" }, // prettier-ignore
                            { offset: 0x1d0fc, bit: 4, label: "PP Icon Boost Lv 3" }, // prettier-ignore
                          ],
                        },
                        {
                          name: "AP Icon Boosts",
                          type: "bitflags",
                          flags: [
                            { offset: 0x1d0fe, bit: 6, label: "AP Icon Boost Lv 2" }, // prettier-ignore
                            { offset: 0x1d0fe, bit: 7, label: "AP Icon Boost Lv 3" }, // prettier-ignore
                          ],
                        },
                      ],
                    },
                    {
                      name: "Gil Icon Boosts",
                      type: "bitflags",
                      flags: [
                        { offset: 0x1d0fd, bit: 1, label: "Gil Icon Boost Lv 2" }, // prettier-ignore
                        { offset: 0x1d0fd, bit: 2, label: "Gil Icon Boost Lv 3" }, // prettier-ignore
                        { offset: 0x1d0fd, bit: 3, label: "Gil Icon Boost Lv 4" }, // prettier-ignore
                        { offset: 0x1d0fd, bit: 4, label: "Gil Icon Boost Lv 5" }, // prettier-ignore
                        { offset: 0x1d0fd, bit: 5, label: "Gil Icon Boost Lv 6" }, // prettier-ignore
                        { offset: 0x1d0fd, bit: 6, label: "Gil Icon Boost Lv 7" }, // prettier-ignore
                        { offset: 0x1d0fd, bit: 7, label: "Gil Icon Boost Lv 8" }, // prettier-ignore
                        { offset: 0x1d0fe, bit: 0, label: "Gil Icon Boost Lv 9" }, // prettier-ignore
                        { offset: 0x1d0fe, bit: 1, label: "Gil Icon Boost Lv 10" }, // prettier-ignore
                      ],
                    },
                    {
                      name: "Icon Likelihood",
                      type: "bitflags",
                      flags: [
                        { offset: 0x1d0ff, bit: 4, label: "Icon Likelihood Lv 2" }, // prettier-ignore
                        { offset: 0x1d0ff, bit: 5, label: "Icon Likelihood Lv 3" }, // prettier-ignore
                        { offset: 0x1d0ff, bit: 6, label: "Icon Likelihood Lv 4" }, // prettier-ignore
                        { offset: 0x1d0ff, bit: 7, label: "Icon Likelihood Lv 5" }, // prettier-ignore
                        { offset: 0x1d100, bit: 0, label: "Icon Likelihood Lv 6" }, // prettier-ignore
                        { offset: 0x1d100, bit: 1, label: "Icon Likelihood Lv 7" }, // prettier-ignore
                        { offset: 0x1d100, bit: 2, label: "Icon Likelihood Lv 8" }, // prettier-ignore
                        { offset: 0x1d100, bit: 3, label: "Icon Likelihood Lv 9" }, // prettier-ignore
                        { offset: 0x1d100, bit: 4, label: "Icon Likelihood Lv 10" }, // prettier-ignore
                      ],
                    },
                  ],
                },
                {
                  name: "Icons",
                  flex: true,
                  items: [
                    {
                      type: "bitflags",
                      flags: [
                        { offset: 0x1d106, bit: 4, label: "[FFI] Set of 4" }, // prettier-ignore
                        { offset: 0x1d106, bit: 5, label: "[FFI] Set of 4" }, // prettier-ignore
                        { offset: 0x1d106, bit: 6, label: "[FFI] Set of 4" }, // prettier-ignore
                        { offset: 0x1d106, bit: 7, label: "[FFI] Set of 4", separator: true }, // prettier-ignore
                        { offset: 0x1d107, bit: 0, label: "[FFII] Set of 5" }, // prettier-ignore
                        { offset: 0x1d107, bit: 1, label: "[FFII] Set of 5" }, // prettier-ignore
                        { offset: 0x1d107, bit: 2, label: "[FFII] Set of 4" }, // prettier-ignore
                        { offset: 0x1d107, bit: 3, label: "[FFII] Set of 4", separator: true }, // prettier-ignore
                        { offset: 0x1d107, bit: 4, label: "[FFIII] Set of 4" }, // prettier-ignore
                        { offset: 0x1d107, bit: 5, label: "[FFIII] Set of 4" }, // prettier-ignore
                        { offset: 0x1d107, bit: 6, label: "[FFIII] Set of 4" }, // prettier-ignore
                        { offset: 0x1d107, bit: 7, label: "[FFIII] Set of 4" }, // prettier-ignore
                        { offset: 0x1d108, bit: 0, label: "[FFIII] Set of 3" }, // prettier-ignore
                        { offset: 0x1d108, bit: 1, label: "[FFIII] Set of 3", separator: true }, // prettier-ignore
                        { offset: 0x1d108, bit: 2, label: "[FFIV] Set of 2" }, // prettier-ignore
                        { offset: 0x1d108, bit: 3, label: "[FFIV] Set of 4" }, // prettier-ignore
                        { offset: 0x1d108, bit: 4, label: "[FFIV] Set of 4" }, // prettier-ignore
                        { offset: 0x1d108, bit: 5, label: "[FFIV] Set of 2" }, // prettier-ignore
                        { offset: 0x1d108, bit: 6, label: "[FFIV] Set of 4" }, // prettier-ignore
                        { offset: 0x1d108, bit: 7, label: "[FFIV] Set of 4" }, // prettier-ignore
                        { offset: 0x1d109, bit: 0, label: "[FFIV] Set of 4" }, // prettier-ignore
                        { offset: 0x1d109, bit: 1, label: "[FFIV] Set of 3" }, // prettier-ignore
                        { offset: 0x1d109, bit: 2, label: "[FFIV] Set of 3", separator: true }, // prettier-ignore
                        { offset: 0x1d109, bit: 3, label: "[FFV] Set of 3" }, // prettier-ignore
                        { offset: 0x1d109, bit: 4, label: "[FFV] Set of 4" }, // prettier-ignore
                        { offset: 0x1d109, bit: 5, label: "[FFV] Set of 3" }, // prettier-ignore
                        { offset: 0x1d109, bit: 6, label: "[FFV] Set of 4" }, // prettier-ignore
                        { offset: 0x1d109, bit: 7, label: "[FFV] Set of 4" }, // prettier-ignore
                        { offset: 0x1d10a, bit: 0, label: "[FFV] Set of 3" }, // prettier-ignore
                        { offset: 0x1d10a, bit: 1, label: "[FFV] Set of 3" }, // prettier-ignore
                        { offset: 0x1d10a, bit: 2, label: "[FFV] Set of 4" }, // prettier-ignore
                      ],
                    },
                    {
                      type: "bitflags",
                      flags: [
                        { offset: 0x1d10a, bit: 3, label: "[FFVI] Set of 4" }, // prettier-ignore
                        { offset: 0x1d10a, bit: 4, label: "[FFVI] Set of 4" }, // prettier-ignore
                        { offset: 0x1d10a, bit: 5, label: "[FFVI] Set of 4" }, // prettier-ignore
                        { offset: 0x1d10a, bit: 6, label: "[FFVI] Set of 4" }, // prettier-ignore
                        { offset: 0x1d10a, bit: 7, label: "[FFVI] Set of 4" }, // prettier-ignore
                        { offset: 0x1d10b, bit: 0, label: "[FFVI] Set of 4" }, // prettier-ignore
                        { offset: 0x1d10b, bit: 1, label: "[FFVI] Set of 4" }, // prettier-ignore
                        { offset: 0x1d10b, bit: 2, label: "[FFVI] Set of 4" }, // prettier-ignore
                        { offset: 0x1d10b, bit: 3, label: "[FFVI] Set of 4", separator: true }, // prettier-ignore
                        { offset: 0x1d10b, bit: 4, label: "[FFVII] Set of 2" }, // prettier-ignore
                        { offset: 0x1d10b, bit: 5, label: "[FFVII] Set of 4", separator: true }, // prettier-ignore
                        { offset: 0x1d10b, bit: 6, label: "[FFVIII] Set of 4" }, // prettier-ignore
                        { offset: 0x1d10b, bit: 7, label: "[FFVIII] Set of 3", separator: true }, // prettier-ignore
                        { offset: 0x1d10c, bit: 0, label: "[FFIX] Set of 4" }, // prettier-ignore
                        { offset: 0x1d10c, bit: 1, label: "[FFIX] Set of 3", separator: true }, // prettier-ignore
                        { offset: 0x1d10c, bit: 2, label: "[FFX] Set of 2" }, // prettier-ignore
                        { offset: 0x1d10c, bit: 3, label: "[FFX] Set of 3", separator: true }, // prettier-ignore
                        { offset: 0x1d10c, bit: 4, label: "[FFXI] Set of 4" }, // prettier-ignore
                        { offset: 0x1d10c, bit: 5, label: "[FFXI] Set of 4", separator: true }, // prettier-ignore
                        { offset: 0x1d10c, bit: 6, label: "[FFXII] Set of 3" }, // prettier-ignore
                        { offset: 0x1d10c, bit: 7, label: "[FFXII] Set of 3" }, // prettier-ignore
                        { offset: 0x1d10d, bit: 0, label: "[FFXII] Set of 3", separator: true }, // prettier-ignore
                        { offset: 0x1d10d, bit: 6, label: "[FFXIII] Set", separator: true }, // prettier-ignore
                        { offset: 0x1d10d, bit: 7, label: "[FFXIV] Set" }, // prettier-ignore
                      ],
                    },
                    {
                      type: "bitflags",
                      flags: [
                        { offset: 0x1d10d, bit: 1, label: "Nostalgic Foes" }, // prettier-ignore
                        { offset: 0x1d10d, bit: 2, label: "Memorable Enemies - 1" }, // prettier-ignore
                        { offset: 0x1d10d, bit: 3, label: "Memorable Enemies - 2" }, // prettier-ignore
                        { offset: 0x1d10d, bit: 4, label: "Esper Collection" }, // prettier-ignore
                        { offset: 0x1d10d, bit: 5, label: "Airships - Set of 3" }, // prettier-ignore
                        { offset: 0x1d11f, bit: 4, label: "Master Destroyer" }, // prettier-ignore
                        { offset: 0x1d11f, bit: 2, label: "Avenger" }, // prettier-ignore
                        { offset: 0x1d120, bit: 1, label: "Walker of the Path Less Taken" }, // prettier-ignore
                        { offset: 0x1d11f, bit: 0, label: "Great General" }, // prettier-ignore
                        { offset: 0x1d11f, bit: 1, label: "Troubled Hero" }, // prettier-ignore
                        { offset: 0x1d120, bit: 3, label: "Wayfarer" }, // prettier-ignore
                        { offset: 0x1d11f, bit: 6, label: "EX Core Collector" }, // prettier-ignore
                        { offset: 0x1d120, bit: 4, label: "Medal King" }, // prettier-ignore
                        { offset: 0x1d11f, bit: 5, label: "Cultivator" }, // prettier-ignore
                        { offset: 0x1d120, bit: 2, label: "God of Destruction" }, // prettier-ignore
                        { offset: 0x1d11f, bit: 7, label: "Technician" }, // prettier-ignore
                        { offset: 0x1d120, bit: 0, label: "Esper Lord" }, // prettier-ignore
                        { offset: 0x1d110, bit: 6, label: "Connoisseur" }, // prettier-ignore
                        { offset: 0x1d11e, bit: 7, label: "El Dorado" }, // prettier-ignore
                        { offset: 0x1d11f, bit: 3, label: "Gillionaire" }, // prettier-ignore
                      ],
                    },
                    {
                      type: "bitflags",
                      flags: [
                        { offset: 0x1d10e, bit: 0, label: "[Avatar] Warrior of Light" }, // prettier-ignore
                        { offset: 0x1d10e, bit: 1, label: "[Avatar] Firion" }, // prettier-ignore
                        { offset: 0x1d10e, bit: 2, label: "[Avatar] Onion Knight" }, // prettier-ignore
                        { offset: 0x1d10e, bit: 3, label: "[Avatar] Cecil" }, // prettier-ignore
                        { offset: 0x1d10e, bit: 4, label: "[Avatar] Kain" }, // prettier-ignore
                        { offset: 0x1d10e, bit: 5, label: "[Avatar] Bartz" }, // prettier-ignore
                        { offset: 0x1d10e, bit: 6, label: "[Avatar] Terra" }, // prettier-ignore
                        { offset: 0x1d10e, bit: 7, label: "[Avatar] Cloud" }, // prettier-ignore
                        { offset: 0x1d10f, bit: 0, label: "[Avatar] Tifa" }, // prettier-ignore
                        { offset: 0x1d10f, bit: 1, label: "[Avatar] Squall" }, // prettier-ignore
                        { offset: 0x1d10f, bit: 2, label: "[Avatar] Laguna" }, // prettier-ignore
                        { offset: 0x1d10f, bit: 3, label: "[Avatar] Zidane" }, // prettier-ignore
                        { offset: 0x1d10f, bit: 4, label: "[Avatar] Tidus" }, // prettier-ignore
                        { offset: 0x1d10f, bit: 5, label: "[Avatar] Yuna" }, // prettier-ignore
                        { offset: 0x1d10f, bit: 6, label: "[Avatar] Shantotto" }, // prettier-ignore
                        { offset: 0x1d10f, bit: 7, label: "[Avatar] Prishe" }, // prettier-ignore
                        { offset: 0x1d110, bit: 0, label: "[Avatar] Vaan" }, // prettier-ignore
                        { offset: 0x1d110, bit: 1, label: "[Avatar] Lightning" }, // prettier-ignore
                      ],
                    },
                  ],
                },
                {
                  name: "Etc",
                  flex: true,
                  items: [
                    // 0x1D074 | uint16 | Item Drop Rate Up Quantity
                    // 0x1D076 | uint16 | Battlegen Rate Up Quantity
                    {
                      type: "section",
                      items: [
                        {
                          name: "Rate Ups",
                          type: "bitflags",
                          flags: [
                            { offset: 0x1d0f8, bit: 0, label: "Item Drop Rate Up" }, // prettier-ignore
                            { offset: 0x1d0f8, bit: 1, label: "Battlegen Rate Up" }, // prettier-ignore
                            { offset: 0x1d0f8, bit: 2, label: "Item Drop Rate Up (10 pack)" }, // prettier-ignore
                            { offset: 0x1d0f8, bit: 3, label: "Battlegen Rate Up (10 pack)" }, // prettier-ignore
                          ],
                        },
                        {
                          name: "Play Plans",
                          type: "bitflags",
                          flags: [
                            { offset: 0x1d102, bit: 1, label: "Black Chocobo Course" }, // prettier-ignore
                            { offset: 0x1d102, bit: 2, label: "Fat Chocobo Course" }, // prettier-ignore
                          ],
                        },
                      ],
                    },
                    {
                      name: "Friend Reward Boosts",
                      type: "bitflags",
                      flags: [
                        { offset: 0x1d0f9, bit: 0, label: "Friend Reward Boost Lv 1" }, // prettier-ignore
                        { offset: 0x1d0f9, bit: 1, label: "Friend Reward Boost Lv 2" }, // prettier-ignore
                        { offset: 0x1d0f9, bit: 2, label: "Friend Reward Boost Lv 3" }, // prettier-ignore
                        { offset: 0x1d0f9, bit: 3, label: "Friend Reward Boost Lv 4" }, // prettier-ignore
                        { offset: 0x1d0f9, bit: 4, label: "Friend Reward Boost Lv 5" }, // prettier-ignore
                        { offset: 0x1d0f9, bit: 5, label: "Friend Reward Boost Lv 6" }, // prettier-ignore
                        { offset: 0x1d0f9, bit: 6, label: "Friend Reward Boost Lv 7" }, // prettier-ignore
                        { offset: 0x1d0f9, bit: 7, label: "Friend Reward Boost Lv 8" }, // prettier-ignore
                        { offset: 0x1d0fa, bit: 0, label: "Friend Reward Boost Lv 9" }, // prettier-ignore
                        { offset: 0x1d0fa, bit: 1, label: "Friend Reward Boost Lv 10" }, // prettier-ignore
                      ],
                    },
                    {
                      name: "BGM",
                      type: "bitflags",
                      flags: [
                        { offset: 0x1d102, bit: 7, label: "FFI - Town" }, // prettier-ignore
                        { offset: 0x1d104, bit: 3, label: "FFI - Mt. Gulg", separator: true }, // prettier-ignore
                        { offset: 0x1d103, bit: 0, label: "FFII - The Rebel Army" }, // prettier-ignore
                        { offset: 0x1d104, bit: 4, label: "FFII - The Imperial Army", separator: true }, // prettier-ignore
                        { offset: 0x1d103, bit: 1, label: "FFIII - The Crystal Tower" }, // prettier-ignore
                        { offset: 0x1d104, bit: 5, label: "FFIII - Let Me Know the Truth", separator: true }, // prettier-ignore
                        { offset: 0x1d103, bit: 2, label: "FFIV - The Red Wings" }, // prettier-ignore
                        { offset: 0x1d104, bit: 6, label: "FFIV - Theme of Love", separator: true }, // prettier-ignore
                        { offset: 0x1d103, bit: 3, label: "FFV - The Decisive Battle" }, // prettier-ignore
                        { offset: 0x1d104, bit: 7, label: "FFV - Home, Sweet Home", separator: true }, // prettier-ignore
                        { offset: 0x1d103, bit: 4, label: "FFVI - Dancing Mad" }, // prettier-ignore
                        { offset: 0x1d105, bit: 0, label: "FFVI - Searching for Friends" }, // prettier-ignore
                      ],
                    },
                    {
                      name: "BGM",
                      type: "bitflags",
                      flags: [
                        { offset: 0x1d103, bit: 5, label: "FFVII - Opening - Bombing Mission" }, // prettier-ignore
                        { offset: 0x1d105, bit: 1, label: "FFVII - Let the Battles Begin!", separator: true }, // prettier-ignore
                        { offset: 0x1d103, bit: 6, label: "FFVIII - The Man with the Machine Gun" }, // prettier-ignore
                        { offset: 0x1d105, bit: 2, label: "FFVIII - Premonition", separator: true }, // prettier-ignore
                        { offset: 0x1d103, bit: 7, label: "FFIX - The Darkness of Eternity" }, // prettier-ignore
                        { offset: 0x1d105, bit: 3, label: "FFIX - Not Alone", separator: true }, // prettier-ignore
                        { offset: 0x1d104, bit: 0, label: "FFX - Fight with Seymour" }, // prettier-ignore
                        { offset: 0x1d105, bit: 4, label: "FFX - A Fleeting Dream", separator: true }, // prettier-ignore
                        { offset: 0x1d104, bit: 1, label: "FFXI - Awakening" }, // prettier-ignore
                        { offset: 0x1d105, bit: 5, label: "FFXI - Iron Colossus", separator: true }, // prettier-ignore
                        { offset: 0x1d104, bit: 2, label: "FFXII - Fight to the Death" }, // prettier-ignore
                        { offset: 0x1d105, bit: 6, label: "FFXII - The Battle for Freedom", separator: true }, // prettier-ignore
                        { offset: 0x1d105, bit: 7, label: "FFXIII - Nascent Requiem" }, // prettier-ignore
                      ],
                    },
                  ],
                },
              ],
            },
          ],
        },
        {
          name: "Story Mode",
          items: [
            {
              type: "tabs",
              items: [
                {
                  name: "General",
                  items: [
                    {
                      name: "Slots",
                      offset: 0x3e640,
                      type: "variable",
                      dataType: "uint32",
                      max: 5,
                    },
                    {
                      type: "section",
                      flex: true,
                      noMargin: true,
                      items: [
                        {
                          id: "skill-0",
                          name: "Skill 1",
                          offset: 0x3e644,
                          type: "variable",
                          dataType: "uint32",
                          resource: "skills",
                          autocomplete: true,
                        },
                        {
                          id: "skill-1",
                          name: "Skill 2",
                          offset: 0x3e648,
                          type: "variable",
                          dataType: "uint32",
                          resource: "skills",
                          autocomplete: true,
                        },
                        {
                          id: "skill-2",
                          name: "Skill 3",
                          offset: 0x3e64c,
                          type: "variable",
                          dataType: "uint32",
                          resource: "skills",
                          autocomplete: true,
                        },
                        {
                          id: "skill-3",
                          name: "Skill 4",
                          offset: 0x3e650,
                          type: "variable",
                          dataType: "uint32",
                          resource: "skills",
                          autocomplete: true,
                        },
                        {
                          id: "skill-4",
                          name: "Skill 5",
                          offset: 0x3e654,
                          type: "variable",
                          dataType: "uint32",
                          resource: "skills",
                          autocomplete: true,
                        },
                      ],
                    },
                    {
                      name: "Temporary Skill",
                      offset: 0x3e658,
                      type: "variable",
                      dataType: "uint32",
                      resource: "skills",
                      autocomplete: true,
                    },
                  ],
                },
                {
                  name: "012: Treachery of the Gods",
                  items: [
                    {
                      type: "tabs",
                      vertical: true,
                      items: [
                        {
                          name: "General",
                          items: [
                            {
                              name: "Number of Powers",
                              offset: 0x3dc4d,
                              type: "variable",
                              dataType: "uint8",
                              max: 3,
                            },
                            {
                              name: "Completed Chapters",
                              type: "bitflags",
                              flags: [
                                { offset: 0x1d08f, bit: 0, label: "Prologue" }, // prettier-ignore
                                { offset: 0x1d090, bit: 2, label: "Chapter 1" }, // prettier-ignore
                                { offset: 0x1d091, bit: 4, label: "Chapter 2" }, // prettier-ignore
                                { offset: 0x1d092, bit: 6, label: "Chapter 3" }, // prettier-ignore
                                { offset: 0x1d094, bit: 0, label: "Chapter 4" }, // prettier-ignore
                                { offset: 0x1d095, bit: 2, label: "Chapter 5" }, // prettier-ignore
                                { offset: 0x1d096, bit: 4, label: "Chapter 6" }, // prettier-ignore
                                { offset: 0x1d097, bit: 6, label: "Chapter 7" }, // prettier-ignore
                                { offset: 0x1d099, bit: 0, label: "Epilogue" }, // prettier-ignore
                              ],
                            },
                            {
                              name: "Powers",
                              type: "bitflags",
                              hidden: true,
                              flags: [
                                { offset: 0x3dcd3, bit: 5, label: "Cornelia Plains" }, // prettier-ignore
                                { offset: 0x3dcd3, bit: 6, label: "Cornelia Plains" }, // prettier-ignore
                                { offset: 0x3dcd3, bit: 7, label: "Cornelia Plains" }, // prettier-ignore
                                { offset: 0x3dcd4, bit: 0, label: "Cornelia Plains", separator: true }, // prettier-ignore
                                { offset: 0x3dce2, bit: 4, label: "Ancient Volcano Ring - Gulg" }, // prettier-ignore
                                { offset: 0x3dce2, bit: 5, label: "Ancient Volcano Ring - Gulg" }, // prettier-ignore
                                { offset: 0x3dce2, bit: 6, label: "Ancient Volcano Ring - Gulg" }, // prettier-ignore
                                { offset: 0x3dce2, bit: 7, label: "Ancient Volcano Ring - Gulg" }, // prettier-ignore
                              ],
                            },
                          ],
                        },
                        {
                          name: "Prologue",
                          flex: true,
                          items: [
                            {
                              name: "World Map Chests",
                              type: "bitflags",
                              flags: [
                                { offset: 0x3dd50, bit: 4, label: "50 gil" }, // prettier-ignore
                              ],
                            },
                            {
                              name: "Cleared Gateways",
                              type: "bitflags",
                              flags: [
                                { offset: 0x1d229, bit: 1, label: "Gateway to Departure" }, // prettier-ignore
                              ],
                            },
                            {
                              name: "Gateway Chests",
                              type: "bitflags",
                              flags: [
                                { offset: 0x3e65c, bit: 5, label: "Gateway to Departure: Broadsword" }, // prettier-ignore
                              ],
                            },
                          ],
                        },
                        {
                          name: "Chapter 1",
                          flex: true,
                          items: [
                            {
                              name: "World Map Chests",
                              type: "bitflags",
                              flags: [
                                { offset: 0x3dd50, bit: 5, label: "Cure" }, // prettier-ignore
                                { offset: 0x3dd50, bit: 6, label: "Pink Tail" }, // prettier-ignore
                                { offset: 0x3dd54, bit: 6, label: "Power Ring" }, // prettier-ignore
                                { offset: 0x3dd54, bit: 7, label: "120 gil" }, // prettier-ignore
                                { offset: 0x3dd55, bit: 0, label: "EX Charge" }, // prettier-ignore
                                { offset: 0x3dd55, bit: 1, label: "Rosetta Stone" }, // prettier-ignore
                              ],
                            },
                            {
                              name: "Cleared Gateways",
                              type: "bitflags",
                              flags: [
                                { offset: 0x1d08f, bit: 2, label: "Crescent Lake Gateway", hidden: true }, // prettier-ignore
                                { offset: 0x1d229, bit: 2, label: "Crescent Lake Gateway" }, // prettier-ignore
                                { offset: 0x1d08f, bit: 3, label: "Sage's Path Gateway", hidden: true }, // prettier-ignore
                                { offset: 0x1d229, bit: 3, label: "Sage's Path Gateway" }, // prettier-ignore
                                { offset: 0x1d229, bit: 4, label: "Gateway of Fools and Hope" }, // prettier-ignore
                              ],
                            },
                            {
                              name: "Gateway Chests",
                              type: "bitflags",
                              flags: [
                                { offset: 0x3e65c, bit: 7, label: "Crescent Lake Gateway: Buckler" }, // prettier-ignore
                                { offset: 0x3e65d, bit: 0, label: "???", hidden: true }, // prettier-ignore
                                { offset: 0x3e65d, bit: 1, label: "Sage's Path Gateway: Bronze Helm", separator: true }, // prettier-ignore
                                { offset: 0x3e65d, bit: 2, label: "???", hidden: true }, // prettier-ignore
                                { offset: 0x3e65d, bit: 3, label: "Sage's Path Gateway: Soul of Destruction" }, // prettier-ignore
                                { offset: 0x3e65d, bit: 4, label: "Sage's Path Gateway: 200 gil", separator: true }, // prettier-ignore
                                { offset: 0x3e65d, bit: 5, label: "Gateway of Fools and Hope: Red Drop" }, // prettier-ignore
                                { offset: 0x3e65d, bit: 6, label: "Gateway of Fools and Hope: 500 gil" }, // prettier-ignore
                              ],
                            },
                          ],
                        },
                        {
                          name: "Chapter 2",
                          flex: true,
                          items: [
                            {
                              name: "World Map Chests",
                              type: "bitflags",
                              flags: [
                                { offset: 0x3dd55, bit: 2, label: "EX Charge" }, // prettier-ignore
                                { offset: 0x3dd55, bit: 3, label: "200 gil" }, // prettier-ignore
                                { offset: 0x3dd55, bit: 4, label: "BRV Charge" }, // prettier-ignore
                                { offset: 0x3dd55, bit: 5, label: "Cure" }, // prettier-ignore
                                { offset: 0x3dd55, bit: 6, label: "Leather Chest Plate" }, // prettier-ignore
                                { offset: 0x3dd55, bit: 7, label: "Green Drop" }, // prettier-ignore
                                { offset: 0x3dd56, bit: 0, label: "EX Charge" }, // prettier-ignore
                                { offset: 0x3dd5b, bit: 4, label: "Rosetta Stone" }, // prettier-ignore
                                { offset: 0x3dd5b, bit: 5, label: "Pink Tail" }, // prettier-ignore
                              ],
                            },
                            {
                              name: "Cleared Gateways",
                              type: "bitflags",
                              flags: [
                                { offset: 0x1d090, bit: 4, label: "Encounters and Treason", hidden: true }, // prettier-ignore
                                { offset: 0x1d229, bit: 5, label: "Encounters and Treason" }, // prettier-ignore
                                { offset: 0x1d090, bit: 6, label: "Gulg Gateway", hidden: true }, // prettier-ignore
                                { offset: 0x1d229, bit: 6, label: "Gulg Gateway" }, // prettier-ignore
                                { offset: 0x1d229, bit: 7, label: "Seasonless Gateway" }, // prettier-ignore
                                { offset: 0x1d22a, bit: 0, label: "Hidden Darkness Gateway" }, // prettier-ignore
                                { offset: 0x1d22a, bit: 1, label: "Snow of Sorrow" }, // prettier-ignore
                                { offset: 0x1d091, bit: 6, label: "???", hidden: true }, // prettier-ignore
                              ],
                            },
                            {
                              name: "Gateway Chests",
                              type: "bitflags",
                              flags: [
                                { offset: 0x3e65e, bit: 0, label: "Encounters and Treason: Orange Drop", separator: true }, // prettier-ignore
                                { offset: 0x3e65e, bit: 1, label: "Gulg Gateway: Ifrit AUTO" }, // prettier-ignore
                                { offset: 0x3e65e, bit: 2, label: "Gulg Gateway: Slasher", separator: true }, // prettier-ignore
                                { offset: 0x3e65e, bit: 4, label: "Seasonless Gateway: Soul of Destruction" }, // prettier-ignore
                                { offset: 0x3e65e, bit: 6, label: "Seasonless Gateway: Pink Tail", separator: true }, // prettier-ignore
                                { offset: 0x3e65f, bit: 0, label: "Hidden Darkness Gateway: Blue Drop" }, // prettier-ignore
                                { offset: 0x3e65f, bit: 2, label: "Hidden Darkness Gateway: 200 gil", separator: true }, // prettier-ignore
                                { offset: 0x3e65f, bit: 4, label: "Snow of Sorrow: Delicious Fish Scale" }, // prettier-ignore
                                { offset: 0x3e65f, bit: 6, label: "Snow of Sorrow: Iifa Leaf" }, // prettier-ignore
                              ],
                            },
                          ],
                        },
                        {
                          name: "Chapter 3",
                          flex: true,
                          items: [
                            {
                              name: "World Map Chests",
                              type: "bitflags",
                              flags: [
                                { offset: 0x3dd5f, bit: 1, label: "Pink Tail" }, // prettier-ignore
                                { offset: 0x3dd5f, bit: 2, label: "KP Gambler" }, // prettier-ignore
                                { offset: 0x3dd5f, bit: 3, label: "Assist Charge" }, // prettier-ignore
                                { offset: 0x3dd5f, bit: 4, label: "Rosetta Stone" }, // prettier-ignore
                                { offset: 0x3dd5f, bit: 5, label: "BRV Zero" }, // prettier-ignore
                                { offset: 0x3dd5f, bit: 6, label: "Pink Tail" }, // prettier-ignore
                                { offset: 0x3dd5f, bit: 7, label: "Soul of Unrivaled Valor" }, // prettier-ignore
                                { offset: 0x3dd60, bit: 0, label: "EX Charge" }, // prettier-ignore
                              ],
                            },
                            {
                              name: "Cleared Gateways",
                              type: "bitflags",
                              flags: [
                                { offset: 0x1d22a, bit: 2, label: "Omen of Destruction" }, // prettier-ignore
                                { offset: 0x1d22a, bit: 3, label: "Gateway to Decay" }, // prettier-ignore
                                { offset: 0x1d22a, bit: 4, label: "Southern Shrine Gateway" }, // prettier-ignore
                                { offset: 0x1d22a, bit: 5, label: "Great Forest Gateway" }, // prettier-ignore
                                { offset: 0x1d22a, bit: 6, label: "Gateway to the Shrine" }, // prettier-ignore
                              ],
                            },
                            {
                              name: "Gateway Chests",
                              type: "bitflags",
                              flags: [
                                { offset: 0x3e660, bit: 0, label: "Omen of Destruction: Tanegashima" }, // prettier-ignore
                                { offset: 0x3e660, bit: 1, label: "Omen of Destruction: Cross Chain", separator: true }, // prettier-ignore
                                { offset: 0x3e660, bit: 2, label: "Gateway to Decay: Power Armlet", separator: true }, // prettier-ignore
                                { offset: 0x3e660, bit: 4, label: "Southern Shrine Gateway: Carbuncle AUTO", separator: true }, // prettier-ignore
                                { offset: 0x3e660, bit: 5, label: "Great Forest Gateway: Soul of Valor" }, // prettier-ignore
                                { offset: 0x3e660, bit: 7, label: "Great Forest Gateway: Fish Scale", separator: true }, // prettier-ignore
                                { offset: 0x3e661, bit: 0, label: "Gateway to the Shrine: Gargoyle Pebble" }, // prettier-ignore
                              ],
                            },
                          ],
                        },
                        {
                          name: "Chapter 4",
                          flex: true,
                          items: [
                            {
                              name: "World Map Chests",
                              type: "bitflags",
                              flags: [
                                { offset: 0x3dd60, bit: 1, label: "EX Charge" }, // prettier-ignore
                                { offset: 0x3dd60, bit: 2, label: "Rosetta Stone" }, // prettier-ignore
                                { offset: 0x3dd60, bit: 3, label: "Oerba Beads" }, // prettier-ignore
                                { offset: 0x3dd60, bit: 4, label: "Cure" }, // prettier-ignore
                              ],
                            },
                            {
                              name: "Cleared Gateways",
                              type: "bitflags",
                              flags: [
                                { offset: 0x1d22a, bit: 7, label: "West Melmond Gateway" }, // prettier-ignore
                                { offset: 0x1d22b, bit: 0, label: "North Melmond Gateway" }, // prettier-ignore
                                { offset: 0x1d22b, bit: 1, label: "Southern Shrine Gateway" }, // prettier-ignore
                                { offset: 0x1d22b, bit: 2, label: "Gateway to the Shrine" }, // prettier-ignore
                              ],
                            },
                            {
                              name: "Gateway Chests",
                              type: "bitflags",
                              flags: [
                                { offset: 0x3e661, bit: 2, label: "West Melmond Gateway: Cotton Robes" }, // prettier-ignore
                                { offset: 0x3e661, bit: 4, label: "West Melmond Gateway: Hairband" }, // prettier-ignore
                                { offset: 0x3e661, bit: 6, label: "West Melmond Gateway: Guard Ring", separator: true }, // prettier-ignore
                                { offset: 0x3e661, bit: 7, label: "North Melmond Gateway: Ramuh AUTO" }, // prettier-ignore
                                { offset: 0x3e662, bit: 2, label: "North Melmond Gateway: Oak Staff", separator: true }, // prettier-ignore
                                { offset: 0x3e662, bit: 0, label: "Southern Shrine Gateway: Pink Tail" }, // prettier-ignore
                                { offset: 0x3e662, bit: 3, label: "Southern Shrine Gateway: Soul of Valor", separator: true }, // prettier-ignore
                                { offset: 0x3e662, bit: 5, label: "Gateway to the Shrine: Guard Stick" }, // prettier-ignore
                              ],
                            },
                          ],
                        },
                        {
                          name: "Chapter 5",
                          flex: true,
                          items: [
                            {
                              name: "World Map Chests",
                              type: "bitflags",
                              flags: [
                                { offset: 0x3dd50, bit: 7, label: "BRV Charge" }, // prettier-ignore
                                { offset: 0x3dd51, bit: 0, label: "1500 gil" }, // prettier-ignore
                              ],
                            },
                            {
                              name: "Cleared Gateways",
                              type: "bitflags",
                              flags: [
                                { offset: 0x1d22b, bit: 3, label: "Forsaken Kingdom" }, // prettier-ignore
                                { offset: 0x1d22b, bit: 4, label: "North Sanctuary Gateway" }, // prettier-ignore
                              ],
                            },
                            {
                              name: "Gateway Chests",
                              type: "bitflags",
                              flags: [
                                { offset: 0x3e662, bit: 7, label: "Forsaken Kingdom: Blazefire Saber" }, // prettier-ignore
                                { offset: 0x3e663, bit: 1, label: "Forsaken Kingdom: Mythril" }, // prettier-ignore
                                { offset: 0x3e663, bit: 3, label: "Forsaken Kingdom: Odin AUTO" }, // prettier-ignore
                                { offset: 0x3e663, bit: 4, label: "Forsaken Kingdom: 2000 gil", separator: true }, // prettier-ignore
                                { offset: 0x3e663, bit: 5, label: "North Sanctuary Gateway: Soul of Patience" }, // prettier-ignore
                                { offset: 0x3e663, bit: 7, label: "North Sanctuary Gateway: Zombie Rag" }, // prettier-ignore
                                { offset: 0x3e664, bit: 0, label: "North Sanctuary Gateway: Iifa Leaf" }, // prettier-ignore
                              ],
                            },
                          ],
                        },
                        {
                          name: "Chapter 6",
                          flex: true,
                          items: [
                            {
                              name: "World Map Chests",
                              type: "bitflags",
                              flags: [
                                { offset: 0x3dd56, bit: 1, label: "Maser Eye" }, // prettier-ignore
                                { offset: 0x3dd56, bit: 2, label: "500 gil" }, // prettier-ignore
                                { offset: 0x3dd56, bit: 3, label: "Assist Charge" }, // prettier-ignore
                                { offset: 0x3dd56, bit: 4, label: "Rosetta Stone" }, // prettier-ignore
                                { offset: 0x3dd56, bit: 5, label: "Jump" }, // prettier-ignore
                                { offset: 0x3dd56, bit: 6, label: "Pink Tail" }, // prettier-ignore
                                { offset: 0x3dd56, bit: 7, label: "KP Gambler" }, // prettier-ignore
                                { offset: 0x3dd57, bit: 0, label: "1000 gil" }, // prettier-ignore
                                { offset: 0x3dd5b, bit: 6, label: "BRV Charge" }, // prettier-ignore
                              ],
                            },
                            {
                              name: "Cleared Gateways",
                              type: "bitflags",
                              flags: [
                                { offset: 0x1d095, bit: 4, label: "Sunken Lake Gateway", hidden: true }, // prettier-ignore
                                { offset: 0x1d22b, bit: 5, label: "Sunken Lake Gateway" }, // prettier-ignore
                                { offset: 0x1d095, bit: 5, label: "Legendary Lake Gateway", hidden: true }, // prettier-ignore
                                { offset: 0x1d22b, bit: 6, label: "Legendary Lake Gateway" }, // prettier-ignore
                                { offset: 0x1d22b, bit: 7, label: "Gateway of True Intent" }, // prettier-ignore
                                { offset: 0x1d22c, bit: 0, label: "Ryukahn Gateway" }, // prettier-ignore
                                { offset: 0x1d22c, bit: 1, label: "Hidden Darkness Gateway" }, // prettier-ignore
                              ],
                            },
                            {
                              name: "Gateway Chests",
                              type: "bitflags",
                              flags: [
                                { offset: 0x3e664, bit: 2, label: "Sunken Lake Gateway: Pink Tail" }, // prettier-ignore
                                { offset: 0x3e664, bit: 4, label: "Sunken Lake Gateway: Javelin", separator: true }, // prettier-ignore
                                { offset: 0x3e664, bit: 5, label: "Legendary Lake Gateway: Shiva AUTO" }, // prettier-ignore
                                { offset: 0x3e665, bit: 2, label: "Legendary Lake Gateway: Black Dragon Spear", separator: true }, // prettier-ignore
                                { offset: 0x3e664, bit: 6, label: "Gateway of True Intent: 500 gil" }, // prettier-ignore
                                { offset: 0x3e665, bit: 0, label: "Gateway of True Intent: Pebble", separator: true }, // prettier-ignore
                                { offset: 0x3e665, bit: 4, label: "Ryukahn Gateway: Yellow Drop", separator: true }, // prettier-ignore
                                { offset: 0x3e665, bit: 6, label: "Hidden Darkness Gateway: Soul of Valor" }, // prettier-ignore
                                { offset: 0x3e666, bit: 0, label: "Hidden Darkness Gateway: 500 gil" }, // prettier-ignore
                              ],
                            },
                          ],
                        },
                        {
                          name: "Chapter 7",
                          flex: true,
                          items: [
                            {
                              name: "World Map Chests",
                              type: "bitflags",
                              flags: [
                                { offset: 0x3dd5b, bit: 7, label: "500 gil" }, // prettier-ignore
                                { offset: 0x3dd5c, bit: 0, label: "BRV Zero" }, // prettier-ignore
                                { offset: 0x3dd5c, bit: 1, label: "Pink Tail" }, // prettier-ignore
                                { offset: 0x3dd5c, bit: 2, label: "Rosetta Stone" }, // prettier-ignore
                                { offset: 0x3dd5c, bit: 3, label: "Pink Tail" }, // prettier-ignore
                                { offset: 0x3dd5c, bit: 4, label: "BRV Charge" }, // prettier-ignore
                              ],
                            },
                            {
                              name: "Cleared Gateways",
                              type: "bitflags",
                              flags: [
                                { offset: 0x1d22c, bit: 2, label: "Gateway of Melting Snows" }, // prettier-ignore
                                { offset: 0x1d22c, bit: 3, label: "Frozen Continent" }, // prettier-ignore
                                { offset: 0x1d22c, bit: 4, label: "Ryukahn Gateway" }, // prettier-ignore
                                { offset: 0x1d22c, bit: 5, label: "Solitude and Treachery" }, // prettier-ignore
                                { offset: 0x1d22c, bit: 6, label: "Snow of Sorrow" }, // prettier-ignore
                              ],
                            },
                            {
                              name: "Gateway Chests",
                              type: "bitflags",
                              flags: [
                                { offset: 0x3e666, bit: 2, label: "Gateway of Melting Snows: Magic Pot AUTO" }, // prettier-ignore
                                { offset: 0x3e666, bit: 5, label: "Gateway of Melting Snows: Pearl Necklace", separator: true }, // prettier-ignore
                                { offset: 0x3e666, bit: 3, label: "Frozen Continent: Metal Knuckles", separator: true }, // prettier-ignore
                                { offset: 0x3e666, bit: 6, label: "Ryukahn Gateway: White Drop", separator: true }, // prettier-ignore
                                { offset: 0x3e667, bit: 0, label: "Solitude and Treachery: 1000 gil", separator: true }, // prettier-ignore
                                { offset: 0x3e667, bit: 1, label: "???", hidden: true }, // prettier-ignore
                                { offset: 0x3e667, bit: 3, label: "Snow of Sorrow: Cyan Drop" }, // prettier-ignore
                                { offset: 0x3e667, bit: 6, label: "Snow of Sorrow: Wakizashi" }, // prettier-ignore
                              ],
                            },
                          ],
                        },
                        {
                          name: "Epilogue",
                          flex: true,
                          items: [
                            {
                              name: "World Map Chests",
                              type: "bitflags",
                              flags: [
                                { offset: 0x3dd64, bit: 4, label: "Mythril" }, // prettier-ignore
                                { offset: 0x3dd67, bit: 1, label: "Maser Eye" }, // prettier-ignore
                                { offset: 0x3dd67, bit: 2, label: "BRV Charge" }, // prettier-ignore
                                { offset: 0x3dd67, bit: 3, label: "500 gil" }, // prettier-ignore
                                { offset: 0x3dd67, bit: 4, label: "EX Charge" }, // prettier-ignore
                                { offset: 0x3dd67, bit: 5, label: "Pink Tail" }, // prettier-ignore
                              ],
                            },
                            {
                              name: "Cleared Gateways",
                              type: "bitflags",
                              flags: [
                                { offset: 0x1d098, bit: 0, label: "Conflicting Virtues", hidden: true }, // prettier-ignore
                                { offset: 0x1d22c, bit: 7, label: "Conflicting Virtues" }, // prettier-ignore
                                { offset: 0x1d098, bit: 1, label: "Inherited Memories", hidden: true }, // prettier-ignore
                                { offset: 0x1d22d, bit: 0, label: "Inherited Memories" }, // prettier-ignore
                                { offset: 0x1d22d, bit: 1, label: "Gateway of Artificial Life" }, // prettier-ignore
                                { offset: 0x1d22d, bit: 2, label: "To a Foreign World" }, // prettier-ignore
                                { offset: 0x1d22d, bit: 3, label: "Gateway of Lost Innocence" }, // prettier-ignore
                                { offset: 0x1d22d, bit: 4, label: "Recurring Tragedy" }, // prettier-ignore
                              ],
                            },
                            {
                              name: "Gateway Chests",
                              type: "bitflags",
                              flags: [
                                { offset: 0x3e668, bit: 0, label: "Conflicting Virtues: 500 gil", separator: true }, // prettier-ignore
                                { offset: 0x3e668, bit: 2, label: "Gateway of Artificial Life: 2000 gil", separator: true }, // prettier-ignore
                                { offset: 0x3e668, bit: 4, label: "To a Foreign World: 1000 gil", separator: true }, // prettier-ignore
                                { offset: 0x3e668, bit: 5, label: "Gateway of Lost Innocence: Chocobo Powder" }, // prettier-ignore
                                { offset: 0x3e669, bit: 0, label: "Gateway of Lost Innocence: 5000 gil", separator: true }, // prettier-ignore
                                { offset: 0x3e669, bit: 3, label: "Recurring Tragedy: Mage's Staff" }, // prettier-ignore
                                { offset: 0x3e669, bit: 6, label: "Recurring Tragedy: Soul of Destruction" }, // prettier-ignore
                                { offset: 0x3e669, bit: 7, label: "???", hidden: true }, // prettier-ignore
                              ],
                            },
                          ],
                        },
                      ],
                    },
                  ],
                },
                {
                  name: "013: Light to All",
                  items: [
                    {
                      type: "tabs",
                      vertical: true,
                      items: [
                        {
                          name: "General",
                          items: [
                            {
                              name: "Number of Powers",
                              offset: 0x3decd,
                              type: "variable",
                              dataType: "uint8",
                              max: 3,
                            },
                            {
                              name: "Completed Chapters",
                              type: "bitflags",
                              flags: [
                                { offset: 0x1d09a, bit: 2, label: "Prologue" }, // prettier-ignore
                                { offset: 0x1d09b, bit: 4, label: "Chapter 1" }, // prettier-ignore
                                { offset: 0x1d09c, bit: 6, label: "Chapter 2" }, // prettier-ignore
                                { offset: 0x1d09e, bit: 0, label: "Chapter 3" }, // prettier-ignore
                                { offset: 0x1d09f, bit: 2, label: "Chapter 4" }, // prettier-ignore
                                { offset: 0x1d0a0, bit: 4, label: "Chapter 5" }, // prettier-ignore
                                { offset: 0x1d0a1, bit: 6, label: "Chapter 6" }, // prettier-ignore
                                { offset: 0x1d0a3, bit: 0, label: "Chapter 7" }, // prettier-ignore
                                { offset: 0x1d0a4, bit: 2, label: "Chapter 8" }, // prettier-ignore
                                { offset: 0x1d0a5, bit: 4, label: "Chapter 9" }, // prettier-ignore
                                { offset: 0x1d0a6, bit: 6, label: "Chapter 10" }, // prettier-ignore
                                { offset: 0x1d0a8, bit: 0, label: "Chapters 1-10" }, // prettier-ignore
                                { offset: 0x1d0b2, bit: 0, label: "Epilogue" }, // prettier-ignore
                              ],
                            },
                          ],
                        },
                        {
                          name: "Prologue",
                          flex: true,
                          items: [
                            {
                              name: "World Map Chests",
                              type: "bitflags",
                              flags: [
                                { offset: 0x3dfd1, bit: 1, label: "500 gil" }, // prettier-ignore
                                { offset: 0x3dfd1, bit: 2, label: "EX Charge" }, // prettier-ignore
                              ],
                            },
                            {
                              name: "Cleared Gateways",
                              type: "bitflags",
                              flags: [
                                { offset: 0x1d22d, bit: 5, label: "Forsaken Kingdom" }, // prettier-ignore
                              ],
                            },
                            {
                              name: "Gateway Chests",
                              type: "bitflags",
                              flags: [
                                { offset: 0x3e66a, bit: 1, label: "Forsaken Kingdom: Purple Drop" }, // prettier-ignore
                              ],
                            },
                          ],
                        },
                        {
                          name: "Chapter 1",
                          flex: true,
                          items: [
                            {
                              name: "World Map Chests",
                              type: "bitflags",
                              flags: [
                                { offset: 0x3dfd2, bit: 4, label: "Rosetta Stone" }, // prettier-ignore
                                { offset: 0x3dfd2, bit: 5, label: "Assist Charge" }, // prettier-ignore
                                { offset: 0x3dfd2, bit: 6, label: "Pink Tail" }, // prettier-ignore
                                { offset: 0x3dfd2, bit: 7, label: "BRV Charge" }, // prettier-ignore
                                { offset: 0x3dfd3, bit: 0, label: "BRV Charge" }, // prettier-ignore
                                { offset: 0x3dfd3, bit: 1, label: "Fish Scale" }, // prettier-ignore
                                { offset: 0x3dfd9, bit: 0, label: "1000 gil" }, // prettier-ignore
                                { offset: 0x3dfd9, bit: 1, label: "Ex Charge" }, // prettier-ignore
                                { offset: 0x3dfd9, bit: 2, label: "Hardedge" }, // prettier-ignore
                              ],
                            },
                            {
                              name: "Cleared Gateways",
                              type: "bitflags",
                              flags: [
                                { offset: 0x1d233, bit: 0, label: "North Sanctuary Gateway" }, // prettier-ignore
                                { offset: 0x1d233, bit: 1, label: "Gateway of Good and Evil" }, // prettier-ignore
                                { offset: 0x1d233, bit: 2, label: "Beyond the Continent" }, // prettier-ignore
                                { offset: 0x1d233, bit: 3, label: "Dried River Gateway" }, // prettier-ignore
                                { offset: 0x1d233, bit: 4, label: "Gulg Gateway" }, // prettier-ignore
                                { offset: 0x1d233, bit: 5, label: "Pravoka Gateway" }, // prettier-ignore
                              ],
                            },
                            {
                              name: "Gateway Chests",
                              type: "bitflags",
                              flags: [
                                { offset: 0x3e674, bit: 5, label: "North Sanctuary Gateway: 500 gil" }, // prettier-ignore
                                { offset: 0x3e674, bit: 7, label: "North Sanctuary Gateway: Buster Sword" }, // prettier-ignore
                                { offset: 0x3e675, bit: 1, label: "North Sanctuary Gateway: Arcane Incense", separator: true }, // prettier-ignore
                                { offset: 0x3e675, bit: 3, label: "Gateway of Good and Evil: 500 gil", separator: true }, // prettier-ignore
                                { offset: 0x3e675, bit: 5, label: "Beyond the Continent: Destruction Incense" }, // prettier-ignore
                                { offset: 0x3e675, bit: 7, label: "Beyond the Continent: Shiny Metal", separator: true }, // prettier-ignore
                                { offset: 0x3e676, bit: 1, label: "Dried River Gateway: Mythril", separator: true }, // prettier-ignore
                                { offset: 0x3e676, bit: 2, label: "Gulg Gateway: KP Gambler", separator: true }, // prettier-ignore
                                { offset: 0x3e676, bit: 4, label: "Pravoka Gateway: 1997 gil" }, // prettier-ignore
                              ],
                            },
                          ],
                        },
                        {
                          name: "Chapter 2",
                          flex: true,
                          items: [
                            {
                              name: "World Map Chests",
                              type: "bitflags",
                              flags: [
                                { offset: 0x3dfe0, bit: 5, label: "1000 gil" }, // prettier-ignore
                                { offset: 0x3dfe0, bit: 6, label: "Rosetta Stone" }, // prettier-ignore
                                { offset: 0x3dfe0, bit: 7, label: "Assist Charge" }, // prettier-ignore
                                { offset: 0x3dfe1, bit: 0, label: "1000 gil" }, // prettier-ignore
                                { offset: 0x3dfe1, bit: 1, label: "Skeleton Fragment" }, // prettier-ignore
                                { offset: 0x3dfe1, bit: 2, label: "BRV Charge" }, // prettier-ignore
                                { offset: 0x3dfe1, bit: 3, label: "BRV Zero" }, // prettier-ignore
                                { offset: 0x3dfe1, bit: 4, label: "1000 gil" }, // prettier-ignore
                                { offset: 0x3dfe1, bit: 5, label: "1000 gil" }, // prettier-ignore
                                { offset: 0x3dfe1, bit: 6, label: "Cure" }, // prettier-ignore
                                { offset: 0x3dfe1, bit: 7, label: "KP Gambler" }, // prettier-ignore
                              ],
                            },
                            {
                              name: "Cleared Gateways",
                              type: "bitflags",
                              flags: [
                                { offset: 0x1d22f, bit: 3, label: "West Melmond Gateway" }, // prettier-ignore
                                { offset: 0x1d22f, bit: 4, label: "North Melmond Gateway" }, // prettier-ignore
                                { offset: 0x1d22f, bit: 5, label: "Gateway to Decay" }, // prettier-ignore
                                { offset: 0x1d22f, bit: 6, label: "Omen of Destruction" }, // prettier-ignore
                                { offset: 0x1d22f, bit: 7, label: "Seasonless Gateway" }, // prettier-ignore
                                { offset: 0x1d230, bit: 0, label: "Gateway to the Shrine" }, // prettier-ignore
                              ],
                            },
                            {
                              name: "Gateway Chests",
                              type: "bitflags",
                              flags: [
                                { offset: 0x3e66e, bit: 4, label: "West Melmond Gateway: 1990 gil" }, // prettier-ignore
                                { offset: 0x3e66e, bit: 6, label: "West Melmond Gateway: Iifa Leaf", separator: true }, // prettier-ignore
                                { offset: 0x3e66f, bit: 0, label: "North Melmond Gateway: Patience Incense", separator: true }, // prettier-ignore
                                { offset: 0x3e66f, bit: 2, label: "Gateway to Decay: Demon Wall AUTO", separator: true }, // prettier-ignore
                                { offset: 0x3e66f, bit: 3, label: "Omen of Destruction: 2000 gil", separator: true }, // prettier-ignore
                                { offset: 0x3e66f, bit: 5, label: "Seasonless Gateway: Ghost Rag", separator: true }, // prettier-ignore
                                { offset: 0x3e66f, bit: 7, label: "Gateway to the Shrine: Oerba Beads" }, // prettier-ignore
                              ],
                            },
                          ],
                        },
                        {
                          name: "Chapter 3",
                          flex: true,
                          items: [
                            {
                              name: "World Map Chests",
                              type: "bitflags",
                              flags: [
                                { offset: 0x3dfd8, bit: 4, label: "Pink Tail" }, // prettier-ignore
                                { offset: 0x3dfd8, bit: 5, label: "1000 gil" }, // prettier-ignore
                                { offset: 0x3dfd8, bit: 6, label: "Destructive Incense" }, // prettier-ignore
                                { offset: 0x3dfd8, bit: 7, label: "Floating Continent Gem" }, // prettier-ignore
                                { offset: 0x3dfdc, bit: 6, label: "BRV Zero" }, // prettier-ignore
                                { offset: 0x3dfdc, bit: 7, label: "Pink Tail" }, // prettier-ignore
                                { offset: 0x3dfdd, bit: 0, label: "500 gil" }, // prettier-ignore
                                { offset: 0x3dfdd, bit: 1, label: "Assist Charge" }, // prettier-ignore
                                { offset: 0x3dfdd, bit: 2, label: "Rosetta Stone" }, // prettier-ignore
                                { offset: 0x3dfdd, bit: 3, label: "Alraune Twig" }, // prettier-ignore
                                { offset: 0x3dfdd, bit: 4, label: "Cure" }, // prettier-ignore
                                { offset: 0x3dfdd, bit: 5, label: "1500 gil" }, // prettier-ignore
                                { offset: 0x3dfdd, bit: 6, label: "KP Gambler" }, // prettier-ignore
                              ],
                            },
                            {
                              name: "Cleared Gateways",
                              type: "bitflags",
                              flags: [
                                { offset: 0x1d232, bit: 0, label: "Snow of Sorrow" }, // prettier-ignore
                                { offset: 0x1d232, bit: 1, label: "Frozen Continent" }, // prettier-ignore
                                { offset: 0x1d232, bit: 2, label: "Gateway of Melting Snows" }, // prettier-ignore
                                { offset: 0x1d232, bit: 3, label: "Gateway of True Intent" }, // prettier-ignore
                                { offset: 0x1d232, bit: 4, label: "Crescent Lake Gateway" }, // prettier-ignore
                                { offset: 0x1d232, bit: 5, label: "Solitude and Treachery" }, // prettier-ignore
                                { offset: 0x1d232, bit: 7, label: "Ryukahn Gateway" }, // prettier-ignore
                              ],
                            },
                            {
                              name: "Gateway Chests",
                              type: "bitflags",
                              flags: [
                                { offset: 0x3e672, bit: 5, label: "Snow of Sorrow: 1994 gil" }, // prettier-ignore
                                { offset: 0x3e672, bit: 7, label: "Snow of Sorrow: Valor Insence", separator: true }, // prettier-ignore
                                { offset: 0x3e673, bit: 1, label: "Frozen Continent: Cyan Drop" }, // prettier-ignore
                                { offset: 0x3e673, bit: 3, label: "Frozen Continent: Ghost Rag", separator: true }, // prettier-ignore
                                { offset: 0x3e673, bit: 5, label: "Gateway of Melting Snows: Mythril", separator: true }, // prettier-ignore
                                { offset: 0x3e673, bit: 7, label: "Crescent Lake Gateway: 1000 gil", separator: true }, // prettier-ignore
                                { offset: 0x3e674, bit: 1, label: "Solitude and Treachery: White Drop", separator: true }, // prettier-ignore
                                { offset: 0x3e674, bit: 3, label: "Ryukahn Gateway: 3000 gil" }, // prettier-ignore
                              ],
                            },
                          ],
                        },
                        {
                          name: "Chapter 4",
                          flex: true,
                          items: [
                            {
                              name: "World Map Chests",
                              type: "bitflags",
                              flags: [
                                { offset: 0x3dfd1, bit: 7, label: "BRV Charge" }, // prettier-ignore
                                { offset: 0x3dfd2, bit: 0, label: "Myhtril" }, // prettier-ignore
                                { offset: 0x3dfd2, bit: 1, label: "EX Charge" }, // prettier-ignore
                                { offset: 0x3dfd2, bit: 2, label: "Dark Helm" }, // prettier-ignore
                                { offset: 0x3dfd2, bit: 3, label: "1991 gil" }, // prettier-ignore
                                { offset: 0x3dfd7, bit: 5, label: "Cure" }, // prettier-ignore
                                { offset: 0x3dfd7, bit: 6, label: "Pink Tail" }, // prettier-ignore
                                { offset: 0x3dfd7, bit: 7, label: "Rosetta Stone" }, // prettier-ignore
                                { offset: 0x3dfd8, bit: 0, label: "KP Gambler" }, // prettier-ignore
                                { offset: 0x3dfd8, bit: 1, label: "2000 gil" }, // prettier-ignore
                                { offset: 0x3dfd8, bit: 2, label: "Cure" }, // prettier-ignore
                                { offset: 0x3dfd8, bit: 3, label: "Bangaa Toth" }, // prettier-ignore
                              ],
                            },
                            {
                              name: "Cleared Gateways",
                              type: "bitflags",
                              flags: [
                                { offset: 0x1d230, bit: 2, label: "Gateway of the Damned" }, // prettier-ignore
                                { offset: 0x1d230, bit: 3, label: "Gateway to the Shore" }, // prettier-ignore
                                { offset: 0x1d230, bit: 4, label: "Gateway of Fools and Hope" }, // prettier-ignore
                                { offset: 0x1d230, bit: 5, label: "Sunken Lake Gateway" }, // prettier-ignore
                                { offset: 0x1d230, bit: 6, label: "Gulg Gateway" }, // prettier-ignore
                                { offset: 0x1d230, bit: 7, label: "End of Isolation Gateway" }, // prettier-ignore
                              ],
                            },
                            {
                              name: "Gateway Chests",
                              type: "bitflags",
                              flags: [
                                { offset: 0x3e670, bit: 1, label: "Gateway of the Damned: Dark Sword", separator: true }, // prettier-ignore
                                { offset: 0x3e670, bit: 3, label: "Gateway of Fools and Hope: Magus Sisters AUTO", separator: true }, // prettier-ignore
                                { offset: 0x3e670, bit: 4, label: "Sunken Lake Gateway: Dark Armor", separator: true }, // prettier-ignore
                                { offset: 0x3e670, bit: 6, label: "Gulg Gateway: Dark Shield", separator: true }, // prettier-ignore
                                { offset: 0x3e671, bit: 0, label: "End of Isolation Gateway: Shell Shield" }, // prettier-ignore
                              ],
                            },
                          ],
                        },
                        {
                          name: "Chapter 5",
                          flex: true,
                          items: [
                            {
                              name: "World Map Chests",
                              type: "bitflags",
                              flags: [
                                { offset: 0x3dfd3, bit: 2, label: "Rosetta Stone" }, // prettier-ignore
                                { offset: 0x3dfd3, bit: 3, label: "2000 gil" }, // prettier-ignore
                                { offset: 0x3dfd3, bit: 4, label: "Soundwave" }, // prettier-ignore
                                { offset: 0x3dfd3, bit: 5, label: "Patience Incense" }, // prettier-ignore
                                { offset: 0x3dfd3, bit: 6, label: "2001 gil" }, // prettier-ignore
                                { offset: 0x3dfda, bit: 0, label: "Mythril" }, // prettier-ignore
                                { offset: 0x3dfda, bit: 1, label: "2000 gil" }, // prettier-ignore
                                { offset: 0x3dfda, bit: 2, label: "Pink Tail" }, // prettier-ignore
                                { offset: 0x3dfda, bit: 3, label: "Maser Eye" }, // prettier-ignore
                                { offset: 0x3dfda, bit: 4, label: "KP Gambler" }, // prettier-ignore
                                { offset: 0x3dfda, bit: 5, label: "Pink Tail" }, // prettier-ignore
                                { offset: 0x3dfda, bit: 6, label: "Cure" }, // prettier-ignore
                              ],
                            },
                            {
                              name: "Cleared Gateways",
                              type: "bitflags",
                              flags: [
                                { offset: 0x1d235, bit: 4, label: "Gateway of the Damned" }, // prettier-ignore
                                { offset: 0x1d235, bit: 5, label: "Gateway of the Shore" }, // prettier-ignore
                                { offset: 0x1d235, bit: 6, label: "Sage's Path Gateway" }, // prettier-ignore
                                { offset: 0x1d235, bit: 7, label: "Legendary Lake Gateway" }, // prettier-ignore
                                { offset: 0x1d236, bit: 0, label: "Encounters and Treason" }, // prettier-ignore
                                { offset: 0x1d236, bit: 1, label: "Gulg Gateway" }, // prettier-ignore
                                { offset: 0x1d236, bit: 3, label: "Crescent Lake Gateway" }, // prettier-ignore
                                { offset: 0x1d236, bit: 4, label: "Hidden Darkness Gateway" }, // prettier-ignore
                              ],
                            },
                            {
                              name: "Gateway Chests",
                              type: "bitflags",
                              flags: [
                                { offset: 0x3e679, bit: 3, label: "Gateway of the Damned: Official Ball", separator: true }, // prettier-ignore
                                { offset: 0x3e679, bit: 5, label: "Sage's Path Gateway: Leviathan AUTO", separator: true }, // prettier-ignore
                                { offset: 0x3e679, bit: 6, label: "Legendary Lake Gateway: Chocobo Powder", separator: true }, // prettier-ignore
                                { offset: 0x3e67a, bit: 0, label: "Encounters and Treason: Healing Helm", separator: true }, // prettier-ignore
                                { offset: 0x3e67a, bit: 2, label: "Gulg Gateway: Black Flan Membrane", separator: true }, // prettier-ignore
                                { offset: 0x3e67a, bit: 4, label: "Crescent Lake Gateway: 1000 gil", separator: true }, // prettier-ignore
                                { offset: 0x3e67a, bit: 6, label: "Hidden Darkness Gateway: 1000 gil" }, // prettier-ignore
                                { offset: 0x3e67b, bit: 0, label: "Hidden Darkness Gateway: Gold" }, // prettier-ignore
                              ],
                            },
                          ],
                        },
                        {
                          name: "Chapter 6",
                          flex: true,
                          items: [
                            {
                              name: "World Map Chests",
                              type: "bitflags",
                              flags: [
                                { offset: 0x3dfd7, bit: 1, label: "1000 gil" }, // prettier-ignore
                                { offset: 0x3dfd7, bit: 2, label: "KP Gambler" }, // prettier-ignore
                                { offset: 0x3dfd7, bit: 3, label: "Rosetta Stone" }, // prettier-ignore
                                { offset: 0x3dfd7, bit: 4, label: "Cure" }, // prettier-ignore
                                { offset: 0x3dfe8, bit: 1, label: "BRV Charge" }, // prettier-ignore
                                { offset: 0x3dfe8, bit: 2, label: "Moogle Fur" }, // prettier-ignore
                                { offset: 0x3dfe8, bit: 3, label: "KP Gambler" }, // prettier-ignore
                                { offset: 0x3dfe8, bit: 4, label: "Arcane Incense" }, // prettier-ignore
                              ],
                            },
                            {
                              name: "Cleared Gateways",
                              type: "bitflags",
                              flags: [
                                { offset: 0x1d22e, bit: 5, label: "End of Isolation Gateway" }, // prettier-ignore
                                { offset: 0x1d22e, bit: 6, label: "Legendary Lake Gateway" }, // prettier-ignore
                                { offset: 0x1d22e, bit: 7, label: "Encounters and Treason" }, // prettier-ignore
                                { offset: 0x1d22f, bit: 0, label: "Gateway of the Great Will" }, // prettier-ignore
                                { offset: 0x1d22f, bit: 1, label: "The Gateway of Wails" }, // prettier-ignore
                                { offset: 0x1d22f, bit: 2, label: "Hidden Darkness Gateway" }, // prettier-ignore
                              ],
                            },
                            {
                              name: "Gateway Chests",
                              type: "bitflags",
                              flags: [
                                { offset: 0x3e66c, bit: 4, label: "End of Isolation Gateway: 2000 gil" }, // prettier-ignore
                                { offset: 0x3e66c, bit: 6, label: "End of Isolation Gateway: 2000 gil", separator: true }, // prettier-ignore
                                { offset: 0x3e66d, bit: 0, label: "Legendary Lake Gateway: Yaschas Massif Gravel", separator: true }, // prettier-ignore
                                { offset: 0x3e66d, bit: 2, label: "Encounters and Treason: 1988 gil", separator: true }, // prettier-ignore
                                { offset: 0x3e66d, bit: 4, label: "Gateway of the Great Will: Gold", separator: true }, // prettier-ignore
                                { offset: 0x3e66d, bit: 6, label: "The Gateway of Wails: Pink Tail" }, // prettier-ignore
                                { offset: 0x3e66e, bit: 0, label: "The Gateway of Wails: Pink Tail", separator: true }, // prettier-ignore
                                { offset: 0x3e66e, bit: 2, label: "Hidden Darkness Gateway: Full Metal Staff" }, // prettier-ignore
                              ],
                            },
                          ],
                        },
                        {
                          name: "Chapter 7",
                          flex: true,
                          items: [
                            {
                              name: "World Map Chests",
                              type: "bitflags",
                              flags: [
                                { offset: 0x3dfe2, bit: 5, label: "Rosetta Stone" }, // prettier-ignore
                                { offset: 0x3dfe2, bit: 6, label: "1999 gil" }, // prettier-ignore
                                { offset: 0x3dfe2, bit: 7, label: "KP Gambler" }, // prettier-ignore
                                { offset: 0x3dfe3, bit: 0, label: "Iifa Dew" }, // prettier-ignore
                                { offset: 0x3dfe3, bit: 1, label: "1000 gil" }, // prettier-ignore
                                { offset: 0x3dfe3, bit: 2, label: "Valor Resin" }, // prettier-ignore
                                { offset: 0x3dfe3, bit: 3, label: "Cure" }, // prettier-ignore
                                { offset: 0x3dfe3, bit: 4, label: "1000 gil" }, // prettier-ignore
                                { offset: 0x3dfe3, bit: 5, label: "1000 gil" }, // prettier-ignore
                                { offset: 0x3dfe3, bit: 6, label: "Shiny Metal" }, // prettier-ignore
                                { offset: 0x3dfe5, bit: 3, label: "2000 gil" }, // prettier-ignore
                                { offset: 0x3dfe5, bit: 4, label: "1000 gil" }, // prettier-ignore
                                { offset: 0x3dfe5, bit: 5, label: "1000 gil" }, // prettier-ignore
                                { offset: 0x3dfe5, bit: 6, label: "Arcane Incense" }, // prettier-ignore
                                { offset: 0x3dfe5, bit: 7, label: "Maser Eye" }, // prettier-ignore
                              ],
                            },
                            {
                              name: "Cleared Gateways",
                              type: "bitflags",
                              flags: [
                                { offset: 0x1d233, bit: 6, label: "Gateway to a Micro Desert" }, // prettier-ignore
                                { offset: 0x1d233, bit: 7, label: "Northern Mirage Gateway" }, // prettier-ignore
                                { offset: 0x1d234, bit: 0, label: "Eastern Mirage Gateway" }, // prettier-ignore
                                { offset: 0x1d234, bit: 1, label: "Forgotten Trail" }, // prettier-ignore
                                { offset: 0x1d234, bit: 2, label: "Southern Lufenia Gateway" }, // prettier-ignore
                                { offset: 0x1d234, bit: 3, label: "The Flowing Spring" }, // prettier-ignore
                                { offset: 0x1d234, bit: 4, label: "Northern Lufenia Gateway" }, // prettier-ignore
                              ],
                            },
                            {
                              name: "Gateway Chests",
                              type: "bitflags",
                              flags: [
                                { offset: 0x3e676, bit: 6, label: "Gateway to a Micro Desert: Valor Incense", separator: true }, // prettier-ignore
                                { offset: 0x3e677, bit: 0, label: "Northern Mirage Gateway: Alexander AUTO", separator: true }, // prettier-ignore
                                { offset: 0x3e677, bit: 1, label: "Forgotten Trail: Revolver", separator: true }, // prettier-ignore
                                { offset: 0x3e677, bit: 3, label: "The Flowing Spring: Delicious Fish Scale", separator: true }, // prettier-ignore
                                { offset: 0x3e677, bit: 5, label: "Northern Lufenia Gateway: Iifa Dew" }, // prettier-ignore
                              ],
                            },
                          ],
                        },
                        {
                          name: "Chapter 8",
                          flex: true,
                          items: [
                            {
                              name: "World Map Chests",
                              type: "bitflags",
                              flags: [
                                { offset: 0x3dfd9, bit: 3, label: "Cure" }, // prettier-ignore
                                { offset: 0x3dfd9, bit: 4, label: "Triton's Dagger" }, // prettier-ignore
                                { offset: 0x3dfd9, bit: 5, label: "Moogle Fur" }, // prettier-ignore
                                { offset: 0x3dfd9, bit: 6, label: "BRV Charge" }, // prettier-ignore
                                { offset: 0x3dfd9, bit: 7, label: "KP Switch" }, // prettier-ignore
                                { offset: 0x3dfe3, bit: 7, label: "1000 gil" }, // prettier-ignore
                                { offset: 0x3dfe6, bit: 0, label: "EX Charge" }, // prettier-ignore
                                { offset: 0x3dfe6, bit: 1, label: "Rosetta Stone" }, // prettier-ignore
                                { offset: 0x3dfe6, bit: 2, label: "KP Gambler" }, // prettier-ignore
                                { offset: 0x3dfe6, bit: 3, label: "Pink Tail" }, // prettier-ignore
                                { offset: 0x3dfe9, bit: 2, label: "Cure" }, // prettier-ignore
                                { offset: 0x3dfe9, bit: 3, label: "EX Charge" }, // prettier-ignore
                                { offset: 0x3dfe9, bit: 4, label: "3000 gil" }, // prettier-ignore
                              ],
                            },
                            {
                              name: "Cleared Gateways",
                              type: "bitflags",
                              flags: [
                                { offset: 0x1d234, bit: 5, label: "Gateway to a Micro Desert" }, // prettier-ignore
                                { offset: 0x1d234, bit: 6, label: "Gateway of Trials" }, // prettier-ignore
                                { offset: 0x1d234, bit: 7, label: "Southern Lufenia Gateway" }, // prettier-ignore
                                { offset: 0x1d235, bit: 0, label: "Gateway of the Great Will" }, // prettier-ignore
                                { offset: 0x1d235, bit: 1, label: "Inherited Memories" }, // prettier-ignore
                                { offset: 0x1d235, bit: 2, label: "Ryukahn Gateway" }, // prettier-ignore
                                { offset: 0x1d235, bit: 3, label: "Gateway of Sullen Eyes" }, // prettier-ignore
                              ],
                            },
                            {
                              name: "Gateway Chests",
                              type: "bitflags",
                              flags: [
                                { offset: 0x3e677, bit: 7, label: "Gateway to a Micro Desert: Destruction Resin" }, // prettier-ignore
                                { offset: 0x3e678, bit: 1, label: "Gateway to a Micro Desert: 1500 gil", separator: true }, // prettier-ignore
                                { offset: 0x3e678, bit: 3, label: "Gateway of Trials: 2000 gil", separator: true }, // prettier-ignore
                                { offset: 0x3e678, bit: 5, label: "Gateway of the Great Will: Black Flan Membrane", separator: true }, // prettier-ignore
                                { offset: 0x3e678, bit: 7, label: "Ryukahn Gateway: Chocobo Powder", separator: true }, // prettier-ignore
                                { offset: 0x3e679, bit: 1, label: "Gateway of Sullen Eyes: Gold" }, // prettier-ignore
                              ],
                            },
                          ],
                        },
                        {
                          name: "Chapter 9",
                          flex: true,
                          items: [
                            {
                              name: "World Map Chests",
                              type: "bitflags",
                              flags: [
                                { offset: 0x3dfdc, bit: 5, label: "3000 gil" }, // prettier-ignore
                                { offset: 0x3dfe8, bit: 5, label: "Blind" }, // prettier-ignore
                                { offset: 0x3dfe8, bit: 6, label: "Rafflesia Vine" }, // prettier-ignore
                                { offset: 0x3dfe8, bit: 7, label: "EX Charge" }, // prettier-ignore
                                { offset: 0x3dfe9, bit: 0, label: "Rosetta Stone" }, // prettier-ignore
                                { offset: 0x3dfe9, bit: 1, label: "Maser Eye" }, // prettier-ignore
                              ],
                            },
                            {
                              name: "Cleared Gateways",
                              type: "bitflags",
                              flags: [
                                { offset: 0x1d231, bit: 0, label: "Gateway of Infernos" }, // prettier-ignore
                                { offset: 0x1d231, bit: 1, label: "Confinement and Flight" }, // prettier-ignore
                                { offset: 0x1d231, bit: 2, label: "Inherited Memories" }, // prettier-ignore
                                { offset: 0x1d231, bit: 3, label: "Gateway of the Great Will" }, // prettier-ignore
                                { offset: 0x1d231, bit: 4, label: "Gateway of Artificial Life" }, // prettier-ignore
                                { offset: 0x1d231, bit: 5, label: "Gateway of Sullen Eyes" }, // prettier-ignore
                                { offset: 0x1d231, bit: 7, label: "Ryukahn Gateway" }, // prettier-ignore
                              ],
                            },
                            {
                              name: "Gateway Chests",
                              type: "bitflags",
                              flags: [
                                { offset: 0x3e671, bit: 2, label: "Confinement and Flight: Phoenix AUTO" }, // prettier-ignore
                                { offset: 0x3e671, bit: 3, label: "Confinement and Flight: 1992 gil" }, // prettier-ignore
                                { offset: 0x3e671, bit: 5, label: "Confinement and Flight: Blue Drop", separator: true }, // prettier-ignore
                                { offset: 0x3e671, bit: 7, label: "Gateway of Artificial Life: Mu Fur", separator: true }, // prettier-ignore
                                { offset: 0x3e672, bit: 1, label: "Gateway of Sullen Eyes: Gold", separator: true }, // prettier-ignore
                                { offset: 0x3e672, bit: 3, label: "Ryukahn Gateway: Oerba Beads" }, // prettier-ignore
                              ],
                            },
                          ],
                        },
                        {
                          name: "Chapter 10",
                          flex: true,
                          items: [
                            {
                              name: "World Map Chests",
                              type: "bitflags",
                              flags: [
                                { offset: 0x3dfd1, bit: 3, label: "2000 gil" }, // prettier-ignore
                                { offset: 0x3dfd1, bit: 4, label: "Maser Eye" }, // prettier-ignore
                                { offset: 0x3dfd1, bit: 5, label: "2000 gil" }, // prettier-ignore
                                { offset: 0x3dfd1, bit: 6, label: "Cure" }, // prettier-ignore
                                { offset: 0x3dfe4, bit: 5, label: "2000 gil" }, // prettier-ignore
                                { offset: 0x3dfe4, bit: 6, label: "KP Gambler" }, // prettier-ignore
                                { offset: 0x3dfe4, bit: 7, label: "Rosetta Stone" }, // prettier-ignore
                                { offset: 0x3dfe5, bit: 0, label: "Black Flan Membrane" }, // prettier-ignore
                                { offset: 0x3dfe5, bit: 1, label: "BRV Charge" }, // prettier-ignore
                                { offset: 0x3dfe5, bit: 2, label: "Gold" }, // prettier-ignore
                                { offset: 0x3dfe7, bit: 6, label: "Cure" }, // prettier-ignore
                                { offset: 0x3dfe7, bit: 7, label: "KP Gambler" }, // prettier-ignore
                                { offset: 0x3dfe8, bit: 0, label: "Delicious Fish Scale" }, // prettier-ignore
                              ],
                            },
                            {
                              name: "Cleared Gateways",
                              type: "bitflags",
                              flags: [
                                { offset: 0x1d22d, bit: 6, label: "Forsaken Kingdom" }, // prettier-ignore
                                { offset: 0x1d22d, bit: 7, label: "Gateway of the Damned" }, // prettier-ignore
                                { offset: 0x1d22e, bit: 0, label: "Southern Lufenia Gateway" }, // prettier-ignore
                                { offset: 0x1d22e, bit: 1, label: "Conquered Trials Gateway" }, // prettier-ignore
                                { offset: 0x1d22e, bit: 2, label: "Conflicting Virtues" }, // prettier-ignore
                                { offset: 0x1d22e, bit: 3, label: "Pervasive Sorrow" }, // prettier-ignore
                                { offset: 0x1d22e, bit: 4, label: "Gateway to a Micro Desert" }, // prettier-ignore
                              ],
                            },
                            {
                              name: "Gateway Chests",
                              type: "bitflags",
                              flags: [
                                { offset: 0x3e66a, bit: 3, label: "Forsaken Kingdom: Basilisk Pebble" }, // prettier-ignore
                                { offset: 0x3e66a, bit: 5, label: "Forsaken Kingdom: Green Drop", separator: true }, // prettier-ignore
                                { offset: 0x3e66a, bit: 7, label: "Gateway of the Damned: Bahamut AUTO", separator: true }, // prettier-ignore
                                { offset: 0x3e66b, bit: 0, label: "Southern Lufenia Gateway: Gold", separator: true }, // prettier-ignore
                                { offset: 0x3e66b, bit: 2, label: "Conquered Trials Gateway: Shell Armor", separator: true }, // prettier-ignore
                                { offset: 0x3e66b, bit: 4, label: "Conflicting Virtues: KP Bonus", separator: true }, // prettier-ignore
                                { offset: 0x3e66b, bit: 6, label: "Pervasive Sorrow: 3000 gil" }, // prettier-ignore
                                { offset: 0x3e66c, bit: 0, label: "Pervasive Sorrow: Iifa Dew", separator: true }, // prettier-ignore
                                { offset: 0x3e66c, bit: 2, label: "Gateway to a Micro Desert: 1987 gil" }, // prettier-ignore
                              ],
                            },
                          ],
                        },
                        {
                          name: "Epilogue",
                          flex: true,
                          items: [
                            {
                              name: "World Map Chests",
                              type: "bitflags",
                              flags: [
                                { offset: 0x3dfe9, bit: 5, label: "Gargoyle Pebble" }, // prettier-ignore
                                { offset: 0x3dfe9, bit: 6, label: "20000 gil" }, // prettier-ignore
                                { offset: 0x3dfe9, bit: 7, label: "BRV Charge" }, // prettier-ignore
                                { offset: 0x3dfea, bit: 0, label: "Maser Eye" }, // prettier-ignore
                                { offset: 0x3dfea, bit: 1, label: "Silver Lobo Claw" }, // prettier-ignore
                                { offset: 0x3dfea, bit: 2, label: "Treant Branch" }, // prettier-ignore
                                { offset: 0x3dfea, bit: 3, label: "EX Charge" }, // prettier-ignore
                                { offset: 0x3dfea, bit: 4, label: "Zu Feather" }, // prettier-ignore
                                { offset: 0x3dfea, bit: 5, label: "Assist Charge" }, // prettier-ignore
                                { offset: 0x3dfea, bit: 6, label: "Soundwave" }, // prettier-ignore
                                { offset: 0x3dfea, bit: 7, label: "Aged Turtle Shell" }, // prettier-ignore
                                { offset: 0x3dfeb, bit: 0, label: "BRV Zero" }, // prettier-ignore
                                { offset: 0x3dfeb, bit: 1, label: "Ancient Turtle Shell" }, // prettier-ignore
                                { offset: 0x3dfeb, bit: 2, label: "Narshe Ore" }, // prettier-ignore
                                { offset: 0x3dfeb, bit: 3, label: "Gulg Steel" }, // prettier-ignore
                                { offset: 0x3dfeb, bit: 4, label: "Skull Knight Shard" }, // prettier-ignore
                              ],
                            },
                            {
                              name: "Cleared Gateways",
                              type: "bitflags",
                              flags: [
                                { offset: 0x1d236, bit: 5, label: "???", hidden: true }, // prettier-ignore
                                { offset: 0x1d236, bit: 6, label: "To a Foreign World" }, // prettier-ignore
                                { offset: 0x1d0aa, bit: 4, label: "Gateway of Artificial Life", hidden: true }, // prettier-ignore
                                { offset: 0x1d236, bit: 7, label: "Gateway of Artificial Life" }, // prettier-ignore
                                { offset: 0x1d0ab, bit: 6, label: "Inherited Memories", hidden: true }, // prettier-ignore
                                { offset: 0x1d237, bit: 0, label: "Inherited Memories" }, // prettier-ignore
                                { offset: 0x1d0ad, bit: 0, label: "Confinement and Flight", hidden: true }, // prettier-ignore
                                { offset: 0x1d237, bit: 1, label: "Confinement and Flight" }, // prettier-ignore
                                { offset: 0x1d0ae, bit: 2, label: "Gateway of Infernos", hidden: true }, // prettier-ignore
                                { offset: 0x1d237, bit: 2, label: "Gateway of Infernos" }, // prettier-ignore
                                { offset: 0x1d0af, bit: 4, label: "Pervasive Sorrow", hidden: true }, // prettier-ignore
                                { offset: 0x1d237, bit: 3, label: "Pervasive Sorrow" }, // prettier-ignore
                                { offset: 0x1d0b0, bit: 6, label: "Solitary Salvation", hidden: true }, // prettier-ignore
                                { offset: 0x1d237, bit: 4, label: "Solitary Salvation" }, // prettier-ignore
                                { offset: 0x1d237, bit: 5, label: "Edge of Discord" }, // prettier-ignore
                                { offset: 0x1d0b1, bit: 1, label: "Recurring Tragedy", hidden: true }, // prettier-ignore
                                { offset: 0x1d237, bit: 6, label: "Recurring Tragedy" }, // prettier-ignore
                                { offset: 0x1d238, bit: 0, label: "Gateway of Lost Innocence" }, // prettier-ignore
                                { offset: 0x1d0b1, bit: 0, label: "The Gateway of Wails", hidden: true }, // prettier-ignore
                                { offset: 0x1d238, bit: 1, label: "The Gateway of Wails" }, // prettier-ignore
                                { offset: 0x1d0b1, bit: 2, label: "Gateway of Sullen Eyes", hidden: true }, // prettier-ignore
                                { offset: 0x1d238, bit: 3, label: "Gateway of Sullen Eyes" }, // prettier-ignore
                                { offset: 0x1d0b1, bit: 3, label: "???", hidden: true }, // prettier-ignore
                                { offset: 0x1d0b1, bit: 4, label: "???", hidden: true }, // prettier-ignore
                                { offset: 0x1d0b1, bit: 5, label: "???", hidden: true }, // prettier-ignore
                              ],
                            },
                            {
                              name: "Gateway Chests",
                              type: "bitflags",
                              flags: [
                                { offset: 0x3e67b, bit: 2, label: "To a Foreign World: 28000 gil", separator: true }, // prettier-ignore
                                { offset: 0x3e67b, bit: 4, label: "Gateway of Artificial Life: Lizardman Skin" }, // prettier-ignore
                                { offset: 0x3e67b, bit: 6, label: "Gateway of Artificial Life: 29000 gil", separator: true }, // prettier-ignore
                                { offset: 0x3e67c, bit: 0, label: "Inherited Memories: Scorpion", separator: true }, // prettier-ignore
                                { offset: 0x3e67c, bit: 2, label: "Confinement and Flight: Crystal" }, // prettier-ignore
                                { offset: 0x3e67c, bit: 4, label: "Confinement and Flight: 28000 gil", separator: true }, // prettier-ignore
                                { offset: 0x3e67c, bit: 6, label: "Gateway of Infernos: Sun Blade" }, // prettier-ignore
                                { offset: 0x3e67d, bit: 0, label: "Gateway of Infernos: 26000 gil", separator: true }, // prettier-ignore
                                { offset: 0x3e67d, bit: 2, label: "Pervasive Sorrow: Scarletite" }, // prettier-ignore
                                { offset: 0x3e67d, bit: 4, label: "Pervasive Sorrow: Corel Ore" }, // prettier-ignore
                                { offset: 0x3e67d, bit: 6, label: "Pervasive Sorrow: 29000 gil", separator: true }, // prettier-ignore
                                { offset: 0x3e67e, bit: 0, label: "Solitary Salvation: Fine Cloth" }, // prettier-ignore
                                { offset: 0x3e67e, bit: 2, label: "Solitary Salvation: Walse Fabric" }, // prettier-ignore
                                { offset: 0x3e67e, bit: 4, label: "Solitary Salvation: 27000 gil" }, // prettier-ignore
                                { offset: 0x3e67e, bit: 6, label: "Solitary Salvation: BRV Charge" }, // prettier-ignore
                                { offset: 0x3e67e, bit: 7, label: "Solitary Salvation: Soundwave" }, // prettier-ignore
                                { offset: 0x3e67f, bit: 0, label: "Solitary Salvation: Cross Chain", separator: true }, // prettier-ignore
                                { offset: 0x3e67f, bit: 1, label: "Edge of Discord: 31000 gil", separator: true }, // prettier-ignore
                                { offset: 0x3e67f, bit: 2, label: "Recurring Tragedy: Epitaph Stone", separator: true }, // prettier-ignore
                                { offset: 0x3e67f, bit: 4, label: "Gateway of Lost Innocence: Polished Ore", separator: true }, // prettier-ignore
                                { offset: 0x3e67f, bit: 6, label: "The Gateway of Wails: Wererat Claw", separator: true }, // prettier-ignore
                                { offset: 0x3e680, bit: 0, label: "Gateway of Sullen Eyes: Cockatrice Feather" }, // prettier-ignore
                              ],
                            },
                          ],
                        },
                      ],
                    },
                  ],
                },
                {
                  name: "000: Confessions of the Creator",
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
                                  name: "Character 1",
                                  offset: 0x3e140,
                                  type: "variable",
                                  dataType: "uint16",
                                  resource: "characters",
                                  autocomplete: true,
                                },
                                {
                                  name: "Character 2",
                                  offset: 0x3e142,
                                  type: "variable",
                                  dataType: "uint16",
                                  resource: "characters",
                                  autocomplete: true,
                                },
                                {
                                  name: "Character 3",
                                  offset: 0x3e144,
                                  type: "variable",
                                  dataType: "uint16",
                                  resource: "characters",
                                  autocomplete: true,
                                },
                                {
                                  name: "Character 4",
                                  offset: 0x3e146,
                                  type: "variable",
                                  dataType: "uint16",
                                  resource: "characters",
                                  autocomplete: true,
                                },
                                {
                                  name: "Character 5",
                                  offset: 0x3e148,
                                  type: "variable",
                                  dataType: "uint16",
                                  resource: "characters",
                                  autocomplete: true,
                                },
                              ],
                            },
                            {
                              type: "section",
                              flex: true,
                              hidden: true,
                              items: [
                                {
                                  name: "World Map ID",
                                  offset: 0x3e2f2,
                                  type: "variable",
                                  dataType: "uint16",
                                  hidden: true,
                                },
                                {
                                  name: "Position X",
                                  offset: 0x3e2f4,
                                  type: "variable",
                                  dataType: "float32",
                                  hidden: true,
                                },
                                {
                                  name: "Position Y",
                                  offset: 0x3e2f8,
                                  type: "variable",
                                  dataType: "float32",
                                  hidden: true,
                                },
                                {
                                  name: "Position Z",
                                  offset: 0x3e2fc,
                                  type: "variable",
                                  dataType: "float32",
                                  hidden: true,
                                },
                                {
                                  name: "Progression / Unlocked Zones?",
                                  offset: 0x3e14a,
                                  type: "variable",
                                  dataType: "uint16",
                                  hidden: true,
                                },
                              ],
                            },
                            {
                              name: "Number of Powers",
                              offset: 0x3e14d,
                              type: "variable",
                              dataType: "uint8",
                              max: 3,
                            },
                            {
                              name: "Powers",
                              type: "bitflags",
                              hidden: true,
                              flags: [
                                { offset: 0x3e1d3, bit: 1, label: "Cornelia Plains", separator: true }, // prettier-ignore
                                { offset: 0x3e1e0, bit: 3, label: "Ancient Volcano Ring - Gulg" }, // prettier-ignore
                                { offset: 0x3e1e0, bit: 4, label: "Ancient Volcano Ring - Gulg" }, // prettier-ignore
                                { offset: 0x3e1e0, bit: 5, label: "Ancient Volcano Ring - Gulg" }, // prettier-ignore
                                { offset: 0x3e1e2, bit: 1, label: "Ancient Volcano Ring - Gulg", separator: true }, // prettier-ignore
                                { offset: 0x3e20e, bit: 3, label: "Mirage Sandsea", separator: true }, // prettier-ignore
                                { offset: 0x3e21a, bit: 1, label: "Land of Discord" }, // prettier-ignore
                                { offset: 0x3e21a, bit: 2, label: "Land of Discord" }, // prettier-ignore
                              ],
                            },
                            {
                              type: "bitflags",
                              hidden: true,
                              flags: [
                                { offset: 0x3e14e, bit: 0, label: "Introduction seen" }, // prettier-ignore
                                { offset: 0x3e68d, bit: 3, label: "???", hidden: true }, // prettier-ignore
                                { offset: 0x3e153, bit: 3, label: "???", hidden: true }, // prettier-ignore
                                { offset: 0x3e17e, bit: 7, label: "???", hidden: true }, // prettier-ignore
                                { offset: 0x3e18c, bit: 4, label: "???", hidden: true }, // prettier-ignore
                                { offset: 0x3e18d, bit: 2, label: "???", hidden: true }, // prettier-ignore
                                { offset: 0x3e18e, bit: 5, label: "???", hidden: true }, // prettier-ignore
                                { offset: 0x3e198, bit: 7, label: "???", hidden: true }, // prettier-ignore
                                { offset: 0x3e199, bit: 0, label: "???", hidden: true }, // prettier-ignore
                                { offset: 0x3e19f, bit: 5, label: "???", hidden: true }, // prettier-ignore
                                { offset: 0x3e1a5, bit: 2, label: "???", hidden: true }, // prettier-ignore
                                { offset: 0x3e1ff, bit: 4, label: "???", hidden: true }, // prettier-ignore
                                { offset: 0x3e1ff, bit: 5, label: "???", hidden: true }, // prettier-ignore
                                { offset: 0x3e1ff, bit: 6, label: "???", hidden: true }, // prettier-ignore
                                { offset: 0x3e201, bit: 6, label: "???", hidden: true }, // prettier-ignore
                                { offset: 0x3e202, bit: 0, label: "???", hidden: true }, // prettier-ignore
                                { offset: 0x3e279, bit: 2, label: "Talk with the scared Moogle" }, // prettier-ignore
                                { offset: 0x3e27a, bit: 1, label: "Talk with the mured Moogle" }, // prettier-ignore
                                { offset: 0x3e27a, bit: 3, label: "Talk with the calm Moogle" }, // prettier-ignore
                              ],
                            },
                          ],
                        },
                        {
                          name: "Melmond Fens",
                          flex: true,
                          items: [
                            {
                              name: "Events",
                              type: "bitflags",
                              flags: [
                                { offset: 0x1d0b8, bit: 7, label: "Cutscene: Chasm in the Rotting Land" }, // prettier-ignore
                                { offset: 0x1d0b8, bit: 3, label: "Cutscene: Chasm in the Rotting Land", separator: true }, // prettier-ignore
                                { offset: 0x3e201, bit: 7, label: "Manikin beaten", separator: true }, // prettier-ignore
                                { offset: 0x3e202, bit: 1, label: "Boulder destroyed" }, // prettier-ignore
                                { offset: 0x3e202, bit: 2, label: "Boulder destroyed" }, // prettier-ignore
                                { offset: 0x3e202, bit: 3, label: "Boulder destroyed" }, // prettier-ignore
                                { offset: 0x3e202, bit: 4, label: "Boulder destroyed" }, // prettier-ignore
                                { offset: 0x3e202, bit: 5, label: "Boulder destroyed" }, // prettier-ignore
                              ],
                            },
                            {
                              name: "World Map Chests",
                              type: "bitflags",
                              flags: [
                                { offset: 0x3e25d, bit: 7, label: "KP Bonus" }, // prettier-ignore
                                { offset: 0x3e25e, bit: 0, label: "KP Bonus" }, // prettier-ignore
                                { offset: 0x3e25e, bit: 1, label: "Crystal" }, // prettier-ignore
                                { offset: 0x3e25e, bit: 2, label: "Crystal" }, // prettier-ignore
                                { offset: 0x3e25e, bit: 3, label: "Crystal" }, // prettier-ignore
                                { offset: 0x3e25e, bit: 4, label: "Crystal" }, // prettier-ignore
                                { offset: 0x3e25e, bit: 5, label: "Crystal" }, // prettier-ignore
                                { offset: 0x3e25e, bit: 6, label: "Diamond" }, // prettier-ignore
                                { offset: 0x3e25e, bit: 7, label: "Diamond" }, // prettier-ignore
                                { offset: 0x3e25f, bit: 0, label: "Crystal" }, // prettier-ignore
                              ],
                            },
                            {
                              name: "Cleared Gateways",
                              type: "bitflags",
                              flags: [
                                { offset: 0x1d0b3, bit: 2, label: "Chasm in the Rotting Land", hidden: true }, // prettier-ignore
                                { offset: 0x1d239, bit: 3, label: "Chasm in the Rotting Land", hidden: true }, // prettier-ignore
                                { offset: 0x3e18c, bit: 1, label: "Chasm in the Rotting Land" }, // prettier-ignore
                                { offset: 0x1d0b2, bit: 3, label: "Curses and Hopes of Yore", hidden: true }, // prettier-ignore
                                { offset: 0x1d239, bit: 4, label: "Curses and Hopes of Yore", hidden: true }, // prettier-ignore
                                { offset: 0x3e18e, bit: 4, label: "Curses and Hopes of Yore" }, // prettier-ignore
                              ],
                            },
                            {
                              name: "Gateway Chests",
                              type: "bitflags",
                              flags: [
                                { offset: 0x3e682, bit: 5, label: "Chasm in the Rotting Land: Destruction Resin" }, // prettier-ignore
                                { offset: 0x3e684, bit: 3, label: "Chasm in the Rotting Land: Iifa Leaf" }, // prettier-ignore
                                { offset: 0x3e685, bit: 1, label: "Chasm in the Rotting Land: Moogle", separator: true }, // prettier-ignore
                                { offset: 0x3e682, bit: 6, label: "Curses and Hopes of Yore: Valor Resin" }, // prettier-ignore
                                { offset: 0x3e683, bit: 0, label: "Curses and Hopes of Yore: Gold Angel" }, // prettier-ignore
                                { offset: 0x3e683, bit: 7, label: "Curses and Hopes of Yore: Iifa Dew" }, // prettier-ignore
                              ],
                            },
                          ],
                        },
                        {
                          name: "Elven Snowfields",
                          flex: true,
                          items: [
                            {
                              name: "Events",
                              type: "bitflags",
                              flags: [
                                { offset: 0x3e1f4, bit: 3, label: "Manikin beaten" }, // prettier-ignore
                                { offset: 0x3e1f4, bit: 4, label: "Manikin beaten" }, // prettier-ignore
                                { offset: 0x3e1f4, bit: 5, label: "Manikin beaten", separator: true }, // prettier-ignore
                                { offset: 0x3e1f4, bit: 6, label: "Boulder destroyed" }, // prettier-ignore
                                { offset: 0x3e1f4, bit: 7, label: "Boulder destroyed" }, // prettier-ignore
                                { offset: 0x3e1f5, bit: 0, label: "Boulder destroyed" }, // prettier-ignore
                              ],
                            },
                            {
                              name: "World Map Chests",
                              type: "bitflags",
                              flags: [
                                { offset: 0x3e1f4, bit: 1, label: "Crystal" }, // prettier-ignore
                                { offset: 0x3e1f4, bit: 2, label: "Crystal" }, // prettier-ignore
                                { offset: 0x3e25a, bit: 7, label: "KP Bonus" }, // prettier-ignore
                                { offset: 0x3e25b, bit: 0, label: "Diamond" }, // prettier-ignore
                                { offset: 0x3e25b, bit: 1, label: "KP Bonus" }, // prettier-ignore
                                { offset: 0x3e25b, bit: 2, label: "Gold Angel" }, // prettier-ignore
                                { offset: 0x3e25b, bit: 3, label: "Crystal" }, // prettier-ignore
                              ],
                            },
                            {
                              name: "Cleared Gateways",
                              type: "bitflags",
                              flags: [
                                { offset: 0x1d239, bit: 1, label: "Frozen Continent", hidden: true }, // prettier-ignore
                                { offset: 0x3e17e, bit: 1, label: "Frozen Continent", hidden: true }, // prettier-ignore
                                { offset: 0x3e17e, bit: 6, label: "Frozen Continent" }, // prettier-ignore
                                { offset: 0x1d0b2, bit: 2, label: "Land of the Stolen Crown", hidden: true }, // prettier-ignore
                                { offset: 0x1d239, bit: 5, label: "Land of the Stolen Crown", hidden: true }, // prettier-ignore
                                { offset: 0x3e17e, bit: 3, label: "Land of the Stolen Crown" }, // prettier-ignore
                                { offset: 0x1d239, bit: 2, label: "Gateway of Melting Snows", hidden: true }, // prettier-ignore
                                { offset: 0x3e17d, bit: 7, label: "Gateway of Melting Snows", hidden: true }, // prettier-ignore
                                { offset: 0x3e17e, bit: 5, label: "Gateway of Melting Snows" }, // prettier-ignore
                                { offset: 0x1d239, bit: 6, label: "Gateway of the Great Will" }, // prettier-ignore
                                { offset: 0x3e17e, bit: 4, label: "Gateway of the Great Will" }, // prettier-ignore
                              ],
                            },
                            {
                              name: "Gateway Chests",
                              type: "bitflags",
                              flags: [
                                { offset: 0x3e681, bit: 1, label: "Frozen Continent: Pink Tail", separator: true }, // prettier-ignore
                                { offset: 0x3e684, bit: 1, label: "Land of the Stolen Crown: Iifa Leaf", separator: true }, // prettier-ignore
                                { offset: 0x3e681, bit: 4, label: "Gateway of Melting Snows: Pink Tail", separator: true }, // prettier-ignore
                                { offset: 0x3e682, bit: 2, label: "Gateway of the Great Will: Pink Tail" }, // prettier-ignore
                              ],
                            },
                          ],
                        },
                        {
                          name: "Ancient Volcano Ring",
                          flex: true,
                          items: [
                            {
                              name: "Events",
                              type: "bitflags",
                              flags: [
                                { offset: 0x3e1e1, bit: 6, label: "Manikin beaten" }, // prettier-ignore
                                { offset: 0x3e1e1, bit: 7, label: "Manikin beaten" }, // prettier-ignore
                                { offset: 0x3e1e2, bit: 0, label: "Manikin beaten", separator: true }, // prettier-ignore
                                { offset: 0x3e1e2, bit: 2, label: "Boulder destroyed" }, // prettier-ignore
                                { offset: 0x3e1e2, bit: 3, label: "Boulder destroyed" }, // prettier-ignore
                              ],
                            },
                            {
                              name: "World Map Chests",
                              type: "bitflags",
                              flags: [
                                { offset: 0x3e253, bit: 7, label: "KP Bonus" }, // prettier-ignore
                                { offset: 0x3e254, bit: 0, label: "Gold Angel" }, // prettier-ignore
                                { offset: 0x3e254, bit: 1, label: "Gold Angel" }, // prettier-ignore
                                { offset: 0x3e254, bit: 2, label: "Diamond" }, // prettier-ignore
                                { offset: 0x3e254, bit: 3, label: "Crytal" }, // prettier-ignore
                                { offset: 0x3e254, bit: 4, label: "Diamond" }, // prettier-ignore
                                { offset: 0x3e254, bit: 5, label: "Crytal" }, // prettier-ignore
                              ],
                            },
                            {
                              name: "Cleared Gateways",
                              type: "bitflags",
                              flags: [
                                { offset: 0x1d239, bit: 0, label: "Encounters and Treason", hidden: true }, // prettier-ignore
                                { offset: 0x3e166, bit: 0, label: "Encounters and Treason" }, // prettier-ignore
                              ],
                            },
                            {
                              name: "Gateway Chests",
                              type: "bitflags",
                              flags: [
                                { offset: 0x3e681, bit: 7, label: "Encounters and Treason: Pink Tail" }, // prettier-ignore
                              ],
                            },
                          ],
                        },
                        {
                          name: "Cornelia Plains",
                          flex: true,
                          items: [
                            {
                              name: "Events",
                              type: "bitflags",
                              flags: [
                                { offset: 0x3e1d3, bit: 2, label: "Boulder destroyed" }, // prettier-ignore
                                { offset: 0x3e1d3, bit: 3, label: "Boulder destroyed" }, // prettier-ignore
                                { offset: 0x3e1d3, bit: 4, label: "Boulder destroyed" }, // prettier-ignore
                              ],
                            },
                            {
                              name: "World Map Chests",
                              type: "bitflags",
                              flags: [
                                { offset: 0x3e250, bit: 0, label: "Crystal" }, // prettier-ignore
                                { offset: 0x3e250, bit: 1, label: "Crystal" }, // prettier-ignore
                                { offset: 0x3e250, bit: 2, label: "Diamond" }, // prettier-ignore
                                { offset: 0x3e250, bit: 3, label: "Crystal" }, // prettier-ignore
                              ],
                            },
                            {
                              name: "Cleared Gateways",
                              type: "bitflags",
                              flags: [
                                { offset: 0x1d238, bit: 5, label: "Gateway to Departure", hidden: true }, // prettier-ignore
                                { offset: 0x3e152, bit: 5, label: "Gateway to Departure" }, // prettier-ignore
                                { offset: 0x1d238, bit: 6, label: "Gateway of Good and Evil", hidden: true }, // prettier-ignore
                                { offset: 0x3e152, bit: 6, label: "Gateway of Good and Evil" }, // prettier-ignore
                                { offset: 0x1d238, bit: 7, label: "Beyond the Continent", hidden: true }, // prettier-ignore
                                { offset: 0x3e153, bit: 0, label: "Beyond the Continent" }, // prettier-ignore
                                { offset: 0x1d0b4, bit: 4, label: "Southern Lufenia Gateway", hidden: true }, // prettier-ignore
                                { offset: 0x1d239, bit: 7, label: "Southern Lufenia Gateway", hidden: true }, // prettier-ignore
                                { offset: 0x3e150, bit: 5, label: "Southern Lufenia Gateway" }, // prettier-ignore
                              ],
                            },
                            {
                              name: "Gateway Chests",
                              type: "bitflags",
                              flags: [
                                { offset: 0x3e680, bit: 2, label: "Gateway to Departure: 30000 gil" }, // prettier-ignore
                                { offset: 0x3e680, bit: 4, label: "Gateway to Departure: Pink Tail", separator: true }, // prettier-ignore
                                { offset: 0x3e680, bit: 6, label: "Beyond the Continent: Pink Tail" }, // prettier-ignore
                              ],
                            },
                          ],
                        },
                        {
                          name: "Mirage Sandsea",
                          flex: true,
                          items: [
                            {
                              name: "Events",
                              type: "bitflags",
                              flags: [
                                { offset: 0x1d0b9, bit: 0, label: "Cutscene: Eastern Mirage Gateway", separator: true }, // prettier-ignore
                                { offset: 0x3e20d, bit: 7, label: "Manikin beaten" }, // prettier-ignore
                                { offset: 0x3e20e, bit: 0, label: "Manikin beaten" }, // prettier-ignore
                                { offset: 0x3e20e, bit: 1, label: "Manikin beaten" }, // prettier-ignore
                                { offset: 0x3e20e, bit: 2, label: "Manikin beaten", separator: true }, // prettier-ignore
                                { offset: 0x3e20e, bit: 4, label: "Boulder destroyed" }, // prettier-ignore
                                { offset: 0x3e20e, bit: 5, label: "Boulder destroyed" }, // prettier-ignore
                                { offset: 0x3e20e, bit: 6, label: "Boulder destroyed" }, // prettier-ignore
                              ],
                            },
                            {
                              name: "World Map Chests",
                              type: "bitflags",
                              flags: [
                                { offset: 0x3e262, bit: 0, label: "Gold Angel" }, // prettier-ignore
                                { offset: 0x3e262, bit: 1, label: "KP Bonus" }, // prettier-ignore
                                { offset: 0x3e262, bit: 2, label: "Diamond" }, // prettier-ignore
                                { offset: 0x3e262, bit: 3, label: "Elixir" }, // prettier-ignore
                                { offset: 0x3e262, bit: 4, label: "Diamond" }, // prettier-ignore,
                              ],
                            },
                            {
                              name: "Cleared Gateways",
                              type: "bitflags",
                              flags: [
                                { offset: 0x1d23a, bit: 0, label: "Forgotten Trail", hidden: true }, // prettier-ignore
                                { offset: 0x3e198, bit: 0, label: "Forgotten Trail" }, // prettier-ignore
                                { offset: 0x1d23a, bit: 1, label: "Eastern Mirage Gateway", hidden: true }, // prettier-ignore
                                { offset: 0x3e198, bit: 2, label: "Eastern Mirage Gateway" }, // prettier-ignore
                                { offset: 0x1d0b4, bit: 6, label: "Dreams of a Flying Castle", hidden: true }, // prettier-ignore
                                { offset: 0x1d23a, bit: 2, label: "Dreams of a Flying Castle", hidden: true }, // prettier-ignore
                                { offset: 0x3e198, bit: 3, label: "Dreams of a Flying Castle" }, // prettier-ignore
                                { offset: 0x1d0b4, bit: 7, label: "The Forsaken Lands", hidden: true }, // prettier-ignore
                                { offset: 0x1d23b, bit: 2, label: "The Forsaken Lands", hidden: true }, // prettier-ignore
                                { offset: 0x3e198, bit: 4, label: "The Forsaken Lands" }, // prettier-ignore
                              ],
                            },
                            {
                              name: "Gateway Chests",
                              type: "bitflags",
                              flags: [
                                { offset: 0x3e68c, bit: 4, label: "Forgotten Trail: 30000 gil", separator: true }, // prettier-ignore
                                { offset: 0x3e68d, bit: 5, label: "The Forsaken Lands: 30000 gil" }, // prettier-ignore
                                { offset: 0x3e68e, bit: 1, label: "The Forsaken Lands: Diamond Ring" }, // prettier-ignore
                                { offset: 0x3e68e, bit: 7, label: "The Forsaken Lands: Titan's Tear" }, // prettier-ignore
                              ],
                            },
                          ],
                        },
                        {
                          name: "Bahamut Isles",
                          flex: true,
                          items: [
                            {
                              name: "Events",
                              type: "bitflags",
                              flags: [
                                { offset: 0x3e214, bit: 1, label: "Manikin beaten" }, // prettier-ignore
                                { offset: 0x3e214, bit: 2, label: "Manikin beaten", separator: true }, // prettier-ignore
                                { offset: 0x3e214, bit: 3, label: "Boulder destroyed" }, // prettier-ignore
                                { offset: 0x3e214, bit: 4, label: "Boulder destroyed" }, // prettier-ignore
                                { offset: 0x3e214, bit: 5, label: "Boulder destroyed" }, // prettier-ignore
                              ],
                            },
                            {
                              name: "World Map Chests",
                              type: "bitflags",
                              flags: [
                                { offset: 0x3e264, bit: 0, label: "KP Bonus" }, // prettier-ignore
                                { offset: 0x3e264, bit: 1, label: "Gold Angel" }, // prettier-ignore
                                { offset: 0x3e264, bit: 2, label: "Elixir" }, // prettier-ignore
                                { offset: 0x3e264, bit: 3, label: "Diamond" }, // prettier-ignore
                              ],
                            },
                            {
                              name: "Cleared Gateways",
                              type: "bitflags",
                              flags: [
                                { offset: 0x1d0b5, bit: 6, label: "Conquered Trials Gateway", hidden: true }, // prettier-ignore
                                { offset: 0x1d23a, bit: 3, label: "Conquered Trials Gateway", hidden: true }, // prettier-ignore
                                { offset: 0x3e19e, bit: 2, label: "Conquered Trials Gateway" }, // prettier-ignore
                                { offset: 0x1d0b6, bit: 0, label: "The Dragon King's Gateway", hidden: true }, // prettier-ignore
                                { offset: 0x1d23b, bit: 3, label: "The Dragon King's Gateway", hidden: true }, // prettier-ignore
                                { offset: 0x3e19f, bit: 4, label: "The Dragon King's Gateway" }, // prettier-ignore
                                { offset: 0x1d0b6, bit: 1, label: "???", hidden: true }, // prettier-ignore
                              ],
                            },
                            {
                              name: "Gateway Chests",
                              type: "bitflags",
                              flags: [
                                { offset: 0x3e68c, bit: 7, label: "Conquered Trials Gateway: 30000 gil", separator: true }, // prettier-ignore
                                { offset: 0x3e692, bit: 3, label: "The Dragon King's Gateway: ???", hidden: true }, // prettier-ignore
                                { offset: 0x3e692, bit: 5, label: "The Dragon King's Gateway: Diamond Ring" }, // prettier-ignore
                                { offset: 0x3e692, bit: 7, label: "The Dragon King's Gateway: Valor Resin" }, // prettier-ignore
                                { offset: 0x3e693, bit: 1, label: "The Dragon King's Gateway: Friendship Resin" }, // prettier-ignore
                              ],
                            },
                          ],
                        },
                        {
                          name: "Land of Discord",
                          flex: true,
                          items: [
                            {
                              name: "Events",
                              type: "bitflags",
                              flags: [
                                { offset: 0x1d0b8, bit: 2, label: "Cutscene: Edge of Discord", separator: true }, // prettier-ignore
                                { offset: 0x3e21a, bit: 3, label: "Manikin beaten" }, // prettier-ignore
                                { offset: 0x3e21a, bit: 4, label: "Manikin beaten", separator: true }, // prettier-ignore
                                { offset: 0x3e21a, bit: 5, label: "Boulder destroyed" }, // prettier-ignore
                                { offset: 0x3e21a, bit: 6, label: "Boulder destroyed" }, // prettier-ignore
                              ],
                            },
                            {
                              name: "World Map Chests",
                              type: "bitflags",
                              flags: [
                                { offset: 0x3e266, bit: 4, label: "KP Bonus" }, // prettier-ignore
                                { offset: 0x3e266, bit: 5, label: "Gold Angel" }, // prettier-ignore
                                { offset: 0x3e266, bit: 6, label: "Elixir" }, // prettier-ignore
                                { offset: 0x3e266, bit: 7, label: "Elixir" }, // prettier-ignore
                                { offset: 0x3e267, bit: 0, label: "Elixir" }, // prettier-ignore
                              ],
                            },
                            {
                              name: "Cleared Gateways",
                              type: "bitflags",
                              flags: [
                                { offset: 0x1d23a, bit: 7, label: "Inherited Memories", hidden: true }, // prettier-ignore
                                { offset: 0x3e1a5, bit: 3, label: "Inherited Memories" }, // prettier-ignore
                                { offset: 0x1d23b, bit: 0, label: "Gateway of Artificial Life", hidden: true }, // prettier-ignore
                                { offset: 0x3e1a5, bit: 5, label: "Gateway of Artificial Life" }, // prettier-ignore
                                { offset: 0x1d23b, bit: 1, label: "To a Foreign World", hidden: true }, // prettier-ignore
                                { offset: 0x3e1a6, bit: 1, label: "To a Foreign World" }, // prettier-ignore
                                { offset: 0x1d0b7, bit: 0, label: "Confinement and Flight", hidden: true }, // prettier-ignore
                                { offset: 0x1d23a, bit: 4, label: "Confinement and Flight", hidden: true }, // prettier-ignore
                                { offset: 0x3e1a5, bit: 0, label: "Confinement and Flight" }, // prettier-ignore
                                { offset: 0x1d23a, bit: 5, label: "Pervasive Sorrow", hidden: true }, // prettier-ignore
                                { offset: 0x3e1a6, bit: 3, label: "Pervasive Sorrow" }, // prettier-ignore
                                { offset: 0x1d23a, bit: 6, label: "Solitary Salvation", hidden: true }, // prettier-ignore
                                { offset: 0x3e1a6, bit: 4, label: "Solitary Salvation" }, // prettier-ignore
                                { offset: 0x1d23b, bit: 4, label: "Edge of Discord", hidden: true }, // prettier-ignore
                                { offset: 0x3e1a6, bit: 5, label: "Edge of Discord" }, // prettier-ignore
                              ],
                            },
                            {
                              name: "Gateway Chests",
                              type: "bitflags",
                              flags: [
                                { offset: 0x3e691, bit: 4, label: "Inherited Memories: Iifa Dew" }, // prettier-ignore
                                { offset: 0x3e691, bit: 6, label: "Inherited Memories: Friendship Resin", separator: true }, // prettier-ignore
                                { offset: 0x3e692, bit: 1, label: "To a Foreign World: Gold Angel", separator: true }, // prettier-ignore
                                { offset: 0x3e691, bit: 2, label: "Confinement and Flight: 30000 gil", separator: true }, // prettier-ignore
                                { offset: 0x3e697, bit: 3, label: "Solitary Salvation: Iifa Dew", separator: true }, // prettier-ignore
                                { offset: 0x3e697, bit: 6, label: "Edge of Discord: Gold Angel" }, // prettier-ignore
                                { offset: 0x3e698, bit: 0, label: "Edge of Discord: Valor Resin" }, // prettier-ignore
                                { offset: 0x3e698, bit: 2, label: "Edge of Discord: Friendship Resin" }, // prettier-ignore
                                { offset: 0x3e698, bit: 6, label: "Edge of Discord: Talons of Despair" }, // prettier-ignore
                                { offset: 0x3e698, bit: 7, label: "Edge of Discord: Aegis of Strife" }, // prettier-ignore
                                { offset: 0x3e699, bit: 0, label: "Edge of Discord: Calamitous Rage" }, // prettier-ignore
                                { offset: 0x3e699, bit: 1, label: "Edge of Discord: Deafening Fissure" }, // prettier-ignore
                              ],
                            },
                          ],
                        },
                      ],
                    },
                  ],
                },
                {
                  name: "Reports",
                  flex: true,
                  items: [
                    {
                      name: "Unlocked",
                      type: "bitflags",
                      flags: [
                        { offset: 0x1d0c3, bit: 5, label: "01 Inherited Memories -01-" }, // prettier-ignore
                        { offset: 0x1d0c3, bit: 6, label: "02 Inherited Memories -02-" }, // prettier-ignore
                        { offset: 0x1d0c3, bit: 7, label: "03 Inherited Memories -03-" }, // prettier-ignore
                        { offset: 0x1d0c4, bit: 0, label: "04 Inherited Memories -04-" }, // prettier-ignore
                        { offset: 0x1d0c4, bit: 1, label: "05 Inherited Memories -05-" }, // prettier-ignore
                        { offset: 0x1d0c4, bit: 2, label: "06 Inherited Memories -06-" }, // prettier-ignore
                        { offset: 0x1d0c4, bit: 3, label: "07 Inherited Memories -07-" }, // prettier-ignore
                        { offset: 0x1d0c4, bit: 4, label: "08 Exploration Report" }, // prettier-ignore
                        { offset: 0x1d0c4, bit: 5, label: "09 From a Researcher's Notes -01-" }, // prettier-ignore
                        { offset: 0x1d0c4, bit: 6, label: "10 From a Researcher's Notes -02-" }, // prettier-ignore
                        { offset: 0x1d0c4, bit: 7, label: "11 From a Researcher's Notes -03-" }, // prettier-ignore
                        { offset: 0x1d0c5, bit: 0, label: "12 One Man's Monologue" }, // prettier-ignore
                        { offset: 0x1d0c5, bit: 1, label: "13 Fragments of the Dragon's Worlds" }, // prettier-ignore
                        { offset: 0x1d0c5, bit: 2, label: "14 Record of Experiments -01-" }, // prettier-ignore
                        { offset: 0x1d0c5, bit: 3, label: "15 Record of Experiments -02-" }, // prettier-ignore
                        { offset: 0x1d0c5, bit: 4, label: "16 Record of Experiments -03-" }, // prettier-ignore
                        { offset: 0x1d0c5, bit: 5, label: "17 Dissidia -01-" }, // prettier-ignore
                        { offset: 0x1d0c5, bit: 6, label: "18 Dissidia -02-" }, // prettier-ignore
                        { offset: 0x1d0c5, bit: 7, label: "19 Dissidia -03-" }, // prettier-ignore
                        { offset: 0x1d0c6, bit: 0, label: "20 Dissidia -04-" }, // prettier-ignore
                      ],
                    },
                    {
                      name: "Cleared Stories",
                      type: "bitflags",
                      flags: [
                        { offset: 0x1d0be, bit: 5, label: "Report 01 - 2/4" }, // prettier-ignore
                        { offset: 0x1d0bf, bit: 1, label: "Report 01 - 3/4" }, // prettier-ignore
                        { offset: 0x1d0bf, bit: 2, label: "Report 01 - 4/4", separator: true }, // prettier-ignore
                        { offset: 0x1d0bc, bit: 1, label: "Report 02 - 3/4", separator: true }, // prettier-ignore
                        { offset: 0x1d0bc, bit: 2, label: "Report 03 - 5/5", separator: true }, // prettier-ignore
                        { offset: 0x1d0bc, bit: 4, label: "Report 04 - 2/4" }, // prettier-ignore
                        { offset: 0x1d0bc, bit: 7, label: "Report 04 - 4/4", separator: true }, // prettier-ignore
                        { offset: 0x1d0be, bit: 6, label: "Report 05 - 2/5" }, // prettier-ignore
                        { offset: 0x1d0be, bit: 7, label: "Report 05 - 3/5", separator: true }, // prettier-ignore
                        { offset: 0x1d0bc, bit: 5, label: "Report 06 - 3/3", separator: true }, // prettier-ignore
                        { offset: 0x1d0bf, bit: 0, label: "Report 07 - 5/6" }, // prettier-ignore
                        { offset: 0x1d0bc, bit: 6, label: "Report 07 - 6/6", separator: true }, // prettier-ignore
                        { offset: 0x1d0be, bit: 3, label: "Report 08 - 2/6" }, // prettier-ignore
                        { offset: 0x1d0be, bit: 2, label: "Report 08 - 3/6" }, // prettier-ignore
                        { offset: 0x1d0be, bit: 4, label: "Report 08 - 6/6", separator: true }, // prettier-ignore
                        { offset: 0x1d0bd, bit: 1, label: "Report 09 - 3/5" }, // prettier-ignore
                        { offset: 0x1d0bd, bit: 0, label: "Report 09 - 5/5", separator: true }, // prettier-ignore
                        { offset: 0x1d0bd, bit: 7, label: "Report 10 - 3/4" }, // prettier-ignore
                      ],
                    },
                    {
                      name: "Cleared Stories",
                      type: "bitflags",
                      flags: [
                        { offset: 0x1d0bd, bit: 2, label: "Report 11 - 3/5" }, // prettier-ignore
                        { offset: 0x1d0c0, bit: 0, label: "Report 11 - 3/5" }, // prettier-ignore
                        { offset: 0x1d0bd, bit: 3, label: "Report 11 - 5/5", separator: true }, // prettier-ignore
                        { offset: 0x1d0be, bit: 0, label: "Report 12 - 6/6", separator: true }, // prettier-ignore
                        { offset: 0x1d0bd, bit: 4, label: "Report 13 - 2/3", separator: true }, // prettier-ignore
                        { offset: 0x1d0bd, bit: 5, label: "Report 14 - 3/4", separator: true }, // prettier-ignore
                        { offset: 0x1d0bd, bit: 6, label: "Report 15 - 3/4", separator: true }, // prettier-ignore
                        { offset: 0x1d0bf, bit: 7, label: "Report 16 - 2/4" }, // prettier-ignore
                        { offset: 0x1d0be, bit: 1, label: "Report 16 - 3/4", separator: true }, // prettier-ignore
                        { offset: 0x1d0bf, bit: 4, label: "Report 17 - 3/3", separator: true }, // prettier-ignore
                        { offset: 0x1d0bf, bit: 3, label: "Report 18 - 3/4", separator: true }, // prettier-ignore
                        { offset: 0x1d0bf, bit: 5, label: "Report 19 - 2/3", separator: true }, // prettier-ignore
                        { offset: 0x1d0bf, bit: 6, label: "Report 20 - 3/4" }, // prettier-ignore
                      ],
                    },
                  ],
                },
              ],
            },
          ],
        },
        {
          name: "Accomplishments",
          items: [
            {
              length: 0x2,
              type: "container",
              instanceType: "tabs",
              instances: 100,
              resource: "accomplishments",
              vertical: true,
              items: [
                {
                  type: "bitflags",
                  flags: [
                    { offset: 0x12429, bit: 0, label: "New", hidden: true }, // prettier-ignore
                    { offset: 0x12429, bit: 1, label: "Conditions revealed" }, // prettier-ignore
                    { offset: 0x12429, bit: 2, label: "Reward revealed" }, // prettier-ignore
                    { offset: 0x12429, bit: 3, label: "Complete" }, // prettier-ignore
                    { offset: 0x12429, bit: 4, label: "???", hidden: true }, // prettier-ignore
                    { offset: 0x12429, bit: 5, label: "???", hidden: true }, // prettier-ignore
                    { offset: 0x12429, bit: 6, label: "???", hidden: true }, // prettier-ignore
                    { offset: 0x12429, bit: 7, label: "???", hidden: true }, // prettier-ignore
                  ],
                },
              ],
            },
          ],
        },
        {
          name: "Museum",
          items: [
            {
              type: "tabs",
              items: [
                {
                  name: "Player Icons",
                  flex: true,
                  items: [
                    {
                      type: "bitflags",
                      flags: [
                        { offset: 0x1d080, bit: 1, label: "001 Warrior" }, // prettier-ignore
                        { offset: 0x1d080, bit: 1, label: "002 Thief" }, // prettier-ignore
                        { offset: 0x1d080, bit: 1, label: "003 Monk" }, // prettier-ignore
                        { offset: 0x1d080, bit: 1, label: "004 Red Mage" }, // prettier-ignore
                        { offset: 0x1d080, bit: 1, label: "005 White Mage" }, // prettier-ignore
                        { offset: 0x1d080, bit: 1, label: "006 Black Mage" }, // prettier-ignore
                        { offset: 0x1d106, bit: 4, label: "007 Knight" }, // prettier-ignore
                        { offset: 0x1d106, bit: 4, label: "008 Ninja" }, // prettier-ignore
                        { offset: 0x1d106, bit: 4, label: "009 Master" }, // prettier-ignore
                        { offset: 0x1d106, bit: 4, label: "010 Red Wizard" }, // prettier-ignore
                        { offset: 0x1d106, bit: 5, label: "011 White Wizard" }, // prettier-ignore
                        { offset: 0x1d106, bit: 5, label: "012 Black Wizard" }, // prettier-ignore
                        { offset: 0x1d110, bit: 3, label: "013 Matoya" }, // prettier-ignore
                        { offset: 0x1d106, bit: 5, label: "014 Goblin" }, // prettier-ignore
                        { offset: 0x1d106, bit: 5, label: "015 Sahagin" }, // prettier-ignore
                        { offset: 0x1d10d, bit: 1, label: "016 Astos" }, // prettier-ignore
                        { offset: 0x1d106, bit: 6, label: "017 Ochu" }, // prettier-ignore
                        { offset: 0x1d106, bit: 6, label: "018 Mindflayer" }, // prettier-ignore
                        { offset: 0x1d106, bit: 6, label: "019 Evil Eye" }, // prettier-ignore
                        { offset: 0x1d11e, bit: 7, label: "020 Death Machine" }, // prettier-ignore
                        { offset: 0x1d106, bit: 6, label: "021 Garland" }, // prettier-ignore
                        { offset: 0x1d106, bit: 7, label: "022 Lich" }, // prettier-ignore
                        { offset: 0x1d106, bit: 7, label: "023 Marilith" }, // prettier-ignore
                        { offset: 0x1d106, bit: 7, label: "024 Kraken" }, // prettier-ignore
                        { offset: 0x1d106, bit: 7, label: "025 Tiamat" }, // prettier-ignore
                        { offset: 0x1d110, bit: 2, label: "026 Chaos" }, // prettier-ignore
                        { offset: 0x1d080, bit: 1, label: "027 Firion / Battle" }, // prettier-ignore
                        { offset: 0x1d080, bit: 1, label: "028 Maria / Battle" }, // prettier-ignore
                        { offset: 0x1d080, bit: 1, label: "029 Guy / Battle" }, // prettier-ignore
                        { offset: 0x1d080, bit: 1, label: "030 Leon / Battle" }, // prettier-ignore
                        { offset: 0x1d107, bit: 0, label: "031 Minwu / Battle" }, // prettier-ignore
                        { offset: 0x1d107, bit: 0, label: "032 Josef / Battle" }, // prettier-ignore
                        { offset: 0x1d107, bit: 0, label: "033 Gordon / Battle" }, // prettier-ignore
                        { offset: 0x1d107, bit: 0, label: "034 Leila / Battle" }, // prettier-ignore
                        { offset: 0x1d107, bit: 0, label: "035 Richard / Battle" }, // prettier-ignore
                        { offset: 0x1d080, bit: 1, label: "036 Firion" }, // prettier-ignore
                        { offset: 0x1d080, bit: 1, label: "037 Maria" }, // prettier-ignore
                        { offset: 0x1d080, bit: 1, label: "038 Guy" }, // prettier-ignore
                        { offset: 0x1d080, bit: 1, label: "039 Leon" }, // prettier-ignore
                        { offset: 0x1d107, bit: 1, label: "040 Minwu" }, // prettier-ignore
                        { offset: 0x1d107, bit: 1, label: "041 Josef" }, // prettier-ignore
                        { offset: 0x1d107, bit: 1, label: "042 Gordon" }, // prettier-ignore
                        { offset: 0x1d107, bit: 1, label: "043 Leila" }, // prettier-ignore
                        { offset: 0x1d107, bit: 1, label: "044 Richard" }, // prettier-ignore
                        { offset: 0x1d107, bit: 2, label: "045 Bomb" }, // prettier-ignore
                        { offset: 0x1d107, bit: 2, label: "046 Malboro" }, // prettier-ignore
                        { offset: 0x1d107, bit: 2, label: "047 Iron Giant" }, // prettier-ignore
                        { offset: 0x1d107, bit: 2, label: "048 Adamantoise" }, // prettier-ignore
                        { offset: 0x1d116, bit: 7, label: "049 Coeurl" }, // prettier-ignore
                        { offset: 0x1d107, bit: 3, label: "050 Astaroth" }, // prettier-ignore
                        { offset: 0x1d107, bit: 3, label: "051 Beelzebub" }, // prettier-ignore
                        { offset: 0x1d10d, bit: 1, label: "052 Borghen" }, // prettier-ignore
                        { offset: 0x1d117, bit: 0, label: "053 Queen Lamia" }, // prettier-ignore
                        { offset: 0x1d107, bit: 3, label: "054 Behemoth" }, // prettier-ignore
                        { offset: 0x1d107, bit: 3, label: "055 The Emperor" }, // prettier-ignore
                        { offset: 0x1d110, bit: 4, label: "056 The Emperor" }, // prettier-ignore
                        { offset: 0x1d080, bit: 1, label: "057 Onion Knight" }, // prettier-ignore
                        { offset: 0x1d107, bit: 4, label: "058 Warrior" }, // prettier-ignore
                        { offset: 0x1d107, bit: 4, label: "059 Monk" }, // prettier-ignore
                        { offset: 0x1d107, bit: 4, label: "060 White Mage" }, // prettier-ignore
                        { offset: 0x1d107, bit: 4, label: "061 Black Mage" }, // prettier-ignore
                        { offset: 0x1d107, bit: 5, label: "062 Red Mage" }, // prettier-ignore
                        { offset: 0x1d107, bit: 5, label: "063 Ranger" }, // prettier-ignore
                        { offset: 0x1d107, bit: 5, label: "064 Knight" }, // prettier-ignore
                        { offset: 0x1d107, bit: 5, label: "065 Thief" }, // prettier-ignore
                        { offset: 0x1d107, bit: 6, label: "066 Scholar" }, // prettier-ignore
                        { offset: 0x1d107, bit: 6, label: "067 Geomancer" }, // prettier-ignore
                        { offset: 0x1d107, bit: 6, label: "068 Dragoon" }, // prettier-ignore
                        { offset: 0x1d107, bit: 6, label: "069 Viking" }, // prettier-ignore
                        { offset: 0x1d107, bit: 7, label: "070 Black Belt" }, // prettier-ignore
                        { offset: 0x1d107, bit: 7, label: "071 Dark Knight" }, // prettier-ignore
                        { offset: 0x1d107, bit: 7, label: "072 Illusionist" }, // prettier-ignore
                        { offset: 0x1d107, bit: 7, label: "073 Bard" }, // prettier-ignore
                        { offset: 0x1d108, bit: 0, label: "074 Magus" }, // prettier-ignore
                        { offset: 0x1d108, bit: 0, label: "075 Devout" }, // prettier-ignore
                        { offset: 0x1d108, bit: 0, label: "076 Summoner" }, // prettier-ignore
                        { offset: 0x1d11f, bit: 0, label: "077 Sage" }, // prettier-ignore
                        { offset: 0x1d11f, bit: 1, label: "078 Ninja" }, // prettier-ignore
                        { offset: 0x1d108, bit: 1, label: "079 Nepto Dragon" }, // prettier-ignore
                        { offset: 0x1d108, bit: 1, label: "080 Hein" }, // prettier-ignore
                        { offset: 0x1d108, bit: 1, label: "081 Garuda" }, // prettier-ignore
                        { offset: 0x1d10d, bit: 1, label: "082 Goldor" }, // prettier-ignore
                        { offset: 0x1d117, bit: 1, label: "083 Kunoichi" }, // prettier-ignore
                        { offset: 0x1d11f, bit: 2, label: "084 Xande" }, // prettier-ignore
                        { offset: 0x1d11f, bit: 3, label: "085 Ahriman" }, // prettier-ignore
                        { offset: 0x1d110, bit: 5, label: "086 Cloud of Darkness" }, // prettier-ignore
                        { offset: 0x1d080, bit: 1, label: "087 Cecil (Dark Knight)/ Battle" }, // prettier-ignore
                        { offset: 0x1d080, bit: 1, label: "088 Cecil (Paladin)/ Battle" }, // prettier-ignore
                        { offset: 0x1d080, bit: 1, label: "089 Kain / Battle" }, // prettier-ignore
                        { offset: 0x1d108, bit: 2, label: "090 Rydia (Child) / Battle" }, // prettier-ignore
                        { offset: 0x1d108, bit: 3, label: "091 Edward / Battle" }, // prettier-ignore
                        { offset: 0x1d108, bit: 3, label: "092 Rosa / Battle" }, // prettier-ignore
                        { offset: 0x1d108, bit: 4, label: "093 Palom / Battle" }, // prettier-ignore
                        { offset: 0x1d108, bit: 4, label: "094 Porom / Battle" }, // prettier-ignore
                        { offset: 0x1d108, bit: 3, label: "095 Tellah / Battle" }, // prettier-ignore
                        { offset: 0x1d108, bit: 3, label: "096 Yang / Battle" }, // prettier-ignore
                        { offset: 0x1d108, bit: 4, label: "097 Cid / Battle" }, // prettier-ignore
                        { offset: 0x1d108, bit: 2, label: "098 Rydia / Battle" }, // prettier-ignore
                        { offset: 0x1d108, bit: 4, label: "099 Edge / Battle" }, // prettier-ignore
                        { offset: 0x1d110, bit: 6, label: "100 Fusoya / Battle" }, // prettier-ignore
                      ],
                    },
                    {
                      type: "bitflags",
                      flags: [
                        { offset: 0x1d117, bit: 2, label: "101 Fusoya (KO)" }, // prettier-ignore
                        { offset: 0x1d11f, bit: 4, label: "102 Golbez / Battle" }, // prettier-ignore
                        { offset: 0x1d117, bit: 3, label: "103 Golbez's Hand" }, // prettier-ignore
                        { offset: 0x1d080, bit: 1, label: "104 Cecil (Dark Knight)" }, // prettier-ignore
                        { offset: 0x1d080, bit: 1, label: "105 Cecil" }, // prettier-ignore
                        { offset: 0x1d080, bit: 1, label: "106 Kain" }, // prettier-ignore
                        { offset: 0x1d108, bit: 5, label: "107 Rydia (Child)" }, // prettier-ignore
                        { offset: 0x1d108, bit: 6, label: "108 Edward" }, // prettier-ignore
                        { offset: 0x1d108, bit: 6, label: "109 Rosa" }, // prettier-ignore
                        { offset: 0x1d108, bit: 7, label: "110 Palom" }, // prettier-ignore
                        { offset: 0x1d108, bit: 7, label: "111 Porom" }, // prettier-ignore
                        { offset: 0x1d108, bit: 6, label: "112 Tellah" }, // prettier-ignore
                        { offset: 0x1d108, bit: 6, label: "113 Yang" }, // prettier-ignore
                        { offset: 0x1d108, bit: 7, label: "114 Cid" }, // prettier-ignore
                        { offset: 0x1d108, bit: 5, label: "115 Rydia" }, // prettier-ignore
                        { offset: 0x1d108, bit: 7, label: "116 Edge" }, // prettier-ignore
                        { offset: 0x1d109, bit: 0, label: "117 Fusoya" }, // prettier-ignore
                        { offset: 0x1d111, bit: 0, label: "118 Namingway" }, // prettier-ignore
                        { offset: 0x1d109, bit: 2, label: "119 Pig" }, // prettier-ignore
                        { offset: 0x1d109, bit: 2, label: "120 Toad" }, // prettier-ignore
                        { offset: 0x1d109, bit: 2, label: "121 Mini" }, // prettier-ignore
                        { offset: 0x1d109, bit: 0, label: "122 Mist Dragon" }, // prettier-ignore
                        { offset: 0x1d10d, bit: 2, label: "123 Antlion" }, // prettier-ignore
                        { offset: 0x1d10d, bit: 2, label: "124 Mom Bomb" }, // prettier-ignore
                        { offset: 0x1d117, bit: 4, label: "125 Magus Sisters" }, // prettier-ignore
                        { offset: 0x1d109, bit: 0, label: "126 Calcabrina" }, // prettier-ignore
                        { offset: 0x1d10d, bit: 3, label: "127 Dr. Lugae" }, // prettier-ignore
                        { offset: 0x1d10d, bit: 3, label: "128 Demon Wall" }, // prettier-ignore
                        { offset: 0x1d117, bit: 5, label: "129 Scarmiglione" }, // prettier-ignore
                        { offset: 0x1d117, bit: 6, label: "130 Cagnazzo" }, // prettier-ignore
                        { offset: 0x1d117, bit: 7, label: "131 Barbariccia" }, // prettier-ignore
                        { offset: 0x1d118, bit: 0, label: "132 Rubicante" }, // prettier-ignore
                        { offset: 0x1d109, bit: 1, label: "133 Golbez" }, // prettier-ignore
                        { offset: 0x1d118, bit: 1, label: "134 CPU" }, // prettier-ignore
                        { offset: 0x1d10d, bit: 3, label: "135 Deathmask" }, // prettier-ignore
                        { offset: 0x1d10d, bit: 3, label: "136 Zemus's Breath" }, // prettier-ignore
                        { offset: 0x1d109, bit: 0, label: "137 Flan Princess" }, // prettier-ignore
                        { offset: 0x1d118, bit: 2, label: "138 White Dragon" }, // prettier-ignore
                        { offset: 0x1d109, bit: 1, label: "139 Zemus" }, // prettier-ignore
                        { offset: 0x1d109, bit: 1, label: "140 Zeromus" }, // prettier-ignore
                        { offset: 0x1d110, bit: 7, label: "141 Zeromus" }, // prettier-ignore
                        { offset: 0x1d080, bit: 1, label: "142 Bartz / Freelancer" }, // prettier-ignore
                        { offset: 0x1d080, bit: 1, label: "143 Lenna / Freelancer" }, // prettier-ignore
                        { offset: 0x1d080, bit: 1, label: "144 Galuf / Freelancer" }, // prettier-ignore
                        { offset: 0x1d080, bit: 1, label: "145 Faris / Freelancer" }, // prettier-ignore
                        { offset: 0x1d080, bit: 1, label: "146 Krile / Freelancer" }, // prettier-ignore
                        { offset: 0x1d109, bit: 3, label: "147 Bartz / Knight" }, // prettier-ignore
                        { offset: 0x1d109, bit: 3, label: "148 Lenna / Monk" }, // prettier-ignore
                        { offset: 0x1d109, bit: 3, label: "149 Galuf / Thief" }, // prettier-ignore
                        { offset: 0x1d109, bit: 4, label: "150 Krile / Dragoon" }, // prettier-ignore
                        { offset: 0x1d109, bit: 4, label: "151 Faris / Ninja" }, // prettier-ignore
                        { offset: 0x1d109, bit: 4, label: "152 Galuf / Samurai" }, // prettier-ignore
                        { offset: 0x1d109, bit: 4, label: "153 Krile / Berserker" }, // prettier-ignore
                        { offset: 0x1d109, bit: 5, label: "154 Lenna / Ranger" }, // prettier-ignore
                        { offset: 0x1d109, bit: 5, label: "155 Faris / Mystic Knight" }, // prettier-ignore
                        { offset: 0x1d109, bit: 5, label: "156 Krile / White Mage" }, // prettier-ignore
                        { offset: 0x1d109, bit: 6, label: "157 Bartz / Black Mage" }, // prettier-ignore
                        { offset: 0x1d109, bit: 6, label: "158 Lenna / Time Mage" }, // prettier-ignore
                        { offset: 0x1d109, bit: 6, label: "159 Faris / Summoner" }, // prettier-ignore
                        { offset: 0x1d109, bit: 6, label: "160 Lenna / Blue Mage" }, // prettier-ignore
                        { offset: 0x1d109, bit: 7, label: "161 Faris / Red Mage" }, // prettier-ignore
                        { offset: 0x1d109, bit: 7, label: "162 Galuf / Beastmaster" }, // prettier-ignore
                        { offset: 0x1d109, bit: 7, label: "163 Galuf / Chemist" }, // prettier-ignore
                        { offset: 0x1d109, bit: 7, label: "164 Krile / Geomancer" }, // prettier-ignore
                        { offset: 0x1d10a, bit: 0, label: "165 Bartz / Bard" }, // prettier-ignore
                        { offset: 0x1d10a, bit: 0, label: "166 Bartz / Dancer" }, // prettier-ignore
                        { offset: 0x1d10a, bit: 0, label: "167 Bartz / Mimic" }, // prettier-ignore
                        { offset: 0x1d111, bit: 5, label: "168 Boko" }, // prettier-ignore
                        { offset: 0x1d11f, bit: 5, label: "169 The Dawn Warriors" }, // prettier-ignore
                        { offset: 0x1d111, bit: 3, label: "170 Sage Ghido" }, // prettier-ignore
                        { offset: 0x1d111, bit: 4, label: "171 Mr. Clio" }, // prettier-ignore
                        { offset: 0x1d10a, bit: 1, label: "172 Magic Pot" }, // prettier-ignore
                        { offset: 0x1d10a, bit: 2, label: "173 Famed Mimic Gogo" }, // prettier-ignore
                        { offset: 0x1d118, bit: 3, label: "174 Nutkin" }, // prettier-ignore
                        { offset: 0x1d10d, bit: 2, label: "175 Soul Cannon" }, // prettier-ignore
                        { offset: 0x1d10d, bit: 2, label: "176 Atomos" }, // prettier-ignore
                        { offset: 0x1d10a, bit: 2, label: "177 Gilgamesh" }, // prettier-ignore
                        { offset: 0x1d11f, bit: 6, label: "178 Gilgamesh" }, // prettier-ignore
                        { offset: 0x1d10a, bit: 2, label: "179 Exdeath" }, // prettier-ignore
                        { offset: 0x1d118, bit: 4, label: "180 Melusine" }, // prettier-ignore
                        { offset: 0x1d10a, bit: 1, label: "181 Tonberry" }, // prettier-ignore
                        { offset: 0x1d118, bit: 5, label: "182 Calofisteri" }, // prettier-ignore
                        { offset: 0x1d118, bit: 6, label: "183 Catastrophe" }, // prettier-ignore
                        { offset: 0x1d10d, bit: 3, label: "184 Twintania" }, // prettier-ignore
                        { offset: 0x1d10a, bit: 1, label: "185 Mover" }, // prettier-ignore
                        { offset: 0x1d10a, bit: 2, label: "186 Necrophobe" }, // prettier-ignore
                        { offset: 0x1d11f, bit: 7, label: "187 Exdeath" }, // prettier-ignore
                        { offset: 0x1d111, bit: 1, label: "188 Neo Exdeath" }, // prettier-ignore
                        { offset: 0x1d111, bit: 2, label: "189 Omega" }, // prettier-ignore
                        { offset: 0x1d118, bit: 7, label: "190 Shinryu" }, // prettier-ignore
                        { offset: 0x1d080, bit: 1, label: "191 Terra / Battle" }, // prettier-ignore
                        { offset: 0x1d120, bit: 0, label: "192 Terra (Esper) / Battle" }, // prettier-ignore
                        { offset: 0x1d10a, bit: 3, label: "193 Locke / Battle" }, // prettier-ignore
                        { offset: 0x1d10a, bit: 3, label: "194 Edgar / Battle" }, // prettier-ignore
                        { offset: 0x1d10a, bit: 4, label: "195 Sabin / Battle" }, // prettier-ignore
                        { offset: 0x1d10a, bit: 3, label: "196 Shadow / Battle" }, // prettier-ignore
                        { offset: 0x1d10a, bit: 3, label: "197 Cyan / Battle" }, // prettier-ignore
                        { offset: 0x1d10a, bit: 5, label: "198 Gau / Battle" }, // prettier-ignore
                        { offset: 0x1d10a, bit: 4, label: "199 Celes / Battle" }, // prettier-ignore
                        { offset: 0x1d10a, bit: 5, label: "200 Setzer / Battle" }, // prettier-ignore
                      ],
                    },
                    {
                      type: "bitflags",
                      flags: [
                        { offset: 0x1d10a, bit: 4, label: "201 Strago / Battle" }, // prettier-ignore
                        { offset: 0x1d10a, bit: 4, label: "202 Relm / Battle" }, // prettier-ignore
                        { offset: 0x1d10a, bit: 5, label: "203 Mog / Battle" }, // prettier-ignore
                        { offset: 0x1d10a, bit: 5, label: "204 Umaro / Battle" }, // prettier-ignore
                        { offset: 0x1d120, bit: 1, label: "205 Gogo / Battle" }, // prettier-ignore
                        { offset: 0x1d080, bit: 1, label: "206 Terra" }, // prettier-ignore
                        { offset: 0x1d10a, bit: 6, label: "207 Locke" }, // prettier-ignore
                        { offset: 0x1d10a, bit: 6, label: "208 Edgar" }, // prettier-ignore
                        { offset: 0x1d10a, bit: 7, label: "209 Sabin" }, // prettier-ignore
                        { offset: 0x1d10a, bit: 6, label: "210 Shadow" }, // prettier-ignore
                        { offset: 0x1d10a, bit: 6, label: "211 Cyan" }, // prettier-ignore
                        { offset: 0x1d10b, bit: 0, label: "212 Gau" }, // prettier-ignore
                        { offset: 0x1d10a, bit: 7, label: "213 Celes" }, // prettier-ignore
                        { offset: 0x1d10b, bit: 0, label: "214 Setzer" }, // prettier-ignore
                        { offset: 0x1d10a, bit: 7, label: "215 Strago" }, // prettier-ignore
                        { offset: 0x1d10a, bit: 7, label: "216 Relm" }, // prettier-ignore
                        { offset: 0x1d10b, bit: 0, label: "217 Mog" }, // prettier-ignore
                        { offset: 0x1d10b, bit: 1, label: "218 Umaro" }, // prettier-ignore
                        { offset: 0x1d10b, bit: 0, label: "219 Gogo" }, // prettier-ignore
                        { offset: 0x1d10b, bit: 1, label: "220 Biggs & Wedge" }, // prettier-ignore
                        { offset: 0x1d10b, bit: 1, label: "221 Banon" }, // prettier-ignore
                        { offset: 0x1d10b, bit: 1, label: "222 Leo" }, // prettier-ignore
                        { offset: 0x1d112, bit: 2, label: "223 Maria (Celes)" }, // prettier-ignore
                        { offset: 0x1d119, bit: 0, label: "224 Rachel" }, // prettier-ignore
                        { offset: 0x1d112, bit: 0, label: "225 Imp" }, // prettier-ignore
                        { offset: 0x1d112, bit: 1, label: "226 Mysidian Rabbit" }, // prettier-ignore
                        { offset: 0x1d119, bit: 1, label: "227 Phantom Train" }, // prettier-ignore
                        { offset: 0x1d10b, bit: 3, label: "228 Kefka" }, // prettier-ignore
                        { offset: 0x1d10b, bit: 3, label: "229 Cactuar" }, // prettier-ignore
                        { offset: 0x1d10d, bit: 3, label: "230 Tyrannosaur" }, // prettier-ignore
                        { offset: 0x1d119, bit: 2, label: "231 Brachiosaur" }, // prettier-ignore
                        { offset: 0x1d10d, bit: 3, label: "232 Humbaba" }, // prettier-ignore
                        { offset: 0x1d10b, bit: 2, label: "233 Chadarnook" }, // prettier-ignore
                        { offset: 0x1d10d, bit: 2, label: "234 Curlax" }, // prettier-ignore
                        { offset: 0x1d10d, bit: 2, label: "235 Laragorn" }, // prettier-ignore
                        { offset: 0x1d10d, bit: 2, label: "236 Moebius" }, // prettier-ignore
                        { offset: 0x1d119, bit: 3, label: "237 Deathgaze" }, // prettier-ignore
                        { offset: 0x1d10b, bit: 2, label: "238 Ultros" }, // prettier-ignore
                        { offset: 0x1d10b, bit: 2, label: "239 Typhon" }, // prettier-ignore
                        { offset: 0x1d111, bit: 7, label: "240 Siegfried" }, // prettier-ignore
                        { offset: 0x1d10b, bit: 2, label: "241 Fiend" }, // prettier-ignore
                        { offset: 0x1d10b, bit: 3, label: "242 Demon" }, // prettier-ignore
                        { offset: 0x1d10b, bit: 3, label: "243 Goddess" }, // prettier-ignore
                        { offset: 0x1d111, bit: 6, label: "244 Kefka" }, // prettier-ignore
                        { offset: 0x1d080, bit: 1, label: "245 Cloud" }, // prettier-ignore
                        { offset: 0x1d080, bit: 1, label: "246 Tifa" }, // prettier-ignore
                        { offset: 0x1d10b, bit: 4, label: "247 Barret" }, // prettier-ignore
                        { offset: 0x1d080, bit: 1, label: "248 Aerith" }, // prettier-ignore
                        { offset: 0x1d10b, bit: 4, label: "249 Red XIII" }, // prettier-ignore
                        { offset: 0x1d10b, bit: 5, label: "250 Cait Sith" }, // prettier-ignore
                        { offset: 0x1d10b, bit: 5, label: "251 Yuffie" }, // prettier-ignore
                        { offset: 0x1d10b, bit: 5, label: "252 Vincent" }, // prettier-ignore
                        { offset: 0x1d10b, bit: 5, label: "253 Cid" }, // prettier-ignore
                        { offset: 0x1d112, bit: 3, label: "254 Sephiroth" }, // prettier-ignore
                        { offset: 0x1d080, bit: 1, label: "255 Squall" }, // prettier-ignore
                        { offset: 0x1d10b, bit: 6, label: "256 Zell" }, // prettier-ignore
                        { offset: 0x1d10b, bit: 6, label: "257 Quistis" }, // prettier-ignore
                        { offset: 0x1d10b, bit: 7, label: "258 Selphie" }, // prettier-ignore
                        { offset: 0x1d10b, bit: 6, label: "259 Rinoa" }, // prettier-ignore
                        { offset: 0x1d10b, bit: 6, label: "260 Irvine" }, // prettier-ignore
                        { offset: 0x1d080, bit: 1, label: "261 Laguna" }, // prettier-ignore
                        { offset: 0x1d10b, bit: 7, label: "262 Kiros" }, // prettier-ignore
                        { offset: 0x1d10b, bit: 7, label: "263 Ward" }, // prettier-ignore
                        { offset: 0x1d11b, bit: 7, label: "264 Seifer" }, // prettier-ignore
                        { offset: 0x1d112, bit: 4, label: "265 Edea" }, // prettier-ignore
                        { offset: 0x1d080, bit: 1, label: "266 Zidane" }, // prettier-ignore
                        { offset: 0x1d10c, bit: 0, label: "267 Vivi" }, // prettier-ignore
                        { offset: 0x1d10c, bit: 0, label: "268 Garnet" }, // prettier-ignore
                        { offset: 0x1d10c, bit: 0, label: "269 Steiner" }, // prettier-ignore
                        { offset: 0x1d10c, bit: 0, label: "270 Freya" }, // prettier-ignore
                        { offset: 0x1d10c, bit: 1, label: "271 Quina" }, // prettier-ignore
                        { offset: 0x1d10c, bit: 1, label: "272 Eiko" }, // prettier-ignore
                        { offset: 0x1d10c, bit: 1, label: "273 Amarant" }, // prettier-ignore
                        { offset: 0x1d080, bit: 1, label: "274 Tidus" }, // prettier-ignore
                        { offset: 0x1d080, bit: 1, label: "275 Yuna" }, // prettier-ignore
                        { offset: 0x1d10c, bit: 2, label: "276 Wakka" }, // prettier-ignore
                        { offset: 0x1d10c, bit: 2, label: "277 Lulu" }, // prettier-ignore
                        { offset: 0x1d10c, bit: 3, label: "278 Kimahri" }, // prettier-ignore
                        { offset: 0x1d10c, bit: 3, label: "279 Auron" }, // prettier-ignore
                        { offset: 0x1d10c, bit: 3, label: "280 Rikku" }, // prettier-ignore
                        { offset: 0x1d112, bit: 6, label: "281 Seymour" }, // prettier-ignore
                        { offset: 0x1d10c, bit: 4, label: "282 Hume Male" }, // prettier-ignore
                        { offset: 0x1d10c, bit: 4, label: "283 Hume Female" }, // prettier-ignore
                        { offset: 0x1d10c, bit: 4, label: "284 Elvaan Male" }, // prettier-ignore
                        { offset: 0x1d10c, bit: 4, label: "285 Elvaan Female" }, // prettier-ignore
                        { offset: 0x1d10c, bit: 5, label: "286 Tarutaru Male" }, // prettier-ignore
                        { offset: 0x1d10c, bit: 5, label: "287 Tarutaru Female" }, // prettier-ignore
                        { offset: 0x1d10c, bit: 5, label: "288 Mithra" }, // prettier-ignore
                        { offset: 0x1d10c, bit: 5, label: "289 Galka" }, // prettier-ignore
                        { offset: 0x1d080, bit: 1, label: "290 Vaan" }, // prettier-ignore
                        { offset: 0x1d10c, bit: 7, label: "291 Penelo" }, // prettier-ignore
                        { offset: 0x1d10c, bit: 6, label: "292 Balthier" }, // prettier-ignore
                        { offset: 0x1d10c, bit: 6, label: "293 Fran" }, // prettier-ignore
                        { offset: 0x1d10c, bit: 7, label: "294 Ashe" }, // prettier-ignore
                        { offset: 0x1d10c, bit: 6, label: "295 Basch" }, // prettier-ignore
                        { offset: 0x1d10c, bit: 7, label: "296 Larsa" }, // prettier-ignore
                        { offset: 0x1d10d, bit: 0, label: "297 Vossler" }, // prettier-ignore
                        { offset: 0x1d10d, bit: 0, label: "298 Reddas" }, // prettier-ignore
                        { offset: 0x1d10d, bit: 0, label: "299 Reks" }, // prettier-ignore
                        { offset: 0x1d080, bit: 1, label: "300 Lightning" }, // prettier-ignore
                      ],
                    },
                    {
                      type: "bitflags",
                      flags: [
                        { offset: 0x1d10d, bit: 6, label: "301 Snow" }, // prettier-ignore
                        { offset: 0x1d10d, bit: 6, label: "302 Sazh" }, // prettier-ignore
                        { offset: 0x1d10d, bit: 6, label: "303 Hope" }, // prettier-ignore
                        { offset: 0x1d10d, bit: 6, label: "304 Vanille" }, // prettier-ignore
                        { offset: 0x1d10d, bit: 6, label: "305 Fang" }, // prettier-ignore
                        { offset: 0x1d10d, bit: 6, label: "306 Serah" }, // prettier-ignore
                        { offset: 0x1d10d, bit: 6, label: "307 Yaag Rosch" }, // prettier-ignore
                        { offset: 0x1d10d, bit: 6, label: "308 Jihl Nabaat" }, // prettier-ignore
                        { offset: 0x1d10d, bit: 6, label: "309 Cid Raines" }, // prettier-ignore
                        { offset: 0x1d119, bit: 4, label: "310 Chocobo Chick" }, // prettier-ignore
                        { offset: 0x1d080, bit: 1, label: "311 Lightning" }, // prettier-ignore
                        { offset: 0x1d080, bit: 1, label: "312 Vaan" }, // prettier-ignore
                        { offset: 0x1d080, bit: 1, label: "313 Laguna" }, // prettier-ignore
                        { offset: 0x1d080, bit: 1, label: "314 Yuna" }, // prettier-ignore
                        { offset: 0x1d080, bit: 1, label: "315 Kain" }, // prettier-ignore
                        { offset: 0x1d080, bit: 1, label: "316 Tifa" }, // prettier-ignore
                        { offset: 0x1d080, bit: 1, label: "317 Warrior of Light" }, // prettier-ignore
                        { offset: 0x1d080, bit: 1, label: "318 Firion" }, // prettier-ignore
                        { offset: 0x1d080, bit: 1, label: "319 Onion Knight" }, // prettier-ignore
                        { offset: 0x1d080, bit: 1, label: "320 Cecil" }, // prettier-ignore
                        { offset: 0x1d080, bit: 1, label: "321 Bartz" }, // prettier-ignore
                        { offset: 0x1d080, bit: 1, label: "322 Terra" }, // prettier-ignore
                        { offset: 0x1d080, bit: 1, label: "323 Cloud" }, // prettier-ignore
                        { offset: 0x1d080, bit: 1, label: "324 Squall" }, // prettier-ignore
                        { offset: 0x1d080, bit: 1, label: "325 Zidane" }, // prettier-ignore
                        { offset: 0x1d080, bit: 1, label: "326 Tidus" }, // prettier-ignore
                        { offset: 0x1d112, bit: 7, label: "327 Garland" }, // prettier-ignore
                        { offset: 0x1d113, bit: 0, label: "328 The Emperor" }, // prettier-ignore
                        { offset: 0x1d113, bit: 1, label: "329 Cloud of Darkness" }, // prettier-ignore
                        { offset: 0x1d113, bit: 2, label: "330 Golbez" }, // prettier-ignore
                        { offset: 0x1d113, bit: 3, label: "331 Exdeath" }, // prettier-ignore
                        { offset: 0x1d113, bit: 4, label: "332 Kefka" }, // prettier-ignore
                        { offset: 0x1d113, bit: 5, label: "333 Sephiroth" }, // prettier-ignore
                        { offset: 0x1d113, bit: 6, label: "334 Ultimecia" }, // prettier-ignore
                        { offset: 0x1d113, bit: 7, label: "335 Kuja" }, // prettier-ignore
                        { offset: 0x1d114, bit: 0, label: "336 Jecht" }, // prettier-ignore
                        { offset: 0x1d114, bit: 2, label: "337 Shantotto" }, // prettier-ignore
                        { offset: 0x1d114, bit: 3, label: "338 Gabranth" }, // prettier-ignore
                        { offset: 0x1d0da, bit: 7, label: "339 Prishe" }, // prettier-ignore
                        { offset: 0x1d0da, bit: 3, label: "340 Gilgamesh" }, // prettier-ignore
                        { offset: 0x1d114, bit: 1, label: "341 Cosmos" }, // prettier-ignore
                        { offset: 0x1d120, bit: 2, label: "342 Chaos" }, // prettier-ignore
                        { offset: 0x1d119, bit: 5, label: "343 Feral Chaos" }, // prettier-ignore
                        { offset: 0x1d119, bit: 6, label: "344 Asura" }, // prettier-ignore
                        { offset: 0x1d119, bit: 7, label: "345 Shiva" }, // prettier-ignore
                        { offset: 0x1d11a, bit: 0, label: "346 Ifrit" }, // prettier-ignore
                        { offset: 0x1d11a, bit: 1, label: "347 Ramuh" }, // prettier-ignore
                        { offset: 0x1d10d, bit: 4, label: "348 Sylph" }, // prettier-ignore
                        { offset: 0x1d11a, bit: 2, label: "349 Syldra" }, // prettier-ignore
                        { offset: 0x1d11a, bit: 3, label: "350 Leviathan" }, // prettier-ignore
                        { offset: 0x1d11a, bit: 4, label: "351 Phoenix" }, // prettier-ignore
                        { offset: 0x1d10d, bit: 4, label: "352 Cait Sith" }, // prettier-ignore
                        { offset: 0x1d10d, bit: 4, label: "353 Fenrir" }, // prettier-ignore
                        { offset: 0x1d11a, bit: 5, label: "354 Odin" }, // prettier-ignore
                        { offset: 0x1d11a, bit: 6, label: "355 Raiden" }, // prettier-ignore
                        { offset: 0x1d11a, bit: 7, label: "356 Alexander" }, // prettier-ignore
                        { offset: 0x1d11b, bit: 0, label: "357 Bahamut" }, // prettier-ignore
                        { offset: 0x1d11b, bit: 1, label: "358 Ragnarok" }, // prettier-ignore
                        { offset: 0x1d115, bit: 1, label: "359 Item Shop" }, // prettier-ignore
                        { offset: 0x1d115, bit: 2, label: "360 Weapon Shop" }, // prettier-ignore
                        { offset: 0x1d115, bit: 3, label: "361 Armor Shop" }, // prettier-ignore
                        { offset: 0x1d114, bit: 5, label: "362 Floating Continent" }, // prettier-ignore
                        { offset: 0x1d114, bit: 4, label: "363 Moai Statue" }, // prettier-ignore
                        { offset: 0x1d115, bit: 0, label: "364 Treasure Chest" }, // prettier-ignore
                        { offset: 0x1d114, bit: 6, label: "365 Tent" }, // prettier-ignore
                        { offset: 0x1d114, bit: 7, label: "366 Crystal" }, // prettier-ignore
                        { offset: 0x1d11b, bit: 2, label: "367 Fish" }, // prettier-ignore
                        { offset: 0x1d10d, bit: 5, label: "368 Airship" }, // prettier-ignore
                        { offset: 0x1d11b, bit: 3, label: "369 The Invincible" }, // prettier-ignore
                        { offset: 0x1d120, bit: 3, label: "370 Red Wings" }, // prettier-ignore
                        { offset: 0x1d11b, bit: 4, label: "371 Wyvern" }, // prettier-ignore
                        { offset: 0x1d11b, bit: 5, label: "372 The Lunar Whale" }, // prettier-ignore
                        { offset: 0x1d120, bit: 4, label: "373 The Blackjack" }, // prettier-ignore
                        { offset: 0x1d11b, bit: 6, label: "374 Fat Chocobo" }, // prettier-ignore
                        { offset: 0x1d112, bit: 5, label: "375 Chocobo World" }, // prettier-ignore
                        { offset: 0x1d116, bit: 2, label: "376 Chocobo" }, // prettier-ignore
                        { offset: 0x1d116, bit: 3, label: "377 Moogle" }, // prettier-ignore
                        { offset: 0x1d116, bit: 0, label: "378 FINAL FANTASY XIII" }, // prettier-ignore
                        { offset: 0x1d116, bit: 1, label: "379 FINAL FANTASY XIII" }, // prettier-ignore
                        { offset: 0x1d115, bit: 4, label: "380 FINAL FANTASY Agito XIII" }, // prettier-ignore
                        { offset: 0x1d115, bit: 5, label: "381 FINAL FANTASY Agito XIII" }, // prettier-ignore
                        { offset: 0x1d115, bit: 6, label: "382 FINAL FANTASY Versus XIII" }, // prettier-ignore
                        { offset: 0x1d115, bit: 7, label: "383 FINAL FANTASY Versus XIII" }, // prettier-ignore
                        { offset: 0x1d10d, bit: 7, label: "384 Midlander" }, // prettier-ignore
                        { offset: 0x1d10d, bit: 7, label: "385 Highlander" }, // prettier-ignore
                        { offset: 0x1d10d, bit: 7, label: "386 Seeker of the Sun" }, // prettier-ignore
                        { offset: 0x1d10d, bit: 7, label: "387 Keeper of the Moon" }, // prettier-ignore
                        { offset: 0x1d10d, bit: 7, label: "388 Plainsfolk" }, // prettier-ignore
                        { offset: 0x1d10d, bit: 7, label: "389 Dunesfolk" }, // prettier-ignore
                        { offset: 0x1d10d, bit: 7, label: "390 Wildwood" }, // prettier-ignore
                        { offset: 0x1d10d, bit: 7, label: "391 Duskwight" }, // prettier-ignore
                        { offset: 0x1d10d, bit: 7, label: "392 Sea Wolf" }, // prettier-ignore
                        { offset: 0x1d10d, bit: 7, label: "393 Hellsguard" }, // prettier-ignore
                        { offset: 0x1d10e, bit: 0, label: "394 Warrior of Light" }, // prettier-ignore
                        { offset: 0x1d10e, bit: 1, label: "395 Firion" }, // prettier-ignore
                        { offset: 0x1d10e, bit: 2, label: "396 Onion Knight" }, // prettier-ignore
                        { offset: 0x1d10e, bit: 3, label: "397 Cecil" }, // prettier-ignore
                        { offset: 0x1d10e, bit: 4, label: "398 Kain" }, // prettier-ignore
                        { offset: 0x1d10e, bit: 5, label: "399 Bartz" }, // prettier-ignore
                        { offset: 0x1d10e, bit: 6, label: "400 Terra" }, // prettier-ignore
                      ],
                    },
                    {
                      type: "bitflags",
                      flags: [
                        { offset: 0x1d10e, bit: 7, label: "401 Cloud" }, // prettier-ignore
                        { offset: 0x1d10f, bit: 0, label: "402 Tifa" }, // prettier-ignore
                        { offset: 0x1d10f, bit: 1, label: "403 Squall" }, // prettier-ignore
                        { offset: 0x1d10f, bit: 2, label: "404 Laguna" }, // prettier-ignore
                        { offset: 0x1d10f, bit: 3, label: "405 Zidane" }, // prettier-ignore
                        { offset: 0x1d10f, bit: 4, label: "406 Tidus" }, // prettier-ignore
                        { offset: 0x1d10f, bit: 5, label: "407 Yuna" }, // prettier-ignore
                        { offset: 0x1d10f, bit: 6, label: "408 Shantotto" }, // prettier-ignore
                        { offset: 0x1d10f, bit: 7, label: "409 Prishe" }, // prettier-ignore
                        { offset: 0x1d110, bit: 0, label: "410 Vaan" }, // prettier-ignore
                        { offset: 0x1d110, bit: 1, label: "411 Lightning" }, // prettier-ignore
                        { offset: 0x1d080, bit: 1, label: "412 Quest: ???" }, // prettier-ignore
                        { offset: 0x1d080, bit: 1, label: "413 Quest: No Character" }, // prettier-ignore
                      ],
                    },
                  ],
                },
                {
                  name: "Records",
                  items: [
                    {
                      type: "tabs",
                      vertical: true,
                      items: [
                        {
                          name: "General",
                          flex: true,
                          items: [
                            {
                              name: "Total of gil spent at the Shop",
                              offset: 0xfdc4,
                              type: "variable",
                              dataType: "uint32",
                              // max:
                            },
                            {
                              name: "Total of gil received",
                              offset: 0xfde8,
                              type: "variable",
                              dataType: "uint32",
                              // max:
                            },
                            {
                              name: "Total of gil spent on trade good after materials core?",
                              offset: 0xfdec,
                              type: "variable",
                              dataType: "uint32",
                              // max:
                            },
                            {
                              name: "Total of PP earned",
                              offset: 0xfdf0,
                              type: "variable",
                              dataType: "uint32",
                              // max:
                            },
                            {
                              name: "Total of PP spent in the PP Catalog",
                              offset: 0xfdf4,
                              type: "variable",
                              dataType: "uint32",
                              // max:
                            },
                            {
                              name: "Total of items obtained outside of the Shop",
                              offset: 0xfdf8,
                              type: "variable",
                              dataType: "uint32",
                              // max:
                            },
                            {
                              name: "Total of accessories obtained outside of the Shop",
                              offset: 0xfdfc,
                              type: "variable",
                              dataType: "uint32",
                              // max:
                            },
                            {
                              name: "Number of treasure chests opened",
                              offset: 0xfe00,
                              type: "variable",
                              dataType: "uint32",
                              // max:
                            },
                            {
                              name: "Number of trades",
                              offset: 0xfe08,
                              type: "variable",
                              dataType: "uint32",
                              // max:
                            },
                            {
                              name: "Number of party battle won",
                              offset: 0xfe0c,
                              type: "variable",
                              dataType: "uint32",
                              // max:
                            },
                            {
                              name: "Number of points gained from bravery assist attacks",
                              offset: 0xfe14,
                              type: "variable",
                              dataType: "uint32",
                              // max:
                            },
                            {
                              name: "Total of points of damage dealt with assist attacks",
                              offset: 0xfe18,
                              type: "variable",
                              dataType: "uint32",
                              // max:
                            },
                            {
                              name: "Number of times Communications menu has been visited",
                              offset: 0xfe1c,
                              type: "variable",
                              dataType: "uint32",
                              // max:
                            },
                            // TODO: Same as characters (see CE)
                            // {
                            //   name: "Number of battles won",
                            //   offset: 0x119a0,
                            //   type: "variable",
                            //   dataType: "uint32",
                            //   // max:
                            // },
                            // {
                            //   name: "Total of points of bravery gained",
                            //   offset: 0x119ac,
                            //   type: "variable",
                            //   dataType: "uint32",
                            //   // max:
                            // },
                            // {
                            //   name: "Number of bravery attacks delivered",
                            //   offset: 0x119bc,
                            //   type: "variable",
                            //   dataType: "uint32",
                            //   // max:
                            // },
                            // {
                            //   name: "Total of points of damage dealt",
                            //   offset: 0x119c4,
                            //   type: "variable",
                            //   dataType: "uint32",
                            //   // max:
                            // },
                          ],
                        },
                        ...characters.map(
                          (item) =>
                            ({
                              name: item.name,
                              items: [
                                {
                                  type: "section",
                                  flex: true,
                                  items: [
                                    {
                                      name: "Wireless Battles",
                                      offset: 0xff04 + item.index * 0xc8,
                                      type: "variable",
                                      dataType: "uint32",
                                      // max:
                                    },
                                    {
                                      name: "Wins",
                                      offset: 0xff10 + item.index * 0xc8,
                                      type: "variable",
                                      dataType: "uint32",
                                      // max:
                                    },
                                    {
                                      name: "Losses",
                                      offset: 0xff14 + item.index * 0xc8,
                                      type: "variable",
                                      dataType: "uint32",
                                      // max:
                                    },
                                  ],
                                },
                                {
                                  type: "section",
                                  flex: true,
                                  items: [
                                    {
                                      name: "Battle Time",
                                      offset: 0xff18 + item.index * 0xc8,
                                      type: "variable",
                                      dataType: "uint32",
                                      // max:
                                    },
                                    {
                                      name: "Distance Traveled",
                                      offset: 0xff8c + item.index * 0xc8,
                                      type: "variable",
                                      dataType: "uint32",
                                      // max:
                                    },
                                  ],
                                },
                                {
                                  type: "section",
                                  flex: true,
                                  items: [
                                    {
                                      name: "Damage Dealt",
                                      offset: 0xff34 + item.index * 0xc8,
                                      type: "variable",
                                      dataType: "uint32",
                                      // max:
                                    },
                                    {
                                      name: "Damage Taken",
                                      offset: 0xff3c + item.index * 0xc8,
                                      type: "variable",
                                      dataType: "uint32",
                                      // max:
                                    },
                                    {
                                      name: "Bravery Gained",
                                      offset: 0xff1c + item.index * 0xc8,
                                      type: "variable",
                                      dataType: "uint32",
                                      // max:
                                    },
                                    {
                                      name: "Bravery Lost",
                                      offset: 0xff24 + item.index * 0xc8,
                                      type: "variable",
                                      dataType: "uint32",
                                      // max:
                                    },
                                    {
                                      name: "Max. Breavery",
                                      offset: 0xff20 + item.index * 0xc8,
                                      type: "variable",
                                      dataType: "uint32",
                                      // max:
                                    },
                                  ],
                                },
                                {
                                  type: "section",
                                  flex: true,
                                  items: [
                                    {
                                      name: "O Attack Count",
                                      offset: 0xff2c + item.index * 0xc8,
                                      type: "variable",
                                      dataType: "uint32",
                                      // max:
                                    },
                                    {
                                      name: "[] Attack Count",
                                      offset: 0xff44 + item.index * 0xc8,
                                      type: "variable",
                                      dataType: "uint32",
                                      // max:
                                    },
                                    {
                                      name: "Blows Blocked",
                                      offset: 0xff84 + item.index * 0xc8,
                                      type: "variable",
                                      dataType: "uint32",
                                      // max:
                                    },
                                    {
                                      name: "Blows Evaded",
                                      offset: 0xff80 + item.index * 0xc8,
                                      type: "variable",
                                      dataType: "uint32",
                                      // max:
                                    },
                                  ],
                                },
                                {
                                  type: "section",
                                  flex: true,
                                  items: [
                                    {
                                      name: "EX Cores Obtained",
                                      offset: 0xff58 + item.index * 0xc8,
                                      type: "variable",
                                      dataType: "uint32",
                                      // max:
                                    },
                                    {
                                      name: "Entered EX Mode",
                                      offset: 0xff5c + item.index * 0xc8,
                                      type: "variable",
                                      dataType: "uint32",
                                      // max:
                                    },
                                    {
                                      name: "HP Regenerated",
                                      offset: 0xff60 + item.index * 0xc8,
                                      type: "variable",
                                      dataType: "uint32",
                                      // max:
                                    },
                                    {
                                      name: "EX Burst Finishes",
                                      offset: 0xff64 + item.index * 0xc8,
                                      type: "variable",
                                      dataType: "uint32",
                                      // max:
                                    },
                                    {
                                      name: "Used EX Revenge",
                                      offset: 0xff9c + item.index * 0xc8,
                                      type: "variable",
                                      dataType: "uint32",
                                      // max:
                                    },
                                  ],
                                },
                                {
                                  type: "section",
                                  flex: true,
                                  items: [
                                    {
                                      name: "Assists",
                                      offset: 0xffa0 + item.index * 0xc8,
                                      type: "variable",
                                      dataType: "uint32",
                                      // max:
                                    },
                                    {
                                      name: "Assists Changes",
                                      offset: 0xffa4 + item.index * 0xc8,
                                      type: "variable",
                                      dataType: "uint32",
                                      // max:
                                    },
                                    {
                                      name: "Assists Locked",
                                      offset: 0xffa8 + item.index * 0xc8,
                                      type: "variable",
                                      dataType: "uint32",
                                      // max:
                                    },
                                  ],
                                },
                              ],
                            }) as ItemTab,
                        ),
                      ],
                    },
                  ],
                },
              ],
            },
          ],
        },
        {
          name: "Data Config",
          items: [
            {
              type: "tabs",
              items: [
                {
                  name: "Friend Cards",
                  items: [
                    {
                      id: "friendCardsCount",
                      name: "Number of Friend Cards",
                      offset: 0x3902c,
                      type: "variable",
                      dataType: "uint32",
                      hidden: true,
                    },
                    {
                      id: "friendCards",
                      length: 0x10a8,
                      type: "container",
                      instanceType: "tabs",
                      instances: 0,
                      resource: "friendCardNames",
                      vertical: true,
                      prependSubinstance: [
                        {
                          name: "My Card",
                          items: [
                            {
                              type: "section",
                              flex: true,
                              items: [
                                {
                                  name: "Name",
                                  offset: 0x1ef00,
                                  length: 0x18,
                                  type: "variable",
                                  dataType: "string",
                                  letterDataType: "uint16",
                                  zeroTerminated: true,
                                },
                                {
                                  id: "friendCardMessage",
                                  name: "Message",
                                  offset: 0x1ef1a,
                                  length: 0x96,
                                  type: "variable",
                                  dataType: "string",
                                  letterDataType: "uint16",
                                  zeroTerminated: true,
                                  size: "lg",
                                },
                                {
                                  name: "Icon",
                                  offset: 0x1eef4,
                                  type: "variable",
                                  dataType: "uint16",
                                  resource: "icons",
                                  autocomplete: true,
                                  size: "lg",
                                },
                              ],
                            },
                            {
                              type: "section",
                              flex: true,
                              items: [
                                {
                                  name: "Play Time",
                                  type: "group",
                                  mode: "time",
                                  items: [
                                    {
                                      offset: 0x1eef0,
                                      type: "variable",
                                      dataType: "uint32",
                                      operations: [
                                        {
                                          convert: {
                                            from: "seconds",
                                            to: "hours",
                                          },
                                        },
                                      ],
                                      max: 999,
                                    },
                                    {
                                      offset: 0x1eef0,
                                      type: "variable",
                                      dataType: "uint32",
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
                                      offset: 0x1eef0,
                                      type: "variable",
                                      dataType: "uint32",
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
                                  name: "ID",
                                  offset: 0x1eef6,
                                  type: "variable",
                                  dataType: "uint8",
                                  resource: "friendCardIds",
                                },
                                {
                                  name: "Bitflags",
                                  type: "bitflags",
                                  flags: [
                                    { offset: 0x1eef7, bit: 0, label: "Card Data Locked" }, // prettier-ignore
                                    { offset: 0x1eef7, bit: 1, label: "Color related", hidden: true }, // prettier-ignore
                                    { offset: 0x1eef7, bit: 2, label: "???", hidden: true }, // prettier-ignore
                                    { offset: 0x1eef7, bit: 3, label: "Special" }, // prettier-ignore
                                    { offset: 0x1eef7, bit: 4, label: "New" }, // prettier-ignore
                                    { offset: 0x1eef7, bit: 5, label: "Updated" }, // prettier-ignore
                                    { offset: 0x1eef7, bit: 6, label: "???", hidden: true }, // prettier-ignore
                                    { offset: 0x1eef7, bit: 7, label: "???", hidden: true }, // prettier-ignore
                                  ],
                                },
                                {
                                  name: "Character",
                                  offset: 0x1efb4,
                                  type: "variable",
                                  dataType: "uint8", // TODO
                                  // max:
                                },
                                {
                                  name: "Set",
                                  offset: 0x1efb6,
                                  type: "variable",
                                  dataType: "uint16", // TODO
                                  // max:
                                },
                                {
                                  name: "Rules",
                                  offset: 0x1efc2,
                                  type: "variable",
                                  dataType: "uint16",
                                  // max:
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
                              id: "friendCardName-%index%",
                              name: "Name",
                              offset: 0x1eff4,
                              length: 0x18,
                              type: "variable",
                              dataType: "string",
                              letterDataType: "uint16",
                              zeroTerminated: true,
                            },
                            {
                              id: "friendCardMessage",
                              name: "Message",
                              offset: 0x1f00e,
                              length: 0x96,
                              type: "variable",
                              dataType: "string",
                              letterDataType: "uint16",
                              zeroTerminated: true,
                              size: "lg",
                            },
                            {
                              name: "Icon",
                              offset: 0x1efe8,
                              type: "variable",
                              dataType: "uint16",
                              resource: "icons",
                              size: "lg",
                              autocomplete: true,
                            },
                          ],
                        },
                        {
                          type: "section",
                          flex: true,
                          items: [
                            {
                              name: "Play Time",
                              type: "group",
                              mode: "time",
                              items: [
                                {
                                  offset: 0x1efe4,
                                  type: "variable",
                                  dataType: "uint32",
                                  operations: [
                                    {
                                      convert: {
                                        from: "seconds",
                                        to: "hours",
                                      },
                                    },
                                  ],
                                  max: 999,
                                },
                                {
                                  offset: 0x1efe4,
                                  type: "variable",
                                  dataType: "uint32",
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
                                  offset: 0x1efe4,
                                  type: "variable",
                                  dataType: "uint32",
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
                              name: "ID",
                              offset: 0x1efea,
                              type: "variable",
                              dataType: "uint8",
                              resource: "friendCardIds",
                            },
                            {
                              name: "Bitflags",
                              type: "bitflags",
                              flags: [
                                { offset: 0x1efeb, bit: 0, label: "Card Data Locked" }, // prettier-ignore
                                { offset: 0x1efeb, bit: 1, label: "Color related", hidden: true }, // prettier-ignore
                                { offset: 0x1efeb, bit: 2, label: "???", hidden: true }, // prettier-ignore
                                { offset: 0x1efeb, bit: 3, label: "Special" }, // prettier-ignore
                                { offset: 0x1efeb, bit: 4, label: "New" }, // prettier-ignore
                                { offset: 0x1efeb, bit: 5, label: "Updated" }, // prettier-ignore
                                { offset: 0x1efeb, bit: 6, label: "???", hidden: true }, // prettier-ignore
                                { offset: 0x1efeb, bit: 7, label: "???", hidden: true }, // prettier-ignore
                              ],
                            },
                            {
                              name: "Titles",
                              type: "bitflags",
                              flags: [
                                { offset: 0x1EFF0, bit: 0, label: "Connecting Hope" }, // prettier-ignore
                                { offset: 0x1EFF0, bit: 1, label: "Bringer of the End" }, // prettier-ignore
                                { offset: 0x1EFF0, bit: 2, label: "Vested Researcher" }, // prettier-ignore
                                { offset: 0x1EFF0, bit: 3, label: "Dungeon Expert" }, // prettier-ignore
                                { offset: 0x1EFF0, bit: 4, label: "The Great Conqueror" }, // prettier-ignore
                                { offset: 0x1EFF0, bit: 5, label: "Reincarnation of Ares" }, // prettier-ignore
                                { offset: 0x1EFF0, bit: 6, label: "Arcade Champ" }, // prettier-ignore
                                { offset: 0x1EFF0, bit: 7, label: "Speedster" }, // prettier-ignore
                                { offset: 0x1EFF1, bit: 0, label: "True Explorer" }, // prettier-ignore
                                { offset: 0x1EFF1, bit: 1, label: "Herculean Underdog" }, // prettier-ignore
                                { offset: 0x1EFF1, bit: 2, label: "White Belt" }, // prettier-ignore
                                { offset: 0x1EFF1, bit: 3, label: "Brown Belt" }, // prettier-ignore
                                { offset: 0x1EFF1, bit: 4, label: "Black Belt" }, // prettier-ignore
                                { offset: 0x1EFF1, bit: 5, label: "United We Stand" }, // prettier-ignore
                                { offset: 0x1EFF1, bit: 6, label: "Trend Setter" }, // prettier-ignore
                                { offset: 0x1EFF1, bit: 7, label: "Items Virtuoso" }, // prettier-ignore
                                { offset: 0x1EFF2, bit: 0, label: "Summon Master" }, // prettier-ignore
                                { offset: 0x1EFF2, bit: 1, label: "Lord of Conquest" }, // prettier-ignore
                                { offset: 0x1EFF2, bit: 2, label: "Portrait Collector" }, // prettier-ignore
                                { offset: 0x1EFF2, bit: 3, label: "Formidable Ghouls" }, // prettier-ignore
                                { offset: 0x1EFF2, bit: 4, label: "???", hidden: true }, // prettier-ignore
                                { offset: 0x1EFF2, bit: 5, label: "???", hidden: true }, // prettier-ignore
                                { offset: 0x1EFF2, bit: 6, label: "???", hidden: true }, // prettier-ignore
                                { offset: 0x1EFF2, bit: 7, label: "???", hidden: true }, // prettier-ignore
                              ],
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
        },
        {
          name: "Options",
          items: [
            {
              type: "tabs",
              items: [
                {
                  name: "General",
                  items: [
                    {
                      type: "section",
                      flex: true,
                      items: [
                        {
                          name: "Battle Style",
                          offset: 0x1cf0c,
                          type: "variable",
                          dataType: "uint8",
                          resource: "battleStyles",
                        },
                        {
                          name: "Story Mode CPU Strength",
                          offset: 0x1cf14,
                          type: "variable",
                          dataType: "uint8",
                          resource: "cpuStrengths",
                        },
                      ],
                    },
                    {
                      type: "section",
                      flex: true,
                      items: [
                        {
                          name: "Lock-on at Battle Start",
                          offset: 0x1cf05,
                          type: "variable",
                          dataType: "uint8",
                          resource: "optionBoolean",
                        },
                        {
                          name: "Quickmove Indicator",
                          offset: 0x1cf02,
                          type: "variable",
                          dataType: "uint8",
                          resource: "optionBoolean",
                        },
                        {
                          name: "Lock-on Cursor Display",
                          offset: 0x1cf03,
                          type: "variable",
                          dataType: "uint8",
                          resource: "optionBoolean",
                        },
                        {
                          name: "Target Indicator",
                          offset: 0x1cf04,
                          type: "variable",
                          dataType: "uint8",
                          resource: "optionBoolean",
                        },
                      ],
                    },
                    {
                      type: "section",
                      flex: true,
                      items: [
                        {
                          name: "Character Control",
                          offset: 0x1cf00,
                          type: "variable",
                          dataType: "uint8",
                          resource: "characterControls",
                        },
                        {
                          name: "Camera: Vertical Control",
                          offset: 0x1cefd,
                          type: "variable",
                          dataType: "uint8",
                          resource: "cameraControls",
                        },
                        {
                          name: "Camera: Horizontal Control",
                          offset: 0x1cefe,
                          type: "variable",
                          dataType: "uint8",
                          resource: "cameraControls",
                        },
                        {
                          name: "Camera Auto-Follow",
                          offset: 0x1ceff,
                          type: "variable",
                          dataType: "uint8",
                          resource: "optionBooleanReversed",
                        },
                        {
                          name: "Camera Sensitivity",
                          offset: 0x1cf01,
                          type: "variable",
                          dataType: "uint8",
                          resource: "cameraSensitivities",
                        },
                        {
                          name: "Camera Angle Lock",
                          offset: 0x1cf16,
                          type: "variable",
                          dataType: "uint8",
                          resource: "optionBooleanReversed",
                        },
                      ],
                    },
                    {
                      type: "section",
                      flex: true,
                      items: [
                        {
                          name: "BGM",
                          offset: 0x1cf08,
                          type: "variable",
                          dataType: "uint8",
                          resource: "optionBoolean",
                        },
                        {
                          name: "SFX",
                          offset: 0x1cf09,
                          type: "variable",
                          dataType: "uint8",
                          resource: "optionBoolean",
                        },
                        {
                          name: "Voice",
                          offset: 0x1cf0a,
                          type: "variable",
                          dataType: "uint8",
                          resource: "optionBoolean",
                        },
                      ],
                    },
                    {
                      type: "section",
                      flex: true,
                      items: [
                        {
                          name: "Subtitles",
                          offset: 0x1cf0b,
                          type: "variable",
                          dataType: "uint8",
                          resource: "optionBoolean",
                        },
                        {
                          name: "Battle Voice Subtitles",
                          offset: 0x1cf12,
                          type: "variable",
                          dataType: "uint8",
                          resource: "optionBooleanReversed",
                        },
                        {
                          name: "Subtitle Language",
                          offset: 0x1cf15,
                          type: "variable",
                          dataType: "uint8",
                          resource: "subtitleLanguages",
                          hidden: [false, true, false],
                        },
                      ],
                    },
                    {
                      type: "section",
                      flex: true,
                      items: [
                        {
                          name: "Movie at Battle Start",
                          offset: 0x1cf06,
                          type: "variable",
                          dataType: "uint8",
                          resource: "movieLengths",
                        },
                        {
                          name: "Battle Information",
                          offset: 0x1cf07,
                          type: "variable",
                          dataType: "uint8",
                          resource: "battleInformations",
                        },
                        {
                          name: "Skip All Cutscenes",
                          offset: 0x1cf0d,
                          type: "variable",
                          dataType: "uint8",
                          resource: "optionBoolean",
                        },
                      ],
                    },
                    {
                      type: "section",
                      flex: true,
                      items: [
                        {
                          name: "Party Plan Notification",
                          offset: 0x1cf11,
                          type: "variable",
                          dataType: "uint8",
                          resource: "optionBooleanReversed",
                        },
                        {
                          name: "Save Battle Replays",
                          offset: 0x1cf0e,
                          type: "variable",
                          dataType: "uint8",
                          resource: "optionBoolean",
                        },
                      ],
                    },
                  ],
                },
                {
                  name: "Battle Tutorials",
                  flex: true,
                  items: [
                    {
                      type: "bitflags",
                      flags: [
                        { offset: 0x1d0c9, bit: 6, label: "1: Bravery Attacks and HP Attacks" }, // prettier-ignore
                        { offset: 0x1d0c9, bit: 7, label: "2: EX Mode and EX Burst" }, // prettier-ignore
                        { offset: 0x1d0ca, bit: 0, label: "3: Bravery Assist Attack" }, // prettier-ignore
                        { offset: 0x1d0ca, bit: 1, label: "4: HP Assist Attack" }, // prettier-ignore
                        { offset: 0x1d0cb, bit: 2, label: "5: Quickmove" }, // prettier-ignore
                        { offset: 0x1d0cd, bit: 3, label: '6: The Ability "Free Air Dash"' }, // prettier-ignore
                        { offset: 0x1d0ca, bit: 6, label: "7: Evasion" }, // prettier-ignore
                        { offset: 0x1d0cb, bit: 7, label: "8: Blocking" }, // prettier-ignore
                        { offset: 0x1d0cb, bit: 0, label: "9: Gaining EXP" }, // prettier-ignore
                        { offset: 0x1d0ca, bit: 5, label: "10: Using Bravery Attacks" }, // prettier-ignore
                        { offset: 0x1d0ca, bit: 7, label: "11: Wall Rush Damage" }, // prettier-ignore
                        { offset: 0x1d0cb, bit: 4, label: "12: Switching Lock-On Targets" }, // prettier-ignore
                        { offset: 0x1d0cb, bit: 1, label: "13: The Joy of EX" }, // prettier-ignore
                        { offset: 0x1d0cb, bit: 6, label: "14: How Bravery Affects HP Attacks" }, // prettier-ignore
                        { offset: 0x1d0cc, bit: 2, label: "15: Booster Accessories" }, // prettier-ignore
                        { offset: 0x1d0cb, bit: 5, label: "16: Chase Sequences" }, // prettier-ignore
                        { offset: 0x1d0cc, bit: 5, label: "17: Bravery Attack Critical Hits" }, // prettier-ignore
                        { offset: 0x1d0cc, bit: 4, label: "18: EX Revenge" }, // prettier-ignore
                        { offset: 0x1d0cc, bit: 0, label: "19: Defending Against EX Bursts" }, // prettier-ignore
                        { offset: 0x1d0cc, bit: 1, label: "20: Assist Charge and Assist Lock" }, // prettier-ignore
                        { offset: 0x1d0cc, bit: 3, label: "21: Combo with Assist Attacks" }, // prettier-ignore
                        { offset: 0x1d0cd, bit: 1, label: "22: Assist Change" }, // prettier-ignore
                        { offset: 0x1d0cd, bit: 2, label: "23: Assist Change Types" }, // prettier-ignore
                        { offset: 0x1d0ce, bit: 0, label: "24: Banish Traps" }, // prettier-ignore
                      ],
                    },
                    {
                      type: "bitflags",
                      flags: [
                        { offset: 0x1d0cd, bit: 0, label: "25: Block Break" }, // prettier-ignore
                        { offset: 0x1d0cc, bit: 7, label: "26: EX Break & Assist Break" }, // prettier-ignore
                        { offset: 0x1d0cd, bit: 4, label: "27: Battle Information" }, // prettier-ignore
                        { offset: 0x1d0ca, bit: 2, label: "28: Basics of RPG Mode Battles" }, // prettier-ignore
                        { offset: 0x1d0ca, bit: 3, label: "29: RPG Mode Battles: Moving & EX" }, // prettier-ignore
                        { offset: 0x1d0ca, bit: 4, label: "30: RPG Mode Battles: Defending" }, // prettier-ignore
                        { offset: 0x1d0cd, bit: 5, label: "31: Stage Bravery" }, // prettier-ignore
                        { offset: 0x1d0cd, bit: 6, label: "33: Chaos Judgment" }, // prettier-ignore
                        { offset: 0x1d0cd, bit: 7, label: "32: Cosmos Judgment" }, // prettier-ignore
                        { offset: 0x1d0ce, bit: 1, label: "34: Stage Info: Old Chaos Shrine" }, // prettier-ignore
                        { offset: 0x1d0ce, bit: 2, label: "35: Stage Info: Pandaemonium" }, // prettier-ignore
                        { offset: 0x1d0ce, bit: 3, label: "36: Stage Info: World of Darkness" }, // prettier-ignore
                        { offset: 0x1d0ce, bit: 4, label: "37: Stage Info: Lunar Subterrane" }, // prettier-ignore
                        { offset: 0x1d0ce, bit: 5, label: "38: Stage Info: The Rift" }, // prettier-ignore
                        { offset: 0x1d0ce, bit: 6, label: "39: Stage Info: Kefka's Tower" }, // prettier-ignore
                        { offset: 0x1d0ce, bit: 7, label: "40: Stage Info: Planet's Core" }, // prettier-ignore
                        { offset: 0x1d0cf, bit: 0, label: "41: Stage Info: Ultimecia's Castle" }, // prettier-ignore
                        { offset: 0x1d0cf, bit: 1, label: "42: Stage Info: Crystal World" }, // prettier-ignore
                        { offset: 0x1d0cf, bit: 2, label: "43: Stage Info: Dream's End" }, // prettier-ignore
                        { offset: 0x1d0cf, bit: 3, label: "44: Stage Info: Order's Sanctuary" }, // prettier-ignore
                        { offset: 0x1d0cf, bit: 4, label: "45: Stage Info: Edge of Madness" }, // prettier-ignore
                        { offset: 0x1d0cf, bit: 5, label: "46: Stage Info: Empyreal Paradox" }, // prettier-ignore
                        { offset: 0x1d0cf, bit: 6, label: "47: Stage Info: Sky Fortress Bahamut" }, // prettier-ignore
                        { offset: 0x1d0cf, bit: 7, label: "48: Stage Info: Orphan's Cradle" }, // prettier-ignore
                      ],
                    },
                  ],
                },
              ],
            },
          ],
        },
        {
          name: "Miscellaneous",
          hidden: true,
          items: [
            {
              type: "tabs",
              items: [
                {
                  name: "Manual",
                  flex: true,
                  items: [
                    {
                      name: "Arcade Mode",
                      type: "bitflags",
                      flags: [
                        { offset: 0x1d13b, bit: 5, label: "What Is Arcade Mode?" }, // prettier-ignore
                        { offset: 0x1d13b, bit: 6, label: "Custom & Preset Characters" }, // prettier-ignore
                        { offset: 0x1d13b, bit: 7, label: "Rewards" }, // prettier-ignore
                        { offset: 0x1d13c, bit: 0, label: "Time Attack" }, // prettier-ignore
                      ],
                    },
                    {
                      name: "Battle Tips",
                      type: "bitflags",
                      flags: [
                        { offset: 0x1d13c, bit: 7, label: "TIP 1: For Starters" }, // prettier-ignore
                        { offset: 0x1d15b, bit: 7, label: "TIP 2: Making Use of the RPG Mode" }, // prettier-ignore
                        { offset: 0x1d13d, bit: 0, label: "TIP 3: Connect with Attacks!" }, // prettier-ignore
                        { offset: 0x1d13d, bit: 1, label: "TIP 4: Work the Chase!" }, // prettier-ignore
                        { offset: 0x1d13d, bit: 2, label: "TIP 5: Dodging and Blocking" }, // prettier-ignore
                        { offset: 0x1d13d, bit: 3, label: "TIP 6: Crush Dodgers and Blockers!" }, // prettier-ignore
                        { offset: 0x1d15c, bit: 0, label: "TIP 7: RPG Mode Pointers" }, // prettier-ignore
                        { offset: 0x1d13d, bit: 4, label: "TIP 8: Getting Stronger" }, // prettier-ignore
                        { offset: 0x1d13d, bit: 5, label: "TIP 9: Revived..." }, // prettier-ignore
                        { offset: 0x1d13d, bit: 6, label: "TIP 10: Assist Attacks" }, // prettier-ignore
                        { offset: 0x1d13d, bit: 7, label: "TIP 11: When to Use Assist Attacks" }, // prettier-ignore
                        { offset: 0x1d13e, bit: 0, label: "TIP 12: Assist Gauge Stagnate!" }, // prettier-ignore
                        { offset: 0x1d13e, bit: 1, label: "TIP 13: Tried Assist Lock?" }, // prettier-ignore
                        { offset: 0x1d15c, bit: 1, label: "TIP 14: EX and Assist Are Opposites!?" }, // prettier-ignore
                        { offset: 0x1d13e, bit: 2, label: "TIP 15: Three Types of Breaks" }, // prettier-ignore
                        { offset: 0x1d13e, bit: 3, label: "TIP 16: EX Cores and EX Mode" }, // prettier-ignore
                        { offset: 0x1d13e, bit: 4, label: "TIP 17: EX Revenge for a Cool Scene!" }, // prettier-ignore
                        { offset: 0x1d13e, bit: 5, label: "TIP 18: Sorry! Assist Change!" }, // prettier-ignore
                        { offset: 0x1d13e, bit: 6, label: "TIP 19: Secrets of Quickmoves & Air Dashing!" }, // prettier-ignore
                        { offset: 0x1d13e, bit: 7, label: "TIP 20: Making Lemonade from Lemons" }, // prettier-ignore
                        { offset: 0x1d13f, bit: 0, label: "TIP 21: Take Advantage of Banish Traps!" }, // prettier-ignore
                        { offset: 0x1d13f, bit: 1, label: "TIP 22: The Amazing Wall Rush!" }, // prettier-ignore
                        { offset: 0x1d13f, bit: 2, label: "TIP 23: Summonstones Are Great!" }, // prettier-ignore
                        { offset: 0x1d13f, bit: 3, label: "TIP 24: Kick Butt on Chaos! (part 1)" }, // prettier-ignore
                        { offset: 0x1d13f, bit: 4, label: "TIP 25: Kick Butt on Chaos! (part 2)" }, // prettier-ignore
                        { offset: 0x1d13f, bit: 5, label: "TIP 26: Mastering Customization!" }, // prettier-ignore
                        { offset: 0x1d13f, bit: 6, label: "TIP 27: Lastly..." }, // prettier-ignore
                        { offset: 0x1d13f, bit: 7, label: "Character Info: FINAL FANTASY I" }, // prettier-ignore
                        { offset: 0x1d140, bit: 0, label: "Character Info: FINAL FANTASY II" }, // prettier-ignore
                        { offset: 0x1d140, bit: 1, label: "Character Info: FINAL FANTASY III" }, // prettier-ignore
                        { offset: 0x1d140, bit: 2, label: "Character Info: FINAL FANTASY IV" }, // prettier-ignore
                        { offset: 0x1d140, bit: 3, label: "Character Info: FINAL FANTASY V" }, // prettier-ignore
                        { offset: 0x1d140, bit: 4, label: "Character Info: FINAL FANTASY VI" }, // prettier-ignore
                        { offset: 0x1d140, bit: 5, label: "Character Info: FINAL FANTASY VII" }, // prettier-ignore
                        { offset: 0x1d140, bit: 6, label: "Character Info: FINAL FANTASY VIII" }, // prettier-ignore
                        { offset: 0x1d140, bit: 7, label: "Character Info: FINAL FANTASY IX" }, // prettier-ignore
                        { offset: 0x1d141, bit: 0, label: "Character Info: FINAL FANTASY X" }, // prettier-ignore
                        { offset: 0x1d141, bit: 1, label: "Character Info: FINAL FANTASY XI" }, // prettier-ignore
                        { offset: 0x1d141, bit: 3, label: "Character Info: FINAL FANTASY XII (part 1)" }, // prettier-ignore
                        { offset: 0x1d141, bit: 4, label: "Character Info: FINAL FANTASY XII (part 2)" }, // prettier-ignore
                        { offset: 0x1d141, bit: 5, label: "Character Info: FINAL FANTASY XIII" }, // prettier-ignore
                        { offset: 0x1d141, bit: 2, label: "Character Info: Secrets (part 1)" }, // prettier-ignore
                        { offset: 0x1d141, bit: 6, label: "Character Info: Secrets (part 2)" }, // prettier-ignore
                        { offset: 0x1d141, bit: 7, label: "Character Info: Secrets (part 3)" }, // prettier-ignore
                      ],
                    },
                    {
                      name: "Calendar",
                      type: "bitflags",
                      flags: [
                        { offset: 0x1d143, bit: 1, label: "What Is the Calendar?" }, // prettier-ignore
                        { offset: 0x1d143, bit: 2, label: "Gimme More Bonuses!" }, // prettier-ignore
                      ],
                    },
                    {
                      name: "Battle Setup",
                      type: "bitflags",
                      flags: [
                        { offset: 0x1d143, bit: 6, label: "About Your Opponents" }, // prettier-ignore
                        { offset: 0x1d143, bit: 7, label: "Starting a Quick Battle" }, // prettier-ignore
                        { offset: 0x1d144, bit: 0, label: "Battling in Communications Mode" }, // prettier-ignore
                        { offset: 0x1d144, bit: 1, label: "Party Battles" }, // prettier-ignore
                        { offset: 0x1d144, bit: 2, label: "Job Bonuses" }, // prettier-ignore
                        { offset: 0x1d15c, bit: 2, label: "Job Icons" }, // prettier-ignore
                        { offset: 0x1d144, bit: 3, label: "Bravery Bonuses" }, // prettier-ignore
                        { offset: 0x1d144, bit: 4, label: "The Judgment System" }, // prettier-ignore
                      ],
                    },
                    {
                      name: "Museum",
                      type: "bitflags",
                      flags: [
                        { offset: 0x1d145, bit: 0, label: "Museum" }, // prettier-ignore
                        { offset: 0x1d145, bit: 1, label: "Character Viewer" }, // prettier-ignore
                      ],
                    },
                    {
                      name: "Creation",
                      type: "bitflags",
                      flags: [
                        { offset: 0x1d145, bit: 5, label: "Creation" }, // prettier-ignore
                        { offset: 0x1d145, bit: 6, label: "Original Quest: Play" }, // prettier-ignore
                        { offset: 0x1d145, bit: 7, label: "Original Quest: Settings" }, // prettier-ignore
                        { offset: 0x1d146, bit: 0, label: "Original Quest: Creating an Event" }, // prettier-ignore
                        { offset: 0x1d146, bit: 1, label: "Original Quest: Battle Settings" }, // prettier-ignore
                        { offset: 0x1d146, bit: 2, label: "Original Quest: Special Victory Conditions" }, // prettier-ignore
                        { offset: 0x1d146, bit: 3, label: "Original Quest: Getting and Uploading Quests" }, // prettier-ignore
                        { offset: 0x1d146, bit: 4, label: "Battle Replay: Recording and Playback" }, // prettier-ignore
                        { offset: 0x1d146, bit: 5, label: "Battle Replay: Exporting Screenshots" }, // prettier-ignore
                        { offset: 0x1d146, bit: 6, label: "Battle Replay: Exporting Movies" }, // prettier-ignore
                        { offset: 0x1d146, bit: 7, label: "Battle Replay: Editing Basics" }, // prettier-ignore
                        { offset: 0x1d147, bit: 0, label: "Battle Replay: Editing Configuration" }, // prettier-ignore
                        { offset: 0x1d147, bit: 1, label: "Battle Replay: Editing Controls" }, // prettier-ignore
                        { offset: 0x1d147, bit: 2, label: "Battle Replay: Editing Camera Mode" }, // prettier-ignore
                      ],
                    },
                    {
                      name: "Labyrinth",
                      type: "bitflags",
                      flags: [
                        { offset: 0x1d147, bit: 4, label: "What Is the Labyrinth" }, // prettier-ignore
                        { offset: 0x1d147, bit: 5, label: "Basic Flow" }, // prettier-ignore
                        { offset: 0x1d147, bit: 6, label: "Battles & Party" }, // prettier-ignore
                        { offset: 0x1d147, bit: 7, label: "Medals & Treasure Chests" }, // prettier-ignore
                        { offset: 0x1d148, bit: 0, label: "Doors, Goals, and Tents" }, // prettier-ignore
                        { offset: 0x1d148, bit: 1, label: "Card Luck & Level Adjustment" }, // prettier-ignore
                        { offset: 0x1d148, bit: 2, label: "Job Cards (One-Time use)" }, // prettier-ignore
                        { offset: 0x1d148, bit: 3, label: "Job Cards (Ongoing Effects)" }, // prettier-ignore
                        { offset: 0x1d148, bit: 4, label: "Job Cards (Status Ailments)" }, // prettier-ignore
                      ],
                    },
                    {
                      name: "Customization Menu",
                      type: "bitflags",
                      flags: [
                        { offset: 0x1d148, bit: 6, label: "Customization Menu: Introduction" }, // prettier-ignore
                        { offset: 0x1d148, bit: 7, label: "Viewing Your Stats" }, // prettier-ignore
                        { offset: 0x1d149, bit: 0, label: "Chocobos and EXP Bonuses" }, // prettier-ignore
                        { offset: 0x1d149, bit: 1, label: "Chocobos and Play Plans" }, // prettier-ignore
                        { offset: 0x1d149, bit: 2, label: "Chocobos: When Happy" }, // prettier-ignore
                        { offset: 0x1d149, bit: 3, label: "Chocobos: When Noisy" }, // prettier-ignore
                        { offset: 0x1d149, bit: 4, label: "Equiping Abilities" }, // prettier-ignore
                        { offset: 0x1d149, bit: 5, label: "Equipping Items" }, // prettier-ignore
                        { offset: 0x1d149, bit: 6, label: "Equipping Accessories" }, // prettier-ignore
                        { offset: 0x1d149, bit: 7, label: "Equipping Summons" }, // prettier-ignore
                        { offset: 0x1d14a, bit: 0, label: "Battlegen" }, // prettier-ignore
                        { offset: 0x1d14a, bit: 1, label: "Accomplishments" }, // prettier-ignore
                        { offset: 0x1d14a, bit: 2, label: "Shops" }, // prettier-ignore
                      ],
                    },
                    {
                      name: "Abilities",
                      type: "bitflags",
                      flags: [
                        { offset: 0x1d14a, bit: 5, label: "Abilities: Basics" }, // prettier-ignore
                        { offset: 0x1d14a, bit: 6, label: "Offensive Abilities: Ground" }, // prettier-ignore
                        { offset: 0x1d14a, bit: 7, label: "Offensive Abilities: Midair" }, // prettier-ignore
                        { offset: 0x1d14b, bit: 0, label: "Basic Abilities" }, // prettier-ignore
                        { offset: 0x1d14b, bit: 1, label: "About CP" }, // prettier-ignore
                        { offset: 0x1d14b, bit: 2, label: "Mastering Abilities" }, // prettier-ignore
                        { offset: 0x1d14b, bit: 3, label: "Branching Abilities" }, // prettier-ignore
                        { offset: 0x1d14b, bit: 4, label: "About the Command Chart" }, // prettier-ignore
                        { offset: 0x1d14b, bit: 5, label: "Command Chart Icons" }, // prettier-ignore
                      ],
                    },
                    {
                      name: "Equipment",
                      type: "bitflags",
                      flags: [
                        { offset: 0x1d14b, bit: 7, label: "Item Basics" }, // prettier-ignore
                        { offset: 0x1d14c, bit: 0, label: "Restriction by Category" }, // prettier-ignore
                        { offset: 0x1d14c, bit: 1, label: "Restriction by Level" }, // prettier-ignore
                        { offset: 0x1d14c, bit: 2, label: "Exclusive Equipment" }, // prettier-ignore
                        { offset: 0x1d14c, bit: 3, label: "Special Effects" }, // prettier-ignore
                      ],
                    },
                    {
                      name: "Accessories",
                      type: "bitflags",
                      flags: [
                        { offset: 0x1d14d, bit: 1, label: "Accessory Basics" }, // prettier-ignore
                        { offset: 0x1d14d, bit: 2, label: "Categories (Booster & Basic)" }, // prettier-ignore
                        { offset: 0x1d14d, bit: 3, label: "Trade Accessories and Slots" }, // prettier-ignore
                        { offset: 0x1d14d, bit: 4, label: "Equipment Restrictions and Conditions" }, // prettier-ignore
                        { offset: 0x1d14d, bit: 5, label: "Breakable Accessories and Sorting" }, // prettier-ignore
                        { offset: 0x1d14d, bit: 6, label: "Special Effects List (1)" }, // prettier-ignore
                        { offset: 0x1d14d, bit: 7, label: "Special Effects List (2)" }, // prettier-ignore
                        { offset: 0x1d14e, bit: 0, label: "Special Effects List (3)" }, // prettier-ignore
                        { offset: 0x1d14e, bit: 1, label: "Special Effects List (4)" }, // prettier-ignore
                      ],
                    },
                    {
                      name: "Summons",
                      type: "bitflags",
                      flags: [
                        { offset: 0x1d14e, bit: 3, label: "Summonstone Basics" }, // prettier-ignore
                        { offset: 0x1d14e, bit: 4, label: "Summonstone Icons and Activation" }, // prettier-ignore
                        { offset: 0x1d14e, bit: 5, label: "Usage and Charging" }, // prettier-ignore
                        { offset: 0x1d14e, bit: 6, label: "Reserving Summons" }, // prettier-ignore
                      ],
                    },
                    {
                      name: "Assists",
                      type: "bitflags",
                      flags: [
                        { offset: 0x1d14f, bit: 0, label: "What Are Assists?" }, // prettier-ignore
                        { offset: 0x1d14f, bit: 1, label: "Where They Appear" }, // prettier-ignore
                        { offset: 0x1d14f, bit: 2, label: "In Story Mode" }, // prettier-ignore
                      ],
                    },
                    {
                      name: "Adjust Level",
                      type: "bitflags",
                      flags: [
                        { offset: 0x1d14f, bit: 5, label: "Adjusting Levels" }, // prettier-ignore
                        { offset: 0x1d14f, bit: 6, label: "Gaining EXP" }, // prettier-ignore
                      ],
                    },
                    {
                      name: "Accomplishments",
                      type: "bitflags",
                      flags: [
                        { offset: 0x1d150, bit: 2, label: "Accomplishment Fundamentals" }, // prettier-ignore
                        { offset: 0x1d150, bit: 3, label: "Categories and Progress" }, // prettier-ignore
                        { offset: 0x1d150, bit: 4, label: "Unlocking Accomplishments" }, // prettier-ignore
                        { offset: 0x1d150, bit: 5, label: "Secret Accomplishments" }, // prettier-ignore
                      ],
                    },
                    {
                      name: "Battlegen",
                      type: "bitflags",
                      flags: [
                        { offset: 0x1d150, bit: 7, label: "Battlegen Fundamentals" }, // prettier-ignore
                        { offset: 0x1d151, bit: 0, label: "What Is Battlegen?" }, // prettier-ignore
                        { offset: 0x1d151, bit: 1, label: "The Battlegen List" }, // prettier-ignore
                        { offset: 0x1d151, bit: 2, label: "About the Enemy Info Screen" }, // prettier-ignore
                        { offset: 0x1d151, bit: 3, label: "How to Boost Your Chances of Battlegen" }, // prettier-ignore
                        { offset: 0x1d151, bit: 4, label: "Battlegen Online" }, // prettier-ignore
                      ],
                    },
                    {
                      name: "Communications Mode",
                      type: "bitflags",
                      flags: [
                        { offset: 0x1d152, bit: 1, label: "Wireless Battles" }, // prettier-ignore
                        { offset: 0x1d152, bit: 2, label: "Group Battles" }, // prettier-ignore
                        { offset: 0x1d152, bit: 3, label: "Group Battle Precautions" }, // prettier-ignore
                        { offset: 0x1d152, bit: 4, label: "About Friend Cards" }, // prettier-ignore
                        { offset: 0x1d152, bit: 5, label: "About Trade Mode" }, // prettier-ignore
                        { offset: 0x1d152, bit: 6, label: "Importing and Exporting" }, // prettier-ignore
                      ],
                    },
                    {
                      name: "Artifacts",
                      type: "bitflags",
                      flags: [
                        { offset: 0x1d153, bit: 3, label: "Artifacts" }, // prettier-ignore
                        { offset: 0x1d153, bit: 4, label: "Renaming and Artifact History" }, // prettier-ignore
                        { offset: 0x1d153, bit: 5, label: "Artifact Attributes" }, // prettier-ignore
                      ],
                    },
                    {
                      name: "Data Config",
                      type: "bitflags",
                      flags: [
                        { offset: 0x1d154, bit: 0, label: "Play Plan and Bonus Day" }, // prettier-ignore
                        { offset: 0x1d154, bit: 1, label: "Party Basics" }, // prettier-ignore
                        { offset: 0x1d154, bit: 2, label: "Party: Job Bonuses" }, // prettier-ignore
                        { offset: 0x1d15c, bit: 3, label: "Party: Job Icons" }, // prettier-ignore
                        { offset: 0x1d154, bit: 3, label: "Friend Card Basics" }, // prettier-ignore
                        { offset: 0x1d154, bit: 4, label: "Friend Cards: Ghosts" }, // prettier-ignore
                        { offset: 0x1d154, bit: 5, label: "Original Rule Basics" }, // prettier-ignore
                        { offset: 0x1d154, bit: 6, label: "Configuring the Original Rules" }, // prettier-ignore
                      ],
                    },
                    {
                      name: "Gateways",
                      type: "bitflags",
                      flags: [
                        { offset: 0x1d155, bit: 2, label: "About Saving" }, // prettier-ignore
                        { offset: 0x1d155, bit: 3, label: "Progressing Through a Gateway" }, // prettier-ignore
                        { offset: 0x1d155, bit: 4, label: "Chains" }, // prettier-ignore
                        { offset: 0x1d155, bit: 5, label: "Let's Use Some Skills!" }, // prettier-ignore
                        { offset: 0x1d155, bit: 6, label: "Save Those KP!" }, // prettier-ignore
                        { offset: 0x1d155, bit: 7, label: "When in a Party + Types of Party Battles" }, // prettier-ignore
                        { offset: 0x1d156, bit: 0, label: "Use Those Emblems!" }, // prettier-ignore
                        { offset: 0x1d156, bit: 1, label: "Can't Change Sets or Levels?" }, // prettier-ignore
                        { offset: 0x1d156, bit: 2, label: "Battle Symbols" }, // prettier-ignore
                        { offset: 0x1d156, bit: 3, label: "Skills" }, // prettier-ignore
                      ],
                    },
                    {
                      name: "Shop",
                      type: "bitflags",
                      flags: [
                        { offset: 0x1d156, bit: 4, label: "Buying and Selling Items" }, // prettier-ignore
                        { offset: 0x1d156, bit: 5, label: "Trading" }, // prettier-ignore
                        { offset: 0x1d156, bit: 6, label: 'The "Etc." Category' }, // prettier-ignore
                        { offset: 0x1d156, bit: 7, label: "Stocking Items" }, // prettier-ignore
                      ],
                    },
                    {
                      name: "Start Menu",
                      type: "bitflags",
                      flags: [
                        { offset: 0x1d157, bit: 1, label: "Welcome to DISSIDIA 012 FINAL FANTASY!" }, // prettier-ignore
                        { offset: 0x1d157, bit: 2, label: "Converting Save Data" }, // prettier-ignore
                        { offset: 0x1d157, bit: 3, label: "PP Catalog Unlocked!" }, // prettier-ignore
                        { offset: 0x1d157, bit: 4, label: "Modes Unlocked!" }, // prettier-ignore
                        { offset: 0x1d157, bit: 5, label: "New Inventory!" }, // prettier-ignore
                        { offset: 0x1d157, bit: 6, label: "You Got an Artifact!" }, // prettier-ignore
                        { offset: 0x1d15a, bit: 7, label: "For the Hardened Adventurer" }, // prettier-ignore
                      ],
                    },
                    {
                      name: "Story Mode",
                      type: "bitflags",
                      flags: [
                        { offset: 0x1d158, bit: 3, label: "What is Story Mode?" }, // prettier-ignore
                        { offset: 0x1d158, bit: 4, label: "Difficulty Settings" }, // prettier-ignore
                        { offset: 0x1d158, bit: 6, label: "Reports" }, // prettier-ignore
                        { offset: 0x1d159, bit: 0, label: "An Untold Tale" }, // prettier-ignore
                      ],
                    },
                    {
                      name: "World Map",
                      type: "bitflags",
                      flags: [
                        { offset: 0x1d159, bit: 5, label: "The Basics" }, // prettier-ignore
                        { offset: 0x1d159, bit: 6, label: "Saves" }, // prettier-ignore
                        { offset: 0x1d159, bit: 7, label: "Light Orbs (Powers of the Dead)" }, // prettier-ignore
                        { offset: 0x1d15a, bit: 0, label: "Battles" }, // prettier-ignore
                        { offset: 0x1d15a, bit: 1, label: "Moogle Shops" }, // prettier-ignore
                        { offset: 0x1d15a, bit: 2, label: "Bonus Lines" }, // prettier-ignore
                        { offset: 0x1d15a, bit: 3, label: "Teleport Stones" }, // prettier-ignore
                      ],
                    },
                    {
                      name: "Story Mode",
                      type: "bitflags",
                      flags: [
                        { offset: 0x1d15c, bit: 4, label: "Skills" }, // prettier-ignore
                        { offset: 0x1d15c, bit: 5, label: "Moogle Shop" }, // prettier-ignore
                        { offset: 0x1d15c, bit: 6, label: "Breakable Accessories" }, // prettier-ignore
                        { offset: 0x1d15c, bit: 7, label: "Items" }, // prettier-ignore
                        { offset: 0x1d15d, bit: 0, label: "The Story Continues" }, // prettier-ignore
                        { offset: 0x1d15d, bit: 1, label: "The Thirteenth Cycle" }, // prettier-ignore
                      ],
                    },
                  ],
                },
                {
                  name: "New Flags",
                  flex: true,
                  items: [
                    {
                      name: "Characters",
                      type: "bitflags",
                      flags: [
                        { offset: 0x1d242, bit: 1, label: "Warrior of Light" }, // prettier-ignore
                        { offset: 0x1d242, bit: 2, label: "Garland" }, // prettier-ignore
                        { offset: 0x1d242, bit: 3, label: "Firion" }, // prettier-ignore
                        { offset: 0x1d242, bit: 4, label: "The Emperor" }, // prettier-ignore
                        { offset: 0x1d242, bit: 5, label: "Onion Knight" }, // prettier-ignore
                        { offset: 0x1d242, bit: 6, label: "Cloud of Darkness" }, // prettier-ignore
                        { offset: 0x1d242, bit: 7, label: "Cecil Harvey" }, // prettier-ignore
                        { offset: 0x1d243, bit: 0, label: "Golbez" }, // prettier-ignore
                        { offset: 0x1d243, bit: 1, label: "Bartz Klauser" }, // prettier-ignore
                        { offset: 0x1d243, bit: 2, label: "Exdeath" }, // prettier-ignore
                        { offset: 0x1d243, bit: 3, label: "Terra Branford" }, // prettier-ignore
                        { offset: 0x1d243, bit: 4, label: "Kefka Palazzo" }, // prettier-ignore
                        { offset: 0x1d243, bit: 5, label: "Cloud Strife" }, // prettier-ignore
                        { offset: 0x1d243, bit: 6, label: "Sephiroth" }, // prettier-ignore
                        { offset: 0x1d243, bit: 7, label: "Squall Leonhart" }, // prettier-ignore
                        { offset: 0x1d244, bit: 0, label: "Ultimecia" }, // prettier-ignore
                        { offset: 0x1d244, bit: 1, label: "Zidane Tribal" }, // prettier-ignore
                        { offset: 0x1d244, bit: 2, label: "Kuja" }, // prettier-ignore
                        { offset: 0x1d244, bit: 3, label: "Tidus" }, // prettier-ignore
                        { offset: 0x1d244, bit: 4, label: "Jecht" }, // prettier-ignore
                        { offset: 0x1d244, bit: 5, label: "Shantotto" }, // prettier-ignore
                        { offset: 0x1d244, bit: 6, label: "Gabranth" }, // prettier-ignore
                        { offset: 0x1d245, bit: 0, label: "Kain Highwind" }, // prettier-ignore
                        { offset: 0x1d245, bit: 1, label: "Gilgamesh" }, // prettier-ignore
                        { offset: 0x1d245, bit: 2, label: "Tifa Lockhart" }, // prettier-ignore
                        { offset: 0x1d245, bit: 3, label: "Laguna Loire" }, // prettier-ignore
                        { offset: 0x1d245, bit: 4, label: "Yuna" }, // prettier-ignore
                        { offset: 0x1d245, bit: 5, label: "Prische" }, // prettier-ignore
                        { offset: 0x1d245, bit: 6, label: "Vaan" }, // prettier-ignore
                        { offset: 0x1d245, bit: 7, label: "Lightning" }, // prettier-ignore
                        { offset: 0x1d246, bit: 0, label: "Feral Chaos" }, // prettier-ignore
                      ],
                    },
                    {
                      name: "Character Files",
                      type: "bitflags",
                      flags: [
                        { offset: 0x1d248, bit: 3, label: "Warrior of Light" }, // prettier-ignore
                        { offset: 0x1d248, bit: 4, label: "Garland" }, // prettier-ignore
                        { offset: 0x1d248, bit: 5, label: "Firion" }, // prettier-ignore
                        { offset: 0x1d248, bit: 6, label: "The Emperor" }, // prettier-ignore
                        { offset: 0x1d248, bit: 7, label: "Onion Knight" }, // prettier-ignore
                        { offset: 0x1d249, bit: 0, label: "Cloud of Darkness" }, // prettier-ignore
                        { offset: 0x1d249, bit: 1, label: "Cecil Harvey" }, // prettier-ignore
                        { offset: 0x1d249, bit: 2, label: "Golbez" }, // prettier-ignore
                        { offset: 0x1d249, bit: 3, label: "Bartz Klauser" }, // prettier-ignore
                        { offset: 0x1d249, bit: 4, label: "Exdeath" }, // prettier-ignore
                        { offset: 0x1d249, bit: 5, label: "Terra Branford" }, // prettier-ignore
                        { offset: 0x1d249, bit: 6, label: "Kefka Palazzo" }, // prettier-ignore
                        { offset: 0x1d249, bit: 7, label: "Cloud Strife" }, // prettier-ignore
                        { offset: 0x1d24a, bit: 0, label: "Sephiroth" }, // prettier-ignore
                        { offset: 0x1d24a, bit: 1, label: "Squall Leonhart" }, // prettier-ignore
                        { offset: 0x1d24a, bit: 2, label: "Ultimecia" }, // prettier-ignore
                        { offset: 0x1d24a, bit: 3, label: "Zidane Tribal" }, // prettier-ignore
                        { offset: 0x1d24a, bit: 4, label: "Kuja" }, // prettier-ignore
                        { offset: 0x1d24a, bit: 5, label: "Tidus" }, // prettier-ignore
                        { offset: 0x1d24a, bit: 6, label: "Jecht" }, // prettier-ignore
                        { offset: 0x1d24a, bit: 7, label: "Shantotto" }, // prettier-ignore
                        { offset: 0x1d24b, bit: 0, label: "Gabranth" }, // prettier-ignore
                        { offset: 0x1d24b, bit: 1, label: "Kain Highwind" }, // prettier-ignore
                        { offset: 0x1d24b, bit: 2, label: "Gilgamesh" }, // prettier-ignore
                        { offset: 0x1d24b, bit: 3, label: "Tifa Lockhart" }, // prettier-ignore
                        { offset: 0x1d24b, bit: 4, label: "Laguna Loire" }, // prettier-ignore
                        { offset: 0x1d24b, bit: 5, label: "Yuna" }, // prettier-ignore
                        { offset: 0x1d24b, bit: 6, label: "Prische" }, // prettier-ignore
                        { offset: 0x1d24b, bit: 7, label: "Vaan" }, // prettier-ignore
                        { offset: 0x1d24c, bit: 0, label: "Lightning" }, // prettier-ignore
                        { offset: 0x1d24c, bit: 2, label: "Cosmos" }, // prettier-ignore
                        { offset: 0x1d24c, bit: 3, label: "Chaos" }, // prettier-ignore
                        { offset: 0x1d24c, bit: 4, label: "Shinryu" }, // prettier-ignore
                        { offset: 0x1d24c, bit: 5, label: "The Great Will" }, // prettier-ignore
                      ],
                    },
                    {
                      name: "Summon Compendium",
                      type: "bitflags",
                      flags: [
                        { offset: 0x1d24e, bit: 5, label: "Ifrit" }, // prettier-ignore
                        { offset: 0x1d24e, bit: 7, label: "Shiva" }, // prettier-ignore
                        { offset: 0x1d24f, bit: 1, label: "Ramuh" }, // prettier-ignore
                        { offset: 0x1d24f, bit: 3, label: "Carbuncle" }, // prettier-ignore
                        { offset: 0x1d24f, bit: 5, label: "Magic Pot" }, // prettier-ignore
                        { offset: 0x1d24f, bit: 7, label: "Demon Wall" }, // prettier-ignore
                        { offset: 0x1d250, bit: 1, label: "Magus Sisters" }, // prettier-ignore
                        { offset: 0x1d250, bit: 3, label: "Odin" }, // prettier-ignore
                        { offset: 0x1d250, bit: 5, label: "Phoenix" }, // prettier-ignore
                        { offset: 0x1d250, bit: 7, label: "Alexander" }, // prettier-ignore
                        { offset: 0x1d251, bit: 1, label: "Leviathan" }, // prettier-ignore
                        { offset: 0x1d251, bit: 3, label: "Bahamut" }, // prettier-ignore
                        { offset: 0x1d251, bit: 4, label: "Chocobo" }, // prettier-ignore
                        { offset: 0x1d251, bit: 5, label: "Moogle" }, // prettier-ignore
                        { offset: 0x1d251, bit: 6, label: "Mandragora" }, // prettier-ignore
                        { offset: 0x1d251, bit: 7, label: "Bomb" }, // prettier-ignore
                        { offset: 0x1d252, bit: 0, label: "Asura" }, // prettier-ignore
                        { offset: 0x1d252, bit: 1, label: "Titan" }, // prettier-ignore
                        { offset: 0x1d252, bit: 2, label: "Atomos" }, // prettier-ignore
                        { offset: 0x1d252, bit: 3, label: "Iron Giant" }, // prettier-ignore
                        { offset: 0x1d252, bit: 4, label: "Cactuar" }, // prettier-ignore
                        { offset: 0x1d252, bit: 5, label: "Tonberry" }, // prettier-ignore
                        { offset: 0x1d252, bit: 6, label: "Malboro" }, // prettier-ignore
                        { offset: 0x1d252, bit: 7, label: "Ultros" }, // prettier-ignore
                        { offset: 0x1d253, bit: 0, label: "Typhon" }, // prettier-ignore
                        { offset: 0x1d253, bit: 1, label: "Deathgaze" }, // prettier-ignore
                        { offset: 0x1d253, bit: 2, label: "Behemoth" }, // prettier-ignore
                        { offset: 0x1d253, bit: 3, label: "PuPu" }, // prettier-ignore
                        { offset: 0x1d253, bit: 4, label: "Lich" }, // prettier-ignore
                        { offset: 0x1d253, bit: 5, label: "Marilith" }, // prettier-ignore
                        { offset: 0x1d253, bit: 6, label: "Kraken" }, // prettier-ignore
                        { offset: 0x1d253, bit: 7, label: "Tiamat" }, // prettier-ignore
                        { offset: 0x1d254, bit: 0, label: "Scarmiglione" }, // prettier-ignore
                        { offset: 0x1d254, bit: 1, label: "Cagnazzo" }, // prettier-ignore
                        { offset: 0x1d254, bit: 2, label: "Barbariccia" }, // prettier-ignore
                        { offset: 0x1d254, bit: 3, label: "Rubicante" }, // prettier-ignore
                        { offset: 0x1d254, bit: 4, label: "Gilgamesh" }, // prettier-ignore
                        { offset: 0x1d254, bit: 5, label: "Ultima Weapon" }, // prettier-ignore
                        { offset: 0x1d254, bit: 6, label: "Omega" }, // prettier-ignore
                        { offset: 0x1d254, bit: 7, label: "Shinryu" }, // prettier-ignore
                        { offset: 0x1d255, bit: 0, label: "Land Worm" }, // prettier-ignore
                        { offset: 0x1d255, bit: 1, label: "Calcabrina" }, // prettier-ignore
                        { offset: 0x1d255, bit: 2, label: "Giant of Babil" }, // prettier-ignore
                        { offset: 0x1d255, bit: 3, label: "Syldra" }, // prettier-ignore
                        { offset: 0x1d255, bit: 4, label: "Ultima, the High Seraph" }, // prettier-ignore
                        { offset: 0x1d255, bit: 5, label: "Zalera, the Death Seraph" }, // prettier-ignore
                        { offset: 0x1d255, bit: 6, label: "Brynhildr" }, // prettier-ignore
                        { offset: 0x1d255, bit: 7, label: "Hecatoncheir" }, // prettier-ignore
                        { offset: 0x1d256, bit: 0, label: "Shinryu Verus" }, // prettier-ignore
                      ],
                    },
                    {
                      name: "Story Mode",
                      type: "bitflags",
                      flags: [
                        { offset: 0x1d0c1, bit: 0, label: "012 - Prologue" }, // prettier-ignore
                        { offset: 0x1d0c1, bit: 1, label: "012 - Chapter 1" }, // prettier-ignore
                        { offset: 0x1d0c1, bit: 2, label: "012 - Chapter 2" }, // prettier-ignore
                        { offset: 0x1d0c1, bit: 3, label: "012 - Chapter 3" }, // prettier-ignore
                        { offset: 0x1d0c1, bit: 4, label: "012 - Chapter 4" }, // prettier-ignore
                        { offset: 0x1d0c1, bit: 5, label: "012 - Chapter 5" }, // prettier-ignore
                        { offset: 0x1d0c1, bit: 6, label: "012 - Chapter 6" }, // prettier-ignore
                        { offset: 0x1d0c1, bit: 7, label: "012 - Chapter 7" }, // prettier-ignore
                        { offset: 0x1d0c2, bit: 0, label: "012 - Epilogue" }, // prettier-ignore
                        { offset: 0x1d0c2, bit: 1, label: "013 - Prologue" }, // prettier-ignore
                        { offset: 0x1d0c2, bit: 2, label: "013 - Chapter 1" }, // prettier-ignore
                        { offset: 0x1d0c2, bit: 3, label: "013 - Chapter 2" }, // prettier-ignore
                        { offset: 0x1d0c2, bit: 4, label: "013 - Chapter 3" }, // prettier-ignore
                        { offset: 0x1d0c2, bit: 5, label: "013 - Chapter 4" }, // prettier-ignore
                        { offset: 0x1d0c2, bit: 6, label: "013 - Chapter 5" }, // prettier-ignore
                        { offset: 0x1d0c2, bit: 7, label: "013 - Chapter 6" }, // prettier-ignore
                        { offset: 0x1d0c3, bit: 0, label: "013 - Chapter 7" }, // prettier-ignore
                        { offset: 0x1d0c3, bit: 1, label: "013 - Chapter 8" }, // prettier-ignore
                        { offset: 0x1d0c3, bit: 2, label: "013 - Chapter 9" }, // prettier-ignore
                        { offset: 0x1d0c3, bit: 3, label: "013 - Chapter 10" }, // prettier-ignore
                        { offset: 0x1d0c3, bit: 4, label: "013 - Epilogue" }, // prettier-ignore
                      ],
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
    accessories: "getAccessoryNames()",
    accomplishments: {
      0x0: "001 012 - Prologue",
      0x1: "002 012 - Chapter 1",
      0x2: "003 012 - Chapter 2",
      0x3: "004 012 - Chapter 3",
      0x4: "005 012 - Chapter 4",
      0x5: "006 012 - Chapter 5",
      0x6: "007 012 - Chapter 6",
      0x7: "008 012 - Chapter 7",
      0x8: "009 012 - Epilogue",
      0x9: "010 KP Baron",
      0xa: "011 KP Millionaire",
      0xb: "012 Chain Czar",
      0xc: "013 Chain Striker",
      0xd: "014 Treasure Hunter",
      0xe: "015 High Stakes",
      0xf: "016 Excavator",
      0x10: "017 013 - Prologue",
      0x11: "018 013 - Epilogue Challenger",
      0x12: "019 013 - Epilogue",
      0x13: "020 Legionnaire",
      0x14: "021 Time Keeper",
      0x15: "022 Mark of a Lady",
      0x16: "023 Ravager",
      0x17: "024 Gaia Shard",
      0x18: "025 Lufenian Chime",
      0x19: "026 The Dragon King",
      0x1a: "027 Miracle Worker",
      0x1b: "028 Bookworm",
      0x1c: "029 Arcade Rat",
      0x1d: "030 Time Attacker",
      0x1e: "031 I Love a Brawl",
      0x1f: "032 The Road to Conquest",
      0x20: "033 World Champs",
      0x21: "034 Battle 'Em All",
      0x22: "035 World Warrior",
      0x23: "036 Hard Habit to Break",
      0x24: "037 Time for Some Action",
      0x25: "038 Two Piece and a Biscuit",
      0x26: "039 The Most Valiant of All",
      0x27: "040 Test One's Mettle",
      0x28: "041 Hit Where It Hurts",
      0x29: "042 Impenetrable Defense",
      0x2a: "043 Artful Dodger",
      0x2b: "044 Core Blimey",
      0x2c: "045 Modus EX-perandi",
      0x2d: "046 Out for Revenge",
      0x2e: "047 Rejuvenation",
      0x2f: "048 Go Out With a Bang",
      0x30: "049 Road Trip",
      0x31: "050 Tag-Team",
      0x32: "051 Suckerpunch",
      0x33: "052 Bravery Bandits",
      0x34: "053 Shilly-shally",
      0x35: "054 On the Level",
      0x36: "055 Greenhorn",
      0x37: "056 Intermediary",
      0x38: "057 Virtuoso",
      0x39: "058 Item Collector",
      0x3a: "059 Goal Getter",
      0x3b: "060 Marathon",
      0x3c: "061 One for the Record Books",
      0x3d: "062 Pugilist Pointillist",
      0x3e: "063 Hope They're All Gold",
      0x3f: "064 Referee",
      0x40: "065 Taskmaster",
      0x41: "066 Magistrate",
      0x42: "067 A Fistful of Gil",
      0x43: "068 It's Got AP-peal",
      0x44: "069 Bonus Round",
      0x45: "070 PP Baron",
      0x46: "071 Master of Disguise",
      0x47: "072 Jacks of All Trades",
      0x48: "073 Loaded for Bear",
      0x49: "074 Fashion Conscious",
      0x4a: "075 A Little Help from My Friends",
      0x4b: "076 Mass Production",
      0x4c: "077 Battlegenesis Does",
      0x4d: "078 Productive Battling",
      0x4e: "079 Boosteriffic!",
      0x4f: "080 Bull in a China Shop",
      0x50: "081 Tis Better to Receive",
      0x51: "082 The Blessings of Mercantilism",
      0x52: "083 Cutting Losses",
      0x53: "084 Special Delivery",
      0x54: "085 The Daily Grind",
      0x55: "086 A Long Road",
      0x56: "087 Restocker's Paradise",
      0x57: "088 Hey, Big Spender",
      0x58: "089 Catalog Shopper",
      0x59: "090 Collect Them All!",
      0x5a: "091 Travelling Minstrel",
      0x5b: "092 Best Customer Kupo",
      0x5c: "093 Junkyard Diver",
      0x5d: "094 Queller",
      0x5e: "095 Limit Breaker",
      0x5f: "096 Praemonitus",
      0x60: "097 Magnus",
      0x61: "098 Odyssey",
      0x62: "099 Gambler",
      0x63: "100 Historian",
    },
    armgears: {
      ...armgears,
      0xffff: "-",
    },
    assists: {
      0x1: "Warrior of Light",
      0x2: "Garland",
      0x3: "Firion",
      0x4: "The Emperor",
      0x5: "Onion Knight",
      0x6: "Cloud of Darkness",
      0x7: "Cecil Harvey",
      0x8: "Golbez",
      0x9: "Bartz Klauser",
      0xa: "Exdeath",
      0xb: "Terra Branford",
      0xc: "Kefka Palazzo",
      0xd: "Cloud Strife",
      0xe: "Sephiroth",
      0xf: "Squall Leonhart",
      0x10: "Ultimecia",
      0x11: "Zidane Tribal",
      0x12: "Kuja",
      0x13: "Tidus",
      0x14: "Jecht",
      0x15: "Shantotto",
      0x16: "Gabranth",
      // 0x17: "Chaos", // Unused
      0x18: "Kain Highwind",
      0x19: "Gilgamesh",
      0x1a: "Tifa Lockhart",
      0x1b: "Laguna Loire",
      0x1c: "Yuna",
      0x1d: "Prishe",
      0x1e: "Vaan",
      0x1f: "Lightning",
      // 0x20: "Feral Chaos", // Unused
      0x21: "Aerith Gainborough",
      0xff: "-",
    },
    battleInformations: {
      0x0: "Off",
      0x1: "Beginner",
      0x2: "Normal",
    },
    battleStyles: {
      0x0: "Action-style",
      0x1: "RPG Mode",
    },
    bodywears: {
      ...bodywears,
      0xffff: "-",
    },
    cameraControls: {
      0x0: "Normal",
      0x1: "Inverse",
    },
    cameraSensitivities: {
      0x0: "Slow",
      0x1: "Normal",
      0x2: "Fast",
    },
    characterControls: {
      0x0: "Analog Stick",
      0x1: "Directional Buttons",
    },
    characters: {
      0x0: "-",
      0x1: "Warrior of Light",
      0x2: "Garland",
      0x3: "Firion",
      0x4: "The Emperor",
      0x5: "Onion Knight",
      0x6: "Cloud of Darkness",
      0x7: "Cecil Harvey",
      0x8: "Golbez",
      0x9: "Bartz Klauser",
      0xa: "Exdeath",
      0xb: "Terra Branford",
      0xc: "Kefka Palazzo",
      0xd: "Cloud Strife",
      0xe: "Sephiroth",
      0xf: "Squall Leonhart",
      0x10: "Ultimecia",
      0x11: "Zidane Tribal",
      0x12: "Kuja",
      0x13: "Tidus",
      0x14: "Jecht",
      0x15: "Shantotto",
      0x16: "Gabranth",
      // 0x17: "Chaos", // Unused
      0x18: "Kain Highwind",
      0x19: "Gilgamesh",
      0x1a: "Tifa Lockhart",
      0x1b: "Laguna Loire",
      0x1c: "Yuna",
      0x1d: "Prishe",
      0x1e: "Vaan",
      0x1f: "Lightning",
      0x20: "Feral Chaos",
    },
    charactersParty: {
      0x0: "Warrior of Light",
      0x1: "Garland",
      0x2: "Firion",
      0x3: "The Emperor",
      0x4: "Onion Knight",
      0x5: "Cloud of Darkness",
      0x6: "Cecil Harvey",
      0x7: "Golbez",
      0x8: "Bartz Klauser",
      0x9: "Exdeath",
      0xa: "Terra Branford",
      0xb: "Kefka Palazzo",
      0xc: "Cloud Strife",
      0xd: "Sephiroth",
      0xe: "Squall Leonhart",
      0xf: "Ultimecia",
      0x10: "Zidane Tribal",
      0x11: "Kuja",
      0x12: "Tidus",
      0x13: "Jecht",
      0x14: "Shantotto",
      0x15: "Gabranth",
      0x16: "Kain Highwind",
      0x17: "Gilgamesh",
      0x18: "Tifa Lockhart",
      0x19: "Laguna Loire",
      0x1a: "Yuna",
      0x1b: "Prishe",
      0x1c: "Vaan",
      0x1d: "Lightning",
      0x1e: "Feral Chaos",
    },
    cpuStrengths: {
      0x0: "Normal",
      0x1: "Strong",
      0x2: "Moderate",
    },
    friendCardIds: {
      0x0: "WHI",
      0x1: "SKY",
      0x2: "BLU",
      0x3: "PUR",
      0x4: "GRE",
      0x5: "YEL",
      0x6: "ORG",
      0x7: "RED",
    },
    friendCardNames: "getFriendCardNames()",
    headgears: {
      ...headgears,
      0xffff: "-",
    },
    icons: {
      0x0: "001 Warrior",
      0x1: "002 Thief",
      0x2: "003 Monk",
      0x3: "004 Red Mage",
      0x4: "005 White Mage",
      0x5: "006 Black Mage",
      0x6: "007 Knight",
      0x7: "008 Ninja",
      0x8: "009 Master",
      0x9: "010 Red Wizard",
      0xa: "011 White Wizard",
      0xb: "012 Black Wizard",
      0xc: "013 Matoya",
      0xd: "014 Goblin",
      0xe: "015 Sahagin",
      0xf: "016 Astos",
      0x10: "017 Ochu",
      0x11: "018 Mindflayer",
      0x12: "019 Evil Eye",
      0x13: "020 Death Machine",
      0x14: "021 Garland",
      0x15: "022 Lich",
      0x16: "023 Marilith",
      0x17: "024 Kraken",
      0x18: "025 Tiamat",
      0x19: "026 Chaos",
      0x1a: "027 Firion / Battle",
      0x1b: "028 Maria / Battle",
      0x1c: "029 Guy / Battle",
      0x1d: "030 Leon / Battle",
      0x1e: "031 Minwu / Battle",
      0x1f: "032 Josef / Battle",
      0x20: "033 Gordon / Battle",
      0x21: "034 Leila / Battle",
      0x22: "035 Richard / Battle",
      0x23: "036 Firion",
      0x24: "037 Maria",
      0x25: "038 Guy",
      0x26: "039 Leon",
      0x27: "040 Minwu",
      0x28: "041 Josef",
      0x29: "042 Gordon",
      0x2a: "043 Leila",
      0x2b: "044 Richard",
      0x2c: "045 Bomb",
      0x2d: "046 Malboro",
      0x2e: "047 Iron Giant",
      0x2f: "048 Adamantoise",
      0x30: "049 Coeurl",
      0x31: "050 Astaroth",
      0x32: "051 Beelzebub",
      0x33: "052 Borghen",
      0x34: "053 Queen Lamia",
      0x35: "054 Behemoth",
      0x36: "055 The Emperor",
      0x37: "056 The Emperor",
      0x38: "057 Onion Knight",
      0x39: "058 Warrior",
      0x3a: "059 Monk",
      0x3b: "060 White Mage",
      0x3c: "061 Black Mage",
      0x3d: "062 Red Mage",
      0x3e: "063 Ranger",
      0x3f: "064 Knight",
      0x40: "065 Thief",
      0x41: "066 Scholar",
      0x42: "067 Geomancer",
      0x43: "068 Dragoon",
      0x44: "069 Viking",
      0x45: "070 Black Belt",
      0x46: "071 Dark Knight",
      0x47: "072 Illusionist",
      0x48: "073 Bard",
      0x49: "074 Magus",
      0x4a: "075 Devout",
      0x4b: "076 Summoner",
      0x4c: "077 Sage",
      0x4d: "078 Ninja",
      0x4e: "079 Nepto Dragon",
      0x4f: "080 Hein",
      0x50: "081 Garuda",
      0x51: "082 Goldor",
      0x52: "083 Kunoichi",
      0x53: "084 Xande",
      0x54: "085 Ahriman",
      0x55: "086 Cloud of Darkness",
      0x56: "087 Cecil (Dark Knight)/ Battle",
      0x57: "088 Cecil (Paladin)/ Battle",
      0x58: "089 Kain / Battle",
      0x59: "090 Rydia (Child) / Battle",
      0x5a: "091 Edward / Battle",
      0x5b: "092 Rosa / Battle",
      0x5c: "093 Palom / Battle",
      0x5d: "094 Porom / Battle",
      0x5e: "095 Tellah / Battle",
      0x5f: "096 Yang / Battle",
      0x60: "097 Cid / Battle",
      0x61: "098 Rydia / Battle",
      0x62: "099 Edge / Battle",
      0x63: "100 Fusoya / Battle",
      0x64: "101 Fusoya (KO)",
      0x65: "102 Golbez / Battle",
      0x66: "103 Golbez's Hand",
      0x67: "104 Cecil (Dark Knight)",
      0x68: "105 Cecil",
      0x69: "106 Kain",
      0x6a: "107 Rydia (Child)",
      0x6b: "108 Edward",
      0x6c: "109 Rosa",
      0x6d: "110 Palom",
      0x6e: "111 Porom",
      0x6f: "112 Tellah",
      0x70: "113 Yang",
      0x71: "114 Cid",
      0x72: "115 Rydia",
      0x73: "116 Edge",
      0x74: "117 Fusoya",
      0x75: "118 Namingway",
      0x76: "119 Pig",
      0x77: "120 Toad",
      0x78: "121 Mini",
      0x79: "122 Mist Dragon",
      0x7a: "123 Antlion",
      0x7b: "124 Mom Bomb",
      0x7c: "125 Magus Sisters",
      0x7d: "126 Calcabrina",
      0x7e: "127 Dr. Lugae",
      0x7f: "128 Demon Wall",
      0x80: "129 Scarmiglione",
      0x81: "130 Cagnazzo",
      0x82: "131 Barbariccia",
      0x83: "132 Rubicante",
      0x84: "133 Golbez",
      0x85: "134 CPU",
      0x86: "135 Deathmask",
      0x87: "136 Zemus's Breath",
      0x88: "137 Flan Princess",
      0x89: "138 White Dragon",
      0x8a: "139 Zemus",
      0x8b: "140 Zeromus",
      0x8c: "141 Zeromus",
      0x8d: "142 Bartz / Freelancer",
      0x8e: "143 Lenna / Freelancer",
      0x8f: "144 Galuf / Freelancer",
      0x90: "145 Faris / Freelancer",
      0x91: "146 Krile / Freelancer",
      0x92: "147 Bartz / Knight",
      0x93: "148 Lenna / Monk",
      0x94: "149 Galuf / Thief",
      0x95: "150 Krile / Dragoon",
      0x96: "151 Faris / Ninja",
      0x97: "152 Galuf / Samurai",
      0x98: "153 Krile / Berserker",
      0x99: "154 Lenna / Ranger",
      0x9a: "155 Faris / Mystic Knight",
      0x9b: "156 Krile / White Mage",
      0x9c: "157 Bartz / Black Mage",
      0x9d: "158 Lenna / Time Mage",
      0x9e: "159 Faris / Summoner",
      0x9f: "160 Lenna / Blue Mage",
      0xa0: "161 Faris / Red Mage",
      0xa1: "162 Galuf / Beastmaster",
      0xa2: "163 Galuf / Chemist",
      0xa3: "164 Krile / Geomancer",
      0xa4: "165 Bartz / Bard",
      0xa5: "166 Bartz / Dancer",
      0xa6: "167 Bartz / Mimic",
      0xa7: "168 Boko",
      0xa8: "169 The Dawn Warriors",
      0xa9: "170 Sage Ghido",
      0xaa: "171 Mr. Clio",
      0xab: "172 Magic Pot",
      0xac: "173 Famed Mimic Gogo",
      0xad: "174 Nutkin",
      0xae: "175 Soul Cannon",
      0xaf: "176 Atomos",
      0xb0: "177 Gilgamesh",
      0xb1: "178 Gilgamesh",
      0xb2: "179 Exdeath",
      0xb3: "180 Melusine",
      0xb4: "181 Tonberry",
      0xb5: "182 Calofisteri",
      0xb6: "183 Catastrophe",
      0xb7: "184 Twintania",
      0xb8: "185 Mover",
      0xb9: "186 Necrophobe",
      0xba: "187 Exdeath",
      0xbb: "188 Neo Exdeath",
      0xbc: "189 Omega",
      0xbd: "190 Shinryu",
      0xbe: "191 Terra / Battle",
      0xbf: "192 Terra (Esper) / Battle",
      0xc0: "193 Locke / Battle",
      0xc1: "194 Edgar / Battle",
      0xc2: "195 Sabin / Battle",
      0xc3: "196 Shadow / Battle",
      0xc4: "197 Cyan / Battle",
      0xc5: "198 Gau / Battle",
      0xc6: "199 Celes / Battle",
      0xc7: "200 Setzer / Battle",
      0xc8: "201 Strago / Battle",
      0xc9: "202 Relm / Battle",
      0xca: "203 Mog / Battle",
      0xcb: "204 Umaro / Battle",
      0xcc: "205 Gogo / Battle",
      0xcd: "206 Terra",
      0xce: "207 Locke",
      0xcf: "208 Edgar",
      0xd0: "209 Sabin",
      0xd1: "210 Shadow",
      0xd2: "211 Cyan",
      0xd3: "212 Gau",
      0xd4: "213 Celes",
      0xd5: "214 Setzer",
      0xd6: "215 Strago",
      0xd7: "216 Relm",
      0xd8: "217 Mog",
      0xd9: "218 Umaro",
      0xda: "219 Gogo",
      0xdb: "220 Biggs & Wedge",
      0xdc: "221 Banon",
      0xdd: "222 Leo",
      0xde: "223 Maria (Celes)",
      0xdf: "224 Rachel",
      0xe0: "225 Imp",
      0xe1: "226 Mysidian Rabbit",
      0xe2: "227 Phantom Train",
      0xe3: "228 Kefka",
      0xe4: "229 Cactuar",
      0xe5: "230 Tyrannosaur",
      0xe6: "231 Brachiosaur",
      0xe7: "232 Humbaba",
      0xe8: "233 Chadarnook",
      0xe9: "234 Curlax",
      0xea: "235 Laragorn",
      0xeb: "236 Moebius",
      0xec: "237 Deathgaze",
      0xed: "238 Ultros",
      0xee: "239 Typhon",
      0xef: "240 Siegfried",
      0xf0: "241 Fiend",
      0xf1: "242 Demon",
      0xf2: "243 Goddess",
      0xf3: "244 Kefka",
      0xf4: "245 Cloud",
      0xf5: "246 Tifa",
      0xf6: "247 Barret",
      0xf7: "248 Aerith",
      0xf8: "249 Red XIII",
      0xf9: "250 Cait Sith",
      0xfa: "251 Yuffie",
      0xfb: "252 Vincent",
      0xfc: "253 Cid",
      0xfd: "254 Sephiroth",
      0xfe: "255 Squall",
      0xff: "256 Zell",
      0x100: "257 Quistis",
      0x101: "258 Selphie",
      0x102: "259 Rinoa",
      0x103: "260 Irvine",
      0x104: "261 Laguna",
      0x105: "262 Kiros",
      0x106: "263 Ward",
      0x107: "264 Seifer",
      0x108: "265 Edea",
      0x109: "266 Zidane",
      0x10a: "267 Vivi",
      0x10b: "268 Garnet",
      0x10c: "269 Steiner",
      0x10d: "270 Freya",
      0x10e: "271 Quina",
      0x10f: "272 Eiko",
      0x110: "273 Amarant",
      0x111: "274 Tidus",
      0x112: "275 Yuna",
      0x113: "276 Wakka",
      0x114: "277 Lulu",
      0x115: "278 Kimahri",
      0x116: "279 Auron",
      0x117: "280 Rikku",
      0x118: "281 Seymour",
      0x119: "282 Hume Male",
      0x11a: "283 Hume Female",
      0x11b: "284 Elvaan Male",
      0x11c: "285 Elvaan Female",
      0x11d: "286 Tarutaru Male",
      0x11e: "287 Tarutaru Female",
      0x11f: "288 Mithra",
      0x120: "289 Galka",
      0x121: "290 Vaan",
      0x122: "291 Penelo",
      0x123: "292 Balthier",
      0x124: "293 Fran",
      0x125: "294 Ashe",
      0x126: "295 Basch",
      0x127: "296 Larsa",
      0x128: "297 Vossler",
      0x129: "298 Reddas",
      0x12a: "299 Reks",
      0x12b: "300 Lightning",
      0x12c: "301 Snow",
      0x12d: "302 Sazh",
      0x12e: "303 Hope",
      0x12f: "304 Vanille",
      0x130: "305 Fang",
      0x131: "306 Serah",
      0x132: "307 Yaag Rosch",
      0x133: "308 Jihl Nabaat",
      0x134: "309 Cid Raines",
      0x135: "310 Chocobo Chick",
      0x136: "311 Lightning",
      0x137: "312 Vaan",
      0x138: "313 Laguna",
      0x139: "314 Yuna",
      0x13a: "315 Kain",
      0x13b: "316 Tifa",
      0x13c: "317 Warrior of Light",
      0x13d: "318 Firion",
      0x13e: "319 Onion Knight",
      0x13f: "320 Cecil",
      0x140: "321 Bartz",
      0x141: "322 Terra",
      0x142: "323 Cloud",
      0x143: "324 Squall",
      0x144: "325 Zidane",
      0x145: "326 Tidus",
      0x146: "327 Garland",
      0x147: "328 The Emperor",
      0x148: "329 Cloud of Darkness",
      0x149: "330 Golbez",
      0x14a: "331 Exdeath",
      0x14b: "332 Kefka",
      0x14c: "333 Sephiroth",
      0x14d: "334 Ultimecia",
      0x14e: "335 Kuja",
      0x14f: "336 Jecht",
      0x150: "337 Shantotto",
      0x151: "338 Gabranth",
      0x152: "339 Prishe",
      0x153: "340 Gilgamesh",
      0x154: "341 Cosmos",
      0x155: "342 Chaos",
      0x156: "343 Feral Chaos",
      0x157: "344 Asura",
      0x158: "345 Shiva",
      0x159: "346 Ifrit",
      0x15a: "347 Ramuh",
      0x15b: "348 Sylph",
      0x15c: "349 Syldra",
      0x15d: "350 Leviathan",
      0x15e: "351 Phoenix",
      0x15f: "352 Cait Sith",
      0x160: "353 Fenrir",
      0x161: "354 Odin",
      0x162: "355 Raiden",
      0x163: "356 Alexander",
      0x164: "357 Bahamut",
      0x165: "358 Ragnarok",
      0x166: "359 Item Shop",
      0x167: "360 Weapon Shop",
      0x168: "361 Armor Shop",
      0x169: "362 Floating Continent",
      0x16a: "363 Moai Statue",
      0x16b: "364 Treasure Chest",
      0x16c: "365 Tent",
      0x16d: "366 Crystal",
      0x16e: "367 Fish",
      0x16f: "368 Airship",
      0x170: "369 The Invincible",
      0x171: "370 Red Wings",
      0x172: "371 Wyvern",
      0x173: "372 The Lunar Whale",
      0x174: "373 The Blackjack",
      0x175: "374 Fat Chocobo",
      0x176: "375 Chocobo World",
      0x177: "376 Chocobo",
      0x178: "377 Moogle",
      0x179: "378 FINAL FANTASY XIII",
      0x17a: "379 FINAL FANTASY XIII",
      0x17b: "380 FINAL FANTASY Agito XIII",
      0x17c: "381 FINAL FANTASY Agito XIII",
      0x17d: "382 FINAL FANTASY Versus XIII",
      0x17e: "383 FINAL FANTASY Versus XIII",
      0x17f: "384 Midlander",
      0x180: "385 Highlander",
      0x181: "386 Seeker of the Sun",
      0x182: "387 Keeper of the Moon",
      0x183: "388 Plainsfolk",
      0x184: "389 Dunesfolk",
      0x185: "390 Wildwood",
      0x186: "391 Duskwight",
      0x187: "392 Sea Wolf",
      0x188: "393 Hellsguard",
      0x189: "394 Warrior of Light",
      0x18a: "395 Firion",
      0x18b: "396 Onion Knight",
      0x18c: "397 Cecil",
      0x18d: "398 Kain",
      0x18e: "399 Bartz",
      0x18f: "400 Terra",
      0x190: "401 Cloud",
      0x191: "402 Tifa",
      0x192: "403 Squall",
      0x193: "404 Laguna",
      0x194: "405 Zidane",
      0x195: "406 Tidus",
      0x196: "407 Yuna",
      0x197: "408 Shantotto",
      0x198: "409 Prishe",
      0x199: "410 Vaan",
      0x19a: "411 Lightning",
      0x19b: "412 Quest: ???",
      0x19c: "413 Quest: No Character",
    },
    movieLengths: {
      0x0: "Short",
      0x1: "Long",
      0x2: "Random",
    },
    optionBoolean: {
      0x0: "Off",
      0x1: "On",
    },
    optionBooleanReversed: {
      0x0: "On",
      0x1: "Off",
    },
    sets: {
      0x0: "Set A",
      0x1: "Set B",
      0x2: "Set C",
      0x3: "Set D",
      0x4: "Set E",
    },
    skills: {
      0x1: "Straight Chain",
      0x2: "Cross Chain",
      0x3: "Round Chain",
      0x4: "Jump Chain",
      0x5: "Multichain",
      0x6: "BRV Charge",
      0x7: "EX Charge",
      0x8: "Assist Charge",
      0x9: "BRV Zero",
      0xa: "Blind",
      0xb: "Maser Eye",
      0xc: "Soundwave",
      0xd: "Cure",
      0xe: "Raise",
      0xf: "Curaga",
      0x10: "Jump",
      0x11: "KP Switch",
      0x12: "KP Bonus",
      0x17: "KP Gambler",
      0x18: "Banish/Death",
      0xffffffff: "-",
    },
    subtitleLanguages: [
      {
        0x0: "English",
        0x1: "French",
        0x2: "German",
        0x3: "Italian",
        0x4: "Spanish",
      },
      {
        0x0: "Japanese",
      },
      {
        0x0: "English",
        0x1: "Korean",
        0x2: "Chinese",
      },
    ],
    summonstones: {
      ...summons,
      0xff: "-",
    },
    weapons: {
      ...weapons,
      0xffff: "-",
    },
  },
  resourcesGroups: {
    abilities: "getAbilityResourceGroups()",
    accessories: "getAccessoryResourceGroups()",
    armgears: "getArmgearResourceGroups()",
    bodywears: "getBodywearResourceGroups()",
    headgears: "getHeadgearResourceGroups()",
    summonstones: [
      {
        name: "Auto",
        options: [0x0, 0x1, 0x2, 0x3, 0x4, 0x5, 0x6, 0x7, 0x8, 0x9, 0xa, 0xb],
      },
      {
        name: "Manual",
        options: [
          0xc, 0xd, 0xe, 0xf, 0x10, 0x11, 0x12, 0x13, 0x14, 0x15, 0x16, 0x17,
          0x18, 0x19, 0x1a, 0x1b, 0x1c, 0x1d, 0x1e, 0x1f, 0x20, 0x21, 0x22,
          0x23, 0x24, 0x25, 0x26, 0x27, 0x28, 0x29, 0x2a, 0x2b, 0x2c, 0x2d,
          0x2e, 0x2f, 0x30, 0x31, 0x32, 0x34, 0x35, 0x36, 0x37, 0x38, 0x39,
          0x3a, 0x3c,
        ],
      },
    ],
    weapons: "getWeaponResourceGroups()",
  },
  resourcesLabels: {
    summonstones: {
      0x0: "Auto",
      0xc: "Manual",
    },
  },
  resourcesOrder: {
    abilities: [0xffff],
    accessories: [0xffff],
    armgears: [0xffff],
    assists: [0xff],
    bodywears: [0xffff],
    headgears: [0xffff],
    skills: [0xffffffff],
    summonstones: [0xff],
    weapons: [0xffff],
  },
};

export default template;
