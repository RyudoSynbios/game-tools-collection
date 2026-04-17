import { Item, ItemSection } from "$lib/types";

export function familiarFragment(type: string, offset: number): ItemSection {
  const status: Item[] = [
    {
      type: "section",
      flex: true,
      items: [
        {
          name: "Stable Index",
          offset: offset + 0x1e,
          type: "variable",
          dataType: "uint8",
          hidden: true,
        },
        {
          name: "Status",
          offset: offset,
          type: "variable",
          dataType: "uint8",
          resource: "status",
          hidden: type !== "stable",
          disabled: true,
        },
        {
          name: "Letters",
          offset: offset + 0x1,
          type: "variable",
          dataType: "uint8",
          hidden: true,
        },
        {
          id: `name-${type}-%parent%-%index%`,
          name: "Name",
          offset: offset + 0x2,
          length: 0x8,
          type: "variable",
          dataType: "string",
          letterDataType: "uint8",
          endCode: 0x0,
          regex: "[0-9A-Za-z]",
          test: type === "kou",
        },
        {
          name: "Species",
          offset: offset + 0xa,
          type: "variable",
          dataType: "uint8",
          resource: "species",
          autocomplete: true,
          hidden: type === "kou",
        },
      ],
    },
    {
      type: "section",
      flex: true,
      items: [
        {
          name: "Level",
          offset: offset + 0xb,
          type: "variable",
          dataType: "uint8",
          max: 99,
        },
        {
          name: "Experience",
          offset: offset + 0x10,
          type: "variable",
          dataType: "uint16",
          max: 9999,
        },
      ],
    },
    {
      type: "section",
      flex: true,
      items: [
        {
          name: "Class",
          offset: offset + 0x13,
          type: "variable",
          dataType: "uint8",
          binary: {
            bitStart: 0,
            bitLength: 4,
          },
          resource: "classes",
        },
        {
          name: "Fire Affinity",
          offset: offset + 0x13,
          type: "variable",
          dataType: "uint8",
          binary: {
            bitStart: 4,
            bitLength: 4,
          },
        },
        {
          name: "Water Affinity",
          offset: offset + 0x14,
          type: "variable",
          dataType: "uint8",
          binary: {
            bitStart: 0,
            bitLength: 4,
          },
        },
        {
          name: "Wind Affinity",
          offset: offset + 0x14,
          type: "variable",
          dataType: "uint8",
          binary: {
            bitStart: 4,
            bitLength: 4,
          },
        },
      ],
    },
    {
      type: "section",
      flex: true,
      items: [
        {
          name: "HP",
          type: "group",
          mode: "fraction",
          items: [
            {
              offset: offset + 0x35,
              type: "variable",
              dataType: "uint16",
              max: 999,
            },
            {
              offset: offset + 0xd,
              type: "variable",
              dataType: "uint16",
              max: 999,
            },
          ],
        },
        {
          name: "MP",
          type: "group",
          mode: "fraction",
          items: [
            {
              offset: offset + 0x37,
              type: "variable",
              dataType: "uint8",
            },
            {
              offset: offset + 0xf,
              type: "variable",
              dataType: "uint8",
            },
          ],
        },
        {
          name: "Attack",
          offset: offset + 0x15,
          type: "variable",
          dataType: "uint8",
        },
        {
          name: "Defense",
          offset: offset + 0x16,
          type: "variable",
          dataType: "uint8",
        },
      ],
    },
  ];

  if (type === "kou") {
    return {
      type: "section",
      items: [
        {
          type: "message",
          message: "Stats are reset every time you enter the tower.",
        },
        ...status,
      ],
    };
  }

  return {
    type: "section",
    items: [
      {
        type: "tabs",
        items: [
          {
            name: "Status",
            items: [
              ...status,
              {
                type: "section",
                flex: true,
                hidden: type === "kou",
                items: [
                  {
                    name: "Special Power 1",
                    offset: offset + 0x19,
                    type: "variable",
                    dataType: "uint8",
                    resource: "specialPowers",
                  },
                  {
                    name: "Special Power 2",
                    offset: offset + 0x1a,
                    type: "variable",
                    dataType: "uint8",
                    resource: "specialPowers",
                  },
                  {
                    name: "Special Power 3",
                    offset: offset + 0x1b,
                    type: "variable",
                    dataType: "uint8",
                    resource: "specialPowers",
                  },
                  {
                    name: "Special Power 4",
                    offset: offset + 0x1c,
                    type: "variable",
                    dataType: "uint8",
                    resource: "specialPowers",
                  },
                ],
              },
              {
                type: "section",
                flex: true,
                items: [
                  {
                    name: "AI",
                    offset: offset + 0x1d,
                    type: "variable",
                    dataType: "uint8",
                    resource: "ais",
                  },
                  {
                    name: "Fusions",
                    offset: offset + 0x33,
                    type: "variable",
                    dataType: "uint8",
                    hidden: type === "kou",
                  },
                ],
              },
            ],
          },
          {
            name: "Past Data",
            items: [
              {
                name: "1st Master",
                type: "section",
                flex: true,
                items: [
                  {
                    name: "Letters",
                    offset: offset + 0x1f,
                    type: "variable",
                    dataType: "uint8",
                    hidden: true,
                  },
                  {
                    id: "name",
                    name: "Name",
                    offset: offset + 0x20,
                    length: 0x8,
                    type: "variable",
                    dataType: "string",
                    letterDataType: "uint8",
                    endCode: 0x0,
                    regex: "[0-9A-Za-z]",
                  },
                  {
                    name: "ID No.",
                    offset: offset + 0x28,
                    type: "variable",
                    dataType: "uint8" /*max:0*/,
                  },
                ],
              },
              {
                name: "Previous Master",
                type: "section",
                flex: true,
                items: [
                  {
                    name: "Letters",
                    offset: offset + 0x29,
                    type: "variable",
                    dataType: "uint8",
                    hidden: true,
                  },
                  {
                    id: "name",
                    name: "Name",
                    offset: offset + 0x2a,
                    length: 0x8,
                    type: "variable",
                    dataType: "string",
                    letterDataType: "uint8",
                    endCode: 0x0,
                    regex: "[0-9A-Za-z]",
                  },
                  {
                    name: "ID No.",
                    offset: offset + 0x32,
                    type: "variable",
                    dataType: "uint8" /*max:0*/,
                  },
                ],
              },
            ],
          },
        ],
      },
    ],
  };
}

