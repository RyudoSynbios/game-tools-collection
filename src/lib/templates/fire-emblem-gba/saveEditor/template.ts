import type { GameJson } from "$lib/types";

import {
  characterEnum,
  characters,
  eliwoodChapters,
  hectorChapters,
  items,
  itemsGroups,
  lynChapters,
} from "./utils/resource";

const template: GameJson = {
  validator: {
    regions: {
      europe_usa_japan: {
        0x0: [0x41, 0x47, 0x42, 0x2d, 0x46, 0x45, 0x37], // "AGB-FE7"
      },
    },
    text: "Drag 'n' drop here or click to add a save file.",
    error: "Not a valid save file.",
  },
  items: [
    {
      id: "slots",
      length: 0xd8c,
      type: "container",
      instanceType: "tabs",
      instances: 3,
      enumeration: "Slot %d",
      prependSubinstance: [
        {
          name: "General",
          items: [
            {
              name: "Checksum",
              offset: 0x60,
              type: "checksum",
              dataType: "uint16",
              control: {
                offsetStart: 0x0,
                offsetEnd: 0x50,
              },
            },
            {
              type: "section",
              flex: true,
              items: [
                {
                  name: "Main Tale",
                  type: "bitflags",
                  hidden: true,
                  flags: [{ offset: 0xe, bit: 0, label: "Cleared" }],
                },
                {
                  name: "Lyn's Tale",
                  type: "bitflags",
                  flags: [{ offset: 0xe, bit: 1, label: "Cleared" }],
                },
                {
                  id: "taleProgression",
                  name: "Eliwood's Tale",
                  type: "bitflags",
                  flags: [
                    { offset: 0xe, bit: 2, label: "Normal Cleared" },
                    { offset: 0xe, bit: 5, label: "Hard Cleared" },
                  ],
                },
                {
                  id: "taleProgression",
                  name: "Hector's Tale",
                  type: "bitflags",
                  flags: [
                    { offset: 0xe, bit: 4, label: "Normal Cleared" },
                    { offset: 0xe, bit: 7, label: "Hard Cleared" },
                  ],
                },
              ],
            },
          ],
        },
      ],
      items: [
        {
          name: "Checksum",
          offset: 0x70,
          type: "checksum",
          dataType: "uint32",
          control: {
            offsetStart: 0x3f2c,
            offsetEnd: 0x4cb8,
          },
          overrideShift: {
            parent: 1,
            shift: 0x10,
          },
        },
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
                      offset: 0x3f4c,
                      length: 0x7,
                      type: "variable",
                      dataType: "string",
                      letterDataType: "uint8",
                      fallback: 0x20,
                      endCode: 0x0,
                      // regex: "",
                      test: true,
                    },
                    {
                      name: "Birth Month",
                      offset: 0x3f57,
                      type: "variable",
                      dataType: "upper4",
                      resource: "birthMonths",
                    },
                    {
                      name: "Gender",
                      offset: 0x3f58,
                      type: "variable",
                      dataType: "lower4",
                      resource: "genders",
                    },
                  ],
                },
                {
                  type: "section",
                  flex: true,
                  items: [
                    {
                      id: "mainCharacter",
                      name: "Main Character",
                      offset: 0x3f47,
                      type: "variable",
                      dataType: "uint8",
                      resource: "mainCharacters",
                    },
                    {
                      name: "Difficulty",
                      offset: 0x3f40,
                      type: "variable",
                      dataType: "bit",
                      bit: 6,
                      resource: "difficulties",
                    },
                    {
                      name: "Progression",
                      offset: 0x3f40,
                      type: "variable",
                      dataType: "bit",
                      bit: 5,
                      resource: "progressions",
                    },
                    {
                      id: "currentChapter",
                      name: "Chapter",
                      offset: 0x3f3a,
                      type: "variable",
                      dataType: "uint8",
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
                      name: "Playtime",
                      type: "group",
                      mode: "time",
                      items: [
                        {
                          offset: 0x3f2c,
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
                          offset: 0x3f2c,
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
                          offset: 0x3f2c,
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
                      name: "Funds",
                      offset: 0x3f34,
                      type: "variable",
                      dataType: "uint32",
                      max: 999999,
                    },
                  ],
                },
              ],
            },
            {
              name: "Party",
              items: [
                {
                  length: 0x24,
                  type: "container",
                  instanceType: "tabs",
                  instances: 52,
                  resource: "characterNames",
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
                                  name: "Character",
                                  offset: 0x3f88,
                                  type: "variable",
                                  dataType: "uint8",
                                  resource: "characters",
                                  autocomplete: true,
                                },
                                {
                                  name: "Class",
                                  offset: 0x3f74,
                                  type: "variable",
                                  dataType: "uint8",
                                  binary: {
                                    bitStart: 0,
                                    bitLength: 7,
                                  },
                                  resource: "classes",
                                  autocomplete: true,
                                },
                                {
                                  name: "Level",
                                  offset: 0x3f74,
                                  type: "variable",
                                  dataType: "uint16",
                                  binary: {
                                    bitStart: 7,
                                    bitLength: 5,
                                  },
                                  min: 1,
                                  max: 20,
                                },
                                {
                                  name: "Experience",
                                  offset: 0x3f75,
                                  type: "variable",
                                  dataType: "uint16",
                                  binary: {
                                    bitStart: 4,
                                    bitLength: 7,
                                  },
                                  max: 99,
                                },
                              ],
                            },
                            {
                              type: "section",
                              flex: true,
                              items: [
                                {
                                  name: "Max HP",
                                  offset: 0x3f79,
                                  type: "variable",
                                  dataType: "uint16",
                                  binary: {
                                    bitStart: 4,
                                    bitLength: 6,
                                  },
                                },
                                {
                                  name: "Strength / Magic",
                                  offset: 0x3f7a,
                                  type: "variable",
                                  dataType: "uint8",
                                  binary: {
                                    bitStart: 2,
                                    bitLength: 5,
                                  },
                                },
                                {
                                  name: "Skill",
                                  offset: 0x3f7a,
                                  type: "variable",
                                  dataType: "uint16",
                                  binary: {
                                    bitStart: 7,
                                    bitLength: 5,
                                  },
                                },
                                {
                                  name: "Speed",
                                  offset: 0x3f7b,
                                  type: "variable",
                                  dataType: "uint16",
                                  binary: {
                                    bitStart: 4,
                                    bitLength: 5,
                                  },
                                },
                                {
                                  name: "Luck",
                                  offset: 0x3f7d,
                                  type: "variable",
                                  dataType: "uint8",
                                  binary: {
                                    bitStart: 3,
                                    bitLength: 5,
                                  },
                                },
                                {
                                  name: "Defense",
                                  offset: 0x3f7c,
                                  type: "variable",
                                  dataType: "uint8",
                                  binary: {
                                    bitStart: 1,
                                    bitLength: 5,
                                  },
                                },
                                {
                                  name: "Resistance",
                                  offset: 0x3f7c,
                                  type: "variable",
                                  dataType: "uint16",
                                  binary: {
                                    bitStart: 6,
                                    bitLength: 5,
                                  },
                                },
                              ],
                            },
                            {
                              type: "section",
                              flex: true,
                              items: [
                                {
                                  name: "Affinity 1 Experience",
                                  offset: 0x3f89,
                                  type: "variable",
                                  dataType: "uint8",
                                },
                                {
                                  name: "Affinity 2 Experience",
                                  offset: 0x3f8a,
                                  type: "variable",
                                  dataType: "uint8",
                                },
                                {
                                  name: "Affinity 3 Experience",
                                  offset: 0x3f8b,
                                  type: "variable",
                                  dataType: "uint8",
                                },
                                {
                                  name: "Affinity 4 Experience",
                                  offset: 0x3f8c,
                                  type: "variable",
                                  dataType: "uint8",
                                },
                              ],
                            },
                            {
                              type: "section",
                              flex: true,
                              hidden: true,
                              items: [
                                {
                                  name: "???",
                                  offset: 0x3f76,
                                  type: "variable",
                                  dataType: "uint8",
                                  binary: {
                                    bitStart: 3,
                                    bitLength: 5,
                                  },
                                  hidden: true,
                                },
                                {
                                  name: "???",
                                  offset: 0x3f77,
                                  type: "variable",
                                  dataType: "uint8",
                                  hidden: true,
                                },
                                {
                                  name: "???",
                                  offset: 0x3f78,
                                  type: "variable",
                                  dataType: "uint8",
                                  hidden: true,
                                },
                                {
                                  name: "???",
                                  offset: 0x3f79,
                                  type: "variable",
                                  dataType: "uint8",
                                  binary: {
                                    bitStart: 0,
                                    bitLength: 4,
                                  },
                                  hidden: true,
                                },
                                {
                                  name: "???",
                                  offset: 0x3f7e,
                                  type: "variable",
                                  dataType: "uint8",
                                  hidden: true,
                                },
                                {
                                  name: "???",
                                  offset: 0x3f8d,
                                  type: "variable",
                                  dataType: "uint8",
                                  hidden: true,
                                },
                                {
                                  name: "???",
                                  offset: 0x3f8e,
                                  type: "variable",
                                  dataType: "uint8",
                                  hidden: true,
                                },
                                {
                                  name: "???",
                                  offset: 0x3f8f,
                                  type: "variable",
                                  dataType: "uint8",
                                  hidden: true,
                                },
                                {
                                  name: "???",
                                  offset: 0x3f90,
                                  type: "variable",
                                  dataType: "uint8",
                                  hidden: true,
                                },
                              ],
                            },
                          ],
                        },
                        {
                          name: "Items",
                          items: [...Array(5).keys()].map((index) => ({
                            type: "section",
                            flex: true,
                            noMargin: true,
                            items: [
                              {
                                name: `Item ${index + 1}`,
                                offset:
                                  0x3f7f + Math.floor((2 + index * 14) / 8),
                                type: "variable",
                                dataType: "uint16",
                                binary: {
                                  bitStart: (2 + index * 14) % 8,
                                  bitLength: 8,
                                },
                                resource: "items",
                                autocomplete: true,
                              },
                              {
                                name: "Durability",
                                offset:
                                  0x3f80 + Math.floor((2 + index * 14) / 8),
                                type: "variable",
                                dataType: "uint16",
                                binary: {
                                  bitStart: (2 + index * 14) % 8,
                                  bitLength: 6,
                                },
                              },
                            ],
                          })),
                        },
                        {
                          name: "Friendship",
                          items: [
                            {
                              type: "section",
                              flex: true,
                              items: [...Array(7).keys()].map((index) => ({
                                name: `Friendship ${index + 1}`,
                                offset: 0x3f91 + index,
                                type: "variable",
                                dataType: "uint8",
                                // max
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
              name: "Merlinus Stock",
              items: [...Array(100).keys()].map((index) => ({
                type: "section",
                flex: true,
                noMargin: true,
                items: [
                  {
                    name: `Item ${index + 1}`,
                    offset: 0x46c4 + index * 0x2,
                    type: "variable",
                    dataType: "uint8",
                    resource: "items",
                    autocomplete: true,
                  },
                  {
                    name: "Durability",
                    offset: 0x46c5 + index * 0x2,
                    type: "variable",
                    dataType: "uint8",
                    max: 63,
                  },
                ],
              })),
            },
            {
              name: "Statistics",
              items: [
                {
                  type: "tabs",
                  items: [
                    {
                      name: "Characters",
                      items: [
                        {
                          length: 0x10,
                          type: "container",
                          instanceType: "tabs",
                          instances: 70,
                          resource: "characterEnum",
                          vertical: true,
                          flex: true,
                          items: [
                            {
                              name: "Battles",
                              offset: 0x4798,
                              type: "variable",
                              dataType: "uint16",
                              binary: {
                                bitStart: 2,
                                bitLength: 12,
                              },
                              max: 999,
                            },
                            {
                              name: "Wins",
                              offset: 0x4797,
                              type: "variable",
                              dataType: "uint16",
                              binary: {
                                bitStart: 0,
                                bitLength: 10,
                              },
                              max: 999,
                            },
                            {
                              name: "Losses",
                              offset: 0x478c,
                              type: "variable",
                              dataType: "uint8",
                            },
                            {
                              name: "Moves",
                              offset: 0x4793,
                              type: "variable",
                              dataType: "uint16",
                              binary: {
                                bitStart: 6,
                                bitLength: 10,
                              },
                              max: 1000,
                            },
                          ],
                        },
                      ],
                    },
                    {
                      name: "Chapters",
                      items: [
                        {
                          length: 0x4,
                          type: "container",
                          instanceType: "section",
                          instances: 48,
                          flex: true,
                          noMargin: true,
                          items: [
                            {
                              name: "Chapter %d",
                              offset: 0x4bec,
                              type: "variable",
                              dataType: "uint8",
                              binary: {
                                bitStart: 0,
                                bitLength: 7,
                              },
                              resource: "chapters",
                              size: "lg",
                              autocomplete: true,
                            },
                            {
                              name: "Turns",
                              offset: 0x4bec,
                              type: "variable",
                              dataType: "uint16",
                              binary: {
                                bitStart: 7,
                                bitLength: 9,
                              },
                            },
                            {
                              name: "Playtime",
                              type: "group",
                              mode: "time",
                              items: [
                                {
                                  offset: 0x4bee,
                                  type: "variable",
                                  dataType: "uint16",
                                  operations: [
                                    { "*": 3 },
                                    {
                                      convert: {
                                        from: "seconds",
                                        to: "hours",
                                      },
                                    },
                                  ],
                                  max: 4,
                                },
                                {
                                  offset: 0x4bee,
                                  type: "variable",
                                  dataType: "uint16",
                                  operations: [
                                    { "*": 3 },
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
                                  offset: 0x4bee,
                                  type: "variable",
                                  dataType: "uint16",
                                  operations: [
                                    { "*": 3 },
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
                      ],
                    },
                  ],
                },
              ],
            },
            {
              name: "Configuration",
              items: [
                // ? 0x3F6C | 1 | Terrain
                // ? 0x3F6C | 2[2] | Unit
                // ? 0x3F6C | 4 | Autocursor
                // ? 0x3F6C | 5[2] | Text Speed
                // ? 0x3F6C | 7 | Game Speed
                // ? 0x3F6D | 0 | Music
                // ? 0x3F6D | 1 | Sound Effects
                // ? 0x3F6D | 2[2] | Window Color
                // ? 0x3F6D | 7 | Subtitle Help
                // ? 0x3F6E | 0 | Show Objective
                // ? 0x3F6E | 1[2] | Animation
                // ? 0x3F6E | 3[2] | Combat
                // ? 0x3F6E | 5 | Controller
              ],
            },
          ],
        },
      ],
      appendSubinstance: [
        {
          name: "Extras",
          items: [
            {
              type: "tabs",
              vertical: true,
              items: [
                {
                  name: "Link Arena",
                  items: [
                    {
                      name: "Checksum",
                      offset: 0xc0,
                      type: "checksum",
                      dataType: "uint32",
                      control: {
                        offsetStart: 0x67d0,
                        offsetEnd: 0x874,
                      },
                    },

                    // # Link Arena

                    // # Teams

                    // # Team 1
                    // ? 0x67D0 | string[9] | Name
                    // ! 0x67D9 | uint8 | ???
                    // ! 0x67DA | uint16 | ???
                    // ! 0x67DC | uint32 | ???
                    // ! 0x67E0 | uint32 | ???

                    // # Character 1
                    // ? 0x67E4 | 0[7] | Class
                    // ? 0x67E4 | 7[5] | Level
                    // ? 0x67E5 | 4[7] | Experience
                    // ! 0x67E6 | 3[5] | ???
                    // ! 0x67E7 | uint8 | ???
                    // ! 0x67E8 | uint8 | ???
                    // ! 0x67E9 | 0[4] | ???
                    // ? 0x67E9 | 4[6] | Max HP
                    // ? 0x67EA | 2[5] | Strength / Magical Power
                    // ? 0x67EA | 7[5] | Skill
                    // ? 0x67EB | 4[5] | Speed
                    // ? 0x67EC | 1[5] | Defense
                    // ? 0x67EC | 6[5] | Resistance
                    // ? 0x67ED | 3[5] | Luck
                    // ! 0x67EE | uint8 | ???
                    // ? 0x67EF | 2[8] | Item 1
                    // ? 0x67F0 | 2[6] | Durability
                    // ? 0x67F1 | 0[8] | Item 2
                    // ? 0x67F2 | 0[6] | Durability
                    // ? 0x67F2 | 6[8] | Item 3
                    // ? 0x67F3 | 6[6] | Durability
                    // ? 0x67F4 | 4[8] | Item 4
                    // ? 0x67F5 | 4[6] | Durability
                    // ? 0x67F6 | 2[8] | Item 5
                    // ? 0x67F7 | 2[6] | Durability
                    // ? 0x67F8 | uint8 | Character
                    // ? 0x67F9 | uint8 | Affinity 1 Experience
                    // ? 0x67FA | uint8 | Affinity 2 Experience
                    // ? 0x67FB | uint8 | Affinity 3 Experience
                    // ? 0x67FC | uint8 | Affinity 4 Experience
                    // ! 0x67FD | uint8 | ???
                    // ! 0x67FE | uint8 | ???
                    // ! 0x67FF | uint8 | ???
                    // ! 0x6800 | uint8 | ???
                    // ! 0x6801 | uint8 | Unknown 25
                    // ! 0x6802 | uint8 | Unknown 26
                    // ! 0x6803 | uint8 | Unknown 27
                    // ! 0x6804 | uint8 | Unknown 28
                    // ! 0x6805 | uint8 | Unknown 29
                    // ! 0x6806 | uint8 | Unknown 30
                    // ! 0x6807 | uint8 | ???

                    // # Character 2
                    // ? 0x6808 | 0[7] | Class
                    // # Character 5

                    // # Team 2
                    // ? 0x6898 | string[9] | Name
                    // # Team 10

                    // # Rule Settings
                    // ? 0x6FA0 | 0 | Hide Units
                    // ? 0x6FA0 | 1 | Victory Condition
                    // ? 0x6FA0 | 2 | Auto Weapon
                    // ! 0x6FA0 | 3 | ???
                    // ! 0x6FA0 | 4 | ???
                    // ! 0x6FA0 | 5 | ???
                    // ! 0x6FA0 | 6 | ???
                    // ! 0x6FA0 | 7 | ???
                    // ! 0x6FA1 | 0 | ???
                    // ! 0x6FA1 | 1 | ???
                    // ! 0x6FA1 | 2 | ???
                    // ! 0x6FA1 | 3 | ???
                    // ! 0x6FA1 | 4 | ???
                    // ! 0x6FA1 | 5 | ???
                    // ! 0x6FA1 | 6 | ???
                    // ! 0x6FA1 | 7 | ???
                    // ! 0x6FA2 | uint16 | ???

                    // # Ranking

                    // # 1st
                    // ? 0x6FA4 | 0[2] | Rank
                    // ? 0x6FA4 | 2[2] | Players
                    // ? 0x6FA4 | 4 | Victory Condition
                    // ? 0x6FA4 | 5[16] | Points
                    // ! 0x6FA6 | 5 | ???
                    // ! 0x6FA6 | 6 | ???
                    // ! 0x6FA6 | 7 | ???
                    // ! 0x6FA7 | uint8 | ???
                    // ? 0x6FA8 | string[8] | Name
                    // ! 0x6FB0 | uint32 | ???

                    // # 2nd
                    // ? 0x6FB4 | 0[2] | Rank
                    // # 10th
                  ],
                },
                {
                  name: "Sound Room",
                  flex: true,
                  items: [
                    {
                      type: "section",
                      items: [
                        {
                          name: "Checksum",
                          offset: 0x711c,
                          type: "checksum",
                          dataType: "uint16",
                          control: {
                            offsetStart: 0x70fc,
                            offsetEnd: 0x711c,
                          },
                        },
                        {
                          name: "Musics",
                          type: "bitflags",
                          flags: [
                            { offset: 0x7107, bit: 4, label: "001. Opening: History Unveiled" }, // prettier-ignore
                            { offset: 0x7107, bit: 2, label: "002. Fire Emblem Theme" }, // prettier-ignore
                            { offset: 0x7100, bit: 5, label: "003. A Hint of Things to Come" }, // prettier-ignore
                            { offset: 0x7100, bit: 6, label: "004. Road of Trials" }, // prettier-ignore
                            { offset: 0x7100, bit: 7, label: "005. Destiny Enlaced by Fear" }, // prettier-ignore
                            { offset: 0x7102, bit: 0, label: "006. Winds across the Plains" }, // prettier-ignore
                            { offset: 0x70fc, bit: 1, label: "007. Precious Things" }, // prettier-ignore
                            { offset: 0x70fc, bit: 2, label: "008. Companions" }, // prettier-ignore
                            { offset: 0x70fc, bit: 3, label: "009. Friendship and Adventure" }, // prettier-ignore
                            { offset: 0x70fd, bit: 2, label: "010. Distant Travels" }, // prettier-ignore
                            { offset: 0x70fd, bit: 3, label: "011. Inescapable Fate" }, // prettier-ignore
                            { offset: 0x70fc, bit: 4, label: "012. Dragon's Gate II" }, // prettier-ignore
                            { offset: 0x70fd, bit: 1, label: "013. Winning Road" }, // prettier-ignore
                            { offset: 0x70fd, bit: 0, label: "014. Binding Ties" }, // prettier-ignore
                            { offset: 0x70fc, bit: 5, label: "015. Scars of the Scouring" }, // prettier-ignore
                            { offset: 0x70fc, bit: 6, label: "016. Raise Your Spirits" }, // prettier-ignore
                            { offset: 0x70fc, bit: 7, label: "017. Shadow Approaches" }, // prettier-ignore
                            { offset: 0x70fd, bit: 4, label: "018. Enemies Appear" }, // prettier-ignore
                            { offset: 0x70fd, bit: 5, label: "019. The Messenger" }, // prettier-ignore
                            { offset: 0x70fd, bit: 6, label: "020. Darkness Comes" }, // prettier-ignore
                            { offset: 0x70fe, bit: 0, label: "021. Dragon's Gate I" }, // prettier-ignore
                            { offset: 0x70fd, bit: 7, label: "022. Nabata's Wandering Messenger" }, // prettier-ignore
                            { offset: 0x70fe, bit: 1, label: "023. Legendary Inheritance" }, // prettier-ignore
                            { offset: 0x70fe, bit: 2, label: "024. Raid!" }, // prettier-ignore
                            { offset: 0x70fe, bit: 3, label: "025. Messenger from the Darkness" }, // prettier-ignore
                            { offset: 0x70ff, bit: 7, label: "026. Strike" }, // prettier-ignore
                            { offset: 0x7100, bit: 0, label: "027. Safeguard" }, // prettier-ignore
                            { offset: 0x70fe, bit: 4, label: "028. Victory Now!" }, // prettier-ignore
                            { offset: 0x70fe, bit: 5, label: "029. Rise to the Challenge" }, // prettier-ignore
                            { offset: 0x70fe, bit: 6, label: "030. Softly with Grace" }, // prettier-ignore
                            { offset: 0x70fe, bit: 7, label: "031. Everything into the Dark" }, // prettier-ignore
                            { offset: 0x70ff, bit: 0, label: "032. Campaign of Fire" }, // prettier-ignore
                            { offset: 0x70ff, bit: 4, label: "033. Blessing of the 8 Generals I" }, // prettier-ignore
                            { offset: 0x70ff, bit: 1, label: "034. Healing" }, // prettier-ignore
                            { offset: 0x70ff, bit: 2, label: "035. Curing" }, // prettier-ignore
                            { offset: 0x70ff, bit: 5, label: "036. Receive the Blessings of Water" }, // prettier-ignore
                            { offset: 0x70ff, bit: 6, label: "037. Ride the Wind" }, // prettier-ignore
                            { offset: 0x70ff, bit: 3, label: "038. To the Heights" }, // prettier-ignore
                            { offset: 0x7102, bit: 2, label: "039. An Unexpected Caller" }, // prettier-ignore
                            { offset: 0x7102, bit: 3, label: "040. When the Rush Comes" }, // prettier-ignore
                            { offset: 0x7100, bit: 2, label: "041. Land of Swirling Sands" }, // prettier-ignore
                            { offset: 0x7105, bit: 6, label: "042. Ships and Homes" }, // prettier-ignore
                            { offset: 0x7105, bit: 7, label: "043. Silent Ground" }, // prettier-ignore
                            { offset: 0x7109, bit: 3, label: "044. The Inn" }, // prettier-ignore
                            { offset: 0x7104, bit: 1, label: "045. Going My Way" }, // prettier-ignore
                            { offset: 0x7104, bit: 2, label: "046. Together, We Ride!" }, // prettier-ignore
                            { offset: 0x7104, bit: 3, label: "047. A Knight's Oath" }, // prettier-ignore
                            { offset: 0x7104, bit: 4, label: "048. Happiness Abounds" }, // prettier-ignore
                            { offset: 0x7105, bit: 4, label: "049. Merlinus" }, // prettier-ignore
                            { offset: 0x7104, bit: 0, label: "050. Final Farewell" }, // prettier-ignore
                            { offset: 0x7100, bit: 1, label: "051. Requiem" }, // prettier-ignore
                            { offset: 0x7106, bit: 1, label: "052. Recollection of a Petal" }, // prettier-ignore
                            { offset: 0x7102, bit: 4, label: "053. The Cogs of Fate" }, // prettier-ignore
                            { offset: 0x7102, bit: 7, label: "054. The Eight Generals" }, // prettier-ignore
                            { offset: 0x7103, bit: 4, label: "055. The Archsage Athos" }, // prettier-ignore
                            { offset: 0x7107, bit: 5, label: "056. Distant Utopia" }, // prettier-ignore
                            { offset: 0x7106, bit: 2, label: "057. What Comes from Darkness" }, // prettier-ignore
                            { offset: 0x7106, bit: 0, label: "058. Black Fang" }, // prettier-ignore
                            { offset: 0x7105, bit: 2, label: "059. Calamity Bringer: Nergal's Theme" }, // prettier-ignore
                            { offset: 0x7103, bit: 3, label: "060. Nergal's Wrath" }, // prettier-ignore
                            { offset: 0x7106, bit: 3, label: "061. Stratagem" }, // prettier-ignore
                            { offset: 0x7100, bit: 3, label: "062. The Kingdom of Biran" }, // prettier-ignore
                            { offset: 0x7100, bit: 4, label: "063. Biran - A Mother's Wish" }, // prettier-ignore
                            { offset: 0x7102, bit: 5, label: "064. Shocking Truth I" }, // prettier-ignore
                            { offset: 0x7102, bit: 6, label: "065. Shocking Truth II" }, // prettier-ignore
                            { offset: 0x7103, bit: 0, label: "066. Triumph" }, // prettier-ignore
                            { offset: 0x7103, bit: 1, label: "067. Into the Shadow of Triumph" }, // prettier-ignore
                            { offset: 0x7104, bit: 5, label: "068. Main Theme Arrangement" }, // prettier-ignore
                            { offset: 0x7109, bit: 6, label: "069. Blessing of the 8 Generals II" }, // prettier-ignore
                            { offset: 0x7103, bit: 7, label: "070. Girl of the Plains: Lyn's Theme" }, // prettier-ignore
                            { offset: 0x7106, bit: 4, label: "071. Lyn's Desire" }, // prettier-ignore
                            { offset: 0x7105, bit: 3, label: "072. Light to Tomorrow" }, // prettier-ignore
                            { offset: 0x7103, bit: 5, label: "073. One Heart: Eliwood's Theme" }, // prettier-ignore
                            { offset: 0x7106, bit: 6, label: "074. Eyes of Sorrow" }, // prettier-ignore
                            { offset: 0x7106, bit: 7, label: "075. Unshakable Faith" }, // prettier-ignore
                            { offset: 0x7103, bit: 6, label: "076. Loyalty: Hector's Theme" }, // prettier-ignore
                            { offset: 0x7107, bit: 0, label: "077. The Grieving Heart" }, // prettier-ignore
                            { offset: 0x7103, bit: 2, label: "078. Reminiscence" }, // prettier-ignore
                            { offset: 0x7109, bit: 0, label: "079. Shattered Life" }, // prettier-ignore
                            { offset: 0x7109, bit: 1, label: "080. Anguish" }, // prettier-ignore
                            { offset: 0x7109, bit: 2, label: "081. Respite in Battle" }, // prettier-ignore
                            { offset: 0x7105, bit: 1, label: "082. Prepare to Charge" }, // prettier-ignore
                            { offset: 0x7105, bit: 5, label: "083. Armory" }, // prettier-ignore
                            { offset: 0x7104, bit: 6, label: "084. Shop" }, // prettier-ignore
                            { offset: 0x7107, bit: 6, label: "085. Fortune-Telling" }, // prettier-ignore
                            { offset: 0x7104, bit: 7, label: "086. Arena Entrance" }, // prettier-ignore
                            { offset: 0x7105, bit: 0, label: "087. Arena Battle" }, // prettier-ignore
                            { offset: 0x7101, bit: 5, label: "088. Arena Victory" }, // prettier-ignore
                            { offset: 0x7101, bit: 6, label: "089. Arena Tactics" }, // prettier-ignore
                            { offset: 0x7101, bit: 4, label: "090. Within Sadness" }, // prettier-ignore
                            { offset: 0x7101, bit: 3, label: "091. Game Over" }, // prettier-ignore
                            { offset: 0x710a, bit: 3, label: "092. Legend of Athos" }, // prettier-ignore
                            { offset: 0x7101, bit: 1, label: "093. Results" }, // prettier-ignore
                            { offset: 0x7101, bit: 2, label: "094. Treasured Hope" }, // prettier-ignore
                            { offset: 0x710a, bit: 0, label: "095. Beneath a New Light" }, // prettier-ignore
                            { offset: 0x710a, bit: 1, label: "096. The Path to Greatness" }, // prettier-ignore
                            { offset: 0x710a, bit: 2, label: "097. In the Name of Biran" }, // prettier-ignore
                            { offset: 0x710a, bit: 4, label: "098. Avoided Fate" }, // prettier-ignore
                            { offset: 0x710a, bit: 5, label: "099. Legend of the Dragon God" }, // prettier-ignore
                            { offset: 0x710a, bit: 6, label: "100. Royal Palace of Silezha" }, // prettier-ignore
                            { offset: 0x70fc, bit: 0, label: "???", hidden: true }, // prettier-ignore
                            { offset: 0x7101, bit: 0, label: "???", hidden: true }, // prettier-ignore
                            { offset: 0x7101, bit: 7, label: "???", hidden: true }, // prettier-ignore
                            { offset: 0x7102, bit: 1, label: "???", hidden: true }, // prettier-ignore
                            { offset: 0x7106, bit: 5, label: "???", hidden: true }, // prettier-ignore
                            { offset: 0x7107, bit: 1, label: "???", hidden: true }, // prettier-ignore
                            { offset: 0x7107, bit: 3, label: "???", hidden: true }, // prettier-ignore
                            { offset: 0x7107, bit: 7, label: "???", hidden: true }, // prettier-ignore
                            { offset: 0x7108, bit: 0, label: "???", hidden: true }, // prettier-ignore
                            { offset: 0x7108, bit: 1, label: "???", hidden: true }, // prettier-ignore
                            { offset: 0x7108, bit: 2, label: "???", hidden: true }, // prettier-ignore
                            { offset: 0x7108, bit: 3, label: "???", hidden: true }, // prettier-ignore
                            { offset: 0x7108, bit: 4, label: "???", hidden: true }, // prettier-ignore
                            { offset: 0x7108, bit: 5, label: "???", hidden: true }, // prettier-ignore
                            { offset: 0x7108, bit: 6, label: "???", hidden: true }, // prettier-ignore
                            { offset: 0x7108, bit: 7, label: "???", hidden: true }, // prettier-ignore
                            { offset: 0x7109, bit: 4, label: "???", hidden: true }, // prettier-ignore
                            { offset: 0x7109, bit: 5, label: "???", hidden: true }, // prettier-ignore
                            { offset: 0x7109, bit: 7, label: "???", hidden: true }, // prettier-ignore
                            { offset: 0x710a, bit: 7, label: "???", hidden: true }, // prettier-ignore
                            { offset: 0x710b, bit: 0, label: "???", hidden: true }, // prettier-ignore
                            { offset: 0x710b, bit: 1, label: "???", hidden: true }, // prettier-ignore
                            { offset: 0x710b, bit: 2, label: "???", hidden: true }, // prettier-ignore
                            { offset: 0x710b, bit: 3, label: "???", hidden: true }, // prettier-ignore
                            { offset: 0x710b, bit: 4, label: "???", hidden: true }, // prettier-ignore
                            { offset: 0x710b, bit: 5, label: "???", hidden: true }, // prettier-ignore
                            { offset: 0x710b, bit: 6, label: "???", hidden: true }, // prettier-ignore
                            { offset: 0x710b, bit: 7, label: "???", hidden: true }, // prettier-ignore
                          ],
                        },
                      ],
                    },
                    {
                      type: "section",
                      items: [
                        {
                          name: "Checksum",
                          offset: 0x7130,
                          type: "checksum",
                          dataType: "uint16",
                          control: {
                            offsetStart: 0x7120,
                            offsetEnd: 0x7130,
                          },
                        },
                        {
                          name: "Backgrounds",
                          type: "bitflags",
                          flags: [
                            { offset: 0x7120, bit: 0, label: "Lyn" }, // prettier-ignore
                            { offset: 0x7120, bit: 1, label: "Lyn" }, // prettier-ignore
                            { offset: 0x7120, bit: 2, label: "Lyn" }, // prettier-ignore
                            { offset: 0x7120, bit: 3, label: "Lyn" }, // prettier-ignore
                            { offset: 0x7120, bit: 4, label: "Lyn" }, // prettier-ignore
                            { offset: 0x7120, bit: 5, label: "Lyn" }, // prettier-ignore
                            { offset: 0x7120, bit: 6, label: "Lyn" }, // prettier-ignore
                            { offset: 0x7120, bit: 7, label: "Lyn" }, // prettier-ignore
                            { offset: 0x7121, bit: 0, label: "Lyn" }, // prettier-ignore
                            { offset: 0x7121, bit: 1, label: "Lyn" }, // prettier-ignore
                            { offset: 0x7121, bit: 2, label: "Lyn" }, // prettier-ignore
                            { offset: 0x7121, bit: 3, label: "Eliwood" }, // prettier-ignore
                            { offset: 0x7121, bit: 4, label: "Eliwood" }, // prettier-ignore
                            { offset: 0x7121, bit: 5, label: "Eliwood" }, // prettier-ignore
                            { offset: 0x7121, bit: 6, label: "Eliwood" }, // prettier-ignore
                            { offset: 0x7121, bit: 7, label: "Eliwood" }, // prettier-ignore
                            { offset: 0x7122, bit: 0, label: "Eliwood" }, // prettier-ignore
                            { offset: 0x7122, bit: 1, label: "Eliwood" }, // prettier-ignore
                            { offset: 0x7122, bit: 2, label: "Eliwood" }, // prettier-ignore
                            { offset: 0x7122, bit: 3, label: "Eliwood" }, // prettier-ignore
                            { offset: 0x7122, bit: 4, label: "Eliwood" }, // prettier-ignore
                            { offset: 0x7122, bit: 5, label: "Eliwood" }, // prettier-ignore
                            { offset: 0x7122, bit: 6, label: "Eliwood" }, // prettier-ignore
                            { offset: 0x7122, bit: 7, label: "Eliwood" }, // prettier-ignore
                            { offset: 0x7123, bit: 0, label: "Eliwood" }, // prettier-ignore
                            { offset: 0x7123, bit: 1, label: "Eliwood" }, // prettier-ignore
                            { offset: 0x7123, bit: 2, label: "Eliwood" }, // prettier-ignore
                            { offset: 0x7123, bit: 3, label: "Eliwood" }, // prettier-ignore
                            { offset: 0x7123, bit: 4, label: "Eliwood" }, // prettier-ignore
                            { offset: 0x7123, bit: 5, label: "Eliwood" }, // prettier-ignore
                            { offset: 0x7123, bit: 6, label: "Eliwood" }, // prettier-ignore
                            { offset: 0x7123, bit: 7, label: "Eliwood" }, // prettier-ignore
                            { offset: 0x7124, bit: 0, label: "Eliwood" }, // prettier-ignore
                            { offset: 0x7124, bit: 1, label: "Eliwood" }, // prettier-ignore
                            { offset: 0x7124, bit: 2, label: "???", hidden: true }, // prettier-ignore
                            { offset: 0x7124, bit: 3, label: "???", hidden: true }, // prettier-ignore
                            { offset: 0x7124, bit: 4, label: "Eliwood" }, // prettier-ignore
                            { offset: 0x7124, bit: 5, label: "Eliwood" }, // prettier-ignore
                            { offset: 0x7124, bit: 6, label: "Eliwood" }, // prettier-ignore
                            { offset: 0x7124, bit: 7, label: "Eliwood" }, // prettier-ignore
                            { offset: 0x7125, bit: 0, label: "Eliwood" }, // prettier-ignore
                            { offset: 0x7125, bit: 1, label: "Eliwood" }, // prettier-ignore
                            { offset: 0x7125, bit: 2, label: "Eliwood" }, // prettier-ignore
                            { offset: 0x7125, bit: 3, label: "Eliwood" }, // prettier-ignore
                            { offset: 0x7125, bit: 4, label: "Eliwood" }, // prettier-ignore
                            { offset: 0x7125, bit: 5, label: "Eliwood" }, // prettier-ignore
                            { offset: 0x7125, bit: 6, label: "Eliwood" }, // prettier-ignore
                            { offset: 0x7125, bit: 7, label: "Eliwood" }, // prettier-ignore
                            { offset: 0x7126, bit: 0, label: "Eliwood" }, // prettier-ignore
                            { offset: 0x7126, bit: 1, label: "Eliwood" }, // prettier-ignore
                            { offset: 0x7126, bit: 2, label: "Eliwood" }, // prettier-ignore
                            { offset: 0x7126, bit: 3, label: "Hector" }, // prettier-ignore
                            { offset: 0x7126, bit: 4, label: "Hector" }, // prettier-ignore
                            { offset: 0x7126, bit: 5, label: "Hector" }, // prettier-ignore
                            { offset: 0x7126, bit: 6, label: "Hector" }, // prettier-ignore
                            { offset: 0x7126, bit: 7, label: "Hector" }, // prettier-ignore
                            { offset: 0x7127, bit: 0, label: "Hector" }, // prettier-ignore
                            { offset: 0x7127, bit: 1, label: "Hector" }, // prettier-ignore
                            { offset: 0x7127, bit: 2, label: "???", hidden: true }, // prettier-ignore
                            { offset: 0x7127, bit: 3, label: "Hector US?", hidden: true }, // prettier-ignore
                            { offset: 0x7127, bit: 4, label: "Hector" }, // prettier-ignore
                            { offset: 0x7127, bit: 5, label: "Hector" }, // prettier-ignore
                            { offset: 0x7127, bit: 6, label: "Hector" }, // prettier-ignore
                            { offset: 0x7127, bit: 7, label: "Hector" }, // prettier-ignore
                            { offset: 0x7128, bit: 0, label: "Hector" }, // prettier-ignore
                            { offset: 0x7128, bit: 1, label: "???", hidden: true }, // prettier-ignore
                            { offset: 0x7128, bit: 2, label: "???", hidden: true }, // prettier-ignore
                            { offset: 0x7128, bit: 3, label: "???", hidden: true }, // prettier-ignore
                            { offset: 0x7128, bit: 4, label: "???", hidden: true }, // prettier-ignore
                            { offset: 0x7128, bit: 5, label: "???", hidden: true }, // prettier-ignore
                            { offset: 0x7128, bit: 6, label: "???", hidden: true }, // prettier-ignore
                            { offset: 0x7128, bit: 7, label: "???", hidden: true }, // prettier-ignore
                          ],
                        },
                      ],
                    },
                  ],
                },
                {
                  name: "Support Conversation",
                  items: [
                    // # Support Conversation
                    // # Conversations
                    // ? 0x20 | 0[2] | Eliwood-Hector
                    // ? 0x20 | 2[2] | Eliwood-Lyn
                    // ? 0x20 | 4[2] | Eliwood-Ninian
                    // ? 0x20 | 6[2] | Eliwood-Marcus
                    // ? 0x21 | 0[2] | Eliwood-Lowen
                    // ? 0x21 | 2[2] | Eliwood-Harken
                    // ? 0x21 | 4[2] | Eliwood-Fiora
                    // ? 0x21 | 6[2] | Hector-Lyn
                    // ? 0x22 | 0[2] | Hector-Oswin
                    // ? 0x22 | 2[2] | Hector-Matthew
                    // ? 0x22 | 4[2] | Hector-Florina
                    // ? 0x22 | 6[2] | Hector-Serra
                    // ? 0x23 | 0[2] | Hector-Farina
                    // ? 0x23 | 2[2] | Lyn-Florina
                    // ? 0x23 | 4[2] | Lyn-Rath
                    // ? 0x23 | 6[2] | Lyn-Kent
                    // ? 0x24 | 0[2] | Lyn-Wil
                    // ? 0x24 | 2[2] | Lyn-Wallace
                    // ? 0x24 | 4[2] | Raven-Lucius
                    // ? 0x24 | 6[2] | Raven-Priscilla
                    // ? 0x25 | 0[2] | Raven-Rebecca
                    // ? 0x25 | 2[2] | Raven-Wil
                    // ? 0x25 | 4[2] | Raven-Bartre
                    // ? 0x25 | 6[2] | Harken-Isadora
                    // ? 0x26 | 0[2] | Harken-Lowen
                    // ? 0x26 | 2[2] | Harken-Marcus
                    // ? 0x26 | 4[2] | Harken-Vaida
                    // ? 0x26 | 6[2] | Guy-Matthew
                    // ? 0x27 | 0[2] | Guy-Rath
                    // ? 0x27 | 2[2] | Guy-Karel
                    // ? 0x27 | 4[2] | Guy-Priscilla
                    // ? 0x27 | 6[2] | Guy-Louise
                    // ? 0x28 | 0[2] | Karel-Geitz
                    // ? 0x28 | 2[2] | Karel-Karla
                    // ? 0x28 | 4[2] | Karel-Dart
                    // ? 0x28 | 6[2] | Karel-Lucius
                    // ? 0x29 | 0[2] | Dorcas-Bartre
                    // ? 0x29 | 2[2] | Dorcas-Geitz
                    // ? 0x29 | 4[2] | Dorcas-Oswin
                    // ? 0x29 | 6[2] | Dorcas-Vaida
                    // ? 0x2A | 0[2] | Dorcas-Farina
                    // ? 0x2A | 2[2] | Bartre-Canas
                    // ? 0x2A | 4[2] | Bartre-Karla
                    // ? 0x2A | 6[2] | Bartre-Renaud
                    // ? 0x2B | 0[2] | Geitz-Isadora
                    // ? 0x2B | 2[2] | Geitz-Fiora
                    // ? 0x2B | 4[2] | Geitz-Dart
                    // ? 0x2B | 6[2] | Oswin-Matthew
                    // ? 0x2C | 0[2] | Oswin-Serra
                    // ? 0x2C | 2[2] | Oswin-Priscilla
                    // ? 0x2C | 4[2] | Wil-Rebecca
                    // ? 0x2C | 6[2] | Wil-Rath
                    // ? 0x2D | 0[2] | Wil-Dart
                    // ? 0x2D | 2[2] | Wil-Wallace
                    // ? 0x2D | 4[2] | Rebecca-Lowen
                    // ? 0x2D | 6[2] | Rebecca-Sain
                    // ? 0x2E | 0[2] | Rebecca-Dart
                    // ? 0x2E | 2[2] | Rebecca-Louise
                    // ? 0x2E | 4[2] | Rebecca-Nino
                    // ? 0x2E | 6[2] | Louise-Pent
                    // ? 0x2F | 0[2] | Louise-Erk
                    // ? 0x2F | 2[2] | Louise-Hawkeye
                    // ? 0x2F | 4[2] | Louise-Heath
                    // ? 0x2F | 6[2] | Louise-Sain
                    // ? 0x30 | 0[2] | Lucius-Priscilla
                    // ? 0x30 | 2[2] | Lucius-Serra
                    // ? 0x30 | 4[2] | Lucius-Renaud
                    // ? 0x30 | 6[2] | Serra-Matthew
                    // ? 0x31 | 0[2] | Serra-Florina
                    // ? 0x31 | 2[2] | Serra-Sain
                    // ? 0x31 | 4[2] | Serra-Erk
                    // ? 0x31 | 6[2] | Renaud-Isadora
                    // ? 0x32 | 0[2] | Renaud-Wallace
                    // ? 0x32 | 2[2] | Renaud-Canas
                    // ? 0x32 | 4[2] | Nino-Erk
                    // ? 0x32 | 6[2] | Nino-Jaffar
                    // ? 0x33 | 0[2] | Nino-Florina
                    // ? 0x33 | 2[2] | Nino-Merlinus
                    // ? 0x33 | 4[2] | Nino-Legault
                    // ? 0x33 | 6[2] | Canas
                    // ? 0x34 | 0[2] | Pent-Erk
                    // ? 0x34 | 2[2] | Pent-Canas
                    // ? 0x34 | 4[2] | Pent-Hawkeye
                    // ? 0x34 | 6[2] | Pent-Fiora
                    // ? 0x35 | 0[2] | Kent-Sain
                    // ? 0x35 | 2[2] | Kent-Fiora
                    // ? 0x35 | 4[2] | Kent-Farina
                    // ? 0x35 | 6[2] | Kent-Wallace
                    // ? 0x36 | 0[2] | Kent-Heath
                    // ? 0x36 | 2[2] | Sain-Fiora
                    // ? 0x36 | 4[2] | Sain-Priscilla
                    // ? 0x36 | 6[2] | Sain-Isadora
                    // ? 0x37 | 0[2] | Isadora-Lowen
                    // ? 0x37 | 2[2] | Marcus-Lowen
                    // ? 0x37 | 4[2] | Marcus-Merlinus
                    // ? 0x37 | 6[2] | Marcus-Isadora
                    // ? 0x38 | 0[2] | Priscilla-Erk
                    // ? 0x38 | 2[2] | Priscilla-Heath
                    // ? 0x38 | 4[2] | Florina-Farina
                    // ? 0x38 | 6[2] | Florina-Fiora
                    // ? 0x39 | 0[2] | Florina-Ninian
                    // ? 0x39 | 2[2] | Fiora-Farina
                    // ? 0x39 | 4[2] | Fiora-Dart
                    // ? 0x39 | 6[2] | Fiora-Karla
                    // ? 0x3A | 0[2] | Vaida-Canas
                    // ? 0x3A | 2[2] | Vaida-Heath
                    // ? 0x3A | 4[2] | Vaida-Karla
                    // ? 0x3A | 6[2] | Vaida-Wallace
                    // ? 0x3B | 0[2] | Vaida-Merlinus
                    // ? 0x3B | 2[2] | Hawkeye-Ninian
                    // ? 0x3B | 4[2] | Jaffar-Matthew
                    // ? 0x3B | 6[2] | Legault-Matthew
                    // ? 0x3C | 0[2] | Legault-Jaffar
                    // ? 0x3C | 2[2] | Legault-Heath
                    // ? 0x3C | 4[2] | Legault-Isadora
                    // ! 0x3C | 6 | ???
                    // ! 0x3C | 7 | ???
                    // # Unlocked Characters
                    // todo 0x40 | 0 | ???
                    // ? 0x40 | 1 | Eliwood
                    // ? 0x40 | 2 | Hector
                    // todo 0x40 | 3 | Lyn
                    // ? 0x40 | 4 | Raven
                    // ? 0x40 | 5 | Geitz
                    // ? 0x40 | 6 | Guy
                    // ? 0x40 | 7 | Karel
                    // ? 0x41 | 0 | Dorcas
                    // ? 0x41 | 1 | Bartre
                    // ! 0x41 | 2 | Citizen
                    // ? 0x41 | 3 | Oswin
                    // ! 0x41 | 4 | Fargus
                    // todo 0x41 | 5 | Wil
                    // ? 0x41 | 6 | Rebecca
                    // ? 0x41 | 7 | Louise
                    // ? 0x42 | 0 | Lucius
                    // ? 0x42 | 1 | Serra
                    // ? 0x42 | 2 | Renaud
                    // ? 0x42 | 3 | Erk
                    // ? 0x42 | 4 | Nino
                    // ? 0x42 | 5 | Pent
                    // ? 0x42 | 6 | Canas
                    // todo 0x42 | 7 | Kent
                    // todo 0x43 | 0 | Sain
                    // ? 0x43 | 1 | Lowen
                    // ? 0x43 | 2 | Marcus
                    // ? 0x43 | 3 | Priscilla
                    // todo 0x43 | 4 | Rath
                    // todo 0x43 | 5 | Florina
                    // ? 0x43 | 6 | Fiora
                    // ? 0x43 | 7 | Farina
                    // ? 0x44 | 0 | Heath
                    // ? 0x44 | 1 | Vaida
                    // ? 0x44 | 2 | Hawkeye
                    // ? 0x44 | 3 | Matthew
                    // ? 0x44 | 4 | Jaffar
                    // ? 0x44 | 5 | Ninian
                    // todo 0x44 | 6 | Nils
                    // todo 0x44 | 7 | Athos
                    // ? 0x45 | 0 | Merlinus
                    // ! 0x45 | 1 | ???
                    // ! 0x45 | 2 | ???
                    // ! 0x45 | 3 | ???
                    // ? 0x45 | 4 | Wallace
                    // ? 0x45 | 5 | Lyn
                    // ? 0x45 | 6 | Wil
                    // ? 0x45 | 7 | Kent
                    // ? 0x46 | 0 | Sain
                    // ? 0x46 | 1 | Florina
                    // ? 0x46 | 2 | Rath
                    // ? 0x46 | 3 | Dart
                    // ? 0x46 | 4 | Isadora
                    // ! 0x46 | 5 | ???
                    // ? 0x46 | 6 | Legault
                    // ? 0x46 | 7 | Karla
                    // ? 0x47 | 0 | Harken
                    // ! 0x47 | 1 | ???
                    // ! 0x47 | 2 | ???
                    // ! 0x47 | 3 | ???
                    // ! 0x47 | 4 | ???
                    // ! 0x47 | 5 | ???
                    // ! 0x47 | 6 | ???
                    // ! 0x47 | 7 | ???
                  ],
                },
                {
                  name: "Battle History",
                  items: [
                    {
                      name: "Checksum",
                      offset: 0x70d4,
                      type: "checksum",
                      dataType: "uint16",
                      control: {
                        offsetStart: 0x7044,
                        offsetEnd: 0x70d4,
                      },
                    },
                    {
                      length: 0x18,
                      type: "container",
                      instanceType: "tabs",
                      instances: 6,
                      resource: "battleHistories",
                      vertical: true,
                      items: [
                        // todo 0x7044 | 0 | Display Entry (Cleared?)
                        // ! 0x7044 | 1 | ???
                        // ! 0x7044 | 2 | ???
                        // ! 0x7044 | 3 | ???
                        // ? 0x7044 | 4[3] | Tactics
                        // ? 0x7044 | 7[3] | Survival
                        // ? 0x7045 | 2[3] | Funds
                        // ? 0x7045 | 5[3] | Experience
                        // ? 0x7046 | 0[3] | Combat
                        // ! 0x7046 | 3 | ???
                        // ! 0x7046 | 4 | ???
                        // ! 0x7046 | 5 | ???
                        // todo 0x7046 | 6 | Display Name + Score
                        // ? 0x7046 | 7[8] | Score
                        // ! 0x7047 | 7 | ???
                        // ! 0x7048 | 0 | ???
                        // ! 0x7048 | 1 | ???
                        // ! 0x7048 | 2 | ???
                        // ! 0x7048 | 3 | ???
                        // ! 0x7048 | 4 | ???
                        // ! 0x7048 | 5 | ???
                        // ! 0x7048 | 6 | ???
                        // # Time
                        // ? 0x7048 | 7[8] | Hours
                        // ! 0x7049 | 7[2] | ???
                        // ? 0x704A | 1[6] | Minutes
                        // ? 0x704A | 7[6] | Seconds
                        // ? 0x704B | 5[24] | Assets
                        // ? 0x704E | 5[6] | Screens
                        // ! 0x704F | 3[5] | ???
                        // ? 0x7050 | string[7] | Name
                        // ! 0x7058 | uint8 | ???
                        // ! 0x7059 | uint8 | ???
                        // ! 0x705A | uint8 | ???
                        // ! 0x705B | uint8 | ???
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
    battleHistories: {
      0x0: "Lyn's Tale: Normal",
      0x1: "Eliwood's Tale: Normal",
      0x2: "Hector's Tale: Normal",
      0x3: "Lyn's Tale: Hard",
      0x4: "Eliwood's Tale: Hard",
      0x5: "Hector's Tale: Hard",
    },
    birthMonths: {
      0x0: "January",
      0x1: "February",
      0x2: "March",
      0x3: "April",
      0x4: "May",
      0x5: "June",
      0x6: "July",
      0x7: "August",
      0x8: "September",
      0x9: "October",
      0xa: "November",
      0xb: "December",
    },
    characterEnum,
    characters: {
      0x0: "-",
      ...characters,
    },
    classes: {
      0x0: "-",
      0x1: "Lord (Eliwood)",
      0x2: "Lord (Lyn)",
      0x3: "Lord (Hector)",
      0x4: "Knight Lord (Eliwood)",
      0x5: "Blade Lord (Lyn)",
      0x6: "Great Lord (Hector)",
      0x7: "Knight Lord (Eliwood)",
      0x8: "Blade Lord (Lyn)",
      0x9: "Great Lord (Hector)",
      0xa: "Mercenary (Male)",
      0xb: "Mercenary (Female)",
      0xc: "Hero (Male)",
      0xd: "Hero (Female)",
      0xe: "Myrmidon (Male)",
      0xf: "Myrmidon (Female)",
      0x10: "Swordmaster (Male)",
      0x11: "Swordmaster (Female)",
      0x12: "Fighter",
      0x13: "Warrior",
      0x14: "Knight (Male)",
      0x15: "Knight (Female)",
      0x16: "General (Male)",
      0x17: "General (Female)",
      0x18: "Archer (Male)",
      0x19: "Archer (Female)",
      0x1a: "Sniper (Male)",
      0x1b: "Sniper (Female)",
      0x1c: "Monk",
      0x1d: "Cleric",
      0x1e: "Bishop (Male)",
      0x1f: "Bishop (Female)",
      0x20: "Mage (Male)",
      0x21: "Mage (Female)",
      0x22: "Sage (Male)",
      0x23: "Sage (Female)",
      0x24: "Shaman (Male)",
      0x25: "Shaman (Female)",
      0x26: "Druid (Male)",
      0x27: "Druid (Female)",
      0x28: "Cavalier (Male)",
      0x29: "Cavalier (Female)",
      0x2a: "Paladin (Male)",
      0x2b: "Paladin (Female)",
      0x2c: "Troubadour",
      0x2d: "Valkyrie",
      0x2e: "Nomad (Male)",
      0x2f: "Nomad (Female)",
      0x30: "Nmd Trooper (Male)",
      0x31: "Nmd Trooper (Female)",
      0x32: "Peg Knight",
      0x33: "Falcoknight",
      0x34: "Wyvern Rider (Male)",
      0x35: "Wyvern Rider (Female)",
      0x36: "Wyvern Lord (Male)",
      0x37: "Wyvern Lord (Female)",
      0x38: "Soldier",
      0x39: "Brigand",
      0x3a: "Pirate",
      0x3b: "Berserker",
      0x3c: "Thief (Male)",
      0x3d: "Thief (Female)",
      0x3e: "Assassin",
      0x3f: "Civilian",
      0x40: "Dancer",
      0x41: "Bard",
      0x42: "Archsage",
      0x43: "Magic Seal",
      0x44: "Transporter",
      0x45: "Dark Druid",
      0x46: "Fire Dragon",
      0x47: "Civilian",
      0x48: "Civilian",
      // 0x49: "",
      0x4a: "Bramimond",
      0x4b: "Peer",
      0x4c: "Peer",
      0x4d: "Prince",
      0x4e: "Queen",
      0x4f: "Civilian",
      0x50: "Corsair",
      0x51: "Prince",
      0x52: "Prince",
      0x53: "Prince",
      0x54: "Child",
      0x55: "Fire Dragon",
      0x56: "Warrior",
      0x57: "Child",
      0x58: "Child",
      0x59: "Transporter",
      0x5a: "Sage",
    },
    difficulties: {
      0x0: "Normal",
      0x1: "Hard",
    },
    eliwoodChapters,
    genders: {
      0x0: "Male",
      0x1: "Female",
    },
    hectorChapters,
    items: {
      0x0: "-",
      ...items,
    },
    lynChapters,
    mainCharacters: {
      0x1: "Lyn",
      0x2: "Eliwood",
      0x3: "Hector",
    },
    progressions: {
      0x0: "-",
      0x1: "Cleared",
    },
  },
  resourcesGroups: {
    items: itemsGroups,
  },
};

export default template;
