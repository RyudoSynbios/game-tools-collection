import type { GameJson, ItemTab } from "$lib/types";

import { portals } from "./utils/resource";

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
                        {
                          id: "characterSection-%parent%-%index%-PCE1",
                          name: "Hungry Luma (Sweet Sweet Galaxy)",
                          offset: 0x1c,
                          type: "variable",
                          dataType: "uint16",
                          bigEndian: true,
                          hidden: true,
                        },
                      ],
                    },
                  ],
                },
                ...portals.map(
                  (portal) =>
                    ({
                      name: portal.name,
                      items: [
                        {
                          type: "tabs",
                          vertical: true,
                          items: portal.galaxies.map((galaxy) => {
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
                                      flags: [...Array(8).keys()].map(
                                        (index) => ({
                                          offset: offset + 0x24,
                                          bit: index,
                                          label:
                                            galaxy.missions[index]?.name ||
                                            "???",
                                          hidden: !galaxy.missions[index],
                                        }),
                                      ),
                                    },
                                    {
                                      id: "characterSection-%parent%-%index%-GALA",
                                      name: "Power Stars?",
                                      type: "bitflags",
                                      hidden: true,
                                      flags: [...Array(8).keys()].map(
                                        (index) => ({
                                          offset: offset + 0x25,
                                          bit: index,
                                          label:
                                            galaxy.missions[index]?.name ||
                                            "???",
                                          hidden: !galaxy.missions[index],
                                        }),
                                      ),
                                    },
                                  ],
                                },
                                {
                                  name: "Best Score",
                                  type: "section",
                                  flex: true,
                                  items: galaxy.missions.map(
                                    (mission, index) => ({
                                      id: "characterSection-%parent%-%index%-GALA",
                                      name: mission.name,
                                      offset: offset + 0x26 + index * 0x2,
                                      type: "variable",
                                      dataType: "uint16",
                                      bigEndian: true,
                                      max: 999,
                                    }),
                                  ),
                                },
                                ...(galaxy.missions.find(
                                  (mission) => mission.raceIndex !== undefined,
                                )
                                  ? [
                                      {
                                        name: "Best Race Times",
                                        type: "section",
                                        flex: true,
                                        items: galaxy.missions
                                          .filter(
                                            (mission) =>
                                              mission.raceIndex !== undefined,
                                          )
                                          .map((mission) => {
                                            const offset =
                                              0x12 + mission.raceIndex * 0x8;

                                            return {
                                              name: mission.name,
                                              type: "group",
                                              mode: "time",
                                              items: [
                                                {
                                                  id: "characterSection-%parent%-%index%-VLE1",
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
                                                  max: 17,
                                                },
                                                {
                                                  id: "characterSection-%parent%-%index%-VLE1",
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
                                                  id: "characterSection-%parent%-%index%-VLE1",
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
    },
  ],
  resources: {
    characters: {
      0x0: "Mario",
      0x1: "Luigi",
    },
    progression: {
      0x69: "-",
      0xe9: "Game Complete",
    },
  },
};

export default template;
