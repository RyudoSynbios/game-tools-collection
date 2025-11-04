import type { GameJson } from "$lib/types";

import { shiftOffset } from "./utils";
import angryAztec from "./utils/levels/angryAztec";
import creepyCastle from "./utils/levels/creepyCastle";
import crystalCaves from "./utils/levels/crystalCaves";
import dkIsles from "./utils/levels/dkIsles";
import franticFactory from "./utils/levels/franticFactory";
import fungiForest from "./utils/levels/fungiForest";
import gloomyGalleon from "./utils/levels/gloomyGalleon";
import hideoutHelm from "./utils/levels/hideoutHelm";
import jungleJapes from "./utils/levels/jungleJapes";
import { ranks } from "./utils/resource";

const template: GameJson = {
  validator: {
    regions: {
      europe: {},
      usa: {},
      japan: {},
    },
    text: "Drag 'n' drop here or click to add a save file.",
    hint: "If you're having trouble loading a save file from an Everdrive cartridge, please see the FAQ.",
    error: "Not a valid save file.",
  },
  items: [
    {
      name: "Checksum System",
      offset: 0x6ec,
      type: "checksum",
      dataType: "uint32",
      bigEndian: true,
      control: {
        offsetStart: 0x6b0,
        offsetEnd: 0x6ec,
      },
    },
    {
      id: "slots",
      length: 0x1ac,
      type: "container",
      instanceType: "tabs",
      instances: 3,
      enumeration: "Slot %d",
      disableSubinstanceIf: {
        offset: 0x19e,
        type: "variable",
        dataType: "bit",
        bit: 3,
        operator: "=",
        value: 0x0,
      },
      appendSubinstance: [
        {
          name: "Mystery",
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
                          name: "Mystery",
                          offset: 0x6b0,
                          type: "variable",
                          dataType: "bit",
                          bit: 0,
                          resource: "booleanUnlocked",
                          test: true,
                        },
                        {
                          name: "Cheats",
                          offset: 0x6b4,
                          type: "variable",
                          dataType: "bit",
                          bit: 2,
                          resource: "booleanUnlocked",
                        },
                      ],
                    },
                    {
                      type: "section",
                      flex: true,
                      items: [
                        {
                          type: "section",
                          items: [
                            {
                              name: "DK Theatre",
                              offset: 0x6b0,
                              type: "variable",
                              dataType: "bit",
                              bit: 1,
                              resource: "booleanUnlocked",
                            },
                            {
                              type: "bitflags",
                              flags: [
                                { offset: 0x6b0, bit: 2, label: "Jungle Intro" },
                                { offset: 0x6b0, bit: 3, label: "Aztec Intro" },
                                { offset: 0x6b0, bit: 4, label: "Factory Intro" },
                                { offset: 0x6b0, bit: 5, label: "Galleon Intro" },
                                { offset: 0x6b0, bit: 6, label: "Forest Intro" },
                                { offset: 0x6b0, bit: 7, label: "Caves Intro" },
                                { offset: 0x6b1, bit: 0, label: "Castle Intro" },
                                { offset: 0x6b1, bit: 1, label: "Enter Hideout" },
                                { offset: 0x6b1, bit: 2, label: "K.Rool Press Button" },
                                { offset: 0x6b1, bit: 3, label: "K.Rool Takeoff" },
                                { offset: 0x6b1, bit: 4, label: "Game Over" },
                                { offset: 0x6b1, bit: 5, label: "End Sequence" },
                              ],
                            },
                          ],
                        },
                        {
                          type: "section",
                          items: [
                            {
                              name: "DK Bonus",
                              offset: 0x6b1,
                              type: "variable",
                              dataType: "bit",
                              bit: 6,
                              resource: "booleanUnlocked",
                            },
                            {
                              type: "bitflags",
                              flags: [
                                { offset: 0x6b1, bit: 7, label: "Rambi Arena" },
                                { offset: 0x6b2, bit: 0, label: "Enguarde Arena unlocked" },
                                { offset: 0x6b2, bit: 1, label: "DK Arcade" },
                                { offset: 0x6b2, bit: 2, label: "Jetpac" },
                              ],
                            },
                          ],
                        },
                        {
                          type: "section",
                          items: [
                            {
                              name: "Bosses",
                              offset: 0x6b2,
                              type: "variable",
                              dataType: "bit",
                              bit: 3,
                              resource: "booleanUnlocked",
                            },
                            {
                              type: "bitflags",
                              flags: [
                                { offset: 0x6b2, bit: 4, label: "Jungle Boss" },
                                { offset: 0x6b2, bit: 5, label: "Aztec Boss" },
                                { offset: 0x6b2, bit: 6, label: "Factory Boss" },
                                { offset: 0x6b2, bit: 7, label: "Galleon Boss" },
                                { offset: 0x6b3, bit: 0, label: "Forest Boss" },
                                { offset: 0x6b3, bit: 1, label: "Caves Boss" },
                                { offset: 0x6b3, bit: 2, label: "Castle Boss" },
                                { offset: 0x6b3, bit: 3, label: "The Main Event" },
                              ],
                            },
                          ],
                        },
                        {
                          type: "section",
                          items: [
                            {
                              name: "Kong Battle",
                              offset: 0x6b3,
                              type: "variable",
                              dataType: "bit",
                              bit: 4,
                              resource: "booleanUnlocked",
                            },
                            {
                              type: "bitflags",
                              flags: [
                                { offset: 0x6b3, bit: 5, label: "Diddy Kong" },
                                { offset: 0x6b3, bit: 6, label: "Lanky Kong" },
                                { offset: 0x6b3, bit: 7, label: "Tiny Kong" },
                                { offset: 0x6b4, bit: 0, label: "Chunky Kong", separator: true },
                                { offset: 0x6b4, bit: 1, label: "Krusha" },
                              ],
                            },
                          ],
                        },
                      ],
                    },
                  ],
                },
                {
                  name: "High Scores",
                  items: [
                    {
                      type: "tabs",
                      vertical: true,
                      items: [
                        {
                          name: "Rambi Arena",
                          items: [...Array(5).keys()].map((index) => ({
                            name: ranks[index],
                            type: "section",
                            flex: true,
                            items: [
                              {
                                id: "japanShift",
                                name: "Score",
                                offset: shiftOffset(
                                  0x6d4,
                                  Math.floor((2 + index * 9) / 8),
                                ),
                                type: "variable",
                                dataType: "uint16",
                                bigEndian: true,
                                binary: {
                                  bitStart: (2 + index * 9) % 8,
                                  bitLength: 9,
                                },
                                max: 511,
                              },
                              {
                                id: `name-${(7 + index * 5) % 8}`,
                                name: "Name",
                                offset: shiftOffset(
                                  0x6ce,
                                  Math.floor((7 + index * 5) / 8),
                                ),
                                length: 0x3,
                                type: "variable",
                                dataType: "string",
                                letterDataType: "uint8",
                                fallback: 0x1c,
                                resource: "letters",
                              },
                            ],
                          })),
                        },
                        {
                          name: "Enguarde Arena",
                          items: [...Array(5).keys()].map((index) => ({
                            name: ranks[index],
                            type: "section",
                            flex: true,
                            items: [
                              {
                                id: "japanShift",
                                name: "Score",
                                offset: shiftOffset(
                                  0x6e5,
                                  Math.floor((2 + index * 9) / 8),
                                ),
                                type: "variable",
                                dataType: "uint16",
                                bigEndian: true,
                                binary: {
                                  bitStart: (2 + index * 9) % 8,
                                  bitLength: 9,
                                },
                                max: 511,
                              },
                              {
                                id: `name-${(7 + index * 5) % 8}`,
                                name: "Name",
                                offset: shiftOffset(
                                  0x6df,
                                  Math.floor((7 + index * 5) / 8),
                                ),
                                length: 0x3,
                                type: "variable",
                                dataType: "string",
                                letterDataType: "uint8",
                                fallback: 0x1c,
                                resource: "letters",
                              },
                            ],
                          })),
                        },
                        {
                          name: "DK Arcade",
                          items: [...Array(5).keys()].map((index) => ({
                            name: ranks[index],
                            type: "section",
                            flex: true,
                            items: [
                              {
                                id: "japanShift",
                                name: "Score",
                                offset: shiftOffset(
                                  0x6c6,
                                  Math.floor((4 + index * 15) / 8),
                                ),
                                type: "variable",
                                dataType: "uint24",
                                bigEndian: true,
                                binary: {
                                  bitStart: (4 + index * 15) % 8,
                                  bitLength: 15,
                                },
                                operations: [{ "*": 50 }],
                                max: 999950,
                                step: 50,
                              },
                              {
                                id: `name-${(1 + index * 5) % 8}`,
                                name: "Name",
                                offset: shiftOffset(
                                  0x6b8,
                                  Math.floor((1 + index * 5) / 8),
                                ),
                                length: 0x3,
                                type: "variable",
                                dataType: "string",
                                letterDataType: "uint8",
                                fallback: 0x1c,
                                resource: "letters",
                              },
                            ],
                          })),
                        },
                        {
                          name: "Jetpac",
                          items: [
                            {
                              name: "High Score",
                              offset: 0x6b9,
                              type: "variable",
                              dataType: "uint24",
                              bigEndian: true,
                              binary: {
                                bitStart: 0,
                                bitLength: 18,
                              },
                              operations: [{ "*": 5 }],
                              max: 999995,
                              step: 5,
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
          name: "Options",
          items: [
            {
              type: "section",
              flex: true,
              items: [
                {
                  id: "japanShift",
                  name: "Sound Mode",
                  offset: 0x6e8,
                  type: "variable",
                  dataType: "uint16",
                  bigEndian: true,
                  binary: {
                    bitStart: 7,
                    bitLength: 2,
                  },
                  resource: "soundModes",
                },
              ],
            },
            {
              type: "section",
              flex: true,
              items: [
                {
                  id: "japanShift-language",
                  name: "Language",
                  offset: 0x6e8,
                  type: "variable",
                  dataType: "uint8",
                  binary: {
                    bitStart: 1,
                    bitLength: 2,
                  },
                  resource: "languages",
                },
                {
                  id: "japanShift",
                  name: "Chimpy Cam",
                  offset: 0x6e8,
                  type: "variable",
                  dataType: "bit",
                  bit: 4,
                  resource: "chimpyCams",
                },
              ],
            },
          ],
        },
      ],
      items: [
        {
          name: "Checksum",
          offset: 0x1a8,
          type: "checksum",
          dataType: "uint32",
          bigEndian: true,
          control: {
            offsetStart: 0x0,
            offsetEnd: 0x1a8,
          },
        },
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
                              name: "Progression",
                              offset: 0x36,
                              type: "variable",
                              dataType: "bit",
                              bit: 0,
                              resource: "progressions",
                            },
                            {
                              id: "completionRate-%index%",
                              name: "Completion Rate",
                              offset: 0x0,
                              type: "variable",
                              dataType: "uint8",
                              suffix: "%",
                              disabled: true,
                            },
                            {
                              name: "Playtime",
                              type: "group",
                              mode: "time",
                              items: [
                                {
                                  offset: 0x1a3,
                                  type: "variable",
                                  dataType: "uint32",
                                  bigEndian: true,
                                  binary: {
                                    bitStart: 4,
                                    bitLength: 22,
                                  },
                                  operations: [
                                    {
                                      convert: {
                                        from: "seconds",
                                        to: "hours",
                                      },
                                    },
                                  ],
                                  max: 999,
                                },
                                {
                                  offset: 0x1a3,
                                  type: "variable",
                                  dataType: "uint32",
                                  bigEndian: true,
                                  binary: {
                                    bitStart: 4,
                                    bitLength: 22,
                                  },
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
                                  test: true,
                                },
                                {
                                  offset: 0x1a3,
                                  type: "variable",
                                  dataType: "uint32",
                                  bigEndian: true,
                                  binary: {
                                    bitStart: 4,
                                    bitLength: 22,
                                  },
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
                                  test: true,
                                },
                              ],
                            },
                            {
                              name: "Save Count",
                              offset: 0x1a0,
                              type: "variable",
                              dataType: "uint32",
                              bigEndian: true,
                              binary: {
                                bitStart: 2,
                                bitLength: 24,
                              },
                              hidden: true,
                            },
                            {
                              name: "Max Health",
                              offset: 0x19e,
                              type: "variable",
                              dataType: "uint8",
                              binary: {
                                bitStart: 1,
                                bitLength: 2,
                              },
                            },
                          ],
                        },
                        {
                          type: "section",
                          flex: true,
                          items: [
                            {
                              name: "Characters",
                              type: "bitflags",
                              flags: [
                                { offset: 0x19e, bit: 3, label: "Donkey Kong", disabled: true },
                                { offset: 0x0, bit: 6, label: "Diddy Kong" },
                                { offset: 0x8, bit: 6, label: "Lanky Kong" },
                                { offset: 0x8, bit: 2, label: "Tiny Kong" },
                                { offset: 0xe, bit: 5, label: "Chunky Kong" },
                              ],
                            },
                            {
                              name: "Moves",
                              type: "bitflags",
                              flags: [
                                { offset: 0x30, bit: 2, label: "Diving" },
                                { offset: 0x30, bit: 3, label: "Vine leaping" },
                                { offset: 0x30, bit: 4, label: "Grenades throwing" },
                                { offset: 0x30, bit: 5, label: "Barrels pickup" },
                                { offset: 0x2f, bit: 1, label: "Super Slam" },
                                { offset: 0x31, bit: 3, label: "Banana UI", hidden: true },
                                { offset: 0x31, bit: 4, label: "Banana Coins UI", hidden: true },
                              ],
                            },
                            {
                              id: "items-%index%",
                              name: "Items",
                              type: "bitflags",
                              flags: [
                                { offset: 0x10, bit: 4, label: "Nintendo Coin" },
                                { offset: 0x2f, bit: 3, label: "Rareware Coin" },
                                { offset: 0x2f, bit: 1, label: "Banana Camera" },
                              ],
                            },
                          ],
                        },
                      ],
                    },
                    {
                      name: "Banana Fairies",
                      items: [
                        {
                          id: "bananaFairies-%index%",
                          type: "bitflags",
                          flags: [
                            { offset: 0x4b, bit: 6, label: "<b>DK Isles:</b> Around a tree near Banana Fairy Island" },
                            { offset: 0x4a, bit: 1, label: "<b>DK Isles:</b> Inside a box in Frantic Factory lobby" },
                            { offset: 0x4a, bit: 2, label: "<b>DK Isles:</b> Inside Fungi Forest lobby" },
                            { offset: 0x4b, bit: 7, label: "<b>DK Isles:</b> At the top of Crocodile Isle", separator: true },
                            { offset: 0x49, bit: 5, label: "<b>Jungle Japes:</b> Above the lake in the cave" },
                            { offset: 0x49, bit: 6, label: "<b>Jungle Japes:</b> Inside the painting cave", separator: true },
                            { offset: 0x4b, bit: 0, label: "<b>Angry Aztec:</b> Inside Llama's Temple" },
                            { offset: 0x4b, bit: 1, label: "<b>Angry Aztec:</b> Inside Tiny's section in the 5 Doors Temple", separator: true },
                            { offset: 0x49, bit: 7, label: "<b>Frantic Factory:</b> Near Funky's Store" },
                            { offset: 0x4b, bit: 2, label: "<b>Frantic Factory:</b> Inside the tunnel to the numbered blocks room", separator: true },
                            { offset: 0x4a, bit: 0, label: "<b>Gloomy Galleon:</b> Inside one of the three chests" },
                            { offset: 0x4b, bit: 3, label: "<b>Gloomy Galleon:</b> Inside Tiny's section in the sunken ship", separator: true },
                            { offset: 0x4a, bit: 3, label: "<b>Fungi Forest:</b> Inside the dark attic" },
                            { offset: 0x4a, bit: 4, label: "<b>Fungi Forest:</b> Inside a box in the barn", separator: true },
                            { offset: 0x4a, bit: 5, label: "<b>Crystal Caves:</b> Inside Tiny's section in the igloo" },
                            { offset: 0x4c, bit: 0, label: "<b>Crystal Caves:</b> Inside the candles cabin", separator: true },
                            { offset: 0x4b, bit: 4, label: "<b>Creepy Castle:</b> Inside the museum" },
                            { offset: 0x4b, bit: 5, label: "<b>Creepy Castle:</b> Inside the tree at the water raising section", separator: true },
                            { offset: 0x4a, bit: 6, label: "<b>Hideout Helm:</b> Near the Boss Key" },
                            { offset: 0x4a, bit: 7, label: "<b>Hideout Helm:</b> Near the Boss Key" },
                          ],
                        },
                      ],
                    },
                    {
                      name: "Battle Crowns",
                      items: [
                        {
                          id: "battleCrowns-%index%",
                          type: "bitflags",
                          flags: [
                            { offset: 0x4c, bit: 6, label: "DK Isles 1" },
                            { offset: 0x4c, bit: 7, label: "DK Isles 2" },
                            { offset: 0x4c, bit: 1, label: "Jungle Japes" },
                            { offset: 0x4c, bit: 2, label: "Angry Aztec" },
                            { offset: 0x4c, bit: 3, label: "Frantic Factory" },
                            { offset: 0x4c, bit: 4, label: "Gloomy Galleon" },
                            { offset: 0x4c, bit: 5, label: "Fungi Forest" },
                            { offset: 0x4d, bit: 0, label: "Crystal Caves" },
                            { offset: 0x4d, bit: 1, label: "Creepy Castle" },
                            { offset: 0x4d, bit: 2, label: "Hideout Helm" },
                          ],
                        },
                      ],
                    },
                    {
                      name: "K. Lumsy's Prison",
                      flex: true,
                      items: [
                        {
                          id: "bossKeys-%index%",
                          name: "Boss Keys",
                          type: "bitflags",
                          flags: [
                            { offset: 0x3, bit: 2, label: "Jungle Japes" },
                            { offset: 0x9, bit: 2, label: "Angry Aztec" },
                            { offset: 0x11, bit: 2, label: "Frantic Factory" },
                            { offset: 0x15, bit: 0, label: "Gloomy Galleon" },
                            { offset: 0x1d, bit: 4, label: "Fungi Forest" },
                            { offset: 0x24, bit: 4, label: "Crystal Caves" },
                            { offset: 0x27, bit: 5, label: "Creepy Castle" },
                            { offset: 0x2f, bit: 4, label: "Hideout Helm" },
                          ],
                        },
                        {
                          name: "Locks",
                          type: "bitflags",
                          flags: [
                            { offset: 0x37, bit: 4, label: "Lock 1 unlocked" },
                            { offset: 0x37, bit: 5, label: "Lock 2 unlocked" },
                            { offset: 0x37, bit: 6, label: "Lock 3 unlocked" },
                            { offset: 0x37, bit: 7, label: "Lock 4 unlocked" },
                            { offset: 0x38, bit: 0, label: "Lock 5 unlocked" },
                            { offset: 0x38, bit: 1, label: "Lock 6 unlocked" },
                            { offset: 0x38, bit: 2, label: "Lock 7 unlocked" },
                            { offset: 0x38, bit: 3, label: "Lock 8 unlocked" },
                          ],
                        },
                      ],
                    },
                  ],
                },
              ],
            },
            {
              name: "Characters",
              items: [
                {
                  type: "tabs",
                  vertical: true,
                  items: [
                    {
                      name: "Donkey Kong",
                      flex: true,
                      items: [
                        {
                          id: "specialMoves",
                          name: "Special Moves",
                          type: "bitflags",
                          flags: [
                            { offset: 0x149, bit: 4, label: "Baboon Blast" },
                            { offset: 0x149, bit: 4, label: "Strong Kong" },
                            { offset: 0x149, bit: 4, label: "Gorilla Grab", separator: true },
                            { offset: 0x149, bit: 6, label: "Simian Slam" },
                            { offset: 0x149, bit: 6, label: "Super Simian Slam" },
                            { offset: 0x149, bit: 6, label: "Super Duper Simian Slam", separator: true },
                            { offset: 0x149, bit: 0, label: "Coconut Shooter" },
                            { offset: 0x149, bit: 1, label: "Homing Ammo" },
                            { offset: 0x149, bit: 2, label: "Sniper" },
                            { offset: 0x148, bit: 3, label: "Ammo Belt 1" },
                            { offset: 0x148, bit: 3, label: "Ammo Belt 2", separator: true },
                            { offset: 0x149, bit: 5, label: "Bongo Blast" },
                            { offset: 0x149, bit: 6, label: "Upgrade 1" },
                            { offset: 0x149, bit: 7, label: "Upgrade 2" },
                            { offset: 0x148, bit: 0, label: "Upgrade 3" },
                          ],
                        },
                        {
                          name: "Banana Coins",
                          offset: 0x14f,
                          type: "variable",
                          dataType: "uint16",
                          bigEndian: true,
                          binary: {
                            bitStart: 1,
                            bitLength: 8,
                          },
                          max: 179,
                        },
                      ],
                    },
                    {
                      name: "Diddy Kong",
                      flex: true,
                      items: [
                        {
                          id: "specialMoves",
                          name: "Special Moves",
                          type: "bitflags",
                          flags: [
                            { offset: 0x15d, bit: 5, label: "Chimpy Charge" },
                            { offset: 0x15d, bit: 5, label: "Rocketbarrel Boost" },
                            { offset: 0x15d, bit: 5, label: "Simian Spring", separator: true },
                            { offset: 0x15d, bit: 7, label: "Simian Slam" },
                            { offset: 0x15d, bit: 7, label: "Super Simian Slam" },
                            { offset: 0x15d, bit: 7, label: "Super Duper Simian Slam", separator: true },
                            { offset: 0x15d, bit: 1, label: "Peanut Popguns" },
                            { offset: 0x15d, bit: 2, label: "Homing Ammo" },
                            { offset: 0x15d, bit: 3, label: "Sniper" },
                            { offset: 0x15c, bit: 4, label: "Ammo Belt 1" },
                            { offset: 0x15c, bit: 4, label: "Ammo Belt 2", separator: true },
                            { offset: 0x15d, bit: 6, label: "Guitar Gazump" },
                            { offset: 0x15d, bit: 7, label: "Upgrade 1" },
                            { offset: 0x15c, bit: 0, label: "Upgrade 2" },
                            { offset: 0x15c, bit: 1, label: "Upgrade 3" },
                          ],
                        },
                        {
                          name: "Banana Coins",
                          offset: 0x163,
                          type: "variable",
                          dataType: "uint16",
                          bigEndian: true,
                          binary: {
                            bitStart: 2,
                            bitLength: 8,
                          },
                          max: 183,
                        },
                      ],
                    },
                    {
                      name: "Lanky Kong",
                      flex: true,
                      items: [
                        {
                          id: "specialMoves",
                          name: "Special Moves",
                          type: "bitflags",
                          flags: [
                            { offset: 0x171, bit: 6, label: "Orangstand" },
                            { offset: 0x171, bit: 6, label: "Baboon Balloon" },
                            { offset: 0x171, bit: 6, label: "Orangstand Sprint", separator: true },
                            { offset: 0x170, bit: 0, label: "Simian Slam" },
                            { offset: 0x170, bit: 0, label: "Super Simian Slam" },
                            { offset: 0x170, bit: 0, label: "Super Duper Simian Slam", separator: true },
                            { offset: 0x171, bit: 2, label: "Grape Shooter" },
                            { offset: 0x171, bit: 3, label: "Homing Ammo" },
                            { offset: 0x171, bit: 4, label: "Sniper" },
                            { offset: 0x170, bit: 5, label: "Ammo Belt 1" },
                            { offset: 0x170, bit: 5, label: "Ammo Belt 2", separator: true },
                            { offset: 0x171, bit: 7, label: "Trombone Tremor" },
                            { offset: 0x170, bit: 0, label: "Upgrade 1" },
                            { offset: 0x170, bit: 1, label: "Upgrade 2" },
                            { offset: 0x170, bit: 2, label: "Upgrade 3" },
                          ],
                        },
                        {
                          name: "Banana Coins",
                          offset: 0x177,
                          type: "variable",
                          dataType: "uint16",
                          bigEndian: true,
                          binary: {
                            bitStart: 3,
                            bitLength: 8,
                          },
                          max: 190,
                        },
                      ],
                    },
                    {
                      name: "Tiny Kong",
                      flex: true,
                      items: [
                        {
                          id: "specialMoves",
                          name: "Special Moves",
                          type: "bitflags",
                          flags: [
                            { offset: 0x185, bit: 7, label: "Mini Monkey" },
                            { offset: 0x185, bit: 7, label: "Pony Tail Twirl" },
                            { offset: 0x185, bit: 7, label: "Monkeyport", separator: true },
                            { offset: 0x184, bit: 1, label: "Simian Slam" },
                            { offset: 0x184, bit: 1, label: "Super Simian Slam" },
                            { offset: 0x184, bit: 1, label: "Super Duper Simian Slam", separator: true },
                            { offset: 0x185, bit: 3, label: "Feather Bow" },
                            { offset: 0x185, bit: 4, label: "Homing Ammo" },
                            { offset: 0x185, bit: 5, label: "Sniper" },
                            { offset: 0x184, bit: 6, label: "Ammo Belt 1" },
                            { offset: 0x184, bit: 6, label: "Ammo Belt 2", separator: true },
                            { offset: 0x184, bit: 0, label: "Saxophone Slam" },
                            { offset: 0x184, bit: 1, label: "Upgrade 1" },
                            { offset: 0x184, bit: 2, label: "Upgrade 2" },
                            { offset: 0x184, bit: 3, label: "Upgrade 3" },
                          ],
                        },
                        {
                          name: "Banana Coins",
                          offset: 0x18b,
                          type: "variable",
                          dataType: "uint16",
                          bigEndian: true,
                          binary: {
                            bitStart: 4,
                            bitLength: 8,
                          },
                          max: 198,
                        },
                      ],
                    },
                    {
                      name: "Chunky Kong",
                      flex: true,
                      items: [
                        {
                          id: "specialMoves",
                          name: "Special Moves",
                          type: "bitflags",
                          flags: [
                            { offset: 0x198, bit: 0, label: "Hunky Chunky" },
                            { offset: 0x198, bit: 0, label: "Primate Punch" },
                            { offset: 0x198, bit: 0, label: "Gorilla Gone", separator: true },
                            { offset: 0x198, bit: 2, label: "Simian Slam" },
                            { offset: 0x198, bit: 2, label: "Super Simian Slam" },
                            { offset: 0x198, bit: 2, label: "Super Duper Simian Slam", separator: true },
                            { offset: 0x199, bit: 4, label: "Pineapple Launcher" },
                            { offset: 0x199, bit: 5, label: "Homing Ammo" },
                            { offset: 0x199, bit: 6, label: "Sniper" },
                            { offset: 0x198, bit: 7, label: "Ammo Belt 1" },
                            { offset: 0x198, bit: 7, label: "Ammo Belt 2", separator: true },
                            { offset: 0x198, bit: 1, label: "Triangle Trample" },
                            { offset: 0x198, bit: 2, label: "Upgrade 1" },
                            { offset: 0x198, bit: 3, label: "Upgrade 2" },
                            { offset: 0x198, bit: 4, label: "Upgrade 3" },
                          ],
                        },
                        {
                          name: "Banana Coins",
                          offset: 0x19f,
                          type: "variable",
                          dataType: "uint16",
                          bigEndian: true,
                          binary: {
                            bitStart: 5,
                            bitLength: 8,
                          },
                          max: 224,
                        },
                      ],
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
                    dkIsles,
                    jungleJapes,
                    angryAztec,
                    franticFactory,
                    gloomyGalleon,
                    fungiForest,
                    crystalCaves,
                    creepyCastle,
                    hideoutHelm,
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
    booleanUnlocked: {
      0x0: "-",
      0x1: "Unlocked",
    },
    chimpyCams: {
      0x0: "Free",
      0x1: "Follow",
    },
    languages: {
      0x0: "English",
      0x1: "French",
      0x2: "German",
      0x3: "Spanish",
    },
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
      0x1b: "-",
      0x1c: " ",
    },
    progressions: {
      0x0: "-",
      0x1: "Cleared",
    },
    soundModes: {
      0x0: "Stereo",
      0x1: "Mono",
      0x2: "Surround",
    },
  },
};

export default template;
