<script lang="ts">
  import Tabs from "$lib/components/Items/Tabs.svelte";
  import { dataViewAlt, gameJson } from "$lib/stores";
  import { getInt } from "$lib/utils/bytes";

  import type { ItemTabs } from "$lib/types";

  import { getFileOffset, getScenario } from "../utils";

  let item: ItemTabs;

  function getItemShift(shopIndex: number): number {
    const scenario = getScenario();

    let shift = 0x4;

    if (
      (scenario !== "3" && scenario !== "premium" && shopIndex === 2) ||
      shopIndex === 3
    ) {
      shift = 0x8;
    }

    return shift;
  }

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

    const debug: { offset: number; count: number }[] = [];
    const weaponShops: { offset: number; count: number }[] = [];
    const itemShops: { offset: number; count: number }[] = [];
    const deals: { offset: number; count: number }[] = [];
    const haggles: { offset: number; count: number }[] = [];

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

        let count = 0;

        if ((scenario === "3" || scenario === "premium") && index === 1) {
          shopOffset += 0x4;
        }

        const shift = getItemShift(index + 0x1);

        while (true) {
          const itemOffset = shopOffset + count * shift;

          const itemIndex = getInt(
            itemOffset,
            "uint32",
            { bigEndian: true },
            dataView,
          );

          if (itemIndex === 0x0) {
            break;
          }

          count += 1;
        }

        if (shopOffset === initialShopOffset && debug.length === 0) {
          debug.push({ offset: shopOffset, count });
        } else if (shopOffset !== initialShopOffset) {
          if (index === 0 && isWeaponShops) {
            weaponShops.push({ offset: shopOffset, count });
          } else if (index === 0) {
            itemShops.push({ offset: shopOffset, count });
          } else if (index === 1) {
            deals.push({ offset: shopOffset, count });
          } else if (index === 2) {
            haggles.push({ offset: shopOffset, count });
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
            items: [...Array(tab.array.length).keys()].map((shopIndex) => ({
              name: `${tab.name} ${tabIndex < 2 ? "Shop" : ""} ${
                shopIndex + 0x1
              }`,
              flex: true,
              items: [...Array(tab.array[shopIndex].count).keys()].map(
                (index) => ({
                  name: `Item ${index + 1}`,
                  dataViewAltKey: "x023",
                  offset:
                    tab.array[shopIndex].offset +
                    index * getItemShift(tabIndex),
                  type: "variable",
                  dataType: "uint32",
                  bigEndian: true,
                  resource: "itemNames",
                  autocomplete: true,
                }),
              ),
            })),
          },
        ],
      })),
    };
  }
</script>

<Tabs {item} />

<style lang="postcss">
</style>
