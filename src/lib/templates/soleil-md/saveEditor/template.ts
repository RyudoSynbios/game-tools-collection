import type { GameJson } from "$lib/types";

const template: GameJson = {
  validator: {
    regions: {
      europe_usa: {
        $or: [
          { 0x2: [0x52, 0x41, 0x47, 0x4e] }, // "RAGN"
          { 0x802: [0x52, 0x41, 0x47, 0x4e] }, // "RAGN"
          { 0x1002: [0x52, 0x41, 0x47, 0x4e] }, // "RAGN"
          { 0x1802: [0x52, 0x41, 0x47, 0x4e] }, // "RAGN"
        ],
      },
      japan: {
        $or: [
          { 0x2: [0x52, 0x41, 0x47, 0x4e] }, // "RAGN"
          { 0x802: [0x52, 0x41, 0x47, 0x4e] }, // "RAGN"
          { 0x1002: [0x52, 0x41, 0x47, 0x4e] }, // "RAGN"
          { 0x1802: [0x52, 0x41, 0x47, 0x4e] }, // "RAGN"
        ],
      },
      france: {
        $or: [
          { 0x2: [0x52, 0x41, 0x47, 0x4e] }, // "RAGN"
          { 0x802: [0x52, 0x41, 0x47, 0x4e] }, // "RAGN"
          { 0x1002: [0x52, 0x41, 0x47, 0x4e] }, // "RAGN"
          { 0x1802: [0x52, 0x41, 0x47, 0x4e] }, // "RAGN"
        ],
      },
      germany: {
        $or: [
          { 0x2: [0x52, 0x41, 0x47, 0x4e] }, // "RAGN"
          { 0x802: [0x52, 0x41, 0x47, 0x4e] }, // "RAGN"
          { 0x1002: [0x52, 0x41, 0x47, 0x4e] }, // "RAGN"
          { 0x1802: [0x52, 0x41, 0x47, 0x4e] }, // "RAGN"
        ],
      },
      spain: {
        $or: [
          { 0x2: [0x52, 0x41, 0x47, 0x4e] }, // "RAGN"
          { 0x802: [0x52, 0x41, 0x47, 0x4e] }, // "RAGN"
          { 0x1002: [0x52, 0x41, 0x47, 0x4e] }, // "RAGN"
          { 0x1802: [0x52, 0x41, 0x47, 0x4e] }, // "RAGN"
        ],
      },
      korea: {
        $or: [
          { 0x2: [0x52, 0x41, 0x47, 0x4e] }, // "RAGN"
          { 0x802: [0x52, 0x41, 0x47, 0x4e] }, // "RAGN"
          { 0x1002: [0x52, 0x41, 0x47, 0x4e] }, // "RAGN"
          { 0x1802: [0x52, 0x41, 0x47, 0x4e] }, // "RAGN"
        ],
      },
    },
    text: "Drag 'n' drop here or click to add a save file.",
    error: "Not a valid save file.",
  },
  items: [
    {
      length: 0x800,
      type: "container",
      instanceType: "tabs",
      instances: 4,
      enumeration: "Slot %d",
      disableSubinstanceIf: {
        $or: [
          {
            offset: 0x2,
            type: "variable",
            dataType: "uint8",
            value: 0x0,
          },
          {
            offset: 0x2,
            type: "variable",
            dataType: "uint8",
            value: 0xff,
          },
        ],
      },
      items: [
        {
          name: "Checksum",
          offset: 0xaa,
          type: "checksum",
          dataType: "uint16",
          bigEndian: true,
          control: {
            offsetStart: 0x0,
            offsetEnd: 0xaa,
          },
        },
        {
          type: "tabs",
          items: [
            {
              name: "General",
              items: [
                {
                  type: "section",
                  flex: true,
                  items: [
                    {
                      id: "name",
                      name: "Name",
                      offset: 0x4a,
                      length: 0xa,
                      type: "variable",
                      dataType: "string",
                      letterDataType: "uint8",
                      fallback: 0xff,
                      resource: "letters",
                      test: true,
                    },
                    {
                      id: "location",
                      name: "Location",
                      offset: 0x76,
                      type: "variable",
                      dataType: "uint16",
                      bigEndian: true,
                      resource: "locations",
                      size: "lg",
                      autocomplete: true,
                    },
                    {
                      name: "Location Spawn",
                      offset: 0x78,
                      type: "variable",
                      dataType: "uint16",
                      bigEndian: true,
                    },
                    {
                      name: "Location (Save Preview)",
                      offset: 0x7a,
                      type: "variable",
                      dataType: "uint16",
                      bigEndian: true,
                      resource: "locationSavePreview",
                      hidden: true,
                    },
                  ],
                },
                {
                  type: "section",
                  flex: true,
                  items: [
                    {
                      name: "Health",
                      type: "group",
                      mode: "fraction",
                      items: [
                        {
                          id: "health",
                          offset: 0x60,
                          type: "variable",
                          dataType: "uint16",
                          bigEndian: true,
                          max: 32,
                        },
                        {
                          id: "healthMax",
                          offset: 0x62,
                          type: "variable",
                          dataType: "uint16",
                          bigEndian: true,
                          max: 32,
                        },
                      ],
                    },
                    {
                      name: "Malins",
                      offset: 0x66,
                      type: "variable",
                      dataType: "uint16",
                      bigEndian: true,
                      max: 9999,
                    },
                  ],
                },
                {
                  type: "section",
                  flex: true,
                  items: [
                    {
                      id: "equippedAnimal-a-%index%",
                      name: "Equipped Animal A",
                      offset: 0x72,
                      type: "variable",
                      dataType: "uint16",
                      bigEndian: true,
                      resource: "animals",
                      autocomplete: true,
                    },
                    {
                      id: "equippedAnimal-b-%index%",
                      name: "Equipped Animal B",
                      offset: 0x74,
                      type: "variable",
                      dataType: "uint16",
                      bigEndian: true,
                      resource: "animals",
                      autocomplete: true,
                    },
                  ],
                },
                {
                  type: "section",
                  flex: true,
                  items: [
                    {
                      name: "Abilities",
                      type: "bitflags",
                      flags: [
                        { offset: 0xc, bit: 3, label: "Throw sword learned" },
                        { offset: 0xd, bit: 0, label: "Talk to animals learned" },
                        { offset: 0xe, bit: 3, label: "Jump learned" },
                        { offset: 0xf, bit: 1, label: "Lift objects learned" },
                        { offset: 0x19, bit: 5, label: "Talk to humans learned" },
                      ],
                    },
                    {
                      id: "animals-%index%",
                      name: "Animals",
                      type: "bitflags",
                      flags: [
                        { offset: 0x6d, bit: 0, label: "Save", hidden: true },
                        { offset: 0x6d, bit: 1, label: "Take Off A", hidden: true },
                        { offset: 0x6d, bit: 2, label: "Take Off B", hidden: true },
                        { offset: 0x6d, bit: 3, label: "Debug Hand", hidden: true },
                        { offset: 0x6d, bit: 4, label: "Debug Eye", hidden: true, separator: true },
                        { offset: 0x6d, bit: 5, label: "Kitty" },
                        { offset: 0x6d, bit: 6, label: "Johnny" },
                        { offset: 0x6d, bit: 7, label: "Moa" },
                        { offset: 0x6c, bit: 0, label: "Lion" },
                        { offset: 0x6c, bit: 1, label: "Penguy", separator: true },
                        { offset: 0x6c, bit: 2, label: "Charlie" },
                        { offset: 0x6c, bit: 3, label: "Dinosaur" },
                        { offset: 0x6c, bit: 4, label: "Dodo" },
                        { offset: 0x6c, bit: 5, label: "Leviathan" },
                        { offset: 0x6c, bit: 6, label: "RaccoonDog", separator: true },
                        { offset: 0x6c, bit: 7, label: "Ciel" },
                        { offset: 0x6b, bit: 0, label: "Caterpillar" },
                        { offset: 0x6b, bit: 1, label: "Armadillo" },
                        { offset: 0x6b, bit: 2, label: "Bat" },
                        { offset: 0x6b, bit: 3, label: "Egg", separator: true },
                        { offset: 0x6b, bit: 4, label: "???", hidden: true },
                        { offset: 0x6b, bit: 5, label: "???", hidden: true },
                        { offset: 0x6b, bit: 6, label: "???", hidden: true },
                        { offset: 0x6b, bit: 7, label: "???", hidden: true },
                        { offset: 0x18, bit: 3, label: "Monarchy" },
                      ],
                    },
                    {
                      name: "Available Animals",
                      type: "bitflags",
                      hidden: true,
                      flags: [
                        { offset: 0x71, bit: 0, label: "Save", hidden: true },
                        { offset: 0x71, bit: 1, label: "Take Off A", hidden: true },
                        { offset: 0x71, bit: 2, label: "Take Off B", hidden: true },
                        { offset: 0x71, bit: 3, label: "Debug Hand", hidden: true },
                        { offset: 0x71, bit: 4, label: "Debug Eye", hidden: true, separator: true },
                        { offset: 0x71, bit: 5, label: "Kitty" },
                        { offset: 0x71, bit: 6, label: "Johnny" },
                        { offset: 0x71, bit: 7, label: "Moa" },
                        { offset: 0x70, bit: 0, label: "Lion" },
                        { offset: 0x70, bit: 1, label: "Penguy", separator: true },
                        { offset: 0x70, bit: 2, label: "Charlie" },
                        { offset: 0x70, bit: 3, label: "Dinosaur" },
                        { offset: 0x70, bit: 4, label: "Dodo" },
                        { offset: 0x70, bit: 5, label: "Leviathan" },
                        { offset: 0x70, bit: 6, label: "RaccoonDog", separator: true },
                        { offset: 0x70, bit: 7, label: "Ciel" },
                        { offset: 0x6f, bit: 0, label: "Caterpillar" },
                        { offset: 0x6f, bit: 1, label: "Armadillo" },
                        { offset: 0x6f, bit: 2, label: "Bat" },
                        { offset: 0x6f, bit: 3, label: "Egg" },
                        { offset: 0x6f, bit: 4, label: "???", hidden: true },
                        { offset: 0x6f, bit: 5, label: "???", hidden: true },
                        { offset: 0x6f, bit: 6, label: "???", hidden: true },
                        { offset: 0x6f, bit: 7, label: "???", hidden: true },
                      ],
                    },
                    {
                      id: "items",
                      name: "Items",
                      type: "bitflags",
                      flags: [
                        { offset: 0x7e, bit: 0, label: "Bronze Medal" },
                        { offset: 0x7e, bit: 1, label: "Silver Medal" },
                        { offset: 0x7e, bit: 2, label: "Gold Medal" },
                        { offset: 0x7e, bit: 3, label: "Holy Sword" },
                        { offset: 0x7e, bit: 4, label: "Giant Plant Seed" },
                        { offset: 0x7e, bit: 5, label: "Magic Shoes" },
                        { offset: 0x7e, bit: 6, label: "Awakening Powder" },
                        { offset: 0x7e, bit: 7, label: "Mother Monster Horn" },
                      ],
                    },
                  ],
                },
              ],
            },
            {
              name: "Golden Apples",
              items: [
                {
                  type: "bitflags",
                  flags: [
                    { offset: 0x37, bit: 5, label: "Soleil Town" },
                    { offset: 0x37, bit: 6, label: "Soleil Town Castle" },
                    { offset: 0x37, bit: 7, label: "Soleil Town Plaza" },
                    { offset: 0x36, bit: 5, label: "Soleil Town Plaza (bought from Mermaid)" },
                    { offset: 0x38, bit: 6, label: "Rafflesia School" },
                    { offset: 0x38, bit: 1, label: "Anemone Beach" },
                    { offset: 0x38, bit: 2, label: "Anemone Beach Cave" },
                    { offset: 0x38, bit: 3, label: "Hot Daisy" },
                    { offset: 0x38, bit: 4, label: "Iris" },
                    { offset: 0x11, bit: 4, label: "Iris Animal Village (given by a squirrel)" },
                    { offset: 0x38, bit: 5, label: "Camellia Desert" },
                    { offset: 0x38, bit: 7, label: "Root Temple" },
                    { offset: 0x18, bit: 7, label: "Saint Heaven (given by the green haired angel)" },
                    { offset: 0x39, bit: 1, label: "Black Night" },
                  ],
                },
              ],
            },
            {
              name: "Events",
              planned: true,
              items: [
                {
                  type: "bitflags",
                  flags: [
                    { offset: 0xc, bit: 0, label: "Soleil Town Castle: Permission to enter the Rafflesia School granted" },
                    { offset: 0xc, bit: 4, label: "Dahlia Valley: Wolf defeated" },
                    { offset: 0xc, bit: 5, label: "Dahlia Valley: Wolf defeated related", hidden: true },
                    { offset: 0xc, bit: 6, label: "Rafflesia School: Bronze Medal obtained" },
                    { offset: 0xd, bit: 1, label: "Soleil Town: After talking to everyone in hero's house" },
                    { offset: 0xd, bit: 2, label: "Soleil Town Castle: Amon exit castle" },
                    { offset: 0xd, bit: 3, label: "Rafflesia School: Guard who blocks enter moved" },
                    { offset: 0xd, bit: 5, label: "Soleil Town: Johnny joined the team" },
                    { offset: 0xd, bit: 6, label: "Dahlia Valley: First talk with Hare" },
                    { offset: 0xd, bit: 7, label: "Dahlia Valley: Talk with Hare related", hidden: true },
                    { offset: 0xe, bit: 2, label: "Dahlia Valley: Talk with Hare related", hidden: true },
                    { offset: 0xe, bit: 7, label: "Anemone Beach Village: Talk with Daddyphant related", hidden: true },
                    { offset: 0xf, bit: 2, label: "Anemone Beach Dungeon: Octopus defeated related", hidden: true },
                    { offset: 0xf, bit: 3, label: "Anemone Beach Dungeon: Octopus defeated related", hidden: true },
                    { offset: 0xf, bit: 4, label: "Anemone Beach Dungeon: Octopus defeated related", hidden: true },
                    { offset: 0x10, bit: 1, label: "Burn Daisy: Shuffler defeated" },
                    { offset: 0x11, bit: 5, label: "Iris Animal Village: Floor of squirrels' house fixed" },
                    { offset: 0x16, bit: 1, label: "Worldmap: Path to Castle Freesia unlocked" },
                    { offset: 0x17, bit: 0, label: "Castle Freesia: Giant Plant Seed obtained" },
                    { offset: 0x18, bit: 0, label: "Worldmap: Path to Root Temple unlocked" },
                    { offset: 0x1b, bit: 3, label: "Rafflesia School: Silver Medal obtained" },
                    { offset: 0x1b, bit: 4, label: "Rafflesia School: Gold Medal obtained" },
                    { offset: 0x1b, bit: 7, label: "Soleil Town Castle: Holy Sword obtained" },
                    { offset: 0x1f, bit: 7, label: "Iris Village (past): Magic Shoes obtained" },
                    { offset: 0x21, bit: 1, label: "Camellia Temple: Awakening Powder obtained" },
                    { offset: 0x2b, bit: 5, label: "Dahlia Valley (past): Mother Monster Horn obtained" },
                    { offset: 0x31, bit: 7, label: "Soleil Town: Hero's mother bought a new house" },
                    { offset: 0x32, bit: 6, label: "Soleil Town: Lend 10 Malins to hero's mother" },
                    { offset: 0x33, bit: 4, label: "Soleil Town Castle: Charlie event related" },
                    { offset: 0x33, bit: 5, label: "Soleil Town Castle: Golden Apple appeared after Charlie event" },
                    { offset: 0x42, bit: 2, label: "Worldmap: Path to Burn Daisy unlocked" },
                    { offset: 0x42, bit: 3, label: "Worldmap: Path to Camelia Desert West unlocked" },
                    { offset: 0x42, bit: 4, label: "Worldmap: Path to Tower of Babel unlocked" },
                    { offset: 0x42, bit: 6, label: "Worldmap: Path to Iris unlocked" },
                    { offset: 0x42, bit: 7, label: "Worldmap: Path to Camelia Desert unlocked" },
                    { offset: 0x43, bit: 0, label: "Worldmap: Path to Anemone Beach and Hot Daisy unlocked" },
                    { offset: 0x8a, bit: 1, label: "Anemone Beach Dungeon: Money Bag obtained" },
                    { offset: 0x8a, bit: 2, label: "Anemone Beach Dungeon: Money Bag obtained" },
                    { offset: 0x8a, bit: 3, label: "Hot Daisy: Money Bag obtained" },
                    { offset: 0x8a, bit: 6, label: "Anemone Beach: Money Bag obtained" },
                    { offset: 0x8b, bit: 7, label: "Iris: Money Bag obtained" },
                    { offset: 0x8c, bit: 0, label: "Iris: Money Bag obtained" },
                  ],
                },
              ],
            },
          ],
        },
      ],
    },
  ],
  resources: {
    animals: {
      0x0: "-",
      0x6: "Johnny",
      0x7: "Moa",
      0x8: "Lion",
      0x9: "Penguy",
      0xa: "Charlie",
      0xb: "Dinosaur",
      0xc: "Dodo",
      0xd: "Leviathan",
      0xe: "RaccoonDog",
      0xf: "Ciel",
      0x10: "Caterpillar",
      0x11: "Armadillo",
      0x12: "Bat",
      0x13: "Egg",
    },
    letters: [...Array(7).keys()].map((index) => {
      if (index === 1 || index === 5) {
        // Korea
        return {
          0x0: " ",
          0x8: "?",
          0x9: "!",
          0xf: "●",
          0x10: "○",
          0x11: "/",
          0x14: "0",
          0x15: "1",
          0x16: "2",
          0x17: "3",
          0x18: "4",
          0x19: "5",
          0x1a: "6",
          0x1b: "7",
          0x1c: "8",
          0x1d: "9",
          0x1e: "A",
          0x1f: "B",
          0x20: "C",
          0x21: "D",
          0x22: "E",
          0x23: "F",
          0x24: "G",
          0x25: "H",
          0x26: "I",
          0x27: "J",
          0x28: "K",
          0x29: "L",
          0x2a: "M",
          0x2b: "N",
          0x2c: "O",
          0x2d: "P",
          0x2e: "Q",
          0x2f: "R",
          0x30: "S",
          0x31: "T",
          0x32: "U",
          0x33: "V",
          0x34: "W",
          0x35: "X",
          0x36: "Y",
          0x37: "Z",
          0x38: "a",
          0x39: "b",
          0x3a: "c",
          0x3b: "d",
          0x3c: "e",
          0x3d: "f",
          0x3e: "g",
          0x3f: "h",
          0x40: "i",
          0x41: "j",
          0x42: "k",
          0x43: "l",
          0x44: "m",
          0x45: "n",
          0x46: "o",
          0x47: "p",
          0x48: "q",
          0x49: "r",
          0x4a: "s",
          0x4b: "t",
          0x4c: "u",
          0x4d: "v",
          0x4e: "w",
          0x4f: "x",
          0x50: "y",
          0x51: "z",
          // Japan
          ...(index === 1 && {
            0xe: "ー",
            0x52: "ぁ",
            0x53: "あ",
            0x54: "ぃ",
            0x55: "い",
            0x56: "ぅ",
            0x57: "う",
            0x58: "ぇ",
            0x59: "え",
            0x5a: "ぉ",
            0x5b: "お",
            0x5c: "か",
            0x5d: "が",
            0x5e: "き",
            0x5f: "ぎ",
            0x60: "く",
            0x61: "ぐ",
            0x62: "け",
            0x63: "げ",
            0x64: "こ",
            0x65: "ご",
            0x66: "さ",
            0x67: "ざ",
            0x68: "し",
            0x69: "じ",
            0x6a: "す",
            0x6b: "ず",
            0x6c: "せ",
            0x6d: "ぜ",
            0x6e: "そ",
            0x6f: "ぞ",
            0x70: "た",
            0x71: "だ",
            0x72: "ち",
            0x73: "ぢ",
            0x74: "つ",
            0x75: "づ",
            0x76: "て",
            0x77: "で",
            0x78: "と",
            0x79: "ど",
            0x7a: "な",
            0x7b: "に",
            0x7c: "ぬ",
            0x7d: "ね",
            0x7e: "の",
            0x7f: "は",
            0x80: "ば",
            0x81: "ぱ",
            0x82: "ひ",
            0x83: "び",
            0x84: "ぴ",
            0x85: "ふ",
            0x86: "ぶ",
            0x87: "ぷ",
            0x88: "へ",
            0x89: "べ",
            0x8a: "ぺ",
            0x8b: "ほ",
            0x8c: "ぼ",
            0x8d: "ぽ",
            0x8e: "ま",
            0x8f: "み",
            0x90: "む",
            0x91: "め",
            0x92: "も",
            0x93: "ゃ",
            0x94: "や",
            0x95: "ゅ",
            0x96: "ゆ",
            0x97: "ょ",
            0x98: "よ",
            0x99: "ら",
            0x9a: "り",
            0x9b: "る",
            0x9c: "れ",
            0x9d: "ろ",
            0x9e: "わ",
            0x9f: "を",
            0xa0: "ん",
            0xa1: "ァ",
            0xa2: "ア",
            0xa3: "ィ",
            0xa4: "イ",
            0xa5: "ゥ",
            0xa6: "ウ",
            0xa7: "ェ",
            0xa8: "エ",
            0xa9: "ォ",
            0xaa: "オ",
            0xab: "カ",
            0xac: "ガ",
            0xad: "キ",
            0xae: "ギ",
            0xaf: "ク",
            0xb0: "グ",
            0xb1: "ケ",
            0xb2: "ゲ",
            0xb3: "コ",
            0xb4: "ゴ",
            0xb5: "サ",
            0xb6: "ザ",
            0xb7: "シ",
            0xb8: "ジ",
            0xb9: "ス",
            0xba: "ズ",
            0xbb: "セ",
            0xbc: "ゼ",
            0xbd: "ソ",
            0xbe: "ゾ",
            0xbf: "タ",
            0xc0: "ダ",
            0xc1: "チ",
            0xc2: "ヂ",
            0xc3: "ツ",
            0xc4: "ヅ",
            0xc5: "テ",
            0xc6: "デ",
            0xc7: "ト",
            0xc8: "ド",
            0xc9: "ナ",
            0xca: "ニ",
            0xcb: "ヌ",
            0xcc: "ネ",
            0xcd: "ノ",
            0xce: "ハ",
            0xcf: "バ",
            0xd0: "パ",
            0xd1: "ヒ",
            0xd2: "ビ",
            0xd3: "ピ",
            0xd4: "フ",
            0xd5: "ブ",
            0xd6: "プ",
            0xd7: "ヘ",
            0xd8: "ベ",
            0xd9: "ペ",
            0xda: "ホ",
            0xdb: "ボ",
            0xdc: "ポ",
            0xdd: "マ",
            0xde: "ミ",
            0xdf: "ム",
            0xe0: "メ",
            0xe1: "モ",
            0xe2: "ャ",
            0xe3: "ヤ",
            0xe4: "ュ",
            0xe5: "ユ",
            0xe6: "ョ",
            0xe7: "ヨ",
            0xe8: "ラ",
            0xe9: "リ",
            0xea: "ル",
            0xeb: "レ",
            0xec: "ロ",
            0xed: "ワ",
            0xee: "ヲ",
            0xef: "ン",
            0xf2: "♂",
            0xf3: "♀",
            0xfd: "っ",
            0xfe: "ッ",
          }),
        } as { [key: number]: string | number };
      }

      return {
        0x0: " ",
        0x1: "0",
        0x2: "1",
        0x3: "2",
        0x4: "3",
        0x5: "4",
        0x6: "5",
        0x7: "6",
        0x8: "7",
        0x9: "8",
        0xa: "9",
        0xb: "A",
        0xc: "B",
        0xd: "C",
        0xe: "D",
        0xf: "E",
        0x10: "F",
        0x11: "G",
        0x12: "H",
        0x13: "I",
        0x14: "J",
        0x15: "K",
        0x16: "L",
        0x17: "M",
        0x18: "N",
        0x19: "O",
        0x1a: "P",
        0x1b: "Q",
        0x1c: "R",
        0x1d: "S",
        0x1e: "T",
        0x1f: "U",
        0x20: "V",
        0x21: "W",
        0x22: "X",
        0x23: "Y",
        0x24: "Z",
        0x25: "a",
        0x26: "b",
        0x27: "c",
        0x28: "d",
        0x29: "e",
        0x2a: "f",
        0x2b: "g",
        0x2c: "h",
        0x2d: "i",
        0x2e: "j",
        0x2f: "k",
        0x30: "l",
        0x31: "m",
        0x32: "n",
        0x33: "o",
        0x34: "p",
        0x35: "q",
        0x36: "r",
        0x37: "s",
        0x38: "t",
        0x39: "u",
        0x3a: "v",
        0x3b: "w",
        0x3c: "x",
        0x3d: "y",
        0x3e: "z",
        0x3f: ",",
        0x40: ".",
        0x41: '"',
        0x42: "!",
        0x43: "$",
        0x44: ";",
        0x45: "&",
        0x46: "'",
        0x47: "(",
        0x48: ")",
        // France
        ...(index === 2 && {
          0x4e: "à",
          0x4f: "â",
          0x50: "ç",
          0x51: "é",
          0x52: "è",
          0x53: "ê",
          0x54: "ï",
          0x55: "ô",
          0x56: "ù",
          0x57: "û",
          0x58: "ü",
          0x59: "æ",
        }),
        // Germany
        ...(index === 3 && {
          0x4e: "Ä",
          0x4f: "Ö",
          0x50: "Ü",
          0x51: "ä",
          0x52: "ö",
          0x53: "ü",
          0x54: "β",
        }),
        // Spain
        ...(index === 4 && {
          0x4e: "Ñ",
          0x4f: "ñ",
          0x50: "í",
          0x51: "á",
          0x52: "ó",
          0x53: "é",
          0x54: "ú",
          0x55: "¿",
          0x56: "¡",
          0x57: "ü",
        }),
      } as { [key: number]: string | number };
    }),
    locations: {
      // 0x0: "Worldmap", // Unused
      0x1: "Soleil Town",
      // 0x2: "", // Unused
      // 0x3: "", // Unused
      0x4: "Rafflesia School",
      // 0x5: "", // Unused
      0x6: "Soleil Town: Hero's house",
      0x7: "Soleil Town: Church",
      0x8: "Soleil Town: House",
      0x9: "Soleil Town: House",
      0xa: "Soleil Town: House",
      // 0xb: "", // Unused
      // 0xc: "", // Unused
      0xd: "Soleil Town: House",
      // 0xe: "", // Unused
      // 0xf: "", // Unused
      0x10: "Camellia Temple: Chameleon boss fight",
      // 0x11: "", // Unused
      0x12: "Root Temple",
      0x13: "Rafflesia School: Lava area",
      0x14: "Dahlia Valley",
      0x15: "Rafflesia School: Intermediate Course (part 1)",
      0x16: "Rafflesia School: Intermediate Course (part 2)",
      0x17: "Rafflesia School: Expert Course (part 2)",
      0x18: "Iris (part 1)",
      0x19: "Iris Village",
      0x1a: "Anemone Beach",
      0x1b: "Iris Animal Village: Race",
      0x1c: "Anemone Beach Cave",
      0x1d: "Iris Monster Village",
      0x1e: "Iris (part 2)",
      0x1f: "Iris Animal Village",
      0x20: "Iris: Big Hole",
      0x21: "Rafflesia School: Expert Course (part 1)",
      0x22: "Hot Daisy",
      0x23: "Camellia Abandoned Town",
      0x24: "Tower of Babel: Roxie boss fight",
      // 0x25: "", // Unused
      0x26: "Soleil Town Castle",
      0x27: "Saint Heaven: Dragon boss fight",
      0x28: "Camellia Desert (part 1)",
      0x29: "Camellia Animal Village",
      0x2a: "Camellia Desert (part 2)",
      0x2b: "Soleil Town Castle: 1F",
      0x2c: "Soleil Town Castle: Prison",
      0x2d: "Saint Heaven: Sanctuary",
      0x2e: "Dahlia Valley: Wolf boss fight",
      0x2f: "Camellia Temple (part 1)",
      0x30: "Anemone Beach Animal Village",
      // 0x31: "", // Unused?
      0x32: "Soleil Town: Plaza",
      0x33: "Rafflesia School: Sword thrower's house",
      0x34: "Camellia Temple (part 2)",
      0x35: "Anemone Beach Village: Ramsey's hut",
      0x36: "Anemone Beach Village: Foxy's hut",
      0x37: "Anemone Beach Village: Daddyphant's hut",
      0x38: "Anemone Beach Village: Monkey's hut",
      0x39: "Anemone Beach Cave: Octopus boss fight",
      0x3a: "Soleil Town: Fortune-teller's hut",
      0x3b: "Soleil Town: Mermaid's hut",
      0x3c: "Saint Heaven: Entrance",
      0x3d: "Saint Heaven (part 2)",
      0x3e: "Iris Monster Village: Old witch's house",
      0x3f: "Iris Monster Village: Klin's house",
      0x40: "Saint Heaven (part 1)",
      0x41: "Burn Daisy",
      0x42: "Burn Daisy: Puppet Master boss fight",
      0x43: "Castle Freesia (part 1)",
      0x44: "Castle Freesia (part 2)",
      0x45: "Castle Freesia: Entrance",
      0x46: "Tower of Babel",
      0x47: "Tower of Babel: Entrance",
      0x48: "Iris Village: House",
      0x49: "Iris Village: House",
      0x4a: "Iris Animal Village: Ramsey's hut",
      0x4b: "Iris Animal Village: Brownie's house",
      0x4c: "Iris Animal Village: Squirrels' house",
      0x4d: "Iris Monster Village: Slimes' hut",
      // 0x4e: "", // Unused
      // 0x4f: "", // Unused
      0x50: "Camellia Abandoned Town: House",
      0x51: "Camellia Animal Village: Vixen and Aroma's house",
      0x52: "Iris (part 1) (snow)",
      0x53: "Iris Village (snow)",
      0x54: "Iris Monster Village (snow)",
      0x55: "Iris (part 2) (snow)",
      0x56: "Iris Animal Village (snow)",
      0x57: "Iris: Big Hole (snow)",
      0x58: "Root Temple: Leviathan boss fight",
      0x59: "Iris Monster Village: Old witch's house (snow)",
      0x5a: "Iris Monster Village: Klin's house (snow)",
      0x5b: "Iris Animal Village: Squirrels' house (snow)",
      0x5c: "Iris Village: House (snow)",
      0x5d: "Iris Village: House (snow)",
      0x5e: "Iris Animal Village: Ramsey's hut (snow)",
      0x5f: "Iris Animal Village: Brownie's house (snow)",
      // 0x60: "", // Unused
      // 0x61: "", // Unused
      0x62: "Iris Village (past)",
      0x63: "Iris Animal Village (past)",
      0x64: "Iris Village: House (past)",
      0x65: "Iris Village: House (past)",
      0x66: "Iris Animal Village: Race (snow)",
      0x67: "Camellia Abandoned Town (past)",
      0x68: "Camellia Desert (part 1) (past)",
      0x69: "Camellia Animal Village (past)",
      0x6a: "Camellia Desert (part 2) (past)",
      0x6b: "Castle Freesia: Georama boss fight",
      0x6c: "Burn Daisy Entrance",
      0x6d: "Anemone Beach (past)",
      0x6e: "Anemone Beach Animal Village (past)",
      0x6f: "Anemone Beach Village: Ramsey's hut (past)",
      0x70: "Anemone Beach Village: Foxy's hut (past)",
      0x71: "Anemone Beach Village: Daddyphant's hut (past)",
      0x72: "Anemone Beach Village: Monkey's hut (past)",
      0x73: "Dahlia Valley (past)",
      0x74: "Burn Daisy (past)",
      0x75: "Burn Daisy: Puppet Master boss fight (past)",
      0x76: "Burn Daisy Entrance (past)",
      0x77: "Soleil Town (past)",
      0x78: "Anemone Beach: Baron boss fight (past)",
      0x79: "Black Night",
      0x7a: "Black Night: Sense of Sight boss fight",
      0x7b: "Black Night: Sense of Touch boss fight",
      0x7c: "Black Night: Sense of Hearing boss fight",
      0x7d: "Black Night: Sense of Taste boss fight",
      0x7e: "Black Night: Sense of Smell boss fight",
      0x7f: "Black Night: The Spirit Energy boss fight",
      0x80: "Dahlia Valley Dungeon (past)",
      0x81: "Dahlia Valley Dungeon: Mother Monster's Heart boss fight (past)",
      0x82: "Camellia Animal Village: Ramsey's hut",
      0x83: "Iris (part 2) (past)",
      0x84: "Soleil Town: Hero's house (past)",
      0x85: "Soleil Town: Church (past)",
      0x86: "Soleil Town Castle (past)",
      0x87: "Soleil Town Castle: 1F (past)",
      0x88: "Soleil Town Castle: Prison (past)",
      0x89: "Soleil Town: House",
      0x8a: "Root Temple (dry)",
      0x8b: "Soleil Town (ending)",
      0x8c: "Root Temple: Leviathan boss fight (dry)",
    },
    locationSavePreview: {
      0x1: "Soleil Town",
      0x4: "Rafflesia School",
      0x12: "Root Temple",
      0x14: "Dahlia Valley",
      0x18: "Iris",
      0x1a: "Anemone Beach",
      0x22: "Hot Daisy",
      0x28: "Camellia Desert (part 1)",
      0x3c: "Saint Heaven",
      0x45: "Castle Freesia",
      0x47: "Tower of Babel",
      0x6c: "Burn Daisy",
      0x79: "Black Night",
    },
  },
  resourcesOrder: {
    locations: [
      0x0, 0x1, 0x6, 0x7, 0x8, 0x9, 0xa, 0xd, 0x89, 0x26, 0x2b, 0x2c, 0x32,
      0x3a, 0x3b, 0x4, 0x33, 0x13, 0x15, 0x16, 0x21, 0x17, 0x14, 0x2e, 0x1a,
      0x30, 0x35, 0x36, 0x37, 0x38, 0x1c, 0x39, 0x22, 0x6c, 0x41, 0x42, 0x18,
      0x19, 0x48, 0x49, 0x20, 0x1e, 0x1f, 0x4a, 0x4b, 0x4c, 0x1b, 0x1d, 0x4d,
      0x3e, 0x3f, 0x52, 0x53, 0x5c, 0x5d, 0x57, 0x55, 0x56, 0x5e, 0x5f, 0x5b,
      0x66, 0x54, 0x59, 0x5a, 0x28, 0x2a, 0x29, 0x51, 0x82, 0x23, 0x50, 0x47,
      0x46, 0x24, 0x45, 0x43, 0x6b, 0x44, 0x12, 0x58, 0x8a, 0x8c, 0x3c, 0x2d,
      0x40, 0x3d, 0x27, 0x62, 0x64, 0x65, 0x83, 0x63, 0x68, 0x6a, 0x69, 0x67,
      0x2f, 0x34, 0x10, 0x76, 0x74, 0x75, 0x6d, 0x6e, 0x6f, 0x70, 0x71, 0x72,
      0x78, 0x73, 0x80, 0x81, 0x77, 0x84, 0x85, 0x86, 0x87, 0x88, 0x79, 0x7a,
      0x7b, 0x7c, 0x7d, 0x7e, 0x7f, 0x8b,
    ],
  },
};

export default template;