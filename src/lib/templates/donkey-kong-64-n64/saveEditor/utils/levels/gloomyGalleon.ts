import type { ItemTab } from "$lib/types";

import { characterFragment } from "../fragment";

export default {
  name: "Gloomy Galleon",
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
                { offset: 0x16, bit: 2, label: "<b>1.</b> Shipwreck Cave" },
                { offset: 0x16, bit: 1, label: "<b>1.</b> Lighthouse", separator: true },
                { offset: 0x15, bit: 4, label: "<b>2.</b> Shipwreck Cave" },
                { offset: 0x15, bit: 3, label: "<b>2.</b> Underwater Shipwreck", separator: true },
                { offset: 0x15, bit: 6, label: "<b>3.</b> Shipwreck Cave" },
                { offset: 0x15, bit: 5, label: "<b>3.</b> Snide's HQ", separator: true },
                { offset: 0x15, bit: 7, label: "<b>4.</b> Candy's Music Shop" },
                { offset: 0x14, bit: 3, label: "<b>4.</b> Stealthy Snoop!", separator: true, disabled: true },
                { offset: 0x15, bit: 2, label: "<b>5.</b> Lighthouse" },
                { offset: 0x15, bit: 1, label: "<b>5.</b> Funky's Store" },
              ],
            },
            {
              type: "section",
              items: [
                {
                  id: "bananaMedals-%index%-3",
                  name: "Banana Medals",
                  type: "bitflags",
                  flags: [
                    { offset: 0x46, bit: 4, label: "Donkey Kong" },
                    { offset: 0x46, bit: 5, label: "Diddy Kong" },
                    { offset: 0x46, bit: 6, label: "Lanky Kong" },
                    { offset: 0x46, bit: 7, label: "Tiny Kong" },
                    { offset: 0x47, bit: 0, label: "Chunky Kong" },
                  ],
                },
                {
                  name: "Blueprints",
                  type: "bitflags",
                  flags: [
                    { offset: 0x3c, bit: 4, label: "Donkey Kong" },
                    { offset: 0x3c, bit: 5, label: "Diddy Kong" },
                    { offset: 0x3c, bit: 6, label: "Lanky Kong" },
                    { offset: 0x3c, bit: 7, label: "Tiny Kong" },
                    { offset: 0x3d, bit: 0, label: "Chunky Kong" },
                  ],
                },
              ],
            },
            {
              name: "Events",
              type: "bitflags",
              flags: [
                { offset: 0x37, bit: 5, label: "World unlocked" },
                { offset: 0x3a, bit: 0, label: "B. Locker gone" },
                { offset: 0x39, bit: 0, label: "Location visited", separator: true },
                { offset: 0x18, bit: 2, label: "Camera introduction seen", hidden: true },
                { offset: 0x61, bit: 5, label: "Logo animation seen", hidden: true },
                { offset: 0x15, bit: 0, label: "Boss Key obtained" },
                { offset: 0x4c, bit: 4, label: "Battle Crown obtained" },
              ],
            },
            {
              name: "Banana Fairies",
              type: "bitflags",
              flags: [
                { offset: 0x4a, bit: 0, label: "Inside one of the 3 chests" },
                { offset: 0x4b, bit: 3, label: "Inside Tiny's section of the sunken ship" },
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
                    characterFragment(0, "bananas", 3),
                    characterFragment(0, "fedBananas", 3),
                  ],
                },
                {
                  type: "section",
                  items: [
                    characterFragment(0, "goldenBananas", 3),
                    {
                      id: "goldenBananas-%index%-3-0",
                      name: "Golden Bananas",
                      type: "bitflags",
                      flags: [
                        { offset: 0x13, bit: 5, label: "Inside the lighthouse" },
                        { offset: 0x18, bit: 1, label: "Seal released" },
                        { offset: 0x14, bit: 5, label: "Race against the Seal won" },
                        { offset: 0x19, bit: 0, label: "Krazy Kong Klamour! cleared" },
                        { offset: 0x41, bit: 4, label: "Yellow blueprint given to Snide" },
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
                    characterFragment(1, "bananas", 3),
                    characterFragment(1, "fedBananas", 3),
                  ],
                },
                {
                  type: "section",
                  items: [
                    characterFragment(1, "goldenBananas", 3),
                    {
                      id: "goldenBananas-%index%-3-1",
                      name: "Golden Bananas",
                      type: "bitflags",
                      flags: [
                        { offset: 0x19, bit: 4, label: "At the top of the lighthouse" },
                        { offset: 0x14, bit: 7, label: "Inside the mechanical fish" },
                        { offset: 0x14, bit: 3, label: "Stealthy Snoop! cleared" },
                        { offset: 0x18, bit: 6, label: "Splish-Splash Salvage! cleared" },
                        { offset: 0x41, bit: 5, label: "Red blueprint given to Snide" },
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
                    characterFragment(2, "bananas", 3),
                    characterFragment(2, "fedBananas", 3),
                  ],
                },
                {
                  type: "section",
                  items: [
                    characterFragment(2, "goldenBananas", 3),
                    {
                      id: "goldenBananas-%index%-3-2",
                      name: "Golden Bananas",
                      type: "bitflags",
                      flags: [
                        { offset: 0x16, bit: 7, label: "Inside a secret room revealed with Enguarde" },
                        { offset: 0x18, bit: 0, label: "Inside a chest at the bottom of the lighthouse lake" },
                        { offset: 0x18, bit: 7, label: "Inside Lanky's section of the 4 doors sunken ship" },
                        { offset: 0x14, bit: 4, label: "Searchlight Seek! cleared" },
                        { offset: 0x41, bit: 6, label: "Blue blueprint given to Snide" },
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
                    characterFragment(3, "bananas", 3),
                    characterFragment(3, "fedBananas", 3),
                  ],
                },
                {
                  type: "section",
                  items: [
                    characterFragment(3, "goldenBananas", 3),
                    {
                      id: "goldenBananas-%index%-3-3",
                      name: "Golden Bananas",
                      type: "bitflags",
                      flags: [
                        { offset: 0x17, bit: 7, label: "Stolen pearls given back to the Mermaid" },
                        { offset: 0x19, bit: 1, label: "Inside Tiny's section of the 4 doors sunken ship" },
                        { offset: 0x17, bit: 0, label: "Kremling Kosh! cleared" },
                        { offset: 0x19, bit: 2, label: "Big Bug Bash! cleared" },
                        { offset: 0x41, bit: 7, label: "Purple blueprint given to Snide" },
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
                    characterFragment(4, "bananas", 3),
                    characterFragment(4, "fedBananas", 3),
                  ],
                },
                {
                  type: "section",
                  items: [
                    characterFragment(4, "goldenBananas", 3),
                    {
                      id: "goldenBananas-%index%-3-4",
                      name: "Golden Bananas",
                      type: "bitflags",
                      flags: [
                        { offset: 0x13, bit: 2, label: "Cannon challenge cleared" },
                        { offset: 0x14, bit: 6, label: "Inside the last rotating barrel" },
                        { offset: 0x16, bit: 6, label: "Inside one of the 3 chests" },
                        { offset: 0x18, bit: 5, label: "Batty Barrel Bandit! cleared" },
                        { offset: 0x42, bit: 0, label: "Green blueprint given to Snide" },
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
