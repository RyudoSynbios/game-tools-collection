import { get } from "svelte/store";

import { gameRegion, gameTemplate } from "$lib/stores";
import { getInt, setInt } from "$lib/utils/bytes";
import { formatChecksum } from "$lib/utils/checksum";
import { byteswapDataView, getHeaderShift } from "$lib/utils/common/nintendo64";
import { clone } from "$lib/utils/format";

import type {
  Item,
  ItemBitflag,
  ItemBitflagChecked,
  ItemBitflags,
  ItemChecksum,
  ItemInt,
  ItemSection,
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
    getInt(itemChecksum.offset, "uint16", { bigEndian: true }, dataView)
  ) {
    return ["europe_australia", "usa_japan"];
  }

  return [];
}

export function overrideParseItem(item: Item): Item {
  const $gameRegion = get(gameRegion);

  if ("id" in item && item.id === "language") {
    const itemSection = item as ItemSection;

    itemSection.hidden = $gameRegion === 1;

    return itemSection;
  }

  return item;
}

export function overrideItem(item: Item): Item {
  if ("id" in item && (item.id?.match(/planet-/) || item.id?.match(/hits-/))) {
    const itemInt = item as ItemInt;

    const [offset, index] = item.id.splitInt();

    const completedMissions = getInt(offset, "uint8");

    itemInt.disabled = index >= completedMissions;

    return itemInt;
  } else if ("id" in item && item.id?.match(/bitflags-/)) {
    const itemBitflags = item as ItemBitflags;

    const [offset, index] = item.id.splitInt();

    const completedMissions = getInt(offset, "uint8");

    itemBitflags.flags.map((flag) => {
      flag.disabled = index >= completedMissions;
    });

    return itemBitflags;
  }

  return item;
}

export function overrideGetInt(
  item: Item,
): [boolean, ItemBitflagChecked[] | number | undefined] {
  if ("id" in item && item.id?.match(/totalHits-/)) {
    const itemInt = item as ItemInt;

    const [index] = item.id.splitInt();

    const completedMissions = getInt(itemInt.offset + index, "uint8");

    const offset = itemInt.offset + 0x28 + index * 0xe;

    let hits = 0;

    for (let i = 0x0; i < completedMissions; i += 0x1) {
      const int =
        getInt(offset + i * 0x2, "uint8") +
        getInt(offset + i * 0x2 + 0x1, "bit", { bit: 3 }) * 0x100;

      hits += int;
    }

    return [true, hits];
  } else if ("id" in item && item.id?.match(/totalAllies-/)) {
    const itemInt = item as ItemInt;

    const [index] = item.id.splitInt();

    const completedMissions = getInt(itemInt.offset + index, "uint8");

    const offset = itemInt.offset + 0x28 + index * 0xe + 0x1;

    let int = 0;

    for (let i = 0x0; i < completedMissions; i += 0x1) {
      for (let j = 0; j < 3; j += 1) {
        int += getInt(offset + i * 0x2, "bit", { bit: 2 - j }) * 10 ** j;
      }
    }

    return [true, int];
  } else if ("id" in item && item.id?.match(/planet-/)) {
    const itemInt = item as ItemInt;

    if (itemInt.disabled) {
      return [true, 0xff];
    }
  } else if ("id" in item && item.id?.match(/hits-/)) {
    const itemInt = item as ItemInt;

    let int = 0;

    if (!itemInt.disabled) {
      int =
        getInt(itemInt.offset, "uint8") +
        getInt(itemInt.offset + 0x1, "bit", { bit: 3 }) * 0x100;
    }

    return [true, int];
  } else if ("id" in item && item.id?.match(/bitflags-/)) {
    const itemBitflags = item as ItemBitflags;

    const flags = itemBitflags.flags.reduce(
      (flags: ItemBitflagChecked[], flag) => {
        const checked = Boolean(getInt(flag.offset, "bit", { bit: flag.bit }));

        flags.push({
          ...flag,
          checked: flag.disabled ? false : checked,
        });

        return flags;
      },
      [],
    );

    return [true, flags];
  }

  return [false, undefined];
}

export function overrideSetInt(item: Item, value: string): boolean {
  if ("id" in item && item.id?.match(/hits-/)) {
    const itemInt = item as ItemInt;

    const int = parseInt(value);

    setInt(itemInt.offset, "uint8", int);
    setInt(itemInt.offset + 0x1, "bit", int >> 0x8, { bit: 3 });

    return true;
  }

  return false;
}

export function generateChecksum(
  item: ItemChecksum,
  dataView: DataView,
): number {
  let checksum = 0x0;

  for (let i = item.control.offsetStart; i < item.control.offsetEnd; i += 0x1) {
    checksum ^= getInt(i, "uint8", {}, dataView);
    checksum <<= 0x1;
    checksum = (checksum & 0xfe) | ((checksum >> 0x8) & 0x1);
  }

  checksum = (checksum & 0xff) | 0x9500;

  return formatChecksum(checksum, item.dataType);
}

export function beforeSaving(): ArrayBufferLike {
  return byteswapDataView("eep").buffer;
}
