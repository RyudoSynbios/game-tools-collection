import type { GameJson } from "$lib/types";

import {
  accessories,
  backGlyphs,
  bodyGears,
  enemies,
  handGlyphs,
  headGears,
  inventory,
  items,
  keyItems,
  legGears,
} from "./utils/resource";

const template: GameJson = {
  validator: {
    regions: {
      europe: {
        0x4: [
          0x4a, 0x50, 0x20, 0x4b, 0x4f, 0x4e, 0x41, 0x4d, 0x49, 0x20, 0x43,
          0x56,
        ], // "JP KONAMI CV"
      },
      usa: {
        0x4: [
          0x4a, 0x50, 0x20, 0x4b, 0x4f, 0x4e, 0x41, 0x4d, 0x49, 0x20, 0x43,
          0x56,
        ], // "JP KONAMI CV"
      },
      japan: {
        0x4: [
          0x4a, 0x50, 0x20, 0x4b, 0x4f, 0x4e, 0x41, 0x4d, 0x49, 0x20, 0x43,
          0x56,
        ], // "JP KONAMI CV"
      },
      korea: {
        0x4: [
          0x4a, 0x50, 0x20, 0x4b, 0x4f, 0x4e, 0x41, 0x4d, 0x49, 0x20, 0x43,
          0x56,
        ], // "JP KONAMI CV"
      },
    },
    text: "Drag 'n' drop here or click to add a save file.",
    hint: "Compatible with Castlevania Dominus Collection.",
    error: "Not a valid save file.",
  },
  items: [
    {
      type: "section",
      flex: true,
      hidden: true,
      items: [
        {
          name: "Checksum Language Salt",
          offset: 0x1c4,
          type: "variable",
          dataType: "uint16",
          hidden: true,
        },
        {
          name: "Checksum Language",
          offset: 0x1c6,
          type: "checksum",
          dataType: "uint16",
          control: {
            offsetStart: 0x0,
            offsetEnd: 0x10,
          },
        },
        {
          name: "Checksum Slots / Records Salt",
          offset: 0x1c8,
          type: "variable",
          dataType: "uint16",
          hidden: true,
        },
        {
          name: "Checksum Slots / Records",
          offset: 0x1ca,
          type: "checksum",
          dataType: "uint16",
          control: {
            offsetStart: 0x10,
            offsetEnd: 0x1c4,
          },
        },
        {
          name: "Checksum System Salt",
          offset: 0x1cc,
          type: "variable",
          dataType: "uint16",
          hidden: true,
        },
        {
          name: "Checksum System",
          offset: 0x1ce,
          type: "checksum",
          dataType: "uint16",
          control: {
            offsetStart: 0x1c4,
            offsetEnd: 0x1e8,
          },
        },
      ],
    },
    {
      id: "slots",
      length: 0x690,
      type: "container",
      instanceType: "tabs",
      instances: 3,
      enumeration: "Slot %d",
      prependSubinstance: [
        {
          name: "General",
          items: [
            {
              id: "language",
              name: "Language",
              offset: 0x2,
              type: "variable",
              dataType: "uint8",
              resource: "languages",
            },
            {
              id: "unlockedModes",
              name: "Unlocked Modes",
              type: "bitflags",
              flags: [
                { offset: 0x15, bit: 4, label: "Hard Mode" },
                { offset: 0x15, bit: 4, label: "Albus Mode" },
                { offset: 0x15, bit: 4, label: "Sound Test" },
                { offset: 0x15, bit: 4, label: "Boss Rush Mode", separator: true },
                { offset: 0x16, bit: 2, label: "Hard Mode: Max Level 255" },
              ],
            },
            {
              type: "section",
              flex: true,
              hidden: true,
              items: [
                {
                  name: "General",
                  type: "bitflags",
                  hidden: true,
                  flags: [
                    { offset: 0x10, bit: 3, label: "???" },
                    { offset: 0x10, bit: 4, label: "???" },
                    { offset: 0x10, bit: 5, label: "Has Rankings and Game Clear Items" },
                    { offset: 0x10, bit: 6, label: "???" },
                    { offset: 0x10, bit: 7, label: "???" },
                    { offset: 0x14, bit: 0, label: "???" },
                    { offset: 0x14, bit: 1, label: "???" },
                    { offset: 0x14, bit: 2, label: "???" },
                    { offset: 0x17, bit: 6, label: "???" },
                    { offset: 0x17, bit: 7, label: "???" },
                  ],
                },
                {
                  name: "Slot 1",
                  type: "bitflags",
                  hidden: true,
                  flags: [
                    { offset: 0x10, bit: 0, label: "Active" },
                    { offset: 0x14, bit: 3, label: "Cleared" },
                    { offset: 0x14, bit: 6, label: "Hard Lv 50 Cleared" },
                    { offset: 0x15, bit: 1, label: "Hard Lv 1 Cleared", separator: true },
                    { offset: 0x15, bit: 4, label: "Bonus Modes to trigger" },
                    { offset: 0x16, bit: 5, label: "Bonus Modes unlocked", separator: true },
                    { offset: 0x15, bit: 7, label: "Queen of Hearts to trigger" },
                    { offset: 0x17, bit: 0, label: "Queen of Hearts obtained", separator: true },
                    { offset: 0x16, bit: 2, label: "Lv 255 on Hard Mode to trigger" },
                    { offset: 0x17, bit: 3, label: "Lv 255 on Hard Mode unlocked" },
                  ],
                },
                {
                  name: "Slot 2",
                  type: "bitflags",
                  hidden: true,
                  flags: [
                    { offset: 0x10, bit: 1, label: "Active" },
                    { offset: 0x14, bit: 4, label: "Cleared" },
                    { offset: 0x14, bit: 7, label: "Hard Lv 50 Cleared" },
                    { offset: 0x15, bit: 2, label: "Hard Lv 1 Cleared", separator: true },
                    { offset: 0x15, bit: 5, label: "Bonus modes to trigger" },
                    { offset: 0x16, bit: 6, label: "Bonus modes unlocked", separator: true },
                    { offset: 0x16, bit: 0, label: "Queen of Hearts to trigger" },
                    { offset: 0x17, bit: 1, label: "Queen of Hearts obtained", separator: true },
                    { offset: 0x16, bit: 3, label: "Lv 255 on Hard Mode to trigger" },
                    { offset: 0x17, bit: 4, label: "Lv 255 on Hard Mode unlocked" },
                  ],
                },
                {
                  name: "Slot 3",
                  type: "bitflags",
                  hidden: true,
                  flags: [
                    { offset: 0x10, bit: 2, label: "Active" },
                    { offset: 0x14, bit: 5, label: "Cleared" },
                    { offset: 0x15, bit: 0, label: "Hard Lv 50 Cleared" },
                    { offset: 0x15, bit: 3, label: "Hard Lv 1 Cleared", separator: true },
                    { offset: 0x15, bit: 6, label: "Bonus Modes to trigger" },
                    { offset: 0x16, bit: 7, label: "Bonus Modes unlocked", separator: true },
                    { offset: 0x16, bit: 1, label: "Queen of Hearts to trigger" },
                    { offset: 0x17, bit: 2, label: "Queen of Hearts obtained", separator: true },
                    { offset: 0x16, bit: 4, label: "Lv 255 on Hard Mode to trigger" },
                    { offset: 0x17, bit: 5, label: "Lv 255 on Hard Mode unlocked" },
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
                  name: "Slot 1 Copied from Source x",
                  offset: 0x13,
                  type: "variable",
                  dataType: "uint8",
                  binary: { bitStart: 0, bitLength: 2 },
                },
                {
                  name: "Slot 2 Copied from Source x",
                  offset: 0x13,
                  type: "variable",
                  dataType: "uint8",
                  binary: { bitStart: 2, bitLength: 2 },
                },
                {
                  name: "Slot 3 Copied from Source x",
                  offset: 0x13,
                  type: "variable",
                  dataType: "uint8",
                  binary: { bitStart: 4, bitLength: 2 },
                },
              ],
            },
            {
              type: "section",
              flex: true,
              hidden: true,
              items: [
                {
                  name: "Slot 1 Copied to Slot x",
                  offset: 0x18,
                  type: "variable",
                  dataType: "int8",
                },
                {
                  name: "Slot 1 Copied to Slot x",
                  offset: 0x19,
                  type: "variable",
                  dataType: "int8",
                },
                {
                  name: "Slot 2 Copied to Slot x",
                  offset: 0x1a,
                  type: "variable",
                  dataType: "int8",
                },
                {
                  name: "Slot 2 Copied to Slot x",
                  offset: 0x1b,
                  type: "variable",
                  dataType: "int8",
                },
                {
                  name: "Slot 3 Copied to Slot x",
                  offset: 0x1c,
                  type: "variable",
                  dataType: "int8",
                },
                {
                  name: "Slot 3 Copied to Slot x",
                  offset: 0x1d,
                  type: "variable",
                  dataType: "int8",
                },
              ],
            },
            {
              type: "section",
              flex: true,
              hidden: true,
              items: [
                {
                  name: "Suspended Slot",
                  offset: 0x13,
                  type: "variable",
                  dataType: "uint8",
                  binary: { bitStart: 6, bitLength: 2 },
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
          hidden: true,
          items: [
            {
              name: "Checksum Salt",
              offset: 0x1d0,
              type: "variable",
              dataType: "uint16",
              overrideShift: {
                parent: 1,
                shift: 0x4,
              },
              hidden: true,
            },
            {
              name: "Checksum",
              offset: 0x1d2,
              type: "checksum",
              dataType: "uint16",
              control: {
                offsetStart: 0x1e8,
                offsetEnd: 0x878,
              },
              order: 1,
              overrideShift: {
                parent: 1,
                shift: 0x4,
              },
            },
          ],
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
                      name: "Filename",
                      offset: 0x73e,
                      length: 0x8,
                      type: "variable",
                      dataType: "string",
                      letterDataType: "uint8",
                      resource: "letters",
                      test: true,
                    },
                    {
                      name: "Difficulty",
                      offset: 0x838,
                      type: "variable",
                      dataType: "uint8",
                      resource: "difficulties",
                    },
                    {
                      id: "progression-%index%",
                      name: "Progression",
                      offset: 0x14,
                      type: "variable",
                      dataType: "bit",
                      bit: 3,
                      resource: "progressions",
                      overrideShift: {
                        parent: 1,
                        shift: 0x0,
                      },
                    },
                    {
                      name: "Playtime",
                      type: "group",
                      mode: "time",
                      items: [
                        {
                          offset: 0x418,
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
                          max: 99,
                        },
                        {
                          offset: 0x418,
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
                          offset: 0x418,
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
                      id: "location",
                      name: "Location",
                      offset: 0x770,
                      type: "variable",
                      dataType: "uint24",
                      bigEndian: true,
                      resource: "locations",
                      size: "lg",
                      autocomplete: true,
                    },
                    {
                      name: "Map Type",
                      offset: 0x831,
                      type: "variable",
                      dataType: "uint8",
                      hidden: true,
                    },
                    {
                      name: "Gold",
                      offset: 0x3b4,
                      type: "variable",
                      dataType: "uint32",
                      max: 9999999,
                    },
                  ],
                },
                {
                  type: "section",
                  flex: true,
                  hidden: true,
                  items: [
                    {
                      name: "Position X",
                      offset: 0x764,
                      type: "variable",
                      dataType: "uint32",
                      hidden: true,
                    },
                    {
                      name: "Position Y",
                      offset: 0x768,
                      type: "variable",
                      dataType: "uint32",
                      hidden: true,
                    },
                    {
                      name: "Position Z",
                      offset: 0x76c,
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
                      name: "Kills",
                      offset: 0x68c,
                      type: "variable",
                      dataType: "uint32",
                      max: 99999,
                    },
                    {
                      name: "Hits Received",
                      offset: 0x690,
                      type: "variable",
                      dataType: "uint32",
                      max: 999999,
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
                              name: "Character",
                              offset: 0x836,
                              type: "variable",
                              dataType: "uint8",
                              resource: "characters",
                              disabled: true,
                            },
                            {
                              name: "Level",
                              type: "group",
                              mode: "fraction",
                              items: [
                                {
                                  id: "level",
                                  offset: 0x354,
                                  type: "variable",
                                  dataType: "uint8",
                                  min: 1,
                                },
                                {
                                  id: "maxLevel",
                                  offset: 0x83e,
                                  type: "variable",
                                  dataType: "uint8",
                                  resource: "levels",
                                },
                              ],
                            },
                            {
                              id: "experience",
                              name: "Experience",
                              offset: 0x3b0,
                              type: "variable",
                              dataType: "uint32",
                              max: 99999999,
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
                                  offset: 0x358,
                                  type: "variable",
                                  dataType: "uint16",
                                  min: 1,
                                  max: 9999,
                                },
                                {
                                  id: "bonusStats-0",
                                  offset: 0x35a,
                                  type: "variable",
                                  dataType: "uint16",
                                  min: 1,
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
                                  offset: 0x35c,
                                  type: "variable",
                                  dataType: "uint16",
                                  max: 9999,
                                },
                                {
                                  id: "bonusStats-1",
                                  offset: 0x35e,
                                  type: "variable",
                                  dataType: "uint16",
                                  max: 9999,
                                },
                              ],
                            },
                            {
                              name: "Hearts",
                              type: "group",
                              mode: "fraction",
                              items: [
                                {
                                  offset: 0x360,
                                  type: "variable",
                                  dataType: "uint16",
                                  max: 999,
                                },
                                {
                                  id: "bonusStats-2",
                                  offset: 0x362,
                                  type: "variable",
                                  dataType: "uint16",
                                  max: 999,
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
                              name: "Bonus HP",
                              offset: 0x840,
                              type: "variable",
                              dataType: "uint16",
                              hidden: true,
                            },
                            {
                              name: "Bonus MP",
                              offset: 0x842,
                              type: "variable",
                              dataType: "uint16",
                              hidden: true,
                            },
                            {
                              name: "Bonus Hearts",
                              offset: 0x844,
                              type: "variable",
                              dataType: "uint16",
                              hidden: true,
                            },
                          ],
                        },
                        {
                          name: "Current Set",
                          offset: 0x3e6,
                          type: "variable",
                          dataType: "uint8",
                          hidden: true,
                        },
                        {
                          name: "Condition",
                          type: "bitflags",
                          hidden: true,
                          flags: [
                            { offset: 0x3b8, bit: 0, label: "Poison" },
                            { offset: 0x3b8, bit: 1, label: "Curse" },
                            { offset: 0x3b8, bit: 2, label: "Stone" },
                          ],
                        },
                        {
                          type: "section",
                          flex: true,
                          hidden: true,
                          items: [
                            {
                              name: "Poison Timer",
                              offset: 0x3ba,
                              type: "variable",
                              dataType: "uint16",
                              hidden: true,
                            },
                            {
                              name: "Curse Timer",
                              offset: 0x3bc,
                              type: "variable",
                              dataType: "uint16",
                              hidden: true,
                            },
                            {
                              name: "Stone Timer",
                              offset: 0x3be,
                              type: "variable",
                              dataType: "uint16",
                              hidden: true,
                            },
                          ],
                        },
                      ],
                    },
                    {
                      name: "Attribute Points",
                      items: [
                        {
                          type: "section",
                          flex: true,
                          items: [
                            {
                              name: "Slash",
                              offset: 0x3c0,
                              type: "variable",
                              dataType: "uint16",
                            },
                            {
                              name: "Strike",
                              offset: 0x3c2,
                              type: "variable",
                              dataType: "uint16",
                            },
                            {
                              name: "Flame",
                              offset: 0x3c4,
                              type: "variable",
                              dataType: "uint16",
                            },
                          ],
                        },
                        {
                          type: "section",
                          flex: true,
                          items: [
                            {
                              name: "Ice",
                              offset: 0x3c6,
                              type: "variable",
                              dataType: "uint16",
                            },
                            {
                              name: "Lightning",
                              offset: 0x3c8,
                              type: "variable",
                              dataType: "uint16",
                            },
                            {
                              name: "Light",
                              offset: 0x3ca,
                              type: "variable",
                              dataType: "uint16",
                            },
                            {
                              name: "Darkness",
                              offset: 0x3cc,
                              type: "variable",
                              dataType: "uint16",
                            },
                          ],
                        },
                      ],
                    },
                    {
                      name: "Equipped Glyphs",
                      items: [
                        {
                          type: "section",
                          flex: true,
                          items: [
                            {
                              name: "Main",
                              offset: 0x364,
                              type: "variable",
                              dataType: "uint16",
                              resource: "handGlyphs",
                              autocomplete: true,
                            },
                            {
                              name: "Sub",
                              offset: 0x366,
                              type: "variable",
                              dataType: "uint16",
                              resource: "handGlyphs",
                              autocomplete: true,
                            },
                            {
                              name: "Back",
                              offset: 0x368,
                              type: "variable",
                              dataType: "uint16",
                              resource: "backGlyphs",
                              autocomplete: true,
                            },
                            {
                              name: "Glyph Union",
                              offset: 0x36a,
                              type: "variable",
                              dataType: "uint16",
                              resource: "glyphUnions",
                              autocomplete: true,
                            },
                          ],
                        },
                        {
                          name: "Set A",
                          type: "section",
                          flex: true,
                          items: [
                            {
                              name: "Main",
                              offset: 0x376,
                              type: "variable",
                              dataType: "uint16",
                              resource: "handGlyphs",
                              autocomplete: true,
                            },
                            {
                              name: "Sub",
                              offset: 0x378,
                              type: "variable",
                              dataType: "uint16",
                              resource: "handGlyphs",
                              autocomplete: true,
                            },
                            {
                              name: "Back",
                              offset: 0x37a,
                              type: "variable",
                              dataType: "uint16",
                              resource: "backGlyphs",
                              autocomplete: true,
                            },
                          ],
                        },
                        {
                          name: "Set B",
                          type: "section",
                          flex: true,
                          items: [
                            {
                              name: "Main",
                              offset: 0x388,
                              type: "variable",
                              dataType: "uint16",
                              resource: "handGlyphs",
                              autocomplete: true,
                            },
                            {
                              name: "Sub",
                              offset: 0x38a,
                              type: "variable",
                              dataType: "uint16",
                              resource: "handGlyphs",
                              autocomplete: true,
                            },
                            {
                              name: "Back",
                              offset: 0x38c,
                              type: "variable",
                              dataType: "uint16",
                              resource: "backGlyphs",
                              autocomplete: true,
                            },
                          ],
                        },
                        {
                          name: "Set C",
                          type: "section",
                          flex: true,
                          items: [
                            {
                              name: "Main",
                              offset: 0x39a,
                              type: "variable",
                              dataType: "uint16",
                              resource: "handGlyphs",
                              autocomplete: true,
                            },
                            {
                              name: "Sub",
                              offset: 0x39c,
                              type: "variable",
                              dataType: "uint16",
                              resource: "handGlyphs",
                              autocomplete: true,
                            },
                            {
                              name: "Back",
                              offset: 0x39e,
                              type: "variable",
                              dataType: "uint16",
                              resource: "backGlyphs",
                              autocomplete: true,
                            },
                          ],
                        },
                        {
                          name: "Hand Glyphs Last Used",
                          type: "section",
                          flex: true,
                          hidden: true,
                          items: [
                            {
                              name: "Slot 1",
                              offset: 0x6d8,
                              type: "variable",
                              dataType: "uint16",
                            },
                            {
                              name: "Slot 2",
                              offset: 0x6da,
                              type: "variable",
                              dataType: "uint16",
                            },
                            {
                              name: "Slot 3",
                              offset: 0x6dc,
                              type: "variable",
                              dataType: "uint16",
                            },
                            {
                              name: "Slot 4",
                              offset: 0x6de,
                              type: "variable",
                              dataType: "uint16",
                            },
                            {
                              name: "Slot 5",
                              offset: 0x6e0,
                              type: "variable",
                              dataType: "uint16",
                            },
                          ],
                        },
                        {
                          name: "Back Glyphs Last Used",
                          type: "section",
                          flex: true,
                          hidden: true,
                          items: [
                            {
                              name: "Slot 1",
                              offset: 0x6e6,
                              type: "variable",
                              dataType: "uint16",
                            },
                            {
                              name: "Slot 2",
                              offset: 0x6e8,
                              type: "variable",
                              dataType: "uint16",
                            },
                            {
                              name: "Slot 3",
                              offset: 0x6ea,
                              type: "variable",
                              dataType: "uint16",
                            },
                            {
                              name: "Slot 4",
                              offset: 0x6ec,
                              type: "variable",
                              dataType: "uint16",
                            },
                            {
                              name: "Slot 5",
                              offset: 0x6ee,
                              type: "variable",
                              dataType: "uint16",
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
                              name: "Head",
                              offset: 0x36e,
                              type: "variable",
                              dataType: "uint16",
                              resource: "headGears",
                              autocomplete: true,
                            },
                            {
                              name: "Body",
                              offset: 0x36c,
                              type: "variable",
                              dataType: "uint16",
                              resource: "bodyGears",
                              autocomplete: true,
                            },
                            {
                              name: "Legs",
                              offset: 0x370,
                              type: "variable",
                              dataType: "uint16",
                              resource: "legGears",
                              autocomplete: true,
                            },
                          ],
                        },
                        {
                          type: "section",
                          flex: true,
                          items: [
                            {
                              name: "Accessory 1",
                              offset: 0x372,
                              type: "variable",
                              dataType: "uint16",
                              resource: "accessories",
                              autocomplete: true,
                            },
                            {
                              name: "Accessory 2",
                              offset: 0x374,
                              type: "variable",
                              dataType: "uint16",
                              resource: "accessories",
                              autocomplete: true,
                            },
                          ],
                        },
                        {
                          name: "Head Gears Last Used",
                          type: "section",
                          flex: true,
                          hidden: true,
                          items: [
                            {
                              name: "Slot 1",
                              offset: 0x6f4,
                              type: "variable",
                              dataType: "uint16",
                              resource: "items",
                            },
                            {
                              name: "Slot 2",
                              offset: 0x6f6,
                              type: "variable",
                              dataType: "uint16",
                              resource: "items",
                            },
                            {
                              name: "Slot 3",
                              offset: 0x6f8,
                              type: "variable",
                              dataType: "uint16",
                              resource: "items",
                            },
                            {
                              name: "Slot 4",
                              offset: 0x6fa,
                              type: "variable",
                              dataType: "uint16",
                              resource: "items",
                            },
                            {
                              name: "Slot 5",
                              offset: 0x6fc,
                              type: "variable",
                              dataType: "uint16",
                              resource: "items",
                            },
                          ],
                        },
                        {
                          name: "Body Gears Last Used",
                          type: "section",
                          flex: true,
                          hidden: true,
                          items: [
                            {
                              name: "Slot 1",
                              offset: 0x702,
                              type: "variable",
                              dataType: "uint16",
                              resource: "items",
                            },
                            {
                              name: "Slot 2",
                              offset: 0x704,
                              type: "variable",
                              dataType: "uint16",
                              resource: "items",
                            },
                            {
                              name: "Slot 3",
                              offset: 0x706,
                              type: "variable",
                              dataType: "uint16",
                              resource: "items",
                            },
                            {
                              name: "Slot 4",
                              offset: 0x708,
                              type: "variable",
                              dataType: "uint16",
                              resource: "items",
                            },
                            {
                              name: "Slot 5",
                              offset: 0x70a,
                              type: "variable",
                              dataType: "uint16",
                              resource: "items",
                            },
                          ],
                        },
                        {
                          name: "Leg Gears Last Used",
                          type: "section",
                          flex: true,
                          hidden: true,
                          items: [
                            {
                              name: "Slot 1",
                              offset: 0x710,
                              type: "variable",
                              dataType: "uint16",
                              resource: "items",
                            },
                            {
                              name: "Slot 2",
                              offset: 0x712,
                              type: "variable",
                              dataType: "uint16",
                              resource: "items",
                            },
                            {
                              name: "Slot 3",
                              offset: 0x714,
                              type: "variable",
                              dataType: "uint16",
                              resource: "items",
                            },
                            {
                              name: "Slot 4",
                              offset: 0x716,
                              type: "variable",
                              dataType: "uint16",
                              resource: "items",
                            },
                            {
                              name: "Slot 5",
                              offset: 0x718,
                              type: "variable",
                              dataType: "uint16",
                              resource: "items",
                            },
                          ],
                        },
                        {
                          name: "Accessories Gears Last Used",
                          type: "section",
                          flex: true,
                          hidden: true,
                          items: [
                            {
                              name: "Slot 1",
                              offset: 0x71e,
                              type: "variable",
                              dataType: "uint16",
                              resource: "items",
                            },
                            {
                              name: "Slot 2",
                              offset: 0x720,
                              type: "variable",
                              dataType: "uint16",
                              resource: "items",
                            },
                            {
                              name: "Slot 3",
                              offset: 0x722,
                              type: "variable",
                              dataType: "uint16",
                              resource: "items",
                            },
                            {
                              name: "Slot 4",
                              offset: 0x724,
                              type: "variable",
                              dataType: "uint16",
                              resource: "items",
                            },
                            {
                              name: "Slot 5",
                              offset: 0x726,
                              type: "variable",
                              dataType: "uint16",
                              resource: "items",
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
              name: "Glyphs",
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
                          id: "bitToLower4",
                          name: "Hand Glyphs",
                          type: "bitflags",
                          flags: [
                            { offset: 0x48e, bit: 0, label: "Confodere" },
                            { offset: 0x48f, bit: 0, label: "Vol Confodere" },
                            { offset: 0x490, bit: 0, label: "Melio Confodere", separator: true },
                            { offset: 0x491, bit: 0, label: "Secare" },
                            { offset: 0x492, bit: 0, label: "Vol Secare" },
                            { offset: 0x493, bit: 0, label: "Melio Secare", separator: true },
                            { offset: 0x494, bit: 0, label: "Hasta" },
                            { offset: 0x495, bit: 0, label: "Vol Hasta" },
                            { offset: 0x496, bit: 0, label: "Melio Hasta", separator: true },
                            { offset: 0x497, bit: 0, label: "Macir" },
                            { offset: 0x498, bit: 0, label: "Vol Macir" },
                            { offset: 0x499, bit: 0, label: "Melio Macir", separator: true },
                            { offset: 0x49a, bit: 0, label: "Arcus" },
                            { offset: 0x49b, bit: 0, label: "Vol Arcus" },
                            { offset: 0x49c, bit: 0, label: "Melio Arcus", separator: true },
                            { offset: 0x49d, bit: 0, label: "Ascia" },
                            { offset: 0x49e, bit: 0, label: "Vol Ascia" },
                            { offset: 0x49f, bit: 0, label: "Melio Ascia", separator: true },
                            { offset: 0x4a0, bit: 0, label: "Falcis" },
                            { offset: 0x4a1, bit: 0, label: "Vol Falcis" },
                            { offset: 0x4a2, bit: 0, label: "Melio Falcis", separator: true },
                            { offset: 0x4a3, bit: 0, label: "Culter" },
                            { offset: 0x4a4, bit: 0, label: "Vol Culter" },
                            { offset: 0x4a5, bit: 0, label: "Melio Culter", separator: true },
                            { offset: 0x4a6, bit: 0, label: "Scutum" },
                            { offset: 0x4a7, bit: 0, label: "Vol Scutum" },
                            { offset: 0x4a8, bit: 0, label: "Melio Scutum", separator: true },
                            { offset: 0x4a9, bit: 0, label: "Redire" },
                            { offset: 0x4aa, bit: 0, label: "Cubus" },
                            { offset: 0x4ab, bit: 0, label: "Torpor" },
                            { offset: 0x4ac, bit: 0, label: "Lapiste" },
                            { offset: 0x4ad, bit: 0, label: "Pneuma", separator: true },
                            { offset: 0x4ae, bit: 0, label: "Ignis" },
                            { offset: 0x4af, bit: 0, label: "Vol Ignis", separator: true },
                            { offset: 0x4b0, bit: 0, label: "Grando" },
                            { offset: 0x4b1, bit: 0, label: "Vol Grando", separator: true },
                            { offset: 0x4b2, bit: 0, label: "Fulgur" },
                            { offset: 0x4b3, bit: 0, label: "Vol Fulgur", separator: true },
                            { offset: 0x4b4, bit: 0, label: "Luminatio" },
                            { offset: 0x4b5, bit: 0, label: "Vol Luminatio", separator: true },
                            { offset: 0x4b6, bit: 0, label: "Umbra" },
                            { offset: 0x4b7, bit: 0, label: "Vol Umbra", separator: true },
                            { offset: 0x4b8, bit: 0, label: "Morbus" },
                            { offset: 0x4b9, bit: 0, label: "Nitesco" },
                            { offset: 0x4ba, bit: 0, label: "Acerbatus" },
                            { offset: 0x4bb, bit: 0, label: "Globus", separator: true },
                            { offset: 0x4bc, bit: 0, label: "Dextro Custos" },
                            { offset: 0x4bd, bit: 0, label: "Sinestro Custos", separator: true },
                            { offset: 0x4be, bit: 0, label: "Dominus Hatred" },
                            { offset: 0x4bf, bit: 0, label: "Dominus Anger" },
                            { offset: 0x4c0, bit: 0, label: "???", hidden: true },
                            { offset: 0x4c1, bit: 0, label: "???", hidden: true },
                            { offset: 0x4c2, bit: 0, label: "???", hidden: true },
                            { offset: 0x4c3, bit: 0, label: "???", hidden: true },
                            { offset: 0x4c4, bit: 0, label: "???", hidden: true },
                          ],
                        },
                        {
                          id: "bitToLower4",
                          name: "Back Glyphs",
                          type: "bitflags",
                          flags: [
                            { offset: 0x4c5, bit: 0, label: "Magnes" },
                            { offset: 0x4c6, bit: 0, label: "Paries" },
                            { offset: 0x4c7, bit: 0, label: "Volaticus", separator: true },
                            { offset: 0x4c8, bit: 0, label: "Rapidus Fio" },
                            { offset: 0x4c9, bit: 0, label: "Vis Fio" },
                            { offset: 0x4ca, bit: 0, label: "Fortis Fio" },
                            { offset: 0x4cb, bit: 0, label: "Sapiens Fio" },
                            { offset: 0x4cc, bit: 0, label: "Fides Fio" },
                            { offset: 0x4cd, bit: 0, label: "Felicem Fio", separator: true },
                            { offset: 0x4ce, bit: 0, label: "Inire Pecunia", separator: true },
                            { offset: 0x4cf, bit: 0, label: "Arma Felix" },
                            { offset: 0x4d0, bit: 0, label: "Arma Chiroptera" },
                            { offset: 0x4d1, bit: 0, label: "Arma Machina", separator: true },
                            { offset: 0x4d2, bit: 0, label: "Refectio" },
                            { offset: 0x4d3, bit: 0, label: "Arma Custos", separator: true },
                            { offset: 0x4d4, bit: 0, label: "Fidelis Caries" },
                            { offset: 0x4d5, bit: 0, label: "Fidelis Alate" },
                            { offset: 0x4d6, bit: 0, label: "Fidelis Polkir" },
                            { offset: 0x4d7, bit: 0, label: "Fidelis Noctua" },
                            { offset: 0x4d8, bit: 0, label: "Fidelis Medusa" },
                            { offset: 0x4d9, bit: 0, label: "Fidelis Aranea" },
                            { offset: 0x4da, bit: 0, label: "Fidelis Mortus", separator: true },
                            { offset: 0x4db, bit: 0, label: "Dominus Agony", separator: true },
                            { offset: 0x4dc, bit: 0, label: "Agartha" },
                          ],
                        },
                      ],
                    },
                    {
                      name: "Familiar Points",
                      flex: true,
                      items: [
                        {
                          name: "Fidelis Caries",
                          offset: 0x3d0,
                          type: "variable",
                          dataType: "uint16",
                        },
                        {
                          name: "Fidelis Aranea",
                          offset: 0x3d2,
                          type: "variable",
                          dataType: "uint16",
                        },
                        {
                          name: "Fidelis Polkir",
                          offset: 0x3d4,
                          type: "variable",
                          dataType: "uint16",
                        },
                        {
                          name: "Fidelis Alate",
                          offset: 0x3d6,
                          type: "variable",
                          dataType: "uint16",
                        },
                        {
                          name: "Fidelis Medusa",
                          offset: 0x3d8,
                          type: "variable",
                          dataType: "uint16",
                        },
                        {
                          name: "Fidelis Noctua",
                          offset: 0x3da,
                          type: "variable",
                          dataType: "uint16",
                        },
                        {
                          name: "Fidelis Mortus",
                          offset: 0x3dc,
                          type: "variable",
                          dataType: "uint16",
                        },
                      ],
                    },
                  ],
                },
              ],
            },
            {
              name: "Relics",
              flex: true,
              items: [
                {
                  id: "bitToLower4",
                  name: "Obtained",
                  type: "bitflags",
                  flags: [
                    { offset: 0x4fc, bit: 0, label: "Lizard Tail" },
                    { offset: 0x4fd, bit: 0, label: "Ordinary Rock" },
                    { offset: 0x4fe, bit: 0, label: "Serpent Scale" },
                    { offset: 0x4ff, bit: 0, label: "Glyph Union" },
                    { offset: 0x500, bit: 0, label: "Glyph Sleeve" },
                    { offset: 0x501, bit: 0, label: "Book of Spirits" },
                  ],
                },
                {
                  name: "Equipped",
                  type: "bitflags",
                  flags: [
                    { offset: 0x4fc, bit: 6, label: "Lizard Tail" },
                    { offset: 0x4fd, bit: 6, label: "Ordinary Rock" },
                    { offset: 0x4fe, bit: 6, label: "Serpent Scale" },
                    { offset: 0x4ff, bit: 6, label: "Glyph Union" },
                    { offset: 0x500, bit: 6, label: "Glyph Sleeve" },
                    { offset: 0x501, bit: 6, label: "Book of Spirits" },
                  ],
                },
              ],
            },
            {
              name: "Items",
              items: [
                {
                  type: "tabs",
                  vertical: true,
                  items: [
                    {
                      name: "Items",
                      flex: true,
                      items: Object.entries(items).map(([offset, name]) => ({
                        name,
                        offset: 0x501 + parseInt(offset),
                        type: "variable",
                        dataType: "lower4",
                        max: 9,
                      })),
                    },
                    {
                      name: "Key Items",
                      flex: true,
                      items: Object.entries(keyItems).map(([offset, name]) => ({
                        name,
                        offset: 0x501 + parseInt(offset),
                        type: "variable",
                        dataType: "lower4",
                        max: 9,
                      })),
                    },
                    {
                      name: "Head Gears",
                      flex: true,
                      items: Object.entries(headGears).map(
                        ([offset, name]) => ({
                          name,
                          offset: 0x58d + parseInt(offset),
                          type: "variable",
                          dataType: "lower4",
                          max: 9,
                        }),
                      ),
                    },
                    {
                      name: "Body Gears",
                      flex: true,
                      items: Object.entries(bodyGears).map(
                        ([offset, name]) => ({
                          name,
                          offset: 0x572 + parseInt(offset),
                          type: "variable",
                          dataType: "lower4",
                          max: 9,
                        }),
                      ),
                    },
                    {
                      name: "Leg Gears",
                      flex: true,
                      items: Object.entries(legGears).map(([offset, name]) => ({
                        name,
                        offset: 0x5b1 + parseInt(offset),
                        type: "variable",
                        dataType: "lower4",
                        max: 9,
                      })),
                    },
                    {
                      name: "Accessories",
                      flex: true,
                      items: Object.entries(accessories).map(
                        ([offset, name]) => ({
                          name,
                          offset: 0x5c6 + parseInt(offset),
                          type: "variable",
                          dataType: "lower4",
                          max: 9,
                        }),
                      ),
                    },
                  ],
                },
              ],
            },
            {
              name: "Villagers",
              items: [
                {
                  type: "tabs",
                  vertical: true,
                  items: [
                    {
                      name: "Nikolai",
                      items: [
                        {
                          type: "bitflags",
                          flags: [
                            { offset: 0x42d, bit: 0, label: "Rescued" },
                            { offset: 0x431, bit: 1, label: "Master Ring received" },
                            { offset: 0x432, bit: 7, label: "Required to get Master Ring from Nikolai", hidden: true },
                          ],
                        },
                      ],
                    },
                    {
                      name: "Jacob",
                      items: [
                        {
                          type: "section",
                          flex: true,
                          items: [
                            {
                              type: "bitflags",
                              flags: [
                                { offset: 0x431, bit: 2, label: "Rescued" },
                                { offset: 0x437, bit: 6, label: "SoybeanFlour rescued" },
                                { offset: 0x431, bit: 3, label: "Jacob dialog", hidden: true },
                                { offset: 0x431, bit: 4, label: "???", hidden: true },
                              ],
                            },
                          ],
                        },
                        {
                          name: "Item Display",
                          type: "section",
                          flex: true,
                          items: [
                            {
                              name: "Slot 1",
                              offset: 0x746,
                              type: "variable",
                              dataType: "uint16",
                              resource: "items",
                              autocomplete: true,
                            },
                            {
                              name: "Slot 2",
                              offset: 0x748,
                              type: "variable",
                              dataType: "uint16",
                              resource: "items",
                              autocomplete: true,
                            },
                            {
                              name: "Slot 3",
                              offset: 0x74a,
                              type: "variable",
                              dataType: "uint16",
                              resource: "items",
                              autocomplete: true,
                            },
                            {
                              name: "Slot 4",
                              offset: 0x74c,
                              type: "variable",
                              dataType: "uint16",
                              resource: "items",
                              autocomplete: true,
                            },
                            {
                              name: "Slot 5",
                              offset: 0x74e,
                              type: "variable",
                              dataType: "uint16",
                              resource: "items",
                              autocomplete: true,
                            },
                            {
                              name: "Slot 6",
                              offset: 0x750,
                              type: "variable",
                              dataType: "uint16",
                              resource: "items",
                              autocomplete: true,
                            },
                            {
                              name: "Slot 7",
                              offset: 0x752,
                              type: "variable",
                              dataType: "uint16",
                              resource: "items",
                              autocomplete: true,
                            },
                            {
                              name: "Slot 8",
                              offset: 0x754,
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
                      name: "Abram",
                      items: [
                        {
                          type: "section",
                          flex: true,
                          items: [
                            {
                              id: "slot-%index%-questFlags-abram",
                              type: "bitflags",
                              flags: [
                                { offset: 0x431, bit: 5, label: "Rescued" },
                                { offset: 0x431, bit: 6, label: "Running Out of Sage Quest", hidden: true },
                                { offset: 0x431, bit: 7, label: "Medicinal Ingredients Needed", hidden: true },
                                { offset: 0x432, bit: 0, label: "Mandrake is the Best Medicine", hidden: true },
                                { offset: 0x432, bit: 1, label: "Unusual Medicine Components", hidden: true },
                              ],
                            },
                          ],
                        },
                        {
                          type: "section",
                          flex: true,
                          items: [
                            {
                              id: "slot-%index%-quests-abram-1",
                              name: "Running Out of Sage Quest",
                              offset: 0x694,
                              type: "variable",
                              dataType: "uint8",
                              binary: { bitStart: 4, bitLength: 4 },
                              resource: "questProgressions",
                            },
                            {
                              id: "slot-%index%-quests-abram-2",
                              name: "Medicinal Ingredients Needed",
                              offset: 0x695,
                              type: "variable",
                              dataType: "uint8",
                              binary: { bitStart: 0, bitLength: 4 },
                              resource: "questProgressions",
                            },
                            {
                              id: "slot-%index%-quests-abram-3",
                              name: "Mandrake is the Best Medicine",
                              offset: 0x695,
                              type: "variable",
                              dataType: "uint8",
                              binary: { bitStart: 4, bitLength: 4 },
                              resource: "questProgressions",
                            },
                            {
                              id: "slot-%index%-quests-abram-4",
                              name: "Unusual Medicine Components",
                              offset: 0x696,
                              type: "variable",
                              dataType: "uint8",
                              binary: { bitStart: 0, bitLength: 4 },
                              resource: "questProgressions",
                            },
                          ],
                        },
                      ],
                    },
                    {
                      name: "Laura",
                      items: [
                        {
                          type: "section",
                          flex: true,
                          items: [
                            {
                              id: "slot-%index%-questFlags-laura",
                              type: "bitflags",
                              flags: [
                                { offset: 0x432, bit: 2, label: "Rescued" },
                                { offset: 0x437, bit: 7, label: "Tofu rescued" },
                                { offset: 0x432, bit: 3, label: "A Lucky Stone completed", hidden: true },
                                { offset: 0x432, bit: 4, label: "A Pleasant Accessory completed", hidden: true },
                                { offset: 0x432, bit: 5, label: "A Heartwarming Accessory completed", hidden: true },
                                { offset: 0x432, bit: 6, label: "The Job of a Lifetime", hidden: true },
                              ],
                            },
                          ],
                        },
                        {
                          type: "section",
                          flex: true,
                          items: [
                            {
                              id: "slot-%index%-quests-laura-2",
                              name: "A Lucky Stone",
                              offset: 0x696,
                              type: "variable",
                              dataType: "uint8",
                              binary: { bitStart: 4, bitLength: 4 },
                              resource: "questProgressions",
                            },
                            {
                              id: "slot-%index%-quests-laura-3",
                              name: "A Pleasant Accessory",
                              offset: 0x697,
                              type: "variable",
                              dataType: "uint8",
                              binary: { bitStart: 0, bitLength: 4 },
                              resource: "questProgressions",
                            },
                            {
                              id: "slot-%index%-quests-laura-4",
                              name: "A Heartwarming Accessory",
                              offset: 0x697,
                              type: "variable",
                              dataType: "uint8",
                              binary: { bitStart: 4, bitLength: 4 },
                              resource: "questProgressions",
                            },
                            {
                              id: "slot-%index%-quests-laura-5",
                              name: "The Job of a Lifetime",
                              offset: 0x698,
                              type: "variable",
                              dataType: "uint8",
                              binary: { bitStart: 0, bitLength: 4 },
                              resource: "questProgressions",
                            },
                          ],
                        },
                      ],
                    },
                    {
                      name: "Eugen",
                      items: [
                        {
                          type: "section",
                          flex: true,
                          items: [
                            {
                              id: "slot-%index%-questFlags-eugen",
                              type: "bitflags",
                              flags: [
                                { offset: 0x433, bit: 0, label: "Rescued" },
                                { offset: 0x433, bit: 1, label: "Poor Preparation is Costly", hidden: true },
                                { offset: 0x433, bit: 2, label: "What the Blacksmith Does Best", hidden: true },
                                { offset: 0x433, bit: 3, label: "Work of the Finest Quality", hidden: true },
                              ],
                            },
                          ],
                        },
                        {
                          type: "section",
                          flex: true,
                          items: [
                            {
                              id: "slot-%index%-quests-eugen-1",
                              name: "Poor Preparation is Costly",
                              offset: 0x698,
                              type: "variable",
                              dataType: "uint8",
                              binary: { bitStart: 4, bitLength: 4 },
                              resource: "questProgressions",
                            },
                            {
                              id: "slot-%index%-quests-eugen-2",
                              name: "What the Blacksmith Does Best",
                              offset: 0x699,
                              type: "variable",
                              dataType: "uint8",
                              binary: { bitStart: 0, bitLength: 4 },
                              resource: "questProgressions",
                            },
                            {
                              id: "slot-%index%-quests-eugen-3",
                              name: "Work of the Finest Quality",
                              offset: 0x699,
                              type: "variable",
                              dataType: "uint8",
                              binary: { bitStart: 4, bitLength: 4 },
                              resource: "questProgressions",
                            },
                          ],
                        },
                      ],
                    },
                    {
                      name: "Aeon",
                      items: [
                        {
                          type: "section",
                          flex: true,
                          items: [
                            {
                              id: "slot-%index%-questFlags-aeon",
                              type: "bitflags",
                              flags: [
                                { offset: 0x433, bit: 4, label: "Rescued" },
                                { offset: 0x433, bit: 5, label: "Needs More Salt", hidden: true },
                                { offset: 0x433, bit: 6, label: "I've Never Eaten That", hidden: true },
                                { offset: 0x433, bit: 7, label: "Can't Cook Without Ingredients", hidden: true },
                              ],
                            },
                          ],
                        },
                        {
                          type: "section",
                          flex: true,
                          items: [
                            {
                              id: "slot-%index%-quests-aeon-1",
                              name: "Needs More Salt",
                              offset: 0x69a,
                              type: "variable",
                              dataType: "uint8",
                              binary: { bitStart: 0, bitLength: 4 },
                              resource: "questProgressions",
                            },
                            {
                              id: "slot-%index%-quests-aeon-2",
                              name: "I've Never Eaten That",
                              offset: 0x69a,
                              type: "variable",
                              dataType: "uint8",
                              binary: { bitStart: 4, bitLength: 4 },
                              resource: "questProgressions",
                            },
                            {
                              id: "slot-%index%-quests-aeon-3",
                              name: "Can't Cook Without Ingredients",
                              offset: 0x69b,
                              type: "variable",
                              dataType: "uint8",
                              binary: { bitStart: 0, bitLength: 4 },
                              resource: "questProgressions",
                            },
                          ],
                        },
                      ],
                    },
                    {
                      name: "Marcel",
                      items: [
                        {
                          type: "section",
                          flex: true,
                          items: [
                            {
                              id: "slot-%index%-questFlags-marcel",
                              type: "bitflags",
                              flags: [
                                { offset: 0x434, bit: 0, label: "Rescued" },
                                { offset: 0x434, bit: 1, label: "Case of the Vicious Blight", hidden: true },
                                { offset: 0x434, bit: 2, label: "Case of the Demon Horse", hidden: true },
                                { offset: 0x434, bit: 3, label: "Case of the Hideous Snowman", hidden: true },
                              ],
                            },
                          ],
                        },
                        {
                          type: "section",
                          flex: true,
                          items: [
                            {
                              id: "slot-%index%-quests-marcel-1",
                              name: "Case of the Vicious Blight",
                              offset: 0x69b,
                              type: "variable",
                              dataType: "uint8",
                              binary: { bitStart: 4, bitLength: 4 },
                              resource: "questProgressions",
                            },
                            {
                              id: "slot-%index%-quests-marcel-2",
                              name: "Case of the Demon Horse",
                              offset: 0x69c,
                              type: "variable",
                              dataType: "uint8",
                              binary: { bitStart: 0, bitLength: 4 },
                              resource: "questProgressions",
                            },
                            {
                              id: "slot-%index%-quests-marcel-3",
                              name: "Case of the Hideous Snowman",
                              offset: 0x69c,
                              type: "variable",
                              dataType: "uint8",
                              binary: { bitStart: 4, bitLength: 4 },
                              resource: "questProgressions",
                            },
                          ],
                        },
                      ],
                    },
                    {
                      name: "George",
                      items: [
                        {
                          type: "section",
                          flex: true,
                          items: [
                            {
                              id: "slot-%index%-questFlags-george",
                              type: "bitflags",
                              flags: [
                                { offset: 0x42d, bit: 5, label: "Rescued" },
                                { offset: 0x434, bit: 4, label: "The Silent Violin", hidden: true },
                                { offset: 0x434, bit: 5, label: "The Killing Scream", hidden: true },
                                { offset: 0x434, bit: 6, label: "Artists Can Be Selfish", hidden: true },
                              ],
                            },
                          ],
                        },
                        {
                          type: "section",
                          flex: true,
                          items: [
                            {
                              id: "slot-%index%-quests-george-1",
                              name: "The Silent Violin",
                              offset: 0x69d,
                              type: "variable",
                              dataType: "uint8",
                              binary: { bitStart: 0, bitLength: 4 },
                              resource: "questProgressions",
                            },
                            {
                              id: "slot-%index%-quests-george-2",
                              name: "The Killing Scream",
                              offset: 0x69d,
                              type: "variable",
                              dataType: "uint8",
                              binary: { bitStart: 4, bitLength: 4 },
                              resource: "questProgressions",
                            },
                            {
                              id: "slot-%index%-quests-george-3",
                              name: "Artists Can Be Selfish",
                              offset: 0x69e,
                              type: "variable",
                              dataType: "uint8",
                              binary: { bitStart: 0, bitLength: 4 },
                              resource: "questProgressions",
                            },
                          ],
                        },
                      ],
                    },
                    {
                      name: "Serge",
                      items: [
                        {
                          type: "section",
                          flex: true,
                          items: [
                            {
                              id: "slot-%index%-questFlags-serge",
                              type: "bitflags",
                              flags: [
                                { offset: 0x434, bit: 7, label: "Rescued" },
                                { offset: 0x435, bit: 0, label: "Hide and Seek!", hidden: true },
                                { offset: 0x435, bit: 1, label: "Show Me the Owl!", hidden: true },
                                { offset: 0x435, bit: 2, label: "Can't Catch Me!", hidden: true },
                              ],
                            },
                          ],
                        },
                        {
                          type: "section",
                          flex: true,
                          items: [
                            {
                              id: "slot-%index%-quests-serge-1",
                              name: "Hide and Seek!",
                              offset: 0x69e,
                              type: "variable",
                              dataType: "uint8",
                              binary: { bitStart: 4, bitLength: 4 },
                              resource: "questSergeProgressions",
                            },
                            {
                              id: "slot-%index%-quests-serge-2",
                              name: "Show Me the Owl!",
                              offset: 0x69f,
                              type: "variable",
                              dataType: "uint8",
                              binary: { bitStart: 0, bitLength: 4 },
                              resource: "questProgressions",
                            },
                            {
                              id: "slot-%index%-quests-serge-3",
                              name: "Can't Catch Me!",
                              offset: 0x69f,
                              type: "variable",
                              dataType: "uint8",
                              binary: { bitStart: 4, bitLength: 4 },
                              resource: "questSergeProgressions",
                            },
                          ],
                        },
                      ],
                    },
                    {
                      name: "Anna",
                      items: [
                        {
                          type: "section",
                          flex: true,
                          items: [
                            {
                              id: "slot-%index%-questFlags-anna",
                              type: "bitflags",
                              flags: [
                                { offset: 0x435, bit: 3, label: "Rescued" },
                                { offset: 0x437, bit: 4, label: "Tom rescued" },
                                { offset: 0x435, bit: 4, label: "Finding Tom", hidden: true },
                                { offset: 0x435, bit: 5, label: "Mice Make for Good Eats", hidden: true },
                                { offset: 0x435, bit: 6, label: "Tom and Jewerlry", hidden: true },
                              ],
                            },
                          ],
                        },
                        {
                          type: "section",
                          flex: true,
                          items: [
                            {
                              id: "slot-%index%-quests-anna-2",
                              name: "Finding Tom",
                              offset: 0x6a0,
                              type: "variable",
                              dataType: "uint8",
                              binary: { bitStart: 0, bitLength: 4 },
                              resource: "questProgressions",
                            },
                            {
                              id: "slot-%index%-quests-anna-3",
                              name: "Mice Make for Good Eats",
                              offset: 0x6a0,
                              type: "variable",
                              dataType: "uint8",
                              binary: { bitStart: 4, bitLength: 4 },
                              resource: "questProgressions",
                            },
                            {
                              id: "slot-%index%-quests-anna-4",
                              name: "Tom and Jewerlry",
                              offset: 0x6a1,
                              type: "variable",
                              dataType: "uint8",
                              binary: { bitStart: 0, bitLength: 4 },
                              resource: "questProgressions",
                            },
                          ],
                        },
                      ],
                    },
                    {
                      name: "Monica",
                      items: [
                        {
                          type: "section",
                          flex: true,
                          items: [
                            {
                              id: "slot-%index%-questFlags-monica",
                              type: "bitflags",
                              flags: [
                                { offset: 0x435, bit: 7, label: "Rescued" },
                                { offset: 0x436, bit: 0, label: "Making a Dress!", hidden: true },
                                { offset: 0x436, bit: 1, label: "Silkworm's Tragedy", hidden: true },
                                { offset: 0x436, bit: 2, label: "Is That Cashmere?", hidden: true },
                              ],
                            },
                          ],
                        },
                        {
                          type: "section",
                          flex: true,
                          items: [
                            {
                              id: "slot-%index%-quests-monica-1",
                              name: "Making a Dress!",
                              offset: 0x6a1,
                              type: "variable",
                              dataType: "uint8",
                              binary: { bitStart: 4, bitLength: 4 },
                              resource: "questProgressions",
                            },
                            {
                              id: "slot-%index%-quests-monica-2",
                              name: "Silkworm's Tragedy",
                              offset: 0x6a2,
                              type: "variable",
                              dataType: "uint8",
                              binary: { bitStart: 0, bitLength: 4 },
                              resource: "questProgressions",
                            },
                            {
                              id: "slot-%index%-quests-monica-3",
                              name: "Is That Cashmere?",
                              offset: 0x6a2,
                              type: "variable",
                              dataType: "uint8",
                              binary: { bitStart: 4, bitLength: 4 },
                              resource: "questProgressions",
                            },
                          ],
                        },
                      ],
                    },
                    {
                      name: "Irina",
                      items: [
                        {
                          type: "section",
                          flex: true,
                          items: [
                            {
                              id: "slot-%index%-questFlags-irina",
                              type: "bitflags",
                              flags: [
                                { offset: 0x436, bit: 3, label: "Rescued" },
                                { offset: 0x436, bit: 4, label: "Vicious Crows", hidden: true },
                                { offset: 0x436, bit: 5, label: "Do You Hear Howling?", hidden: true },
                                { offset: 0x436, bit: 6, label: "An Unwelcome Guest", hidden: true },
                              ],
                            },
                          ],
                        },
                        {
                          type: "section",
                          flex: true,
                          noMargin: true,
                          items: [
                            {
                              id: "slot-%index%-quests-irina-1",
                              name: "Vicious Crows",
                              offset: 0x6a3,
                              type: "variable",
                              dataType: "uint8",
                              binary: { bitStart: 0, bitLength: 4 },
                              resource: "questProgressions",
                            },
                            {
                              id: "slot-%index%-quests-irina-2",
                              name: "Do You Hear Howling?",
                              offset: 0x6a3,
                              type: "variable",
                              dataType: "uint8",
                              binary: { bitStart: 4, bitLength: 4 },
                              resource: "questProgressions",
                            },
                            {
                              id: "slot-%index%-quests-irina-3",
                              name: "An Unwelcome Guest",
                              offset: 0x6a4,
                              type: "variable",
                              dataType: "uint8",
                              binary: { bitStart: 0, bitLength: 4 },
                              resource: "questProgressions",
                            },
                          ],
                        },
                        {
                          type: "section",
                          flex: true,
                          items: [
                            {
                              name: "Crows killed",
                              offset: 0x72c,
                              type: "variable",
                              dataType: "uint8",
                            },
                            {
                              name: "Werewolf killed",
                              offset: 0x72d,
                              type: "variable",
                              dataType: "uint8",
                            },
                            {
                              name: "Jiang Shi killed",
                              offset: 0x72e,
                              type: "variable",
                              dataType: "uint8",
                            },
                          ],
                        },
                      ],
                    },
                    {
                      name: "Daniela",
                      items: [
                        {
                          type: "section",
                          flex: true,
                          items: [
                            {
                              id: "slot-%index%-questFlags-daniela",
                              type: "bitflags",
                              flags: [
                                { offset: 0x436, bit: 7, label: "Rescued" },
                                { offset: 0x437, bit: 5, label: "Ink rescued" },
                                { offset: 0x437, bit: 0, label: "A Beacon of Hope", hidden: true },
                                { offset: 0x437, bit: 1, label: "Important Resting Place", hidden: true },
                                { offset: 0x437, bit: 2, label: "Tragic Memories", hidden: true },
                              ],
                            },
                          ],
                        },
                        {
                          type: "section",
                          flex: true,
                          items: [
                            {
                              id: "slot-%index%-quests-daniela-2",
                              name: "A Beacon of Hope",
                              offset: 0x6a4,
                              type: "variable",
                              dataType: "uint8",
                              binary: { bitStart: 4, bitLength: 4 },
                              resource: "questProgressions",
                            },
                            {
                              id: "slot-%index%-quests-daniela-3",
                              name: "Important Resting Place",
                              offset: 0x6a5,
                              type: "variable",
                              dataType: "uint8",
                              binary: { bitStart: 0, bitLength: 4 },
                              resource: "questProgressions",
                            },
                            {
                              id: "slot-%index%-quests-daniela-4",
                              name: "Tragic Memories",
                              offset: 0x6a5,
                              type: "variable",
                              dataType: "uint8",
                              binary: { bitStart: 4, bitLength: 4 },
                              resource: "questProgressions",
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
              name: "Guides",
              items: [
                {
                  type: "tabs",
                  vertical: true,
                  items: [
                    {
                      name: "Glyphs",
                      flex: true,
                      items: [
                        {
                          name: "Hand Glyphs",
                          type: "bitflags",
                          flags: [
                            { offset: 0x48e, bit: 4, label: "Confodere" },
                            { offset: 0x48f, bit: 4, label: "Vol Confodere" },
                            { offset: 0x490, bit: 4, label: "Melio Confodere", separator: true },
                            { offset: 0x491, bit: 4, label: "Secare" },
                            { offset: 0x492, bit: 4, label: "Vol Secare" },
                            { offset: 0x493, bit: 4, label: "Melio Secare", separator: true },
                            { offset: 0x494, bit: 4, label: "Hasta" },
                            { offset: 0x495, bit: 4, label: "Vol Hasta" },
                            { offset: 0x496, bit: 4, label: "Melio Hasta", separator: true },
                            { offset: 0x497, bit: 4, label: "Macir" },
                            { offset: 0x498, bit: 4, label: "Vol Macir" },
                            { offset: 0x499, bit: 4, label: "Melio Macir", separator: true },
                            { offset: 0x49a, bit: 4, label: "Arcus" },
                            { offset: 0x49b, bit: 4, label: "Vol Arcus" },
                            { offset: 0x49c, bit: 4, label: "Melio Arcus", separator: true },
                            { offset: 0x49d, bit: 4, label: "Ascia" },
                            { offset: 0x49e, bit: 4, label: "Vol Ascia" },
                            { offset: 0x49f, bit: 4, label: "Melio Ascia", separator: true },
                            { offset: 0x4a0, bit: 4, label: "Falcis" },
                            { offset: 0x4a1, bit: 4, label: "Vol Falcis" },
                            { offset: 0x4a2, bit: 4, label: "Melio Falcis", separator: true },
                            { offset: 0x4a3, bit: 4, label: "Culter" },
                            { offset: 0x4a4, bit: 4, label: "Vol Culter" },
                            { offset: 0x4a5, bit: 4, label: "Melio Culter", separator: true },
                            { offset: 0x4a6, bit: 4, label: "Scutum" },
                            { offset: 0x4a7, bit: 4, label: "Vol Scutum" },
                            { offset: 0x4a8, bit: 4, label: "Melio Scutum", separator: true },
                            { offset: 0x4a9, bit: 4, label: "Redire" },
                            { offset: 0x4aa, bit: 4, label: "Cubus" },
                            { offset: 0x4ab, bit: 4, label: "Torpor" },
                            { offset: 0x4ac, bit: 4, label: "Lapiste" },
                            { offset: 0x4ad, bit: 4, label: "Pneuma", separator: true },
                            { offset: 0x4ae, bit: 4, label: "Ignis" },
                            { offset: 0x4af, bit: 4, label: "Vol Ignis", separator: true },
                            { offset: 0x4b0, bit: 4, label: "Grando" },
                            { offset: 0x4b1, bit: 4, label: "Vol Grando", separator: true },
                            { offset: 0x4b2, bit: 4, label: "Fulgur" },
                            { offset: 0x4b3, bit: 4, label: "Vol Fulgur", separator: true },
                            { offset: 0x4b4, bit: 4, label: "Luminatio" },
                            { offset: 0x4b5, bit: 4, label: "Vol Luminatio", separator: true },
                            { offset: 0x4b6, bit: 4, label: "Umbra" },
                            { offset: 0x4b7, bit: 4, label: "Vol Umbra", separator: true },
                            { offset: 0x4b8, bit: 4, label: "Morbus" },
                            { offset: 0x4b9, bit: 4, label: "Nitesco" },
                            { offset: 0x4ba, bit: 4, label: "Acerbatus" },
                            { offset: 0x4bb, bit: 4, label: "Globus", separator: true },
                            { offset: 0x4bc, bit: 4, label: "Dextro Custos" },
                            { offset: 0x4bd, bit: 4, label: "Sinestro Custos", separator: true },
                            { offset: 0x4be, bit: 4, label: "Dominus Hatred" },
                            { offset: 0x4bf, bit: 4, label: "Dominus Anger" },
                            { offset: 0x4c0, bit: 4, label: "???", hidden: true },
                            { offset: 0x4c1, bit: 4, label: "???", hidden: true },
                            { offset: 0x4c2, bit: 4, label: "???", hidden: true },
                            { offset: 0x4c3, bit: 4, label: "???", hidden: true },
                            { offset: 0x4c4, bit: 4, label: "???", hidden: true },
                          ],
                        },
                        {
                          name: "Back Glyphs",
                          type: "bitflags",
                          flags: [
                            { offset: 0x4c5, bit: 4, label: "Magnes" },
                            { offset: 0x4c6, bit: 4, label: "Paries" },
                            { offset: 0x4c7, bit: 4, label: "Volaticus", separator: true },
                            { offset: 0x4c8, bit: 4, label: "Rapidus Fio" },
                            { offset: 0x4c9, bit: 4, label: "Vis Fio" },
                            { offset: 0x4ca, bit: 4, label: "Fortis Fio" },
                            { offset: 0x4cb, bit: 4, label: "Sapiens Fio" },
                            { offset: 0x4cc, bit: 4, label: "Fides Fio" },
                            { offset: 0x4cd, bit: 4, label: "Felicem Fio", separator: true },
                            { offset: 0x4ce, bit: 4, label: "Inire Pecunia", separator: true },
                            { offset: 0x4cf, bit: 4, label: "Arma Felix" },
                            { offset: 0x4d0, bit: 4, label: "Arma Chiroptera" },
                            { offset: 0x4d1, bit: 4, label: "Arma Machina", separator: true },
                            { offset: 0x4d2, bit: 4, label: "Refectio" },
                            { offset: 0x4d3, bit: 4, label: "Arma Custos", separator: true },
                            { offset: 0x4d4, bit: 4, label: "Fidelis Caries" },
                            { offset: 0x4d5, bit: 4, label: "Fidelis Alate" },
                            { offset: 0x4d6, bit: 4, label: "Fidelis Polkir" },
                            { offset: 0x4d7, bit: 4, label: "Fidelis Noctua" },
                            { offset: 0x4d8, bit: 4, label: "Fidelis Medusa" },
                            { offset: 0x4d9, bit: 4, label: "Fidelis Aranea" },
                            { offset: 0x4da, bit: 4, label: "Fidelis Mortus", separator: true },
                            { offset: 0x4db, bit: 4, label: "Dominus Agony" },
                          ],
                        },
                      ],
                    },
                    {
                      name: "Items",
                      items: [
                        {
                          type: "tabs",
                          items: [
                            {
                              name: "Items",
                              flex: true,
                              items: [
                                {
                                  name: "Items",
                                  type: "bitflags",
                                  flags: Object.entries(items).map(
                                    ([offset, name]) => ({ offset: 0x501 + parseInt(offset), bit: 4, label: name }),
                                  ),
                                },
                                {
                                  name: "Key Items",
                                  type: "bitflags",
                                  flags: Object.entries(keyItems).map(
                                    ([offset, name]) => ({ offset: 0x501 + parseInt(offset), bit: 4, label: name }),
                                  ),
                                },
                              ],
                            },
                            {
                              name: "Head Gears",
                              items: [
                                {
                                  type: "bitflags",
                                  flags: Object.entries(headGears).map(
                                    ([offset, name]) => ({ offset: 0x58d + parseInt(offset), bit: 4, label: name }),
                                  ),
                                },
                              ],
                            },
                            {
                              name: "Body Gears",
                              items: [
                                {
                                  type: "bitflags",
                                  flags: Object.entries(bodyGears).map(
                                    ([offset, name]) => ({ offset: 0x572 + parseInt(offset), bit: 4, label: name }),
                                  ),
                                },
                              ],
                            },
                            {
                              name: "Leg Gears",
                              items: [
                                {
                                  type: "bitflags",
                                  flags: Object.entries(legGears).map(
                                    ([offset, name]) => ({ offset: 0x5b1 + parseInt(offset), bit: 4, label: name }),
                                  ),
                                },
                              ],
                            },
                            {
                              name: "Accessories",
                              items: [
                                {
                                  type: "bitflags",
                                  flags: Object.entries(accessories).map(
                                    ([offset, name]) => ({ offset: 0x5c6 + parseInt(offset), bit: 4, label: name }),
                                  ),
                                },
                              ],
                            },
                          ],
                        },
                      ],
                    },
                    {
                      name: "Enemies",
                      flex: true,
                      items: [
                        {
                          name: "Entries",
                          type: "bitflags",
                          flags: enemies.map((enemy) => ({
                            offset: 0x3e8 + Math.floor(enemy.index / 8),
                            bit: enemy.index % 8,
                            label: enemy.name,
                            separator: (enemy.index + 1) % 8 === 0,
                          })),
                        },
                        {
                          name: "Drops",
                          type: "bitflags",
                          flags: enemies.map((enemy) => ({
                            offset: 0x3f8 + Math.floor(enemy.index / 8),
                            bit: enemy.index % 8,
                            label: enemy.name,
                            separator: (enemy.index + 1) % 8 === 0,
                            disabled: !enemy.drops[0],
                          })),
                        },
                        {
                          name: "Rare Drops",
                          type: "bitflags",
                          flags: enemies.map((enemy) => ({
                            offset: 0x408 + Math.floor(enemy.index / 8),
                            bit: enemy.index % 8,
                            label: enemy.name,
                            separator: (enemy.index + 1) % 8 === 0,
                            disabled: !enemy.drops[1],
                          })),
                        },
                      ],
                    },
                    {
                      name: "Term List",
                      items: [
                        {
                          type: "bitflags",
                          flags: [
                            { offset: 0x47c, bit: 0, label: "Ecclesia" },
                            { offset: 0x47c, bit: 1, label: "Glyph" },
                            { offset: 0x47c, bit: 2, label: "Shanoa" },
                            { offset: 0x47c, bit: 3, label: "Albus" },
                            { offset: 0x47c, bit: 4, label: "Barlowe" },
                            { offset: 0x47c, bit: 5, label: "Belmont" },
                            { offset: 0x47c, bit: 6, label: "Dracula" },
                            { offset: 0x47c, bit: 7, label: "Dominus" },
                            { offset: 0x47d, bit: 0, label: "Glyph Union" },
                            { offset: 0x47d, bit: 1, label: "Glyph Sleeve" },
                            { offset: 0x47d, bit: 2, label: "Familiar" },
                            { offset: 0x47d, bit: 3, label: "Attribute Points" },
                            { offset: 0x47d, bit: 4, label: "Chest" },
                            { offset: 0x47d, bit: 5, label: "Boss Medal" },
                            { offset: 0x47d, bit: 6, label: "Wygol Village" },
                            { offset: 0x47d, bit: 7, label: "Ruvas Forest" },
                            { offset: 0x47e, bit: 0, label: "Monastery" },
                            { offset: 0x47e, bit: 1, label: "Kalidus Channel" },
                            { offset: 0x47e, bit: 2, label: "Minera Prison Island" },
                            { offset: 0x47e, bit: 3, label: "Lighthouse" },
                            { offset: 0x47e, bit: 4, label: "Tymeo Mountains" },
                            { offset: 0x47e, bit: 5, label: "Misty Forest Road" },
                            { offset: 0x47e, bit: 6, label: "Skeleton Cave" },
                            { offset: 0x47e, bit: 7, label: "Somnus Reef" },
                            { offset: 0x47f, bit: 0, label: "Giant's Dwelling" },
                            { offset: 0x47f, bit: 1, label: "Tristis Pass" },
                            { offset: 0x47f, bit: 2, label: "Oblivion Ridge" },
                            { offset: 0x47f, bit: 3, label: "Argila Swamp" },
                            { offset: 0x47f, bit: 4, label: "Mystery Manor" },
                            { offset: 0x47f, bit: 5, label: "???", hidden: true },
                            { offset: 0x47f, bit: 6, label: "???", hidden: true },
                            { offset: 0x47f, bit: 7, label: "???", hidden: true },
                          ],
                        },
                      ],
                    },
                  ],
                },
              ],
            },
            {
              name: "Maps",
              items: [
                {
                  type: "tabs",
                  vertical: true,
                  items: [
                    {
                      name: "Dracula's Castle",
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
                                      type: "section",
                                      items: [
                                        {
                                          name: "World Map",
                                          type: "bitflags",
                                          flags: [
                                            { offset: 0x470, bit: 0, label: "Location visible" },
                                            { offset: 0x470, bit: 1, label: "Location accessible" },
                                          ],
                                        },
                                        {
                                          id: "rooms",
                                          name: "Entry Rooms",
                                          type: "bitflags",
                                          flags: [
                                            { offset: 0x237, bit: 6, label: "Entrance" },
                                            { offset: 0x237, bit: 7, label: "Entrance enabled", hidden: true },
                                            { offset: 0x263, bit: 0, label: "Secret Exit" },
                                            { offset: 0x263, bit: 1, label: "Secret Exit enabled", hidden: true },
                                          ],
                                        },
                                        {
                                          id: "rooms",
                                          name: "Warp Rooms",
                                          type: "bitflags",
                                          flags: [
                                            { offset: 0x238, bit: 0, label: "Castle Entrance" },
                                            { offset: 0x238, bit: 1, label: "Castle Entrance enabled", hidden: true },
                                            { offset: 0x25d, bit: 6, label: "Underground Labyrinth" },
                                            { offset: 0x25d, bit: 7, label: "Underground Labyrinth enabled", hidden: true },
                                            { offset: 0x20f, bit: 0, label: "Library" },
                                            { offset: 0x20f, bit: 1, label: "Library enabled", hidden: true },
                                            { offset: 0x1fd, bit: 6, label: "Library near Save Room" },
                                            { offset: 0x1fd, bit: 7, label: "Library near Save Room enabled", hidden: true },
                                            { offset: 0x23c, bit: 2, label: "Barracks" },
                                            { offset: 0x23c, bit: 3, label: "Barracks enabled", hidden: true },
                                            { offset: 0x200, bit: 4, label: "Mechanical Tower" },
                                            { offset: 0x200, bit: 5, label: "Mechanical Tower enabled", hidden: true },
                                            { offset: 0x250, bit: 2, label: "Arms Depot" },
                                            { offset: 0x250, bit: 3, label: "Arms Depot enabled", hidden: true },
                                            { offset: 0x1eb, bit: 4, label: "Final Approach" },
                                            { offset: 0x1eb, bit: 5, label: "Final Approach enabled", hidden: true },
                                          ],
                                        },
                                      ],
                                    },
                                    {
                                      name: "Events",
                                      type: "bitflags",
                                      hidden: true,
                                      flags: [
                                        { offset: 0x41d, bit: 0, label: "Location discovered", hidden: true },
                                        { offset: 0x431, bit: 0, label: "Staff Roll seen", hidden: true },
                                        { offset: 0x438, bit: 2, label: "Good Ending?", hidden: true },
                                      ],
                                    },
                                  ],
                                },
                              ],
                            },
                            {
                              name: "Castle Entrance",
                              items: [
                                {
                                  type: "section",
                                  flex: true,
                                  items: [
                                    {
                                      name: "Events",
                                      type: "bitflags",
                                      flags: [
                                        { offset: 0x41f, bit: 3, label: "Location discovered", separator: true },
                                        { offset: 0x42f, bit: 6, label: "Introduction seen", hidden: true },
                                        { offset: 0x42f, bit: 7, label: "Shanoa dialog", hidden: true },
                                        { offset: 0x41c, bit: 5, label: "Switch activated" },
                                      ],
                                    },
                                    {
                                      name: "Treasures",
                                      type: "bitflags",
                                      flags: [
                                        { offset: 0x45a, bit: 2, label: "Wall: Tasty Meat", separator: true },
                                        { offset: 0x44a, bit: 6, label: "Red Chest: HP Max up" },
                                        { offset: 0x44f, bit: 6, label: "Red Chest: HEART Max Up" },
                                        { offset: 0x461, bit: 6, label: "Red Chest: Valkyrie Greaves", separator: true },
                                        { offset: 0x456, bit: 1, label: "Blue Chest: White Drops" },
                                      ],
                                    },
                                  ],
                                },
                              ],
                            },
                            {
                              name: "Underground Labyrinth",
                              items: [
                                {
                                  type: "section",
                                  flex: true,
                                  items: [
                                    {
                                      name: "Events",
                                      type: "bitflags",
                                      flags: [
                                        { offset: 0x41f, bit: 4, label: "Location discovered", separator: true },
                                        { offset: 0x420, bit: 7, label: "Wall destroyed" },
                                        { offset: 0x421, bit: 0, label: "Wall destroyed" },
                                        { offset: 0x421, bit: 1, label: "Wall destroyed", separator: true },
                                        { offset: 0x489, bit: 3, label: "Blackmore defeated" },
                                        { offset: 0x469, bit: 2, label: "Blackmore defeated no damage" },
                                      ],
                                    },
                                    {
                                      name: "Treasures",
                                      type: "bitflags",
                                      flags: [
                                        { offset: 0x45d, bit: 1, label: "Wall: White Drops", separator: true },
                                        { offset: 0x44d, bit: 3, label: "Red Chest: MP Max up" },
                                        { offset: 0x44f, bit: 7, label: "Red Chest: HEART Max Up" },
                                        { offset: 0x456, bit: 2, label: "Red Chest: Super Potion" },
                                        { offset: 0x460, bit: 4, label: "Red Chest: Mercury Boots", separator: true },
                                        { offset: 0x453, bit: 3, label: "Blue Chest: Star Ring" },
                                        { offset: 0x46b, bit: 2, label: "Blue Chest: Blackmore Medal" },
                                      ],
                                    },
                                    {
                                      name: "Glyphs",
                                      type: "bitflags",
                                      flags: [
                                        { offset: 0x440, bit: 1, label: "Lapiste" },
                                        { offset: 0x440, bit: 4, label: "Vol Ignis" },
                                        { offset: 0x443, bit: 5, label: "Rapidus Fio" },
                                        { offset: 0x444, bit: 2, label: "Felicem Fio" },
                                      ],
                                    },
                                  ],
                                },
                              ],
                            },
                            {
                              name: "Library",
                              items: [
                                {
                                  type: "section",
                                  flex: true,
                                  items: [
                                    {
                                      name: "Events",
                                      type: "bitflags",
                                      flags: [
                                        { offset: 0x41f, bit: 5, label: "Location discovered", separator: true },
                                        { offset: 0x420, bit: 3, label: "Wall destroyed", separator: true },
                                        { offset: 0x430, bit: 1, label: "Shanoa dialog about Dextro Custos", hidden: true },
                                        { offset: 0x489, bit: 2, label: "Wallman defeated" },
                                        { offset: 0x469, bit: 1, label: "Wallman defeated no damage" },
                                      ],
                                    },
                                    {
                                      name: "Treasures",
                                      type: "bitflags",
                                      flags: [
                                        { offset: 0x45b, bit: 4, label: "Wall: Cream Puff", separator: true },
                                        { offset: 0x44a, bit: 7, label: "Red Chest: HP Max up" },
                                        { offset: 0x44d, bit: 2, label: "Red Chest: MP Max up" },
                                        { offset: 0x452, bit: 6, label: "Red Chest: Hanged Man Ring", separator: true },
                                        { offset: 0x46b, bit: 1, label: "Blue Chest: Wallman Medal" },
                                      ],
                                    },
                                    {
                                      name: "Glyphs",
                                      type: "bitflags",
                                      flags: [
                                        { offset: 0x43c, bit: 5, label: "Melio Confodere" },
                                        { offset: 0x442, bit: 1, label: "Dextro Custos" },
                                        { offset: 0x444, bit: 7, label: "Refectio" },
                                      ],
                                    },
                                  ],
                                },
                              ],
                            },
                            {
                              name: "Barracks",
                              items: [
                                {
                                  type: "section",
                                  flex: true,
                                  items: [
                                    {
                                      name: "Events",
                                      type: "bitflags",
                                      flags: [
                                        { offset: 0x41f, bit: 6, label: "Location discovered", separator: true },
                                        { offset: 0x421, bit: 6, label: "Wall destroyed" },
                                      ],
                                    },
                                    {
                                      name: "Treasures",
                                      type: "bitflags",
                                      flags: [
                                        { offset: 0x466, bit: 4, label: "2000G" },
                                        { offset: 0x466, bit: 5, label: "2000G" },
                                        { offset: 0x466, bit: 6, label: "2000G", separator: true },
                                        { offset: 0x45c, bit: 7, label: "Wall: Green Drops", separator: true },
                                        { offset: 0x44b, bit: 1, label: "Red Chest: HP Max up" },
                                        { offset: 0x44d, bit: 4, label: "Red Chest: MP Max up" },
                                        { offset: 0x450, bit: 0, label: "Red Chest: HEART Max Up" },
                                        { offset: 0x453, bit: 4, label: "Red Chest: Moon Ring" },
                                        { offset: 0x461, bit: 0, label: "Red Chest: Valkyrie Mail", separator: true },
                                        { offset: 0x455, bit: 5, label: "Blue Chest: Red Drops" },
                                        { offset: 0x455, bit: 7, label: "Blue Chest: Green Drops" },
                                      ],
                                    },
                                    {
                                      name: "Glyphs",
                                      type: "bitflags",
                                      flags: [
                                        { offset: 0x43d, bit: 3, label: "Melio Hasta" },
                                      ],
                                    },
                                  ],
                                },
                              ],
                            },
                            {
                              name: "Mechanical Tower",
                              items: [
                                {
                                  type: "section",
                                  flex: true,
                                  items: [
                                    {
                                      name: "Events",
                                      type: "bitflags",
                                      flags: [
                                        { offset: 0x41f, bit: 7, label: "Location discovered", separator: true },
                                        { offset: 0x422, bit: 0, label: "Wall destroyed", separator: true },
                                        { offset: 0x430, bit: 2, label: "Shanoa dialog about Sinestro Custos", hidden: true },
                                        { offset: 0x489, bit: 5, label: "Death defeated" },
                                        { offset: 0x469, bit: 4, label: "Death defeated no damage" },
                                      ],
                                    },
                                    {
                                      name: "Treasures",
                                      type: "bitflags",
                                      flags: [
                                        { offset: 0x44b, bit: 0, label: "Wall: HP Max up", separator: true },
                                        { offset: 0x452, bit: 7, label: "Red Chest: Death Ring" },
                                        { offset: 0x460, bit: 7, label: "Red Chest: Heart Cuirass" },
                                        { offset: 0x461, bit: 5, label: "Red Chest: Valkyrie Mask", separator: true },
                                        { offset: 0x46b, bit: 4, label: "Blue Chest: Death Medal" },
                                      ],
                                    },
                                    {
                                      name: "Glyphs",
                                      type: "bitflags",
                                      flags: [
                                        { offset: 0x441, bit: 5, label: "Morbus" },
                                        { offset: 0x442, bit: 2, label: "Sinestro Custos" },
                                        { offset: 0x443, bit: 6, label: "Vis Fio" },
                                      ],
                                    },
                                  ],
                                },
                              ],
                            },
                            {
                              name: "Arms Depot",
                              items: [
                                {
                                  type: "section",
                                  flex: true,
                                  items: [
                                    {
                                      name: "Events",
                                      type: "bitflags",
                                      flags: [
                                        { offset: 0x420, bit: 0, label: "Location discovered", separator: true },
                                        { offset: 0x430, bit: 3, label: "Shanoa dialog about Arma Custos", hidden: true },
                                        { offset: 0x489, bit: 4, label: "Eligor defeated" },
                                        { offset: 0x469, bit: 3, label: "Eligor defeated no damage" },
                                      ],
                                    },
                                    {
                                      name: "Treasures",
                                      type: "bitflags",
                                      flags: [
                                        { offset: 0x45b, bit: 7, label: "Wall: Mint Sundae", separator: true },
                                        { offset: 0x44b, bit: 2, label: "Red Chest: HP Max up", separator: true },
                                        { offset: 0x46b, bit: 3, label: "Blue Chest: Eligor Medal" },
                                      ],
                                    },
                                    {
                                      name: "Glyphs",
                                      type: "bitflags",
                                      flags: [
                                        { offset: 0x43e, bit: 7, label: "Melio Falcis" },
                                        { offset: 0x43f, bit: 2, label: "Melio Culter" },
                                        { offset: 0x43f, bit: 5, label: "Melio Scutum" },
                                        { offset: 0x445, bit: 0, label: "Arma Custos" },
                                      ],
                                    },
                                  ],
                                },
                              ],
                            },
                            {
                              name: "Forsaken Cloister",
                              items: [
                                {
                                  type: "section",
                                  flex: true,
                                  items: [
                                    {
                                      name: "Events",
                                      type: "bitflags",
                                      flags: [
                                        { offset: 0x420, bit: 1, label: "Location discovered", separator: true },
                                        { offset: 0x41c, bit: 6, label: "Custos Glyphs used at Cerberus Room" },
                                        { offset: 0x41c, bit: 7, label: "Switch activated" },
                                        { offset: 0x430, bit: 0, label: "Shanoa dialog about Cerberus room", hidden: true },
                                        { offset: 0x430, bit: 4, label: "Dracula's present in his room" },
                                      ],
                                    },
                                    {
                                      name: "Treasures",
                                      type: "bitflags",
                                      flags: [
                                        { offset: 0x45b, bit: 6, label: "Wall: Eisbein", separator: true },
                                        { offset: 0x450, bit: 1, label: "Red Chest: HEART Max Up" },
                                      ],
                                    },
                                  ],
                                },
                              ],
                            },
                            {
                              name: "Final Approach",
                              items: [
                                {
                                  type: "section",
                                  flex: true,
                                  items: [
                                    {
                                      name: "Events",
                                      type: "bitflags",
                                      flags: [
                                        { offset: 0x420, bit: 2, label: "Location discovered", separator: true },
                                        { offset: 0x421, bit: 5, label: "Wall destroyed" },
                                        { offset: 0x422, bit: 4, label: "Switch activated", separator: true },
                                        { offset: 0x430, bit: 5, label: "Dialog with Dracula", hidden: true },
                                        { offset: 0x430, bit: 6, label: "Shanoa used Dominus", hidden: true },
                                        { offset: 0x430, bit: 7, label: "Shanoa smiled", hidden: true },
                                        { offset: 0x489, bit: 6, label: "Dracula defeated" },
                                        { offset: 0x469, bit: 5, label: "Dracula defeated no damage" },
                                      ],
                                    },
                                    {
                                      name: "Treasures",
                                      type: "bitflags",
                                      flags: [
                                        { offset: 0x453, bit: 6, label: "Wall: Judgement Ring", separator: true },
                                        { offset: 0x44b, bit: 3, label: "Red Chest: MP Max up" },
                                        { offset: 0x44d, bit: 5, label: "Red Chest: MP Max up" },
                                        { offset: 0x44d, bit: 7, label: "Red Chest: MP Max up" },
                                        { offset: 0x450, bit: 3, label: "Red Chest: HEART Max Up" },
                                        { offset: 0x453, bit: 5, label: "Red Chest: Sun Ring" },
                                        { offset: 0x453, bit: 7, label: "Red Chest: World Ring" },
                                        { offset: 0x456, bit: 3, label: "Red Chest: Super Potion" },
                                        { offset: 0x45c, bit: 6, label: "Red Chest: Blue Drops" },
                                        { offset: 0x45f, bit: 2, label: "Red Chest: Onyx" },
                                        { offset: 0x45f, bit: 4, label: "Red Chest: Diamond" },
                                        { offset: 0x45f, bit: 6, label: "Red Chest: Gold Ore", separator: true },
                                        { offset: 0x46b, bit: 5, label: "Blue Chest: Dracula Medal" },
                                      ],
                                    },
                                    {
                                      name: "Glyphs",
                                      type: "bitflags",
                                      flags: [
                                        { offset: 0x443, bit: 4, label: "Volaticus" },
                                      ],
                                    },
                                  ],
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
                              name: "Map Reveal 1",
                              offset: 0x1e8,
                              type: "variable",
                              dataType: "uint64",
                            },
                            {
                              name: "Map Reveal 2",
                              offset: 0x1f0,
                              type: "variable",
                              dataType: "uint64",
                            },
                            {
                              name: "Map Reveal 3",
                              offset: 0x1f8,
                              type: "variable",
                              dataType: "uint64",
                            },
                            {
                              name: "Map Reveal 4",
                              offset: 0x200,
                              type: "variable",
                              dataType: "uint64",
                            },
                            {
                              name: "Map Reveal 5",
                              offset: 0x208,
                              type: "variable",
                              dataType: "uint64",
                            },
                            {
                              name: "Map Reveal 6",
                              offset: 0x210,
                              type: "variable",
                              dataType: "uint64",
                            },
                            {
                              name: "Map Reveal 7",
                              offset: 0x218,
                              type: "variable",
                              dataType: "uint64",
                            },
                            {
                              name: "Map Reveal 8",
                              offset: 0x220,
                              type: "variable",
                              dataType: "uint64",
                            },
                            {
                              name: "Map Reveal 9",
                              offset: 0x228,
                              type: "variable",
                              dataType: "uint64",
                            },
                            {
                              name: "Map Reveal 10",
                              offset: 0x230,
                              type: "variable",
                              dataType: "uint64",
                            },
                            {
                              name: "Map Reveal 11",
                              offset: 0x238,
                              type: "variable",
                              dataType: "uint64",
                            },
                            {
                              name: "Map Reveal 12",
                              offset: 0x240,
                              type: "variable",
                              dataType: "uint64",
                            },
                            {
                              name: "Map Reveal 13",
                              offset: 0x248,
                              type: "variable",
                              dataType: "uint64",
                            },
                            {
                              name: "Map Reveal 14",
                              offset: 0x250,
                              type: "variable",
                              dataType: "uint64",
                            },
                            {
                              name: "Map Reveal 15",
                              offset: 0x258,
                              type: "variable",
                              dataType: "uint64",
                            },
                            {
                              name: "Map Reveal 16",
                              offset: 0x260,
                              type: "variable",
                              dataType: "uint32",
                            },
                            {
                              name: "Map Reveal 17",
                              offset: 0x264,
                              type: "variable",
                              dataType: "uint16",
                            },
                          ],
                        },
                        {
                          name: "Pins",
                          type: "section",
                          flex: true,
                          hidden: true,
                          items: [
                            {
                              length: 0x2,
                              type: "container",
                              instanceType: "section",
                              instances: 5,
                              enumeration: "Pin %d",
                              flex: true,
                              items: [
                                {
                                  name: "Position X",
                                  offset: 0x773,
                                  type: "variable",
                                  dataType: "uint8",
                                },
                                {
                                  name: "Position Y",
                                  offset: 0x774,
                                  type: "variable",
                                  dataType: "uint8",
                                },
                              ],
                            },
                          ],
                        },
                      ],
                    },
                    {
                      name: "Wygol Village",
                      items: [
                        {
                          type: "section",
                          flex: true,
                          items: [
                            {
                              type: "section",
                              noMargin: true,
                              items: [
                                {
                                  name: "World Map",
                                  type: "bitflags",
                                  flags: [
                                    { offset: 0x470, bit: 2, label: "Location visible" },
                                    { offset: 0x470, bit: 3, label: "Location accessible" },
                                  ],
                                },
                                {
                                  id: "rooms",
                                  name: "Entry Rooms",
                                  type: "bitflags",
                                  flags: [
                                    { offset: 0x269, bit: 2, label: "Entrance visible" },
                                    { offset: 0x269, bit: 3, label: "Entrance enabled", hidden: true },
                                  ],
                                },
                              ],
                            },
                            {
                              name: "Events",
                              type: "bitflags",
                              hidden: true,
                              flags: [
                                { offset: 0x41d, bit: 1, label: "Location discovered", hidden: true },
                                { offset: 0x42c, bit: 7, label: "Nikolai trapped", hidden: true },
                                { offset: 0x42d, bit: 6, label: "Dialog with Nikolai after Skeleton Cave", hidden: true },
                              ],
                            },
                            {
                              name: "Glyphs",
                              type: "bitflags",
                              flags: [
                                { offset: 0x440, bit: 0, label: "Torpor" },
                              ],
                            },
                          ],
                        },
                        {
                          type: "section",
                          flex: true,
                          items: [
                            {
                              name: "Wooden Chest 1",
                              type: "section",
                              items: [
                                {
                                  type: "bitflags",
                                  flags: [
                                    { offset: 0x46d, bit: 4, label: "Rare" },
                                    { offset: 0x46f, bit: 4, label: "Opened" },
                                  ],
                                },
                                {
                                  name: "Content",
                                  offset: 0x85e,
                                  type: "variable",
                                  dataType: "uint16",
                                  resource: "items",
                                  autocomplete: true,
                                },
                              ],
                            },
                            {
                              name: "Wooden Chest 2",
                              type: "section",
                              items: [
                                {
                                  type: "bitflags",
                                  flags: [
                                    { offset: 0x46d, bit: 5, label: "Rare" },
                                    { offset: 0x46f, bit: 5, label: "Opened" },
                                  ],
                                },
                                {
                                  name: "Content",
                                  offset: 0x860,
                                  type: "variable",
                                  dataType: "uint16",
                                  resource: "items",
                                  autocomplete: true,
                                },
                              ],
                            },
                            {
                              name: "Wooden Chest 3",
                              type: "section",
                              items: [
                                {
                                  type: "bitflags",
                                  flags: [
                                    { offset: 0x46d, bit: 6, label: "Rare" },
                                    { offset: 0x46f, bit: 6, label: "Opened" },
                                  ],
                                },
                                {
                                  name: "Content",
                                  offset: 0x862,
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
                          name: "Map Reveal",
                          offset: 0x266,
                          type: "variable",
                          dataType: "uint32",
                          hidden: true,
                        },
                        {
                          name: "Pins",
                          type: "section",
                          flex: true,
                          hidden: true,
                          items: [
                            {
                              length: 0x2,
                              type: "container",
                              instanceType: "section",
                              instances: 5,
                              enumeration: "Pin %d",
                              flex: true,
                              items: [
                                {
                                  name: "Position X",
                                  offset: 0x77d,
                                  type: "variable",
                                  dataType: "uint8",
                                },
                                {
                                  name: "Position Y",
                                  offset: 0x77e,
                                  type: "variable",
                                  dataType: "uint8",
                                },
                              ],
                            },
                          ],
                        },
                      ],
                    },
                    {
                      name: "Ecclesia",
                      items: [
                        {
                          type: "section",
                          flex: true,
                          items: [
                            {
                              type: "section",
                              items: [
                                {
                                  name: "World Map",
                                  type: "bitflags",
                                  flags: [
                                    { offset: 0x470, bit: 4, label: "Location visible" },
                                    { offset: 0x470, bit: 5, label: "Location accessible" },
                                  ],
                                },
                                {
                                  id: "rooms",
                                  name: "Entry Rooms",
                                  type: "bitflags",
                                  flags: [
                                    { offset: 0x26c, bit: 6, label: "Entrance" },
                                    { offset: 0x26c, bit: 7, label: "Entrance enabled", hidden: true },
                                  ],
                                },
                              ],
                            },
                            {
                              name: "Events",
                              type: "bitflags",
                              flags: [
                                { offset: 0x41d, bit: 2, label: "Location discovered", hidden: true },
                                { offset: 0x42c, bit: 1, label: "Dialog with Albus", hidden: true },
                                { offset: 0x42c, bit: 3, label: "Training with Glyph done", hidden: true },
                                { offset: 0x42c, bit: 4, label: "Training with monsters done", hidden: true },
                                { offset: 0x42c, bit: 5, label: "Training completed", hidden: true },
                                { offset: 0x42c, bit: 2, label: "Dialog with Barlowe", hidden: true },
                                { offset: 0x42d, bit: 4, label: "Before talking to Barlowe about Domnius Agony absorbed by Albus related", hidden: true },
                                { offset: 0x42e, bit: 0, label: "Before talking to Barlowe about Domnius Agony absorbed by Albus related", hidden: true },
                                { offset: 0x42e, bit: 7, label: "Dialog with Barlowe after defeated Albus", hidden: true },
                                { offset: 0x42f, bit: 2, label: "Barlowe reveals his plan", hidden: true },
                                { offset: 0x42f, bit: 3, label: "Barlowe sacrifice", hidden: true },
                                { offset: 0x42f, bit: 5, label: "Shanoa dialog emergence of Dracula's Castle", hidden: true },
                                { offset: 0x42f, bit: 4, label: "Dracula's Castle emerged", hidden: true },
                                { offset: 0x489, bit: 1, label: "Barlowe defeated" },
                                { offset: 0x469, bit: 0, label: "Barlowe defeated no damage" },
                              ],
                            },
                            {
                              name: "Treasures",
                              type: "bitflags",
                              flags: [
                                { offset: 0x454, bit: 4, label: "Red Chest: Record 5", separator: true },
                                { offset: 0x454, bit: 3, label: "Blue Chest: Record 1" },
                                { offset: 0x46b, bit: 0, label: "Blue Chest: Barlowe Medal" },
                              ],
                            },
                            {
                              name: "Glyphs",
                              type: "bitflags",
                              flags: [
                                { offset: 0x43c, bit: 3, label: "Confodere" },
                              ],
                            },
                          ],
                        },
                        {
                          name: "Map Reveal",
                          offset: 0x26a,
                          type: "variable",
                          dataType: "uint32",
                          hidden: true,
                        },
                        {
                          name: "Pins",
                          type: "section",
                          flex: true,
                          hidden: true,
                          items: [
                            {
                              length: 0x2,
                              type: "container",
                              instanceType: "section",
                              instances: 5,
                              enumeration: "Pin %d",
                              flex: true,
                              items: [
                                {
                                  name: "Position X",
                                  offset: 0x787,
                                  type: "variable",
                                  dataType: "uint8",
                                },
                                {
                                  name: "Position Y",
                                  offset: 0x788,
                                  type: "variable",
                                  dataType: "uint8",
                                },
                              ],
                            },
                          ],
                        },
                      ],
                    },
                    {
                      name: "Training Hall",
                      items: [
                        {
                          type: "section",
                          flex: true,
                          items: [
                            {
                              type: "section",
                              items: [
                                {
                                  name: "World Map",
                                  type: "bitflags",
                                  flags: [
                                    { offset: 0x470, bit: 6, label: "Location visible" },
                                    { offset: 0x470, bit: 7, label: "Location accessible" },
                                  ],
                                },
                                {
                                  id: "rooms",
                                  name: "Entry Rooms",
                                  type: "bitflags",
                                  flags: [
                                    { offset: 0x27c, bit: 0, label: "Entrance" },
                                    { offset: 0x27c, bit: 1, label: "Entrance enabled", hidden: true },
                                  ],
                                },
                              ],
                            },
                            {
                              name: "Events",
                              type: "bitflags",
                              flags: [
                                { offset: 0x41d, bit: 3, label: "Location discovered" },
                              ],
                            },
                            {
                              name: "Glyphs",
                              type: "bitflags",
                              flags: [
                                { offset: 0x43f, bit: 6, label: "Redire" },
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
                              name: "Map Reveal 1",
                              offset: 0x26e,
                              type: "variable",
                              dataType: "uint64",
                            },
                            {
                              name: "Map Reveal 2",
                              offset: 0x276,
                              type: "variable",
                              dataType: "uint64",
                            },
                          ],
                        },
                        {
                          name: "Pins",
                          type: "section",
                          flex: true,
                          hidden: true,
                          items: [
                            {
                              length: 0x2,
                              type: "container",
                              instanceType: "section",
                              instances: 5,
                              enumeration: "Pin %d",
                              flex: true,
                              items: [
                                {
                                  name: "Position X",
                                  offset: 0x791,
                                  type: "variable",
                                  dataType: "uint8",
                                },
                                {
                                  name: "Position Y",
                                  offset: 0x792,
                                  type: "variable",
                                  dataType: "uint8",
                                },
                              ],
                            },
                          ],
                        },
                      ],
                    },
                    {
                      name: "Ruvas Forest",
                      items: [
                        {
                          type: "section",
                          flex: true,
                          items: [
                            {
                              type: "section",
                              items: [
                                {
                                  name: "World Map",
                                  type: "bitflags",
                                  flags: [
                                    { offset: 0x471, bit: 0, label: "Location visible" },
                                    { offset: 0x471, bit: 1, label: "Location accessible" },
                                  ],
                                },
                                {
                                  id: "rooms",
                                  name: "Entry Rooms",
                                  type: "bitflags",
                                  flags: [
                                    { offset: 0x27e, bit: 0, label: "Entrance" },
                                    { offset: 0x27e, bit: 1, label: "Entrance enabled", hidden: true },
                                    { offset: 0x284, bit: 2, label: "Exit" },
                                    { offset: 0x284, bit: 3, label: "Exit enabled", hidden: true },
                                  ],
                                },
                              ],
                            },
                            {
                              name: "Events",
                              type: "bitflags",
                              flags: [
                                { offset: 0x41d, bit: 4, label: "Location discovered" },
                              ],
                            },
                            {
                              name: "Glyphs",
                              type: "bitflags",
                              flags: [
                                { offset: 0x43d, bit: 4, label: "Macir" },
                              ],
                            },
                          ],
                        },
                        {
                          name: "Map Reveal",
                          offset: 0x27e,
                          type: "variable",
                          dataType: "uint64",
                          hidden: true,
                        },
                        {
                          name: "Pins",
                          type: "section",
                          flex: true,
                          hidden: true,
                          items: [
                            {
                              length: 0x2,
                              type: "container",
                              instanceType: "section",
                              instances: 5,
                              enumeration: "Pin %d",
                              flex: true,
                              items: [
                                {
                                  name: "Position X",
                                  offset: 0x79b,
                                  type: "variable",
                                  dataType: "uint8",
                                },
                                {
                                  name: "Position Y",
                                  offset: 0x79c,
                                  type: "variable",
                                  dataType: "uint8",
                                },
                              ],
                            },
                          ],
                        },
                      ],
                    },
                    {
                      name: "Argila Swamp",
                      items: [
                        {
                          type: "section",
                          flex: true,
                          items: [
                            {
                              type: "section",
                              items: [
                                {
                                  name: "World Map",
                                  type: "bitflags",
                                  flags: [
                                    { offset: 0x471, bit: 2, label: "Location visible" },
                                    { offset: 0x471, bit: 3, label: "Location accessible" },
                                  ],
                                },
                                {
                                  id: "rooms",
                                  name: "Entry Rooms",
                                  type: "bitflags",
                                  flags: [
                                    { offset: 0x28b, bit: 2, label: "Entrance" },
                                    { offset: 0x28b, bit: 3, label: "Entrance enabled", hidden: true },
                                    { offset: 0x286, bit: 0, label: "Exit" },
                                    { offset: 0x286, bit: 1, label: "Exit enabled", hidden: true },
                                  ],
                                },
                              ],
                            },
                            {
                              name: "Events",
                              type: "bitflags",
                              flags: [
                                { offset: 0x41d, bit: 5, label: "Location discovered" },
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
                              name: "Map Reveal 1",
                              offset: 0x286,
                              type: "variable",
                              dataType: "uint32",
                            },
                            {
                              name: "Map Reveal 2",
                              offset: 0x28a,
                              type: "variable",
                              dataType: "uint16",
                            },
                          ],
                        },
                        {
                          name: "Pins",
                          type: "section",
                          flex: true,
                          hidden: true,
                          items: [
                            {
                              length: 0x2,
                              type: "container",
                              instanceType: "section",
                              instances: 5,
                              enumeration: "Pin %d",
                              flex: true,
                              items: [
                                {
                                  name: "Position X",
                                  offset: 0x7a5,
                                  type: "variable",
                                  dataType: "uint8",
                                },
                                {
                                  name: "Position Y",
                                  offset: 0x7a6,
                                  type: "variable",
                                  dataType: "uint8",
                                },
                              ],
                            },
                          ],
                        },
                      ],
                    },
                    {
                      name: "Kalidus Channel",
                      items: [
                        {
                          type: "section",
                          flex: true,
                          items: [
                            {
                              type: "section",
                              items: [
                                {
                                  name: "World Map",
                                  type: "bitflags",
                                  flags: [
                                    { offset: 0x471, bit: 4, label: "Location visible" },
                                    { offset: 0x471, bit: 5, label: "Location accessible" },
                                  ],
                                },
                                {
                                  id: "rooms",
                                  name: "Entry Rooms",
                                  type: "bitflags",
                                  flags: [
                                    { offset: 0x28c, bit: 0, label: "Entrance" },
                                    { offset: 0x28c, bit: 1, label: "Entrance enabled", hidden: true },
                                    { offset: 0x291, bit: 0, label: "Exit" },
                                    { offset: 0x291, bit: 1, label: "Exit enabled", hidden: true },
                                    { offset: 0x2a7, bit: 2, label: "Underwater Entrance" },
                                    { offset: 0x2a7, bit: 3, label: "Underwater Entrance enabled", hidden: true },
                                    { offset: 0x2a3, bit: 0, label: "Underwater Exit" },
                                    { offset: 0x2a3, bit: 1, label: "Underwater Exit enabled", hidden: true },
                                  ],
                                },
                                {
                                  id: "rooms",
                                  name: "Warp Rooms",
                                  type: "bitflags",
                                  flags: [
                                    { offset: 0x295, bit: 2, label: "Near Entrance" },
                                    { offset: 0x295, bit: 3, label: "Near Entrance enabled", hidden: true },
                                    { offset: 0x2a2, bit: 6, label: "Near Underwater Entrance" },
                                    { offset: 0x2a2, bit: 7, label: "Near Underwater Entrance enabled", hidden: true },
                                  ],
                                },
                              ],
                            },
                            {
                              name: "Events",
                              type: "bitflags",
                              flags: [
                                { offset: 0x41d, bit: 6, label: "Location discovered", separator: true },
                                { offset: 0x41c, bit: 1, label: "Boulders to entrance destroyed" },
                                { offset: 0x41c, bit: 2, label: "Boulders to exit destroyed" },
                                { offset: 0x421, bit: 2, label: "Wall destroyed" },
                                { offset: 0x422, bit: 1, label: "New", hidden: true },
                                { offset: 0x422, bit: 2, label: "New no more", hidden: true },
                              ],
                            },
                            {
                              name: "Treasures",
                              type: "bitflags",
                              flags: [
                                { offset: 0x465, bit: 4, label: "1000G" },
                                { offset: 0x465, bit: 5, label: "1000G" },
                                { offset: 0x465, bit: 6, label: "1000G" },
                                { offset: 0x456, bit: 5, label: "Magical Ticket" },
                                { offset: 0x45e, bit: 5, label: "Sapphire", separator: true },
                                { offset: 0x454, bit: 1, label: "Wall: Twinbee", separator: true },
                                { offset: 0x44a, bit: 0, label: "Red Chest: HP Max up" },
                                { offset: 0x44a, bit: 1, label: "Red Chest: HP Max up" },
                                { offset: 0x44c, bit: 4, label: "Red Chest: MP Max up" },
                                { offset: 0x44c, bit: 5, label: "Red Chest: MP Max up" },
                                { offset: 0x44d, bit: 6, label: "Red Chest: MP Max up" },
                                { offset: 0x44f, bit: 0, label: "Red Chest: HEART Max Up" },
                                { offset: 0x44f, bit: 1, label: "Red Chest: HEART Max Up" },
                                { offset: 0x450, bit: 2, label: "Red Chest: HEART Max Up" },
                                { offset: 0x455, bit: 1, label: "Red Chest: Potion" },
                                { offset: 0x456, bit: 4, label: "Red Chest: Super Potion" },
                                { offset: 0x457, bit: 6, label: "Red Chest: Anti-Venom" },
                                { offset: 0x459, bit: 2, label: "Red Chest: Chamomile" },
                                { offset: 0x45e, bit: 7, label: "Red Chest: Emerald" },
                                { offset: 0x45f, bit: 7, label: "Red Chest: Iron Ore", separator: true },
                                { offset: 0x451, bit: 3, label: "Blue Chest: Magical Ring" },
                              ],
                            },
                            {
                              name: "Glyphs",
                              type: "bitflags",
                              flags: [
                                { offset: 0x43f, bit: 3, label: "Scutum" },
                                { offset: 0x443, bit: 7, label: "Fortis Fio" },
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
                              name: "Map Reveal 1",
                              offset: 0x28c,
                              type: "variable",
                              dataType: "uint64",
                            },
                            {
                              name: "Map Reveal 2",
                              offset: 0x294,
                              type: "variable",
                              dataType: "uint64",
                            },
                            {
                              name: "Map Reveal 3",
                              offset: 0x29c,
                              type: "variable",
                              dataType: "uint64",
                            },
                            {
                              name: "Map Reveal 4",
                              offset: 0x2a4,
                              type: "variable",
                              dataType: "uint64",
                            },
                          ],
                        },
                        {
                          name: "Pins",
                          type: "section",
                          flex: true,
                          hidden: true,
                          items: [
                            {
                              length: 0x2,
                              type: "container",
                              instanceType: "section",
                              instances: 5,
                              enumeration: "Pin %d",
                              flex: true,
                              items: [
                                {
                                  name: "Position X",
                                  offset: 0x7af,
                                  type: "variable",
                                  dataType: "uint8",
                                },
                                {
                                  name: "Position Y",
                                  offset: 0x7b0,
                                  type: "variable",
                                  dataType: "uint8",
                                },
                              ],
                            },
                          ],
                        },
                      ],
                    },
                    {
                      name: "Somnus Reef",
                      items: [
                        {
                          type: "section",
                          flex: true,
                          items: [
                            {
                              type: "section",
                              items: [
                                {
                                  name: "World Map",
                                  type: "bitflags",
                                  flags: [
                                    { offset: 0x471, bit: 6, label: "Location visible" },
                                    { offset: 0x471, bit: 7, label: "Location accessible" },
                                  ],
                                },
                                {
                                  id: "rooms",
                                  name: "Entry Rooms",
                                  type: "bitflags",
                                  flags: [
                                    { offset: 0x2ac, bit: 0, label: "Entrance" },
                                    { offset: 0x2ac, bit: 1, label: "Entrance enabled", hidden: true },
                                    { offset: 0x2af, bit: 0, label: "Exit" },
                                    { offset: 0x2af, bit: 1, label: "Exit enabled", hidden: true },
                                  ],
                                },
                                {
                                  id: "rooms",
                                  name: "Warp Rooms",
                                  type: "bitflags",
                                  flags: [
                                    { offset: 0x2ad, bit: 4, label: "Near Entrance" },
                                    { offset: 0x2ad, bit: 5, label: "Near Entrance enabled", hidden: true },
                                    { offset: 0x2bb, bit: 4, label: "Near Save Room" },
                                    { offset: 0x2bb, bit: 5, label: "Near Save Room enabled", hidden: true },
                                  ],
                                },
                              ],
                            },
                            {
                              name: "Events",
                              type: "bitflags",
                              flags: [
                                { offset: 0x41d, bit: 7, label: "Location discovered", separator: true },
                                { offset: 0x421, bit: 3, label: "Wall destroyed", separator: true },
                                { offset: 0x488, bit: 5, label: "Rusalka defeated" },
                                { offset: 0x468, bit: 4, label: "Rusalka defeated no damage" },
                              ],
                            },
                            {
                              name: "Treasures",
                              type: "bitflags",
                              flags: [
                                { offset: 0x466, bit: 0, label: "2000G", separator: true },
                                { offset: 0x454, bit: 2, label: "Wall: Vic Viper", separator: true },
                                { offset: 0x44a, bit: 4, label: "Red Chest: HP Max up" },
                                { offset: 0x44d, bit: 0, label: "Red Chest: MP Max up" },
                                { offset: 0x44f, bit: 4, label: "Red Chest: HEART Max Up" },
                                { offset: 0x460, bit: 5, label: "Red Chest: Reinforced Suit", separator: true },
                                { offset: 0x46a, bit: 4, label: "Blue Chest: Rusalka Medal" },
                              ],
                            },
                            {
                              name: "Glyphs",
                              type: "bitflags",
                              flags: [
                                { offset: 0x43e, bit: 0, label: "Arcus" },
                                { offset: 0x43e, bit: 3, label: "Ascia" },
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
                              name: "Map Reveal 1",
                              offset: 0x2ac,
                              type: "variable",
                              dataType: "uint64",
                            },
                            {
                              name: "Map Reveal 2",
                              offset: 0x2b4,
                              type: "variable",
                              dataType: "uint64",
                            },
                            {
                              name: "Map Reveal 3",
                              offset: 0x2bc,
                              type: "variable",
                              dataType: "uint32",
                            },
                          ],
                        },
                        {
                          name: "Pins",
                          type: "section",
                          flex: true,
                          hidden: true,
                          items: [
                            {
                              length: 0x2,
                              type: "container",
                              instanceType: "section",
                              instances: 5,
                              enumeration: "Pin %d",
                              flex: true,
                              items: [
                                {
                                  name: "Position X",
                                  offset: 0x7b9,
                                  type: "variable",
                                  dataType: "uint8",
                                },
                                {
                                  name: "Position Y",
                                  offset: 0x7ba,
                                  type: "variable",
                                  dataType: "uint8",
                                },
                              ],
                            },
                          ],
                        },
                      ],
                    },
                    {
                      name: "Minera Prison Island",
                      items: [
                        {
                          type: "section",
                          flex: true,
                          items: [
                            {
                              type: "section",
                              items: [
                                {
                                  name: "World Map",
                                  type: "bitflags",
                                  flags: [
                                    { offset: 0x472, bit: 0, label: "Location visible" },
                                    { offset: 0x472, bit: 1, label: "Location accessible" },
                                  ],
                                },
                                {
                                  id: "rooms",
                                  name: "Entry Rooms",
                                  type: "bitflags",
                                  flags: [
                                    { offset: 0x2c4, bit: 2, label: "Entrance" },
                                    { offset: 0x2c4, bit: 3, label: "Entrance enabled", hidden: true },
                                    { offset: 0x2ca, bit: 6, label: "Exit" },
                                    { offset: 0x2ca, bit: 7, label: "Exit enabled", hidden: true },
                                  ],
                                },
                                {
                                  id: "rooms",
                                  name: "Warp Rooms",
                                  type: "bitflags",
                                  flags: [
                                    { offset: 0x2c4, bit: 4, label: "Entrance" },
                                    { offset: 0x2c4, bit: 5, label: "Entrance enabled", hidden: true },
                                    { offset: 0x2d1, bit: 4, label: "Near Albus" },
                                    { offset: 0x2d1, bit: 5, label: "Near Albus enabled", hidden: true },
                                    { offset: 0x2c9, bit: 0, label: "Near Exit" },
                                    { offset: 0x2c9, bit: 1, label: "Near Exit enabled", hidden: true },
                                  ],
                                },
                              ],
                            },
                            {
                              name: "Events",
                              type: "bitflags",
                              flags: [
                                { offset: 0x41e, bit: 0, label: "Location discovered", separator: true },
                                { offset: 0x421, bit: 4, label: "Wall destroyed", separator: true },
                                { offset: 0x488, bit: 2, label: "Giant Skeleton defeated" },
                                { offset: 0x468, bit: 1, label: "Giant Skeleton defeated no damage" },
                                { offset: 0x430, bit: 3, label: "Dominus Hatred related", hidden: true },
                              ],
                            },
                            {
                              name: "Treasures",
                              type: "bitflags",
                              flags: [
                                { offset: 0x465, bit: 3, label: "500G" },
                                { offset: 0x465, bit: 7, label: "500G", separator: true },
                                { offset: 0x454, bit: 0, label: "Wall: Konami Man", separator: true },
                                { offset: 0x449, bit: 7, label: "Red Chest: HP Max up" },
                                { offset: 0x44c, bit: 3, label: "Red Chest: MP Max up" },
                                { offset: 0x44e, bit: 7, label: "Red Chest: HEART Max Up" },
                                { offset: 0x451, bit: 4, label: "Red Chest: Priestess Ring" },
                                { offset: 0x453, bit: 2, label: "Red Chest: Tower Ring" },
                                { offset: 0x461, bit: 2, label: "Red Chest: Cabriolet", separator: true },
                                { offset: 0x452, bit: 5, label: "Blue Chest: Strength Ring" },
                                { offset: 0x46a, bit: 1, label: "Blue Chest: Skeleton Medal", separator: true },
                                { offset: 0x448, bit: 7, label: "Golden Chest: Glyph Sleeve" },
                              ],
                            },
                            {
                              name: "Glyphs",
                              type: "bitflags",
                              flags: [
                                { offset: 0x42d, bit: 1, label: "Dominus Hatred" },
                                { offset: 0x43e, bit: 5, label: "Falcis" },
                                { offset: 0x441, bit: 0, label: "Vol Fulgur" },
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
                              name: "Map Reveal 1",
                              offset: 0x2c0,
                              type: "variable",
                              dataType: "uint64",
                            },
                            {
                              name: "Map Reveal 2",
                              offset: 0x2c8,
                              type: "variable",
                              dataType: "uint64",
                            },
                            {
                              name: "Map Reveal 3",
                              offset: 0x2d0,
                              type: "variable",
                              dataType: "uint32",
                            },
                            {
                              name: "Map Reveal 4",
                              offset: 0x2d4,
                              type: "variable",
                              dataType: "uint16",
                            },
                          ],
                        },
                        {
                          name: "Pins",
                          type: "section",
                          flex: true,
                          hidden: true,
                          items: [
                            {
                              length: 0x2,
                              type: "container",
                              instanceType: "section",
                              instances: 5,
                              enumeration: "Pin %d",
                              flex: true,
                              items: [
                                {
                                  name: "Position X",
                                  offset: 0x7c3,
                                  type: "variable",
                                  dataType: "uint8",
                                },
                                {
                                  name: "Position Y",
                                  offset: 0x7c4,
                                  type: "variable",
                                  dataType: "uint8",
                                },
                              ],
                            },
                          ],
                        },
                      ],
                    },
                    {
                      name: "Lighthouse",
                      items: [
                        {
                          type: "section",
                          flex: true,
                          items: [
                            {
                              type: "section",
                              items: [
                                {
                                  name: "World Map",
                                  type: "bitflags",
                                  flags: [
                                    { offset: 0x472, bit: 2, label: "Location visible" },
                                    { offset: 0x472, bit: 3, label: "Location accessible" },
                                  ],
                                },
                                {
                                  id: "rooms",
                                  name: "Entry Rooms",
                                  type: "bitflags",
                                  flags: [
                                    { offset: 0x2da, bit: 4, label: "Entrance" },
                                    { offset: 0x2da, bit: 5, label: "Entrance enabled", hidden: true },
                                    { offset: 0x2dc, bit: 0, label: "Exit" },
                                    { offset: 0x2dc, bit: 1, label: "Exit enabled", hidden: true },
                                  ],
                                },
                              ],
                            },
                            {
                              name: "Events",
                              type: "bitflags",
                              flags: [
                                { offset: 0x41e, bit: 1, label: "Location discovered", separator: true },
                                { offset: 0x41c, bit: 0, label: "Elevator available", separator: true },
                                { offset: 0x422, bit: 3, label: "Brachyura related", hidden: true },
                                { offset: 0x42d, bit: 3, label: "Exit dialog", hidden: true },
                                { offset: 0x488, bit: 3, label: "Brachyura defeated" },
                                { offset: 0x468, bit: 2, label: "Brachyura defeated no damage" },
                              ],
                            },
                            {
                              name: "Treasures",
                              type: "bitflags",
                              flags: [
                                { offset: 0x457, bit: 5, label: "Red Chest: Anti-Venom", separator: true },
                                { offset: 0x46a, bit: 2, label: "Blue Chest: Brachyura Medal", separator: true },
                                { offset: 0x448, bit: 5, label: "Golden Chest: Serpent Scale" },
                              ],
                            },
                            {
                              name: "Glyphs",
                              type: "bitflags",
                              flags: [
                                { offset: 0x441, bit: 1, label: "Luminatio" },
                              ],
                            },
                          ],
                        },
                        {
                          name: "Map Reveal",
                          offset: 0x2d6,
                          type: "variable",
                          dataType: "uint64",
                          hidden: true,
                        },
                        {
                          name: "Pins",
                          type: "section",
                          flex: true,
                          hidden: true,
                          items: [
                            {
                              length: 0x2,
                              type: "container",
                              instanceType: "section",
                              instances: 5,
                              enumeration: "Pin %d",
                              flex: true,
                              items: [
                                {
                                  name: "Position X",
                                  offset: 0x7cd,
                                  type: "variable",
                                  dataType: "uint8",
                                },
                                {
                                  name: "Position Y",
                                  offset: 0x7ce,
                                  type: "variable",
                                  dataType: "uint8",
                                },
                              ],
                            },
                          ],
                        },
                      ],
                    },
                    {
                      name: "Tymeo Mountains",
                      items: [
                        {
                          type: "section",
                          flex: true,
                          items: [
                            {
                              type: "section",
                              items: [
                                {
                                  name: "World Map",
                                  type: "bitflags",
                                  flags: [
                                    { offset: 0x472, bit: 4, label: "Location visible" },
                                    { offset: 0x472, bit: 5, label: "Location accessible" },
                                  ],
                                },
                                {
                                  id: "rooms",
                                  name: "Entry Rooms",
                                  type: "bitflags",
                                  flags: [
                                    { offset: 0x2f7, bit: 2, label: "Entrance" },
                                    { offset: 0x2f7, bit: 3, label: "Entrance enabled", hidden: true },
                                    { offset: 0x2e6, bit: 6, label: "West Exit" },
                                    { offset: 0x2e6, bit: 7, label: "West Exit enabled", hidden: true },
                                    { offset: 0x2df, bit: 2, label: "East Exit" },
                                    { offset: 0x2df, bit: 3, label: "East Exit enabled", hidden: true },
                                  ],
                                },
                                {
                                  id: "rooms",
                                  name: "Warp Rooms",
                                  type: "bitflags",
                                  flags: [
                                    { offset: 0x2ef, bit: 4, label: "Near West Exit" },
                                    { offset: 0x2ef, bit: 5, label: "Near West Exit enabled", hidden: true },
                                    { offset: 0x2f1, bit: 4, label: "Near East Exit" },
                                    { offset: 0x2f1, bit: 5, label: "Near East Exit enabled", hidden: true },
                                  ],
                                },
                              ],
                            },
                            {
                              name: "Events",
                              type: "bitflags",
                              flags: [
                                { offset: 0x41e, bit: 2, label: "Location discovered", separator: true },
                                { offset: 0x420, bit: 5, label: "Wall destroyed" },
                              ],
                            },
                            {
                              name: "Treasures",
                              type: "bitflags",
                              flags: [
                                { offset: 0x45a, bit: 7, label: "Mushroom", separator: true },
                                { offset: 0x45e, bit: 3, label: "Wall: Ruby", separator: true },
                                { offset: 0x44a, bit: 2, label: "Red Chest: HP Max up" },
                                { offset: 0x44c, bit: 6, label: "Red Chest: MP Max up" },
                                { offset: 0x44f, bit: 2, label: "Red Chest: HEART Max Up" },
                                { offset: 0x451, bit: 5, label: "Red Chest: Empress Ring" },
                                { offset: 0x453, bit: 1, label: "Red Chest: Devil Ring" },
                                { offset: 0x460, bit: 3, label: "Red Chest: Moonwalkers" },
                                { offset: 0x461, bit: 4, label: "Red Chest: Crimson Mask", separator: true },
                                { offset: 0x451, bit: 6, label: "Blue Chest: Emperor Ring" },
                                { offset: 0x455, bit: 6, label: "Blue Chest: Blue Drops" },
                              ],
                            },
                            {
                              name: "Glyphs",
                              type: "bitflags",
                              flags: [
                                { offset: 0x440, bit: 2, label: "Pneuma" },
                                { offset: 0x444, bit: 1, label: "Fides Fio" },
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
                              name: "Map Reveal 1",
                              offset: 0x2de,
                              type: "variable",
                              dataType: "uint64",
                            },
                            {
                              name: "Map Reveal 2",
                              offset: 0x2e6,
                              type: "variable",
                              dataType: "uint64",
                            },
                            {
                              name: "Map Reveal 3",
                              offset: 0x2ee,
                              type: "variable",
                              dataType: "uint64",
                            },
                            {
                              name: "Map Reveal 4",
                              offset: 0x2f6,
                              type: "variable",
                              dataType: "uint16",
                            },
                          ],
                        },
                        {
                          name: "Pins",
                          type: "section",
                          flex: true,
                          hidden: true,
                          items: [
                            {
                              length: 0x2,
                              type: "container",
                              instanceType: "section",
                              instances: 5,
                              enumeration: "Pin %d",
                              flex: true,
                              items: [
                                {
                                  name: "Position X",
                                  offset: 0x7d7,
                                  type: "variable",
                                  dataType: "uint8",
                                },
                                {
                                  name: "Position Y",
                                  offset: 0x7d8,
                                  type: "variable",
                                  dataType: "uint8",
                                },
                              ],
                            },
                          ],
                        },
                      ],
                    },
                    {
                      name: "Tristis Pass",
                      items: [
                        {
                          type: "section",
                          flex: true,
                          items: [
                            {
                              type: "section",
                              items: [
                                {
                                  name: "World Map",
                                  type: "bitflags",
                                  flags: [
                                    { offset: 0x472, bit: 6, label: "Location visible" },
                                    { offset: 0x472, bit: 7, label: "Location accessible" },
                                  ],
                                },
                                {
                                  id: "rooms",
                                  name: "Entry Rooms",
                                  type: "bitflags",
                                  flags: [
                                    { offset: 0x307, bit: 0, label: "Entrance" },
                                    { offset: 0x307, bit: 1, label: "Entrance enabled", hidden: true },
                                    { offset: 0x2f8, bit: 0, label: "Exit" },
                                    { offset: 0x2f8, bit: 1, label: "Exit enabled", hidden: true },
                                  ],
                                },
                                {
                                  id: "rooms",
                                  name: "Warp Rooms",
                                  type: "bitflags",
                                  flags: [
                                    { offset: 0x301, bit: 4, label: "Near Save Room" },
                                    { offset: 0x301, bit: 5, label: "Near Save Room enabled", hidden: true },
                                    { offset: 0x303, bit: 4, label: "Near Entrance" },
                                    { offset: 0x303, bit: 5, label: "Near Entrance enabled", hidden: true },
                                  ],
                                },
                              ],
                            },
                            {
                              name: "Events",
                              type: "bitflags",
                              flags: [
                                { offset: 0x41e, bit: 3, label: "Location discovered", separator: true },
                                { offset: 0x420, bit: 6, label: "Wall destroyed" },
                                { offset: 0x41c, bit: 3, label: "Ice melted Room 1" },
                                { offset: 0x41c, bit: 4, label: "Ice melted Room 2" },
                              ],
                            },
                            {
                              name: "Treasures",
                              type: "bitflags",
                              flags: [
                                { offset: 0x45d, bit: 6, label: "Amanita", separator: true },
                                { offset: 0x45f, bit: 1, label: "Wall: Onyx", separator: true },
                                { offset: 0x44a, bit: 5, label: "Red Chest: HP Max up" },
                                { offset: 0x44d, bit: 1, label: "Red Chest: MP Max up" },
                                { offset: 0x44f, bit: 5, label: "Red Chest: HEART Max Up" },
                                { offset: 0x452, bit: 1, label: "Red Chest: Chariot Ring" },
                                { offset: 0x460, bit: 6, label: "Red Chest: Body Suit", separator: true },
                                { offset: 0x452, bit: 0, label: "Blue Chest: Lovers Ring" },
                              ],
                            },
                            {
                              name: "Glyphs",
                              type: "bitflags",
                              flags: [
                                { offset: 0x43d, bit: 2, label: "Vol Hasta" },
                                { offset: 0x440, bit: 6, label: "Vol Grando" },
                                { offset: 0x444, bit: 3, label: "Inire Pecunia" },
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
                              name: "Map Reveal 1",
                              offset: 0x2f8,
                              type: "variable",
                              dataType: "uint64",
                            },
                            {
                              name: "Map Reveal 2",
                              offset: 0x300,
                              type: "variable",
                              dataType: "uint64",
                            },
                            {
                              name: "Map Reveal 3",
                              offset: 0x308,
                              type: "variable",
                              dataType: "uint32",
                            },
                            {
                              name: "Map Reveal 4",
                              offset: 0x30c,
                              type: "variable",
                              dataType: "uint16",
                            },
                          ],
                        },
                        {
                          name: "Pins",
                          type: "section",
                          flex: true,
                          hidden: true,
                          items: [
                            {
                              length: 0x2,
                              type: "container",
                              instanceType: "section",
                              instances: 5,
                              enumeration: "Pin %d",
                              flex: true,
                              items: [
                                {
                                  name: "Position X",
                                  offset: 0x7e1,
                                  type: "variable",
                                  dataType: "uint8",
                                },
                                {
                                  name: "Position Y",
                                  offset: 0x7e2,
                                  type: "variable",
                                  dataType: "uint8",
                                },
                              ],
                            },
                          ],
                        },
                      ],
                    },
                    {
                      name: "Large Cavern",
                      items: [
                        {
                          type: "section",
                          flex: true,
                          items: [
                            {
                              type: "section",
                              items: [
                                {
                                  name: "World Map",
                                  type: "bitflags",
                                  flags: [
                                    { offset: 0x473, bit: 0, label: "Location visible" },
                                    { offset: 0x473, bit: 1, label: "Location accessible" },
                                  ],
                                },
                                {
                                  id: "rooms",
                                  name: "Entry Rooms",
                                  type: "bitflags",
                                  flags: [
                                    { offset: 0x30f, bit: 4, label: "Entrance" },
                                    { offset: 0x30f, bit: 5, label: "Entrance enabled", hidden: true },
                                  ],
                                },
                                {
                                  id: "rooms",
                                  name: "Warp Rooms",
                                  type: "bitflags",
                                  flags: [
                                    { offset: 0x30f, bit: 2, label: "Near Entrance" },
                                    { offset: 0x30f, bit: 3, label: "Near Entrance enabled", hidden: true },
                                    { offset: 0x316, bit: 2, label: "Near End" },
                                    { offset: 0x316, bit: 3, label: "Near End enabled", hidden: true },
                                  ],
                                },
                              ],
                            },
                            {
                              name: "Events",
                              type: "bitflags",
                              flags: [
                                { offset: 0x41e, bit: 4, label: "Location discovered" },
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
                              name: "Map Reveal 1",
                              offset: 0x30e,
                              type: "variable",
                              dataType: "uint64",
                            },
                            {
                              name: "Map Reveal 2",
                              offset: 0x316,
                              type: "variable",
                              dataType: "uint16",
                            },
                          ],
                        },
                        {
                          name: "Pins",
                          type: "section",
                          flex: true,
                          hidden: true,
                          items: [
                            {
                              length: 0x2,
                              type: "container",
                              instanceType: "section",
                              instances: 5,
                              enumeration: "Pin %d",
                              flex: true,
                              items: [
                                {
                                  name: "Position X",
                                  offset: 0x7eb,
                                  type: "variable",
                                  dataType: "uint8",
                                },
                                {
                                  name: "Position Y",
                                  offset: 0x7ec,
                                  type: "variable",
                                  dataType: "uint8",
                                },
                              ],
                            },
                          ],
                        },
                      ],
                    },
                    {
                      name: "Giant's Dwelling",
                      items: [
                        {
                          type: "section",
                          flex: true,
                          items: [
                            {
                              type: "section",
                              items: [
                                {
                                  name: "World Map",
                                  type: "bitflags",
                                  flags: [
                                    { offset: 0x473, bit: 2, label: "Location visible" },
                                    { offset: 0x473, bit: 3, label: "Location accessible" },
                                  ],
                                },
                                {
                                  id: "rooms",
                                  name: "Entry Rooms",
                                  type: "bitflags",
                                  flags: [
                                    { offset: 0x319, bit: 4, label: "Exit" },
                                    { offset: 0x319, bit: 5, label: "Exit enabled", hidden: true },
                                    { offset: 0x31c, bit: 4, label: "Entrance" },
                                    { offset: 0x31c, bit: 5, label: "Entrance enabled", hidden: true },
                                  ],
                                },
                              ],
                            },
                            {
                              name: "Events",
                              type: "bitflags",
                              flags: [
                                { offset: 0x41e, bit: 5, label: "Location discovered", separator: true },
                                { offset: 0x430, bit: 4, label: "Dominus Anger related", hidden: true },
                                { offset: 0x488, bit: 6, label: "Goliath defeated" },
                                { offset: 0x468, bit: 5, label: "Goliath defeated no damage" },
                              ],
                            },
                            {
                              name: "Treasures",
                              type: "bitflags",
                              flags: [
                                { offset: 0x453, bit: 0, label: "Wall: Temperance Ring", separator: true },
                                { offset: 0x461, bit: 3, label: "Red Chest: Caprine", separator: true },
                                { offset: 0x456, bit: 0, label: "Blue Chest: Black Drops" },
                                { offset: 0x46a, bit: 5, label: "Blue Chest: Goliath Medal" },
                              ],
                            },
                            {
                              name: "Glyphs",
                              type: "bitflags",
                              flags: [
                                { offset: 0x42d, bit: 7, label: "Dominus Anger" },
                                { offset: 0x43c, bit: 7, label: "Vol Secare" },
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
                              name: "Map Reveal 1",
                              offset: 0x318,
                              type: "variable",
                              dataType: "uint64",
                            },
                            {
                              name: "Map Reveal 2",
                              offset: 0x320,
                              type: "variable",
                              dataType: "uint16",
                            },
                          ],
                        },
                        {
                          name: "Pins",
                          type: "section",
                          flex: true,
                          hidden: true,
                          items: [
                            {
                              length: 0x2,
                              type: "container",
                              instanceType: "section",
                              instances: 5,
                              enumeration: "Pin %d",
                              flex: true,
                              items: [
                                {
                                  name: "Position X",
                                  offset: 0x7f5,
                                  type: "variable",
                                  dataType: "uint8",
                                },
                                {
                                  name: "Position Y",
                                  offset: 0x7f6,
                                  type: "variable",
                                  dataType: "uint8",
                                },
                              ],
                            },
                          ],
                        },
                      ],
                    },
                    {
                      name: "Mystery Manor",
                      items: [
                        {
                          type: "section",
                          flex: true,
                          items: [
                            {
                              type: "section",
                              items: [
                                {
                                  name: "World Map",
                                  type: "bitflags",
                                  flags: [
                                    { offset: 0x473, bit: 4, label: "Location visible" },
                                    { offset: 0x473, bit: 5, label: "Location accessible" },
                                  ],
                                },
                                {
                                  id: "rooms",
                                  name: "Entry Rooms",
                                  type: "bitflags",
                                  flags: [
                                    { offset: 0x326, bit: 2, label: "Entrance" },
                                    { offset: 0x326, bit: 3, label: "Entrance enabled", hidden: true },
                                  ],
                                },
                              ],
                            },
                            {
                              name: "Events",
                              type: "bitflags",
                              flags: [
                                { offset: 0x41e, bit: 6, label: "Location discovered", separator: true },
                                { offset: 0x42e, bit: 3, label: "Shanoa dialog can be trigger", hidden: true },
                                { offset: 0x42e, bit: 4, label: "Shanoa dialog", hidden: true },
                                { offset: 0x42e, bit: 5, label: "Dialog with Albus", hidden: true },
                                { offset: 0x42e, bit: 6, label: "Shanoa dialog after defeated Albus", hidden: true },
                                { offset: 0x42f, bit: 1, label: "Albus absorbed by Dominus", hidden: true },
                                { offset: 0x489, bit: 0, label: "Albus defeated" },
                                { offset: 0x468, bit: 7, label: "Albus defeated no damage" },
                              ],
                            },
                            {
                              name: "Treasures",
                              type: "bitflags",
                              flags: [
                                { offset: 0x466, bit: 1, label: "2000G" },
                                { offset: 0x466, bit: 2, label: "2000G", separator: true },
                                { offset: 0x45b, bit: 5, label: "Wall: Schnitzel", separator: true },
                                { offset: 0x45f, bit: 5, label: "Red Chest: Gold Ore", separator: true },
                                { offset: 0x452, bit: 4, label: "Blue Chest: Fortune Ring" },
                                { offset: 0x46a, bit: 7, label: "Blue Chest: Albus Medal" },
                              ],
                            },
                            {
                              name: "Glyphs",
                              type: "bitflags",
                              flags: [
                                { offset: 0x441, bit: 4, label: "Vol Umbra" },
                                { offset: 0x446, bit: 0, label: "Dominus Agony" },
                              ],
                            },
                          ],
                        },
                        {
                          name: "Map Reveal",
                          offset: 0x322,
                          type: "variable",
                          dataType: "uint64",
                          hidden: true,
                        },
                        {
                          name: "Pins",
                          type: "section",
                          flex: true,
                          hidden: true,
                          items: [
                            {
                              length: 0x2,
                              type: "container",
                              instanceType: "section",
                              instances: 5,
                              enumeration: "Pin %d",
                              flex: true,
                              items: [
                                {
                                  name: "Position X",
                                  offset: 0x7ff,
                                  type: "variable",
                                  dataType: "uint8",
                                },
                                {
                                  name: "Position Y",
                                  offset: 0x800,
                                  type: "variable",
                                  dataType: "uint8",
                                },
                              ],
                            },
                          ],
                        },
                      ],
                    },
                    {
                      name: "Misty Forest Road",
                      items: [
                        {
                          type: "section",
                          flex: true,
                          items: [
                            {
                              type: "section",
                              items: [
                                {
                                  name: "World Map",
                                  type: "bitflags",
                                  flags: [
                                    { offset: 0x473, bit: 6, label: "Location visible" },
                                    { offset: 0x473, bit: 7, label: "Location accessible" },
                                  ],
                                },
                                {
                                  id: "rooms",
                                  name: "Entry Rooms",
                                  type: "bitflags",
                                  flags: [
                                    { offset: 0x32c, bit: 0, label: "Exit" },
                                    { offset: 0x32c, bit: 1, label: "Exit enabled", hidden: true },
                                    { offset: 0x331, bit: 2, label: "Entrance" },
                                    { offset: 0x331, bit: 3, label: "Entrance enabled", hidden: true },
                                  ],
                                },
                              ],
                            },
                            {
                              name: "Events",
                              type: "bitflags",
                              flags: [
                                { offset: 0x41e, bit: 7, label: "Location discovered" },
                              ],
                            },
                            {
                              name: "Treasures",
                              type: "bitflags",
                              flags: [
                                { offset: 0x458, bit: 6, label: "Sage" },
                                { offset: 0x459, bit: 4, label: "Rue", separator: true },
                                { offset: 0x45d, bit: 2, label: "Wall: White Drops", separator: true },
                                { offset: 0x451, bit: 7, label: "Red Chest: Hierophant Ring" },
                              ],
                            },
                            {
                              name: "Glyphs",
                              type: "bitflags",
                              flags: [
                                { offset: 0x43d, bit: 5, label: "Vol Macir" },
                                { offset: 0x43e, bit: 1, label: "Melio Arcus" },
                              ],
                            },
                          ],
                        },
                        {
                          name: "Map Reveal",
                          offset: 0x32a,
                          type: "variable",
                          dataType: "uint64",
                          hidden: true,
                        },
                        {
                          name: "Pins",
                          type: "section",
                          flex: true,
                          hidden: true,
                          items: [
                            {
                              length: 0x2,
                              type: "container",
                              instanceType: "section",
                              instances: 5,
                              enumeration: "Pin %d",
                              flex: true,
                              items: [
                                {
                                  name: "Position X",
                                  offset: 0x809,
                                  type: "variable",
                                  dataType: "uint8",
                                },
                                {
                                  name: "Position Y",
                                  offset: 0x80a,
                                  type: "variable",
                                  dataType: "uint8",
                                },
                              ],
                            },
                          ],
                        },
                      ],
                    },
                    {
                      name: "Oblivion Ridge",
                      items: [
                        {
                          type: "section",
                          flex: true,
                          items: [
                            {
                              type: "section",
                              items: [
                                {
                                  name: "World Map",
                                  type: "bitflags",
                                  flags: [
                                    { offset: 0x474, bit: 0, label: "Location visible" },
                                    { offset: 0x474, bit: 1, label: "Location accessible" },
                                  ],
                                },
                                {
                                  id: "rooms",
                                  name: "Entry Rooms",
                                  type: "bitflags",
                                  flags: [
                                    { offset: 0x335, bit: 6, label: "Entrance" },
                                    { offset: 0x335, bit: 7, label: "Entrance enabled", hidden: true },
                                  ],
                                },
                              ],
                            },
                            {
                              name: "Events",
                              type: "bitflags",
                              flags: [
                                { offset: 0x41f, bit: 0, label: "Location discovered", separator: true },
                                { offset: 0x42e, bit: 1, label: "Shanoa sense strong magic", hidden: true },
                                { offset: 0x42e, bit: 2, label: "Dominus Agony absorbed by Albus", hidden: true },
                                { offset: 0x488, bit: 7, label: "Gravedorcus defeated" },
                                { offset: 0x468, bit: 6, label: "Gravedorcus defeated no damage" },
                              ],
                            },
                            {
                              name: "Treasures",
                              type: "bitflags",
                              flags: [
                                { offset: 0x459, bit: 1, label: "Chamomille", separator: true },
                                { offset: 0x452, bit: 3, label: "Wall: Hermit Ring" },
                                { offset: 0x45f, bit: 3, label: "Wall: Diamond", separator: true },
                                { offset: 0x46a, bit: 6, label: "Blue Chest: Gravedo Medal" },
                              ],
                            },
                            {
                              name: "Glyphs",
                              type: "bitflags",
                              flags: [
                                { offset: 0x444, bit: 0, label: "Sapiens Fio" },
                              ],
                            },
                          ],
                        },
                        {
                          name: "Map Reveal",
                          offset: 0x332,
                          type: "variable",
                          dataType: "uint64",
                          hidden: true,
                        },
                        {
                          name: "Pins",
                          type: "section",
                          flex: true,
                          hidden: true,
                          items: [
                            {
                              length: 0x2,
                              type: "container",
                              instanceType: "section",
                              instances: 5,
                              enumeration: "Pin %d",
                              flex: true,
                              items: [
                                {
                                  name: "Position X",
                                  offset: 0x813,
                                  type: "variable",
                                  dataType: "uint8",
                                },
                                {
                                  name: "Position Y",
                                  offset: 0x814,
                                  type: "variable",
                                  dataType: "uint8",
                                },
                              ],
                            },
                          ],
                        },
                      ],
                    },
                    {
                      name: "Skeleton Cave",
                      items: [
                        {
                          type: "section",
                          flex: true,
                          items: [
                            {
                              type: "section",
                              items: [
                                {
                                  name: "World Map",
                                  type: "bitflags",
                                  flags: [
                                    { offset: 0x474, bit: 2, label: "Location visible" },
                                    { offset: 0x474, bit: 3, label: "Location accessible" },
                                  ],
                                },
                                {
                                  id: "rooms",
                                  name: "Entry Rooms",
                                  type: "bitflags",
                                  flags: [
                                    { offset: 0x33b, bit: 6, label: "Entrance" },
                                    { offset: 0x33b, bit: 7, label: "Entrance enabled", hidden: true },
                                  ],
                                },
                              ],
                            },
                            {
                              name: "Events",
                              type: "bitflags",
                              flags: [
                                { offset: 0x41f, bit: 1, label: "Location discovered", separator: true },
                                { offset: 0x42d, bit: 4, label: "Dialog with Albus", hidden: true },
                                { offset: 0x488, bit: 4, label: "Maneater defeated" },
                                { offset: 0x468, bit: 3, label: "Maneater defeated no damage" },
                              ],
                            },
                            {
                              name: "Treasures",
                              type: "bitflags",
                              flags: [
                                { offset: 0x45d, bit: 0, label: "Wall: Black Drops", separator: true },
                                { offset: 0x44a, bit: 3, label: "Red Chest: HP Max up" },
                                { offset: 0x44c, bit: 7, label: "Red Chest: MP Max up" },
                                { offset: 0x44f, bit: 3, label: "Red Chest: HEART Max Up", separator: true },
                                { offset: 0x46a, bit: 3, label: "Blue Chest: Maneater Medal", separator: true },
                                { offset: 0x448, bit: 6, label: "Golden Chest: Ordinary Rock" },
                              ],
                            },
                          ],
                        },
                        {
                          name: "Map Reveal",
                          offset: 0x33a,
                          type: "variable",
                          dataType: "uint64",
                          hidden: true,
                        },
                        {
                          name: "Pins",
                          type: "section",
                          flex: true,
                          hidden: true,
                          items: [
                            {
                              length: 0x2,
                              type: "container",
                              instanceType: "section",
                              instances: 5,
                              enumeration: "Pin %d",
                              flex: true,
                              items: [
                                {
                                  name: "Position X",
                                  offset: 0x81d,
                                  type: "variable",
                                  dataType: "uint8",
                                },
                                {
                                  name: "Position Y",
                                  offset: 0x81e,
                                  type: "variable",
                                  dataType: "uint8",
                                },
                              ],
                            },
                          ],
                        },
                      ],
                    },
                    {
                      name: "Monastery",
                      items: [
                        {
                          type: "section",
                          flex: true,
                          items: [
                            {
                              type: "section",
                              items: [
                                {
                                  name: "World Map",
                                  type: "bitflags",
                                  flags: [
                                    { offset: 0x474, bit: 4, label: "Location visible" },
                                    { offset: 0x474, bit: 5, label: "Location accessible" },
                                  ],
                                },
                                {
                                  id: "rooms",
                                  name: "Entry Rooms",
                                  type: "bitflags",
                                  flags: [
                                    { offset: 0x34e, bit: 4, label: "Entrance" },
                                    { offset: 0x34e, bit: 5, label: "Entrance enabled", hidden: true },
                                  ],
                                },
                                {
                                  id: "rooms",
                                  name: "Warp Rooms",
                                  type: "bitflags",
                                  flags: [
                                    { offset: 0x350, bit: 6, label: "Near Entrance" },
                                    { offset: 0x350, bit: 7, label: "Near Entrance enabled", hidden: true },
                                    { offset: 0x342, bit: 0, label: "Near Boss" },
                                    { offset: 0x342, bit: 1, label: "Near Boss enabled", hidden: true },
                                  ],
                                },
                              ],
                            },
                            {
                              name: "Events",
                              type: "bitflags",
                              flags: [
                                { offset: 0x41f, bit: 2, label: "Location discovered", separator: true },
                                { offset: 0x420, bit: 4, label: "Wall destroyed", separator: true },
                                { offset: 0x42c, bit: 6, label: "Talk with Albus after defeated Arthroverta", hidden: true },
                                { offset: 0x443, bit: 2, label: "Magnes related", hidden: true },
                                { offset: 0x488, bit: 1, label: "Arthroverta defeated" },
                                { offset: 0x468, bit: 0, label: "Arthroverta defeated no damage" },
                              ],
                            },
                            {
                              name: "Treasures",
                              type: "bitflags",
                              flags: [
                                { offset: 0x465, bit: 2, label: "500G", separator: true },
                                { offset: 0x45c, bit: 5, label: "Wall: Red Drops", separator: true },
                                { offset: 0x449, bit: 6, label: "Red Chest: HP Max up" },
                                { offset: 0x44c, bit: 2, label: "Red Chest: MP Max up" },
                                { offset: 0x44e, bit: 6, label: "Red Chest: HEART Max Up" },
                                { offset: 0x451, bit: 2, label: "Red Chest: Fool Ring" },
                                { offset: 0x460, bit: 2, label: "Red Chest: Sandals" },
                                { offset: 0x461, bit: 1, label: "Red Chest: Cotton Hat", separator: true },
                                { offset: 0x452, bit: 2, label: "Blue Chest: Justice Ring" },
                                { offset: 0x46a, bit: 0, label: "Blue Chest: Arthro Medal", separator: true },
                                { offset: 0x449, bit: 1, label: "Golden Chest: Book of Spirits" },
                              ],
                            },
                            {
                              name: "Glyphs",
                              type: "bitflags",
                              flags: [
                                { offset: 0x437, bit: 3, label: "Magnes" },
                                { offset: 0x43f, bit: 0, label: "Culter" },
                                { offset: 0x43f, bit: 7, label: "Cubus" },
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
                              name: "Map Reveal 1",
                              offset: 0x342,
                              type: "variable",
                              dataType: "uint64",
                            },
                            {
                              name: "Map Reveal 2",
                              offset: 0x34a,
                              type: "variable",
                              dataType: "uint64",
                            },
                          ],
                        },
                        {
                          name: "Pins",
                          type: "section",
                          flex: true,
                          hidden: true,
                          items: [
                            {
                              length: 0x2,
                              type: "container",
                              instanceType: "section",
                              instances: 5,
                              enumeration: "Pin %d",
                              flex: true,
                              items: [
                                {
                                  name: "Position X",
                                  offset: 0x827,
                                  type: "variable",
                                  dataType: "uint8",
                                },
                                {
                                  name: "Position Y",
                                  offset: 0x828,
                                  type: "variable",
                                  dataType: "uint8",
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
              name: "Wooden Chests",
              items: [
                {
                  type: "section",
                  flex: true,
                  items: [
                    {
                      name: "Chest 1",
                      type: "section",
                      items: [
                        {
                          type: "bitflags",
                          flags: [
                            { offset: 0x46c, bit: 0, label: "Rare" },
                            { offset: 0x46e, bit: 0, label: "Opened" },
                          ],
                        },
                        {
                          name: "Content",
                          offset: 0x846,
                          type: "variable",
                          dataType: "uint16",
                          resource: "items",
                          autocomplete: true,
                        },
                      ],
                    },
                    {
                      name: "Chest 2",
                      type: "section",
                      items: [
                        {
                          type: "bitflags",
                          flags: [
                            { offset: 0x46c, bit: 1, label: "Rare" },
                            { offset: 0x46e, bit: 1, label: "Opened" },
                          ],
                        },
                        {
                          name: "Content",
                          offset: 0x848,
                          type: "variable",
                          dataType: "uint16",
                          resource: "items",
                          autocomplete: true,
                        },
                      ],
                    },
                    {
                      name: "Chest 3",
                      type: "section",
                      items: [
                        {
                          type: "bitflags",
                          flags: [
                            { offset: 0x46c, bit: 2, label: "Rare" },
                            { offset: 0x46e, bit: 2, label: "Opened" },
                          ],
                        },
                        {
                          name: "Content",
                          offset: 0x84a,
                          type: "variable",
                          dataType: "uint16",
                          resource: "items",
                          autocomplete: true,
                        },
                      ],
                    },
                    {
                      name: "Chest 4",
                      type: "section",
                      items: [
                        {
                          type: "bitflags",
                          flags: [
                            { offset: 0x46c, bit: 3, label: "Rare" },
                            { offset: 0x46e, bit: 3, label: "Opened" },
                          ],
                        },
                        {
                          name: "Content",
                          offset: 0x84c,
                          type: "variable",
                          dataType: "uint16",
                          resource: "items",
                          autocomplete: true,
                        },
                      ],
                    },
                    {
                      name: "Chest 5",
                      type: "section",
                      items: [
                        {
                          type: "bitflags",
                          flags: [
                            { offset: 0x46c, bit: 4, label: "Rare" },
                            { offset: 0x46e, bit: 4, label: "Opened" },
                          ],
                        },
                        {
                          name: "Content",
                          offset: 0x84e,
                          type: "variable",
                          dataType: "uint16",
                          resource: "items",
                          autocomplete: true,
                        },
                      ],
                    },
                    {
                      name: "Chest 6",
                      type: "section",
                      items: [
                        {
                          type: "bitflags",
                          flags: [
                            { offset: 0x46c, bit: 5, label: "Rare" },
                            { offset: 0x46e, bit: 5, label: "Opened" },
                          ],
                        },
                        {
                          name: "Content",
                          offset: 0x850,
                          type: "variable",
                          dataType: "uint16",
                          resource: "items",
                          autocomplete: true,
                        },
                      ],
                    },
                    {
                      name: "Chest 7",
                      type: "section",
                      items: [
                        {
                          type: "bitflags",
                          flags: [
                            { offset: 0x46c, bit: 6, label: "Rare" },
                            { offset: 0x46e, bit: 6, label: "Opened" },
                          ],
                        },
                        {
                          name: "Content",
                          offset: 0x852,
                          type: "variable",
                          dataType: "uint16",
                          resource: "items",
                          autocomplete: true,
                        },
                      ],
                    },
                    {
                      name: "Chest 8",
                      type: "section",
                      items: [
                        {
                          type: "bitflags",
                          flags: [
                            { offset: 0x46c, bit: 7, label: "Rare" },
                            { offset: 0x46e, bit: 7, label: "Opened" },
                          ],
                        },
                        {
                          name: "Content",
                          offset: 0x854,
                          type: "variable",
                          dataType: "uint16",
                          resource: "items",
                          autocomplete: true,
                        },
                      ],
                    },
                    {
                      name: "Chest 9",
                      type: "section",
                      items: [
                        {
                          type: "bitflags",
                          flags: [
                            { offset: 0x46d, bit: 0, label: "Rare" },
                            { offset: 0x46f, bit: 0, label: "Opened" },
                          ],
                        },
                        {
                          name: "Content",
                          offset: 0x856,
                          type: "variable",
                          dataType: "uint16",
                          resource: "items",
                          autocomplete: true,
                        },
                      ],
                    },
                    {
                      name: "Chest 10",
                      type: "section",
                      items: [
                        {
                          type: "bitflags",
                          flags: [
                            { offset: 0x46d, bit: 1, label: "Rare" },
                            { offset: 0x46f, bit: 1, label: "Opened" },
                          ],
                        },
                        {
                          name: "Content",
                          offset: 0x858,
                          type: "variable",
                          dataType: "uint16",
                          resource: "items",
                          autocomplete: true,
                        },
                      ],
                    },
                    {
                      name: "Chest 11",
                      type: "section",
                      items: [
                        {
                          type: "bitflags",
                          flags: [
                            { offset: 0x46d, bit: 2, label: "Rare" },
                            { offset: 0x46f, bit: 2, label: "Opened" },
                          ],
                        },
                        {
                          name: "Content",
                          offset: 0x85a,
                          type: "variable",
                          dataType: "uint16",
                          resource: "items",
                          autocomplete: true,
                        },
                      ],
                    },
                    {
                      name: "Chest 12",
                      type: "section",
                      items: [
                        {
                          type: "bitflags",
                          flags: [
                            { offset: 0x46d, bit: 3, label: "Rare" },
                            { offset: 0x46f, bit: 3, label: "Opened" },
                          ],
                        },
                        {
                          name: "Content",
                          offset: 0x85c,
                          type: "variable",
                          dataType: "uint16",
                          resource: "items",
                          autocomplete: true,
                        },
                      ],
                    },
                  ],
                },
              ],
            },
            {
              name: "Config",
              items: [
                {
                  type: "section",
                  flex: true,
                  items: [
                    {
                      name: "Music",
                      offset: 0x83b,
                      type: "variable",
                      dataType: "uint8",
                      max: 100,
                    },
                    {
                      name: "Sound FX",
                      offset: 0x83c,
                      type: "variable",
                      dataType: "uint8",
                      max: 100,
                    },
                    {
                      name: "Voice",
                      offset: 0x83d,
                      type: "variable",
                      dataType: "uint8",
                      max: 100,
                    },
                  ],
                },
                {
                  type: "section",
                  flex: true,
                  items: [
                    {
                      name: "Voice",
                      offset: 0x83f,
                      type: "variable",
                      dataType: "bit",
                      bit: 0,
                      resource: "voices",
                    },
                    {
                      name: "Surround",
                      offset: 0x83f,
                      type: "variable",
                      dataType: "bit",
                      bit: 1,
                      resource: "optionBoolean",
                    },
                    {
                      type: "bitflags",
                      hidden: true,
                      flags: [
                        { offset: 0x83f, bit: 2, label: "???" },
                        { offset: 0x83f, bit: 3, label: "???" },
                        { offset: 0x83f, bit: 4, label: "???" },
                        { offset: 0x83f, bit: 5, label: "???" },
                        { offset: 0x83f, bit: 6, label: "???" },
                        { offset: 0x83f, bit: 7, label: "???" },
                      ],
                    },
                  ],
                },
                {
                  name: "Buttons",
                  type: "section",
                  flex: true,
                  items: [
                    {
                      name: "Main Glyph",
                      offset: 0x730,
                      type: "variable",
                      dataType: "uint16",
                      resource: "buttons",
                    },
                    {
                      name: "Sub Glyph",
                      offset: 0x732,
                      type: "variable",
                      dataType: "uint16",
                      resource: "buttons",
                    },
                    {
                      name: "Back Glyph",
                      offset: 0x734,
                      type: "variable",
                      dataType: "uint16",
                      resource: "buttons",
                    },
                  ],
                },
                {
                  type: "section",
                  flex: true,
                  items: [
                    {
                      name: "Jump",
                      offset: 0x736,
                      type: "variable",
                      dataType: "uint16",
                      resource: "buttons",
                    },
                    {
                      name: "Backdash",
                      offset: 0x73a,
                      type: "variable",
                      dataType: "uint16",
                      resource: "buttons",
                    },
                  ],
                },
                {
                  type: "section",
                  flex: true,
                  items: [
                    {
                      name: "Glyph Sleeve",
                      offset: 0x738,
                      type: "variable",
                      dataType: "uint16",
                      resource: "buttons",
                    },
                    {
                      name: "Top Screen Toggle Mode",
                      offset: 0x73c,
                      type: "variable",
                      dataType: "uint16",
                      hidden: true,
                    },
                  ],
                },
              ],
            },
          ],
        },
      ],
      appendSubinstance: [
        {
          name: "Records",
          items: [
            {
              type: "tabs",
              vertical: true,
              items: [
                {
                  name: "Boss Rush Mode",
                  items: [
                    {
                      length: 0x30,
                      type: "container",
                      instanceType: "tabs",
                      instances: 2,
                      enumeration: "Course %d",
                      items: [
                        {
                          length: 0x10,
                          type: "container",
                          instanceType: "section",
                          instances: 3,
                          enumeration: "%o Place",
                          flex: true,
                          items: [
                            {
                              name: "Filename",
                              offset: 0x20,
                              length: 0x8,
                              type: "variable",
                              dataType: "string",
                              letterDataType: "uint8",
                              resource: "letters",
                            },
                            {
                              name: "Best Time",
                              type: "group",
                              mode: "chrono",
                              items: [
                                {
                                  offset: 0x28,
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
                                  leadingZeros: 1,
                                  max: 59,
                                },
                                {
                                  offset: 0x28,
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
                                  offset: 0x28,
                                  type: "variable",
                                  dataType: "uint32",
                                  operations: [
                                    {
                                      convert: {
                                        from: "seconds",
                                        to: "seconds",
                                      },
                                    },
                                    { "*": 16.93 },
                                    { round: 0 },
                                  ],
                                  leadingZeros: 2,
                                  max: 999,
                                  step: 100,
                                },
                              ],
                            },
                            {
                              name: "???",
                              offset: 0x2c,
                              type: "variable",
                              dataType: "uint32",
                              hidden: true,
                            },
                          ],
                        },
                      ],
                    },
                  ],
                },
                {
                  name: "Practice Mode",
                  items: [
                    {
                      length: 0x24,
                      type: "container",
                      instanceType: "tabs",
                      instances: 3,
                      enumeration: "Course %d",
                      items: [
                        {
                          length: 0xc,
                          type: "container",
                          instanceType: "section",
                          instances: 3,
                          enumeration: "%o Place",
                          flex: true,
                          items: [
                            {
                              name: "Filename",
                              offset: 0x80,
                              length: 0x8,
                              type: "variable",
                              dataType: "string",
                              letterDataType: "uint8",
                              resource: "letters",
                            },
                            {
                              name: "Best Score",
                              offset: 0x88,
                              type: "variable",
                              dataType: "uint32",
                              max: 99999999,
                            },
                          ],
                        },
                      ],
                    },
                  ],
                },
                {
                  name: "Nintendo WFC Race",
                  items: [
                    {
                      length: 0x24,
                      type: "container",
                      instanceType: "tabs",
                      instances: 3,
                      enumeration: "Course %d",
                      items: [
                        {
                          length: 0xc,
                          type: "container",
                          instanceType: "section",
                          instances: 3,
                          enumeration: "%o Place",
                          flex: true,
                          items: [
                            {
                              name: "Filename",
                              offset: 0x158,
                              length: 0x8,
                              type: "variable",
                              dataType: "string",
                              letterDataType: "uint8",
                              resource: "letters",
                            },
                            {
                              name: "Best Score",
                              offset: 0x160,
                              type: "variable",
                              dataType: "uint32",
                              max: 99999999,
                            },
                          ],
                        },
                      ],
                    },
                  ],
                },
                {
                  name: "Wireless Race",
                  items: [
                    {
                      length: 0x24,
                      type: "container",
                      instanceType: "tabs",
                      instances: 3,
                      enumeration: "Course %d",
                      items: [
                        {
                          length: 0xc,
                          type: "container",
                          instanceType: "section",
                          instances: 3,
                          enumeration: "%o Place",
                          flex: true,
                          items: [
                            {
                              name: "Filename",
                              offset: 0xec,
                              length: 0x8,
                              type: "variable",
                              dataType: "string",
                              letterDataType: "uint8",
                              resource: "letters",
                            },
                            {
                              name: "Best Score",
                              offset: 0xf4,
                              type: "variable",
                              dataType: "uint32",
                              max: 99999999,
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
    accessories: {
      0x0: "-",
      ...accessories,
    },
    bodyGears: {
      0x0: "-",
      ...bodyGears,
    },
    backGlyphs: {
      0x0: "-",
      ...backGlyphs,
    },
    buttons: {
      0x1: "A",
      0x2: "B",
      0x100: "R",
      0x200: "L",
      0x400: "X",
      0x800: "Y",
    },
    characters: {
      0x0: "Shanoa",
      0x4: "Albus",
    },
    difficulties: {
      0x0: "Normal",
      0x1: "Hard",
    },
    glyphUnions: {
      0x0: "-",
      0x1: "Union Secare",
      0x2: "Union Ascia",
      0x3: "Union Falcis",
      0x4: "Union Macir",
      0x5: "Union Pneuma",
      0x6: "Union Lapiste",
      0x7: "Union Ignis",
      0x8: "Union Grando",
      0x9: "Union Fulgur",
      0xa: "Evanescere",
      0xb: "Union Luminatio",
      0xc: "Union Umbra",
      0xd: "Universitas",
      0xe: "Mars",
      0xf: "Mercurius",
      0x10: "Iupiter",
      0x11: "Tellus",
      0x12: "Saturnus",
      0x13: "Uranus",
      0x14: "Pluto",
      0x15: "Pulsus",
      0x16: "Union Nitesco",
      0x17: "Venus",
      0x18: "Dominus",
      0x19: "Union Scutum",
      0x1a: "Union Agartha",
      0x1b: "Union Hasta",
      0x1c: "Union Culter",
      0x1d: "Union Confodere",
      0x1e: "Union Arcus",
    },
    handGlyphs: {
      0x0: "-",
      ...handGlyphs,
    },
    headGears: {
      0x0: "-",
      ...headGears,
    },
    items: {
      0x0: "-",
      ...inventory,
    },
    languages: [
      // Europe
      {
        0x1: "English",
        0x2: "French",
        0x3: "German",
        0x4: "Italian",
        0x5: "Spanish",
      },
      // USA
      {
        0x1: "English",
        0x2: "French",
      },
    ],
    legGears: {
      0x0: "-",
      ...legGears,
    },
    letters: {
      // 0x0: " ",
      0x1: "0",
      0x2: "1",
      0x3: "2",
      0x4: "3",
      0x5: "4",
      0x6: "5",
      0x7: "6",
      0x8: "7",
      0x9: "8",
      0xa: "9",
      0xb: "*",
      0xc: "A",
      0xd: "B",
      0xe: "C",
      0xf: "D",
      0x10: "E",
      0x11: "F",
      0x12: "G",
      0x13: "H",
      0x14: "I",
      0x15: "J",
      0x16: "K",
      0x17: "L",
      0x18: "M",
      0x19: "N",
      0x1a: "O",
      0x1b: "P",
      0x1c: "Q",
      0x1d: "R",
      0x1e: "S",
      0x1f: "T",
      0x20: "U",
      0x21: "V",
      0x22: "W",
      0x23: "X",
      0x24: "Y",
      0x25: "Z",
      0x26: "(",
      0x27: ")",
      0x28: "-",
      0x29: "!",
      0x2a: "/",
      0x2b: "&",
      0x2c: "'",
    },
    levels: {
      0x1: "1",
      0x32: "50",
      0x63: "99",
      0xff: "255",
    },
    locations: {
      0x2: "Dracula's Castle: Castle Entrance",
      0x20b: "Dracula's Castle: Underground Labyrinth",
      0x308: "Dracula's Castle: Library",
      0x505: "Dracula's Castle: Barracks",
      0x613: "Dracula's Castle: Mechanical Tower",
      0x705: "Dracula's Castle: Mechanical Tower",
      0x80d: "Dracula's Castle: Arms Depot",
      0x900: "Dracula's Castle: Forsaken Cloister",
      0xb01: "Dracula's Castle: Final Approach",
      0x10100: "Wygol Village",
      0x20005: "Ecclesia",
      0x60005: "Kalidus Channel (near Entrance)",
      0x60011: "Kalidus Channel (near Underwater Entrance)",
      0x70101: "Somnus Reef",
      0x80008: "Minera Prison Island (near Entrance)",
      0x80202: "Minera Prison Island (near Exit)",
      0xa0001: "Tymeo Mountains (near Entrance)",
      0xa0015: "Tymeo Mountains (near East Exit)",
      0xb0005: "Tristis Pass (near Entrance)",
      0xb0009: "Tristis Pass (near Exit)",
      0xd0002: "Giant's Dwelling (near Exit)",
      0xd0014: "Giant's Dwelling (near Entrance)",
      0xe0005: "Mystery Manor",
      0x100105: "Oblivion Ridge",
      0x110006: "Skeleton Cave",
      0x120006: "Monastery (middle)",
      0x120011: "Monastery (near Boss)",
    },
    optionBoolean: {
      0x0: "Off",
      0x1: "On",
    },
    progressions: {
      0x0: "-",
      0x1: "Clear",
    },
    questProgressions: {
      0x0: "-",
      0x1: "Pending",
      0x3: "Requirements Obtained",
      0x7: "Completed",
    },
    questSergeProgressions: {
      0x0: "-",
      0x1: "Pending",
      0x5: "Completed",
    },
    voices: {
      0x0: "Japanese",
      0x1: "English",
    },
  },
  resourcesLabels: {
    items: {
      0x76: "Items",
      0xa5: "Key Items",
      0xe7: "Body Gears",
      0x102: "Head Gears",
      0x126: "Leg Gears",
      0x13b: "Accessories",
    },
    locations: {
      0x2: "Dracula's Castle",
      0x10100: "Wygol Village",
      0x20005: "Ecclesia",
      0x60005: "Kalidus Channel",
      0x70101: "Somnus Reef",
      0x80008: "Minera Prison Island",
      0xa0001: "Tymeo Mountains",
      0xb0005: "Tristis Pass",
      0xd0002: "Giant's Dwelling",
      0xe0005: "Mystery Manor",
      0x100105: "Oblivion Ridge",
      0x110006: "Skeleton Cave",
      0x120006: "Monastery",
    },
  },
};

export default template;
