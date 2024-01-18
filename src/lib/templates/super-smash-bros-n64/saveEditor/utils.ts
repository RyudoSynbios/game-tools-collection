import { getInt } from "$lib/utils/bytes";
import { formatChecksum } from "$lib/utils/checksum";
import {
  getDexDriveHeaderShift,
  getSrmHeaderShift,
  isDexDriveHeader,
  isSrmFile,
} from "$lib/utils/common/nintendo64";
import { clone } from "$lib/utils/format";

import type { ItemChecksum } from "$lib/types";

import template from "./template";

export function initHeaderShift(dataView: DataView): number {
  if (isSrmFile(dataView)) {
    return getSrmHeaderShift("sra");
  } else if (isDexDriveHeader(dataView)) {
    return getDexDriveHeaderShift();
  }

  return 0x0;
}

export function overrideGetRegions(
  dataView: DataView,
  shift: number,
): string[] {
  const itemChecksum = clone(template.items[0]) as ItemChecksum;

  itemChecksum.offset += shift;
  itemChecksum.control.offset += shift;

  const checksum = generateChecksum(itemChecksum, dataView);

  if (checksum === getInt(itemChecksum.offset, "uint32", {}, dataView)) {
    return ["europe", "usa", "japan", "australia"];
  }

  return [];
}

export function generateChecksum(
  item: ItemChecksum,
  dataView = new DataView(new ArrayBuffer(0)),
): number {
  let checksum = 0x0;

  for (
    let i = item.control.offset;
    i < item.control.offset + item.control.length;
    i += 0x4
  ) {
    if (i < item.offset) {
      const multiplicator = i - item.control.offset + 0x4;

      checksum += getInt(i, "uint8", {}, dataView) * multiplicator;
      checksum += getInt(i + 0x1, "uint8", {}, dataView) * (multiplicator - 1);
      checksum += getInt(i + 0x2, "uint8", {}, dataView) * (multiplicator - 2);
      checksum += getInt(i + 0x3, "uint8", {}, dataView) * (multiplicator - 3);
    }
  }

  return formatChecksum(checksum, item.dataType);
}
