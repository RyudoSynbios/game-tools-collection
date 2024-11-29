import type { GameJson } from "$lib/types";

const template: GameJson = {
  validator: {
    regions: {
      europe_usa_japan: {
        $or: [
          { 0x0: [0x53, 0x50, 0x32, 0x58, 0x20, 0x56, 0x30, 0x35] }, // "SP2X V05"
          { 0x100: [0x53, 0x50, 0x32, 0x58, 0x20, 0x56, 0x30, 0x35] }, // "SP2X V05"
        ],
      },
    },
    text: "Drag 'n' drop here or click to add a save file.",
    error: "Not a valid save file.",
  },
  items: [
    {
      name: "Checksum",
      offset: 0xf6,
      type: "checksum",
      dataType: "uint8",
      control: {
        offsetStart: 0x0,
        offsetEnd: 0x100,
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
              name: "Save Count",
              offset: 0x8,
              type: "variable",
              dataType: "uint32",
              hidden: true,
              test: true,
            },
            {
              name: "VS Point",
              offset: 0x94,
              type: "variable",
              dataType: "uint16",
              max: 9999,
              test: true,
            },
          ],
        },
        {
          name: "Survival",
          items: [
            {
              type: "tabs",
              vertical: true,
              items: [
                {
                  name: "Break the car quickly",
                  items: [
                    {
                      name: "Time",
                      type: "group",
                      mode: "chrono",
                      items: [
                        {
                          offset: 0xa9,
                          type: "variable",
                          dataType: "uint8",
                          max: 99,
                          leadingZeros: 1,
                        },
                        {
                          offset: 0xaa,
                          type: "variable",
                          dataType: "uint8",
                          max: 99,
                          leadingZeros: 1,
                        },
                        {
                          offset: 0xab,
                          type: "variable",
                          dataType: "uint8",
                          max: 99,
                          leadingZeros: 1,
                        },
                      ],
                    },
                  ],
                },
                {
                  name: "Break all the barrels A",
                  items: [
                    {
                      name: "Time",
                      type: "group",
                      mode: "chrono",
                      items: [
                        {
                          offset: 0xad,
                          type: "variable",
                          dataType: "uint8",
                          max: 99,
                          leadingZeros: 1,
                        },
                        {
                          offset: 0xae,
                          type: "variable",
                          dataType: "uint8",
                          max: 99,
                          leadingZeros: 1,
                        },
                        {
                          offset: 0xaf,
                          type: "variable",
                          dataType: "uint8",
                          max: 99,
                          leadingZeros: 1,
                        },
                      ],
                    },
                  ],
                },
                {
                  name: "Break all the barrels B",
                  items: [
                    {
                      name: "Time",
                      type: "group",
                      mode: "chrono",
                      items: [
                        {
                          offset: 0xb1,
                          type: "variable",
                          dataType: "uint8",
                          max: 99,
                          leadingZeros: 1,
                        },
                        {
                          offset: 0xb2,
                          type: "variable",
                          dataType: "uint8",
                          max: 99,
                          leadingZeros: 1,
                        },
                        {
                          offset: 0xb3,
                          type: "variable",
                          dataType: "uint8",
                          max: 99,
                          leadingZeros: 1,
                        },
                      ],
                    },
                  ],
                },
                {
                  name: "Defeat 5 opponents",
                  items: [
                    {
                      name: "Time",
                      type: "group",
                      mode: "chrono",
                      items: [
                        {
                          offset: 0xb5,
                          type: "variable",
                          dataType: "uint8",
                          max: 99,
                          leadingZeros: 1,
                        },
                        {
                          offset: 0xb6,
                          type: "variable",
                          dataType: "uint8",
                          max: 99,
                          leadingZeros: 1,
                        },
                        {
                          offset: 0xb7,
                          type: "variable",
                          dataType: "uint8",
                          max: 99,
                          leadingZeros: 1,
                        },
                      ],
                    },
                  ],
                },
                {
                  name: "Defeat 10 opponents",
                  items: [
                    {
                      name: "Time",
                      type: "group",
                      mode: "chrono",
                      items: [
                        {
                          offset: 0xb9,
                          type: "variable",
                          dataType: "uint8",
                          max: 99,
                          leadingZeros: 1,
                        },
                        {
                          offset: 0xba,
                          type: "variable",
                          dataType: "uint8",
                          max: 99,
                          leadingZeros: 1,
                        },
                        {
                          offset: 0xbb,
                          type: "variable",
                          dataType: "uint8",
                          max: 99,
                          leadingZeros: 1,
                        },
                      ],
                    },
                  ],
                },
                {
                  name: "Defeat 30 opponents",
                  items: [
                    {
                      name: "Time",
                      type: "group",
                      mode: "chrono",
                      items: [
                        {
                          offset: 0xbd,
                          type: "variable",
                          dataType: "uint8",
                          max: 99,
                          leadingZeros: 1,
                        },
                        {
                          offset: 0xbe,
                          type: "variable",
                          dataType: "uint8",
                          max: 99,
                          leadingZeros: 1,
                        },
                        {
                          offset: 0xbf,
                          type: "variable",
                          dataType: "uint8",
                          max: 99,
                          leadingZeros: 1,
                        },
                      ],
                    },
                  ],
                },
                {
                  name: "Defeat 50 opponents",
                  items: [
                    {
                      name: "Time",
                      type: "group",
                      mode: "chrono",
                      items: [
                        {
                          offset: 0xc1,
                          type: "variable",
                          dataType: "uint8",
                          max: 99,
                          leadingZeros: 1,
                        },
                        {
                          offset: 0xc2,
                          type: "variable",
                          dataType: "uint8",
                          max: 99,
                          leadingZeros: 1,
                        },
                        {
                          offset: 0xc3,
                          type: "variable",
                          dataType: "uint8",
                          max: 99,
                          leadingZeros: 1,
                        },
                      ],
                    },
                  ],
                },
                {
                  name: "Defeat 100 opponents",
                  items: [
                    {
                      name: "Time",
                      type: "group",
                      mode: "chrono",
                      items: [
                        {
                          offset: 0xc5,
                          type: "variable",
                          dataType: "uint8",
                          max: 99,
                          leadingZeros: 1,
                        },
                        {
                          offset: 0xc6,
                          type: "variable",
                          dataType: "uint8",
                          max: 99,
                          leadingZeros: 1,
                        },
                        {
                          offset: 0xc7,
                          type: "variable",
                          dataType: "uint8",
                          max: 99,
                          leadingZeros: 1,
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
          name: "Time Attack",
          items: [
            {
              type: "tabs",
              vertical: true,
              items: [
                {
                  name: "Defeat 8 opponents",
                  items: [
                    {
                      name: "Time",
                      type: "group",
                      mode: "chrono",
                      items: [
                        {
                          offset: 0xc9,
                          type: "variable",
                          dataType: "uint8",
                          max: 99,
                          leadingZeros: 1,
                        },
                        {
                          offset: 0xca,
                          type: "variable",
                          dataType: "uint8",
                          max: 99,
                          leadingZeros: 1,
                        },
                        {
                          offset: 0xcb,
                          type: "variable",
                          dataType: "uint8",
                          max: 99,
                          leadingZeros: 1,
                        },
                      ],
                    },
                  ],
                },
                {
                  name: "Defeat the four Bosses",
                  items: [
                    {
                      name: "Time",
                      type: "group",
                      mode: "chrono",
                      items: [
                        {
                          offset: 0xcd,
                          type: "variable",
                          dataType: "uint8",
                          max: 99,
                          leadingZeros: 1,
                        },
                        {
                          offset: 0xce,
                          type: "variable",
                          dataType: "uint8",
                          max: 99,
                          leadingZeros: 1,
                        },
                        {
                          offset: 0xcf,
                          type: "variable",
                          dataType: "uint8",
                          max: 99,
                          leadingZeros: 1,
                        },
                      ],
                    },
                  ],
                },
                {
                  name: "Fight AKUMA",
                  items: [
                    {
                      name: "Time",
                      type: "group",
                      mode: "chrono",
                      items: [
                        {
                          offset: 0xd1,
                          type: "variable",
                          dataType: "uint8",
                          max: 99,
                          leadingZeros: 1,
                        },
                        {
                          offset: 0xd2,
                          type: "variable",
                          dataType: "uint8",
                          max: 99,
                          leadingZeros: 1,
                        },
                        {
                          offset: 0xd3,
                          type: "variable",
                          dataType: "uint8",
                          max: 99,
                          leadingZeros: 1,
                        },
                      ],
                    },
                  ],
                },
                {
                  name: "Fight RYU and Ken",
                  items: [
                    {
                      name: "Time",
                      type: "group",
                      mode: "chrono",
                      items: [
                        {
                          offset: 0xd5,
                          type: "variable",
                          dataType: "uint8",
                          max: 99,
                          leadingZeros: 1,
                        },
                        {
                          offset: 0xd6,
                          type: "variable",
                          dataType: "uint8",
                          max: 99,
                          leadingZeros: 1,
                        },
                        {
                          offset: 0xd7,
                          type: "variable",
                          dataType: "uint8",
                          max: 99,
                          leadingZeros: 1,
                        },
                      ],
                    },
                  ],
                },
                {
                  name: "Grand Master Challenge",
                  items: [
                    {
                      name: "Time",
                      type: "group",
                      mode: "chrono",
                      items: [
                        {
                          offset: 0xd9,
                          type: "variable",
                          dataType: "uint8",
                          max: 99,
                          leadingZeros: 1,
                        },
                        {
                          offset: 0xda,
                          type: "variable",
                          dataType: "uint8",
                          max: 99,
                          leadingZeros: 1,
                        },
                        {
                          offset: 0xdb,
                          type: "variable",
                          dataType: "uint8",
                          max: 99,
                          leadingZeros: 1,
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
          name: "Option",
          flex: true,
          items: [
            {
              name: "Level",
              offset: 0x8f,
              type: "variable",
              dataType: "uint8",
              operations: [{ "+": 1 }],
              min: 1,
              max: 8,
            },
            {
              name: "Time",
              type: "section",
              background: true,
              hidden: true,
              items: [
                {
                  name: "Enable Time",
                  offset: 0x8e,
                  type: "variable",
                  dataType: "boolean",
                },
              ],
            },
            {
              id: "matchTime",
              name: "Time",
              offset: 0x90,
              type: "variable",
              dataType: "uint8",
              resource: "times",
            },
            {
              name: "Round",
              offset: 0x91,
              type: "variable",
              dataType: "uint8",
              resource: "rounds",
            },
            {
              name: "Damage",
              offset: 0x92,
              type: "variable",
              dataType: "uint8",
              operations: [{ "+": 1 }],
              min: 1,
              max: 4,
            },
            {
              name: "Gauge",
              offset: 0x96,
              type: "variable",
              dataType: "uint8",
              resource: "gauges",
            },
          ],
        },
      ],
    },
  ],
  resources: {
    gauges: {
      0x0: "Arcade",
      0x1: "Extra",
    },
    rounds: {
      0x0: "1",
      0x1: "3",
    },
    times: {
      0x0: "30",
      0x1: "60",
      0x2: "99",
      0x3: "∞",
    },
  },
};

export default template;
