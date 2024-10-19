import type { GameJson, ItemInt, ItemTab } from "$lib/types";

import { dataSpecialTypes, eventMatches, trophies } from "../utils/resource";

const template: GameJson = {
  validator: {
    regions: {
      europe: {
        0x0: [0x47, 0x41, 0x4c, 0x50, 0x30, 0x31], // "GALP01"
      },
    },
    text: "Drag 'n' drop here or click to add a save file.",
    error: "Not a valid save file.",
  },
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
                  name: "Coins",
                  offset: 0x1e0,
                  type: "variable",
                  dataType: "uint32",
                  bigEndian: true,
                  operations: [{ "/": 10 }, { roundFloor: 0 }],
                  max: 9999,
                },
              ],
            },
            {
              type: "section",
              flex: true,
              items: [
                {
                  name: "Unlocked Challengers",
                  type: "bitflags",
                  flags: [
                    { offset: 0x1, bit: 7, label: "Dr. Mario" }, // prettier-ignore
                    { offset: 0x1, bit: 1, label: "Luigi" }, // prettier-ignore
                    { offset: 0x0, bit: 2, label: "Ganondorf" }, // prettier-ignore
                    { offset: 0x1, bit: 5, label: "Falco" }, // prettier-ignore
                    { offset: 0x1, bit: 6, label: "Young Link" }, // prettier-ignore
                    { offset: 0x0, bit: 1, label: "Pichu" }, // prettier-ignore
                    { offset: 0x1, bit: 4, label: "Jigglypuff" }, // prettier-ignore
                    { offset: 0x1, bit: 3, label: "Mewtwo" }, // prettier-ignore
                    { offset: 0x1, bit: 0, label: "Mr. Game & Watch" }, // prettier-ignore
                    { offset: 0x1, bit: 2, label: "Marth" }, // prettier-ignore
                    { offset: 0x0, bit: 0, label: "Roy" }, // prettier-ignore
                    { offset: 0x0, bit: 3, label: "???", hidden: true }, // prettier-ignore
                    { offset: 0x0, bit: 4, label: "???", hidden: true }, // prettier-ignore
                    { offset: 0x0, bit: 5, label: "???", hidden: true }, // prettier-ignore
                    { offset: 0x0, bit: 6, label: "???", hidden: true }, // prettier-ignore
                    { offset: 0x0, bit: 7, label: "???", hidden: true }, // prettier-ignore
                  ],
                },
                {
                  name: "Unlocked Stages",
                  type: "bitflags",
                  flags: [
                    { offset: 0x3, bit: 5, label: "Flat Zone" }, // prettier-ignore
                    { offset: 0x3, bit: 0, label: "Brinstar Depths" }, // prettier-ignore
                    { offset: 0x3, bit: 3, label: "Fourside" }, // prettier-ignore
                    { offset: 0x3, bit: 2, label: "Big Blue" }, // prettier-ignore
                    { offset: 0x3, bit: 1, label: "Poké Floats" }, // prettier-ignore
                    { offset: 0x3, bit: 4, label: "Mushroom Kingdom II" }, // prettier-ignore
                    { offset: 0x3, bit: 6, label: "Battlefield" }, // prettier-ignore
                    { offset: 0x3, bit: 7, label: "Final Destination" }, // prettier-ignore
                    { offset: 0x2, bit: 0, label: "Dream Land N64" }, // prettier-ignore
                    { offset: 0x2, bit: 1, label: "Yoshi's Island N64" }, // prettier-ignore
                    { offset: 0x2, bit: 2, label: "Kongo Jungle N64" }, // prettier-ignore
                    { offset: 0x2, bit: 3, label: "???", hidden: true }, // prettier-ignore
                    { offset: 0x2, bit: 4, label: "???", hidden: true }, // prettier-ignore
                    { offset: 0x2, bit: 5, label: "???", hidden: true }, // prettier-ignore
                    { offset: 0x2, bit: 6, label: "???", hidden: true }, // prettier-ignore
                    { offset: 0x2, bit: 7, label: "???", hidden: true }, // prettier-ignore
                  ],
                },
                {
                  name: "Unlocked Options",
                  type: "bitflags",
                  flags: [
                    { offset: 0x5, bit: 0, label: "???", hidden: true }, // prettier-ignore
                    { offset: 0x5, bit: 1, label: "???", hidden: true }, // prettier-ignore
                    { offset: 0x5, bit: 2, label: "???", hidden: true }, // prettier-ignore
                    { offset: 0x5, bit: 3, label: "???", hidden: true }, // prettier-ignore
                    { offset: 0x5, bit: 4, label: "???", hidden: true }, // prettier-ignore
                    { offset: 0x5, bit: 5, label: "???", hidden: true }, // prettier-ignore
                    { offset: 0x5, bit: 6, label: "???", hidden: true }, // prettier-ignore
                    { offset: 0x5, bit: 7, label: "???", hidden: true }, // prettier-ignore
                    { offset: 0x4, bit: 0, label: "Score Display" }, // prettier-ignore
                    { offset: 0x4, bit: 1, label: "Random Stage" }, // prettier-ignore
                    { offset: 0x4, bit: 2, label: "All-Star" }, // prettier-ignore
                    { offset: 0x4, bit: 3, label: "Sound Test" }, // prettier-ignore
                    { offset: 0x4, bit: 4, label: "???", hidden: true }, // prettier-ignore
                    { offset: 0x4, bit: 5, label: "???", hidden: true }, // prettier-ignore
                    { offset: 0x4, bit: 6, label: "???", hidden: true }, // prettier-ignore
                    { offset: 0x4, bit: 7, label: "???", hidden: true }, // prettier-ignore
                  ],
                },
              ],
            },
          ],
        },
        {
          name: "1-P Mode",
          items: [
            {
              type: "tabs",
              items: [
                {
                  name: "Event Match",
                  items: [
                    {
                      type: "tabs",
                      vertical: true,
                      items: eventMatches.map(
                        (range) =>
                          ({
                            name: range.name,
                            items: range.matches.map((match) => ({
                              name: match.name,
                              type: "section",
                              flex: true,
                              items: [
                                {
                                  name: "Progression",
                                  offset: 0x207 - Math.floor(match.index / 8),
                                  type: "variable",
                                  dataType: "bit",
                                  bit: match.index % 8,
                                  resource: "progressions",
                                },
                                (match.type === "Time" && {
                                  name: "Time",
                                  type: "group",
                                  mode: "chrono",
                                  items: [
                                    {
                                      offset: 0x208 + match.index * 0x4,
                                      type: "variable",
                                      dataType: "uint32",
                                      bigEndian: true,
                                      operations: [
                                        { "/": 60 },
                                        {
                                          convert: {
                                            from: "seconds",
                                            to: "minutes",
                                          },
                                        },
                                      ],
                                      max: 59,
                                    },
                                    {
                                      offset: 0x208 + match.index * 0x4,
                                      type: "variable",
                                      dataType: "uint32",
                                      bigEndian: true,
                                      operations: [
                                        { "/": 60 },
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
                                    {
                                      offset: 0x208 + match.index * 0x4,
                                      type: "variable",
                                      dataType: "uint32",
                                      bigEndian: true,
                                      operations: [
                                        { "/": 60 },
                                        {
                                          convert: {
                                            from: "seconds",
                                            to: "milliseconds",
                                          },
                                        },
                                        { round: 0 },
                                      ],
                                      leadingZeros: 2,
                                      max: 999,
                                      step: 100,
                                    },
                                  ],
                                }) || {
                                  name: match.type,
                                  offset: 0x208 + match.index * 0x4,
                                  type: "variable",
                                  dataType: "int32",
                                  bigEndian: true,
                                  min: 0,
                                },
                              ],
                            })),
                          }) as ItemTab,
                      ),
                    },
                  ],
                },
              ],
            },
          ],
        },
        {
          name: "VS. Mode",
          items: [
            {
              type: "tabs",
              items: [
                {
                  name: "Item Switch",
                  items: [
                    {
                      type: "section",
                      items: [
                        { name: "Frequency", offset: 0x448, type: "variable", dataType: "uint8", resource: 'frequencies' }, // prettier-ignore
                      ],
                    },
                    {
                      type: "section",
                      flex: true,
                      items: [
                        {
                          type: "bitflags",
                          flags: [
                            { offset: 0x457, bit: 5, label: "Food" }, // prettier-ignore
                            { offset: 0x455, bit: 2, label: "Maxim Tomato" }, // prettier-ignore
                            { offset: 0x456, bit: 2, label: "Heart Container" }, // prettier-ignore
                            { offset: 0x454, bit: 6, label: "Warp Star" }, // prettier-ignore
                            { offset: 0x456, bit: 5, label: "Ray Gun" }, // prettier-ignore
                            { offset: 0x454, bit: 0, label: "Super Scope" }, // prettier-ignore
                            { offset: 0x457, bit: 3, label: "Fire Flower" }, // prettier-ignore
                            { offset: 0x456, bit: 6, label: "Lip's Stick" }, // prettier-ignore
                            { offset: 0x455, bit: 7, label: "Star Rod" }, // prettier-ignore
                            { offset: 0x454, bit: 3, label: "Beam Sword" }, // prettier-ignore
                            { offset: 0x457, bit: 1, label: "Home-Run Bat" }, // prettier-ignore
                            { offset: 0x456, bit: 1, label: "Fan" }, // prettier-ignore
                            { offset: 0x456, bit: 0, label: "Hammer" }, // prettier-ignore
                            { offset: 0x457, bit: 7, label: "Green Shell" }, // prettier-ignore
                            { offset: 0x455, bit: 5, label: "Red Shell" }, // prettier-ignore
                            { offset: 0x457, bit: 4, label: "Flipper" }, // prettier-ignore
                          ],
                        },
                        {
                          type: "bitflags",
                          flags: [
                            { offset: 0x457, bit: 6, label: "Freezie" }, // prettier-ignore
                            { offset: 0x457, bit: 2, label: "Mr. Saturn" }, // prettier-ignore
                            { offset: 0x456, bit: 7, label: "Poké Ball" }, // prettier-ignore
                            { offset: 0x457, bit: 0, label: "Bob-omb" }, // prettier-ignore
                            { offset: 0x455, bit: 1, label: "Proximity Mine" }, // prettier-ignore
                            { offset: 0x456, bit: 3, label: "Super Mushroom" }, // prettier-ignore
                            { offset: 0x454, bit: 7, label: "Poison Mushroom" }, // prettier-ignore
                            { offset: 0x454, bit: 2, label: "Starman" }, // prettier-ignore
                            { offset: 0x455, bit: 4, label: "Parasol" }, // prettier-ignore
                            { offset: 0x454, bit: 1, label: "Screw Attack" }, // prettier-ignore
                            { offset: 0x455, bit: 0, label: "Metal Box" }, // prettier-ignore
                            { offset: 0x455, bit: 6, label: "Bunny Hood" }, // prettier-ignore
                            { offset: 0x455, bit: 3, label: "Cloaking Device" }, // prettier-ignore
                            { offset: 0x454, bit: 5, label: "Barrel Cannon" }, // prettier-ignore
                            { offset: 0x456, bit: 4, label: "Party Ball" }, // prettier-ignore
                            { offset: 0x454, bit: 4, label: "???", hidden: true }, // prettier-ignore
                          ],
                        },
                      ],
                    },
                  ],
                },
                {
                  name: "Random Stage",
                  flex: true,
                  items: [
                    {
                      type: "bitflags",
                      flags: [
                        { offset: 0x463, bit: 0, label: "Princess Peach's Castle" }, // prettier-ignore
                        { offset: 0x463, bit: 1, label: "Kongo Jungle" }, // prettier-ignore
                        { offset: 0x463, bit: 2, label: "Great Bay" }, // prettier-ignore
                        { offset: 0x463, bit: 3, label: "Brinstar" }, // prettier-ignore
                        { offset: 0x463, bit: 4, label: "Yoshi's Story" }, // prettier-ignore
                        { offset: 0x463, bit: 5, label: "Fountain of Dreams" }, // prettier-ignore
                        { offset: 0x463, bit: 6, label: "Corneria" }, // prettier-ignore
                        { offset: 0x463, bit: 7, label: "Pokémon Stadium" }, // prettier-ignore
                        { offset: 0x462, bit: 0, label: "Mute City" }, // prettier-ignore
                        { offset: 0x462, bit: 1, label: "Onett" }, // prettier-ignore
                        { offset: 0x462, bit: 3, label: "Mushroom Kingdom" }, // prettier-ignore
                        { offset: 0x462, bit: 2, label: "Icicle Mountain" }, // prettier-ignore
                        { offset: 0x460, bit: 0, label: "Battlefield" }, // prettier-ignore
                        { offset: 0x460, bit: 2, label: "Dream Land N64" }, // prettier-ignore
                        { offset: 0x460, bit: 4, label: "Kongo Jungle N64" }, // prettier-ignore
                      ],
                    },
                    {
                      type: "bitflags",
                      flags: [
                        { offset: 0x462, bit: 4, label: "Rainbow Ride" }, // prettier-ignore
                        { offset: 0x462, bit: 5, label: "Jungle Japes" }, // prettier-ignore
                        { offset: 0x462, bit: 6, label: "Temple" }, // prettier-ignore
                        { offset: 0x462, bit: 7, label: "Brinstar Depths" }, // prettier-ignore
                        { offset: 0x461, bit: 0, label: "Yoshi's Island" }, // prettier-ignore
                        { offset: 0x461, bit: 1, label: "Green Greens" }, // prettier-ignore
                        { offset: 0x461, bit: 2, label: "Venom" }, // prettier-ignore
                        { offset: 0x461, bit: 3, label: "Poké Floats" }, // prettier-ignore
                        { offset: 0x461, bit: 4, label: "Big Blue" }, // prettier-ignore
                        { offset: 0x461, bit: 5, label: "Fourside" }, // prettier-ignore
                        { offset: 0x461, bit: 6, label: "Mushroom Kingdom II" }, // prettier-ignore
                        { offset: 0x461, bit: 7, label: "Flat Zone" }, // prettier-ignore
                        { offset: 0x460, bit: 1, label: "Final Destination" }, // prettier-ignore
                        { offset: 0x460, bit: 3, label: "Yoshi's Island N64" }, // prettier-ignore
                        { offset: 0x460, bit: 5, label: "???", hidden: true }, // prettier-ignore
                        { offset: 0x460, bit: 6, label: "???", hidden: true }, // prettier-ignore
                        { offset: 0x460, bit: 7, label: "???", hidden: true }, // prettier-ignore
                      ],
                    },
                  ],
                },
              ],
            },
          ],
        },
        {
          name: "Trophies",
          items: [
            {
              type: "section",
              items: [
                { name: "Count", offset: 0x468, type: "variable", dataType: "uint16", bigEndian: true, disabled: true }, // prettier-ignore
              ],
            },
            {
              name: "Pools",
              type: "bitflags",
              hidden: true,
              flags: [
                { offset: 0x46b, bit: 0, label: "???", hidden: true }, // prettier-ignore
                { offset: 0x46b, bit: 1, label: "???", hidden: true }, // prettier-ignore
                { offset: 0x46b, bit: 2, label: "Pool 1" }, // prettier-ignore
                { offset: 0x46b, bit: 3, label: "???", hidden: true }, // prettier-ignore
                { offset: 0x46b, bit: 4, label: "Pool 2" }, // prettier-ignore
                { offset: 0x46b, bit: 5, label: "Pool 3" }, // prettier-ignore
                { offset: 0x46b, bit: 6, label: "Pool 4" }, // prettier-ignore
                { offset: 0x46b, bit: 7, label: "Pool 5" }, // prettier-ignore
              ],
            },
            {
              type: "section",
              flex: true,
              items: Object.values(trophies).reduce(
                (trophies: ItemInt[], trophy, index) => {
                  trophies.push(
                    {
                      id: `trophy-${index}`,
                      name: trophy,
                      offset: 0x46d + index * 0x2,
                      type: "variable",
                      dataType: "uint8",
                    },
                    {
                      name: trophy,
                      offset:
                        0x2f3 +
                        Math.floor(index / 0x20) * 0x8 -
                        Math.floor(index / 8),
                      type: "variable",
                      dataType: "bit",
                      bit: index % 8,
                      hidden: true,
                    },
                  );

                  return trophies;
                },
                [],
              ),
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
                { name: "P1 Rumble", offset: 0x458, type: "variable", dataType: "uint8", resource: "optionBoolean" }, // prettier-ignore
                { name: "P2 Rumble", offset: 0x459, type: "variable", dataType: "uint8", resource: "optionBoolean" }, // prettier-ignore
                { name: "P3 Rumble", offset: 0x45a, type: "variable", dataType: "uint8", resource: "optionBoolean" }, // prettier-ignore
                { name: "P4 Rumble", offset: 0x45b, type: "variable", dataType: "uint8", resource: "optionBoolean" }, // prettier-ignore
              ],
            },
            {
              type: "section",
              flex: true,
              items: [
                { name: "Sounds <> Music", offset: 0x45c, type: "variable", dataType: "int8", hidden: true }, // prettier-ignore
                { id: "sounds", name: "Sounds", offset: 0x45c, type: "variable", dataType: "uint8", max: 200 }, // prettier-ignore
                { id: "music", name: "Music", offset: 0x45c, type: "variable", dataType: "uint8", max: 200 }, // prettier-ignore
              ],
            },
            {
              type: "section",
              flex: true,
              items: [
                { name: "Screen Deflicker", offset: 0x45d, type: "variable", dataType: "uint8", resource: "optionBoolean" }, // prettier-ignore
              ],
            },
            {
              type: "section",
              flex: true,
              items: [
                { name: "Language", offset: 0x45e, type: "variable", dataType: "uint8", resource: 'languages' }, // prettier-ignore
              ],
            },
          ],
        },
        {
          name: "Data",
          items: [
            {
              type: "tabs",
              items: [
                {
                  name: "Bonus Records",
                  flex: true,
                  items: [
                    {
                      type: "bitflags",
                      flags: [
                        { offset: 0x423, bit: 0, label: "Bird of Prey" }, // prettier-ignore
                        { offset: 0x423, bit: 1, label: "Combo King" }, // prettier-ignore
                        { offset: 0x423, bit: 2, label: "Juggler" }, // prettier-ignore
                        { offset: 0x423, bit: 3, label: "Backstabber" }, // prettier-ignore
                        { offset: 0x423, bit: 4, label: "Sweeper" }, // prettier-ignore
                        { offset: 0x423, bit: 5, label: "Clean Sweep" }, // prettier-ignore
                        { offset: 0x423, bit: 6, label: "Meteor Smash" }, // prettier-ignore
                        { offset: 0x423, bit: 7, label: "Meteor Clear" }, // prettier-ignore
                        { offset: 0x422, bit: 0, label: "Meteor Master" }, // prettier-ignore
                        { offset: 0x422, bit: 1, label: "Crash & Burn" }, // prettier-ignore
                        { offset: 0x422, bit: 2, label: "Meteor Survivor" }, // prettier-ignore
                        { offset: 0x422, bit: 3, label: "Flying Meteor" }, // prettier-ignore
                        { offset: 0x422, bit: 4, label: "Exceptional Aim" }, // prettier-ignore
                        { offset: 0x422, bit: 5, label: "Perfect Aim" }, // prettier-ignore
                        { offset: 0x422, bit: 6, label: "All Ground" }, // prettier-ignore
                        { offset: 0x422, bit: 7, label: "All Aerial" }, // prettier-ignore
                        { offset: 0x421, bit: 0, label: "All Variations" }, // prettier-ignore
                        { offset: 0x421, bit: 1, label: "All on One" }, // prettier-ignore
                        { offset: 0x421, bit: 2, label: "Lethal Weapon" }, // prettier-ignore
                        { offset: 0x421, bit: 3, label: "Berseker" }, // prettier-ignore
                      ],
                    },
                    {
                      type: "bitflags",
                      flags: [
                        { offset: 0x421, bit: 4, label: "Smash King" }, // prettier-ignore
                        { offset: 0x421, bit: 5, label: "Smash Maniac" }, // prettier-ignore
                        { offset: 0x421, bit: 6, label: "Smash-less" }, // prettier-ignore
                        { offset: 0x421, bit: 7, label: "Specialist" }, // prettier-ignore
                        { offset: 0x420, bit: 0, label: "Dedicated Specialist" }, // prettier-ignore
                        { offset: 0x420, bit: 1, label: "One-Two Punch" }, // prettier-ignore
                        { offset: 0x420, bit: 2, label: "First Strike" }, // prettier-ignore
                        { offset: 0x420, bit: 3, label: "150% Damage" }, // prettier-ignore
                        { offset: 0x420, bit: 4, label: "200% Damage" }, // prettier-ignore
                        { offset: 0x420, bit: 5, label: "250% Damage" }, // prettier-ignore
                        { offset: 0x420, bit: 6, label: "300% Damage" }, // prettier-ignore
                        { offset: 0x420, bit: 7, label: "350% Damage" }, // prettier-ignore
                        { offset: 0x427, bit: 0, label: "Heavy Damage" }, // prettier-ignore
                        { offset: 0x427, bit: 1, label: "Sniper" }, // prettier-ignore
                        { offset: 0x427, bit: 2, label: "Brawler" }, // prettier-ignore
                        { offset: 0x427, bit: 3, label: "Precise Aim" }, // prettier-ignore
                        { offset: 0x427, bit: 4, label: "Pitcher" }, // prettier-ignore
                        { offset: 0x427, bit: 5, label: "Butterfingers" }, // prettier-ignore
                        { offset: 0x427, bit: 6, label: "All Thumbs" }, // prettier-ignore
                        { offset: 0x427, bit: 7, label: "Cuddly Bear" }, // prettier-ignore
                      ],
                    },
                    {
                      type: "bitflags",
                      flags: [
                        { offset: 0x426, bit: 0, label: "Compass Tosser" }, // prettier-ignore
                        { offset: 0x426, bit: 1, label: "Pool Shark" }, // prettier-ignore
                        { offset: 0x426, bit: 2, label: "Throw Down" }, // prettier-ignore
                        { offset: 0x426, bit: 3, label: "Pummeler" }, // prettier-ignore
                        { offset: 0x426, bit: 4, label: "Fists of Fury" }, // prettier-ignore
                        { offset: 0x426, bit: 5, label: "Close Call" }, // prettier-ignore
                        { offset: 0x426, bit: 6, label: "Opportunist" }, // prettier-ignore
                        { offset: 0x426, bit: 7, label: "Spectator" }, // prettier-ignore
                        { offset: 0x425, bit: 0, label: "Statue" }, // prettier-ignore
                        { offset: 0x425, bit: 1, label: "Never Look Back" }, // prettier-ignore
                        { offset: 0x425, bit: 2, label: "Stiff Knees" }, // prettier-ignore
                        { offset: 0x425, bit: 3, label: "Run, Don't Walk" }, // prettier-ignore
                        { offset: 0x425, bit: 4, label: "Ambler" }, // prettier-ignore
                        { offset: 0x425, bit: 5, label: "No Hurry" }, // prettier-ignore
                        { offset: 0x425, bit: 6, label: "Marathon Man" }, // prettier-ignore
                        { offset: 0x425, bit: 7, label: "Eagle" }, // prettier-ignore
                        { offset: 0x424, bit: 0, label: "Aerialist" }, // prettier-ignore
                        { offset: 0x424, bit: 1, label: "Acrobat" }, // prettier-ignore
                        { offset: 0x424, bit: 2, label: "Cement Shoes" }, // prettier-ignore
                        { offset: 0x424, bit: 3, label: "Head Banger" }, // prettier-ignore
                      ],
                    },
                    {
                      type: "bitflags",
                      flags: [
                        { offset: 0x424, bit: 4, label: "Elbow Room" }, // prettier-ignore
                        { offset: 0x424, bit: 5, label: "Power Shielder" }, // prettier-ignore
                        { offset: 0x424, bit: 6, label: "Shield Buster" }, // prettier-ignore
                        { offset: 0x424, bit: 7, label: "Shattered Shield" }, // prettier-ignore
                        { offset: 0x42b, bit: 0, label: "Shield Stupidity" }, // prettier-ignore
                        { offset: 0x42b, bit: 1, label: "Shield Saver" }, // prettier-ignore
                        { offset: 0x42b, bit: 2, label: "Deflector" }, // prettier-ignore
                        { offset: 0x42b, bit: 3, label: "Ricochet Rifler" }, // prettier-ignore
                        { offset: 0x42b, bit: 4, label: "Skid Master" }, // prettier-ignore
                        { offset: 0x42b, bit: 5, label: "Rock Climber" }, // prettier-ignore
                        { offset: 0x42b, bit: 6, label: "Edge Hog" }, // prettier-ignore
                        { offset: 0x42b, bit: 7, label: "Cliffhanger" }, // prettier-ignore
                        { offset: 0x42a, bit: 0, label: "Life on the Edge" }, // prettier-ignore
                        { offset: 0x42a, bit: 1, label: "Poser" }, // prettier-ignore
                        { offset: 0x42a, bit: 2, label: "Poser Poseur" }, // prettier-ignore
                        { offset: 0x42a, bit: 3, label: "Poser Power" }, // prettier-ignore
                        { offset: 0x42a, bit: 4, label: "Pose Breaker" }, // prettier-ignore
                        { offset: 0x42a, bit: 5, label: "Instant Poser" }, // prettier-ignore
                        { offset: 0x43c, bit: 1, label: "Control Freak" }, // prettier-ignore
                        { offset: 0x42a, bit: 6, label: "Button Masher" }, // prettier-ignore
                      ],
                    },
                    {
                      type: "bitflags",
                      flags: [
                        { offset: 0x42a, bit: 7, label: "Button Holder" }, // prettier-ignore
                        { offset: 0x429, bit: 0, label: "Rock Steady" }, // prettier-ignore
                        { offset: 0x429, bit: 1, label: "Pratfaller" }, // prettier-ignore
                        { offset: 0x429, bit: 2, label: "Face Planter" }, // prettier-ignore
                        { offset: 0x429, bit: 3, label: "Twinkle Toes" }, // prettier-ignore
                        { offset: 0x429, bit: 4, label: "Floor Diver" }, // prettier-ignore
                        { offset: 0x429, bit: 5, label: "No R 4 U" }, // prettier-ignore
                        { offset: 0x429, bit: 6, label: "Climactic Clash" }, // prettier-ignore
                        { offset: 0x429, bit: 7, label: "Floored" }, // prettier-ignore
                        { offset: 0x428, bit: 0, label: "Punching Bag" }, // prettier-ignore
                        { offset: 0x428, bit: 1, label: "Stale Moves" }, // prettier-ignore
                        { offset: 0x428, bit: 2, label: "Blind Eye" }, // prettier-ignore
                        { offset: 0x428, bit: 3, label: "Crowd Favorite" }, // prettier-ignore
                        { offset: 0x428, bit: 4, label: "Master of Suspense" }, // prettier-ignore
                        { offset: 0x428, bit: 5, label: "Lost in Space" }, // prettier-ignore
                        { offset: 0x428, bit: 6, label: "Lost Luggage" }, // prettier-ignore
                        { offset: 0x428, bit: 7, label: "Half-Minute Man" }, // prettier-ignore
                        { offset: 0x42f, bit: 0, label: "Pacifist" }, // prettier-ignore
                        { offset: 0x43c, bit: 2, label: "Peaceful Warrior" }, // prettier-ignore
                        { offset: 0x42f, bit: 1, label: "Moment of Silence" }, // prettier-ignore
                      ],
                    },
                    {
                      type: "bitflags",
                      flags: [
                        { offset: 0x42f, bit: 2, label: "Impervious" }, // prettier-ignore
                        { offset: 0x42f, bit: 3, label: "Immortal" }, // prettier-ignore
                        { offset: 0x42f, bit: 4, label: "Switzerland" }, // prettier-ignore
                        { offset: 0x42f, bit: 5, label: "Predator" }, // prettier-ignore
                        { offset: 0x43c, bit: 3, label: "Down, But Not Out" }, // prettier-ignore
                        { offset: 0x42f, bit: 6, label: "Solar Being" }, // prettier-ignore
                        { offset: 0x42f, bit: 7, label: "Stalker" }, // prettier-ignore
                        { offset: 0x42e, bit: 0, label: "Bully" }, // prettier-ignore
                        { offset: 0x42e, bit: 1, label: "Coward" }, // prettier-ignore
                        { offset: 0x42e, bit: 2, label: "In the Fray" }, // prettier-ignore
                        { offset: 0x42e, bit: 3, label: "Friendly Foe" }, // prettier-ignore
                        { offset: 0x42e, bit: 4, label: "Center Stage" }, // prettier-ignore
                        { offset: 0x43c, bit: 4, label: "Merciful Master" }, // prettier-ignore
                        { offset: 0x42e, bit: 5, label: "Star KO" }, // prettier-ignore
                        { offset: 0x43c, bit: 5, label: "Rocket KO" }, // prettier-ignore
                        { offset: 0x42e, bit: 6, label: "Wimpy KO" }, // prettier-ignore
                        { offset: 0x42e, bit: 7, label: "Bull's-eye KO" }, // prettier-ignore
                        { offset: 0x42d, bit: 0, label: "Poser KO" }, // prettier-ignore
                        { offset: 0x42d, bit: 1, label: "Cheap KO" }, // prettier-ignore
                        { offset: 0x42d, bit: 2, label: "Bank-Shot KO" }, // prettier-ignore
                      ],
                    },
                    {
                      type: "bitflags",
                      flags: [
                        { offset: 0x42d, bit: 3, label: "Timely KO" }, // prettier-ignore
                        { offset: 0x42d, bit: 4, label: "Special KO" }, // prettier-ignore
                        { offset: 0x42d, bit: 5, label: "Hangman's KO" }, // prettier-ignore
                        { offset: 0x42d, bit: 6, label: "KO 64" }, // prettier-ignore
                        { offset: 0x42d, bit: 7, label: "Bubble-Blast KO" }, // prettier-ignore
                        { offset: 0x42c, bit: 0, label: "Sacrificial KO" }, // prettier-ignore
                        { offset: 0x42c, bit: 1, label: "Avenger KO" }, // prettier-ignore
                        { offset: 0x42c, bit: 2, label: "Double KO" }, // prettier-ignore
                        { offset: 0x42c, bit: 3, label: "Triple KO" }, // prettier-ignore
                        { offset: 0x42c, bit: 4, label: "Quadruple KO" }, // prettier-ignore
                        { offset: 0x42c, bit: 5, label: "Quintuple KO" }, // prettier-ignore
                        { offset: 0x42c, bit: 6, label: "Dead-Weight KO" }, // prettier-ignore
                        { offset: 0x42c, bit: 7, label: "Kiss-the-Floor KO" }, // prettier-ignore
                        { offset: 0x433, bit: 0, label: "Assisted KO" }, // prettier-ignore
                        { offset: 0x433, bit: 1, label: "Foresight" }, // prettier-ignore
                        { offset: 0x433, bit: 2, label: "First to Fall" }, // prettier-ignore
                        { offset: 0x433, bit: 3, label: "Cliff Diver" }, // prettier-ignore
                        { offset: 0x433, bit: 4, label: "Quitter" }, // prettier-ignore
                        { offset: 0x433, bit: 5, label: "Shameful Fall" }, // prettier-ignore
                        { offset: 0x433, bit: 6, label: "World Traveler" }, // prettier-ignore
                      ],
                    },
                    {
                      type: "bitflags",
                      flags: [
                        { offset: 0x433, bit: 7, label: "Ground Pounded" }, // prettier-ignore
                        { offset: 0x432, bit: 0, label: "Environmental Hazard" }, // prettier-ignore
                        { offset: 0x432, bit: 1, label: "Angelic" }, // prettier-ignore
                        { offset: 0x432, bit: 2, label: "Magnified Finish" }, // prettier-ignore
                        { offset: 0x432, bit: 3, label: "Fighter Stance" }, // prettier-ignore
                        { offset: 0x432, bit: 4, label: "Mystic" }, // prettier-ignore
                        { offset: 0x432, bit: 5, label: "Shooting Star" }, // prettier-ignore
                        { offset: 0x432, bit: 6, label: "Lucky Number Seven" }, // prettier-ignore
                        { offset: 0x432, bit: 7, label: "Last Second" }, // prettier-ignore
                        { offset: 0x431, bit: 0, label: "Lucky Threes" }, // prettier-ignore
                        { offset: 0x431, bit: 1, label: "Jackpot" }, // prettier-ignore
                        { offset: 0x431, bit: 2, label: "Full Power" }, // prettier-ignore
                        { offset: 0x431, bit: 3, label: "Item-less" }, // prettier-ignore
                        { offset: 0x431, bit: 4, label: "Item Specialist" }, // prettier-ignore
                        { offset: 0x431, bit: 5, label: "Item Chucker" }, // prettier-ignore
                        { offset: 0x431, bit: 6, label: "Item Smasher" }, // prettier-ignore
                        { offset: 0x431, bit: 7, label: "Capsule KO" }, // prettier-ignore
                        { offset: 0x430, bit: 0, label: "Carrier KO" }, // prettier-ignore
                        { offset: 0x430, bit: 1, label: "Weight Lifter" }, // prettier-ignore
                        { offset: 0x430, bit: 2, label: "Item Catcher" }, // prettier-ignore
                      ],
                    },
                    {
                      type: "bitflags",
                      flags: [
                        { offset: 0x430, bit: 3, label: "Reciprocator" }, // prettier-ignore
                        { offset: 0x430, bit: 4, label: "Item Self-Destruct" }, // prettier-ignore
                        { offset: 0x430, bit: 5, label: "Triple Items" }, // prettier-ignore
                        { offset: 0x43c, bit: 6, label: "Minimalist" }, // prettier-ignore
                        { offset: 0x43c, bit: 7, label: "Materialist" }, // prettier-ignore
                        { offset: 0x430, bit: 6, label: "Item Hog" }, // prettier-ignore
                        { offset: 0x430, bit: 7, label: "Item Collector" }, // prettier-ignore
                        { offset: 0x437, bit: 0, label: "Connoisseur" }, // prettier-ignore
                        { offset: 0x437, bit: 1, label: "Gourmet" }, // prettier-ignore
                        { offset: 0x437, bit: 2, label: "Battering Ram" }, // prettier-ignore
                        { offset: 0x437, bit: 3, label: "Straight Shooter" }, // prettier-ignore
                        { offset: 0x437, bit: 4, label: "Wimp" }, // prettier-ignore
                        { offset: 0x437, bit: 5, label: "Shape-Shifter" }, // prettier-ignore
                        { offset: 0x437, bit: 6, label: "Chuck Wagon" }, // prettier-ignore
                        { offset: 0x437, bit: 7, label: "Parasol Finish" }, // prettier-ignore
                        { offset: 0x436, bit: 0, label: "Gardener Finish" }, // prettier-ignore
                        { offset: 0x436, bit: 1, label: "Flower Finish" }, // prettier-ignore
                        { offset: 0x436, bit: 2, label: "Super Scoper" }, // prettier-ignore
                        { offset: 0x436, bit: 3, label: "Screwed Up" }, // prettier-ignore
                        { offset: 0x436, bit: 4, label: "Screw-Attack KO" }, // prettier-ignore
                      ],
                    },
                    {
                      type: "bitflags",
                      flags: [
                        { offset: 0x436, bit: 5, label: "Warp-Star KO" }, // prettier-ignore
                        { offset: 0x436, bit: 6, label: "Mycologist" }, // prettier-ignore
                        { offset: 0x436, bit: 7, label: "Mario Maniac" }, // prettier-ignore
                        { offset: 0x435, bit: 0, label: "Metal KO" }, // prettier-ignore
                        { offset: 0x435, bit: 1, label: "Freezie KO" }, // prettier-ignore
                        { offset: 0x435, bit: 2, label: "Flipper KO" }, // prettier-ignore
                        { offset: 0x435, bit: 3, label: "Mr. Saturn Fan" }, // prettier-ignore
                        { offset: 0x435, bit: 4, label: "Mrs. Saturn" }, // prettier-ignore
                        { offset: 0x435, bit: 5, label: "Saturn Siblings" }, // prettier-ignore
                        { offset: 0x435, bit: 6, label: "Saturn Ringer" }, // prettier-ignore
                        { offset: 0x435, bit: 7, label: "Giant KO" }, // prettier-ignore
                        { offset: 0x434, bit: 0, label: "Tiny KO" }, // prettier-ignore
                        { offset: 0x434, bit: 1, label: "Barrel Blast KO" }, // prettier-ignore
                        { offset: 0x434, bit: 2, label: "Invisible KO" }, // prettier-ignore
                        { offset: 0x434, bit: 3, label: "Bunny-Hood Blast" }, // prettier-ignore
                        { offset: 0x434, bit: 4, label: "Vegetarian" }, // prettier-ignore
                        { offset: 0x434, bit: 5, label: "Heartthrob" }, // prettier-ignore
                        { offset: 0x434, bit: 6, label: "Invincible Finish" }, // prettier-ignore
                        { offset: 0x434, bit: 7, label: "Invincible KO" }, // prettier-ignore
                        { offset: 0x43b, bit: 0, label: "Beam Swordsman" }, // prettier-ignore
                      ],
                    },
                    {
                      type: "bitflags",
                      flags: [
                        { offset: 0x43b, bit: 1, label: "Home-Run King" }, // prettier-ignore
                        { offset: 0x43b, bit: 2, label: "Laser Marksman" }, // prettier-ignore
                        { offset: 0x43b, bit: 3, label: "Flame Thrower" }, // prettier-ignore
                        { offset: 0x43b, bit: 4, label: "Hammer Throw" }, // prettier-ignore
                        { offset: 0x43b, bit: 5, label: "Headless Hammer" }, // prettier-ignore
                        { offset: 0x43b, bit: 6, label: "Super Spy" }, // prettier-ignore
                        { offset: 0x43b, bit: 7, label: "Bob-omb's Away" }, // prettier-ignore
                        { offset: 0x43a, bit: 0, label: "Bob-omb Squad" }, // prettier-ignore
                        { offset: 0x43a, bit: 1, label: "Red Shell Shooter" }, // prettier-ignore
                        { offset: 0x43a, bit: 2, label: "Green Shell Shooter" }, // prettier-ignore
                        { offset: 0x43a, bit: 3, label: "Pokémon KO" }, // prettier-ignore
                        { offset: 0x43a, bit: 4, label: "Mew Catcher" }, // prettier-ignore
                        { offset: 0x43a, bit: 5, label: "Celebi Catcher" }, // prettier-ignore
                        { offset: 0x43a, bit: 6, label: "Goomba KO" }, // prettier-ignore
                        { offset: 0x43a, bit: 7, label: "Koopa KO" }, // prettier-ignore
                        { offset: 0x439, bit: 0, label: "Paratroopa KO" }, // prettier-ignore
                        { offset: 0x439, bit: 1, label: "ReDead KO" }, // prettier-ignore
                        { offset: 0x439, bit: 2, label: "Like Like KO" }, // prettier-ignore
                        { offset: 0x439, bit: 3, label: "Octorok KO" }, // prettier-ignore
                        { offset: 0x439, bit: 4, label: "Topi KO" }, // prettier-ignore
                      ],
                    },
                    {
                      type: "bitflags",
                      flags: [
                        { offset: 0x439, bit: 5, label: "Polar Bear KO" }, // prettier-ignore
                        { offset: 0x439, bit: 6, label: "Shy Guy KO" }, // prettier-ignore
                        { offset: 0x439, bit: 7, label: "First Place" }, // prettier-ignore
                        { offset: 0x438, bit: 0, label: "Last Place" }, // prettier-ignore
                        { offset: 0x438, bit: 1, label: "Wire to Wire" }, // prettier-ignore
                        { offset: 0x438, bit: 2, label: "Whipping Boy" }, // prettier-ignore
                        { offset: 0x438, bit: 3, label: "KO Artist" }, // prettier-ignore
                        { offset: 0x438, bit: 4, label: "KO Master" }, // prettier-ignore
                        { offset: 0x438, bit: 5, label: "Offensive Artist" }, // prettier-ignore
                        { offset: 0x438, bit: 6, label: "Offensive Master" }, // prettier-ignore
                        { offset: 0x438, bit: 7, label: "Frequent Faller" }, // prettier-ignore
                        { offset: 0x43f, bit: 0, label: "Fall Guy" }, // prettier-ignore
                        { offset: 0x43f, bit: 1, label: "Self-Destructor" }, // prettier-ignore
                        { offset: 0x43f, bit: 2, label: "Master of Disaster" }, // prettier-ignore
                        { offset: 0x43f, bit: 3, label: "KOs" }, // prettier-ignore
                        { offset: 0x43f, bit: 4, label: "Falls" }, // prettier-ignore
                        { offset: 0x43f, bit: 5, label: "SDs" }, // prettier-ignore
                        { offset: 0x43d, bit: 6, label: "Target Master" }, // prettier-ignore
                        { offset: 0x43d, bit: 7, label: "Hobbyist" }, // prettier-ignore
                        { offset: 0x43c, bit: 0, label: "Collector" }, // prettier-ignore
                      ],
                    },
                    {
                      type: "bitflags",
                      flags: [
                        { offset: 0x43f, bit: 6, label: "No-Damage Clear" }, // prettier-ignore
                        { offset: 0x43f, bit: 7, label: "No-Miss Clear" }, // prettier-ignore
                        { offset: 0x43e, bit: 0, label: "Continuation" }, // prettier-ignore
                        { offset: 0x43e, bit: 1, label: "Speedster" }, // prettier-ignore
                        { offset: 0x43e, bit: 2, label: "Speed Demon" }, // prettier-ignore
                        { offset: 0x43e, bit: 3, label: "Melee Master" }, // prettier-ignore
                        { offset: 0x43e, bit: 4, label: "Classic Clear" }, // prettier-ignore
                        { offset: 0x43e, bit: 5, label: "Adventure Clear" }, // prettier-ignore
                        { offset: 0x43e, bit: 6, label: "All-Star Clear" }, // prettier-ignore
                        { offset: 0x43e, bit: 7, label: "Very-Hard Clear" }, // prettier-ignore
                        { offset: 0x43d, bit: 0, label: "Crazy Hand KO" }, // prettier-ignore
                        { offset: 0x43d, bit: 1, label: "Luigi KO" }, // prettier-ignore
                        { offset: 0x43d, bit: 2, label: "Link Master" }, // prettier-ignore
                        { offset: 0x43d, bit: 3, label: "Giant Kirby KO" }, // prettier-ignore
                        { offset: 0x43d, bit: 4, label: "Metal Bros. KO" }, // prettier-ignore
                        { offset: 0x43d, bit: 5, label: "Giga Bowser KO" }, // prettier-ignore
                      ],
                    },
                  ],
                },
                {
                  name: "Misc. Records",
                  items: [
                    {
                      type: "section",
                      flex: true,
                      items: [
                        { name: "Power Count", offset: 0x1e8, type: "variable", dataType: "uint32", bigEndian: true }, // prettier-ignore
                        { name: "Power Time", type: "group", mode: "time", items: [ // prettier-ignore
                            { offset: 0x1ec, type: "variable", dataType: "uint32", bigEndian: true, operations: [{ convert: { from: "seconds", to: "hours" } }], max: 999 }, // prettier-ignore
                            { offset: 0x1ec, type: "variable", dataType: "uint32", bigEndian: true, operations: [{ convert: { from: "seconds", to: "minutes" } }], leadingZeros: 1, max: 59 }, // prettier-ignore
                            { offset: 0x1ec, type: "variable", dataType: "uint32", bigEndian: true, operations: [{ convert: { from: "seconds", to: "seconds" } }], leadingZeros: 1, max: 59 }] }, // prettier-ignore
                      ],
                    },
                    {
                      type: "section",
                      flex: true,
                      items: [
                        { name: "Single-Player Time", type: "group", mode: "time", items: [ // prettier-ignore
                                { offset: 0x1d4, type: "variable", dataType: "uint32", bigEndian: true, operations: [{ convert: { from: "seconds", to: "hours" } }], max: 999 }, // prettier-ignore
                                { offset: 0x1d4, type: "variable", dataType: "uint32", bigEndian: true, operations: [{ convert: { from: "seconds", to: "minutes" } }], leadingZeros: 1, max: 59 }, // prettier-ignore
                                { offset: 0x1d4, type: "variable", dataType: "uint32", bigEndian: true, operations: [{ convert: { from: "seconds", to: "seconds" } }], leadingZeros: 1, max: 59 }] }, // prettier-ignore
                        { name: "VS. Play Time", type: "group", mode: "time", items: [ // prettier-ignore
                            { offset: 0x1cc, type: "variable", dataType: "uint32", bigEndian: true, operations: [{ convert: { from: "seconds", to: "hours" } }], max: 999 }, // prettier-ignore
                            { offset: 0x1cc, type: "variable", dataType: "uint32", bigEndian: true, operations: [{ convert: { from: "seconds", to: "minutes" } }], leadingZeros: 1, max: 59 }, // prettier-ignore
                            { offset: 0x1cc, type: "variable", dataType: "uint32", bigEndian: true, operations: [{ convert: { from: "seconds", to: "seconds" } }], leadingZeros: 1, max: 59 }] }, // prettier-ignore
                        { name: "Combined VS. Play Time", type: "group", mode: "time", items: [ // prettier-ignore
                            { id: "combinedVsPlayTime", offset: 0x1d0, type: "variable", dataType: "uint32", bigEndian: true, operations: [{ convert: { from: "seconds", to: "hours" } }], max: 999 }, // prettier-ignore
                            { id: "combinedVsPlayTime", offset: 0x1d0, type: "variable", dataType: "uint32", bigEndian: true, operations: [{ convert: { from: "seconds", to: "minutes" } }], leadingZeros: 1, max: 59 }, // prettier-ignore
                            { id: "combinedVsPlayTime", offset: 0x1d0, type: "variable", dataType: "uint32", bigEndian: true, operations: [{ convert: { from: "seconds", to: "seconds" } }], leadingZeros: 1, max: 59 }] }, // prettier-ignore
                      ],
                    },
                    {
                      type: "section",
                      flex: true,
                      items: [
                        { id: "vsPlayMatchTotal", name: "VS. Play Match Total", offset: 0x1b0, type: "variable", dataType: "uint32", bigEndian: true, disabled: true }, // prettier-ignore
                        { id: "vsMatchTotal-0", name: "Time Match Total", offset: 0x1b0, type: "variable", dataType: "uint32", bigEndian: true }, // prettier-ignore
                        { id: "vsMatchTotal-1", name: "Stock Match Total", offset: 0x1b4, type: "variable", dataType: "uint32", bigEndian: true }, // prettier-ignore
                        { id: "vsMatchTotal-2", name: "Coin Match Total", offset: 0x1b8, type: "variable", dataType: "uint32", bigEndian: true }, // prettier-ignore
                        { id: "vsMatchTotal-3", name: "Bonus Match Total", offset: 0x1bc, type: "variable", dataType: "uint32", bigEndian: true }, // prettier-ignore
                        { id: "vsMatchTotal-4", name: "Misc. Match Total", offset: 0x1c0, type: "variable", dataType: "uint32", bigEndian: true }, // prettier-ignore
                      ],
                    },
                    {
                      type: "section",
                      flex: true,
                      items: [
                        { name: "Total Distance Walked", offset: 0x40, type: "variable", dataType: "uint32", bigEndian: true }, // prettier-ignore
                        { name: "Total Coins Earned", offset: 0x44, type: "variable", dataType: "uint32", bigEndian: true }, // prettier-ignore
                      ],
                    },
                    {
                      name: "Unlockables Characters Related",
                      type: "section",
                      flex: true,
                      hidden: true,
                      items: [
                        { name: "VS. Play Match Total", offset: 0x8, type: "variable", dataType: "uint32", bigEndian: true }, // prettier-ignore
                        { name: "Combined VS. Play Time", offset: 0xc, type: "variable", dataType: "uint32", bigEndian: true }, // prettier-ignore
                      ],
                    },
                    {
                      name: "Unlockables Stages Related",
                      type: "section",
                      flex: true,
                      hidden: true,
                      items: [
                        { name: "VS. Play Match Total", offset: 0x28, type: "variable", dataType: "uint32", bigEndian: true }, // prettier-ignore
                      ],
                    },
                    {
                      name: "Unlockables Trophies Related",
                      type: "section",
                      flex: true,
                      hidden: true,
                      items: [
                        { name: "VS. Play Match Total", offset: 0x30, type: "variable", dataType: "uint32", bigEndian: true }, // prettier-ignore
                        { name: "Coin Match Total", offset: 0x34, type: "variable", dataType: "uint32", bigEndian: true }, // prettier-ignore
                        { name: "VS. KO Count", offset: 0x3c, type: "variable", dataType: "uint32", bigEndian: true }, // prettier-ignore
                      ],
                    },
                    {
                      name: "Unlockables Options Related",
                      type: "section",
                      flex: true,
                      hidden: true,
                      items: [
                        { name: "VS. KO Count", offset: 0x1a8, type: "variable", dataType: "uint32", bigEndian: true }, // prettier-ignore
                      ],
                    },
                  ],
                },
                {
                  name: "Special",
                  items: [
                    {
                      type: "tabs",
                      vertical: true,
                      items: dataSpecialTypes.map(
                        (type) =>
                          ({
                            name: type.name,
                            items: type.messages.map((message) => ({
                              name: message.name,
                              type: "section",
                              flex: true,
                              items: [
                                {
                                  name: "Progression",
                                  offset:
                                    0x2e7 +
                                    Math.floor(message.index / 0x20) * 0x8 -
                                    Math.floor(message.index / 8),
                                  type: "variable",
                                  dataType: "bit",
                                  bit: message.index % 8,
                                  resource: "progressions",
                                },
                                {
                                  name: "Date",
                                  type: "group",
                                  mode: "date",
                                  items: [
                                    {
                                      offset: 0x318 + message.index * 0x4,
                                      type: "variable",
                                      dataType: "uint32",
                                      bigEndian: true,
                                      operations: [
                                        { "+": 946684800 },
                                        {
                                          date: { from: "seconds", to: "day" },
                                        },
                                      ],
                                      leadingZeros: 1,
                                      min: 1,
                                      max: 31,
                                    },
                                    {
                                      offset: 0x318 + message.index * 0x4,
                                      type: "variable",
                                      dataType: "uint32",
                                      bigEndian: true,
                                      operations: [
                                        { "+": 946684800 },
                                        {
                                          date: {
                                            from: "seconds",
                                            to: "month",
                                          },
                                        },
                                      ],
                                      leadingZeros: 1,
                                      min: 1,
                                      max: 12,
                                    },
                                    {
                                      offset: 0x318 + message.index * 0x4,
                                      type: "variable",
                                      dataType: "uint32",
                                      bigEndian: true,
                                      operations: [
                                        { "+": 946684800 },
                                        {
                                          date: { from: "seconds", to: "year" },
                                        },
                                      ],
                                      min: 2000,
                                      max: 9999,
                                    },
                                    {
                                      offset: 0x318 + message.index * 0x4,
                                      type: "variable",
                                      dataType: "uint32",
                                      bigEndian: true,
                                      operations: [
                                        {
                                          date: {
                                            from: "seconds",
                                            to: "hours",
                                          },
                                        },
                                      ],
                                      leadingZeros: 1,
                                      max: 23,
                                    },
                                    {
                                      offset: 0x318 + message.index * 0x4,
                                      type: "variable",
                                      dataType: "uint32",
                                      bigEndian: true,
                                      operations: [
                                        {
                                          date: {
                                            from: "seconds",
                                            to: "minutes",
                                          },
                                        },
                                      ],
                                      leadingZeros: 1,
                                      max: 59,
                                    },
                                    {
                                      offset: 0x318 + message.index * 0x4,
                                      type: "variable",
                                      dataType: "uint32",
                                      bigEndian: true,
                                      operations: [
                                        {
                                          date: {
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
                            })),
                          }) as ItemTab,
                      ),
                    },
                  ],
                },
              ],
            },
          ],
        },
        {
          name: "Misc",
          flex: true,
          hidden: true,
          items: [
            // [Characters Played Once]
            // { offset: 0x17, bit: 0, label: "C. Falcon" }, // prettier-ignore
            // { offset: 0x17, bit: 1, label: "DK" }, // prettier-ignore
            // { offset: 0x17, bit: 2, label: "Fox" }, // prettier-ignore
            // { offset: 0x17, bit: 3, label: "Mr. Game & Watch" }, // prettier-ignore
            // { offset: 0x17, bit: 4, label: "Kirby" }, // prettier-ignore
            // { offset: 0x17, bit: 5, label: "Bowser" }, // prettier-ignore
            // { offset: 0x17, bit: 6, label: "Link" }, // prettier-ignore
            // { offset: 0x17, bit: 7, label: "Luigi" }, // prettier-ignore
            // { offset: 0x16, bit: 0, label: "Mario" }, // prettier-ignore
            // { offset: 0x16, bit: 1, label: "Marth" }, // prettier-ignore
            // { offset: 0x16, bit: 2, label: "Mewtwo" }, // prettier-ignore
            // { offset: 0x16, bit: 3, label: "Ness" }, // prettier-ignore
            // { offset: 0x16, bit: 4, label: "Peach" }, // prettier-ignore
            // { offset: 0x16, bit: 5, label: "Pikachu" }, // prettier-ignore
            // { offset: 0x16, bit: 6, label: "Ice Climbers" }, // prettier-ignore
            // { offset: 0x16, bit: 7, label: "Jigglypuff" }, // prettier-ignore
            // { offset: 0x15, bit: 0, label: "Samus" }, // prettier-ignore
            // { offset: 0x15, bit: 1, label: "Yoshi" }, // prettier-ignore
            // { offset: 0x15, bit: 2, label: "Zelda" }, // prettier-ignore
            // { offset: 0x15, bit: 3, label: "Falco" }, // prettier-ignore
            // { offset: 0x15, bit: 4, label: "Young Link" }, // prettier-ignore
            // { offset: 0x15, bit: 5, label: "Dr. Mario" }, // prettier-ignore
            // { offset: 0x15, bit: 6, label: "Roy" }, // prettier-ignore
            // { offset: 0x15, bit: 7, label: "Pichu" }, // prettier-ignore
            // { offset: 0x14, bit: 0, label: "Ganondorf" }, // prettier-ignore
            // { offset: 0x14, bit: 1, label: "???" }, // prettier-ignore
            // { offset: 0x14, bit: 2, label: "???" }, // prettier-ignore
            // { offset: 0x14, bit: 3, label: "???" }, // prettier-ignore
            // { offset: 0x14, bit: 4, label: "???" }, // prettier-ignore
            // { offset: 0x14, bit: 5, label: "???" }, // prettier-ignore
            // { offset: 0x14, bit: 6, label: "???" }, // prettier-ignore
            // { offset: 0x14, bit: 7, label: "???" }, // prettier-ignore
            // [Classic Cleared by Characters]
            // { offset: 0x1b, bit: 0, label: "C. Falcon" }, // prettier-ignore
            // { offset: 0x1b, bit: 1, label: "DK" }, // prettier-ignore
            // { offset: 0x1b, bit: 2, label: "Fox" }, // prettier-ignore
            // { offset: 0x1b, bit: 3, label: "Mr. Game & Watch" }, // prettier-ignore
            // { offset: 0x1b, bit: 4, label: "Kirby" }, // prettier-ignore
            // { offset: 0x1b, bit: 5, label: "Bowser" }, // prettier-ignore
            // { offset: 0x1b, bit: 6, label: "Link" }, // prettier-ignore
            // { offset: 0x1b, bit: 7, label: "Luigi" }, // prettier-ignore
            // { offset: 0x1a, bit: 0, label: "Mario" }, // prettier-ignore
            // { offset: 0x1a, bit: 1, label: "Marth" }, // prettier-ignore
            // { offset: 0x1a, bit: 2, label: "Mewtwo" }, // prettier-ignore
            // { offset: 0x1a, bit: 3, label: "Ness" }, // prettier-ignore
            // { offset: 0x1a, bit: 4, label: "Peach" }, // prettier-ignore
            // { offset: 0x1a, bit: 5, label: "Pikachu" }, // prettier-ignore
            // { offset: 0x1a, bit: 6, label: "Ice Climbers" }, // prettier-ignore
            // { offset: 0x1a, bit: 7, label: "Jigglypuff" }, // prettier-ignore
            // { offset: 0x19, bit: 0, label: "Samus" }, // prettier-ignore
            // { offset: 0x19, bit: 1, label: "Yoshi" }, // prettier-ignore
            // { offset: 0x19, bit: 2, label: "Zelda" }, // prettier-ignore
            // { offset: 0x19, bit: 3, label: "Falco" }, // prettier-ignore
            // { offset: 0x19, bit: 4, label: "Young Link" }, // prettier-ignore
            // { offset: 0x19, bit: 5, label: "Dr. Mario" }, // prettier-ignore
            // { offset: 0x19, bit: 6, label: "Roy" }, // prettier-ignore
            // { offset: 0x19, bit: 7, label: "Pichu" }, // prettier-ignore
            // { offset: 0x18, bit: 0, label: "Ganondorf" }, // prettier-ignore
            // { offset: 0x18, bit: 1, label: "???" }, // prettier-ignore
            // { offset: 0x18, bit: 2, label: "???" }, // prettier-ignore
            // { offset: 0x18, bit: 3, label: "???" }, // prettier-ignore
            // { offset: 0x18, bit: 4, label: "???" }, // prettier-ignore
            // { offset: 0x18, bit: 5, label: "???" }, // prettier-ignore
            // { offset: 0x18, bit: 6, label: "???" }, // prettier-ignore
            // { offset: 0x18, bit: 7, label: "???" }, // prettier-ignore
            // [Adventure Cleared by Characters]
            // { offset: 0x1f, bit: 0, label: "C. Falcon" }, // prettier-ignore
            // { offset: 0x1f, bit: 1, label: "DK" }, // prettier-ignore
            // { offset: 0x1f, bit: 2, label: "Fox" }, // prettier-ignore
            // { offset: 0x1f, bit: 3, label: "Mr. Game & Watch" }, // prettier-ignore
            // { offset: 0x1f, bit: 4, label: "Kirby" }, // prettier-ignore
            // { offset: 0x1f, bit: 5, label: "Bowser" }, // prettier-ignore
            // { offset: 0x1f, bit: 6, label: "Link" }, // prettier-ignore
            // { offset: 0x1f, bit: 7, label: "Luigi" }, // prettier-ignore
            // { offset: 0x1e, bit: 0, label: "Mario" }, // prettier-ignore
            // { offset: 0x1e, bit: 1, label: "Marth" }, // prettier-ignore
            // { offset: 0x1e, bit: 2, label: "Mewtwo" }, // prettier-ignore
            // { offset: 0x1e, bit: 3, label: "Ness" }, // prettier-ignore
            // { offset: 0x1e, bit: 4, label: "Peach" }, // prettier-ignore
            // { offset: 0x1e, bit: 5, label: "Pikachu" }, // prettier-ignore
            // { offset: 0x1e, bit: 6, label: "Ice Climbers" }, // prettier-ignore
            // { offset: 0x1e, bit: 7, label: "Jigglypuff" }, // prettier-ignore
            // { offset: 0x1d, bit: 0, label: "Samus" }, // prettier-ignore
            // { offset: 0x1d, bit: 1, label: "Yoshi" }, // prettier-ignore
            // { offset: 0x1d, bit: 2, label: "Zelda" }, // prettier-ignore
            // { offset: 0x1d, bit: 3, label: "Falco" }, // prettier-ignore
            // { offset: 0x1d, bit: 4, label: "Young Link" }, // prettier-ignore
            // { offset: 0x1d, bit: 5, label: "Dr. Mario" }, // prettier-ignore
            // { offset: 0x1d, bit: 6, label: "Roy" }, // prettier-ignore
            // { offset: 0x1d, bit: 7, label: "Pichu" }, // prettier-ignore
            // { offset: 0x1c, bit: 0, label: "Ganondorf" }, // prettier-ignore
            // { offset: 0x1c, bit: 1, label: "???" }, // prettier-ignore
            // { offset: 0x1c, bit: 2, label: "???" }, // prettier-ignore
            // { offset: 0x1c, bit: 3, label: "???" }, // prettier-ignore
            // { offset: 0x1c, bit: 4, label: "???" }, // prettier-ignore
            // { offset: 0x1c, bit: 5, label: "???" }, // prettier-ignore
            // { offset: 0x1c, bit: 6, label: "???" }, // prettier-ignore
            // { offset: 0x1c, bit: 7, label: "???" }, // prettier-ignore
            // [All-Star Cleared by Characters]
            // { offset: 0x23, bit: 0, label: "C. Falcon" }, // prettier-ignore
            // { offset: 0x23, bit: 1, label: "DK" }, // prettier-ignore
            // { offset: 0x23, bit: 2, label: "Fox" }, // prettier-ignore
            // { offset: 0x23, bit: 3, label: "Mr. Game & Watch" }, // prettier-ignore
            // { offset: 0x23, bit: 4, label: "Kirby" }, // prettier-ignore
            // { offset: 0x23, bit: 5, label: "Bowser" }, // prettier-ignore
            // { offset: 0x23, bit: 6, label: "Link" }, // prettier-ignore
            // { offset: 0x23, bit: 7, label: "Luigi" }, // prettier-ignore
            // { offset: 0x22, bit: 0, label: "Mario" }, // prettier-ignore
            // { offset: 0x22, bit: 1, label: "Marth" }, // prettier-ignore
            // { offset: 0x22, bit: 2, label: "Mewtwo" }, // prettier-ignore
            // { offset: 0x22, bit: 3, label: "Ness" }, // prettier-ignore
            // { offset: 0x22, bit: 4, label: "Peach" }, // prettier-ignore
            // { offset: 0x22, bit: 5, label: "Pikachu" }, // prettier-ignore
            // { offset: 0x22, bit: 6, label: "Ice Climbers" }, // prettier-ignore
            // { offset: 0x22, bit: 7, label: "Jigglypuff" }, // prettier-ignore
            // { offset: 0x21, bit: 0, label: "Samus" }, // prettier-ignore
            // { offset: 0x21, bit: 1, label: "Yoshi" }, // prettier-ignore
            // { offset: 0x21, bit: 2, label: "Zelda" }, // prettier-ignore
            // { offset: 0x21, bit: 3, label: "Falco" }, // prettier-ignore
            // { offset: 0x21, bit: 4, label: "Young Link" }, // prettier-ignore
            // { offset: 0x21, bit: 5, label: "Dr. Mario" }, // prettier-ignore
            // { offset: 0x21, bit: 6, label: "Roy" }, // prettier-ignore
            // { offset: 0x21, bit: 7, label: "Pichu" }, // prettier-ignore
            // { offset: 0x20, bit: 0, label: "Ganondorf" }, // prettier-ignore
            // { offset: 0x20, bit: 1, label: "???" }, // prettier-ignore
            // { offset: 0x20, bit: 2, label: "???" }, // prettier-ignore
            // { offset: 0x20, bit: 3, label: "???" }, // prettier-ignore
            // { offset: 0x20, bit: 4, label: "???" }, // prettier-ignore
            // { offset: 0x20, bit: 5, label: "???" }, // prettier-ignore
            // { offset: 0x20, bit: 6, label: "???" }, // prettier-ignore
            // { offset: 0x20, bit: 7, label: "???" }, // prettier-ignore
            // [Target Test Cleared by Characters]
            // { offset: 0x27, bit: 0, label: "C. Falcon" }, // prettier-ignore
            // { offset: 0x27, bit: 1, label: "DK" }, // prettier-ignore
            // { offset: 0x27, bit: 2, label: "Fox" }, // prettier-ignore
            // { offset: 0x27, bit: 3, label: "Mr. Game & Watch" }, // prettier-ignore
            // { offset: 0x27, bit: 4, label: "Kirby" }, // prettier-ignore
            // { offset: 0x27, bit: 5, label: "Bowser" }, // prettier-ignore
            // { offset: 0x27, bit: 6, label: "Link" }, // prettier-ignore
            // { offset: 0x27, bit: 7, label: "Luigi" }, // prettier-ignore
            // { offset: 0x26, bit: 0, label: "Mario" }, // prettier-ignore
            // { offset: 0x26, bit: 1, label: "Marth" }, // prettier-ignore
            // { offset: 0x26, bit: 2, label: "Mewtwo" }, // prettier-ignore
            // { offset: 0x26, bit: 3, label: "Ness" }, // prettier-ignore
            // { offset: 0x26, bit: 4, label: "Peach" }, // prettier-ignore
            // { offset: 0x26, bit: 5, label: "Pikachu" }, // prettier-ignore
            // { offset: 0x26, bit: 6, label: "Ice Climbers" }, // prettier-ignore
            // { offset: 0x26, bit: 7, label: "Jigglypuff" }, // prettier-ignore
            // { offset: 0x25, bit: 0, label: "Samus" }, // prettier-ignore
            // { offset: 0x25, bit: 1, label: "Yoshi" }, // prettier-ignore
            // { offset: 0x25, bit: 2, label: "Zelda" }, // prettier-ignore
            // { offset: 0x25, bit: 3, label: "Falco" }, // prettier-ignore
            // { offset: 0x25, bit: 4, label: "Young Link" }, // prettier-ignore
            // { offset: 0x25, bit: 5, label: "Dr. Mario" }, // prettier-ignore
            // { offset: 0x25, bit: 6, label: "Roy" }, // prettier-ignore
            // { offset: 0x25, bit: 7, label: "Pichu" }, // prettier-ignore
            // { offset: 0x24, bit: 0, label: "Ganondorf" }, // prettier-ignore
            // { offset: 0x24, bit: 1, label: "???" }, // prettier-ignore
            // { offset: 0x24, bit: 2, label: "???" }, // prettier-ignore
            // { offset: 0x24, bit: 3, label: "???" }, // prettier-ignore
            // { offset: 0x24, bit: 4, label: "???" }, // prettier-ignore
            // { offset: 0x24, bit: 5, label: "???" }, // prettier-ignore
            // { offset: 0x24, bit: 6, label: "???" }, // prettier-ignore
            // { offset: 0x24, bit: 7, label: "???" }, // prettier-ignore
            // [Stages]
            // [Target Test Cleared by Characters]
            // { offset: 0x2f, bit: 0, label: "C. Falcon" }, // prettier-ignore
            // { offset: 0x2f, bit: 1, label: "DK" }, // prettier-ignore
            // { offset: 0x2f, bit: 2, label: "Fox" }, // prettier-ignore
            // { offset: 0x2f, bit: 3, label: "Mr. Game & Watch" }, // prettier-ignore
            // { offset: 0x2f, bit: 4, label: "Kirby" }, // prettier-ignore
            // { offset: 0x2f, bit: 5, label: "Bowser" }, // prettier-ignore
            // { offset: 0x2f, bit: 6, label: "Link" }, // prettier-ignore
            // { offset: 0x2f, bit: 7, label: "Luigi" }, // prettier-ignore
            // { offset: 0x2e, bit: 0, label: "Mario" }, // prettier-ignore
            // { offset: 0x2e, bit: 1, label: "Marth" }, // prettier-ignore
            // { offset: 0x2e, bit: 2, label: "Mewtwo" }, // prettier-ignore
            // { offset: 0x2e, bit: 3, label: "Ness" }, // prettier-ignore
            // { offset: 0x2e, bit: 4, label: "Peach" }, // prettier-ignore
            // { offset: 0x2e, bit: 5, label: "Pikachu" }, // prettier-ignore
            // { offset: 0x2e, bit: 6, label: "Ice Climbers" }, // prettier-ignore
            // { offset: 0x2e, bit: 7, label: "Jigglypuff" }, // prettier-ignore
            // { offset: 0x2d, bit: 0, label: "Samus" }, // prettier-ignore
            // { offset: 0x2d, bit: 1, label: "Yoshi" }, // prettier-ignore
            // { offset: 0x2d, bit: 2, label: "Zelda" }, // prettier-ignore
            // { offset: 0x2d, bit: 3, label: "Falco" }, // prettier-ignore
            // { offset: 0x2d, bit: 4, label: "Young Link" }, // prettier-ignore
            // { offset: 0x2d, bit: 5, label: "Dr. Mario" }, // prettier-ignore
            // { offset: 0x2d, bit: 6, label: "Roy" }, // prettier-ignore
            // { offset: 0x2d, bit: 7, label: "Pichu" }, // prettier-ignore
            // { offset: 0x2c, bit: 0, label: "Ganondorf" }, // prettier-ignore
            // { offset: 0x2c, bit: 1, label: "???" }, // prettier-ignore
            // { offset: 0x2c, bit: 2, label: "???" }, // prettier-ignore
            // { offset: 0x2c, bit: 3, label: "???" }, // prettier-ignore
            // { offset: 0x2c, bit: 4, label: "???" }, // prettier-ignore
            // { offset: 0x2c, bit: 5, label: "???" }, // prettier-ignore
            // { offset: 0x2c, bit: 6, label: "???" }, // prettier-ignore
            // { offset: 0x2c, bit: 7, label: "???" }, // prettier-ignore
            // [Trophies]
            // [Target Test Cleared by Characters]
            // { offset: 0x3b, bit: 0, label: "C. Falcon" }, // prettier-ignore
            // { offset: 0x3b, bit: 1, label: "DK" }, // prettier-ignore
            // { offset: 0x3b, bit: 2, label: "Fox" }, // prettier-ignore
            // { offset: 0x3b, bit: 3, label: "Mr. Game & Watch" }, // prettier-ignore
            // { offset: 0x3b, bit: 4, label: "Kirby" }, // prettier-ignore
            // { offset: 0x3b, bit: 5, label: "Bowser" }, // prettier-ignore
            // { offset: 0x3b, bit: 6, label: "Link" }, // prettier-ignore
            // { offset: 0x3b, bit: 7, label: "Luigi" }, // prettier-ignore
            // { offset: 0x3a, bit: 0, label: "Mario" }, // prettier-ignore
            // { offset: 0x3a, bit: 1, label: "Marth" }, // prettier-ignore
            // { offset: 0x3a, bit: 2, label: "Mewtwo" }, // prettier-ignore
            // { offset: 0x3a, bit: 3, label: "Ness" }, // prettier-ignore
            // { offset: 0x3a, bit: 4, label: "Peach" }, // prettier-ignore
            // { offset: 0x3a, bit: 5, label: "Pikachu" }, // prettier-ignore
            // { offset: 0x3a, bit: 6, label: "Ice Climbers" }, // prettier-ignore
            // { offset: 0x3a, bit: 7, label: "Jigglypuff" }, // prettier-ignore
            // { offset: 0x39, bit: 0, label: "Samus" }, // prettier-ignore
            // { offset: 0x39, bit: 1, label: "Yoshi" }, // prettier-ignore
            // { offset: 0x39, bit: 2, label: "Zelda" }, // prettier-ignore
            // { offset: 0x39, bit: 3, label: "Falco" }, // prettier-ignore
            // { offset: 0x39, bit: 4, label: "Young Link" }, // prettier-ignore
            // { offset: 0x39, bit: 5, label: "Dr. Mario" }, // prettier-ignore
            // { offset: 0x39, bit: 6, label: "Roy" }, // prettier-ignore
            // { offset: 0x39, bit: 7, label: "Pichu" }, // prettier-ignore
            // { offset: 0x38, bit: 0, label: "Ganondorf" }, // prettier-ignore
            // { offset: 0x38, bit: 1, label: "???" }, // prettier-ignore
            // { offset: 0x38, bit: 2, label: "???" }, // prettier-ignore
            // { offset: 0x38, bit: 3, label: "???" }, // prettier-ignore
            // { offset: 0x38, bit: 4, label: "???" }, // prettier-ignore
            // { offset: 0x38, bit: 5, label: "???" }, // prettier-ignore
            // { offset: 0x38, bit: 6, label: "???" }, // prettier-ignore
            // { offset: 0x38, bit: 7, label: "???" }, // prettier-ignore
            // [VS. Characters Play Count]
            // { name: "C. Falcon", offset: 0x48, type: "variable", dataType: "uint16", bigEndian: true }, // prettier-ignore
            // { name: "DK", offset: 0x4a, type: "variable", dataType: "uint16", bigEndian: true }, // prettier-ignore
            // { name: "Fox", offset: 0x4c, type: "variable", dataType: "uint16", bigEndian: true }, // prettier-ignore
            // { name: "Mr. Game & Watch", offset: 0x4e, type: "variable", dataType: "uint16", bigEndian: true }, // prettier-ignore
            // { name: "Kirby", offset: 0x50, type: "variable", dataType: "uint16", bigEndian: true }, // prettier-ignore
            // { name: "Bowser", offset: 0x52, type: "variable", dataType: "uint16", bigEndian: true }, // prettier-ignore
            // { name: "Link", offset: 0x54, type: "variable", dataType: "uint16", bigEndian: true }, // prettier-ignore
            // { name: "Luigi", offset: 0x56, type: "variable", dataType: "uint16", bigEndian: true }, // prettier-ignore
            // { name: "Mario", offset: 0x58, type: "variable", dataType: "uint16", bigEndian: true }, // prettier-ignore
            // { name: "Marth", offset: 0x5a, type: "variable", dataType: "uint16", bigEndian: true }, // prettier-ignore
            // { name: "Mewtwo", offset: 0x5c, type: "variable", dataType: "uint16", bigEndian: true }, // prettier-ignore
            // { name: "Ness", offset: 0x5e, type: "variable", dataType: "uint16", bigEndian: true }, // prettier-ignore
            // { name: "Peach", offset: 0x60, type: "variable", dataType: "uint16", bigEndian: true }, // prettier-ignore
            // { name: "Pikachu", offset: 0x62, type: "variable", dataType: "uint16", bigEndian: true }, // prettier-ignore
            // { name: "Ice Climbers", offset: 0x64, type: "variable", dataType: "uint16", bigEndian: true }, // prettier-ignore
            // { name: "Jigglypuff", offset: 0x66, type: "variable", dataType: "uint16", bigEndian: true }, // prettier-ignore
            // { name: "Samus", offset: 0x68, type: "variable", dataType: "uint16", bigEndian: true }, // prettier-ignore
            // { name: "Yoshi", offset: 0x6a, type: "variable", dataType: "uint16", bigEndian: true }, // prettier-ignore
            // { name: "Zelda", offset: 0x6c, type: "variable", dataType: "uint16", bigEndian: true }, // prettier-ignore
            // { name: "Falco", offset: 0x6e, type: "variable", dataType: "uint16", bigEndian: true }, // prettier-ignore
            // { name: "Young Link", offset: 0x70, type: "variable", dataType: "uint16", bigEndian: true }, // prettier-ignore
            // { name: "Dr. Mario", offset: 0x72, type: "variable", dataType: "uint16", bigEndian: true }, // prettier-ignore
            // { name: "Roy", offset: 0x74, type: "variable", dataType: "uint16", bigEndian: true }, // prettier-ignore
            // { name: "Pichu", offset: 0x76, type: "variable", dataType: "uint16", bigEndian: true }, // prettier-ignore
            // { name: "Ganondorf", offset: 0x78, type: "variable", dataType: "uint16", bigEndian: true }, // prettier-ignore
            // { name: "???", offset: 0x7a, type: "variable", dataType: "uint16", bigEndian: true }, // prettier-ignore
            // [Target Test Records]
            // { name: "C. Falcon", offset: 0x7c, type: "variable", dataType: "uint32", bigEndian: true }, // prettier-ignore
            // { name: "DK", offset: 0x80, type: "variable", dataType: "uint32", bigEndian: true }, // prettier-ignore
            // { name: "Fox", offset: 0x84, type: "variable", dataType: "uint32", bigEndian: true }, // prettier-ignore
            // { name: "Mr. Game & Watch", offset: 0x88, type: "variable", dataType: "uint32", bigEndian: true }, // prettier-ignore
            // { name: "Kirby", offset: 0x8c, type: "variable", dataType: "uint32", bigEndian: true }, // prettier-ignore
            // { name: "Bowser", offset: 0x90, type: "variable", dataType: "uint32", bigEndian: true }, // prettier-ignore
            // { name: "Link", offset: 0x94, type: "variable", dataType: "uint32", bigEndian: true }, // prettier-ignore
            // { name: "Luigi", offset: 0x98, type: "variable", dataType: "uint32", bigEndian: true }, // prettier-ignore
            // { name: "Mario", offset: 0x9c, type: "variable", dataType: "uint32", bigEndian: true }, // prettier-ignore
            // { name: "Marth", offset: 0xa0, type: "variable", dataType: "uint32", bigEndian: true }, // prettier-ignore
            // { name: "Mewtwo", offset: 0xa4, type: "variable", dataType: "uint32", bigEndian: true }, // prettier-ignore
            // { name: "Ness", offset: 0xa8, type: "variable", dataType: "uint32", bigEndian: true }, // prettier-ignore
            // { name: "Peach", offset: 0xac, type: "variable", dataType: "uint32", bigEndian: true }, // prettier-ignore
            // { name: "Pikachu", offset: 0xb0, type: "variable", dataType: "uint32", bigEndian: true }, // prettier-ignore
            // { name: "Ice Climbers", offset: 0xb4, type: "variable", dataType: "uint32", bigEndian: true }, // prettier-ignore
            // { name: "Jigglypuff", offset: 0xb8, type: "variable", dataType: "uint32", bigEndian: true }, // prettier-ignore
            // { name: "Samus", offset: 0xbc, type: "variable", dataType: "uint32", bigEndian: true }, // prettier-ignore
            // { name: "Yoshi", offset: 0xc0, type: "variable", dataType: "uint32", bigEndian: true }, // prettier-ignore
            // { name: "Zelda", offset: 0xc4, type: "variable", dataType: "uint32", bigEndian: true }, // prettier-ignore
            // { name: "Falco", offset: 0xc8, type: "variable", dataType: "uint32", bigEndian: true }, // prettier-ignore
            // { name: "Young Link", offset: 0xcc, type: "variable", dataType: "uint32", bigEndian: true }, // prettier-ignore
            // { name: "Dr. Mario", offset: 0xd0, type: "variable", dataType: "uint32", bigEndian: true }, // prettier-ignore
            // { name: "Roy", offset: 0xd4, type: "variable", dataType: "uint32", bigEndian: true }, // prettier-ignore
            // { name: "Pichu", offset: 0xd8, type: "variable", dataType: "uint32", bigEndian: true }, // prettier-ignore
            // { name: "Ganondorf", offset: 0xdc, type: "variable", dataType: "uint32", bigEndian: true }, // prettier-ignore
            // [Home-Run Contest Records]
            // { name: "C. Falcon", offset: 0xe0, type: "variable", dataType: "uint32", bigEndian: true }, // prettier-ignore
            // { name: "DK", offset: 0xe4, type: "variable", dataType: "uint32", bigEndian: true }, // prettier-ignore
            // { name: "Fox", offset: 0xe8, type: "variable", dataType: "uint32", bigEndian: true }, // prettier-ignore
            // { name: "Mr. Game & Watch", offset: 0xec, type: "variable", dataType: "uint32", bigEndian: true }, // prettier-ignore
            // { name: "Kirby", offset: 0xf0, type: "variable", dataType: "uint32", bigEndian: true }, // prettier-ignore
            // { name: "Bowser", offset: 0xf4, type: "variable", dataType: "uint32", bigEndian: true }, // prettier-ignore
            // { name: "Link", offset: 0xf8, type: "variable", dataType: "uint32", bigEndian: true }, // prettier-ignore
            // { name: "Luigi", offset: 0xfc, type: "variable", dataType: "uint32", bigEndian: true }, // prettier-ignore
            // { name: "Mario", offset: 0x100, type: "variable", dataType: "uint32", bigEndian: true }, // prettier-ignore
            // { name: "Marth", offset: 0x104, type: "variable", dataType: "uint32", bigEndian: true }, // prettier-ignore
            // { name: "Mewtwo", offset: 0x108, type: "variable", dataType: "uint32", bigEndian: true }, // prettier-ignore
            // { name: "Ness", offset: 0x10c, type: "variable", dataType: "uint32", bigEndian: true }, // prettier-ignore
            // { name: "Peach", offset: 0x110, type: "variable", dataType: "uint32", bigEndian: true }, // prettier-ignore
            // { name: "Pikachu", offset: 0x114, type: "variable", dataType: "uint32", bigEndian: true }, // prettier-ignore
            // { name: "Ice Climbers", offset: 0x118, type: "variable", dataType: "uint32", bigEndian: true }, // prettier-ignore
            // { name: "Jigglypuff", offset: 0x11c, type: "variable", dataType: "uint32", bigEndian: true }, // prettier-ignore
            // { name: "Samus", offset: 0x120, type: "variable", dataType: "uint32", bigEndian: true }, // prettier-ignore
            // { name: "Yoshi", offset: 0x124, type: "variable", dataType: "uint32", bigEndian: true }, // prettier-ignore
            // { name: "Zelda", offset: 0x128, type: "variable", dataType: "uint32", bigEndian: true }, // prettier-ignore
            // { name: "Falco", offset: 0x12c, type: "variable", dataType: "uint32", bigEndian: true }, // prettier-ignore
            // { name: "Young Link", offset: 0x130, type: "variable", dataType: "uint32", bigEndian: true }, // prettier-ignore
            // { name: "Dr. Mario", offset: 0x134, type: "variable", dataType: "uint32", bigEndian: true }, // prettier-ignore
            // { name: "Roy", offset: 0x138, type: "variable", dataType: "uint32", bigEndian: true }, // prettier-ignore
            // { name: "Pichu", offset: 0x13c, type: "variable", dataType: "uint32", bigEndian: true }, // prettier-ignore
            // { name: "Ganondorf", offset: 0x140, type: "variable", dataType: "uint32", bigEndian: true }, // prettier-ignore
            // [Training Max Combos]
            // { name: "C. Falcon", offset: 0x144, type: "variable", dataType: "uint32", bigEndian: true }, // prettier-ignore
            // { name: "DK", offset: 0x148, type: "variable", dataType: "uint32", bigEndian: true }, // prettier-ignore
            // { name: "Fox", offset: 0x14c, type: "variable", dataType: "uint32", bigEndian: true }, // prettier-ignore
            // { name: "Mr. Game & Watch", offset: 0x150, type: "variable", dataType: "uint32", bigEndian: true }, // prettier-ignore
            // { name: "Kirby", offset: 0x154, type: "variable", dataType: "uint32", bigEndian: true }, // prettier-ignore
            // { name: "Bowser", offset: 0x158, type: "variable", dataType: "uint32", bigEndian: true }, // prettier-ignore
            // { name: "Link", offset: 0x15c, type: "variable", dataType: "uint32", bigEndian: true }, // prettier-ignore
            // { name: "Luigi", offset: 0x160, type: "variable", dataType: "uint32", bigEndian: true }, // prettier-ignore
            // { name: "Mario", offset: 0x164, type: "variable", dataType: "uint32", bigEndian: true }, // prettier-ignore
            // { name: "Marth", offset: 0x168, type: "variable", dataType: "uint32", bigEndian: true }, // prettier-ignore
            // { name: "Mewtwo", offset: 0x16c, type: "variable", dataType: "uint32", bigEndian: true }, // prettier-ignore
            // { name: "Ness", offset: 0x170, type: "variable", dataType: "uint32", bigEndian: true }, // prettier-ignore
            // { name: "Peach", offset: 0x174, type: "variable", dataType: "uint32", bigEndian: true }, // prettier-ignore
            // { name: "Pikachu", offset: 0x178, type: "variable", dataType: "uint32", bigEndian: true }, // prettier-ignore
            // { name: "Ice Climbers", offset: 0x17c, type: "variable", dataType: "uint32", bigEndian: true }, // prettier-ignore
            // { name: "Jigglypuff", offset: 0x180, type: "variable", dataType: "uint32", bigEndian: true }, // prettier-ignore
            // { name: "Samus", offset: 0x184, type: "variable", dataType: "uint32", bigEndian: true }, // prettier-ignore
            // { name: "Yoshi", offset: 0x188, type: "variable", dataType: "uint32", bigEndian: true }, // prettier-ignore
            // { name: "Zelda", offset: 0x18c, type: "variable", dataType: "uint32", bigEndian: true }, // prettier-ignore
            // { name: "Falco", offset: 0x190, type: "variable", dataType: "uint32", bigEndian: true }, // prettier-ignore
            // { name: "Young Link", offset: 0x194, type: "variable", dataType: "uint32", bigEndian: true }, // prettier-ignore
            // { name: "Dr. Mario", offset: 0x198, type: "variable", dataType: "uint32", bigEndian: true }, // prettier-ignore
            // { name: "Roy", offset: 0x19c, type: "variable", dataType: "uint32", bigEndian: true }, // prettier-ignore
            // { name: "Pichu", offset: 0x1a0, type: "variable", dataType: "uint32", bigEndian: true }, // prettier-ignore
            // { name: "Ganondorf", offset: 0x1a4, type: "variable", dataType: "uint32", bigEndian: true }, // prettier-ignore
            // [Options]
            // { name: "All Characters Unlocked Flag", offset: 0x1ac, type: "variable", dataType: "uint8" }, // prettier-ignore
            // { name: "All Standard Stages Unlocked Flag", offset: 0x1ad, type: "variable", dataType: "uint8" }, // prettier-ignore
            // { name: "All Stages Unlocked Flag", offset: 0x1ae, type: "variable", dataType: "uint8" }, // prettier-ignore
            // { name: "???", offset: 0x1af, type: "variable", dataType: "uint8" }, // prettier-ignore
            // { name: "Match Reset Counter", offset: 0x1c4, type: "variable", dataType: "uint32", bigEndian: true }, // prettier-ignore
            // { name: "VS. Play Contestants", offset: 0x1c8, type: "variable", dataType: "uint32", bigEndian: true }, // prettier-ignore
            // { name: "???", offset: 0x1d8, type: "variable", dataType: "uint32", bigEndian: true }, // prettier-ignore
            // { name: "???", offset: 0x1dc, type: "variable", dataType: "uint32", bigEndian: true }, // prettier-ignore
            // { name: "Total Coins Earned", offset: 0x1e4, type: "variable", dataType: "uint32", bigEndian: true }, // prettier-ignore
            // { name: "Total Damage", offset: 0x1f0, type: "variable", dataType: "uint32", bigEndian: true }, // prettier-ignore
            // { name: "KO Total", offset: 0x1f4, type: "variable", dataType: "uint32", bigEndian: true }, // prettier-ignore
            // { name: "Self-Destruct Total", offset: 0x1f8, type: "variable", dataType: "uint32", bigEndian: true }, // prettier-ignore
            // { name: "???", offset: 0x1fc, type: "variable", dataType: "uint32", bigEndian: true }, // prettier-ignore
            // [Records]
            // [C. Falcon]
            // [KOs]
            // { name: "C. Falcon", offset: 0x6c4, type: "variable", dataType: "uint16", bigEndian: true }, // prettier-ignore
            // { name: "DK", offset: 0x6c6, type: "variable", dataType: "uint16", bigEndian: true }, // prettier-ignore
            // { name: "Fox", offset: 0x6c8, type: "variable", dataType: "uint16", bigEndian: true }, // prettier-ignore
            // { name: "Mr. Game & Watch", offset: 0x6ca, type: "variable", dataType: "uint16", bigEndian: true }, // prettier-ignore
            // { name: "Kirby", offset: 0x6cc, type: "variable", dataType: "uint16", bigEndian: true }, // prettier-ignore
            // { name: "Bowser", offset: 0x6ce, type: "variable", dataType: "uint16", bigEndian: true }, // prettier-ignore
            // { name: "Link", offset: 0x6d0, type: "variable", dataType: "uint16", bigEndian: true }, // prettier-ignore
            // { name: "Luigi", offset: 0x6d2, type: "variable", dataType: "uint16", bigEndian: true }, // prettier-ignore
            // { name: "Mario", offset: 0x6d4, type: "variable", dataType: "uint16", bigEndian: true }, // prettier-ignore
            // { name: "Marth", offset: 0x6d6, type: "variable", dataType: "uint16", bigEndian: true }, // prettier-ignore
            // { name: "Mewtwo", offset: 0x6d8, type: "variable", dataType: "uint16", bigEndian: true }, // prettier-ignore
            // { name: "Ness", offset: 0x6da, type: "variable", dataType: "uint16", bigEndian: true }, // prettier-ignore
            // { name: "Peach", offset: 0x6dc, type: "variable", dataType: "uint16", bigEndian: true }, // prettier-ignore
            // { name: "Pikachu", offset: 0x6de, type: "variable", dataType: "uint16", bigEndian: true }, // prettier-ignore
            // { name: "Ice Climbers", offset: 0x6e0, type: "variable", dataType: "uint16", bigEndian: true }, // prettier-ignore
            // { name: "Jigglypuff", offset: 0x6e2, type: "variable", dataType: "uint16", bigEndian: true }, // prettier-ignore
            // { name: "Samus", offset: 0x6e4, type: "variable", dataType: "uint16", bigEndian: true }, // prettier-ignore
            // { name: "Yoshi", offset: 0x6e6, type: "variable", dataType: "uint16", bigEndian: true }, // prettier-ignore
            // { name: "Zelda", offset: 0x6e8, type: "variable", dataType: "uint16", bigEndian: true }, // prettier-ignore
            // { name: "Falco", offset: 0x6ea, type: "variable", dataType: "uint16", bigEndian: true }, // prettier-ignore
            // { name: "Young Link", offset: 0x6ec, type: "variable", dataType: "uint16", bigEndian: true }, // prettier-ignore
            // { name: "Dr. Mario", offset: 0x6ee, type: "variable", dataType: "uint16", bigEndian: true }, // prettier-ignore
            // { name: "Roy", offset: 0x6f0, type: "variable", dataType: "uint16", bigEndian: true }, // prettier-ignore
            // { name: "Pichu", offset: 0x6f2, type: "variable", dataType: "uint16", bigEndian: true }, // prettier-ignore
            // { name: "Ganondorf", offset: 0x6f4, type: "variable", dataType: "uint16", bigEndian: true }, // prettier-ignore
            // { name: "???", offset: 0x6f6, type: "variable", dataType: "uint16", bigEndian: true }, // prettier-ignore
            // { name: "???", offset: 0x6f8, type: "variable", dataType: "uint32", bigEndian: true }, // prettier-ignore
            // { name: "???", offset: 0x6fc, type: "variable", dataType: "uint32", bigEndian: true }, // prettier-ignore
            // { name: "Hit Percentage Related", offset: 0x700, type: "variable", dataType: "uint32", bigEndian: true }, // prettier-ignore
            // { name: "Damage Given", offset: 0x704, type: "variable", dataType: "uint32", bigEndian: true }, // prettier-ignore
            // { name: "Damage Taken", offset: 0x708, type: "variable", dataType: "uint32", bigEndian: true }, // prettier-ignore
            // { name: "Damage Recovered", offset: 0x70c, type: "variable", dataType: "uint32", bigEndian: true }, // prettier-ignore
            // { name: "Peak Damage", offset: 0x710, type: "variable", dataType: "uint16", bigEndian: true }, // prettier-ignore
            // { name: "Matches", offset: 0x712, type: "variable", dataType: "uint16", bigEndian: true }, // prettier-ignore
            // { name: "Victories", offset: 0x714, type: "variable", dataType: "uint16", bigEndian: true }, // prettier-ignore
            // { name: "Losses", offset: 0x716, type: "variable", dataType: "uint16", bigEndian: true }, // prettier-ignore
            // { name: "Play Time", offset: 0x718, type: "variable", dataType: "uint32", bigEndian: true }, // prettier-ignore
            // { name: "Average Players Related", offset: 0x71c, type: "variable", dataType: "uint32", bigEndian: true }, // prettier-ignore
            // { name: "Ground Distance", offset: 0x720, type: "variable", dataType: "uint32", bigEndian: true }, // prettier-ignore
            // { name: "Jump Distance", offset: 0x724, type: "variable", dataType: "uint32", bigEndian: true }, // prettier-ignore
            // { name: "Drop Distance", offset: 0x728, type: "variable", dataType: "uint32", bigEndian: true }, // prettier-ignore
            // { name: "Flight Distance", offset: 0x72c, type: "variable", dataType: "uint32", bigEndian: true }, // prettier-ignore
            // { name: "Coin Points", offset: 0x730, type: "variable", dataType: "uint32", bigEndian: true }, // prettier-ignore
            // { name: "Swiped Coins", offset: 0x734, type: "variable", dataType: "uint32", bigEndian: true }, // prettier-ignore
            // { name: "Lost Coin", offset: 0x738, type: "variable", dataType: "uint32", bigEndian: true }, // prettier-ignore
            // { name: "???", offset: 0x73c, type: "variable", dataType: "uint16", bigEndian: true }, // prettier-ignore
            // { name: "???", offset: 0x73e, type: "variable", dataType: "uint16", bigEndian: true }, // prettier-ignore
            // { offset: 0x740, bit: 0, label: "???" }, // prettier-ignore
            // { offset: 0x740, bit: 1, label: "All-Star Cleared" }, // prettier-ignore
            // { offset: 0x740, bit: 2, label: "Adventure Cleared" }, // prettier-ignore
            // { offset: 0x740, bit: 3, label: "Classic Cleared" }, // prettier-ignore
            // { offset: 0x740, bit: 4, label: "15-Minute Melee Cleared" }, // prettier-ignore
            // { offset: 0x740, bit: 5, label: "100-Man Melee Cleared" }, // prettier-ignore
            // { offset: 0x740, bit: 6, label: "10-Man Melee Cleared" }, // prettier-ignore
            // { offset: 0x740, bit: 7, label: "Target Test Cleared" }, // prettier-ignore
            // { name: "???", offset: 0x741, type: "variable", dataType: "uint8" }, // prettier-ignore
            // { name: "Training Max Combos", offset: 0x742, type: "variable", dataType: "uint16", bigEndian: true }, // prettier-ignore
            // { name: "Classic Difficulty Cleared", offset: 0x744, type: "variable", dataType: "uint8" }, // prettier-ignore
            // { name: "Adventure Difficulty Cleared", offset: 0x745, type: "variable", dataType: "uint8" }, // prettier-ignore
            // { name: "All-Star Difficulty Cleared", offset: 0x746, type: "variable", dataType: "uint8" }, // prettier-ignore
            // { name: "???", offset: 0x747, type: "variable", dataType: "uint8" }, // prettier-ignore
            // { name: "Home-Run Contest", offset: 0x748, type: "variable", dataType: "uint32", bigEndian: true }, // prettier-ignore
            // { name: "Classic", offset: 0x74c, type: "variable", dataType: "uint32", bigEndian: true }, // prettier-ignore
            // { name: "Adventure", offset: 0x750, type: "variable", dataType: "uint32", bigEndian: true }, // prettier-ignore
            // { name: "All-Star", offset: 0x754, type: "variable", dataType: "uint32", bigEndian: true }, // prettier-ignore
            // { name: "Target Test", offset: 0x758, type: "variable", dataType: "uint32", bigEndian: true }, // prettier-ignore
            // { name: "10-Man Melee", offset: 0x75c, type: "variable", dataType: "uint32", bigEndian: true }, // prettier-ignore
            // { name: "100-Man Melee", offset: 0x760, type: "variable", dataType: "uint32", bigEndian: true }, // prettier-ignore
            // { name: "3-Minute Melee", offset: 0x764, type: "variable", dataType: "uint16", bigEndian: true }, // prettier-ignore
            // { name: "15-Minute Melee", offset: 0x766, type: "variable", dataType: "uint16", bigEndian: true }, // prettier-ignore
            // { name: "Endless Melee", offset: 0x768, type: "variable", dataType: "uint32", bigEndian: true }, // prettier-ignore
            // { name: "Cruel Melee", offset: 0x76c, type: "variable", dataType: "uint32", bigEndian: true }, // prettier-ignore
            // [DK]
            // [KOs]
            // { name: "C. Falcon", offset: 0x770, type: "variable", dataType: "uint16", bigEndian: true }, // prettier-ignore
            // ...
          ],
        },
      ],
    },
  ],
  resources: {
    frequencies: {
      0x0: "Very Low",
      0x1: "Low",
      0x2: "Medium",
      0x3: "High",
      0x4: "Very High",
      0xff: "None",
    },
    languages: {
      0x2: "English",
      0x3: "German",
      0x4: "French",
      0x5: "Italian",
      0x6: "Spanish",
    },
    optionBoolean: {
      0x0: "Off",
      0x1: "On",
    },
    progressions: {
      0x0: "-",
      0x1: "Cleared",
    },
  },
  resourcesOrder: {
    frequencies: [0xff],
  },
};

export default template;
