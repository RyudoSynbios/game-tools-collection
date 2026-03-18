import { get } from "svelte/store";

import { gameRegion } from "$lib/stores";
import { bitToOffset, getInt, setInt } from "$lib/utils/bytes";
import { formatChecksum } from "$lib/utils/checksum";
import { byteswapDataView, getHeaderShift } from "$lib/utils/common/nintendo64";

import type {
  Item,
  ItemBitflag,
  ItemBitflags,
  ItemChecksum,
  ItemInt,
} from "$lib/types";

export function initHeaderShift(dataView: DataView): number {
  return getHeaderShift(dataView, "eep");
}

export function beforeInitDataView(dataView: DataView): DataView {
  return byteswapDataView("eep", dataView);
}

export function overrideParseItem(item: Item): Item {
  const $gameRegion = get(gameRegion);

  if ("id" in item && item.id?.match(/time-/) && $gameRegion !== 0) {
    const itemInt = item as ItemInt;

    const [, type] = item.id.split("-");

    if (type === "25") {
      itemInt.operations![0] = { "/": 30 };
    } else if (type === "50") {
      itemInt.operations![0] = { "/": 60 };
    }

    return itemInt;
  } else if ("id" in item && item.id === "language") {
    const itemInt = item as ItemInt;

    itemInt.hidden = $gameRegion !== 0;

    return itemInt;
  }

  return item;
}

export function overrideGetInt(item: Item): [boolean, number | undefined] {
  if ("id" in item && item.id === "mechaMarathon") {
    const itemInt = item as ItemInt;

    const unit = getInt(itemInt.offset, "uint8");
    const decimal = getInt(itemInt.offset + 0x1, "uint8");

    let yards = unit + decimal / 100;

    if (yards === 0) {
      yards = 20;
    }

    return [true, yards];
  } else if ("id" in item && item.id === "driversEd") {
    const itemInt = item as ItemInt;

    const time = getInt(itemInt.offset, "uint16", { bigEndian: true });

    let minute = 0;

    if (time === 0) {
      minute = 1;
    }

    return [true, minute];
  }

  return [false, undefined];
}

export function overrideSetInt(
  item: Item,
  value: string,
  flag: ItemBitflag,
): boolean {
  if ("id" in item && item.id?.match(/minigames-/)) {
    const [, type] = item.id.split("-");

    if (type === "played" && !value) {
      setInt(flag.offset + 0x9, "bit", 0, { bit: flag.bit });
    } else if (type === "bought" && value) {
      setInt(flag.offset - 0x9, "bit", 1, { bit: flag.bit });
    }

    setInt(flag.offset, "bit", value, { bit: flag.bit });

    return true;
  } else if ("id" in item && item.id === "mechaMarathon") {
    const itemInt = item as ItemInt;

    const yards = parseFloat(value);

    const unit = Math.floor(yards);
    const decimal = (yards - unit) * 100;

    setInt(itemInt.offset, "uint8", unit);
    setInt(itemInt.offset + 0x1, "uint8", decimal);

    return true;
  } else if ("id" in item && item.id === "driversEd") {
    const itemInt = item as ItemInt;

    const minute = parseInt(value);

    let time = 0;

    if (minute === 0) {
      time = 1;
    }

    setInt(itemInt.offset, "uint16", time, { bigEndian: true });

    return true;
  }

  return false;
}

export function afterSetInt(item: Item, flag: ItemBitflag): void {
  if ("id" in item && item.id?.match(/boardPlayed-/)) {
    const itemInt = item as ItemInt;

    const [index, shift] = item.id.splitInt();

    let offset = itemInt.offset - shift;

    let count = 0;

    for (let i = 0x0; i < 0x6; i += 0x1) {
      count += getInt(offset + i, "uint8");
    }

    setInt(offset - 0x2, "uint16", count, { bigEndian: true });

    offset += 0x48 - index * 0x8 + bitToOffset(5 + index);

    setInt(offset, "bit", count > 0 ? 1 : 0, { bit: (index + 5) % 8 });
  } else if ("id" in item && item.id?.match(/minigames-/)) {
    const itemBitflags = item as ItemBitflags;

    const [shift] = item.id.splitInt();

    const offset = itemBitflags.flags[0].offset - shift + 0x9;

    let count = 0;

    for (let i = 0x0; i < 0x7; i += 0x1) {
      count += getInt(offset + i, "uint8").toBitCount();
    }

    setInt(offset - 0x2, "bit", count >= 50 ? 1 : 0, { bit: 0 });
    setInt(offset + 0x7, "bit", count >= 50 ? 1 : 0, { bit: 0 });
  } else if ("id" in item && item.id === "world") {
    const itemInt = item as ItemInt;

    const world = getInt(itemInt.offset, "uint8");

    setInt(itemInt.offset + 0xe, "uint8", world + 0x1);
  }
}

export function generateChecksum(item: ItemChecksum): number {
  let checksum = 0x0;

  for (let i = item.control.offsetStart; i < item.control.offsetEnd; i += 0x1) {
    checksum += getInt(i, "uint8");
  }

  return formatChecksum(checksum, item.dataType);
}

export function beforeSaving(): ArrayBufferLike {
  return byteswapDataView("eep").buffer;
}
