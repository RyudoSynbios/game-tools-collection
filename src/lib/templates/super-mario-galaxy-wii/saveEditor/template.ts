import type { GameJson, ItemTab } from "$lib/types";

import { galaxies } from "./utils/resource";

const template: GameJson = {
  validator: {
    fileNames: ["GameData.bin"],
    regions: {
      europe_usa_japan_australia: {
        0x10: [0x6d, 0x61, 0x72, 0x69, 0x6f, 0x31],
      }, // "mario1"
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
        offsetStart: 0x0,
        offsetEnd: 0xbe00,
      },
    },
    {
      id: "slots",
      length: 0x0,
      type: "container",
      instanceType: "tabs",
      instances: 6,
      enumeration: "Slot %d",
      items: [
        {
          length: 0x0,
          type: "container",
          instanceType: "tabs",
          instances: 2,
          resource: "characters",
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
                          id: "characterSection-%parent%-%index%-PLAY",
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
                          id: "characterSection-%parent%-%index%-FLG1",
                          name: "FLG1",
                          offset: 0x0,
                          length: 0x4,
                          type: "variable",
                          dataType: "string",
                          letterDataType: "uint8",
                          hidden: true,
                        },
                        {
                          id: "characterSection-%parent%-%index%-SPN1",
                          name: "SPN1",
                          offset: 0x0,
                          length: 0x4,
                          type: "variable",
                          dataType: "string",
                          letterDataType: "uint8",
                          hidden: true,
                        },
                        {
                          id: "characterSection-%parent%-%index%-VLE1",
                          name: "VLE1",
                          offset: 0x0,
                          length: 0x4,
                          type: "variable",
                          dataType: "string",
                          letterDataType: "uint8",
                          hidden: true,
                        },
                        {
                          id: "characterSection-%parent%-%index%-GALA",
                          name: "GALA",
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
                          id: "characterSection-%parent%-%index%-FLG1",
                          name: "Progression",
                          offset: 0x7a,
                          type: "variable",
                          dataType: "uint8",
                          resource: "progression",
                        },
                        {
                          id: "characterSection-%parent%-%index%-PLAY",
                          name: "Spin (0xf)",
                          offset: 0xc,
                          type: "variable",
                          dataType: "uint8",
                          hidden: true,
                        },
                        {
                          id: "characterSection-%parent%-%index%-PLAY",
                          name: "Lives",
                          offset: 0x11,
                          type: "variable",
                          dataType: "uint16",
                          bigEndian: true,
                          hidden: true,
                          test: true,
                        },
                        {
                          id: "characterSection-%parent%-%index%-PLAY",
                          name: "Star Bit",
                          offset: 0xf,
                          type: "variable",
                          dataType: "uint16",
                          bigEndian: true,
                          max: 9999,
                        },
                        {
                          id: "characterSection-%parent%-%index%-VLE1",
                          name: "Death Count",
                          offset: 0x52,
                          type: "variable",
                          dataType: "uint16",
                          bigEndian: true,
                          max: 9999,
                        },
                      ],
                    },
                  ],
                },
                ...galaxies.map((galaxy) => {
                  const offset = galaxy.index * 0x14;

                  return {
                    name: galaxy.name,
                    items: [
                      {
                        type: "section",
                        flex: true,
                        items: [
                          {
                            id: "characterSection-%parent%-%index%-GALA-powerStars",
                            name: "Power Stars",
                            type: "bitflags",
                            flags: [
                              { offset: offset + 0x24, bit: 0, label: galaxy.missions[0] || "???", hidden: !galaxy.missions[0] },
                              { offset: offset + 0x24, bit: 1, label: galaxy.missions[1] || "???", hidden: !galaxy.missions[1] },
                              { offset: offset + 0x24, bit: 2, label: galaxy.missions[2] || "???", hidden: !galaxy.missions[2] },
                              { offset: offset + 0x24, bit: 3, label: galaxy.missions[3] || "???", hidden: !galaxy.missions[3] },
                              { offset: offset + 0x24, bit: 4, label: galaxy.missions[4] || "???", hidden: !galaxy.missions[4] },
                              { offset: offset + 0x24, bit: 5, label: galaxy.missions[5] || "???", hidden: !galaxy.missions[5] },
                              { offset: offset + 0x24, bit: 6, label: galaxy.missions[6] || "???", hidden: !galaxy.missions[6] },
                              { offset: offset + 0x24, bit: 7, label: galaxy.missions[7] || "???", hidden: !galaxy.missions[7] },
                            ],
                          },
                          {
                            id: "characterSection-%parent%-%index%-GALA",
                            name: "Power Stars?",
                            type: "bitflags",
                            hidden: true,
                            flags: [
                              { offset: offset + 0x25, bit: 0, label: galaxy.missions[0] || "???", hidden: !galaxy.missions[0] },
                              { offset: offset + 0x25, bit: 1, label: galaxy.missions[1] || "???", hidden: !galaxy.missions[1] },
                              { offset: offset + 0x25, bit: 2, label: galaxy.missions[2] || "???", hidden: !galaxy.missions[2] },
                              { offset: offset + 0x25, bit: 3, label: galaxy.missions[3] || "???", hidden: !galaxy.missions[3] },
                              { offset: offset + 0x25, bit: 4, label: galaxy.missions[4] || "???", hidden: !galaxy.missions[4] },
                              { offset: offset + 0x25, bit: 5, label: galaxy.missions[5] || "???", hidden: !galaxy.missions[5] },
                              { offset: offset + 0x25, bit: 6, label: galaxy.missions[6] || "???", hidden: !galaxy.missions[6] },
                              { offset: offset + 0x25, bit: 7, label: galaxy.missions[7] || "???", hidden: !galaxy.missions[7] },
                            ],
                          },
                        ],
                      },
                      {
                        name: "Best Score",
                        type: "section",
                        flex: true,
                        items: galaxy.missions.map((mission, index) => ({
                          id: "characterSection-%parent%-%index%-GALA",
                          name: mission,
                          offset: offset + 0x26 + index * 0x2,
                          type: "variable",
                          dataType: "uint16",
                          bigEndian: true,
                          max: 999,
                        })),
                      },
                    ],
                  } as ItemTab;
                }),
              ],
            },
          ],
        },
      ],
    },
  ],
  resources: {
    characters: {
      0x0: "Mario",
      0x1: "Luigi",
    },
    progression: {
      0x69: "-",
      0xe9: "Game Cleared",
    },
  },
};

export default template;
