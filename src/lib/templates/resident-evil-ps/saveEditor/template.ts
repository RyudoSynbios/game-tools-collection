import type { GameJson } from "$lib/types";

const template: GameJson = {
  validator: {
    regions: {
      europe: {
        0x0: [
          0x42, 0x45, 0x53, 0x4c, 0x45, 0x53, 0x2d, 0x30, 0x30, 0x32, 0x30,
          0x30,
        ], // "BESLES-00200"
      },
      usa: {
        0x0: [
          0x42, 0x41, 0x53, 0x4c, 0x55, 0x53, 0x2d, 0x30, 0x30, 0x31, 0x37,
          0x30,
        ], // "BASLUS-00170"
      },
      japan: {
        0x0: [
          0x42, 0x49, 0x53, 0x4c, 0x50, 0x53, 0x2d, 0x30, 0x30, 0x32, 0x32,
          0x32,
        ], // "BISLPS-00222"
      },
      france: {
        0x0: [
          0x42, 0x45, 0x53, 0x4c, 0x45, 0x53, 0x2d, 0x30, 0x30, 0x32, 0x32,
          0x37,
        ], // "BESLES-00227"
      },
      germany: {
        0x0: [
          0x42, 0x45, 0x53, 0x4c, 0x45, 0x53, 0x2d, 0x30, 0x30, 0x32, 0x32,
          0x38,
        ], // "BESLES-00228"
      },
    },
    text: "Drag 'n' drop here or click to add a save file.",
    error: "Not a valid save file.",
  },
  items: [
    {
      id: "slots",
      length: 0x2000,
      type: "container",
      instanceType: "tabs",
      instances: 5,
      enumeration: "Slot %d",
      items: [
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
                      name: "Character",
                      offset: 0x22b,
                      type: "variable",
                      dataType: "bit",
                      bit: 0,
                      resource: "characters",
                      disabled: true,
                    },
                    {
                      name: "Character?",
                      offset: 0x209,
                      type: "variable",
                      dataType: "uint8",
                      hidden: true,
                    },
                    {
                      name: "Playtime",
                      type: "group",
                      mode: "time",
                      items: [
                        {
                          id: "time",
                          offset: 0x224,
                          type: "variable",
                          dataType: "uint32",
                          operations: [
                            { "/": 50 },
                            { convert: { from: "seconds", to: "hours" } },
                          ],
                          max: 99,
                        },
                        {
                          id: "time",
                          offset: 0x224,
                          type: "variable",
                          dataType: "uint32",
                          operations: [
                            { "/": 50 },
                            { convert: { from: "seconds", to: "minutes" } },
                          ],
                          leadingZeros: 1,
                          max: 59,
                          test: true,
                        },
                        {
                          id: "time",
                          offset: 0x224,
                          type: "variable",
                          dataType: "uint32",
                          operations: [
                            { "/": 50 },
                            { convert: { from: "seconds", to: "seconds" } },
                          ],
                          leadingZeros: 1,
                          max: 59,
                          test: true,
                        },
                      ],
                    },
                    {
                      name: "Ink Ribbon Used",
                      offset: 0x228,
                      type: "variable",
                      dataType: "uint8",
                      max: 99,
                    },
                    {
                      id: "location",
                      name: "Location",
                      offset: 0x200,
                      type: "variable",
                      dataType: "uint16",
                      bigEndian: true,
                      resource: "locations",
                      size: "lg",
                      autocomplete: true,
                    },
                  ],
                },
                {
                  type: "section",
                  flex: true,
                  items: [
                    {
                      name: "Health",
                      offset: 0x21e,
                      type: "variable",
                      dataType: "uint16",
                      max: 140,
                    },
                    {
                      name: "Condition",
                      offset: 0x232,
                      type: "variable",
                      dataType: "bit",
                      bit: 1,
                      resource: "conditions",
                    },
                    {
                      name: "Equipped Item",
                      offset: 0x229,
                      type: "variable",
                      dataType: "uint8",
                      hidden: true,
                    },
                  ],
                },
                {
                  type: "section",
                  flex: true,
                  items: [
                    {
                      name: "Special",
                      type: "bitflags",
                      flags: [
                        { offset: 0x2ac, bit: 0, label: "Com. Radio" },
                        { offset: 0x2a6, bit: 5, label: "Alternative Outfit" },
                        { offset: 0x2ac, bit: 1, label: "Unlimited R. Launcher" },
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
                      name: "Map",
                      offset: 0x200,
                      type: "variable",
                      dataType: "uint8",
                      hidden: true,
                    },
                    {
                      name: "Room",
                      offset: 0x201,
                      type: "variable",
                      dataType: "uint8",
                      hidden: true,
                    },
                    {
                      name: "Camera Angle",
                      offset: 0x202,
                      type: "variable",
                      dataType: "uint8",
                      hidden: true,
                    },
                    {
                      name: "Previous Room",
                      offset: 0x203,
                      type: "variable",
                      dataType: "uint8",
                      hidden: true,
                    },
                  ],
                },
                {
                  type: "section",
                  flex: true,
                  hidden: true,
                  items: [
                    {
                      name: "Position X",
                      offset: 0x22c,
                      type: "variable",
                      dataType: "uint16",
                      hidden: true,
                    },
                    {
                      name: "Position Y",
                      offset: 0x22e,
                      type: "variable",
                      dataType: "uint16",
                      hidden: true,
                    },
                    {
                      name: "Rotation Y",
                      offset: 0x230,
                      type: "variable",
                      dataType: "uint16",
                      hidden: true,
                    },
                  ],
                },
              ],
            },
            {
              name: "Inventory",
              flex: true,
              items: [
                {
                  type: "section",
                  items: [
                    {
                      type: "section",
                      items: [
                        {
                          id: "itemSlots-%index%",
                          name: "Slots",
                          offset: 0x207,
                          type: "variable",
                          dataType: "uint8",
                          max: 8,
                        },
                      ],
                    },
                    {
                      length: 0x2,
                      type: "container",
                      instanceType: "section",
                      instances: 8,
                      flex: true,
                      noMargin: true,
                      items: [
                        {
                          id: "item-%index%-0",
                          name: "Item %d",
                          offset: 0x324,
                          type: "variable",
                          dataType: "uint8",
                          resource: "items",
                          size: "lg",
                          autocomplete: true,
                        },
                        {
                          id: "item-%index%-1",
                          name: "Quantity",
                          offset: 0x325,
                          type: "variable",
                          dataType: "uint8",
                          max: 250,
                        },
                      ],
                    },
                  ],
                },
                {
                  type: "section",
                  items: [
                    {
                      name: "Analyzed Items",
                      type: "bitflags",
                      flags: [
                        { offset: 0x29f, bit: 7, label: "Crank > <b>Square Crank</b>" },
                        { offset: 0x29f, bit: 6, label: "Crank > <b>Hex. Crank</b>" },
                        { offset: 0x29f, bit: 5, label: "Chemical > <b>Herbicide</b>" },
                        { offset: 0x29f, bit: 4, label: "Mansion Key > <b>Sword Key</b>" },
                        { offset: 0x29f, bit: 3, label: "Mansion Key > <b>Armor Key</b>" },
                        { offset: 0x29f, bit: 2, label: "Mansion Key > <b>Shield Key</b>" },
                        { offset: 0x29f, bit: 1, label: "Mansion Key > <b>Helmet Key</b>" },
                        { offset: 0x29f, bit: 0, label: "Lab Key > <b>Master Key</b>" },
                        { offset: 0x29e, bit: 7, label: "Special Key > <b>Closet Key</b>" },
                        { offset: 0x29e, bit: 6, label: "Dormitory Key > <b>002 Key</b>" },
                        { offset: 0x29e, bit: 5, label: "Dormitory Key > <b>003 Key</b>" },
                        { offset: 0x29e, bit: 4, label: "Lab Key > <b>P. Room Key</b>" },
                        { offset: 0x29e, bit: 3, label: "Small Key > <b>Desk Key</b>" },
                        { offset: 0x29e, bit: 2, label: "Red Book > <b>Blank Book</b>" },
                      ],
                    },
                  ],
                },
              ],
            },
            {
              name: "Container",
              flex: true,
              items: [
                {
                  length: 0x2,
                  type: "container",
                  instanceType: "section",
                  instances: 48,
                  flex: true,
                  noMargin: true,
                  items: [
                    {
                      name: "Item %d",
                      offset: 0x2c4,
                      type: "variable",
                      dataType: "uint8",
                      resource: "items",
                      size: "lg",
                      autocomplete: true,
                    },
                    {
                      name: "Quantity",
                      offset: 0x2c5,
                      type: "variable",
                      dataType: "uint8",
                      max: 250,
                    },
                  ],
                },
              ],
            },
            {
              name: "Files",
              flex: true,
              items: [
                {
                  name: "Chris Redfield",
                  type: "bitflags",
                  flags: [
                    { offset: 0x2c1, bit: 6, label: "Botany Book" },
                    { offset: 0x2c3, bit: 3, label: "Keeper's Diary" },
                    { offset: 0x2c3, bit: 5, label: "Researcher's Will" },
                    { offset: 0x2c3, bit: 2, label: "Orders" },
                    { offset: 0x2c3, bit: 0, label: "Plant 42 Report" },
                    { offset: 0x2c2, bit: 7, label: "Fax" },
                    { offset: 0x2c2, bit: 6, label: "Scrapbook" },
                    { offset: 0x2c2, bit: 5, label: "Security System", separator: true },
                    { offset: 0x2c2, bit: 4, label: "Researcher's Letter" },
                    { offset: 0x2c2, bit: 3, label: '"V-Jolt" Report' },
                    { offset: 0x2c2, bit: 1, label: "Pass Code 01" },
                    { offset: 0x2c2, bit: 0, label: "Pass Code 02" },
                    { offset: 0x2c1, bit: 7, label: "Pass Code 03" },
                  ],
                },
                {
                  name: "Jill Valentine",
                  type: "bitflags",
                  flags: [
                    { offset: 0x2c1, bit: 6, label: "Botany Book" },
                    { offset: 0x2c3, bit: 3, label: "Keeper's Diary" },
                    { offset: 0x2c3, bit: 4, label: "Researcher's Will" },
                    { offset: 0x2c3, bit: 2, label: "Orders" },
                    { offset: 0x2c3, bit: 1, label: "Pass Number" },
                    { offset: 0x2c3, bit: 0, label: "Plant 42 Report" },
                    { offset: 0x2c2, bit: 7, label: "Fax" },
                    { offset: 0x2c2, bit: 6, label: "Scrapbook", separator: true },
                    { offset: 0x2c2, bit: 5, label: "Security System" },
                    { offset: 0x2c2, bit: 4, label: "Researcher's Letter" },
                    { offset: 0x2c2, bit: 3, label: '"V-Jolt" Report' },
                    { offset: 0x2c2, bit: 2, label: "Barry's Picture" },
                    { offset: 0x2c2, bit: 1, label: "Pass Code 01" },
                    { offset: 0x2c2, bit: 0, label: "Pass Code 02" },
                    { offset: 0x2c1, bit: 7, label: "Pass Code 03" },
                  ],
                },
              ],
            },
            // Area Map names come from https://www.evilresource.com/resident-evil/maps
            {
              name: "Events",
              items: [
                {
                  type: "tabs",
                  vertical: true,
                  items: [
                    {
                      name: "General",
                      flex: true,
                      items: [
                        {
                          name: "Chris Redfield",
                          type: "bitflags",
                          flags: [
                            { offset: 0x24f, bit: 7, label: "Rebecca still alive", reversed: true },
                            { offset: 0x23e, bit: 4, label: "Jill rescued" },
                          ],
                        },
                        {
                          name: "Jill Valentine",
                          type: "bitflags",
                          flags: [
                            { offset: 0x24f, bit: 7, label: "Barry still alive", reversed: true },
                            { offset: 0x23e, bit: 4, label: "Chris rescued" },
                          ],
                        },
                      ],
                    },
                    {
                      name: "Mansion 1F",
                      items: [
                        {
                          type: "tabs",
                          vertical: true,
                          items: [
                            {
                              name: "General",
                              items: [
                                {
                                  type: "bitflags",
                                  flags: [
                                    { offset: 0x2bc, bit: 3, label: "Map Revealed" },
                                  ],
                                },
                              ],
                            },
                            {
                              name: "Main Hall",
                              flex: true,
                              items: [
                                {
                                  type: "bitflags",
                                  flags: [
                                    { offset: 0x2b3, bit: 1, label: "Visited", separator: true },
                                    { offset: 0x257, bit: 2, label: "Door to Dressing Room unlocked", separator: true },
                                    { offset: 0x24b, bit: 6, label: "Rebecca practiced enough piano <b>(Chris)</b>", hidden: true },
                                    { offset: 0x237, bit: 3, label: "Tried to exit", separator: true },
                                    { offset: 0x281, bit: 3, label: "Ink Ribbon obtained", reversed: true },
                                    { offset: 0x27c, bit: 5, label: "Jill's gun obtained <b>(Chris)</b>", reversed: true },
                                  ],
                                },
                              ],
                            },
                            {
                              name: "Dining Room",
                              flex: true,
                              items: [
                                {
                                  type: "bitflags",
                                  flags: [
                                    { offset: 0x2b3, bit: 2, label: "Visited", separator: true },
                                    { offset: 0x24b, bit: 0, label: "Emblem on the wall <b>(Chris)</b>" },
                                    { offset: 0x24a, bit: 7, label: "Gold Emblem on the wall <b>(Chris)</b>" },
                                    { offset: 0x24a, bit: 5, label: "Emblem on the wall <b>(Jill)</b>" },
                                    { offset: 0x24a, bit: 4, label: "Gold Emblem on the wall <b>(Jill)</b>", separator: true },
                                    { offset: 0x282, bit: 3, label: "Blue Jewel obtained", reversed: true },
                                    { offset: 0x282, bit: 5, label: "Emblem obtained?", reversed: true, hidden: true },
                                    { offset: 0x283, bit: 6, label: "Shield Key obtained", reversed: true },
                                  ],
                                },
                              ],
                            },
                            {
                              name: "Tea Room",
                              flex: true,
                              items: [
                                {
                                  type: "bitflags",
                                  flags: [
                                    { offset: 0x2b3, bit: 3, label: "Visited", separator: true },
                                    { offset: 0x255, bit: 4, label: "Door to Elevator Stairway unlocked" },
                                    { offset: 0x255, bit: 5, label: "Door to Central Corridor unlocked" },
                                    { offset: 0x257, bit: 1, label: "Door to Bar unlocked", separator: true },
                                    { offset: 0x249, bit: 3, label: "Kenneth half eaten <b>(Jill)</b>", separator: true },
                                    { offset: 0x25c, bit: 3, label: "Zombie dead" },
                                    { offset: 0x26c, bit: 0, label: "Hunter dead" },
                                    { offset: 0x26c, bit: 1, label: "Hunter dead", separator: true },
                                    { offset: 0x282, bit: 0, label: "Clip obtained", reversed: true },
                                    { offset: 0x282, bit: 6, label: "Clip obtained", reversed: true },
                                  ],
                                },
                              ],
                            },
                            {
                              name: "Bar",
                              flex: true,
                              items: [
                                {
                                  type: "bitflags",
                                  flags: [
                                    { offset: 0x2b2, bit: 0, label: "Visited" },
                                    { offset: 0x2b0, bit: 1, label: "Secret room visited", separator: true },
                                    { offset: 0x24b, bit: 7, label: "Rebecca playing the piano", hidden: true },
                                    { offset: 0x257, bit: 1, label: "Door to Tea Room unlocked", separator: true },
                                    { offset: 0x24b, bit: 5, label: "Wall to secret room moved <b>(Chris)</b>" },
                                    { offset: 0x24b, bit: 3, label: "Emblem on the wall <b>(Chris)</b>" },
                                    { offset: 0x24b, bit: 4, label: "Gold Emblem on the wall <b>(Chris)</b>" },
                                    { offset: 0x24b, bit: 2, label: "Wall to secret room moved <b>(Jill)</b>" },
                                    { offset: 0x24b, bit: 0, label: "Emblem on the wall <b>(Jill)</b>" },
                                    { offset: 0x27d, bit: 2, label: "Gold Emblem on the wall <b>(Jill)</b>", separator: true },
                                    { offset: 0x27f, bit: 0, label: "Music Notes obtained", reversed: true },
                                  ],
                                },
                              ],
                            },
                            {
                              name: "Elevator Stairway",
                              items: [
                                {
                                  type: "bitflags",
                                  flags: [
                                    { offset: 0x2b1, bit: 7, label: "Visited", separator: true },
                                    { offset: 0x255, bit: 4, label: "Door to Tea Room unlocked" },
                                  ],
                                },
                              ],
                            },
                            {
                              name: "Central Corridor",
                              items: [
                                {
                                  type: "bitflags",
                                  flags: [
                                    { offset: 0x2b3, bit: 4, label: "Visited", separator: true },
                                    { offset: 0x255, bit: 5, label: "Door to Tea Room unlocked" },
                                    { offset: 0x256, bit: 4, label: "Door to Keeper's Bedroom unlocked", separator: true },
                                    { offset: 0x262, bit: 6, label: "Zombie dead" },
                                    { offset: 0x262, bit: 7, label: "Zombie dead" },
                                    { offset: 0x262, bit: 5, label: "Zombie dead <b>(Chris)</b>" },
                                    { offset: 0x260, bit: 4, label: "Hunter dead" },
                                    { offset: 0x260, bit: 5, label: "Hunter dead <b>(Chris)</b>" },
                                  ],
                                },
                              ],
                            },
                            {
                              name: "Keeper's Bedroom",
                              items: [
                                {
                                  type: "bitflags",
                                  flags: [
                                    { offset: 0x2b2, bit: 1, label: "Visited", separator: true },
                                    { offset: 0x243, bit: 7, label: "Closet opened" },
                                    { offset: 0x256, bit: 4, label: "Door to Central Corridor unlocked", separator: true },
                                    { offset: 0x25f, bit: 4, label: "Zombie dead", separator: true },
                                    { offset: 0x27f, bit: 2, label: "Shells obtained", reversed: true },
                                    { offset: 0x27f, bit: 3, label: "Keeper's Diary obtained", reversed: true },
                                    { offset: 0x28d, bit: 5, label: "Clip obtained", reversed: true },
                                  ],
                                },
                              ],
                            },
                            {
                              name: "Tiger Statue Room",
                              items: [
                                {
                                  type: "bitflags",
                                  flags: [
                                    { offset: 0x2b2, bit: 2, label: "Visited", separator: true },
                                    { offset: 0x2a2, bit: 0, label: "Statue rotated clockwise" },
                                    { offset: 0x2a2, bit: 1, label: "Statue rotated counterclockwise", separator: true },
                                    { offset: 0x2a2, bit: 2, label: "Wind Crest obtained" },
                                    { offset: 0x2a2, bit: 3, label: "Colt Python obtained? <b>(Chris)</b>", hidden: true },
                                    { offset: 0x292, bit: 0, label: "Colt Python obtained? <b>(Jill)</b>", reversed: true, hidden: true },
                                  ],
                                },
                              ],
                            },
                            {
                              name: "Greenhouse",
                              items: [
                                {
                                  type: "bitflags",
                                  flags: [
                                    { offset: 0x2b2, bit: 3, label: "Visited", separator: true },
                                    { offset: 0x24a, bit: 6, label: "Plant killed <b>(Jill)</b>" },
                                    { offset: 0x24b, bit: 1, label: "Plant killed <b>(Chris)</b>", separator: true },
                                    { offset: 0x27c, bit: 4, label: "Armor Key obtained", reversed: true },
                                    { offset: 0x299, bit: 2, label: "Green Herb obtained", reversed: true },
                                    { offset: 0x299, bit: 3, label: "Green Herb obtained", reversed: true },
                                    { offset: 0x299, bit: 5, label: "Green Herb obtained", reversed: true },
                                    { offset: 0x28f, bit: 3, label: "Green Herb obtained", reversed: true },
                                    { offset: 0x28b, bit: 0, label: "Red Herb obtained", reversed: true },
                                    { offset: 0x299, bit: 4, label: "Red Herb obtained", reversed: true },
                                  ],
                                },
                              ],
                            },
                            {
                              name: "West Stairway",
                              items: [
                                {
                                  type: "bitflags",
                                  flags: [
                                    { offset: 0x2b3, bit: 6, label: "Visited", separator: true },
                                    { offset: 0x256, bit: 5, label: "Door to Vacant Room unlocked", separator: true },
                                    { offset: 0x2ab, bit: 1, label: "Door to Rough Passage unlocked", separator: true },
                                    { offset: 0x25e, bit: 4, label: "Zombie dead" },
                                    { offset: 0x25e, bit: 5, label: "Zombie dead" },
                                    { offset: 0x25e, bit: 6, label: "Zombie dead" },
                                    { offset: 0x25e, bit: 0, label: "Hunter dead" },
                                    { offset: 0x25e, bit: 1, label: "Hunter dead" },
                                  ],
                                },
                              ],
                            },
                            {
                              name: "Vacant Room",
                              items: [
                                {
                                  type: "bitflags",
                                  flags: [
                                    { offset: 0x2b3, bit: 5, label: "Visited", separator: true },
                                    { offset: 0x254, bit: 1, label: "Desk unlocked" },
                                    { offset: 0x256, bit: 5, label: "Door to West Stairway unlocked", separator: true },
                                    { offset: 0x281, bit: 5, label: "Clip obtained", reversed: true },
                                    { offset: 0x281, bit: 6, label: "Shells obtained", reversed: true },
                                    { offset: 0x281, bit: 7, label: "Broken Shotgun obtained", reversed: true },
                                  ],
                                },
                              ],
                            },
                            {
                              name: "Mansion Save Room",
                              items: [
                                {
                                  type: "bitflags",
                                  flags: [
                                    { offset: 0x2b3, bit: 7, label: "Visited", separator: true },
                                    { offset: 0x23a, bit: 1, label: "Serum available", hidden: true },
                                    { offset: 0x27c, bit: 7, label: "Rebecca Serum related", reversed: true, hidden: true },
                                    { offset: 0x27d, bit: 1, label: "Sword Key obtained <b>(Chris)</b>", reversed: true },
                                    { offset: 0x27d, bit: 1, label: "Ink Ribbon obtained <b>(Jill)</b>", reversed: true },
                                  ],
                                },
                              ],
                            },
                            {
                              name: "Dressing Room",
                              items: [
                                {
                                  type: "bitflags",
                                  flags: [
                                    { offset: 0x2b1, bit: 6, label: "Visited", separator: true },
                                    { offset: 0x254, bit: 0, label: "Desk unlocked" },
                                    { offset: 0x257, bit: 2, label: "Door to Main Hall unlocked", separator: true },
                                    { offset: 0x273, bit: 0, label: "Zombie dead", separator: true },
                                    { offset: 0x27f, bit: 5, label: "Shells obtained", reversed: true },
                                    { offset: 0x28b, bit: 7, label: "Clip obtained", reversed: true },
                                  ],
                                },
                              ],
                            },
                            {
                              name: "Wardrobe",
                              items: [
                                {
                                  type: "bitflags",
                                  flags: [
                                    { offset: 0x2b1, bit: 5, label: "Visited", separator: true },
                                    { offset: 0x259, bit: 7, label: "Door to Wardrobe Closet unlocked", separator: true },
                                    { offset: 0x2ac, bit: 4, label: "Allowed to use Closet Key", separator: true },
                                    { offset: 0x26d, bit: 7, label: "Zombie dead" },
                                    { offset: 0x26c, bit: 2, label: "Hunter dead", separator: true },
                                    { offset: 0x295, bit: 3, label: "Ink Ribbon obtained", reversed: true },
                                    { offset: 0x28e, bit: 0, label: "Green Herb obtained", reversed: true },
                                    { offset: 0x28e, bit: 1, label: "Green Herb obtained", reversed: true },
                                  ],
                                },
                              ],
                            },
                            {
                              name: "Wardrobe Closet",
                              items: [
                                {
                                  type: "bitflags",
                                  flags: [
                                    { offset: 0x2b0, bit: 3, label: "Visited", separator: true },
                                    { offset: 0x259, bit: 7, label: "Door to Wardrobe unlocked" },
                                  ],
                                },
                              ],
                            },
                            {
                              name: "Art Room",
                              items: [
                                {
                                  type: "bitflags",
                                  flags: [
                                    { offset: 0x2b3, bit: 0, label: "Visited" },
                                    { offset: 0x2b0, bit: 2, label: "Room behind red curtain visited", separator: true },
                                    { offset: 0x256, bit: 6, label: "Door to 'L' Passage unlocked", separator: true },
                                    { offset: 0x26d, bit: 6, label: "Zombie dead", separator: true },
                                    { offset: 0x283, bit: 0, label: "Ink Ribbon obtained", reversed: true },
                                    { offset: 0x28d, bit: 6, label: "Map of Mansion 1F obtained", reversed: true },
                                  ],
                                },
                              ],
                            },
                            {
                              name: "'L' Passage",
                              items: [
                                {
                                  type: "bitflags",
                                  flags: [
                                    { offset: 0x2b2, bit: 7, label: "Visited", separator: true },
                                    { offset: 0x256, bit: 6, label: "Door to Art Room unlocked", separator: true },
                                    { offset: 0x23f, bit: 6, label: "Cerberus broke window" },
                                    { offset: 0x23f, bit: 7, label: "Cerberus broke window", separator: true },
                                    { offset: 0x25f, bit: 6, label: "Cerberus dead" },
                                    { offset: 0x25f, bit: 7, label: "Cerberus dead" },
                                    { offset: 0x272, bit: 1, label: "Web Spinners dead" },
                                    { offset: 0x272, bit: 2, label: "Web Spinners dead", separator: true },
                                    { offset: 0x27d, bit: 4, label: "Clip obtained", reversed: true },
                                  ],
                                },
                              ],
                            },
                            {
                              name: "Winding Passage",
                              items: [
                                {
                                  type: "bitflags",
                                  flags: [
                                    { offset: 0x2b2, bit: 6, label: "Visited", separator: true },
                                    { offset: 0x257, bit: 3, label: "Door to Outside Boiler unlocked" },
                                    { offset: 0x257, bit: 7, label: "Door to Trap Room unlocked", separator: true },
                                    { offset: 0x269, bit: 1, label: "Hunter dead", separator: true },
                                    { offset: 0x28a, bit: 0, label: "Green Herb obtained", reversed: true },
                                  ],
                                },
                              ],
                            },
                            {
                              name: "Outside Boiler",
                              items: [
                                {
                                  type: "bitflags",
                                  flags: [
                                    { offset: 0x2b1, bit: 3, label: "Visited", separator: true },
                                    { offset: 0x257, bit: 3, label: "Door to Winding Passage unlocked", separator: true },
                                    { offset: 0x25e, bit: 7, label: "Zombie dead" },
                                    { offset: 0x25f, bit: 0, label: "Zombie dead" },
                                    { offset: 0x25f, bit: 1, label: "Zombie dead" },
                                    { offset: 0x25f, bit: 2, label: "Cerberus dead" },
                                    { offset: 0x25f, bit: 3, label: "Cerberus dead", separator: true },
                                    { offset: 0x27e, bit: 5, label: "Green Herb obtained", reversed: true },
                                    { offset: 0x294, bit: 0, label: "Green Herb obtained", reversed: true },
                                    { offset: 0x294, bit: 1, label: "Green Herb obtained", reversed: true },
                                    { offset: 0x294, bit: 2, label: "Green Herb obtained", reversed: true },
                                    { offset: 0x29b, bit: 6, label: "Green Herb obtained", reversed: true },
                                    { offset: 0x29b, bit: 7, label: "Green Herb obtained", reversed: true },
                                  ],
                                },
                              ],
                            },
                            {
                              name: "Bathroom",
                              items: [
                                {
                                  type: "bitflags",
                                  flags: [
                                    { offset: 0x2b1, bit: 4, label: "Visited", separator: true },
                                    { offset: 0x2a3, bit: 5, label: "Bathtub unplugged <b>(Chris)</b>", separator: true },
                                    { offset: 0x27f, bit: 4, label: "Desk Key obtained <b>(Chris)</b>", reversed: true },
                                  ],
                                },
                              ],
                            },
                            {
                              name: "Trap Room",
                              items: [
                                {
                                  type: "bitflags",
                                  flags: [
                                    { offset: 0x2b1, bit: 2, label: "Visited", separator: true },
                                    { offset: 0x257, bit: 6, label: "Door to Living Room unlocked" },
                                    { offset: 0x257, bit: 7, label: "Door to Winding Passage unlocked" },
                                  ],
                                },
                              ],
                            },
                            {
                              name: "Living Room",
                              items: [
                                {
                                  type: "bitflags",
                                  flags: [
                                    { offset: 0x2b1, bit: 1, label: "Visited", separator: true },
                                    { offset: 0x257, bit: 6, label: "Door to Trap Room unlocked", separator: true },
                                    { offset: 0x27f, bit: 6, label: "Broken Shotgun on the wall" },
                                    { offset: 0x27f, bit: 7, label: "Shotgun on the wall" },
                                  ],
                                },
                              ],
                            },
                            {
                              name: "Back Passage",
                              items: [
                                {
                                  type: "bitflags",
                                  flags: [
                                    { offset: 0x2b2, bit: 5, label: "Visited", separator: true },
                                    { offset: 0x254, bit: 7, label: "Door to Courtyard Study unlocked" },
                                    { offset: 0x255, bit: 3, label: "Door to East Stairway unlocked", separator: true },
                                    { offset: 0x269, bit: 5, label: "Zombie dead" },
                                    { offset: 0x269, bit: 6, label: "Zombie dead" },
                                    { offset: 0x25f, bit: 5, label: "Hunter dead" },
                                  ],
                                },
                              ],
                            },
                            {
                              name: "Large Gallery",
                              items: [
                                {
                                  type: "bitflags",
                                  flags: [
                                    { offset: 0x2b1, bit: 0, label: "Visited", separator: true },
                                    { offset: 0x2a3, bit: 4, label: "Paintings puzzle resolved", separator: true },
                                    { offset: 0x263, bit: 0, label: "Crow dead" },
                                    { offset: 0x263, bit: 1, label: "Crow dead" },
                                    { offset: 0x263, bit: 2, label: "Crow dead" },
                                    { offset: 0x263, bit: 3, label: "Crow dead" },
                                    { offset: 0x263, bit: 4, label: "Crow dead" },
                                    { offset: 0x263, bit: 5, label: "Crow dead", separator: true },
                                    { offset: 0x27c, bit: 0, label: "Star Crest obtained", reversed: true },
                                  ],
                                },
                              ],
                            },
                            {
                              name: "Courtyard Study",
                              items: [
                                {
                                  type: "bitflags",
                                  flags: [
                                    { offset: 0x2b0, bit: 6, label: "Visited", separator: true },
                                    { offset: 0x254, bit: 7, label: "Door to Back Passage unlocked", separator: true },
                                    { offset: 0x287, bit: 4, label: "Doom Book 1 obtained", reversed: true },
                                    { offset: 0x28b, bit: 2, label: "Magnum Rounds obtained", reversed: true },
                                  ],
                                },
                              ],
                            },
                            {
                              name: "East Stairway",
                              items: [
                                {
                                  type: "bitflags",
                                  flags: [
                                    { offset: 0x2b2, bit: 4, label: "Visited", separator: true },
                                    { offset: 0x255, bit: 3, label: "Door to Back Passage unlocked", separator: true },
                                    { offset: 0x25c, bit: 6, label: "Zombie dead" },
                                    { offset: 0x259, bit: 2, label: "Hunter dead", separator: true },
                                    { offset: 0x28a, bit: 1, label: "Green Herb obtained", reversed: true },
                                  ],
                                },
                              ],
                            },
                            {
                              name: "Mansion Storeroom",
                              items: [
                                {
                                  type: "bitflags",
                                  flags: [
                                    { offset: 0x2b0, bit: 7, label: "Visited", separator: true },
                                    { offset: 0x27e, bit: 2, label: "Herbicide obtained", reversed: true },
                                    { offset: 0x293, bit: 7, label: "F.-Aid Spray obtained", reversed: true },
                                    { offset: 0x294, bit: 5, label: "Shells obtained", reversed: true },
                                    { offset: 0x294, bit: 6, label: "Clip obtained <b>(Chris)</b>", reversed: true },
                                    { offset: 0x294, bit: 6, label: "Acid Rounds obtained <b>(Jill)</b>", reversed: true },
                                  ],
                                },
                              ],
                            },
                            {
                              name: "Roofed Passage",
                              items: [
                                {
                                  type: "bitflags",
                                  flags: [
                                    { offset: 0x2b0, bit: 5, label: "Visited", separator: true },
                                    { offset: 0x255, bit: 0, label: "Door to Store Room unlocked", separator: true },
                                    { offset: 0x262, bit: 1, label: "Cerberus dead" },
                                    { offset: 0x262, bit: 0, label: "Hunter dead", separator: true },
                                    { offset: 0x2ae, bit: 3, label: "Wind Crest placed" },
                                    { offset: 0x2ae, bit: 4, label: "Moon Crest placed" },
                                    { offset: 0x2ae, bit: 5, label: "Star Crest placed" },
                                    { offset: 0x2ae, bit: 6, label: "Sun Crest placed" },
                                  ],
                                },
                              ],
                            },
                            {
                              name: "Store Room",
                              items: [
                                {
                                  type: "bitflags",
                                  flags: [
                                    { offset: 0x2b0, bit: 4, label: "Visited", separator: true },
                                    { offset: 0x255, bit: 0, label: "Door to Roofed Passage unlocked", separator: true },
                                    { offset: 0x283, bit: 4, label: "Square Crank obtained", reversed: true },
                                    { offset: 0x283, bit: 5, label: "Desk Key obtained <b>(Chris)</b>", reversed: true },
                                  ],
                                },
                              ],
                            },
                            {
                              name: "Isolated Passage",
                              items: [
                                {
                                  type: "bitflags",
                                  flags: [
                                    { offset: 0x2b0, bit: 0, label: "Visited", separator: true },
                                    { offset: 0x2a6, bit: 7, label: "Tombstone moved" },
                                  ],
                                },
                              ],
                            },
                          ],
                        },
                      ],
                    },
                    {
                      name: "Mansion 2F",
                      items: [
                        {
                          type: "tabs",
                          vertical: true,
                          items: [
                            {
                              name: "General",
                              items: [
                                {
                                  type: "bitflags",
                                  flags: [
                                    { offset: 0x2bc, bit: 2, label: "Map Revealed" },
                                  ],
                                },
                              ],
                            },
                            {
                              name: "Main Hall",
                              items: [
                                {
                                  type: "bitflags",
                                  flags: [
                                    { offset: 0x2b7, bit: 4, label: "Visited" },
                                  ],
                                },
                              ],
                            },
                            {
                              name: "Dining Room",
                              items: [
                                {
                                  type: "bitflags",
                                  flags: [
                                    { offset: 0x2b7, bit: 5, label: "Visited", separator: true },
                                    { offset: 0x263, bit: 6, label: "Zombie dead" },
                                    { offset: 0x263, bit: 7, label: "Zombie dead" },
                                    { offset: 0x26c, bit: 3, label: "Hunter dead" },
                                    { offset: 0x26c, bit: 4, label: "Hunter dead", separator: true },
                                    { offset: 0x2a2, bit: 4, label: "Statue pushed" },
                                  ],
                                },
                              ],
                            },
                            {
                              name: "West Stairway",
                              items: [
                                {
                                  type: "bitflags",
                                  flags: [
                                    { offset: 0x2b7, bit: 6, label: "Visited", separator: true },
                                    { offset: 0x256, bit: 3, label: "Door to Trophy Room unlocked", separator: true },
                                    { offset: 0x25c, bit: 1, label: "Zombie dead" },
                                    { offset: 0x25c, bit: 2, label: "Zombie dead" },
                                    { offset: 0x25c, bit: 0, label: "Zombie dead <b>(Chris)</b>" },
                                    { offset: 0x260, bit: 3, label: "Hunter dead" },
                                    { offset: 0x260, bit: 2, label: "Hunter dead <b>(Chris)</b>" },
                                  ],
                                },
                              ],
                            },
                            {
                              name: "Trophy Room",
                              items: [
                                {
                                  type: "bitflags",
                                  flags: [
                                    { offset: 0x2b5, bit: 2, label: "Visited", separator: true },
                                    { offset: 0x256, bit: 3, label: "Door to West Stairway unlocked", separator: true },
                                    { offset: 0x23f, bit: 3, label: "Lights off", separator: true },
                                    { offset: 0x27c, bit: 1, label: "Red Jewel obtained", reversed: true },
                                    { offset: 0x27c, bit: 2, label: "Shells obtained", reversed: true },
                                    { offset: 0x289, bit: 3, label: "Orders obtained", reversed: true },
                                    { offset: 0x296, bit: 7, label: "Magnum Rounds obtained", reversed: true },
                                  ],
                                },
                              ],
                            },
                            {
                              name: "Rough Passage",
                              items: [
                                {
                                  type: "bitflags",
                                  flags: [
                                    { offset: 0x2b5, bit: 3, label: "Visited", separator: true },
                                    { offset: 0x2ab, bit: 1, label: "Door to West Stairway unlocked", separator: true },
                                    { offset: 0x26e, bit: 2, label: "Zombie dead" },
                                    { offset: 0x26e, bit: 3, label: "Zombie dead" },
                                    { offset: 0x26e, bit: 4, label: "Zombie dead", separator: true },
                                    { offset: 0x292, bit: 4, label: "Green Herb obtained", reversed: true },
                                    { offset: 0x292, bit: 6, label: "Green Herb obtained", reversed: true },
                                    { offset: 0x292, bit: 5, label: "Blue Herb obtained", reversed: true },
                                  ],
                                },
                              ],
                            },
                            {
                              name: "Elevator",
                              items: [
                                {
                                  type: "bitflags",
                                  flags: [
                                    { offset: 0x2b5, bit: 4, label: "Visited", separator: true },
                                    { offset: 0x26f, bit: 1, label: "Zombie dead" },
                                    { offset: 0x26f, bit: 2, label: "Zombie dead" },
                                    { offset: 0x26f, bit: 3, label: "Zombie dead <b>(Chris)</b>", separator: true },
                                    { offset: 0x293, bit: 6, label: "Green Herb obtained", reversed: true },
                                  ],
                                },
                              ],
                            },
                            {
                              name: "Closet",
                              items: [
                                {
                                  type: "bitflags",
                                  flags: [
                                    { offset: 0x2b4, bit: 6, label: "Visited", separator: true },
                                    { offset: 0x280, bit: 6, label: "Battery obtained", reversed: true },
                                    { offset: 0x280, bit: 7, label: "Shells obtained <b>(Chris)</b>", reversed: true },
                                    { offset: 0x281, bit: 0, label: "Shells obtained <b>(Chris)</b>", reversed: true },
                                    { offset: 0x280, bit: 7, label: "Explosive R. obtained <b>(Jill)</b>", reversed: true },
                                    { offset: 0x281, bit: 0, label: "Explosive R. obtained <b>(Jill)</b>", reversed: true },
                                  ],
                                },
                              ],
                            },
                            {
                              name: "Large Library",
                              items: [
                                {
                                  type: "bitflags",
                                  flags: [
                                    { offset: 0x2b5, bit: 1, label: "Visited", separator: true },
                                    { offset: 0x25b, bit: 7, label: "Desk unlocked", separator: true },
                                    { offset: 0x264, bit: 4, label: "Zombie dead" },
                                    { offset: 0x264, bit: 5, label: "Zombie dead", separator: true },
                                    { offset: 0x285, bit: 3, label: "Scapbook obtained", reversed: true },
                                    { offset: 0x288, bit: 6, label: "Magnum Rounds obtained", reversed: true },
                                  ],
                                },
                              ],
                            },
                            {
                              name: "Heliport Lookout",
                              items: [
                                {
                                  type: "bitflags",
                                  flags: [
                                    { offset: 0x2b4, bit: 7, label: "Visited", separator: true },
                                    { offset: 0x284, bit: 4, label: "Ink Ribbon obtained", reversed: true },
                                    { offset: 0x297, bit: 0, label: "Clip obtained", reversed: true },
                                  ],
                                },
                              ],
                            },
                            {
                              name: "Private Library",
                              items: [
                                {
                                  type: "bitflags",
                                  flags: [
                                    { offset: 0x2b5, bit: 0, label: "Visited", separator: true },
                                    { offset: 0x2ab, bit: 6, label: "Light on" },
                                    { offset: 0x2ae, bit: 7, label: "Bookshelf moved", separator: true },
                                    { offset: 0x286, bit: 2, label: "MO Disk obtained", reversed: true },
                                  ],
                                },
                              ],
                            },
                            {
                              name: "Terrace Entry",
                              items: [
                                {
                                  type: "bitflags",
                                  flags: [
                                    { offset: 0x2b5, bit: 6, label: "Visited", separator: true },
                                    { offset: 0x28d, bit: 2, label: "Desk Key obtained <b>(Chris)</b>", reversed: true },
                                  ],
                                },
                              ],
                            },
                            {
                              name: "Terrace",
                              items: [
                                {
                                  type: "bitflags",
                                  flags: [
                                    { offset: 0x2b5, bit: 5, label: "Visited", separator: true },
                                    { offset: 0x23f, bit: 5, label: "Forest death discovered", separator: true },
                                    { offset: 0x27f, bit: 1, label: "Bazooka obtained <b>(Jill)</b>", reversed: true },
                                  ],
                                },
                              ],
                            },
                            {
                              name: "'C' Passage",
                              items: [
                                {
                                  type: "bitflags",
                                  flags: [
                                    { offset: 0x2b7, bit: 3, label: "Visited", separator: true },
                                    { offset: 0x255, bit: 1, label: "Door to East Stairway unlocked" },
                                    { offset: 0x256, bit: 1, label: "Door to Armor Room unlocked" },
                                    { offset: 0x256, bit: 2, label: "Door to Pillar Passage unlocked", separator: true },
                                    { offset: 0x26a, bit: 2, label: "Zombie dead" },
                                    { offset: 0x272, bit: 7, label: "Zombie dead" },
                                    { offset: 0x26a, bit: 1, label: "Hunter dead" },
                                    { offset: 0x272, bit: 6, label: "Hunter dead <b>(Chris)</b>" },
                                  ],
                                },
                              ],
                            },
                            {
                              name: "Armor Room",
                              items: [
                                {
                                  type: "bitflags",
                                  flags: [
                                    { offset: 0x2b7, bit: 2, label: "Visited", separator: true },
                                    { offset: 0x256, bit: 1, label: "Door to 'C' Passage unlocked", separator: true },
                                    { offset: 0x2a4, bit: 5, label: "Showcase opened", separator: true },
                                    { offset: 0x283, bit: 3, label: "Sun Crest obtained", reversed: true },
                                  ],
                                },
                              ],
                            },
                            {
                              name: "Pillar Passage",
                              items: [
                                {
                                  type: "bitflags",
                                  flags: [
                                    { offset: 0x2b6, bit: 2, label: "Visited", separator: true },
                                    { offset: 0x256, bit: 2, label: "Door to 'C' Passage unlocked", separator: true },
                                    { offset: 0x282, bit: 7, label: "Clip obtained", reversed: true },
                                    { offset: 0x297, bit: 1, label: "Green Herb obtained", reversed: true },
                                    { offset: 0x297, bit: 2, label: "Green Herb obtained", reversed: true },
                                  ],
                                },
                              ],
                            },
                            {
                              name: "Attic Entry",
                              items: [
                                {
                                  type: "bitflags",
                                  flags: [
                                    { offset: 0x2b6, bit: 1, label: "Visited", separator: true },
                                    { offset: 0x23c, bit: 0, label: "Rebecca helping Chris related", hidden: true },
                                    { offset: 0x23c, bit: 6, label: "Rebecca helping Chris related", hidden: true },
                                    { offset: 0x257, bit: 0, label: "Door to Attic unlocked", separator: true },
                                    { offset: 0x264, bit: 7, label: "Zombie dead" },
                                  ],
                                },
                              ],
                            },
                            {
                              name: "Attic",
                              items: [
                                {
                                  type: "bitflags",
                                  flags: [
                                    { offset: 0x2b5, bit: 7, label: "Visited", separator: true },
                                    { offset: 0x257, bit: 0, label: "Door to Attic Entry unlocked", separator: true },
                                    { offset: 0x2a1, bit: 7, label: "Yawn appeared" },
                                    { offset: 0x23f, bit: 4, label: "Poisoned by the Yawn", separator: true },
                                    { offset: 0x25c, bit: 7, label: "Yawn defeated", separator: true },
                                    { offset: 0x28f, bit: 5, label: "Shells obtained", reversed: true },
                                    { offset: 0x28f, bit: 6, label: "Moon Crest obtained", reversed: true },
                                  ],
                                },
                              ],
                            },
                            {
                              name: "Small Dining Room",
                              items: [
                                {
                                  type: "bitflags",
                                  flags: [
                                    { offset: 0x2b6, bit: 0, label: "Visited" },
                                    { offset: 0x2b4, bit: 2, label: "Secret room visited", separator: true },
                                    { offset: 0x2a2, bit: 5, label: "Candle lit", separator: true },
                                    { offset: 0x27e, bit: 4, label: "Clip obtained", reversed: true },
                                    { offset: 0x27e, bit: 3, label: "Shells obtained <b>(Chris)</b>", reversed: true },
                                    { offset: 0x284, bit: 6, label: "Ink Ribbon obtained <b>(Jill)</b>", reversed: true },
                                    { offset: 0x27e, bit: 3, label: "Acid Rounds obtained <b>(Jill)</b>", reversed: true },
                                  ],
                                },
                              ],
                            },
                            {
                              name: "Small Library",
                              items: [
                                {
                                  type: "bitflags",
                                  flags: [
                                    { offset: 0x2b7, bit: 1, label: "Visited", separator: true },
                                    { offset: 0x255, bit: 2, label: "Door to East Stairway unlocked", separator: true },
                                    { offset: 0x26a, bit: 0, label: "Hunter dead <b>(Chris)</b>", separator: true },
                                    { offset: 0x299, bit: 0, label: "Botany Book obtained", reversed: true },
                                  ],
                                },
                              ],
                            },
                            {
                              name: "East Stairway",
                              items: [
                                {
                                  type: "bitflags",
                                  flags: [
                                    { offset: 0x2b7, bit: 0, label: "Visited", separator: true },
                                    { offset: 0x255, bit: 1, label: "Door to 'C' Passage unlocked" },
                                    { offset: 0x255, bit: 2, label: "Door to Small Library unlocked" },
                                    { offset: 0x255, bit: 7, label: "Door to Deer Room unlocked", separator: true },
                                    { offset: 0x25d, bit: 3, label: "Zombie dead" },
                                    { offset: 0x25d, bit: 4, label: "Zombie dead" },
                                    { offset: 0x272, bit: 0, label: "Zombie dead <b>(Chris)</b>" },
                                    { offset: 0x25d, bit: 1, label: "Hunter dead" },
                                    { offset: 0x25d, bit: 2, label: "Hunter dead" },
                                  ],
                                },
                              ],
                            },
                            {
                              name: "Deer Room",
                              items: [
                                {
                                  type: "bitflags",
                                  flags: [
                                    { offset: 0x2b6, bit: 7, label: "Visited", separator: true },
                                    { offset: 0x255, bit: 7, label: "Door to East Stairway unlocked", separator: true },
                                    { offset: 0x25d, bit: 0, label: "Zombie dead <b>(Chris)</b>" },
                                  ],
                                },
                              ],
                            },
                            {
                              name: "Bedroom",
                              items: [
                                {
                                  type: "bitflags",
                                  flags: [
                                    { offset: 0x2b6, bit: 6, label: "Visited", separator: true },
                                    { offset: 0x283, bit: 2, label: "Lighter obtained", reversed: true },
                                    { offset: 0x295, bit: 4, label: "Red Herb obtained", reversed: true },
                                    { offset: 0x283, bit: 1, label: "Shells obtained <b>(Chris)</b>", reversed: true },
                                    { offset: 0x283, bit: 1, label: "Clip obtained <b>(Jill)</b>", reversed: true },
                                  ],
                                },
                              ],
                            },
                            {
                              name: "Study",
                              items: [
                                {
                                  type: "bitflags",
                                  flags: [
                                    { offset: 0x2b6, bit: 5, label: "Visited", separator: true },
                                    { offset: 0x237, bit: 0, label: "Researcher's Will on the desk <b>(Chris)</b>", hidden: true },
                                    { offset: 0x27d, bit: 7, label: "Researcher's Will related", reversed: true, hidden: true },
                                    { offset: 0x2a1, bit: 5, label: "Fish tank emptied", separator: true },
                                    { offset: 0x290, bit: 7, label: "Ink Ribbon obtained", reversed: true },
                                    { offset: 0x27e, bit: 0, label: "Shells obtained <b>(Chris)</b>", reversed: true },
                                    { offset: 0x27e, bit: 0, label: "Explosive R. obtained <b>(Jill)</b>", reversed: true },
                                  ],
                                },
                              ],
                            },
                            {
                              name: "Lesson Room Entry",
                              items: [
                                {
                                  type: "bitflags",
                                  flags: [
                                    { offset: 0x2b6, bit: 4, label: "Visited", separator: true },
                                    { offset: 0x254, bit: 6, label: "Door to Lesson Room unlocked", separator: true },
                                    { offset: 0x2a2, bit: 6, label: "Fire extinguished" },
                                    { offset: 0x2a2, bit: 7, label: "Map above fireplace revealed", separator: true },
                                    { offset: 0x25c, bit: 4, label: "Zombie dead" },
                                    { offset: 0x25c, bit: 5, label: "Zombie dead", separator: true },
                                    { offset: 0x293, bit: 5, label: "Green Herb obtained", reversed: true },
                                    { offset: 0x27d, bit: 6, label: "Map of Mansion 2F obtained", reversed: true },
                                  ],
                                },
                              ],
                            },
                            {
                              name: "Lesson Room",
                              items: [
                                {
                                  type: "bitflags",
                                  flags: [
                                    { offset: 0x2b6, bit: 3, label: "Visited", separator: true },
                                    { offset: 0x254, bit: 6, label: "Door to Lesson Room Entry unlocked", separator: true },
                                    { offset: 0x2a7, bit: 0, label: "Hole in the floor to Isolated Passage", separator: true },
                                    { offset: 0x260, bit: 1, label: "Yawn dead", separator: true },
                                    { offset: 0x285, bit: 1, label: "Pass Number obtained <b>(Jill)</b>", reversed: true },
                                  ],
                                },
                              ],
                            },
                          ],
                        },
                      ],
                    },
                    {
                      name: "Mansion B1",
                      items: [
                        {
                          type: "tabs",
                          vertical: true,
                          items: [
                            {
                              name: "Underground Passage 1",
                              items: [
                                {
                                  type: "bitflags",
                                  flags: [
                                    { offset: 0x2b4, bit: 5, label: "Visited", separator: true },
                                    { offset: 0x26f, bit: 7, label: "Zombie dead" },
                                    { offset: 0x271, bit: 3, label: "Zombie dead", separator: true },
                                    { offset: 0x294, bit: 4, label: "Shells obtained", reversed: true },
                                  ],
                                },
                              ],
                            },
                            {
                              name: "Underground Passage 2",
                              items: [
                                {
                                  type: "bitflags",
                                  flags: [
                                    { offset: 0x2b4, bit: 4, label: "Visited", separator: true },
                                    { offset: 0x254, bit: 4, label: "Door to Kitchen unlocked", separator: true },
                                    { offset: 0x26b, bit: 4, label: "Zombies dead", separator: true },
                                    { offset: 0x284, bit: 2, label: "Green Herb obtained", reversed: true },
                                    { offset: 0x295, bit: 2, label: "Green Herb obtained", reversed: true },
                                  ],
                                },
                              ],
                            },
                            {
                              name: "Kitchen",
                              items: [
                                {
                                  type: "bitflags",
                                  flags: [
                                    { offset: 0x2b4, bit: 3, label: "Visited", separator: true },
                                    { offset: 0x254, bit: 4, label: "Door to Underground Passage 2 unlocked", separator: true },
                                    { offset: 0x26a, bit: 3, label: "Zombie dead" },
                                    { offset: 0x26a, bit: 4, label: "Zombie dead", separator: true },
                                    { offset: 0x29b, bit: 3, label: "Desk Key obtained <b>(Chris)</b>", reversed: true },
                                  ],
                                },
                              ],
                            },
                            {
                              name: "Elevator Stairway",
                              items: [
                                {
                                  type: "bitflags",
                                  flags: [
                                    { offset: 0x2b4, bit: 1, label: "Visited" },
                                  ],
                                },
                              ],
                            },
                          ],
                        },
                      ],
                    },
                    {
                      name: "Courtyard 1F",
                      items: [
                        {
                          type: "tabs",
                          vertical: true,
                          items: [
                            {
                              name: "General",
                              items: [
                                {
                                  type: "bitflags",
                                  flags: [
                                    { offset: 0x2bc, bit: 1, label: "Map Revealed" },
                                  ],
                                },
                              ],
                            },
                            {
                              name: "Courtyard Garden",
                              items: [
                                {
                                  type: "bitflags",
                                  flags: [
                                    { offset: 0x2b4, bit: 0, label: "Visited", separator: true },
                                    { offset: 0x2a5, bit: 6, label: "Elevator to Falls down", separator: true },
                                    { offset: 0x261, bit: 6, label: "Cerberus dead" },
                                    { offset: 0x261, bit: 7, label: "Cerberus dead" },
                                    { offset: 0x261, bit: 5, label: "Cerberus dead <b>(Chris)</b>", separator: true },
                                    { offset: 0x286, bit: 0, label: "Map of Courtyard 1F obtained", reversed: true },
                                    { offset: 0x290, bit: 4, label: "Green Herb obtained", reversed: true },
                                    { offset: 0x290, bit: 5, label: "Green Herb obtained", reversed: true },
                                    { offset: 0x290, bit: 6, label: "Green Herb obtained", reversed: true },
                                    { offset: 0x290, bit: 2, label: "Red Herb obtained", reversed: true },
                                    { offset: 0x290, bit: 3, label: "Red Herb obtained", reversed: true },
                                    { offset: 0x290, bit: 0, label: "Blue Herb obtained", reversed: true },
                                    { offset: 0x297, bit: 7, label: "Blue Herb obtained", reversed: true },
                                  ],
                                },
                              ],
                            },
                            {
                              name: "Water Gate",
                              items: [
                                {
                                  type: "bitflags",
                                  flags: [
                                    { offset: 0x2bb, bit: 7, label: "Visited", separator: true },
                                    { offset: 0x2a5, bit: 7, label: "Elevator to Falls down" },
                                    { offset: 0x2a6, bit: 0, label: "Pool emptied" },
                                    { offset: 0x2a9, bit: 5, label: "Pool emptied for the first time" },
                                  ],
                                },
                              ],
                            },
                            {
                              name: "Falls",
                              items: [
                                {
                                  type: "bitflags",
                                  flags: [
                                    { offset: 0x2bb, bit: 6, label: "Visited", separator: true },
                                    { offset: 0x2a5, bit: 5, label: "Battery placed" },
                                    { offset: 0x2a5, bit: 6, label: "Elevator to Courtyard Garden up" },
                                    { offset: 0x2a5, bit: 7, label: "Elevator to Water Gate up", separator: true },
                                    { offset: 0x272, bit: 4, label: "Cerberus dead" },
                                    { offset: 0x272, bit: 5, label: "Cerberus dead" },
                                    { offset: 0x272, bit: 3, label: "Cerberus dead <b>(Chris)</b>", separator: true },
                                  ],
                                },
                              ],
                            },
                            {
                              name: "Guardhouse Gate",
                              items: [
                                {
                                  type: "bitflags",
                                  flags: [
                                    { offset: 0x2bb, bit: 4, label: "Visited", separator: true },
                                    { offset: 0x261, bit: 1, label: "Cerberus dead" },
                                    { offset: 0x261, bit: 2, label: "Cerberus dead" },
                                    { offset: 0x261, bit: 0, label: "Cerberus dead <b>(Chris)</b>", separator: true },
                                    { offset: 0x297, bit: 5, label: "Green Herb obtained", reversed: true },
                                    { offset: 0x297, bit: 6, label: "Green Herb obtained", reversed: true },
                                    { offset: 0x297, bit: 3, label: "Blue Herb obtained", reversed: true },
                                    { offset: 0x297, bit: 4, label: "Blue Herb obtained", reversed: true },
                                  ],
                                },
                              ],
                            },
                            {
                              name: "Fountain",
                              items: [
                                {
                                  type: "bitflags",
                                  flags: [
                                    { offset: 0x2bb, bit: 3, label: "Visited", separator: true },
                                    { offset: 0x2a0, bit: 3, label: "Wolf Medal placed" },
                                    { offset: 0x2a0, bit: 4, label: "Eagle Medal placed" },
                                    { offset: 0x2a0, bit: 2, label: "Fountain emptied", separator: true },
                                    { offset: 0x296, bit: 3, label: "Green Herb obtained", reversed: true },
                                    { offset: 0x296, bit: 4, label: "Green Herb obtained", reversed: true },
                                    { offset: 0x296, bit: 1, label: "Blue Herb obtained", reversed: true },
                                    { offset: 0x296, bit: 2, label: "Blue Herb obtained", reversed: true },
                                  ],
                                },
                              ],
                            },
                            {
                              name: "Heliport",
                              items: [
                                {
                                  type: "bitflags",
                                  flags: [
                                    { offset: 0x2a6, bit: 4, label: "2nd battle with Tyrant possible", separator: true },
                                    { offset: 0x264, bit: 6, label: "Tyrant dead", separator: true },
                                    { offset: 0x286, bit: 6, label: "Flare obtained", reversed: true },
                                    { offset: 0x287, bit: 0, label: "R. Launcher obtained", reversed: true },
                                  ],
                                },
                              ],
                            },
                          ],
                        },
                      ],
                    },
                    {
                      name: "Courtyard B1",
                      items: [
                        {
                          type: "tabs",
                          vertical: true,
                          items: [
                            {
                              name: "General",
                              items: [
                                {
                                  type: "bitflags",
                                  flags: [
                                    { offset: 0x2bc, bit: 0, label: "Map Revealed" },
                                  ],
                                },
                              ],
                            },
                            {
                              name: "Underground Entry",
                              items: [
                                {
                                  type: "bitflags",
                                  flags: [
                                    { offset: 0x2bb, bit: 1, label: "Visited", separator: true },
                                    { offset: 0x25b, bit: 0, label: "Door to Boulder Passage 1 unlocked <b>(Chris)</b>", separator: true },
                                    { offset: 0x23f, bit: 0, label: "Hole closed" },
                                  ],
                                },
                              ],
                            },
                            {
                              name: "Branched Passage",
                              items: [
                                {
                                  type: "bitflags",
                                  flags: [
                                    { offset: 0x2bb, bit: 0, label: "Visited", separator: true },
                                    { offset: 0x28c, bit: 5, label: "Flamethrower on the wall <b>(Chris)</b>", separator: true },
                                    { offset: 0x266, bit: 2, label: "Hunter dead" },
                                    { offset: 0x266, bit: 3, label: "Hunter dead" },
                                    { offset: 0x266, bit: 4, label: "Hunter dead" },
                                  ],
                                },
                              ],
                            },
                            {
                              name: "Generator Room",
                              items: [
                                {
                                  type: "bitflags",
                                  flags: [
                                    { offset: 0x2ba, bit: 7, label: "Visited", separator: true },
                                    { offset: 0x266, bit: 0, label: "Hunter dead" },
                                    { offset: 0x266, bit: 1, label: "Hunter dead", separator: true },
                                    { offset: 0x298, bit: 7, label: "F.-Aid Spray obtained", reversed: true },
                                    { offset: 0x296, bit: 5, label: "Shells obtained <b>(Chris)</b>", reversed: true },
                                    { offset: 0x282, bit: 2, label: "Explosive R. obtained <b>(Jill)</b>", reversed: true },
                                  ],
                                },
                              ],
                            },
                            {
                              name: "Enrico Room",
                              items: [
                                {
                                  type: "bitflags",
                                  flags: [
                                    { offset: 0x2ba, bit: 6, label: "Visited", separator: true },
                                    { offset: 0x265, bit: 6, label: "Hunter dead <b>(Chris)</b>" },
                                    { offset: 0x265, bit: 7, label: "Hunter dead <b>(Chris)</b>", separator: true },
                                    { offset: 0x282, bit: 1, label: "Hex. Crank obtained", reversed: true },
                                    { offset: 0x298, bit: 3, label: "Clip obtained", reversed: true },
                                  ],
                                },
                              ],
                            },
                            {
                              name: "Boulder Passage 1",
                              items: [
                                {
                                  type: "bitflags",
                                  flags: [
                                    { offset: 0x2ba, bit: 5, label: "Visited" },
                                    { offset: 0x2b9, bit: 7, label: "Secret room visited", separator: true },
                                    { offset: 0x25b, bit: 0, label: "Door to Underground Entry unlocked <b>(Chris)</b>", separator: true },
                                    { offset: 0x2a4, bit: 2, label: "Boulder rolled" },
                                    { offset: 0x2af, bit: 5, label: "Boulder rolled related", hidden: true },
                                    { offset: 0x28c, bit: 6, label: "Flamethrower on the wall <b>(Chris)</b>", separator: true },
                                    { offset: 0x268, bit: 4, label: "Hunter dead" },
                                    { offset: 0x268, bit: 5, label: "Hunter dead", separator: true },
                                    { offset: 0x288, bit: 2, label: "Magnum Rounds obtained <b>(Chris)</b>", reversed: true },
                                    { offset: 0x288, bit: 1, label: "Flame Rounds obtained <b>(Jill)</b>", reversed: true },
                                  ],
                                },
                              ],
                            },
                            {
                              name: "Black Tiger Room",
                              items: [
                                {
                                  type: "bitflags",
                                  flags: [
                                    { offset: 0x2ba, bit: 4, label: "Visited", separator: true },
                                    { offset: 0x26e, bit: 5, label: "Web on the door removed", separator: true },
                                    { offset: 0x26e, bit: 6, label: "Black Spider dead", separator: true },
                                    { offset: 0x299, bit: 1, label: "Combat Knife obtained", reversed: true },
                                    { offset: 0x298, bit: 5, label: "Ink Ribbon obtained <b>(Jill)</b>", reversed: true },
                                  ],
                                },
                              ],
                            },
                            {
                              name: "Straight Passage",
                              items: [
                                {
                                  type: "bitflags",
                                  flags: [
                                    { offset: 0x2ba, bit: 3, label: "Visited", separator: true },
                                    { offset: 0x25a, bit: 0, label: "Door to Boulder Passage 2 unlocked <b>(Chris)</b>", separator: true },
                                    { offset: 0x292, bit: 3, label: "Flamethrower on the wall <b>(Chris)</b>" },
                                  ],
                                },
                              ],
                            },
                            {
                              name: "Underground Save Room",
                              items: [
                                {
                                  type: "bitflags",
                                  flags: [
                                    { offset: 0x2ba, bit: 2, label: "Visited", separator: true },
                                    { offset: 0x299, bit: 7, label: "Ink Ribbon obtained", reversed: true },
                                    { offset: 0x29a, bit: 0, label: "F.-Aid Spray obtained", reversed: true },
                                    { offset: 0x29a, bit: 3, label: "Blue Herb obtained", reversed: true },
                                  ],
                                },
                              ],
                            },
                            {
                              name: "Boulder Passage 2",
                              items: [
                                {
                                  type: "bitflags",
                                  flags: [
                                    { offset: 0x2ba, bit: 1, label: "Visited" },
                                    { offset: 0x2b9, bit: 6, label: "Secret room visited", separator: true },
                                    { offset: 0x25a, bit: 0, label: "Door to Straight Passage unlocked <b>(Chris)</b>", separator: true },
                                    { offset: 0x2aa, bit: 4, label: "Position of hole (00 ^, 01 >, 10 v, 11 <)", hidden: true },
                                    { offset: 0x2aa, bit: 5, label: "Position of hole (00 ^, 01 >, 10 v, 11 <)", hidden: true },
                                    { offset: 0x2aa, bit: 3, label: "Boulder rolled", separator: true },
                                    { offset: 0x289, bit: 1, label: "Map of Courtyard B1 obtained", reversed: true },
                                    { offset: 0x298, bit: 4, label: "MO Disk obtained", reversed: true },
                                  ],
                                },
                              ],
                            },
                            {
                              name: "Item Chamber",
                              items: [
                                {
                                  type: "bitflags",
                                  flags: [
                                    { offset: 0x2bb, bit: 2, label: "Visited", separator: true },
                                    { offset: 0x2a4, bit: 3, label: "Wall pushed", separator: true },
                                    { offset: 0x289, bit: 0, label: "Doom Book 2 obtained", reversed: true },
                                  ],
                                },
                              ],
                            },
                          ],
                        },
                      ],
                    },
                    {
                      name: "Guardhouse 1F",
                      items: [
                        {
                          type: "tabs",
                          vertical: true,
                          items: [
                            {
                              name: "General",
                              items: [
                                {
                                  type: "bitflags",
                                  flags: [
                                    { offset: 0x2c3, bit: 7, label: "Map Revealed" },
                                  ],
                                },
                              ],
                            },
                            {
                              name: "Guardhouse Entry",
                              items: [
                                {
                                  type: "bitflags",
                                  flags: [
                                    { offset: 0x2b9, bit: 5, label: "Visited", separator: true },
                                    { offset: 0x28c, bit: 2, label: "Blue Herb obtained", reversed: true },
                                    { offset: 0x295, bit: 5, label: "Blue Herb obtained", reversed: true },
                                    { offset: 0x295, bit: 6, label: "Blue Herb obtained", reversed: true },
                                  ],
                                },
                              ],
                            },
                            {
                              name: "Guardhouse Save Room",
                              items: [
                                {
                                  type: "bitflags",
                                  flags: [
                                    { offset: 0x2b9, bit: 2, label: "Visited", separator: true },
                                    { offset: 0x291, bit: 3, label: "F.-Aid Spray obtained", reversed: true },
                                    { offset: 0x293, bit: 1, label: "Clip obtained <b>(Chris)</b>", reversed: true },
                                    { offset: 0x293, bit: 0, label: "Explosive R. obtained <b>(Jill)</b>", reversed: true },
                                  ],
                                },
                              ],
                            },
                            {
                              name: "Room 001",
                              items: [
                                {
                                  type: "bitflags",
                                  flags: [
                                    { offset: 0x2b9, bit: 4, label: "Visited", separator: true },
                                    { offset: 0x25b, bit: 6, label: "Desk unlocked", separator: true },
                                    { offset: 0x270, bit: 7, label: "Zombie dead" },
                                    { offset: 0x271, bit: 0, label: "Zombie dead", separator: true },
                                    { offset: 0x28b, bit: 4, label: "Blank Book obtained", reversed: true },
                                    { offset: 0x293, bit: 2, label: "Shells obtained", reversed: true },
                                    { offset: 0x28b, bit: 3, label: "Desk Key obtained <b>(Chris)</b>", reversed: true },
                                  ],
                                },
                              ],
                            },
                            {
                              name: "Room 001 Bathroom",
                              items: [
                                {
                                  type: "bitflags",
                                  flags: [
                                    { offset: 0x2b9, bit: 3, label: "Visited", separator: true },
                                    { offset: 0x2ab, bit: 4, label: "Bathtub unplugged", separator: true },
                                    { offset: 0x28c, bit: 3, label: "C. Room Key obtained", reversed: true },
                                  ],
                                },
                              ],
                            },
                            {
                              name: "Rec Room",
                              items: [
                                {
                                  type: "bitflags",
                                  flags: [
                                    { offset: 0x2b9, bit: 1, label: "Visited", separator: true },
                                    { offset: 0x268, bit: 2, label: "Web Spinners dead" },
                                    { offset: 0x268, bit: 3, label: "Web Spinners dead", separator: true },
                                    { offset: 0x291, bit: 1, label: "Ink Ribbon obtained", reversed: true },
                                    { offset: 0x288, bit: 0, label: "Clip obtained", reversed: true },
                                  ],
                                },
                              ],
                            },
                            {
                              name: "Central Corridor",
                              items: [
                                {
                                  type: "bitflags",
                                  flags: [
                                    { offset: 0x2b9, bit: 0, label: "Visited", separator: true },
                                    { offset: 0x25a, bit: 6, label: "Door to Room 002 unlocked", separator: true },
                                    { offset: 0x28a, bit: 3, label: "Green Herb obtained", reversed: true },
                                    { offset: 0x28a, bit: 4, label: "Green Herb obtained", reversed: true },
                                    { offset: 0x28a, bit: 5, label: "Green Herb obtained", reversed: true },
                                  ],
                                },
                              ],
                            },
                            {
                              name: "Room 002",
                              items: [
                                {
                                  type: "bitflags",
                                  flags: [
                                    { offset: 0x2b8, bit: 7, label: "Visited", separator: true },
                                    { offset: 0x25b, bit: 5, label: "Desk unlocked", separator: true },
                                    { offset: 0x25a, bit: 6, label: "Door to Central Corridor unlocked" },
                                    { offset: 0x2a4, bit: 1, label: "Map of Guardhouse 1F related", hidden: true },
                                    { offset: 0x2ab, bit: 2, label: "Shelfs moved", separator: true },
                                    { offset: 0x27c, bit: 6, label: "Shells obtained", reversed: true },
                                    { offset: 0x28f, bit: 0, label: "Map of Guardhouse 1F obtained", reversed: true },
                                    { offset: 0x28f, bit: 1, label: "Plant 42 Report obtained", reversed: true },
                                  ],
                                },
                              ],
                            },
                            {
                              name: "Room 002 Bathroom",
                              items: [
                                {
                                  type: "bitflags",
                                  flags: [
                                    { offset: 0x2b8, bit: 6, label: "Visited", separator: true },
                                    { offset: 0x271, bit: 1, label: "Zombie dead", separator: true },
                                    { offset: 0x28a, bit: 2, label: "Clip obtained", reversed: true },
                                  ],
                                },
                              ],
                            },
                            {
                              name: "Beehive Passage",
                              items: [
                                {
                                  type: "bitflags",
                                  flags: [
                                    { offset: 0x2b8, bit: 5, label: "Visited", separator: true },
                                    { offset: 0x25a, bit: 5, label: "Door to Room 003 unlocked" },
                                    { offset: 0x2a7, bit: 6, label: "Door to Drug Storeroom unlocked", separator: true },
                                    { offset: 0x286, bit: 7, label: "002 Key obtained", reversed: true },
                                  ],
                                },
                              ],
                            },
                            {
                              name: "Drug Storeroom",
                              items: [
                                {
                                  type: "bitflags",
                                  flags: [
                                    { offset: 0x2b8, bit: 4, label: "Visited", separator: true },
                                    { offset: 0x2a7, bit: 6, label: "Door to Beehive Passage unlocked", separator: true },
                                    { offset: 0x280, bit: 0, label: "Empty Bottle obtained", reversed: true },
                                    { offset: 0x280, bit: 1, label: "Empty Bottle obtained", reversed: true },
                                    { offset: 0x280, bit: 2, label: "Empty Bottle obtained", reversed: true },
                                    { offset: 0x280, bit: 3, label: "Empty Bottle obtained", reversed: true },
                                  ],
                                },
                              ],
                            },
                            {
                              name: "Room 003",
                              items: [
                                {
                                  type: "bitflags",
                                  flags: [
                                    { offset: 0x2b8, bit: 3, label: "Visited", separator: true },
                                    { offset: 0x25a, bit: 5, label: "Door to Beehive Passage unlocked" },
                                    { offset: 0x25b, bit: 4, label: "Desk unlocked", separator: true },
                                    { offset: 0x2a7, bit: 2, label: "Bookshelf moved" },
                                    { offset: 0x2a7, bit: 3, label: "Door behind bookshelf openable", separator: true },
                                    { offset: 0x286, bit: 1, label: '"V-Jolt" Report obtained', reversed: true },
                                    { offset: 0x288, bit: 7, label: "Ink Ribbon obtained", reversed: true },
                                  ],
                                },
                              ],
                            },
                            {
                              name: "Room 003 Bathroom",
                              items: [
                                {
                                  type: "bitflags",
                                  flags: [
                                    { offset: 0x2b8, bit: 2, label: "Visited", separator: true },
                                    { offset: 0x270, bit: 6, label: "Zombie dead", separator: true },
                                    { offset: 0x292, bit: 7, label: "Clip obtained <b>(Chris)</b>", reversed: true },
                                    { offset: 0x292, bit: 7, label: "Flame Rounds obtained <b>(Jill)</b>", reversed: true },
                                  ],
                                },
                              ],
                            },
                            {
                              name: "Plant 42 Room",
                              items: [
                                {
                                  type: "bitflags",
                                  flags: [
                                    { offset: 0x2b8, bit: 1, label: "Visited", separator: true },
                                    { offset: 0x2a3, bit: 7, label: "New monsters in the mansion appeared", separator: true },
                                    { offset: 0x26b, bit: 7, label: "Plant 42 dead", separator: true },
                                    { offset: 0x284, bit: 7, label: "Helmet Key obtained", reversed: true },
                                  ],
                                },
                              ],
                            },
                          ],
                        },
                      ],
                    },
                    {
                      name: "Guardhouse B1",
                      items: [
                        {
                          type: "tabs",
                          vertical: true,
                          items: [
                            {
                              name: "General",
                              items: [
                                {
                                  type: "bitflags",
                                  flags: [
                                    { offset: 0x2c3, bit: 7, label: "Map Revealed" },
                                  ],
                                },
                              ],
                            },
                            {
                              name: "Water Tank Entry",
                              items: [
                                {
                                  type: "bitflags",
                                  flags: [
                                    { offset: 0x2b8, bit: 0, label: "Visited", separator: true },
                                    { offset: 0x2a4, bit: 6, label: "Crates moved (both binaries)", hidden: true },
                                    { offset: 0x2a4, bit: 7, label: "Crates moved (both binaries)", hidden: true },
                                    { offset: 0x28c, bit: 0, label: "Green Herb obtained", reversed: true },
                                    { offset: 0x28c, bit: 1, label: "Green Herb obtained", reversed: true },
                                  ],
                                },
                              ],
                            },
                            {
                              name: "Water Tank",
                              items: [
                                {
                                  type: "bitflags",
                                  flags: [
                                    { offset: 0x2bf, bit: 7, label: "Visited", separator: true },
                                    { offset: 0x25a, bit: 4, label: "Door to Control Room unlocked", separator: true },
                                    { offset: 0x25e, bit: 2, label: "Neptune dead" },
                                    { offset: 0x25e, bit: 3, label: "Neptune dead" },
                                    { offset: 0x260, bit: 6, label: "Neptune dead" },
                                  ],
                                },
                              ],
                            },
                            {
                              name: "Meeting Room",
                              items: [
                                {
                                  type: "bitflags",
                                  flags: [
                                    { offset: 0x2bf, bit: 6, label: "Visited", separator: true },
                                    { offset: 0x2a1, bit: 4, label: "V-Jolt used on the plant root", separator: true },
                                    { offset: 0x28a, bit: 6, label: "Desk Key obtained <b>(Chris)</b>", reversed: true },
                                  ],
                                },
                              ],
                            },
                            {
                              name: "Arms Storage",
                              items: [
                                {
                                  type: "bitflags",
                                  flags: [
                                    { offset: 0x2bf, bit: 5, label: "Visited", separator: true },
                                    { offset: 0x25b, bit: 3, label: "Door to Control Room unlocked", separator: true },
                                    { offset: 0x289, bit: 5, label: "003 Key obtained", reversed: true },
                                    { offset: 0x284, bit: 3, label: "Clip obtained", reversed: true },
                                    { offset: 0x289, bit: 7, label: "Clip obtained", reversed: true },
                                    { offset: 0x288, bit: 5, label: "Shells obtained", reversed: true },
                                    { offset: 0x28f, bit: 4, label: "Shells obtained", reversed: true },
                                  ],
                                },
                              ],
                            },
                            {
                              name: "Control Room",
                              items: [
                                {
                                  type: "bitflags",
                                  flags: [
                                    { offset: 0x2bf, bit: 4, label: "Visited", separator: true },
                                    { offset: 0x25a, bit: 4, label: "Door to Water Tank unlocked" },
                                    { offset: 0x25b, bit: 3, label: "Door to Arms Storage unlocked", separator: true },
                                    { offset: 0x2a7, bit: 4, label: "Water emptied" },
                                  ],
                                },
                              ],
                            },
                          ],
                        },
                      ],
                    },
                    {
                      name: "Laboratory B1",
                      items: [
                        {
                          type: "tabs",
                          vertical: true,
                          items: [
                            {
                              name: "Laboratory Entry",
                              items: [
                                {
                                  type: "bitflags",
                                  flags: [
                                    { offset: 0x2bf, bit: 3, label: "Visited", separator: true },
                                    { offset: 0x254, bit: 3, label: "Door to Emergency Tunnel unlocked" },
                                  ],
                                },
                              ],
                            },
                            {
                              name: "Emergency Tunnel",
                              items: [
                                {
                                  type: "bitflags",
                                  flags: [
                                    { offset: 0x2bf, bit: 2, label: "Visited", separator: true },
                                    { offset: 0x254, bit: 3, label: "Door to Laboratory Entry unlocked", separator: true },
                                    { offset: 0x287, bit: 2, label: "Battery obtained", reversed: true },
                                  ],
                                },
                              ],
                            },
                          ],
                        },
                      ],
                    },
                    {
                      name: "Laboratory B2",
                      items: [
                        {
                          type: "tabs",
                          vertical: true,
                          items: [
                            {
                              name: "General",
                              items: [
                                {
                                  type: "bitflags",
                                  flags: [
                                    { offset: 0x2c3, bit: 6, label: "Map Revealed" },
                                  ],
                                },
                              ],
                            },
                            {
                              name: "Ladder Room",
                              items: [
                                {
                                  type: "bitflags",
                                  flags: [
                                    { offset: 0x2bf, bit: 1, label: "Visited" },
                                  ],
                                },
                              ],
                            },
                            {
                              name: "Stairway",
                              items: [
                                {
                                  type: "bitflags",
                                  flags: [
                                    { offset: 0x2bf, bit: 0, label: "Visited", separator: true },
                                    { offset: 0x271, bit: 6, label: "Zombie dead" },
                                    { offset: 0x273, bit: 4, label: "Zombie dead" },
                                    { offset: 0x273, bit: 5, label: "Zombie dead" },
                                    { offset: 0x273, bit: 6, label: "Zombie dead" },
                                    { offset: 0x273, bit: 7, label: "Zombie dead" },
                                    { offset: 0x271, bit: 7, label: "Zombie dead <b>(Chris)</b>", separator: true },
                                    { offset: 0x291, bit: 7, label: "MO Disk obtained", reversed: true },
                                    { offset: 0x291, bit: 5, label: "Green Herb obtained", reversed: true },
                                    { offset: 0x291, bit: 6, label: "Green Herb obtained", reversed: true },
                                  ],
                                },
                              ],
                            },
                            {
                              name: "Visual Data Room",
                              items: [
                                {
                                  type: "bitflags",
                                  flags: [
                                    { offset: 0x2be, bit: 7, label: "Visited", separator: true },
                                    { offset: 0x25b, bit: 2, label: "Door to Small Lab unlocked", separator: true },
                                    { offset: 0x2a4, bit: 0, label: "Slides put on the projector" },
                                    { offset: 0x2af, bit: 1, label: "Secret wall moved", separator: true },
                                    { offset: 0x28e, bit: 6, label: "P. Room Key obtained", reversed: true },
                                    { offset: 0x28e, bit: 7, label: "Security System obtained", reversed: true },
                                  ],
                                },
                              ],
                            },
                          ],
                        },
                      ],
                    },
                    {
                      name: "Laboratory B3",
                      items: [
                        {
                          type: "tabs",
                          vertical: true,
                          items: [
                            {
                              name: "General",
                              items: [
                                {
                                  type: "bitflags",
                                  flags: [
                                    { offset: 0x2c3, bit: 6, label: "Map Revealed" },
                                  ],
                                },
                              ],
                            },
                            {
                              name: "'O' Room",
                              items: [
                                {
                                  type: "bitflags",
                                  flags: [
                                    { offset: 0x2be, bit: 6, label: "Visited", separator: true },
                                    { offset: 0x254, bit: 2, label: "Door to Elevator Entry unlocked" },
                                    { offset: 0x25a, bit: 2, label: "Door to Morgue unlocked", separator: true },
                                    { offset: 0x23c, bit: 3, label: "Alarm on", hidden: true },
                                    { offset: 0x2af, bit: 4, label: "Door to Elevator Entry related", hidden: true },
                                    { offset: 0x260, bit: 0, label: "Zombie dead" },
                                    { offset: 0x266, bit: 5, label: "Zombie dead" },
                                    { offset: 0x266, bit: 6, label: "Zombie dead" },
                                    { offset: 0x266, bit: 7, label: "Zombie dead" },
                                    { offset: 0x267, bit: 0, label: "Zombie dead" },
                                    { offset: 0x267, bit: 1, label: "Zombie dead" },
                                    { offset: 0x267, bit: 2, label: "Zombie dead" },
                                    { offset: 0x267, bit: 3, label: "Zombie dead" },
                                    { offset: 0x267, bit: 4, label: "Zombie dead" },
                                    { offset: 0x267, bit: 5, label: "Zombie dead" },
                                    { offset: 0x267, bit: 6, label: "Zombie dead" },
                                    { offset: 0x267, bit: 7, label: "Zombie dead" },
                                    { offset: 0x273, bit: 2, label: "Chimera dead" },
                                    { offset: 0x273, bit: 3, label: "Chimera dead", separator: true },
                                    { offset: 0x296, bit: 6, label: "Ink Ribbon obtained <b>(Jill)</b>", reversed: true },
                                  ],
                                },
                              ],
                            },
                            {
                              name: "Small Lab",
                              items: [
                                {
                                  type: "bitflags",
                                  flags: [
                                    { offset: 0x2be, bit: 5, label: "Visited", separator: true },
                                    { offset: 0x25b, bit: 1, label: "Door to Private Room unlocked" },
                                    { offset: 0x25b, bit: 2, label: "Door to Visual Data Room unlocked", separator: true },
                                    { offset: 0x291, bit: 4, label: "Slides obtained", reversed: true },
                                  ],
                                },
                              ],
                            },
                            {
                              name: "Morgue",
                              items: [
                                {
                                  type: "bitflags",
                                  flags: [
                                    { offset: 0x2bc, bit: 5, label: "Visited", separator: true },
                                    { offset: 0x25a, bit: 2, label: "Door to 'O' Room unlocked", separator: true },
                                    { offset: 0x28b, bit: 5, label: "Pass Code 02 obtained", reversed: true },
                                    { offset: 0x28d, bit: 3, label: "Magnum Rounds obtained", reversed: true },
                                  ],
                                },
                              ],
                            },
                            {
                              name: "Private Corridor",
                              items: [
                                {
                                  type: "bitflags",
                                  flags: [
                                    { offset: 0x2be, bit: 3, label: "Visited", separator: true },
                                    { offset: 0x2a5, bit: 3, label: "Pass Code 01 entered" },
                                    { offset: 0x2a5, bit: 2, label: "Pass Code 02 entered" },
                                    { offset: 0x2a5, bit: 1, label: "Pass Code 03 entered" },
                                    { offset: 0x2a9, bit: 7, label: "Pass Codes related", hidden: true },
                                  ],
                                },
                              ],
                            },
                            {
                              name: "Private Room",
                              items: [
                                {
                                  type: "bitflags",
                                  flags: [
                                    { offset: 0x2be, bit: 2, label: "Visited", separator: true },
                                    { offset: 0x25b, bit: 1, label: "Door to Small Lab unlocked", separator: true },
                                    { offset: 0x264, bit: 0, label: "Zombie dead" },
                                    { offset: 0x264, bit: 1, label: "Zombie dead" },
                                    { offset: 0x264, bit: 2, label: "Zombie dead" },
                                    { offset: 0x264, bit: 3, label: "Zombie dead", separator: true },
                                    { offset: 0x285, bit: 4, label: "Fax obtained", reversed: true },
                                    { offset: 0x285, bit: 5, label: "Pass Code 01 obtained", reversed: true },
                                    { offset: 0x29b, bit: 1, label: "Ink Ribbon obtained", reversed: true },
                                  ],
                                },
                              ],
                            },
                            {
                              name: "X-Ray Room",
                              items: [
                                {
                                  type: "bitflags",
                                  flags: [
                                    { offset: 0x2be, bit: 1, label: "Visited", separator: true },
                                    { offset: 0x285, bit: 6, label: "Researcher's Letter obtained", reversed: true },
                                    { offset: 0x293, bit: 4, label: "Clip obtained", reversed: true },
                                    { offset: 0x29b, bit: 2, label: "Clip obtained", reversed: true },
                                    { offset: 0x293, bit: 3, label: "Green Herb obtained", reversed: true },
                                  ],
                                },
                              ],
                            },
                            {
                              name: "Cell Entry",
                              items: [
                                {
                                  type: "bitflags",
                                  flags: [
                                    { offset: 0x2be, bit: 0, label: "Visited", separator: true },
                                    { offset: 0x25a, bit: 3, label: "Door to Cell unlocked" },
                                  ],
                                },
                              ],
                            },
                            {
                              name: "Cell",
                              items: [
                                {
                                  type: "bitflags",
                                  flags: [
                                    { offset: 0x2bd, bit: 1, label: "Visited", separator: true },
                                    { offset: 0x25a, bit: 3, label: "Door to Cell Entry unlocked" },
                                  ],
                                },
                              ],
                            },
                            {
                              name: "Elevator Entry",
                              items: [
                                {
                                  type: "bitflags",
                                  flags: [
                                    { offset: 0x2bd, bit: 7, label: "Visited", separator: true },
                                    { offset: 0x254, bit: 2, label: "Door to 'O' Room unlocked", separator: true },
                                    { offset: 0x2af, bit: 3, label: "Elevator related", hidden: true },
                                    { offset: 0x2a3, bit: 6, label: "Switch of elevator pressed", separator: true },
                                    { offset: 0x265, bit: 4, label: "Zombie dead" },
                                    { offset: 0x265, bit: 5, label: "Zombie dead" },
                                    { offset: 0x265, bit: 3, label: "Zombie dead <b>(Chris)</b>" },
                                  ],
                                },
                              ],
                            },
                            {
                              name: "Operating Room",
                              items: [
                                {
                                  type: "bitflags",
                                  flags: [
                                    { offset: 0x2be, bit: 4, label: "Visited", separator: true },
                                    { offset: 0x288, bit: 3, label: "Shells obtained", reversed: true },
                                    { offset: 0x288, bit: 4, label: "Red Herb obtained", reversed: true },
                                  ],
                                },
                              ],
                            },
                            {
                              name: "Lab Save Room",
                              items: [
                                {
                                  type: "bitflags",
                                  flags: [
                                    { offset: 0x2bd, bit: 5, label: "Visited", separator: true },
                                    { offset: 0x29a, bit: 4, label: "Ink Ribbon obtained", reversed: true },
                                    { offset: 0x29a, bit: 7, label: "Green Herb obtained", reversed: true },
                                    { offset: 0x29a, bit: 6, label: "Blue Herb obtained", reversed: true },
                                    { offset: 0x29a, bit: 5, label: "Magnum Rounds obtained <b>(Chris)</b>", reversed: true },
                                    { offset: 0x29a, bit: 5, label: "Flame Rounds obtained <b>(Jill)</b>", reversed: true },
                                  ],
                                },
                              ],
                            },
                            {
                              name: "Power Maze 1",
                              items: [
                                {
                                  type: "bitflags",
                                  flags: [
                                    { offset: 0x2bd, bit: 4, label: "Visited", separator: true },
                                    { offset: 0x2a6, bit: 1, label: "Blacked-out areas activated", separator: true },
                                    { offset: 0x268, bit: 6, label: "Chimera dead" },
                                    { offset: 0x268, bit: 7, label: "Chimera dead" },
                                    { offset: 0x271, bit: 5, label: "Chimera dead <b>(Chris)</b>" },
                                  ],
                                },
                              ],
                            },
                            {
                              name: "Power Maze 2",
                              items: [
                                {
                                  type: "bitflags",
                                  flags: [
                                    { offset: 0x2bd, bit: 3, label: "Visited", separator: true },
                                    { offset: 0x271, bit: 4, label: "Chimera dead", hidden: true },
                                    { offset: 0x26b, bit: 5, label: "Chimera dead" },
                                    { offset: 0x26b, bit: 6, label: "Chimera dead", separator: true },
                                    { offset: 0x284, bit: 5, label: "Pass Code 03 obtained", reversed: true },
                                  ],
                                },
                              ],
                            },
                            {
                              name: "Power Room",
                              items: [
                                {
                                  type: "bitflags",
                                  flags: [
                                    { offset: 0x2bd, bit: 2, label: "Visited", separator: true },
                                    { offset: 0x2a6, bit: 2, label: "Power for the elevator activated" },
                                  ],
                                },
                              ],
                            },
                          ],
                        },
                      ],
                    },
                    {
                      name: "Laboratory B4",
                      items: [
                        {
                          type: "tabs",
                          vertical: true,
                          items: [
                            {
                              name: "Main Lab Entry",
                              items: [
                                {
                                  type: "bitflags",
                                  flags: [
                                    { offset: 0x2bc, bit: 7, label: "Visited" },
                                    { offset: 0x23c, bit: 5, label: "After Tyrant battle related", hidden: true },
                                  ],
                                },
                              ],
                            },
                            {
                              name: "Main Lab",
                              items: [
                                {
                                  type: "bitflags",
                                  flags: [
                                    { offset: 0x2bd, bit: 0, label: "Visited", separator: true },
                                    { offset: 0x2a5, bit: 0, label: "Tyrant defeated", hidden: true },
                                    { offset: 0x269, bit: 7, label: "Tyrant defeated", separator: true },
                                    { offset: 0x284, bit: 0, label: "Master Key obtained", reversed: true },
                                  ],
                                },
                              ],
                            },
                          ],
                        },
                      ],
                    },
                    {
                      name: "Miscellaneous",
                      hidden: true,
                      items: [
                        {
                          type: "bitflags",
                          flags: [
                            { offset: 0x2bd, bit: 6, label: "Laboratory B1/Heliport Elevator Visited" },
                            { offset: 0x2bc, bit: 6, label: "Laboratory B3/B4: Elevator Visited" },
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
    },
  ],
  resources: {
    characters: {
      0x0: "Chris Redfield",
      0x1: "Jill Valentine",
    },
    conditions: {
      0x0: "-",
      0x1: "Poisoned",
    },
    items: {
      0x0: "-",
      0x1: "Combat Knife",
      0x2: "Beretta",
      0x3: "Shotgun",
      0x4: "Colt Python (Dumdum Rounds)",
      0x5: "Colt Python (Magnum Rounds)",
      0x6: "Flamethrower",
      0x7: "Bazooka (Explosive R.)",
      0x8: "Bazooka (Acid Rounds)",
      0x9: "Bazooka (Flame Rounds)",
      0xa: "R. Launcher",
      0xb: "Clip",
      0xc: "Shells",
      0xd: "Dumdum Rounds",
      0xe: "Magnum Rounds",
      0xf: "Fuel",
      0x10: "Explosive R.",
      0x11: "Acid Rounds",
      0x12: "Flame Rounds",
      0x13: "Empty Bottle",
      0x14: "Water",
      0x15: "UMB No. 2",
      0x16: "UMB No. 4",
      0x17: "UMB No. 7",
      0x18: "UMB No. 13",
      0x19: "Yellow-6",
      0x1a: "NP-003",
      0x1b: "V-Jolt",
      0x1c: "Broken Shotgun",
      0x1d: "Square Crank",
      0x1e: "Hex. Crank",
      0x1f: "Emblem",
      0x20: "Gold Emblem",
      0x21: "Blue Jewel",
      0x22: "Red Jewel",
      0x23: "Music Notes",
      0x24: "Wolf Medal",
      0x25: "Eagle Medal",
      0x26: "Herbicide",
      0x27: "Battery",
      0x28: "MO Disk",
      0x29: "Wind Crest",
      0x2a: "Flare",
      0x2b: "Slides",
      0x2c: "Moon Crest",
      0x2d: "Star Crest",
      0x2e: "Sun Crest",
      0x2f: "Ink Ribbon",
      0x30: "Lighter",
      0x31: "Lockpick",
      // 0x32: "", // Unused
      0x33: "Sword Key",
      0x34: "Armor Key",
      0x35: "Shield Key",
      0x36: "Helmet Key",
      0x37: "Master Key",
      0x38: "Closet Key",
      0x39: "002 Key",
      0x3a: "003 Key",
      0x3b: "C. Room Key",
      0x3c: "P. Room Key",
      0x3d: "Desk Key",
      0x3e: "Blank Book",
      0x3f: "Doom Book 2",
      0x40: "Doom Book 1",
      0x41: "F.-Aid Spray",
      0x42: "Serum",
      0x43: "Red Herb",
      0x44: "Green Herb",
      0x45: "Blue Herb",
      0x46: "Mixed Herbs (Green + Red)",
      0x47: "Mixed Herbs (Green + Green)",
      0x48: "Mixed Herbs (Green + Blue)",
      0x49: "Mixed Herbs (Green + Red + Blue)",
      0x4a: "Mixed Herbs (Green + Green + Green)",
      0x4b: "Mixed Herbs (Green + Green + Blue)",
    },
    locations: {
      0x0: "Mansion 1F Save Room",
      0x6: "Mansion 1F: Main Hall",
      0x18: "Mansion 1F: Storeroom",
      0x207: "Courtyard B1: Underground Entry",
      0x20e: "Courtyard B1: Underground Save Room",
      0x303: "Guardhouse 1F: Save Room",
      0x40e: "Laboratory B3: Save Room",
      0x500: "Mansion 1F Save Room (after Plant 42)",
      0x506: "Mansion 1F: Main Hall (after Plant 42)",
      0x518: "Mansion 1F: Storeroom (after Plant 42)",
    },
  },
  resourcesGroups: {
    locations: [
      { name: "Mansion", options: [0x0, 0x6, 0x18, 0x500, 0x506, 0x518] },
      { name: "Guardhouse", options: [0x303] },
      { name: "Courtyard", options: [0x207, 0x20e] },
      { name: "Laboratory", options: [0x40e] },
    ],
  },
  resourcesLabels: {
    items: {
      0x1: "Weapons",
      0xb: "Ammo",
      0x13: "Key Items",
      0x41: "Medicines",
    },
  },
  resourcesOrder: {
    locations: [
      0x6, 0x0, 0x18, 0x506, 0x500, 0x518, 0x303, 0x207, 0x20e, 0x40e,
    ],
  },
};

export default template;
