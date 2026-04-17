import type { ItemTab } from "$lib/types";

import { characterFragment } from "../fragment";

export default {
  name: "Fungi Forest",
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
                { offset: 0x1d, bit: 6, label: "<b>1.</b> Entrance" },
                { offset: 0x1d, bit: 5, label: "<b>1.</b> Watermill", separator: true },
                { offset: 0x1d, bit: 7, label: "<b>2.</b> Entrance" },
                { offset: 0x1e, bit: 0, label: "<b>2.</b> Funky's Store", separator: true },
                { offset: 0x1e, bit: 1, label: "<b>3.</b> Entrance" },
                { offset: 0x1e, bit: 2, label: "<b>3.</b> Giant Mushroom Base", separator: true },
                { offset: 0x1e, bit: 3, label: "<b>4.</b> Entrance" },
                { offset: 0x1e, bit: 4, label: "<b>4.</b> Big Tree", separator: true },
                { offset: 0x1e, bit: 5, label: "<b>5.</b> Giant Mushroom Base" },
                { offset: 0x1e, bit: 6, label: "<b>5.</b> Giant Mushroom Top" },
              ],
            },
            {
              type: "section",
              items: [
                {
                  id: "bananaMedals-%index%-4",
                  name: "Banana Medals",
                  type: "bitflags",
                  flags: [
                    { offset: 0x47, bit: 1, label: "Donkey Kong" },
                    { offset: 0x47, bit: 2, label: "Diddy Kong" },
                    { offset: 0x47, bit: 3, label: "Lanky Kong" },
                    { offset: 0x47, bit: 4, label: "Tiny Kong" },
                    { offset: 0x47, bit: 5, label: "Chunky Kong" },
                  ],
                },
                {
                  name: "Blueprints",
                  type: "bitflags",
                  flags: [
                    { offset: 0x3d, bit: 1, label: "Donkey Kong" },
                    { offset: 0x3d, bit: 2, label: "Diddy Kong" },
                    { offset: 0x3d, bit: 3, label: "Lanky Kong" },
                    { offset: 0x3d, bit: 4, label: "Tiny Kong" },
                    { offset: 0x3d, bit: 5, label: "Chunky Kong" },
                  ],
                },
              ],
            },
            {
              name: "Events",
              type: "bitflags",
              flags: [
                { offset: 0x37, bit: 7, label: "World unlocked" },
                { offset: 0x3a, bit: 1, label: "B. Locker gone" },
                { offset: 0x39, bit: 1, label: "Location visited", separator: true },
                { offset: 0x20, bit: 1, label: "Camera introduction seen", hidden: true },
                { offset: 0x61, bit: 6, label: "Logo animation seen", hidden: true },
                { offset: 0x1d, bit: 4, label: "Boss Key obtained" },
                { offset: 0x4c, bit: 5, label: "Battle Crown obtained" },
              ],
            },
            {
              name: "Banana Fairies",
              type: "bitflags",
              flags: [
                { offset: 0x4a, bit: 3, label: "Inside the dark attic" },
                { offset: 0x4a, bit: 4, label: "Inside a box in the barn" },
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
                    characterFragment(0, "bananas", 4),
                    characterFragment(0, "fedBananas", 4),
                  ],
                },
                {
                  type: "section",
                  items: [
                    characterFragment(0, "goldenBananas", 4),
                    {
                      id: "goldenBananas-%index%-4-0",
                      name: "Golden Bananas",
                      type: "bitflags",
                      flags: [
                        { offset: 0x1b, bit: 3, label: "Inside a cage next to the watermill" },
                        { offset: 0x1c, bit: 4, label: "Inside the giant mushroom" },
                        { offset: 0x1d, bit: 3, label: "Minecart Mayhem! cleared" },
                        { offset: 0x1f, bit: 6, label: "Peril Path Panic! cleared" },
                        { offset: 0x42, bit: 1, label: "Yellow blueprint given to Snide" },
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
                    characterFragment(1, "bananas", 4),
                    characterFragment(1, "fedBananas", 4),
                  ],
                },
                {
                  type: "section",
                  items: [
                    characterFragment(1, "goldenBananas", 4),
                    {
                      id: "goldenBananas-%index%-4-1",
                      name: "Golden Bananas",
                      type: "bitflags",
                      flags: [
                        { offset: 0x1a, bit: 6, label: "Inside a cage next to the watermill" },
                        { offset: 0x1b, bit: 0, label: "Inside the dark attic" },
                        { offset: 0x1a, bit: 3, label: "Teetering Turtle Trouble! cleared" },
                        { offset: 0x1f, bit: 2, label: "Busy Barrel Barrage! cleared" },
                        { offset: 0x42, bit: 2, label: "Red blueprint given to Snide" },
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
                    characterFragment(2, "bananas", 4),
                    characterFragment(2, "fedBananas", 4),
                  ],
                },
                {
                  type: "section",
                  items: [
                    characterFragment(2, "goldenBananas", 4),
                    {
                      id: "goldenBananas-%index%-4-2",
                      name: "Golden Bananas",
                      type: "bitflags",
                      flags: [
                        { offset: 0x1b, bit: 1, label: "Inside the attic of the watermill" },
                        { offset: 0x1c, bit: 2, label: "Inside a room on the top of the giant mushroom" },
                        { offset: 0x1f, bit: 1, label: "Race against the Rabbit won" },
                        { offset: 0x1c, bit: 0, label: "Krazy Kong Klamour! cleared" },
                        { offset: 0x42, bit: 3, label: "Blue blueprint given to Snide" },
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
                    characterFragment(3, "bananas", 4),
                    characterFragment(3, "fedBananas", 4),
                  ],
                },
                {
                  type: "section",
                  items: [
                    characterFragment(3, "goldenBananas", 4),
                    {
                      id: "goldenBananas-%index%-4-3",
                      name: "Golden Bananas",
                      type: "bitflags",
                      flags: [
                        { offset: 0x19, bit: 5, label: "Purple Klaptraps in the tree stump defeated" },
                        { offset: 0x1a, bit: 1, label: "At the top of the beanstalk" },
                        { offset: 0x1e, bit: 7, label: "Giant Spider defeated" },
                        { offset: 0x1c, bit: 3, label: "Speedy Swing Sortie! cleared" },
                        { offset: 0x42, bit: 4, label: "Purple blueprint given to Snide" },
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
                    characterFragment(4, "bananas", 4),
                    characterFragment(4, "fedBananas", 4),
                  ],
                },
                {
                  type: "section",
                  items: [
                    characterFragment(4, "goldenBananas", 4),
                    {
                      id: "goldenBananas-%index%-4-4",
                      name: "Golden Bananas",
                      type: "bitflags",
                      flags: [
                        { offset: 0x1a, bit: 7, label: "Minecart mini-game cleared" },
                        { offset: 0x1b, bit: 5, label: "Inside the crusher room" },
                        { offset: 0x1c, bit: 1, label: "Face puzzle cleared" },
                        { offset: 0x1f, bit: 5, label: "Tomatoes defeated" },
                        { offset: 0x42, bit: 5, label: "Green blueprint given to Snide" },
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
