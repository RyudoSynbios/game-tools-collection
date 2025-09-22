import { get } from "svelte/store";

import { fileHeaderShift, gameRegion } from "$lib/stores";
import { byteswap, getInt, getString, setInt } from "$lib/utils/bytes";
import { formatChecksum } from "$lib/utils/checksum";
import { getHeaderShift } from "$lib/utils/common/gameBoyAdvance";

import {
  Item,
  ItemBitflag,
  ItemBitflags,
  ItemChecksum,
  ItemContainer,
  ItemInt,
  ItemString,
} from "$lib/types";

import { itemQuantites } from "./utils/resource";

export function initHeaderShift(dataView: DataView): number {
  return getHeaderShift(dataView);
}

export function beforeInitDataView(
  dataView: DataView,
  fileHeaderShift: number,
): DataView {
  return byteswap(dataView, fileHeaderShift, undefined, 0x8);
}

export function overrideParseItem(item: Item): Item {
  const $gameRegion = get(gameRegion);

  if ("id" in item && item.id === "name" && $gameRegion === 2) {
    const itemString = item as ItemString;

    itemString.regex = undefined;
    itemString.resource = "letters";

    return itemString;
  } else if ("id" in item && item.id === "usaShift" && $gameRegion === 1) {
    const itemBitflags = item as ItemBitflags;

    itemBitflags.flags = itemBitflags.flags.reduce(
      (flags: ItemBitflag[], flag) => {
        let shiftBit = 0;

        if (
          (flag.offset === 0x303 && flag.bit === 3) ||
          (flag.offset === 0x303 && flag.bit === 4) ||
          (flag.offset === 0x310 && flag.bit === 0)
        ) {
          shiftBit = 1;
        } else if (
          (flag.offset === 0x30b && flag.bit === 4) ||
          (flag.offset === 0x311 && flag.bit === 1) ||
          (flag.offset === 0x312 && flag.bit === 2)
        ) {
          shiftBit = 2;
        } else if (flag.offset === 0x315 && flag.bit === 5) {
          shiftBit = 3;
        }

        flags.push({
          ...flag,
          offset: flag.offset + Math.floor((flag.bit + shiftBit) / 0x8),
          bit: (flag.bit + shiftBit) % 8,
        });

        return flags;
      },
      [],
    );

    return itemBitflags;
  }

  return item;
}

export function overrideParseContainerItemsShifts(
  item: ItemContainer,
  shifts: number[],
  index: number,
): [boolean, number[] | undefined] {
  const $fileHeaderShift = get(fileHeaderShift);

  if (item.id === "slots") {
    const offset = $fileHeaderShift + 0x34 + index * 0x10;

    const magic = getString(offset, 0x4, "uint8");

    if (magic !== "3ZCM") {
      return [true, [-1]];
    }
  }

  return [false, undefined];
}

export function overrideItem(item: Item): Item {
  if ("id" in item && item.id?.match(/value-/)) {
    const itemInt = item as ItemInt;

    const [, type] = item.id.split("-");

    const { shift, valuesMax } = itemQuantites[type];

    const upgrade = getInt(itemInt.offset + shift, "uint8");

    itemInt.max = valuesMax[upgrade];
  } else if ("id" in item && item.id === "health") {
    const itemInt = item as ItemInt;

    const maxHealth = getInt(itemInt.offset + 0x1, "uint8", {
      operations: itemInt.operations,
    });

    itemInt.max = maxHealth;
  } else if ("id" in item && item.id?.match(/charmDuration-/)) {
    const itemInt = item as ItemInt;

    const [shift] = item.id.splitInt();

    const charm = getInt(itemInt.offset - shift, "uint8");

    itemInt.disabled = charm === 0;

    return itemInt;
  } else if ("id" in item && item.id === "kinstonePieceQuantity") {
    const itemInt = item as ItemInt;

    const piece = getInt(itemInt.offset - 0x13, "uint8");

    itemInt.disabled = piece === 0;

    return itemInt;
  }

  return item;
}

