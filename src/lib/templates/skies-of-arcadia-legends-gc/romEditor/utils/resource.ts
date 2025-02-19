import type { Resource } from "$lib/types";

export const abilityTypes = [
  {
    id: "magic",
    name: "Magic",
    resource: "magicNames",
    count: 36,
  },
  {
    id: "superMoves",
    name: "Super Moves",
    resource: "superMoveNames",
    count: 24,
  },
  {
    id: "crewSuperMoves",
    name: "Crew Super Moves",
    resource: "crewSuperMoveNames",
    count: 2,
  },
];

export const abilityEffects: Resource = {
  0x0: "Damage",
  0x1: "Decrease damages received",
  0x4: "Inflict Poison",
  0x5: "Inflict Death",
  0x6: "Inflict Death or damages if immune",
  0x8: "Inflict Stone",
  0x9: "Inflict Sleep",
  0xb: "Inflict Confusion",
  0xc: "Inflict Silence",
  0x11: "Remove beneficial effects",
  0x14: "Increase Quick",
  0x15: "Increase Attack and Defense",
  0x1a: "Inflict Weak",
  0x1b: "Revive and restores half HP",
  0x1c: "Revive and restores all HP",
  0x1e: "Cure conditions",
  0x1f: "Restore some HP",
  0x20: "Restore all HP",
  0x21: "Regenerate",
  0x23: "Restore some Spirit",
  0x26: "???", // TODO
  0x27: "Block Magic",
  0x29: "???", // TODO
  0x2a: "Block adverse conditions",
  0x2e: "???", // TODO
  0x2f: "???", // TODO
  0x30: "Restore some MP",
  0x31: "Restore all MP",
  0x33: "Revive and restores completly",
  0x34: "Super Move Learning related",
  0x35: "Cupil evolution related 1",
  0x36: "Increase Power permanently",
  0x37: "Increase Will permanently",
  0x38: "Increase Vigor permanently",
  0x39: "Increase Agile permanently",
  0x3a: "Increase Quick permanently",
  0x3b: "Increase Max HP permanently",
  0x3c: "Increase Max MP permanently",
  0x41: "Prophecy",
  0x42: "Blue Rogues",
  0x44: "???", // TODO
  0x45: "???", // TODO
  0x46: "???", // TODO
  0x47: "???", // TODO
  0x49: "???", // TODO
  0x4b: "Cupil evolution related 2",
  0x4c: "Cupil evolution related 3",
  0x4d: "???", // TODO
  0xff: "-",
};

export const shipAbilityEffects: Resource = {
  0x64: "Restore some HP",
  0x65: "Restore all HP",
  0x66: "Restore some Spirit",
  0x67: "Restore all Spirit",
  0x68: "Increase Quick",
  0x69: "Increase Attack and Defense",
  0x6a: "Inflict Weak",
  0x6b: "Damage",
  0x6c: "Increase Stats",
  0x6d: "Block Attack",
  0x6e: "Block Magic",
  0x6f: "???", // TODO
  0x70: "???", // TODO
  0x71: "Reduce by 50% Spirit consumption",
  0x72: "Restore 200% Spirit",
  0x73: "Increase Level permanently",
  0x74: "Inflict Silence",
  0xff: "-",
};

export const itemEffects: Resource = {
  0x0: "Power",
  0x1: "Will",
  0x2: "Vigor",
  0x3: "Agile",
  0x4: "Quick",
  0x10: "Attack",
  0x11: "Defense",
  0x12: "Magic Defense",
  0x13: "Hit",
  0x14: "Dodge",
  0x20: "Green Weakness",
  0x21: "Red Weakness",
  0x22: "Purple Weakness",
  0x23: "Blue Weakness",
  0x24: "Yellow Weakness",
  0x25: "Silver Weakness",
  0x30: "Poison Weakness",
  0x31: "Death Weakness",
  0x32: "Stone Weakness",
  0x33: "Sleep Weakness",
  0x34: "Confusion Weakness",
  0x35: "Silence Weakness",
  0x36: "Fatigue Weakness",
  0x38: "Weak Weakness",
  0x40: "Invulnerable to magic",
  0x41: "Invulnerable to physical",
  0x44: "Party Spirit to 0",
  0x49: "Counter +",
  0x4d: "Spirit Recovery",
  0x4e: "Health Recovery",
  0x4f: "Condition Weaknesses",
  0x50: "First Strike",
  0x51: "Retreat",
  0x52: "Enemy Ambush",
  0x53: "Enemy Retreat",
  0x54: "Random Encounters",
  0xff: "-",
};

