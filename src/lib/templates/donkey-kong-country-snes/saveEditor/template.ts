import type { GameJson } from "$lib/types";

const template: GameJson = {
  validator: {
    regions: {
      europe: {
        $or: [
          { 0xc: [0x41, 0x52, 0x45, 0x52] }, // "ARER"
          { 0x2b4: [0x41, 0x52, 0x45, 0x52] }, // "ARER"
          { 0x55c: [0x41, 0x52, 0x45, 0x52] }, // "ARER"
        ],
      },
      usa_japan: {
        $or: [
          { 0xc: [0x41, 0x52, 0x45, 0x52] }, // "ARER"
          { 0x2b4: [0x41, 0x52, 0x45, 0x52] }, // "ARER"
          { 0x55c: [0x41, 0x52, 0x45, 0x52] }, // "ARER"
        ],
      },
    },
    text: "Drag 'n' drop here or click to add a save file.",
    error: "Not a valid save file.",
  },
  items: [
    {
      id: "main",
      length: 0x2a8,
      type: "container",
      instanceType: "tabs",
      instances: 3,
      enumeration: "Slot %d",
      disableSubinstanceIf: {
        offset: 0xc,
        type: "variable",
        dataType: "uint32",
        operator: "!=",
        value: 0x52455241,
      },
      items: [
        {
          length: 0x154,
          type: "container",
          instanceType: "tabs",
          instances: 2,
          enumeration: "Player %d",
          disableSubinstanceIf: {
            offset: 0xc,
            type: "variable",
            dataType: "uint32",
            operator: "!=",
            value: 0x52455241,
          },
          items: [
            {
              name: "Checksum",
              offset: 0x8,
              type: "checksum",
              dataType: "uint32",
              control: {
                offsetStart: 0xc,
                offsetEnd: 0x11e,
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
                      name: "Mode",
                      offset: 0x10,
                      type: "variable",
                      dataType: "uint8",
                      resource: "modes",
                      disabled: true,
                    },
                    {
                      type: "section",
                      flex: true,
                      items: [
                        {
                          name: "Completion Rate",
                          offset: 0x16,
                          type: "variable",
                          dataType: "uint8",
                          suffix: "%",
                          disabled: true,
                        },
                        {
                          name: "Current Level",
                          offset: 0x15,
                          type: "variable",
                          dataType: "uint8",
                          resource: "levels",
                        },
                        {
                          name: "Playtime",
                          type: "group",
                          mode: "time",
                          items: [
                            {
                              offset: 0x13,
                              type: "variable",
                              dataType: "uint16",
                              operations: [
                                { "*": 60 },
                                {
                                  convert: {
                                    from: "seconds",
                                    to: "hours",
                                  },
                                },
                                { round: 0 },
                              ],
                              leadingZeros: 1,
                              max: 99,
                              test: true,
                            },
                            {
                              offset: 0x13,
                              type: "variable",
                              dataType: "uint16",
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
                              test: true,
                            },
                          ],
                        },
                      ],
                    },
                  ],
                },
                {
                  name: "Kongo Jungle",
                  flex: true,
                  items: [
                    {
                      type: "section",
                      items: [
                        {
                          id: "progression-cleared-24",
                          name: "Jungle Hijinxs",
                          offset: 0x2e,
                          type: "variable",
                          dataType: "uint8",
                          resource: "progressions",
                        },
                        {
                          id: "progression-bonusRooms-24",
                          type: "bitflags",
                          flags: [
                            { offset: 0x2e, bit: 1, label: "Bonus Room 1" },
                            { offset: 0x2e, bit: 2, label: "Bonus Room 2" },
                            { offset: 0x2e, bit: 3, label: "Bonus Room 3", hidden: true },
                            { offset: 0x2e, bit: 4, label: "Bonus Room 4", hidden: true },
                            { offset: 0x2e, bit: 5, label: "Bonus Room 5", hidden: true },
                            { offset: 0x2e, bit: 6, label: "Bonus Room 6", hidden: true },
                          ],
                        },
                      ],
                    },
                    {
                      type: "section",
                      items: [
                        {
                          id: "progression-cleared-14",
                          name: "Ropey Rampage",
                          offset: 0x24,
                          type: "variable",
                          dataType: "uint8",
                          resource: "progressions",
                        },
                        {
                          id: "progression-bonusRooms-14",
                          type: "bitflags",
                          flags: [
                            { offset: 0x24, bit: 1, label: "Bonus Room 1" },
                            { offset: 0x24, bit: 2, label: "Bonus Room 2" },
                            { offset: 0x24, bit: 3, label: "Bonus Room 3", hidden: true },
                            { offset: 0x24, bit: 4, label: "Bonus Room 4", hidden: true },
                            { offset: 0x24, bit: 5, label: "Bonus Room 5", hidden: true },
                            { offset: 0x24, bit: 6, label: "Bonus Room 6", hidden: true },
                          ],
                        },
                      ],
                    },
                    {
                      type: "section",
                      items: [
                        {
                          id: "progression-cleared-3",
                          name: "Reptile Rumble",
                          offset: 0x19,
                          type: "variable",
                          dataType: "uint8",
                          resource: "progressions",
                        },
                        {
                          id: "progression-bonusRooms-3",
                          type: "bitflags",
                          flags: [
                            { offset: 0x19, bit: 1, label: "Bonus Room 1" },
                            { offset: 0x19, bit: 2, label: "Bonus Room 2" },
                            { offset: 0x19, bit: 3, label: "Bonus Room 3" },
                            { offset: 0x19, bit: 4, label: "Bonus Room 4", hidden: true },
                            { offset: 0x19, bit: 5, label: "Bonus Room 5", hidden: true },
                            { offset: 0x19, bit: 6, label: "Bonus Room 6", hidden: true },
                          ],
                        },
                      ],
                    },
                    {
                      type: "section",
                      items: [
                        {
                          id: "progression-cleared-193",
                          name: "Coral Capers",
                          offset: 0xd7,
                          type: "variable",
                          dataType: "uint8",
                          resource: "progressions",
                        },
                      ],
                    },
                    {
                      type: "section",
                      items: [
                        {
                          id: "progression-cleared-25",
                          name: "Barrel Cannon Canyon",
                          offset: 0x2f,
                          type: "variable",
                          dataType: "uint8",
                          resource: "progressions",
                        },
                        {
                          id: "progression-bonusRooms-25",
                          type: "bitflags",
                          flags: [
                            { offset: 0x2f, bit: 1, label: "Bonus Room 1" },
                            { offset: 0x2f, bit: 2, label: "Bonus Room 2" },
                            { offset: 0x2f, bit: 3, label: "Bonus Room 3", hidden: true },
                            { offset: 0x2f, bit: 4, label: "Bonus Room 4", hidden: true },
                            { offset: 0x2f, bit: 5, label: "Bonus Room 5", hidden: true },
                            { offset: 0x2f, bit: 6, label: "Bonus Room 6", hidden: true },
                          ],
                        },
                      ],
                    },
                    {
                      type: "section",
                      items: [
                        {
                          id: "progression-cleared-226",
                          name: "Very Gnawty's Lair",
                          offset: 0xf8,
                          type: "variable",
                          dataType: "uint8",
                          resource: "progressions",
                        },
                      ],
                    },
                    {
                      type: "section",
                      hidden: true,
                      items: [
                        {
                          name: "Kongo Jungle",
                          offset: 0x104,
                          type: "variable",
                          dataType: "uint8",
                          resource: "progressions",
                        },
                      ],
                    },
                  ],
                },

                {
                  name: "Monkey Mines",
                  flex: true,
                  items: [
                    {
                      type: "section",
                      items: [
                        {
                          id: "progression-cleared-219",
                          name: "Winky's Walkway",
                          offset: 0xf1,
                          type: "variable",
                          dataType: "uint8",
                          resource: "progressions",
                        },
                        {
                          id: "progression-bonusRooms-219",
                          type: "bitflags",
                          flags: [
                            { offset: 0xf1, bit: 1, label: "Bonus Room 1" },
                            { offset: 0xf1, bit: 2, label: "Bonus Room 2", hidden: true },
                            { offset: 0xf1, bit: 3, label: "Bonus Room 3", hidden: true },
                            { offset: 0xf1, bit: 4, label: "Bonus Room 4", hidden: true },
                            { offset: 0xf1, bit: 5, label: "Bonus Room 5", hidden: true },
                            { offset: 0xf1, bit: 6, label: "Bonus Room 6", hidden: true },
                          ],
                        },
                      ],
                    },
                    {
                      type: "section",
                      items: [
                        {
                          id: "progression-cleared-48",
                          name: "Mine Cart Carnage",
                          offset: 0x46,
                          type: "variable",
                          dataType: "uint8",
                          resource: "progressions",
                        },
                      ],
                    },
                    {
                      type: "section",
                      items: [
                        {
                          id: "progression-cleared-9",
                          name: "Bouncy Bonanza",
                          offset: 0x1f,
                          type: "variable",
                          dataType: "uint8",
                          resource: "progressions",
                        },
                        {
                          id: "progression-bonusRooms-9",
                          type: "bitflags",
                          flags: [
                            { offset: 0x1f, bit: 1, label: "Bonus Room 1" },
                            { offset: 0x1f, bit: 2, label: "Bonus Room 2" },
                            { offset: 0x1f, bit: 3, label: "Bonus Room 3", hidden: true },
                            { offset: 0x1f, bit: 4, label: "Bonus Room 4", hidden: true },
                            { offset: 0x1f, bit: 5, label: "Bonus Room 5", hidden: true },
                            { offset: 0x1f, bit: 6, label: "Bonus Room 6", hidden: true },
                          ],
                        },
                      ],
                    },
                    {
                      type: "section",
                      items: [
                        {
                          id: "progression-cleared-51",
                          name: "Stop & Go Station",
                          offset: 0x49,
                          type: "variable",
                          dataType: "uint8",
                          resource: "progressions",
                        },
                        {
                          id: "progression-bonusRooms-51",
                          type: "bitflags",
                          flags: [
                            { offset: 0x49, bit: 1, label: "Bonus Room 1" },
                            { offset: 0x49, bit: 2, label: "Bonus Room 2" },
                            { offset: 0x49, bit: 3, label: "Bonus Room 3", hidden: true },
                            { offset: 0x49, bit: 4, label: "Bonus Room 4", hidden: true },
                            { offset: 0x49, bit: 5, label: "Bonus Room 5", hidden: true },
                            { offset: 0x49, bit: 6, label: "Bonus Room 6", hidden: true },
                          ],
                        },
                      ],
                    },
                    {
                      type: "section",
                      items: [
                        {
                          id: "progression-cleared-68",
                          name: "Millstone Mayhem",
                          offset: 0x5a,
                          type: "variable",
                          dataType: "uint8",
                          resource: "progressions",
                        },
                        {
                          id: "progression-bonusRooms-68",
                          type: "bitflags",
                          flags: [
                            { offset: 0x5a, bit: 1, label: "Bonus Room 1" },
                            { offset: 0x5a, bit: 2, label: "Bonus Room 2" },
                            { offset: 0x5a, bit: 3, label: "Bonus Room 3" },
                            { offset: 0x5a, bit: 4, label: "Bonus Room 4", hidden: true },
                            { offset: 0x5a, bit: 5, label: "Bonus Room 5", hidden: true },
                            { offset: 0x5a, bit: 6, label: "Bonus Room 6", hidden: true },
                          ],
                        },
                      ],
                    },
                    {
                      type: "section",
                      items: [
                        {
                          id: "progression-cleared-227",
                          name: "Necky's Nuts",
                          offset: 0xf9,
                          type: "variable",
                          dataType: "uint8",
                          resource: "progressions",
                        },
                      ],
                    },
                    {
                      type: "section",
                      hidden: true,
                      items: [
                        {
                          name: "Monkey Mines",
                          offset: 0x105,
                          type: "variable",
                          dataType: "uint8",
                          resource: "progressions",
                        },
                      ],
                    },
                  ],
                },
                {
                  name: "Vine Valley",
                  flex: true,
                  items: [
                    {
                      type: "section",
                      items: [
                        {
                          id: "progression-cleared-167",
                          name: "Vulture Culture",
                          offset: 0xbd,
                          type: "variable",
                          dataType: "uint8",
                          resource: "progressions",
                        },
                        {
                          id: "progression-bonusRooms-167",
                          type: "bitflags",
                          flags: [
                            { offset: 0xbd, bit: 1, label: "Bonus Room 1" },
                            { offset: 0xbd, bit: 2, label: "Bonus Room 2" },
                            { offset: 0xbd, bit: 3, label: "Bonus Room 3" },
                            { offset: 0xbd, bit: 4, label: "Bonus Room 4", hidden: true },
                            { offset: 0xbd, bit: 5, label: "Bonus Room 5", hidden: true },
                            { offset: 0xbd, bit: 6, label: "Bonus Room 6", hidden: true },
                          ],
                        },
                      ],
                    },
                    {
                      type: "section",
                      items: [
                        {
                          id: "progression-cleared-166",
                          name: "Tree Top Town",
                          offset: 0xbc,
                          type: "variable",
                          dataType: "uint8",
                          resource: "progressions",
                        },
                        {
                          id: "progression-bonusRooms-166",
                          type: "bitflags",
                          flags: [
                            { offset: 0xbc, bit: 1, label: "Bonus Room 1" },
                            { offset: 0xbc, bit: 2, label: "Bonus Room 2" },
                            { offset: 0xbc, bit: 3, label: "Bonus Room 3", hidden: true },
                            { offset: 0xbc, bit: 4, label: "Bonus Room 4", hidden: true },
                            { offset: 0xbc, bit: 5, label: "Bonus Room 5", hidden: true },
                            { offset: 0xbc, bit: 6, label: "Bonus Room 6", hidden: true },
                          ],
                        },
                      ],
                    },
                    {
                      type: "section",
                      items: [
                        {
                          id: "progression-cleared-210",
                          name: "Forest Frenzy",
                          offset: 0xe8,
                          type: "variable",
                          dataType: "uint8",
                          resource: "progressions",
                        },
                        {
                          id: "progression-bonusRooms-210",
                          type: "bitflags",
                          flags: [
                            { offset: 0xe8, bit: 1, label: "Bonus Room 1" },
                            { offset: 0xe8, bit: 2, label: "Bonus Room 2" },
                            { offset: 0xe8, bit: 3, label: "Bonus Room 3", hidden: true },
                            { offset: 0xe8, bit: 4, label: "Bonus Room 4", hidden: true },
                            { offset: 0xe8, bit: 5, label: "Bonus Room 5", hidden: true },
                            { offset: 0xe8, bit: 6, label: "Bonus Room 6", hidden: true },
                          ],
                        },
                      ],
                    },
                    {
                      type: "section",
                      items: [
                        {
                          id: "progression-cleared-69",
                          name: "Temple Tempest",
                          offset: 0x5b,
                          type: "variable",
                          dataType: "uint8",
                          resource: "progressions",
                        },
                        {
                          id: "progression-bonusRooms-69",
                          type: "bitflags",
                          flags: [
                            { offset: 0x5b, bit: 1, label: "Bonus Room 1" },
                            { offset: 0x5b, bit: 2, label: "Bonus Room 2" },
                            { offset: 0x5b, bit: 3, label: "Bonus Room 3", hidden: true },
                            { offset: 0x5b, bit: 4, label: "Bonus Room 4", hidden: true },
                            { offset: 0x5b, bit: 5, label: "Bonus Room 5", hidden: true },
                            { offset: 0x5b, bit: 6, label: "Bonus Room 6", hidden: true },
                          ],
                        },
                      ],
                    },
                    {
                      type: "section",
                      items: [
                        {
                          id: "progression-cleared-15",
                          name: "Orang-utan Gang",
                          offset: 0x25,
                          type: "variable",
                          dataType: "uint8",
                          resource: "progressions",
                        },
                        {
                          id: "progression-bonusRooms-15",
                          type: "bitflags",
                          flags: [
                            { offset: 0x25, bit: 1, label: "Bonus Room 1" },
                            { offset: 0x25, bit: 2, label: "Bonus Room 2" },
                            { offset: 0x25, bit: 3, label: "Bonus Room 3" },
                            { offset: 0x25, bit: 4, label: "Bonus Room 4" },
                            { offset: 0x25, bit: 5, label: "Bonus Room 5" },
                            { offset: 0x25, bit: 6, label: "Bonus Room 6", hidden: true },
                          ],
                        },
                      ],
                    },
                    {
                      type: "section",
                      items: [
                        {
                          id: "progression-cleared-224",
                          name: "Clam City",
                          offset: 0xf6,
                          type: "variable",
                          dataType: "uint8",
                          resource: "progressions",
                        },
                      ],
                    },
                    {
                      type: "section",
                      items: [
                        {
                          id: "progression-cleared-231",
                          name: "Bumble B Rumble",
                          offset: 0xfd,
                          type: "variable",
                          dataType: "uint8",
                          resource: "progressions",
                        },
                      ],
                    },
                    {
                      type: "section",
                      hidden: true,
                      items: [
                        {
                          name: "Vine Valley",
                          offset: 0x101,
                          type: "variable",
                          dataType: "uint8",
                          resource: "progressions",
                        },
                      ],
                    },
                  ],
                },
                {
                  name: "Gorilla Glacier",
                  flex: true,
                  items: [
                    {
                      type: "section",
                      items: [
                        {
                          id: "progression-cleared-38",
                          name: "Snow Barrel Blast",
                          offset: 0x3c,
                          type: "variable",
                          dataType: "uint8",
                          resource: "progressions",
                        },
                        {
                          id: "progression-bonusRooms-38",
                          type: "bitflags",
                          flags: [
                            { offset: 0x3c, bit: 1, label: "Bonus Room 1" },
                            { offset: 0x3c, bit: 2, label: "Bonus Room 2" },
                            { offset: 0x3c, bit: 3, label: "Bonus Room 3" },
                            { offset: 0x3c, bit: 4, label: "Bonus Room 4", hidden: true },
                            { offset: 0x3c, bit: 5, label: "Bonus Room 5", hidden: true },
                            { offset: 0x3c, bit: 6, label: "Bonus Room 6", hidden: true },
                          ],
                        },
                      ],
                    },
                    {
                      type: "section",
                      items: [
                        {
                          id: "progression-cleared-111",
                          name: "Slipslide Ride",
                          offset: 0x85,
                          type: "variable",
                          dataType: "uint8",
                          resource: "progressions",
                        },
                        {
                          id: "progression-bonusRooms-111",
                          type: "bitflags",
                          flags: [
                            { offset: 0x85, bit: 1, label: "Bonus Room 1" },
                            { offset: 0x85, bit: 2, label: "Bonus Room 2" },
                            { offset: 0x85, bit: 3, label: "Bonus Room 3" },
                            { offset: 0x85, bit: 4, label: "Bonus Room 4", hidden: true },
                            { offset: 0x85, bit: 5, label: "Bonus Room 5", hidden: true },
                            { offset: 0x85, bit: 6, label: "Bonus Room 6", hidden: true },
                          ],
                        },
                      ],
                    },
                    {
                      type: "section",
                      items: [
                        {
                          id: "progression-cleared-169",
                          name: "Ice Age Alley",
                          offset: 0xbf,
                          type: "variable",
                          dataType: "uint8",
                          resource: "progressions",
                        },
                        {
                          id: "progression-bonusRooms-169",
                          type: "bitflags",
                          flags: [
                            { offset: 0xbf, bit: 1, label: "Bonus Room 1" },
                            { offset: 0xbf, bit: 2, label: "Bonus Room 2" },
                            { offset: 0xbf, bit: 3, label: "Bonus Room 3", hidden: true },
                            { offset: 0xbf, bit: 4, label: "Bonus Room 4", hidden: true },
                            { offset: 0xbf, bit: 5, label: "Bonus Room 5", hidden: true },
                            { offset: 0xbf, bit: 6, label: "Bonus Room 6", hidden: true },
                          ],
                        },
                      ],
                    },
                    {
                      type: "section",
                      items: [
                        {
                          id: "progression-cleared-64",
                          name: "Croctopus Chase",
                          offset: 0x56,
                          type: "variable",
                          dataType: "uint8",
                          resource: "progressions",
                        },
                      ],
                    },
                    {
                      type: "section",
                      items: [
                        {
                          id: "progression-cleared-22",
                          name: "Torchlight Trouble",
                          offset: 0x2c,
                          type: "variable",
                          dataType: "uint8",
                          resource: "progressions",
                        },
                        {
                          id: "progression-bonusRooms-22",
                          type: "bitflags",
                          flags: [
                            { offset: 0x2c, bit: 1, label: "Bonus Room 1" },
                            { offset: 0x2c, bit: 2, label: "Bonus Room 2" },
                            { offset: 0x2c, bit: 3, label: "Bonus Room 3", hidden: true },
                            { offset: 0x2c, bit: 4, label: "Bonus Room 4", hidden: true },
                            { offset: 0x2c, bit: 5, label: "Bonus Room 5", hidden: true },
                            { offset: 0x2c, bit: 6, label: "Bonus Room 6", hidden: true },
                          ],
                        },
                      ],
                    },
                    {
                      type: "section",
                      items: [
                        {
                          id: "progression-cleared-208",
                          name: "Rope Bridge Rumble",
                          offset: 0xe6,
                          type: "variable",
                          dataType: "uint8",
                          resource: "progressions",
                        },
                        {
                          id: "progression-bonusRooms-208",
                          type: "bitflags",
                          flags: [
                            { offset: 0xe6, bit: 1, label: "Bonus Room 1" },
                            { offset: 0xe6, bit: 2, label: "Bonus Room 2" },
                            { offset: 0xe6, bit: 3, label: "Bonus Room 3", hidden: true },
                            { offset: 0xe6, bit: 4, label: "Bonus Room 4", hidden: true },
                            { offset: 0xe6, bit: 5, label: "Bonus Room 5", hidden: true },
                            { offset: 0xe6, bit: 6, label: "Bonus Room 6", hidden: true },
                          ],
                        },
                      ],
                    },
                    {
                      type: "section",
                      items: [
                        {
                          id: "progression-cleared-228",
                          name: "Really Gnawty Rampage",
                          offset: 0xfa,
                          type: "variable",
                          dataType: "uint8",
                          resource: "progressions",
                        },
                      ],
                    },
                    {
                      type: "section",
                      hidden: true,
                      items: [
                        {
                          name: "Gorilla Glacier",
                          offset: 0x100,
                          type: "variable",
                          dataType: "uint8",
                          resource: "progressions",
                        },
                      ],
                    },
                  ],
                },
                {
                  name: "Kremkroc Industries Inc.",
                  flex: true,
                  items: [
                    {
                      type: "section",
                      items: [
                        {
                          id: "progression-cleared-66",
                          name: "Oil Drum Alley",
                          offset: 0x58,
                          type: "variable",
                          dataType: "uint8",
                          resource: "progressions",
                        },
                        {
                          id: "progression-bonusRooms-66",
                          type: "bitflags",
                          flags: [
                            { offset: 0x58, bit: 1, label: "Bonus Room 1" },
                            { offset: 0x58, bit: 2, label: "Bonus Room 2" },
                            { offset: 0x58, bit: 3, label: "Bonus Room 3" },
                            { offset: 0x58, bit: 4, label: "Bonus Room 4" },
                            { offset: 0x58, bit: 5, label: "Bonus Room 5", hidden: true },
                            { offset: 0x58, bit: 6, label: "Bonus Room 6", hidden: true },
                          ],
                        },
                      ],
                    },
                    {
                      type: "section",
                      items: [
                        {
                          id: "progression-cleared-49",
                          name: "Trick Track Trek",
                          offset: 0x47,
                          type: "variable",
                          dataType: "uint8",
                          resource: "progressions",
                        },
                        {
                          id: "progression-bonusRooms-49",
                          type: "bitflags",
                          flags: [
                            { offset: 0x47, bit: 1, label: "Bonus Room 1" },
                            { offset: 0x47, bit: 2, label: "Bonus Room 2" },
                            { offset: 0x47, bit: 3, label: "Bonus Room 3" },
                            { offset: 0x47, bit: 4, label: "Bonus Room 4", hidden: true },
                            { offset: 0x47, bit: 5, label: "Bonus Room 5", hidden: true },
                            { offset: 0x47, bit: 6, label: "Bonus Room 6", hidden: true },
                          ],
                        },
                      ],
                    },
                    {
                      type: "section",
                      items: [
                        {
                          id: "progression-cleared-26",
                          name: "Elevator Antics",
                          offset: 0x30,
                          type: "variable",
                          dataType: "uint8",
                          resource: "progressions",
                        },
                        {
                          id: "progression-bonusRooms-26",
                          type: "bitflags",
                          flags: [
                            { offset: 0x30, bit: 1, label: "Bonus Room 1" },
                            { offset: 0x30, bit: 2, label: "Bonus Room 2" },
                            { offset: 0x30, bit: 3, label: "Bonus Room 3" },
                            { offset: 0x30, bit: 4, label: "Bonus Room 4", hidden: true },
                            { offset: 0x30, bit: 5, label: "Bonus Room 5", hidden: true },
                            { offset: 0x30, bit: 6, label: "Bonus Room 6", hidden: true },
                          ],
                        },
                      ],
                    },
                    {
                      type: "section",
                      items: [
                        {
                          id: "progression-cleared-36",
                          name: "Poison Pond",
                          offset: 0x3a,
                          type: "variable",
                          dataType: "uint8",
                          resource: "progressions",
                        },
                      ],
                    },
                    {
                      type: "section",
                      items: [
                        {
                          id: "progression-cleared-41",
                          name: "Mine Cart Madness",
                          offset: 0x3f,
                          type: "variable",
                          dataType: "uint8",
                          resource: "progressions",
                        },
                        {
                          id: "progression-bonusRooms-41",
                          type: "bitflags",
                          flags: [
                            { offset: 0x3f, bit: 1, label: "Bonus Room 1" },
                            { offset: 0x3f, bit: 2, label: "Bonus Room 2" },
                            { offset: 0x3f, bit: 3, label: "Bonus Room 3" },
                            { offset: 0x3f, bit: 4, label: "Bonus Room 4", hidden: true },
                            { offset: 0x3f, bit: 5, label: "Bonus Room 5", hidden: true },
                            { offset: 0x3f, bit: 6, label: "Bonus Room 6", hidden: true },
                          ],
                        },
                      ],
                    },
                    {
                      type: "section",
                      items: [
                        {
                          id: "progression-cleared-67",
                          name: "Blackout Basement",
                          offset: 0x59,
                          type: "variable",
                          dataType: "uint8",
                          resource: "progressions",
                        },
                        {
                          id: "progression-bonusRooms-67",
                          type: "bitflags",
                          flags: [
                            { offset: 0x59, bit: 1, label: "Bonus Room 1" },
                            { offset: 0x59, bit: 2, label: "Bonus Room 2" },
                            { offset: 0x59, bit: 3, label: "Bonus Room 3", hidden: true },
                            { offset: 0x59, bit: 4, label: "Bonus Room 4", hidden: true },
                            { offset: 0x59, bit: 5, label: "Bonus Room 5", hidden: true },
                            { offset: 0x59, bit: 6, label: "Bonus Room 6", hidden: true },
                          ],
                        },
                      ],
                    },
                    {
                      type: "section",
                      items: [
                        {
                          id: "progression-cleared-229",
                          name: "Boss Dumb Drum",
                          offset: 0xfb,
                          type: "variable",
                          dataType: "uint8",
                          resource: "progressions",
                        },
                      ],
                    },
                    {
                      type: "section",
                      hidden: true,
                      items: [
                        {
                          name: "Kremkroc Industries Inc.",
                          offset: 0xff,
                          type: "variable",
                          dataType: "uint8",
                          resource: "progressions",
                        },
                      ],
                    },
                  ],
                },
                {
                  name: "Chimp Caverns",
                  flex: true,
                  items: [
                    {
                      type: "section",
                      items: [
                        {
                          id: "progression-cleared-50",
                          name: "Tanked Up Trouble",
                          offset: 0x48,
                          type: "variable",
                          dataType: "uint8",
                          resource: "progressions",
                        },
                        {
                          id: "progression-bonusRooms-50",
                          type: "bitflags",
                          flags: [
                            { offset: 0x48, bit: 1, label: "Bonus Room 1" },
                            { offset: 0x48, bit: 2, label: "Bonus Room 2", hidden: true },
                            { offset: 0x48, bit: 3, label: "Bonus Room 3", hidden: true },
                            { offset: 0x48, bit: 4, label: "Bonus Room 4", hidden: true },
                            { offset: 0x48, bit: 5, label: "Bonus Room 5", hidden: true },
                            { offset: 0x48, bit: 6, label: "Bonus Room 6", hidden: true },
                          ],
                        },
                      ],
                    },
                    {
                      type: "section",
                      items: [
                        {
                          id: "progression-cleared-20",
                          name: "Manic Mincers",
                          offset: 0x2a,
                          type: "variable",
                          dataType: "uint8",
                          resource: "progressions",
                        },
                        {
                          id: "progression-bonusRooms-20",
                          type: "bitflags",
                          flags: [
                            { offset: 0x2a, bit: 1, label: "Bonus Room 1" },
                            { offset: 0x2a, bit: 2, label: "Bonus Room 2" },
                            { offset: 0x2a, bit: 3, label: "Bonus Room 3", hidden: true },
                            { offset: 0x2a, bit: 4, label: "Bonus Room 4", hidden: true },
                            { offset: 0x2a, bit: 5, label: "Bonus Room 5", hidden: true },
                            { offset: 0x2a, bit: 6, label: "Bonus Room 6", hidden: true },
                          ],
                        },
                      ],
                    },
                    {
                      type: "section",
                      items: [
                        {
                          id: "progression-cleared-12",
                          name: "Misty Mine",
                          offset: 0x22,
                          type: "variable",
                          dataType: "uint8",
                          resource: "progressions",
                        },
                        {
                          id: "progression-bonusRooms-12",
                          type: "bitflags",
                          flags: [
                            { offset: 0x22, bit: 1, label: "Bonus Room 1" },
                            { offset: 0x22, bit: 2, label: "Bonus Room 2" },
                            { offset: 0x22, bit: 3, label: "Bonus Room 3", hidden: true },
                            { offset: 0x22, bit: 4, label: "Bonus Room 4", hidden: true },
                            { offset: 0x22, bit: 5, label: "Bonus Room 5", hidden: true },
                            { offset: 0x22, bit: 6, label: "Bonus Room 6", hidden: true },
                          ],
                        },
                      ],
                    },
                    {
                      type: "section",
                      items: [
                        {
                          id: "progression-cleared-56",
                          name: "Loppy Lights",
                          offset: 0x4e,
                          type: "variable",
                          dataType: "uint8",
                          resource: "progressions",
                        },
                        {
                          id: "progression-bonusRooms-56",
                          type: "bitflags",
                          flags: [
                            { offset: 0x4e, bit: 1, label: "Bonus Room 1" },
                            { offset: 0x4e, bit: 2, label: "Bonus Room 2" },
                            { offset: 0x4e, bit: 3, label: "Bonus Room 3", hidden: true },
                            { offset: 0x4e, bit: 4, label: "Bonus Room 4", hidden: true },
                            { offset: 0x4e, bit: 5, label: "Bonus Room 5", hidden: true },
                            { offset: 0x4e, bit: 6, label: "Bonus Room 6", hidden: true },
                          ],
                        },
                      ],
                    },
                    {
                      type: "section",
                      items: [
                        {
                          id: "progression-cleared-45",
                          name: "Platform Perils",
                          offset: 0x43,
                          type: "variable",
                          dataType: "uint8",
                          resource: "progressions",
                        },
                        {
                          id: "progression-bonusRooms-45",
                          type: "bitflags",
                          flags: [
                            { offset: 0x43, bit: 1, label: "Bonus Room 1" },
                            { offset: 0x43, bit: 2, label: "Bonus Room 2" },
                            { offset: 0x43, bit: 3, label: "Bonus Room 3", hidden: true },
                            { offset: 0x43, bit: 4, label: "Bonus Room 4", hidden: true },
                            { offset: 0x43, bit: 5, label: "Bonus Room 5", hidden: true },
                            { offset: 0x43, bit: 6, label: "Bonus Room 6", hidden: true },
                          ],
                        },
                      ],
                    },
                    {
                      type: "section",
                      items: [
                        {
                          id: "progression-cleared-230",
                          name: "Necky's Revenge",
                          offset: 0xfc,
                          type: "variable",
                          dataType: "uint8",
                          resource: "progressions",
                        },
                      ],
                    },
                    {
                      type: "section",
                      hidden: true,
                      items: [
                        {
                          name: "Chimp Caverns",
                          offset: 0xfe,
                          type: "variable",
                          dataType: "uint8",
                          resource: "progressions",
                        },
                      ],
                    },
                  ],
                },
                {
                  name: "Gang-Plank Galleon",
                  flex: true,
                  items: [
                    {
                      id: "progression-cleared-96",
                      name: "Gang-Plank Galleon",
                      offset: 0x76,
                      type: "variable",
                      dataType: "uint8",
                      resource: "progressions",
                    },
                    {
                      name: "Gang-Plank Galleon",
                      offset: 0x80,
                      type: "variable",
                      dataType: "uint8",
                      resource: "progressions",
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
          name: "Options",
          items: [
            {
              id: "language",
              name: "Language",
              offset: 0x0,
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
    languages: {
      0x0: "English",
      0x1: "French",
      0x2: "German",
    },
    levels: {
      0x16: "Jungle Hijinxs",
      0xfa: "Kongo Jungle",
      0xfb: "Monkey Mines",
      0xfc: "Gorilla Glacier",
      0xfd: "Kremkroc Industries Inc.",
      0xfe: "Chimp Caverns",
      0xff: "Vine Valley",
    },
    modes: {
      0x0: "One player",
      0x1: "Two player team",
      0x2: "Two player contest",
    },
    progressions: {
      0x0: "-",
      0x1: "Donkey Kong",
      0x81: "Diddy Kong",
    },
  },
  resourcesOrder: {
    levels: [0x16, 0xfa, 0xfb, 0xff, 0xfc, 0xfd, 0xfe],
  },
};

export default template;