export function overrideGetInt(
  item: Item,
): [boolean, number | string | undefined] {
  if ("id" in item && item.id?.match(/charmDuration-/)) {
    const itemInt = item as ItemInt;

    if (itemInt.disabled) {
      return [true, 0x0];
    }
  } else if ("id" in item && item.id === "kinstonePieceQuantity") {
    const itemInt = item as ItemInt;

    if (itemInt.disabled) {
      return [true, 0x0];
    }
  }

  return [false, undefined];
}

export function afterSetInt(item: Item, flag: ItemBitflag): void {
  if ("id" in item && item.id?.match(/max-/)) {
    const itemInt = item as ItemInt;

    const [, type] = item.id.split("-");

    const { shift, dataType, valuesMax } = itemQuantites[type];

    let value = getInt(itemInt.offset - shift, dataType);

    const upgrade = getInt(itemInt.offset, "uint8");

    value = Math.min(value, valuesMax[upgrade]);

    setInt(itemInt.offset - shift, dataType, value);
  } else if ("id" in item && item.id === "maxHealth") {
    const itemInt = item as ItemInt;

    let health = getInt(itemInt.offset - 0x1, "uint8");
    const maxHealth = getInt(itemInt.offset, "uint8");

    health = Math.min(health, maxHealth);

    setInt(itemInt.offset - 0x1, "uint8", health);
  } else if ("id" in item && item.id?.match(/bottle-/)) {
    const itemInt = item as ItemInt;

    const [shift] = item.id.splitInt();

    const bottle = getInt(itemInt.offset, "uint8");

    const offset = itemInt.offset - shift + 0x43;
    const bit = shift * 2;

    setInt(offset, "bit", bottle !== 0x0 ? 1 : 0, { bit });
  } else if ("id" in item && item.id === "kinstonePiece") {
    const itemInt = item as ItemInt;

    const piece = getInt(itemInt.offset, "uint8");
    const quantity = getInt(itemInt.offset + 0x13, "uint8");

    if (piece !== 0x0 && quantity === 0x0) {
      setInt(itemInt.offset + 0x13, "uint8", 0x1);
    } else if (piece === 0x0) {
      setInt(itemInt.offset + 0x13, "uint8", 0x0);
    }
  } else if ("id" in item && item.id?.match(/figurines-/)) {
    const itemBitflags = item as ItemBitflags;

    const [shift] = item.id.splitInt();

    const offset = itemBitflags.flags[0].offset - shift;

    let count = 0;

    for (let i = 0x0; i < 0x12; i += 0x1) {
      count += getInt(offset + i, "uint8").toBitCount();
    }

    setInt(offset - 0x1e, "uint8", count);
  } else if ("id" in item && item.id === "kinstoneFusions") {
    const itemBitflags = item as ItemBitflags;

    const offset = itemBitflags.flags[0].offset - 0x3;

    let count = 0;

    for (let i = 0x0; i < 0xd; i += 0x1) {
      count += getInt(offset + i, "uint8").toBitCount();
    }

    setInt(offset - 0x12a, "uint8", count);
  } else if ("id" in item && item.id === "hiddenEvents") {
    const itemBitflags = item as ItemBitflags;

    const checked = getInt(flag.offset, "bit", { bit: flag.bit });

    const index = itemBitflags.flags.findIndex(
      (item) => item.offset === flag.offset && item.bit === flag.bit,
    );

    const hiddenFlag = itemBitflags.flags[index + 1];

    if (hiddenFlag.hidden) {
      setInt(hiddenFlag.offset, "bit", checked, { bit: hiddenFlag.bit });
    }
  }
}

export function generateChecksum(item: ItemChecksum): number {
  let checksum = 0xa778;

  let j = item.control.offsetEnd - item.control.offsetStart;

  for (
    let i = item.control.offsetStart;
    i < item.control.offsetEnd;
    i += 0x2, j -= 0x2
  ) {
    checksum += getInt(i, "uint16") ^ j;
  }

  checksum = (-checksum << 0x10) | (checksum & 0xffff);

  return formatChecksum(checksum, item.dataType);
}

export function beforeSaving(): ArrayBufferLike {
  const $fileHeaderShift = get(fileHeaderShift);

  return byteswap(undefined, $fileHeaderShift, undefined, 0x8).buffer;
}
