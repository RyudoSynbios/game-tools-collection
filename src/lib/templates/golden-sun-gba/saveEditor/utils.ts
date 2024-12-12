import { get } from "svelte/store";

import { fileHeaderShift } from "$lib/stores";
import { extractBit, getInt, getString, setInt } from "$lib/utils/bytes";
import { formatChecksum } from "$lib/utils/checksum";
import { getHeaderShift } from "$lib/utils/common/gameBoyAdvance";
import { getItem, getShift, updateResources } from "$lib/utils/parser";

import type {
  Item,
  ItemBitflag,
  ItemChecksum,
  ItemContainer,
  ItemInt,
  ItemString,
  Resource,
} from "$lib/types";

export function initHeaderShift(dataView: DataView): number {
  return getHeaderShift(dataView);
}

export function overrideShift(item: Item, shifts: number[]): number[] {
  const $fileHeaderShift = get(fileHeaderShift);

  if (
    "id" in item &&
    (item.id === "checksumSection2" ||
      item.id?.match(/playTimeSection2-/) ||
      item.id?.match(/position-/))
  ) {
    const itemInt = item as ItemInt;

    let offset = getShift(shifts);

    if (item.id === "checksumSection2") {
      offset += itemInt.offset - 0x1;
    } else if (item.id.match(/playTimeSection2-/)) {
      offset += itemInt.offset - 0x109;
    } else if (item.id.match(/position-x/)) {
      offset += itemInt.offset - 0x137;
    } else if (item.id.match(/position-y/)) {
      offset += itemInt.offset - 0x13f;
    }

    const index = getInt(offset, "uint8") + 0x3;

    if (index <= 5) {
      for (let i = 0x0; i < 0x1000 * 0x10; i += 0x1000) {
        const saveIndex = getInt($fileHeaderShift + i + 0x7, "uint8");

        if (saveIndex === index) {
          return [$fileHeaderShift, i];
        }
      }
    }
  }

  return shifts;
}

export function overrideParseContainerItemsShifts(
  item: ItemContainer,
  shifts: number[],
  index: number,
): [boolean, number[] | undefined] {
  const $fileHeaderShift = get(fileHeaderShift);

  if (item.id === "slots") {
    for (let i = 0x0; i < item.length * 0x10; i += item.length) {
      const saveIndex = getInt($fileHeaderShift + i + 0x7, "uint8");

      if (saveIndex === index) {
        return [true, [...shifts, i]];
      }
    }

    return [true, [-1]];
  }

  return [false, undefined];
}

export function overrideItem(item: Item): Item {
  if ("id" in item && item.id?.match(/formation-/)) {
    const itemInt = item as ItemInt;

    const [index] = item.id.splitInt();

    if (index > 0) {
      const int = getInt(
        itemInt.offset - 0x3f8 - (index - 0x1),
        "uint8",
      ).toBitCount();

      itemInt.disabled = index > int;
    }

    return itemInt;
  }

  return item;
}

export function overrideGetInt(item: Item): [boolean, number | undefined] {
  if ("id" in item && item.id === "formation-0") {
    const itemInt = item as ItemInt;

    const int = getInt(itemInt.offset, "uint8").toBitCount();

    return [true, int];
  } else if ("id" in item && item.id?.match(/formation-/)) {
    const itemInt = item as ItemInt;

    if (itemInt.disabled) {
      return [true, 0xff];
    }
  } else if ("id" in item && item.id === "item") {
    const itemInt = item as ItemInt;

    let int = getInt(itemInt.offset, "uint8");

    if (getInt(itemInt.offset + 0x1, "bit", { bit: 0 })) {
      int += 0x100;
    }

    return [true, int];
  } else if ("id" in item && item.id === "quantity") {
    const itemInt = item as ItemInt;

    let int = 1;

    for (let i = 3; i < 8; i += 1) {
      if (getInt(itemInt.offset, "bit", { bit: i })) {
        int += Math.pow(2, i - 3);
      }
    }

    return [true, int];
  }

  return [false, undefined];
}

export function overrideSetInt(item: Item, value: string): boolean {
  if ("id" in item && item.id === "formation-0") {
    const itemInt = item as ItemInt;

    let int = 0x0;

    for (let i = 0x0; i < parseInt(value); i += 0x1) {
      int = (int << 0x1) + 1;
    }

    setInt(itemInt.offset, "uint8", int);

    return true;
  } else if ("id" in item && item.id === "item") {
    const itemInt = item as ItemInt;

    const int = parseInt(value);

    setInt(itemInt.offset, "uint8", int);
    setInt(itemInt.offset + 0x1, "bit", int >= 0x100 ? 1 : 0, { bit: 0 });

    return true;
  } else if ("id" in item && item.id === "quantity") {
    const itemInt = item as ItemInt;

    let int = parseInt(value);

    int -= 1;

    for (let i = 3; i < 8; i += 1) {
      setInt(itemInt.offset, "bit", extractBit(int, i - 3) === true ? 1 : 0, {
        bit: i,
      });
    }

    return true;
  }

  return false;
}

