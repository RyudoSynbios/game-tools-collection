import type { GameJson, ItemTab } from "$lib/types";

import { worlds } from "./utils/resource";

const template: GameJson = {
  validator: {
    fileNames: ["GameData.bin"],
    regions: {
      europe_usa_japan_korea: {
        0x10: [0x75, 0x73, 0x65, 0x72, 0x31],
      }, // "user1"
    },
    text: "Drag 'n' drop here or click to add a save file.",
    hint: "Only works with decrypted saves (see FAQ).",
    error: "Not a valid save file.",
  },
  items: [
    {
      name: "Checksum",
      offset: 0x0,
      type: "checksum",
      dataType: "uint32",
      bigEndian: true,
      control: {
        offsetStart: 0x4,
        offsetEnd: 0x30a0,
      },
    },
    {
      id: "slots",
      length: 0x0,
      type: "container",
      instanceType: "tabs",
      instances: 3,
      enumeration: "Slot %d",
      items: [
        {
          type: "tabs",
          vertical: true,
          items: [
            {
              name: "General",
              items: [
                {
                  type: "section",
                  flex: true,
                  hidden: true,
                  items: [
                    {
                      id: "characterSection-%index%-PLAY",
                      name: "PLAY",
                      offset: 0x0,
                      length: 0x4,
                      type: "variable",
                      dataType: "string",
                      letterDataType: "uint8",
                      hidden: true,
                      test: true,
                    },
                    {
                      id: "characterSection-%index%-FLG1",
                      name: "FLG1",
                      offset: 0x0,
                      length: 0x4,
                      type: "variable",
                      dataType: "string",
                      letterDataType: "uint8",
                      hidden: true,
                    },
                    {
                      id: "characterSection-%index%-STF1",
                      name: "STF1",
                      offset: 0x0,
                      length: 0x4,
                      type: "variable",
                      dataType: "string",
                      letterDataType: "uint8",
                      hidden: true,
                    },
                    {
                      id: "characterSection-%index%-VLE1",
                      name: "VLE1",
                      offset: 0x0,
                      length: 0x4,
                      type: "variable",
                      dataType: "string",
                      letterDataType: "uint8",
                      hidden: true,
                    },
                    {
                      id: "characterSection-%index%-GALA",
                      name: "GALA",
                      offset: 0x0,
                      length: 0x4,
                      type: "variable",
                      dataType: "string",
                      letterDataType: "uint8",
                      hidden: true,
                    },
                    {
                      id: "characterSection-%index%-SSWM",
                      name: "SSWM",
                      offset: 0x0,
                      length: 0x4,
                      type: "variable",
                      dataType: "string",
                      letterDataType: "uint8",
                      hidden: true,
                    },
                  ],
                },
                {
                  type: "section",
                  flex: true,
                  items: [
                    {
                      id: "characterSection-%index%-FLG1",
                      name: "World Map unlocked",
                      offset: 0x2c,
                      type: "variable",
                      dataType: "bit",
                      bit: 7,
                      hidden: true,
                    },
                    {
                      id: "characterSection-%index%-FLG1-worldMap",
                      name: "Luigi",
                      offset: 0x6a,
                      type: "variable",
                      dataType: "bit",
                      bit: 7,
                      resource: "booleanUnlocked",
                    },
                    {
                      id: "characterSection-%index%-FLG1",
                      name: "Green Comets",
                      offset: 0x6e,
                      type: "variable",
                      dataType: "bit",
                      bit: 7,
                      resource: "booleanUnlocked",
                      hint: 'Green comets will only appear once the "Bowser\'s Fortified Fortress" Power Star has been obtained.',
                    },
                    {
                      id: "characterSection-%index%-FLG1",
                      name: "Grandmaster Galaxy unlocked",
                      offset: 0x72,
                      type: "variable",
                      dataType: "bit",
                      bit: 7,
                      hidden: true,
                    },
                  ],
                },
                {
                  type: "section",
                  flex: true,
                  items: [
                    {
                      id: "characterSection-%index%-PLAY",
                      name: "Lives",
                      offset: 0x24,
                      type: "variable",
                      dataType: "uint8",
                      hidden: true,
                      test: true,
                    },
                    {
                      id: "characterSection-%index%-PLAY",
                      name: "Star Bits",
                      offset: 0x25,
                      type: "variable",
                      dataType: "uint16",
                      bigEndian: true,
                      max: 9999,
                    },
                    {
                      id: "characterSection-%index%-PLAY",
                      name: "Coins",
                      offset: 0x27,
                      type: "variable",
                      dataType: "uint16",
                      bigEndian: true,
                      max: 9999,
                    },
                    {
                      id: "characterSection-%index%-VLE1",
                      name: "Death Count",
                      offset: 0x6e,
                      type: "variable",
                      dataType: "uint16",
                      bigEndian: true,
                      max: 9999,
                    },
                  ],
                },
                {
                  name: "Hungry Lumas",
                  type: "section",
                  flex: true,
                  items: [
                    {
                      id: "characterSection-%index%-STF1",
                      name: "World 1",
                      offset: 0xc,
                      type: "variable",
                      dataType: "uint16",
                      bigEndian: true,
                      max: 300,
                    },
                    {
                      id: "characterSection-%index%-STF1",
                      name: "World 2",
                      offset: 0x1a,
                      type: "variable",
                      dataType: "uint16",
                      bigEndian: true,
                      max: 700,
                    },
                    {
                      id: "characterSection-%index%-STF1",
                      name: "World 3",
                      offset: 0x24,
                      type: "variable",
                      dataType: "uint16",
                      bigEndian: true,
                      max: 1000,
                    },
                    {
                      id: "characterSection-%index%-STF1",
                      name: "World 4",
                      offset: 0x30,
                      type: "variable",
                      dataType: "uint16",
                      bigEndian: true,
                      max: 1200,
                    },
                    {
                      id: "characterSection-%index%-STF1",
                      name: "World 5",
                      offset: 0x3e,
                      type: "variable",
                      dataType: "uint16",
                      bigEndian: true,
                      max: 1500,
                    },
                    {
                      id: "characterSection-%index%-STF1",
                      name: "World 6",
                      offset: 0x48,
                      type: "variable",
                      dataType: "uint16",
                      bigEndian: true,
                      max: 1800,
                    },
                    {
                      id: "characterSection-%index%-STF1",
                      name: "World S",
                      offset: 0x54,
                      type: "variable",
                      dataType: "uint16",
                      bigEndian: true,
                      max: 2000,
                    },
                  ],
                },
                {
                  id: "characterSection-%index%-SSWM",
                  name: "Power Star Gates",
                  type: "bitflags",
                  hidden: true,
                  flags: [
                    { offset: 0xc, bit: 0, label: "3 Power Stars Gate open" },
                    { offset: 0xc, bit: 1, label: "7 Power Stars Gate open" },
                    { offset: 0xd, bit: 0, label: "16 Power Stars Gate open" },
                    { offset: 0xe, bit: 0, label: "28 Power Stars Gate open" },
                    { offset: 0xf, bit: 0, label: "40 Power Stars Gate open" },
                    { offset: 0x10, bit: 0, label: "55 Power Stars Gate open" },
                    { offset: 0x11, bit: 0, label: "60 Power Stars Gate open" },
                    { offset: 0x11, bit: 1, label: "65 Power Stars Gate open" },
                    { offset: 0x11, bit: 2, label: "70 Power Stars Gate open" },
                    { offset: 0x12, bit: 0, label: "75 Power Stars Gate open" },
                    { offset: 0x12, bit: 1, label: "80 Power Stars Gate open" },
                    { offset: 0x12, bit: 2, label: "90 Power Stars Gate open" },
                    { offset: 0x12, bit: 3, label: "100 Power Stars Gate open" },
                    { offset: 0x12, bit: 4, label: "110 Power Stars Gate open" },
                  ],
                },
              ],
            },
            ...worlds.map(
              (world) =>
                ({
                  name: world.name,
                  items: [
                    {
                      type: "tabs",
                      vertical: true,
                      items: world.galaxies.map((galaxy) => {
                        let offset = galaxy.offset;

                        return {
                          name: galaxy.name,
                          items: [
                            {
                              id: `characterSection-%index%-GALA-events-${galaxy.offset}`,
                              name: "Events",
                              type: "bitflags",
                              flags: [
                                { offset: offset + 0x5, bit: 1, label: "Galaxy unlocked" },
                                { offset: offset + 0x6, bit: 0, label: "Comet Medal obtained" },
                              ],
                            },
                            {
                              type: "section",
                              flex: true,
                              items: [
                                {
                                  id: "characterSection-%index%-GALA-worldMap",
                                  name: "Power Stars",
                                  type: "bitflags",
                                  flags: galaxy.missions.map(
                                    (mission, index) => ({
                                      offset: offset + 0xc + index * 0x6,
                                      bit: 0,
                                      label: mission.name,
                                    }),
                                  ),
                                },
                                {
                                  id: "characterSection-%index%-GALA",
                                  name: "Bronze Power Stars",
                                  type: "bitflags",
                                  hint: "Should not be checked.",
                                  flags: galaxy.missions.map(
                                    (mission, index) => ({
                                      offset: offset + 0xc + index * 0x6,
                                      bit: 1,
                                      label: mission.name,
                                    }),
                                  ),
                                },
                              ],
                            },
                            {
                              name: "Clear Time",
                              type: "section",
                              flex: true,
                              items: galaxy.missions.map((mission, index) => ({
                                name: mission.name,
                                type: "group",
                                mode: "time",
                                items: [
                                  {
                                    id: "characterSection-%index%-GALA",
                                    offset: offset + 0x8 + index * 0x6,
                                    type: "variable",
                                    dataType: "uint32",
                                    bigEndian: true,
                                    operations: [
                                      { "/": 60 },
                                      {
                                        convert: {
                                          from: "seconds",
                                          to: "minutes",
                                        },
                                      },
                                    ],
                                    leadingZeros: 1,
                                    max: 59,
                                  },
                                  {
                                    id: "characterSection-%index%-GALA",
                                    offset: offset + 0x8 + index * 0x6,
                                    type: "variable",
                                    dataType: "uint32",
                                    bigEndian: true,
                                    operations: [
                                      { "/": 60 },
                                      {
                                        convert: {
                                          from: "seconds",
                                          to: "seconds",
                                        },
                                      },
                                    ],
                                    leadingZeros: 1,
                                    max: 59,
                                  },
                                  {
                                    id: "characterSection-%index%-GALA",
                                    offset: offset + 0x8 + index * 0x6,
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
                                      { round: 0 },
                                    ],
                                    leadingZeros: 2,
                                    max: 999,
                                    step: 100,
                                  },
                                ],
                              })),
                            },
                            ...(galaxy.missions.find(
                              (mission) => mission.challengeIndex !== undefined,
                            )
                              ? [
                                  {
                                    name: "High Score",
                                    type: "section",
                                    flex: true,
                                    items: galaxy.missions
                                      .filter(
                                        (mission) =>
                                          mission.challengeIndex !== undefined,
                                      )
                                      .map((mission) => {
                                        const offset =
                                          0xe + mission.challengeIndex * 0x8;

                                        if (mission.challengeIndex >= 0x2) {
                                          return {
                                            id: "characterSection-%index%-VLE1-record",
                                            name: mission.name,
                                            offset,
                                            type: "variable",
                                            dataType: "uint16",
                                            bigEndian: true,
                                            max: 999999,
                                          };
                                        }

                                        return {
                                          name: mission.name,
                                          type: "group",
                                          mode: "time",
                                          items: [
                                            {
                                              id: "characterSection-%index%-VLE1-record",
                                              offset,
                                              type: "variable",
                                              dataType: "uint16",
                                              bigEndian: true,
                                              operations: [
                                                { "/": 60 },
                                                {
                                                  convert: {
                                                    from: "seconds",
                                                    to: "minutes",
                                                  },
                                                },
                                              ],
                                              leadingZeros: 1,
                                              max: 59,
                                            },
                                            {
                                              id: "characterSection-%index%-VLE1-record",
                                              offset,
                                              type: "variable",
                                              dataType: "uint16",
                                              bigEndian: true,
                                              operations: [
                                                { "/": 60 },
                                                {
                                                  convert: {
                                                    from: "seconds",
                                                    to: "seconds",
                                                  },
                                                },
                                              ],
                                              leadingZeros: 1,
                                              max: 59,
                                            },
                                            {
                                              id: "characterSection-%index%-VLE1-record",
                                              offset,
                                              type: "variable",
                                              dataType: "uint16",
                                              bigEndian: true,
                                              operations: [
                                                { "/": 60 },
                                                {
                                                  convert: {
                                                    from: "seconds",
                                                    to: "milliseconds",
                                                  },
                                                },
                                                { round: 0 },
                                              ],
                                              leadingZeros: 2,
                                              max: 999,
                                              step: 100,
                                            },
                                          ],
                                        };
                                      }),
                                  },
                                ]
                              : []),
                          ],
                        };
                      }),
                    },
                  ],
                }) as ItemTab,
            ),
          ],
        },
      ],
    },
  ],
  resources: {
    booleanUnlocked: {
      0x0: "-",
      0x1: "Unlocked",
    },
  },
};

export default template;
