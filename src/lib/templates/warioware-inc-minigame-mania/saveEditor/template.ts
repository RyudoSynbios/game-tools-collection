import type { GameJson } from "$lib/types";

import { gameCategories, gridGames } from "./utils/resource";

const template: GameJson = {
  validator: {
    platforms: {
      gameboyadvance: {
        europe_usa: {
          0x0: [0x4d, 0x49, 0x57], // "MIW"
        },
        japan: {
          0x0: [0x4d, 0x49, 0x57], // "MIW"
        },
      },
    },
    text: "Drag 'n' drop here or click to add a save file.",
    error: "Not a valid save file.",
  },
  items: [
    {
      name: "Checksum",
      offset: 0x8,
      type: "checksum",
      dataType: "uint32",
      control: {
        offsetStart: 0x0,
        offsetEnd: 0x404,
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
                  id: "filename",
                  name: "Filename",
                  offset: 0x10,
                  length: 0xa,
                  type: "variable",
                  dataType: "string",
                  letterDataType: "uint8",
                  encoding: "windows31J",
                  endCode: 0x0,
                  regex: "[\uff10-\uff19\uff21-\uff3a\uff41-\uff5a]",
                  test: true,
                },
                {
                  name: "Letter Count",
                  offset: 0x1b,
                  type: "variable",
                  dataType: "uint8",
                  hidden: true,
                },
                {
                  name: "Gender",
                  offset: 0x1c,
                  type: "variable",
                  dataType: "uint8",
                  resource: "genders",
                },
                {
                  name: "Language",
                  offset: 0x1ff,
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
                  name: "Played",
                  type: "bitflags",
                  hidden: true,
                  flags: [
                    { offset: 0x1e2, bit: 0, label: "Sheriff" },
                    { offset: 0x1e3, bit: 0, label: "Dr. Wario" },
                    { offset: 0x1e4, bit: 0, label: "Fly Swatter" },
                    { offset: 0x1e5, bit: 0, label: "???" },
                    { offset: 0x1e6, bit: 0, label: "Dong Dong" },
                    { offset: 0x1e7, bit: 0, label: "Pyoro / Pyoro 2" },
                    { offset: 0x1e8, bit: 0, label: "???" },
                    { offset: 0x1e9, bit: 0, label: "Chiritorie" },
                    { offset: 0x1ea, bit: 0, label: "Hurdle" },
                    { offset: 0x1eb, bit: 0, label: "Chicken Race" },
                    { offset: 0x1ec, bit: 0, label: "Jump Forever" },
                    { offset: 0x1ed, bit: 0, label: "Paper Plane" },
                    { offset: 0x1ee, bit: 0, label: "Skating Board" },
                  ],
                },
                {
                  name: "Introductions",
                  type: "bitflags",
                  hidden: true,
                  flags: [
                    { offset: 0x400, bit: 0, label: "???", separator: true },
                    { offset: 0x400, bit: 2, label: "Introduction" },
                    { offset: 0x400, bit: 3, label: "Jimmy (Blue)" },
                    { offset: 0x400, bit: 4, label: "9-Volt" },
                    { offset: 0x400, bit: 5, label: "Dribble" },
                    { offset: 0x400, bit: 6, label: "Kat" },
                    { offset: 0x400, bit: 7, label: "Mona" },
                    { offset: 0x401, bit: 0, label: "Dr. Crygor" },
                    { offset: 0x401, bit: 1, label: "Orbulon" },
                    { offset: 0x401, bit: 2, label: "Wario" },
                    { offset: 0x401, bit: 3, label: "Jimmy (Yellow)" },
                    { offset: 0x401, bit: 4, label: "Jimmy (Red)" },
                  ],
                },
                {
                  name: "???",
                  type: "bitflags",
                  hidden: true,
                  flags: [
                    { offset: 0x1f1, bit: 0, label: "???" },
                    { offset: 0x1f2, bit: 0, label: "???" },
                    { offset: 0x1f3, bit: 0, label: "???" },
                    { offset: 0x1f4, bit: 0, label: "???" },
                    { offset: 0x1f5, bit: 0, label: "???" },
                    { offset: 0x1f6, bit: 0, label: "???" },
                    { offset: 0x1f7, bit: 0, label: "???" },
                    { offset: 0x1f8, bit: 0, label: "???" },
                    { offset: 0x1f9, bit: 0, label: "???" },
                  ],
                },
              ],
            },
          ],
        },
        {
          name: "Games",
          items: [
            {
              type: "tabs",
              vertical: true,
              items: gameCategories.map((category, categoryIndex) => ({
                name: category.name,
                flex: categoryIndex === 2,
                items: category.games.map((game) => {
                  let resource = "gameCompleteProgressions";

                  if (game.type === 0x1) {
                    resource = "gameUnlockedProgressions";
                  } else if (game.type === 0x2) {
                    resource = "gameClearedProgressions";
                  }

                  if (categoryIndex === 2) {
                    return {
                      name: game.name,
                      offset: 0x20 + game.index * 0x8,
                      type: "variable",
                      dataType: "uint8",
                      resource,
                    };
                  }

                  if (categoryIndex === 3) {
                    return {
                      type: "section",
                      flex: true,
                      noMargin: true,
                      items: [
                        {
                          name: game.name,
                          offset: 0x20 + game.index * 0x8,
                          type: "variable",
                          dataType: "uint8",
                          resource,
                        },
                        {
                          name: "High Score",
                          offset: 0x22 + game.index * 0x8,
                          type: "variable",
                          dataType: "uint32",
                          max: game.max,
                        },
                      ],
                    };
                  }

                  return {
                    type: "section",
                    flex: true,
                    items: [
                      {
                        name: game.name,
                        offset: 0x20 + game.index * 0x8,
                        type: "variable",
                        dataType: "uint8",
                        resource,
                      },
                      {
                        name: "Top 1",
                        offset: 0x22 + game.index * 0x8,
                        type: "variable",
                        dataType: "uint16",
                        max: 999,
                      },
                      {
                        name: "Top 2",
                        offset: 0x24 + game.index * 0x8,
                        type: "variable",
                        dataType: "uint16",
                        max: 999,
                      },
                      {
                        name: "Top 3",
                        offset: 0x26 + game.index * 0x8,
                        type: "variable",
                        dataType: "uint16",
                        max: 999,
                      },
                    ],
                  };
                }),
              })),
            },
          ],
        },
        {
          name: "Grid",
          items: [
            {
              type: "tabs",
              vertical: true,
              items: gridGames.map((game) => ({
                name: game.name,
                items: game.miniGames.map((miniGame) => ({
                  type: "section",
                  flex: true,
                  noMargin: true,
                  items: [
                    {
                      name: miniGame.name,
                      offset: 0x100 + miniGame.index,
                      type: "variable",
                      dataType: "uint8",
                      resource: "miniGameProgressions",
                    },
                    {
                      name: "High Score",
                      offset: 0x200 + miniGame.index * 0x2,
                      type: "variable",
                      dataType: "uint16",
                      max: 999,
                    },
                  ],
                })),
              })),
            },
          ],
        },
      ],
    },
  ],
  resources: {
    gameClearedProgressions: {
      0x0: "-",
      0x3: "Unlocked",
    },
    gameCompleteProgressions: {
      0x0: "-",
      0x2: "Unlocked",
      0x3: "Cleared",
    },
    gameUnlockedProgressions: {
      0x0: "-",
      0x2: "Unlocked",
    },
    miniGameProgressions: {
      0x0: "-",
      0x1: "Unlocked",
      0x3: "Cleared",
    },
    genders: {
      0x0: "Male",
      0x1: "Female",
    },
  },
};

export default template;
