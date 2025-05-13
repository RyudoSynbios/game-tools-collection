import { get } from "svelte/store";

import { gameRegion } from "$lib/stores";
import { getInt, setInt } from "$lib/utils/bytes";
import { formatChecksum } from "$lib/utils/checksum";

import type {
  Item,
  ItemBitflag,
  ItemBitflags,
  ItemChecksum,
  ItemInt,
  Resource,
} from "$lib/types";

export function overrideParseItem(item: Item): Item {
  const $gameRegion = get(gameRegion);

  if ("id" in item && item.id === "language") {
    const itemInt = item as ItemInt;

    itemInt.hidden = $gameRegion !== 0;

    return itemInt;
  }

  return item;
}

export function overrideItem(item: Item): Item {
  if ("id" in item && item.id?.match(/ring-/)) {
    const itemInt = item as ItemInt;

    const [index] = item.id.splitInt();

    const ringBox = getInt(itemInt.offset + (0x6 - index), "uint8");

    let int = 0;

    switch (ringBox) {
      case 1:
        int = 1;
        break;
      case 2:
        int = 3;
        break;
      case 3:
        int = 5;
        break;
    }

    itemInt.disabled = index >= int;

    return itemInt;
  } else if ("id" in item && item.id === "normalOnly") {
    const itemBitflags = item as ItemBitflags;

    const mode = getInt(itemBitflags.flags[0].offset - 0xc3, "bit", { bit: 0 });

    itemBitflags.hidden = mode !== 0;

    return itemBitflags;
  } else if ("id" in item && item.id === "linkedOnly") {
    const itemBitflags = item as ItemBitflags;

    const mode = getInt(itemBitflags.flags[0].offset - 0xc3, "bit", { bit: 0 });

    itemBitflags.hidden = mode === 0;

    return itemBitflags;
  }

  return item;
}

export function overrideGetInt(item: Item): [boolean, number | undefined] {
  if ("id" in item && item.id?.match(/ring-/)) {
    const itemInt = item as ItemInt;

    if (itemInt.disabled) {
      return [true, 0xff];
    }
  } else if ("id" in item && item.id?.match(/pendingRing-/)) {
    const itemInt = item as ItemInt;

    let int = getInt(itemInt.offset, "uint8");

    if (int !== 0xff) {
      int &= 0x3f;
    }

    return [true, int];
  } else if ("id" in item && item.id === "collectedRupeeCount") {
    const itemInt = item as ItemInt;

    const limitReached = getInt(itemInt.offset + 0xa9, "bit", { bit: 1 });

    let int = getInt(itemInt.offset, "uint16", { binaryCodedDecimal: true });

    if (int === 6363 && limitReached) {
      int = 10000;
    }

    return [true, int];
  }

  return [false, undefined];
}

export function overrideSetInt(item: Item, value: string): boolean {
  if ("id" in item && item.id?.match(/pendingRing-/)) {
    const itemInt = item as ItemInt;

    let int = parseInt(value);

    if (int !== 0xff) {
      int |= 0x40;
    }

    setInt(itemInt.offset, "uint8", int);

    return true;
  } else if ("id" in item && item.id === "collectedRupeeCount") {
    const itemInt = item as ItemInt;

    if (parseInt(value) === 10000) {
      setInt(itemInt.offset, "uint16", 0x6363);
      return true;
    }
  }

  return false;
}

