import type { ItemGroup } from "$lib/types";

export function timeFragment(offset: number): ItemGroup {
  return {
    name: "Time",
    type: "group",
    mode: "chrono",
    items: [
      {
        id: "time",
        offset,
        type: "variable",
        dataType: "uint32",
        operations: [
          { "/": 60 },
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
        id: "time",
        offset,
        type: "variable",
        dataType: "uint32",
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
        id: "time",
        offset,
        type: "variable",
        dataType: "uint32",
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
  };
}
