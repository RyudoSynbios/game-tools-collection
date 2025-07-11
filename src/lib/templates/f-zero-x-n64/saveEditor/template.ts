import type { GameJson } from "$lib/types";

const template: GameJson = {
  validator: {
    regions: {
      europe_usa_japan: {
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
                      name: "Machine",
                      offset: 0x110,
                      type: "variable",
                      dataType: "uint8",
                      hidden: true,
                    },
                    {
                      name: "Related to machine color/balance?",
                      offset: 0x118,
                      type: "variable",
                      dataType: "float32",
                      bigEndian: true,
                      hidden: true,
                    },
                    {
                      name: "Best Place Max Speed",
                      offset: 0x4c,
                      type: "variable",
                      dataType: "float32",
                      bigEndian: true,
                    },
                    {
                      name: "Best Lap",
                      offset: 0x50,
                      type: "variable",
                      dataType: "uint32",
                      bigEndian: true,
                    },
                  ],
                },
                {
                  name: "1st Place",
                  type: "section",
                  flex: true,
                  items: [
                    {
                      name: "Name",
                      offset: 0x54,
                      length: 0x3,
                      type: "variable",
                      dataType: "string",
                      letterDataType: "uint8",
                      zeroTerminated: true,
                      regex: "[ !',-.0-9A-Z]",
                    },
                    {
                      name: "Machine",
                      offset: 0x70,
                      type: "variable",
                      dataType: "uint8",
                    },
                    {
                      name: "Related to machine color/balance?",
                      offset: 0x78,
                      type: "variable",
                      dataType: "float32",
                      bigEndian: true,
                    },
                    {
                      name: "Balance",
                      offset: 0x38,
                      type: "variable",
                      dataType: "float32",
                      bigEndian: true,
                      min: 0,
                      max: 1,
                      step: 0.1,
                    },
                    {
                      name: "Time",
                      offset: 0x24,
                      type: "variable",
                      dataType: "uint32",
                      bigEndian: true,
                    },
                  ],
                },
                {
                  name: "2nd Place",
                  type: "section",
                  flex: true,
                  items: [
                    {
                      name: "Name",
                      offset: 0x58,
                      length: 0x3,
                      type: "variable",
                      dataType: "string",
                      letterDataType: "uint8",
                      zeroTerminated: true,
                      regex: "[ !',-.0-9A-Z]",
                    },
                    {
                      name: "Machine",
                      offset: 0x90,
                      type: "variable",
                      dataType: "uint8",
                    },
                    {
                      name: "Related to machine color/balance?",
                      offset: 0x98,
                      type: "variable",
                      dataType: "float32",
                      bigEndian: true,
                    },
                    {
                      name: "Balance",
                      offset: 0x3c,
                      type: "variable",
                      dataType: "float32",
                      bigEndian: true,
                      min: 0,
                      max: 1,
                      step: 0.1,
                    },
                    {
                      name: "Time",
                      offset: 0x28,
                      type: "variable",
                      dataType: "uint32",
                      bigEndian: true,
                    },
                  ],
                },
                {
                  name: "3rd Place",
                  type: "section",
                  flex: true,
                  items: [
                    {
                      name: "Machine",
                      offset: 0xb0,
                      type: "variable",
                      dataType: "uint8",
                    },
                    {
                      name: "Related to machine color/balance?",
                      offset: 0xb8,
                      type: "variable",
                      dataType: "float32",
                      bigEndian: true,
                    },
                    {
                      name: "Balance",
                      offset: 0x40,
                      type: "variable",
                      dataType: "float32",
                      bigEndian: true,
                      min: 0,
                      max: 1,
                      step: 0.1,
                    },
                    {
                      name: "Time",
                      offset: 0x2c,
                      type: "variable",
                      dataType: "uint32",
                      bigEndian: true,
                    },
                  ],
                },
                {
                  name: "4th Place",
                  type: "section",
                  flex: true,
                  items: [
                    {
                      name: "Machine",
                      offset: 0xd0,
                      type: "variable",
                      dataType: "uint8",
                    },
                    {
                      name: "Related to machine color/balance?",
                      offset: 0xd8,
                      type: "variable",
                      dataType: "float32",
                      bigEndian: true,
                    },
                    {
                      name: "Balance",
                      offset: 0x44,
                      type: "variable",
                      dataType: "float32",
                      bigEndian: true,
                      min: 0,
                      max: 1,
                      step: 0.1,
                    },
                    {
                      name: "Time",
                      offset: 0x30,
                      type: "variable",
                      dataType: "uint32",
                      bigEndian: true,
                    },
                  ],
                },
                {
                  name: "5th Place",
                  type: "section",
                  flex: true,
                  items: [
                    {
                      name: "Machine",
                      offset: 0xf0,
                      type: "variable",
                      dataType: "uint8",
                    },
                    {
                      name: "Related to machine color/balance?",
                      offset: 0xf8,
                      type: "variable",
                      dataType: "float32",
                      bigEndian: true,
                    },
                    {
                      name: "Balance",
                      offset: 0x48,
                      type: "variable",
                      dataType: "float32",
                      bigEndian: true,
                      min: 0,
                      max: 1,
                      step: 0.1,
                    },
                    {
                      name: "Time",
                      offset: 0x34,
                      type: "variable",
                      dataType: "uint32",
                      bigEndian: true,
                    },
                  ],
                },
              ],
            },
          ],
        },
        {
          name: "???",
          items: [
            {
              type: "section",
              flex: true,
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
                  name: "Balance",
                  offset: 0x7388,
                  type: "variable",
                  dataType: "float32",
                  bigEndian: true,
                },
              ],
            },
            {
              type: "section",
              flex: true,
              items: [
                {
                  name: "Related to Captain Falcon Joker Cup",
                  offset: 0x7f81,
                  type: "variable",
                  dataType: "uint8",
                },
                {
                  name: "Related to Captain Falcon Joker Cup",
                  offset: 0x7f91,
                  type: "variable",
                  dataType: "uint8",
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
    },
    progressions: {
      0x0: "-",
      0x1: "Novice",
      0x2: "Standard",
      0x3: "Expert",
      0x4: "Master",
    },
  },
};

export default template;
