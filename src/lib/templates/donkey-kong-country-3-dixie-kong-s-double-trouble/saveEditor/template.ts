import type { GameJson } from "$lib/types";

import { levelFragment } from "./utils/fragment";
import {
  levels,
  locations,
  locationsGroups,
  locationsOrder,
  worlds,
} from "./utils/resource";

const template: GameJson = {
  validator: {
    platforms: {
      supernintendo: {
        europe_usa: { 0xa: [0x69, 0x52, 0x41, 0x52] }, // "iRAR"
        japan: { 0xa: [0x69, 0x52, 0x41, 0x52] }, // "iRAR"
      },
    },
    text: "Drag 'n' drop here or click to add a save file.",
    error: "Not a valid save file.",
  },
  items: [
    {
      id: "slots",
      length: 0x28a,
      type: "container",
      instanceType: "tabs",
      instances: 3,
      enumeration: "Slot %d",
      items: [
        {
          name: "Checksum",
          offset: 0x62,
          type: "checksum",
          dataType: "uint32",
          control: {
            offsetStart: 0x68,
            offsetEnd: 0x2eb,
          },
        },
        {
          id: "players",
          length: 0x142,
          type: "container",
          instanceType: "tabs",
          instances: 2,
          enumeration: "Player %d",
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
                          offset: 0x67,
                          type: "variable",
                          dataType: "uint8",
                          resource: "modes",
                          disabled: true,
                          overrideShift: {
                            parent: 1,
                            shift: 0x0,
                          },
                        },
                        {
                          id: "difficulty-%parent%-%index%",
                          name: "Difficulty",
                          offset: 0x144,
                          type: "variable",
                          dataType: "uint8",
                          binary: { bitStart: 6, bitLength: 2 },
                          resource: "difficulties",
                        },
                        {
                          id: "progression-game-%parent%-%index%",
                          name: "Progression",
                          offset: 0x79,
                          type: "variable",
                          dataType: "bit",
                          bit: 6,
                          resource: "progressions",
                        },
                        {
                          id: "completionRate-%parent%-%index%",
                          name: "Completion Rate",
                          offset: 0x76,
                          type: "variable",
                          dataType: "uint8",
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
                          id: "name-player-1",
                          name: "Name",
                          offset: 0x68,
                          length: 0x5,
                          type: "variable",
                          dataType: "string",
                          letterDataType: "uint8",
                          regex: "[ 0-9A-Z]",
                          fallback: 0x20,
                          test: true,
                        },
                        {
                          id: "name-player-2",
                          name: "Player 2 Name",
                          offset: 0x6d,
                          length: 0x5,
                          type: "variable",
                          dataType: "string",
                          letterDataType: "uint8",
                          regex: "[ 0-9A-Z]",
                          fallback: 0x20,
                          hidden: true,
                        },
                        {
                          name: "Playtime",
                          type: "group",
                          mode: "time",
                          items: [
                            {
                              offset: 0x72,
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
                              offset: 0x72,
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
                              offset: 0x72,
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
                          name: "Location",
                          offset: 0x87,
                          type: "variable",
                          dataType: "uint32",
                          resource: "locations",
                          autocomplete: true,
                        },
                      ],
                    },
                    {
                      type: "section",
                      flex: true,
                      items: [
                        {
                          name: "DK Coins",
                          offset: 0x81,
                          type: "variable",
                          dataType: "uint16",
                          max: 41,
                        },
                        {
                          name: "Bear Coins",
                          offset: 0x7b,
                          type: "variable",
                          dataType: "uint16",
                          max: 99,
                        },
                        {
                          name: "Bonus Coins",
                          offset: 0x7d,
                          type: "variable",
                          dataType: "uint16",
                          max: 85,
                        },
                        {
                          name: "Banana Birds",
                          offset: 0x7f,
                          type: "variable",
                          dataType: "uint16",
                          disabled: true,
                        },
                        {
                          id: "cogs",
                          name: "Cogs",
                          offset: 0x83,
                          type: "variable",
                          dataType: "uint16",
                          max: 5,
                        },
                        {
                          name: "Cogs (Duplicate)",
                          offset: 0xa5,
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
                          id: "item-0",
                          name: "Item 1",
                          offset: 0xab,
                          type: "variable",
                          dataType: "uint16",
                          resource: "items",
                        },
                        {
                          id: "item-2",
                          name: "Item 2",
                          offset: 0xad,
                          type: "variable",
                          dataType: "uint16",
                          resource: "items",
                        },
                        {
                          id: "item-4",
                          name: "Item 3",
                          offset: 0xaf,
                          type: "variable",
                          dataType: "uint16",
                          resource: "items",
                        },
                        {
                          id: "item-6",
                          name: "Item 4",
                          offset: 0xb1,
                          type: "variable",
                          dataType: "uint16",
                          resource: "items",
                        },
                        {
                          type: "section",
                          flex: true,
                          hidden: true,
                          items: [
                            {
                              name: "Items in Inventory",
                              type: "bitflags",
                              hidden: true,
                              flags: [
                                { offset: 0xa7, bit: 0, label: "Patch" },
                                { offset: 0xa7, bit: 1, label: "Ski x1" },
                                { offset: 0xa8, bit: 5, label: "Ski x2" },
                                { offset: 0xa7, bit: 2, label: "Shell" },
                                { offset: 0xa7, bit: 3, label: "Mirror" },
                                { offset: 0xa7, bit: 4, label: "Present" },
                                { offset: 0xa7, bit: 5, label: "Bowling Ball" },
                                { offset: 0xa7, bit: 6, label: "Flower" },
                                { offset: 0xa7, bit: 7, label: "No.6 Wrench" },
                              ],
                            },
                          ],
                        },
                      ],
                    },
                    {
                      name: "Vehicle",
                      type: "section",
                      flex: true,
                      hidden: true,
                      items: [
                        {
                          name: "Type",
                          offset: 0x8d,
                          type: "variable",
                          dataType: "uint16",
                          hidden: true,
                        },
                        {
                          name: "Position X",
                          offset: 0x8f,
                          type: "variable",
                          dataType: "uint16",
                          hidden: true,
                        },
                        {
                          name: "Position Y",
                          offset: 0x91,
                          type: "variable",
                          dataType: "uint16",
                          hidden: true,
                        },
                      ],
                    },
                  ],
                },
                ...worlds.map((world) => ({
                  name: world.name,
                  flex: true,
                  hidden: world.index === 0x0,
                  items: [
                    ...levels
                      .filter((level) => level.world === world.index)
                      .map((level) => levelFragment(level)),
                  ],
                })),
                {
                  name: "Events",
                  items: [
                    {
                      type: "section",
                      flex: true,
                      items: [
                        {
                          type: "section",
                          items: [
                            {
                              id: "vehicles",
                              name: "Funky's Rentals",
                              type: "bitflags",
                              flags: [
                                { offset: 0xb4, bit: 2, label: "Motor Boat unlocked" },
                                { offset: 0xb4, bit: 3, label: "Hover Craft unlocked" },
                                { offset: 0xb4, bit: 4, label: "Turbo Ski unlocked" },
                                { offset: 0xb4, bit: 5, label: "Gyrocopter unlocked" },
                                { offset: 0xb4, bit: 7, label: "Funky Kong met", hidden: true },
                              ],
                            },
                            {
                              name: "Miscellaneous",
                              type: "bitflags",
                              flags: [
                                { offset: 0xa0, bit: 7, label: "Wrinkly Kong met", hidden: true },
                                { offset: 0xb6, bit: 7, label: "Swanky Kong met", hidden: true },
                                { offset: 0x9e, bit: 2, label: "Arich's Hoard wood", hidden: true },
                                { offset: 0xd4, bit: 1, label: "Waterfall cheat used" },
                                { offset: 0xa0, bit: 3, label: "Kaos Kore accessible" },
                                { offset: 0xf0, bit: 0, label: "Sewer Stockpile open" },
                                { offset: 0x138, bit: 0, label: "Krematoa emerged" },
                              ],
                            },
                            {
                              name: "Enabled Cheats",
                              type: "bitflags",
                              flags: [
                                { offset: 0x143, bit: 1, label: "ASAVE" },
                                { offset: 0x143, bit: 6, label: "COLOR" },
                                { offset: 0x143, bit: 4, label: "LIVES" },
                                { offset: 0x143, bit: 0, label: "MERRY" },
                                { offset: 0x143, bit: 7, label: "TUFST", hidden: true },
                                { offset: 0x143, bit: 2, label: "WATER" },
                                { offset: 0x143, bit: 3, label: "???", hidden: true },
                                { offset: 0x143, bit: 5, label: "???", hidden: true },
                                { offset: 0x144, bit: 0, label: "???", hidden: true },
                                { offset: 0x144, bit: 1, label: "???", hidden: true },
                                { offset: 0x144, bit: 2, label: "???", hidden: true },
                                { offset: 0x144, bit: 3, label: "???", hidden: true },
                                { offset: 0x144, bit: 4, label: "???", hidden: true },
                                { offset: 0x144, bit: 5, label: "???", hidden: true },
                              ],
                            },
                          ],
                        },
                        {
                          id: "bananaBirds",
                          name: "Banana Birds",
                          type: "bitflags",
                          flags: [
                            ...levels
                              .filter(
                                (level) => level.type === "bananaBirdCave",
                              )
                              .map((level) => ({ offset: 0xd4 + level.index, bit: 1, label: level.name,
                              })),
                            { offset: 0xbb, bit: 6, label: "Obtained from Bramble" },
                            { offset: 0xbf, bit: 2, label: "Obtained from Barnacle" },
                          ],
                        },
                        {
                          type: "section",
                          items: [
                            {
                              id: "brothersBear",
                              name: "Brothers Bear",
                              type: "bitflags",
                              flags: [
                                { offset: 0xb8, bit: 7, label: "Bazaar met", hidden: true },
                                { offset: 0xb7, bit: 2, label: "<b>Bazaar:</b> Shell bought", reversed: true },
                                { offset: 0xb7, bit: 3, label: "<b>Bazaar:</b> Mirror bought", reversed: true },
                                { offset: 0xba, bit: 7, label: "Blunder met", hidden: true },
                                { offset: 0xbc, bit: 7, label: "Bramble met", hidden: true },
                                { offset: 0xbb, bit: 6, label: "<b>Bramble:</b> Flower > Banana Bird" },
                                { offset: 0xbe, bit: 7, label: "Barter met", hidden: true },
                                { offset: 0xbd, bit: 3, label: "<b>Barter:</b> Mirror > No.6 Wrench" },
                                { offset: 0xbd, bit: 7, label: "<b>Barter:</b> No.6 Wrench obtained", reversed: true, hidden: true },
                                { offset: 0xc0, bit: 7, label: "Barnacle met", hidden: true },
                                { offset: 0xbf, bit: 2, label: "<b>Barnacle:</b> Shell > Banana Bird" },
                                { offset: 0xc2, bit: 7, label: "Brash met", hidden: true },
                                { offset: 0xc2, bit: 4, label: "<b>Brash:</b> Record beaten" },
                                { offset: 0xc4, bit: 7, label: "Blue met", hidden: true },
                                { offset: 0xc3, bit: 4, label: "<b>Blue:</b> Present > Bowling Ball" },
                                { offset: 0xc3, bit: 5, label: "<b>Blue:</b> Bowling Ball obtained", reversed: true, hidden: true },
                                { offset: 0xc6, bit: 7, label: "Bazooka met", hidden: true },
                                { offset: 0xc5, bit: 5, label: "<b>Bazooka:</b> Bowling Ball given" },
                                { offset: 0xc8, bit: 7, label: "Blizzard met", hidden: true },
                                { offset: 0xc7, bit: 4, label: "<b>Blizzard:</b> Present obtained", reversed: true },
                                { offset: 0xca, bit: 7, label: "Benny met", hidden: true },
                                { offset: 0xcc, bit: 7, label: "Björn met", hidden: true },
                                { offset: 0xcb, bit: 7, label: "<b>Björn:</b> No.6 Wrench given" },
                                { offset: 0xce, bit: 7, label: "Baffle met", hidden: true },
                                { offset: 0xcd, bit: 3, label: "<b>Baffle:</b> Mirror given" },
                                { offset: 0xd0, bit: 7, label: "Boomer met", hidden: true },
                              ],
                            },
                            {
                              name: "Used Items",
                              type: "bitflags",
                              hidden: true,
                              flags: [
                                { offset: 0xa9, bit: 0, label: "Patch" },
                                { offset: 0xa9, bit: 1, label: "Ski" },
                                { offset: 0xa9, bit: 2, label: "Shell" },
                                { offset: 0xa9, bit: 3, label: "Mirror" },
                                { offset: 0xa9, bit: 4, label: "Present" },
                                { offset: 0xa9, bit: 5, label: "Bowling Ball" },
                                { offset: 0xa9, bit: 6, label: "Flower" },
                                { offset: 0xa9, bit: 7, label: "No.6 Wrench" },
                              ],
                            },
                            {
                              name: "Riverside Race Time",
                              type: "group",
                              mode: "chrono",
                              items: [
                                {
                                  offset: 0xd3,
                                  type: "variable",
                                  dataType: "uint8",
                                  binaryCodedDecimal: true,
                                  max: 59,
                                },
                                {
                                  offset: 0xd2,
                                  type: "variable",
                                  dataType: "uint8",
                                  binaryCodedDecimal: true,
                                  leadingZeros: 1,
                                  max: 59,
                                },
                                {
                                  offset: 0xd1,
                                  type: "variable",
                                  dataType: "uint8",
                                  binaryCodedDecimal: true,
                                  operations: [{ "*": 10 }],
                                  leadingZeros: 1,
                                  max: 90,
                                },
                              ],
                            },
                          ],
                        },
                        {
                          type: "section",
                          items: [
                            {
                              id: "krematoaBoulders",
                              name: "Krematoa Boulders Access",
                              offset: 0xa1,
                              type: "variable",
                              dataType: "uint8",
                              resource: "krematoaBoulders",
                            },
                            {
                              id: "placedCogs",
                              name: "Placed Cogs",
                              offset: 0xa6,
                              type: "variable",
                              dataType: "uint8",
                              max: 5,
                            },
                            {
                              name: "Krematoa",
                              type: "bitflags",
                              hidden: true,
                              flags: [
                                { offset: 0xa4, bit: 0, label: "Boulder 1 destroyed" },
                                { offset: 0xa4, bit: 1, label: "Boulder 2 destroyed" },
                                { offset: 0xa4, bit: 2, label: "Boulder 3 destroyed" },
                                { offset: 0xa4, bit: 3, label: "Boulder 4 destroyed" },
                                { offset: 0xa4, bit: 4, label: "Boulder 5 destroyed" },
                                { offset: 0xa4, bit: 5, label: "Boulder 6 destroyed" },
                                { offset: 0xa4, bit: 6, label: "???" },
                                { offset: 0xa4, bit: 7, label: "???", separator: true },
                                { offset: 0xa0, bit: 0, label: "Knautilus appeared" },
                              ],
                            },
                            {
                              name: "Boulder Destroy Triggers",
                              type: "bitflags",
                              hidden: true,
                              flags: [
                                { offset: 0xa3, bit: 0, label: "Boulder 1" },
                                { offset: 0xa3, bit: 1, label: "Boulder 2" },
                                { offset: 0xa3, bit: 2, label: "Boulder 3" },
                                { offset: 0xa3, bit: 3, label: "Boulder 4" },
                                { offset: 0xa3, bit: 4, label: "Boulder 5" },
                                { offset: 0xa3, bit: 5, label: "Boulder 6" },
                                { offset: 0xa3, bit: 6, label: "???", hidden: true },
                                { offset: 0xa3, bit: 7, label: "???", hidden: true },
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
      appendSubinstance: [
        {
          name: "All Time Greats",
          items: [
            {
              name: "Checksum",
              offset: 0xe,
              type: "checksum",
              dataType: "uint32",
              control: {
                offsetStart: 0x12,
                offsetEnd: 0x62,
              },
            },
            {
              length: 0x10,
              type: "container",
              instanceType: "section",
              instances: 5,
              enumeration: "%o Place",
              flex: true,
              items: [
                {
                  id: "name",
                  name: "Name",
                  offset: 0x13,
                  length: 0xa,
                  type: "variable",
                  dataType: "string",
                  letterDataType: "uint8",
                  regex: "[ 0-9A-Z]",
                  fallback: 0x20,
                },
                {
                  name: "Playtime",
                  type: "group",
                  mode: "time",
                  items: [
                    {
                      offset: 0x1d,
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
                      offset: 0x1d,
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
                      offset: 0x1d,
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
                  name: "Completion Rate",
                  offset: 0x21,
                  type: "variable",
                  dataType: "uint8",
                  suffix: "%",
                },
              ],
            },
          ],
        },
        {
          name: "Options",
          flex: true,
          items: [
            {
              name: "Sound Mode",
              offset: 0x9,
              type: "variable",
              dataType: "uint8",
              resource: "soundModes",
            },
            {
              id: "language",
              name: "Language",
              offset: 0x8,
              type: "variable",
              dataType: "uint8",
              resource: "languages",
            },
          ],
        },
      ],
    },
  ],
  resources: {
    difficulties: {
      0x0: "HARDR",
      0x1: "-",
      0x2: "TUFST",
    },
    items: {
      0x0: "-",
      0x1: "Patch",
      0x2: "Ski x1",
      0x4: "Shell",
      0x8: "Mirror",
      0x10: "Present",
      0x20: "Bowling Ball",
      0x40: "Flower",
      0x80: "No.6 Wrench",
      0x2002: "Ski x2",
    },
    krematoaBoulders: {
      0x0: "-",
      0x1: "Stampede Sprint",
      0x2: "Criss Kross Cliffs",
      0x3: "Tyrant Twin Tussle",
      0x4: "Swoopy Salvo",
      0x5: "Rocket Rush",
      0x6: "Knautilus",
    },
    levelProgressions: {
      0x0: "-",
      0x1: "Accessible",
      0x3: "Dixie Kong",
      0x43: "Kiddy Kong",
    },
    locations: {
      0x0: "-",
      ...locations,
    },
    modes: {
      0x0: "One player",
      0x1: "Two player team",
      0x2: "Two player contest",
    },
    progressions: {
      0x0: "-",
      0x1: "Game Cleared",
    },
    soundModes: {
      0x0: "Stereo",
      0x1: "Mono",
    },
    languages: {
      0x0: "English",
      0x1: "French",
      0x2: "German",
    },
  },
  resourcesGroups: {
    locations: locationsGroups,
  },
  resourcesOrder: {
    difficulties: [0x1, 0x0, 0x2],
    items: [0x0, 0x1, 0x2, 0x2002, 0x4, 0x8, 0x10, 0x20, 0x40, 0x80],
    locations: locationsOrder,
  },
};

export default template;
