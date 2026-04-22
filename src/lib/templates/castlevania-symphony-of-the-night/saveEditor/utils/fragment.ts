import type { ItemGroup } from "$lib/types";

export function timeAttackFragment(name: string, offset: number): ItemGroup {
  return {
    name,
    type: "group",
    mode: "time",
    items: [
      {
        id: "ta-hours",
        offset,
        type: "variable",
        dataType: "uint32",
        max: 99,
      },
      {
        id: "ta-minutes",
        offset,
        type: "variable",
        dataType: "uint32",
        leadingZeros: 1,
        max: 59,
      },
      {
        id: "ta-seconds",
        offset,
        type: "variable",
        dataType: "uint32",
        leadingZeros: 1,
        max: 59,
      },
    ],
  };
}
