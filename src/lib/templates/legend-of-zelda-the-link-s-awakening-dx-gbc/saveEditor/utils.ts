import { getInt, setInt } from "$lib/utils/bytes";

import type { Item, ItemInt } from "$lib/types";

export function afterSetInt(item: Item): void {
  if ("id" in item && item.id === "health") {
    const itemInt = item as ItemInt;

    let health = getInt(itemInt.offset, "uint8");
    const healthMax = getInt(itemInt.offset + 1, "uint8");

    health = Math.min(health, healthMax * 8);

    setInt(itemInt.offset, "uint8", health);
  } else if ("id" in item && item.id === "healthMax") {
    const itemInt = item as ItemInt;

    let health = getInt(itemInt.offset - 1, "uint8");
    const healthMax = getInt(itemInt.offset, "uint8");

    health = Math.min(health, healthMax * 8);

    setInt(itemInt.offset - 1, "uint8", health);
  }
}
