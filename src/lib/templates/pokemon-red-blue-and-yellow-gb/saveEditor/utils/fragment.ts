import type { ItemGroup, ItemInt, ItemSection, ItemTabs } from "$lib/types";

export function pokemonStatsFragment(
  type: string,
  nameOffset: number,
  statsOffset: number,
  trainerNameOffset: number,
  pokemonTableOffset = 0x0,
  depositedOffset = 0x0,
): ItemTabs {
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
              ...(type === "daycare"
                ? [
                    {
                      id: "pokemonDeposited",
                      name: "Pokémon Deposited",
                      offset: depositedOffset,
                      type: "variable",
                      dataType: "uint8",
                      hidden: true,
                    } as ItemInt,
                  ]
                : []),
              {
                id: `name-pokemonName-${type}-%index%`,
                name: "Name",
                offset: nameOffset,
                length: 0xa,
                type: "variable",
                dataType: "string",
                letterDataType: "uint8",
                fallback: 0x7f,
                endCode: 0x50,
                resource: "letters",
                overrideShift: { parent: 1, shift: 0xb },
                test: true,
              },
              ...(type !== "daycare"
                ? [
                    {
                      id: `pokemon-${type}-%index%`,
                      name: "Pokémon",
                      offset: pokemonTableOffset,
                      type: "variable",
                      dataType: "uint8",
                      resource: "pokemons",
                      autocomplete: true,
                      overrideShift: { parent: 1, shift: 0x1 },
                    } as ItemInt,
                  ]
                : []),
              {
                id: `pokemonPreview-${type}-%index%`,
                name: "Pokémon",
                offset: statsOffset,
                type: "variable",
                dataType: "uint8",
                resource: "pokemons",
                autocomplete: true,
                hidden: type !== "daycare",
              },
              ...(type === "party"
                ? [
                    {
                      id: "pokemonUnset-33",
                      name: "Level",
                      offset: statsOffset + 0x21,
                      type: "variable",
                      dataType: "uint8",
                      min: 1,
                      max: 100,
                    } as ItemInt,
                  ]
                : []),
              {
                id: "pokemonUnset-3",
                name: "Level (Preview)",
                offset: statsOffset + 0x3,
                type: "variable",
                dataType: "uint8",
                hidden: type === "party",
              },
              {
                id: "pokemonUnset-14",
                name: "Experience",
                offset: statsOffset + 0xe,
                type: "variable",
                dataType: "uint24",
                bigEndian: true,
                max: 1250000,
              },
            ],
          },
          {
            type: "section",
            flex: true,
            items: [
              {
                id: "pokemonType-0",
                name: "Type 1",
                offset: statsOffset + 0x5,
                type: "variable",
                dataType: "uint8",
                resource: "types",
                disabled: true,
              },
              {
                id: "pokemonType-1",
                name: "Type 2",
                offset: statsOffset + 0x6,
                type: "variable",
                dataType: "uint8",
                resource: "types",
                disabled: true,
              },
              {
                id: "pokemonUnset-7",
                name: "Catch Rate",
                offset: statsOffset + 0x7,
                type: "variable",
                dataType: "uint8",
              },
            ],
          },
          {
            type: "section",
            flex: true,
            items: [
              ...(type === "party"
                ? [
                    {
                      name: "HP",
                      type: "group",
                      mode: "fraction",
                      items: [
                        {
                          id: "pokemonUnset-1",
                          offset: statsOffset + 0x1,
                          type: "variable",
                          dataType: "uint16",
                          bigEndian: true,
                          max: 999,
                        },
                        {
                          id: "pokemonUnset-34",
                          offset: statsOffset + 0x22,
                          type: "variable",
                          dataType: "uint16",
                          bigEndian: true,
                          min: 1,
                          max: 999,
                        },
                      ],
                    } as ItemGroup,
                  ]
                : [
                    {
                      id: "pokemonUnset-1",
                      name: "HP",
                      offset: statsOffset + 0x1,
                      type: "variable",
                      dataType: "uint16",
                      bigEndian: true,
                      min: 1,
                      max: 999,
                    } as ItemInt,
                  ]),
              {
                id: "pokemonUnset-17",
                name: "HP EV",
                offset: statsOffset + 0x11,
                type: "variable",
                dataType: "uint16",
                bigEndian: true,
              },
            ],
          },
          ...(type === "party"
            ? [
                {
                  type: "section",
                  flex: true,
                  noMargin: true,
                  items: [
                    {
                      id: "pokemonUnset-36",
                      name: "Attack",
                      offset: statsOffset + 0x24,
                      type: "variable",
                      dataType: "uint16",
                      bigEndian: true,
                      max: 999,
                      hint: "This stat will be reset after leveling up or if the Pokémon is put in a box.",
                    },
                    {
                      id: "pokemonUnset-38",
                      name: "Defense",
                      offset: statsOffset + 0x26,
                      type: "variable",
                      dataType: "uint16",
                      bigEndian: true,
                      max: 999,
                      hint: "This stat will be reset after leveling up or if the Pokémon is put in a box.",
                    },
                    {
                      id: "pokemonUnset-40",
                      name: "Speed",
                      offset: statsOffset + 0x28,
                      type: "variable",
                      dataType: "uint16",
                      bigEndian: true,
                      max: 999,
                      hint: "This stat will be reset after leveling up or if the Pokémon is put in a box.",
                    },
                    {
                      id: "pokemonUnset-42",
                      name: "Special",
                      offset: statsOffset + 0x2a,
                      type: "variable",
                      dataType: "uint16",
                      bigEndian: true,
                      max: 999,
                      hint: "This stat will be reset after leveling up or if the Pokémon is put in a box.",
                    },
                  ],
                } as ItemSection,
              ]
            : []),
          {
            type: "section",
            flex: true,
            noMargin: true,
            items: [
              {
                id: "pokemonUnset-19",
                name: "Attack EV",
                offset: statsOffset + 0x13,
                type: "variable",
                dataType: "uint16",
                bigEndian: true,
                hint: "This stat can be increased with vitamins.",
              },
              {
                id: "pokemonUnset-21",
                name: "Defense EV",
                offset: statsOffset + 0x15,
                type: "variable",
                dataType: "uint16",
                bigEndian: true,
                hint: "This stat can be increased with vitamins.",
              },
              {
                id: "pokemonUnset-23",
                name: "Speed EV",
                offset: statsOffset + 0x17,
                type: "variable",
                dataType: "uint16",
                bigEndian: true,
                hint: "This stat can be increased with vitamins.",
              },
              {
                id: "pokemonUnset-25",
                name: "Special EV",
                offset: statsOffset + 0x19,
                type: "variable",
                dataType: "uint16",
                bigEndian: true,
                hint: "This stat can be increased with vitamins.",
              },
            ],
          },
          {
            type: "section",
            flex: true,
            items: [
              {
                id: "pokemonUnset-27",
                name: "Attack IV",
                offset: statsOffset + 0x1b,
                type: "variable",
                dataType: "upper4",
                hint: "This stat is generated when the Pokémon is obtained.",
              },
              {
                id: "pokemonUnset-27",
                name: "Defense IV",
                offset: statsOffset + 0x1b,
                type: "variable",
                dataType: "lower4",
                hint: "This stat is generated when the Pokémon is obtained.",
              },
              {
                id: "pokemonUnset-28",
                name: "Speed IV",
                offset: statsOffset + 0x1c,
                type: "variable",
                dataType: "upper4",
                hint: "This stat is generated when the Pokémon is obtained.",
              },
              {
                id: "pokemonUnset-28",
                name: "Special IV",
                offset: statsOffset + 0x1c,
                type: "variable",
                dataType: "lower4",
                hint: "This stat is generated when the Pokémon is obtained.",
              },
            ],
          },
          {
            type: "section",
            flex: true,
            items: [
              {
                id: "pokemonUnset-4",
                name: "Asleep Turns",
                offset: statsOffset + 0x4,
                type: "variable",
                dataType: "uint8",
                binary: { bitStart: 0, bitLength: 3 },
              },
              {
                id: "pokemonUnset-4",
                name: "Condition",
                type: "bitflags",
                flags: [
                  { offset: statsOffset + 0x4, bit: 3, label: "Poisoned" },
                  { offset: statsOffset + 0x4, bit: 4, label: "Burned" },
                  { offset: statsOffset + 0x4, bit: 5, label: "Frozen" },
                  { offset: statsOffset + 0x4, bit: 6, label: "Paralyzed" },
                ],
              },
            ],
          },
        ],
      },
      {
        name: "Moves",
        items: [
          {
            length: 0x1,
            type: "container",
            instanceType: "section",
            instances: 4,
            flex: true,
            items: [
              {
                id: "move-pokemonUnset-8-%index%",
                name: "Move %d",
                offset: statsOffset + 0x8,
                type: "variable",
                dataType: "uint8",
                resource: "moves",
                autocomplete: true,
              },
              {
                name: "PP",
                type: "group",
                mode: "fraction",
                items: [
                  {
                    id: "movePP-pokemonUnset-29-%index%",
                    offset: statsOffset + 0x1d,
                    type: "variable",
                    dataType: "uint8",
                    binary: { bitStart: 0, bitLength: 6 },
                    max: 63,
                  },
                  {
                    id: "moveMaxPP-pokemonUnset-29-%index%",
                    offset: statsOffset + 0x1d,
                    type: "variable",
                    dataType: "uint8",
                    binary: { bitStart: 6, bitLength: 2 },
                  },
                ],
              },
            ],
          },
        ],
      },
      {
        name: "Original Trainer",
        flex: true,
        items: [
          {
            id: `name-originalTrainer-${type}-%index%`,
            name: "Name",
            offset: trainerNameOffset,
            length: 0x7,
            type: "variable",
            dataType: "string",
            letterDataType: "uint8",
            fallback: 0x7f,
            endCode: 0x50,
            resource: "letters",
            overrideShift: { parent: 1, shift: 0xb },
          },
          {
            id: "pokemonUnset-12",
            name: "No ID",
            offset: statsOffset + 0xc,
            type: "variable",
            dataType: "uint16",
            bigEndian: true,
          },
        ],
      },
    ],
  };
}