export function afterSetInt(item: Item, flag: ItemBitflag): void {
  if ("id" in item && item.id?.match(/playTime-/)) {
    const itemInt = item as ItemInt;

    const int = getInt(itemInt.offset, "uint32");

    setInt(itemInt.offset - 0x234, "uint32", int);

    const playTimeSection2 = getItem(
      item.id.replace("playTime-", "playTimeSection2-"),
    ) as ItemInt;

    if (playTimeSection2) {
      setInt(playTimeSection2.offset, "uint32", int);
    }
  } else if ("id" in item && item.id === "gold") {
    const itemInt = item as ItemInt;

    const int = getInt(itemInt.offset, "uint32");

    setInt(itemInt.offset - 0x23c, "uint32", int);
  } else if ("id" in item && item.id?.match(/position-/)) {
    const itemInt = item as ItemInt;

    const camera = getItem(item.id.replace("position", "camera")) as ItemInt;

    if (camera) {
      const int = getInt(itemInt.offset, "uint32");

      setInt(camera.offset, "uint32", int);
    }
  } else if ("id" in item && item.id?.match(/formation-/)) {
    const itemInt = item as ItemInt;

    const [offsetIndex] = item.id.splitInt();

    let offset = 0x0;

    if (offsetIndex === 0) {
      offset = itemInt.offset;
    } else {
      offset = itemInt.offset - 0x3f8 - offsetIndex + 1;
    }

    const characterCount = getInt(offset, "uint8").toBitCount();

    for (let i = 0x0; i < 0x4; i += 0x1) {
      if (i < characterCount) {
        const int = getInt(offset + 0x3f8 + i, "uint8");

        setInt(offset - 0x24 + i, "uint8", int);
      } else {
        setInt(offset - 0x24 + i, "uint8", 0xff);
      }
    }

    updateDjinnPreview(offset + 0x5b8);
  } else if ("id" in item && item.id?.match(/characterName-/)) {
    const [slotIndex] = item.id.splitInt();

    updateCharacterNames(slotIndex);
  } else if ("id" in item && item.id?.match(/level-/)) {
    const itemInt = item as ItemInt;

    const [characterIndex] = item.id.splitInt();

    if (characterIndex === 0) {
      const int = getInt(itemInt.offset, "uint8");

      setInt(itemInt.offset - 0x503, "uint8", int);
    }
  } else if ("id" in item && item.id?.match(/class-/)) {
    const itemInt = item as ItemInt;

    const [characterIndex] = item.id.splitInt();

    if (characterIndex === 0) {
      const int = getInt(itemInt.offset, "uint8");

      setInt(itemInt.offset - 0x61c, "uint8", int);
    }
  } else if ("id" in item && item.id?.match(/djinn-/)) {
    const [characterIndex, elementIndex] = item.id.splitInt();

    const offset =
      flag.offset -
      (flag.offset % 4) -
      characterIndex * 0x14c -
      (elementIndex - 1) * 0x4;

    updateDjinnPreview(offset);
  } else if ("id" in item && item.id?.match(/djinnSet-/)) {
    const [elementIndex] = item.id.splitInt();

    const offset = flag.offset - (flag.offset % 4);

    let int = 0;

    for (let i = 0x0; i < 0x3; i += 0x1) {
      int += getInt(offset + i, "uint8").toBitCount();
    }

    setInt(offset + 0x14 - (elementIndex - 1) * 3, "uint8", int);
  } else if (
    "id" in item &&
    (item.id === "windowColor" || item.id === "windowBrightness")
  ) {
    const itemInt = item as ItemInt;

    const int = getInt(itemInt.offset, "uint8");

    setInt(itemInt.offset - 0x421, "uint8", int);
  }
}

export function generateChecksum(item: ItemChecksum): number {
  let checksum = 0x0;

  for (let i = item.control.offsetStart; i < item.control.offsetEnd; i += 0x1) {
    checksum += getInt(i, "uint8");
  }

  return formatChecksum(checksum, item.dataType);
}

export function updateDjinnPreview(offset: number): void {
  const characterCount = getInt(offset - 0x5b8, "uint8").toBitCount();

  const elements = [0, 0, 0, 0];

  for (let i = 0x0; i < characterCount; i += 0x1) {
    const formation = getInt(offset - 0x1c0 + i, "uint8");

    for (let j = 0x0; j < 0x4; j += 0x1) {
      elements[j] |= getInt(offset + formation * 0x14c + j * 0x4, "uint32");
    }
  }

  setInt(offset - 0x5e0, "uint8", elements[0].toBitCount());
  setInt(offset - 0x5df, "uint8", elements[1].toBitCount());
  setInt(offset - 0x5de, "uint8", elements[2].toBitCount());
  setInt(offset - 0x5dd, "uint8", elements[3].toBitCount());
}

export function getCharacterNames(slotIndex: number): Resource {
  if (typeof slotIndex === "string") {
    return {};
  }

  const names: Resource = {};

  const itemString = getItem(`slot-${slotIndex}-characterName-0`) as ItemString;

  [...Array(8).keys()].forEach((index) => {
    const name = getString(
      itemString.offset + index * 0x14c,
      itemString.length,
      itemString.letterDataType,
      {
        resource: "letters",
      },
    );

    names[index] = name.trim() || "???";
  });

  return names;
}

export function onSlotChange(slotIndex: number): void {
  updateCharacterNames(slotIndex);
}

export function updateCharacterNames(slotIndex: number): void {
  const values = getCharacterNames(slotIndex);

  updateResources("characterNames", values);
}
