import type { GameJson } from "$lib/types";

import { missions } from "./utils/resource";

const template: GameJson = {
  validator: {
    regions: {
      europe_usa_japan: {},
    },
    text: "Drag 'n' drop here or click to add a save file.",
    hint: "If you're having trouble loading a save file from an Everdrive cartridge, please see the FAQ.",
    error: "Not a valid save file.",
  },
  items: [
    {
      id: "slots",
      length: 0x60,
      type: "container",
      instanceType: "tabs",
      instances: 4,
      enumeration: "Slot %d",
      disableSubinstanceIf: {
        $and: [
          {
            offset: 0x32,
            type: "variable",
            dataType: "uint16",
            operator: "=",
            value: 0x0,
          },
          {
            offset: 0x4b,
            type: "variable",
            dataType: "uint16",
            operator: "=",
            value: 0x0,
          },
          {
            offset: 0x64,
            type: "variable",
            dataType: "uint16",
            operator: "=",
            value: 0x0,
          },
        ],
      },
      items: [
        {
          name: "Checksum",
          offset: 0x20,
          type: "checksum",
          dataType: "uint64",
          bigEndian: true,
          control: {
            offsetStart: 0x28,
            offsetEnd: 0x80,
          },
        },
        {
          length: 0x19,
          type: "container",
          instanceType: "tabs",
          instances: 3,
          resource: "difficulties",
          vertical: true,
          flex: true,
          items: missions.map((mission) => ({
            name: mission.name,
            type: "group",
            mode: "chrono",
            items: [
              {
                id: "time-%index%",
                offset: mission.offset,
                type: "variable",
                dataType: "uint16",
                bigEndian: true,
                binary: { bitStart: mission.bitStart, bitLength: 10 },
                operations: [{ convert: { from: "seconds", to: "minutes" } }],
                leadingZeros: 1,
                max: 17,
                test: true,
              },
              {
                id: "time-%index%",
                offset: mission.offset,
                type: "variable",
                dataType: "uint16",
                bigEndian: true,
                binary: { bitStart: mission.bitStart, bitLength: 10 },
                operations: [{ convert: { from: "seconds", to: "seconds" } }],
                leadingZeros: 1,
                max: 59,
                test: true,
              },
            ],
          })),
          appendSubinstance: [
            {
              name: "Cheats",
              items: [
                {
                  type: "section",
                  background: true,
                  items: [
                    {
                      name: "All levels and 007 difficulty unlocked",
                      offset: 0x29,
                      type: "variable",
                      dataType: "boolean",
                      separator: true,
                    },
                    {
                      type: "section",
                      flex: true,
                      noMargin: true,
                      items: [
                        {
                          type: "bitflags",
                          noMargin: true,
                          flags: [
                            { offset: 0x2e, bit: 1, label: "Invincible" },
                            { offset: 0x30, bit: 3, label: "All Guns" },
                            { offset: 0x2f, bit: 2, label: "Bond Invisible" },
                            { offset: 0x2f, bit: 7, label: "Infinite Ammo" },
                            { offset: 0x2e, bit: 2, label: "DK Mode" },
                            { offset: 0x2e, bit: 7, label: "Tiny Bond" },
                            { offset: 0x2e, bit: 0, label: "Paintball Mode" },
                            { offset: 0x2f, bit: 5, label: "Silver PP7" },
                            { offset: 0x30, bit: 1, label: "Gold PP7" },
                            { offset: 0x2e, bit: 6, label: "No Radar [Multi]" },
                          ],
                        },
                        {
                          type: "bitflags",
                          noMargin: true,
                          flags: [
                            { offset: 0x2e, bit: 5, label: "Turbo Mode" },
                            { offset: 0x2f, bit: 1, label: "Fast Animation" },
                            { offset: 0x2f, bit: 4, label: "Slow Animation" },
                            { offset: 0x2f, bit: 3, label: "Enemy Rockets" },
                            { offset: 0x2e, bit: 4, label: "2x Rocket L." },
                            { offset: 0x2e, bit: 3, label: "2x Grenade L." },
                            { offset: 0x30, bit: 0, label: "2x RC-P90" },
                            { offset: 0x2f, bit: 0, label: "2x Throwing Knife" },
                            { offset: 0x2f, bit: 6, label: "2x Hunting Knife" },
                            { offset: 0x30, bit: 2, label: "2x Laser" },
                          ],
                        },
                      ],
                    },
                  ],
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
                      name: "Control Style",
                      offset: 0x2c,
                      type: "variable",
                      dataType: "uint8",
                      binary: { bitStart: 0, bitLength: 3 },
                      resource: "controlStyles",
                      autocomplete: true,
                    },
                  ],
                },
                {
                  type: "section",
                  flex: true,
                  items: [
                    {
                      name: "Music",
                      offset: 0x2a,
                      type: "variable",
                      dataType: "uint8",
                    },
                    {
                      name: "FX",
                      offset: 0x2b,
                      type: "variable",
                      dataType: "uint8",
                    },
                  ],
                },
                {
                  type: "section",
                  flex: true,
                  items: [
                    {
                      name: "Look Up/Down",
                      offset: 0x2d,
                      type: "variable",
                      dataType: "bit",
                      bit: 0,
                      resource: "lookUpDown",
                    },
                    {
                      name: "Auto-Aim",
                      offset: 0x2d,
                      type: "variable",
                      dataType: "bit",
                      bit: 1,
                      resource: "optionBoolean",
                    },
                    {
                      name: "Aim Control",
                      offset: 0x2d,
                      type: "variable",
                      dataType: "bit",
                      bit: 2,
                      resource: "aimControl",
                    },
                    {
                      name: "Sight On-Screen",
                      offset: 0x2d,
                      type: "variable",
                      dataType: "bit",
                      bit: 3,
                      resource: "optionBoolean",
                    },
                    {
                      name: "Look Ahead",
                      offset: 0x2d,
                      type: "variable",
                      dataType: "bit",
                      bit: 4,
                      resource: "optionBoolean",
                    },
                    {
                      name: "Ammo On-Screen",
                      offset: 0x2d,
                      type: "variable",
                      dataType: "bit",
                      bit: 5,
                      resource: "optionBoolean",
                    },
                  ],
                },
                {
                  type: "section",
                  flex: true,
                  items: [
                    {
                      name: "Screen",
                      offset: 0x2d,
                      type: "variable",
                      dataType: "bit",
                      bit: 6,
                      resource: "screens",
                    },
                    {
                      id: "ratio",
                      name: "Ratio",
                      offset: 0x2d,
                      type: "variable",
                      dataType: "bit",
                      bit: 7,
                      resource: "screenRatios",
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
    aimControl: {
      0x0: "Hold",
      0x1: "Toggle",
    },
    controlStyles: {
      0x0: "1.1 Honey",
      0x1: "1.2 Solitaire",
      0x2: "1.3 Kissy",
      0x3: "1.4 Goodnight",
      0x4: "2.1 Plenty",
      0x5: "2.2 Galore",
      0x6: "2.3 Domino",
      0x7: "2.4 Goodhead",
    },
    difficulties: {
      0x0: "Agent",
      0x1: "Secret Agent",
      0x2: "00 Agent",
    },
    lookUpDown: {
      0x0: "Reverse",
      0x1: "Upright",
    },
    optionBoolean: {
      0x0: "Off",
      0x1: "On",
    },
    screenRatios: {
      0x0: "Normal",
      0x1: "16:9",
      0x8: "Cinema",
    },
    screens: {
      0x0: "Full",
      0x1: "Wide",
    },
  },
};

export default template;
