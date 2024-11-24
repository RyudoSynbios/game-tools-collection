import type { GameJson, ItemSection } from "$lib/types";

import { rankings } from "./resource";

const template: GameJson = {
  validator: {
    regions: {
      europe_australia: {},
      usa_japan: {},
    },
    text: "Drag 'n' drop here or click to add a save file.",
    error: "Not a valid save file.",
  },
  items: [
    {
      name: "Checksum",
      offset: 0xfe,
      type: "checksum",
      dataType: "uint16",
      control: {
        offsetStart: 0x0,
        offsetEnd: 0xfe,
      },
    },
    {
      type: "tabs",
      items: [
        {
          name: "Missions",
          items: [
            {
              type: "tabs",
              vertical: true,
              items: [
                {
                  name: "Mission 1",
                  flex: true,
                  items: [
                    {
                      name: "Corneria",
                      type: "bitflags",
                      flags: [
                        { offset: 0x9, bit: 2, label: "Played", separator: true },
                        { offset: 0x9, bit: 0, label: "Completed (Normal)" },
                        { offset: 0x9, bit: 1, label: "Medal Obtained (Normal)", separator: true },
                        { offset: 0x9, bit: 3, label: "Completed (Expert)" },
                        { offset: 0x9, bit: 4, label: "Medal Obtained (Expert)" },
                        { offset: 0x9, bit: 5, label: "???", hidden: true },
                        { offset: 0x9, bit: 6, label: "???", hidden: true },
                        { offset: 0x9, bit: 7, label: "???", hidden: true },
                      ],
                    },
                  ],
                },
                {
                  name: "Mission 2",
                  flex: true,
                  items: [
                    {
                      name: "Meteo",
                      type: "bitflags",
                      flags: [
                        { offset: 0x0, bit: 2, label: "Played", separator: true },
                        { offset: 0x0, bit: 0, label: "Completed (Normal)" },
                        { offset: 0x0, bit: 1, label: "Medal Obtained (Normal)", separator: true },
                        { offset: 0x0, bit: 3, label: "Completed (Expert)" },
                        { offset: 0x0, bit: 4, label: "Medal Obtained (Expert)" },
                        { offset: 0x0, bit: 5, label: "???", hidden: true },
                        { offset: 0x0, bit: 6, label: "???", hidden: true },
                        { offset: 0x0, bit: 7, label: "???", hidden: true },
                      ],
                    },
                    {
                      name: "Sector Y",
                      type: "bitflags",
                      flags: [
                        { offset: 0x5, bit: 2, label: "Played", separator: true },
                        { offset: 0x5, bit: 0, label: "Completed (Normal)" },
                        { offset: 0x5, bit: 1, label: "Medal Obtained (Normal)", separator: true },
                        { offset: 0x5, bit: 3, label: "Completed (Expert)" },
                        { offset: 0x5, bit: 4, label: "Medal Obtained (Expert)" },
                        { offset: 0x5, bit: 5, label: "???", hidden: true },
                        { offset: 0x5, bit: 6, label: "???", hidden: true },
                        { offset: 0x5, bit: 7, label: "???", hidden: true },
                      ],
                    },
                  ],
                },
                {
                  name: "Mission 3",
                  flex: true,
                  items: [
                    {
                      name: "Fortuna",
                      type: "bitflags",
                      flags: [
                        { offset: 0xc, bit: 2, label: "Played", separator: true },
                        { offset: 0xc, bit: 0, label: "Completed (Normal)" },
                        { offset: 0xc, bit: 1, label: "Medal Obtained (Normal)", separator: true },
                        { offset: 0xc, bit: 3, label: "Completed (Expert)" },
                        { offset: 0xc, bit: 4, label: "Medal Obtained (Expert)" },
                        { offset: 0xc, bit: 5, label: "???", hidden: true },
                        { offset: 0xc, bit: 6, label: "???", hidden: true },
                        { offset: 0xc, bit: 7, label: "???", hidden: true },
                      ],
                    },
                    {
                      name: "Katina",
                      type: "bitflags",
                      flags: [
                        { offset: 0x6, bit: 2, label: "Played", separator: true },
                        { offset: 0x6, bit: 0, label: "Completed (Normal)" },
                        { offset: 0x6, bit: 1, label: "Medal Obtained (Normal)", separator: true },
                        { offset: 0x6, bit: 3, label: "Completed (Expert)" },
                        { offset: 0x6, bit: 4, label: "Medal Obtained (Expert)" },
                        { offset: 0x6, bit: 5, label: "???", hidden: true },
                        { offset: 0x6, bit: 6, label: "???", hidden: true },
                        { offset: 0x6, bit: 7, label: "???", hidden: true },
                      ],
                    },
                    {
                      name: "Aquas",
                      type: "bitflags",
                      flags: [
                        { offset: 0xb, bit: 2, label: "Played", separator: true },
                        { offset: 0xb, bit: 0, label: "Completed (Normal)" },
                        { offset: 0xb, bit: 1, label: "Medal Obtained (Normal)", separator: true },
                        { offset: 0xb, bit: 3, label: "Completed (Expert)" },
                        { offset: 0xb, bit: 4, label: "Medal Obtained (Expert)" },
                        { offset: 0xb, bit: 5, label: "???", hidden: true },
                        { offset: 0xb, bit: 6, label: "???", hidden: true },
                        { offset: 0xb, bit: 7, label: "???", hidden: true },
                      ],
                    },
                  ],
                },
                {
                  name: "Mission 4",
                  flex: true,
                  items: [
                    {
                      name: "Sector X",
                      type: "bitflags",
                      flags: [
                        { offset: 0x4, bit: 2, label: "Played", separator: true },
                        { offset: 0x4, bit: 0, label: "Completed (Normal)" },
                        { offset: 0x4, bit: 1, label: "Medal Obtained (Normal)", separator: true },
                        { offset: 0x4, bit: 3, label: "Completed (Expert)" },
                        { offset: 0x4, bit: 4, label: "Medal Obtained (Expert)" },
                        { offset: 0x4, bit: 5, label: "???", hidden: true },
                        { offset: 0x4, bit: 6, label: "???", hidden: true },
                        { offset: 0x4, bit: 7, label: "???", hidden: true },
                      ],
                    },
                    {
                      name: "Solar",
                      type: "bitflags",
                      flags: [
                        { offset: 0xd, bit: 2, label: "Played", separator: true },
                        { offset: 0xd, bit: 0, label: "Completed (Normal)" },
                        { offset: 0xd, bit: 1, label: "Medal Obtained (Normal)", separator: true },
                        { offset: 0xd, bit: 3, label: "Completed (Expert)" },
                        { offset: 0xd, bit: 4, label: "Medal Obtained (Expert)" },
                        { offset: 0xd, bit: 5, label: "???", hidden: true },
                        { offset: 0xd, bit: 6, label: "???", hidden: true },
                        { offset: 0xd, bit: 7, label: "???", hidden: true },
                      ],
                    },
                    {
                      name: "Zoness",
                      type: "bitflags",
                      flags: [
                        { offset: 0x8, bit: 2, label: "Played", separator: true },
                        { offset: 0x8, bit: 0, label: "Completed (Normal)" },
                        { offset: 0x8, bit: 1, label: "Medal Obtained (Normal)", separator: true },
                        { offset: 0x8, bit: 3, label: "Completed (Expert)" },
                        { offset: 0x8, bit: 4, label: "Medal Obtained (Expert)" },
                        { offset: 0x8, bit: 5, label: "???", hidden: true },
                        { offset: 0x8, bit: 6, label: "???", hidden: true },
                        { offset: 0x8, bit: 7, label: "???", hidden: true },
                      ],
                    },
                  ],
                },
                {
                  name: "Mission 5",
                  flex: true,
                  items: [
                    {
                      name: "Titania",
                      type: "bitflags",
                      flags: [
                        { offset: 0xa, bit: 2, label: "Played", separator: true },
                        { offset: 0xa, bit: 0, label: "Completed (Normal)" },
                        { offset: 0xa, bit: 1, label: "Medal Obtained (Normal)", separator: true },
                        { offset: 0xa, bit: 3, label: "Completed (Expert)" },
                        { offset: 0xa, bit: 4, label: "Medal Obtained (Expert)" },
                        { offset: 0xa, bit: 5, label: "???", hidden: true },
                        { offset: 0xa, bit: 6, label: "???", hidden: true },
                        { offset: 0xa, bit: 7, label: "???", hidden: true },
                      ],
                    },
                    {
                      name: "Macbeth",
                      type: "bitflags",
                      flags: [
                        { offset: 0x7, bit: 2, label: "Played", separator: true },
                        { offset: 0x7, bit: 0, label: "Completed (Normal)" },
                        { offset: 0x7, bit: 1, label: "Medal Obtained (Normal)", separator: true },
                        { offset: 0x7, bit: 3, label: "Completed (Expert)" },
                        { offset: 0x7, bit: 4, label: "Medal Obtained (Expert)" },
                        { offset: 0x7, bit: 5, label: "???", hidden: true },
                        { offset: 0x7, bit: 6, label: "???", hidden: true },
                        { offset: 0x7, bit: 7, label: "???", hidden: true },
                      ],
                    },
                    {
                      name: "Sector Z",
                      type: "bitflags",
                      flags: [
                        { offset: 0x3, bit: 2, label: "Played", separator: true },
                        { offset: 0x3, bit: 0, label: "Completed (Normal)" },
                        { offset: 0x3, bit: 1, label: "Medal Obtained (Normal)", separator: true },
                        { offset: 0x3, bit: 3, label: "Completed (Expert)" },
                        { offset: 0x3, bit: 4, label: "Medal Obtained (Expert)" },
                        { offset: 0x3, bit: 5, label: "???", hidden: true },
                        { offset: 0x3, bit: 6, label: "???", hidden: true },
                        { offset: 0x3, bit: 7, label: "???", hidden: true },
                      ],
                    },
                  ],
                },
                {
                  name: "Mission 6",
                  flex: true,
                  items: [
                    {
                      name: "Bolse",
                      type: "bitflags",
                      flags: [
                        { offset: 0x2, bit: 2, label: "Played", separator: true },
                        { offset: 0x2, bit: 0, label: "Completed (Normal)" },
                        { offset: 0x2, bit: 1, label: "Medal Obtained (Normal)", separator: true },
                        { offset: 0x2, bit: 3, label: "Completed (Expert)" },
                        { offset: 0x2, bit: 4, label: "Medal Obtained (Expert)" },
                        { offset: 0x2, bit: 5, label: "???", hidden: true },
                        { offset: 0x2, bit: 6, label: "???", hidden: true },
                        { offset: 0x2, bit: 7, label: "???", hidden: true },
                      ],
                    },
                    {
                      name: "Area 6",
                      type: "bitflags",
                      flags: [
                        { offset: 0x1, bit: 2, label: "Played", separator: true },
                        { offset: 0x1, bit: 0, label: "Completed (Normal)" },
                        { offset: 0x1, bit: 1, label: "Medal Obtained (Normal)", separator: true },
                        { offset: 0x1, bit: 3, label: "Completed (Expert)" },
                        { offset: 0x1, bit: 4, label: "Medal Obtained (Expert)" },
                        { offset: 0x1, bit: 5, label: "???", hidden: true },
                        { offset: 0x1, bit: 6, label: "???", hidden: true },
                        { offset: 0x1, bit: 7, label: "???", hidden: true },
                      ],
                    },
                  ],
                },
                {
                  name: "Mission 7",
                  flex: true,
                  items: [
                    {
                      name: "Venom (Unused)",
                      type: "bitflags",
                      hidden: true,
                      flags: [
                        { offset: 0xe, bit: 2, label: "Played", separator: true },
                        { offset: 0xe, bit: 0, label: "Completed (Normal)" },
                        { offset: 0xe, bit: 1, label: "Medal Obtained (Normal)", separator: true },
                        { offset: 0xe, bit: 3, label: "Completed (Expert)" },
                        { offset: 0xe, bit: 4, label: "Medal Obtained (Expert)" },
                        { offset: 0xe, bit: 5, label: "???", hidden: true },
                        { offset: 0xe, bit: 6, label: "???", hidden: true },
                        { offset: 0xe, bit: 7, label: "???", hidden: true },
                      ],
                    },
                    {
                      name: "Venom",
                      type: "bitflags",
                      flags: [
                        { offset: 0xf, bit: 2, label: "Played", separator: true },
                        { offset: 0xf, bit: 0, label: "Completed (Normal)" },
                        { offset: 0xf, bit: 1, label: "Medal Obtained (Normal)", separator: true },
                        { offset: 0xf, bit: 3, label: "Completed (Expert)" },
                        { offset: 0xf, bit: 4, label: "Medal Obtained (Expert)" },
                        { offset: 0xf, bit: 5, label: "???", hidden: true },
                        { offset: 0xf, bit: 6, label: "???", hidden: true },
                        { offset: 0xf, bit: 7, label: "???", hidden: true },
                      ],
                    },
                  ],
                },
              ],
            },
          ],
        },
        {
          name: "Ranking",
          items: [
            {
              type: "tabs",
              vertical: true,
              items: [...Array(10).keys()].map((index) => ({
                name: rankings[index],
                items: [
                  {
                    type: "section",
                    flex: true,
                    items: [
                      {
                        name: "Name",
                        offset: 0x18 + index * 0x3,
                        length: 0x3,
                        type: "variable",
                        dataType: "string",
                        letterDataType: "uint8",
                        fallback: 0x41,
                        regex: "[.0-9A-Z]",
                        test: true,
                      },
                      {
                        id: `totalHits-${index}`,
                        name: "Total Hits",
                        offset: 0x36,
                        type: "variable",
                        dataType: "uint8",
                        disabled: true,
                      },
                      {
                        name: "Arwings Left",
                        offset: 0x40 + index,
                        type: "variable",
                        dataType: "uint8",
                        max: 99,
                      },
                      {
                        id: `totalAllies-${index}`,
                        name: "Total Allies",
                        offset: 0x36,
                        type: "variable",
                        dataType: "uint8",
                        disabled: true,
                      },
                    ],
                  },
                  {
                    type: "section",
                    flex: true,
                    items: [
                      {
                        name: "Completed Missions",
                        offset: 0x36 + index,
                        type: "variable",
                        dataType: "uint8",
                        min: 1,
                        max: 7,
                      },
                    ],
                  },
                  ...[...Array(7).keys()].map((missionIndex) => {
                    const offset = 0x5e + index * 0xe + missionIndex * 0x2;

                    return {
                      name: `Mission ${missionIndex + 1}`,
                      type: "section",
                      flex: true,
                      noMargin: true,
                      items: [
                        {
                          id: `planet-${0x36 + index}-${missionIndex}`,
                          name: "Planet",
                          offset: offset + 0x1,
                          type: "variable",
                          dataType: "uint8",
                          binary: { bitStart: 4, bitLength: 4 },
                          resource: "planets",
                          autocomplete: true,
                        },
                        {
                          id: `hits-${0x36 + index}-${missionIndex}`,
                          name: "Hits",
                          offset: offset,
                          type: "variable",
                          dataType: "uint8",
                          max: 511,
                        },
                        {
                          id: `bitflags-${0x36 + index}-${missionIndex}`,
                          type: "bitflags",
                          flags: [
                            { offset: 0x4b + index * 0x2, bit: missionIndex, label: "Medal obtained", separator: true },
                            { offset: offset + 0x1, bit: 0, label: "Slippy" },
                            { offset: offset + 0x1, bit: 1, label: "Fox" },
                            { offset: offset + 0x1, bit: 2, label: "Peppy" },
                            { offset: offset + 0x1, bit: 3, label: "Hits * 256", hidden: true },
                          ],
                        },
                      ],
                    } as ItemSection;
                  }),
                ],
              })),
            },
          ],
        },
        {
          name: "Config",
          items: [
            {
              name: "Sound",
              type: "section",
              flex: true,
              items: [
                {
                  name: "Mode",
                  offset: 0x14,
                  type: "variable",
                  dataType: "uint8",
                  resource: "soundModes",
                },
                {
                  name: "Music",
                  offset: 0x15,
                  type: "variable",
                  dataType: "uint8",
                  max: 99,
                },
                {
                  name: "Voice",
                  offset: 0x16,
                  type: "variable",
                  dataType: "uint8",
                  max: 99,
                },
                {
                  name: "SE",
                  offset: 0x17,
                  type: "variable",
                  dataType: "uint8",
                  max: 99,
                },
              ],
            },
            {
              name: "Language",
              type: "section",
              flex: true,
              hidden: [false, true],
              items: [
                {
                  name: "Language",
                  offset: 0xeb,
                  type: "variable",
                  dataType: "uint8",
                  resource: "languages",
                },
                {
                  name: "Voice",
                  offset: 0xec,
                  type: "variable",
                  dataType: "uint8",
                  resource: "voices",
                },
              ],
            },
          ],
        },
      ],
    },
  ],
  resources: {
    languages: {
      0x0: "English",
      0x1: "French",
      0x2: "German",
    },
    planets: {
      0x0: "Meteo",
      0x1: "Area 6",
      0x2: "Bolse",
      0x3: "Sector Z",
      0x4: "Sector X",
      0x5: "Sector Y",
      0x6: "Katina",
      0x7: "Macbeth",
      0x8: "Zoness",
      0x9: "Corneria",
      0xa: "Titania",
      0xb: "Aquas",
      0xc: "Fortuna",
      0xd: "Solar",
      0xe: "Venom",
    },
    soundModes: {
      0x0: "Stereo",
      0x1: "Mono",
      0x2: "Headphone",
    },
    voices: {
      0x0: "English",
      0x1: "Lylat",
    },
  },
  resourcesGroups: {
    planets: [
      { name: "Mission 1", options: [0x9] },
      { name: "Mission 2", options: [0x0, 0x5] },
      { name: "Mission 3", options: [0xc, 0x6, 0xb] },
      { name: "Mission 4", options: [0x4, 0xd, 0x8] },
      { name: "Mission 5", options: [0xa, 0x7, 0x3] },
      { name: "Mission 6", options: [0x2, 0x1] },
      { name: "Mission 7", options: [0xe] },
    ],
  },
  resourcesOrder: {
    planets: [
      0x9, 0x0, 0x5, 0xc, 0x6, 0xb, 0x4, 0xd, 0x8, 0xa, 0x7, 0x3, 0x2, 0x1, 0xe,
    ],
  },
};

export default template;
