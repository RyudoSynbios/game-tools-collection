import type { ItemInt, ItemSection } from "$lib/types";

import type { Level } from "./resource";

export function levelFragment(level: Level): ItemSection {
  const offset = 0xd4 + level.index;
  const dkCoinIndex = level.index - 0x25;

  const labels = Array(8)
    .fill({})
    .map(() => ({
      name: "???",
      disabled: false,
      separator: false,
      hidden: true,
    }));

  labels[0].name = "Accessible";
  labels[1].name = "Cleared";
  labels[6].name = "Kiddy Cleared";

  if (level.type !== "hidden") {
    labels[2].name = "Bonus Coin 1";
    labels[3].name = "Bonus Coin 2";
    labels[4].name = "Bonus Coin 3";
    labels[5].name = "DK Coin";
  }

  for (let i = 0; i < (level.bonusCoins || 0); i += 1) {
    labels[2 + i].hidden = false;
    labels[2 + i].separator = i + 1 === level.bonusCoins;
  }

  if (level.dkCoin) {
    labels[5].hidden = false;
  }

  if (level.type === "boss") {
    labels[2].name = "Bonus Coin";
    labels[2].disabled = true;
    labels[2].separator = false;
    labels[5].disabled = true;
  }

  return {
    type: "section",
    hidden: !["boss", "level"].includes(level.type),
    items: [
      {
        id: `progression-cleared-%parent%-%index%-${level.index}`,
        name: level.name,
        offset,
        type: "variable",
        dataType: "uint8",
        resource: "levelProgressions",
        hidden: !["boss", "level"].includes(level.type),
      },
      {
        id: `progression-flags-%parent%-%index%-${level.type}-${level.index}`,
        type: "bitflags",
        hidden: labels.every((label) => label.hidden),
        flags: [...Array(8).keys()].map((index) => ({
          offset,
          bit: index,
          label: labels[index].name,
          separator: labels[index].separator,
          disabled: labels[index].disabled,
          hidden: labels[index].hidden,
        })),
      },
      ...(level.type === "level"
        ? [
            {
              id: `dkCoinStatus-%parent%-%index%-${level.index}`,
              name: "DK Coin Status",
              offset: 0x139 + (dkCoinIndex >> 0x2),
              type: "variable",
              dataType: "uint8",
              binary: {
                bitStart: (dkCoinIndex * 2) % 8,
                bitLength: 2,
              },
              hidden: true,
            } as ItemInt,
          ]
        : []),
    ],
  };
}
