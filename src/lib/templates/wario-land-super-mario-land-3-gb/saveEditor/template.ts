import type { GameJson } from "$lib/types";

const template: GameJson = {
  validator: {
    regions: {
      world: { 0x0: [0x19, 0x64, 0x39, 0x57] },
    },
    text: "Drag 'n' drop here or click to add a save file.",
    error: "Not a valid save file.",
  },
  items: [
    {
      length: 0x40,
      type: "container",
      instanceType: "tabs",
      instances: 3,
      enumeration: "Slot %d",
      disableSubinstanceIf: {
        offset: 0xb,
        type: "variable",
        dataType: "uint8",
        value: 0x0,
      },
      items: [
        {
          name: "Checksum",
          offset: 0xc0,
          overrideStep: {
            parent: 1,
            step: 0x1,
          },
          type: "checksum",
          dataType: "uint8",
          control: {
            offset: 0x0,
            length: 0x20,
          },
        },
        {
          type: "tabs",
          items: [
            {
              name: "General",
              items: [
                {
                  type: "list",
                  items: [
                    {
                      name: "General",
                      items: [
                        {
                          type: "section",
                          flex: true,
                          items: [
                            {
                              name: "Number of Completed Level",
                              offset: 0xd,
                              type: "variable",
                              dataType: "uint8",
                              binaryCodedDecimal: true,
                              disabled: true,
                            },
                            {
                              name: "Progression",
                              offset: 0x17,
                              type: "variable",
                              dataType: "uint8",
                              resource: "progressions",
                            },
                            {
                              name: "Gold Coins",
                              offset: 0x5,
                              type: "variable",
                              dataType: "uint24",
                              binaryCodedDecimal: true,
                              bigEndian: true,
                            },
                            {
                              name: "Current Course",
                              offset: 0x4,
                              type: "variable",
                              dataType: "uint8",
                              resource: "courses",
                              autocomplete: true,
                            },
                          ],
                        },
                        {
                          type: "section",
                          flex: true,
                          items: [
                            {
                              name: "Lifes",
                              offset: 0x9,
                              type: "variable",
                              dataType: "uint8",
                              binaryCodedDecimal: true,
                            },
                            {
                              name: "Hearts",
                              offset: 0x8,
                              type: "variable",
                              dataType: "uint8",
                              binaryCodedDecimal: true,
                            },
                            {
                              name: "Power Up",
                              offset: 0xa,
                              type: "variable",
                              dataType: "uint8",
                              resource: "hats",
                            },
                          ],
                        },
                      ],
                    },
                    {
                      name: "Treasures",
                      items: [
                        {
                          type: "bitflags",
                          flags: [
                            {
                              offset: 0xe,
                              bit: 5,
                              name: "Treasure A: Golden Horn",
                            },
                            {
                              offset: 0xf,
                              bit: 3,
                              name: "Treasure B: Harp",
                            },
                            {
                              offset: 0xe,
                              bit: 1,
                              name: "Treasure C: Crown",
                            },
                            {
                              offset: 0xf,
                              bit: 4,
                              name: "Treasure D: Shield",
                            },
                            {
                              offset: 0xf,
                              bit: 7,
                              name: "Treasure E: Bell",
                            },
                            {
                              offset: 0xe,
                              bit: 3,
                              name: "Treasure F: Lamp",
                            },
                            {
                              offset: 0xf,
                              bit: 5,
                              name: "Treasure G: Crystal Ball",
                            },
                            {
                              offset: 0xe,
                              bit: 7,
                              name: "Treasure H: Chalice",
                            },
                            {
                              offset: 0xe,
                              bit: 2,
                              name: "Treasure I: Dagger",
                            },
                            {
                              offset: 0xf,
                              bit: 6,
                              name: "Treasure J: Axe",
                            },
                            {
                              offset: 0xf,
                              bit: 2,
                              name: "Treasure K: Football",
                            },
                            {
                              offset: 0xf,
                              bit: 1,
                              name: "Treasure L: Idol",
                            },
                            {
                              offset: 0xf,
                              bit: 0,
                              name: "Treasure M: Golden Glove",
                            },
                            {
                              offset: 0xe,
                              bit: 6,
                              name: "Treasure N: Whale",
                            },
                            {
                              offset: 0xe,
                              bit: 4,
                              name: "Treasure O: Diamond Ring",
                            },
                          ],
                        },
                      ],
                    },
                    {
                      name: "Checkpoint",
                      flex: true,
                      items: [
                        {
                          name: "Checkpoint",
                          type: "section",
                          background: true,
                          items: [
                            {
                              name: "Enabled",
                              offset: 0x15,
                              type: "variable",
                              dataType: "boolean",
                            },
                          ],
                        },
                        {
                          name: "Checkpoint Level",
                          offset: 0x16,
                          type: "variable",
                          dataType: "uint8",
                          resource: "courses",
                          autocomplete: true,
                        },
                      ],
                    },
                  ],
                },
              ],
            },
            {
              name: "Completed Levels",
              flex: true,
              items: [
                {
                  id: "level-1",
                  name: "Rice Beach",
                  type: "bitflags",
                  flags: [
                    { offset: 0xb, bit: 0, name: "Course 01" },
                    { offset: 0xb, bit: 1, name: "Course 02" },
                    { offset: 0xb, bit: 2, name: "Course 03" },
                    { offset: 0xb, bit: 3, name: "Course 03'" },
                    { offset: 0xb, bit: 4, name: "Course 04" },
                    { offset: 0xb, bit: 5, name: "Course 05" },
                    { offset: 0xb, bit: 6, name: "Course 06" },
                  ],
                },
                {
                  id: "level-2",
                  name: "Mt. Teapot",
                  type: "bitflags",
                  flags: [
                    { offset: 0xc, bit: 0, name: "Course 07" },
                    { offset: 0xc, bit: 1, name: "Course 08" },
                    { offset: 0xc, bit: 2, name: "Course 08'" },
                    { offset: 0xc, bit: 3, name: "Course 09" },
                    { offset: 0xc, bit: 4, name: "Course 10" },
                    { offset: 0xc, bit: 5, name: "Course 11" },
                    { offset: 0xc, bit: 6, name: "Course 12" },
                    { offset: 0xc, bit: 7, name: "Course 13" },
                  ],
                },
                {
                  id: "level-9",
                  name: "Sherbet Island",
                  type: "bitflags",
                  flags: [
                    { offset: 0x13, bit: 0, name: "Course 14" },
                    { offset: 0x13, bit: 1, name: "Course 15" },
                    { offset: 0x13, bit: 2, name: "Course 15'" },
                    { offset: 0x13, bit: 3, name: "Course 16" },
                    { offset: 0x13, bit: 4, name: "Course 16'" },
                    { offset: 0x13, bit: 5, name: "Course 17" },
                    { offset: 0x13, bit: 6, name: "Course 18" },
                    { offset: 0x13, bit: 7, name: "Course 19" },
                  ],
                },
                {
                  id: "level-6",
                  name: "Stove Canyon",
                  type: "bitflags",
                  flags: [
                    { offset: 0x10, bit: 0, name: "Course 20" },
                    { offset: 0x10, bit: 1, name: "Course 21" },
                    { offset: 0x10, bit: 2, name: "Course 22" },
                    { offset: 0x10, bit: 3, name: "Course 23" },
                    { offset: 0x10, bit: 4, name: "Course 23'" },
                    { offset: 0x10, bit: 5, name: "Course 24" },
                    { offset: 0x10, bit: 6, name: "Course 25" },
                  ],
                },
                {
                  id: "level-7",
                  name: "SS Tea Cup",
                  type: "bitflags",
                  flags: [
                    { offset: 0x11, bit: 0, name: "Course 26" },
                    { offset: 0x11, bit: 1, name: "Course 27" },
                    { offset: 0x11, bit: 2, name: "Course 28" },
                    { offset: 0x11, bit: 3, name: "Course 29" },
                    { offset: 0x11, bit: 4, name: "Course 20" },
                  ],
                },
                {
                  id: "level-8",
                  name: "Parsley Woods",
                  type: "bitflags",
                  flags: [
                    { offset: 0x12, bit: 0, name: "Course 31" },
                    { offset: 0x12, bit: 1, name: "Course 32" },
                    { offset: 0x12, bit: 2, name: "Course 33" },
                    { offset: 0x12, bit: 3, name: "Course 34" },
                    { offset: 0x12, bit: 4, name: "Course 35" },
                    { offset: 0x12, bit: 5, name: "Course 36" },
                  ],
                },
                {
                  id: "level-10",
                  name: "Syrup Castle",
                  type: "bitflags",
                  flags: [
                    { offset: 0x14, bit: 0, name: "Course 37" },
                    { offset: 0x14, bit: 1, name: "Course 38" },
                    { offset: 0x14, bit: 2, name: "Course 39" },
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
    courses: {
      0x0: "Course 26",
      0x1: "Course 33",
      0x2: "Course 15",
      0x3: "Course 20",
      0x4: "Course 16",
      0x5: "Course 10",
      0x6: "Course 07",
      0x7: "Course 01",
      0x8: "Course 17",
      0x9: "Course 12",
      0xa: "Course 13",
      0xb: "Course 29",
      0xc: "Course 04",
      0xd: "Course 09",
      0xe: "Course 03",
      0xf: "Course 02",
      0x10: "Course 08",
      0x11: "Course 11",
      0x12: "Course 35",
      0x13: "Course 34",
      0x14: "Course 30",
      0x15: "Course 21",
      0x16: "Course 22",
      0x17: "Course 01 (after boss)",
      0x18: "Course 19",
      0x19: "Course 05",
      0x1a: "Course 36",
      0x1b: "Course 24",
      0x1c: "Course 25",
      0x1d: "Course 32",
      0x1e: "Course 27",
      0x1f: "Course 28",
      0x20: "Course 18",
      0x21: "Course 14",
      0x22: "Course 38",
      0x23: "Course 39",
      0x24: "Course 03 (after boss)",
      0x25: "Course 37",
      // 0x26: "???", // Unused
      0x27: "Course 23",
      0x28: "Course 40",
      0x29: "Course 06",
      0x2a: "Course 31",
    },
    hats: {
      0x0: "Small Wario",
      0x1: "Wario",
      0x2: "Bull Wario",
      0x3: "Jet Wario",
      0x4: "Dragon Wario",
    },
    progressions: {
      0x0: "-",
      0x1: "Game Complete",
    },
  },
  resourcesOrder: {
    courses: [
      0x7, 0xf, 0x24, 0xc, 0x19, 0x29, 0x6, 0x10, 0xd, 0x5, 0x11, 0x9, 0xa,
      0x21, 0x2, 0x4, 0x8, 0x20, 0x18, 0x3, 0x15, 0x16, 0x27, 0x1b, 0x1c, 0x0,
      0x1e, 0x1f, 0xb, 0x14, 0x2a, 0x1d, 0x1, 0x13, 0x12, 0x1a, 0x25, 0x22,
      0x23, 0x28,
    ],
  },
};

export default template;