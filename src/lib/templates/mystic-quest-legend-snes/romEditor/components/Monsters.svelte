<script lang="ts">
  import List from "$lib/components/Items/List.svelte";
  import { gameJson } from "$lib/stores";
  import { getRegionArray } from "$lib/utils/format";
  import {
    monsterNamesLength,
    pointerToMonsterDrops,
    pointerToMonsterNames,
    pointerToMonsterPalettes,
    pointerToMonsterSkills,
    pointerToMonsterStats,
  } from "../template";
  import { pointerToOffset } from "../utils";

  import type { ItemList } from "$lib/types";

  let monsterNames: string[];

  const namesOffset = pointerToOffset(pointerToMonsterNames);
  const namesLength = getRegionArray(monsterNamesLength);

  const dropsOffset = pointerToOffset(pointerToMonsterDrops);

  const statsOffset = pointerToOffset(pointerToMonsterStats);

  const skillsOffset = pointerToOffset(pointerToMonsterSkills);

  const palettesOffset = pointerToOffset(pointerToMonsterPalettes);

  let item: ItemList;

  $: {
    $gameJson;

    monsterNames = $gameJson.resources?.monsterNames as string[];

    item = {
      id: "monsters",
      type: "list",
      items: [...Array(81).keys()].map((index) => ({
        name: monsterNames[index],
        items: [
          {
            type: "tabs",
            items: [
              {
                name: "General",
                items: [
                  {
                    type: "section",
                    flex: true,
                    items: [
                      {
                        id: "mName",
                        name: "Name",
                        offset: namesOffset + index * namesLength,
                        length: namesLength,
                        type: "variable",
                        dataType: "string",
                        letterDataType: "uint8",
                        fallback: 0x3,
                        resource: "letters",
                      },
                      {
                        name: "Level",
                        offset: dropsOffset + index * 0x3,
                        type: "variable",
                        dataType: "uint8",
                      },
                      {
                        name: "HP",
                        offset: statsOffset + index * 0xe,
                        type: "variable",
                        dataType: "uint16",
                      },
                    ],
                  },
                  {
                    type: "section",
                    flex: true,
                    items: [
                      {
                        name: "Strength",
                        offset: statsOffset + 0x2 + index * 0xe,
                        type: "variable",
                        dataType: "uint8",
                      },
                      {
                        name: "Defense",
                        offset: statsOffset + 0x3 + index * 0xe,
                        type: "variable",
                        dataType: "uint8",
                      },
                      {
                        name: "Speed",
                        offset: statsOffset + 0x4 + index * 0xe,
                        type: "variable",
                        dataType: "uint8",
                      },
                      {
                        name: "Magic",
                        offset: statsOffset + 0x5 + index * 0xe,
                        type: "variable",
                        dataType: "uint8",
                      },
                    ],
                  },
                  {
                    type: "section",
                    flex: true,
                    items: [
                      {
                        name: "Experience",
                        offset: dropsOffset + 0x1 + index * 0x3,
                        type: "variable",
                        dataType: "uint8",
                        operations: [{ "*": 3 }],
                        step: 3,
                        max: 765,
                      },
                      {
                        name: "Money",
                        offset: dropsOffset + 0x2 + index * 0x3,
                        type: "variable",
                        dataType: "uint8",
                        operations: [{ "*": 3 }],
                        step: 3,
                        max: 765,
                      },
                    ],
                  },
                  {
                    type: "section",
                    flex: true,
                    items: [
                      {
                        name: "Resistances",
                        type: "bitflags",
                        flags: [
                          {
                            offset: statsOffset + 0x6 + index * 0xe,
                            bit: 4,
                            name: "Wind",
                          },
                          {
                            offset: statsOffset + 0x6 + index * 0xe,
                            bit: 5,
                            name: "Fire",
                          },
                          {
                            offset: statsOffset + 0x6 + index * 0xe,
                            bit: 6,
                            name: "Water",
                          },
                          {
                            offset: statsOffset + 0x6 + index * 0xe,
                            bit: 7,
                            name: "Earth",
                          },
                        ],
                      },
                      {
                        name: "Weaknesses",
                        type: "bitflags",
                        flags: [
                          {
                            offset: statsOffset + 0xc + index * 0xe,
                            bit: 0,
                            name: "Shoot",
                          },
                          {
                            offset: statsOffset + 0xc + index * 0xe,
                            bit: 1,
                            name: "Bomb",
                          },
                          {
                            offset: statsOffset + 0xc + index * 0xe,
                            bit: 2,
                            name: "Axe",
                          },
                          {
                            offset: statsOffset + 0xc + index * 0xe,
                            bit: 3,
                            name: "Zombie",
                            separator: true,
                          },
                          {
                            offset: statsOffset + 0xc + index * 0xe,
                            bit: 4,
                            name: "Wind",
                          },
                          {
                            offset: statsOffset + 0xc + index * 0xe,
                            bit: 5,
                            name: "Fire",
                          },
                          {
                            offset: statsOffset + 0xc + index * 0xe,
                            bit: 6,
                            name: "Water",
                          },
                          {
                            offset: statsOffset + 0xc + index * 0xe,
                            bit: 7,
                            name: "Earth",
                          },
                        ],
                      },
                      {
                        name: "Immunities",
                        type: "bitflags",
                        flags: [
                          {
                            offset: statsOffset + 0x7 + index * 0xe,
                            bit: 0,
                            name: "Silence",
                          },
                          {
                            offset: statsOffset + 0x7 + index * 0xe,
                            bit: 1,
                            name: "Blind",
                          },
                          {
                            offset: statsOffset + 0x7 + index * 0xe,
                            bit: 2,
                            name: "Poison",
                          },
                          {
                            offset: statsOffset + 0x7 + index * 0xe,
                            bit: 3,
                            name: "Confusion",
                          },
                          {
                            offset: statsOffset + 0x7 + index * 0xe,
                            bit: 4,
                            name: "Sleep",
                          },
                          {
                            offset: statsOffset + 0x7 + index * 0xe,
                            bit: 5,
                            name: "Paralyze",
                          },
                          {
                            offset: statsOffset + 0x7 + index * 0xe,
                            bit: 6,
                            name: "Petrify",
                          },
                          {
                            offset: statsOffset + 0x7 + index * 0xe,
                            bit: 7,
                            name: "Fatal",
                          },
                        ],
                      },
                      {
                        name: "Special",
                        type: "bitflags",
                        flags: [
                          {
                            offset: statsOffset + 0xd + index * 0xe,
                            bit: 0,
                            name: "???",
                            hidden: true,
                          },
                          {
                            offset: statsOffset + 0xd + index * 0xe,
                            bit: 1,
                            name: "???",
                            hidden: true,
                          },
                          {
                            offset: statsOffset + 0xd + index * 0xe,
                            bit: 2,
                            name: "Can repel magic attacks?",
                            hidden: true,
                          },
                          {
                            offset: statsOffset + 0xd + index * 0xe,
                            bit: 3,
                            name: "Can counter physical attacks",
                          },
                          {
                            offset: statsOffset + 0xd + index * 0xe,
                            bit: 4,
                            name: "Can counter with Confu-touch",
                          },
                          {
                            offset: statsOffset + 0xd + index * 0xe,
                            bit: 5,
                            name: "Can counter with Para-touch",
                          },
                          {
                            offset: statsOffset + 0xd + index * 0xe,
                            bit: 6,
                            name: "Can counter with Poison-touch",
                          },
                          {
                            offset: statsOffset + 0xd + index * 0xe,
                            bit: 7,
                            name: "Can counter with Petri-touch",
                          },
                        ],
                      },
                      {
                        name: "???",
                        offset: statsOffset + 0x8 + index * 0xe,
                        type: "variable",
                        dataType: "uint8",
                        hidden: true,
                      },
                      {
                        name: "???",
                        offset: statsOffset + 0x9 + index * 0xe,
                        type: "variable",
                        dataType: "uint8",
                        hidden: true,
                      },
                      {
                        name: "???",
                        offset: statsOffset + 0xa + index * 0xe,
                        type: "variable",
                        dataType: "uint8",
                        hidden: true,
                      },
                      {
                        name: "???",
                        offset: statsOffset + 0xb + index * 0xe,
                        type: "variable",
                        dataType: "uint8",
                        hidden: true,
                      },
                    ],
                  },
                ],
              },
              {
                name: "Sprite",
                flex: true,
                items: [
                  {
                    type: "component",
                    component: "MonsterCanvas",
                    props: { monsterIndex: index },
                  },
                  {
                    name: "Palette",
                    offset: palettesOffset + index * 0x5,
                    type: "variable",
                    dataType: "uint8",
                  },
                ],
              },
              {
                name: "Skills",
                hidden: true,
                items: [
                  {
                    type: "section",
                    flex: true,
                    items: [
                      {
                        name: "???",
                        offset: skillsOffset + index * 0x9,
                        type: "variable",
                        dataType: "uint8",
                      },
                      {
                        name: "Skill 1",
                        offset: skillsOffset + 0x1 + index * 0x9,
                        type: "variable",
                        dataType: "uint8",
                      },
                      {
                        name: "Skill 2",
                        offset: skillsOffset + 0x2 + index * 0x9,
                        type: "variable",
                        dataType: "uint8",
                      },
                      {
                        name: "Skill 3",
                        offset: skillsOffset + 0x3 + index * 0x9,
                        type: "variable",
                        dataType: "uint8",
                      },
                      {
                        name: "Skill 4",
                        offset: skillsOffset + 0x4 + index * 0x9,
                        type: "variable",
                        dataType: "uint8",
                      },
                      {
                        name: "Skill 5",
                        offset: skillsOffset + 0x5 + index * 0x9,
                        type: "variable",
                        dataType: "uint8",
                      },
                      {
                        name: "Skill 6",
                        offset: skillsOffset + 0x6 + index * 0x9,
                        type: "variable",
                        dataType: "uint8",
                      },
                      {
                        name: "Skill 7",
                        offset: skillsOffset + 0x7 + index * 0x9,
                        type: "variable",
                        dataType: "uint8",
                      },
                      {
                        name: "Skill 8",
                        offset: skillsOffset + 0x8 + index * 0x9,
                        type: "variable",
                        dataType: "uint8",
                      },
                    ],
                  },
                ],
              },
            ],
          },
        ],
      })),
    };
  }
</script>

<div><List {item} /></div>

<style lang="postcss">
</style>
