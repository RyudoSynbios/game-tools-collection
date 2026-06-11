import type { ItemGroup } from "$lib/types";

export function chronoFragment(
  name: string,
  offset: number,
  id?: string,
  subId?: string,
): ItemGroup {
  return {
    id,
    name,
    type: "group",
    mode: "chrono",
    items: [
      {
        id: subId,
        offset,
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
        id: subId,
        offset,
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
        id: subId,
        offset,
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
  };
}
