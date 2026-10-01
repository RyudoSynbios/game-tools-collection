import { bitToOffset } from "$lib/utils/bytes";

import type { GameJson } from "$lib/types";

import { enemyList, itemList } from "./utils/resource";

const template: GameJson = {
  validator: {
    platforms: {
      playstation2: {
        europe: {
          0x0: [
            0x42, 0x45, 0x53, 0x4c, 0x45, 0x53, 0x2d, 0x35, 0x30, 0x33, 0x35,
            0x38,
          ], // "BESLES-50358"
        },
        usa: {
          0x0: [
            0x42, 0x41, 0x53, 0x4c, 0x55, 0x53, 0x2d, 0x32, 0x30, 0x32, 0x31,
            0x36,
          ], // "BASLUS-20216"
        },
        japan: {
          0x0: [
            0x42, 0x49, 0x53, 0x4c, 0x50, 0x4d, 0x2d, 0x36, 0x35, 0x30, 0x33,
            0x38,
          ], // "BISLPM-65038"
        },
        korea: {
          0x0: [
            0x42, 0x49, 0x53, 0x4c, 0x50, 0x4d, 0x2d, 0x36, 0x37, 0x35, 0x30,
            0x32,
          ], // "BISLPM-67502"
        },
      },
      hdCollection: {
        europe: {},
      },
    },
    text: "Drag 'n' drop here or click to add a save file.",
    error: "Not a valid save file.",
  },
  items: [
    {
      id: "slots",
      length: 0x970,
      type: "container",
      instanceType: "tabs",
      instances: 10,
      enumeration: "Slot %d",
      disableSubinstanceIf: {
        offset: 0x8,
        type: "variable",
        dataType: "uint32",
        operator: "=",
        value: 0x0,
      },
      prependSubinstance: [
        {
          name: "System",
          items: [
            {
              id: "system",
              length: 0x0,
              type: "container",
              instanceType: "section",
              instances: 1,
              items: [
                {
                  name: "Checksum",
                  offset: 0x0,
                  type: "checksum",
                  dataType: "uint32",
                  control: {
                    offsetStart: 0x4,
                    offsetEnd: 0x104,
                  },
                },
                {
                  type: "section",
                  flex: true,
                  items: [
                    {
                      name: "Game Clear Once",
                      offset: 0xb,
                      type: "variable",
                      dataType: "bit",
                      bit: 0,
                      hidden: true,
                      test: true,
                    },
                    {
                      id: "unlockedCharacters",
                      name: "Unlocked Characters",
                      type: "bitflags",
                      flags: [
                        { offset: 0xb, bit: 6, label: "Allow to change character", hidden: true },
                        { offset: 0xb, bit: 5, label: "Legendary Dark Knight" },
                        { offset: 0xb, bit: 4, label: "Super Dante" },
                      ],
                    },
                    {
                      name: "Unlocked Difficulties",
                      type: "bitflags",
                      flags: [
                        { offset: 0xb, bit: 2, label: "Easy Automatic" },
                        { offset: 0xb, bit: 7, label: "Hard" },
                        { offset: 0xb, bit: 7, label: "Dante Must Die!" },
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
          name: "Checksum",
          offset: 0x8,
          type: "checksum",
          dataType: "uint32",
          control: {
            offsetStart: 0x10,
            offsetEnd: 0x970,
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
                      name: "Clear Count",
                      offset: 0x22,
                      type: "variable",
                      dataType: "uint16",
                      max: 99,
                    },
                    {
                      name: "Save Count",
                      offset: 0x20,
                      type: "variable",
                      dataType: "uint16",
                      test: true,
                    },
                    {
                      name: "Total Playtime",
                      type: "group",
                      mode: "time",
                      items: [
                        {
                          offset: 0x2c,
                          type: "variable",
                          dataType: "uint32",
                          operations: [
                            { "/": 60 },
                            {
                              convert: { from: "seconds", to: "hours" },
                            },
                          ],
                          max: 999,
                        },
                        {
                          offset: 0x2c,
                          type: "variable",
                          dataType: "uint32",
                          operations: [
                            { "/": 60 },
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
                          offset: 0x2c,
                          type: "variable",
                          dataType: "uint32",
                          operations: [
                            { "/": 60 },
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
                  ],
                },
                {
                  type: "section",
                  flex: true,
                  items: [
                    {
                      name: "Character",
                      offset: 0x27,
                      type: "variable",
                      dataType: "uint8",
                      resource: "characters",
                    },
                    {
                      name: "Difficulty",
                      offset: 0x26,
                      type: "variable",
                      dataType: "uint8",
                      resource: "difficulties",
                    },
                    {
                      name: "Mission Playtime",
                      type: "group",
                      mode: "time",
                      hidden: true,
                      items: [
                        {
                          offset: 0x848,
                          type: "variable",
                          dataType: "uint32",
                          operations: [
                            { "/": 60 },
                            {
                              convert: { from: "seconds", to: "hours" },
                            },
                          ],
                          max: 999,
                        },
                        {
                          offset: 0x848,
                          type: "variable",
                          dataType: "uint32",
                          operations: [
                            { "/": 60 },
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
                          offset: 0x848,
                          type: "variable",
                          dataType: "uint32",
                          operations: [
                            { "/": 60 },
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
                      name: "Mission",
                      offset: 0x24,
                      type: "variable",
                      dataType: "uint8",
                      resource: "missions",
                    },
                  ],
                },
                {
                  type: "section",
                  flex: true,
                  items: [
                    {
                      name: "Max Health",
                      offset: 0x624,
                      type: "variable",
                      dataType: "uint8",
                      operations: [{ "*": 100 }],
                      min: 1000,
                      max: 3000,
                      step: 100,
                    },
                    {
                      name: "Devil Trigger Gauge",
                      type: "group",
                      mode: "fraction",
                      linked: true,
                      items: [
                        {
                          id: "current",
                          offset: 0x230,
                          type: "variable",
                          dataType: "uint16",
                          max: 1200,
                        },
                        {
                          offset: 0x625,
                          type: "variable",
                          dataType: "uint8",
                          operations: [{ "*": 120 }],
                          max: 1200,
                          step: 120,
                        },
                      ],
                    },
                    {
                      id: "equippedDevilArm",
                      name: "Equipped Devil Arm",
                      offset: 0x235,
                      type: "variable",
                      dataType: "uint8",
                      resource: "devilArms",
                      hint: "Equipping Yamato with Dante or Super Dante can cause the game to crash.",
                    },
                    {
                      name: "Equipped Gun",
                      offset: 0x236,
                      type: "variable",
                      dataType: "uint8",
                      resource: "guns",
                    },
                  ],
                },
              ],
            },
            {
              name: "Inventory",
              items: [
                {
                  name: "Item Count",
                  offset: 0x23b,
                  type: "variable",
                  dataType: "uint8",
                  hidden: true,
                },
                {
                  type: "section",
                  flex: true,
                  items: [
                    {
                      name: "Red Orbs",
                      offset: 0x634,
                      type: "variable",
                      dataType: "uint32",
                      max: 999999999,
                    },
                    {
                      name: "Yellow Orbs",
                      offset: 0x620,
                      type: "variable",
                      dataType: "uint16",
                      max: 999,
                    },
                    {
                      name: "Blue Orb Fragments",
                      offset: 0x638,
                      type: "variable",
                      dataType: "uint32",
                      max: 3,
                    },
                  ],
                },
                {
                  type: "section",
                  flex: true,
                  items: itemList
                    .filter((item) => item.type === 0x2)
                    .sort((a, b) => a.order - b.order)
                    .map((item) => ({
                      id: `item-variable-${item.index}`,
                      name: item.name,
                      offset: 0x250,
                      type: "variable",
                      dataType: "uint16",
                      max: 999,
                    })),
                },
                {
                  type: "section",
                  flex: true,
                  items: [
                    {
                      id: "item-bitflags",
                      name: "Guns",
                      type: "bitflags",
                      flags: itemList
                        .filter((item) => item.type === 0x0)
                        .sort((a, b) => a.order - b.order)
                        .map((item) => ({
                          offset: 0x250,
                          bit: item.index,
                          label: item.name,
                        })),
                    },
                    {
                      id: "item-bitflags",
                      name: "Devil Arms",
                      type: "bitflags",
                      flags: itemList
                        .filter((item) => item.type === 0x1)
                        .sort((a, b) => a.order - b.order)
                        .map((item) => ({
                          offset: 0x250,
                          bit: item.index,
                          label: item.name,
                        })),
                    },
                    {
                      id: "item-bitflags",
                      name: "Key Items",
                      type: "bitflags",
                      flags: itemList
                        .filter((item) => item.type === 0x3)
                        .sort((a, b) => a.order - b.order)
                        .map((item) => ({
                          offset: 0x250,
                          bit: item.index,
                          label: item.name,
                        })),
                    },
                    {
                      id: "item-bitflags",
                      name: "Unused Items",
                      type: "bitflags",
                      flags: itemList
                        .filter((item) => item.type === 0x4)
                        .sort((a, b) => a.order - b.order)
                        .map((item) => ({
                          offset: 0x250,
                          bit: item.index,
                          label: item.name,
                        })),
                    },
                  ],
                },
              ],
            },
            {
              name: "Skills",
              flex: true,
              items: [
                {
                  name: "Alastor",
                  type: "bitflags",
                  flags: [
                    { offset: 0x62b, bit: 4, label: "Stringer Level 1" },
                    { offset: 0x62b, bit: 3, label: "Stringer Level 2" },
                    { offset: 0x62b, bit: 5, label: "Round Trip" },
                    { offset: 0x62b, bit: 6, label: "Air Hike" },
                    { offset: 0x62b, bit: 0, label: "Air Raid" },
                    { offset: 0x62b, bit: 2, label: "Vortex Level 1" },
                    { offset: 0x62b, bit: 1, label: "Vortex Level 2" },
                  ],
                },
                {
                  name: "Ifrit",
                  type: "bitflags",
                  flags: [
                    { offset: 0x62a, bit: 6, label: "Magma Drive" },
                    { offset: 0x62a, bit: 5, label: "Kick 13 Level 1" },
                    { offset: 0x62a, bit: 4, label: "Kick 13 Level 2" },
                    { offset: 0x62a, bit: 7, label: "Rolling Blaze" },
                    { offset: 0x62a, bit: 3, label: "Meteor Level 1" },
                    { offset: 0x62a, bit: 2, label: "Meteor Level 2" },
                    { offset: 0x62a, bit: 1, label: "Inferno" },
                  ],
                },
              ],
            },
            {
              name: "Enemies",
              items: [
                {
                  type: "tabs",
                  vertical: true,
                  items: enemyList.map((enemy) => ({
                    name: enemy.name,
                    flex: true,
                    items: [
                      {
                        name: "Unlocked",
                        type: "bitflags",
                        flags: [...Array(enemy.count).keys()].map((index) => ({
                          offset:
                            0x6bc + enemy.index * 0x4 + bitToOffset(index),
                          bit: index % 8,
                          label: `Part ${index + 1}`,
                        })),
                      },
                      {
                        name: "New Flags",
                        type: "bitflags",
                        hidden: true,
                        flags: [...Array(enemy.count).keys()].map((index) => ({
                          offset:
                            0x73c + enemy.index * 0x4 + bitToOffset(index),
                          bit: index % 8,
                          label: `Part ${index + 1}`,
                        })),
                      },
                    ],
                  })),
                },
              ],
            },
            {
              name: "Total Results",
              items: [
                {
                  type: "tabs",
                  vertical: true,
                  items: [
                    {
                      name: "Normal",
                      flex: true,
                      items: [...Array(23).keys()].map((index) => ({
                        name: `Mission ${index + 1}`,
                        offset: 0x7bc + index,
                        type: "variable",
                        dataType: "uint8",
                        resource: "ranks",
                      })),
                    },
                    {
                      name: "Hard",
                      flex: true,
                      items: [...Array(23).keys()].map((index) => ({
                        name: `Mission ${index + 1}`,
                        offset: 0x7d3 + index,
                        type: "variable",
                        dataType: "uint8",
                        resource: "ranks",
                      })),
                    },
                    {
                      name: "Dante Must Die!",
                      flex: true,
                      items: [...Array(23).keys()].map((index) => ({
                        name: `Mission ${index + 1}`,
                        offset: 0x7ea + index,
                        type: "variable",
                        dataType: "uint8",
                        resource: "ranks",
                      })),
                    },
                    {
                      name: "Secret Missions",
                      items: [
                        {
                          type: "bitflags",
                          flags: [
                            { offset: 0x33, bit: 6, label: "Secret Mission 1" },
                            { offset: 0x33, bit: 5, label: "Secret Mission 2" },
                            { offset: 0x33, bit: 4, label: "Secret Mission 3" },
                            { offset: 0x33, bit: 3, label: "Secret Mission 4" },
                            { offset: 0x33, bit: 2, label: "Secret Mission 5" },
                            { offset: 0x32, bit: 4, label: "Secret Mission 6" },
                            { offset: 0x32, bit: 3, label: "Secret Mission 7" },
                            { offset: 0x32, bit: 5, label: "Secret Mission 8" },
                            { offset: 0x32, bit: 6, label: "Secret Mission 9" },
                            { offset: 0x33, bit: 1, label: "Secret Mission 10" },
                            { offset: 0x33, bit: 0, label: "Secret Mission 11" },
                            { offset: 0x32, bit: 7, label: "Secret Mission 12" },
                          ],
                        },
                      ],
                    },
                  ],
                },
              ],
            },
            {
              name: "Statistics",
              items: [
                {
                  type: "section",
                  flex: true,
                  items: [
                    {
                      name: "Total Retry",
                      offset: 0x622,
                      type: "variable",
                      dataType: "uint16",
                    },
                    {
                      name: "Damages Received",
                      offset: 0x808,
                      type: "variable",
                      dataType: "uint32",
                    },
                  ],
                },
                {
                  type: "section",
                  flex: true,
                  items: [
                    {
                      name: "Red Orbs Obtained",
                      offset: 0x83c,
                      type: "variable",
                      dataType: "uint32",
                    },
                    {
                      name: "Purchased Blue Orbs",
                      offset: 0x626,
                      type: "variable",
                      dataType: "uint8",
                      max: 7,
                    },
                    {
                      name: "Purchased Purple Orbs",
                      offset: 0x627,
                      type: "variable",
                      dataType: "uint8",
                      max: 7,
                    },
                  ],
                },
                {
                  name: "Combo Rankings",
                  type: "section",
                  flex: true,
                  items: [
                    {
                      name: "Dull",
                      offset: 0x4d8,
                      type: "variable",
                      dataType: "uint32",
                      max: 99999,
                    },
                    {
                      name: "Cool",
                      offset: 0x4dc,
                      type: "variable",
                      dataType: "uint32",
                      max: 99999,
                    },
                    {
                      name: "Bravo",
                      offset: 0x4e0,
                      type: "variable",
                      dataType: "uint32",
                      max: 99999,
                    },
                    {
                      name: "Absolute",
                      offset: 0x4e4,
                      type: "variable",
                      dataType: "uint32",
                      max: 99999,
                    },
                    {
                      name: "Stylish",
                      offset: 0x4e8,
                      type: "variable",
                      dataType: "uint32",
                      max: 99999,
                    },
                  ],
                },
              ],
            },
          ],
        },
      ],
      appendSubinstance: [
        {
          name: "Options",
          items: [
            {
              id: "system",
              length: 0x0,
              type: "container",
              instanceType: "section",
              instances: 1,
              flex: true,
              items: [
                {
                  id: "europeOnly",
                  name: "Language",
                  offset: 0xd,
                  type: "variable",
                  dataType: "uint8",
                  resource: "languages",
                },
                {
                  name: "Subtitles",
                  offset: 0x7,
                  type: "variable",
                  dataType: "bit",
                  bit: 7,
                  resource: "optionBoolean",
                },
                {
                  name: "Controller Setup",
                  offset: 0xc,
                  type: "variable",
                  dataType: "uint8",
                  resource: "controllerTypes",
                },
                {
                  id: "ps2Only",
                  name: "Vibration",
                  offset: 0x7,
                  type: "variable",
                  dataType: "bit",
                  bit: 6,
                  resource: "optionBoolean",
                },
                {
                  id: "ps2Only",
                  name: "Audio",
                  offset: 0x7,
                  type: "variable",
                  dataType: "bit",
                  bit: 5,
                  resource: "sounds",
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
      0x0: "Dante",
      0x1: "Legendary Dark Knight",
      0x2: "Super Dante",
    },
    controllerTypes: {
      0x0: "Type A",
      0x1: "Type B",
    },
    devilArms: {
      0x0: "Alastor",
      0x1: "Ifrit",
      0x2: "Yamato",
      0x3: "Sparda",
      0x4: "Force Edge",
    },
    difficulties: {
      0x2: "Easy Automatic",
      0x3: "Normal",
      0x5: "Hard",
      0x6: "Dante Must Die!",
    },
    guns: {
      0x0: "Handgun",
      0x1: "Shotgun",
      0x2: "Needlegun",
      0x3: "Grenadegun",
      0x4: "Nightmare-β",
    },
    languages: {
      0x1: "English",
      0x2: "French",
      0x3: "Spanish",
      0x4: "German",
      0x5: "Italian",
    },
    missions: {
      0x0: "Prologue",
      0x1: "Mission 1",
      0x2: "Mission 2",
      0x3: "Mission 3",
      0x4: "Mission 4",
      0x5: "Mission 5",
      0x6: "Mission 6",
      0x7: "Mission 7",
      0x8: "Mission 8",
      0x9: "Mission 9",
      0xa: "Mission 10",
      0xb: "Mission 11",
      0xc: "Mission 12",
      0xd: "Mission 13",
      0xe: "Mission 14",
      0xf: "Mission 15",
      0x10: "Mission 16",
      0x11: "Mission 17",
      0x12: "Mission 18",
      0x13: "Mission 19",
      0x14: "Mission 20",
      0x15: "Mission 21",
      0x16: "Mission 22",
      0x17: "Mission 23",
    },
    optionBoolean: {
      0x0: "Off",
      0x1: "On",
    },
    ranks: {
      0x0: "S",
      0x1: "A",
      0x2: "B",
      0x3: "C",
      0x4: "D",
      0xff: "-",
    },
    sounds: {
      0x0: "Monaural",
      0x1: "Stereo",
    },
  },
  resourcesOrder: {
    devilArms: [0x0, 0x1, 0x4, 0x3, 0x2],
    ranks: [0xff],
  },
};

export default template;
