import type { GameJson } from "$lib/types";

const template: GameJson = {
  validator: {
    fileNames: [/Story_Slot([0-9]+).sav/],
    regions: {
      world: {
        0x0: [0x7d, 0x6d, 0x7d, 0x6e],
      },
    },
    text: "Drag 'n' drop here or click to add a save file.",
    hint: "Designed to work with v1.6.\nOther versions may work, but may corrupt the save.\nPlease make a backup before editing.",
    error: "Not a valid save file.",
  },
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
                  id: "difficulty",
                  name: "Difficulty",
                  offset: 0x0,
                  jsonPath: "Info.GameLevel",
                  type: "variable",
                  dataType: "uint32",
                  resource: "difficulties",
                },
                {
                  name: "Playtime",
                  type: "group",
                  mode: "time",
                  items: [
                    {
                      offset: 0x0,
                      jsonPath: "Info.TotalPlaySec",
                      type: "variable",
                      dataType: "uint32",
                      bigEndian: true,
                      operations: [
                        {
                          convert: { from: "seconds", to: "hours" },
                        },
                      ],
                      max: 99,
                    },
                    {
                      offset: 0x0,
                      jsonPath: "Info.TotalPlaySec",
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
                      offset: 0x0,
                      jsonPath: "Info.TotalPlaySec",
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
                      test: true,
                    },
                  ],
                },
                {
                  name: "Map Discovery Rate",
                  offset: 0x0,
                  jsonPath: "Info.MapCompleteness",
                  type: "variable",
                  dataType: "float32",
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
                  name: "Gold",
                  offset: 0x0,
                  jsonPath: "Info.TotalCoins",
                  type: "variable",
                  dataType: "uint32",
                  max: 9999999,
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
                  name: "Level",
                  offset: 0x0,
                  jsonPath: "Info.Level",
                  type: "variable",
                  dataType: "uint32",
                  // max: 9999999,
                },
                {
                  name: "Experience",
                  offset: 0x0,
                  jsonPath: "StatusDataParsed.TotalExperience",
                  type: "variable",
                  dataType: "uint32",
                  // max: 9999999,
                },
                {
                  name: "HP",
                  offset: 0x0,
                  jsonPath: "StatusDataParsed.HitPoint",
                  type: "variable",
                  dataType: "uint32",
                  // max: 9999999,
                },
                {
                  name: "MP",
                  offset: 0x0,
                  jsonPath: "StatusDataParsed.MagicPoint",
                  type: "variable",
                  dataType: "uint32",
                  // max: 9999999,
                },
              ],
            },
          ],
        },
      ],
    },
  ],
  resources: {
    difficulties: {
      0x0: "Normal",
      0x1: "Hard",
      0x2: "Nightmare",
    },
  },
};

export default template;
