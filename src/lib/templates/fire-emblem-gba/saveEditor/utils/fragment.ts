import type { ItemTabs } from "$lib/types";

export function characterFragment(type: string, offset: number): ItemTabs {
  return {
    type: "tabs",
    items: [
      {
        name: "Status",
        items: [
          {
            type: "section",
            flex: true,
            items: [
              {
                id: `slot-%parent%-${type}-character-%index%`,
                name: "Character",
                offset: offset + 0x14,
                type: "variable",
                dataType: "uint8",
                resource: "characters",
                autocomplete: true,
              },
              {
                name: "Class",
                offset: offset,
                type: "variable",
                dataType: "uint8",
                binary: {
                  bitStart: 0,
                  bitLength: 7,
                },
                resource: "classes",
                autocomplete: true,
              },
              {
                id: "level",
                name: "Level",
                offset: offset,
                type: "variable",
                dataType: "uint16",
                binary: {
                  bitStart: 7,
                  bitLength: 5,
                },
                min: 1,
                max: 20,
              },
              {
                id: "experience",
                name: "Experience",
                offset: offset + 0x1,
                type: "variable",
                dataType: "uint16",
                binary: {
                  bitStart: 4,
                  bitLength: 7,
                },
                max: 99,
              },
              {
                name: "Status",
                offset: offset + 0x4,
                type: "variable",
                dataType: "bit",
                bit: 4,
                resource: "status",
              },
            ],
          },
          {
            type: "section",
            flex: true,
            items: [
              {
                name: "Max HP",
                offset: offset + 0x5,
                type: "variable",
                dataType: "uint16",
                binary: {
                  bitStart: 4,
                  bitLength: 6,
                },
              },
              {
                name: "Strength / Magic",
                offset: offset + 0x6,
                type: "variable",
                dataType: "uint8",
                binary: {
                  bitStart: 2,
                  bitLength: 5,
                },
              },
              {
                name: "Skill",
                offset: offset + 0x6,
                type: "variable",
                dataType: "uint16",
                binary: {
                  bitStart: 7,
                  bitLength: 5,
                },
              },
              {
                name: "Speed",
                offset: offset + 0x7,
                type: "variable",
                dataType: "uint16",
                binary: {
                  bitStart: 4,
                  bitLength: 5,
                },
              },
              {
                name: "Luck",
                offset: offset + 0x9,
                type: "variable",
                dataType: "uint8",
                binary: {
                  bitStart: 3,
                  bitLength: 5,
                },
              },
              {
                name: "Defense",
                offset: offset + 0x8,
                type: "variable",
                dataType: "uint8",
                binary: {
                  bitStart: 1,
                  bitLength: 5,
                },
              },
              {
                name: "Resistance",
                offset: offset + 0x8,
                type: "variable",
                dataType: "uint16",
                binary: {
                  bitStart: 6,
                  bitLength: 5,
                },
              },
            ],
          },
          {
            type: "section",
            flex: true,
            items: [
              {
                name: "Bonus Constitution",
                offset: offset + 0xa,
                type: "variable",
                dataType: "uint8",
                binary: {
                  bitStart: 0,
                  bitLength: 5,
                },
              },
              {
                name: "Bonus Move",
                offset: offset + 0xa,
                type: "variable",
                dataType: "uint8",
                binary: {
                  bitStart: 5,
                  bitLength: 3,
                },
              },
            ],
          },
          {
            type: "section",
            flex: true,
            hidden: true,
            items: [
              {
                name: "???",
                offset: offset + 0x2,
                type: "variable",
                dataType: "uint8",
                binary: {
                  bitStart: 3,
                  bitLength: 5,
                },
                hidden: true,
              },
              {
                name: "???",
                offset: offset + 0x3,
                type: "variable",
                dataType: "uint8",
                hidden: true,
              },
              {
                name: "???",
                offset: offset + 0x4,
                type: "variable",
                dataType: "uint8",
                hidden: true,
              },
              {
                name: "Animation",
                offset: offset + 0x4,
                type: "variable",
                dataType: "uint8",
                binary: {
                  bitStart: 1,
                  bitLength: 2,
                },
                hidden: true,
              },
              {
                name: "???",
                offset: offset + 0x5,
                type: "variable",
                dataType: "uint8",
                binary: {
                  bitStart: 0,
                  bitLength: 4,
                },
                hidden: true,
              },
              {
                name: "???",
                offset: offset + 0xa,
                type: "variable",
                dataType: "uint8",
                hidden: true,
              },
              {
                name: "???",
                offset: offset + 0x19,
                type: "variable",
                dataType: "uint8",
                hidden: true,
              },
              {
                name: "???",
                offset: offset + 0x1a,
                type: "variable",
                dataType: "uint8",
                hidden: true,
              },
              {
                name: "???",
                offset: offset + 0x1b,
                type: "variable",
                dataType: "uint8",
                hidden: true,
              },
              {
                name: "???",
                offset: offset + 0x1c,
                type: "variable",
                dataType: "uint8",
                hidden: true,
              },
            ],
          },
        ],
      },
      {
        name: "Mastery Level",
        items: [
          {
            type: "section",
            flex: true,
            items: [
              {
                name: "Sword",
                offset: offset + 0x15,
                type: "variable",
                dataType: "uint8",
              },
              {
                name: "Spear",
                offset: offset + 0x16,
                type: "variable",
                dataType: "uint8",
              },
              {
                name: "Axe",
                offset: offset + 0x17,
                type: "variable",
                dataType: "uint8",
              },
              {
                name: "Box",
                offset: offset + 0x18,
                type: "variable",
                dataType: "uint8",
              },
              {
                name: "Staff",
                offset: offset + 0x19,
                type: "variable",
                dataType: "uint8",
              },
              {
                name: "Anima Magic",
                offset: offset + 0x1a,
                type: "variable",
                dataType: "uint8",
              },
              {
                name: "Light Magic",
                offset: offset + 0x1b,
                type: "variable",
                dataType: "uint8",
              },
              {
                name: "Dark Magic",
                offset: offset + 0x1c,
                type: "variable",
                dataType: "uint8",
              },
            ],
          },
        ],
      },
      {
        name: "Items",
        items: [...Array(5).keys()].map((index) => ({
          type: "section",
          flex: true,
          noMargin: true,
          items: [
            {
              name: `Item ${index + 1}`,
              offset: offset + 0xb + Math.floor((2 + index * 14) / 8),
              type: "variable",
              dataType: "uint16",
              binary: {
                bitStart: (2 + index * 14) % 8,
                bitLength: 8,
              },
              resource: "items",
              autocomplete: true,
            },
            {
              name: "Durability",
              offset: offset + 0xc + Math.floor((2 + index * 14) / 8),
              type: "variable",
              dataType: "uint16",
              binary: {
                bitStart: (2 + index * 14) % 8,
                bitLength: 6,
              },
            },
          ],
        })),
      },
      {
        name: "Support",
        items: [
          {
            type: "section",
            flex: true,
            items: [...Array(7).keys()].map((index) => ({
              id: `support-${index}`,
              name: `Support ${index + 1}`,
              offset: offset + 0x1d + index,
              type: "variable",
              dataType: "uint8",
            })),
          },
        ],
      },
    ],
  };
}
