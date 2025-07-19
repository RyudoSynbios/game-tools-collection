import type { GameJson, ItemTab } from "$lib/types";

import { mapCards } from "./utils/resource";

const template: GameJson = {
  validator: {
    regions: {
      europe: {
        0x10: [
          0x4b, 0x48, 0x43, 0x4f, 0x4d, 0x5f, 0x42, 0x41, 0x43, 0x4b, 0x55,
          0x50, 0x5f, 0x56, 0x45, 0x52,
        ], // "KHCOM_BACKUP_VER"
      },
      usa: {
        0x10: [
          0x4b, 0x48, 0x43, 0x4f, 0x4d, 0x5f, 0x42, 0x41, 0x43, 0x4b, 0x55,
          0x50, 0x5f, 0x56, 0x45, 0x52,
        ], // "KHCOM_BACKUP_VER"
      },
      japan: {
        0x10: [
          0x4b, 0x48, 0x43, 0x4f, 0x4d, 0x5f, 0x42, 0x41, 0x43, 0x4b, 0x55,
          0x50, 0x5f, 0x56, 0x45, 0x52,
        ], // "KHCOM_BACKUP_VER"
      },
    },
    text: "Drag 'n' drop here or click to add a save file.",
    error: "Not a valid save file.",
  },
  items: [
    {
      id: "slots",
      length: 0x830,
      type: "container",
      instanceType: "tabs",
      instances: 4,
      resource: "slots",
      resourceOrder: true,
      onTabChange: "onSlotChange(%d)",
      prependSubinstance: [
        {
          name: "General",
          items: [
            {
              name: "Checksum",
              offset: 0x28,
              type: "checksum",
              dataType: "uint16",
              control: {
                offsetStart: 0x0,
                offsetEnd: 0x50,
              },
            },
            {
              type: "section",
              flex: true,
              items: [
                {
                  name: "Title Screen",
                  offset: 0x2c,
                  type: "variable",
                  dataType: "bit",
                  bit: 1,
                  resource: "titleScreens",
                },
                {
                  name: "Title Screen Switch",
                  offset: 0x2c,
                  type: "variable",
                  dataType: "bit",
                  bit: 2,
                  resource: "booleanEnabled",
                  hint: "Title screen will change depending on the last character you played.",
                },
              ],
            },
            {
              type: "section",
              flex: true,
              items: [
                {
                  name: "Riku Story",
                  offset: 0x2c,
                  type: "variable",
                  dataType: "bit",
                  bit: 0,
                  resource: "booleanUnlocked",
                },
                {
                  name: "Link",
                  offset: 0x2c,
                  type: "variable",
                  dataType: "bit",
                  bit: 0,
                  resource: "booleanUnlocked",
                },
              ],
            },
            {
              name: "Sora Slot 1 (Save Preview)",
              type: "section",
              flex: true,
              hidden: true,
              items: [
                {
                  name: "Floor",
                  offset: 0x30,
                  type: "variable",
                  dataType: "uint8",
                },
                {
                  name: "World",
                  offset: 0x31,
                  type: "variable",
                  dataType: "uint8",
                  resource: "worlds",
                },
                {
                  name: "Level",
                  offset: 0x32,
                  type: "variable",
                  dataType: "uint8",
                },
                {
                  name: "???",
                  offset: 0x33,
                  type: "variable",
                  dataType: "uint8",
                },
                {
                  name: "Playtime",
                  offset: 0x34,
                  type: "variable",
                  dataType: "uint32",
                },
              ],
            },
            {
              name: "Sora Slot 2 (Save Preview)",
              type: "section",
              flex: true,
              hidden: true,
              items: [
                {
                  name: "Floor",
                  offset: 0x38,
                  type: "variable",
                  dataType: "uint8",
                },
                {
                  name: "World",
                  offset: 0x39,
                  type: "variable",
                  dataType: "uint8",
                  resource: "worlds",
                },
                {
                  name: "Level",
                  offset: 0x3a,
                  type: "variable",
                  dataType: "uint8",
                },
                {
                  name: "???",
                  offset: 0x3b,
                  type: "variable",
                  dataType: "uint8",
                },
                {
                  name: "Playtime",
                  offset: 0x3c,
                  type: "variable",
                  dataType: "uint32",
                },
              ],
            },
            {
              name: "Riku Slot 1 (Save Preview)",
              type: "section",
              flex: true,
              hidden: true,
              items: [
                {
                  name: "Floor",
                  offset: 0x40,
                  type: "variable",
                  dataType: "uint8",
                },
                {
                  name: "World",
                  offset: 0x41,
                  type: "variable",
                  dataType: "uint8",
                  resource: "worlds",
                },
                {
                  name: "Level",
                  offset: 0x42,
                  type: "variable",
                  dataType: "uint8",
                },
                {
                  name: "???",
                  offset: 0x43,
                  type: "variable",
                  dataType: "uint8",
                },
                {
                  name: "Playtime",
                  offset: 0x44,
                  type: "variable",
                  dataType: "uint32",
                },
              ],
            },
            {
              name: "Riku Slot 2 (Save Preview)",
              type: "section",
              flex: true,
              hidden: true,
              items: [
                {
                  name: "Floor",
                  offset: 0x48,
                  type: "variable",
                  dataType: "uint8",
                },
                {
                  name: "World",
                  offset: 0x49,
                  type: "variable",
                  dataType: "uint8",
                  resource: "worlds",
                },
                {
                  name: "Level",
                  offset: 0x4a,
                  type: "variable",
                  dataType: "uint8",
                },
                {
                  name: "???",
                  offset: 0x4b,
                  type: "variable",
                  dataType: "uint8",
                },
                {
                  name: "Playtime",
                  offset: 0x4c,
                  type: "variable",
                  dataType: "uint32",
                },
              ],
            },
          ],
        },
      ],
      disableSubinstanceIf: {
        offset: 0x1ec0,
        type: "variable",
        dataType: "uint8",
        operator: "!=",
        value: 0x4b,
      },
      items: [
        {
          id: "checksumSlots-%index%",
          name: "Checksum",
          offset: 0x1ed8,
          type: "checksum",
          dataType: "uint16",
          control: {
            offsetStart: 0x1ec0,
            offsetEnd: 0x22d8,
          },
        },
        {
          id: "main",
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
                              name: "Playtime",
                              type: "group",
                              mode: "time",
                              items: [
                                {
                                  id: "savePreview-playtime-%index%",
                                  offset: 0x1f70,
                                  type: "variable",
                                  dataType: "uint32",
                                  operations: [
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
                                  id: "savePreview-playtime-%index%",
                                  offset: 0x1f70,
                                  type: "variable",
                                  dataType: "uint32",
                                  operations: [
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
                                  id: "savePreview-playtime-%index%",
                                  offset: 0x1f70,
                                  type: "variable",
                                  dataType: "uint32",
                                  operations: [
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
                              id: "progression-%index%",
                              name: "Progression",
                              offset: 0x1f78,
                              type: "variable",
                              dataType: "uint8",
                              resource: "rikuProgressions",
                              size: "lg",
                              autocomplete: true,
                            },
                            {
                              id: "soraOnly-%index%",
                              name: "Moogle Points",
                              offset: 0x1f5c,
                              type: "variable",
                              dataType: "uint32",
                              max: 99999,
                            },
                          ],
                        },
                        {
                          type: "section",
                          flex: true,
                          items: [
                            {
                              id: "savePreview-floor-%index%",
                              name: "Floor",
                              offset: 0x1f75,
                              type: "variable",
                              dataType: "uint8",
                              resource: "rikuFloors",
                              autocomplete: true,
                            },
                            {
                              id: "savePreview-world-%index%",
                              name: "World",
                              offset: 0x1f7c,
                              type: "variable",
                              dataType: "uint8",
                              resource: "worlds",
                              autocomplete: true,
                            },
                            {
                              name: "Room",
                              offset: 0x1f7e,
                              type: "variable",
                              dataType: "uint8",
                              resource: "rooms",
                              autocomplete: true,
                            },
                            {
                              name: "Spawn",
                              offset: 0x1f7f,
                              type: "variable",
                              dataType: "uint8",
                              resource: "spawns",
                            },
                          ],
                        },
                        {
                          name: "Events",
                          type: "bitflags",
                          hidden: true,
                          flags: [
                            { offset: 0x1f62, bit: 0, label: "How to use World Cards" }, // prettier-ignore
                            { offset: 0x1f62, bit: 1, label: "???" }, // prettier-ignore
                            { offset: 0x1f62, bit: 2, label: "???" }, // prettier-ignore
                            { offset: 0x1f62, bit: 3, label: "How to use Map Cards" }, // prettier-ignore
                            { offset: 0x1f62, bit: 4, label: "How to save" }, // prettier-ignore
                            { offset: 0x1f62, bit: 5, label: "How to start a battle" }, // prettier-ignore
                            { offset: 0x1f62, bit: 6, label: "How to open emblazoned doors" }, // prettier-ignore
                            { offset: 0x1f62, bit: 7, label: "???" }, // prettier-ignore
                            { offset: 0x1f63, bit: 0, label: "How to use Warp Points" }, // prettier-ignore
                            { offset: 0x1f63, bit: 1, label: "Menu enabled" }, // prettier-ignore
                            { offset: 0x1f63, bit: 2, label: "How to move to another floor" }, // prettier-ignore
                            { offset: 0x1f63, bit: 3, label: "How Riku's deck works" }, // prettier-ignore
                            { offset: 0x1f63, bit: 4, label: "???" }, // prettier-ignore
                            { offset: 0x1f63, bit: 5, label: "How to strike objects" }, // prettier-ignore
                            { offset: 0x1f63, bit: 6, label: "???" }, // prettier-ignore
                            { offset: 0x1f63, bit: 7, label: "???" }, // prettier-ignore
                          ],
                        },
                      ],
                    },
                    {
                      name: "Friends",
                      flex: true,
                      items: [
                        {
                          id: "friends-soraOnly-%index%",
                          type: "bitflags",
                          flags: [
                            { offset: 0x1f64, bit: 0, label: "Goofy" },
                            { offset: 0x1f64, bit: 1, label: "Donald" },
                            { offset: 0x1f64, bit: 2, label: "Aladdin" },
                            { offset: 0x1f64, bit: 3, label: "Ariel" },
                            { offset: 0x1f64, bit: 4, label: "Jack" },
                            { offset: 0x1f64, bit: 5, label: "Peter Pan" },
                            { offset: 0x1f64, bit: 6, label: "The Beast" },
                          ],
                        },
                        {
                          id: "rikuOnly-%index%",
                          type: "bitflags",
                          flags: [{ offset: 0x1f64, bit: 7, label: "Mickey" }],
                        },
                      ],
                    },
                    {
                      name: "World Cards",
                      items: [
                        {
                          type: "bitflags",
                          flags: [
                            { offset: 0x1f68, bit: 0, label: "Agrabah" }, // prettier-ignore
                            { offset: 0x1f68, bit: 1, label: "Atlantica" }, // prettier-ignore
                            { offset: 0x1f68, bit: 2, label: "Olympus Coliseum" }, // prettier-ignore
                            { offset: 0x1f68, bit: 3, label: "Wonderland" }, // prettier-ignore
                            { offset: 0x1f68, bit: 4, label: "Monstro" }, // prettier-ignore
                            { offset: 0x1f68, bit: 5, label: "Halloween Town" }, // prettier-ignore
                            { offset: 0x1f68, bit: 6, label: "Never Land" }, // prettier-ignore
                            { offset: 0x1f68, bit: 7, label: "Hollow Bastion" }, // prettier-ignore
                            { offset: 0x1f69, bit: 0, label: "Destiny Islands" }, // prettier-ignore
                            { offset: 0x1f69, bit: 1, label: "Traverse Town" }, // prettier-ignore
                            { offset: 0x1f69, bit: 2, label: "100 Acre Wood" }, // prettier-ignore
                            { offset: 0x1f69, bit: 3, label: "Twilight Town" }, // prettier-ignore
                            { offset: 0x1f69, bit: 4, label: "Castle Oblivion" }, // prettier-ignore
                          ],
                        },
                      ],
                    },
                    {
                      name: "Current Floor",
                      items: [
                        {
                          type: "section",
                          flex: true,
                          items: [
                            {
                              name: "Floor",
                              offset: 0x1f6c,
                              type: "variable",
                              dataType: "uint8",
                              hidden: true,
                            },
                            {
                              name: "World",
                              offset: 0x1f6d,
                              type: "variable",
                              dataType: "uint8",
                              resource: "worlds",
                              hidden: true,
                            },
                            {
                              name: "World",
                              offset: 0x1f74,
                              type: "variable",
                              dataType: "uint8",
                              resource: "worlds",
                              hidden: true,
                            },
                            {
                              name: "World Progression",
                              offset: 0x1f7d,
                              type: "variable",
                              dataType: "uint8",
                              hidden: true,
                            },
                            {
                              name: "Events",
                              type: "bitflags",
                              flags: [
                                { offset: 0x1f7a, bit: 1, label: "World introduction seen" }, // prettier-ignore
                                { offset: 0x1f7a, bit: 4, label: "Location visited" }, // prettier-ignore
                                { offset: 0x1f7a, bit: 3, label: "Set when key is used (temporary)", hidden: true }, // prettier-ignore
                                { offset: 0x1f7a, bit: 5, label: "Boss defeated?", hidden: true }, // prettier-ignore
                                { offset: 0x1f7a, bit: 2, label: "End floor event seen" }, // prettier-ignore
                                { offset: 0x1f7a, bit: 0, label: "Next floor introduction seen" }, // prettier-ignore
                                { offset: 0x1f7a, bit: 6, label: "???", hidden: true }, // prettier-ignore
                                { offset: 0x1f7a, bit: 7, label: "???" }, // prettier-ignore
                              ],
                            },
                          ],
                        },
                        {
                          type: "section",
                          hidden: true,
                          items: [
                            {
                              length: 0x10,
                              type: "container",
                              instanceType: "section",
                              instances: 32,
                              enumeration: "Room %d",
                              flex: true,
                              items: [
                                {
                                  name: "Unlocked Doors",
                                  offset: 0x1f84,
                                  type: "variable",
                                  dataType: "uint8",
                                },
                                {
                                  name: "Seed",
                                  offset: 0x1f88,
                                  type: "variable",
                                  dataType: "uint32",
                                },
                                {
                                  name: "Type",
                                  offset: 0x1f8d,
                                  type: "variable",
                                  dataType: "uint8",
                                },
                                {
                                  name: "Remaining Enemies",
                                  offset: 0x1f8f,
                                  type: "variable",
                                  dataType: "uint8",
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
            {
              name: "Status",
              items: [
                {
                  type: "section",
                  flex: true,
                  items: [
                    {
                      id: "savePreview-level-%index%",
                      name: "Level",
                      offset: 0x1ef0,
                      type: "variable",
                      dataType: "uint8",
                      min: 1,
                      max: 99,
                    },
                    {
                      name: "Experience",
                      offset: 0x1ee8,
                      type: "variable",
                      dataType: "uint32",
                      max: 999999,
                    },
                    {
                      name: "Next Level",
                      offset: 0x1eec,
                      type: "variable",
                      dataType: "uint32",
                      hidden: true,
                    },
                  ],
                },
                {
                  type: "section",
                  flex: true,
                  items: [
                    {
                      name: "HP",
                      type: "group",
                      mode: "fraction",
                      items: [
                        {
                          offset: 0x1f6a,
                          type: "variable",
                          dataType: "uint16",
                          min: 1,
                          max: 999,
                        },
                        {
                          offset: 0x1ee0,
                          type: "variable",
                          dataType: "uint16",
                          min: 1,
                          max: 999,
                        },
                      ],
                    },
                    {
                      id: "soraOnly-%index%",
                      name: "Max CP",
                      offset: 0x1ee2,
                      type: "variable",
                      dataType: "uint16",
                      max: 9999,
                    },
                    {
                      id: "rikuOnly-%index%",
                      name: "Attack Points",
                      offset: 0x1ee6,
                      type: "variable",
                      dataType: "uint16",
                      max: 99,
                    },
                    {
                      name: "AP Bonus taken",
                      offset: 0x1f60,
                      type: "variable",
                      dataType: "uint16",
                      hidden: true,
                    },
                    {
                      id: "rikuOnly-%index%",
                      name: "Dark Points",
                      offset: 0x1ee4,
                      type: "variable",
                      dataType: "uint16",
                      max: 999,
                    },
                    {
                      id: "soraOnly-%index%",
                      name: "Equipped Deck",
                      offset: 0x21c8,
                      type: "variable",
                      dataType: "uint8",
                      resource: "deckNames",
                    },
                  ],
                },
              ],
            },
            {
              name: "Abilities",
              flex: true,
              items: [
                {
                  id: "soraOnly-%index%",
                  name: "Attack Sleights",
                  type: "bitflags",
                  flags: [
                    { offset: 0x1ef4, bit: 0, label: "Sliding Dash" },
                    { offset: 0x1ef4, bit: 1, label: "Blitz" },
                    { offset: 0x1ef4, bit: 2, label: "Stun Impact" },
                    { offset: 0x1ef4, bit: 3, label: "Zantetsuken" },
                    { offset: 0x1ef4, bit: 4, label: "Strike Raid" },
                    { offset: 0x1ef4, bit: 5, label: "Sonic Blade" },
                    { offset: 0x1ef4, bit: 6, label: "Ars Arcanum" },
                    { offset: 0x1ef4, bit: 7, label: "Ragnarok" },
                    { offset: 0x1ef5, bit: 0, label: "Trinity Limit" },
                  ],
                },
                {
                  id: "soraOnly-%index%",
                  name: "Magic Sleights",
                  type: "bitflags",
                  flags: [
                    { offset: 0x1ef5, bit: 1, label: "Fira" },
                    { offset: 0x1ef5, bit: 2, label: "Firaga" },
                    { offset: 0x1ef5, bit: 3, label: "Blizzara" },
                    { offset: 0x1ef5, bit: 4, label: "Blizzaga" },
                    { offset: 0x1ef5, bit: 5, label: "Thundara" },
                    { offset: 0x1ef5, bit: 6, label: "Thundaga" },
                    { offset: 0x1ef5, bit: 7, label: "Cura" },
                    { offset: 0x1ef6, bit: 0, label: "Curaga" },
                    { offset: 0x1ef6, bit: 1, label: "Gravira" },
                    { offset: 0x1ef6, bit: 2, label: "Graviga" },
                    { offset: 0x1ef6, bit: 3, label: "Stopra" },
                    { offset: 0x1ef6, bit: 4, label: "Stopga" },
                    { offset: 0x1ef6, bit: 5, label: "Aerora" },
                    { offset: 0x1ef6, bit: 6, label: "Aeroga" },
                    { offset: 0x1ef6, bit: 7, label: "Fire Raid" },
                    { offset: 0x1ef7, bit: 0, label: "Blizzard Raid" },
                    { offset: 0x1ef7, bit: 1, label: "Thunder Raid" },
                    { offset: 0x1ef7, bit: 2, label: "Gravity Raid" },
                    { offset: 0x1ef7, bit: 3, label: "Stop Raid" },
                    { offset: 0x1ef7, bit: 4, label: "Judgment" },
                    { offset: 0x1ef7, bit: 5, label: "Reflect Raid" },
                    { offset: 0x1ef7, bit: 6, label: "Homing Fira" },
                    { offset: 0x1efc, bit: 0, label: "Firaga Break" },
                    { offset: 0x1efc, bit: 1, label: "Mega Flare" },
                    { offset: 0x1efc, bit: 2, label: "Homing Blizzara" },
                    { offset: 0x1efc, bit: 3, label: "Aqua Splash" },
                    { offset: 0x1efc, bit: 4, label: "Shock Impact" },
                    { offset: 0x1efc, bit: 5, label: "Tornado" },
                    { offset: 0x1efc, bit: 6, label: "Quake" },
                    { offset: 0x1efc, bit: 7, label: "Warpinator" },
                    { offset: 0x1efd, bit: 0, label: "Warp" },
                    { offset: 0x1efd, bit: 1, label: "Bind" },
                    { offset: 0x1efd, bit: 2, label: "Confuse" },
                    { offset: 0x1efd, bit: 3, label: "Terror" },
                    { offset: 0x1efd, bit: 4, label: "Synchro" },
                    { offset: 0x1efd, bit: 5, label: "Gifted Miracle" },
                    { offset: 0x1efd, bit: 6, label: "Teleport" },
                    { offset: 0x1efd, bit: 7, label: "Holy" },
                  ],
                },
                {
                  id: "soraOnly-%index%",
                  name: "Summons Sleights",
                  type: "bitflags",
                  flags: [
                    { offset: 0x1efe, bit: 0, label: "Proud Roar" },
                    { offset: 0x1efe, bit: 1, label: "Splash" },
                    { offset: 0x1efe, bit: 2, label: "Paradise" },
                    { offset: 0x1efe, bit: 3, label: "Idyll Romp" },
                    { offset: 0x1efe, bit: 4, label: "Flare Breath" },
                    { offset: 0x1efe, bit: 5, label: "Showtime" },
                    { offset: 0x1efe, bit: 6, label: "Twinkle" },
                    { offset: 0x1efe, bit: 7, label: "Cross-slash" },
                    { offset: 0x1eff, bit: 0, label: "Omnislash" },
                    { offset: 0x1eff, bit: 1, label: "Cross-slash+" },
                    { offset: 0x1eff, bit: 2, label: "Magic" },
                    { offset: 0x1eff, bit: 3, label: "Blazing Donald" },
                    { offset: 0x1eff, bit: 4, label: "Goofy Charge" },
                    { offset: 0x1eff, bit: 5, label: "Goofy Tornado" },
                    { offset: 0x1eff, bit: 6, label: "Sandstorm" },
                    { offset: 0x1eff, bit: 7, label: "Surprise!" },
                    { offset: 0x1f00, bit: 0, label: "Spiral Wave" },
                    { offset: 0x1f00, bit: 1, label: "Hummingbird" },
                    { offset: 0x1f00, bit: 2, label: "Ferocious Lunge" },
                  ],
                },
                {
                  id: "rikuOnly-%index%",
                  name: "Attack Sleights",
                  type: "bitflags",
                  flags: [
                    { offset: 0x1f00, bit: 3, label: "Dark Break" },
                    { offset: 0x1f00, bit: 4, label: "Dark Firaga" },
                    { offset: 0x1f00, bit: 5, label: "Dark Aura" },
                  ],
                },
                {
                  id: "rikuOnly-%index%",
                  name: "Friend Sleights",
                  type: "bitflags",
                  flags: [{ offset: 0x1f00, bit: 6, label: "MM Miracle" }],
                },
              ],
            },
            {
              name: "Cards",
              items: [
                {
                  id: "cards-%index%",
                  type: "section",
                  items: [
                    {
                      type: "tabs",
                      items: [
                        {
                          name: "Unlocked",
                          flex: true,
                          items: [
                            {
                              name: "Attack Cards",
                              type: "bitflags",
                              flags: [
                                { offset: 0x1f14, bit: 0, label: "Kingdom Key" }, // prettier-ignore
                                { offset: 0x1f14, bit: 1, label: "Three Wishes" }, // prettier-ignore
                                { offset: 0x1f14, bit: 2, label: "Crabclaw" }, // prettier-ignore
                                { offset: 0x1f14, bit: 3, label: "Pumpkinhead" }, // prettier-ignore
                                { offset: 0x1f14, bit: 4, label: "Fairy Harp" }, // prettier-ignore
                                { offset: 0x1f14, bit: 5, label: "Wishing Star" }, // prettier-ignore
                                { offset: 0x1f14, bit: 6, label: "Spellbinder" }, // prettier-ignore
                                { offset: 0x1f14, bit: 7, label: "Metal Chocobo" }, // prettier-ignore
                                { offset: 0x1f15, bit: 0, label: "Olympia" }, // prettier-ignore
                                { offset: 0x1f15, bit: 1, label: "Lionheart" }, // prettier-ignore
                                { offset: 0x1f15, bit: 2, label: "Lady Luck" }, // prettier-ignore
                                { offset: 0x1f15, bit: 3, label: "Divine Rose" }, // prettier-ignore
                                { offset: 0x1f15, bit: 4, label: "Oathkeeper" }, // prettier-ignore
                                { offset: 0x1f15, bit: 5, label: "Oblivion" }, // prettier-ignore
                                { offset: 0x1f15, bit: 6, label: "Ultima Weapon" }, // prettier-ignore
                                { offset: 0x1f15, bit: 7, label: "Diamond Dust" }, // prettier-ignore
                                { offset: 0x1f16, bit: 0, label: "One-Winged Angel" }, // prettier-ignore
                              ],
                            },
                            {
                              name: "Magic Cards",
                              type: "bitflags",
                              flags: [
                                { offset: 0x1f16, bit: 1, label: "Fire" }, // prettier-ignore
                                { offset: 0x1f16, bit: 2, label: "Blizzard" }, // prettier-ignore
                                { offset: 0x1f16, bit: 3, label: "Thunder" }, // prettier-ignore
                                { offset: 0x1f16, bit: 4, label: "Cure" }, // prettier-ignore
                                { offset: 0x1f16, bit: 5, label: "Gravity" }, // prettier-ignore
                                { offset: 0x1f16, bit: 6, label: "Stop" }, // prettier-ignore
                                { offset: 0x1f16, bit: 7, label: "Aero" }, // prettier-ignore
                                { offset: 0x1f17, bit: 0, label: "Simba" }, // prettier-ignore
                                { offset: 0x1f17, bit: 1, label: "Genie" }, // prettier-ignore
                                { offset: 0x1f17, bit: 2, label: "Bambi" }, // prettier-ignore
                                { offset: 0x1f17, bit: 3, label: "Dumbo" }, // prettier-ignore
                                { offset: 0x1f17, bit: 4, label: "Tinker Bell" }, // prettier-ignore
                                { offset: 0x1f17, bit: 5, label: "Mushu" }, // prettier-ignore
                                { offset: 0x1f17, bit: 6, label: "Cloud" }, // prettier-ignore
                              ],
                            },
                            {
                              name: "Item Cards",
                              type: "bitflags",
                              flags: [
                                { offset: 0x1f17, bit: 7, label: "Potion" }, // prettier-ignore
                                { offset: 0x1f18, bit: 0, label: "Hi-Potion" }, // prettier-ignore
                                { offset: 0x1f18, bit: 1, label: "Mega-Potion" }, // prettier-ignore
                                { offset: 0x1f18, bit: 2, label: "Ether" }, // prettier-ignore
                                { offset: 0x1f18, bit: 3, label: "Mega-Ether" }, // prettier-ignore
                                { offset: 0x1f18, bit: 4, label: "Elixir" }, // prettier-ignore
                                { offset: 0x1f18, bit: 5, label: "Megalixir" }, // prettier-ignore
                              ],
                            },
                          ],
                        },
                        {
                          name: "List",
                          flex: true,
                          items: [...Array(999).keys()].map((index) => ({
                            name: `Card ${index + 1}`,
                            offset: 0x22d8 + index * 2,
                            type: "variable",
                            dataType: "uint16",
                            resource: "cards",
                          })),
                        },
                      ],
                    },
                  ],
                },
                {
                  id: "rikuOnly-%index%",
                  type: "bitflags",
                  flags: [
                    { offset: 0x1f18, bit: 6, label: "Guard Armor" }, // prettier-ignore
                    { offset: 0x1f19, bit: 2, label: "Parasite Cage" }, // prettier-ignore
                    { offset: 0x1f19, bit: 0, label: "Trickmaster" }, // prettier-ignore
                    { offset: 0x1f19, bit: 4, label: "Darkside" }, // prettier-ignore
                    { offset: 0x1f1a, bit: 2, label: "Hades" }, // prettier-ignore
                    { offset: 0x1f18, bit: 7, label: "Jafar" }, // prettier-ignore
                    { offset: 0x1f19, bit: 5, label: "Oogie Boogie" }, // prettier-ignore
                    { offset: 0x1f19, bit: 1, label: "Ursula" }, // prettier-ignore
                    { offset: 0x1f1a, bit: 0, label: "Hook" }, // prettier-ignore
                    { offset: 0x1f19, bit: 3, label: "Dragon Maleficent" }, // prettier-ignore
                    { offset: 0x1f1a, bit: 3, label: "Riku" }, // prettier-ignore
                    { offset: 0x1f1a, bit: 6, label: "Vexen" }, // prettier-ignore
                    { offset: 0x1f1b, bit: 1, label: "Lexaeus" }, // prettier-ignore
                    { offset: 0x1f1b, bit: 0, label: "Ansem" }, // prettier-ignore
                  ],
                },
              ],
            },
            {
              id: "empty-%index%",
              name: "Decks",
              items: [
                {
                  id: "decks",
                  length: 0xe0,
                  type: "container",
                  instanceType: "tabs",
                  instances: 3,
                  resource: "deckNames",
                  vertical: true,
                  items: [
                    {
                      type: "section",
                      flex: true,
                      items: [
                        {
                          id: "deckName-%parent%-%index%",
                          name: "Name",
                          offset: 0x2b6e,
                          length: 0x8,
                          type: "variable",
                          dataType: "string",
                          letterDataType: "uint8",
                          encoding: "windows1252",
                          zeroTerminated: true,
                        },
                        {
                          name: "CP",
                          offset: 0x2b82,
                          type: "variable",
                          dataType: "uint16",
                          disabled: true,
                        },
                        {
                          name: "Card Count",
                          offset: 0x2b84,
                          type: "variable",
                          dataType: "uint16",
                          disabled: true,
                        },
                      ],
                    },
                    {
                      type: "section",
                      flex: true,
                      items: [...Array(99).keys()].map((index) => ({
                        name: `Card ${index + 1}`,
                        offset: 0x2aa8 + index * 2,
                        type: "variable",
                        dataType: "uint16",
                        resource: "cards",
                      })),
                    },
                  ],
                },
              ],
            },
            {
              name: "Map Cards",
              items: [
                {
                  type: "tabs",
                  vertical: true,
                  items: mapCards.map(
                    (type) =>
                      ({
                        name: type.name,
                        items: [
                          ...(type.hasSingleCards
                            ? [
                                {
                                  type: "bitflags",
                                  flags: type.cards.map((card) => ({
                                    offset: 0x21c9 + card.index * 0xa + 0x1,
                                    bit: 0,
                                    label: card.name,
                                  })),
                                },
                              ]
                            : type.cards.map((card) => ({
                                name: card.name,
                                type: "section",
                                flex: true,
                                items: [...Array(10).keys()].map((index) => ({
                                  name: `${index}`,
                                  offset: 0x21c9 + card.index * 0xa + index,
                                  type: "variable",
                                  dataType: "uint8",
                                  max: 9,
                                })),
                              }))),
                        ],
                      }) as ItemTab,
                  ),
                },
              ],
            },
            {
              id: "journal-%index%",
              name: "Journal",
              flex: true,
              items: [
                {
                  type: "tabs",
                  vertical: true,
                  items: [
                    {
                      name: "Story",
                      flex: true,
                      items: [
                        {
                          id: "soraOnly-%index%",
                          type: "bitflags",
                          flags: [
                            { offset: 0x1f1c, bit: 0, label: "Sora's Tale I" }, // prettier-ignore
                            { offset: 0x1f1c, bit: 1, label: "Sora's Tale II" }, // prettier-ignore
                            { offset: 0x1f1c, bit: 2, label: "Sora's Tale III" }, // prettier-ignore
                            { offset: 0x1f1c, bit: 3, label: "Sora's Tale IV" }, // prettier-ignore
                            { offset: 0x1f1c, bit: 4, label: "Traverse Town" }, // prettier-ignore
                            { offset: 0x1f1c, bit: 5, label: "Wonderland" }, // prettier-ignore
                            { offset: 0x1f1c, bit: 6, label: "Olympus Coliseum" }, // prettier-ignore
                            { offset: 0x1f1c, bit: 7, label: "Agrabah" }, // prettier-ignore
                            { offset: 0x1f1d, bit: 0, label: "Halloween Town" }, // prettier-ignore
                            { offset: 0x1f1d, bit: 1, label: "Monstro" }, // prettier-ignore
                            { offset: 0x1f1d, bit: 2, label: "Atlantica" }, // prettier-ignore
                            { offset: 0x1f1d, bit: 3, label: "Never Land" }, // prettier-ignore
                            { offset: 0x1f1d, bit: 4, label: "Hollow Bastion" }, // prettier-ignore
                            { offset: 0x1f1d, bit: 5, label: "100 Acre Wood" }, // prettier-ignore
                            { offset: 0x1f1d, bit: 6, label: "Twilight Town" }, // prettier-ignore
                            { offset: 0x1f1d, bit: 7, label: "Destiny Islands" }, // prettier-ignore
                            { offset: 0x1f1e, bit: 0, label: "Castle Oblivion" }, // prettier-ignore
                          ],
                        },
                        {
                          id: "rikuOnly-%index%",
                          type: "bitflags",
                          flags: [
                            { offset: 0x1f1c, bit: 0, label: "Riku's Tale I" }, // prettier-ignore
                            { offset: 0x1f1c, bit: 1, label: "Riku's Tale II" }, // prettier-ignore
                            { offset: 0x1f1c, bit: 2, label: "Riku's Tale III" }, // prettier-ignore
                            { offset: 0x1f1c, bit: 3, label: "Riku's Tale IV" }, // prettier-ignore
                            { offset: 0x1f39, bit: 3, label: "Riku's Tale V" },
                            { offset: 0x1f39, bit: 4, label: "Riku's Tale VI" },
                          ],
                        },
                      ],
                    },
                    {
                      name: "Card Index",
                      flex: true,
                      items: [
                        {
                          id: "soraOnly-%index%",
                          type: "section",
                          items: [
                            {
                              id: "soraOnly-%index%",
                              name: "Attack Cards",
                              type: "bitflags",
                              flags: [
                                { offset: 0x1f2a, bit: 7, label: "Kingdom Key" }, // prettier-ignore
                                { offset: 0x1f2b, bit: 0, label: "Three Wishes" }, // prettier-ignore
                                { offset: 0x1f2b, bit: 1, label: "Crabclaw" }, // prettier-ignore
                                { offset: 0x1f2b, bit: 2, label: "Pumpkinhead" }, // prettier-ignore
                                { offset: 0x1f2b, bit: 3, label: "Fairy Harp" }, // prettier-ignore
                                { offset: 0x1f2b, bit: 4, label: "Wishing Star" }, // prettier-ignore
                                { offset: 0x1f2b, bit: 5, label: "Spellbinder" }, // prettier-ignore
                                { offset: 0x1f2b, bit: 6, label: "Metal Chocobo" }, // prettier-ignore
                                { offset: 0x1f2b, bit: 7, label: "Olympia" }, // prettier-ignore
                                { offset: 0x1f2c, bit: 0, label: "Lionheart" }, // prettier-ignore
                                { offset: 0x1f2c, bit: 1, label: "Lady Luck" }, // prettier-ignore
                                { offset: 0x1f2c, bit: 2, label: "Divine Rose" }, // prettier-ignore
                                { offset: 0x1f2c, bit: 3, label: "Oathkeeper" }, // prettier-ignore
                                { offset: 0x1f2c, bit: 4, label: "Oblivion" }, // prettier-ignore
                                { offset: 0x1f2c, bit: 6, label: "Diamond Dust" }, // prettier-ignore
                                { offset: 0x1f2c, bit: 7, label: "One-Winged Angel" }, // prettier-ignore
                                { offset: 0x1f2c, bit: 5, label: "Ultima Weapon" }, // prettier-ignore
                              ],
                            },
                            {
                              id: "soraOnly-%index%",
                              name: "Magic Cards",
                              type: "bitflags",
                              flags: [
                                { offset: 0x1f2d, bit: 0, label: "Fire" }, // prettier-ignore
                                { offset: 0x1f2d, bit: 1, label: "Blizzard" }, // prettier-ignore
                                { offset: 0x1f2d, bit: 2, label: "Thunder" }, // prettier-ignore
                                { offset: 0x1f2d, bit: 3, label: "Cure" }, // prettier-ignore
                                { offset: 0x1f2d, bit: 4, label: "Gravity" }, // prettier-ignore
                                { offset: 0x1f2d, bit: 5, label: "Stop" }, // prettier-ignore
                                { offset: 0x1f2d, bit: 6, label: "Aero" }, // prettier-ignore
                                { offset: 0x1f2d, bit: 7, label: "Simba" }, // prettier-ignore
                                { offset: 0x1f2e, bit: 2, label: "Dumbo" }, // prettier-ignore
                                { offset: 0x1f2e, bit: 1, label: "Bambi" }, // prettier-ignore
                                { offset: 0x1f2e, bit: 4, label: "Mushu" }, // prettier-ignore
                                { offset: 0x1f2e, bit: 0, label: "Genie" }, // prettier-ignore
                                { offset: 0x1f2e, bit: 3, label: "Tinker Bell" }, // prettier-ignore
                                { offset: 0x1f2e, bit: 5, label: "Cloud" }, // prettier-ignore
                              ],
                            },
                          ],
                        },
                        {
                          id: "soraOnly-%index%",
                          type: "section",
                          items: [
                            {
                              id: "soraOnly-%index%",
                              name: "Item Cards",
                              type: "bitflags",
                              flags: [
                                { offset: 0x1f2e, bit: 6, label: "Potion" }, // prettier-ignore
                                { offset: 0x1f2e, bit: 7, label: "Hi-Potion" }, // prettier-ignore
                                { offset: 0x1f2f, bit: 0, label: "Mega-Potion" }, // prettier-ignore
                                { offset: 0x1f2f, bit: 1, label: "Ether" }, // prettier-ignore
                                { offset: 0x1f2f, bit: 2, label: "Mega-Ether" }, // prettier-ignore
                                { offset: 0x1f2f, bit: 3, label: "Elixir" }, // prettier-ignore
                                { offset: 0x1f2f, bit: 4, label: "Megalixir" }, // prettier-ignore
                              ],
                            },
                            {
                              id: "soraOnly-%index%",
                              name: "Friend Cards",
                              type: "bitflags",
                              flags: [
                                { offset: 0x1f2f, bit: 5, label: "Donald Duck" }, // prettier-ignore
                                { offset: 0x1f2f, bit: 6, label: "Goofy" }, // prettier-ignore
                                { offset: 0x1f2f, bit: 7, label: "Aladdin" }, // prettier-ignore
                                { offset: 0x1f30, bit: 1, label: "Jack" }, // prettier-ignore
                                { offset: 0x1f30, bit: 0, label: "Ariel" }, // prettier-ignore
                                { offset: 0x1f30, bit: 2, label: "Peter Pan" }, // prettier-ignore
                                { offset: 0x1f30, bit: 3, label: "The Beast" }, // prettier-ignore
                              ],
                            },
                            {
                              id: "soraOnly-%index%",
                              name: "Premium Cards",
                              type: "bitflags",
                              flags: [
                                { offset: 0x1f3a, bit: 5, label: "About Premium Cards" }, // prettier-ignore
                              ],
                            },
                          ],
                        },
                        {
                          id: "soraOnly-%index%",
                          name: "Enemy Cards",
                          type: "bitflags",
                          flags: [
                            { offset: 0x1f30, bit: 4, label: "Shadow" }, // prettier-ignore
                            { offset: 0x1f31, bit: 4, label: "Soldier" }, // prettier-ignore
                            { offset: 0x1f33, bit: 4, label: "Large Body" }, // prettier-ignore
                            { offset: 0x1f30, bit: 5, label: "Red Nocturne" }, // prettier-ignore
                            { offset: 0x1f30, bit: 6, label: "Blue Rhapsody" }, // prettier-ignore
                            { offset: 0x1f30, bit: 7, label: "Yellow Opera" }, // prettier-ignore
                            { offset: 0x1f31, bit: 0, label: "Green Requiem" }, // prettier-ignore
                            { offset: 0x1f31, bit: 5, label: "Powerwild" }, // prettier-ignore
                            { offset: 0x1f31, bit: 6, label: "Bouncywild" }, // prettier-ignore
                            { offset: 0x1f31, bit: 7, label: "Air Soldier" }, // prettier-ignore
                            { offset: 0x1f32, bit: 0, label: "Bandit" }, // prettier-ignore
                            { offset: 0x1f33, bit: 5, label: "Fat Bandit" }, // prettier-ignore
                            { offset: 0x1f32, bit: 1, label: "Barrel Spider" }, // prettier-ignore
                            { offset: 0x1f32, bit: 2, label: "Search Ghost" }, // prettier-ignore
                            { offset: 0x1f31, bit: 1, label: "Sea Neon" }, // prettier-ignore
                            { offset: 0x1f32, bit: 3, label: "Screwdiver" }, // prettier-ignore
                            { offset: 0x1f33, bit: 6, label: "Aquatank" }, // prettier-ignore
                            { offset: 0x1f32, bit: 4, label: "Wight Knight" }, // prettier-ignore
                            { offset: 0x1f32, bit: 5, label: "Gargoyle" }, // prettier-ignore
                            { offset: 0x1f32, bit: 6, label: "Pirate" }, // prettier-ignore
                            { offset: 0x1f32, bit: 7, label: "Air Pirate" }, // prettier-ignore
                            { offset: 0x1f33, bit: 0, label: "Darkball" }, // prettier-ignore
                            { offset: 0x1f33, bit: 7, label: "Defender" }, // prettier-ignore
                            { offset: 0x1f33, bit: 1, label: "Wyvern" }, // prettier-ignore
                            { offset: 0x1f33, bit: 2, label: "Wizard" }, // prettier-ignore
                            { offset: 0x1f33, bit: 3, label: "Neoshadow" }, // prettier-ignore
                            { offset: 0x1f31, bit: 2, label: "White Mushroom" }, // prettier-ignore
                            { offset: 0x1f31, bit: 3, label: "Black Fungus" }, // prettier-ignore
                            { offset: 0x1f34, bit: 2, label: "Creeper Plant" }, // prettier-ignore
                            { offset: 0x1f34, bit: 0, label: "Tornado Step" }, // prettier-ignore
                            { offset: 0x1f34, bit: 1, label: "Crescendo" }, // prettier-ignore
                            { offset: 0x1f34, bit: 3, label: "Guard Armor" }, // prettier-ignore
                            { offset: 0x1f35, bit: 1, label: "Parasite Cage" }, // prettier-ignore
                            { offset: 0x1f34, bit: 5, label: "Trickmaster" }, // prettier-ignore
                            { offset: 0x1f35, bit: 4, label: "Darkside" }, // prettier-ignore
                            { offset: 0x1f3a, bit: 6, label: "Card Soldier" }, // prettier-ignore
                            { offset: 0x1f34, bit: 4, label: "Hades" }, // prettier-ignore
                            { offset: 0x1f34, bit: 6, label: "Jafar" }, // prettier-ignore
                            { offset: 0x1f35, bit: 0, label: "Oogie Boogie" }, // prettier-ignore
                            { offset: 0x1f34, bit: 7, label: "Ursula" }, // prettier-ignore
                            { offset: 0x1f35, bit: 2, label: "Hook" }, // prettier-ignore
                            { offset: 0x1f35, bit: 3, label: "Dragon Maleficent" }, // prettier-ignore
                            { offset: 0x1f3a, bit: 7, label: "Riku" }, // prettier-ignore
                            { offset: 0x1f35, bit: 6, label: "Axel" }, // prettier-ignore
                            { offset: 0x1f35, bit: 5, label: "Larxene" }, // prettier-ignore
                            { offset: 0x1f35, bit: 7, label: "Vexen" }, // prettier-ignore
                            { offset: 0x1f36, bit: 0, label: "Marluxia" }, // prettier-ignore
                            { offset: 0x1f3b, bit: 0, label: "Lexaeus" }, // prettier-ignore
                            { offset: 0x1f3b, bit: 1, label: "Ansem" }, // prettier-ignore
                          ],
                        },
                        {
                          id: "soraOnly-%index%",
                          name: "Map Cards",
                          type: "bitflags",
                          flags: [
                            { offset: 0x1f36, bit: 2, label: "Tranquil Darkness" }, // prettier-ignore
                            { offset: 0x1f36, bit: 1, label: "Teeming Darkness" }, // prettier-ignore
                            { offset: 0x1f36, bit: 3, label: "Guarded Trove" }, // prettier-ignore
                            { offset: 0x1f36, bit: 4, label: "Looming Darkness" }, // prettier-ignore
                            { offset: 0x1f36, bit: 5, label: "Sleeping Darkness" }, // prettier-ignore
                            { offset: 0x1f36, bit: 6, label: "Moment's Reprieve" }, // prettier-ignore
                            { offset: 0x1f36, bit: 7, label: "Feeble Darkness" }, // prettier-ignore
                            { offset: 0x1f37, bit: 0, label: "Almighty Darkness" }, // prettier-ignore
                            { offset: 0x1f37, bit: 1, label: "Calm Bounty" }, // prettier-ignore
                            { offset: 0x1f37, bit: 2, label: "False Bounty" }, // prettier-ignore
                            { offset: 0x1f37, bit: 3, label: "Moogle Room" }, // prettier-ignore
                            { offset: 0x1f37, bit: 4, label: "Sorcerous Waking" }, // prettier-ignore
                            { offset: 0x1f37, bit: 5, label: "Martial Waking" }, // prettier-ignore
                            { offset: 0x1f37, bit: 6, label: "Alchemic Waking" }, // prettier-ignore
                            { offset: 0x1f37, bit: 7, label: "Meeting Ground" }, // prettier-ignore
                            { offset: 0x1f38, bit: 0, label: "Mingling Worlds" }, // prettier-ignore
                            { offset: 0x1f38, bit: 1, label: "Strong Initiative" }, // prettier-ignore
                            { offset: 0x1f38, bit: 2, label: "Lasting Daze" }, // prettier-ignore
                            { offset: 0x1f38, bit: 3, label: "Stagnant Space" }, // prettier-ignore
                            { offset: 0x1f38, bit: 4, label: "Premium Room" }, // prettier-ignore
                            { offset: 0x1f38, bit: 5, label: "White Room" }, // prettier-ignore
                            { offset: 0x1f38, bit: 6, label: "Black Room" }, // prettier-ignore
                            { offset: 0x1f38, bit: 7, label: "Key of Beginnings" }, // prettier-ignore
                            { offset: 0x1f39, bit: 0, label: "Key of Guidance" }, // prettier-ignore
                            { offset: 0x1f39, bit: 1, label: "Key to Truth" }, // prettier-ignore
                            { offset: 0x1f39, bit: 2, label: "Key to Rewards" }, // prettier-ignore
                          ],
                        },
                        {
                          id: "rikuOnly-%index%",
                          type: "bitflags",
                          flags: [
                            { offset: 0x1f3a, bit: 3, label: "Soul Eater" }, // prettier-ignore
                            { offset: 0x1f3a, bit: 4, label: "The King" }, // prettier-ignore
                            { offset: 0x1f30, bit: 4, label: "Shadow" }, // prettier-ignore
                            { offset: 0x1f33, bit: 4, label: "Large Body" }, // prettier-ignore
                            { offset: 0x1f31, bit: 5, label: "Powerwild" }, // prettier-ignore
                            { offset: 0x1f33, bit: 5, label: "Fat Bandit" }, // prettier-ignore
                            { offset: 0x1f32, bit: 2, label: "Search Ghost" }, // prettier-ignore
                            { offset: 0x1f31, bit: 1, label: "Sea Neon" }, // prettier-ignore
                            { offset: 0x1f32, bit: 4, label: "Wight Knight" }, // prettier-ignore
                            { offset: 0x1f32, bit: 6, label: "Pirate" }, // prettier-ignore
                            { offset: 0x1f33, bit: 7, label: "Defender" }, // prettier-ignore
                            { offset: 0x1f34, bit: 3, label: "Guard Armor" }, // prettier-ignore
                            { offset: 0x1f35, bit: 1, label: "Parasite Cage" }, // prettier-ignore
                            { offset: 0x1f34, bit: 5, label: "Trickmaster" }, // prettier-ignore
                            { offset: 0x1f35, bit: 4, label: "Darkside" }, // prettier-ignore
                            { offset: 0x1f34, bit: 4, label: "Hades" }, // prettier-ignore
                            { offset: 0x1f34, bit: 6, label: "Jafar" }, // prettier-ignore
                            { offset: 0x1f35, bit: 0, label: "Oogie Boogie" }, // prettier-ignore
                            { offset: 0x1f34, bit: 7, label: "Ursula" }, // prettier-ignore
                            { offset: 0x1f35, bit: 2, label: "Hook" }, // prettier-ignore
                            { offset: 0x1f35, bit: 3, label: "Dragon Maleficent" }, // prettier-ignore
                            { offset: 0x1f3b, bit: 0, label: "Lexaeus" }, // prettier-ignore
                          ],
                        },
                      ],
                    },
                    {
                      name: "Characters",
                      flex: true,
                      items: [
                        {
                          id: "soraOnly-%index%",
                          name: "Characters I",
                          type: "bitflags",
                          flags: [
                            { offset: 0x1f1e, bit: 1, label: "Sora" }, // prettier-ignore
                            { offset: 0x1f1e, bit: 2, label: "Donald Duck" }, // prettier-ignore
                            { offset: 0x1f1e, bit: 3, label: "Goofy" }, // prettier-ignore
                            { offset: 0x1f1e, bit: 4, label: "Jiminy Cricket" }, // prettier-ignore
                            { offset: 0x1f1e, bit: 5, label: "Riku" }, // prettier-ignore
                            { offset: 0x1f1e, bit: 6, label: "Kairi" }, // prettier-ignore
                            { offset: 0x1f1e, bit: 7, label: "Simba" }, // prettier-ignore
                            { offset: 0x1f1f, bit: 0, label: "Dumbo" }, // prettier-ignore
                            { offset: 0x1f1f, bit: 1, label: "Bambi" }, // prettier-ignore
                            { offset: 0x1f1f, bit: 2, label: "Mushu" }, // prettier-ignore
                            { offset: 0x1f1f, bit: 3, label: "The Moogles" }, // prettier-ignore
                            { offset: 0x1f1f, bit: 4, label: "Leon" }, // prettier-ignore
                            { offset: 0x1f1f, bit: 5, label: "Yuffie" }, // prettier-ignore
                            { offset: 0x1f1f, bit: 6, label: "Aerith" }, // prettier-ignore
                            { offset: 0x1f1f, bit: 7, label: "Cid" }, // prettier-ignore
                            { offset: 0x1f20, bit: 0, label: "Cloud" }, // prettier-ignore
                            { offset: 0x1f20, bit: 1, label: "Tidus" }, // prettier-ignore
                            { offset: 0x1f20, bit: 2, label: "Wakka" }, // prettier-ignore
                            { offset: 0x1f20, bit: 3, label: "Selphie" }, // prettier-ignore
                            { offset: 0x1f20, bit: 4, label: "Naminé" }, // prettier-ignore
                            { offset: 0x1f20, bit: 5, label: "Riku Replica" }, // prettier-ignore
                            { offset: 0x1f20, bit: 6, label: "Axel" }, // prettier-ignore
                            { offset: 0x1f20, bit: 7, label: "Larxene" }, // prettier-ignore
                            { offset: 0x1f21, bit: 0, label: "Vexen" }, // prettier-ignore
                            { offset: 0x1f21, bit: 1, label: "Marluxia" }, // prettier-ignore
                          ],
                        },
                        {
                          id: "soraOnly-%index%",
                          name: "Characters II",
                          type: "bitflags",
                          flags: [
                            { offset: 0x1f21, bit: 2, label: "Alice" }, // prettier-ignore
                            { offset: 0x1f21, bit: 3, label: "The Queen of Hearts" }, // prettier-ignore
                            { offset: 0x1f21, bit: 4, label: "The White Rabbit" }, // prettier-ignore
                            { offset: 0x1f21, bit: 5, label: "Card of Hearts" }, // prettier-ignore
                            { offset: 0x1f21, bit: 6, label: "Card of Spades" }, // prettier-ignore
                            { offset: 0x1f21, bit: 7, label: "The Cheshire Cat" }, // prettier-ignore
                            { offset: 0x1f22, bit: 0, label: "Hercules" }, // prettier-ignore
                            { offset: 0x1f22, bit: 1, label: "Philoctetes" }, // prettier-ignore
                            { offset: 0x1f22, bit: 2, label: "Hades" }, // prettier-ignore
                            { offset: 0x1f22, bit: 3, label: "Aladdin" }, // prettier-ignore
                            { offset: 0x1f22, bit: 4, label: "Genie" }, // prettier-ignore
                            { offset: 0x1f22, bit: 6, label: "Jasmine" }, // prettier-ignore
                            { offset: 0x1f22, bit: 7, label: "Iago" }, // prettier-ignore
                            { offset: 0x1f23, bit: 0, label: "Jafar" }, // prettier-ignore
                            { offset: 0x1f23, bit: 1, label: "Jafar (Genie)" }, // prettier-ignore
                            { offset: 0x1f23, bit: 2, label: "Jack" }, // prettier-ignore
                            { offset: 0x1f23, bit: 3, label: "Sally" }, // prettier-ignore
                            { offset: 0x1f23, bit: 4, label: "Dr. Finkelstein" }, // prettier-ignore
                            { offset: 0x1f23, bit: 5, label: "Oogie Boogie" }, // prettier-ignore
                            { offset: 0x1f23, bit: 6, label: "Pinocchio" }, // prettier-ignore
                            { offset: 0x1f23, bit: 7, label: "Geppetto" }, // prettier-ignore
                            { offset: 0x1f24, bit: 0, label: "Ariel" }, // prettier-ignore
                            { offset: 0x1f24, bit: 1, label: "Sebastian" }, // prettier-ignore
                            { offset: 0x1f24, bit: 2, label: "Flounder" }, // prettier-ignore
                            { offset: 0x1f24, bit: 3, label: "Ursula" }, // prettier-ignore
                            { offset: 0x1f24, bit: 5, label: "Peter Pan" }, // prettier-ignore
                            { offset: 0x1f24, bit: 6, label: "Tinker Bell" }, // prettier-ignore
                            { offset: 0x1f24, bit: 7, label: "Wendy" }, // prettier-ignore
                            { offset: 0x1f25, bit: 0, label: "Hook" }, // prettier-ignore
                            { offset: 0x1f25, bit: 1, label: "The Beast" }, // prettier-ignore
                            { offset: 0x1f25, bit: 2, label: "Belle" }, // prettier-ignore
                            { offset: 0x1f25, bit: 3, label: "Maleficent" }, // prettier-ignore
                            { offset: 0x1f25, bit: 4, label: "Dragon Maleficent" }, // prettier-ignore
                            { offset: 0x1f25, bit: 5, label: "Winnie the Pooh" }, // prettier-ignore
                            { offset: 0x1f25, bit: 6, label: "Piglet" }, // prettier-ignore
                            { offset: 0x1f25, bit: 7, label: "Owl" }, // prettier-ignore
                            { offset: 0x1f26, bit: 0, label: "Roo" }, // prettier-ignore
                            { offset: 0x1f26, bit: 1, label: "Eeyore" }, // prettier-ignore
                            { offset: 0x1f26, bit: 2, label: "Tigger" }, // prettier-ignore
                            { offset: 0x1f26, bit: 3, label: "Rabbit" }, // prettier-ignore
                          ],
                        },
                        {
                          id: "soraOnly-%index%",
                          name: "The Heartless",
                          type: "bitflags",
                          flags: [
                            { offset: 0x1f26, bit: 4, label: "Shadow" }, // prettier-ignore
                            { offset: 0x1f26, bit: 5, label: "Soldier" }, // prettier-ignore
                            { offset: 0x1f26, bit: 6, label: "Large Body" }, // prettier-ignore
                            { offset: 0x1f26, bit: 7, label: "Red Nocturne" }, // prettier-ignore
                            { offset: 0x1f27, bit: 0, label: "Blue Rhapsody" }, // prettier-ignore
                            { offset: 0x1f27, bit: 1, label: "Yellow Opera" }, // prettier-ignore
                            { offset: 0x1f27, bit: 2, label: "Green Requiem" }, // prettier-ignore
                            { offset: 0x1f27, bit: 3, label: "Powerwild" }, // prettier-ignore
                            { offset: 0x1f27, bit: 4, label: "Bouncywild" }, // prettier-ignore
                            { offset: 0x1f27, bit: 5, label: "Air Soldier" }, // prettier-ignore
                            { offset: 0x1f27, bit: 6, label: "Bandit" }, // prettier-ignore
                            { offset: 0x1f27, bit: 7, label: "Fat Bandit" }, // prettier-ignore
                            { offset: 0x1f28, bit: 0, label: "Barrel Spider" }, // prettier-ignore
                            { offset: 0x1f28, bit: 1, label: "Search Ghost" }, // prettier-ignore
                            { offset: 0x1f28, bit: 2, label: "Sea Neon" }, // prettier-ignore
                            { offset: 0x1f28, bit: 3, label: "Screwdiver" }, // prettier-ignore
                            { offset: 0x1f28, bit: 4, label: "Aquatank" }, // prettier-ignore
                            { offset: 0x1f28, bit: 5, label: "Wight Knight" }, // prettier-ignore
                            { offset: 0x1f28, bit: 6, label: "Gargoyle" }, // prettier-ignore
                            { offset: 0x1f28, bit: 7, label: "Pirate" }, // prettier-ignore
                            { offset: 0x1f29, bit: 0, label: "Air Pirate" }, // prettier-ignore
                            { offset: 0x1f29, bit: 1, label: "Darkball" }, // prettier-ignore
                            { offset: 0x1f29, bit: 2, label: "Defender" }, // prettier-ignore
                            { offset: 0x1f29, bit: 3, label: "Wyvern" }, // prettier-ignore
                            { offset: 0x1f29, bit: 4, label: "Wizard" }, // prettier-ignore
                            { offset: 0x1f29, bit: 5, label: "Neoshadow" }, // prettier-ignore
                            { offset: 0x1f29, bit: 6, label: "White Mushroom" }, // prettier-ignore
                            { offset: 0x1f29, bit: 7, label: "Black Fungus" }, // prettier-ignore
                            { offset: 0x1f2a, bit: 0, label: "Creeper Plant" }, // prettier-ignore
                            { offset: 0x1f2a, bit: 1, label: "Tornado Step" }, // prettier-ignore
                            { offset: 0x1f2a, bit: 2, label: "Crescendo" }, // prettier-ignore
                            { offset: 0x1f2a, bit: 3, label: "Guard Armor" }, // prettier-ignore
                            { offset: 0x1f2a, bit: 4, label: "Parasite Cage" }, // prettier-ignore
                            { offset: 0x1f2a, bit: 5, label: "Trickmaster" }, // prettier-ignore
                            { offset: 0x1f2a, bit: 6, label: "Darkside" }, // prettier-ignore
                          ],
                        },
                        {
                          id: "rikuOnly-%index%",
                          name: "Characters I",
                          type: "bitflags",
                          flags: [
                            { offset: 0x1f1e, bit: 5, label: "Riku" }, // prettier-ignore
                            { offset: 0x1f39, bit: 5, label: "The King" }, // prettier-ignore
                            { offset: 0x1f1e, bit: 1, label: "Sora" }, // prettier-ignore
                            { offset: 0x1f1e, bit: 6, label: "Kairi" }, // prettier-ignore
                            { offset: 0x1f20, bit: 4, label: "Naminé" }, // prettier-ignore
                            { offset: 0x1f39, bit: 6, label: "Riku Replica" }, // prettier-ignore
                            { offset: 0x1f39, bit: 7, label: "Ansem" }, // prettier-ignore
                            { offset: 0x1f21, bit: 0, label: "Vexen" }, // prettier-ignore
                            { offset: 0x1f3a, bit: 0, label: "Lexaeus" }, // prettier-ignore
                            { offset: 0x1f3a, bit: 1, label: "Zexion" }, // prettier-ignore
                            { offset: 0x1f20, bit: 6, label: "Axel" }, // prettier-ignore
                            { offset: 0x1f21, bit: 1, label: "Marluxia" }, // prettier-ignore
                            { offset: 0x1f20, bit: 7, label: "Larxene" }, // prettier-ignore
                            { offset: 0x1f3a, bit: 2, label: "DiZ" }, // prettier-ignore
                          ],
                        },
                        {
                          id: "rikuOnly-%index%",
                          name: "Characters II",
                          type: "bitflags",
                          flags: [
                            { offset: 0x1f25, bit: 3, label: "Maleficent" }, // prettier-ignore
                            { offset: 0x1f23, bit: 1, label: "Jafar (Genie)" }, // prettier-ignore
                            { offset: 0x1f24, bit: 3, label: "Ursula" }, // prettier-ignore
                            { offset: 0x1f22, bit: 2, label: "Hades" }, // prettier-ignore
                            { offset: 0x1f23, bit: 5, label: "Oogie Boogie" }, // prettier-ignore
                            { offset: 0x1f25, bit: 0, label: "Hook" }, // prettier-ignore
                          ],
                        },
                        {
                          id: "rikuOnly-%index%",
                          name: "The Heartless",
                          type: "bitflags",
                          flags: [
                            { offset: 0x1f26, bit: 4, label: "Shadow" }, // prettier-ignore
                            { offset: 0x1f26, bit: 5, label: "Soldier" }, // prettier-ignore
                            { offset: 0x1f26, bit: 6, label: "Large Body" }, // prettier-ignore
                            { offset: 0x1f26, bit: 7, label: "Red Nocturne" }, // prettier-ignore
                            { offset: 0x1f27, bit: 0, label: "Blue Rhapsody" }, // prettier-ignore
                            { offset: 0x1f27, bit: 1, label: "Yellow Opera" }, // prettier-ignore
                            { offset: 0x1f27, bit: 2, label: "Green Requiem" }, // prettier-ignore
                            { offset: 0x1f27, bit: 3, label: "Powerwild" }, // prettier-ignore
                            { offset: 0x1f27, bit: 4, label: "Bouncywild" }, // prettier-ignore
                            { offset: 0x1f27, bit: 5, label: "Air Soldier" }, // prettier-ignore
                            { offset: 0x1f27, bit: 6, label: "Bandit" }, // prettier-ignore
                            { offset: 0x1f27, bit: 7, label: "Fat Bandit" }, // prettier-ignore
                            { offset: 0x1f28, bit: 0, label: "Barrel Spider" }, // prettier-ignore
                            { offset: 0x1f28, bit: 1, label: "Search Ghost" }, // prettier-ignore
                            { offset: 0x1f28, bit: 2, label: "Sea Neon" }, // prettier-ignore
                            { offset: 0x1f28, bit: 3, label: "Screwdiver" }, // prettier-ignore
                            { offset: 0x1f28, bit: 4, label: "Aquatank" }, // prettier-ignore
                            { offset: 0x1f28, bit: 5, label: "Wight Knight" }, // prettier-ignore
                            { offset: 0x1f28, bit: 6, label: "Gargoyle" }, // prettier-ignore
                            { offset: 0x1f28, bit: 7, label: "Pirate" }, // prettier-ignore
                            { offset: 0x1f29, bit: 0, label: "Air Pirate" }, // prettier-ignore
                            { offset: 0x1f29, bit: 1, label: "Darkball" }, // prettier-ignore
                            { offset: 0x1f29, bit: 2, label: "Defender" }, // prettier-ignore
                            { offset: 0x1f29, bit: 3, label: "Wyvern" }, // prettier-ignore
                            { offset: 0x1f29, bit: 4, label: "Wizard" }, // prettier-ignore
                            { offset: 0x1f29, bit: 5, label: "Neoshadow" }, // prettier-ignore
                            { offset: 0x1f2a, bit: 0, label: "Creeper Plant" }, // prettier-ignore
                            { offset: 0x1f2a, bit: 1, label: "Tornado Step" }, // prettier-ignore
                            { offset: 0x1f2a, bit: 2, label: "Crescendo" }, // prettier-ignore
                            { offset: 0x1f2a, bit: 3, label: "Guard Armor" }, // prettier-ignore
                            { offset: 0x1f2a, bit: 4, label: "Parasite Cage" }, // prettier-ignore
                            { offset: 0x1f2a, bit: 5, label: "Trickmaster" }, // prettier-ignore
                            { offset: 0x1f2a, bit: 6, label: "Darkside" }, // prettier-ignore
                          ],
                        },
                      ],
                    },
                  ],
                },
              ],
            },
            {
              name: "Worlds",
              items: [
                {
                  id: "worlds-%index%",
                  length: 0x4,
                  type: "container",
                  instanceType: "section",
                  instances: 12,
                  resource: "rikuFloors",
                  flex: true,
                  items: [
                    {
                      name: "???",
                      offset: 0x2195,
                      type: "variable",
                      dataType: "uint8",
                      hidden: true,
                    },
                    {
                      name: "World",
                      offset: 0x2196,
                      type: "variable",
                      dataType: "uint8",
                      resource: "worlds",
                      autocomplete: true,
                    },
                    {
                      name: "Progression",
                      offset: 0x2197,
                      type: "variable",
                      dataType: "uint8",
                      resource: "worldProgressions",
                    },
                    {
                      name: "Events",
                      type: "bitflags",
                      flags: [
                        { offset: 0x2194, bit: 1, label: "World introduction seen" }, // prettier-ignore
                        { offset: 0x2194, bit: 4, label: "Location visited" }, // prettier-ignore
                        { offset: 0x2194, bit: 3, label: "Set when key is used (temporary)", hidden: true }, // prettier-ignore
                        { offset: 0x2194, bit: 5, label: "Boss defeated?", hidden: true }, // prettier-ignore
                        { offset: 0x2194, bit: 2, label: "End floor event seen" }, // prettier-ignore
                        { offset: 0x2194, bit: 0, label: "Next floor introduction seen" }, // prettier-ignore
                        { offset: 0x2194, bit: 6, label: "???", hidden: true }, // prettier-ignore
                        { offset: 0x2194, bit: 7, label: "???", hidden: true }, // prettier-ignore
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
    booleanEnabled: {
      0x0: "-",
      0x1: "Enabled",
    },
    booleanUnlocked: {
      0x0: "-",
      0x1: "Unlocked",
    },
    deckNames: "getDeckNames(2)",
    rikuFloors: {
      0x0: "B12",
      0x1: "B11",
      0x2: "B10",
      0x3: "B9",
      0x4: "B8",
      0x5: "B7",
      0x6: "B6",
      0x7: "B5",
      0x8: "B4",
      0x9: "B3",
      0xa: "B2",
      0xb: "B1",
    },
    rikuProgressions: {
      0x0: "B12 Reached",
      0x1: "B12 Cleared",
      0x2: "B11 Reached",
      0x3: "B11 Cleared",
      0x4: "B10 Reached",
      0x5: "B10 Cleared",
      0x6: "B9 Reached",
      0x7: "B9 Cleared",
      0x8: "B8 Reached",
      0x9: "B8 Cleared",
      0xa: "B7 Reached",
      0xb: "B7 Cleared",
      0xc: "B6 Reached",
      0xd: "B6 Cleared",
      0xe: "B5 Reached",
      0xf: "B5 Cleared",
      0x10: "B4 Reached",
      0x11: "B4 Cleared",
      0x12: "B3 Reached",
      0x13: "B3 Cleared",
      0x14: "B2 Reached",
      0x15: "B2 Twilight Town reached",
      0x16: "B1 Reached",
      0x17: "B1 Castle Oblivion reached",
    },
    rooms: {
      0x0: "Room 1",
      0x1: "Room 2",
      0x2: "Room 3",
      0x3: "Room 4",
      0x4: "Room 5",
      0x5: "Room 6",
      0x6: "Room 7",
      0x7: "Room 8",
      0x8: "Room 9",
      0x9: "Room 10",
      0xa: "Room 11",
      0xb: "Room 12",
      0xc: "Room 13",
      0xd: "Room 14",
      0xe: "Room 15",
      0xf: "Room 16",
      0x10: "Room 17",
      0x11: "Room 18",
      0x12: "Room 19",
      0x13: "Room 20",
      0x14: "Room 21",
      0x15: "Room 22",
      0x16: "Room 23",
      0x17: "Room 24",
      0x18: "Room 25",
      0x19: "Room 26",
      0x1a: "Room 27",
      0x1b: "Room 28",
      0x1c: "Room 29",
      0x1d: "Room 30",
      0x1e: "Room 31",
      0x1f: "Room 32",
      0xfd: "Floor Exit",
      0xfe: "Floor Entrance",
    },
    slots: {
      0x0: "Riku 1",
      0x1: "Riku 2",
      0x2: "Sora 1",
      0x3: "Sora 2",
    },
    soraFloors: {
      0x0: "1F",
      0x1: "2F",
      0x2: "3F",
      0x3: "4F",
      0x4: "5F",
      0x5: "6F",
      0x6: "7F",
      0x7: "8F",
      0x8: "9F",
      0x9: "10F",
      0xa: "11F",
      0xb: "12F",
      0xc: "13F",
    },
    soraProgressions: {
      0x0: "1F Reached",
      0x1: "1F Cleared",
      0x2: "2F Reached",
      0x3: "2F Cleared",
      0x4: "3F Reached",
      0x5: "3F Cleared",
      0x6: "4F Reached",
      0x7: "4F Cleared",
      0x8: "5F Reached",
      0x9: "5F Cleared",
      0xa: "6F Reached",
      0xb: "6F Cleared",
      0xc: "7F Reached",
      0xd: "7F Cleared",
      0xe: "8F Reached",
      0xf: "8F Cleared",
      0x10: "9F Reached",
      0x11: "9F Cleared",
      0x12: "10F Reached",
      0x13: "10F Cleared",
      0x14: "11F Reached",
      0x15: "11F Cleared",
      0x16: "12F Reached",
      0x17: "12F Riku Replica defeated",
      0x18: "12F Cleared",
      0x19: "13F Reached",
      0x1a: "13F Castle Oblivion reached",
      0x1b: "13F Marluxia (1) defeated",
    },
    spawns: {
      0x0: "Top Right",
      0x1: "Bottom Left",
      0x2: "Bottom Right",
      0x3: "Top Left",
    },
    titleScreens: {
      0x0: "Default",
      0x1: "Reverse/Rebirth",
    },
    worlds: {
      0x0: "-",
      0x1: "Agrabah",
      0x2: "Atlantica",
      0x3: "Olympus Coliseum",
      0x4: "Wonderland",
      0x5: "Monstro",
      0x6: "Halloween Town",
      0x7: "Never Land",
      0x8: "Hollow Bastion",
      0x9: "Destiny Islands",
      0xa: "Traverse Town",
      0xb: "Twilight Town",
      0xc: "Castle Oblivion",
      0xd: "100 Acre Wood",
    },
  },
  resourcesLabels: {
    rikuProgressions: {
      0x0: "B12",
      0x2: "B11",
      0x4: "B10",
      0x6: "B9",
      0x8: "B8",
      0xa: "B7",
      0xc: "B6",
      0xe: "B5",
      0x10: "B4",
      0x12: "B3",
      0x14: "B2",
      0x16: "B1",
    },
    soraProgressions: {
      0x0: "1F",
      0x2: "2F",
      0x4: "3F",
      0x6: "4F",
      0x8: "5F",
      0xa: "6F",
      0xc: "7F",
      0xe: "8F",
      0x10: "9F",
      0x12: "10F",
      0x14: "11F",
      0x16: "12F",
      0x19: "13F",
    },
  },
  resourcesOrder: {
    rooms: [
      0xfe, 0x0, 0x1, 0x2, 0x3, 0x4, 0x5, 0x6, 0x7, 0x8, 0x9, 0xa, 0xb, 0xc,
      0xd, 0xe, 0xf, 0x10, 0x11, 0x12, 0x13, 0x14, 0x15, 0x16, 0x17, 0x18, 0x19,
      0x1a, 0x1b, 0x1c, 0x1d, 0x1e, 0x1f, 0xfd,
    ],
    slots: [0x0, 0x3, 0x4, 0x1, 0x2],
  },
};

export default template;
