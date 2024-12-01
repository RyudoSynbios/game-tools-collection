import type { GameJson } from "$lib/types";

const template: GameJson = {
  validator: {
    regions: {
      europe_australia: {
        0x0: [
          0x42, 0x45, 0x53, 0x43, 0x45, 0x53, 0x2d, 0x30, 0x30, 0x33, 0x34,
          0x34,
        ], // "BESCES-00344"
      },
      usa: {
        0x0: [
          0x42, 0x41, 0x53, 0x43, 0x55, 0x53, 0x2d, 0x39, 0x34, 0x39, 0x30,
          0x30,
        ], // "BASCUS-94900"
      },
      japan: {
        0x0: [
          0x42, 0x49, 0x53, 0x43, 0x50, 0x53, 0x2d, 0x31, 0x30, 0x30, 0x33,
          0x31,
        ], // "BISCPS-10031"
      },
    },
    text: "Drag 'n' drop here or click to add a save file.",
    error: "Not a valid save file.",
  },
  items: [
    {
      id: "slots",
      instanceId: "slots",
      length: 0x2000,
      type: "container",
      instanceType: "tabs",
      instances: 15,
      enumeration: "Slot %d",
      items: [
        {
          name: "Checksum",
          offset: 0x7c,
          type: "checksum",
          dataType: "uint32",
          control: {
            offsetStart: 0x0,
            offsetEnd: 0x80,
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
                  noMargin: true,
                  items: [
                    {
                      id: "completionRate-%index%",
                      name: "Completion Rate",
                      offset: 0x12,
                      type: "variable",
                      dataType: "uint8",
                      overrideShift: {
                        parent: 1,
                        shift: 0x0,
                      },
                      suffix: "%",
                      disabled: true,
                    },
                    {
                      name: "Current Level",
                      offset: 0x4,
                      type: "variable",
                      dataType: "uint32",
                      hidden: true,
                      test: true,
                    },
                    {
                      name: "Current Level (Save Preview)",
                      offset: 0x0,
                      type: "variable",
                      dataType: "uint16",
                      binary: { bitStart: 0, bitLength: 5 },
                      hidden: true,
                    },
                    {
                      name: "Gems Obtained (Save Preview)",
                      offset: 0x0,
                      type: "variable",
                      dataType: "uint16",
                      binary: { bitStart: 5, bitLength: 5 },
                      hidden: true,
                    },
                    {
                      name: "Keys Obtained (Save Preview)",
                      offset: 0x1,
                      type: "variable",
                      dataType: "uint8",
                      binary: { bitStart: 2, bitLength: 2 },
                      hidden: true,
                    },
                  ],
                },
                {
                  type: "section",
                  flex: true,
                  items: [
                    {
                      id: "levels-%index%",
                      name: "Levels",
                      type: "bitflags",
                      flags: [
                        { offset: 0x4, bit: 0, label: "N. Sanity Beach" },
                        { offset: 0x4, bit: 0, label: "Jungle Rollers" },
                        { offset: 0x4, bit: 0, label: "The Great Gate" },
                        { offset: 0x4, bit: 0, label: "Boulders" },
                        { offset: 0x4, bit: 0, label: "Upstream" },
                        { offset: 0x4, bit: 0, label: "Papu Papu" },
                        { offset: 0x4, bit: 0, label: "Rolling Stones" },
                        { offset: 0x4, bit: 0, label: "Hog Wild" },
                        { offset: 0x4, bit: 0, label: "Native Fortress", separator: true },
                        { offset: 0x4, bit: 0, label: "Up the Creek" },
                        { offset: 0x4, bit: 0, label: "Ripper Roo" },
                        { offset: 0x4, bit: 0, label: "The Lost City" },
                        { offset: 0x4, bit: 0, label: "Temple Ruins" },
                        { offset: 0x4, bit: 0, label: "Road to Nowhere" },
                        { offset: 0x4, bit: 0, label: "Boulder Dash" },
                        { offset: 0x4, bit: 0, label: "Sunset Vista" },
                        { offset: 0x4, bit: 0, label: "Koala Kong", separator: true },
                        { offset: 0x4, bit: 0, label: "Heavy Machinery" },
                        { offset: 0x4, bit: 0, label: "Cortex Power" },
                        { offset: 0x4, bit: 0, label: "Generator Room" },
                        { offset: 0x4, bit: 0, label: "Toxic Waste" },
                        { offset: 0x4, bit: 0, label: "Pinstripe" },
                        { offset: 0x4, bit: 0, label: "The High Road" },
                        { offset: 0x4, bit: 0, label: "Slippery Climb" },
                        { offset: 0x4, bit: 0, label: "Lights Out" },
                        { offset: 0x4, bit: 0, label: "Jaws of Darkness" },
                        { offset: 0x4, bit: 0, label: "Castle Machinery" },
                        { offset: 0x4, bit: 0, label: "Nitrus Brio" },
                        { offset: 0x4, bit: 0, label: "The Lab" },
                        { offset: 0x4, bit: 0, label: "The Great Hall" },
                        { offset: 0x4, bit: 0, label: "Dr. Neo Cortex", disabled: true, separator: true },
                        { offset: 0x22, bit: 4, label: "Whole Dog" },
                        { offset: 0x21, bit: 2, label: "Fumbling in the Dark" },
                      ],
                    },
                    {
                      id: "gems-%index%",
                      name: "Gems",
                      type: "bitflags",
                      flags: [
                        { offset: 0x1c, bit: 1, label: "N. Sanity Beach" },
                        { offset: 0x1c, bit: 2, label: "Jungle Rollers" },
                        { offset: 0x1c, bit: 3, label: "The Great Gate" },
                        { offset: 0x1c, bit: 4, label: "Boulders" },
                        { offset: 0x1c, bit: 5, label: "Upstream" },
                        { offset: 0x1c, bit: 6, label: "Papu Papu", disabled: true },
                        { offset: 0x1c, bit: 7, label: "Rolling Stones" },
                        { offset: 0x1d, bit: 0, label: "Hog Wild" },
                        { offset: 0x1d, bit: 1, label: "Native Fortress", separator: true },
                        { offset: 0x1d, bit: 2, label: "Up the Creek" },
                        { offset: 0x1d, bit: 3, label: "Ripper Roo", disabled: true },
                        { offset: 0x1d, bit: 4, label: "<span style='color: green;'>The Lost City</span>" },
                        { offset: 0x1d, bit: 5, label: "Temple Ruins" },
                        { offset: 0x1d, bit: 6, label: "Road to Nowhere" },
                        { offset: 0x1d, bit: 7, label: "Boulder Dash" },
                        { offset: 0x1e, bit: 0, label: "Sunset Vista" },
                        { offset: 0x1e, bit: 1, label: "Koala Kong", disabled: true, separator: true },
                        { offset: 0x1e, bit: 2, label: "Heavy Machinery" },
                        { offset: 0x1e, bit: 3, label: "Cortex Power" },
                        { offset: 0x1e, bit: 4, label: "<span style='color: orange;'>Generator Room</span>" },
                        { offset: 0x1e, bit: 5, label: "<span style='color: deepskyblue;'>Toxic Waste</span>" },
                        { offset: 0x1e, bit: 6, label: "Pinstripe", disabled: true },
                        { offset: 0x1e, bit: 7, label: "The High Road" },
                        { offset: 0x1f, bit: 0, label: "<span style='color: red;'>Slippery Climb" },
                        { offset: 0x1f, bit: 1, label: "<span style='color: hotpink;'>Lights Out" },
                        { offset: 0x1f, bit: 2, label: "Jaws of Darkness" },
                        { offset: 0x1f, bit: 3, label: "Castle Machinery" },
                        { offset: 0x1f, bit: 4, label: "Nitrus Brio", disabled: true },
                        { offset: 0x1f, bit: 5, label: "<span style='color: yellow;'>The Lab" },
                        { offset: 0x1f, bit: 6, label: "The Great Hall", disabled: true },
                        { offset: 0x1f, bit: 7, label: "Dr. Neo Cortex", disabled: true, separator: true },
                        { offset: 0x22, bit: 2, label: "Whole Dog" },
                        { offset: 0x21, bit: 0, label: "Fumbling in the Dark" },
                      ],
                    },
                  ],
                },
              ],
            },
            {
              name: "Options",
              flex: true,
              items: [
                {
                  name: "Sound Mode",
                  offset: 0x10,
                  type: "variable",
                  dataType: "uint32",
                  hidden: true,
                },
                {
                  name: "Effects Volume",
                  offset: 0x14,
                  type: "variable",
                  dataType: "uint32",
                },
                {
                  name: "Music Volume",
                  offset: 0x18,
                  type: "variable",
                  dataType: "uint32",
                },
              ],
            },
          ],
        },
      ],
    },
  ],
};

export default template;
