import { get } from "svelte/store";

import { gameTemplate } from "$lib/stores";
import { getBigInt, getInt, setInt } from "$lib/utils/bytes";
import {
  byteswapDataView,
  generateRareChecksum,
  getHeaderShift,
} from "$lib/utils/common/nintendo64";
import { clone } from "$lib/utils/format";
import { getShift } from "$lib/utils/parser";

import type { Item, ItemChecksum, ItemContainer, ItemInt } from "$lib/types";

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

  const itemContainer = $gameTemplate.items[0] as ItemContainer;
  const itemChecksum = clone(itemContainer.items[0] as ItemChecksum);

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
    return ["europe_usa_japan"];
  }

  return [];
}

export function overrideParseContainerItemsShifts(
  item: ItemContainer,
  shifts: number[],
  index: number,
): [boolean, number[] | undefined] {
  if (item.id === "slots") {
    for (let i = 0; i < item.instances + 1; i += 1) {
      const saveIndex = getInt(
        getShift(shifts) + i * item.length + 0x28,
        "uint8",
      );

      if ((saveIndex & 0x7) === index && !(saveIndex & 0x80)) {
        return [true, [...shifts, i * item.length]];
      }
    }
  }

  return [false, undefined];
}

export function overrideGetInt(item: Item): [boolean, number | undefined] {
  if ("id" in item && item.id === "ratio") {
    const itemInt = item as ItemInt;

    const ratioCinema = getInt(itemInt.offset - 0x1, "bit", { bit: 3 });

    if (ratioCinema) {
      return [true, 0x8];
    }
  }

  return [false, undefined];
}

export function overrideSetInt(item: Item, value: string): boolean {
  if ("id" in item && item.id === "ratio") {
    const itemInt = item as ItemInt;

    const int = parseInt(value);
    const controlStyle = getInt(itemInt.offset - 0x1, "uint8");
    const ratioCinema = getInt(itemInt.offset - 0x1, "bit", { bit: 3 });

    if (int === 0x8 && !ratioCinema) {
      setInt(itemInt.offset - 0x1, "uint8", controlStyle + 0x8);
      setInt(itemInt.offset, "bit", 0, { bit: 7 });

      return true;
    } else if (ratioCinema) {
      setInt(itemInt.offset - 0x1, "uint8", controlStyle - 0x8);
      setInt(itemInt.offset, "bit", int, { bit: 7 });

      return true;
    }
  }

  return false;
}
export function afterSetInt(item: Item): void {
  if ("id" in item && item.id?.match(/time-/)) {
    const itemInt = item as ItemInt;

    const [index] = item.id.splitInt();

    if (index === 0) {
      return;
    }

    const timeRef = getInt(itemInt.offset, "uint16", {
      bigEndian: true,
      binary: itemInt.binary,
    });

    const offset = itemInt.offset - index * 0x19;

    for (let i = 0x0; i < index; i += 0x1) {
      const time = getInt(offset + i * 0x19, "uint16", {
        bigEndian: true,
        binary: itemInt.binary,
      });

      if (timeRef > 0x0 && time === 0x0) {
        setInt(offset + i * 0x19, "uint16", 0x3ff, {
          bigEndian: true,
          binary: itemInt.binary,
        });
      } else if (timeRef === 0x0 && time === 0x3ff) {
        setInt(offset + i * 0x19, "uint16", 0x0, {
          bigEndian: true,
          binary: itemInt.binary,
        });
      }
    }
  }
}

export function generateChecksum(
  item: ItemChecksum,
  dataView?: DataView,
): bigint {
  const [checksum1, checksum2] = generateRareChecksum(item, dataView);

  const high = checksum1.toString(16).padStart(8, "0").slice(-8);
  const low = checksum1.xor(checksum2).toString(16).padStart(8, "0").slice(-8);

  return BigInt(`0x${high}${low}`);
}

export function beforeSaving(): ArrayBufferLike {
  return byteswapDataView("eep").buffer;
}
