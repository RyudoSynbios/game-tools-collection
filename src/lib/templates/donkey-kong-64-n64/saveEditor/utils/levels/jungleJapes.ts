import type { ItemTab } from "$lib/types";

import { characterFragment } from "../fragment";

export default {
  name: "Jungle Japes",
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
                { offset: 0x4, bit: 0, label: "<b>1.</b> Entrance" },
                { offset: 0x4, bit: 1, label: "<b>1.</b> Cliff Area", separator: true },
                { offset: 0x4, bit: 3, label: "<b>2.</b> Cliff Area" },
                { offset: 0x4, bit: 2, label: "<b>2.</b> Snade's HQ", separator: true },
                { offset: 0x4, bit: 4, label: "<b>3.</b> Minecart exit" },
                { offset: 0x4, bit: 5, label: "<b>3.</b> X Cave entrance", separator: true },
                { offset: 0x5, bit: 0, label: "<b>4.</b> Cliff Area" },
                { offset: 0x5, bit: 1, label: "<b>4.</b> Cranky's Lab", separator: true },
                { offset: 0x4, bit: 6, label: "<b>5.</b> Beehive Area" },
                { offset: 0x4, bit: 7, label: "<b>5.</b> Above mine entrance" },
              ],
            },
            {
              type: "section",
              items: [
                {
                  id: "bananaMedals-%index%-0",
                  name: "Banana Medals",
                  type: "bitflags",
                  flags: [
                    { offset: 0x44, bit: 5, label: "Donkey Kong" },
                    { offset: 0x44, bit: 6, label: "Diddy Kong" },
                    { offset: 0x44, bit: 7, label: "Lanky Kong" },
                    { offset: 0x45, bit: 0, label: "Tiny Kong" },
                    { offset: 0x45, bit: 1, label: "Chunky Kong" },
                  ],
                },
                {
                  name: "Blueprints",
                  type: "bitflags",
                  flags: [
                    { offset: 0x3a, bit: 5, label: "Donkey Kong" },
                    { offset: 0x3a, bit: 6, label: "Diddy Kong" },
                    { offset: 0x3a, bit: 7, label: "Lanky Kong" },
                    { offset: 0x3b, bit: 0, label: "Tiny Kong" },
                    { offset: 0x3b, bit: 1, label: "Chunky Kong" },
                  ],
                },
              ],
            },
            {
              name: "Events",
              type: "bitflags",
              flags: [
                { offset: 0x37, bit: 3, label: "World unlocked" },
                { offset: 0x39, bit: 5, label: "B. Locker gone" },
                { offset: 0x38, bit: 5, label: "Location visited", separator: true },
                { offset: 0x3, bit: 3, label: "Camera introduction seen", hidden: true },
                { offset: 0x61, bit: 3, label: "Logo animation seen", hidden: true },
                { offset: 0x0, bit: 6, label: "Diddy Kong rescued" },
                { offset: 0x3, bit: 2, label: "Boss Key obtained" },
                { offset: 0x4c, bit: 1, label: "Battle Crown obtained" },
                { offset: 0x0, bit: 0, label: "Entrance grate opened", hidden: true },
                { offset: 0x0, bit: 7, label: "Double Feather Switch grate opened", hidden: true },
                { offset: 0x1, bit: 5, label: "Diddy's hut destroyed", hidden: true },
                { offset: 0x1, bit: 6, label: "Lanky's hut destroyed", hidden: true },
                { offset: 0x1, bit: 7, label: "Donkey's hut destroyed", hidden: true },
                { offset: 0x2, bit: 0, label: "Tiny's hut destroyed", hidden: true },
                { offset: 0x5, bit: 2, label: "Cutscene with emprisoned Diddy Kong seen", hidden: true },
                { offset: 0x5, bit: 3, label: "Rambi Wall destroyed", hidden: true },
                { offset: 0x5, bit: 4, label: "Animation of the wooden slope on the hill seen", hidden: true },
                { offset: 0x5, bit: 5, label: "Animation of Rambi Box cell opened seen", hidden: true },
                { offset: 0x5, bit: 6, label: "Door of painting cave opened", hidden: true },
              ],
            },
            {
              name: "Banana Fairies",
              type: "bitflags",
              flags: [
                { offset: 0x49, bit: 5, label: "Above the lake in the cave" },
                { offset: 0x49, bit: 6, label: "Inside the painting cave" },
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
                    characterFragment(0, "bananas", 0),
                    characterFragment(0, "fedBananas", 0),
                  ],
                },
                {
                  type: "section",
                  items: [
                    characterFragment(0, "goldenBananas", 0),
                    {
                      id: "goldenBananas-%index%-0-0",
                      name: "Golden Bananas",
                      type: "bitflags",
                      flags: [
                        { offset: 0x0, bit: 4, label: "In front of Diddy's cell" },
                        { offset: 0x0, bit: 5, label: "Inside Diddy's cell" },
                        { offset: 0x0, bit: 3, label: "Baboon Blast" },
                        { offset: 0x2, bit: 4, label: "At the entrance of the cliff area" },
                        { offset: 0x3f, bit: 5, label: "Yellow blueprint given to Snide" },
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
                    characterFragment(1, "bananas", 0),
                    characterFragment(1, "fedBananas", 0),
                  ],
                },
                {
                  type: "section",
                  items: [
                    characterFragment(1, "goldenBananas", 0),
                    {
                      id: "goldenBananas-%index%-0-1",
                      name: "Golden Bananas",
                      type: "bitflags",
                      flags: [
                        { offset: 0x3, bit: 7, label: "Inside the peanut switches room" },
                        { offset: 0x3, bit: 0, label: "Minecart mini-game cleared" },
                        { offset: 0x2, bit: 7, label: "At the top of the highest cliff" },
                        { offset: 0x2, bit: 2, label: "Inside a cell near Funky's Shop" },
                        { offset: 0x3f, bit: 6, label: "Red blueprint given to Snide" },
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
                    characterFragment(2, "bananas", 0),
                    characterFragment(2, "fedBananas", 0),
                  ],
                },
                {
                  type: "section",
                  items: [
                    characterFragment(2, "goldenBananas", 0),
                    {
                      id: "goldenBananas-%index%-0-2",
                      name: "Golden Bananas",
                      type: "bitflags",
                      flags: [
                        { offset: 0x1, bit: 2, label: "Behind the painting inside the painting cave" },
                        { offset: 0x2, bit: 3, label: "Inside a cell near the cannon of the cliff area" },
                        { offset: 0x0, bit: 1, label: "Mad Maze Maul! cleared" },
                        { offset: 0x1, bit: 3, label: "Speedy Swing Sortie! cleared" },
                        { offset: 0x3f, bit: 7, label: "Blue blueprint given to Snide" },
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
                    characterFragment(3, "bananas", 0),
                    characterFragment(3, "fedBananas", 0),
                  ],
                },
                {
                  type: "section",
                  items: [
                    characterFragment(3, "goldenBananas", 0),
                    {
                      id: "goldenBananas-%index%-0-3",
                      name: "Golden Bananas",
                      type: "bitflags",
                      flags: [
                        { offset: 0x1, bit: 0, label: "Inside a trunk" },
                        { offset: 0x1, bit: 1, label: "Inside the beehive" },
                        { offset: 0x2, bit: 5, label: "Inside a cell in the cliff area" },
                        { offset: 0x0, bit: 2, label: "Splish-Splash Salvage! cleared" },
                        { offset: 0x40, bit: 0, label: "Purple blueprint given to Snide" },
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
                    characterFragment(4, "bananas", 0),
                    characterFragment(4, "fedBananas", 0),
                  ],
                },
                {
                  type: "section",
                  items: [
                    characterFragment(4, "goldenBananas", 0),
                    {
                      id: "goldenBananas-%index%-0-4",
                      name: "Golden Bananas",
                      type: "bitflags",
                      flags: [
                        { offset: 0x3, bit: 1, label: "Inside the giant boulder" },
                        { offset: 0x1, bit: 4, label: "Inside the X cave" },
                        { offset: 0x2, bit: 6, label: "Inside a cell near Snade's HQ" },
                        { offset: 0x3, bit: 4, label: "Minecart Mayhem! cleared" },
                        { offset: 0x40, bit: 1, label: "Green blueprint given to Snide" },
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
