import type { GameJson } from "$lib/types";

import { worlds } from "./utils/resource";

const template: GameJson = {
  validator: {
    regions: {
      europe_usa: {
        0xc: [
          0x41, 0x47, 0x42, 0x57, 0x61, 0x72, 0x69, 0x6f, 0x4c, 0x61, 0x6e,
          0x64,
        ], // "AGBWarioLand"
      },
      japan: {
        0xc: [
          0x57, 0x41, 0x52, 0x49, 0x4f, 0x4c, 0x41, 0x4e, 0x44, 0x4e, 0x49,
          0x50, 0x50, 0x4f, 0x4e,
        ], // "WARIOLANDNIPPON"
      },
    },
    text: "Drag 'n' drop here or click to add a save file.",
    hint: "Compatible with Castlevania Advance Collection.",
    error: "Not a valid save file.",
  },
  items: [
    {
      length: 0x400,
      type: "container",
      instanceType: "tabs",
      instances: 2,
      enumeration: "Slot %d",
      disableSubinstanceIf: {
        offset: 0x100,
        type: "variable",
        dataType: "uint8",
        operator: "=",
        value: 0x0,
      },
      prependSubinstance: [
        {
          name: "System",
          items: [
            {
              type: "section",
              flex: true,
              hidden: true,
              items: [
                {
                  id: "checksum1",
                  name: "Checksum",
                  offset: 0x0,
                  type: "checksum",
                  dataType: "uint32",
                  control: {
                    offsetStart: 0x8,
                    offsetEnd: 0x40,
                  },
                },
                {
                  id: "checksum2",
                  name: "Checksum",
                  offset: 0x4,
                  type: "checksum",
                  dataType: "uint32",
                  control: {
                    offsetStart: 0x8,
                    offsetEnd: 0x40,
                  },
                },
              ],
            },
            {
              name: "Super Hard Mode",
              offset: 0xa,
              type: "variable",
              dataType: "bit",
              bit: 0,
              resource: "booleanUnlocked",
            },
          ],
        },
      ],
      items: [
        {
          type: "section",
          flex: true,
          hidden: true,
          items: [
            {
              id: "checksum1",
              name: "Checksum",
              offset: 0x110,
              type: "checksum",
              dataType: "uint32",
              control: {
                offsetStart: 0x100,
                offsetEnd: 0x2e0,
              },
            },
            {
              id: "checksum2",
              name: "Checksum",
              offset: 0x114,
              type: "checksum",
              dataType: "uint32",
              control: {
                offsetStart: 0x100,
                offsetEnd: 0x2e0,
              },
            },
          ],
        },
        {
          type: "tabs",
          items: [
            {
              name: "General",
              flex: true,
              items: [
                {
                  name: "Difficulty",
                  offset: 0x118,
                  type: "variable",
                  dataType: "uint8",
                  resource: "difficulties",
                },
                {
                  name: "Money",
                  offset: 0x120,
                  type: "variable",
                  dataType: "uint32",
                  operations: [{ "*": 10 }],
                  max: 999990,
                  step: 10,
                  test: true,
                },
                {
                  name: "Medals",
                  offset: 0x11c,
                  type: "variable",
                  dataType: "uint16",
                  max: 999,
                },
              ],
            },
            {
              name: "Levels",
              items: [
                {
                  type: "tabs",
                  vertical: true,
                  items: worlds.map((world, index) => ({
                    name: world.name,
                    flex: true,
                    items: world.levels.map((level) => {
                      const offset = index * 0x18 + level.index * 0x4;
                      const hidden = [0x0, 0x5].includes(index);

                      if (level.boss) {
                        return {
                          type: "section",
                          items: [
                            {
                              name: level.name,
                              type: "bitflags",
                              flags: [
                                { offset: 0x124 + offset, bit: 0, label: "Chest 1", hidden },
                                { offset: 0x124 + offset, bit: 1, label: "Chest 2", hidden },
                                { offset: 0x124 + offset, bit: 2, label: "Chest 3", separator: true, hidden },
                                { offset: 0x124 + offset, bit: 3, label: "???", hidden: true },
                                { offset: 0x124 + offset, bit: 4, label: "???", hidden: true },
                                { offset: 0x124 + offset, bit: 5, label: "Boss defeated" },
                                { offset: 0x124 + offset, bit: 6, label: "???", hidden: true },
                                { offset: 0x124 + offset, bit: 7, label: "???", hidden: true },
                              ],
                            },
                          ],
                        };
                      }

                      return {
                        type: "section",
                        items: [
                          {
                            name: level.name,
                            type: "bitflags",
                            flags: [
                              { offset: 0x124 + offset, bit: 0, label: "Jewel Piece 1" },
                              { offset: 0x124 + offset, bit: 1, label: "Jewel Piece 2" },
                              { offset: 0x124 + offset, bit: 2, label: "Jewel Piece 3" },
                              { offset: 0x124 + offset, bit: 3, label: "Jewel Piece 4", separator: true },
                              { offset: 0x124 + offset, bit: 4, label: "CD", separator: true, hidden },
                              { offset: 0x124 + offset, bit: 5, label: "Keyzer" },
                              { offset: 0x124 + offset, bit: 6, label: "???", hidden: true },
                              { offset: 0x124 + offset, bit: 7, label: "???", hidden: true },
                            ],
                          },
                          {
                            name: "Best Score",
                            offset: 0x1cc + index * 0x10 + level.index * 0x4,
                            type: "variable",
                            dataType: "uint32",
                            operations: [{ "*": 10 }],
                            max: 999990,
                            step: 10,
                          },
                        ],
                      };
                    }),
                  })),
                },
              ],
            },
            {
              name: "Mini-Games",
              flex: true,
              items: [
                {
                  name: "Wario's Homerun Derby",
                  offset: 0x23c,
                  type: "variable",
                  dataType: "uint16",
                  max: 999,
                },
                {
                  name: "The Wario Hop",
                  offset: 0x23e,
                  type: "variable",
                  dataType: "uint16",
                  max: 999,
                },
                {
                  name: "Wario's Roulette",
                  offset: 0x240,
                  type: "variable",
                  dataType: "uint16",
                  max: 999,
                },
              ],
            },
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
    difficulties: {
      0x0: "Normal",
      0x1: "Hard",
      0x2: "S-Hard",
    },
  },
};

export default template;
