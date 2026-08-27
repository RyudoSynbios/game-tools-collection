import { ItemInt, ItemSection, ItemTabs } from "$lib/types";

export function characterFragment(
  type: "compendium" | "party",
  offset: number,
): ItemTabs {
  let stats1Offset = offset + 0x6;
  let stats2Offset = offset + 0x14;
  let skillsOffset = offset + 0x38;

  if (type === "compendium") {
    offset -= 0x4;
    stats1Offset = offset + 0x2;
    stats2Offset = offset + 0x10;
    skillsOffset = offset + 0x1e;
  }

  return {
    type: "tabs",
    items: [
      {
        id: "statusSection",
        name: "Status",
        items: [
          {
            type: "section",
            flex: true,
            items: [
              {
                id: `demon-${type}-%parent%-%index%`,
                name: "Demon",
                offset: offset + 0x4,
                type: "variable",
                dataType: "uint16",
                resource: "demons",
                autocomplete: true,
              },
              {
                id: `demonStats-level-${type}-%parent%-%index%`,
                name: "Level",
                offset: stats2Offset,
                type: "variable",
                dataType: "uint16",
                min: 1,
                max: 255,
              },
              {
                id: "demonStats",
                name: "Experience",
                offset: stats1Offset + 0xa,
                type: "variable",
                dataType: "uint32",
              },
              ...(type === "party"
                ? [
                    {
                      name: "Summoned",
                      offset: offset,
                      type: "variable",
                      dataType: "uint8",
                      hidden: true,
                    } as ItemInt,
                  ]
                : []),
            ],
          },
          ...(type === "party"
            ? [
                {
                  type: "section",
                  flex: true,
                  items: [
                    {
                      name: "HP",
                      type: "group",
                      mode: "fraction",
                      linked: true,
                      items: [
                        {
                          id: "current-demonStats",
                          offset: stats1Offset,
                          type: "variable",
                          dataType: "uint16",
                        },
                        {
                          id: "demonStats",
                          offset: stats1Offset + 0x2,
                          type: "variable",
                          dataType: "uint16",
                          min: 1,
                          max: 999,
                        },
                      ],
                    },
                    {
                      name: "MP",
                      type: "group",
                      mode: "fraction",
                      linked: true,
                      items: [
                        {
                          id: "current-demonStats",
                          offset: stats1Offset + 0x4,
                          type: "variable",
                          dataType: "uint16",
                        },
                        {
                          id: "demonStats",
                          offset: stats1Offset + 0x6,
                          type: "variable",
                          dataType: "uint16",
                          min: 1,
                          max: 999,
                        },
                      ],
                    },
                  ],
                } as ItemSection,
              ]
            : [
                {
                  type: "section",
                  flex: true,
                  items: [
                    {
                      id: "demonStats",
                      name: "Max HP",
                      offset: 0x11e94,
                      type: "variable",
                      dataType: "uint16",
                      min: 1,
                      max: 999,
                    },
                    {
                      id: "demonStats",
                      name: "Max MP",
                      offset: 0x11e96,
                      type: "variable",
                      dataType: "uint16",
                      min: 1,
                      max: 999,
                    },
                  ],
                } as ItemSection,
              ]),
          {
            type: "section",
            flex: true,
            items: [
              {
                id: "demonStats",
                name: "Strength",
                offset: stats2Offset + 0x2,
                type: "variable",
                dataType: "uint8",
                max: 99,
              },
              {
                id: "demonStats",
                name: "Magic",
                offset: stats2Offset + 0x4,
                type: "variable",
                dataType: "uint8",
                max: 99,
              },
              {
                id: "demonStats",
                name: "Vitality",
                offset: stats2Offset + 0x5,
                type: "variable",
                dataType: "uint8",
                max: 99,
              },
              {
                id: "demonStats",
                name: "Agility",
                offset: stats2Offset + 0x6,
                type: "variable",
                dataType: "uint8",
                max: 99,
              },
              {
                id: "demonStats",
                name: "Luck",
                offset: stats2Offset + 0x7,
                type: "variable",
                dataType: "uint8",
                max: 99,
              },
            ],
          },
        ],
      },
      {
        name: "Skills",
        items: [
          {
            type: "section",
            items: [
              {
                id: "demonStats",
                name: "Slots",
                offset: skillsOffset,
                type: "variable",
                dataType: "uint16",
                max: 8,
              },
            ],
          },
          {
            type: "section",
            flex: true,
            items: [
              {
                id: "skill-0",
                name: "Skill 1",
                offset: skillsOffset + 0x2,
                type: "variable",
                dataType: "uint16",
                resource: "skills",
                autocomplete: true,
              },
              {
                id: "skill-1",
                name: "Skill 2",
                offset: skillsOffset + 0x4,
                type: "variable",
                dataType: "uint16",
                resource: "skills",
                autocomplete: true,
              },
              {
                id: "skill-2",
                name: "Skill 3",
                offset: skillsOffset + 0x6,
                type: "variable",
                dataType: "uint16",
                resource: "skills",
                autocomplete: true,
              },
              {
                id: "skill-3",
                name: "Skill 4",
                offset: skillsOffset + 0x8,
                type: "variable",
                dataType: "uint16",
                resource: "skills",
                autocomplete: true,
              },
              {
                id: "skill-4",
                name: "Skill 5",
                offset: skillsOffset + 0xa,
                type: "variable",
                dataType: "uint16",
                resource: "skills",
                autocomplete: true,
              },
              {
                id: "skill-5",
                name: "Skill 6",
                offset: skillsOffset + 0xc,
                type: "variable",
                dataType: "uint16",
                resource: "skills",
                autocomplete: true,
              },
              {
                id: "skill-6",
                name: "Skill 7",
                offset: skillsOffset + 0xe,
                type: "variable",
                dataType: "uint16",
                resource: "skills",
                autocomplete: true,
              },
              {
                id: "skill-7",
                name: "Skill 8",
                offset: skillsOffset + 0x10,
                type: "variable",
                dataType: "uint16",
                resource: "skills",
                autocomplete: true,
              },
            ],
          },
        ],
      },
    ],
  };
}
