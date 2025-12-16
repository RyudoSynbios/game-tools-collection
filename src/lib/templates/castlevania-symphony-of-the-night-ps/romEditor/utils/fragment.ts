import type { ItemBitflags } from "$lib/types";

export function attributesFragment(name: string, offset: number): ItemBitflags {
  return {
    name,
    dataViewAltKey: "dra",
    type: "bitflags",
    flags: [
      { offset, bit: 0, label: "???", hidden: true },
      { offset, bit: 1, label: "???", hidden: true },
      { offset, bit: 2, label: "???", hidden: true },
      { offset, bit: 3, label: "???", hidden: true },
      { offset, bit: 4, label: "???", hidden: true },
      { offset, bit: 5, label: "Hit" },
      { offset, bit: 6, label: "Cut" },
      { offset, bit: 7, label: "Poison" },
      { offset: offset + 0x1, bit: 0, label: "Curse" },
      { offset: offset + 0x1, bit: 1, label: "Stone" },
      { offset: offset + 0x1, bit: 2, label: "Water" },
      { offset: offset + 0x1, bit: 3, label: "Dark" },
      { offset: offset + 0x1, bit: 4, label: "Holy" },
      { offset: offset + 0x1, bit: 5, label: "Ice" },
      { offset: offset + 0x1, bit: 6, label: "Thunder" },
      { offset: offset + 0x1, bit: 7, label: "Fire" },
    ],
  };
}
