import { getInt, setInt } from "$lib/utils/bytes";

import type { Item, ItemInt } from "$lib/types";

export function afterSetInt(item: Item): void {
  if ("id" in item && item.id === "health") {
    const itemInt = item as ItemInt;

    let health = getInt(itemInt.offset, "uint8");
    const healthMax = getInt(itemInt.offset + 0x1, "uint8");

    health = Math.min(health, healthMax * 8);

    setInt(itemInt.offset, "uint8", health);
  } else if ("id" in item && item.id === "healthMax") {
    const itemInt = item as ItemInt;

    let health = getInt(itemInt.offset - 0x1, "uint8");
    const healthMax = getInt(itemInt.offset, "uint8");

    health = Math.min(health, healthMax * 8);

    setInt(itemInt.offset - 0x1, "uint8", health);
  } else if (
    "id" in item &&
    (item.id === "magicPowder" || item.id === "bombs")
  ) {
    const itemInt = item as ItemInt;

    let quantities = getInt(itemInt.offset, "uint8");
    const quantitiesMax = getInt(itemInt.offset + 0x2a, "uint8");

    quantities = Math.min(quantities, quantitiesMax);

    setInt(itemInt.offset, "uint8", quantities);
  } else if (
    "id" in item &&
    (item.id === "magicPowderMax" || item.id === "bombsMax")
  ) {
    const itemInt = item as ItemInt;

    let quantities = getInt(itemInt.offset - 0x2a, "uint8");
    const quantitiesMax = getInt(itemInt.offset, "uint8");

    quantities = Math.min(quantities, quantitiesMax);

    setInt(itemInt.offset - 0x2a, "uint8", quantities);
  } else if ("id" in item && item.id === "arrows") {
    const itemInt = item as ItemInt;

    let arrows = getInt(itemInt.offset, "uint8");
    const arrowsMax = getInt(itemInt.offset + 0x33, "uint8");

    arrows = Math.min(arrows, arrowsMax);

    setInt(itemInt.offset, "uint8", arrows);
  } else if ("id" in item && item.id === "arrowsMax") {
    const itemInt = item as ItemInt;

    let arrows = getInt(itemInt.offset - 0x33, "uint8");
    const arrowsMax = getInt(itemInt.offset, "uint8");

    arrows = Math.min(arrows, arrowsMax);

    setInt(itemInt.offset - 0x33, "uint8", arrows);
  }
}
