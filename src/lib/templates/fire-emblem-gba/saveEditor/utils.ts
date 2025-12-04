import { get } from "svelte/store";

import { fileHeaderShift } from "$lib/stores";
import { byteswap, getInt, setInt } from "$lib/utils/bytes";
import { formatChecksum } from "$lib/utils/checksum";
import { getHeaderShift } from "$lib/utils/common/gameBoyAdvance";
import { getShift } from "$lib/utils/parser";

import type {
  Item,
  ItemBitflag,
  ItemChecksum,
  ItemContainer,
  ItemInt,
  ItemIntCondition,
} from "$lib/types";

import { chapterList } from "./utils/resource";

export function initHeaderShift(dataView: DataView): number {
  return getHeaderShift(dataView);
}

export function overrideParseContainerItemsShifts(
  item: ItemContainer,
  shifts: number[],
  index: number,
): [boolean, number[] | undefined] {
  const $fileHeaderShift = get(fileHeaderShift);

  if (item.id === "slots") {
    const subinstance = item.disableSubinstanceIf as ItemIntCondition;

    const int = getInt($fileHeaderShift + 0x64 + index * 0x10, "uint32");

    if (int !== 0x11217) {
      return [true, [-1]];
    }
  }

  return [false, undefined];
}

export function overrideItem(item: Item): Item {
  if ("id" in item && item.id === "currentChapter") {
    const itemInt = item as ItemInt;

    const characterIndex = getInt(itemInt.offset + 0xd, "uint8");

    switch (characterIndex) {
      case 0x1:
        itemInt.resource = "lynChapters";
        break;
      case 0x2:
        itemInt.resource = "eliwoodChapters";
        break;
      case 0x3:
        itemInt.resource = "hectorChapters";
        break;
    }

    return itemInt;
  }

  return item;
}

export function afterSetInt(item: Item, flag: ItemBitflag): void {
  if ("id" in item && item.id === "taleProgression") {
    const checked = getInt(flag.offset, "bit", { bit: flag.bit });

    // Eliwood's Tale
    if (flag.bit === 2 && !checked) {
      setInt(flag.offset, "bit", 0, { bit: 5 });
    } else if (flag.bit === 5 && checked) {
      setInt(flag.offset, "bit", 1, { bit: 2 });
    }

    // Hector's Tale
    if (flag.bit === 4 && !checked) {
      setInt(flag.offset, "bit", 0, { bit: 7 });
    } else if (flag.bit === 7 && checked) {
      setInt(flag.offset, "bit", 1, { bit: 4 });
    }

    const eliwoodNormal = getInt(flag.offset, "bit", { bit: 2 });
    const hectorNormal = getInt(flag.offset, "bit", { bit: 4 });

    if (eliwoodNormal || hectorNormal) {
      setInt(flag.offset, "bit", 1, { bit: 0 });
    } else {
      setInt(flag.offset, "bit", 0, { bit: 0 });
    }
  } else if ("id" in item && item.id === "mainCharacter") {
    const itemInt = item as ItemInt;

    const characterIndex = getInt(itemInt.offset, "uint8");
    const chapterIndex = getInt(itemInt.offset - 0xd, "uint8");

    const chapter = chapterList.find(
      (chapter) => chapter.index === chapterIndex,
    );

    if (chapter && !chapter.characters.includes(characterIndex)) {
      const firstChapter = chapterList.find((chapter) =>
        chapter.characters.includes(characterIndex),
      );

      setInt(itemInt.offset - 0xd, "uint8", firstChapter!.index);
    }
  }
}

export function generateChecksum(item: ItemChecksum): number {
  let checksum1 = 0x0;
  let checksum2 = 0x0;

  for (let i = item.control.offsetStart; i < item.control.offsetEnd; i += 0x2) {
    checksum1 += getInt(i, "uint16");
    checksum2 ^= getInt(i, "uint16");
  }

  let checksum = 0x0;

  if (item.dataType === "uint16") {
    checksum = checksum1 + checksum2;
  } else if (item.dataType === "uint32") {
    checksum = (checksum1 & 0xffff) | (checksum2 << 0x10);
  }

  return formatChecksum(checksum, item.dataType);
}
