import type { GameJson } from "$lib/types";

const template: GameJson = {
  validator: {
    regions: {
      europe_usa_japan: {},
    },
    text: "Drag 'n' drop here or click to add a save file.",
    hint: "If you're having trouble loading a save file from an <b>Everdrive</b> cartridge, please see the FAQ.",
    error: "Not a valid save file.",
  },
  items: [
    {
      type: "tabs",
      items: [
        {
          name: "Mario GP",
          items: [
            {
              id: "checksumMarioGP",
              name: "Checksum",
              offset: 0x186,
              type: "checksum",
              dataType: "uint16",
              bigEndian: true,
              control: {
                offsetStart: 0x180,
                offsetEnd: 0x185,
              },
            },
            {
              length: 0x1,
              type: "container",
              instanceType: "section",
              instances: 4,
              resource: "classes",
              flex: true,
              items: [
                {
                  name: "Mushroom Cup",
                  offset: 0x180,
                  type: "variable",
                  dataType: "uint8",
                  binary: { bitStart: 0, bitLength: 2 },
                  resource: "cups",
                },
                {
                  name: "Flower Cup",
                  offset: 0x180,
                  type: "variable",
                  dataType: "uint8",
                  binary: { bitStart: 2, bitLength: 2 },
                  resource: "cups",
                },
                {
                  name: "Star Cup",
                  offset: 0x180,
                  type: "variable",
                  dataType: "uint8",
                  binary: { bitStart: 4, bitLength: 2 },
                  resource: "cups",
                },
                {
                  name: "Special Cup",
                  offset: 0x180,
                  type: "variable",
                  dataType: "uint8",
                  binary: { bitStart: 6, bitLength: 2 },
                  resource: "cups",
                },
              ],
            },
          ],
        },
        {
          name: "Time Trials",
          items: [
            {
              length: 0x18,
              type: "container",
              instanceType: "tabs",
              instances: 16,
              resource: "courses",
              vertical: true,
              items: [
                {
                  type: "section",
                  flex: true,
                  hidden: true,
                  items: [
                    {
                      id: "checksumTimeTrials",
                      name: "Checksum",
                      offset: 0x17,
                      type: "checksum",
                      dataType: "uint8",
                      control: {
                        offsetStart: 0x0,
                        offsetEnd: 0x15,
                      },
                    },
                    {
                      name: "Has Records",
                      offset: 0x12,
                      type: "variable",
                      dataType: "uint8",
                      hidden: true,
                    },
                  ],
                },
                {
                  length: 0x3,
                  type: "container",
                  instanceType: "section",
                  instances: 5,
                  enumeration: "%o Place",
                  flex: true,
                  items: [
                    {
                      id: "character-%parent%-%index%",
                      name: "Character",
                      offset: 0x0,
                      type: "variable",
                      dataType: "uint24",
                      binary: { bitStart: 20, bitLength: 3 },
                      resource: "characters",
                    },
                    {
                      name: "Time",
                      type: "group",
                      mode: "chrono",
                      items: [
                        {
                          id: "time-%parent%-%index%",
                          offset: 0x0,
                          type: "variable",
                          dataType: "uint24",
                          binary: { bitStart: 0, bitLength: 20 },
                          operations: [
                            { "*": 10 },
                            {
                              convert: {
                                from: "milliseconds",
                                to: "minutes",
                              },
                            },
                          ],
                          leadingZeros: 1,
                          max: 59,
                        },
                        {
                          id: "time-%parent%-%index%",
                          offset: 0x0,
                          type: "variable",
                          dataType: "uint24",
                          binary: { bitStart: 0, bitLength: 20 },
                          operations: [
                            { "*": 10 },
                            {
                              convert: {
                                from: "milliseconds",
                                to: "seconds",
                              },
                            },
                          ],
                          leadingZeros: 1,
                          max: 59,
                          test: true,
                        },
                        {
                          id: "time-%parent%-%index%",
                          offset: 0x0,
                          type: "variable",
                          dataType: "uint24",
                          binary: { bitStart: 0, bitLength: 20 },
                          operations: [
                            { "*": 10 },
                            {
                              convert: {
                                from: "milliseconds",
                                to: "milliseconds",
                              },
                            },
                          ],
                          leadingZeros: 2,
                          max: 990,
                          step: 10,
                          test: true,
                        },
                      ],
                    },
                  ],
                },
                {
                  name: "Best Lap",
                  type: "section",
                  flex: true,
                  items: [
                    {
                      id: "character-%index%-5",
                      name: "Character",
                      offset: 0xf,
                      type: "variable",
                      dataType: "uint24",
                      binary: { bitStart: 20, bitLength: 3 },
                      resource: "characters",
                    },
                    {
                      name: "Time",
                      type: "group",
                      mode: "chrono",
                      items: [
                        {
                          id: "time-%index%-5",
                          offset: 0xf,
                          type: "variable",
                          dataType: "uint24",
                          binary: { bitStart: 0, bitLength: 20 },
                          operations: [
                            { "*": 10 },
                            {
                              convert: {
                                from: "milliseconds",
                                to: "minutes",
                              },
                            },
                          ],
                          leadingZeros: 1,
                          max: 99,
                        },
                        {
                          id: "time-%index%-5",
                          offset: 0xf,
                          type: "variable",
                          dataType: "uint24",
                          binary: { bitStart: 0, bitLength: 20 },
                          operations: [
                            { "*": 10 },
                            {
                              convert: {
                                from: "milliseconds",
                                to: "seconds",
                              },
                            },
                          ],
                          leadingZeros: 1,
                          max: 59,
                        },
                        {
                          id: "time-%index%-5",
                          offset: 0xf,
                          type: "variable",
                          dataType: "uint24",
                          binary: { bitStart: 0, bitLength: 20 },
                          operations: [
                            { "*": 10 },
                            {
                              convert: {
                                from: "milliseconds",
                                to: "milliseconds",
                              },
                            },
                          ],
                          leadingZeros: 2,
                          max: 990,
                          step: 10,
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
          name: "Best Records",
          hidden: true,
          items: [
            {
              type: "section",
              flex: true,
              items: [
                {
                  id: "checksumBestRecords",
                  name: "Checksum",
                  offset: 0x1be,
                  type: "checksum",
                  dataType: "uint16",
                  bigEndian: true,
                  control: {
                    offsetStart: 0x188,
                    offsetEnd: 0x1bb,
                  },
                },
                {
                  id: "checksumBestRecords",
                  name: "Checksum",
                  offset: 0x1f6,
                  type: "checksum",
                  dataType: "uint16",
                  bigEndian: true,
                  control: {
                    offsetStart: 0x1c0,
                    offsetEnd: 0x1f3,
                  },
                },
              ],
            },
            {
              length: 0x3,
              type: "container",
              instanceType: "section",
              instances: 16,
              resource: "courses",
              flex: true,
              items: [
                {
                  id: "character-100-%index%",
                  name: "Character",
                  offset: 0x188,
                  type: "variable",
                  dataType: "uint24",
                  binary: { bitStart: 20, bitLength: 3 },
                  resource: "characters",
                },
                {
                  name: "Best Time",
                  type: "group",
                  mode: "chrono",
                  items: [
                    {
                      id: "time-100-%index%",
                      offset: 0x188,
                      type: "variable",
                      dataType: "uint24",
                      binary: { bitStart: 0, bitLength: 20 },
                      operations: [
                        { "*": 10 },
                        {
                          convert: {
                            from: "milliseconds",
                            to: "minutes",
                          },
                        },
                      ],
                      leadingZeros: 1,
                      max: 59,
                    },
                    {
                      id: "time-100-%index%",
                      offset: 0x188,
                      type: "variable",
                      dataType: "uint24",
                      binary: { bitStart: 0, bitLength: 20 },
                      operations: [
                        { "*": 10 },
                        {
                          convert: {
                            from: "milliseconds",
                            to: "seconds",
                          },
                        },
                      ],
                      leadingZeros: 1,
                      max: 59,
                    },
                    {
                      id: "time-100-%index%",
                      offset: 0x188,
                      type: "variable",
                      dataType: "uint24",
                      binary: { bitStart: 0, bitLength: 20 },
                      operations: [
                        { "*": 10 },
                        {
                          convert: {
                            from: "milliseconds",
                            to: "milliseconds",
                          },
                        },
                      ],
                      leadingZeros: 2,
                      max: 990,
                      step: 10,
                    },
                  ],
                },
                {
                  type: "section",
                  flex: true,
                  items: [
                    {
                      id: "character-100-%index%",
                      name: "Character",
                      offset: 0x1a0,
                      type: "variable",
                      dataType: "uint24",
                      binary: { bitStart: 20, bitLength: 3 },
                      resource: "characters",
                    },
                    {
                      name: "Best Lap",
                      type: "group",
                      mode: "chrono",
                      items: [
                        {
                          id: "time-100-%index%",
                          offset: 0x1a0,
                          type: "variable",
                          dataType: "uint24",
                          binary: { bitStart: 0, bitLength: 20 },
                          operations: [
                            { "*": 10 },
                            {
                              convert: {
                                from: "milliseconds",
                                to: "minutes",
                              },
                            },
                          ],
                          leadingZeros: 1,
                          max: 99,
                        },
                        {
                          id: "time-100-%index%",
                          offset: 0x1a0,
                          type: "variable",
                          dataType: "uint24",
                          binary: { bitStart: 0, bitLength: 20 },
                          operations: [
                            { "*": 10 },
                            {
                              convert: {
                                from: "milliseconds",
                                to: "seconds",
                              },
                            },
                          ],
                          leadingZeros: 1,
                          max: 59,
                        },
                        {
                          id: "time-100-%index%",
                          offset: 0x1a0,
                          type: "variable",
                          dataType: "uint24",
                          binary: { bitStart: 0, bitLength: 20 },
                          operations: [
                            { "*": 10 },
                            {
                              convert: {
                                from: "milliseconds",
                                to: "milliseconds",
                              },
                            },
                          ],
                          leadingZeros: 2,
                          max: 990,
                          step: 10,
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
          items: [
            {
              name: "Sound Mode",
              offset: 0x184,
              type: "variable",
              dataType: "uint8",
              resource: "soundModes",
            },
          ],
        },
      ],
    },
  ],
  resources: {
    characters: {
      0x0: "-",
      0x1: "Mario",
      0x2: "Luigi",
      0x3: "Yoshi",
      0x4: "Toad",
      0x5: "D.K.",
      0x6: "Wario",
      0x7: "Peach",
      0x8: "Bowser",
    },
    classes: {
      0x0: "50cc",
      0x1: "100cc",
      0x2: "150cc",
      0x3: "Extra",
    },
    courses: {
      0x0: "Luigi Raceway",
      0x1: "Moo Moo Farm",
      0x2: "Koopa Troopa Beach",
      0x3: "Kalimari Desert",
      0x4: "Toad's Turnpike",
      0x5: "Frappe Swnowland",
      0x6: "Choco Mountain",
      0x7: "Mario Raceway",
      0x8: "Wario Stadium",
      0x9: "Sherbet Land",
      0xa: "Royal Raceway",
      0xb: "Bowser's Castle",
      0xc: "D.K.'s Jungle Parkway",
      0xd: "Yoshi Valley",
      0xe: "Banshee Boardwalk",
      0xf: "Rainbow Road",
    },
    cups: {
      0x0: "-",
      0x1: "Bronze",
      0x2: "Silver",
      0x3: "Gold",
    },
    soundModes: {
      0x0: "Stereo",
      0x1: "Headphone",
      0x3: "Mono",
    },
  },
};

export default template;
