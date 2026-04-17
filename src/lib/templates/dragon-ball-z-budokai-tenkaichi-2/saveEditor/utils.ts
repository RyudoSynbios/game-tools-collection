import { getInt, setInt } from "$lib/utils/bytes";
import {
  customGetRegions,
  getFileOffset,
  repackFile,
  resetState,
  unpackFile,
} from "$lib/utils/common/playstation2";

import { Item, ItemBitflag, ItemChecksum, ItemInt } from "$lib/types";

export function beforeInitDataView(dataView: DataView): DataView {
  return unpackFile(dataView);
}

export function overrideGetRegions(): string[] {
  return customGetRegions();
}

export function onInitFailed(): void {
  resetState();
}

export function initShifts(shifts: number[]): number[] {
  return [...shifts, getFileOffset(0)];
}

export function overrideParseItem(item: Item): Item {
  if ("id" in item && item.id?.match(/ubzCharacter-/)) {
    const itemInt = item as ItemInt;

    const [courseIndex] = item.id.splitInt();

    itemInt.hidden = [3, 6].includes(courseIndex);

    return itemInt;
  } else if ("id" in item && item.id?.match(/ubzCharacterTag-/)) {
    const itemInt = item as ItemInt;

    const [courseIndex] = item.id.splitInt();

    itemInt.hidden = ![3, 6].includes(courseIndex);

    return itemInt;
  } else if ("id" in item && item.id?.match(/controllerVibration-/)) {
    const itemInt = item as ItemInt;

    const [index] = item.id.splitInt();

    if (index === 1) {
      itemInt.bit = 2;
    }

    return itemInt;
  }

  return item;
}

export function overrideItem(item: Item): Item {
  if ("id" in item && item.id?.match(/ubzCharacter/)) {
    const itemInt = item as ItemInt;

    const [, shift] = item.id.splitInt();

    const points = getInt(itemInt.offset + 0x2 - shift, "uint16");

    itemInt.disabled = points === 0;
    itemInt.resource = points > 0 ? "characters" : "empty";

    return itemInt;
  } else if ("id" in item && item.id === "ziExperience") {
    const itemInt = item as ItemInt;

    const zItem = getInt(itemInt.offset - 0x2, "uint16");

    const isMaxLevel = [
      0x0, 0x13, 0x26, 0x39, 0x4c, 0x5f, 0x63, 0x76, 0x89, 0x9c,
    ].includes(zItem);

    itemInt.disabled = isMaxLevel || zItem >= 0x9d;
  }

  return item;
}

export function overrideGetInt(item: Item): [boolean, number | undefined] {
  if ("id" in item && item.id?.match(/ubzCharacter|ziExperience/)) {
    const itemInt = item as ItemInt;

    if (itemInt.disabled) {
      return [true, 0x0];
    }
  }

  return [false, undefined];
}

export function afterSetInt(item: Item, flag: ItemBitflag): void {
  if ("id" in item && item.id === "unlockedCharacters") {
    const unlocked = getInt(flag.offset, "bit", { bit: 0 });

    setInt(flag.offset + 0x2, "uint16", unlocked ? 1 : 0);
  } else if ("id" in item && item.id === "daStatus") {
    const itemInt = item as ItemInt;

    const quantity = getInt(itemInt.offset, "uint16");

    setInt(itemInt.offset - 0x2, "bit", quantity, { bit: 0 });
  } else if ("id" in item && item.id?.match(/zItem-/)) {
    const itemInt = item as ItemInt;

    const quantity = getInt(itemInt.offset, "uint16");

    if (quantity > 0) {
      setInt(itemInt.offset - 0x2, "bit", quantity, { bit: 0 });
    }
  }
}

export function generateChecksum(item: ItemChecksum): bigint {
  let checksum = 0x0;

  for (let i = item.control.offsetStart; i < item.control.offsetEnd; i += 0x2) {
    checksum += getInt(i, "uint16");
  }

  const high = (checksum & 0xff).toHex(8);
  const low = ((checksum >>> 0x8) & 0xff).toHex(8);

  return BigInt(`0x${high}${low}`);
}

export function beforeSaving(): ArrayBufferLike {
  return repackFile();
}

export function onReset(): void {
  resetState();
}
