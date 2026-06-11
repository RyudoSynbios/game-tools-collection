import { get } from "svelte/store";

import { fileName } from "$lib/stores";
import {
  checkNextHiddenFlags,
  copyInt,
  getInt,
  getIntFromItem,
  setInt,
} from "$lib/utils/bytes";
import { formatChecksum } from "$lib/utils/checksum";
import { getTime, setTime } from "$lib/utils/common/wii";
import { getPartialValue, makeOperations, round } from "$lib/utils/format";
import { getClosestItem } from "$lib/utils/parser";

import type {
  Item,
  ItemBitflag,
  ItemBitflagChecked,
  ItemBitflags,
  ItemChecksum,
  ItemContainer,
  ItemGroup,
  ItemInt,
  ItemSection,
  ItemTab,
  Resource,
} from "$lib/types";

export function overrideParseItem(item: Item): Item | ItemTab {
  const $fileName = get(fileName);

  if ("id" in item && item.id === "checksum") {
    const itemChecksum = item as ItemChecksum;

    if ($fileName === "advsv0.bin") {
      itemChecksum.offset = 0x4930;
      itemChecksum.control.offsetEnd = 0x4930;
    }

    return itemChecksum;
  } else if ("id" in item && item.id === "main") {
    const itemTab = item as ItemTab;

    itemTab.disabled = $fileName !== "autosv0.bin";

    return itemTab;
  } else if ("id" in item && item.id === "subspaceEmissary") {
    const itemTab = item as ItemTab;

    itemTab.disabled = $fileName !== "advsv0.bin";

    return itemTab;
  } else if ("id" in item && item.id === "slots") {
    const itemContainer = item as ItemContainer;

    const slots = getAdventureSlots();

    itemContainer.instances = slots.length || 1;

    return itemContainer;
  }

  return item;
}

export function overrideParseContainerItemsShifts(
  item: ItemContainer,
  shifts: number[],
  index: number,
): [boolean, number[] | undefined] {
  if (item.id === "slots") {
    const slots = getAdventureSlots();

    if (slots.length === 0) {
      return [true, [-1]];
    }

    return [true, [slots[index] * item.length]];
  }

  return [false, undefined];
}

export function overrideItem(item: Item): Item {
  if ("id" in item && item.id?.match(/-(count|group)$/)) {
    const itemInt = item as ItemInt;

    const [, type] = item.id.split("-");

    const progression = getClosestItem(/switch-progression/, item) as ItemInt;

    const int = getInt(progression.offset, "bit", { bit: progression.bit });

    if (type === "count" && int === 0x1) {
      itemInt.hidden = true;
    } else if (type === "group" && int === 0x0) {
      itemInt.hidden = true;
    } else {
      itemInt.hidden = false;
    }

    return itemInt;
  } else if ("id" in item && item.id?.match(/character-/)) {
    const itemInt = item as ItemInt;

    const [type] = item.id.splitInt();

    const itemGroup = item.parent as ItemGroup;
    const itemType = itemGroup.parent as ItemSection | ItemTab;
    const itemProgression = itemType.items[0] as ItemInt;

    const cleared = getIntFromItem(itemProgression) > 0;

    if (type === 0) {
      itemInt.resource = cleared ? "characters" : "empty";
    }

    itemInt.disabled = !cleared;

    return itemInt;
  }

  return item;
}

export function overrideGetInt(
  item: Item,
): [boolean, number | ItemBitflagChecked[] | undefined] {
  if ("id" in item && item.id === "targetSmashLevel") {
    const itemInt = item as ItemInt;

    const flags = getInt(itemInt.offset, "uint8");

    let int = 1;

    for (let i = 0; i < 4; i += 1) {
      if (flags >> (i * 2)) {
        int = i + 2;
      }
    }

    return [true, int];
  } else if ("id" in item && item.id?.match(/eventProgression-/)) {
    const itemInt = item as ItemInt;

    const [difficulty, index] = item.id.splitInt();

    const eventsItem = getClosestItem("unlockedEvents", item) as ItemInt;

    const unlockedEvents = getInt(eventsItem.offset, "uint8");

    if (index >= unlockedEvents) {
      return [true, 0x0];
    }

    const difficultyCleared = getInt(itemInt.offset, "uint8", {
      binary: itemInt.binary,
    });

    let progression = 0x1;

    if (difficultyCleared === difficulty + 0x1) {
      progression = 0x2;
    }

    return [true, progression];
  } else if ("id" in item && item.id?.match(/character/)) {
    const itemInt = item as ItemInt;

    const [type] = item.id.splitInt();

    if (itemInt.disabled) {
      return [true, type];
    }
  } else if ("id" in item && item.id?.match(/challenge-/)) {
    const itemBitflags = item as ItemBitflags;

    const [, type] = item.id.split("-");

    const flags = itemBitflags.flags.map((flag) => {
      const int = getInt(flag.offset, "uint8");

      return {
        ...flag,
        checked: type === "revealed" ? int > 0x0 : int === 0x2,
      };
    });

    return [true, flags];
  } else if ("id" in item && item.id === "hitPercentage") {
    const itemInt = item as ItemInt;

    let percent = 0;

    const hitsLanded = getInt(itemInt.offset, "uint32", {
      bigEndian: true,
    });
    const total = getInt(itemInt.offset + 0x4, "uint32", { bigEndian: true });

    if (total > 0x0 && hitsLanded <= total) {
      percent = round((hitsLanded / total) * 100, 2);
    }

    return [true, percent];
  } else if ("id" in item && item.id?.match(/playtime-/)) {
    const itemInt = item as ItemInt;

    const playtime = getTime(itemInt.offset);

    const int = makeOperations(playtime, itemInt.operations);

    return [true, int];
  }

  return [false, undefined];
}

