import type { GameJson } from "$lib/types";

import romTemplate from "../romEditor/template";

const template: GameJson = {
  validator: romTemplate.validator,
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
              items: [
                {
                  name: "Seed",
                  dataViewAltKey: "randomizer",
                  offset: 0x0,
                  type: "variable",
                  dataType: "uint32",
                  button: {
                    label: "New",
                    action: "generateSeed()",
                  },
                },
                {
                  name: "Preset",
                  dataViewAltKey: "randomizer",
                  offset: 0x0,
                  type: "variable",
                  dataType: "uint8",
                  resource: "modes",
                  button: {
                    label: "Apply",
                    action: "applyPreset(%value%)",
                  },
                  uncontrolled: true,
                },
              ],
            },
            {
              type: "section",
              flex: true,
              hidden: true,
              items: [
                {
                  name: "Moon Stones Obtention",
                  dataViewAltKey: "randomizer",
                  offset: 0x4,
                  type: "variable",
                  dataType: "uint8",
                  resource: "modes",
                  hidden: true,
                },
              ],
            },
          ],
        },
        {
          name: "Party",
          flex: true,
          items: [
            {
              name: "Stats",
              dataViewAltKey: "randomizer",
              offset: 0x10,
              type: "variable",
              dataType: "uint8",
              resource: "randomizes",
            },
            {
              name: "Initial Equipment",
              dataViewAltKey: "randomizer",
              offset: 0x11,
              type: "variable",
              dataType: "uint8",
              resource: "vanillaRandomize",
            },
            {
              name: "Initial Moon Stone",
              dataViewAltKey: "randomizer",
              offset: 0x12,
              type: "variable",
              dataType: "uint8",
              resource: "modes",
              hidden: true,
            },
          ],
        },
        {
          name: "Abilities",
          items: [
            {
              name: "Magic",
              type: "section",
              flex: true,
              items: [
                {
                  name: "Effects Value",
                  dataViewAltKey: "randomizer",
                  offset: 0x20,
                  type: "variable",
                  dataType: "uint8",
                  resource: "randomizes",
                  hint: "Descriptions will not change.",
                },
                {
                  name: "Required Ranks",
                  dataViewAltKey: "randomizer",
                  offset: 0x21,
                  type: "variable",
                  dataType: "uint8",
                  resource: "vanillaShuffleRandomize",
                },
              ],
            },
            {
              name: "Super Moves",
              type: "section",
              flex: true,
              items: [
                {
                  name: "Effects Value",
                  dataViewAltKey: "randomizer",
                  offset: 0x22,
                  type: "variable",
                  dataType: "uint8",
                  resource: "randomizes",
                  hint: "Descriptions will not change.",
                },
                {
                  name: "Required Moonberries",
                  dataViewAltKey: "randomizer",
                  offset: 0x23,
                  type: "variable",
                  dataType: "uint8",
                  resource: "vanillaShuffleRandomize",
                },
              ],
            },
          ],
        },
        {
          name: "Items",
          flex: true,
          items: [
            {
              name: "Stats",
              dataViewAltKey: "randomizer",
              offset: 0x30,
              type: "variable",
              dataType: "uint8",
              resource: "randomizes",
              hint: "Descriptions will not change.",
            },
            {
              name: "Effects",
              dataViewAltKey: "randomizer",
              offset: 0x31,
              type: "variable",
              dataType: "uint8",
              resource: "vanillaRandomize",
              hint: "Descriptions will not change.",
            },
            {
              name: "Prices",
              dataViewAltKey: "randomizer",
              offset: 0x32,
              type: "variable",
              dataType: "uint8",
              resource: "randomizes",
            },
          ],
        },
        {
          name: "Ships",
          flex: true,
          items: [
            {
              name: "Stats",
              dataViewAltKey: "randomizer",
              offset: 0x40,
              type: "variable",
              dataType: "uint8",
              resource: "randomizes",
            },
          ],
        },
        {
          name: "Crew",
          flex: true,
          hidden: true,
          items: [
            {
              name: "Stats",
              dataViewAltKey: "randomizer",
              offset: 0x50,
              type: "variable",
              dataType: "uint8",
              resource: "randomizes",
              hidden: true,
            },
          ],
        },
        {
          name: "Enemies",
          flex: true,
          items: [
            {
              name: "Stats",
              dataViewAltKey: "randomizer",
              offset: 0x60,
              type: "variable",
              dataType: "uint8",
              resource: "randomizes",
            },
            {
              name: "Experience / Gold",
              dataViewAltKey: "randomizer",
              offset: 0x61,
              type: "variable",
              dataType: "uint8",
              resource: "randomizes",
            },
            {
              name: "Drops",
              dataViewAltKey: "randomizer",
              offset: 0x62,
              type: "variable",
              dataType: "uint8",
              resource: "vanillaRandomize",
            },
          ],
        },
        {
          name: "Shops",
          flex: true,
          items: [
            {
              id: "shopItems",
              name: "Items",
              dataViewAltKey: "randomizer",
              offset: 0x70,
              type: "variable",
              dataType: "uint8",
              resource: "items",
            },
            {
              id: "shopCount",
              name: "Number of Items Sold",
              dataViewAltKey: "randomizer",
              offset: 0x71,
              type: "variable",
              dataType: "uint8",
              resource: "modes",
            },
          ],
        },
        {
          name: "Ranks",
          flex: true,
          hidden: true,
          items: [
            {
              name: "Stats Modifiers",
              dataViewAltKey: "randomizer",
              offset: 0x80,
              type: "variable",
              dataType: "uint8",
              resource: "modes",
              hint: "Shuffle modifiers that depend on your Rank.",
              hidden: true,
            },
          ],
        },
        {
          name: "Treasures",
          items: [
            {
              name: "Contents",
              dataViewAltKey: "randomizer",
              offset: 0x90,
              type: "variable",
              dataType: "uint8",
              resource: "vanillaShuffleRandomize",
            },
          ],
        },
        {
          name: "Quality of Life",
          items: [
            {
              type: "section",
              flex: true,
              items: [
                {
                  name: "Experience Scale",
                  dataViewAltKey: "randomizer",
                  offset: 0xa0,
                  type: "variable",
                  dataType: "uint16",
                  bigEndian: true,
                  max: 999,
                  hint: "Will apply only if enemies Experience / Gold is set to Vanilla.",
                  suffix: "%",
                },
                {
                  name: "Gold Scale",
                  dataViewAltKey: "randomizer",
                  offset: 0xa2,
                  type: "variable",
                  dataType: "uint16",
                  bigEndian: true,
                  max: 999,
                  hint: "Will apply only if enemies Experience / Gold is set to Vanilla.",
                  suffix: "%",
                },
              ],
            },
            {
              dataViewAltKey: "randomizer",
              type: "bitflags",
              flags: [
                { offset: 0xa4, bit: 0, label: "All magic unlocked" },
                { offset: 0xa4, bit: 1, label: "All Special moves unlocked", separator: true },
                { offset: 0xa4, bit: 2, label: "Magic costs 0 Spirit" },
                { offset: 0xa4, bit: 3, label: "Special moves costs 0 Spirit", separator: true },
                { offset: 0xa4, bit: 4, label: "Reduce the rate of random encouters" },
              ],
            },
          ],
        },
      ],
    },
  ],
  resources: {
    items: {
      0x0: "Vanilla",
      0x1: "Shuffle (Same type)",
      0x2: "Shuffle (Any type)",
      0x3: "Randomize (Same type)",
      0x4: "Randomize (Any type)",
    },
    modes: {
      0x0: "Vanilla",
      0x1: "Shuffle",
      0x2: "Randomize (Moderate)",
      0x3: "Randomize (Chaos)",
    },
    randomizes: {
      0x0: "Vanilla",
      0x1: "Randomize (Moderate)",
      0x2: "Randomize (Chaos)",
    },
    vanillaRandomize: {
      0x0: "Vanilla",
      0x1: "Randomize",
    },
    vanillaShuffleRandomize: {
      0x0: "Vanilla",
      0x1: "Shuffle",
      0x2: "Randomize",
    },
  },
};

export default template;
