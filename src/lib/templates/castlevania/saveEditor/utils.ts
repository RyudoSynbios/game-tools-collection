import { get } from "svelte/store";

import { gameRegion, gameTemplate } from "$lib/stores";
import { getInt, setInt } from "$lib/utils/bytes";
import { formatChecksum } from "$lib/utils/checksum";
import { byteswapDataView, getHeaderShift } from "$lib/utils/common/nintendo64";
import {
  getMpkNoteShift,
  getRegionsFromMpk,
  isMpk,
  isUnpackedMpk,
  repackMpk,
  resetMpk,
  unpackMpk,
} from "$lib/utils/common/nintendo64/mpk";
import { isSrmMpk } from "$lib/utils/common/nintendo64/srm";
import { clone } from "$lib/utils/format";
import { getRegions } from "$lib/utils/validator";

import type {
  Item,
  ItemChecksum,
  ItemContainer,
  ItemInt,
  ItemSection,
} from "$lib/types";

import { items } from "./utils/resource";

export function initHeaderShift(dataView: DataView): number {
  const format = isSrmMpk(dataView) ? "mpk" : "eep";

  return getHeaderShift(dataView, format);
}

export function beforeInitDataView(
  dataView: DataView,
  shift: number,
): DataView {
  if (isMpk(dataView, shift)) {
    return unpackMpk(dataView, shift);
  }

  return byteswapDataView("eep", dataView);
}

export function overrideGetRegions(
  dataView: DataView,
  shift: number,
): string[] {
  const $gameTemplate = get(gameTemplate);

  if (isUnpackedMpk()) {
    return getRegionsFromMpk();
  } else {
    const itemContainer = $gameTemplate.items[0] as ItemContainer;
    const itemSection = itemContainer.items[0] as ItemSection;
    const itemChecksum = clone(itemSection.items[0]) as ItemChecksum;

    itemChecksum.offset += shift + 0x8;
    itemChecksum.control.offsetStart += shift + 0x10;
    itemChecksum.control.offsetEnd += shift + 0xc;

    if (dataView.byteLength < itemChecksum.control.offsetEnd) {
      return [];
    }

    const checksum = generateChecksum(itemChecksum, dataView);

    if (
      checksum ===
      getInt(itemChecksum.offset, "uint32", { bigEndian: true }, dataView)
    ) {
      return getRegions(dataView, shift);
    }

    return [];
  }
}

export function onInitFailed(): void {
  resetMpk();
}

export function initShifts(shifts: number[]): number[] {
  const $gameRegion = get(gameRegion);

  if (isUnpackedMpk()) {
    return getMpkNoteShift();
  } else if ($gameRegion === 2) {
    return [...shifts, 0x10];
  }

  return shifts;
}

export function overrideParseItem(item: Item): Item {
  const $gameRegion = get(gameRegion);

  if ($gameRegion !== 0) {
    if ("id" in item && item.id?.match(/checksum/)) {
      const itemChecksum = item as ItemChecksum;

      itemChecksum.offset -= 0x8;
      itemChecksum.control.offsetEnd -= 0x4;
    } else if ("offset" in item) {
      if (item.offset >= 0x58 && item.offset < 0x200) {
        item.offset -= 0x4;
      }
    }
  }

  if ("id" in item && item.id === "slots" && $gameRegion === 2) {
    const itemContainer = item as ItemContainer;

    itemContainer.instances = 1;
  } else if ("id" in item && item.id === "time" && $gameRegion !== 0) {
    const itemInt = item as ItemInt;

    itemInt.operations![0] = { "/": 60 };

    return itemInt;
  } else if ("id" in item && item.id === "usaExclude") {
    const itemInt = item as ItemInt;

    itemInt.hidden = $gameRegion === 1;

    return itemInt;
  } else if ("id" in item && item.id === "usaOnly") {
    const itemInt = item as ItemInt;

    itemInt.hidden = $gameRegion !== 1;

    return itemInt;
  } else if ("id" in item && item.id === "language") {
    const itemInt = item as ItemInt;

    itemInt.hidden = $gameRegion !== 0;

    return itemInt;
  }

  return item;
}

export function overrideGetInt(item: Item): [boolean, number | undefined] {
  if ("id" in item && item.id === "location") {
    const itemInt = item as ItemInt;

    let int = getInt(itemInt.offset, "uint16", { bigEndian: true }) << 0x8;
    int |= getInt(itemInt.offset + 0x4, "uint16", { bigEndian: true });

    return [true, int];
  }

  return [false, undefined];
}

export function overrideSetInt(item: Item, value: string): boolean {
  const $gameRegion = get(gameRegion);

  if ("id" in item && item.id === "location") {
    const itemInt = item as ItemInt;

    const int = parseInt(value);

    const location = int >> 0x8;
    const whiteJewel = int & 0xff;

    setInt(itemInt.offset, "uint16", location, { bigEndian: true });
    setInt(itemInt.offset + 0x4, "uint16", whiteJewel, { bigEndian: true });

    let isWhiteJewelSave = 1;

    if (location === 0 && whiteJewel === 0) {
      isWhiteJewelSave = 0;
    }

    const offset = itemInt.offset - ($gameRegion === 1 ? 0x69 : 0x6d);

    setInt(offset, "bit", isWhiteJewelSave, { bit: 0 });

    return true;
  }

  return false;
}

export function afterSetInt(item: Item): void {
  const $gameRegion = get(gameRegion);

  if ("id" in item && item.id?.match(/items-/)) {
    const itemInt = item as ItemInt;

    const [section, index] = item.id.splitInt();

    const character = getInt(itemInt.offset - index - 0xf, "uint16", {
      bigEndian: true,
    });
    const checked = getInt(itemInt.offset, "uint8");

    let offset = itemInt.offset - index - ($gameRegion === 1 ? 0x67 : 0x6b);

    const itemRef = items[section].items.find((ref) => ref.index === index);

    if (itemRef?.flags) {
      const [flag1, flag2] = itemRef.flags;

      if ([0, 1, 2].includes(index)) {
        const shift1 = index === 1 && $gameRegion === 1 ? 1 - character : 0x0;
        const shift2 = index === 1 && $gameRegion === 1 ? character : 0x0;

        setInt(offset + flag1.offset + shift1, "bit", checked, {
          bit: flag1.bit,
        });

        if (checked) {
          setInt(offset + flag2.offset, "bit", 1, {
            bit: flag2.bit + shift2,
          });
        }
      } else {
        const used = getInt(offset + flag2.offset, "bit", { bit: flag2.bit });

        setInt(offset + flag1.offset, "bit", used ? 0x1 : checked, {
          bit: flag1.bit,
        });
      }
    }
  }
}

export function generateChecksum(
  item: ItemChecksum,
  dataView?: DataView,
): number {
  let checksum = 0x0;

  const increment = item.id === "checksum1" ? 0x1 : 0x4;

  for (
    let i = item.control.offsetStart;
    i < item.control.offsetEnd;
    i += increment
  ) {
    if (item.id === "checksum1") {
      checksum += getInt(i, "uint8", {}, dataView);
    } else {
      checksum ^= getInt(i, "uint32", { bigEndian: true }, dataView);
    }
  }

  return formatChecksum(checksum, item.dataType);
}

export function beforeSaving(): ArrayBufferLike {
  if (isUnpackedMpk()) {
    return repackMpk();
  }

  return byteswapDataView("eep").buffer;
}

export function onReset(): void {
  resetMpk();
}
