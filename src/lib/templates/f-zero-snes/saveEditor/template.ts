import type { GameJson } from "$lib/types";

const template: GameJson = {
  validator: {
    regions: {
      europe_usa_japan: {
        0x0: [0x46, 0x5a, 0x45, 0x52, 0x4f], // "FZERO"
      },
    },
    text: "Drag 'n' drop here or click to add a save file.",
    error: "Not a valid save file.",
  },
  items: [
    {
      length: 0xa7,
      type: "container",
      instanceType: "tabs",
      instances: 3,
      resource: "leagues",
      prependSubinstance: [
        {
          name: "General",
          flex: true,
          items: [
            {
              id: "masterClass",
              name: "Unlocked Master Class",
              type: "bitflags",
              flags: [
                { offset: 0x1fa, bit: 0, label: "Knight League" },
                { offset: 0x1fa, bit: 1, label: "Queen League" },
                { offset: 0x1fa, bit: 2, label: "King League" },
                { offset: 0x1fa, bit: 3, label: "???", hidden: true },
              ],
            },
            {
              name: "Checksum",
              type: "bitflags",
              hidden: true,
              flags: [
                { offset: 0x1fa, bit: 4, label: "Knight League" },
                { offset: 0x1fa, bit: 5, label: "Queen League" },
                { offset: 0x1fa, bit: 6, label: "King League" },
                { offset: 0x1fa, bit: 7, label: "???" },
              ],
            },
          ],
        },
      ],
      items: [
        {
          name: "Checksum",
          offset: 0xaa,
          type: "checksum",
          dataType: "uint16",
          control: {
            offsetStart: 0x5,
            offsetEnd: 0xaa,
          },
        },
        {
          length: 0x21,
          type: "container",
          instanceType: "tabs",
          instances: 5,
          resource: "courses%index%",
          vertical: true,
          items: [
            {
              type: "section",
              flex: true,
              items: [
                {
                  name: "Cleared",
                  offset: 0x23,
                  type: "variable",
                  dataType: "bit",
                  bit: 7,
                  hidden: true,
                },
                {
                  type: "group",
                  name: "Best Lap",
                  mode: "time",
                  items: [
                    {
                      id: "time-0",
                      offset: 0x23,
                      type: "variable",
                      dataType: "uint8",
                      binary: {
                        bitStart: 0,
                        bitLength: 4,
                      },
                      max: 9,
                    },
                    {
                      id: "time-1",
                      offset: 0x24,
                      type: "variable",
                      dataType: "uint8",
                      binaryCodedDecimal: true,
                      leadingZeros: 1,
                      max: 59,
                      test: true,
                    },
                    {
                      id: "time-2",
                      offset: 0x25,
                      type: "variable",
                      dataType: "uint8",
                      binaryCodedDecimal: true,
                      leadingZeros: 1,
                      max: 99,
                      test: true,
                    },
                  ],
                },
                {
                  id: "car",
                  name: "Car",
                  offset: 0x23,
                  type: "variable",
                  dataType: "uint8",
                  binary: {
                    bitStart: 4,
                    bitLength: 2,
                  },
                  resource: "cars",
                },
              ],
            },
            {
              length: 0x3,
              type: "container",
              instanceType: "section",
              instances: 10,
              enumeration: "%o Place",
              flex: true,
              items: [
                {
                  name: "Cleared",
                  offset: 0x5,
                  type: "variable",
                  dataType: "bit",
                  bit: 7,
                  hidden: true,
                },
                {
                  name: "Time",
                  type: "group",
                  mode: "time",
                  items: [
                    {
                      id: "time-0",
                      offset: 0x5,
                      type: "variable",
                      dataType: "uint8",
                      binary: {
                        bitStart: 0,
                        bitLength: 4,
                      },
                      max: 9,
                    },
                    {
                      id: "time-1",
                      offset: 0x6,
                      type: "variable",
                      dataType: "uint8",
                      binaryCodedDecimal: true,
                      leadingZeros: 1,
                      max: 59,
                    },
                    {
                      id: "time-2",
                      offset: 0x7,
                      type: "variable",
                      dataType: "uint8",
                      binaryCodedDecimal: true,
                      leadingZeros: 1,
                      max: 99,
                    },
                  ],
                },
                {
                  id: "car",
                  name: "Car",
                  offset: 0x5,
                  type: "variable",
                  dataType: "uint8",
                  binary: {
                    bitStart: 4,
                    bitLength: 2,
                  },
                  resource: "cars",
                },
              ],
            },
          ],
        },
      ],
    },
  ],
  resources: {
    cars: {
      0x0: "Blue Falcon",
      0x1: "Wild Goose",
      0x2: "Golden Fox",
      0x3: "Fire Stingray",
    },
    courses0: {
      0x0: "Mute City I",
      0x1: "Big Blue",
      0x2: "Sand Ocean",
      0x3: "Death Wind I",
      0x4: "Silence",
    },
    courses1: {
      0x0: "Mute City II",
      0x1: "Port Town I",
      0x2: "Red Canyon I",
      0x3: "White Land I",
      0x4: "White Land II",
    },
    courses2: {
      0x0: "Mute City III",
      0x1: "Death Wind II",
      0x2: "Port Town II",
      0x3: "Red Canyon II",
      0x4: "Fire Field",
    },
    empty: {
      0x0: "-",
    },
    leagues: {
      0x0: "Knight League",
      0x1: "Queen League",
      0x2: "King League",
    },
  },
};

export default template;
