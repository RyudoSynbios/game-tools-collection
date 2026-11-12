import type { GameJson } from "$lib/types";

const template: GameJson = {
  validator: {
    platforms: {
      steam: {
        world: { 0x0: [0x53, 0x56, 0x48, 0x44] },
      },
    },
    text: "Drag 'n' drop here or click to add a save file.",
    // hint: 'Designed to work with v1.2.0.\nOther versions may work, but may corrupt the save.\nPlease make a backup before editing.',
    error: "Not a valid save file.",
  },
  items: [
    {
      type: "tabs",
      items: [{ name: "test", items: [] }],
    },
  ],
};

export default template;
