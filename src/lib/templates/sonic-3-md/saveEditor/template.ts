import type { GameJson } from "$lib/types";

const template: GameJson = {
  validator: {
    regions: {
      europe_usa_japan: {
        $or: [{ 0x58: [0x4c, 0x44] }, { 0xe4: [0x4c, 0x44] }],
      },
    },
    text: "Drag 'n' drop here or click to add a save file.",
    error: "Not a valid save file.",
  },
  items: [
    {
      type: "tabs",
      items: [
        {
          name: "Sonic 3",
          disableTabIf: {
            $and: [
              {
                offset: 0xb4,
                type: "variable",
                dataType: "uint8",
                operator: "=",
                value: 0xff,
              },
              {
                offset: 0xbc,
                type: "variable",
                dataType: "uint8",
                operator: "=",
                value: 0xff,
              },
              {
                offset: 0xc4,
                type: "variable",
                dataType: "uint8",
                operator: "=",
                value: 0xff,
              },
              {
                offset: 0xcc,
                type: "variable",
                dataType: "uint8",
                operator: "=",
                value: 0xff,
              },
              {
                offset: 0xd4,
                type: "variable",
                dataType: "uint8",
                operator: "=",
                value: 0xff,
              },
              {
                offset: 0xdc,
                type: "variable",
                dataType: "uint8",
                operator: "=",
                value: 0xff,
              },
              {
                offset: 0xe4,
                type: "variable",
                dataType: "uint8",
                operator: "=",
                value: 0xff,
              },
              {
                offset: 0xe6,
                type: "variable",
                dataType: "uint8",
                operator: "=",
                value: 0xff,
              },
            ],
          },
          items: [
            {
              name: "Checksum",
              offset: 0xe6,
              type: "checksum",
              dataType: "uint16",
              bigEndian: true,
              control: {
                offsetStart: 0xb4,
                offsetEnd: 0xe6,
              },
            },
            {
              length: 0x8,
              type: "container",
              instanceType: "tabs",
              instances: 6,
              enumeration: "Slot %d",
              disableSubinstanceIf: {
                $or: [
                  {
                    offset: 0xb4,
                    type: "variable",
                    dataType: "uint8",
                    operator: "=",
                    value: 0x80,
                  },
                  {
                    offset: 0xb4,
                    type: "variable",
                    dataType: "uint8",
                    operator: "=",
                    value: 0xff,
                  },
                ],
              },
              items: [
                {
                  type: "section",
                  flex: true,
                  items: [
                    {
                      name: "Character",
                      offset: 0xb6,
                      type: "variable",
                      dataType: "uint8",
                      resource: "sonic3Characters",
                      test: true,
                    },
                    {
                      name: "Zone",
                      offset: 0xb7,
                      type: "variable",
                      dataType: "uint8",
                      resource: "sonic3Zones",
                      autocomplete: true,
                      test: true,
                    },
                    {
                      name: "Next Special Stage",
                      offset: 0xb8,
                      type: "variable",
                      dataType: "uint8",
                      operations: [{ "+": 1 }],
                      min: 1,
                      max: 7,
                    },
                    {
                      name: "Number of Chaos Emeralds",
                      offset: 0xb9,
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
                      id: "chaosEmeralds",
                      name: "Chaos Emeralds",
                      type: "bitflags",
                      flags: [
                        { offset: 0xba, bit: 7, label: "Green" },
                        { offset: 0xba, bit: 6, label: "Yellow" },
                        { offset: 0xba, bit: 5, label: "Purple" },
                        { offset: 0xba, bit: 4, label: "Blue" },
                        { offset: 0xba, bit: 3, label: "White" },
                        { offset: 0xba, bit: 2, label: "Red" },
                        { offset: 0xba, bit: 1, label: "Turquoise" },
                      ],
                    },
                    {
                      name: "Giant Rings Collected",
                      type: "bitflags",
                      flags: [
                        { offset: 0xbb, bit: 7, label: "Giant Ring 1" },
                        { offset: 0xbb, bit: 6, label: "Giant Ring 2" },
                        { offset: 0xbb, bit: 5, label: "Giant Ring 3" },
                        { offset: 0xbb, bit: 4, label: "Giant Ring 4" },
                        { offset: 0xbb, bit: 3, label: "Giant Ring 5" },
                        { offset: 0xbb, bit: 2, label: "Giant Ring 6" },
                        { offset: 0xbb, bit: 1, label: "Giant Ring 7" },
                        { offset: 0xbb, bit: 0, label: "Giant Ring 8" },
                      ],
                    },
                  ],
                },
              ],
            },
          ],
        },
        {
          name: "Sonic 3 & Knuckles",
          planned: true,
          items: [
            {
              name: "Checksum",
              offset: 0x192,
              type: "checksum",
              dataType: "uint16",
              bigEndian: true,
              control: {
                offsetStart: 0x140,
                offsetEnd: 0x192,
              },
            },
            {
              length: 0xa,
              type: "container",
              instanceType: "tabs",
              instances: 8,
              enumeration: "Slot %d",
              disableSubinstanceIf: {
                $or: [
                  {
                    offset: 0x140,
                    type: "variable",
                    dataType: "uint8",
                    operator: "=",
                    value: 0x80,
                  },
                  {
                    offset: 0x148,
                    type: "variable",
                    dataType: "uint8",
                    operator: "=",
                    value: 0x0,
                  },
                ],
              },
              items: [
                {
                  type: "section",
                  flex: true,
                  items: [
                    {
                      name: "Character",
                      offset: 0x142,
                      type: "variable",
                      dataType: "upper4",
                      resource: "sonic3KnucklesCharacters",
                      test: true,
                    },
                    {
                      name: "Zone",
                      offset: 0x143,
                      type: "variable",
                      dataType: "uint8",
                      resource: "sonic3KnucklesZones",
                      autocomplete: true,
                      test: true,
                    },
                    {
                      name: "Giant Rings Collected",
                      offset: 0x144,
                      type: "variable",
                      dataType: "uint8",
                    },
                    {
                      name: "Number of Chaos Emerald?",
                      offset: 0x142,
                      type: "variable",
                      dataType: "lower4",
                    },
                    {
                      name: "Chaos Emeralds?",
                      offset: 0x146,
                      type: "variable",
                      dataType: "uint8",
                    },
                    {
                      name: "Super Emeralds?",
                      offset: 0x147,
                      type: "variable",
                      dataType: "uint8",
                    },
                    {
                      name: "Lives",
                      offset: 0x148,
                      type: "variable",
                      dataType: "uint8",
                      min: 1,
                    },
                    {
                      name: "Continues",
                      offset: 0x149,
                      type: "variable",
                      dataType: "uint8",
                    },
                  ],
                },
              ],
            },
          ],
        },
        {
          name: "Competition",
          items: [
            {
              name: "Checksum",
              offset: 0x5a,
              type: "checksum",
              dataType: "uint16",
              bigEndian: true,
              control: {
                offsetStart: 0x8,
                offsetEnd: 0x5a,
              },
            },
            {
              length: 0x10,
              type: "container",
              instanceType: "tabs",
              instances: 5,
              resource: "courses",
              vertical: true,
              items: [
                {
                  name: "1st Place",
                  type: "section",
                  flex: true,
                  items: [
                    {
                      name: "Progression",
                      offset: 0x8,
                      type: "variable",
                      dataType: "uint8",
                      resource: "progressions",
                    },
                    {
                      name: "Character",
                      offset: 0x14,
                      type: "variable",
                      dataType: "uint8",
                      resource: "competitionCharacters",
                    },
                    {
                      name: "Time",
                      type: "group",
                      mode: "chrono",
                      items: [
                        {
                          offset: 0x9,
                          type: "variable",
                          dataType: "uint8",
                          max: 9,
                        },
                        {
                          offset: 0xa,
                          type: "variable",
                          dataType: "uint8",
                          max: 59,
                          leadingZeros: 1,
                        },
                        {
                          offset: 0xb,
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
                  name: "2nd Place",
                  type: "section",
                  flex: true,
                  items: [
                    {
                      name: "Progression",
                      offset: 0xc,
                      type: "variable",
                      dataType: "uint8",
                      resource: "progressions",
                    },
                    {
                      name: "Character",
                      offset: 0x15,
                      type: "variable",
                      dataType: "uint8",
                      resource: "competitionCharacters",
                    },
                    {
                      name: "Time",
                      type: "group",
                      mode: "chrono",
                      items: [
                        {
                          offset: 0xd,
                          type: "variable",
                          dataType: "uint8",
                          max: 9,
                        },
                        {
                          offset: 0xe,
                          type: "variable",
                          dataType: "uint8",
                          max: 59,
                          leadingZeros: 1,
                        },
                        {
                          offset: 0xf,
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
                  name: "3rd Place",
                  type: "section",
                  flex: true,
                  items: [
                    {
                      name: "Progression",
                      offset: 0x10,
                      type: "variable",
                      dataType: "uint8",
                      resource: "progressions",
                    },
                    {
                      name: "Character",
                      offset: 0x16,
                      type: "variable",
                      dataType: "uint8",
                      resource: "competitionCharacters",
                    },
                    {
                      name: "Time",
                      type: "group",
                      mode: "chrono",
                      items: [
                        {
                          offset: 0x11,
                          type: "variable",
                          dataType: "uint8",
                          max: 9,
                        },
                        {
                          offset: 0x12,
                          type: "variable",
                          dataType: "uint8",
                          max: 59,
                          leadingZeros: 1,
                        },
                        {
                          offset: 0x13,
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
      ],
    },
  ],
  resources: {
    competitionCharacters: {
      0x0: "Sonic ",
      0x1: "Tails",
      0x2: "Knuckles",
    },
    progressions: {
      0x0: "Cleared",
      0x80: "-",
    },
    courses: {
      0x0: "Azure Lake",
      0x1: "Balloon Park",
      0x2: "Desert Palace",
      0x3: "Chrome Gadget",
      0x4: "Endless Mine",
    },
    sonic3Characters: {
      0x0: "Sonic & Tails",
      0x1: "Sonic ",
      0x2: "Tails",
    },
    sonic3KnucklesCharacters: {
      0x0: "Sonic & Tails",
      0x1: "Sonic ",
      0x2: "Tails",
      0x3: "Knuckles",
    },
    sonic3KnucklesZones: {
      0x0: "Angel Island Zone",
      0x1: "Hydrocity Zone",
      0x2: "Marble Garden Zone",
      0x3: "Carnival Night Zone",
      0x4: "IceCap Zone",
      0x5: "Launch Base Zone",
      0x6: "Mushroom Hill Zone",
      0x7: "Flying Battery Zone",
      0x8: "Sandopolis Zone",
      0x9: "Lava Reef Zone",
      0xa: "Hidden Palace Zone",
      0xb: "Sky Sanctuary Zone",
      0xc: "Death Egg Zone",
      0xd: "The Doomsday Zone",
    },
    sonic3Zones: {
      0x0: "Angel Island Zone",
      0x1: "Hydrocity Zone",
      0x2: "Marble Garden Zone",
      0x3: "Carnival Night Zone",
      0x5: "IceCap Zone",
      0x6: "Launch Base Zone",
      0x7: "Clear",
    },
  },
  resourcesOrder: {
    progressions: [0x80],
  },
};

export default template;
