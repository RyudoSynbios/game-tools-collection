import type { GameJson } from "$lib/types";

import { courses } from "./utils/resource";

const template: GameJson = {
  validator: {
    regions: {
      europe: {
        $and: [
          { 0x34: [0x44, 0x41] }, // "DA"
          { 0x1dc: [0x48, 0x49] }, // "HI"
        ],
      },
      usa_japan: {
        $and: [
          { 0x34: [0x44, 0x41] }, // "DA"
          { 0x1dc: [0x48, 0x49] }, // "HI"
        ],
      },
    },
    text: "Drag 'n' drop here or click to add a save file.",
    hint: "If you're having trouble loading a save file from an Everdrive cartridge, please see the FAQ.",
    error: "Not a valid save file.",
  },
  items: [
    {
      type: "section",
      flex: true,
      hidden: true,
      items: [
        {
          name: "Checksum Options",
          offset: 0x1de,
          type: "checksum",
          dataType: "uint16",
          bigEndian: true,
          control: {
            offsetStart: 0x1c0,
            offsetEnd: 0x1de,
          },
        },
      ],
    },
    {
      id: "slots",
      length: 0x70,
      type: "container",
      instanceType: "tabs",
      instances: 4,
      enumeration: "Mario %s",
      appendSubinstance: [
        {
          name: "Score",
          items: Object.values(courses).map((course, courseIndex) => ({
            name: course,
            type: "section",
            flex: true,
            items: [...Array(4).keys()].map((index) => ({
              name: `Mario ${"%s".format(index + 1)}`,
              offset:
                0x1c0 + index * 0x4 + (0x3 - Math.floor(courseIndex / 0x4)),
              type: "variable",
              dataType: "uint8",
              binary: {
                bitStart: (courseIndex % 0x4) * 2,
                bitLength: 2,
              },
              resource: "rankings",
            })),
          })),
        },
        {
          name: "Option",
          flex: true,
          items: [
            {
              name: "Sound",
              offset: 0x1d1,
              type: "variable",
              dataType: "uint8",
              resource: "sounds",
            },
            {
              id: "language",
              name: "Language",
              offset: 0x1d3,
              type: "variable",
              dataType: "uint8",
              resource: "languages",
            },
          ],
        },
      ],
      disableSubinstanceIf: {
        offset: 0xb,
        type: "variable",
        dataType: "bit",
        bit: 0,
        operator: "=",
        value: 0x0,
      },
      items: [
        {
          name: "Checksum",
          offset: 0x36,
          type: "checksum",
          dataType: "uint16",
          bigEndian: true,
          control: {
            offsetStart: 0x0,
            offsetEnd: 0x36,
          },
        },
        {
          type: "tabs",
          vertical: true,
          items: [
            {
              name: "General",
              items: [
                {
                  type: "tabs",
                  items: [
                    {
                      name: "General",
                      items: [
                        {
                          id: "totalStars",
                          name: "Stars",
                          offset: 0x8,
                          type: "variable",
                          dataType: "uint8",
                          disabled: true,
                        },
                        {
                          type: "section",
                          flex: true,
                          items: [
                            {
                              type: "section",
                              background: true,
                              items: [
                                {
                                  name: "Secret Stars",
                                  type: "bitflags",
                                  noMargin: true,
                                  flags: [
                                    { offset: 0x8, bit: 0, label: "Toad (Hazy Maze Cave Room)" },
                                    { offset: 0x8, bit: 1, label: "Toad (Gallery)" },
                                    { offset: 0x8, bit: 2, label: "Toad (Clock Room)", separator: true },
                                    { offset: 0x8, bit: 3, label: "Mips (1)" },
                                    { offset: 0x8, bit: 4, label: "Mips (2)", separator: true },
                                    { offset: 0x1e, bit: 0, label: "The Princess's Secret Slide" },
                                    { offset: 0x1e, bit: 1, label: "The Princess's Secret Slide (under 21 seconds)", separator: true },
                                  ],
                                },
                                {
                                  name: "8 Red Coins Secret Stars",
                                  type: "bitflags",
                                  noMargin: true,
                                  flags: [
                                    { offset: 0x1b, bit: 0, label: "Bowser in the Dark World" },
                                    { offset: 0x1c, bit: 0, label: "Bowser in the Fire Sea" },
                                    { offset: 0x1d, bit: 0, label: "Bowser in the Sky" },
                                    { offset: 0x1f, bit: 0, label: "Cavern of the Metal Cap" },
                                    { offset: 0x20, bit: 0, label: "Tower of the Wing Cap" },
                                    { offset: 0x21, bit: 0, label: "Vanish Cap Under the Moat" },
                                    { offset: 0x22, bit: 0, label: "Wing Mario Over the Rainbow" },
                                    { offset: 0x23, bit: 0, label: "The Secret Aquarium" },
                                  ],
                                },
                              ],
                            },
                            {
                              name: "Events",
                              type: "bitflags",
                              flags: [
                                { offset: 0xb, bit: 1, label: "Wing Cap Switch" },
                                { offset: 0xb, bit: 2, label: "Metal Cap Switch" },
                                { offset: 0xb, bit: 3, label: "Vanish Cap Switch", separator: true },
                                { offset: 0xa, bit: 1, label: "Moat Drained", separator: true },
                                { offset: 0xa, bit: 0, label: "Animation of the moving Dire, Dire Docks painting seen", hidden: true },
                                { offset: 0xa, bit: 3, label: "Door to Whomp's Fortress open once", hidden: true },
                                { offset: 0xa, bit: 5, label: "Door to Jolly Roger Bay open once", hidden: true },
                                { offset: 0xa, bit: 4, label: "Door to Cool, Cool Mountain open once", hidden: true },
                                { offset: 0xa, bit: 2, label: "Door to The Princess's Secret Slide open once", hidden: true },
                                { offset: 0xa, bit: 6, label: "Star Door to Bowser in the Dark World open once", hidden: true },
                                { offset: 0xa, bit: 7, label: "Star Door to Basement open once", hidden: true },
                                { offset: 0x9, bit: 4, label: "Star Door to Clock Room open once", separator: true, hidden: true },
                                { offset: 0xb, bit: 4, label: "Basement Key in possession" },
                                { offset: 0xb, bit: 5, label: "Gallery Key in possession", separator: true },
                                { offset: 0xb, bit: 6, label: "Key Door to Basement open" },
                                { offset: 0xb, bit: 7, label: "Key Door to Gallery open", separator: true },
                                { offset: 0x23, bit: 7, label: "Bob-omb cannon open (Wing Mario Over the Rainbow)" },
                              ],
                            },
                          ],
                        },
                      ],
                    },
                    {
                      name: "Mario's Cap",
                      items: [
                        {
                          type: "section",
                          flex: true,
                          noMargin: true,
                          items: [
                            {
                              name: "Location",
                              offset: 0x9,
                              type: "variable",
                              dataType: "uint8",
                              resource: "capLocations",
                              binary: {
                                bitStart: 0,
                                bitLength: 4,
                              },
                            },
                            {
                              id: "capGround-0",
                              name: "Course",
                              offset: 0x0,
                              type: "variable",
                              dataType: "uint8",
                              resource: "courses",
                              autocomplete: true,
                            },
                            {
                              id: "capGround-1",
                              name: "Area",
                              offset: 0x1,
                              type: "variable",
                              dataType: "uint8",
                            },
                          ],
                        },
                        {
                          type: "section",
                          flex: true,
                          items: [
                            {
                              id: "capGround-2",
                              name: "Position X",
                              offset: 0x2,
                              type: "variable",
                              dataType: "int16",
                            },
                            {
                              id: "capGround-4",
                              name: "Position Y",
                              offset: 0x4,
                              type: "variable",
                              dataType: "int16",
                            },
                            {
                              id: "capGround-6",
                              name: "Position Z",
                              offset: 0x6,
                              type: "variable",
                              dataType: "int16",
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
              name: "Bob-omb Battlefield",
              flex: true,
              items: [
                {
                  name: "Stars",
                  type: "bitflags",
                  flags: [
                    { offset: 0xc, bit: 0, label: "Big Bob-omb on the Summit" },
                    { offset: 0xc, bit: 1, label: "Footrace with Koopa the Quick" },
                    { offset: 0xc, bit: 2, label: "Shoot to the Island in the Sky" },
                    { offset: 0xc, bit: 3, label: "Find the 8 Red Coins" },
                    { offset: 0xc, bit: 4, label: "Mario Wings to the Sky" },
                    { offset: 0xc, bit: 5, label: "Behind Chain Chomp's Gate", separator: true },
                    { offset: 0xc, bit: 6, label: "100 Coins" },
                  ],
                },
                {
                  type: "section",
                  items: [
                    {
                      name: "Events",
                      type: "bitflags",
                      flags: [
                        { offset: 0xd, bit: 7, label: "Bob-omb cannon open" },
                      ],
                    },
                    {
                      name: "Score",
                      offset: 0x25,
                      type: "variable",
                      dataType: "uint8",
                      test: true,
                    },
                  ],
                },
              ],
            },
            {
              name: "Whomp's Fortress",
              flex: true,
              items: [
                {
                  name: "Stars",
                  type: "bitflags",
                  flags: [
                    { offset: 0xd, bit: 0, label: "Chip Off Whomp's Block" },
                    { offset: 0xd, bit: 1, label: "To the Top of the Fortress" },
                    { offset: 0xd, bit: 2, label: "Shoot Into the Wild Blue" },
                    { offset: 0xd, bit: 3, label: "Red Coins on the Floating Isle" },
                    { offset: 0xd, bit: 4, label: "Fall Onto the Caged Island" },
                    { offset: 0xd, bit: 5, label: "Blast Away the Wall", separator: true },
                    { offset: 0xd, bit: 6, label: "100 Coins" },
                  ],
                },
                {
                  type: "section",
                  items: [
                    {
                      name: "Events",
                      type: "bitflags",
                      flags: [
                        { offset: 0xe, bit: 7, label: "Bob-omb cannon open" },
                      ],
                    },
                    {
                      name: "Score",
                      offset: 0x26,
                      type: "variable",
                      dataType: "uint8",
                    },
                  ],
                },
              ],
            },
            {
              name: "Jolly Roger Bay",
              flex: true,
              items: [
                {
                  name: "Stars",
                  type: "bitflags",
                  flags: [
                    { offset: 0xe, bit: 0, label: "Plunder in the Sunken Ship" },
                    { offset: 0xe, bit: 1, label: "Can the Eel Come out to Play?" },
                    { offset: 0xe, bit: 2, label: "Treasure of the Ocean Cave" },
                    { offset: 0xe, bit: 3, label: "Red Coins on the Ship Afloat" },
                    { offset: 0xe, bit: 4, label: "Blast to the Stone Pillar" },
                    { offset: 0xe, bit: 5, label: "Through the Jet Stream", separator: true },
                    { offset: 0xe, bit: 6, label: "100 Coins" },
                  ],
                },
                {
                  type: "section",
                  items: [
                    {
                      name: "Events",
                      type: "bitflags",
                      flags: [
                        { offset: 0xf, bit: 7, label: "Bob-omb cannon open" },
                      ],
                    },
                    {
                      name: "Score",
                      offset: 0x27,
                      type: "variable",
                      dataType: "uint8",
                    },
                  ],
                },
              ],
            },
            {
              name: "Cool, Cool Mountain",
              flex: true,
              items: [
                {
                  name: "Stars",
                  type: "bitflags",
                  flags: [
                    { offset: 0xf, bit: 0, label: "Slip Slidin' Away" },
                    { offset: 0xf, bit: 1, label: "Li'l Penguin Lost" },
                    { offset: 0xf, bit: 2, label: "Big Penguin Race" },
                    { offset: 0xf, bit: 3, label: "Frosty Slide for 8 Red Coins" },
                    { offset: 0xf, bit: 4, label: "Snowman's Lost his Head" },
                    { offset: 0xf, bit: 5, label: "Wall Kicks will Work", separator: true },
                    { offset: 0xf, bit: 6, label: "100 Coins" },
                  ],
                },
                {
                  type: "section",
                  items: [
                    {
                      name: "Events",
                      type: "bitflags",
                      flags: [
                        { offset: 0x10, bit: 7, label: "Bob-omb cannon open" },
                      ],
                    },
                    {
                      name: "Score",
                      offset: 0x28,
                      type: "variable",
                      dataType: "uint8",
                    },
                  ],
                },
              ],
            },
            {
              name: "Big Boo's Haunt",
              flex: true,
              items: [
                {
                  name: "Stars",
                  type: "bitflags",
                  flags: [
                    { offset: 0x10, bit: 0, label: "Go on a Ghost Hunt" },
                    { offset: 0x10, bit: 1, label: "Ride Big Boo's Merry-Go-Round" },
                    { offset: 0x10, bit: 2, label: "Secret of the Haunted Books" },
                    { offset: 0x10, bit: 3, label: "Seek the 8 Red Coins" },
                    { offset: 0x10, bit: 4, label: "Big Boo's Balcony" },
                    { offset: 0x10, bit: 5, label: "Eye to Eye in the Secret Room", separator: true },
                    { offset: 0x10, bit: 6, label: "100 Coins" },
                  ],
                },
                {
                  name: "Score",
                  offset: 0x29,
                  type: "variable",
                  dataType: "uint8",
                },
              ],
            },
            {
              name: "Hazy Maze Cave",
              flex: true,
              items: [
                {
                  name: "Stars",
                  type: "bitflags",
                  flags: [
                    { offset: 0x11, bit: 0, label: "Swimming Beast in the Cavern" },
                    { offset: 0x11, bit: 1, label: "Elevate for 8 Red Coins" },
                    { offset: 0x11, bit: 2, label: "Metal-Head Mario Can Move!" },
                    { offset: 0x11, bit: 3, label: "Navigating the Toxic Maze" },
                    { offset: 0x11, bit: 4, label: "A-maze-ing Emergency Exit" },
                    { offset: 0x11, bit: 5, label: "Watch for the Rolling Rocks", separator: true },
                    { offset: 0x11, bit: 6, label: "100 Coins" },
                  ],
                },
                {
                  name: "Score",
                  offset: 0x2a,
                  type: "variable",
                  dataType: "uint8",
                },
              ],
            },
            {
              name: "Lethal Lava Land",
              flex: true,
              items: [
                {
                  name: "Stars",
                  type: "bitflags",
                  flags: [
                    { offset: 0x12, bit: 0, label: "Boil the Big Bully" },
                    { offset: 0x12, bit: 1, label: "Bully the Bullies" },
                    { offset: 0x12, bit: 2, label: "8-Coin Puzzle with 15 Pieces" },
                    { offset: 0x12, bit: 3, label: "Red-Hot Log Rolling" },
                    { offset: 0x12, bit: 4, label: "Hot-Foot-It Into the Volcano" },
                    { offset: 0x12, bit: 5, label: "Elevator Tour in the Volcano", separator: true },
                    { offset: 0x12, bit: 6, label: "100 Coins" },
                  ],
                },
                {
                  name: "Score",
                  offset: 0x2b,
                  type: "variable",
                  dataType: "uint8",
                },
              ],
            },
            {
              name: "Shifting Sand Land",
              flex: true,
              items: [
                {
                  name: "Stars",
                  type: "bitflags",
                  flags: [
                    { offset: 0x13, bit: 0, label: "In the Talons of the Big Bird" },
                    { offset: 0x13, bit: 1, label: "Shining Atop the Pyramid" },
                    { offset: 0x13, bit: 2, label: "Inside the Ancient Pyramid" },
                    { offset: 0x13, bit: 3, label: "Stand Tall on the Four Pillars" },
                    { offset: 0x13, bit: 4, label: "Free Flying for Red Coins" },
                    { offset: 0x13, bit: 5, label: "Pyramid Puzzle", separator: true },
                    { offset: 0x13, bit: 6, label: "100 Coins" },
                  ],
                },
                {
                  type: "section",
                  items: [
                    {
                      name: "Events",
                      type: "bitflags",
                      flags: [
                        { offset: 0x14, bit: 7, label: "Bob-omb cannon open" },
                      ],
                    },
                    {
                      name: "Score",
                      offset: 0x2c,
                      type: "variable",
                      dataType: "uint8",
                    },
                  ],
                },
              ],
            },
            {
              name: "Dire, Dire Docks",
              flex: true,
              items: [
                {
                  name: "Stars",
                  type: "bitflags",
                  flags: [
                    { offset: 0x14, bit: 0, label: "Board Bowser's Sub" },
                    { offset: 0x14, bit: 1, label: "Chests in the Current" },
                    { offset: 0x14, bit: 2, label: "Pole-Jumping for Red Coins" },
                    { offset: 0x14, bit: 3, label: "Through the Jet Stream" },
                    { offset: 0x14, bit: 4, label: "The Manta Ray's Reward" },
                    { offset: 0x14, bit: 5, label: "Collect the Caps", separator: true },
                    { offset: 0x14, bit: 6, label: "100 Coins" },
                  ],
                },
                {
                  name: "Score",
                  offset: 0x2d,
                  type: "variable",
                  dataType: "uint8",
                },
              ],
            },
            {
              name: "Snowman's Land",
              flex: true,
              items: [
                {
                  name: "Stars",
                  type: "bitflags",
                  flags: [
                    { offset: 0x15, bit: 0, label: "Snowman's Big Head" },
                    { offset: 0x15, bit: 1, label: "Chill with the Bully" },
                    { offset: 0x15, bit: 2, label: "In the Deep Freeze" },
                    { offset: 0x15, bit: 3, label: "Whirl from the Freezing Pond" },
                    { offset: 0x15, bit: 4, label: "Shell Shreddin' for 8 Red Coins" },
                    { offset: 0x15, bit: 5, label: "Into the Igloo", separator: true },
                    { offset: 0x15, bit: 6, label: "100 Coins" },
                  ],
                },
                {
                  type: "section",
                  items: [
                    {
                      name: "Events",
                      type: "bitflags",
                      flags: [
                        { offset: 0x16, bit: 7, label: "Bob-omb cannon open" },
                      ],
                    },
                    {
                      name: "Score",
                      offset: 0x2e,
                      type: "variable",
                      dataType: "uint8",
                    },
                  ],
                },
              ],
            },
            {
              name: "Wet-Dry World",
              flex: true,
              items: [
                {
                  name: "Stars",
                  type: "bitflags",
                  flags: [
                    { offset: 0x16, bit: 0, label: "Shocking Arrow Lifts!" },
                    { offset: 0x16, bit: 1, label: "Top O' The Town" },
                    { offset: 0x16, bit: 2, label: "Secrets in the Shallows & Sky" },
                    { offset: 0x16, bit: 3, label: "Express Elevator-–Hurry Up!" },
                    { offset: 0x16, bit: 4, label: "Go to Town for Red Coins" },
                    { offset: 0x16, bit: 5, label: "Quick Race through Downtown", separator: true },
                    { offset: 0x16, bit: 6, label: "100 Coins" },
                  ],
                },
                {
                  type: "section",
                  items: [
                    {
                      name: "Events",
                      type: "bitflags",
                      flags: [
                        { offset: 0x17, bit: 7, label: "Bob-omb cannon open" },
                      ],
                    },
                    {
                      name: "Score",
                      offset: 0x2f,
                      type: "variable",
                      dataType: "uint8",
                    },
                  ],
                },
              ],
            },
            {
              name: "Tall, Tall Mountain",
              flex: true,
              items: [
                {
                  name: "Stars",
                  type: "bitflags",
                  flags: [
                    { offset: 0x17, bit: 0, label: "Scale the Mountain" },
                    { offset: 0x17, bit: 1, label: "Mystery of the Monkey Cage" },
                    { offset: 0x17, bit: 2, label: "Scary 'Shrooms, Red Coins" },
                    { offset: 0x17, bit: 3, label: "Mysterious Mountainside" },
                    { offset: 0x17, bit: 4, label: "Breathtaking View from Bridge" },
                    { offset: 0x17, bit: 5, label: "Blast to the Lonely Mushroom", separator: true },
                    { offset: 0x17, bit: 6, label: "100 Coins" },
                  ],
                },
                {
                  type: "section",
                  items: [
                    {
                      name: "Events",
                      type: "bitflags",
                      flags: [
                        { offset: 0x18, bit: 7, label: "Bob-omb cannon open" },
                      ],
                    },
                    {
                      name: "Score",
                      offset: 0x30,
                      type: "variable",
                      dataType: "uint8",
                    },
                  ],
                },
              ],
            },
            {
              name: "Tiny-Huge Island",
              flex: true,
              items: [
                {
                  name: "Stars",
                  type: "bitflags",
                  flags: [
                    { offset: 0x18, bit: 0, label: "Pluck the Piranha Flower" },
                    { offset: 0x18, bit: 1, label: "The Tip Top of the Huge Island" },
                    { offset: 0x18, bit: 2, label: "Rematch with Koopa the Quick" },
                    { offset: 0x18, bit: 3, label: "Five Itty Bitty Secrets" },
                    { offset: 0x18, bit: 4, label: "Wiggler's Red Coins" },
                    { offset: 0x18, bit: 5, label: "Make Wiggler Squirm", separator: true },
                    { offset: 0x18, bit: 6, label: "100 Coins" },
                  ],
                },
                {
                  type: "section",
                  items: [
                    {
                      name: "Events",
                      type: "bitflags",
                      flags: [
                        { offset: 0x19, bit: 7, label: "Bob-omb cannon open" },
                      ],
                    },
                    {
                      name: "Score",
                      offset: 0x31,
                      type: "variable",
                      dataType: "uint8",
                    },
                  ],
                },
              ],
            },
            {
              name: "Tick Tock Clock",
              flex: true,
              items: [
                {
                  name: "Stars",
                  type: "bitflags",
                  flags: [
                    { offset: 0x19, bit: 0, label: "Roll Into the Cage" },
                    { offset: 0x19, bit: 1, label: "The Pit and the Pendulums" },
                    { offset: 0x19, bit: 2, label: "Get a Hand" },
                    { offset: 0x19, bit: 3, label: "Stomp on the Thwomp" },
                    { offset: 0x19, bit: 4, label: "Timed Jumps on Moving Bars" },
                    { offset: 0x19, bit: 5, label: "Stop Time for Red Coins", separator: true },
                    { offset: 0x19, bit: 6, label: "100 Coins" },
                  ],
                },
                {
                  name: "Score",
                  offset: 0x32,
                  type: "variable",
                  dataType: "uint8",
                },
              ],
            },
            {
              name: "Rainbow Ride",
              flex: true,
              items: [
                {
                  name: "Stars",
                  type: "bitflags",
                  flags: [
                    { offset: 0x1a, bit: 0, label: "Cruiser Crossing the Rainbow" },
                    { offset: 0x1a, bit: 1, label: "The Big House in the Sky" },
                    { offset: 0x1a, bit: 2, label: "Coins Amassed in a Maze" },
                    { offset: 0x1a, bit: 3, label: "Swingin' in the Breeze" },
                    { offset: 0x1a, bit: 4, label: "Tricky Triangles!" },
                    { offset: 0x1a, bit: 5, label: "Somewhere Over the Rainbow", separator: true },
                    { offset: 0x1a, bit: 6, label: "100 Coins" },
                  ],
                },
                {
                  type: "section",
                  items: [
                    {
                      name: "Events",
                      type: "bitflags",
                      flags: [
                        { offset: 0x1b, bit: 7, label: "Bob-omb cannon open" },
                      ],
                    },
                    {
                      name: "Score",
                      offset: 0x33,
                      type: "variable",
                      dataType: "uint8",
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
    capLocations: {
      0x0: "On Mario's Head",
      0x1: "On the Ground",
      0x2: "In the talons of Klepto",
      0x4: "On Ukiki's Head",
      0x8: "On Mr. Blizzard's Head",
    },
    courses: {
      0x0: "-",
      ...courses,
    },
    languages: {
      0x0: "English",
      0x1: "French",
      0x2: "German",
    },
    rankings: {
      0x0: "Newest",
      0x1: "Moderately New",
      0x2: "Moderately Old",
      0x3: "Oldest",
    },
    sounds: {
      0x0: "Stereo",
      0x1: "Mono",
      0x2: "Headset",
    },
  },
};

export default template;
