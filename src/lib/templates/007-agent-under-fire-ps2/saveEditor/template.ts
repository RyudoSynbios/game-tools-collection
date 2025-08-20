import type { GameJson } from "$lib/types";

const template: GameJson = {
  validator: {
    regions: {
      europe: {
        0x0: [
          0x42, 0x45, 0x53, 0x4c, 0x45, 0x53, 0x2d, 0x35, 0x30, 0x35, 0x33,
          0x39,
        ], // "BESLES-50539"
      },
      usa: {
        0x0: [
          0x42, 0x41, 0x53, 0x4c, 0x55, 0x53, 0x2d, 0x32, 0x30, 0x32, 0x36,
          0x35,
        ], // "BASLUS-20265"
      },
      korea: {
        0x0: [
          0x42, 0x49, 0x53, 0x4c, 0x50, 0x4d, 0x2d, 0x36, 0x37, 0x35, 0x30,
          0x35,
        ], // "BISLPM-67505"
      },
    },
    text: "Drag 'n' drop here or click to add a save file.",
    error: "Not a valid save file.",
  },
  items: [
    {
      length: 0xf8,
      type: "container",
      instanceType: "tabs",
      instances: 8,
      enumeration: "Slot %d",
      disableSubinstanceIf: {
        $or: [
          {
            offset: 0x10,
            type: "variable",
            dataType: "uint8",
            operator: "=",
            value: 0x5b,
          },
          {
            offset: 0x11,
            type: "variable",
            dataType: "uint8",
            operator: "=",
            value: 0x6d,
          },
        ],
      },
      appendSubinstance: [
        {
          name: "Options",
          items: [
            {
              type: "section",
              flex: true,
              items: [
                {
                  name: "Difficulty",
                  offset: 0x15f4,
                  type: "variable",
                  dataType: "uint8",
                  resource: "difficulties",
                },
              ],
            },
            {
              type: "section",
              flex: true,
              items: [
                {
                  name: "Controller Setup",
                  offset: 0x15e4,
                  type: "variable",
                  dataType: "uint8",
                  resource: "controllerSetups",
                },
                {
                  name: "Invert Pitch",
                  offset: 0x15ec,
                  type: "variable",
                  dataType: "bit",
                  bit: 0,
                  resource: "optionBoolean",
                },
                {
                  name: "Vibration",
                  offset: 0x15ec,
                  type: "variable",
                  dataType: "bit",
                  bit: 1,
                  resource: "optionBoolean",
                },
              ],
            },
            {
              type: "section",
              flex: true,
              items: [
                {
                  name: "HUD Always Visible",
                  offset: 0x15ec,
                  type: "variable",
                  dataType: "bit",
                  bit: 2,
                  resource: "optionBoolean",
                },
                {
                  name: "Cross Hair",
                  offset: 0x15ec,
                  type: "variable",
                  dataType: "bit",
                  bit: 1,
                  resource: "optionBoolean",
                },
              ],
            },
            {
              type: "section",
              flex: true,
              items: [
                {
                  name: "Gold Rewards",
                  offset: 0x15ec,
                  type: "variable",
                  dataType: "bit",
                  bit: 4,
                  resource: "optionBoolean",
                },
              ],
            },
            {
              type: "section",
              flex: true,
              items: [
                {
                  name: "Music",
                  offset: 0x15d8,
                  type: "variable",
                  dataType: "uint32",
                },
                {
                  name: "Sound Effects",
                  offset: 0x15dc,
                  type: "variable",
                  dataType: "uint32",
                  max: 128,
                },
              ],
            },
          ],
        },
      ],
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
                      name: "Filename",
                      offset: 0x10,
                      length: 0x9,
                      type: "variable",
                      dataType: "string",
                      letterDataType: "uint8",
                      endCode: 0x0,
                      regex: "[ .A-Z]",
                      test: true,
                    },
                    {
                      name: "Current Mission",
                      offset: 0x24,
                      type: "variable",
                      dataType: "uint8",
                      resource: "missions",
                      autocomplete: true,
                    },
                  ],
                },
                {
                  type: "section",
                  flex: true,
                  items: [
                    {
                      name: "Gold Rewards",
                      type: "bitflags",
                      flags: [
                        { offset: 0xb8, bit: 0, label: "Golden Gun" },
                        { offset: 0xbc, bit: 0, label: "Golden CH-6" },
                        { offset: 0xc0, bit: 0, label: "Unlimited Missiles" },
                        { offset: 0xc4, bit: 0, label: "Golden Accuracy" },
                        { offset: 0xc8, bit: 0, label: "Golden Clip" },
                        { offset: 0xcc, bit: 0, label: "Golden Grenades" },
                        { offset: 0xd0, bit: 0, label: "Lotus Esprit" },
                        { offset: 0xd4, bit: 0, label: "Rapid Fire" },
                        { offset: 0xd8, bit: 0, label: "Golden Armor" },
                        { offset: 0xdc, bit: 0, label: "Golden Bullets" },
                        { offset: 0xe0, bit: 0, label: "Regenerative Armor" },
                        { offset: 0xe4, bit: 0, label: "Unlimited Ammo" },
                      ],
                    },
                    {
                      name: "Platinum Rewards",
                      type: "bitflags",
                      flags: [
                        { offset: 0x88, bit: 0, label: "MP Map - Rocket Manor" },
                        { offset: 0x8c, bit: 0, label: "MP Game Mode - Golden Gun" },
                        { offset: 0x90, bit: 0, label: "MP Model - Stealth Bond" },
                        { offset: 0x94, bit: 0, label: "MP Powerup - Gravity Boots" },
                        { offset: 0x98, bit: 0, label: "MP Model - Guard" },
                        { offset: 0x9c, bit: 0, label: "MP Weapon - Viper" },
                        { offset: 0xa0, bit: 0, label: "MP Model - Alpine Guard" },
                        { offset: 0xa4, bit: 0, label: "MP Weapon - Calypso" },
                        { offset: 0xa8, bit: 0, label: "MP Modifier - Full Arsenal" },
                        { offset: 0xac, bit: 0, label: "MP Model - Cyclops Oil Guard" },
                        { offset: 0xb0, bit: 0, label: "MP Model - Poseidon Guard" },
                        { offset: 0xb4, bit: 0, label: "MP Model - Carrier Guard" },
                      ],
                    },
                  ],
                },
              ],
            },
            {
              name: "Missions",
              items: [
                {
                  length: 0x4,
                  type: "container",
                  instanceType: "section",
                  instances: 12,
                  resource: "missions",
                  flex: true,
                  items: [
                    {
                      name: "High Score",
                      offset: 0x28,
                      type: "variable",
                      dataType: "uint32",
                      max: 999999999,
                    },
                    {
                      name: "Medal",
                      offset: 0x78,
                      type: "variable",
                      dataType: "uint8",
                      resource: "medals",
                      overrideShift: {
                        parent: 1,
                        shift: 0x1,
                      },
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
    controllerSetups: {
      0x0: "Setup 1",
      0x1: "Setup 2",
      0x2: "Setup 3",
      0x3: "Setup 4",
    },
    difficulties: {
      0x0: "Operative",
      0x1: "Agent",
      0x2: "00 Agent",
    },
    medals: {
      0x0: "-",
      0x1: "Bronze",
      0x2: "Silver",
      0x3: "Gold",
      0x4: "Platinum",
    },
    missions: {
      0x0: "Trouble in Paradise",
      0x1: "Precious Cargo",
      0x2: "Dangerous Pursuit",
      0x3: "Bad Diplomacy",
      0x4: "Cold Reception",
      0x5: "Night of the Jackal",
      0x6: "Streets of Bucharest",
      0x7: "Fire & Water",
      0x8: "Forbidden Depths",
      0x9: "Poseidon",
      0xa: "Mediterranean Crisis",
      0xb: "Evil Summit",
    },
    optionBoolean: {
      0x0: "Off",
      0x1: "On",
    },
  },
};

export default template;
