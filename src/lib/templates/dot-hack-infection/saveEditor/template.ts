import { bitToOffset } from "$lib/utils/bytes";
import { isInRange } from "$lib/utils/format";

import type { GameJson } from "$lib/types";

import {
  bmWeapons,
  boardSubjects,
  bodies,
  characterList,
  characters,
  desktopImages,
  desktopImagesOrder,
  desktopMovies,
  desktopMusics,
  desktopMusicsOrder,
  friends,
  hands,
  haWeapons,
  hbWeapons,
  heads,
  itemList,
  items,
  itemsGroups,
  itemTypes,
  keyItems,
  keywords,
  keywordsGroups,
  laWeapons,
  legs,
  mailList,
  monsters,
  players,
  tbWeapons,
  wmWeapons,
} from "./utils/resource";

const template: GameJson = {
  validator: {
    platforms: {
      playstation2: {
        europe: {
          0x0: [
            0x42, 0x45, 0x53, 0x4c, 0x45, 0x53, 0x2d, 0x35, 0x32, 0x32, 0x33,
            0x37, 0x44, 0x4f, 0x54, 0x48, 0x41, 0x43, 0x4b,
          ], // "BESLES-52237DOTHACK"
        },
        usa: {
          0x0: [
            0x42, 0x41, 0x53, 0x4c, 0x55, 0x53, 0x2d, 0x32, 0x30, 0x32, 0x36,
            0x37, 0x44, 0x4f, 0x54, 0x48, 0x41, 0x43, 0x4b,
          ], // "BASLUS-20267DOTHACK"
        },
        japan: {
          0x0: [
            0x42, 0x49, 0x53, 0x4c, 0x50, 0x53, 0x2d, 0x32, 0x35, 0x31, 0x32,
            0x31, 0x44, 0x4f, 0x54, 0x48, 0x41, 0x43, 0x4b,
          ], // "BISLPS-25121DOTHACK"
        },
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
      instances: 12,
      enumeration: "Slot %d",
      items: [
        {
          id: "system-%index%",
          name: "Checksum",
          offset: 0x16,
          type: "checksum",
          dataType: "uint16",
          control: {
            offsetStart: 0x0,
            offsetEnd: 0x0,
          },
          overrideShift: {
            parent: -1,
            shift: 0x0,
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
                              id: "name-user",
                              name: "User Name",
                              offset: 0x18,
                              length: 0x12,
                              type: "variable",
                              dataType: "string",
                              letterDataType: "uint8",
                              fallback: 0x20,
                              endCode: 0x0,
                              test: true,
                            },
                            {
                              id: "name-character-%index%",
                              name: "Character Name",
                              offset: 0x0,
                              length: 0xe,
                              type: "variable",
                              dataType: "string",
                              letterDataType: "uint8",
                              fallback: 0x20,
                              endCode: 0x0,
                            },
                            {
                              name: "Progression",
                              offset: 0x842a,
                              type: "variable",
                              dataType: "uint8",
                              resource: "progressions",
                            },
                            {
                              name: "Playtime",
                              type: "group",
                              mode: "time",
                              items: [
                                {
                                  id: "savePreview-%index%-playtime",
                                  offset: 0x8400,
                                  type: "variable",
                                  dataType: "uint32",
                                  operations: [
                                    { "/": 60 },
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
                                  id: "savePreview-%index%-playtime",
                                  offset: 0x8400,
                                  type: "variable",
                                  dataType: "uint32",
                                  operations: [
                                    { "/": 60 },
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
                                  id: "savePreview-%index%-playtime",
                                  offset: 0x8400,
                                  type: "variable",
                                  dataType: "uint32",
                                  operations: [
                                    { "/": 60 },
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
                          ],
                        },
                        {
                          type: "section",
                          flex: true,
                          items: [
                            {
                              name: "Mode",
                              offset: 0x842b,
                              type: "variable",
                              dataType: "bit",
                              bit: 0,
                              resource: "modes",
                            },
                            {
                              name: "Twilight Bracelet",
                              offset: 0x6771,
                              type: "variable",
                              dataType: "bit",
                              bit: 0,
                              resource: "booleanAcquired",
                            },
                            {
                              id: "itemCompletionNpc",
                              name: "Item Completion NPC",
                              offset: 0x652c,
                              type: "variable",
                              dataType: "bit",
                              bit: 0,
                              resource: "booleanUnlocked",
                            },
                          ],
                        },
                        {
                          type: "section",
                          flex: true,
                          hidden: true,
                          items: [
                            {
                              id: "system-%index%-level",
                              name: "Level (Save Preview)",
                              offset: 0x1,
                              type: "variable",
                              dataType: "uint8",
                              overrideShift: {
                                parent: -1,
                                shift: 0x0,
                              },
                              hidden: true,
                            },
                            {
                              id: "system-%index%-name",
                              name: "Character Name (Save Preview)",
                              offset: 0x4,
                              length: 0xe,
                              type: "variable",
                              dataType: "string",
                              letterDataType: "uint8",
                              fallback: 0x20,
                              endCode: 0x0,
                              overrideShift: {
                                parent: -1,
                                shift: 0x0,
                              },
                              hidden: true,
                            },
                            {
                              id: "system-%index%-playtime",
                              name: "Playtime (Save Preview)",
                              offset: 0x18,
                              type: "variable",
                              dataType: "uint32",
                              overrideShift: {
                                parent: -1,
                                shift: 0x0,
                              },
                              hidden: true,
                            },
                          ],
                        },
                        {
                          name: "Unlocked Servers",
                          type: "bitflags",
                          flags: [
                            { offset: 0x2234, bit: 0, label: "Δ Server" },
                            { offset: 0x2234, bit: 1, label: "Θ Server" },
                            { offset: 0x2234, bit: 2, label: "Λ Server" },
                            { offset: 0x2234, bit: 3, label: "Σ Server" },
                            { offset: 0x2234, bit: 4, label: "Ω Server" },
                          ],
                        },
                      ],
                    },
                    {
                      name: "Member Addresses",
                      flex: true,
                      items: [
                        {
                          id: "memberAddresses",
                          name: "Obtained",
                          type: "bitflags",
                          flags: characterList.map((character) => ({
                            offset: 0x2220 + bitToOffset(character.index),
                            bit: character.index % 8,
                            label: character.name,
                            hidden: character.index === 0x0,
                          })),
                        },
                        {
                          id: "memberAddresses",
                          name: "Online",
                          type: "bitflags",
                          flags: characterList.map((character) => ({
                            offset: 0x2224 + bitToOffset(character.index),
                            bit: character.index % 8,
                            label: character.name,
                            hidden: character.index === 0x0,
                          })),
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
                  length: 0xdc,
                  type: "container",
                  instanceType: "tabs",
                  instances: 21,
                  resource: "characters",
                  vertical: true,
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
                                  name: "Class",
                                  offset: 0x7560,
                                  type: "variable",
                                  dataType: "uint16",
                                  resource: "classes",
                                },
                                {
                                  id: "savePreview-%parent%-level-%index%",
                                  name: "Level",
                                  offset: 0x7496,
                                  type: "variable",
                                  dataType: "uint16",
                                  min: 1,
                                  max: 99,
                                },
                                {
                                  name: "Experience",
                                  offset: 0x7498,
                                  type: "variable",
                                  dataType: "uint16",
                                  max: 999,
                                },
                                {
                                  name: "Money",
                                  offset: 0x749c,
                                  type: "variable",
                                  dataType: "uint32",
                                  max: 9999999,
                                },
                                {
                                  id: "affection-%index%",
                                  name: "Affection",
                                  offset: 0x7562,
                                  type: "variable",
                                  dataType: "uint16",
                                  max: 1000,
                                },
                              ],
                            },
                            {
                              name: "Equipment",
                              type: "section",
                              items: [
                                {
                                  id: "weapon",
                                  name: "Weapon",
                                  offset: 0x7558,
                                  type: "variable",
                                  dataType: "uint16",
                                  autocomplete: true,
                                },
                              ],
                            },
                            {
                              type: "section",
                              flex: true,
                              items: [
                                {
                                  name: "Head Armor",
                                  offset: 0x7550,
                                  type: "variable",
                                  dataType: "uint16",
                                  resource: "heads",
                                  autocomplete: true,
                                },
                                {
                                  name: "Body Armor",
                                  offset: 0x7552,
                                  type: "variable",
                                  dataType: "uint16",
                                  resource: "bodies",
                                  autocomplete: true,
                                },
                                {
                                  name: "Hand Armor",
                                  offset: 0x7554,
                                  type: "variable",
                                  dataType: "uint16",
                                  resource: "hands",
                                  autocomplete: true,
                                },
                                {
                                  name: "Leg Armor",
                                  offset: 0x7556,
                                  type: "variable",
                                  dataType: "uint16",
                                  resource: "legs",
                                  autocomplete: true,
                                },
                              ],
                            },
                          ],
                        },
                        {
                          name: "Status",
                          items: [
                            {
                              type: "section",
                              flex: true,
                              items: [
                                {
                                  name: "Max HP",
                                  offset: 0x74ac,
                                  type: "variable",
                                  dataType: "uint16",
                                  max: 9999,
                                },
                                {
                                  name: "Max SP",
                                  offset: 0x74ae,
                                  type: "variable",
                                  dataType: "uint16",
                                  max: 999,
                                },
                              ],
                            },
                            {
                              name: "Physical",
                              type: "section",
                              flex: true,
                              items: [
                                {
                                  name: "Attack",
                                  offset: 0x74b0,
                                  type: "variable",
                                  dataType: "uint16",
                                  max: 999,
                                },
                                {
                                  name: "Defense",
                                  offset: 0x74b2,
                                  type: "variable",
                                  dataType: "uint16",
                                  max: 999,
                                },
                                {
                                  name: "Accuracy",
                                  offset: 0x74b4,
                                  type: "variable",
                                  dataType: "uint16",
                                  max: 999,
                                },
                                {
                                  name: "Evade",
                                  offset: 0x74b6,
                                  type: "variable",
                                  dataType: "uint16",
                                  max: 999,
                                },
                              ],
                            },
                            {
                              name: "Magical",
                              type: "section",
                              flex: true,
                              items: [
                                {
                                  name: "Attack",
                                  offset: 0x74b8,
                                  type: "variable",
                                  dataType: "uint16",
                                  max: 999,
                                },
                                {
                                  name: "Defense",
                                  offset: 0x74ba,
                                  type: "variable",
                                  dataType: "uint16",
                                  max: 999,
                                },
                                {
                                  name: "Accuracy",
                                  offset: 0x74bc,
                                  type: "variable",
                                  dataType: "uint16",
                                  max: 999,
                                },
                                {
                                  name: "Evade",
                                  offset: 0x74be,
                                  type: "variable",
                                  dataType: "uint16",
                                  max: 999,
                                },
                              ],
                            },
                            {
                              name: "Others",
                              type: "section",
                              flex: true,
                              items: [
                                {
                                  name: "Earth Affinity",
                                  offset: 0x74c0,
                                  type: "variable",
                                  dataType: "uint16",
                                  max: 999,
                                },
                                {
                                  name: "Water Affinity",
                                  offset: 0x74c2,
                                  type: "variable",
                                  dataType: "uint16",
                                  max: 999,
                                },
                                {
                                  name: "Fire Affinity",
                                  offset: 0x74c4,
                                  type: "variable",
                                  dataType: "uint16",
                                  max: 999,
                                },
                                {
                                  name: "Wood Affinity",
                                  offset: 0x74c6,
                                  type: "variable",
                                  dataType: "uint16",
                                  max: 999,
                                },
                                {
                                  name: "Thunder Affinity",
                                  offset: 0x74c8,
                                  type: "variable",
                                  dataType: "uint16",
                                  max: 999,
                                },
                                {
                                  name: "Darkness Affinity",
                                  offset: 0x74ca,
                                  type: "variable",
                                  dataType: "uint16",
                                  max: 999,
                                },
                                {
                                  name: "Condition Resistances 1",
                                  offset: 0x74cc,
                                  type: "variable",
                                  dataType: "uint16",
                                  max: 999,
                                },
                                {
                                  name: "Condition Resistances 2",
                                  offset: 0x74ce,
                                  type: "variable",
                                  dataType: "uint16",
                                  max: 999,
                                },
                              ],
                            },
                          ],
                        },
                        {
                          name: "Items",
                          items: [
                            {
                              id: "partyItems-%index%",
                              length: 0x4,
                              type: "container",
                              instanceType: "section",
                              instances: 40,
                              flex: true,
                              noMargin: true,
                              items: [
                                {
                                  name: "Item %d",
                                  offset: 0x30,
                                  type: "variable",
                                  dataType: "uint24",
                                  resource: "items",
                                  autocomplete: true,
                                },
                                {
                                  name: "Quantity",
                                  offset: 0x33,
                                  type: "variable",
                                  dataType: "uint8",
                                  max: 99,
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
              name: "Key Items",
              items: [
                {
                  type: "tabs",
                  vertical: true,
                  items: keyItems.map((category) => ({
                    name: category.name,
                    flex: true,
                    items: category.items.map((item) => ({
                      name: item.name,
                      offset: 0xcfc + item.index,
                      type: "variable",
                      dataType: "uint8",
                      max: category.max,
                    })),
                  })),
                },
              ],
            },
            {
              name: "Elf's Haven",
              items: [
                {
                  length: 0x4,
                  type: "container",
                  instanceType: "section",
                  instances: 99,
                  flex: true,
                  noMargin: true,
                  items: [
                    {
                      name: "Item %d",
                      offset: 0xb70,
                      type: "variable",
                      dataType: "uint24",
                      resource: "items",
                      autocomplete: true,
                    },
                    {
                      name: "Quantity",
                      offset: 0xb73,
                      type: "variable",
                      dataType: "uint8",
                      max: 99,
                    },
                  ],
                },
              ],
            },
            {
              name: "Word List",
              items: [
                {
                  length: 0x80,
                  type: "container",
                  instanceType: "tabs",
                  instances: 5,
                  resource: "servers",
                  vertical: true,
                  flex: true,
                  items: [...Array(64).keys()].map((index) => ({
                    name: `Keyword ${index + 1}`,
                    offset: 0x5278 + index * 0x2,
                    type: "variable",
                    dataType: "uint16",
                    resource: "keywords",
                    size: "lg",
                    autocomplete: true,
                  })),
                },
              ],
            },
            {
              name: "Book of 1000",
              items: [
                {
                  type: "tabs",
                  vertical: true,
                  items: [
                    {
                      name: "Ryu Book I",
                      items: [
                        {
                          name: "Number of areas visited",
                          offset: 0x6862,
                          type: "variable",
                          dataType: "uint16",
                          max: 10000,
                        },
                      ],
                    },
                    {
                      name: "Ryu Book II",
                      flex: true,
                      items: [
                        {
                          name: "Magic portals opened",
                          offset: 0x6864,
                          type: "variable",
                          dataType: "uint16",
                          max: 10000,
                        },
                        {
                          name: "All field portals opened",
                          offset: 0x6866,
                          type: "variable",
                          dataType: "uint16",
                          max: 10000,
                        },
                        {
                          name: "All dungeon portals opened",
                          offset: 0x6868,
                          type: "variable",
                          dataType: "uint16",
                          max: 10000,
                        },
                      ],
                    },
                    {
                      id: "ryuBook3",
                      name: "Ryu Book III",
                      flex: true,
                      items: players.map(() => ({
                        name: "Dummy",
                        offset: 0x686a,
                        type: "variable",
                        dataType: "int8",
                        min: -1,
                        max: 99,
                      })),
                    },
                    {
                      name: "Ryu Book IV",
                      items: [
                        {
                          type: "tabs",
                          vertical: true,
                          items: [
                            ...Array(Math.ceil(monsters.length / 20)).keys(),
                          ].map((page) => {
                            const start = page * 20;
                            const end = Math.min(start + 20, monsters.length);

                            return {
                              name: `${(start + 1).leading0(2)}-${end.leading0(2)}`,
                              flex: true,
                              items: monsters
                                .slice(start, end)
                                .map((monster) => ({
                                  name: monster.name,
                                  offset: 0x68b7 + monster.index,
                                  type: "variable",
                                  dataType: "uint8",
                                  max: 99,
                                })),
                            };
                          }),
                        },
                      ],
                    },
                    {
                      name: "Ryu Book V",
                      items: [
                        {
                          length: 0x4,
                          type: "container",
                          instanceType: "section",
                          instances: 17,
                          flex: true,
                          resource: "friends",
                          items: [
                            {
                              name: "Time in Party",
                              type: "group",
                              mode: "time",
                              items: [
                                {
                                  offset: 0x73b8,
                                  type: "variable",
                                  dataType: "uint32",
                                  operations: [
                                    { "/": 60 },
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
                                  offset: 0x73b8,
                                  type: "variable",
                                  dataType: "uint32",
                                  operations: [
                                    { "/": 60 },
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
                                  offset: 0x73b8,
                                  type: "variable",
                                  dataType: "uint32",
                                  operations: [
                                    { "/": 60 },
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
                              name: "Gift Amount",
                              offset: 0x73fc,
                              type: "variable",
                              dataType: "uint32",
                              max: 9999999,
                            },
                          ],
                        },
                      ],
                    },
                    {
                      name: "Ryu Book VI",
                      flex: true,
                      items: [
                        {
                          name: "Treasure boxes opened",
                          offset: 0x7440,
                          type: "variable",
                          dataType: "uint16",
                          max: 10000,
                        },
                        {
                          name: "Boxes, bones, etc. broken",
                          offset: 0x7442,
                          type: "variable",
                          dataType: "uint16",
                          max: 10000,
                        },
                        {
                          name: "Gott Statue treasure opened",
                          offset: 0x746e,
                          type: "variable",
                          dataType: "uint16",
                          max: 10000,
                        },
                      ],
                    },
                    {
                      name: "Ryu Book VII",
                      flex: true,
                      items: [
                        {
                          name: "Symbols activated",
                          offset: 0x7444,
                          type: "variable",
                          dataType: "uint16",
                          max: 10000,
                        },
                        {
                          name: "Encounters with Monsieur",
                          offset: 0x7470,
                          type: "variable",
                          dataType: "uint16",
                          max: 10000,
                        },
                        {
                          name: "Encounters with Grandpa",
                          offset: 0x7472,
                          type: "variable",
                          dataType: "uint16",
                          max: 10000,
                        },
                      ],
                    },
                    {
                      name: "Ryu Book VIII",
                      items: [
                        {
                          name: "Grunty List",
                          type: "section",
                          flex: true,
                          items: [
                            {
                              name: "Noble Grunty",
                              offset: 0x7474,
                              type: "variable",
                              dataType: "uint16",
                              max: 10000,
                            },
                            {
                              name: "Iron Grunty",
                              offset: 0x7476,
                              type: "variable",
                              dataType: "uint16",
                              max: 10000,
                            },
                            {
                              name: "Poison Grunty",
                              offset: 0x7478,
                              type: "variable",
                              dataType: "uint16",
                              max: 10000,
                            },
                            {
                              name: "Bony Grunty",
                              offset: 0x747a,
                              type: "variable",
                              dataType: "uint16",
                              max: 10000,
                            },
                            {
                              name: "Snakey Grunty",
                              offset: 0x747c,
                              type: "variable",
                              dataType: "uint16",
                              max: 10000,
                            },
                            {
                              name: "Aqua Grunty",
                              offset: 0x747e,
                              type: "variable",
                              dataType: "uint16",
                              max: 10000,
                            },
                            {
                              name: "Milky Grunty",
                              offset: 0x7480,
                              type: "variable",
                              dataType: "uint16",
                              max: 10000,
                            },
                            {
                              name: "Rocker Grunty",
                              offset: 0x7482,
                              type: "variable",
                              dataType: "uint16",
                              max: 10000,
                            },
                            {
                              name: "Woody Grunty",
                              offset: 0x7484,
                              type: "variable",
                              dataType: "uint16",
                              max: 10000,
                            },
                          ],
                        },
                        {
                          name: "Grunty Food List",
                          type: "section",
                          flex: true,
                          items: keyItems[1].items.map((item, index) => ({
                            name: item.name,
                            offset: 0x7446 + index * 0x2,
                            type: "variable",
                            dataType: "uint16",
                            max: 10000,
                          })),
                        },
                      ],
                    },
                  ],
                },
              ],
            },
            {
              id: "itemCompletionList",
              name: "Item Completion",
              items: [
                {
                  type: "tabs",
                  vertical: true,
                  items: [
                    {
                      name: "Weapons",
                      flex: true,
                      items: itemTypes
                        .filter((type) => isInRange(type.index, 0x0, 0x5))
                        .map((type) => ({
                          name: type.name,
                          type: "bitflags",
                          flags: itemList
                            .filter(
                              (item) =>
                                item.index >> 0x10 === type.index &&
                                item.iclIndex !== undefined,
                            )
                            .map((item) => ({
                              offset: 0x8c84 + bitToOffset(item.iclIndex!),
                              bit: item.iclIndex! % 8,
                              label: item.name,
                            })),
                        })),
                    },
                    {
                      name: "Armour",
                      flex: true,
                      items: itemTypes
                        .filter((type) => isInRange(type.index, 0x6, 0x9))
                        .map((type) => ({
                          name: type.name,
                          type: "bitflags",
                          flags: itemList
                            .filter(
                              (item) =>
                                item.index >> 0x10 === type.index &&
                                item.iclIndex !== undefined,
                            )
                            .map((item) => ({
                              offset: 0x8c84 + bitToOffset(item.iclIndex!),
                              bit: item.iclIndex! % 8,
                              label: item.name,
                            })),
                        })),
                    },
                    {
                      name: "Items",
                      flex: true,
                      items: itemTypes
                        .filter((type) =>
                          [0xa, 0xb, 0xd, 0xe].includes(type.index),
                        )
                        .map((type) => ({
                          name: type.name,
                          type: "bitflags",
                          flags: itemList
                            .filter(
                              (item) =>
                                item.index >> 0x10 === type.index &&
                                item.iclIndex !== undefined,
                            )
                            .map((item) => ({
                              offset: 0x8c84 + bitToOffset(item.iclIndex!),
                              bit: item.iclIndex! % 8,
                              label: item.name,
                            })),
                        })),
                    },
                    {
                      name: "Key Items",
                      flex: true,
                      items: [
                        {
                          name: "Grunty Food",
                          type: "bitflags",
                          flags: [
                            { offset: 0x8d64, bit: 0, label: "Golden Egg" },
                            { offset: 0x8d64, bit: 1, label: "Grunt Mints" },
                            { offset: 0x8d64, bit: 2, label: "Twilight Onion" },
                            { offset: 0x8d64, bit: 3, label: "Snakey Cactus" },
                            { offset: 0x8d64, bit: 4, label: "Oh No Melon" },
                            { offset: 0x8d64, bit: 5, label: "Cordyceps" },
                            { offset: 0x8d64, bit: 6, label: "White Cherry" },
                            { offset: 0x8d64, bit: 7, label: "Root Vegetable" },
                            { offset: 0x8d65, bit: 0, label: "La Pumpkin" },
                            { offset: 0x8d65, bit: 1, label: "Mushroom" },
                            { offset: 0x8d65, bit: 2, label: "Mandragora" },
                            { offset: 0x8d65, bit: 3, label: "Piney Apple" },
                            { offset: 0x8d65, bit: 4, label: "Immature Egg" },
                            { offset: 0x8d65, bit: 5, label: "Bear Cat Egg" },
                            { offset: 0x8d65, bit: 6, label: "Invisible Egg" },
                            { offset: 0x8d65, bit: 7, label: "Bloody Egg" },
                          ],
                        },
                        {
                          name: "Virus Core",
                          type: "bitflags",
                          flags: [
                            { offset: 0x8d74, bit: 0, label: "Virus Core A" },
                            { offset: 0x8d74, bit: 1, label: "Virus Core B" },
                            { offset: 0x8d74, bit: 2, label: "Virus Core C" },
                            { offset: 0x8d74, bit: 3, label: "Virus Core D" },
                            { offset: 0x8d74, bit: 4, label: "Virus Core E" },
                            { offset: 0x8d74, bit: 5, label: "Virus Core F" },
                            { offset: 0x8d74, bit: 6, label: "Virus Core G" },
                            { offset: 0x8d74, bit: 7, label: "Virus Core H" },
                            { offset: 0x8d75, bit: 0, label: "Virus Core I" },
                            { offset: 0x8d75, bit: 1, label: "Virus Core J" },
                            { offset: 0x8d75, bit: 2, label: "Virus Core K" },
                            { offset: 0x8d75, bit: 3, label: "Virus Core L" },
                          ],
                        },
                      ],
                    },
                  ],
                },
              ],
            },
            {
              name: "Desktop",
              items: [
                {
                  type: "tabs",
                  vertical: true,
                  items: [
                    {
                      name: "Board",
                      items: [
                        {
                          type: "tabs",
                          vertical: true,
                          items: boardSubjects.map((subject) => ({
                            name: subject.name,
                            items: [
                              {
                                type: "bitflags",
                                flags: subject.messages.map(
                                  (message, index) => ({
                                    offset:
                                      0x28e4 + subject.index * 0x30 + index,
                                    bit: 0,
                                    label: message,
                                  }),
                                ),
                              },
                            ],
                          })),
                        },
                      ],
                    },
                    {
                      name: "Mailer",
                      items: [
                        {
                          type: "tabs",
                          vertical: true,
                          items: [
                            ...Array(Math.ceil(mailList.length / 20)).keys(),
                          ].map((page) => {
                            const start = page * 20;
                            const end = Math.min(start + 20, mailList.length);

                            return {
                              name: `${(start + 1).leading0(2)}-${end.leading0(2)}`,
                              flex: true,
                              items: mailList
                                .slice(start, end)
                                .map((_, index) => ({
                                  name: `Mail ${start + index + 0x1}`,
                                  offset: 0x2464 + start + index * 0x2,
                                  type: "variable",
                                  dataType: "uint16",
                                  resource: "mails",
                                  size: "lg",
                                  autocomplete: true,
                                })),
                            };
                          }),
                        },
                      ],
                    },
                    {
                      name: "Web News",
                      flex: true,
                      items: [
                        {
                          type: "bitflags",
                          flags: [
                            { offset: 0x2864, bit: 0, label: "New Transportation System Operational" },
                            { offset: 0x2865, bit: 0, label: '"The World" Tops 20 Million' },
                            { offset: 0x2866, bit: 0, label: "Neuro Goggle FMD" },
                            { offset: 0x2867, bit: 0, label: "0.49%% Error Rate" },
                            { offset: 0x2868, bit: 0, label: "New Weapon in Online Retail" },
                            { offset: 0x2869, bit: 0, label: '"The World" for Idiots' },
                            { offset: 0x286a, bit: 0, label: "Cat Toilet" },
                            { offset: 0x286b, bit: 0, label: "Neuro Goggle Sales" },
                            { offset: 0x286c, bit: 0, label: "Comatose: Reason Unknown" },
                            { offset: 0x286d, bit: 0, label: "Scientists Cultivate New Apple" },
                            { offset: 0x286e, bit: 0, label: "Bigfoot Investigation" },
                            { offset: 0x286f, bit: 0, label: "SOL-NET Dominates Network" },
                            { offset: 0x2870, bit: 0, label: "New Bigfoot Sighting" },
                            { offset: 0x2871, bit: 0, label: "Increase in Game Addicts" },
                            { offset: 0x2872, bit: 0, label: "Enviro-Man?" },
                            { offset: 0x2873, bit: 0, label: "Garbled Text T-shirts" },
                            { offset: 0x2874, bit: 0, label: "Success in Cultivating Apples" },
                            { offset: 0x2875, bit: 0, label: "Capturing Bigfoot" },
                            { offset: 0x2876, bit: 0, label: "A New Silver Dollar Coin" },
                            { offset: 0x2877, bit: 0, label: "Official Announcement from CC Corporati" },
                            { offset: 0x2878, bit: 0, label: "Phone Lines Down" },
                            { offset: 0x2879, bit: 0, label: "Shutdown Results in Loss" },
                            { offset: 0x287a, bit: 0, label: "System Malfunction Affects Commuters" },
                            { offset: 0x287b, bit: 0, label: "Blackout Affects 10,000 Homes" },
                          ],
                        },
                        {
                          type: "bitflags",
                          flags: [
                            { offset: 0x287c, bit: 0, label: "Artificial Apple Project Abandoned" },
                            { offset: 0x287d, bit: 0, label: "Bigfoot" },
                            { offset: 0x287e, bit: 0, label: "Panthers Strike Back" },
                            { offset: 0x287f, bit: 0, label: "Second Network Crisis?" },
                            { offset: 0x2880, bit: 0, label: "Malpractice?" },
                            { offset: 0x2881, bit: 0, label: "Communication Chaos" },
                            { offset: 0x2882, bit: 0, label: "Delivery, Anyone?" },
                            { offset: 0x2883, bit: 0, label: "Medical Equipment Hazard" },
                            { offset: 0x2884, bit: 0, label: "Bike Deliveries, Again" },
                            { offset: 0x2885, bit: 0, label: "Game Coma" },
                            { offset: 0x2886, bit: 0, label: "Potapples" },
                            { offset: 0x2887, bit: 0, label: "New Species of Ape Classified" },
                            { offset: 0x2888, bit: 0, label: "Avalon 12" },
                            { offset: 0x2889, bit: 0, label: "WNC Official Statement" },
                            { offset: 0x288a, bit: 0, label: "Public Phone Network Completion" },
                            { offset: 0x288b, bit: 0, label: '"WonderHawk" Announcement' },
                            { offset: 0x288c, bit: 0, label: "ALTIMIT Information" },
                            { offset: 0x288d, bit: 0, label: "Induced Coma with Online Game?" },
                            { offset: 0x288e, bit: 0, label: "Network Safety Law Reform" },
                            { offset: 0x288f, bit: 0, label: "Game Coma Impossible, Says Professor" },
                            { offset: 0x2890, bit: 0, label: "International Geographic Discontinued" },
                            { offset: 0x2891, bit: 0, label: "Anti-theft Vending Machine" },
                            { offset: 0x2892, bit: 0, label: "5 Years Since the Net Crisis" },
                            { offset: 0x2893, bit: 0, label: "Tokyo Mega Float Operation Begins" },
                          ],
                        },
                        {
                          type: "bitflags",
                          flags: [
                            { offset: 0x2894, bit: 0, label: "CC Corporation First Quarter Earnings" },
                            { offset: 0x2895, bit: 0, label: "Smoking Regulation Law in Deliberation" },
                            { offset: 0x2896, bit: 0, label: "Unmanned Convenience Store" },
                            { offset: 0x2897, bit: 0, label: '"News of the World" to Operate Online' },
                            { offset: 0x2898, bit: 0, label: "ALTIMIT Information" },
                            { offset: 0x2899, bit: 0, label: "Next Generation Cellular Phone" },
                            { offset: 0x289a, bit: 0, label: "Disaster at Future Bay 21" },
                            { offset: 0x289b, bit: 0, label: "The Spread of Web TV Accelerates" },
                            { offset: 0x289c, bit: 0, label: "Exposing Net Porn" },
                            { offset: 0x289d, bit: 0, label: "Can Future Phenomena be Predicted?" },
                            { offset: 0x289e, bit: 0, label: "An ALTIMIT Rival?" },
                            { offset: 0x289f, bit: 0, label: "*j1_ 3s & =BaHJ&lt; (dPQO:Iq" },
                            { offset: 0x28a0, bit: 0, label: "Apology" },
                            { offset: 0x28a1, bit: 0, label: "Net Crisis Linked to Terrorism?" },
                            { offset: 0x28a2, bit: 0, label: "Network Crisis Containment" },
                            { offset: 0x28a3, bit: 0, label: "Game Coma Patients Slowly Recover" },
                            { offset: 0x28a4, bit: 0, label: "Investigating ALTIMIT?" },
                            { offset: 0x28a5, bit: 0, label: "Liquidation of the WNC" },
                            { offset: 0x28a6, bit: 0, label: "Official Announcement: WNC Dissolution" },
                            { offset: 0x28a7, bit: 0, label: "President Coleman Issues Statement" },
                            { offset: 0x28a8, bit: 0, label: "Trespassers on Mega Float?" },
                          ],
                        },
                      ],
                    },
                    {
                      name: "Accessory & Audio",
                      items: [
                        {
                          type: "section",
                          flex: true,
                          items: [
                            {
                              name: "Desktop Image",
                              offset: 0x2236,
                              type: "variable",
                              dataType: "uint8",
                              resource: "desktopImages",
                              size: "lg",
                              autocomplete: true,
                            },
                            {
                              name: "Desktop Music",
                              offset: 0x2237,
                              type: "variable",
                              dataType: "uint8",
                              resource: "desktopMusics",
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
                              name: "Desktop Images",
                              type: "bitflags",
                              flags: Object.entries(desktopImages).map(
                                ([index, name]) => {
                                  let bit = parseInt(index);
                                  const hidden = isInRange(bit, 49, 51);

                                  if (bit > 51) {
                                    bit -= 3;
                                  }

                                  return {
                                    offset: 0x2238 + bitToOffset(bit),
                                    bit: bit % 8,
                                    label: name,
                                    hidden,
                                  };
                                },
                              ),
                            },
                            {
                              name: "Desktop Musics",
                              type: "bitflags",
                              flags: Object.entries(desktopMusics).map(
                                ([index, name]) => {
                                  const bit = parseInt(index);

                                  return {
                                    offset: 0x2244 + bitToOffset(bit),
                                    bit: bit % 8,
                                    label: name,
                                    hidden: bit === 50,
                                  };
                                },
                              ),
                            },
                            {
                              name: "Movies",
                              type: "bitflags",
                              flags: desktopMovies.map((movie, index) => ({
                                offset: 0x2250 + bitToOffset(index),
                                bit: index % 8,
                                label: movie,
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
          ],
        },
      ],
    },
  ],
  resources: {
    bmWeapons,
    bodies,
    booleanAcquired: {
      0x0: "-",
      0x1: "Acquired",
    },
    booleanUnlocked: {
      0x0: "-",
      0x1: "Unlocked",
    },
    characters,
    classes: {
      0x0: "Twin Blade",
      0x1: "Blademaster",
      0x2: "Heavy Blade",
      0x3: "Heavy Axeman",
      0x4: "Long Arm",
      0x5: "Wavemaster",
    },
    desktopImages,
    desktopMusics,
    friends,
    haWeapons,
    hands,
    hbWeapons,
    heads,
    items: {
      ...items,
      0xffffff: "-",
    },
    keywords: {
      ...keywords,
      0xffff: "-",
    },
    laWeapons,
    legs,
    mails: 'getMailNames()',
    modes: {
      0x0: "-",
      0x1: "Parody Mode",
    },
    progressions: {
      0x0: "-",
      0x1: "Vol.1 Clear",
      0x2: "Vol.2 Clear",
      0x3: "Vol.3 Clear",
      0x4: "Vol.4 Clear",
    },
    servers: {
      0x0: "Δ Server",
      0x1: "Θ Server",
      0x2: "Λ Server",
      0x3: "Σ Server",
      0x4: "Ω Server",
    },
    tbWeapons,
    wmWeapons,
  },
  resourcesGroups: {
    keywords: keywordsGroups,
    items: itemsGroups,
  },
  resourcesOrder: {
    desktopImages: desktopImagesOrder,
    desktopMusics: desktopMusicsOrder,
    items: [0xffffff],
    keywords: [0xffff],
    mails: [0xffff],
  },
};

export default template;
