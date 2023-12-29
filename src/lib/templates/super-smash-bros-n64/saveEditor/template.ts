import type { GameJson } from "$lib/types";

const template: GameJson = {
  validator: {
    regions: {
      europe: {},
      usa: {},
      japan: {},
      australia: {},
    },
    text: "Drag 'n' drop here or click to add a save file.",
    error: "Not a valid save file.",
  },
  items: [
    {
      name: "Checksum",
      offset: 0x5e8,
      type: "checksum",
      dataType: "uint32",
      control: {
        offset: 0x0,
        length: 0x5ea,
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
              name: "Unlocked Challengers",
              type: "bitflags",
              flags: [
                { offset: 0x45a, bit: 4, label: "Luigi" },
                { offset: 0x45a, bit: 7, label: "Captain Falcon" },
                { offset: 0x45b, bit: 2, label: "Jigglypuff" },
                { offset: 0x45b, bit: 3, label: "Ness" },
              ],
            },
            {
              name: "Unlocked Options",
              type: "bitflags",
              flags: [
                { offset: 0x454, bit: 4, label: "Mushroom Kingdom" },
                { offset: 0x454, bit: 5, label: "Sound Test" },
                { offset: 0x454, bit: 6, label: "Item Switch" },
              ],
            },
          ],
        },
        {
          name: "1P Records",
          items: [
            {
              type: "tabs",
              items: [
                {
                  name: "Arcade",
                  items: [
                    {
                      length: 0x20,
                      type: "container",
                      instanceType: "list",
                      instances: 12,
                      resource: "characters",
                      flex: true,
                      items: [
                        {
                          name: "Highscore",
                          offset: 0x45c,
                          type: "variable",
                          dataType: "uint32",
                          max: 99999999,
                        },
                        {
                          name: "Bonus",
                          offset: 0x464,
                          type: "variable",
                          dataType: "uint32",
                          max: 999,
                        },
                        {
                          name: "Completed",
                          offset: 0x46b,
                          type: "variable",
                          dataType: "uint8",
                          resource: "completion",
                        },
                      ],
                    },
                  ],
                },
                {
                  name: "Break the Targets",
                  items: [
                    {
                      length: 0x20,
                      type: "container",
                      instanceType: "list",
                      instances: 12,
                      resource: "characters",
                      flex: true,
                      items: [
                        {
                          name: "Time",
                          type: "group",
                          mode: "chrono",
                          items: [
                            {
                              offset: 0x46c,
                              type: "variable",
                              dataType: "uint32",
                              operations: [
                                { "/": 60 },
                                { convert: { from: "minutes", to: "hours" } },
                              ],
                              leadingZeros: 1,
                              max: 99,
                            },
                            {
                              offset: 0x46c,
                              type: "variable",
                              dataType: "uint32",
                              operations: [
                                { "/": 60 },
                                { convert: { from: "seconds", to: "seconds" } },
                              ],
                              leadingZeros: 1,
                              max: 59,
                            },
                            {
                              offset: 0x46c,
                              type: "variable",
                              dataType: "uint32",
                              operations: [
                                { "/": 60 },
                                {
                                  convert: {
                                    from: "seconds",
                                    to: "milliseconds",
                                  },
                                },
                              ],
                              leadingZeros: 2,
                              step: 100,
                              max: 999,
                            },
                          ],
                        },
                        {
                          name: "Count",
                          offset: 0x473,
                          type: "variable",
                          dataType: "uint8",
                          max: 10,
                        },
                      ],
                    },
                  ],
                },
                {
                  name: "Board the Platforms",
                  items: [
                    {
                      length: 0x20,
                      type: "container",
                      instanceType: "list",
                      instances: 12,
                      resource: "characters",
                      flex: true,
                      items: [
                        {
                          name: "Time",
                          type: "group",
                          mode: "chrono",
                          items: [
                            {
                              offset: 0x474,
                              type: "variable",
                              dataType: "uint32",
                              operations: [
                                { "/": 60 },
                                { convert: { from: "minutes", to: "hours" } },
                              ],
                              leadingZeros: 1,
                              max: 99,
                            },
                            {
                              offset: 0x474,
                              type: "variable",
                              dataType: "uint32",
                              operations: [
                                { "/": 60 },
                                { convert: { from: "seconds", to: "seconds" } },
                              ],
                              leadingZeros: 1,
                              max: 59,
                            },
                            {
                              offset: 0x474,
                              type: "variable",
                              dataType: "uint32",
                              operations: [
                                { "/": 60 },
                                {
                                  convert: {
                                    from: "seconds",
                                    to: "milliseconds",
                                  },
                                },
                              ],
                              leadingZeros: 2,
                              step: 100,
                              max: 999,
                            },
                          ],
                        },
                        {
                          name: "Count",
                          offset: 0x47b,
                          type: "variable",
                          dataType: "uint8",
                          max: 10,
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
          name: "2P Records",
          items: [
            {
              length: 0x5c,
              type: "container",
              instanceType: "list",
              instances: 12,
              resource: "characters",
              items: [
                {
                  name: "Number of Kos against",
                  type: "section",
                  flex: true,
                  items: [
                    {
                      name: "Fox",
                      offset: 0x0,
                      type: "variable",
                      dataType: "uint16",
                      max: 9999,
                    },
                    {
                      name: "Mario",
                      offset: 0x2,
                      type: "variable",
                      dataType: "uint16",
                      max: 9999,
                    },
                    {
                      name: "Samus",
                      offset: 0x4,
                      type: "variable",
                      dataType: "uint16",
                      max: 9999,
                    },
                    {
                      name: "Donkey Kong",
                      offset: 0x6,
                      type: "variable",
                      dataType: "uint16",
                      max: 9999,
                    },
                    {
                      name: "Link",
                      offset: 0x8,
                      type: "variable",
                      dataType: "uint16",
                      max: 9999,
                    },
                    {
                      name: "Luigi",
                      offset: 0xa,
                      type: "variable",
                      dataType: "uint16",
                      max: 9999,
                    },
                    {
                      name: "Captain Falcon",
                      offset: 0xc,
                      type: "variable",
                      dataType: "uint16",
                      max: 9999,
                    },
                    {
                      name: "Yoshi",
                      offset: 0xe,
                      type: "variable",
                      dataType: "uint16",
                      max: 9999,
                    },
                    {
                      name: "Pikachu",
                      offset: 0x10,
                      type: "variable",
                      dataType: "uint16",
                      max: 9999,
                    },
                    {
                      name: "Kirby",
                      offset: 0x12,
                      type: "variable",
                      dataType: "uint16",
                      max: 9999,
                    },
                    {
                      name: "Ness",
                      offset: 0x14,
                      type: "variable",
                      dataType: "uint16",
                      max: 9999,
                    },
                    {
                      name: "Jigglypuff",
                      offset: 0x16,
                      type: "variable",
                      dataType: "uint16",
                      max: 9999,
                    },
                  ],
                },
                {
                  type: "section",
                  flex: true,
                  items: [
                    {
                      name: "TKOs",
                      offset: 0x24,
                      type: "variable",
                      dataType: "uint16",
                      max: 9999,
                    },
                    {
                      name: "Time",
                      type: "group",
                      mode: "time",
                      items: [
                        {
                          offset: 0x18,
                          type: "variable",
                          dataType: "uint32",
                          operations: [
                            { convert: { from: "seconds", to: "hours" } },
                          ],
                          max: 999,
                        },
                        {
                          offset: 0x18,
                          type: "variable",
                          dataType: "uint32",
                          operations: [
                            { convert: { from: "seconds", to: "minutes" } },
                          ],
                          leadingZeros: 1,
                          max: 59,
                        },
                        {
                          offset: 0x18,
                          type: "variable",
                          dataType: "uint32",
                          operations: [
                            { convert: { from: "seconds", to: "seconds" } },
                          ],
                          leadingZeros: 1,
                          max: 59,
                        },
                      ],
                    },
                    {
                      name: "Attack Total",
                      offset: 0x1c,
                      type: "variable",
                      dataType: "uint32",
                      max: 999999,
                    },
                    {
                      name: "Damage Total",
                      offset: 0x20,
                      type: "variable",
                      dataType: "uint32",
                      max: 999999,
                    },
                  ],
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
              name: "Sound",
              offset: 0x452,
              type: "variable",
              dataType: "uint8",
              resource: "sound",
            },
            {
              name: "Language",
              offset: 0x5e1,
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
    characters: {
      0x0: "Mario",
      0x1: "Fox",
      0x2: "Donkey Kong",
      0x3: "Samus",
      0x4: "Luigi",
      0x5: "Link",
      0x6: "Yoshi",
      0x7: "Captain Falcon",
      0x8: "Kirby",
      0x9: "Pikachu",
      0xa: "Jigglypuff",
      0xb: "Ness",
    },
    completion: {
      0x0: "Uncompleted",
      0x1: "Very Easy",
      0x2: "Easy",
      0x3: "Normal",
      0x4: "Hard",
      0x5: "Very Hard",
    },
    languages: [
      // Europe
      {
        0x0: "English",
        0x1: "French",
        0x2: "German",
      },
      // USA
      {
        0x0: "English",
      },
      // Japan
      {
        0x0: "Japanese",
      },
      // Australia
      {
        0x0: "English",
      },
    ],
    sound: {
      0x0: "Mono",
      0x1: "Stereo",
    },
  },
};

export default template;
