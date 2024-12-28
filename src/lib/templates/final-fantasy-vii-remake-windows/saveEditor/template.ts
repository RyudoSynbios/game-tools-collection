import type { GameJson } from "$lib/types";

import { challenges, characters, materias, weapons } from "./utils/resource";

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
                },
              ],
            },
            {
              id: "characterOutfits",
              name: "Character Outfits",
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
                  resource: "outfits",
                },
                {
                  id: "outfit",
                  name: "Tifa Lockhart",
                  offset: 0x4288b,
                  type: "variable",
                  dataType: "bit",
                  bit: 4,
                  resource: "outfits",
                },
                {
                  id: "outfit",
                  name: "Aerith Gainsborough",
                  offset: 0x4288c,
                  type: "variable",
                  dataType: "bit",
                  bit: 6,
                  resource: "outfits",
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
                    { offset: 0x42880, bit: 1, label: "Main Menu", hidden: true, }, // prettier-ignore
                    { offset: 0x427FE, bit: 2, label: "Play Log", }, // prettier-ignore
                    { offset: 0x42883, bit: 1, label: "Chapter Selection", separator: true, }, // prettier-ignore
                    { offset: 0x42880, bit: 6, label: "Materia & Equipment", }, // prettier-ignore
                    { offset: 0x42880, bit: 7, label: "Upgrade Weapons", }, // prettier-ignore
                    { offset: 0x42881, bit: 5, label: "Battle Intel", }, // prettier-ignore
                    { offset: 0x42883, bit: 2, label: "Proficiency Bonus", hidden: true, }, // prettier-ignore
                    { offset: 0x42ABC, bit: 1, label: "Shinra Combat Simulator: Normal Challenges", hidden: true, }, // prettier-ignore
                  ],
                },
                {
                  name: "Equipped Dresses",
                  hidden: true,
                  type: "bitflags",
                  flags: [
                    { offset: 0x4288a, bit: 2, label: "Cloud Dress 1" }, // prettier-ignore
                    { offset: 0x4288a, bit: 3, label: "Cloud Dress 2" }, // prettier-ignore
                    { offset: 0x4288a, bit: 4, label: "Cloud Dress 3", separator: true }, // prettier-ignore
                    { offset: 0x4288b, bit: 4, label: "Tifa Dress 1" }, // prettier-ignore
                    { offset: 0x4288b, bit: 5, label: "Tifa Dress 2" }, // prettier-ignore
                    { offset: 0x4288b, bit: 6, label: "Tifa Dress 3", separator: true }, // prettier-ignore
                    { offset: 0x4288c, bit: 6, label: "Aerith Dress 1" }, // prettier-ignore
                    { offset: 0x4288c, bit: 7, label: "Aerith Dress 2" }, // prettier-ignore
                    { offset: 0x4288d, bit: 0, label: "Aerith Dress 3" }, // prettier-ignore
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
              id: "materia",
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
                      ],
                    },
                    {
                      name: "Abilities",
                      flex: true,
                      items: [
                        {
                          id: "abilities-0-%index%",
                          type: "bitflags",
                          flags: [
                            { offset: 0x42786, bit: 2, label: "Focused Thrust" }, // prettier-ignore
                            { offset: 0x42786, bit: 3, label: "Triple Slash" }, // prettier-ignore
                            { offset: 0x42786, bit: 4, label: "Infinity's End" }, // prettier-ignore
                            { offset: 0x42786, bit: 5, label: "Blade Burst" }, // prettier-ignore
                            { offset: 0x42786, bit: 6, label: "Counterstance" }, // prettier-ignore
                            { offset: 0x42786, bit: 7, label: "Disorder" }, // prettier-ignore
                          ],
                        },
                        {
                          id: "abilities-1-%index%",
                          type: "bitflags",
                          flags: [
                            { offset: 0x42787, bit: 4, label: "Focused Shot" }, // prettier-ignore
                            { offset: 0x42787, bit: 5, label: "Lifesaver" }, // prettier-ignore
                            { offset: 0x42787, bit: 6, label: "Maximum Fury" }, // prettier-ignore
                            { offset: 0x42787, bit: 7, label: "Smackdown" }, // prettier-ignore
                            { offset: 0x42788, bit: 0, label: "Point Blank" }, // prettier-ignore
                            { offset: 0x42788, bit: 1, label: "Charging Uppercut" }, // prettier-ignore
                          ],
                        },
                        {
                          id: "abilities-2-%index%",
                          type: "bitflags",
                          flags: [
                            { offset: 0x42788, bit: 6, label: "Diverkick" }, // prettier-ignore
                            { offset: 0x42788, bit: 7, label: "Overpower" }, // prettier-ignore
                            { offset: 0x42789, bit: 0, label: "Starshower" }, // prettier-ignore
                            { offset: 0x42789, bit: 1, label: "Chi Trap" }, // prettier-ignore
                            { offset: 0x42789, bit: 2, label: "True Stike" }, // prettier-ignore
                            { offset: 0x42789, bit: 3, label: "Focused Strike" }, // prettier-ignore
                          ],
                        },
                        {
                          id: "abilities-3-%index%",
                          type: "bitflags",
                          flags: [
                            { offset: 0x4278A, bit: 0, label: "Arcade Ward" }, // prettier-ignore
                            { offset: 0x4278A, bit: 1, label: "Sorcerous Storm" }, // prettier-ignore
                            { offset: 0x4278A, bit: 2, label: "Lustrous Shield" }, // prettier-ignore
                            { offset: 0x4278A, bit: 3, label: "Ray of Judgment" }, // prettier-ignore
                            { offset: 0x4278A, bit: 4, label: "ATB Ward" }, // prettier-ignore
                            { offset: 0x4278A, bit: 5, label: "Fleeting Familiar" }, // prettier-ignore
                          ],
                        },
                        {
                          id: "abilities-5-%index%",
                          type: "bitflags",
                          flags: [
                            { offset: 0x42C62, bit: 0, label: "Elemental Ninjutsu" }, // prettier-ignore
                            { offset: 0x42C62, bit: 1, label: "Brumal Form" }, // prettier-ignore
                            { offset: 0x42C62, bit: 2, label: "Banishment" }, // prettier-ignore
                            { offset: 0x42C62, bit: 6, label: "Cactuar Caper" }, // prettier-ignore
                          ],
                        },
                        {
                          id: "abilities-6-%index%",
                          type: "bitflags",
                          flags: [
                            { offset: 0x42C62, bit: 3, label: "Swirling Storm" }, // prettier-ignore
                            { offset: 0x42C62, bit: 4, label: "Fighting Spirit" }, // prettier-ignore
                            { offset: 0x42C62, bit: 5, label: "Incite" }, // prettier-ignore
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
                          flex: true,
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
                          flex: true,
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
          id: "battleIntel",
          name: "Battle Intel",
          flex: true,
          items: [
            {
              name: "Entries",
              type: "bitflags",
              flags: [
                { offset: 0x42B6E, bit: 3, label: "Report 01: Monster Bio Pt. 1" }, // prettier-ignore
                { offset: 0x42B6E, bit: 4, label: "Report 02: Magic Elements Pt. 1" }, // prettier-ignore
                { offset: 0x42B6E, bit: 5, label: "Report 03: The Stagger Effect Pt. 1" }, // prettier-ignore
                { offset: 0x42B6E, bit: 6, label: "Report 04: The Stagger Effect Pt. 2" }, // prettier-ignore
                { offset: 0x42B6E, bit: 7, label: "Report 05: Combat Simulation: Shiva" }, // prettier-ignore
                { offset: 0x42B6F, bit: 0, label: "Report 06: Monster Bio Pt. 2" }, // prettier-ignore
                { offset: 0x42B6F, bit: 1, label: "Report 07: Magic Elements Pt. 2" }, // prettier-ignore
                { offset: 0x42B6F, bit: 2, label: "Report 08: The Manipulation Technique" }, // prettier-ignore
                { offset: 0x42B6F, bit: 3, label: "Report 09: Monster Variants Pt. 1" }, // prettier-ignore
                { offset: 0x42B6F, bit: 4, label: "Report 10: Combat Simulation: Fat Chocobo" }, // prettier-ignore
                { offset: 0x42B6F, bit: 5, label: "Report 11: Monster Bio Pt. 3" }, // prettier-ignore
                { offset: 0x42B6F, bit: 6, label: "Report 12: The Stagger Effect Pt. 3" }, // prettier-ignore
                { offset: 0x42B6F, bit: 7, label: "Report 13: Refocus Analysis" }, // prettier-ignore
                { offset: 0x42B70, bit: 0, label: "Report 14: The Stagger Effect Pt. 4" }, // prettier-ignore
                { offset: 0x42B70, bit: 1, label: "Report 15: Combat Simulation: Leviathan" }, // prettier-ignore
                { offset: 0x42B70, bit: 2, label: "Report 16: Monster Bio Pt. 4" }, // prettier-ignore
                { offset: 0x42B70, bit: 3, label: "Report 17: Weapon Abilities" }, // prettier-ignore
                { offset: 0x42B70, bit: 4, label: "Report 18: MP Consumption" }, // prettier-ignore
                { offset: 0x42B70, bit: 5, label: "Report 19: Monster Variants Pt. 2" }, // prettier-ignore
                { offset: 0x42B70, bit: 6, label: "Report 20: Combat Simulation: Bahamut" }, // prettier-ignore
              ],
            },
            {
              name: "Completed",
              type: "bitflags",
              flags: [
                { offset: 0x42B74, bit: 5, label: "Report 01: Monster Bio Pt. 1" }, // prettier-ignore
                { offset: 0x42B74, bit: 6, label: "Report 02: Magic Elements Pt. 1" }, // prettier-ignore
                { offset: 0x42B74, bit: 7, label: "Report 03: The Stagger Effect Pt. 1" }, // prettier-ignore
                { offset: 0x42B75, bit: 0, label: "Report 04: The Stagger Effect Pt. 2" }, // prettier-ignore
                { offset: 0x42B75, bit: 1, label: "Report 05: Combat Simulation: Shiva" }, // prettier-ignore
                { offset: 0x42B75, bit: 2, label: "Report 06: Monster Bio Pt. 2" }, // prettier-ignore
                { offset: 0x42B75, bit: 3, label: "Report 07: Magic Elements Pt. 2" }, // prettier-ignore
                { offset: 0x42B75, bit: 4, label: "Report 08: The Manipulation Technique" }, // prettier-ignore
                { offset: 0x42B75, bit: 5, label: "Report 09: Monster Variants Pt. 1" }, // prettier-ignore
                { offset: 0x42B75, bit: 6, label: "Report 10: Combat Simulation: Fat Chocobo" }, // prettier-ignore
                { offset: 0x42B75, bit: 7, label: "Report 11: Monster Bio Pt. 3" }, // prettier-ignore
                { offset: 0x42B76, bit: 0, label: "Report 12: The Stagger Effect Pt. 3" }, // prettier-ignore
                { offset: 0x42B76, bit: 1, label: "Report 13: Refocus Analysis" }, // prettier-ignore
                { offset: 0x42B76, bit: 2, label: "Report 14: The Stagger Effect Pt. 4" }, // prettier-ignore
                { offset: 0x42B76, bit: 3, label: "Report 15: Combat Simulation: Leviathan" }, // prettier-ignore
                { offset: 0x42B76, bit: 4, label: "Report 16: Monster Bio Pt. 4" }, // prettier-ignore
                { offset: 0x42B76, bit: 5, label: "Report 17: Weapon Abilities" }, // prettier-ignore
                { offset: 0x42B76, bit: 6, label: "Report 18: MP Consumption" }, // prettier-ignore
                { offset: 0x42B76, bit: 7, label: "Report 19: Monster Variants Pt. 2" }, // prettier-ignore
                { offset: 0x42B77, bit: 0, label: "Report 20: Combat Simulation: Bahamut" }, // prettier-ignore
              ],
            },
            {
              name: "Reward",
              type: "bitflags",
              flags: [
                { offset: 0x42B7A, bit: 7, label: "Auto-Cure Materia" }, // prettier-ignore
                { offset: 0x42B7B, bit: 0, label: "Wind Materia" }, // prettier-ignore
                { offset: 0x42B7B, bit: 1, label: "First Strike Materia" }, // prettier-ignore
                { offset: 0x42B7B, bit: 2, label: "ATB Boost Materia" }, // prettier-ignore
                { offset: 0x42B7B, bit: 3, label: "Shiva Materia", disabled: true }, // prettier-ignore
                { offset: 0x42B7B, bit: 4, label: "Steadfast Block Materia" }, // prettier-ignore
                { offset: 0x42B7B, bit: 5, label: "Steal Materia" }, // prettier-ignore
                { offset: 0x42B7B, bit: 6, label: "Provoke Materia" }, // prettier-ignore
                { offset: 0x42B7B, bit: 7, label: "Synergy Materia" }, // prettier-ignore
                { offset: 0x42B7C, bit: 0, label: "Fat Chocobo Materia", disabled: true }, // prettier-ignore
                { offset: 0x42B7C, bit: 1, label: "Item Master Materia" }, // prettier-ignore
                { offset: 0x42B7C, bit: 2, label: "Parry Materia" }, // prettier-ignore
                { offset: 0x42B7C, bit: 3, label: "ATB Assist Materia" }, // prettier-ignore
                { offset: 0x42B7C, bit: 4, label: "ATB Stagger Materia" }, // prettier-ignore
                { offset: 0x42B7C, bit: 5, label: "Leviathan Materia", disabled: true }, // prettier-ignore
                { offset: 0x42B7C, bit: 6, label: "Enemy Skill Materia" }, // prettier-ignore
                { offset: 0x42B7C, bit: 7, label: "Skill Master Materia" }, // prettier-ignore
                { offset: 0x42B7D, bit: 0, label: "MP Absorption Materia" }, // prettier-ignore
                { offset: 0x42B7D, bit: 1, label: "HP Absorption Materia" }, // prettier-ignore
                { offset: 0x42B7D, bit: 2, label: "Bahamut Materia", disabled: true }, // prettier-ignore
              ],
            },
          ],
        },
        {
          name: "Enemy Intel",
          items: [
            {
              length: 0x8,
              type: "container",
              instanceType: "tabs",
              instances: 1000,
              resource: "enemies",
              resourceOrder: true,
              vertical: true,
              flex: true,
              items: [
                {
                  name: "Flags",
                  type: "bitflags",
                  flags: [
                    { offset: 0x42fac, bit: 0, label: "Entry" }, // prettier-ignore
                    { offset: 0x42fac, bit: 1, label: "Assessed" }, // prettier-ignore
                    { offset: 0x42fac, bit: 2, label: "???", hidden: true }, // prettier-ignore
                    { offset: 0x42fac, bit: 3, label: "Weakness Exploited (Magic?)", hidden: true }, // prettier-ignore
                    { offset: 0x42fac, bit: 4, label: "???", hidden: true }, // prettier-ignore
                    { offset: 0x42fac, bit: 5, label: "Staggered" }, // prettier-ignore
                    { offset: 0x42fac, bit: 6, label: "Weakness Exploited (Fire)" }, // prettier-ignore
                    { offset: 0x42fac, bit: 7, label: "Weakness Exploited (Ice)" }, // prettier-ignore
                  ],
                },
                {
                  name: "Flags",
                  type: "bitflags",
                  flags: [
                    { offset: 0x42fad, bit: 0, label: "Weakness Exploited (Lightning)" }, // prettier-ignore
                    { offset: 0x42fad, bit: 1, label: "Weakness Exploited (Wind)" }, // prettier-ignore
                    { offset: 0x42fad, bit: 2, label: "Weakness Exploited (???)", hidden: true }, // prettier-ignore
                    { offset: 0x42fad, bit: 3, label: "Weakness Exploited (???)", hidden: true }, // prettier-ignore
                    { offset: 0x42fad, bit: 4, label: "Weakness Exploited (???)", hidden: true }, // prettier-ignore
                    { offset: 0x42fad, bit: 5, label: "Weakness Exploited (Fire)" }, // prettier-ignore
                    { offset: 0x42fad, bit: 6, label: "Weakness Exploited (Ice)" }, // prettier-ignore
                    { offset: 0x42fad, bit: 7, label: "Weakness Exploited (Lightning)" }, // prettier-ignore
                  ],
                },
                {
                  name: "Flags",
                  type: "bitflags",
                  flags: [
                    { offset: 0x42fae, bit: 0, label: "Weakness Exploited (Wind)" }, // prettier-ignore
                    { offset: 0x42fae, bit: 1, label: "Weakness Exploited (???)" }, // prettier-ignore
                    { offset: 0x42fae, bit: 2, label: "Weakness Exploited (???)" }, // prettier-ignore
                    { offset: 0x42fae, bit: 3, label: "Weakness Exploited (???)" }, // prettier-ignore
                    { offset: 0x42fae, bit: 4, label: "Struck by Limit Break" }, // prettier-ignore
                    { offset: 0x42fae, bit: 5, label: "Part Crippled" }, // prettier-ignore
                    { offset: 0x42fae, bit: 6, label: "Skill Learned" }, // prettier-ignore
                    { offset: 0x42fae, bit: 7, label: "???", hidden: true }, // prettier-ignore
                  ],
                },
                {
                  name: "Flags",
                  type: "bitflags",
                  flags: [
                    { offset: 0x42faf, bit: 0, label: "???", hidden: true }, // prettier-ignore
                    { offset: 0x42faf, bit: 1, label: "???", hidden: true }, // prettier-ignore
                    { offset: 0x42faf, bit: 2, label: "???", hidden: true }, // prettier-ignore
                    { offset: 0x42faf, bit: 3, label: "???", hidden: true }, // prettier-ignore
                    { offset: 0x42faf, bit: 4, label: "???", hidden: true }, // prettier-ignore
                    { offset: 0x42faf, bit: 5, label: "???", hidden: true }, // prettier-ignore
                    { offset: 0x42faf, bit: 6, label: "???", hidden: true }, // prettier-ignore
                    { offset: 0x42faf, bit: 7, label: "???", hidden: true }, // prettier-ignore
                  ],
                },
                {
                  name: "Number Defeated",
                  offset: 0x42fb0,
                  type: "variable",
                  dataType: "uint32",
                },
              ],
            },
          ],
        },
        {
          name: "Challenges",
          items: [
            {
              type: "tabs",
              items: challenges.map((challenge, index) => ({
                id: `challenge-${index}`,
                name: challenge.name,
                items: [
                  {
                    type: "tabs",
                    vertical: true,
                    items: challenge.challenges.map((challenge) => ({
                      name: challenge.name,
                      items: [
                        {
                          type: "section",
                          flex: true,
                          items: [
                            {
                              name: "Completed",
                              offset: 0x427d9 + challenge.completionIndex,
                              type: "variable",
                              dataType: "bit",
                              bit: challenge.completionBit,
                              hidden: true,
                            },
                            {
                              name: "Displayed Completed Difficulty",
                              offset: 0x46ded + challenge.recordIndex * 0x30,
                              type: "variable",
                              dataType: "uint8",
                            },
                            {
                              name: "Battles Completed",
                              offset: 0x46dee + challenge.recordIndex * 0x30,
                              type: "variable",
                              dataType: "uint8",
                            },
                          ],
                        },
                        {
                          name: "Easy (Classic)",
                          type: "section",
                          flex: true,
                          items: [
                            {
                              name: "Completed",
                              offset: 0x46dec + challenge.recordIndex * 0x30,
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
                                  offset:
                                    0x46df0 + challenge.recordIndex * 0x30,
                                  type: "variable",
                                  dataType: "uint32",
                                  operations: [
                                    {
                                      convert: { from: "seconds", to: "hours" },
                                    },
                                  ],
                                  max: 99,
                                },
                                {
                                  offset:
                                    0x46df0 + challenge.recordIndex * 0x30,
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
                                  offset:
                                    0x46df0 + challenge.recordIndex * 0x30,
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
                              name: "Character 1",
                              offset: 0x46e00 + challenge.recordIndex * 0x30,
                              type: "variable",
                              dataType: "uint8",
                              resource: "characters",
                              autocomplete: true,
                            },
                            {
                              name: "Character 2",
                              offset: 0x46e01 + challenge.recordIndex * 0x30,
                              type: "variable",
                              dataType: "uint8",
                              resource: "characters",
                              autocomplete: true,
                            },
                            {
                              name: "Character 3",
                              offset: 0x46e02 + challenge.recordIndex * 0x30,
                              type: "variable",
                              dataType: "uint8",
                              resource: "characters",
                              autocomplete: true,
                            },
                          ],
                        },
                        {
                          name: "Easy",
                          type: "section",
                          flex: true,
                          items: [
                            {
                              name: "Completed",
                              offset: 0x46dec + challenge.recordIndex * 0x30,
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
                                  offset:
                                    0x46df4 + challenge.recordIndex * 0x30,
                                  type: "variable",
                                  dataType: "uint32",
                                  operations: [
                                    {
                                      convert: { from: "seconds", to: "hours" },
                                    },
                                  ],
                                  max: 99,
                                },
                                {
                                  offset:
                                    0x46df4 + challenge.recordIndex * 0x30,
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
                                  offset:
                                    0x46df4 + challenge.recordIndex * 0x30,
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
                              name: "Character 1",
                              offset: 0x46e03 + challenge.recordIndex * 0x30,
                              type: "variable",
                              dataType: "uint8",
                              resource: "characters",
                              autocomplete: true,
                            },
                            {
                              name: "Character 2",
                              offset: 0x46e04 + challenge.recordIndex * 0x30,
                              type: "variable",
                              dataType: "uint8",
                              resource: "characters",
                              autocomplete: true,
                            },
                            {
                              name: "Character 3",
                              offset: 0x46e05 + challenge.recordIndex * 0x30,
                              type: "variable",
                              dataType: "uint8",
                              resource: "characters",
                              autocomplete: true,
                            },
                          ],
                        },
                        {
                          name: "Normal (Classic)",
                          type: "section",
                          flex: true,
                          items: [
                            {
                              name: "Completed",
                              offset: 0x46dec + challenge.recordIndex * 0x30,
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
                                  offset:
                                    0x46e0c + challenge.recordIndex * 0x30,
                                  type: "variable",
                                  dataType: "uint32",
                                  operations: [
                                    {
                                      convert: { from: "seconds", to: "hours" },
                                    },
                                  ],
                                  max: 99,
                                },
                                {
                                  offset:
                                    0x46e0c + challenge.recordIndex * 0x30,
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
                                  offset:
                                    0x46e0c + challenge.recordIndex * 0x30,
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
                              name: "Character 1",
                              offset: 0x46e10 + challenge.recordIndex * 0x30,
                              type: "variable",
                              dataType: "uint8",
                              resource: "characters",
                              autocomplete: true,
                            },
                            {
                              name: "Character 2",
                              offset: 0x46e11 + challenge.recordIndex * 0x30,
                              type: "variable",
                              dataType: "uint8",
                              resource: "characters",
                              autocomplete: true,
                            },
                            {
                              name: "Character 3",
                              offset: 0x46e12 + challenge.recordIndex * 0x30,
                              type: "variable",
                              dataType: "uint8",
                              resource: "characters",
                              autocomplete: true,
                            },
                          ],
                        },
                        {
                          name: "Normal",
                          type: "section",
                          flex: true,
                          items: [
                            {
                              name: "Completed",
                              offset: 0x46dec + challenge.recordIndex * 0x30,
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
                                  offset:
                                    0x46df8 + challenge.recordIndex * 0x30,
                                  type: "variable",
                                  dataType: "uint32",
                                  operations: [
                                    {
                                      convert: { from: "seconds", to: "hours" },
                                    },
                                  ],
                                  max: 99,
                                },
                                {
                                  offset:
                                    0x46df8 + challenge.recordIndex * 0x30,
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
                                  offset:
                                    0x46df8 + challenge.recordIndex * 0x30,
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
                              name: "Character 1",
                              offset: 0x46e06 + challenge.recordIndex * 0x30,
                              type: "variable",
                              dataType: "uint8",
                              resource: "characters",
                              autocomplete: true,
                            },
                            {
                              name: "Character 2",
                              offset: 0x46e07 + challenge.recordIndex * 0x30,
                              type: "variable",
                              dataType: "uint8",
                              resource: "characters",
                              autocomplete: true,
                            },
                            {
                              name: "Character 3",
                              offset: 0x46e08 + challenge.recordIndex * 0x30,
                              type: "variable",
                              dataType: "uint8",
                              resource: "characters",
                              autocomplete: true,
                            },
                          ],
                        },
                        {
                          name: "Hard",
                          type: "section",
                          flex: true,
                          items: [
                            {
                              name: "Completed",
                              offset: 0x46dec + challenge.recordIndex * 0x30,
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
                                  offset:
                                    0x46dfc + challenge.recordIndex * 0x30,
                                  type: "variable",
                                  dataType: "uint32",
                                  operations: [
                                    {
                                      convert: { from: "seconds", to: "hours" },
                                    },
                                  ],
                                  max: 99,
                                },
                                {
                                  offset:
                                    0x46dfc + challenge.recordIndex * 0x30,
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
                                  offset:
                                    0x46dfc + challenge.recordIndex * 0x30,
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
                              name: "Character 1",
                              offset: 0x46e09 + challenge.recordIndex * 0x30,
                              type: "variable",
                              dataType: "uint8",
                              resource: "characters",
                              autocomplete: true,
                            },
                            {
                              name: "Character 2",
                              offset: 0x46e0a + challenge.recordIndex * 0x30,
                              type: "variable",
                              dataType: "uint8",
                              resource: "characters",
                              autocomplete: true,
                            },
                            {
                              name: "Character 3",
                              offset: 0x46e0b + challenge.recordIndex * 0x30,
                              type: "variable",
                              dataType: "uint8",
                              resource: "characters",
                              autocomplete: true,
                            },
                          ],
                        },
                      ],
                    })),
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
    characters: {
      ...characters,
      0x9: "-",
    },
    enemies: {
      0x6d: "001 Security Officer",
      0x16: "002 Elite Security Officer",
      0x221: "003 Grenadier",
      0x25a: "004 Elite Grenadier",
      0x146: "005 Riot Trooper",
      0x5: "006 Elite Riot Trooper",
      0xe3: "007 Flametrooper",
      0x24f: "008 Shock Trooper",
      0x192: "009 Elite Shock Trooper",
      0x7f: "010 Armored Shock Trooper",
      0x34e: "011 Enhanced Shock Trooper",
      0x91: "012 Helitrooper",
      0x54: "013 Elite Helitrooper",
      0x1ee: "014 3-C Solider Operator",
      0x7e: "015 Guard Dog",
      0x140: "016 Wrath Hound",
      0x279: "017 Bloodhound",
      0x200: "018 Monodrive",
      0x4: "019 Mark II Monodrive",
      0x2a5: "020 Sentry Ray",
      0x28a: "021 Laser Cannon",
      0x32e: "022 Sentry Launcher",
      0x17b: "023 Sentry Gun Prototype",
      0x1a3: "024 Sentry Gun",
      0x13c: "025 Slug-Ray",
      0x14e: "026 Shock-Ray",
      0x4c: "027 Blast-Ray",
      0x1ec: "028 Sweeper",
      0x181: "029 Sweeper Prototype",
      0x17f: "030 Cutter",
      0x2d0: "031 Jury-Rigged Cutter",
      0x372: "032 M.O.T.H. Unit",
      0x5f: "033 Zenene",
      0x80: "034 Sledgeworm",
      0x1f7: "035 Brain Pod",
      0x18c: "036 Swordipede",
      0x139: "037 Hoodlum",
      0x342: "038 Corneo Lackey",
      0x166: "039 Beastmaster",
      0x210: "040 Bandit",
      0x2db: "041 Beck",
      0x10b: "042 Butch",
      0xef: "043 Burke",
      0x11e: "044 Grungy Bandit",
      0x2ce: "045 Wererat",
      0x1a9: "046 Doomrat",
      0x330: "047 Gorger",
      0x2bf: "048 Ringmaw",
      0x2f9: "049 Lesser Drake",
      0x268: "050 Cerulean Drake",
      0x3d7: "051 Rust Drake",
      0x2b3: "052 Grashtrike",
      0x2b5: "053 Queend Grashtrike",
      0x1de: "054 Venomantis",
      0x3ac: "055 Blugu",
      0xd7: "056 Terpsicolt",
      0x37a: "057 Hedgehog Pie",
      0x126: "058 Hedgehog Pie King",
      0x2e7: "059 Smogger",
      0x2d: "060 Chromogger",
      0x218: "061 Scissorclaw",
      0x82: "062 Sahagin",
      0x374: "063 Sahagin Prince",
      0x290: "064 Cripshay",
      0x36e: "065 Ghost",
      0x83: "066 Phantom",
      0x5e: "067 Tonberry",
      0x73: "068 Bugaboo",
      0x3cc: "069 Varghidpolis",
      0x10d: "070 Trypapolis",
      0x135: "071 Byobapolis",
      0x233: "072 Hellhound",
      0xf3: "073 Bomb",
      0x3a8: "074 Malboro",
      0xf5: "075 The Huntsman",
      0x65: "076 Roche",
      0x2d9: "077 Reno",
      0xb9: "078 Rude",
      0x10a: "079 Rufus",
      0x10: "080 Darkstar",
      0x196: "081 Scorption Sentinel",
      0x240: "082 Crab Warden",
      0x9d: "083 Airbuster",
      0x343: "084 The Valkyrie",
      0x127: "085 The Arsenal",
      0x272: "086 Pride and Joy Prototype",
      0x30f: "087 Specimen H0512",
      0x98: "088 H0512-OPT",
      0x5a: "089 Jenova Dreamweaver",
      0x3db: "090 Hell House",
      0x156: "091 Abzu",
      0x270: "092 Abzu Shoat",
      0x3bb: "093 Mischievous Shoat",
      0x1a2: "094 Ghoul",
      0x6f: "095 Eligor",
      0x274: "096 Failed Experiment",
      0x3a1: "097 Unknown Entity",
      0x24c: "098 Type-O Behemoth",
      0x8e: "099 Shiva",
      0x1ed: "100 Fat Chocobo",
      0x3b2: "101 ????",
      0x2d8: "102 ????????",
      0x2e8: "103 Cactuar",
      0x364: "104 Leviathan",
      0xc1: "105 Bahamut",
      0x13d: "106 Ifrit",
      0x1e: "107 Mysterious Spectre",
      0x36c: "108 Enigmatic Spectre",
      0x362: "109 Whisper Harbinger",
      0x16c: "110 Whisper Rubrum",
      0x3d3: "111 Whisper Viridi",
      0x95: "112 Whisper Croceo",
      0xa7: "113 Whisper Bahamut",
      0x381: "114 Sephiroth",
    },
    items: "getItemNames()",
    inventoryItemNames: "getInventoryItemNames()",
    inventoryMateriaNames: "getInventoryMateriaNames()",
    inventoryWeaponNames: "getInventoryWeaponNames()",
    materias: {
      0x0: "-",
      ...materias,
    },
    outfits: {
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
    enemies: [
      0x6d, 0x16, 0x221, 0x25a, 0x146, 0x5, 0xe3, 0x24f, 0x192, 0x7f, 0x34e,
      0x91, 0x54, 0x1ee, 0x7e, 0x140, 0x279, 0x200, 0x4, 0x2a5, 0x28a, 0x32e,
      0x17b, 0x1a3, 0x13c, 0x14e, 0x4c, 0x1ec, 0x181, 0x17f, 0x2d0, 0x372, 0x5f,
      0x80, 0x1f7, 0x18c, 0x139, 0x342, 0x166, 0x210, 0x2db, 0x10b, 0xef, 0x11e,
      0x2ce, 0x1a9, 0x330, 0x2bf, 0x2f9, 0x268, 0x3d7, 0x2b3, 0x2b5, 0x1de,
      0x3ac, 0xd7, 0x37a, 0x126, 0x2e7, 0x2d, 0x218, 0x82, 0x374, 0x290, 0x36e,
      0x83, 0x5e, 0x73, 0x3cc, 0x10d, 0x135, 0x233, 0xf3, 0x3a8, 0xf5, 0x65,
      0x2d9, 0xb9, 0x10a, 0x10, 0x196, 0x240, 0x9d, 0x343, 0x127, 0x272, 0x30f,
      0x98, 0x5a, 0x3db, 0x156, 0x270, 0x3bb, 0x1a2, 0x6f, 0x274, 0x3a1, 0x24c,
      0x8e, 0x1ed, 0x3b2, 0x2d8, 0x2e8, 0x364, 0xc1, 0x13d, 0x1e, 0x36c, 0x362,
      0x16c, 0x3d3, 0x95, 0xa7, 0x381,
    ],
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
