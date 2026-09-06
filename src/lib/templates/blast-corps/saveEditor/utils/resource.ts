import type { Resource, ResourceGroups } from "$lib/types";

export const levelTypes = [
  { index: 0x0, name: "Easy Levels" },
  { index: 0x1, name: "Medium Levels" },
  { index: 0x2, name: "Hard Levels" },
  { index: 0x3, name: "Training Levels" },
  { index: 0x4, name: "Extra Levels" },
  { index: 0xf, name: "Hidden Levels" },
];

export interface Level {
  index: number;
  flagIndex?: number;
  type: number;
  cp: number;
  order: number;
  name: string;
  vehicles?: number[];
}

// prettier-ignore
export const levelList: Level[] = [
  { index: 0x00, flagIndex: 0x00, type: 0x0, cp: 0, order:  1, name: "Simian Acres" },
  { index: 0x01, flagIndex: 0x01, type: 0x2, cp: 0, order: 14, name: "Angel City" },
  { index: 0x02, flagIndex: 0x02, type: 0x1, cp: 2, order:  6, name: "Outland Farm" },
  { index: 0x03, flagIndex: 0x03, type: 0x0, cp: 2, order:  2, name: "Blackridge Works" },
  { index: 0x04, flagIndex: 0x04, type: 0x2, cp: 0, order: 15, name: "Glory Crossing" },
  { index: 0x05, flagIndex: 0x05, type: 0x1, cp: 1, order:  7, name: "Shuttle Gully" },
  { index: 0x06                 , type: 0x3, cp: 0, order: 26, name: "Salvage Wharf"   , vehicles: [0x4, 0x5, 0xa] },
  { index: 0x07                 , type: 0x3, cp: 0, order: 32, name: "Skyfall"         , vehicles: [0x3] },
  { index: 0x08                 , type: 0x3, cp: 0, order: 33, name: "Twilight Foundry", vehicles: [0x3, 0x4, 0x5, 0x6, 0x8, 0xa, 0xc, 0xd] },
  { index: 0x09, flagIndex: 0x06, type: 0x2, cp: 2, order: 16, name: "Crystal Rift" },
  { index: 0x0a, flagIndex: 0x07, type: 0x0, cp: 2, order:  3, name: "Argent Towers" },
  { index: 0x0b                 , type: 0x3, cp: 0, order: 35, name: "Skerries"        , vehicles: [0x3, 0x4, 0x5, 0x6, 0x8, 0xa, 0xc, 0xd] },
  { index: 0x0c, flagIndex: 0x08, type: 0x2, cp: 0, order: 17, name: "Diamond Sands" },
  { index: 0x0d, flagIndex: 0x09, type: 0x1, cp: 1, order:  8, name: "Ebony Coast" },
  { index: 0x0e, flagIndex: 0x0a, type: 0x2, cp: 1, order: 18, name: "Oyster Harbour" },
  { index: 0x0f, flagIndex: 0x0b, type: 0x0, cp: 2, order:  4, name: "Carrick Point" },
  { index: 0x10, flagIndex: 0x0c, type: 0x0, cp: 2, order:  5, name: "Havoc District" },
  { index: 0x11, flagIndex: 0x0d, type: 0x1, cp: 0, order:  9, name: "Ironstone Mine" },
  { index: 0x12, flagIndex: 0x0e, type: 0x1, cp: 1, order: 10, name: "Beeton Tracks" },
  { index: 0x13                 , type: 0x3, cp: 0, order: 22, name: "J-Bomb"          , vehicles: [0x9] },
  { index: 0x14                 , type: 0x3, cp: 0, order: 27, name: "Jade Plateau"    , vehicles: [0x3, 0x4, 0x5, 0x6, 0x8, 0xa, 0xc, 0xd] },
  { index: 0x15                 , type: 0x3, cp: 0, order: 28, name: "Marine Quarter"  , vehicles: [0x3, 0x4, 0x5, 0x6, 0x8, 0xa, 0xc, 0xd] },
  { index: 0x16                 , type: 0x3, cp: 1, order: 34, name: "Cooter Creek"    , vehicles: [0x3, 0x4, 0x5, 0x6, 0x8, 0xa, 0xc, 0xd] },
  { index: 0x17                 , type: 0x3, cp: 0, order: 52, name: "Gibbon's Gate"   , vehicles: [0x5] },
  { index: 0x18                 , type: 0x3, cp: 0, order: 49, name: "Baboon Catacomb" , vehicles: [0x5] },
  { index: 0x19                 , type: 0x3, cp: 0, order: 30, name: "Sleek Streets"   , vehicles: [0x3, 0x4, 0x5, 0x6, 0x8, 0xa, 0xc, 0xd] },
  { index: 0x1a, flagIndex: 0x0f, type: 0x2, cp: 0, order: 19, name: "Obsidian Mile" },
  { index: 0x1b                 , type: 0x3, cp: 1, order: 36, name: "Corvine Bluff"   , vehicles: [0x3, 0x4, 0x5, 0x6, 0x8, 0xc, 0xd] },
  { index: 0x1c                 , type: 0x3, cp: 0, order: 24, name: "Sideswipe"       , vehicles: [0x1] },
  { index: 0x1d, flagIndex: 0x10, type: 0x1, cp: 2, order: 11, name: "Echo Marches" },
  { index: 0x1e                 , type: 0x3, cp: 0, order: 31, name: "Kipling Plant"   , vehicles: [0xa] },
  { index: 0x1f                 , type: 0x3, cp: 0, order: 50, name: "Falchion Field"  , vehicles: [0x9] },
  { index: 0x20                 , type: 0x3, cp: 0, order: 44, name: "Morgan Hall"     , vehicles: [0x5] },
  { index: 0x21, flagIndex: 0x11, type: 0x1, cp: 1, order: 12, name: "Tempest City" },
  { index: 0x22                 , type: 0x3, cp: 0, order: 29, name: "Orion Plaza"     , vehicles: [0x4] },
  { index: 0x23                 , type: 0x3, cp: 0, order: 48, name: "Glander's Ranch" , vehicles: [0x3, 0x4, 0x5, 0x6, 0x8, 0xc, 0xd] },
  { index: 0x24                 , type: 0x3, cp: 1, order: 41, name: "Dagger Pass"     , vehicles: [0x9] },
  { index: 0x25                 , type: 0x3, cp: 1, order: 38, name: "Geode Square"    , vehicles: [0x9] },
  { index: 0x26                 , type: 0xf, cp: 0, order: 54, name: "Shuttle Island" },
  { index: 0x27                 , type: 0x3, cp: 0, order: 46, name: "Mica Park"       , vehicles: [0xa] },
  { index: 0x28                 , type: 0x4, cp: 0, order: 55, name: "Moon"            , vehicles: [0x5] },
  { index: 0x29                 , type: 0x3, cp: 0, order: 43, name: "Cobalt Quarry"   , vehicles: [0x3, 0x4, 0x5, 0x6, 0x8, 0xa, 0xc, 0xd] },
  { index: 0x2a                 , type: 0x3, cp: 0, order: 47, name: "Moraine Chase"   , vehicles: [0x3, 0x4, 0x5, 0x6, 0x8, 0xc, 0xd] },
  { index: 0x2b                 , type: 0x4, cp: 0, order: 56, name: "Mercury"         , vehicles: [0x3, 0x4, 0x5] },
  { index: 0x2c                 , type: 0x4, cp: 0, order: 57, name: "Venus"           , vehicles: [0x5] },
  { index: 0x2d                 , type: 0x4, cp: 0, order: 58, name: "Mars"            , vehicles: [0x5] },
  { index: 0x2e                 , type: 0x4, cp: 0, order: 59, name: "Neptune"         , vehicles: [0x5] },
  { index: 0x2f                 , type: 0xf, cp: 0, order:  0, name: "Introduction" },
  { index: 0x30                 , type: 0x3, cp: 0, order: 45, name: "Silver Junction" , vehicles: [0x2] },
  { index: 0x31                 , type: 0xf, cp: 0, order: 21, name: "Ending" },
  { index: 0x32, flagIndex: 0x12, type: 0x4, cp: 0, order: 53, name: "Shuttle Clear"   , vehicles: [0x5] },
  { index: 0x33                 , type: 0x3, cp: 0, order: 51, name: "Dark Heartland"  , vehicles: [0xa] },
  { index: 0x34                 , type: 0x3, cp: 1, order: 42, name: "Magma Peak"      , vehicles: [0x9] },
  { index: 0x35                 , type: 0x3, cp: 0, order: 25, name: "Thunderfist"     , vehicles: [0x2] },
  { index: 0x36                 , type: 0x3, cp: 1, order: 40, name: "Saline Watch"    , vehicles: [0x9] },
  { index: 0x37                 , type: 0x3, cp: 0, order: 23, name: "Backlash"        , vehicles: [0x5] },
  { index: 0x38                 , type: 0x3, cp: 0, order: 37, name: "Bison Ridge"     , vehicles: [0x3, 0x4, 0x5, 0x6, 0x8, 0xc, 0xd] },
  { index: 0x39, flagIndex: 0x13, type: 0x2, cp: 0, order: 20, name: "Ember Hamlet" },
  { index: 0x3a, flagIndex: 0x14, type: 0x1, cp: 0, order: 13, name: "Cromlech Court" },
  { index: 0x3b                 , type: 0x3, cp: 1, order: 39, name: "Lizard Island"   , vehicles: [0x9] },
];

export const levels: Resource = {};
export const levelsGroups: ResourceGroups = [];
export const levelsOrder: number[] = [];

levelTypes.forEach((type) => {
  levelsGroups.push({ name: type.name, options: [] });
});

levelList
  .filter((level) => level.type !== 0xf)
  .sort((a, b) => a.order - b.order)
  .forEach((level) => {
    levels[level.index] = level.name;
    levelsGroups[level.type].options.push(level.index);
    levelsOrder.push(level.index);
  });

export const timeVehicles: { [key: number]: string } = {
  0x1: "Sideswipe",
  0x2: "Thunderfist",
  0x3: "Skyfall",
  0x4: "Ramdozer",
  0x5: "Backlash",
  0x6: "Van",
  0x8: "American Car",
  0x9: "J-Bomb",
  0xa: "Ballista",
  0xc: "Racecar",
  0xd: "Police Car",
};
