import { bitToOffset } from "$lib/utils/bytes";

import type { GameJson, ItemTab } from "$lib/types";

import { records, worlds } from "./utils/resource";

const template: GameJson = {
  validator: {
    regions: {
      europe: {},
      usa: {},
      japan: {},
    },
    text: "Drag 'n' drop here or click to add a save file.",
    hint: "If you're having trouble loading a save file from an <b>Everdrive</b> cartridge, please see the FAQ.",
    error: "Not a valid save file.",
  },
  items: [
    {
      type: "tabs",
      items: [
        {
          name: "General",
          flex: true,
          items: [
            {
              name: "Unlocked Modes",
              type: "bitflags",
              flags: [{ offset: 0x7f, bit: 0, label: "Adventure Two" }],
            },
            {
              id: "unlockedCharacters",
              name: "Unlocked Characters",
              type: "bitflags",
              flags: [
                { offset: 0x7f, bit: 1, label: "Drumstick" },
                { offset: 0x7d, bit: 0, label: "T.T." },
              ],
            },
          ],
        },
        {
          name: "Adventure",
          items: [
            {
              length: 0x28,
              type: "container",
              instanceType: "tabs",
              instances: 3,
              enumeration: "Slot %d",
              disableSubinstanceIf: {
                offset: 0x0,
                type: "variable",
                dataType: "uint16",
                operator: "=",
                value: 0xffff,
              },
              items: [
                {
                  id: "checksumAdventure",
                  name: "Checksum",
                  offset: 0x0,
                  type: "checksum",
                  dataType: "uint16",
                  bigEndian: true,
                  control: {
                    offsetStart: 0x2,
                    offsetEnd: 0x28,
                  },
                },
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
                              id: "name",
                              name: "Name",
                              offset: 0x25,
                              length: 0x6,
                              type: "variable",
                              dataType: "string",
                              letterDataType: "uint16",
                              bigEndian: true,
                              fallback: 0x1c,
                              resource: "letters",
                              test: true,
                            },
                            {
                              name: "Mode",
                              offset: 0x24,
                              type: "variable",
                              dataType: "bit",
                              bit: 2,
                              resource: "modes",
                            },
                            {
                              name: "Balloons",
                              offset: 0xe,
                              type: "variable",
                              dataType: "uint8",
                              binary: {
                                bitStart: 1,
                                bitLength: 7,
                              },
                              max: 47,
                              disabled: true,
                            },
                          ],
                        },
                        {
                          type: "section",
                          flex: true,
                          items: [
                            {
                              name: "Pieces of Wizwig Amulet",
                              offset: 0x13,
                              type: "variable",
                              dataType: "uint8",
                              binary: {
                                bitStart: 0,
                                bitLength: 3,
                              },
                              disabled: true,
                            },
                            {
                              name: "Pieces of T.T. Amulet",
                              offset: 0x13,
                              type: "variable",
                              dataType: "uint8",
                              binary: {
                                bitStart: 3,
                                bitLength: 3,
                              },
                              disabled: true,
                            },
                          ],
                        },
                        {
                          type: "bitflags",
                          hidden: true,
                          flags: [{ offset: 0x24, bit: 1, label: "Meet T.T." }],
                        },
                      ],
                    },
                    {
                      name: "Lobby",
                      items: [
                        {
                          type: "bitflags",
                          hidden: true,
                          flags: [
                            { offset: 0x23, bit: 5, label: "Wizpig head animation" },
                            { offset: 0xd, bit: 0, label: "Wizpig 1 beaten" },
                          ],
                        },
                        {
                          type: "section",
                          flex: true,
                          items: worlds.lobby.bosses.map((boss) => ({
                            id: `progression-${boss.offset}`,
                            name: boss.name,
                            offset: boss.offset,
                            type: "variable",
                            dataType: "uint8",
                            binary: {
                              bitStart: boss.bitStart,
                              bitLength: 2,
                            },
                            resource: "challengeProgressions",
                          })),
                        },
                        {
                          type: "section",
                          flex: true,
                          items: [
                            {
                              id: "progression-36",
                              name: "Events",
                              type: "bitflags",
                              flags: [
                                { offset: 0x24, bit: 0, label: "Future Fun Land unlocked", separator: true },
                                { offset: 0x14, bit: 2, label: "Balloon near Dino Domain obtained" },
                                { offset: 0x14, bit: 6, label: "Balloon near Wizpig head obtained" },
                                { offset: 0x15, bit: 2, label: "Balloon above water near Sherbet Island obtained" },
                                { offset: 0x15, bit: 6, label: "Balloon among trees near Sherbet Island obtained" },
                              ],
                            },
                          ],
                        },
                        {
                          name: "Taj's Challenges",
                          type: "section",
                          flex: true,
                          items: [
                            {
                              name: "Unlocked",
                              type: "bitflags",
                              flags: [
                                { offset: 0xb, bit: 6, label: "Car Challenge" },
                                { offset: 0xb, bit: 7, label: "Hover Challenge" },
                                { offset: 0xa, bit: 0, label: "Plane Challenge" },
                              ],
                            },
                            {
                              name: "Completed",
                              type: "bitflags",
                              flags: [
                                { offset: 0xa, bit: 1, label: "Car Challenge" },
                                { offset: 0xa, bit: 2, label: "Hover Challenge" },
                                { offset: 0xa, bit: 3, label: "Plane Challenge" },
                              ],
                            },
                            {
                              id: "progression-21",
                              name: "Balloons",
                              type: "bitflags",
                              flags: [
                                { offset: 0x15, bit: 3, label: "Car Challenge" },
                                { offset: 0x14, bit: 3, label: "Hover Challenge" },
                                { offset: 0x14, bit: 4, label: "Plane Challenge" },
                              ],
                            },
                          ],
                        },
                      ],
                    },
                    {
                      name: "Dino Domain",
                      items: [
                        {
                          type: "section",
                          flex: true,
                          hidden: true,
                          items: [
                            {
                              name: "Balloons",
                              offset: worlds.dinoDomain.balloons!.offset,
                              type: "variable",
                              dataType: worlds.dinoDomain.balloons!.dataType,
                              bigEndian: true,
                              binary: {
                                bitStart: worlds.dinoDomain.balloons!.bitStart,
                                bitLength: 4,
                              },
                              hidden: true,
                            },
                            {
                              type: "bitflags",
                              hidden: true,
                              flags: [
                                { offset: 0x23, bit: 6, label: "Key used animation" },
                                { offset: 0xd, bit: 1, label: "Silver Coins challenges unlocked" },
                                { offset: 0x24, bit: 3, label: "Boss Level 1 door open animation" },
                                { offset: 0x23, bit: 0, label: "Boss Level 2 door open animation" },
                                { offset: 0xd, bit: 7, label: "Trophy Race unlocked" },
                              ],
                            },
                          ],
                        },
                        {
                          type: "section",
                          flex: true,
                          noMargin: true,
                          items: worlds.dinoDomain.races!.map((race) => ({
                            id: `progression-${race.offset}`,
                            name: race.name,
                            offset: race.offset,
                            type: "variable",
                            dataType: "uint8",
                            binary: {
                              bitStart: race.bitStart,
                              bitLength: 2,
                            },
                            resource: "raceProgressions",
                          })),
                        },
                        {
                          type: "section",
                          flex: true,
                          items: worlds.dinoDomain.bosses.map((boss) => ({
                            id: `progression-${boss.offset}`,
                            name: boss.name,
                            offset: boss.offset,
                            type: "variable",
                            dataType: "uint8",
                            binary: {
                              bitStart: boss.bitStart,
                              bitLength: 2,
                            },
                            resource: "challengeProgressions",
                          })),
                        },
                        {
                          type: "section",
                          flex: true,
                          items: [
                            {
                              name: "Key",
                              offset: 0x20,
                              type: "variable",
                              dataType: "bit",
                              bit: 1,
                              resource: "keys",
                            },
                            {
                              id: `progression-${worlds.dinoDomain.tt!.offset}`,
                              name: worlds.dinoDomain.tt!.name,
                              offset: worlds.dinoDomain.tt!.offset,
                              type: "variable",
                              dataType: "uint8",
                              binary: {
                                bitStart: worlds.dinoDomain.tt!.bitStart,
                                bitLength: 2,
                              },
                              resource: "challengeProgressions",
                            },
                          ],
                        },
                        {
                          name: "Trophy Race Cup",
                          offset: 0xc,
                          type: "variable",
                          dataType: "uint8",
                          binary: {
                            bitStart: 4,
                            bitLength: 2,
                          },
                          resource: "trophies",
                        },
                      ],
                    },
                    {
                      name: "Sherbet Island",
                      items: [
                        {
                          type: "section",
                          flex: true,
                          hidden: true,
                          items: [
                            {
                              name: "Balloons",
                              offset: worlds.sherbetIsland.balloons!.offset,
                              type: "variable",
                              dataType: worlds.sherbetIsland.balloons!.dataType,
                              bigEndian: true,
                              binary: {
                                bitStart:
                                  worlds.sherbetIsland.balloons!.bitStart,
                                bitLength: 4,
                              },
                              hidden: true,
                            },
                            {
                              type: "bitflags",
                              hidden: true,
                              flags: [
                                { offset: 0x23, bit: 7, label: "Key used animation" },
                                { offset: 0xd, bit: 2, label: "Silver Coins challenges unlocked" },
                                { offset: 0x24, bit: 4, label: "Boss Level 1 door open animation" },
                                { offset: 0x23, bit: 1, label: "Boss Level 2 door open animation" },
                                { offset: 0xc, bit: 0, label: "Trophy Race unlocked" },
                              ],
                            },
                          ],
                        },
                        {
                          type: "section",
                          flex: true,
                          noMargin: true,
                          items: worlds.sherbetIsland.races!.map((race) => ({
                            id: `progression-${race.offset}`,
                            name: race.name,
                            offset: race.offset,
                            type: "variable",
                            dataType: "uint8",
                            binary: {
                              bitStart: race.bitStart,
                              bitLength: 2,
                            },
                            resource: "raceProgressions",
                          })),
                        },
                        {
                          type: "section",
                          flex: true,
                          items: worlds.sherbetIsland.bosses.map((boss) => ({
                            id: `progression-${boss.offset}`,
                            name: boss.name,
                            offset: boss.offset,
                            type: "variable",
                            dataType: "uint8",
                            binary: {
                              bitStart: boss.bitStart,
                              bitLength: 2,
                            },
                            resource: "challengeProgressions",
                          })),
                        },
                        {
                          type: "section",
                          flex: true,
                          items: [
                            {
                              name: "Key",
                              offset: 0x20,
                              type: "variable",
                              dataType: "bit",
                              bit: 2,
                              resource: "keys",
                            },
                            {
                              id: `progression-${worlds.sherbetIsland.tt!.offset}`,
                              name: worlds.sherbetIsland.tt!.name,
                              offset: worlds.sherbetIsland.tt!.offset,
                              type: "variable",
                              dataType: "uint8",
                              binary: {
                                bitStart: worlds.sherbetIsland.tt!.bitStart,
                                bitLength: 2,
                              },
                              resource: "challengeProgressions",
                            },
                          ],
                        },
                        {
                          name: "Trophy Race Cup",
                          offset: 0xc,
                          type: "variable",
                          dataType: "uint8",
                          binary: {
                            bitStart: 6,
                            bitLength: 2,
                          },
                          resource: "trophies",
                        },
                      ],
                    },
                    {
                      name: "Snowflake Mountain",
                      items: [
                        {
                          type: "section",
                          flex: true,
                          hidden: true,
                          items: [
                            {
                              name: "Balloons",
                              offset: worlds.snowflakeMountain.balloons!.offset,
                              type: "variable",
                              dataType:
                                worlds.snowflakeMountain.balloons!.dataType,
                              bigEndian: true,
                              binary: {
                                bitStart:
                                  worlds.snowflakeMountain.balloons!.bitStart,
                                bitLength: 4,
                              },
                              hidden: true,
                            },
                            {
                              type: "bitflags",
                              hidden: true,
                              flags: [
                                { offset: 0x22, bit: 0, label: "Key used animation" },
                                { offset: 0xd, bit: 3, label: "Silver Coins challenges unlocked" },
                                { offset: 0x24, bit: 5, label: "Boss Level 1 door open animation" },
                                { offset: 0x23, bit: 2, label: "Boss Level 2 door open animation" },
                                { offset: 0xc, bit: 1, label: "Trophy Race unlocked" },
                              ],
                            },
                          ],
                        },
                        {
                          type: "section",
                          flex: true,
                          noMargin: true,
                          items: worlds.snowflakeMountain.races!.map(
                            (race) => ({
                              id: `progression-${race.offset}`,
                              name: race.name,
                              offset: race.offset,
                              type: "variable",
                              dataType: "uint8",
                              binary: {
                                bitStart: race.bitStart,
                                bitLength: 2,
                              },
                              resource: "raceProgressions",
                            }),
                          ),
                        },
                        {
                          type: "section",
                          flex: true,
                          items: worlds.snowflakeMountain.bosses.map(
                            (race) => ({
                              id: `progression-${race.offset}`,
                              name: race.name,
                              offset: race.offset,
                              type: "variable",
                              dataType: "uint8",
                              binary: {
                                bitStart: race.bitStart,
                                bitLength: 2,
                              },
                              resource: "challengeProgressions",
                            }),
                          ),
                        },
                        {
                          type: "section",
                          flex: true,
                          items: [
                            {
                              name: "Key",
                              offset: 0x20,
                              type: "variable",
                              dataType: "bit",
                              bit: 3,
                              resource: "keys",
                            },
                            {
                              id: `progression-${worlds.snowflakeMountain.tt!.offset}`,
                              name: worlds.snowflakeMountain.tt!.name,
                              offset: worlds.snowflakeMountain.tt!.offset,
                              type: "variable",
                              dataType: "uint8",
                              binary: {
                                bitStart: worlds.snowflakeMountain.tt!.bitStart,
                                bitLength: 2,
                              },
                              resource: "challengeProgressions",
                            },
                          ],
                        },
                        {
                          name: "Trophy Race Cup",
                          offset: 0xb,
                          type: "variable",
                          dataType: "uint8",
                          binary: {
                            bitStart: 0,
                            bitLength: 2,
                          },
                          resource: "trophies",
                        },
                      ],
                    },
                    {
                      name: "Dragon Forest",
                      items: [
                        {
                          type: "section",
                          flex: true,
                          hidden: true,
                          items: [
                            {
                              name: "Balloons",
                              offset: worlds.dragonForest.balloons!.offset,
                              type: "variable",
                              dataType: worlds.dragonForest.balloons!.dataType,
                              bigEndian: true,
                              binary: {
                                bitStart:
                                  worlds.dragonForest.balloons!.bitStart,
                                bitLength: 4,
                              },
                              hidden: true,
                            },
                            {
                              type: "bitflags",
                              hidden: true,
                              flags: [
                                { offset: 0x22, bit: 1, label: "Key used animation" },
                                { offset: 0xd, bit: 4, label: "Silver Coins challenges unlocked" },
                                { offset: 0x24, bit: 6, label: "Boss Level 1 door open animation" },
                                { offset: 0x23, bit: 3, label: "Boss Level 2 door open animation" },
                                { offset: 0xc, bit: 2, label: "Trophy Race unlocked" },
                              ],
                            },
                          ],
                        },
                        {
                          type: "section",
                          flex: true,
                          noMargin: true,
                          items: worlds.dragonForest.races!.map((race) => ({
                            id: `progression-${race.offset}`,
                            name: race.name,
                            offset: race.offset,
                            type: "variable",
                            dataType: "uint8",
                            binary: {
                              bitStart: race.bitStart,
                              bitLength: 2,
                            },
                            resource: "raceProgressions",
                          })),
                        },
                        {
                          type: "section",
                          flex: true,
                          items: worlds.dragonForest.bosses.map((boss) => ({
                            id: `progression-${boss.offset}`,
                            name: boss.name,
                            offset: boss.offset,
                            type: "variable",
                            dataType: "uint8",
                            binary: {
                              bitStart: boss.bitStart,
                              bitLength: 2,
                            },
                            resource: "challengeProgressions",
                          })),
                        },
                        {
                          type: "section",
                          flex: true,
                          items: [
                            {
                              name: "Key",
                              offset: 0x20,
                              type: "variable",
                              dataType: "bit",
                              bit: 4,
                              resource: "keys",
                            },
                            {
                              id: `progression-${worlds.dragonForest.tt!.offset}`,
                              name: worlds.dragonForest.tt!.name,
                              offset: worlds.dragonForest.tt!.offset,
                              type: "variable",
                              dataType: "uint8",
                              binary: {
                                bitStart: worlds.dragonForest.tt!.bitStart,
                                bitLength: 2,
                              },
                              resource: "challengeProgressions",
                            },
                          ],
                        },
                        {
                          name: "Trophy Race Cup",
                          offset: 0xb,
                          type: "variable",
                          dataType: "uint8",
                          binary: {
                            bitStart: 2,
                            bitLength: 2,
                          },
                          resource: "trophies",
                        },
                      ],
                    },
                    {
                      name: "Future Fun Land",
                      items: [
                        {
                          type: "section",
                          flex: true,
                          hidden: true,
                          items: [
                            {
                              name: "Balloons",
                              offset: worlds.futureFunLand.balloons!.offset,
                              type: "variable",
                              dataType: worlds.futureFunLand.balloons!.dataType,
                              bigEndian: true,
                              binary: {
                                bitStart:
                                  worlds.futureFunLand.balloons!.bitStart,
                                bitLength: 4,
                              },
                              hidden: true,
                            },
                            {
                              type: "bitflags",
                              hidden: true,
                              flags: [
                                { offset: 0x22, bit: 2, label: "Related to Spacedust Alley completed" },
                                { offset: 0x24, bit: 7, label: "Wizpig Level door open animation" },
                                { offset: 0xd, bit: 5, label: "Game Completed" },
                              ],
                            },
                          ],
                        },
                        {
                          type: "section",
                          flex: true,
                          noMargin: true,
                          items: worlds.futureFunLand.races!.map((race) => ({
                            id: `progression-${race.offset}`,
                            name: race.name,
                            offset: race.offset,
                            type: "variable",
                            dataType: "uint8",
                            binary: {
                              bitStart: race.bitStart,
                              bitLength: 2,
                            },
                            resource: "raceProgressions",
                          })),
                        },
                        {
                          type: "section",
                          flex: true,
                          items: worlds.futureFunLand.bosses.map((boss) => ({
                            id: `progression-${boss.offset}`,
                            name: boss.name,
                            offset: boss.offset,
                            type: "variable",
                            dataType: "uint8",
                            binary: {
                              bitStart: boss.bitStart,
                              bitLength: 2,
                            },
                            resource: "challengeProgressions",
                          })),
                        },
                        {
                          name: "Trophy Race Cup",
                          offset: 0xb,
                          type: "variable",
                          dataType: "uint8",
                          binary: {
                            bitStart: 4,
                            bitLength: 2,
                          },
                          resource: "trophies",
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
          id: "records",
          name: "Records",
          items: [
            {
              type: "section",
              flex: true,
              hidden: true,
              items: [
                {
                  name: "Checksum 1",
                  offset: 0x80,
                  type: "checksum",
                  dataType: "uint16",
                  bigEndian: true,
                  control: {
                    offsetStart: 0x82,
                    offsetEnd: 0x140,
                  },
                },
                {
                  name: "Checksum 2",
                  offset: 0x140,
                  type: "checksum",
                  dataType: "uint16",
                  bigEndian: true,
                  control: {
                    offsetStart: 0x142,
                    offsetEnd: 0x200,
                  },
                },
              ],
            },
            {
              type: "tabs",
              vertical: true,
              items: records.map(
                (record) =>
                  ({
                    name: record.name,
                    items: [
                      {
                        type: "section",
                        flex: true,
                        items: [
                          {
                            name: "T.T. Record",
                            offset: 0x7d + bitToOffset(record.ttIndex),
                            type: "variable",
                            dataType: "bit",
                            bit: record.ttIndex % 8,
                            resource: "ttRecords",
                          },
                        ],
                      },
                      ...record.vehicles.map((vehicle, index) => {
                        const offset = record.index * 0x4 + index * 0x4;

                        return {
                          type: "section",
                          flex: true,
                          items: [
                            {
                              name: `Best Time (${vehicle})`,
                              type: "section",
                              flex: true,
                              items: [
                                {
                                  name: "Time",
                                  type: "group",
                                  mode: "time",
                                  items: [
                                    {
                                      offset: 0x142 + offset,
                                      type: "variable",
                                      dataType: "uint16",
                                      bigEndian: true,
                                      operations: [
                                        { "/": 50 },
                                        {
                                          convert: {
                                            from: "seconds",
                                            to: "minutes",
                                          },
                                        },
                                      ],
                                      max: 99,
                                    },
                                    {
                                      offset: 0x142 + offset,
                                      type: "variable",
                                      dataType: "uint16",
                                      bigEndian: true,
                                      operations: [
                                        { "/": 50 },
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
                                    {
                                      offset: 0x142 + offset,
                                      type: "variable",
                                      dataType: "uint16",
                                      bigEndian: true,
                                      operations: [
                                        { "/": 50 },
                                        {
                                          convert: {
                                            from: "seconds",
                                            to: "milliseconds",
                                          },
                                        },
                                      ],
                                      leadingZeros: 2,
                                      max: 999,
                                      step: 100,
                                    },
                                  ],
                                },
                                {
                                  id: "name",
                                  name: "Name",
                                  offset: 0x144 + offset,
                                  length: 0x6,
                                  type: "variable",
                                  dataType: "string",
                                  letterDataType: "uint16",
                                  bigEndian: true,
                                  fallback: 0x1c,
                                  resource: "letters",
                                },
                              ],
                            },
                            {
                              name: "Best Lap",
                              type: "section",
                              flex: true,
                              items: [
                                {
                                  name: "Time",
                                  type: "group",
                                  mode: "time",
                                  items: [
                                    {
                                      offset: 0x82 + offset,
                                      type: "variable",
                                      dataType: "uint16",
                                      bigEndian: true,
                                      operations: [
                                        { "/": 50 },
                                        {
                                          convert: {
                                            from: "seconds",
                                            to: "minutes",
                                          },
                                        },
                                      ],
                                      max: 99,
                                    },
                                    {
                                      offset: 0x82 + offset,
                                      type: "variable",
                                      dataType: "uint16",
                                      bigEndian: true,
                                      operations: [
                                        { "/": 50 },
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
                                    {
                                      offset: 0x82 + offset,
                                      type: "variable",
                                      dataType: "uint16",
                                      bigEndian: true,
                                      operations: [
                                        { "/": 50 },
                                        {
                                          convert: {
                                            from: "seconds",
                                            to: "milliseconds",
                                          },
                                        },
                                      ],
                                      leadingZeros: 2,
                                      max: 999,
                                      step: 100,
                                    },
                                  ],
                                },
                                {
                                  id: "name",
                                  name: "Name",
                                  offset: 0x84 + offset,
                                  length: 0x6,
                                  type: "variable",
                                  dataType: "string",
                                  letterDataType: "uint16",
                                  bigEndian: true,
                                  fallback: 0x1c,
                                  resource: "letters",
                                },
                              ],
                            },
                          ],
                        };
                      }),
                    ],
                  }) as ItemTab,
              ),
            },
          ],
        },
        {
          name: "Options",
          items: [
            {
              id: "checksumOptions",
              name: "Checksum",
              offset: 0x78,
              type: "checksum",
              dataType: "uint8",
              control: {
                offsetStart: 0x79,
                offsetEnd: 0x80,
              },
            },
            {
              type: "section",
              flex: true,
              items: [
                {
                  name: "???",
                  offset: 0x7c,
                  type: "variable",
                  dataType: "bit",
                  bit: 0,
                  hidden: true,
                },
                {
                  name: "Subtitles",
                  offset: 0x7c,
                  type: "variable",
                  dataType: "bit",
                  bit: 1,
                  resource: "optionBoolean",
                },
                {
                  id: "language",
                  name: "Language",
                  offset: 0x7f,
                  type: "variable",
                  dataType: "uint8",
                  binary: {
                    bitStart: 2,
                    bitLength: 2,
                  },
                  resource: "languages",
                },
              ],
            },
          ],
        },
      ],
    },
  ],
  resources: {
    challengeProgressions: {
      0x0: "-",
      0x1: "Played",
      0x2: "Completed",
    },
    keys: {
      0x0: "-",
      0x1: "Obtained",
    },
    languages: [
      // Europe
      {
        0x0: "English",
        0x1: "German",
        0x2: "French",
      },
      // USA
      {
        0x0: "English",
        0x2: "French",
      },
    ],
    letters: {
      0x0: "A",
      0x1: "B",
      0x2: "C",
      0x3: "D",
      0x4: "E",
      0x5: "F",
      0x6: "G",
      0x7: "H",
      0x8: "I",
      0x9: "J",
      0xa: "K",
      0xb: "L",
      0xc: "M",
      0xd: "N",
      0xe: "O",
      0xf: "P",
      0x10: "Q",
      0x11: "R",
      0x12: "S",
      0x13: "T",
      0x14: "U",
      0x15: "V",
      0x16: "W",
      0x17: "X",
      0x18: "Y",
      0x19: "Z",
      0x1a: ".",
      0x1b: "?",
      0x1c: " ",
    },
    modes: {
      0x0: "Adventure",
      0x1: "Adventure Two",
    },
    optionBoolean: {
      0x0: "Off",
      0x1: "On",
    },
    raceProgressions: {
      0x0: "-",
      0x1: "Played",
      0x2: "Challenge 1 Completed",
      0x3: "Challenge 2 Completed",
    },
    trophies: {
      0x0: "-",
      0x1: "Bronze",
      0x2: "Silver",
      0x3: "Gold",
    },
    ttRecords: {
      0x0: "-",
      0x1: "Beaten",
    },
  },
};

export default template;
