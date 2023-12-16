import { getInt, setInt } from "$lib/utils/bytes";

import type { Item, ItemInt } from "$lib/types";

export function afterSetInt(item: Item): void {
  if ("id" in item && item.id === "hearts") {
    const itemInt = item as ItemInt;

    let hearts = getInt(itemInt.offset, "uint8");
    const heartsMax = getInt(itemInt.offset + 1, "uint8");

    hearts = Math.min(hearts, heartsMax * 8);

    setInt(itemInt.offset, "uint8", hearts);
  } else if ("id" in item && item.id === "heartsMax") {
    const itemInt = item as ItemInt;

    let hearts = getInt(itemInt.offset - 1, "uint8");
    const heartsMax = getInt(itemInt.offset, "uint8");

    hearts = Math.min(hearts, heartsMax * 8);

    setInt(itemInt.offset - 1, "uint8", hearts);
  }
}
