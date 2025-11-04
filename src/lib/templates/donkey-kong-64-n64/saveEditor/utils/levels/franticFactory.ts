import type { ItemTab } from "$lib/types";

import { characterFragment } from "../fragment";

export default {
  name: "Frantic Factory",
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
                { offset: 0x11, bit: 5, label: "<b>1.</b> Lobby" },
                { offset: 0x11, bit: 6, label: "<b>1.</b> Storage Room", separator: true },
                { offset: 0x11, bit: 7, label: "<b>2.</b> Lobby" },
                { offset: 0x12, bit: 0, label: "<b>2.</b> R&D", separator: true },
                { offset: 0x12, bit: 1, label: "<b>3.</b> Lobby" },
                { offset: 0x12, bit: 2, label: "<b>3.</b> Snide's HQ", separator: true },
                { offset: 0x12, bit: 4, label: "<b>4.</b> Production Room Base" },
                { offset: 0x12, bit: 3, label: "<b>4.</b> Production Room Top", separator: true },
                { offset: 0x12, bit: 5, label: "<b>5.</b> Funky's Store" },
                { offset: 0x12, bit: 6, label: "<b>5.</b> Arcade Room" },
              ],
            },
            {
              type: "section",
              items: [
                {
                  id: "bananaMedals-%index%-2",
                  name: "Banana Medals",
                  type: "bitflags",
                  flags: [
                    { offset: 0x45, bit: 7, label: "Donkey Kong" },
                    { offset: 0x46, bit: 0, label: "Diddy Kong" },
                    { offset: 0x46, bit: 1, label: "Lanky Kong" },
                    { offset: 0x46, bit: 2, label: "Tiny Kong" },
                    { offset: 0x46, bit: 3, label: "Chunky Kong" },
                  ],
                },
                {
                  name: "Blueprints",
                  type: "bitflags",
                  flags: [
                    { offset: 0x3b, bit: 7, label: "Donkey Kong" },
                    { offset: 0x3c, bit: 0, label: "Diddy Kong" },
                    { offset: 0x3c, bit: 1, label: "Lanky Kong" },
                    { offset: 0x3c, bit: 2, label: "Tiny Kong" },
                    { offset: 0x3c, bit: 3, label: "Chunky Kong" },
                  ],
                },
              ],
            },
            {
              name: "Events",
              type: "bitflags",
              flags: [
                { offset: 0x37, bit: 5, label: "World unlocked" },
                { offset: 0x39, bit: 7, label: "B. Locker gone" },
                { offset: 0x38, bit: 7, label: "Location visited", separator: true },
                { offset: 0x11, bit: 4, label: "Camera introduction seen", hidden: true },
                { offset: 0x61, bit: 4, label: "Logo animation seen", hidden: true },
                { offset: 0xe, bit: 5, label: "Chunky Kong rescued" },
                { offset: 0x11, bit: 2, label: "Boss Key obtained" },
                { offset: 0x4c, bit: 3, label: "Battle Crown obtained" },
                { offset: 0x10, bit: 4, label: "Nintendo Coin obtained" },
              ],
            },
            {
              name: "Banana Fairies",
              type: "bitflags",
              flags: [
                { offset: 0x49, bit: 7, label: "Near Funky's Store" },
                { offset: 0x4b, bit: 2, label: "Inside the tunnel to the numbered blocks room" },
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
                    characterFragment(0, "bananas", 2),
                    characterFragment(0, "fedBananas", 2),
                  ],
                },
                {
                  type: "section",
                  items: [
                    characterFragment(0, "goldenBananas", 2),
                    {
                      id: "goldenBananas-%index%-2-0",
                      name: "Golden Bananas",
                      type: "bitflags",
                      flags: [
                        { offset: 0xe, bit: 0, label: "Inside the high voltage room" },
                        { offset: 0xf, bit: 2, label: "Numbered blocks puzzle cleared" },
                        { offset: 0x10, bit: 0, label: "Inside the press machine" },
                        { offset: 0x10, bit: 2, label: "Donkey Kong Arcade cleared" },
                        { offset: 0x40, bit: 7, label: "Yellow blueprint given to Snide" },
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
                    characterFragment(1, "bananas", 2),
                    characterFragment(1, "fedBananas", 2),
                  ],
                },
                {
                  type: "section",
                  items: [
                    characterFragment(1, "goldenBananas", 2),
                    {
                      id: "goldenBananas-%index%-2-1",
                      name: "Golden Bananas",
                      type: "bitflags",
                      flags: [
                        { offset: 0xe, bit: 1, label: "At the top of the machine room" },
                        { offset: 0xf, bit: 6, label: "Inside combinations room" },
                        { offset: 0x10, bit: 6, label: "Beaver Bother! cleared" },
                        { offset: 0x10, bit: 7, label: "Peril Path Panic! cleared" },
                        { offset: 0x41, bit: 0, label: "Red blueprint given to Snide" },
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
                    characterFragment(2, "bananas", 2),
                    characterFragment(2, "fedBananas", 2),
                  ],
                },
                {
                  type: "section",
                  items: [
                    characterFragment(2, "goldenBananas", 2),
                    {
                      id: "goldenBananas-%index%-2-2",
                      name: "Golden Bananas",
                      type: "bitflags",
                      flags: [
                        { offset: 0xe, bit: 3, label: "At the top of the machine room" },
                        { offset: 0xe, bit: 6, label: "Inside Chunky's cell" },
                        { offset: 0xf, bit: 5, label: "Piano puzzle cleared" },
                        { offset: 0x11, bit: 1, label: "Batty Barrel Bandit! cleared" },
                        { offset: 0x41, bit: 1, label: "Blue blueprint given to Snide" },
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
                    characterFragment(3, "bananas", 2),
                    characterFragment(3, "fedBananas", 2),
                  ],
                },
                {
                  type: "section",
                  items: [
                    characterFragment(3, "goldenBananas", 2),
                    {
                      id: "goldenBananas-%index%-2-3",
                      name: "Golden Bananas",
                      type: "bitflags",
                      flags: [
                        { offset: 0xf, bit: 3, label: "Inside a pipe in the arcade room" },
                        { offset: 0xf, bit: 4, label: "Dart game cleared" },
                        { offset: 0x11, bit: 3, label: "Race against the Kremling Car won" },
                        { offset: 0xe, bit: 4, label: "Krazy Kong Klamour! cleared" },
                        { offset: 0x41, bit: 2, label: "Purple blueprint given to Snide" },
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
                    characterFragment(4, "bananas", 2),
                    characterFragment(4, "fedBananas", 2),
                  ],
                },
                {
                  type: "section",
                  items: [
                    characterFragment(4, "goldenBananas", 2),
                    {
                      id: "goldenBananas-%index%-2-4",
                      name: "Golden Bananas",
                      type: "bitflags",
                      flags: [
                        { offset: 0xe, bit: 2, label: "in the center of the rotating platform in the machine room" },
                        { offset: 0xf, bit: 1, label: "Inside a box in the moving platforms room" },
                        { offset: 0xf, bit: 7, label: "Toy Monster defeated" },
                        { offset: 0x11, bit: 0, label: "Stash Snatch! cleared" },
                        { offset: 0x41, bit: 3, label: "Green blueprint given to Snide" },
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
