import type { ItemTab } from "$lib/types";

export default {
  name: "Hideout Helm",
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
                { offset: 0x60, bit: 5, label: "<b>1.</b> Entrance" },
                { offset: 0x60, bit: 6, label: "<b>1.</b> Big Key Room" },
              ],
            },
            {
              id: "bananaMedals-%index%-7",
              name: "Banana Medals",
              type: "bitflags",
              flags: [
                { offset: 0x49, bit: 0, label: "Donkey Kong" },
                { offset: 0x49, bit: 1, label: "Diddy Kong" },
                { offset: 0x49, bit: 2, label: "Lanky Kong" },
                { offset: 0x49, bit: 3, label: "Tiny Kong" },
                { offset: 0x49, bit: 4, label: "Chunky Kong" },
              ],
            },
            {
              id: "miscHideoutHelm",
              name: "Events",
              type: "bitflags",
              flags: [
                { offset: 0x38, bit: 1, label: "World unlocked" },
                { offset: 0x3a, bit: 4, label: "B. Locker gone" },
                { offset: 0x39, bit: 4, label: "Location visited", separator: true },
                { offset: 0x62, bit: 2, label: "Logo animation seen", hidden: true },
                { offset: 0x60, bit: 2, label: "Blast-O-Matic disabled" },
                { offset: 0x2f, bit: 4, label: "Boss Key obtained" },
                { offset: 0x4d, bit: 2, label: "Battle Crown obtained" },
              ],
            },
            {
              name: "Banana Fairies",
              type: "bitflags",
              flags: [
                { offset: 0x4a, bit: 6, label: "Near the Boss Key" },
                { offset: 0x4a, bit: 7, label: "Near the Boss Key" },
              ],
            },
          ],
        },
      ],
    },
  ],
} as ItemTab;
