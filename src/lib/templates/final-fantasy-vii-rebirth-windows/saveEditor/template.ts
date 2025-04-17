import type { GameJson } from "$lib/types";

import { characters } from "./utils/resource";

const template: GameJson = {
  validator: {
    fileNames: [/ff7rebirth([0-9]+).sav/],
    regions: {
      world: true,
    },
    text: "Drag 'n' drop here or click to add a save file.",
    hint: 'Works with "ff7rebirth{xxx}.sav" files.',
    error: "Not a valid save file.",
  },
  items: [
    {
      type: "tabs",
      items: [
        {
          name: "Party",
          items: [
            {
              id: "materia",
              length: 0x100,
              type: "container",
              instanceType: "tabs",
              instances: 9,
              resource: "characters",
              vertical: true,
              items: [
                {
                  type: "tabs",
                  items: [
                    {
                      name: "Status",
                      items: [
                        {
                          type: "section",
                          flex: true,
                          items: [
                            {
                              name: "Level",
                              offset: 0x30,
                              type: "variable",
                              dataType: "uint8",
                              max: 50,
                            },
                            {
                              name: "Experience",
                              offset: 0x50,
                              type: "variable",
                              dataType: "uint32",
                              max: 9999999,
                            },
                            {
                              name: "ATB Bars",
                              offset: 0x32,
                              type: "variable",
                              dataType: "uint8",
                              max: 2,
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
                                  offset: 0x40,
                                  type: "variable",
                                  dataType: "uint32",
                                  min: 1,
                                  max: 9999,
                                },
                                {
                                  offset: 0x44,
                                  type: "variable",
                                  dataType: "uint32",
                                  min: 1,
                                  max: 9999,
                                },
                              ],
                            },
                            {
                              name: "MP",
                              type: "group",
                              mode: "fraction",
                              items: [
                                {
                                  offset: 0x48,
                                  type: "variable",
                                  dataType: "uint32",
                                  max: 999,
                                },
                                {
                                  offset: 0x4c,
                                  type: "variable",
                                  dataType: "uint32",
                                  max: 999,
                                },
                              ],
                            },
                            {
                              name: "Limit",
                              offset: 0x34,
                              type: "variable",
                              dataType: "float32",
                              hidden: true,
                            },
                            {
                              name: "ATB",
                              offset: 0x54,
                              type: "variable",
                              dataType: "float32",
                              hidden: true,
                            },
                          ],
                        },
                        {
                          type: "section",
                          flex: true,
                          items: [
                            {
                              name: "Attack",
                              offset: 0x58,
                              type: "variable",
                              dataType: "uint32",
                              max: 9999,
                            },
                            {
                              name: "Magic Attack",
                              offset: 0x5c,
                              type: "variable",
                              dataType: "uint32",
                              max: 9999,
                            },
                            {
                              name: "Defense",
                              offset: 0x60,
                              type: "variable",
                              dataType: "uint32",
                              max: 9999,
                            },
                            {
                              name: "Magic Defense",
                              offset: 0x64,
                              type: "variable",
                              dataType: "uint32",
                              max: 9999,
                            },
                            {
                              name: "Luck",
                              offset: 0x68,
                              type: "variable",
                              dataType: "uint32",
                              max: 999,
                            },
                            {
                              name: "Speed",
                              offset: 0x33,
                              type: "variable",
                              dataType: "uint8",
                              max: 999,
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
    },
  ],
  resources: {
    characters,
  },
};

export default template;