export function itemFragment(type: string, offset: number): ItemSection {
  return {
    type: "section",
    flex: true,
    noMargin: true,
    items: [
      {
        id: `item-${type}-%index%`,
        name: "Item %d",
        offset,
        type: "variable",
        dataType: "uint16",
        resource: "items",
        autocomplete: true,
      },
      {
        id: "itemSpecies",
        name: "Species",
        offset: offset + 0x1,
        type: "variable",
        dataType: "uint8",
        resource: "species",
        autocomplete: true,
        hidden: true,
      },
      {
        id: "itemValue",
        name: "Value",
        offset: offset + 0x2,
        type: "variable",
        dataType: "uint8",
        hidden: true,
      },
      {
        name: "Flags",
        offset: offset + 0x3,
        type: "variable",
        dataType: "uint8",
        hidden: true,
      },
      {
        name: "Identified",
        offset: offset + 0x3,
        type: "variable",
        dataType: "bit",
        bit: 4,
        hidden: true,
      },
      {
        id: "itemEquipment",
        name: "Cursed",
        offset: offset + 0x3,
        type: "variable",
        dataType: "bit",
        bit: 6,
        resource: "optionBoolean",
        hidden: true,
      },
      {
        id: "itemEquipment",
        name: "Equipped",
        offset: offset + 0x3,
        type: "variable",
        dataType: "bit",
        bit: 7,
        resource: "optionBoolean",
        hidden: true,
      },
    ],
  };
}
