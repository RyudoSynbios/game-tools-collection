import { bitToOffset } from "$lib/utils/bytes";

import type { GameJson, ItemTab } from "$lib/types";

import {
  characterEnum,
  characterList,
  characters,
  recipeList,
  titleList,
  titles,
  titlesGroups,
} from "./utils/resource";

const template: GameJson = {
  validator: {
    platforms: {
      playstation: {
        japan: {
          0x0: [0x53, 0x4c, 0x50, 0x53, 0x50, 0x30, 0x31, 0x37, 0x37, 0x30], // "SLPSP01770"
        },
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
      items: [
        {
          type: "section",
          flex: true,
          hidden: true,
          items: [
            {
              name: "Checksum (Save Preview)",
              offset: 0x5fc,
              type: "checksum",
              dataType: "uint32",
              control: {
                offsetStart: 0x400,
                offsetEnd: 0x5fc,
              },
            },
            {
              name: "Checksum",
              offset: 0x1ffc,
              type: "checksum",
              dataType: "uint32",
              control: {
                offsetStart: 0x0,
                offsetEnd: 0x1ffc,
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
                              name: "Mode",
                              offset: 0x1351,
                              type: "variable",
                              dataType: "bit",
                              bit: 0,
                              resource: "modes",
                            },
                            {
                              name: "Playtime",
                              type: "group",
                              mode: "chrono",
                              items: [
                                {
                                  offset: 0x11cc,
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
                                  offset: 0x11cc,
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
                                  offset: 0x11cc,
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
                              // id: "location",
                              name: "Location",
                              offset: 0x11d8,
                              type: "variable",
                              dataType: "uint32",
                              resource: "locations",
                              autocomplete: true,
                            },
                            {
                              name: "Time",
                              offset: 0x11dc,
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
                              name: "Gald",
                              offset: 0xb14,
                              type: "variable",
                              dataType: "uint32",
                              max: 9999999,
                            },
                            {
                              name: "Encounters",
                              offset: 0x11d0,
                              type: "variable",
                              dataType: "uint32",
                              max: 999999,
                            },
                            {
                              name: "Hard Encounters",
                              offset: 0x1348,
                              type: "variable",
                              dataType: "uint32",
                              max: 999999,
                            },
                            {
                              name: "Max Hits",
                              offset: 0x11d4,
                              type: "variable",
                              dataType: "uint32",
                              max: 99999,
                            },
                          ],
                        },
                        {
                          type: "section",
                          flex: true,
                          items: [
                            {
                              name: "Remaning Steps",
                              offset: 0x11e4,
                              type: "variable",
                              dataType: "uint16",
                              hint: "A battle will occur once it reaches 0.",
                            },
                          ],
                        },
                        {
                          type: "section",
                          flex: true,
                          hidden: true,
                          items: [
                            {
                              name: "Playtime (Save Preview)",
                              offset: 0x508,
                              type: "variable",
                              dataType: "uint32",
                              hidden: true,
                            },
                            {
                              name: "Gald (Save Preview)",
                              offset: 0x50c,
                              type: "variable",
                              dataType: "uint32",
                              hidden: true,
                            },
                            {
                              name: "Encounters (Save Preview)",
                              offset: 0x510,
                              type: "variable",
                              dataType: "uint32",
                              hidden: true,
                            },
                            {
                              name: "Max Hits (Save Preview)",
                              offset: 0x514,
                              type: "variable",
                              dataType: "uint32",
                              hidden: true,
                            },
                          ],
                        },
                        // # World Map
                        // ? 0x1A04 | uint32 | Position X
                        // ? 0x1A08 | uint32 | Position Y
                        // ? 0x1A0C | uint16 | Camera Rotation Y
                        // ? 0x1A0E | uint8 | Orientation
                        // # Indoor Position
                        // ? 0x1A1C | uint16 | Position X
                        // ? 0x1A1E | uint16 | Position Y
                        // # Miscellaneous
                        // ? 0x1A19 | 4 | Just ate
                        // # Visited Locations
                        // ! 0x1A28 | 0 | ???
                        // ? 0x1A28 | 1 | Ocean Liner
                        // ? 0x1A28 | 2 | Ocean Liner
                        // ? 0x1A28 | 3 | Elven Settlement
                        // ? 0x1A28 | 4 | Ninja Village
                        // ! 0x1A28 | 5 | ???
                        // ? 0x1A28 | 6 | Moria Mine
                        // ? 0x1A28 | 7 | Aegis' Shop
                        // ? 0x1A29 | 0 | Peddler
                        // ! 0x1A29 | 1 | ???
                        // ! 0x1A29 | 2 | ???
                        // ! 0x1A29 | 3 | ???
                        // ! 0x1A29 | 4 | ???
                        // ! 0x1A29 | 5 | ???
                        // ! 0x1A29 | 6 | ???
                        // ! 0x1A29 | 7 | ???
                        // # Stores
                        // ! 0x1330 | 0 | ???
                        // ! 0x1330 | 1 | ???
                        // ! 0x1330 | 2 | ???
                        // ! 0x1330 | 3 | ???
                        // ! 0x1330 | 4 | ???
                        // ? 0x1330 | 5 | Village of Belladam: Double K.O.
                        // ? 0x1330 | 6 | Village of Belladam: Draw
                        // ! 0x1330 | 7 | ???
                        // ? 0x1331 | 0 | Euclid Village: Bishop
                        // ? 0x1331 | 1 | Euclid Village: Cat's Eye
                        // ? 0x1331 | 2 | Euclid Village: Veggie
                        // ! 0x1331 | 3 | ???
                        // ! 0x1331 | 4 | ???
                        // ! 0x1331 | 5 | ???
                        // ? 0x1331 | 6 | City of Venezia: Water's Edge
                        // ? 0x1331 | 7 | City of Venezia: Sea-through
                        // ? 0x1332 | 0 | City of Venezia: Malaga Sea
                        // ? 0x1332 | 1 | City of Venezia: Waterfront
                        // ? 0x1332 | 2 | Ocean Liner: Sailor
                        // ? 0x1332 | 3 | Ocean Liner: Sailor
                        // ? 0x1332 | 4 | Capital of Alvanista: Lime
                        // ? 0x1332 | 5 | Capital of Alvanista: Lime
                        // ? 0x1332 | 6 | Capital of Alvanista: Calendar
                        // ? 0x1332 | 7 | Capital of Alvanista: Pig-Out
                        // ? 0x1333 | 0 | Olive Village: Garlic
                        // ? 0x1333 | 1 | Olive Village: Tenderloin
                        // ? 0x1333 | 2 | Olive Village: Sirloin
                        // ? 0x1333 | 3 | Olive Village: Lil' Nymph
                        // ? 0x1333 | 4 | Elven Settlement: Grocery Store
                        // ? 0x1333 | 5 | Elven Settlement: Pharmacy
                        // ? 0x1333 | 6 | Elven Settlement: Tool Shop
                        // ? 0x1333 | 7 | Midgard Castle Town: Spirit
                        // ? 0x1334 | 0 | Midgard Castle Town: Spirit
                        // ? 0x1334 | 1 | Midgard Castle Town: Buster
                        // ? 0x1334 | 2 | Midgard Castle Town: Slayer IV
                        // ? 0x1334 | 3 | Midgard Castle Town: Ninja
                        // ? 0x1334 | 4 | Town of Miguel: Tiger Blade
                        // ? 0x1334 | 5 | Capital of Euclid: Holy Knight
                        // ? 0x1334 | 6 | Capital of Euclid: Holy Knight
                        // ? 0x1334 | 7 | City of Venezia: Water's Edge
                        // ? 0x1335 | 0 | City of Venezia: Sea-through
                        // ? 0x1335 | 1 | Capital of Alvanista: Lime
                        // ? 0x1335 | 2 | Aegis' Shop: Aegis' Shop
                        // ? 0x1335 | 3 | Early, The Twilit Town: Midnight
                        // ? 0x1335 | 4 | City of Venezia: Waterfront
                        // ? 0x1335 | 5 | Capital of Euclid: Flavor King
                        // ? 0x1335 | 6 | Capital of Alvanista: Pig-Out
                        // ? 0x1335 | 7 | Town of Freezekiel: Iced Coffee
                        // ? 0x1336 | 0 | Early, The Twilit Town: 3:00 A.M.
                        // ? 0x1336 | 1 | Olive Village: Garlic
                        // ? 0x1336 | 2 | Ninja Village: Kurikinton
                        // ? 0x1336 | 3 | Elven Settlement: Sunset
                        // ? 0x1336 | 4 | Aegis' Shop: Aegis' Shop
                        // ! 0x1336 | 5 | ???
                        // ? 0x1336 | 6 | Moria Mine: Quartermaster
                        // ? 0x1336 | 7 | Capital of Alvanista: Calendar
                        // ? 0x1337 | 0 | Peddler: Peddler
                        // ? 0x1337 | 1 | Capital of Alvanista: Houttuynia (???)
                        // ? 0x1337 | 2 | Capital of Alvanista: Outtuynia
                        // ? 0x1337 | 3 | Town of Miguel: Benjamin
                        // ? 0x1337 | 4 | Capital of Alvanista: Lime
                        // ? 0x1337 | 5 | Capital of Euclid: Vroom Vroom
                        // ! 0x1337 | 6 | ???
                        // ! 0x1337 | 7 | ???
                        // ? 0x1338 | 0 | Town of Freezekiel: Freezer
                        // ? 0x1338 | 1 | Town of Freezekiel: Freezer
                        // ? 0x1338 | 2 | Early, The Twilit Town: Noonwalker
                        // ? 0x1338 | 3 | Elven Settlement: A-E-I-O-U
                        // ? 0x1338 | 4 | Elven Settlement: Silent Song
                        // ? 0x1338 | 5 | City of Venezia: Malaga Sea
                        // ? 0x1338 | 6 | Olive Village: Tenderloin
                        // ? 0x1338 | 7 | Olive Village: Sirloin
                        // ? 0x1339 | 0 | Olive Village: Lil' Nymph
                        // ? 0x1339 | 1 | Capital of Euclid: Bonnet
                        // ? 0x1339 | 2 | Town of Freezekiel: Toyama
                      ],
                    },
                    {
                      name: "Formation",
                      items: [
                        {
                          type: "section",
                          flex: true,
                          items: [...Array(6).keys()].map((index) => ({
                            name: `Character ${index + 1}`,
                            offset: 0xb00 + index * 0x2,
                            type: "variable",
                            dataType: "uint16",
                            resource: "characters",
                          })),
                        },
                        {
                          name: "Positions",
                          type: "section",
                          flex: true,
                          items: [...Array(4).keys()].map((index) => ({
                            name: `Character ${index + 1}`,
                            offset: 0xb0c + index * 0x2,
                            type: "variable",
                            dataType: "uint16",
                            max: 192,
                          })),
                        },
                        {
                          type: "section",
                          flex: true,
                          hidden: true,
                          items: [...Array(6).keys()].map((index) => ({
                            name: `Character ${index + 1} (Save Preview)`,
                            offset: 0x518 + index * 0x2,
                            type: "variable",
                            dataType: "uint16",
                            resource: "characters",
                          })),
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
                  length: 0xa0,
                  type: "container",
                  instanceType: "tabs",
                  instances: 7,
                  resource: "characterEnum",
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
                                  offset: 0x600,
                                  type: "variable",
                                  dataType: "uint16",
                                  resource: "characters",
                                  hidden: true,
                                },
                                {
                                  name: "Name",
                                  offset: 0x60c,
                                  length: 0x6,
                                  type: "variable",
                                  dataType: "string",
                                  letterDataType: "uint8",
                                  fallback: 0x10,
                                  resource: "letters",
                                },
                                {
                                  id: "level",
                                  name: "Level",
                                  offset: 0x602,
                                  type: "variable",
                                  dataType: "uint16",
                                  min: 1,
                                  max: 999,
                                },
                                {
                                  id: "experience",
                                  name: "Experience",
                                  offset: 0x604,
                                  type: "variable",
                                  dataType: "uint32",
                                  max: 99999999,
                                },
                                {
                                  name: "Next Experience",
                                  offset: 0x608,
                                  type: "variable",
                                  dataType: "uint32",
                                  hidden: true,
                                },
                              ],
                            },
                            // ? 0x64C | uint8 | Strategy
                            // ? 0x64E | uint8 | Artes Mode
                            {
                              type: "section",
                              flex: true,
                              items: [
                                {
                                  name: "HP",
                                  type: "group",
                                  mode: "fraction",
                                  linked: true,
                                  items: [
                                    {
                                      id: "current",
                                      offset: 0x618,
                                      type: "variable",
                                      dataType: "uint16",
                                    },
                                    {
                                      // id: "",
                                      offset: 0x616,
                                      type: "variable",
                                      dataType: "uint16",
                                      min: 1,
                                      max: 9999,
                                    },
                                  ],
                                },
                                {
                                  name: "TP",
                                  type: "group",
                                  mode: "fraction",
                                  linked: true,
                                  items: [
                                    {
                                      id: "current",
                                      offset: 0x61e,
                                      type: "variable",
                                      dataType: "uint16",
                                    },
                                    {
                                      // id: "",
                                      offset: 0x61c,
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
                              items: [
                                {
                                  name: "Strength",
                                  offset: 0x620,
                                  type: "variable",
                                  dataType: "uint16",
                                  max: 999,
                                },
                                {
                                  name: "Constitution",
                                  offset: 0x624,
                                  type: "variable",
                                  dataType: "uint16",
                                  max: 999,
                                },
                                {
                                  // id: "",
                                  name: "Agility",
                                  offset: 0x62c,
                                  type: "variable",
                                  dataType: "uint16",
                                  max: 999,
                                },
                                {
                                  // id: "",
                                  name: "Luck",
                                  offset: 0x630,
                                  type: "variable",
                                  dataType: "uint16",
                                  max: 999,
                                },
                              ],
                            },
                            {
                              type: "section",
                              flex: true,
                              hidden: true,
                              items: [
                                {
                                  name: "Base HP",
                                  offset: 0x614,
                                  type: "variable",
                                  dataType: "uint16",
                                  hidden: true,
                                },
                                {
                                  name: "Base TP",
                                  offset: 0x61a,
                                  type: "variable",
                                  dataType: "uint16",
                                  hidden: true,
                                },
                                {
                                  name: "Base Agility",
                                  offset: 0x628,
                                  type: "variable",
                                  dataType: "uint16",
                                  hidden: true,
                                },

                                {
                                  name: "Base Luck",
                                  offset: 0x62e,
                                  type: "variable",
                                  dataType: "uint16",
                                  hidden: true,
                                },
                              ],
                            },
                            {
                              type: "section",
                              flex: true,
                              items: [
                                {
                                  name: "Slash",
                                  offset: 0x632,
                                  type: "variable",
                                  dataType: "uint16",
                                  disabled: true,
                                },
                                {
                                  name: "Thrust",
                                  offset: 0x634,
                                  type: "variable",
                                  dataType: "uint16",
                                  disabled: true,
                                },
                                {
                                  name: "Defense",
                                  offset: 0x636,
                                  type: "variable",
                                  dataType: "uint16",
                                  disabled: true,
                                },
                                {
                                  name: "Accuracy",
                                  offset: 0x638,
                                  type: "variable",
                                  dataType: "uint16",
                                  disabled: true,
                                },
                                {
                                  name: "Evasion",
                                  offset: 0x63a,
                                  type: "variable",
                                  dataType: "uint16",
                                  disabled: true,
                                },
                              ],
                            },
                            {
                              name: "Condition",
                              type: "bitflags",
                              hidden: true,
                              flags: [
                                { offset: 0x64a, bit: 0, label: "Poisoned" },
                                { offset: 0x64a, bit: 1, label: "Paralyzed" },
                                { offset: 0x64a, bit: 2, label: "Stoned" },
                                { offset: 0x64a, bit: 3, label: "Unconscious" },
                                { offset: 0x64a, bit: 4, label: "???", hidden: true }, // prettier-ignore
                                { offset: 0x64a, bit: 5, label: "???", hidden: true }, // prettier-ignore
                                { offset: 0x64a, bit: 6, label: "???", hidden: true }, // prettier-ignore
                                { offset: 0x64a, bit: 7, label: "???", hidden: true }, // prettier-ignore
                              ],
                            },
                            {
                              type: "section",
                              flex: true,
                              noMargin: true,
                              hidden: true,
                              items: [
                                {
                                  name: "Character",
                                  offset: 0x408,
                                  type: "variable",
                                  dataType: "uint16",
                                  resource: "characters",
                                  overrideShift: {
                                    parent: 1,
                                    shift: 0x20,
                                  },
                                  hidden: true,
                                },
                                {
                                  name: "Name (Save Preview)",
                                  offset: 0x414,
                                  length: 0x6,
                                  type: "variable",
                                  dataType: "string",
                                  letterDataType: "uint8",
                                  resource: "letters",
                                  overrideShift: {
                                    parent: 1,
                                    shift: 0x20,
                                  },
                                  hidden: true,
                                },
                                {
                                  name: "Level",
                                  offset: 0x40a,
                                  type: "variable",
                                  dataType: "uint16",
                                  overrideShift: {
                                    parent: 1,
                                    shift: 0x20,
                                  },
                                  hidden: true,
                                },
                                {
                                  name: "Experience",
                                  offset: 0x40c,
                                  type: "variable",
                                  dataType: "uint32",
                                  overrideShift: {
                                    parent: 1,
                                    shift: 0x20,
                                  },
                                  hidden: true,
                                },
                                {
                                  name: "Next Experience",
                                  offset: 0x410,
                                  type: "variable",
                                  dataType: "uint32",
                                  overrideShift: {
                                    parent: 1,
                                    shift: 0x20,
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
                                  name: "HP (Save Preview)",
                                  offset: 0x41e,
                                  type: "variable",
                                  dataType: "uint16",
                                  overrideShift: {
                                    parent: 1,
                                    shift: 0x20,
                                  },
                                  hidden: true,
                                },
                                {
                                  name: "Max HP (Save Preview)",
                                  offset: 0x41c,
                                  type: "variable",
                                  dataType: "uint16",
                                  overrideShift: {
                                    parent: 1,
                                    shift: 0x20,
                                  },
                                  hidden: true,
                                },
                                {
                                  name: "TP (Save Preview)",
                                  offset: 0x422,
                                  type: "variable",
                                  dataType: "uint16",
                                  overrideShift: {
                                    parent: 1,
                                    shift: 0x20,
                                  },
                                  hidden: true,
                                },
                                {
                                  name: "Max TP (Save Preview)",
                                  offset: 0x420,
                                  type: "variable",
                                  dataType: "uint16",
                                  overrideShift: {
                                    parent: 1,
                                    shift: 0x20,
                                  },
                                  hidden: true,
                                },
                              ],
                            },
                          ],
                        },
                        {
                          name: "Artes",
                          items: [
                            // # Unlocked Artes
                            // ? 0x650 | uint8 | Arte 01
                            // ? 0x651 | uint8 | Arte 02
                            // ? 0x652 | uint8 | Arte 03
                            // ? 0x653 | uint8 | Arte 04
                            // ? 0x654 | uint8 | Arte 05
                            // ? 0x655 | uint8 | Arte 06
                            // ? 0x656 | uint8 | Arte 07
                            // ? 0x657 | uint8 | Arte 08
                            // ? 0x658 | uint8 | Arte 09
                            // ? 0x659 | uint8 | Arte 10
                            // ? 0x65A | uint8 | Arte 11
                            // ? 0x65B | uint8 | Arte 12
                            // ? 0x65C | uint8 | Arte 13
                            // ? 0x65D | uint8 | Arte 14
                            // ? 0x65E | uint8 | Arte 15
                            // ? 0x65F | uint8 | Arte 16
                            // ? 0x660 | uint8 | Arte 17
                            // ? 0x661 | uint8 | Arte 18
                            // ? 0x662 | uint8 | Arte 19
                            // ? 0x663 | uint8 | Arte 20
                            // ? 0x664 | uint8 | Arte 21
                            // ? 0x665 | uint8 | Arte 22
                            // ? 0x666 | uint8 | Arte 23
                            // ? 0x667 | uint8 | Arte 24
                            // ? 0x668 | uint8 | Arte 25
                            // ? 0x669 | uint8 | Arte 26
                            // ? 0x66A | uint8 | Arte 27
                            // ? 0x66B | uint8 | Arte 28
                            // ? 0x66C | uint8 | Arte 29
                            // ? 0x66D | uint8 | Arte 30
                            // ? 0x66E | uint8 | Arte 31
                            // ? 0x66F | uint8 | Arte 32
                            // ? 0x670 | uint8 | Arte 33
                            // ? 0x671 | uint8 | Arte 34
                            // ? 0x672 | uint8 | Arte 35
                            // ? 0x673 | uint8 | Arte 36
                            // # Equipped Artes
                            // ? 0x674 | uint8 | Base
                            // ? 0x675 | uint8 | Up
                            // ? 0x676 | uint8 | Down
                            // ? 0x677 | uint8 | Left/Right
                            // ! 0x678 | uint8 | ???
                            // ! 0x679 | uint8 | ???
                            // ! 0x67A | uint8 | ???
                            // ! 0x67B | uint8 | ???
                            // ! 0x67C | uint8 | ???
                            // ! 0x67D | uint8 | ???
                            // ! 0x67E | uint8 | ???
                            // ! 0x67F | uint8 | ???
                            // ! 0x680 | uint8 | ???
                          ],
                        },
                        {
                          name: "Equipment",
                          flex: true,
                          items: [
                            {
                              name: "Weapon",
                              offset: 0x63c,
                              type: "variable",
                              dataType: "uint16",
                              resource: "weapons",
                              autocomplete: true,
                            },
                            {
                              name: "Body",
                              offset: 0x63e,
                              type: "variable",
                              dataType: "uint16",
                              resource: "bodies",
                              autocomplete: true,
                            },
                            {
                              name: "Shield",
                              offset: 0x640,
                              type: "variable",
                              dataType: "uint16",
                              resource: "shields",
                              autocomplete: true,
                            },
                            {
                              name: "Head",
                              offset: 0x642,
                              type: "variable",
                              dataType: "uint16",
                              resource: "heads",
                              autocomplete: true,
                            },
                            {
                              name: "Hand",
                              offset: 0x644,
                              type: "variable",
                              dataType: "uint16",
                              resource: "hands",
                              autocomplete: true,
                            },
                            {
                              name: "Accessory 1",
                              offset: 0x646,
                              type: "variable",
                              dataType: "uint16",
                              resource: "accessories",
                              autocomplete: true,
                            },
                            {
                              name: "Accessory 2",
                              offset: 0x648,
                              type: "variable",
                              dataType: "uint16",
                              resource: "accessories",
                              autocomplete: true,
                            },
                          ],
                        },
                      ],
                    },
                    // # Artes Mastery (OUT PARTY CONTAINER)
                    // ? 0x116C | uint8 | Demon Fang
                    // ? 0x116D | uint8 | Swallow Dance
                    // ? 0x116E | uint8 | Lightning Tiger Blade
                    // ? 0x116F | uint8 | Sword Rain: Alpha
                    // ? 0x1170 | uint8 | Tiger Blade
                    // ? 0x1171 | uint8 | Rising Phoenix
                    // ? 0x1172 | uint8 | Beast
                    // ? 0x1173 | uint8 | Light Spear
                    // ? 0x1174 | uint8 | Chaos Blade
                    // ? 0x1175 | uint8 | Void Shift
                    // ? 0x1176 | uint8 | Distortion Blade
                  ],
                },
              ],
            },
            {
              name: "Inventory",
              items: [
                // # Items
                // ? 0xD1C | uint16 | Item 001
                // ? 0xD1E | uint16 | Item 002
                // ? 0xD20 | uint16 | Item 003
                // ? 0xD22 | uint16 | Item 004
                // ? 0xD24 | uint16 | Item 005
                // ? 0xD26 | uint16 | Item 006
                // ? 0xD28 | uint16 | Item 007
                // ? 0xD2A | uint16 | Item 008
                // ? 0xD2C | uint16 | Item 009
                // ? 0xD2E | uint16 | Item 010
                // ? 0xD30 | uint16 | Item 011
                // ? 0xD32 | uint16 | Item 012
                // ? 0xD34 | uint16 | Item 013
                // ? 0xD36 | uint16 | Item 014
                // ? 0xD38 | uint16 | Item 015
                // ? 0xD3A | uint16 | Item 016
                // ? 0xD3C | uint16 | Item 017
                // ? 0xD3E | uint16 | Item 018
                // ? 0xD40 | uint16 | Item 019
                // ? 0xD42 | uint16 | Item 020
                // ? 0xD44 | uint16 | Item 021
                // ? 0xD46 | uint16 | Item 022
                // ? 0xD48 | uint16 | Item 023
                // ? 0xD4A | uint16 | Item 024
                // ? 0xD4C | uint16 | Item 025
                // ? 0xD4E | uint16 | Item 026
                // ? 0xD50 | uint16 | Item 027
                // ? 0xD52 | uint16 | Item 028
                // ? 0xD54 | uint16 | Item 029
                // ? 0xD56 | uint16 | Item 030
                // ? 0xD58 | uint16 | Item 031
                // ? 0xD5A | uint16 | Item 032
                // ? 0xD5C | uint16 | Item 033
                // ? 0xD5E | uint16 | Item 034
                // ? 0xD60 | uint16 | Item 035
                // ? 0xD62 | uint16 | Item 036
                // ? 0xD64 | uint16 | Item 037
                // ? 0xD66 | uint16 | Item 038
                // ? 0xD68 | uint16 | Item 039
                // ? 0xD6A | uint16 | Item 040
                // ? 0xD6C | uint16 | Item 041
                // ? 0xD6E | uint16 | Item 042
                // ? 0xD70 | uint16 | Item 043
                // ? 0xD72 | uint16 | Item 044
                // ? 0xD74 | uint16 | Item 045
                // ? 0xD76 | uint16 | Item 046
                // ? 0xD78 | uint16 | Item 047
                // ? 0xD7A | uint16 | Item 048
                // ? 0xD7C | uint16 | Item 049
                // ? 0xD7E | uint16 | Item 050
                // ? 0xD80 | uint16 | Item 051
                // ? 0xD82 | uint16 | Item 052
                // ? 0xD84 | uint16 | Item 053
                // ? 0xD86 | uint16 | Item 054
                // ? 0xD88 | uint16 | Item 055
                // ? 0xD8A | uint16 | Item 056
                // ? 0xD8C | uint16 | Item 057
                // ? 0xD8E | uint16 | Item 058
                // ? 0xD90 | uint16 | Item 059
                // ? 0xD92 | uint16 | Item 060
                // ? 0xD94 | uint16 | Item 061
                // ? 0xD96 | uint16 | Item 062
                // ? 0xD98 | uint16 | Item 063
                // ? 0xD9A | uint16 | Item 064
                // ? 0xD9C | uint16 | Item 065
                // ? 0xD9E | uint16 | Item 066
                // ? 0xDA0 | uint16 | Item 067
                // ? 0xDA2 | uint16 | Item 068
                // ? 0xDA4 | uint16 | Item 069
                // ? 0xDA6 | uint16 | Item 070
                // ? 0xDA8 | uint16 | Item 071
                // ? 0xDAA | uint16 | Item 072
                // ? 0xDAC | uint16 | Item 073
                // ? 0xDAE | uint16 | Item 074
                // ? 0xDB0 | uint16 | Item 075
                // ? 0xDB2 | uint16 | Item 076
                // ? 0xDB4 | uint16 | Item 077
                // ? 0xDB6 | uint16 | Item 078
                // ? 0xDB8 | uint16 | Item 079
                // ? 0xDBA | uint16 | Item 080
                // ? 0xDBC | uint16 | Item 081
                // ? 0xDBE | uint16 | Item 082
                // ? 0xDC0 | uint16 | Item 083
                // ? 0xDC2 | uint16 | Item 084
                // ? 0xDC4 | uint16 | Item 085
                // ? 0xDC6 | uint16 | Item 086
                // ? 0xDC8 | uint16 | Item 087
                // ? 0xDCA | uint16 | Item 088
                // ? 0xDCC | uint16 | Item 089
                // ? 0xDCE | uint16 | Item 090
                // ? 0xDD0 | uint16 | Item 091
                // ? 0xDD2 | uint16 | Item 092
                // ? 0xDD4 | uint16 | Item 093
                // ? 0xDD6 | uint16 | Item 094
                // ? 0xDD8 | uint16 | Item 095
                // ? 0xDDA | uint16 | Item 096
                // ? 0xDDC | uint16 | Item 097
                // ? 0xDDE | uint16 | Item 098
                // ? 0xDE0 | uint16 | Item 099
                // ? 0xDE2 | uint16 | Item 100
                // ? 0xDE4 | uint16 | Item 101
                // ? 0xDE6 | uint16 | Item 102
                // ? 0xDE8 | uint16 | Item 103
                // ? 0xDEA | uint16 | Item 104
                // ? 0xDEC | uint16 | Item 105
                // ? 0xDEE | uint16 | Item 106
                // ? 0xDF0 | uint16 | Item 107
                // ? 0xDF2 | uint16 | Item 108
                // ? 0xDF4 | uint16 | Item 109
                // ? 0xDF6 | uint16 | Item 110
                // ? 0xDF8 | uint16 | Item 111
                // ? 0xDFA | uint16 | Item 112
                // ? 0xDFC | uint16 | Item 113
                // ? 0xDFE | uint16 | Item 114
                // ? 0xE00 | uint16 | Item 115
                // ? 0xE02 | uint16 | Item 116
                // ? 0xE04 | uint16 | Item 117
                // ? 0xE06 | uint16 | Item 118
                // ? 0xE08 | uint16 | Item 119
                // ? 0xE0A | uint16 | Item 120
                // ? 0xE0C | uint16 | Item 121
                // ? 0xE0E | uint16 | Item 122
                // ? 0xE10 | uint16 | Item 123
                // ? 0xE12 | uint16 | Item 124
                // ? 0xE14 | uint16 | Item 125
                // ? 0xE16 | uint16 | Item 126
                // ? 0xE18 | uint16 | Item 127
                // ? 0xE1A | uint16 | Item 128
                // ? 0xE1C | uint16 | Item 129
                // ? 0xE1E | uint16 | Item 130
                // ? 0xE20 | uint16 | Item 131
                // ? 0xE22 | uint16 | Item 132
                // ? 0xE24 | uint16 | Item 133
                // ? 0xE26 | uint16 | Item 134
                // ? 0xE28 | uint16 | Item 135
                // ? 0xE2A | uint16 | Item 136
                // ? 0xE2C | uint16 | Item 137
                // ? 0xE2E | uint16 | Item 138
                // ? 0xE30 | uint16 | Item 139
                // ? 0xE32 | uint16 | Item 140
                // ? 0xE34 | uint16 | Item 141
                // ? 0xE36 | uint16 | Item 142
                // ? 0xE38 | uint16 | Item 143
                // ? 0xE3A | uint16 | Item 144
                // ? 0xE3C | uint16 | Item 145
                // ? 0xE3E | uint16 | Item 146
                // ? 0xE40 | uint16 | Item 147
                // ? 0xE42 | uint16 | Item 148
                // ? 0xE44 | uint16 | Item 149
                // ? 0xE46 | uint16 | Item 150
                // ? 0xE48 | uint16 | Item 151
                // ? 0xE4A | uint16 | Item 152
                // ? 0xE4C | uint16 | Item 153
                // ? 0xE4E | uint16 | Item 154
                // ? 0xE50 | uint16 | Item 155
                // ? 0xE52 | uint16 | Item 156
                // ? 0xE54 | uint16 | Item 157
                // ? 0xE56 | uint16 | Item 158
                // ? 0xE58 | uint16 | Item 159
                // ? 0xE5A | uint16 | Item 160
                // ? 0xE5C | uint16 | Item 161
                // ? 0xE5E | uint16 | Item 162
                // ? 0xE60 | uint16 | Item 163
                // ? 0xE62 | uint16 | Item 164
                // ? 0xE64 | uint16 | Item 165
                // ? 0xE66 | uint16 | Item 166
                // ? 0xE68 | uint16 | Item 167
                // ? 0xE6A | uint16 | Item 168
                // ? 0xE6C | uint16 | Item 169
                // ? 0xE6E | uint16 | Item 170
                // ? 0xE70 | uint16 | Item 171
                // ? 0xE72 | uint16 | Item 172
                // ? 0xE74 | uint16 | Item 173
                // ? 0xE76 | uint16 | Item 174
                // ? 0xE78 | uint16 | Item 175
                // ? 0xE7A | uint16 | Item 176
                // ? 0xE7C | uint16 | Item 177
                // ? 0xE7E | uint16 | Item 178
                // ? 0xE80 | uint16 | Item 179
                // ? 0xE82 | uint16 | Item 180
                // ? 0xE84 | uint16 | Item 181
                // ? 0xE86 | uint16 | Item 182
                // ? 0xE88 | uint16 | Item 183
                // ? 0xE8A | uint16 | Item 184
                // ? 0xE8C | uint16 | Item 185
                // ? 0xE8E | uint16 | Item 186
                // ? 0xE90 | uint16 | Item 187
                // ? 0xE92 | uint16 | Item 188
                // ? 0xE94 | uint16 | Item 189
                // ? 0xE96 | uint16 | Item 190
                // ? 0xE98 | uint16 | Item 191
                // ? 0xE9A | uint16 | Item 192
                // ? 0xE9C | uint16 | Item 193
                // ? 0xE9E | uint16 | Item 194
                // ? 0xEA0 | uint16 | Item 195
                // ? 0xEA2 | uint16 | Item 196
                // ? 0xEA4 | uint16 | Item 197
                // ? 0xEA6 | uint16 | Item 198
                // ? 0xEA8 | uint16 | Item 199
                // ? 0xEAA | uint16 | Item 200
                // ? 0xEAC | uint16 | Item 201
                // ? 0xEAE | uint16 | Item 202
                // ? 0xEB0 | uint16 | Item 203
                // ? 0xEB2 | uint16 | Item 204
                // ? 0xEB4 | uint16 | Item 205
                // ? 0xEB6 | uint16 | Item 206
                // ? 0xEB8 | uint16 | Item 207
                // ? 0xEBA | uint16 | Item 208
                // ? 0xEBC | uint16 | Item 209
                // ? 0xEBE | uint16 | Item 210
                // ? 0xEC0 | uint16 | Item 211
                // ? 0xEC2 | uint16 | Item 212
                // ? 0xEC4 | uint16 | Item 213
                // ? 0xEC6 | uint16 | Item 214
                // ? 0xEC8 | uint16 | Item 215
                // ? 0xECA | uint16 | Item 216
                // ? 0xECC | uint16 | Item 217
                // ? 0xECE | uint16 | Item 218
                // ? 0xED0 | uint16 | Item 219
                // ? 0xED2 | uint16 | Item 220
                // ? 0xED4 | uint16 | Item 221
                // ? 0xED6 | uint16 | Item 222
                // ? 0xED8 | uint16 | Item 223
                // ? 0xEDA | uint16 | Item 224
                // ? 0xEDC | uint16 | Item 225
                // ? 0xEDE | uint16 | Item 226
                // ? 0xEE0 | uint16 | Item 227
                // ? 0xEE2 | uint16 | Item 228
                // ? 0xEE4 | uint16 | Item 229
                // ? 0xEE6 | uint16 | Item 230
                // ? 0xEE8 | uint16 | Item 231
                // ? 0xEEA | uint16 | Item 232
                // ? 0xEEC | uint16 | Item 233
                // ? 0xEEE | uint16 | Item 234
                // ? 0xEF0 | uint16 | Item 235
                // ? 0xEF2 | uint16 | Item 236
                // ? 0xEF4 | uint16 | Item 237
                // ? 0xEF6 | uint16 | Item 238
                // ? 0xEF8 | uint16 | Item 239
                // ? 0xEFA | uint16 | Item 240
                // ? 0xEFC | uint16 | Item 241
                // ? 0xEFE | uint16 | Item 242
                // ? 0xF00 | uint16 | Item 243
                // ? 0xF02 | uint16 | Item 244
                // ? 0xF04 | uint16 | Item 245
                // ? 0xF06 | uint16 | Item 246
                // ? 0xF08 | uint16 | Item 247
                // ? 0xF0A | uint16 | Item 248
                // ? 0xF0C | uint16 | Item 249
                // ? 0xF0E | uint16 | Item 250
                // ? 0xF10 | uint16 | Item 251
                // ? 0xF12 | uint16 | Item 252
                // ? 0xF14 | uint16 | Item 253
                // ? 0xF16 | uint16 | Item 254
                // ? 0xF18 | uint16 | Item 255
                // ? 0xF1A | uint16 | Item 256
                // ? 0xF1C | uint16 | Item 257
                // ? 0xF1E | uint16 | Item 258
                // ? 0xF20 | uint16 | Item 259
                // ? 0xF22 | uint16 | Item 260
                // ? 0xF24 | uint16 | Item 261
                // ? 0xF26 | uint16 | Item 262
                // ? 0xF28 | uint16 | Item 263
                // ? 0xF2A | uint16 | Item 264
                // ? 0xF2C | uint16 | Item 265
                // ? 0xF2E | uint16 | Item 266
                // ? 0xF30 | uint16 | Item 267
                // ? 0xF32 | uint16 | Item 268
                // ? 0xF34 | uint16 | Item 269
                // ? 0xF36 | uint16 | Item 270
                // ? 0xF38 | uint16 | Item 271
                // ? 0xF3A | uint16 | Item 272
                // ? 0xF3C | uint16 | Item 273
                // ? 0xF3E | uint16 | Item 274
                // ? 0xF40 | uint16 | Item 275
                // ? 0xF42 | uint16 | Item 276
                // ? 0xF44 | uint16 | Item 277
                // ? 0xF46 | uint16 | Item 278
                // ? 0xF48 | uint16 | Item 279
                // ? 0xF4A | uint16 | Item 280
                // ? 0xF4C | uint16 | Item 281
                // ? 0xF4E | uint16 | Item 282
                // ? 0xF50 | uint16 | Item 283
                // ? 0xF52 | uint16 | Item 284
                // ? 0xF54 | uint16 | Item 285
                // ? 0xF56 | uint16 | Item 286
                // ? 0xF58 | uint16 | Item 287
                // ? 0xF5A | uint16 | Item 288
                // ? 0xF5C | uint16 | Item 289
                // ? 0xF5E | uint16 | Item 290
                // ? 0xF60 | uint16 | Item 291
                // ? 0xF62 | uint16 | Item 292
                // ? 0xF64 | uint16 | Item 293
                // ? 0xF66 | uint16 | Item 294
                // ? 0xF68 | uint16 | Item 295
                // ? 0xF6A | uint16 | Item 296
                // ? 0xF6C | uint16 | Item 297
                // ? 0xF6E | uint16 | Item 298
                // ? 0xF70 | uint16 | Item 299
                // ? 0xF72 | uint16 | Item 300
                // ? 0xF74 | uint16 | Item 301
                // ? 0xF76 | uint16 | Item 302
                // ? 0xF78 | uint16 | Item 303
                // ? 0xF7A | uint16 | Item 304
                // ? 0xF7C | uint16 | Item 305
                // ? 0xF7E | uint16 | Item 306
                // ? 0xF80 | uint16 | Item 307
                // ? 0xF82 | uint16 | Item 308
                // ? 0xF84 | uint16 | Item 309
                // ? 0xF86 | uint16 | Item 310
                // ? 0xF88 | uint16 | Item 311
                // ? 0xF8A | uint16 | Item 312
                // ? 0xF8C | uint16 | Item 313
                // ? 0xF8E | uint16 | Item 314
                // ? 0xF90 | uint16 | Item 315
                // ? 0xF92 | uint16 | Item 316
                // ? 0xF94 | uint16 | Item 317
                // ? 0xF96 | uint16 | Item 318
                // ? 0xF98 | uint16 | Item 319
                // ? 0xF9A | uint16 | Item 320
                // ? 0xF9C | uint16 | Item 321
                // ? 0xF9E | uint16 | Item 322
                // ? 0xFA0 | uint16 | Item 323
                // ? 0xFA2 | uint16 | Item 324
                // ? 0xFA4 | uint16 | Item 325
                // ? 0xFA6 | uint16 | Item 326
                // ? 0xFA8 | uint16 | Item 327
                // ? 0xFAA | uint16 | Item 328
                // ? 0xFAC | uint16 | Item 329
                // ? 0xFAE | uint16 | Item 330
                // ? 0xFB0 | uint16 | Item 331
                // ? 0xFB2 | uint16 | Item 332
                // ? 0xFB4 | uint16 | Item 333
                // ? 0xFB6 | uint16 | Item 334
                // ? 0xFB8 | uint16 | Item 335
                // ? 0xFBA | uint16 | Item 336
                // ? 0xFBC | uint16 | Item 337
                // ? 0xFBE | uint16 | Item 338
                // ? 0xFC0 | uint16 | Item 339
                // ? 0xFC2 | uint16 | Item 340
                // ? 0xFC4 | uint16 | Item 341
                // ? 0xFC6 | uint16 | Item 342
                // ? 0xFC8 | uint16 | Item 343
                // ? 0xFCA | uint16 | Item 344
                // ? 0xFCC | uint16 | Item 345
                // ? 0xFCE | uint16 | Item 346
                // ? 0xFD0 | uint16 | Item 347
                // ? 0xFD2 | uint16 | Item 348
                // ? 0xFD4 | uint16 | Item 349
                // ? 0xFD6 | uint16 | Item 350
                // ? 0xFD8 | uint16 | Item 351
                // ? 0xFDA | uint16 | Item 352
                // ? 0xFDC | uint16 | Item 353
                // ? 0xFDE | uint16 | Item 354
                // ? 0xFE0 | uint16 | Item 355
                // ? 0xFE2 | uint16 | Item 356
                // ? 0xFE4 | uint16 | Item 357
                // ? 0xFE6 | uint16 | Item 358
                // ? 0xFE8 | uint16 | Item 359
                // ? 0xFEA | uint16 | Item 360
                // ? 0xFEC | uint16 | Item 361
                // ? 0xFEE | uint16 | Item 362
                // ? 0xFF0 | uint16 | Item 363
                // ? 0xFF2 | uint16 | Item 364
                // ? 0xFF4 | uint16 | Item 365
                // ? 0xFF6 | uint16 | Item 366
                // ? 0xFF8 | uint16 | Item 367
                // ? 0xFFA | uint16 | Item 368
                // ? 0xFFC | uint16 | Item 369
                // ? 0xFFE | uint16 | Item 370
                // ? 0x1000 | uint16 | Item 371
                // ? 0x1002 | uint16 | Item 372
                // ? 0x1004 | uint16 | Item 373
                // ? 0x1006 | uint16 | Item 374
                // ? 0x1008 | uint16 | Item 375
                // ? 0x100A | uint16 | Item 376
                // ? 0x100C | uint16 | Item 377
                // ? 0x100E | uint16 | Item 378
                // # Quantities (x15 max)
                // ? 0xB1D | uint8 | ? Sword
                // ? 0xB1E | uint8 | ? Sword
                // ? 0xB1F | uint8 | ? Sword
                // ? 0xB20 | uint8 | ? Sword
                // ? 0xB21 | uint8 | ? Sword
                // ? 0xB22 | uint8 | ? Sword
                // ? 0xB23 | uint8 | ? Sword
                // ? 0xB24 | uint8 | ? Sword
                // ? 0xB25 | uint8 | ? Sword
                // ? 0xB26 | uint8 | ? Sword
                // ? 0xB27 | uint8 | ? Sword
                // ? 0xB28 | uint8 | ? Sword
                // ? 0xB29 | uint8 | ? Sword
                // ? 0xB2A | uint8 | ? Sword
                // ? 0xB2B | uint8 | ? Spear
                // ? 0xB2C | uint8 | ? Axe
                // ? 0xB2D | uint8 | ? Axe
                // ? 0xB2E | uint8 | ? Halberd
                // ? 0xB2F | uint8 | ? Bow
                // ? 0xB30 | uint8 | ? Bow
                // ? 0xB31 | uint8 | ? Bow
                // ? 0xB32 | uint8 | ? Bow
                // ? 0xB33 | uint8 | ? Bow
                // ? 0xB34 | uint8 | ? Bow
                // ? 0xB35 | uint8 | ? Bow
                // ? 0xB36 | uint8 | ? Rod
                // ? 0xB37 | uint8 | ? Rod
                // ? 0xB38 | uint8 | ? Rod
                // ? 0xB39 | uint8 | ? Grimoire
                // ? 0xB3A | uint8 | ? Grimoire
                // ? 0xB3B | uint8 | ? Grimoire
                // ? 0xB3C | uint8 | ? Grimoire
                // ? 0xB3D | uint8 | ? Grimoire
                // ? 0xB3E | uint8 | ? Grimoire
                // ? 0xB3F | uint8 | ? Clothing
                // ? 0xB40 | uint8 | ? Clothing
                // ? 0xB41 | uint8 | ? Armor
                // ? 0xB42 | uint8 | ? Armor
                // ? 0xB43 | uint8 | ? Armor
                // ? 0xB44 | uint8 | ? Armor
                // ? 0xB45 | uint8 | ? Helmet
                // ? 0xB46 | uint8 | ? Helmet
                // ? 0xB47 | uint8 | ? Helmet
                // ? 0xB48 | uint8 | ? Hat
                // ? 0xB49 | uint8 | ? Spear
                // ? 0xB4A | uint8 | ? Axe
                // ? 0xB4B | uint8 | ? Bow
                // ? 0xB4C | uint8 | Pendant
                // ? 0xB4D | uint8 | Stuffed Cress
                // ? 0xB4E | uint8 | Unicorn Earring
                // ? 0xB4F | uint8 | Wraith Ruby
                // ? 0xB50 | uint8 | Morrison's Book
                // ? 0xB51 | uint8 | Broken Bow
                // ? 0xB52 | uint8 | Elemental Orb
                // ? 0xB53 | uint8 | Demeter's Key
                // ? 0xB54 | uint8 | Moria Mine Permit
                // ? 0xB55 | uint8 | Royal Crest
                // ? 0xB56 | uint8 | Lundgrom's Letter
                // ? 0xB57 | uint8 | Broken Rings
                // ? 0xB58 | uint8 | Lava Key
                // ? 0xB59 | uint8 | Card
                // ? 0xB5A | uint8 | Mysterious Mirror
                // ? 0xB5B | uint8 | Golden Key
                // ? 0xB5C | uint8 | Wing Pack
                // ? 0xB5D | uint8 | Ancient Scroll
                // ? 0xB5E | uint8 | Rozania's Dress
                // ? 0xB5F | uint8 | Common Key
                // ? 0xB60 | uint8 | Sacred Wood
                // ? 0xB61 | uint8 | Quicksilver
                // ? 0xB62 | uint8 | Agalloch Incense
                // ? 0xB63 | uint8 | Ukiyo-e
                // ? 0xB64 | uint8 | Coral
                // ? 0xB65 | uint8 | Marble
                // ? 0xB66 | uint8 | Earthenware Pot
                // ? 0xB67 | uint8 | Tapestry
                // ? 0xB68 | uint8 | Ebony Wood
                // ? 0xB69 | uint8 | Pelt
                // ? 0xB6A | uint8 | Caterpillar Fungus
                // ? 0xB6B | uint8 | Teacup
                // ? 0xB6C | uint8 | Shamisen
                // ? 0xB6D | uint8 | Ivory
                // ? 0xB6E | uint8 | Carrot
                // ? 0xB6F | uint8 | Cabbage
                // ? 0xB70 | uint8 | Lettuce
                // ? 0xB71 | uint8 | Radish
                // ? 0xB72 | uint8 | Cucumber
                // ? 0xB73 | uint8 | Potato
                // ? 0xB74 | uint8 | Tomato
                // ? 0xB75 | uint8 | Onion
                // ? 0xB76 | uint8 | Apple
                // ? 0xB77 | uint8 | Lemon
                // ? 0xB78 | uint8 | Strawberry
                // ? 0xB79 | uint8 | Banana
                // ? 0xB7A | uint8 | Pineapple
                // ? 0xB7B | uint8 | Melon
                // ? 0xB7C | uint8 | Grapes
                // ? 0xB7D | uint8 | Mangosteen
                // ? 0xB7E | uint8 | Prune
                // ? 0xB7F | uint8 | Tuna
                // ? 0xB80 | uint8 | Mackerel
                // ? 0xB81 | uint8 | Sardine
                // ? 0xB82 | uint8 | Squid
                // ? 0xB83 | uint8 | Octopus
                // ? 0xB84 | uint8 | Shrimp
                // ? 0xB85 | uint8 | Chicken
                // ? 0xB86 | uint8 | Beef
                // ? 0xB87 | uint8 | Pork
                // ? 0xB88 | uint8 | Milk
                // ? 0xB89 | uint8 | Cheese
                // ? 0xB8A | uint8 | Konjac
                // ? 0xB8B | uint8 | Kelp
                // ? 0xB8C | uint8 | Egg
                // ? 0xB8D | uint8 | Miso
                // ? 0xB8E | uint8 | Bread
                // ? 0xB8F | uint8 | Rice
                // ? 0xB90 | uint8 | Seaweed
                // ? 0xB91 | uint8 | Spices
                // ? 0xB92 | uint8 | Pasta
                // ? 0xB93 | uint8 | Apple Gel
                // ? 0xB94 | uint8 | Orange Gel
                // ? 0xB95 | uint8 | Melange Gel
                // ? 0xB96 | uint8 | Lemon Gel
                // ? 0xB97 | uint8 | Pineapple Gel
                // ? 0xB98 | uint8 | Miracle Gel
                // ? 0xB99 | uint8 | Elixir
                // ? 0xB9A | uint8 | Basilisk Scale
                // ? 0xB9B | uint8 | Sage
                // ? 0xB9C | uint8 | Savory
                // ? 0xB9D | uint8 | Verbena
                // ? 0xB9E | uint8 | Lavender
                // ? 0xB9F | uint8 | Red Sage
                // ? 0xBA0 | uint8 | Red Savory
                // ? 0xBA1 | uint8 | Red Verbena
                // ? 0xBA2 | uint8 | Red Lavender
                // ? 0xBA3 | uint8 | Panacea Bottle
                // ? 0xBA4 | uint8 | Life Bottle
                // ? 0xBA5 | uint8 | Flare Bottle
                // ? 0xBA6 | uint8 | Liqueur Bottle
                // ? 0xBA7 | uint8 | Holy Bottle
                // ? 0xBA8 | uint8 | Dark Bottle
                // ? 0xBA9 | uint8 | Rune Bottle
                // ? 0xBAA | uint8 | Charm Bottle
                // ? 0xBAB | uint8 | Miracle Charm
                // ? 0xBAC | uint8 | World Map
                // ? 0xBAD | uint8 | Scout Orb
                // ? 0xBAE | uint8 | Hourglass
                // ? 0xBAF | uint8 | Chronos' Hourglass
                // ? 0xBB0 | uint8 | Combo Counter
                // ? 0xBB1 | uint8 | Magic Lens
                // ? 0xBB2 | uint8 | Pickaxe
                // ? 0xBB3 | uint8 | Magical Rouge
                // ? 0xBB4 | uint8 | Red Lantern
                // ? 0xBB5 | uint8 | Green Torch
                // ? 0xBB6 | uint8 | Blue Candle
                // ? 0xBB7 | uint8 | Rope
                // ? 0xBB8 | uint8 | Drum Set
                // ? 0xBB9 | uint8 | Mahjong Tile
                // ? 0xBBA | uint8 | Monster Book
                // ? 0xBBB | uint8 | Collector's Book
                // ? 0xBBC | uint8 | Ticket
                // ? 0xBBD | uint8 | Long Sword
                // ? 0xBBE | uint8 | Saber
                // ? 0xBBF | uint8 | Rapier
                // ? 0xBC0 | uint8 | Knight's Saber
                // ? 0xBC1 | uint8 | Verdun
                // ? 0xBC2 | uint8 | Colichemarde
                // ? 0xBC3 | uint8 | Fine Saber
                // ? 0xBC4 | uint8 | Walloon Sword
                // ? 0xBC5 | uint8 | Fame and Faith
                // ? 0xBC6 | uint8 | Slayer Sword
                // ? 0xBC7 | uint8 | Moon Falx
                // ? 0xBC8 | uint8 | Damascus Sword
                // ? 0xBC9 | uint8 | Sinclair Saber
                // ? 0xBCA | uint8 | Destroyer
                // ? 0xBCB | uint8 | Holy Sword
                // ? 0xBCC | uint8 | Dragon's Tooth
                // ? 0xBCD | uint8 | Flare Basilard
                // ? 0xBCE | uint8 | Ice Coffin
                // ? 0xBCF | uint8 | Laser Blade
                // ? 0xBD0 | uint8 | Duelist's Sword
                // ? 0xBD1 | uint8 | Blessed Blade
                // ? 0xBD2 | uint8 | Muramasa
                // ? 0xBD3 | uint8 | Vizier's Rapier
                // ? 0xBD4 | uint8 | Saint's Rapier
                // ? 0xBD5 | uint8 | Doom Blade
                // ? 0xBD6 | uint8 | Excalibur
                // ? 0xBD7 | uint8 | Vorpal Sword
                // ? 0xBD8 | uint8 | Flamberge
                // ? 0xBD9 | uint8 | Swordian Dymlos
                // ? 0xBDA | uint8 | Corsesca
                // ? 0xBDB | uint8 | Gungnir
                // ? 0xBDC | uint8 | Bisento
                // ? 0xBDD | uint8 | Vanguard
                // ? 0xBDE | uint8 | Arc Wind
                // ? 0xBDF | uint8 | Gungnir (True Form)
                // ? 0xBE0 | uint8 | Gungnir (???)
                // ? 0xBE1 | uint8 | Battle Axe
                // ? 0xBE2 | uint8 | Crescent Axe
                // ? 0xBE3 | uint8 | Bardiche
                // ? 0xBE4 | uint8 | Strike Axe
                // ? 0xBE5 | uint8 | Labrys
                // ? 0xBE6 | uint8 | Bahamut's Tear
                // ? 0xBE7 | uint8 | Halberd
                // ? 0xBE8 | uint8 | Pole Axe
                // ? 0xBE9 | uint8 | Mechanical Halberd
                // ? 0xBEA | uint8 | Saint's Halberd
                // ? 0xBEB | uint8 | Self Shortbow
                // ? 0xBEC | uint8 | Self Longbow
                // ? 0xBED | uint8 | Composite Bow
                // ? 0xBEE | uint8 | Cranequin
                // ? 0xBEF | uint8 | Aqua Spreader
                // ? 0xBF0 | uint8 | Flare Spreader
                // ? 0xBF1 | uint8 | Sand Spreader
                // ? 0xBF2 | uint8 | Gale Spreader
                // ? 0xBF3 | uint8 | Crescent Bow
                // ? 0xBF4 | uint8 | Elven Bow
                // ? 0xBF5 | uint8 | Merciless Bow
                // ? 0xBF6 | uint8 | Berserker Bow
                // ? 0xBF7 | uint8 | Elven Bow (True Form)
                // ? 0xBF8 | uint8 | Rod
                // ? 0xBF9 | uint8 | Gem Rod
                // ? 0xBFA | uint8 | Ruby Wand
                // ? 0xBFB | uint8 | Rune Staff
                // ? 0xBFC | uint8 | Unicorn Horn
                // ? 0xBFD | uint8 | Holy Staff
                // ? 0xBFE | uint8 | Star Mace
                // ? 0xBFF | uint8 | Blue Crystal Rod
                // ? 0xC00 | uint8 | Naughty Magazine
                // ? 0xC01 | uint8 | N.G.
                // ? 0xC02 | uint8 | Necronomicon
                // ? 0xC03 | uint8 | The King in Yellow
                // ? 0xC04 | uint8 | Celaeno Fragments
                // ? 0xC05 | uint8 | Liber Ivonis
                // ? 0xC06 | uint8 | Cthaat Aquadingen
                // ? 0xC07 | uint8 | G'harne Fragments
                // ? 0xC08 | uint8 | Seven Books of Hsan
                // ? 0xC09 | uint8 | Massa di Requiem
                // ? 0xC0A | uint8 | True Magic
                // ? 0xC0B | uint8 | Broom
                // ? 0xC0C | uint8 | Mystic Broom
                // ? 0xC0D | uint8 | Magical Broom
                // ? 0xC0E | uint8 | Sylphic Broom
                // ? 0xC0F | uint8 | Wonder Broom
                // ? 0xC10 | uint8 | Star Broom
                // ? 0xC11 | uint8 | Deck Brush
                // ? 0xC12 | uint8 | Botan
                // ? 0xC13 | uint8 | Ayame
                // ? 0xC14 | uint8 | Kikyo
                // ? 0xC15 | uint8 | Kuroyuri
                // ? 0xC16 | uint8 | Chizakura
                // ? 0xC17 | uint8 | Eternal Sword
                // ? 0xC18 | uint8 | Leather Armor
                // ? 0xC19 | uint8 | Chain Mail
                // ? 0xC1A | uint8 | Ring Mail
                // ? 0xC1B | uint8 | Splint Mail
                // ? 0xC1C | uint8 | Breastplate
                // ? 0xC1D | uint8 | Plate Mail
                // ? 0xC1E | uint8 | Mythril Plate
                // ? 0xC1F | uint8 | Reflex
                // ? 0xC20 | uint8 | Silver Plate
                // ? 0xC21 | uint8 | Rare Plate
                // ? 0xC22 | uint8 | Mumbane
                // ? 0xC23 | uint8 | Gold Armor
                // ? 0xC24 | uint8 | Cloak
                // ? 0xC25 | uint8 | Amber Cloak
                // ? 0xC26 | uint8 | Silver Cloak
                // ? 0xC27 | uint8 | Holy Cloak
                // ? 0xC28 | uint8 | Star Cloak
                // ? 0xC29 | uint8 | Mythril Mesh
                // ? 0xC2A | uint8 | Witch Dress
                // ? 0xC2B | uint8 | Kisaragi
                // ? 0xC2C | uint8 | Yayoi
                // ? 0xC2D | uint8 | Nagatsuki
                // ? 0xC2E | uint8 | Kannazuki
                // ? 0xC2F | uint8 | Wooden Shield
                // ? 0xC30 | uint8 | Round Shield
                // ? 0xC31 | uint8 | Kite Shield
                // ? 0xC32 | uint8 | Tower Shield
                // ? 0xC33 | uint8 | Fine Shield
                // ? 0xC34 | uint8 | Ankh Shield
                // ? 0xC35 | uint8 | Rare Shield
                // ? 0xC36 | uint8 | Red Shield
                // ? 0xC37 | uint8 | Star Shield
                // ? 0xC38 | uint8 | Blue Shield
                // ? 0xC39 | uint8 | Shield Ring
                // ? 0xC3A | uint8 | Leather Helm
                // ? 0xC3B | uint8 | Iron Sallet
                // ? 0xC3C | uint8 | Armet
                // ? 0xC3D | uint8 | Close Helm
                // ? 0xC3E | uint8 | Duelist's Helm
                // ? 0xC3F | uint8 | Rare Helm
                // ? 0xC40 | uint8 | Golden Helm
                // ? 0xC41 | uint8 | Star Helm
                // ? 0xC42 | uint8 | Beret
                // ? 0xC43 | uint8 | Mitre
                // ? 0xC44 | uint8 | Straw Hat
                // ? 0xC45 | uint8 | Fine Hat
                // ? 0xC46 | uint8 | Star Cap
                // ? 0xC47 | uint8 | Ninja Hood
                // ? 0xC48 | uint8 | Ninja Mask
                // ? 0xC49 | uint8 | Blue Ribbon
                // ? 0xC4A | uint8 | Long Blue Ribbon
                // ? 0xC4B | uint8 | Striped Ribbon
                // ? 0xC4C | uint8 | Pretty Ribbon
                // ? 0xC4D | uint8 | Magical Ribbon
                // ? 0xC4E | uint8 | Leather Gloves
                // ? 0xC4F | uint8 | Iron Gloves
                // ? 0xC50 | uint8 | Gauntlets
                // ? 0xC51 | uint8 | Mythril Gloves
                // ? 0xC52 | uint8 | Rare Gauntlets
                // ? 0xC53 | uint8 | Star Gloves
                // ? 0xC54 | uint8 | Hyper Gauntlets
                // ? 0xC55 | uint8 | Claw Gauntlet
                // ? 0xC56 | uint8 | Oven Mitts
                // ? 0xC57 | uint8 | Pretty Mittens
                // ? 0xC58 | uint8 | Mother's Mittens
                // ? 0xC59 | uint8 | Bridal Gloves
                // ? 0xC5A | uint8 | Stone Charm
                // ? 0xC5B | uint8 | Talisman
                // ? 0xC5C | uint8 | Blue Talisman
                // ? 0xC5D | uint8 | Paralysis Charm
                // ? 0xC5E | uint8 | Stun Bracelet
                // ? 0xC5F | uint8 | Poison Charm
                // ? 0xC60 | uint8 | Rabbit's Foot
                // ? 0xC61 | uint8 | Flame Charm
                // ? 0xC62 | uint8 | Ice Charm
                // ? 0xC63 | uint8 | Manji Symbol
                // ? 0xC64 | uint8 | Silver Cape
                // ? 0xC65 | uint8 | Princess Cape
                // ? 0xC66 | uint8 | Heavy Boots
                // ? 0xC67 | uint8 | Elven Boots
                // ? 0xC68 | uint8 | Jet Boots
                // ? 0xC69 | uint8 | Persian Boots
                // ? 0xC6A | uint8 | Succubus Boots
                // ? 0xC6B | uint8 | Water Spiders
                // ? 0xC6C | uint8 | Cape
                // ? 0xC6D | uint8 | Leather Cape
                // ? 0xC6E | uint8 | Thief's Cape
                // ? 0xC6F | uint8 | Elven Cape
                // ? 0xC70 | uint8 | Flare Cape
                // ? 0xC71 | uint8 | Aqua Cape
                // ? 0xC72 | uint8 | Aquamarine
                // ? 0xC73 | uint8 | Amethyst
                // ? 0xC74 | uint8 | Emerald
                // ? 0xC75 | uint8 | Opal
                // ? 0xC76 | uint8 | Garnet
                // ? 0xC77 | uint8 | Sardonyx
                // ? 0xC78 | uint8 | Sapphire
                // ? 0xC79 | uint8 | Turquoise
                // ? 0xC7A | uint8 | Diamond
                // ? 0xC7B | uint8 | Topaz
                // ? 0xC7C | uint8 | Moonstone
                // ? 0xC7D | uint8 | Ruby
                // ? 0xC7E | uint8 | Sorcerer's Ring
                // ? 0xC7F | uint8 | Emerald Ring
                // ? 0xC80 | uint8 | Faerie Ring
                // ? 0xC81 | uint8 | Spirit Ring
                // ? 0xC82 | uint8 | Protect Ring
                // ? 0xC83 | uint8 | Force Ring
                // ? 0xC84 | uint8 | Resist Ring
                // ? 0xC85 | uint8 | Reflect Ring
                // ? 0xC86 | uint8 | Channeling Ring
                // ? 0xC87 | uint8 | Dash Ring
                // ? 0xC88 | uint8 | Technical Ring
                // ? 0xC89 | uint8 | Rebirth Doll
                // ? 0xC8A | uint8 | Sephira
                // ? 0xC8B | uint8 | Blue Sephira
                // ? 0xC8C | uint8 | Gravity Stone
                // ? 0xC8D | uint8 | Black Onyx
                // ? 0xC8E | uint8 | Orb of White Mist
                // ? 0xC8F | uint8 | Orb of Magical Mist
                // ? 0xC90 | uint8 | Moon Crystal
                // ? 0xC91 | uint8 | Derris Emblem
                // ? 0xC92 | uint8 | Warrior Symbol
                // ? 0xC93 | uint8 | Attack Symbol
                // ? 0xC94 | uint8 | Holy Symbol
                // ? 0xC95 | uint8 | Mystic Symbol
                // ? 0xC96 | uint8 | Dark Seal
                // ? 0xC97 | uint8 | Demon's Seal
                // ? 0xC98 | uint8 | Unicorn Earring
                // ? 0xC99 | uint8 | Combo Command
                // ? 0xC9A | uint8 | Rock Breaker
                // ? 0xC9B | uint8 | Magical Pouch
                // ? 0xC9C | uint8 | Mystic Pouch
                // ? 0xC9D | uint8 | Mirror Image Patch
                // ? 0xC9E | uint8 | Curio's Mirror
                // ? 0xC9F | uint8 | Red Card
                // ? 0xCA0 | uint8 | Green Card
                // ? 0xCA1 | uint8 | Blue Card
                // ? 0xCA2 | uint8 | Yellow Card
                // ? 0xCA3 | uint8 | White Card
                // ? 0xCA4 | uint8 | Brown Card
                // ? 0xCA5 | uint8 | Black Card
                // ? 0xCA6 | uint8 | Statue of Bravery
                // ? 0xCA7 | uint8 | Statue of Justice
                // ? 0xCA8 | uint8 | Statue of Friendship
                // ? 0xCA9 | uint8 | Statue of Love
                // ? 0xCAA | uint8 | Statue of Dreams
                // ? 0xCAB | uint8 | Special Flag
              ],
            },
            {
              name: "Titles",
              flex: true,
              items: characterList.map((character) => ({
                type: "section",
                items: [
                  {
                    name: character.name,
                    offset: 0x64f + character.index * 0xa0,
                    type: "variable",
                    dataType: "uint8",
                    resource: "titles",
                    autocomplete: true,
                  },
                  {
                    type: "bitflags",
                    flags: titleList
                      .filter((title) => title.character === character.index)
                      .map((title) => ({
                        offset: 0x11fc + bitToOffset(title.index),
                        bit: title.index % 8,
                        label: title.name,
                      })),
                  },
                ],
              })),

              // # Cress
              // ? 0x11FC | 0 | Apprentice Swordsman
              // ? 0x11FC | 1 | Swordsman
              // ? 0x11FC | 2 | Battlemaster
              // ? 0x11FC | 3 | Swordmaster
              // ? 0x11FC | 4 | Fencer
              // ? 0x11FC | 5 | Brave Fencer
              // ? 0x11FC | 6 | Last Fencer
              // ? 0x11FC | 7 | Alvein Successor
              // ? 0x11FD | 0 | Combo Commander
              // ? 0x11FD | 1 | Berserker
              // ? 0x11FD | 2 | Champion
              // ? 0x11FD | 3 | Gourmet King
              // ? 0x11FD | 4 | Subtraction Guru
              // ? 0x11FD | 5 | Eternal Swordsman
              // ? 0x11FD | 6 | Gilgamesh
              // ? 0x11FD | 7 | Mach Boy
              // ? 0x64F | uint8 | Title // * 0xa0
              // # Mint
              // ? 0x11FE | 0 | Healer
              // ? 0x11FE | 1 | Cleric
              // ? 0x11FE | 2 | Priestess
              // ? 0x11FE | 3 | Bishop
              // ? 0x11FE | 4 | Cardinal
              // ? 0x11FE | 5 | Pope
              // ! 0x11FE | 6 | ???
              // ! 0x11FE | 7 | ???
              // ? 0x11FF | 0 | Cupid
              // ? 0x11FF | 1 | Ms. Puffy Muffins
              // ? 0x11FF | 2 | Pure Maiden
              // ? 0x11FF | 3 | Gourmet Queen
              // ? 0x11FF | 4 | Songstress
              // ? 0x11FF | 5 | Professor Adnade
              // ! 0x11FF | 6 | ???
              // ! 0x11FF | 7 | ???
              // # Arche
              // ? 0x1200 | 0 | Magic User
              // ? 0x1200 | 1 | Witch
              // ? 0x1200 | 2 | Mage
              // ? 0x1200 | 3 | Sorceress
              // ? 0x1200 | 4 | Wizardess
              // ? 0x1200 | 5 | Magic Maestro
              // ! 0x1200 | 6 | ???
              // ! 0x1200 | 7 | ???
              // ? 0x1201 | 0 | Three Sheets to the Wind
              // ? 0x1201 | 1 | Pancake Chick
              // ? 0x1201 | 2 | Femme Fatale Failure
              // ? 0x1201 | 3 | Gourmet Queen?
              // ? 0x1201 | 4 | Worst. Chef. Ever.
              // ? 0x1201 | 5 | GROOVY
              // ! 0x1201 | 6 | ???
              // ! 0x1201 | 7 | ???
              // # Claus
              // ? 0x1202 | 0 | Magic Scholar
              // ? 0x1202 | 1 | Tamer
              // ? 0x1202 | 2 | Summoner
              // ? 0x1202 | 3 | Elementalist
              // ? 0x1202 | 4 | Warlock
              // ? 0x1202 | 5 | Master Summoner
              // ! 0x1202 | 6 | ???
              // ! 0x1202 | 7 | ???
              // ? 0x1203 | 0 | Monster Hunter
              // ? 0x1203 | 1 | Item Collector
              // ? 0x1203 | 2 | Treasure Hunter
              // ? 0x1203 | 3 | Gourmet King
              // ? 0x1203 | 4 | Henpecked Man
              // ? 0x1203 | 5 | Distant Lover
              // ! 0x1203 | 6 | ???
              // ! 0x1203 | 7 | ???
              // # Chester
              // ? 0x1204 | 0 | Hunter
              // ? 0x1204 | 1 | Ranger
              // ? 0x1204 | 2 | Archer
              // ? 0x1204 | 3 | Sniper
              // ? 0x1204 | 4 | Shooter
              // ? 0x1204 | 5 | Striker
              // ! 0x1204 | 6 | ???
              // ! 0x1204 | 7 | ???
              // ? 0x1205 | 0 | Kind Brother
              // ? 0x1205 | 1 | Workhorse
              // ? 0x1205 | 2 | Demon Prince of Perverts
              // ? 0x1205 | 3 | Gourmet King
              // ? 0x1205 | 4 | Super Mach Bastard
              // ? 0x1205 | 5 | Ripped Dude
              // ! 0x1205 | 6 | ???
              // ! 0x1205 | 7 | ???
              // # Suzu
              // ? 0x1206 | 0 | Sparrow Ninja
              // ? 0x1206 | 1 | Raven Ninja
              // ? 0x1206 | 2 | Swallow Ninja
              // ? 0x1206 | 3 | Falcon Ninja
              // ? 0x1206 | 4 | Hawk Ninja
              // ? 0x1206 | 5 | Crane Ninja
              // ! 0x1206 | 6 | ???
              // ! 0x1206 | 7 | ???
              // ? 0x1207 | 0 | Heart of Steel
              // ? 0x1207 | 1 | Successor
              // ? 0x1207 | 2 | Sweet Tooth
              // ? 0x1207 | 3 | Gourmet Queen
              // ? 0x1207 | 4 | Shinobi
              // ? 0x1207 | 5 | Smitten Girl
              // ! 0x1207 | 6 | ???
              // ! 0x1207 | 7 | ???
            },
            {
              name: "Cooking",
              items: [
                {
                  type: "tabs",
                  vertical: true,
                  items: [
                    {
                      name: "Recipes",
                      items: [
                        {
                          type: "bitflags",
                          flags: recipeList.map((recipe) => ({
                            offset: 0x133c + bitToOffset(recipe.index),
                            bit: recipe.index % 8,
                            label: recipe.name,
                          })),
                        },
                      ],
                    },
                    ...characterList.map(
                      (character) =>
                        ({
                          name: character.name,
                          flex: true,
                          items: recipeList.map((recipe) => ({
                            name: recipe.name,
                            offset:
                              0x681 + character.index * 0xa0 + recipe.index,
                            type: "variable",
                            dataType: "uint8",
                            max: 100,
                            suffix: "%",
                          })),
                        }) as ItemTab,
                    ),
                  ],
                },
              ],
            },
            {
              name: "Events",
              items: [
                {
                  type: "tabs",
                  vertical: true,
                  items: [
                    {
                      name: "Collector's Book",
                      items: [
                        // ! 0x112C | 0 | ???
                        // ? 0x112C | 1 | ? Sword
                        // ? 0x112C | 2 | ? Sword
                        // ? 0x112C | 3 | ? Sword
                        // ? 0x112C | 4 | ? Sword
                        // ? 0x112C | 5 | ? Sword
                        // ? 0x112C | 6 | ? Sword
                        // ? 0x112C | 7 | ? Sword
                        // ? 0x112D | 0 | ? Sword
                        // ? 0x112D | 1 | ? Sword
                        // ? 0x112D | 2 | ? Sword
                        // ? 0x112D | 3 | ? Sword
                        // ? 0x112D | 4 | ? Sword
                        // ? 0x112D | 5 | ? Sword
                        // ? 0x112D | 6 | ? Sword
                        // ? 0x112D | 7 | ? Spear
                        // ? 0x112E | 0 | ? Axe
                        // ? 0x112E | 1 | ? Axe
                        // ? 0x112E | 2 | ? Halberd
                        // ? 0x112E | 3 | ? Bow
                        // ? 0x112E | 4 | ? Bow
                        // ? 0x112E | 5 | ? Bow
                        // ? 0x112E | 6 | ? Bow
                        // ? 0x112E | 7 | ? Bow
                        // ? 0x112F | 0 | ? Bow
                        // ? 0x112F | 1 | ? Bow
                        // ? 0x112F | 2 | ? Rod
                        // ? 0x112F | 3 | ? Rod
                        // ? 0x112F | 4 | ? Rod
                        // ? 0x112F | 5 | ? Grimoire
                        // ? 0x112F | 6 | ? Grimoire
                        // ? 0x112F | 7 | ? Grimoire
                        // ? 0x1130 | 0 | ? Grimoire
                        // ? 0x1130 | 1 | ? Grimoire
                        // ? 0x1130 | 2 | ? Grimoire
                        // ? 0x1130 | 3 | ? Clothing
                        // ? 0x1130 | 4 | ? Clothing
                        // ? 0x1130 | 5 | ? Armor
                        // ? 0x1130 | 6 | ? Armor
                        // ? 0x1130 | 7 | ? Armor
                        // ? 0x1131 | 0 | ? Armor
                        // ? 0x1131 | 1 | ? Helmet
                        // ? 0x1131 | 2 | ? Helmet
                        // ? 0x1131 | 3 | ? Helmet
                        // ? 0x1131 | 4 | ? Hat
                        // ? 0x1131 | 5 | ? Spear
                        // ? 0x1131 | 6 | ? Axe
                        // ? 0x1131 | 7 | ? Bow
                        // ? 0x1132 | 0 | Pendant
                        // ? 0x1132 | 1 | Stuffed Cress
                        // ? 0x1132 | 2 | Unicorn Earring
                        // ? 0x1132 | 3 | Wraith Ruby
                        // ? 0x1132 | 4 | Morrison's Book
                        // ? 0x1132 | 5 | Broken Bow
                        // ? 0x1132 | 6 | Elemental Orb
                        // ? 0x1132 | 7 | Demeter's Key
                        // ? 0x1133 | 0 | Moria Mine Permit
                        // ? 0x1133 | 1 | Royal Crest
                        // ? 0x1133 | 2 | Lundgrom's Letter
                        // ? 0x1133 | 3 | Broken Rings
                        // ? 0x1133 | 4 | Lava Key
                        // ? 0x1133 | 5 | Card
                        // ? 0x1133 | 6 | Mysterious Mirror
                        // ? 0x1133 | 7 | Golden Key
                        // ? 0x1134 | 0 | Wing Pack
                        // ? 0x1134 | 1 | Ancient Scroll
                        // ? 0x1134 | 2 | Rozania's Dress
                        // ? 0x1134 | 3 | Common Key
                        // ? 0x1134 | 4 | Sacred Wood
                        // ? 0x1134 | 5 | Quicksilver
                        // ? 0x1134 | 6 | Agalloch Incense
                        // ? 0x1134 | 7 | Ukiyo-e
                        // ? 0x1135 | 0 | Coral
                        // ? 0x1135 | 1 | Marble
                        // ? 0x1135 | 2 | Earthenware Pot
                        // ? 0x1135 | 3 | Tapestry
                        // ? 0x1135 | 4 | Ebony Wood
                        // ? 0x1135 | 5 | Pelt
                        // ? 0x1135 | 6 | Caterpillar Fungus
                        // ? 0x1135 | 7 | Teacup
                        // ? 0x1136 | 0 | Shamisen
                        // ? 0x1136 | 1 | Ivory
                        // ? 0x1136 | 2 | Carrot
                        // ? 0x1136 | 3 | Cabbage
                        // ? 0x1136 | 4 | Lettuce
                        // ? 0x1136 | 5 | Radish
                        // ? 0x1136 | 6 | Cucumber
                        // ? 0x1136 | 7 | Potato
                        // ? 0x1137 | 0 | Tomato
                        // ? 0x1137 | 1 | Onion
                        // ? 0x1137 | 2 | Apple
                        // ? 0x1137 | 3 | Lemon
                        // ? 0x1137 | 4 | Strawberry
                        // ? 0x1137 | 5 | Banana
                        // ? 0x1137 | 6 | Pineapple
                        // ? 0x1137 | 7 | Melon
                        // ? 0x1138 | 0 | Grapes
                        // ? 0x1138 | 1 | Mangosteen
                        // ? 0x1138 | 2 | Prune
                        // ? 0x1138 | 3 | Tuna
                        // ? 0x1138 | 4 | Mackerel
                        // ? 0x1138 | 5 | Sardine
                        // ? 0x1138 | 6 | Squid
                        // ? 0x1138 | 7 | Octopus
                        // ? 0x1139 | 0 | Shrimp
                        // ? 0x1139 | 1 | Chicken
                        // ? 0x1139 | 2 | Beef
                        // ? 0x1139 | 3 | Pork
                        // ? 0x1139 | 4 | Milk
                        // ? 0x1139 | 5 | Cheese
                        // ? 0x1139 | 6 | Konjac
                        // ? 0x1139 | 7 | Kelp
                        // ? 0x113A | 0 | Egg
                        // ? 0x113A | 1 | Miso
                        // ? 0x113A | 2 | Bread
                        // ? 0x113A | 3 | Rice
                        // ? 0x113A | 4 | Seaweed
                        // ? 0x113A | 5 | Spices
                        // ? 0x113A | 6 | Pasta
                        // ? 0x113A | 7 | Apple Gel
                        // ? 0x113B | 0 | Orange Gel
                        // ? 0x113B | 1 | Melange Gel
                        // ? 0x113B | 2 | Lemon Gel
                        // ? 0x113B | 3 | Pineapple Gel
                        // ? 0x113B | 4 | Miracle Gel
                        // ? 0x113B | 5 | Elixir
                        // ? 0x113B | 6 | Basilisk Scale
                        // ? 0x113B | 7 | Sage
                        // ? 0x113C | 0 | Savory
                        // ? 0x113C | 1 | Verbena
                        // ? 0x113C | 2 | Lavender
                        // ? 0x113C | 3 | Red Sage
                        // ? 0x113C | 4 | Red Savory
                        // ? 0x113C | 5 | Red Verbena
                        // ? 0x113C | 6 | Red Lavender
                        // ? 0x113C | 7 | Panacea Bottle
                        // ? 0x113D | 0 | Life Bottle
                        // ? 0x113D | 1 | Flare Bottle
                        // ? 0x113D | 2 | Liqueur Bottle
                        // ? 0x113D | 3 | Holy Bottle
                        // ? 0x113D | 4 | Dark Bottle
                        // ? 0x113D | 5 | Rune Bottle
                        // ? 0x113D | 6 | Charm Bottle
                        // ? 0x113D | 7 | Miracle Charm
                        // ? 0x113E | 0 | World Map
                        // ? 0x113E | 1 | Scout Orb
                        // ? 0x113E | 2 | Hourglass
                        // ? 0x113E | 3 | Chronos' Hourglass
                        // ? 0x113E | 4 | Combo Counter
                        // ? 0x113E | 5 | Magic Lens
                        // ? 0x113E | 6 | Pickaxe
                        // ? 0x113E | 7 | Magical Rouge
                        // ? 0x113F | 0 | Red Lantern
                        // ? 0x113F | 1 | Green Torch
                        // ? 0x113F | 2 | Blue Candle
                        // ? 0x113F | 3 | Rope
                        // ? 0x113F | 4 | Drum Set
                        // ? 0x113F | 5 | Mahjong Tile
                        // ? 0x113F | 6 | Monster Book
                        // ? 0x113F | 7 | Collector's Book
                        // ? 0x1140 | 0 | Ticket
                        // ? 0x1140 | 1 | Long Sword
                        // ? 0x1140 | 2 | Saber
                        // ? 0x1140 | 3 | Rapier
                        // ? 0x1140 | 4 | Knight's Saber
                        // ? 0x1140 | 5 | Verdun
                        // ? 0x1140 | 6 | Colichemarde
                        // ? 0x1140 | 7 | Fine Saber
                        // ? 0x1141 | 0 | Walloon Sword
                        // ? 0x1141 | 1 | Fame and Faith
                        // ? 0x1141 | 2 | Slayer Sword
                        // ? 0x1141 | 3 | Moon Falx
                        // ? 0x1141 | 4 | Damascus Sword
                        // ? 0x1141 | 5 | Sinclair Saber
                        // ? 0x1141 | 6 | Destroyer
                        // ? 0x1141 | 7 | Holy Sword
                        // ? 0x1142 | 0 | Dragon's Tooth
                        // ? 0x1142 | 1 | Flare Basilard
                        // ? 0x1142 | 2 | Ice Coffin
                        // ? 0x1142 | 3 | Laser Blade
                        // ? 0x1142 | 4 | Duelist's Sword
                        // ? 0x1142 | 5 | Blessed Blade
                        // ? 0x1142 | 6 | Muramasa
                        // ? 0x1142 | 7 | Vizier's Rapier
                        // ? 0x1143 | 0 | Saint's Rapier
                        // ? 0x1143 | 1 | Doom Blade
                        // ? 0x1143 | 2 | Excalibur
                        // ? 0x1143 | 3 | Vorpal Sword
                        // ? 0x1143 | 4 | Flamberge
                        // ? 0x1143 | 5 | Swordian Dymlos
                        // ? 0x1143 | 6 | Corsesca
                        // ? 0x1143 | 7 | Gungnir
                        // ? 0x1144 | 0 | Bisento
                        // ? 0x1144 | 1 | Vanguard
                        // ? 0x1144 | 2 | Arc Wind
                        // ? 0x1144 | 3 | Gungnir (True Form)
                        // ? 0x1144 | 4 | Gungnir (???)
                        // ? 0x1144 | 5 | Battle Axe
                        // ? 0x1144 | 6 | Crescent Axe
                        // ? 0x1144 | 7 | Bardiche
                        // ? 0x1145 | 0 | Strike Axe
                        // ? 0x1145 | 1 | Labrys
                        // ? 0x1145 | 2 | Bahamut's Tear
                        // ? 0x1145 | 3 | Halberd
                        // ? 0x1145 | 4 | Pole Axe
                        // ? 0x1145 | 5 | Mechanical Halberd
                        // ? 0x1145 | 6 | Saint's Halberd
                        // ? 0x1145 | 7 | Self Shortbow
                        // ? 0x1146 | 0 | Self Longbow
                        // ? 0x1146 | 1 | Composite Bow
                        // ? 0x1146 | 2 | Cranequin
                        // ? 0x1146 | 3 | Aqua Spreader
                        // ? 0x1146 | 4 | Flare Spreader
                        // ? 0x1146 | 5 | Sand Spreader
                        // ? 0x1146 | 6 | Gale Spreader
                        // ? 0x1146 | 7 | Crescent Bow
                        // ? 0x1147 | 0 | Elven Bow
                        // ? 0x1147 | 1 | Merciless Bow
                        // ? 0x1147 | 2 | Berserker Bow
                        // ? 0x1147 | 3 | Elven Bow (True Form)
                        // ? 0x1147 | 4 | Rod
                        // ? 0x1147 | 5 | Gem Rod
                        // ? 0x1147 | 6 | Ruby Wand
                        // ? 0x1147 | 7 | Rune Staff
                        // ? 0x1148 | 0 | Unicorn Horn
                        // ? 0x1148 | 1 | Holy Staff
                        // ? 0x1148 | 2 | Star Mace
                        // ? 0x1148 | 3 | Blue Crystal Rod
                        // ? 0x1148 | 4 | Naughty Magazine
                        // ? 0x1148 | 5 | N.G.
                        // ? 0x1148 | 6 | Necronomicon
                        // ? 0x1148 | 7 | The King in Yellow
                        // ? 0x1149 | 0 | Celaeno Fragments
                        // ? 0x1149 | 1 | Liber Ivonis
                        // ? 0x1149 | 2 | Cthaat Aquadingen
                        // ? 0x1149 | 3 | G'harne Fragments
                        // ? 0x1149 | 4 | Seven Books of Hsan
                        // ? 0x1149 | 5 | Massa di Requiem
                        // ? 0x1149 | 6 | True Magic
                        // ? 0x1149 | 7 | Broom
                        // ? 0x114A | 0 | Mystic Broom
                        // ? 0x114A | 1 | Magical Broom
                        // ? 0x114A | 2 | Sylphic Broom
                        // ? 0x114A | 3 | Wonder Broom
                        // ? 0x114A | 4 | Star Broom
                        // ? 0x114A | 5 | Deck Brush
                        // ? 0x114A | 6 | Botan
                        // ? 0x114A | 7 | Ayame
                        // ? 0x114B | 0 | Kikyo
                        // ? 0x114B | 1 | Kuroyuri
                        // ? 0x114B | 2 | Chizakura
                        // ? 0x114B | 3 | Eternal Sword
                        // ? 0x114B | 4 | Leather Armor
                        // ? 0x114B | 5 | Chain Mail
                        // ? 0x114B | 6 | Ring Mail
                        // ? 0x114B | 7 | Splint Mail
                        // ? 0x114C | 0 | Breastplate
                        // ? 0x114C | 1 | Plate Mail
                        // ? 0x114C | 2 | Mythril Plate
                        // ? 0x114C | 3 | Reflex
                        // ? 0x114C | 4 | Silver Plate
                        // ? 0x114C | 5 | Rare Plate
                        // ? 0x114C | 6 | Mumbane
                        // ? 0x114C | 7 | Gold Armor
                        // ? 0x114D | 0 | Cloak
                        // ? 0x114D | 1 | Amber Cloak
                        // ? 0x114D | 2 | Silver Cloak
                        // ? 0x114D | 3 | Holy Cloak
                        // ? 0x114D | 4 | Star Cloak
                        // ? 0x114D | 5 | Mythril Mesh
                        // ? 0x114D | 6 | Witch Dress
                        // ? 0x114D | 7 | Kisaragi
                        // ? 0x114E | 0 | Yayoi
                        // ? 0x114E | 1 | Nagatsuki
                        // ? 0x114E | 2 | Kannazuki
                        // ? 0x114E | 3 | Wooden Shield
                        // ? 0x114E | 4 | Round Shield
                        // ? 0x114E | 5 | Kite Shield
                        // ? 0x114E | 6 | Tower Shield
                        // ? 0x114E | 7 | Fine Shield
                        // ? 0x114F | 0 | Ankh Shield
                        // ? 0x114F | 1 | Rare Shield
                        // ? 0x114F | 2 | Red Shield
                        // ? 0x114F | 3 | Star Shield
                        // ? 0x114F | 4 | Blue Shield
                        // ? 0x114F | 5 | Shield Ring
                        // ? 0x114F | 6 | Leather Helm
                        // ? 0x114F | 7 | Iron Sallet
                        // ? 0x1150 | 0 | Armet
                        // ? 0x1150 | 1 | Close Helm
                        // ? 0x1150 | 2 | Duelist's Helm
                        // ? 0x1150 | 3 | Rare Helm
                        // ? 0x1150 | 4 | Golden Helm
                        // ? 0x1150 | 5 | Star Helm
                        // ? 0x1150 | 6 | Beret
                        // ? 0x1150 | 7 | Mitre
                        // ? 0x1151 | 0 | Straw Hat
                        // ? 0x1151 | 1 | Fine Hat
                        // ? 0x1151 | 2 | Star Cap
                        // ? 0x1151 | 3 | Ninja Hood
                        // ? 0x1151 | 4 | Ninja Mask
                        // ? 0x1151 | 5 | Blue Ribbon
                        // ? 0x1151 | 6 | Long Blue Ribbon
                        // ? 0x1151 | 7 | Striped Ribbon
                        // ? 0x1152 | 0 | Pretty Ribbon
                        // ? 0x1152 | 1 | Magical Ribbon
                        // ? 0x1152 | 2 | Leather Gloves
                        // ? 0x1152 | 3 | Iron Gloves
                        // ? 0x1152 | 4 | Gauntlets
                        // ? 0x1152 | 5 | Mythril Gloves
                        // ? 0x1152 | 6 | Rare Gauntlets
                        // ? 0x1152 | 7 | Star Gloves
                        // ? 0x1153 | 0 | Hyper Gauntlets
                        // ? 0x1153 | 1 | Claw Gauntlet
                        // ? 0x1153 | 2 | Oven Mitts
                        // ? 0x1153 | 3 | Pretty Mittens
                        // ? 0x1153 | 4 | Mother's Mittens
                        // ? 0x1153 | 5 | Bridal Gloves
                        // ? 0x1153 | 6 | Stone Charm
                        // ? 0x1153 | 7 | Talisman
                        // ? 0x1154 | 0 | Blue Talisman
                        // ? 0x1154 | 1 | Paralysis Charm
                        // ? 0x1154 | 2 | Stun Bracelet
                        // ? 0x1154 | 3 | Poison Charm
                        // ? 0x1154 | 4 | Rabbit's Foot
                        // ? 0x1154 | 5 | Flame Charm
                        // ? 0x1154 | 6 | Ice Charm
                        // ? 0x1154 | 7 | Manji Symbol
                        // ? 0x1155 | 0 | Silver Cape
                        // ? 0x1155 | 1 | Princess Cape
                        // ? 0x1155 | 2 | Heavy Boots
                        // ? 0x1155 | 3 | Elven Boots
                        // ? 0x1155 | 4 | Jet Boots
                        // ? 0x1155 | 5 | Persian Boots
                        // ? 0x1155 | 6 | Succubus Boots
                        // ? 0x1155 | 7 | Water Spiders
                        // ? 0x1156 | 0 | Cape
                        // ? 0x1156 | 1 | Leather Cape
                        // ? 0x1156 | 2 | Thief's Cape
                        // ? 0x1156 | 3 | Elven Cape
                        // ? 0x1156 | 4 | Flare Cape
                        // ? 0x1156 | 5 | Aqua Cape
                        // ? 0x1156 | 6 | Aquamarine
                        // ? 0x1156 | 7 | Amethyst
                        // ? 0x1157 | 0 | Emerald
                        // ? 0x1157 | 1 | Opal
                        // ? 0x1157 | 2 | Garnet
                        // ? 0x1157 | 3 | Sardonyx
                        // ? 0x1157 | 4 | Sapphire
                        // ? 0x1157 | 5 | Turquoise
                        // ? 0x1157 | 6 | Diamond
                        // ? 0x1157 | 7 | Topaz
                        // ? 0x1158 | 0 | Moonstone
                        // ? 0x1158 | 1 | Ruby
                        // ? 0x1158 | 2 | Sorcerer's Ring
                        // ? 0x1158 | 3 | Emerald Ring
                        // ? 0x1158 | 4 | Faerie Ring
                        // ? 0x1158 | 5 | Spirit Ring
                        // ? 0x1158 | 6 | Protect Ring
                        // ? 0x1158 | 7 | Force Ring
                        // ? 0x1159 | 0 | Resist Ring
                        // ? 0x1159 | 1 | Reflect Ring
                        // ? 0x1159 | 2 | Channeling Ring
                        // ? 0x1159 | 3 | Dash Ring
                        // ? 0x1159 | 4 | Technical Ring
                        // ? 0x1159 | 5 | Rebirth Doll
                        // ? 0x1159 | 6 | Sephira
                        // ? 0x1159 | 7 | Blue Sephira
                        // ? 0x115A | 0 | Gravity Stone
                        // ? 0x115A | 1 | Black Onyx
                        // ? 0x115A | 2 | Orb of White Mist
                        // ? 0x115A | 3 | Orb of Magical Mist
                        // ? 0x115A | 4 | Moon Crystal
                        // ? 0x115A | 5 | Derris Emblem
                        // ? 0x115A | 6 | Warrior Symbol
                        // ? 0x115A | 7 | Attack Symbol
                        // ? 0x115B | 0 | Holy Symbol
                        // ? 0x115B | 1 | Mystic Symbol
                        // ? 0x115B | 2 | Dark Seal
                        // ? 0x115B | 3 | Demon's Seal
                        // ? 0x115B | 4 | Unicorn Earring
                        // ? 0x115B | 5 | Combo Command
                        // ? 0x115B | 6 | Rock Breaker
                        // ? 0x115B | 7 | Magical Pouch
                        // ? 0x115C | 0 | Mystic Pouch
                        // ? 0x115C | 1 | Mirror Image Patch
                        // ? 0x115C | 2 | Curio's Mirror
                        // ? 0x115C | 3 | Red Card
                        // ? 0x115C | 4 | Green Card
                        // ? 0x115C | 5 | Blue Card
                        // ? 0x115C | 6 | Yellow Card
                        // ? 0x115C | 7 | White Card
                        // ? 0x115D | 0 | Brown Card
                        // ? 0x115D | 1 | Black Card
                        // ? 0x115D | 2 | Statue of Bravery
                        // ? 0x115D | 3 | Statue of Justice
                        // ? 0x115D | 4 | Statue of Friendship
                        // ? 0x115D | 5 | Statue of Love
                        // ? 0x115D | 6 | Statue of Dreams
                        // ? 0x115D | 7 | Special Flag
                      ],
                    },
                    {
                      name: "Monster Book",
                      items: [
                        // enemyList
                        // ? 0x1208 | 0 | Entry
                        // ? 0x1208 | 1 | Status
                        // ? 0x1208 | 2 | Drop Item 1
                        // ? 0x1208 | 3 | Drop Item 2
                        // ? 0x1208 | 4 | Stolen Item
                        // ! 0x1208 | 5 | ???
                        // ! 0x1208 | 6 | ???
                        // ! 0x1208 | 7 | ???
                      ],
                    },
                    {
                      name: "Miscellaneous",
                      items: [
                        {
                          type: "section",
                          flex: true,
                          items: [
                            {
                              name: "Distance Traveled",
                              offset: 0x175c,
                              type: "variable",
                              dataType: "uint32",
                              // max:
                            },
                            {
                              name: "GROOVY Arche High Score",
                              offset: 0x1308,
                              type: "variable",
                              dataType: "uint32",
                              // max:
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
              name: "Customize",
              items: [
                // ? 0x1600 | uint8 | Controller Vibration
                // ? 0x1601 | uint8 | Message Speed
                // ? 0x1602 | uint8 | Battle Rank
                // ? 0x1603 | 0 | World Map 3D Overlay
                // ? 0x1603 | 1 | Display World Map
                // ! 0x1603 | 2 | ???
                // ! 0x1603 | 3 | ???
                // ! 0x1603 | 4 | ???
                // ! 0x1603 | 5 | ???
                // ! 0x1603 | 6 | ???
                // ! 0x1603 | 7 | ???
                // ? 0x1604 | 0 | Enemy Check
                // ? 0x1604 | 1 | Target Check
                // ? 0x1604 | 2 | Combo Counter
                // ? 0x528 | 2 | Combo Counter (Save Preview)
                // ! 0x1604 | 3 | ???
                // ! 0x1604 | 4 | ???
                // ! 0x1604 | 5 | ???
                // ! 0x1604 | 6 | ???
                // ! 0x1604 | 7 | ???
                // ! 0x1605 | uint8 | ???
                // ! 0x1606 | uint8 | ???
                // ! 0x1607 | uint8 | ???
                // # Battle Controls
                // ! 0x1608 | uint16 | ???
                // ! 0x160A | uint16 | ???
                // ! 0x160C | uint16 | ???
                // ! 0x160E | uint16 | ???
                // ! 0x1610 | uint16 | ???
                // ! 0x1612 | uint16 | ???
                // ! 0x1614 | uint16 | ???
                // ! 0x1616 | uint16 | ???
                // ! 0x1617 | uint8 | ???
                // ? 0x1618 | 0 | Sound Output
                // ? 0x1618 | 1 | Battle Voiceovers
                // ? 0x1618 | 2 | Event Voiceovers
                // ! 0x1618 | 3 | ???
                // ! 0x1618 | 4 | ???
                // ! 0x1618 | 5 | ???
                // ! 0x1618 | 6 | ???
                // ! 0x1618 | 7 | ???
                // ! 0x1619 | uint8 | ???
                // ? 0x161A | uint16 | Music Volume
                // ? 0x161C | uint16 | Sound Effect Volume
                // ! 0x161E | uint8 | ???
                // ! 0x161F | uint8 | ???
                // ! 0x1620 | uint8 | ???
                // ! 0x1621 | uint8 | ???
                // ! 0x1622 | uint8 | ???
                // ! 0x1623 | uint8 | ???
                // ! 0x1624 | uint8 | ???
                // ! 0x1625 | uint8 | ???
                // # Window Color
                // # Main Window Color
                // ? 0x1626 | uint8 | Red
                // ? 0x1627 | uint8 | Green
                // ? 0x1628 | uint8 | Blue
                // # Main Window Color (Save Preview)
                // ? 0x524 | uint8 | Red
                // ? 0x525 | uint8 | Green
                // ? 0x526 | uint8 | Blue
                // # Enemy Window Color
                // ? 0x1629 | uint8 | Red
                // ? 0x162A | uint8 | Green
                // ? 0x162B | uint8 | Blue
                // # Information Window Color
                // ? 0x162C | uint8 | Red
                // ? 0x162D | uint8 | Green
                // ? 0x162E | uint8 | Blue
                // ? 0x162F | uint8 | Menu Character Display
                // todo 0x1630 | 0 | Arte Names
                // ! 0x1630 | 1 | ???
                // ! 0x1630 | 2 | ???
                // ! 0x1630 | 3 | ???
                // ! 0x1630 | 4 | ???
                // ! 0x1630 | 5 | ???
                // ! 0x1630 | 6 | ???
                // ! 0x1630 | 7 | ???
                // ! 0x1631 | 0 | ???
                // todo 0x1631 | 1 | Battle Subtitles
                // ! 0x1631 | 2 | ???
                // ! 0x1631 | 3 | ???
                // ! 0x1631 | 4 | ???
                // ! 0x1631 | 5 | ???
                // ! 0x1631 | 6 | ???
                // ! 0x1631 | 7 | ???
                // ! 0x1632 | uint8 | ???
                // ! 0x1633 | uint8 | ???
                // ? 0x1634 | uint16 | Voiceover Volume
                // ! 0x1636 | uint8 | ???
                // ! 0x1637 | uint8 | ???
                // ! 0x1638 | uint8 | ???
                // ! 0x1639 | uint8 | ???
              ],
            },
          ],
        },
      ],
    },
  ],
  resources: {
    characterEnum,
    characters: {
      0x0: "-",
      ...characters,
    },
    letters: {
      0x10: " ",
      0x13: "!",
      0x18: "&",
      0x1d: "+",
      0x1e: ",",
      0x20: ".",
      0x21: "/",
      0x22: "0",
      0x23: "1",
      0x24: "2",
      0x25: "3",
      0x26: "4",
      0x27: "5",
      0x28: "6",
      0x29: "7",
      0x2a: "8",
      0x2b: "9",
      0x2d: ":",
      0x2f: "=",
      0x31: "?",
      0x32: "A",
      0x33: "B",
      0x34: "C",
      0x35: "D",
      0x36: "E",
      0x37: "F",
      0x38: "G",
      0x39: "H",
      0x3a: "I",
      0x3b: "J",
      0x3c: "K",
      0x3d: "L",
      0x3e: "M",
      0x3f: "N",
      0x40: "O",
      0x41: "P",
      0x42: "Q",
      0x43: "R",
      0x44: "S",
      0x45: "T",
      0x46: "U",
      0x47: "V",
      0x48: "W",
      0x49: "X",
      0x4a: "Y",
      0x4b: "Z",
      0x50: "・",
      0x51: "ー",
      0x52: "ヲ",
      0x53: "ァ",
      0x54: "ィ",
      0x55: "ゥ",
      0x56: "ェ",
      0x57: "ォ",
      0x58: "ャ",
      0x59: "ュ",
      0x5a: "ョ",
      0x5b: "ッ",
      0x5c: "ア",
      0x5d: "イ",
      0x5e: "ウ",
      0x5f: "エ",
      0x60: "オ",
      0x61: "カ",
      0x62: "キ",
      0x63: "ク",
      0x64: "ケ",
      0x65: "コ",
      0x66: "サ",
      0x67: "シ",
      0x68: "ス",
      0x69: "セ",
      0x6a: "ソ",
      0x6b: "タ",
      0x6c: "チ",
      0x6d: "ツ",
      0x6e: "テ",
      0x6f: "ト",
      0x70: "ナ",
      0x71: "ニ",
      0x72: "ヌ",
      0x73: "ネ",
      0x74: "ノ",
      0x75: "ハ",
      0x76: "ヒ",
      0x77: "フ",
      0x78: "ヘ",
      0x79: "ホ",
      0x7a: "マ",
      0x7b: "ミ",
      0x7c: "ム",
      0x7d: "メ",
      0x7e: "モ",
      0x7f: "ヤ",
      0x80: "ユ",
      0x81: "ヨ",
      0x82: "ラ",
      0x83: "リ",
      0x84: "ル",
      0x85: "レ",
      0x86: "ロ",
      0x87: "ワ",
      0x88: "ン",
      0x89: "を",
      0x8a: "ぁ",
      0x8b: "ぃ",
      0x8c: "ぅ",
      0x8d: "ぇ",
      0x8e: "ぉ",
      0x8f: "ゃ",
      0x90: "ゅ",
      0x91: "ょ",
      0x92: "っ",
      0x93: "あ",
      0x94: "い",
      0x95: "う",
      0x96: "え",
      0x97: "お",
      0x98: "か",
      0x99: "き",
      0x9a: "く",
      0x9b: "け",
      0x9c: "こ",
      0x9d: "さ",
      0x9e: "し",
      0x9f: "す",
      0xa0: "せ",
      0xa1: "そ",
      0xa2: "た",
      0xa3: "ち",
      0xa4: "つ",
      0xa5: "て",
      0xa6: "と",
      0xa7: "な",
      0xa8: "に",
      0xa9: "ぬ",
      0xaa: "ね",
      0xab: "の",
      0xac: "は",
      0xad: "ひ",
      0xae: "ふ",
      0xaf: "へ",
      0xb0: "ほ",
      0xb1: "ま",
      0xb2: "み",
      0xb3: "む",
      0xb4: "め",
      0xb5: "も",
      0xb6: "や",
      0xb7: "ゆ",
      0xb8: "よ",
      0xb9: "ら",
      0xba: "り",
      0xbb: "る",
      0xbc: "れ",
      0xbd: "ろ",
      0xbe: "わ",
      0xbf: "ん",
      0xcd: "ガ",
      0xce: "ギ",
      0xcf: "グ",
      0xd0: "ゲ",
      0xd1: "ゴ",
      0xd2: "ザ",
      0xd3: "ジ",
      0xd4: "ズ",
      0xd5: "ゼ",
      0xd6: "ゾ",
      0xd7: "ダ",
      0xd8: "ヂ",
      0xd9: "ヅ",
      0xda: "デ",
      0xdb: "ド",
      0xdc: "バ",
      0xdd: "ビ",
      0xde: "ブ",
      0xdf: "ベ",
      0xe0: "ボ",
      0xe1: "パ",
      0xe2: "ピ",
      0xe3: "プ",
      0xe4: "ペ",
      0xe5: "ポ",
      0xe6: "が",
      0xe7: "ぎ",
      0xe8: "ぐ",
      0xe9: "げ",
      0xea: "ご",
      0xeb: "ざ",
      0xec: "じ",
      0xed: "ず",
      0xee: "ぜ",
      0xef: "ぞ",
      0xf0: "だ",
      0xf1: "ぢ",
      0xf2: "づ",
      0xf3: "で",
      0xf4: "ど",
      0xf5: "ば",
      0xf6: "び",
      0xf7: "ぶ",
      0xf8: "べ",
      0xf9: "ぼ",
      0xfa: "ぱ",
      0xfb: "ぴ",
      0xfc: "ぷ",
      0xfd: "ぺ",
      0xfe: "ぽ",
      0xff: "ヴ",
    },
    modes: {
      0x0: "-",
      0x1: "New Game +",
    },
    titles,
  },
  resourcesGroups: {
    titles: titlesGroups,
  },
};

export default template;
