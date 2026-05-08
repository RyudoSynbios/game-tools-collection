import { bitToOffset } from "$lib/utils/bytes";

import type { GameJson, ItemSection, ItemTab } from "$lib/types";

import { dungeons } from "./utils/resource";

const template: GameJson = {
  validator: {
    regions: {
      usa_japan: {
        0x0: [0x00, 0x5a], // ".Z"
      },
    },
    text: "Drag 'n' drop here or click to add a save file.",
    error: "Not a valid save file.",
  },
  items: [
    {
      length: 0x1b8,
      type: "container",
      instanceType: "tabs",
      instances: 3,
      enumeration: "Slot %s",
      disableSubinstanceIf: {
        offset: 0x1b2,
        type: "variable",
        dataType: "int8",
        operator: "=",
        value: 0x0,
      },
      items: [
        {
          name: "Checksum",
          offset: 0x1b8,
          type: "checksum",
          dataType: "uint16",
          bigEndian: true,
          control: {
            offsetStart: 0x2,
            offsetEnd: 0x1b6,
          },
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
                      name: "Name",
                      offset: 0x2,
                      length: 0x8,
                      type: "variable",
                      dataType: "string",
                      endCode: 0x24,
                      letterDataType: "uint8",
                      resource: "letters",
                      test: true,
                    },
                    {
                      name: "Mode",
                      offset: 0x1b2,
                      type: "variable",
                      dataType: "uint8",
                      resource: "modes",
                    },
                  ],
                },

                {
                  type: "section",
                  flex: true,
                  items: [
                    {
                      name: "Rupees",
                      offset: 0x20,
                      type: "variable",
                      dataType: "uint8",
                      max: 255,
                    },
                    {
                      name: "Keys",
                      offset: 0x21,
                      type: "variable",
                      dataType: "uint8",
                      max: 255,
                    },
                    {
                      name: "Hearts",
                      type: "group",
                      mode: "fraction",
                      items: [
                        {
                          id: "current-hearts",
                          offset: 0x22,
                          type: "variable",
                          dataType: "lower4",
                          max: 16,
                          operations: [{ "+": 1 }],
                        },
                        {
                          id: "max-hearts",
                          offset: 0x22,
                          type: "variable",
                          dataType: "upper4",
                          max: 16,
                          operations: [{ "+": 1 }],
                        },
                      ],
                    },
                    {
                      name: "Death Count",
                      offset: 0x1b4,
                      type: "variable",
                      dataType: "uint16",
                      max: 255,
                    },
                  ],
                },
              ],
            },
            {
              name: "Inventory",
              items: [
                {
                  type: "section",
                  flex: true,
                  items: [
                    {
                      name: "Items",
                      type: "section",
                      flex: true,
                      items: [
                        {
                          id: "item-sword",
                          name: "Sword",
                          offset: 0xa,
                          type: "variable",
                          dataType: "uint8",
                          resource: "swords",
                          autocomplete: true,
                        },
                        {
                          id: "item-arrows",
                          name: "Arrows",
                          offset: 0xc,
                          type: "variable",
                          dataType: "uint8",
                          resource: "arrows",
                          autocomplete: true,
                        },
                        {
                          id: "item-candle",
                          name: "Candle",
                          offset: 0xe,
                          type: "variable",
                          dataType: "uint8",
                          resource: "candles",
                          autocomplete: true,
                        },
                        {
                          id: "item-potion",
                          name: "Potion",
                          offset: 0x11,
                          type: "variable",
                          dataType: "uint8",
                          resource: "potions",
                          autocomplete: true,
                        },
                        {
                          id: "item-ring",
                          name: "Ring",
                          offset: 0x15,
                          type: "variable",
                          dataType: "uint8",
                          resource: "rings",
                          autocomplete: true,
                        },
                        {
                          id: "item-note",
                          name: "Note Ownership",
                          offset: 0x19,
                          type: "variable",
                          dataType: "uint8",
                          resource: "note",
                          autocomplete: true,
                        },
                      ],
                    },
                    {
                      type: "section",
                      flex: true,
                      items: [
                        {
                          type: "section",
                          background: true,
                          items: [
                            {
                              id: "item-bow",
                              name: "Bow",
                              offset: 0xd,
                              type: "variable",
                              dataType: "boolean",
                            },
                            {
                              id: "item-flute",
                              name: "Flute",
                              offset: 0xf,
                              type: "variable",
                              dataType: "boolean",
                            },
                            {
                              id: "item-bait",
                              name: "Bait",
                              offset: 0x10,
                              type: "variable",
                              dataType: "boolean",
                            },
                            {
                              id: "item-magic-wand",
                              name: "Magic Wand",
                              offset: 0x12,
                              type: "variable",
                              dataType: "boolean",
                            },
                            {
                              id: "item-raft",
                              name: "Raft",
                              offset: 0x13,
                              type: "variable",
                              dataType: "boolean",
                            },
                            {
                              id: "item-book-of-magic",
                              name: "Book of Magic",
                              offset: 0x14,
                              type: "variable",
                              dataType: "boolean",
                            },
                            {
                              id: "item-ladder",
                              name: "Ladder",
                              offset: 0x16,
                              type: "variable",
                              dataType: "boolean",
                            },
                            {
                              id: "item-magic-key",
                              name: "Magic Key",
                              offset: 0x17,
                              type: "variable",
                              dataType: "boolean",
                            },
                            {
                              id: "item-magic-boomerang",
                              name: "Power Bracelet",
                              offset: 0x18,
                              type: "variable",
                              dataType: "boolean",
                            },
                            {
                              id: "item-boomerang",
                              name: "Boomerang",
                              offset: 0x27,
                              type: "variable",
                              dataType: "boolean",
                            },
                            {
                              id: "item-magic-boomerang",
                              name: "Magic Boomerang",
                              offset: 0x28,
                              type: "variable",
                              dataType: "boolean",
                            },
                            {
                              id: "item-magic-shield",
                              name: "Magic Shield",
                              offset: 0x29,
                              type: "variable",
                              dataType: "boolean",
                            },
                          ],
                        },
                      ],
                    },
                    {
                      type: "section",
                      flex: true,
                      items: [
                        {
                          name: "Bombs",
                          type: "group",
                          mode: "fraction",
                          items: [
                            {
                              id: "bombs",
                              offset: 0xb,
                              type: "variable",
                              dataType: "uint8",
                            },
                            {
                              id: "maxBombs",
                              offset: 0x2f,
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
            },
            {
              name: "Dungeons",
              items: [
                {
                  type: "tabs",
                  vertical: true,
                  items: dungeons.map((dungeon) => {
                    const shift = bitToOffset(dungeon.index);
                    const bit = dungeon.index % 8;
                    return {
                      name: dungeon.name,
                      items: [
                        {
                          type: "section",
                          flex: true,
                          items: [
                            {
                              name: "Items",
                              type: "bitflags",
                              flags: [
                                { offset: 0x1a + shift, bit, label: "Map" },
                                { offset: 0x1b + shift, bit, label: "Compass" },
                                {
                                  offset: 0x24 + shift,
                                  bit,
                                  label: "Triforce",
                                },
                              ],
                            },
                          ],
                        },
                      ],
                    };
                  }),
                },
              ],
            },
          ],
        },
      ],
    },
  ],
  resources: {
    letters: {
      0x00: "0",
      0x01: "1",
      0x02: "2",
      0x03: "3",
      0x04: "4",
      0x05: "5",
      0x06: "6",
      0x07: "7",
      0x08: "8",
      0x09: "9",
      0x0a: "A",
      0x0b: "B",
      0x0c: "C",
      0x0d: "D",
      0x0e: "E",
      0x0f: "F",
      0x10: "G",
      0x11: "H",
      0x12: "I",
      0x13: "J",
      0x14: "K",
      0x15: "L",
      0x16: "M",
      0x17: "N",
      0x18: "O",
      0x19: "P",
      0x1a: "Q",
      0x1b: "R",
      0x1c: "S",
      0x1d: "T",
      0x1e: "U",
      0x1f: "V",
      0x20: "W",
      0x21: "X",
      0x22: "Y",
      0x23: "Z",
      0x24: " ",
    },
    modes: {
      0x0: "First Quest",
      0x1: "Second Quest",
    },
    swords: {
      0x0: "--",
      0x1: "Wooden Sword",
      0x2: "White Sword",
      0x3: "Master Sword",
    },
    arrows: {
      0x0: "--",
      0x1: "Wooden Arrows",
      0x2: "Silver Arrows",
    },
    candles: {
      0x0: "--",
      0x1: "Blue Candle",
      0x2: "Red Candle",
    },
    potions: {
      0x0: "--",
      0x1: "Blue Potion",
      0x2: "Red Potion",
    },
    rings: {
      0x0: "--",
      0x1: "Blue Ring",
      0x2: "Red Ring",
    },
    note: {
      0x0: "Old Man",
      0x1: "Link",
      0x2: "Old Woman",
    },
  },
};

export default template;
