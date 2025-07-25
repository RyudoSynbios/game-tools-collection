import type { GameJson, ItemInt } from "$lib/types";

import {
  challenges,
  characters,
  enemies,
  materias,
  weapons,
} from "./utils/resource";

const template: GameJson = {
  validator: {
    fileNames: [/ff7remake([0-9]+).sav/, /ff7remakeplus([0-9]+).sav/],
    regions: {
      world: true,
    },
    text: "Drag 'n' drop here or click to add a save file.",
    hint: 'Works with "ff7remake{xxx}.sav" and "ff7remakeplus{xxx}.sav" files.',
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
                              offset: 0x2b0,
                              type: "variable",
                              dataType: "uint32",
                              operations: [
                                {
                                  convert: { from: "seconds", to: "hours" },
                                },
                              ],
                              max: 999,
                            },
                            {
                              offset: 0x2b0,
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
                              offset: 0x2b0,
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
                          id: "gil",
                          name: "Gil",
                          offset: 0x34dd8,
                          type: "variable",
                          dataType: "int32",
                          min: 0,
                          test: true,
                        },
                      ],
                    },
                    {
                      type: "section",
                      flex: true,
                      items: [
                        {
                          name: "Unlocked Menus",
                          type: "bitflags",
                          flags: [
                            { offset: 0x42880, bit: 1, label: "Main Menu", hidden: true },
                            { offset: 0x427fe, bit: 2, label: "Play Log" },
                            { offset: 0x42883, bit: 1, label: "Chapter Selection", separator: true },
                            { offset: 0x42880, bit: 6, label: "Materia & Equipment" },
                            { offset: 0x42880, bit: 7, label: "Upgrade Weapons" },
                            { offset: 0x42881, bit: 5, label: "Battle Intel" },
                            { offset: 0x42883, bit: 2, label: "Proficiency Bonus", hidden: true },
                            { offset: 0x42abc, bit: 1, label: "Shinra Combat Simulator: Normal Challenges", hidden: true },
                          ],
                        },
                        {
                          id: "mainStoryOnly",
                          name: "Cleared Chapters on Hard",
                          type: "bitflags",
                          flags: [
                            { offset: 0x4278c, bit: 6, label: "Chapter 1: The Destruction of Mako Reactor 1" },
                            { offset: 0x4278c, bit: 7, label: "Chapter 2: Fateful Encounters" },
                            { offset: 0x4278d, bit: 0, label: "Chapter 3: Home Sweet Slum" },
                            { offset: 0x4278d, bit: 1, label: "Chapter 4: Mad Dash" },
                            { offset: 0x4278d, bit: 2, label: "Chapter 5: Dogged Pursuit" },
                            { offset: 0x4278d, bit: 3, label: "Chapter 6: Light the Way" },
                            { offset: 0x4278d, bit: 4, label: "Chapter 7: A Trap Is Sprung" },
                            { offset: 0x4278d, bit: 5, label: "Chapter 8: Budding Bodyguard" },
                            { offset: 0x4278d, bit: 6, label: "Chapter 9: The Town That Never Sleeps" },
                            { offset: 0x4278d, bit: 7, label: "Chapter 10: Rough Waters" },
                            { offset: 0x4278e, bit: 0, label: "Chapter 11: Haunted" },
                            { offset: 0x4278e, bit: 1, label: "Chapter 12: Fight for Survival" },
                            { offset: 0x4278e, bit: 2, label: "Chapter 13: A Broken Word" },
                            { offset: 0x4278e, bit: 3, label: "Chapter 14: In Search of Hope" },
                            { offset: 0x4278e, bit: 4, label: "Chapter 15: The Day Midgar Stood Still" },
                            { offset: 0x4278e, bit: 5, label: "Chapter 16: The Belly of the Beast" },
                            { offset: 0x4278e, bit: 6, label: "Chapter 17: Deliverance from Chaos" },
                            { offset: 0x4278e, bit: 7, label: "Chapter 18: Destiny's Crossroads" },
                          ],
                        },
                        {
                          id: "interMissionOnly",
                          name: "Cleared Chapters on Hard",
                          type: "bitflags",
                          flags: [
                            { offset: 0x42ce1, bit: 1, label: "Chapter 1: Wutai's Finest" },
                            { offset: 0x42ce1, bit: 2, label: "Chapter 2: Covert Ops" },
                          ],
                        },
                      ],
                    },
                  ],
                },
                {
                  id: "mainStoryOnly",
                  name: "Enemy Skills",
                  flex: true,
                  items: [
                    {
                      name: "Skill 1",
                      offset: 0x425f0,
                      type: "variable",
                      dataType: "uint32",
                      resource: "enemySkills",
                      autocomplete: true,
                    },
                    {
                      name: "Skill 2",
                      offset: 0x425f4,
                      type: "variable",
                      dataType: "uint32",
                      resource: "enemySkills",
                      autocomplete: true,
                    },
                    {
                      name: "Skill 3",
                      offset: 0x425f8,
                      type: "variable",
                      dataType: "uint32",
                      resource: "enemySkills",
                      autocomplete: true,
                    },
                    {
                      name: "Skill 4",
                      offset: 0x425fc,
                      type: "variable",
                      dataType: "uint32",
                      resource: "enemySkills",
                      autocomplete: true,
                    },
                  ],
                },
                {
                  name: "Character Outfits",
                  flex: true,
                  items: [
                    {
                      id: "mainStoryOnly",
                      type: "section",
                      flex: true,
                      items: [
                        {
                          id: "outfit",
                          name: "Cloud Strife",
                          offset: 0x4288a,
                          type: "variable",
                          dataType: "bit",
                          bit: 2,
                          resource: "mainStoryOutfits",
                        },
                        {
                          id: "outfit",
                          name: "Tifa Lockhart",
                          offset: 0x4288b,
                          type: "variable",
                          dataType: "bit",
                          bit: 4,
                          resource: "mainStoryOutfits",
                        },
                        {
                          id: "outfit",
                          name: "Aerith Gainsborough",
                          offset: 0x4288c,
                          type: "variable",
                          dataType: "bit",
                          bit: 6,
                          resource: "mainStoryOutfits",
                        },
                      ],
                    },
                    {
                      id: "interMissionOnly",
                      type: "section",
                      flex: true,
                      items: [
                        {
                          id: "yuffieOutfit",
                          name: "Yuffie Kisaragi",
                          offset: 0x42ce0,
                          type: "variable",
                          dataType: "bit",
                          bit: 4,
                          resource: "interMissionOutfits",
                        },
                      ],
                    },
                    {
                      name: "Equipped Dresses",
                      hidden: true,
                      type: "bitflags",
                      flags: [
                        { offset: 0x4288a, bit: 2, label: "Cloud Dress 1" },
                        { offset: 0x4288a, bit: 3, label: "Cloud Dress 2" },
                        { offset: 0x4288a, bit: 4, label: "Cloud Dress 3", separator: true },
                        { offset: 0x4288b, bit: 4, label: "Tifa Dress 1" },
                        { offset: 0x4288b, bit: 5, label: "Tifa Dress 2" },
                        { offset: 0x4288b, bit: 6, label: "Tifa Dress 3", separator: true },
                        { offset: 0x4288c, bit: 6, label: "Aerith Dress 1" },
                        { offset: 0x4288c, bit: 7, label: "Aerith Dress 2" },
                        { offset: 0x4288d, bit: 0, label: "Aerith Dress 3" },
                      ],
                    },
                  ],
                },
              ],
            },
          ],
        },
        {
          name: "Party",
          items: [
            {
              length: 0x40,
              type: "container",
              instanceType: "tabs",
              instances: 7,
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
                              name: "Enabled",
                              offset: 0x31,
                              type: "variable",
                              dataType: "uint8",
                              hidden: true,
                            },
                            {
                              name: "Level",
                              offset: 0x30,
                              type: "variable",
                              dataType: "uint8",
                              min: 1,
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
                        {
                          type: "section",
                          flex: true,
                          hidden: true,
                          items: [
                            {
                              name: "???",
                              offset: 0x38,
                              type: "variable",
                              dataType: "uint32",
                            },
                            {
                              name: "???",
                              offset: 0x3c,
                              type: "variable",
                              dataType: "uint32",
                            },
                            {
                              name: "???",
                              offset: 0x6c,
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
                              id: "abilities-0-%index%",
                              name: "Abilities",
                              type: "bitflags",
                              flags: [
                                { offset: 0x42786, bit: 2, label: "Focused Thrust" },
                                { offset: 0x42786, bit: 3, label: "Triple Slash" },
                                { offset: 0x42786, bit: 4, label: "Infinity's End" },
                                { offset: 0x42786, bit: 5, label: "Blade Burst" },
                                { offset: 0x42786, bit: 6, label: "Counterstance" },
                                { offset: 0x42786, bit: 7, label: "Disorder" },
                              ],
                            },
                            {
                              id: "abilities-0-%index%",
                              name: "Limit Breaks",
                              type: "bitflags",
                              flags: [
                                { offset: 0x428a5, bit: 6, label: "Ascension" },
                              ],
                            },
                            {
                              id: "abilities-1-%index%",
                              name: "Abilities",
                              type: "bitflags",
                              flags: [
                                { offset: 0x42787, bit: 4, label: "Focused Shot" },
                                { offset: 0x42787, bit: 5, label: "Lifesaver" },
                                { offset: 0x42787, bit: 6, label: "Maximum Fury" },
                                { offset: 0x42787, bit: 7, label: "Smackdown" },
                                { offset: 0x42788, bit: 0, label: "Point Blank" },
                                { offset: 0x42788, bit: 1, label: "Charging Uppercut" },
                              ],
                            },
                            {
                              id: "abilities-1-%index%",
                              name: "Limit Breaks",
                              type: "bitflags",
                              flags: [
                                { offset: 0x428a6, bit: 4, label: "Catastrophe" },
                              ],
                            },
                            {
                              id: "abilities-2-%index%",
                              name: "Abilities",
                              type: "bitflags",
                              flags: [
                                { offset: 0x42788, bit: 6, label: "Diverkick" },
                                { offset: 0x42788, bit: 7, label: "Overpower" },
                                { offset: 0x42789, bit: 0, label: "Starshower" },
                                { offset: 0x42789, bit: 1, label: "Chi Trap" },
                                { offset: 0x42789, bit: 2, label: "True Stike" },
                                { offset: 0x42789, bit: 3, label: "Focused Strike" },
                              ],
                            },
                            {
                              id: "abilities-2-%index%",
                              name: "Limit Breaks",
                              type: "bitflags",
                              flags: [
                                { offset: 0x428a7, bit: 2, label: "Dolphin Flurry" },
                              ],
                            },
                            {
                              id: "abilities-3-%index%",
                              name: "Abilities",
                              type: "bitflags",
                              flags: [
                                { offset: 0x4278a, bit: 0, label: "Arcade Ward" },
                                { offset: 0x4278a, bit: 1, label: "Sorcerous Storm" },
                                { offset: 0x4278a, bit: 2, label: "Lustrous Shield" },
                                { offset: 0x4278a, bit: 3, label: "Ray of Judgment" },
                                { offset: 0x4278a, bit: 4, label: "ATB Ward" },
                                { offset: 0x4278a, bit: 5, label: "Fleeting Familiar" },
                              ],
                            },
                            {
                              id: "abilities-3-%index%",
                              name: "Limit Breaks",
                              type: "bitflags",
                              flags: [
                                { offset: 0x428a8, bit: 0, label: "Planet's Protection" },
                              ],
                            },
                            {
                              id: "abilities-5-%index%",
                              name: "Abilities",
                              type: "bitflags",
                              flags: [
                                { offset: 0x42c62, bit: 0, label: "Elemental Ninjutsu" },
                                { offset: 0x42c62, bit: 1, label: "Brumal Form" },
                                { offset: 0x42c62, bit: 2, label: "Banishment" },
                                { offset: 0x42c62, bit: 6, label: "Cactuar Caper" },
                              ],
                            },
                            {
                              id: "abilities-6-%index%",
                              name: "Abilities",
                              type: "bitflags",
                              flags: [
                                { offset: 0x42c62, bit: 3, label: "Swirling Storm" },
                                { offset: 0x42c62, bit: 4, label: "Fighting Spirit" },
                                { offset: 0x42c62, bit: 5, label: "Incite" },
                              ],
                            },
                          ],
                        },
                      ],
                    },
                    {
                      name: "Equipment",
                      items: [
                        {
                          type: "section",
                          flex: true,
                          items: [
                            {
                              id: "equippedWeapon-%index%",
                              name: "Weapon",
                              offset: 0x1740,
                              type: "variable",
                              dataType: "uint32",
                              resource: "inventoryWeaponNames",
                              overrideShift: { parent: 1, shift: 0x20 },
                              autocomplete: true,
                            },
                            {
                              name: "Armor",
                              offset: 0x1744,
                              type: "variable",
                              dataType: "uint32",
                              resource: "armors",
                              overrideShift: { parent: 1, shift: 0x20 },
                              autocomplete: true,
                            },
                            {
                              name: "Accessory",
                              offset: 0x1748,
                              type: "variable",
                              dataType: "uint32",
                              resource: "accessories",
                              overrideShift: { parent: 1, shift: 0x20 },
                              autocomplete: true,
                            },
                            {
                              name: "Summon",
                              offset: 0x44ed4,
                              type: "variable",
                              dataType: "uint32",
                              resource: "summons",
                              overrideShift: { parent: 1, shift: 0x4 },
                              autocomplete: true,
                            },
                            {
                              name: "???",
                              offset: 0x174c,
                              type: "variable",
                              dataType: "uint32",
                              overrideShift: { parent: 1, shift: 0x20 },
                              hidden: true,
                            },
                            {
                              name: "???",
                              offset: 0x1750,
                              type: "variable",
                              dataType: "uint32",
                              overrideShift: { parent: 1, shift: 0x20 },
                              hidden: true,
                            },
                            {
                              name: "???",
                              offset: 0x1754,
                              type: "variable",
                              dataType: "uint32",
                              overrideShift: { parent: 1, shift: 0x20 },
                              hidden: true,
                            },
                            {
                              name: "???",
                              offset: 0x1758,
                              type: "variable",
                              dataType: "uint32",
                              overrideShift: { parent: 1, shift: 0x20 },
                              hidden: true,
                            },
                            {
                              name: "???",
                              offset: 0x175c,
                              type: "variable",
                              dataType: "uint32",
                              overrideShift: { parent: 1, shift: 0x20 },
                              hidden: true,
                            },
                          ],
                        },
                        {
                          name: "Weapon Materia",
                          type: "section",
                          items: [
                            {
                              type: "section",
                              flex: true,
                              hidden: true,
                              items: [
                                {
                                  id: "characterWeaponMateria-%index%",
                                  name: "???",
                                  offset: 0x40f50,
                                  type: "variable",
                                  dataType: "uint32",
                                  hidden: true,
                                },
                                {
                                  id: "characterWeaponMateria-%index%",
                                  name: "Weapon",
                                  offset: 0x40f54,
                                  type: "variable",
                                  dataType: "uint32",
                                  resource: "weapons",
                                  hidden: true,
                                },
                                {
                                  id: "characterWeaponMateria-%index%",
                                  name: "???",
                                  offset: 0x40f58,
                                  type: "variable",
                                  dataType: "uint32",
                                  hidden: true,
                                },
                                {
                                  id: "characterWeaponMateria-%index%",
                                  name: "???",
                                  offset: 0x40f5c,
                                  type: "variable",
                                  dataType: "uint32",
                                  hidden: true,
                                },
                              ],
                            },
                            {
                              type: "section",
                              flex: true,
                              items: [...Array(8).keys()].map((index) => ({
                                id: "characterWeaponMateria-%index%",
                                name: `Materia ${index + 1}`,
                                offset: 0x40f60 + index * 0x4,
                                type: "variable",
                                dataType: "uint32",
                                resource: "inventoryMateriaNames",
                                autocomplete: true,
                              })),
                            },
                          ],
                        },
                        {
                          name: "Armor Materia",
                          type: "section",
                          items: [
                            {
                              type: "section",
                              flex: true,
                              hidden: true,
                              items: [
                                {
                                  name: "Character",
                                  offset: 0x40dd0,
                                  type: "variable",
                                  dataType: "uint32",
                                  overrideShift: { parent: 1, shift: 0x30 },
                                  resource: "characters",
                                  hidden: true,
                                },
                                {
                                  name: "Armor",
                                  offset: 0x40dd4,
                                  type: "variable",
                                  dataType: "uint32",
                                  resource: "armors",
                                  overrideShift: { parent: 1, shift: 0x30 },
                                  hidden: true,
                                },
                                {
                                  name: "???",
                                  offset: 0x40dd8,
                                  type: "variable",
                                  dataType: "uint32",
                                  overrideShift: { parent: 1, shift: 0x30 },
                                  hidden: true,
                                },
                                {
                                  name: "???",
                                  offset: 0x40ddc,
                                  type: "variable",
                                  dataType: "uint32",
                                  overrideShift: { parent: 1, shift: 0x30 },
                                  hidden: true,
                                },
                              ],
                            },
                            {
                              type: "section",
                              flex: true,
                              items: [...Array(8).keys()].map((index) => ({
                                name: `Materia ${index + 1}`,
                                offset: 0x40de0 + index * 0x4,
                                type: "variable",
                                dataType: "uint32",
                                resource: "inventoryMateriaNames",
                                overrideShift: { parent: 1, shift: 0x30 },
                                autocomplete: true,
                              })),
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
          name: "Materia",
          items: [
            {
              id: "materia",
              length: 0x20,
              type: "container",
              instanceType: "tabs",
              instances: 1000,
              resource: "inventoryMateriaNames",
              vertical: true,
              items: [
                {
                  type: "section",
                  flex: true,
                  items: [
                    {
                      name: "Id",
                      offset: 0x1858,
                      type: "variable",
                      dataType: "uint32",
                      hidden: true,
                    },
                    {
                      id: "materia-%index%",
                      name: "Materia",
                      offset: 0x1844,
                      type: "variable",
                      dataType: "uint32",
                      resource: "materias",
                      autocomplete: true,
                    },
                    {
                      id: "materiaLevel",
                      name: "Level",
                      offset: 0x1840,
                      type: "variable",
                      dataType: "uint8",
                      min: 1,
                    },
                    {
                      name: "???",
                      offset: 0x1842,
                      type: "variable",
                      dataType: "uint8",
                      hidden: true,
                    },
                    {
                      id: "materiaAp",
                      name: "AP",
                      offset: 0x1848,
                      type: "variable",
                      dataType: "uint32",
                    },
                    {
                      id: "equippedBy",
                      name: "Equipped by",
                      offset: 0x1841,
                      type: "variable",
                      dataType: "uint8",
                      resource: "characters",
                      autocomplete: true,
                    },
                  ],
                },
                {
                  type: "section",
                  flex: true,
                  hidden: true,
                  items: [
                    {
                      name: "Obtained at",
                      type: "group",
                      mode: "date",
                      hidden: true,
                      items: [
                        {
                          offset: 0x1850,
                          type: "variable",
                          dataType: "uint32",
                          operations: [
                            { date: { from: "seconds", to: "day" } },
                          ],
                          leadingZeros: 1,
                          max: 31,
                        },
                        {
                          offset: 0x1850,
                          type: "variable",
                          dataType: "uint32",
                          operations: [
                            { date: { from: "seconds", to: "month" } },
                          ],
                          leadingZeros: 1,
                          max: 12,
                        },
                        {
                          offset: 0x1850,
                          type: "variable",
                          dataType: "uint32",
                          operations: [
                            { date: { from: "seconds", to: "year" } },
                          ],
                          max: 9999,
                        },
                        {
                          offset: 0x1850,
                          type: "variable",
                          dataType: "uint32",
                          operations: [
                            { date: { from: "seconds", to: "hours" } },
                          ],
                          leadingZeros: 1,
                          max: 23,
                        },
                        {
                          offset: 0x1850,
                          type: "variable",
                          dataType: "uint32",
                          operations: [
                            { date: { from: "seconds", to: "minutes" } },
                          ],
                          leadingZeros: 1,
                          max: 59,
                        },
                        {
                          offset: 0x1850,
                          type: "variable",
                          dataType: "uint32",
                          operations: [
                            { date: { from: "seconds", to: "seconds" } },
                          ],
                          leadingZeros: 1,
                          max: 59,
                        },
                      ],
                    },
                    {
                      name: "???",
                      offset: 0x1843,
                      type: "variable",
                      dataType: "uint8",
                      hidden: true,
                    },
                    {
                      name: "???",
                      offset: 0x184c,
                      type: "variable",
                      dataType: "uint32",
                      hidden: true,
                    },
                    {
                      name: "???",
                      offset: 0x1854,
                      type: "variable",
                      dataType: "uint32",
                      hidden: true,
                    },
                    {
                      name: "???",
                      offset: 0x185c,
                      type: "variable",
                      dataType: "uint32",
                      hidden: true,
                    },
                  ],
                },
              ],
            },
          ],
        },
        {
          name: "Weapons",
          items: [
            {
              id: "weapons",
              length: 0x10,
              type: "container",
              instanceType: "tabs",
              instances: 120,
              resource: "inventoryWeaponNames",
              vertical: true,
              items: [
                {
                  type: "section",
                  flex: true,
                  items: [
                    {
                      id: "weapon-%index%",
                      name: "Weapon",
                      offset: 0xf40,
                      type: "variable",
                      dataType: "uint32",
                      resource: "weapons",
                      autocomplete: true,
                    },
                    {
                      id: "proficiency-%index%",
                      name: "Proficiency",
                      offset: 0x345e6,
                      type: "variable",
                      dataType: "uint16",
                      overrideShift: { parent: 1, shift: 0x0 },
                      max: 10,
                    },
                    {
                      name: "Materia Set",
                      offset: 0xf44,
                      type: "variable",
                      dataType: "uint32",
                      hidden: true,
                    },
                    {
                      name: "???",
                      offset: 0xf48,
                      type: "variable",
                      dataType: "uint32",
                      hidden: true,
                    },
                    {
                      name: "???",
                      offset: 0xf4c,
                      type: "variable",
                      dataType: "uint32",
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
                      name: "Character",
                      offset: 0x40f50,
                      type: "variable",
                      dataType: "uint32",
                      resource: "characters",
                      overrideShift: { parent: 1, shift: 0x30 },
                      hidden: true,
                    },
                    {
                      name: "Weapon",
                      offset: 0x40f54,
                      type: "variable",
                      dataType: "uint32",
                      resource: "weapons",
                      overrideShift: { parent: 1, shift: 0x30 },
                      hidden: true,
                    },
                    {
                      name: "???",
                      offset: 0x40f58,
                      type: "variable",
                      dataType: "uint32",
                      overrideShift: { parent: 1, shift: 0x30 },
                      hidden: true,
                    },
                    {
                      name: "???",
                      offset: 0x40f5c,
                      type: "variable",
                      dataType: "uint32",
                      overrideShift: { parent: 1, shift: 0x30 },
                      hidden: true,
                    },
                  ],
                },
                {
                  type: "section",
                  flex: true,
                  items: [...Array(8).keys()].map((index) => ({
                    name: `Materia ${index + 1}`,
                    offset: 0x40f60 + index * 0x4,
                    type: "variable",
                    dataType: "uint32",
                    resource: "inventoryMateriaNames",
                    overrideShift: { parent: 1, shift: 0x30 },
                    autocomplete: true,
                  })),
                },
              ],
            },
          ],
        },
        {
          name: "Inventory",
          items: [
            {
              id: "items",
              length: 0x18,
              type: "container",
              instanceType: "tabs",
              instances: 2048,
              resource: "inventoryItemNames",
              vertical: true,
              items: [
                {
                  type: "section",
                  flex: true,
                  items: [
                    {
                      id: "item-%index%",
                      name: "Item",
                      offset: 0x34dd8,
                      type: "variable",
                      dataType: "uint32",
                      resource: "items",
                      size: "lg",
                      autocomplete: true,
                    },
                    {
                      id: "itemQuantity",
                      name: "Quantity",
                      offset: 0x34ddc,
                      type: "variable",
                      dataType: "int32",
                      min: 0,
                      max: 99,
                    },
                    {
                      name: "Type",
                      offset: 0x34de0,
                      type: "variable",
                      dataType: "uint32",
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
                      name: "Obtained at",
                      type: "group",
                      mode: "date",
                      hidden: true,
                      items: [
                        {
                          offset: 0x34dd0,
                          type: "variable",
                          dataType: "uint32",
                          operations: [
                            { date: { from: "seconds", to: "day" } },
                          ],
                          leadingZeros: 1,
                          max: 31,
                        },
                        {
                          offset: 0x34dd0,
                          type: "variable",
                          dataType: "uint32",
                          operations: [
                            { date: { from: "seconds", to: "month" } },
                          ],
                          leadingZeros: 1,
                          max: 12,
                        },
                        {
                          offset: 0x34dd0,
                          type: "variable",
                          dataType: "uint32",
                          operations: [
                            { date: { from: "seconds", to: "year" } },
                          ],
                          max: 9999,
                        },
                        {
                          offset: 0x34dd0,
                          type: "variable",
                          dataType: "uint32",
                          operations: [
                            { date: { from: "seconds", to: "hours" } },
                          ],
                          leadingZeros: 1,
                          max: 23,
                        },
                        {
                          offset: 0x34dd0,
                          type: "variable",
                          dataType: "uint32",
                          operations: [
                            { date: { from: "seconds", to: "minutes" } },
                          ],
                          leadingZeros: 1,
                          max: 59,
                        },
                        {
                          offset: 0x34dd0,
                          type: "variable",
                          dataType: "uint32",
                          operations: [
                            { date: { from: "seconds", to: "seconds" } },
                          ],
                          leadingZeros: 1,
                          max: 59,
                        },
                      ],
                    },
                    {
                      name: "???",
                      offset: 0x34dd4,
                      type: "variable",
                      dataType: "uint32",
                      hidden: true,
                    },
                    {
                      name: "???",
                      offset: 0x34de4,
                      type: "variable",
                      dataType: "uint32",
                      hidden: true,
                    },
                  ],
                },
              ],
            },
          ],
        },
        {
          id: "mainStoryOnly",
          name: "Battle Intel",
          flex: true,
          items: [
            {
              name: "Entries",
              type: "bitflags",
              flags: [
                { offset: 0x42b6e, bit: 3, label: "Report 01: Monster Bio Pt. 1" },
                { offset: 0x42b6e, bit: 4, label: "Report 02: Magic Elements Pt. 1" },
                { offset: 0x42b6e, bit: 5, label: "Report 03: The Stagger Effect Pt. 1" },
                { offset: 0x42b6e, bit: 6, label: "Report 04: The Stagger Effect Pt. 2" },
                { offset: 0x42b6e, bit: 7, label: "Report 05: Combat Simulation: Shiva" },
                { offset: 0x42b6f, bit: 0, label: "Report 06: Monster Bio Pt. 2" },
                { offset: 0x42b6f, bit: 1, label: "Report 07: Magic Elements Pt. 2" },
                { offset: 0x42b6f, bit: 2, label: "Report 08: The Manipulation Technique" },
                { offset: 0x42b6f, bit: 3, label: "Report 09: Monster Variants Pt. 1" },
                { offset: 0x42b6f, bit: 4, label: "Report 10: Combat Simulation: Fat Chocobo" },
                { offset: 0x42b6f, bit: 5, label: "Report 11: Monster Bio Pt. 3" },
                { offset: 0x42b6f, bit: 6, label: "Report 12: The Stagger Effect Pt. 3" },
                { offset: 0x42b6f, bit: 7, label: "Report 13: Refocus Analysis" },
                { offset: 0x42b70, bit: 0, label: "Report 14: The Stagger Effect Pt. 4" },
                { offset: 0x42b70, bit: 1, label: "Report 15: Combat Simulation: Leviathan" },
                { offset: 0x42b70, bit: 2, label: "Report 16: Monster Bio Pt. 4" },
                { offset: 0x42b70, bit: 3, label: "Report 17: Weapon Abilities" },
                { offset: 0x42b70, bit: 4, label: "Report 18: MP Consumption" },
                { offset: 0x42b70, bit: 5, label: "Report 19: Monster Variants Pt. 2" },
                { offset: 0x42b70, bit: 6, label: "Report 20: Combat Simulation: Bahamut" },
              ],
            },
            {
              id: "battleIntelCompleted",
              name: "Completed",
              type: "bitflags",
              flags: [
                { offset: 0x42b74, bit: 5, label: "Report 01: Monster Bio Pt. 1" },
                { offset: 0x42b74, bit: 6, label: "Report 02: Magic Elements Pt. 1" },
                { offset: 0x42b74, bit: 7, label: "Report 03: The Stagger Effect Pt. 1" },
                { offset: 0x42b75, bit: 0, label: "Report 04: The Stagger Effect Pt. 2" },
                { offset: 0x42b75, bit: 1, label: "Report 05: Combat Simulation: Shiva" },
                { offset: 0x42b75, bit: 2, label: "Report 06: Monster Bio Pt. 2" },
                { offset: 0x42b75, bit: 3, label: "Report 07: Magic Elements Pt. 2" },
                { offset: 0x42b75, bit: 4, label: "Report 08: The Manipulation Technique" },
                { offset: 0x42b75, bit: 5, label: "Report 09: Monster Variants Pt. 1" },
                { offset: 0x42b75, bit: 6, label: "Report 10: Combat Simulation: Fat Chocobo" },
                { offset: 0x42b75, bit: 7, label: "Report 11: Monster Bio Pt. 3" },
                { offset: 0x42b76, bit: 0, label: "Report 12: The Stagger Effect Pt. 3" },
                { offset: 0x42b76, bit: 1, label: "Report 13: Refocus Analysis" },
                { offset: 0x42b76, bit: 2, label: "Report 14: The Stagger Effect Pt. 4" },
                { offset: 0x42b76, bit: 3, label: "Report 15: Combat Simulation: Leviathan" },
                { offset: 0x42b76, bit: 4, label: "Report 16: Monster Bio Pt. 4" },
                { offset: 0x42b76, bit: 5, label: "Report 17: Weapon Abilities" },
                { offset: 0x42b76, bit: 6, label: "Report 18: MP Consumption" },
                { offset: 0x42b76, bit: 7, label: "Report 19: Monster Variants Pt. 2" },
                { offset: 0x42b77, bit: 0, label: "Report 20: Combat Simulation: Bahamut" },
              ],
            },
            {
              name: "Reward",
              type: "bitflags",
              flags: [
                { offset: 0x42b7a, bit: 7, label: "Auto-Cure Materia" },
                { offset: 0x42b7b, bit: 0, label: "Wind Materia" },
                { offset: 0x42b7b, bit: 1, label: "First Strike Materia" },
                { offset: 0x42b7b, bit: 2, label: "ATB Boost Materia" },
                { offset: 0x42b7b, bit: 3, label: "Shiva Materia", disabled: true },
                { offset: 0x42b7b, bit: 4, label: "Steadfast Block Materia" },
                { offset: 0x42b7b, bit: 5, label: "Steal Materia" },
                { offset: 0x42b7b, bit: 6, label: "Provoke Materia" },
                { offset: 0x42b7b, bit: 7, label: "Synergy Materia" },
                { offset: 0x42b7c, bit: 0, label: "Fat Chocobo Materia", disabled: true },
                { offset: 0x42b7c, bit: 1, label: "Item Master Materia" },
                { offset: 0x42b7c, bit: 2, label: "Parry Materia" },
                { offset: 0x42b7c, bit: 3, label: "ATB Assist Materia" },
                { offset: 0x42b7c, bit: 4, label: "ATB Stagger Materia" },
                { offset: 0x42b7c, bit: 5, label: "Leviathan Materia", disabled: true },
                { offset: 0x42b7c, bit: 6, label: "Enemy Skill Materia" },
                { offset: 0x42b7c, bit: 7, label: "Skill Master Materia" },
                { offset: 0x42b7d, bit: 0, label: "MP Absorption Materia" },
                { offset: 0x42b7d, bit: 1, label: "HP Absorption Materia" },
                { offset: 0x42b7d, bit: 2, label: "Bahamut Materia", disabled: true },
              ],
            },
            {
              id: "vrMissions",
              name: "VR Missions",
              type: "bitflags",
              hidden: true,
              flags: [
                { offset: 0x42b72, bit: 5, label: "Shiva defeated" },
                { offset: 0x42b73, bit: 2, label: "Fat Chocobo defeated" },
                { offset: 0x42b73, bit: 7, label: "Leviathan defeated" },
                { offset: 0x42b74, bit: 4, label: "Bahamut defeated" },
              ],
            },
          ],
        },
        {
          name: "Enemy Intel",
          items: enemies.map((story, index) => ({
            id: `enemyIntel-${index}`,
            type: "tabs",
            vertical: true,
            items: story.enemies.map((enemy) => {
              const shift = enemy.index * 0x8;

              return {
                name: enemy.name,
                items: [
                  {
                    type: "bitflags",
                    flags: [
                      { offset: 0x42fac + shift, bit: 0, label: "Entry" },
                      { offset: 0x42fac + shift, bit: 1, label: "Assessed" },
                      { offset: 0x42fac + shift, bit: 2, label: "???", hidden: true },
                      { offset: 0x42fac + shift, bit: 3, label: "Weakness Exploited (Magic?)", hidden: true },
                      { offset: 0x42fac + shift, bit: 4, label: "???", hidden: true },
                      { offset: 0x42fac + shift, bit: 5, label: "Staggered" },
                      { offset: 0x42fac + shift, bit: 6, label: "Weakness Exploited (Fire)", hidden: true },
                      { offset: 0x42fac + shift, bit: 7, label: "Weakness Exploited (Ice)", hidden: true },
                      { offset: 0x42fad + shift, bit: 0, label: "Weakness Exploited (Lightning)", hidden: true },
                      { offset: 0x42fad + shift, bit: 1, label: "Weakness Exploited (Wind)", hidden: true },
                      { offset: 0x42fad + shift, bit: 2, label: "Weakness Exploited (???)", hidden: true },
                      { offset: 0x42fad + shift, bit: 3, label: "Weakness Exploited (???)", hidden: true },
                      { offset: 0x42fad + shift, bit: 4, label: "Weakness Exploited (???)", hidden: true },
                      { offset: 0x42fad + shift, bit: 5, label: "Weakness Exploited (Fire)", hidden: true },
                      { offset: 0x42fad + shift, bit: 6, label: "Weakness Exploited (Ice)", hidden: true },
                      { offset: 0x42fad + shift, bit: 7, label: "Weakness Exploited (Lightning)", hidden: true },
                      { offset: 0x42fae + shift, bit: 0, label: "Weakness Exploited (Wind)", hidden: true },
                      { offset: 0x42fae + shift, bit: 1, label: "Weakness Exploited (???)", hidden: true },
                      { offset: 0x42fae + shift, bit: 2, label: "Weakness Exploited (???)", hidden: true },
                      { offset: 0x42fae + shift, bit: 3, label: "Weakness Exploited (???)", hidden: true },
                      { offset: 0x42fae + shift, bit: 4, label: "Struck by Limit Break" },
                      { offset: 0x42fae + shift, bit: 5, label: "Part Crippled" },
                      { offset: 0x42fae + shift, bit: 6, label: "Skill Learned" },
                      { offset: 0x42fae + shift, bit: 7, label: "???", hidden: true },
                      { offset: 0x42faf + shift, bit: 0, label: "???", hidden: true },
                      { offset: 0x42faf + shift, bit: 1, label: "???", hidden: true },
                      { offset: 0x42faf + shift, bit: 2, label: "???", hidden: true },
                      { offset: 0x42faf + shift, bit: 3, label: "???", hidden: true },
                      { offset: 0x42faf + shift, bit: 4, label: "???", hidden: true },
                      { offset: 0x42faf + shift, bit: 5, label: "???", hidden: true },
                      { offset: 0x42faf + shift, bit: 6, label: "???", hidden: true },
                      { offset: 0x42faf + shift, bit: 7, label: "???", hidden: true },
                    ],
                  },
                  {
                    name: "Number Defeated",
                    offset: 0x42fb0 + shift,
                    type: "variable",
                    dataType: "uint32",
                  },
                ],
              };
            }),
          })),
        },
        {
          name: "Challenges",
          items: [
            {
              type: "tabs",
              items: challenges.map((type, index) => ({
                id: `challenge-${index}`,
                name: type.name,
                items: [
                  {
                    type: "tabs",
                    vertical: true,
                    items: type.challenges.map((challenge) => {
                      const recordShift = challenge.recordIndex * 0x30;

                      return {
                        name: challenge.name,
                        items: [
                          {
                            type: "section",
                            flex: true,
                            items: [
                              {
                                id: `challengeProgression-${challenge.recordIndex}`,
                                name: "Progression",
                                offset: 0x427d9 + challenge.completionIndex,
                                type: "variable",
                                dataType: "bit",
                                bit: challenge.completionBit,
                                resource: "challengeProgressions",
                                disabled: true,
                              },
                              {
                                name: "Displayed Completed Difficulty",
                                offset: 0x46ded + recordShift,
                                type: "variable",
                                dataType: "uint8",
                                hidden: true,
                              },
                              {
                                name: "Reached Battle",
                                offset: 0x46dee + recordShift,
                                type: "variable",
                                dataType: "int8",
                                operations: [{ "+": 1 }],
                                min: 0,
                                max: 5,
                              },
                            ],
                          },
                          {
                            name: "Easy (Classic)",
                            type: "section",
                            flex: true,
                            items: [
                              {
                                name: "Progression",
                                offset: 0x46dec + recordShift,
                                type: "variable",
                                dataType: "bit",
                                bit: 1,
                                hidden: true,
                              },
                              {
                                name: "Completion Time",
                                type: "group",
                                mode: "time",
                                items: [
                                  {
                                    id: `completionTime-${challenge.recordIndex}-0`,
                                    offset: 0x46df0 + recordShift,
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
                                    max: 99,
                                  },
                                  {
                                    id: `completionTime-${challenge.recordIndex}-0`,
                                    offset: 0x46df0 + recordShift,
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
                                    id: `completionTime-${challenge.recordIndex}-0`,
                                    offset: 0x46df0 + recordShift,
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
                              ...[...Array(challenge.members).keys()].map(
                                (index) =>
                                  ({
                                    name: `Character${challenge.members > 1 ? ` ${index + 1}` : ""}`,
                                    offset: 0x46e00 + recordShift + index,
                                    type: "variable",
                                    dataType: "uint8",
                                    resource: "characters",
                                    autocomplete: true,
                                  }) as ItemInt,
                              ),
                            ],
                          },
                          {
                            name: "Easy",
                            type: "section",
                            flex: true,
                            items: [
                              {
                                name: "Progression",
                                offset: 0x46dec + recordShift,
                                type: "variable",
                                dataType: "bit",
                                bit: 2,
                                hidden: true,
                              },
                              {
                                name: "Completion Time",
                                type: "group",
                                mode: "time",
                                items: [
                                  {
                                    id: `completionTime-${challenge.recordIndex}-1`,
                                    offset: 0x46df4 + recordShift,
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
                                    max: 99,
                                  },
                                  {
                                    id: `completionTime-${challenge.recordIndex}-1`,
                                    offset: 0x46df4 + recordShift,
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
                                    id: `completionTime-${challenge.recordIndex}-1`,
                                    offset: 0x46df4 + recordShift,
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
                              ...[...Array(challenge.members).keys()].map(
                                (index) =>
                                  ({
                                    name: `Character${challenge.members > 1 ? ` ${index + 1}` : ""}`,
                                    offset: 0x46e03 + recordShift + index,
                                    type: "variable",
                                    dataType: "uint8",
                                    resource: "characters",
                                    autocomplete: true,
                                  }) as ItemInt,
                              ),
                            ],
                          },
                          {
                            name: "Normal (Classic)",
                            type: "section",
                            flex: true,
                            items: [
                              {
                                name: "Progression",
                                offset: 0x46dec + recordShift,
                                type: "variable",
                                dataType: "bit",
                                bit: 5,
                                hidden: true,
                              },
                              {
                                name: "Completion Time",
                                type: "group",
                                mode: "time",
                                items: [
                                  {
                                    id: `completionTime-${challenge.recordIndex}-4`,
                                    offset: 0x46e0c + recordShift,
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
                                    max: 99,
                                  },
                                  {
                                    id: `completionTime-${challenge.recordIndex}-4`,
                                    offset: 0x46e0c + recordShift,
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
                                    id: `completionTime-${challenge.recordIndex}-4`,
                                    offset: 0x46e0c + recordShift,
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
                              ...[...Array(challenge.members).keys()].map(
                                (index) =>
                                  ({
                                    name: `Character${challenge.members > 1 ? ` ${index + 1}` : ""}`,
                                    offset: 0x46e10 + recordShift + index,
                                    type: "variable",
                                    dataType: "uint8",
                                    resource: "characters",
                                    autocomplete: true,
                                  }) as ItemInt,
                              ),
                            ],
                          },
                          {
                            name: "Normal",
                            type: "section",
                            flex: true,
                            items: [
                              {
                                name: "Progression",
                                offset: 0x46dec + recordShift,
                                type: "variable",
                                dataType: "bit",
                                bit: 3,
                                hidden: true,
                              },
                              {
                                name: "Completion Time",
                                type: "group",
                                mode: "time",
                                items: [
                                  {
                                    id: `completionTime-${challenge.recordIndex}-2`,
                                    offset: 0x46df8 + recordShift,
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
                                    max: 99,
                                  },
                                  {
                                    id: `completionTime-${challenge.recordIndex}-2`,
                                    offset: 0x46df8 + recordShift,
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
                                    id: `completionTime-${challenge.recordIndex}-2`,
                                    offset: 0x46df8 + recordShift,
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
                              ...[...Array(challenge.members).keys()].map(
                                (index) =>
                                  ({
                                    name: `Character${challenge.members > 1 ? ` ${index + 1}` : ""}`,
                                    offset: 0x46e06 + recordShift + index,
                                    type: "variable",
                                    dataType: "uint8",
                                    resource: "characters",
                                    autocomplete: true,
                                  }) as ItemInt,
                              ),
                            ],
                          },
                          {
                            name: "Hard",
                            type: "section",
                            flex: true,
                            items: [
                              {
                                name: "Progression",
                                offset: 0x46dec + recordShift,
                                type: "variable",
                                dataType: "bit",
                                bit: 4,
                                hidden: true,
                              },
                              {
                                name: "Completion Time",
                                type: "group",
                                mode: "time",
                                items: [
                                  {
                                    id: `completionTime-${challenge.recordIndex}-3`,
                                    offset: 0x46dfc + recordShift,
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
                                    max: 99,
                                  },
                                  {
                                    id: `completionTime-${challenge.recordIndex}-3`,
                                    offset: 0x46dfc + recordShift,
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
                                    id: `completionTime-${challenge.recordIndex}-3`,
                                    offset: 0x46dfc + recordShift,
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
                              ...[...Array(challenge.members).keys()].map(
                                (index) =>
                                  ({
                                    name: `Character${challenge.members > 1 ? ` ${index + 1}` : ""}`,
                                    offset: 0x46e09 + recordShift + index,
                                    type: "variable",
                                    dataType: "uint8",
                                    resource: "characters",
                                    autocomplete: true,
                                  }) as ItemInt,
                              ),
                            ],
                          },
                        ],
                      };
                    }),
                  },
                ],
              })),
            },
          ],
        },
        {
          name: "Events",
          flex: true,
          hidden: true,
          items: [
            {
              name: "Gift Box New Flags",
              offset: 0x428ac,
              type: "variable",
              dataType: "uint32",
            },
            {
              name: "Gift Box Cactuar Related",
              offset: 0x45694,
              type: "variable",
              dataType: "uint32",
            },
            {
              name: "Gift Box Cactuar Acquired",
              offset: 0x46dcc,
              type: "variable",
              dataType: "uint8",
            },
            {
              name: "Chest: Tuft of Phoenix Down",
              offset: 0x50100,
              type: "variable",
              dataType: "uint32",
            },
            {
              name: "Chest: Tuft of Phoenix Down",
              offset: 0x50120,
              type: "variable",
              dataType: "uint32",
            },
          ],
        },
      ],
    },
  ],
  resources: {
    accessories: "getInventoryNames(9)",
    armors: "getInventoryNames(8)",
    challengeProgressions: {
      0x0: "-",
      0x1: "Completed",
    },
    characters: {
      ...characters,
      0x9: "-",
    },
    enemySkills: {
      0x0: "-",
      0x8760d: "Spirit Siphon",
      0xbfa73: "Algid Aura",
      0x1a61c4: "Self-Destruct",
      0x1a7cdf: "Bad Breath",
    },
    interMissionOutfits: {
      0x0: "Moogle",
      0x1: "Standard",
    },
    items: "getItemNames()",
    inventoryItemNames: "getInventoryItemNames()",
    inventoryMateriaNames: "getInventoryMateriaNames()",
    inventoryWeaponNames: "getInventoryWeaponNames()",
    materias: {
      0x0: "-",
      ...materias,
    },
    mainStoryOutfits: {
      0x0: "Standard",
      0x1: "Dress 1",
      0x2: "Dress 2",
      0x3: "Dress 3",
    },
    summons: "getInventoryMateriaNames('summons')",
    weapons: {
      0x0: "-",
      ...weapons,
    },
  },
  resourcesGroups: {
    items: "getItemResourceGroups()",
    materias: "getMateriaResourceGroups()",
  },
  resourcesOrder: {
    accessories: [0xffffffff],
    armors: [0xffffffff],
    characters: [0x9],
    enemySkills: [0x0, 0x1a61c4, 0x8760d, 0xbfa73, 0x1a7cdf],
    interMissionOutfits: [0x1],
    inventoryMateriaNames: [0xffffffff],
    inventoryWeaponNames: [0xffffffff],
    items: [
      0xffffffff, 0x1, 0x2, 0x16, 0x3, 0x4, 0x5, 0x6, 0x7, 0x15, 0x13, 0x8, 0x9,
      0xa, 0xb, 0xc, 0xd, 0xf, 0xe, 0x12, 0x10, 0x11, 0x20, 0x21, 0x1f, 0x22,
      0x14, 0x76, 0x90, 0x7a, 0x7b, 0x6f, 0x73, 0x64, 0x7c, 0x94, 0x95, 0x9b,
      0x77, 0x66, 0x8b, 0x8c, 0xac, 0xab, 0x96, 0x97, 0x8d, 0x8e, 0x98, 0x99,
      0x9a, 0x8f, 0x67, 0xaa, 0x68, 0x9f, 0xad, 0xa4, 0xa3, 0xa9, 0x75, 0x9c,
      0x84, 0x9d, 0x7f, 0x9e, 0x7e, 0xa0, 0xa1, 0xa2, 0x74, 0x78, 0xa5, 0xa6,
      0xa7, 0xa8, 0x79, 0xae, 0xaf, 0xb0, 0xb1, 0xb2, 0xb3, 0xb4, 0xb5, 0xb6,
      0xb7, 0xb8, 0xb9, 0x210, 0x211, 0x212, 0x213, 0x214, 0x215, 0x216, 0x217,
      0x218, 0x219, 0x21a, 0x21b, 0x21c, 0x21d, 0x21e, 0x21f, 0x220, 0x221,
      0x222, 0x223, 0x224, 0x225, 0x226, 0x227, 0x228, 0x229, 0x22a, 0x22b,
      0x22c, 0x22d, 0x22e, 0x22f, 0x230, 0x231, 0x232, 0x233, 0x234, 0x235,
      0x235f, 0x2360, 0x2361, 0x2329, 0x232a, 0x2350, 0x232f, 0x2334, 0x232b,
      0x2351, 0x2330, 0x2335, 0x232c, 0x2352, 0x2331, 0x2336, 0x232d, 0x2353,
      0x2332, 0x2337, 0x232e, 0x2354, 0x2333, 0x2338, 0x2365, 0x2366, 0x2367,
      0x2368, 0x2339, 0x233a, 0x233b, 0x233c, 0x235b, 0x235c, 0x235d, 0x235e,
      0x234a, 0x234c, 0x233e, 0x233d, 0x234b, 0x234d, 0x234e, 0x235a, 0x233f,
      0x2348, 0x2345, 0x2346, 0x2340, 0x2349, 0x2341, 0x2344, 0x234f, 0x2343,
      0x2342, 0x2347, 0x2364, 0x2362, 0x2363, 0x2369, 0x236b, 0x236c, 0x236a,
      0x2355, 0x101, 0x109, 0x12c, 0x102, 0x105, 0x116, 0x11f, 0x12e, 0x114,
      0x110, 0x113, 0x112, 0x120, 0x11b, 0x11a, 0x11d, 0x111, 0x108, 0x10e,
      0x10c, 0x10a, 0x121, 0x10b, 0x11e, 0x12d, 0x127, 0x104, 0x106, 0x124,
      0x11c, 0x12f, 0x13c, 0x13d, 0x13e, 0x13f, 0x140, 0x141, 0x142, 0x143,
      0x144, 0x145, 0x146, 0x147, 0x148, 0x149, 0x14b, 0x14c, 0x14d, 0x14e,
      0x14f, 0x150, 0x151, 0x152, 0x153, 0x154, 0x155, 0x156, 0x157, 0x158,
      0x15a, 0x15b, 0x15c, 0x15d, 0x15e, 0x15f, 0x160, 0x161, 0x162, 0x163,
      0x164, 0x165, 0x166, 0x167, 0x169, 0x16a, 0x16b, 0x16c, 0x16d, 0x16e,
      0x16f, 0x170, 0x171, 0x172, 0x173, 0x174, 0x175, 0x176, 0x17c, 0x17d,
      0x17e, 0x17f, 0x1f4, 0x1f5, 0x1f6, 0x1f7, 0x1f8, 0x1f9, 0x1fa, 0x1fb,
      0x1fc, 0x1fd, 0x1fe, 0x1ff, 0x200, 0x201, 0x202, 0x203, 0x204, 0x205,
      0x206, 0x207, 0x208, 0x209, 0x20a, 0x20b, 0x20c, 0x20d, 0x20e, 0x20f,
    ],
    materias: [
      0x0, 0x2711, 0x2712, 0x2713, 0x2714, 0x2715, 0x2716, 0x2717, 0x2718,
      0x271b, 0x2719, 0x271c, 0x271a, 0x2afa, 0x2af9, 0x2afb, 0x2afe, 0x2afc,
      0x2afd, 0x2aff, 0x2ee4, 0x2ee2, 0x2ee6, 0x2ee5, 0x2ee1, 0x2ee3, 0x2b00,
      0x32c9, 0x32ca, 0x32cb, 0x32cc, 0x32cd, 0x32ce, 0x32d4, 0x32d5, 0x32d1,
      0x32d7, 0x32cf, 0x32d0, 0x32d6, 0x32d8, 0x32d2, 0x32d3, 0x32da, 0x32d9,
      0x36b7, 0x36b8, 0x36b9, 0x36b3, 0x36b1, 0x36b2, 0x36b6, 0x36b4, 0x36b5,
      0x36ba,
    ],
    summons: [0xffffffff],
  },
};

export default template;
