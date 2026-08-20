import type { GameJson, ItemSection, ItemTab } from "$lib/types";

import { partFragment, timeFragment } from "./utils/fragment";
import {
  arcadeCourses,
  carList,
  cars,
  carsGroups,
  gtHiFiCourses,
  gtLeagueCups,
  manufacturers,
  parts,
  partTypes,
  raceCars,
  raceCarsGroups,
  raceCarsOrder,
  specialEventChallenges,
  spotRaceCourses,
  timeTrialCourses,
} from "./utils/resource";

const template: GameJson = {
  validator: {
    platforms: {
      playstation: {
        europe: {
          0x0: [0x53, 0x43, 0x45, 0x53, 0x2d, 0x30, 0x30, 0x39, 0x38, 0x34], // "SCES-00984"
        },
        usa: {
          0x0: [0x53, 0x43, 0x55, 0x53, 0x2d, 0x39, 0x34, 0x31, 0x39, 0x34], // "SCUS-94194"
        },
        japan: {
          0x0: [0x53, 0x43, 0x50, 0x53, 0x2d, 0x31, 0x30, 0x30, 0x34, 0x35], // "SCPS-10045"
        },
      },
    },
    text: "Drag 'n' drop here or click to add a save file.",
    error: "Not a valid save file.",
  },
  items: [
    {
      id: "slots",
      length: 0x2000,
      type: "container",
      instanceType: "section",
      instances: 1,
      items: [
        {
          name: "Checksum",
          offset: 0x6da4,
          type: "checksum",
          dataType: "uint32",
          control: {
            offsetStart: 0x200,
            offsetEnd: 0x6da4,
          },
        },
        {
          type: "tabs",
          items: [
            {
              name: "General",
              items: [
                {
                  name: "Playtime",
                  type: "group",
                  mode: "time",
                  items: [
                    {
                      offset: 0x200,
                      type: "variable",
                      dataType: "uint32",
                      operations: [
                        {
                          convert: { from: "seconds", to: "hours" },
                        },
                      ],
                      max: 999,
                    },
                    {
                      offset: 0x200,
                      type: "variable",
                      dataType: "uint32",
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
                      offset: 0x200,
                      type: "variable",
                      dataType: "uint32",
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
              name: "Arcade Mode",
              items: [
                {
                  type: "tabs",
                  items: [
                    {
                      name: "Single Race",
                      items: [
                        {
                          length: 0x28,
                          type: "container",
                          instanceType: "tabs",
                          instances: 8,
                          resource: "arcadeCourses",
                          vertical: true,
                          items: [
                            {
                              type: "section",
                              flex: true,
                              items: [
                                {
                                  name: "A Class",
                                  type: "bitflags",
                                  overrideShift: { parent: 1, shift: 0x4 },
                                  flags: [
                                    { offset: 0x6cf8, bit: 0, label: "Easy" },
                                    { offset: 0x6cf8, bit: 1, label: "Normal" },
                                    { offset: 0x6cf8, bit: 2, label: "Hard" },
                                  ],
                                },
                                {
                                  name: "B Class",
                                  type: "bitflags",
                                  overrideShift: { parent: 1, shift: 0x4 },
                                  flags: [
                                    { offset: 0x6cf9, bit: 0, label: "Easy" },
                                    { offset: 0x6cf9, bit: 1, label: "Normal" },
                                    { offset: 0x6cf9, bit: 2, label: "Hard" },
                                  ],
                                },
                                {
                                  name: "C Class",
                                  type: "bitflags",
                                  overrideShift: { parent: 1, shift: 0x4 },
                                  flags: [
                                    { offset: 0x6cfa, bit: 0, label: "Easy" },
                                    { offset: 0x6cfa, bit: 1, label: "Normal" },
                                    { offset: 0x6cfa, bit: 2, label: "Hard" },
                                  ],
                                },
                              ],
                            },
                            timeFragment("arcade", 0x6410, "Total Time"),
                            timeFragment("arcade", 0x63fc, "Lap Time"),
                          ],
                        },
                      ],
                    },
                    {
                      name: "Time Attack",
                      items: [
                        {
                          length: 0xb4,
                          type: "container",
                          instanceType: "tabs",
                          instances: 8,
                          resource: "arcadeCourses",
                          vertical: true,
                          items: [
                            timeFragment("arcade", 0x653c, "Lap Time"),
                            {
                              length: 0x14,
                              type: "container",
                              instanceType: "section",
                              instances: 8,
                              enumeration: "%o Place",
                              items: [timeFragment("arcade", 0x6550)],
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
              name: "Gran Turismo",
              items: [
                {
                  type: "tabs",
                  items: [
                    {
                      name: "General",
                      flex: true,
                      items: [
                        {
                          name: "Days",
                          offset: 0x208,
                          type: "variable",
                          dataType: "uint32",
                          max: 99999,
                        },
                        {
                          id: "credits",
                          name: "Credits",
                          offset: 0x204,
                          type: "variable",
                          dataType: "uint32",
                          max: 2000000000,
                          test: true,
                        },
                        {
                          id: "currentCar",
                          name: "Car",
                          offset: 0x218,
                          type: "variable",
                          dataType: "int16",
                          resource: "carNames",
                          size: "lg",
                          autocomplete: true,
                        },
                      ],
                    },
                    {
                      name: "Garage",
                      items: [
                        {
                          id: "carSlots",
                          name: "Slots",
                          offset: 0x21a,
                          type: "variable",
                          dataType: "uint16",
                          hidden: true,
                        },
                        {
                          id: "carTabs",
                          length: 0x60,
                          type: "container",
                          instanceType: "tabs",
                          instances: 100,
                          resource: "carNames",
                          vertical: true,
                          fixedWidth: true,
                          onTabChange: "onCarChange(%d)",
                          items: [
                            {
                              id: "carSection",
                              type: "section",
                              flex: true,
                              items: [
                                {
                                  id: "car-%index%",
                                  name: "Car",
                                  offset: 0x3ac,
                                  type: "variable",
                                  dataType: "uint8",
                                  resource: "cars",
                                  size: "lg",
                                  autocomplete: true,
                                },
                                {
                                  id: "color",
                                  name: "Color",
                                  offset: 0x3ad,
                                  type: "variable",
                                  dataType: "uint8",
                                  resource: "colorNames",
                                  size: "lg",
                                  autocomplete: true,
                                },
                                {
                                  id: "price",
                                  name: "Price",
                                  offset: 0x21c,
                                  type: "variable",
                                  dataType: "uint32",
                                  operations: [{ "/": 100 }],
                                  overrideShift: {
                                    parent: 1,
                                    shift: 0x4,
                                  },
                                },
                                {
                                  id: "dirtiness",
                                  name: "Dirtiness",
                                  offset: 0x406,
                                  type: "variable",
                                  dataType: "uint16",
                                  max: 100,
                                  suffix: "%",
                                },
                              ],
                            },
                            ...partTypes.map(
                              (type) =>
                                ({
                                  name: type.name,
                                  type: "section",
                                  flex: true,
                                  items: parts
                                    .filter((part) => part.type === type.index)
                                    .sort((a, b) => a.order - b.order)
                                    .map((part) => ({
                                      id: `part-${part.dataIndex}`,
                                      name: part.name,
                                      offset: 0x3b0 + part.index * 0x2,
                                      type: "variable",
                                      dataType: "uint16",
                                      resource: part.resource,
                                    })),
                                }) as ItemSection,
                            ),
                          ],
                        },
                      ],
                    },
                    {
                      name: "Parts",
                      items: [
                        {
                          type: "tabs",
                          vertical: true,
                          items: manufacturers.map(
                            (manufacturer) =>
                              ({
                                name: manufacturer.name,
                                items: [
                                  {
                                    type: "tabs",
                                    vertical: true,
                                    fixedWidth: true,
                                    items: carList
                                      .filter(
                                        (car) =>
                                          car.manufacturer ===
                                          manufacturer.index,
                                      )
                                      .map((car) => ({
                                        name: car.name,
                                        flex: true,
                                        items: parts.map((part) =>
                                          partFragment(car, part),
                                        ),
                                      })),
                                  },
                                ],
                              }) as ItemTab,
                          ),
                        },
                      ],
                    },
                    {
                      name: "License",
                      items: [
                        {
                          length: 0x700,
                          type: "container",
                          instanceType: "tabs",
                          instances: 3,
                          resource: "licenses",
                          items: [
                            {
                              length: 0xe0,
                              type: "container",
                              instanceType: "tabs",
                              instances: 8,
                              resource: "licenseTests%index%",
                              vertical: true,
                              items: [
                                {
                                  type: "section",
                                  flex: true,
                                  items: [
                                    {
                                      id: "license-%parent%-%index%",
                                      name: "Progression",
                                      offset: 0x2d54,
                                      type: "variable",
                                      dataType: "uint8",
                                      resource: "licenseProgressions",
                                      overrideShift: {
                                        parent: 2,
                                        shift: 0x0,
                                      },
                                    },
                                  ],
                                },
                                {
                                  length: 0x1c,
                                  type: "container",
                                  instanceType: "section",
                                  instances: 8,
                                  enumeration: "%o Place",
                                  items: [timeFragment("license", 0x2d6c)],
                                },
                              ],
                            },
                          ],
                        },
                      ],
                    },
                    {
                      name: "Races",
                      items: [
                        {
                          type: "tabs",
                          items: [
                            {
                              name: "GT League",
                              items: [
                                {
                                  type: "tabs",
                                  vertical: true,
                                  items: [
                                    {
                                      name: "General",
                                      flex: true,
                                      items: [
                                        {
                                          name: "Sunday Cup",
                                          offset: 0x426c,
                                          type: "variable",
                                          dataType: "uint8",
                                          resource: "gtRaceProgressions",
                                        },
                                        {
                                          name: "Clubman Cup",
                                          offset: 0x426d,
                                          type: "variable",
                                          dataType: "uint8",
                                          resource: "gtRaceProgressions",
                                        },
                                        {
                                          name: "GT Cup",
                                          offset: 0x426e,
                                          type: "variable",
                                          dataType: "uint8",
                                          resource: "gtRaceProgressions",
                                        },
                                        {
                                          name: "GT World Cup",
                                          offset: 0x426f,
                                          type: "variable",
                                          dataType: "uint8",
                                          resource: "gtRaceProgressions",
                                        },
                                      ],
                                    },
                                    ...gtLeagueCups.map(
                                      (cup) =>
                                        ({
                                          name: cup.name,
                                          items: [
                                            {
                                              type: "tabs",
                                              vertical: true,
                                              items: cup.courses.map(
                                                (course) => ({
                                                  name: course.name,
                                                  items: [
                                                    timeFragment(
                                                      "mainRace",
                                                      0x42bc +
                                                        course.index * 0x54,
                                                      "Total Time",
                                                    ),
                                                    timeFragment(
                                                      "mainRace",
                                                      0x4284 +
                                                        course.index * 0x54,
                                                      "Lap Time",
                                                    ),
                                                    timeFragment(
                                                      "mainRace",
                                                      0x42a0 +
                                                        course.index * 0x54,
                                                      "Qualification Time",
                                                    ),
                                                  ],
                                                }),
                                              ),
                                            },
                                          ],
                                        }) as ItemTab,
                                    ),
                                  ],
                                },
                              ],
                            },
                            {
                              name: "Special Event",
                              items: [
                                {
                                  type: "tabs",
                                  vertical: true,
                                  items: [
                                    {
                                      name: "General",
                                      items: [
                                        {
                                          type: "section",
                                          flex: true,
                                          items: [
                                            {
                                              name: "FF Cars",
                                              offset: 0x4273,
                                              type: "variable",
                                              dataType: "uint8",
                                              resource: "gtRaceProgressions",
                                            },
                                            {
                                              name: "FR Cars",
                                              offset: 0x4274,
                                              type: "variable",
                                              dataType: "uint8",
                                              resource: "gtRaceProgressions",
                                            },
                                            {
                                              name: "4WD Cars",
                                              offset: 0x4275,
                                              type: "variable",
                                              dataType: "uint8",
                                              resource: "gtRaceProgressions",
                                            },
                                          ],
                                        },
                                        {
                                          type: "section",
                                          flex: true,
                                          items: [
                                            {
                                              name: "Lightweight Cars",
                                              offset: 0x4272,
                                              type: "variable",
                                              dataType: "uint8",
                                              resource: "gtRaceProgressions",
                                            },
                                            {
                                              name: "Normal Cars",
                                              offset: 0x4270,
                                              type: "variable",
                                              dataType: "uint8",
                                              resource: "gtRaceProgressions",
                                            },
                                            {
                                              name: "Tuned Cars",
                                              offset: 0x4271,
                                              type: "variable",
                                              dataType: "uint8",
                                              resource: "gtRaceProgressions",
                                            },
                                          ],
                                        },
                                        {
                                          type: "section",
                                          flex: true,
                                          items: [
                                            {
                                              name: "US v Japan",
                                              offset: 0x427c,
                                              type: "variable",
                                              dataType: "uint8",
                                              resource: "gtRaceProgressions",
                                            },
                                            {
                                              name: "UK v Japan",
                                              offset: 0x427d,
                                              type: "variable",
                                              dataType: "uint8",
                                              resource: "gtRaceProgressions",
                                            },
                                            {
                                              name: "UK v US",
                                              offset: 0x427e,
                                              type: "variable",
                                              dataType: "uint8",
                                              resource: "gtRaceProgressions",
                                            },
                                          ],
                                        },
                                        {
                                          type: "section",
                                          flex: true,
                                          items: [
                                            {
                                              name: "Megaspeed",
                                              offset: 0x427b,
                                              type: "variable",
                                              dataType: "uint8",
                                              resource: "gtRaceProgressions",
                                            },
                                          ],
                                        },
                                        {
                                          type: "section",
                                          flex: true,
                                          items: [
                                            {
                                              name: "Grand Valley",
                                              offset: 0x427f,
                                              type: "variable",
                                              dataType: "uint8",
                                              resource: "gtRaceProgressions",
                                            },
                                            {
                                              name: "All-night I",
                                              offset: 0x4280,
                                              type: "variable",
                                              dataType: "uint8",
                                              resource: "gtRaceProgressions",
                                            },
                                            {
                                              name: "All-night II",
                                              offset: 0x4281,
                                              type: "variable",
                                              dataType: "uint8",
                                              resource: "gtRaceProgressions",
                                            },
                                          ],
                                        },
                                      ],
                                    },
                                    ...specialEventChallenges.map(
                                      (challenge) =>
                                        ({
                                          name: challenge.name,
                                          items: [
                                            {
                                              type: "tabs",
                                              vertical: true,
                                              items: challenge.courses.map(
                                                (course) => ({
                                                  name: course.name,
                                                  items: [
                                                    timeFragment(
                                                      "mainRace",
                                                      0x42bc +
                                                        course.index * 0x54,
                                                      "Total Time",
                                                    ),
                                                    timeFragment(
                                                      "mainRace",
                                                      0x4284 +
                                                        course.index * 0x54,
                                                      "Lap Time",
                                                    ),
                                                    timeFragment(
                                                      "mainRace",
                                                      0x42a0 +
                                                        course.index * 0x54,
                                                      "Qualification Time",
                                                    ),
                                                  ],
                                                }),
                                              ),
                                            },
                                          ],
                                        }) as ItemTab,
                                    ),
                                  ],
                                },
                              ],
                            },
                            {
                              name: "Spot Race",
                              items: [
                                {
                                  type: "tabs",
                                  vertical: true,
                                  items: [
                                    {
                                      name: "General",
                                      flex: true,
                                      items: [
                                        {
                                          name: "High Speed Ring",
                                          offset: 0x4276,
                                          type: "variable",
                                          dataType: "uint8",
                                          resource: "gtRaceProgressions",
                                        },
                                        {
                                          name: "Grand Valley East",
                                          offset: 0x4277,
                                          type: "variable",
                                          dataType: "uint8",
                                          resource: "gtRaceProgressions",
                                        },
                                        {
                                          name: "Autumn Ring-Mini",
                                          offset: 0x4278,
                                          type: "variable",
                                          dataType: "uint8",
                                          resource: "gtRaceProgressions",
                                        },
                                        {
                                          name: "Trial Mountain",
                                          offset: 0x4279,
                                          type: "variable",
                                          dataType: "uint8",
                                          resource: "gtRaceProgressions",
                                        },
                                        {
                                          name: "Deep Forest",
                                          offset: 0x427a,
                                          type: "variable",
                                          dataType: "uint8",
                                          resource: "gtRaceProgressions",
                                        },
                                      ],
                                    },
                                    ...spotRaceCourses.map((course) => ({
                                      name: course.name,
                                      items: [
                                        timeFragment(
                                          "mainRace",
                                          0x42bc + course.index * 0x54,
                                          "Total Time",
                                        ),
                                        timeFragment(
                                          "mainRace",
                                          0x4284 + course.index * 0x54,
                                          "Lap Time",
                                        ),
                                        timeFragment(
                                          "mainRace",
                                          0x42a0 + course.index * 0x54,
                                          "Qualification Time",
                                        ),
                                      ],
                                    })),
                                  ],
                                },
                              ],
                            },
                            {
                              name: "GT HiFi",
                              items: [
                                {
                                  type: "tabs",
                                  vertical: true,
                                  items: gtHiFiCourses.map((course) => ({
                                    name: course.name,
                                    items: [
                                      timeFragment(
                                        "standard",
                                        0x5c38 + course.index * 0x38,
                                        "Total Time",
                                      ),
                                      timeFragment(
                                        "standard",
                                        0x5c1c + course.index * 0x38,
                                        "Lap Time",
                                      ),
                                    ],
                                  })),
                                },
                              ],
                            },
                            {
                              name: "Time Trial",
                              items: [
                                {
                                  type: "tabs",
                                  vertical: true,
                                  items: timeTrialCourses.map((course) => ({
                                    name: course.name,
                                    items: [
                                      timeFragment(
                                        "standard",
                                        0x57a0 + course.index * 0x38,
                                        "Total Time",
                                      ),
                                      timeFragment(
                                        "standard",
                                        0x5784 + course.index * 0x38,
                                        "Lap Time",
                                      ),
                                    ],
                                  })),
                                },
                              ],
                            },
                          ],
                        },
                      ],
                    },
                    {
                      name: "Machine Test",
                      items: [
                        {
                          type: "tabs",
                          items: [
                            {
                              name: "0-400m Challenge",
                              items: [
                                {
                                  length: 0x1c,
                                  type: "container",
                                  instanceType: "section",
                                  instances: 20,
                                  enumeration: "%o Place",
                                  items: [timeFragment("standard", 0x5d6c)],
                                },
                              ],
                            },
                            {
                              name: "0-1000m Challenge",
                              items: [
                                {
                                  length: 0x1c,
                                  type: "container",
                                  instanceType: "section",
                                  instances: 20,
                                  enumeration: "%o Place",
                                  items: [timeFragment("standard", 0x5f9c)],
                                },
                              ],
                            },
                            {
                              name: "Max Speed Challenge",
                              items: [
                                {
                                  length: 0x1c,
                                  type: "container",
                                  instanceType: "section",
                                  instances: 20,
                                  enumeration: "%o Place",
                                  items: [
                                    timeFragment("speedChallenge", 0x61cc),
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
              name: "Options",
              items: [
                {
                  name: "2 Player Battle",
                  type: "section",
                  flex: true,
                  items: [
                    {
                      name: "Laps",
                      offset: 0x6d2b,
                      type: "variable",
                      dataType: "uint8",
                      resource: "laps",
                    },
                    {
                      name: "Tyre Damage",
                      offset: 0x6d34,
                      type: "variable",
                      dataType: "uint8",
                      resource: "tyreDamages",
                    },
                    {
                      name: "Handicap",
                      offset: 0x6d2d,
                      type: "variable",
                      dataType: "uint8",
                      resource: "handicaps",
                    },
                  ],
                },
                {
                  name: "Music / Sound Effects",
                  type: "section",
                  flex: true,
                  items: [
                    {
                      name: "Music",
                      offset: 0x6d27,
                      type: "variable",
                      dataType: "uint8",
                      resource: "",
                    },
                    {
                      name: "SE",
                      offset: 0x6d28,
                      type: "variable",
                      dataType: "uint8",
                      resource: "",
                    },
                  ],
                },
                {
                  name: "Dual Shock",
                  type: "section",
                  flex: true,
                  items: [
                    {
                      name: "Vibration",
                      offset: 0x6d26,
                      type: "variable",
                      dataType: "uint8",
                      resource: "optionBooleanReversed",
                    },
                  ],
                },
                {
                  name: "View Status",
                  type: "section",
                  flex: true,
                  items: [
                    {
                      name: "View Position",
                      offset: 0x6d1d,
                      type: "variable",
                      dataType: "uint8",
                      resource: "viewPositions",
                    },
                    {
                      name: "Chase View",
                      offset: 0x6d1e,
                      type: "variable",
                      dataType: "uint8",
                      resource: "chaseViews",
                    },
                    {
                      name: "Course Map",
                      offset: 0x6d1c,
                      type: "variable",
                      dataType: "uint8",
                      resource: "optionBooleanReversed",
                    },
                    {
                      name: "View Angle",
                      offset: 0x6d18,
                      type: "variable",
                      dataType: "uint8",
                      resource: "viewAngles",
                    },
                  ],
                },
                {
                  type: "section",
                  flex: true,
                  items: [
                    {
                      name: "Ghost",
                      offset: 0x6d24,
                      type: "variable",
                      dataType: "uint8",
                      resource: "optionBooleanReversed",
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
    arcadeCourses,
    brakeControllers: {},
    brakeKits: {},
    carNames: "getCarNames()",
    cars: {
      0x0: "-",
      ...cars,
    },
    chaseViews: {
      0x0: "Normal",
      0x1: "Loose",
      0x2: "Tight",
    },
    clutchs: {},
    colorNames: {},
    computers: {},
    engineBalancings: {},
    flywheels: {},
    frontStabilisers: {},
    gearKits: {},
    gtRaceProgressions: {
      0x0: "-",
      0x1: "Gold",
      0x2: "Silver",
      0x3: "Bronze",
      0x4: "4th Place",
      0x5: "5th Place",
      0x6: "6th Place",
    },
    handicaps: {
      0x0: "None",
      0x1: "Low",
      0x2: "High",
    },
    increasingDisplacements: {},
    intercoolers: {},
    laps: {
      0x0: "1 Lap",
      0x1: "2 Laps",
      0x2: "3 Laps",
      0x3: "5 Laps",
      0x4: "7 Laps",
      0x5: "10 Laps",
      0x6: "15 Laps",
      0x7: "20 Laps",
      0x8: "30 Laps",
      0x9: "Free",
    },
    licenseProgressions: {
      0x0: "-",
      0x1: "Bronze",
      0x2: "Silver",
      0x3: "Gold",
    },
    licenseTests0: {
      0x0: "Starting and stopping 1",
      0x1: "Starting and stopping 2",
      0x2: "Basics of cornering 1",
      0x3: "Basics of cornering 2",
      0x4: "Basics of cornering 3",
      0x5: "Basics of multiple cornering 1",
      0x6: "Basics of multiple cornering 2",
      0x7: "B-Class License final test",
    },
    licenseTests1: {
      0x0: "Practical Cornering 1",
      0x1: "Practical Cornering 2",
      0x2: "Practical Cornering 3",
      0x3: "Handling Multiple Corners 1",
      0x4: "Handling Multiple Corners 2",
      0x5: "Handling Multiple Corners 3",
      0x6: "Advanced Techniques",
      0x7: "A-Class License final test",
    },
    licenseTests2: {
      0x0: "High Speed Ring time trial",
      0x1: "SS Route 5 time trial",
      0x2: "Grand Valley time trial",
      0x3: "Deep Forest time trial",
      0x4: "Autumn Ring time trial",
      0x5: "Trial Mountain time trial",
      0x6: "SS Route 11 time trial",
      0x7: "IA-Class License final test",
    },
    licenses: {
      0x0: "B-Class License",
      0x1: "A-Class License",
      0x2: "IA-Class License",
    },
    mufflers: {},
    naTunings: {},
    optionBooleanReversed: {
      0x0: "On",
      0x1: "Off",
    },
    portGrindings: {},
    propellerShafts: {},
    raceCars: {
      0x0: "-",
      ...raceCars,
    },
    racingModifications: {},
    rearStabilisers: {},
    suspensionKits: {},
    turbineKits: {},
    tyreDamages: {
      0x0: "None",
      0x1: "Slow",
      0x2: "Fast",
    },
    tyreSets: {},
    viewAngles: {
      0x9a: "Wide",
      0xd6: "Normal",
      0xf4: "Narrow",
    },
    viewPositions: {
      0x0: "Driver",
      0x1: "Chase 1",
      0x2: "Chase 2",
    },
    weightReductions: {},
  },
  resourcesGroups: {
    cars: carsGroups,
    raceCars: raceCarsGroups,
  },
  resourcesOrder: {
    carNames: [-1],
    raceCars: raceCarsOrder,
  },
};

export default template;
