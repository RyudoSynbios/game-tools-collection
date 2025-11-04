import type { ItemTab } from "$lib/types";

import { characterFragment } from "../fragment";

export default {
  name: "Creepy Castle",
  items: [
    {
      type: "tabs",
      items: [
        {
          name: "General",
          flex: true,
          items: [
            {
              type: "section",
              items: [
                {
                  name: "Bananaport Pads",
                  type: "bitflags",
                  flags: [
                    { offset: 0x28, bit: 7, label: "<b>1.</b> Entrance" },
                    { offset: 0x29, bit: 0, label: "<b>1.</b> Dungeon entrance", separator: true },
                    { offset: 0x29, bit: 1, label: "<b>2.</b> Entrance" },
                    { offset: 0x29, bit: 2, label: "<b>2.</b> Bridge", separator: true },
                    { offset: 0x29, bit: 3, label: "<b>3.</b> Entrance" },
                    { offset: 0x29, bit: 4, label: "<b>3.</b> Cranky's Lab", separator: true },
                    { offset: 0x29, bit: 5, label: "<b>4.</b> Entrance" },
                    { offset: 0x29, bit: 6, label: "<b>4.</b> Greenhouse", separator: true },
                    { offset: 0x29, bit: 7, label: "<b>5.</b> Entrance" },
                    { offset: 0x2a, bit: 0, label: "<b>5.</b> Snade's HQ", separator: true },
                  ],
                },
                {
                  name: "Catacombs",
                  type: "bitflags",
                  flags: [
                    { offset: 0x2a, bit: 1, label: "<b>1.</b> Entrance" },
                    { offset: 0x2a, bit: 2, label: "<b>1.</b> Diddy's section", separator: true },
                    { offset: 0x2a, bit: 3, label: "<b>2.</b> Entrance" },
                    { offset: 0x2a, bit: 4, label: "<b>2.</b> Donkey's section", separator: true },
                    { offset: 0x2a, bit: 5, label: "<b>3.</b> Entrance" },
                    { offset: 0x2a, bit: 6, label: "<b>3.</b> Chunky's section" },
                  ],
                },
              ],
            },
            {
              type: "section",
              items: [
                {
                  id: "bananaMedals-%index%-6",
                  name: "Banana Medals",
                  type: "bitflags",
                  flags: [
                    { offset: 0x48, bit: 3, label: "Donkey Kong" },
                    { offset: 0x48, bit: 4, label: "Diddy Kong" },
                    { offset: 0x48, bit: 5, label: "Lanky Kong" },
                    { offset: 0x48, bit: 6, label: "Tiny Kong" },
                    { offset: 0x48, bit: 7, label: "Chunky Kong" },
                  ],
                },
                {
                  name: "Blueprints",
                  type: "bitflags",
                  flags: [
                    { offset: 0x3e, bit: 3, label: "Donkey Kong" },
                    { offset: 0x3e, bit: 4, label: "Diddy Kong" },
                    { offset: 0x3e, bit: 5, label: "Lanky Kong" },
                    { offset: 0x3e, bit: 6, label: "Tiny Kong" },
                    { offset: 0x3e, bit: 7, label: "Chunky Kong" },
                  ],
                },
              ],
            },
            {
              name: "Events",
              type: "bitflags",
              flags: [
                { offset: 0x38, bit: 0, label: "World unlocked" },
                { offset: 0x3a, bit: 3, label: "B. Locker gone" },
                { offset: 0x39, bit: 3, label: "Location visited", separator: true },
                { offset: 0x2b, bit: 5, label: "Camera introduction seen", hidden: true },
                { offset: 0x62, bit: 0, label: "Logo animation seen", hidden: true },
                { offset: 0x27, bit: 5, label: "Boss Key obtained" },
                { offset: 0x4d, bit: 1, label: "Battle Crown obtained" },
              ],
            },
            {
              name: "Banana Fairies",
              type: "bitflags",
              flags: [
                { offset: 0x4b, bit: 4, label: "Inside the museum" },
                { offset: 0x4b, bit: 5, label: "Inside the tree at the water raising section" },
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
                    characterFragment(0, "bananas", 6),
                    characterFragment(0, "fedBananas", 6),
                  ],
                },
                {
                  type: "section",
                  items: [
                    characterFragment(0, "goldenBananas", 6),
                    {
                      id: "goldenBananas-%index%-6-0",
                      name: "Golden Bananas",
                      type: "bitflags",
                      flags: [
                        { offset: 0x27, bit: 1, label: "Inside the library" },
                        { offset: 0x27, bit: 6, label: "Minecart mini-game cleared" },
                        { offset: 0x28, bit: 0, label: "Targets destroyed inside the tree" },
                        { offset: 0x28, bit: 6, label: "Tiles puzzle cleared" },
                        { offset: 0x43, bit: 3, label: "Yellow blueprint given to Snide" },
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
                    characterFragment(1, "bananas", 6),
                    characterFragment(1, "fedBananas", 6),
                  ],
                },
                {
                  type: "section",
                  items: [
                    characterFragment(1, "goldenBananas", 6),
                    {
                      id: "goldenBananas-%index%-6-1",
                      name: "Golden Bananas",
                      type: "bitflags",
                      flags: [
                        { offset: 0x26, bit: 6, label: "Inside the 4 switches room" },
                        { offset: 0x2c, bit: 1, label: "Inside the chains room" },
                        { offset: 0x26, bit: 1, label: "Minecart Mayhem! cleared" },
                        { offset: 0x2b, bit: 6, label: "Big Bug Bash! cleared" },
                        { offset: 0x43, bit: 4, label: "Red blueprint given to Snide" },
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
                    characterFragment(2, "bananas", 6),
                    characterFragment(2, "fedBananas", 6),
                  ],
                },
                {
                  type: "section",
                  items: [
                    characterFragment(2, "goldenBananas", 6),
                    {
                      id: "goldenBananas-%index%-6-2",
                      name: "Golden Bananas",
                      type: "bitflags",
                      flags: [
                        { offset: 0x26, bit: 4, label: "Inside the vines room" },
                        { offset: 0x28, bit: 3, label: "Inside the maze" },
                        { offset: 0x26, bit: 2, label: "Beaver Bother! cleared" },
                        { offset: 0x27, bit: 4, label: "Kremling Kosh! cleared" },
                        { offset: 0x43, bit: 5, label: "Blue blueprint given to Snide" },
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
                    characterFragment(3, "bananas", 6),
                    characterFragment(3, "fedBananas", 6),
                  ],
                },
                {
                  type: "section",
                  items: [
                    characterFragment(3, "goldenBananas", 6),
                    {
                      id: "goldenBananas-%index%-6-3",
                      name: "Golden Bananas",
                      type: "bitflags",
                      flags: [
                        { offset: 0x26, bit: 5, label: "Above a hand in the toxic waste pool room" },
                        { offset: 0x28, bit: 5, label: "Race against the Kremling Car won" },
                        { offset: 0x2b, bit: 7, label: "Inside the trashcan" },
                        { offset: 0x27, bit: 3, label: "Teetering Turtle Trouble! cleared" },
                        { offset: 0x43, bit: 6, label: "Purple blueprint given to Snide" },
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
                    characterFragment(4, "bananas", 6),
                    characterFragment(4, "fedBananas", 6),
                  ],
                },
                {
                  type: "section",
                  items: [
                    characterFragment(4, "goldenBananas", 6),
                    {
                      id: "goldenBananas-%index%-6-4",
                      name: "Golden Bananas",
                      type: "bitflags",
                      flags: [
                        { offset: 0x27, bit: 2, label: "Inside the museum" },
                        { offset: 0x28, bit: 2, label: "Inside the bats room" },
                        { offset: 0x26, bit: 7, label: "Searchlight Seek! cleared" },
                        { offset: 0x27, bit: 7, label: "Beaver Bother! cleared" },
                        { offset: 0x43, bit: 7, label: "Green blueprint given to Snide" },
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
