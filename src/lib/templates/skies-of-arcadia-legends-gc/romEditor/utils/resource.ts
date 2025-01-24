export const enemyTypes = [
  { name: "Commons", instances: 120, dataViewAltKey: "ecinit.dat" },
  { name: "Bosses", instances: 125, dataViewAltKey: "ebinit.dat" },
];

export const mainDolDataViews = [
  {
    name: "party",
    count: 6,
    length: 0x98,
    shifts: [0x2f2c0],
    europe: {
      length: 0x98,
      textPointer: 0x0,
      operations: [{ start: 0x0, end: 0x98, offset: 0x0 }],
    },
  },
  {
    name: "magic",
    count: 62,
    length: 0x30,
    shifts: [],
    europe: {
      length: 0x24,
      textPointer: 0xf60,
      operations: [
        { start: 0x4, end: 0x5, offset: 0x11 },
        { start: 0x6, end: 0x24, offset: 0x12 },
      ],
    },
  },
  {
    name: "weapons",
    count: 80,
    length: 0x20,
    shifts: [],
    isInventory: true,
    europe: {
      length: 0x14,
      textPointer: 0xf90,
      operations: [
        { start: 0x4, end: 0x9, offset: 0x11 },
        { start: 0xa, end: 0x14, offset: 0x16 },
      ],
    },
  },
  {
    name: "armors",
    count: 80,
    length: 0x28,
    shifts: [],
    isInventory: true,
    europe: {
      length: 0x1c,
      textPointer: 0xfc0,
      operations: [
        { start: 0x4, end: 0x8, offset: 0x11 },
        { start: 0x8, end: 0x1a, offset: 0x16 },
      ],
    },
  },
  {
    name: "accessories",
    count: 80,
    length: 0x28,
    shifts: [, 0xe24, 0xe24],
    isInventory: true,
    europe: {
      length: 0x1c,
      textPointer: 0xff0,
      operations: [
        { start: 0x4, end: 0x8, offset: 0x11 },
        { start: 0x8, end: 0x1a, offset: 0x16 },
      ],
    },
  },
  {
    name: "items",
    count: 80,
    length: 0x24,
    shifts: [],
    isInventory: true,
    europe: {
      length: 0x18,
      textPointer: 0x1020,
      operations: [
        { start: 0x4, end: 0xb, offset: 0x11 },
        { start: 0xc, end: 0x18, offset: 0x18 },
      ],
    },
  },
  {
    name: "keyItems",
    count: 80,
    length: 0x16,
    shifts: [],
    isInventory: true,
    europe: {
      length: 0xc,
      textPointer: 0x1050,
      operations: [
        { start: 0x4, end: 0x7, offset: 0x11 },
        { start: 0x8, end: 0xa, offset: 0x14 },
      ],
    },
  },
  {
    name: "ranks",
    count: 24,
    length: 0x22,
    shifts: [0x1eac, 0xdae0, 0xe228],
    europe: {
      length: 0x10,
      textPointer: 0x1080,
      operations: [
        { start: 0x4, end: 0x5, offset: 0x19 },
        { start: 0x6, end: 0xe, offset: 0x1a },
      ],
    },
  },
  {
    name: "enemyShips",
    count: 45,
    length: 0x78,
    shifts: [],
    europe: {
      length: 0x68,
      textPointer: 0x1110,
      operations: [{ start: 0x4, end: 0x68, offset: 0x14 }],
    },
  },
  {
    name: "shipWeapons",
    count: 40,
    length: 0x24,
    shifts: [],
    isInventory: true,
    europe: {
      length: 0x18,
      textPointer: 0x1140,
      operations: [
        { start: 0x4, end: 0x7, offset: 0x11 },
        { start: 0x8, end: 0x18, offset: 0x14 },
      ],
    },
  },
  {
    name: "shipAccessories",
    count: 40,
    length: 0x28,
    shifts: [],
    isInventory: true,
    europe: {
      length: 0x1c,
      textPointer: 0x1170,
      operations: [
        { start: 0x4, end: 0x5, offset: 0x11 },
        { start: 0x6, end: 0x1c, offset: 0x12 },
      ],
    },
  },
  {
    name: "shipItems",
    count: 30,
    length: 0x24,
    shifts: [],
    isInventory: true,
    europe: {
      length: 0x18,
      textPointer: 0x11a0,
      operations: [
        { start: 0x4, end: 0x8, offset: 0x11 },
        { start: 0x8, end: 0xe, offset: 0x16 },
        { start: 0x10, end: 0x18, offset: 0x1c },
      ],
    },
  },
  {
    name: "crew",
    count: 22,
    length: 0x24,
    shifts: [],
    europe: {
      length: 0x18,
      textPointer: 0x11d0,
      operations: [
        { start: 0x4, end: 0x5, offset: 0x11 },
        { start: 0x6, end: 0x18, offset: 0x12 },
      ],
    },
  },
];
