import type { ItemTab } from "$lib/types";

import { characterFragment } from "../fragment";

export default {
  name: "Crystal Caves",
  items: [
    {
      type: "tabs",
      items: [
        {
          name: "General",
          flex: true,
          items: [
            {
              name: "Bananaport Pads",
              type: "bitflags",
              flags: [
                { offset: 0x23, bit: 4, label: "<b>1.</b> Entrance" },
                { offset: 0x23, bit: 3, label: "<b>1.</b> Igloo", separator: true },
                { offset: 0x23, bit: 5, label: "<b>2.</b> Entrance" },
                { offset: 0x23, bit: 6, label: "<b>2.</b> Cabins", separator: true },
                { offset: 0x24, bit: 3, label: "<b>3.</b> Igloo" },
                { offset: 0x24, bit: 7, label: "<b>3.</b> Krazy Kong Klamour!", separator: true, disabled: true },
                { offset: 0x24, bit: 0, label: "<b>4.</b> Cranky's Lab" },
                { offset: 0x23, bit: 7, label: "<b>4.</b> Monkeyport", separator: true },
                { offset: 0x24, bit: 1, label: "<b>5.</b> Cabins" },
                { offset: 0x24, bit: 2, label: "<b>5.</b> Funky's Store" },
              ],
            },
            {
              type: "section",
              items: [
                {
                  id: "bananaMedals-%index%-5",
                  name: "Banana Medals",
                  type: "bitflags",
                  flags: [
                    { offset: 0x47, bit: 6, label: "Donkey Kong" },
                    { offset: 0x47, bit: 7, label: "Diddy Kong" },
                    { offset: 0x48, bit: 0, label: "Lanky Kong" },
                    { offset: 0x48, bit: 1, label: "Tiny Kong" },
                    { offset: 0x48, bit: 2, label: "Chunky Kong" },
                  ],
                },
                {
                  name: "Blueprints",
                  type: "bitflags",
                  flags: [
                    { offset: 0x3d, bit: 6, label: "Donkey Kong" },
                    { offset: 0x3d, bit: 7, label: "Diddy Kong" },
                    { offset: 0x3e, bit: 0, label: "Lanky Kong" },
                    { offset: 0x3e, bit: 1, label: "Tiny Kong" },
                    { offset: 0x3e, bit: 2, label: "Chunky Kong" },
                  ],
                },
              ],
            },
            {
              name: "Events",
              type: "bitflags",
              flags: [
                { offset: 0x38, bit: 0, label: "World unlocked" },
                { offset: 0x3a, bit: 2, label: "B. Locker gone" },
                { offset: 0x39, bit: 2, label: "Location visited", separator: true },
                { offset: 0x23, bit: 2, label: "Camera introduction seen", hidden: true },
                { offset: 0x61, bit: 7, label: "Logo animation seen", hidden: true },
                { offset: 0x24, bit: 4, label: "Boss Key obtained" },
                { offset: 0x4d, bit: 0, label: "Battle Crown obtained" },
              ],
            },
            {
              name: "Banana Fairies",
              type: "bitflags",
              flags: [
                { offset: 0x4a, bit: 5, label: "Inside Tiny's section of the igloo" },
                { offset: 0x4c, bit: 0, label: "Inside the candles cabin" },
              ],
            },
          ],
        },
        {
          name: "Bananas",
          items: [
            {
              name: "Donkey Kong",
              type: "section",
              flex: true,
              noMargin: true,
              items: [
                {
                  type: "section",
                  items: [
                    characterFragment(0, "bananas", 5),
                    characterFragment(0, "fedBananas", 5),
                  ],
                },
                {
                  type: "section",
                  items: [
                    characterFragment(0, "goldenBananas", 5),
                    {
                      id: "goldenBananas-%index%-5-0",
                      name: "Golden Bananas",
                      type: "bitflags",
                      flags: [
                        { offset: 0x20, bit: 5, label: "Zingers in cabin defeated" },
                        { offset: 0x22, bit: 3, label: "Ice maze challenge cleared" },
                        { offset: 0x22, bit: 4, label: "Match pairs cleared" },
                        { offset: 0x25, bit: 2, label: "Busy Barrel Barrage! cleared" },
                        { offset: 0x42, bit: 6, label: "Yellow blueprint given to Snide" },
                      ],
                    },
                  ],
                },
              ],
            },
            {
              name: "Diddy Kong",
              type: "section",
              flex: true,
              noMargin: true,
              items: [
                {
                  type: "section",
                  items: [
                    characterFragment(1, "bananas", 5),
                    characterFragment(1, "fedBananas", 5),
                  ],
                },
                {
                  type: "section",
                  items: [
                    characterFragment(1, "goldenBananas", 5),
                    {
                      id: "goldenBananas-%index%-5-1",
                      name: "Golden Bananas",
                      type: "bitflags",
                      flags: [
                        { offset: 0x20, bit: 6, label: "Kremling battle cabin cleared" },
                        { offset: 0x22, bit: 2, label: "Barrels challenge cleared" },
                        { offset: 0x24, bit: 5, label: "Inside the candles cabin" },
                        { offset: 0x24, bit: 6, label: "Mad Maze Maul! cleared" },
                        { offset: 0x42, bit: 7, label: "Red blueprint given to Snide" },
                      ],
                    },
                  ],
                },
              ],
            },
            {
              name: "Lanky Kong",
              type: "section",
              flex: true,
              noMargin: true,
              items: [
                {
                  type: "section",
                  items: [
                    characterFragment(2, "bananas", 5),
                    characterFragment(2, "fedBananas", 5),
                  ],
                },
                {
                  type: "section",
                  items: [
                    characterFragment(2, "goldenBananas", 5),
                    {
                      id: "goldenBananas-%index%-5-2",
                      name: "Golden Bananas",
                      type: "bitflags",
                      flags: [
                        { offset: 0x20, bit: 3, label: "Race against the Beetle won" },
                        { offset: 0x21, bit: 0, label: "Inside Orangstand Sprint cabin" },
                        { offset: 0x21, bit: 7, label: "Tiles puzzle cleared" },
                        { offset: 0x23, bit: 1, label: "Inside Lanky's section of the igloo" },
                        { offset: 0x43, bit: 0, label: "Blue blueprint given to Snide" },
                      ],
                    },
                  ],
                },
              ],
            },
            {
              name: "Tiny Kong",
              type: "section",
              flex: true,
              noMargin: true,
              items: [
                {
                  type: "section",
                  items: [
                    characterFragment(3, "bananas", 5),
                    characterFragment(3, "fedBananas", 5),
                  ],
                },
                {
                  type: "section",
                  items: [
                    characterFragment(3, "goldenBananas", 5),
                    {
                      id: "goldenBananas-%index%-5-3",
                      name: "Golden Bananas",
                      type: "bitflags",
                      flags: [
                        { offset: 0x20, bit: 4, label: "Purple Klaptraps in cabin defeated" },
                        { offset: 0x22, bit: 7, label: "Inside Tiny's section of the igloo" },
                        { offset: 0x25, bit: 1, label: "Inside the Monkeyport igloo" },
                        { offset: 0x24, bit: 7, label: "Krazy Kong Klamour! cleared" },
                        { offset: 0x43, bit: 1, label: "Purple blueprint given to Snide" },
                      ],
                    },
                  ],
                },
              ],
            },
            {
              name: "Chunky Kong",
              type: "section",
              flex: true,
              noMargin: true,
              items: [
                {
                  type: "section",
                  items: [
                    characterFragment(4, "bananas", 5),
                    characterFragment(4, "fedBananas", 5),
                  ],
                },
                {
                  type: "section",
                  items: [
                    characterFragment(4, "goldenBananas", 5),
                    {
                      id: "goldenBananas-%index%-5-4",
                      name: "Golden Bananas",
                      type: "bitflags",
                      flags: [
                        { offset: 0x21, bit: 4, label: "Inside the Gorilla Gone room" },
                        { offset: 0x21, bit: 6, label: "Inside the breakable igloo" },
                        { offset: 0x22, bit: 6, label: "Inside Chunky's section of the igloo" },
                        { offset: 0x20, bit: 7, label: "Searchlight Seek! cleared" },
                        { offset: 0x43, bit: 2, label: "Green blueprint given to Snide" },
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
} as ItemTab;
