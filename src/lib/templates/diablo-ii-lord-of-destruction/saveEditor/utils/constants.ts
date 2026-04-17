export const DATA_START_OFFSET = 0x2fd;

export const HERO_STATUS_END = 0x1ff;

// prettier-ignore
export const HERO_STATUS_ATTRIBUTES_LENGTHS = [
  10, // #0 Strength
  10, // #1 Energy
  10, // #2 Dexterity
  10, // #3 Vitality
  10, // #4 Status Points Remaining
  8,  // #5 Skill Choices Remaining
  21, // #6 Life
  21, // #7 Max Life
  21, // #8 Mana
  21, // #9 Max Mana
  21, // #A Stamina
  21, // #B Max Stamina
  7,  // #C Level
  32, // #D Experience
  25, // #E Gold
  25, // #F Gold in Stash
];

// prettier-ignore
export const ITEM_ATTRIBUTES_BASE_LENGTHS = [
  4,  // #00 Unknown
  1,  // #01 Is identified
  6,  // #02 Unknown
  1,  // #03 Is socketed
  1,  // #04 Unknown
  1,  // #05 Picked up during last save
  2,  // #06 Unknown
  1,  // #07 Is player ear
  1,  // #08 Start item
  3,  // #09 Unknown
  1,  // #0A Simple item
  1,  // #0B Is ethereal
  1,  // #0C Unknown
  1,  // #0D Has been personalized
  1,  // #0E Unknown
  1,  // #0F Unknown
  5,  // #10 Unknown
  10, // #11 Unknown
  3,  // #12 Location
  4,  // #13 Equipped location
  4,  // #14 Matrix column
  4,  // #16 Matrix row
  3,  // #17 Stored Location
  32, // #18 Type
  3,  // #19 Number of gems attached
];

// prettier-ignore
export const ITEM_ATTRIBUTES_EXTENDED_LENGTHS = [
  32, // #00 ID
  7,  // #01 Item level
  4,  // #02 Quality
];

export const ITEM_LENGTH =
  ITEM_ATTRIBUTES_BASE_LENGTHS.length + ITEM_ATTRIBUTES_EXTENDED_LENGTHS.length;
