import type { ItemGroup } from "$lib/types";

export function chronoFragment(
  name: string,
  offset: number,
  dataType: "uint16" | "uint32",
): ItemGroup {
  return {
    name,
    type: "group",
    mode: "chrono",
    items: [
      {
        offset,
        type: "variable",
        dataType,
        operations: [
          { "*": 16.666666667 },
          {
            convert: {
              from: "milliseconds",
              to: "minutes",
            },
          },
          { round: 0 },
        ],
        max: dataType === "uint16" ? 9 : 59,
      },
      {
        offset,
        type: "variable",
        dataType,
        operations: [
          { "*": 16.666666667 },
          {
            convert: {
              from: "milliseconds",
              to: "seconds",
            },
          },
          { round: 0 },
        ],
        leadingZeros: 1,
        max: 59,
      },
      {
        offset,
        type: "variable",
        dataType,
        operations: [
          { "*": 16.666666667 },
          {
            convert: {
              from: "milliseconds",
              to: "milliseconds",
            },
          },
          { round: 0 },
        ],
        leadingZeros: 2,
        max: 990,
        step: 100,
      },
    ],
  };
}
