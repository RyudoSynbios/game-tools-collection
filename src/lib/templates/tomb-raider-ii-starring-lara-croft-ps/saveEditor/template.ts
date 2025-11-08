import type { GameJson, Resource } from "$lib/types";

const template: GameJson = {
  validator: {
    regions: {
      europe: {
        0x0: [
          0x42, 0x45, 0x53, 0x4c, 0x45, 0x53, 0x2d, 0x30, 0x30, 0x37, 0x31,
          0x38, 0x54, 0x4f, 0x4d, 0x42, 0x32,
        ], // "BESLES-00718TOMB2"
      },
      usa: {
        0x0: [
          0x42, 0x41, 0x53, 0x4c, 0x55, 0x53, 0x2d, 0x30, 0x30, 0x34, 0x33,
          0x37, 0x54, 0x4f, 0x4d, 0x42, 0x32,
        ], // "BASLUS-00437TOMB2"
      },
      japan: {
        0x0: [
          0x42, 0x49, 0x53, 0x4c, 0x50, 0x53, 0x2d, 0x30, 0x31, 0x32, 0x30,
          0x30, 0x54, 0x4f, 0x4d, 0x42, 0x32,
        ], // "BISLPS-01200TOMB2"
      },
      france: {
        0x0: [
          0x42, 0x45, 0x53, 0x4c, 0x45, 0x53, 0x2d, 0x30, 0x30, 0x37, 0x31,
          0x39, 0x54, 0x4f, 0x4d, 0x42, 0x32,
        ], // "BESLES-00719TOMB2"
      },
      germany: {
        0x0: [
          0x42, 0x45, 0x53, 0x4c, 0x45, 0x53, 0x2d, 0x30, 0x30, 0x37, 0x32,
          0x30, 0x54, 0x4f, 0x4d, 0x42, 0x32,
        ], // "BESLES-00720TOMB2"
      },
      italy: {
        0x0: [
          0x42, 0x45, 0x53, 0x4c, 0x45, 0x53, 0x2d, 0x30, 0x30, 0x31, 0x30,
          0x37, 0x54, 0x4f, 0x4d, 0x42, 0x32,
        ], // "BESLES-00107TOMB2"
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
      instanceType: "section",
      instances: 1,
      items: [
        {
          name: "Checksum",
          offset: 0x64b,
          type: "checksum",
          dataType: "uint8",
          control: {
            offsetStart: 0x200,
            offsetEnd: 0x1ed0,
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
                      name: "Progression",
                      offset: 0x640,
                      type: "variable",
                      dataType: "uint8",
                      resource: "progressions",
                      hint: "This will also grant access to all weapons and unlimited ammo for all levels.",
                    },
                    {
                      name: "Playtime",
                      type: "group",
                      mode: "time",
                      items: [
                        {
                          id: "total-playtime",
                          offset: 0x244,
                          type: "variable",
                          dataType: "uint32",
                          operations: [
                            { "/": 30 },
                            {
                              convert: {
                                from: "seconds",
                                to: "hours",
                              },
                            },
                          ],
                          leadingZeros: 1,
                          max: 999,
                          disabled: true,
                        },
                        {
                          id: "total-playtime",
                          offset: 0x244,
                          type: "variable",
                          dataType: "uint32",
                          operations: [
                            { "/": 30 },
                            {
                              convert: {
                                from: "seconds",
                                to: "minutes",
                              },
                            },
                          ],
                          leadingZeros: 1,
                          max: 59,
                          disabled: true,
                        },
                        {
                          id: "total-playtime",
                          offset: 0x244,
                          type: "variable",
                          dataType: "uint32",
                          operations: [
                            { "/": 30 },
                            {
                              convert: {
                                from: "seconds",
                                to: "seconds",
                              },
                            },
                          ],
                          leadingZeros: 1,
                          max: 59,
                          disabled: true,
                        },
                      ],
                    },
                    {
                      id: "total-secrets",
                      name: "Secrets",
                      offset: 0x256,
                      type: "variable",
                      dataType: "uint8",
                      disabled: true,
                    },
                  ],
                },
                {
                  type: "section",
                  flex: true,
                  items: [
                    {
                      name: "Unlocked Locations",
                      type: "bitflags",
                      flags: [
                        { offset: 0x240, bit: 0, label: "The Great Wall" },
                        { offset: 0x26c, bit: 0, label: "Venice" },
                        { offset: 0x298, bit: 0, label: "Bartoli's Hideout" },
                        { offset: 0x2c4, bit: 0, label: "Opera House" },
                        { offset: 0x2f0, bit: 0, label: "Offshore Rig" },
                        { offset: 0x31c, bit: 0, label: "Diving Area" },
                        { offset: 0x348, bit: 0, label: "40 Fathoms" },
                        { offset: 0x374, bit: 0, label: "Wreck of the Maria Doria" },
                        { offset: 0x3a0, bit: 0, label: "Living Quarters" },
                        { offset: 0x3cc, bit: 0, label: "The Deck" },
                        { offset: 0x3f8, bit: 0, label: "Tibetan Foothills" },
                        { offset: 0x424, bit: 0, label: "Barkhang Monastery" },
                        { offset: 0x450, bit: 0, label: "Catacombs of the Talion" },
                        { offset: 0x47c, bit: 0, label: "Ice Palace" },
                        { offset: 0x4a8, bit: 0, label: "Temple of Xian" },
                        { offset: 0x4d4, bit: 0, label: "Floating Islands" },
                        { offset: 0x500, bit: 0, label: "The Dragon's Lair" },
                        { offset: 0x52c, bit: 0, label: "Home Sweet Home" },
                      ],
                    },
                  ],
                },
              ],
            },
            {
              name: "Locations",
              items: [
                {
                  id: "locations",
                  length: 0x2c,
                  type: "container",
                  instanceType: "tabs",
                  instances: 18,
                  resource: "locations",
                  vertical: true,
                  prependSubinstance: [
                    {
                      name: "Current Position",
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
                                      id: "gamePending",
                                      name: "Game Pending",
                                      offset: 0x64c,
                                      type: "variable",
                                      dataType: "uint8",
                                      hidden: true,
                                    },
                                    {
                                      id: "location",
                                      name: "Location",
                                      offset: 0x634,
                                      type: "variable",
                                      dataType: "uint16",
                                      resource: "locations",
                                      disabled: true,
                                    },
                                    {
                                      name: "Equipped Weapon",
                                      offset: 0x213,
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
                                      name: "Weapons",
                                      type: "bitflags",
                                      flags: [
                                        { offset: 0x214, bit: 1, label: "Pistols" },
                                        { offset: 0x214, bit: 2, label: "Automatic Pistols" },
                                        { offset: 0x214, bit: 3, label: "Uzis" },
                                        { offset: 0x214, bit: 4, label: "Shotgun" },
                                        { offset: 0x214, bit: 5, label: "M16" },
                                        { offset: 0x214, bit: 6, label: "Grenade Launcher" },
                                        { offset: 0x214, bit: 7, label: "Harpoon Gun" },
                                      ],
                                    },
                                    {
                                      id: "secret-99",
                                      name: "Secrets",
                                      type: "bitflags",
                                      flags: [
                                        { offset: 0x632, bit: 0, label: "Gold Dragon" },
                                        { offset: 0x632, bit: 1, label: "Jade Dragon" },
                                        { offset: 0x632, bit: 2, label: "Stone Dragon" },
                                      ],
                                    },
                                  ],
                                },
                                {
                                  name: "Ammo",
                                  type: "section",
                                  flex: true,
                                  hidden: true,
                                  items: [
                                    {
                                      name: "Pistols",
                                      offset: 0x200,
                                      type: "variable",
                                      dataType: "uint16",
                                      disabled: true,
                                      test: true,
                                    },
                                    {
                                      name: "Automatic Pistols",
                                      offset: 0x202,
                                      type: "variable",
                                      dataType: "uint16",
                                    },
                                    {
                                      name: "Uzi",
                                      offset: 0x204,
                                      type: "variable",
                                      dataType: "uint16",
                                    },
                                    {
                                      name: "Shotgun",
                                      offset: 0x206,
                                      type: "variable",
                                      dataType: "uint16",
                                    },
                                    {
                                      name: "M16",
                                      offset: 0x208,
                                      type: "variable",
                                      dataType: "uint16",
                                    },
                                    {
                                      name: "Grenades",
                                      offset: 0x20a,
                                      type: "variable",
                                      dataType: "uint16",
                                    },
                                    {
                                      name: "Harpoons",
                                      offset: 0x20c,
                                      type: "variable",
                                      dataType: "uint16",
                                    },
                                  ],
                                },
                                {
                                  name: "Miscellaneous",
                                  type: "section",
                                  flex: true,
                                  items: [
                                    {
                                      name: "Small Medi Pack",
                                      offset: 0x20e,
                                      type: "variable",
                                      dataType: "uint8",
                                    },
                                    {
                                      name: "Large Medi Pack",
                                      offset: 0x20f,
                                      type: "variable",
                                      dataType: "uint8",
                                    },
                                    {
                                      name: "Flare",
                                      offset: 0x211,
                                      type: "variable",
                                      dataType: "uint8",
                                    },
                                  ],
                                },
                                {
                                  name: "???",
                                  offset: 0x213,
                                  type: "variable",
                                  dataType: "uint8",
                                  hidden: true,
                                },
                                {
                                  id: "locationItems-key",
                                  name: "Keys",
                                  type: "section",
                                  flex: true,
                                  hidden: true,
                                  items: [
                                    {
                                      name: "Key 1",
                                      offset: 0x647,
                                      type: "variable",
                                      dataType: "uint8",
                                      max: 1,
                                      hidden: true,
                                    },
                                    {
                                      name: "Key 2",
                                      offset: 0x648,
                                      type: "variable",
                                      dataType: "uint8",
                                      max: 1,
                                      hidden: true,
                                    },
                                    {
                                      name: "Key 3",
                                      offset: 0x649,
                                      type: "variable",
                                      dataType: "uint8",
                                      max: 1,
                                      hidden: true,
                                    },
                                    {
                                      name: "Key 4",
                                      offset: 0x64a,
                                      type: "variable",
                                      dataType: "uint8",
                                      max: 1,
                                      hidden: true,
                                    },
                                  ],
                                },
                                {
                                  id: "locationItems-item",
                                  name: "Items",
                                  type: "section",
                                  flex: true,
                                  hidden: true,
                                  items: [
                                    {
                                      name: "Item 1",
                                      offset: 0x641,
                                      type: "variable",
                                      dataType: "uint8",
                                      max: 1,
                                      hidden: true,
                                    },
                                    {
                                      name: "Item 2",
                                      offset: 0x642,
                                      type: "variable",
                                      dataType: "uint8",
                                      max: 1,
                                      hidden: true,
                                    },
                                    {
                                      name: "Item 3",
                                      offset: 0x643,
                                      type: "variable",
                                      dataType: "uint8",
                                      max: 1,
                                      hidden: true,
                                    },
                                    {
                                      name: "Item 4",
                                      offset: 0x644,
                                      type: "variable",
                                      dataType: "uint8",
                                      max: 1,
                                      hidden: true,
                                    },
                                    {
                                      name: "Item 5",
                                      offset: 0x645,
                                      type: "variable",
                                      dataType: "uint8",
                                      max: 1,
                                      hidden: true,
                                    },
                                    {
                                      name: "Item 6",
                                      offset: 0x646,
                                      type: "variable",
                                      dataType: "uint8",
                                      max: 1,
                                      hidden: true,
                                    },
                                  ],
                                },
                              ],
                            },
                            {
                              name: "Statistics",
                              items: [
                                {
                                  name: "Playtime",
                                  type: "group",
                                  mode: "time",
                                  items: [
                                    {
                                      offset: 0x620,
                                      type: "variable",
                                      dataType: "uint32",
                                      operations: [
                                        { "/": 30 },
                                        {
                                          convert: {
                                            from: "seconds",
                                            to: "hours",
                                          },
                                        },
                                      ],
                                      leadingZeros: 1,
                                      max: 99,
                                    },
                                    {
                                      offset: 0x620,
                                      type: "variable",
                                      dataType: "uint32",
                                      operations: [
                                        { "/": 30 },
                                        {
                                          convert: {
                                            from: "seconds",
                                            to: "minutes",
                                          },
                                        },
                                      ],
                                      leadingZeros: 1,
                                      max: 59,
                                    },
                                    {
                                      offset: 0x620,
                                      type: "variable",
                                      dataType: "uint32",
                                      operations: [
                                        { "/": 30 },
                                        {
                                          convert: {
                                            from: "seconds",
                                            to: "seconds",
                                          },
                                        },
                                      ],
                                      leadingZeros: 1,
                                      max: 59,
                                    },
                                  ],
                                },
                                {
                                  type: "section",
                                  flex: true,
                                  items: [
                                    {
                                      name: "Kills",
                                      offset: 0x630,
                                      type: "variable",
                                      dataType: "uint16",
                                    },
                                    {
                                      name: "Ammo Used",
                                      offset: 0x624,
                                      type: "variable",
                                      dataType: "int32",
                                      min: 0,
                                    },
                                    {
                                      name: "Hits",
                                      offset: 0x628,
                                      type: "variable",
                                      dataType: "int32",
                                      min: 0,
                                    },
                                    {
                                      name: "Health Packs Used",
                                      offset: 0x633,
                                      type: "variable",
                                      dataType: "uint8",
                                      operations: [{ "/": 2 }],
                                      max: 127.5,
                                      step: 0.5,
                                    },
                                    {
                                      name: "Distance Travelled",
                                      offset: 0x62c,
                                      type: "variable",
                                      dataType: "uint32",
                                      operations: [{ "/": 445 }, { round: 0 }],
                                      max: 9651611,
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
                  items: [
                    {
                      type: "section",
                      flex: true,
                      items: [
                        {
                          name: "Progression",
                          offset: 0x26c,
                          type: "variable",
                          dataType: "bit",
                          bit: 0,
                          resource: "booleanCleared",
                        },
                        {
                          name: "Playtime",
                          type: "group",
                          mode: "time",
                          items: [
                            {
                              offset: 0x244,
                              type: "variable",
                              dataType: "uint32",
                              operations: [
                                { "/": 30 },
                                {
                                  convert: {
                                    from: "seconds",
                                    to: "hours",
                                  },
                                },
                              ],
                              leadingZeros: 1,
                              max: 99,
                            },
                            {
                              offset: 0x244,
                              type: "variable",
                              dataType: "uint32",
                              operations: [
                                { "/": 30 },
                                {
                                  convert: {
                                    from: "seconds",
                                    to: "minutes",
                                  },
                                },
                              ],
                              leadingZeros: 1,
                              max: 59,
                            },
                            {
                              offset: 0x244,
                              type: "variable",
                              dataType: "uint32",
                              operations: [
                                { "/": 30 },
                                {
                                  convert: {
                                    from: "seconds",
                                    to: "seconds",
                                  },
                                },
                              ],
                              leadingZeros: 1,
                              max: 59,
                            },
                          ],
                        },
                        {
                          name: "Equipped Weapon",
                          offset: 0x26b,
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
                          name: "Kills",
                          offset: 0x254,
                          type: "variable",
                          dataType: "uint16",
                        },
                        {
                          name: "Ammo Used",
                          offset: 0x248,
                          type: "variable",
                          dataType: "int32",
                          min: 0,
                        },
                        {
                          name: "Hits",
                          offset: 0x24c,
                          type: "variable",
                          dataType: "int32",
                          min: 0,
                        },
                        {
                          name: "Health Packs Used",
                          offset: 0x257,
                          type: "variable",
                          dataType: "uint8",
                          operations: [{ "/": 2 }],
                          max: 127.5,
                          step: 0.5,
                        },
                        {
                          name: "Distance Travelled",
                          offset: 0x250,
                          type: "variable",
                          dataType: "uint32",
                          operations: [{ "/": 445 }, { round: 0 }],
                          max: 9651611,
                        },
                      ],
                    },
                    {
                      id: "secret-%index%",
                      name: "Secrets",
                      type: "bitflags",
                      flags: [
                        { offset: 0x256, bit: 0, label: "Gold Dragon" },
                        { offset: 0x256, bit: 1, label: "Jade Dragon" },
                        { offset: 0x256, bit: 2, label: "Stone Dragon" },
                      ],
                    },
                    {
                      type: "section",
                      flex: true,
                      hidden: true,
                      items: [
                        {
                          name: "Weapons",
                          type: "bitflags",
                          flags: [
                            { offset: 0x26c, bit: 1, label: "Pistols" },
                            { offset: 0x26c, bit: 2, label: "Automatic Pistols" },
                            { offset: 0x26c, bit: 3, label: "Uzis" },
                            { offset: 0x26c, bit: 4, label: "Shotgun" },
                            { offset: 0x26c, bit: 5, label: "M16" },
                            { offset: 0x26c, bit: 6, label: "Grenade Launcher" },
                            { offset: 0x26c, bit: 7, label: "Harpoon Gun" },
                          ],
                        },
                      ],
                    },
                    {
                      name: "Ammo",
                      type: "section",
                      flex: true,
                      hidden: true,
                      items: [
                        {
                          name: "Pistols",
                          offset: 0x258,
                          type: "variable",
                          dataType: "uint16",
                          disabled: true,
                        },
                        {
                          name: "Automatic Pistols",
                          offset: 0x25a,
                          type: "variable",
                          dataType: "uint16",
                        },
                        {
                          name: "Uzi",
                          offset: 0x25c,
                          type: "variable",
                          dataType: "uint16",
                        },
                        {
                          name: "Shotgun",
                          offset: 0x25e,
                          type: "variable",
                          dataType: "uint16",
                        },
                        {
                          name: "M16",
                          offset: 0x260,
                          type: "variable",
                          dataType: "uint16",
                        },
                        {
                          name: "Grenades",
                          offset: 0x262,
                          type: "variable",
                          dataType: "uint16",
                        },
                        {
                          name: "Harpoons",
                          offset: 0x264,
                          type: "variable",
                          dataType: "uint16",
                        },
                      ],
                    },
                    {
                      name: "Miscellaneous",
                      type: "section",
                      flex: true,
                      hidden: true,
                      items: [
                        {
                          name: "Small Medi Pack",
                          offset: 0x266,
                          type: "variable",
                          dataType: "uint8",
                        },
                        {
                          name: "Large Medi Pack",
                          offset: 0x267,
                          type: "variable",
                          dataType: "uint8",
                        },
                        {
                          name: "Flare",
                          offset: 0x269,
                          type: "variable",
                          dataType: "uint8",
                        },
                      ],
                    },
                  ],
                },
              ],
            },
            {
              name: "Option",
              items: [
                {
                  name: "Sound",
                  type: "section",
                  flex: true,
                  items: [
                    {
                      name: "BGM",
                      offset: 0x63a,
                      type: "variable",
                      dataType: "uint16",
                      max: 255,
                    },
                    {
                      name: "SE",
                      offset: 0x638,
                      type: "variable",
                      dataType: "uint16",
                      max: 255,
                    },
                  ],
                },
                {
                  name: "Screen Adjust",
                  type: "section",
                  flex: true,
                  items: [
                    {
                      name: "Screen Position X",
                      offset: 0x63c,
                      type: "variable",
                      dataType: "int16",
                      min: -10,
                      max: 32,
                    },
                    {
                      name: "Screen Position Y",
                      offset: 0x63e,
                      type: "variable",
                      dataType: "int16",
                      min: -6,
                      max: 40,
                    },
                  ],
                },
                {
                  name: "Controls",
                  type: "section",
                  flex: true,
                  items: [
                    {
                      name: "Control Method",
                      offset: 0x636,
                      type: "variable",
                      dataType: "uint16",
                      operations: [{ "+": 1 }],
                      min: 1,
                      max: 5,
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
    booleanCleared: {
      0x0: "-",
      0x1: "Cleared",
    },
    locations: {
      0x0: "The Great Wall",
      0x1: "Venice",
      0x2: "Bartoli's Hideout",
      0x3: "Opera House",
      0x4: "Offshore Rig",
      0x5: "Diving Area",
      0x6: "40 Fathoms",
      0x7: "Wreck of the Maria Doria",
      0x8: "Living Quarters",
      0x9: "The Deck",
      0xa: "Tibetan Foothills",
      0xb: "Barkhang Monastery",
      0xc: "Catacombs of the Talion",
      0xd: "Ice Palace",
      0xe: "Temple of Xian",
      0xf: "Floating Islands",
      0x10: "The Dragon's Lair",
      0x11: "Home Sweet Home",
    },
    progressions: {
      0x0: "-",
      0x1: "Game Complete",
    },
  },
};

export default template;
