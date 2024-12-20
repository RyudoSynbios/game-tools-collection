import { get } from "svelte/store";

import { gameRegion } from "$lib/stores";
import { getInt, setInt } from "$lib/utils/bytes";
import { formatChecksum } from "$lib/utils/checksum";

import type { Item, ItemChecksum, ItemInt, ItemString } from "$lib/types";

import PhotoCanvas from "./components/PhotoCanvas.svelte";

export function getComponent(
  component: string,
): typeof PhotoCanvas | undefined {
  if (component === "PhotoCanvas") {
    return PhotoCanvas;
  }
}

export function overrideParseItem(item: Item): Item {
  const $gameRegion = get(gameRegion);

  if ("id" in item && item.id === "bloodType") {
    const itemInt = item as ItemInt;

    itemInt.hidden = $gameRegion === 0;

    return itemInt;
  }

  return item;
}

export function overrideGetInt(
  item: Item,
): [boolean, number | string | undefined] {
  const $gameRegion = get(gameRegion);

  if ("id" in item && (item.id === "birthDate" || item.id === "userId")) {
    const itemString = item as ItemString;

    let string = "";

    for (let i = 0x0; i < 0x4; i += 0x1) {
      ["upper4", "lower4"].forEach((type) => {
        const int = getInt(itemString.offset + i, type as "lower4" | "upper4");

        if (int === 0x0 || int === 0xb) {
          string += "?";
        } else {
          string += `${int - 0x1}`;
        }
      });
    }

    if (item.id === "birthDate") {
      if ($gameRegion === 0) {
        string = `${string.substring(4, 6)}/${string.substring(6, 8)}/${string.substring(0, 4)}`;
      } else {
        string = `${string.substring(0, 4)}/${string.substring(4, 6)}/${string.substring(6, 8)}`;
      }
    }

    return [true, string];
  } else if ("id" in item && item.id === "run") {
    const itemInt = item as ItemInt;

    const int = 0x99 - getInt(itemInt.offset, "uint8");

    return [true, int.toHex()];
  }

  return [false, undefined];
}

export function overrideSetInt(item: Item, value: string): boolean {
  const $gameRegion = get(gameRegion);

  if ("id" in item && (item.id === "birthDate" || item.id === "userId")) {
    const itemInt = item as ItemInt;

    if (item.id === "birthDate") {
      value = (value.match(/[0-9]|\?/g) || []).join("").padEnd(8, "?");

      if ($gameRegion === 0) {
        value = `${value.substring(4, 8)}${value.substring(0, 2)}${value.substring(2, 4)}`;
      }
    }

    let int = 0x0;

    for (let i = 0; i < value.length; i += 1) {
      int <<= 0x4;

      if (value[i] === "?") {
        int |= 0xb;
      } else {
        int |= parseInt(value[i]) + 1;
      }
    }

    setInt(itemInt.offset, "uint32", int, { bigEndian: true });

    return true;
  } else if ("id" in item && item.id === "run") {
    const itemInt = item as ItemInt;

    const int = 0x99 - parseInt(value, 16);

    setInt(itemInt.offset, "uint8", int);

    return true;
  }

  return false;
}

export function generateChecksum(item: ItemChecksum): number {
  let checksumByte1 = 0x15;
  let checksumByte2 = 0x2f;

  for (let i = item.control.offsetStart; i < item.control.offsetEnd; i += 0x1) {
    checksumByte1 ^= getInt(i, "uint8");
    checksumByte2 += getInt(i, "uint8");
  }

  const checksum = (checksumByte1 << 0x8) | (checksumByte2 & 0xff);

  return formatChecksum(checksum, item.dataType);
}
