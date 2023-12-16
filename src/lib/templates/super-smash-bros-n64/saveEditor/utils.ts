import { get } from "svelte/store";

import { dataView } from "$lib/stores";
import { getInt } from "$lib/utils/bytes";
import { clone } from "$lib/utils/format";

import type { ItemChecksum } from "$lib/types";

import template from "./template";

export function overrideGetRegions(dataView: DataView): string[] {
  let validatorOffset = 0x0;

  if (dataView.byteLength === 0x48800) {
    validatorOffset += 0x20800;
  }

  const itemChecksum = clone(template.items[0]) as ItemChecksum;

  itemChecksum.offset += validatorOffset;
  itemChecksum.control.offset += validatorOffset;

  const checksum = generateChecksum(itemChecksum, dataView);

  if (checksum === dataView.getUint32(itemChecksum.offset, true)) {
    return ["europe", "usa", "japan", "australia"];
  }

  return [];
}

export function initSteps(): number {
  const $dataView = get(dataView);

  if ($dataView.byteLength === 0x48800) {
    return 0x20800;
  }

  return 0x0;
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

      if (dataView.byteLength > 0) {
        checksum += dataView.getUint8(i) * multiplicator;
        checksum += dataView.getUint8(i + 0x1) * (multiplicator - 1);
        checksum += dataView.getUint8(i + 0x2) * (multiplicator - 2);
        checksum += dataView.getUint8(i + 0x3) * (multiplicator - 3);
      } else {
        checksum += getInt(i, "uint8") * multiplicator;
        checksum += getInt(i + 0x1, "uint8") * (multiplicator - 1);
        checksum += getInt(i + 0x2, "uint8") * (multiplicator - 2);
        checksum += getInt(i + 0x3, "uint8") * (multiplicator - 3);
      }
    }
  }

  return checksum;
}
