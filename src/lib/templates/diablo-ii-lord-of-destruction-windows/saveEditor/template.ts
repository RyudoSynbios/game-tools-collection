import type { GameJson, ItemTab } from "$lib/types";

import { ITEM_LENGTH } from "./utils/constants";
import { skillTrees } from "./utils/resource";

const template: GameJson = {
  validator: {
    regions: {
      world: {
        $and: [
          { 0x0: [0x55, 0xaa, 0x55, 0xaa] },
          { 0x4: [0x60] },
          { 0x14f: [0x57] },
        ],
      },
    },
    text: "Drag 'n' drop here or click to add a save file.",
    hint: "Only works with Diablo II: Lord of Destruction v1.10 or above (.d2s files).",
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
              name: "Save Size",
              offset: 0x8,
              type: "variable",
              dataType: "uint32",
              hidden: true,
            },
            {
              name: "Timestamp",
              offset: 0x30,
              type: "variable",
              dataType: "uint32",
              hidden: true,
            },
            {
              name: "Character",
              type: "bitflags",
              flags: [
                { offset: 0x24, bit: 0, label: "???", hidden: true },
                { offset: 0x24, bit: 1, label: "???", hidden: true },
                { offset: 0x24, bit: 2, label: "Harcore" },
                { offset: 0x24, bit: 3, label: "???", hidden: true },
                { offset: 0x24, bit: 4, label: "Has been dead once" },
                { offset: 0x24, bit: 5, label: "Expansion Character", disabled: true },
                { offset: 0x24, bit: 6, label: "???", hidden: true },
                { offset: 0x24, bit: 7, label: "???", hidden: true },
              ],
            },
            {
              name: "Progression",
              offset: 0x25,
              type: "variable",
              dataType: "uint8",
              resource: "progressions",
              size: "lg",
              autocomplete: true,
            },
            {
              id: "gold",
              name: "Gold",
              dataViewAltKey: "heroStatus",
              offset: 0x38,
              type: "variable",
              dataType: "uint32",
              max: 990000,
            },
            {
              name: "Gold in Stash",
              dataViewAltKey: "heroStatus",
              offset: 0x3c,
              type: "variable",
              dataType: "uint32",
              max: 2500000,
            },
          ],
        },
        {
          name: "Hero",
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
                          name: "Name",
                          offset: 0x14,
                          length: 0xf,
                          type: "variable",
                          dataType: "string",
                          letterDataType: "uint8",
                          endCode: 0x0,
                          regex: "[A-Za-z]",
                          test: true,
                        },
                        {
                          id: "class",
                          name: "Class",
                          offset: 0x28,
                          type: "variable",
                          dataType: "uint8",
                          resource: "classes",
                          disabled: true,
                        },
                        {
                          id: "level",
                          name: "Level",
                          dataViewAltKey: "heroStatus",
                          offset: 0x30,
                          type: "variable",
                          dataType: "uint8",
                          min: 1,
                          max: 99,
                          test: true,
                        },
                        {
                          name: "Level (Save Preview)",
                          offset: 0x2b,
                          type: "variable",
                          dataType: "uint8",
                          hidden: true,
                        },
                        {
                          name: "Experience",
                          dataViewAltKey: "heroStatus",
                          offset: 0x34,
                          type: "variable",
                          dataType: "uint32",
                          max: 3520485254,
                        },
                        {
                          name: "Status Points Remaining",
                          dataViewAltKey: "heroStatus",
                          offset: 0x10,
                          type: "variable",
                          dataType: "uint16",
                          max: 1023,
                        },
                      ],
                    },
                    {
                      type: "section",
                      flex: true,
                      items: [
                        {
                          name: "Strength",
                          dataViewAltKey: "heroStatus",
                          offset: 0x0,
                          type: "variable",
                          dataType: "uint16",
                          max: 1023,
                        },
                        {
                          name: "Dexterity",
                          dataViewAltKey: "heroStatus",
                          offset: 0x8,
                          type: "variable",
                          dataType: "uint16",
                          max: 1023,
                        },
                        {
                          name: "Vitality",
                          dataViewAltKey: "heroStatus",
                          offset: 0xc,
                          type: "variable",
                          dataType: "uint16",
                          max: 1023,
                        },
                        {
                          name: "Energy",
                          dataViewAltKey: "heroStatus",
                          offset: 0x4,
                          type: "variable",
                          dataType: "uint16",
                          max: 1023,
                        },
                      ],
                    },
                    {
                      type: "section",
                      flex: true,
                      items: [
                        {
                          name: "Life",
                          type: "group",
                          mode: "fraction",
                          items: [
                            {
                              dataViewAltKey: "heroStatus",
                              offset: 0x18,
                              type: "variable",
                              dataType: "uint16",
                              max: 8191,
                            },
                            {
                              dataViewAltKey: "heroStatus",
                              offset: 0x1c,
                              type: "variable",
                              dataType: "uint16",
                              max: 8191,
                            },
                          ],
                        },
                        {
                          name: "Mana",
                          type: "group",
                          mode: "fraction",
                          items: [
                            {
                              dataViewAltKey: "heroStatus",
                              offset: 0x20,
                              type: "variable",
                              dataType: "uint16",
                              max: 8191,
                            },
                            {
                              dataViewAltKey: "heroStatus",
                              offset: 0x24,
                              type: "variable",
                              dataType: "uint16",
                              max: 8191,
                            },
                          ],
                        },
                        {
                          name: "Stamina",
                          type: "group",
                          mode: "fraction",
                          items: [
                            {
                              dataViewAltKey: "heroStatus",
                              offset: 0x28,
                              type: "variable",
                              dataType: "uint16",
                              max: 8191,
                            },
                            {
                              dataViewAltKey: "heroStatus",
                              offset: 0x2c,
                              type: "variable",
                              dataType: "uint16",
                              max: 8191,
                            },
                          ],
                        },
                      ],
                    },
                  ],
                },
                {
                  name: "Skills",
                  items: [
                    {
                      type: "tabs",
                      vertical: true,
                      items: [
                        {
                          name: "General",
                          items: [
                            {
                              name: "Skill Choices Remaining",
                              dataViewAltKey: "heroStatus",
                              offset: 0x14,
                              type: "variable",
                              dataType: "uint8",
                            },
                          ],
                        },
                        ...skillTrees.map(
                          (tree) =>
                            ({
                              id: `skill-${tree.class}`,
                              name: tree.name,
                              flex: true,
                              items: tree.skills.map((skill) => ({
                                name: skill.name,
                                dataViewAltKey: "heroSkills",
                                offset: skill.index,
                                type: "variable",
                                dataType: "uint8",
                                max: 20,
                              })),
                            }) as ItemTab,
                        ),
                      ],
                    },
                  ],
                },
              ],
            },
          ],
        },
        {
          name: "Inventory",
          planned: true,
          items: [
            {
              id: "inventory",
              length: ITEM_LENGTH * 0x4,
              type: "container",
              instanceType: "tabs",
              instances: 0,
              resource: "inventoryNames",
              vertical: true,
              items: [
                {
                  type: "section",
                  flex: true,
                  items: [
                    {
                      id: "itemCode",
                      name: "Item",
                      dataViewAltKey: "inventory",
                      offset: 0x5c,
                      type: "variable",
                      dataType: "uint32",
                      resource: "itemCodes",
                      autocomplete: true,
                    },
                    {
                      name: "Location",
                      dataViewAltKey: "inventory",
                      offset: 0x48,
                      type: "variable",
                      dataType: "uint8",
                      resource: "itemLocations",
                    },
                    {
                      name: "Equipped Location",
                      dataViewAltKey: "inventory",
                      offset: 0x4c,
                      type: "variable",
                      dataType: "uint8",
                      resource: "itemEquippedLocations",
                    },
                    {
                      name: "Stored Location",
                      dataViewAltKey: "inventory",
                      offset: 0x58,
                      type: "variable",
                      dataType: "uint8",
                      resource: "itemStoredLocation",
                    },
                  ],
                },
                {
                  type: "section",
                  flex: true,
                  items: [
                    {
                      name: "Column",
                      dataViewAltKey: "inventory",
                      offset: 0x50,
                      type: "variable",
                      dataType: "uint8",
                      operations: [{ "+": 1 }],
                      min: 1,
                      max: 10,
                    },
                    {
                      name: "Row",
                      dataViewAltKey: "inventory",
                      offset: 0x54,
                      type: "variable",
                      dataType: "uint8",
                      operations: [{ "+": 1 }],
                      min: 1,
                      max: 8,
                    },
                  ],
                },
                {
                  type: "section",
                  flex: true,
                  items: [
                    {
                      type: "section",
                      background: true,
                      items: [
                        {
                          name: "Is Identified",
                          dataViewAltKey: "inventory",
                          offset: 0x4,
                          type: "variable",
                          dataType: "boolean",
                        },
                        {
                          name: "Is Socketed",
                          dataViewAltKey: "inventory",
                          offset: 0xc,
                          type: "variable",
                          dataType: "boolean",
                        },
                        {
                          name: "Obtained on Last Game",
                          dataViewAltKey: "inventory",
                          offset: 0x14,
                          type: "variable",
                          dataType: "boolean",
                        },
                        {
                          name: "Is Player Ear",
                          dataViewAltKey: "inventory",
                          offset: 0x1c,
                          type: "variable",
                          dataType: "boolean",
                        },
                        {
                          name: "Is Start Item",
                          dataViewAltKey: "inventory",
                          offset: 0x20,
                          type: "variable",
                          dataType: "boolean",
                        },
                        {
                          name: "Is Simple Item",
                          dataViewAltKey: "inventory",
                          offset: 0x28,
                          type: "variable",
                          dataType: "boolean",
                          hidden: true,
                        },
                        {
                          name: "Is Ethereal",
                          dataViewAltKey: "inventory",
                          offset: 0x2c,
                          type: "variable",
                          dataType: "boolean",
                        },
                        {
                          name: "Is Personalized",
                          dataViewAltKey: "inventory",
                          offset: 0x34,
                          type: "variable",
                          dataType: "boolean",
                        },
                      ],
                    },
                    {
                      name: "Attached Gems",
                      dataViewAltKey: "inventory",
                      offset: 0x60,
                      type: "variable",
                      dataType: "uint8",
                      max: 6,
                    },
                    {
                      name: "Unknown 0",
                      dataViewAltKey: "inventory",
                      offset: 0x0,
                      type: "variable",
                      dataType: "uint8",
                      hidden: true,
                    },
                    {
                      name: "Unknown 2",
                      dataViewAltKey: "inventory",
                      offset: 0x8,
                      type: "variable",
                      dataType: "uint8",
                      hidden: true,
                    },
                    {
                      name: "Unknown 4",
                      dataViewAltKey: "inventory",
                      offset: 0x10,
                      type: "variable",
                      dataType: "uint8",
                      hidden: true,
                    },
                    {
                      name: "Unknown 6",
                      dataViewAltKey: "inventory",
                      offset: 0x18,
                      type: "variable",
                      dataType: "uint8",
                      hidden: true,
                    },
                    {
                      name: "Unknown 9",
                      dataViewAltKey: "inventory",
                      offset: 0x24,
                      type: "variable",
                      dataType: "uint8",
                      hidden: true,
                    },
                    {
                      name: "Unknown C",
                      dataViewAltKey: "inventory",
                      offset: 0x30,
                      type: "variable",
                      dataType: "uint8",
                      hidden: true,
                    },
                    {
                      name: "Unknown E",
                      dataViewAltKey: "inventory",
                      offset: 0x38,
                      type: "variable",
                      dataType: "uint8",
                      hidden: true,
                    },
                    {
                      name: "Unknown F",
                      dataViewAltKey: "inventory",
                      offset: 0x3c,
                      type: "variable",
                      dataType: "uint8",
                      hidden: true,
                    },
                    {
                      name: "Unknown 10",
                      dataViewAltKey: "inventory",
                      offset: 0x40,
                      type: "variable",
                      dataType: "uint8",
                      hidden: true,
                    },
                    {
                      name: "Unknown 11",
                      dataViewAltKey: "inventory",
                      offset: 0x44,
                      type: "variable",
                      dataType: "uint16",
                      hidden: true,
                    },
                  ],
                },
                {
                  type: "section",
                  flex: true,
                  items: [
                    {
                      name: "ID",
                      dataViewAltKey: "inventory",
                      offset: 0x64,
                      type: "variable",
                      dataType: "uint32",
                      hex: true,
                      hidden: true,
                    },
                    {
                      name: "Level",
                      dataViewAltKey: "inventory",
                      offset: 0x68,
                      type: "variable",
                      dataType: "uint8",
                      // max:
                    },
                    {
                      name: "Quality",
                      dataViewAltKey: "inventory",
                      offset: 0x6c,
                      type: "variable",
                      dataType: "uint8",
                      resource: "itemQualities",
                    },
                  ],
                },
              ],
            },
          ],
        },
        {
          name: "Mercenary",
          planned: true,
          items: [],
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
                            { offset: 0x159, bit: 0, label: "Introduction" },
                            { offset: 0x167, bit: 0, label: "Act Completed" },
                          ],
                        },
                        {
                          type: "section",
                          flex: true,
                          items: [
                            {
                              name: "Den of Evil",
                              type: "bitflags",
                              flags: [
                                { offset: 0x15b, bit: 2, label: "Quest given by Akara" },
                                { offset: 0x15b, bit: 3, label: "Exit the Rogue Encampement" },
                                { offset: 0x15b, bit: 4, label: "Entering the Den of Evil" },
                                { offset: 0x15b, bit: 1, label: "All monsters killed" },
                                { offset: 0x15b, bit: 0, label: "Quest completed", separator: true },
                                { offset: 0x15b, bit: 5, label: "???", hidden: true },
                                { offset: 0x15b, bit: 6, label: "???", hidden: true },
                                { offset: 0x15b, bit: 7, label: "???", hidden: true },
                                { offset: 0x15c, bit: 0, label: "???", hidden: true },
                                { offset: 0x15c, bit: 1, label: "???", hidden: true },
                                { offset: 0x15c, bit: 2, label: "???", hidden: true },
                                { offset: 0x15c, bit: 3, label: "???", hidden: true },
                                { offset: 0x15c, bit: 4, label: "Closing animation seen", hidden: true },
                                { offset: 0x15c, bit: 5, label: "Completed in current game", hidden: true },
                                { offset: 0x15c, bit: 6, label: "???", hidden: true },
                                { offset: 0x15c, bit: 7, label: "Quest can't be completed" },
                              ],
                            },
                            {
                              name: "Sisters' Burial Grounds",
                              type: "bitflags",
                              flags: [
                                { offset: 0x15d, bit: 2, label: "Quest given by Kashya" },
                                { offset: 0x15d, bit: 3, label: "Exit the Rogue Encampment" },
                                { offset: 0x15d, bit: 4, label: "Entering the Burial Grounds" },
                                { offset: 0x15d, bit: 1, label: "Blood Raven killed" },
                                { offset: 0x15d, bit: 0, label: "Quest completed", separator: true },
                                { offset: 0x15d, bit: 5, label: "???", hidden: true },
                                { offset: 0x15d, bit: 6, label: "???", hidden: true },
                                { offset: 0x15d, bit: 7, label: "???", hidden: true },
                                { offset: 0x15e, bit: 0, label: "???", hidden: true },
                                { offset: 0x15e, bit: 1, label: "???", hidden: true },
                                { offset: 0x15e, bit: 2, label: "???", hidden: true },
                                { offset: 0x15e, bit: 3, label: "???", hidden: true },
                                { offset: 0x15e, bit: 4, label: "Closing animation seen", hidden: true },
                                { offset: 0x15e, bit: 5, label: "Completed in current game", hidden: true },
                                { offset: 0x15e, bit: 6, label: "???", hidden: true },
                                { offset: 0x15e, bit: 7, label: "Quest can't be completed" },
                              ],
                            },
                            {
                              name: "The Search for Cain",
                              type: "bitflags",
                              flags: [
                                { offset: 0x161, bit: 2, label: "Quest given by Akara" },
                                { offset: 0x161, bit: 3, label: "Scroll of Inifuss obtained" },
                                { offset: 0x161, bit: 4, label: "Portal to Tristram open" },
                                { offset: 0x161, bit: 1, label: "Deckard Cain rescued by hero" },
                                { offset: 0x162, bit: 6, label: "Deckard Cain rescued by the Rogues" },
                                { offset: 0x161, bit: 0, label: "Quest completed", separator: true },
                                { offset: 0x162, bit: 2, label: "Cow Level completed", separator: true },
                                { offset: 0x161, bit: 5, label: "???", hidden: true },
                                { offset: 0x161, bit: 6, label: "???", hidden: true },
                                { offset: 0x161, bit: 7, label: "???", hidden: true },
                                { offset: 0x162, bit: 0, label: "???", hidden: true },
                                { offset: 0x162, bit: 1, label: "???", hidden: true },
                                { offset: 0x162, bit: 3, label: "???", hidden: true },
                                { offset: 0x162, bit: 4, label: "Closing animation seen", hidden: true },
                                { offset: 0x162, bit: 5, label: "Completed in current game", hidden: true },
                                { offset: 0x162, bit: 7, label: "Quest can't be completed" },
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
                                { offset: 0x163, bit: 2, label: "The Moldy Tome read" },
                                { offset: 0x163, bit: 6, label: "Entering the Forgotten Tower" },
                                { offset: 0x163, bit: 4, label: "Entering the Tower Cellar Level 5" },
                                { offset: 0x163, bit: 0, label: "Quest completed", separator: true },
                                { offset: 0x163, bit: 1, label: "???", hidden: true },
                                { offset: 0x163, bit: 3, label: "???", hidden: true },
                                { offset: 0x163, bit: 5, label: "???", hidden: true },
                                { offset: 0x163, bit: 7, label: "???", hidden: true },
                                { offset: 0x164, bit: 0, label: "???", hidden: true },
                                { offset: 0x164, bit: 1, label: "???", hidden: true },
                                { offset: 0x164, bit: 2, label: "???", hidden: true },
                                { offset: 0x164, bit: 3, label: "???", hidden: true },
                                { offset: 0x164, bit: 4, label: "Closing animation seen", hidden: true },
                                { offset: 0x164, bit: 5, label: "Completed in current game", hidden: true },
                                { offset: 0x164, bit: 6, label: "???", hidden: true },
                                { offset: 0x164, bit: 7, label: "Quest can't be completed" },
                              ],
                            },
                            {
                              name: "Tools of the Trade",
                              type: "bitflags",
                              flags: [
                                { offset: 0x15f, bit: 2, label: "Quest given by Charsi" },
                                { offset: 0x15f, bit: 3, label: "Exit the Rogue Encampment" },
                                { offset: 0x15f, bit: 6, label: "Horadric Malus obtained" },
                                { offset: 0x15f, bit: 1, label: "Charsi offers to imbuing an item" },
                                { offset: 0x15f, bit: 0, label: "Quest completed", separator: true },
                                { offset: 0x15f, bit: 4, label: "???", hidden: true },
                                { offset: 0x15f, bit: 5, label: "???", hidden: true },
                                { offset: 0x15f, bit: 7, label: "???", hidden: true },
                                { offset: 0x160, bit: 0, label: "???", hidden: true },
                                { offset: 0x160, bit: 1, label: "???", hidden: true },
                                { offset: 0x160, bit: 2, label: "???", hidden: true },
                                { offset: 0x160, bit: 3, label: "???", hidden: true },
                                { offset: 0x160, bit: 4, label: "Closing animation seen", hidden: true },
                                { offset: 0x160, bit: 5, label: "Completed in current game", hidden: true },
                                { offset: 0x160, bit: 6, label: "???", hidden: true },
                                { offset: 0x160, bit: 7, label: "Quest can't be completed" },
                              ],
                            },
                            {
                              name: "Sisters to the Slaughter",
                              type: "bitflags",
                              flags: [
                                { offset: 0x165, bit: 2, label: "Quest given by Deckard Cain" },
                                { offset: 0x165, bit: 3, label: "Exit the Rogue Encampment" },
                                { offset: 0x165, bit: 4, label: "Entering the Catacombs Level 4" },
                                { offset: 0x165, bit: 1, label: "Andariel killed" },
                                { offset: 0x165, bit: 0, label: "Quest completed", separator: true },
                                { offset: 0x165, bit: 5, label: "???", hidden: true },
                                { offset: 0x165, bit: 6, label: "???", hidden: true },
                                { offset: 0x165, bit: 7, label: "???", hidden: true },
                                { offset: 0x166, bit: 0, label: "???", hidden: true },
                                { offset: 0x166, bit: 1, label: "???", hidden: true },
                                { offset: 0x166, bit: 2, label: "???", hidden: true },
                                { offset: 0x166, bit: 3, label: "???", hidden: true },
                                { offset: 0x166, bit: 4, label: "Closing animation seen", hidden: true },
                                { offset: 0x166, bit: 5, label: "Completed in current game", hidden: true },
                                { offset: 0x166, bit: 6, label: "???", hidden: true },
                                { offset: 0x166, bit: 7, label: "Quest can't be completed" },
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
                            { offset: 0x169, bit: 0, label: "Introduction" },
                            { offset: 0x177, bit: 0, label: "Act Completed" },
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
                                { offset: 0x16b, bit: 2, label: "Quest given by Atma" },
                                { offset: 0x16b, bit: 3, label: "Exiting Lut Gholein" },
                                { offset: 0x16b, bit: 4, label: "Entering the Sewers Level 3" },
                                { offset: 0x16b, bit: 5, label: "Book of Skill usable" },
                                { offset: 0x16b, bit: 1, label: "Radament killed" },
                                { offset: 0x16b, bit: 0, label: "Quest completed", separator: true },
                                { offset: 0x16b, bit: 6, label: "???", hidden: true },
                                { offset: 0x16b, bit: 7, label: "???", hidden: true },
                                { offset: 0x16c, bit: 0, label: "???", hidden: true },
                                { offset: 0x16c, bit: 1, label: "???", hidden: true },
                                { offset: 0x16c, bit: 2, label: "???", hidden: true },
                                { offset: 0x16c, bit: 3, label: "???", hidden: true },
                                { offset: 0x16c, bit: 4, label: "Closing animation seen", hidden: true },
                                { offset: 0x16c, bit: 5, label: "Completed in current game", hidden: true },
                                { offset: 0x16c, bit: 6, label: "???", hidden: true },
                                { offset: 0x16c, bit: 7, label: "Quest can't be completed" },
                              ],
                            },
                            {
                              name: "The Horadric Staff",
                              type: "bitflags",
                              flags: [
                                { offset: 0x16d, bit: 3, label: "Horadric Scroll presented to Deckard Cain" },
                                { offset: 0x16d, bit: 6, label: "Horadric Cube presented to Deckard Cain" },
                                { offset: 0x16d, bit: 5, label: "Staff of King presented to Deckard Cain" },
                                { offset: 0x16d, bit: 4, label: "Viper Amulet presented to Deckard Cain" },
                                { offset: 0x16e, bit: 3, label: "Horadric Staff transmuted" },
                                { offset: 0x16e, bit: 2, label: "Horadric Staff presented to Deckard Cain" },
                                { offset: 0x16d, bit: 0, label: "Quest completed", separator: true },
                                { offset: 0x16d, bit: 1, label: "???", hidden: true },
                                { offset: 0x16d, bit: 2, label: "???", hidden: true },
                                { offset: 0x16d, bit: 7, label: "???", hidden: true },
                                { offset: 0x16e, bit: 0, label: "???", hidden: true },
                                { offset: 0x16e, bit: 1, label: "???", hidden: true },
                                { offset: 0x16e, bit: 4, label: "Closing animation seen", hidden: true },
                                { offset: 0x16e, bit: 5, label: "Completed in current game", hidden: true },
                                { offset: 0x16e, bit: 6, label: "???", hidden: true },
                                { offset: 0x16e, bit: 7, label: "Quest can't be completed" },
                              ],
                            },
                            {
                              name: "Tainted Sun",
                              type: "bitflags",
                              flags: [
                                { offset: 0x16f, bit: 3, label: "Staff of Kings obtained" },
                                { offset: 0x16f, bit: 2, label: "Amulet of the Viper obtained" },
                                { offset: 0x16f, bit: 0, label: "Quest completed", separator: true },
                                { offset: 0x16f, bit: 1, label: "???", hidden: true },
                                { offset: 0x16f, bit: 4, label: "???", hidden: true },
                                { offset: 0x16f, bit: 5, label: "???", hidden: true },
                                { offset: 0x16f, bit: 6, label: "???", hidden: true },
                                { offset: 0x16f, bit: 7, label: "???", hidden: true },
                                { offset: 0x170, bit: 0, label: "???", hidden: true },
                                { offset: 0x170, bit: 1, label: "???", hidden: true },
                                { offset: 0x170, bit: 2, label: "???", hidden: true },
                                { offset: 0x170, bit: 3, label: "???", hidden: true },
                                { offset: 0x170, bit: 4, label: "Closing animation seen", hidden: true },
                                { offset: 0x170, bit: 5, label: "Completed in current game", hidden: true },
                                { offset: 0x170, bit: 6, label: "???", hidden: true },
                                { offset: 0x170, bit: 7, label: "Quest can't be completed" },
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
                                { offset: 0x171, bit: 2, label: "Quest given by Drognan" },
                                { offset: 0x171, bit: 7, label: "Way blocked by Kaelan" },
                                { offset: 0x171, bit: 3, label: "Talk with Jerhyn" },
                                { offset: 0x172, bit: 0, label: "Kaelan allowed passage" },
                                { offset: 0x171, bit: 4, label: "Entering the Harem Level 1" },
                                { offset: 0x171, bit: 5, label: "Entering the Arcane Sanctuary" },
                                { offset: 0x171, bit: 1, label: "Horazon's Journal read" },
                                { offset: 0x171, bit: 0, label: "Quest completed", separator: true },
                                { offset: 0x171, bit: 6, label: "???", hidden: true },
                                { offset: 0x172, bit: 1, label: "???", hidden: true },
                                { offset: 0x172, bit: 2, label: "???", hidden: true },
                                { offset: 0x172, bit: 3, label: "???", hidden: true },
                                { offset: 0x172, bit: 4, label: "Closing animation seen", hidden: true },
                                { offset: 0x172, bit: 5, label: "Completed in current game", hidden: true },
                                { offset: 0x172, bit: 6, label: "???", hidden: true },
                                { offset: 0x172, bit: 7, label: "Quest can't be completed" },
                              ],
                            },
                            {
                              name: "The Summoner",
                              type: "bitflags",
                              flags: [
                                { offset: 0x173, bit: 2, label: "Summoner seen" },
                                { offset: 0x173, bit: 1, label: "Summoner killed" },
                                { offset: 0x173, bit: 0, label: "Quest completed", separator: true },
                                { offset: 0x173, bit: 3, label: "???", hidden: true },
                                { offset: 0x173, bit: 4, label: "???", hidden: true },
                                { offset: 0x173, bit: 5, label: "???", hidden: true },
                                { offset: 0x173, bit: 6, label: "???", hidden: true },
                                { offset: 0x173, bit: 7, label: "???", hidden: true },
                                { offset: 0x174, bit: 0, label: "???", hidden: true },
                                { offset: 0x174, bit: 1, label: "???", hidden: true },
                                { offset: 0x174, bit: 2, label: "???", hidden: true },
                                { offset: 0x174, bit: 3, label: "???", hidden: true },
                                { offset: 0x174, bit: 4, label: "Closing animation seen", hidden: true },
                                { offset: 0x174, bit: 5, label: "Completed in current game", hidden: true },
                                { offset: 0x174, bit: 6, label: "???", hidden: true },
                                { offset: 0x174, bit: 7, label: "Quest can't be completed" },
                              ],
                            },
                            {
                              name: "The Seven Tombs",
                              type: "bitflags",
                              flags: [
                                { offset: 0x175, bit: 2, label: "Quest given by Jerhyn" },
                                { offset: 0x175, bit: 5, label: "Duriel killed" },
                                { offset: 0x175, bit: 3, label: "Tyrael rescued" },
                                { offset: 0x175, bit: 4, label: "Talk with Jerhyn" },
                                { offset: 0x175, bit: 0, label: "Quest completed", separator: true },
                                { offset: 0x175, bit: 1, label: "???", hidden: true },
                                { offset: 0x175, bit: 6, label: "???", hidden: true },
                                { offset: 0x175, bit: 7, label: "???", hidden: true },
                                { offset: 0x176, bit: 0, label: "???", hidden: true },
                                { offset: 0x176, bit: 1, label: "???", hidden: true },
                                { offset: 0x176, bit: 2, label: "???", hidden: true },
                                { offset: 0x176, bit: 3, label: "???", hidden: true },
                                { offset: 0x176, bit: 4, label: "Closing animation seen", hidden: true },
                                { offset: 0x176, bit: 5, label: "Completed in current game", hidden: true },
                                { offset: 0x176, bit: 6, label: "???", hidden: true },
                                { offset: 0x176, bit: 7, label: "Quest can't be completed" },
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
                            { offset: 0x179, bit: 0, label: "Introduction" },
                            { offset: 0x187, bit: 0, label: "Act Completed" },
                            { offset: 0x199, bit: 0, label: "Related to Dark Wanderer on Act 3", hidden: true },
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
                                { offset: 0x181, bit: 6, label: "Jade Figurine obtained" },
                                { offset: 0x181, bit: 2, label: "Jade Figurine presented to Deckard Cain" },
                                { offset: 0x181, bit: 4, label: "Golden Bird presented to Deckard Cain" },
                                { offset: 0x181, bit: 1, label: "Golden Bird given to Alkor" },
                                { offset: 0x181, bit: 5, label: "Potion of Life usable" },
                                { offset: 0x181, bit: 0, label: "Quest completed", separator: true },
                                { offset: 0x181, bit: 3, label: "???", hidden: true },
                                { offset: 0x181, bit: 7, label: "???", hidden: true },
                                { offset: 0x182, bit: 0, label: "???", hidden: true },
                                { offset: 0x182, bit: 1, label: "???", hidden: true },
                                { offset: 0x182, bit: 2, label: "???", hidden: true },
                                { offset: 0x182, bit: 3, label: "???", hidden: true },
                                { offset: 0x182, bit: 4, label: "Closing animation seen", hidden: true },
                                { offset: 0x182, bit: 5, label: "Completed in current game", hidden: true },
                                { offset: 0x182, bit: 6, label: "???", hidden: true },
                                { offset: 0x182, bit: 7, label: "Quest can't be completed" },
                              ],
                            },
                            {
                              name: "Blade of the Old Religion",
                              type: "bitflags",
                              flags: [
                                { offset: 0x17f, bit: 3, label: "Quest given by Hrati" },
                                { offset: 0x17f, bit: 4, label: "Rat Man killed" },
                                { offset: 0x17f, bit: 5, label: "The Gidbinn obtained?", hidden: true },
                                { offset: 0x17f, bit: 6, label: "The Gidbinn given to Asheara?", hidden: true },
                                { offset: 0x17f, bit: 7, label: "The Gidbinn given to Asheara?", hidden: true },
                                { offset: 0x180, bit: 0, label: "The Gidbinn given to Asheara?", hidden: true },
                                { offset: 0x180, bit: 1, label: "The Gidbinn obtained?", hidden: true },
                                { offset: 0x17f, bit: 0, label: "Quest completed", separator: true },
                                { offset: 0x17f, bit: 1, label: "???", hidden: true },
                                { offset: 0x17f, bit: 2, label: "???", hidden: true },
                                { offset: 0x180, bit: 2, label: "???", hidden: true },
                                { offset: 0x180, bit: 3, label: "???", hidden: true },
                                { offset: 0x180, bit: 4, label: "Closing animation seen", hidden: true },
                                { offset: 0x180, bit: 5, label: "Completed in current game", hidden: true },
                                { offset: 0x180, bit: 6, label: "???", hidden: true },
                                { offset: 0x180, bit: 7, label: "Quest can't be completed" },
                              ],
                            },
                            {
                              name: "Khalim's Will",
                              type: "bitflags",
                              flags: [
                                { offset: 0x17d, bit: 2, label: "Quest given by Deckard Cain" },
                                { offset: 0x17d, bit: 3, label: "Khalim's Eye presented to Deckard Cain" },
                                { offset: 0x17d, bit: 4, label: "Khalim's Brain presented to Deckard Cain" },
                                { offset: 0x17d, bit: 6, label: "Khalim's Heart presented to Deckard Cain" },
                                { offset: 0x17d, bit: 5, label: "Khalim's Flail presented to Deckard Cain" },
                                { offset: 0x17d, bit: 7, label: "Khalim's Will presented to Deckard Cain" },
                                { offset: 0x17d, bit: 0, label: "Quest completed", separator: true },
                                { offset: 0x17d, bit: 1, label: "???", hidden: true },
                                { offset: 0x17e, bit: 0, label: "???", hidden: true },
                                { offset: 0x17e, bit: 1, label: "???", hidden: true },
                                { offset: 0x17e, bit: 2, label: "???", hidden: true },
                                { offset: 0x17e, bit: 3, label: "???", hidden: true },
                                { offset: 0x17e, bit: 4, label: "Closing animation seen", hidden: true },
                                { offset: 0x17e, bit: 5, label: "Completed in current game", hidden: true },
                                { offset: 0x17e, bit: 6, label: "???", hidden: true },
                                { offset: 0x17e, bit: 7, label: "Quest can't be completed" },
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
                                { offset: 0x17b, bit: 2, label: "Quest given by Alkor" },
                                { offset: 0x17b, bit: 0, label: "Quest completed", separator: true },
                                { offset: 0x17b, bit: 1, label: "???", hidden: true },
                                { offset: 0x17b, bit: 3, label: "???", hidden: true },
                                { offset: 0x17b, bit: 4, label: "???", hidden: true },
                                { offset: 0x17b, bit: 5, label: "???", hidden: true },
                                { offset: 0x17b, bit: 6, label: "???", hidden: true },
                                { offset: 0x17b, bit: 7, label: "???", hidden: true },
                                { offset: 0x17c, bit: 0, label: "???", hidden: true },
                                { offset: 0x17c, bit: 1, label: "???", hidden: true },
                                { offset: 0x17c, bit: 2, label: "???", hidden: true },
                                { offset: 0x17c, bit: 3, label: "???", hidden: true },
                                { offset: 0x17c, bit: 4, label: "Closing animation seen", hidden: true },
                                { offset: 0x17c, bit: 5, label: "Completed in current game", hidden: true },
                                { offset: 0x17c, bit: 6, label: "???", hidden: true },
                                { offset: 0x17c, bit: 7, label: "Quest can't be completed" },
                              ],
                            },
                            {
                              name: "The Blackened Temple",
                              type: "bitflags",
                              flags: [
                                { offset: 0x183, bit: 3, label: "Entering Travincal" },
                                { offset: 0x183, bit: 4, label: "High Council killed" },
                                { offset: 0x183, bit: 0, label: "Quest completed", separator: true },
                                { offset: 0x183, bit: 1, label: "???", hidden: true },
                                { offset: 0x183, bit: 2, label: "???", hidden: true },
                                { offset: 0x183, bit: 5, label: "???", hidden: true },
                                { offset: 0x183, bit: 6, label: "???", hidden: true },
                                { offset: 0x183, bit: 7, label: "???", hidden: true },
                                { offset: 0x184, bit: 0, label: "???", hidden: true },
                                { offset: 0x184, bit: 1, label: "???", hidden: true },
                                { offset: 0x184, bit: 2, label: "???", hidden: true },
                                { offset: 0x184, bit: 3, label: "???", hidden: true },
                                { offset: 0x184, bit: 4, label: "Closing animation seen", hidden: true },
                                { offset: 0x184, bit: 5, label: "Completed in current game", hidden: true },
                                { offset: 0x184, bit: 6, label: "???", hidden: true },
                                { offset: 0x184, bit: 7, label: "Quest can't be completed" },
                              ],
                            },
                            {
                              name: "The Guardian",
                              type: "bitflags",
                              flags: [
                                { offset: 0x185, bit: 4, label: "Compelling Orb destroyed" },
                                { offset: 0x185, bit: 5, label: "Entering the Durance of Hate Level 1" },
                                { offset: 0x185, bit: 6, label: "Entering the Durance of Hate Level 3" },
                                { offset: 0x186, bit: 3, label: "Mephisto killed" },
                                { offset: 0x185, bit: 0, label: "Quest completed", separator: true },
                                { offset: 0x185, bit: 1, label: "???", hidden: true },
                                { offset: 0x185, bit: 2, label: "???", hidden: true },
                                { offset: 0x185, bit: 3, label: "???", hidden: true },
                                { offset: 0x185, bit: 7, label: "???", hidden: true },
                                { offset: 0x186, bit: 0, label: "???", hidden: true },
                                { offset: 0x186, bit: 1, label: "???", hidden: true },
                                { offset: 0x186, bit: 2, label: "???", hidden: true },
                                { offset: 0x186, bit: 4, label: "Closing animation seen", hidden: true },
                                { offset: 0x186, bit: 5, label: "Completed in current game", hidden: true },
                                { offset: 0x186, bit: 6, label: "???", hidden: true },
                                { offset: 0x186, bit: 7, label: "Quest can't be completed" },
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
                            { offset: 0x189, bit: 0, label: "Introduction" },
                            { offset: 0x191, bit: 0, label: "Act Completed", hidden: true },
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
                                { offset: 0x18b, bit: 2, label: "Quest given by Tyrael" },
                                { offset: 0x18b, bit: 3, label: "Exiting the Pandemonium Fortress" },
                                { offset: 0x18b, bit: 1, label: "Izual killed" },
                                { offset: 0x18b, bit: 5, label: "Talk with Izual Spirit" },
                                { offset: 0x18b, bit: 0, label: "Quest completed", separator: true },
                                { offset: 0x18b, bit: 4, label: "???", hidden: true },
                                { offset: 0x18b, bit: 6, label: "???", hidden: true },
                                { offset: 0x18b, bit: 7, label: "???", hidden: true },
                                { offset: 0x18c, bit: 0, label: "???", hidden: true },
                                { offset: 0x18c, bit: 1, label: "???", hidden: true },
                                { offset: 0x18c, bit: 2, label: "???", hidden: true },
                                { offset: 0x18c, bit: 3, label: "???", hidden: true },
                                { offset: 0x18c, bit: 4, label: "Closing animation seen", hidden: true },
                                { offset: 0x18c, bit: 5, label: "Completed in current game", hidden: true },
                                { offset: 0x18c, bit: 6, label: "???", hidden: true },
                                { offset: 0x18c, bit: 7, label: "Quest can't be completed" },
                              ],
                            },
                            {
                              name: "Hell's Forge",
                              type: "bitflags",
                              flags: [
                                { offset: 0x18f, bit: 2, label: "Quest given by Deckard Cain" },
                                { offset: 0x18f, bit: 3, label: "Exiting the Pandemonium Fortress" },
                                { offset: 0x18f, bit: 1, label: "Mephisto's Soulstone destroyed" },
                                { offset: 0x18f, bit: 0, label: "Quest completed", separator: true },
                                { offset: 0x18f, bit: 4, label: "???", hidden: true },
                                { offset: 0x18f, bit: 5, label: "???", hidden: true },
                                { offset: 0x18f, bit: 6, label: "???", hidden: true },
                                { offset: 0x18f, bit: 7, label: "???", hidden: true },
                                { offset: 0x190, bit: 0, label: "???", hidden: true },
                                { offset: 0x190, bit: 1, label: "???", hidden: true },
                                { offset: 0x190, bit: 2, label: "???", hidden: true },
                                { offset: 0x190, bit: 3, label: "???", hidden: true },
                                { offset: 0x190, bit: 4, label: "Closing animation seen", hidden: true },
                                { offset: 0x190, bit: 5, label: "Completed in current game", hidden: true },
                                { offset: 0x190, bit: 6, label: "???", hidden: true },
                                { offset: 0x190, bit: 7, label: "Quest can't be completed" },
                              ],
                            },
                            {
                              name: "Terror's End",
                              type: "bitflags",
                              flags: [
                                { offset: 0x18d, bit: 2, label: "Quest given by Tyrael" },
                                { offset: 0x18d, bit: 3, label: "Exiting the Pandemonium Fortress" },
                                { offset: 0x18e, bit: 0, label: "Talk with Deckard Cain" },
                                { offset: 0x18e, bit: 1, label: "Portal to Harrogath open" },
                                { offset: 0x18d, bit: 0, label: "Quest completed", separator: true },
                                { offset: 0x18d, bit: 1, label: "???", hidden: true },
                                { offset: 0x18d, bit: 4, label: "???", hidden: true },
                                { offset: 0x18d, bit: 5, label: "???", hidden: true },
                                { offset: 0x18d, bit: 6, label: "???", hidden: true },
                                { offset: 0x18d, bit: 7, label: "???", hidden: true },
                                { offset: 0x18e, bit: 2, label: "???", hidden: true },
                                { offset: 0x18e, bit: 3, label: "???", hidden: true },
                                { offset: 0x18e, bit: 4, label: "Closing animation seen", hidden: true },
                                { offset: 0x18e, bit: 5, label: "Completed in current game", hidden: true },
                                { offset: 0x18e, bit: 6, label: "???", hidden: true },
                                { offset: 0x18e, bit: 7, label: "Quest can't be completed" },
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
                          type: "section",
                          flex: true,
                          items: [
                            {
                              name: "Siege on Harrogath",
                              type: "bitflags",
                              flags: [
                                { offset: 0x19f, bit: 2, label: "Quest given by larzuk" },
                                { offset: 0x19f, bit: 3, label: "Exiting Harrogath" },
                                { offset: 0x19f, bit: 1, label: "Shenk killed" },
                                { offset: 0x19f, bit: 5, label: "Larzuk offers to socket an item" },
                                { offset: 0x19f, bit: 0, label: "Quest completed", separator: true },
                                { offset: 0x19f, bit: 4, label: "???", hidden: true },
                                { offset: 0x19f, bit: 6, label: "???", hidden: true },
                                { offset: 0x19f, bit: 7, label: "???", hidden: true },
                                { offset: 0x1a0, bit: 0, label: "???", hidden: true },
                                { offset: 0x1a0, bit: 1, label: "???", hidden: true },
                                { offset: 0x1a0, bit: 2, label: "???", hidden: true },
                                { offset: 0x1a0, bit: 3, label: "???", hidden: true },
                                { offset: 0x1a0, bit: 4, label: "Closing animation seen", hidden: true },
                                { offset: 0x1a0, bit: 5, label: "Completed in current game", hidden: true },
                                { offset: 0x1a0, bit: 6, label: "???", hidden: true },
                                { offset: 0x1a0, bit: 7, label: "Quest can't be completed" },
                              ],
                            },
                            {
                              name: "Rescue on Mount Arreat",
                              type: "bitflags",
                              flags: [
                                { offset: 0x1a1, bit: 2, label: "Quest given by Qual-Lehk" },
                                { offset: 0x1a1, bit: 3, label: "Exiting Harrogath" },
                                { offset: 0x1a1, bit: 4, label: "A group of Soldiers has been released" },
                                { offset: 0x1a1, bit: 5, label: "All soldiers have been released?", hidden: true },
                                { offset: 0x1a1, bit: 1, label: "All soldiers have been released?", hidden: true },
                                { offset: 0x1a1, bit: 0, label: "Quest completed", separator: true },
                                { offset: 0x1a1, bit: 6, label: "???", hidden: true },
                                { offset: 0x1a1, bit: 7, label: "???", hidden: true },
                                { offset: 0x1a2, bit: 0, label: "???", hidden: true },
                                { offset: 0x1a2, bit: 1, label: "???", hidden: true },
                                { offset: 0x1a2, bit: 2, label: "???", hidden: true },
                                { offset: 0x1a2, bit: 3, label: "???", hidden: true },
                                { offset: 0x1a2, bit: 4, label: "Closing animation seen", hidden: true },
                                { offset: 0x1a2, bit: 5, label: "Completed in current game", hidden: true },
                                { offset: 0x1a2, bit: 6, label: "???", hidden: true },
                                { offset: 0x1a2, bit: 7, label: "Quest can't be completed" },
                              ],
                            },
                            {
                              name: "Prison of Ice",
                              type: "bitflags",
                              flags: [
                                { offset: 0x1a3, bit: 2, label: "Quest given by Malah" },
                                { offset: 0x1a3, bit: 3, label: "Anya seen" },
                                { offset: 0x1a3, bit: 1, label: "Anya rescued" },
                                { offset: 0x1a3, bit: 0, label: "Quest completed", separator: true },
                                { offset: 0x1a3, bit: 4, label: "???", hidden: true },
                                { offset: 0x1a3, bit: 5, label: "???", hidden: true },
                                { offset: 0x1a3, bit: 6, label: "???", hidden: true },
                                { offset: 0x1a3, bit: 7, label: "???", hidden: true },
                                { offset: 0x1a4, bit: 0, label: "???", hidden: true },
                                { offset: 0x1a4, bit: 1, label: "???", hidden: true },
                                { offset: 0x1a4, bit: 2, label: "???", hidden: true },
                                { offset: 0x1a4, bit: 3, label: "???", hidden: true },
                                { offset: 0x1a4, bit: 4, label: "Closing animation seen", hidden: true },
                                { offset: 0x1a4, bit: 5, label: "Completed in current game", hidden: true },
                                { offset: 0x1a4, bit: 6, label: "???", hidden: true },
                                { offset: 0x1a4, bit: 7, label: "Quest can't be completed" },
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
                                { offset: 0x1a5, bit: 2, label: "Quest given by Anya" },
                                { offset: 0x1a5, bit: 3, label: "Exiting Harrogath" },
                                { offset: 0x1a5, bit: 4, label: "Talk with Anya" },
                                { offset: 0x1a5, bit: 1, label: "Anya offers to personalize an item" },
                                { offset: 0x1a5, bit: 0, label: "Quest completed", separator: true },
                                { offset: 0x1a5, bit: 5, label: "???", hidden: true },
                                { offset: 0x1a5, bit: 6, label: "???", hidden: true },
                                { offset: 0x1a5, bit: 7, label: "???", hidden: true },
                                { offset: 0x1a6, bit: 0, label: "???", hidden: true },
                                { offset: 0x1a6, bit: 1, label: "???", hidden: true },
                                { offset: 0x1a6, bit: 2, label: "???", hidden: true },
                                { offset: 0x1a6, bit: 3, label: "???", hidden: true },
                                { offset: 0x1a6, bit: 4, label: "Closing animation seen", hidden: true },
                                { offset: 0x1a6, bit: 5, label: "Completed in current game", hidden: true },
                                { offset: 0x1a6, bit: 6, label: "???", hidden: true },
                                { offset: 0x1a6, bit: 7, label: "Quest can't be completed" },
                              ],
                            },
                            {
                              name: "Rite of Passage",
                              type: "bitflags",
                              flags: [
                                { offset: 0x1a7, bit: 2, label: "Quest given by Qualk-Kehk" },
                                { offset: 0x1a7, bit: 3, label: "Exiting Harrogath" },
                                { offset: 0x1a7, bit: 0, label: "Quest completed", separator: true },
                                { offset: 0x1a7, bit: 1, label: "???", hidden: true },
                                { offset: 0x1a7, bit: 4, label: "???", hidden: true },
                                { offset: 0x1a7, bit: 5, label: "???", hidden: true },
                                { offset: 0x1a7, bit: 6, label: "???", hidden: true },
                                { offset: 0x1a7, bit: 7, label: "???", hidden: true },
                                { offset: 0x1a8, bit: 0, label: "???", hidden: true },
                                { offset: 0x1a8, bit: 1, label: "???", hidden: true },
                                { offset: 0x1a8, bit: 2, label: "???", hidden: true },
                                { offset: 0x1a8, bit: 3, label: "???", hidden: true },
                                { offset: 0x1a8, bit: 4, label: "Closing animation seen", hidden: true },
                                { offset: 0x1a8, bit: 5, label: "Completed in current game", hidden: true },
                                { offset: 0x1a8, bit: 6, label: "???", hidden: true },
                                { offset: 0x1a8, bit: 7, label: "Quest can't be completed" },
                              ],
                            },
                            {
                              name: "Eve of Destruction",
                              type: "bitflags",
                              flags: [
                                { offset: 0x1a9, bit: 3, label: "Entering the Throne of Destruction" },
                                { offset: 0x1aa, bit: 2, label: "Destruction's End reached" },
                                { offset: 0x1a9, bit: 0, label: "Quest completed", separator: true },
                                { offset: 0x1a9, bit: 4, label: "Talk with Larzuk" },
                                { offset: 0x1a9, bit: 6, label: "Talk with Malah" },
                                { offset: 0x1a9, bit: 7, label: "Talk with Tyrael" },
                                { offset: 0x1aa, bit: 0, label: "Talk with Qual-Kehk" },
                                { offset: 0x1aa, bit: 1, label: "Talk with Anya", separator: true },
                                { offset: 0x1a9, bit: 1, label: "???", hidden: true },
                                { offset: 0x1a9, bit: 2, label: "???", hidden: true },
                                { offset: 0x1a9, bit: 5, label: "???", hidden: true },
                                { offset: 0x1aa, bit: 3, label: "???", hidden: true },
                                { offset: 0x1aa, bit: 4, label: "Closing animation seen", hidden: true },
                                { offset: 0x1aa, bit: 5, label: "Completed in current game", hidden: true },
                                { offset: 0x1aa, bit: 6, label: "???", hidden: true },
                                { offset: 0x1aa, bit: 7, label: "Quest can't be completed" },
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
                    { offset: 0x283, bit: 0, label: "Rogue Encampment" },
                    { offset: 0x283, bit: 1, label: "Cold Plains" },
                    { offset: 0x283, bit: 2, label: "Stony Field" },
                    { offset: 0x283, bit: 3, label: "Dark Wood" },
                    { offset: 0x283, bit: 4, label: "Black Marsh" },
                    { offset: 0x283, bit: 5, label: "Outer Cloister" },
                    { offset: 0x283, bit: 6, label: "Jail Level 1" },
                    { offset: 0x283, bit: 7, label: "Inner Cloister" },
                    { offset: 0x284, bit: 0, label: "Catacombs Level 2" },
                  ],
                },
                {
                  name: "Act 2",
                  type: "bitflags",
                  flags: [
                    { offset: 0x284, bit: 1, label: "Lut Gholein" },
                    { offset: 0x284, bit: 2, label: "Sewers Level 2" },
                    { offset: 0x284, bit: 3, label: "Dry Hills" },
                    { offset: 0x284, bit: 4, label: "Halls of the Dead Level 2" },
                    { offset: 0x284, bit: 5, label: "Far Oasis" },
                    { offset: 0x284, bit: 6, label: "Lost City" },
                    { offset: 0x284, bit: 7, label: "Palace Cellar Level 1" },
                    { offset: 0x285, bit: 0, label: "Arcade Sanctuary" },
                    { offset: 0x285, bit: 1, label: "Canyon of the Magi" },
                  ],
                },
                {
                  name: "Act 3",
                  type: "bitflags",
                  flags: [
                    { offset: 0x285, bit: 2, label: "Kurast Docks" },
                    { offset: 0x285, bit: 3, label: "Spider Forest" },
                    { offset: 0x285, bit: 4, label: "Great Marsh" },
                    { offset: 0x285, bit: 5, label: "Flayer Jungle" },
                    { offset: 0x285, bit: 6, label: "Lower Kurast" },
                    { offset: 0x285, bit: 7, label: "Kurast Bazaar" },
                    { offset: 0x286, bit: 0, label: "Upper Kurast" },
                    { offset: 0x286, bit: 1, label: "Travincal" },
                    { offset: 0x286, bit: 2, label: "Durance of Hate Level 2" },
                  ],
                },
                {
                  name: "Act 4",
                  type: "bitflags",
                  flags: [
                    { offset: 0x286, bit: 3, label: "The Pandemonium Fortress" },
                    { offset: 0x286, bit: 4, label: "City of the Damned" },
                    { offset: 0x286, bit: 5, label: "River of Flame" },
                  ],
                },
                {
                  name: "Act 5",
                  type: "bitflags",
                  flags: [
                    { offset: 0x286, bit: 6, label: "Harrogath" },
                    { offset: 0x286, bit: 7, label: "Frigid Highlands" },
                    { offset: 0x287, bit: 0, label: "Arreat Plateau" },
                    { offset: 0x287, bit: 1, label: "Crystalline Passage" },
                    { offset: 0x287, bit: 2, label: "Glacial Trail" },
                    { offset: 0x287, bit: 3, label: "Halls of Pain" },
                    { offset: 0x287, bit: 4, label: "Frozen Tundra" },
                    { offset: 0x287, bit: 5, label: "The Ancients' Way" },
                    { offset: 0x287, bit: 6, label: "Worldstone Keep Level 2" },
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
                    { offset: 0x2cd, bit: 0, label: "???" },
                    { offset: 0x2cd, bit: 1, label: "Gheed" },
                    { offset: 0x2cd, bit: 2, label: "???" },
                    { offset: 0x2cd, bit: 3, label: "Kashya" },
                    { offset: 0x2cd, bit: 4, label: "???" },
                    { offset: 0x2cd, bit: 5, label: "Charsi" },
                    { offset: 0x2cd, bit: 6, label: "???" },
                    { offset: 0x2cd, bit: 7, label: "???" },
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
      0x3: "Paladin",
      0x4: "Barbarian",
      0x5: "Druid",
      0x6: "Assassin",
    },
    difficulties: {
      0x0: "Normal",
      0x1: "Nightmare",
      0x2: "Hell",
    },
    inventoryNames: "getInventoryNames()",
    itemCodes: {
      0x20637330: "Scroll of Knowledge", // 0sc
      0x20786132: "Double Axe", // 2ax
      0x20736832: "Two-Handed Sword", // 2hs
      0x20736236: "Shillelagh", // 6bs
      0x20626336: "Great Bow", // 6cb
      0x20736336: "Elder Staff", // 6cs
      0x20626836: "Blade Bow", // 6hb
      0x20786836: "Colossus Crossbow", // 6hx
      0x20376c36: "Crusader Bow", // 6l7
      0x20626c36: "Shadow Bow", // 6lb
      0x20736c36: "Stalagmite", // 6ls
      0x20776c36: "Hydra Bow", // 6lw
      0x20786c36: "Pellet Bow", // 6lx
      0x20786d36: "Gorgon Crossbow", // 6mx
      0x20787236: "Demon Crossbow", // 6rx
      0x20377336: "Diamond Bow", // 6s7
      0x20627336: "Spider Bow", // 6sb
      0x20737336: "Walking Stick", // 6ss
      0x20777336: "Ward Bow", // 6sw
      0x20737736: "Archon Staff", // 6ws
      0x20613237: "Ettin Axe", // 72a
      0x20683237: "Legend Sword", // 72h
      0x20726137: "Suwayyah", // 7ar
      0x20786137: "Small Crescent", // 7ax
      0x20376237: "Champion Sword", // 7b7
      0x20386237: "Winged Axe", // 7b8
      0x20616237: "Silver-edged Axe", // 7ba
      0x206b6237: "Winged Knife", // 7bk
      0x206c6237: "Legend Spike", // 7bl
      0x20726237: "Mancatcher", // 7br
      0x20736237: "Conquest Sword", // 7bs
      0x20746237: "Decapitator", // 7bt
      0x20776237: "Lich Wand", // 7bw
      0x206c6337: "Truncheon", // 7cl
      0x206d6337: "Highland Blade", // 7cm
      0x20726337: "Phase Blade", // 7cr
      0x20736337: "Battle Cestus", // 7cs
      0x20676437: "Bone Knife", // 7dg
      0x20696437: "Mithril Point", // 7di
      0x20626637: "Colossus Sword", // 7fb
      0x20636637: "Hydra Edge", // 7fc
      0x206c6637: "Scourge", // 7fl
      0x20616737: "Champion Axe", // 7ga
      0x20646737: "Colossus Blade", // 7gd
      0x20696737: "Glorious Axe", // 7gi
      0x206c6737: "Ghost Glaive", // 7gl
      0x206d6737: "Thunder Maul", // 7gm
      0x20736737: "Balrog Blade", // 7gs
      0x20776737: "Unearthed Wand", // 7gw
      0x20376837: "Great Poleaxe", // 7h7
      0x20616837: "Tomahawk", // 7ha
      0x20616a37: "Hyperion Javelin", // 7ja
      0x20726b37: "Fanged Knife", // 7kr
      0x20616c37: "Feral Axe", // 7la
      0x20736c37: "Cryptic Sword", // 7ls
      0x20776c37: "Feral Claws", // 7lw
      0x20376d37: "Ogre Maul", // 7m7
      0x20616d37: "Reinforced Mace", // 7ma
      0x20706d37: "War Spike", // 7mp
      0x20746d37: "Devil Star", // 7mt
      0x20376f37: "Ogre Axe", // 7o7
      0x20377037: "War Pike", // 7p7
      0x20617037: "Cryptic Axe", // 7pa
      0x20697037: "Stygian Pilum", // 7pi
      0x20727137: "Scissors Suwayyah", // 7qr
      0x20737137: "Seraph Rod", // 7qs
      0x20377337: "Balrog Spear", // 7s7
      0x20387337: "Thresher", // 7s8
      0x20627337: "Elegant Blade", // 7sb
      0x20637337: "Mighty Scepter", // 7sc
      0x206d7337: "Ataghan", // 7sm
      0x20707337: "Tyrant Club", // 7sp
      0x20727337: "Hyperion Spear", // 7sr
      0x20737337: "Falcata", // 7ss
      0x20747337: "Ghost Spear", // 7st
      0x20617437: "Flying Axe", // 7ta
      0x206b7437: "Flying Knife", // 7tk
      0x20727437: "Stygian Pike", // 7tr
      0x20737437: "Winged Harpoon", // 7ts
      0x20777437: "Runic Talons", // 7tw
      0x206f7637: "Colossus Voulge", // 7vo
      0x20617737: "Beserker Axe", // 7wa
      0x20627737: "Wrist Sword", // 7wb
      0x20637737: "Giant Thresher", // 7wc
      0x20647737: "Mythical Sword", // 7wd
      0x20687737: "Legendary Mallet", // 7wh
      0x206e7737: "Polished Wand", // 7wn
      0x20737737: "Caduceus", // 7ws
      0x20667837: "War Fist", // 7xf
      0x20777937: "Ghost Wand", // 7yw
      0x20736238: "Gothic Staff", // 8bs
      0x20626338: "Double Bow", // 8cb
      0x20736338: "Cedar Staff", // 8cs
      0x20626838: "Razor Bow", // 8hb
      0x20786838: "Ballista", // 8hx
      0x20386c38: "Large Siege Bow", // 8l8
      0x20626c38: "Cedar Bow", // 8lb
      0x20736c38: "Quarterstaff", // 8ls
      0x20776c38: "Gothic Bow", // 8lw
      0x20786c38: "Arbalest", // 8lx
      0x20786d38: "Siege Crossbow", // 8mx
      0x20787238: "Chu-Ko-Nu", // 8rx
      0x20387338: "Short Siege Bow", // 8s8
      0x20627338: "Edge Bow", // 8sb
      0x20737338: "Jo Staff", // 8ss
      0x20777338: "Rune Bow", // 8sw
      0x20737738: "Rune Staff", // 8ws
      0x20613239: "Twin Axe", // 92a
      0x20683239: "Espandon", // 92h
      0x20726139: "Quhab", // 9ar
      0x20786139: "Cleaver", // 9ax
      0x20376239: "Lochaber Axe", // 9b7
      0x20386239: "Hurlbat", // 9b8
      0x20396239: "Gothic Sword", // 9b9
      0x20616239: "Bearded Axe", // 9ba
      0x206b6239: "War Dart", // 9bk
      0x206c6239: "Stilleto", // 9bl
      0x20726239: "War Fork", // 9br
      0x20736239: "Battle Sword", // 9bs
      0x20746239: "Tabar", // 9bt
      0x20776239: "Tomb Wand", // 9bw
      0x206c6339: "Cudgel", // 9cl
      0x206d6339: "Dacian Falx", // 9cm
      0x20726339: "Dimensional Blade", // 9cr
      0x20736339: "Hand Scythe", // 9cs
      0x20676439: "Poignard", // 9dg
      0x20696439: "Rondel", // 9di
      0x20626639: "Zweihander", // 9fb
      0x20636639: "Tulwar", // 9fc
      0x206c6639: "Knout", // 9fl
      0x20616739: "Gothic Axe", // 9ga
      0x20646739: "Executioner Sword", // 9gd
      0x20696739: "Ancient Axe", // 9gi
      0x206c6739: "Spiculum", // 9gl
      0x206d6739: "Martel de Fer", // 9gm
      0x20736739: "Tusk Sword", // 9gs
      0x20776739: "Grave Wand", // 9gw
      0x20396839: "Bec-de-Corbin", // 9h9
      0x20616839: "Hatchet", // 9ha
      0x20616a39: "War Javelin", // 9ja
      0x20726b39: "Cinquedeas", // 9kr
      0x20616c39: "Military Axe", // 9la
      0x20736c39: "Rune Sword", // 9ls
      0x20776c39: "Greater Claws", // 9lw
      0x20396d39: "War Club", // 9m9
      0x20616d39: "Flanged Mace", // 9ma
      0x20706d39: "Crowbill", // 9mp
      0x20746d39: "Jagged Star", // 9mt
      0x20397039: "Lance", // 9p9
      0x20617039: "Partizan", // 9pa
      0x20697039: "Great Pilum", // 9pi
      0x20727139: "Scissors Quhab", // 9qr
      0x20737139: "Holy Water Sprinkler", // 9qs
      0x20387339: "Battle Scythe", // 9s8
      0x20397339: "Simbilan", // 9s9
      0x20627339: "Shamshir", // 9sb
      0x20637339: "Rune Scepter", // 9sc
      0x206d7339: "Cutlass", // 9sm
      0x20707339: "Barbed Club", // 9sp
      0x20727339: "War Spear", // 9sr
      0x20737339: "Gladius", // 9ss
      0x20747339: "Yari", // 9st
      0x20617439: "Francisca", // 9ta
      0x206b7439: "Battle Dart", // 9tk
      0x20727439: "Fuscina", // 9tr
      0x20737439: "Harpoon", // 9ts
      0x20777439: "Greater Talons", // 9tw
      0x206f7639: "Bill", // 9vo
      0x20617739: "Naga", // 9wa
      0x20627739: "Wrist Spike", // 9wb
      0x20637739: "Grim Scythe", // 9wc
      0x20647739: "Ancient Sword", // 9wd
      0x20687739: "Battle Hammer", // 9wh
      0x206e7739: "Burnt Wand", // 9wn
      0x20737739: "Divine Scepter", // 9ws
      0x20667839: "Fascia", // 9xf
      0x20777939: "Petrified Wand", // 9yw
      0x20726161: "Ancient Armor", // aar
      0x20316d61: "Stag Bow", // am1
      0x20326d61: "Reflex Bow", // am2
      0x20336d61: "Maiden Spear", // am3
      0x20346d61: "Maiden Pike", // am4
      0x20356d61: "Maiden Javelin", // am5
      0x20366d61: "Ashwood Bow", // am6
      0x20376d61: "Ceremonial Bow", // am7
      0x20386d61: "Ceremonial Spear", // am8
      0x20396d61: "Ceremonial Pike", // am9
      0x20616d61: "Ceremonial Javelin", // ama
      0x20626d61: "Matriarchal Bow", // amb
      0x20636d61: "Grand Matron Bow", // amc
      0x20646d61: "Matriarchal Spear", // amd
      0x20656d61: "Matriarchal Pike", // ame
      0x20666d61: "Matriarchal Javelin", // amf
      0x20756d61: "Amulet", // amu
      0x20767161: "Arrows", // aqv
      0x20317361: "Wraps", // as1
      0x20327361: "Knuckles", // as2
      0x20337361: "Slashers", // as3
      0x20347361: "Splay", // as4
      0x20357361: "Hook", // as5
      0x20367361: "Shank", // as6
      0x20377361: "Claws", // as7
      0x20737361: "Book of Skill", // ass
      0x20657861: "Axe", // axe
      0x20667861: "Hatchet Hands", // axf
      0x20316162: "Jawbone Cap", // ba1
      0x20326162: "Fanged Helm", // ba2
      0x20336162: "Horned Helm", // ba3
      0x20346162: "Assault Helmet", // ba4
      0x20356162: "Avenger Guard", // ba5
      0x20366162: "Jawbone Visor", // ba6
      0x20376162: "Lion Helm", // ba7
      0x20386162: "Rage Mask", // ba8
      0x20396162: "Savage Helmet", // ba9
      0x20616162: "Slayer Guard", // baa
      0x20626162: "Carnage Helm", // bab
      0x20636162: "Fury Visor", // bac
      0x20646162: "Destroyer Helm", // bad
      0x20656162: "Conqueror Crown", // bae
      0x20666162: "Guardian Crown", // baf
      0x206c6162: "Balanced Axe", // bal
      0x20726162: "Bardiche", // bar
      0x20786162: "Broad Axe", // bax
      0x20626262: "Lam Esen's Tome", // bbb
      0x20746562: "Burning Essence of Terror", // bet
      0x20796562: "Baal's Eye", // bey
      0x206d6862: "Bone Helm", // bhm
      0x20646b62: "Key to the Cairn Stones", // bkd
      0x20666b62: "Balanced Knife", // bkf
      0x20736b62: "Scroll of Inifuss", // bks
      0x20646c62: "Blade", // bld
      0x20786f62: "Horadric Cube", // box
      0x206e7262: "Brandistock", // brn
      0x20737262: "Breast Plate", // brs
      0x20647362: "Broad Sword", // bsd
      0x20687362: "Bone Shield", // bsh
      0x20747362: "Battle Staff", // bst
      0x20777362: "Bastard Sword", // bsw
      0x206c7462: "Blade Talons", // btl
      0x20787462: "Battle Axe", // btx
      0x20637562: "Buckler", // buc
      0x206e7762: "Bone Wand", // bwn
      0x20706163: "Cap", // cap
      0x20776263: "Composite Bow", // cbw
      0x20686563: "Charged Essence of Hatred", // ceh
      0x20736563: "Cestus", // ces
      0x206e6863: "Chain Mail", // chn
      0x20306963: "Circlet", // ci0
      0x20316963: "Coronet", // ci1
      0x20326963: "Tiara", // ci2
      0x20336963: "Diadem", // ci3
      0x20626c63: "Club", // clb
      0x206d6c63: "Claymore", // clm
      0x20776c63: "Claws", // clw
      0x20316d63: "Small Charm", // cm1
      0x20326d63: "Large Charm", // cm2
      0x20336d63: "Grand Charm", // cm3
      0x20767163: "Bolts", // cqv
      0x206e7263: "Crown", // crn
      0x20737263: "Crystal Sword", // crs
      0x20747363: "Gnarled Staff", // cst
      0x20333364: "Decoy Gidbinn", // d33
      0x20726764: "Dagger", // dgr
      0x206e6864: "Diablo's Horn", // dhn
      0x20726964: "Dirk", // dir
      0x20317264: "Wolf Head", // dr1
      0x20327264: "Hawk Helm", // dr2
      0x20337264: "Antlers", // dr3
      0x20347264: "Falcon Mask", // dr4
      0x20357264: "Spirit Mask", // dr5
      0x20367264: "Alpha Helm", // dr6
      0x20377264: "Griffon Headdress", // dr7
      0x20387264: "Hunter's Guise", // dr8
      0x20397264: "Sacred Feathers", // dr9
      0x20617264: "Totemic Mask", // dra
      0x20627264: "Blood Spirit", // drb
      0x20637264: "Sun Spirit", // drc
      0x20647264: "Earth Spirit", // drd
      0x20657264: "Sky Spirit", // dre
      0x20667264: "Dream Spirit", // drf
      0x20726165: "Ear", // ear
      0x20786c65: "Elixir", // elx
      0x20646566: "Festering Essence of Destruction", // fed
      0x206c6866: "Full Helm", // fhl
      0x20616c66: "Flail", // fla
      0x20626c66: "Flamberge", // flb
      0x20636c66: "Falchion", // flc
      0x20646c66: "Field Plate", // fld
      0x206c7566: "Full Plate Mail", // ful
      0x20333367: "The Gidbinn", // g33
      0x20343367: "The Golden Bird", // g34
      0x20786167: "Great Axe", // gax
      0x20626367: "Chipped Sapphire", // gcb
      0x20676367: "Chipped Emerald", // gcg
      0x20726367: "Chipped Ruby", // gcr
      0x20766367: "Chipped Amethyst", // gcv
      0x20776367: "Chipped Diamond", // gcw
      0x20796367: "Chipped Topaz", // gcy
      0x20626667: "Flawed Sapphire", // gfb
      0x20676667: "Flawed Emerald", // gfg
      0x20726667: "Flawed Ruby", // gfr
      0x20766667: "Flawed Amethyst", // gfv
      0x20776667: "Flawed Diamond", // gfw
      0x20796667: "Flawed Topaz", // gfy
      0x206d6867: "Great Helm", // ghm
      0x20736967: "Giant Sword", // gis
      0x20786967: "Giant Axe", // gix
      0x20626c67: "Flawless Sapphire", // glb
      0x20646c67: "Gold", // gld
      0x20676c67: "Flawless Emerald", // glg
      0x20726c67: "Flawless Ruby", // glr
      0x20766c67: "Glaive", // glv
      0x20776c67: "Flawless Diamond", // glw
      0x20796c67: "Flawless Topaz", // gly
      0x20616d67: "Great Maul", // gma
      0x20627067: "Perfect Sapphire", // gpb
      0x20677067: "Perfect Emerald", // gpg
      0x206c7067: "Strangling Gas Potion", // gpl
      0x206d7067: "Choking Gas Potion", // gpm
      0x20727067: "Perfect Ruby", // gpr
      0x20737067: "Rancid Gas Potion", // gps
      0x20767067: "Perfect Amethyst", // gpv
      0x20777067: "Perfect Diamond", // gpw
      0x20797067: "Perfect Topaz", // gpy
      0x20627367: "Sapphire", // gsb
      0x20637367: "Grand Scepter", // gsc
      0x20647367: "Great Sword", // gsd
      0x20677367: "Emerald", // gsg
      0x20727367: "Ruby", // gsr
      0x20767367: "Amethyst", // gsv
      0x20777367: "Diamond", // gsw
      0x20797367: "Topaz", // gsy
      0x20687467: "Gothic Plate", // gth
      0x20737467: "Gothic Shield", // gts
      0x206e7767: "Grim Wand", // gwn
      0x20767a67: "Flawless Amethyst", // gzv
      0x206c6168: "Halberd", // hal
      0x20786168: "Hand Axe", // hax
      0x206c6268: "Plated Belt", // hbl
      0x20746268: "Greaves", // hbt
      0x20776268: "Hunter's Bow", // hbw
      0x206d6468: "Horadric Malus", // hdm
      0x20686668: "Hell Forge Hammer", // hfh
      0x206c6768: "Gauntlets", // hgl
      0x20616c68: "Hard Leather Armor", // hla
      0x206d6c68: "Helm", // hlm
      0x20317068: "Minor Healing Potion", // hp1
      0x20327068: "Light Healing Potion", // hp2
      0x20337068: "Healing Potion", // hp3
      0x20347068: "Greater Healing Potion", // hp4
      0x20357068: "Super Healing Potion", // hp5
      0x20627268: "Herb", // hrb
      0x20747368: "Horadric Staff", // hst
      0x20627868: "Heavy Crossbow", // hxb
      0x206b6269: "Tome of Identify", // ibk
      0x20656369: "Malah's Potion", // ice
      0x20637369: "Scroll of Identify", // isc
      0x2034336a: "A Jade Figurine", // j34
      0x2076616a: "Javelin", // jav
      0x2077656a: "Jewel", // jew
      0x2079656b: "Key", // key
      0x2074696b: "Kite Shield", // kit
      0x2069726b: "Kris", // kri
      0x2072746b: "Katar", // ktr
      0x2078616c: "Large Axe", // lax
      0x2062626c: "Long Battle Bow", // lbb
      0x206c626c: "Sash", // lbl
      0x2074626c: "Boots", // lbt
      0x2077626c: "Long Bow", // lbw
      0x2061656c: "Leather Armor", // lea
      0x2067656c: "Wirt's Leg", // leg
      0x206c676c: "Leather Gloves", // lgl
      0x2067726c: "Large Shield", // lrg
      0x2064736c: "Long Sword", // lsd
      0x2074736c: "Long Staff", // lst
      0x2070746c: "Light Plate", // ltp
      0x2076756c: "The Black Tower Key", // luv
      0x2062776c: "Long War Bow", // lwb
      0x2062786c: "Light Crossbow", // lxb
      0x2063616d: "Mace", // mac
      0x2075616d: "Maul", // mau
      0x206c626d: "Belt", // mbl
      0x2072626d: "Mephisto's Brain", // mbr
      0x2074626d: "Chain Boots", // mbt
      0x206c676d: "Chain Gloves", // mgl
      0x2031706d: "Minor Mana Potion", // mp1
      0x2032706d: "Light Mana Potion", // mp2
      0x2033706d: "Mana Potion", // mp3
      0x2034706d: "Greater Mana Potion", // mp4
      0x2035706d: "Super Mana Potion", // mp5
      0x2069706d: "Military Pick", // mpi
      0x2066736d: "Shaft of the Horadric Staff", // msf
      0x206b736d: "Mask", // msk
      0x2073736d: "Mephisto's Soulstone", // mss
      0x2074736d: "Morning Star", // mst
      0x2062786d: "Crossbow", // mxb
      0x2031656e: "Preserved Head", // ne1
      0x2032656e: "Zombie Head", // ne2
      0x2033656e: "Unraveller Head", // ne3
      0x2034656e: "Gargoyle Head", // ne4
      0x2035656e: "Demon Head", // ne5
      0x2036656e: "Mummified Trophy", // ne6
      0x2037656e: "Fetish Trophy", // ne7
      0x2038656e: "Sexton Trophy", // ne8
      0x2039656e: "Cantor Trophy", // ne9
      0x2061656e: "Hierophant Trophy", // nea
      0x2062656e: "Minion Skull", // neb
      0x2063656e: "Hellspawn Skull", // nec
      0x2064656e: "Overseer Skull", // ned
      0x2065656e: "Succubus Skull", // nee
      0x2066656e: "Bloodlord Skull", // nef
      0x2067656e: "HellspawnSkull", // neg
      0x2031626f: "Eagle Orb", // ob1
      0x2032626f: "Sacred Globe", // ob2
      0x2033626f: "Smoked Sphere", // ob3
      0x2034626f: "Clasped Orb", // ob4
      0x2035626f: "Jared's Stone", // ob5
      0x2036626f: "Glowing Orb", // ob6
      0x2037626f: "Crystalline Globe", // ob7
      0x2038626f: "Cloudy Sphere", // ob8
      0x2039626f: "Sparkling Ball", // ob9
      0x2061626f: "Swirling Crystal", // oba
      0x2062626f: "Heavenly Stone", // obb
      0x2063626f: "Eldritch Orb", // obc
      0x2064626f: "Demon Heart", // obd
      0x2065626f: "Vortex Orb", // obe
      0x2066626f: "Dimensional Shard", // obf
      0x206c706f: "Fulminating Potion", // opl
      0x206d706f: "Exploding Potion", // opm
      0x2073706f: "Oil Potion", // ops
      0x20316170: "Targe", // pa1
      0x20326170: "Rondache", // pa2
      0x20336170: "Heraldic Shield", // pa3
      0x20346170: "Aerin Shield", // pa4
      0x20356170: "Crown Shield", // pa5
      0x20366170: "Akaran Targe", // pa6
      0x20376170: "Akaran Rondache", // pa7
      0x20386170: "Protector Shield", // pa8
      0x20396170: "Gilded Shield", // pa9
      0x20616170: "Royal Shield", // paa
      0x20626170: "Sacred Targe", // pab
      0x20636170: "Sacred Rondache", // pac
      0x20646170: "Kurast Shield", // pad
      0x20656170: "Zakarum Shield", // pae
      0x20666170: "Vortex Shield", // paf
      0x20786170: "Poleaxe", // pax
      0x206b6970: "Pike", // pik
      0x206c6970: "Pilum", // pil
      0x20316b70: "Key of Terror", // pk1
      0x20326b70: "Key of Hate", // pk2
      0x20336b70: "Key of Destruction", // pk3
      0x20746c70: "Plate Mail", // plt
      0x20726271: "Khalim's Brain", // qbr
      0x20796571: "Khalim's Eye", // qey
      0x20316671: "Khalim’s Flail", // qf1
      0x20326671: "Khalim’s Will", // qf2
      0x20726871: "Khalim's Heart", // qhr
      0x20697571: "Quilted Armor", // qui
      0x20313072: "El Rune", // r01
      0x20323072: "Eld Rune", // r02
      0x20333072: "Tir Rune", // r03
      0x20343072: "Nef Rune", // r04
      0x20353072: "Eth Rune", // r05
      0x20363072: "Ith Rune", // r06
      0x20373072: "Tal Rune", // r07
      0x20383072: "Ral Rune", // r08
      0x20393072: "Ort Rune", // r09
      0x20303172: "Thul Rune", // r10
      0x20313172: "Amn Rune", // r11
      0x20323172: "Sol Rune", // r12
      0x20333172: "Shae Rune", // r13
      0x20343172: "Dol Rune", // r14
      0x20353172: "Hel Rune", // r15
      0x20363172: "Po Rune", // r16
      0x20373172: "Lum Rune", // r17
      0x20383172: "Ko Rune", // r18
      0x20393172: "Fal Rune", // r19
      0x20303272: "Lem Rune", // r20
      0x20313272: "Pul Rune", // r21
      0x20323272: "Um Rune", // r22
      0x20333272: "Mal Rune", // r23
      0x20343272: "Ist Rune", // r24
      0x20353272: "Gul Rune", // r25
      0x20363272: "Vex Rune", // r26
      0x20373272: "Ohm Rune", // r27
      0x20383272: "Lo Rune", // r28
      0x20393272: "Sur Rune", // r29
      0x20303372: "Ber Rune", // r30
      0x20313372: "Jo Rune", // r31
      0x20323372: "Cham Rune", // r32
      0x20333372: "Zod Rune", // r33
      0x206e6972: "Ring", // rin
      0x20676e72: "Ring Mail", // rng
      0x206c7672: "Full Rejuvenation Potion", // rvl
      0x20737672: "Rejuvenation Potion", // rvs
      0x20627872: "Repeating Crossbow", // rxb
      0x20626273: "Short Battle Bow", // sbb
      0x20726273: "Sabre", // sbr
      0x20776273: "Short Bow", // sbw
      0x206c6373: "Scale Mail", // scl
      0x206d6373: "Scimitar", // scm
      0x20706373: "Scepter", // scp
      0x20796373: "Scythe", // scy
      0x20636b73: "Chipped Skull", // skc
      0x20666b73: "Flawed Skull", // skf
      0x206c6b73: "Flawless Skull", // skl
      0x20706b73: "Skull Cap", // skp
      0x20726b73: "Scissors Katar", // skr
      0x20756b73: "Skull", // sku
      0x207a6b73: "Perfect Skull", // skz
      0x206c6d73: "Small Shield", // sml
      0x20637073: "Spiked Club", // spc
      0x206b7073: "Spiked Shield", // spk
      0x206c7073: "Splint Mail", // spl
      0x20727073: "Spear", // spr
      0x20747073: "Spetum", // spt
      0x20647373: "Short Sword", // ssd
      0x20707373: "Short Spear", // ssp
      0x20747373: "Short Staff", // sst
      0x20647473: "StandardofHeroes", // std
      0x20757473: "Studded Leather", // stu
      0x20627773: "Short War Bow", // swb
      0x20786174: "Throwing Axe", // tax
      0x206b6274: "Tome of Town Portal", // tbk
      0x206c6274: "Heavy Belt", // tbl
      0x20746274: "Light Plated Boots", // tbt
      0x20686374: "Torch", // tch
      0x20736574: "Twisted Essence of Suffering", // tes
      0x206c6774: "Light Gauntlets", // tgl
      0x20666b74: "Throwing Knife", // tkf
      0x20616f74: "TokenofAbsolution", // toa
      0x20776f74: "Tower Shield", // tow
      0x20317274: "Horadric Scroll", // tr1
      0x20327274: "Scroll of Resistance", // tr2
      0x20697274: "Trident", // tri
      0x20637374: "Scroll of Town Portal", // tsc
      0x20707374: "Throwing Spear", // tsp
      0x20706175: "Shako", // uap
      0x20726175: "Sacred Armor", // uar
      0x206c6375: "Loricated Mail", // ucl
      0x20616575: "Wyrmhide", // uea
      0x20396875: "Bone Visage", // uh9
      0x20626875: "Myrmidon Greaves", // uhb
      0x20636875: "Colossus Girdle", // uhc
      0x20676875: "Ogre Gauntlets", // uhg
      0x206c6875: "Giant Conch", // uhl
      0x206d6875: "Spired Helm", // uhm
      0x206e6875: "Boneweave", // uhn
      0x20746975: "Monarch", // uit
      0x20706b75: "Hydraskull", // ukp
      0x20616c75: "Scarab Husk", // ula
      0x20626c75: "Wyrmhide Boots", // ulb
      0x20636c75: "Spiderweb Sash", // ulc
      0x20646c75: "Kraken Shell", // uld
      0x20676c75: "Bramble Mitts", // ulg
      0x206d6c75: "Armet", // ulm
      0x20746c75: "Hellforge Plate", // ult
      0x20626d75: "Boneweave Boots", // umb
      0x20636d75: "Mithril Coil", // umc
      0x20676d75: "Vambraces", // umg
      0x206c6d75: "Luna", // uml
      0x20676e75: "Diamond Mail", // ung
      0x20776f75: "Aegis", // uow
      0x206b7075: "Blade Barrier", // upk
      0x206c7075: "Balrog Skin", // upl
      0x20677275: "Hyperion", // urg
      0x206e7275: "Corona", // urn
      0x20737275: "Great Hauberk", // urs
      0x20687375: "Troll Nest", // ush
      0x206b7375: "Demonhead", // usk
      0x20627475: "Mirrored Boots", // utb
      0x20637475: "Troll Belt", // utc
      0x20677475: "Crusader Gauntlets", // utg
      0x20687475: "Lacquered Plate", // uth
      0x20707475: "Archon Plate", // utp
      0x20737475: "Ward", // uts
      0x20757475: "Wire Fleece", // utu
      0x20637575: "Heater", // uuc
      0x20697575: "Dusk Shroud", // uui
      0x206c7575: "Shadow Plate", // uul
      0x20627675: "Scarabshell Boots", // uvb
      0x20637675: "Vampirefang Belt", // uvc
      0x20677675: "Vampirebone Gloves", // uvg
      0x206c6276: "Light Belt", // vbl
      0x20746276: "Heavy Boots", // vbt
      0x206c6776: "Heavy Gloves", // vgl
      0x20706976: "Top of the Horadric Staff", // vip
      0x20756f76: "Voulge", // vou
      0x20737076: "Stamina Potion", // vps
      0x20786177: "War Axe", // wax
      0x206d6877: "War Hammer", // whm
      0x20736d77: "Thawing Potion", // wms
      0x20646e77: "Wand", // wnd
      0x20627277: "Wrist Blade", // wrb
      0x20637377: "War Scythe", // wsc
      0x20647377: "War Sword", // wsd
      0x20707377: "War Scepter", // wsp
      0x20747377: "War Staff", // wst
      0x20706178: "War Hat", // xap
      0x20726178: "Ornate Plate", // xar
      0x206c6378: "Tigulated Mail", // xcl
      0x20616578: "Serpentskin Armor", // xea
      0x20396878: "Grim Helm", // xh9
      0x20626878: "War Boots", // xhb
      0x20676878: "War Gaunlets", // xhg
      0x206c6878: "Basinet", // xhl
      0x206d6878: "Winged helm", // xhm
      0x206e6878: "Mesh Armor", // xhn
      0x20746978: "Dragon Shield", // xit
      0x20706b78: "Sallet", // xkp
      0x20616c78: "Demonhide Armor", // xla
      0x20626c78: "Demonhide Boots", // xlb
      0x20646c78: "Sharktooth Armor", // xld
      0x20676c78: "Demonhide Gloves", // xlg
      0x206d6c78: "Casque", // xlm
      0x20746c78: "Templar Coat", // xlt
      0x20626d78: "Mesh Boots", // xmb
      0x20676d78: "Heavy Bracers", // xmg
      0x206c6d78: "Round Shield", // xml
      0x20676e78: "Linked Mail", // xng
      0x20776f78: "Pavise", // xow
      0x206b7078: "Barbed Shield", // xpk
      0x206c7078: "Russet Armor", // xpl
      0x20677278: "Scutum", // xrg
      0x206e7278: "Grand Crown", // xrn
      0x20737278: "Cuirass", // xrs
      0x20687378: "Grim Shield", // xsh
      0x206b7378: "Death Mask", // xsk
      0x20627478: "Battle Boots", // xtb
      0x20677478: "Battle Gauntlets", // xtg
      0x20687478: "Embossed Plate", // xth
      0x20707478: "Mage Plate", // xtp
      0x20737478: "Ancient Shield", // xts
      0x20757478: "Trellised Armor", // xtu
      0x20637578: "Defender", // xuc
      0x20697578: "Ghost Armor", // xui
      0x206c7578: "Chaos Armor", // xul
      0x20627678: "Sharkskin Boots", // xvb
      0x20677678: "Sharkskin Gloves", // xvg
      0x207a7978: "Potion of Life", // xyz
      0x20737079: "Antidote Potion", // yps
      0x206e7779: "Yew Wand", // ywn
      0x2062687a: "War Belt", // zhb
      0x20626c7a: "Demonhide Sash", // zlb
      0x20626d7a: "Mesh Belt", // zmb
      0x2062747a: "Battle Belt", // ztb
      0x2062767a: "Sharkskin Belt", // zvb
    },
    itemEquippedLocations: {
      0x0: "-",
      0x1: "Head",
      0x2: "Neck",
      0x3: "Torso",
      0x4: "Right Hand",
      0x5: "Left Hand",
      0x6: "Right Finger",
      0x7: "Left Finger",
      0x8: "Waist",
      0x9: "Feet",
      0xa: "Hands",
      0xb: "Alternate Right Hand",
      0xc: "Alternate Left Hand",
    },
    itemLocations: {
      0x0: "Stored",
      0x1: "Equipped",
      0x2: "Belt",
      0x6: "Socketed",
    },
    itemQualities: {
      0x0: "-",
      0x1: "Low Quality",
      0x2: "Normal",
      0x3: "High Quality",
      0x4: "Magically Enhanced",
      0x5: "Part of a Set",
      0x6: "Rare",
      0x7: "Unique",
      0x8: "Crafted",
    },
    itemStoredLocation: {
      0x0: "-",
      0x1: "Inventory",
      0x4: "Horadric Cube",
      0x5: "Stash",
    },
    progressions: {
      0x0: "-",
      0x1: "Normal: Act 1 Completed",
      0x2: "Normal: Act 2 Completed",
      0x3: "Normal: Act 3 Completed",
      0x4: "Normal: Act 4 Completed",
      0x5: "Normal: Act 5 Completed",
      0x6: "Nightmare: Act 1 Completed",
      0x7: "Nightmare: Act 2 Completed",
      0x8: "Nightmare: Act 3 Completed",
      0x9: "Nightmare: Act 4 Completed",
      0xa: "Nightmare: Act 5 Completed",
      0xb: "Hell: Act 1 Completed",
      0xc: "Hell: Act 2 Completed",
      0xd: "Hell: Act 3 Completed",
      0xe: "Hell: Act 4 Completed",
      0xf: "Hell: Act 5 Completed",
    },
  },
  resourcesLabels: {
    progressions: {
      0x1: "Normal",
      0x6: "Nightmare",
      0xb: "Hell",
    },
  },
};

export default template;
