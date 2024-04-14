import type { GameJson } from "$lib/types";

const template: GameJson = {
  validator: {
    regions: {
      europe_usa: {
        0x180: [
          0x47, 0x6b, 0x20, 0x30, 0x30, 0x30, 0x30, 0x31, 0x30, 0x31, 0x35,
          0x2d, 0x30, 0x30,
        ], // "Gk 00001015-00"
      },
    },
    text: "Drag 'n' drop here or click to add a save file.",
    error: "Not a valid save file.",
  },
  items: [
    {
      name: "Checksum",
      offset: 0x18e,
      type: "checksum",
      dataType: "uint16",
      bigEndian: true,
      control: {
        offsetStart: 0x200,
        offsetEnd: 0x80000,
      },
    },
    {
      type: "component",
      component: "Debug",
    },
  ],
  resources: {},
};

export default template;
