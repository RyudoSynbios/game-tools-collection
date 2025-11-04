import type { ItemTab } from "$lib/types";

import { characterFragment } from "../fragment";

export default {
  name: "DK Isles",
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
                    { offset: 0x36, bit: 1, label: "<b>1.</b> Training Area" },
                    { offset: 0x36, bit: 2, label: "<b>1.</b> K. Lumsy's Prison", separator: true },
                    { offset: 0x36, bit: 3, label: "<b>2.</b> Training Area" },
                    { offset: 0x36, bit: 4, label: "<b>2.</b> Angry Aztec lobby", separator: true },
                    { offset: 0x36, bit: 5, label: "<b>3.</b> Training Area" },
                    { offset: 0x36, bit: 6, label: "<b>3.</b> Waterfall", separator: true },
                    { offset: 0x36, bit: 7, label: "<b>4.</b> Training Area" },
                    { offset: 0x37, bit: 0, label: "<b>4.</b> Frantic Factory lobby", separator: true },
                    { offset: 0x37, bit: 2, label: "<b>5.</b> Training Area" },
                    { offset: 0x37, bit: 1, label: "<b>5.</b> Banana Fairy Island" },
                  ],
                },
                {
                  name: "Hideout Helm Lobby",
                  type: "bitflags",
                  flags: [
                    { offset: 0x34, bit: 1, label: "<b>1.</b> Entrance" },
                    { offset: 0x34, bit: 2, label: "<b>1.</b> Hideout Helm entrance" },
                  ],
                },
              ],
            },
            {
              name: "Blueprints",
              type: "bitflags",
              flags: [
                { offset: 0x3f, bit: 0, label: "Donkey Kong" },
                { offset: 0x3f, bit: 1, label: "Diddy Kong" },
                { offset: 0x3f, bit: 2, label: "Lanky Kong" },
                { offset: 0x3f, bit: 3, label: "Tiny Kong" },
                { offset: 0x3f, bit: 4, label: "Chunky Kong" },
              ],
            },
            {
              name: "Events",
              type: "bitflags",
              flags: [
                { offset: 0x4c, bit: 6, label: "Battle Crown 1 obtained" },
                { offset: 0x4c, bit: 7, label: "Battle Crown 2 obtained" },
                { offset: 0x60, bit: 7, label: "Funky's Store logo animation seen", hidden: true },
                { offset: 0x2e, bit: 6, label: "Funky's Store animation seen", hidden: true },
                { offset: 0x61, bit: 0, label: "Snade's HQ logo animation seen", hidden: true },
                { offset: 0x2e, bit: 4, label: "Snade's HQ animation seen", hidden: true },
                { offset: 0x61, bit: 1, label: "Cranky's Lab logo animation seen", hidden: true },
                { offset: 0x2e, bit: 7, label: "Cranky's Lab animation seen", hidden: true },
                { offset: 0x61, bit: 2, label: "Candy's Music Shop logo animation seen", hidden: true },
                { offset: 0x2e, bit: 5, label: "Candy's Music Shop animation seen", hidden: true },
                { offset: 0x62, bit: 1, label: "Troff 'n' Scoff logo animation seen", hidden: true },
              ],
            },
            {
              name: "Banana Fairies",
              type: "bitflags",
              flags: [
                { offset: 0x4b, bit: 6, label: "Around a tree near Banana Fairy Island" },
                { offset: 0x4a, bit: 1, label: "Inside a box in Frantic Factory lobby" },
                { offset: 0x4a, bit: 2, label: "Inside Fungi Forest lobby" },
                { offset: 0x4b, bit: 7, label: "At the top of Crocodile Isle" },
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
                  hidden: true,
                  items: [
                    characterFragment(0, "bananas", 7),
                    characterFragment(0, "fedBananas", 7),
                  ],
                },
                {
                  type: "section",
                  items: [
                    characterFragment(0, "goldenBananas", 7),
                    {
                      id: "goldenBananas-%index%-7-0",
                      name: "Golden Bananas",
                      type: "bitflags",
                      flags: [
                        { offset: 0x2f, bit: 5, label: "In front of Jungle Japes lobby entrance" },
                        { offset: 0x32, bit: 4, label: "Inside Frantic Factory lobby" },
                        { offset: 0x33, bit: 3, label: "Inside Crystal Caves lobby" },
                        { offset: 0x34, bit: 3, label: "Inside a cell in Crocodile Isle" },
                        { offset: 0x44, bit: 0, label: "Yellow blueprint given to Snide" },
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
                  hidden: true,
                  items: [
                    characterFragment(1, "bananas", 7),
                    characterFragment(1, "fedBananas", 7),
                  ],
                },
                {
                  type: "section",
                  items: [
                    characterFragment(1, "goldenBananas", 7),
                    {
                      id: "goldenBananas-%index%-7-1",
                      name: "Golden Bananas",
                      type: "bitflags",
                      flags: [
                        { offset: 0x33, bit: 2, label: "Inside Crystal Caves lobby" },
                        { offset: 0x34, bit: 7, label: "Inside a cell in a floating island" },
                        { offset: 0x34, bit: 0, label: "Batty Barrel Bandit! cleared" },
                        { offset: 0x35, bit: 4, label: "Peril Path Panic! cleared" },
                        { offset: 0x44, bit: 1, label: "Red blueprint given to Snide" },
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
                  hidden: true,
                  items: [
                    characterFragment(2, "bananas", 7),
                    characterFragment(2, "fedBananas", 7),
                  ],
                },
                {
                  type: "section",
                  items: [
                    characterFragment(2, "goldenBananas", 7),
                    {
                      id: "goldenBananas-%index%-7-2",
                      name: "Golden Bananas",
                      type: "bitflags",
                      flags: [
                        { offset: 0x31, bit: 6, label: "Inside Jungle Japes lobby" },
                        { offset: 0x34, bit: 5, label: "Behind K. Lumsy's Prison" },
                        { offset: 0x35, bit: 5, label: "Inside K. Lumsy's Prison" },
                        { offset: 0x33, bit: 7, label: "Searchlight Seek! cleared" },
                        { offset: 0x44, bit: 2, label: "Blue blueprint given to Snide" },
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
                  hidden: true,
                  items: [
                    characterFragment(3, "bananas", 7),
                    characterFragment(3, "fedBananas", 7),
                  ],
                },
                {
                  type: "section",
                  items: [
                    characterFragment(3, "goldenBananas", 7),
                    {
                      id: "goldenBananas-%index%-7-3",
                      name: "Golden Bananas",
                      type: "bitflags",
                      flags: [
                        { offset: 0x32, bit: 3, label: "Inside Gloomy Galleon lobby" },
                        { offset: 0x34, bit: 4, label: "Behind Banana Fairy Island" },
                        { offset: 0x35, bit: 1, label: "At the top of Crocodile Isle" },
                        { offset: 0x32, bit: 2, label: "Big Bug Bash! cleared" },
                        { offset: 0x44, bit: 3, label: "Purple blueprint given to Snide", separator: true },
                        { offset: 0x25, bit: 5, label: "All Banana Fairies rescued" },
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
                  hidden: true,
                  items: [
                    characterFragment(4, "bananas", 7),
                    characterFragment(4, "fedBananas", 7),
                  ],
                },
                {
                  type: "section",
                  items: [
                    characterFragment(4, "goldenBananas", 7),
                    {
                      id: "goldenBananas-%index%-7-4",
                      name: "Golden Bananas",
                      type: "bitflags",
                      flags: [
                        { offset: 0x34, bit: 6, label: "Inside a cell next to the waterfall" },
                        { offset: 0x35, bit: 0, label: "Near Angry Aztec lobby" },
                        { offset: 0x35, bit: 7, label: "Inside the giant rock" },
                        { offset: 0x32, bit: 6, label: "Kremling Kosh! cleared" },
                        { offset: 0x44, bit: 4, label: "Green blueprint given to Snide" },
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
