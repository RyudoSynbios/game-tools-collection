<script lang="ts">
  import Tabs from "$lib/components/Items/Tabs.svelte";
  import { bitToOffset, getInt } from "$lib/utils/bytes";
  import { getItem } from "$lib/utils/parser";

  import type { ItemBitflag, ItemString, ItemTab, ItemTabs } from "$lib/types";

  import { abilities, abilitySets, jobList } from "../utils/jobs";

  export let slotIndex: number;
  export let unitIndex: number;

  let item: ItemTabs;

  const abilityTypes = ["Action", "Reaction", "Support", "Move"];

  $: {
    const itemString = getItem(
      `slot-${slotIndex}-unitName-${unitIndex}`,
    ) as ItemString;

    const unitType = getInt(itemString.offset - 0xbe, "uint8");
    const job = getInt(itemString.offset - 0xbc, "uint8");

    const offset = itemString.offset - 0x50;

    let jobs = [0x0];

    if (unitType === 0x82 && job >= 0x90) {
      jobs = [job];
    } else if (![0x0, 0x82].includes(unitType)) {
      jobs = [...Array(20).keys()].map((index) => 0x4a + index);

      if (unitType < 0x80) {
        jobs[0] = unitType;
      }
    }

    item = {
      id: "abilities",
      type: "tabs",
      vertical: true,
      items: jobs.map((jobIndex, index) => {
        const job = jobList.find((job) => job.index === jobIndex);

        if (!job) {
          return {
            name: "???",
            disabled: true,
            items: [],
          };
        }

        const unitAbilities: {
          index: number;
          name: string;
        }[][] = [[], [], [], []];

        abilitySets[job.abilitySet].forEach((abilityIndex) => {
          const ability = abilities.find(
            (ability) => ability.index === abilityIndex,
          );

          if (!ability) {
            return;
          }

          unitAbilities[ability.type].push({
            index: abilityIndex,
            name: ability.name,
          });
        });

        return {
          name: job.name.replace(/ \((.*?)\)/, ""),
          items: [
            {
              type: "section",
              flex: true,
              noMargin: true,
              items: [
                {
                  name: "Total Job Points",
                  offset: offset + 0x28 + index * 0x2,
                  type: "variable",
                  dataType: "uint16",
                  max: 9999,
                },
                {
                  name: "Job Points",
                  offset: offset + index * 0x2,
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
                ...(unitAbilities[0].length > 0
                  ? [
                      {
                        name: `${abilityTypes[0]} Abilities`,
                        type: "bitflags",
                        flags: unitAbilities[0].map((ability, abilityIndex) => {
                          const offset = itemString.offset - 0x93 + index * 0x3;

                          let flag: ItemBitflag = {
                            offset: offset + bitToOffset(abilityIndex),
                            bit: 7 - (abilityIndex % 8),
                            label: ability.name,
                          };

                          if (unitType === 0x82) {
                            flag.offset = itemString.offset - 0xbe;
                            flag.bit = 1;
                            flag.disabled = true;
                          }

                          return flag;
                        }),
                      },
                    ]
                  : []),
                {
                  type: "section",
                  items: [
                    ...unitAbilities.slice(1).map((type, typeIndex) => {
                      if (type.length === 0) {
                        return [];
                      }

                      let abilityIndex = 0;

                      for (let i = 0; i < typeIndex; i += 1) {
                        abilityIndex += unitAbilities[i + 1].length;
                      }

                      return {
                        name: `${abilityTypes[typeIndex + 1]} Abilities`,
                        type: "bitflags",
                        flags: unitAbilities[typeIndex + 1].map((ability) => {
                          const offset = itemString.offset - 0x91 + index * 0x3;

                          const flag = {
                            offset: offset + bitToOffset(abilityIndex),
                            bit: 7 - (abilityIndex % 8),
                            label: ability.name,
                          };

                          abilityIndex += 1;

                          return flag;
                        }),
                      };
                    }),
                  ],
                },
              ],
            },
          ],
        } as ItemTab;
      }),
    };
  }
</script>

<div class="gtc-abilities">
  <Tabs {item} />
</div>
