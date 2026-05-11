import type { Resource, ResourceGroups } from "$lib/types";

export const worlds = [
  { index: 0x0, name: "World Map" },
  { index: 0x1, name: "Lake Orangatanga" },
  { index: 0x2, name: "Kremwood Forest" },
  { index: 0x3, name: "Cotton-Top Cove" },
  { index: 0x4, name: "Mekanos" },
  { index: 0x5, name: "K3" },
  { index: 0x6, name: "Razor Ridge" },
  { index: 0x7, name: "Kaos Kore" },
  { index: 0x8, name: "Krematoa" },
];

export interface Level {
  index: number;
  name: string;
  world: number;
  location: number;
  type: "bananaBirdCave" | "boss" | "level" | "hidden" | "world";
  bonusCoins?: number;
  dkCoin?: boolean;
  linkedLevels?: number[];
}

// prettier-ignore
export const levels: Level[] = [
  { index: 0x4d, name: "Wrinkly's Save Cave"   , world: 0x0, location: 0x01, type: "hidden" },
  { index: 0x03, name: "Bazaar's General Store", world: 0x0, location: 0x03, type: "hidden" },
  { index: 0x01, name: "Funky's Rentals"       , world: 0x0, location: 0x02, type: "hidden" },
  { index: 0x04, name: "Blunder's Booth"       , world: 0x0, location: 0x06, type: "hidden" },
  { index: 0x05, name: "Bramble's Bungalow"    , world: 0x0, location: 0x09, type: "hidden" },
  { index: 0x06, name: "Barter's Swap Shop"    , world: 0x0, location: 0x0b, type: "hidden" },
  { index: 0x14, name: "Bounty Beach"          , world: 0x0, location: 0x14, type: "bananaBirdCave" },
  { index: 0x13, name: "Kong Cave"             , world: 0x0, location: 0x10, type: "bananaBirdCave" },
  { index: 0x12, name: "Undercover Cove"       , world: 0x0, location: 0x11, type: "bananaBirdCave" },
  { index: 0x10, name: "K's Kache"             , world: 0x0, location: 0x12, type: "bananaBirdCave" },
  { index: 0x11, name: "Hill-Top Hoard"        , world: 0x0, location: 0x13, type: "bananaBirdCave" },
  { index: 0x15, name: "Belcha's Burrow"       , world: 0x0, location: 0x0f, type: "bananaBirdCave" },
  { index: 0x00, name: "Waterfall (cheat)"     , world: 0x0, location: 0x15, type: "hidden" },
  { index: 0x25, name: "Lakeside Limbo"        , world: 0x1, location: 0x01, type: "level", bonusCoins: 2, dkCoin: true, linkedLevels: [0x28] },
  { index: 0x28, name: "Doorstop Dash"         , world: 0x1, location: 0x02, type: "level", bonusCoins: 2, dkCoin: true, linkedLevels: [0x4e, 0x27] },
  { index: 0x4e, name: "Wrinkly's Save Cave"   , world: 0x1, location: 0x03, type: "hidden" },
  { index: 0x07, name: "Barnacle's Island"     , world: 0x1, location: 0x09, type: "hidden" },
  { index: 0x27, name: "Tidal Trouble"         , world: 0x1, location: 0x04, type: "level", bonusCoins: 2, dkCoin: true, linkedLevels: [0x2b] },
  { index: 0x2b, name: "Skidda's Row"          , world: 0x1, location: 0x05, type: "level", bonusCoins: 2, dkCoin: true, linkedLevels: [0x2a] },
  { index: 0x2a, name: "Murky Mill"            , world: 0x1, location: 0x06, type: "level", bonusCoins: 2, dkCoin: true, linkedLevels: [0x1d, 0x56] },
  { index: 0x56, name: "Swanky's Sideshow"     , world: 0x1, location: 0x07, type: "hidden" },
  { index: 0x16, name: "Smuggler's Cove"       , world: 0x1, location: 0x0a, type: "bananaBirdCave" },
  { index: 0x1d, name: "Belcha's Barn"         , world: 0x1, location: 0x08, type: "boss" , bonusCoins: 1              , linkedLevels: [0x5e] },
  { index: 0x5d, name: "Lake Orangatanga"      , world: 0x1, location: 0x04, type: "world" },
  { index: 0x30, name: "Barrel Shield Bust-Up" , world: 0x2, location: 0x01, type: "level", bonusCoins: 2, dkCoin: true, linkedLevels: [0x4f, 0x32] },
  { index: 0x4f, name: "Wrinkly's Save Cave"   , world: 0x2, location: 0x02, type: "hidden" },
  { index: 0x32, name: "Riverside Race"        , world: 0x2, location: 0x03, type: "level", bonusCoins: 2, dkCoin: true, linkedLevels: [0x29] },
  { index: 0x29, name: "Squeals On Wheels"     , world: 0x2, location: 0x04, type: "level", bonusCoins: 2, dkCoin: true, linkedLevels: [0x2f, 0x57] },
  { index: 0x57, name: "Swanky's Sideshow"     , world: 0x2, location: 0x05, type: "hidden" },
  { index: 0x2f, name: "Springin' Spiders"     , world: 0x2, location: 0x06, type: "level", bonusCoins: 2, dkCoin: true, linkedLevels: [0x08, 0x34] },
  { index: 0x08, name: "Brash's Cabin"         , world: 0x2, location: 0x07, type: "hidden" },
  { index: 0x34, name: "Bobbing Barrel Brawl"  , world: 0x2, location: 0x08, type: "level", bonusCoins: 2, dkCoin: true, linkedLevels: [0x17, 0x1e] },
  { index: 0x17, name: "Arich's Hoard"         , world: 0x2, location: 0x09, type: "bananaBirdCave" },
  { index: 0x1e, name: "Arich's Ambush"        , world: 0x2, location: 0x0a, type: "boss"                              , linkedLevels: [0x04, 0x5f, 0x60] },
  { index: 0x5e, name: "Kremwood Forest"       , world: 0x2, location: 0x05, type: "world" },
  { index: 0x09, name: "Blue's Beach Hut"      , world: 0x3, location: 0x01, type: "hidden" },
  { index: 0x35, name: "Bazza's Blockade"      , world: 0x3, location: 0x02, type: "level", bonusCoins: 2, dkCoin: true, linkedLevels: [0x35] },
  { index: 0x38, name: "Rocket Barrel Ride"    , world: 0x3, location: 0x03, type: "level", bonusCoins: 2, dkCoin: true, linkedLevels: [0x26, 0x50] },
  { index: 0x50, name: "Wrinkly's Save Cave"   , world: 0x3, location: 0x04, type: "hidden" },
  { index: 0x26, name: "Kreeping Klasps"       , world: 0x3, location: 0x05, type: "level", bonusCoins: 2, dkCoin: true, linkedLevels: [0x39, 0x58] },
  { index: 0x58, name: "Swanky's Sideshow"     , world: 0x3, location: 0x06, type: "hidden" },
  { index: 0x39, name: "Tracker Barrel Trek"   , world: 0x3, location: 0x07, type: "level", bonusCoins: 2, dkCoin: true, linkedLevels: [0x36] },
  { index: 0x36, name: "Fish Food Frenzy"      , world: 0x3, location: 0x08, type: "level", bonusCoins: 2, dkCoin: true, linkedLevels: [0x1f] },
  { index: 0x18, name: "Bounty Bay"            , world: 0x3, location: 0x0a, type: "bananaBirdCave" },
  { index: 0x1f, name: "Squirt's Showdown"     , world: 0x3, location: 0x09, type: "boss"                              , linkedLevels: [] },
  { index: 0x5f, name: "Cotton-Top Cove"       , world: 0x3, location: 0x07, type: "world" },
  { index: 0x3b, name: "Fire-Ball Frenzy"      , world: 0x4, location: 0x01, type: "level", bonusCoins: 2, dkCoin: true, linkedLevels: [0x0a, 0x40] },
  { index: 0x0a, name: "Bazooka's Barracks"    , world: 0x4, location: 0x02, type: "hidden" },
  { index: 0x40, name: "Demolition Drain-Pipe" , world: 0x4, location: 0x03, type: "level", bonusCoins: 2, dkCoin: true, linkedLevels: [0x2e, 0x59] },
  { index: 0x59, name: "Swanky's Sideshow"     , world: 0x4, location: 0x04, type: "hidden" },
  { index: 0x2e, name: "Ripsaw Rage"           , world: 0x4, location: 0x05, type: "level", bonusCoins: 2, dkCoin: true, linkedLevels: [0x3c, 0x51] },
  { index: 0x51, name: "Wrinkly's Save Cave"   , world: 0x4, location: 0x06, type: "hidden" },
  { index: 0x3c, name: "Blazing Bazukas"       , world: 0x4, location: 0x07, type: "level", bonusCoins: 2, dkCoin: true, linkedLevels: [0x3e] },
  { index: 0x3e, name: "Low-G Labyrinth"       , world: 0x4, location: 0x08, type: "level", bonusCoins: 2, dkCoin: true, linkedLevels: [0x20] },
  { index: 0x19, name: "Sky-High Secret"       , world: 0x4, location: 0x0a, type: "bananaBirdCave" },
  { index: 0x20, name: "Kaos Karnage"          , world: 0x4, location: 0x09, type: "boss"                              , linkedLevels: [] },
  { index: 0x60, name: "Mekanos"               , world: 0x4, location: 0x08, type: "world" },
  { index: 0x41, name: "Krevice Kreepers"      , world: 0x5, location: 0x01, type: "level", bonusCoins: 2, dkCoin: true, linkedLevels: [0x2d, 0x52] },
  { index: 0x52, name: "Wrinkly's Save Cave"   , world: 0x5, location: 0x08, type: "hidden" },
  { index: 0x2d, name: "Tearaway Toboggan"     , world: 0x5, location: 0x02, type: "level", bonusCoins: 2, dkCoin: true, linkedLevels: [0x3a] },
  { index: 0x3a, name: "Barrel Drop Bounce"    , world: 0x5, location: 0x03, type: "level", bonusCoins: 2, dkCoin: true, linkedLevels: [0x3d] },
  { index: 0x3d, name: "Krack-Shot Kroc"       , world: 0x5, location: 0x04, type: "level", bonusCoins: 2, dkCoin: true, linkedLevels: [0x2c] },
  { index: 0x2c, name: "Lemguin Lunge"         , world: 0x5, location: 0x05, type: "level", bonusCoins: 2, dkCoin: true, linkedLevels: [0x0b, 0x1a, 0x21, 0x5a] },
  { index: 0x0b, name: "Blizzard's Basecamp"   , world: 0x5, location: 0x09, type: "hidden" },
  { index: 0x5a, name: "Swanky's Sideshow"     , world: 0x5, location: 0x06, type: "hidden" },
  { index: 0x1a, name: "Glacial Grotto"        , world: 0x5, location: 0x0a, type: "bananaBirdCave" },
  { index: 0x21, name: "Bleak's House"         , world: 0x5, location: 0x07, type: "boss" , bonusCoins: 1              , linkedLevels: [0x06, 0x62] },
  { index: 0x61, name: "K3"                    , world: 0x5, location: 0x0a, type: "world" },
  { index: 0x44, name: "Buzzer Barrage"        , world: 0x6, location: 0x02, type: "level", bonusCoins: 2, dkCoin: true, linkedLevels: [0x0c, 0x42, 0x53] },
  { index: 0x0c, name: "Benny's Chairlifts"    , world: 0x6, location: 0x03, type: "hidden" },
  { index: 0x53, name: "Wrinkly's Save Cave"   , world: 0x6, location: 0x01, type: "hidden" },
  { index: 0x42, name: "Kong-Fused Cliffs"     , world: 0x6, location: 0x04, type: "level", bonusCoins: 2, dkCoin: true, linkedLevels: [0x0d, 0x37] },
  { index: 0x0d, name: "Björn's Chairlifts"    , world: 0x6, location: 0x0a, type: "hidden" },
  { index: 0x37, name: "Floodlit Fish"         , world: 0x6, location: 0x05, type: "level", bonusCoins: 2, dkCoin: true, linkedLevels: [0x45] },
  { index: 0x45, name: "Pot Hole Panic"        , world: 0x6, location: 0x06, type: "level", bonusCoins: 2, dkCoin: true, linkedLevels: [0x43, 0x5b] },
  { index: 0x5b, name: "Swanky's Sideshow"     , world: 0x6, location: 0x07, type: "hidden" },
  { index: 0x43, name: "Ropey Rumpus"          , world: 0x6, location: 0x08, type: "level", bonusCoins: 2, dkCoin: true, linkedLevels: [0x22] },
  { index: 0x1b, name: "Clifftop Cache"        , world: 0x6, location: 0x0b, type: "bananaBirdCave" },
  { index: 0x22, name: "Barbos' Barrier"       , world: 0x6, location: 0x09, type: "boss" , bonusCoins: 1              , linkedLevels: [0x63] },
  { index: 0x62, name: "Razor Ridge"           , world: 0x6, location: 0x0c, type: "world" },
  { index: 0x48, name: "Konveyor Rope Klash"   , world: 0x7, location: 0x01, type: "level", bonusCoins: 2, dkCoin: true, linkedLevels: [0x0e, 0x46] },
  { index: 0x0e, name: "Baffle's Code Room"    , world: 0x7, location: 0x02, type: "hidden" },
  { index: 0x46, name: "Creepy Caverns"        , world: 0x7, location: 0x03, type: "level", bonusCoins: 2, dkCoin: true, linkedLevels: [0x33] },
  { index: 0x33, name: "Lightning Look-Out"    , world: 0x7, location: 0x04, type: "level", bonusCoins: 2, dkCoin: true, linkedLevels: [0x47, 0x54] },
  { index: 0x54, name: "Wrinkly's Save Cave"   , world: 0x7, location: 0x05, type: "hidden" },
  { index: 0x47, name: "Koindozer Klamber"     , world: 0x7, location: 0x06, type: "level", bonusCoins: 2, dkCoin: true, linkedLevels: [0x3f, 0x5c] },
  { index: 0x5c, name: "Swanky's Sideshow"     , world: 0x7, location: 0x07, type: "hidden" },
  { index: 0x3f, name: "Poisonous Pipeline"    , world: 0x7, location: 0x08, type: "level", bonusCoins: 2, dkCoin: true, linkedLevels: [0x23] },
  { index: 0x1c, name: "Sewer Stockpile"       , world: 0x7, location: 0x0a, type: "bananaBirdCave" },
  { index: 0x23, name: "Kastle Kaos"           , world: 0x7, location: 0x09, type: "boss" , bonusCoins: 1              , linkedLevels: [] },
  { index: 0x63, name: "Kaos Kore"             , world: 0x7, location: 0x0d, type: "world" },
  { index: 0x0f, name: "Boomer's Bomb Shelter" , world: 0x8, location: 0x01, type: "hidden" },
  { index: 0x55, name: "Wrinkly's Save Cave"   , world: 0x8, location: 0x02, type: "hidden" },
  { index: 0x49, name: "Stampede Sprint"       , world: 0x8, location: 0x03, type: "level", bonusCoins: 3, dkCoin: true, linkedLevels: [0x4a] },
  { index: 0x4a, name: "Criss Kross Cliffs"    , world: 0x8, location: 0x04, type: "level", bonusCoins: 2, dkCoin: true, linkedLevels: [0x4b] },
  { index: 0x4b, name: "Tyrant Twin Tussle"    , world: 0x8, location: 0x05, type: "level", bonusCoins: 3, dkCoin: true, linkedLevels: [0x31] },
  { index: 0x31, name: "Swoopy Salvo"          , world: 0x8, location: 0x06, type: "level", bonusCoins: 3, dkCoin: true, linkedLevels: [0x4c] },
  { index: 0x4c, name: "Rocket Rush"           , world: 0x8, location: 0x07, type: "level"               , dkCoin: true, linkedLevels: [] },
  { index: 0x24, name: "Knautilus"             , world: 0x8, location: 0x08, type: "boss"                , dkCoin: true, linkedLevels: [] },
  { index: 0x64, name: "Krematoa"              , world: 0x8, location: 0x0e, type: "world" },
];

export const locations: Resource = {};
export const locationsGroups: ResourceGroups = [];
export const locationsOrder: number[] = [0x0];

worlds.forEach((world) => {
  locationsGroups.push({ name: world.name, options: [] });
});

levels.forEach((level) => {
  const index = (level.location! << 0x10) | level.world;
  const world = level.type === "world" ? 0x0 : level.world;

  locations[index] = level.name;
  locationsGroups[world].options.push(index);
  locationsOrder.push(index);
});
