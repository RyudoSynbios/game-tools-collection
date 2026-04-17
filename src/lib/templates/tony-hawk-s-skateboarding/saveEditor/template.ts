import type { GameJson } from "$lib/types";

const template: GameJson = {
  validator: {
    regions: {
      europe: {
        0x0: [
          0x42, 0x45, 0x53, 0x4c, 0x45, 0x53, 0x2d, 0x30, 0x32, 0x30, 0x35,
          0x35, 0x54, 0x48, 0x50, 0x53, 0x47,
        ], // "BESLES-02055THPSG"
      },
      usa: {
        0x0: [
          0x42, 0x41, 0x53, 0x4c, 0x55, 0x53, 0x2d, 0x30, 0x30, 0x38, 0x36,
          0x30, 0x54, 0x48, 0x50, 0x53, 0x47,
        ], // "BASLUS-00860THPSG"
      },
      japan: {
        0x0: [
          0x42, 0x49, 0x53, 0x4c, 0x50, 0x4d, 0x2d, 0x38, 0x36, 0x34, 0x32,
          0x39, 0x54, 0x48, 0x50, 0x53, 0x47,
        ], // "BISLPM-86429THPSG"
      },
    },
    text: "Drag 'n' drop here or click to add a save file.",
    error: "Not a valid save file.",
  },
  items: [
    {
      id: "slots",
      length: 0x2000,
      type: "container",
      instanceType: "tabs",
      instances: 15,
      enumeration: "Slot %d",
      items: [
        {
          name: "Checksum",
          offset: 0x236,
          type: "checksum",
          dataType: "uint16",
          control: {
            offsetStart: 0x280,
            offsetEnd: 0xc80,
          },
        },
        {
          type: "tabs",
          items: [
            {
              name: "Carrer",
              items: [
                {
                  length: 0xe,
                  type: "container",
                  instanceType: "tabs",
                  instances: 11,
                  resource: "characters",
                  vertical: true,
                  items: [
                    {
                      type: "section",
                      flex: true,
                      items: [
                        {
                          name: "Tapes",
                          offset: 0x288,
                          type: "variable",
                          dataType: "uint8",
                          disabled: true,
                        },
                        {
                          id: "competition",
                          name: "Skate Park",
                          offset: 0x28f,
                          type: "variable",
                          dataType: "uint8",
                          resource: "medals",
                        },
                        {
                          id: "competition",
                          name: "Burnside",
                          offset: 0x292,
                          type: "variable",
                          dataType: "uint8",
                          resource: "medals",
                        },
                        {
                          id: "competition",
                          name: "Roswell",
                          offset: 0x294,
                          type: "variable",
                          dataType: "uint8",
                          resource: "medals",
                        },
                      ],
                    },
                    {
                      type: "section",
                      flex: true,
                      items: [
                        {
                          id: "tapes-0",
                          name: "Warehouse",
                          type: "bitflags",
                          flags: [
                            { offset: 0x28c, bit: 0, label: "5,000 Points" },
                            { offset: 0x28c, bit: 1, label: "Smash the Boxes" },
                            { offset: 0x28c, bit: 2, label: "Get S-K-A-T-E" },
                            { offset: 0x28c, bit: 3, label: "Hidden Tape" },
                            { offset: 0x28c, bit: 4, label: "15,000 Points" },
                            { offset: 0x28c, bit: 5, label: "???", hidden: true },
                            { offset: 0x28c, bit: 6, label: "???", hidden: true },
                            { offset: 0x28c, bit: 7, label: "???", hidden: true },
                          ],
                        },
                        {
                          id: "tapes-1",
                          name: "School",
                          type: "bitflags",
                          flags: [
                            { offset: 0x28d, bit: 0, label: "7,500 Points" },
                            { offset: 0x28d, bit: 1, label: "Grind 5 Tables" },
                            { offset: 0x28d, bit: 2, label: "Get S-K-A-T-E" },
                            { offset: 0x28d, bit: 3, label: "Hidden Tape" },
                            { offset: 0x28d, bit: 4, label: "25,000 Points" },
                            { offset: 0x28d, bit: 5, label: "???", hidden: true },
                            { offset: 0x28d, bit: 6, label: "???", hidden: true },
                            { offset: 0x28d, bit: 7, label: "???", hidden: true },
                          ],
                        },
                        {
                          id: "tapes-2",
                          name: "Mall",
                          type: "bitflags",
                          flags: [
                            { offset: 0x28e, bit: 0, label: "10,000 Points" },
                            { offset: 0x28e, bit: 1, label: "Destroy 5 Directories" },
                            { offset: 0x28e, bit: 2, label: "Get S-K-A-T-E" },
                            { offset: 0x28e, bit: 3, label: "Hidden Tape" },
                            { offset: 0x28e, bit: 4, label: "30,000 Points" },
                            { offset: 0x28e, bit: 5, label: "???", hidden: true },
                            { offset: 0x28e, bit: 6, label: "???", hidden: true },
                            { offset: 0x28e, bit: 7, label: "???", hidden: true },
                          ],
                        },
                        {
                          id: "tapes-4",
                          name: "Downtown",
                          type: "bitflags",
                          flags: [
                            { offset: 0x290, bit: 0, label: "15,000 Points" },
                            { offset: 0x290, bit: 1, label: "Break 5 No Skating Signs" },
                            { offset: 0x290, bit: 2, label: "Get S-K-A-T-E" },
                            { offset: 0x290, bit: 3, label: "Hidden Tape" },
                            { offset: 0x290, bit: 4, label: "40,000 Points" },
                            { offset: 0x290, bit: 5, label: "???", hidden: true },
                            { offset: 0x290, bit: 6, label: "???", hidden: true },
                            { offset: 0x290, bit: 7, label: "???", hidden: true },
                          ],
                        },
                        {
                          id: "tapes-5",
                          name: "Downhill Jam",
                          type: "bitflags",
                          flags: [
                            { offset: 0x291, bit: 0, label: "20,000 Points" },
                            { offset: 0x291, bit: 1, label: "Open 5 Valves" },
                            { offset: 0x291, bit: 2, label: "Get S-K-A-T-E" },
                            { offset: 0x291, bit: 3, label: "Hidden Tape" },
                            { offset: 0x291, bit: 4, label: "40,000 Points" },
                            { offset: 0x291, bit: 5, label: "???", hidden: true },
                            { offset: 0x291, bit: 6, label: "???", hidden: true },
                            { offset: 0x291, bit: 7, label: "???", hidden: true },
                          ],
                        },
                        {
                          id: "tapes-7",
                          name: "Streets",
                          type: "bitflags",
                          flags: [
                            { offset: 0x293, bit: 0, label: "25,000 Points" },
                            { offset: 0x293, bit: 1, label: "Wreck 5 Cop Cars" },
                            { offset: 0x293, bit: 2, label: "Get S-K-A-T-E" },
                            { offset: 0x293, bit: 3, label: "Hidden Tape" },
                            { offset: 0x293, bit: 4, label: "50,000 Points" },
                            { offset: 0x293, bit: 5, label: "???", hidden: true },
                            { offset: 0x293, bit: 6, label: "???", hidden: true },
                            { offset: 0x293, bit: 7, label: "???", hidden: true },
                          ],
                        },
                      ],
                    },
                    {
                      type: "section",
                      flex: true,
                      hidden: true,
                      items: [
                        {
                          name: "Skate Park",
                          type: "bitflags",
                          hidden: true,
                          flags: [
                            { offset: 0x28f, bit: 0, label: "???", hidden: true },
                            { offset: 0x28f, bit: 1, label: "???", hidden: true },
                            { offset: 0x28f, bit: 2, label: "???", hidden: true },
                            { offset: 0x28f, bit: 3, label: "???", hidden: true },
                            { offset: 0x28f, bit: 4, label: "???", hidden: true },
                            { offset: 0x28f, bit: 5, label: "Gold Medal" },
                            { offset: 0x28f, bit: 6, label: "Silver Medal" },
                            { offset: 0x28f, bit: 7, label: "Bronze Medal" },
                          ],
                        },
                        {
                          name: "Burnside",
                          type: "bitflags",
                          hidden: true,
                          flags: [
                            { offset: 0x292, bit: 0, label: "???", hidden: true },
                            { offset: 0x292, bit: 1, label: "???", hidden: true },
                            { offset: 0x292, bit: 2, label: "???", hidden: true },
                            { offset: 0x292, bit: 3, label: "???", hidden: true },
                            { offset: 0x292, bit: 4, label: "???", hidden: true },
                            { offset: 0x292, bit: 5, label: "Gold Medal" },
                            { offset: 0x292, bit: 6, label: "Silver Medal" },
                            { offset: 0x292, bit: 7, label: "Bronze Medal" },
                          ],
                        },
                        {
                          name: "Roswell",
                          type: "bitflags",
                          hidden: true,
                          flags: [
                            { offset: 0x294, bit: 0, label: "???", hidden: true },
                            { offset: 0x294, bit: 1, label: "???", hidden: true },
                            { offset: 0x294, bit: 2, label: "???", hidden: true },
                            { offset: 0x294, bit: 3, label: "???", hidden: true },
                            { offset: 0x294, bit: 4, label: "???", hidden: true },
                            { offset: 0x294, bit: 5, label: "Gold Medal" },
                            { offset: 0x294, bit: 6, label: "Silver Medal" },
                            { offset: 0x294, bit: 7, label: "Bronze Medal" },
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
                  length: 0x60,
                  type: "container",
                  instanceType: "tabs",
                  instances: 9,
                  resource: "courses",
                  vertical: true,
                  items: [
                    {
                      length: 0xc,
                      type: "container",
                      instanceType: "section",
                      instances: 8,
                      enumeration: "%o Place",
                      flex: true,
                      items: [
                        {
                          name: "Name",
                          offset: 0x324,
                          length: 0x3,
                          type: "variable",
                          dataType: "string",
                          letterDataType: "uint8",
                          fallback: 0x20,
                          regex: "[ A-Z]",
                          test: true,
                        },
                        {
                          name: "Character",
                          offset: 0x328,
                          type: "variable",
                          dataType: "uint8",
                          resource: "characters",
                        },
                        {
                          name: "Score",
                          offset: 0x32c,
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
              items: [
                {
                  type: "tabs",
                  vertical: true,
                  items: [
                    {
                      name: "Controls",
                      items: [
                        {
                          name: "Player 1",
                          type: "section",
                          flex: true,
                          noMargin: true,
                          items: [
                            {
                              name: "Triangle",
                              offset: 0xbd0,
                              type: "variable",
                              dataType: "uint8",
                              resource: "buttons",
                            },
                            {
                              name: "Square",
                              offset: 0xbd4,
                              type: "variable",
                              dataType: "uint8",
                              resource: "buttons",
                            },
                            {
                              name: "Circle",
                              offset: 0xbd8,
                              type: "variable",
                              dataType: "uint8",
                              resource: "buttons",
                            },
                            {
                              name: "Cross",
                              offset: 0xbdc,
                              type: "variable",
                              dataType: "uint8",
                              resource: "buttons",
                            },
                          ],
                        },
                        {
                          type: "section",
                          flex: true,
                          items: [
                            {
                              name: "Vibration",
                              offset: 0xbc8,
                              type: "variable",
                              dataType: "uint8",
                              resource: "optionBoolean",
                            },
                            {
                              name: "Autokick",
                              offset: 0xbc0,
                              type: "variable",
                              dataType: "uint8",
                              resource: "optionBoolean",
                            },
                          ],
                        },
                        {
                          name: "Player 2",
                          type: "section",
                          flex: true,
                          noMargin: true,
                          items: [
                            {
                              name: "Triangle",
                              offset: 0xbe0,
                              type: "variable",
                              dataType: "uint8",
                              resource: "buttons",
                            },
                            {
                              name: "Square",
                              offset: 0xbe4,
                              type: "variable",
                              dataType: "uint8",
                              resource: "buttons",
                            },
                            {
                              name: "Circle",
                              offset: 0xbe8,
                              type: "variable",
                              dataType: "uint8",
                              resource: "buttons",
                            },
                            {
                              name: "Cross",
                              offset: 0xbec,
                              type: "variable",
                              dataType: "uint8",
                              resource: "buttons",
                            },
                          ],
                        },
                        {
                          type: "section",
                          flex: true,
                          items: [
                            {
                              name: "Vibration",
                              offset: 0xbcc,
                              type: "variable",
                              dataType: "uint8",
                              resource: "optionBoolean",
                            },
                            {
                              name: "Autokick",
                              offset: 0xbc4,
                              type: "variable",
                              dataType: "uint8",
                              resource: "optionBoolean",
                            },
                          ],
                        },
                      ],
                    },
                    {
                      name: "Sound Levels",
                      flex: true,
                      items: [
                        {
                          name: "SFX Level",
                          offset: 0xab0,
                          type: "variable",
                          dataType: "uint8",
                          max: 12,
                        },
                        {
                          name: "Music Level",
                          offset: 0xab4,
                          type: "variable",
                          dataType: "uint8",
                          max: 12,
                        },
                      ],
                    },
                    {
                      name: "Miscellaneous",
                      flex: true,
                      items: [
                        {
                          name: "Trick Tips",
                          offset: 0xc34,
                          type: "variable",
                          dataType: "uint8",
                          resource: "optionBoolean",
                        },
                        {
                          name: "Score Display",
                          offset: 0xc38,
                          type: "variable",
                          dataType: "uint8",
                          resource: "optionBoolean",
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
  resources: {
    buttons: {
      0x0: "Grind/Slide",
      0x1: "Flip Trick",
      0x2: "Grab Trick",
      0x3: "Jump/Ollie",
    },
    characters: {
      0x0: "Tony Hawk",
      0x1: "Bob Burnquist",
      0x2: "Geoff Rowley",
      0x3: "Bucky Lasek",
      0x4: "Chad Muska",
      0x5: "Kareem Campbell",
      0x6: "Andrew Reynolds",
      0x7: "Rune Glifberg",
      0x8: "Jamie Thomas",
      0x9: "Elissa Steamer",
      0xa: "Officer Dick",
    },
    courses: {
      0x0: "Warehouse",
      0x1: "School",
      0x2: "Mall",
      0x3: "Skate Park",
      0x4: "Downtown",
      0x5: "Downhill Jam",
      0x6: "Burnside",
      0x7: "Streets",
      0x8: "Roswell",
    },
    medals: {
      0x0: "-",
      0x1: "Gold",
      0x2: "Silver",
      0x3: "Bronze",
    },
    optionBoolean: {
      0x0: "Off",
      0x1: "On",
    },
  },
  resourcesOrder: {
    medals: [0x0, 0x3, 0x2, 0x1],
  },
};

export default template;
