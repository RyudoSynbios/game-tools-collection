import type { GameJson } from "$lib/types";

import { items } from "../saveEditor/utils/resource";

const template: GameJson = {
  validator: {
    regions: {
      europe_usa: { 0x20: [0x4d, 0x4b, 0x2d, 0x38, 0x31, 0x33, 0x30, 0x36] }, // "MK-81306"
      japan: { 0x20: [0x54, 0x2d, 0x33, 0x33, 0x31, 0x30, 0x31, 0x47] }, // "T-33101G"
    },
    text: "Drag 'n' drop here or click to add a rom file.",
    hint: "Only works with .bin (merged) and .iso files.",
    error: "Not a valid rom file.",
  },
  items: [
    {
      type: "tabs",
      items: [
        {
          name: "Items",
          items: [
            {
              id: "items",
              length: 0x10,
              type: "container",
              instanceType: "tabs",
              instances: 210,
              resource: "itemNames",
              vertical: true,
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
                          hidden: true,
                          items: [
                            {
                              id: "iName-%index%",
                              name: "Name",
                              offset: 0x0,
                              length: 0xe,
                              type: "variable",
                              dataType: "string",
                              letterDataType: "uint8",
                              disabled: true,
                              hidden: true,
                            },
                            {
                              id: "iDescription-%index%",
                              name: "Description",
                              offset: 0x0,
                              length: 0xe,
                              type: "variable",
                              dataType: "string",
                              letterDataType: "uint8",
                              size: "xl",
                              disabled: true,
                              hidden: true,
                            },
                          ],
                        },
                        {
                          type: "section",
                          flex: true,
                          items: [
                            {
                              name: "Type",
                              dataViewAltKey: "x09",
                              offset: 0x3,
                              type: "variable",
                              dataType: "uint8",
                              resource: "itemTypes",
                              autocomplete: true,
                            },
                            {
                              name: "Price",
                              dataViewAltKey: "x09",
                              offset: 0x0,
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
                              name: "Equippable by",
                              dataViewAltKey: "x09",
                              type: "bitflags",
                              flags: [
                                { offset: 0x7, bit: 0, label: "Swordsman" }, // prettier-ignore
                                { offset: 0x7, bit: 1, label: "Shaman" }, // prettier-ignore
                                { offset: 0x7, bit: 2, label: "Ninja" }, // prettier-ignore
                                { offset: 0x7, bit: 3, label: "Dragon Warrior" }, // prettier-ignore
                                { offset: 0x7, bit: 4, label: "Kunoichi" }, // prettier-ignore
                                { offset: 0x7, bit: 5, label: "Magician" }, // prettier-ignore
                                { offset: 0x7, bit: 6, label: "Halfling" }, // prettier-ignore
                                { offset: 0x7, bit: 7, label: "Knight" }, // prettier-ignore
                                { offset: 0x6, bit: 0, label: "Champion" }, // prettier-ignore
                                { offset: 0x6, bit: 1, label: "Summoner" }, // prettier-ignore
                                { offset: 0x6, bit: 2, label: "Master Ninja" }, // prettier-ignore
                                { offset: 0x6, bit: 3, label: "Dragon Knight" }, // prettier-ignore
                                { offset: 0x6, bit: 4, label: "Chief Kunoichi" }, // prettier-ignore
                                { offset: 0x6, bit: 5, label: "Sorcerer" }, // prettier-ignore
                                { offset: 0x6, bit: 6, label: "Berserker" }, // prettier-ignore
                                { offset: 0x6, bit: 7, label: "Paladin" }, // prettier-ignore
                              ],
                            },
                            {
                              type: "section",
                              items: [
                                {
                                  name: "Special",
                                  dataViewAltKey: "x09",
                                  type: "bitflags",
                                  flags: [
                                    { offset: 0x2, bit: 0, label: "Curses when equipped" }, // prettier-ignore
                                    { offset: 0x2, bit: 1, label: "Usable" }, // prettier-ignore
                                    { offset: 0x2, bit: 2, label: "Consumable" }, // prettier-ignore
                                    { offset: 0x2, bit: 3, label: "Rare item" }, // prettier-ignore
                                    { offset: 0x2, bit: 4, label: "Quest item" }, // prettier-ignore
                                    { offset: 0x2, bit: 5, label: "???", hidden: true }, // prettier-ignore
                                    { offset: 0x2, bit: 6, label: "???", hidden: true }, // prettier-ignore
                                    { offset: 0x2, bit: 7, label: "???", hidden: true }, // prettier-ignore
                                  ],
                                },
                                {
                                  name: "Body Parts",
                                  dataViewAltKey: "x09",
                                  type: "bitflags",
                                  flags: [
                                    { offset: 0x5, bit: 0, label: "Head" }, // prettier-ignore
                                    { offset: 0x5, bit: 1, label: "Left Hand" }, // prettier-ignore
                                    { offset: 0x5, bit: 2, label: "Right Hand" }, // prettier-ignore
                                    { offset: 0x5, bit: 3, label: "Left Arm" }, // prettier-ignore
                                    { offset: 0x5, bit: 4, label: "Right Arm" }, // prettier-ignore
                                    { offset: 0x5, bit: 5, label: "Left Shoulder" }, // prettier-ignore
                                    { offset: 0x5, bit: 6, label: "Right Shoulder" }, // prettier-ignore
                                    { offset: 0x5, bit: 7, label: "Torso" }, // prettier-ignore
                                    { offset: 0x4, bit: 0, label: "Waist" }, // prettier-ignore
                                    { offset: 0x4, bit: 1, label: "Legs" }, // prettier-ignore
                                    { offset: 0x4, bit: 2, label: "Feet" }, // prettier-ignore
                                    { offset: 0x4, bit: 3, label: "???", hidden: true }, // prettier-ignore
                                    { offset: 0x4, bit: 4, label: "???", hidden: true }, // prettier-ignore
                                    { offset: 0x4, bit: 5, label: "???", hidden: true }, // prettier-ignore
                                    { offset: 0x4, bit: 6, label: "???", hidden: true }, // prettier-ignore
                                    { offset: 0x4, bit: 7, label: "???", hidden: true }, // prettier-ignore
                                  ],
                                },
                              ],
                            },
                            {
                              length: 0x1,
                              type: "container",
                              instanceType: "section",
                              instances: 4,
                              flex: true,
                              noMargin: true,
                              items: [
                                {
                                  id: "iEffectType",
                                  name: "Effect %d",
                                  dataViewAltKey: "x09",
                                  offset: 0x8,
                                  type: "variable",
                                  dataType: "uint8",
                                  resource: "itemEffects",
                                  autocomplete: true,
                                },
                                {
                                  id: "iEffectValue",
                                  name: "Value",
                                  dataViewAltKey: "x09",
                                  offset: 0xc,
                                  type: "variable",
                                  dataType: "int8",
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
        {
          name: "Asset Viewer",
          items: [
            {
              type: "tabs",
              items: [
                {
                  name: "Text Files",
                  items: [
                    {
                      id: "assetViewer-txt",
                      instanceId: "txtViewer",
                      length: 0x2,
                      type: "container",
                      instanceType: "tabs",
                      instances: 0,
                      resource: "assetTxtNames",
                      vertical: true,
                      flex: true,
                      items: [
                        {
                          type: "component",
                          component: "TxtViewer",
                          props: { assetIndex: "txtViewer" },
                        },
                      ],
                    },
                  ],
                },
                {
                  name: "Images",
                  items: [
                    {
                      id: "assetViewer-image",
                      instanceId: "imageViewer",
                      length: 0x2,
                      type: "container",
                      instanceType: "tabs",
                      instances: 0,
                      resource: "assetImageNames",
                      vertical: true,
                      flex: true,
                      items: [
                        {
                          type: "component",
                          component: "ImageViewer",
                          props: { assetIndex: "imageViewer", type: "image" },
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
    assetTxtNames: "getAssetNames('txt')",
    assetImageNames: "getAssetNames('image')",
    itemEffects: {
      0x0: "+ Attack",
      0x1: "+ Defense",
      0x2: "+ Agility",
      0x3: "+ Critical",
      0x4: "+ Technique",
      0x5: "+ Luck",
      0x6: "+ Magic Defense",
      0x7: "+ Breath Defense",
      0x10: "Inflict Poison",
      0x11: "Inflict Sleep",
      0x12: "Inflict Paralyse",
      0x13: "Inflict Confusion",
      0x14: "Inflict Blind",
      0x15: "Inflict Silence",
      0x17: "???",
      0x18: "???",
      0x20: "HP Regen",
      0x21: "MP Regen",
      0xff: "-",
    },
    itemNames: items,
    itemTypes: {
      0x0: "Item",
      0x1: "Weapon",
      0x2: "Head armor",
      0x3: "Arm armor",
      0x4: "Body armor",
      0x5: "Reinforced armor",
      0x6: "Accessory",
    },
  },
  resourcesOrder: {
    itemEffects: [0xff],
  },
};

export default template;
