import type { GameJson } from "$lib/types";

const template: GameJson = {
  validator: {
    regions: {
      europe: {
        $and: [{ 0x0: [0x55, 0xaa, 0x55, 0xaa] }, { 0x14f: [0x57] }],
      },
    },
    text: "Drag 'n' drop here or click to add a save file.",
    error: "Not a valid save file.",
  },
  items: [
    {
      name: "Checksum",
      offset: 0xc,
      type: "checksum",
      dataType: "uint32",
      control: {
        offsetStart: 0x0,
        offsetEnd: 0x0,
      },
    },
    {
      type: "tabs",
      items: [
        {
          name: "General",
          flex: true,
          items: [
            {
              name: "Timestamp",
              offset: 0x30,
              type: "variable",
              dataType: "uint32",
            },
            {
              name: "???",
              type: "bitflags",
              flags: [
                { offset: 0x24, bit: 0, label: "???" }, // prettier-ignore
                { offset: 0x24, bit: 1, label: "???" }, // prettier-ignore
                { offset: 0x24, bit: 2, label: "Harcore" }, // prettier-ignore
                { offset: 0x24, bit: 3, label: "???" }, // prettier-ignore
                { offset: 0x24, bit: 4, label: "???" }, // prettier-ignore
                { offset: 0x24, bit: 5, label: "Expansion Character", disabled: true }, // prettier-ignore
                { offset: 0x24, bit: 6, label: "???" }, // prettier-ignore
                { offset: 0x24, bit: 7, label: "???" }, // prettier-ignore
              ],
            },
            {
              name: "Progression",
              offset: 0x25,
              type: "variable",
              dataType: "uint8",
              resource: "progressions",
            },
          ],
        },
        {
          name: "Hero",
          flex: true,
          items: [
            {
              name: "Name",
              offset: 0x14,
              length: 0xf,
              type: "variable",
              dataType: "string",
              letterDataType: "uint8",
              isZeroTerminated: true,
              // resource: "letters",
            },
            {
              name: "Class",
              offset: 0x28,
              type: "variable",
              dataType: "uint8",
              resource: "classes",
            },
            {
              name: "Level",
              offset: 0x2b,
              type: "variable",
              dataType: "uint8",
            },
          ],
        },
        {
          name: "Quests",
          flex: true,
          items: [
            {
              length: 0x60,
              type: "container",
              instanceType: "tabs",
              instances: 3,
              resource: "difficulties",
              flex: true,
              items: [
                {
                  type: "tabs",
                  vertical: true,
                  items: [
                    {
                      name: "Act 1",
                      items: [
                        {
                          name: "General",
                          type: "bitflags",
                          flags: [
                            { offset: 0x159, bit: 0, label: "Introduction" }, // prettier-ignore
                            { offset: 0x167, bit: 0, label: "Act Completed" }, // prettier-ignore
                          ],
                        },
                        {
                          type: "section",
                          flex: true,
                          items: [
                            {
                              name: "Den of Evil",
                              offset: 0x28,
                              type: "variable",
                              dataType: "uint16",
                              resource: "quests11",
                            },
                            {
                              name: "Den of Evil",
                              type: "bitflags",
                              flags: [
                                { offset: 0x15b, bit: 0, label: "???" }, // prettier-ignore
                                { offset: 0x15b, bit: 1, label: "???" }, // prettier-ignore
                                { offset: 0x15b, bit: 2, label: "???" }, // prettier-ignore
                                { offset: 0x15b, bit: 3, label: "???" }, // prettier-ignore
                                { offset: 0x15b, bit: 4, label: "???" }, // prettier-ignore
                                { offset: 0x15b, bit: 5, label: "???" }, // prettier-ignore
                                { offset: 0x15b, bit: 6, label: "???" }, // prettier-ignore
                                { offset: 0x15b, bit: 7, label: "???" }, // prettier-ignore
                                { offset: 0x15c, bit: 0, label: "???" }, // prettier-ignore
                                { offset: 0x15c, bit: 1, label: "???" }, // prettier-ignore
                                { offset: 0x15c, bit: 2, label: "???" }, // prettier-ignore
                                { offset: 0x15c, bit: 3, label: "???" }, // prettier-ignore
                                { offset: 0x15c, bit: 4, label: "???" }, // prettier-ignore
                                { offset: 0x15c, bit: 5, label: "???" }, // prettier-ignore
                                { offset: 0x15c, bit: 6, label: "???" }, // prettier-ignore
                                { offset: 0x15c, bit: 7, label: "???" }, // prettier-ignore
                              ],
                            },
                            {
                              name: "Sisters' Burial Grounds",
                              type: "bitflags",
                              flags: [
                                { offset: 0x15d, bit: 0, label: "???" }, // prettier-ignore
                                { offset: 0x15d, bit: 1, label: "???" }, // prettier-ignore
                                { offset: 0x15d, bit: 2, label: "???" }, // prettier-ignore
                                { offset: 0x15d, bit: 3, label: "???" }, // prettier-ignore
                                { offset: 0x15d, bit: 4, label: "???" }, // prettier-ignore
                                { offset: 0x15d, bit: 5, label: "???" }, // prettier-ignore
                                { offset: 0x15d, bit: 6, label: "???" }, // prettier-ignore
                                { offset: 0x15d, bit: 7, label: "???" }, // prettier-ignore
                                { offset: 0x15e, bit: 0, label: "???" }, // prettier-ignore
                                { offset: 0x15e, bit: 1, label: "???" }, // prettier-ignore
                                { offset: 0x15e, bit: 2, label: "???" }, // prettier-ignore
                                { offset: 0x15e, bit: 3, label: "???" }, // prettier-ignore
                                { offset: 0x15e, bit: 4, label: "???" }, // prettier-ignore
                                { offset: 0x15e, bit: 5, label: "???" }, // prettier-ignore
                                { offset: 0x15e, bit: 6, label: "???" }, // prettier-ignore
                                { offset: 0x15e, bit: 7, label: "???" }, // prettier-ignore
                              ],
                            },
                            {
                              name: "The Search for Cain",
                              type: "bitflags",
                              flags: [
                                { offset: 0x15f, bit: 0, label: "???" }, // prettier-ignore
                                { offset: 0x15f, bit: 1, label: "???" }, // prettier-ignore
                                { offset: 0x15f, bit: 2, label: "???" }, // prettier-ignore
                                { offset: 0x15f, bit: 3, label: "???" }, // prettier-ignore
                                { offset: 0x15f, bit: 4, label: "???" }, // prettier-ignore
                                { offset: 0x15f, bit: 5, label: "???" }, // prettier-ignore
                                { offset: 0x15f, bit: 6, label: "???" }, // prettier-ignore
                                { offset: 0x15f, bit: 7, label: "???" }, // prettier-ignore
                                { offset: 0x160, bit: 0, label: "???" }, // prettier-ignore
                                { offset: 0x160, bit: 1, label: "???" }, // prettier-ignore
                                { offset: 0x160, bit: 2, label: "???" }, // prettier-ignore
                                { offset: 0x160, bit: 3, label: "???" }, // prettier-ignore
                                { offset: 0x160, bit: 4, label: "???" }, // prettier-ignore
                                { offset: 0x160, bit: 5, label: "???" }, // prettier-ignore
                                { offset: 0x160, bit: 6, label: "???" }, // prettier-ignore
                                { offset: 0x160, bit: 7, label: "???" }, // prettier-ignore
                              ],
                            },
                          ],
                        },
                        {
                          type: "section",
                          flex: true,
                          items: [
                            {
                              name: "The Forgotten Tower",
                              type: "bitflags",
                              flags: [
                                { offset: 0x163, bit: 0, label: "???" }, // prettier-ignore
                                { offset: 0x163, bit: 1, label: "???" }, // prettier-ignore
                                { offset: 0x163, bit: 2, label: "???" }, // prettier-ignore
                                { offset: 0x163, bit: 3, label: "???" }, // prettier-ignore
                                { offset: 0x163, bit: 4, label: "???" }, // prettier-ignore
                                { offset: 0x163, bit: 5, label: "???" }, // prettier-ignore
                                { offset: 0x163, bit: 6, label: "???" }, // prettier-ignore
                                { offset: 0x163, bit: 7, label: "???" }, // prettier-ignore
                                { offset: 0x164, bit: 0, label: "???" }, // prettier-ignore
                                { offset: 0x164, bit: 1, label: "???" }, // prettier-ignore
                                { offset: 0x164, bit: 2, label: "???" }, // prettier-ignore
                                { offset: 0x164, bit: 3, label: "???" }, // prettier-ignore
                                { offset: 0x164, bit: 4, label: "???" }, // prettier-ignore
                                { offset: 0x164, bit: 5, label: "???" }, // prettier-ignore
                                { offset: 0x164, bit: 6, label: "???" }, // prettier-ignore
                                { offset: 0x164, bit: 7, label: "???" }, // prettier-ignore
                              ],
                            },
                            {
                              name: "Tools of the Trade",
                              type: "bitflags",
                              flags: [
                                { offset: 0x161, bit: 0, label: "???" }, // prettier-ignore
                                { offset: 0x161, bit: 1, label: "???" }, // prettier-ignore
                                { offset: 0x161, bit: 2, label: "???" }, // prettier-ignore
                                { offset: 0x161, bit: 3, label: "???" }, // prettier-ignore
                                { offset: 0x161, bit: 4, label: "???" }, // prettier-ignore
                                { offset: 0x161, bit: 5, label: "???" }, // prettier-ignore
                                { offset: 0x161, bit: 6, label: "???" }, // prettier-ignore
                                { offset: 0x161, bit: 7, label: "???" }, // prettier-ignore
                                { offset: 0x162, bit: 0, label: "???" }, // prettier-ignore
                                { offset: 0x162, bit: 1, label: "???" }, // prettier-ignore
                                { offset: 0x162, bit: 2, label: "???" }, // prettier-ignore
                                { offset: 0x162, bit: 3, label: "???" }, // prettier-ignore
                                { offset: 0x162, bit: 4, label: "???" }, // prettier-ignore
                                { offset: 0x162, bit: 5, label: "???" }, // prettier-ignore
                                { offset: 0x162, bit: 6, label: "???" }, // prettier-ignore
                                { offset: 0x162, bit: 7, label: "???" }, // prettier-ignore
                              ],
                            },
                            {
                              name: "Sisters to the Slaughter",
                              type: "bitflags",
                              flags: [
                                { offset: 0x165, bit: 0, label: "???" }, // prettier-ignore
                                { offset: 0x165, bit: 1, label: "???" }, // prettier-ignore
                                { offset: 0x165, bit: 2, label: "???" }, // prettier-ignore
                                { offset: 0x165, bit: 3, label: "???" }, // prettier-ignore
                                { offset: 0x165, bit: 4, label: "???" }, // prettier-ignore
                                { offset: 0x165, bit: 5, label: "???" }, // prettier-ignore
                                { offset: 0x165, bit: 6, label: "???" }, // prettier-ignore
                                { offset: 0x165, bit: 7, label: "???" }, // prettier-ignore
                                { offset: 0x166, bit: 0, label: "???" }, // prettier-ignore
                                { offset: 0x166, bit: 1, label: "???" }, // prettier-ignore
                                { offset: 0x166, bit: 2, label: "???" }, // prettier-ignore
                                { offset: 0x166, bit: 3, label: "???" }, // prettier-ignore
                                { offset: 0x166, bit: 4, label: "???" }, // prettier-ignore
                                { offset: 0x166, bit: 5, label: "???" }, // prettier-ignore
                                { offset: 0x166, bit: 6, label: "???" }, // prettier-ignore
                                { offset: 0x166, bit: 7, label: "???" }, // prettier-ignore
                              ],
                            },
                          ],
                        },
                      ],
                    },
                    {
                      name: "Act 2",
                      items: [
                        {
                          name: "General",
                          type: "bitflags",
                          flags: [
                            { offset: 0x169, bit: 0, label: "Introduction" }, // prettier-ignore
                            { offset: 0x177, bit: 0, label: "Act Completed" }, // prettier-ignore
                          ],
                        },
                        {
                          type: "section",
                          flex: true,
                          items: [
                            {
                              name: "Dadament's Lair",
                              type: "bitflags",
                              flags: [
                                { offset: 0x16b, bit: 0, label: "???" }, // prettier-ignore
                                { offset: 0x16b, bit: 1, label: "???" }, // prettier-ignore
                                { offset: 0x16b, bit: 2, label: "???" }, // prettier-ignore
                                { offset: 0x16b, bit: 3, label: "???" }, // prettier-ignore
                                { offset: 0x16b, bit: 4, label: "???" }, // prettier-ignore
                                { offset: 0x16b, bit: 5, label: "???" }, // prettier-ignore
                                { offset: 0x16b, bit: 6, label: "???" }, // prettier-ignore
                                { offset: 0x16b, bit: 7, label: "???" }, // prettier-ignore
                                { offset: 0x16c, bit: 0, label: "???" }, // prettier-ignore
                                { offset: 0x16c, bit: 1, label: "???" }, // prettier-ignore
                                { offset: 0x16c, bit: 2, label: "???" }, // prettier-ignore
                                { offset: 0x16c, bit: 3, label: "???" }, // prettier-ignore
                                { offset: 0x16c, bit: 4, label: "???" }, // prettier-ignore
                                { offset: 0x16c, bit: 5, label: "???" }, // prettier-ignore
                                { offset: 0x16c, bit: 6, label: "???" }, // prettier-ignore
                                { offset: 0x16c, bit: 7, label: "???" }, // prettier-ignore
                              ],
                            },
                            {
                              name: "The Horadric Staff",
                              type: "bitflags",
                              flags: [
                                { offset: 0x16d, bit: 0, label: "???" }, // prettier-ignore
                                { offset: 0x16d, bit: 1, label: "???" }, // prettier-ignore
                                { offset: 0x16d, bit: 2, label: "???" }, // prettier-ignore
                                { offset: 0x16d, bit: 3, label: "???" }, // prettier-ignore
                                { offset: 0x16d, bit: 4, label: "???" }, // prettier-ignore
                                { offset: 0x16d, bit: 5, label: "???" }, // prettier-ignore
                                { offset: 0x16d, bit: 6, label: "???" }, // prettier-ignore
                                { offset: 0x16d, bit: 7, label: "???" }, // prettier-ignore
                                { offset: 0x16e, bit: 0, label: "???" }, // prettier-ignore
                                { offset: 0x16e, bit: 1, label: "???" }, // prettier-ignore
                                { offset: 0x16e, bit: 2, label: "???" }, // prettier-ignore
                                { offset: 0x16e, bit: 3, label: "???" }, // prettier-ignore
                                { offset: 0x16e, bit: 4, label: "???" }, // prettier-ignore
                                { offset: 0x16e, bit: 5, label: "???" }, // prettier-ignore
                                { offset: 0x16e, bit: 6, label: "???" }, // prettier-ignore
                                { offset: 0x16e, bit: 7, label: "???" }, // prettier-ignore
                              ],
                            },
                            {
                              name: "Tainted Sun",
                              type: "bitflags",
                              flags: [
                                { offset: 0x16f, bit: 0, label: "???" }, // prettier-ignore
                                { offset: 0x16f, bit: 1, label: "???" }, // prettier-ignore
                                { offset: 0x16f, bit: 2, label: "???" }, // prettier-ignore
                                { offset: 0x16f, bit: 3, label: "???" }, // prettier-ignore
                                { offset: 0x16f, bit: 4, label: "???" }, // prettier-ignore
                                { offset: 0x16f, bit: 5, label: "???" }, // prettier-ignore
                                { offset: 0x16f, bit: 6, label: "???" }, // prettier-ignore
                                { offset: 0x16f, bit: 7, label: "???" }, // prettier-ignore
                                { offset: 0x170, bit: 0, label: "???" }, // prettier-ignore
                                { offset: 0x170, bit: 1, label: "???" }, // prettier-ignore
                                { offset: 0x170, bit: 2, label: "???" }, // prettier-ignore
                                { offset: 0x170, bit: 3, label: "???" }, // prettier-ignore
                                { offset: 0x170, bit: 4, label: "???" }, // prettier-ignore
                                { offset: 0x170, bit: 5, label: "???" }, // prettier-ignore
                                { offset: 0x170, bit: 6, label: "???" }, // prettier-ignore
                                { offset: 0x170, bit: 7, label: "???" }, // prettier-ignore
                              ],
                            },
                          ],
                        },
                        {
                          type: "section",
                          flex: true,
                          items: [
                            {
                              name: "Arcane Sanctuary",
                              type: "bitflags",
                              flags: [
                                { offset: 0x171, bit: 0, label: "???" }, // prettier-ignore
                                { offset: 0x171, bit: 1, label: "???" }, // prettier-ignore
                                { offset: 0x171, bit: 2, label: "???" }, // prettier-ignore
                                { offset: 0x171, bit: 3, label: "???" }, // prettier-ignore
                                { offset: 0x171, bit: 4, label: "???" }, // prettier-ignore
                                { offset: 0x171, bit: 5, label: "???" }, // prettier-ignore
                                { offset: 0x171, bit: 6, label: "???" }, // prettier-ignore
                                { offset: 0x171, bit: 7, label: "???" }, // prettier-ignore
                                { offset: 0x172, bit: 0, label: "???" }, // prettier-ignore
                                { offset: 0x172, bit: 1, label: "???" }, // prettier-ignore
                                { offset: 0x172, bit: 2, label: "???" }, // prettier-ignore
                                { offset: 0x172, bit: 3, label: "???" }, // prettier-ignore
                                { offset: 0x172, bit: 4, label: "???" }, // prettier-ignore
                                { offset: 0x172, bit: 5, label: "???" }, // prettier-ignore
                                { offset: 0x172, bit: 6, label: "???" }, // prettier-ignore
                                { offset: 0x172, bit: 7, label: "???" }, // prettier-ignore
                              ],
                            },
                            {
                              name: "The Summoner",
                              type: "bitflags",
                              flags: [
                                { offset: 0x173, bit: 0, label: "???" }, // prettier-ignore
                                { offset: 0x173, bit: 1, label: "???" }, // prettier-ignore
                                { offset: 0x173, bit: 2, label: "???" }, // prettier-ignore
                                { offset: 0x173, bit: 3, label: "???" }, // prettier-ignore
                                { offset: 0x173, bit: 4, label: "???" }, // prettier-ignore
                                { offset: 0x173, bit: 5, label: "???" }, // prettier-ignore
                                { offset: 0x173, bit: 6, label: "???" }, // prettier-ignore
                                { offset: 0x173, bit: 7, label: "???" }, // prettier-ignore
                                { offset: 0x174, bit: 0, label: "???" }, // prettier-ignore
                                { offset: 0x174, bit: 1, label: "???" }, // prettier-ignore
                                { offset: 0x174, bit: 2, label: "???" }, // prettier-ignore
                                { offset: 0x174, bit: 3, label: "???" }, // prettier-ignore
                                { offset: 0x174, bit: 4, label: "???" }, // prettier-ignore
                                { offset: 0x174, bit: 5, label: "???" }, // prettier-ignore
                                { offset: 0x174, bit: 6, label: "???" }, // prettier-ignore
                                { offset: 0x174, bit: 7, label: "???" }, // prettier-ignore
                              ],
                            },
                            {
                              name: "The Seven Tombs",
                              type: "bitflags",
                              flags: [
                                { offset: 0x175, bit: 0, label: "???" }, // prettier-ignore
                                { offset: 0x175, bit: 1, label: "???" }, // prettier-ignore
                                { offset: 0x175, bit: 2, label: "???" }, // prettier-ignore
                                { offset: 0x175, bit: 3, label: "???" }, // prettier-ignore
                                { offset: 0x175, bit: 4, label: "???" }, // prettier-ignore
                                { offset: 0x175, bit: 5, label: "???" }, // prettier-ignore
                                { offset: 0x175, bit: 6, label: "???" }, // prettier-ignore
                                { offset: 0x175, bit: 7, label: "???" }, // prettier-ignore
                                { offset: 0x176, bit: 0, label: "???" }, // prettier-ignore
                                { offset: 0x176, bit: 1, label: "???" }, // prettier-ignore
                                { offset: 0x176, bit: 2, label: "???" }, // prettier-ignore
                                { offset: 0x176, bit: 3, label: "???" }, // prettier-ignore
                                { offset: 0x176, bit: 4, label: "???" }, // prettier-ignore
                                { offset: 0x176, bit: 5, label: "???" }, // prettier-ignore
                                { offset: 0x176, bit: 6, label: "???" }, // prettier-ignore
                                { offset: 0x176, bit: 7, label: "???" }, // prettier-ignore
                              ],
                            },
                          ],
                        },
                      ],
                    },
                    {
                      name: "Act 3",
                      items: [
                        {
                          name: "General",
                          type: "bitflags",
                          flags: [
                            { offset: 0x179, bit: 0, label: "Introduction" }, // prettier-ignore
                            { offset: 0x187, bit: 0, label: "Act Completed" }, // prettier-ignore
                          ],
                        },
                        {
                          type: "section",
                          flex: true,
                          items: [
                            {
                              name: "The Golden Bird",
                              type: "bitflags",
                              flags: [
                                { offset: 0x181, bit: 0, label: "???" }, // prettier-ignore
                                { offset: 0x181, bit: 1, label: "???" }, // prettier-ignore
                                { offset: 0x181, bit: 2, label: "???" }, // prettier-ignore
                                { offset: 0x181, bit: 3, label: "???" }, // prettier-ignore
                                { offset: 0x181, bit: 4, label: "???" }, // prettier-ignore
                                { offset: 0x181, bit: 5, label: "???" }, // prettier-ignore
                                { offset: 0x181, bit: 6, label: "???" }, // prettier-ignore
                                { offset: 0x181, bit: 7, label: "???" }, // prettier-ignore
                                { offset: 0x182, bit: 0, label: "???" }, // prettier-ignore
                                { offset: 0x182, bit: 1, label: "???" }, // prettier-ignore
                                { offset: 0x182, bit: 2, label: "???" }, // prettier-ignore
                                { offset: 0x182, bit: 3, label: "???" }, // prettier-ignore
                                { offset: 0x182, bit: 4, label: "???" }, // prettier-ignore
                                { offset: 0x182, bit: 5, label: "???" }, // prettier-ignore
                                { offset: 0x182, bit: 6, label: "???" }, // prettier-ignore
                                { offset: 0x182, bit: 7, label: "???" }, // prettier-ignore
                              ],
                            },
                            {
                              name: "Blade of the Old Religion",
                              type: "bitflags",
                              flags: [
                                { offset: 0x17f, bit: 0, label: "???" }, // prettier-ignore
                                { offset: 0x17f, bit: 1, label: "???" }, // prettier-ignore
                                { offset: 0x17f, bit: 2, label: "???" }, // prettier-ignore
                                { offset: 0x17f, bit: 3, label: "???" }, // prettier-ignore
                                { offset: 0x17f, bit: 4, label: "???" }, // prettier-ignore
                                { offset: 0x17f, bit: 5, label: "???" }, // prettier-ignore
                                { offset: 0x17f, bit: 6, label: "???" }, // prettier-ignore
                                { offset: 0x17f, bit: 7, label: "???" }, // prettier-ignore
                                { offset: 0x180, bit: 0, label: "???" }, // prettier-ignore
                                { offset: 0x180, bit: 1, label: "???" }, // prettier-ignore
                                { offset: 0x180, bit: 2, label: "???" }, // prettier-ignore
                                { offset: 0x180, bit: 3, label: "???" }, // prettier-ignore
                                { offset: 0x180, bit: 4, label: "???" }, // prettier-ignore
                                { offset: 0x180, bit: 5, label: "???" }, // prettier-ignore
                                { offset: 0x180, bit: 6, label: "???" }, // prettier-ignore
                                { offset: 0x180, bit: 7, label: "???" }, // prettier-ignore
                              ],
                            },
                            {
                              name: "Khalim's Will",
                              type: "bitflags",
                              flags: [
                                { offset: 0x17d, bit: 0, label: "???" }, // prettier-ignore
                                { offset: 0x17d, bit: 1, label: "???" }, // prettier-ignore
                                { offset: 0x17d, bit: 2, label: "???" }, // prettier-ignore
                                { offset: 0x17d, bit: 3, label: "???" }, // prettier-ignore
                                { offset: 0x17d, bit: 4, label: "???" }, // prettier-ignore
                                { offset: 0x17d, bit: 5, label: "???" }, // prettier-ignore
                                { offset: 0x17d, bit: 6, label: "???" }, // prettier-ignore
                                { offset: 0x17d, bit: 7, label: "???" }, // prettier-ignore
                                { offset: 0x17e, bit: 0, label: "???" }, // prettier-ignore
                                { offset: 0x17e, bit: 1, label: "???" }, // prettier-ignore
                                { offset: 0x17e, bit: 2, label: "???" }, // prettier-ignore
                                { offset: 0x17e, bit: 3, label: "???" }, // prettier-ignore
                                { offset: 0x17e, bit: 4, label: "???" }, // prettier-ignore
                                { offset: 0x17e, bit: 5, label: "???" }, // prettier-ignore
                                { offset: 0x17e, bit: 6, label: "???" }, // prettier-ignore
                                { offset: 0x17e, bit: 7, label: "???" }, // prettier-ignore
                              ],
                            },
                          ],
                        },
                        {
                          type: "section",
                          flex: true,
                          items: [
                            {
                              name: "Lam Esen's Tome",
                              type: "bitflags",
                              flags: [
                                { offset: 0x17b, bit: 0, label: "???" }, // prettier-ignore
                                { offset: 0x17b, bit: 1, label: "???" }, // prettier-ignore
                                { offset: 0x17b, bit: 2, label: "???" }, // prettier-ignore
                                { offset: 0x17b, bit: 3, label: "???" }, // prettier-ignore
                                { offset: 0x17b, bit: 4, label: "???" }, // prettier-ignore
                                { offset: 0x17b, bit: 5, label: "???" }, // prettier-ignore
                                { offset: 0x17b, bit: 6, label: "???" }, // prettier-ignore
                                { offset: 0x17b, bit: 7, label: "???" }, // prettier-ignore
                                { offset: 0x17c, bit: 0, label: "???" }, // prettier-ignore
                                { offset: 0x17c, bit: 1, label: "???" }, // prettier-ignore
                                { offset: 0x17c, bit: 2, label: "???" }, // prettier-ignore
                                { offset: 0x17c, bit: 3, label: "???" }, // prettier-ignore
                                { offset: 0x17c, bit: 4, label: "???" }, // prettier-ignore
                                { offset: 0x17c, bit: 5, label: "???" }, // prettier-ignore
                                { offset: 0x17c, bit: 6, label: "???" }, // prettier-ignore
                                { offset: 0x17c, bit: 7, label: "???" }, // prettier-ignore
                              ],
                            },
                            {
                              name: "The Blackened Temple",
                              type: "bitflags",
                              flags: [
                                { offset: 0x183, bit: 0, label: "???" }, // prettier-ignore
                                { offset: 0x183, bit: 1, label: "???" }, // prettier-ignore
                                { offset: 0x183, bit: 2, label: "???" }, // prettier-ignore
                                { offset: 0x183, bit: 3, label: "???" }, // prettier-ignore
                                { offset: 0x183, bit: 4, label: "???" }, // prettier-ignore
                                { offset: 0x183, bit: 5, label: "???" }, // prettier-ignore
                                { offset: 0x183, bit: 6, label: "???" }, // prettier-ignore
                                { offset: 0x183, bit: 7, label: "???" }, // prettier-ignore
                                { offset: 0x184, bit: 0, label: "???" }, // prettier-ignore
                                { offset: 0x184, bit: 1, label: "???" }, // prettier-ignore
                                { offset: 0x184, bit: 2, label: "???" }, // prettier-ignore
                                { offset: 0x184, bit: 3, label: "???" }, // prettier-ignore
                                { offset: 0x184, bit: 4, label: "???" }, // prettier-ignore
                                { offset: 0x184, bit: 5, label: "???" }, // prettier-ignore
                                { offset: 0x184, bit: 6, label: "???" }, // prettier-ignore
                                { offset: 0x184, bit: 7, label: "???" }, // prettier-ignore
                              ],
                            },
                            {
                              name: "The Guardian",
                              type: "bitflags",
                              flags: [
                                { offset: 0x185, bit: 0, label: "???" }, // prettier-ignore
                                { offset: 0x185, bit: 1, label: "???" }, // prettier-ignore
                                { offset: 0x185, bit: 2, label: "???" }, // prettier-ignore
                                { offset: 0x185, bit: 3, label: "???" }, // prettier-ignore
                                { offset: 0x185, bit: 4, label: "???" }, // prettier-ignore
                                { offset: 0x185, bit: 5, label: "???" }, // prettier-ignore
                                { offset: 0x185, bit: 6, label: "???" }, // prettier-ignore
                                { offset: 0x185, bit: 7, label: "???" }, // prettier-ignore
                                { offset: 0x186, bit: 0, label: "???" }, // prettier-ignore
                                { offset: 0x186, bit: 1, label: "???" }, // prettier-ignore
                                { offset: 0x186, bit: 2, label: "???" }, // prettier-ignore
                                { offset: 0x186, bit: 3, label: "???" }, // prettier-ignore
                                { offset: 0x186, bit: 4, label: "???" }, // prettier-ignore
                                { offset: 0x186, bit: 5, label: "???" }, // prettier-ignore
                                { offset: 0x186, bit: 6, label: "???" }, // prettier-ignore
                                { offset: 0x186, bit: 7, label: "???" }, // prettier-ignore
                              ],
                            },
                          ],
                        },
                      ],
                    },
                    {
                      name: "Act 4",
                      items: [
                        {
                          name: "General",
                          type: "bitflags",
                          flags: [
                            { offset: 0x189, bit: 0, label: "Introduction" }, // prettier-ignore
                            { offset: 0x191, bit: 0, label: "Act Completed" }, // prettier-ignore
                          ],
                        },
                        {
                          type: "section",
                          flex: true,
                          items: [
                            {
                              name: "The Fallen Angel",
                              type: "bitflags",
                              flags: [
                                { offset: 0x18b, bit: 0, label: "???" }, // prettier-ignore
                                { offset: 0x18b, bit: 1, label: "???" }, // prettier-ignore
                                { offset: 0x18b, bit: 2, label: "???" }, // prettier-ignore
                                { offset: 0x18b, bit: 3, label: "???" }, // prettier-ignore
                                { offset: 0x18b, bit: 4, label: "???" }, // prettier-ignore
                                { offset: 0x18b, bit: 5, label: "???" }, // prettier-ignore
                                { offset: 0x18b, bit: 6, label: "???" }, // prettier-ignore
                                { offset: 0x18b, bit: 7, label: "???" }, // prettier-ignore
                                { offset: 0x18c, bit: 0, label: "???" }, // prettier-ignore
                                { offset: 0x18c, bit: 1, label: "???" }, // prettier-ignore
                                { offset: 0x18c, bit: 2, label: "???" }, // prettier-ignore
                                { offset: 0x18c, bit: 3, label: "???" }, // prettier-ignore
                                { offset: 0x18c, bit: 4, label: "???" }, // prettier-ignore
                                { offset: 0x18c, bit: 5, label: "???" }, // prettier-ignore
                                { offset: 0x18c, bit: 6, label: "???" }, // prettier-ignore
                                { offset: 0x18c, bit: 7, label: "???" }, // prettier-ignore
                              ],
                            },
                            {
                              name: "Hell's Forge",
                              type: "bitflags",
                              flags: [
                                { offset: 0x18f, bit: 0, label: "???" }, // prettier-ignore
                                { offset: 0x18f, bit: 1, label: "???" }, // prettier-ignore
                                { offset: 0x18f, bit: 2, label: "???" }, // prettier-ignore
                                { offset: 0x18f, bit: 3, label: "???" }, // prettier-ignore
                                { offset: 0x18f, bit: 4, label: "???" }, // prettier-ignore
                                { offset: 0x18f, bit: 5, label: "???" }, // prettier-ignore
                                { offset: 0x18f, bit: 6, label: "???" }, // prettier-ignore
                                { offset: 0x18f, bit: 7, label: "???" }, // prettier-ignore
                                { offset: 0x190, bit: 0, label: "???" }, // prettier-ignore
                                { offset: 0x190, bit: 1, label: "???" }, // prettier-ignore
                                { offset: 0x190, bit: 2, label: "???" }, // prettier-ignore
                                { offset: 0x190, bit: 3, label: "???" }, // prettier-ignore
                                { offset: 0x190, bit: 4, label: "???" }, // prettier-ignore
                                { offset: 0x190, bit: 5, label: "???" }, // prettier-ignore
                                { offset: 0x190, bit: 6, label: "???" }, // prettier-ignore
                                { offset: 0x190, bit: 7, label: "???" }, // prettier-ignore
                              ],
                            },
                            {
                              name: "Terror's End",
                              type: "bitflags",
                              flags: [
                                { offset: 0x18d, bit: 0, label: "???" }, // prettier-ignore
                                { offset: 0x18d, bit: 1, label: "???" }, // prettier-ignore
                                { offset: 0x18d, bit: 2, label: "???" }, // prettier-ignore
                                { offset: 0x18d, bit: 3, label: "???" }, // prettier-ignore
                                { offset: 0x18d, bit: 4, label: "???" }, // prettier-ignore
                                { offset: 0x18d, bit: 5, label: "???" }, // prettier-ignore
                                { offset: 0x18d, bit: 6, label: "???" }, // prettier-ignore
                                { offset: 0x18d, bit: 7, label: "???" }, // prettier-ignore
                                { offset: 0x18e, bit: 0, label: "???" }, // prettier-ignore
                                { offset: 0x18e, bit: 1, label: "???" }, // prettier-ignore
                                { offset: 0x18e, bit: 2, label: "???" }, // prettier-ignore
                                { offset: 0x18e, bit: 3, label: "???" }, // prettier-ignore
                                { offset: 0x18e, bit: 4, label: "???" }, // prettier-ignore
                                { offset: 0x18e, bit: 5, label: "???" }, // prettier-ignore
                                { offset: 0x18e, bit: 6, label: "???" }, // prettier-ignore
                                { offset: 0x18e, bit: 7, label: "???" }, // prettier-ignore
                              ],
                            },
                          ],
                        },
                      ],
                    },
                    {
                      name: "Act 5",
                      items: [
                        {
                          name: "General",
                          type: "bitflags",
                          flags: [
                            { offset: 0x199, bit: 0, label: "Introduction" }, // prettier-ignore
                          ],
                        },
                        {
                          type: "section",
                          flex: true,
                          items: [
                            {
                              name: "Siege on Harrogath",
                              type: "bitflags",
                              flags: [
                                { offset: 0x19f, bit: 0, label: "???" }, // prettier-ignore
                                { offset: 0x19f, bit: 1, label: "???" }, // prettier-ignore
                                { offset: 0x19f, bit: 2, label: "???" }, // prettier-ignore
                                { offset: 0x19f, bit: 3, label: "???" }, // prettier-ignore
                                { offset: 0x19f, bit: 4, label: "???" }, // prettier-ignore
                                { offset: 0x19f, bit: 5, label: "???" }, // prettier-ignore
                                { offset: 0x19f, bit: 6, label: "???" }, // prettier-ignore
                                { offset: 0x19f, bit: 7, label: "???" }, // prettier-ignore
                                { offset: 0x1a0, bit: 0, label: "???" }, // prettier-ignore
                                { offset: 0x1a0, bit: 1, label: "???" }, // prettier-ignore
                                { offset: 0x1a0, bit: 2, label: "???" }, // prettier-ignore
                                { offset: 0x1a0, bit: 3, label: "???" }, // prettier-ignore
                                { offset: 0x1a0, bit: 4, label: "???" }, // prettier-ignore
                                { offset: 0x1a0, bit: 5, label: "???" }, // prettier-ignore
                                { offset: 0x1a0, bit: 6, label: "???" }, // prettier-ignore
                                { offset: 0x1a0, bit: 7, label: "???" }, // prettier-ignore
                              ],
                            },
                            {
                              name: "Rescue on Mount Arreat",
                              type: "bitflags",
                              flags: [
                                { offset: 0x1a1, bit: 0, label: "???" }, // prettier-ignore
                                { offset: 0x1a1, bit: 1, label: "???" }, // prettier-ignore
                                { offset: 0x1a1, bit: 2, label: "???" }, // prettier-ignore
                                { offset: 0x1a1, bit: 3, label: "???" }, // prettier-ignore
                                { offset: 0x1a1, bit: 4, label: "???" }, // prettier-ignore
                                { offset: 0x1a1, bit: 5, label: "???" }, // prettier-ignore
                                { offset: 0x1a1, bit: 6, label: "???" }, // prettier-ignore
                                { offset: 0x1a1, bit: 7, label: "???" }, // prettier-ignore
                                { offset: 0x1a2, bit: 0, label: "???" }, // prettier-ignore
                                { offset: 0x1a2, bit: 1, label: "???" }, // prettier-ignore
                                { offset: 0x1a2, bit: 2, label: "???" }, // prettier-ignore
                                { offset: 0x1a2, bit: 3, label: "???" }, // prettier-ignore
                                { offset: 0x1a2, bit: 4, label: "???" }, // prettier-ignore
                                { offset: 0x1a2, bit: 5, label: "???" }, // prettier-ignore
                                { offset: 0x1a2, bit: 6, label: "???" }, // prettier-ignore
                                { offset: 0x1a2, bit: 7, label: "???" }, // prettier-ignore
                              ],
                            },
                            {
                              name: "Prison of Ice",
                              type: "bitflags",
                              flags: [
                                { offset: 0x1a3, bit: 0, label: "???" }, // prettier-ignore
                                { offset: 0x1a3, bit: 1, label: "???" }, // prettier-ignore
                                { offset: 0x1a3, bit: 2, label: "???" }, // prettier-ignore
                                { offset: 0x1a3, bit: 3, label: "???" }, // prettier-ignore
                                { offset: 0x1a3, bit: 4, label: "???" }, // prettier-ignore
                                { offset: 0x1a3, bit: 5, label: "???" }, // prettier-ignore
                                { offset: 0x1a3, bit: 6, label: "???" }, // prettier-ignore
                                { offset: 0x1a3, bit: 7, label: "???" }, // prettier-ignore
                                { offset: 0x1a4, bit: 0, label: "???" }, // prettier-ignore
                                { offset: 0x1a4, bit: 1, label: "???" }, // prettier-ignore
                                { offset: 0x1a4, bit: 2, label: "???" }, // prettier-ignore
                                { offset: 0x1a4, bit: 3, label: "???" }, // prettier-ignore
                                { offset: 0x1a4, bit: 4, label: "???" }, // prettier-ignore
                                { offset: 0x1a4, bit: 5, label: "???" }, // prettier-ignore
                                { offset: 0x1a4, bit: 6, label: "???" }, // prettier-ignore
                                { offset: 0x1a4, bit: 7, label: "???" }, // prettier-ignore
                              ],
                            },
                          ],
                        },
                        {
                          type: "section",
                          flex: true,
                          items: [
                            {
                              name: "Betrayal of Harrogath",
                              type: "bitflags",
                              flags: [
                                { offset: 0x1a5, bit: 0, label: "???" }, // prettier-ignore
                                { offset: 0x1a5, bit: 1, label: "???" }, // prettier-ignore
                                { offset: 0x1a5, bit: 2, label: "???" }, // prettier-ignore
                                { offset: 0x1a5, bit: 3, label: "???" }, // prettier-ignore
                                { offset: 0x1a5, bit: 4, label: "???" }, // prettier-ignore
                                { offset: 0x1a5, bit: 5, label: "???" }, // prettier-ignore
                                { offset: 0x1a5, bit: 6, label: "???" }, // prettier-ignore
                                { offset: 0x1a5, bit: 7, label: "???" }, // prettier-ignore
                                { offset: 0x1a6, bit: 0, label: "???" }, // prettier-ignore
                                { offset: 0x1a6, bit: 1, label: "???" }, // prettier-ignore
                                { offset: 0x1a6, bit: 2, label: "???" }, // prettier-ignore
                                { offset: 0x1a6, bit: 3, label: "???" }, // prettier-ignore
                                { offset: 0x1a6, bit: 4, label: "???" }, // prettier-ignore
                                { offset: 0x1a6, bit: 5, label: "???" }, // prettier-ignore
                                { offset: 0x1a6, bit: 6, label: "???" }, // prettier-ignore
                                { offset: 0x1a6, bit: 7, label: "???" }, // prettier-ignore
                              ],
                            },
                            {
                              name: "Rite of Passage",
                              type: "bitflags",
                              flags: [
                                { offset: 0x1a7, bit: 0, label: "???" }, // prettier-ignore
                                { offset: 0x1a7, bit: 1, label: "???" }, // prettier-ignore
                                { offset: 0x1a7, bit: 2, label: "???" }, // prettier-ignore
                                { offset: 0x1a7, bit: 3, label: "???" }, // prettier-ignore
                                { offset: 0x1a7, bit: 4, label: "???" }, // prettier-ignore
                                { offset: 0x1a7, bit: 5, label: "???" }, // prettier-ignore
                                { offset: 0x1a7, bit: 6, label: "???" }, // prettier-ignore
                                { offset: 0x1a7, bit: 7, label: "???" }, // prettier-ignore
                                { offset: 0x1a8, bit: 0, label: "???" }, // prettier-ignore
                                { offset: 0x1a8, bit: 1, label: "???" }, // prettier-ignore
                                { offset: 0x1a8, bit: 2, label: "???" }, // prettier-ignore
                                { offset: 0x1a8, bit: 3, label: "???" }, // prettier-ignore
                                { offset: 0x1a8, bit: 4, label: "???" }, // prettier-ignore
                                { offset: 0x1a8, bit: 5, label: "???" }, // prettier-ignore
                                { offset: 0x1a8, bit: 6, label: "???" }, // prettier-ignore
                                { offset: 0x1a8, bit: 7, label: "???" }, // prettier-ignore
                              ],
                            },
                            {
                              name: "Eve of Destruction",
                              type: "bitflags",
                              flags: [
                                { offset: 0x1a9, bit: 0, label: "???" }, // prettier-ignore
                                { offset: 0x1a9, bit: 1, label: "???" }, // prettier-ignore
                                { offset: 0x1a9, bit: 2, label: "???" }, // prettier-ignore
                                { offset: 0x1a9, bit: 3, label: "???" }, // prettier-ignore
                                { offset: 0x1a9, bit: 4, label: "???" }, // prettier-ignore
                                { offset: 0x1a9, bit: 5, label: "???" }, // prettier-ignore
                                { offset: 0x1a9, bit: 6, label: "???" }, // prettier-ignore
                                { offset: 0x1a9, bit: 7, label: "???" }, // prettier-ignore
                                { offset: 0x1aa, bit: 0, label: "???" }, // prettier-ignore
                                { offset: 0x1aa, bit: 1, label: "???" }, // prettier-ignore
                                { offset: 0x1aa, bit: 2, label: "???" }, // prettier-ignore
                                { offset: 0x1aa, bit: 3, label: "???" }, // prettier-ignore
                                { offset: 0x1aa, bit: 4, label: "???" }, // prettier-ignore
                                { offset: 0x1aa, bit: 5, label: "???" }, // prettier-ignore
                                { offset: 0x1aa, bit: 6, label: "???" }, // prettier-ignore
                                { offset: 0x1aa, bit: 7, label: "???" }, // prettier-ignore
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
        {
          name: "Waypoints",
          items: [
            {
              length: 0x18,
              type: "container",
              instanceType: "tabs",
              instances: 3,
              resource: "difficulties",
              flex: true,
              items: [
                {
                  name: "Act 1",
                  type: "bitflags",
                  flags: [
                    { offset: 0x283, bit: 0, label: "Rogue Encampment" }, // prettier-ignore
                    { offset: 0x283, bit: 1, label: "Cold Plains" }, // prettier-ignore
                    { offset: 0x283, bit: 2, label: "Stony Field" }, // prettier-ignore
                    { offset: 0x283, bit: 3, label: "Dark Wood" }, // prettier-ignore
                    { offset: 0x283, bit: 4, label: "Black Marsh" }, // prettier-ignore
                    { offset: 0x283, bit: 5, label: "Outer Cloister" }, // prettier-ignore
                    { offset: 0x283, bit: 6, label: "Jail Level 1" }, // prettier-ignore
                    { offset: 0x283, bit: 7, label: "Inner Cloister" }, // prettier-ignore
                    { offset: 0x284, bit: 0, label: "Catacombs Level 2" }, // prettier-ignore
                  ],
                },
                {
                  name: "Act 2",
                  type: "bitflags",
                  flags: [
                    { offset: 0x284, bit: 1, label: "Lut Gholein" }, // prettier-ignore
                    { offset: 0x284, bit: 2, label: "Sewers Level 2" }, // prettier-ignore
                    { offset: 0x284, bit: 3, label: "Dry Hills" }, // prettier-ignore
                    { offset: 0x284, bit: 4, label: "Halls of the Dead Level 2" }, // prettier-ignore
                    { offset: 0x284, bit: 5, label: "Far Oasis" }, // prettier-ignore
                    { offset: 0x284, bit: 6, label: "Lost City" }, // prettier-ignore
                    { offset: 0x284, bit: 7, label: "Palace Cellar Level 1" }, // prettier-ignore
                    { offset: 0x285, bit: 0, label: "Arcade Sanctuary" }, // prettier-ignore
                    { offset: 0x285, bit: 1, label: "Canyon of the Magi" }, // prettier-ignore
                  ],
                },
                {
                  name: "Act 3",
                  type: "bitflags",
                  flags: [
                    { offset: 0x285, bit: 2, label: "Kurast Docks" }, // prettier-ignore
                    { offset: 0x285, bit: 3, label: "Spider Forest" }, // prettier-ignore
                    { offset: 0x285, bit: 4, label: "Great Marsh" }, // prettier-ignore
                    { offset: 0x285, bit: 5, label: "Flayer Jungle" }, // prettier-ignore
                    { offset: 0x285, bit: 6, label: "Lower Kurast" }, // prettier-ignore
                    { offset: 0x285, bit: 7, label: "Kurast Bazaar" }, // prettier-ignore
                    { offset: 0x286, bit: 0, label: "Upper Kurast" }, // prettier-ignore
                    { offset: 0x286, bit: 1, label: "Travincal" }, // prettier-ignore
                    { offset: 0x286, bit: 2, label: "Durance of Hate Level 2" }, // prettier-ignore
                  ],
                },
                {
                  name: "Act 4",
                  type: "bitflags",
                  flags: [
                    { offset: 0x286, bit: 3, label: "The Pandemonium Fortress" }, // prettier-ignore
                    { offset: 0x286, bit: 4, label: "City of the Damned" }, // prettier-ignore
                    { offset: 0x286, bit: 5, label: "River of Flame" }, // prettier-ignore
                  ],
                },
                {
                  name: "Act 5",
                  type: "bitflags",
                  flags: [
                    { offset: 0x286, bit: 6, label: "Harrogath" }, // prettier-ignore
                    { offset: 0x286, bit: 7, label: "Frigid Highlands" }, // prettier-ignore
                    { offset: 0x287, bit: 0, label: "Arreat Plateau" }, // prettier-ignore
                    { offset: 0x287, bit: 1, label: "Crystalline Passage" }, // prettier-ignore
                    { offset: 0x287, bit: 2, label: "Glacial Trail" }, // prettier-ignore
                    { offset: 0x287, bit: 3, label: "Halls of Pain" }, // prettier-ignore
                    { offset: 0x287, bit: 4, label: "Frozen Tundra" }, // prettier-ignore
                    { offset: 0x287, bit: 5, label: "The Ancients' Way" }, // prettier-ignore
                    { offset: 0x287, bit: 6, label: "Worldstone Keep Level 2" }, // prettier-ignore
                  ],
                },
              ],
            },
          ],
        },
        {
          name: "Events",
          planned: true,
          items: [
            {
              length: 0x8,
              type: "container",
              instanceType: "tabs",
              instances: 3,
              resource: "difficulties",
              flex: true,
              items: [
                {
                  name: "Introductions",
                  type: "bitflags",
                  flags: [
                    { offset: 0x2cd, bit: 0, label: "???" }, // prettier-ignore
                    { offset: 0x2cd, bit: 1, label: "Gheed" }, // prettier-ignore
                    { offset: 0x2cd, bit: 2, label: "???" }, // prettier-ignore
                    { offset: 0x2cd, bit: 3, label: "Kashya" }, // prettier-ignore
                    { offset: 0x2cd, bit: 4, label: "???" }, // prettier-ignore
                    { offset: 0x2cd, bit: 5, label: "Charsi" }, // prettier-ignore
                    { offset: 0x2cd, bit: 6, label: "???" }, // prettier-ignore
                    { offset: 0x2cd, bit: 7, label: "???" }, // prettier-ignore
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
    classes: {
      0x0: "Amazon",
      0x1: "Sorceress",
      0x2: "Necromancer",
      0x4: "Barbarian",
      0x5: "Druid",
      0x6: "Assassin",
    },
    difficulties: {
      0x0: "Normal",
      0x1: "Nightmare",
      0x2: "Hell",
    },
    progressions: {
      0x0: "-",
      0x5: "Normal Completed",
      0xa: "Nightmare Completed",
      0xf: "Hell Completed",
    },
  },
};

export default template;
