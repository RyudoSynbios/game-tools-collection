import type { GameJson } from "$lib/types";

const template: GameJson = {
  validator: {
    regions: {
      europe: {
        0x0: [
          0x42, 0x45, 0x53, 0x4c, 0x45, 0x53, 0x2d, 0x30, 0x30, 0x30, 0x34,
          0x39,
        ], // "BESLES-00049"
      },
      usa: {
        0x0: [
          0x42, 0x49, 0x53, 0x4c, 0x55, 0x53, 0x2d, 0x30, 0x30, 0x30, 0x30,
          0x35,
        ], // "BISLUS-00005"
      },
      japan: {
        0x0: [
          0x42, 0x49, 0x53, 0x4c, 0x50, 0x53, 0x2d, 0x30, 0x30, 0x30, 0x32,
          0x36,
        ], // "BISLPS-00026"
      },
    },
    text: "Drag 'n' drop here or click to add a save file.",
    error: "Not a valid save file.",
  },
  items: [
    {
      id: "slots",
      length: 0x2000,
      type: "container",
      instanceType: "tabs",
      instances: 3,
      enumeration: "Slot %d",
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
                      offset: 0xb,
                      length: 0x3,
                      type: "variable",
                      dataType: "string",
                      letterDataType: "uint8",
                      disabled: true,
                      fallback: 0x20,
                      resource: "letters",
                      test: true,
                    },
                    {
                      id: "progression-%index%",
                      name: "Progression",
                      offset: 0xf,
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
                      offset: 0x200,
                      type: "variable",
                      dataType: "uint8",
                      max: 99,
                    },
                    {
                      name: "Lifes",
                      offset: 0x400,
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
                          offset: 0x480,
                          type: "variable",
                          dataType: "uint8",
                          operations: [{ "+": 1 }],
                          min: 1,
                          max: 5,
                        },
                        {
                          id: "healthMax",
                          offset: 0x409,
                          type: "variable",
                          dataType: "uint8",
                          resource: "health",
                        },
                      ],
                    },
                    {
                      name: "Tins",
                      offset: 0x406,
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
                      offset: 0x1080,
                      type: "variable",
                      dataType: "uint8",
                      resource: "levels",
                      size: "lg",
                      autocomplete: true,
                    },
                    {
                      name: "Position X (Camera)",
                      offset: 0x1100,
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
                        { offset: 0x300, bit: 0, label: "Punch" },
                        { offset: 0x300, bit: 1, label: "Hang" },
                        { offset: 0x300, bit: 2, label: "Helicopter" },
                        { offset: 0x300, bit: 3, label: "???", hidden: true },
                        { offset: 0x300, bit: 4, label: "???", hidden: true },
                        { offset: 0x300, bit: 5, label: "???", hidden: true },
                        { offset: 0x300, bit: 6, label: "???", hidden: true },
                        { offset: 0x300, bit: 7, label: "Grab" },
                        { offset: 0x301, bit: 0, label: "Run" },
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
                  type: "tabs",
                  vertical: true,
                  items: [
                    {
                      name: "Pink Plant Woods",
                      items: [
                        {
                          id: "total-level-1-%index%",
                          name: "Unlock + Electoons",
                          offset: 0x280,
                          type: "variable",
                          dataType: "uint8",
                          hidden: true,
                        },
                        {
                          id: "level-1-%index%",
                          type: "bitflags",
                          flags: [
                            { offset: 0x280, bit: 0, label: "Unlocked", separator: true },
                            { offset: 0x521, bit: 6, label: "Cage 1" },
                            { offset: 0x529, bit: 2, label: "Cage 2" },
                            { offset: 0x529, bit: 4, label: "Cage 3" },
                            { offset: 0x529, bit: 5, label: "Cage 4" },
                            { offset: 0x56a, bit: 5, label: "Cage 5" },
                            { offset: 0x56a, bit: 7, label: "Cage 6" },
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
                          offset: 0x281,
                          type: "variable",
                          dataType: "uint8",
                          hidden: true,
                        },
                        {
                          id: "level-2-%index%",
                          type: "bitflags",
                          flags: [
                            { offset: 0x281, bit: 0, label: "Unlocked", separator: true },
                            { offset: 0x583, bit: 0, label: "Cage 1" },
                            { offset: 0x584, bit: 3, label: "Cage 2" },
                            { offset: 0x584, bit: 5, label: "Cage 3" },
                            { offset: 0x584, bit: 6, label: "Cage 4" },
                            { offset: 0x584, bit: 7, label: "Cage 5" },
                            { offset: 0x5c3, bit: 6, label: "Cage 6" },
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
                          offset: 0x282,
                          type: "variable",
                          dataType: "uint8",
                          hidden: true,
                        },
                        {
                          id: "level-3-%index%",
                          type: "bitflags",
                          flags: [
                            { offset: 0x282, bit: 0, label: "Unlocked", separator: true },
                            { offset: 0x600, bit: 4, label: "Cage 1" },
                            { offset: 0x600, bit: 5, label: "Cage 2" },
                            { offset: 0x626, bit: 1, label: "Cage 3" },
                            { offset: 0x627, bit: 7, label: "Cage 4" },
                            { offset: 0x648, bit: 1, label: "Cage 5" },
                            { offset: 0x648, bit: 2, label: "Cage 6" },
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
                          offset: 0x283,
                          type: "variable",
                          dataType: "uint8",
                          hidden: true,
                        },
                        {
                          id: "level-4-%index%",
                          type: "bitflags",
                          flags: [
                            { offset: 0x283, bit: 0, label: "Unlocked", separator: true },
                            { offset: 0x667, bit: 2, label: "Cage 1" },
                            { offset: 0x667, bit: 3, label: "Cage 2" },
                            { offset: 0x667, bit: 6, label: "Cage 3" },
                            { offset: 0x689, bit: 0, label: "Cage 4" },
                            { offset: 0x689, bit: 1, label: "Cage 5" },
                            { offset: 0x689, bit: 3, label: "Cage 6" },
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
                          offset: 0x284,
                          type: "variable",
                          dataType: "uint8",
                          hidden: true,
                        },
                        {
                          id: "level-5-%index%",
                          type: "bitflags",
                          flags: [
                            { offset: 0x284, bit: 0, label: "Unlocked", separator: true },
                            { offset: 0x7aa, bit: 0, label: "Cage 1" },
                            { offset: 0x7d3, bit: 5, label: "Cage 2" },
                            { offset: 0x7e8, bit: 3, label: "Cage 3" },
                            { offset: 0x810, bit: 3, label: "Cage 4" },
                            { offset: 0x832, bit: 0, label: "Cage 5" },
                            { offset: 0x832, bit: 1, label: "Cage 6" },
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
                          offset: 0x285,
                          type: "variable",
                          dataType: "uint8",
                          hidden: true,
                        },
                        {
                          id: "level-6-%index%",
                          type: "bitflags",
                          flags: [
                            { offset: 0x285, bit: 0, label: "Unlocked", separator: true },
                            { offset: 0x860, bit: 2, label: "Cage 1" },
                            { offset: 0x860, bit: 4, label: "Cage 2" },
                            { offset: 0x860, bit: 5, label: "Cage 3" },
                            { offset: 0x88f, bit: 7, label: "Cage 4" },
                            { offset: 0x8a1, bit: 0, label: "Cage 5" },
                            { offset: 0x8a1, bit: 2, label: "Cage 6" },
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
                          offset: 0x286,
                          type: "variable",
                          dataType: "uint8",
                          hidden: true,
                        },
                        {
                          id: "level-7-%index%",
                          type: "bitflags",
                          flags: [
                            { offset: 0x286, bit: 0, label: "Unlocked", separator: true },
                            { offset: 0x900, bit: 2, label: "Cage 1" },
                            { offset: 0x900, bit: 4, label: "Cage 2" },
                            { offset: 0x900, bit: 5, label: "Cage 3" },
                            { offset: 0x900, bit: 7, label: "Cage 4" },
                            { offset: 0x920, bit: 3, label: "Cage 5" },
                            { offset: 0x920, bit: 6, label: "Cage 6" },
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
                          offset: 0x287,
                          type: "variable",
                          dataType: "uint8",
                          hidden: true,
                        },
                        {
                          id: "level-8-%index%",
                          type: "bitflags",
                          flags: [
                            { offset: 0x287, bit: 0, label: "Unlocked", separator: true },
                            { offset: 0x954, bit: 2, label: "Cage 1" },
                            { offset: 0x954, bit: 3, label: "Cage 2" },
                            { offset: 0x954, bit: 4, label: "Cage 3" },
                            { offset: 0x954, bit: 5, label: "Cage 4" },
                            { offset: 0x954, bit: 6, label: "Cage 5" },
                            { offset: 0x954, bit: 7, label: "Cage 6" },
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
                          offset: 0x288,
                          type: "variable",
                          dataType: "uint8",
                          hidden: true,
                        },
                        {
                          id: "level-9-%index%",
                          type: "bitflags",
                          flags: [
                            { offset: 0x288, bit: 0, label: "Unlocked", separator: true },
                            { offset: 0x9ea, bit: 1, label: "Cage 1" },
                            { offset: 0x9ea, bit: 2, label: "Cage 2" },
                            { offset: 0x9eb, bit: 4, label: "Cage 3" },
                            { offset: 0x9eb, bit: 5, label: "Cage 4" },
                            { offset: 0x9eb, bit: 6, label: "Cage 5" },
                            { offset: 0x9eb, bit: 7, label: "Cage 6" },
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
                          offset: 0x289,
                          type: "variable",
                          dataType: "uint8",
                          hidden: true,
                        },
                        {
                          id: "level-10-%index%",
                          type: "bitflags",
                          flags: [
                            { offset: 0x289, bit: 0, label: "Unlocked", separator: true },
                            { offset: 0xa37, bit: 6, label: "Cage 1" },
                            { offset: 0xa44, bit: 5, label: "Cage 2" },
                            { offset: 0xa44, bit: 6, label: "Cage 3" },
                            { offset: 0xa69, bit: 0, label: "Cage 4" },
                            { offset: 0xa69, bit: 1, label: "Cage 5" },
                            { offset: 0xa6a, bit: 6, label: "Cage 6" },
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
                          offset: 0x28a,
                          type: "variable",
                          dataType: "uint8",
                          hidden: true,
                        },
                        {
                          id: "level-11-%index%",
                          type: "bitflags",
                          flags: [
                            { offset: 0x28a, bit: 0, label: "Unlocked", separator: true },
                            { offset: 0xa90, bit: 0, label: "Cage 1" },
                            { offset: 0xa90, bit: 1, label: "Cage 2" },
                            { offset: 0xaa5, bit: 7, label: "Cage 3" },
                            { offset: 0xac6, bit: 1, label: "Cage 4" },
                            { offset: 0xaf3, bit: 0, label: "Cage 5" },
                            { offset: 0xaf4, bit: 7, label: "Cage 6" },
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
                          offset: 0x28b,
                          type: "variable",
                          dataType: "uint8",
                          hidden: true,
                        },
                        {
                          id: "level-12-%index%",
                          type: "bitflags",
                          flags: [
                            { offset: 0x28b, bit: 0, label: "Unlocked", separator: true },
                            { offset: 0xb93, bit: 3, label: "Cage 1" },
                            { offset: 0xb93, bit: 4, label: "Cage 2" },
                            { offset: 0xbb2, bit: 3, label: "Cage 3" },
                            { offset: 0xbcf, bit: 1, label: "Cage 4" },
                            { offset: 0xbcf, bit: 2, label: "Cage 5" },
                            { offset: 0xbd0, bit: 7, label: "Cage 6" },
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
                          offset: 0x28c,
                          type: "variable",
                          dataType: "uint8",
                          hidden: true,
                        },
                        {
                          id: "level-13-%index%",
                          type: "bitflags",
                          flags: [
                            { offset: 0x28c, bit: 0, label: "Unlocked", separator: true },
                            { offset: 0xc17, bit: 0, label: "Cage 1" },
                            { offset: 0xc18, bit: 7, label: "Cage 2" },
                            { offset: 0xc2a, bit: 0, label: "Cage 3" },
                            { offset: 0xc2a, bit: 2, label: "Cage 4" },
                            { offset: 0xc4b, bit: 1, label: "Cage 5" },
                            { offset: 0xc4c, bit: 7, label: "Cage 6" },
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
                          offset: 0x28d,
                          type: "variable",
                          dataType: "uint8",
                          hidden: true,
                        },
                        {
                          id: "level-14-%index%",
                          type: "bitflags",
                          flags: [
                            { offset: 0x28d, bit: 0, label: "Unlocked", separator: true },
                            { offset: 0xc68, bit: 2, label: "Cage 1" },
                            { offset: 0xc68, bit: 3, label: "Cage 2" },
                            { offset: 0xc81, bit: 0, label: "Cage 3" },
                            { offset: 0xc81, bit: 2, label: "Cage 4" },
                            { offset: 0xcb3, bit: 4, label: "Cage 5" },
                            { offset: 0xcb3, bit: 5, label: "Cage 6" },
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
                          offset: 0x28e,
                          type: "variable",
                          dataType: "uint8",
                          hidden: true,
                        },
                        {
                          id: "level-15-%index%",
                          type: "bitflags",
                          flags: [
                            { offset: 0x28e, bit: 0, label: "Unlocked", separator: true },
                            { offset: 0xd2c, bit: 1, label: "Cage 1" },
                            { offset: 0xd2c, bit: 4, label: "Cage 2" },
                            { offset: 0xd2c, bit: 5, label: "Cage 3" },
                            { offset: 0xd4b, bit: 0, label: "Cage 4" },
                            { offset: 0xd4c, bit: 6, label: "Cage 5" },
                            { offset: 0xd4c, bit: 7, label: "Cage 6" },
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
                          offset: 0x28f,
                          type: "variable",
                          dataType: "uint8",
                          hidden: true,
                        },
                        {
                          id: "level-16-%index%",
                          type: "bitflags",
                          flags: [
                            { offset: 0x28f, bit: 0, label: "Unlocked", separator: true },
                            { offset: 0xd87, bit: 3, label: "Cage 1" },
                            { offset: 0xdb1, bit: 1, label: "Cage 2" },
                            { offset: 0xdb1, bit: 3, label: "Cage 3" },
                            { offset: 0xdb1, bit: 4, label: "Cage 4" },
                            { offset: 0xde0, bit: 6, label: "Cage 5" },
                            { offset: 0xe07, bit: 4, label: "Cage 6" },
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
                          offset: 0x290,
                          type: "variable",
                          dataType: "uint8",
                          hidden: true,
                        },
                        {
                          id: "level-17-%index%",
                          type: "bitflags",
                          flags: [
                            { offset: 0x290, bit: 0, label: "Unlocked", separator: true },
                            { offset: 0xe20, bit: 1, label: "Cage 1" },
                            { offset: 0xe20, bit: 2, label: "Cage 2" },
                            { offset: 0xe20, bit: 3, label: "Cage 3" },
                            { offset: 0xe20, bit: 4, label: "Cage 4" },
                            { offset: 0xe20, bit: 5, label: "Cage 5" },
                            { offset: 0xe20, bit: 6, label: "Cage 6" },
                          ],
                        },
                      ],
                    },
                    {
                      name: "Mr Dark's Dare",
                      items: [
                        {
                          type: "bitflags",
                          flags: [
                            { offset: 0x291, bit: 0, label: "Unlocked" }
                          ],
                        },
                      ],
                    },
                    {
                      name: "The Dream Forest (Save)",
                      items: [
                        {
                          type: "bitflags",
                          flags: [
                            { offset: 0x292, bit: 0, label: "Unlocked" }
                          ],
                        },
                      ],
                    },
                    {
                      name: "Band Land (Save)",
                      items: [
                        {
                          type: "bitflags",
                          flags: [
                            { offset: 0x293, bit: 0, label: "Unlocked" }
                          ],
                        },
                      ],
                    },
                    {
                      name: "Blue Mountains (Save)",
                      items: [
                        {
                          type: "bitflags",
                          flags: [
                            { offset: 0x294, bit: 0, label: "Unlocked" }
                          ],
                        },
                      ],
                    },
                    {
                      name: "Picture City (Save)",
                      items: [
                        {
                          type: "bitflags",
                          flags: [
                            { offset: 0x295, bit: 0, label: "Unlocked" }
                          ],
                        },
                      ],
                    },
                    {
                      name: "The Caves of Skops (Save)",
                      items: [
                        {
                          type: "bitflags",
                          flags: [
                            { offset: 0x296, bit: 0, label: "Unlocked" }
                          ],
                        },
                      ],
                    },
                    {
                      name: "Candy Chateau (Save)",
                      items: [
                        {
                          type: "bitflags",
                          flags: [
                            { offset: 0x297, bit: 0, label: "Unlocked" }
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
  resourcesLabels: {
    levels: {
      0x0: "Levels",
      0x12: "Save Points",
    },
  }
};

export default template;
