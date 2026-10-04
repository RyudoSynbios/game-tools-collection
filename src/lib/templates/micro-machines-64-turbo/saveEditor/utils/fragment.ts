import type { ItemSection } from "$lib/types";

export function timeFragment(
  sectionName: string,
  name: string,
  timeOffset: number,
  vehicleOffset: number,
): ItemSection {
  return {
    name: sectionName,
    type: "section",
    flex: true,
    items: [
      {
        name: name,
        type: "group",
        mode: "chrono",
        items: [
          {
            id: "time",
            offset: timeOffset,
            type: "variable",
            dataType: "uint32",
            bigEndian: true,
            operations: [
              { "*": 600 },
              {
                convert: { from: "milliseconds", to: "hours" },
              },
            ],
            max: 99,
          },
          {
            id: "time",
            offset: timeOffset,
            type: "variable",
            dataType: "uint32",
            bigEndian: true,
            operations: [
              { "*": 10 },
              {
                convert: {
                  from: "milliseconds",
                  to: "seconds",
                },
              },
            ],
            leadingZeros: 1,
            max: 59,
          },
          {
            id: "time",
            offset: timeOffset,
            type: "variable",
            dataType: "uint32",
            bigEndian: true,
            operations: [
              { "*": 10 },
              {
                convert: {
                  from: "milliseconds",
                  to: "milliseconds",
                },
              },
            ],
            leadingZeros: 2,
            max: 990,
            step: 10,
          },
        ],
      },
      {
        name: "Vehicle",
        offset: vehicleOffset,
        type: "variable",
        dataType: "uint8",
        resource: "raceVehicles",
        overrideShift: {
          parent: 1,
          shift: 0x1,
        },
        autocomplete: true,
      },
    ],
  };
}
