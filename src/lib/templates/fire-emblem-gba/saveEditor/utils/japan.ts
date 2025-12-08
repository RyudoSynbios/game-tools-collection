import { get } from "svelte/store";

import { gameRegion } from "$lib/stores";

import type {
  Item,
  ItemContainer,
  ItemInt,
  ItemString,
  ItemTab,
} from "$lib/types";

export function japanParseContainerAdaptater(
  item: ItemContainer,
  shifts: number[],
  index: number,
): [boolean, number[] | undefined] {
  const $gameRegion = get(gameRegion);

  if ($gameRegion !== 2) {
    return [false, undefined];
  }

  if (item.id === "laTeams") {
    return [true, [...shifts, -0x4, index * item.length]];
  } else if (item.id === "laRanking") {
    return [true, [...shifts, -0x28, index * item.length]];
  }

  return [false, undefined];
}

export function japanParseItemAdaptater(item: Item): Item {
  const $gameRegion = get(gameRegion);

  if ($gameRegion !== 2) {
    return item;
  }

  if ("id" in item && item.id?.match(/^name/)) {
    const itemString = item as ItemString;

    if (itemString.length === 0x7) {
      itemString.length = 0xa;
    } else if (itemString.length === 0x9) {
      itemString.length = 0xe;
    }

    if (item.id === "name-arenaLink") {
      itemString.offset += 0x4;
    }

    itemString.encoding = "windows31J";

    if (item.id === "name-arenaLink") {
      itemString.regex =
        "[ \uff1f\uff01\u30fc\uff21-\uff3a\u30a1-\u30f3\uff10-\uff19\u3041-\u308d\u308f\u3092\u3093\u8ecd\u9a0e\u58eb\u56e3\u968a\u98db\u7adc\u5929\u99ac\u8056\u9b54\u9053\u6226\u5149\u95c7\u7406\u50ad\u5175\u88c5\u6483\u52c7\u795e\u5c06\u91cd\u8efd]";
    } else {
      itemString.regex =
        "[ \uff0e\uff1f\uff01\u30fc\uff5e\uff08\uff09\uff21-\uff3a\uff41-\uff5a\u30a1-\u30f3\u2160-\u2164\uff10-\uff19\u3041-\u308d\u308f\u3092\u3093]";
    }

    return itemString;
  }

  if ("id" in item && item.id === "laTeams") {
    const itemContainer = item as ItemContainer;

    itemContainer.length = 0xc4;
  } else if ("id" in item && item.id === "laRanking") {
    const itemContainer = item as ItemContainer;

    itemContainer.length = 0x14;
  } else if ("id" in item && item.id === "laRules") {
    const itemTab = item as ItemTab;

    itemTab.items.forEach((item) => {
      (item as ItemInt).offset -= 0x28;
    });
  }

  return item;
}
