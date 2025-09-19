import type { GameJson } from "$lib/types";

const template: GameJson = {
  validator: {
    regions: {
      europe: {
        0x0: [
          0x41, 0x47, 0x42, 0x5a, 0x45, 0x4c, 0x44, 0x41, 0x3a, 0x54, 0x48,
          0x45, 0x20, 0x4d, 0x49, 0x4e, 0x49, 0x53, 0x48, 0x20, 0x43, 0x41,
          0x50, 0x3a, 0x5a, 0x45, 0x4c, 0x44, 0x41,
        ], // "AGBZELDA:THE MINISH CAP:ZELDA"
      },
      usa: {
        0x0: [
          0x41, 0x47, 0x42, 0x5a, 0x45, 0x4c, 0x44, 0x41, 0x3a, 0x54, 0x48,
          0x45, 0x20, 0x4d, 0x49, 0x4e, 0x49, 0x53, 0x48, 0x20, 0x43, 0x41,
          0x50, 0x3a, 0x5a, 0x45, 0x4c, 0x44, 0x41,
        ], // "AGBZELDA:THE MINISH CAP:ZELDA"
      },
      japan: {
        0x0: [
          0x41, 0x47, 0x42, 0x5a, 0x45, 0x4c, 0x44, 0x41, 0x3a, 0x54, 0x48,
          0x45, 0x20, 0x4d, 0x49, 0x4e, 0x49, 0x53, 0x48, 0x20, 0x43, 0x41,
          0x50, 0x3a, 0x5a, 0x45, 0x4c, 0x44, 0x41,
        ], // "AGBZELDA:THE MINISH CAP:ZELDA"
      },
    },
    text: "Drag 'n' drop here or click to add a save file.",
    error: "Not a valid save file.",
  },
  items: [
    {
      name: "Checksum",
      offset: 0x20,
      type: "checksum",
      dataType: "uint32",
      control: {
        offsetStart: 0x70,
        offsetEnd: 0x80,
      },
    },
    {
      id: "slots",
      length: 0x500,
      type: "container",
      instanceType: "tabs",
      instances: 3,
      enumeration: "Slot %d",
      items: [
        {
          name: "Checksum",
          offset: 0x30,
          type: "checksum",
          dataType: "uint32",
          control: {
            offsetStart: 0x80,
            offsetEnd: 0x580,
          },
          overrideShift: {
            parent: 1,
            shift: 0x10,
          },
        },
        {
          type: "tabs",
          items: [
            {
              name: "General",
              items: [
                {
                  name: "Name",
                  offset: 0x100,
                  length: 0x6,
                  type: "variable",
                  dataType: "string",
                  letterDataType: "uint8",
                  regex: "[ !',\-.0-9:?A-Za-zŒœÀ-ÂÄÆ-ÔÖÙ-Üà-âäæ-ôöù-ü]",
                  test: true,
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
