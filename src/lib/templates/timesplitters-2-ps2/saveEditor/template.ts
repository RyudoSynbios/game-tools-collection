import type { GameJson } from "$lib/types";

const template: GameJson = {
  validator: {
    regions: {
      europe: {
        0x0: [
          0x42, 0x45, 0x53, 0x4c, 0x45, 0x53, 0x2d, 0x35, 0x30, 0x38, 0x37,
          0x37, 0x2d, 0x54, 0x53, 0x32, 0x2d, 0x4f, 0x50, 0x54,
        ], // "BESLES-50877-TS2-OPT"
      },
      usa: {
        0x0: [
          0x42, 0x41, 0x53, 0x4c, 0x55, 0x53, 0x2d, 0x32, 0x30, 0x33, 0x31,
          0x34, 0x2d, 0x54, 0x53, 0x32, 0x2d, 0x4f, 0x50, 0x54,
        ], // "BASLUS-20314-TS2-OPT"
      },
      japan: {
        0x0: [
          0x42, 0x49, 0x53, 0x4c, 0x50, 0x53, 0x2d, 0x32, 0x35, 0x32, 0x30,
          0x37, 0x2d, 0x54, 0x53, 0x32, 0x2d, 0x4f, 0x50, 0x54,
        ], // "BISLPS-25207-TS2-OPT"
      },
    },
    text: "Drag 'n' drop here or click to add a save file.",
    error: "Not a valid save file.",
  },
  items: [
    {
      type: "section",
      flex: true,
      hidden: true,
      items: [
        {
          name: "Checksum",
          offset: 0x3d350,
          type: "checksum",
          dataType: "uint32",
          control: {
            offsetStart: 0x1c404,
            offsetEnd: 0x3d350,
          },
        },
        {
          id: "profileCount",
          name: "Profiles",
          offset: 0x1c404,
          type: "variable",
          dataType: "uint8",
          resource: "getProfileNames",
          hidden: true,
        },
      ],
    },
    {
      id: "profiles",
      length: 0x20d4,
      type: "container",
      instanceType: "tabs",
      instances: 0,
      resource: "profiles",
      items: [
        {
          type: "tabs",
          items: [
            {
              name: "General",
              items: [
                {
                  name: "Name",
                  offset: 0x1c610,
                  length: 0x8,
                  type: "variable",
                  dataType: "string",
                  letterDataType: "uint8",
                },
              ],
            },
            {
              name: "Challenge",
              items: [
                {
                  type: "tabs",
                  vertical: true,
                  items: [
                    {
                      name: "Glass Smash",
                      items: [
                        {
                          name: "Plane in the Neck",
                          type: "section",
                          flex: true,
                          items: [
                            {
                              name: "Progression",
                              offset: 0x1d7cc,
                              type: "variable",
                              dataType: "uint32",
                              hidden: true,
                            },
                            {
                              name: "Trophy",
                              offset: 0x1d7d8,
                              type: "variable",
                              dataType: "uint32",
                              resource: "trophies",
                            },
                            {
                              name: "Best Time",
                              type: "group",
                              mode: "chrono",
                              items: [
                                {
                                  offset: 0x1d7d0,
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
                                  max: 59,
                                },
                                {
                                  offset: 0x1d7d0,
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
                                },
                                {
                                  offset: 0x1d7d0,
                                  type: "variable",
                                  dataType: "uint32",
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
                          ],
                        },
                      ],
                    },
                  ],
                },
              ],
            },
            {name: "Miscellaneous", flex: true, items: [
              { name: "Name", offset: 0x1c610, length: 0x8, type: "variable", dataType: "string", letterDataType: "uint8" },
              { name: "Control Configuration", offset: 0x1c630, type: "variable", dataType: "uint8" },
              { type: "bitflags", flags: [
                { offset: 0x1c632, bit: 0, label: "Inverse Look" },
                { offset: 0x1c632, bit: 1, label: "Aim Mode" },
                { offset: 0x1c632, bit: 2, label: "Crouch Mode" },
                { offset: 0x1c632, bit: 3, label: "Auto Lookahead" },
                { offset: 0x1c632, bit: 4, label: "Vibration" },
                { offset: 0x1c632, bit: 5, label: "Vibration Mode: Hit" },
                { offset: 0x1c632, bit: 6, label: "Vibration Mode: Fire" },
                { offset: 0x1c632, bit: 7, label: "Auto Aim" },
              ]},
              { name: "Arcade Character", offset: 0x1c6e0, type: "variable", dataType: "uint32" },
              { name: "Weapon Change", offset: 0x1c6e4, type: "variable", dataType: "uint32" },
              { name: "Handicaps", offset: 0x1c6f0, type: "variable", dataType: "uint32" },
              { name: "Always start with gun", offset: 0x1c6f4, type: "variable", dataType: "uint32" },
              { name: "Bag carrier can shoot", offset: 0x1c6f8, type: "variable", dataType: "uint32" },
              { name: "Assistants", offset: 0x1c6fc, type: "variable", dataType: "uint32" },
              { name: "Character Abilities", offset: 0x1c700, type: "variable", dataType: "uint32" },
              { name: "Powerups", offset: 0x1c704, type: "variable", dataType: "uint32" },
              { name: "Score method", offset: 0x1c708, type: "variable", dataType: "uint32" },
              { name: "One shot kill", offset: 0x1c70c, type: "variable", dataType: "uint32" },
              { name: "Friendly fire damage", offset: 0x1c710, type: "variable", dataType: "uint32" },
              { name: "Display Radar", offset: 0x1c72c, type: "variable", dataType: "uint32" },
              { name: "Time limit", offset: 0x1c730, type: "variable", dataType: "uint32" },
              { name: "Display Radar", offset: 0x1c740, type: "variable", dataType: "uint32" },
              { name: "Time limit", offset: 0x1c744, type: "variable", dataType: "uint32" },
              { name: "Score limit", offset: 0x1c748, type: "variable", dataType: "uint32" },
              { name: "Teamplay", offset: 0x1c750, type: "variable", dataType: "uint32" },
              { name: "Display Radar", offset: 0x1c754, type: "variable", dataType: "uint32" },
              { name: "Time limit", offset: 0x1c758, type: "variable", dataType: "uint32" },
              { name: "Score limit", offset: 0x1c75c, type: "variable", dataType: "uint32" },
              { name: "Number of Lives", offset: 0x1c760, type: "variable", dataType: "uint32" },
              { name: "Display Radar", offset: 0x1c77c, type: "variable", dataType: "uint32" },
              { name: "Time limit", offset: 0x1c780, type: "variable", dataType: "uint32" },
              { name: "Display Radar", offset: 0x1c7a4, type: "variable", dataType: "uint32" },
              { name: "Time limit", offset: 0x1c7a8, type: "variable", dataType: "uint32" },
              { name: "Display Radar", offset: 0x1c7b8, type: "variable", dataType: "uint32" },
              { name: "Time limit", offset: 0x1c7bc, type: "variable", dataType: "uint32" },
              { name: "Arcade Custom: Music", offset: 0x1c7c8, type: "variable", dataType: "uint32" },
              { name: "Music", offset: 0x1c7cc, type: "variable", dataType: "uint32" },
              { name: "Sound", offset: 0x1c7d0, type: "variable", dataType: "uint32" },
              { name: "Music Volume", offset: 0x1c7d4, type: "variable", dataType: "uint32" },
              { name: "Sound Volume", offset: 0x1c7d8, type: "variable", dataType: "uint32" },
              { name: "Screen Adjust", offset: 0x1c7dc, type: "variable", dataType: "int32" },
              { name: "Subtitles", offset: 0x1c7e0, type: "variable", dataType: "uint32" },

              // Custom Weapon Sets

              // Custom 1
              { name: "???", offset: 0x1c7e8, type: "variable", dataType: "uint32", hidden: true },
              { name: "Slot 1", offset: 0x1c7ec, type: "variable", dataType: "int32" },
              { name: "Slot 2", offset: 0x1c7f0, type: "variable", dataType: "int32" },
              { name: "Slot 3", offset: 0x1c7f4, type: "variable", dataType: "int32" },
              { name: "Slot 4", offset: 0x1c7f8, type: "variable", dataType: "int32" },
              { name: "Slot 5", offset: 0x1c7fc, type: "variable", dataType: "int32" },

              // Custom 2
              { name: "???", offset: 0x1c82c, type: "variable", dataType: "uint32", hidden: true },
              { name: "Slot 1", offset: 0x1c830, type: "variable", dataType: "int32" },
              { name: "Slot 2", offset: 0x1c834, type: "variable", dataType: "int32" },
              { name: "Slot 3", offset: 0x1c838, type: "variable", dataType: "int32" },
              { name: "Slot 4", offset: 0x1c83c, type: "variable", dataType: "int32" },
              { name: "Slot 5", offset: 0x1c840, type: "variable", dataType: "int32" },

              // Custom 3
              { name: "???", offset: 0x1c870, type: "variable", dataType: "uint32", hidden: true },
              { name: "Slot 1", offset: 0x1c874, type: "variable", dataType: "int32" },
              { name: "Slot 2", offset: 0x1c878, type: "variable", dataType: "int32" },
              { name: "Slot 3", offset: 0x1c87c, type: "variable", dataType: "int32" },
              { name: "Slot 4", offset: 0x1c880, type: "variable", dataType: "int32" },
              { name: "Slot 5", offset: 0x1c884, type: "variable", dataType: "int32" },

              // Custom 4
              { name: "???", offset: 0x1c8b4, type: "variable", dataType: "uint32", hidden: true },
              { name: "Slot 1", offset: 0x1c8b8, type: "variable", dataType: "int32" },
              { name: "Slot 2", offset: 0x1c8bc, type: "variable", dataType: "int32" },
              { name: "Slot 3", offset: 0x1c8c0, type: "variable", dataType: "int32" },
              { name: "Slot 4", offset: 0x1c8c4, type: "variable", dataType: "int32" },
              { name: "Slot 5", offset: 0x1c8c8, type: "variable", dataType: "int32" },

              // Custom 5
              { name: "???", offset: 0x1c8f8, type: "variable", dataType: "uint32", hidden: true },
              { name: "Slot 1", offset: 0x1c8fc, type: "variable", dataType: "int32" },
              { name: "Slot 2", offset: 0x1c900, type: "variable", dataType: "int32" },
              { name: "Slot 3", offset: 0x1c904, type: "variable", dataType: "int32" },
              { name: "Slot 4", offset: 0x1c908, type: "variable", dataType: "int32" },
              { name: "Slot 5", offset: 0x1c90c, type: "variable", dataType: "int32" },

              // Custom Bot Sets

              // Custom 1
              { name: "???", offset: 0x1c938, type: "variable", dataType: "uint32", hidden: true },
              { name: "Slot 1", offset: 0x1c93c, type: "variable", dataType: "int32" },
              { name: "Slot 2", offset: 0x1c940, type: "variable", dataType: "int32" },
              { name: "Slot 3", offset: 0x1c944, type: "variable", dataType: "int32" },
              { name: "Slot 4", offset: 0x1c948, type: "variable", dataType: "int32" },
              { name: "Slot 5", offset: 0x1c94c, type: "variable", dataType: "int32" },
              { name: "Slot 6", offset: 0x1c950, type: "variable", dataType: "int32" },
              { name: "Slot 7", offset: 0x1c954, type: "variable", dataType: "int32" },
              { name: "Slot 8", offset: 0x1c958, type: "variable", dataType: "int32" },
              { name: "Slot 9", offset: 0x1c95c, type: "variable", dataType: "int32" },
              { name: "Slot 10", offset: 0x1c960, type: "variable", dataType: "int32" },

              // Custom 2
              { name: "???", offset: 0x1c9b4, type: "variable", dataType: "uint32", hidden: true },
              { name: "Slot 1", offset: 0x1c9b8, type: "variable", dataType: "int32" },
              { name: "Slot 2", offset: 0x1c9bc, type: "variable", dataType: "int32" },
              { name: "Slot 3", offset: 0x1c9c0, type: "variable", dataType: "int32" },
              { name: "Slot 4", offset: 0x1c9c4, type: "variable", dataType: "int32" },
              { name: "Slot 5", offset: 0x1c9c8, type: "variable", dataType: "int32" },
              { name: "Slot 6", offset: 0x1c9cc, type: "variable", dataType: "int32" },
              { name: "Slot 7", offset: 0x1c9d0, type: "variable", dataType: "int32" },
              { name: "Slot 8", offset: 0x1c9d4, type: "variable", dataType: "int32" },
              { name: "Slot 9", offset: 0x1c9d8, type: "variable", dataType: "int32" },
              { name: "Slot 10", offset: 0x1c9dc, type: "variable", dataType: "int32" },

              // Custom 3
              { name: "???", offset: 0x1ca30, type: "variable", dataType: "uint32", hidden: true },
              { name: "Slot 1", offset: 0x1ca34, type: "variable", dataType: "int32" },
              { name: "Slot 2", offset: 0x1ca38, type: "variable", dataType: "int32" },
              { name: "Slot 3", offset: 0x1ca3c, type: "variable", dataType: "int32" },
              { name: "Slot 4", offset: 0x1ca40, type: "variable", dataType: "int32" },
              { name: "Slot 5", offset: 0x1ca44, type: "variable", dataType: "int32" },
              { name: "Slot 6", offset: 0x1ca48, type: "variable", dataType: "int32" },
              { name: "Slot 7", offset: 0x1ca4c, type: "variable", dataType: "int32" },
              { name: "Slot 8", offset: 0x1ca50, type: "variable", dataType: "int32" },
              { name: "Slot 9", offset: 0x1ca54, type: "variable", dataType: "int32" },
              { name: "Slot 10", offset: 0x1ca58, type: "variable", dataType: "int32" },

              // Custom 4
              { name: "???", offset: 0x1caac, type: "variable", dataType: "uint32", hidden: true },
              { name: "Slot 1", offset: 0x1cab0, type: "variable", dataType: "int32" },
              { name: "Slot 2", offset: 0x1cab4, type: "variable", dataType: "int32" },
              { name: "Slot 3", offset: 0x1cab8, type: "variable", dataType: "int32" },
              { name: "Slot 4", offset: 0x1cabc, type: "variable", dataType: "int32" },
              { name: "Slot 5", offset: 0x1cac0, type: "variable", dataType: "int32" },
              { name: "Slot 6", offset: 0x1cac4, type: "variable", dataType: "int32" },
              { name: "Slot 7", offset: 0x1cac8, type: "variable", dataType: "int32" },
              { name: "Slot 8", offset: 0x1cacc, type: "variable", dataType: "int32" },
              { name: "Slot 9", offset: 0x1cad0, type: "variable", dataType: "int32" },
              { name: "Slot 10", offset: 0x1cad4, type: "variable", dataType: "int32" },

              // Custom 5
              { name: "???", offset: 0x1cb28, type: "variable", dataType: "uint32", hidden: true },
              { name: "Slot 1", offset: 0x1cb2c, type: "variable", dataType: "int32" },
              { name: "Slot 2", offset: 0x1cb30, type: "variable", dataType: "int32" },
              { name: "Slot 3", offset: 0x1cb34, type: "variable", dataType: "int32" },
              { name: "Slot 4", offset: 0x1cb38, type: "variable", dataType: "int32" },
              { name: "Slot 5", offset: 0x1cb3c, type: "variable", dataType: "int32" },
              { name: "Slot 6", offset: 0x1cb40, type: "variable", dataType: "int32" },
              { name: "Slot 7", offset: 0x1cb44, type: "variable", dataType: "int32" },
              { name: "Slot 8", offset: 0x1cb48, type: "variable", dataType: "int32" },
              { name: "Slot 9", offset: 0x1cb4c, type: "variable", dataType: "int32" },
              { name: "Slot 10", offset: 0x1cb50, type: "variable", dataType: "int32" },

              { name: "Weapon Set", offset: 0x1cba4, type: "variable", dataType: "uint32" },
              { name: "Bot Set", offset: 0x1cba8, type: "variable", dataType: "uint32" },
              { name: "Bloodlust", offset: 0x1cbac, type: "variable", dataType: "uint32" },
              { name: "???", offset: 0x1cbb0, type: "variable", dataType: "uint32", hidden: true },
              { name: "???", offset: 0x1cbb4, type: "variable", dataType: "uint32", hidden: true },
              { name: "???", offset: 0x1cbb8, type: "variable", dataType: "uint32", hidden: true },
              { name: "???", offset: 0x1cbbc, type: "variable", dataType: "uint32", hidden: true },
              { name: "???", offset: 0x1cbc0, type: "variable", dataType: "uint32", hidden: true },
              { name: "???", offset: 0x1cbc4, type: "variable", dataType: "uint32", hidden: true },
              { name: "???", offset: 0x1cbc8, type: "variable", dataType: "uint32", hidden: true },
              { name: "???", offset: 0x1cbcc, type: "variable", dataType: "uint32", hidden: true },
              { name: "???", offset: 0x1cbd0, type: "variable", dataType: "uint32", hidden: true },
              { name: "???", offset: 0x1cbd4, type: "variable", dataType: "uint32", hidden: true },
              { name: "???", offset: 0x1cbd8, type: "variable", dataType: "uint32", hidden: true },
              { name: "???", offset: 0x1cbdc, type: "variable", dataType: "uint32", hidden: true },
              { name: "???", offset: 0x1cbe0, type: "variable", dataType: "uint32", hidden: true },
              { name: "???", offset: 0x1cbe4, type: "variable", dataType: "uint32", hidden: true },
              { name: "???", offset: 0x1cbe8, type: "variable", dataType: "uint32", hidden: true },
              { name: "???", offset: 0x1cbec, type: "variable", dataType: "uint32", hidden: true },
              { name: "???", offset: 0x1cbf0, type: "variable", dataType: "uint32", hidden: true },
              { name: "???", offset: 0x1cbf4, type: "variable", dataType: "uint32", hidden: true },
              { name: "???", offset: 0x1cbf8, type: "variable", dataType: "uint32", hidden: true },
              { name: "???", offset: 0x1cbfc, type: "variable", dataType: "uint32", hidden: true },
              { name: "???", offset: 0x1cc00, type: "variable", dataType: "uint32", hidden: true },
              { name: "???", offset: 0x1cc04, type: "variable", dataType: "uint32", hidden: true },
              { name: "???", offset: 0x1cc08, type: "variable", dataType: "uint32", hidden: true },
              { name: "???", offset: 0x1cc0c, type: "variable", dataType: "uint32", hidden: true },
              { name: "???", offset: 0x1cc10, type: "variable", dataType: "uint32", hidden: true },
              { name: "???", offset: 0x1cc14, type: "variable", dataType: "uint32", hidden: true },
              { name: "???", offset: 0x1cc18, type: "variable", dataType: "uint32", hidden: true },
              { name: "???", offset: 0x1cc1c, type: "variable", dataType: "uint32", hidden: true },
              { name: "???", offset: 0x1cc20, type: "variable", dataType: "uint32", hidden: true },
              { name: "???", offset: 0x1cc24, type: "variable", dataType: "uint32", hidden: true },

              // Bot Set Status

              // Recommended Bot
              { name: "Slot 1", offset: 0x1cc28, type: "variable", dataType: "uint32" },
              { name: "Slot 2", offset: 0x1cc2c, type: "variable", dataType: "uint32" },
              { name: "Slot 3", offset: 0x1cc30, type: "variable", dataType: "uint32" },
              { name: "Slot 4", offset: 0x1cc34, type: "variable", dataType: "uint32" },
              { name: "Slot 5", offset: 0x1cc38, type: "variable", dataType: "uint32" },
              { name: "Slot 6", offset: 0x1cc3c, type: "variable", dataType: "uint32" },
              { name: "Slot 7", offset: 0x1cc40, type: "variable", dataType: "uint32" },
              { name: "Slot 8", offset: 0x1cc44, type: "variable", dataType: "uint32" },
              { name: "Slot 9", offset: 0x1cc48, type: "variable", dataType: "uint32" },
              { name: "Slot 10", offset: 0x1cc4c, type: "variable", dataType: "uint32" },
              { name: "???", offset: 0x1cc50, type: "variable", dataType: "uint32", hidden: true },
              { name: "???", offset: 0x1cc54, type: "variable", dataType: "uint32", hidden: true },
              { name: "???", offset: 0x1cc58, type: "variable", dataType: "uint32", hidden: true },
              { name: "???", offset: 0x1cc5c, type: "variable", dataType: "uint32", hidden: true },
              { name: "???", offset: 0x1cc60, type: "variable", dataType: "uint32", hidden: true },
              { name: "???", offset: 0x1cc64, type: "variable", dataType: "uint32", hidden: true },
              { name: "???", offset: 0x1cc68, type: "variable", dataType: "uint32", hidden: true },
              { name: "???", offset: 0x1cc6c, type: "variable", dataType: "uint32", hidden: true },
              { name: "???", offset: 0x1cc70, type: "variable", dataType: "uint32", hidden: true },
              { name: "???", offset: 0x1cc74, type: "variable", dataType: "uint32", hidden: true },
              { name: "???", offset: 0x1cc78, type: "variable", dataType: "uint32", hidden: true },
              { name: "???", offset: 0x1cc7c, type: "variable", dataType: "uint32", hidden: true },
              { name: "???", offset: 0x1cc80, type: "variable", dataType: "uint32", hidden: true },
              { name: "???", offset: 0x1cc84, type: "variable", dataType: "uint32", hidden: true },
              { name: "???", offset: 0x1cc88, type: "variable", dataType: "uint32", hidden: true },
              { name: "???", offset: 0x1cc8c, type: "variable", dataType: "uint32", hidden: true },
              { name: "???", offset: 0x1cc90, type: "variable", dataType: "uint32", hidden: true },
              { name: "???", offset: 0x1cc94, type: "variable", dataType: "uint32", hidden: true },
              { name: "???", offset: 0x1cc98, type: "variable", dataType: "uint32", hidden: true },
              { name: "???", offset: 0x1cc9c, type: "variable", dataType: "uint32", hidden: true },

              // Misfits Bot
              { name: "Slot 1", offset: 0x1cca0, type: "variable", dataType: "uint32" },
              { name: "Slot 2", offset: 0x1cca4, type: "variable", dataType: "uint32" },
              { name: "Slot 3", offset: 0x1cca8, type: "variable", dataType: "uint32" },
              { name: "Slot 4", offset: 0x1ccac, type: "variable", dataType: "uint32" },
              { name: "Slot 5", offset: 0x1ccb0, type: "variable", dataType: "uint32" },
              { name: "Slot 6", offset: 0x1ccb4, type: "variable", dataType: "uint32" },
              { name: "Slot 7", offset: 0x1ccb8, type: "variable", dataType: "uint32" },
              { name: "Slot 8", offset: 0x1ccbc, type: "variable", dataType: "uint32" },
              { name: "Slot 9", offset: 0x1ccc0, type: "variable", dataType: "uint32" },
              { name: "Slot 10", offset: 0x1ccc4, type: "variable", dataType: "uint32" },
              { name: "???", offset: 0x1ccc8, type: "variable", dataType: "uint32", hidden: true },
              { name: "???", offset: 0x1cccc, type: "variable", dataType: "uint32", hidden: true },
              { name: "???", offset: 0x1ccd0, type: "variable", dataType: "uint32", hidden: true },
              { name: "???", offset: 0x1ccd4, type: "variable", dataType: "uint32", hidden: true },
              { name: "???", offset: 0x1ccd8, type: "variable", dataType: "uint32", hidden: true },
              { name: "???", offset: 0x1ccdc, type: "variable", dataType: "uint32", hidden: true },
              { name: "???", offset: 0x1cce0, type: "variable", dataType: "uint32", hidden: true },
              { name: "???", offset: 0x1cce4, type: "variable", dataType: "uint32", hidden: true },
              { name: "???", offset: 0x1cce8, type: "variable", dataType: "uint32", hidden: true },
              { name: "???", offset: 0x1ccec, type: "variable", dataType: "uint32", hidden: true },
              { name: "???", offset: 0x1ccf0, type: "variable", dataType: "uint32", hidden: true },
              { name: "???", offset: 0x1ccf4, type: "variable", dataType: "uint32", hidden: true },
              { name: "???", offset: 0x1ccf8, type: "variable", dataType: "uint32", hidden: true },
              { name: "???", offset: 0x1ccfc, type: "variable", dataType: "uint32", hidden: true },
              { name: "???", offset: 0x1cd00, type: "variable", dataType: "uint32", hidden: true },
              { name: "???", offset: 0x1cd04, type: "variable", dataType: "uint32", hidden: true },
              { name: "???", offset: 0x1cd08, type: "variable", dataType: "uint32", hidden: true },
              { name: "???", offset: 0x1cd0c, type: "variable", dataType: "uint32", hidden: true },
              { name: "???", offset: 0x1cd10, type: "variable", dataType: "uint32", hidden: true },
              { name: "???", offset: 0x1cd14, type: "variable", dataType: "uint32", hidden: true },

              // Freaks Bot
              { name: "Slot 1", offset: 0x1cd18, type: "variable", dataType: "uint32" },
              { name: "Slot 2", offset: 0x1cd1c, type: "variable", dataType: "uint32" },
              { name: "Slot 3", offset: 0x1cd20, type: "variable", dataType: "uint32" },
              { name: "Slot 4", offset: 0x1cd24, type: "variable", dataType: "uint32" },
              { name: "Slot 5", offset: 0x1cd28, type: "variable", dataType: "uint32" },
              { name: "Slot 6", offset: 0x1cd2c, type: "variable", dataType: "uint32" },
              { name: "Slot 7", offset: 0x1cd30, type: "variable", dataType: "uint32" },
              { name: "Slot 8", offset: 0x1cd34, type: "variable", dataType: "uint32" },
              { name: "Slot 9", offset: 0x1cd38, type: "variable", dataType: "uint32" },
              { name: "Slot 10", offset: 0x1cd3c, type: "variable", dataType: "uint32" },
              { name: "???", offset: 0x1cd40, type: "variable", dataType: "uint32", hidden: true },
              { name: "???", offset: 0x1cd44, type: "variable", dataType: "uint32", hidden: true },
              { name: "???", offset: 0x1cd48, type: "variable", dataType: "uint32", hidden: true },
              { name: "???", offset: 0x1cd4c, type: "variable", dataType: "uint32", hidden: true },
              { name: "???", offset: 0x1cd50, type: "variable", dataType: "uint32", hidden: true },
              { name: "???", offset: 0x1cd54, type: "variable", dataType: "uint32", hidden: true },
              { name: "???", offset: 0x1cd58, type: "variable", dataType: "uint32", hidden: true },
              { name: "???", offset: 0x1cd5c, type: "variable", dataType: "uint32", hidden: true },
              { name: "???", offset: 0x1cd60, type: "variable", dataType: "uint32", hidden: true },
              { name: "???", offset: 0x1cd64, type: "variable", dataType: "uint32", hidden: true },
              { name: "???", offset: 0x1cd68, type: "variable", dataType: "uint32", hidden: true },
              { name: "???", offset: 0x1cd6c, type: "variable", dataType: "uint32", hidden: true },
              { name: "???", offset: 0x1cd70, type: "variable", dataType: "uint32", hidden: true },
              { name: "???", offset: 0x1cd74, type: "variable", dataType: "uint32", hidden: true },
              { name: "???", offset: 0x1cd78, type: "variable", dataType: "uint32", hidden: true },
              { name: "???", offset: 0x1cd7c, type: "variable", dataType: "uint32", hidden: true },
              { name: "???", offset: 0x1cd80, type: "variable", dataType: "uint32", hidden: true },
              { name: "???", offset: 0x1cd84, type: "variable", dataType: "uint32", hidden: true },
              { name: "???", offset: 0x1cd88, type: "variable", dataType: "uint32", hidden: true },
              { name: "???", offset: 0x1cd8c, type: "variable", dataType: "uint32", hidden: true },

              // The Living Dead Bot
              { name: "Slot 1", offset: 0x1cd90, type: "variable", dataType: "uint32" },
              { name: "Slot 2", offset: 0x1cd94, type: "variable", dataType: "uint32" },
              { name: "Slot 3", offset: 0x1cd98, type: "variable", dataType: "uint32" },
              { name: "Slot 4", offset: 0x1cd9c, type: "variable", dataType: "uint32" },
              { name: "Slot 5", offset: 0x1cda0, type: "variable", dataType: "uint32" },
              { name: "Slot 6", offset: 0x1cda4, type: "variable", dataType: "uint32" },
              { name: "Slot 7", offset: 0x1cda8, type: "variable", dataType: "uint32" },
              { name: "Slot 8", offset: 0x1cdac, type: "variable", dataType: "uint32" },
              { name: "Slot 9", offset: 0x1cdb0, type: "variable", dataType: "uint32" },
              { name: "Slot 10", offset: 0x1cdb4, type: "variable", dataType: "uint32" },
              { name: "???", offset: 0x1cdb8, type: "variable", dataType: "uint32", hidden: true },
              { name: "???", offset: 0x1cdbc, type: "variable", dataType: "uint32", hidden: true },
              { name: "???", offset: 0x1cdc0, type: "variable", dataType: "uint32", hidden: true },
              { name: "???", offset: 0x1cdc4, type: "variable", dataType: "uint32", hidden: true },
              { name: "???", offset: 0x1cdc8, type: "variable", dataType: "uint32", hidden: true },
              { name: "???", offset: 0x1cdcc, type: "variable", dataType: "uint32", hidden: true },
              { name: "???", offset: 0x1cdd0, type: "variable", dataType: "uint32", hidden: true },
              { name: "???", offset: 0x1cdd4, type: "variable", dataType: "uint32", hidden: true },
              { name: "???", offset: 0x1cdd8, type: "variable", dataType: "uint32", hidden: true },
              { name: "???", offset: 0x1cddc, type: "variable", dataType: "uint32", hidden: true },
              { name: "???", offset: 0x1cde0, type: "variable", dataType: "uint32", hidden: true },
              { name: "???", offset: 0x1cde4, type: "variable", dataType: "uint32", hidden: true },
              { name: "???", offset: 0x1cde8, type: "variable", dataType: "uint32", hidden: true },
              { name: "???", offset: 0x1cdec, type: "variable", dataType: "uint32", hidden: true },
              { name: "???", offset: 0x1cdf0, type: "variable", dataType: "uint32", hidden: true },
              { name: "???", offset: 0x1cdf4, type: "variable", dataType: "uint32", hidden: true },
              { name: "???", offset: 0x1cdf8, type: "variable", dataType: "uint32", hidden: true },
              { name: "???", offset: 0x1cdfc, type: "variable", dataType: "uint32", hidden: true },
              { name: "???", offset: 0x1ce00, type: "variable", dataType: "uint32", hidden: true },
              { name: "???", offset: 0x1ce04, type: "variable", dataType: "uint32", hidden: true },

              // Lovely Ladies Bot
              { name: "Slot 1", offset: 0x1ce08, type: "variable", dataType: "uint32" },
              { name: "Slot 2", offset: 0x1ce0c, type: "variable", dataType: "uint32" },
              { name: "Slot 3", offset: 0x1ce10, type: "variable", dataType: "uint32" },
              { name: "Slot 4", offset: 0x1ce14, type: "variable", dataType: "uint32" },
              { name: "Slot 5", offset: 0x1ce18, type: "variable", dataType: "uint32" },
              { name: "Slot 6", offset: 0x1ce1c, type: "variable", dataType: "uint32" },
              { name: "Slot 7", offset: 0x1ce20, type: "variable", dataType: "uint32" },
              { name: "Slot 8", offset: 0x1ce24, type: "variable", dataType: "uint32" },
              { name: "Slot 9", offset: 0x1ce28, type: "variable", dataType: "uint32" },
              { name: "Slot 10", offset: 0x1ce2c, type: "variable", dataType: "uint32" },
              { name: "???", offset: 0x1ce30, type: "variable", dataType: "uint32", hidden: true },
              { name: "???", offset: 0x1ce34, type: "variable", dataType: "uint32", hidden: true },
              { name: "???", offset: 0x1ce38, type: "variable", dataType: "uint32", hidden: true },
              { name: "???", offset: 0x1ce3c, type: "variable", dataType: "uint32", hidden: true },
              { name: "???", offset: 0x1ce40, type: "variable", dataType: "uint32", hidden: true },
              { name: "???", offset: 0x1ce44, type: "variable", dataType: "uint32", hidden: true },
              { name: "???", offset: 0x1ce48, type: "variable", dataType: "uint32", hidden: true },
              { name: "???", offset: 0x1ce4c, type: "variable", dataType: "uint32", hidden: true },
              { name: "???", offset: 0x1ce50, type: "variable", dataType: "uint32", hidden: true },
              { name: "???", offset: 0x1ce54, type: "variable", dataType: "uint32", hidden: true },
              { name: "???", offset: 0x1ce58, type: "variable", dataType: "uint32", hidden: true },
              { name: "???", offset: 0x1ce5c, type: "variable", dataType: "uint32", hidden: true },
              { name: "???", offset: 0x1ce60, type: "variable", dataType: "uint32", hidden: true },
              { name: "???", offset: 0x1ce64, type: "variable", dataType: "uint32", hidden: true },
              { name: "???", offset: 0x1ce68, type: "variable", dataType: "uint32", hidden: true },
              { name: "???", offset: 0x1ce6c, type: "variable", dataType: "uint32", hidden: true },
              { name: "???", offset: 0x1ce70, type: "variable", dataType: "uint32", hidden: true },
              { name: "???", offset: 0x1ce74, type: "variable", dataType: "uint32", hidden: true },
              { name: "???", offset: 0x1ce78, type: "variable", dataType: "uint32", hidden: true },
              { name: "???", offset: 0x1ce7c, type: "variable", dataType: "uint32", hidden: true },

              // Military Bot
              { name: "Slot 1", offset: 0x1ce80, type: "variable", dataType: "uint32" },
              { name: "Slot 2", offset: 0x1ce84, type: "variable", dataType: "uint32" },
              { name: "Slot 3", offset: 0x1ce88, type: "variable", dataType: "uint32" },
              { name: "Slot 4", offset: 0x1ce8c, type: "variable", dataType: "uint32" },
              { name: "Slot 5", offset: 0x1ce90, type: "variable", dataType: "uint32" },
              { name: "Slot 6", offset: 0x1ce94, type: "variable", dataType: "uint32" },
              { name: "Slot 7", offset: 0x1ce98, type: "variable", dataType: "uint32" },
              { name: "Slot 8", offset: 0x1ce9c, type: "variable", dataType: "uint32" },
              { name: "Slot 9", offset: 0x1cea0, type: "variable", dataType: "uint32" },
              { name: "Slot 10", offset: 0x1cea4, type: "variable", dataType: "uint32" },
              { name: "???", offset: 0x1cea8, type: "variable", dataType: "uint32", hidden: true },
              { name: "???", offset: 0x1ceac, type: "variable", dataType: "uint32", hidden: true },
              { name: "???", offset: 0x1ceb0, type: "variable", dataType: "uint32", hidden: true },
              { name: "???", offset: 0x1ceb4, type: "variable", dataType: "uint32", hidden: true },
              { name: "???", offset: 0x1ceb8, type: "variable", dataType: "uint32", hidden: true },
              { name: "???", offset: 0x1cebc, type: "variable", dataType: "uint32", hidden: true },
              { name: "???", offset: 0x1cec0, type: "variable", dataType: "uint32", hidden: true },
              { name: "???", offset: 0x1cec4, type: "variable", dataType: "uint32", hidden: true },
              { name: "???", offset: 0x1cec8, type: "variable", dataType: "uint32", hidden: true },
              { name: "???", offset: 0x1cecc, type: "variable", dataType: "uint32", hidden: true },
              { name: "???", offset: 0x1ced0, type: "variable", dataType: "uint32", hidden: true },
              { name: "???", offset: 0x1ced4, type: "variable", dataType: "uint32", hidden: true },
              { name: "???", offset: 0x1ced8, type: "variable", dataType: "uint32", hidden: true },
              { name: "???", offset: 0x1cedc, type: "variable", dataType: "uint32", hidden: true },
              { name: "???", offset: 0x1cee0, type: "variable", dataType: "uint32", hidden: true },
              { name: "???", offset: 0x1cee4, type: "variable", dataType: "uint32", hidden: true },
              { name: "???", offset: 0x1cee8, type: "variable", dataType: "uint32", hidden: true },
              { name: "???", offset: 0x1ceec, type: "variable", dataType: "uint32", hidden: true },
              { name: "???", offset: 0x1cef0, type: "variable", dataType: "uint32", hidden: true },
              { name: "???", offset: 0x1cef4, type: "variable", dataType: "uint32", hidden: true },

              // Classic
              { name: "Slot 1", offset: 0x1cef8, type: "variable", dataType: "uint32" },
              { name: "Slot 2", offset: 0x1cefc, type: "variable", dataType: "uint32" },
              { name: "Slot 3", offset: 0x1cf00, type: "variable", dataType: "uint32" },
              { name: "Slot 4", offset: 0x1cf04, type: "variable", dataType: "uint32" },
              { name: "Slot 5", offset: 0x1cf08, type: "variable", dataType: "uint32" },
              { name: "Slot 6", offset: 0x1cf0c, type: "variable", dataType: "uint32" },
              { name: "Slot 7", offset: 0x1cf10, type: "variable", dataType: "uint32" },
              { name: "Slot 8", offset: 0x1cf14, type: "variable", dataType: "uint32" },
              { name: "Slot 9", offset: 0x1cf18, type: "variable", dataType: "uint32" },
              { name: "Slot 10", offset: 0x1cf1c, type: "variable", dataType: "uint32" },
              { name: "???", offset: 0x1cf20, type: "variable", dataType: "uint32", hidden: true },
              { name: "???", offset: 0x1cf24, type: "variable", dataType: "uint32", hidden: true },
              { name: "???", offset: 0x1cf28, type: "variable", dataType: "uint32", hidden: true },
              { name: "???", offset: 0x1cf2c, type: "variable", dataType: "uint32", hidden: true },
              { name: "???", offset: 0x1cf30, type: "variable", dataType: "uint32", hidden: true },
              { name: "???", offset: 0x1cf34, type: "variable", dataType: "uint32", hidden: true },
              { name: "???", offset: 0x1cf38, type: "variable", dataType: "uint32", hidden: true },
              { name: "???", offset: 0x1cf3c, type: "variable", dataType: "uint32", hidden: true },
              { name: "???", offset: 0x1cf40, type: "variable", dataType: "uint32", hidden: true },
              { name: "???", offset: 0x1cf44, type: "variable", dataType: "uint32", hidden: true },
              { name: "???", offset: 0x1cf48, type: "variable", dataType: "uint32", hidden: true },
              { name: "???", offset: 0x1cf4c, type: "variable", dataType: "uint32", hidden: true },
              { name: "???", offset: 0x1cf50, type: "variable", dataType: "uint32", hidden: true },
              { name: "???", offset: 0x1cf54, type: "variable", dataType: "uint32", hidden: true },
              { name: "???", offset: 0x1cf58, type: "variable", dataType: "uint32", hidden: true },
              { name: "???", offset: 0x1cf5c, type: "variable", dataType: "uint32", hidden: true },
              { name: "???", offset: 0x1cf60, type: "variable", dataType: "uint32", hidden: true },
              { name: "???", offset: 0x1cf64, type: "variable", dataType: "uint32", hidden: true },
              { name: "???", offset: 0x1cf68, type: "variable", dataType: "uint32", hidden: true },
              { name: "???", offset: 0x1cf6c, type: "variable", dataType: "uint32", hidden: true },

              // Leads
              { name: "Slot 1", offset: 0x1cf70, type: "variable", dataType: "uint32" },
              { name: "Slot 2", offset: 0x1cf74, type: "variable", dataType: "uint32" },
              { name: "Slot 3", offset: 0x1cf78, type: "variable", dataType: "uint32" },
              { name: "Slot 4", offset: 0x1cf7c, type: "variable", dataType: "uint32" },
              { name: "Slot 5", offset: 0x1cf80, type: "variable", dataType: "uint32" },
              { name: "Slot 6", offset: 0x1cf84, type: "variable", dataType: "uint32" },
              { name: "Slot 7", offset: 0x1cf88, type: "variable", dataType: "uint32" },
              { name: "Slot 8", offset: 0x1cf8c, type: "variable", dataType: "uint32" },
              { name: "Slot 9", offset: 0x1cf90, type: "variable", dataType: "uint32" },
              { name: "Slot 10", offset: 0x1cf94, type: "variable", dataType: "uint32" },
              { name: "???", offset: 0x1cf98, type: "variable", dataType: "uint32", hidden: true },
              { name: "???", offset: 0x1cf9c, type: "variable", dataType: "uint32", hidden: true },
              { name: "???", offset: 0x1cfa0, type: "variable", dataType: "uint32", hidden: true },
              { name: "???", offset: 0x1cfa4, type: "variable", dataType: "uint32", hidden: true },
              { name: "???", offset: 0x1cfa8, type: "variable", dataType: "uint32", hidden: true },
              { name: "???", offset: 0x1cfac, type: "variable", dataType: "uint32", hidden: true },
              { name: "???", offset: 0x1cfb0, type: "variable", dataType: "uint32", hidden: true },
              { name: "???", offset: 0x1cfb4, type: "variable", dataType: "uint32", hidden: true },
              { name: "???", offset: 0x1cfb8, type: "variable", dataType: "uint32", hidden: true },
              { name: "???", offset: 0x1cfbc, type: "variable", dataType: "uint32", hidden: true },
              { name: "???", offset: 0x1cfc0, type: "variable", dataType: "uint32", hidden: true },
              { name: "???", offset: 0x1cfc4, type: "variable", dataType: "uint32", hidden: true },
              { name: "???", offset: 0x1cfc8, type: "variable", dataType: "uint32", hidden: true },
              { name: "???", offset: 0x1cfcc, type: "variable", dataType: "uint32", hidden: true },
              { name: "???", offset: 0x1cfd0, type: "variable", dataType: "uint32", hidden: true },
              { name: "???", offset: 0x1cfd4, type: "variable", dataType: "uint32", hidden: true },
              { name: "???", offset: 0x1cfd8, type: "variable", dataType: "uint32", hidden: true },
              { name: "???", offset: 0x1cfdc, type: "variable", dataType: "uint32", hidden: true },
              { name: "???", offset: 0x1cfe0, type: "variable", dataType: "uint32", hidden: true },
              { name: "???", offset: 0x1cfe4, type: "variable", dataType: "uint32", hidden: true },

              // Sidekicks
              { name: "Slot 1", offset: 0x1cfe8, type: "variable", dataType: "uint32" },
              { name: "Slot 2", offset: 0x1cfec, type: "variable", dataType: "uint32" },
              { name: "Slot 3", offset: 0x1cff0, type: "variable", dataType: "uint32" },
              { name: "Slot 4", offset: 0x1cff4, type: "variable", dataType: "uint32" },
              { name: "Slot 5", offset: 0x1cff8, type: "variable", dataType: "uint32" },
              { name: "Slot 6", offset: 0x1cffc, type: "variable", dataType: "uint32" },
              { name: "Slot 7", offset: 0x1d000, type: "variable", dataType: "uint32" },
              { name: "Slot 8", offset: 0x1d004, type: "variable", dataType: "uint32" },
              { name: "Slot 9", offset: 0x1d008, type: "variable", dataType: "uint32" },
              { name: "Slot 10", offset: 0x1d00c, type: "variable", dataType: "uint32" },
              { name: "???", offset: 0x1d010, type: "variable", dataType: "uint32", hidden: true },
              { name: "???", offset: 0x1d014, type: "variable", dataType: "uint32", hidden: true },
              { name: "???", offset: 0x1d018, type: "variable", dataType: "uint32", hidden: true },
              { name: "???", offset: 0x1d01c, type: "variable", dataType: "uint32", hidden: true },
              { name: "???", offset: 0x1d020, type: "variable", dataType: "uint32", hidden: true },
              { name: "???", offset: 0x1d024, type: "variable", dataType: "uint32", hidden: true },
              { name: "???", offset: 0x1d028, type: "variable", dataType: "uint32", hidden: true },
              { name: "???", offset: 0x1d02c, type: "variable", dataType: "uint32", hidden: true },
              { name: "???", offset: 0x1d030, type: "variable", dataType: "uint32", hidden: true },
              { name: "???", offset: 0x1d034, type: "variable", dataType: "uint32", hidden: true },
              { name: "???", offset: 0x1d038, type: "variable", dataType: "uint32", hidden: true },
              { name: "???", offset: 0x1d03c, type: "variable", dataType: "uint32", hidden: true },
              { name: "???", offset: 0x1d040, type: "variable", dataType: "uint32", hidden: true },
              { name: "???", offset: 0x1d044, type: "variable", dataType: "uint32", hidden: true },
              { name: "???", offset: 0x1d048, type: "variable", dataType: "uint32", hidden: true },
              { name: "???", offset: 0x1d04c, type: "variable", dataType: "uint32", hidden: true },
              { name: "???", offset: 0x1d050, type: "variable", dataType: "uint32", hidden: true },
              { name: "???", offset: 0x1d054, type: "variable", dataType: "uint32", hidden: true },
              { name: "???", offset: 0x1d058, type: "variable", dataType: "uint32", hidden: true },
              { name: "???", offset: 0x1d05c, type: "variable", dataType: "uint32", hidden: true },

              // Hairy Faces
              { name: "Slot 1", offset: 0x1d060, type: "variable", dataType: "uint32" },
              { name: "Slot 2", offset: 0x1d064, type: "variable", dataType: "uint32" },
              { name: "Slot 3", offset: 0x1d068, type: "variable", dataType: "uint32" },
              { name: "Slot 4", offset: 0x1d06c, type: "variable", dataType: "uint32" },
              { name: "Slot 5", offset: 0x1d070, type: "variable", dataType: "uint32" },
              { name: "Slot 6", offset: 0x1d074, type: "variable", dataType: "uint32" },
              { name: "Slot 7", offset: 0x1d078, type: "variable", dataType: "uint32" },
              { name: "Slot 8", offset: 0x1d07c, type: "variable", dataType: "uint32" },
              { name: "Slot 9", offset: 0x1d080, type: "variable", dataType: "uint32" },
              { name: "Slot 10", offset: 0x1d084, type: "variable", dataType: "uint32" },
              { name: "???", offset: 0x1d088, type: "variable", dataType: "uint32", hidden: true },
              { name: "???", offset: 0x1d08c, type: "variable", dataType: "uint32", hidden: true },
              { name: "???", offset: 0x1d090, type: "variable", dataType: "uint32", hidden: true },
              { name: "???", offset: 0x1d094, type: "variable", dataType: "uint32", hidden: true },
              { name: "???", offset: 0x1d098, type: "variable", dataType: "uint32", hidden: true },
              { name: "???", offset: 0x1d09c, type: "variable", dataType: "uint32", hidden: true },
              { name: "???", offset: 0x1d0a0, type: "variable", dataType: "uint32", hidden: true },
              { name: "???", offset: 0x1d0a4, type: "variable", dataType: "uint32", hidden: true },
              { name: "???", offset: 0x1d0a8, type: "variable", dataType: "uint32", hidden: true },
              { name: "???", offset: 0x1d0ac, type: "variable", dataType: "uint32", hidden: true },
              { name: "???", offset: 0x1d0b0, type: "variable", dataType: "uint32", hidden: true },
              { name: "???", offset: 0x1d0b4, type: "variable", dataType: "uint32", hidden: true },
              { name: "???", offset: 0x1d0b8, type: "variable", dataType: "uint32", hidden: true },
              { name: "???", offset: 0x1d0bc, type: "variable", dataType: "uint32", hidden: true },
              { name: "???", offset: 0x1d0c0, type: "variable", dataType: "uint32", hidden: true },
              { name: "???", offset: 0x1d0c4, type: "variable", dataType: "uint32", hidden: true },
              { name: "???", offset: 0x1d0c8, type: "variable", dataType: "uint32", hidden: true },
              { name: "???", offset: 0x1d0cc, type: "variable", dataType: "uint32", hidden: true },
              { name: "???", offset: 0x1d0d0, type: "variable", dataType: "uint32", hidden: true },
              { name: "???", offset: 0x1d0d4, type: "variable", dataType: "uint32", hidden: true },

              // Custom 1
              { name: "Slot 1", offset: 0x1d0d8, type: "variable", dataType: "uint32" },
              { name: "Slot 2", offset: 0x1d0dc, type: "variable", dataType: "uint32" },
              { name: "Slot 3", offset: 0x1d0e0, type: "variable", dataType: "uint32" },
              { name: "Slot 4", offset: 0x1d0e4, type: "variable", dataType: "uint32" },
              { name: "Slot 5", offset: 0x1d0e8, type: "variable", dataType: "uint32" },
              { name: "Slot 6", offset: 0x1d0ec, type: "variable", dataType: "uint32" },
              { name: "Slot 7", offset: 0x1d0f0, type: "variable", dataType: "uint32" },
              { name: "Slot 8", offset: 0x1d0f4, type: "variable", dataType: "uint32" },
              { name: "Slot 9", offset: 0x1d0f8, type: "variable", dataType: "uint32" },
              { name: "Slot 10", offset: 0x1d0fc, type: "variable", dataType: "uint32" },
              { name: "???", offset: 0x1d100, type: "variable", dataType: "uint32", hidden: true },
              { name: "???", offset: 0x1d104, type: "variable", dataType: "uint32", hidden: true },
              { name: "???", offset: 0x1d108, type: "variable", dataType: "uint32", hidden: true },
              { name: "???", offset: 0x1d10c, type: "variable", dataType: "uint32", hidden: true },
              { name: "???", offset: 0x1d110, type: "variable", dataType: "uint32", hidden: true },
              { name: "???", offset: 0x1d114, type: "variable", dataType: "uint32", hidden: true },
              { name: "???", offset: 0x1d118, type: "variable", dataType: "uint32", hidden: true },
              { name: "???", offset: 0x1d11c, type: "variable", dataType: "uint32", hidden: true },
              { name: "???", offset: 0x1d120, type: "variable", dataType: "uint32", hidden: true },
              { name: "???", offset: 0x1d124, type: "variable", dataType: "uint32", hidden: true },
              { name: "???", offset: 0x1d128, type: "variable", dataType: "uint32", hidden: true },
              { name: "???", offset: 0x1d12c, type: "variable", dataType: "uint32", hidden: true },
              { name: "???", offset: 0x1d130, type: "variable", dataType: "uint32", hidden: true },
              { name: "???", offset: 0x1d134, type: "variable", dataType: "uint32", hidden: true },
              { name: "???", offset: 0x1d138, type: "variable", dataType: "uint32", hidden: true },
              { name: "???", offset: 0x1d13c, type: "variable", dataType: "uint32", hidden: true },
              { name: "???", offset: 0x1d140, type: "variable", dataType: "uint32", hidden: true },
              { name: "???", offset: 0x1d144, type: "variable", dataType: "uint32", hidden: true },
              { name: "???", offset: 0x1d148, type: "variable", dataType: "uint32", hidden: true },
              { name: "???", offset: 0x1d14c, type: "variable", dataType: "uint32", hidden: true },

              // Custom 2
              { name: "Slot 1", offset: 0x1d150, type: "variable", dataType: "uint32" },
              { name: "Slot 2", offset: 0x1d154, type: "variable", dataType: "uint32" },
              { name: "Slot 3", offset: 0x1d158, type: "variable", dataType: "uint32" },
              { name: "Slot 4", offset: 0x1d15c, type: "variable", dataType: "uint32" },
              { name: "Slot 5", offset: 0x1d160, type: "variable", dataType: "uint32" },
              { name: "Slot 6", offset: 0x1d164, type: "variable", dataType: "uint32" },
              { name: "Slot 7", offset: 0x1d168, type: "variable", dataType: "uint32" },
              { name: "Slot 8", offset: 0x1d16c, type: "variable", dataType: "uint32" },
              { name: "Slot 9", offset: 0x1d170, type: "variable", dataType: "uint32" },
              { name: "Slot 10", offset: 0x1d174, type: "variable", dataType: "uint32" },
              { name: "???", offset: 0x1d178, type: "variable", dataType: "uint32", hidden: true },
              { name: "???", offset: 0x1d17c, type: "variable", dataType: "uint32", hidden: true },
              { name: "???", offset: 0x1d180, type: "variable", dataType: "uint32", hidden: true },
              { name: "???", offset: 0x1d184, type: "variable", dataType: "uint32", hidden: true },
              { name: "???", offset: 0x1d188, type: "variable", dataType: "uint32", hidden: true },
              { name: "???", offset: 0x1d18c, type: "variable", dataType: "uint32", hidden: true },
              { name: "???", offset: 0x1d190, type: "variable", dataType: "uint32", hidden: true },
              { name: "???", offset: 0x1d194, type: "variable", dataType: "uint32", hidden: true },
              { name: "???", offset: 0x1d198, type: "variable", dataType: "uint32", hidden: true },
              { name: "???", offset: 0x1d19c, type: "variable", dataType: "uint32", hidden: true },
              { name: "???", offset: 0x1d1a0, type: "variable", dataType: "uint32", hidden: true },
              { name: "???", offset: 0x1d1a4, type: "variable", dataType: "uint32", hidden: true },
              { name: "???", offset: 0x1d1a8, type: "variable", dataType: "uint32", hidden: true },
              { name: "???", offset: 0x1d1ac, type: "variable", dataType: "uint32", hidden: true },
              { name: "???", offset: 0x1d1b0, type: "variable", dataType: "uint32", hidden: true },
              { name: "???", offset: 0x1d1b4, type: "variable", dataType: "uint32", hidden: true },
              { name: "???", offset: 0x1d1b8, type: "variable", dataType: "uint32", hidden: true },
              { name: "???", offset: 0x1d1bc, type: "variable", dataType: "uint32", hidden: true },
              { name: "???", offset: 0x1d1c0, type: "variable", dataType: "uint32", hidden: true },
              { name: "???", offset: 0x1d1c4, type: "variable", dataType: "uint32", hidden: true },

              // Custom 3
              { name: "Slot 1", offset: 0x1d1c8, type: "variable", dataType: "uint32" },
              { name: "Slot 2", offset: 0x1d1cc, type: "variable", dataType: "uint32" },
              { name: "Slot 3", offset: 0x1d1d0, type: "variable", dataType: "uint32" },
              { name: "Slot 4", offset: 0x1d1d4, type: "variable", dataType: "uint32" },
              { name: "Slot 5", offset: 0x1d1d8, type: "variable", dataType: "uint32" },
              { name: "Slot 6", offset: 0x1d1dc, type: "variable", dataType: "uint32" },
              { name: "Slot 7", offset: 0x1d1e0, type: "variable", dataType: "uint32" },
              { name: "Slot 8", offset: 0x1d1e4, type: "variable", dataType: "uint32" },
              { name: "Slot 9", offset: 0x1d1e8, type: "variable", dataType: "uint32" },
              { name: "Slot 10", offset: 0x1d1ec, type: "variable", dataType: "uint32" },
              { name: "???", offset: 0x1d1f0, type: "variable", dataType: "uint32", hidden: true },
              { name: "???", offset: 0x1d1f4, type: "variable", dataType: "uint32", hidden: true },
              { name: "???", offset: 0x1d1f8, type: "variable", dataType: "uint32", hidden: true },
              { name: "???", offset: 0x1d1fc, type: "variable", dataType: "uint32", hidden: true },
              { name: "???", offset: 0x1d200, type: "variable", dataType: "uint32", hidden: true },
              { name: "???", offset: 0x1d204, type: "variable", dataType: "uint32", hidden: true },
              { name: "???", offset: 0x1d208, type: "variable", dataType: "uint32", hidden: true },
              { name: "???", offset: 0x1d20c, type: "variable", dataType: "uint32", hidden: true },
              { name: "???", offset: 0x1d210, type: "variable", dataType: "uint32", hidden: true },
              { name: "???", offset: 0x1d214, type: "variable", dataType: "uint32", hidden: true },
              { name: "???", offset: 0x1d218, type: "variable", dataType: "uint32", hidden: true },
              { name: "???", offset: 0x1d21c, type: "variable", dataType: "uint32", hidden: true },
              { name: "???", offset: 0x1d220, type: "variable", dataType: "uint32", hidden: true },
              { name: "???", offset: 0x1d224, type: "variable", dataType: "uint32", hidden: true },
              { name: "???", offset: 0x1d228, type: "variable", dataType: "uint32", hidden: true },
              { name: "???", offset: 0x1d22c, type: "variable", dataType: "uint32", hidden: true },
              { name: "???", offset: 0x1d230, type: "variable", dataType: "uint32", hidden: true },
              { name: "???", offset: 0x1d234, type: "variable", dataType: "uint32", hidden: true },
              { name: "???", offset: 0x1d238, type: "variable", dataType: "uint32", hidden: true },
              { name: "???", offset: 0x1d23c, type: "variable", dataType: "uint32", hidden: true },

              // Custom 4
              { name: "Slot 1", offset: 0x1d240, type: "variable", dataType: "uint32" },
              { name: "Slot 2", offset: 0x1d244, type: "variable", dataType: "uint32" },
              { name: "Slot 3", offset: 0x1d248, type: "variable", dataType: "uint32" },
              { name: "Slot 4", offset: 0x1d24c, type: "variable", dataType: "uint32" },
              { name: "Slot 5", offset: 0x1d250, type: "variable", dataType: "uint32" },
              { name: "Slot 6", offset: 0x1d254, type: "variable", dataType: "uint32" },
              { name: "Slot 7", offset: 0x1d258, type: "variable", dataType: "uint32" },
              { name: "Slot 8", offset: 0x1d25c, type: "variable", dataType: "uint32" },
              { name: "Slot 9", offset: 0x1d260, type: "variable", dataType: "uint32" },
              { name: "Slot 10", offset: 0x1d264, type: "variable", dataType: "uint32" },
              { name: "???", offset: 0x1d268, type: "variable", dataType: "uint32", hidden: true },
              { name: "???", offset: 0x1d26c, type: "variable", dataType: "uint32", hidden: true },
              { name: "???", offset: 0x1d270, type: "variable", dataType: "uint32", hidden: true },
              { name: "???", offset: 0x1d274, type: "variable", dataType: "uint32", hidden: true },
              { name: "???", offset: 0x1d278, type: "variable", dataType: "uint32", hidden: true },
              { name: "???", offset: 0x1d27c, type: "variable", dataType: "uint32", hidden: true },
              { name: "???", offset: 0x1d280, type: "variable", dataType: "uint32", hidden: true },
              { name: "???", offset: 0x1d284, type: "variable", dataType: "uint32", hidden: true },
              { name: "???", offset: 0x1d288, type: "variable", dataType: "uint32", hidden: true },
              { name: "???", offset: 0x1d28c, type: "variable", dataType: "uint32", hidden: true },
              { name: "???", offset: 0x1d290, type: "variable", dataType: "uint32", hidden: true },
              { name: "???", offset: 0x1d294, type: "variable", dataType: "uint32", hidden: true },
              { name: "???", offset: 0x1d298, type: "variable", dataType: "uint32", hidden: true },
              { name: "???", offset: 0x1d29c, type: "variable", dataType: "uint32", hidden: true },
              { name: "???", offset: 0x1d2a0, type: "variable", dataType: "uint32", hidden: true },
              { name: "???", offset: 0x1d2a4, type: "variable", dataType: "uint32", hidden: true },
              { name: "???", offset: 0x1d2a8, type: "variable", dataType: "uint32", hidden: true },
              { name: "???", offset: 0x1d2ac, type: "variable", dataType: "uint32", hidden: true },
              { name: "???", offset: 0x1d2b0, type: "variable", dataType: "uint32", hidden: true },
              { name: "???", offset: 0x1d2b4, type: "variable", dataType: "uint32", hidden: true },

              // Custom 5
              { name: "Slot 1", offset: 0x1d2b8, type: "variable", dataType: "uint32" },
              { name: "Slot 2", offset: 0x1d2bc, type: "variable", dataType: "uint32" },
              { name: "Slot 3", offset: 0x1d2c0, type: "variable", dataType: "uint32" },
              { name: "Slot 4", offset: 0x1d2c4, type: "variable", dataType: "uint32" },
              { name: "Slot 5", offset: 0x1d2c8, type: "variable", dataType: "uint32" },
              { name: "Slot 6", offset: 0x1d2cc, type: "variable", dataType: "uint32" },
              { name: "Slot 7", offset: 0x1d2d0, type: "variable", dataType: "uint32" },
              { name: "Slot 8", offset: 0x1d2d4, type: "variable", dataType: "uint32" },
              { name: "Slot 9", offset: 0x1d2d8, type: "variable", dataType: "uint32" },
              { name: "Slot 10", offset: 0x1d2dc, type: "variable", dataType: "uint32" },
              { name: "???", offset: 0x1d2e0, type: "variable", dataType: "uint32", hidden: true },
              { name: "???", offset: 0x1d2e4, type: "variable", dataType: "uint32", hidden: true },
              { name: "???", offset: 0x1d2e8, type: "variable", dataType: "uint32", hidden: true },
              { name: "???", offset: 0x1d2ec, type: "variable", dataType: "uint32", hidden: true },
              { name: "???", offset: 0x1d2f0, type: "variable", dataType: "uint32", hidden: true },
              { name: "???", offset: 0x1d2f4, type: "variable", dataType: "uint32", hidden: true },
              { name: "???", offset: 0x1d2f8, type: "variable", dataType: "uint32", hidden: true },
              { name: "???", offset: 0x1d2fc, type: "variable", dataType: "uint32", hidden: true },
              { name: "???", offset: 0x1d300, type: "variable", dataType: "uint32", hidden: true },
              { name: "???", offset: 0x1d304, type: "variable", dataType: "uint32", hidden: true },
              { name: "???", offset: 0x1d308, type: "variable", dataType: "uint32", hidden: true },
              { name: "???", offset: 0x1d30c, type: "variable", dataType: "uint32", hidden: true },
              { name: "???", offset: 0x1d310, type: "variable", dataType: "uint32", hidden: true },
              { name: "???", offset: 0x1d314, type: "variable", dataType: "uint32", hidden: true },
              { name: "???", offset: 0x1d318, type: "variable", dataType: "uint32", hidden: true },
              { name: "???", offset: 0x1d31c, type: "variable", dataType: "uint32", hidden: true },
              { name: "???", offset: 0x1d320, type: "variable", dataType: "uint32", hidden: true },
              { name: "???", offset: 0x1d324, type: "variable", dataType: "uint32", hidden: true },
              { name: "???", offset: 0x1d328, type: "variable", dataType: "uint32", hidden: true },
              { name: "???", offset: 0x1d32c, type: "variable", dataType: "uint32", hidden: true },

              { name: "Copy generation", offset: 0x1d330, type: "variable", dataType: "uint32" },

              // Characters Play Count
              { name: "The Colonel", offset: 0x1d334, type: "variable", dataType: "uint32" },
              { name: "Jungle Queen", offset: 0x1d338, type: "variable", dataType: "uint32" },
              { name: "Monkey", offset: 0x1d33c, type: "variable", dataType: "uint32" },
              { name: "???", offset: 0x1d340, type: "variable", dataType: "uint32", hidden: true },
              { name: "???", offset: 0x1d344, type: "variable", dataType: "uint32", hidden: true },
              { name: "Ramona Sosa", offset: 0x1d348, type: "variable", dataType: "uint32" },
              { name: "Elijah Jones", offset: 0x1d34c, type: "variable", dataType: "uint32" },
              { name: "Hector Baboso", offset: 0x1d350, type: "variable", dataType: "uint32" },
              { name: "Jared Slim", offset: 0x1d354, type: "variable", dataType: "uint32" },
              { name: "Jebediah Crump", offset: 0x1d358, type: "variable", dataType: "uint32" },
              { name: "Ample Sally", offset: 0x1d35c, type: "variable", dataType: "uint32" },
              { name: "Lean Molly", offset: 0x1d360, type: "variable", dataType: "uint32" },
              { name: "Braces", offset: 0x1d364, type: "variable", dataType: "uint32" },
              { name: "Big Tony", offset: 0x1d368, type: "variable", dataType: "uint32" },
              { name: "Viola", offset: 0x1d36c, type: "variable", dataType: "uint32" },
              { name: "Stone Golem", offset: 0x1d370, type: "variable", dataType: "uint32" },
              { name: "Barrel Robot", offset: 0x1d374, type: "variable", dataType: "uint32" },
              { name: "Railspider Robot", offset: 0x1d378, type: "variable", dataType: "uint32" },
              { name: "Nikolai", offset: 0x1d37c, type: "variable", dataType: "uint32" },
              { name: "Private Sand", offset: 0x1d380, type: "variable", dataType: "uint32" },
              { name: "Private Grass", offset: 0x1d384, type: "variable", dataType: "uint32" },
              { name: "Private Coal", offset: 0x1d388, type: "variable", dataType: "uint32" },
              { name: "Private Poorly", offset: 0x1d38c, type: "variable", dataType: "uint32" },
              { name: "Sgt Rock", offset: 0x1d390, type: "variable", dataType: "uint32" },
              { name: "Sgt Shivers", offset: 0x1d394, type: "variable", dataType: "uint32" },
              { name: "Sgt Wood", offset: 0x1d398, type: "variable", dataType: "uint32" },
              { name: "Sgt Shock", offset: 0x1d39c, type: "variable", dataType: "uint32" },
              { name: "Sgt Slate", offset: 0x1d3a0, type: "variable", dataType: "uint32" },
              { name: "Lt Frost", offset: 0x1d3a4, type: "variable", dataType: "uint32" },
              { name: "Lt Wild", offset: 0x1d3a8, type: "variable", dataType: "uint32" },
              { name: "Handyman", offset: 0x1d3ac, type: "variable", dataType: "uint32" },
              { name: "Lt Shade", offset: 0x1d3b0, type: "variable", dataType: "uint32" },
              { name: "Lt Bush", offset: 0x1d3b4, type: "variable", dataType: "uint32" },
              { name: "Lt Chill", offset: 0x1d3b8, type: "variable", dataType: "uint32" },
              { name: "Wood Golem", offset: 0x1d3bc, type: "variable", dataType: "uint32" },
              { name: "Trooper White", offset: 0x1d3c0, type: "variable", dataType: "uint32" },
              { name: "Trooper Brown", offset: 0x1d3c4, type: "variable", dataType: "uint32" },
              { name: "Trooper Black", offset: 0x1d3c8, type: "variable", dataType: "uint32" },
              { name: "Trooper Green", offset: 0x1d3cc, type: "variable", dataType: "uint32" },
              { name: "Trooper Grey", offset: 0x1d3d0, type: "variable", dataType: "uint32" },
              { name: "Capt Snow", offset: 0x1d3d4, type: "variable", dataType: "uint32" },
              { name: "Capt Sand", offset: 0x1d3d8, type: "variable", dataType: "uint32" },
              { name: "Capt Night", offset: 0x1d3dc, type: "variable", dataType: "uint32" },
              { name: "Capt Forest", offset: 0x1d3e0, type: "variable", dataType: "uint32" },
              { name: "Capt Pain", offset: 0x1d3e4, type: "variable", dataType: "uint32" },
              { name: "Hybrid Mutant", offset: 0x1d3e8, type: "variable", dataType: "uint32" },
              { name: "Ilsa Nadir", offset: 0x1d3ec, type: "variable", dataType: "uint32" },
              { name: "SentryBot", offset: 0x1d3f0, type: "variable", dataType: "uint32" },
              { name: "Machinist", offset: 0x1d3f4, type: "variable", dataType: "uint32" },
              { name: "ChassisBot", offset: 0x1d3f8, type: "variable", dataType: "uint32" },
              { name: "Gretel Mk II", offset: 0x1d3fc, type: "variable", dataType: "uint32" },
              { name: "Undead Priest", offset: 0x1d400, type: "variable", dataType: "uint32" },
              { name: "Louie Bignose", offset: 0x1d404, type: "variable", dataType: "uint32" },
              { name: "Marco the Snitch", offset: 0x1d408, type: "variable", dataType: "uint32" },
              { name: "Sewer Zombie", offset: 0x1d40c, type: "variable", dataType: "uint32" },
              { name: "Reaper Splitter", offset: 0x1d410, type: "variable", dataType: "uint32" },
              { name: "Maiden", offset: 0x1d414, type: "variable", dataType: "uint32" },
              { name: "Changeling", offset: 0x1d418, type: "variable", dataType: "uint32" },
              { name: "Portal Daemon", offset: 0x1d41c, type: "variable", dataType: "uint32" },
              { name: "The Master", offset: 0x1d420, type: "variable", dataType: "uint32" },
              { name: "Krayola", offset: 0x1d424, type: "variable", dataType: "uint32" },
              { name: "Chastity", offset: 0x1d428, type: "variable", dataType: "uint32" },
              { name: "Jo-Beth Casey", offset: 0x1d42c, type: "variable", dataType: "uint32" },
              { name: "X-Ray Skel", offset: 0x1d430, type: "variable", dataType: "uint32" },
              { name: "Leo Krupps", offset: 0x1d434, type: "variable", dataType: "uint32" },
              { name: "Slick Tommy", offset: 0x1d438, type: "variable", dataType: "uint32" },
              { name: "Jimmy Needles", offset: 0x1d43c, type: "variable", dataType: "uint32" },
              { name: "Hatchet Sal", offset: 0x1d440, type: "variable", dataType: "uint32" },
              { name: "Jake Fenton", offset: 0x1d444, type: "variable", dataType: "uint32" },
              { name: "Lady Jane", offset: 0x1d448, type: "variable", dataType: "uint32" },
              { name: "NeoTokyo male pedestrian 1", offset: 0x1d44c, type: "variable", dataType: "uint32" },
              { name: "NeoTokyo male pedestrian 2", offset: 0x1d450, type: "variable", dataType: "uint32" },
              { name: "NeoTokyo male pedestrian 3", offset: 0x1d454, type: "variable", dataType: "uint32" },
              { name: "NeoTokyo male pedestrian 4", offset: 0x1d458, type: "variable", dataType: "uint32" },
              { name: "NeoTokyo male pedestrian 5", offset: 0x1d45c, type: "variable", dataType: "uint32" },
              { name: "NeoTokyo male pedestrian 6", offset: 0x1d460, type: "variable", dataType: "uint32" },
              { name: "NeoTokyo male pedestrian 7", offset: 0x1d464, type: "variable", dataType: "uint32" },
              { name: "NeoTokyo male pedestrian 8", offset: 0x1d468, type: "variable", dataType: "uint32" },
              { name: "NeoTokyo male pedestrian 9", offset: 0x1d46c, type: "variable", dataType: "uint32" },
              { name: "NeoTokyo male pedestrian 10", offset: 0x1d470, type: "variable", dataType: "uint32" },
              { name: "NeoTokyo female pedestrian 1", offset: 0x1d474, type: "variable", dataType: "uint32" },
              { name: "NeoTokyo female pedestrian 2", offset: 0x1d478, type: "variable", dataType: "uint32" },
              { name: "NeoTokyo female pedestrian 3", offset: 0x1d47c, type: "variable", dataType: "uint32" },
              { name: "NeoTokyo female pedestrian 4", offset: 0x1d480, type: "variable", dataType: "uint32" },
              { name: "NeoTokyo female pedestrian 5", offset: 0x1d484, type: "variable", dataType: "uint32" },
              { name: "NeoTokyo female pedestrian 6", offset: 0x1d488, type: "variable", dataType: "uint32" },
              { name: "NeoTokyo female pedestrian 7", offset: 0x1d48c, type: "variable", dataType: "uint32" },
              { name: "NeoTokyo female pedestrian 8", offset: 0x1d490, type: "variable", dataType: "uint32" },
              { name: "NeoTokyo female pedestrian 9", offset: 0x1d494, type: "variable", dataType: "uint32" },
              { name: "NeoTokyo female pedestrian 10", offset: 0x1d498, type: "variable", dataType: "uint32" },
              { name: "Accountant", offset: 0x1d49c, type: "variable", dataType: "uint32" },
              { name: "Lawyer", offset: 0x1d4a0, type: "variable", dataType: "uint32" },
              { name: "Consultant", offset: 0x1d4a4, type: "variable", dataType: "uint32" },
              { name: "Feeder Zombie", offset: 0x1d4a8, type: "variable", dataType: "uint32" },
              { name: "Gasmask Special", offset: 0x1d4ac, type: "variable", dataType: "uint32" },
              { name: "Cyberfairy", offset: 0x1d4b0, type: "variable", dataType: "uint32" },
              { name: "R One-Oh-Seven", offset: 0x1d4b4, type: "variable", dataType: "uint32" },
              { name: "Captain Ash", offset: 0x1d4b8, type: "variable", dataType: "uint32" },
              { name: "Milkbaby", offset: 0x1d4bc, type: "variable", dataType: "uint32" },
              { name: "Sadako", offset: 0x1d4c0, type: "variable", dataType: "uint32" },
              { name: "Ghost", offset: 0x1d4c4, type: "variable", dataType: "uint32" },
              { name: "Barby Gimp", offset: 0x1d4c8, type: "variable", dataType: "uint32" },
              { name: "Riot Officer", offset: 0x1d4cc, type: "variable", dataType: "uint32" },
              { name: "???", offset: 0x1d4d0, type: "variable", dataType: "uint32", hidden: true },
              { name: "Jacque de la Morte", offset: 0x1d4d4, type: "variable", dataType: "uint32" },
              { name: "The Hunchback", offset: 0x1d4d8, type: "variable", dataType: "uint32" },
              { name: "Sgt Cortez", offset: 0x1d4dc, type: "variable", dataType: "uint32" },
              { name: "Hank Nova", offset: 0x1d4e0, type: "variable", dataType: "uint32" },
              { name: "Kitten Celeste", offset: 0x1d4e4, type: "variable", dataType: "uint32" },
              { name: "Bear", offset: 0x1d4e8, type: "variable", dataType: "uint32" },
              { name: "Stumpy", offset: 0x1d4ec, type: "variable", dataType: "uint32" },
              { name: "Gregor Lenko", offset: 0x1d4f0, type: "variable", dataType: "uint32" },
              { name: "Mikey Two-guns", offset: 0x1d4f4, type: "variable", dataType: "uint32" },
              { name: "Venus Starr", offset: 0x1d4f8, type: "variable", dataType: "uint32" },
              { name: "Harry Tipper", offset: 0x1d4fc, type: "variable", dataType: "uint32" },
              { name: "Henchman", offset: 0x1d500, type: "variable", dataType: "uint32" },
              { name: "Dr. Peabody", offset: 0x1d504, type: "variable", dataType: "uint32" },
              { name: "Khallos", offset: 0x1d508, type: "variable", dataType: "uint32" },
              { name: "Aztec Warrior", offset: 0x1d50c, type: "variable", dataType: "uint32" },
              { name: "High Priest", offset: 0x1d510, type: "variable", dataType: "uint32" },
              { name: "Mister Giggles", offset: 0x1d514, type: "variable", dataType: "uint32" },
              { name: "Kypriss", offset: 0x1d518, type: "variable", dataType: "uint32" },
              { name: "Dinosaur", offset: 0x1d51c, type: "variable", dataType: "uint32" },
              { name: "Ozor Mox", offset: 0x1d520, type: "variable", dataType: "uint32" },
              { name: "Meezor Mox", offset: 0x1d524, type: "variable", dataType: "uint32" },
              { name: "Candi Skyler", offset: 0x1d528, type: "variable", dataType: "uint32" },
              { name: "Scourge Splitter", offset: 0x1d52c, type: "variable", dataType: "uint32" },
              { name: "Corp Hart", offset: 0x1d530, type: "variable", dataType: "uint32" },
              { name: "Drone Splitter", offset: 0x1d534, type: "variable", dataType: "uint32" },
              { name: "The Cropolite", offset: 0x1d538, type: "variable", dataType: "uint32" },
              { name: "Female Trooper", offset: 0x1d53c, type: "variable", dataType: "uint32" },
              { name: "Male Trooper", offset: 0x1d540, type: "variable", dataType: "uint32" },
              { name: "R-109", offset: 0x1d544, type: "variable", dataType: "uint32" },
              { name: "Mr Underwood", offset: 0x1d548, type: "variable", dataType: "uint32" },
              { name: "Gargoyle", offset: 0x1d54c, type: "variable", dataType: "uint32" },
              { name: "Crypt Zombie", offset: 0x1d550, type: "variable", dataType: "uint32" },
              { name: "Lola Varuska", offset: 0x1d554, type: "variable", dataType: "uint32" },
              { name: "Nikki", offset: 0x1d558, type: "variable", dataType: "uint32" },
              { name: "Jinki", offset: 0x1d55c, type: "variable", dataType: "uint32" },
              { name: "Ringmistress", offset: 0x1d560, type: "variable", dataType: "uint32" },
              { name: "Snowman", offset: 0x1d564, type: "variable", dataType: "uint32" },
              { name: "Crispin", offset: 0x1d568, type: "variable", dataType: "uint32" },
              { name: "Baby Drone", offset: 0x1d56c, type: "variable", dataType: "uint32" },
              { name: "Calamari", offset: 0x1d570, type: "variable", dataType: "uint32" },
              { name: "Dark Henchman", offset: 0x1d574, type: "variable", dataType: "uint32" },
              { name: "SentryBot", offset: 0x1d578, type: "variable", dataType: "uint32" },
              { name: "???", offset: 0x1d57c, type: "variable", dataType: "uint32", hidden: true },
              { name: "???", offset: 0x1d580, type: "variable", dataType: "uint32", hidden: true },
              { name: "Sergio", offset: 0x1d584, type: "variable", dataType: "uint32" },
              { name: "Beetleman", offset: 0x1d588, type: "variable", dataType: "uint32" },
              { name: "Mischief", offset: 0x1d58c, type: "variable", dataType: "uint32" },
              { name: "The Impersonator", offset: 0x1d590, type: "variable", dataType: "uint32" },
              { name: "Badass Cyborg", offset: 0x1d594, type: "variable", dataType: "uint32" },
              { name: "Chinese Chef", offset: 0x1d598, type: "variable", dataType: "uint32" },
              { name: "Duckman Drake", offset: 0x1d59c, type: "variable", dataType: "uint32" },
              { name: "Gingerbread Man", offset: 0x1d5a0, type: "variable", dataType: "uint32" },
              { name: "Insect Mutant", offset: 0x1d5a4, type: "variable", dataType: "uint32" },
              { name: "Robofish", offset: 0x1d5a8, type: "variable", dataType: "uint32" },
              { name: "???", offset: 0x1d5b4, type: "variable", dataType: "uint32", hidden: true },
              { name: "???", offset: 0x1d5b8, type: "variable", dataType: "uint32", hidden: true },

              // Map Played Count
              { name: "Compound", offset: 0x1d60c, type: "variable", dataType: "uint32" },
              { name: "Streets", offset: 0x1d614, type: "variable", dataType: "uint32" },
              { name: "Site", offset: 0x1d624, type: "variable", dataType: "uint32" },
              { name: "Chicago", offset: 0x1d65c, type: "variable", dataType: "uint32" },
              { name: "Chicago (Story)", offset: 0x1d660, type: "variable", dataType: "uint32" },
              { name: "Chinese", offset: 0x1d664, type: "variable", dataType: "uint32" },
              { name: "Aztec", offset: 0x1d6a4, type: "variable", dataType: "uint32" },
              { name: "Atom Smasher (Story)", offset: 0x1d6b8, type: "variable", dataType: "uint32" },
              { name: "Wild West", offset: 0x1d6bc, type: "variable", dataType: "uint32" },
              { name: "Wild West (Story)", offset: 0x1d6c0, type: "variable", dataType: "uint32" },
              { name: "Hangar", offset: 0x1d6c4, type: "variable", dataType: "uint32" },
              { name: "???", offset: 0x1d6c8, type: "variable", dataType: "uint32", hidden: true },
              { name: "Notre Dame", offset: 0x1d6cc, type: "variable", dataType: "uint32" },
              { name: "Notre Dame (Story)", offset: 0x1d6d0, type: "variable", dataType: "uint32" },
              { name: "Siberia", offset: 0x1d6d4, type: "variable", dataType: "uint32" },
              { name: "Siberia (Story)", offset: 0x1d6d8, type: "variable", dataType: "uint32" },
              { name: "Ice Station", offset: 0x1d6dc, type: "variable", dataType: "uint32" },
              { name: "NeoTokyo", offset: 0x1d6ec, type: "variable", dataType: "uint32" },
              { name: "NeoTokyo (Story)", offset: 0x1d6f0, type: "variable", dataType: "uint32" },
              { name: "Space Station (Story)", offset: 0x1d6f8, type: "variable", dataType: "uint32" },
              { name: "Return to Planet X (Story)", offset: 0x1d700, type: "variable", dataType: "uint32" },
              { name: "Robot Factory (Story)", offset: 0x1d708, type: "variable", dataType: "uint32" },
              { name: "Mexican Mission", offset: 0x1d70c, type: "variable", dataType: "uint32" },
              { name: "Nightclub", offset: 0x1d714, type: "variable", dataType: "uint32" },
              { name: "Hospital", offset: 0x1d724, type: "variable", dataType: "uint32" },
              { name: "Scrapyard 2", offset: 0x1d72c, type: "variable", dataType: "uint32" },
              { name: "Circus", offset: 0x1d734, type: "variable", dataType: "uint32" },
              { name: "Aztec Ruins (Story)", offset: 0x1d740, type: "variable", dataType: "uint32" },
              { name: "Ufopia", offset: 0x1d74c, type: "variable", dataType: "uint32" },
              { name: "Training Ground", offset: 0x1d774, type: "variable", dataType: "uint32" },
              { name: "Chasm", offset: 0x1d77c, type: "variable", dataType: "uint32" },
              { name: "Robot Factory", offset: 0x1d7bc, type: "variable", dataType: "uint32" },
              { name: "Scrapyard", offset: 0x1d7c4, type: "variable", dataType: "uint32" },

              // Challenge

              // Glass Smash

              // Plane in the Neck
              { name: "Played Count", offset: 0x1d7cc, type: "variable", dataType: "uint32" },
              { name: "Time", offset: 0x1d7d0, type: "variable", dataType: "uint32" },
              { name: "???", offset: 0x1d7d4, type: "variable", dataType: "uint32", hidden: true },
              { name: "Trophy", offset: 0x1d7d8, type: "variable", dataType: "uint32" },
              { name: "???", offset: 0x1d7dc, type: "variable", dataType: "uint32", hidden: true },

              // Bricking it
              { name: "Played Count", offset: 0x1d7e0, type: "variable", dataType: "uint32" },
              { name: "Time", offset: 0x1d7e4, type: "variable", dataType: "uint32" },
              { name: "???", offset: 0x1d7e8, type: "variable", dataType: "uint32", hidden: true },
              { name: "Trophy", offset: 0x1d7ec, type: "variable", dataType: "uint32" },
              { name: "???", offset: 0x1d7f0, type: "variable", dataType: "uint32", hidden: true },

              // Stain Removal
              { name: "Played Count", offset: 0x1d7f4, type: "variable", dataType: "uint32" },
              { name: "Panes", offset: 0x1d7f8, type: "variable", dataType: "uint32" },
              { name: "Time", offset: 0x1d7fc, type: "variable", dataType: "uint32" },
              { name: "Trophy", offset: 0x1d800, type: "variable", dataType: "uint32" },
              { name: "???", offset: 0x1d804, type: "variable", dataType: "uint32", hidden: true },

              // Infiltration

              // Silent but Deadly
              { name: "Played Count", offset: 0x1d808, type: "variable", dataType: "uint32" },
              { name: "Score", offset: 0x1d80c, type: "variable", dataType: "uint32" },
              { name: "Time", offset: 0x1d810, type: "variable", dataType: "uint32" },
              { name: "Trophy", offset: 0x1d814, type: "variable", dataType: "uint32" },
              { name: "???", offset: 0x1d818, type: "variable", dataType: "uint32", hidden: true },

              // Trouble at the Docks
              { name: "Played Count", offset: 0x1d81c, type: "variable", dataType: "uint32" },
              { name: "Score", offset: 0x1d820, type: "variable", dataType: "uint32" },
              { name: "Time", offset: 0x1d824, type: "variable", dataType: "uint32" },
              { name: "Trophy", offset: 0x1d828, type: "variable", dataType: "uint32" },
              { name: "???", offset: 0x1d82c, type: "variable", dataType: "uint32", hidden: true },

              // Escape from NeoTokyo
              { name: "Played Count", offset: 0x1d830, type: "variable", dataType: "uint32" },
              { name: "Score", offset: 0x1d834, type: "variable", dataType: "uint32" },
              { name: "Time", offset: 0x1d838, type: "variable", dataType: "uint32" },
              { name: "Trophy", offset: 0x1d83c, type: "variable", dataType: "uint32" },
              { name: "???", offset: 0x1d840, type: "variable", dataType: "uint32", hidden: true },

              // Banana Chomp

              // Gone Bananas
              { name: "Played Count", offset: 0x1d844, type: "variable", dataType: "uint32" },
              { name: "Time", offset: 0x1d848, type: "variable", dataType: "uint32" },
              { name: "???", offset: 0x1d84c, type: "variable", dataType: "uint32", hidden: true },
              { name: "Trophy", offset: 0x1d850, type: "variable", dataType: "uint32" },
              { name: "???", offset: 0x1d854, type: "variable", dataType: "uint32", hidden: true },

              // Monkey Business
              { name: "Played Count", offset: 0x1d858, type: "variable", dataType: "uint32" },
              { name: "Time", offset: 0x1d85c, type: "variable", dataType: "uint32" },
              { name: "???", offset: 0x1d860, type: "variable", dataType: "uint32", hidden: true },
              { name: "Trophy", offset: 0x1d864, type: "variable", dataType: "uint32" },
              { name: "???", offset: 0x1d868, type: "variable", dataType: "uint32", hidden: true },

              // Playing With Fire
              { name: "Played Count", offset: 0x1d86c, type: "variable", dataType: "uint32" },
              { name: "Bananas", offset: 0x1d870, type: "variable", dataType: "uint32" },
              { name: "???", offset: 0x1d874, type: "variable", dataType: "uint32", hidden: true },
              { name: "Trophy", offset: 0x1d878, type: "variable", dataType: "uint32" },
              { name: "???", offset: 0x1d87c, type: "variable", dataType: "uint32", hidden: true },

              // Cut-out Shoot-out

              // Take 'em Down
              { name: "Played Count", offset: 0x1d880, type: "variable", dataType: "uint32" },
              { name: "Score", offset: 0x1d884, type: "variable", dataType: "uint32" },
              { name: "???", offset: 0x1d888, type: "variable", dataType: "uint32", hidden: true },
              { name: "Trophy", offset: 0x1d88c, type: "variable", dataType: "uint32" },
              { name: "???", offset: 0x1d890, type: "variable", dataType: "uint32", hidden: true },

              // Fall Out
              { name: "Played Count", offset: 0x1d894, type: "variable", dataType: "uint32" },
              { name: "Score", offset: 0x1d898, type: "variable", dataType: "uint32" },
              { name: "???", offset: 0x1d89c, type: "variable", dataType: "uint32", hidden: true },
              { name: "Trophy", offset: 0x1d8a0, type: "variable", dataType: "uint32" },
              { name: "???", offset: 0x1d8a4, type: "variable", dataType: "uint32", hidden: true },

              // Pick Yer Piece
              { name: "Played Count", offset: 0x1d8a8, type: "variable", dataType: "uint32" },
              { name: "Score", offset: 0x1d8ac, type: "variable", dataType: "uint32" },
              { name: "???", offset: 0x1d8b0, type: "variable", dataType: "uint32", hidden: true },
              { name: "Trophy", offset: 0x1d8b4, type: "variable", dataType: "uint32" },
              { name: "???", offset: 0x1d8b8, type: "variable", dataType: "uint32", hidden: true },

              // TimeSplitters 'Story' Classic

              // Hit Me Baby One Morgue Time
              { name: "Played Count", offset: 0x1d8bc, type: "variable", dataType: "uint32" },
              { name: "Time", offset: 0x1d8c0, type: "variable", dataType: "uint32" },
              { name: "???", offset: 0x1d8c4, type: "variable", dataType: "uint32", hidden: true },
              { name: "Trophy", offset: 0x1d8c8, type: "variable", dataType: "uint32" },
              { name: "???", offset: 0x1d8cc, type: "variable", dataType: "uint32", hidden: true },

              // Badass Buspass Impass
              { name: "Played Count", offset: 0x1d8d0, type: "variable", dataType: "uint32" },
              { name: "Time", offset: 0x1d8d4, type: "variable", dataType: "uint32" },
              { name: "???", offset: 0x1d8d8, type: "variable", dataType: "uint32", hidden: true },
              { name: "Trophy", offset: 0x1d8dc, type: "variable", dataType: "uint32" },
              { name: "???", offset: 0x1d8e0, type: "variable", dataType: "uint32", hidden: true },

              // But Where do the Batteries Go?
              { name: "Played Count", offset: 0x1d8e4, type: "variable", dataType: "uint32" },
              { name: "Time", offset: 0x1d8e8, type: "variable", dataType: "uint32" },
              { name: "???", offset: 0x1d8ec, type: "variable", dataType: "uint32", hidden: true },
              { name: "Trophy", offset: 0x1d8f0, type: "variable", dataType: "uint32" },
              { name: "???", offset: 0x1d8f4, type: "variable", dataType: "uint32", hidden: true },

              // Behead The Undead

              // Fight Off The Living Dead
              { name: "Played Count", offset: 0x1d8f8, type: "variable", dataType: "uint32" },
              { name: "Score", offset: 0x1d8fc, type: "variable", dataType: "uint32" },
              { name: "???", offset: 0x1d900, type: "variable", dataType: "uint32", hidden: true },
              { name: "Trophy", offset: 0x1d904, type: "variable", dataType: "uint32" },
              { name: "???", offset: 0x1d908, type: "variable", dataType: "uint32", hidden: true },

              // Day of the Dammed
              { name: "Played Count", offset: 0x1d90c, type: "variable", dataType: "uint32" },
              { name: "Score", offset: 0x1d910, type: "variable", dataType: "uint32" },
              { name: "???", offset: 0x1d914, type: "variable", dataType: "uint32", hidden: true },
              { name: "Trophy", offset: 0x1d918, type: "variable", dataType: "uint32" },
              { name: "???", offset: 0x1d91c, type: "variable", dataType: "uint32", hidden: true },

              // Sergio's Last Stand
              { name: "Played Count", offset: 0x1d920, type: "variable", dataType: "uint32" },
              { name: "Score", offset: 0x1d924, type: "variable", dataType: "uint32" },
              { name: "???", offset: 0x1d928, type: "variable", dataType: "uint32", hidden: true },
              { name: "Trophy", offset: 0x1d92c, type: "variable", dataType: "uint32" },
              { name: "???", offset: 0x1d930, type: "variable", dataType: "uint32", hidden: true },

              // Monkeying Around

              // Simian Shootout
              { name: "Played Count", offset: 0x1d934, type: "variable", dataType: "uint32" },
              { name: "Score", offset: 0x1d938, type: "variable", dataType: "uint32" },
              { name: "???", offset: 0x1d93c, type: "variable", dataType: "uint32", hidden: true },
              { name: "Trophy", offset: 0x1d940, type: "variable", dataType: "uint32" },
              { name: "???", offset: 0x1d944, type: "variable", dataType: "uint32", hidden: true },

              // Monkey Mayhem
              { name: "Played Count", offset: 0x1d948, type: "variable", dataType: "uint32" },
              { name: "Score", offset: 0x1d94c, type: "variable", dataType: "uint32" },
              { name: "???", offset: 0x1d950, type: "variable", dataType: "uint32", hidden: true },
              { name: "Trophy", offset: 0x1d954, type: "variable", dataType: "uint32" },
              { name: "???", offset: 0x1d958, type: "variable", dataType: "uint32", hidden: true },

              // Dam Bursters
              { name: "Played Count", offset: 0x1d95c, type: "variable", dataType: "uint32" },
              { name: "Score", offset: 0x1d960, type: "variable", dataType: "uint32" },
              { name: "???", offset: 0x1d964, type: "variable", dataType: "uint32", hidden: true },
              { name: "Trophy", offset: 0x1d968, type: "variable", dataType: "uint32" },
              { name: "???", offset: 0x1d96c, type: "variable", dataType: "uint32", hidden: true },

              // Arcade League

              // Amateur League

              // Beginners Series

              // Adios Amigos!
              { name: "Played Count", offset: 0x1d970, type: "variable", dataType: "uint32" },
              { name: "Kills", offset: 0x1d974, type: "variable", dataType: "uint32" },
              { name: "Time", offset: 0x1d978, type: "variable", dataType: "uint32" },
              { name: "Trophy", offset: 0x1d97c, type: "variable", dataType: "uint32" },
              { name: "???", offset: 0x1d980, type: "variable", dataType: "uint32" },

              // Casualty
              { name: "Played Count", offset: 0x1d984, type: "variable", dataType: "uint32" },
              { name: "Kills", offset: 0x1d988, type: "variable", dataType: "uint32" },
              { name: "Time", offset: 0x1d98c, type: "variable", dataType: "uint32" },
              { name: "Trophy", offset: 0x1d990, type: "variable", dataType: "uint32" },
              { name: "???", offset: 0x1d994, type: "variable", dataType: "uint32" },

              // Top Shot
              { name: "Played Count", offset: 0x1d998, type: "variable", dataType: "uint32" },
              { name: "Time", offset: 0x1d99c, type: "variable", dataType: "uint32" },
              { name: "Lives", offset: 0x1d9a0, type: "variable", dataType: "uint32" },
              { name: "Trophy", offset: 0x1d9a4, type: "variable", dataType: "uint32" },
              { name: "???", offset: 0x1d9a8, type: "variable", dataType: "uint32" },

              // Mode Madness

              // Shrinking from the Cold
              { name: "Played Count", offset: 0x1d9ac, type: "variable", dataType: "uint32" },
              { name: "Kills", offset: 0x1d9b0, type: "variable", dataType: "uint32" },
              { name: "Time", offset: 0x1d9b4, type: "variable", dataType: "uint32" },
              { name: "Trophy", offset: 0x1d9b8, type: "variable", dataType: "uint32" },
              { name: "???", offset: 0x1d9bc, type: "variable", dataType: "uint32" },

              // Chastity Chased
              { name: "Played Count", offset: 0x1d9c0, type: "variable", dataType: "uint32" },
              { name: "Kills", offset: 0x1d9c4, type: "variable", dataType: "uint32" },
              { name: "Time", offset: 0x1d9c8, type: "variable", dataType: "uint32" },
              { name: "Trophy", offset: 0x1d9cc, type: "variable", dataType: "uint32" },
              { name: "???", offset: 0x1d9d0, type: "variable", dataType: "uint32" },

              // Scrap Metal
              { name: "Played Count", offset: 0x1d9d4, type: "variable", dataType: "uint32" },
              { name: "Kills", offset: 0x1d9d8, type: "variable", dataType: "uint32" },
              { name: "Score", offset: 0x1d9dc, type: "variable", dataType: "uint32" },
              { name: "Trophy", offset: 0x1d9e0, type: "variable", dataType: "uint32" },
              { name: "???", offset: 0x1d9e4, type: "variable", dataType: "uint32" },

              // It's a Blast

              // Night Shift
              { name: "Played Count", offset: 0x1d9e8, type: "variable", dataType: "uint32" },
              { name: "Rank", offset: 0x1d9ec, type: "variable", dataType: "uint32" },
              { name: "Kills", offset: 0x1d9f0, type: "variable", dataType: "uint32" },
              { name: "Trophy", offset: 0x1d9f4, type: "variable", dataType: "uint32" },
              { name: "???", offset: 0x1d9f8, type: "variable", dataType: "uint32" },

              // Spoils of War
              { name: "Played Count", offset: 0x1d9fc, type: "variable", dataType: "uint32" },
              { name: "Score", offset: 0x1da00, type: "variable", dataType: "uint32" },
              { name: "Time", offset: 0x1da04, type: "variable", dataType: "uint32" },
              { name: "Trophy", offset: 0x1da08, type: "variable", dataType: "uint32" },
              { name: "???", offset: 0x1da0c, type: "variable", dataType: "uint32" },

              // Demolition Derby
              { name: "Played Count", offset: 0x1da10, type: "variable", dataType: "uint32" },
              { name: "Rank", offset: 0x1da14, type: "variable", dataType: "uint32" },
              { name: "Kills", offset: 0x1da18, type: "variable", dataType: "uint32" },
              { name: "Trophy", offset: 0x1da1c, type: "variable", dataType: "uint32" },
              { name: "???", offset: 0x1da20, type: "variable", dataType: "uint32" },

              // Too Hot to Handle

              // Monkey Immolation
              { name: "Played Count", offset: 0x1da24, type: "variable", dataType: "uint32" },
              { name: "Time", offset: 0x1da28, type: "variable", dataType: "uint32" },
              { name: "???", offset: 0x1da2c, type: "variable", dataType: "uint32" },
              { name: "Trophy", offset: 0x1da30, type: "variable", dataType: "uint32" },
              { name: "???", offset: 0x1da34, type: "variable", dataType: "uint32" },

              // Burns Department
              { name: "Played Count", offset: 0x1da38, type: "variable", dataType: "uint32" },
              { name: "Time", offset: 0x1da3c, type: "variable", dataType: "uint32" },
              { name: "???", offset: 0x1da40, type: "variable", dataType: "uint32" },
              { name: "Trophy", offset: 0x1da44, type: "variable", dataType: "uint32" },
              { name: "???", offset: 0x1da48, type: "variable", dataType: "uint32" },

              // Disco Inferno
              { name: "Played Count", offset: 0x1da4c, type: "variable", dataType: "uint32" },
              { name: "Time", offset: 0x1da50, type: "variable", dataType: "uint32" },
              { name: "???", offset: 0x1da54, type: "variable", dataType: "uint32" },
              { name: "Trophy", offset: 0x1da58, type: "variable", dataType: "uint32" },
              { name: "???", offset: 0x1da5c, type: "variable", dataType: "uint32" },

              // Team Series A

              // Club Soda
              { name: "Played Count", offset: 0x1da60, type: "variable", dataType: "uint32" },
              { name: "Kills", offset: 0x1da64, type: "variable", dataType: "uint32" },
              { name: "Time", offset: 0x1da68, type: "variable", dataType: "uint32" },
              { name: "Trophy", offset: 0x1da6c, type: "variable", dataType: "uint32" },
              { name: "???", offset: 0x1da70, type: "variable", dataType: "uint32" },

              // Station Stand
              { name: "Played Count", offset: 0x1da74, type: "variable", dataType: "uint32" },
              { name: "Score", offset: 0x1da78, type: "variable", dataType: "uint32" },
              { name: "Time", offset: 0x1da7c, type: "variable", dataType: "uint32" },
              { name: "Trophy", offset: 0x1da80, type: "variable", dataType: "uint32" },
              { name: "???", offset: 0x1da84, type: "variable", dataType: "uint32" },

              // Men in Grey
              { name: "Played Count", offset: 0x1da88, type: "variable", dataType: "uint32" },
              { name: "Time", offset: 0x1da8c, type: "variable", dataType: "uint32" },
              { name: "???", offset: 0x1da90, type: "variable", dataType: "uint32" },
              { name: "Trophy", offset: 0x1da94, type: "variable", dataType: "uint32" },
              { name: "???", offset: 0x1da98, type: "variable", dataType: "uint32" },

              // Honorary League

              // Team Series B

              // Hack a Hacker
              { name: "Played Count", offset: 0x1da9c, type: "variable", dataType: "uint32" },
              { name: "Kills", offset: 0x1daa0, type: "variable", dataType: "uint32" },
              { name: "Time", offset: 0x1daa4, type: "variable", dataType: "uint32" },
              { name: "Trophy", offset: 0x1daa8, type: "variable", dataType: "uint32" },
              { name: "???", offset: 0x1daac, type: "variable", dataType: "uint32" },

              // Rice Cracker Rush
              { name: "Played Count", offset: 0x1dab0, type: "variable", dataType: "uint32" },
              { name: "Bags", offset: 0x1dab4, type: "variable", dataType: "uint32" },
              { name: "Time", offset: 0x1dab8, type: "variable", dataType: "uint32" },
              { name: "Trophy", offset: 0x1dabc, type: "variable", dataType: "uint32" },
              { name: "???", offset: 0x1dac0, type: "variable", dataType: "uint32" },

              // Superfly Lady
              { name: "Played Count", offset: 0x1dac4, type: "variable", dataType: "uint32" },
              { name: "Time", offset: 0x1dac8, type: "variable", dataType: "uint32" },
              { name: "???", offset: 0x1dacc, type: "variable", dataType: "uint32" },
              { name: "Trophy", offset: 0x1dad0, type: "variable", dataType: "uint32" },
              { name: "???", offset: 0x1dad4, type: "variable", dataType: "uint32" },

              // Maximus

              // R109 Beta
              { name: "Played Count", offset: 0x1dad8, type: "variable", dataType: "uint32" },
              { name: "Rank", offset: 0x1dadc, type: "variable", dataType: "uint32" },
              { name: "Kills", offset: 0x1dae0, type: "variable", dataType: "uint32" },
              { name: "Trophy", offset: 0x1dae4, type: "variable", dataType: "uint32" },
              { name: "???", offset: 0x1dae8, type: "variable", dataType: "uint32" },

              // Killer Queen
              { name: "Played Count", offset: 0x1daec, type: "variable", dataType: "uint32" },
              { name: "Kills", offset: 0x1daf0, type: "variable", dataType: "uint32" },
              { name: "Time", offset: 0x1daf4, type: "variable", dataType: "uint32" },
              { name: "Trophy", offset: 0x1daf8, type: "variable", dataType: "uint32" },
              { name: "???", offset: 0x1dafc, type: "variable", dataType: "uint32" },

              // Cold Corpse Caper
              { name: "Played Count", offset: 0x1db00, type: "variable", dataType: "uint32" },
              { name: "Rank", offset: 0x1db04, type: "variable", dataType: "uint32" },
              { name: "Kills", offset: 0x1db08, type: "variable", dataType: "uint32" },
              { name: "Trophy", offset: 0x1db0c, type: "variable", dataType: "uint32" },
              { name: "???", offset: 0x1db10, type: "variable", dataType: "uint32" },

              // Elimination Series

              // Baking for the Taking
              { name: "Played Count", offset: 0x1db14, type: "variable", dataType: "uint32" },
              { name: "Time", offset: 0x1db18, type: "variable", dataType: "uint32" },
              { name: "Lives", offset: 0x1db1c, type: "variable", dataType: "uint32" },
              { name: "Trophy", offset: 0x1db20, type: "variable", dataType: "uint32" },
              { name: "???", offset: 0x1db24, type: "variable", dataType: "uint32" },

              // Brace Yourself
              { name: "Played Count", offset: 0x1db28, type: "variable", dataType: "uint32" },
              { name: "Time", offset: 0x1db2c, type: "variable", dataType: "uint32" },
              { name: "Lives", offset: 0x1db30, type: "variable", dataType: "uint32" },
              { name: "Trophy", offset: 0x1db34, type: "variable", dataType: "uint32" },
              { name: "???", offset: 0x1db38, type: "variable", dataType: "uint32" },

              // Starship Whoopers
              { name: "Played Count", offset: 0x1db3c, type: "variable", dataType: "uint32" },
              { name: "Rank", offset: 0x1db40, type: "variable", dataType: "uint32" },
              { name: "Kills", offset: 0x1db44, type: "variable", dataType: "uint32" },
              { name: "Trophy", offset: 0x1db48, type: "variable", dataType: "uint32" },
              { name: "???", offset: 0x1db4c, type: "variable", dataType: "uint32" },

              // Burns 'n' Bangs

              // Snow Business
              { name: "Played Count", offset: 0x1db50, type: "variable", dataType: "uint32" },
              { name: "Kills", offset: 0x1db54, type: "variable", dataType: "uint32" },
              { name: "Time", offset: 0x1db58, type: "variable", dataType: "uint32" },
              { name: "Trophy", offset: 0x1db5c, type: "variable", dataType: "uint32" },
              { name: "???", offset: 0x1db60, type: "variable", dataType: "uint32" },

              // Chinese Burns
              { name: "Played Count", offset: 0x1db64, type: "variable", dataType: "uint32" },
              { name: "Kills", offset: 0x1db68, type: "variable", dataType: "uint32" },
              { name: "Time", offset: 0x1db6c, type: "variable", dataType: "uint32" },
              { name: "Trophy", offset: 0x1db70, type: "variable", dataType: "uint32" },
              { name: "???", offset: 0x1db74, type: "variable", dataType: "uint32" },

              // Rocket Man
              { name: "Played Count", offset: 0x1db78, type: "variable", dataType: "uint32" },
              { name: "Kills", offset: 0x1db7c, type: "variable", dataType: "uint32" },
              { name: "Time", offset: 0x1db80, type: "variable", dataType: "uint32" },
              { name: "Trophy", offset: 0x1db84, type: "variable", dataType: "uint32" },
              { name: "???", offset: 0x1db88, type: "variable", dataType: "uint32" },

              // Outnumbered but Never Outpunned!

              // Someone Has Got to Pay...
              { name: "Played Count", offset: 0x1db8c, type: "variable", dataType: "uint32" },
              { name: "Kills", offset: 0x1db90, type: "variable", dataType: "uint32" },
              { name: "???", offset: 0x1db94, type: "variable", dataType: "uint32" },
              { name: "Trophy", offset: 0x1db98, type: "variable", dataType: "uint32" },
              { name: "???", offset: 0x1db9c, type: "variable", dataType: "uint32" },

              // Time to Split
              { name: "Played Count", offset: 0x1dba0, type: "variable", dataType: "uint32" },
              { name: "Kills", offset: 0x1dba4, type: "variable", dataType: "uint32" },
              { name: "Time", offset: 0x1dba8, type: "variable", dataType: "uint32" },
              { name: "Trophy", offset: 0x1dbac, type: "variable", dataType: "uint32" },
              { name: "???", offset: 0x1dbb0, type: "variable", dataType: "uint32" },

              // Can't Handle This
              { name: "Played Count", offset: 0x1dbb4, type: "variable", dataType: "uint32" },
              { name: "Kills", offset: 0x1dbb8, type: "variable", dataType: "uint32" },
              { name: "Time", offset: 0x1dbbc, type: "variable", dataType: "uint32" },
              { name: "Trophy", offset: 0x1dbc0, type: "variable", dataType: "uint32" },
              { name: "???", offset: 0x1dbc4, type: "variable", dataType: "uint32" },

              // Elite League

              // One Shot Thrills

              // Babes in the Woods
              { name: "Played Count", offset: 0x1dbc8, type: "variable", dataType: "uint32" },
              { name: "Rank", offset: 0x1dbcc, type: "variable", dataType: "uint32" },
              { name: "Kills", offset: 0x1dbd0, type: "variable", dataType: "uint32" },
              { name: "Trophy", offset: 0x1dbd4, type: "variable", dataType: "uint32" },
              { name: "???", offset: 0x1dbd8, type: "variable", dataType: "uint32" },

              // Double Bill
              { name: "Played Count", offset: 0x1dbdc, type: "variable", dataType: "uint32" },
              { name: "Score", offset: 0x1dbe0, type: "variable", dataType: "uint32" },
              { name: "Time", offset: 0x1dbe4, type: "variable", dataType: "uint32" },
              { name: "Trophy", offset: 0x1dbe8, type: "variable", dataType: "uint32" },
              { name: "???", offset: 0x1dbec, type: "variable", dataType: "uint32" },

              // Nikki Jinki Bricky
              { name: "Played Count", offset: 0x1dbf0, type: "variable", dataType: "uint32" },
              { name: "Kills", offset: 0x1dbf4, type: "variable", dataType: "uint32" },
              { name: "Time", offset: 0x1dbf8, type: "variable", dataType: "uint32" },
              { name: "Trophy", offset: 0x1dbfc, type: "variable", dataType: "uint32" },
              { name: "???", offset: 0x1dc00, type: "variable", dataType: "uint32" },

              // Team Series C

              // Bags of Fun
              { name: "Played Count", offset: 0x1dc04, type: "variable", dataType: "uint32" },
              { name: "Bags", offset: 0x1dc08, type: "variable", dataType: "uint32" },
              { name: "???", offset: 0x1dc0c, type: "variable", dataType: "uint32" },
              { name: "Trophy", offset: 0x1dc10, type: "variable", dataType: "uint32" },
              { name: "???", offset: 0x1dc14, type: "variable", dataType: "uint32" },

              // They're Not Pets!
              { name: "Played Count", offset: 0x1dc18, type: "variable", dataType: "uint32" },
              { name: "Rank", offset: 0x1dc1c, type: "variable", dataType: "uint32" },
              { name: "Kills", offset: 0x1dc20, type: "variable", dataType: "uint32" },
              { name: "Trophy", offset: 0x1dc24, type: "variable", dataType: "uint32" },
              { name: "???", offset: 0x1dc28, type: "variable", dataType: "uint32" },

              // Nice Threads
              { name: "Played Count", offset: 0x1dc2c, type: "variable", dataType: "uint32" },
              { name: "Time", offset: 0x1dc30, type: "variable", dataType: "uint32" },
              { name: "???", offset: 0x1dc34, type: "variable", dataType: "uint32" },
              { name: "Trophy", offset: 0x1dc38, type: "variable", dataType: "uint32" },
              { name: "???", offset: 0x1dc3c, type: "variable", dataType: "uint32" },

              // Duel Meaning

              // Golden Thights
              { name: "Played Count", offset: 0x1dc40, type: "variable", dataType: "uint32" },
              { name: "Kills", offset: 0x1dc44, type: "variable", dataType: "uint32" },
              { name: "Time", offset: 0x1dc48, type: "variable", dataType: "uint32" },
              { name: "Trophy", offset: 0x1dc4c, type: "variable", dataType: "uint32" },
              { name: "???", offset: 0x1dc50, type: "variable", dataType: "uint32" },

              // If I'm Ugly - You Smell!
              { name: "Played Count", offset: 0x1dc54, type: "variable", dataType: "uint32" },
              { name: "Lives", offset: 0x1dc58, type: "variable", dataType: "uint32" },
              { name: "Time", offset: 0x1dc5c, type: "variable", dataType: "uint32" },
              { name: "Trophy", offset: 0x1dc60, type: "variable", dataType: "uint32" },
              { name: "???", offset: 0x1dc64, type: "variable", dataType: "uint32" },

              // Golem Guru
              { name: "Played Count", offset: 0x1dc68, type: "variable", dataType: "uint32" },
              { name: "Lives", offset: 0x1dc6c, type: "variable", dataType: "uint32" },
              { name: "Score", offset: 0x1dc70, type: "variable", dataType: "uint32" },
              { name: "Trophy", offset: 0x1dc74, type: "variable", dataType: "uint32" },
              { name: "???", offset: 0x1dc78, type: "variable", dataType: "uint32" },

              // Frantic Series

              // Can't Please Everyone...
              { name: "Played Count", offset: 0x1dc7c, type: "variable", dataType: "uint32" },
              { name: "Score", offset: 0x1dc80, type: "variable", dataType: "uint32" },
              { name: "Time", offset: 0x1dc84, type: "variable", dataType: "uint32" },
              { name: "Trophy", offset: 0x1dc88, type: "variable", dataType: "uint32" },
              { name: "???", offset: 0x1dc8c, type: "variable", dataType: "uint32" },

              // Hangar Hat's Off!
              { name: "Played Count", offset: 0x1dc90, type: "variable", dataType: "uint32" },
              { name: "Kills", offset: 0x1dc94, type: "variable", dataType: "uint32" },
              { name: "Time", offset: 0x1dc98, type: "variable", dataType: "uint32" },
              { name: "Trophy", offset: 0x1dc9c, type: "variable", dataType: "uint32" },
              { name: "???", offset: 0x1dca0, type: "variable", dataType: "uint32" },

              // Big Top Blowout
              { name: "Played Count", offset: 0x1dca4, type: "variable", dataType: "uint32" },
              { name: "Rank", offset: 0x1dca8, type: "variable", dataType: "uint32" },
              { name: "Kills", offset: 0x1dcac, type: "variable", dataType: "uint32" },
              { name: "Trophy", offset: 0x1dcb0, type: "variable", dataType: "uint32" },
              { name: "???", offset: 0x1dcb4, type: "variable", dataType: "uint32" },

              // Sincerest Form of Flattery

              // Aztec the Dino Hunter
              { name: "Played Count", offset: 0x1dcb8, type: "variable", dataType: "uint32" },
              { name: "Kills", offset: 0x1dcbc, type: "variable", dataType: "uint32" },
              { name: "???", offset: 0x1dcc0, type: "variable", dataType: "uint32" },
              { name: "Trophy", offset: 0x1dcc4, type: "variable", dataType: "uint32" },
              { name: "???", offset: 0x1dcc8, type: "variable", dataType: "uint32" },

              // Half Death
              { name: "Played Count", offset: 0x1dccc, type: "variable", dataType: "uint32" },
              { name: "Kills", offset: 0x1dcd0, type: "variable", dataType: "uint32" },
              { name: "Time", offset: 0x1dcd4, type: "variable", dataType: "uint32" },
              { name: "Trophy", offset: 0x1dcd8, type: "variable", dataType: "uint32" },
              { name: "???", offset: 0x1dcdc, type: "variable", dataType: "uint32" },

              // Dead Fractioon
              { name: "Played Count", offset: 0x1dce0, type: "variable", dataType: "uint32" },
              { name: "Kills", offset: 0x1dce4, type: "variable", dataType: "uint32" },
              { name: "Time", offset: 0x1dce8, type: "variable", dataType: "uint32" },
              { name: "Trophy", offset: 0x1dcec, type: "variable", dataType: "uint32" },
              { name: "???", offset: 0x1dcf0, type: "variable", dataType: "uint32" },

              // Statistics
              { name: "Total games", offset: 0x1dcf4, type: "variable", dataType: "uint32" },
              { name: "Success rate (divider)", offset: 0x1dcf8, type: "variable", dataType: "uint32" },
              { name: "Success rate (value)", offset: 0x1dcfc, type: "variable", dataType: "uint32" },
              { name: "Played for", offset: 0x1dd00, type: "variable", dataType: "float32" },
              { name: "Total kills", offset: 0x1dd04, type: "variable", dataType: "uint32" },
              { name: "Total losses", offset: 0x1dd08, type: "variable", dataType: "uint32" },
              { name: "Most kills without dying", offset: 0x1dd0c, type: "variable", dataType: "uint32" },
              { name: "Longest killing spree", offset: 0x1dd10, type: "variable", dataType: "uint32" },
              { name: "Total bullets fired", offset: 0x1dd14, type: "variable", dataType: "uint32" },
              { name: "???", offset: 0x1dd18, type: "variable", dataType: "uint32", hidden: true },
              { name: "???", offset: 0x1dd1c, type: "variable", dataType: "float32", hidden: true },
              { name: "???", offset: 0x1dd20, type: "variable", dataType: "float32", hidden: true },
              { name: "???", offset: 0x1dd24, type: "variable", dataType: "float32", hidden: true },
              { name: "???", offset: 0x1dd28, type: "variable", dataType: "float32", hidden: true },
              { name: "Heads knocked off (1)", offset: 0x1dd2c, type: "variable", dataType: "uint32" },
              { name: "Heads knocked off (2)", offset: 0x1dd30, type: "variable", dataType: "uint32" },
              { name: "Limbs detached", offset: 0x1dd34, type: "variable", dataType: "uint32" },
              { name: "Glass smashed", offset: 0x1dd38, type: "variable", dataType: "uint32" },
              { name: "Melons burst", offset: 0x1dd3c, type: "variable", dataType: "uint32" },
              { name: "???", offset: 0x1dd40, type: "variable", dataType: "uint32", hidden: true },
              { name: "Silenced Pistol", offset: 0x1dd44, type: "variable", dataType: "uint32" },
              { name: "Silenced Pistol (x2)", offset: 0x1dd48, type: "variable", dataType: "uint32" },
              { name: "???", offset: 0x1dd4c, type: "variable", dataType: "uint32", hidden: true },
              { name: "???", offset: 0x1dd50, type: "variable", dataType: "uint32", hidden: true },
              { name: "Luger Pistol", offset: 0x1dd54, type: "variable", dataType: "uint32" },
              { name: "Luger Pistol (x2)", offset: 0x1dd58, type: "variable", dataType: "uint32" },
              { name: "Garrett Revolver", offset: 0x1dd5c, type: "variable", dataType: "uint32" },
              { name: "Garrett Revolver (x2)", offset: 0x1dd60, type: "variable", dataType: "uint32" },
              { name: "Tactical 12-Gauge", offset: 0x1dd64, type: "variable", dataType: "uint32" },
              { name: "Minigun", offset: 0x1dd68, type: "variable", dataType: "uint32" },
              { name: "Sniper Rifle", offset: 0x1dd6c, type: "variable", dataType: "uint32" },
              { name: "Vintage Rifle", offset: 0x1dd70, type: "variable", dataType: "uint32" },
              { name: "???", offset: 0x1dd74, type: "variable", dataType: "uint32", hidden: true },
              { name: "???", offset: 0x1dd78, type: "variable", dataType: "uint32", hidden: true },
              { name: "Soviet S47", offset: 0x1dd7c, type: "variable", dataType: "uint32" },
              { name: "Soviet S47 (x2)", offset: 0x1dd80, type: "variable", dataType: "uint32" },
              { name: "ElectroTool", offset: 0x1dd84, type: "variable", dataType: "uint32" },
              { name: "Scifi Handgun", offset: 0x1dd88, type: "variable", dataType: "uint32" },
              { name: "Rocket Launcher", offset: 0x1dd8c, type: "variable", dataType: "uint32" },
              { name: "Homing Launcher", offset: 0x1dd90, type: "variable", dataType: "uint32" },
              { name: "Lasergun", offset: 0x1dd94, type: "variable", dataType: "uint32" },
              { name: "Plasma Autorifle", offset: 0x1dd98, type: "variable", dataType: "uint32" },
              { name: "???", offset: 0x1dd9c, type: "variable", dataType: "uint32", hidden: true },
              { name: "Proximity Mine", offset: 0x1dda0, type: "variable", dataType: "uint32" },
              { name: "Remote Mine", offset: 0x1dda4, type: "variable", dataType: "uint32" },
              { name: "Timed Mine", offset: 0x1dda8, type: "variable", dataType: "uint32" },
              { name: "Tommy Gun", offset: 0x1ddb0, type: "variable", dataType: "uint32" },
              { name: "Tommy Gun (x2)", offset: 0x1ddb4, type: "variable", dataType: "uint32" },
              { name: "SBP90 Machinegun", offset: 0x1ddb8, type: "variable", dataType: "uint32" },
              { name: "SBP90 Machinegun (x2)", offset: 0x1ddbc, type: "variable", dataType: "uint32" },
              { name: "Shotgun", offset: 0x1ddc0, type: "variable", dataType: "uint32" },
              { name: "Shotgun (x2)", offset: 0x1ddc4, type: "variable", dataType: "uint32" },
              { name: "???", offset: 0x1ddc8, type: "variable", dataType: "uint32", hidden: true },
              { name: "Crossbow", offset: 0x1ddd4, type: "variable", dataType: "uint32" },
              { name: "???", offset: 0x1dde8, type: "variable", dataType: "uint32", hidden: true },
              { name: "???", offset: 0x1ddec, type: "variable", dataType: "float32", hidden: true },
              { name: "???", offset: 0x1ddf0, type: "variable", dataType: "float32", hidden: true },
              { name: "???", offset: 0x1ddf4, type: "variable", dataType: "float32", hidden: true },
              { name: "???", offset: 0x1ddfc, type: "variable", dataType: "float32", hidden: true },
              { name: "???", offset: 0x1de00, type: "variable", dataType: "float32", hidden: true },
              { name: "???", offset: 0x1de04, type: "variable", dataType: "float32", hidden: true },
              { name: "???", offset: 0x1de08, type: "variable", dataType: "float32", hidden: true },
              { name: "???", offset: 0x1de0c, type: "variable", dataType: "float32", hidden: true },
              { name: "???", offset: 0x1de10, type: "variable", dataType: "float32", hidden: true },
              { name: "???", offset: 0x1de14, type: "variable", dataType: "float32", hidden: true },
              { name: "???", offset: 0x1de18, type: "variable", dataType: "float32", hidden: true },
              { name: "???", offset: 0x1de1c, type: "variable", dataType: "float32", hidden: true },
              { name: "???", offset: 0x1de20, type: "variable", dataType: "float32", hidden: true },
              { name: "???", offset: 0x1de28, type: "variable", dataType: "float32", hidden: true },
              { name: "???", offset: 0x1de2c, type: "variable", dataType: "float32", hidden: true },
              { name: "???", offset: 0x1de30, type: "variable", dataType: "float32", hidden: true },
              { name: "???", offset: 0x1de34, type: "variable", dataType: "float32", hidden: true },
              { name: "???", offset: 0x1de38, type: "variable", dataType: "float32", hidden: true },
              { name: "???", offset: 0x1de3c, type: "variable", dataType: "float32", hidden: true },
              { name: "???", offset: 0x1de40, type: "variable", dataType: "float32", hidden: true },
              { name: "???", offset: 0x1de44, type: "variable", dataType: "float32", hidden: true },
              { name: "???", offset: 0x1de48, type: "variable", dataType: "float32", hidden: true },
              { name: "???", offset: 0x1de4c, type: "variable", dataType: "float32", hidden: true },
              { name: "???", offset: 0x1de50, type: "variable", dataType: "float32", hidden: true },
              { name: "???", offset: 0x1de58, type: "variable", dataType: "float32", hidden: true },
              { name: "???", offset: 0x1de5c, type: "variable", dataType: "float32", hidden: true },
              { name: "???", offset: 0x1de60, type: "variable", dataType: "float32", hidden: true },
              { name: "???", offset: 0x1de64, type: "variable", dataType: "float32", hidden: true },
              { name: "???", offset: 0x1de68, type: "variable", dataType: "float32", hidden: true },
              { name: "???", offset: 0x1de6c, type: "variable", dataType: "float32", hidden: true },
              { name: "???", offset: 0x1de70, type: "variable", dataType: "float32", hidden: true },
              { name: "???", offset: 0x1de74, type: "variable", dataType: "float32", hidden: true },
              { name: "???", offset: 0x1de80, type: "variable", dataType: "float32", hidden: true },
              { name: "TimeSplitters dispatched", offset: 0x1de98, type: "variable", dataType: "uint32" },
              { name: "Civilian casualties", offset: 0x1de9c, type: "variable", dataType: "uint32" },
              { name: "Animal cruelty", offset: 0x1dea0, type: "variable", dataType: "uint32" },
              { name: "UFO spotted", offset: 0x1dea4, type: "variable", dataType: "uint32" },
              { name: "Distance travelled", offset: 0x1dea8, type: "variable", dataType: "float32" },
              { name: "Insomnia", offset: 0x1deac, type: "variable", dataType: "float32" },
              { name: "???", offset: 0x1deb0, type: "variable", dataType: "float32", hidden: true },

              // Arcade Awards
              { name: "Most Lethal", offset: 0x1deb8, type: "variable", dataType: "uint8" },
              { name: "Most Losses", offset: 0x1deb9, type: "variable", dataType: "uint8" },
              { name: "Lemming Award", offset: 0x1deba, type: "variable", dataType: "uint8" },
              { name: "Most Professional", offset: 0x1debb, type: "variable", dataType: "uint8" },
              { name: "Multi Kill", offset: 0x1debc, type: "variable", dataType: "uint8" },
              { name: "Longest Spree", offset: 0x1debd, type: "variable", dataType: "uint8" },
              { name: "Most Effective", offset: 0x1debe, type: "variable", dataType: "uint8" },
              { name: "Pathetic Shot", offset: 0x1debf, type: "variable", dataType: "uint8" },
              { name: "Maniac", offset: 0x1dec0, type: "variable", dataType: "uint8" },
              { name: "Brain Surgeon", offset: 0x1dec1, type: "variable", dataType: "uint8" },
              { name: "Fists of Fury", offset: 0x1dec2, type: "variable", dataType: "uint8" },
              { name: "Glass Jaw", offset: 0x1dec3, type: "variable", dataType: "uint8" },
              { name: "Decapitator", offset: 0x1dec4, type: "variable", dataType: "uint8" },
              { name: "Fists of Steel", offset: 0x1dec5, type: "variable", dataType: "uint8" },
              { name: "Betrayer", offset: 0x1dec6, type: "variable", dataType: "uint8" },
              { name: "Vandal", offset: 0x1dec7, type: "variable", dataType: "uint8" },
              { name: "Hypochondriac", offset: 0x1dec8, type: "variable", dataType: "uint8" },
              { name: "AC -10 Award", offset: 0x1dec9, type: "variable", dataType: "uint8" },
              { name: "Where's the Health?", offset: 0x1deca, type: "variable", dataType: "uint8" },
              { name: "Where's the Armour?", offset: 0x1decb, type: "variable", dataType: "uint8" },
              { name: "Hoarder", offset: 0x1decc, type: "variable", dataType: "uint8" },
              { name: "Sloth", offset: 0x1decd, type: "variable", dataType: "uint8" },
              { name: "Most Frantic", offset: 0x1dece, type: "variable", dataType: "uint8" },
              { name: "Backpeddler", offset: 0x1decf, type: "variable", dataType: "uint8" },
              { name: "Sidestepper", offset: 0x1ded0, type: "variable", dataType: "uint8" },
              { name: "Ledgehopper", offset: 0x1ded1, type: "variable", dataType: "uint8" },
              { name: "Most Sneaky", offset: 0x1ded2, type: "variable", dataType: "uint8" },
              { name: "Most Cowardly", offset: 0x1ded3, type: "variable", dataType: "uint8" },
              { name: "Dodger", offset: 0x1ded4, type: "variable", dataType: "uint8" },
              { name: "Most Outgunned", offset: 0x1ded5, type: "variable", dataType: "uint8" },
              { name: "Best Equipped", offset: 0x1ded6, type: "variable", dataType: "uint8" },
              { name: "Unlucky yo Lose", offset: 0x1ded7, type: "variable", dataType: "uint8" },
              { name: "Weapons Expert", offset: 0x1ded8, type: "variable", dataType: "uint8" },
              { name: "Porter", offset: 0x1ded9, type: "variable", dataType: "uint8" },
              { name: "Bag Man", offset: 0x1deda, type: "variable", dataType: "uint8" },
              { name: "Most Useless", offset: 0x1dedb, type: "variable", dataType: "uint8" },
              { name: "Ricochet King", offset: 0x1dedc, type: "variable", dataType: "uint8" },
              { name: "Underequipped", offset: 0x1dedd, type: "variable", dataType: "uint8" },
              { name: "Victim", offset: 0x1dede, type: "variable", dataType: "uint8" },
              { name: "Bully", offset: 0x1dedf, type: "variable", dataType: "uint8" },
              { name: "Most Peaceful", offset: 0x1dee0, type: "variable", dataType: "uint8" },
              { name: "Most Dishonourable", offset: 0x1dee1, type: "variable", dataType: "uint8" },
              { name: "Most Manic", offset: 0x1dee2, type: "variable", dataType: "uint8" },
              { name: "Cartographer?", offset: 0x1dee3, type: "variable", dataType: "uint8" },
              { name: "Shortest Innings", offset: 0x1dee4, type: "variable", dataType: "uint8" },
              { name: "Longest Innings", offset: 0x1dee5, type: "variable", dataType: "uint8" },
              { name: "Survivor", offset: 0x1dee6, type: "variable", dataType: "uint8" },
              { name: "Marksmanship", offset: 0x1dee7, type: "variable", dataType: "uint8" },
              { name: "Sniper", offset: 0x1dee8, type: "variable", dataType: "uint8" },
              { name: "Most Flammable", offset: 0x1dee9, type: "variable", dataType: "uint8" },
              { name: "Persistance Award", offset: 0x1deea, type: "variable", dataType: "uint8" },
              { name: "Traveller Award", offset: 0x1deeb, type: "variable", dataType: "uint8" },
              { name: "Trigger Happy Award", offset: 0x1deec, type: "variable", dataType: "uint8" },
              { name: "Insomniac Award", offset: 0x1deed, type: "variable", dataType: "uint8" },
              { name: "Beheader Award", offset: 0x1deee, type: "variable", dataType: "uint8" },
              { name: "Smasher Award", offset: 0x1deef, type: "variable", dataType: "uint8" },
              { name: "Brutality Award", offset: 0x1def0, type: "variable", dataType: "uint8" },
              { name: "Golden Oldie Award", offset: 0x1def1, type: "variable", dataType: "uint8" },
              { name: "???", offset: 0x1def2, type: "variable", dataType: "uint8", hidden: true },
              { name: "???", offset: 0x1def3, type: "variable", dataType: "uint8", hidden: true },

              // Cutscenes
              { type: "bitflags", flags: [
                { offset: 0x1def4, bit: 0, label: "Introduction" },
                { offset: 0x1def4, bit: 1, label: "Siberia" },
                { offset: 0x1def4, bit: 2, label: "Chicago" },
                { offset: 0x1def4, bit: 3, label: "Notre Dame" },
                { offset: 0x1def4, bit: 4, label: "Return to Planet X" },
                { offset: 0x1def4, bit: 5, label: "NeoTokyo" },
                { offset: 0x1def4, bit: 6, label: "Wild West" },
                { offset: 0x1def4, bit: 7, label: "Atom Smasher" },
                { offset: 0x1def5, bit: 0, label: "Aztec Ruins" },
                { offset: 0x1def5, bit: 1, label: "Crystal Recovered" },
                { offset: 0x1def5, bit: 2, label: "Robot Factory" },
                { offset: 0x1def5, bit: 3, label: "Space Station" },
                { offset: 0x1def5, bit: 4, label: "Ending" },
                { offset: 0x1def5, bit: 5, label: "???", hidden: true },
                { offset: 0x1def5, bit: 6, label: "???", hidden: true },
                { offset: 0x1def5, bit: 7, label: "???", hidden: true },
                { offset: 0x1def6, bit: 0, label: "???", hidden: true },
                { offset: 0x1def6, bit: 1, label: "???", hidden: true },
                { offset: 0x1def6, bit: 2, label: "???", hidden: true },
                { offset: 0x1def6, bit: 3, label: "???", hidden: true },
                { offset: 0x1def6, bit: 4, label: "???", hidden: true },
                { offset: 0x1def6, bit: 5, label: "???", hidden: true },
                { offset: 0x1def6, bit: 6, label: "???", hidden: true },
                { offset: 0x1def6, bit: 7, label: "???", hidden: true },
                { offset: 0x1def7, bit: 0, label: "???", hidden: true },
                { offset: 0x1def7, bit: 1, label: "???", hidden: true },
                { offset: 0x1def7, bit: 2, label: "???", hidden: true },
                { offset: 0x1def7, bit: 3, label: "???", hidden: true },
                { offset: 0x1def7, bit: 4, label: "???", hidden: true },
                { offset: 0x1def7, bit: 5, label: "???", hidden: true },
                { offset: 0x1def7, bit: 6, label: "???", hidden: true },
                { offset: 0x1def7, bit: 7, label: "???", hidden: true },
              ]},

              // Story

              // Easy
              { type: "bitflags", flags: [
                { offset: 0x1def8, bit: 0, label: "Siberia" },
                { offset: 0x1def8, bit: 1, label: "Chicago" },
                { offset: 0x1def8, bit: 2, label: "Notre Dame" },
                { offset: 0x1def8, bit: 3, label: "Return to Planet X" },
                { offset: 0x1def8, bit: 4, label: "NeoTokyo" },
                { offset: 0x1def8, bit: 5, label: "Wild West" },
                { offset: 0x1def8, bit: 6, label: "Atom Smasher" },
                { offset: 0x1def8, bit: 7, label: "Aztec Ruins" },
                { offset: 0x1def9, bit: 0, label: "Robot Factory" },
                { offset: 0x1def9, bit: 1, label: "Space Station" },
                { offset: 0x1def9, bit: 2, label: "???", hidden: true },
                { offset: 0x1def9, bit: 3, label: "???", hidden: true },
                { offset: 0x1def9, bit: 4, label: "???", hidden: true },
                { offset: 0x1def9, bit: 5, label: "???", hidden: true },
                { offset: 0x1def9, bit: 6, label: "???", hidden: true },
                { offset: 0x1def9, bit: 7, label: "???", hidden: true },
                { offset: 0x1defa, bit: 0, label: "???", hidden: true },
                { offset: 0x1defa, bit: 1, label: "???", hidden: true },
                { offset: 0x1defa, bit: 2, label: "???", hidden: true },
                { offset: 0x1defa, bit: 3, label: "???", hidden: true },
                { offset: 0x1defa, bit: 4, label: "???", hidden: true },
                { offset: 0x1defa, bit: 5, label: "???", hidden: true },
                { offset: 0x1defa, bit: 6, label: "???", hidden: true },
                { offset: 0x1defa, bit: 7, label: "???", hidden: true },
                { offset: 0x1defb, bit: 0, label: "???", hidden: true },
                { offset: 0x1defb, bit: 1, label: "???", hidden: true },
                { offset: 0x1defb, bit: 2, label: "???", hidden: true },
                { offset: 0x1defb, bit: 3, label: "???", hidden: true },
                { offset: 0x1defb, bit: 4, label: "???", hidden: true },
                { offset: 0x1defb, bit: 5, label: "???", hidden: true },
                { offset: 0x1defb, bit: 6, label: "???", hidden: true },
                { offset: 0x1defb, bit: 7, label: "???", hidden: true },
              ]},

              // Normal
              { type: "bitflags", flags: [
                { offset: 0x1defc, bit: 0, label: "Siberia" },
                { offset: 0x1defc, bit: 1, label: "Chicago" },
                { offset: 0x1defc, bit: 2, label: "Notre Dame" },
                { offset: 0x1defc, bit: 3, label: "Return to Planet X" },
                { offset: 0x1defc, bit: 4, label: "NeoTokyo" },
                { offset: 0x1defc, bit: 5, label: "Wild West" },
                { offset: 0x1defc, bit: 6, label: "Atom Smasher" },
                { offset: 0x1defc, bit: 7, label: "Aztec Ruins" },
                { offset: 0x1defd, bit: 0, label: "Robot Factory" },
                { offset: 0x1defd, bit: 1, label: "Space Station" },
                { offset: 0x1defd, bit: 2, label: "???", hidden: true },
                { offset: 0x1defd, bit: 3, label: "???", hidden: true },
                { offset: 0x1defd, bit: 4, label: "???", hidden: true },
                { offset: 0x1defd, bit: 5, label: "???", hidden: true },
                { offset: 0x1defd, bit: 6, label: "???", hidden: true },
                { offset: 0x1defd, bit: 7, label: "???", hidden: true },
                { offset: 0x1defe, bit: 0, label: "???", hidden: true },
                { offset: 0x1defe, bit: 1, label: "???", hidden: true },
                { offset: 0x1defe, bit: 2, label: "???", hidden: true },
                { offset: 0x1defe, bit: 3, label: "???", hidden: true },
                { offset: 0x1defe, bit: 4, label: "???", hidden: true },
                { offset: 0x1defe, bit: 5, label: "???", hidden: true },
                { offset: 0x1defe, bit: 6, label: "???", hidden: true },
                { offset: 0x1defe, bit: 7, label: "???", hidden: true },
                { offset: 0x1deff, bit: 0, label: "???", hidden: true },
                { offset: 0x1deff, bit: 1, label: "???", hidden: true },
                { offset: 0x1deff, bit: 2, label: "???", hidden: true },
                { offset: 0x1deff, bit: 3, label: "???", hidden: true },
                { offset: 0x1deff, bit: 4, label: "???", hidden: true },
                { offset: 0x1deff, bit: 5, label: "???", hidden: true },
                { offset: 0x1deff, bit: 6, label: "???", hidden: true },
                { offset: 0x1deff, bit: 7, label: "???", hidden: true },
              ]},

              // Hard
              { type: "bitflags", flags: [
                { offset: 0x1df00, bit: 0, label: "Siberia" },
                { offset: 0x1df00, bit: 1, label: "Chicago" },
                { offset: 0x1df00, bit: 2, label: "Notre Dame" },
                { offset: 0x1df00, bit: 3, label: "Return to Planet X" },
                { offset: 0x1df00, bit: 4, label: "NeoTokyo" },
                { offset: 0x1df00, bit: 5, label: "Wild West" },
                { offset: 0x1df00, bit: 6, label: "Atom Smasher" },
                { offset: 0x1df00, bit: 7, label: "Aztec Ruins" },
                { offset: 0x1df01, bit: 0, label: "Robot Factory" },
                { offset: 0x1df01, bit: 1, label: "Space Station" },
                { offset: 0x1df01, bit: 2, label: "???", hidden: true },
                { offset: 0x1df01, bit: 3, label: "???", hidden: true },
                { offset: 0x1df01, bit: 4, label: "???", hidden: true },
                { offset: 0x1df01, bit: 5, label: "???", hidden: true },
                { offset: 0x1df01, bit: 6, label: "???", hidden: true },
                { offset: 0x1df01, bit: 7, label: "???", hidden: true },
                { offset: 0x1df02, bit: 0, label: "???", hidden: true },
                { offset: 0x1df02, bit: 1, label: "???", hidden: true },
                { offset: 0x1df02, bit: 2, label: "???", hidden: true },
                { offset: 0x1df02, bit: 3, label: "???", hidden: true },
                { offset: 0x1df02, bit: 4, label: "???", hidden: true },
                { offset: 0x1df02, bit: 5, label: "???", hidden: true },
                { offset: 0x1df02, bit: 6, label: "???", hidden: true },
                { offset: 0x1df02, bit: 7, label: "???", hidden: true },
                { offset: 0x1df03, bit: 0, label: "???", hidden: true },
                { offset: 0x1df03, bit: 1, label: "???", hidden: true },
                { offset: 0x1df03, bit: 2, label: "???", hidden: true },
                { offset: 0x1df03, bit: 3, label: "???", hidden: true },
                { offset: 0x1df03, bit: 4, label: "???", hidden: true },
                { offset: 0x1df03, bit: 5, label: "???", hidden: true },
                { offset: 0x1df03, bit: 6, label: "???", hidden: true },
                { offset: 0x1df03, bit: 7, label: "???", hidden: true },
              ]},

              // Story Co-op

              // Easy
              { type: "bitflags", flags: [
                { offset: 0x1df04, bit: 0, label: "Siberia" },
                { offset: 0x1df04, bit: 1, label: "Chicago" },
                { offset: 0x1df04, bit: 2, label: "Notre Dame" },
                { offset: 0x1df04, bit: 3, label: "Return to Planet X" },
                { offset: 0x1df04, bit: 4, label: "NeoTokyo" },
                { offset: 0x1df04, bit: 5, label: "Wild West" },
                { offset: 0x1df04, bit: 6, label: "Atom Smasher" },
                { offset: 0x1df04, bit: 7, label: "Aztec Ruins" },
                { offset: 0x1df05, bit: 0, label: "Robot Factory" },
                { offset: 0x1df05, bit: 1, label: "Space Station" },
                { offset: 0x1df05, bit: 2, label: "???", hidden: true },
                { offset: 0x1df05, bit: 3, label: "???", hidden: true },
                { offset: 0x1df05, bit: 4, label: "???", hidden: true },
                { offset: 0x1df05, bit: 5, label: "???", hidden: true },
                { offset: 0x1df05, bit: 6, label: "???", hidden: true },
                { offset: 0x1df05, bit: 7, label: "???", hidden: true },
                { offset: 0x1df06, bit: 0, label: "???", hidden: true },
                { offset: 0x1df06, bit: 1, label: "???", hidden: true },
                { offset: 0x1df06, bit: 2, label: "???", hidden: true },
                { offset: 0x1df06, bit: 3, label: "???", hidden: true },
                { offset: 0x1df06, bit: 4, label: "???", hidden: true },
                { offset: 0x1df06, bit: 5, label: "???", hidden: true },
                { offset: 0x1df06, bit: 6, label: "???", hidden: true },
                { offset: 0x1df06, bit: 7, label: "???", hidden: true },
                { offset: 0x1df07, bit: 0, label: "???", hidden: true },
                { offset: 0x1df07, bit: 1, label: "???", hidden: true },
                { offset: 0x1df07, bit: 2, label: "???", hidden: true },
                { offset: 0x1df07, bit: 3, label: "???", hidden: true },
                { offset: 0x1df07, bit: 4, label: "???", hidden: true },
                { offset: 0x1df07, bit: 5, label: "???", hidden: true },
                { offset: 0x1df07, bit: 6, label: "???", hidden: true },
                { offset: 0x1df07, bit: 7, label: "???", hidden: true },
              ]},

              // Normal
              { type: "bitflags", flags: [
                { offset: 0x1df08, bit: 0, label: "Siberia" },
                { offset: 0x1df08, bit: 1, label: "Chicago" },
                { offset: 0x1df08, bit: 2, label: "Notre Dame" },
                { offset: 0x1df08, bit: 3, label: "Return to Planet X" },
                { offset: 0x1df08, bit: 4, label: "NeoTokyo" },
                { offset: 0x1df08, bit: 5, label: "Wild West" },
                { offset: 0x1df08, bit: 6, label: "Atom Smasher" },
                { offset: 0x1df08, bit: 7, label: "Aztec Ruins" },
                { offset: 0x1df09, bit: 0, label: "Robot Factory" },
                { offset: 0x1df09, bit: 1, label: "Space Station" },
                { offset: 0x1df09, bit: 2, label: "???", hidden: true },
                { offset: 0x1df09, bit: 3, label: "???", hidden: true },
                { offset: 0x1df09, bit: 4, label: "???", hidden: true },
                { offset: 0x1df09, bit: 5, label: "???", hidden: true },
                { offset: 0x1df09, bit: 6, label: "???", hidden: true },
                { offset: 0x1df09, bit: 7, label: "???", hidden: true },
                { offset: 0x1df0a, bit: 0, label: "???", hidden: true },
                { offset: 0x1df0a, bit: 1, label: "???", hidden: true },
                { offset: 0x1df0a, bit: 2, label: "???", hidden: true },
                { offset: 0x1df0a, bit: 3, label: "???", hidden: true },
                { offset: 0x1df0a, bit: 4, label: "???", hidden: true },
                { offset: 0x1df0a, bit: 5, label: "???", hidden: true },
                { offset: 0x1df0a, bit: 6, label: "???", hidden: true },
                { offset: 0x1df0a, bit: 7, label: "???", hidden: true },
                { offset: 0x1df0b, bit: 0, label: "???", hidden: true },
                { offset: 0x1df0b, bit: 1, label: "???", hidden: true },
                { offset: 0x1df0b, bit: 2, label: "???", hidden: true },
                { offset: 0x1df0b, bit: 3, label: "???", hidden: true },
                { offset: 0x1df0b, bit: 4, label: "???", hidden: true },
                { offset: 0x1df0b, bit: 5, label: "???", hidden: true },
                { offset: 0x1df0b, bit: 6, label: "???", hidden: true },
                { offset: 0x1df0b, bit: 7, label: "???", hidden: true },
              ]},

              // Hard
              { type: "bitflags", flags: [
                { offset: 0x1df0c, bit: 0, label: "Siberia" },
                { offset: 0x1df0c, bit: 1, label: "Chicago" },
                { offset: 0x1df0c, bit: 2, label: "Notre Dame" },
                { offset: 0x1df0c, bit: 3, label: "Return to Planet X" },
                { offset: 0x1df0c, bit: 4, label: "NeoTokyo" },
                { offset: 0x1df0c, bit: 5, label: "Wild West" },
                { offset: 0x1df0c, bit: 6, label: "Atom Smasher" },
                { offset: 0x1df0c, bit: 7, label: "Aztec Ruins" },
                { offset: 0x1df0d, bit: 0, label: "Robot Factory" },
                { offset: 0x1df0d, bit: 1, label: "Space Station" },
                { offset: 0x1df0d, bit: 2, label: "???", hidden: true },
                { offset: 0x1df0d, bit: 3, label: "???", hidden: true },
                { offset: 0x1df0d, bit: 4, label: "???", hidden: true },
                { offset: 0x1df0d, bit: 5, label: "???", hidden: true },
                { offset: 0x1df0d, bit: 6, label: "???", hidden: true },
                { offset: 0x1df0d, bit: 7, label: "???", hidden: true },
                { offset: 0x1df0e, bit: 0, label: "???", hidden: true },
                { offset: 0x1df0e, bit: 1, label: "???", hidden: true },
                { offset: 0x1df0e, bit: 2, label: "???", hidden: true },
                { offset: 0x1df0e, bit: 3, label: "???", hidden: true },
                { offset: 0x1df0e, bit: 4, label: "???", hidden: true },
                { offset: 0x1df0e, bit: 5, label: "???", hidden: true },
                { offset: 0x1df0e, bit: 6, label: "???", hidden: true },
                { offset: 0x1df0e, bit: 7, label: "???", hidden: true },
                { offset: 0x1df0f, bit: 0, label: "???", hidden: true },
                { offset: 0x1df0f, bit: 1, label: "???", hidden: true },
                { offset: 0x1df0f, bit: 2, label: "???", hidden: true },
                { offset: 0x1df0f, bit: 3, label: "???", hidden: true },
                { offset: 0x1df0f, bit: 4, label: "???", hidden: true },
                { offset: 0x1df0f, bit: 5, label: "???", hidden: true },
                { offset: 0x1df0f, bit: 6, label: "???", hidden: true },
                { offset: 0x1df0f, bit: 7, label: "???", hidden: true },
              ]},

              // Challenge

              // Glass Smash
              { type: "bitflags", flags: [
                { offset: 0x1df10, bit: 0, label: "Plane in the Neck" },
                { offset: 0x1df10, bit: 1, label: "Bricking it" },
                { offset: 0x1df10, bit: 2, label: "Stain Removal" },
              ]},

              // Infiltration
              { type: "bitflags", flags: [
                { offset: 0x1df10, bit: 3, label: "Silent but Deadly" },
                { offset: 0x1df10, bit: 4, label: "Trouble at the Docks" },
                { offset: 0x1df10, bit: 5, label: "Escape from NeoTokyo" },
              ]},

              // Banana Chomp
              { type: "bitflags", flags: [
                { offset: 0x1df10, bit: 6, label: "Gone Bananas" },
                { offset: 0x1df10, bit: 7, label: "Monkey Business" },
                { offset: 0x1df11, bit: 0, label: "Playing With Fire" },
              ]},

              // Cut-out Shoot-out
              { type: "bitflags", flags: [
                { offset: 0x1df11, bit: 1, label: "Take 'em Down" },
                { offset: 0x1df11, bit: 2, label: "Fall Out" },
                { offset: 0x1df11, bit: 3, label: "Pick Yer Piece" },
              ]},

              // TimeSplitters 'Story' Classic
              { type: "bitflags", flags: [
                { offset: 0x1df11, bit: 4, label: "Hit Me Baby One Morgue Time" },
                { offset: 0x1df11, bit: 5, label: "Badass Buspass Impasse" },
                { offset: 0x1df11, bit: 6, label: "But Where fo the Batteries Go" },
              ]},

              // Behead The Undead
              { type: "bitflags", flags: [
                { offset: 0x1df11, bit: 7, label: "Fight Off The Living Dead" },
                { offset: 0x1df12, bit: 0, label: "Day of the Dammed" },
                { offset: 0x1df12, bit: 1, label: "Sergio's Last Stand" },
              ]},

              // Monkeying Around
              { type: "bitflags", flags: [
                { offset: 0x1df12, bit: 2, label: "Simian Shootout" },
                { offset: 0x1df12, bit: 3, label: "Monkey Mahyem" },
                { offset: 0x1df12, bit: 4, label: "Dam Bursters" },
              ]},

              // Arcade

              // Amateur League

              // Beginners Series
              { type: "bitflags", flags: [
                { offset: 0x1df12, bit: 5, label: "Adios Amigos!" },
                { offset: 0x1df12, bit: 6, label: "Casualty" },
                { offset: 0x1df12, bit: 7, label: "Top Shot" },
              ]},

              // Mode Madness
              { type: "bitflags", flags: [
                { offset: 0x1df13, bit: 0, label: "Shrinking from the Cold" },
                { offset: 0x1df13, bit: 1, label: "Chastity Chased" },
                { offset: 0x1df13, bit: 2, label: "Scrap Metal" },
              ]},

              // It's a Blast
              { type: "bitflags", flags: [
                { offset: 0x1df13, bit: 3, label: "Night Shift" },
                { offset: 0x1df13, bit: 4, label: "Spoils of War" },
                { offset: 0x1df13, bit: 5, label: "Demolition Derby" },
              ]},

              // Too Hot to Handle
              { type: "bitflags", flags: [
                { offset: 0x1df13, bit: 6, label: "Monkey Immolation" },
                { offset: 0x1df13, bit: 7, label: "Burns Department" },
                { offset: 0x1df14, bit: 0, label: "Disco Inferno" },
              ]},

              // Team Series A
              { type: "bitflags", flags: [
                { offset: 0x1df14, bit: 1, label: "Club Soda" },
                { offset: 0x1df14, bit: 2, label: "Station Stand" },
                { offset: 0x1df14, bit: 3, label: "Men In Gray" },
              ]},

              // Honorary League

              // Team Series B
              { type: "bitflags", flags: [
                { offset: 0x1df14, bit: 4, label: "Hack a Hacker" },
                { offset: 0x1df14, bit: 5, label: "Rice Cracker Rush" },
                { offset: 0x1df14, bit: 6, label: "Superfly Lady" },
              ]},

              // Maximus
              { type: "bitflags", flags: [
                { offset: 0x1df14, bit: 7, label: "R109 Beta" },
                { offset: 0x1df15, bit: 0, label: "Killer Queen" },
                { offset: 0x1df15, bit: 1, label: "Cold Corpse Caper" },
              ]},

              // Elimination Series
              { type: "bitflags", flags: [
                { offset: 0x1df15, bit: 2, label: "Baking for the Taking" },
                { offset: 0x1df15, bit: 3, label: "Brace Yourself" },
                { offset: 0x1df15, bit: 4, label: "Starship Whoopers" },
              ]},

              // Burns 'n' Bangs
              { type: "bitflags", flags: [
                { offset: 0x1df15, bit: 5, label: "Snow Business" },
                { offset: 0x1df15, bit: 6, label: "Chinese Burns" },
                { offset: 0x1df15, bit: 7, label: "Rocket Man" },
              ]},

              // Outnumbered but Never Outpunned!
              { type: "bitflags", flags: [
                { offset: 0x1df16, bit: 0, label: "Someone Has Got to Pay..." },
                { offset: 0x1df16, bit: 1, label: "Time to Split" },
                { offset: 0x1df16, bit: 2, label: "Can't Handle This" },
              ]},

              // Elite League

              // One Shot Thrills
              { type: "bitflags", flags: [
                { offset: 0x1df16, bit: 3, label: "Babes in the Woods" },
                { offset: 0x1df16, bit: 4, label: "Double Bill" },
                { offset: 0x1df16, bit: 5, label: "Nikki Jinki Bricky" },
              ]},

              // Team Series C
              { type: "bitflags", flags: [
                { offset: 0x1df16, bit: 6, label: "Bags of Fun" },
                { offset: 0x1df16, bit: 7, label: "They're Not Pets!" },
                { offset: 0x1df17, bit: 0, label: "Nice Threads" },
              ]},

              // Duel Meaning
              { type: "bitflags", flags: [
                { offset: 0x1df17, bit: 1, label: "Golden Thighs" },
                { offset: 0x1df17, bit: 2, label: "If I'm Ugly - You Smell!" },
                { offset: 0x1df17, bit: 3, label: "Golem Guru" },
              ]},

              // Frantic Series
              { type: "bitflags", flags: [
                { offset: 0x1df17, bit: 4, label: "Can't Please Everyone..." },
                { offset: 0x1df17, bit: 5, label: "Hangar Hat's Off!" },
                { offset: 0x1df17, bit: 6, label: "Big Top Blowout" },
              ]},

              // Sincerest Form of Flattery
              { type: "bitflags", flags: [
                { offset: 0x1df17, bit: 7, label: "Aztec the Dino Hunter" },
                { offset: 0x1df18, bit: 0, label: "Half Death" },
                { offset: 0x1df18, bit: 1, label: "Dead Fraction" },
              ]},

              { type: "bitflags", flags: [
                { offset: 0x1df18, bit: 2, label: "???", hidden: true },
                { offset: 0x1df18, bit: 3, label: "???", hidden: true },
                { offset: 0x1df18, bit: 4, label: "???", hidden: true },
                { offset: 0x1df18, bit: 5, label: "???", hidden: true },
                { offset: 0x1df18, bit: 6, label: "???", hidden: true },
                { offset: 0x1df18, bit: 7, label: "???", hidden: true },
                { offset: 0x1df19, bit: 0, label: "???", hidden: true },
                { offset: 0x1df19, bit: 1, label: "???", hidden: true },
                { offset: 0x1df19, bit: 2, label: "???", hidden: true },
                { offset: 0x1df19, bit: 3, label: "???", hidden: true },
                { offset: 0x1df19, bit: 4, label: "???", hidden: true },
                { offset: 0x1df19, bit: 5, label: "???", hidden: true },
                { offset: 0x1df19, bit: 6, label: "???", hidden: true },
                { offset: 0x1df19, bit: 7, label: "???", hidden: true },
                { offset: 0x1df1a, bit: 0, label: "???", hidden: true },
                { offset: 0x1df1a, bit: 1, label: "???", hidden: true },
                { offset: 0x1df1a, bit: 2, label: "???", hidden: true },
                { offset: 0x1df1a, bit: 3, label: "???", hidden: true },
                { offset: 0x1df1a, bit: 4, label: "???", hidden: true },
                { offset: 0x1df1a, bit: 5, label: "???", hidden: true },
                { offset: 0x1df1a, bit: 6, label: "???", hidden: true },
                { offset: 0x1df1a, bit: 7, label: "???", hidden: true },
                { offset: 0x1df1b, bit: 0, label: "???", hidden: true },
                { offset: 0x1df1b, bit: 1, label: "???", hidden: true },
                { offset: 0x1df1b, bit: 2, label: "???", hidden: true },
                { offset: 0x1df1b, bit: 3, label: "???", hidden: true },
                { offset: 0x1df1b, bit: 4, label: "???", hidden: true },
                { offset: 0x1df1b, bit: 5, label: "???", hidden: true },
                { offset: 0x1df1b, bit: 6, label: "???", hidden: true },
                { offset: 0x1df1b, bit: 7, label: "???", hidden: true },
                { offset: 0x1df20, bit: 0, label: "Cheats: Rotating Heads" },
                { offset: 0x1df20, bit: 1, label: "???", hidden: true },
                { offset: 0x1df20, bit: 2, label: "The Hunchback" },
                { offset: 0x1df20, bit: 3, label: "???", hidden: true },
                { offset: 0x1df20, bit: 4, label: "???", hidden: true },
                { offset: 0x1df20, bit: 5, label: "???", hidden: true },
                { offset: 0x1df20, bit: 6, label: "Private Coal" },
                { offset: 0x1df20, bit: 7, label: "Private Poorly" },
                { offset: 0x1df21, bit: 0, label: "Wood Golem" },
                { offset: 0x1df21, bit: 1, label: "Ample Sally" },
                { offset: 0x1df21, bit: 2, label: "Marco the Snitch" },
                { offset: 0x1df21, bit: 3, label: "Sgt Rock" },
                { offset: 0x1df21, bit: 4, label: "The Cropolite" },
                { offset: 0x1df21, bit: 5, label: "Badass Cyborg" },
                { offset: 0x1df21, bit: 6, label: "R One-Oh-Seven" },
                { offset: 0x1df21, bit: 7, label: "Sewer Zombie" },
                { offset: 0x1df22, bit: 0, label: "Feeder Zombie" },
                { offset: 0x1df22, bit: 1, label: "Sergio" },
                { offset: 0x1df22, bit: 2, label: "Insect Mutant" },
                { offset: 0x1df22, bit: 3, label: "Mischief" },
                { offset: 0x1df22, bit: 4, label: "Robofish" },
                { offset: 0x1df22, bit: 5, label: "Hector Baboso" },
                { offset: 0x1df22, bit: 6, label: "Dr. Peadbody" },
                { offset: 0x1df22, bit: 7, label: "???", hidden: true },
                { offset: 0x1df23, bit: 0, label: "???", hidden: true },
                { offset: 0x1df23, bit: 1, label: "???", hidden: true },
                { offset: 0x1df23, bit: 2, label: "???", hidden: true },
                { offset: 0x1df23, bit: 3, label: "???", hidden: true },
                { offset: 0x1df23, bit: 4, label: "???", hidden: true },
                { offset: 0x1df23, bit: 5, label: "Male Trooper" },
                { offset: 0x1df23, bit: 6, label: "???", hidden: true },
                { offset: 0x1df23, bit: 7, label: "???", hidden: true },
                { offset: 0x1df24, bit: 0, label: "Louie Bignose" },
                { offset: 0x1df24, bit: 1, label: "Slick Tommy" },
                { offset: 0x1df24, bit: 2, label: "???", hidden: true },
                { offset: 0x1df24, bit: 3, label: "???", hidden: true },
                { offset: 0x1df24, bit: 4, label: "Milkbaby" },
                { offset: 0x1df24, bit: 5, label: "Riot Officer" },
                { offset: 0x1df24, bit: 6, label: "???", hidden: true },
                { offset: 0x1df24, bit: 7, label: "???", hidden: true },
                { offset: 0x1df25, bit: 0, label: "Leo Krupps" },
                { offset: 0x1df25, bit: 1, label: "Gargoyle" },
                { offset: 0x1df25, bit: 2, label: "Gingerbread Man" },
                { offset: 0x1df25, bit: 3, label: "Braces" },
                { offset: 0x1df25, bit: 4, label: "???", hidden: true },
                { offset: 0x1df25, bit: 5, label: "Snowman" },
                { offset: 0x1df25, bit: 6, label: "Calamari" },
                { offset: 0x1df25, bit: 7, label: "Venus Starr" },
                { offset: 0x1df26, bit: 0, label: "Duckman Drake" },
                { offset: 0x1df26, bit: 1, label: "Barby Gimp" },
                { offset: 0x1df26, bit: 2, label: "Hatchet Sal" },
                { offset: 0x1df26, bit: 3, label: "Jo-Beth Casey" },
                { offset: 0x1df26, bit: 4, label: "Beetleman" },
                { offset: 0x1df26, bit: 5, label: "Nikki" },
                { offset: 0x1df26, bit: 6, label: "Ringmistress" },
                { offset: 0x1df26, bit: 7, label: "Baby Drone" },
                { offset: 0x1df27, bit: 0, label: "???", hidden: true },
                { offset: 0x1df27, bit: 1, label: "Aztec Warrior" },
                { offset: 0x1df27, bit: 2, label: "Mikey Two-guns" },
                { offset: 0x1df27, bit: 3, label: "Kypriss" },
                { offset: 0x1df27, bit: 4, label: "Maiden" },
                { offset: 0x1df27, bit: 5, label: "Henchman" },
                { offset: 0x1df27, bit: 6, label: "Mister Giggles" },
                { offset: 0x1df27, bit: 7, label: "Dinosaur" },
                { offset: 0x1df28, bit: 0, label: "Drone Splitter" },
                { offset: 0x1df28, bit: 1, label: "Jebediah Crump" },
                { offset: 0x1df28, bit: 2, label: "???", hidden: true },
                { offset: 0x1df28, bit: 3, label: "???", hidden: true },
                { offset: 0x1df28, bit: 4, label: "???", hidden: true },
                { offset: 0x1df28, bit: 5, label: "???", hidden: true },
                { offset: 0x1df28, bit: 6, label: "???", hidden: true },
                { offset: 0x1df28, bit: 7, label: "???", hidden: true },
                { offset: 0x1df29, bit: 0, label: "???", hidden: true },
                { offset: 0x1df29, bit: 1, label: "???", hidden: true },
                { offset: 0x1df29, bit: 2, label: "???", hidden: true },
                { offset: 0x1df29, bit: 3, label: "???", hidden: true },
                { offset: 0x1df29, bit: 4, label: "???", hidden: true },
                { offset: 0x1df29, bit: 5, label: "???", hidden: true },
                { offset: 0x1df29, bit: 6, label: "???", hidden: true },
                { offset: 0x1df29, bit: 7, label: "???", hidden: true },
                { offset: 0x1df2a, bit: 0, label: "???", hidden: true },
                { offset: 0x1df2a, bit: 1, label: "???", hidden: true },
                { offset: 0x1df2a, bit: 2, label: "???", hidden: true },
                { offset: 0x1df2a, bit: 3, label: "???", hidden: true },
                { offset: 0x1df2a, bit: 4, label: "???", hidden: true },
                { offset: 0x1df2a, bit: 5, label: "???", hidden: true },
                { offset: 0x1df2a, bit: 6, label: "???", hidden: true },
                { offset: 0x1df2a, bit: 7, label: "???", hidden: true },
                { offset: 0x1df2b, bit: 0, label: "???", hidden: true },
                { offset: 0x1df2b, bit: 1, label: "???", hidden: true },
                { offset: 0x1df2b, bit: 2, label: "???", hidden: true },
                { offset: 0x1df2b, bit: 3, label: "???", hidden: true },
                { offset: 0x1df2b, bit: 4, label: "???", hidden: true },
                { offset: 0x1df2b, bit: 5, label: "???", hidden: true },
                { offset: 0x1df2b, bit: 6, label: "???", hidden: true },
                { offset: 0x1df2b, bit: 7, label: "???", hidden: true },
                { offset: 0x1df2c, bit: 0, label: "???", hidden: true },
                { offset: 0x1df2c, bit: 1, label: "???", hidden: true },
                { offset: 0x1df2c, bit: 2, label: "???", hidden: true },
                { offset: 0x1df2c, bit: 3, label: "???", hidden: true },
                { offset: 0x1df2c, bit: 4, label: "???", hidden: true },
                { offset: 0x1df2c, bit: 5, label: "???", hidden: true },
                { offset: 0x1df2c, bit: 6, label: "???", hidden: true },
                { offset: 0x1df2c, bit: 7, label: "???", hidden: true },
                { offset: 0x1df2d, bit: 0, label: "???", hidden: true },
                { offset: 0x1df2d, bit: 1, label: "???", hidden: true },
                { offset: 0x1df2d, bit: 2, label: "???", hidden: true },
                { offset: 0x1df2d, bit: 3, label: "???", hidden: true },
                { offset: 0x1df2d, bit: 4, label: "???", hidden: true },
                { offset: 0x1df2d, bit: 5, label: "???", hidden: true },
                { offset: 0x1df2d, bit: 6, label: "???", hidden: true },
                { offset: 0x1df2d, bit: 7, label: "???", hidden: true },
                { offset: 0x1df2e, bit: 0, label: "???", hidden: true },
                { offset: 0x1df2e, bit: 1, label: "???", hidden: true },
                { offset: 0x1df2e, bit: 2, label: "???", hidden: true },
                { offset: 0x1df2e, bit: 3, label: "???", hidden: true },
                { offset: 0x1df2e, bit: 4, label: "???", hidden: true },
                { offset: 0x1df2e, bit: 5, label: "???", hidden: true },
                { offset: 0x1df2e, bit: 6, label: "???", hidden: true },
                { offset: 0x1df2e, bit: 7, label: "???", hidden: true },
                { offset: 0x1df2f, bit: 0, label: "???", hidden: true },
                { offset: 0x1df2f, bit: 1, label: "???", hidden: true },
                { offset: 0x1df2f, bit: 2, label: "???", hidden: true },
                { offset: 0x1df2f, bit: 3, label: "???", hidden: true },
                { offset: 0x1df2f, bit: 4, label: "???", hidden: true },
                { offset: 0x1df2f, bit: 5, label: "???", hidden: true },
                { offset: 0x1df2f, bit: 6, label: "???", hidden: true },
                { offset: 0x1df2f, bit: 7, label: "???", hidden: true },
                { offset: 0x1df30, bit: 0, label: "???", hidden: true },
                { offset: 0x1df30, bit: 1, label: "???", hidden: true },
                { offset: 0x1df30, bit: 2, label: "???", hidden: true },
                { offset: 0x1df30, bit: 3, label: "???", hidden: true },
                { offset: 0x1df30, bit: 4, label: "???", hidden: true },
                { offset: 0x1df30, bit: 5, label: "???", hidden: true },
                { offset: 0x1df30, bit: 6, label: "???", hidden: true },
                { offset: 0x1df30, bit: 7, label: "???", hidden: true },
                { offset: 0x1df31, bit: 0, label: "???", hidden: true },
                { offset: 0x1df31, bit: 1, label: "???", hidden: true },
                { offset: 0x1df31, bit: 2, label: "???", hidden: true },
                { offset: 0x1df31, bit: 3, label: "???", hidden: true },
                { offset: 0x1df31, bit: 4, label: "???", hidden: true },
                { offset: 0x1df31, bit: 5, label: "???", hidden: true },
                { offset: 0x1df31, bit: 6, label: "???", hidden: true },
                { offset: 0x1df31, bit: 7, label: "???", hidden: true },
                { offset: 0x1df32, bit: 0, label: "???", hidden: true },
                { offset: 0x1df32, bit: 1, label: "???", hidden: true },
                { offset: 0x1df32, bit: 2, label: "???", hidden: true },
                { offset: 0x1df32, bit: 3, label: "Lola Varuska" },
                { offset: 0x1df32, bit: 4, label: "???", hidden: true },
                { offset: 0x1df32, bit: 5, label: "Lean Molly" },
                { offset: 0x1df32, bit: 6, label: "Crypt Zombie" },
                { offset: 0x1df32, bit: 7, label: "Sgt Shock" },
                { offset: 0x1df33, bit: 0, label: "Private Sand + Sgt Slate" },
                { offset: 0x1df33, bit: 1, label: "???", hidden: true },
                { offset: 0x1df33, bit: 2, label: "ChassisBot" },
                { offset: 0x1df33, bit: 3, label: "SentryBot" },
                { offset: 0x1df33, bit: 4, label: "Meezor Mox" },
                { offset: 0x1df33, bit: 5, label: "Female Trooper" },
                { offset: 0x1df33, bit: 6, label: "Crispin" },
                { offset: 0x1df33, bit: 7, label: "Undead Priest" },
                { offset: 0x1df34, bit: 0, label: "Lt Wild" },
                { offset: 0x1df34, bit: 1, label: "Jimmy Needles" },
                { offset: 0x1df34, bit: 2, label: "Lt Shade" },
                { offset: 0x1df34, bit: 3, label: "Accountant + Lawyer" },
                { offset: 0x1df34, bit: 4, label: "Krayola" },
                { offset: 0x1df34, bit: 5, label: "The Master" },
                { offset: 0x1df34, bit: 6, label: "Capt Pain" },
                { offset: 0x1df34, bit: 7, label: "Lt Chill" },
                { offset: 0x1df35, bit: 0, label: "???", hidden: true },
                { offset: 0x1df35, bit: 1, label: "Cyberfairy" },
                { offset: 0x1df35, bit: 2, label: "Chinese Chef" },
                { offset: 0x1df35, bit: 3, label: "Trooper Brown" },
                { offset: 0x1df35, bit: 4, label: "Trooper Black" },
                { offset: 0x1df35, bit: 5, label: "Trooper Grey" },
                { offset: 0x1df35, bit: 6, label: "Cheats: Silly Hats" },
                { offset: 0x1df35, bit: 7, label: "Capt Sand" },
                { offset: 0x1df36, bit: 0, label: "Capt Night" },
                { offset: 0x1df36, bit: 1, label: "Scourge Splitter" },
                { offset: 0x1df36, bit: 2, label: "Handyman" },
                { offset: 0x1df36, bit: 3, label: "???", hidden: true },
                { offset: 0x1df36, bit: 4, label: "The Impersonator" },
                { offset: 0x1df36, bit: 5, label: "Jinki" },
                { offset: 0x1df36, bit: 6, label: "Cheats: Big Hands + Slow Motion Deaths" },
                { offset: 0x1df36, bit: 7, label: "Bear" },
                { offset: 0x1df37, bit: 0, label: "???", hidden: true },
                { offset: 0x1df37, bit: 1, label: "High Priest" },
                { offset: 0x1df37, bit: 2, label: "Jared Slim" },
                { offset: 0x1df37, bit: 3, label: "Cheats: Fat Characters" },
                { offset: 0x1df37, bit: 4, label: "Changeling" },
                { offset: 0x1df37, bit: 5, label: "Dark Henchman" },
                { offset: 0x1df37, bit: 6, label: "Stumpy" },
                { offset: 0x1df37, bit: 7, label: "???", hidden: true },
              ]},

              { name: "???", offset: 0x1df38, type: "variable", dataType: "uint32", hidden: true },
              { name: "???", offset: 0x1df40, type: "variable", dataType: "uint32", hidden: true },
              { name: "???", offset: 0x1df44, type: "variable", dataType: "uint32", hidden: true },
              { name: "???", offset: 0x1df48, type: "variable", dataType: "uint32", hidden: true },

              // Anaconda

              // 1st
              { name: "Name", offset: 0x1df50, length: 0x8, type: "variable", dataType: "string", letterDataType: "uint8" },
              { name: "Score", offset: 0x1df70, type: "variable", dataType: "uint32" },

              // 2nd
              { name: "Name", offset: 0x1df74, length: 0x8, type: "variable", dataType: "string", letterDataType: "uint8" },
              { name: "Score", offset: 0x1df94, type: "variable", dataType: "uint32" },

              // 3rd
              { name: "Name", offset: 0x1df98, length: 0x8, type: "variable", dataType: "string", letterDataType: "uint8" },
              { name: "Score", offset: 0x1dfb8, type: "variable", dataType: "uint32" },

              // 4th
              { name: "Name", offset: 0x1dfbc, length: 0x8, type: "variable", dataType: "string", letterDataType: "uint8" },
              { name: "Score", offset: 0x1dfdc, type: "variable", dataType: "uint32" },

              // 5th
              { name: "Name", offset: 0x1dfe0, length: 0x8, type: "variable", dataType: "string", letterDataType: "uint8" },
              { name: "Score", offset: 0x1e000, type: "variable", dataType: "uint32" },

              // 6th
              { name: "Name", offset: 0x1e004, length: 0x8, type: "variable", dataType: "string", letterDataType: "uint8" },
              { name: "Score", offset: 0x1e024, type: "variable", dataType: "uint32" },

              // 7th
              { name: "Name", offset: 0x1e028, length: 0x8, type: "variable", dataType: "string", letterDataType: "uint8" },
              { name: "Score", offset: 0x1e048, type: "variable", dataType: "uint32" },

              // 8th
              { name: "Name", offset: 0x1e04c, length: 0x8, type: "variable", dataType: "string", letterDataType: "uint8" },
              { name: "Score", offset: 0x1e06c, type: "variable", dataType: "uint32" },

              // 9th
              { name: "Name", offset: 0x1e070, length: 0x8, type: "variable", dataType: "string", letterDataType: "uint8" },
              { name: "Score", offset: 0x1e090, type: "variable", dataType: "uint32" },

              // 10th
              { name: "Name", offset: 0x1e094, length: 0x8, type: "variable", dataType: "string", letterDataType: "uint8" },
              { name: "Score", offset: 0x1e0b4, type: "variable", dataType: "uint32" },

              // RetroRacer

              // 1st
              { name: "Name", offset: 0x1e0b8, length: 0x8, type: "variable", dataType: "string", letterDataType: "uint8" },
              { name: "Score", offset: 0x1e0d8, type: "variable", dataType: "uint32" },

              // 2nd
              { name: "Name", offset: 0x1e0dc, length: 0x8, type: "variable", dataType: "string", letterDataType: "uint8" },
              { name: "Score", offset: 0x1e0fc, type: "variable", dataType: "uint32" },

              // 3rd
              { name: "Name", offset: 0x1e100, length: 0x8, type: "variable", dataType: "string", letterDataType: "uint8" },
              { name: "Score", offset: 0x1e120, type: "variable", dataType: "uint32" },

              // 4th
              { name: "Name", offset: 0x1e124, length: 0x8, type: "variable", dataType: "string", letterDataType: "uint8" },
              { name: "Score", offset: 0x1e144, type: "variable", dataType: "uint32" },

              // 5th
              { name: "Name", offset: 0x1e148, length: 0x8, type: "variable", dataType: "string", letterDataType: "uint8" },
              { name: "Score", offset: 0x1e168, type: "variable", dataType: "uint32" },

              // 6th
              { name: "Name", offset: 0x1e16c, length: 0x8, type: "variable", dataType: "string", letterDataType: "uint8" },
              { name: "Score", offset: 0x1e18c, type: "variable", dataType: "uint32" },

              // 7th
              { name: "Name", offset: 0x1e190, length: 0x8, type: "variable", dataType: "string", letterDataType: "uint8" },
              { name: "Score", offset: 0x1e1b0, type: "variable", dataType: "uint32" },

              // 8th
              { name: "Name", offset: 0x1e1b4, length: 0x8, type: "variable", dataType: "string", letterDataType: "uint8" },
              { name: "Score", offset: 0x1e1d4, type: "variable", dataType: "uint32" },

              // 9th
              { name: "Name", offset: 0x1e1d8, length: 0x8, type: "variable", dataType: "string", letterDataType: "uint8" },
              { name: "Score", offset: 0x1e1f8, type: "variable", dataType: "uint32" },

              // 10th
              { name: "Name", offset: 0x1e1fc, length: 0x8, type: "variable", dataType: "string", letterDataType: "uint8" },
              { name: "Score", offset: 0x1e21c, type: "variable", dataType: "uint32" },

              // AstroLander (Easy)

              // 1st
              { name: "Name", offset: 0x1e220, length: 0x8, type: "variable", dataType: "string", letterDataType: "uint8" },
              { name: "Score", offset: 0x1e240, type: "variable", dataType: "uint32" },

              // 2nd
              { name: "Name", offset: 0x1e244, length: 0x8, type: "variable", dataType: "string", letterDataType: "uint8" },
              { name: "Score", offset: 0x1e264, type: "variable", dataType: "uint32" },

              // 3rd
              { name: "Name", offset: 0x1e268, length: 0x8, type: "variable", dataType: "string", letterDataType: "uint8" },
              { name: "Score", offset: 0x1e288, type: "variable", dataType: "uint32" },

              // 4th
              { name: "Name", offset: 0x1e28c, length: 0x8, type: "variable", dataType: "string", letterDataType: "uint8" },
              { name: "Score", offset: 0x1e2ac, type: "variable", dataType: "uint32" },

              // 5th
              { name: "Name", offset: 0x1e2b0, length: 0x8, type: "variable", dataType: "string", letterDataType: "uint8" },
              { name: "Score", offset: 0x1e2d0, type: "variable", dataType: "uint32" },

              // 6th
              { name: "Name", offset: 0x1e2d4, length: 0x8, type: "variable", dataType: "string", letterDataType: "uint8" },
              { name: "Score", offset: 0x1e2f4, type: "variable", dataType: "uint32" },

              // 7th
              { name: "Name", offset: 0x1e2f8, length: 0x8, type: "variable", dataType: "string", letterDataType: "uint8" },
              { name: "Score", offset: 0x1e318, type: "variable", dataType: "uint32" },

              // 8th
              { name: "Name", offset: 0x1e31c, length: 0x8, type: "variable", dataType: "string", letterDataType: "uint8" },
              { name: "Score", offset: 0x1e33c, type: "variable", dataType: "uint32" },

              // 9th
              { name: "Name", offset: 0x1e340, length: 0x8, type: "variable", dataType: "string", letterDataType: "uint8" },
              { name: "Score", offset: 0x1e360, type: "variable", dataType: "uint32" },

              // 10th
              { name: "Name", offset: 0x1e364, length: 0x8, type: "variable", dataType: "string", letterDataType: "uint8" },
              { name: "Score", offset: 0x1e384, type: "variable", dataType: "uint32" },

              // AstroLander (Medium)

              // 1st
              { name: "Name", offset: 0x1e388, length: 0x8, type: "variable", dataType: "string", letterDataType: "uint8" },
              { name: "Score", offset: 0x1e3a8, type: "variable", dataType: "uint32" },

              // 2nd
              { name: "Name", offset: 0x1e3ac, length: 0x8, type: "variable", dataType: "string", letterDataType: "uint8" },
              { name: "Score", offset: 0x1e3cc, type: "variable", dataType: "uint32" },

              // 3rd
              { name: "Name", offset: 0x1e3d0, length: 0x8, type: "variable", dataType: "string", letterDataType: "uint8" },
              { name: "Score", offset: 0x1e3f0, type: "variable", dataType: "uint32" },

              // 4th
              { name: "Name", offset: 0x1e3f4, length: 0x8, type: "variable", dataType: "string", letterDataType: "uint8" },
              { name: "Score", offset: 0x1e414, type: "variable", dataType: "uint32" },

              // 5th
              { name: "Name", offset: 0x1e418, length: 0x8, type: "variable", dataType: "string", letterDataType: "uint8" },
              { name: "Score", offset: 0x1e438, type: "variable", dataType: "uint32" },

              // 6th
              { name: "Name", offset: 0x1e43c, length: 0x8, type: "variable", dataType: "string", letterDataType: "uint8" },
              { name: "Score", offset: 0x1e45c, type: "variable", dataType: "uint32" },

              // 7th
              { name: "Name", offset: 0x1e460, length: 0x8, type: "variable", dataType: "string", letterDataType: "uint8" },
              { name: "Score", offset: 0x1e480, type: "variable", dataType: "uint32" },

              // 8th
              { name: "Name", offset: 0x1e484, length: 0x8, type: "variable", dataType: "string", letterDataType: "uint8" },
              { name: "Score", offset: 0x1e4a4, type: "variable", dataType: "uint32" },

              // 9th
              { name: "Name", offset: 0x1e4a8, length: 0x8, type: "variable", dataType: "string", letterDataType: "uint8" },
              { name: "Score", offset: 0x1e4c8, type: "variable", dataType: "uint32" },

              // 10th
              { name: "Name", offset: 0x1e4cc, length: 0x8, type: "variable", dataType: "string", letterDataType: "uint8" },
              { name: "Score", offset: 0x1e4ec, type: "variable", dataType: "uint32" },

              // AstroLander (Hard)

              // 1st
              { name: "Name", offset: 0x1e4f0, length: 0x8, type: "variable", dataType: "string", letterDataType: "uint8" },
              { name: "Score", offset: 0x1e510, type: "variable", dataType: "uint32" },

              // 2nd
              { name: "Name", offset: 0x1e514, length: 0x8, type: "variable", dataType: "string", letterDataType: "uint8" },
              { name: "Score", offset: 0x1e534, type: "variable", dataType: "uint32" },

              // 3rd
              { name: "Name", offset: 0x1e538, length: 0x8, type: "variable", dataType: "string", letterDataType: "uint8" },
              { name: "Score", offset: 0x1e558, type: "variable", dataType: "uint32" },

              // 4th
              { name: "Name", offset: 0x1e55c, length: 0x8, type: "variable", dataType: "string", letterDataType: "uint8" },
              { name: "Score", offset: 0x1e57c, type: "variable", dataType: "uint32" },

              // 5th
              { name: "Name", offset: 0x1e580, length: 0x8, type: "variable", dataType: "string", letterDataType: "uint8" },
              { name: "Score", offset: 0x1e5a0, type: "variable", dataType: "uint32" },

              // 6th
              { name: "Name", offset: 0x1e5a4, length: 0x8, type: "variable", dataType: "string", letterDataType: "uint8" },
              { name: "Score", offset: 0x1e5c4, type: "variable", dataType: "uint32" },

              // 7th
              { name: "Name", offset: 0x1e5c8, length: 0x8, type: "variable", dataType: "string", letterDataType: "uint8" },
              { name: "Score", offset: 0x1e5e8, type: "variable", dataType: "uint32" },

              // 8th
              { name: "Name", offset: 0x1e5ec, length: 0x8, type: "variable", dataType: "string", letterDataType: "uint8" },
              { name: "Score", offset: 0x1e60c, type: "variable", dataType: "uint32" },

              // 9th
              { name: "Name", offset: 0x1e610, length: 0x8, type: "variable", dataType: "string", letterDataType: "uint8" },
              { name: "Score", offset: 0x1e630, type: "variable", dataType: "uint32" },

              // 10th
              { name: "Name", offset: 0x1e634, length: 0x8, type: "variable", dataType: "string", letterDataType: "uint8" },
              { name: "Score", offset: 0x1e654, type: "variable", dataType: "uint32" },
              { name: "Anaconda", offset: 0x1e658, type: "variable", dataType: "uint32" },
              { name: "RetroRacer", offset: 0x1e65c, type: "variable", dataType: "uint32" },
              { name: "???", offset: 0x1e660, type: "variable", dataType: "uint32", hidden: true },
              { name: "AstroLander", offset: 0x1e664, type: "variable", dataType: "uint32" },
            ]}
          ],
        },
      ],
    },
  ],
  resources: {
    profiles: "getProfileNames()",
    trophies: {
      0x0: "-",
      0x1: "Bronze",
      0x2: "Silver",
      0x3: "Gold",
      0x4: "Platinum",
    },
  },
};

export default template;
