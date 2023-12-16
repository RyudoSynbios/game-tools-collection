import type { GameJson } from "$lib/types";

const template: GameJson = {
  validator: {
    regions: {
      europe_usa_japan: [
        {
          $or: [
            { 0x0: [0x35, 0x30, 0x56, 0x20, 0x58, 0x32, 0x50, 0x53] },
            { 0x100: [0x35, 0x30, 0x56, 0x20, 0x58, 0x32, 0x50, 0x53] },
          ],
        },
      ],
    },
    text: "Drag 'n' drop here or click to add a save file.",
    error: "Not a valid save file.",
  },
  items: [
    {
      name: "Checksum",
      offset: 0xf1,
      type: "checksum",
      dataType: "uint8",
      control: {
        offset: 0x0,
        length: 0x100,
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
              name: "Number of Saves",
              offset: 0xc,
              type: "variable",
              dataType: "uint32",
              bigEndian: true,
              disabled: true,
            },
            {
              name: "VS Point",
              offset: 0x92,
              type: "variable",
              dataType: "uint16",
              bigEndian: true,
              max: 9999,
            },
          ],
        },
        {
          name: "Survival",
          items: [
            {
              type: "list",
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
                          offset: 0xae,
                          type: "variable",
                          dataType: "uint8",
                          max: 99,
                          leadingZeros: 1,
                        },
                        {
                          offset: 0xad,
                          type: "variable",
                          dataType: "uint8",
                          max: 99,
                          leadingZeros: 1,
                        },
                        {
                          offset: 0xac,
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
                          offset: 0xaa,
                          type: "variable",
                          dataType: "uint8",
                          max: 99,
                          leadingZeros: 1,
                        },
                        {
                          offset: 0xa9,
                          type: "variable",
                          dataType: "uint8",
                          max: 99,
                          leadingZeros: 1,
                        },
                        {
                          offset: 0xa8,
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
                          offset: 0xb6,
                          type: "variable",
                          dataType: "uint8",
                          max: 99,
                          leadingZeros: 1,
                        },
                        {
                          offset: 0xb5,
                          type: "variable",
                          dataType: "uint8",
                          max: 99,
                          leadingZeros: 1,
                        },
                        {
                          offset: 0xb4,
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
                          offset: 0xb2,
                          type: "variable",
                          dataType: "uint8",
                          max: 99,
                          leadingZeros: 1,
                        },
                        {
                          offset: 0xb1,
                          type: "variable",
                          dataType: "uint8",
                          max: 99,
                          leadingZeros: 1,
                        },
                        {
                          offset: 0xb0,
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
                          offset: 0xbe,
                          type: "variable",
                          dataType: "uint8",
                          max: 99,
                          leadingZeros: 1,
                        },
                        {
                          offset: 0xbd,
                          type: "variable",
                          dataType: "uint8",
                          max: 99,
                          leadingZeros: 1,
                        },
                        {
                          offset: 0xbc,
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
                          offset: 0xba,
                          type: "variable",
                          dataType: "uint8",
                          max: 99,
                          leadingZeros: 1,
                        },
                        {
                          offset: 0xb9,
                          type: "variable",
                          dataType: "uint8",
                          max: 99,
                          leadingZeros: 1,
                        },
                        {
                          offset: 0xb8,
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
                          offset: 0xc6,
                          type: "variable",
                          dataType: "uint8",
                          max: 99,
                          leadingZeros: 1,
                        },
                        {
                          offset: 0xc5,
                          type: "variable",
                          dataType: "uint8",
                          max: 99,
                          leadingZeros: 1,
                        },
                        {
                          offset: 0xc4,
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
                          offset: 0xc2,
                          type: "variable",
                          dataType: "uint8",
                          max: 99,
                          leadingZeros: 1,
                        },
                        {
                          offset: 0xc1,
                          type: "variable",
                          dataType: "uint8",
                          max: 99,
                          leadingZeros: 1,
                        },
                        {
                          offset: 0xc0,
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
              type: "list",
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
                          offset: 0xce,
                          type: "variable",
                          dataType: "uint8",
                          max: 99,
                          leadingZeros: 1,
                        },
                        {
                          offset: 0xcd,
                          type: "variable",
                          dataType: "uint8",
                          max: 99,
                          leadingZeros: 1,
                        },
                        {
                          offset: 0xcc,
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
                          offset: 0xca,
                          type: "variable",
                          dataType: "uint8",
                          max: 99,
                          leadingZeros: 1,
                        },
                        {
                          offset: 0xc9,
                          type: "variable",
                          dataType: "uint8",
                          max: 99,
                          leadingZeros: 1,
                        },
                        {
                          offset: 0xc8,
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
                          offset: 0xd6,
                          type: "variable",
                          dataType: "uint8",
                          max: 99,
                          leadingZeros: 1,
                        },
                        {
                          offset: 0xd5,
                          type: "variable",
                          dataType: "uint8",
                          max: 99,
                          leadingZeros: 1,
                        },
                        {
                          offset: 0xd4,
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
                          offset: 0xd2,
                          type: "variable",
                          dataType: "uint8",
                          max: 99,
                          leadingZeros: 1,
                        },
                        {
                          offset: 0xd1,
                          type: "variable",
                          dataType: "uint8",
                          max: 99,
                          leadingZeros: 1,
                        },
                        {
                          offset: 0xd0,
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
                          offset: 0xde,
                          type: "variable",
                          dataType: "uint8",
                          max: 99,
                          leadingZeros: 1,
                        },
                        {
                          offset: 0xdd,
                          type: "variable",
                          dataType: "uint8",
                          max: 99,
                          leadingZeros: 1,
                        },
                        {
                          offset: 0xdc,
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
              offset: 0x88,
              type: "variable",
              dataType: "uint8",
              min: 1,
              max: 8,
              operations: [{ "+": 1 }],
            },
            {
              name: "Time",
              type: "section",
              background: true,
              hidden: true,
              items: [
                {
                  name: "Enable Time",
                  offset: 0x89,
                  type: "variable",
                  dataType: "boolean",
                },
              ],
            },
            {
              id: "matchTime",
              name: "Time",
              offset: 0x97,
              type: "variable",
              dataType: "uint8",
              resource: "times",
            },
            {
              name: "Round",
              offset: 0x96,
              type: "variable",
              dataType: "uint8",
              resource: "rounds",
            },
            {
              name: "Damage",
              offset: 0x95,
              type: "variable",
              dataType: "uint8",
              min: 1,
              max: 4,
              operations: [{ "+": 1 }],
            },
            {
              name: "Gauge",
              offset: 0x91,
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