export function overrideSetInt(
  item: Item,
  value: string,
  flag: ItemBitflag,
): boolean {
  if ("id" in item && item.id === "targetSmashLevel") {
    const itemInt = item as ItemInt;

    const int = parseInt(value);

    for (let i = 0; i < 4; i += 1) {
      setInt(itemInt.offset, "bit", i + 1 < int ? 1 : 0, { bit: i * 2 });
    }

    return true;
  } else if ("id" in item && item.id?.match(/eventProgression-/)) {
    const itemInt = item as ItemInt;

    const [difficulty, index] = item.id.splitInt();

    let progression = parseInt(value);

    const eventsItem = getClosestItem("unlockedEvents", item) as ItemInt;

    const unlockedEvents = getInt(eventsItem.offset, "uint8");

    if (progression && index >= unlockedEvents) {
      setInt(eventsItem.offset, "uint8", index + 0x1);
    } else if (!progression) {
      setInt(eventsItem.offset, "uint8", index);
    }

    if (progression === 0x2) {
      progression = difficulty + 0x1;
    } else {
      progression = 0x0;
    }

    setInt(itemInt.offset, "uint8", progression, {
      binary: itemInt.binary,
    });

    return true;
  } else if ("id" in item && item.id?.match(/challenge-/)) {
    const [, type] = item.id.split("-");

    let int = 0x0;

    if (value) {
      int = type === "revealed" ? 0x1 : 0x2;
    } else if (!value && type === "unlocked") {
      int = 0x1;
    }

    setInt(flag.offset, "uint8", int);

    return true;
  } else if ("id" in item && item.id?.match(/playtime-/)) {
    const itemInt = item as ItemInt;

    const [shift] = item.id.splitInt();

    const oldInt = getTime(itemInt.offset);

    let int = makeOperations(parseInt(value), itemInt.operations, true);
    int = getPartialValue(oldInt, int, itemInt.operations!);

    setTime(itemInt.offset, int);

    setInt(itemInt.offset - shift, "uint32", int * 60, { bigEndian: true });

    return true;
  }

  return false;
}

export function afterSetInt(item: Item, flag: ItemBitflag): void {
  if ("id" in item && item.id?.match(/switch-progression/)) {
    const itemInt = item as ItemInt;

    const [, , type] = item.id.split("-");
    const [index] = item.id.splitInt();

    const switchItem = getClosestItem("switch-count", item) as ItemInt;

    setInt(switchItem.offset, "uint32", 0x0, { bigEndian: true });

    if (!type) {
      return;
    }

    const length = type === "coopTargets" ? 0x8 : 0x4;

    const offset = itemInt.offset - index * length;

    let best = 0;

    for (let i = 0x0; i < 0x5; i += 0x1) {
      const cleared = getInt(offset + i * length, "bit", { bit: 6 });

      if (cleared) {
        best = i + 1;
      }
    }

    const difficultyItem = getClosestItem("targetDifficulty", item) as ItemInt;

    setInt(difficultyItem.offset, "uint8", best, {
      binary: difficultyItem.binary,
    });
  } else if ("id" in item && item.id?.match(/timeBrawl-/)) {
    const itemInt = item as ItemInt;

    const cleared = getInt(itemInt.offset, "uint32", { bigEndian: true });

    const progressionItem = getClosestItem(
      item.id.replace("score", "progression"),
      item,
    ) as ItemInt;

    setInt(progressionItem.offset, "bit", cleared, {
      bit: progressionItem.bit,
    });
  } else if ("id" in item && item.id?.match(/^(trophy|sticker)$/)) {
    const itemInt = item as ItemInt;

    const quantity = getInt(itemInt.offset, "uint16", {
      bigEndian: true,
      binary: itemInt.binary,
    });

    setInt(itemInt.offset, "bit", quantity ? 1 : 0, { bit: 7 });
  } else if ("id" in item && item.id === "adventureCharacters") {
    const itemBitflags = item as ItemBitflags;

    checkNextHiddenFlags(flag, itemBitflags, 2);

    const offset = itemBitflags.flags[0].offset - 0x3;

    copyInt(offset, offset - 0x10, 0x8);
  }
}

const dataArray = [
  0x00000000, 0x1db71064, 0x3b6e20c8, 0x26d930ac, 0x76dc4190, 0x6b6b51f4,
  0x4db26158, 0x5005713c, 0xedb88320, 0xf00f9344, 0xd6d6a3e8, 0xcb61b38c,
  0x9b64c2b0, 0x86d3d2d4, 0xa00ae278, 0xbdbdf21c,
];

export function generateChecksum(item: ItemChecksum): number {
  let checksum = 0xffffffff;

  for (let i = item.control.offsetStart; i < item.control.offsetEnd; i += 0x1) {
    const int = getInt(i, "uint8");

    checksum = (checksum >>> 0x4) ^ dataArray[(checksum ^ int) & 0xf];
    checksum = (checksum >>> 0x4) ^ dataArray[(checksum ^ (int >> 0x4)) & 0xf];
  }

  checksum = ~checksum;

  return formatChecksum(checksum, item.dataType);
}

function getAdventureSlots(): number[] {
  const $fileName = get(fileName);

  const slots = [];

  if ($fileName !== "advsv0.bin") {
    return [];
  }

  for (let i = 0x0; i < 0x33; i += 0x1) {
    const int = getInt(i * 0x4934, "uint32");

    if (int) {
      slots.push(i);
    }
  }

  return slots;
}

export function getAdventureSlotNames(): Resource {
  const slots = getAdventureSlots();

  const names = slots.reduce((names: Resource, slotIndex, index) => {
    names[index] = `Slot ${slotIndex}`;

    return names;
  }, {});

  names[0x0] = "Previous Data";

  return names;
}
