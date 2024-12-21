import type { GameJson } from "$lib/types";

import {
  accessories,
  armors,
  items,
  keyItems,
  weapons,
} from "./utils/resource";

const template: GameJson = {
  validator: {
    regions: {
      europe: {
        0x0: [0x47, 0x45, 0x41, 0x50, 0x38], // "GEAP8"
      },
      usa: {
        0x0: [0x47, 0x45, 0x41, 0x45, 0x38], // "GEAE8"
      },
      japan: {
        0x0: [0x47, 0x45, 0x41, 0x4a, 0x38], // "GEAJ8"
      },
    },
    text: "Drag 'n' drop here or click to add a save file.",
    error: "Not a valid save file.",
  },
  items: [
    {
      name: "Checksum",
      offset: 0x467c,
      type: "checksum",
      dataType: "uint32",
      bigEndian: true,
      control: {
        offsetStart: 0x1480,
        offsetEnd: 0x467c,
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
                  name: "Date",
                  type: "group",
                  mode: "date",
                  hidden: true,
                  items: [
                    {
                      offset: 0x4672,
                      type: "variable",
                      dataType: "uint16",
                      bigEndian: true,
                    },
                    {
                      offset: 0x4674,
                      type: "variable",
                      dataType: "uint8",
                    },
                    {
                      offset: 0x4675,
                      type: "variable",
                      dataType: "uint8",
                    },
                    {
                      offset: 0x4676,
                      type: "variable",
                      dataType: "uint8",
                      leadingZeros: 1,
                    },
                    {
                      offset: 0x4677,
                      type: "variable",
                      dataType: "uint8",
                      leadingZeros: 1,
                    },
                    {
                      offset: 0x4678,
                      type: "variable",
                      dataType: "uint8",
                      leadingZeros: 1,
                    },
                  ],
                },
                {
                  name: "Play Time",
                  type: "group",
                  mode: "time",
                  items: [
                    {
                      offset: 0x466c,
                      type: "variable",
                      dataType: "uint32",
                      bigEndian: true,
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
                      offset: 0x466c,
                      type: "variable",
                      dataType: "uint32",
                      bigEndian: true,
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
                      offset: 0x466c,
                      type: "variable",
                      dataType: "uint32",
                      bigEndian: true,
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
                  name: "Swashbuckler Rating",
                  offset: 0x17d8,
                  type: "variable",
                  dataType: "uint16",
                  bigEndian: true,
                  // max: 99999999,
                },
                {
                  name: "Gold",
                  offset: 0x17dc,
                  type: "variable",
                  dataType: "uint32",
                  bigEndian: true,
                  max: 99999999,
                },
              ],
            },
          ],
        },
        {
          name: "Party",
          items: [
            {
              length: 0x5c,
              type: "container",
              instanceType: "tabs",
              instances: 6,
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
                              id: "slot-characterName-%index%",
                              name: "Name",
                              offset: 0x1490,
                              length: 0xa,
                              type: "variable",
                              dataType: "string",
                              letterDataType: "uint8",
                              zeroTerminated: true,
                            },
                            {
                              name: "Level",
                              offset: 0x149b,
                              type: "variable",
                              dataType: "uint8",
                              min: 1,
                              max: 99,
                            },
                            {
                              name: "Experience",
                              offset: 0x14b4,
                              type: "variable",
                              dataType: "uint32",
                              bigEndian: true,
                              max: 99999999,
                            },
                            {
                              name: "KO Count",
                              offset: 0x149c,
                              type: "variable",
                              dataType: "uint8",
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
                                  offset: 0x14a8,
                                  type: "variable",
                                  dataType: "uint16",
                                  bigEndian: true,
                                  min: 1,
                                  max: 9999,
                                },
                                {
                                  offset: 0x14aa,
                                  type: "variable",
                                  dataType: "uint16",
                                  bigEndian: true,
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
                                  offset: 0x149d,
                                  type: "variable",
                                  dataType: "uint8",
                                  max: 99,
                                },
                                {
                                  offset: 0x149e,
                                  type: "variable",
                                  dataType: "uint8",
                                  max: 99,
                                },
                              ],
                            },
                            {
                              name: "Spirit",
                              type: "group",
                              mode: "fraction",
                              items: [
                                {
                                  offset: 0x14ac,
                                  type: "variable",
                                  dataType: "uint16",
                                  bigEndian: true,
                                  // max: 99,
                                },
                                {
                                  offset: 0x14ae,
                                  type: "variable",
                                  dataType: "uint16",
                                  bigEndian: true,
                                  // max: 99,
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
                              name: "Power",
                              offset: 0x14ca,
                              type: "variable",
                              dataType: "uint16",
                              bigEndian: true,
                              max: 999,
                            },
                            {
                              name: "Will",
                              offset: 0x14cc,
                              type: "variable",
                              dataType: "uint16",
                              bigEndian: true,
                              max: 999,
                            },
                            {
                              name: "Vigor",
                              offset: 0x14ce,
                              type: "variable",
                              dataType: "uint16",
                              bigEndian: true,
                              max: 999,
                            },
                            {
                              name: "Agility",
                              offset: 0x14d0,
                              type: "variable",
                              dataType: "uint16",
                              bigEndian: true,
                              max: 999,
                            },
                            {
                              name: "Quick",
                              offset: 0x14d2,
                              type: "variable",
                              dataType: "uint16",
                              bigEndian: true,
                              max: 999,
                            },
                          ],
                        },
                        {
                          type: "section",
                          flex: true,
                          items: [
                            {
                              id: "superMove-0-%index%",
                              name: "Super Move",
                              type: "bitflags",
                              flags: [
                                { offset: 0x14C0, bit: 4, label: "Cutlass Fury" }, // prettier-ignore
                                { offset: 0x14C2, bit: 2, label: "Counterstrike" }, // prettier-ignore
                                { offset: 0x14C0, bit: 5, label: "Rain of Swords" }, // prettier-ignore
                                { offset: 0x14C2, bit: 3, label: "Skull Shield" }, // prettier-ignore
                                { offset: 0x14C0, bit: 6, label: "Pirates' Wrath" }, // prettier-ignore
                              ],
                            },
                            {
                              id: "superMove-1-%index%",
                              name: "Super Move",
                              type: "bitflags",
                              flags: [
                                { offset: 0x14C1, bit: 0, label: "Alpha Storm" }, // prettier-ignore
                                { offset: 0x14C2, bit: 4, label: "Delta Shield" }, // prettier-ignore
                                { offset: 0x14C1, bit: 1, label: "Lambda Burst" }, // prettier-ignore
                                { offset: 0x14C2, bit: 5, label: "Epsilon Mirror" }, // prettier-ignore
                                { offset: 0x14C0, bit: 7, label: "Omega Psyclone" }, // prettier-ignore
                              ],
                            },
                            {
                              id: "superMove-2-%index%",
                              name: "Super Move",
                              type: "bitflags",
                              flags: [
                                { offset: 0x14C2, bit: 6, label: "Lunar Blessing" }, // prettier-ignore
                                { offset: 0x14C1, bit: 2, label: "Lunar Glyph" }, // prettier-ignore
                                { offset: 0x14C2, bit: 7, label: "Lunar Cleansing" }, // prettier-ignore
                                { offset: 0x14C1, bit: 3, label: "Lunar Winds" }, // prettier-ignore
                                { offset: 0x14C3, bit: 0, label: "Lunar Light" }, // prettier-ignore
                              ],
                            },
                            {
                              id: "superMove-3-%index%",
                              name: "Super Move",
                              type: "bitflags",
                              flags: [
                                { offset: 0x14C1, bit: 4, label: "Tackle" }, // prettier-ignore
                                { offset: 0x14C3, bit: 1, label: "Spirit Charge" }, // prettier-ignore
                                { offset: 0x14C1, bit: 5, label: "Hand of Fate" }, // prettier-ignore
                              ],
                            },
                            {
                              id: "superMove-4-%index%",
                              name: "Super Move",
                              type: "bitflags",
                              flags: [
                                { offset: 0x14C1, bit: 6, label: "Royal Blade" }, // prettier-ignore
                                { offset: 0x14C3, bit: 2, label: "Justice Shield" }, // prettier-ignore
                                { offset: 0x14C1, bit: 7, label: "The Judgement" }, // prettier-ignore
                              ],
                            },
                            {
                              id: "superMove-5-%index%",
                              name: "Super Move",
                              type: "bitflags",
                              flags: [
                                { offset: 0x14C2, bit: 0, label: "Gunslinger" }, // prettier-ignore
                                { offset: 0x14C3, bit: 3, label: "Aura of Denial" }, // prettier-ignore
                                { offset: 0x14C2, bit: 1, label: "The Claudia" }, // prettier-ignore
                              ],
                            },
                          ],
                        },
                      ],
                    },
                    {
                      name: "Magic",
                      items: [
                        {
                          type: "tabs",
                          items: [
                            {
                              name: "Green",
                              items: [
                                {
                                  type: "section",
                                  flex: true,
                                  noMargin: true,
                                  items: [
                                    {
                                      name: "Rank",
                                      offset: 0x14c4,
                                      type: "variable",
                                      dataType: "uint8",
                                      max: 6,
                                    },
                                    {
                                      name: "Experience",
                                      offset: 0x14d4,
                                      type: "variable",
                                      dataType: "uint32",
                                      bigEndian: true,
                                      max: 9999,
                                    },
                                  ],
                                },
                                {
                                  type: "bitflags",
                                  flags: [
                                    { offset: 0x14BC, bit: 6, label: "Sacri" }, // prettier-ignore
                                    { offset: 0x14BC, bit: 7, label: "Sacres" }, // prettier-ignore
                                    { offset: 0x14BD, bit: 0, label: "Sacrum" }, // prettier-ignore
                                    { offset: 0x14BD, bit: 1, label: "Sacrulen" }, // prettier-ignore
                                    { offset: 0x14BD, bit: 2, label: "Noxi" }, // prettier-ignore
                                    { offset: 0x14BD, bit: 3, label: "Noxus" }, // prettier-ignore
                                  ],
                                },
                              ],
                            },
                            {
                              name: "Red",
                              items: [
                                {
                                  type: "section",
                                  flex: true,
                                  noMargin: true,
                                  items: [
                                    {
                                      name: "Rank",
                                      offset: 0x14c5,
                                      type: "variable",
                                      dataType: "uint8",
                                      max: 6,
                                    },
                                    {
                                      name: "Experience",
                                      offset: 0x14d8,
                                      type: "variable",
                                      dataType: "uint32",
                                      bigEndian: true,
                                      max: 9999,
                                    },
                                  ],
                                },
                                {
                                  type: "bitflags",
                                  flags: [
                                    { offset: 0x14BE, bit: 7, label: "Pyri" }, // prettier-ignore
                                    { offset: 0x14BF, bit: 0, label: "Pyres" }, // prettier-ignore
                                    { offset: 0x14BF, bit: 1, label: "Pyrum" }, // prettier-ignore
                                    { offset: 0x14BF, bit: 6, label: "Pyrulen" }, // prettier-ignore
                                    { offset: 0x14BC, bit: 0, label: "Increm" }, // prettier-ignore
                                    { offset: 0x14BC, bit: 1, label: "Incremus" }, // prettier-ignore
                                  ],
                                },
                              ],
                            },
                            {
                              name: "Purple",
                              items: [
                                {
                                  type: "section",
                                  flex: true,
                                  noMargin: true,
                                  items: [
                                    {
                                      name: "Rank",
                                      offset: 0x14c6,
                                      type: "variable",
                                      dataType: "uint8",
                                      max: 6,
                                    },
                                    {
                                      name: "Experience",
                                      offset: 0x14dc,
                                      type: "variable",
                                      dataType: "uint32",
                                      bigEndian: true,
                                      max: 9999,
                                    },
                                  ],
                                },
                                {
                                  type: "bitflags",
                                  flags: [
                                    { offset: 0x14BF, bit: 2, label: "Crystali" }, // prettier-ignore
                                    { offset: 0x14BF, bit: 3, label: "Crystales" }, // prettier-ignore
                                    { offset: 0x14BF, bit: 4, label: "Crystalum" }, // prettier-ignore
                                    { offset: 0x14BF, bit: 5, label: "Crystalen" }, // prettier-ignore
                                    { offset: 0x14BC, bit: 2, label: "Sylenis" }, // prettier-ignore
                                    { offset: 0x14BC, bit: 3, label: "Panika" }, // prettier-ignore
                                  ],
                                },
                              ],
                            },
                            {
                              name: "Blue",
                              items: [
                                {
                                  type: "section",
                                  flex: true,
                                  noMargin: true,
                                  items: [
                                    {
                                      name: "Rank",
                                      offset: 0x14c7,
                                      type: "variable",
                                      dataType: "uint8",
                                      max: 6,
                                    },
                                    {
                                      name: "Experience",
                                      offset: 0x14e0,
                                      type: "variable",
                                      dataType: "uint32",
                                      bigEndian: true,
                                      max: 9999,
                                    },
                                  ],
                                },
                                {
                                  type: "bitflags",
                                  flags: [
                                    { offset: 0x14BE, bit: 4, label: "Wevli" }, // prettier-ignore
                                    { offset: 0x14BE, bit: 5, label: "Wevles" }, // prettier-ignore
                                    { offset: 0x14BF, bit: 7, label: "Wevlum" }, // prettier-ignore
                                    { offset: 0x14BE, bit: 6, label: "Wevlen" }, // prettier-ignore
                                    { offset: 0x14BD, bit: 5, label: "Quika" }, // prettier-ignore
                                    { offset: 0x14BD, bit: 4, label: "Slipara" }, // prettier-ignore
                                  ],
                                },
                              ],
                            },
                            {
                              name: "Yellow",
                              items: [
                                {
                                  type: "section",
                                  flex: true,
                                  noMargin: true,
                                  items: [
                                    {
                                      name: "Rank",
                                      offset: 0x14c8,
                                      type: "variable",
                                      dataType: "uint8",
                                      max: 6,
                                    },
                                    {
                                      name: "Experience",
                                      offset: 0x14e4,
                                      type: "variable",
                                      dataType: "uint32",
                                      bigEndian: true,
                                      max: 9999,
                                    },
                                  ],
                                },
                                {
                                  type: "bitflags",
                                  flags: [
                                    { offset: 0x14C0, bit: 0, label: "Electri" }, // prettier-ignore
                                    { offset: 0x14C0, bit: 1, label: "Electres" }, // prettier-ignore
                                    { offset: 0x14C0, bit: 2, label: "Electrum" }, // prettier-ignore
                                    { offset: 0x14C0, bit: 3, label: "Electrulen" }, // prettier-ignore
                                    { offset: 0x14BC, bit: 4, label: "Driln" }, // prettier-ignore
                                    { offset: 0x14BC, bit: 5, label: "Drilnos" }, // prettier-ignore
                                  ],
                                },
                              ],
                            },
                            {
                              name: "Silver",
                              items: [
                                {
                                  type: "section",
                                  flex: true,
                                  noMargin: true,
                                  items: [
                                    {
                                      name: "Rank",
                                      offset: 0x14c9,
                                      type: "variable",
                                      dataType: "uint8",
                                      max: 6,
                                    },
                                    {
                                      name: "Experience",
                                      offset: 0x14e8,
                                      type: "variable",
                                      dataType: "uint32",
                                      bigEndian: true,
                                      max: 9999,
                                    },
                                  ],
                                },
                                {
                                  type: "section",
                                  flex: true,
                                  items: [
                                    {
                                      type: "bitflags",
                                      flags: [
                                        { offset: 0x14BD, bit: 6, label: "Curia" }, // prettier-ignore
                                        { offset: 0x14BD, bit: 7, label: "Risan" }, // prettier-ignore
                                        { offset: 0x14BE, bit: 0, label: "Riselem" }, // prettier-ignore
                                        { offset: 0x14BE, bit: 1, label: "Eterni" }, // prettier-ignore
                                        { offset: 0x14BE, bit: 2, label: "Eternes" }, // prettier-ignore
                                        { offset: 0x14BE, bit: 3, label: "Eternum" }, // prettier-ignore
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
                      name: "Equipment",
                      items: [
                        {
                          type: "section",
                          flex: true,
                          items: [
                            {
                              name: "Weapon",
                              offset: 0x14a0,
                              type: "variable",
                              dataType: "uint16",
                              bigEndian: true,
                              resource: "weapons",
                              autocomplete: true,
                            },
                            {
                              name: "Armor",
                              offset: 0x14a2,
                              type: "variable",
                              dataType: "uint16",
                              bigEndian: true,
                              resource: "armors",
                              autocomplete: true,
                            },
                            {
                              name: "Accessory",
                              offset: 0x14a4,
                              type: "variable",
                              dataType: "uint16",
                              bigEndian: true,
                              resource: "accessories",
                              autocomplete: true,
                            },
                          ],
                        },
                        {
                          type: "section",
                          flex: true,
                          items: [
                            {
                              name: "Moon Stone",
                              offset: 0x149f,
                              type: "variable",
                              dataType: "uint8",
                              resource: "moonStones",
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
                {
                  name: "Weapons",
                  items: [...Array(80).keys()].map((index) => ({
                    type: "section",
                    flex: true,
                    items: [
                      {
                        name: `Item ${index + 1}`,
                        offset: 0x17e4 + index * 0x4,
                        type: "variable",
                        dataType: "uint16",
                        bigEndian: true,
                        resource: "weapons",
                        autocomplete: true,
                      },
                      {
                        id: "quantity",
                        name: "Quantity",
                        offset: 0x17e6 + index * 0x4,
                        type: "variable",
                        dataType: "uint8",
                        max: 99,
                      },
                      {
                        name: "???",
                        offset: 0x17e7 + index * 0x4,
                        type: "variable",
                        dataType: "uint8",
                        hidden: true,
                      },
                    ],
                  })),
                },
                {
                  name: "Armors",
                  items: [...Array(80).keys()].map((index) => ({
                    type: "section",
                    flex: true,
                    items: [
                      {
                        name: `Item ${index + 1}`,
                        offset: 0x1924 + index * 0x4,
                        type: "variable",
                        dataType: "uint16",
                        bigEndian: true,
                        resource: "armors",
                        autocomplete: true,
                      },
                      {
                        id: "quantity",
                        name: "Quantity",
                        offset: 0x1926 + index * 0x4,
                        type: "variable",
                        dataType: "uint8",
                        max: 99,
                      },
                      {
                        name: "???",
                        offset: 0x1927 + index * 0x4,
                        type: "variable",
                        dataType: "uint8",
                        hidden: true,
                      },
                    ],
                  })),
                },
                {
                  name: "Accessories",
                  items: [...Array(80).keys()].map((index) => ({
                    type: "section",
                    flex: true,
                    items: [
                      {
                        name: `Item ${index + 1}`,
                        offset: 0x1a64 + index * 0x4,
                        type: "variable",
                        dataType: "uint16",
                        bigEndian: true,
                        resource: "accessories",
                        autocomplete: true,
                      },
                      {
                        id: "quantity",
                        name: "Quantity",
                        offset: 0x1a66 + index * 0x4,
                        type: "variable",
                        dataType: "uint8",
                        max: 99,
                      },
                      {
                        name: "???",
                        offset: 0x1a67 + index * 0x4,
                        type: "variable",
                        dataType: "uint8",
                        hidden: true,
                      },
                    ],
                  })),
                },
                {
                  name: "Items",
                  items: [...Array(80).keys()].map((index) => ({
                    type: "section",
                    flex: true,
                    items: [
                      {
                        name: `Item ${index + 1}`,
                        offset: 0x1ba4 + index * 0x4,
                        type: "variable",
                        dataType: "uint16",
                        bigEndian: true,
                        resource: "items",
                        autocomplete: true,
                      },
                      {
                        id: "quantity",
                        name: "Quantity",
                        offset: 0x1ba6 + index * 0x4,
                        type: "variable",
                        dataType: "uint8",
                        max: 99,
                      },
                      {
                        name: "???",
                        offset: 0x1ba7 + index * 0x4,
                        type: "variable",
                        dataType: "uint8",
                        hidden: true,
                      },
                    ],
                  })),
                },
                {
                  name: "Key Items",
                  items: [...Array(80).keys()].map((index) => ({
                    type: "section",
                    flex: true,
                    items: [
                      {
                        name: `Item ${index + 1}`,
                        offset: 0x1ce4 + index * 0x4,
                        type: "variable",
                        dataType: "uint16",
                        bigEndian: true,
                        resource: "keyItems",
                        autocomplete: true,
                      },
                      {
                        id: "quantity",
                        name: "Quantity",
                        offset: 0x1ce6 + index * 0x4,
                        type: "variable",
                        dataType: "uint8",
                        max: 99,
                      },
                      {
                        name: "???",
                        offset: 0x1ce7 + index * 0x4,
                        type: "variable",
                        dataType: "uint8",
                        hidden: true,
                      },
                    ],
                  })),
                },
                {
                  name: "Ship Boxes",
                  items: [...Array(30).keys()].map((index) => ({
                    type: "section",
                    flex: true,
                    items: [
                      {
                        name: `Item ${index + 1}`,
                        offset: 0x1e24 + index * 0x4,
                        type: "variable",
                        dataType: "uint16",
                        bigEndian: true,
                        // resource: "keyItems",
                        autocomplete: true,
                      },
                      {
                        id: "quantity",
                        name: "Quantity",
                        offset: 0x1e26 + index * 0x4,
                        type: "variable",
                        dataType: "uint8",
                        max: 99,
                      },
                      {
                        name: "???",
                        offset: 0x1e27 + index * 0x4,
                        type: "variable",
                        dataType: "uint8",
                        hidden: true,
                      },
                    ],
                  })),
                },
                {
                  name: "Ship Cannons",
                  items: [...Array(40).keys()].map((index) => ({
                    type: "section",
                    flex: true,
                    items: [
                      {
                        name: `Item ${index + 1}`,
                        offset: 0x1e9c + index * 0x4,
                        type: "variable",
                        dataType: "uint16",
                        bigEndian: true,
                        // resource: "keyItems",
                        autocomplete: true,
                      },
                      {
                        id: "quantity",
                        name: "Quantity",
                        offset: 0x1e9e + index * 0x4,
                        type: "variable",
                        dataType: "uint8",
                        max: 99,
                      },
                      {
                        name: "???",
                        offset: 0x1e9f + index * 0x4,
                        type: "variable",
                        dataType: "uint8",
                        hidden: true,
                      },
                    ],
                  })),
                },
                {
                  name: "Ship Accessories",
                  items: [...Array(40).keys()].map((index) => ({
                    type: "section",
                    flex: true,
                    items: [
                      {
                        name: `Item ${index + 1}`,
                        offset: 0x1f3c + index * 0x4,
                        type: "variable",
                        dataType: "uint16",
                        bigEndian: true,
                        // resource: "keyItems",
                        autocomplete: true,
                      },
                      {
                        id: "quantity",
                        name: "Quantity",
                        offset: 0x1f3e + index * 0x4,
                        type: "variable",
                        dataType: "uint8",
                        max: 99,
                      },
                      {
                        name: "???",
                        offset: 0x1f3f + index * 0x4,
                        type: "variable",
                        dataType: "uint8",
                        hidden: true,
                      },
                    ],
                  })),
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
      ...accessories,
      0xffff: "-",
    },
    armors: {
      ...armors,
      0xffff: "-",
    },
    characterNames: "getCharacterNames()",
    items: {
      ...items,
      0xffff: "-",
    },
    keyItems: {
      ...keyItems,
      0xffff: "-",
    },
    weapons: {
      ...weapons,
      0xffff: "-",
    },
  },
  resourcesOrder: {
    accessories: [0xffff],
    armors: [0xffff],
    items: [0xffff],
    keyItems: [0xffff],
    weapons: [0xffff],
  },
};

export default template;
