import type { GameJson } from "$lib/types";

const template: GameJson = {
  validator: {
    regions: {
      europe_usa_japan: {},
    },
    text: "Drag 'n' drop here or click to add a save file.",
    hint: "If you're having trouble loading a save file from an Everdrive cartridge, please see the FAQ.",
    error: "Not a valid save file.",
  },
  items: [
    {
      id: "slots",
      length: 0x78,
      type: "container",
      instanceType: "tabs",
      instances: 3,
      enumeration: "Slot %d",
      disableSubinstanceIf: {
        $or: [
          {
            offset: 0x0,
            type: "variable",
            dataType: "uint8",
            operator: "=",
            value: 0x0,
          },
          {
            offset: 0x0,
            type: "variable",
            dataType: "uint8",
            operator: "=",
            value: 0xff,
          },
        ],
      },
      items: [
        {
          name: "Checksum",
          offset: 0x74,
          type: "checksum",
          dataType: "uint32",
          bigEndian: true,
          control: {
            offsetStart: 0x0,
            offsetEnd: 0x74,
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
                      name: "Slot",
                      offset: 0x1,
                      type: "variable",
                      dataType: "uint8",
                      hidden: true,
                    },
                    {
                      name: "Progression",
                      offset: 0x5f,
                      type: "variable",
                      dataType: "bit",
                      bit: 4,
                      resource: "progressions",
                    },
                    {
                      name: "Playtime",
                      type: "group",
                      mode: "time",
                      items: [
                        {
                          id: "playtime",
                          offset: 0x2a,
                          type: "variable",
                          dataType: "uint16",
                          bigEndian: true,
                          operations: [
                            {
                              convert: { from: "seconds", to: "hours" },
                            },
                          ],
                          max: 17,
                          disabled: true,
                        },
                        {
                          id: "playtime",
                          offset: 0x2a,
                          type: "variable",
                          dataType: "uint16",
                          bigEndian: true,
                          operations: [
                            {
                              convert: {
                                from: "seconds",
                                to: "minutes",
                              },
                            },
                          ],
                          leadingZeros: 1,
                          max: 59,
                          disabled: true,
                        },
                        {
                          id: "playtime",
                          offset: 0x2a,
                          type: "variable",
                          dataType: "uint16",
                          bigEndian: true,
                          operations: [
                            {
                              convert: {
                                from: "seconds",
                                to: "seconds",
                              },
                            },
                          ],
                          leadingZeros: 1,
                          max: 59,
                          disabled: true,
                        },
                      ],
                    },
                    {
                      id: "totalJiggies",
                      name: "Total Jiggies",
                      offset: 0x2,
                      type: "variable",
                      dataType: "uint8",
                      disabled: true,
                    },
                    {
                      id: "totalNotes",
                      name: "Total Notes",
                      offset: 0x22,
                      type: "variable",
                      dataType: "uint8",
                      disabled: true,
                    },
                  ],
                },
                {
                  type: "section",
                  flex: true,
                  items: [
                    {
                      name: "Jiggies",
                      offset: 0x69,
                      type: "variable",
                      dataType: "uint8",
                      max: 100,
                    },
                    {
                      name: "Mumbo Tokens",
                      offset: 0x65,
                      type: "variable",
                      dataType: "uint8",
                      max: 116,
                    },
                  ],
                },
                {
                  type: "section",
                  flex: true,
                  items: [
                    {
                      name: "Health",
                      offset: 0x57,
                      type: "variable",
                      dataType: "bit",
                      bit: 1,
                      resource: "health",
                    },
                    {
                      name: "Eggs",
                      type: "group",
                      mode: "fraction",
                      items: [
                        {
                          id: "eggs",
                          offset: 0x66,
                          type: "variable",
                          dataType: "uint8",
                        },
                        {
                          id: "maxEggs",
                          offset: 0x57,
                          type: "variable",
                          dataType: "bit",
                          bit: 6,
                          resource: "eggs",
                        },
                      ],
                    },
                    {
                      name: "Red Feathers",
                      type: "group",
                      mode: "fraction",
                      items: [
                        {
                          id: "redFeathers",
                          offset: 0x67,
                          type: "variable",
                          dataType: "uint8",
                        },
                        {
                          id: "maxRedFeathers",
                          offset: 0x57,
                          type: "variable",
                          dataType: "bit",
                          bit: 7,
                          resource: "redFeathers",
                        },
                      ],
                    },
                    {
                      name: "Gold Feathers",
                      type: "group",
                      mode: "fraction",
                      items: [
                        {
                          id: "goldFeathers",
                          offset: 0x68,
                          type: "variable",
                          dataType: "uint8",
                        },
                        {
                          id: "maxGoldFeathers",
                          offset: 0x58,
                          type: "variable",
                          dataType: "bit",
                          bit: 0,
                          resource: "goldFeathers",
                        },
                      ],
                    },
                    {
                      name: "Notes (Placeholder)",
                      offset: 0x22,
                      length: 0x8,
                      type: "variable",
                      dataType: "string",
                      letterDataType: "uint8",
                      hidden: true,
                    },
                  ],
                },
              ],
            },
            {
              name: "Levels",
              items: [
                {
                  type: "tabs",
                  vertical: true,
                  items: [
                    {
                      name: "Spiral Mountain",
                      items: [
                        {
                          type: "section",
                          flex: true,
                          items: [
                            {
                              name: "Playtime",
                              type: "group",
                              mode: "time",
                              items: [
                                {
                                  offset: 0x3e,
                                  type: "variable",
                                  dataType: "uint16",
                                  bigEndian: true,
                                  operations: [
                                    {
                                      convert: { from: "seconds", to: "hours" },
                                    },
                                  ],
                                  max: 17,
                                },
                                {
                                  offset: 0x3e,
                                  type: "variable",
                                  dataType: "uint16",
                                  bigEndian: true,
                                  operations: [
                                    {
                                      convert: {
                                        from: "seconds",
                                        to: "minutes",
                                      },
                                    },
                                  ],
                                  leadingZeros: 1,
                                  max: 59,
                                },
                                {
                                  offset: 0x3e,
                                  type: "variable",
                                  dataType: "uint16",
                                  bigEndian: true,
                                  operations: [
                                    {
                                      convert: {
                                        from: "seconds",
                                        to: "seconds",
                                      },
                                    },
                                  ],
                                  leadingZeros: 1,
                                  max: 59,
                                  test: true,
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
                              name: "Extra Honeycombs",
                              type: "bitflags",
                              flags: [
                                { offset: 0x11, bit: 0, label: "Beak Barge Zone" },
                                { offset: 0x11, bit: 3, label: "Jump Zone" },
                                { offset: 0x11, bit: 4, label: "Near waterfall" },
                                { offset: 0x11, bit: 5, label: "Underwater" },
                                { offset: 0x11, bit: 6, label: "Above a tree" },
                                { offset: 0x11, bit: 7, label: "Attack Zone" },
                              ],
                            },
                          ],
                        },
                      ],
                    },
                    {
                      name: "Gruntilda's Lair",
                      items: [
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
                                      name: "Playtime",
                                      type: "group",
                                      mode: "time",
                                      items: [
                                        {
                                          offset: 0x34,
                                          type: "variable",
                                          dataType: "uint16",
                                          bigEndian: true,
                                          operations: [
                                            {
                                              convert: {
                                                from: "seconds",
                                                to: "hours",
                                              },
                                            },
                                          ],
                                          max: 17,
                                        },
                                        {
                                          offset: 0x34,
                                          type: "variable",
                                          dataType: "uint16",
                                          bigEndian: true,
                                          operations: [
                                            {
                                              convert: {
                                                from: "seconds",
                                                to: "minutes",
                                              },
                                            },
                                          ],
                                          leadingZeros: 1,
                                          max: 59,
                                        },
                                        {
                                          offset: 0x34,
                                          type: "variable",
                                          dataType: "uint16",
                                          bigEndian: true,
                                          operations: [
                                            {
                                              convert: {
                                                from: "seconds",
                                                to: "seconds",
                                              },
                                            },
                                          ],
                                          leadingZeros: 1,
                                          max: 59,
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
                                      name: "Jiggies",
                                      type: "bitflags",
                                      flags: [
                                        { offset: 0x8, bit: 3, label: "Entrance" },
                                        { offset: 0x8, bit: 4, label: "Witch Switch of Mumbo's Mountain" },
                                        { offset: 0x8, bit: 6, label: "Witch Switch of Treasure Trove Cove" },
                                        { offset: 0x8, bit: 5, label: "Witch Switch of Clanker's Cavern" },
                                        { offset: 0x8, bit: 7, label: "Witch Switch of Bubblegloop Swamp" },
                                        { offset: 0x8, bit: 0, label: "Witch Switch of Freezeezy Peak" },
                                        { offset: 0x9, bit: 2, label: "Witch Switch of Gobi's Valley" },
                                        { offset: 0x9, bit: 1, label: "Witch Switch of Mad Monster Mansion" },
                                        { offset: 0x9, bit: 3, label: "Witch Switch of Rusty Bucket Bay" },
                                        { offset: 0x9, bit: 4, label: "Witch Switch of Click Clock Wood" },
                                      ],
                                    },
                                    {
                                      name: "Mumbo Tokens",
                                      type: "bitflags",
                                      flags: [
                                        { offset: 0x1c, bit: 0, label: "At a tunnel to the Click Clock Wood area" },
                                        { offset: 0x1c, bit: 1, label: "Behind the purple cauldron on first floor" },
                                        { offset: 0x1c, bit: 2, label: "Near the Clock Clock Wood puzzle" },
                                        { offset: 0x1c, bit: 3, label: "Near the red cauldron on second floor" },
                                        { offset: 0x1c, bit: 4, label: "Above the entrance of Clanker's Cavern" },
                                        { offset: 0x1c, bit: 5, label: "Behind a sarcophagus in the Gobi's Valley area" },
                                        { offset: 0x1c, bit: 6, label: "On a window of the advent calendar on the Freezeezy Peak area" },
                                        { offset: 0x1c, bit: 7, label: "Behind Mumbo in the crypt" },
                                        { offset: 0x1d, bit: 1, label: "Near the Rusty Bucket Bay entrance" },
                                        { offset: 0x1d, bit: 2, label: "Near the Mad Monster Mansion puzzle" },
                                      ],
                                    },
                                  ],
                                },
                              ],
                            },
                            {
                              name: "Miscellaneous",
                              items: [
                                {
                                  type: "section",
                                  flex: true,
                                  items: [
                                    {
                                      name: "Jiggies on Gruntilda Puzzle",
                                      offset: 0x4f,
                                      type: "variable",
                                      dataType: "uint8",
                                      binary: {
                                        bitStart: 2,
                                        bitLength: 5,
                                      },
                                      max: 25,
                                    },
                                    {
                                      name: "Jiggies on Honeycomb Puzzle",
                                      offset: 0x4f,
                                      type: "variable",
                                      dataType: "uint16",
                                      binary: {
                                        bitStart: 7,
                                        bitLength: 3,
                                      },
                                      max: 4,
                                    },
                                  ],
                                },
                                {
                                  type: "section",
                                  flex: true,
                                  items: [
                                    {
                                      name: "Notes Doors",
                                      type: "bitflags",
                                      flags: [
                                        { offset: 0x47, bit: 2, label: "50 Notes Door unlocked" },
                                        { offset: 0x47, bit: 3, label: "180 Notes Door unlocked" },
                                        { offset: 0x47, bit: 4, label: "260 Notes Door unlocked" },
                                        { offset: 0x47, bit: 5, label: "350 Notes Door unlocked" },
                                        { offset: 0x47, bit: 6, label: "450 Notes Door unlocked" },
                                        { offset: 0x47, bit: 7, label: "640 Notes Door unlocked" },
                                        { offset: 0x48, bit: 0, label: "765 Notes Door unlocked" },
                                        { offset: 0x48, bit: 1, label: "810 Notes Door unlocked" },
                                        { offset: 0x48, bit: 2, label: "828 Notes Door unlocked" },
                                        { offset: 0x48, bit: 3, label: "846 Notes Door unlocked" },
                                        { offset: 0x48, bit: 4, label: "864 Notes Door unlocked" },
                                        { offset: 0x48, bit: 5, label: "882 Notes Door unlocked" },
                                      ],
                                    },
                                    {
                                      name: "Magic Cauldrons",
                                      type: "bitflags",
                                      flags: [
                                        { offset: 0x49, bit: 1, label: "Purple cauldron to Treasure Trove Cove puzzle area" },
                                        { offset: 0x49, bit: 2, label: "Purple cauldron to cobwebs area", separator: true },
                                        { offset: 0x49, bit: 3, label: "Green cauldron to cobwebs area" },
                                        { offset: 0x49, bit: 4, label: "Green cauldron to Rusty Bucket Bay area", separator: true },
                                        { offset: 0x49, bit: 5, label: "Orange cauldron to pipe room" },
                                        { offset: 0x49, bit: 6, label: "Orange cauldron to Click Clock Wood area", separator: true },
                                        { offset: 0x4a, bit: 1, label: "Yellow cauldron to Grunty Furnace Fun" },
                                        { offset: 0x4a, bit: 2, label: "Yellow cauldron to final area" },
                                        { offset: 0x5e, bit: 5, label: "Dialog when making a Magic Cauldron short cut", hidden: true },
                                      ],
                                    },
                                    {
                                      name: "Events",
                                      type: "bitflags",
                                      flags: [
                                        { offset: 0x57, bit: 5, label: "Location visited", hidden: true },
                                        { offset: 0x55, bit: 5, label: "BLUEEGGS cheat given by Cheato" },
                                        { offset: 0x55, bit: 6, label: "REDFEATHERS cheat given by Cheato" },
                                        { offset: 0x55, bit: 7, label: "GOLDFEATHERS cheat given by Cheato" },
                                        { offset: 0x52, bit: 7, label: "Gruntilda's dialogue when entrance in her lair", hidden: true },
                                        { offset: 0x54, bit: 7, label: "Bottles' dialog when near of a puzzle", hidden: true },
                                        { offset: 0x42, bit: 7, label: "Bottles' dialog explaining how to place a Jiggy in a puzzle", hidden: true },
                                        { offset: 0x42, bit: 6, label: "Bottles' dialog explaining how to complete puzzles", hidden: true },
                                        { offset: 0x5b, bit: 7, label: "Bottles' dialog explaining how to remove a Jiggy from puzzle", hidden: true },
                                        { offset: 0x5c, bit: 0, label: "Bottles' dialog explaining how to place all Jiggies into a puzzle", hidden: true },
                                        { offset: 0x53, bit: 1, label: "Bottles' dialog explaining about notes outside a world", hidden: true },
                                        { offset: 0x58, bit: 1, label: "Gruntilda's dialog explaining about monsters appearance once world door unlocked", hidden: true },
                                        { offset: 0x4b, bit: 4, label: "First Note Door open related", hidden: true },
                                        { offset: 0x53, bit: 0, label: "First Note Door open related", hidden: true },
                                        { offset: 0x5a, bit: 3, label: "First Note Door open related (time? / seed?)", hidden: true },
                                        { offset: 0x5a, bit: 4, label: "First Note Door open related (time? / seed?)", hidden: true },
                                        { offset: 0x5a, bit: 5, label: "First Note Door open related (time? / seed?)", hidden: true },
                                        { offset: 0x5a, bit: 6, label: "First Note Door open related (time? / seed?)", hidden: true },
                                        { offset: 0x5a, bit: 7, label: "First Note Door open related (time? / seed?)", hidden: true },
                                        { offset: 0x5b, bit: 0, label: "First Note Door open related (time? / seed?)", hidden: true },
                                        { offset: 0x5b, bit: 1, label: "First Note Door open related (time? / seed?)", hidden: true },
                                        { offset: 0x5b, bit: 2, label: "First Note Door open related (time? / seed?)", hidden: true },
                                        { offset: 0x52, bit: 6, label: "Brentilda's dialogue after meeting here", hidden: true },
                                        { offset: 0x5d, bit: 1, label: "Healed by Brentilda at the Treasure Trove Cove puzzle area", hidden: true },
                                        { offset: 0x5e, bit: 2, label: "Healed by Brentilda at the Clanker's Cavern area", hidden: true },
                                        { offset: 0x5d, bit: 7, label: "Healed by Brentilda behind the giant Gruntilda statue", hidden: true },
                                        { offset: 0x5d, bit: 3, label: "Healed by Brentilda at the Bubblegloop Swamp area", hidden: true },
                                        { offset: 0x5d, bit: 6, label: "Healed by Brentilda at the Gobi's Valley area", hidden: true },
                                        { offset: 0x5d, bit: 4, label: "Healed by Brentilda at the cobwebs area", hidden: true },
                                        { offset: 0x5d, bit: 5, label: "Healed by Brentilda at the lava area", hidden: true },
                                        { offset: 0x5e, bit: 1, label: "Healed by Brentilda at the Mad Monster Mansion area", hidden: true },
                                        { offset: 0x5d, bit: 2, label: "Healed by Brentilda at the Click Clock Wood puzzle area", hidden: true },
                                        { offset: 0x5e, bit: 0, label: "Healed by Brentilda at the Click Clock Wood area", hidden: true },
                                        { offset: 0x53, bit: 3, label: "Eyes of the floor portrait raised" },
                                        { offset: 0x53, bit: 4, label: "Left eye of the floor portrait pushed down" },
                                        { offset: 0x53, bit: 5, label: "Right eye of the floor portrait pushed down" },
                                        { offset: 0x43, bit: 7, label: "First pipe to Clanker's Cavern raised" },
                                        { offset: 0x44, bit: 0, label: "Second pipe to Clanker's Cavern raised" },
                                        { offset: 0x44, bit: 1, label: "Pipe to trap button raised" },
                                        { offset: 0x43, bit: 6, label: "Trap leading to Bubblegloop Swamp open" },
                                        { offset: 0x49, bit: 0, label: "Freezeezy Peak area: Top right window open" },
                                        { offset: 0x54, bit: 1, label: "Hat of Gruntilda's head statue broken" },
                                        { offset: 0x58, bit: 3, label: "Ice boulder near Freezeezy Peak puzzle destroyed", hidden: true },
                                        { offset: 0x58, bit: 6, label: "<b>Gobi's Valley area:</b> Animation of activation of Shock Spring Pads around the big urn", hidden: true },
                                        { offset: 0x58, bit: 7, label: "Shock Spring Pads around the big urn of Gobi's Valley area activated" },
                                        { offset: 0x59, bit: 0, label: "<b>Gobi's Valley area:</b> Right wall destroyed", hidden: true },
                                        { offset: 0x59, bit: 1, label: "<b>Gobi's Valley area:</b> Left wall destroyed", hidden: true },
                                        { offset: 0x54, bit: 2, label: "<b>Gobi's Valley area:</b> Sarcophagus open", hidden: true },
                                        { offset: 0x58, bit: 4, label: "<b>Cobwebs area:</b> Left eye of Gruntilda statue broken", hidden: true },
                                        { offset: 0x59, bit: 2, label: "<b>Cobwebs area:</b> Cobweb to Purple Magic Cauldron destroyed", hidden: true },
                                        { offset: 0x59, bit: 3, label: "<b>Cobwebs area:</b> Cobweb to Flight Pad destroyed", hidden: true },
                                        { offset: 0x59, bit: 4, label: "<b>Cobwebs area:</b> Cobweb to Green Magic Cauldron destroyed", hidden: true },
                                        { offset: 0x54, bit: 5, label: "<b>Mad Monster Mansion area:</b> Gate to the crypt destroyed", hidden: true },
                                        { offset: 0x5e, bit: 7, label: "<b>Mad Monster Mansion area:</b> Mumbo's dialog when tranform back into pumpkin", hidden: true },
                                        { offset: 0x53, bit: 6, label: "<b>Mad Monster Mansion area:</b> Lid of the coffin destroyed", hidden: true },
                                        { offset: 0x58, bit: 2, label: "Grate to Rusty Bucket Bay puzzle destroyed", hidden: true },
                                        { offset: 0x58, bit: 5, label: "<b>Rusty Bucket Bay area:</b> Rareware crate destroyed", hidden: true },
                                        { offset: 0x44, bit: 2, label: "<b>Rusty Bucket Bay area:</b> Animation of Water Level 1", hidden: true },
                                        { offset: 0x44, bit: 3, label: "Water Level 1 of Rusty Bucket Bay area raised" },
                                        { offset: 0x44, bit: 4, label: "<b>Rusty Bucket Bay area:</b> Animation of Water Level 2", hidden: true },
                                        { offset: 0x44, bit: 5, label: "Water Level 2 of Rusty Bucket Bay area raised" },
                                        { offset: 0x44, bit: 6, label: "<b>Rusty Bucket Bay area:</b> Animation of Water Level 3 (temporary)", hidden: true },
                                        { offset: 0x44, bit: 7, label: "<b>Rusty Bucket Bay area:</b> Water Level 3 (temporary)", hidden: true },
                                        { offset: 0x59, bit: 5, label: "<b>Rusty Bucket Bay area:</b> Grate behind Rusty Bucket Bay Switch Witch Jiggy destroyed", hidden: true },
                                        { offset: 0x4a, bit: 3, label: "Podium to puzzle of Click Clock Wood activated" },
                                        { offset: 0x4a, bit: 4, label: "Animation of activation of podium to puzzle of Click Clock Wood", hidden: true },
                                        { offset: 0x5e, bit: 4, label: "<b>Grunty's Furnace Fun:</b> Gruntilda's dialog explaining the rules", hidden: true },
                                        { offset: 0x4a, bit: 5, label: "<b>Grunty's Furnace Fun:</b> Gruntilda's dialog about Banjo-Kazooie panels", hidden: true },
                                        { offset: 0x4a, bit: 6, label: "<b>Grunty's Furnace Fun:</b> Gruntilda's dialog about Eyeball panels", hidden: true },
                                        { offset: 0x4a, bit: 7, label: "<b>Grunty's Furnace Fun:</b> Gruntilda's dialog about Note panels", hidden: true },
                                        { offset: 0x4b, bit: 0, label: "<b>Grunty's Furnace Fun:</b> Gruntilda's dialog about Stopwatch panels", hidden: true },
                                        { offset: 0x4b, bit: 1, label: "<b>Grunty's Furnace Fun:</b> Gruntilda's dialog about Gruntilda Panels", hidden: true },
                                        { offset: 0x4b, bit: 2, label: "<b>Grunty's Furnace Fun:</b> Gruntilda's dialog about Skull panels", hidden: true },
                                        { offset: 0x4b, bit: 3, label: "<b>Grunty's Furnace Fun:</b> Gruntilda's dialog about Joker panels", hidden: true },
                                        { offset: 0x54, bit: 6, label: "Grunty's Furnace Fun completed" },
                                        { offset: 0x5e, bit: 6, label: "Gruntilda's dialog about her puzzle", hidden: true },
                                        { offset: 0x5c, bit: 2, label: "Door to Dingpot's room unlocked" },
                                        { offset: 0x5e, bit: 3, label: "Dingpot's dialog", hidden: true },
                                        { offset: 0x59, bit: 7, label: "<b>Top of the Tower:</b> Gruntilda's dialog when entering the area", hidden: true },
                                        { offset: 0x5a, bit: 2, label: "<b>Top of the Tower:</b> Jinjos statues raised", hidden: true },
                                        { offset: 0x5a, bit: 1, label: "<b>Top of the Tower:</b> Jinjos statue broken", hidden: true },
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
                      name: "Mumbo's Mountain",
                      items: [
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
                                      name: "Playtime",
                                      type: "group",
                                      mode: "time",
                                      items: [
                                        {
                                          offset: 0x2a,
                                          type: "variable",
                                          dataType: "uint16",
                                          bigEndian: true,
                                          operations: [
                                            {
                                              convert: {
                                                from: "seconds",
                                                to: "hours",
                                              },
                                            },
                                          ],
                                          max: 17,
                                        },
                                        {
                                          offset: 0x2a,
                                          type: "variable",
                                          dataType: "uint16",
                                          bigEndian: true,
                                          operations: [
                                            {
                                              convert: {
                                                from: "seconds",
                                                to: "minutes",
                                              },
                                            },
                                          ],
                                          leadingZeros: 1,
                                          max: 59,
                                        },
                                        {
                                          offset: 0x2a,
                                          type: "variable",
                                          dataType: "uint16",
                                          bigEndian: true,
                                          operations: [
                                            {
                                              convert: {
                                                from: "seconds",
                                                to: "seconds",
                                              },
                                            },
                                          ],
                                          leadingZeros: 1,
                                          max: 59,
                                        },
                                      ],
                                    },
                                    {
                                      name: "Notes",
                                      offset: 0x22,
                                      type: "variable",
                                      dataType: "uint16",
                                      bigEndian: true,
                                      binary: { bitStart: 8, bitLength: 7 },
                                      max: 100,
                                    },
                                  ],
                                },
                                {
                                  type: "section",
                                  flex: true,
                                  items: [
                                    {
                                      name: "Jiggies",
                                      type: "bitflags",
                                      flags: [
                                        { offset: 0x2, bit: 0, label: "Conga's orange blocks" },
                                        { offset: 0x2, bit: 1, label: "5 Jinjos rescued" },
                                        { offset: 0x2, bit: 2, label: "At the top of the termites nest" },
                                        { offset: 0x2, bit: 3, label: "In the eye of the Mumbo's Skull" },
                                        { offset: 0x2, bit: 4, label: "Feeding Juju" },
                                        { offset: 0x2, bit: 5, label: "Inside a hut of the village" },
                                        { offset: 0x2, bit: 6, label: "At the center of the stone structure" },
                                        { offset: 0x2, bit: 7, label: "On the hill near entrance" },
                                        { offset: 0x3, bit: 1, label: "Give an orange to Chimpy's" },
                                        { offset: 0x3, bit: 2, label: "Conga's Battle" },
                                      ],
                                    },
                                    {
                                      name: "Mumbo Tokens",
                                      type: "bitflags",
                                      flags: [
                                        { offset: 0x12, bit: 1, label: "Near Conga" },
                                        { offset: 0x12, bit: 2, label: "Near the stone structure" },
                                        { offset: 0x12, bit: 3, label: "Near Mumbo's Skull" },
                                        { offset: 0x12, bit: 4, label: "Near entrance" },
                                        { offset: 0x12, bit: 5, label: "Inside the termites nest" },
                                      ],
                                    },
                                    {
                                      name: "Extra Honeycombs",
                                      type: "bitflags",
                                      flags: [
                                        { offset: 0xf, bit: 1, label: "Near the entrance, above the water" },
                                        { offset: 0xf, bit: 2, label: "At the top of Juju" },
                                      ],
                                    },
                                  ],
                                },
                              ],
                            },
                            {
                              name: "Miscellaneous",
                              items: [
                                {
                                  type: "section",
                                  flex: true,
                                  items: [
                                    {
                                      name: "Jiggies on World Puzzle",
                                      offset: 0x4b,
                                      type: "variable",
                                      dataType: "bit",
                                      bit: 5,
                                    },
                                  ],
                                },
                                {
                                  name: "Events",
                                  type: "bitflags",
                                  flags: [
                                    { offset: 0x45, bit: 0, label: "World door unlocking animation", hidden: true },
                                    { offset: 0x46, bit: 1, label: "World door unlocked" },
                                    { offset: 0x56, bit: 0, label: "Location visited", hidden: true },
                                    { offset: 0x43, bit: 0, label: "Witch Switch activated" },
                                    { offset: 0x52, bit: 0, label: "Mumbo Tokens paid to tranform into a termite" },
                                    { offset: 0x41, bit: 0, label: "Dialog after getting an orange", hidden: true },
                                  ],
                                },
                              ],
                            },
                          ],
                        },
                      ],
                    },
                    {
                      name: "Treasure Trove Cove",
                      items: [
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
                                      name: "Playtime",
                                      type: "group",
                                      mode: "time",
                                      items: [
                                        {
                                          offset: 0x2c,
                                          type: "variable",
                                          dataType: "uint16",
                                          bigEndian: true,
                                          operations: [
                                            {
                                              convert: {
                                                from: "seconds",
                                                to: "hours",
                                              },
                                            },
                                          ],
                                          max: 17,
                                        },
                                        {
                                          offset: 0x2c,
                                          type: "variable",
                                          dataType: "uint16",
                                          bigEndian: true,
                                          operations: [
                                            {
                                              convert: {
                                                from: "seconds",
                                                to: "minutes",
                                              },
                                            },
                                          ],
                                          leadingZeros: 1,
                                          max: 59,
                                        },
                                        {
                                          offset: 0x2c,
                                          type: "variable",
                                          dataType: "uint16",
                                          bigEndian: true,
                                          operations: [
                                            {
                                              convert: {
                                                from: "seconds",
                                                to: "seconds",
                                              },
                                            },
                                          ],
                                          leadingZeros: 1,
                                          max: 59,
                                        },
                                      ],
                                    },
                                    {
                                      name: "Notes",
                                      offset: 0x23,
                                      type: "variable",
                                      dataType: "uint16",
                                      bigEndian: true,
                                      binary: { bitStart: 9, bitLength: 7 },
                                      max: 100,
                                    },
                                  ],
                                },
                                {
                                  type: "section",
                                  flex: true,
                                  items: [
                                    {
                                      name: "Jiggies",
                                      type: "bitflags",
                                      flags: [
                                        { offset: 0x3, bit: 0, label: "Sandcastle password" },
                                        { offset: 0x3, bit: 3, label: "5 Jinjos rescued" },
                                        { offset: 0x3, bit: 4, label: "At the top of the lighthouse" },
                                        { offset: 0x3, bit: 5, label: "Shock Spring Pads path" },
                                        { offset: 0x3, bit: 6, label: "On the backside of the spiral tower" },
                                        { offset: 0x3, bit: 7, label: "At the bottom of a pool of water" },
                                        { offset: 0x4, bit: 1, label: "Golden treasure marks" },
                                        { offset: 0x4, bit: 2, label: "Inside Nipper's Shell" },
                                        { offset: 0x4, bit: 3, label: "Inside a Lockup" },
                                        { offset: 0x4, bit: 4, label: "Captain Blubber's treasures" },
                                      ],
                                    },
                                    {
                                      name: "Mumbo Tokens",
                                      type: "bitflags",
                                      flags: [
                                        { offset: 0x12, bit: 0, label: "Inside a Lockup" },
                                        { offset: 0x12, bit: 6, label: "Inside Captain Blubber's boat" },
                                        { offset: 0x12, bit: 7, label: "Inside a Lockup" },
                                        { offset: 0x13, bit: 1, label: "Underneath the lookout mast of Captain Blubber's boat" },
                                        { offset: 0x13, bit: 2, label: "Behind the door of the lighthouse" },
                                        { offset: 0x13, bit: 3, label: "Above a floating crate below the arch" },
                                        { offset: 0x13, bit: 4, label: "Near Little Lockup" },
                                        { offset: 0x13, bit: 5, label: "At the bottom of a pool of water" },
                                        { offset: 0x13, bit: 6, label: "Above a Shock Spring Jump near Bottles" },
                                        { offset: 0x13, bit: 7, label: "Behind Nipper's shell" },
                                      ],
                                    },
                                    {
                                      name: "Extra Honeycombs",
                                      type: "bitflags",
                                      flags: [
                                        { offset: 0xf, bit: 3, label: "Near Nipper's shell" },
                                        { offset: 0xf, bit: 4, label: "Above a floating crate" },
                                      ],
                                    },
                                  ],
                                },
                              ],
                            },
                            {
                              name: "Miscellaneous",
                              items: [
                                {
                                  type: "section",
                                  flex: true,
                                  items: [
                                    {
                                      name: "Jiggies on World Puzzle",
                                      offset: 0x4b,
                                      type: "variable",
                                      dataType: "uint8",
                                      binary: {
                                        bitStart: 6,
                                        bitLength: 2,
                                      },
                                      max: 2,
                                    },
                                  ],
                                },
                                {
                                  name: "Events",
                                  type: "bitflags",
                                  flags: [
                                    { offset: 0x45, bit: 1, label: "World door unlocking animation", hidden: true },
                                    { offset: 0x46, bit: 2, label: "World door unlocked" },
                                    { offset: 0x56, bit: 2, label: "Location visited", hidden: true },
                                    { offset: 0x43, bit: 2, label: "Witch Switch activated" },
                                    { offset: 0x41, bit: 1, label: "Dialog after getting a Captain Blubber's treasure", hidden: true },
                                    { offset: 0x5f, bit: 2, label: "Gate of sandcastle open", hidden: true },
                                  ],
                                },
                              ],
                            },
                          ],
                        },
                      ],
                    },
                    {
                      name: "Clanker's Cavern",
                      items: [
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
                                      name: "Playtime",
                                      type: "group",
                                      mode: "time",
                                      items: [
                                        {
                                          offset: 0x2e,
                                          type: "variable",
                                          dataType: "uint16",
                                          bigEndian: true,
                                          operations: [
                                            {
                                              convert: {
                                                from: "seconds",
                                                to: "hours",
                                              },
                                            },
                                          ],
                                          max: 17,
                                        },
                                        {
                                          offset: 0x2e,
                                          type: "variable",
                                          dataType: "uint16",
                                          bigEndian: true,
                                          operations: [
                                            {
                                              convert: {
                                                from: "seconds",
                                                to: "minutes",
                                              },
                                            },
                                          ],
                                          leadingZeros: 1,
                                          max: 59,
                                        },
                                        {
                                          offset: 0x2e,
                                          type: "variable",
                                          dataType: "uint16",
                                          bigEndian: true,
                                          operations: [
                                            {
                                              convert: {
                                                from: "seconds",
                                                to: "seconds",
                                              },
                                            },
                                          ],
                                          leadingZeros: 1,
                                          max: 59,
                                        },
                                      ],
                                    },
                                    {
                                      name: "Notes",
                                      offset: 0x23,
                                      type: "variable",
                                      dataType: "uint16",
                                      bigEndian: true,
                                      binary: { bitStart: 2, bitLength: 7 },
                                      max: 100,
                                    },
                                  ],
                                },
                                {
                                  type: "section",
                                  flex: true,
                                  items: [
                                    {
                                      name: "Jiggies",
                                      type: "bitflags",
                                      flags: [
                                        { offset: 0x4, bit: 0, label: "Above Clanker using his tail" },
                                        { offset: 0x4, bit: 5, label: "5 Jinjos rescued" },
                                        { offset: 0x4, bit: 6, label: "Battle against Mutie-Snippets" },
                                        { offset: 0x4, bit: 7, label: "The large key" },
                                        { offset: 0x5, bit: 1, label: "Above Clanker using his bolt" },
                                        { offset: 0x5, bit: 2, label: "In a pipe near Clanker" },
                                        { offset: 0x5, bit: 3, label: "On the Clanker's right golden tooth" },
                                        { offset: 0x5, bit: 4, label: "The ring challenge" },
                                        { offset: 0x5, bit: 5, label: "Near the Witch Switch" },
                                        { offset: 0x5, bit: 6, label: "Near Bottles using Wonderwing" },
                                      ],
                                    },
                                    {
                                      name: "Mumbo Tokens",
                                      type: "bitflags",
                                      flags: [
                                        { offset: 0x13, bit: 0, label: "In a pipe above Clanker" },
                                        { offset: 0x14, bit: 1, label: "Above the entrance pipe" },
                                        { offset: 0x14, bit: 2, label: "In a pipe near Clanker" },
                                        { offset: 0x14, bit: 3, label: "Near a climbing pipe on Clanker's left fin" },
                                        { offset: 0x14, bit: 4, label: "On the Clanker's left golden tooth" },
                                      ],
                                    },
                                    {
                                      name: "Extra Honeycombs",
                                      type: "bitflags",
                                      flags: [
                                        { offset: 0xf, bit: 5, label: "In a vertical pipe underwater" },
                                        { offset: 0xf, bit: 6, label: "Near the orange Jinjo" },
                                      ],
                                    },
                                  ],
                                },
                              ],
                            },
                            {
                              name: "Miscellaneous",
                              items: [
                                {
                                  type: "section",
                                  flex: true,
                                  items: [
                                    {
                                      name: "Jiggies on World Puzzle",
                                      offset: 0x4c,
                                      type: "variable",
                                      dataType: "uint8",
                                      binary: {
                                        bitStart: 0,
                                        bitLength: 3,
                                      },
                                      max: 5,
                                    },
                                  ],
                                },
                                {
                                  name: "Events",
                                  type: "bitflags",
                                  flags: [
                                    { offset: 0x45, bit: 2, label: "World door unlocking animation", hidden: true },
                                    { offset: 0x46, bit: 3, label: "World door unlocked" },
                                    { offset: 0x57, bit: 0, label: "Location visited", hidden: true },
                                    { offset: 0x53, bit: 2, label: "Witch Switch activated" },
                                  ],
                                },
                              ],
                            },
                          ],
                        },
                      ],
                    },
                    {
                      name: "Bubblegloop Swamp",
                      items: [
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
                                      name: "Playtime",
                                      type: "group",
                                      mode: "time",
                                      items: [
                                        {
                                          offset: 0x30,
                                          type: "variable",
                                          dataType: "uint16",
                                          bigEndian: true,
                                          operations: [
                                            {
                                              convert: {
                                                from: "seconds",
                                                to: "hours",
                                              },
                                            },
                                          ],
                                          max: 17,
                                        },
                                        {
                                          offset: 0x30,
                                          type: "variable",
                                          dataType: "uint16",
                                          bigEndian: true,
                                          operations: [
                                            {
                                              convert: {
                                                from: "seconds",
                                                to: "minutes",
                                              },
                                            },
                                          ],
                                          leadingZeros: 1,
                                          max: 59,
                                        },
                                        {
                                          offset: 0x30,
                                          type: "variable",
                                          dataType: "uint16",
                                          bigEndian: true,
                                          operations: [
                                            {
                                              convert: {
                                                from: "seconds",
                                                to: "seconds",
                                              },
                                            },
                                          ],
                                          leadingZeros: 1,
                                          max: 59,
                                        },
                                      ],
                                    },
                                    {
                                      name: "Notes",
                                      offset: 0x24,
                                      type: "variable",
                                      dataType: "uint16",
                                      bigEndian: true,
                                      binary: { bitStart: 3, bitLength: 7 },
                                      max: 100,
                                    },
                                  ],
                                },
                                {
                                  type: "section",
                                  flex: true,
                                  items: [
                                    {
                                      name: "Jiggies",
                                      type: "bitflags",
                                      flags: [
                                        { offset: 0x5, bit: 0, label: "45 seconds race" },
                                        { offset: 0x5, bit: 7, label: "5 Jinjos rescued" },
                                        { offset: 0x6, bit: 0, label: "Mr. Vile game" },
                                        { offset: 0x6, bit: 1, label: "Inside the big egg" },
                                        { offset: 0x6, bit: 2, label: "Feed the Croctus" },
                                        { offset: 0x6, bit: 3, label: "In the highest hut of the treetop area" },
                                        { offset: 0x6, bit: 4, label: "Yellow Flibbits battle" },
                                        { offset: 0x6, bit: 5, label: "10 seconds race" },
                                        { offset: 0x6, bit: 6, label: "Tanktup's feet" },
                                        { offset: 0x6, bit: 7, label: "Musical lessons" },
                                      ],
                                    },
                                    {
                                      name: "Mumbo Tokens",
                                      type: "bitflags",
                                      flags: [
                                        { offset: 0x14, bit: 0, label: "Near the yellow Jinjo" },
                                        { offset: 0x14, bit: 5, label: "Under one of the tree of the treetop area" },
                                        { offset: 0x14, bit: 6, label: "Under one of the tree of the treetop area" },
                                        { offset: 0x14, bit: 7, label: "Near the big egg" },
                                        { offset: 0x15, bit: 1, label: "Near the red eye Croctus on the treetop area" },
                                        { offset: 0x15, bit: 2, label: "Behind Mumbo's Skull" },
                                        { offset: 0x15, bit: 3, label: "On the path of the 45 seconds race" },
                                        { offset: 0x15, bit: 4, label: "Near Tiptup in Tanktup's shell" },
                                        { offset: 0x15, bit: 5, label: "Inside the crocodile" },
                                        { offset: 0x15, bit: 6, label: "Behind Mumbo inside his hut" },
                                      ],
                                    },
                                    {
                                      name: "Extra Honeycombs",
                                      type: "bitflags",
                                      flags: [
                                        { offset: 0xf, bit: 0, label: "Above Tiptup in Tanktup's shell" },
                                        { offset: 0xf, bit: 7, label: "Above Mumbo inside his hut" },
                                      ],
                                    },
                                  ],
                                },
                              ],
                            },
                            {
                              name: "Miscellaneous",
                              items: [
                                {
                                  type: "section",
                                  flex: true,
                                  items: [
                                    {
                                      name: "Jiggies on World Puzzle",
                                      offset: 0x4c,
                                      type: "variable",
                                      dataType: "uint8",
                                      binary: {
                                        bitStart: 3,
                                        bitLength: 3,
                                      },
                                      max: 7,
                                    },
                                  ],
                                },
                                {
                                  name: "Events",
                                  type: "bitflags",
                                  flags: [
                                    { offset: 0x45, bit: 3, label: "World door unlocking animation", hidden: true },
                                    { offset: 0x46, bit: 4, label: "World door unlocked" },
                                    { offset: 0x56, bit: 1, label: "Location visited", hidden: true },
                                    { offset: 0x53, bit: 7, label: "Witch Switch activated" },
                                    { offset: 0x52, bit: 3, label: "Mumbo Tokens paid to tranform into a crocodile" },
                                  ],
                                },
                              ],
                            },
                          ],
                        },
                      ],
                    },
                    {
                      name: "Freezeezy Peak",
                      items: [
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
                                      name: "Playtime",
                                      type: "group",
                                      mode: "time",
                                      items: [
                                        {
                                          offset: 0x32,
                                          type: "variable",
                                          dataType: "uint16",
                                          bigEndian: true,
                                          operations: [
                                            {
                                              convert: {
                                                from: "seconds",
                                                to: "hours",
                                              },
                                            },
                                          ],
                                          max: 17,
                                        },
                                        {
                                          offset: 0x32,
                                          type: "variable",
                                          dataType: "uint16",
                                          bigEndian: true,
                                          operations: [
                                            {
                                              convert: {
                                                from: "seconds",
                                                to: "minutes",
                                              },
                                            },
                                          ],
                                          leadingZeros: 1,
                                          max: 59,
                                        },
                                        {
                                          offset: 0x32,
                                          type: "variable",
                                          dataType: "uint16",
                                          bigEndian: true,
                                          operations: [
                                            {
                                              convert: {
                                                from: "seconds",
                                                to: "seconds",
                                              },
                                            },
                                          ],
                                          leadingZeros: 1,
                                          max: 59,
                                        },
                                      ],
                                    },
                                    {
                                      name: "Notes",
                                      offset: 0x25,
                                      type: "variable",
                                      dataType: "uint16",
                                      bigEndian: true,
                                      binary: { bitStart: 4, bitLength: 7 },
                                      max: 100,
                                    },
                                  ],
                                },
                                {
                                  type: "section",
                                  flex: true,
                                  items: [
                                    {
                                      name: "Jiggies",
                                      type: "bitflags",
                                      flags: [
                                        { offset: 0x7, bit: 0, label: "First sled race against Boggy" },
                                        { offset: 0x7, bit: 1, label: "5 Jinjos rescued" },
                                        { offset: 0x7, bit: 2, label: "Inside Boggy's stomach" },
                                        { offset: 0x7, bit: 3, label: "Inside the giant snowman's pipe" },
                                        { offset: 0x7, bit: 4, label: "Second sled race against Boggy" },
                                        { offset: 0x7, bit: 5, label: "Buttons of giant snowman" },
                                        { offset: 0x7, bit: 6, label: "Presents to Boggy's kids" },
                                        { offset: 0x7, bit: 7, label: "At the top of the christmas tree" },
                                        { offset: 0x8, bit: 1, label: "Destroy all Sire Slushes" },
                                        { offset: 0x8, bit: 2, label: "Given by Wozza" },
                                      ],
                                    },
                                    {
                                      name: "Mumbo Tokens",
                                      type: "bitflags",
                                      flags: [
                                        { offset: 0x15, bit: 0, label: "Near the legs of the giant snowman" },
                                        { offset: 0x15, bit: 7, label: "Near the legs of the giant snowman" },
                                        { offset: 0x16, bit: 0, label: "Inside Boggy's igloo" },
                                        { offset: 0x16, bit: 1, label: "Near the purple Jinjo" },
                                        { offset: 0x16, bit: 2, label: "Above a chimney on the village" },
                                        { offset: 0x16, bit: 3, label: "Inside a Sire Slush" },
                                        { offset: 0x16, bit: 4, label: "Inside a Sire Slush" },
                                        { offset: 0x16, bit: 5, label: "On the pot of the christmas tree" },
                                        { offset: 0x16, bit: 6, label: "On the path of the sled" },
                                        { offset: 0x16, bit: 7, label: "In the water under the giant snowman's scarf" },
                                      ],
                                    },
                                    {
                                      name: "Extra Honeycombs",
                                      type: "bitflags",
                                      flags: [
                                        { offset: 0x10, bit: 1, label: "Inside Wozza's cave" },
                                        { offset: 0x10, bit: 2, label: "Inside a Sir Slush" },
                                      ],
                                    },
                                  ],
                                },
                              ],
                            },
                            {
                              name: "Miscellaneous",
                              items: [
                                {
                                  type: "section",
                                  flex: true,
                                  items: [
                                    {
                                      name: "Jiggies on World Puzzle",
                                      offset: 0x4c,
                                      type: "variable",
                                      dataType: "uint16",
                                      binary: {
                                        bitStart: 6,
                                        bitLength: 4,
                                      },
                                      max: 8,
                                    },
                                  ],
                                },
                                {
                                  name: "Events",
                                  type: "bitflags",
                                  flags: [
                                    { offset: 0x45, bit: 4, label: "World door unlocking animation", hidden: true },
                                    { offset: 0x46, bit: 5, label: "World door unlocked" },
                                    { offset: 0x56, bit: 6, label: "Location visited", hidden: true },
                                    { offset: 0x48, bit: 7, label: "Witch Switch activated" },
                                    { offset: 0x52, bit: 2, label: "Mumbo Tokens paid to tranform into a walrus" },
                                    { offset: 0x42, bit: 3, label: "Dialog after completing Twinklies mini-game", hidden: true },
                                    { offset: 0x50, bit: 2, label: "Dialog with Twinklies explaining the mini-game rules", hidden: true },
                                  ],
                                },
                              ],
                            },
                          ],
                        },
                      ],
                    },
                    {
                      name: "Gobi's Valley",
                      items: [
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
                                      name: "Playtime",
                                      type: "group",
                                      mode: "time",
                                      items: [
                                        {
                                          offset: 0x36,
                                          type: "variable",
                                          dataType: "uint16",
                                          bigEndian: true,
                                          operations: [
                                            {
                                              convert: {
                                                from: "seconds",
                                                to: "hours",
                                              },
                                            },
                                          ],
                                          max: 17,
                                        },
                                        {
                                          offset: 0x36,
                                          type: "variable",
                                          dataType: "uint16",
                                          bigEndian: true,
                                          operations: [
                                            {
                                              convert: {
                                                from: "seconds",
                                                to: "minutes",
                                              },
                                            },
                                          ],
                                          leadingZeros: 1,
                                          max: 59,
                                        },
                                        {
                                          offset: 0x36,
                                          type: "variable",
                                          dataType: "uint16",
                                          bigEndian: true,
                                          operations: [
                                            {
                                              convert: {
                                                from: "seconds",
                                                to: "seconds",
                                              },
                                            },
                                          ],
                                          leadingZeros: 1,
                                          max: 59,
                                        },
                                      ],
                                    },
                                    {
                                      name: "Notes",
                                      offset: 0x26,
                                      type: "variable",
                                      dataType: "uint16",
                                      bigEndian: true,
                                      binary: { bitStart: 5, bitLength: 7 },
                                      max: 100,
                                    },
                                  ],
                                },
                                {
                                  type: "section",
                                  flex: true,
                                  items: [
                                    {
                                      name: "Jiggies",
                                      type: "bitflags",
                                      flags: [
                                        { offset: 0x9, bit: 0, label: "In the tile puzzle pyramid" },
                                        { offset: 0x9, bit: 5, label: "5 Jinjos rescued" },
                                        { offset: 0x9, bit: 6, label: "Stolen from Grabba" },
                                        { offset: 0x9, bit: 7, label: "Inside Jinyx" },
                                        { offset: 0xa, bit: 1, label: "Inside King Sandybutt's sarcophagus" },
                                        { offset: 0xa, bit: 2, label: "Inside the water pyramid" },
                                        { offset: 0xa, bit: 3, label: "Inside Rubee's temple" },
                                        { offset: 0xa, bit: 4, label: "Free Gobi" },
                                        { offset: 0xa, bit: 5, label: "Above Trunker" },
                                        { offset: 0xa, bit: 6, label: "Flying ring challenge" },
                                      ],
                                    },
                                    {
                                      name: "Mumbo Tokens",
                                      type: "bitflags",
                                      flags: [
                                        { offset: 0x17, bit: 0, label: "Inside the water pyramid at the surface" },
                                        { offset: 0x17, bit: 1, label: "Above Jinyx's nose" },
                                        { offset: 0x17, bit: 2, label: "Using Wading Boots near Jinyx" },
                                        { offset: 0x17, bit: 3, label: "At the bottom of the pond near the water pyramid" },
                                        { offset: 0x17, bit: 4, label: "At the top of the King Sandbutt's tomb" },
                                        { offset: 0x17, bit: 5, label: "In front of the exit of the water pyramid" },
                                        { offset: 0x17, bit: 6, label: "In the tile puzzle pyramid" },
                                        { offset: 0x17, bit: 7, label: "In an urn near King Sandybutt's sarcophagus" },
                                        { offset: 0x18, bit: 1, label: "Inside Rubee's temple" },
                                        { offset: 0x18, bit: 2, label: "Inside Jinyx" },
                                      ],
                                    },
                                    {
                                      name: "Extra Honeycombs",
                                      type: "bitflags",
                                      flags: [
                                        { offset: 0x10, bit: 3, label: "Through a cactus" },
                                        { offset: 0x10, bit: 4, label: "After Beak Busted Gobi for the second time" },
                                      ],
                                    },
                                  ],
                                },
                              ],
                            },
                            {
                              name: "Miscellaneous",
                              items: [
                                {
                                  type: "section",
                                  flex: true,
                                  items: [
                                    {
                                      name: "Jiggies on World Puzzle",
                                      offset: 0x4d,
                                      type: "variable",
                                      dataType: "uint8",
                                      binary: {
                                        bitStart: 2,
                                        bitLength: 4,
                                      },
                                      max: 9,
                                    },
                                    {
                                      name: "Steps to emerge King Sandybutt's tomb",
                                      offset: 0x5f,
                                      type: "variable",
                                      dataType: "uint8",
                                      binary: {
                                        bitStart: 0,
                                        bitLength: 2,
                                      },
                                      max: 3,
                                      hidden: true,
                                    },
                                  ],
                                },
                                {
                                  name: "Events",
                                  type: "bitflags",
                                  flags: [
                                    { offset: 0x45, bit: 5, label: "World door unlocking animation", hidden: true },
                                    { offset: 0x46, bit: 6, label: "World door unlocked" },
                                    { offset: 0x56, bit: 3, label: "Location visited", hidden: true },
                                    { offset: 0x54, bit: 0, label: "Witch Switch activated" },
                                  ],
                                },
                              ],
                            },
                          ],
                        },
                      ],
                    },
                    {
                      name: "Mad Monster Mansion",
                      items: [
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
                                      name: "Playtime",
                                      type: "group",
                                      mode: "time",
                                      items: [
                                        {
                                          offset: 0x3c,
                                          type: "variable",
                                          dataType: "uint16",
                                          bigEndian: true,
                                          operations: [
                                            {
                                              convert: {
                                                from: "seconds",
                                                to: "hours",
                                              },
                                            },
                                          ],
                                          max: 17,
                                        },
                                        {
                                          offset: 0x3c,
                                          type: "variable",
                                          dataType: "uint16",
                                          bigEndian: true,
                                          operations: [
                                            {
                                              convert: {
                                                from: "seconds",
                                                to: "minutes",
                                              },
                                            },
                                          ],
                                          leadingZeros: 1,
                                          max: 59,
                                        },
                                        {
                                          offset: 0x3c,
                                          type: "variable",
                                          dataType: "uint16",
                                          bigEndian: true,
                                          operations: [
                                            {
                                              convert: {
                                                from: "seconds",
                                                to: "seconds",
                                              },
                                            },
                                          ],
                                          leadingZeros: 1,
                                          max: 59,
                                        },
                                      ],
                                    },
                                    {
                                      name: "Notes",
                                      offset: 0x28,
                                      type: "variable",
                                      dataType: "uint16",
                                      bigEndian: true,
                                      binary: { bitStart: 0, bitLength: 7 },
                                      max: 100,
                                    },
                                  ],
                                },
                                {
                                  type: "section",
                                  flex: true,
                                  items: [
                                    {
                                      name: "Jiggies",
                                      type: "bitflags",
                                      flags: [
                                        { offset: 0xd, bit: 0, label: "After the organ lesson in the church" },
                                        { offset: 0xd, bit: 3, label: "5 Jinjos rescued" },
                                        { offset: 0xd, bit: 4, label: "Inside the well" },
                                        { offset: 0xd, bit: 5, label: "On the table of the dining room" },
                                        { offset: 0xd, bit: 6, label: "In a barrel in the cellar" },
                                        { offset: 0xd, bit: 7, label: "At the top of the church" },
                                        { offset: 0xe, bit: 1, label: "In a basin by using the gutter" },
                                        { offset: 0xe, bit: 2, label: "Tumblar's game" },
                                        { offset: 0xe, bit: 3, label: "Flowers in the graveyard" },
                                        { offset: 0xe, bit: 4, label: "In the sewer after being swallowed by Loggo" },
                                      ],
                                    },
                                    {
                                      name: "Mumbo Tokens",
                                      type: "bitflags",
                                      flags: [
                                        { offset: 0x18, bit: 0, label: "Behind a gravestone" },
                                        { offset: 0x18, bit: 3, label: "Near the green pond" },
                                        { offset: 0x18, bit: 4, label: "Near Tumblar's shed" },
                                        { offset: 0x18, bit: 5, label: "In the way to the top of the church" },
                                        { offset: 0x18, bit: 6, label: "Near the hedge ramp" },
                                        { offset: 0x18, bit: 7, label: "In the maze" },
                                        { offset: 0x19, bit: 0, label: "Near the yellow Jinjo" },
                                        { offset: 0x19, bit: 1, label: "In the green pond" },
                                        { offset: 0x19, bit: 2, label: "In the wooden raftens inside the chruch" },
                                        { offset: 0x19, bit: 3, label: "On the stool inside the church" },
                                        { offset: 0x19, bit: 4, label: "On the roof of Tumblar's shed" },
                                        { offset: 0x19, bit: 5, label: "In a barrel in the cellar" },
                                        { offset: 0x19, bit: 5, label: "Inside the sewers" },
                                        { offset: 0x19, bit: 6, label: "In the fireplace of the dining room" },
                                        { offset: 0x19, bit: 7, label: "Inside the well" },
                                        { offset: 0x1a, bit: 1, label: "In the sink on the second floor of the mansion" },
                                      ],
                                    },
                                    {
                                      name: "Extra Honeycombs",
                                      type: "bitflags",
                                      flags: [
                                        { offset: 0x11, bit: 1, label: "In the wooden raftens inside the chruch" },
                                        { offset: 0x11, bit: 2, label: "Inside a room of the second floor of the mansion" },
                                      ],
                                    },
                                  ],
                                },
                              ],
                            },
                            {
                              name: "Miscellaneous",
                              items: [
                                {
                                  type: "section",
                                  flex: true,
                                  items: [
                                    {
                                      name: "Jiggies on World Puzzle",
                                      offset: 0x4d,
                                      type: "variable",
                                      dataType: "uint16",
                                      binary: {
                                        bitStart: 6,
                                        bitLength: 4,
                                      },
                                      max: 10,
                                    },
                                  ],
                                },
                                {
                                  name: "Events",
                                  type: "bitflags",
                                  flags: [
                                    { offset: 0x45, bit: 6, label: "World door unlocking animation", hidden: true },
                                    { offset: 0x46, bit: 7, label: "World door unlocked" },
                                    { offset: 0x56, bit: 7, label: "Location visited", hidden: true },
                                    { offset: 0x43, bit: 1, label: "Witch Switch activated" },
                                    { offset: 0x52, bit: 1, label: "Mumbo Tokens paid to tranform into a pumpkin" },
                                    { offset: 0x42, bit: 5, label: "Gruntilda's dialog when enter to the mansion", hidden: true },
                                    { offset: 0x43, bit: 5, label: "Animation when enter to the mansion", hidden: true },
                                    { offset: 0x50, bit: 6, label: "Gruntilda's dialog after walking on thorns", hidden: true },
                                    { offset: 0x51, bit: 0, label: "Loggo's dialog after approaching him", hidden: true },
                                    { offset: 0x51, bit: 1, label: "Loggo's dialog after approaching him while being a pumpkin", hidden: true },
                                    { offset: 0x51, bit: 2, label: "Gruntilda's dialog after back from Loggo's sewer", hidden: true },
                                  ],
                                },
                              ],
                            },
                          ],
                        },
                      ],
                    },
                    {
                      name: "Rusty Bucket Bay",
                      items: [
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
                                      name: "Playtime",
                                      type: "group",
                                      mode: "time",
                                      items: [
                                        {
                                          offset: 0x3a,
                                          type: "variable",
                                          dataType: "uint16",
                                          bigEndian: true,
                                          operations: [
                                            {
                                              convert: {
                                                from: "seconds",
                                                to: "hours",
                                              },
                                            },
                                          ],
                                          max: 17,
                                        },
                                        {
                                          offset: 0x3a,
                                          type: "variable",
                                          dataType: "uint16",
                                          bigEndian: true,
                                          operations: [
                                            {
                                              convert: {
                                                from: "seconds",
                                                to: "minutes",
                                              },
                                            },
                                          ],
                                          leadingZeros: 1,
                                          max: 59,
                                        },
                                        {
                                          offset: 0x3a,
                                          type: "variable",
                                          dataType: "uint16",
                                          bigEndian: true,
                                          operations: [
                                            {
                                              convert: {
                                                from: "seconds",
                                                to: "seconds",
                                              },
                                            },
                                          ],
                                          leadingZeros: 1,
                                          max: 59,
                                        },
                                      ],
                                    },
                                    {
                                      name: "Notes",
                                      offset: 0x28,
                                      type: "variable",
                                      dataType: "uint16",
                                      bigEndian: true,
                                      binary: { bitStart: 7, bitLength: 7 },
                                      max: 100,
                                    },
                                  ],
                                },
                                {
                                  type: "section",
                                  flex: true,
                                  items: [
                                    {
                                      name: "Jiggies",
                                      type: "bitflags",
                                      flags: [
                                        { offset: 0xc, bit: 0, label: "In the captain's room" },
                                        { offset: 0xc, bit: 1, label: "5 Jinjos rescued" },
                                        { offset: 0xc, bit: 2, label: "In the warehouse" },
                                        { offset: 0xc, bit: 3, label: "Snorkel the dolphin rescued" },
                                        { offset: 0xc, bit: 4, label: "3 whistle switches" },
                                        { offset: 0xc, bit: 5, label: "At the top of a chimney" },
                                        { offset: 0xc, bit: 6, label: "Beat Boss Boom Box" },
                                        { offset: 0xc, bit: 7, label: "Behind the propellers" },
                                        { offset: 0xd, bit: 1, label: "In a cage on the ship" },
                                        { offset: 0xd, bit: 2, label: "In the engine room" },
                                      ],
                                    },
                                    {
                                      name: "Mumbo Tokens",
                                      type: "bitflags",
                                      flags: [
                                        { offset: 0x1a, bit: 0, label: "Inside one of the storage container" },
                                        { offset: 0x1a, bit: 2, label: "At the top of a chimney" },
                                        { offset: 0x1a, bit: 3, label: "At the front of the ship" },
                                        { offset: 0x1a, bit: 4, label: "In a lifeboat" },
                                        { offset: 0x1a, bit: 5, label: "Above the bridge of the Toll 2" },
                                        { offset: 0x1a, bit: 6, label: "On a barrel near green Jinjo" },
                                        { offset: 0x1a, bit: 7, label: "Near the Rareware flag on the boat" },
                                        { offset: 0x1b, bit: 0, label: "In a room of the ship" },
                                        { offset: 0x1b, bit: 1, label: "Near the blue Jinjo" },
                                        { offset: 0x1b, bit: 2, label: "On a bed in a bunk" },
                                        { offset: 0x1b, bit: 3, label: "Under the desk of the control room" },
                                        { offset: 0x1b, bit: 4, label: "In a oven in the kitchen" },
                                        { offset: 0x1b, bit: 5, label: "In the engine room" },
                                        { offset: 0x1b, bit: 6, label: "In the engine room" },
                                        { offset: 0x1b, bit: 7, label: "In the engine room" },
                                      ],
                                    },
                                    {
                                      name: "Extra Honeycombs",
                                      type: "bitflags",
                                      flags: [
                                        { offset: 0x10, bit: 0, label: "In a small window in the engine room" },
                                        { offset: 0x10, bit: 7, label: "In the boathouse" },
                                      ],
                                    },
                                  ],
                                },
                              ],
                            },
                            {
                              name: "Miscellaneous",
                              items: [
                                {
                                  type: "section",
                                  flex: true,
                                  items: [
                                    {
                                      name: "Jiggies on World Puzzle",
                                      offset: 0x4e,
                                      type: "variable",
                                      dataType: "uint8",
                                      binary: {
                                        bitStart: 2,
                                        bitLength: 4,
                                      },
                                      max: 12,
                                    },
                                  ],
                                },
                                {
                                  name: "Events",
                                  type: "bitflags",
                                  flags: [
                                    { offset: 0x45, bit: 7, label: "World door unlocking animation", hidden: true },
                                    { offset: 0x47, bit: 0, label: "World door unlocked" },
                                    { offset: 0x56, bit: 4, label: "Location visited", hidden: true },
                                    { offset: 0x43, bit: 4, label: "Witch Switch activated" },
                                    { offset: 0x55, bit: 1, label: "Gruntilda's dialog when step inside a oven", hidden: true },
                                    { offset: 0x55, bit: 3, label: "Gruntilda's dialog after swimming into oily water", hidden: true },
                                    { offset: 0x55, bit: 4, label: "Gruntilda's dialog after swimming underwater into oily water", hidden: true },
                                  ],
                                },
                              ],
                            },
                          ],
                        },
                      ],
                    },
                    {
                      name: "Click Clock Wood",
                      items: [
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
                                      name: "Playtime",
                                      type: "group",
                                      mode: "time",
                                      items: [
                                        {
                                          offset: 0x38,
                                          type: "variable",
                                          dataType: "uint16",
                                          bigEndian: true,
                                          operations: [
                                            {
                                              convert: {
                                                from: "seconds",
                                                to: "hours",
                                              },
                                            },
                                          ],
                                          max: 17,
                                        },
                                        {
                                          offset: 0x38,
                                          type: "variable",
                                          dataType: "uint16",
                                          bigEndian: true,
                                          operations: [
                                            {
                                              convert: {
                                                from: "seconds",
                                                to: "minutes",
                                              },
                                            },
                                          ],
                                          leadingZeros: 1,
                                          max: 59,
                                        },
                                        {
                                          offset: 0x38,
                                          type: "variable",
                                          dataType: "uint16",
                                          bigEndian: true,
                                          operations: [
                                            {
                                              convert: {
                                                from: "seconds",
                                                to: "seconds",
                                              },
                                            },
                                          ],
                                          leadingZeros: 1,
                                          max: 59,
                                        },
                                      ],
                                    },
                                    {
                                      name: "Notes",
                                      offset: 0x27,
                                      type: "variable",
                                      dataType: "uint16",
                                      bigEndian: true,
                                      binary: { bitStart: 6, bitLength: 7 },
                                      max: 100,
                                    },
                                  ],
                                },
                                {
                                  type: "section",
                                  flex: true,
                                  items: [
                                    {
                                      name: "Jiggies",
                                      type: "bitflags",
                                      flags: [
                                        { offset: 0xb, bit: 0, label: "At the top of the tree" },
                                        { offset: 0xa, bit: 7, label: "5 Jinjos rescued" },
                                        { offset: 0xb, bit: 7, label: "<b>Spring / Winter:</b> At the highest platform of the tree" },
                                        { offset: 0xb, bit: 4, label: "<b>Summer:</b> Defeat the Zubbas inside the beehive" },
                                        { offset: 0xa, bit: 0, label: "<b>Summer / Autumn:</b> In the treehouse" },
                                        { offset: 0xb, bit: 6, label: "<b>Summer / Autumn:</b> Following the leaves path" },
                                        { offset: 0xb, bit: 2, label: "<b>Autumn:</b> The acorns of Nabnut" },
                                        { offset: 0xb, bit: 3, label: "<b>Autumn:</b> In the house of Gnawty" },
                                        { offset: 0xb, bit: 5, label: "<b>Autumn:</b> At the top of the eggplant" },
                                        { offset: 0xb, bit: 1, label: "<b>Winter:</b> Eyrie the eagle" },
                                      ],
                                    },
                                    {
                                      name: "Mumbo Tokens",
                                      type: "bitflags",
                                      flags: [
                                        { offset: 0x1d, bit: 0, label: "<b>Spring:</b> On the entrance above a Snarebear" },
                                        { offset: 0x1d, bit: 3, label: "<b>Spring:</b> In the treehouse" },
                                        { offset: 0x1d, bit: 4, label: "<b>Spring:</b> On a branch of the tree" },
                                        { offset: 0x1d, bit: 6, label: "<b>Spring:</b> In the brambles near Mumbo's Skull" },
                                        { offset: 0x1d, bit: 6, label: "<b>Spring:</b> Near Eyrie's nest" },
                                        { offset: 0x1d, bit: 7, label: "<b>Spring:</b> Near the wooden arch to the tree above a Snarebear" },
                                        { offset: 0x1e, bit: 1, label: "<b>Spring:</b> Near the edge of the beehive" },
                                        { offset: 0x1e, bit: 2, label: "<b>Spring:</b> In Nabnut's house" },
                                        { offset: 0x1e, bit: 0, label: "<b>Summer:</b> Following the leaves path" },
                                        { offset: 0x1e, bit: 3, label: "<b>Summer:</b> Near Nabnut's house" },
                                        { offset: 0x1e, bit: 4, label: "<b>Summer:</b> Near the eggplant" },
                                        { offset: 0x1e, bit: 5, label: "<b>Summer:</b> Above a Snarebear before ascending the tree" },
                                        { offset: 0x1e, bit: 6, label: "<b>Summer:</b> In a branch of the tree" },
                                        { offset: 0x1e, bit: 7, label: "<b>Summer:</b> In the entrance of Gnawty's house" },
                                        { offset: 0x1f, bit: 1, label: "<b>Summer:</b> Inside Mumbo's Skull" },
                                        { offset: 0x1f, bit: 2, label: "<b>Autumn:</b> Following the leaves path" },
                                        { offset: 0x1f, bit: 3, label: "<b>Autumn:</b> On the entrance above a Snarebear" },
                                        { offset: 0x1f, bit: 4, label: "<b>Autumn:</b> At the top of the tree above a Snarebear" },
                                        { offset: 0x1f, bit: 5, label: "<b>Autumn:</b> In a branch of the tree near the treehouse" },
                                        { offset: 0x1f, bit: 6, label: "<b>Autumn:</b> In a branch of the tree" },
                                        { offset: 0x1f, bit: 0, label: "<b>Winter:</b> Behind the platform with the Flight Pad" },
                                        { offset: 0x1f, bit: 7, label: "<b>Winter:</b> On the remains of the eggplant" },
                                        { offset: 0x20, bit: 1, label: "<b>Winter:</b> In the broken beehive" },
                                        { offset: 0x20, bit: 2, label: "<b>Winter:</b> Near Nabnut's house" },
                                        { offset: 0x20, bit: 3, label: "<b>Winter:</b> Inside a Sire Slush" },
                                      ],
                                    },
                                    {
                                      name: "Extra Honeycombs",
                                      type: "bitflags",
                                      flags: [
                                        { offset: 0x10, bit: 5, label: "<b>Winter:</b> Inside Gnawty's house" },
                                        { offset: 0x10, bit: 6, label: "<b>Winter:</b> Nabnut's storage room" },
                                      ],
                                    },
                                  ],
                                },
                              ],
                            },
                            {
                              name: "Miscellaneous",
                              items: [
                                {
                                  type: "section",
                                  flex: true,
                                  items: [
                                    {
                                      name: "Jiggies on World Puzzle",
                                      offset: 0x4e,
                                      type: "variable",
                                      dataType: "uint16",
                                      binary: {
                                        bitStart: 6,
                                        bitLength: 4,
                                      },
                                      max: 15,
                                    },
                                  ],
                                },
                                {
                                  name: "Events",
                                  type: "bitflags",
                                  flags: [
                                    { offset: 0x46, bit: 0, label: "World door unlocking animation", hidden: true },
                                    { offset: 0x47, bit: 1, label: "World door unlocked" },
                                    { offset: 0x56, bit: 5, label: "Location visited", hidden: true },
                                    { offset: 0x51, bit: 3, label: "Spring door open" },
                                    { offset: 0x51, bit: 4, label: "Summer door open" },
                                    { offset: 0x51, bit: 5, label: "Autumn door open" },
                                    { offset: 0x51, bit: 6, label: "Winter door open" },
                                    { offset: 0x48, bit: 6, label: "Witch Switch activated" },
                                    { offset: 0x52, bit: 4, label: "Mumbo Tokens paid to tranform into a bee" },
                                    { offset: 0x55, bit: 2, label: "Grantilda's dialog when walking on brambles", hidden: true },
                                    { offset: 0x5b, bit: 5, label: "Gruntilda's dialog when swimming in cold water", hidden: true },
                                    { offset: 0x5c, bit: 3, label: "<b>Spring:</b> Eggplant step 1 done", hidden: true },
                                    { offset: 0x5c, bit: 4, label: "<b>Summer:</b> Eggplant step 2 done", hidden: true },
                                    { offset: 0x5c, bit: 5, label: "<b>Autumn:</b> Eggplant step 3 done", hidden: true },
                                    { offset: 0x5c, bit: 6, label: "<b>Spring:</b> Eyrie step 1 done", hidden: true },
                                    { offset: 0x5c, bit: 7, label: "<b>Summer:</b> Eyrie step 2 done", hidden: true },
                                    { offset: 0x5d, bit: 0, label: "<b>Autumn:</b> Eyrie step 3 done", hidden: true },
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
              ],
            },
            {
              name: "Special Moves",
              flex: true,
              items: [
                {
                  name: "Basic Moves",
                  type: "bitflags",
                  flags: [
                    { offset: 0x6c, bit: 2, label: "High Jump" },
                    { offset: 0x6d, bit: 7, label: "Feathery Flap" },
                    { offset: 0x6c, bit: 0, label: "Flap Flip" },
                    { offset: 0x6d, bit: 5, label: "Climbing" },
                    { offset: 0x6c, bit: 7, label: "Swimming" },
                    { offset: 0x6d, bit: 4, label: "Claw Swipe" },
                    { offset: 0x6c, bit: 4, label: "Forward Roll Attack" },
                    { offset: 0x6c, bit: 3, label: "Rat-a-tat Rap" },
                    { offset: 0x6d, bit: 0, label: "Beak Barge" },
                    { offset: 0x6d, bit: 3, label: "Bottles' dialog about camera control", hidden: true },
                  ],
                },
                {
                  name: "Advanced Moves",
                  type: "bitflags",
                  flags: [
                    { offset: 0x6b, bit: 0, label: "Talon Trot" },
                    { offset: 0x6d, bit: 2, label: "Beak Buster" },
                    { offset: 0x6d, bit: 6, label: "Egg Firing" },
                    { offset: 0x6c, bit: 5, label: "Shock Jump Spring" },
                    { offset: 0x6c, bit: 1, label: "Flight" },
                    { offset: 0x6b, bit: 2, label: "Wonderwing" },
                    { offset: 0x6b, bit: 1, label: "Turbo Talon Trot" },
                    { offset: 0x6c, bit: 6, label: "Stilt Stride" },
                    { offset: 0x6d, bit: 1, label: "Beak Bomb" },
                    { offset: 0x6b, bit: 4, label: "???", hidden: true },
                    { offset: 0x6b, bit: 5, label: "???", hidden: true },
                    { offset: 0x6b, bit: 6, label: "???", hidden: true },
                    { offset: 0x6b, bit: 7, label: "???", hidden: true },
                    { offset: 0x6b, bit: 3, label: "Bottles' dialog when approchaing a Note Door", hidden: true },
                  ],
                },
                {
                  name: "Bottles' Dialog",
                  type: "bitflags",
                  hidden: true,
                  flags: [
                    { offset: 0x70, bit: 0, label: "Bottles' dialog after flying" },
                    { offset: 0x70, bit: 1, label: "??? after performing a Shock Jump Spring" },
                    { offset: 0x70, bit: 2, label: "Bottles' dialog after performing Rat-a-tat Rap" },
                    { offset: 0x70, bit: 3, label: "Bottles' dialog after performing Claw Swipe" },
                    { offset: 0x70, bit: 4, label: "Bottles' dialog after performing Forward Roll" },
                    { offset: 0x70, bit: 5, label: "???", hidden: true },
                    { offset: 0x70, bit: 6, label: "???", hidden: true },
                    { offset: 0x70, bit: 7, label: "???", hidden: true },
                    { offset: 0x71, bit: 0, label: "Bottles' dialog after performing High Jump" },
                    { offset: 0x71, bit: 1, label: "Bottles' dialog after performing Feathery Flap" },
                    { offset: 0x71, bit: 2, label: "Bottles' dialog after performing Flap Flip" },
                    { offset: 0x71, bit: 3, label: "Bottles' dialog after swimming" },
                    { offset: 0x71, bit: 4, label: "Bottles' dialog after climbing" },
                    { offset: 0x71, bit: 5, label: "Bottles' dialog after performing Beak Barge" },
                    { offset: 0x71, bit: 6, label: "???", hidden: true },
                    { offset: 0x71, bit: 7, label: "??? after performing an Egg Firing" },
                  ],
                },
              ],
            },
            {
              name: "Events",
              hidden: true,
              items: [
                {
                  type: "bitflags",
                  flags: [
                    { offset: 0x1d, bit: 5, label: "???", hidden: true },
                    { offset: 0x20, bit: 0, label: "???", hidden: true },
                    { offset: 0x20, bit: 4, label: "???", hidden: true },
                    { offset: 0x20, bit: 5, label: "???", hidden: true },
                    { offset: 0x20, bit: 6, label: "???", hidden: true },
                    { offset: 0x20, bit: 7, label: "???", hidden: true },
                    { offset: 0x40, bit: 0, label: "???", hidden: true },
                    { offset: 0x40, bit: 1, label: "???", hidden: true },
                    { offset: 0x40, bit: 2, label: "???", hidden: true },
                    { offset: 0x40, bit: 3, label: "Dialog after getting a Note" },
                    { offset: 0x40, bit: 4, label: "Dialog after getting a Mumbo's Token" },
                    { offset: 0x40, bit: 5, label: "Dialog after getting an Egg" },
                    { offset: 0x40, bit: 6, label: "Dialog after getting a Red Feather" },
                    { offset: 0x40, bit: 7, label: "Dialog after getting a Gold Feather" },
                    { offset: 0x41, bit: 2, label: "Dialog after getting an Honey Energy" },
                    { offset: 0x41, bit: 3, label: "Dialog after getting an Extra Honeycomb" },
                    { offset: 0x41, bit: 4, label: "Dialog after getting an Extra Life" },
                    { offset: 0x41, bit: 5, label: "Dialog after approaching a Beehive" },
                    { offset: 0x41, bit: 6, label: "Dialog after saving a Jinjo" },
                    { offset: 0x41, bit: 7, label: "Dialog after step in swamps" },
                    { offset: 0x42, bit: 0, label: "Dialog after step in quicksands" },
                    { offset: 0x42, bit: 1, label: "Mumbo's dialog introducing his powers" },
                    { offset: 0x42, bit: 2, label: "Mumbo's dialog when tranform" },
                    { offset: 0x42, bit: 4, label: "Dialog after step in cold water" },
                    { offset: 0x43, bit: 3, label: "Bubblegloop Swamp: ???", hidden: true },
                    { offset: 0x49, bit: 7, label: "???", hidden: true },
                    { offset: 0x4a, bit: 0, label: "???", hidden: true },
                    { offset: 0x50, bit: 3, label: "Mumbo's dialog when magic weak because far from world" },
                    { offset: 0x50, bit: 4, label: "Mumbo's dialog when magic run out because far from world" },
                    { offset: 0x50, bit: 5, label: "???", hidden: true },
                    { offset: 0x50, bit: 7, label: "???", hidden: true },
                    { offset: 0x51, bit: 7, label: "Dialog after approaching a Beehive with bees" },
                    { offset: 0x52, bit: 5, label: "???", hidden: true },
                    { offset: 0x54, bit: 3, label: "???", hidden: true },
                    { offset: 0x54, bit: 4, label: "???", hidden: true },
                    { offset: 0x55, bit: 0, label: "Gruntilda's dialog when knock out" },
                    { offset: 0x57, bit: 2, label: "???", hidden: true },
                    { offset: 0x57, bit: 3, label: "???", hidden: true },
                    { offset: 0x57, bit: 4, label: "???", hidden: true },
                    { offset: 0x59, bit: 6, label: "Mad Monster Mansion / Gruntilda's Lair: ???", hidden: true },
                    { offset: 0x5a, bit: 0, label: "???", hidden: true },
                    { offset: 0x5b, bit: 3, label: "???", hidden: true },
                    { offset: 0x5b, bit: 4, label: "Mumbo's dialog when have enough Mumbo Tokens to transform" },
                    { offset: 0x5b, bit: 6, label: "???", hidden: true },
                    { offset: 0x5c, bit: 1, label: "Game Over seen after visiting Gruntilda's Lair" },
                    { offset: 0x5f, bit: 3, label: "???", hidden: true },
                    { offset: 0x5f, bit: 5, label: "???", hidden: true },
                    { offset: 0x5f, bit: 6, label: "???", hidden: true },
                    { offset: 0x5f, bit: 7, label: "???", hidden: true },
                  ],
                },
              ],
            },
          ],
        },
      ],
      appendSubinstance: [
        {
          name: "Stop 'n' Swop",
          items: [
            {
              name: "Checksum",
              offset: 0x1fc,
              type: "checksum",
              dataType: "uint32",
              bigEndian: true,
              control: {
                offsetStart: 0x1e0,
                offsetEnd: 0x1fc,
              },
            },
            {
              type: "section",
              flex: true,
              items: [
                {
                  name: "Unlocked",
                  type: "bitflags",
                  flags: [
                    { offset: 0x1e0, bit: 1, label: "Ice Key" },
                    { offset: 0x1e0, bit: 2, label: "Cyan Mystery Egg" },
                    { offset: 0x1e0, bit: 3, label: "Pink Mystery Egg" },
                    { offset: 0x1e0, bit: 4, label: "Blue Mystery Egg" },
                    { offset: 0x1e0, bit: 5, label: "Green Mystery Egg" },
                    { offset: 0x1e0, bit: 6, label: "Red Mystery Egg" },
                    { offset: 0x1e0, bit: 7, label: "Yellow Mystery Egg" },
                  ],
                },
                {
                  name: "Obtained",
                  type: "bitflags",
                  flags: [
                    { offset: 0x1e1, bit: 2, label: "Ice Key" },
                    { offset: 0x1e1, bit: 3, label: "Cyan Mystery Egg" },
                    { offset: 0x1e1, bit: 4, label: "Pink Mystery Egg" },
                    { offset: 0x1e1, bit: 5, label: "Blue Mystery Egg" },
                    { offset: 0x1e1, bit: 6, label: "Green Mystery Egg" },
                    { offset: 0x1e1, bit: 7, label: "Red Mystery Egg" },
                    { offset: 0x1e0, bit: 0, label: "Yellow Mystery Egg" },
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
    eggs: {
      0x0: "100",
      0x1: "200",
    },
    goldFeathers: {
      0x0: "10",
      0x1: "20",
    },
    health: {
      0x0: "Simple",
      0x1: "Double",
    },
    progressions: {
      0x0: "-",
      0x1: "Game Complete",
    },
    redFeathers: {
      0x0: "50",
      0x1: "100",
    },
  },
};

export default template;
