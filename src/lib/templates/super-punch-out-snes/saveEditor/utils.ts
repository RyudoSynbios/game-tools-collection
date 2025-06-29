import { getInt } from "$lib/utils/bytes";

import { Item, ItemTabs } from "$lib/types";

export function overrideItem(item: Item): Item {
  if ("id" in item && item.id === "slots") {
    const itemTabs = item as ItemTabs;

    itemTabs.items.map((item, index) => {
      const int = getInt(0x6 + index, "uint8");

      item.disabled = !Boolean(int);
    });

    return itemTabs;
  }

  return item;
}
