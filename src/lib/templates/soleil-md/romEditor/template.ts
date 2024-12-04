import type { GameJson } from "$lib/types";

export const pointerToRoomsTable = [0x5c8e, 0x5c6a, 0x5e7e, 0x5e48];

const template: GameJson = {
  validator: {
    regions: {
      europe_france_germany_spain: {
        0x180: [
          0x47, 0x4d, 0x20, 0x4d, 0x4b, 0x2d, 0x30, 0x31, 0x31, 0x38, 0x32,
          0x2d, 0x30, 0x30,
        ], // "GM MK-01182-00"
      },
      usa: {
        0x180: [
          0x47, 0x4d, 0x20, 0x54, 0x2d, 0x31, 0x34, 0x34, 0x30, 0x32, 0x36,
          0x2d, 0x30, 0x30,
        ], // "GM T-144026-00"
      },
      japan: {
        $and: [
          {
            0x118: [0x31, 0x39, 0x39, 0x34], // "1994"
          },
          {
            0x180: [
              0x47, 0x4d, 0x20, 0x47, 0x2d, 0x30, 0x30, 0x35, 0x35, 0x33, 0x36,
              0x2d, 0x30, 0x31,
            ], // "GM G-005536-01"
          },
        ],
      },
      korea: {
        $and: [
          {
            0x118: [0x31, 0x39, 0x39, 0x35], // "1995"
          },
          {
            0x180: [
              0x47, 0x4d, 0x20, 0x47, 0x2d, 0x30, 0x30, 0x35, 0x35, 0x33, 0x36,
              0x2d, 0x30, 0x31,
            ], // "GM G-005536-01"
          },
        ],
      },
    },
    text: "Drag 'n' drop here or click to add a rom file.",
    error: "Not a valid rom file.",
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
        offsetEnd: 0x200000,
      },
    },
    {
      type: "tabs",
      items: [
        {
          name: "Map Viewer",
          items: [
            {
              instanceId: "mapViewer",
              length: 0x2,
              type: "container",
              instanceType: "tabs",
              instances: 141,
              enumeration: "Map %d",
              indexes: true,
              vertical: true,
              flex: true,
              items: [
                {
                  type: "component",
                  component: "MapViewer",
                  props: { roomIndex: "mapViewer" },
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
