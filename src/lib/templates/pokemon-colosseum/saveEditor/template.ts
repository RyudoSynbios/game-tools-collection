import type { GameJson } from "$lib/types";

const template: GameJson = {
  validator: {
    platforms: {
      gamecube: {
        europe: { 0x0: [0x47, 0x43, 0x36, 0x50, 0x30, 0x31] }, // "GC6P01"
        usa: { 0x0: [0x47, 0x43, 0x36, 0x45, 0x30, 0x31] }, // "GC6E01"
        japan: { 0x0: [0x47, 0x43, 0x36, 0x4a, 0x30, 0x31] }, // "GC6J01"
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
      bigEndian: true,
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
          items: [
            {
              type: "section",
              flex: true,
              items: [
                {
                  name: "System Save Count",
                  offset: 0x4,
                  type: "variable",
                  dataType: "uint32",
                  bigEndian: true,
                  hidden: true,
                },
                {
                  name: "Region",
                  offset: 0xa,
                  type: "variable",
                  dataType: "uint8",
                  resource: "regions",
                },
                {
                  name: "Language",
                  offset: 0xb,
                  type: "variable",
                  dataType: "uint8",
                  resource: "languages",
                },
              ],
            },
            {
              type: "section",
              flex: true,
              items: [
                {
                  name: "Save Count",
                  offset: 0x18,
                  type: "variable",
                  dataType: "uint32",
                  bigEndian: true,
                  hidden: true,
                },
                {
                  name: "Name",
                  offset: 0x78,
                  length: 0xe,
                  type: "variable",
                  dataType: "string",
                  letterDataType: "uint16",
                  letterBigEndian: true,
                  fallback: 0x20,
                  endCode: 0x0,
                  // regex:
                },
                {
                  name: "Playtime",
                  offset: 0x28,
                  type: "variable",
                  dataType: "float32",
                  bigEndian: true,
                  hidden: true,
                },
              ],
            },
          ],
        },
        {
          name: "Settings",
          items: [
            {
              type: "section",
              flex: true,
              items: [
                {
                  // id: "europeOnly",
                  name: "Language",
                  offset: 0x33,
                  type: "variable",
                  dataType: "uint8",
                  resource: "languages",
                },
                {
                  name: "Rumble",
                  offset: 0x31,
                  type: "variable",
                  dataType: "uint8",
                  resource: "optionBooleanReversed",
                },
              ],
            },
          ],
        },
      ],
    },
  ],
  resources: {
    languages: {
      0x1: "Japanese",
      0x2: "English",
      0x3: "German",
      0x4: "French",
      0x5: "Italian",
      0x6: "Spanish",
    },
    optionBooleanReversed: {
      0x0: "On",
      0x1: "Off",
    },
    regions: {
      0x1: "Japan",
      0x2: "USA",
      0x3: "Europe",
    },
  },
};

export default template;
