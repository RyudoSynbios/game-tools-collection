import type { GameJson } from "$lib/types";

import {
  inventory,
  jobs,
  persons,
  treasures,
  unexploredLands,
} from "./utils/resource";

const template: GameJson = {
  validator: {
    regions: {
      usa: {
        0x0: [
          0x42, 0x41, 0x53, 0x43, 0x55, 0x53, 0x2d, 0x39, 0x34, 0x32, 0x32,
          0x31, 0x46, 0x46, 0x54,
        ], // "BASCUS-94221FFT"
      },
      japan: {
        0x0: [
          0x42, 0x49, 0x53, 0x4c, 0x50, 0x53, 0x2d, 0x30, 0x30, 0x37, 0x37,
          0x30, 0x46, 0x46, 0x54,
        ], // "BISLPS-00770FFT"
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
      instances: 15,
      enumeration: "Slot %d",
      onTabChange: "onSlotChange(%d)",
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
                      name: "Checksum",
                      offset: 0x117,
                      type: "checksum",
                      dataType: "uint32",
                      control: {
                        offsetStart: 0x0,
                        offsetEnd: 0x74,
                      },
                    },
                    {
                      name: "Checksum",
                      offset: 0x11b,
                      type: "checksum",
                      dataType: "uint32",
                      control: {
                        offsetStart: 0x0,
                        offsetEnd: 0x74,
                      },
                    },
                    {
                      name: "Name",
                      offset: 0x101,
                      length: 0xe,
                      type: "variable",
                      dataType: "string",
                      letterDataType: "uint8",
                      fallback: 0xfa,
                      endCode: 0xfe,
                      resource: "letters",
                    },
                    {
                      name: "Playtime",
                      type: "group",
                      mode: "time",
                      items: [
                        {
                          offset: 0x120,
                          type: "variable",
                          dataType: "uint32",
                          operations: [
                            { convert: { from: "seconds", to: "hours" } },
                          ],
                          max: 999,
                        },
                        {
                          offset: 0x120,
                          type: "variable",
                          dataType: "uint32",
                          operations: [
                            { convert: { from: "seconds", to: "minutes" } },
                          ],
                          leadingZeros: 1,
                          max: 59,
                        },
                        {
                          offset: 0x120,
                          type: "variable",
                          dataType: "uint32",
                          operations: [
                            { convert: { from: "seconds", to: "seconds" } },
                          ],
                          leadingZeros: 1,
                          max: 59,
                        },
                      ],
                    },
                    {
                      name: "Birthday",
                      type: "group",
                      items: [
                        {
                          offset: 0x1a00,
                          type: "variable",
                          dataType: "uint32",
                          resource: "months",
                        },
                        {
                          offset: 0x1a04,
                          type: "variable",
                          dataType: "uint32",
                          min: 1,
                          max: 31,
                        },
                      ],
                    },
                    {
                      name: "War Funds",
                      offset: 0x1934,
                      type: "variable",
                      dataType: "uint32",
                      max: 99999999,
                    },
                    {
                      name: "Current Date",
                      type: "group",
                      items: [
                        {
                          offset: 0x193c,
                          type: "variable",
                          dataType: "uint32",
                          resource: "months",
                        },
                        {
                          offset: 0x1940,
                          type: "variable",
                          dataType: "uint32",
                          min: 1,
                          max: 31,
                        },
                      ],
                    },
                  ],
                },
                {
                  type: "section",
                  flex: true,
                  hidden: true,
                  items: [
                    {
                      name: "Job (Save Preview)",
                      offset: 0x112,
                      type: "variable",
                      dataType: "uint8",
                      hidden: true,
                    },
                    {
                      name: "Level (Save Preview)",
                      offset: 0x113,
                      type: "variable",
                      dataType: "uint8",
                      hidden: true,
                    },
                    {
                      name: "Current Date (Save Preview)",
                      type: "group",
                      hidden: true,
                      items: [
                        {
                          offset: 0x114,
                          type: "variable",
                          dataType: "uint8",
                          resource: "months",
                        },
                        {
                          offset: 0x115,
                          type: "variable",
                          dataType: "uint8",
                        },
                      ],
                    },
                    {
                      name: "Place (Save Preview)",
                      offset: 0x116,
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
              items: [
                {
                  id: "formation",
                  length: 0xe0,
                  type: "container",
                  instanceType: "tabs",
                  instances: 20,
                  resource: "unitNames",
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
                                  id: "slot-%parent%-unitName-%index%",
                                  name: "Name",
                                  offset: 0x542,
                                  length: 0xe,
                                  type: "variable",
                                  dataType: "string",
                                  letterDataType: "uint8",
                                  fallback: 0xfa,
                                  endCode: 0xfe,
                                  resource: "letters",
                                },
                                {
                                  name: "Type",
                                  offset: 0x484,
                                  type: "variable",
                                  dataType: "uint8",
                                  // resource: "types",
                                },
                                {
                                  name: "Registered Number",
                                  offset: 0x485,
                                  type: "variable",
                                  dataType: "uint8",
                                  hidden: true,
                                },
                                {
                                  name: "Job",
                                  offset: 0x486,
                                  type: "variable",
                                  dataType: "uint8",
                                  resource: "jobs",
                                },
                                {
                                  name: "???",
                                  offset: 0x487,
                                  type: "variable",
                                  dataType: "uint8",
                                  hidden: true,
                                },
                                {
                                  name: "Sprite / Gender",
                                  offset: 0x488,
                                  type: "variable",
                                  dataType: "uint8",
                                  hidden: true,
                                },
                                {
                                  name: "???",
                                  offset: 0x489,
                                  type: "variable",
                                  dataType: "uint8",
                                  hidden: true,
                                },
                                {
                                  name: "Zodiac Sign",
                                  offset: 0x48a,
                                  type: "variable",
                                  dataType: "uint8",
                                  resource: "signs",
                                },
                                {
                                  name: "Action Ability",
                                  offset: 0x48b,
                                  type: "variable",
                                  dataType: "uint8",
                                  // resource: "signs",
                                },
                                {
                                  name: "Reaction Ability",
                                  offset: 0x48c,
                                  type: "variable",
                                  dataType: "uint16",
                                  // resource: "signs",
                                },
                                {
                                  name: "Support Ability",
                                  offset: 0x48e,
                                  type: "variable",
                                  dataType: "uint16",
                                  // resource: "signs",
                                },
                                {
                                  name: "Move Ability",
                                  offset: 0x490,
                                  type: "variable",
                                  dataType: "uint16",
                                  // resource: "signs",
                                },
                                {
                                  name: "Experience",
                                  offset: 0x499,
                                  type: "variable",
                                  dataType: "uint8",
                                  // min:
                                  // max:
                                },
                                {
                                  name: "Level",
                                  offset: 0x49a,
                                  type: "variable",
                                  dataType: "uint8",
                                  // min:
                                  // max:
                                },
                                {
                                  name: "Brave",
                                  offset: 0x49b,
                                  type: "variable",
                                  dataType: "uint8",
                                  // min:
                                  // max:
                                },
                                {
                                  name: "Faith",
                                  offset: 0x49c,
                                  type: "variable",
                                  dataType: "uint8",
                                  // min:
                                  // max:
                                },
                                {
                                  name: "Base HP",
                                  offset: 0x49d,
                                  type: "variable",
                                  dataType: "uint24",
                                },
                                {
                                  name: "Base MP",
                                  offset: 0x4a0,
                                  type: "variable",
                                  dataType: "uint24",
                                },
                                {
                                  name: "Base Speed",
                                  offset: 0x4a3,
                                  type: "variable",
                                  dataType: "uint24",
                                },
                                {
                                  name: "Base Physical AT",
                                  offset: 0x4a6,
                                  type: "variable",
                                  dataType: "uint24",
                                },
                                {
                                  name: "Base Magic AT",
                                  offset: 0x4a9,
                                  type: "variable",
                                  dataType: "uint24",
                                },
                                {
                                  name: "???",
                                  offset: 0x4ac,
                                  type: "variable",
                                  dataType: "uint8",
                                  hidden: true,
                                },
                                {
                                  name: "???",
                                  offset: 0x4ad,
                                  type: "variable",
                                  dataType: "uint8",
                                  hidden: true,
                                },
                                {
                                  name: "???",
                                  offset: 0x4ae,
                                  type: "variable",
                                  dataType: "uint8",
                                  hidden: true,
                                },
                              ],
                            },
                            {
                              type: "section",
                              flex: true,
                              items: [
                                {
                                  name: "???",
                                  offset: 0x4e8,
                                  type: "variable",
                                  dataType: "uint8",
                                  hidden: true,
                                },
                                {
                                  name: "???",
                                  offset: 0x4e9,
                                  type: "variable",
                                  dataType: "uint8",
                                  hidden: true,
                                },
                                {
                                  name: "???",
                                  offset: 0x4ea,
                                  type: "variable",
                                  dataType: "uint8",
                                  hidden: true,
                                },
                                {
                                  name: "???",
                                  offset: 0x4eb,
                                  type: "variable",
                                  dataType: "uint8",
                                  hidden: true,
                                },
                                {
                                  name: "???",
                                  offset: 0x4ec,
                                  type: "variable",
                                  dataType: "uint8",
                                  hidden: true,
                                },
                                {
                                  name: "???",
                                  offset: 0x4ed,
                                  type: "variable",
                                  dataType: "uint8",
                                  hidden: true,
                                },
                                {
                                  name: "???",
                                  offset: 0x4ee,
                                  type: "variable",
                                  dataType: "uint8",
                                  hidden: true,
                                },
                                {
                                  name: "???",
                                  offset: 0x4ef,
                                  type: "variable",
                                  dataType: "uint8",
                                  hidden: true,
                                },
                                {
                                  name: "???",
                                  offset: 0x4f0,
                                  type: "variable",
                                  dataType: "uint8",
                                  hidden: true,
                                },
                                {
                                  name: "???",
                                  offset: 0x4f1,
                                  type: "variable",
                                  dataType: "uint8",
                                  hidden: true,
                                },
                                {
                                  name: "???",
                                  offset: 0x551,
                                  type: "variable",
                                  dataType: "uint8",
                                  hidden: true,
                                },
                                {
                                  name: "???",
                                  offset: 0x552,
                                  type: "variable",
                                  dataType: "uint8",
                                  hidden: true,
                                },
                                {
                                  name: "???",
                                  offset: 0x553,
                                  type: "variable",
                                  dataType: "uint8",
                                  hidden: true,
                                },
                                {
                                  name: "On Proposition",
                                  offset: 0x554,
                                  type: "variable",
                                  dataType: "uint8",
                                },
                                {
                                  name: "???",
                                  offset: 0x555,
                                  type: "variable",
                                  dataType: "uint8",
                                  hidden: true,
                                },
                                {
                                  name: "???",
                                  offset: 0x556,
                                  type: "variable",
                                  dataType: "uint8",
                                  hidden: true,
                                },
                                {
                                  name: "???",
                                  offset: 0x557,
                                  type: "variable",
                                  dataType: "uint8",
                                  hidden: true,
                                },
                                {
                                  name: "???",
                                  offset: 0x558,
                                  type: "variable",
                                  dataType: "uint8",
                                  hidden: true,
                                },
                                {
                                  name: "???",
                                  offset: 0x559,
                                  type: "variable",
                                  dataType: "uint8",
                                  hidden: true,
                                },
                                {
                                  name: "???",
                                  offset: 0x55a,
                                  type: "variable",
                                  dataType: "uint8",
                                  hidden: true,
                                },
                                {
                                  name: "???",
                                  offset: 0x55b,
                                  type: "variable",
                                  dataType: "uint8",
                                  hidden: true,
                                },
                                {
                                  name: "???",
                                  offset: 0x55c,
                                  type: "variable",
                                  dataType: "uint8",
                                  hidden: true,
                                },
                                {
                                  name: "???",
                                  offset: 0x55d,
                                  type: "variable",
                                  dataType: "uint8",
                                  hidden: true,
                                },
                                {
                                  name: "???",
                                  offset: 0x55e,
                                  type: "variable",
                                  dataType: "uint8",
                                  hidden: true,
                                },
                                {
                                  name: "???",
                                  offset: 0x55f,
                                  type: "variable",
                                  dataType: "uint8",
                                  hidden: true,
                                },
                                {
                                  name: "???",
                                  offset: 0x560,
                                  type: "variable",
                                  dataType: "uint8",
                                  hidden: true,
                                },
                                {
                                  name: "???",
                                  offset: 0x561,
                                  type: "variable",
                                  dataType: "uint8",
                                  hidden: true,
                                },
                                {
                                  name: "???",
                                  offset: 0x562,
                                  type: "variable",
                                  dataType: "uint8",
                                  hidden: true,
                                },
                                {
                                  name: "???",
                                  offset: 0x563,
                                  type: "variable",
                                  dataType: "uint8",
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
                                  name: "Head",
                                  offset: 0x492,
                                  type: "variable",
                                  dataType: "uint8",
                                  // resource: "signs",
                                },
                                {
                                  name: "Body",
                                  offset: 0x493,
                                  type: "variable",
                                  dataType: "uint8",
                                  // resource: "signs",
                                },
                                {
                                  name: "Accessory",
                                  offset: 0x494,
                                  type: "variable",
                                  dataType: "uint8",
                                  // resource: "signs",
                                },
                              ],
                            },
                            {
                              type: "section",
                              flex: true,
                              items: [
                                {
                                  name: "Right Hand",
                                  offset: 0x495,
                                  type: "variable",
                                  dataType: "uint8",
                                  // resource: "signs",
                                },
                                {
                                  name: "???",
                                  offset: 0x496,
                                  type: "variable",
                                  dataType: "uint8",
                                  // resource: "signs",
                                },
                                {
                                  name: "Left Hand",
                                  offset: 0x497,
                                  type: "variable",
                                  dataType: "uint8",
                                  // resource: "signs",
                                },
                                {
                                  name: "???",
                                  offset: 0x498,
                                  type: "variable",
                                  dataType: "uint8",
                                  // resource: "signs",
                                },
                              ],
                            },
                          ],
                        },
                        {
                          name: "Abilities",
                          items: [
                            {
                              type: "tabs",
                              vertical: true,
                              items: [
                                {
                                  name: "Squire",
                                  items: [
                                    {
                                      type: "section",
                                      flex: true,
                                      items: [
                                        {
                                          name: "Total Job Points",
                                          offset: 0x51a,
                                          type: "variable",
                                          dataType: "uint16",
                                          max: 9999,
                                        },
                                        {
                                          name: "Job Points",
                                          offset: 0x4f2,
                                          type: "variable",
                                          dataType: "uint16",
                                          max: 9999,
                                        },
                                      ],
                                    },
                                    {
                                      name: "Learned Abilities",
                                      type: "bitflags",
                                      flags: [
                                        { offset: 0x4af, bit: 0, label: "Scream" }, // prettier-ignore
                                        { offset: 0x4af, bit: 1, label: "Cheer Up" }, // prettier-ignore
                                        { offset: 0x4af, bit: 2, label: "Wish" }, // prettier-ignore
                                        { offset: 0x4af, bit: 3, label: "Yell" }, // prettier-ignore
                                        { offset: 0x4af, bit: 4, label: "Heal" }, // prettier-ignore
                                        { offset: 0x4af, bit: 5, label: "Throw Stone" }, // prettier-ignore
                                        { offset: 0x4af, bit: 6, label: "Dash" }, // prettier-ignore
                                        { offset: 0x4af, bit: 7, label: "Accumulate" }, // prettier-ignore
                                        { offset: 0x4b0, bit: 0, label: "???" }, // prettier-ignore
                                        { offset: 0x4b0, bit: 1, label: "???" }, // prettier-ignore
                                        { offset: 0x4b0, bit: 2, label: "???" }, // prettier-ignore
                                        { offset: 0x4b0, bit: 3, label: "???" }, // prettier-ignore
                                        { offset: 0x4b0, bit: 4, label: "???" }, // prettier-ignore
                                        { offset: 0x4b0, bit: 5, label: "???" }, // prettier-ignore
                                        { offset: 0x4b0, bit: 6, label: "???" }, // prettier-ignore
                                        { offset: 0x4b0, bit: 7, label: "Ultima" }, // prettier-ignore
                                        { offset: 0x4b1, bit: 0, label: "???" }, // prettier-ignore
                                        { offset: 0x4b1, bit: 1, label: "???" }, // prettier-ignore
                                        { offset: 0x4b1, bit: 2, label: "Move+1" }, // prettier-ignore
                                        { offset: 0x4b1, bit: 3, label: "Gained Jp UP" }, // prettier-ignore
                                        { offset: 0x4b1, bit: 4, label: "Defend" }, // prettier-ignore
                                        { offset: 0x4b1, bit: 5, label: "Monster Skill" }, // prettier-ignore
                                        { offset: 0x4b1, bit: 6, label: "Equip Axe" }, // prettier-ignore
                                        { offset: 0x4b1, bit: 7, label: "Counter Tackle" }, // prettier-ignore
                                      ],
                                    },
                                  ],
                                },
                                {
                                  name: "Chemist",
                                  items: [
                                    {
                                      type: "section",
                                      flex: true,
                                      items: [
                                        {
                                          name: "Total Job Points",
                                          offset: 0x51c,
                                          type: "variable",
                                          dataType: "uint16",
                                          max: 9999,
                                        },
                                        {
                                          name: "Job Points",
                                          offset: 0x4f4,
                                          type: "variable",
                                          dataType: "uint16",
                                          max: 9999,
                                        },
                                      ],
                                    },
                                    {
                                      name: "Learned Abilities",
                                      type: "bitflags",
                                      flags: [
                                        { offset: 0x4b2, bit: 0, label: "Eye Drop" }, // prettier-ignore
                                        { offset: 0x4b2, bit: 1, label: "Antidote" }, // prettier-ignore
                                        { offset: 0x4b2, bit: 2, label: "Elixir" }, // prettier-ignore
                                        { offset: 0x4b2, bit: 3, label: "Hi-Ether" }, // prettier-ignore
                                        { offset: 0x4b2, bit: 4, label: "Ether" }, // prettier-ignore
                                        { offset: 0x4b2, bit: 5, label: "X-Potion" }, // prettier-ignore
                                        { offset: 0x4b2, bit: 6, label: "Hi-Potion" }, // prettier-ignore
                                        { offset: 0x4b2, bit: 7, label: "Potion" }, // prettier-ignore
                                        { offset: 0x4b3, bit: 0, label: "???" }, // prettier-ignore
                                        { offset: 0x4b3, bit: 1, label: "???" }, // prettier-ignore
                                        { offset: 0x4b3, bit: 2, label: "Phoenix Down" }, // prettier-ignore
                                        { offset: 0x4b3, bit: 3, label: "Remedy" }, // prettier-ignore
                                        { offset: 0x4b3, bit: 4, label: "Holy Water" }, // prettier-ignore
                                        { offset: 0x4b3, bit: 5, label: "Soft" }, // prettier-ignore
                                        { offset: 0x4b3, bit: 6, label: "Maiden's Kiss" }, // prettier-ignore
                                        { offset: 0x4b3, bit: 7, label: "Echo Grass" }, // prettier-ignore
                                        { offset: 0x4b4, bit: 0, label: "???" }, // prettier-ignore
                                        { offset: 0x4b4, bit: 1, label: "???" }, // prettier-ignore
                                        { offset: 0x4b4, bit: 2, label: "???" }, // prettier-ignore
                                        { offset: 0x4b4, bit: 3, label: "Move-Find Item" }, // prettier-ignore
                                        { offset: 0x4b4, bit: 4, label: "Equip Change" }, // prettier-ignore
                                        { offset: 0x4b4, bit: 5, label: "Maintenance" }, // prettier-ignore
                                        { offset: 0x4b4, bit: 6, label: "Throw Item" }, // prettier-ignore
                                        { offset: 0x4b4, bit: 7, label: "Auto Potion" }, // prettier-ignore
                                      ],
                                    },
                                  ],
                                },
                                {
                                  name: "Knight",
                                  items: [
                                    {
                                      type: "section",
                                      flex: true,
                                      items: [
                                        {
                                          name: "Total Job Points",
                                          offset: 0x51e,
                                          type: "variable",
                                          dataType: "uint16",
                                          max: 9999,
                                        },
                                        {
                                          name: "Job Points",
                                          offset: 0x4f6,
                                          type: "variable",
                                          dataType: "uint16",
                                          max: 9999,
                                        },
                                      ],
                                    },
                                    {
                                      name: "Learned Abilities",
                                      type: "bitflags",
                                      flags: [
                                        { offset: 0x4b5, bit: 0, label: "Mind Break" }, // prettier-ignore
                                        { offset: 0x4b5, bit: 1, label: "Power Break" }, // prettier-ignore
                                        { offset: 0x4b5, bit: 2, label: "Speed Break" }, // prettier-ignore
                                        { offset: 0x4b5, bit: 3, label: "Magic Break" }, // prettier-ignore
                                        { offset: 0x4b5, bit: 4, label: "Weapon Break" }, // prettier-ignore
                                        { offset: 0x4b5, bit: 5, label: "Shield Break" }, // prettier-ignore
                                        { offset: 0x4b5, bit: 6, label: "Armor Break" }, // prettier-ignore
                                        { offset: 0x4b5, bit: 7, label: "Head Break" }, // prettier-ignore
                                        { offset: 0x4b6, bit: 0, label: "???" }, // prettier-ignore
                                        { offset: 0x4b6, bit: 1, label: "???" }, // prettier-ignore
                                        { offset: 0x4b6, bit: 2, label: "???" }, // prettier-ignore
                                        { offset: 0x4b6, bit: 3, label: "???" }, // prettier-ignore
                                        { offset: 0x4b6, bit: 4, label: "???" }, // prettier-ignore
                                        { offset: 0x4b6, bit: 5, label: "???" }, // prettier-ignore
                                        { offset: 0x4b6, bit: 6, label: "???" }, // prettier-ignore
                                        { offset: 0x4b6, bit: 7, label: "???" }, // prettier-ignore
                                        { offset: 0x4b7, bit: 0, label: "???" }, // prettier-ignore
                                        { offset: 0x4b7, bit: 1, label: "???" }, // prettier-ignore
                                        { offset: 0x4b7, bit: 2, label: "???" }, // prettier-ignore
                                        { offset: 0x4b7, bit: 3, label: "???" }, // prettier-ignore
                                        { offset: 0x4b7, bit: 4, label: "Equip Sword" }, // prettier-ignore
                                        { offset: 0x4b7, bit: 5, label: "Equip Shield" }, // prettier-ignore
                                        { offset: 0x4b7, bit: 6, label: "Equip Armor" }, // prettier-ignore
                                        { offset: 0x4b7, bit: 7, label: "Weapon Guard" }, // prettier-ignore
                                      ],
                                    },
                                  ],
                                },
                                {
                                  name: "Archer",
                                  items: [
                                    {
                                      type: "section",
                                      flex: true,
                                      items: [
                                        {
                                          name: "Total Job Points",
                                          offset: 0x520,
                                          type: "variable",
                                          dataType: "uint16",
                                          max: 9999,
                                        },
                                        {
                                          name: "Job Points",
                                          offset: 0x4f8,
                                          type: "variable",
                                          dataType: "uint16",
                                          max: 9999,
                                        },
                                      ],
                                    },
                                    {
                                      name: "Learned Abilities",
                                      type: "bitflags",
                                      flags: [
                                        { offset: 0x4b8, bit: 0, label: "Charge+20" }, // prettier-ignore
                                        { offset: 0x4b8, bit: 1, label: "Charge+10" }, // prettier-ignore
                                        { offset: 0x4b8, bit: 2, label: "Charge+7" }, // prettier-ignore
                                        { offset: 0x4b8, bit: 3, label: "Charge+5" }, // prettier-ignore
                                        { offset: 0x4b8, bit: 4, label: "Charge+4" }, // prettier-ignore
                                        { offset: 0x4b8, bit: 5, label: "Charge+3" }, // prettier-ignore
                                        { offset: 0x4b8, bit: 6, label: "Charge+2" }, // prettier-ignore
                                        { offset: 0x4b8, bit: 7, label: "Charge+1" }, // prettier-ignore
                                        { offset: 0x4b9, bit: 0, label: "???" }, // prettier-ignore
                                        { offset: 0x4b9, bit: 1, label: "???" }, // prettier-ignore
                                        { offset: 0x4b9, bit: 2, label: "???" }, // prettier-ignore
                                        { offset: 0x4b9, bit: 3, label: "???" }, // prettier-ignore
                                        { offset: 0x4b9, bit: 4, label: "???" }, // prettier-ignore
                                        { offset: 0x4b9, bit: 5, label: "???" }, // prettier-ignore
                                        { offset: 0x4b9, bit: 6, label: "???" }, // prettier-ignore
                                        { offset: 0x4b9, bit: 7, label: "???" }, // prettier-ignore
                                        { offset: 0x4ba, bit: 0, label: "???" }, // prettier-ignore
                                        { offset: 0x4ba, bit: 1, label: "???" }, // prettier-ignore
                                        { offset: 0x4ba, bit: 2, label: "???" }, // prettier-ignore
                                        { offset: 0x4ba, bit: 3, label: "Jump+1" }, // prettier-ignore
                                        { offset: 0x4ba, bit: 4, label: "Concentrate" }, // prettier-ignore
                                        { offset: 0x4ba, bit: 5, label: "Equip Crossbow" }, // prettier-ignore
                                        { offset: 0x4ba, bit: 6, label: "Arrow Guard" }, // prettier-ignore
                                        { offset: 0x4ba, bit: 7, label: "Speed Save" }, // prettier-ignore
                                      ],
                                    },
                                  ],
                                },
                                {
                                  name: "Monk",
                                  items: [
                                    {
                                      type: "section",
                                      flex: true,
                                      items: [
                                        {
                                          name: "Total Job Points",
                                          offset: 0x522,
                                          type: "variable",
                                          dataType: "uint16",
                                          max: 9999,
                                        },
                                        {
                                          name: "Job Points",
                                          offset: 0x4fa,
                                          type: "variable",
                                          dataType: "uint16",
                                          max: 9999,
                                        },
                                      ],
                                    },
                                    {
                                      name: "Learned Abilities",
                                      type: "bitflags",
                                      flags: [
                                        { offset: 0x4bb, bit: 0, label: "???" }, // prettier-ignore
                                        { offset: 0x4bb, bit: 1, label: "???" }, // prettier-ignore
                                        { offset: 0x4bb, bit: 2, label: "???" }, // prettier-ignore
                                        { offset: 0x4bb, bit: 3, label: "???" }, // prettier-ignore
                                        { offset: 0x4bb, bit: 4, label: "???" }, // prettier-ignore
                                        { offset: 0x4bb, bit: 5, label: "???" }, // prettier-ignore
                                        { offset: 0x4bb, bit: 6, label: "???" }, // prettier-ignore
                                        { offset: 0x4bb, bit: 7, label: "???" }, // prettier-ignore
                                        { offset: 0x4bc, bit: 0, label: "???" }, // prettier-ignore
                                        { offset: 0x4bc, bit: 1, label: "???" }, // prettier-ignore
                                        { offset: 0x4bc, bit: 2, label: "???" }, // prettier-ignore
                                        { offset: 0x4bc, bit: 3, label: "???" }, // prettier-ignore
                                        { offset: 0x4bc, bit: 4, label: "???" }, // prettier-ignore
                                        { offset: 0x4bc, bit: 5, label: "???" }, // prettier-ignore
                                        { offset: 0x4bc, bit: 6, label: "???" }, // prettier-ignore
                                        { offset: 0x4bc, bit: 7, label: "???" }, // prettier-ignore
                                        { offset: 0x4bd, bit: 0, label: "???" }, // prettier-ignore
                                        { offset: 0x4bd, bit: 1, label: "???" }, // prettier-ignore
                                        { offset: 0x4bd, bit: 2, label: "???" }, // prettier-ignore
                                        { offset: 0x4bd, bit: 3, label: "???" }, // prettier-ignore
                                        { offset: 0x4bd, bit: 4, label: "???" }, // prettier-ignore
                                        { offset: 0x4bd, bit: 5, label: "???" }, // prettier-ignore
                                        { offset: 0x4bd, bit: 6, label: "???" }, // prettier-ignore
                                        { offset: 0x4bd, bit: 7, label: "???" }, // prettier-ignore
                                      ],
                                    },
                                  ],
                                },
                                {
                                  name: "Priest",
                                  items: [
                                    {
                                      type: "section",
                                      flex: true,
                                      items: [
                                        {
                                          name: "Total Job Points",
                                          offset: 0x524,
                                          type: "variable",
                                          dataType: "uint16",
                                          max: 9999,
                                        },
                                        {
                                          name: "Job Points",
                                          offset: 0x4fc,
                                          type: "variable",
                                          dataType: "uint16",
                                          max: 9999,
                                        },
                                      ],
                                    },
                                    {
                                      name: "Learned Abilities",
                                      type: "bitflags",
                                      flags: [
                                        { offset: 0x4be, bit: 0, label: "???" }, // prettier-ignore
                                        { offset: 0x4be, bit: 1, label: "???" }, // prettier-ignore
                                        { offset: 0x4be, bit: 2, label: "???" }, // prettier-ignore
                                        { offset: 0x4be, bit: 3, label: "???" }, // prettier-ignore
                                        { offset: 0x4be, bit: 4, label: "???" }, // prettier-ignore
                                        { offset: 0x4be, bit: 5, label: "???" }, // prettier-ignore
                                        { offset: 0x4be, bit: 6, label: "???" }, // prettier-ignore
                                        { offset: 0x4be, bit: 7, label: "???" }, // prettier-ignore
                                        { offset: 0x4bf, bit: 0, label: "???" }, // prettier-ignore
                                        { offset: 0x4bf, bit: 1, label: "???" }, // prettier-ignore
                                        { offset: 0x4bf, bit: 2, label: "???" }, // prettier-ignore
                                        { offset: 0x4bf, bit: 3, label: "???" }, // prettier-ignore
                                        { offset: 0x4bf, bit: 4, label: "???" }, // prettier-ignore
                                        { offset: 0x4bf, bit: 5, label: "???" }, // prettier-ignore
                                        { offset: 0x4bf, bit: 6, label: "???" }, // prettier-ignore
                                        { offset: 0x4bf, bit: 7, label: "???" }, // prettier-ignore
                                        { offset: 0x4c0, bit: 0, label: "???" }, // prettier-ignore
                                        { offset: 0x4c0, bit: 1, label: "???" }, // prettier-ignore
                                        { offset: 0x4c0, bit: 2, label: "???" }, // prettier-ignore
                                        { offset: 0x4c0, bit: 3, label: "???" }, // prettier-ignore
                                        { offset: 0x4c0, bit: 4, label: "???" }, // prettier-ignore
                                        { offset: 0x4c0, bit: 5, label: "???" }, // prettier-ignore
                                        { offset: 0x4c0, bit: 6, label: "???" }, // prettier-ignore
                                        { offset: 0x4c0, bit: 7, label: "???" }, // prettier-ignore
                                      ],
                                    },
                                  ],
                                },
                                {
                                  name: "Wizard",
                                  items: [
                                    {
                                      type: "section",
                                      flex: true,
                                      items: [
                                        {
                                          name: "Total Job Points",
                                          offset: 0x526,
                                          type: "variable",
                                          dataType: "uint16",
                                          max: 9999,
                                        },
                                        {
                                          name: "Job Points",
                                          offset: 0x4fe,
                                          type: "variable",
                                          dataType: "uint16",
                                          max: 9999,
                                        },
                                      ],
                                    },
                                    {
                                      name: "Learned Abilities",
                                      type: "bitflags",
                                      flags: [
                                        { offset: 0x4c1, bit: 0, label: "???" }, // prettier-ignore
                                        { offset: 0x4c1, bit: 1, label: "???" }, // prettier-ignore
                                        { offset: 0x4c1, bit: 2, label: "???" }, // prettier-ignore
                                        { offset: 0x4c1, bit: 3, label: "???" }, // prettier-ignore
                                        { offset: 0x4c1, bit: 4, label: "???" }, // prettier-ignore
                                        { offset: 0x4c1, bit: 5, label: "???" }, // prettier-ignore
                                        { offset: 0x4c1, bit: 6, label: "???" }, // prettier-ignore
                                        { offset: 0x4c1, bit: 7, label: "???" }, // prettier-ignore
                                        { offset: 0x4c2, bit: 0, label: "???" }, // prettier-ignore
                                        { offset: 0x4c2, bit: 1, label: "???" }, // prettier-ignore
                                        { offset: 0x4c2, bit: 2, label: "???" }, // prettier-ignore
                                        { offset: 0x4c2, bit: 3, label: "???" }, // prettier-ignore
                                        { offset: 0x4c2, bit: 4, label: "???" }, // prettier-ignore
                                        { offset: 0x4c2, bit: 5, label: "???" }, // prettier-ignore
                                        { offset: 0x4c2, bit: 6, label: "???" }, // prettier-ignore
                                        { offset: 0x4c2, bit: 7, label: "???" }, // prettier-ignore
                                        { offset: 0x4c3, bit: 0, label: "???" }, // prettier-ignore
                                        { offset: 0x4c3, bit: 1, label: "???" }, // prettier-ignore
                                        { offset: 0x4c3, bit: 2, label: "???" }, // prettier-ignore
                                        { offset: 0x4c3, bit: 3, label: "???" }, // prettier-ignore
                                        { offset: 0x4c3, bit: 4, label: "???" }, // prettier-ignore
                                        { offset: 0x4c3, bit: 5, label: "???" }, // prettier-ignore
                                        { offset: 0x4c3, bit: 6, label: "???" }, // prettier-ignore
                                        { offset: 0x4c3, bit: 7, label: "???" }, // prettier-ignore
                                      ],
                                    },
                                  ],
                                },
                                {
                                  name: "Time Mage",
                                  items: [
                                    {
                                      type: "section",
                                      flex: true,
                                      items: [
                                        {
                                          name: "Total Job Points",
                                          offset: 0x528,
                                          type: "variable",
                                          dataType: "uint16",
                                          max: 9999,
                                        },
                                        {
                                          name: "Job Points",
                                          offset: 0x500,
                                          type: "variable",
                                          dataType: "uint16",
                                          max: 9999,
                                        },
                                      ],
                                    },
                                    {
                                      name: "Learned Abilities",
                                      type: "bitflags",
                                      flags: [
                                        { offset: 0x4c4, bit: 0, label: "???" }, // prettier-ignore
                                        { offset: 0x4c4, bit: 1, label: "???" }, // prettier-ignore
                                        { offset: 0x4c4, bit: 2, label: "???" }, // prettier-ignore
                                        { offset: 0x4c4, bit: 3, label: "???" }, // prettier-ignore
                                        { offset: 0x4c4, bit: 4, label: "???" }, // prettier-ignore
                                        { offset: 0x4c4, bit: 5, label: "???" }, // prettier-ignore
                                        { offset: 0x4c4, bit: 6, label: "???" }, // prettier-ignore
                                        { offset: 0x4c4, bit: 7, label: "???" }, // prettier-ignore
                                        { offset: 0x4c5, bit: 0, label: "???" }, // prettier-ignore
                                        { offset: 0x4c5, bit: 1, label: "???" }, // prettier-ignore
                                        { offset: 0x4c5, bit: 2, label: "???" }, // prettier-ignore
                                        { offset: 0x4c5, bit: 3, label: "???" }, // prettier-ignore
                                        { offset: 0x4c5, bit: 4, label: "???" }, // prettier-ignore
                                        { offset: 0x4c5, bit: 5, label: "???" }, // prettier-ignore
                                        { offset: 0x4c5, bit: 6, label: "???" }, // prettier-ignore
                                        { offset: 0x4c5, bit: 7, label: "???" }, // prettier-ignore
                                        { offset: 0x4c6, bit: 0, label: "???" }, // prettier-ignore
                                        { offset: 0x4c6, bit: 1, label: "???" }, // prettier-ignore
                                        { offset: 0x4c6, bit: 2, label: "???" }, // prettier-ignore
                                        { offset: 0x4c6, bit: 3, label: "???" }, // prettier-ignore
                                        { offset: 0x4c6, bit: 4, label: "???" }, // prettier-ignore
                                        { offset: 0x4c6, bit: 5, label: "???" }, // prettier-ignore
                                        { offset: 0x4c6, bit: 6, label: "???" }, // prettier-ignore
                                        { offset: 0x4c6, bit: 7, label: "???" }, // prettier-ignore
                                      ],
                                    },
                                  ],
                                },
                                {
                                  name: "Summoner",
                                  items: [
                                    {
                                      type: "section",
                                      flex: true,
                                      items: [
                                        {
                                          name: "Total Job Points",
                                          offset: 0x52a,
                                          type: "variable",
                                          dataType: "uint16",
                                          max: 9999,
                                        },
                                        {
                                          name: "Job Points",
                                          offset: 0x502,
                                          type: "variable",
                                          dataType: "uint16",
                                          max: 9999,
                                        },
                                      ],
                                    },
                                    {
                                      name: "Learned Abilities",
                                      type: "bitflags",
                                      flags: [
                                        { offset: 0x4c7, bit: 0, label: "???" }, // prettier-ignore
                                        { offset: 0x4c7, bit: 1, label: "???" }, // prettier-ignore
                                        { offset: 0x4c7, bit: 2, label: "???" }, // prettier-ignore
                                        { offset: 0x4c7, bit: 3, label: "???" }, // prettier-ignore
                                        { offset: 0x4c7, bit: 4, label: "???" }, // prettier-ignore
                                        { offset: 0x4c7, bit: 5, label: "???" }, // prettier-ignore
                                        { offset: 0x4c7, bit: 6, label: "???" }, // prettier-ignore
                                        { offset: 0x4c7, bit: 7, label: "???" }, // prettier-ignore
                                        { offset: 0x4c8, bit: 0, label: "???" }, // prettier-ignore
                                        { offset: 0x4c8, bit: 1, label: "???" }, // prettier-ignore
                                        { offset: 0x4c8, bit: 2, label: "???" }, // prettier-ignore
                                        { offset: 0x4c8, bit: 3, label: "???" }, // prettier-ignore
                                        { offset: 0x4c8, bit: 4, label: "???" }, // prettier-ignore
                                        { offset: 0x4c8, bit: 5, label: "???" }, // prettier-ignore
                                        { offset: 0x4c8, bit: 6, label: "???" }, // prettier-ignore
                                        { offset: 0x4c8, bit: 7, label: "???" }, // prettier-ignore
                                        { offset: 0x4c9, bit: 0, label: "???" }, // prettier-ignore
                                        { offset: 0x4c9, bit: 1, label: "???" }, // prettier-ignore
                                        { offset: 0x4c9, bit: 2, label: "???" }, // prettier-ignore
                                        { offset: 0x4c9, bit: 3, label: "???" }, // prettier-ignore
                                        { offset: 0x4c9, bit: 4, label: "???" }, // prettier-ignore
                                        { offset: 0x4c9, bit: 5, label: "???" }, // prettier-ignore
                                        { offset: 0x4c9, bit: 6, label: "???" }, // prettier-ignore
                                        { offset: 0x4c9, bit: 7, label: "???" }, // prettier-ignore
                                      ],
                                    },
                                  ],
                                },
                                {
                                  name: "Thief",
                                  items: [
                                    {
                                      type: "section",
                                      flex: true,
                                      items: [
                                        {
                                          name: "Total Job Points",
                                          offset: 0x52c,
                                          type: "variable",
                                          dataType: "uint16",
                                          max: 9999,
                                        },
                                        {
                                          name: "Job Points",
                                          offset: 0x504,
                                          type: "variable",
                                          dataType: "uint16",
                                          max: 9999,
                                        },
                                      ],
                                    },
                                    {
                                      name: "Learned Abilities",
                                      type: "bitflags",
                                      flags: [
                                        { offset: 0x4ca, bit: 0, label: "???" }, // prettier-ignore
                                        { offset: 0x4ca, bit: 1, label: "???" }, // prettier-ignore
                                        { offset: 0x4ca, bit: 2, label: "???" }, // prettier-ignore
                                        { offset: 0x4ca, bit: 3, label: "???" }, // prettier-ignore
                                        { offset: 0x4ca, bit: 4, label: "???" }, // prettier-ignore
                                        { offset: 0x4ca, bit: 5, label: "???" }, // prettier-ignore
                                        { offset: 0x4ca, bit: 6, label: "???" }, // prettier-ignore
                                        { offset: 0x4ca, bit: 7, label: "???" }, // prettier-ignore
                                        { offset: 0x4cb, bit: 0, label: "???" }, // prettier-ignore
                                        { offset: 0x4cb, bit: 1, label: "???" }, // prettier-ignore
                                        { offset: 0x4cb, bit: 2, label: "???" }, // prettier-ignore
                                        { offset: 0x4cb, bit: 3, label: "???" }, // prettier-ignore
                                        { offset: 0x4cb, bit: 4, label: "???" }, // prettier-ignore
                                        { offset: 0x4cb, bit: 5, label: "???" }, // prettier-ignore
                                        { offset: 0x4cb, bit: 6, label: "???" }, // prettier-ignore
                                        { offset: 0x4cb, bit: 7, label: "???" }, // prettier-ignore
                                        { offset: 0x4cc, bit: 0, label: "???" }, // prettier-ignore
                                        { offset: 0x4cc, bit: 1, label: "???" }, // prettier-ignore
                                        { offset: 0x4cc, bit: 2, label: "???" }, // prettier-ignore
                                        { offset: 0x4cc, bit: 3, label: "???" }, // prettier-ignore
                                        { offset: 0x4cc, bit: 4, label: "???" }, // prettier-ignore
                                        { offset: 0x4cc, bit: 5, label: "???" }, // prettier-ignore
                                        { offset: 0x4cc, bit: 6, label: "???" }, // prettier-ignore
                                        { offset: 0x4cc, bit: 7, label: "???" }, // prettier-ignore
                                      ],
                                    },
                                  ],
                                },
                                {
                                  name: "Mediator",
                                  items: [
                                    {
                                      type: "section",
                                      flex: true,
                                      items: [
                                        {
                                          name: "Total Job Points",
                                          offset: 0x52e,
                                          type: "variable",
                                          dataType: "uint16",
                                          max: 9999,
                                        },
                                        {
                                          name: "Job Points",
                                          offset: 0x506,
                                          type: "variable",
                                          dataType: "uint16",
                                          max: 9999,
                                        },
                                      ],
                                    },
                                    {
                                      name: "Learned Abilities",
                                      type: "bitflags",
                                      flags: [
                                        { offset: 0x4cd, bit: 0, label: "???" }, // prettier-ignore
                                        { offset: 0x4cd, bit: 1, label: "???" }, // prettier-ignore
                                        { offset: 0x4cd, bit: 2, label: "???" }, // prettier-ignore
                                        { offset: 0x4cd, bit: 3, label: "???" }, // prettier-ignore
                                        { offset: 0x4cd, bit: 4, label: "???" }, // prettier-ignore
                                        { offset: 0x4cd, bit: 5, label: "???" }, // prettier-ignore
                                        { offset: 0x4cd, bit: 6, label: "???" }, // prettier-ignore
                                        { offset: 0x4cd, bit: 7, label: "???" }, // prettier-ignore
                                        { offset: 0x4ce, bit: 0, label: "???" }, // prettier-ignore
                                        { offset: 0x4ce, bit: 1, label: "???" }, // prettier-ignore
                                        { offset: 0x4ce, bit: 2, label: "???" }, // prettier-ignore
                                        { offset: 0x4ce, bit: 3, label: "???" }, // prettier-ignore
                                        { offset: 0x4ce, bit: 4, label: "???" }, // prettier-ignore
                                        { offset: 0x4ce, bit: 5, label: "???" }, // prettier-ignore
                                        { offset: 0x4ce, bit: 6, label: "???" }, // prettier-ignore
                                        { offset: 0x4ce, bit: 7, label: "???" }, // prettier-ignore
                                        { offset: 0x4cf, bit: 0, label: "???" }, // prettier-ignore
                                        { offset: 0x4cf, bit: 1, label: "???" }, // prettier-ignore
                                        { offset: 0x4cf, bit: 2, label: "???" }, // prettier-ignore
                                        { offset: 0x4cf, bit: 3, label: "???" }, // prettier-ignore
                                        { offset: 0x4cf, bit: 4, label: "???" }, // prettier-ignore
                                        { offset: 0x4cf, bit: 5, label: "???" }, // prettier-ignore
                                        { offset: 0x4cf, bit: 6, label: "???" }, // prettier-ignore
                                        { offset: 0x4cf, bit: 7, label: "???" }, // prettier-ignore
                                      ],
                                    },
                                  ],
                                },
                                {
                                  name: "Oracle",
                                  items: [
                                    {
                                      type: "section",
                                      flex: true,
                                      items: [
                                        {
                                          name: "Total Job Points",
                                          offset: 0x530,
                                          type: "variable",
                                          dataType: "uint16",
                                          max: 9999,
                                        },
                                        {
                                          name: "Job Points",
                                          offset: 0x508,
                                          type: "variable",
                                          dataType: "uint16",
                                          max: 9999,
                                        },
                                      ],
                                    },
                                    {
                                      name: "Learned Abilities",
                                      type: "bitflags",
                                      flags: [
                                        { offset: 0x4d0, bit: 0, label: "???" }, // prettier-ignore
                                        { offset: 0x4d0, bit: 1, label: "???" }, // prettier-ignore
                                        { offset: 0x4d0, bit: 2, label: "???" }, // prettier-ignore
                                        { offset: 0x4d0, bit: 3, label: "???" }, // prettier-ignore
                                        { offset: 0x4d0, bit: 4, label: "???" }, // prettier-ignore
                                        { offset: 0x4d0, bit: 5, label: "???" }, // prettier-ignore
                                        { offset: 0x4d0, bit: 6, label: "???" }, // prettier-ignore
                                        { offset: 0x4d0, bit: 7, label: "???" }, // prettier-ignore
                                        { offset: 0x4d1, bit: 0, label: "???" }, // prettier-ignore
                                        { offset: 0x4d1, bit: 1, label: "???" }, // prettier-ignore
                                        { offset: 0x4d1, bit: 2, label: "???" }, // prettier-ignore
                                        { offset: 0x4d1, bit: 3, label: "???" }, // prettier-ignore
                                        { offset: 0x4d1, bit: 4, label: "???" }, // prettier-ignore
                                        { offset: 0x4d1, bit: 5, label: "???" }, // prettier-ignore
                                        { offset: 0x4d1, bit: 6, label: "???" }, // prettier-ignore
                                        { offset: 0x4d1, bit: 7, label: "???" }, // prettier-ignore
                                        { offset: 0x4d2, bit: 0, label: "???" }, // prettier-ignore
                                        { offset: 0x4d2, bit: 1, label: "???" }, // prettier-ignore
                                        { offset: 0x4d2, bit: 2, label: "???" }, // prettier-ignore
                                        { offset: 0x4d2, bit: 3, label: "???" }, // prettier-ignore
                                        { offset: 0x4d2, bit: 4, label: "???" }, // prettier-ignore
                                        { offset: 0x4d2, bit: 5, label: "???" }, // prettier-ignore
                                        { offset: 0x4d2, bit: 6, label: "???" }, // prettier-ignore
                                        { offset: 0x4d2, bit: 7, label: "???" }, // prettier-ignore
                                      ],
                                    },
                                  ],
                                },
                                {
                                  name: "Geomancer",
                                  items: [
                                    {
                                      type: "section",
                                      flex: true,
                                      items: [
                                        {
                                          name: "Total Job Points",
                                          offset: 0x532,
                                          type: "variable",
                                          dataType: "uint16",
                                          max: 9999,
                                        },
                                        {
                                          name: "Job Points",
                                          offset: 0x50a,
                                          type: "variable",
                                          dataType: "uint16",
                                          max: 9999,
                                        },
                                      ],
                                    },
                                    {
                                      name: "Learned Abilities",
                                      type: "bitflags",
                                      flags: [
                                        { offset: 0x4d3, bit: 0, label: "???" }, // prettier-ignore
                                        { offset: 0x4d3, bit: 1, label: "???" }, // prettier-ignore
                                        { offset: 0x4d3, bit: 2, label: "???" }, // prettier-ignore
                                        { offset: 0x4d3, bit: 3, label: "???" }, // prettier-ignore
                                        { offset: 0x4d3, bit: 4, label: "???" }, // prettier-ignore
                                        { offset: 0x4d3, bit: 5, label: "???" }, // prettier-ignore
                                        { offset: 0x4d3, bit: 6, label: "???" }, // prettier-ignore
                                        { offset: 0x4d3, bit: 7, label: "???" }, // prettier-ignore
                                        { offset: 0x4d4, bit: 0, label: "???" }, // prettier-ignore
                                        { offset: 0x4d4, bit: 1, label: "???" }, // prettier-ignore
                                        { offset: 0x4d4, bit: 2, label: "???" }, // prettier-ignore
                                        { offset: 0x4d4, bit: 3, label: "???" }, // prettier-ignore
                                        { offset: 0x4d4, bit: 4, label: "???" }, // prettier-ignore
                                        { offset: 0x4d4, bit: 5, label: "???" }, // prettier-ignore
                                        { offset: 0x4d4, bit: 6, label: "???" }, // prettier-ignore
                                        { offset: 0x4d4, bit: 7, label: "???" }, // prettier-ignore
                                        { offset: 0x4d5, bit: 0, label: "???" }, // prettier-ignore
                                        { offset: 0x4d5, bit: 1, label: "???" }, // prettier-ignore
                                        { offset: 0x4d5, bit: 2, label: "???" }, // prettier-ignore
                                        { offset: 0x4d5, bit: 3, label: "???" }, // prettier-ignore
                                        { offset: 0x4d5, bit: 4, label: "???" }, // prettier-ignore
                                        { offset: 0x4d5, bit: 5, label: "???" }, // prettier-ignore
                                        { offset: 0x4d5, bit: 6, label: "???" }, // prettier-ignore
                                        { offset: 0x4d5, bit: 7, label: "???" }, // prettier-ignore
                                      ],
                                    },
                                  ],
                                },
                                {
                                  name: "Lancer",
                                  items: [
                                    {
                                      type: "section",
                                      flex: true,
                                      items: [
                                        {
                                          name: "Total Job Points",
                                          offset: 0x534,
                                          type: "variable",
                                          dataType: "uint16",
                                          max: 9999,
                                        },
                                        {
                                          name: "Job Points",
                                          offset: 0x50c,
                                          type: "variable",
                                          dataType: "uint16",
                                          max: 9999,
                                        },
                                      ],
                                    },
                                    {
                                      name: "Learned Abilities",
                                      type: "bitflags",
                                      flags: [
                                        { offset: 0x4d6, bit: 0, label: "???" }, // prettier-ignore
                                        { offset: 0x4d6, bit: 1, label: "???" }, // prettier-ignore
                                        { offset: 0x4d6, bit: 2, label: "???" }, // prettier-ignore
                                        { offset: 0x4d6, bit: 3, label: "???" }, // prettier-ignore
                                        { offset: 0x4d6, bit: 4, label: "???" }, // prettier-ignore
                                        { offset: 0x4d6, bit: 5, label: "???" }, // prettier-ignore
                                        { offset: 0x4d6, bit: 6, label: "???" }, // prettier-ignore
                                        { offset: 0x4d6, bit: 7, label: "???" }, // prettier-ignore
                                        { offset: 0x4d7, bit: 0, label: "???" }, // prettier-ignore
                                        { offset: 0x4d7, bit: 1, label: "???" }, // prettier-ignore
                                        { offset: 0x4d7, bit: 2, label: "???" }, // prettier-ignore
                                        { offset: 0x4d7, bit: 3, label: "???" }, // prettier-ignore
                                        { offset: 0x4d7, bit: 4, label: "???" }, // prettier-ignore
                                        { offset: 0x4d7, bit: 5, label: "???" }, // prettier-ignore
                                        { offset: 0x4d7, bit: 6, label: "???" }, // prettier-ignore
                                        { offset: 0x4d7, bit: 7, label: "???" }, // prettier-ignore
                                        { offset: 0x4d8, bit: 0, label: "???" }, // prettier-ignore
                                        { offset: 0x4d8, bit: 1, label: "???" }, // prettier-ignore
                                        { offset: 0x4d8, bit: 2, label: "???" }, // prettier-ignore
                                        { offset: 0x4d8, bit: 3, label: "???" }, // prettier-ignore
                                        { offset: 0x4d8, bit: 4, label: "???" }, // prettier-ignore
                                        { offset: 0x4d8, bit: 5, label: "???" }, // prettier-ignore
                                        { offset: 0x4d8, bit: 6, label: "???" }, // prettier-ignore
                                        { offset: 0x4d8, bit: 7, label: "???" }, // prettier-ignore
                                      ],
                                    },
                                  ],
                                },
                                {
                                  name: "Samurai",
                                  items: [
                                    {
                                      type: "section",
                                      flex: true,
                                      items: [
                                        {
                                          name: "Total Job Points",
                                          offset: 0x536,
                                          type: "variable",
                                          dataType: "uint16",
                                          max: 9999,
                                        },
                                        {
                                          name: "Job Points",
                                          offset: 0x50e,
                                          type: "variable",
                                          dataType: "uint16",
                                          max: 9999,
                                        },
                                      ],
                                    },
                                    {
                                      name: "Learned Abilities",
                                      type: "bitflags",
                                      flags: [
                                        { offset: 0x4d9, bit: 0, label: "???" }, // prettier-ignore
                                        { offset: 0x4d9, bit: 1, label: "???" }, // prettier-ignore
                                        { offset: 0x4d9, bit: 2, label: "???" }, // prettier-ignore
                                        { offset: 0x4d9, bit: 3, label: "???" }, // prettier-ignore
                                        { offset: 0x4d9, bit: 4, label: "???" }, // prettier-ignore
                                        { offset: 0x4d9, bit: 5, label: "???" }, // prettier-ignore
                                        { offset: 0x4d9, bit: 6, label: "???" }, // prettier-ignore
                                        { offset: 0x4d9, bit: 7, label: "???" }, // prettier-ignore
                                        { offset: 0x4da, bit: 0, label: "???" }, // prettier-ignore
                                        { offset: 0x4da, bit: 1, label: "???" }, // prettier-ignore
                                        { offset: 0x4da, bit: 2, label: "???" }, // prettier-ignore
                                        { offset: 0x4da, bit: 3, label: "???" }, // prettier-ignore
                                        { offset: 0x4da, bit: 4, label: "???" }, // prettier-ignore
                                        { offset: 0x4da, bit: 5, label: "???" }, // prettier-ignore
                                        { offset: 0x4da, bit: 6, label: "???" }, // prettier-ignore
                                        { offset: 0x4da, bit: 7, label: "???" }, // prettier-ignore
                                        { offset: 0x4db, bit: 0, label: "???" }, // prettier-ignore
                                        { offset: 0x4db, bit: 1, label: "???" }, // prettier-ignore
                                        { offset: 0x4db, bit: 2, label: "???" }, // prettier-ignore
                                        { offset: 0x4db, bit: 3, label: "???" }, // prettier-ignore
                                        { offset: 0x4db, bit: 4, label: "???" }, // prettier-ignore
                                        { offset: 0x4db, bit: 5, label: "???" }, // prettier-ignore
                                        { offset: 0x4db, bit: 6, label: "???" }, // prettier-ignore
                                        { offset: 0x4db, bit: 7, label: "???" }, // prettier-ignore
                                      ],
                                    },
                                  ],
                                },
                                {
                                  name: "Ninja",
                                  items: [
                                    {
                                      type: "section",
                                      flex: true,
                                      items: [
                                        {
                                          name: "Total Job Points",
                                          offset: 0x538,
                                          type: "variable",
                                          dataType: "uint16",
                                          max: 9999,
                                        },
                                        {
                                          name: "Job Points",
                                          offset: 0x510,
                                          type: "variable",
                                          dataType: "uint16",
                                          max: 9999,
                                        },
                                      ],
                                    },
                                    {
                                      name: "Learned Abilities",
                                      type: "bitflags",
                                      flags: [
                                        { offset: 0x4dc, bit: 0, label: "???" }, // prettier-ignore
                                        { offset: 0x4dc, bit: 1, label: "???" }, // prettier-ignore
                                        { offset: 0x4dc, bit: 2, label: "???" }, // prettier-ignore
                                        { offset: 0x4dc, bit: 3, label: "???" }, // prettier-ignore
                                        { offset: 0x4dc, bit: 4, label: "???" }, // prettier-ignore
                                        { offset: 0x4dc, bit: 5, label: "???" }, // prettier-ignore
                                        { offset: 0x4dc, bit: 6, label: "???" }, // prettier-ignore
                                        { offset: 0x4dc, bit: 7, label: "???" }, // prettier-ignore
                                        { offset: 0x4dd, bit: 0, label: "???" }, // prettier-ignore
                                        { offset: 0x4dd, bit: 1, label: "???" }, // prettier-ignore
                                        { offset: 0x4dd, bit: 2, label: "???" }, // prettier-ignore
                                        { offset: 0x4dd, bit: 3, label: "???" }, // prettier-ignore
                                        { offset: 0x4dd, bit: 4, label: "???" }, // prettier-ignore
                                        { offset: 0x4dd, bit: 5, label: "???" }, // prettier-ignore
                                        { offset: 0x4dd, bit: 6, label: "???" }, // prettier-ignore
                                        { offset: 0x4dd, bit: 7, label: "???" }, // prettier-ignore
                                        { offset: 0x4de, bit: 0, label: "???" }, // prettier-ignore
                                        { offset: 0x4de, bit: 1, label: "???" }, // prettier-ignore
                                        { offset: 0x4de, bit: 2, label: "???" }, // prettier-ignore
                                        { offset: 0x4de, bit: 3, label: "???" }, // prettier-ignore
                                        { offset: 0x4de, bit: 4, label: "???" }, // prettier-ignore
                                        { offset: 0x4de, bit: 5, label: "???" }, // prettier-ignore
                                        { offset: 0x4de, bit: 6, label: "???" }, // prettier-ignore
                                        { offset: 0x4de, bit: 7, label: "???" }, // prettier-ignore
                                      ],
                                    },
                                  ],
                                },
                                {
                                  name: "Calculator",
                                  items: [
                                    {
                                      type: "section",
                                      flex: true,
                                      items: [
                                        {
                                          name: "Total Job Points",
                                          offset: 0x53a,
                                          type: "variable",
                                          dataType: "uint16",
                                          max: 9999,
                                        },
                                        {
                                          name: "Job Points",
                                          offset: 0x512,
                                          type: "variable",
                                          dataType: "uint16",
                                          max: 9999,
                                        },
                                      ],
                                    },
                                    {
                                      name: "Learned Abilities",
                                      type: "bitflags",
                                      flags: [
                                        { offset: 0x4df, bit: 0, label: "???" }, // prettier-ignore
                                        { offset: 0x4df, bit: 1, label: "???" }, // prettier-ignore
                                        { offset: 0x4df, bit: 2, label: "???" }, // prettier-ignore
                                        { offset: 0x4df, bit: 3, label: "???" }, // prettier-ignore
                                        { offset: 0x4df, bit: 4, label: "???" }, // prettier-ignore
                                        { offset: 0x4df, bit: 5, label: "???" }, // prettier-ignore
                                        { offset: 0x4df, bit: 6, label: "???" }, // prettier-ignore
                                        { offset: 0x4df, bit: 7, label: "???" }, // prettier-ignore
                                        { offset: 0x4e0, bit: 0, label: "???" }, // prettier-ignore
                                        { offset: 0x4e0, bit: 1, label: "???" }, // prettier-ignore
                                        { offset: 0x4e0, bit: 2, label: "???" }, // prettier-ignore
                                        { offset: 0x4e0, bit: 3, label: "???" }, // prettier-ignore
                                        { offset: 0x4e0, bit: 4, label: "???" }, // prettier-ignore
                                        { offset: 0x4e0, bit: 5, label: "???" }, // prettier-ignore
                                        { offset: 0x4e0, bit: 6, label: "???" }, // prettier-ignore
                                        { offset: 0x4e0, bit: 7, label: "???" }, // prettier-ignore
                                        { offset: 0x4e1, bit: 0, label: "???" }, // prettier-ignore
                                        { offset: 0x4e1, bit: 1, label: "???" }, // prettier-ignore
                                        { offset: 0x4e1, bit: 2, label: "???" }, // prettier-ignore
                                        { offset: 0x4e1, bit: 3, label: "???" }, // prettier-ignore
                                        { offset: 0x4e1, bit: 4, label: "???" }, // prettier-ignore
                                        { offset: 0x4e1, bit: 5, label: "???" }, // prettier-ignore
                                        { offset: 0x4e1, bit: 6, label: "???" }, // prettier-ignore
                                        { offset: 0x4e1, bit: 7, label: "???" }, // prettier-ignore
                                      ],
                                    },
                                  ],
                                },
                                {
                                  name: "Bard",
                                  items: [
                                    {
                                      type: "section",
                                      flex: true,
                                      items: [
                                        {
                                          name: "Total Job Points",
                                          offset: 0x53c,
                                          type: "variable",
                                          dataType: "uint16",
                                          max: 9999,
                                        },
                                        {
                                          name: "Job Points",
                                          offset: 0x514,
                                          type: "variable",
                                          dataType: "uint16",
                                          max: 9999,
                                        },
                                      ],
                                    },
                                    {
                                      name: "Learned Abilities",
                                      type: "bitflags",
                                      flags: [
                                        { offset: 0x4e2, bit: 0, label: "???" }, // prettier-ignore
                                        { offset: 0x4e2, bit: 1, label: "???" }, // prettier-ignore
                                        { offset: 0x4e2, bit: 2, label: "???" }, // prettier-ignore
                                        { offset: 0x4e2, bit: 3, label: "???" }, // prettier-ignore
                                        { offset: 0x4e2, bit: 4, label: "???" }, // prettier-ignore
                                        { offset: 0x4e2, bit: 5, label: "???" }, // prettier-ignore
                                        { offset: 0x4e2, bit: 6, label: "???" }, // prettier-ignore
                                        { offset: 0x4e2, bit: 7, label: "???" }, // prettier-ignore
                                        { offset: 0x4e3, bit: 0, label: "???" }, // prettier-ignore
                                        { offset: 0x4e3, bit: 1, label: "???" }, // prettier-ignore
                                        { offset: 0x4e3, bit: 2, label: "???" }, // prettier-ignore
                                        { offset: 0x4e3, bit: 3, label: "???" }, // prettier-ignore
                                        { offset: 0x4e3, bit: 4, label: "???" }, // prettier-ignore
                                        { offset: 0x4e3, bit: 5, label: "???" }, // prettier-ignore
                                        { offset: 0x4e3, bit: 6, label: "???" }, // prettier-ignore
                                        { offset: 0x4e3, bit: 7, label: "???" }, // prettier-ignore
                                        { offset: 0x4e4, bit: 0, label: "???" }, // prettier-ignore
                                        { offset: 0x4e4, bit: 1, label: "???" }, // prettier-ignore
                                        { offset: 0x4e4, bit: 2, label: "???" }, // prettier-ignore
                                        { offset: 0x4e4, bit: 3, label: "???" }, // prettier-ignore
                                        { offset: 0x4e4, bit: 4, label: "???" }, // prettier-ignore
                                        { offset: 0x4e4, bit: 5, label: "???" }, // prettier-ignore
                                        { offset: 0x4e4, bit: 6, label: "???" }, // prettier-ignore
                                        { offset: 0x4e4, bit: 7, label: "???" }, // prettier-ignore
                                      ],
                                    },
                                  ],
                                },
                                {
                                  name: "Dancer",
                                  items: [
                                    {
                                      type: "section",
                                      flex: true,
                                      items: [
                                        {
                                          name: "Total Job Points",
                                          offset: 0x53e,
                                          type: "variable",
                                          dataType: "uint16",
                                          max: 9999,
                                        },
                                        {
                                          name: "Job Points",
                                          offset: 0x516,
                                          type: "variable",
                                          dataType: "uint16",
                                          max: 9999,
                                        },
                                      ],
                                    },
                                    {
                                      name: "Learned Abilities",
                                      type: "bitflags",
                                      flags: [
                                        { offset: 0x4e5, bit: 0, label: "???" }, // prettier-ignore
                                        { offset: 0x4e5, bit: 1, label: "???" }, // prettier-ignore
                                        { offset: 0x4e5, bit: 2, label: "???" }, // prettier-ignore
                                        { offset: 0x4e5, bit: 3, label: "???" }, // prettier-ignore
                                        { offset: 0x4e5, bit: 4, label: "???" }, // prettier-ignore
                                        { offset: 0x4e5, bit: 5, label: "???" }, // prettier-ignore
                                        { offset: 0x4e5, bit: 6, label: "???" }, // prettier-ignore
                                        { offset: 0x4e5, bit: 7, label: "???" }, // prettier-ignore
                                        { offset: 0x4e6, bit: 0, label: "???" }, // prettier-ignore
                                        { offset: 0x4e6, bit: 1, label: "???" }, // prettier-ignore
                                        { offset: 0x4e6, bit: 2, label: "???" }, // prettier-ignore
                                        { offset: 0x4e6, bit: 3, label: "???" }, // prettier-ignore
                                        { offset: 0x4e6, bit: 4, label: "???" }, // prettier-ignore
                                        { offset: 0x4e6, bit: 5, label: "???" }, // prettier-ignore
                                        { offset: 0x4e6, bit: 6, label: "???" }, // prettier-ignore
                                        { offset: 0x4e6, bit: 7, label: "???" }, // prettier-ignore
                                        { offset: 0x4e7, bit: 0, label: "???" }, // prettier-ignore
                                        { offset: 0x4e7, bit: 1, label: "???" }, // prettier-ignore
                                        { offset: 0x4e7, bit: 2, label: "???" }, // prettier-ignore
                                        { offset: 0x4e7, bit: 3, label: "???" }, // prettier-ignore
                                        { offset: 0x4e7, bit: 4, label: "???" }, // prettier-ignore
                                        { offset: 0x4e7, bit: 5, label: "???" }, // prettier-ignore
                                        { offset: 0x4e7, bit: 6, label: "???" }, // prettier-ignore
                                        { offset: 0x4e7, bit: 7, label: "???" }, // prettier-ignore
                                      ],
                                    },
                                  ],
                                },
                                {
                                  name: "Mime",
                                  items: [
                                    {
                                      type: "section",
                                      flex: true,
                                      items: [
                                        {
                                          name: "Total Job Points",
                                          offset: 0x540,
                                          type: "variable",
                                          dataType: "uint16",
                                          max: 9999,
                                        },
                                        {
                                          name: "Job Points",
                                          offset: 0x518,
                                          type: "variable",
                                          dataType: "uint16",
                                          max: 9999,
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
            },
            {
              name: "Inventory",
              items: [
                {
                  type: "tabs",
                  vertical: true,
                  items: inventory.map((type) => ({
                    name: type.name,
                    flex: true,
                    items: type.items.map((item) => ({
                      name: item.name,
                      offset: 0x1605 + item.index,
                      type: "variable",
                      dataType: "uint8",
                      max: 99,
                    })),
                  })),
                },
              ],
            },
            {
              name: "Brave Story",
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
                          name: "Injured",
                          offset: 0x1a08,
                          type: "variable",
                          dataType: "uint32",
                          // max:
                        },
                        {
                          name: "Casualties",
                          offset: 0x1a0c,
                          type: "variable",
                          dataType: "uint32",
                          // max:
                        },
                      ],
                    },
                    {
                      name: "Record",
                      items: [
                        {
                          type: "bitflags",
                          flags: [
                            { offset: 0x1aab, bit: 0, label: "???", hidden: true }, // prettier-ignore
                            { offset: 0x1aab, bit: 1, label: "???", hidden: true }, // prettier-ignore
                            { offset: 0x1aab, bit: 2, label: "???", hidden: true }, // prettier-ignore
                            { offset: 0x1aab, bit: 3, label: "???", hidden: true }, // prettier-ignore
                            { offset: 0x1aab, bit: 4, label: "Cadets" }, // prettier-ignore
                            { offset: 0x1aab, bit: 5, label: "Death of father Balbanes" }, // prettier-ignore
                            { offset: 0x1aab, bit: 6, label: "First Meeting with Algus" }, // prettier-ignore
                            { offset: 0x1aab, bit: 7, label: "Reunion with Dycedarg" }, // prettier-ignore
                            { offset: 0x1aac, bit: 0, label: "At Igros Castle" }, // prettier-ignore
                            { offset: 0x1aac, bit: 1, label: "After Gustav!" }, // prettier-ignore
                            { offset: 0x1aac, bit: 2, label: "Rescue of Marquis Elmdor" }, // prettier-ignore
                            { offset: 0x1aac, bit: 3, label: "Master of Gallione" }, // prettier-ignore
                            { offset: 0x1aac, bit: 4, label: "Lady of the Death Corps" }, // prettier-ignore
                            { offset: 0x1aac, bit: 5, label: "Attack by the Death Corps" }, // prettier-ignore
                            { offset: 0x1aac, bit: 6, label: "Delita's Anger" }, // prettier-ignore
                            { offset: 0x1aac, bit: 7, label: "Reed pipe" }, // prettier-ignore
                            { offset: 0x1aad, bit: 0, label: "One rock and a small ripple" }, // prettier-ignore
                            { offset: 0x1aad, bit: 1, label: "And I escaped..." }, // prettier-ignore
                            { offset: 0x1aad, bit: 2, label: "Prayer of Queen Ovelia" }, // prettier-ignore
                            { offset: 0x1aad, bit: 3, label: "Ovelia chase" }, // prettier-ignore
                            { offset: 0x1aad, bit: 4, label: "Reunion with Delita" }, // prettier-ignore
                            { offset: 0x1aad, bit: 5, label: "Machinist" }, // prettier-ignore
                            { offset: 0x1aad, bit: 6, label: "Worries of Ovelia" }, // prettier-ignore
                            { offset: 0x1aad, bit: 7, label: "Dycedarg's plans" }, // prettier-ignore
                            { offset: 0x1aae, bit: 0, label: "Cardinal Draclau and the Holy Stone" }, // prettier-ignore
                            { offset: 0x1aae, bit: 1, label: "Those who seek the Holy Stone" }, // prettier-ignore
                            { offset: 0x1aae, bit: 2, label: "Besrodio rescue" }, // prettier-ignore
                            { offset: 0x1aae, bit: 3, label: "Delita's advice" }, // prettier-ignore
                            { offset: 0x1aae, bit: 4, label: "Cardinal's anger" }, // prettier-ignore
                            { offset: 0x1aae, bit: 5, label: "Those who use, those who get used" }, // prettier-ignore
                            { offset: 0x1aae, bit: 6, label: "The Lion War Outbreak" }, // prettier-ignore
                            { offset: 0x1aae, bit: 7, label: "T.G. Cid" }, // prettier-ignore
                            { offset: 0x1aaf, bit: 0, label: "First meeting with Olan" }, // prettier-ignore
                            { offset: 0x1aaf, bit: 1, label: "Reunion with Zalbag" }, // prettier-ignore
                            { offset: 0x1aaf, bit: 2, label: 'As a "Heretic"' }, // prettier-ignore
                            { offset: 0x1aaf, bit: 3, label: "Confessions of Simon" }, // prettier-ignore
                            { offset: 0x1aaf, bit: 4, label: "Velius" }, // prettier-ignore
                            { offset: 0x1aaf, bit: 5, label: "Ovelia and Delita" }, // prettier-ignore
                            { offset: 0x1aaf, bit: 6, label: "Son of T.G. Cid" }, // prettier-ignore
                            { offset: 0x1aaf, bit: 7, label: "Divine Rafa" }, // prettier-ignore
                            { offset: 0x1ab0, bit: 0, label: "Ambitions of Prince Barinten" }, // prettier-ignore
                            { offset: 0x1ab0, bit: 1, label: "Escaping Alma" }, // prettier-ignore
                            { offset: 0x1ab0, bit: 2, label: "Scars of a tragedy" }, // prettier-ignore
                            { offset: 0x1ab0, bit: 3, label: "The other power" }, // prettier-ignore
                            { offset: 0x1ab0, bit: 4, label: "The lying heart" }, // prettier-ignore
                            { offset: 0x1ab0, bit: 5, label: "Those who squirm in darkness" }, // prettier-ignore
                            { offset: 0x1ab0, bit: 6, label: "A man with the Holy Stone" }, // prettier-ignore
                            { offset: 0x1ab0, bit: 7, label: "Delita's thoughts" }, // prettier-ignore
                            { offset: 0x1ab1, bit: 0, label: "Unstoppable cog" }, // prettier-ignore
                            { offset: 0x1ab1, bit: 1, label: "Seized T.G. Cid" }, // prettier-ignore
                            { offset: 0x1ab1, bit: 2, label: "Assassination of Prince Larg!" }, // prettier-ignore
                            { offset: 0x1ab1, bit: 3, label: "Rescue of Cid" }, // prettier-ignore
                            { offset: 0x1ab1, bit: 4, label: "Prince Goltana's final moments" }, // prettier-ignore
                            { offset: 0x1ab1, bit: 5, label: "Ambitions of Dycedarg" }, // prettier-ignore
                            { offset: 0x1ab1, bit: 6, label: "Men of odd appearance" }, // prettier-ignore
                            { offset: 0x1ab1, bit: 7, label: "The mystery of Lucavi" }, // prettier-ignore
                            { offset: 0x1ab2, bit: 0, label: "Delita's betrayal" }, // prettier-ignore
                            { offset: 0x1ab2, bit: 1, label: "Mosfungus" }, // prettier-ignore
                            { offset: 0x1ab2, bit: 2, label: "Funeral's final moments" }, // prettier-ignore
                            { offset: 0x1ab2, bit: 3, label: "Requiem" }, // prettier-ignore
                            { offset: 0x1ab2, bit: 4, label: "Steel Ball found!" }, // prettier-ignore
                            { offset: 0x1ab2, bit: 5, label: "The Steel Giant starts!" }, // prettier-ignore
                            { offset: 0x1ab2, bit: 6, label: "Celestial Globe found!?" }, // prettier-ignore
                            { offset: 0x1ab2, bit: 7, label: "Summon Cloud!" }, // prettier-ignore
                            { offset: 0x1ab3, bit: 0, label: "Reis's curse" }, // prettier-ignore
                            { offset: 0x1ab3, bit: 1, label: "Entrance to the other world" }, // prettier-ignore
                            { offset: 0x1ab3, bit: 2, label: "Reunion and beyond..." }, // prettier-ignore
                            { offset: 0x1ab3, bit: 3, label: "Things obtained" }, // prettier-ignore
                            { offset: 0x1ab3, bit: 4, label: "???", hidden: true }, // prettier-ignore
                            { offset: 0x1ab3, bit: 5, label: "???", hidden: true }, // prettier-ignore
                            { offset: 0x1ab3, bit: 6, label: "???", hidden: true }, // prettier-ignore
                            { offset: 0x1ab3, bit: 7, label: "???", hidden: true }, // prettier-ignore
                          ],
                        },
                      ],
                    },
                    {
                      name: "Person",
                      flex: true,
                      items: persons.map((person) => ({
                        name: person.name,
                        offset: 0x1b10 + Math.floor(person.index / 0x2),
                        type: "variable",
                        dataType: person.index % 2 === 0 ? "lower4" : "upper4",
                        max: person.max,
                      })),
                    },
                    {
                      name: "Job",
                      items: [
                        {
                          type: "bitflags",
                          flags: jobs.map((job) => ({
                            offset: 0x1ae0 + Math.floor(job.index / 0x2),
                            bit: job.index % 2 === 0 ? 2 : 6,
                            label: job.name,
                          })),
                        },
                      ],
                    },
                    {
                      name: "Unexplored Land",
                      items: unexploredLands.map((land) => {
                        const monthOffset =
                          0x159 + Math.floor((5 + land.index * 0x9) / 0x8);
                        const dayOffset =
                          0x159 + Math.floor((land.index * 0x9) / 0x8);

                        return {
                          type: "section",
                          flex: true,
                          noMargin: true,
                          items: [
                            {
                              name: land.name,
                              offset: 0x1ade + Math.floor(land.index / 0x8),
                              type: "variable",
                              dataType: "bit",
                              bit: land.index % 8,
                              resource: "booleanDiscovered",
                            },
                            {
                              name: "Start",
                              type: "group",
                              items: [
                                {
                                  offset: monthOffset,
                                  type: "variable",
                                  dataType: "uint16",
                                  binary: {
                                    bitStart: (5 + land.index * 9) % 8,
                                    bitLength: 4,
                                  },
                                  resource: "months",
                                },
                                {
                                  offset: dayOffset,
                                  type: "variable",
                                  dataType: "uint16",
                                  binary: {
                                    bitStart: (land.index * 9) % 8,
                                    bitLength: 5,
                                  },
                                  min: 0,
                                  max: 31,
                                },
                              ],
                            },
                          ],
                        };
                      }),
                    },
                    {
                      name: "Treasure",
                      items: treasures.map((treasure) => {
                        const monthOffset =
                          0x124 + Math.floor((5 + treasure.index * 0x9) / 0x8);
                        const dayOffset =
                          0x124 + Math.floor((treasure.index * 0x9) / 0x8);

                        return {
                          type: "section",
                          flex: true,
                          noMargin: true,
                          items: [
                            {
                              name: treasure.name,
                              offset:
                                0x1ad8 + Math.floor((1 + treasure.index) / 0x8),
                              type: "variable",
                              dataType: "bit",
                              bit: (1 + treasure.index) % 8,
                              resource: "booleanObtained",
                            },
                            {
                              name: "Start",
                              type: "group",
                              items: [
                                {
                                  offset: monthOffset,
                                  type: "variable",
                                  dataType: "uint16",
                                  binary: {
                                    bitStart: (5 + treasure.index * 9) % 8,
                                    bitLength: 4,
                                  },
                                  resource: "months",
                                },
                                {
                                  offset: dayOffset,
                                  type: "variable",
                                  dataType: "uint16",
                                  binary: {
                                    bitStart: (treasure.index * 9) % 8,
                                    bitLength: 5,
                                  },
                                  min: 0,
                                  max: 31,
                                },
                              ],
                            },
                          ],
                        };
                      }),
                    },
                  ],
                },
              ],
            },
            {
              name: "Propositions",
              items: [
                {
                  name: "Proposition Count",
                  offset: 0x438,
                  type: "variable",
                  dataType: "uint8",
                  hidden: true,
                },
                {
                  // id: "formation",
                  length: 0x9,
                  type: "container",
                  instanceType: "tabs",
                  instances: 8,
                  // resource: "unitNames",
                  vertical: true,
                  items: [
                    {
                      type: "section",
                      flex: true,
                      items: [
                        {
                          name: "Progression",
                          offset: 0x439,
                          type: "variable",
                          dataType: "uint8",
                          // max: 9999,
                        },
                        {
                          name: "Proposition",
                          offset: 0x43a,
                          type: "variable",
                          dataType: "uint8",
                          // max: 9999,
                        },
                        {
                          name: "Days",
                          type: "group",
                          mode: "fraction",
                          items: [
                            {
                              offset: 0x43b,
                              type: "variable",
                              dataType: "uint8",
                              // max
                            },
                            {
                              offset: 0x43c,
                              type: "variable",
                              dataType: "uint8",
                              // max
                            },
                          ],
                        },
                        {
                          name: "Place",
                          offset: 0x43d,
                          type: "variable",
                          dataType: "uint8",
                          // max: 9999,
                        },
                      ],
                    },
                    {
                      type: "section",
                      flex: true,
                      items: [
                        {
                          name: "Units Sent",
                          offset: 0x43e,
                          type: "variable",
                          dataType: "uint8",
                          // max: 9999,
                        },
                        {
                          name: "Unit 1",
                          offset: 0x43f,
                          type: "variable",
                          dataType: "uint8",
                          // max: 9999,
                        },
                        {
                          name: "Unit 2",
                          offset: 0x440,
                          type: "variable",
                          dataType: "uint8",
                          // max: 9999,
                        },
                        {
                          name: "Unit 3",
                          offset: 0x441,
                          type: "variable",
                          dataType: "uint8",
                          // max: 9999,
                        },
                      ],
                    },
                  ],
                },
              ],
            },
            {
              name: "Option",
              items: [
                {
                  type: "section",
                  flex: true,
                  items: [
                    {
                      name: "Cursor movement",
                      offset: 0x1c84,
                      type: "variable",
                      dataType: "bit",
                      bit: 0,
                      resource: "cursorMovements",
                    },
                    {
                      name: "Cursor repeat speed",
                      offset: 0x1c84,
                      type: "variable",
                      dataType: "uint8",
                      binary: { bitStart: 3, bitLength: 2 },
                      resource: "speeds1",
                    },
                    {
                      name: "Cursor speed on mult. heights",
                      offset: 0x1c84,
                      type: "variable",
                      dataType: "uint8",
                      binary: { bitStart: 6, bitLength: 2 },
                      resource: "speeds2",
                    },
                    {
                      name: "Finger cursor repeat speed",
                      offset: 0x1c85,
                      type: "variable",
                      dataType: "uint8",
                      binary: { bitStart: 1, bitLength: 3 },
                      resource: "speeds3",
                    },
                  ],
                },
                {
                  type: "section",
                  flex: true,
                  items: [
                    {
                      name: "Message display speed",
                      offset: 0x1c85,
                      type: "variable",
                      dataType: "uint8",
                      binary: { bitStart: 4, bitLength: 2 },
                      resource: "speeds1",
                    },
                    {
                      name: "Navigation message",
                      offset: 0x1c85,
                      type: "variable",
                      dataType: "bit",
                      bit: 7,
                      resource: "optionBoolean",
                    },
                    {
                      name: "Show Ability name",
                      offset: 0x1c86,
                      type: "variable",
                      dataType: "bit",
                      bit: 1,
                      resource: "optionBoolean",
                    },
                    {
                      name: "Show effect message",
                      offset: 0x1c86,
                      type: "variable",
                      dataType: "bit",
                      bit: 3,
                      resource: "optionBoolean",
                    },
                    {
                      name: "Show Exp and Jp gained",
                      offset: 0x1c87,
                      type: "variable",
                      dataType: "bit",
                      bit: 1,
                      resource: "optionBoolean",
                    },
                  ],
                },
                {
                  type: "section",
                  flex: true,
                  items: [
                    {
                      name: "Target flashing",
                      offset: 0x1c87,
                      type: "variable",
                      dataType: "bit",
                      bit: 3,
                      resource: "optionBoolean",
                    },
                    {
                      name: "Show unequippable item by Job",
                      offset: 0x1c86,
                      type: "variable",
                      dataType: "bit",
                      bit: 7,
                      resource: "optionBoolean",
                    },
                    {
                      name: "Max equip at Job change",
                      offset: 0x1c87,
                      type: "variable",
                      dataType: "bit",
                      bit: 5,
                      resource: "optionBoolean",
                    },
                  ],
                },
                {
                  type: "section",
                  flex: true,
                  items: [
                    {
                      name: "Sound",
                      offset: 0x1c86,
                      type: "variable",
                      dataType: "uint8",
                      binary: { bitStart: 5, bitLength: 2 },
                      resource: "sounds",
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
    booleanDiscovered: {
      0x0: "-",
      0x1: "Discovered",
    },
    booleanObtained: {
      0x0: "-",
      0x1: "Obtained",
    },
    cursorMovements: {
      0x0: "A type",
      0x1: "B type",
    },
    letters: [
      // USA
      {
        0x0: "0",
        0x1: "1",
        0x2: "2",
        0x3: "3",
        0x4: "4",
        0x5: "5",
        0x6: "6",
        0x7: "7",
        0x8: "8",
        0x9: "9",
        0xa: "A",
        0xb: "B",
        0xc: "C",
        0xd: "D",
        0xe: "E",
        0xf: "F",
        0x10: "G",
        0x11: "H",
        0x12: "I",
        0x13: "J",
        0x14: "K",
        0x15: "L",
        0x16: "M",
        0x17: "N",
        0x18: "O",
        0x19: "P",
        0x1a: "Q",
        0x1b: "R",
        0x1c: "S",
        0x1d: "T",
        0x1e: "U",
        0x1f: "V",
        0x20: "W",
        0x21: "X",
        0x22: "Y",
        0x23: "Z",
        0x24: "a",
        0x25: "b",
        0x26: "c",
        0x27: "d",
        0x28: "e",
        0x29: "f",
        0x2a: "g",
        0x2b: "h",
        0x2c: "i",
        0x2d: "j",
        0x2e: "k",
        0x2f: "l",
        0x30: "m",
        0x31: "n",
        0x32: "o",
        0x33: "p",
        0x34: "q",
        0x35: "r",
        0x36: "s",
        0x37: "t",
        0x38: "u",
        0x39: "v",
        0x3a: "w",
        0x3b: "x",
        0x3c: "y",
        0x3d: "z",
        0x3e: "!",
        0x40: "?",
        0x42: "+",
        0x44: "/",
        0x46: ":",
        0x5f: ".",
        0x8b: "・",
        0x8d: "(",
        0x8e: ")",
        0x91: '"',
        0x93: "'",
        0xfa: " ",
      },
    ],
    months: {
      0x1: "January",
      0x2: "February",
      0x3: "March",
      0x4: "April",
      0x5: "May",
      0x6: "June",
      0x7: "July",
      0x8: "August",
      0x9: "September",
      0xa: "October",
      0xb: "November",
      0xc: "December",
    },
    optionBoolean: {
      0x0: "On",
      0x1: "Off",
    },
    sounds: {
      0x0: "Mono",
      0x1: "Stereo",
      0x2: "Wide",
    },
    speeds1: {
      0x0: "Fast",
      0x1: "Regular",
      0x2: "Slow",
    },
    speeds2: {
      0x0: "Fast",
      0x1: "Regular",
      0x2: "Slow",
      0x3: "Stop",
    },
    speeds3: {
      0x0: "Fastest",
      0x1: "Faster",
      0x2: "Fast",
      0x3: "Regular",
      0x4: "Slow",
      0x5: "Slower",
      0x6: "Slowest",
    },
    unitNames: "getUnitNames()",
  },
};

export default template;
