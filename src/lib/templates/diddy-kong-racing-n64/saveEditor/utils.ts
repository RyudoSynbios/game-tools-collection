import { get } from "svelte/store";

import { gameRegion, gameTemplate } from "$lib/stores";
import { extractBinary, getInt, setInt } from "$lib/utils/bytes";
import { formatChecksum } from "$lib/utils/checksum";
import { byteswapDataView, getHeaderShift } from "$lib/utils/common/nintendo64";
import { clone, getObjKey } from "$lib/utils/format";
import { getResource } from "$lib/utils/parser";

import type {
  Item,
  ItemChecksum,
  ItemContainer,
  ItemInt,
  ItemString,
  ItemTab,
  ItemTabs,
  Resource,
} from "$lib/types";

export function initHeaderShift(dataView: DataView): number {
  return getHeaderShift(dataView, "eep");
}

export function beforeInitDataView(dataView: DataView): DataView {
  return byteswapDataView("eep", dataView);
}

export function overrideGetRegions(
  dataView: DataView,
  shift: number,
): string[] {
  const $gameTemplate = get(gameTemplate);

  for (let i = 0; i < 3; i += 1) {
    const itemTabs = clone($gameTemplate.items[0] as ItemTabs);
    const itemTab = itemTabs.items[1] as ItemTab;
    const itemContainer = itemTab.items[0] as ItemContainer;
    const itemChecksum = itemContainer.items[0] as ItemChecksum;

    const tmpShift = shift + i * 0x28;

    itemChecksum.offset += tmpShift;
    itemChecksum.control.offsetStart += tmpShift;
    itemChecksum.control.offsetEnd += tmpShift;

    if (dataView.byteLength < itemChecksum.control.offsetEnd) {
      return [];
    }

    const checksum = generateChecksum(itemChecksum, dataView);

    if (
      checksum ===
      getInt(itemChecksum.offset, "uint16", { bigEndian: true }, dataView)
    ) {
      return ["europe", "usa", "japan"];
    }
  }

  return [];
}

export function overrideParseItem(item: Item): Item {
  const $gameRegion = get(gameRegion);

  if ("id" in item && item.id === "language") {
    const itemInt = item as ItemInt;

    itemInt.hidden = $gameRegion === 2;

    return itemInt;
  }

  return item;
}

export function overrideGetInt(item: Item): [boolean, string | undefined] {
  if ("id" in item && item.id === "name") {
    const itemString = item as ItemString;

    const letters = getResource("letters") as Resource;

    const int = getInt(itemString.offset, "uint16", {
      bigEndian: itemString.bigEndian,
    });

    const letter1 = extractBinary(int, 10, 5);
    const letter2 = extractBinary(int, 5, 5);
    const letter3 = extractBinary(int, 0, 5);

    const string = `${letters[letter1]}${letters[letter2]}${letters[letter3]}`;

    return [true, string];
  }

  return [false, undefined];
}

export function overrideSetInt(item: Item, value: string): boolean {
  if ("id" in item && item.id === "name") {
    const itemString = item as ItemString;

    const letters = getResource("letters") as Resource;

    let int = 0x0;

    for (let i = 0x0; i < 0x3; i += 0x1) {
      const index = Object.values(letters).findIndex(
        (letter) => letter === value[i],
      );

      let letter = itemString.fallback as number;

      if (index !== -1) {
        letter = parseInt(getObjKey(letters, index));
      }

      int |= letter << ((0x2 - i) * 0x5);
    }

    setInt(itemString.offset, "uint16", int, { bigEndian: true });

    return true;
  }

  return false;
}

export function generateChecksum(
  item: ItemChecksum,
  dataView = new DataView(new ArrayBuffer(0)),
): number {
  let checksum = 0x5;

  for (let i = item.control.offsetStart; i < item.control.offsetEnd; i += 0x1) {
    const int = getInt(i, "uint8", {}, dataView);

    if (item.id === "checksumOptions") {
      checksum += (int >> 0x4) + (int & 0xf);
    } else {
      checksum += int;
    }
  }

  return formatChecksum(checksum, item.dataType);
}

export function beforeSaving(): ArrayBufferLike {
  return byteswapDataView("eep").buffer;
}
