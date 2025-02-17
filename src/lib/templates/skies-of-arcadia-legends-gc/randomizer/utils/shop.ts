import { get } from "svelte/store";

import { dataViewAlt } from "$lib/stores";
import { getInt, setInt } from "$lib/utils/bytes";
import Prng from "$lib/utils/prng";

import { mainDolModels } from "../../romEditor/utils/resource";
import { Options } from "../utils";
import { Item } from "./item";

interface Shop {
  index: number;
  type: string;
  items: Item[];
}

interface ShopItem {
  index: number;
  itemIndex: number;
  type: string;
}

export function randomizeShops(
  prng: Prng,
  options: Options,
  inventory: Item[],
): void {
  const $dataViewAlt = get(dataViewAlt);

  if (options.shops.items === 0x0 && options.shops.count === 0x0) {
    return;
  }

  const shops: Shop[] = [];
  const shopsItems: ShopItem[] = [];

  for (let i = 0x0; i < mainDolModels.shops.count; i += 0x1) {
    const offset = i * mainDolModels.shops.length;

    const items: Item[] = [];

    let hasAccessory = false;
    let hasItem = false;
    let hasShipAccessory = false;

    for (let j = 0x0; j < 0x30; j += 0x1) {
      const itemIndex = getInt(offset + 0x8 + j * 0x2, "uint16", { bigEndian: true }, $dataViewAlt.shops); // prettier-ignore

      if (itemIndex !== 0xffff) {
        const item = inventory.find((item) => item.index === itemIndex);

        if (item) {
          switch (item.type) {
            case "accessory":
              hasAccessory = true;
              break;
            case "item":
              hasItem = true;
              break;
            case "shipAccessory":
              hasShipAccessory = true;
              break;
          }

          items.push(item);
          shopsItems.push({
            index: (i << 0x8) | j,
            itemIndex: item.index,
            type: item.type,
          });
        }
      } else {
        break;
      }
    }

    let type = "";

    if ((hasAccessory || hasShipAccessory) && hasItem) {
      type = "all";
    } else if (hasAccessory) {
      type = "weapons";
    } else if (hasShipAccessory) {
      type = "shipParts";
    } else if (hasItem) {
      type = "items";
    }

    shops[i] = { index: i, type, items };
  }

  const excludedShops: number[] = [];
  const excludedItems: number[] = [];

  // prettier-ignore
  for (let i = 0x0; i < mainDolModels.shops.count; i += 0x1) {
    const offset = i * mainDolModels.shops.length;

    const shop = shops[i];

    // Number of Items Sold

    let count = 0;

    if (options.shops.count === 0x0) {
      count = shop.items.length;
    } else if (options.shops.count === 0x1) {
      const filteredShops = shops.filter(
        (shopTmp) =>
          !excludedShops.includes(shopTmp.index) && shopTmp.type === shop.type,
      );

      const value = prng.getInt(0, filteredShops.length - 1, `shops_count_1_${i}`);

      count = filteredShops[value].items.length;

      excludedShops.push(filteredShops[value].index);
    } else if (options.shops.count === 0x2) {
      const value = prng.getInt(-3, 3, `shops_item_count_2_${i}`);

      count = Math.max(1, count + value);
    } else if (options.shops.count === 0x3) {
      count = prng.getInt(1, 48, `shops_item_count_3_${i}`);
    }

    // Items

    const items: number[] = [];

    const allowedTypes: string[] = [];

    if (["all", "weapons"].includes(shop.type)) {
      allowedTypes.push("weapon", "armor", "accessory");
    }

    if (["all", "shipParts"].includes(shop.type)) {
      allowedTypes.push("shipWeapon", "shipAccessory", "shipItem");
    }

    if (["all", "items"].includes(shop.type)) {
      allowedTypes.push("item");
    }

    for (let j = 0x0; j < 0x30; j += 0x1) {
      if (j === count) {
        items.push(...new Array(0x30 - j).fill(0xffff));
        break;
      }

      if (options.shops.items === 0x1 || options.shops.items === 0x2) {
        const filteredItems = shopsItems.filter(
          (item) =>
            !excludedItems.includes(item.index) &&
            ((options.shops.items === 0x1 &&
              item.type === shop.items[j].type) ||
              options.shops.items === 0x2),
        );

        const value = prng.getInt(0, filteredItems.length - 1, `shops_item_${options.shops.items}_${j}_${i}`);

        items.push(filteredItems[value].itemIndex);
        excludedItems.push(filteredItems[value].index);
      } else if (options.shops.items === 0x3 || options.shops.items === 0x4) {
        const filteredItems = inventory.filter(
          (item) =>
            (options.shops.items === 0x3 && allowedTypes.includes(item.type)) ||
            options.shops.items === 0x4,
        );

        const value = prng.getInt(0, filteredItems.length - 1, `shops_item_${options.shops.items}_${j}_${i}`);

        items.push(filteredItems[value].index);
      }
    }

    items.forEach((item, index) => {
      setInt(offset + 0x8 + index * 0x2, "uint16", item, { bigEndian: true }, "shops");
    });
  }
}
