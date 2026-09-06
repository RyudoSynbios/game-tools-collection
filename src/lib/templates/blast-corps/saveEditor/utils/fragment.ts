import type { ItemChecksum, ItemGroup, ItemTab } from "$lib/types";

import { timeVehicles, type Level } from "./resource";

export function levelFragment(level: Level): ItemTab {
  const eepTimesShift = level.index * 0x4;
  const mpkTimesShift = level.index * 0x20;
  const mpkFlagsShift = (level.flagIndex || 0x0) * 0x40;

  let timeItems: { index: number; name: string }[] = [];

  if (level.flagIndex !== undefined) {
    timeItems = [
      { index: 0x0, name: "Clear Time" },
      { index: 0x1, name: "Playtime" },
    ];
  } else if (level.vehicles) {
    timeItems = level.vehicles.map((vehicle) => ({
      index: vehicle,
      name: timeVehicles[vehicle],
    }));
  }

  return {
    name: level.name,
    items: [
      {
        type: "section",
        flex: true,
        hidden: true,
        items: [
          {
            id: "checksum-mpk-%index%",
            name: "Checksum MPK Times",
            offset: 0x11c + mpkTimesShift,
            type: "checksum",
            dataType: "uint32",
            bigEndian: true,
            control: {
              offsetStart: 0x100 + mpkTimesShift,
              offsetEnd: 0x120 + mpkTimesShift,
            },
            disabled: true,
          },
          ...(level.flagIndex !== undefined
            ? [
                {
                  id: "checksum-mpk-%index%",
                  name: "Checksum MPK Flags",
                  offset: 0x8bc + mpkFlagsShift,
                  type: "checksum",
                  dataType: "uint32",
                  bigEndian: true,
                  control: {
                    offsetStart: 0x880 + mpkFlagsShift,
                    offsetEnd: 0x8c0 + mpkFlagsShift,
                  },
                  disabled: true,
                } as ItemChecksum,
              ]
            : []),
        ],
      },
      {
        id: "sectionProgression",
        type: "section",
        flex: true,
        items: [
          {
            id: `levelProgression-%index%-${level.index}`,
            name: "Progression",
            offset: 0x18 + level.index,
            type: "variable",
            dataType: "uint8",
            resource:
              level.flagIndex !== undefined || level.type === 0xf
                ? "mainLevelProgressions"
                : "sideLevelProgressions",
          },
          {
            name: `Communication Point${level.cp > 1 ? "s" : ""}`,
            offset: 0x54 + level.index,
            type: "variable",
            dataType: "uint8",
            resource: `communcationPoints${level.cp}`,
            hidden: level.cp === 0,
          },
          {
            name: "Last Used Vehicle",
            offset: 0x92 + level.index,
            type: "variable",
            dataType: "uint8",
            resource: "vehicles",
            hidden: true,
          },
        ],
      },
      {
        id: "section-eep-%index%",
        type: "section",
        flex: true,
        hidden: true,
        items: [
          {
            name: "Clear Time",
            type: "group",
            mode: "chrono",
            items: [
              {
                id: "clearTimeEep",
                offset: 0x100 + eepTimesShift,
                type: "variable",
                dataType: "uint16",
                bigEndian: true,
                operations: [
                  { "*": 6 },
                  {
                    convert: {
                      from: "seconds",
                      to: "hours",
                    },
                  },
                ],
                max: 99,
              },
              {
                id: "clearTimeEep",
                offset: 0x100 + eepTimesShift,
                type: "variable",
                dataType: "uint16",
                bigEndian: true,
                operations: [
                  { "/": 10 },
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
              {
                id: "clearTimeEep",
                offset: 0x100 + eepTimesShift,
                type: "variable",
                dataType: "uint16",
                bigEndian: true,
                operations: [
                  { "/": 10 },
                  {
                    convert: {
                      from: "seconds",
                      to: "milliseconds",
                    },
                  },
                ],
                leadingZeros: 2,
                max: 900,
                step: 100,
              },
            ],
          },
          {
            name: "Checksum EEP Time",
            offset: 0x102 + eepTimesShift,
            type: "variable",
            dataType: "uint16",
            bigEndian: true,
            hex: true,
            hidden: true,
            test: true,
          },
        ],
      },
      {
        id: "section-mpk-%index%",
        type: "section",
        flex: true,
        hidden: true,
        items: timeItems.map(
          (item) =>
            ({
              name: item.name,
              type: "group",
              mode: "chrono",
              items: [
                {
                  offset: 0x100 + mpkTimesShift + item.index * 0x2,
                  type: "variable",
                  dataType: "uint16",
                  bigEndian: true,
                  operations: [
                    { "*": 6 },
                    {
                      convert: {
                        from: "seconds",
                        to: "hours",
                      },
                    },
                  ],
                  max: 99,
                },
                {
                  offset: 0x100 + mpkTimesShift + item.index * 0x2,
                  type: "variable",
                  dataType: "uint16",
                  bigEndian: true,
                  operations: [
                    { "/": 10 },
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
                {
                  offset: 0x100 + mpkTimesShift + item.index * 0x2,
                  type: "variable",
                  dataType: "uint16",
                  bigEndian: true,
                  operations: [
                    { "/": 10 },
                    {
                      convert: {
                        from: "seconds",
                        to: "milliseconds",
                      },
                    },
                  ],
                  leadingZeros: 2,
                  max: 900,
                  step: 100,
                },
              ],
            }) as ItemGroup,
        ),
      },
    ],
  };
}
