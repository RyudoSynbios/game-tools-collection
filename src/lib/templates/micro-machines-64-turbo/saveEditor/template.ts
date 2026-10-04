import type { GameJson, ItemSection } from "$lib/types";

import { timeFragment } from "./utils/fragment";
import { difficulties, raceVehicles, vehicles } from "./utils/resource";

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
                      disabled: true,
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
                          items: difficulties.map((difficulty, index) => {
                            let shift =
                              index > 0 ? 0x4 + (index - 1) * 0x5 : 0x0;

                            return {
                              id: "raceBitflags",
                              name: difficulty.name,
                              type: "bitflags",
                              reversed: true,
                              flags: [...Array(difficulty.courses).keys()].map(
                                (index) => ({
                                  offset: 0x575 + shift++,
                                  bit: 4,
                                  label: `Race ${index + 1}`,
                                }),
                              ),
                            };
                          }),
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
                          ],
                        },
                        {
                          type: "section",
                          flex: true,
                          hidden: true,
                          items: [
                            {
                              name: "Beginners",
                              type: "bitflags",
                              flags: [
                                { offset: 0x592, bit: 0, label: "Flag 1" },
                                { offset: 0x592, bit: 1, label: "Flag 2" },
                                { offset: 0x592, bit: 2, label: "Flag 3" },
                              ],
                            },
                            {
                              name: "Tricky",
                              type: "bitflags",
                              flags: [
                                { offset: 0x592, bit: 3, label: "Flag 1" },
                                { offset: 0x592, bit: 4, label: "Flag 2" },
                                { offset: 0x592, bit: 5, label: "Flag 3" },
                                { offset: 0x592, bit: 6, label: "Flag 4" },
                                { offset: 0x592, bit: 7, label: "Flag 5" },
                              ],
                            },
                            {
                              name: "Difficult",
                              type: "bitflags",
                              flags: [
                                { offset: 0x593, bit: 0, label: "Flag 1" },
                                { offset: 0x593, bit: 1, label: "Flag 2" },
                                { offset: 0x593, bit: 2, label: "Flag 3" },
                              ],
                            },
                            {
                              name: "Advanced",
                              type: "bitflags",
                              flags: [
                                { offset: 0x593, bit: 3, label: "Flag 1" },
                                { offset: 0x593, bit: 4, label: "Flag 2" },
                                { offset: 0x593, bit: 5, label: "Flag 3" },
                                { offset: 0x593, bit: 6, label: "Flag 4" },
                                { offset: 0x593, bit: 7, label: "Flag 5" },
                              ],
                            },
                            {
                              name: "Masters",
                              type: "bitflags",
                              flags: [
                                { offset: 0x594, bit: 0, label: "Flag 1" },
                                { offset: 0x594, bit: 1, label: "Flag 2" },
                                { offset: 0x594, bit: 2, label: "Flag 3" },
                              ],
                            },
                            {
                              name: "Rock Hard",
                              type: "bitflags",
                              flags: [
                                { offset: 0x594, bit: 3, label: "Flag 1" },
                                { offset: 0x594, bit: 4, label: "Flag 2" },
                                { offset: 0x594, bit: 5, label: "Flag 3" },
                                { offset: 0x594, bit: 6, label: "Flag 4" },
                                { offset: 0x594, bit: 7, label: "Flag 5" },
                              ],
                            },
                          ],
                        },
                        ...difficulties.map((difficulty, index) => {
                          let shift = index > 0 ? 0x4 + (index - 1) * 0x5 : 0x0;

                          return {
                            name: difficulty.name,
                            type: "section",
                            flex: true,
                            items: [...Array(difficulty.courses).keys()].map(
                              (index) => ({
                                id: `challengeRace-${shift}`,
                                name: `Race ${index + 1}`,
                                offset: 0x575 + shift++,
                                type: "variable",
                                dataType: "uint8",
                                binary: { bitStart: 0, bitLength: 2 },
                                resource: "raceProgressions",
                              }),
                            ),
                          } as ItemSection;
                        }),
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
                          items: difficulties.map((difficulty, index) => {
                            let shift =
                              index > 0 ? 0x4 + (index - 1) * 0x5 : 0x0;

                            return {
                              id: "raceBitflags",
                              name: difficulty.name,
                              type: "bitflags",
                              reversed: true,
                              flags: [...Array(difficulty.courses).keys()].map(
                                (index) => ({
                                  offset: 0x575 + shift++,
                                  bit: 2,
                                  label: `Race ${index + 1}`,
                                }),
                              ),
                            };
                          }),
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
