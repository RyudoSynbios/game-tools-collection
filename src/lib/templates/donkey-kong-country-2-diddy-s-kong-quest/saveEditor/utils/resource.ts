export const worlds = [
  { index: 0x0, name: "Gangplank Galleon" },
  { index: 0x1, name: "Crocodile Cauldron" },
  { index: 0x2, name: "Krem Quay" },
  { index: 0x3, name: "Krazy Kremland" },
  { index: 0x4, name: "Gloomy Gulch" },
  { index: 0x5, name: "K. Rool's Keep" },
  { index: 0x6, name: "The Flying Krock" },
  { index: 0x7, name: "Lost World" },
];

// prettier-ignore
export const levels: {
  index: number;
  name: string;
  world: number;
  clearedFlag?: number;
  bonusRooms?: number[];
  kremkoin?: number;
  linkedLevels?: number[];
  paths?: number[];
}[] = [
  { index: 0x41, name: "Pirate Panic"                , world: 0x0, clearedFlag: 0x03, bonusRooms: [0x6f, 0x70]      , linkedLevels: [0x42]                  , paths: [0x5] },
  { index: 0x42, name: "Mainbrace Mayhem"            , world: 0x0, clearedFlag: 0x0c, bonusRooms: [0x78, 0x79, 0x7d], linkedLevels: [0x9, 0x43]             , paths: [0x6, 0x7] },
  { index: 0x09, name: "Gangplank Galley"            , world: 0x0, clearedFlag: 0x04, bonusRooms: [0x71, 0xa8]      , linkedLevels: [0xa, 0xb]              , paths: [0x8, 0x9] },
  { index: 0x0b, name: "Lockjaw's Locker"            , world: 0x0, clearedFlag: 0x15, bonusRooms: [0x81]            , linkedLevels: [0xc, 0xf]              , paths: [0xa, 0xb] },
  { index: 0x0c, name: "Topsail Trouble"             , world: 0x0, clearedFlag: 0x0b, bonusRooms: [0x7b, 0x7c]      , linkedLevels: [0xd, 0xe]              , paths: [0xc, 0xd] },
  { index: 0x0e, name: "Krow's Nest"                 , world: 0x0, clearedFlag: 0x09, kremkoin: 0x9                                                         , paths: [0x0] },
  { index: 0x43, name: "Monkey Museum"               , world: 0x0 },
  { index: 0x0a, name: "Kong Kollege"                , world: 0x0 },
  { index: 0x0f, name: "Swanky's Bonus Bonanza"      , world: 0x0 },
  { index: 0x0d, name: "Funky's Flights II"          , world: 0x0 },
  { index: 0x10, name: "Hot-Head Hop"                , world: 0x1, clearedFlag: 0x07, bonusRooms: [0x1c, 0x74, 0x75], linkedLevels: [0x12, 0x11, 0x13]      , paths: [0xe, 0xf, 0x10] },
  { index: 0x13, name: "Kannon's Klaim"              , world: 0x1, clearedFlag: 0x25, bonusRooms: [0xaa, 0xab, 0xad], linkedLevels: [0x14, 0x15]            , paths: [0x11, 0x12] },
  { index: 0x15, name: "Lava Lagoon"                 , world: 0x1, clearedFlag: 0x14, bonusRooms: [0x83]            , linkedLevels: [0x16, 0x17]            , paths: [0x13, 0x17] },
  { index: 0x17, name: "Red-Hot Ride"                , world: 0x1, clearedFlag: 0x08, bonusRooms: [0x76, 0x77]      , linkedLevels: [0x18, 0x19]            , paths: [0x14, 0x15] },
  { index: 0x19, name: "Squawks's Shaft"             , world: 0x1, clearedFlag: 0x24, bonusRooms: [0xa9, 0xac, 0xba], linkedLevels: [0x1a]                  , paths: [0x16] },
  { index: 0x1a, name: "Kleever's Kiln"              , world: 0x1, clearedFlag: 0x21, kremkoin: 0x21                                                        , paths: [0x1] },
  { index: 0x12, name: "Klubba's Kiosk"              , world: 0x1 },
  { index: 0x11, name: "Swanky's Bonus Bonanza"      , world: 0x1 },
  { index: 0x14, name: "Funky's Flights II"          , world: 0x1 },
  { index: 0x16, name: "Kong Kollege"                , world: 0x1 },
  { index: 0x18, name: "Monkey Museum"               , world: 0x1 },
  { index: 0x1b, name: "Barrel Bayou"                , world: 0x2, clearedFlag: 0x28, bonusRooms: [0x89, 0x8a]      , linkedLevels: [0x1c]                  , paths: [0x18] },
  { index: 0x1c, name: "Glimmer's Galleon"           , world: 0x2, clearedFlag: 0x01, bonusRooms: [0x82, 0x84]      , linkedLevels: [0x1d, 0x23, 0x24, 0x25], paths: [0x19, 0x1a, 0x1b, 0x1c, 0x1d] },
  { index: 0x1d, name: "Krockhead Klamber"           , world: 0x2, clearedFlag: 0x29, bonusRooms: [0x8b]            , linkedLevels: [0x1e]                  , paths: [0x1e] },
  { index: 0x1e, name: "Rattle Battle"               , world: 0x2, clearedFlag: 0x05, bonusRooms: [0x72, 0x73, 0x7f], linkedLevels: [0x1f, 0x20]            , paths: [0x1f, 0x22] },
  { index: 0x20, name: "Slime Climb"                 , world: 0x2, clearedFlag: 0x0a, bonusRooms: [0x7a, 0x7e]      , linkedLevels: [0x21, 0x26]            , paths: [0x20, 0x23] },
  { index: 0x21, name: "Bramble Blast"               , world: 0x2, clearedFlag: 0x2d, bonusRooms: [0xa0, 0xa6]      , linkedLevels: [0x22]                  , paths: [0x21] },
  { index: 0x22, name: "Kudgel's Kontest"            , world: 0x2, clearedFlag: 0x63, kremkoin: 0x63                                                        , paths: [0x2] },
  { index: 0x23, name: "Kong Kollege"                , world: 0x2 },
  { index: 0x24, name: "Funky's Flights II"          , world: 0x2 },
  { index: 0x25, name: "Monkey Museum"               , world: 0x2 },
  { index: 0x1f, name: "Klubba's Kiosk"              , world: 0x2 },
  { index: 0x26, name: "Swanky's Bonus Bonanza"      , world: 0x2 },
  { index: 0x50, name: "Hornet Hole"                 , world: 0x3, clearedFlag: 0x11, bonusRooms: [0xae, 0xb0, 0xb3], linkedLevels: [0x49, 0x51]            , paths: [0x3d, 0x3e, 0x42] },
  { index: 0x49, name: "Target Terror"               , world: 0x3, clearedFlag: 0x0e, bonusRooms: [0xa1, 0xc1]      , linkedLevels: [0x4a]                  , paths: [0x43] },
  { index: 0x4a, name: "Bramble Scramble"            , world: 0x3, clearedFlag: 0x2e, bonusRooms: [0xa2]            , linkedLevels: [0x4b, 0x53]            , paths: [0x44, 0x49] },
  { index: 0x4b, name: "Rickety Race"                , world: 0x3, clearedFlag: 0x0f, bonusRooms: [0xc3]            , linkedLevels: [0x45, 0x4c, 0x4d]      , paths: [0x3f, 0x45, 0x46, 0x47] },
  { index: 0x45, name: "Mudhole Marsh"               , world: 0x3, clearedFlag: 0x2c, bonusRooms: [0x8c, 0x8d]      , linkedLevels: [0x46, 0x47]            , paths: [0x40, 0x48] },
  { index: 0x46, name: "Rambi Rumble"                , world: 0x3, clearedFlag: 0x02, bonusRooms: [0xb2, 0xb4]      , linkedLevels: [0x48]                  , paths: [0x41] },
  { index: 0x48, name: "King Zing Sting"             , world: 0x3, clearedFlag: 0x60, kremkoin: 0x60                                                        , paths: [0x3] },
  { index: 0x51, name: "Kong Kollege"                , world: 0x3 },
  { index: 0x53, name: "Funky's Flights II"          , world: 0x3 },
  { index: 0x4c, name: "Monkey Museum"               , world: 0x3 },
  { index: 0x4d, name: "Swanky's Bonus Bonanza"      , world: 0x3 },
  { index: 0x47, name: "Klubba's Kiosk"              , world: 0x3 },
  { index: 0x28, name: "Ghostly Grove"               , world: 0x4, clearedFlag: 0x19, bonusRooms: [0x85, 0x88]      , linkedLevels: [0x29, 0x2a]            , paths: [0x25, 0x26] },
  { index: 0x2a, name: "Haunted Hall"                , world: 0x4, clearedFlag: 0x10, bonusRooms: [0xbd, 0xc0, 0xc2], linkedLevels: [0x2c]                  , paths: [0x27] },
  { index: 0x2c, name: "Gusty Glade"                 , world: 0x4, clearedFlag: 0x18, bonusRooms: [0x86, 0x87]      , linkedLevels: [0x2b, 0x2e]            , paths: [0x28, 0x29] },
  { index: 0x2e, name: "Parrot Chute Panic"          , world: 0x4, clearedFlag: 0x13, bonusRooms: [0xaf, 0xb1]      , linkedLevels: [0x2d, 0x2f, 0x30, 0x31], paths: [0x2a, 0x2b, 0x2c, 0x2e] },
  { index: 0x31, name: "Web Woods"                   , world: 0x4, clearedFlag: 0x17, bonusRooms: [0xa4, 0xbc]      , linkedLevels: [0x32]                  , paths: [0x2f] },
  { index: 0x32, name: "Kreepy Krow"                 , world: 0x4, clearedFlag: 0x0d, kremkoin: 0xd                                                         , paths: [0x4] },
  { index: 0x29, name: "Monkey Museum"               , world: 0x4 },
  { index: 0x2b, name: "Kong Kollege"                , world: 0x4 },
  { index: 0x2d, name: "Swanky's Bonus Bonanza"      , world: 0x4 },
  { index: 0x2f, name: "Klubba's Kiosk"              , world: 0x4 },
  { index: 0x30, name: "Funky's Flights II"          , world: 0x4 },
  { index: 0x34, name: "Arctic Abyss"                , world: 0x5, clearedFlag: 0x6c, bonusRooms: [0x93, 0x95]      , linkedLevels: [0x35, 0x36, 0x38]      , paths: [0x30, 0x31, 0x34] },
  { index: 0x36, name: "Windy Well"                  , world: 0x5, clearedFlag: 0x23, bonusRooms: [0xa3, 0xbb]      , linkedLevels: [0x37, 0x39]            , paths: [0x32, 0x33] },
  { index: 0x39, name: "Castle Crush"                , world: 0x5, clearedFlag: 0x62, bonusRooms: [0xb7, 0xb8]      , linkedLevels: [0x3a]                  , paths: [0x35] },
  { index: 0x3a, name: "Clapper's Cavern"            , world: 0x5, clearedFlag: 0x8f, bonusRooms: [0x91, 0x92]      , linkedLevels: [0x3b]                  , paths: [0x36] },
  { index: 0x3b, name: "Chain Link Chamber"          , world: 0x5, clearedFlag: 0x6d, bonusRooms: [0xb5, 0xb6]      , linkedLevels: [0x3c, 0x3d, 0x3f]      , paths: [0x37, 0x38, 0x3a] },
  { index: 0x3f, name: "Toxic Tower"                 , world: 0x5, clearedFlag: 0x6e, bonusRooms: [0xa5]            , linkedLevels: [0x40]                  , paths: [0x3b] },
  { index: 0x40, name: "Stronghold Showdown"         , world: 0x5, clearedFlag: 0xb9, kremkoin: 0xb9                                                        , paths: [0x3c] },
  { index: 0x35, name: "Monkey Museum"               , world: 0x5 },
  { index: 0x38, name: "Klubba's Kiosk"              , world: 0x5 },
  { index: 0x37, name: "Kong Kollege"                , world: 0x5 },
  { index: 0x3c, name: "Funky's Flights II"          , world: 0x5 },
  { index: 0x3d, name: "Swanky's Bonus Bonanza"      , world: 0x5 },
  { index: 0x5b, name: "Screech's Sprint"            , world: 0x6, clearedFlag: 0x2f, bonusRooms: [0xa7]            , linkedLevels: [0x5c, 0x5d, 0x77]      , paths: [0x52, 0x53, 0x6b] },
  { index: 0x5d, name: "K. Rool Duel"                , world: 0x6, clearedFlag: 0x61, kremkoin: 0x61                                                        , paths: [] },
  { index: 0x5c, name: "Kong Kollege"                , world: 0x6 },
  { index: 0x77, name: "Funky's Flights II"          , world: 0x6 },
  { index: 0x60, name: "Jungle Jinx"                 , world: 0x7, clearedFlag: 0x99, bonusRooms: [0x98] },
  { index: 0x64, name: "Black Ice Battle"            , world: 0x7, clearedFlag: 0x96, bonusRooms: [0x94] },
  { index: 0x68, name: "Klobber Karnage"             , world: 0x7, clearedFlag: 0x80, bonusRooms: [0x97] },
  { index: 0x6c, name: "Fiery Furnace"               , world: 0x7, clearedFlag: 0x16, bonusRooms: [0x9e] },
  { index: 0x70, name: "Animal Antics"               , world: 0x7, clearedFlag: 0x9a, bonusRooms: [0x9d] },
  { index: 0x71, name: "Krocodile Kore"              , world: 0x7, clearedFlag: 0x6b },
  { index: 0x5e, name: "Return to Crocodile Cauldron", world: 0x7 },
  { index: 0x5f, name: "Monkey Museum"               , world: 0x7 },
  { index: 0x61, name: "Krocodile Kore"              , world: 0x7 },
  { index: 0x62, name: "Return to Krem Quay"         , world: 0x7 },
  { index: 0x63, name: "Monkey Museum"               , world: 0x7 },
  { index: 0x65, name: "Krocodile Kore"              , world: 0x7 },
  { index: 0x66, name: "Return to Krazy Kremland"    , world: 0x7 },
  { index: 0x67, name: "Monkey Museum"               , world: 0x7 },
  { index: 0x69, name: "Krocodile Kore"              , world: 0x7 },
  { index: 0x6a, name: "Return to Gloomy Gulch"      , world: 0x7 },
  { index: 0x6b, name: "Monkey Museum"               , world: 0x7 },
  { index: 0x6d, name: "Krocodile Kore"              , world: 0x7 },
  { index: 0x6e, name: "Return to K. Rool's Keep"    , world: 0x7 },
  { index: 0x6f, name: "Monkey Museum"               , world: 0x7 },
];

export const krocodileKoreLevels: number[] = [];
export const lostWorldLevels: number[] = [];

levels.forEach((level) => {
  if (level.world === 0x7 && level.name === "Krocodile Kore") {
    krocodileKoreLevels.push(level.index);
  } else if (level.world === 0x7 && level.clearedFlag) {
    lostWorldLevels.push(level.index);
  }
});
