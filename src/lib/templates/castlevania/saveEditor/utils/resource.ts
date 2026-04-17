export const items: {
  id?: string;
  items: {
    index: number;
    name: string;
    flags?: { offset: number; bit: number }[];
  }[];
}[] = [
  {
    id: "usaExclude",
    items: [
      {
        index: 0x0,
        name: "Special1",
        flags: [
          { offset: 0x0, bit: 5 }, // Jewel obtained
          { offset: 0x42, bit: 0 }, // Bonus unlocked
        ],
      },
      {
        index: 0x1,
        name: "Special2",
        flags: [
          { offset: 0x13, bit: 7 }, // Jewel obtained
          { offset: 0x42, bit: 1 }, // Bonus unlocked
        ],
      },
      {
        index: 0x2,
        name: "Special3",
        flags: [
          { offset: 0x12, bit: 7 }, // Jewel obtained
          { offset: 0x42, bit: 2 }, // Bonus unlocked
        ],
      },
    ],
  },
  {
    id: "usaOnly",
    items: [
      {
        index: 0x0,
        name: "Special1",
        flags: [
          { offset: 0x0, bit: 5 }, // Jewel obtained
          { offset: 0x42, bit: 0 }, // Bonus unlocked
        ],
      },
      {
        index: 0x1,
        name: "Special2",
        flags: [
          { offset: 0x12, bit: 7 }, // Jewel obtained
          { offset: 0x42, bit: 1 }, // Bonus unlocked
        ],
      },
    ],
  },
  {
    id: "usaExclude",
    items: [
      { index: 0x3, name: "Roast chicken" },
      { index: 0x4, name: "Roast Beef" },
      { index: 0x5, name: "Healing kit" },
      { index: 0x6, name: "Purifying" },
      { index: 0x7, name: "Cure ampoule" },
    ],
  },
  {
    id: "usaOnly",
    items: [
      { index: 0x2, name: "Roast chicken" },
      { index: 0x3, name: "Roast Beef" },
      { index: 0x4, name: "Healing kit" },
      { index: 0x5, name: "Purifying" },
      { index: 0x6, name: "Cure ampoule" },
    ],
  },
  {
    items: [
      { index: 0x11, name: "Magical Nitro" },
      { index: 0x12, name: "Mandragora" },
      { index: 0x13, name: "Sun card" },
      { index: 0x14, name: "Moon card" },
    ],
  },
  {
    items: [
      {
        index: 0x16,
        name: "Achives key",
        flags: [
          { offset: 0x4, bit: 4 }, // Key obtained
          { offset: 0x4, bit: 7 }, // Key used
        ],
      },
      {
        index: 0x17,
        name: "Left Tower Key",
        flags: [
          { offset: 0x2b, bit: 6 }, // Key obtained
          { offset: 0x2a, bit: 5 }, // Key used
        ],
      },
      {
        index: 0x18,
        name: "Storeroom Key",
        flags: [
          { offset: 0x4, bit: 1 }, // Key obtained
          { offset: 0x4, bit: 5 }, // Key used
        ],
      },
      {
        index: 0x19,
        name: "Garden Key",
        flags: [
          { offset: 0x4, bit: 3 }, // Key obtained
          { offset: 0x4, bit: 6 }, // Key used
        ],
      },
      {
        index: 0x1a,
        name: "Copper Key",
        flags: [
          { offset: 0x2f, bit: 5 }, // Key obtained
          { offset: 0x2d, bit: 0 }, // Key used
        ],
      },
      {
        index: 0x1b,
        name: "Chamber Key",
        flags: [
          { offset: 0xd, bit: 6 }, // Key obtained
          { offset: 0xd, bit: 7 }, // Key used
        ],
      },
      {
        index: 0x1c,
        name: "Execution Key",
        flags: [
          { offset: 0x12, bit: 0 }, // Key obtained
          { offset: 0x13, bit: 6 }, // Key used
        ],
      },
    ],
  },
  {
    items: [
      {
        index: 0x1d,
        name: "Science Key1",
        flags: [
          { offset: 0x3f, bit: 0 }, // Key obtained
          { offset: 0x3e, bit: 1 }, // Key used
        ],
      },
      {
        index: 0x1e,
        name: "Science Key2",
        flags: [
          { offset: 0x3f, bit: 1 }, // Key obtained
          { offset: 0x3e, bit: 2 }, // Key used
        ],
      },
      {
        index: 0x1f,
        name: "Science Key3",
        flags: [
          { offset: 0x3f, bit: 2 }, // Key obtained
          { offset: 0x3e, bit: 3 }, // Key used
        ],
      },
    ],
  },
  {
    items: [
      {
        index: 0x20,
        name: "Clocktower Key1",
        flags: [
          { offset: 0x15, bit: 2 }, // Key obtained
          { offset: 0x15, bit: 5 }, // Key used
        ],
      },
      {
        index: 0x21,
        name: "Clocktower Key2",
        flags: [
          { offset: 0x15, bit: 3 }, // Key obtained
          { offset: 0x15, bit: 6 }, // Key used
        ],
      },
      {
        index: 0x22,
        name: "Clocktower Key3",
        flags: [
          { offset: 0x15, bit: 4 }, // Key obtained
          { offset: 0x15, bit: 7 }, // Key used
        ],
      },
    ],
  },
  {
    id: "usaExclude",
    items: [
      { index: 0x8, name: "PowerUp" },
      { index: 0xf, name: "The contract" },
      { index: 0x10, name: "engagement ring" },
      { index: 0x15, name: "Incandescent gaze" },
    ],
  },
  {
    id: "usaOnly",
    items: [
      { index: 0x7, name: "pot-pourri" },
      { index: 0x8, name: "PowerUp" },
      { index: 0xf, name: "The contract" },
      { index: 0x10, name: "engagement ring" },
      { index: 0x15, name: "Incandescent gaze" },
    ],
  },
];
