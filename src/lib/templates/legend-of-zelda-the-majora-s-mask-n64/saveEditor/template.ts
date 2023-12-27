import type { GameJson } from "$lib/types";

const template: GameJson = {
  validator: {
    regions: {
      europe: [
        {
          $or: [
            {
              $and: [
                { 0x24: [0x44, 0x4c, 0x45, 0x5a] },
                { 0x2a: [0x33, 0x41] },
              ],
            },
            {
              $and: [
                { 0x4024: [0x44, 0x4c, 0x45, 0x5a] },
                { 0x402a: [0x33, 0x41] },
              ],
            },
          ],
        },
      ],
      usa: [
        {
          $or: [
            {
              $and: [
                { 0x24: [0x44, 0x4c, 0x45, 0x5a] },
                { 0x2a: [0x33, 0x41] },
              ],
            },
            {
              $and: [
                { 0x4024: [0x44, 0x4c, 0x45, 0x5a] },
                { 0x402a: [0x33, 0x41] },
              ],
            },
          ],
        },
      ],
      japan: [
        {
          $or: [
            {
              $and: [
                { 0x24: [0x44, 0x4c, 0x45, 0x5a] },
                { 0x2a: [0x33, 0x41] },
              ],
            },
            {
              $and: [
                { 0x4024: [0x44, 0x4c, 0x45, 0x5a] },
                { 0x402a: [0x33, 0x41] },
              ],
            },
            {
              $and: [
                { 0x8024: [0x44, 0x4c, 0x45, 0x5a] },
                { 0x802a: [0x33, 0x41] },
              ],
            },
          ],
        },
      ],
    },
    text: "Drag 'n' drop here or click to add a save file.",
    error: "Not a valid save file.",
  },
  items: [
    {
      id: "slots",
      length: 0x4000,
      type: "container",
      instanceType: "tabs",
      instances: 3,
      enumeration: "Slot %d",
      disableSubinstanceIf: [
        {
          $or: [
            {
              offset: 0x24,
              type: "variable",
              dataType: "uint8",
              value: 0x0,
            },
            {
              offset: 0x24,
              type: "variable",
              dataType: "uint8",
              value: 0xff,
            },
          ],
        },
      ],
      // appendSubinstance: [
      //   {
      //     name: "Options",
      //     items: [
      //       {
      //         name: "Language",
      //         offset: 0x18001,
      //         type: "variable",
      //         dataType: "uint8",
      //         resource: "languages",
      //       },
      //       // 0x18000 > Sound >> 00 Stereo / Mono / Headset / Surround
      //       // 0x18001 > Language >> 00 Japanese / English / German / French / Spanish
      //       // 0x18006 > Z Targeting > 00 Switch / Hold
      //     ],
      //   },
      // ],
      items: [
        {
          id: "checksum",
          name: "Checksum",
          offset: 0x1008,
          type: "checksum",
          dataType: "uint16",
          control: {
            offset: 0x0,
            length: 0x2000,
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
                              id: "filename",
                              name: "Filename",
                              offset: 0x2c,
                              length: 0x8,
                              type: "variable",
                              dataType: "string",
                              bigEndian: true,
                              letterDataType: "uint8",
                              fallback: 0x3e,
                              resource: "letters",
                            },
                            {
                              name: "Three Day Reset Count",
                              offset: 0x28,
                              type: "variable",
                              dataType: "uint16",
                            },
                            {
                              name: "Bank Deposit",
                              offset: 0xedc,
                              type: "variable",
                              dataType: "uint16",
                              max: 5000,
                            },
                            {
                              name: "Rupees",
                              offset: 0x38,
                              type: "variable",
                              dataType: "uint16",
                              max: 500,
                            },
                          ],
                        },
                        {
                          type: "section",
                          flex: true,
                          items: [
                            {
                              name: "Health",
                              type: "group",
                              mode: "fraction",
                              items: [
                                {
                                  id: "health",
                                  offset: 0x34,
                                  type: "variable",
                                  dataType: "uint16",
                                  operations: [{ "/": 16 }],
                                  step: 0.25,
                                  min: 0.25,
                                  max: 20,
                                },
                                {
                                  id: "healthMax",
                                  offset: 0x36,
                                  type: "variable",
                                  dataType: "uint16",
                                  operations: [{ "/": 16 }],
                                  min: 1,
                                  max: 20,
                                },
                              ],
                            },
                            {
                              id: "heartPieces",
                              name: "Heart Pieces",
                              offset: 0xbf,
                              type: "variable",
                              dataType: "uint8",
                              max: 3,
                            },
                            {
                              id: "magicLevel",
                              name: "Magic Level",
                              offset: 0x3b,
                              type: "variable",
                              dataType: "uint8",
                              resource: "magicBars",
                            },
                            {
                              id: "magic",
                              name: "Magic",
                              offset: 0x3a,
                              type: "variable",
                              dataType: "uint8",
                              max: 96,
                            },
                          ],
                        },
                        {
                          type: "section",
                          flex: true,
                          items: [
                            {
                              name: "Transformation",
                              offset: 0x23,
                              type: "variable",
                              dataType: "uint8",
                              resource: "transformations",
                            },
                            {
                              name: "Double Defense",
                              type: "section",
                              background: true,
                              items: [
                                {
                                  id: "doubleDefense",
                                  name: "Acquired",
                                  offset: 0x41,
                                  type: "variable",
                                  dataType: "boolean",
                                },
                              ],
                            },
                            {
                              name: "Mastered Spin Attack",
                              type: "bitflags",
                              flags: [
                                { offset: 0xf0c, bit: 1, name: "Acquired" },
                              ],
                            },
                          ],
                        },
                        {
                          type: "section",
                          flex: true,
                          items: [
                            {
                              name: "Tatl",
                              type: "section",
                              background: true,
                              hidden: true,
                              items: [
                                {
                                  name: "Acquired",
                                  offset: 0x21,
                                  type: "variable",
                                  dataType: "boolean",
                                  hidden: true,
                                },
                              ],
                            },
                            {
                              name: "Heart Pieces",
                              type: "bitflags",
                              hidden: true,
                              flags: [
                                { offset: 0xbf, bit: 4, name: "1 Piece" },
                                { offset: 0xbf, bit: 5, name: "2 Pieces" },
                              ],
                            },
                            {
                              name: "Magic",
                              type: "section",
                              background: true,
                              hidden: true,
                              items: [
                                {
                                  name: "Acquired",
                                  offset: 0x43,
                                  type: "variable",
                                  dataType: "boolean",
                                },
                              ],
                            },
                            {
                              name: "Double Magic",
                              type: "section",
                              background: true,
                              hidden: true,
                              items: [
                                {
                                  name: "Acquired",
                                  offset: 0x42,
                                  type: "variable",
                                  dataType: "boolean",
                                },
                              ],
                            },
                            {
                              name: "Double Defense",
                              offset: 0xd0,
                              type: "variable",
                              dataType: "uint8",
                              hidden: true,
                            },
                          ],
                        },
                      ],
                    },
                    {
                      name: "Owl File",
                      flex: true,
                      items: [
                        {
                          name: "Owl File",
                          type: "section",
                          background: true,
                          items: [
                            {
                              name: "Is Owl File",
                              offset: 0x20,
                              type: "variable",
                              dataType: "boolean",
                              disabled: true,
                            },
                          ],
                        },
                        {
                          id: "day",
                          name: "Day",
                          offset: 0x18,
                          type: "variable",
                          dataType: "uint32",
                          min: 1,
                          max: 3,
                        },
                        {
                          name: "Time",
                          type: "group",
                          mode: "time",
                          items: [
                            {
                              offset: 0xe,
                              type: "variable",
                              dataType: "uint16",
                              operations: [
                                { "/": 45.5 },
                                {
                                  convert: {
                                    from: "seconds",
                                    to: "minutes",
                                  },
                                },
                              ],
                              leadingZeros: 1,
                              max: 23,
                            },
                            {
                              offset: 0xe,
                              type: "variable",
                              dataType: "uint16",
                              operations: [
                                { "/": 45.5 },
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
                          name: "Owl Warp",
                          offset: 0xc,
                          type: "variable",
                          dataType: "uint8",
                          resource: "owlWarps",
                          autocomplete: true,
                        },
                        {
                          name: "Day?",
                          offset: 0x1c,
                          type: "variable",
                          dataType: "uint32",
                          hidden: true,
                        },
                      ],
                    },
                    {
                      name: "Activated Owls",
                      flex: true,
                      items: [
                        {
                          type: "bitflags",
                          flags: [
                            { offset: 0x44, bit: 0, name: "Great Bay Coast" },
                            { offset: 0x44, bit: 1, name: "Zora Cape" },
                            { offset: 0x44, bit: 2, name: "Snowhead" },
                            { offset: 0x44, bit: 3, name: "Mountain Village" },
                            { offset: 0x44, bit: 4, name: "Clock Town" },
                            { offset: 0x44, bit: 5, name: "Milk Road" },
                            { offset: 0x44, bit: 6, name: "Woodfall" },
                            { offset: 0x44, bit: 7, name: "Southern Swamp" },
                            { offset: 0x45, bit: 0, name: "Ikana Canyon" },
                            { offset: 0x45, bit: 1, name: "Stone Tower" },
                          ],
                        },
                      ],
                    },
                    {
                      name: "Songs",
                      flex: true,
                      items: [
                        {
                          type: "bitflags",
                          flags: [
                            { offset: 0xbd, bit: 4, name: "Song of Time" },
                            {
                              offset: 0xbd,
                              bit: 5,
                              name: "Song of Healing",
                            },
                            { offset: 0xbd, bit: 6, name: "Epona's Song" },
                            {
                              offset: 0xbd,
                              bit: 7,
                              name: "Song of Soaring",
                            },
                            {
                              offset: 0xbe,
                              bit: 0,
                              name: "Song of Storms",
                              separator: true,
                            },
                            {
                              offset: 0xbc,
                              bit: 6,
                              name: "Sonata of Awakening",
                            },
                            { offset: 0xbf, bit: 0, name: "Lullaby Intro" },
                            { offset: 0xbc, bit: 7, name: "Goron Lullaby" },
                            {
                              offset: 0xbd,
                              bit: 0,
                              name: "New Wave Bossa Nova",
                            },
                            {
                              offset: 0xbd,
                              bit: 1,
                              name: "Elegy of Emptiness",
                            },
                            { offset: 0xbd, bit: 2, name: "Oath to Order" },
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
                  type: "list",
                  items: [
                    {
                      name: "Boss Remains",
                      flex: true,
                      items: [
                        {
                          type: "bitflags",
                          flags: [
                            {
                              offset: 0xbc,
                              bit: 0,
                              name: "Odolwa's Remains",
                            },
                            {
                              offset: 0xbc,
                              bit: 1,
                              name: "Goht's Remains",
                            },
                            {
                              offset: 0xbc,
                              bit: 2,
                              name: "Gyorg's Remains",
                            },
                            {
                              offset: 0xbc,
                              bit: 3,
                              name: "Twinmold's Remains",
                            },
                            {
                              offset: 0xbe,
                              bit: 3,
                              name: "Quiver?",
                              hidden: true,
                            },
                            {
                              offset: 0xbe,
                              bit: 4,
                              name: "Bomb Bag?",
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
                              name: "Sword",
                              offset: 0x6e,
                              type: "variable",
                              dataType: "lower4",
                              resource: "swords",
                            },
                            {
                              name: "Shield",
                              offset: 0x6e,
                              type: "variable",
                              dataType: "upper4",
                              resource: "shields",
                            },
                          ],
                        },
                        {
                          type: "section",
                          flex: true,
                          items: [
                            {
                              id: "quiver",
                              name: "Quiver",
                              offset: 0xb8,
                              type: "variable",
                              dataType: "uint8",
                              resource: "quivers",
                            },
                            {
                              id: "bombBag",
                              name: "Bomb Bag",
                              offset: 0xb8,
                              type: "variable",
                              dataType: "uint8",
                              resource: "bombBags",
                            },
                          ],
                        },
                        {
                          type: "section",
                          flex: true,
                          items: [
                            {
                              name: "C-Left",
                              offset: 0x4e,
                              type: "variable",
                              dataType: "uint8",
                              resource: "items",
                              autocomplete: true,
                            },
                            {
                              name: "C-Down",
                              offset: 0x4d,
                              type: "variable",
                              dataType: "uint8",
                              resource: "items",
                              autocomplete: true,
                            },
                            {
                              name: "C-Right",
                              offset: 0x4c,
                              type: "variable",
                              dataType: "uint8",
                              resource: "items",
                              autocomplete: true,
                            },
                          ],
                        },
                        {
                          type: "section",
                          items: [
                            {
                              id: "wallet",
                              name: "Wallet",
                              offset: 0xb9,
                              type: "variable",
                              dataType: "uint8",
                              resource: "wallets",
                            },
                          ],
                        },
                        {
                          name: "Upgrades",
                          type: "bitflags",
                          hidden: true,
                          flags: [
                            { offset: 0xb8, bit: 0, name: "Quiver (Holds 30)" },
                            { offset: 0xb8, bit: 1, name: "Quiver (Holds 40)" },
                            { offset: 0xb8, bit: 2, name: "Bombs (Holds 20)" },
                            { offset: 0xb8, bit: 3, name: "Bombs (Holds 20)" },
                            { offset: 0xb8, bit: 4, name: "Bombs (Holds 30)" },
                            { offset: 0xb8, bit: 5, name: "???" },
                            { offset: 0xb8, bit: 6, name: "???" },
                            { offset: 0xb8, bit: 7, name: "???" },
                            { offset: 0xb9, bit: 0, name: "???" },
                            { offset: 0xb9, bit: 1, name: "???" },
                            { offset: 0xb9, bit: 2, name: "???" },
                            { offset: 0xb9, bit: 3, name: "???" },
                            { offset: 0xb9, bit: 4, name: "Adult Wallet" },
                            { offset: 0xb9, bit: 5, name: "Giant Wallet" },
                            { offset: 0xb9, bit: 6, name: "???" },
                            { offset: 0xb9, bit: 7, name: "???" },
                            { offset: 0xba, bit: 0, name: "???" },
                            { offset: 0xba, bit: 1, name: "???" },
                            { offset: 0xba, bit: 2, name: "???" },
                            { offset: 0xba, bit: 3, name: "???" },
                            { offset: 0xba, bit: 4, name: "???" },
                            { offset: 0xba, bit: 5, name: "???" },
                            { offset: 0xba, bit: 6, name: "???" },
                            { offset: 0xba, bit: 7, name: "???" },
                          ],
                        },
                      ],
                    },
                    {
                      name: "Items",
                      items: [
                        {
                          type: "section",
                          flex: true,
                          items: [
                            {
                              type: "section",
                              background: true,
                              items: [
                                {
                                  name: "Ocarina of Time",
                                  offset: 0x73,
                                  type: "variable",
                                  dataType: "boolean",
                                  on: 0x00,
                                  off: 0xff,
                                },
                                {
                                  name: "Hero's Bow",
                                  offset: 0x72,
                                  type: "variable",
                                  dataType: "boolean",
                                  on: 0x01,
                                  off: 0xff,
                                },
                                {
                                  name: "Fire Arrow",
                                  offset: 0x71,
                                  type: "variable",
                                  dataType: "boolean",
                                  on: 0x02,
                                  off: 0xff,
                                },
                                {
                                  name: "Ice Arrow",
                                  offset: 0x70,
                                  type: "variable",
                                  dataType: "boolean",
                                  on: 0x03,
                                  off: 0xff,
                                },
                                {
                                  name: "Light Arrow",
                                  offset: 0x77,
                                  type: "variable",
                                  dataType: "boolean",
                                  on: 0x04,
                                  off: 0xff,
                                  separator: true,
                                },
                                {
                                  name: "Bomb",
                                  offset: 0x75,
                                  type: "variable",
                                  dataType: "boolean",
                                  on: 0x06,
                                  off: 0xff,
                                },
                                {
                                  name: "Bombchu",
                                  offset: 0x74,
                                  type: "variable",
                                  dataType: "boolean",
                                  on: 0x07,
                                  off: 0xff,
                                },
                                {
                                  name: "Deku Stick",
                                  offset: 0x7b,
                                  type: "variable",
                                  dataType: "boolean",
                                  on: 0x08,
                                  off: 0xff,
                                },
                                {
                                  name: "Deku Nut",
                                  offset: 0x7a,
                                  type: "variable",
                                  dataType: "boolean",
                                  on: 0x09,
                                  off: 0xff,
                                },
                                {
                                  name: "Magic Beans",
                                  offset: 0x79,
                                  type: "variable",
                                  dataType: "boolean",
                                  on: 0x0a,
                                  off: 0xff,
                                  separator: true,
                                },
                                {
                                  name: "Powder Keg",
                                  offset: 0x7f,
                                  type: "variable",
                                  dataType: "boolean",
                                  on: 0x0c,
                                  off: 0xff,
                                },
                                {
                                  name: "Pictograph Box",
                                  offset: 0x7e,
                                  type: "variable",
                                  dataType: "boolean",
                                  on: 0x0d,
                                  off: 0xff,
                                },
                                {
                                  name: "Lens of Truth",
                                  offset: 0x7d,
                                  type: "variable",
                                  dataType: "boolean",
                                  on: 0x0e,
                                  off: 0xff,
                                },
                                {
                                  name: "Hookshot",
                                  offset: 0x7c,
                                  type: "variable",
                                  dataType: "boolean",
                                  on: 0x0f,
                                  off: 0xff,
                                },
                                {
                                  name: "Great Fairy's Sword",
                                  offset: 0x83,
                                  type: "variable",
                                  dataType: "boolean",
                                  on: 0x10,
                                  off: 0xff,
                                },
                              ],
                            },
                            {
                              type: "section",
                              flex1: true,
                              items: [
                                {
                                  type: "section",
                                  flex: true,
                                  items: [
                                    {
                                      name: "Quest Item 1",
                                      offset: 0x76,
                                      type: "variable",
                                      dataType: "uint8",
                                      resource: "questItems",
                                      autocomplete: true,
                                    },
                                    {
                                      name: "Quest Item 2",
                                      offset: 0x78,
                                      type: "variable",
                                      dataType: "uint8",
                                      resource: "questItems",
                                      autocomplete: true,
                                    },
                                    {
                                      name: "Quest Item 3",
                                      offset: 0x82,
                                      type: "variable",
                                      dataType: "uint8",
                                      resource: "questItems",
                                      autocomplete: true,
                                    },
                                  ],
                                },
                                {
                                  type: "section",
                                  flex: true,
                                  items: [
                                    {
                                      name: "Bottle 1",
                                      offset: 0x81,
                                      type: "variable",
                                      dataType: "uint8",
                                      resource: "bottles",
                                      autocomplete: true,
                                    },
                                    {
                                      name: "Bottle 2",
                                      offset: 0x80,
                                      type: "variable",
                                      dataType: "uint8",
                                      resource: "bottles",
                                      autocomplete: true,
                                    },
                                    {
                                      name: "Bottle 3",
                                      offset: 0x87,
                                      type: "variable",
                                      dataType: "uint8",
                                      resource: "bottles",
                                      autocomplete: true,
                                    },
                                    {
                                      name: "Bottle 4",
                                      offset: 0x86,
                                      type: "variable",
                                      dataType: "uint8",
                                      resource: "bottles",
                                      autocomplete: true,
                                    },
                                    {
                                      name: "Bottle 5",
                                      offset: 0x85,
                                      type: "variable",
                                      dataType: "uint8",
                                      resource: "bottles",
                                      autocomplete: true,
                                    },
                                    {
                                      name: "Bottle 6",
                                      offset: 0x84,
                                      type: "variable",
                                      dataType: "uint8",
                                      resource: "bottles",
                                      autocomplete: true,
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
                      name: "Quantities",
                      flex: true,
                      items: [
                        {
                          name: "Arrows",
                          offset: 0xa2,
                          type: "variable",
                          dataType: "uint8",
                          max: 50,
                        },
                        {
                          name: "Bombs",
                          offset: 0xa5,
                          type: "variable",
                          dataType: "uint8",
                          max: 40,
                        },
                        {
                          name: "Bombchus",
                          offset: 0xa4,
                          type: "variable",
                          dataType: "uint8",
                          max: 40,
                        },
                        {
                          name: "Deku Sticks",
                          offset: 0xab,
                          type: "variable",
                          dataType: "uint8",
                          max: 10,
                        },
                        {
                          name: "Deku Nuts",
                          offset: 0xaa,
                          type: "variable",
                          dataType: "uint8",
                          max: 20,
                        },
                        {
                          name: "Magic Beans",
                          offset: 0xa9,
                          type: "variable",
                          dataType: "uint8",
                          max: 20,
                        },
                        {
                          name: "Powder Kegs",
                          offset: 0xaf,
                          type: "variable",
                          dataType: "uint8",
                          max: 1,
                        },
                      ],
                    },
                    {
                      name: "Masks",
                      items: [
                        {
                          type: "section",
                          background: true,
                          flex: true,
                          items: [
                            {
                              type: "section",
                              noMargin: true,
                              items: [
                                {
                                  id: "mask",
                                  name: "Postman's Hat",
                                  offset: 0x8b,
                                  type: "variable",
                                  dataType: "boolean",
                                  on: 0x3e,
                                  off: 0xff,
                                },
                                {
                                  id: "mask",
                                  name: "All-Night Mask",
                                  offset: 0x8a,
                                  type: "variable",
                                  dataType: "boolean",
                                  on: 0x38,
                                  off: 0xff,
                                },
                                {
                                  id: "mask",
                                  name: "Blast Mask",
                                  offset: 0x89,
                                  type: "variable",
                                  dataType: "boolean",
                                  on: 0x47,
                                  off: 0xff,
                                },
                                {
                                  id: "mask",
                                  name: "Stone Mask",
                                  offset: 0x88,
                                  type: "variable",
                                  dataType: "boolean",
                                  on: 0x45,
                                  off: 0xff,
                                },
                                {
                                  id: "mask",
                                  name: "Great Fairy's Mask",
                                  offset: 0x8f,
                                  type: "variable",
                                  dataType: "boolean",
                                  on: 0x40,
                                  off: 0xff,
                                },
                                {
                                  id: "mask",
                                  name: "Deku Mask",
                                  offset: 0x8e,
                                  type: "variable",
                                  dataType: "boolean",
                                  on: 0x32,
                                  off: 0xff,
                                  separator: true,
                                },
                                {
                                  id: "mask",
                                  name: "Keaton Mask",
                                  offset: 0x8d,
                                  type: "variable",
                                  dataType: "boolean",
                                  on: 0x3a,
                                  off: 0xff,
                                },
                                {
                                  id: "mask",
                                  name: "Bremen Mask",
                                  offset: 0x8c,
                                  type: "variable",
                                  dataType: "boolean",
                                  on: 0x46,
                                  off: 0xff,
                                },
                                {
                                  id: "mask",
                                  name: "Bunny Hood",
                                  offset: 0x93,
                                  type: "variable",
                                  dataType: "boolean",
                                  on: 0x39,
                                  off: 0xff,
                                },
                                {
                                  id: "mask",
                                  name: "Don Gero's Mask",
                                  offset: 0x92,
                                  type: "variable",
                                  dataType: "boolean",
                                  on: 0x42,
                                  off: 0xff,
                                },
                                {
                                  id: "mask",
                                  name: "Mask of Scents",
                                  offset: 0x91,
                                  type: "variable",
                                  dataType: "boolean",
                                  on: 0x48,
                                  off: 0xff,
                                },
                                {
                                  id: "mask",
                                  name: "Goron Mask",
                                  offset: 0x90,
                                  type: "variable",
                                  dataType: "boolean",
                                  on: 0x33,
                                  off: 0xff,
                                },
                              ],
                            },
                            {
                              type: "section",
                              noMargin: true,
                              items: [
                                {
                                  id: "mask",
                                  name: "Romani's Mask",
                                  offset: 0x97,
                                  type: "variable",
                                  dataType: "boolean",
                                  on: 0x3c,
                                  off: 0xff,
                                },
                                {
                                  id: "mask",
                                  name: "Circus Leader's Mask",
                                  offset: 0x96,
                                  type: "variable",
                                  dataType: "boolean",
                                  on: 0x3d,
                                  off: 0xff,
                                },
                                {
                                  id: "mask",
                                  name: "Kafei's Mask",
                                  offset: 0x95,
                                  type: "variable",
                                  dataType: "boolean",
                                  on: 0x37,
                                  off: 0xff,
                                },
                                {
                                  id: "mask",
                                  name: "Couple's Mask",
                                  offset: 0x94,
                                  type: "variable",
                                  dataType: "boolean",
                                  on: 0x3f,
                                  off: 0xff,
                                },
                                {
                                  id: "mask",
                                  name: "Mask of Truth",
                                  offset: 0x9b,
                                  type: "variable",
                                  dataType: "boolean",
                                  on: 0x36,
                                  off: 0xff,
                                },
                                {
                                  id: "mask",
                                  name: "Zora Mask",
                                  offset: 0x9a,
                                  type: "variable",
                                  dataType: "boolean",
                                  on: 0x34,
                                  off: 0xff,
                                  separator: true,
                                },
                                {
                                  id: "mask",
                                  name: "Kamaro's Mask",
                                  offset: 0x99,
                                  type: "variable",
                                  dataType: "boolean",
                                  on: 0x43,
                                  off: 0xff,
                                },
                                {
                                  id: "mask",
                                  name: "Gibdo Mask",
                                  offset: 0x98,
                                  type: "variable",
                                  dataType: "boolean",
                                  on: 0x41,
                                  off: 0xff,
                                },
                                {
                                  id: "mask",
                                  name: "Garo's Mask",
                                  offset: 0x9f,
                                  type: "variable",
                                  dataType: "boolean",
                                  on: 0x3b,
                                  off: 0xff,
                                },
                                {
                                  id: "mask",
                                  name: "Captain's Hat",
                                  offset: 0x9e,
                                  type: "variable",
                                  dataType: "boolean",
                                  on: 0x44,
                                  off: 0xff,
                                },
                                {
                                  id: "mask",
                                  name: "Giant's Mask",
                                  offset: 0x9d,
                                  type: "variable",
                                  dataType: "boolean",
                                  on: 0x49,
                                  off: 0xff,
                                },
                                {
                                  id: "mask",
                                  name: "Fierce Deity's Mask",
                                  offset: 0x9c,
                                  type: "variable",
                                  dataType: "boolean",
                                  on: 0x35,
                                  off: 0xff,
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
              name: "Bombers",
              items: [
                {
                  type: "list",
                  items: [
                    {
                      name: "General",
                      flex: true,
                      items: [
                        {
                          name: "Bombers' Notebook",
                          type: "bitflags",
                          flags: [
                            {
                              offset: 0xbe,
                              bit: 2,
                              name: "Obtained",
                            },
                          ],
                        },
                        {
                          id: "hideoutCode",
                          name: "Hideout Code",
                          offset: 0xffc,
                          length: 0x4,
                          type: "variable",
                          dataType: "string",
                          bigEndian: true,
                          letterDataType: "uint8",
                          disabled: true,
                        },
                      ],
                    },
                    {
                      name: "Bombers",
                      flex: true,
                      items: [
                        {
                          type: "section",
                          flex: true,
                          items: [
                            {
                              name: "Entry",
                              type: "bitflags",
                              flags: [
                                { offset: 0xf3f, bit: 3, name: "Character" },
                              ],
                            },
                          ],
                        },
                        {
                          type: "section",
                          flex: true,
                          items: [
                            {
                              name: "1st Day",
                              type: "bitflags",
                              flags: [
                                { offset: 0xf3d, bit: 4, name: "Secret code" },
                                {
                                  offset: 0xf3d,
                                  bit: 5,
                                  name: "Bombers' Notebook",
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
                              name: "2nd Day",
                              type: "bitflags",
                              flags: [
                                { offset: 0xf3d, bit: 4, name: "Secret code" },
                                {
                                  offset: 0xf3d,
                                  bit: 5,
                                  name: "Bombers' Notebook",
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
                              name: "Final",
                              type: "bitflags",
                              flags: [
                                { offset: 0xf3d, bit: 4, name: "Secret code" },
                                {
                                  offset: 0xf3d,
                                  bit: 5,
                                  name: "Bombers' Notebook",
                                },
                              ],
                            },
                          ],
                        },
                      ],
                    },
                    {
                      name: "Anju",
                      flex: true,
                      items: [
                        {
                          type: "section",
                          flex: true,
                          items: [
                            {
                              name: "Entry",
                              type: "bitflags",
                              flags: [
                                { offset: 0xf39, bit: 0, name: "Character" },
                              ],
                            },
                          ],
                        },
                        {
                          type: "section",
                          flex: true,
                          items: [
                            {
                              name: "1st Day",
                              type: "bitflags",
                              flags: [
                                {
                                  offset: 0xf3f,
                                  bit: 4,
                                  name: "Received Room Key",
                                },
                                {
                                  offset: 0xf3f,
                                  bit: 5,
                                  name: "Secret Night Meeting",
                                },
                                {
                                  offset: 0xf3f,
                                  bit: 6,
                                  name: "Promised to meet Kafei",
                                },
                                {
                                  offset: 0xf3f,
                                  bit: 7,
                                  name: "Received Letter to Kafei",
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
                              name: "2nd Day",
                              type: "bitflags",
                              flags: [
                                {
                                  offset: 0xf3e,
                                  bit: 2,
                                  name: "Delivered Pendant",
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
                              name: "Final",
                              type: "bitflags",
                              flags: [
                                {
                                  offset: 0xf3e,
                                  bit: 2,
                                  name: "Delivered Pendant",
                                },
                                {
                                  offset: 0xf43,
                                  bit: 2,
                                  name: "Couple's Mask",
                                },
                              ],
                            },
                          ],
                        },
                      ],
                    },
                    {
                      name: "Kafei",
                      flex: true,
                      items: [
                        {
                          type: "section",
                          flex: true,
                          items: [
                            {
                              name: "Entry",
                              type: "bitflags",
                              flags: [
                                { offset: 0xf39, bit: 1, name: "Character" },
                              ],
                            },
                          ],
                        },
                        {
                          type: "section",
                          flex: true,
                          items: [
                            { name: "1st Day", type: "bitflags", flags: [] },
                          ],
                        },
                        {
                          type: "section",
                          flex: true,
                          items: [
                            {
                              name: "2nd Day",
                              type: "bitflags",
                              flags: [
                                {
                                  offset: 0xf3e,
                                  bit: 1,
                                  name: "Pendant of Memories",
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
                              name: "Final",
                              type: "bitflags",
                              flags: [
                                {
                                  offset: 0xf3e,
                                  bit: 3,
                                  name: "Escaped from Sakon's Hideout",
                                },
                                {
                                  offset: 0xf43,
                                  bit: 2,
                                  name: "Couple's Mask",
                                },
                              ],
                            },
                          ],
                        },
                      ],
                    },
                    {
                      name: "Man from Curiosity Shop",
                      flex: true,
                      items: [
                        {
                          type: "section",
                          flex: true,
                          items: [
                            {
                              name: "Entry",
                              type: "bitflags",
                              flags: [
                                { offset: 0xf39, bit: 2, name: "Character" },
                              ],
                            },
                          ],
                        },
                        {
                          type: "section",
                          flex: true,
                          items: [
                            { name: "1st Day", type: "bitflags", flags: [] },
                          ],
                        },
                        {
                          type: "section",
                          flex: true,
                          items: [
                            {
                              name: "2nd Day",
                              type: "bitflags",
                              flags: [],
                            },
                          ],
                        },
                        {
                          type: "section",
                          flex: true,
                          items: [
                            {
                              name: "Final",
                              type: "bitflags",
                              flags: [
                                { offset: 0xf3d, bit: 1, name: "Keaton Mask" },
                                {
                                  offset: 0xf3d,
                                  bit: 2,
                                  name: "Letter to Mama",
                                },
                                {
                                  offset: 0xf3c,
                                  bit: 5,
                                  name: "All-Night Mask",
                                },
                              ],
                            },
                          ],
                        },
                      ],
                    },
                    {
                      name: "Old Lady from Bomb Shop",
                      flex: true,
                      items: [
                        {
                          type: "section",
                          flex: true,
                          items: [
                            {
                              name: "Entry",
                              type: "bitflags",
                              flags: [
                                { offset: 0xf39, bit: 3, name: "Character" },
                              ],
                            },
                          ],
                        },
                        {
                          type: "section",
                          flex: true,
                          items: [
                            {
                              name: "1st Day",
                              type: "bitflags",
                              flags: [
                                { offset: 0xf43, bit: 3, name: "Blast Mask" },
                              ],
                            },
                          ],
                        },
                        {
                          type: "section",
                          flex: true,
                          items: [
                            {
                              name: "2nd Day",
                              type: "bitflags",
                              flags: [],
                            },
                          ],
                        },
                        {
                          type: "section",
                          flex: true,
                          items: [
                            {
                              name: "Final",
                              type: "bitflags",
                              flags: [],
                            },
                          ],
                        },
                      ],
                    },
                    {
                      name: "Romani",
                      flex: true,
                      items: [
                        {
                          type: "section",
                          flex: true,
                          items: [
                            {
                              name: "Entry",
                              type: "bitflags",
                              flags: [
                                { offset: 0xf39, bit: 4, name: "Character" },
                              ],
                            },
                          ],
                        },
                        {
                          type: "section",
                          flex: true,
                          items: [
                            {
                              name: "1st Day",
                              type: "bitflags",
                              flags: [
                                {
                                  offset: 0xf3e,
                                  bit: 4,
                                  name: "Became ranch hand",
                                },
                                {
                                  offset: 0xf3e,
                                  bit: 5,
                                  name: 'Saved cows from "them"',
                                },
                                { offset: 0xf3e, bit: 6, name: "Milk Bottle" },
                              ],
                            },
                          ],
                        },
                        {
                          type: "section",
                          flex: true,
                          items: [
                            {
                              name: "2nd Day",
                              type: "bitflags",
                              flags: [],
                            },
                          ],
                        },
                        {
                          type: "section",
                          flex: true,
                          items: [
                            {
                              name: "Final",
                              type: "bitflags",
                              flags: [],
                            },
                          ],
                        },
                      ],
                    },
                    {
                      name: "Cremia",
                      flex: true,
                      items: [
                        {
                          type: "section",
                          flex: true,
                          items: [
                            {
                              name: "Entry",
                              type: "bitflags",
                              flags: [
                                { offset: 0xf39, bit: 5, name: "Character" },
                              ],
                            },
                          ],
                        },
                        {
                          type: "section",
                          flex: true,
                          items: [
                            { name: "1st Day", type: "bitflags", flags: [] },
                          ],
                        },
                        {
                          type: "section",
                          flex: true,
                          items: [
                            {
                              name: "2nd Day",
                              type: "bitflags",
                              flags: [
                                {
                                  offset: 0xf3e,
                                  bit: 7,
                                  name: "Protected milk delivery",
                                },
                                {
                                  offset: 0xf3d,
                                  bit: 0,
                                  name: "Romani's Mask",
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
                              name: "Final",
                              type: "bitflags",
                              flags: [],
                            },
                          ],
                        },
                      ],
                    },
                    {
                      name: "Mr. Dotour",
                      flex: true,
                      items: [
                        {
                          type: "section",
                          flex: true,
                          items: [
                            {
                              name: "Entry",
                              type: "bitflags",
                              flags: [
                                { offset: 0xf39, bit: 6, name: "Character" },
                              ],
                            },
                          ],
                        },
                        {
                          type: "section",
                          flex: true,
                          items: [
                            {
                              name: "1st Day",
                              type: "bitflags",
                              flags: [
                                {
                                  offset: 0xf3d,
                                  bit: 6,
                                  name: "Dotour's Thanks",
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
                              name: "2nd Day",
                              type: "bitflags",
                              flags: [
                                {
                                  offset: 0xf3d,
                                  bit: 6,
                                  name: "Dotour's Thanks",
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
                              name: "Final",
                              type: "bitflags",
                              flags: [
                                {
                                  offset: 0xf3d,
                                  bit: 6,
                                  name: "Dotour's Thanks",
                                },
                              ],
                            },
                          ],
                        },
                      ],
                    },
                    {
                      name: "Madame Aroma",
                      flex: true,
                      items: [
                        {
                          type: "section",
                          flex: true,
                          items: [
                            {
                              name: "Entry",
                              type: "bitflags",
                              flags: [
                                { offset: 0xf39, bit: 7, name: "Character" },
                              ],
                            },
                          ],
                        },
                        {
                          type: "section",
                          flex: true,
                          items: [
                            {
                              name: "1st Day",
                              type: "bitflags",
                              flags: [
                                { offset: 0xf3c, bit: 4, name: "Kafei's Mask" },
                              ],
                            },
                          ],
                        },
                        {
                          type: "section",
                          flex: true,
                          items: [
                            {
                              name: "2nd Day",
                              type: "bitflags",
                              flags: [
                                { offset: 0xf3c, bit: 4, name: "Kafei's Mask" },
                              ],
                            },
                          ],
                        },
                        {
                          type: "section",
                          flex: true,
                          items: [
                            {
                              name: "Final",
                              type: "bitflags",
                              flags: [
                                {
                                  offset: 0xf3d,
                                  bit: 3,
                                  name: "Chateau Romani",
                                },
                              ],
                            },
                          ],
                        },
                      ],
                    },
                    {
                      name: "Toto",
                      flex: true,
                      items: [
                        {
                          type: "section",
                          flex: true,
                          items: [
                            {
                              name: "Entry",
                              type: "bitflags",
                              flags: [
                                { offset: 0xf38, bit: 0, name: "Character" },
                              ],
                            },
                          ],
                        },
                        {
                          type: "section",
                          flex: true,
                          items: [
                            {
                              name: "1st Day",
                              type: "bitflags",
                              flags: [
                                {
                                  offset: 0xf43,
                                  bit: 0,
                                  name: "Circus Leader's Mask",
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
                              name: "2nd Day",
                              type: "bitflags",
                              flags: [
                                {
                                  offset: 0xf43,
                                  bit: 0,
                                  name: "Circus Leader's Mask",
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
                              name: "Final",
                              type: "bitflags",
                              flags: [],
                            },
                          ],
                        },
                      ],
                    },
                    {
                      name: "Gorman",
                      flex: true,
                      items: [
                        {
                          type: "section",
                          flex: true,
                          items: [
                            {
                              name: "Entry",
                              type: "bitflags",
                              flags: [
                                { offset: 0xf38, bit: 1, name: "Character" },
                              ],
                            },
                          ],
                        },
                        {
                          type: "section",
                          flex: true,
                          items: [
                            {
                              name: "1st Day",
                              type: "bitflags",
                              flags: [
                                {
                                  offset: 0xf43,
                                  bit: 0,
                                  name: "Circus Leader's Mask",
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
                              name: "2nd Day",
                              type: "bitflags",
                              flags: [
                                {
                                  offset: 0xf43,
                                  bit: 0,
                                  name: "Circus Leader's Mask",
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
                              name: "Final",
                              type: "bitflags",
                              flags: [],
                            },
                          ],
                        },
                      ],
                    },
                    {
                      name: "Postman",
                      flex: true,
                      items: [
                        {
                          type: "section",
                          flex: true,
                          items: [
                            {
                              name: "Entry",
                              type: "bitflags",
                              flags: [
                                { offset: 0xf38, bit: 2, name: "Character" },
                              ],
                            },
                          ],
                        },
                        {
                          type: "section",
                          flex: true,
                          items: [
                            {
                              name: "1st Day",
                              type: "bitflags",
                              flags: [
                                {
                                  offset: 0xf3c,
                                  bit: 3,
                                  name: "Training Award",
                                },
                                {
                                  offset: 0xf3e,
                                  bit: 0,
                                  name: "Deposit Letter to Kafei",
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
                              name: "2nd Day",
                              type: "bitflags",
                              flags: [
                                {
                                  offset: 0xf3e,
                                  bit: 0,
                                  name: "Deposit Letter to Kafei",
                                },
                                {
                                  offset: 0xf3c,
                                  bit: 3,
                                  name: "Training Award",
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
                              name: "Final",
                              type: "bitflags",
                              flags: [
                                {
                                  offset: 0xf43,
                                  bit: 1,
                                  name: "Postman's Hat",
                                },
                              ],
                            },
                          ],
                        },
                      ],
                    },
                    {
                      name: "Rosa Sisters",
                      flex: true,
                      items: [
                        {
                          type: "section",
                          flex: true,
                          items: [
                            {
                              name: "Entry",
                              type: "bitflags",
                              flags: [
                                { offset: 0xf38, bit: 3, name: "Character" },
                              ],
                            },
                          ],
                        },
                        {
                          type: "section",
                          flex: true,
                          items: [
                            {
                              name: "1st Day",
                              type: "bitflags",
                              flags: [
                                {
                                  offset: 0xf3d,
                                  bit: 7,
                                  name: "Rosa sisters' thanks",
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
                              name: "2nd Day",
                              type: "bitflags",
                              flags: [
                                {
                                  offset: 0xf3d,
                                  bit: 7,
                                  name: "Rosa sisters' thanks",
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
                              name: "Final",
                              type: "bitflags",
                              flags: [],
                            },
                          ],
                        },
                      ],
                    },
                    {
                      name: "???",
                      flex: true,
                      items: [
                        {
                          type: "section",
                          flex: true,
                          items: [
                            {
                              name: "Entry",
                              type: "bitflags",
                              flags: [
                                { offset: 0xf38, bit: 4, name: "Character" },
                              ],
                            },
                          ],
                        },
                        {
                          type: "section",
                          flex: true,
                          items: [
                            {
                              name: "1st Day",
                              type: "bitflags",
                              flags: [
                                {
                                  offset: 0xf3c,
                                  bit: 0,
                                  name: "Thanks for the paper",
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
                              name: "2nd Day",
                              type: "bitflags",
                              flags: [
                                {
                                  offset: 0xf3c,
                                  bit: 0,
                                  name: "Thanks for the paper",
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
                              name: "Final",
                              type: "bitflags",
                              flags: [
                                {
                                  offset: 0xf3c,
                                  bit: 0,
                                  name: "Thanks for the paper",
                                },
                              ],
                            },
                          ],
                        },
                      ],
                    },
                    {
                      name: "Anju's Grandmother",
                      flex: true,
                      items: [
                        {
                          type: "section",
                          flex: true,
                          items: [
                            {
                              name: "Entry",
                              type: "bitflags",
                              flags: [
                                { offset: 0xf38, bit: 5, name: "Character" },
                              ],
                            },
                          ],
                        },
                        {
                          type: "section",
                          flex: true,
                          items: [
                            {
                              name: "1st Day",
                              type: "bitflags",
                              flags: [
                                {
                                  offset: 0xf3c,
                                  bit: 1,
                                  name: "Reading Prize 1",
                                },
                                {
                                  offset: 0xf3c,
                                  bit: 2,
                                  name: "Reading Prize 2",
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
                              name: "2nd Day",
                              type: "bitflags",
                              flags: [
                                {
                                  offset: 0xf3c,
                                  bit: 1,
                                  name: "Reading Prize 1",
                                },
                                {
                                  offset: 0xf3c,
                                  bit: 2,
                                  name: "Reading Prize 2",
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
                              name: "Final",
                              type: "bitflags",
                              flags: [],
                            },
                          ],
                        },
                      ],
                    },
                    {
                      name: "Kamaro",
                      flex: true,
                      items: [
                        {
                          type: "section",
                          flex: true,
                          items: [
                            {
                              name: "Entry",
                              type: "bitflags",
                              flags: [
                                { offset: 0xf38, bit: 6, name: "Character" },
                              ],
                            },
                          ],
                        },
                        {
                          type: "section",
                          flex: true,
                          items: [
                            {
                              name: "1st Day",
                              type: "bitflags",
                              flags: [
                                {
                                  offset: 0xf43,
                                  bit: 4,
                                  name: "Kamaro's Mask",
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
                              name: "2nd Day",
                              type: "bitflags",
                              flags: [
                                {
                                  offset: 0xf43,
                                  bit: 4,
                                  name: "Kamaro's Mask",
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
                              name: "Final",
                              type: "bitflags",
                              flags: [
                                {
                                  offset: 0xf43,
                                  bit: 4,
                                  name: "Kamaro's Mask",
                                },
                              ],
                            },
                          ],
                        },
                      ],
                    },
                    {
                      name: "Grog",
                      flex: true,
                      items: [
                        {
                          type: "section",
                          flex: true,
                          items: [
                            {
                              name: "Entry",
                              type: "bitflags",
                              flags: [
                                { offset: 0xf38, bit: 7, name: "Character" },
                              ],
                            },
                          ],
                        },
                        {
                          type: "section",
                          flex: true,
                          items: [
                            {
                              name: "1st Day",
                              type: "bitflags",
                              flags: [
                                { offset: 0xf3c, bit: 6, name: "Bunny Hood" },
                              ],
                            },
                          ],
                        },
                        {
                          type: "section",
                          flex: true,
                          items: [
                            {
                              name: "2nd Day",
                              type: "bitflags",
                              flags: [
                                { offset: 0xf3c, bit: 6, name: "Bunny Hood" },
                              ],
                            },
                          ],
                        },
                        {
                          type: "section",
                          flex: true,
                          items: [
                            {
                              name: "Final",
                              type: "bitflags",
                              flags: [
                                { offset: 0xf3c, bit: 6, name: "Bunny Hood" },
                              ],
                            },
                          ],
                        },
                      ],
                    },
                    {
                      name: "Gorman Brothers",
                      flex: true,
                      items: [
                        {
                          type: "section",
                          flex: true,
                          items: [
                            {
                              name: "Entry",
                              type: "bitflags",
                              flags: [
                                { offset: 0xf3f, bit: 0, name: "Character" },
                              ],
                            },
                          ],
                        },
                        {
                          type: "section",
                          flex: true,
                          items: [
                            {
                              name: "1st Day",
                              type: "bitflags",
                              flags: [
                                { offset: 0xf3c, bit: 7, name: "Garo's Mask" },
                              ],
                            },
                          ],
                        },
                        {
                          type: "section",
                          flex: true,
                          items: [
                            {
                              name: "2nd Day",
                              type: "bitflags",
                              flags: [
                                { offset: 0xf3c, bit: 7, name: "Garo's Mask" },
                                {
                                  offset: 0xf3e,
                                  bit: 7,
                                  name: "Protected milk delivery",
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
                              name: "Final",
                              type: "bitflags",
                              flags: [
                                { offset: 0xf3c, bit: 7, name: "Garo's Mask" },
                              ],
                            },
                          ],
                        },
                      ],
                    },
                    {
                      name: "Shiro",
                      flex: true,
                      items: [
                        {
                          type: "section",
                          flex: true,
                          items: [
                            {
                              name: "Entry",
                              type: "bitflags",
                              flags: [
                                { offset: 0xf3f, bit: 1, name: "Character" },
                              ],
                            },
                          ],
                        },
                        {
                          type: "section",
                          flex: true,
                          items: [
                            {
                              name: "1st Day",
                              type: "bitflags",
                              flags: [
                                { offset: 0xf43, bit: 5, name: "Stone Mask" },
                              ],
                            },
                          ],
                        },
                        {
                          type: "section",
                          flex: true,
                          items: [
                            {
                              name: "2nd Day",
                              type: "bitflags",
                              flags: [
                                { offset: 0xf43, bit: 5, name: "Stone Mask" },
                              ],
                            },
                          ],
                        },
                        {
                          type: "section",
                          flex: true,
                          items: [
                            {
                              name: "Final",
                              type: "bitflags",
                              flags: [
                                { offset: 0xf43, bit: 5, name: "Stone Mask" },
                              ],
                            },
                          ],
                        },
                      ],
                    },
                    {
                      name: "Guru-Guru",
                      flex: true,
                      items: [
                        {
                          type: "section",
                          flex: true,
                          items: [
                            {
                              name: "Entry",
                              type: "bitflags",
                              flags: [
                                { offset: 0xf3f, bit: 2, name: "Character" },
                              ],
                            },
                          ],
                        },
                        {
                          type: "section",
                          flex: true,
                          items: [
                            {
                              name: "1st Day",
                              type: "bitflags",
                              flags: [
                                { offset: 0xf43, bit: 6, name: "Bremen Mask" },
                              ],
                            },
                          ],
                        },
                        {
                          type: "section",
                          flex: true,
                          items: [
                            {
                              name: "2nd Day",
                              type: "bitflags",
                              flags: [
                                { offset: 0xf43, bit: 6, name: "Bremen Mask" },
                              ],
                            },
                          ],
                        },
                        {
                          type: "section",
                          flex: true,
                          items: [
                            {
                              name: "Final",
                              type: "bitflags",
                              flags: [],
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
              name: "Dungeons",
              items: [
                {
                  type: "list",
                  items: [
                    {
                      name: "Woodfall Temple",
                      flex: true,
                      items: [
                        {
                          name: "Events",
                          type: "bitflags",
                          flags: [
                            { offset: 0xf0f, bit: 0, name: "Dungeon emerged" },
                            { offset: 0xf0f, bit: 1, name: "Dungeon cleared" },
                          ],
                        },
                        {
                          name: "Items",
                          type: "bitflags",
                          flags: [
                            { offset: 0xc3, bit: 0, name: "Boss Key" },
                            { offset: 0xc3, bit: 1, name: "Compass" },
                            { offset: 0xc3, bit: 2, name: "Map" },
                            { offset: 0xc3, bit: 3, name: "???", hidden: true },
                            { offset: 0xc3, bit: 4, name: "???", hidden: true },
                            { offset: 0xc3, bit: 5, name: "???", hidden: true },
                            { offset: 0xc3, bit: 6, name: "???", hidden: true },
                            { offset: 0xc3, bit: 7, name: "???", hidden: true },
                            { offset: 0x46f, bit: 7, name: "Heart Container" },
                          ],
                        },
                        {
                          name: "Keys",
                          offset: 0xc9,
                          type: "variable",
                          dataType: "uint8",
                        },
                        {
                          name: "Stray Fairy Count",
                          offset: 0xd7,
                          type: "variable",
                          dataType: "uint8",
                          max: 15,
                        },
                      ],
                    },
                    {
                      name: "Snowhead Temple",
                      flex: true,
                      items: [
                        {
                          name: "Events",
                          type: "bitflags",
                          flags: [
                            { offset: 0xf15, bit: 0, name: "Dungeon emerged" },
                            { offset: 0xf1a, bit: 7, name: "Dungeon cleared" },
                          ],
                        },
                        {
                          name: "Items",
                          type: "bitflags",
                          flags: [
                            { offset: 0xc2, bit: 0, name: "Boss Key" },
                            { offset: 0xc2, bit: 1, name: "Compass" },
                            { offset: 0xc2, bit: 2, name: "Map" },
                            { offset: 0xc2, bit: 3, name: "???", hidden: true },
                            { offset: 0xc2, bit: 4, name: "???", hidden: true },
                            { offset: 0xc2, bit: 5, name: "???", hidden: true },
                            { offset: 0xc2, bit: 6, name: "???", hidden: true },
                            { offset: 0xc2, bit: 7, name: "???", hidden: true },
                            { offset: 0x87b, bit: 7, name: "Heart Container" },
                          ],
                        },
                        {
                          name: "Keys",
                          offset: 0xc8,
                          type: "variable",
                          dataType: "uint8",
                        },
                        {
                          name: "Stray Fairy Count",
                          offset: 0xd6,
                          type: "variable",
                          dataType: "uint8",
                          max: 15,
                        },
                      ],
                    },
                    {
                      name: "Great Bay Temple",
                      flex: true,
                      items: [
                        {
                          name: "Events",
                          type: "bitflags",
                          flags: [
                            { offset: 0xf2e, bit: 5, name: "Dungeon emerged" },
                            { offset: 0xf2c, bit: 7, name: "Dungeon cleared" },
                          ],
                        },
                        {
                          name: "Items",
                          type: "bitflags",
                          flags: [
                            { offset: 0xc1, bit: 0, name: "Boss Key" },
                            { offset: 0xc1, bit: 1, name: "Compass" },
                            { offset: 0xc1, bit: 2, name: "Map" },
                            { offset: 0xc1, bit: 3, name: "???", hidden: true },
                            { offset: 0xc1, bit: 4, name: "???", hidden: true },
                            { offset: 0xc1, bit: 5, name: "???", hidden: true },
                            { offset: 0xc1, bit: 6, name: "???", hidden: true },
                            { offset: 0xc1, bit: 7, name: "???", hidden: true },
                            { offset: 0xb6f, bit: 7, name: "Heart Container" },
                          ],
                        },
                        {
                          name: "Keys",
                          offset: 0xcf,
                          type: "variable",
                          dataType: "uint8",
                        },
                        {
                          name: "Stray Fairy Count",
                          offset: 0xd5,
                          type: "variable",
                          dataType: "uint8",
                          max: 15,
                        },
                      ],
                    },
                    {
                      name: "Stone Tower Temple",
                      flex: true,
                      items: [
                        {
                          name: "Events",
                          type: "bitflags",
                          flags: [
                            { offset: 0xa9e, bit: 4, name: "Dungeon reversed" },
                            { offset: 0xf2f, bit: 5, name: "Dungeon cleared" },
                          ],
                        },
                        {
                          name: "Items",
                          type: "bitflags",
                          flags: [
                            { offset: 0xc0, bit: 0, name: "Boss Key" },
                            { offset: 0xc0, bit: 1, name: "Compass" },
                            { offset: 0xc0, bit: 2, name: "Map" },
                            { offset: 0xc0, bit: 3, name: "???", hidden: true },
                            { offset: 0xc0, bit: 4, name: "???", hidden: true },
                            { offset: 0xc0, bit: 5, name: "???", hidden: true },
                            { offset: 0xc0, bit: 6, name: "???", hidden: true },
                            { offset: 0xc0, bit: 7, name: "???", hidden: true },
                            { offset: 0x6f3, bit: 7, name: "Heart Container" },
                          ],
                        },
                        {
                          name: "Keys",
                          offset: 0xce,
                          type: "variable",
                          dataType: "uint8",
                        },
                        {
                          name: "Stray Fairy Count",
                          offset: 0xd4,
                          type: "variable",
                          dataType: "uint8",
                          max: 15,
                        },
                      ],
                    },
                  ],
                },
              ],
            },
            {
              name: "Events",
              flex: true,
              items: [
                {
                  type: "list",
                  items: [
                    {
                      name: "Miscellaneous",
                      flex: true,
                      items: [
                        {
                          type: "bitflags",
                          flags: [
                            { offset: 0x6, bit: 0, name: "Introduction Completed" },
                            { offset: 0x4b4, bit: 1, name: "<b>Milk Road</b>: Boulder destroyed" },
                          ],
                        },
                        {
                          id: "coloredMasks",
                          name: "Colored Mask Order",
                          offset: 0xff4,
                          length: 0x3,
                          type: "variable",
                          dataType: "string",
                          bigEndian: true,
                          letterDataType: "uint8",
                          disabled: true,
                        },
                      ],
                    },
                    {
                      name: "Bottles",
                      items: [
                        {
                          type: "bitflags",
                          flags: [
                            { offset: 0x64b, bit: 7, name: "<b>Ikana Graveyard</b>: Chest inside a tomb" },
                            { offset: 0xf07, bit: 4, name: "<b>Southern Swamp</b>: Given by Koume to rescue her sister" },
                            { offset: 0xf0c, bit: 7, name: "<b>Zora Cape</b>: Beavers race won" },
                            { offset: 0xf0d, bit: 1, name: "<b>Romani Ranch</b>: Romani notebook entry completed" },
                            { offset: 0xf22, bit: 3, name: "<b>Goron Village</b>: Goron race won" },
                            { offset: 0xf32, bit: 3, name: "<b>Clock Town</b>: Amora notebook entry completed" },
                          ],
                        },
                      ],
                    },
                    {
                      name: "Heart Pieces",
                      items: [
                        {
                          type: "bitflags",
                          flags: [
                            { offset: 0xd2d, bit: 2, name: "<b>South Clock Town:</b> Business Deku Scrub" },
                            { offset: 0xd11, bit: 2, name: "<b>North Clock Town:</b> Top of a tree" },
                            { offset: 0xf34, bit: 5, name: "<b>West Clock Town:</b> Swordman's School Expert Training completed" },
                            { offset: 0x1cd, bit: 3, name: "<b>Termina Field:</b> Pea Hat defeated on cavern" },
                            { offset: 0x1cd, bit: 2, name: "<b>Termina Field:</b> Dodongos defeated on cavern" },
                            { offset: 0xf05, bit: 7, name: "<b>North Clock Town:</b> Deku Scrub Playground won 3 days" },
                            { offset: 0xf46, bit: 0, name: "<b>West Clock Town:</b> Postman challenge" },
                            { offset: 0xf40, bit: 7, name: "<b>West Clock Town:</b> Dance with Rosa Sisters" },
                            { offset: 0xf42, bit: 3, name: "<b>East Clock Town:</b> Paper given to ???" },
                            { offset: 0xf2e, bit: 1, name: "<b>Termina Field:</b> Business Deku Scrub on cavern near Astral Observatory" },
                            { offset: 0xf44, bit: 7, name: "<b>North Clock Town:</b> Keaton Quizz won" },
                            { offset: 0xf4a, bit: 3, name: "<b>Clock Town:</b> Mailbox checked with Postman's Hat" },
                            { offset: 0x808, bit: 1, name: "<b>Road to Southern Swamp:</b> Top of a tree" },
                            { offset: 0x897, bit: 6, name: "<b>Southern Swamp:</b> Business Deku Scrub" },
                            { offset: 0xf4c, bit: 2, name: "<b>Southern Swamp:</b> Pictograh contest won" },
                            { offset: 0x5bf, bit: 6, name: "<b>Deku Palace:</b> Left maze completed" },
                            { offset: 0x8b1, bit: 2, name: "<b>Woodfall:</b> Chest near Woodfall Temple" },
                            { offset: 0xf51, bit: 4, name: "<b>Termina Field:</b> Gossip Stones" },
                            { offset: 0xf11, bit: 6, name: "<b>Southern Swamp:</b> Bow mini-game on Tourist Center" },
                            { offset: 0xf03, bit: 5, name: "<b>Romani Ranch:</b> Dog race won" },
                            { offset: 0xf1b, bit: 2, name: "<b>East Clock Town:</b> Town Shooting Gallery" },
                            { offset: 0xf1b, bit: 1, name: "<b>Road to Southern Swamp:</b> Swamp Shooting Gallery" },
                            { offset: 0xf0d, bit: 7, name: "<b>East Clock Town:</b> Honey & Darkling's game won 3 days" },
                            { offset: 0x977, bit: 6, name: "<b>Goron Village:</b> Business Deku Scrub" },
                            { offset: 0x380, bit: 1, name: "<b>East Clock Town:</b> Treasure Chest Game wonf" },
                            { offset: 0x25b, bit: 7, name: "<b>Ikana Graveyard:</b> Chest inside a tomb" },
                            { offset: 0x1cc, bit: 2, name: "<b>Termina Field:</b> Beehive on a cave near Great Bay Entrance" },
                            { offset: 0xf33, bit: 1, name: "<b>Great Bay Coast:</b> Fishs fed on Marine Research Lab" },
                            { offset: 0x728, bit: 7, name: "<b>Zora Cape:</b> Like Like into deep bassin defeated" },
                            { offset: 0x4dd, bit: 4, name: "<b>Pirates' Fortress:</b> In a cell" },
                            { offset: 0xf1b, bit: 0, name: "<b>Pinnacle Rock:</b> Couples of seahorses reunited" },
                            { offset: 0xf1c, bit: 5, name: "<b>Zora Hall:</b> Even's Melody" },
                            { offset: 0x95b, bit: 6, name: "<b>Zora Hall:</b> Business Deku Scrub in Mikau's Room" },
                            { offset: 0xf12, bit: 0, name: "<b>Zora Cape:</b> Beavers race won" },
                            { offset: 0xafd, bit: 0, name: "<b>Road to Snowhead:</b> Scarecrow spot on ravine zone" },
                            { offset: 0x70c, bit: 5, name: "<b>Great Bay Coast:</b> Near a soft soil and the Scarecrow spot" },
                            { offset: 0x56b, bit: 7, name: "<b>Great Bay Coast:</b> Colored masks in Skulltula House" },
                            { offset: 0xf29, bit: 1, name: "<b>East Clock Town:</b> Anju's grandmother's first story" },
                            { offset: 0xf29, bit: 2, name: "<b>East Clock Town:</b> Anju's grandmother's second story" },
                            { offset: 0x31f, bit: 6, name: "<b>Ikana Canyon:</b> Business Deku Scrub" },
                            { offset: 0xf37, bit: 4, name: "<b>East Clock Town:</b> Talked to the mayor with the Couple's Mask" },
                            { offset: 0xb34, bit: 7, name: "<b>Road to Goron Village:</b> Chest under the lake" },
                            { offset: 0xf18, bit: 7, name: "<b>Mountain Village:</b> All frogs retrieved" },
                            { offset: 0xf49, bit: 4, name: "<b>Great Bay Coast:</b> Fisherman's jumping game won" },
                            { offset: 0xf2d, bit: 6, name: "<b>Ikana Canyon:</b> Ghosts challenge in a house" },
                            { offset: 0x435, bit: 2, name: "<b>Ancient Castle of Ikana:</b> Deku Flowers" },
                            { offset: 0xb89, bit: 2, name: "<b>Ikana Canyon:</b> Mini-bosses challenge on Secret Shine" },
                            { offset: 0xf30, bit: 3, name: "<b>Clock Town:</b> 5000 Rupees collected on Clock Town Bank" },
                            { offset: 0x5a0, bit: 1, name: "<b>The Moon:</b> Odolwa's mini-dungeon" },
                            { offset: 0x7ec, bit: 1, name: "<b>The Moon:</b> Ghot's mini-dungeon" },
                            { offset: 0x8cc, bit: 1, name: "<b>The Moon:</b> Gyorg's mini-dungeon" },
                            { offset: 0xc30, bit: 1, name: "<b>The Moon:</b> Twinmold's mini-dungeon" },
                          ],
                        },
                      ],
                    },
                    {
                      name: "Tingle Maps",
                      items: [
                        {
                          type: "bitflags",
                          flags: [
                            { offset: 0xf18, bit: 0, name: "Clock Town" },
                            { offset: 0xf18, bit: 1, name: "Woodfall" },
                            { offset: 0xf18, bit: 2, name: "Snowhead" },
                            { offset: 0xf18, bit: 3, name: "Romani Ranch" },
                            { offset: 0xf18, bit: 4, name: "Great Bay" },
                            { offset: 0xf18, bit: 5, name: "Stone Tower" },
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
    bombBags: {
      0x0: "-",
      0x1: "Bomb Bag",
      0x2: "Big Bomb Bag",
      0x3: "Biggest Bomb Bag",
    },
    bottles: {
      0x12: "Empty Bottle",
      0x13: "Red Potion",
      0x14: "Green Potion",
      0x15: "Blue Potion",
      0x16: "Fairy",
      0x17: "Deku Princess",
      0x18: "Milk",
      0x19: "Milk Half",
      0x1a: "Fish",
      0x1b: "Bug",
      0x1c: "Blue Fire",
      0x1d: "Poe",
      0x1e: "Big Poe",
      0x1f: "Spring Water",
      0x20: "Hot Spring Water",
      0x21: "Zora Egg",
      0x22: "Gold Dust",
      0x23: "Magical Mushroom",
      0x24: "Sea Horse",
      0x25: "Chateau Romani",
      0xff: "-",
    },
    items: [
      {
        0x00: "Ocarina of Time",
        0x01: "Hero's Bow",
        0x02: "Fire Arrow",
        0x03: "Ice Arrow",
        0x04: "Light Arrow",
        0x06: "Bomb",
        0x07: "Bombchu",
        0x08: "Deku Stick",
        0x09: "Deku Nut",
        0x0a: "Magic Beans",
        0x0c: "Powder Keg",
        0x0d: "Pictograph Box",
        0x0e: "Lens of Truth",
        0x0f: "Hookshot",
        0x10: "Great Fairy's Sword",
        0x12: "Empty Bottle",
        0x13: "Red Potion",
        0x14: "Green Potion",
        0x15: "Blue Potion",
        0x16: "Fairy",
        0x17: "Deku Princess",
        0x18: "Milk",
        0x19: "Milk Half",
        0x1a: "Fish",
        0x1b: "Bug",
        0x1c: "Blue Fire",
        0x1d: "Poe",
        0x1e: "Big Poe",
        0x1f: "Spring Water",
        0x20: "Hot Spring Water",
        0x21: "Zora Egg",
        0x22: "Gold Dust",
        0x23: "Magical Mushroom",
        0x24: "Sea Horse",
        0x25: "Chateau Romani",
        0x28: "Moon's Tear",
        0x29: "Land Title Deed",
        0x2a: "Swamp Title Deed",
        0x2b: "Mountain Title Deed",
        0x2c: "Ocean Title Deed",
        0x2d: "Room Key",
        0x2e: "Special Delivery to Mama",
        0x2f: "Letter to Kafei",
        0x30: "Pedant of Memories",
        0x32: "Deku Mask",
        0x33: "Goron Mask",
        0x34: "Zora Mask",
        0x35: "Fierce Deity's Mask",
        0x36: "Mask of Truth",
        0x37: "Kafei's Mask",
        0x38: "All-Night Mask",
        0x39: "Bunny Hood",
        0x3a: "Keaton Mask",
        0x3b: "Garo's Mask",
        0x3c: "Romani's Mask",
        0x3d: "Circus Leader's Mask",
        0x3e: "Postman's Hat",
        0x3f: "Couple's Mask",
        0x40: "Great Fairy's Mask",
        0x41: "Gibdo Mask",
        0x42: "Don Gero's Mask",
        0x43: "Kamaro's Mask",
        0x44: "Captain's Hat",
        0x45: "Stone Mask",
        0x46: "Bremen Mask",
        0x47: "Blast Mask",
        0x48: "Mask of Scents",
        0x49: "Giant's Mask",
        0xff: "-",
      },
      {
        0x00: "Ocarina of Time",
        0x01: "Hero's Bow",
        0x02: "Fire Arrow",
        0x03: "Ice Arrow",
        0x04: "Light Arrow",
        0x06: "Bomb",
        0x07: "Bombchu",
        0x08: "Deku Stick",
        0x09: "Deku Nut",
        0x0a: "Magic Beans",
        0x0c: "Powder Keg",
        0x0d: "Pictograph Box",
        0x0e: "Lens of Truth",
        0x0f: "Hookshot",
        0x10: "Great Fairy's Sword",
        0x12: "Empty Bottle",
        0x13: "Red Potion",
        0x14: "Green Potion",
        0x15: "Blue Potion",
        0x16: "Fairy",
        0x17: "Deku Princess",
        0x18: "Milk",
        0x19: "Milk Half",
        0x1a: "Fish",
        0x1b: "Bug",
        0x1c: "Blue Fire",
        0x1d: "Poe",
        0x1e: "Big Poe",
        0x1f: "Spring Water",
        0x20: "Hot Spring Water",
        0x21: "Zora Egg",
        0x22: "Gold Dust",
        0x23: "Magical Mushroom",
        0x24: "Sea Horse",
        0x25: "Chateau Romani",
        0x28: "Moon's Tear",
        0x29: "Land Title Deed",
        0x2a: "Swamp Title Deed",
        0x2b: "Mountain Title Deed",
        0x2c: "Ocean Title Deed",
        0x2d: "Room Key",
        0x2e: "Special Delivery to Mama",
        0x2f: "Letter to Kafei",
        0x30: "Pedant of Memories",
        0x32: "Deku Mask",
        0x33: "Goron Mask",
        0x34: "Zora Mask",
        0x35: "Fierce Deity's Mask",
        0x36: "Mask of Truth",
        0x37: "Kafei's Mask",
        0x38: "All-Night Mask",
        0x39: "Bunny Hood",
        0x3a: "Keaton Mask",
        0x3b: "Garo's Mask",
        0x3c: "Romani's Mask",
        0x3d: "Circus Leader's Mask",
        0x3e: "Postman's Hat",
        0x3f: "Couple's Mask",
        0x40: "Great Fairy's Mask",
        0x41: "Gibdo Mask",
        0x42: "Don Gero's Mask",
        0x43: "Kamaro's Mask",
        0x44: "Captain's Hat",
        0x45: "Stone Mask",
        0x46: "Bremen Mask",
        0x47: "Blast Mask",
        0x48: "Mask of Scents",
        0x49: "Giant's Mask",
        0xff: "-",
      },
      {
        0x00: "Ocarina of Time",
        0x01: "Hero's Bow",
        0x02: "Fire Arrow",
        0x03: "Ice Arrow",
        0x04: "Light Arrow",
        0x06: "Bomb",
        0x07: "Bombchu",
        0x08: "Deku Stick",
        0x09: "Deku Nut",
        0x0a: "Magic Beans",
        0x0c: "Powder Keg",
        0x0d: "Pictograph Box",
        0x0e: "Lens of Truth",
        0x0f: "Hookshot",
        0x10: "Great Fairy's Sword",
        0x12: "Empty Bottle",
        0x13: "Red Potion",
        0x14: "Green Potion",
        0x15: "Blue Potion",
        0x16: "Fairy",
        0x17: "Deku Princess",
        0x18: "Milk",
        0x19: "Milk Half",
        0x1a: "Fish",
        0x1b: "Bug",
        0x1c: "Blue Fire",
        0x1d: "Poe",
        0x1e: "Big Poe",
        0x1f: "Spring Water",
        0x20: "Hot Spring Water",
        0x21: "Zora Egg",
        0x22: "Gold Dust",
        0x23: "Magical Mushroom",
        0x24: "Sea Horse",
        0x25: "Chateau Romani",
        0x30: "Moon's Tear",
        0x31: "Land Title Deed",
        0x32: "Swamp Title Deed",
        0x33: "Mountain Title Deed",
        0x34: "Ocean Title Deed",
        0x3a: "Room Key",
        0x3b: "Special Delivery to Mama",
        0x44: "Letter to Kafei",
        0x45: "Pedant of Memories",
        0x4e: "Deku Mask",
        0x4f: "Goron Mask",
        0x50: "Zora Mask",
        0x51: "Fierce Deity's Mask",
        0x52: "Mask of Truth",
        0x53: "Kafei's Mask",
        0x54: "All-Night Mask",
        0x55: "Bunny Hood",
        0x56: "Keaton Mask",
        0x57: "Garo's Mask",
        0x58: "Romani's Mask",
        0x59: "Circus Leader's Mask",
        0x5a: "Postman's Hat",
        0x5b: "Couple's Mask",
        0x5c: "Great Fairy's Mask",
        0x5d: "Gibdo Mask",
        0x5e: "Don Gero's Mask",
        0x5f: "Kamaro's Mask",
        0x60: "Captain's Hat",
        0x61: "Stone Mask",
        0x62: "Bremen Mask",
        0x63: "Blast Mask",
        0x64: "Mask of Scents",
        0x65: "Giant's Mask",
        0xff: "-",
      },
    ],
    languages: [
      // Europe
      {
        0x1: "English",
        0x2: "German",
        0x3: "French",
        0x4: "Spanish",
      },
      // USA
      {
        0x1: "English",
      },
      // Japan
      {
        0x0: "Japanese",
      },
    ],
    letters: [
      // Europe
      {
        0x00: "0",
        0x01: "1",
        0x02: "2",
        0x03: "3",
        0x04: "4",
        0x05: "5",
        0x06: "6",
        0x07: "7",
        0x08: "8",
        0x09: "9",
        0x0a: "A",
        0x0b: "B",
        0x0c: "C",
        0x0d: "D",
        0x0e: "E",
        0x0f: "F",
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
        0x3e: " ",
        0x3f: "-",
        0x40: ".",
        0x43: "Á",
        0x48: "É",
        0x4c: "Í",
        0x4f: "Ñ",
        0x51: "Ó",
        0x55: "Ú",
        0x58: "β",
        0x59: "à",
        0x5a: "á",
        0x5b: "â",
        0x5c: "ä",
        0x5d: "ç",
        0x5e: "è",
        0x5f: "é",
        0x60: "ê",
        0x61: "ë",
        0x63: "í",
        0x66: "ñ",
        0x68: "ó",
        0x69: "ô",
        0x6a: "ö",
        0x6b: "ù",
        0x6c: "ú",
        0x6d: "û",
        0x6e: "ü",
      },
      // USA
      {
        0x00: "0",
        0x01: "1",
        0x02: "2",
        0x03: "3",
        0x04: "4",
        0x05: "5",
        0x06: "6",
        0x07: "7",
        0x08: "8",
        0x09: "9",
        0x0a: "A",
        0x0b: "B",
        0x0c: "C",
        0x0d: "D",
        0x0e: "E",
        0x0f: "F",
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
        0x3e: " ",
        0x3f: "-",
        0x40: ".",
      },
      // Japan
      {
        0x00: "0",
        0x01: "1",
        0x02: "2",
        0x03: "3",
        0x04: "4",
        0x05: "5",
        0x06: "6",
        0x07: "7",
        0x08: "8",
        0x09: "9",
        0xa: "あ",
        0xb: "い",
        0xc: "う",
        0xd: "え",
        0xe: "お",
        0xf: "か",
        0x10: "き",
        0x11: "く",
        0x12: "け",
        0x13: "こ",
        0x14: "さ",
        0x15: "し",
        0x16: "す",
        0x17: "せ",
        0x18: "そ",
        0x19: "た",
        0x1a: "ち",
        0x1b: "つ",
        0x1c: "て",
        0x1d: "と",
        0x1e: "な",
        0x1f: "に",
        0x20: "ぬ",
        0x21: "ね",
        0x22: "の",
        0x23: "は",
        0x24: "ひ",
        0x25: "ふ",
        0x26: "へ",
        0x27: "ほ",
        0x28: "ま",
        0x29: "み",
        0x2a: "む",
        0x2b: "め",
        0x2c: "も",
        0x2d: "や",
        0x2e: "ゆ",
        0x2f: "よ",
        0x30: "ら",
        0x31: "り",
        0x32: "る",
        0x33: "れ",
        0x34: "ろ",
        0x35: "わ",
        0x36: "を",
        0x37: "ん",
        0x38: "ぁ",
        0x39: "ぃ",
        0x3a: "ぅ",
        0x3b: "ぇ",
        0x3c: "ぉ",
        0x3d: "っ",
        0x3e: "ゃ",
        0x3f: "ゅ",
        0x40: "ょ",
        0x41: "が",
        0x42: "ぎ",
        0x43: "ぐ",
        0x44: "げ",
        0x45: "ご",
        0x46: "ざ",
        0x47: "じ",
        0x48: "ず",
        0x49: "ぜ",
        0x4a: "ぞ",
        0x4b: "だ",
        0x4c: "ぢ",
        0x4d: "づ",
        0x4e: "で",
        0x4f: "ど",
        0x50: "ば",
        0x51: "び",
        0x52: "ぶ",
        0x53: "べ",
        0x54: "ぼ",
        0x55: "ぱ",
        0x56: "ぴ",
        0x57: "ぷ",
        0x58: "ぺ",
        0x59: "ぽ",
        0x5a: "ア",
        0x5b: "イ",
        0x5c: "ウ",
        0x5d: "エ",
        0x5e: "オ",
        0x5f: "カ",
        0x60: "キ",
        0x61: "ク",
        0x62: "ケ",
        0x63: "コ",
        0x64: "サ",
        0x65: "シ",
        0x66: "ス",
        0x67: "セ",
        0x68: "ソ",
        0x69: "タ",
        0x6a: "チ",
        0x6b: "ツ",
        0x6c: "テ",
        0x6d: "ト",
        0x6e: "ナ",
        0x6f: "ニ",
        0x70: "ヌ",
        0x71: "ネ",
        0x72: "ノ",
        0x73: "ハ",
        0x74: "ヒ",
        0x75: "フ",
        0x76: "ヘ",
        0x77: "ホ",
        0x78: "マ",
        0x79: "ミ",
        0x7a: "ム",
        0x7b: "メ",
        0x7c: "モ",
        0x7d: "ヤ",
        0x7e: "ユ",
        0x7f: "ヨ",
        0x80: "ラ",
        0x81: "リ",
        0x82: "ル",
        0x83: "レ",
        0x84: "ロ",
        0x85: "ワ",
        0x86: "ヲ",
        0x87: "ン",
        0x88: "ァ",
        0x89: "ィ",
        0x8a: "ゥ",
        0x8b: "ェ",
        0x8c: "ォ",
        0x8d: "ッ",
        0x8e: "ャ",
        0x8f: "ュ",
        0x90: "ョ",
        0x91: "ガ",
        0x92: "ギ",
        0x93: "グ",
        0x94: "ゲ",
        0x95: "ゴ",
        0x96: "ザ",
        0x97: "ジ",
        0x98: "ズ",
        0x99: "ゼ",
        0x9a: "ゾ",
        0x9b: "ダ",
        0x9c: "ヂ",
        0x9d: "ヅ",
        0x9e: "デ",
        0x9f: "ド",
        0xa0: "バ",
        0xa1: "ビ",
        0xa2: "ブ",
        0xa3: "ベ",
        0xa4: "ボ",
        0xa5: "パ",
        0xa6: "ピ",
        0xa7: "プ",
        0xa8: "ペ",
        0xa9: "ポ",
        0xab: "A",
        0xac: "B",
        0xad: "C",
        0xae: "D",
        0xaf: "E",
        0xb0: "F",
        0xb1: "G",
        0xb2: "H",
        0xb3: "I",
        0xb4: "J",
        0xb5: "K",
        0xb6: "L",
        0xb7: "M",
        0xb8: "N",
        0xb9: "O",
        0xba: "P",
        0xbb: "Q",
        0xbc: "R",
        0xbd: "S",
        0xbe: "T",
        0xbf: "U",
        0xc0: "V",
        0xc1: "W",
        0xc2: "X",
        0xc3: "Y",
        0xc4: "Z",
        0xc5: "a",
        0xc6: "b",
        0xc7: "c",
        0xc8: "d",
        0xc9: "e",
        0xca: "f",
        0xcb: "g",
        0xcc: "h",
        0xcd: "i",
        0xce: "j",
        0xcf: "k",
        0xd0: "l",
        0xd1: "m",
        0xd2: "n",
        0xd3: "o",
        0xd4: "p",
        0xd5: "q",
        0xd6: "r",
        0xd7: "s",
        0xd8: "t",
        0xd9: "u",
        0xda: "v",
        0xdb: "w",
        0xdc: "x",
        0xdd: "y",
        0xde: "z",
        0xdf: " ",
        0xe4: "ー",
        0xea: ".",
      },
    ],
    magicBars: {
      0x0: "-",
      0x1: "Normal",
      0x2: "Double",
    },
    owlWarps: {
      0x0: "Great Bay Coast",
      0x1: "Zora Cape",
      0x2: "Snowhead",
      0x3: "Mountain Village",
      0x4: "Clock Town",
      0x5: "Milk Road",
      0x6: "Woodfall",
      0x7: "Southern Swamp",
      0x8: "Ikana Canyon",
      0x9: "Stone Tower",
    },
    shields: {
      0x0: "-",
      0x1: "Hero's Shield",
      0x2: "Mirror Shield",
    },
    questItems: [
      {
        0x28: "Moon's Tear",
        0x29: "Land Title Deed",
        0x2a: "Swamp Title Deed",
        0x2b: "Mountain Title Deed",
        0x2c: "Ocean Title Deed",
        0x2d: "Room Key",
        0x2e: "Special Delivery to Mama",
        0x2f: "Letter to Kafei",
        0x30: "Pedant of Memories",
        0xff: "-",
      },
      {
        0x28: "Moon's Tear",
        0x29: "Land Title Deed",
        0x2a: "Swamp Title Deed",
        0x2b: "Mountain Title Deed",
        0x2c: "Ocean Title Deed",
        0x2d: "Room Key",
        0x2e: "Special Delivery to Mama",
        0x2f: "Letter to Kafei",
        0x30: "Pedant of Memories",
        0xff: "-",
      },
      {
        0x30: "Moon's Tear",
        0x31: "Land Title Deed",
        0x32: "Swamp Title Deed",
        0x33: "Mountain Title Deed",
        0x34: "Ocean Title Deed",
        0x3a: "Room Key",
        0x3b: "Special Delivery to Mama",
        0x44: "Letter to Kafei",
        0x45: "Pedant of Memories",
        0xff: "-",
      },
    ],
    quivers: {
      0x0: "-",
      0x1: "Quiver",
      0x2: "Large Quiver",
      0x3: "Largest Quiver",
    },
    swords: {
      0x0: "-",
      0x1: "Kokiri Sword",
      0x2: "Razor Sword",
      0x3: "Gilded Sword",
    },
    transformations: {
      0x0: "Fierce Deity",
      0x1: "Goron",
      0x2: "Zora",
      0x3: "Deku",
      0x4: "Hylian",
    },
    wallets: {
      0x0: "Wallet",
      0x1: "Adult Wallet",
      0x2: "Giant Wallet",
    },
  },
  resourcesOrder: {
    bottles: [0xff],
    items: [0xff],
    questItems: [0xff],
  },
};

export default template;
