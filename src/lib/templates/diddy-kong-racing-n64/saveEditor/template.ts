import type { GameJson } from "$lib/types";

const template: GameJson = {
  validator: {
    regions: {
      europe: {},
      usa: {},
      japan: {},
    },
    text: "Drag 'n' drop here or click to add a save file.",
    hint: "If you're having trouble loading a save file from an Everdrive cartridge, please see the FAQ.",
    error: "Not a valid save file.",
  },
  items: [
    {
      type: "tabs",
      items: [
        {
          name: "General",
          flex: true,
          items: [
            {
              name: "Unlocked Modes",
              type: "bitflags",
              flags: [
                { offset: 0x7f, bit: 0, label: "Adventure Two" }, // prettier-ignore
              ],
            },
            {
              name: "Unlocked Characters",
              type: "bitflags",
              flags: [
                { offset: 0x7f, bit: 1, label: "Drumstick" }, // prettier-ignore
                { offset: 0x7d, bit: 0, label: "T.T." }, // prettier-ignore
              ],
            },
          ],
        },
        {
          name: "Adventure",
          items: [
            {
              length: 0x28,
              type: "container",
              instanceType: "tabs",
              instances: 3,
              enumeration: "Slot %d",
              disableSubinstanceIf: {
                offset: 0x25,
                type: "variable",
                dataType: "uint16",
                operator: "=",
                value: 0xffff,
              },
              items: [
                {
                  name: "Checksum",
                  offset: 0x0,
                  type: "checksum",
                  dataType: "uint16",
                  bigEndian: true,
                  control: {
                    offsetStart: 0x2,
                    offsetEnd: 0x28,
                  },
                },
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
                              id: "name",
                              name: "Name",
                              offset: 0x25,
                              length: 0x6,
                              type: "variable",
                              dataType: "string",
                              letterDataType: "uint16",
                              bigEndian: true,
                              fallback: 0x1c,
                              resource: "letters",
                              test: true,
                            },
                            {
                              name: "Mode",
                              offset: 0x24,
                              type: "variable",
                              dataType: "bit",
                              bit: 2,
                              resource: "modes",
                            },
                            {
                              name: "Balloons",
                              offset: 0xe,
                              type: "variable",
                              dataType: "uint8",
                              binary: {
                                bitStart: 1,
                                bitLength: 7,
                              },
                              max: 47,
                              disabled: true,
                            },
                          ],
                        },
                        {
                          type: "section",
                          flex: true,
                          items: [
                            {
                              name: "Pieces of Wizwig Amulet",
                              offset: 0x13,
                              type: "variable",
                              dataType: "uint8",
                              binary: {
                                bitStart: 0,
                                bitLength: 3,
                              },
                              max: 4,
                            },
                            {
                              name: "Pieces of T.T. Amulet",
                              offset: 0x13,
                              type: "variable",
                              dataType: "uint8",
                              binary: {
                                bitStart: 3,
                                bitLength: 3,
                              },
                              max: 4,
                            },
                          ],
                        },
                        {
                          type: "bitflags",
                          hidden: true,
                          flags: [{ offset: 0x24, bit: 1, label: "Meet T.T." }],
                        },
                      ],
                    },
                    {
                      name: "Lobby",
                      items: [
                        {
                          type: "section",
                          flex: true,
                          items: [
                            {
                              name: "Wandering Balloons",
                              type: "bitflags",
                              flags: [
                                { offset: 0x14, bit: 2, label: "Near Dino Domain" }, // prettier-ignore
                                { offset: 0x14, bit: 6, label: "Near Wizpig head" }, // prettier-ignore
                                { offset: 0x15, bit: 2, label: "Near Sherbet Island" }, // prettier-ignore
                              ],
                            },
                            // 0x23 | 5 | Lobby: Wizpig head animation
                            // 0x8 | 4[2] | Wizpig 1 Boss Level
                            // 0xd | 0 | Wizpig 1 beaten
                          ],
                        },
                        {
                          name: "Taj's Challenges",
                          type: "section",
                          flex: true,
                          items: [
                            {
                              name: "Unlocked",
                              type: "bitflags",
                              flags: [
                                { offset: 0xb, bit: 6, label: "Car Challenge" }, // prettier-ignore
                                { offset: 0xb, bit: 7, label: "Hover Challenge" }, // prettier-ignore
                                { offset: 0xa, bit: 0, label: "Plane Challenge" }, // prettier-ignore
                              ],
                            },
                            {
                              name: "Completed",
                              type: "bitflags",
                              flags: [
                                { offset: 0xa, bit: 1, label: "Car Challenge" }, // prettier-ignore
                                { offset: 0xa, bit: 2, label: "Hover Challenge" }, // prettier-ignore
                                { offset: 0xa, bit: 3, label: "Plane Challenge" }, // prettier-ignore
                              ],
                            },
                            {
                              name: "Balloons",
                              type: "bitflags",
                              flags: [
                                { offset: 0x15, bit: 3, label: "Car Challenge" }, // prettier-ignore
                                { offset: 0x14, bit: 3, label: "Hover Challenge", }, // prettier-ignore
                                { offset: 0x14, bit: 4, label: "Plane Challenge", }, // prettier-ignore
                              ],
                            },
                          ],
                        },
                      ],
                    },
                    {
                      name: "Dino Domain",
                      items: [
                        {
                          name: "Balloons",
                          offset: 0xf,
                          type: "variable",
                          dataType: "uint8",
                          binary: {
                            bitStart: 2,
                            bitLength: 4,
                          },
                          hidden: true,
                        },
                        {
                          name: "Races",
                          type: "section",
                          flex: true,
                          items: [
                            {
                              name: "Ancient Lake",
                              offset: 0x2,
                              type: "variable",
                              dataType: "uint8",
                              binary: {
                                bitStart: 0,
                                bitLength: 2,
                              },
                              resource: "raceProgressions",
                            },
                            {
                              name: "Fossil Canyon",
                              offset: 0x2,
                              type: "variable",
                              dataType: "uint8",
                              binary: {
                                bitStart: 4,
                                bitLength: 2,
                              },
                              resource: "raceProgressions",
                            },
                            {
                              name: "Jungle Falls",
                              offset: 0x7,
                              type: "variable",
                              dataType: "uint8",
                              binary: {
                                bitStart: 6,
                                bitLength: 2,
                              },
                              resource: "raceProgressions",
                            },
                            {
                              name: "Hot Top Volcano",
                              offset: 0x3,
                              type: "variable",
                              dataType: "uint8",
                              binary: {
                                bitStart: 4,
                                bitLength: 2,
                              },
                              resource: "raceProgressions",
                            },
                          ],
                        },
                        // 0x4 | 4[2] | Dino Domain: Fire Mountain
                        // 0x8 | 2[2] | Dino Domain: Boss Level 1
                        // 0x9 | 4[2] | Dino Domain: Boss Level 2

                        // 0xc | 4[2] | Dino Domain: Trophy Race Cup
                        // 0xd | 7 | Dino Domain: Trophy Race Unlocked
                        // 0xd | 1 | Dino Domain: Silver Coins challenges Unlocked
                        // 0x20 | 1 | Dino Domain: Key obtained
                        // 0x23 | 6 | Dino Domain: Key used animation
                        // 0x24 | 3 | Dino Domain: Boss Level 1 door open animation
                        // 0x23 | 0 | Dino Domain: Boss Level 2 door open animation
                      ],
                    },
                    {
                      name: "Sherbet Island",
                      items: [
                        {
                          name: "Balloons",
                          offset: 0x10,
                          type: "variable",
                          dataType: "uint8",
                          binary: {
                            bitStart: 3,
                            bitLength: 4,
                          },
                          hidden: true,
                        },
                        // 0x2 | 2[2] | Sherbet Island: Pirate Lagoon
                        // 0x3 | 2[2] | Sherbet Island: Whale Bay
                        // 0x4 | 6[2] | Sherbet Island: Crescent Island
                        // 0x6 | 4[2] | Sherbet Island: Darkwater Beach
                        // 0x7 | 4[2] | Sherbet Island: Treasure Caves
                        // 0x8 | 0[2] | Sherbet Island: Boss Level 1
                        // 0x9 | 0[2] | Sherbet Island: Boss Level 2

                        // 0xc | 6[2] | Sherbet Island: Trophy Race Cup
                        // 0xc | 0 | Sherbet Island: Trophy Race Unlocked
                        // 0xd | 2 | Sherbet Island: Silver Coins challenges Unlocked
                        // 0x20 | 2 | Sherbet Island: Key obtained
                        // 0x23 | 7 | Sherbet Island: Key used animation
                        // 0x24 | 4 | Sherbet Island: Boss Level 1 door open animation
                        // 0x23 | 1 | Sherbet Island: Boss Level 2 door open animation
                      ],
                    },
                    {
                      name: "Snowflake Mountain",
                      items: [
                        {
                          name: "Balloons",
                          offset: 0x11,
                          type: "variable",
                          dataType: "uint8",
                          binary: {
                            bitStart: 4,
                            bitLength: 4,
                          },
                          hidden: true,
                        },

                        // 0x2 | 6[2] | Snowflake Mountain: Boss Level 1
                        // 0x3 | 0[2] | Snowflake Mountain: Snowball Valley
                        // 0x3 | 6[2] | Snowflake Mountain: Walrus Cove
                        // 0x4 | 2[2] | Snowflake Mountain: Everfrost Peak
                        // 0x6 | 0[2] | Snowflake Mountain: Frosty Village
                        // 0x6 | 2[2] | Snowflake Mountain: Icicle Pyramid
                        // 0x9 | 2[2] | Snowflake Mountain: Boss Level 2

                        // 0xb | 0[2] | Snowflake Mountain: Trophy Race Cup
                        // 0xc | 1 | Snowflake Mountain: Trophy Race Unlocked
                        // 0xd | 3 | Snowflake Mountain: Silver Coins challenges Unlocked
                        // 0x20 | 3 | Snowflake Mountain: Key obtained
                        // 0x22 | 0 | Snowflake Mountain: Key used animation
                        // 0x24 | 5 | Snowflake Mountain: Boss Level 1 door open animation
                        // 0x23 | 2 | Snowflake Mountain: Boss Level 2 door open animation
                      ],
                    },
                    {
                      name: "Dragon Forest",
                      items: [
                        {
                          name: "Balloons",
                          offset: 0x11,
                          type: "variable",
                          dataType: "uint16",
                          bigEndian: true,
                          binary: {
                            bitStart: 5,
                            bitLength: 4,
                          },
                          hidden: true,
                        },
                        // 0x5 | 0[2] | Dragon Forest: Windmill Plains
                        // 0x5 | 2[2] | Dragon Forest: Boulder Canyon
                        // 0x5 | 4[2] | Dragon Forest: Greenwood Village
                        // 0x6 | 6[2] | Dragon Forest: Smokey Castle
                        // 0x7 | 2[2] | Dragon Forest: Haunted Woods
                        // 0x9 | 6[2] | Dragon Forest: Boss Level 1
                        // 0xa | 6[2] | Dragon Forest: Boss Level 2

                        // 0xb | 2[2] | Dragon Forest: Trophy Race Cup
                        // 0xc | 2 | Dragon Forest: Trophy Race Unlocked
                        // 0xd | 4 | Dragon Forest: Silver Coins challenges Unlocked
                        // 0x20 | 4 | Dragon Forest: Key obtained
                        // 0x22 | 1 | Dragon Forest: Key used animation
                        // 0x24 | 6 | Dragon Forest: Boss Level 1 door open animation
                        // 0x23 | 3 | Dragon Forest: Boss Level 2 door open animation
                      ],
                    },
                    {
                      name: "Future Fun Land",
                      items: [
                        {
                          name: "Balloons",
                          offset: 0x12,
                          type: "variable",
                          dataType: "uint16",
                          bigEndian: true,
                          binary: {
                            bitStart: 6,
                            bitLength: 4,
                          },
                          hidden: true,
                        },
                        // 0x4 | 0[2] | Future Fun Land: Spaceport Alpha
                        // 0x5 | 6[2] | Future Fun Land: Spacedust Alley
                        // 0x7 | 0[2] | Future Fun Land: Darkmoon Caverns
                        // 0x8 | 6[2] | Future Fun Land: Star City

                        // 0xb | 4[2] | Future Fun Land: Trophy Race Cup
                        // 0x24 | 7 | Future Fun Land: Wizpig Level door open animation
                        // 0x24 | 0 | Access to Future Fun Land Unlocked

                        // 0x22 | 2 | Related to Future Fun Lan: Spacedust Alley completed

                        // 0xa | 4[2] | Wizpig 2 Boss Level
                        // 0xd | 5 | Game Completed
                      ],
                    },
                  ],
                },
              ],
            },
          ],
        },
        {
          name: "Records",
          items: [
            {
              type: "section",
              flex: true,
              hidden: true,
              items: [
                {
                  name: "Checksum 1",
                  offset: 0x80,
                  type: "checksum",
                  dataType: "uint16",
                  bigEndian: true,
                  control: {
                    offsetStart: 0x82,
                    offsetEnd: 0x140,
                  },
                },
                {
                  name: "Checksum 2",
                  offset: 0x140,
                  type: "checksum",
                  dataType: "uint16",
                  bigEndian: true,
                  control: {
                    offsetStart: 0x142,
                    offsetEnd: 0x200,
                  },
                },
              ],
            },
            // Records

            // Best Lap

            // Dino Domain: Fossil Canyon

            // Car
            // 0x82 | uint16-be | Time
            // 0x84| uint16-be | Name

            // Hover
            // 0x86 | uint16-be | Time
            // 0x88| uint16-be | Name

            // Plane
            // 0x8a | uint16-be | Time
            // 0x8c| uint16-be | Name

            // ???
            // 0x8e | uint16-be | Time
            // 0x90| uint16-be | Name

            // Dino Domain: Ancient Lake

            // Car
            // 0x92 | uint16-be | Time
            // 0x94| uint16-be | Name

            // Hover
            // 0x96 | uint16-be | Time
            // 0x98| uint16-be | Name

            // Plane
            // 0x9a | uint16-be | Time
            // 0x9c| uint16-be | Name

            // T.T.?
            // 0x9e | uint16-be | Time
            // 0xa0| uint16-be | Name

            // Best Time

            // Dino Domain: Fossil Canyon

            // Car
            // 0x142 | uint16-be | Time
            // 0x144| uint16-be | Name

            // Hover
            // 0x146 | uint16-be | Time
            // 0x148| uint16-be | Name

            // Plane
            // 0x14a | uint16-be | Time
            // 0x14c| uint16-be | Name

            // ???
            // 0x14e | uint16-be | Time
            // 0x150| uint16-be | Name

            // Dino Domain: Ancient Lake

            // Car
            // 0x152 | uint16-be | Time
            // 0x154| uint16-be | Name

            // Hover
            // 0x152 | uint16-be | Time
            // 0x154| uint16-be | Name

            // Plane
            // 0x156 | uint16-be | Time
            // 0x158| uint16-be | Name

            // ???
            // 0x15a | uint16-be | Time
            // 0x15c| uint16-be | Name
            // Dino Domain: Ancient Lake???

            // Options

            // T.T. Beaten (2)
            // 0x7f | 4 | Dino Domain: Ancient Lake
            // 0x7f | 5 | Dino Domain: Fossil Canyon
            // 0x7f | 6 | Dino Domain: Jungle Falls
            // 0x7f | 7 | Dino Domain: Hot Top Volcano
            // 0x7e | 0 | Sherbet Island: Whale Bay
            // 0x7e | 1 | Sherbet Island: Pirate Lagoon
            // 0x7e | 2 | Sherbet Island: Crescent Island
            // 0x7e | 3 | Sherbet Island: Treasure Caves
            // 0x7e | 4 | Snowflake Mountain: Everfrost Peak
            // 0x7e | 5 | Snowflake Mountain: Walrus Cove
            // 0x7e | 6 | Snowflake Mountain: Snowball Valley
            // 0x7e | 7 | Snowflake Mountain: Frosty Village
            // 0x7d | 0 | Dragon Forest: Boulder Canyon
            // 0x7d | 1 | Dragon Forest: Greenwood Village
            // 0x7d | 2 | Dragon Forest: Windmill Plains
            // 0x7d | 3 | Dragon Forest: Haunted Woods
            // 0x7d | 4 | Future Fun Land: Spacedust Alley
            // 0x7d | 5 | Future Fun Land: Darkmoon Caverns
            // 0x7d | 6 | Future Fun Land: Star City
            // 0x7d | 7 | Future Fun Land: Spaceport Alpha
          ],
        },
        {
          name: "Options",
          items: [
            {
              id: "checksumOptions",
              name: "Checksum",
              offset: 0x78,
              type: "checksum",
              dataType: "uint8",
              control: {
                offsetStart: 0x79,
                offsetEnd: 0x80,
              },
            },
            {
              type: "section",
              flex: true,
              items: [
                {
                  name: "???",
                  offset: 0x7c,
                  type: "variable",
                  dataType: "bit",
                  bit: 0,
                  hidden: true,
                },
                {
                  name: "Subtitles",
                  offset: 0x7c,
                  type: "variable",
                  dataType: "bit",
                  bit: 1,
                  resource: "optionBoolean",
                },
                {
                  id: "language",
                  name: "Language",
                  offset: 0x7f,
                  type: "variable",
                  dataType: "uint8",
                  binary: {
                    bitStart: 2,
                    bitLength: 2,
                  },
                  resource: "languages",
                },
              ],
            },
          ],
        },
      ],
    },
  ],
  resources: {
    languages: [
      // Europe
      {
        0x0: "English",
        0x1: "German",
        0x2: "French",
      },
      // USA
      {
        0x0: "English",
        0x2: "French",
      },
    ],
    letters: {
      0x0: "A",
      0x1: "B",
      0x2: "C",
      0x3: "D",
      0x4: "E",
      0x5: "F",
      0x6: "G",
      0x7: "H",
      0x8: "I",
      0x9: "J",
      0xa: "K",
      0xb: "L",
      0xc: "M",
      0xd: "N",
      0xe: "O",
      0xf: "P",
      0x10: "Q",
      0x11: "R",
      0x12: "S",
      0x13: "T",
      0x14: "U",
      0x15: "V",
      0x16: "W",
      0x17: "X",
      0x18: "Y",
      0x19: "Z",
      0x1a: ".",
      0x1b: "?",
      0x1c: " ",
    },
    modes: {
      0x0: "Adventure",
      0x1: "Adventure Two",
    },
    optionBoolean: {
      0x0: "Off",
      0x1: "On",
    },
    raceProgressions: {
      0x0: "-",
      0x1: "Played",
      0x2: "Challenge 1 Completed",
      0x3: "Challenge 2 Completed",
    },
  },
};

export default template;
