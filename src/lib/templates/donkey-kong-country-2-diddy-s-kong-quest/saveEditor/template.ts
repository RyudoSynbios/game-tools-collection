import type { GameJson, ItemSection } from "$lib/types";

import { levels, worlds } from "./utils/resource";

const template: GameJson = {
  validator: {
    regions: {
      europe_germany: {},
      usa_japan: {},
    },
    text: "Drag 'n' drop here or click to add a save file.",
    error: "Not a valid save file.",
  },
  items: [
    {
      id: "slots",
      length: 0x2a8,
      type: "container",
      instanceType: "tabs",
      instances: 3,
      enumeration: "Slot %d",
      items: [
        {
          name: "Checksum",
          offset: 0x8,
          type: "checksum",
          dataType: "uint32",
          control: {
            offsetStart: 0xe,
            offsetEnd: 0x2b0,
          },
        },
        {
          id: "players",
          length: 0x14e,
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
                      name: "Mode",
                      offset: 0xd,
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
                      type: "section",
                      flex: true,
                      items: [
                        {
                          name: "Progression",
                          offset: 0xeb,
                          type: "variable",
                          dataType: "bit",
                          bit: 6,
                          resource: "progressions",
                          disabled: true,
                        },
                        {
                          id: "completionRate-%parent%-%index%",
                          name: "Completion Rate",
                          offset: 0x12,
                          type: "variable",
                          dataType: "uint8",
                          suffix: "%",
                          disabled: true,
                        },
                        {
                          name: "Current World",
                          offset: 0xbb,
                          type: "variable",
                          dataType: "uint8",
                          hidden: true,
                        },
                        {
                          name: "Related to Current World",
                          offset: 0xbf,
                          type: "variable",
                          dataType: "uint8",
                          hidden: true,
                        },
                        {
                          name: "Playtime",
                          type: "group",
                          mode: "time",
                          items: [
                            {
                              id: "time",
                              offset: 0xe,
                              type: "variable",
                              dataType: "uint32",
                              operations: [
                                { "/": 50 },
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
                              id: "time",
                              offset: 0xe,
                              type: "variable",
                              dataType: "uint32",
                              operations: [
                                { "/": 50 },
                                {
                                  convert: {
                                    from: "seconds",
                                    to: "minutes",
                                  },
                                },
                              ],
                              leadingZeros: 1,
                              max: 59,
                              test: true,
                            },
                            {
                              id: "time",
                              offset: 0xe,
                              type: "variable",
                              dataType: "uint32",
                              operations: [
                                { "/": 50 },
                                {
                                  convert: {
                                    from: "seconds",
                                    to: "seconds",
                                  },
                                },
                              ],
                              leadingZeros: 1,
                              max: 59,
                              test: true,
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
                          name: "Hero's Coins",
                          offset: 0x14,
                          type: "variable",
                          dataType: "uint8",
                          disabled: true,
                        },
                        {
                          name: "Kremkoins",
                          offset: 0x13,
                          type: "variable",
                          dataType: "uint8",
                          max: 75,
                        },
                        {
                          id: "currentLevel",
                          name: "Current Level",
                          offset: 0xbd,
                          type: "variable",
                          dataType: "uint8",
                          resource: "levels",
                        },
                      ],
                    },
                  ],
                },
                ...worlds.map(
                  (world) =>
                    ({
                      name: world.name,
                      flex: true,
                      items: [
                        ...levels
                          .filter((level) => level.world === world.index)
                          .map((level) => ({
                            type: "section",
                            items: [
                              {
                                id: `progression-cleared-%parent%-%index%-${level.index}`,
                                name: level.name,
                                offset: 0x1b + Math.floor(level.index / 0x4),
                                type: "variable",
                                dataType: "uint8",
                                binary: {
                                  bitStart: (level.index * 2) % 8,
                                  bitLength: 2,
                                },
                                resource: "levelProgressions",
                                hidden: level.clearedFlag === undefined,
                              },
                              {
                                offset: 0x1b + Math.floor(level.index / 0x4),
                                type: "variable",
                                dataType: "uint8",
                                binary: {
                                  bitStart: (level.index * 2) % 8,
                                  bitLength: 2,
                                },
                                hidden: true,
                              },
                              {
                                id: `progression-flags-%parent%-%index%-${level.index}`,
                                type: "bitflags",
                                hidden:
                                  level.clearedFlag === undefined ||
                                  level.kremkoin !== undefined,
                                flags: [
                                  { offset: 0x3b, bit: 0, label: "Path 1", hidden: true },
                                  { offset: 0x3b, bit: 0, label: "Path 2", hidden: true },
                                  { offset: 0x3b, bit: 0, label: "Path 3", hidden: true },
                                  { offset: 0x3b, bit: 0, label: "Path 4", hidden: true },
                                  { offset: 0x3b, bit: 0, label: "Path 5", hidden: true },
                                  { offset: 0x5b, bit: 0, label: "Boss Kremkoin", hidden: true },
                                  { offset: 0x5b, bit: 0, label: "Bonus Room 1", hidden: true },
                                  { offset: 0x5b, bit: 0, label: "Bonus Room 2", hidden: true },
                                  { offset: 0x5b, bit: 0, label: "Bonus Room 3", hidden: true },
                                  { offset: 0x7b, bit: 0, label: "Hero's Coin", hidden: true },
                                  { offset: 0x9b, bit: 0, label: "Cleared", hidden: true },
                                ],
                              },
                            ],
                          })),
                        {
                          type: "section",
                          hidden: true,
                          items: [
                            {
                              name: world.name,
                              offset: 0x1b + Math.floor(world.index / 0x4),
                              type: "variable",
                              dataType: "uint8",
                              binary: {
                                bitStart: (world.index * 2) % 8,
                                bitLength: 2,
                              },
                              hidden: true,
                            },
                          ],
                        },
                      ],
                    }) as ItemSection,
                ),
                {
                  name: "Events",
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
                              id: "visitedLocations-%parent%-%index%",
                              name: "Visited Locations",
                              type: "bitflags",
                              flags: [
                                { offset: 0xeb, bit: 0, label: "Monkey Museum" },
                                { offset: 0xeb, bit: 1, label: "Funky Flights II" },
                                { offset: 0xeb, bit: 2, label: "Swanky's Bonus Bonanza" },
                                { offset: 0xeb, bit: 3, label: "Kong Kollege" },
                                { offset: 0xeb, bit: 4, label: "Klubba's Kiosk" },
                                { offset: 0xeb, bit: 5, label: "Monkey Museum (Lost World)" },
                              ],
                            },
                            {
                              name: "Miscellaneous",
                              type: "bitflags",
                              flags: [
                                { offset: 0xec, bit: 1, label: "Stronghold Showdown: Cutscene seen" },
                                { offset: 0xec, bit: 3, label: "Krokodile Kore open (Background)", hidden: true },
                              ],
                            },
                          ],
                        },
                        {
                          name: "Monkey Museum",
                          flex: true,
                          items: [
                            {
                              name: "Gangplank Galleon",
                              type: "bitflags",
                              flags: [
                                { offset: 0xc2, bit: 0, label: "Pirate Panic" },
                                { offset: 0xc2, bit: 1, label: "Lockjaw's Locker" },
                                { offset: 0xc2, bit: 2, label: "Mainbrace Mayhem" },
                                { offset: 0xc2, bit: 3, label: "Pirate Panic" },
                                { offset: 0xc2, bit: 4, label: "Gangplank Galley" },
                                { offset: 0xc2, bit: 5, label: "Topsail Trouble" },
                                { offset: 0xc2, bit: 6, label: "Leave Museum" },
                              ],
                            },
                            {
                              name: "Crocodile Cauldron",
                              type: "bitflags",
                              flags: [
                                { offset: 0xc3, bit: 0, label: "Lava Lagoon" },
                                { offset: 0xc3, bit: 1, label: "Hot-Head Hop" },
                                { offset: 0xc3, bit: 2, label: "Red-Hot Ride" },
                                { offset: 0xc3, bit: 3, label: "Hot-Head Hop" },
                                { offset: 0xc3, bit: 4, label: "Kannon's Klaim" },
                                { offset: 0xc3, bit: 5, label: "Squawks's Shaft" },
                                { offset: 0xc3, bit: 6, label: "Leave Museum" },
                              ],
                            },
                            {
                              name: "Krem Quay",
                              type: "bitflags",
                              flags: [
                                { offset: 0xc4, bit: 0, label: "Barrel Bayou" },
                                { offset: 0xc4, bit: 1, label: "Bramble Blast" },
                                { offset: 0xc4, bit: 2, label: "Slime Climb" },
                                { offset: 0xc4, bit: 3, label: "Glimmer's Galleon" },
                                { offset: 0xc4, bit: 4, label: "Rattle Battle" },
                                { offset: 0xc4, bit: 5, label: "Bramble Blast" },
                                { offset: 0xc4, bit: 6, label: "Leave Museum" },
                              ],
                            },
                            {
                              name: "Krazy Kremland",
                              type: "bitflags",
                              flags: [
                                { offset: 0xca, bit: 0, label: "Hornet Hole" },
                                { offset: 0xca, bit: 1, label: "Rambi Rumble" },
                                { offset: 0xca, bit: 2, label: "Bramble Scrumble" },
                                { offset: 0xca, bit: 3, label: "Target Terror" },
                                { offset: 0xca, bit: 4, label: "Rambi Rumble" },
                                { offset: 0xca, bit: 5, label: "Hornet Hole" },
                                { offset: 0xca, bit: 6, label: "Leave Museum" },
                              ],
                            },
                            {
                              name: "Gloomy Gulch",
                              type: "bitflags",
                              flags: [
                                { offset: 0xc6, bit: 0, label: "Ghostly Grove" },
                                { offset: 0xc6, bit: 1, label: "Parrot Chute Panic" },
                                { offset: 0xc6, bit: 2, label: "Web Woods" },
                                { offset: 0xc6, bit: 3, label: "Haunted Hall" },
                                { offset: 0xc6, bit: 4, label: "Parrot Chute Panic" },
                                { offset: 0xc6, bit: 5, label: "Ghostly Grove" },
                                { offset: 0xc6, bit: 6, label: "Leave Museum" },
                              ],
                            },
                            {
                              name: "K. Rool's Keep",
                              type: "bitflags",
                              flags: [
                                { offset: 0xc7, bit: 0, label: "Arctic Abyss" },
                                { offset: 0xc7, bit: 1, label: "Chain Link Chamber" },
                                { offset: 0xc7, bit: 2, label: "Toxic Tower" },
                                { offset: 0xc7, bit: 3, label: "Clapper's Cavern" },
                                { offset: 0xc7, bit: 4, label: "Castle Crush" },
                                { offset: 0xc7, bit: 5, label: "Chain Link Chamber" },
                                { offset: 0xc7, bit: 6, label: "Leave Museum" },
                              ],
                            },
                            {
                              id: "monkeyMuseumLostWorld",
                              name: "Lost World",
                              type: "bitflags",
                              flags: [
                                { offset: 0xcb, bit: 0, label: "Jungle Jinx" },
                                { offset: 0xcc, bit: 0, label: "Jungle Jinx", hidden: true },
                                { offset: 0xcd, bit: 0, label: "Jungle Jinx", hidden: true },
                                { offset: 0xce, bit: 0, label: "Jungle Jinx", hidden: true },
                                { offset: 0xcf, bit: 0, label: "Jungle Jinx", hidden: true },
                                { offset: 0xcb, bit: 1, label: "Black Ice Battle" },
                                { offset: 0xcc, bit: 1, label: "Black Ice Battle", hidden: true },
                                { offset: 0xcd, bit: 1, label: "Black Ice Battle", hidden: true },
                                { offset: 0xce, bit: 1, label: "Black Ice Battle", hidden: true },
                                { offset: 0xcf, bit: 1, label: "Black Ice Battle", hidden: true },
                                { offset: 0xcb, bit: 2, label: "Klobber Karnage" },
                                { offset: 0xcc, bit: 2, label: "Klobber Karnage", hidden: true },
                                { offset: 0xcd, bit: 2, label: "Klobber Karnage", hidden: true },
                                { offset: 0xce, bit: 2, label: "Klobber Karnage", hidden: true },
                                { offset: 0xcf, bit: 2, label: "Klobber Karnage", hidden: true },
                                { offset: 0xcb, bit: 3, label: "Fiery Furnace" },
                                { offset: 0xcc, bit: 3, label: "Fiery Furnace", hidden: true },
                                { offset: 0xcd, bit: 3, label: "Fiery Furnace", hidden: true },
                                { offset: 0xce, bit: 3, label: "Fiery Furnace", hidden: true },
                                { offset: 0xcf, bit: 3, label: "Fiery Furnace", hidden: true },
                                { offset: 0xcb, bit: 4, label: "Animal Antics" },
                                { offset: 0xcc, bit: 4, label: "Animal Antics", hidden: true },
                                { offset: 0xcd, bit: 4, label: "Animal Antics", hidden: true },
                                { offset: 0xce, bit: 4, label: "Animal Antics", hidden: true },
                                { offset: 0xcf, bit: 4, label: "Animal Antics", hidden: true },
                                { offset: 0xcb, bit: 5, label: "Leave Museum" },
                                { offset: 0xcc, bit: 5, label: "Leave Museum", hidden: true },
                                { offset: 0xcd, bit: 5, label: "Leave Museum", hidden: true },
                                { offset: 0xce, bit: 5, label: "Leave Museum", hidden: true },
                                { offset: 0xcf, bit: 5, label: "Leave Museum", hidden: true },
                              ],
                            },
                          ],
                        },
                        {
                          name: "Kong Kollege",
                          flex: true,
                          items: [
                            {
                              name: "Gangplank Galleon",
                              type: "bitflags",
                              flags: [
                                { offset: 0xd0, bit: 0, label: "Save Game" },
                                { offset: 0xd0, bit: 1, label: "Kong Family Coins" },
                                { offset: 0xd0, bit: 2, label: "Swimming" },
                                { offset: 0xd0, bit: 3, label: "End of Level Target" },
                                { offset: 0xd0, bit: 4, label: "Rambi's Supercharge" },
                                { offset: 0xd0, bit: 5, label: "Character Team-up" },
                                { offset: 0xd0, bit: 6, label: "Area Guardian" },
                                { offset: 0xd0, bit: 7, label: "Leave Kollege" },
                              ],
                            },
                            {
                              name: "Crocodile Cauldron",
                              type: "bitflags",
                              flags: [
                                { offset: 0xd1, bit: 0, label: "Save Game" },
                                { offset: 0xd1, bit: 1, label: "Rattly the Snake" },
                                { offset: 0xd1, bit: 2, label: "Rope Climbing" },
                                { offset: 0xd1, bit: 3, label: "KONG Letters" },
                                { offset: 0xd1, bit: 4, label: "Squitter's Web Platform" },
                                { offset: 0xd1, bit: 5, label: "Kremkoins" },
                                { offset: 0xd1, bit: 6, label: "Area Guardian" },
                                { offset: 0xd1, bit: 7, label: "Leave Kollege" },
                              ],
                            },
                            {
                              name: "Krem Quay",
                              type: "bitflags",
                              flags: [
                                { offset: 0xd2, bit: 0, label: "Save Game" },
                                { offset: 0xd2, bit: 1, label: "Animal Barrels" },
                                { offset: 0xd2, bit: 2, label: "Jumping on Enemies" },
                                { offset: 0xd2, bit: 3, label: "Extra Lives Balloons" },
                                { offset: 0xd2, bit: 4, label: "Rattly's Superjump" },
                                { offset: 0xd2, bit: 5, label: "Cranky's 'Video Game Hero's Coins" },
                                { offset: 0xd2, bit: 6, label: "Area Guardian" },
                                { offset: 0xd2, bit: 7, label: "Leave Kollege" },
                              ],
                            },
                            {
                              name: "Krazy Kremland",
                              type: "bitflags",
                              flags: [
                                { offset: 0xd3, bit: 0, label: "Save Game" },
                                { offset: 0xd3, bit: 1, label: "Secret Doors" },
                                { offset: 0xd3, bit: 2, label: "Roll Jump" },
                                { offset: 0xd3, bit: 3, label: "Area Guardian" },
                                { offset: 0xd3, bit: 4, label: "Leave Kollege" },
                              ],
                            },
                            {
                              name: "Gloomy Gulch",
                              type: "bitflags",
                              flags: [
                                { offset: 0xd4, bit: 0, label: "Save Game" },
                                { offset: 0xd4, bit: 1, label: "Secret Passages" },
                                { offset: 0xd4, bit: 2, label: "Bonus Levels" },
                                { offset: 0xd4, bit: 3, label: "Area Guardian" },
                                { offset: 0xd4, bit: 4, label: "Leave Kollege" },
                              ],
                            },
                            {
                              name: "K. Rool's Keep",
                              type: "bitflags",
                              flags: [
                                { offset: 0xd5, bit: 0, label: "Save Game" },
                                { offset: 0xd5, bit: 1, label: "Invisible Items" },
                                { offset: 0xd5, bit: 2, label: "Enguarde's SuperStab" },
                                { offset: 0xd5, bit: 3, label: "Leave Kollege" },
                              ],
                            },
                            {
                              name: "The Flying Krock",
                              type: "bitflags",
                              flags: [
                                { offset: 0xd6, bit: 0, label: "Save Game" },
                                { offset: 0xd6, bit: 1, label: "Wrinkly Kong" },
                                { offset: 0xd6, bit: 2, label: "Kaptain K. Rool" },
                                { offset: 0xd6, bit: 3, label: "Leave Kollege" },
                              ],
                            },
                          ],
                        },
                        {
                          name: "Funky Flights II",
                          flex: true,
                          items: [
                            {
                              name: "Gangplank Galleon",
                              type: "bitflags",
                              flags: [
                                { offset: 0xd7, bit: 0, label: "Hire Plane" },
                                { offset: 0xd7, bit: 1, label: "Leave Airport" },
                              ],
                            },
                            {
                              name: "Crocodile Cauldron",
                              type: "bitflags",
                              flags: [
                                { offset: 0xd8, bit: 0, label: "Hire Plane" },
                                { offset: 0xd8, bit: 1, label: "Leave Airport" },
                              ],
                            },
                            {
                              name: "Krem Quay",
                              type: "bitflags",
                              flags: [
                                { offset: 0xd9, bit: 0, label: "Hire Plane" },
                                { offset: 0xd9, bit: 1, label: "Leave Airport" },
                              ],
                            },
                            {
                              name: "Krazy Kremland",
                              type: "bitflags",
                              flags: [
                                { offset: 0xdf, bit: 0, label: "Hire Plane" },
                                { offset: 0xdf, bit: 1, label: "Leave Airport" },
                              ],
                            },
                            {
                              name: "Gloomy Gulch",
                              type: "bitflags",
                              flags: [
                                { offset: 0xdb, bit: 0, label: "Hire Plane" },
                                { offset: 0xdb, bit: 1, label: "Leave Airport" },
                              ],
                            },
                            {
                              name: "K. Rool's Keep",
                              type: "bitflags",
                              flags: [
                                { offset: 0xdc, bit: 0, label: "Hire Plane" },
                                { offset: 0xdc, bit: 1, label: "Leave Airport" },
                              ],
                            },
                            {
                              name: "The Flying Krock",
                              type: "bitflags",
                              flags: [
                                { offset: 0xdd, bit: 0, label: "Hire Plane" },
                                { offset: 0xdd, bit: 1, label: "Leave Airport" },
                              ],
                            },
                          ],
                        },
                        {
                          name: "Swanky's Bonus Bonanza",
                          flex: true,
                          items: [
                            {
                              name: "Gangplank Galleon",
                              type: "bitflags",
                              flags: [
                                { offset: 0xe0, bit: 0, label: "Swanky's Swag" },
                                { offset: 0xe0, bit: 1, label: "Pirate Puzzler" },
                                { offset: 0xe0, bit: 2, label: "Chimp Challenge" },
                              ],
                            },
                            {
                              name: "Crocodile Cauldron",
                              type: "bitflags",
                              flags: [
                                { offset: 0xe1, bit: 0, label: "Cranky Challenge" },
                                { offset: 0xe1, bit: 1, label: "Lucky Lava" },
                                { offset: 0xe1, bit: 2, label: "Gorilla Game" },
                              ],
                            },
                            {
                              name: "Krem Quay",
                              type: "bitflags",
                              flags: [
                                { offset: 0xe2, bit: 0, label: "Funky's Fun" },
                                { offset: 0xe2, bit: 1, label: "Swampy Swag" },
                                { offset: 0xe2, bit: 2, label: "Primate Prize" },
                              ],
                            },
                            {
                              name: "Krazy Kremland",
                              type: "bitflags",
                              flags: [
                                { offset: 0xe8, bit: 0, label: "Wrinkly's Winner" },
                                { offset: 0xe8, bit: 1, label: "Krazy Kwiz" },
                                { offset: 0xe8, bit: 2, label: "Baboon Booty" },
                              ],
                            },
                            {
                              name: "Gloomy Gulch",
                              type: "bitflags",
                              flags: [
                                { offset: 0xe4, bit: 0, label: "Lockjaw's Loot" },
                                { offset: 0xe4, bit: 1, label: "Haunted Haul" },
                                { offset: 0xe4, bit: 2, label: "Gibbon Game" },
                              ],
                            },
                            {
                              name: "K. Rool's Keep",
                              type: "bitflags",
                              flags: [
                                { offset: 0xe5, bit: 0, label: "K. Rool's Kwiz" },
                                { offset: 0xe5, bit: 1, label: "Castle Challenge" },
                                { offset: 0xe5, bit: 2, label: "Big Ape Bounty" },
                              ],
                            },
                          ],
                        },
                        {
                          name: "Klubba's Kiosk",
                          items: [
                            {
                              name: "Paid Tolls",
                              type: "bitflags",
                              flags: [
                                { offset: 0xea, bit: 2, label: "Crocodile Cauldron" },
                                { offset: 0xea, bit: 3, label: "Krem Quay" },
                                { offset: 0xea, bit: 4, label: "Krazy Kremland" },
                                { offset: 0xea, bit: 5, label: "Gloomy Gulch" },
                                { offset: 0xea, bit: 6, label: "K. Rool's Keep" },
                              ],
                            },
                            {
                              type: "section",
                              flex: true,
                              hidden: true,
                              items: [
                                {
                                  name: "Related to Tolls",
                                  offset: 0xf0,
                                  type: "variable",
                                  dataType: "uint8",
                                  binary: {
                                    bitStart: 0,
                                    bitLength: 3,
                                  },
                                  hidden: true,
                                },
                                {
                                  name: "Lost World Cleared Levels",
                                  offset: 0xe9,
                                  type: "variable",
                                  dataType: "uint8",
                                  binary: {
                                    bitStart: 0,
                                    bitLength: 3,
                                  },
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
        },
      ],
    },
  ],
  resources: {
    levelProgressions: {
      0x0: "-",
      0x1: "Diddy Kong",
      0x2: "Dixie Kong",
    },
    levels: {
      0xa: "Gangplank Galleon",
      0x16: "Crocodile Cauldron",
      0x23: "Krem Quay",
      0x2b: "Gloomy Gulch",
      0x37: "K. Rool's Keep",
      0x51: "Krazy Kremland",
      0x5c: "The Flying Krock",
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
  },
  resourcesOrder: {
    levels: [0xa, 0x16, 0x23, 0x51, 0x2b, 0x37, 0x5c, 0x6],
  },
};

export default template;
