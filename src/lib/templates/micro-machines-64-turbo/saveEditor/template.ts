import type { GameJson } from "$lib/types";

import { timeFragment } from "./utils/fragment";
import { raceVehicles, vehicles } from "./utils/resource";

const template: GameJson = {
  validator: {
    platforms: {
      nintendo64: {
        europe: {
          0x0: [0x4e, 0x56, 0x33, 0x50], // "NV3P"
        },
        usa: {
          0x0: [0x4e, 0x56, 0x33, 0x45], // "NV3E"
        },
      },
    },
    text: "Drag 'n' drop here or click to add a save file.",
    error: "Not a valid save file.",
  },
  items: [
    {
      id: "slots",
      length: 0x7f0,
      type: "container",
      instanceType: "tabs",
      instances: 0,
      enumeration: "Slot %d",
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
                      name: "Filename",
                      offset: 0x201,
                      length: 0x8,
                      type: "variable",
                      dataType: "string",
                      letterDataType: "uint8",
                      fallback: 0x2e,
                      endCode: 0x0,
                      regex: "[!.0-9A-Z]",
                      test: true,
                    },
                    {
                      name: "Character",
                      offset: 0x20a,
                      type: "variable",
                      dataType: "uint8",
                      resource: "characters",
                    },
                  ],
                },
                {
                  type: "section",
                  flex: true,
                  items: [
                    {
                      name: "Cars",
                      offset: 0x56c,
                      type: "variable",
                      dataType: "uint16",
                      bigEndian: true,
                      disabled: true,
                    },
                    {
                      name: "Races",
                      offset: 0x568,
                      type: "variable",
                      dataType: "uint16",
                      bigEndian: true,
                    },
                    {
                      name: "Wins",
                      offset: 0x56a,
                      type: "variable",
                      dataType: "uint16",
                      bigEndian: true,
                    },
                  ],
                },
                {
                  type: "section",
                  flex: true,
                  hidden: true,
                  items: [
                    {
                      name: "Is Saved?",
                      offset: 0x200,
                      type: "variable",
                      dataType: "uint8",
                      hidden: true,
                    },
                    {
                      name: "Is Saved?",
                      offset: 0x20b,
                      type: "variable",
                      dataType: "uint8",
                      hidden: true,
                    },
                    {
                      name: "Flags?",
                      offset: 0x592,
                      type: "variable",
                      dataType: "uint8",
                      hidden: true,
                    },
                    {
                      name: "Flags?",
                      offset: 0x593,
                      type: "variable",
                      dataType: "uint8",
                      hidden: true,
                    },
                    {
                      name: "Flags?",
                      offset: 0x594,
                      type: "variable",
                      dataType: "uint8",
                      hidden: true,
                    },
                  ],
                },
              ],
            },
            {
              name: "1 Player",
              items: [
                {
                  type: "tabs",
                  vertical: true,
                  items: [
                    {
                      name: "Head-to-Head",
                      items: [
                        {
                          name: "Progression",
                          offset: 0x574,
                          type: "variable",
                          dataType: "uint8",
                          resource: "progressions",
                        },
                        {
                          type: "section",
                          flex: true,
                          items: [
                            {
                              id: "raceBitflags",
                              name: "Beginners",
                              type: "bitflags",
                              reversed: true,
                              flags: [
                                { offset: 0x575, bit: 4, label: "Race 1" },
                                { offset: 0x576, bit: 4, label: "Race 2" },
                                { offset: 0x577, bit: 4, label: "Race 3" },
                                { offset: 0x578, bit: 4, label: "Race 4" },
                              ],
                            },
                            {
                              id: "raceBitflags",
                              name: "Tricky",
                              type: "bitflags",
                              reversed: true,
                              flags: [
                                { offset: 0x579, bit: 4, label: "Race 1" },
                                { offset: 0x57a, bit: 4, label: "Race 2" },
                                { offset: 0x57b, bit: 4, label: "Race 3" },
                                { offset: 0x57c, bit: 4, label: "Race 4" },
                                { offset: 0x57d, bit: 4, label: "Race 5" },
                              ],
                            },
                            {
                              id: "raceBitflags",
                              name: "Difficult",
                              type: "bitflags",
                              reversed: true,
                              flags: [
                                { offset: 0x57e, bit: 4, label: "Race 1" },
                                { offset: 0x57f, bit: 4, label: "Race 2" },
                                { offset: 0x580, bit: 4, label: "Race 3" },
                                { offset: 0x581, bit: 4, label: "Race 4" },
                                { offset: 0x582, bit: 4, label: "Race 5" },
                              ],
                            },
                            {
                              id: "raceBitflags",
                              name: "Advanced",
                              type: "bitflags",
                              reversed: true,
                              flags: [
                                { offset: 0x583, bit: 4, label: "Race 1" },
                                { offset: 0x584, bit: 4, label: "Race 2" },
                                { offset: 0x585, bit: 4, label: "Race 3" },
                                { offset: 0x586, bit: 4, label: "Race 4" },
                                { offset: 0x587, bit: 4, label: "Race 5" },
                              ],
                            },
                            {
                              id: "raceBitflags",
                              name: "Masters",
                              type: "bitflags",
                              reversed: true,
                              flags: [
                                { offset: 0x588, bit: 4, label: "Race 1" },
                                { offset: 0x589, bit: 4, label: "Race 2" },
                                { offset: 0x58a, bit: 4, label: "Race 3" },
                                { offset: 0x58b, bit: 4, label: "Race 4" },
                                { offset: 0x58c, bit: 4, label: "Race 5" },
                              ],
                            },
                            {
                              id: "raceBitflags",
                              name: "Rock Hard",
                              type: "bitflags",
                              reversed: true,
                              flags: [
                                { offset: 0x58d, bit: 4, label: "Race 1" },
                                { offset: 0x58e, bit: 4, label: "Race 2" },
                                { offset: 0x58f, bit: 4, label: "Race 3" },
                                { offset: 0x590, bit: 4, label: "Race 4" },
                                { offset: 0x591, bit: 4, label: "Race 5" },
                              ],
                            },
                          ],
                        },
                      ],
                    },
                    {
                      name: "Challenge",
                      items: [
                        {
                          type: "section",
                          flex: true,
                          items: [
                            {
                              name: "Progression",
                              offset: 0x572,
                              type: "variable",
                              dataType: "uint8",
                              resource: "progressions",
                            },
                            // ? 0x391 | 0 | Beginners
                            // ? 0x391 | 1 | Beginners
                            // ? 0x391 | 2 | Beginners
                            // ? 0x391 | 3 | Tricky
                            // ? 0x391 | 4 | Tricky
                            // ? 0x391 | 5 | Tricky
                            // ? 0x391 | 6 | Tricky
                            // ? 0x391 | 7 | Tricky
                            // ? 0x390 | 0 | Difficult
                            // ? 0x390 | 1 | Difficult
                            // ? 0x390 | 2 | Difficult
                            // ? 0x390 | 3 | Advanced
                            // ? 0x390 | 4 | Advanced
                            // ? 0x390 | 5 | Advanced
                            // ? 0x390 | 6 | Advanced
                            // ? 0x390 | 7 | Advanced
                            // ? 0x397 | 0 | Masters
                            // ? 0x397 | 1 | Masters
                            // ? 0x397 | 2 | Masters
                            // ? 0x397 | 3 | Rock Hard
                            // ? 0x397 | 4 | Rock Hard
                            // ? 0x397 | 5 | Rock Hard
                            // ? 0x397 | 6 | Rock Hard
                            // ? 0x397 | 7 | Rock Hard
                          ],
                        },
                        {
                          name: "Beginners",
                          type: "section",
                          flex: true,
                          items: [
                            {
                              name: "Race 1",
                              offset: 0x575,
                              type: "variable",
                              dataType: "uint8",
                              binary: { bitStart: 0, bitLength: 2 },
                              resource: "raceProgressions",
                            },
                            {
                              name: "Race 2",
                              offset: 0x576,
                              type: "variable",
                              dataType: "uint8",
                              binary: { bitStart: 0, bitLength: 2 },
                              resource: "raceProgressions",
                            },
                            {
                              name: "Race 3",
                              offset: 0x577,
                              type: "variable",
                              dataType: "uint8",
                              binary: { bitStart: 0, bitLength: 2 },
                              resource: "raceProgressions",
                            },
                            {
                              name: "Race 4",
                              offset: 0x578,
                              type: "variable",
                              dataType: "uint8",
                              binary: { bitStart: 0, bitLength: 2 },
                              resource: "raceProgressions",
                            },
                          ],
                        },
                        {
                          name: "Tricky",
                          type: "section",
                          flex: true,
                          items: [
                            {
                              name: "Race 1",
                              offset: 0x579,
                              type: "variable",
                              dataType: "uint8",
                              binary: { bitStart: 0, bitLength: 2 },
                              resource: "raceProgressions",
                            },
                            {
                              name: "Race 2",
                              offset: 0x57a,
                              type: "variable",
                              dataType: "uint8",
                              binary: { bitStart: 0, bitLength: 2 },
                              resource: "raceProgressions",
                            },
                            {
                              name: "Race 3",
                              offset: 0x57b,
                              type: "variable",
                              dataType: "uint8",
                              binary: { bitStart: 0, bitLength: 2 },
                              resource: "raceProgressions",
                            },
                            {
                              name: "Race 4",
                              offset: 0x57c,
                              type: "variable",
                              dataType: "uint8",
                              binary: { bitStart: 0, bitLength: 2 },
                              resource: "raceProgressions",
                            },
                            {
                              name: "Race 5",
                              offset: 0x57d,
                              type: "variable",
                              dataType: "uint8",
                              binary: { bitStart: 0, bitLength: 2 },
                              resource: "raceProgressions",
                            },
                          ],
                        },
                        {
                          name: "Difficult",
                          type: "section",
                          flex: true,
                          items: [
                            {
                              name: "Race 1",
                              offset: 0x57e,
                              type: "variable",
                              dataType: "uint8",
                              binary: { bitStart: 0, bitLength: 2 },
                              resource: "raceProgressions",
                            },
                            {
                              name: "Race 2",
                              offset: 0x57f,
                              type: "variable",
                              dataType: "uint8",
                              binary: { bitStart: 0, bitLength: 2 },
                              resource: "raceProgressions",
                            },
                            {
                              name: "Race 3",
                              offset: 0x580,
                              type: "variable",
                              dataType: "uint8",
                              binary: { bitStart: 0, bitLength: 2 },
                              resource: "raceProgressions",
                            },
                            {
                              name: "Race 4",
                              offset: 0x581,
                              type: "variable",
                              dataType: "uint8",
                              binary: { bitStart: 0, bitLength: 2 },
                              resource: "raceProgressions",
                            },
                            {
                              name: "Race 5",
                              offset: 0x582,
                              type: "variable",
                              dataType: "uint8",
                              binary: { bitStart: 0, bitLength: 2 },
                              resource: "raceProgressions",
                            },
                          ],
                        },
                        {
                          name: "Advanced",
                          type: "section",
                          flex: true,
                          items: [
                            {
                              name: "Race 1",
                              offset: 0x583,
                              type: "variable",
                              dataType: "uint8",
                              binary: { bitStart: 0, bitLength: 2 },
                              resource: "raceProgressions",
                            },
                            {
                              name: "Race 2",
                              offset: 0x584,
                              type: "variable",
                              dataType: "uint8",
                              binary: { bitStart: 0, bitLength: 2 },
                              resource: "raceProgressions",
                            },
                            {
                              name: "Race 3",
                              offset: 0x585,
                              type: "variable",
                              dataType: "uint8",
                              binary: { bitStart: 0, bitLength: 2 },
                              resource: "raceProgressions",
                            },
                            {
                              name: "Race 4",
                              offset: 0x586,
                              type: "variable",
                              dataType: "uint8",
                              binary: { bitStart: 0, bitLength: 2 },
                              resource: "raceProgressions",
                            },
                            {
                              name: "Race 5",
                              offset: 0x587,
                              type: "variable",
                              dataType: "uint8",
                              binary: { bitStart: 0, bitLength: 2 },
                              resource: "raceProgressions",
                            },
                          ],
                        },
                        {
                          name: "Masters",
                          type: "section",
                          flex: true,
                          items: [
                            {
                              name: "Race 1",
                              offset: 0x588,
                              type: "variable",
                              dataType: "uint8",
                              binary: { bitStart: 0, bitLength: 2 },
                              resource: "raceProgressions",
                            },
                            {
                              name: "Race 2",
                              offset: 0x589,
                              type: "variable",
                              dataType: "uint8",
                              binary: { bitStart: 0, bitLength: 2 },
                              resource: "raceProgressions",
                            },
                            {
                              name: "Race 3",
                              offset: 0x58a,
                              type: "variable",
                              dataType: "uint8",
                              binary: { bitStart: 0, bitLength: 2 },
                              resource: "raceProgressions",
                            },
                            {
                              name: "Race 4",
                              offset: 0x58b,
                              type: "variable",
                              dataType: "uint8",
                              binary: { bitStart: 0, bitLength: 2 },
                              resource: "raceProgressions",
                            },
                            {
                              name: "Race 5",
                              offset: 0x58c,
                              type: "variable",
                              dataType: "uint8",
                              binary: { bitStart: 0, bitLength: 2 },
                              resource: "raceProgressions",
                            },
                          ],
                        },
                        {
                          name: "Rock Hard",
                          type: "section",
                          flex: true,
                          items: [
                            {
                              name: "Race 1",
                              offset: 0x58d,
                              type: "variable",
                              dataType: "uint8",
                              binary: { bitStart: 0, bitLength: 2 },
                              resource: "raceProgressions",
                            },
                            {
                              name: "Race 2",
                              offset: 0x58e,
                              type: "variable",
                              dataType: "uint8",
                              binary: { bitStart: 0, bitLength: 2 },
                              resource: "raceProgressions",
                            },
                            {
                              name: "Race 3",
                              offset: 0x58f,
                              type: "variable",
                              dataType: "uint8",
                              binary: { bitStart: 0, bitLength: 2 },
                              resource: "raceProgressions",
                            },
                            {
                              name: "Race 4",
                              offset: 0x590,
                              type: "variable",
                              dataType: "uint8",
                              binary: { bitStart: 0, bitLength: 2 },
                              resource: "raceProgressions",
                            },
                            {
                              name: "Race 5",
                              offset: 0x591,
                              type: "variable",
                              dataType: "uint8",
                              binary: { bitStart: 0, bitLength: 2 },
                              resource: "raceProgressions",
                            },
                          ],
                        },
                      ],
                    },
                    {
                      name: "Time Trial Challenge",
                      items: [
                        {
                          name: "Progression",
                          offset: 0x573,
                          type: "variable",
                          dataType: "uint8",
                          resource: "progressions",
                        },
                        {
                          type: "section",
                          flex: true,
                          items: [
                            {
                              id: "raceBitflags",
                              name: "Beginners",
                              type: "bitflags",
                              reversed: true,
                              flags: [
                                { offset: 0x575, bit: 2, label: "Race 1" },
                                { offset: 0x576, bit: 2, label: "Race 2" },
                                { offset: 0x577, bit: 2, label: "Race 3" },
                                { offset: 0x578, bit: 2, label: "Race 4" },
                              ],
                            },
                            {
                              id: "raceBitflags",
                              name: "Tricky",
                              type: "bitflags",
                              reversed: true,
                              flags: [
                                { offset: 0x579, bit: 2, label: "Race 1" },
                                { offset: 0x57a, bit: 2, label: "Race 2" },
                                { offset: 0x57b, bit: 2, label: "Race 3" },
                                { offset: 0x57c, bit: 2, label: "Race 4" },
                                { offset: 0x57d, bit: 2, label: "Race 5" },
                              ],
                            },
                            {
                              id: "raceBitflags",
                              name: "Difficult",
                              type: "bitflags",
                              reversed: true,
                              flags: [
                                { offset: 0x57e, bit: 2, label: "Race 1" },
                                { offset: 0x57f, bit: 2, label: "Race 2" },
                                { offset: 0x580, bit: 2, label: "Race 3" },
                                { offset: 0x581, bit: 2, label: "Race 4" },
                                { offset: 0x582, bit: 2, label: "Race 5" },
                              ],
                            },
                            {
                              id: "raceBitflags",
                              name: "Advanced",
                              type: "bitflags",
                              reversed: true,
                              flags: [
                                { offset: 0x583, bit: 2, label: "Race 1" },
                                { offset: 0x584, bit: 2, label: "Race 2" },
                                { offset: 0x585, bit: 2, label: "Race 3" },
                                { offset: 0x586, bit: 2, label: "Race 4" },
                                { offset: 0x587, bit: 2, label: "Race 5" },
                              ],
                            },
                            {
                              id: "raceBitflags",
                              name: "Masters",
                              type: "bitflags",
                              reversed: true,
                              flags: [
                                { offset: 0x588, bit: 2, label: "Race 1" },
                                { offset: 0x589, bit: 2, label: "Race 2" },
                                { offset: 0x58a, bit: 2, label: "Race 3" },
                                { offset: 0x58b, bit: 2, label: "Race 4" },
                                { offset: 0x58c, bit: 2, label: "Race 5" },
                              ],
                            },
                            {
                              id: "raceBitflags",
                              name: "Rock Hard",
                              type: "bitflags",
                              reversed: true,
                              flags: [
                                { offset: 0x58d, bit: 2, label: "Race 1" },
                                { offset: 0x58e, bit: 2, label: "Race 2" },
                                { offset: 0x58f, bit: 2, label: "Race 3" },
                                { offset: 0x590, bit: 2, label: "Race 4" },
                                { offset: 0x591, bit: 2, label: "Race 5" },
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
              name: "Records",
              items: [
                {
                  length: 0x4,
                  type: "container",
                  instanceType: "tabs",
                  instances: 43,
                  resource: "courses",
                  vertical: true,
                  items: [
                    timeFragment("Time Trial", "1 Lap", 0x20c, 0x4bc),
                    timeFragment("", "3 Laps", 0x2b8, 0x4e7),
                    timeFragment("Test Drive", "1 Lap", 0x364, 0x512),
                    timeFragment("", "3 Laps", 0x410, 0x53d),
                  ],
                },
              ],
            },
            {
              name: "Vehicles",
              items: [
                {
                  length: 0xc,
                  type: "container",
                  instanceType: "tabs",
                  instances: 31,
                  resource: "vehicles",
                  vertical: true,
                  flex: true,
                  items: [
                    {
                      id: "carLevel-%index%",
                      name: "Level",
                      offset: 0x59a,
                      type: "variable",
                      dataType: "uint8",
                    },
                    {
                      type: "section",
                      flex: true,
                      noMargin: true,
                      items: [
                        {
                          id: "carStats",
                          name: "Top Speed",
                          offset: 0x59c,
                          type: "variable",
                          dataType: "uint8",
                          min: 1,
                        },
                        {
                          id: "carStats",
                          name: "Acceleration",
                          offset: 0x59b,
                          type: "variable",
                          dataType: "uint8",
                          min: 1,
                        },
                        {
                          id: "carStats",
                          name: "Grip",
                          offset: 0x59d,
                          type: "variable",
                          dataType: "uint8",
                          min: 1,
                        },
                        {
                          id: "carStats",
                          name: "Handling",
                          offset: 0x59f,
                          type: "variable",
                          dataType: "uint8",
                          min: 1,
                        },
                      ],
                    },
                    {
                      type: "section",
                      flex: true,
                      items: [
                        {
                          id: "carStats",
                          name: "Balance",
                          offset: 0x5a2,
                          type: "variable",
                          dataType: "uint8",
                          min: 1,
                        },
                        {
                          id: "carStats",
                          name: "Control Loss",
                          offset: 0x5a1,
                          type: "variable",
                          dataType: "uint8",
                          min: 1,
                        },
                        {
                          id: "carStats",
                          name: "Drift Control",
                          offset: 0x59e,
                          type: "variable",
                          dataType: "uint8",
                          min: 1,
                        },
                        {
                          id: "carStats",
                          name: "Reversing Speed",
                          offset: 0x5a0,
                          type: "variable",
                          dataType: "uint8",
                          min: 1,
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
  ],
  resources: {
    booleanUnlocked: {
      0x0: "-",
      0x1: "Unlocked",
    },
    characters: {
      0x0: "Spider",
      0x1: "Jethro",
      0x2: "Walter",
      0x3: "Cherry",
      0x4: "Dwayne",
      0x5: "Jade",
      0x6: "Chen",
      0x7: "Bonnie",
    },
    courses: {
      0x0: "Cheesy Jumps",
      0x1: "Destruction Dirtbox",
      0x2: "Swerve Shot",
      0x3: "Stinky Sinks",
      0x4: "Pebble Dash",
      0x5: "Vindaloo Drive-Thru",
      0x6: "Calculator Risk",
      0x7: "Cereal Killer",
      0x8: "Beware of the Dog",
      0x9: "Rack 'n Roll",
      0xa: "Pulling Power",
      0xb: "Bikini Blazer",
      0xc: "Baguette Balance",
      0xd: "Trucker's Luck",
      0xe: "Breakfast at Cherry's",
      0xf: "Toad Rage",
      0x10: "Right on Cue",
      0x11: "Interesting Voyage",
      0x12: "Beached Buggies",
      0x13: "The Main Course",
      0x14: "Text Book Manoeuver",
      0x15: "Super Bowl",
      0x16: "Snail Trail",
      0x17: "Pot Luck",
      0x18: "Formula X",
      0x19: "Bucket and Speed",
      0x1a: "Tanks Alot",
      0x1b: "Must Try Harder",
      0x1c: "Hair of the Dog",
      0x1d: "Splash 'n Dash",
      0x1e: "Love Triangle",
      0x1f: "Bio-Hazard",
      0x20: "Sand Blaster",
      0x21: "Fast Food",
      0x22: "Learning Curves",
      0x23: "Wipeup",
      0x24: "Pond Life",
      0x25: "Periodic Park",
      0x26: "Dunes of Hazard",
      0x27: "School Rulez",
      0x28: "Brake-Fast Bends",
      0x29: "Crash and Fern",
      0x2a: "Chemical Warfare",
    },
    progressions: {
      0x1: "Beginners",
      0x2: "Tricky",
      0x3: "Difficult",
      0x4: "Advanced",
      0x5: "Masters",
      0x6: "Rock Hard",
    },
    raceProgressions: {
      0x0: "Gold",
      0x1: "Silver",
      0x3: "-",
    },
    raceVehicles,
    vehicles,
  },
  resourcesOrder: {
    raceProgressions: [0x3],
  },
};

export default template;
