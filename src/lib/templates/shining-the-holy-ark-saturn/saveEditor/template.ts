import type { GameJson } from "$lib/types";

const template: GameJson = {
  validator: {
    regions: {
      europe_usa_japan: {
        0x0: [0x48, 0x4f, 0x4c, 0x59, 0x5f, 0x41, 0x52, 0x4b, 0x5f], // "HOLY_ARK_"
      },
    },
    text: "Drag 'n' drop here or click to add a save file.",
    hint: "If you're having trouble loading a .bcr file, please see the FAQ.",
    error: "Not a valid save file.",
  },
  items: [
    {
      id: "slots",
      length: 0x0,
      type: "container",
      instanceType: "tabs",
      instances: 1,
      enumeration: "Slot %d",
      items: [
        {
          id: "checksum",
          name: "Checksum",
          offset: 0xbd8,
          type: "checksum",
          dataType: "uint32",
          bigEndian: true,
          control: {
            offsetStart: 0x20,
            offsetEnd: 0xbd8,
          },
        },
        {
          type: "tabs",
          items: [
            {
              name: "General",
              flex: true,
              items: [
                {
                  name: "Filename",
                  offset: 0x10,
                  length: 0x6,
                  type: "variable",
                  dataType: "string",
                  letterDataType: "uint8",
                  fallback: 0x20,
                  resource: "letters",
                },
                {
                  id: "itemCollectionRatio",
                  name: "Item Completion Ratio",
                  offset: 0x740,
                  type: "variable",
                  dataType: "uint8",
                  suffix: "%",
                  disabled: true,
                },
                {
                  name: "Playtime",
                  type: "group",
                  mode: "time",
                  items: [
                    {
                      offset: 0xb84,
                      type: "variable",
                      dataType: "uint32",
                      operations: [
                        { "/": 60 },
                        { convert: { from: "seconds", to: "hours" } },
                      ],
                      max: 99,
                      bigEndian: true,
                    },
                    {
                      offset: 0xb84,
                      type: "variable",
                      dataType: "uint32",
                      operations: [
                        { "/": 60 },
                        { convert: { from: "seconds", to: "minutes" } },
                      ],
                      leadingZeros: 1,
                      max: 59,
                      bigEndian: true,
                    },
                    {
                      offset: 0xb84,
                      type: "variable",
                      dataType: "uint32",
                      operations: [
                        { "/": 60 },
                        { convert: { from: "seconds", to: "seconds" } },
                      ],
                      leadingZeros: 1,
                      max: 59,
                      bigEndian: true,
                    },
                  ],
                },
                {
                  // id: "location",
                  name: "Location",
                  offset: 0xb88,
                  type: "variable",
                  dataType: "uint16",
                  bigEndian: true,
                  // resource: "locations",
                  // size: "lg",
                  // autocomplete: true,
                },
                // {
                //   name: "Linked to Location",
                //   offset: 0x41,
                //   type: "variable",
                //   dataType: "uint8",
                //   resource: "locations",
                //   hidden: true,
                // },
                {
                  name: "Gold",
                  offset: 0xb80,
                  type: "variable",
                  dataType: "uint32",
                  bigEndian: true,
                  max: 999999,
                },
              ],
            },
            {
              name: "Party",
              items: [
                {
                  length: 0xcc,
                  type: "container",
                  instanceType: "tabs",
                  instances: 8,
                  resource: "characters",
                  vertical: true,
                  items: [
                    {
                      type: "tabs",
                      items: [
                        {
                          name: "Status",
                          items: [
                            {
                              type: "section",
                              flex: true,
                              items: [
                                {
                                  name: "Name",
                                  offset: 0x20,
                                  length: 0x6,
                                  type: "variable",
                                  dataType: "string",
                                  letterDataType: "uint8",
                                  resource: "letters",
                                  endCode: 0x0,
                                  test: true,
                                },
                                {
                                  name: "Class",
                                  offset: 0xbc,
                                  type: "variable",
                                  dataType: "uint16",
                                  bigEndian: true,
                                  // resource: "classes",
                                  // autocomplete: true,
                                },
                                {
                                  name: "Command",
                                  offset: 0x49,
                                  type: "variable",
                                  dataType: "uint8",
                                  resource: "commands",
                                },
                              ],
                            },
                            {
                              type: "section",
                              flex: true,
                              items: [
                                {
                                  name: "Level",
                                  offset: 0xba,
                                  type: "variable",
                                  dataType: "uint16",
                                  bigEndian: true,
                                  // min: 1,
                                  // max: 99,
                                },
                                {
                                  name: "Experience",
                                  offset: 0xc8,
                                  type: "variable",
                                  dataType: "uint32",
                                  bigEndian: true,
                                  // max: 99,
                                },
                                {
                                  name: "Next Experience",
                                  offset: 0xc0,
                                  type: "variable",
                                  dataType: "uint32",
                                  bigEndian: true,
                                  hidden: true,
                                },
                                {
                                  name: "HP",
                                  type: "group",
                                  mode: "fraction",
                                  items: [
                                    {
                                      offset: 0xa0,
                                      type: "variable",
                                      dataType: "uint16",
                                      bigEndian: true,
                                      max: 999,
                                    },
                                    {
                                      offset: 0x2c,
                                      type: "variable",
                                      dataType: "uint16",
                                      bigEndian: true,
                                      min: 1,
                                      max: 999,
                                    },
                                  ],
                                },
                                {
                                  name: "MP",
                                  type: "group",
                                  mode: "fraction",
                                  items: [
                                    {
                                      offset: 0xa2,
                                      type: "variable",
                                      dataType: "uint16",
                                      bigEndian: true,
                                      max: 999,
                                    },
                                    {
                                      offset: 0x2e,
                                      type: "variable",
                                      dataType: "uint16",
                                      bigEndian: true,
                                      max: 999,
                                    },
                                  ],
                                },
                              ],
                            },
                            {
                              type: "section",
                              flex: true,
                              items: [
                                {
                                  name: "Attack",
                                  offset: 0x30,
                                  type: "variable",
                                  dataType: "uint16",
                                  bigEndian: true,
                                  max: 999,
                                },
                                {
                                  name: "Defense",
                                  offset: 0x32,
                                  type: "variable",
                                  dataType: "uint16",
                                  bigEndian: true,
                                  max: 999,
                                },
                                {
                                  name: "Agility",
                                  offset: 0x34,
                                  type: "variable",
                                  dataType: "uint16",
                                  bigEndian: true,
                                  max: 999,
                                },
                                {
                                  name: "Critical",
                                  offset: 0x36,
                                  type: "variable",
                                  dataType: "uint16",
                                  bigEndian: true,
                                  max: 999,
                                },
                                {
                                  name: "Technique",
                                  offset: 0x38,
                                  type: "variable",
                                  dataType: "uint16",
                                  bigEndian: true,
                                  max: 999,
                                },
                                {
                                  name: "Luck",
                                  offset: 0x3a,
                                  type: "variable",
                                  dataType: "uint16",
                                  bigEndian: true,
                                  max: 999,
                                },
                                {
                                  name: "Magic Defense",
                                  offset: 0x3c,
                                  type: "variable",
                                  dataType: "uint16",
                                  bigEndian: true,
                                  max: 999,
                                },
                                {
                                  name: "Breath Defense",
                                  offset: 0x3e,
                                  type: "variable",
                                  dataType: "uint16",
                                  bigEndian: true,
                                  max: 999,
                                },
                              ],
                            },
                          ],
                        },
                        {
                          name: "Magic",
                          items: [
                            {
                              length: 0x1,
                              type: "container",
                              instanceType: "section",
                              instances: 8,
                              flex: true,
                              noMargin: true,
                              items: [
                                {
                                  name: "Spell %d",
                                  offset: 0x90,
                                  type: "variable",
                                  dataType: "uint8",
                                  resource: "spells",
                                  autocomplete: true,
                                },
                                {
                                  name: "Level",
                                  offset: 0x98,
                                  type: "variable",
                                  dataType: "uint8",
                                  operations: [{ "+": 1 }],
                                  min: 1,
                                  max: 4,
                                },
                              ],
                            },
                          ],
                        },
                        {
                          name: "Items",
                          items: [
                            {
                              length: 0x2,
                              type: "container",
                              instanceType: "section",
                              instances: 16,
                              flex: true,
                              noMargin: true,
                              items: [
                                {
                                  name: "Item %d",
                                  offset: 0x70,
                                  type: "variable",
                                  dataType: "uint16",
                                  bigEndian: true,
                                  binary: {
                                    bitStart: 0,
                                    bitLength: 12,
                                  },
                                  resource: "items",
                                  autocomplete: true,
                                },
                                {
                                  name: "Status",
                                  offset: 0x70,
                                  type: "variable",
                                  dataType: "uint8",
                                  binary: {
                                    bitStart: 6,
                                    bitLength: 2,
                                  },
                                  resource: "itemStatus",
                                },
                              ],
                            },
                          ],
                        },
                      ],
                    },
                  ],
                },
              ],
            },
            {
              name: "Formation",
              items: [
                {
                  type: "section",
                  flex: true,
                  noMargin: true,
                  items: [
                    {
                      id: "formation",
                      name: "Arthur",
                      offset: 0x680,
                      type: "variable",
                      dataType: "bit",
                      bit: 0,
                      resource: "formations",
                    },
                    {
                      id: "formation",
                      name: "Melody",
                      offset: 0x680,
                      type: "variable",
                      dataType: "bit",
                      bit: 1,
                      resource: "formations",
                    },
                    {
                      id: "formation",
                      name: "Rodi",
                      offset: 0x680,
                      type: "variable",
                      dataType: "bit",
                      bit: 2,
                      resource: "formations",
                    },
                    {
                      id: "formation",
                      name: "Basso",
                      offset: 0x680,
                      type: "variable",
                      dataType: "bit",
                      bit: 3,
                      resource: "formations",
                    },
                  ],
                },
                {
                  type: "section",
                  flex: true,
                  items: [
                    {
                      id: "formation",
                      name: "Akane",
                      offset: 0x680,
                      type: "variable",
                      dataType: "bit",
                      bit: 4,
                      resource: "formations",
                    },
                    {
                      id: "formation",
                      name: "Forte",
                      offset: 0x680,
                      type: "variable",
                      dataType: "bit",
                      bit: 5,
                      resource: "formations",
                    },
                    {
                      id: "formation",
                      name: "Doyle",
                      offset: 0x680,
                      type: "variable",
                      dataType: "bit",
                      bit: 6,
                      resource: "formations",
                    },
                    {
                      id: "formation",
                      name: "Lisa",
                      offset: 0x680,
                      type: "variable",
                      dataType: "bit",
                      bit: 7,
                      resource: "formations",
                    },
                  ],
                },
                {
                  type: "section",
                  flex: true,
                  hidden: true,
                  items: [
                    {
                      name: "Joined",
                      type: "bitflags",
                      flags: [
                        { offset: 0x680, bit: 0, label: "Arthur" },
                        { offset: 0x680, bit: 1, label: "Melody" },
                        { offset: 0x680, bit: 2, label: "Rodi" },
                        { offset: 0x680, bit: 3, label: "Basso" },
                        { offset: 0x680, bit: 4, label: "Akane" },
                        { offset: 0x680, bit: 5, label: "Forte" },
                        { offset: 0x680, bit: 6, label: "Doyle" },
                        { offset: 0x680, bit: 7, label: "Lisa" },
                      ],
                    },
                    {
                      name: "Lead Team",
                      type: "bitflags",
                      flags: [
                        { offset: 0x682, bit: 0, label: "Arthur" },
                        { offset: 0x682, bit: 1, label: "Melody" },
                        { offset: 0x682, bit: 2, label: "Rodi" },
                        { offset: 0x682, bit: 3, label: "Basso" },
                        { offset: 0x682, bit: 4, label: "Akane" },
                        { offset: 0x682, bit: 5, label: "Forte" },
                        { offset: 0x682, bit: 6, label: "Doyle" },
                        { offset: 0x682, bit: 7, label: "Lisa" },
                      ],
                    },
                  ],
                },
              ],
            },
            { name: "Shops", planned: true, items: [] },
            {
              name: "Events",
              planned: true,
              items: [
                {
                  type: "bitflags",
                  flags: [
                    { offset: 0x740, bit: 0, label: "[Desire Mine 1F] Herb" }, // prettier-ignore
                    { offset: 0x740, bit: 1, label: "[Desire Mine 1F] Herb" }, // prettier-ignore
                    { offset: 0x740, bit: 2, label: "[Desire Mine 1F] Leather Glove" }, // prettier-ignore
                    { offset: 0x740, bit: 3, label: "???", hidden: true }, // prettier-ignore
                    { offset: 0x740, bit: 4, label: "[Desire Mine B1] Iron Circlet" }, // prettier-ignore
                    { offset: 0x740, bit: 5, label: "[Desire Mine B1] Herb" }, // prettier-ignore
                    { offset: 0x740, bit: 6, label: "???", hidden: true }, // prettier-ignore
                    { offset: 0x740, bit: 7, label: "???", hidden: true }, // prettier-ignore
                    { offset: 0x741, bit: 0, label: "[Desire Mine 1F] 20 Gold Coins" }, // prettier-ignore
                    { offset: 0x741, bit: 1, label: "[Desire Mine B1] Herb" }, // prettier-ignore
                    { offset: 0x741, bit: 2, label: "[Forest of Confusion] Herb" }, // prettier-ignore
                    { offset: 0x741, bit: 3, label: "[Forest of Confusion] Bronze Shell" }, // prettier-ignore
                    { offset: 0x741, bit: 4, label: "[Forest of Confusion] Wooden Staff" }, // prettier-ignore
                    { offset: 0x741, bit: 5, label: "[Forest of Confusion] Herb" }, // prettier-ignore
                    { offset: 0x741, bit: 6, label: "[Forest of Confusion] Energy Bread" }, // prettier-ignore
                    { offset: 0x741, bit: 7, label: "[Forest of Confusion] Angel Wing" }, // prettier-ignore
                    { offset: 0x742, bit: 0, label: "[Forest of Confusion] Middle Shield" }, // prettier-ignore
                    { offset: 0x742, bit: 1, label: "[Forest of Confusion] Lucky Cookie" }, // prettier-ignore
                    { offset: 0x742, bit: 2, label: "[Forest of Confusion] Angel Wing" }, // prettier-ignore
                    { offset: 0x742, bit: 3, label: "???", hidden: true }, // prettier-ignore
                    { offset: 0x742, bit: 4, label: "[Forest Cave B1 North side] Herb" }, // prettier-ignore
                    { offset: 0x742, bit: 5, label: "[Forest Cave B1 North side] Bronze Staff" }, // prettier-ignore
                    { offset: 0x742, bit: 6, label: "[Forest Cave B1 North side] Antidote Herb" }, // prettier-ignore
                    { offset: 0x742, bit: 7, label: "[Forest Cave B2] Feather Robe" }, // prettier-ignore
                    { offset: 0x743, bit: 0, label: "[Forest Cave B2] Bronze Brace" }, // prettier-ignore
                    { offset: 0x743, bit: 1, label: "[Forest Cave B2] Magic Nectar" }, // prettier-ignore
                    { offset: 0x743, bit: 2, label: "[Forest Cave B2] Herb" }, // prettier-ignore
                    { offset: 0x743, bit: 3, label: "[Forest Cave B1 South side] Antidote Herb" }, // prettier-ignore
                    { offset: 0x743, bit: 4, label: "[Forest Cave B1 South side] Mithril Ore" }, // prettier-ignore
                    { offset: 0x743, bit: 5, label: "[Forest Cave B1 South side] Scale Suit" }, // prettier-ignore
                    { offset: 0x743, bit: 6, label: "[Enrich Dungeon B2] Critical Juice" }, // prettier-ignore
                    { offset: 0x743, bit: 7, label: "[Enrich Dungeon B2] Slash Dagger" }, // prettier-ignore
                    { offset: 0x744, bit: 0, label: "[Enrich Dungeon B2] Antidote Herb" }, // prettier-ignore
                    { offset: 0x744, bit: 1, label: "[Enrich Dungeon B2] Potion" }, // prettier-ignore
                    { offset: 0x744, bit: 2, label: "[Enrich Dungeon B2] Iron Brace" }, // prettier-ignore
                    { offset: 0x744, bit: 3, label: "[Dungeon Well] Crystal Key" }, // prettier-ignore
                    { offset: 0x744, bit: 4, label: "[Enrich Dungeon B2] Snake Crest" }, // prettier-ignore
                    { offset: 0x744, bit: 5, label: "[Enrich Dungeon B2] Goat Crest" }, // prettier-ignore
                    { offset: 0x744, bit: 6, label: "[Enrich Dungeon B2] Eagle Crest" }, // prettier-ignore
                    { offset: 0x744, bit: 7, label: "[Enrich Dungeon B2] Gold Key" }, // prettier-ignore
                    { offset: 0x745, bit: 0, label: "[Forest of Aborigine] Steel Sword" }, // prettier-ignore
                    { offset: 0x745, bit: 1, label: "[Forest of Aborigine] Power Shield" }, // prettier-ignore
                    { offset: 0x745, bit: 2, label: "[Graveyard Catacombs B1] Haste Ring" }, // prettier-ignore
                    { offset: 0x745, bit: 3, label: "[Graveyard Catacombs B1] Protect Milk" }, // prettier-ignore
                    { offset: 0x745, bit: 4, label: "[Graveyard Catacombs B1] Quick Chicken" }, // prettier-ignore
                    { offset: 0x745, bit: 5, label: "[Graveyard Catacombs B1] Potion" }, // prettier-ignore
                    { offset: 0x745, bit: 6, label: "[Forest of Aborigine] Angel Wing" }, // prettier-ignore
                    { offset: 0x745, bit: 7, label: "[Forest of Aborigine] Chain Mail" }, // prettier-ignore
                    { offset: 0x746, bit: 0, label: "[Aborigine Mansion 1F] Iron Shell" }, // prettier-ignore
                    { offset: 0x746, bit: 1, label: "[Aborigine Mansion 1F] Old Key" }, // prettier-ignore
                    { offset: 0x746, bit: 2, label: "[Aborigine Mansion 1F] Broadsword" }, // prettier-ignore
                    { offset: 0x746, bit: 3, label: "[Aborigine Mansion 2F] Power Staff" }, // prettier-ignore
                    { offset: 0x746, bit: 4, label: "[Aborigine Mansion 1F] Druid's Robe" }, // prettier-ignore
                    { offset: 0x746, bit: 5, label: "[Aborigine Mansion 2F] Steel Suit" }, // prettier-ignore
                    { offset: 0x746, bit: 6, label: "[Aborigine Mansion 1F] Potion" }, // prettier-ignore
                    { offset: 0x746, bit: 7, label: "[Aborigine Mansion 1F] Fairy Powder" }, // prettier-ignore
                    { offset: 0x747, bit: 0, label: "[Aborigine Mansion 2F] Mithril Ore" }, // prettier-ignore
                    { offset: 0x747, bit: 1, label: "[Aborigine Mansion 1F] Royal Crest" }, // prettier-ignore
                    { offset: 0x747, bit: 2, label: "[Aborigine Mansion 2F] Clock Key" }, // prettier-ignore
                    { offset: 0x747, bit: 3, label: "[Aborigine Mansion 2F] Silver Tiara" }, // prettier-ignore
                    { offset: 0x747, bit: 4, label: "[Mountain Cave 1F] Lucky Cookie" }, // prettier-ignore
                    { offset: 0x747, bit: 5, label: "[Mountain Cave 1F] Life Ring" }, // prettier-ignore
                    { offset: 0x747, bit: 6, label: "[Mountain Cave] Mithril Ore" }, // prettier-ignore
                    { offset: 0x747, bit: 7, label: "[Mountain Cave] Power Brace" }, // prettier-ignore
                    { offset: 0x748, bit: 0, label: "[Mountain Cave B1] Magic Nectar" }, // prettier-ignore
                    { offset: 0x748, bit: 1, label: "[Mountain Cave B1] Potion" }, // prettier-ignore
                    { offset: 0x748, bit: 2, label: "???", hidden: true }, // prettier-ignore
                    { offset: 0x748, bit: 3, label: "[South Shrine 1F North side] Elixir" }, // prettier-ignore
                    { offset: 0x748, bit: 4, label: "[Tower of Illusion 3F] Chesthead" }, // prettier-ignore
                    { offset: 0x748, bit: 5, label: "[Tower of Illusion 3F] Chesthead" }, // prettier-ignore
                    { offset: 0x748, bit: 6, label: "[South Shrine B1 South side] Dragon Orb" }, // prettier-ignore
                    { offset: 0x748, bit: 7, label: "[South Shrine B1 South side] Mithril Ore" }, // prettier-ignore
                    { offset: 0x749, bit: 0, label: "[South Shrine B1 North side] Power Juice" }, // prettier-ignore
                    { offset: 0x749, bit: 1, label: "[South Shrine B2 West side] Arcane Garlic" }, // prettier-ignore
                    { offset: 0x749, bit: 2, label: "[South Shrine B2 East side] Energy Bread" }, // prettier-ignore
                    { offset: 0x749, bit: 3, label: "[South Shrine 1F South side] Potion" }, // prettier-ignore
                    { offset: 0x749, bit: 4, label: "[South Shrine 1F South side] Angel Wing" }, // prettier-ignore
                    { offset: 0x749, bit: 5, label: "???", hidden: true }, // prettier-ignore
                    { offset: 0x749, bit: 6, label: "[South Shrine B2 East side] Magic Mattock" }, // prettier-ignore
                    { offset: 0x749, bit: 7, label: "[South Shrine 1F North side] Shield Tiara" }, // prettier-ignore
                    { offset: 0x74a, bit: 0, label: "???", hidden: true }, // prettier-ignore
                    { offset: 0x74a, bit: 1, label: "???", hidden: true }, // prettier-ignore
                    { offset: 0x74a, bit: 2, label: "???", hidden: true }, // prettier-ignore
                    { offset: 0x74a, bit: 3, label: "[Enrich Dungeon B2] Life Candle" }, // prettier-ignore
                    { offset: 0x74a, bit: 4, label: "[Enrich Dungeon B1] Brave Apple" }, // prettier-ignore
                    { offset: 0x74a, bit: 5, label: "???", hidden: true }, // prettier-ignore
                    { offset: 0x74a, bit: 6, label: "[Enrich Dungeon 1F] Mithril Ore" }, // prettier-ignore
                    { offset: 0x74a, bit: 7, label: "[Enrich Dungeon 1F] Potion" }, // prettier-ignore
                    { offset: 0x74b, bit: 0, label: "???", hidden: true }, // prettier-ignore
                    { offset: 0x74b, bit: 1, label: "???", hidden: true }, // prettier-ignore
                    { offset: 0x74b, bit: 2, label: "[West Shrine 1F East side] Heat Axe" }, // prettier-ignore
                    { offset: 0x74b, bit: 3, label: "[West Shrine 1F East side] Battle Armor" }, // prettier-ignore
                    { offset: 0x74b, bit: 4, label: "[West Shrine 2F] Evil Ring" }, // prettier-ignore
                    { offset: 0x74b, bit: 5, label: "[West Shrine 1F West side] Mithril Ingot" }, // prettier-ignore
                    { offset: 0x74b, bit: 6, label: "[West Shrine 1F East side] Goddess Tears" }, // prettier-ignore
                    { offset: 0x74b, bit: 7, label: "[West Shrine 1F East side] Potion" }, // prettier-ignore
                    { offset: 0x74c, bit: 0, label: "[West Shrine 1F West side] Potion" }, // prettier-ignore
                    { offset: 0x74c, bit: 1, label: "[West Shrine 1F West side] Elixir" }, // prettier-ignore
                    { offset: 0x74c, bit: 2, label: "[West Shrine 1F East side] Mithril Ore" }, // prettier-ignore
                    { offset: 0x74c, bit: 3, label: "???", hidden: true }, // prettier-ignore
                    { offset: 0x74c, bit: 4, label: "[East Shrine 2F] Holy Crest" }, // prettier-ignore
                    { offset: 0x74c, bit: 5, label: "[East Shrine 3F] Mithril Ingot" }, // prettier-ignore
                    { offset: 0x74c, bit: 6, label: "[East Shrine 2F] Mithril Ingot" }, // prettier-ignore
                    { offset: 0x74c, bit: 7, label: "[East Shrine 1F] Goddess Tears" }, // prettier-ignore
                    { offset: 0x74d, bit: 0, label: "[East Shrine 3F] Power Juice" }, // prettier-ignore
                    { offset: 0x74d, bit: 1, label: "[East Shrine 3F] Elixir" }, // prettier-ignore
                    { offset: 0x74d, bit: 2, label: "[East Shrine 2F] Life Candle" }, // prettier-ignore
                    { offset: 0x74d, bit: 3, label: "[East Shrine 3F] Elixir" }, // prettier-ignore
                    { offset: 0x74d, bit: 4, label: "[East Shrine 1F] Holy Rain" }, // prettier-ignore
                    { offset: 0x74d, bit: 5, label: "[East Shrine 2F] Mithril Ore" }, // prettier-ignore
                    { offset: 0x74d, bit: 6, label: "[Tower of Illusion 5F] Holy Rain" }, // prettier-ignore
                    { offset: 0x74d, bit: 7, label: "[Tower of Illusion 1F] Force Blade" }, // prettier-ignore
                    { offset: 0x74e, bit: 0, label: "[Tower of Illusion 3F] Dragon Mail" }, // prettier-ignore
                    { offset: 0x74e, bit: 1, label: "[Tower of Illusion 2F] Shining Mail" }, // prettier-ignore
                    { offset: 0x74e, bit: 2, label: "[Tower of Illusion 4F] Angel's Robe" }, // prettier-ignore
                    { offset: 0x74e, bit: 3, label: "[Tower of Illusion 4F] Elixir" }, // prettier-ignore
                    { offset: 0x74e, bit: 4, label: "[Tower of Illusion 2F] Elemental Orb" }, // prettier-ignore
                    { offset: 0x74e, bit: 5, label: "[Tower of Illusion 1F] Mithril Ingot" }, // prettier-ignore
                    { offset: 0x74e, bit: 6, label: "[Tower of Illusion 3F] Light Of Hope" }, // prettier-ignore
                    { offset: 0x74e, bit: 7, label: "[Tower of Illusion 1F] Chesthead" }, // prettier-ignore
                    { offset: 0x74f, bit: 0, label: "[Desire Mine 3F] Shining Sword" }, // prettier-ignore
                    { offset: 0x74f, bit: 1, label: "[Desire Mine 2F] Elixir" }, // prettier-ignore
                    { offset: 0x74f, bit: 2, label: "[Desire Mine 3F] Demon Staff" }, // prettier-ignore
                    { offset: 0x74f, bit: 3, label: "[Desire Mine 2F] Demon Claw" }, // prettier-ignore
                    { offset: 0x74f, bit: 4, label: "[Desire Mine 3F] Goddess Tears" }, // prettier-ignore
                    { offset: 0x74f, bit: 5, label: "[Desire Mine 1F] Potion" }, // prettier-ignore
                    { offset: 0x74f, bit: 6, label: "[Desire Mine 1F] Royal Circlet" }, // prettier-ignore
                    { offset: 0x74f, bit: 7, label: "[Desire Mine 2F] Elixir" }, // prettier-ignore
                    { offset: 0x750, bit: 0, label: "[Desire Mine 3F] Mithril Ingot" }, // prettier-ignore
                    { offset: 0x750, bit: 1, label: "[Desire Mine 2F] Mithril Ingot" }, // prettier-ignore
                    { offset: 0x750, bit: 2, label: "[Desire Mine 1F] Mithril Ingot" }, // prettier-ignore
                    { offset: 0x750, bit: 3, label: "[Desire Mine 3F] Elixir" }, // prettier-ignore
                    { offset: 0x750, bit: 4, label: "???", hidden: true }, // prettier-ignore
                    { offset: 0x750, bit: 5, label: "[Desire Village] Quick Chicken" }, // prettier-ignore
                    { offset: 0x750, bit: 6, label: "[Far East Village] Turbo Boots" }, // prettier-ignore
                    { offset: 0x750, bit: 7, label: "[Desire Village] Arcane Garlic" }, // prettier-ignore
                    { offset: 0x751, bit: 0, label: "[Mirage Village] Stamina Onion" }, // prettier-ignore
                    { offset: 0x751, bit: 1, label: "[Mirage Village] Protect Milk" }, // prettier-ignore
                    { offset: 0x751, bit: 2, label: "[Castle of Enrich] Stamina Onion" }, // prettier-ignore
                    { offset: 0x751, bit: 3, label: "???", hidden: true }, // prettier-ignore
                    { offset: 0x751, bit: 4, label: "[Godspeak] Force Shield" }, // prettier-ignore
                    { offset: 0x751, bit: 5, label: "[Godspeak] Goddess Tears" }, // prettier-ignore
                    { offset: 0x751, bit: 6, label: "[Godspeak] Mithril Ingot" }, // prettier-ignore
                    { offset: 0x751, bit: 7, label: "[Godspeak] Evil Orb" }, // prettier-ignore
                    { offset: 0x752, bit: 0, label: "[Godspeak] Elixir" }, // prettier-ignore
                    { offset: 0x752, bit: 1, label: "[Desire Mine 2F] Ifrit in jar defeated" }, // prettier-ignore
                    { offset: 0x752, bit: 2, label: "???", hidden: true }, // prettier-ignore
                    { offset: 0x752, bit: 3, label: "[Desire Mine 3F] Ifrit in jar defeated" }, // prettier-ignore
                    { offset: 0x752, bit: 4, label: "[Desire Mine 3F] Ifrit in jar defeated" }, // prettier-ignore
                    { offset: 0x752, bit: 5, label: "???", hidden: true }, // prettier-ignore
                    { offset: 0x752, bit: 6, label: "???", hidden: true }, // prettier-ignore
                    { offset: 0x752, bit: 7, label: "[Forest Cave B1 South side] Angel Wing" }, // prettier-ignore
                    { offset: 0x753, bit: 0, label: "[South Shrine B1 South side] Stone Key" }, // prettier-ignore
                    { offset: 0x753, bit: 1, label: "???", hidden: true }, // prettier-ignore
                    { offset: 0x753, bit: 2, label: "[East Shrine 2F] Lucky Cookie" }, // prettier-ignore
                    { offset: 0x753, bit: 3, label: "[South Shrine 1F South side] Protect Milk" }, // prettier-ignore
                    { offset: 0x753, bit: 4, label: "[South Shrine 1F South side] Magic Nectar" }, // prettier-ignore
                    { offset: 0x753, bit: 5, label: "???", hidden: true }, // prettier-ignore
                    { offset: 0x753, bit: 6, label: "[South Shrine B1 North side] Potion" }, // prettier-ignore
                    { offset: 0x753, bit: 7, label: "[South Shrine B1 South side] Quick Chicken" }, // prettier-ignore
                    { offset: 0x754, bit: 0, label: "[South Shrine B2 West side] Critical Juice" }, // prettier-ignore
                    { offset: 0x754, bit: 1, label: "[Dungeon] Herb" }, // prettier-ignore
                    { offset: 0x754, bit: 2, label: "[Dungeon] Fairy Powder" }, // prettier-ignore
                    { offset: 0x754, bit: 3, label: "[Dungeon] Light Of Hope" }, // prettier-ignore
                    { offset: 0x754, bit: 4, label: "[Tower of Illusion 3F] Potion" }, // prettier-ignore
                    { offset: 0x754, bit: 5, label: "[Tower of Illusion 1F] Elixir" }, // prettier-ignore
                    { offset: 0x754, bit: 6, label: "[Tower of Illusion 3F] Protect Milk" }, // prettier-ignore
                    { offset: 0x754, bit: 7, label: "[Tower of Illusion 5F] Energy Bread" }, // prettier-ignore
                    { offset: 0x755, bit: 0, label: "[Tower of Illusion 3F] Power Juice" }, // prettier-ignore
                    { offset: 0x755, bit: 1, label: "[Mirage Village] Elixir" }, // prettier-ignore
                    { offset: 0x755, bit: 2, label: "???", hidden: true }, // prettier-ignore
                    { offset: 0x755, bit: 3, label: "[Desire Mine B1] 60 Gold Coins" }, // prettier-ignore
                    { offset: 0x755, bit: 4, label: "[Desire Mine B1] 40 Gold Coins" }, // prettier-ignore
                    { offset: 0x755, bit: 5, label: "[Desire Mine B1] 40 Gold Coins" }, // prettier-ignore
                    { offset: 0x755, bit: 6, label: "???", hidden: true }, // prettier-ignore
                    { offset: 0x755, bit: 7, label: "[Graveyard Catacombs B1] Lucky Cookie" }, // prettier-ignore
                    { offset: 0x756, bit: 0, label: "[Graveyard Catacombs B1] Fairy Powder" }, // prettier-ignore
                    { offset: 0x756, bit: 1, label: "[East Shrine 1F] Fairy Powder" }, // prettier-ignore
                    { offset: 0x756, bit: 2, label: "[East Shrine 2F] Goddess Tears" }, // prettier-ignore
                    { offset: 0x756, bit: 3, label: "???", hidden: true }, // prettier-ignore
                    { offset: 0x756, bit: 4, label: "???", hidden: true }, // prettier-ignore
                    { offset: 0x756, bit: 5, label: "[Aborigine Mansion 1F] Gravity Stone" }, // prettier-ignore
                    { offset: 0x756, bit: 6, label: "???", hidden: true }, // prettier-ignore
                    { offset: 0x756, bit: 7, label: "???", hidden: true }, // prettier-ignore
                    { offset: 0x757, bit: 0, label: "???", hidden: true }, // prettier-ignore
                    { offset: 0x757, bit: 1, label: "???", hidden: true }, // prettier-ignore
                    { offset: 0x757, bit: 2, label: "???", hidden: true }, // prettier-ignore
                    { offset: 0x757, bit: 3, label: "???", hidden: true }, // prettier-ignore
                    { offset: 0x757, bit: 4, label: "???", hidden: true }, // prettier-ignore
                    { offset: 0x757, bit: 5, label: "???", hidden: true }, // prettier-ignore
                    { offset: 0x757, bit: 6, label: "[Aborigine Mansion 1F] Chest Ghost" }, // prettier-ignore
                    { offset: 0x757, bit: 7, label: "[Aborigine Mansion 2F] Chest Ghost" }, // prettier-ignore
                    { offset: 0x758, bit: 0, label: "[Aborigine Mansion 1F] Chest Ghost" }, // prettier-ignore
                    { offset: 0x758, bit: 1, label: "[Aborigine Mansion 2F] Chest Ghost" }, // prettier-ignore
                    { offset: 0x758, bit: 2, label: "[East Shrine 3F] Chesthead" }, // prettier-ignore
                    { offset: 0x758, bit: 3, label: "[East Shrine 3F] Chesthead" }, // prettier-ignore
                    { offset: 0x758, bit: 4, label: "[East Shrine 2F] Chesthead" }, // prettier-ignore
                    { offset: 0x758, bit: 5, label: "[East Shrine 2F] Chesthead" }, // prettier-ignore
                    { offset: 0x758, bit: 6, label: "[East Shrine 2F] Chesthead" }, // prettier-ignore
                    { offset: 0x758, bit: 7, label: "[East Shrine 2F] Chesthead" }, // prettier-ignore
                    { offset: 0x759, bit: 0, label: "[Enrich Dungeon B2] Chest Ghost" }, // prettier-ignore
                    { offset: 0x759, bit: 1, label: "[Mountain Cave B1] Chest Ghost" }, // prettier-ignore
                    { offset: 0x759, bit: 2, label: "[Mountain Cave B1] Chest Ghost" }, // prettier-ignore
                    { offset: 0x759, bit: 3, label: "[Godspeak] Ifrit in jar defeated" }, // prettier-ignore
                    { offset: 0x759, bit: 4, label: "[Enrich Dungeon B1] Chest Ghost" }, // prettier-ignore
                    { offset: 0x759, bit: 5, label: "[Desire Mine 2F] Ifrit in jar defeated" }, // prettier-ignore
                    { offset: 0x759, bit: 6, label: "[Forest of Confusion] Pixie: Maple" }, // prettier-ignore
                    { offset: 0x759, bit: 7, label: "[Desire Village] Pixie: Cherry" }, // prettier-ignore
                    { offset: 0x75a, bit: 0, label: "[Forest Cave B1 South side] Pixie: Willow" }, // prettier-ignore
                    { offset: 0x75a, bit: 1, label: "[Dungeon Well] Pixie: Cedar" }, // prettier-ignore
                    { offset: 0x75a, bit: 2, label: "[Mountain Cave B1] Pixie: Palm" }, // prettier-ignore
                    { offset: 0x75a, bit: 3, label: "[Far East Village] Pixie: Apple" }, // prettier-ignore
                    { offset: 0x75a, bit: 4, label: "[Enrich Dungeon B1] Pixie: Lime" }, // prettier-ignore
                    { offset: 0x75a, bit: 5, label: "[West Shrine 1F East side] Pixie: Pear" }, // prettier-ignore
                    { offset: 0x75a, bit: 6, label: "[East Shrine 1F] Pixie: Plum" }, // prettier-ignore
                    { offset: 0x75a, bit: 7, label: "[Desire Mine 3F] Pixie: Baldric" }, // prettier-ignore
                    { offset: 0x75b, bit: 0, label: "[Forest of Confusion] Fairy: Daisy" }, // prettier-ignore
                    { offset: 0x75b, bit: 1, label: "[Forest Cave B1 North side] Fairy: Iris" }, // prettier-ignore
                    { offset: 0x75b, bit: 2, label: "[Enrich Dungeon B2] Fairy: Camellia" }, // prettier-ignore
                    { offset: 0x75b, bit: 3, label: "[Forest of Aborigine] Fairy: Peony" }, // prettier-ignore
                    { offset: 0x75b, bit: 4, label: "[Mountain Cave 1F] Fairy: Lily" }, // prettier-ignore
                    { offset: 0x75b, bit: 5, label: "[Far East Village] Fairy: Azalea" }, // prettier-ignore
                    { offset: 0x75b, bit: 6, label: "[West Shrine 1F West side] Fairy: Sisal" }, // prettier-ignore
                    { offset: 0x75b, bit: 7, label: "[East Shrine 1F] Fairy: Mimosa" }, // prettier-ignore
                    { offset: 0x75c, bit: 0, label: "[Tower of Illusion 4F] Fairy: Primrose" }, // prettier-ignore
                    { offset: 0x75c, bit: 1, label: "[Desire Mine 2F] Fairy: Clyde" }, // prettier-ignore
                    { offset: 0x75c, bit: 2, label: "[Desire Mine 1F] Succubus: Muran" }, // prettier-ignore
                    { offset: 0x75c, bit: 3, label: "[Enrich Town] Succubus: Dahlia" }, // prettier-ignore
                    { offset: 0x75c, bit: 4, label: "[Town Well] Succubus: Roberia" }, // prettier-ignore
                    { offset: 0x75c, bit: 5, label: "[Graveyard Catacombs B1] Succubus: Lacey" }, // prettier-ignore
                    { offset: 0x75c, bit: 6, label: "[Aborigine Mansion 1F] Succubus: Orlea" }, // prettier-ignore
                    { offset: 0x75c, bit: 7, label: "[Mountain Cave B1] Succubus: Ripanos" }, // prettier-ignore
                    { offset: 0x75d, bit: 0, label: "[South Shrine 1F North side] Succubus: Kathorea" }, // prettier-ignore
                    { offset: 0x75d, bit: 1, label: "[Mirage Village] Succubus: Viola" }, // prettier-ignore
                    { offset: 0x75d, bit: 2, label: "[Tower of Illusion 1F] Succubus: Lunaria" }, // prettier-ignore
                    { offset: 0x75d, bit: 3, label: "[Desire Mine 2F] Succubus: Natasha" }, // prettier-ignore
                    { offset: 0x75d, bit: 4, label: "[Desire Village] Incubus: Lantano" }, // prettier-ignore
                    { offset: 0x75d, bit: 5, label: "[Forest Cave B2] Incubus: Enjewel" }, // prettier-ignore
                    { offset: 0x75d, bit: 6, label: "[Enrich Town] Incubus: Masakari" }, // prettier-ignore
                    { offset: 0x75d, bit: 7, label: "[Forest of Aborigine] Incubus: Krupis" }, // prettier-ignore
                    { offset: 0x75e, bit: 0, label: "[Aborigine Mansion 2F] Incubus: Liknis" }, // prettier-ignore
                    { offset: 0x75e, bit: 1, label: "[South Shrine 1F South side] Incubus: Cypress" }, // prettier-ignore
                    { offset: 0x75e, bit: 2, label: "[Enrich Dungeon B2] Incubus: Aster" }, // prettier-ignore
                    { offset: 0x75e, bit: 3, label: "[West Shrine 2F] Incubus: Adonis" }, // prettier-ignore
                    { offset: 0x75e, bit: 4, label: "[Tower of Illusion 1F] Incubus: Croton" }, // prettier-ignore
                    { offset: 0x75e, bit: 5, label: "[Desire Mine 2F] Incubus: Boris" }, // prettier-ignore
                    { offset: 0x75e, bit: 6, label: "[Desire Mine] Leprechaun: Dana" }, // prettier-ignore
                    { offset: 0x75e, bit: 7, label: "[Forest Cave B2] Leprechaun: Tak" }, // prettier-ignore
                    { offset: 0x75f, bit: 0, label: "[Enrich Dungeon B2] Leprechaun: Morgan" }, // prettier-ignore
                    { offset: 0x75f, bit: 1, label: "[Forest of Aborigine] Leprechaun: Kokus" }, // prettier-ignore
                    { offset: 0x75f, bit: 2, label: "[Aborigine Mansion 1F] Leprechaun: Zircon" }, // prettier-ignore
                    { offset: 0x75f, bit: 3, label: "[Mountain Cave] Leprechaun: Mangus" }, // prettier-ignore
                    { offset: 0x75f, bit: 4, label: "[South Shrine B1 South side] Leprechaun: Darbie" }, // prettier-ignore
                    { offset: 0x75f, bit: 5, label: "[East Shrine 3F] Leprechaun: Solo" }, // prettier-ignore
                    { offset: 0x75f, bit: 6, label: "[Mirage Village] Leprechaun: Stilt" }, // prettier-ignore
                    { offset: 0x75f, bit: 7, label: "[Tower of Illusion 5F] Leprechaun: Eric" }, // prettier-ignore
                  ],
                },
              ],
            },
            {
              name: "Options",
              items: [
                {
                  type: "section",
                  flex: true,
                  items: [
                    {
                      name: "Message Speed",
                      offset: 0xba0,
                      type: "variable",
                      dataType: "uint8",
                      resource: "messageSpeeds",
                    },
                    {
                      name: "Sound Mode",
                      offset: 0xba1,
                      type: "variable",
                      dataType: "uint8",
                      resource: "soundModes",
                    },
                  ],
                },
                {
                  type: "section",
                  flex: true,
                  items: [
                    {
                      name: "Window Depth",
                      offset: 0xb9b,
                      type: "variable",
                      dataType: "uint8",
                      max: 2,
                    },
                  ],
                },
                {
                  name: "Window Color",
                  type: "section",
                  flex: true,
                  items: [
                    {
                      name: "Red",
                      offset: 0xb9d,
                      type: "variable",
                      dataType: "uint8",
                      binary: {
                        bitStart: 0,
                        bitLength: 5,
                      },
                      max: 15,
                    },
                    {
                      name: "Green",
                      offset: 0xb9c,
                      type: "variable",
                      dataType: "uint16",
                      bigEndian: true,
                      binary: {
                        bitStart: 5,
                        bitLength: 5,
                      },
                      max: 15,
                    },
                    {
                      name: "Blue",
                      offset: 0xb9c,
                      type: "variable",
                      dataType: "uint8",
                      binary: {
                        bitStart: 2,
                        bitLength: 5,
                      },
                      max: 15,
                    },
                  ],
                },
                {
                  name: "Frame Color",
                  type: "section",
                  flex: true,
                  items: [
                    {
                      name: "Red",
                      offset: 0xb9f,
                      type: "variable",
                      dataType: "uint8",
                      binary: {
                        bitStart: 1,
                        bitLength: 4,
                      },
                      max: 15,
                    },
                    {
                      name: "Green",
                      offset: 0xb9e,
                      type: "variable",
                      dataType: "uint16",
                      bigEndian: true,
                      binary: {
                        bitStart: 6,
                        bitLength: 4,
                      },
                      max: 15,
                    },
                    {
                      name: "Blue",
                      offset: 0xb9e,
                      type: "variable",
                      dataType: "uint8",
                      binary: {
                        bitStart: 3,
                        bitLength: 4,
                      },
                      max: 15,
                    },
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
    characters: {
      0x0: "Arthur",
      0x1: "Melody",
      0x2: "Rodi",
      0x3: "Basso",
      0x4: "Akane",
      0x5: "Forte",
      0x6: "Doyle",
      0x7: "Lisa",
    },
    commands: {
      0x0: "Manual",
      0x1: "Auto",
    },
    formations: {
      0x0: "-",
      0x1: "Reserve Team",
      0x3: "Lead Team",
    },
    itemStatus: {
      0x0: "-",
      0x1: "Broken",
      0x2: "Equipped",
      0x3: "Broken + Equipped",
    },
    items: {
      0x0: "Dagger",
      0x1: "Shoto",
      0x2: "Daito",
      0x3: "Broadsword",
      0x4: "Kotetsu",
      0x5: "Kikuichimonji",
      0x6: "Masamune",
      0x7: "Kusanagi",
      0x8: "Muramasa",
      0x9: "Short Sword",
      0xa: "Middle Sword",
      0xb: "Long Sword",
      0xc: "Steel Sword",
      0xd: "Broad Sword",
      0xe: "Buster Sword",
      0xf: "Sacred Sword",
      0x10: "Great Sword",
      0x11: "Force Blade",
      0x12: "Shining Sword",
      0x13: "Dark Sword",
      0x14: "Middle Axe",
      0x15: "Power Axe",
      0x16: "Battle Axe",
      0x17: "Great Axe",
      0x18: "Heat Axe",
      0x19: "Runic Axe",
      0x1a: "Dragon Axe",
      0x1b: "Demon Axe",
      0x1c: "Wooden Staff",
      0x1d: "Bronze Staff",
      0x1e: "Iron Staff",
      0x1f: "Power Staff",
      0x20: "Magic Wand",
      0x21: "Amulet Staff",
      0x22: "Saint Ankh",
      0x23: "Rage Wand",
      0x24: "Mystery Ankh",
      0x25: "Demon Staff",
      0x26: "Iron Claw",
      0x27: "Power Claw",
      0x28: "Battle Claw",
      0x29: "Mithril Claw",
      0x2a: "Demon Claw",
      0x2b: "Ring Mail",
      0x2c: "Scale Mail",
      0x2d: "Chain Mail",
      0x2e: "Bronze Armor",
      0x2f: "Iron Armor",
      0x30: "Steel Armor",
      0x31: "Battle Armor",
      0x32: "Mithril Mail",
      0x33: "Dragon Mail",
      0x34: "Shining Mail",
      0x35: "Haunted Mail",
      0x36: "Silk Robe",
      0x37: "Feather Robe",
      0x38: "Leather Robe",
      0x39: "Druid's Robe",
      0x3a: "Fairy's Robe",
      0x3b: "Magical Robe",
      0x3c: "Hermit's Robe",
      0x3d: "Saint's Robe",
      0x3e: "Merlin's Robe",
      0x3f: "Angel's Robe",
      0x40: "Demon's Robe",
      0x41: "Leather Suit",
      0x42: "Scale Suit",
      0x43: "Chain Suit",
      0x44: "Steel Suit",
      0x45: "Disguise",
      0x46: "Kasumi Attire",
      0x47: "Hayate Attire",
      0x48: "Dragon Suit",
      0x49: "Leather Shell",
      0x4a: "Bronze Shell",
      0x4b: "Iron Shell",
      0x4c: "Battle Armor",
      0x4d: "Breast Plate",
      0x4e: "Mirror Plate",
      0x4f: "Spike Shell",
      0x50: "Holy Plate",
      0x51: "Dragon Shell",
      0x52: "Force Shell",
      0x53: "Leather Brace",
      0x54: "Bronze Brace",
      0x55: "Iron Brace",
      0x56: "Power Brace",
      0x57: "Battle Brace",
      0x58: "Gauntlet",
      0x59: "Shield Brace",
      0x5a: "War Brace",
      0x5b: "Runic Brace",
      0x5c: "Strike Sleeve",
      0x5d: "Dragon Sleeve",
      0x5e: "Small Shield",
      0x5f: "Middle Shield",
      0x60: "Large Shield",
      0x61: "Power Shield",
      0x62: "Knight Shield",
      0x63: "Sacred Mirror",
      0x64: "Great Shield",
      0x65: "Force Shield",
      0x66: "Mesh Glove",
      0x67: "Leather Glove",
      0x68: "Chain Glove",
      0x69: "Steel Glove",
      0x6a: "Shinobi Glove",
      0x6b: "Onmitsu Glove",
      0x6c: "Spike Glove",
      0x6d: "Iga Glove",
      0x6e: "Holy Circlet",
      0x6f: "Iron Circlet",
      0x70: "Steel Circlet",
      0x71: "Silver Tiara",
      0x72: "Shield Tiara",
      0x73: "Golden Tiara",
      0x74: "Magic Circlet",
      0x75: "Mithril Circlet",
      0x76: "Royal Circlet",
      0x77: "Demon Crown",
      0x78: "Iron Helmet",
      0x79: "Iron Mask",
      0x7a: "Steel Helmet",
      0x7b: "Shinobi Helm",
      0x7c: "Gold Helmet",
      0x7d: "Goblin Helmet",
      0x7e: "Fuma's Helmet",
      0x7f: "Demon's Mask",
      0x80: "Power Ring",
      0x81: "Shield Ring",
      0x82: "Magic Ring",
      0x83: "Artemis Ring",
      0x84: "Mars Chain",
      0x85: "Attack Ring",
      0x86: "Master Ring",
      0x87: "Wisdom Ring",
      0x88: "Warrior Knife",
      0x89: "Slash Dagger",
      0x8a: "Haste Ring",
      0x8b: "Royal Crest",
      0x8c: "Life Ring",
      0x8d: "Dragon Orb",
      0x8e: "Evil Ring",
      0x8f: "Holy Crest",
      0x90: "Holy Pendant",
      0x91: "Elemental Orb",
      0x92: "Evil Orb",
      0x93: "Turbo Boots",
      0x94: "Energy Bread",
      0x95: "Magic Nectar",
      0x96: "Power Juice",
      0x97: "Protect Milk",
      0x98: "Quick Chicken",
      0x99: "Critical Juice",
      0x9a: "Lucky Cookie",
      0x9b: "Arcane Garlic",
      0x9c: "Stamina Onion",
      0x9d: "Brave Apple",
      0x9e: "Herb",
      0x9f: "Potion",
      0xa0: "Elixir",
      0xa1: "Holy Rain",
      0xa2: "Goddess Tears",
      0xa3: "Light Of Hope",
      0xa4: "Antidote Herb",
      0xa5: "Fairy Powder",
      0xa6: "Angel Wing",
      0xa7: "Life Candle",
      0xa8: "Mithril Ore",
      0xa9: "Mithril Ingot",
      0xaa: "Snake Crest",
      0xab: "Goat Crest",
      0xac: "Eagle Crest",
      0xad: "Gold Key",
      0xae: "Crystal Key",
      0xaf: "Turtle Snacks",
      0xb0: "Old Key",
      0xb1: "Holy Water",
      0xb2: "Arcane Book",
      0xb3: "Clock Key",
      0xb4: "Magic Mattock",
      0xb5: "Gravity Stone",
      0xb6: "Stone Key",
      0xb7: "Aquamarine",
      0xb8: "Black Onyx",
      0xb9: "Opal",
      0xba: "Ruby",
      0xbb: "Sapphire",
      0xbc: "Emerald",
      0xbd: "Diamond",
      0xbe: "Eyes Of Truth",
      0xbf: "Crystal Scale",
      0xc0: "Crystal Eyes",
      0xc1: "Crystal Guard",
      0xc2: "Crystal Staff",
      0xc3: "Crystal Jug (filled)",
      0xc4: "Lunard Shard",
      0xc5: "Solar Shard",
      0xc6: "Red Dagger",
      0xc7: "Aladdin Lamp",
      0xc8: "Crystal Jug",
      0xc9: "Squeaksandals",
      0xca: "Pixie Bell",
      0xcb: "Cygnus Mallet",
      0xcc: "Giant Bomb",
      0xcd: "Shark Fins",
      0xce: "Treasure Box",
      0xcf: "Courage Suit",
      0xd0: "Vigor Scarf",
      0xd1: "Spike Shield",
      0xfff: "-",
    },
    letters: {
      0x20: " ",
      0x21: "!",
      0x23: "#",
      0x26: "&",
      0x27: "'",
      0x2b: "+",
      0x2c: ",",
      0x2e: ".",
      0x2f: "/",
      0x30: "0",
      0x31: "1",
      0x32: "2",
      0x33: "3",
      0x34: "4",
      0x35: "5",
      0x36: "6",
      0x37: "7",
      0x38: "8",
      0x39: "9",
      0x3a: ":",
      0x3b: ";",
      0x3f: "?",
      0x41: "A",
      0x42: "B",
      0x43: "C",
      0x44: "D",
      0x45: "E",
      0x46: "F",
      0x47: "G",
      0x48: "H",
      0x49: "I",
      0x4a: "J",
      0x4b: "K",
      0x4c: "L",
      0x4d: "M",
      0x4e: "N",
      0x4f: "O",
      0x50: "P",
      0x51: "Q",
      0x52: "R",
      0x53: "S",
      0x54: "T",
      0x55: "U",
      0x56: "V",
      0x57: "W",
      0x58: "X",
      0x59: "Y",
      0x5a: "Z",
      0x61: "a",
      0x62: "b",
      0x63: "c",
      0x64: "d",
      0x65: "e",
      0x66: "f",
      0x67: "g",
      0x68: "h",
      0x69: "i",
      0x6a: "j",
      0x6b: "k",
      0x6c: "l",
      0x6d: "m",
      0x6e: "n",
      0x6f: "o",
      0x70: "p",
      0x71: "q",
      0x72: "r",
      0x73: "s",
      0x74: "t",
      0x75: "u",
      0x76: "v",
      0x77: "w",
      0x78: "x",
      0x79: "y",
      0x7a: "z",
      0x86: "を",
      0x87: "ぁ",
      0x88: "ぃ",
      0x89: "ぅ",
      0x8a: "ぇ",
      0x8b: "ぉ",
      0x8c: "ゃ",
      0x8d: "ゅ",
      0x8e: "ょ",
      0x8f: "っ",
      0x91: "あ",
      0x92: "い",
      0x93: "う",
      0x94: "え",
      0x95: "お",
      0x96: "か",
      0x97: "き",
      0x98: "く",
      0x99: "け",
      0x9a: "こ",
      0x9b: "さ",
      0x9c: "し",
      0x9d: "す",
      0x9e: "せ",
      0x9f: "そ",
      0xa1: "。",
      0xa4: "、",
      0xa6: "ヲ",
      0xa7: "ァ",
      0xa8: "ィ",
      0xa9: "ゥ",
      0xaa: "ェ",
      0xab: "ォ",
      0xac: "ャ",
      0xad: "ュ",
      0xae: "ョ",
      0xaf: "ッ",
      0xb0: "ー",
      0xb1: "ア",
      0xb2: "イ",
      0xb3: "ウ",
      0xb4: "エ",
      0xb5: "オ",
      0xb6: "カ",
      0xb7: "キ",
      0xb8: "ク",
      0xb9: "ケ",
      0xba: "コ",
      0xbb: "サ",
      0xbc: "シ",
      0xbd: "ス",
      0xbe: "セ",
      0xbf: "ソ",
      0xc0: "タ",
      0xc1: "チ",
      0xc2: "ツ",
      0xc3: "テ",
      0xc4: "ト",
      0xc5: "ナ",
      0xc6: "ニ",
      0xc7: "ヌ",
      0xc8: "ネ",
      0xc9: "ノ",
      0xca: "ハ",
      0xcb: "ヒ",
      0xcc: "フ",
      0xcd: "ヘ",
      0xce: "ホ",
      0xcf: "マ",
      0xd0: "ミ",
      0xd1: "ム",
      0xd2: "メ",
      0xd3: "モ",
      0xd4: "ヤ",
      0xd5: "ユ",
      0xd6: "ヨ",
      0xd7: "ラ",
      0xd8: "リ",
      0xd9: "ル",
      0xda: "レ",
      0xdb: "ロ",
      0xdc: "ワ",
      0xdd: "ン",
      0xde: "゛",
      0xdf: "°",
      0xe0: "た",
      0xe1: "ち",
      0xe2: "つ",
      0xe3: "て",
      0xe4: "と",
      0xe5: "な",
      0xe6: "に",
      0xe7: "ぬ",
      0xe8: "ね",
      0xe9: "の",
      0xea: "は",
      0xeb: "ひ",
      0xec: "ふ",
      0xed: "へ",
      0xee: "ほ",
      0xef: "ま",
      0xf0: "み",
      0xf1: "む",
      0xf2: "め",
      0xf3: "も",
      0xf4: "や",
      0xf5: "ゆ",
      0xf6: "よ",
      0xf7: "ら",
      0xf8: "り",
      0xf9: "る",
      0xfa: "れ",
      0xfb: "ろ",
      0xfc: "わ",
      0xfd: "ん",
    },
    messageSpeeds: {
      0x0: "Turbo",
      0x1: "Fast",
      0x2: "Normal",
      0x3: "Slow",
    },
    soundModes: {
      0x0: "Stereo",
      0x1: "Mono",
    },
    spells: {
      0x0: "Blaze",
      0x1: "Freeze",
      0x2: "Spark",
      0x3: "Hell Blast",
      0x4: "Inferno",
      0x5: "Elemental",
      0x6: "Brutal Fire",
      0x7: "Lightning",
      0x8: "Weasel Slash",
      0x9: "Support",
      0xa: "Slow",
      0xb: "Attack",
      0xc: "Elude",
      0xd: "Confuse",
      0xe: "Sleep",
      0xf: "Soul Steal",
      0x10: "Anti-Spell",
      0x11: "Shield",
      0x12: "Barrier",
      0x13: "Negate",
      0x14: "Swift Wind",
      0x15: "Spider Thread",
      0x16: "Ferocity",
      0x17: "Ayakashi",
      0x18: "Madness",
      0x19: "Illusion",
      0x1a: "Spiritual",
      0x1b: "Talisman",
      0x1c: "God's Wind",
      0x1d: "Heal",
      0x1e: "Aura",
      0x1f: "Restore",
      0x20: "Raise",
      0x21: "Antidote",
      0x22: "Healing",
      0x23: "Praying",
      0x24: "Revival",
      0x25: "Antidote",
      0x26: "Return",
      0x27: "Suppress",
      0xff: "-",
    },
  },
  resourcesOrder: {
    items: [0xfff],
    messageSpeeds: [0x3, 0x2, 0x1, 0x0],
    soundModes: [0x1, 0x0],
    spells: [0xff],
  },
};

export default template;
