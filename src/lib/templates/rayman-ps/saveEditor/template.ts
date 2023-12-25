import type { GameJson } from "$lib/types";

export const europeValidator = [
  0x42, 0x45, 0x53, 0x4c, 0x45, 0x53, 0x2d, 0x30, 0x30, 0x30, 0x34, 0x39,
];
export const usaValidator = [
  0x42, 0x49, 0x53, 0x4c, 0x55, 0x53, 0x2d, 0x30, 0x30, 0x30, 0x30, 0x35,
];
export const japanValidator = [
  0x42, 0x49, 0x53, 0x4c, 0x50, 0x53, 0x2d, 0x30, 0x30, 0x30, 0x32, 0x36,
];

const template: GameJson = {
  validator: {
    regions: {
      europe: [
        {
          $or: [...Array(15).keys()].map((index) => ({
            [0x8a + index * 0x80]: europeValidator,
          })),
        },
      ],
      usa: [
        {
          $or: [...Array(15).keys()].map((index) => ({
            [0x8a + index * 0x80]: usaValidator,
          })),
        },
      ],
      japan: [
        {
          $or: [...Array(15).keys()].map((index) => ({
            [0x8a + index * 0x80]: japanValidator,
          })),
        },
      ],
    },
    text: "Drag 'n' drop here or click to add a save file.",
    error: "Not a valid save file.",
  },
  items: [
    {
      length: 0x2000,
      type: "container",
      instanceType: "tabs",
      instances: 15,
      enumeration: "Slot %d",
      disableSubinstanceIf: "checkSlots()",
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
                      name: "Filename",
                      offset: 0x200b,
                      length: 0x3,
                      type: "variable",
                      dataType: "string",
                      letterDataType: "uint8",
                      disabled: true,
                      fallback: 0x20,
                      resource: "letters",
                    },
                    {
                      id: "progression-%index%",
                      name: "Progression",
                      offset: 0x200f,
                      length: 0x3,
                      type: "variable",
                      dataType: "string",
                      letterDataType: "uint8",
                      disabled: true,
                    },
                  ],
                },
                {
                  type: "section",
                  flex: true,
                  items: [
                    {
                      name: "Continues",
                      offset: 0x2200,
                      type: "variable",
                      dataType: "uint8",
                      max: 99,
                    },
                    {
                      name: "Lifes",
                      offset: 0x2400,
                      type: "variable",
                      dataType: "uint8",
                      max: 99,
                    },
                    {
                      name: "Health",
                      type: "group",
                      mode: "fraction",
                      items: [
                        {
                          id: "health",
                          offset: 0x2480,
                          type: "variable",
                          dataType: "uint8",
                          operations: [{ "+": 1 }],
                          min: 1,
                          max: 5,
                        },
                        {
                          id: "healthMax",
                          offset: 0x2409,
                          type: "variable",
                          dataType: "uint8",
                          resource: "health",
                        },
                      ],
                    },
                    {
                      name: "Tins",
                      offset: 0x2406,
                      type: "variable",
                      dataType: "uint8",
                      max: 99,
                    },
                  ],
                },
                {
                  type: "section",
                  flex: true,
                  items: [
                    {
                      name: "Current Level",
                      offset: 0x3080,
                      type: "variable",
                      dataType: "uint8",
                      resource: "levels",
                      autocomplete: true,
                    },
                    {
                      name: "Position X (Camera)",
                      offset: 0x3100,
                      type: "variable",
                      dataType: "uint8",
                      hidden: true,
                    },
                  ],
                },
                {
                  type: "section",
                  items: [
                    {
                      name: "Unlocked Powers",
                      type: "bitflags",
                      flags: [
                        { offset: 0x2300, bit: 0, name: "Punch" },
                        { offset: 0x2300, bit: 1, name: "Hang" },
                        { offset: 0x2300, bit: 2, name: "Helicopter" },
                        { offset: 0x2300, bit: 3, name: "???", hidden: true },
                        { offset: 0x2300, bit: 4, name: "???", hidden: true },
                        { offset: 0x2300, bit: 5, name: "???", hidden: true },
                        { offset: 0x2300, bit: 6, name: "???", hidden: true },
                        { offset: 0x2300, bit: 7, name: "Grab" },
                        { offset: 0x2301, bit: 0, name: "Run" },
                      ],
                    },
                  ],
                },
              ],
            },
            {
              name: "Levels",
              flex: true,
              items: [
                {
                  type: "list",
                  items: [
                    {
                      name: "Pink Plant Woods",
                      items: [
                        {
                          id: "total-level-1-%index%",
                          name: "Unlock + Electoons",
                          offset: 0x2280,
                          type: "variable",
                          dataType: "uint8",
                          hidden: true,
                        },
                        {
                          id: "level-1-%index%",
                          type: "bitflags",
                          flags: [
                            {
                              offset: 0x2280,
                              bit: 0,
                              name: "Unlocked",
                              separator: true,
                            },
                            { offset: 0x2521, bit: 6, name: "Cage 1" },
                            { offset: 0x2529, bit: 2, name: "Cage 2" },
                            { offset: 0x2529, bit: 4, name: "Cage 3" },
                            { offset: 0x2529, bit: 5, name: "Cage 4" },
                            { offset: 0x256a, bit: 5, name: "Cage 5" },
                            { offset: 0x256a, bit: 7, name: "Cage 6" },
                          ],
                        },
                      ],
                    },
                    {
                      name: "Anguish Lagoon",
                      items: [
                        {
                          id: "total-level-2-%index%",
                          name: "Unlock + Electoons",
                          offset: 0x2281,
                          type: "variable",
                          dataType: "uint8",
                          hidden: true,
                        },
                        {
                          id: "level-2-%index%",
                          type: "bitflags",
                          flags: [
                            {
                              offset: 0x2281,
                              bit: 0,
                              name: "Unlocked",
                              separator: true,
                            },
                            { offset: 0x2583, bit: 0, name: "Cage 1" },
                            { offset: 0x2584, bit: 3, name: "Cage 2" },
                            { offset: 0x2584, bit: 5, name: "Cage 3" },
                            { offset: 0x2584, bit: 6, name: "Cage 4" },
                            { offset: 0x2584, bit: 7, name: "Cage 5" },
                            { offset: 0x25c3, bit: 6, name: "Cage 6" },
                          ],
                        },
                      ],
                    },
                    {
                      name: "The Swamps of Forgetfulness",
                      items: [
                        {
                          id: "total-level-3-%index%",
                          name: "Unlock + Electoons",
                          offset: 0x2282,
                          type: "variable",
                          dataType: "uint8",
                          hidden: true,
                        },
                        {
                          id: "level-3-%index%",
                          type: "bitflags",
                          flags: [
                            {
                              offset: 0x2282,
                              bit: 0,
                              name: "Unlocked",
                              separator: true,
                            },
                            { offset: 0x2600, bit: 4, name: "Cage 1" },
                            { offset: 0x2600, bit: 5, name: "Cage 2" },
                            { offset: 0x2626, bit: 1, name: "Cage 3" },
                            { offset: 0x2627, bit: 7, name: "Cage 4" },
                            { offset: 0x2648, bit: 1, name: "Cage 5" },
                            { offset: 0x2648, bit: 2, name: "Cage 6" },
                          ],
                        },
                      ],
                    },
                    {
                      name: "Moskito's Nest",
                      items: [
                        {
                          id: "total-level-4-%index%",
                          name: "Unlock + Electoons",
                          offset: 0x2283,
                          type: "variable",
                          dataType: "uint8",
                          hidden: true,
                        },
                        {
                          id: "level-4-%index%",
                          type: "bitflags",
                          flags: [
                            {
                              offset: 0x2283,
                              bit: 0,
                              name: "Unlocked",
                              separator: true,
                            },
                            { offset: 0x2667, bit: 2, name: "Cage 1" },
                            { offset: 0x2667, bit: 3, name: "Cage 2" },
                            { offset: 0x2667, bit: 6, name: "Cage 3" },
                            { offset: 0x2689, bit: 0, name: "Cage 4" },
                            { offset: 0x2689, bit: 1, name: "Cage 5" },
                            { offset: 0x2689, bit: 3, name: "Cage 6" },
                          ],
                        },
                      ],
                    },
                    {
                      name: "Bongo Hills",
                      items: [
                        {
                          id: "total-level-5-%index%",
                          name: "Unlock + Electoons",
                          offset: 0x2284,
                          type: "variable",
                          dataType: "uint8",
                          hidden: true,
                        },
                        {
                          id: "level-5-%index%",
                          type: "bitflags",
                          flags: [
                            {
                              offset: 0x2284,
                              bit: 0,
                              name: "Unlocked",
                              separator: true,
                            },
                            { offset: 0x27aa, bit: 0, name: "Cage 1" },
                            { offset: 0x27d3, bit: 5, name: "Cage 2" },
                            { offset: 0x27e8, bit: 3, name: "Cage 3" },
                            { offset: 0x2810, bit: 3, name: "Cage 4" },
                            { offset: 0x2832, bit: 0, name: "Cage 5" },
                            { offset: 0x2832, bit: 1, name: "Cage 6" },
                          ],
                        },
                      ],
                    },
                    {
                      name: "Allegro Presto",
                      items: [
                        {
                          id: "total-level-6-%index%",
                          name: "Unlock + Electoons",
                          offset: 0x2285,
                          type: "variable",
                          dataType: "uint8",
                          hidden: true,
                        },
                        {
                          id: "level-6-%index%",
                          type: "bitflags",
                          flags: [
                            {
                              offset: 0x2285,
                              bit: 0,
                              name: "Unlocked",
                              separator: true,
                            },
                            { offset: 0x2860, bit: 2, name: "Cage 1" },
                            { offset: 0x2860, bit: 4, name: "Cage 2" },
                            { offset: 0x2860, bit: 5, name: "Cage 3" },
                            { offset: 0x288f, bit: 7, name: "Cage 4" },
                            { offset: 0x28a1, bit: 0, name: "Cage 5" },
                            { offset: 0x28a1, bit: 2, name: "Cage 6" },
                          ],
                        },
                      ],
                    },
                    {
                      name: "Gong Heights",
                      items: [
                        {
                          id: "total-level-7-%index%",
                          name: "Unlock + Electoons",
                          offset: 0x2286,
                          type: "variable",
                          dataType: "uint8",
                          hidden: true,
                        },
                        {
                          id: "level-7-%index%",
                          type: "bitflags",
                          flags: [
                            {
                              offset: 0x2286,
                              bit: 0,
                              name: "Unlocked",
                              separator: true,
                            },
                            { offset: 0x2900, bit: 2, name: "Cage 1" },
                            { offset: 0x2900, bit: 4, name: "Cage 2" },
                            { offset: 0x2900, bit: 5, name: "Cage 3" },
                            { offset: 0x2900, bit: 7, name: "Cage 4" },
                            { offset: 0x2920, bit: 3, name: "Cage 5" },
                            { offset: 0x2920, bit: 6, name: "Cage 6" },
                          ],
                        },
                      ],
                    },
                    {
                      name: "Mr Sax's Hullaballoo",
                      items: [
                        {
                          id: "total-level-8-%index%",
                          name: "Unlock + Electoons",
                          offset: 0x2287,
                          type: "variable",
                          dataType: "uint8",
                          hidden: true,
                        },
                        {
                          id: "level-8-%index%",
                          type: "bitflags",
                          flags: [
                            {
                              offset: 0x2287,
                              bit: 0,
                              name: "Unlocked",
                              separator: true,
                            },
                            { offset: 0x2954, bit: 2, name: "Cage 1" },
                            { offset: 0x2954, bit: 3, name: "Cage 2" },
                            { offset: 0x2954, bit: 4, name: "Cage 3" },
                            { offset: 0x2954, bit: 5, name: "Cage 4" },
                            { offset: 0x2954, bit: 6, name: "Cage 5" },
                            { offset: 0x2954, bit: 7, name: "Cage 6" },
                          ],
                        },
                      ],
                    },
                    {
                      name: "Twilight Gulch",
                      items: [
                        {
                          id: "total-level-9-%index%",
                          name: "Unlock + Electoons",
                          offset: 0x2288,
                          type: "variable",
                          dataType: "uint8",
                          hidden: true,
                        },
                        {
                          id: "level-9-%index%",
                          type: "bitflags",
                          flags: [
                            {
                              offset: 0x2288,
                              bit: 0,
                              name: "Unlocked",
                              separator: true,
                            },
                            { offset: 0x29ea, bit: 1, name: "Cage 1" },
                            { offset: 0x29ea, bit: 2, name: "Cage 2" },
                            { offset: 0x29eb, bit: 4, name: "Cage 3" },
                            { offset: 0x29eb, bit: 5, name: "Cage 4" },
                            { offset: 0x29eb, bit: 6, name: "Cage 5" },
                            { offset: 0x29eb, bit: 7, name: "Cage 6" },
                          ],
                        },
                      ],
                    },
                    {
                      name: "The Hard Rocks",
                      items: [
                        {
                          id: "total-level-10-%index%",
                          name: "Unlock + Electoons",
                          offset: 0x2289,
                          type: "variable",
                          dataType: "uint8",
                          hidden: true,
                        },
                        {
                          id: "level-10-%index%",
                          type: "bitflags",
                          flags: [
                            {
                              offset: 0x2289,
                              bit: 0,
                              name: "Unlocked",
                              separator: true,
                            },
                            { offset: 0x2a37, bit: 6, name: "Cage 1" },
                            { offset: 0x2a44, bit: 5, name: "Cage 2" },
                            { offset: 0x2a44, bit: 6, name: "Cage 3" },
                            { offset: 0x2a69, bit: 0, name: "Cage 4" },
                            { offset: 0x2a69, bit: 1, name: "Cage 5" },
                            { offset: 0x2a6a, bit: 6, name: "Cage 6" },
                          ],
                        },
                      ],
                    },
                    {
                      name: "Mr Stone's Peaks",
                      items: [
                        {
                          id: "total-level-11-%index%",
                          name: "Unlock + Electoons",
                          offset: 0x228a,
                          type: "variable",
                          dataType: "uint8",
                          hidden: true,
                        },
                        {
                          id: "level-11-%index%",
                          type: "bitflags",
                          flags: [
                            {
                              offset: 0x228a,
                              bit: 0,
                              name: "Unlocked",
                              separator: true,
                            },
                            { offset: 0x2a90, bit: 0, name: "Cage 1" },
                            { offset: 0x2a90, bit: 1, name: "Cage 2" },
                            { offset: 0x2aa5, bit: 7, name: "Cage 3" },
                            { offset: 0x2ac6, bit: 1, name: "Cage 4" },
                            { offset: 0x2af3, bit: 0, name: "Cage 5" },
                            { offset: 0x2af4, bit: 7, name: "Cage 6" },
                          ],
                        },
                      ],
                    },
                    {
                      name: "Eraser Plains",
                      items: [
                        {
                          id: "total-level-12-%index%",
                          name: "Unlock + Electoons",
                          offset: 0x228b,
                          type: "variable",
                          dataType: "uint8",
                          hidden: true,
                        },
                        {
                          id: "level-12-%index%",
                          type: "bitflags",
                          flags: [
                            {
                              offset: 0x228b,
                              bit: 0,
                              name: "Unlocked",
                              separator: true,
                            },
                            { offset: 0x2b93, bit: 3, name: "Cage 1" },
                            { offset: 0x2b93, bit: 4, name: "Cage 2" },
                            { offset: 0x2bb2, bit: 3, name: "Cage 3" },
                            { offset: 0x2bcf, bit: 1, name: "Cage 4" },
                            { offset: 0x2bcf, bit: 2, name: "Cage 5" },
                            { offset: 0x2bd0, bit: 7, name: "Cage 6" },
                          ],
                        },
                      ],
                    },
                    {
                      name: "Pencil Pentathlon",
                      items: [
                        {
                          id: "total-level-13-%index%",
                          name: "Unlock + Electoons",
                          offset: 0x228c,
                          type: "variable",
                          dataType: "uint8",
                          hidden: true,
                        },
                        {
                          id: "level-13-%index%",
                          type: "bitflags",
                          flags: [
                            {
                              offset: 0x228c,
                              bit: 0,
                              name: "Unlocked",
                              separator: true,
                            },
                            { offset: 0x2c17, bit: 0, name: "Cage 1" },
                            { offset: 0x2c18, bit: 7, name: "Cage 2" },
                            { offset: 0x2c2a, bit: 0, name: "Cage 3" },
                            { offset: 0x2c2a, bit: 2, name: "Cage 4" },
                            { offset: 0x2c4b, bit: 1, name: "Cage 5" },
                            { offset: 0x2c4c, bit: 7, name: "Cage 6" },
                          ],
                        },
                      ],
                    },
                    {
                      name: "Space Mama's Crater",
                      items: [
                        {
                          id: "total-level-14-%index%",
                          name: "Unlock + Electoons",
                          offset: 0x228d,
                          type: "variable",
                          dataType: "uint8",
                          hidden: true,
                        },
                        {
                          id: "level-14-%index%",
                          type: "bitflags",
                          flags: [
                            {
                              offset: 0x228d,
                              bit: 0,
                              name: "Unlocked",
                              separator: true,
                            },
                            { offset: 0x2c68, bit: 2, name: "Cage 1" },
                            { offset: 0x2c68, bit: 3, name: "Cage 2" },
                            { offset: 0x2c81, bit: 0, name: "Cage 3" },
                            { offset: 0x2c81, bit: 2, name: "Cage 4" },
                            { offset: 0x2cb3, bit: 4, name: "Cage 5" },
                            { offset: 0x2cb3, bit: 5, name: "Cage 6" },
                          ],
                        },
                      ],
                    },
                    {
                      name: "Crystal Palace",
                      items: [
                        {
                          id: "total-level-15-%index%",
                          name: "Unlock + Electoons",
                          offset: 0x228e,
                          type: "variable",
                          dataType: "uint8",
                          hidden: true,
                        },
                        {
                          id: "level-15-%index%",
                          type: "bitflags",
                          flags: [
                            {
                              offset: 0x228e,
                              bit: 0,
                              name: "Unlocked",
                              separator: true,
                            },
                            { offset: 0x2d2c, bit: 1, name: "Cage 1" },
                            { offset: 0x2d2c, bit: 4, name: "Cage 2" },
                            { offset: 0x2d2c, bit: 5, name: "Cage 3" },
                            { offset: 0x2d4b, bit: 0, name: "Cage 4" },
                            { offset: 0x2d4c, bit: 6, name: "Cage 5" },
                            { offset: 0x2d4c, bit: 7, name: "Cage 6" },
                          ],
                        },
                      ],
                    },
                    {
                      name: "Eat At Joe's",
                      items: [
                        {
                          id: "total-level-16-%index%",
                          name: "Unlock + Electoons",
                          offset: 0x228f,
                          type: "variable",
                          dataType: "uint8",
                          hidden: true,
                        },
                        {
                          id: "level-16-%index%",
                          type: "bitflags",
                          flags: [
                            {
                              offset: 0x228f,
                              bit: 0,
                              name: "Unlocked",
                              separator: true,
                            },
                            { offset: 0x2d87, bit: 3, name: "Cage 1" },
                            { offset: 0x2db1, bit: 1, name: "Cage 2" },
                            { offset: 0x2db1, bit: 3, name: "Cage 3" },
                            { offset: 0x2db1, bit: 4, name: "Cage 4" },
                            { offset: 0x2de0, bit: 6, name: "Cage 5" },
                            { offset: 0x2e07, bit: 4, name: "Cage 6" },
                          ],
                        },
                      ],
                    },
                    {
                      name: "Mr Skops' Stalactites",
                      items: [
                        {
                          id: "total-level-17-%index%",
                          name: "Unlock + Electoons",
                          offset: 0x2290,
                          type: "variable",
                          dataType: "uint8",
                          hidden: true,
                        },
                        {
                          id: "level-17-%index%",
                          type: "bitflags",
                          flags: [
                            {
                              offset: 0x2290,
                              bit: 0,
                              name: "Unlocked",
                              separator: true,
                            },
                            { offset: 0x2e20, bit: 1, name: "Cage 1" },
                            { offset: 0x2e20, bit: 2, name: "Cage 2" },
                            { offset: 0x2e20, bit: 3, name: "Cage 3" },
                            { offset: 0x2e20, bit: 4, name: "Cage 4" },
                            { offset: 0x2e20, bit: 5, name: "Cage 5" },
                            { offset: 0x2e20, bit: 6, name: "Cage 6" },
                          ],
                        },
                      ],
                    },
                    {
                      name: "Mr Dark's Dare",
                      items: [
                        {
                          type: "bitflags",
                          flags: [{ offset: 0x2291, bit: 0, name: "Unlocked" }],
                        },
                      ],
                    },
                    {
                      name: "The Dream Forest (Save)",
                      items: [
                        {
                          type: "bitflags",
                          flags: [{ offset: 0x2292, bit: 0, name: "Unlocked" }],
                        },
                      ],
                    },
                    {
                      name: "Band Land (Save)",
                      items: [
                        {
                          type: "bitflags",
                          flags: [{ offset: 0x2293, bit: 0, name: "Unlocked" }],
                        },
                      ],
                    },
                    {
                      name: "Blue Mountains (Save)",
                      items: [
                        {
                          type: "bitflags",
                          flags: [{ offset: 0x2294, bit: 0, name: "Unlocked" }],
                        },
                      ],
                    },
                    {
                      name: "Picture City (Save)",
                      items: [
                        {
                          type: "bitflags",
                          flags: [{ offset: 0x2295, bit: 0, name: "Unlocked" }],
                        },
                      ],
                    },
                    {
                      name: "The Caves of Skops (Save)",
                      items: [
                        {
                          type: "bitflags",
                          flags: [{ offset: 0x2296, bit: 0, name: "Unlocked" }],
                        },
                      ],
                    },
                    {
                      name: "Candy Chateau (Save)",
                      items: [
                        {
                          type: "bitflags",
                          flags: [{ offset: 0x2297, bit: 0, name: "Unlocked" }],
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
    health: {
      0x2: "3 Points",
      0x4: "5 Points",
    },
    letters: {
      0x20: " ",
      0x61: "A",
      0x62: "B",
      0x63: "C",
      0x64: "D",
      0x65: "E",
      0x66: "F",
      0x67: "G",
      0x68: "H",
      0x69: "I",
      0x6a: "J",
      0x6b: "K",
      0x6c: "L",
      0x6d: "M",
      0x6e: "N",
      0x6f: "O",
      0x70: "P",
      0x71: "Q",
      0x72: "R",
      0x73: "S",
      0x74: "T",
      0x75: "U",
      0x76: "V",
      0x77: "W",
      0x78: "X",
      0x79: "Y",
      0x7a: "Z",
    },
    levels: {
      0x0: "Pink Plant Woods",
      0x1: "Anguish Lagoon",
      0x2: "The Swamps of Forgetfulness",
      0x3: "Moskito's Nest",
      0x4: "Bongo Hills",
      0x5: "Allegro Presto",
      0x6: "Gong Heights",
      0x7: "Mr Sax's Hullaballoo",
      0x8: "Twilight Gulch",
      0x9: "The Hard Rocks",
      0xa: "Mr Stone's Peaks",
      0xb: "Eraser Plains",
      0xc: "Pencil Pentathlon",
      0xd: "Space Mama's Crater",
      0xe: "Crystal Palace",
      0xf: "Eat At Joe's",
      0x10: "Mr Skops' Stalactites",
      0x11: "Mr Dark's Dare",
      0x12: "The Dream Forest (Save)",
      0x13: "Band Land (Save)",
      0x14: "Blue Mountains (Save)",
      0x15: "Picture City (Save)",
      0x16: "The Caves of Skops (Save)",
      0x17: "Candy Chateau (Save)",
    },
  },
};

export default template;
