import type { GameJson } from "$lib/types";

const template: GameJson = {
  validator: {
    regions: {
      europe: { 0x0: [0x47, 0x4c, 0x4d, 0x50, 0x30, 0x31] }, // "GLMP01"
      usa: { 0x0: [0x47, 0x4c, 0x4d, 0x45, 0x30, 0x31] }, // "GLME01"
      japan: { 0x0: [0x47, 0x4c, 0x4d, 0x4a, 0x30, 0x31] }, // "GLMJ01"
    },
    text: "Drag 'n' drop here or click to add a save file.",
    error: "Not a valid save file.",
  },
  items: [
    {
      type: "section",
      flex: true,
      items: [
        {
          name: "Checksum",
          offset: 0x403c,
          type: "checksum",
          dataType: "uint32",
          bigEndian: true,
          control: {
            offsetStart: 0x2040,
            offsetEnd: 0x4040,
          },
        },
        {
          name: "Save Count",
          offset: 0x2040,
          type: "variable",
          dataType: "uint32",
          bigEndian: true,
          hidden: true,
        },
      ],
    },
    {
      length: 0x3b0,
      type: "container",
      instanceType: "tabs",
      instances: 3,
      enumeration: "Slot %d",
      appendSubinstance: [{ name: "Options", items: [] }],
      items: [
        {
          type: "tabs",
          items: [
            {
              name: "General",
              items: [
                {
                  type: "tabs",
                  vertical: true,
                  items: [
                    {
                      name: "General",
                      items: [
                        {
                          type: "section",
                          flex: true,
                          items: [
                            {
                              name: "New Game +",
                              offset: 0x23f3,
                              type: "variable",
                              dataType: "uint8",
                            },
                            {
                              id: "area",
                              name: "Area",
                              offset: 0x238c,
                              type: "variable",
                              dataType: "uint8",
                              min: 1,
                              max: 4,
                            },
                            {
                              name: "Money",
                              offset: 0x23f4,
                              type: "variable",
                              dataType: "uint32",
                              bigEndian: true,
                              max: 999999999,
                            },
                          ],
                        },
                        {
                          type: "section",
                          flex: true,
                          items: [
                            {
                              name: "Health",
                              offset: 0x2280,
                              type: "variable",
                              dataType: "uint16",
                              bigEndian: true,
                              min: 1,
                              max: 100,
                            },
                            {
                              type: "section",
                              items: [
                                {
                                  name: "Equipment",
                                  type: "bitflags",
                                  flags: [
                                    { offset: 0x23ea, bit: 0, label: "Flashlight" }, // prettier-ignore
                                    { offset: 0x23ea, bit: 1, label: "Poltergust 3000" }, // prettier-ignore
                                  ],
                                },
                                {
                                  name: "Medals",
                                  type: "bitflags",
                                  flags: [
                                    { offset: 0x2362, bit: 5, label: "Fire Element Medal" }, // prettier-ignore
                                    { offset: 0x2362, bit: 6, label: "Ice Element Medal" }, // prettier-ignore
                                    { offset: 0x2362, bit: 7, label: "Water Element Medal" }, // prettier-ignore
                                  ],
                                },
                              ],
                            },
                            {
                              name: "Mario's Items",
                              type: "bitflags",
                              flags: [
                                { offset: 0x236b, bit: 4, label: "Mario's Hat" }, // prettier-ignore
                                { offset: 0x236b, bit: 5, label: "Mario's Star" }, // prettier-ignore
                                { offset: 0x236b, bit: 6, label: "Mario's Glove" }, // prettier-ignore
                                { offset: 0x236b, bit: 7, label: "Mario's Shoe" }, // prettier-ignore
                                { offset: 0x236c, bit: 0, label: "Mario's Letter" }, // prettier-ignore
                              ],
                            },
                          ],
                        },
                        {
                          name: "Events",
                          type: "bitflags",
                          hidden: true,
                          flags: [
                            { offset: 0x204e, bit: 1, label: "Introduction completed" }, // prettier-ignore
                            { offset: 0x238c, bit: 0, label: "Area 1 Cleared" }, // prettier-ignore
                            { offset: 0x239e, bit: 5, label: "Area 2 Cleared" }, // prettier-ignore
                            { offset: 0x239f, bit: 4, label: "Area 3 Cleared" }, // prettier-ignore

                            // ? 0x208b | uint8 | [Event] Area 1 Completed message
                            // ? 0x20aa | uint8 | [Event] Area 2 Completed triggered
                            // ? 0x20b0 | uint8 | [Event] Introduction seen
                            // ? 0x20d0 | uint8 | [Event] Area 3 Completed triggered
                            // # { offset: 0x204f, bit: 0, label: "Mode: Hidden Mansion" },

                            // ? { offset: 0x2050, bit: 1, label: "Gallery: Angel statue touched" },
                            // # { offset: 0x2052, bit: 3, label: "Related to Boo Radar obtention" },
                            // ? { offset: 0x2052, bit: 7, label: "Trigger Act 1 Completed" },
                            // # { offset: 0x2055, bit: 0, label: "Related to 5th boo vaccumed" },
                            // ? { offset: 0x2055, bit: 5, label: "Blackout event" },
                            // ? { offset: 0x2056, bit: 2, label: "Trigger Act 4 Completed" },
                            // ? { offset: 0x2056, bit: 4, label: "Trigger Act 2 Completed" },
                            // ? { offset: 0x2057, bit: 3, label: "Boo Radar obtained (enable Boos)" },
                            // ? { offset: 0x2058, bit: 2, label: "Trigger Act 3 Completed" },
                          ],
                        },
                      ],
                    },
                    {
                      name: "Treasures",
                      items: [
                        {
                          type: "section",
                          flex: true,
                          items: [
                            {
                              name: "Coins",
                              offset: 0x2338,
                              type: "variable",
                              dataType: "uint32",
                              bigEndian: true,
                              max: 9999,
                            },
                            {
                              name: "Bills",
                              offset: 0x233c,
                              type: "variable",
                              dataType: "uint32",
                              bigEndian: true,
                              max: 9999,
                            },
                            {
                              name: "Gold Bars",
                              offset: 0x2340,
                              type: "variable",
                              dataType: "uint8",
                              max: 99,
                            },
                          ],
                        },
                        {
                          type: "section",
                          flex: true,
                          items: [
                            {
                              name: "Blue Jewels",
                              offset: 0x2341,
                              type: "variable",
                              dataType: "uint8",
                              max: 99,
                            },
                            {
                              name: "Green Jewels",
                              offset: 0x2342,
                              type: "variable",
                              dataType: "uint8",
                              max: 99,
                            },
                            {
                              name: "Red Jewels",
                              offset: 0x2343,
                              type: "variable",
                              dataType: "uint8",
                              max: 99,
                            },
                          ],
                        },
                        {
                          type: "section",
                          flex: true,
                          items: [
                            {
                              name: "Silver Diamonds",
                              offset: 0x2344,
                              type: "variable",
                              dataType: "uint8",
                              max: 99,
                            },
                            {
                              name: "Red Diamonds",
                              offset: 0x2345,
                              type: "variable",
                              dataType: "uint8",
                              max: 99,
                            },
                            {
                              name: "Gold Diamonds",
                              offset: 0x2346,
                              type: "variable",
                              dataType: "uint8",
                              max: 99,
                            },
                          ],
                        },
                        {
                          type: "section",
                          flex: true,
                          items: [
                            {
                              name: "Small Pearl",
                              offset: 0x2348,
                              type: "variable",
                              dataType: "uint16",
                              bigEndian: true,
                              max: 999,
                            },
                            {
                              name: "Medium Pearl",
                              offset: 0x234a,
                              type: "variable",
                              dataType: "uint16",
                              bigEndian: true,
                              max: 999,
                            },
                            {
                              name: "Big Pearl",
                              offset: 0x234c,
                              type: "variable",
                              dataType: "uint16",
                              bigEndian: true,
                              max: 99,
                            },
                          ],
                        },
                      ],
                    },
                    {
                      name: "Portrait Ghosts",
                      items: [
                        {
                          type: "section",
                          flex: true,
                          items: [
                            {
                              name: "Neville",
                              offset: 0x23e4,
                              type: "variable",
                              dataType: "uint8",
                              binary: { bitStart: 0, bitLength: 2 },
                              resource: "portraitFrames",
                            },
                            {
                              name: "Lydia",
                              offset: 0x23e4,
                              type: "variable",
                              dataType: "uint8",
                              binary: { bitStart: 2, bitLength: 2 },
                              resource: "portraitFrames",
                            },
                            {
                              name: "Chauncey",
                              offset: 0x23e4,
                              type: "variable",
                              dataType: "uint8",
                              binary: { bitStart: 4, bitLength: 2 },
                              resource: "portraitFrames",
                            },
                          ],
                        },
                        {
                          type: "section",
                          flex: true,
                          items: [
                            {
                              name: "Mr. Luggs",
                              offset: 0x23e5,
                              type: "variable",
                              dataType: "uint8",
                              binary: { bitStart: 6, bitLength: 2 },
                              resource: "portraitFrames",
                            },
                            {
                              name: "The Floating Whirlindas",
                              offset: 0x23e4,
                              type: "variable",
                              dataType: "uint8",
                              binary: { bitStart: 6, bitLength: 2 },
                              resource: "portraitFrames",
                            },
                            {
                              name: "Melody Pianissima",
                              offset: 0x23e5,
                              type: "variable",
                              dataType: "uint8",
                              binary: { bitStart: 4, bitLength: 2 },
                              resource: "portraitFrames",
                            },
                            {
                              name: "Shivers",
                              offset: 0x23e5,
                              type: "variable",
                              dataType: "uint8",
                              binary: { bitStart: 2, bitLength: 2 },
                              resource: "portraitFrames",
                            },
                            {
                              name: "Spooky",
                              offset: 0x23e6,
                              type: "variable",
                              dataType: "uint8",
                              binary: { bitStart: 0, bitLength: 2 },
                              resource: "portraitFrames",
                            },
                            {
                              name: "Bogmire",
                              offset: 0x23e6,
                              type: "variable",
                              dataType: "uint8",
                              binary: { bitStart: 2, bitLength: 2 },
                              resource: "portraitFrames",
                            },
                          ],
                        },
                        {
                          type: "section",
                          flex: true,
                          items: [
                            {
                              name: "Madame Clairvoya",
                              offset: 0x23e5,
                              type: "variable",
                              dataType: "uint8",
                              binary: { bitStart: 0, bitLength: 2 },
                              resource: "portraitFrames",
                            },
                            {
                              name: "Biff Atlas",
                              offset: 0x23e6,
                              type: "variable",
                              dataType: "uint8",
                              binary: { bitStart: 4, bitLength: 2 },
                              resource: "portraitFrames",
                            },
                            {
                              name: "Nana",
                              offset: 0x23e7,
                              type: "variable",
                              dataType: "uint8",
                              binary: { bitStart: 2, bitLength: 2 },
                              resource: "portraitFrames",
                            },
                            {
                              name: "Miss Petunia",
                              offset: 0x23e7,
                              type: "variable",
                              dataType: "uint8",
                              binary: { bitStart: 0, bitLength: 2 },
                              resource: "portraitFrames",
                            },
                            {
                              name: "Slim Bankshot",
                              offset: 0x23e6,
                              type: "variable",
                              dataType: "uint8",
                              binary: { bitStart: 6, bitLength: 2 },
                              resource: "portraitFrames",
                            },
                            {
                              name: "Henry and Orville",
                              offset: 0x23e7,
                              type: "variable",
                              dataType: "uint8",
                              binary: { bitStart: 4, bitLength: 2 },
                              resource: "portraitFrames",
                            },
                            {
                              name: "Boolossus",
                              offset: 0x23e7,
                              type: "variable",
                              dataType: "uint8",
                              binary: { bitStart: 6, bitLength: 2 },
                              resource: "portraitFrames",
                            },
                          ],
                        },
                        {
                          type: "section",
                          flex: true,
                          items: [
                            {
                              name: "Uncle Grimmly",
                              offset: 0x23e8,
                              type: "variable",
                              dataType: "uint8",
                              binary: { bitStart: 6, bitLength: 2 },
                              resource: "portraitFrames",
                            },
                            {
                              name: "Jarvis",
                              offset: 0x23e8,
                              type: "variable",
                              dataType: "uint8",
                              binary: { bitStart: 0, bitLength: 2 },
                              resource: "portraitFrames",
                            },
                            {
                              name: "Vincent Van Gore",
                              offset: 0x23e8,
                              type: "variable",
                              dataType: "uint8",
                              binary: { bitStart: 4, bitLength: 2 },
                              resource: "portraitFrames",
                            },
                            {
                              name: "Sue Pea",
                              offset: 0x23e8,
                              type: "variable",
                              dataType: "uint8",
                              binary: { bitStart: 2, bitLength: 2 },
                              resource: "portraitFrames",
                            },
                            {
                              name: "Clockwork Soldiers",
                              offset: 0x23e9,
                              type: "variable",
                              dataType: "uint8",
                              binary: { bitStart: 0, bitLength: 2 },
                              resource: "portraitFrames",
                            },
                            {
                              name: "Sir Weston",
                              offset: 0x23e9,
                              type: "variable",
                              dataType: "uint8",
                              binary: { bitStart: 2, bitLength: 2 },
                              resource: "portraitFrames",
                            },
                            {
                              name: "King Boo",
                              offset: 0x23e9,
                              type: "variable",
                              dataType: "uint8",
                              binary: { bitStart: 4, bitLength: 2 },
                              resource: "portraitFrames",
                            },
                          ],
                        },
                      ],
                    },
                    {
                      name: "Boos",
                      flex: true,
                      items: [
                        {
                          name: "Seen",
                          type: "bitflags",
                          flags: [
                            { offset: 0x23bd, bit: 3, label: "Boomeo" }, // prettier-ignore
                            { offset: 0x23bd, bit: 4, label: "Booregard" }, // prettier-ignore
                            { offset: 0x23bd, bit: 0, label: "Boohoo" }, // prettier-ignore
                            { offset: 0x23bd, bit: 1, label: "ShamBoo" }, // prettier-ignore
                            { offset: 0x23bd, bit: 2, label: "GameBoo" }, // prettier-ignore
                            { offset: 0x23bc, bit: 5, label: "Booligan" }, // prettier-ignore
                            { offset: 0x23bc, bit: 6, label: "Boodacious" }, // prettier-ignore
                            { offset: 0x23bc, bit: 7, label: "Boo La La" }, // prettier-ignore
                            { offset: 0x23bc, bit: 4, label: "Boogie" }, // prettier-ignore
                            { offset: 0x23bc, bit: 0, label: "PeakaBoo" }, // prettier-ignore
                            { offset: 0x23bc, bit: 1, label: "GumBoo" }, // prettier-ignore
                            { offset: 0x23bc, bit: 2, label: "Booigi" }, // prettier-ignore
                            { offset: 0x23bc, bit: 3, label: "Kung Boo", separator: true }, // prettier-ignore
                            { offset: 0x23be, bit: 7, label: "LimBooger" }, // prettier-ignore
                            { offset: 0x23bf, bit: 0, label: "Mr. Boojangles" }, // prettier-ignore
                            { offset: 0x23be, bit: 4, label: "GameBoo Advance" }, // prettier-ignore
                            { offset: 0x23be, bit: 5, label: "Bootha" }, // prettier-ignore
                            { offset: 0x23be, bit: 6, label: "Boonswoggle" }, // prettier-ignore
                            { offset: 0x23be, bit: 1, label: "Boolicious" }, // prettier-ignore
                            { offset: 0x23be, bit: 2, label: "TaBoo" }, // prettier-ignore
                            { offset: 0x23be, bit: 3, label: "BamBoo" }, // prettier-ignore
                            { offset: 0x23bd, bit: 5, label: "Turboo" }, // prettier-ignore
                            { offset: 0x23bd, bit: 6, label: "Booris" }, // prettier-ignore
                            { offset: 0x23bd, bit: 7, label: "Boolivia" }, // prettier-ignore
                            { offset: 0x23be, bit: 0, label: "Boonita", separator: true }, // prettier-ignore
                            { offset: 0x23bf, bit: 4, label: "TamBoorine" }, // prettier-ignore
                            { offset: 0x23bf, bit: 5, label: "Booscaster" }, // prettier-ignore
                            { offset: 0x23bf, bit: 6, label: "Bootique" }, // prettier-ignore
                            { offset: 0x23bf, bit: 1, label: "UnderBoo" }, // prettier-ignore
                            { offset: 0x23bf, bit: 2, label: "Boomerang" }, // prettier-ignore
                            { offset: 0x23bf, bit: 3, label: "Little Boo Peep" }, // prettier-ignore
                            { offset: 0x23b0, bit: 0, label: "Boolossus", disabled: true, separator: true }, // prettier-ignore
                            { offset: 0x23c0, bit: 1, label: "Booffant" }, // prettier-ignore
                            { offset: 0x23c0, bit: 2, label: "Boo B. Hatch" }, // prettier-ignore
                            { offset: 0x23bf, bit: 7, label: "Boolderdash" }, // prettier-ignore
                            { offset: 0x23c0, bit: 0, label: "Booripedes" }, // prettier-ignore
                          ],
                        },
                        {
                          name: "Captured",
                          type: "bitflags",
                          flags: [
                            { offset: 0x23b5, bit: 3, label: "Boomeo" }, // prettier-ignore
                            { offset: 0x23b5, bit: 4, label: "Booregard" }, // prettier-ignore
                            { offset: 0x23b5, bit: 0, label: "Boohoo" }, // prettier-ignore
                            { offset: 0x23b5, bit: 1, label: "ShamBoo" }, // prettier-ignore
                            { offset: 0x23b5, bit: 2, label: "GameBoo" }, // prettier-ignore
                            { offset: 0x23b4, bit: 5, label: "Booligan" }, // prettier-ignore
                            { offset: 0x23b4, bit: 6, label: "Boodacious" }, // prettier-ignore
                            { offset: 0x23b4, bit: 7, label: "Boo La La" }, // prettier-ignore
                            { offset: 0x23b4, bit: 4, label: "Boogie" }, // prettier-ignore
                            { offset: 0x23b4, bit: 0, label: "PeakaBoo" }, // prettier-ignore
                            { offset: 0x23b4, bit: 1, label: "GumBoo" }, // prettier-ignore
                            { offset: 0x23b4, bit: 2, label: "Booigi" }, // prettier-ignore
                            { offset: 0x23b4, bit: 3, label: "Kung Boo", separator: true }, // prettier-ignore
                            { offset: 0x23b6, bit: 7, label: "LimBooger" }, // prettier-ignore
                            { offset: 0x23b7, bit: 0, label: "Mr. Boojangles" }, // prettier-ignore
                            { offset: 0x23b6, bit: 4, label: "GameBoo Advance" }, // prettier-ignore
                            { offset: 0x23b6, bit: 5, label: "Bootha" }, // prettier-ignore
                            { offset: 0x23b6, bit: 6, label: "Boonswoggle" }, // prettier-ignore
                            { offset: 0x23b6, bit: 1, label: "Boolicious" }, // prettier-ignore
                            { offset: 0x23b6, bit: 2, label: "TaBoo" }, // prettier-ignore
                            { offset: 0x23b6, bit: 3, label: "BamBoo" }, // prettier-ignore
                            { offset: 0x23b5, bit: 5, label: "Turboo" }, // prettier-ignore
                            { offset: 0x23b5, bit: 6, label: "Booris" }, // prettier-ignore
                            { offset: 0x23b5, bit: 7, label: "Boolivia" }, // prettier-ignore
                            { offset: 0x23b6, bit: 0, label: "Boonita", separator: true }, // prettier-ignore
                            { offset: 0x23b7, bit: 4, label: "TamBoorine" }, // prettier-ignore
                            { offset: 0x23b7, bit: 5, label: "Booscaster" }, // prettier-ignore
                            { offset: 0x23b7, bit: 6, label: "Bootique" }, // prettier-ignore
                            { offset: 0x23b7, bit: 1, label: "UnderBoo" }, // prettier-ignore
                            { offset: 0x23b7, bit: 2, label: "Boomerang" }, // prettier-ignore
                            { offset: 0x23b7, bit: 3, label: "Little Boo Peep" }, // prettier-ignore
                            { offset: 0x23b8, bit: 3, label: "Boolossus", separator: true }, // prettier-ignore
                            { offset: 0x23b8, bit: 4, label: "Boolossus", hidden: true }, // prettier-ignore
                            { offset: 0x23b8, bit: 5, label: "Boolossus", hidden: true }, // prettier-ignore
                            { offset: 0x23b8, bit: 6, label: "Boolossus", hidden: true }, // prettier-ignore
                            { offset: 0x23b8, bit: 7, label: "Boolossus", hidden: true }, // prettier-ignore
                            { offset: 0x23b9, bit: 0, label: "Boolossus", hidden: true }, // prettier-ignore
                            { offset: 0x23b9, bit: 1, label: "Boolossus", hidden: true }, // prettier-ignore
                            { offset: 0x23b9, bit: 2, label: "Boolossus", hidden: true }, // prettier-ignore
                            { offset: 0x23b9, bit: 3, label: "Boolossus", hidden: true }, // prettier-ignore
                            { offset: 0x23b9, bit: 4, label: "Boolossus", hidden: true }, // prettier-ignore
                            { offset: 0x23b9, bit: 5, label: "Boolossus", hidden: true }, // prettier-ignore
                            { offset: 0x23b9, bit: 6, label: "Boolossus", hidden: true }, // prettier-ignore
                            { offset: 0x23b9, bit: 7, label: "Boolossus", hidden: true }, // prettier-ignore
                            { offset: 0x23ba, bit: 0, label: "Boolossus", hidden: true }, // prettier-ignore
                            { offset: 0x23ba, bit: 1, label: "Boolossus", hidden: true }, // prettier-ignore
                            { offset: 0x23b8, bit: 1, label: "Booffant" }, // prettier-ignore
                            { offset: 0x23b8, bit: 2, label: "Boo B. Hatch" }, // prettier-ignore
                            { offset: 0x23b7, bit: 7, label: "Boolderdash" }, // prettier-ignore
                            { offset: 0x23b8, bit: 0, label: "Booripedes" }, // prettier-ignore
                          ],
                        },
                      ],
                    },
                  ],
                },
              ],
            },
            {
              name: "Mansion",
              items: [
                {
                  type: "tabs",
                  vertical: true,
                  items: [
                    {
                      name: "1F Foyer",
                      flex: true,
                      items: [
                        {
                          name: "Events",
                          type: "bitflags",
                          flags: [
                            { offset: 0x2105, bit: 0, label: "Visited" }, // prettier-ignore
                            { offset: 0x2105, bit: 1, label: "Cleared" }, // prettier-ignore
                            { offset: 0x2056, bit: 7, label: "Toad reassured" },
                            { offset: 0x2375, bit: 6, label: "Heart door to 1F Hallway unsealed" }, // prettier-ignore

                            // # { offset: 0x204e, bit: 4, label: "[Event] 1F Foyer: Key related" },
                            // # { offset: 0x235e, bit: 6, label: "1F Foyer: Key related" },
                            // ? { offset: 0x2060, bit: 4, label: "Door from 1F Foyer to 1F Hallway locked", reversed: true, separator: true }, // prettier-ignore
                            // ? 0x2087 | uint8 | [Event] 1F Foyer: Ghost drop Key to 2F Parlor on the ground
                            // ? { offset: 0x23c8, bit: 2, label: "1F Foyer: Key to 2F Parlor obtained" },
                          ],
                        },
                        {
                          name: "Money",
                          type: "bitflags",
                          flags: [
                            { offset: 0x220c, bit: 2, label: "Inside a chandelier" }, // prettier-ignore
                            { offset: 0x2221, bit: 0, label: "Inside a ceiling light" }, // prettier-ignore
                          ],
                        },
                      ],
                    },
                    {
                      name: "1F Hallway",
                      items: [
                        {
                          type: "section",
                          flex: true,
                          items: [
                            {
                              name: "Events",
                              type: "bitflags",
                              flags: [
                                { offset: 0x210f, bit: 0, label: "Visited" }, // prettier-ignore
                                { offset: 0x210f, bit: 1, label: "Cleared" }, // prettier-ignore
                                { offset: 0x2125, bit: 0, label: "Visited", hidden: true }, // prettier-ignore
                                { offset: 0x2125, bit: 1, label: "Cleared", hidden: true }, // prettier-ignore
                                { offset: 0x216b, bit: 0, label: "Visited", hidden: true }, // prettier-ignore
                                { offset: 0x216b, bit: 1, label: "Cleared", hidden: true }, // prettier-ignore
                                { offset: 0x210d, bit: 0, label: "Visited", hidden: true }, // prettier-ignore
                                { offset: 0x210d, bit: 1, label: "Cleared", hidden: true }, // prettier-ignore
                                { offset: 0x2375, bit: 7, label: "Club door to 1F Courtyard unsealed" }, // prettier-ignore

                                // ? { offset: 0x2060, bit: 0, label: "Door from 1F Hallway to 1F Laundry Room locked", reversed: true, separator: true }, // prettier-ignore
                                // ? { offset: 0x2060, bit: 3, label: "Door from 1F Hallway to 1F Fortune-teller's Room locked", reversed: true, separator: true }, // prettier-ignore
                                // { offset: 0x2060, bit: 4, label: "Door from 1F Foyer to 1F Hallway locked", reversed: true, separator: true }, // prettier-ignore
                                // ? { offset: 0x2061, bit: 0, label: "Door from 1F Hallway to 1F Ball Room locked", reversed: true, separator: true }, // prettier-ignore
                                // ? { offset: 0x2061, bit: 1, label: "Door from 1F Hallway to 1F Dining Room locked", reversed: true, separator: true }, // prettier-ignore
                                // ! { offset: 0x2061, bit: 6, label: "Door from 1F Hallway to 1F East Wing (stairs to BF) locked (unused)", reversed: true, separator: true }, // prettier-ignore
                                // ! { offset: 0x2062, bit: 0, label: "Door from 1F Hallway to 1F Bathroom locked (unused)", reversed: true, separator: true }, // prettier-ignore
                                // ? { offset: 0x2062, bit: 2, label: "Door from 1F Hallway to 1F Conservatory locked", reversed: true, separator: true }, // prettier-ignore
                                // ? { offset: 0x2062, bit: 3, label: "Door from 1F Hallway to 1F Washroom locked", reversed: true, separator: true }, // prettier-ignore
                                // ? { offset: 0x2062, bit: 6, label: "Door from 1F Hallway to 1F Billiards Room locked", reversed: true, separator: true }, // prettier-ignore
                                // ? { offset: 0x2065, bit: 5, label: "Door from 1F Hallway to 1F Balcony (West) locked", reversed: true, separator: true }, // prettier-ignore
                                // ? { offset: 0x2069, bit: 5, label: "Door from 1F Hallway to 1F East Wing (leading to 2nd Floor) locked", reversed: true, separator: true }, // prettier-ignore
                                // ? 0x20d1 | uint8 | [Event] 1F Hallway: Sivers dialog when his candles are lighted
                                // ? { offset: 0x23c4, bit: 3, label: "2F Nursery: Heart Key to 1F Hallway obtained" },
                              ],
                            },
                            {
                              name: "Money",
                              type: "bitflags",
                              flags: [
                                { offset: 0x220b, bit: 0, label: "Inside a vase" }, // prettier-ignore
                                { offset: 0x220b, bit: 2, label: "Inside a vase" }, // prettier-ignore
                                { offset: 0x220c, bit: 1, label: "Inside a vase" }, // prettier-ignore
                                { offset: 0x2223, bit: 3, label: "Inside a vase", separator: true }, // prettier-ignore
                                { offset: 0x2374, bit: 7, label: "Gold Mouse captured" }, // prettier-ignore
                              ],
                            },
                          ],
                        },
                      ],
                    },
                    {
                      name: "1F Ball Room",
                      items: [
                        {
                          type: "section",
                          flex: true,
                          items: [
                            {
                              name: "Events",
                              type: "bitflags",
                              flags: [
                                { offset: 0x2115, bit: 0, label: "Visited" }, // prettier-ignore
                                { offset: 0x2115, bit: 1, label: "Cleared" }, // prettier-ignore
                                { offset: 0x2115, bit: 2, label: "Chest opened" }, // prettier-ignore
                                { offset: 0x23c6, bit: 0, label: "Key to 1F Storage Room obtained", separator: true }, // prettier-ignore
                                { offset: 0x2062, bit: 7, label: "Door to 1F Storage Room unlocked", reversed: true, separator: true }, // prettier-ignore
                                { offset: 0x23bc, bit: 7, label: "<b>Boo</b>: Boo La La (seen)" }, // prettier-ignore
                                { offset: 0x23b4, bit: 7, label: "<b>Boo</b>: Boo La La (captured)" }, // prettier-ignore
                                { offset: 0x236e, bit: 2, label: "The Floating Whirlindas captured", hidden: true }, // prettier-ignore
                                { offset: 0x2057, bit: 4, label: "1F Ball Room: ???", hidden: true }, // prettier-ignore
                              ],
                            },
                            {
                              name: "Money",
                              type: "bitflags",
                              flags: [
                                { offset: 0x2215, bit: 0, label: "Inside a chandelier" }, // prettier-ignore
                                { offset: 0x2215, bit: 1, label: "Inside a chandelier" }, // prettier-ignore
                              ],
                            },
                          ],
                        },
                        {
                          name: "The Floating Whirlindas",
                          type: "section",
                          flex: true,
                          items: [
                            {
                              name: "Health",
                              offset: 0x228a,
                              type: "variable",
                              dataType: "uint16",
                              bigEndian: true,
                              max: 100,
                            },
                            {
                              name: "Rank",
                              offset: 0x23e4,
                              type: "variable",
                              dataType: "uint8",
                              binary: { bitStart: 6, bitLength: 2 },
                              resource: "portraitFrames",
                            },
                          ],
                        },
                      ],
                    },
                    {
                      name: "1F Storage Room",
                      items: [
                        {
                          type: "section",
                          flex: true,
                          items: [
                            {
                              name: "Events",
                              type: "bitflags",
                              flags: [
                                { offset: 0x211d, bit: 0, label: "Visited" }, // prettier-ignore
                                { offset: 0x211d, bit: 1, label: "Cleared", separator: true }, // prettier-ignore
                                { offset: 0x2062, bit: 7, label: "Door to 1F Ball Room unlocked", reversed: true, separator: true }, // prettier-ignore
                                { offset: 0x23bd, bit: 2, label: "<b>Boo</b>: GameBoo (seen)" }, // prettier-ignore
                                { offset: 0x23b5, bit: 2, label: "<b>Boo</b>: GameBoo (captured)" }, // prettier-ignore

                                // ? { offset: 0x2053, bit: 1, label: "1F Storage Room: Button moving wall pressed" },
                                // ? { offset: 0x2057, bit: 0, label: "1F Storage Room: Button releasing boos pressed" },
                                // ? { offset: 0x2057, bit: 1, label: "1F Storage Room: Trigger talk with prof in Lab about Boos (enable Boos)" },
                                // ? 0x20a3 | uint8 | [Event] 1F Storage Room: Camera animation after pushing button
                                // ? 0x20c5 | uint8 | [Event] 1F Storage Room: Trap opened and Boos escaped
                                // # { offset: 0x2337, bit: 0, label: "[Event] 1F Storage Room: Related to trap opened and Boos escaped" },
                                // { offset: 0x23c6, bit: 0, label: "1F Ball Room: Key to 1F Storage Room obtained" },
                              ],
                            },
                            {
                              name: "Money",
                              type: "bitflags",
                              flags: [
                                { offset: 0x2214, bit: 1, label: "Inside a bucket", separator: true }, // prettier-ignore
                                { offset: 0x2371, bit: 7, label: "Speedy Spirit captured / escaped" }, // prettier-ignore
                              ],
                            },
                          ],
                        },
                      ],
                    },
                    {
                      name: "1F Bathroom",
                      items: [
                        {
                          type: "section",
                          flex: true,
                          items: [
                            {
                              name: "Events",
                              type: "bitflags",
                              flags: [
                                { offset: 0x2129, bit: 0, label: "Visited" }, // prettier-ignore
                                { offset: 0x2129, bit: 1, label: "Cleared" }, // prettier-ignore
                                { offset: 0x23c5, bit: 7, label: "Key to 1F Ball Room obtained" }, // prettier-ignore
                                { offset: 0x23c6, bit: 7, label: "Key to 1F Bathroom obtained (unused)", hidden: true }, // prettier-ignore
                                { offset: 0x2062, bit: 0, label: "Door to 1F Hallway unlocked (unused)", reversed: true, hidden: true }, // prettier-ignore
                              ],
                            },
                          ],
                        },
                      ],
                    },
                    {
                      name: "1F Washroom",
                      items: [
                        {
                          type: "section",
                          flex: true,
                          items: [
                            {
                              name: "Events",
                              type: "bitflags",
                              flags: [
                                { offset: 0x2123, bit: 0, label: "Visited" }, // prettier-ignore
                                { offset: 0x2123, bit: 1, label: "Cleared" }, // prettier-ignore
                                { offset: 0x2050, bit: 0, label: "Toad reassured" }, // prettier-ignore
                                // { offset: 0x2062, bit: 3, label: "Door from 1F Hallway to 1F Washroom locked", reversed: true, separator: true }, // prettier-ignore
                                // ? { offset: 0x23c4, bit: 4, label: "1F Washroom: Key to 1F Fortune-teller's Room obtained" },
                                // ! { offset: 0x23c6, bit: 4, label: "Key to 1F Washroom obtained (unused)" },
                              ],
                            },
                            {
                              name: "Money",
                              type: "bitflags",
                              flags: [
                                { offset: 0x220b, bit: 4, label: "Inside a ceiling light" }, // prettier-ignore
                                { offset: 0x221d, bit: 6, label: "Inside a cupboard" }, // prettier-ignore
                              ],
                            },
                          ],
                        },
                      ],
                    },
                    {
                      name: "1F Fortune-teller's Room",
                      items: [
                        {
                          type: "section",
                          flex: true,
                          items: [
                            {
                              name: "Events",
                              type: "bitflags",
                              flags: [
                                { offset: 0x2107, bit: 0, label: "Visited" }, // prettier-ignore
                                { offset: 0x2107, bit: 1, label: "Cleared" }, // prettier-ignore
                                { offset: 0x2107, bit: 2, label: "Chest opened" }, // prettier-ignore
                                { offset: 0x23c4, bit: 7, label: "Key to 1F Laundry Room obtained" }, // prettier-ignore
                                { offset: 0x23cb, bit: 0, label: "Key to 3F Safari Room obtained", separator: true }, // prettier-ignore
                                { offset: 0x23bc, bit: 2, label: "<b>Boo</b>: Booigi (seen)" }, // prettier-ignore
                                { offset: 0x23b4, bit: 2, label: "<b>Boo</b>: Booigi (captured)" }, // prettier-ignore
                                { offset: 0x236b, bit: 2, label: "Madame Clairvoya captured", hidden: true }, // prettier-ignore

                                // ! { offset: 0x2060, bit: 2, label: "Door from 1F Fortune-teller's Room to 1F Mirror Room locked (unused)", reversed: true, separator: true }, // prettier-ignore
                                // { offset: 0x2060, bit: 3, label: "Door from 1F Hallway to 1F Fortune-teller's Room locked", reversed: true, separator: true }, // prettier-ignore
                                // { offset: 0x23c4, bit: 4, label: "1F Washroom: Key to 1F Fortune-teller's Room obtained" },
                              ],
                            },
                            {
                              name: "Money",
                              type: "bitflags",
                              flags: [
                                { offset: 0x2218, bit: 2, label: "Inside a drawer" }, // prettier-ignore
                                { offset: 0x221a, bit: 5, label: "Inside a drawer", separator: true }, // prettier-ignore
                                { offset: 0x2374, bit: 3, label: "Gold Mouse captured" }, // prettier-ignore
                              ],
                            },
                          ],
                        },
                        {
                          name: "Madame Clairvoya",
                          type: "section",
                          flex: true,
                          items: [
                            {
                              name: "Health",
                              offset: 0x228c,
                              type: "variable",
                              dataType: "uint16",
                              bigEndian: true,
                              max: 100,
                            },
                            {
                              name: "Rank",
                              offset: 0x23e5,
                              type: "variable",
                              dataType: "uint8",
                              binary: { bitStart: 0, bitLength: 2 },
                              resource: "portraitFrames",
                            },
                          ],
                        },
                      ],
                    },
                    {
                      name: "1F Mirror Room",
                      items: [
                        {
                          type: "section",
                          flex: true,
                          items: [
                            {
                              name: "Events",
                              type: "bitflags",
                              flags: [
                                { offset: 0x2109, bit: 0, label: "Visited" }, // prettier-ignore
                                { offset: 0x2109, bit: 1, label: "Cleared" }, // prettier-ignore
                                { offset: 0x2109, bit: 2, label: "Chest opened" }, // prettier-ignore
                                { offset: 0x2362, bit: 5, label: "Fire Element Medal obtained", separator: true }, // prettier-ignore
                                { offset: 0x2053, bit: 3, label: "Trigger Fire Element Medal obtained message", hidden: true }, // prettier-ignore
                                { offset: 0x20b6, bit: 0, label: "Fire Element Medal obtained message seen", hidden: true }, // prettier-ignore
                                { offset: 0x23bc, bit: 3, label: "<b>Boo</b>: Kung Boo (seen)" }, // prettier-ignore
                                { offset: 0x23b4, bit: 3, label: "<b>Boo</b>: Kung Boo (captured)" }, // prettier-ignore

                                // { offset: 0x2060, bit: 2, label: "Door from 1F Fortune-teller's Room to 1F Mirror Room locked (unused)", reversed: true, separator: true }, // prettier-ignore
                                // ! { offset: 0x23c4, bit: 5, label: "Key to 1F Mirror Room obtained (unused)" },
                              ],
                            },
                          ],
                        },
                      ],
                    },
                    {
                      name: "1F Laundry Room",
                      items: [
                        {
                          type: "section",
                          flex: true,
                          items: [
                            {
                              name: "Events",
                              type: "bitflags",
                              flags: [
                                { offset: 0x210b, bit: 0, label: "Visited" }, // prettier-ignore
                                { offset: 0x210b, bit: 1, label: "Cleared" }, // prettier-ignore
                                { offset: 0x210b, bit: 2, label: "Chest opened", separator: true }, // prettier-ignore
                                { offset: 0x23bc, bit: 4, label: "<b>Boo</b>: Boogie (seen)" }, // prettier-ignore
                                { offset: 0x23b4, bit: 4, label: "<b>Boo</b>: Boogie (captured)" }, // prettier-ignore

                                // ? { offset: 0x2052, bit: 1, label: "1F Laundry Room: Trigger Mario's Hat obtained message" },
                                // { offset: 0x2060, bit: 0, label: "Door from 1F Hallway to 1F Laundry Room locked", reversed: true, separator: true }, // prettier-ignore
                                // ? 0x2095 | uint8 | [Event] 1F Laundry Room: Mario's Hat obtained message triggered
                                // ? { offset: 0x236b, bit: 4, label: "1F Laundry Room: Mario's Hat obtained" },
                                // { offset: 0x23c4, bit: 7, label: "1F Fortune-teller's Room: Key to 1F Laundry Room obtained" },
                              ],
                            },
                            {
                              name: "Money",
                              type: "bitflags",
                              flags: [
                                { offset: 0x2217, bit: 2, label: "Inside a cupboard" }, // prettier-ignore
                                { offset: 0x2218, bit: 3, label: "Inside a ceiling light" }, // prettier-ignore
                                { offset: 0x2218, bit: 5, label: "Inside a bucket" }, // prettier-ignore
                              ],
                            },
                          ],
                        },
                      ],
                    },
                    {
                      name: "1F Butler's Room",
                      items: [
                        {
                          type: "section",
                          flex: true,
                          items: [
                            {
                              name: "Events",
                              type: "bitflags",
                              flags: [
                                { offset: 0x2101, bit: 0, label: "Visited" }, // prettier-ignore
                                { offset: 0x2101, bit: 1, label: "Cleared" }, // prettier-ignore
                                { offset: 0x2101, bit: 2, label: "Chest opened" }, // prettier-ignore
                                { offset: 0x23c6, bit: 5, label: "Key to 1F Conservatory obtained", separator: true }, // prettier-ignore
                                { offset: 0x23bc, bit: 0, label: "<b>Boo</b>: PeakaBoo (seen)" }, // prettier-ignore
                                { offset: 0x23b4, bit: 0, label: "<b>Boo</b>: PeakaBoo (captured)" }, // prettier-ignore
                                { offset: 0x2355, bit: 6, label: "Shivers captured", hidden: true }, // prettier-ignore

                                // ! { offset: 0x2060, bit: 6, label: "Door from 1F West Hallway to 1F Butler's Room locked (unused)", reversed: true, separator: true }, // prettier-ignore
                              ],
                            },
                            {
                              name: "Money",
                              type: "bitflags",
                              flags: [
                                { offset: 0x221b, bit: 5, label: "Inside a cupboard" }, // prettier-ignore
                                { offset: 0x221c, bit: 2, label: "Inside a ceiling light" }, // prettier-ignore
                                { offset: 0x221c, bit: 3, label: "Inside a bucket" }, // prettier-ignore
                              ],
                            },
                          ],
                        },
                        {
                          name: "Shivers",
                          type: "section",
                          flex: true,
                          items: [
                            {
                              name: "Health",
                              offset: 0x228e,
                              type: "variable",
                              dataType: "uint16",
                              bigEndian: true,
                              max: 100,
                            },
                            {
                              name: "Rank",
                              offset: 0x23e5,
                              type: "variable",
                              dataType: "uint8",
                              binary: { bitStart: 2, bitLength: 2 },
                              resource: "portraitFrames",
                            },
                          ],
                        },
                      ],
                    },
                    {
                      name: "1F Hidden Room",
                      items: [
                        {
                          type: "section",
                          flex: true,
                          items: [
                            {
                              name: "Events",
                              type: "bitflags",
                              flags: [
                                { offset: 0x2103, bit: 0, label: "Visited" }, // prettier-ignore
                                { offset: 0x2103, bit: 1, label: "Cleared" }, // prettier-ignore
                                { offset: 0x2103, bit: 2, label: "Chest opened", separator: true }, // prettier-ignore
                                { offset: 0x23bc, bit: 1, label: "<b>Boo</b>: GumBoo (seen)" }, // prettier-ignore
                                { offset: 0x23b4, bit: 1, label: "<b>Boo</b>: GumBoo (captured)" }, // prettier-ignore
                              ],
                            },

                            {
                              name: "Money",
                              type: "bitflags",
                              flags: [
                                { offset: 0x221d, bit: 1, label: "Inside a cup" }, // prettier-ignore
                                { offset: 0x221d, bit: 2, label: "Inside a cup" }, // prettier-ignore
                                { offset: 0x221e, bit: 0, label: "Inside a chest" }, // prettier-ignore
                                { offset: 0x221e, bit: 2, label: "Inside a chest" }, // prettier-ignore
                                { offset: 0x221e, bit: 6, label: "Inside a chandelier", separator: true }, // prettier-ignore
                                { offset: 0x2373, bit: 3, label: "Speedy Spirit captured / escaped" }, // prettier-ignore
                              ],
                            },
                          ],
                        },
                      ],
                    },
                    {
                      name: "1F Conservatory",
                      items: [
                        {
                          type: "section",
                          flex: true,
                          items: [
                            {
                              name: "Events",
                              type: "bitflags",
                              flags: [
                                { offset: 0x212b, bit: 0, label: "Visited" }, // prettier-ignore
                                { offset: 0x212b, bit: 1, label: "Cleared" }, // prettier-ignore
                                { offset: 0x212b, bit: 2, label: "Chest opened", separator: true }, // prettier-ignore
                                { offset: 0x23bd, bit: 3, label: "<b>Boo</b>: Boomeo (seen)" }, // prettier-ignore
                                { offset: 0x23b5, bit: 3, label: "<b>Boo</b>: Boomeo (captured)" }, // prettier-ignore
                                { offset: 0x2358, bit: 6, label: "Melody Pianissima captured", hidden: true }, // prettier-ignore

                                // { offset: 0x2062, bit: 2, label: "Door from 1F Hallway to 1F Conservatory locked", reversed: true, separator: true }, // prettier-ignore
                                // ? { offset: 0x23c5, bit: 6, label: "1F Conservatory: Key to 1F Dining Room obtained" },
                                // { offset: 0x23c6, bit: 5, label: "1F Butler's Room: Key to 1F Conservatory obtained" },
                              ],
                            },
                            {
                              name: "Money",
                              type: "bitflags",
                              flags: [
                                { offset: 0x2211, bit: 6, label: "Inside a ceiling light" }, // prettier-ignore
                                { offset: 0x2218, bit: 1, label: "Inside a cupboard", separator: true }, // prettier-ignore
                                { offset: 0x2373, bit: 4, label: "Speedy Spirit captured / escaped" }, // prettier-ignore
                              ],
                            },
                          ],
                        },
                        {
                          name: "Melody Pianissima",
                          type: "section",
                          flex: true,
                          items: [
                            {
                              name: "Health",
                              offset: 0x2290,
                              type: "variable",
                              dataType: "uint16",
                              bigEndian: true,
                              max: 100,
                            },
                            {
                              name: "Rank",
                              offset: 0x23e5,
                              type: "variable",
                              dataType: "uint8",
                              binary: { bitStart: 4, bitLength: 2 },
                              resource: "portraitFrames",
                            },
                          ],
                        },
                      ],
                    },
                    {
                      name: "1F Dining Room",
                      items: [
                        {
                          type: "section",
                          flex: true,
                          items: [
                            {
                              name: "Events",
                              type: "bitflags",
                              flags: [
                                { offset: 0x2113, bit: 0, label: "Visited" }, // prettier-ignore
                                { offset: 0x2113, bit: 1, label: "Cleared" }, // prettier-ignore
                                { offset: 0x2113, bit: 2, label: "Chest opened", separator: true }, // prettier-ignore
                                { offset: 0x23bc, bit: 6, label: "<b>Boo</b>: Boodacious (seen)" }, // prettier-ignore
                                { offset: 0x23b4, bit: 6, label: "<b>Boo</b>: Boodacious (captured)" }, // prettier-ignore
                                { offset: 0x2359, bit: 4, label: "Mr. Luggs captured", hidden: true }, // prettier-ignore

                                // { offset: 0x2061, bit: 1, label: "Door from 1F Hallway to 1F Dining Room locked", reversed: true, separator: true }, // prettier-ignore
                                // ! { offset: 0x2061, bit: 4, label: "Door from 1F Dining Room to 1F Kitchen locked (unused)", reversed: true, separator: true }, // prettier-ignore
                                // ? { offset: 0x235b, bit: 0, label: "1F Dining Room: Waiter vaccumed once" },
                                // { offset: 0x23c5, bit: 6, label: "1F Conservatory: Key to 1F Dining Room obtained" },
                              ],
                            },
                            {
                              name: "Money",
                              type: "bitflags",
                              flags: [
                                { offset: 0x2223, bit: 7, label: "Inside a cupboard", separator: true }, // prettier-ignore
                                { offset: 0x2361, bit: 7, label: "Gold Mouse captured" }, // prettier-ignore
                                { offset: 0x2372, bit: 1, label: "Speedy Spirit captured / escaped" }, // prettier-ignore
                              ],
                            },
                          ],
                        },
                        {
                          name: "Mr. Luggs",
                          type: "section",
                          flex: true,
                          items: [
                            {
                              name: "Health",
                              offset: 0x2292,
                              type: "variable",
                              dataType: "uint16",
                              bigEndian: true,
                              max: 100,
                            },
                            {
                              name: "Rank",
                              offset: 0x23e5,
                              type: "variable",
                              dataType: "uint8",
                              binary: { bitStart: 6, bitLength: 2 },
                              resource: "portraitFrames",
                            },
                          ],
                        },
                      ],
                    },
                    {
                      name: "1F Kitchen",
                      items: [
                        {
                          type: "section",
                          flex: true,
                          items: [
                            {
                              name: "Events",
                              type: "bitflags",
                              flags: [
                                { offset: 0x2111, bit: 0, label: "Visited" }, // prettier-ignore
                                { offset: 0x2111, bit: 1, label: "Cleared" }, // prettier-ignore
                                { offset: 0x2111, bit: 2, label: "Chest opened" }, // prettier-ignore
                                { offset: 0x2362, bit: 7, label: "Water Element Medal obtained", separator: true }, // prettier-ignore
                                { offset: 0x2053, bit: 4, label: "Trigger Water Element Medal obtained message", hidden: true }, // prettier-ignore
                                { offset: 0x20c6, bit: 0, label: "Water Element Medal obtained message seen", hidden: true }, // prettier-ignore
                                { offset: 0x23bc, bit: 5, label: "<b>Boo</b>: Booligan (seen)" }, // prettier-ignore
                                { offset: 0x23b4, bit: 5, label: "<b>Boo</b>: Booligan (captured)" }, // prettier-ignore

                                // { offset: 0x2061, bit: 4, label: "Door from 1F Dining Room to 1F Kitchen locked (unused)", reversed: true, separator: true }, // prettier-ignore
                                // ! { offset: 0x2061, bit: 5, label: "Door from 1F Kitchen to 1F Boneyard locked (unused)", reversed: true, separator: true }, // prettier-ignore
                                // ? { offset: 0x2375, bit: 0, label: "1F Kitchen: Flaming door extinguished" },
                                // ! { offset: 0x23c5, bit: 3, label: "Key to 1F Kitchen obtained (unused)" },
                              ],
                            },

                            {
                              name: "Money",
                              type: "bitflags",
                              flags: [
                                { offset: 0x2209, bit: 0, label: "Inside a cupboard" }, // prettier-ignore
                                { offset: 0x220a, bit: 2, label: "Inside a ceiling light" }, // prettier-ignore
                                { offset: 0x220a, bit: 7, label: "Inside a oven", separator: true }, // prettier-ignore
                                { offset: 0x2361, bit: 4, label: "Gold Mouse captured" }, // prettier-ignore
                                { offset: 0x2372, bit: 5, label: "Speedy Spirit captured / escaped" }, // prettier-ignore
                              ],
                            },
                          ],
                        },
                      ],
                    },
                    {
                      name: "1F Boneyard",
                      items: [
                        {
                          type: "section",
                          flex: true,
                          items: [
                            {
                              name: "Events",
                              type: "bitflags",
                              flags: [
                                { offset: 0x2117, bit: 0, label: "Visited" }, // prettier-ignore
                                { offset: 0x2117, bit: 1, label: "Cleared" }, // prettier-ignore
                                { offset: 0x2117, bit: 2, label: "Plant opened" }, // prettier-ignore
                                { offset: 0x2363, bit: 0, label: "Spooky captured", hidden: true }, // prettier-ignore

                                // ? { offset: 0x2054, bit: 0, label: "1F Boneyard: Flower watered on Area 4" },
                                // ? { offset: 0x2057, bit: 6, label: "1F Boneyard: Flower watered 2" },
                                // ? { offset: 0x2057, bit: 7, label: "1F Boneyard: Flower watered 3" },
                                // { offset: 0x2061, bit: 5, label: "Door from 1F Kitchen to 1F Boneyard locked (unused)", reversed: true, separator: true }, // prettier-ignore
                                // # { offset: 0x235f, bit: 0, label: "1F Boneyard: Club Key related" },
                                // ? { offset: 0x2369, bit: 7, label: "1F Boneyard: Mr. Bones vaccumed once" },
                                // ! { offset: 0x23c5, bit: 2, label: "Key to 1F Boneyard (stairs to BF) obtained (unused)" },
                                // ? { offset: 0x23c9, bit: 2, label: "1F Boneyard: Club Key to 1F Courtyard (West) obtained" },
                              ],
                            },
                          ],
                        },
                        {
                          name: "Spooky",
                          type: "section",
                          flex: true,
                          items: [
                            {
                              name: "Health",
                              offset: 0x2294,
                              type: "variable",
                              dataType: "uint16",
                              bigEndian: true,
                              max: 100,
                            },
                            {
                              name: "Rank",
                              offset: 0x23e6,
                              type: "variable",
                              dataType: "uint8",
                              binary: { bitStart: 0, bitLength: 2 },
                              resource: "portraitFrames",
                            },
                          ],
                        },
                      ],
                    },
                    {
                      name: "1F Graveyard",
                      items: [
                        {
                          type: "section",
                          flex: true,
                          items: [
                            {
                              name: "Events",
                              type: "bitflags",
                              flags: [
                                { offset: 0x2121, bit: 0, label: "Visited" }, // prettier-ignore
                                { offset: 0x2121, bit: 1, label: "Cleared" }, // prettier-ignore
                                { offset: 0x2121, bit: 2, label: "Chest opened" }, // prettier-ignore
                                { offset: 0x2191, bit: 0, label: "Visited" }, // prettier-ignore
                                { offset: 0x2191, bit: 1, label: "Cleared", hidden: true }, // prettier-ignore
                                { offset: 0x236e, bit: 5, label: "Bogmire captured", hidden: true }, // prettier-ignore

                                // # { offset: 0x2055, bit: 3, label: "[Event] 1F Graveyard: Camera animation related" },
                                // ? { offset: 0x2056, bit: 3, label: "1F Graveyard: Chest appeared" },
                                // ? { offset: 0x2057, bit: 2, label: "[Event] 1F Graveyard: Tombstone is glowing" },
                                // ? 0x20c2 | uint8 | [Event] 1F Graveyard: Boss introduction
                                // ? { offset: 0x2355, bit: 5, label: "1F Graveyard and 3F Telephone Room: Mr. Bones vaccumed once" },
                              ],
                            },
                            {
                              name: "Money",
                              type: "bitflags",
                              flags: [
                                { offset: 0x2217, bit: 4, label: "Inside a gutter" }, // prettier-ignore
                              ],
                            },
                          ],
                        },
                        {
                          name: "Bogmire",
                          type: "section",
                          flex: true,
                          items: [
                            {
                              name: "Health",
                              offset: 0x2296,
                              type: "variable",
                              dataType: "uint16",
                              bigEndian: true,
                              max: 100,
                              hidden: true,
                            },
                            {
                              name: "Rank",
                              offset: 0x23e6,
                              type: "variable",
                              dataType: "uint8",
                              binary: { bitStart: 2, bitLength: 2 },
                              resource: "portraitFrames",
                            },
                          ],
                        },
                      ],
                    },
                    {
                      name: "1F Courtyard",
                      items: [
                        {
                          type: "section",
                          flex: true,
                          items: [
                            {
                              name: "Events",
                              type: "bitflags",
                              flags: [
                                { offset: 0x212f, bit: 0, label: "Visited" }, // prettier-ignore
                                { offset: 0x212f, bit: 1, label: "Cleared" }, // prettier-ignore
                                { offset: 0x212f, bit: 2, label: "Chest opened" }, // prettier-ignore
                                { offset: 0x2193, bit: 0, label: "Visited", hidden: true }, // prettier-ignore
                                { offset: 0x2193, bit: 1, label: "Cleared", hidden: true }, // prettier-ignore
                                { offset: 0x2054, bit: 6, label: "Toad reassured" }, // prettier-ignore

                                // ? { offset: 0x2051, bit: 3, label: "1F Courtyard: Trigger Mario's Letter obtained message" },
                                // ? { offset: 0x2063, bit: 6, label: "Door from 1F Rec Room to 1F Courtyard (East) locked", reversed: true, separator: true }, // prettier-ignore
                                // ? 0x2093 | uint8 | [Event] 1F Couryard: Mario's Letter obtained message triggered
                                // ? { offset: 0x236c, bit: 0, label: "1F Courtyard: Mario's Letter obtained" },
                                // ? { offset: 0x23c7, bit: 1, label: "BF Bottom of the Well: Key to 1F Courtyard (East) obtained" },
                                // { offset: 0x23c9, bit: 2, label: "1F Boneyard: Club Key to 1F Courtyard (West) obtained" },
                              ],
                            },
                            {
                              name: "Money",
                              type: "bitflags",
                              flags: [
                                { offset: 0x2211, bit: 0, label: "By watering a plant" }, // prettier-ignore
                                { offset: 0x2211, bit: 1, label: "By watering a plant" }, // prettier-ignore
                                { offset: 0x2212, bit: 7, label: "By watering a plant" }, // prettier-ignore
                                { offset: 0x2222, bit: 5, label: "Inside a statue" }, // prettier-ignore
                              ],
                            },
                          ],
                        },
                      ],
                    },
                    {
                      name: "1F Rec Room",
                      items: [
                        {
                          type: "section",
                          flex: true,
                          items: [
                            {
                              name: "Events",
                              type: "bitflags",
                              flags: [
                                { offset: 0x212d, bit: 0, label: "Visited" }, // prettier-ignore
                                { offset: 0x212d, bit: 1, label: "Cleared" }, // prettier-ignore
                                { offset: 0x212d, bit: 2, label: "Chest opened", separator: true }, // prettier-ignore
                                { offset: 0x23bd, bit: 4, label: "<b>Boo</b>: Booregard (seen)" }, // prettier-ignore
                                { offset: 0x23b5, bit: 4, label: "<b>Boo</b>: Booregard (captured)" }, // prettier-ignore
                                { offset: 0x235a, bit: 6, label: "Biff Atlas captured", hidden: true }, // prettier-ignore

                                // { offset: 0x2063, bit: 6, label: "Door from 1F Rec Room to 1F Courtyard (East) locked", reversed: true, separator: true }, // prettier-ignore
                                // ! { offset: 0x2063, bit: 7, label: "Door from 1F East Wing (stairs to 1F) to 1F Rec Room locked (unused)", reversed: true, separator: true }, // prettier-ignore
                                // ! { offset: 0x23c7, bit: 0, label: "Key to 1F Rec Room obtained (unused)" },
                                // ? { offset: 0x23cd, bit: 2, label: "Rec Room: Key to 1F Stairs leading to 2nd Floor obtained" },
                              ],
                            },
                            {
                              name: "Money",
                              type: "bitflags",
                              flags: [
                                { offset: 0x220d, bit: 0, label: "Inside a ceiling light" }, // prettier-ignore
                                { offset: 0x2218, bit: 0, label: "Inside a chest", separator: true }, // prettier-ignore
                                { offset: 0x2372, bit: 7, label: "Speedy Spirit captured / escaped" }, // prettier-ignore
                              ],
                            },
                          ],
                        },
                        {
                          name: "Biff Atlas",
                          type: "section",
                          flex: true,
                          items: [
                            {
                              name: "Health",
                              offset: 0x2298,
                              type: "variable",
                              dataType: "uint16",
                              bigEndian: true,
                              max: 100,
                            },
                            {
                              name: "Rank",
                              offset: 0x23e6,
                              type: "variable",
                              dataType: "uint8",
                              binary: { bitStart: 4, bitLength: 2 },
                              resource: "portraitFrames",
                            },
                          ],
                        },
                      ],
                    },
                    {
                      name: "1F Billiards Room",
                      items: [
                        {
                          type: "section",
                          flex: true,
                          items: [
                            {
                              name: "Events",
                              type: "bitflags",
                              flags: [
                                { offset: 0x2119, bit: 0, label: "Visited" }, // prettier-ignore
                                { offset: 0x2119, bit: 1, label: "Cleared" }, // prettier-ignore
                                { offset: 0x2119, bit: 2, label: "Chest opened", separator: true }, // prettier-ignore
                                { offset: 0x23bd, bit: 0, label: "<b>Boo</b>: Boohoo (seen)" }, // prettier-ignore
                                { offset: 0x23b5, bit: 0, label: "<b>Boo</b>: Boohoo (captured)" }, // prettier-ignore
                                { offset: 0x235a, bit: 7, label: "Slim Bankshot captured", hidden: true }, // prettier-ignore

                                // ! { offset: 0x2062, bit: 5, label: "Door from 1F Billiards Room to 1F Projection Room locked (unused)", reversed: true, separator: true }, // prettier-ignore
                                // { offset: 0x2062, bit: 6, label: "Door from 1F Hallway to 1F Billiards Room locked", reversed: true, separator: true }, // prettier-ignore
                                // ? { offset: 0x23c6, bit: 1, label: "2F Bathroom: Key to 1F Billiards Room obtained" },
                              ],
                            },
                            {
                              name: "Money",
                              type: "bitflags",
                              flags: [
                                { offset: 0x2213, bit: 2, label: "Inside a ceiling fan" }, // prettier-ignore
                                { offset: 0x2224, bit: 4, label: "Inside a drawer" }, // prettier-ignore
                                { offset: 0x2224, bit: 5, label: "Inside a drawer", separator: true }, // prettier-ignore
                                { offset: 0x2372, bit: 0, label: "Speedy Spirit captured / escaped" }, // prettier-ignore
                              ],
                            },
                          ],
                        },
                        {
                          name: "Slim Bankshot",
                          type: "section",
                          flex: true,
                          items: [
                            {
                              name: "Health",
                              offset: 0x229a,
                              type: "variable",
                              dataType: "uint16",
                              bigEndian: true,
                              max: 100,
                            },
                            {
                              name: "Rank",
                              offset: 0x23e6,
                              type: "variable",
                              dataType: "uint8",
                              binary: { bitStart: 6, bitLength: 2 },
                              resource: "portraitFrames",
                            },
                          ],
                        },
                      ],
                    },
                    {
                      name: "1F Projection Room",
                      items: [
                        {
                          type: "section",
                          flex: true,
                          items: [
                            {
                              name: "Events",
                              type: "bitflags",
                              flags: [
                                { offset: 0x211b, bit: 0, label: "Visited" }, // prettier-ignore
                                { offset: 0x211b, bit: 1, label: "Cleared" }, // prettier-ignore
                                { offset: 0x211b, bit: 2, label: "Chest opened", separator: true }, // prettier-ignore
                                { offset: 0x23bd, bit: 1, label: "<b>Boo</b>: ShamBoo (seen)" }, // prettier-ignore
                                { offset: 0x23b5, bit: 1, label: "<b>Boo</b>: ShamBoo (captured)" }, // prettier-ignore

                                // ? { offset: 0x2050, bit: 5, label: "1F Projection Room: Trigger Mario's Glove obtained message" },
                                // { offset: 0x2062, bit: 5, label: "Door from 1F Billiards Room to 1F Projection Room locked (unused)", reversed: true, separator: true }, // prettier-ignore
                                // ? 0x20a9 | uint8 | [Event] 1F Projecton Room: Mario's Glove obtained message triggered
                                // ? { offset: 0x236b, bit: 6, label: "1F Projection Room: Mario's Glove obtained" },
                                // ! { offset: 0x23c6, bit: 2, label: "Key to 1F Projection Room obtained (unused)" },
                              ],
                            },
                            {
                              name: "Money",
                              type: "bitflags",
                              flags: [
                                { offset: 0x2219, bit: 1, label: "Inside a cupboard" }, // prettier-ignore
                                { offset: 0x2219, bit: 6, label: "Inside a ceiling light" }, // prettier-ignore
                              ],
                            },
                          ],
                        },
                      ],
                    },
                    {
                      name: "1F Stairs to BF",
                      items: [
                        {
                          type: "section",
                          flex: true,
                          items: [
                            {
                              name: "Events",
                              type: "bitflags",
                              flags: [
                                { offset: 0x2183, bit: 0, label: "Visited" }, // prettier-ignore
                                { offset: 0x2183, bit: 1, label: "Cleared" }, // prettier-ignore
                              ],
                            },
                            {
                              name: "Money",
                              type: "bitflags",
                              flags: [
                                { offset: 0x2207, bit: 1, label: "Inside a ceiling light" }, // prettier-ignore
                              ],
                            },
                          ],
                        },
                      ],
                    },
                    {
                      name: "1F Stairs to 2F",
                      items: [
                        {
                          type: "section",
                          flex: true,
                          items: [
                            {
                              name: "Events",
                              type: "bitflags",
                              flags: [
                                { offset: 0x2127, bit: 0, label: "Visited" }, // prettier-ignore
                                { offset: 0x2127, bit: 1, label: "Cleared" }, // prettier-ignore

                                // ? { offset: 0x23cd, bit: 2, label: "Rec Room: Key to 1F Stairs leading to 2nd Floor obtained" },
                              ],
                            },
                          ],
                        },
                      ],
                    },
                    {
                      name: "2F Stairs to 1F",
                      items: [
                        {
                          type: "section",
                          flex: true,
                          items: [
                            {
                              name: "Events",
                              type: "bitflags",
                              flags: [
                                { offset: 0x213f, bit: 0, label: "Visited" }, // prettier-ignore
                                { offset: 0x213f, bit: 1, label: "Cleared" }, // prettier-ignore

                                // ? { offset: 0x2375, bit: 1, label: "2F East Hallway: Flaming door extinguished" },
                              ],
                            },
                            {
                              name: "Money",
                              type: "bitflags",
                              flags: [
                                { offset: 0x2226, bit: 0, label: "Inside a ceiling light" }, // prettier-ignore
                              ],
                            },
                          ],
                        },
                      ],
                    },
                    {
                      name: "2F Foyer",
                      items: [
                        {
                          type: "section",
                          flex: true,
                          items: [
                            {
                              name: "Events",
                              type: "bitflags",
                              flags: [
                                { offset: 0x213d, bit: 0, label: "Visited" }, // prettier-ignore
                                { offset: 0x213d, bit: 1, label: "Cleared" }, // prettier-ignore

                                // ? { offset: 0x204e, bit: 3, label: "[Event] 2F Foyer: Try to open closed door" },
                                // ? { offset: 0x2064, bit: 5, label: "Door from 2F Foyer to 2F Parlor locked", reversed: true, separator: true }, // prettier-ignore
                                // ? { offset: 0x2064, bit: 6, label: "Door from 2F Foyer to 2F West Hallway locked", reversed: true, separator: true }, // prettier-ignore
                                // ? 0x208f | uint8 | [Event] 2F Foyer: Warning about gallery ghosts message
                              ],
                            },
                            {
                              name: "Money",
                              type: "bitflags",
                              flags: [
                                { offset: 0x213d, bit: 3, label: "On the ground" }, // prettier-ignore
                              ],
                            },
                          ],
                        },
                      ],
                    },
                    {
                      name: "2F Parlor",
                      items: [
                        {
                          type: "section",
                          flex: true,
                          items: [
                            {
                              name: "Events",
                              type: "bitflags",
                              flags: [
                                { offset: 0x2147, bit: 0, label: "Visited" }, // prettier-ignore
                                { offset: 0x2147, bit: 1, label: "Cleared" }, // prettier-ignore
                                { offset: 0x2147, bit: 2, label: "Chest opened", separator: true }, // prettier-ignore
                                { offset: 0x23be, bit: 3, label: "<b>Boo</b>: BamBoo (seen)" }, // prettier-ignore
                                { offset: 0x23b6, bit: 3, label: "<b>Boo</b>: BamBoo (captured)" }, // prettier-ignore

                                // # { offset: 0x204e, bit: 7, label: "Related to 2F Parlor event" },
                                // ? { offset: 0x2064, bit: 1, label: "Door from 2F Parlor to 2F Anteroom locked", reversed: true, separator: true }, // prettier-ignore
                                // { offset: 0x2064, bit: 5, label: "Door from 2F Foyer to 2F Parlor locked", reversed: true, separator: true }, // prettier-ignore
                                // ? 0x2081 | uint8 | [Event] 2F Parlor: Introduction
                                // 0x2087 | uint8 | [Event] 1F Foyer: Ghost drop Key to 2F Parlor on the ground
                                // ? 0x20bd | uint8 | [Event] 2F Parlor: Portraits talked
                                // { offset: 0x23c8, bit: 2, label: "1F Foyer: Key to 2F Parlor obtained" },
                                // ? { offset: 0x23c8, bit: 6, label: "2F Parlor: Key to 2F Anteroom obtained" },
                              ],
                            },
                            {
                              name: "Money",
                              type: "bitflags",
                              flags: [
                                { offset: 0x2147, bit: 3, label: "On the ground" }, // prettier-ignore
                                { offset: 0x222a, bit: 5, label: "Inside a cupboard" }, // prettier-ignore
                                { offset: 0x223d, bit: 0, label: "Inside a bookshelf" }, // prettier-ignore
                                { offset: 0x223d, bit: 5, label: "Inside a drawer" }, // prettier-ignore
                              ],
                            },
                          ],
                        },
                      ],
                    },
                    {
                      name: "2F Anteroom",
                      items: [
                        {
                          type: "section",
                          flex: true,
                          items: [
                            {
                              name: "Events",
                              type: "bitflags",
                              flags: [
                                { offset: 0x214f, bit: 0, label: "Visited" }, // prettier-ignore
                                { offset: 0x214f, bit: 1, label: "Cleared", separator: true }, // prettier-ignore
                                { offset: 0x23be, bit: 5, label: "<b>Boo</b>: Bootha (seen)" }, // prettier-ignore
                                { offset: 0x23b6, bit: 5, label: "<b>Boo</b>: Bootha (captured)" }, // prettier-ignore

                                // { offset: 0x2064, bit: 1, label: "Door from 2F Parlor to 2F Anteroom locked", reversed: true, separator: true }, // prettier-ignore
                                // ! { offset: 0x2065, bit: 4, label: "Door from 2F Anteroom to 2F Wardrobe Room locked (unused)", reversed: true, separator: true }, // prettier-ignore
                                // { offset: 0x23c8, bit: 6, label: "2F Parlor: Key to 2F Anteroom obtained" },
                              ],
                            },
                            {
                              name: "Money",
                              type: "bitflags",
                              flags: [
                                { offset: 0x223a, bit: 3, label: "Inside a ceiling fan" }, // prettier-ignore
                                { offset: 0x223c, bit: 1, label: "Inside a chandelier" }, // prettier-ignore
                                { offset: 0x2240, bit: 4, label: "Inside a drawer" }, // prettier-ignore
                                { offset: 0x2240, bit: 5, label: "Inside a drawer" }, // prettier-ignore
                              ],
                            },
                          ],
                        },
                      ],
                    },
                    {
                      name: "2F Wardrobe Room",
                      items: [
                        {
                          type: "section",
                          flex: true,
                          items: [
                            {
                              name: "Events",
                              type: "bitflags",
                              flags: [
                                { offset: 0x214d, bit: 0, label: "Visited" }, // prettier-ignore
                                { offset: 0x214d, bit: 1, label: "Cleared" }, // prettier-ignore
                                { offset: 0x214d, bit: 2, label: "Chest opened", separator: true }, // prettier-ignore
                                { offset: 0x23be, bit: 4, label: "<b>Boo</b>: GameBoo Advance (seen)" }, // prettier-ignore
                                { offset: 0x23b6, bit: 4, label: "<b>Boo</b>: GameBoo Advance (captured)" }, // prettier-ignore
                                { offset: 0x236b, bit: 3, label: "Uncle Grimmly captured", hidden: true }, // prettier-ignore

                                // { offset: 0x2065, bit: 4, label: "Door from 2F Anteroom to 2F Wardrobe Room locked (unused)", reversed: true, separator: true }, // prettier-ignore
                                // ! { offset: 0x2065, bit: 6, label: "Door from 2F Wardrobe Room to 2F Balcony locked (unused)", reversed: true, separator: true }, // prettier-ignore
                                // ? { offset: 0x23c8, bit: 1, label: "2F Wardrobe Room: Key to 2F West Hallway obtained" },
                                // ! { offset: 0x23c9, bit: 3, label: "Key to 2F Wardrobe Room obtained (unused)" },
                                // ? { offset: 0x23cc, bit: 7, label: "2F Wardrobe Room: Key to BF Breaker Room obtained" },
                              ],
                            },
                            {
                              name: "Money",
                              type: "bitflags",
                              flags: [
                                { offset: 0x223b, bit: 0, label: "Inside a wardrobe", separator: true }, // prettier-ignore
                                { offset: 0x2373, bit: 0, label: "Speedy Spirit captured / escaped" }, // prettier-ignore
                              ],
                            },
                          ],
                        },
                        {
                          name: "Uncle Grimmly",
                          type: "section",
                          flex: true,
                          items: [
                            {
                              name: "Health",
                              offset: 0x22aa,
                              type: "variable",
                              dataType: "uint16",
                              bigEndian: true,
                              max: 100,
                            },
                            {
                              name: "Rank",
                              offset: 0x23e8,
                              type: "variable",
                              dataType: "uint8",
                              binary: { bitStart: 6, bitLength: 2 },
                              resource: "portraitFrames",
                            },
                          ],
                        },
                      ],
                    },
                    {
                      name: "2F Balcony",
                      items: [
                        {
                          type: "section",
                          flex: true,
                          items: [
                            {
                              name: "Events",
                              type: "bitflags",
                              flags: [
                                { offset: 0x214b, bit: 0, label: "Visited" }, // prettier-ignore
                                { offset: 0x214b, bit: 1, label: "Cleared" }, // prettier-ignore
                                { offset: 0x2053, bit: 2, label: "Toad reassured" }, // prettier-ignore

                                // { offset: 0x2065, bit: 6, label: "Door from 2F Wardrobe Room to 2F Balcony locked (unused)", reversed: true, separator: true }, // prettier-ignore
                                // ! { offset: 0x23c9, bit: 1, label: "Key to 2F Balcony obtained (unused)" },
                              ],
                            },
                            {
                              name: "Money",
                              type: "bitflags",
                              flags: [
                                { offset: 0x223b, bit: 2, label: "By watering a plant" }, // prettier-ignore
                                { offset: 0x223b, bit: 3, label: "By watering a plant" }, // prettier-ignore
                                { offset: 0x223b, bit: 4, label: "By watering a plant" }, // prettier-ignore
                                { offset: 0x223b, bit: 5, label: "By watering a plant" }, // prettier-ignore
                              ],
                            },
                          ],
                        },
                      ],
                    },
                    {
                      name: "2F West Hallway",
                      items: [
                        {
                          type: "section",
                          flex: true,
                          items: [
                            {
                              name: "Events",
                              type: "bitflags",
                              flags: [
                                { offset: 0x213b, bit: 0, label: "Visited" }, // prettier-ignore
                                { offset: 0x213b, bit: 1, label: "Cleared" }, // prettier-ignore

                                // { offset: 0x2058, bit: 0, label: "2F West Hallway: 2F Nursery Key obtained (trigger appearance of Chancey)" },
                                // { offset: 0x2063, bit: 0, label: "Door from 2F West Hallway to 2F Master Bedroom locked", reversed: true, separator: true }, // prettier-ignore
                                // ? { offset: 0x2063, bit: 3, label: "Door from 2F West Hallway to 2F The Twins' Room locked", reversed: true, separator: true }, // prettier-ignore
                                // { offset: 0x2063, bit: 4, label: "Door from 2F West Hallway to 2F Nursery locked", reversed: true, separator: true }, // prettier-ignore
                                // { offset: 0x2064, bit: 6, label: "Door from 2F Foyer to 2F West Hallway locked", reversed: true, separator: true }, // prettier-ignore
                                // { offset: 0x2064, bit: 7, label: "Door from 2F West Hallway to 2F Study locked (unused)", reversed: true, separator: true }, // prettier-ignore
                                // 0x209f | uint8 | [Event] 2F West Hallway: Animation camera door 2F Nursery
                                // # 0x20b3 | uint8 | Related to 2F West Hallway
                                // { offset: 0x23c8, bit: 1, label: "2F Wardrobe Room: Key to 2F West Hallway obtained" },
                              ],
                            },
                            {
                              name: "Money",
                              type: "bitflags",
                              flags: [
                                { offset: 0x213b, bit: 3, label: "On the ground" }, // prettier-ignore
                              ],
                            },
                          ],
                        },
                      ],
                    },
                    {
                      name: "2F Study",
                      items: [
                        {
                          type: "section",
                          flex: true,
                          items: [
                            {
                              name: "Events",
                              type: "bitflags",
                              flags: [
                                { offset: 0x2145, bit: 0, label: "Visited" }, // prettier-ignore
                                { offset: 0x2145, bit: 1, label: "Cleared" }, // prettier-ignore
                                { offset: 0x2145, bit: 2, label: "Chest opened", separator: true }, // prettier-ignore
                                { offset: 0x23be, bit: 2, label: "<b>Boo</b>: TaBoo (seen)" }, // prettier-ignore
                                { offset: 0x23b6, bit: 2, label: "<b>Boo</b>: TaBoo (captured)" }, // prettier-ignore
                                { offset: 0x2359, bit: 6, label: "Neville captured", hidden: true }, // prettier-ignore

                                // ? { offset: 0x2055, bit: 6, label: "2F Study: Neville vaccumed (trigger appearance of Lydia)" },
                                // ! { offset: 0x2064, bit: 7, label: "Door from 2F West Hallway to 2F Study locked (unused)", reversed: true, separator: true }, // prettier-ignore
                                // ? { offset: 0x23c7, bit: 7, label: "2F Study: Key to 2F Master Bedroom obtained" },
                                // ! { offset: 0x23c8, bit: 0, label: "Key to 2F Study obtained (unused)" },
                              ],
                            },
                            {
                              name: "Money",
                              type: "bitflags",
                              flags: [
                                { offset: 0x222c, bit: 6, label: "Inside a ceiling light" }, // prettier-ignore
                                { offset: 0x223f, bit: 6, label: "Inside a book" }, // prettier-ignore
                                { offset: 0x223f, bit: 7, label: "Inside a book", separator: true }, // prettier-ignore
                                { offset: 0x2374, bit: 4, label: "Gold Mouse captured" }, // prettier-ignore
                                { offset: 0x2372, bit: 2, label: "Speedy Spirit captured / escaped" }, // prettier-ignore
                              ],
                            },
                          ],
                        },
                        {
                          name: "Neville",
                          type: "section",
                          flex: true,
                          items: [
                            {
                              name: "Health",
                              offset: 0x2284,
                              type: "variable",
                              dataType: "uint16",
                              bigEndian: true,
                              max: 100,
                            },
                            {
                              name: "Rank",
                              offset: 0x23e4,
                              type: "variable",
                              dataType: "uint8",
                              binary: { bitStart: 0, bitLength: 2 },
                              resource: "portraitFrames",
                            },
                          ],
                        },
                      ],
                    },
                    {
                      name: "2F Master Bedroom",
                      items: [
                        {
                          type: "section",
                          flex: true,
                          items: [
                            {
                              name: "Events",
                              type: "bitflags",
                              flags: [
                                { offset: 0x2143, bit: 0, label: "Visited" }, // prettier-ignore
                                { offset: 0x2143, bit: 1, label: "Cleared" }, // prettier-ignore
                                { offset: 0x2143, bit: 2, label: "Chest opened", separator: true }, // prettier-ignore
                                { offset: 0x23be, bit: 1, label: "<b>Boo</b>: Boolicious (seen)" }, // prettier-ignore
                                { offset: 0x23b6, bit: 1, label: "<b>Boo</b>: Boolicious (captured)" }, // prettier-ignore
                                { offset: 0x2359, bit: 7, label: "Lydia captured", hidden: true }, // prettier-ignore

                                // ? { offset: 0x2063, bit: 0, label: "Door from 2F West Hallway to 2F Master Bedroom locked", reversed: true, separator: true }, // prettier-ignore
                                // ? 0x208e | uint8 | [Event] 2F Master Bedroom: Lydia talk when curtain is open
                                // ? { offset: 0x23c7, bit: 3, label: "2F Master Bedroom: Key to 2F Nursery obtained" },
                                // { offset: 0x23c7, bit: 7, label: "2F Study: Key to 2F Master Bedroom obtained" },
                              ],
                            },
                            {
                              name: "Money",
                              type: "bitflags",
                              flags: [
                                { offset: 0x222e, bit: 1, label: "Inside a ceiling fan" }, // prettier-ignore
                                { offset: 0x223d, bit: 2, label: "Inside a drawer" }, // prettier-ignore
                                { offset: 0x223d, bit: 3, label: "Inside a drawer" }, // prettier-ignore
                                { offset: 0x2243, bit: 0, label: "By watering a plant" }, // prettier-ignore
                              ],
                            },
                          ],
                        },
                        {
                          name: "Lydia",
                          type: "section",
                          flex: true,
                          items: [
                            {
                              name: "Health",
                              offset: 0x2286,
                              type: "variable",
                              dataType: "uint16",
                              bigEndian: true,
                              max: 100,
                            },
                            {
                              name: "Rank",
                              offset: 0x23e4,
                              type: "variable",
                              dataType: "uint8",
                              binary: { bitStart: 2, bitLength: 2 },
                              resource: "portraitFrames",
                            },
                          ],
                        },
                      ],
                    },
                    {
                      name: "2F Nursery",
                      items: [
                        {
                          type: "section",
                          flex: true,
                          items: [
                            {
                              name: "Events",
                              type: "bitflags",
                              flags: [
                                { offset: 0x2131, bit: 0, label: "Visited" }, // prettier-ignore
                                { offset: 0x2131, bit: 1, label: "Cleared" }, // prettier-ignore
                                { offset: 0x2131, bit: 2, label: "Chest opened", separator: true }, // prettier-ignore
                                { offset: 0x23bd, bit: 5, label: "<b>Boo</b>: Turboo (seen)" }, // prettier-ignore
                                { offset: 0x23b5, bit: 5, label: "<b>Boo</b>: Turboo (captured)" }, // prettier-ignore
                                { offset: 0x235c, bit: 0, label: "Chauncey captured", hidden: true }, // prettier-ignore

                                // ? { offset: 0x2053, bit: 6, label: "2F Nursery: Chest appeared" },
                                // # { offset: 0x2053, bit: 7, label: "2F Nursery: Chancey talk after being hit by a ballon before boss battle" },
                                // ? { offset: 0x2058, bit: 0, label: "2F West Hallway: 2F Nursery Key obtained (trigger appearance of Chancey)" },
                                // ? { offset: 0x2063, bit: 4, label: "Door from 2F West Hallway to 2F Nursery locked", reversed: true, separator: true }, // prettier-ignore
                                // ? 0x209f | uint8 | [Event] 2F West Hallway: Animation camera door 2F Nursery
                                // # { offset: 0x235e, bit: 7, label: "2F Nursery: Heart Key related" },
                                // ? { offset: 0x2364, bit: 1, label: "2F Nursery: Teddy Bear vaccumed once" },
                                // { offset: 0x23c4, bit: 3, label: "2F Nursery: Heart Key to 1F Hallway obtained" },
                                // { offset: 0x23c7, bit: 3, label: "2F Master Bedroom: Key to 2F Nursery obtained" },
                              ],
                            },
                            {
                              name: "Money",
                              type: "bitflags",
                              flags: [
                                { offset: 0x2131, bit: 3, label: "On the ground" }, // prettier-ignore
                                { offset: 0x222e, bit: 0, label: "Inside a ceiling light", separator: true }, // prettier-ignore
                                { offset: 0x2373, bit: 5, label: "Speedy Spirit captured / escaped" }, // prettier-ignore
                              ],
                            },
                          ],
                        },
                        {
                          name: "Chauncey",
                          type: "section",
                          flex: true,
                          items: [
                            {
                              name: "Health",
                              offset: 0x2288,
                              type: "variable",
                              dataType: "uint16",
                              bigEndian: true,
                              max: 100,
                              hidden: true,
                            },
                            {
                              name: "Rank",
                              offset: 0x23e4,
                              type: "variable",
                              dataType: "uint8",
                              binary: { bitStart: 4, bitLength: 2 },
                              resource: "portraitFrames",
                            },
                          ],
                        },
                      ],
                    },
                    {
                      name: "2F Tea Room",
                      items: [
                        {
                          type: "section",
                          flex: true,
                          items: [
                            {
                              name: "Events",
                              type: "bitflags",
                              flags: [
                                { offset: 0x215f, bit: 0, label: "Visited" }, // prettier-ignore
                                { offset: 0x215f, bit: 1, label: "Cleared" }, // prettier-ignore
                                { offset: 0x215f, bit: 2, label: "Chest opened" }, // prettier-ignore
                                { offset: 0x2362, bit: 6, label: "Ice Element Medal obtained", separator: true }, // prettier-ignore
                                { offset: 0x2053, bit: 5, label: "Trigger Ice Element Medal obtained message", hidden: true }, // prettier-ignore
                                { offset: 0x208c, bit: 0, label: "Ice Element Medal obtained message seen", hidden: true }, // prettier-ignore
                                { offset: 0x23bf, bit: 0, label: "<b>Boo</b>: Mr. Boojangles (seen)" }, // prettier-ignore
                                { offset: 0x23b7, bit: 0, label: "<b>Boo</b>: Mr. Boojangles (captured)" }, // prettier-ignore

                                // ! { offset: 0x2065, bit: 0, label: "Door from 2F East Wing (stairs to 1F) to 2F Tea Room locked (unused)", reversed: true, separator: true }, // prettier-ignore
                                // ! { offset: 0x23c9, bit: 7, label: "Key to 2F Tea Room obtained (unused)" },
                              ],
                            },
                            {
                              name: "Money",
                              type: "bitflags",
                              flags: [
                                { offset: 0x2232, bit: 7, label: "Inside a chandelier" }, // prettier-ignore
                                { offset: 0x2240, bit: 1, label: "Inside a drawer", separator: true }, // prettier-ignore
                                { offset: 0x2374, bit: 5, label: "Gold Mouse captured" }, // prettier-ignore
                                { offset: 0x2361, bit: 5, label: "Gold Mouse captured" }, // prettier-ignore
                              ],
                            },
                          ],
                        },
                      ],
                    },
                    {
                      name: "2F Hallway",
                      items: [
                        {
                          type: "section",
                          flex: true,
                          items: [
                            {
                              name: "Events",
                              type: "bitflags",
                              flags: [
                                { offset: 0x2157, bit: 0, label: "Visited" }, // prettier-ignore
                                { offset: 0x2157, bit: 1, label: "Cleared" }, // prettier-ignore
                                { offset: 0x2159, bit: 0, label: "Visited", hidden: true }, // prettier-ignore
                                { offset: 0x2159, bit: 1, label: "Cleared", hidden: true }, // prettier-ignore
                                { offset: 0x2135, bit: 0, label: "Visited", hidden: true }, // prettier-ignore
                                { offset: 0x2135, bit: 1, label: "Cleared", hidden: true }, // prettier-ignore
                                { offset: 0x2181, bit: 0, label: "Visited", hidden: true }, // prettier-ignore
                                { offset: 0x2181, bit: 1, label: "Cleared", hidden: true }, // prettier-ignore
                                { offset: 0x2141, bit: 0, label: "Visited", hidden: true }, // prettier-ignore
                                { offset: 0x2141, bit: 1, label: "Cleared", hidden: true }, // prettier-ignore

                                // ? { offset: 0x2063, bit: 2, label: "Door from 2F Hallway to 2F Sitting Room locked", reversed: true, separator: true }, // prettier-ignore
                                // ! { offset: 0x2065, bit: 2, label: "Door from 2F Hallway to 2F Washroom locked (unused)", reversed: true, separator: true }, // prettier-ignore
                                // ! { offset: 0x2065, bit: 3, label: "Door from 2F Hallway to 2F Astral Hall locked (unused)", reversed: true, separator: true }, // prettier-ignore
                                // ! { offset: 0x2066, bit: 6, label: "Door from 2F Hallway to 2F Nana's Room locked (unused)", reversed: true, separator: true }, // prettier-ignore
                                // ! { offset: 0x2066, bit: 7, label: "Door from 2F Hallway to 2F Bathroom locked (unused)", reversed: true, separator: true }, // prettier-ignore
                                // ! { offset: 0x2069, bit: 4, label: "Door from 2F Hallway to 2F East Wing (stairs to 1F) locked (unused)", reversed: true, separator: true }, // prettier-ignore
                                // ? 0x208d | uint8 | [Event] 2F Hallway: Twins ask Luigi to come seek them triggered
                              ],
                            },
                            {
                              name: "Money",
                              type: "bitflags",
                              flags: [
                                { offset: 0x2241, bit: 2, label: "Inside a vase" }, // prettier-ignore
                                { offset: 0x2241, bit: 3, label: "Inside a vase" }, // prettier-ignore
                                { offset: 0x2241, bit: 5, label: "Inside a vase" }, // prettier-ignore
                                { offset: 0x2241, bit: 7, label: "Inside a vase", separator: true }, // prettier-ignore
                                { offset: 0x2361, bit: 3, label: "Gold Mouse captured" }, // prettier-ignore
                              ],
                            },
                          ],
                        },
                      ],
                    },
                    {
                      name: "2F Bathroom",
                      items: [
                        {
                          type: "section",
                          flex: true,
                          items: [
                            {
                              name: "Events",
                              type: "bitflags",
                              flags: [
                                { offset: 0x215b, bit: 0, label: "Visited" }, // prettier-ignore
                                { offset: 0x215b, bit: 1, label: "Cleared" }, // prettier-ignore
                                { offset: 0x215b, bit: 2, label: "Chest opened" }, // prettier-ignore
                                { offset: 0x2359, bit: 5, label: "Miss Petunia captured", hidden: true }, // prettier-ignore

                                // { offset: 0x2066, bit: 7, label: "Door from 2F Hallway to 2F Bathroom locked (unused)", reversed: true, separator: true }, // prettier-ignore
                                // ? 0x20a2 | uint8 | [Event] 2F Bathroom: Miss Petunia sneezed
                                // { offset: 0x23c6, bit: 1, label: "2F Bathroom: Key to 1F Billiards Room obtained" },
                                // ! { offset: 0x23ca, bit: 0, label: "Key to 2F Bathroom obtained (unused)" },
                              ],
                            },
                            {
                              name: "Miss Petunia",
                              type: "section",
                              flex: true,
                              items: [
                                {
                                  name: "Health",
                                  offset: 0x229c,
                                  type: "variable",
                                  dataType: "uint16",
                                  bigEndian: true,
                                  max: 100,
                                },
                                {
                                  name: "Rank",
                                  offset: 0x23e7,
                                  type: "variable",
                                  dataType: "uint8",
                                  binary: { bitStart: 0, bitLength: 2 },
                                  resource: "portraitFrames",
                                },
                              ],
                            },
                          ],
                        },
                      ],
                    },
                    {
                      name: "2F Washroom",
                      items: [
                        {
                          type: "section",
                          flex: true,
                          items: [
                            {
                              name: "Events",
                              type: "bitflags",
                              flags: [
                                { offset: 0x2155, bit: 0, label: "Visited" }, // prettier-ignore
                                { offset: 0x2155, bit: 1, label: "Cleared" }, // prettier-ignore
                                { offset: 0x2155, bit: 2, label: "Chest opened" }, // prettier-ignore

                                // { offset: 0x2065, bit: 2, label: "Door from 2F Hallway to 2F Washroom locked (unused)", reversed: true, separator: true }, // prettier-ignore
                                // ! { offset: 0x23c9, bit: 5, label: "Key to 2F Washroom obtained (unused)" },
                              ],
                            },
                            {
                              name: "Money",
                              type: "bitflags",
                              flags: [
                                { offset: 0x2237, bit: 4, label: "Inside a ceiling light" }, // prettier-ignore
                              ],
                            },
                          ],
                        },
                      ],
                    },
                    {
                      name: "2F Nana's Room",
                      items: [
                        {
                          type: "section",
                          flex: true,
                          items: [
                            {
                              name: "Events",
                              type: "bitflags",
                              flags: [
                                { offset: 0x215d, bit: 0, label: "Visited" }, // prettier-ignore
                                { offset: 0x215d, bit: 1, label: "Cleared" }, // prettier-ignore
                                { offset: 0x215d, bit: 2, label: "Chest opened", separator: true }, // prettier-ignore
                                { offset: 0x23be, bit: 7, label: "<b>Boo</b>: LimBooger (seen)" }, // prettier-ignore
                                { offset: 0x23b6, bit: 7, label: "<b>Boo</b>: LimBooger (captured)" }, // prettier-ignore
                                { offset: 0x235a, bit: 0, label: "Nana captured", hidden: true }, // prettier-ignore
                              ],
                            },
                            {
                              name: "Money",
                              type: "bitflags",
                              flags: [
                                { offset: 0x222f, bit: 4, label: "Inside a chandelier" }, // prettier-ignore
                                { offset: 0x223c, bit: 4, label: "Inside a drawer", separator: true }, // prettier-ignore
                                { offset: 0x2372, bit: 4, label: "Speedy Spirit captured / escaped" }, // prettier-ignore
                              ],
                            },
                          ],
                        },
                        {
                          name: "Nana",
                          type: "section",
                          flex: true,
                          items: [
                            {
                              name: "Health",
                              offset: 0x229e,
                              type: "variable",
                              dataType: "uint16",
                              bigEndian: true,
                              max: 100,
                            },
                            {
                              name: "Rank",
                              offset: 0x23e7,
                              type: "variable",
                              dataType: "uint8",
                              binary: { bitStart: 2, bitLength: 2 },
                              resource: "portraitFrames",
                            },
                          ],
                        },
                      ],
                    },
                    {
                      name: "2F The Twins' Room",
                      items: [
                        {
                          type: "section",
                          flex: true,
                          items: [
                            {
                              name: "Events",
                              type: "bitflags",
                              flags: [
                                { offset: 0x2133, bit: 0, label: "Visited" }, // prettier-ignore
                                { offset: 0x2133, bit: 1, label: "Cleared" }, // prettier-ignore
                                { offset: 0x2133, bit: 2, label: "Chest opened", separator: true }, // prettier-ignore
                                { offset: 0x23bd, bit: 6, label: "<b>Boo</b>: Booris (seen)" }, // prettier-ignore
                                { offset: 0x23b5, bit: 6, label: "<b>Boo</b>: Booris (captured)" }, // prettier-ignore
                                { offset: 0x235a, bit: 1, label: "Orville captured", hidden: true }, // prettier-ignore
                                { offset: 0x235a, bit: 1, label: "Henry captured", hidden: true }, // prettier-ignore

                                // ? { offset: 0x2051, bit: 0, label: "2F The Twins' Room: Trigger Mario's Shoe obtained message" },
                                // ? { offset: 0x2052, bit: 5, label: "[Event] 2F The Twins' Room: Triggered Twins ask Luigi to come seek them" },
                                // # { offset: 0x2054, bit: 3, label: "[Event] 2F The Twins' Room: Related to Twins vaccumed" },
                                // # { offset: 0x2056, bit: 1, label: "[Event] 2F The Twins' Room: Related to hide and seek game" },
                                // { offset: 0x2063, bit: 3, label: "Door from 2F West Hallway to 2F The Twins' Room locked", reversed: true, separator: true }, // prettier-ignore
                                // ? 0x2092 | uint8 | [Event] 2F The Twins' Room: Mario's Shoe obtained message
                                // ? { offset: 0x236b, bit: 7, label: "2F The Twins' Room: Mario's Shoe obtained" },
                                // ? { offset: 0x23c7, bit: 4, label: "2F Nana's Room: Key to 2F The Twins' Room obtained" },
                              ],
                            },
                            {
                              name: "Money",
                              type: "bitflags",
                              flags: [
                                { offset: 0x2235, bit: 7, label: "Inside a ceiling light" }, // prettier-ignore
                                { offset: 0x2240, bit: 3, label: "Inside a drawer", separator: true }, // prettier-ignore
                                { offset: 0x2372, bit: 3, label: "Speedy Spirit captured / escaped" }, // prettier-ignore
                              ],
                            },
                          ],
                        },
                        {
                          name: "Henry and Orville",
                          type: "section",
                          flex: true,
                          items: [
                            {
                              name: "Health",
                              offset: 0x22a0,
                              type: "variable",
                              dataType: "uint16",
                              bigEndian: true,
                              max: 100,
                            },
                            {
                              name: "Rank",
                              offset: 0x23e7,
                              type: "variable",
                              dataType: "uint8",
                              binary: { bitStart: 4, bitLength: 2 },
                              resource: "portraitFrames",
                            },
                          ],
                        },
                      ],
                    },
                    {
                      name: "2F Astral Hall",
                      items: [
                        {
                          type: "section",
                          flex: true,
                          items: [
                            {
                              name: "Events",
                              type: "bitflags",
                              flags: [
                                { offset: 0x2151, bit: 0, label: "Visited" }, // prettier-ignore
                                { offset: 0x2151, bit: 1, label: "Cleared", separator: true }, // prettier-ignore
                                { offset: 0x23be, bit: 6, label: "<b>Boo</b>: Boonswoggle (seen)" }, // prettier-ignore
                                { offset: 0x23b6, bit: 6, label: "<b>Boo</b>: Boonswoggle (captured)" }, // prettier-ignore

                                // ? { offset: 0x2051, bit: 6, label: "1F Observatory: Trigger Mario's Star obtained message" },
                                // ? { offset: 0x2058, bit: 3, label: "2F Astral Hall: Access to 2F Observatory" },
                                // { offset: 0x2065, bit: 3, label: "Door from 2F Hallway to 2F Astral Hall locked (unused)", reversed: true, separator: true }, // prettier-ignore
                                // ! { offset: 0x2065, bit: 7, label: "Door from 2F Astral Hall to 2F Observatory locked (unused)", reversed: true, separator: true }, // prettier-ignore
                                // # 0x20cc | uint8 | [Event] 2F Astral Hall: Related to central platform
                                // ? { offset: 0x2357, bit: 1, label: "2F Astral Hall: Red Ghost Guy vaccumed once" },
                                // ? { offset: 0x2357, bit: 2, label: "2F Astral Hall: Green Ghost Guy vaccumed once" },
                                // ? { offset: 0x2368, bit: 3, label: "2F Astral Hall: Ghost Guy's Mask vaccumed once" },
                                // ! { offset: 0x23c9, bit: 4, label: "Key to 2F Astral Hall obtained (unused)" },
                              ],
                            },
                            {
                              name: "Money",
                              type: "bitflags",
                              flags: [
                                { offset: 0x2237, bit: 0, label: "Inside a chandelier" }, // prettier-ignore
                                { offset: 0x223c, bit: 3, label: "Inside a drawer" }, // prettier-ignore
                              ],
                            },
                          ],
                        },
                      ],
                    },
                    {
                      name: "2F Observatory",
                      items: [
                        {
                          type: "section",
                          flex: true,
                          items: [
                            {
                              name: "Events",
                              type: "bitflags",
                              flags: [
                                { offset: 0x2153, bit: 0, label: "Visited" }, // prettier-ignore
                                { offset: 0x2153, bit: 1, label: "Cleared" }, // prettier-ignore

                                // ? { offset: 0x2054, bit: 1, label: "2F Observatory: Astral room (after looking at the telescope)" },
                                // ? { offset: 0x2054, bit: 2, label: "2F Observatory: Astral path appeared" },
                                // ? { offset: 0x2054, bit: 4, label: "2F Observatory: Related to astral path appeared (animation seen?)" },
                                // { offset: 0x2058, bit: 3, label: "2F Astral Hall: Access to 2F Observatory" },
                                // { offset: 0x2065, bit: 7, label: "Door from 2F Astral Hall to 2F Observatory locked (unused)", reversed: true, separator: true }, // prettier-ignore
                                // ? 0x2094 | uint8 | [Event] 2F Observatory: Mario's Star obtained message triggered
                                // ? { offset: 0x236b, bit: 5, label: "2F Observatory: Mario's Star obtained" },
                                // ! { offset: 0x23c9, bit: 0, label: "Key to 2F Observatory obtained (unused)" },
                              ],
                            },
                            {
                              name: "Money",
                              type: "bitflags",
                              flags: [
                                { offset: 0x223a, bit: 1, label: "Inside a drawer" }, // prettier-ignore
                              ],
                            },
                          ],
                        },
                      ],
                    },
                    {
                      name: "2F Sealed Room",
                      items: [
                        {
                          type: "section",
                          flex: true,
                          items: [
                            {
                              name: "Events",
                              type: "bitflags",
                              flags: [
                                { offset: 0x2149, bit: 0, label: "Visited" }, // prettier-ignore
                                { offset: 0x2149, bit: 1, label: "Cleared" }, // prettier-ignore
                                { offset: 0x2149, bit: 2, label: "Chest opened" }, // prettier-ignore

                                // ? { offset: 0x23c7, bit: 5, label: "2F Sealed Room: Key to 2F Sitting Room obtained" },
                              ],
                            },
                            {
                              name: "Money",
                              type: "bitflags",
                              flags: [
                                { offset: 0x2239, bit: 4, label: "Inside a trophy" }, // prettier-ignore
                                { offset: 0x2239, bit: 5, label: "Inside a trophy" }, // prettier-ignore
                                { offset: 0x2239, bit: 7, label: "Inside a trophy" }, // prettier-ignore
                                { offset: 0x223a, bit: 7, label: "Inside a chandelier" }, // prettier-ignore
                                { offset: 0x2242, bit: 0, label: "Inside a chest" }, // prettier-ignore
                                { offset: 0x2242, bit: 1, label: "Inside a chest" }, // prettier-ignore
                                { offset: 0x2242, bit: 2, label: "Inside a chest" }, // prettier-ignore
                                { offset: 0x2242, bit: 3, label: "Inside a chest" }, // prettier-ignore
                                { offset: 0x2242, bit: 4, label: "Inside a chest" }, // prettier-ignore
                                { offset: 0x2242, bit: 6, label: "Inside a chest" }, // prettier-ignore
                                { offset: 0x2243, bit: 7, label: "Inside a chest", separator: true }, // prettier-ignore
                                { offset: 0x2361, bit: 6, label: "Gold Mouse captured" }, // prettier-ignore
                                { offset: 0x2372, bit: 6, label: "Speedy Spirit captured / escaped" }, // prettier-ignore
                              ],
                            },
                          ],
                        },
                      ],
                    },
                    {
                      name: "2F Sitting Room",
                      items: [
                        {
                          type: "section",
                          flex: true,
                          items: [
                            {
                              name: "Events",
                              type: "bitflags",
                              flags: [
                                { offset: 0x2137, bit: 0, label: "Visited" }, // prettier-ignore
                                { offset: 0x2137, bit: 1, label: "Cleared", separator: true }, // prettier-ignore
                                { offset: 0x23bd, bit: 7, label: "<b>Boo</b>: Boolivia (seen)" }, // prettier-ignore
                                { offset: 0x23b5, bit: 7, label: "<b>Boo</b>: Boolivia (captured)" }, // prettier-ignore

                                // ! { offset: 0x2063, bit: 1, label: "Door from 2F Sitting Room to 2F Guest Room locked (unused)", reversed: true, separator: true }, // prettier-ignore
                                // { offset: 0x2063, bit: 2, label: "Door from 2F Hallway to 2F Sitting Room locked", reversed: true, separator: true }, // prettier-ignore
                                // ? 0x2099 | uint8 | [Event] 2F Sitting Room: Animation of earthquake upside down seen
                                // { offset: 0x23c7, bit: 5, label: "2F Sealed Room: Key to 2F Sitting Room obtained" },
                              ],
                            },
                            {
                              name: "Money",
                              type: "bitflags",
                              flags: [
                                { offset: 0x2233, bit: 5, label: "By watering a plant" }, // prettier-ignore
                              ],
                            },
                          ],
                        },
                      ],
                    },
                    {
                      name: "2F Guest Room",
                      items: [
                        {
                          type: "section",
                          flex: true,
                          items: [
                            {
                              name: "Events",
                              type: "bitflags",
                              flags: [
                                { offset: 0x2139, bit: 0, label: "Visited" }, // prettier-ignore
                                { offset: 0x2139, bit: 1, label: "Cleared" }, // prettier-ignore
                                { offset: 0x2139, bit: 2, label: "Chest opened", separator: true }, // prettier-ignore
                                { offset: 0x23be, bit: 0, label: "<b>Boo</b>: Boonita (seen)" }, // prettier-ignore
                                { offset: 0x23b6, bit: 0, label: "<b>Boo</b>: Boonita (captured)" }, // prettier-ignore
                                { offset: 0x2369, bit: 5, label: "Sue Pea captured", hidden: true }, // prettier-ignore

                                // # { offset: 0x2050, bit: 2, label: "[2F Guest Room] Related to room upside down" },
                                // ? { offset: 0x2052, bit: 4, label: "[2F Guest Room] Room upside down" },
                                // # { offset: 0x2052, bit: 6, label: "[2F Guest Room] Related to room upside down" },
                                // { offset: 0x2063, bit: 1, label: "Door from 2F Sitting Room to 2F Guest Room locked (unused)", reversed: true, separator: true }, // prettier-ignore
                                // ? 0x20d6 | uint8 | [Event] 2F Guest Room: Sue Pea awoken
                                // ? 0x20d7 | uint8 | [Event] 2F Guest Room: Sue Pea saying to go away seen
                                // ! { offset: 0x23c7, bit: 6, label: "Key to 2F Guest Room obtained (unused)" },
                              ],
                            },
                            {
                              name: "Money",
                              type: "bitflags",
                              flags: [
                                { offset: 0x2234, bit: 5, label: "By watering a plant" }, // prettier-ignore
                                { offset: 0x223e, bit: 5, label: "Inside a drawer" }, // prettier-ignore
                              ],
                            },
                          ],
                        },
                        {
                          name: "Sue Pea",
                          type: "section",
                          flex: true,
                          items: [
                            {
                              name: "Health",
                              offset: 0x22a6,
                              type: "variable",
                              dataType: "uint16",
                              bigEndian: true,
                              max: 100,
                            },
                            {
                              name: "Rank",
                              offset: 0x23e8,
                              type: "variable",
                              dataType: "uint8",
                              binary: { bitStart: 2, bitLength: 2 },
                              resource: "portraitFrames",
                            },
                          ],
                        },
                      ],
                    },
                    {
                      name: "3F Stairs to 2F",
                      items: [
                        {
                          type: "section",
                          flex: true,
                          items: [
                            {
                              name: "Events",
                              type: "bitflags",
                              flags: [
                                { offset: 0x211f, bit: 0, label: "Visited" }, // prettier-ignore
                                { offset: 0x211f, bit: 1, label: "Cleared", hidden: true }, // prettier-ignore
                              ],
                            },
                          ],
                        },
                      ],
                    },
                    {
                      name: "3F Safari Room",
                      items: [
                        {
                          type: "section",
                          flex: true,
                          items: [
                            {
                              name: "Events",
                              type: "bitflags",
                              flags: [
                                { offset: 0x2169, bit: 0, label: "Visited" }, // prettier-ignore
                                { offset: 0x2169, bit: 1, label: "Cleared" }, // prettier-ignore
                                { offset: 0x2169, bit: 2, label: "Chest opened", separator: true }, // prettier-ignore
                                { offset: 0x23bf, bit: 3, label: "<b>Boo</b>: Little Boo Peep (seen)" }, // prettier-ignore
                                { offset: 0x23b7, bit: 3, label: "<b>Boo</b>: Little Boo Peep (captured)" }, // prettier-ignore

                                // ! { offset: 0x2066, bit: 0, label: "Door from 3F Safari Room to 3F East Wing locked (unused)", reversed: true, separator: true }, // prettier-ignore
                                // ? { offset: 0x2067, bit: 7, label: "Door from 3F East Wing to 3F Safari Room locked", reversed: true, separator: true }, // prettier-ignore
                                // { offset: 0x23cb, bit: 0, label: "1F Fortune-teller's Room: Key to 3F Safari Room obtained" },
                                // ? { offset: 0x23cb, bit: 6, label: "3F Safari Room: Key to 3F Balcony (East) obtained" },
                              ],
                            },
                            {
                              name: "Money",
                              type: "bitflags",
                              flags: [
                                { offset: 0x224f, bit: 6, label: "Inside a ceiling light" }, // prettier-ignore
                                { offset: 0x224f, bit: 7, label: "Inside a ceiling light", separator: true }, // prettier-ignore
                                { offset: 0x2374, bit: 6, label: "Gold Mouse captured" }, // prettier-ignore
                              ],
                            },
                          ],
                        },
                      ],
                    },
                    {
                      name: "3F East Hallway",
                      items: [
                        {
                          type: "section",
                          flex: true,
                          items: [
                            {
                              name: "Events",
                              type: "bitflags",
                              flags: [
                                { offset: 0x2175, bit: 0, label: "Visited" }, // prettier-ignore
                                { offset: 0x2175, bit: 1, label: "Cleared", hidden: true }, // prettier-ignore
                                { offset: 0x2167, bit: 0, label: "Visited", hidden: true }, // prettier-ignore
                                { offset: 0x2167, bit: 1, label: "Cleared", hidden: true }, // prettier-ignore
                              ],
                            },
                          ],
                        },
                      ],
                    },
                    {
                      name: "3F Balcony",
                      items: [
                        {
                          type: "section",
                          flex: true,
                          items: [
                            {
                              name: "Events",
                              type: "bitflags",
                              flags: [
                                { offset: 0x2177, bit: 0, label: "Visited" }, // prettier-ignore
                                { offset: 0x2177, bit: 1, label: "Cleared" }, // prettier-ignore
                                { offset: 0x2177, bit: 2, label: "Chest opened" }, // prettier-ignore
                                { offset: 0x2376, bit: 0, label: "Diamond door to 3F West Hallway unsealed" }, // prettier-ignore
                                { offset: 0x23b8, bit: 3, label: "<b>Boo</b>: Part of Boolossus (captured)", hidden: true }, // prettier-ignore
                                { offset: 0x23b8, bit: 4, label: "<b>Boo</b>: Part of Boolossus (captured)", hidden: true }, // prettier-ignore
                                { offset: 0x23b8, bit: 5, label: "<b>Boo</b>: Part of Boolossus (captured)", hidden: true }, // prettier-ignore
                                { offset: 0x23b8, bit: 6, label: "<b>Boo</b>: Part of Boolossus (captured)", hidden: true }, // prettier-ignore
                                { offset: 0x23b8, bit: 7, label: "<b>Boo</b>: Part of Boolossus (captured)", hidden: true }, // prettier-ignore
                                { offset: 0x23b9, bit: 0, label: "<b>Boo</b>: Part of Boolossus (captured)", hidden: true }, // prettier-ignore
                                { offset: 0x23b9, bit: 1, label: "<b>Boo</b>: Part of Boolossus (captured)", hidden: true }, // prettier-ignore
                                { offset: 0x23b9, bit: 2, label: "<b>Boo</b>: Part of Boolossus (captured)", hidden: true }, // prettier-ignore
                                { offset: 0x23b9, bit: 3, label: "<b>Boo</b>: Part of Boolossus (captured)", hidden: true }, // prettier-ignore
                                { offset: 0x23b9, bit: 4, label: "<b>Boo</b>: Part of Boolossus (captured)", hidden: true }, // prettier-ignore
                                { offset: 0x23b9, bit: 5, label: "<b>Boo</b>: Part of Boolossus (captured)", hidden: true }, // prettier-ignore
                                { offset: 0x23b9, bit: 6, label: "<b>Boo</b>: Part of Boolossus (captured)", hidden: true }, // prettier-ignore
                                { offset: 0x23b9, bit: 7, label: "<b>Boo</b>: Part of Boolossus (captured)", hidden: true }, // prettier-ignore
                                { offset: 0x23ba, bit: 0, label: "<b>Boo</b>: Part of Boolossus (captured)", hidden: true }, // prettier-ignore
                                { offset: 0x23ba, bit: 1, label: "<b>Boo</b>: Part of Boolossus (captured)", hidden: true }, // prettier-ignore
                                { offset: 0x236f, bit: 4, label: "Boolossus captured", hidden: true }, // prettier-ignore

                                // ? { offset: 0x2058, bit: 1, label: "3F Balcony: Chest appeared" },
                                // ? { offset: 0x2067, bit: 1, label: "Door from 3F Balcony to 3F Right Wing locked", reversed: true, separator: true }, // prettier-ignore
                                // ? { offset: 0x2067, bit: 4, label: "Door from 3F Balcony to 3F Left Wing locked", reversed: true, separator: true }, // prettier-ignore
                                // # 0x20ac | uint8 | [Event] 3F Balcony (after unsealed door) related
                                // # 0x20c7 | uint8 | [Event] 3F Balcony: Boos Animation related
                                // # 0x20c8 | uint8 | [Event] 3F Balcony: Boolossus Animation related
                                // # { offset: 0x235f, bit: 1, label: "3F Balcony: Diamond Key related" },
                                // ? { offset: 0x236e, bit: 6, label: "3F Balcony: Boolossus single boo vaccumed once" },
                                // ? { offset: 0x23cb, bit: 3, label: "3F Balcony: Diamond Key to 3F Balcony (West) obtained" },
                                // { offset: 0x23cb, bit: 6, label: "3F Safari Room: Key to 3F Balcony (East) obtained" },
                              ],
                            },
                            {
                              name: "Money",
                              type: "bitflags",
                              flags: [
                                { offset: 0x224b, bit: 1, label: "By watering a plant" }, // prettier-ignore
                                { offset: 0x224b, bit: 2, label: "By watering a plant" }, // prettier-ignore
                                { offset: 0x224c, bit: 1, label: "By watering a plant" }, // prettier-ignore
                                { offset: 0x224c, bit: 2, label: "By watering a plant" }, // prettier-ignore
                                { offset: 0x224c, bit: 3, label: "By watering a plant" }, // prettier-ignore
                                { offset: 0x224c, bit: 4, label: "By watering a plant" }, // prettier-ignore
                                { offset: 0x224c, bit: 5, label: "By watering a plant" }, // prettier-ignore
                                { offset: 0x224c, bit: 6, label: "By watering a plant" }, // prettier-ignore
                                { offset: 0x224c, bit: 7, label: "By watering a plant" }, // prettier-ignore
                                { offset: 0x224d, bit: 6, label: "By watering a plant" }, // prettier-ignore
                                { offset: 0x224d, bit: 7, label: "By watering a plant" }, // prettier-ignore
                                { offset: 0x2259, bit: 5, label: "By watering a plant" }, // prettier-ignore
                                { offset: 0x2259, bit: 6, label: "By watering a plant" }, // prettier-ignore
                              ],
                            },
                          ],
                        },
                        {
                          name: "Boolossus",
                          type: "section",
                          flex: true,
                          items: [
                            {
                              name: "Health",
                              offset: 0x22a2,
                              type: "variable",
                              dataType: "uint16",
                              bigEndian: true,
                              max: 100,
                              hidden: true,
                            },
                            {
                              name: "Rank",
                              offset: 0x23e7,
                              type: "variable",
                              dataType: "uint8",
                              binary: { bitStart: 6, bitLength: 2 },
                              resource: "portraitFrames",
                            },
                          ],
                        },
                      ],
                    },
                    {
                      name: "3F West Hallway",
                      items: [
                        {
                          type: "section",
                          flex: true,
                          items: [
                            {
                              name: "Events",
                              type: "bitflags",
                              flags: [
                                { offset: 0x216d, bit: 0, label: "Visited" }, // prettier-ignore
                                { offset: 0x216d, bit: 1, label: "Cleared", hidden: true }, // prettier-ignore
                                { offset: 0x2163, bit: 0, label: "Visited", hidden: true }, // prettier-ignore
                                { offset: 0x2163, bit: 1, label: "Cleared", hidden: true }, // prettier-ignore
                              ],
                            },
                          ],
                        },
                      ],
                    },
                    {
                      name: "3F Telephone Room",
                      items: [
                        {
                          type: "section",
                          flex: true,
                          items: [
                            {
                              name: "Events",
                              type: "bitflags",
                              flags: [
                                { offset: 0x2165, bit: 0, label: "Visited" }, // prettier-ignore
                                { offset: 0x2165, bit: 1, label: "Cleared" }, // prettier-ignore
                                { offset: 0x2165, bit: 2, label: "Chest opened", separator: true }, // prettier-ignore
                                { offset: 0x23bf, bit: 2, label: "<b>Boo</b>: Boomerang (seen)" }, // prettier-ignore
                                { offset: 0x23b7, bit: 2, label: "<b>Boo</b>: Boomerang (captured)" }, // prettier-ignore

                                // ? { offset: 0x2066, bit: 2, label: "Door from 3F Telephone Room to 3F Clockwork Room locked", reversed: true, separator: true }, // prettier-ignore
                                // ! { offset: 0x2066, bit: 3, label: "Door from 3F West Hallway to 3F Telephone Room locked (unused)", reversed: true, separator: true }, // prettier-ignore
                                /// ? { offset: 0x2355, bit: 5, label: "1F Graveyard and 3F Telephone Room: Mr. Bones vaccumed once" },
                                // ! { offset: 0x23ca, bit: 4, label: "Key to 3F Telephone Room obtained (unused)" },
                              ],
                            },
                            {
                              name: "Money",
                              type: "bitflags",
                              flags: [
                                { offset: 0x2254, bit: 7, label: "Inside a ceiling light" }, // prettier-ignore
                                { offset: 0x2255, bit: 4, label: "Inside a chest" }, // prettier-ignore
                                { offset: 0x2255, bit: 7, label: "Inside a cubboard" }, // prettier-ignore
                              ],
                            },
                          ],
                        },
                      ],
                    },
                    {
                      name: "3F Clockwork Room",
                      items: [
                        {
                          type: "section",
                          flex: true,
                          items: [
                            {
                              name: "Events",
                              type: "bitflags",
                              flags: [
                                { offset: 0x2171, bit: 0, label: "Visited" }, // prettier-ignore
                                { offset: 0x2171, bit: 1, label: "Cleared", separator: true }, // prettier-ignore
                                { offset: 0x23bf, bit: 5, label: "<b>Boo</b>: Booscaster (seen)" }, // prettier-ignore
                                { offset: 0x23b7, bit: 5, label: "<b>Boo</b>: Booscaster (captured)" }, // prettier-ignore
                                { offset: 0x235b, bit: 1, label: "Blue Clockwork Soldier captured", hidden: true }, // prettier-ignore
                                { offset: 0x235b, bit: 2, label: "Pink Clockwork Soldier captured", hidden: true }, // prettier-ignore
                                { offset: 0x235b, bit: 3, label: "Green Clockwork Soldier captured", hidden: true }, // prettier-ignore

                                // { offset: 0x2066, bit: 2, label: "Door from 3F Telephone Room to 3F Clockwork Room locked", reversed: true, separator: true }, // prettier-ignore
                                // ? { offset: 0x235b, bit: 2, label: "3F Clockwork Room: Pink Clockwork Soldier" },
                                // ? { offset: 0x235b, bit: 3, label: "3F Clockwork Room: Green Clockwork Soldier" },
                                // ? { offset: 0x23ca, bit: 5, label: "BF Cellar: Key to 3F Clockwork Room obtained" },
                              ],
                            },
                            {
                              name: "Money",
                              type: "bitflags",
                              flags: [
                                { offset: 0x224a, bit: 2, label: "Inside a ceiling light" }, // prettier-ignore
                                { offset: 0x224a, bit: 3, label: "Inside a ceiling light" }, // prettier-ignore
                              ],
                            },
                          ],
                        },
                        {
                          name: "Clockwork Soldiers",
                          type: "section",
                          flex: true,
                          items: [
                            {
                              name: "Health",
                              offset: 0x22ac,
                              type: "variable",
                              dataType: "uint16",
                              bigEndian: true,
                              max: 100,
                            },
                            {
                              name: "Rank",
                              offset: 0x23e9,
                              type: "variable",
                              dataType: "uint8",
                              binary: { bitStart: 0, bitLength: 2 },
                              resource: "portraitFrames",
                            },
                          ],
                        },
                      ],
                    },
                    {
                      name: "3F Armory",
                      items: [
                        {
                          type: "section",
                          flex: true,
                          items: [
                            {
                              name: "Events",
                              type: "bitflags",
                              flags: [
                                { offset: 0x2161, bit: 0, label: "Visited" }, // prettier-ignore
                                { offset: 0x2161, bit: 1, label: "Cleared" }, // prettier-ignore
                                { offset: 0x2161, bit: 2, label: "Chest opened", separator: true }, // prettier-ignore
                                { offset: 0x23bf, bit: 1, label: "<b>Boo</b>: UnderBoo (seen)" }, // prettier-ignore
                                { offset: 0x23b7, bit: 1, label: "<b>Boo</b>: UnderBoo (captured)" }, // prettier-ignore
                                { offset: 0x2251, bit: 1, label: "Enabled when open chest with ghost inside", hidden: true }, // prettier-ignore

                                // ? { offset: 0x2066, bit: 4, label: "Door from 3F West Hallway to 3F Armory locked", reversed: true, separator: true }, // prettier-ignore
                                // ! { offset: 0x2066, bit: 5, label: "Door from 3F Armory to 3F Ceramics Studio locked (unused)", reversed: true, separator: true }, // prettier-ignore
                                // ? { offset: 0x23ca, bit: 3, label: "Roof: Key to 3F Armory obtained" },
                                // ? { offset: 0x23cc, bit: 5, label: "3F Armory: Key to BF Pipe Room obtained" },
                              ],
                            },
                            {
                              name: "Money",
                              type: "bitflags",
                              flags: [
                                { offset: 0x2251, bit: 0, label: "Inside a chest" }, // prettier-ignore
                                { offset: 0x2251, bit: 2, label: "Inside a chest" }, // prettier-ignore
                                { offset: 0x2252, bit: 7, label: "Inside a chest" }, // prettier-ignore
                              ],
                            },
                          ],
                        },
                      ],
                    },
                    {
                      name: "3F Ceramics Studio",
                      items: [
                        {
                          type: "section",
                          flex: true,
                          items: [
                            {
                              name: "Events",
                              type: "bitflags",
                              flags: [
                                { offset: 0x216f, bit: 0, label: "Visited" }, // prettier-ignore
                                { offset: 0x216f, bit: 1, label: "Cleared" }, // prettier-ignore
                                { offset: 0x216f, bit: 2, label: "Chest opened", separator: true }, // prettier-ignore
                                { offset: 0x23bf, bit: 4, label: "<b>Boo</b>: TamBoorine (seen)" }, // prettier-ignore
                                { offset: 0x23b7, bit: 4, label: "<b>Boo</b>: TamBoorine (captured)" }, // prettier-ignore
                                { offset: 0x2358, bit: 5, label: "Jarvis captured", hidden: true }, // prettier-ignore

                                // ? { offset: 0x2053, bit: 0, label: "3F Ceramics Studio: Chest appeared" },
                                // { offset: 0x2066, bit: 5, label: "Door from 3F Armory to 3F Ceramics Studio locked (unused)", reversed: true, separator: true }, // prettier-ignore
                                // ! { offset: 0x23ca, bit: 2, label: "Key to 3F Ceramics Studio obtained (unused)" },
                              ],
                            },
                            {
                              name: "Money",
                              type: "bitflags",
                              flags: [
                                { offset: 0x2252, bit: 5, label: "Inside a ceiling light" }, // prettier-ignore
                                { offset: 0x2252, bit: 0, label: "Inside a jar" }, // prettier-ignore
                                { offset: 0x2252, bit: 2, label: "Inside a jar" }, // prettier-ignore
                                { offset: 0x2253, bit: 1, label: "Inside a jar" }, // prettier-ignore
                                { offset: 0x2253, bit: 2, label: "Inside a jar" }, // prettier-ignore
                                { offset: 0x2253, bit: 4, label: "Inside a jar" }, // prettier-ignore
                                { offset: 0x2253, bit: 7, label: "Inside a jar" }, // prettier-ignore
                              ],
                            },
                          ],
                        },
                        {
                          name: "Jarvis",
                          type: "section",
                          flex: true,
                          items: [
                            {
                              name: "Health",
                              offset: 0x22a4,
                              type: "variable",
                              dataType: "uint16",
                              bigEndian: true,
                              max: 100,
                              hidden: true,
                            },
                            {
                              name: "Rank",
                              offset: 0x23e8,
                              type: "variable",
                              dataType: "uint8",
                              binary: { bitStart: 0, bitLength: 2 },
                              resource: "portraitFrames",
                            },
                          ],
                        },
                      ],
                    },
                    {
                      name: "3F The Artist's Studio",
                      items: [
                        {
                          type: "section",
                          flex: true,
                          items: [
                            {
                              name: "Events",
                              type: "bitflags",
                              flags: [
                                { offset: 0x2173, bit: 0, label: "Visited" }, // prettier-ignore
                                { offset: 0x2173, bit: 1, label: "Cleared", separator: true }, // prettier-ignore
                                { offset: 0x23bf, bit: 6, label: "<b>Boo</b>: Bootique (seen)" }, // prettier-ignore
                                { offset: 0x23b7, bit: 6, label: "<b>Boo</b>: Bootique (captured)" }, // prettier-ignore
                                { offset: 0x235a, bit: 5, label: "Vincent Van Gore captured", hidden: true }, // prettier-ignore

                                // ? { offset: 0x2054, bit: 7, label: "3F The Artist's Studio: Key appeared" },
                                // ? { offset: 0x2067, bit: 0, label: "Door from 3F East Hallway to 3F The Artist's Studio locked", reversed: true, separator: true }, // prettier-ignore
                                // ? 0x20a6 | uint8 | [Event] 3F The Artist's Studio: Meet Vincent Van Gore
                                // # { offset: 0x235f, bit: 2, label: "3F The Artist's Studio: Spade Key related" },
                                // ? { offset: 0x23cb, bit: 7, label: "BF Cold Storage: Key to 3F The Artist's Studio obtained" },
                                // ? { offset: 0x23cd, bit: 0, label: "3F The Artist's Studio: Spade Key to BF Secret Altar obtained" },
                              ],
                            },
                          ],
                        },
                        {
                          name: "Vincent Van Gore",
                          type: "section",
                          flex: true,
                          items: [
                            {
                              name: "Health",
                              offset: 0x22a8,
                              type: "variable",
                              dataType: "uint16",
                              bigEndian: true,
                              max: 100,
                            },
                            {
                              name: "Rank",
                              offset: 0x23e8,
                              type: "variable",
                              dataType: "uint8",
                              binary: { bitStart: 4, bitLength: 2 },
                              resource: "portraitFrames",
                            },
                          ],
                        },
                      ],
                    },
                    {
                      name: "BF Bottom of the Well",
                      items: [
                        {
                          type: "section",
                          flex: true,
                          items: [
                            {
                              name: "Events",
                              type: "bitflags",
                              flags: [
                                { offset: 0x218b, bit: 0, label: "Visited" }, // prettier-ignore
                                { offset: 0x218b, bit: 1, label: "Cleared" }, // prettier-ignore

                                // ? { offset: 0x2054, bit: 5, label: "BF Bottom of the Well: Mario prisonned in portrait seen" },
                                // { offset: 0x23c7, bit: 1, label: "BF Bottom of the Well: Key to 1F Courtyard (East) obtained" },
                              ],
                            },
                          ],
                        },
                      ],
                    },
                    {
                      name: "BF Breaker Room",
                      items: [
                        {
                          type: "section",
                          flex: true,
                          items: [
                            {
                              name: "Events",
                              type: "bitflags",
                              flags: [
                                { offset: 0x2187, bit: 0, label: "Visited" }, // prettier-ignore
                                { offset: 0x2187, bit: 1, label: "Cleared" }, // prettier-ignore
                                { offset: 0x2187, bit: 2, label: "Chest opened", separator: true }, // prettier-ignore
                                { offset: 0x23c0, bit: 2, label: "<b>Boo</b>: Boo B. Hatch (seen)" }, // prettier-ignore
                                { offset: 0x23b8, bit: 2, label: "<b>Boo</b>: Boo B. Hatch (captured)" }, // prettier-ignore

                                // # { offset: 0x2055, bit: 1, label: "BF Breaker Room: Related to breaker turned on" },
                                // ? { offset: 0x2068, bit: 0, label: "Door from BF East Wing to BF Breaker Room locked", reversed: true, separator: true }, // prettier-ignore
                                // ? 0x20ad | uint8 | [Event] BF Breaker Room: Breaked turned on
                                // ? { offset: 0x23cc, bit: 4, label: "BF Breaker Room: Key to BF Cellar obtained" },
                                // { offset: 0x23cc, bit: 7, label: "2F Wardrobe Room: Key to BF Breaker Room obtained" },
                              ],
                            },
                            {
                              name: "Money",
                              type: "bitflags",
                              flags: [
                                { offset: 0x2205, bit: 4, label: "Inside a ceiling light", separator: true }, // prettier-ignore
                                { offset: 0x2373, bit: 2, label: "Speedy Spirit captured / escaped" }, // prettier-ignore
                              ],
                            },
                          ],
                        },
                      ],
                    },
                    {
                      name: "BF Cellar",
                      items: [
                        {
                          type: "section",
                          flex: true,
                          items: [
                            {
                              name: "Events",
                              type: "bitflags",
                              flags: [
                                { offset: 0x217f, bit: 0, label: "Visited" }, // prettier-ignore
                                { offset: 0x217f, bit: 1, label: "Cleared" }, // prettier-ignore
                                { offset: 0x217f, bit: 2, label: "Chest opened", separator: true }, // prettier-ignore
                                { offset: 0x23c0, bit: 0, label: "<b>Boo</b>: Booripedes (seen)" }, // prettier-ignore
                                { offset: 0x23b8, bit: 0, label: "<b>Boo</b>: Booripedes (captured)" }, // prettier-ignore

                                // ? { offset: 0x2068, bit: 3, label: "Door from BF East Hallway to BF Cellar locked", reversed: true, separator: true }, // prettier-ignore
                                // ! { offset: 0x2068, bit: 4, label: "Door from BF Hallway to BF Cellar locked (unused)", reversed: true, separator: true }, // prettier-ignore
                                // { offset: 0x23ca, bit: 5, label: "BF Cellar: Key to 3F Clockwork Room obtained" },
                                // ! { offset: 0x23cc, bit: 3, label: "Key to BF Cellar obtained (unused)" },
                                // { offset: 0x23cc, bit: 4, label: "BF Breaker Room: Key to BF Cellar obtained" },
                              ],
                            },
                            {
                              name: "Money",
                              type: "bitflags",
                              flags: [
                                { offset: 0x2201, bit: 0, label: "On a shelf" }, // prettier-ignore
                                { offset: 0x2201, bit: 1, label: "On a shelf" }, // prettier-ignore
                                { offset: 0x2201, bit: 2, label: "On a shelf" }, // prettier-ignore
                                { offset: 0x2202, bit: 4, label: "On a shelf" }, // prettier-ignore
                                { offset: 0x2202, bit: 5, label: "On a shelf" }, // prettier-ignore
                                { offset: 0x2202, bit: 7, label: "On a shelf", separator: true }, // prettier-ignore
                                { offset: 0x2373, bit: 1, label: "Speedy Spirit captured / escaped" }, // prettier-ignore
                              ],
                            },
                          ],
                        },
                      ],
                    },
                    {
                      name: "BF Hallway",
                      items: [
                        {
                          type: "section",
                          flex: true,
                          items: [
                            {
                              name: "Events",
                              type: "bitflags",
                              flags: [
                                { offset: 0x217d, bit: 0, label: "Visited" }, // prettier-ignore
                                { offset: 0x217d, bit: 1, label: "Cleared", hidden: true }, // prettier-ignore
                                { offset: 0x218f, bit: 0, label: "Visited", hidden: true }, // prettier-ignore
                                { offset: 0x218f, bit: 1, label: "Cleared", hidden: true }, // prettier-ignore

                                // ! { offset: 0x2068, bit: 1, label: "Door from BF Hallway to BF North Wing locked (unused)", reversed: true, separator: true }, // prettier-ignore
                                // ? { offset: 0x2068, bit: 2, label: "Door from BF Hallway to BF Pipe Room locked", reversed: true, separator: true }, // prettier-ignore
                                // { offset: 0x2068, bit: 4, label: "Door from BF Hallway to BF Cellar locked (unused)", reversed: true, separator: true }, // prettier-ignore
                                // ? { offset: 0x2068, bit: 6, label: "Door from BF Hallway to BF Cold Storage locked", reversed: true, separator: true }, // prettier-ignore
                              ],
                            },
                          ],
                        },
                      ],
                    },
                    {
                      name: "BF Pipe Room",
                      items: [
                        {
                          type: "section",
                          flex: true,
                          items: [
                            {
                              name: "Events",
                              type: "bitflags",
                              flags: [
                                { offset: 0x2185, bit: 0, label: "Visited" }, // prettier-ignore
                                { offset: 0x2185, bit: 1, label: "Cleared" }, // prettier-ignore
                                { offset: 0x2185, bit: 2, label: "Chest opened", separator: true }, // prettier-ignore
                                { offset: 0x23c0, bit: 1, label: "<b>Boo</b>: Booffant (seen)" }, // prettier-ignore
                                { offset: 0x23b8, bit: 1, label: "<b>Boo</b>: Booffant (captured)" }, // prettier-ignore

                                // ? { offset: 0x2055, bit: 7, label: "BF Pipe Room: Waterfall stopped" },
                                // ? { offset: 0x2056, bit: 0, label: "BF Pipe Room: Toxic waste freezed" },
                                // { offset: 0x2068, bit: 2, label: "Door from BF Hallway to BF Pipe Room locked", reversed: true, separator: true }, // prettier-ignore
                                // ? 0x20d4 | uint8 | BF Pipe Room: Waterfall stopped triggered
                                // ? { offset: 0x23cc, bit: 1, label: "BF Pipe Room: Key to BF Cold Storage obtained" },
                                // { offset: 0x23cc, bit: 5, label: "3F Armory: Key to BF Pipe Room obtained" },
                              ],
                            },
                            {
                              name: "Money",
                              type: "bitflags",
                              flags: [
                                { offset: 0x2202, bit: 1, label: "Inside a bucket" }, // prettier-ignore
                              ],
                            },
                          ],
                        },
                      ],
                    },
                    {
                      name: "BF Cold Storage",
                      items: [
                        {
                          type: "section",
                          flex: true,
                          items: [
                            {
                              name: "Events",
                              type: "bitflags",
                              flags: [
                                { offset: 0x217b, bit: 0, label: "Visited" }, // prettier-ignore
                                { offset: 0x217b, bit: 1, label: "Cleared" }, // prettier-ignore
                                { offset: 0x217b, bit: 2, label: "Chest opened", separator: true }, // prettier-ignore
                                { offset: 0x23bf, bit: 7, label: "<b>Boo</b>: Boolderdash (seen)" }, // prettier-ignore
                                { offset: 0x23b7, bit: 7, label: "<b>Boo</b>: Boolderdash (captured)" }, // prettier-ignore
                                { offset: 0x236f, bit: 1, label: "Sir Weston captured", hidden: true }, // prettier-ignore

                                // { offset: 0x2068, bit: 6, label: "Door from BF Hallway to BF Cold Storage locked", reversed: true, separator: true }, // prettier-ignore
                                // ? 0x20d9 | uint8 | [Event] BF Cold Room: Meet Sir Weston
                                // { offset: 0x23cb, bit: 7, label: "BF Cold Storage: Key to 3F The Artist's Studio obtained" },
                                // { offset: 0x23cc, bit: 1, label: "BF Pipe Room: Key to BF Cold Storage obtained" },
                              ],
                            },
                          ],
                        },
                        {
                          name: "Sir Weston",
                          type: "section",
                          flex: true,
                          items: [
                            {
                              name: "Health",
                              offset: 0x22ae,
                              type: "variable",
                              dataType: "uint16",
                              bigEndian: true,
                              max: 100,
                            },
                            {
                              name: "Rank",
                              offset: 0x23e9,
                              type: "variable",
                              dataType: "uint8",
                              binary: { bitStart: 2, bitLength: 2 },
                              resource: "portraitFrames",
                            },
                          ],
                        },
                      ],
                    },
                    {
                      name: "BF North Hallway",
                      items: [
                        {
                          type: "section",
                          flex: true,
                          items: [
                            {
                              name: "Events",
                              type: "bitflags",
                              flags: [
                                { offset: 0x2189, bit: 0, label: "Visited" }, // prettier-ignore
                                { offset: 0x2189, bit: 1, label: "Cleared", hidden: true }, // prettier-ignore
                                { offset: 0x2376, bit: 1, label: "Spade door to BF Secret Altar unsealed" }, // prettier-ignore

                                // ? { offset: 0x2058, bit: 4, label: "BF North Wing and 3F Hallway: Message for not having required Boos" },
                                // { offset: 0x2068, bit: 1, label: "Door from BF Hallway to BF North Wing locked (unused)", reversed: true, separator: true }, // prettier-ignore
                                // ? { offset: 0x2069, bit: 7, label: "Door from BF North Hallway to BF Secret Altar locked", reversed: true, separator: true }, // prettier-ignore
                                // ! { offset: 0x23cc, bit: 6, label: "Key to BF North Wing obtained (unused)" },
                              ],
                            },
                          ],
                        },
                      ],
                    },
                    {
                      name: "BF Secret Altar",
                      items: [
                        {
                          type: "section",
                          flex: true,
                          items: [
                            {
                              name: "Events",
                              type: "bitflags",
                              flags: [
                                { offset: 0x218d, bit: 0, label: "Visited" }, // prettier-ignore
                                { offset: 0x218d, bit: 1, label: "Cleared" }, // prettier-ignore

                                // { offset: 0x2069, bit: 7, label: "Door from BF North Hallway to BF Secret Altar locked", reversed: true, separator: true }, // prettier-ignore
                                // ? 0x20ca | uint8 | [Event] BF Secret Altar: King Boo introduction seen
                                // # 0x20d8 | uint8 | [Event] Area 4 Completed or BF Secret Altar: Mario's portrait taken
                                // { offset: 0x23cd, bit: 0, label: "3F The Artist's Studio: Spade Key to BF Secret Altar obtained" },
                              ],
                            },
                            {
                              name: "Money",
                              type: "bitflags",
                              flags: [
                                { offset: 0x2203, bit: 2, label: "Inside a torch" }, // prettier-ignore
                                { offset: 0x2203, bit: 3, label: "Inside a torch" }, // prettier-ignore
                                { offset: 0x2204, bit: 1, label: "Inside a chandelier" }, // prettier-ignore
                              ],
                            },
                          ],
                        },
                      ],
                    },
                    {
                      name: "Roof",
                      items: [
                        {
                          type: "section",
                          flex: true,
                          items: [
                            {
                              name: "Events",
                              type: "bitflags",
                              flags: [
                                { offset: 0x2179, bit: 0, label: "Visited" }, // prettier-ignore
                                { offset: 0x2179, bit: 1, label: "Cleared" }, // prettier-ignore
                                { offset: 0x2179, bit: 2, label: "Chest opened" }, // prettier-ignore
                                { offset: 0x236f, bit: 5, label: "King Boo captured", hidden: true }, // prettier-ignore

                                // ? 0x20cb | uint8 | [Event] Roof: Bowser introduction seen
                                // { offset: 0x23ca, bit: 3, label: "Roof: Key to 3F Armory obtained" },
                              ],
                            },
                          ],
                        },
                        {
                          name: "King Boo",
                          type: "section",
                          flex: true,
                          items: [
                            {
                              name: "Health",
                              offset: 0x22b0,
                              type: "variable",
                              dataType: "uint16",
                              bigEndian: true,
                              max: 100,
                              hidden: true,
                            },
                            {
                              name: "Rank",
                              offset: 0x23e9,
                              type: "variable",
                              dataType: "uint8",
                              binary: { bitStart: 4, bitLength: 2 },
                              resource: "portraitFrames",
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
              name: "Gallery",
              items: [
                {
                  type: "section",
                  flex: true,
                  items: [
                    {
                      name: "Mansion Value",
                      offset: 0x23f8,
                      type: "variable",
                      dataType: "uint32",
                      bigEndian: true,
                      max: 999999999,
                    },
                  ],
                },
                {
                  type: "section",
                  flex: true,
                  items: [
                    {
                      name: "01 Neville",
                      offset: 0x23ec,
                      type: "variable",
                      dataType: "uint8",
                      binary: { bitStart: 0, bitLength: 2 },
                      resource: "portraitFrames",
                    },
                    {
                      name: "02 Lydia",
                      offset: 0x23ec,
                      type: "variable",
                      dataType: "uint8",
                      binary: { bitStart: 2, bitLength: 2 },
                      resource: "portraitFrames",
                    },
                    {
                      name: "03 Nana",
                      offset: 0x23ef,
                      type: "variable",
                      dataType: "uint8",
                      binary: { bitStart: 2, bitLength: 2 },
                      resource: "portraitFrames",
                    },
                    {
                      name: "04 Chauncey",
                      offset: 0x23ec,
                      type: "variable",
                      dataType: "uint8",
                      binary: { bitStart: 4, bitLength: 2 },
                      resource: "portraitFrames",
                    },
                    {
                      name: "05 Melody Pianissima",
                      offset: 0x23ed,
                      type: "variable",
                      dataType: "uint8",
                      binary: { bitStart: 4, bitLength: 2 },
                      resource: "portraitFrames",
                    },
                    {
                      name: "06 Miss Petunia",
                      offset: 0x23ef,
                      type: "variable",
                      dataType: "uint8",
                      binary: { bitStart: 0, bitLength: 2 },
                      resource: "portraitFrames",
                    },
                    {
                      name: "07 Madame Clairvoya",
                      offset: 0x23ed,
                      type: "variable",
                      dataType: "uint8",
                      binary: { bitStart: 0, bitLength: 2 },
                      resource: "portraitFrames",
                    },
                    {
                      name: "08 Shivers",
                      offset: 0x23ed,
                      type: "variable",
                      dataType: "uint8",
                      binary: { bitStart: 2, bitLength: 2 },
                      resource: "portraitFrames",
                    },
                    {
                      name: "09 Sue Pea",
                      offset: 0x23f0,
                      type: "variable",
                      dataType: "uint8",
                      binary: { bitStart: 2, bitLength: 2 },
                      resource: "portraitFrames",
                    },
                    {
                      name: "10 The Floating Whirlindas",
                      offset: 0x23ec,
                      type: "variable",
                      dataType: "uint8",
                      binary: { bitStart: 6, bitLength: 2 },
                      resource: "portraitFrames",
                    },
                    {
                      name: "11 Mr. Luggs",
                      offset: 0x23ed,
                      type: "variable",
                      dataType: "uint8",
                      binary: { bitStart: 6, bitLength: 2 },
                      resource: "portraitFrames",
                    },
                    {
                      name: "12 Jarvis",
                      offset: 0x23f0,
                      type: "variable",
                      dataType: "uint8",
                      binary: { bitStart: 0, bitLength: 2 },
                      resource: "portraitFrames",
                    },
                    {
                      name: "13 Spooky",
                      offset: 0x23ee,
                      type: "variable",
                      dataType: "uint8",
                      binary: { bitStart: 0, bitLength: 2 },
                      resource: "portraitFrames",
                    },
                    {
                      name: "14 Henry and Orville",
                      offset: 0x23ef,
                      type: "variable",
                      dataType: "uint8",
                      binary: { bitStart: 4, bitLength: 2 },
                      resource: "portraitFrames",
                    },
                    {
                      name: "15 Clockwork Soldiers",
                      offset: 0x23f1,
                      type: "variable",
                      dataType: "uint8",
                      binary: { bitStart: 0, bitLength: 2 },
                      resource: "portraitFrames",
                    },
                    {
                      name: "16 Biff Atlas",
                      offset: 0x23ee,
                      type: "variable",
                      dataType: "uint8",
                      binary: { bitStart: 4, bitLength: 2 },
                      resource: "portraitFrames",
                    },
                    {
                      name: "17 Slim Bankshot",
                      offset: 0x23ee,
                      type: "variable",
                      dataType: "uint8",
                      binary: { bitStart: 6, bitLength: 2 },
                      resource: "portraitFrames",
                    },
                    {
                      name: "18 Sir Weston",
                      offset: 0x23f1,
                      type: "variable",
                      dataType: "uint8",
                      binary: { bitStart: 2, bitLength: 2 },
                      resource: "portraitFrames",
                    },
                    {
                      name: "19 Bogmire",
                      offset: 0x23ee,
                      type: "variable",
                      dataType: "uint8",
                      binary: { bitStart: 2, bitLength: 2 },
                      resource: "portraitFrames",
                    },
                    {
                      name: "20 Uncle Grimmly",
                      offset: 0x23f0,
                      type: "variable",
                      dataType: "uint8",
                      binary: { bitStart: 6, bitLength: 2 },
                      resource: "portraitFrames",
                    },
                    {
                      name: "21 Vincent Van Gore",
                      offset: 0x23f0,
                      type: "variable",
                      dataType: "uint8",
                      binary: { bitStart: 4, bitLength: 2 },
                      resource: "portraitFrames",
                    },
                    {
                      name: "22 Boolossus",
                      offset: 0x23ef,
                      type: "variable",
                      dataType: "uint8",
                      binary: { bitStart: 6, bitLength: 2 },
                      resource: "portraitFrames",
                    },
                    {
                      name: "23 King Boo",
                      offset: 0x23f1,
                      type: "variable",
                      dataType: "uint8",
                      binary: { bitStart: 4, bitLength: 2 },
                      resource: "portraitFrames",
                    },
                  ],
                },
              ],
            },
            {
              name: "Events",
              hidden: true,
              items: [
                {
                  type: "bitflags",
                  flags: [
                    { offset: 0x2355, bit: 3, label: "Ghold Ghost captured once" }, // prettier-ignore
                    { offset: 0x2355, bit: 4, label: "Temper Terror captured once" }, // prettier-ignore
                    { offset: 0x2355, bit: 5, label: "1F Graveyard and 3F Telephone Room: Mr. Bones captured once" }, // prettier-ignore
                    { offset: 0x2356, bit: 0, label: "Purple Puncher captured once" }, // prettier-ignore
                    { offset: 0x2356, bit: 1, label: "Flash captured once" }, // prettier-ignore
                    { offset: 0x2356, bit: 2, label: "Blue Twirler captured once" }, // prettier-ignore
                    { offset: 0x2356, bit: 3, label: "Blue Blaze captured once" }, // prettier-ignore
                    { offset: 0x2356, bit: 4, label: "Red Grabbing Ghost captured once" }, // prettier-ignore
                    { offset: 0x2356, bit: 5, label: "Turquoise Grabbing Ghost captured once" }, // prettier-ignore
                    { offset: 0x2356, bit: 6, label: "Purple Grabbing Ghost captured once" }, // prettier-ignore
                    { offset: 0x2356, bit: 7, label: "White Grabbing Ghost captured once" }, // prettier-ignore
                    { offset: 0x2357, bit: 0, label: "Bowling Ghost captured once" }, // prettier-ignore
                    { offset: 0x2357, bit: 1, label: "2F Astral Hall: Red Ghost Guy captured once" }, // prettier-ignore
                    { offset: 0x2357, bit: 2, label: "2F Astral Hall: Green Ghost Guy captured once" }, // prettier-ignore
                    { offset: 0x2357, bit: 3, label: "1F Ball Room: White Ghost Guy captured once" }, // prettier-ignore
                    { offset: 0x2357, bit: 4, label: "1F Ball Room: Orange Ghost Guy captured once" }, // prettier-ignore
                    { offset: 0x2357, bit: 5, label: "1F Ball Room: Orange Ghost Guy captured once" }, // prettier-ignore
                    { offset: 0x2357, bit: 6, label: "1F Ball Room: Yellow Ghost Guy captured once" }, // prettier-ignore
                    { offset: 0x2357, bit: 7, label: "1F Ball Room: Pink Ghost Guy captured once" }, // prettier-ignore
                    { offset: 0x2358, bit: 0, label: "1F Ball Room: Purple Ghost Guy captured once" }, // prettier-ignore
                    { offset: 0x2358, bit: 1, label: "Purple Bomber captured once" }, // prettier-ignore
                    { offset: 0x2358, bit: 2, label: "Ceiling Surprise captured once" }, // prettier-ignore
                    { offset: 0x235b, bit: 0, label: "Waiter captured once" }, // prettier-ignore
                    { offset: 0x235c, bit: 6, label: "Blue Flying Fish captured once" }, // prettier-ignore
                    { offset: 0x235c, bit: 7, label: "Green Flying Fish captured once" }, // prettier-ignore
                    { offset: 0x235d, bit: 4, label: "Tutorial Room: Yellow Ghost captured once" }, // prettier-ignore
                    { offset: 0x2361, bit: 0, label: "Blue Ghost Mouse captured once" }, // prettier-ignore
                    { offset: 0x2361, bit: 2, label: "Purple Ghost Mouse captured once" }, // prettier-ignore
                    { offset: 0x2362, bit: 0, label: "Purple Ghost Bat captured once" }, // prettier-ignore
                    { offset: 0x2362, bit: 1, label: "Yellow Ghost Bat captured once" }, // prettier-ignore
                    { offset: 0x2362, bit: 2, label: "Fire Element captured once" }, // prettier-ignore
                    { offset: 0x2362, bit: 3, label: "Ice Element captured once" }, // prettier-ignore
                    { offset: 0x2362, bit: 4, label: "Water Element captured once" }, // prettier-ignore
                    { offset: 0x2364, bit: 1, label: "Teddy Bear captured once" }, // prettier-ignore
                    { offset: 0x2365, bit: 4, label: "Plate captured once" }, // prettier-ignore
                    { offset: 0x2366, bit: 3, label: "Pan captured once" }, // prettier-ignore
                    { offset: 0x2366, bit: 4, label: "Pot captured once" }, // prettier-ignore
                    { offset: 0x2366, bit: 6, label: "Book captured once" }, // prettier-ignore
                    { offset: 0x2366, bit: 7, label: "Doll captured once" }, // prettier-ignore
                    { offset: 0x2367, bit: 3, label: "Toy car captured once" }, // prettier-ignore
                    { offset: 0x2367, bit: 4, label: "Toy plane captured once" }, // prettier-ignore
                    { offset: 0x2368, bit: 3, label: "2F Astral Hall: Ghost Guy's Mask captured once" }, // prettier-ignore
                    { offset: 0x2368, bit: 4, label: "1F Ball Room: Ghost Guy's Mask captured once" }, // prettier-ignore
                    { offset: 0x2369, bit: 0, label: "Banana captured once" }, // prettier-ignore
                    { offset: 0x2369, bit: 7, label: "1F Boneyard: Mr. Bones captured once" }, // prettier-ignore
                    { offset: 0x236c, bit: 1, label: "Poison Mushroom obtained once" }, // prettier-ignore
                    { offset: 0x236c, bit: 2, label: "Small Pearl obtained once" }, // prettier-ignore
                    { offset: 0x236c, bit: 3, label: "Medium Pearl obtained once" }, // prettier-ignore
                    { offset: 0x236c, bit: 4, label: "Big Pearl obtained once" }, // prettier-ignore
                    { offset: 0x236c, bit: 5, label: "Blue Jewel obtained once" }, // prettier-ignore
                    { offset: 0x236c, bit: 6, label: "Green Jewel obtained once" }, // prettier-ignore
                    { offset: 0x236c, bit: 7, label: "Red Jewel obtained once" }, // prettier-ignore
                    { offset: 0x236d, bit: 0, label: "Silver Diamond obtained once" }, // prettier-ignore
                    { offset: 0x236d, bit: 2, label: "Gold Diamond obtained once" }, // prettier-ignore
                    { offset: 0x236d, bit: 3, label: "Gold Bar obtained once" }, // prettier-ignore
                    { offset: 0x236d, bit: 4, label: "King Boo Crown obtained once" }, // prettier-ignore
                    { offset: 0x236d, bit: 5, label: "Heart from a ghost obtained once" }, // prettier-ignore
                    { offset: 0x236d, bit: 6, label: "Heart from a contaienr obtained once" }, // prettier-ignore
                    { offset: 0x236e, bit: 6, label: "Boolossus single boo captured once" }, // prettier-ignore
                    { offset: 0x236f, bit: 6, label: "Boo captured once" }, // prettier-ignore
                    { offset: 0x2370, bit: 1, label: "Fake door burned once" }, // prettier-ignore
                  ],
                },
              ],
            },
          ],
        },
      ],
    },
  ],
  resources: {
    portraitFrames: {
      0x0: "-",
      0x1: "Bronze",
      0x2: "Silver",
      0x3: "Gold",
    },
  },
};

export default template;
