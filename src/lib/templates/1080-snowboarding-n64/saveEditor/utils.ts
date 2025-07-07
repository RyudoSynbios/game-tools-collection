import { get } from "svelte/store";

import { gameTemplate } from "$lib/stores";
import { getBigInt, getInt, setInt } from "$lib/utils/bytes";
import { byteswapDataView, getHeaderShift } from "$lib/utils/common/nintendo64";
import { clone } from "$lib/utils/format";

import type {
  DataViewABL,
  Item,
  ItemChecksum,
  ItemInt,
  ItemSection,
} from "$lib/types";

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

  const itemChecksum = clone(
    ($gameTemplate.items[0] as ItemSection).items[3],
  ) as ItemChecksum;

  itemChecksum.offset += shift;
  itemChecksum.control.offsetStart += shift;
  itemChecksum.control.offsetEnd += shift;

  if (dataView.byteLength < itemChecksum.control.offsetEnd) {
    return [];
  }

  const checksum = generateChecksum(itemChecksum, dataView);

  if (
    checksum ===
    getBigInt(itemChecksum.offset, "uint64", { bigEndian: true }, dataView)
  ) {
    return ["europe", "usa_japan"];
  }

  return [];
}

export function afterSetInt(item: Item): void {
  if ("id" in item && item.id?.match(/contest-/)) {
    const itemInt = item as ItemInt;

    const [index] = item.id.splitInt();

    let int = 0;

    const offset = itemInt.offset - (index - 1) * 0x4;

    for (let i = 0; i < 5; i += 1) {
      int += getInt(offset + i * 0x4, "uint32", { bigEndian: true });
    }

    setInt(offset + 0x14, "uint32", int, { bigEndian: true });
  }
}

export function generateChecksum(
  item: ItemChecksum,
  dataView: DataViewABL = new DataView(new ArrayBuffer(0)),
): bigint {
  let checksum1 = 0x0;
  let checksum2 = 0x0;

  if (item.id === "checksum") {
    const offsets = [0x188, 0x1f0, 0x210, 0x228];

    offsets.forEach((offset) => {
      checksum1 += getInt(
        item.offset + offset,
        "uint32",
        { bigEndian: true },
        dataView,
      );
      checksum1 += getInt(
        item.offset + offset + 0x4,
        "uint32",
        { bigEndian: true },
        dataView,
      );
    });
  } else {
    for (
      let i = item.control.offsetStart;
      i < item.control.offsetEnd;
      i += 0x4
    ) {
      checksum1 += getInt(i, "uint32", { bigEndian: true }, dataView);
    }
  }

  checksum2 = checksum1;

  let base = 0xec5bc9a8;

  if (item.id === "checksum") {
    base = 0xded46000;
  }

  checksum1 = 0xf251f205 - checksum1;
  checksum2 = base + checksum2 * 2;

  const high = ((checksum1 & 0xffffffff) >>> 0x0).toHex(8);
  const low = ((checksum2 & 0xffffffff) >>> 0x0).toHex(8);

  return BigInt(`0x${high}${low}`);
}

export function beforeSaving(): ArrayBufferLike {
  return byteswapDataView("sra").buffer;
}
