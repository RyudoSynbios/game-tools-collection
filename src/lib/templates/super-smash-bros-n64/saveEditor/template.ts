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
      bigEndian: true,
      control: {
        offsetStart: 0x0,
        offsetEnd: 0x5e8,
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
                { offset: 0x459, bit: 4, label: "Luigi" },
                { offset: 0x459, bit: 7, label: "Captain Falcon" },
                { offset: 0x458, bit: 2, label: "Jigglypuff" },
                { offset: 0x458, bit: 3, label: "Ness" },
              ],
            },
            {
              name: "Unlocked Options",
              type: "bitflags",
              flags: [
                { offset: 0x457, bit: 4, label: "Mushroom Kingdom" },
                { offset: 0x457, bit: 5, label: "Sound Test" },
                { offset: 0x457, bit: 6, label: "Item Switch" },
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
                      instanceType: "tabs",
                      instances: 12,
                      resource: "characters",
                      vertical: true,
                      flex: true,
                      items: [
                        {
                          name: "Cleared Difficulty",
                          offset: 0x468,
                          type: "variable",
                          dataType: "uint8",
                          resource: "difficulties",
                        },
                        {
                          name: "Highscore",
                          offset: 0x45c,
                          type: "variable",
                          dataType: "uint32",
                          bigEndian: true,
                          max: 99999999,
                        },
                        {
                          name: "Bonus",
                          offset: 0x464,
                          type: "variable",
                          dataType: "uint32",
                          bigEndian: true,
                          max: 999,
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
                      instanceType: "tabs",
                      instances: 12,
                      resource: "characters",
                      vertical: true,
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
                              bigEndian: true,
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
                              bigEndian: true,
                              operations: [
                                { "/": 60 },
                                { convert: { from: "seconds", to: "seconds" } },
                              ],
                              leadingZeros: 1,
                              max: 59,
                              test: true,
                            },
                            {
                              offset: 0x46c,
                              type: "variable",
                              dataType: "uint32",
                              bigEndian: true,
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
                              max: 999,
                              step: 100,
                            },
                          ],
                        },
                        {
                          name: "Count",
                          offset: 0x470,
                          type: "variable",
                          dataType: "uint8",
                          max: 10,
                          test: true,
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
                      instanceType: "tabs",
                      instances: 12,
                      resource: "characters",
                      vertical: true,
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
                              bigEndian: true,
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
                              bigEndian: true,
                              operations: [
                                { "/": 60 },
                                { convert: { from: "seconds", to: "seconds" } },
                              ],
                              leadingZeros: 1,
                              max: 59,
                              test: true,
                            },
                            {
                              offset: 0x474,
                              type: "variable",
                              dataType: "uint32",
                              bigEndian: true,
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
                              max: 999,
                              step: 100,
                            },
                          ],
                        },
                        {
                          name: "Count",
                          offset: 0x478,
                          type: "variable",
                          dataType: "uint8",
                          max: 10,
                          test: true,
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
              instanceType: "tabs",
              instances: 12,
              resource: "characters",
              vertical: true,
              items: [
                {
                  type: "tabs",
                  items: [
                    {
                      name: "General",
                      flex: true,
                      items: [
                        {
                          name: "TKOs",
                          offset: 0x26,
                          type: "variable",
                          dataType: "uint16",
                          bigEndian: true,
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
                              bigEndian: true,
                              operations: [
                                { convert: { from: "seconds", to: "hours" } },
                              ],
                              max: 999,
                            },
                            {
                              offset: 0x18,
                              type: "variable",
                              dataType: "uint32",
                              bigEndian: true,
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
                              bigEndian: true,
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
                          bigEndian: true,
                          max: 999999,
                        },
                        {
                          name: "Damage Total",
                          offset: 0x20,
                          type: "variable",
                          dataType: "uint32",
                          bigEndian: true,
                          max: 999999,
                        },
                      ],
                    },
                    {
                      name: "KOs",
                      flex: true,
                      items: [
                        {
                          name: "Mario",
                          offset: 0x0,
                          type: "variable",
                          dataType: "uint16",
                          bigEndian: true,
                          max: 9999,
                        },
                        {
                          name: "Fox",
                          offset: 0x2,
                          type: "variable",
                          dataType: "uint16",
                          bigEndian: true,
                          max: 9999,
                        },
                        {
                          name: "Donkey Kong",
                          offset: 0x4,
                          type: "variable",
                          dataType: "uint16",
                          bigEndian: true,
                          max: 9999,
                        },
                        {
                          name: "Samus",
                          offset: 0x6,
                          type: "variable",
                          dataType: "uint16",
                          bigEndian: true,
                          max: 9999,
                        },
                        {
                          name: "Luigi",
                          offset: 0x8,
                          type: "variable",
                          dataType: "uint16",
                          bigEndian: true,
                          max: 9999,
                        },
                        {
                          name: "Link",
                          offset: 0xa,
                          type: "variable",
                          dataType: "uint16",
                          bigEndian: true,
                          max: 9999,
                        },
                        {
                          name: "Yoshi",
                          offset: 0xc,
                          type: "variable",
                          dataType: "uint16",
                          bigEndian: true,
                          max: 9999,
                        },
                        {
                          name: "Captain Falcon",
                          offset: 0xe,
                          type: "variable",
                          dataType: "uint16",
                          bigEndian: true,
                          max: 9999,
                        },
                        {
                          name: "Kirby",
                          offset: 0x10,
                          type: "variable",
                          dataType: "uint16",
                          bigEndian: true,
                          max: 9999,
                        },
                        {
                          name: "Pikachu",
                          offset: 0x12,
                          type: "variable",
                          dataType: "uint16",
                          bigEndian: true,
                          max: 9999,
                        },
                        {
                          name: "Jigglypuff",
                          offset: 0x14,
                          type: "variable",
                          dataType: "uint16",
                          bigEndian: true,
                          max: 9999,
                        },
                        {
                          name: "Ness",
                          offset: 0x16,
                          type: "variable",
                          dataType: "uint16",
                          bigEndian: true,
                          max: 9999,
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
          name: "Options",
          flex: true,
          items: [
            {
              name: "Sound",
              offset: 0x451,
              type: "variable",
              dataType: "uint8",
              resource: "sound",
            },
            {
              id: "language",
              name: "Language",
              offset: 0x5e2,
              type: "variable",
              dataType: "uint8",
              resource: "languages",
              test: true,
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
    difficulties: {
      0x0: "-",
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
