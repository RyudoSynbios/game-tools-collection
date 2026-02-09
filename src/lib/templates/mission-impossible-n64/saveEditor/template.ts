import type { GameJson } from "$lib/types";

const template: GameJson = {
  validator: {
    regions: {
      europe_usa_japan: {
        0x12: [0x49, 0x4d, 0x46], // "IMF"
      },
    },
    text: "Drag 'n' drop here or click to add a save file.",
    hint: "If you're having trouble loading a save file from an Everdrive cartridge, please see the FAQ.",
    error: "Not a valid save file.",
  },
  items: [
    {
      length: 0x20,
      type: "container",
      instanceType: "tabs",
      instances: 4,
      enumeration: "Slot %d",
      disableSubinstanceIf: {
        offset: 0x16,
        type: "variable",
        dataType: "uint8",
        operator: "=",
        value: 0x0,
      },
      items: [
        {
          name: "Checksum",
          offset: 0x1c,
          type: "checksum",
          dataType: "uint32",
          bigEndian: true,
          control: {
            offsetStart: 0x0,
            offsetEnd: 0x1c,
          },
        },
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
                      id: "location",
                      name: "Current Mission (Possible)",
                      offset: 0x4,
                      type: "variable",
                      dataType: "uint8",
                      resource: "missions",
                      autocomplete: true,
                    },
                    {
                      id: "location",
                      name: "Current Mission (Impossible)",
                      offset: 0x5,
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
                  hidden: true,
                  items: [
                    {
                      name: "Location (Possible)",
                      offset: 0x4,
                      type: "variable",
                      dataType: "uint8",
                      hidden: true,
                    },
                    {
                      name: "Location (Impossible)",
                      offset: 0x5,
                      type: "variable",
                      dataType: "uint8",
                      hidden: true,
                    },
                    {
                      name: "Mission (Possible)",
                      offset: 0x7,
                      type: "variable",
                      dataType: "uint8",
                      hidden: true,
                    },
                    {
                      name: "Mission (Impossible)",
                      offset: 0x8,
                      type: "variable",
                      dataType: "uint8",
                      hidden: true,
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
                      name: "Music Level",
                      offset: 0xd,
                      type: "variable",
                      dataType: "uint8",
                      operations: [{ "*": 2 }],
                      max: 14,
                      step: 2,
                      test: true,
                    },
                    {
                      name: "SFX Level",
                      offset: 0xc,
                      type: "variable",
                      dataType: "uint8",
                      operations: [{ "*": 2 }],
                      max: 14,
                      step: 2,
                    },
                    {
                      name: "Audio Mode",
                      offset: 0xb,
                      type: "variable",
                      dataType: "uint8",
                      resource: "audioModes",
                    },
                    {
                      name: "Screen Ratio",
                      offset: 0xe,
                      type: "variable",
                      dataType: "uint8",
                      resource: "screenRatios",
                    },
                  ],
                },
                {
                  name: "Controller",
                  type: "section",
                  flex: true,
                  items: [
                    {
                      name: "Configuration",
                      offset: 0x11,
                      type: "variable",
                      dataType: "uint8",
                      resource: "configurations",
                    },
                    {
                      name: "Aiming Mode",
                      offset: 0x10,
                      type: "variable",
                      dataType: "uint8",
                      resource: "aimingModes",
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
    aimingModes: {
      0x1: "Normal",
      0xff: "Reverse",
    },
    audioModes: {
      0x0: "Stereo",
      0x1: "Mono",
    },
    configurations: {
      0x0: "Right Handed",
      0x1: "Left Handed",
    },
    missions: {
      0x0: "Lundkwist Base",
      0x1: "Subpen",
      0x100: "Embassy Function",
      0x101: "Warehouse",
      0x102: "K.G.B. HQ",
      0x103: "Security Hallway",
      0x104: "Sewage Control",
      0x105: "Escape",
      0x107: "Fire Alarm",
      0x200: "Interrogation",
      0x204: "CIA Rooftop",
      0x206: "Terminal Room",
      0x208: "Rooftop Escape",
      0x300: "Station",
      0x301: "Train car",
      0x303: "Train roof",
      0x400: "Subpen",
      0x401: "Tunnel",
      0x403: "Mainland",
      0x404: "Gunboat",
      0x500: "Game Done",
    },
    screenRatios: {
      0x0: "4/3",
      0x1: "16/9",
    },
  },
  resourcesLabels: {
    missions: {
      0x0: "Ice Hit",
      0x100: "Recover NOC List",
      0x200: "CIA Escape",
      0x300: "Mole Hunt",
      0x400: "Ice Storm",
      0x500: "Game Done",
    },
  },
};

export default template;
