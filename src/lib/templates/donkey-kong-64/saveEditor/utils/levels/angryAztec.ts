import type { ItemTab } from "$lib/types";

import { characterFragment } from "../fragment";

export default {
  name: "Angry Aztec",
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
                    { offset: 0x9, bit: 7, label: "<b>1.</b> Entrance" },
                    { offset: 0xa, bit: 0, label: "<b>1.</b> Candy's Music Shop", separator: true },
                    { offset: 0xa, bit: 1, label: "<b>2.</b> Tiny's Cell Temple" },
                    { offset: 0xa, bit: 2, label: "<b>2.</b> Totem Area", separator: true },
                    { offset: 0xa, bit: 3, label: "<b>3.</b> Cranky's Lab" },
                    { offset: 0xa, bit: 4, label: "<b>3.</b> Totem Area", separator: true },
                    { offset: 0xa, bit: 6, label: "<b>4.</b> Totem Area" },
                    { offset: 0xa, bit: 5, label: "<b>4.</b> Funky's Store", separator: true },
                    { offset: 0xa, bit: 7, label: "<b>5.</b> Snide's HQ" },
                    { offset: 0x7, bit: 6, label: "<b>5.</b> Stealthy Snoop!", disabled: true },
                  ],
                },
                {
                  name: "Llama's Temple",
                  type: "bitflags",
                  flags: [
                    { offset: 0xb, bit: 1, label: "<b>1.</b> Entrance" },
                    { offset: 0xb, bit: 0, label: "<b>1.</b> Lanky's Room", separator: true },
                    { offset: 0xb, bit: 3, label: "<b>2.</b> Entrance" },
                    { offset: 0xb, bit: 2, label: "<b>2.</b> Tiny's Room" },
                  ],
                },
              ],
            },
            {
              type: "section",
              items: [
                {
                  id: "bananaMedals-%index%-1",
                  name: "Banana Medals",
                  type: "bitflags",
                  flags: [
                    { offset: 0x45, bit: 2, label: "Donkey Kong" },
                    { offset: 0x45, bit: 3, label: "Diddy Kong" },
                    { offset: 0x45, bit: 4, label: "Lanky Kong" },
                    { offset: 0x45, bit: 5, label: "Tiny Kong" },
                    { offset: 0x45, bit: 6, label: "Chunky Kong" },
                  ],
                },
                {
                  name: "Blueprints",
                  type: "bitflags",
                  flags: [
                    { offset: 0x3b, bit: 2, label: "Donkey Kong" },
                    { offset: 0x3b, bit: 3, label: "Diddy Kong" },
                    { offset: 0x3b, bit: 4, label: "Lanky Kong" },
                    { offset: 0x3b, bit: 5, label: "Tiny Kong" },
                    { offset: 0x3b, bit: 6, label: "Chunky Kong" },
                  ],
                },
              ],
            },
            {
              name: "Events",
              type: "bitflags",
              flags: [
                { offset: 0x37, bit: 4, label: "World unlocked" },
                { offset: 0x39, bit: 6, label: "B. Locker gone" },
                { offset: 0x38, bit: 6, label: "Location visited", separator: true },
                { offset: 0xb, bit: 7, label: "Camera introduction seen", hidden: true },
                { offset: 0x62, bit: 3, label: "Logo animation seen", hidden: true },
                { offset: 0x8, bit: 6, label: "Lanky Kong rescued" },
                { offset: 0x8, bit: 2, label: "Tiny Kong rescued" },
                { offset: 0x9, bit: 2, label: "Boss Key obtained" },
                { offset: 0x4c, bit: 2, label: "Battle Crown obtained" },
              ],
            },
            {
              name: "Banana Fairies",
              type: "bitflags",
              flags: [
                { offset: 0x4b, bit: 0, label: "Inside Llama's temple" },
                { offset: 0x4b, bit: 1, label: "Inside Tiny's section of the 5 doors temple" },
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
                    characterFragment(0, "bananas", 1),
                    characterFragment(0, "fedBananas", 1),
                  ],
                },
                {
                  type: "section",
                  items: [
                    characterFragment(0, "goldenBananas", 1),
                    {
                      id: "goldenBananas-%index%-1-0",
                      name: "Golden Bananas",
                      type: "bitflags",
                      flags: [
                        { offset: 0x6, bit: 3, label: "In front of Llama's cage" },
                        { offset: 0x7, bit: 1, label: "Inside Donkey's section of the 5 doors temple" },
                        { offset: 0x9, bit: 5, label: "Inside Lanky's cell" },
                        { offset: 0x7, bit: 6, label: "Stealthy Snoop! cleared" },
                        { offset: 0x40, bit: 2, label: "Yellow blueprint given to Snide" },
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
                    characterFragment(1, "bananas", 1),
                    characterFragment(1, "fedBananas", 1),
                  ],
                },
                {
                  type: "section",
                  items: [
                    characterFragment(1, "goldenBananas", 1),
                    {
                      id: "goldenBananas-%index%-1-1",
                      name: "Golden Bananas",
                      type: "bitflags",
                      flags: [
                        { offset: 0x6, bit: 6, label: "At the top of the gongs tower" },
                        { offset: 0x7, bit: 0, label: "Inside Diddy's section of the 5 doors temple" },
                        { offset: 0x7, bit: 7, label: "Buzzard rings challenge" },
                        { offset: 0x8, bit: 3, label: "Inside Tiny's cell" },
                        { offset: 0x40, bit: 3, label: "Red blueprint given to Snide" },
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
                    characterFragment(2, "bananas", 1),
                    characterFragment(2, "fedBananas", 1),
                  ],
                },
                {
                  type: "section",
                  items: [
                    characterFragment(2, "goldenBananas", 1),
                    {
                      id: "goldenBananas-%index%-1-2",
                      name: "Golden Bananas",
                      type: "bitflags",
                      flags: [
                        { offset: 0x8, bit: 4, label: "Dropped by a Buzzard in Tiny's cell temple" },
                        { offset: 0x9, bit: 0, label: "Memory puzzle cleared" },
                        { offset: 0x7, bit: 4, label: "Big Bug Bash! cleared" },
                        { offset: 0x9, bit: 1, label: "Teetering Turtle Trouble! cleared" },
                        { offset: 0x40, bit: 4, label: "Blue blueprint given to Snide" },
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
                    characterFragment(3, "bananas", 1),
                    characterFragment(3, "fedBananas", 1),
                  ],
                },
                {
                  type: "section",
                  items: [
                    characterFragment(3, "goldenBananas", 1),
                    {
                      id: "goldenBananas-%index%-1-3",
                      name: "Golden Bananas",
                      type: "bitflags",
                      flags: [
                        { offset: 0x7, bit: 2, label: "Inside Tiny's section of the 5 doors temple" },
                        { offset: 0x8, bit: 1, label: "Kalptraps in Tiny's cell temple defeated " },
                        { offset: 0x8, bit: 7, label: "In the lava room of the Llama's temple" },
                        { offset: 0x9, bit: 3, label: "Race against the Beetle won" },
                        { offset: 0x40, bit: 5, label: "Purple blueprint given to Snide" },
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
                    characterFragment(4, "bananas", 1),
                    characterFragment(4, "fedBananas", 1),
                  ],
                },
                {
                  type: "section",
                  items: [
                    characterFragment(4, "goldenBananas", 1),
                    {
                      id: "goldenBananas-%index%-1-4",
                      name: "Golden Bananas",
                      type: "bitflags",
                      flags: [
                        { offset: 0x6, bit: 1, label: "In the vase room" },
                        { offset: 0x8, bit: 0, label: "Klaptraps in the rotating room defeated" },
                        { offset: 0x6, bit: 4, label: "Busy Barrel Barrage! cleared" },
                        { offset: 0x7, bit: 3, label: "Kremling Kosh! cleared" },
                        { offset: 0x40, bit: 6, label: "Green blueprint given to Snide" },
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
