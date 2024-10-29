<script lang="ts">
  import Tabs from "$lib/components/Items/Tabs.svelte";
  import { dataViewAlt, gameJson } from "$lib/stores";
  import { getInt } from "$lib/utils/bytes";

  import type { Item, ItemTabs } from "$lib/types";

  import { getFileOffset, getScenario } from "../utils";

  let item: ItemTabs;

  $: {
    $gameJson;

    const scenario = getScenario();

    const dataView = $dataViewAlt.x023;

    let pointers = [];

    for (let i = 0x0; i < dataView.byteLength; i += 0x4) {
      const value = getInt(i, "uint32", { bigEndian: true }, dataView);

      if (value === 0x51eb851f) {
        let shift = 0x4;

        if ((scenario === "1" || scenario === "2") && pointers.length === 0) {
          shift = 0xc;
        } else if (
          (scenario === "3" || scenario === "premium") &&
          pointers.length !== 1
        ) {
          shift = 0x10;
        }

        pointers.push(i + shift);
      }
    }

    let shopsOffset = getFileOffset("x023", pointers[2], dataView);
    let dealsOffset = getFileOffset("x023", pointers[0], dataView);
    let hagglesOffset = getFileOffset("x023", pointers[1], dataView);

    const initialShopOffset = getFileOffset("x023", shopsOffset, dataView);

    const debug: Item[][] = [];
    const weaponShops: Item[][] = [];
    const itemShops: Item[][] = [];
    const deals: Item[][] = [];
    const haggles: Item[][] = [];

    let isWeaponShops = true;

    [shopsOffset, dealsOffset, hagglesOffset].forEach((offset, index) => {
      while (true) {
        let shopOffset = getFileOffset("x023", offset, dataView);

        if (shopOffset < 0x0) {
          break;
        }

        if (weaponShops.length > 1 && shopOffset === initialShopOffset) {
          isWeaponShops = false;
        }

        const items: Item[] = [];

        let itemOffset = shopOffset;

        while (true) {
          const hasMainFlag = (scenario === "3" || scenario === "premium") && index === 1; // prettier-ignore
          const itemIndex = getInt(itemOffset, "uint32", { bigEndian: true }, dataView); // prettier-ignore
          const itemFlag = getInt(itemOffset + 0x4, "uint32", { bigEndian: true }, dataView); // prettier-ignore

          if (
            ((index === 0 || hasMainFlag) && itemIndex === 0x0) ||
            (itemIndex === 0x0 && itemFlag === 0x0)
          ) {
            break;
          }

          const item: Item = {
            name: `Item ${items.length + (hasMainFlag ? 0 : 1)}`,
            dataViewAltKey: "x023",
            offset: itemOffset,
            type: "variable",
            dataType: "uint32",
            bigEndian: true,
            resource: "itemNames",
            autocomplete: true,
          };

          const flag: Item = {
            name: `Flag (0x${itemFlag.toHex()})`,
            dataViewAltKey: "x023",
            offset: itemOffset,
            type: "variable",
            dataType: "uint32",
            bigEndian: true,
            min: 1,
          };

          if (hasMainFlag && items.length === 0) {
            items.push({
              ...flag,
              name: `Flag (0x${itemIndex.toHex()})`,
            });
          } else {
            if (index === 0 || hasMainFlag) {
              items.push(item);
            } else {
              items.push({
                type: "section",
                flex: true,
                items: [item, { ...flag, offset: itemOffset + 0x4 }],
              });

              itemOffset += 0x4;
            }
          }

          itemOffset += 0x4;
        }

        if (shopOffset === initialShopOffset && debug.length === 0) {
          debug.push(items);
        } else if (shopOffset !== initialShopOffset) {
          if (index === 0 && isWeaponShops) {
            weaponShops.push(items);
          } else if (index === 0) {
            itemShops.push(items);
          } else if (index === 1) {
            deals.push(items);
          } else if (index === 2) {
            haggles.push(items);
          }
        }

        offset += 0x4;
      }
    });

    const tabs = [
      { name: "Weapons", array: weaponShops },
      { name: "Items", array: itemShops },
      { name: "Deals", array: deals },
      { name: "Haggles", array: haggles },
      { name: "Debug", array: debug },
    ];

    item = {
      type: "tabs",
      items: tabs.map((tab, tabIndex) => ({
        name: tab.name,
        hidden: tabIndex === 4,
        items: [
          {
            type: "tabs",
            vertical: true,
            items: [...Array(tab.array.length).keys()].map((shopIndex) => {
              let items = tab.array[shopIndex];

              if (
                (scenario === "3" || scenario === "premium") &&
                tabIndex === 2 &&
                tab.array[shopIndex].length > 0
              ) {
                items = [
                  {
                    type: "section",
                    flex: true,
                    items: [tab.array[shopIndex][0]],
                  },
                  {
                    type: "section",
                    flex: true,
                    items: tab.array[shopIndex].slice(1),
                  },
                ];
              }

              return {
                name: `${tab.name} ${tabIndex < 2 ? "Shop" : ""} ${
                  shopIndex + 0x1
                }`,
                flex: ![2, 3].includes(tabIndex) ? true : false,
                items,
              };
            }),
          },
        ],
      })),
    };
  }
</script>

<Tabs {item} />

<style lang="postcss">
</style>
