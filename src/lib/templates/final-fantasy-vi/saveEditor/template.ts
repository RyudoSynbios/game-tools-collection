import type { GameJson } from "$lib/types";

const template: GameJson = {
  validator: {
    platforms: {
      supernintendo_gameboyadvance: {
        europe: {},
        usa: {},
        japan: {},
      },
    },
    text: "Drag 'n' drop here or click to add a save file.",
    error: "Not a valid save file.",
  },
  items: [
    {
      id: "slots",
      length: 0xa00,
      type: "container",
      instanceType: "tabs",
      instances: 3,
      enumeration: "Slot %d",
      onTabChange: "onSlotChange(%d)",
      items: [
        {
          type: "section",
          flex: true,
          hidden: true,
          items: [
            {
              name: "Checksum",
              offset: 0x9fe,
              type: "checksum",
              dataType: "uint16",
              control: {
                offsetStart: 0x0,
                offsetEnd: 0x9fe,
              },
            },
            {
              id: "checksumGba-%index%",
              name: "Checksum GBA (Espers...)",
              offset: 0x23fe,
              type: "checksum",
              dataType: "uint16",
              control: {
                offsetStart: 0x2000,
                offsetEnd: 0x2400,
              },
              overrideShift: {
                parent: 1,
                shift: 0x400,
              },
            },
            {
              id: "checksumGba-%index%",
              name: "Checksum GBA (Bestiary)",
              offset: 0x2ffe,
              type: "checksum",
              dataType: "uint16",
              control: {
                offsetStart: 0x2c00,
                offsetEnd: 0x3000,
              },
              overrideShift: {
                parent: 1,
                shift: 0x400,
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
                              name: "Save Count",
                              offset: 0x7c7,
                              type: "variable",
                              dataType: "uint16",
                              hidden: true,
                            },
                            {
                              id: "gbaOnly",
                              name: "Progression",
                              offset: 0x200a,
                              type: "variable",
                              dataType: "uint8",
                              resource: "progressions",
                              overrideShift: {
                                parent: -1,
                                shift: 0x400,
                              },
                            },
                            {
                              name: "Playtime",
                              type: "group",
                              mode: "time",
                              items: [
                                {
                                  offset: 0x263,
                                  type: "variable",
                                  dataType: "uint8",
                                  max: 99,
                                },
                                {
                                  offset: 0x264,
                                  type: "variable",
                                  dataType: "uint8",
                                  leadingZeros: 1,
                                  max: 59,
                                },
                                {
                                  offset: 0x265,
                                  type: "variable",
                                  dataType: "uint8",
                                  leadingZeros: 1,
                                  max: 59,
                                },
                              ],
                            },
                            {
                              name: "Steps",
                              offset: 0x266,
                              type: "variable",
                              dataType: "uint24",
                              max: 9999999,
                            },
                            {
                              name: "Money",
                              offset: 0x260,
                              type: "variable",
                              dataType: "uint24",
                              max: 9999999,
                            },
                            {
                              id: "cross-currentGroup",
                              name: "Current Group",
                              offset: 0x46d,
                              type: "variable",
                              dataType: "uint8",
                              min: 1,
                              max: 3,
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
                              offset: 0x964,
                              type: "variable",
                              dataType: "uint16",
                              binary: {
                                bitStart: 0,
                                bitLength: 9,
                              },
                              resource: "locations",
                              size: "lg",
                              autocomplete: true,
                            },
                            {
                              id: "position-general-92",
                              name: "Position X",
                              offset: 0x9c0,
                              type: "variable",
                              dataType: "uint8",
                              disabled: true,
                            },
                            {
                              id: "position-general-93",
                              name: "Position Y",
                              offset: 0x9c1,
                              type: "variable",
                              dataType: "uint8",
                              disabled: true,
                            },
                            {
                              id: "position-worldMap-4",
                              name: "Position X",
                              offset: 0x960,
                              type: "variable",
                              dataType: "uint8",
                              hidden: true,
                            },
                            {
                              id: "position-worldMap-3",
                              name: "Position Y",
                              offset: 0x961,
                              type: "variable",
                              dataType: "uint8",
                              hidden: true,
                            },
                          ],
                        },
                      ],
                    },
                    {
                      name: "Airship",
                      items: [
                        {
                          type: "section",
                          flex: true,
                          items: [
                            {
                              name: "Status",
                              offset: 0x8b7,
                              type: "variable",
                              dataType: "bit",
                              bit: 1,
                              resource: "booleanEnabled",
                            },
                            {
                              name: "Position X",
                              offset: 0x962,
                              type: "variable",
                              dataType: "uint8",
                            },
                            {
                              name: "Position Y",
                              offset: 0x963,
                              type: "variable",
                              dataType: "uint8",
                            },
                          ],
                        },
                        {
                          id: "airshipCharacters-%index%",
                          name: "Lineup Characters",
                          type: "bitflags",
                          flags: [
                            { offset: 0x8de, bit: 0, label: "Character 1" },
                            { offset: 0x8de, bit: 1, label: "Character 2" },
                            { offset: 0x8de, bit: 2, label: "Character 3" },
                            { offset: 0x8de, bit: 3, label: "Character 4" },
                            { offset: 0x8de, bit: 4, label: "Character 5" },
                            { offset: 0x8de, bit: 5, label: "Character 6" },
                            { offset: 0x8de, bit: 6, label: "Character 7" },
                            { offset: 0x8de, bit: 7, label: "Character 8" },
                            { offset: 0x8df, bit: 0, label: "Character 9" },
                            { offset: 0x8df, bit: 1, label: "Character 10" },
                            { offset: 0x8df, bit: 2, label: "Character 11" },
                            { offset: 0x8df, bit: 3, label: "Character 12" },
                            { offset: 0x8df, bit: 4, label: "Character 13" },
                            { offset: 0x8df, bit: 5, label: "Character 14" },
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
                  length: 0x25,
                  type: "container",
                  instanceType: "tabs",
                  instances: 16,
                  resource: "characterNames",
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
                                  id: "character",
                                  name: "Character",
                                  offset: 0x0,
                                  type: "variable",
                                  dataType: "uint8",
                                  resource: "characters",
                                  autocomplete: true,
                                },
                                {
                                  id: "characterName-%parent%-%index%",
                                  name: "Name",
                                  offset: 0x2,
                                  length: 0x6,
                                  type: "variable",
                                  dataType: "string",
                                  letterDataType: "uint8",
                                  fallback: 0xff,
                                  resource: "letters",
                                  test: true,
                                },
                                {
                                  id: "characterGroup",
                                  name: "Group",
                                  offset: 0x250,
                                  type: "variable",
                                  dataType: "uint8",
                                  binary: {
                                    bitStart: 0,
                                    bitLength: 3,
                                  },
                                  resource: "groups",
                                  overrideShift: {
                                    parent: 1,
                                    shift: 0x1,
                                  },
                                },
                                {
                                  name: "Position",
                                  offset: 0x250,
                                  type: "variable",
                                  dataType: "uint8",
                                  binary: {
                                    bitStart: 3,
                                    bitLength: 2,
                                  },
                                  operations: [{ "+": 1 }],
                                  min: 1,
                                  max: 4,
                                  overrideShift: {
                                    parent: 1,
                                    shift: 0x1,
                                  },
                                },
                              ],
                            },
                            {
                              type: "section",
                              flex: true,
                              hidden: true,
                              items: [
                                {
                                  name: "Graphic Set",
                                  offset: 0x1,
                                  type: "variable",
                                  dataType: "uint8",
                                  hidden: true,
                                },
                                {
                                  name: "Row",
                                  offset: 0x250,
                                  type: "variable",
                                  dataType: "bit",
                                  bit: 5,
                                  overrideShift: {
                                    parent: 1,
                                    shift: 0x1,
                                  },
                                  hidden: true,
                                },
                                {
                                  name: "Enabled",
                                  offset: 0x250,
                                  type: "variable",
                                  dataType: "bit",
                                  bit: 6,
                                  overrideShift: {
                                    parent: 1,
                                    shift: 0x1,
                                  },
                                  hidden: true,
                                },
                                {
                                  name: "???",
                                  offset: 0x250,
                                  type: "variable",
                                  dataType: "bit",
                                  bit: 7,
                                  overrideShift: {
                                    parent: 1,
                                    shift: 0x1,
                                  },
                                  hidden: true,
                                },
                              ],
                            },
                            {
                              type: "section",
                              flex: true,
                              noMargin: true,
                              items: [
                                {
                                  name: "Level",
                                  offset: 0x8,
                                  type: "variable",
                                  dataType: "uint8",
                                  min: 1,
                                  max: 99,
                                },
                                {
                                  id: "cross-experience",
                                  name: "Experience",
                                  offset: 0x11,
                                  type: "variable",
                                  dataType: "uint24",
                                  max: 15000000,
                                },
                                {
                                  name: "HP",
                                  type: "group",
                                  mode: "fraction",
                                  items: [
                                    {
                                      offset: 0x9,
                                      type: "variable",
                                      dataType: "uint16",
                                      max: 9999,
                                    },
                                    {
                                      offset: 0xb,
                                      type: "variable",
                                      dataType: "uint16",
                                      max: 9999,
                                      binary: {
                                        bitStart: 0,
                                        bitLength: 14,
                                      },
                                    },
                                  ],
                                },
                                {
                                  name: "MP",
                                  type: "group",
                                  mode: "fraction",
                                  items: [
                                    {
                                      offset: 0xd,
                                      type: "variable",
                                      dataType: "uint16",
                                      max: 999,
                                    },
                                    {
                                      offset: 0xf,
                                      type: "variable",
                                      dataType: "uint16",
                                      max: 999,
                                      binary: {
                                        bitStart: 0,
                                        bitLength: 14,
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
                                  id: "cross-vigor",
                                  name: "Vigor",
                                  offset: 0x1a,
                                  type: "variable",
                                  dataType: "uint8",
                                  max: 128,
                                },
                                {
                                  name: "Speed",
                                  offset: 0x1b,
                                  type: "variable",
                                  dataType: "uint8",
                                  max: 128,
                                },
                                {
                                  name: "Stamina",
                                  offset: 0x1c,
                                  type: "variable",
                                  dataType: "uint8",
                                  max: 128,
                                },
                                {
                                  id: "cross-magicPower",
                                  name: "Magic Power",
                                  offset: 0x1d,
                                  type: "variable",
                                  dataType: "uint8",
                                  max: 128,
                                },
                              ],
                            },
                            {
                              name: "Abilities",
                              type: "section",
                              flex: true,
                              items: [
                                {
                                  name: "Ability 1",
                                  offset: 0x16,
                                  type: "variable",
                                  dataType: "uint8",
                                  resource: "abilities",
                                  autocomplete: true,
                                },
                                {
                                  name: "Ability 2",
                                  offset: 0x17,
                                  type: "variable",
                                  dataType: "uint8",
                                  resource: "abilities",
                                  autocomplete: true,
                                },
                                {
                                  name: "Ability 3",
                                  offset: 0x18,
                                  type: "variable",
                                  dataType: "uint8",
                                  resource: "abilities",
                                  autocomplete: true,
                                },
                                {
                                  name: "Ability 4",
                                  offset: 0x19,
                                  type: "variable",
                                  dataType: "uint8",
                                  resource: "abilities",
                                  autocomplete: true,
                                },
                              ],
                            },
                            {
                              name: "Condition",
                              type: "bitflags",
                              flags: [
                                { offset: 0x14, bit: 0, label: "Dark" },
                                { offset: 0x14, bit: 1, label: "Zombie" },
                                { offset: 0x14, bit: 2, label: "Poison" },
                                { offset: 0x14, bit: 3, label: "???", hidden: true },
                                { offset: 0x14, bit: 4, label: "Clear" },
                                { offset: 0x14, bit: 5, label: "Imp" },
                                { offset: 0x14, bit: 6, label: "Petrify" },
                                { offset: 0x14, bit: 7, label: "Wounded", separator: true },
                                { offset: 0x15, bit: 0, label: "???", hidden: true },
                                { offset: 0x15, bit: 1, label: "???", hidden: true },
                                { offset: 0x15, bit: 2, label: "???", hidden: true },
                                { offset: 0x15, bit: 3, label: "???", hidden: true },
                                { offset: 0x15, bit: 4, label: "???", hidden: true },
                                { offset: 0x15, bit: 5, label: "???", hidden: true },
                                { offset: 0x15, bit: 6, label: "???", hidden: true },
                                { offset: 0x15, bit: 7, label: "Float" },
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
                                  name: "Right Hand",
                                  offset: 0x1f,
                                  type: "variable",
                                  dataType: "uint8",
                                  resource: "hands",
                                  autocomplete: true,
                                },
                                {
                                  name: "Left Hand",
                                  offset: 0x20,
                                  type: "variable",
                                  dataType: "uint8",
                                  resource: "hands",
                                  autocomplete: true,
                                },
                                {
                                  name: "Head",
                                  offset: 0x21,
                                  type: "variable",
                                  dataType: "uint8",
                                  resource: "heads",
                                  autocomplete: true,
                                },
                                {
                                  name: "Body",
                                  offset: 0x22,
                                  type: "variable",
                                  dataType: "uint8",
                                  resource: "bodies",
                                  autocomplete: true,
                                },
                              ],
                            },
                            {
                              type: "section",
                              flex: true,
                              items: [
                                {
                                  name: "Relic 1",
                                  offset: 0x23,
                                  type: "variable",
                                  dataType: "uint8",
                                  resource: "relics",
                                  autocomplete: true,
                                },
                                {
                                  name: "Relic 2",
                                  offset: 0x24,
                                  type: "variable",
                                  dataType: "uint8",
                                  resource: "relics",
                                  autocomplete: true,
                                },
                              ],
                            },
                            {
                              name: "Esper",
                              offset: 0x1e,
                              type: "variable",
                              dataType: "uint8",
                              resource: "espers",
                              autocomplete: true,
                            },
                          ],
                        },
                        {
                          id: "magic",
                          name: "Magic",
                          items: [
                            {
                              name: "Dummy",
                              offset: 0x46e,
                              type: "variable",
                              dataType: "uint8",
                              max: 100,
                              overrideShift: {
                                parent: 1,
                                shift: 0x0,
                              },
                              suffix: "%",
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
                  id: "inventory",
                  type: "tabs",
                  vertical: true,
                  items: [
                    {
                      name: "Dummy",
                      items: [
                        {
                          name: "Dummy",
                          offset: 0x369,
                          type: "variable",
                          dataType: "uint8",
                          max: 99,
                          test: true,
                        },
                      ],
                    },
                    {
                      id: "bitflags-rareItems",
                      name: "Rare",
                      items: [
                        {
                          type: "bitflags",
                          flags: [{ offset: 0x8ba, bit: 0, label: "Dummy" }],
                        },
                      ],
                    },
                  ],
                },
              ],
            },
            {
              id: "cross-skills",
              name: "Skills",
              items: [
                {
                  type: "tabs",
                  vertical: true,
                  items: [
                    {
                      id: "bitflags-espers",
                      name: "Espers",
                      flex: true,
                      items: [
                        {
                          type: "bitflags",
                          flags: [{ offset: 0x469, bit: 0, label: "Dummy" }],
                        },
                      ],
                    },
                    {
                      id: "bitflags-swordTechs",
                      name: "Sword Tech",
                      items: [
                        {
                          type: "bitflags",
                          flags: [{ offset: 0x6f7, bit: 0, label: "Dummy" }],
                        },
                      ],
                    },
                    {
                      id: "bitflags-blitz",
                      name: "Blitz",
                      items: [
                        {
                          type: "bitflags",
                          flags: [{ offset: 0x728, bit: 0, label: "Dummy" }],
                        },
                      ],
                    },
                    {
                      id: "bitflags-lores",
                      name: "Lore",
                      flex: true,
                      items: [
                        {
                          type: "bitflags",
                          flags: [{ offset: 0x729, bit: 0, label: "Dummy" }],
                        },
                      ],
                    },
                    {
                      id: "bitflags-enemies",
                      name: "Rage",
                      flex: true,
                      items: [
                        {
                          type: "bitflags",
                          flags: [{ offset: 0x72c, bit: 0, label: "Dummy" }],
                        },
                      ],
                    },
                    {
                      id: "bitflags-dances",
                      name: "Dance",
                      items: [
                        {
                          type: "bitflags",
                          flags: [{ offset: 0x74c, bit: 0, label: "Dummy" }],
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
              hidden: true,
              items: [
                {
                  name: "Dummy",
                  offset: 0x2c00,
                  type: "variable",
                  dataType: "uint16",
                  max: 999,
                  binary: {
                    bitStart: 0x0,
                    bitLength: 15,
                  },
                  overrideShift: {
                    parent: 1,
                    shift: 0x400,
                  },
                  test: true,
                },
              ],
            },
            {
              name: "Config",
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
                              name: "Battle Mode",
                              offset: 0x74d,
                              type: "variable",
                              dataType: "bit",
                              bit: 3,
                              resource: "battleModes",
                            },
                            {
                              name: "Battle Speed",
                              offset: 0x74d,
                              type: "variable",
                              dataType: "uint8",
                              binary: { bitStart: 0, bitLength: 3 },
                              operations: [{ "+": 1 }],
                              min: 1,
                              max: 6,
                            },
                            {
                              name: "Message Speed",
                              offset: 0x74d,
                              type: "variable",
                              dataType: "uint8",
                              binary: { bitStart: 4, bitLength: 3 },
                              operations: [{ "+": 1 }],
                              min: 1,
                              max: 6,
                            },
                          ],
                        },
                        {
                          type: "section",
                          flex: true,
                          items: [
                            {
                              name: "Command Settings",
                              offset: 0x74d,
                              type: "variable",
                              dataType: "bit",
                              bit: 7,
                              resource: "commandSettings",
                            },
                            {
                              name: "ATB Gauge",
                              offset: 0x74e,
                              type: "variable",
                              dataType: "bit",
                              bit: 7,
                              resource: "optionBooleanReversed",
                            },
                            {
                              id: "snesOnly",
                              name: "Sound",
                              offset: 0x74e,
                              type: "variable",
                              dataType: "bit",
                              bit: 5,
                              resource: "sounds",
                            },
                            {
                              name: "Cursor Position",
                              offset: 0x74e,
                              type: "variable",
                              dataType: "bit",
                              bit: 6,
                              resource: "cursorPositions",
                            },
                            {
                              id: "gbaOnly",
                              name: "Auto-Dash",
                              offset: 0x2008,
                              type: "variable",
                              dataType: "uint8",
                              resource: "optionBooleanReversed",
                              overrideShift: {
                                parent: -1,
                                shift: 0x400,
                              },
                            },
                          ],
                        },
                        {
                          type: "section",
                          flex: true,
                          items: [
                            {
                              id: "europeOnly",
                              name: "Language",
                              offset: 0x2009,
                              type: "variable",
                              dataType: "uint8",
                              resource: "languages",
                              overrideShift: {
                                parent: -1,
                                shift: 0x400,
                              },
                            },
                            {
                              name: "Reequip",
                              offset: 0x74e,
                              type: "variable",
                              dataType: "bit",
                              bit: 4,
                              resource: "reequips",
                            },
                            {
                              id: "snesOnly",
                              name: "Controller",
                              offset: 0x754,
                              type: "variable",
                              dataType: "bit",
                              bit: 7,
                              resource: "controllers",
                            },
                            {
                              name: "Magic Order",
                              offset: 0x754,
                              type: "variable",
                              dataType: "uint8",
                              binary: { bitStart: 0, bitLength: 3 },
                              operations: [{ "+": 1 }],
                              min: 1,
                              max: 6,
                            },
                            {
                              name: "Window Pattern",
                              offset: 0x74e,
                              type: "variable",
                              dataType: "uint8",
                              binary: { bitStart: 0, bitLength: 3 },
                              operations: [{ "+": 1 }],
                              min: 1,
                              max: 8,
                            },
                          ],
                        },
                        {
                          type: "section",
                          flex: true,
                          items: [
                            {
                              name: "Font Color",
                              type: "section",
                              flex: true,
                              items: [
                                {
                                  name: "Red",
                                  offset: 0x755,
                                  type: "variable",
                                  dataType: "uint16",
                                  binary: { bitStart: 0, bitLength: 5 },
                                },
                                {
                                  name: "Green",
                                  offset: 0x755,
                                  type: "variable",
                                  dataType: "uint16",
                                  binary: { bitStart: 5, bitLength: 5 },
                                },
                                {
                                  name: "Blue",
                                  offset: 0x755,
                                  type: "variable",
                                  dataType: "uint16",
                                  binary: { bitStart: 10, bitLength: 5 },
                                },
                              ],
                            },
                          ],
                        },
                      ],
                    },
                    {
                      name: "Window Color",
                      items: [
                        {
                          name: "Window Color Index",
                          offset: 0x754,
                          type: "variable",
                          dataType: "uint8",
                          binary: { bitStart: 3, bitLength: 3 },
                          hidden: true,
                        },
                        {
                          length: 0xe,
                          type: "container",
                          instanceType: "tabs",
                          instances: 8,
                          enumeration: "Window %d",
                          vertical: true,
                          items: [
                            {
                              length: 0x2,
                              type: "container",
                              instanceType: "section",
                              instances: 7,
                              enumeration: "Color %d",
                              flex: true,
                              items: [
                                {
                                  name: "Red",
                                  offset: 0x757,
                                  type: "variable",
                                  dataType: "uint16",
                                  binary: { bitStart: 0, bitLength: 5 },
                                },
                                {
                                  name: "Green",
                                  offset: 0x757,
                                  type: "variable",
                                  dataType: "uint16",
                                  binary: { bitStart: 5, bitLength: 5 },
                                },
                                {
                                  name: "Blue",
                                  offset: 0x757,
                                  type: "variable",
                                  dataType: "uint16",
                                  binary: { bitStart: 10, bitLength: 5 },
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
  ],
  resources: {
    abilities: {},
    battleModes: {
      0x0: "Active",
      0x1: "Wait",
    },
    bodies: {},
    booleanEnabled: {
      0x0: "-",
      0x1: "Enabled",
    },
    characterNames: "getCharacterNames()",
    characters: {},
    commandSettings: {},
    controllers: {
      0x0: "Single",
      0x1: "Multiple",
    },
    cursorPositions: {},
    espers: {},
    groups: {
      0x0: "-",
      0x1: "Group 1",
      0x2: "Group 2",
      0x3: "Group 3",
    },
    hands: {},
    heads: {},
    languages: {
      0x0: "English",
      0x1: "German",
      0x2: "French",
      0x3: "Italian",
      0x4: "Spanish",
    },
    letters: {},
    locations: {},
    optionBooleanReversed: {
      0x0: "On",
      0x1: "Off",
    },
    progressions: {
      0x0: "-",
      0x1: "Game Complete",
    },
    reequips: {},
    relics: {},
    sounds: {
      0x0: "Stereo",
      0x1: "Mono",
    },
  },
  resourcesGroups: {
    hands: [],
    locations: [],
  },
  resourcesOrder: {
    abilities: [0xff],
    bodies: [0xff],
    characters: [0xff],
    espers: [],
    hands: [0xff],
    heads: [0xff],
    locations: [],
    relics: [0xff],
  },
};

export default template;
