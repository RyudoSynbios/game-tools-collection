import type { GameJson } from "$lib/types";

import { machineColors, machineColorsOrder, machines } from "./utils/resource";

const template: GameJson = {
  validator: {
    regions: {
      europe: {
        0x0: [0x46, 0x2d, 0x5a, 0x45, 0x52, 0x4f, 0x20, 0x58], // "F-ZERO X"
      },
      usa_japan: {
        0x0: [0x46, 0x2d, 0x5a, 0x45, 0x52, 0x4f, 0x20, 0x58], // "F-ZERO X"
      },
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
          name: "GP Race",
          items: [
            {
              type: "tabs",
              items: [
                {
                  name: "General",
                  items: [
                    {
                      name: "Checksum",
                      offset: 0xe,
                      type: "checksum",
                      dataType: "uint16",
                      bigEndian: true,
                      control: {
                        offsetStart: 0x0,
                        offsetEnd: 0xe,
                      },
                    },
                    {
                      type: "section",
                      flex: true,
                      items: [
                        {
                          name: "Jack Cup",
                          offset: 0xa,
                          type: "variable",
                          dataType: "uint8",
                          resource: "progressions",
                        },
                        {
                          name: "Queen Cup",
                          offset: 0xb,
                          type: "variable",
                          dataType: "uint8",
                          resource: "progressions",
                        },
                        {
                          name: "King Cup",
                          offset: 0xc,
                          type: "variable",
                          dataType: "uint8",
                          resource: "progressions",
                        },
                        {
                          name: "Joker Cup",
                          offset: 0xd,
                          type: "variable",
                          dataType: "uint8",
                          resource: "progressions",
                        },
                      ],
                    },
                  ],
                },
                {
                  name: "Cups",
                  items: [
                    {
                      type: "section",
                      flex: true,
                      items: [
                        {
                          name: "Checksum",
                          offset: 0x7f80,
                          type: "checksum",
                          dataType: "uint16",
                          bigEndian: true,
                          control: {
                            offsetStart: 0x7f82,
                            offsetEnd: 0x8000,
                          },
                        },
                        {
                          length: 0x14,
                          type: "container",
                          instanceType: "tabs",
                          instances: 4,
                          resource: "difficulties",
                          vertical: true,
                          flex: true,
                          items: [
                            {
                              name: "Blue Falcon",
                              type: "bitflags",
                              flags: [
                                { offset: 0x7f91, bit: 0, label: "Jack Cup" },
                                { offset: 0x7f91, bit: 1, label: "Queen Cup" },
                                { offset: 0x7f91, bit: 2, label: "King Cup" },
                                { offset: 0x7f91, bit: 3, label: "Joker Cup" },
                                { offset: 0x7f91, bit: 4, label: "X Cup" },
                              ],
                            },
                            {
                              name: "Golden Fox",
                              type: "bitflags",
                              flags: [
                                { offset: 0x7f91, bit: 5, label: "Jack Cup" },
                                { offset: 0x7f91, bit: 6, label: "Queen Cup" },
                                { offset: 0x7f91, bit: 7, label: "King Cup" },
                                { offset: 0x7f90, bit: 0, label: "Joker Cup" },
                                { offset: 0x7f90, bit: 1, label: "X Cup" },
                              ],
                            },
                            {
                              name: "Wild Goose",
                              type: "bitflags",
                              flags: [
                                { offset: 0x7f90, bit: 2, label: "Jack Cup" },
                                { offset: 0x7f90, bit: 3, label: "Queen Cup" },
                                { offset: 0x7f90, bit: 4, label: "King Cup" },
                                { offset: 0x7f90, bit: 5, label: "Joker Cup" },
                                { offset: 0x7f90, bit: 6, label: "X Cup" },
                              ],
                            },
                            {
                              name: "Fire Stingray",
                              type: "bitflags",
                              flags: [
                                { offset: 0x7f93, bit: 0, label: "Jack Cup" },
                                { offset: 0x7f93, bit: 1, label: "Queen Cup" },
                                { offset: 0x7f93, bit: 2, label: "King Cup" },
                                { offset: 0x7f93, bit: 3, label: "Joker Cup" },
                                { offset: 0x7f93, bit: 4, label: "X Cup" },
                              ],
                            },
                            {
                              name: "White Cat",
                              type: "bitflags",
                              flags: [
                                { offset: 0x7f93, bit: 5, label: "Jack Cup" },
                                { offset: 0x7f93, bit: 6, label: "Queen Cup" },
                                { offset: 0x7f93, bit: 7, label: "King Cup" },
                                { offset: 0x7f92, bit: 0, label: "Joker Cup" },
                                { offset: 0x7f92, bit: 1, label: "X Cup" },
                              ],
                            },
                            {
                              name: "Red Gazelle",
                              type: "bitflags",
                              flags: [
                                { offset: 0x7f92, bit: 2, label: "Jack Cup" },
                                { offset: 0x7f92, bit: 3, label: "Queen Cup" },
                                { offset: 0x7f92, bit: 4, label: "King Cup" },
                                { offset: 0x7f92, bit: 5, label: "Joker Cup" },
                                { offset: 0x7f92, bit: 6, label: "X Cup" },
                              ],
                            },
                            {
                              name: "Iron Tiger",
                              type: "bitflags",
                              flags: [
                                { offset: 0x7f95, bit: 5, label: "Jack Cup" },
                                { offset: 0x7f95, bit: 6, label: "Queen Cup" },
                                { offset: 0x7f95, bit: 7, label: "King Cup" },
                                { offset: 0x7f94, bit: 0, label: "Joker Cup" },
                                { offset: 0x7f94, bit: 1, label: "X Cup" },
                              ],
                            },
                            {
                              name: "Deep Claw",
                              type: "bitflags",
                              flags: [
                                { offset: 0x7f94, bit: 2, label: "Jack Cup" },
                                { offset: 0x7f94, bit: 3, label: "Queen Cup" },
                                { offset: 0x7f94, bit: 4, label: "King Cup" },
                                { offset: 0x7f94, bit: 5, label: "Joker Cup" },
                                { offset: 0x7f94, bit: 6, label: "X Cup" },
                              ],
                            },
                            {
                              name: "Crazy Bear",
                              type: "bitflags",
                              flags: [
                                { offset: 0x7f9e, bit: 2, label: "Jack Cup" },
                                { offset: 0x7f9e, bit: 3, label: "Queen Cup" },
                                { offset: 0x7f9e, bit: 4, label: "King Cup" },
                                { offset: 0x7f9e, bit: 5, label: "Joker Cup" },
                                { offset: 0x7f9e, bit: 6, label: "X Cup" },
                              ],
                            },
                            {
                              name: "Great Star",
                              type: "bitflags",
                              flags: [
                                { offset: 0x7f95, bit: 0, label: "Jack Cup" },
                                { offset: 0x7f95, bit: 1, label: "Queen Cup" },
                                { offset: 0x7f95, bit: 2, label: "King Cup" },
                                { offset: 0x7f95, bit: 3, label: "Joker Cup" },
                                { offset: 0x7f95, bit: 4, label: "X Cup" },
                              ],
                            },
                            {
                              name: "Big Fang",
                              type: "bitflags",
                              flags: [
                                { offset: 0x7fa1, bit: 5, label: "Jack Cup" },
                                { offset: 0x7fa1, bit: 6, label: "Queen Cup" },
                                { offset: 0x7fa1, bit: 7, label: "King Cup" },
                                { offset: 0x7fa0, bit: 0, label: "Joker Cup" },
                                { offset: 0x7fa0, bit: 1, label: "X Cup" },
                              ],
                            },
                            {
                              name: "Mad Wolf",
                              type: "bitflags",
                              flags: [
                                { offset: 0x7fa3, bit: 0, label: "Jack Cup" },
                                { offset: 0x7fa3, bit: 1, label: "Queen Cup" },
                                { offset: 0x7fa3, bit: 2, label: "King Cup" },
                                { offset: 0x7fa3, bit: 3, label: "Joker Cup" },
                                { offset: 0x7fa3, bit: 4, label: "X Cup" },
                              ],
                            },
                            {
                              name: "Night Thunder",
                              type: "bitflags",
                              flags: [
                                { offset: 0x7fa1, bit: 0, label: "Jack Cup" },
                                { offset: 0x7fa1, bit: 1, label: "Queen Cup" },
                                { offset: 0x7fa1, bit: 2, label: "King Cup" },
                                { offset: 0x7fa1, bit: 3, label: "Joker Cup" },
                                { offset: 0x7fa1, bit: 4, label: "X Cup" },
                              ],
                            },
                            {
                              name: "Twin Noritta",
                              type: "bitflags",
                              flags: [
                                { offset: 0x7f97, bit: 0, label: "Jack Cup" },
                                { offset: 0x7f97, bit: 1, label: "Queen Cup" },
                                { offset: 0x7f97, bit: 2, label: "King Cup" },
                                { offset: 0x7f97, bit: 3, label: "Joker Cup" },
                                { offset: 0x7f97, bit: 4, label: "X Cup" },
                              ],
                            },
                            {
                              name: "Wonder Wasp",
                              type: "bitflags",
                              flags: [
                                { offset: 0x7f9c, bit: 2, label: "Jack Cup" },
                                { offset: 0x7f9c, bit: 3, label: "Queen Cup" },
                                { offset: 0x7f9c, bit: 4, label: "King Cup" },
                                { offset: 0x7f9c, bit: 5, label: "Joker Cup" },
                                { offset: 0x7f9c, bit: 6, label: "X Cup" },
                              ],
                            },
                            {
                              name: "Queen Meteor",
                              type: "bitflags",
                              flags: [
                                { offset: 0x7f9d, bit: 5, label: "Jack Cup" },
                                { offset: 0x7f9d, bit: 6, label: "Queen Cup" },
                                { offset: 0x7f9d, bit: 7, label: "King Cup" },
                                { offset: 0x7f9c, bit: 0, label: "Joker Cup" },
                                { offset: 0x7f9c, bit: 1, label: "X Cup" },
                              ],
                            },
                            {
                              name: "Blood Hawk",
                              type: "bitflags",
                              flags: [
                                { offset: 0x7fa2, bit: 2, label: "Jack Cup" },
                                { offset: 0x7fa2, bit: 3, label: "Queen Cup" },
                                { offset: 0x7fa2, bit: 4, label: "King Cup" },
                                { offset: 0x7fa2, bit: 5, label: "Joker Cup" },
                                { offset: 0x7fa2, bit: 6, label: "X Cup" },
                              ],
                            },
                            {
                              name: "Astro Robin",
                              type: "bitflags",
                              flags: [
                                { offset: 0x7f9a, bit: 2, label: "Jack Cup" },
                                { offset: 0x7f9a, bit: 3, label: "Queen Cup" },
                                { offset: 0x7f9a, bit: 4, label: "King Cup" },
                                { offset: 0x7f9a, bit: 5, label: "Joker Cup" },
                                { offset: 0x7f9a, bit: 6, label: "X Cup" },
                              ],
                            },
                            {
                              name: "Little Wyvern",
                              type: "bitflags",
                              flags: [
                                { offset: 0x7f99, bit: 0, label: "Jack Cup" },
                                { offset: 0x7f99, bit: 1, label: "Queen Cup" },
                                { offset: 0x7f99, bit: 2, label: "King Cup" },
                                { offset: 0x7f99, bit: 3, label: "Joker Cup" },
                                { offset: 0x7f99, bit: 4, label: "X Cup" },
                              ],
                            },
                            {
                              name: "Death Anchor",
                              type: "bitflags",
                              flags: [
                                { offset: 0x7f9f, bit: 5, label: "Jack Cup" },
                                { offset: 0x7f9f, bit: 6, label: "Queen Cup" },
                                { offset: 0x7f9f, bit: 7, label: "King Cup" },
                                { offset: 0x7f9e, bit: 0, label: "Joker Cup" },
                                { offset: 0x7f9e, bit: 1, label: "X Cup" },
                              ],
                            },
                            {
                              name: "Wild Boar",
                              type: "bitflags",
                              flags: [
                                { offset: 0x7f9b, bit: 5, label: "Jack Cup" },
                                { offset: 0x7f9b, bit: 6, label: "Queen Cup" },
                                { offset: 0x7f9b, bit: 7, label: "King Cup" },
                                { offset: 0x7f9a, bit: 0, label: "Joker Cup" },
                                { offset: 0x7f9a, bit: 1, label: "X Cup" },
                              ],
                            },
                            {
                              name: "King Meteor",
                              type: "bitflags",
                              flags: [
                                { offset: 0x7f9d, bit: 0, label: "Jack Cup" },
                                { offset: 0x7f9d, bit: 1, label: "Queen Cup" },
                                { offset: 0x7f9d, bit: 2, label: "King Cup" },
                                { offset: 0x7f9d, bit: 3, label: "Joker Cup" },
                                { offset: 0x7f9d, bit: 4, label: "X Cup" },
                              ],
                            },
                            {
                              name: "Super Piranha",
                              type: "bitflags",
                              flags: [
                                { offset: 0x7f97, bit: 5, label: "Jack Cup" },
                                { offset: 0x7f97, bit: 6, label: "Queen Cup" },
                                { offset: 0x7f97, bit: 7, label: "King Cup" },
                                { offset: 0x7f96, bit: 0, label: "Joker Cup" },
                                { offset: 0x7f96, bit: 1, label: "X Cup" },
                              ],
                            },
                            {
                              name: "Mighty Hurricane",
                              type: "bitflags",
                              flags: [
                                { offset: 0x7f96, bit: 2, label: "Jack Cup" },
                                { offset: 0x7f96, bit: 3, label: "Queen Cup" },
                                { offset: 0x7f96, bit: 4, label: "King Cup" },
                                { offset: 0x7f96, bit: 5, label: "Joker Cup" },
                                { offset: 0x7f96, bit: 6, label: "X Cup" },
                              ],
                            },
                            {
                              name: "Space Angler",
                              type: "bitflags",
                              flags: [
                                { offset: 0x7f99, bit: 5, label: "Jack Cup" },
                                { offset: 0x7f99, bit: 6, label: "Queen Cup" },
                                { offset: 0x7f99, bit: 7, label: "King Cup" },
                                { offset: 0x7f98, bit: 0, label: "Joker Cup" },
                                { offset: 0x7f98, bit: 1, label: "X Cup" },
                              ],
                            },
                            {
                              name: "Mighty Typhoon",
                              type: "bitflags",
                              flags: [
                                { offset: 0x7fa0, bit: 2, label: "Jack Cup" },
                                { offset: 0x7fa0, bit: 3, label: "Queen Cup" },
                                { offset: 0x7fa0, bit: 4, label: "King Cup" },
                                { offset: 0x7fa0, bit: 5, label: "Joker Cup" },
                                { offset: 0x7fa0, bit: 6, label: "X Cup" },
                              ],
                            },
                            {
                              name: "Hyper Speeder",
                              type: "bitflags",
                              flags: [
                                { offset: 0x7f9f, bit: 0, label: "Jack Cup" },
                                { offset: 0x7f9f, bit: 1, label: "Queen Cup" },
                                { offset: 0x7f9f, bit: 2, label: "King Cup" },
                                { offset: 0x7f9f, bit: 3, label: "Joker Cup" },
                                { offset: 0x7f9f, bit: 4, label: "X Cup" },
                              ],
                            },
                            {
                              name: "Green Panther",
                              type: "bitflags",
                              flags: [
                                { offset: 0x7f98, bit: 2, label: "Jack Cup" },
                                { offset: 0x7f98, bit: 3, label: "Queen Cup" },
                                { offset: 0x7f98, bit: 4, label: "King Cup" },
                                { offset: 0x7f98, bit: 5, label: "Joker Cup" },
                                { offset: 0x7f98, bit: 6, label: "X Cup" },
                              ],
                            },
                            {
                              name: "Black Bull",
                              type: "bitflags",
                              flags: [
                                { offset: 0x7f9b, bit: 0, label: "Jack Cup" },
                                { offset: 0x7f9b, bit: 1, label: "Queen Cup" },
                                { offset: 0x7f9b, bit: 2, label: "King Cup" },
                                { offset: 0x7f9b, bit: 3, label: "Joker Cup" },
                                { offset: 0x7f9b, bit: 4, label: "X Cup" },
                              ],
                            },
                            {
                              name: "Sonic Phantom",
                              type: "bitflags",
                              flags: [
                                { offset: 0x7fa3, bit: 5, label: "Jack Cup" },
                                { offset: 0x7fa3, bit: 6, label: "Queen Cup" },
                                { offset: 0x7fa3, bit: 7, label: "King Cup" },
                                { offset: 0x7fa2, bit: 0, label: "Joker Cup" },
                                { offset: 0x7fa2, bit: 1, label: "X Cup" },
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
          ],
        },
        {
          name: "Time Attack",
          items: [
            {
              length: 0x110,
              type: "container",
              instanceType: "tabs",
              instances: 24,
              resource: "courses",
              vertical: true,
              items: [
                {
                  name: "Checksum",
                  offset: 0x20,
                  type: "checksum",
                  dataType: "uint16",
                  bigEndian: true,
                  control: {
                    offsetStart: 0x22,
                    offsetEnd: 0x130,
                  },
                },
                {
                  type: "section",
                  flex: true,
                  items: [
                    {
                      id: "machine-5",
                      name: "Machine",
                      offset: 0x110,
                      type: "variable",
                      dataType: "uint8",
                      resource: "machines",
                      autocomplete: true,
                    },
                    {
                      id: "color-5",
                      name: "Color",
                      offset: 0x118,
                      type: "variable",
                      dataType: "uint24",
                      bigEndian: true,
                    },
                    {
                      id: "maxSpeed",
                      name: "Max Speed",
                      offset: 0x4c,
                      type: "variable",
                      dataType: "float32",
                      bigEndian: true,
                      operations: [{ "*": 18 }],
                      min: 0,
                      max: 9999,
                    },
                  ],
                },
                {
                  type: "section",
                  flex: true,
                  items: [
                    {
                      name: "Best Lap",
                      type: "group",
                      mode: "time",
                      items: [
                        {
                          offset: 0x50,
                          type: "variable",
                          dataType: "uint32",
                          bigEndian: true,
                          operations: [
                            {
                              convert: {
                                from: "milliseconds",
                                to: "minutes",
                              },
                            },
                          ],
                          max: 59,
                        },
                        {
                          offset: 0x50,
                          type: "variable",
                          dataType: "uint32",
                          bigEndian: true,
                          operations: [
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
                          offset: 0x50,
                          type: "variable",
                          dataType: "uint32",
                          bigEndian: true,
                          operations: [
                            {
                              convert: {
                                from: "milliseconds",
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
                  length: 0x4,
                  type: "container",
                  instanceType: "section",
                  instances: 5,
                  enumeration: "%o Place",
                  flex: true,
                  items: [
                    {
                      id: "timeAttack-48",
                      name: "Name",
                      offset: 0x54,
                      length: 0x3,
                      type: "variable",
                      dataType: "string",
                      letterDataType: "uint8",
                      endCode: 0x0,
                      regex: "[ !',\-.0-9A-Z]",
                      test: true,
                    },
                    {
                      id: "machine-%index%",
                      name: "Machine",
                      offset: 0x70,
                      type: "variable",
                      dataType: "uint8",
                      resource: "machines",
                      autocomplete: true,
                      overrideShift: {
                        parent: 1,
                        shift: 0x20,
                      },
                    },
                    {
                      id: "color-%index%",
                      name: "Color",
                      offset: 0x78,
                      type: "variable",
                      dataType: "uint24",
                      bigEndian: true,
                      overrideShift: {
                        parent: 1,
                        shift: 0x20,
                      },
                    },
                    {
                      id: "timeAttack-20",
                      name: "Speed Ratio",
                      offset: 0x38,
                      type: "variable",
                      dataType: "float32",
                      bigEndian: true,
                      min: 0,
                      max: 1,
                      step: 0.05,
                    },
                    {
                      name: "Time",
                      type: "group",
                      mode: "time",
                      items: [
                        {
                          id: "time-%index%",
                          offset: 0x24,
                          type: "variable",
                          dataType: "uint32",
                          bigEndian: true,
                          operations: [
                            {
                              convert: {
                                from: "milliseconds",
                                to: "minutes",
                              },
                            },
                          ],
                          max: 59,
                        },
                        {
                          id: "time-%index%",
                          offset: 0x24,
                          type: "variable",
                          dataType: "uint32",
                          bigEndian: true,
                          operations: [
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
                          id: "time-%index%",
                          offset: 0x24,
                          type: "variable",
                          dataType: "uint32",
                          bigEndian: true,
                          operations: [
                            {
                              convert: {
                                from: "milliseconds",
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
        {
          name: "Death Race",
          items: [
            {
              name: "Checksum",
              offset: 0x10,
              type: "checksum",
              dataType: "uint16",
              bigEndian: true,
              control: {
                offsetStart: 0x10,
                offsetEnd: 0x20,
              },
            },
            {
              type: "section",
              flex: true,
              items: [
                {
                  name: "Time",
                  type: "group",
                  mode: "time",
                  items: [
                    {
                      offset: 0x14,
                      type: "variable",
                      dataType: "uint32",
                      bigEndian: true,
                      operations: [
                        {
                          convert: {
                            from: "milliseconds",
                            to: "minutes",
                          },
                        },
                      ],
                      max: 59,
                    },
                    {
                      offset: 0x14,
                      type: "variable",
                      dataType: "uint32",
                      bigEndian: true,
                      operations: [
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
                      offset: 0x14,
                      type: "variable",
                      dataType: "uint32",
                      bigEndian: true,
                      operations: [
                        {
                          convert: {
                            from: "milliseconds",
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
        {
          name: "Speed Ratios",
          hidden: true,
          items: [
            {
              length: 0x80,
              type: "container",
              instanceType: "tabs",
              instances: 24,
              resource: "courses",
              vertical: true,
              items: [
                {
                  name: "Checksum",
                  offset: 0x7380,
                  type: "checksum",
                  dataType: "uint16",
                  bigEndian: true,
                  control: {
                    offsetStart: 0x7382,
                    offsetEnd: 0x7400,
                  },
                },
                {
                  length: 0x4,
                  type: "container",
                  instanceType: "section",
                  instances: 30,
                  resource: "machines",
                  resourceOrder: true,
                  items: [
                    {
                      name: "Speed Ratio",
                      offset: 0x7388,
                      type: "variable",
                      dataType: "float32",
                      bigEndian: true,
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
              type: "section",
              flex: true,
              items: [
                {
                  name: "VS COM (2P,3P)",
                  offset: 0x8,
                  type: "variable",
                  dataType: "bit",
                  bit: 0,
                  resource: "optionWith",
                },
                {
                  name: "VS Slot",
                  offset: 0x8,
                  type: "variable",
                  dataType: "bit",
                  bit: 1,
                  resource: "optionWith",
                },
                {
                  name: "VS Handicap",
                  offset: 0x8,
                  type: "variable",
                  dataType: "uint8",
                  binary: {
                    bitStart: 4,
                    bitLength: 2,
                  },
                  resource: "vsHandicaps",
                },
              ],
            },
            {
              type: "section",
              flex: true,
              items: [
                {
                  name: "Sound Mode",
                  offset: 0x8,
                  type: "variable",
                  dataType: "bit",
                  bit: 2,
                  resource: "soundModes",
                },
              ],
            },
            {
              type: "section",
              flex: true,
              items: [
                {
                  name: "Everything Unlocked",
                  offset: 0x8,
                  type: "variable",
                  dataType: "bit",
                  bit: 3,
                  resource: "optionBoolean",
                },
              ],
            },
          ],
        },
      ],
    },
  ],
  resources: {
    courses: {
      0x0: "Mute City",
      0x1: "Silence",
      0x2: "Sand Ocean",
      0x3: "Devil's Forest",
      0x4: "Big Blue",
      0x5: "Port Town",
      0x6: "Sector α",
      0x7: "Red Canyon",
      0x8: "Devil's Forest 2",
      0x9: "Mute City 2",
      0xa: "Big Blue 2",
      0xb: "White Land",
      0xc: "Fire Field",
      0xd: "Silence 2",
      0xe: "Sector β",
      0xf: "Red Canyon 2",
      0x10: "White Land 2",
      0x11: "Mute City 3",
      0x12: "Rainbow Road",
      0x13: "Devil's Forest 3",
      0x14: "Space Plant",
      0x15: "Sand Ocean 2",
      0x16: "Port Town 2",
      0x17: "Big Hand",
    },
    difficulties: {
      0x0: "Novice",
      0x1: "Standard",
      0x2: "Expert",
      0x3: "Master",
    },
    empty: {
      0x0: "-",
    },
    ...machineColors,
    machines,
    optionBoolean: {
      0x0: "No",
      0x1: "Yes",
    },
    optionWith: {
      0x0: "Without",
      0x1: "With",
    },
    progressions: {
      0x0: "-",
      0x1: "Novice",
      0x2: "Standard",
      0x3: "Expert",
      0x4: "Master",
    },
    soundModes: {
      0x0: "Stereo",
      0x1: "Mono",
    },
    vsHandicaps: {
      0x0: "Without",
      0x1: "+1",
      0x2: "+2",
    },
  },
  resourcesOrder: {
    machines: [
      0x0, 0x1, 0x2, 0x3, 0x4, 0x5, 0x7, 0x8, 0x17, 0x6, 0x19, 0x1b, 0x18, 0x9,
      0x14, 0x13, 0x1d, 0x11, 0xc, 0x16, 0x10, 0x12, 0xa, 0xb, 0xd, 0x1a, 0x15,
      0xe, 0xf, 0x1c,
    ],
    ...machineColorsOrder,
  },
};

export default template;
