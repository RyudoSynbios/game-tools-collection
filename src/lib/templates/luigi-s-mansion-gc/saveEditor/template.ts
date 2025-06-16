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
      disableSubinstanceIf: {
        offset: 0x204d,
        type: "variable",
        dataType: "bit",
        bit: 0,
        operator: "=",
        value: 0x0,
      },
      appendSubinstance: [
        {
          name: "Options",
          flex: true,
          items: [
            {
              name: "Sound",
              offset: 0x2b5c,
              type: "variable",
              dataType: "uint8",
              resource: "sounds",
            },
            {
              name: "Rumble",
              offset: 0x2b5d,
              type: "variable",
              dataType: "uint8",
              resource: "optionBoolean",
            },
            {
              name: "Controls",
              offset: 0x2b5e,
              type: "variable",
              dataType: "uint8",
              resource: "controls",
            },
            {
              id: "language",
              name: "Language",
              offset: 0x2b5f,
              type: "variable",
              dataType: "uint8",
              resource: "languages",
            },
          ],
        },
      ],
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
                            {
                              name: "Blackout",
                              offset: 0x2055,
                              type: "variable",
                              dataType: "bit",
                              bit: 5,
                              resource: "optionBoolean",
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
                              test: true,
                            },
                          ],
                        },
                        {
                          type: "section",
                          flex: true,
                          items: [
                            {
                              id: "equipment",
                              name: "Equipment",
                              type: "bitflags",
                              flags: [
                                { offset: 0x23ea, bit: 0, label: "Flashlight" },
                                { offset: 0x23ea, bit: 1, label: "Poltergust 3000" },
                                { offset: 0x2057, bit: 3, label: "Boo Radar" },
                                { offset: 0x2057, bit: 1, label: "Trigger talk with prof in Lab about Boos (enable Boos)", hidden: true },
                                { offset: 0x2052, bit: 3, label: "Related to Boo Radar obtention", hidden: true },
                              ],
                            },
                            {
                              name: "Mario's Items",
                              type: "bitflags",
                              flags: [
                                { offset: 0x236b, bit: 4, label: "Mario's Hat" },
                                { offset: 0x236b, bit: 5, label: "Mario's Star" },
                                { offset: 0x236b, bit: 6, label: "Mario's Glove" },
                                { offset: 0x236b, bit: 7, label: "Mario's Shoe" },
                                { offset: 0x236c, bit: 0, label: "Mario's Letter" },
                              ],
                            },
                            {
                              name: "Medals",
                              type: "bitflags",
                              flags: [
                                { offset: 0x2362, bit: 5, label: "Fire Element Medal" },
                                { offset: 0x2362, bit: 6, label: "Ice Element Medal" },
                                { offset: 0x2362, bit: 7, label: "Water Element Medal" },
                              ],
                            },
                          ],
                        },
                        {
                          name: "Events",
                          type: "bitflags",
                          hidden: true,
                          flags: [
                            { offset: 0x204f, bit: 0, label: "Mode: Hidden Mansion" },
                            { offset: 0x20b0, bit: 0, label: "Introduction seen" },
                            { offset: 0x204e, bit: 1, label: "Introduction cleared" },
                            { offset: 0x2052, bit: 7, label: "Trigger Act 1 cleared" },
                            { offset: 0x208b, bit: 0, label: "Area 1 cleared message" },
                            { offset: 0x238c, bit: 0, label: "Area 1 cleared" },
                            { offset: 0x2056, bit: 4, label: "Trigger Act 2 cleared" },
                            { offset: 0x20aa, bit: 0, label: "Area 2 cleared triggered" },
                            { offset: 0x239e, bit: 5, label: "Area 2 cleared" },
                            { offset: 0x2058, bit: 2, label: "Trigger Act 3 cleared" },
                            { offset: 0x20d0, bit: 0, label: "Area 3 cleared triggered" },
                            { offset: 0x239f, bit: 4, label: "Area 3 cleared" },
                            { offset: 0x2056, bit: 2, label: "Trigger Act 4 cleared" },
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
                              id: "portraitGhost-911-6",
                              name: "Neville",
                              offset: 0x23e4,
                              type: "variable",
                              dataType: "uint8",
                              binary: { bitStart: 0, bitLength: 2 },
                              resource: "portraitFrames",
                            },
                            {
                              id: "portraitGhost-139-7",
                              name: "Lydia",
                              offset: 0x23e4,
                              type: "variable",
                              dataType: "uint8",
                              binary: { bitStart: 2, bitLength: 2 },
                              resource: "portraitFrames",
                            },
                            {
                              id: "portraitGhost-913-6",
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
                              id: "portraitGhost-140-4",
                              name: "Mr. Luggs",
                              offset: 0x23e5,
                              type: "variable",
                              dataType: "uint8",
                              binary: { bitStart: 6, bitLength: 2 },
                              resource: "portraitFrames",
                            },
                            {
                              id: "portraitGhost-118-2",
                              name: "The Floating Whirlindas",
                              offset: 0x23e4,
                              type: "variable",
                              dataType: "uint8",
                              binary: { bitStart: 6, bitLength: 2 },
                              resource: "portraitFrames",
                            },
                            {
                              id: "portraitGhost-141-6",
                              name: "Melody Pianissima",
                              offset: 0x23e5,
                              type: "variable",
                              dataType: "uint8",
                              binary: { bitStart: 4, bitLength: 2 },
                              resource: "portraitFrames",
                            },
                            {
                              id: "portraitGhost-144-6",
                              name: "Shivers",
                              offset: 0x23e5,
                              type: "variable",
                              dataType: "uint8",
                              binary: { bitStart: 2, bitLength: 2 },
                              resource: "portraitFrames",
                            },
                            {
                              id: "portraitGhost-131-0",
                              name: "Spooky",
                              offset: 0x23e6,
                              type: "variable",
                              dataType: "uint8",
                              binary: { bitStart: 0, bitLength: 2 },
                              resource: "portraitFrames",
                            },
                            {
                              id: "portraitGhost-912-3",
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
                              id: "portraitGhost-122-2",
                              name: "Madame Clairvoya",
                              offset: 0x23e5,
                              type: "variable",
                              dataType: "uint8",
                              binary: { bitStart: 0, bitLength: 2 },
                              resource: "portraitFrames",
                            },
                            {
                              id: "portraitGhost-140-6",
                              name: "Biff Atlas",
                              offset: 0x23e6,
                              type: "variable",
                              dataType: "uint8",
                              binary: { bitStart: 4, bitLength: 2 },
                              resource: "portraitFrames",
                            },
                            {
                              id: "portraitGhost-141-0",
                              name: "Nana",
                              offset: 0x23e7,
                              type: "variable",
                              dataType: "uint8",
                              binary: { bitStart: 2, bitLength: 2 },
                              resource: "portraitFrames",
                            },
                            {
                              id: "portraitGhost-142-5",
                              name: "Miss Petunia",
                              offset: 0x23e7,
                              type: "variable",
                              dataType: "uint8",
                              binary: { bitStart: 0, bitLength: 2 },
                              resource: "portraitFrames",
                            },
                            {
                              id: "portraitGhost-140-7",
                              name: "Slim Bankshot",
                              offset: 0x23e6,
                              type: "variable",
                              dataType: "uint8",
                              binary: { bitStart: 6, bitLength: 2 },
                              resource: "portraitFrames",
                            },
                            {
                              id: "portraitGhost-141-1",
                              name: "Henry and Orville",
                              offset: 0x23e7,
                              type: "variable",
                              dataType: "uint8",
                              binary: { bitStart: 4, bitLength: 2 },
                              resource: "portraitFrames",
                            },
                            {
                              id: "portraitGhost-911-1",
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
                              id: "portraitGhost-125-3",
                              name: "Uncle Grimmly",
                              offset: 0x23e8,
                              type: "variable",
                              dataType: "uint8",
                              binary: { bitStart: 6, bitLength: 2 },
                              resource: "portraitFrames",
                            },
                            {
                              id: "portraitGhost-917-0",
                              name: "Jarvis",
                              offset: 0x23e8,
                              type: "variable",
                              dataType: "uint8",
                              binary: { bitStart: 0, bitLength: 2 },
                              resource: "portraitFrames",
                            },
                            {
                              id: "portraitGhost-142-5",
                              name: "Vincent Van Gore",
                              offset: 0x23e8,
                              type: "variable",
                              dataType: "uint8",
                              binary: { bitStart: 4, bitLength: 2 },
                              resource: "portraitFrames",
                            },
                            {
                              id: "portraitGhost-127-5",
                              name: "Sue Pea",
                              offset: 0x23e8,
                              type: "variable",
                              dataType: "uint8",
                              binary: { bitStart: 2, bitLength: 2 },
                              resource: "portraitFrames",
                            },
                            {
                              id: "portraitGhost-142-1",
                              name: "Clockwork Soldiers",
                              offset: 0x23e9,
                              type: "variable",
                              dataType: "uint8",
                              binary: { bitStart: 0, bitLength: 2 },
                              resource: "portraitFrames",
                            },
                            {
                              id: "portraitGhost-122-1",
                              name: "Sir Weston",
                              offset: 0x23e9,
                              type: "variable",
                              dataType: "uint8",
                              binary: { bitStart: 2, bitLength: 2 },
                              resource: "portraitFrames",
                            },
                            {
                              id: "portraitGhost-122-5",
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
                            { offset: 0x23bd, bit: 3, label: "Boomeo" },
                            { offset: 0x23bd, bit: 4, label: "Booregard" },
                            { offset: 0x23bd, bit: 0, label: "Boohoo" },
                            { offset: 0x23bd, bit: 1, label: "ShamBoo" },
                            { offset: 0x23bd, bit: 2, label: "GameBoo" },
                            { offset: 0x23bc, bit: 5, label: "Booligan" },
                            { offset: 0x23bc, bit: 6, label: "Boodacious" },
                            { offset: 0x23bc, bit: 7, label: "Boo La La" },
                            { offset: 0x23bc, bit: 4, label: "Boogie" },
                            { offset: 0x23bc, bit: 0, label: "PeakaBoo" },
                            { offset: 0x23bc, bit: 1, label: "GumBoo" },
                            { offset: 0x23bc, bit: 2, label: "Booigi" },
                            { offset: 0x23bc, bit: 3, label: "Kung Boo", separator: true },
                            { offset: 0x23be, bit: 7, label: "LimBooger" },
                            { offset: 0x23bf, bit: 0, label: "Mr. Boojangles" },
                            { offset: 0x23be, bit: 4, label: "GameBoo Advance" },
                            { offset: 0x23be, bit: 5, label: "Bootha" },
                            { offset: 0x23be, bit: 6, label: "Boonswoggle" },
                            { offset: 0x23be, bit: 1, label: "Boolicious" },
                            { offset: 0x23be, bit: 2, label: "TaBoo" },
                            { offset: 0x23be, bit: 3, label: "BamBoo" },
                            { offset: 0x23bd, bit: 5, label: "Turboo" },
                            { offset: 0x23bd, bit: 6, label: "Booris" },
                            { offset: 0x23bd, bit: 7, label: "Boolivia" },
                            { offset: 0x23be, bit: 0, label: "Boonita", separator: true },
                            { offset: 0x23bf, bit: 4, label: "TamBoorine" },
                            { offset: 0x23bf, bit: 5, label: "Booscaster" },
                            { offset: 0x23bf, bit: 6, label: "Bootique" },
                            { offset: 0x23bf, bit: 1, label: "UnderBoo" },
                            { offset: 0x23bf, bit: 2, label: "Boomerang" },
                            { offset: 0x23bf, bit: 3, label: "Little Boo Peep" },
                            { offset: 0x23b0, bit: 0, label: "Boolossus", disabled: true, separator: true },
                            { offset: 0x23c0, bit: 1, label: "Booffant" },
                            { offset: 0x23c0, bit: 2, label: "Boo B. Hatch" },
                            { offset: 0x23bf, bit: 7, label: "Boolderdash" },
                            { offset: 0x23c0, bit: 0, label: "Booripedes" },
                          ],
                        },
                        {
                          id: "boos",
                          name: "Captured",
                          type: "bitflags",
                          flags: [
                            { offset: 0x23b5, bit: 3, label: "Boomeo" },
                            { offset: 0x23b5, bit: 4, label: "Booregard" },
                            { offset: 0x23b5, bit: 0, label: "Boohoo" },
                            { offset: 0x23b5, bit: 1, label: "ShamBoo" },
                            { offset: 0x23b5, bit: 2, label: "GameBoo" },
                            { offset: 0x23b4, bit: 5, label: "Booligan" },
                            { offset: 0x23b4, bit: 6, label: "Boodacious" },
                            { offset: 0x23b4, bit: 7, label: "Boo La La" },
                            { offset: 0x23b4, bit: 4, label: "Boogie" },
                            { offset: 0x23b4, bit: 0, label: "PeakaBoo" },
                            { offset: 0x23b4, bit: 1, label: "GumBoo" },
                            { offset: 0x23b4, bit: 2, label: "Booigi" },
                            { offset: 0x23b4, bit: 3, label: "Kung Boo", separator: true },
                            { offset: 0x23b6, bit: 7, label: "LimBooger" },
                            { offset: 0x23b7, bit: 0, label: "Mr. Boojangles" },
                            { offset: 0x23b6, bit: 4, label: "GameBoo Advance" },
                            { offset: 0x23b6, bit: 5, label: "Bootha" },
                            { offset: 0x23b6, bit: 6, label: "Boonswoggle" },
                            { offset: 0x23b6, bit: 1, label: "Boolicious" },
                            { offset: 0x23b6, bit: 2, label: "TaBoo" },
                            { offset: 0x23b6, bit: 3, label: "BamBoo" },
                            { offset: 0x23b5, bit: 5, label: "Turboo" },
                            { offset: 0x23b5, bit: 6, label: "Booris" },
                            { offset: 0x23b5, bit: 7, label: "Boolivia" },
                            { offset: 0x23b6, bit: 0, label: "Boonita", separator: true },
                            { offset: 0x23b7, bit: 4, label: "TamBoorine" },
                            { offset: 0x23b7, bit: 5, label: "Booscaster" },
                            { offset: 0x23b7, bit: 6, label: "Bootique" },
                            { offset: 0x23b7, bit: 1, label: "UnderBoo" },
                            { offset: 0x23b7, bit: 2, label: "Boomerang" },
                            { offset: 0x23b7, bit: 3, label: "Little Boo Peep" },
                            { offset: 0x23b8, bit: 3, label: "Boolossus", separator: true },
                            { offset: 0x23b8, bit: 4, label: "Boolossus", hidden: true },
                            { offset: 0x23b8, bit: 5, label: "Boolossus", hidden: true },
                            { offset: 0x23b8, bit: 6, label: "Boolossus", hidden: true },
                            { offset: 0x23b8, bit: 7, label: "Boolossus", hidden: true },
                            { offset: 0x23b9, bit: 0, label: "Boolossus", hidden: true },
                            { offset: 0x23b9, bit: 1, label: "Boolossus", hidden: true },
                            { offset: 0x23b9, bit: 2, label: "Boolossus", hidden: true },
                            { offset: 0x23b9, bit: 3, label: "Boolossus", hidden: true },
                            { offset: 0x23b9, bit: 4, label: "Boolossus", hidden: true },
                            { offset: 0x23b9, bit: 5, label: "Boolossus", hidden: true },
                            { offset: 0x23b9, bit: 6, label: "Boolossus", hidden: true },
                            { offset: 0x23b9, bit: 7, label: "Boolossus", hidden: true },
                            { offset: 0x23ba, bit: 0, label: "Boolossus", hidden: true },
                            { offset: 0x23ba, bit: 1, label: "Boolossus", hidden: true },
                            { offset: 0x23b8, bit: 1, label: "Booffant" },
                            { offset: 0x23b8, bit: 2, label: "Boo B. Hatch" },
                            { offset: 0x23b7, bit: 7, label: "Boolderdash" },
                            { offset: 0x23b8, bit: 0, label: "Booripedes" },
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
                            { offset: 0x2105, bit: 0, label: "Visited" },
                            { offset: 0x2056, bit: 7, label: "Toad reassured" },
                            { offset: 0x2105, bit: 1, label: "Cleared" },
                            { offset: 0x23c8, bit: 2, label: "Key to 2F Parlor obtained", separator: true },
                            { offset: 0x204e, bit: 4, label: "Key related", hidden: true },
                            { offset: 0x235e, bit: 6, label: "Key related", hidden: true },
                            { offset: 0x2375, bit: 6, label: "Heart door to 1F Hallway unsealed" },
                            { offset: 0x2060, bit: 4, label: "Heart door to 1F Hallway unlocked", reversed: true },
                            { offset: 0x2087, bit: 0, label: "Ghost drop Key to 2F Parlor on the ground", hidden: true },
                          ],
                        },
                        {
                          name: "Money",
                          type: "bitflags",
                          flags: [
                            { offset: 0x220c, bit: 2, label: "Inside a chandelier" },
                            { offset: 0x2221, bit: 0, label: "Inside a ceiling light" },
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
                              id: "1fHallway",
                              name: "Events",
                              type: "bitflags",
                              flags: [
                                { offset: 0x210f, bit: 0, label: "Visited" },
                                { offset: 0x2125, bit: 0, label: "Visited", hidden: true },
                                { offset: 0x216b, bit: 0, label: "Visited", hidden: true },
                                { offset: 0x210d, bit: 0, label: "Visited", hidden: true },
                                { offset: 0x210f, bit: 1, label: "Cleared", separator: true },
                                { offset: 0x2125, bit: 1, label: "Cleared", hidden: true },
                                { offset: 0x216b, bit: 1, label: "Cleared", hidden: true },
                                { offset: 0x210d, bit: 1, label: "Cleared", hidden: true },
                                { offset: 0x2060, bit: 4, label: "Heart door to 1F Foyer unlocked", reversed: true },
                                { offset: 0x2375, bit: 7, label: "Club door to 1F Courtyard unsealed" },
                                { offset: 0x2065, bit: 5, label: "Club door to 1F Courtyard unlocked", reversed: true },
                                { offset: 0x2061, bit: 0, label: "Door to 1F Ball Room unlocked", reversed: true },
                                { offset: 0x2062, bit: 3, label: "Door to 1F Washroom unlocked", reversed: true },
                                { offset: 0x2060, bit: 3, label: "Door to 1F Fortune-teller's Room unlocked", reversed: true },
                                { offset: 0x2060, bit: 0, label: "Door to 1F Laundry Room unlocked", reversed: true },
                                { offset: 0x2062, bit: 2, label: "Door to 1F Conservatory unlocked", reversed: true },
                                { offset: 0x2061, bit: 1, label: "Door to 1F Dining Room unlocked", reversed: true },
                                { offset: 0x2062, bit: 6, label: "Door to 1F Billiards Room unlocked", reversed: true },
                                { offset: 0x2069, bit: 5, label: "Door to 1F Stairs to 2F unlocked", reversed: true },
                                { offset: 0x2062, bit: 0, label: "Door to 1F Bathroom unlocked (unused)", reversed: true, hidden: true },
                                { offset: 0x2061, bit: 6, label: "Door to BF Stairs to 1F unlocked (unused)", reversed: true, hidden: true },
                                { offset: 0x20d1, bit: 0, label: "Shivers dialog when his candles are lighted", hidden: true },
                              ],
                            },
                            {
                              name: "Money",
                              type: "bitflags",
                              flags: [
                                { offset: 0x220b, bit: 0, label: "Inside a vase" },
                                { offset: 0x220b, bit: 2, label: "Inside a vase" },
                                { offset: 0x220c, bit: 1, label: "Inside a vase" },
                                { offset: 0x2223, bit: 3, label: "Inside a vase", separator: true },
                                { offset: 0x2374, bit: 7, label: "Gold Mouse captured" },
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
                                { offset: 0x2115, bit: 0, label: "Visited" },
                                { offset: 0x2115, bit: 1, label: "Cleared" },
                                { offset: 0x2115, bit: 2, label: "Chest opened" },
                                { offset: 0x23c6, bit: 0, label: "Key to 1F Storage Room obtained", separator: true },
                                { offset: 0x2061, bit: 0, label: "Door to 1F Hallway unlocked", reversed: true },
                                { offset: 0x2062, bit: 7, label: "Door to 1F Storage Room unlocked", reversed: true, separator: true },
                                { offset: 0x23b4, bit: 7, label: "<b>Boo</b>: Boo La La" },
                                { offset: 0x236e, bit: 2, label: "The Floating Whirlindas captured", hidden: true },
                                { offset: 0x2057, bit: 4, label: "1F Ball Room: ???", hidden: true },
                              ],
                            },
                            {
                              name: "Money",
                              type: "bitflags",
                              flags: [
                                { offset: 0x2215, bit: 0, label: "Inside a chandelier" },
                                { offset: 0x2215, bit: 1, label: "Inside a chandelier" },
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
                              id: "portraitGhost-118-2",
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
                                { offset: 0x211d, bit: 0, label: "Visited" },
                                { offset: 0x211d, bit: 1, label: "Cleared" },
                                { offset: 0x2053, bit: 1, label: "Button moving wall pressed" },
                                { offset: 0x2057, bit: 0, label: "Button releasing Boos pressed", separator: true },
                                { offset: 0x20c5, bit: 0, label: "Trap opened and Boos escaped animation seen", hidden: true },
                                { offset: 0x2062, bit: 7, label: "Door to 1F Ball Room unlocked", reversed: true, separator: true },
                                { offset: 0x23b5, bit: 2, label: "<b>Boo</b>: GameBoo" },
                                { offset: 0x20a3, bit: 0, label: "Camera animation after pushing button", hidden: true },
                                { offset: 0x2337, bit: 0, label: "Related to trap opened and Boos escaped", hidden: true },
                              ],
                            },
                            {
                              name: "Money",
                              type: "bitflags",
                              flags: [
                                { offset: 0x2214, bit: 1, label: "Inside a bucket", separator: true },
                                { offset: 0x2371, bit: 7, label: "Speedy Spirit captured / escaped" },
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
                                { offset: 0x2129, bit: 0, label: "Visited" },
                                { offset: 0x2129, bit: 1, label: "Cleared" },
                                { offset: 0x23c5, bit: 7, label: "Key to 1F Ball Room obtained" },
                                { offset: 0x23c6, bit: 7, label: "Key to 1F Bathroom obtained (unused)", hidden: true },
                                { offset: 0x2062, bit: 0, label: "Door to 1F Hallway unlocked (unused)", reversed: true, hidden: true },
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
                                { offset: 0x2123, bit: 0, label: "Visited" },
                                { offset: 0x2050, bit: 0, label: "Toad reassured" },
                                { offset: 0x2123, bit: 1, label: "Cleared" },
                                { offset: 0x23c4, bit: 4, label: "Key to 1F Fortune-teller's Room obtained", separator: true },
                                { offset: 0x23c6, bit: 4, label: "Key to 1F Washroom obtained (unused)", hidden: true },
                                { offset: 0x2062, bit: 3, label: "Door to 1F Hallway unlocked", reversed: true },
                              ],
                            },
                            {
                              name: "Money",
                              type: "bitflags",
                              flags: [
                                { offset: 0x220b, bit: 4, label: "Inside a ceiling light" },
                                { offset: 0x221d, bit: 6, label: "Inside a cupboard" },
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
                                { offset: 0x2107, bit: 0, label: "Visited" },
                                { offset: 0x2107, bit: 1, label: "Cleared" },
                                { offset: 0x2107, bit: 2, label: "Chest opened" },
                                { offset: 0x23c4, bit: 7, label: "Key to 1F Laundry Room obtained" },
                                { offset: 0x23cb, bit: 0, label: "Key to 3F Safari Room obtained", separator: true },
                                { offset: 0x2060, bit: 2, label: "Door to 1F Mirror Room unlocked (unused)", reversed: true, hidden: true },
                                { offset: 0x2060, bit: 3, label: "Door to 1F Hallway unlocked", reversed: true, separator: true },
                                { offset: 0x23b4, bit: 2, label: "<b>Boo</b>: Booigi" },
                                { offset: 0x236b, bit: 2, label: "Madame Clairvoya captured", hidden: true },
                              ],
                            },
                            {
                              name: "Money",
                              type: "bitflags",
                              flags: [
                                { offset: 0x2218, bit: 2, label: "Inside a drawer" },
                                { offset: 0x221a, bit: 5, label: "Inside a drawer", separator: true },
                                { offset: 0x2374, bit: 3, label: "Gold Mouse captured" },
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
                              id: "portraitGhost-122-2",
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
                                { offset: 0x2109, bit: 0, label: "Visited" },
                                { offset: 0x2109, bit: 1, label: "Cleared" },
                                { offset: 0x2109, bit: 2, label: "Chest opened" },
                                { offset: 0x2362, bit: 5, label: "Fire Element Medal obtained", separator: true },
                                { offset: 0x2053, bit: 3, label: "Trigger Fire Element Medal obtained message", hidden: true },
                                { offset: 0x20b6, bit: 0, label: "Fire Element Medal obtained message seen", hidden: true },
                                { offset: 0x23c4, bit: 5, label: "Key to 1F Mirror Room obtained (unused)", hidden: true },
                                { offset: 0x2060, bit: 2, label: "Door to 1F Fortune-teller's Room unlocked (unused)", reversed: true, hidden: true },
                                { offset: 0x23b4, bit: 3, label: "<b>Boo</b>: Kung Boo" },
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
                                { offset: 0x210b, bit: 0, label: "Visited" },
                                { offset: 0x210b, bit: 1, label: "Cleared" },
                                { offset: 0x236b, bit: 4, label: "Mario's Hat obtained" },
                                { offset: 0x2052, bit: 1, label: "Trigger Mario's Hat obtained message", hidden: true },
                                { offset: 0x2095, bit: 0, label: "Mario's Hat obtained message triggered", hidden: true },
                                { offset: 0x210b, bit: 2, label: "Chest opened", separator: true },
                                { offset: 0x2060, bit: 0, label: "Door to 1F Hallway unlocked", reversed: true, separator: true },
                                { offset: 0x2060, bit: 6, label: "Door to 1F Butler's Room unlocked (unused)", reversed: true, hidden: true },
                                { offset: 0x23b4, bit: 4, label: "<b>Boo</b>: Boogie" },
                              ],
                            },
                            {
                              name: "Money",
                              type: "bitflags",
                              flags: [
                                { offset: 0x2217, bit: 2, label: "Inside a cupboard" },
                                { offset: 0x2218, bit: 3, label: "Inside a ceiling light" },
                                { offset: 0x2218, bit: 5, label: "Inside a bucket" },
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
                                { offset: 0x2101, bit: 0, label: "Visited" },
                                { offset: 0x2101, bit: 1, label: "Cleared" },
                                { offset: 0x2101, bit: 2, label: "Chest opened" },
                                { offset: 0x23c6, bit: 5, label: "Key to 1F Conservatory obtained", separator: true },
                                { offset: 0x23c4, bit: 1, label: "Key to Butler's Room obtained (unused)", hidden: true },
                                { offset: 0x2060, bit: 6, label: "Door to 1F Laundry Room unlocked (unused)", reversed: true, hidden: true },
                                { offset: 0x23b4, bit: 0, label: "<b>Boo</b>: PeakaBoo" },
                                { offset: 0x2355, bit: 6, label: "Shivers captured", hidden: true },
                              ],
                            },
                            {
                              name: "Money",
                              type: "bitflags",
                              flags: [
                                { offset: 0x221b, bit: 5, label: "Inside a cupboard" },
                                { offset: 0x221c, bit: 2, label: "Inside a ceiling light" },
                                { offset: 0x221c, bit: 3, label: "Inside a bucket" },
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
                              id: "portraitGhost-144-6",
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
                                { offset: 0x2103, bit: 0, label: "Visited" },
                                { offset: 0x2103, bit: 1, label: "Cleared" },
                                { offset: 0x2103, bit: 2, label: "Chest opened", separator: true },
                                { offset: 0x23b4, bit: 1, label: "<b>Boo</b>: GumBoo" },
                              ],
                            },

                            {
                              name: "Money",
                              type: "bitflags",
                              flags: [
                                { offset: 0x221d, bit: 1, label: "Inside a cup" },
                                { offset: 0x221d, bit: 2, label: "Inside a cup" },
                                { offset: 0x221e, bit: 0, label: "Inside a chest" },
                                { offset: 0x221e, bit: 2, label: "Inside a chest" },
                                { offset: 0x221e, bit: 6, label: "Inside a chandelier", separator: true },
                                { offset: 0x2373, bit: 3, label: "Speedy Spirit captured / escaped" },
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
                                { offset: 0x212b, bit: 0, label: "Visited" },
                                { offset: 0x212b, bit: 1, label: "Cleared" },
                                { offset: 0x212b, bit: 2, label: "Chest opened" },
                                { offset: 0x23c5, bit: 6, label: "Key to 1F Dining Room obtained", separator: true },
                                { offset: 0x2062, bit: 2, label: "Door to 1F Hallway unlocked", reversed: true, separator: true },
                                { offset: 0x23b5, bit: 3, label: "<b>Boo</b>: Boomeo" },
                                { offset: 0x2358, bit: 6, label: "Melody Pianissima captured", hidden: true },
                              ],
                            },
                            {
                              name: "Money",
                              type: "bitflags",
                              flags: [
                                { offset: 0x2211, bit: 6, label: "Inside a ceiling light" },
                                { offset: 0x2218, bit: 1, label: "Inside a cupboard", separator: true },
                                { offset: 0x2373, bit: 4, label: "Speedy Spirit captured / escaped" },
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
                              id: "portraitGhost-141-6",
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
                                { offset: 0x2113, bit: 0, label: "Visited" },
                                { offset: 0x2113, bit: 1, label: "Cleared" },
                                { offset: 0x2113, bit: 2, label: "Chest opened", separator: true },
                                { offset: 0x2061, bit: 1, label: "Door to 1F Hallway unlocked", reversed: true, separator: true },
                                { offset: 0x2061, bit: 4, label: "Door to 1F Kitchen unlocked (unused)", reversed: true, hidden: true },
                                { offset: 0x23b4, bit: 6, label: "<b>Boo</b>: Boodacious" },
                                { offset: 0x2359, bit: 4, label: "Mr. Luggs captured", hidden: true },
                              ],
                            },
                            {
                              name: "Money",
                              type: "bitflags",
                              flags: [
                                { offset: 0x2223, bit: 7, label: "Inside a cupboard", separator: true },
                                { offset: 0x2361, bit: 7, label: "Gold Mouse captured" },
                                { offset: 0x2372, bit: 1, label: "Speedy Spirit captured / escaped" },
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
                              id: "portraitGhost-140-4",
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
                                { offset: 0x2111, bit: 0, label: "Visited" },
                                { offset: 0x2111, bit: 1, label: "Cleared" },
                                { offset: 0x2111, bit: 2, label: "Chest opened" },
                                { offset: 0x2362, bit: 7, label: "Water Element Medal obtained", separator: true },
                                { offset: 0x2053, bit: 4, label: "Trigger Water Element Medal obtained message", hidden: true },
                                { offset: 0x20c6, bit: 0, label: "Water Element Medal obtained message seen", hidden: true },
                                { offset: 0x23c5, bit: 3, label: "Key to 1F Kitchen obtained (unused)", hidden: true },
                                { offset: 0x2375, bit: 0, label: "Burning door to 1F Boneyard extinguished", separator: true },
                                { offset: 0x2061, bit: 4, label: "Door to 1F Dining Room unlocked (unused)", reversed: true, hidden: true },
                                { offset: 0x2061, bit: 5, label: "Door to 1F Boneyard unlocked (unused)", reversed: true, hidden: true },
                                { offset: 0x23b4, bit: 5, label: "<b>Boo</b>: Booligan" },
                              ],
                            },

                            {
                              name: "Money",
                              type: "bitflags",
                              flags: [
                                { offset: 0x2209, bit: 0, label: "Inside a cupboard" },
                                { offset: 0x220a, bit: 2, label: "Inside a ceiling light" },
                                { offset: 0x220a, bit: 7, label: "Inside a oven", separator: true },
                                { offset: 0x2361, bit: 4, label: "Gold Mouse captured" },
                                { offset: 0x2372, bit: 5, label: "Speedy Spirit captured / escaped" },
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
                                { offset: 0x2117, bit: 0, label: "Visited" },
                                { offset: 0x2117, bit: 1, label: "Cleared", separator: true },
                                { offset: 0x2057, bit: 6, label: "Plant watered on Area 2" },
                                { offset: 0x2057, bit: 7, label: "Plant watered on Area 3" },
                                { offset: 0x2054, bit: 0, label: "Plant watered on Area 4" },
                                { offset: 0x2117, bit: 2, label: "Plant opened" },
                                { offset: 0x23c5, bit: 2, label: "Key to 1F Boneyard obtained (unused)", hidden: true },
                                { offset: 0x2061, bit: 5, label: "Door to 1F Kitchen unlocked (unused)", reversed: true, hidden: true },
                                { offset: 0x2363, bit: 0, label: "Spooky captured", hidden: true },
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
                              id: "portraitGhost-131-0",
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
                                { offset: 0x2121, bit: 0, label: "Visited" },
                                { offset: 0x2191, bit: 0, label: "Visited", hidden: true },
                                { offset: 0x2057, bit: 2, label: "Tombstone is glowing" },
                                { offset: 0x2055, bit: 3, label: "Camera animation related", hidden: true },
                                { offset: 0x2121, bit: 1, label: "Cleared" },
                                { offset: 0x2191, bit: 1, label: "Cleared", hidden: true },
                                { offset: 0x2121, bit: 2, label: "Chest opened" },
                                { offset: 0x23c9, bit: 2, label: "Club Key to 1F Courtyard obtained" },
                                { offset: 0x235f, bit: 0, label: "Club Key related", hidden: true },
                                { offset: 0x20c2, bit: 0, label: "Boss introduction", hidden: true },
                                { offset: 0x236e, bit: 5, label: "Bogmire captured", hidden: true },
                                { offset: 0x2056, bit: 3, label: "Chest appeared", hidden: true },
                              ],
                            },
                            {
                              name: "Money",
                              type: "bitflags",
                              flags: [
                                { offset: 0x2217, bit: 4, label: "Inside a gutter" },
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
                              id: "portraitGhost-912-3",
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
                                { offset: 0x212f, bit: 0, label: "Visited" },
                                { offset: 0x2193, bit: 0, label: "Visited", hidden: true },
                                { offset: 0x2054, bit: 6, label: "Toad reassured" },
                                { offset: 0x212f, bit: 1, label: "Cleared" },
                                { offset: 0x2193, bit: 1, label: "Cleared", hidden: true },
                                { offset: 0x236c, bit: 0, label: "Mario's Letter obtained" },
                                { offset: 0x2051, bit: 3, label: "Trigger Mario's Letter obtained message", hidden: true },
                                { offset: 0x2093, bit: 0, label: "Mario's Letter obtained message triggered", hidden: true },
                                { offset: 0x212f, bit: 2, label: "Chest opened" },
                                { offset: 0x2065, bit: 5, label: "Club door to 1F Hallway unlocked", reversed: true },
                                { offset: 0x2063, bit: 6, label: "Door to 1F Rec Room unlocked", reversed: true, hidden: true },
                              ],
                            },
                            {
                              name: "Money",
                              type: "bitflags",
                              flags: [
                                { offset: 0x2211, bit: 0, label: "By watering a plant" },
                                { offset: 0x2211, bit: 1, label: "By watering a plant" },
                                { offset: 0x2212, bit: 7, label: "By watering a plant" },
                                { offset: 0x2222, bit: 5, label: "Inside a statue" },
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
                                { offset: 0x212d, bit: 0, label: "Visited" },
                                { offset: 0x212d, bit: 1, label: "Cleared" },
                                { offset: 0x212d, bit: 2, label: "Chest opened" },
                                { offset: 0x23cd, bit: 2, label: "Key to 1F Stairs to 2F obtained", separator: true },
                                { offset: 0x23c7, bit: 0, label: "Key to 1F Rec Room obtained (unused)", hidden: true },
                                { offset: 0x2063, bit: 6, label: "Door to 1F Courtyard (East) unlocked", reversed: true, hidden: true },
                                { offset: 0x2063, bit: 7, label: "Door to 1F Stairs to 2F unlocked (unused)", reversed: true, hidden: true },
                                { offset: 0x23b5, bit: 4, label: "<b>Boo</b>: Booregard" },
                                { offset: 0x235a, bit: 6, label: "Biff Atlas captured", hidden: true },
                              ],
                            },
                            {
                              name: "Money",
                              type: "bitflags",
                              flags: [
                                { offset: 0x220d, bit: 0, label: "Inside a ceiling light" },
                                { offset: 0x2218, bit: 0, label: "Inside a chest", separator: true },
                                { offset: 0x2372, bit: 7, label: "Speedy Spirit captured / escaped" },
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
                              id: "portraitGhost-140-6",
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
                                { offset: 0x2119, bit: 0, label: "Visited" },
                                { offset: 0x2119, bit: 1, label: "Cleared" },
                                { offset: 0x2119, bit: 2, label: "Chest opened", separator: true },
                                { offset: 0x2062, bit: 6, label: "Door to 1F Hallway unlocked", reversed: true, separator: true },
                                { offset: 0x2062, bit: 5, label: "Door to 1F Projection Room unlocked (unused)", reversed: true, hidden: true },
                                { offset: 0x23b5, bit: 0, label: "<b>Boo</b>: Boohoo" },
                                { offset: 0x235a, bit: 7, label: "Slim Bankshot captured", hidden: true },
                              ],
                            },
                            {
                              name: "Money",
                              type: "bitflags",
                              flags: [
                                { offset: 0x2213, bit: 2, label: "Inside a ceiling fan" },
                                { offset: 0x2224, bit: 4, label: "Inside a drawer" },
                                { offset: 0x2224, bit: 5, label: "Inside a drawer", separator: true },
                                { offset: 0x2372, bit: 0, label: "Speedy Spirit captured / escaped" },
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
                              id: "portraitGhost-140-7",
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
                                { offset: 0x211b, bit: 0, label: "Visited" },
                                { offset: 0x211b, bit: 1, label: "Cleared" },
                                { offset: 0x236b, bit: 6, label: "Mario's Glove obtained" },
                                { offset: 0x2050, bit: 5, label: "Trigger Mario's Glove obtained message", hidden: true },
                                { offset: 0x20a9, bit: 0, label: "Mario's Glove obtained message triggered", hidden: true },
                                { offset: 0x211b, bit: 2, label: "Chest opened", separator: true },
                                { offset: 0x23c6, bit: 2, label: "Key to 1F Projection Room obtained (unused)", hidden: true },
                                { offset: 0x2062, bit: 5, label: "Door to 1F Billiards Room unlocked (unused)", reversed: true, hidden: true },
                                { offset: 0x23b5, bit: 1, label: "<b>Boo</b>: ShamBoo" },
                              ],
                            },
                            {
                              name: "Money",
                              type: "bitflags",
                              flags: [
                                { offset: 0x2219, bit: 1, label: "Inside a cupboard" },
                                { offset: 0x2219, bit: 6, label: "Inside a ceiling light" },
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
                                { offset: 0x2127, bit: 0, label: "Visited" },
                                { offset: 0x2127, bit: 1, label: "Cleared" },
                                { offset: 0x2069, bit: 5, label: "Door to 1F Hallway unlocked", reversed: true },
                                { offset: 0x2063, bit: 7, label: "Door to Rec Room unlocked (unused)", reversed: true, hidden: true },
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
                                { offset: 0x213f, bit: 0, label: "Visited" },
                                { offset: 0x213f, bit: 1, label: "Cleared", separator: true },
                                { offset: 0x23cd, bit: 3, label: "Key to 2F Stairs to 1F obtained (unused)", hidden: true },
                                { offset: 0x2375, bit: 1, label: "Burning door to 2F Tea Room extinguished" },
                                { offset: 0x2069, bit: 4, label: "Door to 2F Stairs to 1F unlocked (unused)", reversed: true, hidden: true },
                              ],
                            },
                            {
                              name: "Money",
                              type: "bitflags",
                              flags: [
                                { offset: 0x2226, bit: 0, label: "Inside a ceiling light" },
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
                                { offset: 0x213d, bit: 0, label: "Visited" },
                                { offset: 0x213d, bit: 1, label: "Cleared", separator: true },
                                { offset: 0x2064, bit: 5, label: "Door to 2F Parlor unlocked", reversed: true },
                                { offset: 0x2064, bit: 6, label: "Door to 2F West Hallway unlocked", reversed: true },
                                { offset: 0x204e, bit: 3, label: "Try to open closed door", hidden: true },
                                { offset: 0x208f, bit: 0, label: "Warning about gallery ghosts message", hidden: true },
                              ],
                            },
                            {
                              name: "Money",
                              type: "bitflags",
                              flags: [
                                { offset: 0x213d, bit: 3, label: "On the ground" },
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
                                { offset: 0x2147, bit: 0, label: "Visited" },
                                { offset: 0x2147, bit: 1, label: "Cleared" },
                                { offset: 0x2147, bit: 2, label: "Chest opened" },
                                { offset: 0x23c8, bit: 6, label: "Key to 2F Anteroom obtained", separator: true },
                                { offset: 0x2064, bit: 5, label: "Door to 2F Foyer unlocked", reversed: true },
                                { offset: 0x2064, bit: 1, label: "Door to 2F Anteroom unlocked", reversed: true, separator: true },
                                { offset: 0x23b6, bit: 3, label: "<b>Boo</b>: BamBoo" },
                                { offset: 0x204e, bit: 7, label: "???", hidden: true },
                                { offset: 0x2081, bit: 0, label: "Introduction", hidden: true },
                                { offset: 0x20bd, bit: 0, label: "Portraits talked", hidden: true },
                              ],
                            },
                            {
                              name: "Money",
                              type: "bitflags",
                              flags: [
                                { offset: 0x2147, bit: 3, label: "On the ground" },
                                { offset: 0x222a, bit: 5, label: "Inside a cupboard" },
                                { offset: 0x223d, bit: 0, label: "Inside a bookshelf" },
                                { offset: 0x223d, bit: 5, label: "Inside a drawer" },
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
                                { offset: 0x214f, bit: 0, label: "Visited" },
                                { offset: 0x214f, bit: 1, label: "Cleared", separator: true },
                                { offset: 0x2064, bit: 1, label: "Door to 2F Parlor unlocked", reversed: true, separator: true },
                                { offset: 0x2065, bit: 4, label: "Door to 2F Wardrobe Room unlocked (unused)", reversed: true, hidden: true },
                                { offset: 0x23b6, bit: 5, label: "<b>Boo</b>: Bootha" },
                              ],
                            },
                            {
                              name: "Money",
                              type: "bitflags",
                              flags: [
                                { offset: 0x223a, bit: 3, label: "Inside a ceiling fan" },
                                { offset: 0x223c, bit: 1, label: "Inside a chandelier" },
                                { offset: 0x2240, bit: 4, label: "Inside a drawer" },
                                { offset: 0x2240, bit: 5, label: "Inside a drawer" },
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
                                { offset: 0x214d, bit: 0, label: "Visited" },
                                { offset: 0x214d, bit: 1, label: "Cleared" },
                                { offset: 0x214d, bit: 2, label: "Chest opened" },
                                { offset: 0x23c8, bit: 1, label: "Key to 2F West Hallway obtained" },
                                { offset: 0x23cc, bit: 7, label: "Key to BF Breaker Room obtained", separator: true },
                                { offset: 0x23c9, bit: 3, label: "Key to 2F Wardrobe Room obtained (unused)", hidden: true },
                                { offset: 0x2065, bit: 4, label: "Door to 2F Anteroom unlocked (unused)", reversed: true, hidden: true },
                                { offset: 0x2065, bit: 6, label: "Door to 2F Balcony unlocked (unused)", reversed: true, hidden: true },
                                { offset: 0x23b6, bit: 4, label: "<b>Boo</b>: GameBoo Advance" },
                                { offset: 0x236b, bit: 3, label: "Uncle Grimmly captured", hidden: true },
                              ],
                            },
                            {
                              name: "Money",
                              type: "bitflags",
                              flags: [
                                { offset: 0x223b, bit: 0, label: "Inside a wardrobe", separator: true },
                                { offset: 0x2373, bit: 0, label: "Speedy Spirit captured / escaped" },
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
                              id: "portraitGhost-125-3",
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
                                { offset: 0x214b, bit: 0, label: "Visited" },
                                { offset: 0x2053, bit: 2, label: "Toad reassured" },
                                { offset: 0x214b, bit: 1, label: "Cleared" },
                                { offset: 0x23c9, bit: 1, label: "Key to 2F Balcony obtained (unused)", hidden: true },
                                { offset: 0x2065, bit: 6, label: "Door to 2F Wardrobe Room unlocked (unused)", reversed: true, hidden: true },
                              ],
                            },
                            {
                              name: "Money",
                              type: "bitflags",
                              flags: [
                                { offset: 0x223b, bit: 2, label: "By watering a plant" },
                                { offset: 0x223b, bit: 3, label: "By watering a plant" },
                                { offset: 0x223b, bit: 4, label: "By watering a plant" },
                                { offset: 0x223b, bit: 5, label: "By watering a plant" },
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
                                { offset: 0x213b, bit: 0, label: "Visited" },
                                { offset: 0x213b, bit: 1, label: "Cleared", separator: true },
                                { offset: 0x2064, bit: 6, label: "Door to 2F Foyer unlocked", reversed: true },
                                { offset: 0x2063, bit: 0, label: "Door to 2F Master Bedroom unlocked", reversed: true },
                                { offset: 0x2063, bit: 4, label: "Door to 2F Nursery unlocked", reversed: true },
                                { offset: 0x2063, bit: 3, label: "Door to 2F The Twins' Room unlocked", reversed: true, separator: true },
                                { offset: 0x2064, bit: 7, label: "Door to 2F Study unlocked (unused)", reversed: true, hidden: true },
                                { offset: 0x209f, bit: 0, label: "Camera animation to 2F Nursery door seen", hidden: true },
                                { offset: 0x20b3, bit: 0, label: "???", hidden: true },
                              ],
                            },
                            {
                              name: "Money",
                              type: "bitflags",
                              flags: [
                                { offset: 0x213b, bit: 3, label: "On the ground" },
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
                                { offset: 0x2145, bit: 0, label: "Visited" },
                                { offset: 0x2145, bit: 1, label: "Cleared" },
                                { offset: 0x2145, bit: 2, label: "Chest opened" },
                                { offset: 0x23c7, bit: 7, label: "Key to 2F Master Bedroom obtained", separator: true },
                                { offset: 0x23c8, bit: 0, label: "Key to 2F Study obtained (unused)", hidden: true },
                                { offset: 0x2064, bit: 7, label: "Door to 2F West Hallway unlocked (unused)", reversed: true, hidden: true },
                                { offset: 0x23b6, bit: 2, label: "<b>Boo</b>: TaBoo" },
                                { offset: 0x2359, bit: 6, label: "Neville captured", hidden: true },
                                { offset: 0x2055, bit: 6, label: "Neville captured (trigger appearance of Lydia)", hidden: true },
                              ],
                            },
                            {
                              name: "Money",
                              type: "bitflags",
                              flags: [
                                { offset: 0x222c, bit: 6, label: "Inside a ceiling light" },
                                { offset: 0x223f, bit: 6, label: "Inside a book" },
                                { offset: 0x223f, bit: 7, label: "Inside a book", separator: true },
                                { offset: 0x2374, bit: 4, label: "Gold Mouse captured" },
                                { offset: 0x2372, bit: 2, label: "Speedy Spirit captured / escaped" },
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
                              id: "portraitGhost-911-6",
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
                              id: "2fMasterBedroom",
                              name: "Events",
                              type: "bitflags",
                              flags: [
                                { offset: 0x2143, bit: 0, label: "Visited" },
                                { offset: 0x2143, bit: 1, label: "Cleared" },
                                { offset: 0x2143, bit: 2, label: "Chest opened" },
                                { offset: 0x23c7, bit: 3, label: "Key to 2F Nursery obtained", separator: true },
                                { offset: 0x2058, bit: 0, label: "Related to 2F Nursery Key obtained (trigger Chancey appeared)", hidden: true },
                                { offset: 0x2063, bit: 0, label: "Door to 2F West Hallway unlocked", reversed: true, separator: true },
                                { offset: 0x23b6, bit: 1, label: "<b>Boo</b>: Boolicious" },
                                { offset: 0x208e, bit: 0, label: "Lydia talk when curtain is open", hidden: true },
                                { offset: 0x2359, bit: 7, label: "Lydia captured", hidden: true },
                              ],
                            },
                            {
                              name: "Money",
                              type: "bitflags",
                              flags: [
                                { offset: 0x222e, bit: 1, label: "Inside a ceiling fan" },
                                { offset: 0x223d, bit: 2, label: "Inside a drawer" },
                                { offset: 0x223d, bit: 3, label: "Inside a drawer" },
                                { offset: 0x2243, bit: 0, label: "By watering a plant" },
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
                              id: "portraitGhost-139-7",
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
                                { offset: 0x2131, bit: 0, label: "Visited" },
                                { offset: 0x2131, bit: 1, label: "Cleared" },
                                { offset: 0x2131, bit: 2, label: "Chest opened" },
                                { offset: 0x23c4, bit: 3, label: "Heart Key to 1F Hallway obtained", separator: true },
                                { offset: 0x235e, bit: 7, label: "Heart Key related", hidden: true },
                                { offset: 0x2063, bit: 4, label: "Door to 2F West Hallway unlocked", reversed: true, separator: true },
                                { offset: 0x23b5, bit: 5, label: "<b>Boo</b>: Turboo" },
                                { offset: 0x2053, bit: 7, label: "Chancey talk after being hit", hidden: true },
                                { offset: 0x235c, bit: 0, label: "Chauncey captured", hidden: true },
                                { offset: 0x2053, bit: 6, label: "Chest appeared", hidden: true },
                              ],
                            },
                            {
                              name: "Money",
                              type: "bitflags",
                              flags: [
                                { offset: 0x2131, bit: 3, label: "On the ground" },
                                { offset: 0x222e, bit: 0, label: "Inside a ceiling light", separator: true },
                                { offset: 0x2373, bit: 5, label: "Speedy Spirit captured / escaped" },
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
                              id: "portraitGhost-913-6",
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
                                { offset: 0x215f, bit: 0, label: "Visited" },
                                { offset: 0x215f, bit: 1, label: "Cleared" },
                                { offset: 0x215f, bit: 2, label: "Chest opened" },
                                { offset: 0x2362, bit: 6, label: "Ice Element Medal obtained", separator: true },
                                { offset: 0x2053, bit: 5, label: "Trigger Ice Element Medal obtained message", hidden: true },
                                { offset: 0x208c, bit: 0, label: "Ice Element Medal obtained message seen", hidden: true },
                                { offset: 0x23c9, bit: 7, label: "Key to 2F Tea Room obtained (unused)", hidden: true },
                                { offset: 0x2065, bit: 0, label: "Door to 2F Stairs to 1F unlocked (unused)", reversed: true, hidden: true },
                                { offset: 0x23b7, bit: 0, label: "<b>Boo</b>: Mr. Boojangles" },
                              ],
                            },
                            {
                              name: "Money",
                              type: "bitflags",
                              flags: [
                                { offset: 0x2232, bit: 7, label: "Inside a chandelier" },
                                { offset: 0x2240, bit: 1, label: "Inside a drawer", separator: true },
                                { offset: 0x2374, bit: 5, label: "Gold Mouse captured" },
                                { offset: 0x2361, bit: 5, label: "Gold Mouse captured" },
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
                              id: "2fHallway",
                              name: "Events",
                              type: "bitflags",
                              flags: [
                                { offset: 0x2157, bit: 0, label: "Visited" },
                                { offset: 0x2159, bit: 0, label: "Visited", hidden: true },
                                { offset: 0x2135, bit: 0, label: "Visited", hidden: true },
                                { offset: 0x2181, bit: 0, label: "Visited", hidden: true },
                                { offset: 0x2141, bit: 0, label: "Visited", hidden: true },
                                { offset: 0x2157, bit: 1, label: "Cleared", separator: true },
                                { offset: 0x2159, bit: 1, label: "Cleared", hidden: true },
                                { offset: 0x2135, bit: 1, label: "Cleared", hidden: true },
                                { offset: 0x2181, bit: 1, label: "Cleared", hidden: true },
                                { offset: 0x2141, bit: 1, label: "Cleared", hidden: true },
                                { offset: 0x2063, bit: 2, label: "Door to 2F Sitting Room unlocked", reversed: true },
                                { offset: 0x2065, bit: 2, label: "Door to 2F Washroom unlocked (unused)", reversed: true, hidden: true },
                                { offset: 0x2065, bit: 0, label: "Door to 2F Tea Room unlocked (unused)", reversed: true, hidden: true },
                                { offset: 0x2065, bit: 3, label: "Door to 2F Astral Hall unlocked (unused)", reversed: true, hidden: true },
                                { offset: 0x2066, bit: 6, label: "Door to 2F Nana's Room unlocked (unused)", reversed: true, hidden: true },
                                { offset: 0x2066, bit: 7, label: "Door to 2F Bathroom unlocked (unused)", reversed: true, hidden: true },
                                { offset: 0x2069, bit: 4, label: "Door to 2F Stairs to 1F unlocked (unused)", reversed: true, hidden: true },
                                { offset: 0x208d, bit: 0, label: "Twins ask Luigi to come seek them triggered", hidden: true },
                              ],
                            },
                            {
                              name: "Money",
                              type: "bitflags",
                              flags: [
                                { offset: 0x2241, bit: 2, label: "Inside a vase" },
                                { offset: 0x2241, bit: 3, label: "Inside a vase" },
                                { offset: 0x2241, bit: 5, label: "Inside a vase" },
                                { offset: 0x2241, bit: 7, label: "Inside a vase", separator: true },
                                { offset: 0x2361, bit: 3, label: "Gold Mouse captured" },
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
                                { offset: 0x215b, bit: 0, label: "Visited" },
                                { offset: 0x215b, bit: 1, label: "Cleared" },
                                { offset: 0x215b, bit: 2, label: "Chest opened" },
                                { offset: 0x23c6, bit: 1, label: "Key to 1F Billiards Room obtained" },
                                { offset: 0x23ca, bit: 0, label: "Key to 2F Bathroom obtained (unused)", hidden: true },
                                { offset: 0x2066, bit: 7, label: "Door to 2F Hallway unlocked (unused)", reversed: true, hidden: true },
                                { offset: 0x20a2, bit: 0, label: "Miss Petunia sneezed", hidden: true },
                                { offset: 0x2359, bit: 5, label: "Miss Petunia captured", hidden: true },
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
                                  id: "portraitGhost-142-5",
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
                                { offset: 0x2155, bit: 0, label: "Visited" },
                                { offset: 0x2155, bit: 1, label: "Cleared" },
                                { offset: 0x2155, bit: 2, label: "Chest opened" },
                                { offset: 0x23c9, bit: 5, label: "Key to 2F Washroom obtained (unused)", hidden: true },
                                { offset: 0x2065, bit: 2, label: "Door to 2F Hallway unlocked (unused)", reversed: true, hidden: true },
                              ],
                            },
                            {
                              name: "Money",
                              type: "bitflags",
                              flags: [
                                { offset: 0x2237, bit: 4, label: "Inside a ceiling light" },
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
                                { offset: 0x215d, bit: 0, label: "Visited" },
                                { offset: 0x215d, bit: 1, label: "Cleared" },
                                { offset: 0x215d, bit: 2, label: "Chest opened" },
                                { offset: 0x23c7, bit: 4, label: "Key to 2F The Twins' Room obtained", separator: true },
                                { offset: 0x23ca, bit: 1, label: "Key to 2F Nana's Room obtained (unused)", hidden: true },
                                { offset: 0x2066, bit: 6, label: "Door to 2F Hallway unlocked (unused)", reversed: true, hidden: true },
                                { offset: 0x23b6, bit: 7, label: "<b>Boo</b>: LimBooger" },
                                { offset: 0x235a, bit: 0, label: "Nana captured", hidden: true },
                              ],
                            },
                            {
                              name: "Money",
                              type: "bitflags",
                              flags: [
                                { offset: 0x222f, bit: 4, label: "Inside a chandelier" },
                                { offset: 0x223c, bit: 4, label: "Inside a drawer", separator: true },
                                { offset: 0x2372, bit: 4, label: "Speedy Spirit captured / escaped" },
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
                              id: "portraitGhost-141-0",
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
                                { offset: 0x2133, bit: 0, label: "Visited" },
                                { offset: 0x2133, bit: 1, label: "Cleared" },
                                { offset: 0x236b, bit: 7, label: "Mario's Shoe obtained" },
                                { offset: 0x2051, bit: 0, label: "Trigger Mario's Shoe obtained message", hidden: true },
                                { offset: 0x2092, bit: 0, label: "Mario's Shoe obtained message triggered", hidden: true },
                                { offset: 0x2133, bit: 2, label: "Chest opened", separator: true },
                                { offset: 0x2063, bit: 3, label: "Door to 2F West Hallway unlocked", reversed: true, separator: true },
                                { offset: 0x23b5, bit: 6, label: "<b>Boo</b>: Booris" },
                                { offset: 0x235a, bit: 1, label: "Orville captured", hidden: true },
                                { offset: 0x235a, bit: 2, label: "Henry captured", hidden: true },
                                { offset: 0x2052, bit: 5, label: "Trigger twins ask Luigi to come seek them", hidden: true },
                                { offset: 0x2054, bit: 3, label: "Related to twins captured", hidden: true },
                                { offset: 0x2056, bit: 1, label: "Related to hide and seek game", hidden: true },
                              ],
                            },
                            {
                              name: "Money",
                              type: "bitflags",
                              flags: [
                                { offset: 0x2235, bit: 7, label: "Inside a ceiling light" },
                                { offset: 0x2240, bit: 3, label: "Inside a drawer", separator: true },
                                { offset: 0x2372, bit: 3, label: "Speedy Spirit captured / escaped" },
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
                              id: "portraitGhost-141-1",
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
                                { offset: 0x2151, bit: 0, label: "Visited" },
                                { offset: 0x2151, bit: 1, label: "Cleared" },
                                { offset: 0x2058, bit: 3, label: "2F Observatory accessible", separator: true },
                                { offset: 0x23c9, bit: 4, label: "Key to 2F Astral Hall obtained (unused)", hidden: true },
                                { offset: 0x2065, bit: 3, label: "Door to 2F Hallway unlocked (unused)", reversed: true, hidden: true },
                                { offset: 0x2065, bit: 7, label: "Door to 2F Observatory unlocked (unused)", reversed: true, hidden: true },
                                { offset: 0x23b6, bit: 6, label: "<b>Boo</b>: Boonswoggle" },
                                { offset: 0x20cc, bit: 0, label: "Related to central platform", hidden: true },
                              ],
                            },
                            {
                              name: "Money",
                              type: "bitflags",
                              flags: [
                                { offset: 0x2237, bit: 0, label: "Inside a chandelier" },
                                { offset: 0x223c, bit: 3, label: "Inside a drawer" },
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
                                { offset: 0x2153, bit: 0, label: "Visited" },
                                { offset: 0x2153, bit: 1, label: "Cleared" },
                                { offset: 0x2054, bit: 1, label: "Walls fade away" },
                                { offset: 0x2054, bit: 2, label: "Astral path appeared" },
                                { offset: 0x2054, bit: 4, label: "Related to astral path", hidden: true },
                                { offset: 0x236b, bit: 5, label: "Mario's Star obtained" },
                                { offset: 0x2051, bit: 6, label: "Trigger Mario's Star obtained message", hidden: true },
                                { offset: 0x2094, bit: 0, label: "Mario's Star obtained message triggered", hidden: true },
                                { offset: 0x23c9, bit: 0, label: "Key to 2F Observatory obtained (unused)", hidden: true },
                                { offset: 0x2065, bit: 7, label: "Door to 2F Astral Hall unlocked (unused)", reversed: true, hidden: true },
                              ],
                            },
                            {
                              name: "Money",
                              type: "bitflags",
                              flags: [
                                { offset: 0x223a, bit: 1, label: "Inside a drawer" },
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
                                { offset: 0x2149, bit: 0, label: "Visited" },
                                { offset: 0x2149, bit: 1, label: "Cleared" },
                                { offset: 0x2149, bit: 2, label: "Chest opened" },
                                { offset: 0x23c7, bit: 5, label: "Key to 2F Sitting Room obtained" },
                              ],
                            },
                            {
                              name: "Money",
                              type: "bitflags",
                              flags: [
                                { offset: 0x2239, bit: 4, label: "Inside a trophy" },
                                { offset: 0x2239, bit: 5, label: "Inside a trophy" },
                                { offset: 0x2239, bit: 7, label: "Inside a trophy" },
                                { offset: 0x223a, bit: 7, label: "Inside a chandelier" },
                                { offset: 0x2242, bit: 0, label: "Inside a chest" },
                                { offset: 0x2242, bit: 1, label: "Inside a chest" },
                                { offset: 0x2242, bit: 2, label: "Inside a chest" },
                                { offset: 0x2242, bit: 3, label: "Inside a chest" },
                                { offset: 0x2242, bit: 4, label: "Inside a chest" },
                                { offset: 0x2242, bit: 6, label: "Inside a chest" },
                                { offset: 0x2243, bit: 7, label: "Inside a chest", separator: true },
                                { offset: 0x2361, bit: 6, label: "Gold Mouse captured" },
                                { offset: 0x2372, bit: 6, label: "Speedy Spirit captured / escaped" },
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
                                { offset: 0x2137, bit: 0, label: "Visited" },
                                { offset: 0x2137, bit: 1, label: "Cleared", separator: true },
                                { offset: 0x2063, bit: 2, label: "Door to 2F Hallway unlocked", reversed: true, separator: true },
                                { offset: 0x2063, bit: 1, label: "Door to 2F Guest Room unlocked (unused)", reversed: true, hidden: true },
                                { offset: 0x23b5, bit: 7, label: "<b>Boo</b>: Boolivia" },
                                { offset: 0x2099, bit: 0, label: "Animation of upside down triggered", hidden: true },
                              ],
                            },
                            {
                              name: "Money",
                              type: "bitflags",
                              flags: [
                                { offset: 0x2233, bit: 5, label: "By watering a plant" },
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
                                { offset: 0x2139, bit: 0, label: "Visited" },
                                { offset: 0x2139, bit: 1, label: "Cleared" },
                                { offset: 0x2139, bit: 2, label: "Chest opened", separator: true },
                                { offset: 0x2052, bit: 4, label: "Room upside down", reversed: true },
                                { offset: 0x2050, bit: 2, label: "Related to room upside down", hidden: true },
                                { offset: 0x2052, bit: 6, label: "Related to room upside down", hidden: true },
                                { offset: 0x23c7, bit: 6, label: "Key to 2F Guest Room obtained (unused)", hidden: true },
                                { offset: 0x2063, bit: 1, label: "Door to 2F Sitting Room unlocked (unused)", reversed: true, hidden: true },
                                { offset: 0x23b6, bit: 0, label: "<b>Boo</b>: Boonita" },
                                { offset: 0x20d7, bit: 0, label: "Sue Pea saying to go away", hidden: true },
                                { offset: 0x20d6, bit: 0, label: "Sue Pea awoken", hidden: true },
                                { offset: 0x2369, bit: 5, label: "Sue Pea captured", hidden: true },
                              ],
                            },
                            {
                              name: "Money",
                              type: "bitflags",
                              flags: [
                                { offset: 0x2234, bit: 5, label: "By watering a plant" },
                                { offset: 0x223e, bit: 5, label: "Inside a drawer" },
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
                              id: "portraitGhost-127-5",
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
                                { offset: 0x211f, bit: 0, label: "Visited" },
                                { offset: 0x211f, bit: 1, label: "Cleared", hidden: true },
                                { offset: 0x2067, bit: 7, label: "Door to 3F Safari Room unlocked", reversed: true, hidden: true },
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
                                { offset: 0x2169, bit: 0, label: "Visited" },
                                { offset: 0x2169, bit: 1, label: "Cleared" },
                                { offset: 0x2169, bit: 2, label: "Chest opened" },
                                { offset: 0x23cb, bit: 6, label: "Key to 3F Balcony obtained", separator: true },
                                { offset: 0x23ca, bit: 7, label: "Key to 3F East Hallway obtained (unused)", hidden: true },
                                { offset: 0x2067, bit: 7, label: "Door to 3F Stairs to 2F unlocked", reversed: true },
                                { offset: 0x2067, bit: 0, label: "Door to 3F The Artist's Studio unlocked", reversed: true, separator: true },
                                { offset: 0x2066, bit: 0, label: "Door to 3F East Hallway unlocked (unused)", reversed: true, hidden: true },
                                { offset: 0x23b7, bit: 3, label: "<b>Boo</b>: Little Boo Peep" },
                              ],
                            },
                            {
                              name: "Money",
                              type: "bitflags",
                              flags: [
                                { offset: 0x224f, bit: 6, label: "Inside a ceiling light" },
                                { offset: 0x224f, bit: 7, label: "Inside a ceiling light", separator: true },
                                { offset: 0x2374, bit: 6, label: "Gold Mouse captured" },
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
                              id: "3fEastHallway",
                              name: "Events",
                              type: "bitflags",
                              flags: [
                                { offset: 0x2175, bit: 0, label: "Visited", separator: true },
                                { offset: 0x2167, bit: 0, label: "Visited", hidden: true },
                                { offset: 0x2175, bit: 1, label: "Cleared", hidden: true },
                                { offset: 0x2167, bit: 1, label: "Cleared", hidden: true },
                                { offset: 0x2067, bit: 1, label: "Door to 3F Balcony unlocked", reversed: true },
                                { offset: 0x2066, bit: 0, label: "Door to 3F Safari Room unlocked (unused)", reversed: true, hidden: true },
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
                                { offset: 0x2177, bit: 0, label: "Visited" },
                                { offset: 0x2177, bit: 1, label: "Cleared" },
                                { offset: 0x2177, bit: 2, label: "Chest opened" },
                                { offset: 0x23cb, bit: 3, label: "Diamond Key to 3F Balcony obtained", separator: true },
                                { offset: 0x235f, bit: 1, label: "Diamond Key related", hidden: true },
                                { offset: 0x2376, bit: 0, label: "Diamond door to 3F West Hallway unsealed" },
                                { offset: 0x2067, bit: 4, label: "Diamond door to 3F West Hallway unlocked", reversed: true, separator: true },
                                { offset: 0x2067, bit: 1, label: "Door to 3F East Hallway unlocked", reversed: true },
                                { offset: 0x23b8, bit: 3, label: "<b>Boo</b>: Part of Boolossus (captured)", hidden: true },
                                { offset: 0x23b8, bit: 4, label: "<b>Boo</b>: Part of Boolossus (captured)", hidden: true },
                                { offset: 0x23b8, bit: 5, label: "<b>Boo</b>: Part of Boolossus (captured)", hidden: true },
                                { offset: 0x23b8, bit: 6, label: "<b>Boo</b>: Part of Boolossus (captured)", hidden: true },
                                { offset: 0x23b8, bit: 7, label: "<b>Boo</b>: Part of Boolossus (captured)", hidden: true },
                                { offset: 0x23b9, bit: 0, label: "<b>Boo</b>: Part of Boolossus (captured)", hidden: true },
                                { offset: 0x23b9, bit: 1, label: "<b>Boo</b>: Part of Boolossus (captured)", hidden: true },
                                { offset: 0x23b9, bit: 2, label: "<b>Boo</b>: Part of Boolossus (captured)", hidden: true },
                                { offset: 0x23b9, bit: 3, label: "<b>Boo</b>: Part of Boolossus (captured)", hidden: true },
                                { offset: 0x23b9, bit: 4, label: "<b>Boo</b>: Part of Boolossus (captured)", hidden: true },
                                { offset: 0x23b9, bit: 5, label: "<b>Boo</b>: Part of Boolossus (captured)", hidden: true },
                                { offset: 0x23b9, bit: 6, label: "<b>Boo</b>: Part of Boolossus (captured)", hidden: true },
                                { offset: 0x23b9, bit: 7, label: "<b>Boo</b>: Part of Boolossus (captured)", hidden: true },
                                { offset: 0x23ba, bit: 0, label: "<b>Boo</b>: Part of Boolossus (captured)", hidden: true },
                                { offset: 0x23ba, bit: 1, label: "<b>Boo</b>: Part of Boolossus (captured)", hidden: true },
                                { offset: 0x236f, bit: 4, label: "Boolossus captured", hidden: true },
                                { offset: 0x2058, bit: 1, label: "Chest appeared", hidden: true },
                                { offset: 0x20ac, bit: 0, label: "After unsealed door related", hidden: true },
                                { offset: 0x20c7, bit: 0, label: "Boos Animation related", hidden: true },
                                { offset: 0x20c8, bit: 0, label: "Boolossus animation related", hidden: true },
                              ],
                            },
                            {
                              name: "Money",
                              type: "bitflags",
                              flags: [
                                { offset: 0x224b, bit: 1, label: "By watering a plant" },
                                { offset: 0x224b, bit: 2, label: "By watering a plant" },
                                { offset: 0x224c, bit: 1, label: "By watering a plant" },
                                { offset: 0x224c, bit: 2, label: "By watering a plant" },
                                { offset: 0x224c, bit: 3, label: "By watering a plant" },
                                { offset: 0x224c, bit: 4, label: "By watering a plant" },
                                { offset: 0x224c, bit: 5, label: "By watering a plant" },
                                { offset: 0x224c, bit: 6, label: "By watering a plant" },
                                { offset: 0x224c, bit: 7, label: "By watering a plant" },
                                { offset: 0x224d, bit: 6, label: "By watering a plant" },
                                { offset: 0x224d, bit: 7, label: "By watering a plant" },
                                { offset: 0x2259, bit: 5, label: "By watering a plant" },
                                { offset: 0x2259, bit: 6, label: "By watering a plant" },
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
                              id: "portraitGhost-911-1",
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
                              id: "3fWestHallway",
                              name: "Events",
                              type: "bitflags",
                              flags: [
                                { offset: 0x216d, bit: 0, label: "Visited", separator: true },
                                { offset: 0x2163, bit: 0, label: "Visited", hidden: true },
                                { offset: 0x216d, bit: 1, label: "Cleared", hidden: true },
                                { offset: 0x2163, bit: 1, label: "Cleared", hidden: true },
                                { offset: 0x2067, bit: 4, label: "Diamond door to 3F Balcony unlocked", reversed: true },
                                { offset: 0x2066, bit: 4, label: "Door to 3F Armory unlocked", reversed: true },
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
                                { offset: 0x2165, bit: 0, label: "Visited" },
                                { offset: 0x2165, bit: 1, label: "Cleared" },
                                { offset: 0x2165, bit: 2, label: "Chest opened", separator: true },
                                { offset: 0x23ca, bit: 4, label: "Key to 3F Telephone Room obtained (unused)", hidden: true },
                                { offset: 0x2066, bit: 2, label: "Door to 3F Clockwork Room unlocked", reversed: true, separator: true },
                                { offset: 0x2066, bit: 3, label: "Door to 3F West Hallway unlocked (unused)", reversed: true, hidden: true },
                                { offset: 0x23b7, bit: 2, label: "<b>Boo</b>: Boomerang" },
                              ],
                            },
                            {
                              name: "Money",
                              type: "bitflags",
                              flags: [
                                { offset: 0x2254, bit: 7, label: "Inside a ceiling light" },
                                { offset: 0x2255, bit: 4, label: "Inside a chest" },
                                { offset: 0x2255, bit: 7, label: "Inside a cubboard" },
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
                                { offset: 0x2171, bit: 0, label: "Visited" },
                                { offset: 0x2171, bit: 1, label: "Cleared", separator: true },
                                { offset: 0x2066, bit: 2, label: "Door to 3F Telephone Room unlocked", reversed: true, separator: true },
                                { offset: 0x23b7, bit: 5, label: "<b>Boo</b>: Booscaster", separator: true },
                                { offset: 0x235b, bit: 1, label: "Blue Clockwork Soldier captured", disabled: true },
                                { offset: 0x235b, bit: 2, label: "Pink Clockwork Soldier captured" },
                                { offset: 0x235b, bit: 3, label: "Green Clockwork Soldier captured" },
                              ],
                            },
                            {
                              name: "Money",
                              type: "bitflags",
                              flags: [
                                { offset: 0x224a, bit: 2, label: "Inside a ceiling light" },
                                { offset: 0x224a, bit: 3, label: "Inside a ceiling light" },
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
                              id: "portraitGhost-142-1",
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
                                { offset: 0x2161, bit: 0, label: "Visited" },
                                { offset: 0x2161, bit: 1, label: "Cleared" },
                                { offset: 0x2161, bit: 2, label: "Chest opened" },
                                { offset: 0x23cc, bit: 5, label: "Key to BF Pipe Room obtained", separator: true },
                                { offset: 0x2066, bit: 4, label: "Door to 3F West Hallway unlocked", reversed: true, separator: true },
                                { offset: 0x2066, bit: 5, label: "Door to 3F Ceramics Studio unlocked (unused)", reversed: true, hidden: true },
                                { offset: 0x23b7, bit: 1, label: "<b>Boo</b>: UnderBoo" },
                                { offset: 0x2251, bit: 1, label: "Enabled when open chest with ghost inside", hidden: true },
                              ],
                            },
                            {
                              name: "Money",
                              type: "bitflags",
                              flags: [
                                { offset: 0x2251, bit: 0, label: "Inside a chest" },
                                { offset: 0x2251, bit: 2, label: "Inside a chest" },
                                { offset: 0x2252, bit: 7, label: "Inside a chest" },
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
                                { offset: 0x216f, bit: 0, label: "Visited" },
                                { offset: 0x216f, bit: 1, label: "Cleared" },
                                { offset: 0x216f, bit: 2, label: "Chest opened", separator: true },
                                { offset: 0x23ca, bit: 2, label: "Key to 3F Ceramics Studio obtained (unused)", hidden: true },
                                { offset: 0x2066, bit: 5, label: "Door to 3F Armory unlocked (unused)", reversed: true, hidden: true },
                                { offset: 0x23b7, bit: 4, label: "<b>Boo</b>: TamBoorine" },
                                { offset: 0x2358, bit: 5, label: "Jarvis captured", hidden: true },
                                { offset: 0x2053, bit: 0, label: "Chest appeared", hidden: true },
                              ],
                            },
                            {
                              name: "Money",
                              type: "bitflags",
                              flags: [
                                { offset: 0x2252, bit: 5, label: "Inside a ceiling light" },
                                { offset: 0x2252, bit: 0, label: "Inside a jar" },
                                { offset: 0x2252, bit: 2, label: "Inside a jar" },
                                { offset: 0x2253, bit: 1, label: "Inside a jar" },
                                { offset: 0x2253, bit: 2, label: "Inside a jar" },
                                { offset: 0x2253, bit: 4, label: "Inside a jar" },
                                { offset: 0x2253, bit: 7, label: "Inside a jar" },
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
                              id: "portraitGhost-917-0",
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
                                { offset: 0x2173, bit: 0, label: "Visited" },
                                { offset: 0x2173, bit: 1, label: "Cleared" },
                                { offset: 0x23cd, bit: 0, label: "Spade Key to BF Secret Altar obtained", separator: true },
                                { offset: 0x2054, bit: 7, label: "Spade Key appeared", hidden: true },
                                { offset: 0x235f, bit: 2, label: "Spade Key related", hidden: true },
                                { offset: 0x2067, bit: 0, label: "Door to 3F East Hallway unlocked", reversed: true, separator: true },
                                { offset: 0x23b7, bit: 6, label: "<b>Boo</b>: Bootique" },
                                { offset: 0x20a6, bit: 0, label: "Meet Vincent Van Gore", hidden: true },
                                { offset: 0x235a, bit: 5, label: "Vincent Van Gore captured", hidden: true },
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
                              id: "portraitGhost-142-5",
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
                      name: "BF Stairs to 1F",
                      items: [
                        {
                          type: "section",
                          flex: true,
                          items: [
                            {
                              name: "Events",
                              type: "bitflags",
                              flags: [
                                { offset: 0x2183, bit: 0, label: "Visited" },
                                { offset: 0x2183, bit: 1, label: "Cleared", separator: true },
                                { offset: 0x23c5, bit: 1, label: "Key to BF Stairs to 1F obtained (unused)", hidden: true },
                                { offset: 0x2068, bit: 0, label: "Door to BF Breaker Room unlocked", reversed: true },
                                { offset: 0x2068, bit: 3, label: "Door to BF Cellar unlocked", reversed: true },
                                { offset: 0x2061, bit: 6, label: "Door to 1F Hallway unlocked (unused)", reversed: true, hidden: true },
                              ],
                            },
                            {
                              name: "Money",
                              type: "bitflags",
                              flags: [
                                { offset: 0x2207, bit: 1, label: "Inside a ceiling light" },
                              ],
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
                                { offset: 0x218b, bit: 0, label: "Visited" },
                                { offset: 0x218b, bit: 1, label: "Cleared" },
                                { offset: 0x23c7, bit: 1, label: "Key to 1F Courtyard obtained" },
                                { offset: 0x2054, bit: 5, label: "Portrait Mario seen", hidden: true },
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
                                { offset: 0x2187, bit: 0, label: "Visited" },
                                { offset: 0x2187, bit: 1, label: "Cleared" },
                                { offset: 0x2187, bit: 2, label: "Chest opened" },
                                { offset: 0x23cc, bit: 4, label: "Key to BF Cellar obtained", separator: true },
                                { offset: 0x2068, bit: 0, label: "Door from BF Stairs to 1F unlocked", reversed: true, separator: true },
                                { offset: 0x23b8, bit: 2, label: "<b>Boo</b>: Boo B. Hatch" },
                                { offset: 0x2055, bit: 1, label: "Related to breaker turned on", hidden: true },
                                { offset: 0x20ad, bit: 0, label: "Breaked turned on", hidden: true },
                              ],
                            },
                            {
                              name: "Money",
                              type: "bitflags",
                              flags: [
                                { offset: 0x2205, bit: 4, label: "Inside a ceiling light", separator: true },
                                { offset: 0x2373, bit: 2, label: "Speedy Spirit captured / escaped" },
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
                                { offset: 0x217f, bit: 0, label: "Visited" },
                                { offset: 0x217f, bit: 1, label: "Cleared" },
                                { offset: 0x217f, bit: 2, label: "Chest opened" },
                                { offset: 0x23ca, bit: 5, label: "Key to 3F Clockwork Room obtained", separator: true },
                                { offset: 0x23cc, bit: 3, label: "Key to BF Cellar obtained (unused)", hidden: true },
                                { offset: 0x2068, bit: 3, label: "Door to BF Stairs to 1F unlocked", reversed: true, separator: true },
                                { offset: 0x2068, bit: 4, label: "Door to BF Hallway unlocked (unused)", reversed: true, hidden: true },
                                { offset: 0x23b8, bit: 0, label: "<b>Boo</b>: Booripedes" },
                              ],
                            },
                            {
                              name: "Money",
                              type: "bitflags",
                              flags: [
                                { offset: 0x2201, bit: 0, label: "On a shelf" },
                                { offset: 0x2201, bit: 1, label: "On a shelf" },
                                { offset: 0x2201, bit: 2, label: "On a shelf" },
                                { offset: 0x2202, bit: 4, label: "On a shelf" },
                                { offset: 0x2202, bit: 5, label: "On a shelf" },
                                { offset: 0x2202, bit: 7, label: "On a shelf", separator: true },
                                { offset: 0x2373, bit: 1, label: "Speedy Spirit captured / escaped" },
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
                              id: "bfHallway",
                              name: "Events",
                              type: "bitflags",
                              flags: [
                                { offset: 0x217d, bit: 0, label: "Visited" },
                                { offset: 0x218f, bit: 0, label: "Visited", hidden: true },
                                { offset: 0x217d, bit: 1, label: "Cleared", hidden: true },
                                { offset: 0x218f, bit: 1, label: "Cleared", hidden: true },
                                { offset: 0x2068, bit: 4, label: "Door to BF Cellar unlocked (unused)", reversed: true, hidden: true },
                                { offset: 0x2068, bit: 1, label: "Door to BF North Hallway unlocked (unused)", reversed: true, hidden: true },
                                { offset: 0x2068, bit: 2, label: "Door to BF Pipe Room unlocked", reversed: true, hidden: true },
                                { offset: 0x2068, bit: 6, label: "Door to BF Cold Storage unlocked", reversed: true, hidden: true },
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
                                { offset: 0x2185, bit: 0, label: "Visited" },
                                { offset: 0x2185, bit: 1, label: "Cleared" },
                                { offset: 0x2056, bit: 0, label: "River freezed" },
                                { offset: 0x2055, bit: 7, label: "Waterfall stopped" },
                                { offset: 0x20d4, bit: 0, label: "Waterfall stopped triggered", hidden: true },
                                { offset: 0x2185, bit: 2, label: "Chest opened" },
                                { offset: 0x23cc, bit: 1, label: "Key to BF Cold Storage obtained", separator: true },
                                { offset: 0x2068, bit: 2, label: "Door to BF Hallway unlocked", reversed: true, hidden: true },
                                { offset: 0x23b8, bit: 1, label: "<b>Boo</b>: Booffant" },
                              ],
                            },
                            {
                              name: "Money",
                              type: "bitflags",
                              flags: [
                                { offset: 0x2202, bit: 1, label: "Inside a bucket" },
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
                                { offset: 0x217b, bit: 0, label: "Visited" },
                                { offset: 0x217b, bit: 1, label: "Cleared" },
                                { offset: 0x217b, bit: 2, label: "Chest opened" },
                                { offset: 0x23cb, bit: 7, label: "Key to 3F The Artist's Studio obtained", separator: true },
                                { offset: 0x2068, bit: 6, label: "Door to BF Hallway unlocked", reversed: true, hidden: true },
                                { offset: 0x23b7, bit: 7, label: "<b>Boo</b>: Boolderdash" },
                                { offset: 0x20d9, bit: 0, label: "Meet Sir Weston", hidden: true },
                                { offset: 0x236f, bit: 1, label: "Sir Weston captured", hidden: true },
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
                              id: "portraitGhost-122-1",
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
                                { offset: 0x2189, bit: 0, label: "Visited", separator: true },
                                { offset: 0x2189, bit: 1, label: "Cleared", hidden: true },
                                { offset: 0x23cc, bit: 6, label: "Key to BF North Hallway obtained (unused)", hidden: true },
                                { offset: 0x2376, bit: 1, label: "Spade door to BF Secret Altar unsealed" },
                                { offset: 0x2069, bit: 7, label: "Spade door to BF Secret Altar unlocked", reversed: true },
                                { offset: 0x2068, bit: 1, label: "Door to BF Hallway unlocked (unused)", reversed: true, hidden: true },
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
                                { offset: 0x218d, bit: 0, label: "Visited" },
                                { offset: 0x218d, bit: 1, label: "Cleared", separator: true },
                                { offset: 0x2069, bit: 7, label: "Spade door to BF North Hallway unlocked", reversed: true },
                                { offset: 0x20ca, bit: 0, label: "King Boo introduction seen", hidden: true },
                              ],
                            },
                            {
                              name: "Money",
                              type: "bitflags",
                              flags: [
                                { offset: 0x2203, bit: 2, label: "Inside a torch" },
                                { offset: 0x2203, bit: 3, label: "Inside a torch" },
                                { offset: 0x2204, bit: 1, label: "Inside a chandelier" },
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
                                { offset: 0x2179, bit: 0, label: "Visited" },
                                { offset: 0x2179, bit: 1, label: "Cleared" },
                                { offset: 0x2179, bit: 2, label: "Chest opened" },
                                { offset: 0x23ca, bit: 3, label: "Key to 3F Armory obtained" },
                                { offset: 0x20cb, bit: 0, label: "Bowser introduction seen", hidden: true },
                                { offset: 0x236f, bit: 5, label: "King Boo captured", hidden: true },
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
                              id: "portraitGhost-122-5",
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
                    { offset: 0x2050, bit: 1, label: "Gallery angel statue touched" },
                    { offset: 0x2055, bit: 0, label: "Related to 5th boo vaccumed" },
                    { offset: 0x2058, bit: 4, label: "Message for not having required Boos (BF North Wing and 3F Hallway)" },
                    { offset: 0x20d8, bit: 0, label: "Area 4 Completed or BF Secret Altar: Mario's portrait taken" },
                    { offset: 0x2355, bit: 3, label: "Ghold Ghost captured once" },
                    { offset: 0x2355, bit: 4, label: "Temper Terror captured once" },
                    { offset: 0x2355, bit: 5, label: "1F Graveyard and 3F Telephone Room: Mr. Bones captured once" },
                    { offset: 0x2356, bit: 0, label: "Purple Puncher captured once" },
                    { offset: 0x2356, bit: 1, label: "Flash captured once" },
                    { offset: 0x2356, bit: 2, label: "Blue Twirler captured once" },
                    { offset: 0x2356, bit: 3, label: "Blue Blaze captured once" },
                    { offset: 0x2356, bit: 4, label: "Red Grabbing Ghost captured once" },
                    { offset: 0x2356, bit: 5, label: "Turquoise Grabbing Ghost captured once" },
                    { offset: 0x2356, bit: 6, label: "Purple Grabbing Ghost captured once" },
                    { offset: 0x2356, bit: 7, label: "White Grabbing Ghost captured once" },
                    { offset: 0x2357, bit: 0, label: "Bowling Ghost captured once" },
                    { offset: 0x2357, bit: 1, label: "2F Astral Hall: Red Ghost Guy captured once" },
                    { offset: 0x2357, bit: 2, label: "2F Astral Hall: Green Ghost Guy captured once" },
                    { offset: 0x2357, bit: 3, label: "1F Ball Room: White Ghost Guy captured once" },
                    { offset: 0x2357, bit: 4, label: "1F Ball Room: Orange Ghost Guy captured once" },
                    { offset: 0x2357, bit: 5, label: "1F Ball Room: Orange Ghost Guy captured once" },
                    { offset: 0x2357, bit: 6, label: "1F Ball Room: Yellow Ghost Guy captured once" },
                    { offset: 0x2357, bit: 7, label: "1F Ball Room: Pink Ghost Guy captured once" },
                    { offset: 0x2358, bit: 0, label: "1F Ball Room: Purple Ghost Guy captured once" },
                    { offset: 0x2358, bit: 1, label: "Purple Bomber captured once" },
                    { offset: 0x2358, bit: 2, label: "Ceiling Surprise captured once" },
                    { offset: 0x235b, bit: 0, label: "Waiter captured once" },
                    { offset: 0x235c, bit: 6, label: "Blue Flying Fish captured once" },
                    { offset: 0x235c, bit: 7, label: "Green Flying Fish captured once" },
                    { offset: 0x235d, bit: 4, label: "Tutorial Room: Yellow Ghost captured once" },
                    { offset: 0x2361, bit: 0, label: "Blue Ghost Mouse captured once" },
                    { offset: 0x2361, bit: 2, label: "Purple Ghost Mouse captured once" },
                    { offset: 0x2362, bit: 0, label: "Purple Ghost Bat captured once" },
                    { offset: 0x2362, bit: 1, label: "Yellow Ghost Bat captured once" },
                    { offset: 0x2362, bit: 2, label: "Fire Element captured once" },
                    { offset: 0x2362, bit: 3, label: "Ice Element captured once" },
                    { offset: 0x2362, bit: 4, label: "Water Element captured once" },
                    { offset: 0x2364, bit: 1, label: "Teddy Bear captured once" },
                    { offset: 0x2365, bit: 4, label: "Plate captured once" },
                    { offset: 0x2366, bit: 3, label: "Pan captured once" },
                    { offset: 0x2366, bit: 4, label: "Pot captured once" },
                    { offset: 0x2366, bit: 6, label: "Book captured once" },
                    { offset: 0x2366, bit: 7, label: "Doll captured once" },
                    { offset: 0x2367, bit: 3, label: "Toy car captured once" },
                    { offset: 0x2367, bit: 4, label: "Toy plane captured once" },
                    { offset: 0x2368, bit: 3, label: "2F Astral Hall: Ghost Guy's Mask captured once" },
                    { offset: 0x2368, bit: 4, label: "1F Ball Room: Ghost Guy's Mask captured once" },
                    { offset: 0x2369, bit: 0, label: "Banana captured once" },
                    { offset: 0x2369, bit: 7, label: "1F Boneyard: Mr. Bones captured once" },
                    { offset: 0x236c, bit: 1, label: "Poison Mushroom obtained once" },
                    { offset: 0x236c, bit: 2, label: "Small Pearl obtained once" },
                    { offset: 0x236c, bit: 3, label: "Medium Pearl obtained once" },
                    { offset: 0x236c, bit: 4, label: "Big Pearl obtained once" },
                    { offset: 0x236c, bit: 5, label: "Blue Jewel obtained once" },
                    { offset: 0x236c, bit: 6, label: "Green Jewel obtained once" },
                    { offset: 0x236c, bit: 7, label: "Red Jewel obtained once" },
                    { offset: 0x236d, bit: 0, label: "Silver Diamond obtained once" },
                    { offset: 0x236d, bit: 2, label: "Gold Diamond obtained once" },
                    { offset: 0x236d, bit: 3, label: "Gold Bar obtained once" },
                    { offset: 0x236d, bit: 4, label: "King Boo Crown obtained once" },
                    { offset: 0x236d, bit: 5, label: "Heart from a ghost obtained once" },
                    { offset: 0x236d, bit: 6, label: "Heart from a contaienr obtained once" },
                    { offset: 0x236e, bit: 6, label: "Boolossus single boo captured once" },
                    { offset: 0x236f, bit: 6, label: "Boo captured once" },
                    { offset: 0x2370, bit: 1, label: "Fake door burned once" },
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
    controls: {
      0x0: "Standard",
      0x1: "Sidestep",
    },
    languages: {
      0x0: "English",
      0x1: "German",
      0x2: "French",
      0x3: "Spanish",
      0x4: "Italian",
    },
    optionBoolean: {
      0x0: "Off",
      0x1: "On",
    },
    portraitFrames: {
      0x0: "-",
      0x1: "Bronze",
      0x2: "Silver",
      0x3: "Gold",
    },
    sounds: {
      0x0: "Mono",
      0x1: "Stereo",
      0x2: "Surround",
    },
  },
};

export default template;
