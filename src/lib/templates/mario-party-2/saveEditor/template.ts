import type { GameJson } from "$lib/types";

const template: GameJson = {
  validator: {
    regions: {
      europe: { 0x0: [0x48, 0x55, 0x44, 0x53, 0x4f, 0x4e] }, // "HUDSON"
      usa: { 0x0: [0x48, 0x55, 0x44, 0x53, 0x4f, 0x4e] }, // "HUDSON"
      japan: { 0x0: [0x48, 0x55, 0x44, 0x53, 0x4f, 0x4e] }, // "HUDSON"
    },
    text: "Drag 'n' drop here or click to add a save file.",
    hint: "If you're having trouble loading a save file from an <b>Everdrive</b> cartridge, please see the FAQ.",
    error: "Not a valid save file.",
  },
  items: [
    {
      name: "Checksum",
      offset: 0x1f8,
      type: "checksum",
      dataType: "uint16",
      bigEndian: true,
      control: {
        offsetStart: 0x8,
        offsetEnd: 0x1fa,
      },
    },
    {
      type: "tabs",
      items: [
        {
          name: "General",
          flex: true,
          items: [
            {
              name: "Coins",
              offset: 0x78,
              type: "variable",
              dataType: "uint32",
              bigEndian: true,
              max: 99999,
              test: true,
            },
            {
              name: "Bowser Land",
              offset: 0x80,
              type: "variable",
              dataType: "bit",
              bit: 1,
              resource: "booleanUnlocked",
            },
            {
              name: "Credits Machine",
              offset: 0x81,
              type: "variable",
              dataType: "bit",
              bit: 3,
              resource: "booleanUnlocked",
            },
          ],
        },
        {
          name: "Boards",
          items: [
            {
              name: "Boards Played",
              type: "bitflags",
              hidden: true,
              flags: [
                { offset: 0x80, bit: 5, label: "Western Land" },
                { offset: 0x80, bit: 6, label: "Pirate Land" },
                { offset: 0x80, bit: 7, label: "Horror Land" },
                { offset: 0x81, bit: 0, label: "Space Land" },
                { offset: 0x81, bit: 1, label: "Mystery Land" },
                { offset: 0x81, bit: 2, label: "Bowser Land" },
              ],
            },
            {
              length: 0x8,
              type: "container",
              instanceType: "tabs",
              instances: 6,
              resource: "boards",
              resourceOrder: true,
              vertical: true,
              items: [
                {
                  name: "Played",
                  offset: 0x36,
                  type: "variable",
                  dataType: "uint16",
                  bigEndian: true,
                  disabled: true,
                },
                {
                  type: "section",
                  flex: true,
                  items: [
                    {
                      id: "boardPlayed-%index%-0",
                      name: "Mario",
                      offset: 0x38,
                      type: "variable",
                      dataType: "uint8",
                      max: 99,
                    },
                    {
                      id: "boardPlayed-%index%-1",
                      name: "Luigi",
                      offset: 0x39,
                      type: "variable",
                      dataType: "uint8",
                      max: 99,
                    },
                    {
                      id: "boardPlayed-%index%-2",
                      name: "Peach",
                      offset: 0x3a,
                      type: "variable",
                      dataType: "uint8",
                      max: 99,
                    },
                    {
                      id: "boardPlayed-%index%-3",
                      name: "Yoshi",
                      offset: 0x3b,
                      type: "variable",
                      dataType: "uint8",
                      max: 99,
                    },
                    {
                      id: "boardPlayed-%index%-4",
                      name: "Wario",
                      offset: 0x3c,
                      type: "variable",
                      dataType: "uint8",
                      max: 99,
                    },
                    {
                      id: "boardPlayed-%index%-5",
                      name: "DK",
                      offset: 0x3d,
                      type: "variable",
                      dataType: "uint8",
                      max: 99,
                    },
                  ],
                },
              ],
            },
          ],
        },
        {
          name: "Mini-Game Land",
          items: [
            {
              type: "section",
              flex: true,
              items: [
                {
                  name: "Driver's Ed (Played)",
                  offset: 0x2b,
                  type: "variable",
                  dataType: "bit",
                  bit: 0,
                  hidden: true,
                },
                {
                  name: "Driver's Ed (Unlocked)",
                  offset: 0x34,
                  type: "variable",
                  dataType: "bit",
                  bit: 0,
                  hidden: true,
                },
              ],
            },
            {
              type: "tabs",
              vertical: true,
              items: [
                {
                  name: "4-Player Mini-Games",
                  flex: true,
                  items: [
                    {
                      id: "minigames-played-4",
                      name: "Played",
                      type: "bitflags",
                      flags: [
                        { offset: 0x28, bit: 4, label: "Lava Tile Isle" },
                        { offset: 0x28, bit: 5, label: "Hot Rope Jump" },
                        { offset: 0x28, bit: 6, label: "Shell Shocked" },
                        { offset: 0x28, bit: 7, label: "TOAD in the Box" },
                        { offset: 0x29, bit: 0, label: "Mecha-Marathon" },
                        { offset: 0x29, bit: 1, label: "Roll Call" },
                        { offset: 0x29, bit: 2, label: "Abandon Ship" },
                        { offset: 0x29, bit: 3, label: "Platform Peril" },
                        { offset: 0x29, bit: 4, label: "Totem Pole Pound" },
                        { offset: 0x29, bit: 5, label: "Bumper Balls" },
                        { offset: 0x29, bit: 6, label: "???", hidden: true },
                        { offset: 0x29, bit: 7, label: "Bombs Away" },
                        { offset: 0x2a, bit: 0, label: "Tipsy Tourney" },
                        { offset: 0x2a, bit: 1, label: "Honeycomb Havoc" },
                        { offset: 0x2a, bit: 2, label: "Hexagon Heat" },
                        { offset: 0x2a, bit: 3, label: "Skateboard Scamper" },
                        { offset: 0x2a, bit: 4, label: "Slot Car Derby" },
                        { offset: 0x2a, bit: 5, label: "Shy Guy Says" },
                        { offset: 0x2a, bit: 6, label: "Sneak 'n' Snore" },
                        { offset: 0x2a, bit: 7, label: "???", hidden: true },
                        { offset: 0x2c, bit: 4, label: "Dizzy Dancing" },
                        { offset: 0x2c, bit: 5, label: "Tile Driver" },
                        { offset: 0x2c, bit: 7, label: "Deep Sea Salvage" },
                      ],
                    },
                    {
                      id: "minigames-bought-13",
                      name: "Bought",
                      type: "bitflags",
                      flags: [
                        { offset: 0x31, bit: 4, label: "Lava Tile Isle" },
                        { offset: 0x31, bit: 5, label: "Hot Rope Jump" },
                        { offset: 0x31, bit: 6, label: "Shell Shocked" },
                        { offset: 0x31, bit: 7, label: "TOAD in the Box" },
                        { offset: 0x32, bit: 0, label: "Mecha-Marathon" },
                        { offset: 0x32, bit: 1, label: "Roll Call" },
                        { offset: 0x32, bit: 2, label: "Abandon Ship" },
                        { offset: 0x32, bit: 3, label: "Platform Peril" },
                        { offset: 0x32, bit: 4, label: "Totem Pole Pound" },
                        { offset: 0x32, bit: 5, label: "Bumper Balls" },
                        { offset: 0x32, bit: 6, label: "???", hidden: true },
                        { offset: 0x32, bit: 7, label: "Bombs Away" },
                        { offset: 0x33, bit: 0, label: "Tipsy Tourney" },
                        { offset: 0x33, bit: 1, label: "Honeycomb Havoc" },
                        { offset: 0x33, bit: 2, label: "Hexagon Heat" },
                        { offset: 0x33, bit: 3, label: "Skateboard Scamper" },
                        { offset: 0x33, bit: 4, label: "Slot Car Derby" },
                        { offset: 0x33, bit: 5, label: "Shy Guy Says" },
                        { offset: 0x33, bit: 6, label: "Sneak 'n' Snore" },
                        { offset: 0x33, bit: 7, label: "???", hidden: true },
                        { offset: 0x35, bit: 4, label: "Dizzy Dancing" },
                        { offset: 0x35, bit: 5, label: "Tile Driver" },
                        { offset: 0x35, bit: 7, label: "Deep Sea Salvage" },
                      ],
                    },
                  ],
                },
                {
                  name: "1 VS 3 Mini-Games",
                  flex: true,
                  items: [
                    {
                      id: "minigames-played-1",
                      name: "Played",
                      type: "bitflags",
                      flags: [
                        { offset: 0x25, bit: 6, label: "Bowl Over" },
                        { offset: 0x26, bit: 0, label: "Crane Game" },
                        { offset: 0x26, bit: 1, label: "Move to the Music" },
                        { offset: 0x26, bit: 2, label: "BOB-OMB Barrage" },
                        { offset: 0x26, bit: 3, label: "Look Away" },
                        { offset: 0x26, bit: 4, label: "Shock Drop or Roll" },
                        { offset: 0x26, bit: 5, label: "Lights Out" },
                        { offset: 0x26, bit: 6, label: "Filet Relay" },
                        { offset: 0x26, bit: 7, label: "Archer-ival" },
                        { offset: 0x27, bit: 0, label: "???", hidden: true },
                        { offset: 0x2c, bit: 6, label: "Quicksand Cache" },
                        { offset: 0x25, bit: 7, label: "Rainbow Run" },
                      ],
                    },
                    {
                      id: "minigames-bought-10",
                      name: "Bought",
                      type: "bitflags",
                      flags: [
                        { offset: 0x2e, bit: 6, label: "Bowl Over" },
                        { offset: 0x2f, bit: 0, label: "Crane Game" },
                        { offset: 0x2f, bit: 1, label: "Move to the Music" },
                        { offset: 0x2f, bit: 2, label: "BOB-OMB Barrage" },
                        { offset: 0x2f, bit: 3, label: "Look Away" },
                        { offset: 0x2f, bit: 4, label: "Shock Drop or Roll" },
                        { offset: 0x2f, bit: 5, label: "Lights Out" },
                        { offset: 0x2f, bit: 6, label: "Filet Relay" },
                        { offset: 0x2f, bit: 7, label: "Archer-ival" },
                        { offset: 0x30, bit: 0, label: "???", hidden: true },
                        { offset: 0x35, bit: 6, label: "Quicksand Cache" },
                        { offset: 0x2e, bit: 7, label: "Rainbow Run" },
                      ],
                    },
                  ],
                },
                {
                  name: "2 VS 2 Mini-Games",
                  flex: true,
                  items: [
                    {
                      id: "minigames-played-3",
                      name: "Played",
                      type: "bitflags",
                      flags: [
                        { offset: 0x27, bit: 1, label: "TOAD Bandstand" },
                        { offset: 0x27, bit: 2, label: "Bobsled Run" },
                        { offset: 0x27, bit: 3, label: "Handcar Havoc" },
                        { offset: 0x27, bit: 4, label: "???", hidden: true },
                        { offset: 0x27, bit: 5, label: "Balloon Burst" },
                        { offset: 0x27, bit: 6, label: "Sky Pilots" },
                        { offset: 0x27, bit: 7, label: "Speed Hockey" },
                        { offset: 0x28, bit: 0, label: "Cake Factory" },
                        { offset: 0x28, bit: 1, label: "???", hidden: true },
                        { offset: 0x28, bit: 3, label: "Magnet Carta" },
                        { offset: 0x2c, bit: 1, label: "Looney Lumberjacks" },
                        { offset: 0x2c, bit: 2, label: "Torpedo Targets" },
                        { offset: 0x2c, bit: 3, label: "Destruction Duet" },
                        { offset: 0x28, bit: 2, label: "Dungeon Dash" },
                      ],
                    },
                    {
                      id: "minigames-bought-12",
                      name: "Bought",
                      type: "bitflags",
                      flags: [
                        { offset: 0x30, bit: 1, label: "TOAD Bandstand" },
                        { offset: 0x30, bit: 2, label: "Bobsled Run" },
                        { offset: 0x30, bit: 3, label: "Handcar Havoc" },
                        { offset: 0x30, bit: 4, label: "???", hidden: true },
                        { offset: 0x30, bit: 5, label: "Balloon Burst" },
                        { offset: 0x30, bit: 6, label: "Sky Pilots" },
                        { offset: 0x30, bit: 7, label: "Speed Hockey" },
                        { offset: 0x31, bit: 0, label: "Cake Factory" },
                        { offset: 0x31, bit: 1, label: "???", hidden: true },
                        { offset: 0x31, bit: 3, label: "Magnet Carta" },
                        { offset: 0x35, bit: 1, label: "Looney Lumberjacks" },
                        { offset: 0x35, bit: 2, label: "Torpedo Targets" },
                        { offset: 0x35, bit: 3, label: "Destruction Duet" },
                        { offset: 0x31, bit: 2, label: "Dungeon Dash" },
                      ],
                    },
                  ],
                },
                {
                  name: "Battle Mini-Games",
                  flex: true,
                  items: [
                    {
                      id: "minigames-played-0",
                      name: "Played",
                      type: "bitflags",
                      flags: [
                        { offset: 0x24, bit: 6, label: "Grab Bag" },
                        { offset: 0x24, bit: 7, label: "Bumper Balloon Cars" },
                        { offset: 0x25, bit: 0, label: "Rakin' 'em In" },
                        { offset: 0x25, bit: 1, label: "???", hidden: true },
                        { offset: 0x25, bit: 2, label: "Day at the Races" },
                        { offset: 0x25, bit: 3, label: "Face Lift" },
                        { offset: 0x25, bit: 4, label: "Crazy Cutters" },
                        { offset: 0x25, bit: 5, label: "Hot BOB-OMB" },
                        { offset: 0x2c, bit: 0, label: "BOWSER's Big Blast" },
                      ],
                    },
                    {
                      id: "minigames-bought-9",
                      name: "Bought",
                      type: "bitflags",
                      flags: [
                        { offset: 0x2d, bit: 6, label: "Grab Bag" },
                        { offset: 0x2d, bit: 7, label: "Bumper Balloon Cars" },
                        { offset: 0x2e, bit: 0, label: "Rakin' 'em In" },
                        { offset: 0x2e, bit: 1, label: "???", hidden: true },
                        { offset: 0x2e, bit: 2, label: "Day at the Races" },
                        { offset: 0x2e, bit: 3, label: "Face Lift" },
                        { offset: 0x2e, bit: 4, label: "Crazy Cutters" },
                        { offset: 0x2e, bit: 5, label: "Hot BOB-OMB" },
                        { offset: 0x35, bit: 0, label: "BOWSER's Big Blast" },
                      ],
                    },
                  ],
                },
                {
                  name: "Item Mini-Games",
                  flex: true,
                  items: [
                    {
                      id: "minigames-played-0",
                      name: "Played",
                      type: "bitflags",
                      flags: [
                        { offset: 0x24, bit: 0, label: "BOWSER Slots" },
                        { offset: 0x24, bit: 1, label: "Roll Out the Barrels" },
                        { offset: 0x24, bit: 2, label: "Coffin Congestion" },
                        { offset: 0x24, bit: 3, label: "Hammer Slammer" },
                        { offset: 0x24, bit: 4, label: "Give Me a Breake!" },
                        { offset: 0x24, bit: 5, label: "Mallet-Go-Round" },
                      ],
                    },
                    {
                      id: "minigames-bought-9",
                      name: "Bought",
                      type: "bitflags",
                      flags: [
                        { offset: 0x2d, bit: 0, label: "BOWSER Slots" },
                        { offset: 0x2d, bit: 1, label: "Roll Out the Barrels" },
                        { offset: 0x2d, bit: 2, label: "Coffin Congestion" },
                        { offset: 0x2d, bit: 3, label: "Hammer Slammer" },
                        { offset: 0x2d, bit: 4, label: "Give Me a Breake!" },
                        { offset: 0x2d, bit: 5, label: "Mallet-Go-Round" },
                      ],
                    },
                  ],
                },
              ],
            },
          ],
        },
        {
          name: "Mini-Game Coaster",
          items: [
            {
              length: 0x12,
              type: "container",
              instanceType: "tabs",
              instances: 2,
              resource: "saveTypes",
              prependSubinstance: [
                {
                  name: "General",
                  items: [
                    {
                      name: "Progression",
                      offset: 0x82,
                      type: "variable",
                      dataType: "uint8",
                      binary: {
                        bitStart: 0,
                        bitLength: 2,
                      },
                      resource: "progressions",
                    },
                  ],
                },
              ],
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
                              name: "Status",
                              offset: 0x1c9,
                              type: "variable",
                              dataType: "bit",
                              bit: 0,
                              resource: "booleanPending",
                            },
                            {
                              name: "Player Character",
                              offset: 0x1c4,
                              type: "variable",
                              dataType: "uint8",
                              resource: "characters",
                            },
                            {
                              name: "Computer Character",
                              offset: 0x1c5,
                              type: "variable",
                              dataType: "uint8",
                              resource: "characters",
                            },
                            {
                              name: "Course",
                              offset: 0x1c8,
                              type: "variable",
                              dataType: "uint8",
                              resource: "courses",
                            },
                          ],
                        },
                        {
                          type: "section",
                          flex: true,
                          items: [
                            {
                              id: "world",
                              name: "World",
                              offset: 0x1c6,
                              type: "variable",
                              dataType: "uint8",
                              operations: [{ "+": 1 }],
                              min: 1,
                              max: 9,
                            },
                            {
                              name: "World (Save Preview)",
                              offset: 0x1d4,
                              type: "variable",
                              dataType: "uint8",
                              hidden: true,
                            },
                            {
                              name: "Lives",
                              offset: 0x1c7,
                              type: "variable",
                              dataType: "uint8",
                              max: 99,
                            },
                            {
                              name: "Coins",
                              offset: 0x1d1,
                              type: "variable",
                              dataType: "uint8",
                              max: 99,
                            },
                            {
                              name: "Consecutive Clears",
                              offset: 0x1d0,
                              type: "variable",
                              dataType: "int8",
                              min: 0,
                            },
                          ],
                        },
                      ],
                    },
                    {
                      name: "Cleared Mini-Games",
                      flex: true,
                      items: [
                        {
                          name: "World 1",
                          type: "bitflags",
                          flags: [
                            { offset: 0x1ca, bit: 1, label: "World 1-1" },
                            { offset: 0x1ca, bit: 2, label: "World 1-2" },
                            { offset: 0x1ca, bit: 3, label: "World 1-3" },
                            { offset: 0x1ca, bit: 4, label: "World 1-4" },
                          ],
                        },
                        {
                          name: "World 2",
                          type: "bitflags",
                          flags: [
                            { offset: 0x1ca, bit: 5, label: "World 2-1" },
                            { offset: 0x1ca, bit: 6, label: "World 2-2" },
                            { offset: 0x1ca, bit: 7, label: "World 2-3" },
                            { offset: 0x1cb, bit: 0, label: "World 2-4" },
                            { offset: 0x1cb, bit: 1, label: "World 2-5" },
                          ],
                        },
                        {
                          name: "World 3",
                          type: "bitflags",
                          flags: [
                            { offset: 0x1cb, bit: 2, label: "World 3-1" },
                            { offset: 0x1cb, bit: 3, label: "World 3-2" },
                            { offset: 0x1cb, bit: 4, label: "World 3-3" },
                            { offset: 0x1cb, bit: 5, label: "World 3-4" },
                          ],
                        },
                        {
                          name: "World 4",
                          type: "bitflags",
                          flags: [
                            { offset: 0x1cb, bit: 6, label: "World 4-1" },
                            { offset: 0x1cb, bit: 7, label: "World 4-2" },
                            { offset: 0x1cc, bit: 0, label: "World 4-3" },
                            { offset: 0x1cc, bit: 1, label: "World 4-4" },
                            { offset: 0x1cc, bit: 2, label: "World 4-5" },
                          ],
                        },
                        {
                          name: "World 5",
                          type: "bitflags",
                          flags: [
                            { offset: 0x1cc, bit: 3, label: "World 5-1" },
                            { offset: 0x1cc, bit: 4, label: "World 5-2" },
                            { offset: 0x1cc, bit: 5, label: "World 5-3" },
                            { offset: 0x1cc, bit: 6, label: "World 5-4" },
                            { offset: 0x1cc, bit: 7, label: "World 5-5" },
                            { offset: 0x1cd, bit: 0, label: "World 5-6" },
                          ],
                        },
                        {
                          name: "World 6",
                          type: "bitflags",
                          flags: [
                            { offset: 0x1cd, bit: 1, label: "World 6-1" },
                            { offset: 0x1cd, bit: 2, label: "World 6-2" },
                            { offset: 0x1cd, bit: 3, label: "World 6-3" },
                            { offset: 0x1cd, bit: 4, label: "World 6-4" },
                            { offset: 0x1cd, bit: 5, label: "World 6-5" },
                            { offset: 0x1cd, bit: 6, label: "World 6-6" },
                          ],
                        },
                        {
                          name: "World 7",
                          type: "bitflags",
                          flags: [
                            { offset: 0x1cd, bit: 7, label: "World 7-1" },
                            { offset: 0x1ce, bit: 0, label: "World 7-2" },
                            { offset: 0x1ce, bit: 1, label: "World 7-3" },
                            { offset: 0x1ce, bit: 2, label: "World 7-4" },
                            { offset: 0x1ce, bit: 3, label: "World 7-5" },
                            { offset: 0x1ce, bit: 4, label: "World 7-6" },
                          ],
                        },
                        {
                          name: "World 8",
                          type: "bitflags",
                          flags: [
                            { offset: 0x1ce, bit: 5, label: "World 8-1" },
                            { offset: 0x1ce, bit: 6, label: "World 8-2" },
                            { offset: 0x1ce, bit: 7, label: "World 8-3" },
                            { offset: 0x1cf, bit: 0, label: "World 8-4" },
                            { offset: 0x1cf, bit: 1, label: "World 8-5" },
                            { offset: 0x1cf, bit: 2, label: "World 8-6" },
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
          name: "Records",
          items: [
            {
              type: "section",
              flex: true,
              items: [
                {
                  name: "Bobsled Run",
                  type: "group",
                  mode: "chrono",
                  items: [
                    {
                      id: "time-50",
                      offset: 0xc,
                      type: "variable",
                      dataType: "uint16",
                      bigEndian: true,
                      operations: [
                        { "/": 50 },
                        {
                          convert: {
                            from: "seconds",
                            to: "minutes",
                          },
                        },
                      ],
                      max: 9,
                    },
                    {
                      id: "time-50",
                      offset: 0xc,
                      type: "variable",
                      dataType: "uint16",
                      bigEndian: true,
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
                    },
                    {
                      id: "time-50",
                      offset: 0xc,
                      type: "variable",
                      dataType: "uint16",
                      bigEndian: true,
                      operations: [
                        { "/": 50 },
                        {
                          convert: {
                            from: "seconds",
                            to: "milliseconds",
                          },
                        },
                      ],
                      leadingZeros: 2,
                      max: 999,
                      step: 100,
                    },
                  ],
                },
                {
                  name: "Handcar Havoc",
                  type: "group",
                  mode: "chrono",
                  items: [
                    {
                      id: "time-50",
                      offset: 0xe,
                      type: "variable",
                      dataType: "uint16",
                      bigEndian: true,
                      operations: [
                        { "/": 50 },
                        {
                          convert: {
                            from: "seconds",
                            to: "minutes",
                          },
                        },
                      ],
                      max: 9,
                    },
                    {
                      id: "time-50",
                      offset: 0xe,
                      type: "variable",
                      dataType: "uint16",
                      bigEndian: true,
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
                    },
                    {
                      id: "time-50",
                      offset: 0xe,
                      type: "variable",
                      dataType: "uint16",
                      bigEndian: true,
                      operations: [
                        { "/": 50 },
                        {
                          convert: {
                            from: "seconds",
                            to: "milliseconds",
                          },
                        },
                      ],
                      leadingZeros: 2,
                      max: 999,
                      step: 100,
                    },
                  ],
                },
                {
                  name: "Sky Pilots",
                  type: "group",
                  mode: "chrono",
                  items: [
                    {
                      id: "time-50",
                      offset: 0x10,
                      type: "variable",
                      dataType: "uint16",
                      bigEndian: true,
                      operations: [
                        { "/": 50 },
                        {
                          convert: {
                            from: "seconds",
                            to: "minutes",
                          },
                        },
                      ],
                      max: 9,
                    },
                    {
                      id: "time-50",
                      offset: 0x10,
                      type: "variable",
                      dataType: "uint16",
                      bigEndian: true,
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
                    },
                    {
                      id: "time-50",
                      offset: 0x10,
                      type: "variable",
                      dataType: "uint16",
                      bigEndian: true,
                      operations: [
                        { "/": 50 },
                        {
                          convert: {
                            from: "seconds",
                            to: "milliseconds",
                          },
                        },
                      ],
                      leadingZeros: 2,
                      max: 999,
                      step: 100,
                    },
                  ],
                },
                {
                  id: "mechaMarathon",
                  name: "Mecha-Marathon",
                  offset: 0x12,
                  type: "variable",
                  dataType: "uint16",
                  bigEndian: true,
                  min: 0.01,
                  max: 127,
                  step: 0.01,
                },
              ],
            },
            {
              type: "section",
              flex: true,
              items: [
                {
                  name: "Slot Car Derby Course 1",
                  type: "group",
                  mode: "chrono",
                  items: [
                    {
                      id: "time-25",
                      offset: 0x14,
                      type: "variable",
                      dataType: "uint16",
                      bigEndian: true,
                      operations: [
                        { "/": 25 },
                        {
                          convert: {
                            from: "seconds",
                            to: "minutes",
                          },
                        },
                      ],
                      max: 9,
                    },
                    {
                      id: "time-25",
                      offset: 0x14,
                      type: "variable",
                      dataType: "uint16",
                      bigEndian: true,
                      operations: [
                        { "/": 25 },
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
                    {
                      id: "time-25",
                      offset: 0x14,
                      type: "variable",
                      dataType: "uint16",
                      bigEndian: true,
                      operations: [
                        { "/": 25 },
                        {
                          convert: {
                            from: "seconds",
                            to: "milliseconds",
                          },
                        },
                      ],
                      leadingZeros: 2,
                      max: 999,
                      step: 100,
                    },
                  ],
                },
                {
                  name: "Slot Car Derby Course 2",
                  type: "group",
                  mode: "chrono",
                  items: [
                    {
                      id: "time-25",
                      offset: 0x16,
                      type: "variable",
                      dataType: "uint16",
                      bigEndian: true,
                      operations: [
                        { "/": 25 },
                        {
                          convert: {
                            from: "seconds",
                            to: "minutes",
                          },
                        },
                      ],
                      max: 9,
                    },
                    {
                      id: "time-25",
                      offset: 0x16,
                      type: "variable",
                      dataType: "uint16",
                      bigEndian: true,
                      operations: [
                        { "/": 25 },
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
                    {
                      id: "time-25",
                      offset: 0x16,
                      type: "variable",
                      dataType: "uint16",
                      bigEndian: true,
                      operations: [
                        { "/": 25 },
                        {
                          convert: {
                            from: "seconds",
                            to: "milliseconds",
                          },
                        },
                      ],
                      leadingZeros: 2,
                      max: 999,
                      step: 100,
                    },
                  ],
                },
                {
                  name: "Slot Car Derby Course 3",
                  type: "group",
                  mode: "chrono",
                  items: [
                    {
                      id: "time-25",
                      offset: 0x18,
                      type: "variable",
                      dataType: "uint16",
                      bigEndian: true,
                      operations: [
                        { "/": 25 },
                        {
                          convert: {
                            from: "seconds",
                            to: "minutes",
                          },
                        },
                      ],
                      max: 9,
                    },
                    {
                      id: "time-25",
                      offset: 0x18,
                      type: "variable",
                      dataType: "uint16",
                      bigEndian: true,
                      operations: [
                        { "/": 25 },
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
                    {
                      id: "time-25",
                      offset: 0x18,
                      type: "variable",
                      dataType: "uint16",
                      bigEndian: true,
                      operations: [
                        { "/": 25 },
                        {
                          convert: {
                            from: "seconds",
                            to: "milliseconds",
                          },
                        },
                      ],
                      leadingZeros: 2,
                      max: 999,
                      step: 100,
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
                  name: "Driver's Ed Course 1",
                  type: "group",
                  mode: "chrono",
                  items: [
                    {
                      id: "driversEd",
                      offset: 0x1a,
                      type: "variable",
                      dataType: "uint8",
                      max: 1,
                    },
                    {
                      offset: 0x1a,
                      type: "variable",
                      dataType: "uint8",
                      binaryCodedDecimal: true,
                      leadingZeros: 1,
                      max: 59,
                      step: 1,
                    },
                    {
                      offset: 0x1b,
                      type: "variable",
                      dataType: "uint8",
                      binaryCodedDecimal: true,
                      leadingZeros: 1,
                      min: 1,
                      max: 99,
                      step: 1,
                    },
                  ],
                },
                {
                  name: "Driver's Ed Course 2",
                  type: "group",
                  mode: "chrono",
                  items: [
                    {
                      id: "driversEd",
                      offset: 0x1c,
                      type: "variable",
                      dataType: "uint8",
                      max: 1,
                    },
                    {
                      offset: 0x1c,
                      type: "variable",
                      dataType: "uint8",
                      binaryCodedDecimal: true,
                      leadingZeros: 1,
                      max: 59,
                      step: 1,
                    },
                    {
                      offset: 0x1d,
                      type: "variable",
                      dataType: "uint8",
                      binaryCodedDecimal: true,
                      leadingZeros: 1,
                      min: 1,
                      max: 99,
                      step: 1,
                    },
                  ],
                },
                {
                  name: "Driver's Ed Course 3",
                  type: "group",
                  mode: "chrono",
                  items: [
                    {
                      id: "driversEd",
                      offset: 0x1e,
                      type: "variable",
                      dataType: "uint8",
                      max: 1,
                    },
                    {
                      offset: 0x1e,
                      type: "variable",
                      dataType: "uint8",
                      binaryCodedDecimal: true,
                      leadingZeros: 1,
                      max: 59,
                      step: 1,
                    },
                    {
                      offset: 0x1f,
                      type: "variable",
                      dataType: "uint8",
                      binaryCodedDecimal: true,
                      leadingZeros: 1,
                      min: 1,
                      max: 99,
                      step: 1,
                    },
                  ],
                },
                {
                  name: "Driver's Ed Course 4",
                  type: "group",
                  mode: "chrono",
                  items: [
                    {
                      id: "driversEd",
                      offset: 0x20,
                      type: "variable",
                      dataType: "uint8",
                      max: 1,
                    },
                    {
                      offset: 0x20,
                      type: "variable",
                      dataType: "uint8",
                      binaryCodedDecimal: true,
                      leadingZeros: 1,
                      max: 59,
                      step: 1,
                    },
                    {
                      offset: 0x21,
                      type: "variable",
                      dataType: "uint8",
                      binaryCodedDecimal: true,
                      leadingZeros: 1,
                      min: 1,
                      max: 99,
                      step: 1,
                    },
                  ],
                },
                {
                  name: "Driver's Ed Course 5",
                  type: "group",
                  mode: "chrono",
                  items: [
                    {
                      id: "driversEd",
                      offset: 0x22,
                      type: "variable",
                      dataType: "uint8",
                      max: 1,
                    },
                    {
                      offset: 0x22,
                      type: "variable",
                      dataType: "uint8",
                      binaryCodedDecimal: true,
                      leadingZeros: 1,
                      max: 59,
                      step: 1,
                    },
                    {
                      offset: 0x23,
                      type: "variable",
                      dataType: "uint8",
                      binaryCodedDecimal: true,
                      leadingZeros: 1,
                      min: 1,
                      max: 99,
                      step: 1,
                    },
                  ],
                },
              ],
            },
          ],
        },
        {
          name: "Option Laboratory",
          flex: true,
          items: [
            {
              id: "language",
              name: "Language",
              offset: 0x9,
              type: "variable",
              dataType: "uint8",
              resource: "languages",
              test: true,
            },
            {
              name: "Sound Settings",
              offset: 0x80,
              type: "variable",
              dataType: "bit",
              bit: 2,
              resource: "sounds",
            },
          ],
        },
      ],
    },
  ],
  resources: {
    boards: {
      0x0: "Western Land",
      0x1: "Pirate Land",
      0x2: "Horror Land",
      0x3: "Space Land",
      0x4: "Mystery Land",
      0x5: "Bowser Land",
    },
    booleanPending: {
      0x0: "-",
      0x1: "Game Pending",
    },
    booleanUnlocked: {
      0x0: "-",
      0x1: "Unlocked",
    },
    characters: {
      0x0: "Mario",
      0x1: "Luigi",
      0x2: "Peach",
      0x3: "Yoshi",
      0x4: "Wario",
      0x5: "DK",
    },
    courses: {
      0x0: "Easy",
      0x1: "Normal",
      0x2: "Hard",
    },
    languages: [
      // Europe
      {
        0x0: "-",
        0x2: "English",
        0x3: "French",
        0x4: "German",
        0x5: "Spanish",
        0x6: "Italian",
      },
      // USA
      {
        0x2: "English",
      },
      // Japan
      {
        0x1: "Japanese",
      },
    ],
    progressions: {
      0x0: "-",
      0x1: "Course Normal Clear",
      0x3: "Course Hard Clear",
    },
    saveTypes: {
      0x0: "Save Space Data",
      0x1: "Save & Quit Data",
    },
    sounds: {
      0x0: "Mono",
      0x1: "Stereo",
    },
  },
  resourcesOrder: {
    boards: [0x1, 0x0, 0x3, 0x4, 0x2, 0x5],
  },
};

export default template;
