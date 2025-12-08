import { get } from "svelte/store";

import { fileHeaderShift, gameRegion } from "$lib/stores";
import { getInt, setInt } from "$lib/utils/bytes";
import { formatChecksum } from "$lib/utils/checksum";
import { getHeaderShift } from "$lib/utils/common/gameBoyAdvance";
import { getItem, updateResources } from "$lib/utils/parser";

import type {
  Item,
  ItemBitflag,
  ItemBitflags,
  ItemChecksum,
  ItemContainer,
  ItemInt,
  ItemMessage,
  ItemString,
  ItemTab,
  Resource,
} from "$lib/types";

import {
  japanParseContainerAdaptater,
  japanParseItemAdaptater,
} from "./utils/japan";
import { chapterList, characterList, supportList } from "./utils/resource";

export function initHeaderShift(dataView: DataView): number {
  return getHeaderShift(dataView);
}

export function overrideParseItem(item: Item): Item | ItemTab {
  const $fileHeaderShift = get(fileHeaderShift);
  const $gameRegion = get(gameRegion);

  if ("id" in item && item.id === "message") {
    const itemMessage = item as ItemMessage;

    itemMessage.hidden = getInt($fileHeaderShift + 0x9a, "uint8") === 0xff;

    return itemMessage;
  } else if ("id" in item && item.id?.match(/^name/) && $gameRegion === 1) {
    const itemString = item as ItemString;

    itemString.regex = "[ !&,\-./0-9:?A-Za-z]";

    return itemString;
  } else if ("id" in item && item.id === "linkArena") {
    const itemTab = item as ItemTab;

    const checksum = getInt($fileHeaderShift + 0x67d0, "uint32");

    itemTab.disabled = checksum === 0xffffffff;

    return itemTab;
  } else if ("id" in item && item.id?.match(/soundRoomGallery-/)) {
    const itemBitflags = item as ItemBitflags;

    const [region] = item.id.splitInt();

    if (region === $gameRegion) {
      itemBitflags.hidden = false;
    }

    return itemBitflags;
  }

  return japanParseItemAdaptater(item);
}

export function overrideParseContainerItemsShifts(
  item: ItemContainer,
  shifts: number[],
  index: number,
): [boolean, number[] | undefined] {
  const $fileHeaderShift = get(fileHeaderShift);

  if (item.id === "slots") {
    const int = getInt($fileHeaderShift + 0x64 + index * 0x10, "uint32");

    if (int !== 0x11217) {
      return [true, [-1]];
    }
  }

  return japanParseContainerAdaptater(item, shifts, index);
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
  } else if ("id" in item && item.id === "experience") {
    const itemInt = item as ItemInt;

    const level = getInt(itemInt.offset - 0x1, "uint16", {
      binary: {
        bitStart: 7,
        bitLength: 5,
      },
    });

    itemInt.disabled = level === 20;
  } else if ("id" in item && item.id?.match(/support-/)) {
    const itemInt = item as ItemInt;

    const [index] = item.id.splitInt();

    const characterIndex = getInt(itemInt.offset - 0x9 - index, "uint8") - 0x1;

    itemInt.hidden = true;

    const characterSupport = supportList.find(
      (support) => support.character === characterIndex,
    );

    if (!characterSupport) {
      return itemInt;
    }

    const characterSupportIndex = characterSupport.supports[index];

    if (characterSupportIndex !== undefined) {
      const character = characterList.find(
        (character) => character.index === characterSupportIndex,
      );

      itemInt.name = character!.name;
      itemInt.hidden = false;
    }

    return itemInt;
  } else if ("id" in item && item.id?.match(/statsChapter-/)) {
    const itemInt = item as ItemInt;

    const [index] = item.id.splitInt();

    const offset = itemInt.offset - 0xca5 - index * 0x4;

    const characterIndex = getInt(offset, "uint8");

    const turns = getInt(itemInt.offset, "uint16", {
      binary: {
        bitStart: 7,
        bitLength: 9,
      },
    });

    if (turns === 0) {
      itemInt.resource = "emptyChapters";
    } else {
      switch (characterIndex) {
        case 0x1:
          itemInt.resource = "lynChapters";
          break;
        case 0x2:
          itemInt.resource = "lynEliwoodChapters";
          break;
        case 0x3:
          itemInt.resource = "lynHectorChapters";
          break;
      }
    }

    itemInt.disabled = turns === 0;

    return itemInt;
  } else if ("id" in item && item.id === "statsChapterPlaytime") {
    const itemInt = item as ItemInt;

    const turns = getInt(itemInt.offset - 0x2, "uint16", {
      binary: {
        bitStart: 7,
        bitLength: 9,
      },
    });

    itemInt.disabled = turns === 0;

    return itemInt;
  }

  return item;
}

export function overrideGetInt(item: Item): [boolean, number | undefined] {
  if ("id" in item && item.id?.match(/experience|statsChapter/)) {
    const itemInt = item as ItemInt;

    if (itemInt.disabled) {
      return [true, 0x0];
    }
  }

  return [false, undefined];
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
  } else if ("id" in item && item.id?.match(/-character-/)) {
    const itemInt = item as ItemInt;

    const [slotIndex] = item.id.splitInt();

    const characterIndex = getInt(itemInt.offset, "uint8");

    const character = characterList.find(
      (character) => character.index + 0x1 === characterIndex,
    );

    if (character) {
      for (let i = 0x0; i < 0x8; i += 0x1) {
        setInt(itemInt.offset + 0x1 + i, "uint8", character.weaponLevels[i]);
      }
    }

    updateCharacterNames(slotIndex);
  } else if ("id" in item && item.id === "level") {
    const itemInt = item as ItemInt;

    const level = getInt(itemInt.offset, "uint16", { binary: itemInt.binary });

    let experience = 0x0;

    if (level === 20) {
      experience = 0xff;
    }

    setInt(itemInt.offset + 0x1, "uint16", experience, {
      binary: {
        bitStart: 4,
        bitLength: 7,
      },
    });
  } else if ("id" in item && item.id === "bhScore") {
    const itemInt = item as ItemInt;

    const score = getInt(itemInt.offset, "uint16", { binary: itemInt.binary });

    setInt(itemInt.offset, "bit", score > 0 ? 1 : 0, { bit: 6 });
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

export function getCharacterNames(slotIndex: number): Resource {
  if (typeof slotIndex === "string") {
    return {};
  }

  const names: Resource = {};

  const itemInt = getItem(`slot-${slotIndex}-party-character-0`) as ItemInt;

  [...Array(44).keys()].forEach((index) => {
    const characterIndex = getInt(itemInt.offset + index * 0x24, "uint8");

    const character = characterList.find(
      (character) => character.index + 0x1 === characterIndex,
    );

    if (character) {
      names[index] = character.name;
    }
  });

  return names;
}

export function onSlotChange(slotIndex: number): void {
  if ([0, 4].includes(slotIndex)) {
    return;
  }

  slotIndex -= 1;

  updateCharacterNames(slotIndex);
}

export function updateCharacterNames(slotIndex: number): void {
  const values = getCharacterNames(slotIndex);

  updateResources("characterNames", values);
}
