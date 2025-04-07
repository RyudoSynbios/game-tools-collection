import type { GameJson } from "$lib/types";

const template: GameJson = {
  validator: {
    regions: {
      europe: {
        $or: [
          { 0x100: [0x4b, 0x48, 0x4a, 0x43] }, // "KHJC"
          { 0x2c0: [0x4b, 0x48, 0x4a, 0x43] }, // "KHJC"
          { 0x480: [0x4b, 0x48, 0x4a, 0x43] }, // "KHJC"
          { 0x640: [0x4b, 0x48, 0x4a, 0x43] }, // "KHJC"
        ],
      },
      usa_japan: {
        $or: [
          { 0x100: [0x4b, 0x48, 0x4a, 0x43] }, // "KHJC"
          { 0x2c0: [0x4b, 0x48, 0x4a, 0x43] }, // "KHJC"
          { 0x480: [0x4b, 0x48, 0x4a, 0x43] }, // "KHJC"
          { 0x640: [0x4b, 0x48, 0x4a, 0x43] }, // "KHJC"
        ],
      },
      australia: {
        $or: [
          { 0x100: [0x4b, 0x48, 0x4a, 0x43] }, // "KHJC"
          { 0x2c0: [0x4b, 0x48, 0x4a, 0x43] }, // "KHJC"
          { 0x480: [0x4b, 0x48, 0x4a, 0x43] }, // "KHJC"
          { 0x640: [0x4b, 0x48, 0x4a, 0x43] }, // "KHJC"
        ],
      },
    },
    text: "Drag 'n' drop here or click to add a save file.",
    hint: "If you're having trouble loading a save file from an Everdrive cartridge, please see the FAQ.",
    error: "Not a valid save file.",
  },
  items: [
    {
      id: "slots",
      length: 0x1c0,
      type: "container",
      instanceType: "tabs",
      instances: 3,
      enumeration: "Slot %d",
      appendSubinstance: [
        {
          name: "Replay",
          items: [
            {
              id: "extra",
              name: "Checksum",
              offset: 0x78,
              type: "checksum",
              dataType: "uint64",
              bigEndian: true,
              control: {
                offsetStart: 0x0,
                offsetEnd: 0x78,
              },
            },
            {
              type: "section",
              flex: true,
              items: [
                {
                  id: "extra",
                  name: "Mini-Games",
                  type: "bitflags",
                  flags: [
                    { offset: 0x6, bit: 3, label: "Mayan Kickball (Quarterfinal)" }, // prettier-ignore
                    { offset: 0x6, bit: 4, label: "Mayan Kickball (Semifinal)" }, // prettier-ignore
                    { offset: 0x6, bit: 5, label: "Mayan Kickball (Final)" }, // prettier-ignore
                    { offset: 0x6, bit: 6, label: "Ordnance Storage" }, // prettier-ignore
                    { offset: 0x6, bit: 7, label: "Dodgems Challenge (1-on-1)" }, // prettier-ignore
                    { offset: 0x7, bit: 0, label: "Dodgems Challenge (2-on-1)" }, // prettier-ignore
                    { offset: 0x7, bit: 1, label: "Dodgems Challenge (3-on-1)" }, // prettier-ignore
                    { offset: 0x7, bit: 2, label: "Hoop Hurry Challenge" }, // prettier-ignore
                    { offset: 0x7, bit: 3, label: "Balloon Burst Challenge" }, // prettier-ignore
                    { offset: 0x7, bit: 4, label: "Saucer of Peril Ride" }, // prettier-ignore
                    { offset: 0x7, bit: 5, label: "Mini-sub Challenge" }, // prettier-ignore
                    { offset: 0x7, bit: 6, label: "Chompa's Belly" }, // prettier-ignore
                    { offset: 0x7, bit: 7, label: "Clinker's Cavern" }, // prettier-ignore
                    { offset: 0x8, bit: 0, label: "Twinklies Packing" }, // prettier-ignore
                    { offset: 0x8, bit: 1, label: "Colosseum Kickball (Quarterfinal)" }, // prettier-ignore
                    { offset: 0x8, bit: 2, label: "Colosseum Kickball (Semifinal)" }, // prettier-ignore
                    { offset: 0x8, bit: 3, label: "Colosseum Kickball (Final)" }, // prettier-ignore
                    { offset: 0x8, bit: 4, label: "Pot O'Gold" }, // prettier-ignore
                    { offset: 0x8, bit: 5, label: "Trash can Germs" }, // prettier-ignore
                    { offset: 0x8, bit: 6, label: "Zubbas' Hive" }, // prettier-ignore
                    { offset: 0x8, bit: 7, label: "Tower of Tragedy Quiz (Round 1)" }, // prettier-ignore
                    { offset: 0x9, bit: 0, label: "Tower of Tragedy Quiz (Round 2)" }, // prettier-ignore
                    { offset: 0x9, bit: 1, label: "Tower of Tragedy Quiz (Round 3)" }, // prettier-ignore
                  ],
                },
                {
                  id: "extra",
                  name: "Bosses",
                  type: "bitflags",
                  flags: [
                    { offset: 0x3, bit: 0, label: "Klungo 1" }, // prettier-ignore
                    { offset: 0x3, bit: 1, label: "Klungo 2" }, // prettier-ignore
                    { offset: 0x3, bit: 2, label: "Klungo 3" }, // prettier-ignore
                    { offset: 0x3, bit: 3, label: "Targitzan" }, // prettier-ignore
                    { offset: 0x3, bit: 4, label: "Old King Coal" }, // prettier-ignore
                    { offset: 0x3, bit: 5, label: "Mr. Patch" }, // prettier-ignore
                    { offset: 0x3, bit: 6, label: "Lord Woo Fak Fak" }, // prettier-ignore
                    { offset: 0x3, bit: 7, label: "Terry" }, // prettier-ignore
                    { offset: 0x4, bit: 0, label: "Weldar" }, // prettier-ignore
                    { offset: 0x4, bit: 1, label: "Chilly Willy" }, // prettier-ignore
                    { offset: 0x4, bit: 2, label: "Chilli Billi" }, // prettier-ignore
                    { offset: 0x4, bit: 3, label: "Mingy Jongo" }, // prettier-ignore
                    { offset: 0x4, bit: 4, label: "Hag 1" }, // prettier-ignore
                  ],
                },
                {
                  id: "extra",
                  name: "Cinema",
                  type: "bitflags",
                  flags: [
                    { offset: 0x9, bit: 2, label: "Opening Story" }, // prettier-ignore
                    { offset: 0x9, bit: 3, label: "King Jingaling gets zapped" }, // prettier-ignore
                    { offset: 0x9, bit: 4, label: "Bottles and Jingaling Restored" }, // prettier-ignore
                    { offset: 0x9, bit: 5, label: "Grunty Defeated" }, // prettier-ignore
                    { offset: 0x9, bit: 6, label: "Credits" }, // prettier-ignore
                    { offset: 0x9, bit: 7, label: "Character Parade" }, // prettier-ignore
                  ],
                },
                {
                  id: "extra",
                  name: "Miscellaneous",
                  type: "bitflags",
                  flags: [
                    { offset: 0xb, bit: 0, label: "???", hidden: true }, // prettier-ignore
                    { offset: 0xb, bit: 1, label: "???", hidden: true }, // prettier-ignore
                    { offset: 0xb, bit: 2, label: "???", hidden: true }, // prettier-ignore
                    { offset: 0xb, bit: 3, label: "Jingo Playable in Multiplayer" }, // prettier-ignore
                  ],
                },
                {
                  id: "extra",
                  name: "Unknown 18",
                  offset: 0x18,
                  type: "variable",
                  dataType: "uint8",
                  hidden: true,
                },
                {
                  id: "extra",
                  name: "Unknown 27",
                  offset: 0x27,
                  type: "variable",
                  dataType: "uint8",
                  hidden: true,
                },
                {
                  id: "extra",
                  name: "Unknown 28",
                  offset: 0x28,
                  type: "variable",
                  dataType: "uint8",
                  hidden: true,
                },
              ],
            },
          ],
        },
        {
          name: "Settings",
          flex: true,
          items: [
            {
              id: "extra",
              name: "Wide-screen Mode",
              offset: 0x1,
              type: "variable",
              dataType: "bit",
              bit: 1,
              resource: "optionBoolean",
            },
            {
              id: "extra",
              name: "Speaker Mode",
              offset: 0x2,
              type: "variable",
              dataType: "uint8",
              binary: {
                bitStart: 6,
                bitLength: 2,
              },
              resource: "speakerModes",
            },
            {
              id: "extra-screenScale",
              name: "Screen Alignment/Scale",
              offset: 0xd,
              type: "variable",
              dataType: "uint16",
              bigEndian: true,
              // resource: "languages",
              hidden: true,
            },
            {
              id: "extra-language",
              name: "Language",
              offset: 0xb,
              type: "variable",
              dataType: "uint8",
              resource: "languages",
              binary: {
                bitStart: 5,
                bitLength: 2,
              },
            },
          ],
        },
      ],
      items: [
        {
          name: "Checksum",
          offset: 0x1b8,
          type: "checksum",
          dataType: "uint64",
          bigEndian: true,
          control: {
            offsetStart: 0x0,
            offsetEnd: 0x1b8,
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
                      name: "Slot",
                      offset: 0xa,
                      type: "variable",
                      dataType: "uint8",
                      hidden: true,
                    },
                    {
                      name: "Missing Pages",
                      offset: 0x3f,
                      type: "variable",
                      dataType: "uint16",
                      bigEndian: true,
                      max: 25,
                    },
                    {
                      name: "Burgers",
                      offset: 0x41,
                      type: "variable",
                      dataType: "uint16",
                      bigEndian: true,
                      hidden: true,
                    },
                    {
                      name: "Fries",
                      offset: 0x43,
                      type: "variable",
                      dataType: "uint16",
                      bigEndian: true,
                      hidden: true,
                    },
                    {
                      name: "???",
                      offset: 0x35,
                      type: "variable",
                      dataType: "uint16",
                      bigEndian: true,
                      hidden: true,
                    },
                    {
                      name: "Extra Honeycombs",
                      offset: 0x3d,
                      type: "variable",
                      dataType: "uint16",
                      bigEndian: true,
                      // max: 999,
                    },
                    {
                      name: "Doubloons",
                      offset: 0x47,
                      type: "variable",
                      dataType: "uint16",
                      bigEndian: true,
                      // max: 999,
                    },
                    {
                      name: "Purple Things",
                      offset: 0x4b,
                      type: "variable",
                      dataType: "uint16",
                      bigEndian: true,
                      hidden: true,
                    },
                    {
                      name: "Fishs",
                      offset: 0x4d,
                      type: "variable",
                      dataType: "uint16",
                      bigEndian: true,
                      hidden: true,
                    },
                    {
                      name: "Ice Key",
                      offset: 0x51,
                      type: "variable",
                      dataType: "uint16",
                      bigEndian: true,
                      max: 1,
                    },
                    {
                      name: "Glowbos",
                      offset: 0x3b,
                      type: "variable",
                      dataType: "uint16",
                      bigEndian: true,
                    },
                    {
                      name: "Mega Glowbos",
                      offset: 0x53,
                      type: "variable",
                      dataType: "uint16",
                      bigEndian: true,
                      max: 1,
                    },
                    {
                      name: "Location related?",
                      offset: 0x55,
                      type: "variable",
                      dataType: "uint16",
                      bigEndian: true,
                      hidden: true,
                    },
                    {
                      name: "???",
                      offset: 0x57,
                      type: "variable",
                      dataType: "uint16",
                      bigEndian: true,
                      hidden: true,
                    },
                    {
                      name: "???",
                      offset: 0x59,
                      type: "variable",
                      dataType: "uint16",
                      bigEndian: true,
                      hidden: true,
                    },
                    {
                      name: "???",
                      offset: 0x5b,
                      type: "variable",
                      dataType: "uint16",
                      bigEndian: true,
                      hidden: true,
                    },
                    {
                      name: "???",
                      offset: 0x5d,
                      type: "variable",
                      dataType: "uint16",
                      bigEndian: true,
                      hidden: true,
                    },
                    {
                      name: "???",
                      offset: 0x5f,
                      type: "variable",
                      dataType: "uint16",
                      bigEndian: true,
                      hidden: true,
                    },
                    {
                      name: "???",
                      offset: 0x61,
                      type: "variable",
                      dataType: "uint16",
                      bigEndian: true,
                      hidden: true,
                    },
                    {
                      name: "???",
                      offset: 0x63,
                      type: "variable",
                      dataType: "uint16",
                      bigEndian: true,
                      hidden: true,
                    },
                    {
                      name: "???",
                      offset: 0x65,
                      type: "variable",
                      dataType: "uint16",
                      bigEndian: true,
                      hidden: true,
                    },
                    {
                      name: "Sea Bottom Cavern Score",
                      offset: 0x67,
                      type: "variable",
                      dataType: "uint16",
                      bigEndian: true,
                    },
                    {
                      name: "???",
                      offset: 0x69,
                      type: "variable",
                      dataType: "uint16",
                      bigEndian: true,
                      hidden: true,
                    },
                    {
                      name: "???",
                      offset: 0x6b,
                      type: "variable",
                      dataType: "uint16",
                      bigEndian: true,
                      hidden: true,
                    },
                    {
                      name: "???",
                      offset: 0x6d,
                      type: "variable",
                      dataType: "uint16",
                      bigEndian: true,
                      hidden: true,
                    },
                    {
                      name: "???",
                      offset: 0x6f,
                      type: "variable",
                      dataType: "uint16",
                      bigEndian: true,
                      hidden: true,
                    },
                    {
                      name: "???",
                      offset: 0x71,
                      type: "variable",
                      dataType: "uint16",
                      bigEndian: true,
                      hidden: true,
                    },
                    {
                      name: "???",
                      offset: 0x73,
                      type: "variable",
                      dataType: "uint16",
                      bigEndian: true,
                      hidden: true,
                    },
                    {
                      name: "???",
                      offset: 0x75,
                      type: "variable",
                      dataType: "uint16",
                      bigEndian: true,
                      hidden: true,
                    },
                    {
                      name: "???",
                      offset: 0x77,
                      type: "variable",
                      dataType: "uint16",
                      bigEndian: true,
                      hidden: true,
                    },
                    {
                      name: "???",
                      offset: 0x79,
                      type: "variable",
                      dataType: "uint16",
                      bigEndian: true,
                      hidden: true,
                    },
                    {
                      name: "???",
                      offset: 0x7b,
                      type: "variable",
                      dataType: "uint16",
                      bigEndian: true,
                      hidden: true,
                    },
                    {
                      name: "???",
                      offset: 0x7d,
                      type: "variable",
                      dataType: "uint16",
                      bigEndian: true,
                      hidden: true,
                    },
                    {
                      name: "Jinjo Seed",
                      offset: 0xed,
                      type: "variable",
                      dataType: "uint16",
                      binary: {
                        bitStart: 3,
                        bitLength: 6,
                      },
                      disabled: true,
                    },
                  ],
                },
                {
                  type: "section",
                  flex: true,
                  items: [
                    {
                      name: "Eggs",
                      offset: 0x2b,
                      type: "variable",
                      dataType: "uint16",
                      bigEndian: true,
                      max: 999,
                    },
                    {
                      name: "Fire Eggs",
                      offset: 0x2d,
                      type: "variable",
                      dataType: "uint16",
                      bigEndian: true,
                      max: 999,
                    },
                    {
                      name: "Ice Eggs",
                      offset: 0x2f,
                      type: "variable",
                      dataType: "uint16",
                      bigEndian: true,
                      max: 999,
                    },
                    {
                      name: "Grenade Eggs",
                      offset: 0x31,
                      type: "variable",
                      dataType: "uint16",
                      bigEndian: true,
                      max: 999,
                    },
                    {
                      name: "Clockwork Kazooie Eggs",
                      offset: 0x33,
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
                      name: "Red Feathers",
                      offset: 0x37,
                      type: "variable",
                      dataType: "uint16",
                      bigEndian: true,
                      max: 999,
                    },
                    {
                      name: "Gold Feathers",
                      offset: 0x39,
                      type: "variable",
                      dataType: "uint16",
                      bigEndian: true,
                      max: 999,
                    },
                  ],
                },
              ],
            },
            {
              name: "Levels",
              items: [
                {
                  type: "tabs",
                  vertical: true,
                  items: [
                    {
                      name: "Spiral Mountain",
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
                                      name: "Playtime",
                                      type: "group",
                                      mode: "time",
                                      items: [
                                        {
                                          offset: 0x17,
                                          type: "variable",
                                          dataType: "uint16",
                                          bigEndian: true,
                                          operations: [
                                            {
                                              convert: {
                                                from: "seconds",
                                                to: "hours",
                                              },
                                            },
                                          ],
                                          max: 17,
                                        },
                                        {
                                          offset: 0x17,
                                          type: "variable",
                                          dataType: "uint16",
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
                                          offset: 0x17,
                                          type: "variable",
                                          dataType: "uint16",
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
                                  ],
                                },
                                {
                                  type: "section",
                                  flex: true,
                                  items: [
                                    {
                                      name: "Jinjos",
                                      type: "bitflags",
                                      flags: [
                                        { offset: 0xc2, bit: 2, label: "<b>Main</b>: Behind an underwater boulder" }, // prettier-ignore
                                      ],
                                    },
                                    {
                                      name: "Cheato Pages",
                                      type: "bitflags",
                                      flags: [
                                        { offset: 0xdc, bit: 5, label: "<b>Main</b>: Near Shock Jump Spring" }, // prettier-ignore
                                      ],
                                    },
                                  ],
                                },
                              ],
                            },
                            {
                              name: "Miscellaneous",
                              items: [
                                {
                                  name: "Events",
                                  type: "bitflags",
                                  flags: [
                                    { offset: 0xb6, bit: 1, label: "Extra Bubbles", }, // prettier-ignore
                                    { offset: 0xa5, bit: 5, label: "Swim Faster learned", }, // prettier-ignore
                                  ],
                                },
                              ],
                            },
                          ],
                        },
                      ],
                    },
                    {
                      name: "Isle O' Hags",
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
                                      name: "Playtime",
                                      type: "group",
                                      mode: "time",
                                      items: [
                                        {
                                          offset: 0x25,
                                          type: "variable",
                                          dataType: "uint16",
                                          bigEndian: true,
                                          operations: [
                                            {
                                              convert: {
                                                from: "seconds",
                                                to: "hours",
                                              },
                                            },
                                          ],
                                          max: 17,
                                        },
                                        {
                                          offset: 0x25,
                                          type: "variable",
                                          dataType: "uint16",
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
                                          offset: 0x25,
                                          type: "variable",
                                          dataType: "uint16",
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
                                  ],
                                },
                                {
                                  type: "section",
                                  flex: true,
                                  items: [
                                    {
                                      name: "Jiggies",
                                      type: "bitflags",
                                      flags: [
                                        { offset: 0xd3, bit: 3, label: "<b>Throne Room</b>: Given by King Jingaling" }, // prettier-ignore
                                        { offset: 0xd2, bit: 2, label: "<b>Jinjo Village</b>: White Jinjo family completed" }, // prettier-ignore
                                        { offset: 0xd2, bit: 3, label: "<b>???</b>: ???", hidden: true }, // prettier-ignore
                                        { offset: 0xd2, bit: 4, label: "<b>???</b>: ???", hidden: true }, // prettier-ignore
                                        { offset: 0xd2, bit: 5, label: "<b>???</b>: ???", hidden: true }, // prettier-ignore
                                        { offset: 0xd2, bit: 6, label: "<b>???</b>: ???", hidden: true }, // prettier-ignore
                                        { offset: 0xd2, bit: 7, label: "<b>???</b>: ???", hidden: true }, // prettier-ignore
                                        { offset: 0xd3, bit: 0, label: "<b>???</b>: ???", hidden: true }, // prettier-ignore
                                        { offset: 0xd3, bit: 1, label: "<b>???</b>: ???", hidden: true }, // prettier-ignore
                                        { offset: 0xd3, bit: 2, label: "<b>???</b>: ???", hidden: true }, // prettier-ignore
                                      ],
                                    },
                                    {
                                      name: "Extra Honeycombs",
                                      type: "bitflags",
                                      flags: [
                                        { offset: 0xc5, bit: 4, label: "<b>Plateau</b>: Under Honey B's Hive" }, // prettier-ignore
                                      ],
                                    },
                                    {
                                      name: "Special Moves",
                                      type: "bitflags",
                                      flags: [
                                        { offset: 0xa5, bit: 1, label: "<b>Plateau</b>: Fire Eggs" }, // prettier-ignore
                                        { offset: 0xa5, bit: 2, label: "<b>Pine Grove</b>: Grenade Eggs" }, // prettier-ignore
                                        { offset: 0xa5, bit: 4, label: "<b>Cliff Top</b>: Ice Egg" }, // prettier-ignore
                                        { offset: 0xa5, bit: 3, label: "<b>Wasteland</b>: Clockwork Kazooie Eggs" }, // prettier-ignore
                                      ],
                                    },
                                    {
                                      name: "Jinjos",
                                      type: "bitflags",
                                      flags: [
                                        { offset: 0xc1, bit: 6, label: "<b>Wooded Hollow</b>: Near Jiggywiggy's Temple" }, // prettier-ignore
                                        { offset: 0xc2, bit: 1, label: "<b>Plateau</b>: Inside a boulder" }, // prettier-ignore
                                        { offset: 0xc2, bit: 0, label: "<b>Cliff Top</b>: Using a Claw Clamber Boots" }, // prettier-ignore
                                        { offset: 0xc1, bit: 7, label: "<b>Wasteland</b>: Next to a Minjo" }, // prettier-ignore
                                      ],
                                    },
                                    {
                                      name: "Glowbos",
                                      type: "bitflags",
                                      flags: [
                                        { offset: 0xc8, bit: 1, label: "<b>Cliff Top</b>: Above the Hailfire Peaks entrance" }, // prettier-ignore
                                      ],
                                    },
                                    {
                                      name: "Notes",
                                      type: "bitflags",
                                      flags: [
                                        { offset: 0x11b, bit: 1, label: "<b>Jinjo Village</b>: Treble Clef" }, // prettier-ignore
                                        { offset: 0x119, bit: 1, label: "<b>Plateau</b>: Above the sign" }, // prettier-ignore
                                        { offset: 0x119, bit: 2, label: "<b>Plateau</b>: Above the sign" }, // prettier-ignore
                                        { offset: 0x119, bit: 3, label: "<b>Plateau</b>: Below B's Hive" }, // prettier-ignore
                                        { offset: 0x119, bit: 4, label: "<b>Plateau</b>: Below B's Hive" }, // prettier-ignore
                                        { offset: 0x119, bit: 5, label: "<b>Pine Grove</b>: Inside a log car" }, // prettier-ignore
                                        { offset: 0x119, bit: 6, label: "<b>Pine Grove</b>: Inside a log car" }, // prettier-ignore
                                        { offset: 0x119, bit: 7, label: "<b>Pine Grove</b>: Inside a log car" }, // prettier-ignore
                                        { offset: 0x11a, bit: 0, label: "<b>Pine Grove</b>: Inside a log car" }, // prettier-ignore
                                        { offset: 0x11a, bit: 1, label: "<b>Cliff Top</b>: Around the Hailfire Peaks entrance" }, // prettier-ignore
                                        { offset: 0x11a, bit: 2, label: "<b>Cliff Top</b>: Around the Hailfire Peaks entrance" }, // prettier-ignore
                                        { offset: 0x11a, bit: 3, label: "<b>Cliff Top</b>: Around the Hailfire Peaks entrance" }, // prettier-ignore
                                        { offset: 0x11a, bit: 4, label: "<b>Cliff Top</b>: Around the Hailfire Peaks entrance" }, // prettier-ignore
                                        { offset: 0x11a, bit: 5, label: "<b>Wasteland</b>: Near the Minjo" }, // prettier-ignore
                                        { offset: 0x11a, bit: 6, label: "<b>Wasteland</b>: Near the Minjo" }, // prettier-ignore
                                        { offset: 0x11a, bit: 7, label: "<b>Wasteland</b>: Near the Cloud Cuckooland entrance" }, // prettier-ignore
                                        { offset: 0x11b, bit: 0, label: "<b>Wasteland</b>: Near the Cloud Cuckooland entrance" }, // prettier-ignore
                                      ],
                                    },
                                  ],
                                },
                              ],
                            },
                            {
                              name: "Miscellaneous",
                              items: [
                                {
                                  name: "Events",
                                  type: "bitflags",
                                  flags: [
                                    { offset: 0xa5, bit: 0, label: "<b>Bottles' House</b>: Amaze-O-Gaze Glasses obtained" }, // prettier-ignore
                                    { offset: 0xa5, bit: 7, label: "<b>Heggy's Egg Shed</b>: Breegull Bash learned" }, // prettier-ignore
                                  ],
                                },
                                {
                                  name: "Silos",
                                  type: "bitflags",
                                  flags: [
                                    { offset: 0xe3, bit: 7, label: "Jinjo Village" }, // prettier-ignore
                                    { offset: 0xe4, bit: 0, label: "Wooded Hollow" }, // prettier-ignore
                                    { offset: 0xe4, bit: 1, label: "Plateau" }, // prettier-ignore
                                    { offset: 0xe4, bit: 2, label: "Pine Grove" }, // prettier-ignore
                                    { offset: 0xe4, bit: 3, label: "Cliff Top" }, // prettier-ignore
                                    { offset: 0xe4, bit: 4, label: "Wasteland" }, // prettier-ignore
                                    { offset: 0xe4, bit: 5, label: "Quagmire" }, // prettier-ignore
                                  ],
                                },
                                {
                                  name: "Jiggywiggy's Challenges",
                                  offset: 0xe9,
                                  type: "variable",
                                  dataType: "uint16",
                                  binary: {
                                    bitStart: 6,
                                    bitLength: 4,
                                  },
                                  max: 10,
                                },
                              ],
                            },
                          ],
                        },
                      ],
                    },
                    {
                      name: "Mayahem Temple",
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
                                      name: "Playtime",
                                      type: "group",
                                      mode: "time",
                                      items: [
                                        {
                                          offset: 0x11,
                                          type: "variable",
                                          dataType: "uint16",
                                          bigEndian: true,
                                          operations: [
                                            {
                                              convert: {
                                                from: "seconds",
                                                to: "hours",
                                              },
                                            },
                                          ],
                                          max: 17,
                                        },
                                        {
                                          offset: 0x11,
                                          type: "variable",
                                          dataType: "uint16",
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
                                          offset: 0x11,
                                          type: "variable",
                                          dataType: "uint16",
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
                                  ],
                                },
                                {
                                  type: "section",
                                  flex: true,
                                  items: [
                                    {
                                      name: "Jiggies",
                                      type: "bitflags",
                                      flags: [
                                        { offset: 0xc8, bit: 4, label: "<b>Main</b>: Kickball Tournament won" }, // prettier-ignore
                                        { offset: 0xc8, bit: 5, label: "<b>Main</b>: Bovina's corn field saved" }, // prettier-ignore
                                        { offset: 0xc9, bit: 2, label: "<b>Main</b>: At the top of Targitzan's Temple" }, // prettier-ignore
                                        { offset: 0xc8, bit: 6, label: "<b>Treasure Chamber</b>: Sacred Relic returned" }, // prettier-ignore
                                        { offset: 0xc9, bit: 0, label: "<b>Compound Prison</b>: Behind the quicksand" }, // prettier-ignore
                                        { offset: 0xc9, bit: 1, label: "<b>Compound Prison</b>: At the top of the columns" }, // prettier-ignore
                                        { offset: 0xc8, bit: 7, label: "<b>Jade Snake Grove</b>: High above the ground with Golden Goliath" }, // prettier-ignore
                                        { offset: 0xc9, bit: 3, label: "<b>Jade Snake Grove</b>: Stolen from Ssslumber" }, // prettier-ignore
                                        { offset: 0xc8, bit: 3, label: "<b>Targitzan's Slighty Sacred Chamber</b>: At the center of the chamber" }, // prettier-ignore
                                        { offset: 0xc8, bit: 2, label: "<b>Targitzan's Really Sacred Chamber</b>: Targitzan defeated" }, // prettier-ignore
                                      ],
                                    },
                                    {
                                      name: "Jinjos",
                                      type: "bitflags",
                                      flags: [
                                        { offset: 0xbd, bit: 1, label: "<b>Main</b>: In the lake" }, // prettier-ignore
                                        { offset: 0xbd, bit: 2, label: "<b>Main</b>: On the bridge" }, // prettier-ignore
                                        { offset: 0xbc, bit: 7, label: "<b>Main</b>: Above the Kickball Stadium" }, // prettier-ignore
                                        { offset: 0xbc, bit: 6, label: "<b>Jade Snake Grove</b>: Above Jamjars' silo" }, // prettier-ignore
                                        { offset: 0xbd, bit: 0, label: "<b>Targitzan's Temple</b>: Above the Sacred Chambers" }, // prettier-ignore
                                      ],
                                    },
                                    {
                                      name: "Glowbos",
                                      type: "bitflags",
                                      flags: [
                                        { offset: 0xc6, bit: 1, label: "<b>Mumbo's skull</b>: At the entrance" }, // prettier-ignore
                                        { offset: 0xc6, bit: 2, label: "<b>Jade Snake Grove</b>: Behind Wumba's Wigwam" }, // prettier-ignore
                                      ],
                                    },
                                    {
                                      name: "Cheato Pages",
                                      type: "bitflags",
                                      flags: [
                                        { offset: 0xd9, bit: 5, label: "<b>Main</b>: At the top of the Treasure Chamber" }, // prettier-ignore
                                        { offset: 0xd9, bit: 6, label: "<b>Compound Prison</b>: At the right of the Code Chamber" }, // prettier-ignore
                                        { offset: 0xd9, bit: 7, label: "<b>Jade Snake Grove</b>: Above the columns" }, // prettier-ignore
                                      ],
                                    },
                                    {
                                      name: "Notes",
                                      type: "bitflags",
                                      flags: [
                                        { offset: 0x108, bit: 1, label: "<b>Main</b>: On the main path" }, // prettier-ignore
                                        { offset: 0x108, bit: 2, label: "<b>Main</b>: On the main path" }, // prettier-ignore
                                        { offset: 0x108, bit: 3, label: "<b>Main</b>: On the main path" }, // prettier-ignore
                                        { offset: 0x108, bit: 4, label: "<b>Main</b>: On the main path" }, // prettier-ignore
                                        { offset: 0x108, bit: 5, label: "<b>Main</b>: On the main path" }, // prettier-ignore
                                        { offset: 0x108, bit: 6, label: "<b>Main</b>: On the main path" }, // prettier-ignore
                                        { offset: 0x108, bit: 7, label: "<b>Main</b>: On the main path" }, // prettier-ignore
                                        { offset: 0x109, bit: 0, label: "<b>Main</b>: On the main path" }, // prettier-ignore
                                        { offset: 0x109, bit: 1, label: "<b>Main</b>: On the main path" }, // prettier-ignore
                                        { offset: 0x109, bit: 2, label: "<b>Main</b>: On the main path" }, // prettier-ignore
                                        { offset: 0x109, bit: 3, label: "<b>Main</b>: On the main path" }, // prettier-ignore
                                        { offset: 0x109, bit: 4, label: "<b>Main</b>: On the main path" }, // prettier-ignore
                                        { offset: 0x109, bit: 5, label: "<b>Main</b>: On the main path" }, // prettier-ignore
                                        { offset: 0x109, bit: 6, label: "<b>Main</b>: On the main path" }, // prettier-ignore
                                        { offset: 0x109, bit: 7, label: "<b>Main</b>: On the main path" }, // prettier-ignore
                                        { offset: 0x10a, bit: 0, label: "<b>Main</b>: On the main path" }, // prettier-ignore
                                        { offset: 0x10a, bit: 1, label: "<b>Main</b>: Treble Clef" }, // prettier-ignore
                                      ],
                                    },
                                    {
                                      name: "Extra Honeycombs",
                                      type: "bitflags",
                                      flags: [
                                        { offset: 0xc2, bit: 4, label: "<b>Main</b>: In a small alcove at the entrance" }, // prettier-ignore
                                        { offset: 0xc2, bit: 5, label: "<b>Main</b>: Above Bonvina's corn field" }, // prettier-ignore
                                        { offset: 0xc2, bit: 6, label: "<b>Treasure Chamber</b>: At the top of a pile of gold" }, // prettier-ignore
                                      ],
                                    },
                                    {
                                      name: "Special Moves",
                                      type: "bitflags",
                                      flags: [
                                        { offset: 0xa2, bit: 3, label: "<b>Main</b>: Egg Aim" }, // prettier-ignore
                                        { offset: 0xa2, bit: 2, label: "<b>Main</b>: Breegul Blaster" }, // prettier-ignore
                                        { offset: 0xa2, bit: 1, label: "<b>Jade Snake Grove</b>: Grip Grab" }, // prettier-ignore
                                      ],
                                    },
                                  ],
                                },
                              ],
                            },
                            {
                              name: "Miscellaneous",
                              items: [
                                {
                                  name: "Warp Pads",
                                  type: "bitflags",
                                  flags: [
                                    { offset: 0xf3, bit: 6, label: "World Entry and Exit" }, // prettier-ignore
                                    { offset: 0xf3, bit: 7, label: "Outside Mumbo's Skull" }, // prettier-ignore
                                    { offset: 0xf4, bit: 0, label: "Prison Compound" }, // prettier-ignore
                                    { offset: 0xf4, bit: 1, label: "Near Wumba's Wigwaw" }, // prettier-ignore
                                    { offset: 0xf4, bit: 2, label: "Kickball Stadium Lobby" }, // prettier-ignore
                                  ],
                                },
                                {
                                  name: "Events",
                                  type: "bitflags",
                                  flags: [
                                    { offset: 0xf0, bit: 4, label: "World door unlocked" }, // prettier-ignore
                                  ],
                                },
                              ],
                            },
                          ],
                        },
                      ],
                    },
                    {
                      name: "Glitter Gulch Mine",
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
                                      name: "Playtime",
                                      type: "group",
                                      mode: "time",
                                      items: [
                                        {
                                          offset: 0xf,
                                          type: "variable",
                                          dataType: "uint16",
                                          bigEndian: true,
                                          operations: [
                                            {
                                              convert: {
                                                from: "seconds",
                                                to: "hours",
                                              },
                                            },
                                          ],
                                          max: 17,
                                        },
                                        {
                                          offset: 0xf,
                                          type: "variable",
                                          dataType: "uint16",
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
                                          offset: 0xf,
                                          type: "variable",
                                          dataType: "uint16",
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
                                  ],
                                },
                                {
                                  type: "section",
                                  flex: true,
                                  items: [
                                    {
                                      name: "Jiggies",
                                      type: "bitflags",
                                      flags: [
                                        { offset: 0xc9, bit: 5, label: "<b>Main</b>: First race against Canary Mary won" }, // prettier-ignore
                                        { offset: 0xca, bit: 2, label: "<b>Main</b>: Inside the Jiggy boulder" }, // prettier-ignore
                                        { offset: 0xca, bit: 3, label: "<b>Main</b>: Behind the waterfall using Springy Step Shoes" }, // prettier-ignore
                                        { offset: 0xc9, bit: 6, label: "<b>Generator Cavern</b>: At the end of the path" }, // prettier-ignore
                                        { offset: 0xc9, bit: 7, label: "<b>Waterfall Cavern</b>: At the top of the waterfall" }, // prettier-ignore
                                        { offset: 0xca, bit: 0, label: "<b>Ordnance Storage</b>: All dynamite disabled" }, // prettier-ignore
                                        { offset: 0xca, bit: 1, label: "<b>Prospector's Hut</b>: Dilberta rescued" }, // prettier-ignore
                                        { offset: 0xca, bit: 4, label: "<b>Power Hut Basement</b>: At the end of the path" }, // prettier-ignore
                                        { offset: 0xca, bit: 5, label: "<b>Flooded Caves</b>: At end of the path" }, // prettier-ignore
                                        { offset: 0xc9, bit: 4, label: "<b>Inside Chuffy's Boiler</b>: Old King Coal defeated" }, // prettier-ignore
                                      ],
                                    },
                                    {
                                      name: "Jinjos",
                                      type: "bitflags",
                                      flags: [
                                        { offset: 0xbd, bit: 6, label: "<b>Main</b>: Inside a boulder near Train Station" }, // prettier-ignore
                                        { offset: 0xbd, bit: 7, label: "<b>Main</b>: On the track" }, // prettier-ignore
                                        { offset: 0xbd, bit: 4, label: "<b>Gloomy Caverns</b>: In a cell" }, // prettier-ignore
                                        { offset: 0xbd, bit: 5, label: "<b>Toxic Gas Cave</b>: Behind a rock" }, // prettier-ignore
                                        { offset: 0xbd, bit: 3, label: "<b>Water Storage</b>: Inside a water tank", hidden: true }, // prettier-ignore
                                      ],
                                    },
                                    {
                                      name: "Glowbos",
                                      type: "bitflags",
                                      flags: [
                                        { offset: 0xc6, bit: 3, label: "<b>Main</b>: Near Entrance" }, // prettier-ignore
                                        { offset: 0xc6, bit: 4, label: "<b>Main</b>: Near Gloomy Caverns" }, // prettier-ignore
                                      ],
                                    },
                                    {
                                      name: "Cheato Pages",
                                      type: "bitflags",
                                      flags: [
                                        { offset: 0xda, bit: 0, label: "<b>Main</b>: Second race against Canary Mary won" }, // prettier-ignore
                                        { offset: 0xda, bit: 1, label: "<b>Main</b>: Near the entrance with Springy Step Shoes" }, // prettier-ignore
                                        { offset: 0xda, bit: 2, label: "<b>Water Storage</b>: Inside a water tank" }, // prettier-ignore
                                      ],
                                    },
                                    {
                                      name: "Notes",
                                      type: "bitflags",
                                      flags: [
                                        { offset: 0x10a, bit: 2, label: "<b>Main</b>: At the top of a green pile of minerals" }, // prettier-ignore
                                        { offset: 0x10a, bit: 3, label: "<b>Main</b>: At the top of a green pile of minerals" }, // prettier-ignore
                                        { offset: 0x10a, bit: 4, label: "<b>Main</b>: At the top of a green pile of minerals" }, // prettier-ignore
                                        { offset: 0x10a, bit: 5, label: "<b>Main</b>: At the top of a green pile of minerals" }, // prettier-ignore
                                        { offset: 0x10a, bit: 6, label: "<b>Main</b>: Near Prospector's Hut" }, // prettier-ignore
                                        { offset: 0x10a, bit: 7, label: "<b>Main</b>: Near Prospector's Hut" }, // prettier-ignore
                                        { offset: 0x10b, bit: 0, label: "<b>Main</b>: Near Prospector's Hut" }, // prettier-ignore
                                        { offset: 0x10b, bit: 1, label: "<b>Main</b>: Near Prospector's Hut" }, // prettier-ignore
                                        { offset: 0x10b, bit: 2, label: "<b>Main</b>: Near Prospector's Hut" }, // prettier-ignore
                                        { offset: 0x10b, bit: 3, label: "<b>Main</b>: Near Mumbo's Skull" }, // prettier-ignore
                                        { offset: 0x10b, bit: 4, label: "<b>Main</b>: Near Mumbo's Skull" }, // prettier-ignore
                                        { offset: 0x10b, bit: 5, label: "<b>Main</b>: Near Mumbo's Skull" }, // prettier-ignore
                                        { offset: 0x10b, bit: 6, label: "<b>Fuel Depot</b>: Above a barrel" }, // prettier-ignore
                                        { offset: 0x10b, bit: 7, label: "<b>Fuel Depot</b>: Above a barrel" }, // prettier-ignore
                                        { offset: 0x10c, bit: 0, label: "<b>Fuel Depot</b>: Above a barrel" }, // prettier-ignore
                                        { offset: 0x10c, bit: 1, label: "<b>Fuel Depot</b>: Above a barrel" }, // prettier-ignore
                                        { offset: 0x10c, bit: 2, label: "<b>Water Storage</b>: Treble Clef" }, // prettier-ignore
                                      ],
                                    },
                                    {
                                      name: "Extra Honeycombs",
                                      type: "bitflags",
                                      flags: [
                                        { offset: 0xc3, bit: 0, label: "<b>Main</b>: Inside a boulder" }, // prettier-ignore
                                        { offset: 0xc2, bit: 7, label: "<b>Toxic Gas Cave</b>: Inside a boulder" }, // prettier-ignore
                                        { offset: 0xc3, bit: 1, label: "<b>Train Station</b>: Inside a crate" }, // prettier-ignore
                                      ],
                                    },
                                    {
                                      name: "Special Moves",
                                      type: "bitflags",
                                      flags: [
                                        { offset: 0xa2, bit: 6, label: "<b>Main</b>: Bill Drill" }, // prettier-ignore
                                        { offset: 0xa2, bit: 7, label: "<b>Ordnance Storage</b>: Beak Bayonet" }, // prettier-ignore
                                      ],
                                    },
                                  ],
                                },
                              ],
                            },
                            {
                              name: "Miscellaneous",
                              items: [
                                {
                                  name: "Warp Pads",
                                  type: "bitflags",
                                  flags: [
                                    { offset: 0xf4, bit: 3, label: "World Entry and Exit" }, // prettier-ignore
                                    { offset: 0xf4, bit: 4, label: "Outside Mumbo's Skull" }, // prettier-ignore
                                    { offset: 0xf4, bit: 5, label: "Inside Wumba's Wigwam" }, // prettier-ignore
                                    { offset: 0xf4, bit: 6, label: "Outisde the Crushing Shed" }, // prettier-ignore
                                    { offset: 0xf4, bit: 7, label: "Near the Train Station" }, // prettier-ignore
                                  ],
                                },
                                {
                                  name: "Events",
                                  type: "bitflags",
                                  flags: [
                                    { offset: 0xf0, bit: 5, label: "World door unlocked" }, // prettier-ignore
                                  ],
                                },
                              ],
                            },
                          ],
                        },
                      ],
                    },
                    {
                      name: "Witchyworld",
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
                                      name: "Playtime",
                                      type: "group",
                                      mode: "time",
                                      items: [
                                        {
                                          offset: 0x15,
                                          type: "variable",
                                          dataType: "uint16",
                                          bigEndian: true,
                                          operations: [
                                            {
                                              convert: {
                                                from: "seconds",
                                                to: "hours",
                                              },
                                            },
                                          ],
                                          max: 17,
                                        },
                                        {
                                          offset: 0x15,
                                          type: "variable",
                                          dataType: "uint16",
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
                                          offset: 0x15,
                                          type: "variable",
                                          dataType: "uint16",
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
                                  ],
                                },
                                {
                                  type: "section",
                                  flex: true,
                                  items: [
                                    {
                                      name: "Jiggies",
                                      type: "bitflags",
                                      flags: [
                                        { offset: 0xcb, bit: 1, label: "<b>Main</b>: Saucer of Peril 1st Prize" }, // prettier-ignore
                                        { offset: 0xcb, bit: 3, label: "<b>Main</b>: Above the Dive of Death" }, // prettier-ignore
                                        { offset: 0xcb, bit: 4, label: "<b>Main</b>: Mrs. Boggy's children found" }, // prettier-ignore
                                        { offset: 0xcb, bit: 7, label: "<b>Main</b>: The Cactus of Strength" }, // prettier-ignore
                                        { offset: 0xca, bit: 6, label: "<b>Crazy Castle Stockade</b>: Hoop Hurry Game won" }, // prettier-ignore
                                        { offset: 0xcb, bit: 2, label: "<b>Crazy Castle Stockade</b>: Balloon Burst Game won" }, // prettier-ignore
                                        { offset: 0xca, bit: 7, label: "<b>Dodgem Dome Lobby</b>: 3 games won" }, // prettier-ignore
                                        { offset: 0xcb, bit: 5, label: "<b>Star Spinner</b>: At the top of the room" }, // prettier-ignore
                                        { offset: 0xcb, bit: 6, label: "<b>The Inferno</b>: At the top of the slide" }, // prettier-ignore
                                        { offset: 0xcb, bit: 0, label: "<b>Big Top Interior</b>: Mr. Patch defeated" }, // prettier-ignore
                                      ],
                                    },
                                    {
                                      name: "Jinjos",
                                      type: "bitflags",
                                      flags: [
                                        { offset: 0xbe, bit: 0, label: "<b>Main</b>: At the top of the Big Top" }, // prettier-ignore
                                        { offset: 0xbe, bit: 2, label: "<b>Main</b>: Behind a Van door in Area 51 Zone" }, // prettier-ignore
                                        { offset: 0xbe, bit: 3, label: "<b>Main</b>: At the top of the Dodgem Dome" }, // prettier-ignore
                                        { offset: 0xbe, bit: 4, label: "<b>Main</b>: In Western Zone" }, // prettier-ignore
                                        { offset: 0xbe, bit: 1, label: "<b>Cave of Horrors</b>: In a cell" }, // prettier-ignore
                                      ],
                                    },
                                    {
                                      name: "Glowbos",
                                      type: "bitflags",
                                      flags: [
                                        { offset: 0xc6, bit: 5, label: "<b>The Inferno</b>: Near Mumbo's Skull" }, // prettier-ignore
                                        { offset: 0xc6, bit: 6, label: "<b>Wumba's Wigwam</b>: Inside" }, // prettier-ignore
                                      ],
                                    },
                                    {
                                      name: "Cheato Pages",
                                      type: "bitflags",
                                      flags: [
                                        { offset: 0xda, bit: 5, label: "<b>Main</b>: Saucer of Peril 2nd Prize" }, // prettier-ignore
                                        { offset: 0xda, bit: 3, label: "<b>The Haunted Cavern</b>: Near the end of the path" }, // prettier-ignore
                                        { offset: 0xda, bit: 4, label: "<b>The Inferno</b>: Behind a Van door" }, // prettier-ignore
                                      ],
                                    },
                                    {
                                      name: "Notes",
                                      type: "bitflags",
                                      flags: [
                                        { offset: 0x10c, bit: 3, label: "<b>Main</b>: Around the Big Top" }, // prettier-ignore
                                        { offset: 0x10c, bit: 4, label: "<b>Main</b>: Around the Big Top" }, // prettier-ignore
                                        { offset: 0x10c, bit: 5, label: "<b>Main</b>: Around the Big Top" }, // prettier-ignore
                                        { offset: 0x10c, bit: 6, label: "<b>Main</b>: Around the Big Top" }, // prettier-ignore
                                        { offset: 0x10c, bit: 7, label: "<b>Main</b>: Around the Big Top" }, // prettier-ignore
                                        { offset: 0x10d, bit: 0, label: "<b>Main</b>: Around the Big Top" }, // prettier-ignore
                                        { offset: 0x10d, bit: 1, label: "<b>Main</b>: Around the Big Top" }, // prettier-ignore
                                        { offset: 0x10d, bit: 2, label: "<b>Main</b>: Around the Big Top" }, // prettier-ignore
                                        { offset: 0x10d, bit: 3, label: "<b>Main</b>: In Area 51 Zone" }, // prettier-ignore
                                        { offset: 0x10d, bit: 4, label: "<b>Main</b>: In Area 51 Zone" }, // prettier-ignore
                                        { offset: 0x10d, bit: 5, label: "<b>Main</b>: In Space Zone" }, // prettier-ignore
                                        { offset: 0x10d, bit: 6, label: "<b>Main</b>: In Space Zone" }, // prettier-ignore
                                        { offset: 0x10d, bit: 7, label: "<b>Main</b>: In Hell Zone" }, // prettier-ignore
                                        { offset: 0x10e, bit: 0, label: "<b>Main</b>: In Hell Zone" }, // prettier-ignore
                                        { offset: 0x10e, bit: 1, label: "<b>Main</b>: In Western Zone" }, // prettier-ignore
                                        { offset: 0x10e, bit: 2, label: "<b>Main</b>: In Western Zone" }, // prettier-ignore
                                        { offset: 0x10e, bit: 3, label: "<b>Main</b>: Treble Clef" }, // prettier-ignore
                                      ],
                                    },
                                    {
                                      name: "Extra Honeycombs",
                                      type: "bitflags",
                                      flags: [
                                        { offset: 0xc3, bit: 2, label: "<b>Main</b>: At the top of the Space Zone" }, // prettier-ignore
                                        { offset: 0xc3, bit: 3, label: "<b>Mumbo's Skull</b>: At the entrance" }, // prettier-ignore
                                        { offset: 0xc3, bit: 4, label: "<b>Crazy Castle Stockade</b>: In front of the Pump Room" }, // prettier-ignore
                                      ],
                                    },
                                    {
                                      name: "Special Moves",
                                      type: "bitflags",
                                      flags: [
                                        { offset: 0xa3, bit: 0, label: "<b>Main</b>: Airborne Egg Aiming" }, // prettier-ignore
                                        { offset: 0xa3, bit: 1, label: "<b>Main</b>: Split-up" }, // prettier-ignore
                                        { offset: 0xa4, bit: 6, label: "<b>Crazy Castle Stockade</b>: Pack Whack" }, // prettier-ignore
                                      ],
                                    },
                                  ],
                                },
                              ],
                            },
                            {
                              name: "Miscellaneous",
                              items: [
                                {
                                  name: "Warp Pads",
                                  type: "bitflags",
                                  flags: [
                                    { offset: 0xf5, bit: 0, label: "World Entry and Exit" }, // prettier-ignore
                                    { offset: 0xf5, bit: 1, label: "Behind the Big Top Tent" }, // prettier-ignore
                                    { offset: 0xf5, bit: 2, label: "Space Zone" }, // prettier-ignore
                                    { offset: 0xf5, bit: 3, label: "Outside Wumba's Wigwam" }, // prettier-ignore
                                    { offset: 0xf5, bit: 4, label: "Outisde Mumbo's Skull" }, // prettier-ignore
                                  ],
                                },
                                {
                                  name: "Events",
                                  type: "bitflags",
                                  flags: [
                                    { offset: 0xf0, bit: 6, label: "World door unlocked" }, // prettier-ignore
                                  ],
                                },
                              ],
                            },
                          ],
                        },
                      ],
                    },
                    {
                      name: "Jolly Roger's Lagoon",
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
                                      name: "Playtime",
                                      type: "group",
                                      mode: "time",
                                      items: [
                                        {
                                          offset: 0x19,
                                          type: "variable",
                                          dataType: "uint16",
                                          bigEndian: true,
                                          operations: [
                                            {
                                              convert: {
                                                from: "seconds",
                                                to: "hours",
                                              },
                                            },
                                          ],
                                          max: 17,
                                        },
                                        {
                                          offset: 0x19,
                                          type: "variable",
                                          dataType: "uint16",
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
                                          offset: 0x19,
                                          type: "variable",
                                          dataType: "uint16",
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
                                  ],
                                },
                                {
                                  type: "section",
                                  flex: true,
                                  items: [
                                    {
                                      name: "Jiggies",
                                      type: "bitflags",
                                      flags: [
                                        { offset: 0xcc, bit: 0, label: "<b>???</b>: ???", hidden: true }, // prettier-ignore
                                        { offset: 0xcc, bit: 1, label: "<b>???</b>: ???", hidden: true }, // prettier-ignore
                                        { offset: 0xcc, bit: 2, label: "<b>???</b>: ???", hidden: true }, // prettier-ignore
                                        { offset: 0xcc, bit: 3, label: "<b>???</b>: ???", hidden: true }, // prettier-ignore
                                        { offset: 0xcc, bit: 4, label: "<b>???</b>: ???", hidden: true }, // prettier-ignore
                                        { offset: 0xcc, bit: 5, label: "<b>???</b>: ???", hidden: true }, // prettier-ignore
                                        { offset: 0xcc, bit: 6, label: "<b>???</b>: ???", hidden: true }, // prettier-ignore
                                        { offset: 0xcc, bit: 7, label: "<b>???</b>: ???", hidden: true }, // prettier-ignore
                                        { offset: 0xcd, bit: 0, label: "<b>???</b>: ???", hidden: true }, // prettier-ignore
                                        { offset: 0xcd, bit: 1, label: "<b>???</b>: ???", hidden: true }, // prettier-ignore
                                      ],
                                    },
                                    {
                                      name: "Jinjos",
                                      type: "bitflags",
                                      flags: [
                                        { offset: 0xbe, bit: 5, label: "<b>???</b>: ???", hidden: true }, // prettier-ignore
                                        { offset: 0xbe, bit: 6, label: "<b>???</b>: ???", hidden: true }, // prettier-ignore
                                        { offset: 0xbe, bit: 7, label: "<b>???</b>: ???", hidden: true }, // prettier-ignore
                                        { offset: 0xbf, bit: 0, label: "<b>???</b>: ???", hidden: true }, // prettier-ignore
                                        { offset: 0xbf, bit: 1, label: "<b>???</b>: ???", hidden: true }, // prettier-ignore
                                      ],
                                    },
                                    {
                                      name: "Glowbos",
                                      type: "bitflags",
                                      flags: [
                                        { offset: 0xc6, bit: 7, label: "<b>???</b>: ???", hidden: true }, // prettier-ignore
                                        { offset: 0xc7, bit: 0, label: "<b>???</b>: ???", hidden: true }, // prettier-ignore
                                      ],
                                    },
                                    {
                                      name: "Cheato Pages",
                                      type: "bitflags",
                                      flags: [
                                        { offset: 0xda, bit: 6, label: "<b>???</b>: ???", hidden: true }, // prettier-ignore
                                        { offset: 0xda, bit: 7, label: "<b>???</b>: ???", hidden: true }, // prettier-ignore
                                        { offset: 0xdb, bit: 0, label: "<b>???</b>: ???", hidden: true }, // prettier-ignore
                                      ],
                                    },
                                    {
                                      name: "Notes",
                                      type: "bitflags",
                                      flags: [
                                        { offset: 0x10e, bit: 4, label: "<b>???</b>: ???", hidden: true }, // prettier-ignore
                                        { offset: 0x10e, bit: 5, label: "<b>???</b>: ???", hidden: true }, // prettier-ignore
                                        { offset: 0x10e, bit: 6, label: "<b>???</b>: ???", hidden: true }, // prettier-ignore
                                        { offset: 0x10e, bit: 7, label: "<b>???</b>: ???", hidden: true }, // prettier-ignore
                                        { offset: 0x10f, bit: 0, label: "<b>???</b>: ???", hidden: true }, // prettier-ignore
                                        { offset: 0x10f, bit: 1, label: "<b>???</b>: ???", hidden: true }, // prettier-ignore
                                        { offset: 0x10f, bit: 2, label: "<b>???</b>: ???", hidden: true }, // prettier-ignore
                                        { offset: 0x10f, bit: 3, label: "<b>???</b>: ???", hidden: true }, // prettier-ignore
                                        { offset: 0x10f, bit: 4, label: "<b>???</b>: ???", hidden: true }, // prettier-ignore
                                        { offset: 0x10f, bit: 5, label: "<b>???</b>: ???", hidden: true }, // prettier-ignore
                                        { offset: 0x10f, bit: 6, label: "<b>???</b>: ???", hidden: true }, // prettier-ignore
                                        { offset: 0x10f, bit: 7, label: "<b>???</b>: ???", hidden: true }, // prettier-ignore
                                        { offset: 0x110, bit: 0, label: "<b>???</b>: ???", hidden: true }, // prettier-ignore
                                        { offset: 0x110, bit: 1, label: "<b>???</b>: ???", hidden: true }, // prettier-ignore
                                        { offset: 0x110, bit: 2, label: "<b>???</b>: ???", hidden: true }, // prettier-ignore
                                        { offset: 0x110, bit: 3, label: "<b>???</b>: ???", hidden: true }, // prettier-ignore
                                        { offset: 0x110, bit: 4, label: "<b>???</b>: ???", hidden: true }, // prettier-ignore
                                      ],
                                    },
                                    {
                                      name: "Extra Honeycombs",
                                      type: "bitflags",
                                      flags: [
                                        { offset: 0xc3, bit: 5, label: "<b>???</b>: ???", hidden: true }, // prettier-ignore
                                        { offset: 0xc3, bit: 6, label: "<b>???</b>: ???", hidden: true }, // prettier-ignore
                                        { offset: 0xc3, bit: 7, label: "<b>???</b>: ???", hidden: true }, // prettier-ignore
                                      ],
                                    },
                                    {
                                      name: "Special Moves",
                                      type: "bitflags",
                                      flags: [
                                        { offset: 0xa3, bit: 2, label: "<b>Main</b>: Wing Whack" }, // prettier-ignore
                                        { offset: 0xa3, bit: 4, label: "<b>Jolly's</b>: Sub-aqua Egg Aiming" }, // prettier-ignore
                                        { offset: 0xa3, bit: 3, label: "<b>Electric Eels' Lair</b>: Talon Torpedo" }, // prettier-ignore
                                      ],
                                    },
                                  ],
                                },
                              ],
                            },
                            {
                              name: "Miscellaneous",
                              items: [
                                {
                                  name: "Warp Pads",
                                  type: "bitflags",
                                  flags: [
                                    { offset: 0xf5, bit: 5, label: "Town Center" }, // prettier-ignore
                                    { offset: 0xf5, bit: 6, label: "Atlantis" }, // prettier-ignore
                                    { offset: 0xf5, bit: 7, label: "Sunken Ship" }, // prettier-ignore
                                    { offset: 0xf6, bit: 0, label: "Big Fish Cavern" }, // prettier-ignore
                                    { offset: 0xf6, bit: 1, label: "Lockers Cavern" }, // prettier-ignore
                                  ],
                                },
                                {
                                  name: "Events",
                                  type: "bitflags",
                                  flags: [
                                    { offset: 0xf0, bit: 7, label: "World door unlocked" }, // prettier-ignore
                                  ],
                                },
                              ],
                            },
                          ],
                        },
                      ],
                    },
                    {
                      name: "Terrydactyland",
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
                                      name: "Playtime",
                                      type: "group",
                                      mode: "time",
                                      items: [
                                        {
                                          offset: 0x1b,
                                          type: "variable",
                                          dataType: "uint16",
                                          bigEndian: true,
                                          operations: [
                                            {
                                              convert: {
                                                from: "seconds",
                                                to: "hours",
                                              },
                                            },
                                          ],
                                          max: 17,
                                        },
                                        {
                                          offset: 0x1b,
                                          type: "variable",
                                          dataType: "uint16",
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
                                          offset: 0x1b,
                                          type: "variable",
                                          dataType: "uint16",
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
                                  ],
                                },
                                {
                                  type: "section",
                                  flex: true,
                                  items: [
                                    {
                                      name: "Jiggies",
                                      type: "bitflags",
                                      flags: [
                                        { offset: 0xcd, bit: 2, label: "<b>???</b>: ???", hidden: true }, // prettier-ignore
                                        { offset: 0xcd, bit: 3, label: "<b>???</b>: ???", hidden: true }, // prettier-ignore
                                        { offset: 0xcd, bit: 4, label: "<b>???</b>: ???", hidden: true }, // prettier-ignore
                                        { offset: 0xcd, bit: 5, label: "<b>???</b>: ???", hidden: true }, // prettier-ignore
                                        { offset: 0xcd, bit: 6, label: "<b>???</b>: ???", hidden: true }, // prettier-ignore
                                        { offset: 0xcd, bit: 7, label: "<b>???</b>: ???", hidden: true }, // prettier-ignore
                                        { offset: 0xce, bit: 0, label: "<b>???</b>: ???", hidden: true }, // prettier-ignore
                                        { offset: 0xce, bit: 1, label: "<b>???</b>: ???", hidden: true }, // prettier-ignore
                                        { offset: 0xce, bit: 2, label: "<b>???</b>: ???", hidden: true }, // prettier-ignore
                                        { offset: 0xce, bit: 3, label: "<b>???</b>: ???", hidden: true }, // prettier-ignore
                                      ],
                                    },
                                    {
                                      name: "Jinjos",
                                      type: "bitflags",
                                      flags: [
                                        { offset: 0xbf, bit: 2, label: "<b>???</b>: ???", hidden: true }, // prettier-ignore
                                        { offset: 0xbf, bit: 3, label: "<b>???</b>: ???", hidden: true }, // prettier-ignore
                                        { offset: 0xbf, bit: 4, label: "<b>???</b>: ???", hidden: true }, // prettier-ignore
                                        { offset: 0xbf, bit: 5, label: "<b>???</b>: ???", hidden: true }, // prettier-ignore
                                        { offset: 0xbf, bit: 6, label: "<b>???</b>: ???", hidden: true }, // prettier-ignore
                                      ],
                                    },
                                    {
                                      name: "Glowbos",
                                      type: "bitflags",
                                      flags: [
                                        { offset: 0xc7, bit: 1, label: "<b>???</b>: ???", hidden: true }, // prettier-ignore
                                        { offset: 0xc7, bit: 2, label: "<b>???</b>: ???", hidden: true }, // prettier-ignore
                                      ],
                                    },
                                    {
                                      name: "Cheato Pages",
                                      type: "bitflags",
                                      flags: [
                                        { offset: 0xdb, bit: 1, label: "<b>???</b>: ???", hidden: true }, // prettier-ignore
                                        { offset: 0xdb, bit: 2, label: "<b>???</b>: ???", hidden: true }, // prettier-ignore
                                        { offset: 0xdb, bit: 3, label: "<b>???</b>: ???", hidden: true }, // prettier-ignore
                                      ],
                                    },
                                    {
                                      name: "Notes",
                                      type: "bitflags",
                                      flags: [
                                        { offset: 0x110, bit: 5, label: "<b>???</b>: ???", hidden: true }, // prettier-ignore
                                        { offset: 0x110, bit: 6, label: "<b>???</b>: ???", hidden: true }, // prettier-ignore
                                        { offset: 0x110, bit: 7, label: "<b>???</b>: ???", hidden: true }, // prettier-ignore
                                        { offset: 0x111, bit: 0, label: "<b>???</b>: ???", hidden: true }, // prettier-ignore
                                        { offset: 0x111, bit: 1, label: "<b>???</b>: ???", hidden: true }, // prettier-ignore
                                        { offset: 0x111, bit: 2, label: "<b>???</b>: ???", hidden: true }, // prettier-ignore
                                        { offset: 0x111, bit: 3, label: "<b>???</b>: ???", hidden: true }, // prettier-ignore
                                        { offset: 0x111, bit: 4, label: "<b>???</b>: ???", hidden: true }, // prettier-ignore
                                        { offset: 0x111, bit: 5, label: "<b>???</b>: ???", hidden: true }, // prettier-ignore
                                        { offset: 0x111, bit: 6, label: "<b>???</b>: ???", hidden: true }, // prettier-ignore
                                        { offset: 0x111, bit: 7, label: "<b>???</b>: ???", hidden: true }, // prettier-ignore
                                        { offset: 0x112, bit: 0, label: "<b>???</b>: ???", hidden: true }, // prettier-ignore
                                        { offset: 0x112, bit: 1, label: "<b>???</b>: ???", hidden: true }, // prettier-ignore
                                        { offset: 0x112, bit: 2, label: "<b>???</b>: ???", hidden: true }, // prettier-ignore
                                        { offset: 0x112, bit: 3, label: "<b>???</b>: ???", hidden: true }, // prettier-ignore
                                        { offset: 0x112, bit: 4, label: "<b>???</b>: ???", hidden: true }, // prettier-ignore
                                        { offset: 0x112, bit: 5, label: "<b>???</b>: ???", hidden: true }, // prettier-ignore
                                      ],
                                    },
                                    {
                                      name: "Extra Honeycombs",
                                      type: "bitflags",
                                      flags: [
                                        { offset: 0xc4, bit: 0, label: "<b>???</b>: ???", hidden: true }, // prettier-ignore
                                        { offset: 0xc4, bit: 1, label: "<b>???</b>: ???", hidden: true }, // prettier-ignore
                                        { offset: 0xc4, bit: 2, label: "<b>???</b>: ???", hidden: true }, // prettier-ignore
                                      ],
                                    },
                                    {
                                      name: "Special Moves",
                                      type: "bitflags",
                                      flags: [
                                        { offset: 0xa4, bit: 3, label: "<b>Main</b>: Springy Step Shoes" }, // prettier-ignore
                                        { offset: 0xa4, bit: 5, label: "<b>Unga Bunga's Cave</b>: Hatch" }, // prettier-ignore
                                        { offset: 0xa4, bit: 4, label: "<b>River Passage</b>: Taxi Pack" }, // prettier-ignore
                                      ],
                                    },
                                  ],
                                },
                              ],
                            },
                            {
                              name: "Miscellaneous",
                              items: [
                                {
                                  name: "Warp Pads",
                                  type: "bitflags",
                                  flags: [
                                    { offset: 0xf6, bit: 2, label: "World Entry and Exit" }, // prettier-ignore
                                    { offset: 0xf6, bit: 3, label: "Stomping Plains" }, // prettier-ignore
                                    { offset: 0xf6, bit: 4, label: "Outisde Mumbo's Skull" }, // prettier-ignore
                                    { offset: 0xf6, bit: 5, label: "Outisde Wumba's Wigwam" }, // prettier-ignore
                                    { offset: 0xf6, bit: 6, label: "Top of the Mountain" }, // prettier-ignore
                                  ],
                                },
                                {
                                  name: "Events",
                                  type: "bitflags",
                                  flags: [
                                    { offset: 0xf1, bit: 0, label: "World door unlocked" }, // prettier-ignore
                                  ],
                                },
                              ],
                            },
                          ],
                        },
                      ],
                    },
                    {
                      name: "Grunty Industries",
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
                                      name: "Playtime",
                                      type: "group",
                                      mode: "time",
                                      items: [
                                        {
                                          offset: 0x1d,
                                          type: "variable",
                                          dataType: "uint16",
                                          bigEndian: true,
                                          operations: [
                                            {
                                              convert: {
                                                from: "seconds",
                                                to: "hours",
                                              },
                                            },
                                          ],
                                          max: 17,
                                        },
                                        {
                                          offset: 0x1d,
                                          type: "variable",
                                          dataType: "uint16",
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
                                          offset: 0x1d,
                                          type: "variable",
                                          dataType: "uint16",
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
                                  ],
                                },
                                {
                                  type: "section",
                                  flex: true,
                                  items: [
                                    {
                                      name: "Jiggies",
                                      type: "bitflags",
                                      flags: [
                                        { offset: 0xce, bit: 4, label: "<b>???</b>: ???", hidden: true }, // prettier-ignore
                                        { offset: 0xce, bit: 5, label: "<b>???</b>: ???", hidden: true }, // prettier-ignore
                                        { offset: 0xce, bit: 6, label: "<b>???</b>: ???", hidden: true }, // prettier-ignore
                                        { offset: 0xce, bit: 7, label: "<b>???</b>: ???", hidden: true }, // prettier-ignore
                                        { offset: 0xcf, bit: 0, label: "<b>???</b>: ???", hidden: true }, // prettier-ignore
                                        { offset: 0xcf, bit: 1, label: "<b>???</b>: ???", hidden: true }, // prettier-ignore
                                        { offset: 0xcf, bit: 2, label: "<b>???</b>: ???", hidden: true }, // prettier-ignore
                                        { offset: 0xcf, bit: 3, label: "<b>???</b>: ???", hidden: true }, // prettier-ignore
                                        { offset: 0xcf, bit: 4, label: "<b>???</b>: ???", hidden: true }, // prettier-ignore
                                        { offset: 0xcf, bit: 5, label: "<b>???</b>: ???", hidden: true }, // prettier-ignore
                                      ],
                                    },
                                    {
                                      name: "Jinjos",
                                      type: "bitflags",
                                      flags: [
                                        { offset: 0xbf, bit: 7, label: "<b>???</b>: ???", hidden: true }, // prettier-ignore
                                        { offset: 0xc0, bit: 0, label: "<b>???</b>: ???", hidden: true }, // prettier-ignore
                                        { offset: 0xc0, bit: 1, label: "<b>???</b>: ???", hidden: true }, // prettier-ignore
                                        { offset: 0xc0, bit: 2, label: "<b>???</b>: ???", hidden: true }, // prettier-ignore
                                        { offset: 0xc0, bit: 3, label: "<b>???</b>: ???", hidden: true }, // prettier-ignore
                                      ],
                                    },
                                    {
                                      name: "Glowbos",
                                      type: "bitflags",
                                      flags: [
                                        { offset: 0xc7, bit: 3, label: "<b>???</b>: ???", hidden: true }, // prettier-ignore
                                        { offset: 0xc7, bit: 4, label: "<b>???</b>: ???", hidden: true }, // prettier-ignore
                                      ],
                                    },
                                    {
                                      name: "Cheato Pages",
                                      type: "bitflags",
                                      flags: [
                                        { offset: 0xdb, bit: 4, label: "<b>???</b>: ???", hidden: true }, // prettier-ignore
                                        { offset: 0xdb, bit: 5, label: "<b>???</b>: ???", hidden: true }, // prettier-ignore
                                        { offset: 0xdb, bit: 6, label: "<b>???</b>: ???", hidden: true }, // prettier-ignore
                                      ],
                                    },
                                    {
                                      name: "Notes",
                                      type: "bitflags",
                                      flags: [
                                        { offset: 0x112, bit: 6, label: "<b>???</b>: ???", hidden: true }, // prettier-ignore
                                        { offset: 0x112, bit: 7, label: "<b>???</b>: ???", hidden: true }, // prettier-ignore
                                        { offset: 0x113, bit: 0, label: "<b>???</b>: ???", hidden: true }, // prettier-ignore
                                        { offset: 0x113, bit: 1, label: "<b>???</b>: ???", hidden: true }, // prettier-ignore
                                        { offset: 0x113, bit: 2, label: "<b>???</b>: ???", hidden: true }, // prettier-ignore
                                        { offset: 0x113, bit: 3, label: "<b>???</b>: ???", hidden: true }, // prettier-ignore
                                        { offset: 0x113, bit: 4, label: "<b>???</b>: ???", hidden: true }, // prettier-ignore
                                        { offset: 0x113, bit: 5, label: "<b>???</b>: ???", hidden: true }, // prettier-ignore
                                        { offset: 0x113, bit: 6, label: "<b>???</b>: ???", hidden: true }, // prettier-ignore
                                        { offset: 0x113, bit: 7, label: "<b>???</b>: ???", hidden: true }, // prettier-ignore
                                        { offset: 0x114, bit: 0, label: "<b>???</b>: ???", hidden: true }, // prettier-ignore
                                        { offset: 0x114, bit: 1, label: "<b>???</b>: ???", hidden: true }, // prettier-ignore
                                        { offset: 0x114, bit: 2, label: "<b>???</b>: ???", hidden: true }, // prettier-ignore
                                        { offset: 0x114, bit: 3, label: "<b>???</b>: ???", hidden: true }, // prettier-ignore
                                        { offset: 0x114, bit: 4, label: "<b>???</b>: ???", hidden: true }, // prettier-ignore
                                        { offset: 0x114, bit: 5, label: "<b>???</b>: ???", hidden: true }, // prettier-ignore
                                        { offset: 0x114, bit: 6, label: "<b>???</b>: ???", hidden: true }, // prettier-ignore
                                      ],
                                    },
                                    {
                                      name: "Extra Honeycombs",
                                      type: "bitflags",
                                      flags: [
                                        { offset: 0xc4, bit: 3, label: "<b>???</b>: ???", hidden: true }, // prettier-ignore
                                        { offset: 0xc4, bit: 4, label: "<b>???</b>: ???", hidden: true }, // prettier-ignore
                                        { offset: 0xc4, bit: 5, label: "<b>???</b>: ???", hidden: true }, // prettier-ignore
                                      ],
                                    },
                                    {
                                      name: "Special Moves",
                                      type: "bitflags",
                                      flags: [
                                        { offset: 0xa4, bit: 2, label: "<b>Floor 1</b>: Claw Clamber Boots" }, // prettier-ignore
                                        { offset: 0xa4, bit: 1, label: "<b>Floor 2</b>: Leg Spring" }, // prettier-ignore
                                        { offset: 0xa4, bit: 0, label: "<b>Waste Disposal Plant</b>: Snooze Pack" }, // prettier-ignore
                                      ],
                                    },
                                  ],
                                },
                              ],
                            },
                            {
                              name: "Miscellaneous",
                              items: [
                                {
                                  name: "Warp Pads",
                                  type: "bitflags",
                                  flags: [
                                    { offset: 0xf6, bit: 7, label: "Floor 1 - Entrance Door" }, // prettier-ignore
                                    { offset: 0xf7, bit: 0, label: "Floor 2 - Outside Wumba's Wigwam" }, // prettier-ignore
                                    { offset: 0xf7, bit: 1, label: "Floor 3 - Outside Mumbo's Skull" }, // prettier-ignore
                                    { offset: 0xf7, bit: 2, label: "Floor 4 - Near the Crushers" }, // prettier-ignore
                                    { offset: 0xf7, bit: 3, label: "On the Roof Outside" }, // prettier-ignore
                                  ],
                                },
                                {
                                  name: "Events",
                                  type: "bitflags",
                                  flags: [
                                    { offset: 0xf1, bit: 1, label: "World door unlocked" }, // prettier-ignore
                                  ],
                                },
                              ],
                            },
                          ],
                        },
                      ],
                    },
                    {
                      name: "Hailfire Peaks",
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
                                      name: "Playtime",
                                      type: "group",
                                      mode: "time",
                                      items: [
                                        {
                                          offset: 0x1f,
                                          type: "variable",
                                          dataType: "uint16",
                                          bigEndian: true,
                                          operations: [
                                            {
                                              convert: {
                                                from: "seconds",
                                                to: "hours",
                                              },
                                            },
                                          ],
                                          max: 17,
                                        },
                                        {
                                          offset: 0x1f,
                                          type: "variable",
                                          dataType: "uint16",
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
                                          offset: 0x1f,
                                          type: "variable",
                                          dataType: "uint16",
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
                                  ],
                                },
                                {
                                  type: "section",
                                  flex: true,
                                  items: [
                                    {
                                      name: "Jiggies",
                                      type: "bitflags",
                                      flags: [
                                        { offset: 0xcf, bit: 6, label: "<b>???</b>: ???", hidden: true }, // prettier-ignore
                                        { offset: 0xcf, bit: 7, label: "<b>???</b>: ???", hidden: true }, // prettier-ignore
                                        { offset: 0xd0, bit: 0, label: "<b>???</b>: ???", hidden: true }, // prettier-ignore
                                        { offset: 0xd0, bit: 1, label: "<b>???</b>: ???", hidden: true }, // prettier-ignore
                                        { offset: 0xd0, bit: 2, label: "<b>???</b>: ???", hidden: true }, // prettier-ignore
                                        { offset: 0xd0, bit: 3, label: "<b>???</b>: ???", hidden: true }, // prettier-ignore
                                        { offset: 0xd0, bit: 4, label: "<b>???</b>: ???", hidden: true }, // prettier-ignore
                                        { offset: 0xd0, bit: 5, label: "<b>???</b>: ???", hidden: true }, // prettier-ignore
                                        { offset: 0xd0, bit: 6, label: "<b>???</b>: ???", hidden: true }, // prettier-ignore
                                        { offset: 0xd0, bit: 7, label: "<b>???</b>: ???", hidden: true }, // prettier-ignore
                                      ],
                                    },
                                    {
                                      name: "Jinjos",
                                      type: "bitflags",
                                      flags: [
                                        { offset: 0xc0, bit: 4, label: "<b>???</b>: ???", hidden: true }, // prettier-ignore
                                        { offset: 0xc0, bit: 5, label: "<b>???</b>: ???", hidden: true }, // prettier-ignore
                                        { offset: 0xc0, bit: 6, label: "<b>???</b>: ???", hidden: true }, // prettier-ignore
                                        { offset: 0xc0, bit: 7, label: "<b>???</b>: ???", hidden: true }, // prettier-ignore
                                        { offset: 0xc1, bit: 0, label: "<b>???</b>: ???", hidden: true }, // prettier-ignore
                                      ],
                                    },
                                    {
                                      name: "Glowbos",
                                      type: "bitflags",
                                      flags: [
                                        { offset: 0xc7, bit: 5, label: "<b>???</b>: ???", hidden: true }, // prettier-ignore
                                        { offset: 0xc7, bit: 6, label: "<b>???</b>: ???", hidden: true }, // prettier-ignore
                                      ],
                                    },
                                    {
                                      name: "Cheato Pages",
                                      type: "bitflags",
                                      flags: [
                                        { offset: 0xdb, bit: 7, label: "<b>???</b>: ???", hidden: true }, // prettier-ignore
                                        { offset: 0xdc, bit: 0, label: "<b>???</b>: ???", hidden: true }, // prettier-ignore
                                        { offset: 0xdc, bit: 1, label: "<b>???</b>: ???", hidden: true }, // prettier-ignore
                                      ],
                                    },
                                    {
                                      name: "Notes",
                                      type: "bitflags",
                                      flags: [
                                        { offset: 0x114, bit: 7, label: "<b>???</b>: ???", hidden: true }, // prettier-ignore
                                        { offset: 0x115, bit: 0, label: "<b>???</b>: ???", hidden: true }, // prettier-ignore
                                        { offset: 0x115, bit: 1, label: "<b>???</b>: ???", hidden: true }, // prettier-ignore
                                        { offset: 0x115, bit: 2, label: "<b>???</b>: ???", hidden: true }, // prettier-ignore
                                        { offset: 0x115, bit: 3, label: "<b>???</b>: ???", hidden: true }, // prettier-ignore
                                        { offset: 0x115, bit: 4, label: "<b>???</b>: ???", hidden: true }, // prettier-ignore
                                        { offset: 0x115, bit: 5, label: "<b>???</b>: ???", hidden: true }, // prettier-ignore
                                        { offset: 0x115, bit: 6, label: "<b>???</b>: ???", hidden: true }, // prettier-ignore
                                        { offset: 0x115, bit: 7, label: "<b>???</b>: ???", hidden: true }, // prettier-ignore
                                        { offset: 0x116, bit: 0, label: "<b>???</b>: ???", hidden: true }, // prettier-ignore
                                        { offset: 0x116, bit: 1, label: "<b>???</b>: ???", hidden: true }, // prettier-ignore
                                        { offset: 0x116, bit: 2, label: "<b>???</b>: ???", hidden: true }, // prettier-ignore
                                        { offset: 0x116, bit: 3, label: "<b>???</b>: ???", hidden: true }, // prettier-ignore
                                        { offset: 0x116, bit: 4, label: "<b>???</b>: ???", hidden: true }, // prettier-ignore
                                        { offset: 0x116, bit: 5, label: "<b>???</b>: ???", hidden: true }, // prettier-ignore
                                        { offset: 0x116, bit: 6, label: "<b>???</b>: ???", hidden: true }, // prettier-ignore
                                        { offset: 0x116, bit: 7, label: "<b>???</b>: ???", hidden: true }, // prettier-ignore
                                      ],
                                    },
                                    {
                                      name: "Extra Honeycombs",
                                      type: "bitflags",
                                      flags: [
                                        { offset: 0xc4, bit: 6, label: "<b>???</b>: ???", hidden: true }, // prettier-ignore
                                        { offset: 0xc4, bit: 7, label: "<b>???</b>: ???", hidden: true }, // prettier-ignore
                                        { offset: 0xc5, bit: 0, label: "<b>???</b>: ???", hidden: true }, // prettier-ignore
                                      ],
                                    },
                                    {
                                      name: "Special Moves",
                                      type: "bitflags",
                                      flags: [
                                        { offset: 0xa3, bit: 6, label: "<b>Lava Side</b>: Shack Pack" }, // prettier-ignore
                                        { offset: 0xa3, bit: 7, label: "<b>Icy Side</b>: Glide" }, // prettier-ignore
                                      ],
                                    },
                                  ],
                                },
                              ],
                            },
                            {
                              name: "Miscellaneous",
                              items: [
                                {
                                  name: "Warp Pads",
                                  type: "bitflags",
                                  flags: [
                                    { offset: 0xf7, bit: 4, label: "Fire Side - Lower Area (Mumbo)" }, // prettier-ignore
                                    { offset: 0xf7, bit: 5, label: "Fire Side - Upper Area" }, // prettier-ignore
                                    { offset: 0xf7, bit: 6, label: "Ice Side - Upper Area" }, // prettier-ignore
                                    { offset: 0xf7, bit: 7, label: "Ice Side - Lower Area (Wumba)" }, // prettier-ignore
                                    { offset: 0xf8, bit: 0, label: "Ice Side - Inside Icicle Grotto" }, // prettier-ignore
                                  ],
                                },
                                {
                                  name: "Events",
                                  type: "bitflags",
                                  flags: [
                                    { offset: 0xf1, bit: 2, label: "World door unlocked" }, // prettier-ignore
                                  ],
                                },
                              ],
                            },
                          ],
                        },
                      ],
                    },
                    {
                      name: "Cloud Cuckooland",
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
                                      name: "Playtime",
                                      type: "group",
                                      mode: "time",
                                      items: [
                                        {
                                          offset: 0x21,
                                          type: "variable",
                                          dataType: "uint16",
                                          bigEndian: true,
                                          operations: [
                                            {
                                              convert: {
                                                from: "seconds",
                                                to: "hours",
                                              },
                                            },
                                          ],
                                          max: 17,
                                        },
                                        {
                                          offset: 0x21,
                                          type: "variable",
                                          dataType: "uint16",
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
                                          offset: 0x21,
                                          type: "variable",
                                          dataType: "uint16",
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
                                  ],
                                },
                                {
                                  type: "section",
                                  flex: true,
                                  items: [
                                    {
                                      name: "Jiggies",
                                      type: "bitflags",
                                      flags: [
                                        { offset: 0xd1, bit: 0, label: "<b>???</b>: ???", hidden: true }, // prettier-ignore
                                        { offset: 0xd1, bit: 1, label: "<b>???</b>: ???", hidden: true }, // prettier-ignore
                                        { offset: 0xd1, bit: 2, label: "<b>???</b>: ???", hidden: true }, // prettier-ignore
                                        { offset: 0xd1, bit: 3, label: "<b>???</b>: ???", hidden: true }, // prettier-ignore
                                        { offset: 0xd1, bit: 4, label: "<b>???</b>: ???", hidden: true }, // prettier-ignore
                                        { offset: 0xd1, bit: 5, label: "<b>???</b>: ???", hidden: true }, // prettier-ignore
                                        { offset: 0xd1, bit: 6, label: "<b>???</b>: ???", hidden: true }, // prettier-ignore
                                        { offset: 0xd1, bit: 7, label: "<b>???</b>: ???", hidden: true }, // prettier-ignore
                                        { offset: 0xd2, bit: 0, label: "<b>???</b>: ???", hidden: true }, // prettier-ignore
                                        { offset: 0xd2, bit: 1, label: "<b>???</b>: ???", hidden: true }, // prettier-ignore
                                      ],
                                    },
                                    {
                                      name: "Jinjos",
                                      type: "bitflags",
                                      flags: [
                                        { offset: 0xc1, bit: 1, label: "<b>???</b>: ???", hidden: true }, // prettier-ignore
                                        { offset: 0xc1, bit: 2, label: "<b>???</b>: ???", hidden: true }, // prettier-ignore
                                        { offset: 0xc1, bit: 3, label: "<b>???</b>: ???", hidden: true }, // prettier-ignore
                                        { offset: 0xc1, bit: 4, label: "<b>???</b>: ???", hidden: true }, // prettier-ignore
                                        { offset: 0xc1, bit: 5, label: "<b>???</b>: ???", hidden: true }, // prettier-ignore
                                      ],
                                    },
                                    {
                                      name: "Glowbos",
                                      type: "bitflags",
                                      flags: [
                                        { offset: 0xc7, bit: 7, label: "<b>???</b>: ???", hidden: true }, // prettier-ignore
                                        { offset: 0xc8, bit: 0, label: "<b>???</b>: ???", hidden: true }, // prettier-ignore
                                      ],
                                    },
                                    {
                                      name: "Cheato Pages",
                                      type: "bitflags",
                                      flags: [
                                        { offset: 0xdc, bit: 2, label: "<b>???</b>: ???", hidden: true }, // prettier-ignore
                                        { offset: 0xdc, bit: 3, label: "<b>???</b>: ???", hidden: true }, // prettier-ignore
                                        { offset: 0xdc, bit: 4, label: "<b>???</b>: ???", hidden: true }, // prettier-ignore
                                      ],
                                    },
                                    {
                                      name: "Notes",
                                      type: "bitflags",
                                      flags: [
                                        { offset: 0x117, bit: 0, label: "<b>???</b>: ???", hidden: true }, // prettier-ignore
                                        { offset: 0x117, bit: 1, label: "<b>???</b>: ???", hidden: true }, // prettier-ignore
                                        { offset: 0x117, bit: 2, label: "<b>???</b>: ???", hidden: true }, // prettier-ignore
                                        { offset: 0x117, bit: 3, label: "<b>???</b>: ???", hidden: true }, // prettier-ignore
                                        { offset: 0x117, bit: 4, label: "<b>???</b>: ???", hidden: true }, // prettier-ignore
                                        { offset: 0x117, bit: 5, label: "<b>???</b>: ???", hidden: true }, // prettier-ignore
                                        { offset: 0x117, bit: 6, label: "<b>???</b>: ???", hidden: true }, // prettier-ignore
                                        { offset: 0x117, bit: 7, label: "<b>???</b>: ???", hidden: true }, // prettier-ignore
                                        { offset: 0x118, bit: 0, label: "<b>???</b>: ???", hidden: true }, // prettier-ignore
                                        { offset: 0x118, bit: 1, label: "<b>???</b>: ???", hidden: true }, // prettier-ignore
                                        { offset: 0x118, bit: 2, label: "<b>???</b>: ???", hidden: true }, // prettier-ignore
                                        { offset: 0x118, bit: 3, label: "<b>???</b>: ???", hidden: true }, // prettier-ignore
                                        { offset: 0x118, bit: 4, label: "<b>???</b>: ???", hidden: true }, // prettier-ignore
                                        { offset: 0x118, bit: 5, label: "<b>???</b>: ???", hidden: true }, // prettier-ignore
                                        { offset: 0x118, bit: 6, label: "<b>???</b>: ???", hidden: true }, // prettier-ignore
                                        { offset: 0x118, bit: 7, label: "<b>???</b>: ???", hidden: true }, // prettier-ignore
                                        { offset: 0x119, bit: 0, label: "<b>???</b>: ???", hidden: true }, // prettier-ignore
                                      ],
                                    },
                                    {
                                      name: "Extra Honeycombs",
                                      type: "bitflags",
                                      flags: [
                                        { offset: 0xc5, bit: 1, label: "<b>???</b>: ???", hidden: true }, // prettier-ignore
                                        { offset: 0xc5, bit: 2, label: "<b>???</b>: ???", hidden: true }, // prettier-ignore
                                        { offset: 0xc5, bit: 3, label: "<b>???</b>: ???", hidden: true }, // prettier-ignore
                                      ],
                                    },
                                    {
                                      name: "Special Moves",
                                      type: "bitflags",
                                      flags: [
                                        { offset: 0xa4, bit: 7, label: "<b>Central Cavern</b>: Sack Pack" }, // prettier-ignore
                                      ],
                                    },
                                  ],
                                },
                              ],
                            },
                            {
                              name: "Miscellaneous",
                              items: [
                                {
                                  name: "Warp Pads",
                                  type: "bitflags",
                                  flags: [
                                    { offset: 0xf8, bit: 1, label: "World Entry and Exit" }, // prettier-ignore
                                    { offset: 0xf8, bit: 2, label: "Central Cavern" }, // prettier-ignore
                                  ],
                                },
                                {
                                  name: "Events",
                                  type: "bitflags",
                                  flags: [
                                    { offset: 0xf1, bit: 3, label: "World door unlocked" }, // prettier-ignore
                                  ],
                                },
                              ],
                            },
                          ],
                        },
                      ],
                    },
                    {
                      name: "Cauldron Keep",
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
                                      name: "Playtime",
                                      type: "group",
                                      mode: "time",
                                      items: [
                                        {
                                          offset: 0x23,
                                          type: "variable",
                                          dataType: "uint16",
                                          bigEndian: true,
                                          operations: [
                                            {
                                              convert: {
                                                from: "seconds",
                                                to: "hours",
                                              },
                                            },
                                          ],
                                          max: 17,
                                        },
                                        {
                                          offset: 0x23,
                                          type: "variable",
                                          dataType: "uint16",
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
                                          offset: 0x23,
                                          type: "variable",
                                          dataType: "uint16",
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
                                  ],
                                },
                                {
                                  type: "section",
                                  flex: true,
                                  items: [],
                                },
                              ],
                            },
                            {
                              name: "Miscellaneous",
                              items: [
                                {
                                  name: "Warp Pads",
                                  type: "bitflags",
                                  flags: [
                                    { offset: 0xf8, bit: 6, label: "Bottom of the Tower" }, // prettier-ignore
                                    { offset: 0xf8, bit: 7, label: "Top of the Tower" }, // prettier-ignore
                                  ],
                                },
                                {
                                  name: "Events",
                                  type: "bitflags",
                                  flags: [
                                    { offset: 0xf1, bit: 4, label: "World door unlocked" }, // prettier-ignore
                                    { offset: 0xf1, bit: 5, label: "Top of the Tower door unlocked" }, // prettier-ignore
                                  ],
                                },
                              ],
                            },
                          ],
                        },
                      ],
                    },
                    {
                      name: "???",
                      hidden: true,
                      items: [
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
                                  offset: 0xd,
                                  type: "variable",
                                  dataType: "uint16",
                                  bigEndian: true,
                                  operations: [
                                    {
                                      convert: {
                                        from: "seconds",
                                        to: "hours",
                                      },
                                    },
                                  ],
                                  max: 17,
                                },
                                {
                                  offset: 0xd,
                                  type: "variable",
                                  dataType: "uint16",
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
                                  offset: 0xd,
                                  type: "variable",
                                  dataType: "uint16",
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
                              name: "Playtime",
                              type: "group",
                              mode: "time",
                              items: [
                                {
                                  offset: 0x13,
                                  type: "variable",
                                  dataType: "uint16",
                                  bigEndian: true,
                                  operations: [
                                    {
                                      convert: {
                                        from: "seconds",
                                        to: "hours",
                                      },
                                    },
                                  ],
                                  max: 17,
                                },
                                {
                                  offset: 0x13,
                                  type: "variable",
                                  dataType: "uint16",
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
                                  offset: 0x13,
                                  type: "variable",
                                  dataType: "uint16",
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
                              name: "Playtime",
                              type: "group",
                              mode: "time",
                              items: [
                                {
                                  offset: 0x27,
                                  type: "variable",
                                  dataType: "uint16",
                                  bigEndian: true,
                                  operations: [
                                    {
                                      convert: {
                                        from: "seconds",
                                        to: "hours",
                                      },
                                    },
                                  ],
                                  max: 17,
                                },
                                {
                                  offset: 0x27,
                                  type: "variable",
                                  dataType: "uint16",
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
                                  offset: 0x27,
                                  type: "variable",
                                  dataType: "uint16",
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
                          ],
                        },
                      ],
                    },
                  ],
                },
              ],
            },
            {
              name: "Special Moves",
              flex: true,
              items: [
                {
                  name: "Basic Moves",
                  type: "bitflags",
                  flags: [
                    { offset: 0x9f, bit: 5, label: "Beak Barge" }, // prettier-ignore
                    { offset: 0x9f, bit: 6, label: "Beak Bomb" }, // prettier-ignore
                    { offset: 0x9f, bit: 7, label: "Beak Buster" }, // prettier-ignore
                    { offset: 0xa5, bit: 6, label: "Blue Eggs" }, // prettier-ignore
                    { offset: 0xa0, bit: 2, label: "Climbing" }, // prettier-ignore
                    { offset: 0xa0, bit: 3, label: "Egg Firing" }, // prettier-ignore
                    { offset: 0xa0, bit: 4, label: "Featherly Flap" }, // prettier-ignore
                    { offset: 0xa0, bit: 5, label: "Flap Flip" }, // prettier-ignore
                    { offset: 0xa0, bit: 6, label: "Flight" }, // prettier-ignore
                    { offset: 0xa1, bit: 1, label: "Forward Roll Attack" }, // prettier-ignore
                    { offset: 0xa0, bit: 7, label: "High Jump" }, // prettier-ignore
                    { offset: 0xa0, bit: 1, label: "Peck" }, // prettier-ignore
                    { offset: 0xa1, bit: 0, label: "Rat-a-tat Rap" }, // prettier-ignore
                    { offset: 0xa1, bit: 2, label: "Shock Jump Spring" }, // prettier-ignore
                    { offset: 0xa1, bit: 3, label: "Stilt Stride" }, // prettier-ignore
                    { offset: 0xa1, bit: 4, label: "Swimming" }, // prettier-ignore
                    { offset: 0xa1, bit: 5, label: "Talon Trot" }, // prettier-ignore
                    { offset: 0xa1, bit: 6, label: "Turbo Talon Trot" }, // prettier-ignore
                    { offset: 0xa1, bit: 7, label: "Wonderwing" }, // prettier-ignore
                    { offset: 0xa0, bit: 0, label: "???", hidden: true }, // prettier-ignore
                    { offset: 0xa2, bit: 0, label: "???", hidden: true }, // prettier-ignore
                  ],
                },
                {
                  name: "Advanced Moves",
                  type: "bitflags",
                  flags: [
                    { offset: 0xa5, bit: 0, label: "Amaze-O-Gaze Glasses" }, // prettier-ignore
                    { offset: 0xb6, bit: 1, label: "Extra Bubbles", }, // prettier-ignore
                    { offset: 0xa5, bit: 5, label: "Swim Faster", }, // prettier-ignore
                    { offset: 0xa5, bit: 7, label: "Breegull Bash", }, // prettier-ignore
                    { offset: 0xa5, bit: 1, label: "Fire Eggs" }, // prettier-ignore
                    { offset: 0xa2, bit: 5, label: "Fire Eggs related", hidden: true, }, // prettier-ignore
                    { offset: 0xa5, bit: 2, label: "Grenade Eggs" }, // prettier-ignore
                    { offset: 0xa5, bit: 4, label: "Ice Egg" }, // prettier-ignore
                    { offset: 0xa5, bit: 3, label: "Clockwork Kazooie Eggs" }, // prettier-ignore
                    { offset: 0xa2, bit: 3, label: "Egg Aim" }, // prettier-ignore
                    { offset: 0xa2, bit: 2, label: "Breegul Blaster" }, // prettier-ignore
                    { offset: 0xa2, bit: 1, label: "Grip Grab" }, // prettier-ignore
                    { offset: 0xa2, bit: 6, label: "Bill Drill" }, // prettier-ignore
                    { offset: 0xa2, bit: 7, label: "Beak Bayonet" }, // prettier-ignore
                    { offset: 0xa3, bit: 0, label: "Airborne Egg Aiming" }, // prettier-ignore
                    { offset: 0xa3, bit: 1, label: "Split-up" }, // prettier-ignore
                    { offset: 0xa4, bit: 6, label: "Pack Whack" }, // prettier-ignore
                    { offset: 0xa3, bit: 2, label: "Wing Whack" }, // prettier-ignore
                    { offset: 0xa3, bit: 4, label: "Sub-aqua Egg Aiming" }, // prettier-ignore
                    { offset: 0xa3, bit: 5, label: "???", hidden: true, }, // prettier-ignore
                    { offset: 0xa3, bit: 3, label: "Talon Torpedo" }, // prettier-ignore
                    { offset: 0xa4, bit: 3, label: "Springy Step Shoes" }, // prettier-ignore
                    { offset: 0xa4, bit: 5, label: "Hatch" }, // prettier-ignore
                    { offset: 0xa4, bit: 4, label: "Taxi Pack" }, // prettier-ignore
                    { offset: 0xa4, bit: 2, label: "Claw Clamber Boots" }, // prettier-ignore
                    { offset: 0xa4, bit: 1, label: "Leg Spring" }, // prettier-ignore
                    { offset: 0xa4, bit: 0, label: "Snooze Pack" }, // prettier-ignore
                    { offset: 0xa3, bit: 6, label: "Shack Pack" }, // prettier-ignore
                    { offset: 0xa3, bit: 7, label: "Glide" }, // prettier-ignore
                    { offset: 0xa4, bit: 7, label: "Sack Pack" }, // prettier-ignore
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
    languages: {
      0x0: "English",
      0x1: "French",
      0x2: "German",
      0x3: "Spanish",
    },
    optionBoolean: {
      0x0: "Off",
      0x1: "On",
    },
    speakerModes: {
      0x0: "Mono",
      0x1: "Stereo",
      0x2: "Headphone",
      0x3: "Dolby Surround",
    },
  },
};

export default template;
