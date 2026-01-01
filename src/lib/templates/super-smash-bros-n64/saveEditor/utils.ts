import { get } from "svelte/store";

import { gameRegion, gameTemplate } from "$lib/stores";
import { getInt } from "$lib/utils/bytes";
import { formatChecksum } from "$lib/utils/checksum";
import { byteswapDataView, getHeaderShift } from "$lib/utils/common/nintendo64";
import { clone } from "$lib/utils/format";

import type { Item, ItemChecksum, ItemInt } from "$lib/types";

export function initHeaderShift(dataView: DataView): number {
  return getHeaderShift(dataView, "sra");
}

export function beforeInitDataView(dataView: DataView): DataView {
  return byteswapDataView("sra", dataView);
}

export function overrideGetRegions(
  dataView: DataView,
  shift: number,
): string[] {
  const $gameTemplate = get(gameTemplate);

  const itemChecksum = clone($gameTemplate.items[0]) as ItemChecksum;

  itemChecksum.offset += shift;
  itemChecksum.control.offsetStart += shift;
  itemChecksum.control.offsetEnd += shift;

  if (dataView.byteLength < itemChecksum.control.offsetEnd) {
    return [];
  }

  const checksum = generateChecksum(itemChecksum, dataView);

  if (
    checksum ===
    getInt(itemChecksum.offset, "uint32", { bigEndian: true }, dataView)
  ) {
    return ["europe", "usa", "japan", "australia"];
  }

  return [];
}

export function overrideParseItem(item: Item): Item {
  const $gameRegion = get(gameRegion);

  if ("id" in item && item.id === "language") {
    const itemInt = item as ItemInt;

    itemInt.hidden = $gameRegion !== 0;

    return itemInt;
  }

  return item;
}

export function generateChecksum(
  item: ItemChecksum,
  dataView?: DataView,
): number {
  let checksum = 0x0;

  for (let i = item.control.offsetStart; i < item.control.offsetEnd; i += 0x4) {
    const multiplicator = i - item.control.offsetStart + 0x4;

    checksum += getInt(i + 0x3, "uint8", {}, dataView) * multiplicator;
    checksum += getInt(i + 0x2, "uint8", {}, dataView) * (multiplicator - 1);
    checksum += getInt(i + 0x1, "uint8", {}, dataView) * (multiplicator - 2);
    checksum += getInt(i, "uint8", {}, dataView) * (multiplicator - 3);
  }

  return formatChecksum(checksum, item.dataType);
}

export function beforeSaving(): ArrayBufferLike {
  return byteswapDataView("sra").buffer;
}
