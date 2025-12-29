import { bitToOffset } from "$lib/utils/bytes";

import type { GameJson } from "$lib/types";

import {
  books,
  charlotteAccessories,
  charlotteBodies,
  charlotteHeads,
  charlotteLegs,
  dualCrushes,
  enemies,
  inventory,
  items,
  itemsGroups,
  itemsOrder,
  jonathanAccessories,
  jonathanBodies,
  jonathanHeads,
  jonathanLegs,
  magics,
  quests,
  skills,
  subweapons,
  subweaponsOrder,
  weapons,
  weaponsOrder,
} from "./utils/resource";

const template: GameJson = {
  validator: {
    regions: {
      europe: {
        0x0: [0x64, 0x75, 0xa3, 0x08],
      },
      usa: {
        0x0: [0x64, 0x75, 0xa3, 0x08],
      },
      japan: {
        0x0: [0x64, 0x75, 0xa3, 0x08],
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
          id: "checksum-0",
          name: "Checksum System",
          offset: 0xe000,
          type: "checksum",
          dataType: "uint32",
          bigEndian: true,
          control: {
            offsetStart: 0x0,
            offsetEnd: 0x2dc,
          },
        },
        {
          id: "checksum-1",
          name: "Checksum System",
          offset: 0xe004,
          type: "checksum",
          dataType: "uint32",
          bigEndian: true,
          control: {
            offsetStart: 0x0,
            offsetEnd: 0x2dc,
          },
        },
        {
          id: "checksum-2",
          name: "Checksum System",
          offset: 0xe008,
          type: "checksum",
          dataType: "uint32",
          bigEndian: true,
          control: {
            offsetStart: 0x0,
            offsetEnd: 0x2dc,
          },
        },
        {
          id: "checksum-3",
          name: "Checksum System",
          offset: 0xe00c,
          type: "checksum",
          dataType: "uint32",
          bigEndian: true,
          control: {
            offsetStart: 0x0,
            offsetEnd: 0x2dc,
          },
        },
        {
          id: "checksum-4",
          name: "Checksum System",
          offset: 0xe010,
          type: "checksum",
          dataType: "uint32",
          bigEndian: true,
          control: {
            offsetStart: 0x0,
            offsetEnd: 0x2dc,
          },
        },
      ],
    },
    {
      id: "slots",
      length: 0x1800,
      type: "container",
      instanceType: "tabs",
      instances: 6,
      enumeration: "Slot %d",
      prependSubinstance: [
        {
          name: "General",
          items: [
            {
              id: "language",
              name: "Language",
              offset: 0x12,
              type: "variable",
              dataType: "uint8",
              resource: "languages",
            },
            {
              id: "unlockedModes",
              name: "Unlocked Modes",
              type: "bitflags",
              flags: [
                { offset: 0x11, bit: 0, label: "???", hidden: true },
                { offset: 0x11, bit: 1, label: "Richter Mode" },
                { offset: 0x11, bit: 2, label: "Sisters Mode" },
                { offset: 0x11, bit: 3, label: "Old Axe Armor Mode", separator: true },
                { offset: 0x11, bit: 6, label: "Hard Mode" },
                { offset: 0x11, bit: 4, label: "Sound Mode" },
                { offset: 0x11, bit: 5, label: "???", hidden: true },
                { offset: 0x11, bit: 7, label: "???", hidden: true },
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
              id: "checksum-0",
              name: "Checksum",
              offset: 0xe020,
              type: "checksum",
              dataType: "uint32",
              bigEndian: true,
              control: {
                offsetStart: 0x3800,
                offsetEnd: 0x44e9,
              },
              overrideShift: {
                parent: 1,
                shift: 0x20,
              },
            },
            {
              id: "checksum-1",
              name: "Checksum",
              offset: 0xe024,
              type: "checksum",
              dataType: "uint32",
              bigEndian: true,
              control: {
                offsetStart: 0x3800,
                offsetEnd: 0x44e9,
              },
              overrideShift: {
                parent: 1,
                shift: 0x20,
              },
            },
            {
              id: "checksum-2",
              name: "Checksum",
              offset: 0xe028,
              type: "checksum",
              dataType: "uint32",
              bigEndian: true,
              control: {
                offsetStart: 0x3800,
                offsetEnd: 0x44e9,
              },
              overrideShift: {
                parent: 1,
                shift: 0x20,
              },
            },
            {
              id: "checksum-3",
              name: "Checksum",
              offset: 0xe02c,
              type: "checksum",
              dataType: "uint32",
              bigEndian: true,
              control: {
                offsetStart: 0x3800,
                offsetEnd: 0x44e9,
              },
              overrideShift: {
                parent: 1,
                shift: 0x20,
              },
            },
            {
              id: "checksum-4",
              name: "Checksum",
              offset: 0xe030,
              type: "checksum",
              dataType: "uint32",
              bigEndian: true,
              control: {
                offsetStart: 0x3800,
                offsetEnd: 0x44e9,
              },
              overrideShift: {
                parent: 1,
                shift: 0x20,
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
                              name: "Filename",
                              offset: 0x18,
                              length: 0x8,
                              type: "variable",
                              dataType: "string",
                              letterDataType: "uint8",
                              fallback: 0x39,
                              resource: "letters",
                              overrideShift: {
                                parent: 1,
                                shift: 0x28,
                              },
                              test: true,
                            },
                            {
                              id: "difficulty-%index%",
                              name: "Difficulty",
                              offset: 0x3f3a,
                              type: "variable",
                              dataType: "uint8",
                              resource: "difficulties",
                            },
                            {
                              name: "Difficulty (Save Preview)",
                              offset: 0x17,
                              type: "variable",
                              dataType: "uint8",
                              overrideShift: {
                                parent: 1,
                                shift: 0x28,
                              },
                              hidden: true,
                            },
                            {
                              name: "Progression",
                              offset: 0x15,
                              type: "variable",
                              dataType: "bit",
                              bit: 0,
                              resource: "progressions",
                              overrideShift: {
                                parent: 1,
                                shift: 0x28,
                              },
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
                                  offset: 0x28,
                                  type: "variable",
                                  dataType: "uint32",
                                  operations: [
                                    { "/": 60 },
                                    {
                                      convert: { from: "seconds", to: "hours" },
                                    },
                                  ],
                                  overrideShift: {
                                    parent: 1,
                                    shift: 0x28,
                                  },
                                  leadingZeros: 1,
                                  max: 99,
                                },
                                {
                                  offset: 0x28,
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
                                  overrideShift: {
                                    parent: 1,
                                    shift: 0x28,
                                  },
                                  leadingZeros: 1,
                                  max: 59,
                                },
                                {
                                  offset: 0x28,
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
                                  overrideShift: {
                                    parent: 1,
                                    shift: 0x28,
                                  },
                                  leadingZeros: 1,
                                  max: 59,
                                },
                              ],
                            },
                            {
                              name: "Map Discovery Rate",
                              offset: 0x24,
                              type: "variable",
                              dataType: "uint16",
                              operations: [{ "/": 10 }],
                              overrideShift: {
                                parent: 1,
                                shift: 0x28,
                              },
                              suffix: "%",
                              disabled: true,
                            },
                          ],
                        },
                        {
                          type: "section",
                          flex: true,
                          items: [
                            {
                              id: "location-%index%",
                              name: "Location",
                              offset: 0x3a16,
                              type: "variable",
                              dataType: "uint24",
                              bigEndian: true,
                              resource: "locations",
                              size: "lg",
                              autocomplete: true,
                            },
                            {
                              name: "Location (Save Preview)",
                              offset: 0x20,
                              type: "variable",
                              dataType: "uint16",
                              bigEndian: true,
                              hex: true,
                              overrideShift: {
                                parent: 1,
                                shift: 0x28,
                              },
                              hidden: true,
                            },
                            {
                              id: "gold-%index%",
                              name: "Gold",
                              offset: 0x3fad,
                              type: "variable",
                              dataType: "uint32",
                              max: 99999999,
                              test: true,
                            },
                            {
                              name: "Gold (Save Preview)",
                              offset: 0x30,
                              type: "variable",
                              dataType: "uint32",
                              overrideShift: {
                                parent: 1,
                                shift: 0x28,
                              },
                              hidden: true,
                            },
                          ],
                        },
                        {
                          type: "section",
                          flex: true,
                          hidden: true,
                          items: [
                            {
                              name: "Is Copy",
                              offset: 0x14,
                              type: "variable",
                              dataType: "uint8",
                              overrideShift: {
                                parent: 1,
                                shift: 0x28,
                              },
                              hidden: true,
                            },
                            {
                              name: "Emblem Color",
                              offset: 0x23,
                              type: "variable",
                              dataType: "uint8",
                              overrideShift: {
                                parent: 1,
                                shift: 0x28,
                              },
                              hidden: true,
                            },
                            {
                              name: "Position X",
                              offset: 0x3a28,
                              type: "variable",
                              dataType: "uint32",
                              hidden: true,
                            },
                            {
                              name: "Position Y",
                              offset: 0x3a2c,
                              type: "variable",
                              dataType: "uint32",
                              hidden: true,
                            },
                          ],
                        },
                      ],
                    },
                    {
                      name: "Item Display",
                      flex: true,
                      items: [
                        {
                          name: "Slot 1",
                          offset: 0x3d4b,
                          type: "variable",
                          dataType: "uint16",
                          resource: "items",
                          autocomplete: true,
                        },
                        {
                          name: "Slot 2",
                          offset: 0x3d4d,
                          type: "variable",
                          dataType: "uint16",
                          resource: "items",
                          autocomplete: true,
                        },
                        {
                          name: "Slot 3",
                          offset: 0x3d4f,
                          type: "variable",
                          dataType: "uint16",
                          resource: "items",
                          autocomplete: true,
                        },
                        {
                          name: "Slot 4",
                          offset: 0x3d51,
                          type: "variable",
                          dataType: "uint16",
                          resource: "items",
                          autocomplete: true,
                        },
                        {
                          name: "Slot 5",
                          offset: 0x3d53,
                          type: "variable",
                          dataType: "uint16",
                          resource: "items",
                          autocomplete: true,
                        },
                        {
                          name: "Slot 6",
                          offset: 0x3d55,
                          type: "variable",
                          dataType: "uint16",
                          resource: "items",
                          autocomplete: true,
                        },
                        {
                          name: "Slot 7",
                          offset: 0x3d57,
                          type: "variable",
                          dataType: "uint16",
                          resource: "items",
                          autocomplete: true,
                        },
                        {
                          name: "Slot 8",
                          offset: 0x3d59,
                          type: "variable",
                          dataType: "uint16",
                          resource: "items",
                          autocomplete: true,
                        },
                      ],
                    },
                    {
                      name: "Warp Rooms",
                      items: [
                        {
                          type: "tabs",
                          vertical: true,
                          items: [
                            {
                              name: "Dracula's Castle",
                              items: [
                                {
                                  id: "rooms",
                                  type: "bitflags",
                                  flags: [
                                    { offset: 0x384e, bit: 6, label: "Entrance" },
                                    { offset: 0x384e, bit: 7, label: "Entrance", hidden: true },
                                    { offset: 0x3873, bit: 2, label: "Entrance: near Nest of Evil", separator: true },
                                    { offset: 0x3873, bit: 3, label: "Entrance: near Nest of Evil", hidden: true },
                                    { offset: 0x3878, bit: 4, label: "Buried Chamber", separator: true },
                                    { offset: 0x3878, bit: 5, label: "Buried Chamber", hidden: true },
                                    { offset: 0x3865, bit: 2, label: "Great Stairway: near Buried Chamber" },
                                    { offset: 0x3865, bit: 3, label: "Great Stairway: near Buried Chamber", hidden: true },
                                    { offset: 0x3869, bit: 4, label: "Great Stairway: near Sandy Grave" },
                                    { offset: 0x3869, bit: 5, label: "Great Stairway: near Sandy Grave", hidden: true },
                                    { offset: 0x3832, bit: 4, label: "Great Stairway: near Nation of Fools" },
                                    { offset: 0x3832, bit: 5, label: "Great Stairway: near Nation of Fools", hidden: true },
                                    { offset: 0x383b, bit: 0, label: "Great Stairway: near Tower of Death", separator: true },
                                    { offset: 0x383b, bit: 1, label: "Great Stairway: near Tower of Death", hidden: true },
                                    { offset: 0x3812, bit: 4, label: "Tower of Death: near Forest of Doom" },
                                    { offset: 0x3812, bit: 5, label: "Tower of Death: near Forest of Doom", hidden: true },
                                    { offset: 0x3830, bit: 4, label: "Tower of Death: near Stella" },
                                    { offset: 0x3830, bit: 5, label: "Tower of Death: near Stella", hidden: true },
                                    { offset: 0x380a, bit: 6, label: "Tower of Death: near Death", separator: true },
                                    { offset: 0x380a, bit: 7, label: "Tower of Death: near Death", hidden: true },
                                    { offset: 0x3818, bit: 6, label: "Master's Keep: near Tower of Death" },
                                    { offset: 0x3818, bit: 7, label: "Master's Keep: near Tower of Death", hidden: true },
                                    { offset: 0x3809, bit: 6, label: "Master's Keep: near Brauner" },
                                    { offset: 0x3809, bit: 7, label: "Master's Keep: near Brauner", hidden: true },
                                  ],
                                },
                              ],
                            },
                            {
                              name: "City of Haze",
                              items: [
                                {
                                  id: "rooms",
                                  type: "bitflags",
                                  flags: [
                                    { offset: 0x3924, bit: 2, label: "Near Portrait" },
                                    { offset: 0x3924, bit: 3, label: "Near Portrait", hidden: true },
                                    { offset: 0x3921, bit: 4, label: "Before the tunnel" },
                                    { offset: 0x3921, bit: 5, label: "Before the tunnel", hidden: true },
                                    { offset: 0x3934, bit: 4, label: "After the tunnel" },
                                    { offset: 0x3934, bit: 5, label: "After the tunnel", hidden: true },
                                    { offset: 0x3935, bit: 2, label: "Near Dullahan" },
                                    { offset: 0x3935, bit: 3, label: "Near Dullahan", hidden: true },
                                  ],
                                },
                              ],
                            },
                            {
                              name: "Sandy Grave",
                              items: [
                                {
                                  id: "rooms",
                                  type: "bitflags",
                                  flags: [
                                    { offset: 0x397a, bit: 0, label: "Near Portrait" },
                                    { offset: 0x397a, bit: 1, label: "Near Portrait", hidden: true },
                                    { offset: 0x3972, bit: 6, label: "At the middle" },
                                    { offset: 0x3972, bit: 7, label: "At the middle", hidden: true },
                                    { offset: 0x398c, bit: 2, label: "At the bottom" },
                                    { offset: 0x398c, bit: 3, label: "At the bottom", hidden: true },
                                    { offset: 0x3966, bit: 6, label: "Near Astarte" },
                                    { offset: 0x3966, bit: 7, label: "Near Astarte", hidden: true },
                                  ],
                                },
                              ],
                            },
                            {
                              name: "Nation of Fools",
                              items: [
                                {
                                  id: "rooms",
                                  type: "bitflags",
                                  flags: [
                                    { offset: 0x38a8, bit: 6, label: "Near Portrait" },
                                    { offset: 0x38a8, bit: 7, label: "Near Portrait", hidden: true },
                                    { offset: 0x387e, bit: 4, label: "At the top" },
                                    { offset: 0x387e, bit: 5, label: "At the top", hidden: true },
                                    { offset: 0x3890, bit: 4, label: "Near Legion" },
                                    { offset: 0x3890, bit: 5, label: "Near Legion", hidden: true },
                                  ],
                                },
                              ],
                            },
                            {
                              name: "Forest of Doom",
                              items: [
                                {
                                  id: "rooms",
                                  type: "bitflags",
                                  flags: [
                                    { offset: 0x38ec, bit: 2, label: "Near Portrait" },
                                    { offset: 0x38ec, bit: 3, label: "Near Portrait", hidden: true },
                                    { offset: 0x38ea, bit: 4, label: "At the middle" },
                                    { offset: 0x38ea, bit: 5, label: "At the middle", hidden: true },
                                    { offset: 0x38f6, bit: 6, label: "Near Dagon" },
                                    { offset: 0x38f6, bit: 7, label: "Near Dagon", hidden: true },
                                  ],
                                },
                              ],
                            },
                            {
                              name: "13th Street",
                              items: [
                                {
                                  id: "rooms",
                                  type: "bitflags",
                                  flags: [
                                    { offset: 0x3962, bit: 0, label: "Near Portrait" },
                                    { offset: 0x3962, bit: 1, label: "Near Portrait", hidden: true },
                                    { offset: 0x3952, bit: 4, label: "At the middle" },
                                    { offset: 0x3952, bit: 5, label: "At the middle", hidden: true },
                                    { offset: 0x3957, bit: 0, label: "Near Werewolf" },
                                    { offset: 0x3957, bit: 1, label: "Near Werewolf", hidden: true },
                                  ],
                                },
                              ],
                            },
                            {
                              name: "Forgotten City",
                              items: [
                                {
                                  id: "rooms",
                                  type: "bitflags",
                                  flags: [
                                    { offset: 0x3993, bit: 2, label: "Near Portrait" },
                                    { offset: 0x3993, bit: 3, label: "Near Portrait", hidden: true },
                                    { offset: 0x3996, bit: 6, label: "Below the wormhole" },
                                    { offset: 0x3996, bit: 7, label: "Below the wormhole", hidden: true },
                                    { offset: 0x39b9, bit: 2, label: "At the bottom" },
                                    { offset: 0x39b9, bit: 3, label: "At the bottom", hidden: true },
                                    { offset: 0x39a2, bit: 6, label: "Near Mummy Man" },
                                    { offset: 0x39a2, bit: 7, label: "Near Mummy Man", hidden: true },
                                  ],
                                },
                              ],
                            },
                            {
                              name: "Burnt Paradise",
                              items: [
                                {
                                  id: "rooms",
                                  type: "bitflags",
                                  flags: [
                                    { offset: 0x38b1, bit: 2, label: "Near Portrait" },
                                    { offset: 0x38b1, bit: 3, label: "Near Portrait", hidden: true },
                                    { offset: 0x38d6, bit: 4, label: "Near Medusa" },
                                    { offset: 0x38d6, bit: 5, label: "Near Medusa", hidden: true },
                                  ],
                                },
                              ],
                            },
                            {
                              name: "Dark Academy",
                              items: [
                                {
                                  id: "rooms",
                                  type: "bitflags",
                                  flags: [
                                    { offset: 0x3912, bit: 4, label: "Near Portrait" },
                                    { offset: 0x3912, bit: 5, label: "Near Portrait", hidden: true },
                                    { offset: 0x3905, bit: 2, label: "At the middle" },
                                    { offset: 0x3905, bit: 3, label: "At the middle", hidden: true },
                                  ],
                                },
                              ],
                            },
                            {
                              name: "Nest of Evil",
                              items: [
                                {
                                  id: "rooms",
                                  type: "bitflags",
                                  flags: [
                                    { offset: 0x39bb, bit: 0, label: "Near Portrait" },
                                    { offset: 0x39bb, bit: 1, label: "Near Portrait", hidden: true },
                                    { offset: 0x39bf, bit: 6, label: "B2" },
                                    { offset: 0x39bf, bit: 7, label: "B2", hidden: true },
                                    { offset: 0x39c4, bit: 4, label: "B3" },
                                    { offset: 0x39c4, bit: 5, label: "B3", hidden: true },
                                    { offset: 0x39c9, bit: 2, label: "B4" },
                                    { offset: 0x39c9, bit: 3, label: "B4", hidden: true },
                                    { offset: 0x39ce, bit: 0, label: "B5" },
                                    { offset: 0x39ce, bit: 1, label: "B5", hidden: true },
                                    { offset: 0x39d2, bit: 6, label: "B6" },
                                    { offset: 0x39d2, bit: 7, label: "B6", hidden: true },
                                    { offset: 0x39d7, bit: 2, label: "Near Doppelganger" },
                                    { offset: 0x39d7, bit: 3, label: "Near Doppelganger", hidden: true },
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
              name: "Status",
              items: [
                {
                  type: "section",
                  flex: true,
                  items: [
                    {
                      name: "Character",
                      offset: 0x16,
                      type: "variable",
                      dataType: "uint8",
                      resource: "characters",
                      overrideShift: {
                        parent: 1,
                        shift: 0x28,
                      },
                      disabled: true,
                    },
                    {
                      name: "Level",
                      type: "group",
                      mode: "fraction",
                      items: [
                        {
                          id: "level-%index%",
                          offset: 0x3f51,
                          type: "variable",
                          dataType: "uint8",
                          min: 1,
                        },
                        {
                          id: "maxLevel-%index%",
                          offset: 0x3f40,
                          type: "variable",
                          dataType: "uint8",
                          resource: "levels",
                        },
                      ],
                    },
                    {
                      name: "Level (Save Preview)",
                      offset: 0x22,
                      type: "variable",
                      dataType: "uint8",
                      overrideShift: {
                        parent: 1,
                        shift: 0x28,
                      },
                      hidden: true,
                    },
                    {
                      name: "Max Level (Save Preview)",
                      offset: 0x26,
                      type: "variable",
                      dataType: "uint8",
                      overrideShift: {
                        parent: 1,
                        shift: 0x28,
                      },
                      hidden: true,
                    },
                    {
                      id: "experience-%index%",
                      name: "Experience",
                      offset: 0x3fa9,
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
                      offset: 0x3f55,
                      type: "variable",
                      dataType: "uint16",
                      min: 1,
                      max: 9999,
                    },
                    {
                      name: "Max HP",
                      offset: 0x3f57,
                      type: "variable",
                      dataType: "uint16",
                      hidden: true,
                    },
                    {
                      name: "Bonus HP",
                      offset: 0x3f41,
                      type: "variable",
                      dataType: "uint16",
                      max: 480,
                    },
                    {
                      name: "MP",
                      offset: 0x3f59,
                      type: "variable",
                      dataType: "uint16",
                      max: 9999,
                    },
                    {
                      name: "Max MP",
                      offset: 0x3f5b,
                      type: "variable",
                      dataType: "uint16",
                      hidden: true,
                    },
                    {
                      name: "Bonus MP",
                      offset: 0x3f43,
                      type: "variable",
                      dataType: "uint16",
                      max: 320,
                    },
                  ],
                },
              ],
            },
            {
              name: "Equipment",
              items: [
                {
                  name: "Jonathan Morris",
                  type: "section",
                  flex: true,
                  items: [
                    {
                      name: "Weapon",
                      offset: 0x3f65,
                      type: "variable",
                      dataType: "uint16",
                      resource: "weapons",
                      autocomplete: true,
                    },
                    {
                      name: "Subweapon",
                      offset: 0x3f67,
                      type: "variable",
                      dataType: "uint16",
                      resource: "subweapons",
                      autocomplete: true,
                    },
                    {
                      name: "Body",
                      offset: 0x3f69,
                      type: "variable",
                      dataType: "uint16",
                      resource: "jonathanBodies",
                      autocomplete: true,
                    },
                    {
                      name: "Head",
                      offset: 0x3f6b,
                      type: "variable",
                      dataType: "uint16",
                      resource: "jonathanHeads",
                      autocomplete: true,
                    },
                    {
                      name: "Legs",
                      offset: 0x3f6d,
                      type: "variable",
                      dataType: "uint16",
                      resource: "jonathanLegs",
                      autocomplete: true,
                    },
                    {
                      name: "Accessory 1",
                      offset: 0x3f6f,
                      type: "variable",
                      dataType: "uint16",
                      resource: "jonathanAccessories",
                      autocomplete: true,
                    },
                    {
                      name: "Accessory 2",
                      offset: 0x3f71,
                      type: "variable",
                      dataType: "uint16",
                      resource: "jonathanAccessories",
                      autocomplete: true,
                    },
                    {
                      name: "Dual Crush",
                      offset: 0x3f73,
                      type: "variable",
                      dataType: "uint16",
                      resource: "dualCrushes",
                      autocomplete: true,
                    },
                  ],
                },
                {
                  name: "Charlotte Aulin",
                  type: "section",
                  flex: true,
                  items: [
                    {
                      name: "Weapon",
                      offset: 0x3fd1,
                      type: "variable",
                      dataType: "uint16",
                      resource: "books",
                      autocomplete: true,
                    },
                    {
                      name: "Magic",
                      offset: 0x3fd3,
                      type: "variable",
                      dataType: "uint16",
                      resource: "magics",
                      autocomplete: true,
                    },
                    {
                      name: "Body",
                      offset: 0x3fd5,
                      type: "variable",
                      dataType: "uint16",
                      resource: "charlotteBodies",
                      autocomplete: true,
                    },
                    {
                      name: "Head",
                      offset: 0x3fd7,
                      type: "variable",
                      dataType: "uint16",
                      resource: "charlotteHeads",
                      autocomplete: true,
                    },
                    {
                      name: "Legs",
                      offset: 0x3fd9,
                      type: "variable",
                      dataType: "uint16",
                      resource: "charlotteLegs",
                      autocomplete: true,
                    },
                    {
                      name: "Accessory 1",
                      offset: 0x3fdb,
                      type: "variable",
                      dataType: "uint16",
                      resource: "charlotteAccessories",
                      autocomplete: true,
                    },
                    {
                      name: "Accessory 2",
                      offset: 0x3fdd,
                      type: "variable",
                      dataType: "uint16",
                      resource: "charlotteAccessories",
                      autocomplete: true,
                    },
                    {
                      name: "Dual Crush",
                      offset: 0x3fdf,
                      type: "variable",
                      dataType: "uint16",
                      resource: "dualCrushes",
                      autocomplete: true,
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
                      offset: 0x3a51 + Math.floor(item.index / 0x2),
                      type: "variable",
                      dataType: item.index % 2 === 0 ? "lower4" : "upper4",
                      max: 9,
                    })),
                  })),
                },
              ],
            },
            {
              name: "Relics",
              flex: true,
              items: [
                {
                  id: "relics",
                  name: "Obtained",
                  type: "bitflags",
                  flags: [
                    { offset: 0x3a7f, bit: 0, label: "Change Cube" },
                    { offset: 0x3a7f, bit: 4, label: "Call Cube" },
                    { offset: 0x3a80, bit: 0, label: "Skill Cube" },
                    { offset: 0x3a80, bit: 4, label: "Wait Cube" },
                    { offset: 0x3a81, bit: 0, label: "Acrobat Cube" },
                    { offset: 0x3a81, bit: 4, label: "Push Cube" },
                    { offset: 0x3a82, bit: 0, label: "Lizard Tail" },
                    { offset: 0x3a82, bit: 4, label: "Stone of Flight" },
                    { offset: 0x3a83, bit: 0, label: "Griffon Wing" },
                    { offset: 0x3a83, bit: 4, label: "Strength Glove" },
                    { offset: 0x3a84, bit: 0, label: "Spinning Art" },
                    { offset: 0x3a84, bit: 4, label: "Martial Art" },
                    { offset: 0x3a85, bit: 0, label: "Critical Art" },
                    { offset: 0x3a85, bit: 4, label: "Whip Skill 1" },
                    { offset: 0x3a86, bit: 0, label: "Whip Skill 2" },
                    { offset: 0x3a86, bit: 4, label: "Book of Spirits" },
                  ],
                },
                {
                  name: "Equipped",
                  type: "bitflags",
                  flags: [
                    { offset: 0x3a4d, bit: 0, label: "Change Cube" },
                    { offset: 0x3a4d, bit: 1, label: "Call Cube" },
                    { offset: 0x3a4d, bit: 2, label: "Skill Cube" },
                    { offset: 0x3a4d, bit: 3, label: "Wait Cube" },
                    { offset: 0x3a4d, bit: 4, label: "Acrobat Cube" },
                    { offset: 0x3a4d, bit: 5, label: "Push Cube" },
                    { offset: 0x3a4d, bit: 6, label: "Lizard Tail" },
                    { offset: 0x3a4d, bit: 7, label: "Stone of Flight" },
                    { offset: 0x3a4e, bit: 0, label: "Griffon Wing" },
                    { offset: 0x3a4e, bit: 1, label: "Strength Glove" },
                    { offset: 0x3a4e, bit: 2, label: "Spinning Art" },
                    { offset: 0x3a4e, bit: 3, label: "Martial Art" },
                    { offset: 0x3a4e, bit: 4, label: "Critical Art" },
                    { offset: 0x3a4e, bit: 5, label: "Whip Skill 1" },
                    { offset: 0x3a4e, bit: 6, label: "Whip Skill 2" },
                    { offset: 0x3a4e, bit: 7, label: "Book of Spirits" },
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
                      name: "Enemies",
                      flex: true,
                      items: [
                        {
                          name: "Entries",
                          type: "bitflags",
                          flags: enemies.map((enemy) => ({
                            offset: 0x3a91 + bitToOffset(enemy.index),
                            bit: enemy.index % 8,
                            label: enemy.name,
                            separator: (enemy.index + 1) % 10 === 0,
                          })),
                        },
                        {
                          name: "Drops",
                          type: "bitflags",
                          flags: enemies.map((enemy) => ({
                            offset: 0x3aa9 + bitToOffset(enemy.index),
                            bit: enemy.index % 8,
                            label: enemy.name,
                            separator: (enemy.index + 1) % 10 === 0,
                            disabled: !enemy.drops[0],
                          })),
                        },
                        {
                          name: "Rare Drops",
                          type: "bitflags",
                          flags: enemies.map((enemy) => ({
                            offset: 0x3ac1 + bitToOffset(enemy.index),
                            bit: enemy.index % 8,
                            label: enemy.name,
                            separator: (enemy.index + 1) % 10 === 0,
                            disabled: !enemy.drops[1],
                          })),
                        },
                      ],
                    },
                    {
                      name: "Enemies Killed",
                      flex: true,
                      items: enemies.map((enemy) => ({
                        name: enemy.name,
                        offset: 0x3d5b + enemy.index * 0x2,
                        type: "variable",
                        dataType: "uint16",
                        max: 9999,
                      })),
                    },
                    {
                      name: "Items",
                      items: [
                        {
                          type: "tabs",
                          items: [
                            {
                              name: "Items",
                              items: [
                                {
                                  type: "bitflags",
                                  flags: inventory[0].items.map((item) => ({
                                    offset:
                                      0x3ad9 +
                                      Math.floor((item.index - 0x317) / 0x2),
                                    bit: item.index % 2 !== 0 ? 0 : 4,
                                    label: item.name,
                                    hidden: item.guideHidden,
                                  })),
                                },
                              ],
                            },
                            {
                              name: "Weapons",
                              items: [
                                {
                                  type: "bitflags",
                                  flags: inventory[1].items.map((item) => ({
                                    offset:
                                      0x3b0a +
                                      Math.floor((item.index - 0x381) / 0x2),
                                    bit: item.index % 2 !== 0 ? 0 : 4,
                                    label: item.name,
                                    hidden: item.guideHidden,
                                  })),
                                },
                              ],
                            },
                            {
                              name: "Body",
                              items: [
                                {
                                  type: "bitflags",
                                  flags: inventory[4].items.map((item) => ({
                                    offset:
                                      0x3b2e +
                                      Math.floor((item.index - 0x3d0) / 0x2),
                                    bit: item.index % 2 === 0 ? 0 : 4,
                                    label: item.name,
                                    hidden: item.guideHidden,
                                  })),
                                },
                              ],
                            },
                            {
                              name: "Head",
                              items: [
                                {
                                  type: "bitflags",
                                  flags: inventory[5].items.map((item) => ({
                                    offset:
                                      0x3b4b +
                                      Math.floor((item.index - 0x410) / 0x2),
                                    bit: item.index % 2 === 0 ? 0 : 4,
                                    label: item.name,
                                    hidden: item.guideHidden,
                                  })),
                                },
                              ],
                            },
                            {
                              name: "Legs",
                              items: [
                                {
                                  type: "bitflags",
                                  flags: inventory[6].items.map((item) => ({
                                    offset:
                                      0x3b5e +
                                      Math.floor((item.index - 0x438) / 0x2),
                                    bit: item.index % 2 === 0 ? 0 : 4,
                                    label: item.name,
                                    hidden: item.guideHidden,
                                  })),
                                },
                              ],
                            },
                            {
                              name: "Accessories",
                              items: [
                                {
                                  type: "bitflags",
                                  flags: inventory[7].items.map((item) => ({
                                    offset:
                                      0x3b6d +
                                      Math.floor((item.index - 0x459) / 0x2),
                                    bit: item.index % 2 !== 0 ? 0 : 4,
                                    label: item.name,
                                    hidden: item.guideHidden,
                                  })),
                                },
                              ],
                            },
                          ],
                        },
                      ],
                    },
                    {
                      name: "Skills",
                      items: skills.map((skill) => ({
                        name: skill.name,
                        type: "section",
                        flex: true,
                        items: [
                          {
                            name: "Unlocked",
                            offset: 0x3cb1 + skill.index * 0x2 + 0x1,
                            type: "variable",
                            dataType: "bit",
                            bit: 6,
                            resource: "booleanUnlocked",
                          },
                          {
                            id: "skillPoints",
                            name: "Skill Points",
                            offset: 0x3cb1 + skill.index * 0x2,
                            type: "variable",
                            dataType: "uint16",
                            binary: { bitStart: 0, bitLength: 12 },
                            max: skill.max,
                            disabled: skill.max === 0,
                          },
                          {
                            name: "Mastered",
                            offset: 0x3cb1 + skill.index * 0x2 + 0x1,
                            type: "variable",
                            dataType: "bit",
                            bit: 7,
                            resource: "booleanMastered",
                            disabled: true,
                          },
                        ],
                      })),
                    },
                    {
                      name: "Quests",
                      flex: true,
                      items: quests.map((quest) => {
                        const offset = 0x3e91 + quest.index;

                        return {
                          name: quest.name,
                          type: "bitflags",
                          flags: [
                            { offset: offset, bit: 0, label: "Available" },
                            { offset: offset, bit: 1, label: "Pending" },
                            { offset: offset, bit: 2, label: "Requirements Obtained" },
                            { offset: offset, bit: 3, label: "Completed" },
                          ],
                        };
                      }),
                    },
                  ],
                },
              ],
            },
            {
              name: "Events",
              planned: true,
              items: [
                {
                  type: "bitflags",
                  flags: [
                    { offset: 0x3a49, bit: 0, label: "13th Street: Werewolf defeated" },
                    { offset: 0x3a49, bit: 1, label: "Dark Academy: The Creature defeated" },
                    { offset: 0x3a49, bit: 2, label: "Forgotten City: Mummy Man defeated" },
                    { offset: 0x3a49, bit: 3, label: "Burnt Paradise: Medusa defeated" },
                    { offset: 0x3a49, bit: 4, label: "???" },
                    { offset: 0x3a49, bit: 5, label: "???" },
                    { offset: 0x3a49, bit: 6, label: "Dracula's Castle: Master's Keep: Sisters defeated" },
                    { offset: 0x3a49, bit: 7, label: "Dracula's Castle: Master's Keep: Brauner defeated" },
                  ],
                },
              ],
            },
            {
              name: "Config",
              items: [
                {
                  name: "Buttons",
                  type: "section",
                  flex: true,
                  items: [
                    {
                      name: "Attack",
                      offset: 0x3d3f,
                      type: "variable",
                      dataType: "uint16",
                      resource: "buttons",
                    },
                    {
                      name: "Call Partner",
                      offset: 0x3d41,
                      type: "variable",
                      dataType: "uint16",
                      resource: "buttons",
                    },
                    {
                      name: "Jump",
                      offset: 0x3d43,
                      type: "variable",
                      dataType: "uint16",
                      resource: "buttons",
                    },
                    {
                      name: "Change Player",
                      offset: 0x3d45,
                      type: "variable",
                      dataType: "uint16",
                      resource: "buttons",
                    },
                    {
                      name: "Partner's Skill",
                      offset: 0x3d47,
                      type: "variable",
                      dataType: "uint16",
                      resource: "buttons",
                    },
                    {
                      name: "Backdash",
                      offset: 0x3d49,
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
                      name: "Music",
                      offset: 0x3f3d,
                      type: "variable",
                      dataType: "uint8",
                      max: 100,
                    },
                    {
                      name: "Sound FX",
                      offset: 0x3f3e,
                      type: "variable",
                      dataType: "uint8",
                      max: 100,
                    },
                    {
                      name: "Voice",
                      offset: 0x3f3f,
                      type: "variable",
                      dataType: "uint8",
                      max: 100,
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
          name: "Ranking",
          items: [
            {
              type: "tabs",
              vertical: true,
              items: [
                {
                  name: "Local",
                  items: [
                    {
                      length: 0x30,
                      type: "container",
                      instanceType: "tabs",
                      instances: 3,
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
                              offset: 0x174,
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
                                  offset: 0x180,
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
                                  offset: 0x180,
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
                                  offset: 0x180,
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
                              offset: 0x17c,
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
                  name: "Wireless",
                  items: [
                    {
                      length: 0x48,
                      type: "container",
                      instanceType: "tabs",
                      instances: 3,
                      enumeration: "Course %d",
                      items: [
                        {
                          length: 0x18,
                          type: "container",
                          instanceType: "section",
                          instances: 3,
                          enumeration: "%o Place",
                          flex: true,
                          items: [
                            {
                              name: "Filename",
                              offset: 0x204,
                              length: 0x8,
                              type: "variable",
                              dataType: "string",
                              letterDataType: "uint8",
                              resource: "letters",
                            },
                            {
                              name: "Partner",
                              offset: 0x20c,
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
                                  offset: 0x218,
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
                                  offset: 0x218,
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
                                  offset: 0x218,
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
                              offset: 0x214,
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
                  name: "Nintendo WFC",
                  items: [
                    {
                      length: 0x18,
                      type: "container",
                      instanceType: "section",
                      instances: 3,
                      enumeration: "%o Place",
                      flex: true,
                      items: [
                        {
                          name: "Filename",
                          offset: 0x12c,
                          length: 0x8,
                          type: "variable",
                          dataType: "string",
                          letterDataType: "uint8",
                          resource: "letters",
                        },
                        {
                          name: "Partner",
                          offset: 0x134,
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
                              offset: 0x140,
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
                              offset: 0x140,
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
                              offset: 0x140,
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
                          offset: 0x13c,
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
          ],
        },
      ],
    },
  ],
  resources: {
    books: {
      0x0: "-",
      ...books,
    },
    booleanMastered: {
      0x0: "-",
      0x1: "Mastered",
    },
    booleanUnlocked: {
      0x0: "-",
      0x1: "Unlocked",
    },
    buttons: {
      0x1: "A",
      0x2: "B",
      0x100: "R",
      0x200: "L",
      0x400: "X",
      0x800: "Y",
    },
    charlotteAccessories: {
      0x0: "-",
      ...charlotteAccessories,
    },
    charlotteBodies: {
      0x0: "-",
      ...charlotteBodies,
    },
    charlotteHeads: {
      0x0: "-",
      ...charlotteHeads,
    },
    charlotteLegs: {
      0x0: "-",
      ...charlotteLegs,
    },
    characters: {
      0x0: "Jonathan",
      0x1: "Sisters",
      0x2: "Richter",
      0x3: "Old Axe Armor",
    },
    difficulties: {
      0x0: "Normal",
      0x1: "Hard",
    },
    dualCrushes: {
      0x0: "-",
      ...dualCrushes,
    },
    jonathanAccessories: {
      0x0: "-",
      ...jonathanAccessories,
    },
    jonathanBodies: {
      0x0: "-",
      ...jonathanBodies,
    },
    jonathanHeads: {
      0x0: "-",
      ...jonathanHeads,
    },
    jonathanLegs: {
      0x0: "-",
      ...jonathanLegs,
    },
    items: {
      0x0: "-",
      ...items,
    },
    languages: {
      0x1: "English",
      0x2: "French",
      0x3: "German",
      0x4: "Italian",
      0x5: "Spanish",
    },
    letters: {
      0xd: "0",
      0xe: "1",
      0xf: "2",
      0x10: "3",
      0x11: "4",
      0x12: "5",
      0x13: "6",
      0x14: "7",
      0x15: "8",
      0x16: "9",
      0x17: "A",
      0x18: "B",
      0x19: "C",
      0x1a: "D",
      0x1b: "E",
      0x1c: "F",
      0x1d: "G",
      0x1e: "H",
      0x1f: "I",
      0x20: "J",
      0x21: "K",
      0x22: "L",
      0x23: "M",
      0x24: "N",
      0x25: "O",
      0x26: "P",
      0x27: "Q",
      0x28: "R",
      0x29: "S",
      0x2a: "T",
      0x2b: "U",
      0x2c: "V",
      0x2d: "W",
      0x2e: "X",
      0x2f: "Y",
      0x30: "Z",
      0x31: "*",
      0x32: "-",
      0x33: "(",
      0x34: ")",
      0x35: "!",
      0x36: "/",
      0x37: "&",
      0x38: "'",
      0x39: " ",
    },
    levels: {
      0x1: "1",
      0x19: "25",
      0x32: "50",
      0x63: "99",
    },
    locations: {
      0x6: "Entrance (near Nest of Evil)",
      0x108: "Entrance",
      0x109: "Entrance (Vincent Room)",
      0x111: "Entrance (near Behemoth)",
      0x20d: "Buried Chamber",
      0x308: "Great Stairway (near Keremet)",
      0x410: "Great Stairway (near Sandy Grave)",
      0x607: "Great Stairway (near Nation of Fools)",
      0x704: "Tower of Death (near Death)",
      0x713: "Tower of Death (near Stella)",
      0x804: "Tower of Death (near Forest of Doom)",
      0xa03: "Master's Keep (near Brauner)",
      0xa14: "Master's Keep (near Tower of Death)",
      0x10008: "City of Haze (near Portrait)",
      0x10102: "City of Haze (before the tunnel)",
      0x1020e: "City of Haze (near Dullahan)",
      0x10216: "City of Haze (after the tunnel)",
      0x20004: "13th Street (near Portrait)",
      0x2010e: "13th Street (Middle)",
      0x2020c: "13th Street (near Werewolf)",
      0x3000e: "Sandy Grave (near Astarte)",
      0x30017: "Sandy Grave (near Portrait)",
      0x30104: "Sandy Grave (Middle)",
      0x30120: "Sandy Grave (Bottom)",
      0x4000e: "Forgotten City (below the wormhole)",
      0x40017: "Forgotten City (West)",
      0x40104: "Forgotten City (near Mummy Man)",
      0x40120: "Forgotten City (Bottom)",
      0x50015: "Nation of Fools (East)",
      0x50017: "Nation of Fools (Bottom)",
      0x50024: "Nation of Fools (West)",
      0x50208: "Nation of Fools (near Legion)",
      0x6000b: "Burnt Paradise (near Medusa)",
      0x6000c: "Burnt Paradise (West)",
      0x60017: "Burnt Paradise (near Portrait)",
      0x6002e: "Burnt Paradise (East)",
      0x7000d: "Forest of Doom (near Dagon)",
      0x70109: "Forest of Doom (West)",
      0x70204: "Forest of Doom (Middle)",
      0x80000: "Dark Academy (near The Creature)",
      0x80216: "Dark Academy (Middle)",
      0x80306: "Dark Academy (East)",
      0x90002: "Nest of Evil (near Portrait)",
      0x9003c: "Nest of Evil (near Doppelganger)",
    },
    magics: {
      0x0: "-",
      ...magics,
    },
    progressions: {
      0x0: "-",
      0x1: "Clear",
    },
    subweapons: {
      0x0: "-",
      ...subweapons,
    },
    weapons: {
      0x0: "-",
      ...weapons,
    },
  },
  resourcesGroups: {
    items: itemsGroups,
    locations: [
      {
        name: "Dracula's Castle",
        options: [
          0x6, 0x108, 0x109, 0x111, 0x20d, 0x308, 0x410, 0x607, 0x704, 0x713,
          0x804, 0xa03, 0xa14,
        ],
      },
      {
        name: "City of Haze",
        options: [0x10008, 0x10102, 0x1020e, 0x10216],
      },
      {
        name: "Sandy Grave",
        options: [0x3000e, 0x30017, 0x30104, 0x30120],
      },
      {
        name: "Nation of Fools",
        options: [0x50015, 0x50017, 0x50024, 0x50208],
      },
      {
        name: "Forest of Doom",
        options: [0x7000d, 0x70109, 0x70204],
      },
      {
        name: "13th Street",
        options: [0x20004, 0x2010e, 0x2020c],
      },
      {
        name: "Forgotten City",
        options: [0x4000e, 0x40017, 0x40104, 0x40120],
      },
      {
        name: "Burnt Paradise",
        options: [0x6000b, 0x6000c, 0x60017, 0x6002e],
      },
      {
        name: "Dark Academy",
        options: [0x80000, 0x80216, 0x80306],
      },
      {
        name: "Nest of Evil",
        options: [0x90002, 0x9003c],
      },
    ],
  },
  resourcesOrder: {
    items: itemsOrder,
    locations: [
      0x108, 0x111, 0x109, 0x6, 0x20d, 0x308, 0x410, 0x607, 0x804, 0x713, 0x704,
      0xa14, 0xa03, 0x10008, 0x10102, 0x10216, 0x1020e, 0x30017, 0x30104,
      0x30120, 0x3000e, 0x50017, 0x50024, 0x50015, 0x50208, 0x70109, 0x70204,
      0x7000d, 0x20004, 0x2010e, 0x2020c, 0x4000e, 0x40017, 0x40120, 0x40104,
      0x60017, 0x6000c, 0x6002e, 0x6000b, 0x80306, 0x80216, 0x80000, 0x90002,
      0x9003c,
    ],
    subweapons: subweaponsOrder,
    weapons: weaponsOrder,
  },
};

export default template;
