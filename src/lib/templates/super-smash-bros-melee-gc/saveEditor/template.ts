import type { GameJson } from "$lib/types";

const template: GameJson = {
  validator: {
    regions: {
      europe: {
        0x0: [0x47, 0x41, 0x4c, 0x50, 0x30, 0x31], // "GALP01"
      },
    },
    text: "Drag 'n' drop here or click to add a save file.",
    error: "Not a valid save file.",
  },
  items: [
    {
      type: "tabs",
      items: [
        {
          name: "General",
          flex: true,
          items: [
            {
              name: "Coins",
              offset: 0x1e0,
              type: "variable",
              dataType: "uint32",
              bigEndian: true,
            },
            {
              name: "Power Count",
              offset: 0x1e8,
              type: "variable",
              dataType: "uint32",
              bigEndian: true,
            },
            {
              name: "Unlocked Challengers",
              type: "bitflags",
              flags: [
                { offset: 0x1, bit: 0, label: "Mr. Game & Watch" }, // prettier-ignore
                { offset: 0x1, bit: 1, label: "Pikatchu" }, // prettier-ignore
                { offset: 0x1, bit: 2, label: "Marth" }, // prettier-ignore
                { offset: 0x1, bit: 3, label: "Mewtwo" }, // prettier-ignore
                { offset: 0x1, bit: 4, label: "Jigglypuff" }, // prettier-ignore
                { offset: 0x1, bit: 5, label: "Falco" }, // prettier-ignore
                { offset: 0x1, bit: 6, label: "Young Link" }, // prettier-ignore
                { offset: 0x1, bit: 7, label: "Dr. Mario" }, // prettier-ignore
                { offset: 0x0, bit: 0, label: "Roy" }, // prettier-ignore
                { offset: 0x0, bit: 1, label: "Pichu" }, // prettier-ignore
                { offset: 0x0, bit: 2, label: "Ganondorf" }, // prettier-ignore
                { offset: 0x0, bit: 3, label: "???", hidden: true }, // prettier-ignore
                { offset: 0x0, bit: 4, label: "???", hidden: true }, // prettier-ignore
                { offset: 0x0, bit: 5, label: "???", hidden: true }, // prettier-ignore
                { offset: 0x0, bit: 6, label: "???", hidden: true }, // prettier-ignore
                { offset: 0x0, bit: 7, label: "???", hidden: true }, // prettier-ignore
              ],
            },
            {
              name: "Unlocked Stages",
              type: "bitflags",
              flags: [
                { offset: 0x3, bit: 0, label: "Planet Zebes: Brinstar Depths" }, // prettier-ignore
                { offset: 0x3, bit: 1, label: "Kanto Skies: Poké Floats" }, // prettier-ignore
                { offset: 0x3, bit: 2, label: "F-Zero Grand Prix: Big Blue" }, // prettier-ignore
                { offset: 0x3, bit: 3, label: "Eagleland: Fourside" }, // prettier-ignore
                { offset: 0x3, bit: 4, label: "Mushroom: Kingdom II" }, // prettier-ignore
                { offset: 0x3, bit: 5, label: "Superflat World: Flat Zone" }, // prettier-ignore
                { offset: 0x3, bit: 6, label: "Special Stages: Battlefield" }, // prettier-ignore
                { offset: 0x3, bit: 7, label: "Special Stages: Final Destination" }, // prettier-ignore
                { offset: 0x2, bit: 0, label: "Past Stages: Dream Land N64" }, // prettier-ignore
                { offset: 0x2, bit: 1, label: "Past Stages: Yoshi's Island N64" }, // prettier-ignore
                { offset: 0x2, bit: 2, label: "Past Stages: Kongo Jungle N64" }, // prettier-ignore
                { offset: 0x2, bit: 3, label: "???", hidden: true }, // prettier-ignore
                { offset: 0x2, bit: 4, label: "???", hidden: true }, // prettier-ignore
                { offset: 0x2, bit: 5, label: "???", hidden: true }, // prettier-ignore
                { offset: 0x2, bit: 6, label: "???", hidden: true }, // prettier-ignore
                { offset: 0x2, bit: 7, label: "???", hidden: true }, // prettier-ignore
              ],
            },
            {
              name: "Unlocked Options",
              type: "bitflags",
              flags: [
                { offset: 0x5, bit: 0, label: "???", hidden: true }, // prettier-ignore
                { offset: 0x5, bit: 1, label: "???", hidden: true }, // prettier-ignore
                { offset: 0x5, bit: 2, label: "???", hidden: true }, // prettier-ignore
                { offset: 0x5, bit: 3, label: "???", hidden: true }, // prettier-ignore
                { offset: 0x5, bit: 4, label: "???", hidden: true }, // prettier-ignore
                { offset: 0x5, bit: 5, label: "???", hidden: true }, // prettier-ignore
                { offset: 0x5, bit: 6, label: "???", hidden: true }, // prettier-ignore
                { offset: 0x5, bit: 7, label: "???", hidden: true }, // prettier-ignore
                { offset: 0x4, bit: 0, label: "???", hidden: true }, // prettier-ignore
                { offset: 0x4, bit: 1, label: "Random Stage" }, // prettier-ignore
                { offset: 0x4, bit: 2, label: "All-Star" }, // prettier-ignore
                { offset: 0x4, bit: 3, label: "Sound Test" }, // prettier-ignore
                { offset: 0x4, bit: 4, label: "???", hidden: true }, // prettier-ignore
                { offset: 0x4, bit: 5, label: "???", hidden: true }, // prettier-ignore
                { offset: 0x4, bit: 6, label: "???", hidden: true }, // prettier-ignore
                { offset: 0x4, bit: 7, label: "???", hidden: true }, // prettier-ignore
              ],
            },
          ],
        },
      ],
    },
  ],
};

export default template;
