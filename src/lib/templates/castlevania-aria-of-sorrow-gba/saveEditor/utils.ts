import { getInt, setInt } from "$lib/utils/bytes";
import { extractGbaGameSharkHeader } from "$lib/utils/common";

import type { Item, ItemInt } from "$lib/types";

export function beforeInitDataView(dataView: DataView): [DataView, Uint8Array] {
  return extractGbaGameSharkHeader(dataView);
}

export function afterSetInt(item: Item): void {
  if ("id" in item && item.id === "gold") {
    const itemInt = item as ItemInt;

    const value = getInt(itemInt.offset, "uint32");

    setInt(itemInt.offset + 0x170, "uint32", value);
  }
}
