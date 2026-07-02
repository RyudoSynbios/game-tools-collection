import type { GameJson, ItemTabs } from "$lib/types";

import { timeFragment } from "./utils/fragment";
import { machineList, machines, machinesOrder, series } from "./utils/resource";

const template: GameJson = {
  validator: {
    platforms: {
      gameboyadvance: {
        europe_usa_japan: { 0x4: [0xe8, 0xb4, 0xa6, 0x19] },
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
          id: "checksum1",
          name: "Checksum 1",
          offset: 0x4008,
          type: "checksum",
          dataType: "uint32",
          control: {
            offsetStart: 0x4010,
            offsetEnd: 0x48b0,
          },
        },
        {
          id: "checksum2",
          name: "Checksum 2",
          offset: 0x400c,
          type: "checksum",
          dataType: "uint32",
          control: {
            offsetStart: 0x4010,
            offsetEnd: 0x48b0,
          },
        },
        {
          id: "checksum3",
          name: "Checksum 3",
          offset: 0x7658,
          type: "checksum",
          dataType: "uint32",
          control: {
            offsetStart: 0x4008,
            offsetEnd: 0x5248,
          },
        },
        {
          id: "checksum3",
          name: "Checksum 4",
          offset: 0x765c,
          type: "checksum",
          dataType: "uint32",
          control: {
            offsetStart: 0x400c,
            offsetEnd: 0x524c,
          },
        },
      ],
    },
    {
      id: "slots",
      length: 0x330,
      type: "container",
      instanceType: "tabs",
      instances: 3,
      enumeration: "Slot %d",
      items: [
        {
          type: "section",
          flex: true,
          hidden: true,
          items: [
            {
              id: "checksum1",
              name: "Checksum 1",
              offset: 0x48b8,
              type: "checksum",
              dataType: "uint32",
              control: {
                offsetStart: 0x48c0,
                offsetEnd: 0x4be0,
              },
              order: 1,
            },
            {
              id: "checksum2",
              name: "Checksum 2",
              offset: 0x48bc,
              type: "checksum",
              dataType: "uint32",
              control: {
                offsetStart: 0x48c0,
                offsetEnd: 0x4be0,
              },
              order: 1,
            },
          ],
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
                      id: "name",
                      name: "Name",
                      offset: 0x401e,
                      length: 0x8,
                      type: "variable",
                      dataType: "string",
                      letterDataType: "uint8",
                      resource: "letters",
                      overrideShift: {
                        parent: 1,
                        shift: 0x6,
                      },
                      test: true,
                    },
                    {
                      name: "Championship Clear Count",
                      offset: 0x48de,
                      type: "variable",
                      dataType: "uint8",
                      test: true,
                    },
                    {
                      name: "???",
                      offset: 0x48df,
                      type: "variable",
                      dataType: "uint8",
                      hidden: true,
                    },
                  ],
                },
                {
                  type: "section",
                  flex: true,
                  items: [
                    {
                      id: "unlockedMachines",
                      name: "Unlocked Machines",
                      type: "bitflags",
                      flags: [
                        { offset: 0x48c7, bit: 0, label: "Sly Joker" },
                        { offset: 0x48c7, bit: 0, label: "The Stringray" },
                        { offset: 0x48c7, bit: 0, label: "Silver Thunder" },
                        { offset: 0x48c7, bit: 0, label: "Falcon Mk-II" },
                        { offset: 0x48c7, bit: 0, label: "Fighting Comet" },
                        { offset: 0x48c7, bit: 5, label: "Jet Vermilion" },
                      ],
                    },
                    {
                      name: "Unlocked Modes",
                      type: "bitflags",
                      flags: [
                        { offset: 0x48c7, bit: 6, label: "Queen Class" },
                        { offset: 0x48c7, bit: 7, label: "Championship" },
                      ],
                    },
                  ],
                },
              ],
            },
            {
              name: "Grand Prix",
              items: [
                {
                  type: "tabs",
                  vertical: true,
                  items: [
                    {
                      name: "General",
                      items: [
                        {
                          name: "Cleared Circuits",
                          type: "section",
                          flex: true,
                          items: [
                            {
                              name: "Pawn",
                              type: "bitflags",
                              flags: [
                                { offset: 0x48c8, bit: 0, label: "Pawn 1" },
                                { offset: 0x48c8, bit: 1, label: "Pawn 2" },
                                { offset: 0x48c8, bit: 2, label: "Pawn 3" },
                                { offset: 0x48c8, bit: 3, label: "Pawn 4" },
                              ],
                            },
                            {
                              name: "Knight",
                              type: "bitflags",
                              flags: [
                                { offset: 0x48c8, bit: 4, label: "Knight 1" },
                                { offset: 0x48c8, bit: 5, label: "Knight 2" },
                                { offset: 0x48c8, bit: 6, label: "Knight 3" },
                                { offset: 0x48c8, bit: 7, label: "Knight 4" },
                              ],
                            },
                            {
                              name: "Bishop",
                              type: "bitflags",
                              flags: [
                                { offset: 0x48c9, bit: 0, label: "Bishop 1" },
                                { offset: 0x48c9, bit: 1, label: "Bishop 2" },
                                { offset: 0x48c9, bit: 2, label: "Bishop 3" },
                                { offset: 0x48c9, bit: 3, label: "Bishop 4" },
                              ],
                            },
                            {
                              name: "Queen",
                              type: "bitflags",
                              flags: [
                                { offset: 0x48c9, bit: 4, label: "Queen 1" },
                                { offset: 0x48c9, bit: 5, label: "Queen 2" },
                                { offset: 0x48c9, bit: 6, label: "Queen 3" },
                                { offset: 0x48c9, bit: 7, label: "Queen 4" },
                              ],
                            },
                          ],
                        },
                      ],
                    },
                    {
                      name: "Beginner",
                      flex: true,
                      items: machineList.map((machine) => {
                        const shift = machine.index * 0x2;

                        return {
                          name: machine.name,
                          type: "bitflags",
                          flags: [
                            { offset: 0x48ca + shift, bit: 0, label: "Pawn" },
                            { offset: 0x48ca + shift, bit: 4, label: "Knight" },
                            { offset: 0x48cb + shift, bit: 0, label: "Bishop" },
                            { offset: 0x48cb + shift, bit: 4, label: "Queen" },
                          ],
                        };
                      }),
                    },
                    {
                      name: "Standard",
                      flex: true,
                      items: machineList.map((machine) => {
                        const shift = machine.index * 0x2;

                        return {
                          name: machine.name,
                          type: "bitflags",
                          flags: [
                            { offset: 0x48ca + shift, bit: 1, label: "Pawn" },
                            { offset: 0x48ca + shift, bit: 5, label: "Knight" },
                            { offset: 0x48cb + shift, bit: 1, label: "Bishop" },
                            { offset: 0x48cb + shift, bit: 5, label: "Queen" },
                          ],
                        };
                      }),
                    },
                    {
                      name: "Expert",
                      flex: true,
                      items: machineList.map((machine) => {
                        const shift = machine.index * 0x2;

                        return {
                          name: machine.name,
                          type: "bitflags",
                          flags: [
                            { offset: 0x48ca + shift, bit: 2, label: "Pawn" },
                            { offset: 0x48ca + shift, bit: 6, label: "Knight" },
                            { offset: 0x48cb + shift, bit: 2, label: "Bishop" },
                            { offset: 0x48cb + shift, bit: 6, label: "Queen" },
                          ],
                        };
                      }),
                    },
                    {
                      name: "Master",
                      flex: true,
                      items: machineList.map((machine) => {
                        const shift = machine.index * 0x2;

                        return {
                          name: machine.name,
                          type: "bitflags",
                          flags: [
                            { offset: 0x48ca + shift, bit: 3, label: "Pawn" },
                            { offset: 0x48ca + shift, bit: 7, label: "Knight" },
                            { offset: 0x48cb + shift, bit: 3, label: "Bishop" },
                            { offset: 0x48cb + shift, bit: 7, label: "Queen" },
                          ],
                        };
                      }),
                    },
                  ],
                },
              ],
            },
            {
              name: "Rankings",
              items: [
                {
                  type: "tabs",
                  items: series.map((serie) => ({
                    name: serie.name,
                    items: [
                      {
                        type: "tabs",
                        vertical: true,
                        items: serie.courses.map((course) => ({
                          name: course.name,
                          items: [
                            {
                              type: "section",
                              flex: true,
                              items: [
                                ...timeFragment("Best Lap", 0x4b56 + course.index * 0x3),
                              ],
                            },
                            {
                              length: 0x3,
                              type: "container",
                              instanceType: "section",
                              instances: 10,
                              enumeration: "%o Place",
                              items: [
                                {
                                  type: "section",
                                  flex: true,
                                  items: [
                                    ...timeFragment("Time", 0x48e0 + course.index * 0x1e),
                                  ],
                                },
                              ],
                            },
                          ],
                        })),
                      } as ItemTabs,
                    ],
                  })),
                },
              ],
            },
            {
              name: "Options",
              flex: true,
              items: [
                {
                  name: "Spare Machines",
                  offset: 0x48c6,
                  type: "variable",
                  dataType: "uint8",
                  binary: {
                    bitStart: 4,
                    bitLength: 3,
                  },
                  resource: "spareMachines",
                },
                {
                  name: "Controller",
                  offset: 0x48c6,
                  type: "variable",
                  dataType: "uint8",
                  binary: {
                    bitStart: 0,
                    bitLength: 4,
                  },
                  resource: "controllers",
                },
                {
                  name: "Music",
                  offset: 0x48c6,
                  type: "variable",
                  dataType: "bit",
                  bit: 7,
                  resource: "optionBooleanReversed",
                },
              ],
            },
          ],
        },
      ],
      appendSubinstance: [
        {
          name: "Mixed Rankings",
          items: [
            {
              type: "tabs",
              items: series.map((serie) => ({
                name: serie.name,
                items: [
                  {
                    type: "tabs",
                    vertical: true,
                    items: serie.courses.map((course) => ({
                      name: course.name,
                      items: [
                        {
                          type: "section",
                          flex: true,
                          items: [
                            {
                              id: "name",
                              name: "Name",
                              offset: 0x47d1 + course.index * 0x6,
                              length: 0x8,
                              type: "variable",
                              dataType: "string",
                              letterDataType: "uint8",
                              resource: "letters",
                            },
                            ...timeFragment("Best Lap", 0x42a6 + course.index * 0x3),
                          ],
                        },
                        {
                          length: 0x3,
                          type: "container",
                          instanceType: "section",
                          instances: 10,
                          enumeration: "%o Place",
                          items: [
                            {
                              type: "section",
                              flex: true,
                              items: [
                                {
                                  id: "name",
                                  name: "Name",
                                  offset: 0x42e5 + course.index * 0x3c,
                                  length: 0x8,
                                  type: "variable",
                                  dataType: "string",
                                  letterDataType: "uint8",
                                  resource: "letters",
                                  overrideShift: {
                                    parent: 1,
                                    shift: 0x6,
                                  },
                                },
                                ...timeFragment("Time", 0x4030 + course.index * 0x1e),
                              ],
                            },
                          ],
                        },
                      ],
                    })),
                  } as ItemTabs,
                ],
              })),
            },
          ],
        },
      ],
    },
  ],
  resources: {
    controllers: {
      0x0: "Type 1",
      0x1: "Type 2",
      0x2: "Type 3",
      0x3: "Type 4",
      0x4: "Type 5",
      0x5: "Type 6",
    },
    empty: {
      0x0: "-",
    },
    letters: {
      0x0: " ",
      0x1: "!",
      0x6: "_",
      0x7: "'",
      0xc: ",",
      0xd: "-",
      0xe: ".",
      0xf: "/",
      0x1f: "?",
      0x10: "0",
      0x11: "1",
      0x12: "2",
      0x13: "3",
      0x14: "4",
      0x15: "5",
      0x16: "6",
      0x17: "7",
      0x18: "8",
      0x19: "9",
      0x21: "A",
      0x22: "B",
      0x23: "C",
      0x24: "D",
      0x25: "E",
      0x26: "F",
      0x27: "G",
      0x28: "H",
      0x29: "I",
      0x2a: "J",
      0x2b: "K",
      0x2c: "L",
      0x2d: "M",
      0x2e: "N",
      0x2f: "O",
      0x30: "P",
      0x31: "Q",
      0x32: "R",
      0x33: "S",
      0x34: "T",
      0x35: "U",
      0x36: "V",
      0x37: "W",
      0x38: "X",
      0x39: "Y",
      0x3a: "Z",
    },
    machines,
    optionBooleanReversed: {
      0x0: "On",
      0x1: "Off",
    },
    spareMachines: {
      0x0: "x5",
      0x1: "x3",
      0x2: "x1",
    },
  },
  resourcesOrder: {
    machines: machinesOrder,
  },
};

export default template;
