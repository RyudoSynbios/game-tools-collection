import type { GameJson } from "$lib/types";

const template: GameJson = {
  validator: {
    regions: {
      world: {
        $and: [
          { 0x0: [0x0, 0x0, 0x0, 0x0] },
          { 0x380: [0x77, 0x61, 0x72, 0x33] }, // "war3"
        ],
      },
    },
    text: "Drag 'n' drop here or click to add a save file.",
    hint: "Only works with World Map saves.",
    error: "Not a valid save file.",
  },
  items: [
    {
      name: "Checksum",
      offset: 0x791,
      type: "checksum",
      dataType: "uint16",
      bigEndian: true,
      control: {
        offsetStart: 0x384,
        offsetEnd: 0x3f0,
      },
    },
    {
      type: "tabs",
      items: [
        {
          name: "General",
          items: [
            {
              type: "section",
              flex: true,
              items: [
                {
                  name: "Save Initialized?",
                  offset: 0x3df,
                  type: "variable",
                  dataType: "bit",
                  bit: 0,
                  hidden: true,
                },
                {
                  name: "Save Count",
                  offset: 0x384,
                  type: "variable",
                  dataType: "uint32",
                  bigEndian: true,
                  hidden: true,
                  test: true,
                },
                {
                  name: "Language",
                  offset: 0x3ca,
                  type: "variable",
                  dataType: "uint8",
                  resource: "languages",
                },
                {
                  name: "Coins",
                  offset: 0x388,
                  type: "variable",
                  dataType: "uint16",
                  bigEndian: true,
                  binaryCodedDecimal: true,
                  max: 999,
                  test: true,
                },
                {
                  id: "time",
                  name: "Time",
                  offset: 0x3bf,
                  type: "variable",
                  dataType: "uint8",
                  resource: "times",
                },
              ],
            },
            {
              type: "section",
              flex: true,
              items: [
                {
                  name: "Power Ups",
                  type: "section",
                  background: true,
                  items: [
                    {
                      id: "powerUp-1",
                      name: "Ground Pound",
                      offset: 0x3c0,
                      type: "variable",
                      dataType: "boolean",
                    },
                    {
                      id: "powerUp-2",
                      name: "Swim",
                      offset: 0x3c0,
                      type: "variable",
                      dataType: "boolean",
                    },
                    {
                      id: "powerUp-3",
                      name: "Head Smash",
                      offset: 0x3c0,
                      type: "variable",
                      dataType: "boolean",
                    },
                    {
                      id: "powerUp-4",
                      name: "Throw",
                      offset: 0x3c0,
                      type: "variable",
                      dataType: "boolean",
                    },
                    {
                      id: "powerUp-5",
                      name: "Super Charge",
                      offset: 0x3c0,
                      type: "variable",
                      dataType: "boolean",
                    },
                    {
                      id: "powerUp-6",
                      name: "Super Ground Pound",
                      offset: 0x3c0,
                      type: "variable",
                      dataType: "boolean",
                    },
                    {
                      id: "powerUp-7",
                      name: "Super Jump",
                      offset: 0x3c0,
                      type: "variable",
                      dataType: "boolean",
                    },
                    {
                      id: "powerUp-8",
                      name: "Super Swim",
                      offset: 0x3c0,
                      type: "variable",
                      dataType: "boolean",
                    },
                    {
                      id: "powerUp-9",
                      name: "Super Throw",
                      offset: 0x3c0,
                      type: "variable",
                      dataType: "boolean",
                    },
                  ],
                },
                {
                  name: "Events",
                  type: "bitflags",
                  flags: [
                    { offset: 0x3c1, bit: 2, label: "Final boss seen" },
                    { offset: 0x3c1, bit: 0, label: "Final boss defeated" },
                    { offset: 0x3c1, bit: 1, label: "Time Attack enabled" },
                    { offset: 0x3c1, bit: 3, label: "???", hidden: true },
                    { offset: 0x3c1, bit: 4, label: "???", hidden: true },
                    { offset: 0x3c1, bit: 5, label: "???", hidden: true },
                    { offset: 0x3c1, bit: 6, label: "???", hidden: true },
                    { offset: 0x3c1, bit: 7, label: "???", hidden: true },
                  ],
                },
              ],
            },
            {
              type: "section",
              flex: true,
              hidden: true,
              items: [
                {
                  name: "Current Level (D/N)",
                  offset: 0x38a,
                  type: "variable",
                  dataType: "uint8",
                  hidden: true,
                },
                {
                  name: "Power Ups",
                  offset: 0x3c0,
                  type: "variable",
                  dataType: "uint8",
                  hidden: true,
                },
                {
                  name: "Cutscenes Related",
                  offset: 0x3ec,
                  type: "variable",
                  dataType: "uint8",
                  hidden: true,
                },
                {
                  name: "Cutscenes Related",
                  offset: 0x3ed,
                  type: "variable",
                  dataType: "uint8",
                  hidden: true,
                },
                {
                  name: "Last Visited Level",
                  offset: 0x3ee,
                  type: "variable",
                  dataType: "uint8",
                  hidden: true,
                },
              ],
            },
          ],
        },
        {
          name: "Levels",
          items: [
            {
              type: "tabs",
              vertical: true,
              items: [
                {
                  name: "N1 Out of the Woods",
                  items: [
                    {
                      id: "treasures-0",
                      name: "Treasures",
                      type: "bitflags",
                      flags: [
                        { offset: 0x3e2, bit: 3, label: "Axe" },
                        { offset: 0x3e1, bit: 5, label: "Rain Jar" },
                        { offset: 0x3df, bit: 6, label: "Super Flippers" },
                        { offset: 0x3df, bit: 5, label: "Music Box 5" },
                      ],
                    },
                    {
                      type: "bitflags",
                      flags: [
                        { offset: 0x3c2, bit: 0, label: "8 Musical Coins" },
                      ],
                    },
                    {
                      name: "Time Attack",
                      type: "group",
                      mode: "time",
                      items: [
                        {
                          id: "timeAttack-1",
                          offset: 0x38b,
                          type: "variable",
                          dataType: "uint8",
                          binaryCodedDecimal: true,
                          leadingZeros: 1,
                          max: 59,
                        },
                        {
                          id: "timeAttack-2",
                          offset: 0x38c,
                          type: "variable",
                          dataType: "uint8",
                          binaryCodedDecimal: true,
                          leadingZeros: 1,
                          max: 59,
                        },
                      ],
                    },
                  ],
                },
                {
                  name: "N2 The Peaceful Village",
                  items: [
                    {
                      id: "treasures-0",
                      name: "Treasures",
                      type: "bitflags",
                      flags: [
                        { offset: 0x3e2, bit: 7, label: "Half of Tablet (Blue)" },
                        { offset: 0x3e1, bit: 7, label: "Ice Spellbook" },
                        { offset: 0x3e9, bit: 7, label: "Chalice" },
                        { offset: 0x3e8, bit: 5, label: "Day / Night Tablet" },
                      ],
                    },
                    {
                      type: "bitflags",
                      flags: [
                        { offset: 0x3c2, bit: 1, label: "8 Musical Coins" },
                      ],
                    },
                    {
                      name: "Time Attack",
                      type: "group",
                      mode: "time",
                      items: [
                        {
                          id: "timeAttack-1",
                          offset: 0x38d,
                          type: "variable",
                          dataType: "uint8",
                          binaryCodedDecimal: true,
                          leadingZeros: 1,
                          max: 59,
                        },
                        {
                          id: "timeAttack-2",
                          offset: 0x38e,
                          type: "variable",
                          dataType: "uint8",
                          binaryCodedDecimal: true,
                          leadingZeros: 1,
                          max: 59,
                        },
                      ],
                    },
                  ],
                },
                {
                  name: "N3 The Vast Plain",
                  items: [
                    {
                      id: "treasures-0",
                      name: "Treasures",
                      type: "bitflags",
                      flags: [
                        { offset: 0x3e3, bit: 0, label: "Half of Tablet (Green)" },
                        { offset: 0x3eb, bit: 3, label: "Crayon (Blue)" },
                        { offset: 0x3e2, bit: 6, label: "Red Skull" },
                        { offset: 0x3e8, bit: 6, label: "Bracelet (Red)" },
                      ],
                    },
                    {
                      type: "bitflags",
                      flags: [
                        { offset: 0x3c2, bit: 2, label: "8 Musical Coins" },
                      ],
                    },
                    {
                      name: "Time Attack",
                      type: "group",
                      mode: "time",
                      items: [
                        {
                          id: "timeAttack-1",
                          offset: 0x38f,
                          type: "variable",
                          dataType: "uint8",
                          binaryCodedDecimal: true,
                          leadingZeros: 1,
                          max: 59,
                        },
                        {
                          id: "timeAttack-2",
                          offset: 0x390,
                          type: "variable",
                          dataType: "uint8",
                          binaryCodedDecimal: true,
                          leadingZeros: 1,
                          max: 59,
                        },
                      ],
                    },
                  ],
                },
                {
                  name: "N4 Bank of the Wild River",
                  items: [
                    {
                      id: "treasures-0",
                      name: "Treasures",
                      type: "bitflags",
                      flags: [
                        { offset: 0x3e2, bit: 2, label: "Trident" },
                        { offset: 0x3ea, bit: 1, label: "Magnifying Glass" },
                        { offset: 0x3e4, bit: 6, label: "Statue" },
                        { offset: 0x3e5, bit: 7, label: "Rocket" },
                      ],
                    },
                    {
                      type: "bitflags",
                      flags: [
                        { offset: 0x3c2, bit: 3, label: "8 Musical Coins" },
                      ],
                    },
                    {
                      name: "Time Attack",
                      type: "group",
                      mode: "time",
                      items: [
                        {
                          id: "timeAttack-1",
                          offset: 0x391,
                          type: "variable",
                          dataType: "uint8",
                          binaryCodedDecimal: true,
                          leadingZeros: 1,
                          max: 59,
                        },
                        {
                          id: "timeAttack-2",
                          offset: 0x392,
                          type: "variable",
                          dataType: "uint8",
                          binaryCodedDecimal: true,
                          leadingZeros: 1,
                          max: 59,
                        },
                      ],
                    },
                  ],
                },
                {
                  name: "N5 The Tidal Coast",
                  items: [
                    {
                      id: "treasures-0",
                      name: "Treasures",
                      type: "bitflags",
                      flags: [
                        { offset: 0x3e2, bit: 1, label: "Lightning Spellbook" },
                        { offset: 0x3e6, bit: 7, label: "Foot of Stone" },
                        { offset: 0x3e4, bit: 4, label: "Electric Fan Propeller" },
                        { offset: 0x3e8, bit: 7, label: "Bracelet (Green)" },
                      ],
                    },
                    {
                      type: "bitflags",
                      flags: [
                        { offset: 0x3c2, bit: 4, label: "8 Musical Coins" },
                      ],
                    },
                    {
                      name: "Time Attack",
                      type: "group",
                      mode: "time",
                      items: [
                        {
                          id: "timeAttack-1",
                          offset: 0x393,
                          type: "variable",
                          dataType: "uint8",
                          binaryCodedDecimal: true,
                          leadingZeros: 1,
                          max: 59,
                        },
                        {
                          id: "timeAttack-2",
                          offset: 0x394,
                          type: "variable",
                          dataType: "uint8",
                          binaryCodedDecimal: true,
                          leadingZeros: 1,
                          max: 59,
                        },
                      ],
                    },
                  ],
                },
                {
                  name: "N6 Sea Turtle Rocks",
                  items: [
                    {
                      id: "treasures-0",
                      name: "Treasures",
                      type: "bitflags",
                      flags: [
                        { offset: 0x3df, bit: 3, label: "Music Box 3" },
                        { offset: 0x3e7, bit: 0, label: "Golden Snake Eye (Left)" },
                        { offset: 0x3e7, bit: 5, label: "Half of Sun Stone (Left)" },
                        { offset: 0x3e8, bit: 2, label: "Gong" },
                      ],
                    },
                    {
                      type: "bitflags",
                      flags: [
                        { offset: 0x3c2, bit: 5, label: "8 Musical Coins" },
                      ],
                    },
                    {
                      name: "Time Attack",
                      type: "group",
                      mode: "time",
                      items: [
                        {
                          id: "timeAttack-1",
                          offset: 0x395,
                          type: "variable",
                          dataType: "uint8",
                          binaryCodedDecimal: true,
                          leadingZeros: 1,
                          max: 59,
                        },
                        {
                          id: "timeAttack-2",
                          offset: 0x396,
                          type: "variable",
                          dataType: "uint8",
                          binaryCodedDecimal: true,
                          leadingZeros: 1,
                          max: 59,
                        },
                      ],
                    },
                  ],
                },
                {
                  name: "W1 Desert Ruins",
                  items: [
                    {
                      id: "treasures-0",
                      name: "Treasures",
                      type: "bitflags",
                      flags: [
                        { offset: 0x3e3, bit: 2, label: "Half of Scroll (Top)" },
                        { offset: 0x3e3, bit: 3, label: "Half of Scroll (Bottom)" },
                        { offset: 0x3eb, bit: 4, label: "Crayon (Pink)" },
                        { offset: 0x3e7, bit: 6, label: "Half of Sun Stone (Right)" },
                      ],
                    },
                    {
                      type: "bitflags",
                      flags: [
                        { offset: 0x3c2, bit: 6, label: "8 Musical Coins" },
                      ],
                    },
                    {
                      name: "Time Attack",
                      type: "group",
                      mode: "time",
                      items: [
                        {
                          id: "timeAttack-1",
                          offset: 0x397,
                          type: "variable",
                          dataType: "uint8",
                          binaryCodedDecimal: true,
                          leadingZeros: 1,
                          max: 59,
                        },
                        {
                          id: "timeAttack-2",
                          offset: 0x398,
                          type: "variable",
                          dataType: "uint8",
                          binaryCodedDecimal: true,
                          leadingZeros: 1,
                          max: 59,
                        },
                      ],
                    },
                  ],
                },
                {
                  name: "W2 The Volcano's Base",
                  items: [
                    {
                      id: "treasures-0",
                      name: "Treasures",
                      type: "bitflags",
                      flags: [
                        { offset: 0x3e0, bit: 4, label: "Blue Overalls" },
                        { offset: 0x3e9, bit: 0, label: "Bracelet (Blue)" },
                        { offset: 0x3e8, bit: 4, label: "Crown" },
                        { offset: 0x3e3, bit: 4, label: "Leaf" },
                      ],
                    },
                    {
                      type: "bitflags",
                      flags: [
                        { offset: 0x3c2, bit: 7, label: "8 Musical Coins" },
                      ],
                    },
                    {
                      name: "Time Attack",
                      type: "group",
                      mode: "time",
                      items: [
                        {
                          id: "timeAttack-1",
                          offset: 0x399,
                          type: "variable",
                          dataType: "uint8",
                          binaryCodedDecimal: true,
                          leadingZeros: 1,
                          max: 59,
                        },
                        {
                          id: "timeAttack-2",
                          offset: 0x39a,
                          type: "variable",
                          dataType: "uint8",
                          binaryCodedDecimal: true,
                          leadingZeros: 1,
                          max: 59,
                        },
                      ],
                    },
                  ],
                },
                {
                  name: "W3 The Pool of Rain",
                  items: [
                    {
                      id: "treasures-0",
                      name: "Treasures",
                      type: "bitflags",
                      flags: [
                        { offset: 0x3e1, bit: 2, label: "Screw" },
                        { offset: 0x3e2, bit: 5, label: "Blue Skull" },
                        { offset: 0x3e3, bit: 1, label: "Ornamental Fan" },
                        { offset: 0x3eb, bit: 0, label: "Crayon (Yellow)" },
                      ],
                    },
                    {
                      type: "bitflags",
                      flags: [
                        { offset: 0x3c3, bit: 0, label: "8 Musical Coins" },
                      ],
                    },
                    {
                      name: "Time Attack",
                      type: "group",
                      mode: "time",
                      items: [
                        {
                          id: "timeAttack-1",
                          offset: 0x39b,
                          type: "variable",
                          dataType: "uint8",
                          binaryCodedDecimal: true,
                          leadingZeros: 1,
                          max: 59,
                        },
                        {
                          id: "timeAttack-2",
                          offset: 0x39c,
                          type: "variable",
                          dataType: "uint8",
                          binaryCodedDecimal: true,
                          leadingZeros: 1,
                          max: 59,
                        },
                      ],
                    },
                  ],
                },
                {
                  name: "W4 A Town in Chaos",
                  items: [
                    {
                      id: "treasures-0",
                      name: "Treasures",
                      type: "bitflags",
                      flags: [
                        { offset: 0x3e1, bit: 3, label: "Cog" },
                        { offset: 0x3df, bit: 2, label: "Music Box 2" },
                        { offset: 0x3e7, bit: 1, label: "Golden Snake Eye (Right)" },
                        { offset: 0x3e4, bit: 2, label: "Fruit" },
                      ],
                    },
                    {
                      type: "bitflags",
                      flags: [
                        { offset: 0x3c3, bit: 1, label: "8 Musical Coins" },
                      ],
                    },
                    {
                      name: "Time Attack",
                      type: "group",
                      mode: "time",
                      items: [
                        {
                          id: "timeAttack-1",
                          offset: 0x39d,
                          type: "variable",
                          dataType: "uint8",
                          binaryCodedDecimal: true,
                          leadingZeros: 1,
                          max: 59,
                        },
                        {
                          id: "timeAttack-2",
                          offset: 0x39e,
                          type: "variable",
                          dataType: "uint8",
                          binaryCodedDecimal: true,
                          leadingZeros: 1,
                          max: 59,
                        },
                      ],
                    },
                  ],
                },
                {
                  name: "W5 Beneath the Waves",
                  items: [
                    {
                      id: "treasures-0",
                      name: "Treasures",
                      type: "bitflags",
                      flags: [
                        { offset: 0x3e4, bit: 7, label: "Detonator" },
                        { offset: 0x3ea, bit: 6, label: "Crayon (Red)" },
                        { offset: 0x3e4, bit: 0, label: "Red Chemical" },
                        { offset: 0x3e9, bit: 1, label: "Crest (Club)" },
                      ],
                    },
                    {
                      type: "bitflags",
                      flags: [
                        { offset: 0x3c3, bit: 2, label: "8 Musical Coins" },
                      ],
                    },
                    {
                      name: "Time Attack",
                      type: "group",
                      mode: "time",
                      items: [
                        {
                          id: "timeAttack-1",
                          offset: 0x39f,
                          type: "variable",
                          dataType: "uint8",
                          binaryCodedDecimal: true,
                          leadingZeros: 1,
                          max: 59,
                        },
                        {
                          id: "timeAttack-2",
                          offset: 0x3a0,
                          type: "variable",
                          dataType: "uint8",
                          binaryCodedDecimal: true,
                          leadingZeros: 1,
                          max: 59,
                        },
                      ],
                    },
                  ],
                },
                {
                  name: "W6 The West Crater",
                  items: [
                    {
                      id: "treasures-0",
                      name: "Treasures",
                      type: "bitflags",
                      flags: [
                        { offset: 0x3e7, bit: 2, label: "Blue Snake Eye (Left)" },
                        { offset: 0x3e9, bit: 6, label: "Saber" },
                        { offset: 0x3e5, bit: 1, label: "Box" },
                        { offset: 0x3e9, bit: 2, label: "Crest (Spade)" },
                      ],
                    },
                    {
                      type: "bitflags",
                      flags: [
                        { offset: 0x3c3, bit: 3, label: "8 Musical Coins" },
                      ],
                    },
                    {
                      name: "Time Attack",
                      type: "group",
                      mode: "time",
                      items: [
                        {
                          id: "timeAttack-1",
                          offset: 0x3a1,
                          type: "variable",
                          dataType: "uint8",
                          binaryCodedDecimal: true,
                          leadingZeros: 1,
                          max: 59,
                        },
                        {
                          id: "timeAttack-2",
                          offset: 0x3a2,
                          type: "variable",
                          dataType: "uint8",
                          binaryCodedDecimal: true,
                          leadingZeros: 1,
                          max: 59,
                        },
                      ],
                    },
                  ],
                },
                {
                  name: "S1 The Grasslands",
                  items: [
                    {
                      id: "treasures-0",
                      name: "Treasures",
                      type: "bitflags",
                      flags: [
                        { offset: 0x3df, bit: 1, label: "Music Box 1" },
                        { offset: 0x3e6, bit: 5, label: "Wheels" },
                        { offset: 0x3e2, bit: 4, label: "Lightning Wand" },
                        { offset: 0x3e6, bit: 4, label: "Doll" },
                      ],
                    },
                    {
                      type: "bitflags",
                      flags: [
                        { offset: 0x3c3, bit: 4, label: "8 Musical Coins" },
                      ],
                    },
                    {
                      name: "Time Attack",
                      type: "group",
                      mode: "time",
                      items: [
                        {
                          id: "timeAttack-1",
                          offset: 0x3a3,
                          type: "variable",
                          dataType: "uint8",
                          binaryCodedDecimal: true,
                          leadingZeros: 1,
                          max: 59,
                        },
                        {
                          id: "timeAttack-2",
                          offset: 0x3a4,
                          type: "variable",
                          dataType: "uint8",
                          binaryCodedDecimal: true,
                          leadingZeros: 1,
                          max: 59,
                        },
                      ],
                    },
                  ],
                },
                {
                  name: "S2 The Big Bridge",
                  items: [
                    {
                      id: "treasures-0",
                      name: "Treasures",
                      type: "bitflags",
                      flags: [
                        { offset: 0x3e8, bit: 0, label: "Seed" },
                        { offset: 0x3eb, bit: 2, label: "Crayon (Cyan)" },
                        { offset: 0x3e6, bit: 0, label: "Pokémon Pikachu" },
                        { offset: 0x3e0, bit: 7, label: "Lantern" },
                      ],
                    },
                    {
                      type: "bitflags",
                      flags: [
                        { offset: 0x3c3, bit: 5, label: "8 Musical Coins" },
                      ],
                    },
                    {
                      name: "Time Attack",
                      type: "group",
                      mode: "time",
                      items: [
                        {
                          id: "timeAttack-1",
                          offset: 0x3a5,
                          type: "variable",
                          dataType: "uint8",
                          binaryCodedDecimal: true,
                          leadingZeros: 1,
                          max: 59,
                        },
                        {
                          id: "timeAttack-2",
                          offset: 0x3a6,
                          type: "variable",
                          dataType: "uint8",
                          binaryCodedDecimal: true,
                          leadingZeros: 1,
                          max: 59,
                        },
                      ],
                    },
                  ],
                },
                {
                  name: "S3 Tower of Revival",
                  items: [
                    {
                      id: "treasures-0",
                      name: "Treasures",
                      type: "bitflags",
                      flags: [
                        { offset: 0x3df, bit: 7, label: "Flippers" },
                        { offset: 0x3e0, bit: 2, label: "Garlic" },
                        { offset: 0x3e1, bit: 6, label: "Treasure Map" },
                        { offset: 0x3e2, bit: 0, label: "Key" },
                      ],
                    },
                    {
                      type: "bitflags",
                      flags: [
                        { offset: 0x3c3, bit: 6, label: "8 Musical Coins" },
                      ],
                    },
                    {
                      name: "Time Attack",
                      type: "group",
                      mode: "time",
                      items: [
                        {
                          id: "timeAttack-1",
                          offset: 0x3a7,
                          type: "variable",
                          dataType: "uint8",
                          binaryCodedDecimal: true,
                          leadingZeros: 1,
                          max: 59,
                        },
                        {
                          id: "timeAttack-2",
                          offset: 0x3a8,
                          type: "variable",
                          dataType: "uint8",
                          binaryCodedDecimal: true,
                          leadingZeros: 1,
                          max: 59,
                        },
                      ],
                    },
                  ],
                },
                {
                  name: "S4 The Steep Canyon",
                  items: [
                    {
                      id: "treasures-0",
                      name: "Treasures",
                      type: "bitflags",
                      flags: [
                        { offset: 0x3e0, bit: 3, label: "Red Glove" },
                        { offset: 0x3e3, bit: 5, label: "Conch" },
                        { offset: 0x3e8, bit: 3, label: "Telephone" },
                        { offset: 0x3e3, bit: 7, label: "Blue Chemical" },
                      ],
                    },
                    {
                      type: "bitflags",
                      flags: [
                        { offset: 0x3c3, bit: 7, label: "8 Musical Coins" },
                      ],
                    },
                    {
                      name: "Time Attack",
                      type: "group",
                      mode: "time",
                      items: [
                        {
                          id: "timeAttack-1",
                          offset: 0x3a9,
                          type: "variable",
                          dataType: "uint8",
                          binaryCodedDecimal: true,
                          leadingZeros: 1,
                          max: 59,
                        },
                        {
                          id: "timeAttack-2",
                          offset: 0x3aa,
                          type: "variable",
                          dataType: "uint8",
                          binaryCodedDecimal: true,
                          leadingZeros: 1,
                          max: 59,
                        },
                      ],
                    },
                  ],
                },
                {
                  name: "S5 Cave of Flames",
                  items: [
                    {
                      id: "treasures-0",
                      name: "Treasures",
                      type: "bitflags",
                      flags: [
                        { offset: 0x3e7, bit: 4, label: "Water Wand" },
                        { offset: 0x3ea, bit: 3, label: "Toy Car" },
                        { offset: 0x3e8, bit: 1, label: "Sack" },
                        { offset: 0x3e5, bit: 0, label: "Scissors" },
                      ],
                    },
                    {
                      type: "bitflags",
                      flags: [
                        { offset: 0x3c4, bit: 0, label: "8 Musical Coins" },
                      ],
                    },
                    {
                      name: "Time Attack",
                      type: "group",
                      mode: "time",
                      items: [
                        {
                          id: "timeAttack-1",
                          offset: 0x3ab,
                          type: "variable",
                          dataType: "uint8",
                          binaryCodedDecimal: true,
                          leadingZeros: 1,
                          max: 59,
                        },
                        {
                          id: "timeAttack-2",
                          offset: 0x3ac,
                          type: "variable",
                          dataType: "uint8",
                          binaryCodedDecimal: true,
                          leadingZeros: 1,
                          max: 59,
                        },
                      ],
                    },
                  ],
                },
                {
                  name: "S6 Above the Clouds",
                  items: [
                    {
                      id: "treasures-0",
                      name: "Treasures",
                      type: "bitflags",
                      flags: [
                        { offset: 0x3eb, bit: 1, label: "Crayon (Green)" },
                        { offset: 0x3ea, bit: 5, label: "Fire Extinguisher" },
                        { offset: 0x3e5, bit: 5, label: "Drill" },
                        { offset: 0x3e5, bit: 6, label: "Pickaxe" },
                      ],
                    },
                    {
                      type: "bitflags",
                      flags: [
                        { offset: 0x3c4, bit: 1, label: "8 Musical Coins" },
                      ],
                    },
                    {
                      name: "Time Attack",
                      type: "group",
                      mode: "time",
                      items: [
                        {
                          id: "timeAttack-1",
                          offset: 0x3ad,
                          type: "variable",
                          dataType: "uint8",
                          binaryCodedDecimal: true,
                          leadingZeros: 1,
                          max: 59,
                        },
                        {
                          id: "timeAttack-2",
                          offset: 0x3ae,
                          type: "variable",
                          dataType: "uint8",
                          binaryCodedDecimal: true,
                          leadingZeros: 1,
                          max: 59,
                        },
                      ],
                    },
                  ],
                },
                {
                  name: "E1 The Stagnant Swamp",
                  items: [
                    {
                      id: "treasures-0",
                      name: "Treasures",
                      type: "bitflags",
                      flags: [
                        { offset: 0x3e6, bit: 6, label: "Flute" },
                        { offset: 0x3e3, bit: 6, label: "Pinecone" },
                        { offset: 0x3df, bit: 4, label: "Music Box 4" },
                        { offset: 0x3e7, bit: 7, label: "Whirlwind" },
                      ],
                    },
                    {
                      type: "bitflags",
                      flags: [
                        { offset: 0x3c4, bit: 2, label: "8 Musical Coins" },
                      ],
                    },
                    {
                      name: "Time Attack",
                      type: "group",
                      mode: "time",
                      items: [
                        {
                          id: "timeAttack-1",
                          offset: 0x3af,
                          type: "variable",
                          dataType: "uint8",
                          binaryCodedDecimal: true,
                          leadingZeros: 1,
                          max: 59,
                        },
                        {
                          id: "timeAttack-2",
                          offset: 0x3b0,
                          type: "variable",
                          dataType: "uint8",
                          binaryCodedDecimal: true,
                          leadingZeros: 1,
                          max: 59,
                        },
                      ],
                    },
                  ],
                },
                {
                  name: "E2 The Frigid Sea",
                  items: [
                    {
                      id: "treasures-0",
                      name: "Treasures",
                      type: "bitflags",
                      flags: [
                        { offset: 0x3e0, bit: 6, label: "Spike Helmet" },
                        { offset: 0x3ea, bit: 0, label: "Teapot" },
                        { offset: 0x3e1, bit: 0, label: "Campfire" },
                        { offset: 0x3ea, bit: 2, label: "UFO" },
                      ],
                    },
                    {
                      type: "bitflags",
                      flags: [
                        { offset: 0x3c4, bit: 3, label: "8 Musical Coins" },
                      ],
                    },
                    {
                      name: "Time Attack",
                      type: "group",
                      mode: "time",
                      items: [
                        {
                          id: "timeAttack-1",
                          offset: 0x3b1,
                          type: "variable",
                          dataType: "uint8",
                          binaryCodedDecimal: true,
                          leadingZeros: 1,
                          max: 59,
                        },
                        {
                          id: "timeAttack-2",
                          offset: 0x3b2,
                          type: "variable",
                          dataType: "uint8",
                          binaryCodedDecimal: true,
                          leadingZeros: 1,
                          max: 59,
                        },
                      ],
                    },
                  ],
                },
                {
                  name: "E3 Castle of Illusions",
                  items: [
                    {
                      id: "treasures-0",
                      name: "Treasures",
                      type: "bitflags",
                      flags: [
                        { offset: 0x3e0, bit: 5, label: "Red Overalls" },
                        { offset: 0x3e1, bit: 1, label: "Torch" },
                        { offset: 0x3e6, bit: 3, label: "Sand" },
                        { offset: 0x3e4, bit: 5, label: "Rust Spray" },
                      ],
                    },
                    {
                      type: "bitflags",
                      flags: [
                        { offset: 0x3c4, bit: 4, label: "8 Musical Coins" },
                      ],
                    },
                    {
                      name: "Time Attack",
                      type: "group",
                      mode: "time",
                      items: [
                        {
                          id: "timeAttack-1",
                          offset: 0x3b3,
                          type: "variable",
                          dataType: "uint8",
                          binaryCodedDecimal: true,
                          leadingZeros: 1,
                          max: 59,
                        },
                        {
                          id: "timeAttack-2",
                          offset: 0x3b4,
                          type: "variable",
                          dataType: "uint8",
                          binaryCodedDecimal: true,
                          leadingZeros: 1,
                          max: 59,
                        },
                      ],
                    },
                  ],
                },
                {
                  name: "E4 The Colossal Hole",
                  items: [
                    {
                      id: "treasures-0",
                      name: "Treasures",
                      type: "bitflags",
                      flags: [
                        { offset: 0x3e7, bit: 3, label: "Blue Snake Eye (Right)" },
                        { offset: 0x3e4, bit: 1, label: "Pump" },
                        { offset: 0x3e0, bit: 0, label: "Winged Boots" },
                        { offset: 0x3ea, bit: 4, label: "Toy Train" },
                      ],
                    },
                    {
                      type: "bitflags",
                      flags: [
                        { offset: 0x3c4, bit: 5, label: "8 Musical Coins" },
                      ],
                    },
                    {
                      name: "Time Attack",
                      type: "group",
                      mode: "time",
                      items: [
                        {
                          id: "timeAttack-1",
                          offset: 0x3b5,
                          type: "variable",
                          dataType: "uint8",
                          binaryCodedDecimal: true,
                          leadingZeros: 1,
                          max: 59,
                        },
                        {
                          id: "timeAttack-2",
                          offset: 0x3b6,
                          type: "variable",
                          dataType: "uint8",
                          binaryCodedDecimal: true,
                          leadingZeros: 1,
                          max: 59,
                        },
                      ],
                    },
                  ],
                },
                {
                  name: "E5 The Warped Void",
                  items: [
                    {
                      id: "treasures-0",
                      name: "Treasures",
                      type: "bitflags",
                      flags: [
                        { offset: 0x3e6, bit: 1, label: "Valve" },
                        { offset: 0x3ea, bit: 7, label: "Crayon (Brown)" },
                        { offset: 0x3e6, bit: 2, label: "Blood" },
                        { offset: 0x3e9, bit: 3, label: "Crest (Heart)" },
                      ],
                    },
                    {
                      type: "bitflags",
                      flags: [
                        { offset: 0x3c4, bit: 6, label: "8 Musical Coins" },
                      ],
                    },
                    {
                      name: "Time Attack",
                      type: "group",
                      mode: "time",
                      items: [
                        {
                          id: "timeAttack-1",
                          offset: 0x3b7,
                          type: "variable",
                          dataType: "uint8",
                          binaryCodedDecimal: true,
                          leadingZeros: 1,
                          max: 59,
                        },
                        {
                          id: "timeAttack-2",
                          offset: 0x3b8,
                          type: "variable",
                          dataType: "uint8",
                          binaryCodedDecimal: true,
                          leadingZeros: 1,
                          max: 59,
                        },
                      ],
                    },
                  ],
                },
                {
                  name: "E6 The East Crater",
                  items: [
                    {
                      id: "treasures-0",
                      name: "Treasures",
                      type: "bitflags",
                      flags: [
                        { offset: 0x3e0, bit: 1, label: "Brown Glove" },
                        { offset: 0x3e9, bit: 4, label: "Crest (Diamond)" },
                        { offset: 0x3e4, bit: 3, label: "Night Vision Scope" },
                        { offset: 0x3e9, bit: 5, label: "Gloom" },
                      ],
                    },
                    {
                      type: "bitflags",
                      flags: [
                        { offset: 0x3c4, bit: 7, label: "8 Musical Coins" },
                      ],
                    },
                    {
                      name: "Time Attack",
                      type: "group",
                      mode: "time",
                      items: [
                        {
                          id: "timeAttack-1",
                          offset: 0x3b9,
                          type: "variable",
                          dataType: "uint8",
                          binaryCodedDecimal: true,
                          leadingZeros: 1,
                          max: 59,
                        },
                        {
                          id: "timeAttack-2",
                          offset: 0x3ba,
                          type: "variable",
                          dataType: "uint8",
                          binaryCodedDecimal: true,
                          leadingZeros: 1,
                          max: 59,
                        },
                      ],
                    },
                  ],
                },
                {
                  name: "E7 Forest of Fear",
                  items: [
                    {
                      id: "treasures-0",
                      name: "Treasures",
                      type: "bitflags",
                      flags: [
                        { offset: 0x3e1, bit: 4, label: "Pocket Mirror" },
                        { offset: 0x3e5, bit: 3, label: "Key Card (Red)" },
                        { offset: 0x3e5, bit: 2, label: "Remote Control" },
                        { offset: 0x3e5, bit: 4, label: "Key Card (Blue)" },
                      ],
                    },
                    {
                      type: "bitflags",
                      flags: [
                        { offset: 0x3c5, bit: 0, label: "8 Musical Coins" },
                      ],
                    },
                    {
                      name: "Time Attack",
                      type: "group",
                      mode: "time",
                      items: [
                        {
                          id: "timeAttack-1",
                          offset: 0x3bb,
                          type: "variable",
                          dataType: "uint8",
                          binaryCodedDecimal: true,
                          leadingZeros: 1,
                          max: 59,
                        },
                        {
                          id: "timeAttack-2",
                          offset: 0x3bc,
                          type: "variable",
                          dataType: "uint8",
                          binaryCodedDecimal: true,
                          leadingZeros: 1,
                          max: 59,
                        },
                      ],
                    },
                  ],
                },
              ],
            },
          ],
        },
        {
          name: "Treasures",
          items: [
            {
              id: "treasureCount",
              name: "Total",
              offset: 0x3bd,
              type: "variable",
              dataType: "uint16",
              bigEndian: true,
              binaryCodedDecimal: true,
              disabled: true,
            },
            {
              type: "section",
              flex: true,
              items: [
                {
                  id: "treasures-1",
                  type: "bitflags",
                  flags: [
                    { offset: 0x3df, bit: 1, label: "Music Box 1" },
                    { offset: 0x3df, bit: 2, label: "Music Box 2" },
                    { offset: 0x3df, bit: 3, label: "Music Box 3" },
                    { offset: 0x3df, bit: 4, label: "Music Box 4" },
                    { offset: 0x3df, bit: 5, label: "Music Box 5", separator: true },
                    { offset: 0x3df, bit: 6, label: "Super Flippers" },
                    { offset: 0x3df, bit: 7, label: "Flippers" },
                    { offset: 0x3e0, bit: 0, label: "Winged Boots" },
                    { offset: 0x3e0, bit: 1, label: "Brown Glove" },
                    { offset: 0x3e0, bit: 2, label: "Garlic", separator: true },
                    { offset: 0x3e0, bit: 3, label: "Red Glove" },
                    { offset: 0x3e0, bit: 4, label: "Blue Overalls" },
                    { offset: 0x3e0, bit: 5, label: "Red Overalls" },
                    { offset: 0x3e0, bit: 6, label: "Spike Helmet" },
                    { offset: 0x3e0, bit: 7, label: "Lantern", separator: true },
                    { offset: 0x3e1, bit: 0, label: "Campfire" },
                    { offset: 0x3e1, bit: 1, label: "Torch" },
                    { offset: 0x3e1, bit: 2, label: "Screw" },
                    { offset: 0x3e1, bit: 3, label: "Cog" },
                    { offset: 0x3e1, bit: 4, label: "Pocket Mirror" },
                  ],
                },
                {
                  id: "treasures-2",
                  type: "bitflags",
                  flags: [
                    { offset: 0x3e1, bit: 5, label: "Rain Jar" },
                    { offset: 0x3e1, bit: 6, label: "Treasure Map" },
                    { offset: 0x3e1, bit: 7, label: "Ice Spellbook" },
                    { offset: 0x3e2, bit: 0, label: "Key" },
                    { offset: 0x3e2, bit: 1, label: "Lightning Spellbook", separator: true },
                    { offset: 0x3e2, bit: 2, label: "Trident" },
                    { offset: 0x3e2, bit: 3, label: "Axe" },
                    { offset: 0x3e2, bit: 4, label: "Lightning Wand" },
                    { offset: 0x3e2, bit: 5, label: "Blue Skull" },
                    { offset: 0x3e2, bit: 6, label: "Red Skull", separator: true },
                    { offset: 0x3e2, bit: 7, label: "Half of Tablet (Blue)" },
                    { offset: 0x3e3, bit: 0, label: "Half of Tablet (Green)" },
                    { offset: 0x3e3, bit: 1, label: "Ornamental Fan" },
                    { offset: 0x3e3, bit: 2, label: "Half of Scroll (Top)" },
                    { offset: 0x3e3, bit: 3, label: "Half of Scroll (Bottom)", separator: true },
                    { offset: 0x3e3, bit: 4, label: "Leaf" },
                    { offset: 0x3e3, bit: 5, label: "Conch" },
                    { offset: 0x3e3, bit: 6, label: "Pinecone" },
                    { offset: 0x3e3, bit: 7, label: "Blue Chemical" },
                    { offset: 0x3e4, bit: 0, label: "Red Chemical" },
                  ],
                },
                {
                  id: "treasures-3",
                  type: "bitflags",
                  flags: [
                    { offset: 0x3e4, bit: 1, label: "Pump" },
                    { offset: 0x3e4, bit: 2, label: "Fruit" },
                    { offset: 0x3e4, bit: 3, label: "Night Vision Scope" },
                    { offset: 0x3e4, bit: 4, label: "Electric Fan Propeller" },
                    { offset: 0x3e4, bit: 5, label: "Rust Spray", separator: true },
                    { offset: 0x3e4, bit: 6, label: "Statue" },
                    { offset: 0x3e4, bit: 7, label: "Detonator" },
                    { offset: 0x3e5, bit: 0, label: "Scissors" },
                    { offset: 0x3e5, bit: 1, label: "Box" },
                    { offset: 0x3e5, bit: 2, label: "Remote Control", separator: true },
                    { offset: 0x3e5, bit: 3, label: "Key Card (Red)" },
                    { offset: 0x3e5, bit: 4, label: "Key Card (Blue)" },
                    { offset: 0x3e5, bit: 5, label: "Drill" },
                    { offset: 0x3e5, bit: 6, label: "Pickaxe" },
                    { offset: 0x3e5, bit: 7, label: "Rocket", separator: true },
                    { offset: 0x3e6, bit: 0, label: "Pokémon Pikachu" },
                    { offset: 0x3e6, bit: 1, label: "Valve" },
                    { offset: 0x3e6, bit: 2, label: "Blood" },
                    { offset: 0x3e6, bit: 3, label: "Sand" },
                    { offset: 0x3e6, bit: 4, label: "Doll" },
                  ],
                },
                {
                  id: "treasures-4",
                  type: "bitflags",
                  flags: [
                    { offset: 0x3e6, bit: 5, label: "Wheels" },
                    { offset: 0x3e6, bit: 6, label: "Flute" },
                    { offset: 0x3e6, bit: 7, label: "Foot of Stone" },
                    { offset: 0x3e7, bit: 0, label: "Golden Snake Eye (Left)" },
                    { offset: 0x3e7, bit: 1, label: "Golden Snake Eye (Right)", separator: true },
                    { offset: 0x3e7, bit: 2, label: "Blue Snake Eye (Left)" },
                    { offset: 0x3e7, bit: 3, label: "Blue Snake Eye (Right)" },
                    { offset: 0x3e7, bit: 4, label: "Water Wand" },
                    { offset: 0x3e7, bit: 5, label: "Half of Sun Stone (Left)" },
                    { offset: 0x3e7, bit: 6, label: "Half of Sun Stone (Right)", separator: true },
                    { offset: 0x3e7, bit: 7, label: "Whirlwind" },
                    { offset: 0x3e8, bit: 0, label: "Seed" },
                    { offset: 0x3e8, bit: 1, label: "Sack" },
                    { offset: 0x3e8, bit: 2, label: "Gong" },
                    { offset: 0x3e8, bit: 3, label: "Telephone", separator: true },
                    { offset: 0x3e8, bit: 4, label: "Crown" },
                    { offset: 0x3e8, bit: 5, label: "Day / Night Tablet" },
                    { offset: 0x3e8, bit: 6, label: "Bracelet (Red)" },
                    { offset: 0x3e8, bit: 7, label: "Bracelet (Green)" },
                    { offset: 0x3e9, bit: 0, label: "Bracelet (Blue)" },
                  ],
                },
                {
                  id: "treasures-5",
                  type: "bitflags",
                  flags: [
                    { offset: 0x3e9, bit: 1, label: "Crest (Club)" },
                    { offset: 0x3e9, bit: 2, label: "Crest (Spade)" },
                    { offset: 0x3e9, bit: 3, label: "Crest (Heart)" },
                    { offset: 0x3e9, bit: 4, label: "Crest (Diamond)" },
                    { offset: 0x3e9, bit: 5, label: "Gloom", separator: true },
                    { offset: 0x3e9, bit: 6, label: "Saber" },
                    { offset: 0x3e9, bit: 7, label: "Chalice" },
                    { offset: 0x3ea, bit: 0, label: "Teapot" },
                    { offset: 0x3ea, bit: 1, label: "Magnifying Glass" },
                    { offset: 0x3ea, bit: 2, label: "UFO", separator: true },
                    { offset: 0x3ea, bit: 3, label: "Toy Car" },
                    { offset: 0x3ea, bit: 4, label: "Toy Train" },
                    { offset: 0x3ea, bit: 5, label: "Fire Extinguisher" },
                    { offset: 0x3ea, bit: 6, label: "Crayon (Red)" },
                    { offset: 0x3ea, bit: 7, label: "Crayon (Brown)", separator: true },
                    { offset: 0x3eb, bit: 0, label: "Crayon (Yellow)" },
                    { offset: 0x3eb, bit: 1, label: "Crayon (Green)" },
                    { offset: 0x3eb, bit: 2, label: "Crayon (Cyan)" },
                    { offset: 0x3eb, bit: 3, label: "Crayon (Blue)" },
                    { offset: 0x3eb, bit: 4, label: "Crayon (Pink)" },
                  ],
                },
              ],
            },
          ],
        },
        {
          name: "Golf",
          flex: true,
          items: [
            {
              id: "golf",
              name: "Course 1",
              offset: 0x3c6,
              type: "variable",
              dataType: "uint8",
              max: 119,
            },
            {
              id: "golf",
              name: "Course 2",
              offset: 0x3c7,
              type: "variable",
              dataType: "uint8",
              max: 119,
            },
            {
              id: "golf",
              name: "Course 3",
              offset: 0x3c8,
              type: "variable",
              dataType: "uint8",
              max: 119,
            },
            {
              id: "golf",
              name: "Course 4",
              offset: 0x3c9,
              type: "variable",
              dataType: "uint8",
              max: 119,
            },
          ],
        },
      ],
    },
  ],
  resources: {
    languages: {
      0x0: "Japanese",
      0x1: "English",
    },
    times: {
      0x0: "Day",
      0x1: "Night",
    },
  },
  resourcesOrder: {
    languages: [0x1, 0x0],
  },
};

export default template;