export function afterSetInt(item: Item, flag: ItemBitflag): void {
  if ("id" in item && item.id === "progression") {
    const itemInt = item as ItemInt;

    const checked = getInt(itemInt.offset, "bit", { bit: itemInt.bit });

    setInt(itemInt.offset + 0xbe, "bit", checked, { bit: 4 });
  } else if ("id" in item && item.id === "health") {
    const itemInt = item as ItemInt;

    let health = getInt(itemInt.offset, "uint8");
    const healthMax = getInt(itemInt.offset + 0x1, "uint8");

    health = Math.min(health, healthMax);

    setInt(itemInt.offset, "uint8", health);
  } else if ("id" in item && item.id === "healthMax") {
    const itemInt = item as ItemInt;

    let health = getInt(itemInt.offset - 0x1, "uint8");
    const healthMax = getInt(itemInt.offset, "uint8");

    health = Math.min(health, healthMax);

    setInt(itemInt.offset - 0x1, "uint8", health);
  } else if ("id" in item && item.id === "galeSeedsWarps") {
    if (flag.label === "Crescent Island") {
      const checked = getInt(flag.offset, "bit", { bit: flag.bit });

      setInt(flag.offset, "bit", checked, { bit: 7 });
    }
  } else if ("id" in item && item.id?.match(/item-/)) {
    const itemInt = item as ItemInt;

    const [shift] = item.id.splitInt();

    const offset = itemInt.offset - shift;

    for (let i = 0x1; i <= 0x19; i += 0x1) {
      const obtainedOffset = offset + 0x12 + Math.floor(i / 0x8);

      setInt(obtainedOffset, "bit", 0, { bit: i % 8 });
    }

    for (let i = 0x0; i < 0x12; i += 0x1) {
      const item = getInt(offset + i, "uint8");

      if (item !== 0x0) {
        const obtainedOffset = offset + 0x12 + Math.floor(item / 0x8);

        setInt(obtainedOffset, "bit", 1, { bit: item % 8 });
      }
    }
  } else if ("id" in item && item.id === "keyItems") {
    if (flag.label === "Bomb Flower") {
      const checked = getInt(flag.offset, "bit", { bit: flag.bit });

      setInt(flag.offset + 0x2, "bit", checked, { bit: 0 });
    }
  } else if ("id" in item && item.id === "bombs") {
    const itemInt = item as ItemInt;

    let quantities = getInt(itemInt.offset, "uint8");
    const quantitiesMax = getInt(itemInt.offset + 0x1, "uint8");

    quantities = Math.min(quantities, quantitiesMax);

    setInt(itemInt.offset, "uint8", quantities);
  } else if ("id" in item && item.id === "bombsMax") {
    const itemInt = item as ItemInt;

    let quantities = getInt(itemInt.offset - 0x1, "uint8");
    const quantitiesMax = getInt(itemInt.offset, "uint8");

    quantities = Math.min(quantities, quantitiesMax);

    setInt(itemInt.offset - 0x1, "uint8", quantities);
  } else if ("id" in item && item.id?.match(/seeds-/)) {
    const itemInt = item as ItemInt;

    const [shift] = item.id.splitInt();

    let quantities = getInt(itemInt.offset, "uint8", {
      binaryCodedDecimal: true,
    });
    let quantitiesMax = getInt(itemInt.offset - shift - 0x5, "uint8");

    switch (quantitiesMax) {
      case 1:
        quantitiesMax = 20;
        break;
      case 2:
        quantitiesMax = 50;
        break;
      case 3:
        quantitiesMax = 99;
        break;
    }

    quantities = Math.min(quantities, quantitiesMax);

    setInt(itemInt.offset, "uint8", quantities, { binaryCodedDecimal: true });
  } else if ("id" in item && item.id === "seedsMax") {
    const itemInt = item as ItemInt;

    let quantitiesMax = getInt(itemInt.offset, "uint8");

    switch (quantitiesMax) {
      case 1:
        quantitiesMax = 20;
        break;
      case 2:
        quantitiesMax = 50;
        break;
      case 3:
        quantitiesMax = 99;
        break;
    }

    for (let i = 0x0; i < 0x6; i += 0x1) {
      let quantities = getInt(itemInt.offset + 0x5 + i, "uint8", {
        binaryCodedDecimal: true,
      });

      quantities = Math.min(quantities, quantitiesMax);

      setInt(itemInt.offset + 0x5 + i, "uint8", quantities, {
        binaryCodedDecimal: true,
      });
    }
  } else if ("id" in item && item.id?.match(/pendingRing-/)) {
    const itemInt = item as ItemInt;

    const [shift] = item.id.splitInt();

    const offset = itemInt.offset - shift;

    let count = 0;

    for (let i = 0x0; i < 0x40; i += 0x1) {
      const int = getInt(offset + i, "uint8");

      if (int !== 0xff) {
        count += 1;
      }
    }

    setInt(offset + 0x10d, "uint8", count, { binaryCodedDecimal: true });
  } else if ("id" in item && item.id === "killedMonsterCount") {
    const itemInt = item as ItemInt;

    const count = getInt(itemInt.offset, "uint16");

    setInt(itemInt.offset + 0xb0, "bit", count >= 1000 ? 1 : 0, { bit: 0 });
  } else if ("id" in item && item.id === "collectedRupeeCount") {
    const itemInt = item as ItemInt;

    const count = getInt(itemInt.offset, "uint16");

    setInt(itemInt.offset + 0xa9, "bit", count === 0x6363 ? 1 : 0, { bit: 1 });
  }
}

export function generateChecksum(item: ItemChecksum): number {
  let checksum = 0x0;

  for (let i = item.control.offsetStart; i < item.control.offsetEnd; i += 0x2) {
    checksum += getInt(i, "uint16");
  }

  return formatChecksum(checksum, item.dataType);
}

export function getLocationNames(): Resource {
  const names: Resource = {};

  for (let column = 0; column < 14; column += 1) {
    for (let row = 0; row < 14; row += 1) {
      const index = (column << 0x4) | row;

      names[index] = `${String.fromCharCode(0x41 + column)}${row + 1}`;
    }
  }

  return names;
}
