import type { GameJson } from "$lib/types";

const template: GameJson = {
  validator: {
    regions: {
      europe: {
        0x20: [
          0x42, 0x4f, 0x4d, 0x42, 0x45, 0x52, 0x4d, 0x41, 0x4e, 0x36, 0x34,
          0x45,
        ], // "BOMBERMAN64E"
      },
      usa: {
        0x20: [
          0x42, 0x4f, 0x4d, 0x42, 0x45, 0x52, 0x4d, 0x41, 0x4e, 0x36, 0x34,
          0x55,
        ], // "BOMBERMAN64U"
      },
      japan: {
        0x20: [
          0x42, 0x41, 0x4b, 0x55, 0x2d, 0x42, 0x4f, 0x4d, 0x42, 0x45, 0x52,
          0x4d, 0x41, 0x4e,
        ], // "BAKU-BOMBERMAN"
      },
    },
    text: "Drag 'n' drop here or click to add a rom file.",
    error: "Not a valid rom file.",
  },
  items: [
    {
      type: "tabs",
      items: [
        {
          name: "Asset Viewer",
          items: [
            {
              instanceId: "assetViewer",
              length: 0x2,
              type: "container",
              instanceType: "tabs",
              instances: 873,
              enumeration: "Asset %d",
              vertical: true,
              flex: true,
              items: [
                {
                  type: "component",
                  component: "AssetViewer",
                  props: { assetIndex: "assetViewer" },
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
