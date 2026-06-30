import type { GameJson, ItemTabs } from "$lib/types";

import { timeFragment } from "./utils/fragment";
import { series } from "./utils/resource";

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
          offset: 0x8,
          type: "checksum",
          dataType: "uint32",
          control: {
            offsetStart: 0x10,
            offsetEnd: 0x8b0,
          },
        },
        {
          id: "checksum2",
          name: "Checksum 2",
          offset: 0xc,
          type: "checksum",
          dataType: "uint32",
          control: {
            offsetStart: 0x10,
            offsetEnd: 0x8b0,
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
              offset: 0x8b8,
              type: "checksum",
              dataType: "uint32",
              control: {
                offsetStart: 0x8c0,
                offsetEnd: 0xbe0,
              },
            },
            {
              id: "checksum2",
              name: "Checksum 2",
              offset: 0x8bc,
              type: "checksum",
              dataType: "uint32",
              control: {
                offsetStart: 0x8c0,
                offsetEnd: 0xbe0,
              },
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
                      offset: 0x1e,
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
                      offset: 0x8de,
                      type: "variable",
                      dataType: "uint8",
                      test: true,
                    },
                    {
                      name: "???",
                      offset: 0x8df,
                      type: "variable",
                      dataType: "uint8",
                      hidden: true,
                    },
                    // ? 0x8C7 | 0[3] | Unlocked Machines
                    // ? 0x8C7 | 5 | Jet Vermilion unlocked
                    // ? 0x8C7 | 6 | Queen Class unlocked
                    // ? 0x8C7 | 7 | Championship unlocked

                    // # Cleared Races

                    // # Pawn
                    // ? 0x8C8 | 0 | Pawn 1
                    // ? 0x8C8 | 1 | Pawn 2
                    // ? 0x8C8 | 2 | Pawn 3
                    // ? 0x8C8 | 3 | Pawn 4

                    // # Knight
                    // ? 0x8C8 | 4 | Knight 1
                    // ? 0x8C8 | 5 | Knight 2
                    // ? 0x8C8 | 6 | Knight 3
                    // ? 0x8C8 | 7 | Knight 4

                    // # Bishop
                    // ? 0x8C9 | 0 | Bishop 1
                    // ? 0x8C9 | 1 | Bishop 2
                    // ? 0x8C9 | 2 | Bishop 3
                    // ? 0x8C9 | 3 | Bishop 4

                    // # Queen
                    // ? 0x8C9 | 4 | Queen 1
                    // ? 0x8C9 | 5 | Queen 2
                    // ? 0x8C9 | 6 | Queen 3
                    // ? 0x8C9 | 7 | Queen 4

                    // # Cleared Series

                    // # Fire Ball

                    // # Pawn
                    // ? 0x8CA | 0 | Beginner
                    // ? 0x8CA | 1 | Standard
                    // ? 0x8CA | 2 | Expert
                    // ? 0x8CA | 3 | Master

                    // # Knight
                    // ? 0x8CA | 4 | Beginner
                    // ? 0x8CA | 5 | Standard
                    // ? 0x8CA | 6 | Expert
                    // ? 0x8CA | 7 | Master

                    // # Bishop
                    // ? 0x8CB | 0 | Beginner
                    // ? 0x8CB | 1 | Standard
                    // ? 0x8CB | 2 | Expert
                    // ? 0x8CB | 3 | Master

                    // # Queen
                    // ? 0x8CB | 4 | Beginner
                    // ? 0x8CB | 5 | Standard
                    // ? 0x8CB | 6 | Expert
                    // ? 0x8CB | 7 | Master

                    // # Sly Joker

                    // # Pawn
                    // ? 0x8CC | 0 | Beginner
                    // ? 0x8CC | 1 | Standard
                    // ? 0x8CC | 2 | Expert
                    // ? 0x8CC | 3 | Master

                    // # Knight
                    // ? 0x8CC | 4 | Beginner
                    // ? 0x8CC | 5 | Standard
                    // ? 0x8CC | 6 | Expert
                    // ? 0x8CC | 7 | Master

                    // # Bishop
                    // ? 0x8CD | 0 | Beginner
                    // ? 0x8CD | 1 | Standard
                    // ? 0x8CD | 2 | Expert
                    // ? 0x8CD | 3 | Master

                    // # Queen
                    // ? 0x8CD | 4 | Beginner
                    // ? 0x8CD | 5 | Standard
                    // ? 0x8CD | 6 | Expert
                    // ? 0x8CD | 7 | Master

                    // # Wind Walker

                    // # Pawn
                    // ? 0x8CE | 0 | Beginner
                    // ? 0x8CE | 1 | Standard
                    // ? 0x8CE | 2 | Expert
                    // ? 0x8CE | 3 | Master

                    // # Knight
                    // ? 0x8CE | 4 | Beginner
                    // ? 0x8CE | 5 | Standard
                    // ? 0x8CE | 6 | Expert
                    // ? 0x8CE | 7 | Master

                    // # Bishop
                    // ? 0x8CF | 0 | Beginner
                    // ? 0x8CF | 1 | Standard
                    // ? 0x8CF | 2 | Expert
                    // ? 0x8CF | 3 | Master

                    // # Queen
                    // ? 0x8CF | 4 | Beginner
                    // ? 0x8CF | 5 | Standard
                    // ? 0x8CF | 6 | Expert
                    // ? 0x8CF | 7 | Master

                    // # J.B.Crystal

                    // # Pawn
                    // ? 0x8D0 | 0 | Beginner
                    // ? 0x8D0 | 1 | Standard
                    // ? 0x8D0 | 2 | Expert
                    // ? 0x8D0 | 3 | Master

                    // # Knight
                    // ? 0x8D0 | 4 | Beginner
                    // ? 0x8D0 | 5 | Standard
                    // ? 0x8D0 | 6 | Expert
                    // ? 0x8D0 | 7 | Master

                    // # Bishop
                    // ? 0x8D1 | 0 | Beginner
                    // ? 0x8D1 | 1 | Standard
                    // ? 0x8D1 | 2 | Expert
                    // ? 0x8D1 | 3 | Master

                    // # Queen
                    // ? 0x8D1 | 4 | Beginner
                    // ? 0x8D1 | 5 | Standard
                    // ? 0x8D1 | 6 | Expert
                    // ? 0x8D1 | 7 | Master

                    // # Hot Violet

                    // # Pawn
                    // ? 0x8D2 | 0 | Beginner
                    // ? 0x8D2 | 1 | Standard
                    // ? 0x8D2 | 2 | Expert
                    // ? 0x8D2 | 3 | Master

                    // # Knight
                    // ? 0x8D2 | 4 | Beginner
                    // ? 0x8D2 | 5 | Standard
                    // ? 0x8D2 | 6 | Expert
                    // ? 0x8D2 | 7 | Master

                    // # Bishop
                    // ? 0x8D3 | 0 | Beginner
                    // ? 0x8D3 | 1 | Standard
                    // ? 0x8D3 | 2 | Expert
                    // ? 0x8D3 | 3 | Master

                    // # Queen
                    // ? 0x8D3 | 4 | Beginner
                    // ? 0x8D3 | 5 | Standard
                    // ? 0x8D3 | 6 | Expert
                    // ? 0x8D3 | 7 | Master

                    // # Falcon Mk-II

                    // # Pawn
                    // ? 0x8D4 | 0 | Beginner
                    // ? 0x8D4 | 1 | Standard
                    // ? 0x8D4 | 2 | Expert
                    // ? 0x8D4 | 3 | Master

                    // # Knight
                    // ? 0x8D4 | 4 | Beginner
                    // ? 0x8D4 | 5 | Standard
                    // ? 0x8D4 | 6 | Expert
                    // ? 0x8D4 | 7 | Master

                    // # Bishop
                    // ? 0x8D5 | 0 | Beginner
                    // ? 0x8D5 | 1 | Standard
                    // ? 0x8D5 | 2 | Expert
                    // ? 0x8D5 | 3 | Master

                    // # Queen
                    // ? 0x8D5 | 4 | Beginner
                    // ? 0x8D5 | 5 | Standard
                    // ? 0x8D5 | 6 | Expert
                    // ? 0x8D5 | 7 | Master

                    // # Silver Thunder

                    // # Pawn
                    // ? 0x8D6 | 0 | Beginner
                    // ? 0x8D6 | 1 | Standard
                    // ? 0x8D6 | 2 | Expert
                    // ? 0x8D6 | 3 | Master

                    // # Knight
                    // ? 0x8D6 | 4 | Beginner
                    // ? 0x8D6 | 5 | Standard
                    // ? 0x8D6 | 6 | Expert
                    // ? 0x8D6 | 7 | Master

                    // # Bishop
                    // ? 0x8D7 | 0 | Beginner
                    // ? 0x8D7 | 1 | Standard
                    // ? 0x8D7 | 2 | Expert
                    // ? 0x8D7 | 3 | Master

                    // # Queen
                    // ? 0x8D7 | 4 | Beginner
                    // ? 0x8D7 | 5 | Standard
                    // ? 0x8D7 | 6 | Expert
                    // ? 0x8D7 | 7 | Master

                    // # The Stringray

                    // # Pawn
                    // ? 0x8D8 | 0 | Beginner
                    // ? 0x8D8 | 1 | Standard
                    // ? 0x8D8 | 2 | Expert
                    // ? 0x8D8 | 3 | Master

                    // # Knight
                    // ? 0x8D8 | 4 | Beginner
                    // ? 0x8D8 | 5 | Standard
                    // ? 0x8D8 | 6 | Expert
                    // ? 0x8D8 | 7 | Master

                    // # Bishop
                    // ? 0x8D9 | 0 | Beginner
                    // ? 0x8D9 | 1 | Standard
                    // ? 0x8D9 | 2 | Expert
                    // ? 0x8D9 | 3 | Master

                    // # Queen
                    // ? 0x8D9 | 4 | Beginner
                    // ? 0x8D9 | 5 | Standard
                    // ? 0x8D9 | 6 | Expert
                    // ? 0x8D9 | 7 | Master

                    // # Fighting Comet

                    // # Pawn
                    // ? 0x8DA | 0 | Beginner
                    // ? 0x8DA | 1 | Standard
                    // ? 0x8DA | 2 | Expert
                    // ? 0x8DA | 3 | Master

                    // # Knight
                    // ? 0x8DA | 4 | Beginner
                    // ? 0x8DA | 5 | Standard
                    // ? 0x8DA | 6 | Expert
                    // ? 0x8DA | 7 | Master

                    // # Bishop
                    // ? 0x8DB | 0 | Beginner
                    // ? 0x8DB | 1 | Standard
                    // ? 0x8DB | 2 | Expert
                    // ? 0x8DB | 3 | Master

                    // # Queen
                    // ? 0x8DB | 4 | Beginner
                    // ? 0x8DB | 5 | Standard
                    // ? 0x8DB | 6 | Expert
                    // ? 0x8DB | 7 | Master

                    // # Jet Vermilion

                    // # Pawn
                    // ? 0x8DC | 0 | Beginner
                    // ? 0x8DC | 1 | Standard
                    // ? 0x8DC | 2 | Expert
                    // ? 0x8DC | 3 | Master

                    // # Knight
                    // ? 0x8DC | 4 | Beginner
                    // ? 0x8DC | 5 | Standard
                    // ? 0x8DC | 6 | Expert
                    // ? 0x8DC | 7 | Master

                    // # Bishop
                    // ? 0x8DD | 0 | Beginner
                    // ? 0x8DD | 1 | Standard
                    // ? 0x8DD | 2 | Expert
                    // ? 0x8DD | 3 | Master

                    // # Queen
                    // ? 0x8DD | 4 | Beginner
                    // ? 0x8DD | 5 | Standard
                    // ? 0x8DD | 6 | Expert
                    // ? 0x8DD | 7 | Master
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
                                ...timeFragment("Best Lap", 0xb56 + course.index * 0x3),
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
                                    ...timeFragment("Time", 0x8e0 + course.index * 0x1e),
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
              items: [
                // # Options
                // ? 0x8C6 | 0[4] | Controller
                // ? 0x8C6 | 4[3] | Lives
                // ? 0x8C6 | 7 | Music
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
                              offset: 0x7d1 + course.index * 0x6,
                              length: 0x8,
                              type: "variable",
                              dataType: "string",
                              letterDataType: "uint8",
                              resource: "letters",
                            },
                            ...timeFragment("Best Lap", 0x2a6 + course.index * 0x3),
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
                                  offset: 0x2e5 + course.index * 0x3c,
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
                                ...timeFragment("Time", 0x30 + course.index * 0x1e),
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
    machines: {
      0x0: "Fire Ball",
      0x1: "Sly Joker",
      0x2: "Wind Walker",
      0x3: "J.B.Crystal",
      0x4: "Hot Violet",
      0x5: "Falcon Mk-II",
      0x6: "Silver Thunder",
      0x7: "The Stringray",
      0x8: "Fighting Comet",
      0x9: "Jet Vermilion",
    },
  },
};

export default template;
