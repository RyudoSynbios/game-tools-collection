import type { GameJson, ItemInt, ItemTab } from "$lib/types";

import {
  characters,
  charactersSorted,
  dataSpecialTypes,
  eventMatches,
  trophies,
} from "../utils/resource";

const template: GameJson = {
  validator: {
    regions: {
      europe: {
        0x0: [0x47, 0x41, 0x4c, 0x50, 0x30, 0x31], // "GALP01"
      },
      usa: {
        0x0: [0x47, 0x41, 0x4c, 0x45, 0x30, 0x31], // "GALE01"
      },
      japan: {
        0x0: [0x47, 0x41, 0x4c, 0x4a, 0x30, 0x31], // "GALJ01"
      },
    },
    text: "Drag 'n' drop here or click to add a save file.",
    error: "Not a valid save file.",
  },
  items: [
    {
      type: "section",
      flex: true,
      hidden: true,
      items: [
        {
          name: "Checksum 1",
          offset: 0x0,
          type: "checksum",
          dataType: "uint64",
          bigEndian: true,
          control: {
            offsetStart: 0x10,
            offsetEnd: 0x2000,
          },
        },
        {
          id: "checksum",
          name: "Checksum 2",
          offset: 0x8,
          type: "checksum",
          dataType: "uint64",
          bigEndian: true,
          control: {
            offsetStart: 0x10,
            offsetEnd: 0x2000,
          },
        },
      ],
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
                  name: "Coins",
                  offset: 0x200,
                  type: "variable",
                  dataType: "uint32",
                  bigEndian: true,
                  operations: [{ "/": 10 }, { roundFloor: 0 }],
                  max: 9999,
                },
              ],
            },
            {
              type: "section",
              flex: true,
              items: [
                {
                  name: "Unlocked Challengers",
                  type: "bitflags",
                  flags: [
                    { offset: 0x21, bit: 1, label: "Luigi" }, // prettier-ignore
                    { offset: 0x21, bit: 4, label: "Jigglypuff" }, // prettier-ignore
                    { offset: 0x21, bit: 3, label: "Mewtwo" }, // prettier-ignore
                    { offset: 0x21, bit: 2, label: "Marth" }, // prettier-ignore
                    { offset: 0x21, bit: 0, label: "Mr. Game & Watch" }, // prettier-ignore
                    { offset: 0x21, bit: 7, label: "Dr. Mario" }, // prettier-ignore
                    { offset: 0x20, bit: 2, label: "Ganondorf" }, // prettier-ignore
                    { offset: 0x21, bit: 5, label: "Falco" }, // prettier-ignore
                    { offset: 0x21, bit: 6, label: "Young Link" }, // prettier-ignore
                    { offset: 0x20, bit: 1, label: "Pichu" }, // prettier-ignore
                    { offset: 0x20, bit: 0, label: "Roy" }, // prettier-ignore
                    { offset: 0x20, bit: 3, label: "???", hidden: true }, // prettier-ignore
                    { offset: 0x20, bit: 4, label: "???", hidden: true }, // prettier-ignore
                    { offset: 0x20, bit: 5, label: "???", hidden: true }, // prettier-ignore
                    { offset: 0x20, bit: 6, label: "???", hidden: true }, // prettier-ignore
                    { offset: 0x20, bit: 7, label: "???", hidden: true }, // prettier-ignore
                  ],
                },
                {
                  name: "Unlocked Stages",
                  type: "bitflags",
                  flags: [
                    { offset: 0x23, bit: 5, label: "Flat Zone" }, // prettier-ignore
                    { offset: 0x23, bit: 0, label: "Brinstar Depths" }, // prettier-ignore
                    { offset: 0x23, bit: 3, label: "Fourside" }, // prettier-ignore
                    { offset: 0x23, bit: 2, label: "Big Blue" }, // prettier-ignore
                    { offset: 0x23, bit: 1, label: "Poké Floats" }, // prettier-ignore
                    { offset: 0x23, bit: 4, label: "Mushroom Kingdom II" }, // prettier-ignore
                    { offset: 0x23, bit: 6, label: "Battlefield" }, // prettier-ignore
                    { offset: 0x23, bit: 7, label: "Final Destination" }, // prettier-ignore
                    { offset: 0x22, bit: 0, label: "Dream Land N64" }, // prettier-ignore
                    { offset: 0x22, bit: 1, label: "Yoshi's Island N64" }, // prettier-ignore
                    { offset: 0x22, bit: 2, label: "Kongo Jungle N64" }, // prettier-ignore
                    { offset: 0x22, bit: 3, label: "???", hidden: true }, // prettier-ignore
                    { offset: 0x22, bit: 4, label: "???", hidden: true }, // prettier-ignore
                    { offset: 0x22, bit: 5, label: "???", hidden: true }, // prettier-ignore
                    { offset: 0x22, bit: 6, label: "???", hidden: true }, // prettier-ignore
                    { offset: 0x22, bit: 7, label: "???", hidden: true }, // prettier-ignore
                  ],
                },
                {
                  name: "Unlocked Options",
                  type: "bitflags",
                  flags: [
                    { offset: 0x25, bit: 0, label: "???", hidden: true }, // prettier-ignore
                    { offset: 0x25, bit: 1, label: "???", hidden: true }, // prettier-ignore
                    { offset: 0x25, bit: 2, label: "???", hidden: true }, // prettier-ignore
                    { offset: 0x25, bit: 3, label: "???", hidden: true }, // prettier-ignore
                    { offset: 0x25, bit: 4, label: "???", hidden: true }, // prettier-ignore
                    { offset: 0x25, bit: 5, label: "???", hidden: true }, // prettier-ignore
                    { offset: 0x25, bit: 6, label: "???", hidden: true }, // prettier-ignore
                    { offset: 0x25, bit: 7, label: "???", hidden: true }, // prettier-ignore
                    { offset: 0x24, bit: 0, label: "Score Display" }, // prettier-ignore
                    { offset: 0x24, bit: 1, label: "Random Stage" }, // prettier-ignore
                    { offset: 0x24, bit: 2, label: "All-Star" }, // prettier-ignore
                    { offset: 0x24, bit: 3, label: "Sound Test" }, // prettier-ignore
                    { offset: 0x24, bit: 4, label: "???", hidden: true }, // prettier-ignore
                    { offset: 0x24, bit: 5, label: "???", hidden: true }, // prettier-ignore
                    { offset: 0x24, bit: 6, label: "???", hidden: true }, // prettier-ignore
                    { offset: 0x24, bit: 7, label: "???", hidden: true }, // prettier-ignore
                  ],
                },
                {
                  type: "section",
                  background: true,
                  hidden: true,
                  items: [
                    {
                      name: "All Characters Unlocked Flag",
                      offset: 0x1cc,
                      type: "variable",
                      dataType: "boolean",
                    },
                    {
                      name: "All Standard Stages Unlocked Flag",
                      offset: 0x1cd,
                      type: "variable",
                      dataType: "boolean",
                    },
                    {
                      name: "All Stages Unlocked Flag",
                      offset: 0x1ce,
                      type: "variable",
                      dataType: "boolean",
                    },
                  ],
                },
              ],
            },
          ],
        },
        {
          name: "1-P Mode",
          items: [
            {
              type: "tabs",
              items: [
                {
                  name: "Regular Match",
                  items: [
                    {
                      type: "tabs",
                      items: [
                        {
                          name: "Classic",
                          items: [
                            {
                              length: 0xac,
                              type: "container",
                              instanceType: "tabs",
                              instances: 25,
                              resource: "characters",
                              resourceOrder: true,
                              vertical: true,
                              flex: true,
                              items: [
                                {
                                  name: "Cleared",
                                  offset: 0x760,
                                  type: "variable",
                                  dataType: "bit",
                                  bit: 3,
                                  hidden: true,
                                },
                                {
                                  id: "cleared-0-%index%",
                                  name: "Cleared Difficulty",
                                  offset: 0x764,
                                  type: "variable",
                                  dataType: "uint8",
                                  resource: "difficulties",
                                },
                                {
                                  name: "Highscore",
                                  offset: 0x76c,
                                  type: "variable",
                                  dataType: "uint32",
                                  bigEndian: true,
                                  max: 99999999,
                                },
                              ],
                            },
                            {
                              name: "Cleared by Characters",
                              type: "bitflags",
                              hidden: true,
                              flags: [
                                { offset: 0x3b, bit: 0, label: "C. Falcon" }, // prettier-ignore
                                { offset: 0x3b, bit: 1, label: "DK" }, // prettier-ignore
                                { offset: 0x3b, bit: 2, label: "Fox" }, // prettier-ignore
                                { offset: 0x3b, bit: 3, label: "Mr. Game & Watch" }, // prettier-ignore
                                { offset: 0x3b, bit: 4, label: "Kirby" }, // prettier-ignore
                                { offset: 0x3b, bit: 5, label: "Bowser" }, // prettier-ignore
                                { offset: 0x3b, bit: 6, label: "Link" }, // prettier-ignore
                                { offset: 0x3b, bit: 7, label: "Luigi" }, // prettier-ignore
                                { offset: 0x3a, bit: 0, label: "Mario" }, // prettier-ignore
                                { offset: 0x3a, bit: 1, label: "Marth" }, // prettier-ignore
                                { offset: 0x3a, bit: 2, label: "Mewtwo" }, // prettier-ignore
                                { offset: 0x3a, bit: 3, label: "Ness" }, // prettier-ignore
                                { offset: 0x3a, bit: 4, label: "Peach" }, // prettier-ignore
                                { offset: 0x3a, bit: 5, label: "Pikachu" }, // prettier-ignore
                                { offset: 0x3a, bit: 6, label: "Ice Climbers" }, // prettier-ignore
                                { offset: 0x3a, bit: 7, label: "Jigglypuff" }, // prettier-ignore
                                { offset: 0x39, bit: 0, label: "Samus" }, // prettier-ignore
                                { offset: 0x39, bit: 1, label: "Yoshi" }, // prettier-ignore
                                { offset: 0x39, bit: 2, label: "Zelda" }, // prettier-ignore
                                { offset: 0x39, bit: 3, label: "Falco" }, // prettier-ignore
                                { offset: 0x39, bit: 4, label: "Young Link" }, // prettier-ignore
                                { offset: 0x39, bit: 5, label: "Dr. Mario" }, // prettier-ignore
                                { offset: 0x39, bit: 6, label: "Roy" }, // prettier-ignore
                                { offset: 0x39, bit: 7, label: "Pichu" }, // prettier-ignore
                                { offset: 0x38, bit: 0, label: "Ganondorf" }, // prettier-ignore
                                { offset: 0x38, bit: 1, label: "???" }, // prettier-ignore
                                { offset: 0x38, bit: 2, label: "???" }, // prettier-ignore
                                { offset: 0x38, bit: 3, label: "???" }, // prettier-ignore
                                { offset: 0x38, bit: 4, label: "???" }, // prettier-ignore
                                { offset: 0x38, bit: 5, label: "???" }, // prettier-ignore
                                { offset: 0x38, bit: 6, label: "???" }, // prettier-ignore
                                { offset: 0x38, bit: 7, label: "???" }, // prettier-ignore
                              ],
                            },
                          ],
                        },
                        {
                          name: "Adventure",
                          items: [
                            {
                              length: 0xac,
                              type: "container",
                              instanceType: "tabs",
                              instances: 25,
                              resource: "characters",
                              resourceOrder: true,
                              vertical: true,
                              flex: true,
                              items: [
                                {
                                  name: "Cleared",
                                  offset: 0x760,
                                  type: "variable",
                                  dataType: "bit",
                                  bit: 2,
                                  hidden: true,
                                },
                                {
                                  id: "cleared-1-%index%",
                                  name: "Cleared Difficulty",
                                  offset: 0x765,
                                  type: "variable",
                                  dataType: "uint8",
                                  resource: "difficulties",
                                },
                                {
                                  name: "Highscore",
                                  offset: 0x770,
                                  type: "variable",
                                  dataType: "uint32",
                                  bigEndian: true,
                                  max: 99999999,
                                },
                              ],
                            },
                            {
                              name: "Cleared by Characters",
                              type: "bitflags",
                              hidden: true,
                              flags: [
                                { offset: 0x3f, bit: 0, label: "C. Falcon" }, // prettier-ignore
                                { offset: 0x3f, bit: 1, label: "DK" }, // prettier-ignore
                                { offset: 0x3f, bit: 2, label: "Fox" }, // prettier-ignore
                                { offset: 0x3f, bit: 3, label: "Mr. Game & Watch" }, // prettier-ignore
                                { offset: 0x3f, bit: 4, label: "Kirby" }, // prettier-ignore
                                { offset: 0x3f, bit: 5, label: "Bowser" }, // prettier-ignore
                                { offset: 0x3f, bit: 6, label: "Link" }, // prettier-ignore
                                { offset: 0x3f, bit: 7, label: "Luigi" }, // prettier-ignore
                                { offset: 0x3e, bit: 0, label: "Mario" }, // prettier-ignore
                                { offset: 0x3e, bit: 1, label: "Marth" }, // prettier-ignore
                                { offset: 0x3e, bit: 2, label: "Mewtwo" }, // prettier-ignore
                                { offset: 0x3e, bit: 3, label: "Ness" }, // prettier-ignore
                                { offset: 0x3e, bit: 4, label: "Peach" }, // prettier-ignore
                                { offset: 0x3e, bit: 5, label: "Pikachu" }, // prettier-ignore
                                { offset: 0x3e, bit: 6, label: "Ice Climbers" }, // prettier-ignore
                                { offset: 0x3e, bit: 7, label: "Jigglypuff" }, // prettier-ignore
                                { offset: 0x3d, bit: 0, label: "Samus" }, // prettier-ignore
                                { offset: 0x3d, bit: 1, label: "Yoshi" }, // prettier-ignore
                                { offset: 0x3d, bit: 2, label: "Zelda" }, // prettier-ignore
                                { offset: 0x3d, bit: 3, label: "Falco" }, // prettier-ignore
                                { offset: 0x3d, bit: 4, label: "Young Link" }, // prettier-ignore
                                { offset: 0x3d, bit: 5, label: "Dr. Mario" }, // prettier-ignore
                                { offset: 0x3d, bit: 6, label: "Roy" }, // prettier-ignore
                                { offset: 0x3d, bit: 7, label: "Pichu" }, // prettier-ignore
                                { offset: 0x3c, bit: 0, label: "Ganondorf" }, // prettier-ignore
                                { offset: 0x3c, bit: 1, label: "???" }, // prettier-ignore
                                { offset: 0x3c, bit: 2, label: "???" }, // prettier-ignore
                                { offset: 0x3c, bit: 3, label: "???" }, // prettier-ignore
                                { offset: 0x3c, bit: 4, label: "???" }, // prettier-ignore
                                { offset: 0x3c, bit: 5, label: "???" }, // prettier-ignore
                                { offset: 0x3c, bit: 6, label: "???" }, // prettier-ignore
                                { offset: 0x3c, bit: 7, label: "???" }, // prettier-ignore
                              ],
                            },
                          ],
                        },
                        {
                          name: "All-Star",
                          items: [
                            {
                              length: 0xac,
                              type: "container",
                              instanceType: "tabs",
                              instances: 25,
                              resource: "characters",
                              resourceOrder: true,
                              vertical: true,
                              flex: true,
                              items: [
                                {
                                  name: "Cleared",
                                  offset: 0x760,
                                  type: "variable",
                                  dataType: "bit",
                                  bit: 1,
                                  hidden: true,
                                },
                                {
                                  id: "cleared-2-%index%",
                                  name: "Cleared Difficulty",
                                  offset: 0x766,
                                  type: "variable",
                                  dataType: "uint8",
                                  resource: "difficulties",
                                },
                                {
                                  name: "Highscore",
                                  offset: 0x774,
                                  type: "variable",
                                  dataType: "uint32",
                                  bigEndian: true,
                                  max: 99999999,
                                },
                              ],
                            },
                            {
                              name: "Cleared by Characters",
                              type: "bitflags",
                              hidden: true,
                              flags: [
                                { offset: 0x43, bit: 0, label: "C. Falcon" }, // prettier-ignore
                                { offset: 0x43, bit: 1, label: "DK" }, // prettier-ignore
                                { offset: 0x43, bit: 2, label: "Fox" }, // prettier-ignore
                                { offset: 0x43, bit: 3, label: "Mr. Game & Watch" }, // prettier-ignore
                                { offset: 0x43, bit: 4, label: "Kirby" }, // prettier-ignore
                                { offset: 0x43, bit: 5, label: "Bowser" }, // prettier-ignore
                                { offset: 0x43, bit: 6, label: "Link" }, // prettier-ignore
                                { offset: 0x43, bit: 7, label: "Luigi" }, // prettier-ignore
                                { offset: 0x42, bit: 0, label: "Mario" }, // prettier-ignore
                                { offset: 0x42, bit: 1, label: "Marth" }, // prettier-ignore
                                { offset: 0x42, bit: 2, label: "Mewtwo" }, // prettier-ignore
                                { offset: 0x42, bit: 3, label: "Ness" }, // prettier-ignore
                                { offset: 0x42, bit: 4, label: "Peach" }, // prettier-ignore
                                { offset: 0x42, bit: 5, label: "Pikachu" }, // prettier-ignore
                                { offset: 0x42, bit: 6, label: "Ice Climbers" }, // prettier-ignore
                                { offset: 0x42, bit: 7, label: "Jigglypuff" }, // prettier-ignore
                                { offset: 0x41, bit: 0, label: "Samus" }, // prettier-ignore
                                { offset: 0x41, bit: 1, label: "Yoshi" }, // prettier-ignore
                                { offset: 0x41, bit: 2, label: "Zelda" }, // prettier-ignore
                                { offset: 0x41, bit: 3, label: "Falco" }, // prettier-ignore
                                { offset: 0x41, bit: 4, label: "Young Link" }, // prettier-ignore
                                { offset: 0x41, bit: 5, label: "Dr. Mario" }, // prettier-ignore
                                { offset: 0x41, bit: 6, label: "Roy" }, // prettier-ignore
                                { offset: 0x41, bit: 7, label: "Pichu" }, // prettier-ignore
                                { offset: 0x40, bit: 0, label: "Ganondorf" }, // prettier-ignore
                                { offset: 0x40, bit: 1, label: "???" }, // prettier-ignore
                                { offset: 0x40, bit: 2, label: "???" }, // prettier-ignore
                                { offset: 0x40, bit: 3, label: "???" }, // prettier-ignore
                                { offset: 0x40, bit: 4, label: "???" }, // prettier-ignore
                                { offset: 0x40, bit: 5, label: "???" }, // prettier-ignore
                                { offset: 0x40, bit: 6, label: "???" }, // prettier-ignore
                                { offset: 0x40, bit: 7, label: "???" }, // prettier-ignore
                              ],
                            },
                          ],
                        },
                      ],
                    },
                  ],
                },
                {
                  name: "Event Match",
                  items: [
                    {
                      type: "tabs",
                      vertical: true,
                      items: eventMatches.map(
                        (range) =>
                          ({
                            name: range.name,
                            items: range.matches.map((match) => ({
                              name: match.name,
                              type: "section",
                              flex: true,
                              items: [
                                {
                                  name: "Progression",
                                  offset: 0x227 - Math.floor(match.index / 8),
                                  type: "variable",
                                  dataType: "bit",
                                  bit: match.index % 8,
                                  resource: "progressions",
                                },
                                (match.type === "Time" && {
                                  name: "Time",
                                  type: "group",
                                  mode: "chrono",
                                  items: [
                                    {
                                      offset: 0x228 + match.index * 0x4,
                                      type: "variable",
                                      dataType: "uint32",
                                      bigEndian: true,
                                      operations: [
                                        { "/": 60 },
                                        {
                                          convert: {
                                            from: "seconds",
                                            to: "minutes",
                                          },
                                        },
                                      ],
                                      max: 59,
                                    },
                                    {
                                      offset: 0x228 + match.index * 0x4,
                                      type: "variable",
                                      dataType: "uint32",
                                      bigEndian: true,
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
                                    {
                                      offset: 0x228 + match.index * 0x4,
                                      type: "variable",
                                      dataType: "uint32",
                                      bigEndian: true,
                                      operations: [
                                        { "/": 60 },
                                        {
                                          convert: {
                                            from: "seconds",
                                            to: "milliseconds",
                                          },
                                        },
                                        { round: 0 },
                                      ],
                                      leadingZeros: 2,
                                      max: 999,
                                      step: 100,
                                    },
                                  ],
                                }) || {
                                  name: match.type,
                                  offset: 0x228 + match.index * 0x4,
                                  type: "variable",
                                  dataType: "int32",
                                  bigEndian: true,
                                  min: 0,
                                },
                              ],
                            })),
                          }) as ItemTab,
                      ),
                    },
                  ],
                },
                {
                  name: "Stadium",
                  items: [
                    {
                      type: "tabs",
                      items: [
                        {
                          name: "Target Test",
                          items: [
                            {
                              length: 0xac,
                              type: "container",
                              instanceType: "tabs",
                              instances: 25,
                              resource: "characters",
                              resourceOrder: true,
                              vertical: true,
                              flex: true,
                              items: [
                                {
                                  name: "Progression",
                                  offset: 0x760,
                                  type: "variable",
                                  dataType: "bit",
                                  bit: 7,
                                  resource: "progressions",
                                },
                                {
                                  name: "Highscore",
                                  offset: 0x778,
                                  type: "variable",
                                  dataType: "uint32",
                                  bigEndian: true,
                                  max: 9,
                                },
                                {
                                  name: "Highscore",
                                  type: "group",
                                  mode: "chrono",
                                  items: [
                                    {
                                      offset: 0x778,
                                      type: "variable",
                                      dataType: "uint32",
                                      bigEndian: true,
                                      operations: [
                                        { "/": 60 },
                                        {
                                          convert: {
                                            from: "seconds",
                                            to: "minutes",
                                          },
                                        },
                                      ],
                                      max: 59,
                                    },
                                    {
                                      offset: 0x778,
                                      type: "variable",
                                      dataType: "uint32",
                                      bigEndian: true,
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
                                    {
                                      offset: 0x778,
                                      type: "variable",
                                      dataType: "uint32",
                                      bigEndian: true,
                                      operations: [
                                        { "/": 60 },
                                        {
                                          convert: {
                                            from: "seconds",
                                            to: "milliseconds",
                                          },
                                        },
                                        { round: 0 },
                                      ],
                                      leadingZeros: 2,
                                      max: 999,
                                      step: 100,
                                    },
                                  ],
                                },
                                {
                                  name: "Unlockables Trophies Related",
                                  offset: 0x9c,
                                  type: "variable",
                                  dataType: "uint32",
                                  bigEndian: true,
                                  overrideShift: {
                                    parent: 1,
                                    shift: 0x4,
                                  },
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
                                  name: "Cleared by Characters (Characters)",
                                  type: "bitflags",
                                  hidden: true,
                                  flags: [
                                    { offset: 0x47, bit: 0, label: "C. Falcon" }, // prettier-ignore
                                    { offset: 0x47, bit: 1, label: "DK" }, // prettier-ignore
                                    { offset: 0x47, bit: 2, label: "Fox" }, // prettier-ignore
                                    { offset: 0x47, bit: 3, label: "Mr. Game & Watch" }, // prettier-ignore
                                    { offset: 0x47, bit: 4, label: "Kirby" }, // prettier-ignore
                                    { offset: 0x47, bit: 5, label: "Bowser" }, // prettier-ignore
                                    { offset: 0x47, bit: 6, label: "Link" }, // prettier-ignore
                                    { offset: 0x47, bit: 7, label: "Luigi" }, // prettier-ignore
                                    { offset: 0x46, bit: 0, label: "Mario" }, // prettier-ignore
                                    { offset: 0x46, bit: 1, label: "Marth" }, // prettier-ignore
                                    { offset: 0x46, bit: 2, label: "Mewtwo" }, // prettier-ignore
                                    { offset: 0x46, bit: 3, label: "Ness" }, // prettier-ignore
                                    { offset: 0x46, bit: 4, label: "Peach" }, // prettier-ignore
                                    { offset: 0x46, bit: 5, label: "Pikachu" }, // prettier-ignore
                                    { offset: 0x46, bit: 6, label: "Ice Climbers" }, // prettier-ignore
                                    { offset: 0x46, bit: 7, label: "Jigglypuff" }, // prettier-ignore
                                    { offset: 0x45, bit: 0, label: "Samus" }, // prettier-ignore
                                    { offset: 0x45, bit: 1, label: "Yoshi" }, // prettier-ignore
                                    { offset: 0x45, bit: 2, label: "Zelda" }, // prettier-ignore
                                    { offset: 0x45, bit: 3, label: "Falco" }, // prettier-ignore
                                    { offset: 0x45, bit: 4, label: "Young Link" }, // prettier-ignore
                                    { offset: 0x45, bit: 5, label: "Dr. Mario" }, // prettier-ignore
                                    { offset: 0x45, bit: 6, label: "Roy" }, // prettier-ignore
                                    { offset: 0x45, bit: 7, label: "Pichu" }, // prettier-ignore
                                    { offset: 0x44, bit: 0, label: "Ganondorf" }, // prettier-ignore
                                    { offset: 0x44, bit: 1, label: "???" }, // prettier-ignore
                                    { offset: 0x44, bit: 2, label: "???" }, // prettier-ignore
                                    { offset: 0x44, bit: 3, label: "???" }, // prettier-ignore
                                    { offset: 0x44, bit: 4, label: "???" }, // prettier-ignore
                                    { offset: 0x44, bit: 5, label: "???" }, // prettier-ignore
                                    { offset: 0x44, bit: 6, label: "???" }, // prettier-ignore
                                    { offset: 0x44, bit: 7, label: "???" }, // prettier-ignore
                                  ],
                                },
                                {
                                  name: "Cleared by Characters (Stages)",
                                  type: "bitflags",
                                  hidden: true,
                                  flags: [
                                    { offset: 0x4f, bit: 0, label: "C. Falcon" }, // prettier-ignore
                                    { offset: 0x4f, bit: 1, label: "DK" }, // prettier-ignore
                                    { offset: 0x4f, bit: 2, label: "Fox" }, // prettier-ignore
                                    { offset: 0x4f, bit: 3, label: "Mr. Game & Watch" }, // prettier-ignore
                                    { offset: 0x4f, bit: 4, label: "Kirby" }, // prettier-ignore
                                    { offset: 0x4f, bit: 5, label: "Bowser" }, // prettier-ignore
                                    { offset: 0x4f, bit: 6, label: "Link" }, // prettier-ignore
                                    { offset: 0x4f, bit: 7, label: "Luigi" }, // prettier-ignore
                                    { offset: 0x4e, bit: 0, label: "Mario" }, // prettier-ignore
                                    { offset: 0x4e, bit: 1, label: "Marth" }, // prettier-ignore
                                    { offset: 0x4e, bit: 2, label: "Mewtwo" }, // prettier-ignore
                                    { offset: 0x4e, bit: 3, label: "Ness" }, // prettier-ignore
                                    { offset: 0x4e, bit: 4, label: "Peach" }, // prettier-ignore
                                    { offset: 0x4e, bit: 5, label: "Pikachu" }, // prettier-ignore
                                    { offset: 0x4e, bit: 6, label: "Ice Climbers" }, // prettier-ignore
                                    { offset: 0x4e, bit: 7, label: "Jigglypuff" }, // prettier-ignore
                                    { offset: 0x4d, bit: 0, label: "Samus" }, // prettier-ignore
                                    { offset: 0x4d, bit: 1, label: "Yoshi" }, // prettier-ignore
                                    { offset: 0x4d, bit: 2, label: "Zelda" }, // prettier-ignore
                                    { offset: 0x4d, bit: 3, label: "Falco" }, // prettier-ignore
                                    { offset: 0x4d, bit: 4, label: "Young Link" }, // prettier-ignore
                                    { offset: 0x4d, bit: 5, label: "Dr. Mario" }, // prettier-ignore
                                    { offset: 0x4d, bit: 6, label: "Roy" }, // prettier-ignore
                                    { offset: 0x4d, bit: 7, label: "Pichu" }, // prettier-ignore
                                    { offset: 0x4c, bit: 0, label: "Ganondorf" }, // prettier-ignore
                                    { offset: 0x4c, bit: 1, label: "???" }, // prettier-ignore
                                    { offset: 0x4c, bit: 2, label: "???" }, // prettier-ignore
                                    { offset: 0x4c, bit: 3, label: "???" }, // prettier-ignore
                                    { offset: 0x4c, bit: 4, label: "???" }, // prettier-ignore
                                    { offset: 0x4c, bit: 5, label: "???" }, // prettier-ignore
                                    { offset: 0x4c, bit: 6, label: "???" }, // prettier-ignore
                                    { offset: 0x4c, bit: 7, label: "???" }, // prettier-ignore
                                  ],
                                },
                                {
                                  name: "Cleared by Characters (Trophies)",
                                  type: "bitflags",
                                  hidden: true,
                                  flags: [
                                    { offset: 0x5b, bit: 0, label: "C. Falcon" }, // prettier-ignore
                                    { offset: 0x5b, bit: 1, label: "DK" }, // prettier-ignore
                                    { offset: 0x5b, bit: 2, label: "Fox" }, // prettier-ignore
                                    { offset: 0x5b, bit: 3, label: "Mr. Game & Watch" }, // prettier-ignore
                                    { offset: 0x5b, bit: 4, label: "Kirby" }, // prettier-ignore
                                    { offset: 0x5b, bit: 5, label: "Bowser" }, // prettier-ignore
                                    { offset: 0x5b, bit: 6, label: "Link" }, // prettier-ignore
                                    { offset: 0x5b, bit: 7, label: "Luigi" }, // prettier-ignore
                                    { offset: 0x5a, bit: 0, label: "Mario" }, // prettier-ignore
                                    { offset: 0x5a, bit: 1, label: "Marth" }, // prettier-ignore
                                    { offset: 0x5a, bit: 2, label: "Mewtwo" }, // prettier-ignore
                                    { offset: 0x5a, bit: 3, label: "Ness" }, // prettier-ignore
                                    { offset: 0x5a, bit: 4, label: "Peach" }, // prettier-ignore
                                    { offset: 0x5a, bit: 5, label: "Pikachu" }, // prettier-ignore
                                    { offset: 0x5a, bit: 6, label: "Ice Climbers" }, // prettier-ignore
                                    { offset: 0x5a, bit: 7, label: "Jigglypuff" }, // prettier-ignore
                                    { offset: 0x59, bit: 0, label: "Samus" }, // prettier-ignore
                                    { offset: 0x59, bit: 1, label: "Yoshi" }, // prettier-ignore
                                    { offset: 0x59, bit: 2, label: "Zelda" }, // prettier-ignore
                                    { offset: 0x59, bit: 3, label: "Falco" }, // prettier-ignore
                                    { offset: 0x59, bit: 4, label: "Young Link" }, // prettier-ignore
                                    { offset: 0x59, bit: 5, label: "Dr. Mario" }, // prettier-ignore
                                    { offset: 0x59, bit: 6, label: "Roy" }, // prettier-ignore
                                    { offset: 0x59, bit: 7, label: "Pichu" }, // prettier-ignore
                                    { offset: 0x58, bit: 0, label: "Ganondorf" }, // prettier-ignore
                                    { offset: 0x58, bit: 1, label: "???" }, // prettier-ignore
                                    { offset: 0x58, bit: 2, label: "???" }, // prettier-ignore
                                    { offset: 0x58, bit: 3, label: "???" }, // prettier-ignore
                                    { offset: 0x58, bit: 4, label: "???" }, // prettier-ignore
                                    { offset: 0x58, bit: 5, label: "???" }, // prettier-ignore
                                    { offset: 0x58, bit: 6, label: "???" }, // prettier-ignore
                                    { offset: 0x58, bit: 7, label: "???" }, // prettier-ignore
                                  ],
                                },
                              ],
                            },
                          ],
                        },
                        {
                          name: "Home-Run Contest",
                          flex: true,
                          items: Object.values(characters).reduce(
                            (characters: ItemInt[], character, index) => {
                              characters[charactersSorted[index] * 2] = {
                                name: character,
                                offset: 0x768 + index * 0xac,
                                type: "variable",
                                dataType: "uint32",
                                bigEndian: true,
                                operations: [{ "/": 100 }],
                              };

                              characters[charactersSorted[index] * 2 + 1] = {
                                name: character,
                                offset: 0x100 + index * 0x4,
                                type: "variable",
                                dataType: "uint32",
                                bigEndian: true,
                                operations: [{ "/": 100 }],
                                hidden: true,
                              };

                              return characters;
                            },
                            [],
                          ),
                        },
                        {
                          name: "Multi-Man Melee",
                          items: [
                            {
                              length: 0xac,
                              type: "container",
                              instanceType: "tabs",
                              instances: 25,
                              resource: "characters",
                              resourceOrder: true,
                              vertical: true,
                              items: [
                                {
                                  name: "10-Man Melee",
                                  type: "section",
                                  flex: true,
                                  items: [
                                    {
                                      name: "Progression",
                                      offset: 0x760,
                                      type: "variable",
                                      dataType: "bit",
                                      bit: 6,
                                      resource: "progressions",
                                    },
                                    {
                                      name: "Highscore",
                                      offset: 0x77c,
                                      type: "variable",
                                      dataType: "uint32",
                                      bigEndian: true,
                                      max: 9,
                                    },
                                    {
                                      name: "Highscore",
                                      type: "group",
                                      mode: "chrono",
                                      items: [
                                        {
                                          offset: 0x77c,
                                          type: "variable",
                                          dataType: "uint32",
                                          bigEndian: true,
                                          operations: [
                                            { "/": 60 },
                                            {
                                              convert: {
                                                from: "seconds",
                                                to: "minutes",
                                              },
                                            },
                                          ],
                                          max: 59,
                                        },
                                        {
                                          offset: 0x77c,
                                          type: "variable",
                                          dataType: "uint32",
                                          bigEndian: true,
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
                                        {
                                          offset: 0x77c,
                                          type: "variable",
                                          dataType: "uint32",
                                          bigEndian: true,
                                          operations: [
                                            { "/": 60 },
                                            {
                                              convert: {
                                                from: "seconds",
                                                to: "milliseconds",
                                              },
                                            },
                                            { round: 0 },
                                          ],
                                          leadingZeros: 2,
                                          max: 999,
                                          step: 100,
                                        },
                                      ],
                                    },
                                  ],
                                },
                                {
                                  name: "100-Man Melee",
                                  type: "section",
                                  flex: true,
                                  items: [
                                    {
                                      name: "Progression",
                                      offset: 0x760,
                                      type: "variable",
                                      dataType: "bit",
                                      bit: 5,
                                      resource: "progressions",
                                    },
                                    {
                                      name: "Highscore",
                                      offset: 0x780,
                                      type: "variable",
                                      dataType: "uint32",
                                      bigEndian: true,
                                      max: 999,
                                    },
                                    {
                                      name: "Highscore",
                                      type: "group",
                                      mode: "chrono",
                                      items: [
                                        {
                                          offset: 0x780,
                                          type: "variable",
                                          dataType: "uint32",
                                          bigEndian: true,
                                          operations: [
                                            { "/": 60 },
                                            {
                                              convert: {
                                                from: "seconds",
                                                to: "minutes",
                                              },
                                            },
                                          ],
                                          max: 59,
                                        },
                                        {
                                          offset: 0x780,
                                          type: "variable",
                                          dataType: "uint32",
                                          bigEndian: true,
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
                                        {
                                          offset: 0x780,
                                          type: "variable",
                                          dataType: "uint32",
                                          bigEndian: true,
                                          operations: [
                                            { "/": 60 },
                                            {
                                              convert: {
                                                from: "seconds",
                                                to: "milliseconds",
                                              },
                                            },
                                            { round: 0 },
                                          ],
                                          leadingZeros: 2,
                                          max: 999,
                                          step: 100,
                                        },
                                      ],
                                    },
                                  ],
                                },
                                {
                                  name: "Time Melee",
                                  type: "section",
                                  flex: true,
                                  items: [
                                    {
                                      name: "3-Minute Melee",
                                      offset: 0x784,
                                      type: "variable",
                                      dataType: "uint16",
                                      bigEndian: true,
                                    },
                                    {
                                      name: "15-Minute Melee Cleared",
                                      offset: 0x760,
                                      type: "variable",
                                      dataType: "bit",
                                      bit: 4,
                                      hidden: true,
                                    },
                                    {
                                      name: "15-Minute Melee",
                                      offset: 0x786,
                                      type: "variable",
                                      dataType: "uint16",
                                      bigEndian: true,
                                    },
                                    {
                                      name: "Endless Melee",
                                      offset: 0x788,
                                      type: "variable",
                                      dataType: "uint32",
                                      bigEndian: true,
                                    },
                                    {
                                      name: "Cruel Melee",
                                      offset: 0x78c,
                                      type: "variable",
                                      dataType: "uint32",
                                      bigEndian: true,
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
                  name: "Training",
                  flex: true,
                  items: Object.values(characters).reduce(
                    (characters: ItemInt[], character, index) => {
                      characters[charactersSorted[index] * 2] = {
                        name: character,
                        offset: 0x762 + index * 0xac,
                        type: "variable",
                        dataType: "uint16",
                        bigEndian: true,
                      };

                      characters[charactersSorted[index] * 2 + 1] = {
                        name: character,
                        offset: 0x164 + index * 0x4,
                        type: "variable",
                        dataType: "uint32",
                        bigEndian: true,
                        hidden: true,
                      };

                      return characters;
                    },
                    [],
                  ),
                },
              ],
            },
          ],
        },
        {
          name: "VS. Mode",
          items: [
            {
              type: "tabs",
              items: [
                {
                  name: "Item Switch",
                  items: [
                    {
                      type: "section",
                      items: [
                        {
                          name: "Frequency",
                          offset: 0x468,
                          type: "variable",
                          dataType: "uint8",
                          resource: "frequencies",
                        },
                      ],
                    },
                    {
                      type: "section",
                      flex: true,
                      items: [
                        {
                          type: "bitflags",
                          flags: [
                            { offset: 0x477, bit: 5, label: "Food" }, // prettier-ignore
                            { offset: 0x475, bit: 2, label: "Maxim Tomato" }, // prettier-ignore
                            { offset: 0x476, bit: 2, label: "Heart Container" }, // prettier-ignore
                            { offset: 0x474, bit: 6, label: "Warp Star" }, // prettier-ignore
                            { offset: 0x476, bit: 5, label: "Ray Gun" }, // prettier-ignore
                            { offset: 0x474, bit: 0, label: "Super Scope" }, // prettier-ignore
                            { offset: 0x477, bit: 3, label: "Fire Flower" }, // prettier-ignore
                            { offset: 0x476, bit: 6, label: "Lip's Stick" }, // prettier-ignore
                            { offset: 0x475, bit: 7, label: "Star Rod" }, // prettier-ignore
                            { offset: 0x474, bit: 3, label: "Beam Sword" }, // prettier-ignore
                            { offset: 0x477, bit: 1, label: "Home-Run Bat" }, // prettier-ignore
                            { offset: 0x476, bit: 1, label: "Fan" }, // prettier-ignore
                            { offset: 0x476, bit: 0, label: "Hammer" }, // prettier-ignore
                            { offset: 0x477, bit: 7, label: "Green Shell" }, // prettier-ignore
                            { offset: 0x475, bit: 5, label: "Red Shell" }, // prettier-ignore
                            { offset: 0x477, bit: 4, label: "Flipper" }, // prettier-ignore
                          ],
                        },
                        {
                          type: "bitflags",
                          flags: [
                            { offset: 0x477, bit: 6, label: "Freezie" }, // prettier-ignore
                            { offset: 0x477, bit: 2, label: "Mr. Saturn" }, // prettier-ignore
                            { offset: 0x476, bit: 7, label: "Poké Ball" }, // prettier-ignore
                            { offset: 0x477, bit: 0, label: "Bob-omb" }, // prettier-ignore
                            { offset: 0x475, bit: 1, label: "Proximity Mine" }, // prettier-ignore
                            { offset: 0x476, bit: 3, label: "Super Mushroom" }, // prettier-ignore
                            { offset: 0x474, bit: 7, label: "Poison Mushroom" }, // prettier-ignore
                            { offset: 0x474, bit: 2, label: "Starman" }, // prettier-ignore
                            { offset: 0x475, bit: 4, label: "Parasol" }, // prettier-ignore
                            { offset: 0x474, bit: 1, label: "Screw Attack" }, // prettier-ignore
                            { offset: 0x475, bit: 0, label: "Metal Box" }, // prettier-ignore
                            { offset: 0x475, bit: 6, label: "Bunny Hood" }, // prettier-ignore
                            { offset: 0x475, bit: 3, label: "Cloaking Device" }, // prettier-ignore
                            { offset: 0x474, bit: 5, label: "Barrel Cannon" }, // prettier-ignore
                            { offset: 0x476, bit: 4, label: "Party Ball" }, // prettier-ignore
                            { offset: 0x474, bit: 4, label: "???", hidden: true }, // prettier-ignore
                          ],
                        },
                      ],
                    },
                  ],
                },
                {
                  name: "Random Stage",
                  flex: true,
                  items: [
                    {
                      type: "bitflags",
                      flags: [
                        { offset: 0x483, bit: 0, label: "Princess Peach's Castle" }, // prettier-ignore
                        { offset: 0x483, bit: 1, label: "Kongo Jungle" }, // prettier-ignore
                        { offset: 0x483, bit: 2, label: "Great Bay" }, // prettier-ignore
                        { offset: 0x483, bit: 3, label: "Brinstar" }, // prettier-ignore
                        { offset: 0x483, bit: 4, label: "Yoshi's Story" }, // prettier-ignore
                        { offset: 0x483, bit: 5, label: "Fountain of Dreams" }, // prettier-ignore
                        { offset: 0x483, bit: 6, label: "Corneria" }, // prettier-ignore
                        { offset: 0x483, bit: 7, label: "Pokémon Stadium" }, // prettier-ignore
                        { offset: 0x482, bit: 0, label: "Mute City" }, // prettier-ignore
                        { offset: 0x482, bit: 1, label: "Onett" }, // prettier-ignore
                        { offset: 0x482, bit: 3, label: "Mushroom Kingdom" }, // prettier-ignore
                        { offset: 0x482, bit: 2, label: "Icicle Mountain" }, // prettier-ignore
                        { offset: 0x480, bit: 0, label: "Battlefield" }, // prettier-ignore
                        { offset: 0x480, bit: 2, label: "Dream Land N64" }, // prettier-ignore
                        { offset: 0x480, bit: 4, label: "Kongo Jungle N64" }, // prettier-ignore
                      ],
                    },
                    {
                      type: "bitflags",
                      flags: [
                        { offset: 0x482, bit: 4, label: "Rainbow Ride" }, // prettier-ignore
                        { offset: 0x482, bit: 5, label: "Jungle Japes" }, // prettier-ignore
                        { offset: 0x482, bit: 6, label: "Temple" }, // prettier-ignore
                        { offset: 0x482, bit: 7, label: "Brinstar Depths" }, // prettier-ignore
                        { offset: 0x481, bit: 0, label: "Yoshi's Island" }, // prettier-ignore
                        { offset: 0x481, bit: 1, label: "Green Greens" }, // prettier-ignore
                        { offset: 0x481, bit: 2, label: "Venom" }, // prettier-ignore
                        { offset: 0x481, bit: 3, label: "Poké Floats" }, // prettier-ignore
                        { offset: 0x481, bit: 4, label: "Big Blue" }, // prettier-ignore
                        { offset: 0x481, bit: 5, label: "Fourside" }, // prettier-ignore
                        { offset: 0x481, bit: 6, label: "Mushroom Kingdom II" }, // prettier-ignore
                        { offset: 0x481, bit: 7, label: "Flat Zone" }, // prettier-ignore
                        { offset: 0x480, bit: 1, label: "Final Destination" }, // prettier-ignore
                        { offset: 0x480, bit: 3, label: "Yoshi's Island N64" }, // prettier-ignore
                        { offset: 0x480, bit: 5, label: "???", hidden: true }, // prettier-ignore
                        { offset: 0x480, bit: 6, label: "???", hidden: true }, // prettier-ignore
                        { offset: 0x480, bit: 7, label: "???", hidden: true }, // prettier-ignore
                      ],
                    },
                  ],
                },
              ],
            },
          ],
        },
        {
          name: "Trophies",
          items: [
            {
              type: "section",
              items: [
                {
                  name: "Count",
                  offset: 0x488,
                  type: "variable",
                  dataType: "uint16",
                  bigEndian: true,
                  disabled: true,
                },
              ],
            },
            {
              name: "Pools",
              type: "bitflags",
              hidden: true,
              flags: [
                { offset: 0x48b, bit: 0, label: "???", hidden: true }, // prettier-ignore
                { offset: 0x48b, bit: 1, label: "???", hidden: true }, // prettier-ignore
                { offset: 0x48b, bit: 2, label: "Pool 1" }, // prettier-ignore
                { offset: 0x48b, bit: 3, label: "???", hidden: true }, // prettier-ignore
                { offset: 0x48b, bit: 4, label: "Pool 2" }, // prettier-ignore
                { offset: 0x48b, bit: 5, label: "Pool 3" }, // prettier-ignore
                { offset: 0x48b, bit: 6, label: "Pool 4" }, // prettier-ignore
                { offset: 0x48b, bit: 7, label: "Pool 5" }, // prettier-ignore
              ],
            },
            {
              type: "section",
              flex: true,
              items: Object.values(trophies).reduce(
                (trophies: ItemInt[], trophy, index) => {
                  trophies.push(
                    {
                      id: `trophy-${index}`,
                      name: trophy,
                      offset: 0x48d + index * 0x2,
                      type: "variable",
                      dataType: "uint8",
                    },
                    {
                      name: trophy,
                      offset:
                        0x313 +
                        Math.floor(index / 0x20) * 0x8 -
                        Math.floor(index / 8),
                      type: "variable",
                      dataType: "bit",
                      bit: index % 8,
                      hidden: true,
                    },
                  );

                  return trophies;
                },
                [],
              ),
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
                  name: "P1 Rumble",
                  offset: 0x478,
                  type: "variable",
                  dataType: "uint8",
                  resource: "optionBoolean",
                },
                {
                  name: "P2 Rumble",
                  offset: 0x479,
                  type: "variable",
                  dataType: "uint8",
                  resource: "optionBoolean",
                },
                {
                  name: "P3 Rumble",
                  offset: 0x47a,
                  type: "variable",
                  dataType: "uint8",
                  resource: "optionBoolean",
                },
                {
                  name: "P4 Rumble",
                  offset: 0x47b,
                  type: "variable",
                  dataType: "uint8",
                  resource: "optionBoolean",
                },
              ],
            },
            {
              type: "section",
              flex: true,
              items: [
                {
                  name: "Sounds <> Music",
                  offset: 0x47c,
                  type: "variable",
                  dataType: "int8",
                  hidden: true,
                },
                {
                  id: "sounds",
                  name: "Sounds",
                  offset: 0x47c,
                  type: "variable",
                  dataType: "uint8",
                  max: 200,
                },
                {
                  id: "music",
                  name: "Music",
                  offset: 0x47c,
                  type: "variable",
                  dataType: "uint8",
                  max: 200,
                },
              ],
            },
            {
              type: "section",
              flex: true,
              items: [
                {
                  name: "Screen Deflicker",
                  offset: 0x47d,
                  type: "variable",
                  dataType: "uint8",
                  resource: "optionBoolean",
                },
              ],
            },
            {
              type: "section",
              flex: true,
              items: [
                {
                  name: "Language",
                  offset: 0x47e,
                  type: "variable",
                  dataType: "uint8",
                  resource: "languages",
                },
              ],
            },
          ],
        },
        {
          name: "Data",
          items: [
            {
              type: "tabs",
              items: [
                {
                  name: "VS. Records",
                  flex: true,
                  items: [
                    {
                      length: 0xac,
                      type: "container",
                      instanceType: "tabs",
                      instances: 25,
                      resource: "characters",
                      resourceOrder: true,
                      vertical: true,
                      flex: true,
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
                                      name: "Self-Destructs",
                                      offset: 0x718,
                                      type: "variable",
                                      dataType: "uint16",
                                      bigEndian: true,
                                    },
                                  ],
                                },
                                {
                                  type: "section",
                                  flex: true,
                                  items: [
                                    {
                                      name: "Successful Hits",
                                      offset: 0x71c,
                                      type: "variable",
                                      dataType: "uint32",
                                      bigEndian: true,
                                    },
                                    {
                                      name: "Hits",
                                      offset: 0x720,
                                      type: "variable",
                                      dataType: "uint32",
                                      bigEndian: true,
                                    },
                                    {
                                      id: "hitPercentage",
                                      name: "Hit Percentage",
                                      offset: 0x71c,
                                      type: "variable",
                                      dataType: "uint32",
                                      bigEndian: true,
                                      suffix: "%",
                                      disabled: true,
                                    },
                                  ],
                                },
                                {
                                  type: "section",
                                  flex: true,
                                  items: [
                                    {
                                      name: "Damage Given",
                                      offset: 0x724,
                                      type: "variable",
                                      dataType: "uint32",
                                      bigEndian: true,
                                      suffix: "%",
                                    },
                                    {
                                      name: "Damage Taken",
                                      offset: 0x728,
                                      type: "variable",
                                      dataType: "uint32",
                                      bigEndian: true,
                                      suffix: "%",
                                    },
                                    {
                                      name: "Damage Recovered",
                                      offset: 0x72c,
                                      type: "variable",
                                      dataType: "uint32",
                                      bigEndian: true,
                                      suffix: "%",
                                    },
                                    {
                                      name: "Peak Damage",
                                      offset: 0x730,
                                      type: "variable",
                                      dataType: "uint16",
                                      bigEndian: true,
                                      suffix: "%",
                                    },
                                  ],
                                },
                                {
                                  type: "section",
                                  flex: true,
                                  items: [
                                    {
                                      name: "Matches",
                                      offset: 0x732,
                                      type: "variable",
                                      dataType: "uint16",
                                      bigEndian: true,
                                    },
                                    {
                                      name: "Victories",
                                      offset: 0x734,
                                      type: "variable",
                                      dataType: "uint16",
                                      bigEndian: true,
                                    },
                                    {
                                      name: "Losses",
                                      offset: 0x736,
                                      type: "variable",
                                      dataType: "uint16",
                                      bigEndian: true,
                                    },
                                    {
                                      name: "Play Count",
                                      offset: 0x68,
                                      type: "variable",
                                      dataType: "uint16",
                                      bigEndian: true,
                                      overrideShift: {
                                        parent: 1,
                                        shift: 0x2,
                                      },
                                    },
                                  ],
                                },
                                {
                                  type: "section",
                                  flex: true,
                                  items: [
                                    {
                                      name: "VS. Play Time",
                                      type: "group",
                                      mode: "time",
                                      items: [
                                        {
                                          offset: 0x738,
                                          type: "variable",
                                          dataType: "uint32",
                                          bigEndian: true,
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
                                          offset: 0x738,
                                          type: "variable",
                                          dataType: "uint32",
                                          bigEndian: true,
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
                                          offset: 0x738,
                                          type: "variable",
                                          dataType: "uint32",
                                          bigEndian: true,
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
                                      name: "Average Players Related",
                                      offset: 0x73c,
                                      type: "variable",
                                      dataType: "uint32",
                                      bigEndian: true,
                                      hidden: true,
                                    },
                                    {
                                      type: "section",
                                      flex: true,
                                      items: [
                                        {
                                          name: "Ground Distance",
                                          offset: 0x740,
                                          type: "variable",
                                          dataType: "uint32",
                                          bigEndian: true,
                                          operations: [{ "/": 100000 }],
                                        },
                                        {
                                          name: "Jump Distance",
                                          offset: 0x744,
                                          type: "variable",
                                          dataType: "uint32",
                                          bigEndian: true,
                                          operations: [{ "/": 100000 }],
                                        },
                                        {
                                          name: "Drop Distance",
                                          offset: 0x748,
                                          type: "variable",
                                          dataType: "uint32",
                                          bigEndian: true,
                                          operations: [{ "/": 100000 }],
                                        },
                                        {
                                          name: "Flight Distance",
                                          offset: 0x74c,
                                          type: "variable",
                                          dataType: "uint32",
                                          bigEndian: true,
                                          operations: [{ "/": 100000 }],
                                        },
                                      ],
                                    },
                                    {
                                      type: "section",
                                      flex: true,
                                      items: [
                                        {
                                          name: "Coin Points",
                                          offset: 0x750,
                                          type: "variable",
                                          dataType: "uint32",
                                          bigEndian: true,
                                        },
                                        {
                                          name: "Swiped Coins",
                                          offset: 0x754,
                                          type: "variable",
                                          dataType: "uint32",
                                          bigEndian: true,
                                        },
                                        {
                                          name: "Lost Coin",
                                          offset: 0x758,
                                          type: "variable",
                                          dataType: "uint32",
                                          bigEndian: true,
                                        },
                                      ],
                                    },
                                  ],
                                },
                              ],
                            },
                            {
                              name: "KOs",
                              flex: true,
                              items: Object.values(characters).reduce(
                                (characters: ItemInt[], character, index) => {
                                  characters[charactersSorted[index]] = {
                                    name: character,
                                    offset: 0x6e4 + index * 0x2,
                                    type: "variable",
                                    dataType: "uint16",
                                    bigEndian: true,
                                  };

                                  return characters;
                                },
                                [],
                              ),
                            },
                          ],
                        },
                      ],
                    },
                  ],
                },
                {
                  name: "Bonus Records",
                  flex: true,
                  items: [
                    {
                      type: "bitflags",
                      flags: [
                        { offset: 0x443, bit: 0, label: "Bird of Prey" }, // prettier-ignore
                        { offset: 0x443, bit: 1, label: "Combo King" }, // prettier-ignore
                        { offset: 0x443, bit: 2, label: "Juggler" }, // prettier-ignore
                        { offset: 0x443, bit: 3, label: "Backstabber" }, // prettier-ignore
                        { offset: 0x443, bit: 4, label: "Sweeper" }, // prettier-ignore
                        { offset: 0x443, bit: 5, label: "Clean Sweep" }, // prettier-ignore
                        { offset: 0x443, bit: 6, label: "Meteor Smash" }, // prettier-ignore
                        { offset: 0x443, bit: 7, label: "Meteor Clear" }, // prettier-ignore
                        { offset: 0x442, bit: 0, label: "Meteor Master" }, // prettier-ignore
                        { offset: 0x442, bit: 1, label: "Crash & Burn" }, // prettier-ignore
                        { offset: 0x442, bit: 2, label: "Meteor Survivor" }, // prettier-ignore
                        { offset: 0x442, bit: 3, label: "Flying Meteor" }, // prettier-ignore
                        { offset: 0x442, bit: 4, label: "Exceptional Aim" }, // prettier-ignore
                        { offset: 0x442, bit: 5, label: "Perfect Aim" }, // prettier-ignore
                        { offset: 0x442, bit: 6, label: "All Ground" }, // prettier-ignore
                        { offset: 0x442, bit: 7, label: "All Aerial" }, // prettier-ignore
                        { offset: 0x441, bit: 0, label: "All Variations" }, // prettier-ignore
                        { offset: 0x441, bit: 1, label: "All on One" }, // prettier-ignore
                        { offset: 0x441, bit: 2, label: "Lethal Weapon" }, // prettier-ignore
                        { offset: 0x441, bit: 3, label: "Berseker" }, // prettier-ignore
                      ],
                    },
                    {
                      type: "bitflags",
                      flags: [
                        { offset: 0x441, bit: 4, label: "Smash King" }, // prettier-ignore
                        { offset: 0x441, bit: 5, label: "Smash Maniac" }, // prettier-ignore
                        { offset: 0x441, bit: 6, label: "Smash-less" }, // prettier-ignore
                        { offset: 0x441, bit: 7, label: "Specialist" }, // prettier-ignore
                        { offset: 0x440, bit: 0, label: "Dedicated Specialist" }, // prettier-ignore
                        { offset: 0x440, bit: 1, label: "One-Two Punch" }, // prettier-ignore
                        { offset: 0x440, bit: 2, label: "First Strike" }, // prettier-ignore
                        { offset: 0x440, bit: 3, label: "150% Damage" }, // prettier-ignore
                        { offset: 0x440, bit: 4, label: "200% Damage" }, // prettier-ignore
                        { offset: 0x440, bit: 5, label: "250% Damage" }, // prettier-ignore
                        { offset: 0x440, bit: 6, label: "300% Damage" }, // prettier-ignore
                        { offset: 0x440, bit: 7, label: "350% Damage" }, // prettier-ignore
                        { offset: 0x447, bit: 0, label: "Heavy Damage" }, // prettier-ignore
                        { offset: 0x447, bit: 1, label: "Sniper" }, // prettier-ignore
                        { offset: 0x447, bit: 2, label: "Brawler" }, // prettier-ignore
                        { offset: 0x447, bit: 3, label: "Precise Aim" }, // prettier-ignore
                        { offset: 0x447, bit: 4, label: "Pitcher" }, // prettier-ignore
                        { offset: 0x447, bit: 5, label: "Butterfingers" }, // prettier-ignore
                        { offset: 0x447, bit: 6, label: "All Thumbs" }, // prettier-ignore
                        { offset: 0x447, bit: 7, label: "Cuddly Bear" }, // prettier-ignore
                      ],
                    },
                    {
                      type: "bitflags",
                      flags: [
                        { offset: 0x446, bit: 0, label: "Compass Tosser" }, // prettier-ignore
                        { offset: 0x446, bit: 1, label: "Pool Shark" }, // prettier-ignore
                        { offset: 0x446, bit: 2, label: "Throw Down" }, // prettier-ignore
                        { offset: 0x446, bit: 3, label: "Pummeler" }, // prettier-ignore
                        { offset: 0x446, bit: 4, label: "Fists of Fury" }, // prettier-ignore
                        { offset: 0x446, bit: 5, label: "Close Call" }, // prettier-ignore
                        { offset: 0x446, bit: 6, label: "Opportunist" }, // prettier-ignore
                        { offset: 0x446, bit: 7, label: "Spectator" }, // prettier-ignore
                        { offset: 0x445, bit: 0, label: "Statue" }, // prettier-ignore
                        { offset: 0x445, bit: 1, label: "Never Look Back" }, // prettier-ignore
                        { offset: 0x445, bit: 2, label: "Stiff Knees" }, // prettier-ignore
                        { offset: 0x445, bit: 3, label: "Run, Don't Walk" }, // prettier-ignore
                        { offset: 0x445, bit: 4, label: "Ambler" }, // prettier-ignore
                        { offset: 0x445, bit: 5, label: "No Hurry" }, // prettier-ignore
                        { offset: 0x445, bit: 6, label: "Marathon Man" }, // prettier-ignore
                        { offset: 0x445, bit: 7, label: "Eagle" }, // prettier-ignore
                        { offset: 0x444, bit: 0, label: "Aerialist" }, // prettier-ignore
                        { offset: 0x444, bit: 1, label: "Acrobat" }, // prettier-ignore
                        { offset: 0x444, bit: 2, label: "Cement Shoes" }, // prettier-ignore
                        { offset: 0x444, bit: 3, label: "Head Banger" }, // prettier-ignore
                      ],
                    },
                    {
                      type: "bitflags",
                      flags: [
                        { offset: 0x444, bit: 4, label: "Elbow Room" }, // prettier-ignore
                        { offset: 0x444, bit: 5, label: "Power Shielder" }, // prettier-ignore
                        { offset: 0x444, bit: 6, label: "Shield Buster" }, // prettier-ignore
                        { offset: 0x444, bit: 7, label: "Shattered Shield" }, // prettier-ignore
                        { offset: 0x44b, bit: 0, label: "Shield Stupidity" }, // prettier-ignore
                        { offset: 0x44b, bit: 1, label: "Shield Saver" }, // prettier-ignore
                        { offset: 0x44b, bit: 2, label: "Deflector" }, // prettier-ignore
                        { offset: 0x44b, bit: 3, label: "Ricochet Rifler" }, // prettier-ignore
                        { offset: 0x44b, bit: 4, label: "Skid Master" }, // prettier-ignore
                        { offset: 0x44b, bit: 5, label: "Rock Climber" }, // prettier-ignore
                        { offset: 0x44b, bit: 6, label: "Edge Hog" }, // prettier-ignore
                        { offset: 0x44b, bit: 7, label: "Cliffhanger" }, // prettier-ignore
                        { offset: 0x44a, bit: 0, label: "Life on the Edge" }, // prettier-ignore
                        { offset: 0x44a, bit: 1, label: "Poser" }, // prettier-ignore
                        { offset: 0x44a, bit: 2, label: "Poser Poseur" }, // prettier-ignore
                        { offset: 0x44a, bit: 3, label: "Poser Power" }, // prettier-ignore
                        { offset: 0x44a, bit: 4, label: "Pose Breaker" }, // prettier-ignore
                        { offset: 0x44a, bit: 5, label: "Instant Poser" }, // prettier-ignore
                        { offset: 0x45c, bit: 1, label: "Control Freak" }, // prettier-ignore
                        { offset: 0x44a, bit: 6, label: "Button Masher" }, // prettier-ignore
                      ],
                    },
                    {
                      type: "bitflags",
                      flags: [
                        { offset: 0x44a, bit: 7, label: "Button Holder" }, // prettier-ignore
                        { offset: 0x449, bit: 0, label: "Rock Steady" }, // prettier-ignore
                        { offset: 0x449, bit: 1, label: "Pratfaller" }, // prettier-ignore
                        { offset: 0x449, bit: 2, label: "Face Planter" }, // prettier-ignore
                        { offset: 0x449, bit: 3, label: "Twinkle Toes" }, // prettier-ignore
                        { offset: 0x449, bit: 4, label: "Floor Diver" }, // prettier-ignore
                        { offset: 0x449, bit: 5, label: "No R 4 U" }, // prettier-ignore
                        { offset: 0x449, bit: 6, label: "Climactic Clash" }, // prettier-ignore
                        { offset: 0x449, bit: 7, label: "Floored" }, // prettier-ignore
                        { offset: 0x448, bit: 0, label: "Punching Bag" }, // prettier-ignore
                        { offset: 0x448, bit: 1, label: "Stale Moves" }, // prettier-ignore
                        { offset: 0x448, bit: 2, label: "Blind Eye" }, // prettier-ignore
                        { offset: 0x448, bit: 3, label: "Crowd Favorite" }, // prettier-ignore
                        { offset: 0x448, bit: 4, label: "Master of Suspense" }, // prettier-ignore
                        { offset: 0x448, bit: 5, label: "Lost in Space" }, // prettier-ignore
                        { offset: 0x448, bit: 6, label: "Lost Luggage" }, // prettier-ignore
                        { offset: 0x448, bit: 7, label: "Half-Minute Man" }, // prettier-ignore
                        { offset: 0x44f, bit: 0, label: "Pacifist" }, // prettier-ignore
                        { offset: 0x45c, bit: 2, label: "Peaceful Warrior" }, // prettier-ignore
                        { offset: 0x44f, bit: 1, label: "Moment of Silence" }, // prettier-ignore
                      ],
                    },
                    {
                      type: "bitflags",
                      flags: [
                        { offset: 0x44f, bit: 2, label: "Impervious" }, // prettier-ignore
                        { offset: 0x44f, bit: 3, label: "Immortal" }, // prettier-ignore
                        { offset: 0x44f, bit: 4, label: "Switzerland" }, // prettier-ignore
                        { offset: 0x44f, bit: 5, label: "Predator" }, // prettier-ignore
                        { offset: 0x45c, bit: 3, label: "Down, But Not Out" }, // prettier-ignore
                        { offset: 0x44f, bit: 6, label: "Solar Being" }, // prettier-ignore
                        { offset: 0x44f, bit: 7, label: "Stalker" }, // prettier-ignore
                        { offset: 0x44e, bit: 0, label: "Bully" }, // prettier-ignore
                        { offset: 0x44e, bit: 1, label: "Coward" }, // prettier-ignore
                        { offset: 0x44e, bit: 2, label: "In the Fray" }, // prettier-ignore
                        { offset: 0x44e, bit: 3, label: "Friendly Foe" }, // prettier-ignore
                        { offset: 0x44e, bit: 4, label: "Center Stage" }, // prettier-ignore
                        { offset: 0x45c, bit: 4, label: "Merciful Master" }, // prettier-ignore
                        { offset: 0x44e, bit: 5, label: "Star KO" }, // prettier-ignore
                        { offset: 0x45c, bit: 5, label: "Rocket KO" }, // prettier-ignore
                        { offset: 0x44e, bit: 6, label: "Wimpy KO" }, // prettier-ignore
                        { offset: 0x44e, bit: 7, label: "Bull's-eye KO" }, // prettier-ignore
                        { offset: 0x44d, bit: 0, label: "Poser KO" }, // prettier-ignore
                        { offset: 0x44d, bit: 1, label: "Cheap KO" }, // prettier-ignore
                        { offset: 0x44d, bit: 2, label: "Bank-Shot KO" }, // prettier-ignore
                      ],
                    },
                    {
                      type: "bitflags",
                      flags: [
                        { offset: 0x44d, bit: 3, label: "Timely KO" }, // prettier-ignore
                        { offset: 0x44d, bit: 4, label: "Special KO" }, // prettier-ignore
                        { offset: 0x44d, bit: 5, label: "Hangman's KO" }, // prettier-ignore
                        { offset: 0x44d, bit: 6, label: "KO 64" }, // prettier-ignore
                        { offset: 0x44d, bit: 7, label: "Bubble-Blast KO" }, // prettier-ignore
                        { offset: 0x44c, bit: 0, label: "Sacrificial KO" }, // prettier-ignore
                        { offset: 0x44c, bit: 1, label: "Avenger KO" }, // prettier-ignore
                        { offset: 0x44c, bit: 2, label: "Double KO" }, // prettier-ignore
                        { offset: 0x44c, bit: 3, label: "Triple KO" }, // prettier-ignore
                        { offset: 0x44c, bit: 4, label: "Quadruple KO" }, // prettier-ignore
                        { offset: 0x44c, bit: 5, label: "Quintuple KO" }, // prettier-ignore
                        { offset: 0x44c, bit: 6, label: "Dead-Weight KO" }, // prettier-ignore
                        { offset: 0x44c, bit: 7, label: "Kiss-the-Floor KO" }, // prettier-ignore
                        { offset: 0x453, bit: 0, label: "Assisted KO" }, // prettier-ignore
                        { offset: 0x453, bit: 1, label: "Foresight" }, // prettier-ignore
                        { offset: 0x453, bit: 2, label: "First to Fall" }, // prettier-ignore
                        { offset: 0x453, bit: 3, label: "Cliff Diver" }, // prettier-ignore
                        { offset: 0x453, bit: 4, label: "Quitter" }, // prettier-ignore
                        { offset: 0x453, bit: 5, label: "Shameful Fall" }, // prettier-ignore
                        { offset: 0x453, bit: 6, label: "World Traveler" }, // prettier-ignore
                      ],
                    },
                    {
                      type: "bitflags",
                      flags: [
                        { offset: 0x453, bit: 7, label: "Ground Pounded" }, // prettier-ignore
                        { offset: 0x452, bit: 0, label: "Environmental Hazard" }, // prettier-ignore
                        { offset: 0x452, bit: 1, label: "Angelic" }, // prettier-ignore
                        { offset: 0x452, bit: 2, label: "Magnified Finish" }, // prettier-ignore
                        { offset: 0x452, bit: 3, label: "Fighter Stance" }, // prettier-ignore
                        { offset: 0x452, bit: 4, label: "Mystic" }, // prettier-ignore
                        { offset: 0x452, bit: 5, label: "Shooting Star" }, // prettier-ignore
                        { offset: 0x452, bit: 6, label: "Lucky Number Seven" }, // prettier-ignore
                        { offset: 0x452, bit: 7, label: "Last Second" }, // prettier-ignore
                        { offset: 0x451, bit: 0, label: "Lucky Threes" }, // prettier-ignore
                        { offset: 0x451, bit: 1, label: "Jackpot" }, // prettier-ignore
                        { offset: 0x451, bit: 2, label: "Full Power" }, // prettier-ignore
                        { offset: 0x451, bit: 3, label: "Item-less" }, // prettier-ignore
                        { offset: 0x451, bit: 4, label: "Item Specialist" }, // prettier-ignore
                        { offset: 0x451, bit: 5, label: "Item Chucker" }, // prettier-ignore
                        { offset: 0x451, bit: 6, label: "Item Smasher" }, // prettier-ignore
                        { offset: 0x451, bit: 7, label: "Capsule KO" }, // prettier-ignore
                        { offset: 0x450, bit: 0, label: "Carrier KO" }, // prettier-ignore
                        { offset: 0x450, bit: 1, label: "Weight Lifter" }, // prettier-ignore
                        { offset: 0x450, bit: 2, label: "Item Catcher" }, // prettier-ignore
                      ],
                    },
                    {
                      type: "bitflags",
                      flags: [
                        { offset: 0x450, bit: 3, label: "Reciprocator" }, // prettier-ignore
                        { offset: 0x450, bit: 4, label: "Item Self-Destruct" }, // prettier-ignore
                        { offset: 0x450, bit: 5, label: "Triple Items" }, // prettier-ignore
                        { offset: 0x45c, bit: 6, label: "Minimalist" }, // prettier-ignore
                        { offset: 0x45c, bit: 7, label: "Materialist" }, // prettier-ignore
                        { offset: 0x450, bit: 6, label: "Item Hog" }, // prettier-ignore
                        { offset: 0x450, bit: 7, label: "Item Collector" }, // prettier-ignore
                        { offset: 0x457, bit: 0, label: "Connoisseur" }, // prettier-ignore
                        { offset: 0x457, bit: 1, label: "Gourmet" }, // prettier-ignore
                        { offset: 0x457, bit: 2, label: "Battering Ram" }, // prettier-ignore
                        { offset: 0x457, bit: 3, label: "Straight Shooter" }, // prettier-ignore
                        { offset: 0x457, bit: 4, label: "Wimp" }, // prettier-ignore
                        { offset: 0x457, bit: 5, label: "Shape-Shifter" }, // prettier-ignore
                        { offset: 0x457, bit: 6, label: "Chuck Wagon" }, // prettier-ignore
                        { offset: 0x457, bit: 7, label: "Parasol Finish" }, // prettier-ignore
                        { offset: 0x456, bit: 0, label: "Gardener Finish" }, // prettier-ignore
                        { offset: 0x456, bit: 1, label: "Flower Finish" }, // prettier-ignore
                        { offset: 0x456, bit: 2, label: "Super Scoper" }, // prettier-ignore
                        { offset: 0x456, bit: 3, label: "Screwed Up" }, // prettier-ignore
                        { offset: 0x456, bit: 4, label: "Screw-Attack KO" }, // prettier-ignore
                      ],
                    },
                    {
                      type: "bitflags",
                      flags: [
                        { offset: 0x456, bit: 5, label: "Warp-Star KO" }, // prettier-ignore
                        { offset: 0x456, bit: 6, label: "Mycologist" }, // prettier-ignore
                        { offset: 0x456, bit: 7, label: "Mario Maniac" }, // prettier-ignore
                        { offset: 0x455, bit: 0, label: "Metal KO" }, // prettier-ignore
                        { offset: 0x455, bit: 1, label: "Freezie KO" }, // prettier-ignore
                        { offset: 0x455, bit: 2, label: "Flipper KO" }, // prettier-ignore
                        { offset: 0x455, bit: 3, label: "Mr. Saturn Fan" }, // prettier-ignore
                        { offset: 0x455, bit: 4, label: "Mrs. Saturn" }, // prettier-ignore
                        { offset: 0x455, bit: 5, label: "Saturn Siblings" }, // prettier-ignore
                        { offset: 0x455, bit: 6, label: "Saturn Ringer" }, // prettier-ignore
                        { offset: 0x455, bit: 7, label: "Giant KO" }, // prettier-ignore
                        { offset: 0x454, bit: 0, label: "Tiny KO" }, // prettier-ignore
                        { offset: 0x454, bit: 1, label: "Barrel Blast KO" }, // prettier-ignore
                        { offset: 0x454, bit: 2, label: "Invisible KO" }, // prettier-ignore
                        { offset: 0x454, bit: 3, label: "Bunny-Hood Blast" }, // prettier-ignore
                        { offset: 0x454, bit: 4, label: "Vegetarian" }, // prettier-ignore
                        { offset: 0x454, bit: 5, label: "Heartthrob" }, // prettier-ignore
                        { offset: 0x454, bit: 6, label: "Invincible Finish" }, // prettier-ignore
                        { offset: 0x454, bit: 7, label: "Invincible KO" }, // prettier-ignore
                        { offset: 0x45b, bit: 0, label: "Beam Swordsman" }, // prettier-ignore
                      ],
                    },
                    {
                      type: "bitflags",
                      flags: [
                        { offset: 0x45b, bit: 1, label: "Home-Run King" }, // prettier-ignore
                        { offset: 0x45b, bit: 2, label: "Laser Marksman" }, // prettier-ignore
                        { offset: 0x45b, bit: 3, label: "Flame Thrower" }, // prettier-ignore
                        { offset: 0x45b, bit: 4, label: "Hammer Throw" }, // prettier-ignore
                        { offset: 0x45b, bit: 5, label: "Headless Hammer" }, // prettier-ignore
                        { offset: 0x45b, bit: 6, label: "Super Spy" }, // prettier-ignore
                        { offset: 0x45b, bit: 7, label: "Bob-omb's Away" }, // prettier-ignore
                        { offset: 0x45a, bit: 0, label: "Bob-omb Squad" }, // prettier-ignore
                        { offset: 0x45a, bit: 1, label: "Red Shell Shooter" }, // prettier-ignore
                        { offset: 0x45a, bit: 2, label: "Green Shell Shooter" }, // prettier-ignore
                        { offset: 0x45a, bit: 3, label: "Pokémon KO" }, // prettier-ignore
                        { offset: 0x45a, bit: 4, label: "Mew Catcher" }, // prettier-ignore
                        { offset: 0x45a, bit: 5, label: "Celebi Catcher" }, // prettier-ignore
                        { offset: 0x45a, bit: 6, label: "Goomba KO" }, // prettier-ignore
                        { offset: 0x45a, bit: 7, label: "Koopa KO" }, // prettier-ignore
                        { offset: 0x459, bit: 0, label: "Paratroopa KO" }, // prettier-ignore
                        { offset: 0x459, bit: 1, label: "ReDead KO" }, // prettier-ignore
                        { offset: 0x459, bit: 2, label: "Like Like KO" }, // prettier-ignore
                        { offset: 0x459, bit: 3, label: "Octorok KO" }, // prettier-ignore
                        { offset: 0x459, bit: 4, label: "Topi KO" }, // prettier-ignore
                      ],
                    },
                    {
                      type: "bitflags",
                      flags: [
                        { offset: 0x459, bit: 5, label: "Polar Bear KO" }, // prettier-ignore
                        { offset: 0x459, bit: 6, label: "Shy Guy KO" }, // prettier-ignore
                        { offset: 0x459, bit: 7, label: "First Place" }, // prettier-ignore
                        { offset: 0x458, bit: 0, label: "Last Place" }, // prettier-ignore
                        { offset: 0x458, bit: 1, label: "Wire to Wire" }, // prettier-ignore
                        { offset: 0x458, bit: 2, label: "Whipping Boy" }, // prettier-ignore
                        { offset: 0x458, bit: 3, label: "KO Artist" }, // prettier-ignore
                        { offset: 0x458, bit: 4, label: "KO Master" }, // prettier-ignore
                        { offset: 0x458, bit: 5, label: "Offensive Artist" }, // prettier-ignore
                        { offset: 0x458, bit: 6, label: "Offensive Master" }, // prettier-ignore
                        { offset: 0x458, bit: 7, label: "Frequent Faller" }, // prettier-ignore
                        { offset: 0x45f, bit: 0, label: "Fall Guy" }, // prettier-ignore
                        { offset: 0x45f, bit: 1, label: "Self-Destructor" }, // prettier-ignore
                        { offset: 0x45f, bit: 2, label: "Master of Disaster" }, // prettier-ignore
                        { offset: 0x45f, bit: 3, label: "KOs" }, // prettier-ignore
                        { offset: 0x45f, bit: 4, label: "Falls" }, // prettier-ignore
                        { offset: 0x45f, bit: 5, label: "SDs" }, // prettier-ignore
                        { offset: 0x45d, bit: 6, label: "Target Master" }, // prettier-ignore
                        { offset: 0x45d, bit: 7, label: "Hobbyist" }, // prettier-ignore
                        { offset: 0x45c, bit: 0, label: "Collector" }, // prettier-ignore
                      ],
                    },
                    {
                      type: "bitflags",
                      flags: [
                        { offset: 0x45f, bit: 6, label: "No-Damage Clear" }, // prettier-ignore
                        { offset: 0x45f, bit: 7, label: "No-Miss Clear" }, // prettier-ignore
                        { offset: 0x45e, bit: 0, label: "Continuation" }, // prettier-ignore
                        { offset: 0x45e, bit: 1, label: "Speedster" }, // prettier-ignore
                        { offset: 0x45e, bit: 2, label: "Speed Demon" }, // prettier-ignore
                        { offset: 0x45e, bit: 3, label: "Melee Master" }, // prettier-ignore
                        { offset: 0x45e, bit: 4, label: "Classic Clear" }, // prettier-ignore
                        { offset: 0x45e, bit: 5, label: "Adventure Clear" }, // prettier-ignore
                        { offset: 0x45e, bit: 6, label: "All-Star Clear" }, // prettier-ignore
                        { offset: 0x45e, bit: 7, label: "Very-Hard Clear" }, // prettier-ignore
                        { offset: 0x45d, bit: 0, label: "Crazy Hand KO" }, // prettier-ignore
                        { offset: 0x45d, bit: 1, label: "Luigi KO" }, // prettier-ignore
                        { offset: 0x45d, bit: 2, label: "Link Master" }, // prettier-ignore
                        { offset: 0x45d, bit: 3, label: "Giant Kirby KO" }, // prettier-ignore
                        { offset: 0x45d, bit: 4, label: "Metal Bros. KO" }, // prettier-ignore
                        { offset: 0x45d, bit: 5, label: "Giga Bowser KO" }, // prettier-ignore
                      ],
                    },
                  ],
                },
                {
                  name: "Misc. Records",
                  items: [
                    {
                      type: "section",
                      flex: true,
                      items: [
                        {
                          name: "Power Count",
                          offset: 0x208,
                          type: "variable",
                          dataType: "uint32",
                          bigEndian: true,
                        },
                        {
                          name: "Power Time",
                          type: "group",
                          mode: "time",
                          items: [
                            {
                              offset: 0x20c,
                              type: "variable",
                              dataType: "uint32",
                              bigEndian: true,
                              operations: [
                                { convert: { from: "seconds", to: "hours" } },
                              ],
                              max: 999,
                            },
                            {
                              offset: 0x20c,
                              type: "variable",
                              dataType: "uint32",
                              bigEndian: true,
                              operations: [
                                { convert: { from: "seconds", to: "minutes" } },
                              ],
                              leadingZeros: 1,
                              max: 59,
                            },
                            {
                              offset: 0x20c,
                              type: "variable",
                              dataType: "uint32",
                              bigEndian: true,
                              operations: [
                                { convert: { from: "seconds", to: "seconds" } },
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
                          name: "Single-Player Time",
                          type: "group",
                          mode: "time",
                          items: [
                            {
                              offset: 0x1f4,
                              type: "variable",
                              dataType: "uint32",
                              bigEndian: true,
                              operations: [
                                { convert: { from: "seconds", to: "hours" } },
                              ],
                              max: 999,
                            },
                            {
                              offset: 0x1f4,
                              type: "variable",
                              dataType: "uint32",
                              bigEndian: true,
                              operations: [
                                { convert: { from: "seconds", to: "minutes" } },
                              ],
                              leadingZeros: 1,
                              max: 59,
                            },
                            {
                              offset: 0x1f4,
                              type: "variable",
                              dataType: "uint32",
                              bigEndian: true,
                              operations: [
                                { convert: { from: "seconds", to: "seconds" } },
                              ],
                              leadingZeros: 1,
                              max: 59,
                            },
                          ],
                        },
                        {
                          name: "VS. Play Time",
                          type: "group",
                          mode: "time",
                          items: [
                            {
                              offset: 0x1ec,
                              type: "variable",
                              dataType: "uint32",
                              bigEndian: true,
                              operations: [
                                { convert: { from: "seconds", to: "hours" } },
                              ],
                              max: 999,
                            },
                            {
                              offset: 0x1ec,
                              type: "variable",
                              dataType: "uint32",
                              bigEndian: true,
                              operations: [
                                { convert: { from: "seconds", to: "minutes" } },
                              ],
                              leadingZeros: 1,
                              max: 59,
                            },
                            {
                              offset: 0x1ec,
                              type: "variable",
                              dataType: "uint32",
                              bigEndian: true,
                              operations: [
                                { convert: { from: "seconds", to: "seconds" } },
                              ],
                              leadingZeros: 1,
                              max: 59,
                            },
                          ],
                        },
                        {
                          name: "Combined VS. Play Time",
                          type: "group",
                          mode: "time",
                          items: [
                            {
                              id: "combinedVsPlayTime",
                              offset: 0x1f0,
                              type: "variable",
                              dataType: "uint32",
                              bigEndian: true,
                              operations: [
                                { convert: { from: "seconds", to: "hours" } },
                              ],
                              max: 999,
                            },
                            {
                              id: "combinedVsPlayTime",
                              offset: 0x1f0,
                              type: "variable",
                              dataType: "uint32",
                              bigEndian: true,
                              operations: [
                                { convert: { from: "seconds", to: "minutes" } },
                              ],
                              leadingZeros: 1,
                              max: 59,
                            },
                            {
                              id: "combinedVsPlayTime",
                              offset: 0x1f0,
                              type: "variable",
                              dataType: "uint32",
                              bigEndian: true,
                              operations: [
                                { convert: { from: "seconds", to: "seconds" } },
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
                          id: "vsPlayMatchTotal",
                          name: "VS. Play Match Total",
                          offset: 0x1d0,
                          type: "variable",
                          dataType: "uint32",
                          bigEndian: true,
                          disabled: true,
                        },
                        {
                          id: "vsMatchTotal-0",
                          name: "Time Match Total",
                          offset: 0x1d0,
                          type: "variable",
                          dataType: "uint32",
                          bigEndian: true,
                        },
                        {
                          id: "vsMatchTotal-1",
                          name: "Stock Match Total",
                          offset: 0x1d4,
                          type: "variable",
                          dataType: "uint32",
                          bigEndian: true,
                        },
                        {
                          id: "vsMatchTotal-2",
                          name: "Coin Match Total",
                          offset: 0x1d8,
                          type: "variable",
                          dataType: "uint32",
                          bigEndian: true,
                        },
                        {
                          id: "vsMatchTotal-3",
                          name: "Bonus Match Total",
                          offset: 0x1dc,
                          type: "variable",
                          dataType: "uint32",
                          bigEndian: true,
                        },
                        {
                          id: "vsMatchTotal-4",
                          name: "Misc. Match Total",
                          offset: 0x1e0,
                          type: "variable",
                          dataType: "uint32",
                          bigEndian: true,
                        },
                      ],
                    },
                    {
                      type: "section",
                      flex: true,
                      items: [
                        {
                          name: "VS. Play Contestants",
                          offset: 0x1e8,
                          type: "variable",
                          dataType: "uint32",
                          bigEndian: true,
                        },
                        {
                          name: "Match Reset Counter",
                          offset: 0x1e4,
                          type: "variable",
                          dataType: "uint32",
                          bigEndian: true,
                        },
                        {
                          name: "Total Damage",
                          offset: 0x210,
                          type: "variable",
                          dataType: "uint32",
                          bigEndian: true,
                        },
                        {
                          name: "KO Total",
                          offset: 0x214,
                          type: "variable",
                          dataType: "uint32",
                          bigEndian: true,
                        },
                        {
                          name: "Self-Destruct Total",
                          offset: 0x218,
                          type: "variable",
                          dataType: "uint32",
                          bigEndian: true,
                        },
                      ],
                    },
                    {
                      type: "section",
                      flex: true,
                      items: [
                        {
                          name: "Total Distance Walked",
                          offset: 0x60,
                          type: "variable",
                          dataType: "uint32",
                          bigEndian: true,
                        },
                        {
                          name: "Total Coins Earned (Trophies)",
                          offset: 0x64,
                          type: "variable",
                          dataType: "uint32",
                          bigEndian: true,
                          hidden: true,
                        },
                        {
                          name: "Total Coins Earned",
                          offset: 0x204,
                          type: "variable",
                          dataType: "uint32",
                          bigEndian: true,
                        },
                      ],
                    },
                    {
                      name: "Unlockables Characters Related",
                      type: "section",
                      flex: true,
                      hidden: true,
                      items: [
                        {
                          name: "VS. Play Match Total",
                          offset: 0x28,
                          type: "variable",
                          dataType: "uint32",
                          bigEndian: true,
                        },
                        {
                          name: "Combined VS. Play Time",
                          offset: 0x2c,
                          type: "variable",
                          dataType: "uint32",
                          bigEndian: true,
                        },
                      ],
                    },
                    {
                      name: "Unlockables Stages Related",
                      type: "section",
                      flex: true,
                      hidden: true,
                      items: [
                        {
                          name: "VS. Play Match Total",
                          offset: 0x48,
                          type: "variable",
                          dataType: "uint32",
                          bigEndian: true,
                        },
                      ],
                    },
                    {
                      name: "Unlockables Trophies Related",
                      type: "section",
                      flex: true,
                      hidden: true,
                      items: [
                        {
                          name: "VS. Play Match Total",
                          offset: 0x50,
                          type: "variable",
                          dataType: "uint32",
                          bigEndian: true,
                        },
                        {
                          name: "Coin Match Total",
                          offset: 0x54,
                          type: "variable",
                          dataType: "uint32",
                          bigEndian: true,
                        },
                        {
                          name: "VS. KO Count",
                          offset: 0x5c,
                          type: "variable",
                          dataType: "uint32",
                          bigEndian: true,
                        },
                      ],
                    },
                    {
                      name: "Unlockables Options Related",
                      type: "section",
                      flex: true,
                      hidden: true,
                      items: [
                        {
                          name: "VS. KO Count",
                          offset: 0x1c8,
                          type: "variable",
                          dataType: "uint32",
                          bigEndian: true,
                        },
                      ],
                    },
                    {
                      name: "Characters Played Once",
                      type: "bitflags",
                      hidden: true,
                      flags: [
                        { offset: 0x37, bit: 0, label: "C. Falcon" }, // prettier-ignore
                        { offset: 0x37, bit: 1, label: "DK" }, // prettier-ignore
                        { offset: 0x37, bit: 2, label: "Fox" }, // prettier-ignore
                        { offset: 0x37, bit: 3, label: "Mr. Game & Watch" }, // prettier-ignore
                        { offset: 0x37, bit: 4, label: "Kirby" }, // prettier-ignore
                        { offset: 0x37, bit: 5, label: "Bowser" }, // prettier-ignore
                        { offset: 0x37, bit: 6, label: "Link" }, // prettier-ignore
                        { offset: 0x37, bit: 7, label: "Luigi" }, // prettier-ignore
                        { offset: 0x36, bit: 0, label: "Mario" }, // prettier-ignore
                        { offset: 0x36, bit: 1, label: "Marth" }, // prettier-ignore
                        { offset: 0x36, bit: 2, label: "Mewtwo" }, // prettier-ignore
                        { offset: 0x36, bit: 3, label: "Ness" }, // prettier-ignore
                        { offset: 0x36, bit: 4, label: "Peach" }, // prettier-ignore
                        { offset: 0x36, bit: 5, label: "Pikachu" }, // prettier-ignore
                        { offset: 0x36, bit: 6, label: "Ice Climbers" }, // prettier-ignore
                        { offset: 0x36, bit: 7, label: "Jigglypuff" }, // prettier-ignore
                        { offset: 0x35, bit: 0, label: "Samus" }, // prettier-ignore
                        { offset: 0x35, bit: 1, label: "Yoshi" }, // prettier-ignore
                        { offset: 0x35, bit: 2, label: "Zelda" }, // prettier-ignore
                        { offset: 0x35, bit: 3, label: "Falco" }, // prettier-ignore
                        { offset: 0x35, bit: 4, label: "Young Link" }, // prettier-ignore
                        { offset: 0x35, bit: 5, label: "Dr. Mario" }, // prettier-ignore
                        { offset: 0x35, bit: 6, label: "Roy" }, // prettier-ignore
                        { offset: 0x35, bit: 7, label: "Pichu" }, // prettier-ignore
                        { offset: 0x34, bit: 0, label: "Ganondorf" }, // prettier-ignore
                        { offset: 0x34, bit: 1, label: "???" }, // prettier-ignore
                        { offset: 0x34, bit: 2, label: "???" }, // prettier-ignore
                        { offset: 0x34, bit: 3, label: "???" }, // prettier-ignore
                        { offset: 0x34, bit: 4, label: "???" }, // prettier-ignore
                        { offset: 0x34, bit: 5, label: "???" }, // prettier-ignore
                        { offset: 0x34, bit: 6, label: "???" }, // prettier-ignore
                        { offset: 0x34, bit: 7, label: "???" }, // prettier-ignore
                      ],
                    },
                  ],
                },
                {
                  name: "Special",
                  items: [
                    {
                      type: "tabs",
                      vertical: true,
                      items: dataSpecialTypes.map(
                        (type) =>
                          ({
                            name: type.name,
                            items: type.messages.map((message) => ({
                              name: message.name,
                              type: "section",
                              flex: true,
                              items: [
                                {
                                  name: "Progression",
                                  offset:
                                    0x307 +
                                    Math.floor(message.index / 0x20) * 0x8 -
                                    Math.floor(message.index / 8),
                                  type: "variable",
                                  dataType: "bit",
                                  bit: message.index % 8,
                                  resource: "progressions",
                                },
                                {
                                  name: "Date",
                                  type: "group",
                                  mode: "date",
                                  items: [
                                    {
                                      offset: 0x338 + message.index * 0x4,
                                      type: "variable",
                                      dataType: "uint32",
                                      bigEndian: true,
                                      operations: [
                                        { "+": 946684800 },
                                        {
                                          date: { from: "seconds", to: "day" },
                                        },
                                      ],
                                      leadingZeros: 1,
                                      min: 1,
                                      max: 31,
                                    },
                                    {
                                      offset: 0x338 + message.index * 0x4,
                                      type: "variable",
                                      dataType: "uint32",
                                      bigEndian: true,
                                      operations: [
                                        { "+": 946684800 },
                                        {
                                          date: {
                                            from: "seconds",
                                            to: "month",
                                          },
                                        },
                                      ],
                                      leadingZeros: 1,
                                      min: 1,
                                      max: 12,
                                    },
                                    {
                                      offset: 0x338 + message.index * 0x4,
                                      type: "variable",
                                      dataType: "uint32",
                                      bigEndian: true,
                                      operations: [
                                        { "+": 946684800 },
                                        {
                                          date: { from: "seconds", to: "year" },
                                        },
                                      ],
                                      min: 2000,
                                      max: 9999,
                                    },
                                    {
                                      offset: 0x338 + message.index * 0x4,
                                      type: "variable",
                                      dataType: "uint32",
                                      bigEndian: true,
                                      operations: [
                                        {
                                          date: {
                                            from: "seconds",
                                            to: "hours",
                                          },
                                        },
                                      ],
                                      leadingZeros: 1,
                                      max: 23,
                                    },
                                    {
                                      offset: 0x338 + message.index * 0x4,
                                      type: "variable",
                                      dataType: "uint32",
                                      bigEndian: true,
                                      operations: [
                                        {
                                          date: {
                                            from: "seconds",
                                            to: "minutes",
                                          },
                                        },
                                      ],
                                      leadingZeros: 1,
                                      max: 59,
                                    },
                                    {
                                      offset: 0x338 + message.index * 0x4,
                                      type: "variable",
                                      dataType: "uint32",
                                      bigEndian: true,
                                      operations: [
                                        {
                                          date: {
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
                            })),
                          }) as ItemTab,
                      ),
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
    characters,
    difficulties: {
      0x0: "-",
      0x1: "Very Easy",
      0x2: "Easy",
      0x3: "Normal",
      0x4: "Hard",
      0x5: "Very Hard",
    },
    frequencies: {
      0x0: "Very Low",
      0x1: "Low",
      0x2: "Medium",
      0x3: "High",
      0x4: "Very High",
      0xff: "None",
    },
    languages: {
      0x2: "English",
      0x3: "German",
      0x4: "French",
      0x5: "Italian",
      0x6: "Spanish",
    },
    optionBoolean: {
      0x0: "Off",
      0x1: "On",
    },
    progressions: {
      0x0: "-",
      0x1: "Cleared",
    },
  },
  resourcesOrder: {
    characters: [
      0x8, 0x1, 0x6, 0x10, 0x11, 0x4, 0x2, 0xd, 0xb, 0x0, 0x5, 0xc, 0xe, 0x12,
      0x7, 0xf, 0xa, 0x9, 0x3, 0x15, 0x18, 0x13, 0x14, 0x17, 0x16,
    ],
    frequencies: [0xff],
  },
};

export default template;
