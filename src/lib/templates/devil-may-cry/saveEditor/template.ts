import type { GameJson } from "$lib/types";

const template: GameJson = {
  validator: {
    platforms: {
      playstation2: {
        europe: {
          0x0: [
            0x42, 0x45, 0x53, 0x4c, 0x45, 0x53, 0x2d, 0x35, 0x30, 0x33, 0x35,
            0x38,
          ], // "BESLES-50358"
        },
        usa: {
          0x0: [
            0x42, 0x41, 0x53, 0x4c, 0x55, 0x53, 0x2d, 0x32, 0x30, 0x32, 0x31,
            0x36,
          ], // "BASLUS-20216"
        },
        japan: {
          0x0: [
            0x42, 0x49, 0x53, 0x4c, 0x50, 0x4d, 0x2d, 0x36, 0x35, 0x30, 0x33,
            0x38,
          ], // "BISLPM-65038"
        },
        korea: {
          0x0: [
            0x42, 0x49, 0x53, 0x4c, 0x50, 0x4d, 0x2d, 0x36, 0x37, 0x35, 0x30,
            0x32,
          ], // "BISLPM-67502"
        },
      },
    },
    text: "Drag 'n' drop here or click to add a save file.",
    error: "Not a valid save file.",
  },
  items: [
    {
      id: "slots",
      length: 0x0,
      type: "container",
      instanceType: "tabs",
      instances: 10,
      enumeration: "Slot %d",
      disableSubinstanceIf: {
        offset: 0x8,
        type: "variable",
        dataType: "uint32",
        operator: "=",
        value: 0x0,
      },
      items: [
        {
          name: "Checksum",
          offset: 0x8,
          type: "checksum",
          dataType: "uint32",
          control: {
            offsetStart: 0x10,
            offsetEnd: 0x970,
          },
        },
        {
          type: "tabs",
          items: [
            {
              name: "General",
              items: [],
            },
          ],
        },
      ],
    },
  ],
};

export default template;
