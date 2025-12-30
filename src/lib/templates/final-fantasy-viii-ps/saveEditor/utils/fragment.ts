import { bitToOffset } from "$lib/utils/bytes";

import type { Item } from "$lib/types";

import { commonCards, uniqueCards } from "./resource";

export function cardPageFragment(level: number): Item[] {
  if (level < 7) {
    const base = level * 11;

    return commonCards.slice(base, base + 11).map((card, index) => {
      index += base;

      return {
        type: "section",
        flex: true,
        noMargin: true,
        items: [
          {
            id: "commonCardObtained",
            name: card.name,
            offset: 0x1460 + index,
            type: "variable",
            dataType: "bit",
            bit: 7,
            resource: "booleanObtained",
          },
          {
            id: "commonCardQuantity",
            name: "Quantity",
            offset: 0x1460 + index,
            type: "variable",
            dataType: "uint8",
            binary: {
              bitStart: 0,
              bitLength: 7,
            },
            max: 100,
          },
        ],
      };
    });
  } else {
    const base = (level - 7) * 11;

    return uniqueCards.slice(base, base + 11).map((card, index) => {
      index += base;

      return {
        type: "section",
        flex: true,
        noMargin: true,
        items: [
          {
            id: `uniqueCardObtained-${index}`,
            name: card.name,
            offset: 0x14ce + bitToOffset(index),
            type: "variable",
            dataType: "bit",
            bit: index % 8,
            resource: "booleanObtained",
          },
          {
            id: `uniqueCardQuantity-${index}`,
            name: "Quantity",
            offset: 0x14ad + index,
            type: "variable",
            dataType: "uint8",
            max: 1,
          },
        ],
      };
    });
  }
}
