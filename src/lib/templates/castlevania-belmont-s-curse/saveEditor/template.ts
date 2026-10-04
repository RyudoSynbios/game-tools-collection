import { paginate } from "$lib/utils/format";

import type { GameJson } from "$lib/types";

import {
  arcanaList,
  arcanas,
  cardList,
  cardTypes,
  keyItemList,
  moveList,
  relicList,
  relics,
  skinList,
  skins,
  weaponList,
  weapons,
  weaponsGroups,
  weaponTypes,
} from "./utils/resource";

const template: GameJson = {
  validator: {
    fileNames: [/BuildSave_([0-9]+).sav/],
    platforms: {
      steam: {
        world: {},
      },
    },
    text: "Drag 'n' drop here or click to add a save file.",
    hint: "Designed to work with v1.1.0.\nOther versions may work, but may corrupt the save.\nPlease make a backup before editing.",
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
                      offset: 0x0,
                      jsonPath: "playerSave.playTimeInSeconds",
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
                      offset: 0x0,
                      jsonPath: "playerSave.playTimeInSeconds",
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
                      test: true,
                    },
                    {
                      offset: 0x0,
                      jsonPath: "playerSave.playTimeInSeconds",
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
                      test: true,
                    },
                  ],
                },
                {
                  name: "Total Playtime",
                  type: "group",
                  mode: "time",
                  hidden: true,
                  items: [
                    {
                      offset: 0x0,
                      jsonPath: "playerSave.gameStats.totalPlaytime",
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
                      offset: 0x0,
                      jsonPath: "playerSave.gameStats.totalPlaytime",
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
                      offset: 0x0,
                      jsonPath: "playerSave.gameStats.totalPlaytime",
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
              ],
            },
          ],
        },
        {
          name: "Status",
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
                          name: "Level",
                          offset: 0x0,
                          jsonPath: "playerSave.level",
                          type: "variable",
                          dataType: "uint8",
                          min: 1,
                          max: 99,
                        },
                        {
                          name: "Experience",
                          offset: 0x0,
                          jsonPath: "playerSave.experienceCurrent",
                          type: "variable",
                          dataType: "uint32",
                          // max:
                        },
                      ],
                    },
                    {
                      type: "section",
                      flex: true,
                      hidden: true,
                      items: [
                        {
                          name: "HP",
                          offset: 0x0,
                          jsonPath: "playerSave.currentHealth",
                          type: "variable",
                          dataType: "uint8",
                          min: 1,
                          max: 220,
                          hidden: true,
                        },
                        {
                          name: "MP",
                          offset: 0x0,
                          jsonPath: "playerSave.currentMana",
                          type: "variable",
                          dataType: "uint8",
                          max: 220,
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
                          name: "HP Charges",
                          offset: 0x0,
                          jsonPath: "playerSave.currentHealChargesCount",
                          type: "variable",
                          dataType: "uint8",
                          min: 1,
                          // max:
                          hidden: true,
                        },
                        {
                          name: "The Hermit Death Defiance Count",
                          offset: 0x0,
                          jsonPath:
                            "playerSave.currentTheHermitDeathDefianceCount",
                          type: "variable",
                          dataType: "uint8",
                          // max:
                          hidden: true,
                        },
                      ],
                    },
                    {
                      type: "section",
                      flex: true,
                      items: [
                        {
                          name: "HP Fragments",
                          offset: 0x0,
                          jsonPath: "playerSave.healthUpgradeFragmentCount",
                          type: "variable",
                          dataType: "uint8",
                          max: 24,
                        },
                        {
                          name: "MP Fragments",
                          offset: 0x0,
                          jsonPath: "playerSave.manaUpgradeFragmentCount",
                          type: "variable",
                          dataType: "uint8",
                          max: 24,
                        },
                        {
                          name: "Bonus Attack",
                          offset: 0x0,
                          jsonPath: "playerSave.atkBonusUpgradeCount",
                          type: "variable",
                          dataType: "uint16",
                          max: 999,
                        },
                        {
                          name: "Bonus Defense",
                          offset: 0x0,
                          jsonPath: "playerSave.defBonusUpgradeCount",
                          type: "variable",
                          dataType: "uint16",
                          max: 999,
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
                          id: "equipment-arcanas",
                          name: "Arcana",
                          offset: 0x0,
                          jsonPath: "playerSave.equippedSpellItem",
                          type: "variable",
                          dataType: "uint8",
                          resource: "arcanas",
                          autocomplete: true,
                        },
                        {
                          id: "equipment-weapons",
                          name: "Weapon",
                          offset: 0x0,
                          jsonPath: "playerSave.equippedWeaponItem",
                          type: "variable",
                          dataType: "uint8",
                          resource: "weapons",
                          autocomplete: true,
                        },
                        {
                          id: "equipment-skins",
                          name: "Skin",
                          offset: 0x0,
                          jsonPath: "playerSave.equippedSkin",
                          type: "variable",
                          dataType: "uint8",
                          resource: "skins",
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
                          name: "Arcana",
                          offset: 0x0,
                          jsonPath: "playerSave.equippedSpellItem",
                          length: 0x20,
                          type: "variable",
                          dataType: "string",
                          letterDataType: "uint8",
                          hidden: true,
                        },
                        {
                          name: "Weapon",
                          offset: 0x0,
                          jsonPath: "playerSave.equippedWeaponItem",
                          length: 0x20,
                          type: "variable",
                          dataType: "string",
                          letterDataType: "uint8",
                          hidden: true,
                        },
                        {
                          name: "Skin",
                          offset: 0x0,
                          jsonPath: "playerSave.equippedSkin",
                          length: 0x20,
                          type: "variable",
                          dataType: "string",
                          letterDataType: "uint8",
                          hidden: true,
                        },
                      ],
                    },
                    {
                      type: "section",
                      flex: true,
                      items: [
                        {
                          id: "equipment-relics",
                          name: "Relic 1",
                          offset: 0x0,
                          jsonPath: "playerSave.equippedCharmItems[0]",
                          type: "variable",
                          dataType: "uint8",
                          resource: "relics",
                          autocomplete: true,
                        },
                        {
                          id: "equipment-relics",
                          name: "Relic 2",
                          offset: 0x0,
                          jsonPath: "playerSave.equippedCharmItems[1]",
                          type: "variable",
                          dataType: "uint8",
                          resource: "relics",
                          autocomplete: true,
                        },
                        {
                          id: "equipment-relics",
                          name: "Relic 3",
                          offset: 0x0,
                          jsonPath: "playerSave.equippedCharmItems[2]",
                          type: "variable",
                          dataType: "uint8",
                          resource: "relics",
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
                          name: "Relic 1",
                          offset: 0x0,
                          jsonPath: "playerSave.equippedCharmItems[0]",
                          length: 0x20,
                          type: "variable",
                          dataType: "string",
                          letterDataType: "uint8",
                          hidden: true,
                        },
                        {
                          name: "Relic 2",
                          offset: 0x0,
                          jsonPath: "playerSave.equippedCharmItems[1]",
                          length: 0x20,
                          type: "variable",
                          dataType: "string",
                          letterDataType: "uint8",
                          hidden: true,
                        },
                        {
                          name: "Relic 3",
                          offset: 0x0,
                          jsonPath: "playerSave.equippedCharmItems[2]",
                          length: 0x20,
                          type: "variable",
                          dataType: "string",
                          letterDataType: "uint8",
                          hidden: true,
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
          name: "Inventory",
          items: [
            {
              type: "tabs",
              vertical: true,
              items: [
                {
                  name: "Arcanas",
                  items: [
                    {
                      id: "inventory-arcanas",
                      jsonPath: "playerSave.itemsInInventory",
                      type: "bitflags",
                      flags: arcanaList.map((arcana, index) => ({
                        offset: index,
                        bit: 0,
                        label: arcana.name,
                      })),
                    },
                  ],
                },
                {
                  name: "Armoury",
                  flex: true,
                  items: weaponTypes.map((type) => ({
                    id: "inventory-weapons",
                    name: type.name,
                    jsonPath: "playerSave.itemsInInventory",
                    type: "bitflags",
                    fixedWidth: true,
                    flags: weaponList
                      .filter((weapon) => weapon.type === type.index)
                      .map((weapon, index) => ({
                        offset: index,
                        bit: type.index,
                        label: weapon.name,
                      })),
                  })),
                },
                {
                  name: "Relics",
                  flex: true,
                  items: paginate(relicList, 24, true).map(
                    (page, pageIndex) => ({
                      id: "inventory-relics",
                      jsonPath: "playerSave.itemsInInventory",
                      type: "bitflags",
                      flags: page.map((relic, index) => ({
                        offset: index,
                        bit: pageIndex,
                        label: relic.name,
                        separator: index % 6 === 5 && index !== page.length - 1,
                        disabled: relic.name === "???",
                      })),
                    }),
                  ),
                },
                {
                  name: "Skins",
                  items: [
                    {
                      id: "inventory-skins",
                      jsonPath: "playerSave.itemsInInventory",
                      type: "bitflags",
                      flags: skinList.map((skin, index) => ({
                        offset: index,
                        bit: 0,
                        label: skin.name,
                      })),
                    },
                  ],
                },
              ],
            },
          ],
        },
        {
          name: "Tarot",
          items: [
            {
              type: "tabs",
              vertical: true,
              items: cardTypes.map((type) => ({
                name: type.name,
                items: [
                  {
                    id: "inventory-cards",
                    jsonPath: "playerSave.itemsInInventory",
                    type: "bitflags",
                    flags: cardList
                      .filter((card) => card.type === type.index)
                      .map((card, index) => ({
                        offset: index,
                        bit: type.index,
                        label: card.name,
                        disabled: card.name === "???",
                      })),
                  },
                ],
              })),
            },
          ],
        },
        {
          name: "Journey",
          flex: true,
          items: [
            {
              id: "inventory-moves",
              name: "Moves",
              jsonPath: "playerSave.itemsInInventory",
              type: "bitflags",
              flags: moveList.map((item, index) => ({
                offset: index,
                bit: 0,
                label: item.name,
              })),
            },
            {
              id: "inventory-keyItems",
              name: "Key Items",
              jsonPath: "playerSave.itemsInInventory",
              type: "bitflags",
              flags: keyItemList.map((item, index) => ({
                offset: index,
                bit: 0,
                label: item.name,
              })),
            },
          ],
        },
      ],
    },
  ],
  resources: {
    arcanas,
    relics: {
      "-1": "-",
      ...relics,
    },
    skins,
    weapons,
  },
  resourcesGroups: {
    weapons: weaponsGroups,
  },
  resourcesOrder: {
    relics: [-1],
  },
};

export default template;
