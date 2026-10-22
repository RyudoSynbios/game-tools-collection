import type { GameJson } from "$lib/types";

const template: GameJson = {
  validator: {
    platforms: {
      playstation2: {
        europe: {
          0x0: [
            0x42, 0x45, 0x53, 0x43, 0x45, 0x53, 0x2d, 0x35, 0x30, 0x34, 0x39,
            0x30, 0x46, 0x46, 0x30, 0x39, 0x30, 0x36,
          ], // "BESCES-50490FF0906"
        },
        usa: {
          0x0: [
            0x42, 0x41, 0x53, 0x4c, 0x55, 0x53, 0x2d, 0x32, 0x30, 0x33, 0x31,
            0x32, 0x46, 0x46, 0x30, 0x39, 0x30, 0x36,
          ], // "BASLUS-20312FF0906"
        },
        japan: {
          0x0: [
            0x42, 0x49, 0x53, 0x4c, 0x50, 0x53, 0x2d, 0x32, 0x35, 0x30, 0x35,
            0x30, 0x46, 0x46, 0x30, 0x34, 0x32, 0x38,
          ], // "BISLPS-25050FF0428"
        },
        france: {
          0x0: [
            0x42, 0x45, 0x53, 0x43, 0x45, 0x53, 0x2d, 0x35, 0x30, 0x34, 0x39,
            0x31, 0x46, 0x46, 0x30, 0x39, 0x30, 0x36,
          ], // "BESCES-50491FF0906"
        },
        germany: {
          0x0: [
            0x42, 0x45, 0x53, 0x43, 0x45, 0x53, 0x2d, 0x35, 0x30, 0x34, 0x39,
            0x32, 0x46, 0x46, 0x30, 0x39, 0x30, 0x36,
          ], // "BESCES-50492FF0906"
        },
        italy: {
          0x0: [
            0x42, 0x45, 0x53, 0x43, 0x45, 0x53, 0x2d, 0x35, 0x30, 0x34, 0x39,
            0x33, 0x46, 0x46, 0x30, 0x39, 0x30, 0x36,
          ], // "BESCES-50493FF0906"
        },
        spain: {
          0x0: [
            0x42, 0x45, 0x53, 0x43, 0x45, 0x53, 0x2d, 0x35, 0x30, 0x34, 0x39,
            0x34, 0x46, 0x46, 0x30, 0x39, 0x30, 0x36,
          ], // "BESCES-50494FF0906"
        },
        japanInternational: {
          0x0: [
            0x42, 0x49, 0x53, 0x4c, 0x50, 0x53, 0x2d, 0x32, 0x35, 0x30, 0x38,
            0x38, 0x46, 0x46, 0x30, 0x39, 0x30, 0x36,
          ], // "BISLPS-25088FF0906"
        },
        koreaInternational: {
          0x0: [
            0x42, 0x4b, 0x53, 0x4c, 0x50, 0x4d, 0x2d, 0x36, 0x37, 0x35, 0x31,
            0x33, 0x46, 0x46, 0x30, 0x39, 0x30, 0x36,
          ], // "BKSLPM-67513FF0906"
        },
        asiaInternational: {
          0x0: [
            0x42, 0x49, 0x53, 0x4c, 0x50, 0x4d, 0x2d, 0x36, 0x35, 0x31, 0x31,
            0x35, 0x46, 0x46, 0x30, 0x39, 0x30, 0x36,
          ], // "BISLPM-65115FF0906"
        },
      },
      hdRemaster: {
        europe: {},
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
      instances: 1,
      resource: "slotNames",
      items: [
        {
          type: "section",
          flex: true,
          hidden: true,
          items: [
            {
              id: "checksumHeader",
              name: "Checksum Header",
              offset: 0x1a,
              type: "checksum",
              dataType: "uint16",
              control: {
                offsetStart: 0x40,
                offsetEnd: 0x64f8,
              },
            },
            {
              name: "Checksum",
              offset: 0x64f4,
              type: "checksum",
              dataType: "uint16",
              control: {
                offsetStart: 0x40,
                offsetEnd: 0x64f8,
              },
              order: 1,
            },
          ],
        },
        {
          type: "section",
          flex: true,
          items: [
            {
              name: "Save Count",
              offset: 0x0,
              type: "variable",
              dataType: "uint32",
              hidden: true,
            },
            {
              name: "Playtime (Save Preview?)",
              offset: 0x10,
              type: "variable",
              dataType: "uint32",
              hidden: true,
            },
          ],
        },
        {
          name: "Playtime",
          offset: 0xfc,
          type: "variable",
          dataType: "uint32",
          hidden: true,
        },
        {
          name: "Item",
          offset: 0x3f0c,
          type: "variable",
          dataType: "uint16",
          hex: true,
          hidden: true,
        },
      ],
    },
  ],
  resources: {
    letters: {
      0x3a: " ",
      // ...
      0x50: "A",
      0x51: "B",
      0x52: "C",
      0x53: "D",
      0x54: "E",
      0x55: "F",
      0x56: "G",
      0x57: "H",
      0x58: "I",
      0x59: "J",
      0x5a: "K",
      0x5b: "L",
      0x5c: "M",
      0x5d: "N",
      0x5e: "O",
      0x5f: "P",
      0x60: "Q",
      0x61: "R",
      0x62: "S",
      0x63: "T",
      0x64: "U",
      0x65: "V",
      0x66: "W",
      0x67: "X",
      0x68: "Y",
      0x69: "Z",
      // ...
      0x70: "a",
      0x71: "b",
      0x72: "c",
      0x73: "d",
      0x74: "e",
      0x75: "f",
      0x76: "g",
      0x77: "h",
      0x78: "i",
      0x79: "j",
      0x7a: "k",
      0x7b: "l",
      0x7c: "m",
      0x7d: "n",
      0x7e: "o",
      0x7f: "p",
      0x80: "q",
      0x81: "r",
      0x82: "s",
      0x83: "t",
      0x84: "u",
      0x85: "v",
      0x86: "w",
      0x87: "x",
      0x88: "y",
      0x89: "z",
    },
    slotNames: "getSlotNames()",
  },
};

export default template;
