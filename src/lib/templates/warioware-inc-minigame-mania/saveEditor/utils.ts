import { get } from "svelte/store";

import { gameRegion } from "$lib/stores";
import { getInt, getString, setInt, setString } from "$lib/utils/bytes";
import { formatChecksum } from "$lib/utils/checksum";
import { getHeaderShift } from "$lib/utils/common/gameBoyAdvance";

import type { Item, ItemChecksum, ItemString } from "$lib/types";

export function initHeaderShift(dataView: DataView): number {
  return getHeaderShift(dataView);
}

export function overrideParseItem(item: Item): Item {
  const $gameRegion = get(gameRegion);

  if ("id" in item && item.id === "filename" && $gameRegion === 1) {
    const itemString = item as ItemString;

    itemString.regex =
      "[\u3041-\u308d\u308f\u3092\u3093\u30a1-\u30ed\u30ef\u30f2\u30f3\u30fc\uff10-\uff19\uff5e]";

    return itemString;
  }

  return item;
}

export function overrideGetInt(item: Item): [boolean, string | undefined] {
  if ("id" in item && item.id === "filename") {
    const itemString = item as ItemString;

    let filename = getString(itemString.offset, 0xa, "uint8", {
      encoding: itemString.encoding,
      endCode: itemString.endCode,
    });

    filename = filename.split("").reduce((filename, char) => {
      if (char.match(/[\uff10-\uff19\uff21-\uff3a\uff41-\uff5a]/)) {
        char = String.fromCharCode(char.charCodeAt(0) - 0xfee0);
      }

      return filename + char;
    }, "");

    return [true, filename];
  }

  return [false, undefined];
}

export function overrideSetInt(item: Item, value: string): boolean {
  if ("id" in item && item.id === "filename") {
    const itemString = item as ItemString;

    value = value.split("").reduce((filename, char) => {
      if (char.match(/[0-9A-Za-z]/)) {
        char = String.fromCharCode(char.charCodeAt(0) + 0xfee0);
      }

      return filename + char;
    }, "");

    console.log(value);

    setString(itemString.offset, 0xa, "uint8", value, 0x0, {
      encoding: itemString.encoding,
      endCode: itemString.endCode,
      regex: itemString.regex,
    });

    return true;
  }

  return false;
}

export function afterSetInt(item: Item): void {
  if ("id" in item && item.id === "filename") {
    const itemString = item as ItemString;

    const filename = getString(itemString.offset, 0xa, "uint8", {
      encoding: itemString.encoding,
      endCode: itemString.endCode,
    });

    setInt(itemString.offset + 0xb, "uint8", filename.length);
  }
}

export function generateChecksum(item: ItemChecksum): number {
  let checksum = 0x0;

  for (let i = item.control.offsetStart; i < item.control.offsetEnd; i += 0x4) {
    checksum += getInt(i, "uint32");
  }

  return formatChecksum(checksum, item.dataType);
}
