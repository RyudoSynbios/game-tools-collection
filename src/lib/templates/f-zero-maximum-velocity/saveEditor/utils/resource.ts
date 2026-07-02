import type { Resource } from "$lib/types";

export const machineList = [
  { index: 0x4, name: "Hot Violet" },
  { index: 0x0, name: "Fire Ball" },
  { index: 0x3, name: "J.B.Crystal" },
  { index: 0x2, name: "Wind Walker" },
  { index: 0x1, name: "Sly Joker" },
  { index: 0x7, name: "The Stringray" },
  { index: 0x6, name: "Silver Thunder" },
  { index: 0x5, name: "Falcon Mk-II" },
  { index: 0x8, name: "Fighting Comet" },
  { index: 0x9, name: "Jet Vermilion" },
];

export const machines: Resource = {};
export const machinesOrder: number[] = [];

machineList.forEach((machine) => {
  machines[machine.index] = machine.name;
  machinesOrder.push(machine.index);
});

// prettier-ignore
export const series = [
  {
    name: "Pawn",
    courses: [
      { index: 0x0b, name: "Bianca City 1" },
      { index: 0x08, name: "Stark Farm 1" },
      { index: 0x0c, name: "Empyrean Colony 1" },
      { index: 0x0e, name: "Stark Farm 2" },
      { index: 0x03, name: "Cloud Carpet 1" },
    ],
  },
  {
    name: "Knight",
    courses: [
      { index: 0x00, name: "Tenth Zone East 1" },
      { index: 0x01, name: "Beacon Port" },
      { index: 0x09, name: "Synobazz" },
      { index: 0x0f, name: "Ancient Mesa 1" },
      { index: 0x12, name: "Stark Farm 3" },
    ],
  },
  {
    name: "Bishop",
    courses: [
      { index: 0x06, name: "Bianca City 2" },
      { index: 0x05, name: "Ancient Mesa 2" },
      { index: 0x0a, name: "Crater Land 1" },
      { index: 0x04, name: "Cloud Carpet 2" },
      { index: 0x13, name: "Bianca City 3" },
    ],
  },
  {
    name: "Queen",
    courses: [
      { index: 0x07, name: "Crater Land 2" },
      { index: 0x10, name: "Tenth Zone East 2" },
      { index: 0x0d, name: "Empyrean Colony 2" },
      { index: 0x02, name: "Fire Field 1" },
      { index: 0x11, name: "Fire Field 2" },
    ],
  },
  {
    name: "Championship",
    courses: [
      { index: 0x14, name: "Synobazz" },
    ],
  },
];
