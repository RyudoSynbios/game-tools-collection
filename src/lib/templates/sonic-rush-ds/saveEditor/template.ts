import type { GameJson } from "$lib/types";

const template: GameJson = {
  validator: {
    regions: {
      europe_usa_japan: {
        0x0: [0x73, 0x6f, 0x6e, 0x69, 0x63, 0x5f, 0x72, 0x75, 0x73, 0x68, 0x5f], // "sonic_rush_"
      },
    },
    text: "Drag 'n' drop here or click to add a save file.",
    error: "Not a valid save file.",
  },
  items: [
    {
      name: "Checksum",
      offset: 0xc,
      type: "checksum",
      dataType: "uint32",
      control: {
        offsetStart: 0x10,
        offsetEnd: 0x320,
      },
    },
    {
      type: "tabs",
      items: [
        {
          name: "General",
          items: [
            {
              name: "Save Count",
              offset: 0x10,
              type: "variable",
              dataType: "uint32",
              hidden: true,
            },
            {
              type: "section",
              flex: true,
              noMargin: true,
              items: [
                {
                  name: "Progression",
                  offset: 0x15,
                  type: "variable",
                  dataType: "bit",
                  bit: 4,
                  resource: "gameProgressions",
                },
                {
                  name: "Extra Zone Unlocked",
                  offset: 0x16,
                  type: "variable",
                  dataType: "bit",
                  bit: 5,
                  hidden: true,
                },
              ],
            },
            {
              name: "Unlocked Menus",
              type: "bitflags",
              flags: [
                { offset: 0x15, bit: 0, label: "Time Attack" },
                { offset: 0x15, bit: 1, label: "Sound Test" },
              ],
            },
          ],
        },
        {
          name: "Story",
          items: [
            {
              type: "tabs",
              items: [
                {
                  name: "Sonic the Hedgehog",
                  items: [
                    {
                      length: 0xc,
                      type: "container",
                      instanceType: "tabs",
                      instances: 7,
                      resource: "sonicZones",
                      vertical: true,
                      flex: true,
                      prependSubinstance: [
                        {
                          name: "General",
                          items: [
                            {
                              type: "section",
                              flex: true,
                              noMargin: true,
                              items: [
                                {
                                  id: "progression-sonic",
                                  name: "Progression",
                                  offset: 0x18,
                                  type: "variable",
                                  dataType: "uint16",
                                  resource: "sonicProgressions",
                                  autocomplete: true,
                                },
                                {
                                  name: "Related to story clear?",
                                  offset: 0x16,
                                  type: "variable",
                                  dataType: "bit",
                                  bit: 1,
                                  hidden: true,
                                },
                                {
                                  name: "Story Clear",
                                  offset: 0x16,
                                  type: "variable",
                                  dataType: "bit",
                                  bit: 3,
                                  hidden: true,
                                },
                                {
                                  name: "Lives",
                                  offset: 0x1a,
                                  type: "variable",
                                  dataType: "uint8",
                                  max: 99,
                                },
                              ],
                            },
                            {
                              id: "chaosEmeralds",
                              name: "Chaos Emeralds",
                              type: "bitflags",
                              flags: [
                                { offset: 0x1b, bit: 0, label: "Red" },
                                { offset: 0x1b, bit: 1, label: "Blue" },
                                { offset: 0x1b, bit: 2, label: "Yellow" },
                                { offset: 0x1b, bit: 3, label: "Green" },
                                { offset: 0x1b, bit: 4, label: "White" },
                                { offset: 0x1b, bit: 5, label: "Cyan" },
                                { offset: 0x1b, bit: 6, label: "Purple" },
                              ],
                            },
                          ],
                        },
                      ],
                      items: [
                        {
                          name: "Act 1",
                          offset: 0x1c,
                          type: "variable",
                          dataType: "uint32",
                          max: 999999,
                          test: true,
                        },
                        {
                          name: "Act 2",
                          offset: 0x20,
                          type: "variable",
                          dataType: "uint32",
                          max: 999999,
                        },
                        {
                          name: "VS Boss",
                          offset: 0x24,
                          type: "variable",
                          dataType: "uint32",
                          max: 999999,
                        },
                      ],
                    },
                  ],
                },
                {
                  name: "Blaze the Cat",
                  items: [
                    {
                      length: 0xc,
                      type: "container",
                      instanceType: "tabs",
                      instances: 7,
                      resource: "blazeZones",
                      vertical: true,
                      flex: true,
                      prependSubinstance: [
                        {
                          name: "General",
                          items: [
                            {
                              type: "section",
                              flex: true,
                              noMargin: true,
                              items: [
                                {
                                  id: "progression-blaze",
                                  name: "Progression",
                                  offset: 0x70,
                                  type: "variable",
                                  dataType: "uint16",
                                  resource: "blazeProgressions",
                                  autocomplete: true,
                                },
                                {
                                  name: "Related to story clear?",
                                  offset: 0x16,
                                  type: "variable",
                                  dataType: "bit",
                                  bit: 2,
                                  hidden: true,
                                },
                                {
                                  name: "Story Clear",
                                  offset: 0x16,
                                  type: "variable",
                                  dataType: "bit",
                                  bit: 4,
                                  hidden: true,
                                },
                                {
                                  name: "Lives",
                                  offset: 0x72,
                                  type: "variable",
                                  dataType: "uint8",
                                  max: 99,
                                },
                              ],
                            },
                            {
                              name: "Sol Emeralds",
                              type: "bitflags",
                              hidden: true,
                              flags: [
                                { offset: 0x73, bit: 0, label: "Red" },
                                { offset: 0x73, bit: 1, label: "Blue" },
                                { offset: 0x73, bit: 2, label: "Yellow" },
                                { offset: 0x73, bit: 3, label: "Green" },
                                { offset: 0x73, bit: 4, label: "Grey" },
                                { offset: 0x73, bit: 5, label: "Cyan" },
                                { offset: 0x73, bit: 6, label: "Purple" },
                              ],
                            },
                          ],
                        },
                      ],
                      items: [
                        {
                          name: "Act 1",
                          offset: 0x74,
                          type: "variable",
                          dataType: "uint32",
                          max: 999999,
                        },
                        {
                          name: "Act 2",
                          offset: 0x78,
                          type: "variable",
                          dataType: "uint32",
                          max: 999999,
                        },
                        {
                          name: "VS Boss",
                          offset: 0x7c,
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
          ],
        },
        {
          name: "Time Attack",
          items: [
            {
              length: 0x1e,
              type: "container",
              instanceType: "tabs",
              instances: 7,
              resource: "sonicZones",
              vertical: true,
              items: [
                {
                  length: 0xa,
                  type: "container",
                  instanceType: "tabs",
                  instances: 3,
                  resource: "acts",
                  vertical: true,
                  items: [
                    {
                      length: 0x2,
                      type: "container",
                      instanceType: "section",
                      instances: 5,
                      flex: true,
                      items: [
                        {
                          id: "timeAttackCharacter-0-%parent1%-%parent%-%index%",
                          name: "%o Place",
                          offset: 0xc8,
                          type: "variable",
                          dataType: "bit",
                          bit: 0,
                          resource: "characters",
                          overrideShift: {
                            parent: 3,
                            shift: 0x0,
                          },
                        },
                        {
                          name: "Time",
                          type: "group",
                          mode: "chrono",
                          items: [
                            {
                              id: "time",
                              offset: 0xde,
                              type: "variable",
                              dataType: "uint16",
                              operations: [
                                { "*": 16.666666667 },
                                {
                                  convert: {
                                    from: "milliseconds",
                                    to: "minutes",
                                  },
                                },
                                { round: 0 },
                              ],
                              max: 9,
                            },
                            {
                              id: "time",
                              offset: 0xde,
                              type: "variable",
                              dataType: "uint16",
                              operations: [
                                { "*": 16.666666667 },
                                {
                                  convert: {
                                    from: "milliseconds",
                                    to: "seconds",
                                  },
                                },
                                { round: 0 },
                              ],
                              leadingZeros: 1,
                              max: 59,
                            },
                            {
                              id: "time",
                              offset: 0xde,
                              type: "variable",
                              dataType: "uint16",
                              operations: [
                                { "*": 16.666666667 },
                                {
                                  convert: {
                                    from: "milliseconds",
                                    to: "milliseconds",
                                  },
                                },
                                { round: 0 },
                              ],
                              leadingZeros: 2,
                              max: 990,
                              step: 100,
                            },
                          ],
                        },
                      ],
                    },
                  ],
                },
              ],
              appendSubinstance: [
                {
                  name: "Zone X",
                  items: [
                    {
                      length: 0xa,
                      type: "container",
                      instanceType: "tabs",
                      instances: 4,
                      enumeration: "Act %d",
                      vertical: true,
                      items: [
                        {
                          length: 0x2,
                          type: "container",
                          instanceType: "section",
                          instances: 5,
                          flex: true,
                          items: [
                            {
                              id: "timeAttackCharacter-1-0-%parent%-%index%",
                              name: "%o Place",
                              offset: 0x1b0,
                              type: "variable",
                              dataType: "bit",
                              bit: 0,
                              resource: "characters",
                              overrideShift: {
                                parent: 2,
                                shift: 0x0,
                              },
                            },
                            {
                              name: "Time",
                              type: "group",
                              mode: "chrono",
                              items: [
                                {
                                  id: "time",
                                  offset: 0x1b4,
                                  type: "variable",
                                  dataType: "uint16",
                                  operations: [
                                    { "*": 16.666666667 },
                                    {
                                      convert: {
                                        from: "milliseconds",
                                        to: "minutes",
                                      },
                                    },
                                    { round: 0 },
                                  ],
                                  max: 9,
                                },
                                {
                                  id: "time",
                                  offset: 0x1b4,
                                  type: "variable",
                                  dataType: "uint16",
                                  operations: [
                                    { "*": 16.666666667 },
                                    {
                                      convert: {
                                        from: "milliseconds",
                                        to: "seconds",
                                      },
                                    },
                                    { round: 0 },
                                  ],
                                  leadingZeros: 1,
                                  max: 59,
                                },
                                {
                                  id: "time",
                                  offset: 0x1b4,
                                  type: "variable",
                                  dataType: "uint16",
                                  operations: [
                                    { "*": 16.666666667 },
                                    {
                                      convert: {
                                        from: "milliseconds",
                                        to: "milliseconds",
                                      },
                                    },
                                    { round: 0 },
                                  ],
                                  leadingZeros: 2,
                                  max: 990,
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
          ],
        },
        {
          name: "Options",
          flex: true,
          items: [
            {
              name: "Difficulty",
              offset: 0x14,
              type: "variable",
              dataType: "bit",
              bit: 0,
              resource: "difficulties",
            },
            {
              name: "Time Limit",
              offset: 0x14,
              type: "variable",
              dataType: "bit",
              bit: 1,
              resource: "optionBooleanReversed",
            },
          ],
        },
      ],
    },
  ],
  resources: {
    acts: {
      0x0: "Act 1",
      0x1: "Act 2",
      0x2: "VS Boss",
    },
    blazeProgressions: {
      0x0: "Cutscene 1",
      0x1: "Zone 1",
      0x2: "Zone 1 VS Boss",
      0x3: "Zone 1 Clear",
      0x5: "Zone 2",
      0x6: "Zone 2 VS Boss",
      0x7: "Zone 2 Clear",
      0x8: "Zone 3",
      0x9: "Zone 3 VS Boss",
      0xa: "Zone 3 Clear",
      0xb: "Cutscene 2",
      0xc: "Zone 4",
      0xd: "Zone 4 VS Boss",
      0xe: "Zone 4 Clear",
      0xf: "Cutscene 3",
      0x10: "Zone 5",
      0x11: "Zone 5 VS Boss",
      0x12: "Zone 5 Clear",
      0x13: "Cutscene 4",
      0x14: "Zone 6",
      0x15: "Zone 6 VS Boss",
      0x16: "Zone 6 Clear",
      0x17: "Cutscene 5",
      0x18: "Zone 7",
      0x19: "Zone 7 VS Boss",
      0x1a: "Zone 7 Clear",
      0x1b: "Final Zone",
      0x1c: "Final Zone Clear",
    },
    blazeZones: {
      0x0: "Zone 1: Night Carnival",
      0x1: "Zone 2: Leaf Storm",
      0x2: "Zone 3: Mirage Road",
      0x3: "Zone 4: Water Palace",
      0x4: "Zone 5: Altitude Limit",
      0x5: "Zone 6: Huge Crisis",
      0x6: "Zone 7: Dead Line",
    },
    characters: {
      0x0: "-",
      0x1: "Sonic",
      0x2: "Blaze",
    },
    difficulties: {
      0x0: "Normal",
      0x1: "Easy",
    },
    gameProgressions: {
      0x0: "-",
      0x1: "All Clear",
    },
    optionBooleanReversed: {
      0x0: "On",
      0x1: "Off",
    },
    sonicProgressions: {
      0x0: "Zone 1",
      0x1: "Zone 1 VS Boss",
      0x2: "Zone 1 Clear",
      0x3: "Zone 2",
      0x4: "Zone 2 VS Boss",
      0x5: "Zone 2 Clear",
      0x7: "Zone 3",
      0x8: "Zone 3 VS Boss",
      0x9: "Zone 3 Clear",
      0xb: "Zone 4",
      0xc: "Zone 4 VS Boss",
      0xd: "Zone 4 Clear",
      0xe: "Cutscene 1",
      0xf: "Zone 5",
      0x10: "Zone 5 VS Boss",
      0x11: "Zone 5 Clear",
      0x12: "Cutscene 2",
      0x13: "Zone 6",
      0x14: "Zone 6 VS Boss",
      0x15: "Zone 6 Clear",
      0x16: "Zone 7",
      0x17: "Zone 7 VS Boss",
      0x18: "Zone 7 Clear",
      0x19: "Final Zone",
      0x1a: "Final Zone Clear",
    },
    sonicZones: {
      0x0: "Zone 1: Leaf Storm",
      0x1: "Zone 2: Water Palace",
      0x2: "Zone 3: Mirage Road",
      0x3: "Zone 4: Night Carnival",
      0x4: "Zone 5: Huge Crisis",
      0x5: "Zone 6: Altitude Limit",
      0x6: "Zone 7: Dead Line",
    },
  },
  resourcesLabels: {
    blazeProgressions: {
      0x0: "Zone 1: Night Carnival",
      0x5: "Zone 2: Leaf Storm",
      0x8: "Zone 3: Mirage Road",
      0xb: "Zone 4: Water Palace",
      0xf: "Zone 5: Altitude Limit",
      0x13: "Zone 6: Huge Crisis",
      0x17: "Zone 7: Dead Line",
      0x1b: "Final Zone",
    },
    sonicProgressions: {
      0x0: "Zone 1: Leaf Storm",
      0x5: "Zone 2: Water Palace",
      0x8: "Zone 3: Mirage Road",
      0xb: "Zone 4: Night Carnival",
      0xf: "Zone 5: Huge Crisis",
      0x13: "Zone 6: Altitude Limit",
      0x17: "Zone 7: Dead Line",
      0x19: "Final Zone",
    },
  },
};

export default template;
