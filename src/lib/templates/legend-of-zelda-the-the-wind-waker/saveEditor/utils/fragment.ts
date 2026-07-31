import { bitToOffset } from "$lib/utils/bytes";

import type { ItemBitflags, ItemTab } from "$lib/types";

import { treasureCharts } from "./resource";

export function seaChartFragment(type: number): ItemTab {
  let name = "";

  switch (type) {
    case 0x0:
      name = "Triforce Charts";
      break;
    case 0x1:
      name = "Treasure Charts";
      break;
    case 0x2:
      name = "Special Charts";
      break;
  }

  return {
    name,
    flex: true,
    items: [
      {
        name: "Obtained",
        type: "bitflags",
        flags: treasureCharts
          .filter((chart) => chart.type === type)
          .map((chart) => ({
            offset: 0x2117 + bitToOffset(chart.index),
            bit: chart.index % 8,
            label: chart.name,
          })),
      },
      {
        name: "Opened",
        type: "bitflags",
        hidden: true,
        flags: treasureCharts
          .filter((chart) => chart.type === type)
          .map((chart) => ({
            offset: 0x2127 + bitToOffset(chart.index),
            bit: chart.index % 8,
            label: chart.name,
          })),
      },
      ...(type === 0x0
        ? [
            {
              name: "Deciphered",
              type: "bitflags",
              flags: treasureCharts
                .filter((chart) => chart.type === type)
                .map((chart) => ({
                  offset: 0x2188 + bitToOffset(chart.index - 0x18),
                  bit: chart.index % 8,
                  label: chart.name,
                })),
            } as ItemBitflags,
          ]
        : []),
      ...(type !== 0x2
        ? [
            {
              id: `treasureCharts-${type}`,
              name: "Found",
              type: "bitflags",
              flags: treasureCharts
                .filter((chart) => chart.type === type)
                .map((chart) => ({
                  offset: 0x2137 + bitToOffset(chart.index),
                  bit: chart.index % 8,
                  label: chart.name,
                })),
            } as ItemBitflags,
          ]
        : []),
    ],
  };
}