export const shipItemEffects: Resource = {
  0x2: "Defense",
  0x3: "Magic Defense",
  0x4: "Quick",
  0x6: "Dodge",
  0x7: "Value",
  0x20: "Green Weakness",
  0x21: "Red Weakness",
  0x22: "Purple Weakness",
  0x23: "Blue Weakness",
  0x24: "Yellow Weakness",
  0x25: "Silver Weakness",
  0x30: "Main Cannon Attack",
  0x40: "Secondary Cannon Attack",
  0x51: "Torpedo Hit",
  0x60: "Spirit Cannon Attack",
  0xff: "-",
};

export const mainDolModels = {
  weaponColors: {
    count: 6,
    length: 0xc,
    shifts: [0x159c8, 0x17b48, 0x17598],
    isInventory: false,
    europe: {
      length: 0xc,
      textPointer: 0x0,
      operations: [{ start: 0x0, end: 0xc, offset: 0x0 }],
    },
  },
  party: {
    count: 6,
    length: 0x98,
    shifts: [0x2f2c0],
    isInventory: false,
    europe: {
      length: 0x98,
      textPointer: 0x0,
      operations: [{ start: 0x0, end: 0x98, offset: 0x0 }],
    },
  },
  abilities: {
    count: 62,
    length: 0x30,
    shifts: [],
    isInventory: false,
    europe: {
      length: 0x24,
      textPointer: 0xf60,
      operations: [
        { start: 0x4, end: 0x5, offset: 0x11 },
        { start: 0x6, end: 0x24, offset: 0x12 },
      ],
    },
  },
  weapons: {
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
  armors: {
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
  accessories: {
    count: 80,
    length: 0x28,
    shifts: [-0x2f9c0],
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
  weaponConditions: {
    count: 21,
    length: 0x14,
    shifts: [0x30280],
    isInventory: false,
    europe: {
      length: 0x14,
      textPointer: 0x0,
      operations: [{ start: 0x0, end: 0x14, offset: 0x0 }],
    },
  },
  items: {
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
  keyItems: {
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
  ranks: {
    count: 24,
    length: 0x22,
    shifts: [-0x303c8],
    isInventory: false,
    europe: {
      length: 0x10,
      textPointer: 0x1080,
      operations: [
        { start: 0x4, end: 0x5, offset: 0x19 },
        { start: 0x6, end: 0xe, offset: 0x1a },
      ],
    },
  },
  spiritCurves: {
    count: 6,
    length: 0xc6,
    shifts: [0xcb70, 0xc864, 0xd054],
    isInventory: false,
    europe: {
      length: 0xc6,
      textPointer: 0,
      operations: [{ start: 0x0, end: 0xc6, offset: 0x0 }],
    },
  },
  treasures: {
    count: 119,
    length: 0x8,
    shifts: [0x25560, 0xd58, 0xcb0],
    isInventory: false,
    europe: {
      length: 0x8,
      textPointer: 0,
      operations: [{ start: 0x0, end: 0x8, offset: 0x0 }],
    },
  },
  ships: {
    count: 5,
    length: 0x64,
    shifts: [],
    isInventory: false,
    europe: {
      length: 0x54,
      textPointer: 0x10e0,
      operations: [{ start: 0x4, end: 0x54, offset: 0x14 }],
    },
  },
  enemyShips: {
    count: 45,
    length: 0x78,
    shifts: [],
    isInventory: false,
    europe: {
      length: 0x68,
      textPointer: 0x1110,
      operations: [{ start: 0x4, end: 0x68, offset: 0x14 }],
    },
  },
  shipWeapons: {
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
  shipAccessories: {
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
  shipItems: {
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
  crew: {
    count: 22,
    length: 0x24,
    shifts: [-0x10c78, 0x1323c, 0x13264],
    isInventory: false,
    europe: {
      length: 0x18,
      textPointer: 0x11d0,
      operations: [
        { start: 0x4, end: 0x5, offset: 0x11 },
        { start: 0x6, end: 0x18, offset: 0x12 },
      ],
    },
  },
  shops: {
    count: 43,
    length: 0x68,
    shifts: [],
    isInventory: false,
    europe: {
      length: 0x68,
      textPointer: 0x0,
      operations: [{ start: 0x0, end: 0x68, offset: 0x0 }],
    },
  },
};
