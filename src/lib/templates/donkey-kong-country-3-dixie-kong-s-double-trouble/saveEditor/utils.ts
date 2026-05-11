import { get } from "svelte/store";

import { gameRegion } from "$lib/stores";
import {
  copyInt,
  extractBit,
  getInt,
  setInt,
  setString,
} from "$lib/utils/bytes";
import { formatChecksum } from "$lib/utils/checksum";
import { clone } from "$lib/utils/format";
import { getItem, getShift } from "$lib/utils/parser";

import type {
  Item,
  ItemBitflag,
  ItemBitflagChecked,
  ItemBitflags,
  ItemChecksum,
  ItemContainer,
  ItemInt,
  ItemString,
  ItemTab,
} from "$lib/types";

import { levels } from "./utils/resource";

export function overrideParseItem(item: Item): Item | ItemTab {
  const $gameRegion = get(gameRegion);

  if ("id" in item && item.id === "language") {
    const itemTab = item as ItemTab;

    itemTab.hidden = $gameRegion === 1;

    return itemTab;
  }

  return item;
}

export function overrideParseContainerItemsShifts(
  item: ItemContainer,
  shifts: number[],
  index: number,
): [boolean, number[] | undefined] {
  if (item.id === "slots") {
    const itemChecksum = clone(item.items[0]) as ItemChecksum;

    const shift = getShift(shifts) + index * item.length;

    itemChecksum.offset += shift;
    itemChecksum.control.offsetStart += shift;
    itemChecksum.control.offsetEnd += shift;

    const checksum = generateChecksum(itemChecksum);

    if (
      checksum === 0x0 ||
      checksum !== getInt(itemChecksum.offset, "uint32")
    ) {
      return [true, [-1]];
    }
  } else if (item.id === "players") {
    const shift = getShift(shifts);

    const mode = getInt(shift + 0x67, "uint8");

    if (index === 1 && mode !== 2) {
      return [true, [-1]];
    }
  }

  return [false, undefined];
}

export function overrideItem(item: Item): Item {
  if ("id" in item && item.id?.match(/name-player-/)) {
    const itemString = item as ItemString;

    const [index] = item.id.splitInt();

    const offset = itemString.offset - 0x1 - (index === 2 ? 0x5 : 0x0);

    const mode = getInt(offset, "uint8");

    if (mode !== 1) {
      return item;
    }

    if (index === 1) {
      itemString.name = "Player 1 Name";
    } else if (index === 2) {
      itemString.hidden = false;
    }

    return itemString;
  }

  return item;
}

export function overrideGetInt(
  item: Item,
): [boolean, number | string | ItemBitflagChecked[] | undefined] {
  if ("id" in item && item.id?.match(/^name/)) {
    const itemString = item as ItemString;

    let name = "";

    for (let i = 0x0; i < itemString.length; i += 0x1) {
      const int = getInt(itemString.offset + i, "uint8");

      name += String.fromCharCode(int & 0x7f);

      if (int & 0x80) {
        break;
      }
    }

    return [true, name];
  } else if ("id" in item && item.id?.match(/item-/)) {
    const itemInt = item as ItemInt;

    const [shift] = item.id.splitInt();

    const itemIndex = getInt(itemInt.offset, "uint16");

    // If item is Ski
    if (itemIndex === 0x2) {
      const skix2 = getInt(itemInt.offset - shift - 0x3, "bit", { bit: 5 });

      return [true, skix2 ? 0x2002 : 0x2];
    }
  } else if ("id" in item && item.id?.match(/progression-cleared/)) {
    const itemInt = item as ItemInt;

    let progression = getInt(itemInt.offset, "uint8") & 0x43;

    if (!extractBit(progression, 0)) {
      progression = 0x0;
    }

    return [true, progression];
  }

  return [false, undefined];
}

export function overrideSetInt(
  item: Item,
  value: string,
  flag: ItemBitflag,
): boolean {
  if ("id" in item && item.id?.match(/^name/)) {
    const itemString = item as ItemString;

    setString(
      itemString.offset,
      itemString.length,
      "uint8",
      value,
      itemString.fallback,
      { regex: itemString.regex },
    );

    setInt(itemString.offset + value.length - 0x1, "bit", 1, { bit: 7 });

    return true;
  } else if ("id" in item && item.id?.match(/progression-cleared/)) {
    const itemInt = item as ItemInt;

    const int = parseInt(value);

    let progression = getInt(itemInt.offset, "uint8") & 0xbc;

    if (extractBit(int, 0)) {
      progression |= 0x1;
    }

    if (extractBit(int, 1)) {
      progression |= 0x2;
    }

    if (extractBit(int, 6)) {
      progression |= 0x40;
    }

    setInt(itemInt.offset, "uint8", progression);

    return true;
  } else if ("id" in item && item.id?.match(/progression-flags/)) {
    const [, , , , type] = item.id.split("-");
    const [slotIndex, playerIndex, index] = item.id.splitInt();

    if (type === "level" && flag.bit === 5) {
      const dkCoinStatusItem = getItem(
        `dkCoinStatus-${slotIndex}-${playerIndex}-${index}`,
      ) as ItemInt;

      setInt(dkCoinStatusItem.offset, "uint8", value ? 0x2 : 0x0, {
        binary: dkCoinStatusItem.binary,
      });
    }
  } else if ("id" in item && item.id === "vehicles") {
    const int = flag.bit - (!value ? 1 : 0);

    for (let i = 2; i < 6; i += 1) {
      setInt(flag.offset, "bit", i <= int ? 1 : 0, { bit: i });
    }

    return true;
  }

  return false;
}

export function afterSetInt(item: Item, flag: ItemBitflag): void {
  if ("id" in item && item.id?.match(/difficulty-/)) {
    const itemInt = item as ItemInt;

    const [slotIndex, playerIndex] = item.id.splitInt();

    const difficulty = getInt(itemInt.offset, "uint8", {
      binary: itemInt.binary,
    });

    setInt(itemInt.offset - 0x1, "bit", difficulty === 0x2 ? 1 : 0, { bit: 7 });

    updateCompletionRate(slotIndex, playerIndex);
  } else if ("id" in item && item.id?.match(/progression-game/)) {
    const [slotIndex, playerIndex] = item.id.splitInt();

    updateCompletionRate(slotIndex, playerIndex);
  } else if ("id" in item && item.id === "cogs") {
    const itemInt = item as ItemInt;

    copyInt(itemInt.offset, itemInt.offset + 0x22);
  } else if ("id" in item && item.id?.match(/item-/)) {
    const itemInt = item as ItemInt;

    const [shift] = item.id.splitInt();

    const offset = itemInt.offset - shift;

    let int = 0x0;

    for (let i = 0x0; i < 0x4; i += 0x1) {
      int |= getInt(offset + i * 0x2, "uint16");
    }

    setInt(offset - 0x4, "uint16", int);
  } else if ("id" in item && item.id?.match(/progression-(cleared|flags)/)) {
    const [slotIndex, playerIndex, index] = item.id.splitInt();

    let offset = 0x0;

    if (flag) {
      offset = flag.offset - index;
    } else {
      offset = (item as ItemInt).offset - index;
    }

    updateCompletionRate(slotIndex, playerIndex);
    updateLinkedLevels(offset, index);
  } else if ("id" in item && item.id === "vehicles") {
    const itemBitflags = item as ItemBitflags;

    updateUsedItems(itemBitflags.flags[0].offset);
  } else if ("id" in item && item.id === "bananaBirds") {
    const itemBitflags = item as ItemBitflags;

    updateBananaBirds(itemBitflags.flags[3].offset);
    updateUsedItems(itemBitflags.flags[0].offset - 0x34);
  } else if ("id" in item && item.id === "brothersBear") {
    const itemBitflags = item as ItemBitflags;

    const index = itemBitflags.flags.findIndex((f) => f.label === flag.label);

    const checked = getInt(flag.offset, "bit", { bit: flag.bit });

    switch (index) {
      case 7:
        setInt(flag.offset, "bit", checked ? 0 : 1, { bit: 7 }); // No.6 Wrench obtained
        break;
      case 12:
        setInt(flag.offset - 0x24, "bit", checked, { bit: 2 }); // Wood sprite
        setInt(flag.offset + 0x29, "bit", checked ? 0 : 1, { bit: 7 }); // Arich's Hoard access
        break;
      case 14:
        setInt(flag.offset, "bit", checked ? 0 : 1, { bit: 5 }); // Bowling Ball given
        break;
    }

    updateBananaBirds(itemBitflags.flags[0].offset + 0x2c);
    updateUsedItems(itemBitflags.flags[0].offset - 0x4);
  } else if ("id" in item && item.id === "krematoaBoulders") {
    const itemInt = item as ItemInt;

    const int = getInt(itemInt.offset, "uint8");

    for (let i = 0; i < 6; i += 1) {
      setInt(itemInt.offset + 0x3, "bit", i < int ? 1 : 0, { bit: i });
    }
  } else if ("id" in item && item.id === "placedCogs") {
    const itemInt = item as ItemInt;

    const knautilusAccess = getInt(itemInt.offset, "uint8") === 0x5;

    setInt(itemInt.offset - 0x6, "bit", knautilusAccess ? 1 : 0, { bit: 0 });
  }
}

export function generateChecksum(
  item: ItemChecksum,
  dataView?: DataView,
): number {
  let checksumHigh = 0x0;
  let checksumLow = 0x0;

  for (let i = item.control.offsetStart; i < item.control.offsetEnd; i += 0x2) {
    checksumHigh += getInt(i, "uint16", {}, dataView);
    checksumLow ^= getInt(i, "uint16", {}, dataView);
  }

  const checksum = (checksumLow << 0x10) | (checksumHigh & 0xffff);

  return formatChecksum(checksum, item.dataType);
}

function updateBananaBirds(offset: number): void {
  let count = 0;

  count += getInt(offset - 0x29, "bit", { bit: 6 });
  count += getInt(offset - 0x25, "bit", { bit: 2 });

  for (let i = 0x0; i < 0xd; i += 0x1) {
    count += getInt(offset + i, "bit", { bit: 1 });
  }

  setInt(offset - 0x65, "uint8", count);
}

function updateCompletionRate(slotIndex: number, playerIndex: number): void {
  const completionRateItem = getItem(
    `completionRate-${slotIndex}-${playerIndex}`,
  ) as ItemInt;

  const offset = completionRateItem.offset - 0x76;

  let percent = -1;

  // Levels
  for (let i = 0xe4; i <= 0x120; i += 0x1) {
    const progression = getInt(offset + i, "uint8");

    // Is cleared
    if (progression & 0x2) {
      percent += 1;
    }

    // All DK Coins obtained
    if ((progression & 0x1c) === 0x1c) {
      percent += 1;
    }
  }

  percent += getInt(offset + 0xf7, "bit", { bit: 1 }); // Kastle Kaos
  percent += getInt(offset + 0xf8, "bit", { bit: 1 }); // Knautilus
  percent += getInt(offset + 0x79, "bit", { bit: 6 }); // Banana Bird Queen Freed

  if (percent === 103) {
    const cheats = getInt(offset + 0x143, "uint16");

    if (!(cheats & 0xc000)) {
      // HARDR enabled
      percent += 1;
    } else if (cheats & 0x8080) {
      // TUSFT enabled
      percent += 2;
    }
  }

  setInt(completionRateItem.offset, "uint8", percent);
}

// prettier-ignore
function updateLinkedLevels(offset: number, index: number): void {
  const level = levels.find((level) => level.index === index);

  if (!level || !level.linkedLevels) {
    return;
  }

  // Linked Levels

  const cleared = getInt(offset + index, "bit", { bit: 1 });

  if (level.type === "boss") {
    if (level.bonusCoins) {
      setInt(offset + index, "bit", cleared, { bit: 2 });
    } else if (level.dkCoin) {
      setInt(offset + index, "bit", cleared, { bit: 5 });
    }
  } else {
    level.linkedLevels.forEach((index) => {
      setInt(offset + index, "bit", cleared, { bit: 0 });
    });
  }

  // Linked Worlds

  const world = levels.find(
    (worldLevel) =>
      worldLevel.world === level.world && worldLevel.type === "world",
  );
  const boss = levels.find(
    (worldLevel) =>
      worldLevel.world === level.world && worldLevel.type === "boss",
  );
  const worldLevels = levels.filter(
    (worldLevel) =>
      worldLevel.world === level.world && worldLevel.type === "level",
  );

  if (!world || !boss) {
    return;
  }

  let bossCleared = 0;
  let bossKiddyCleared = 0;
  let allBonusCoins = false;
  let allDkCoins = false;

  const allCleared = worldLevels.every((level) => getInt(offset + level.index, "bit", { bit: 1 }));
  const bossDefeated = getInt(offset + boss.index, "bit", { bit: 1 });

  if (allCleared && bossDefeated) {
    bossCleared = getInt(offset + boss.index, "bit", { bit: 1 });
    bossKiddyCleared = getInt(offset + boss.index, "bit", { bit: 6 });
    allBonusCoins = worldLevels.every((level) => (getInt(offset + level.index, "uint8") & 0x1c) === 0x1c);
    allDkCoins = worldLevels.every((level) => getInt(offset + level.index, "bit", { bit: 5 }));
  }

  setInt(offset + world.index, "bit", bossCleared, { bit: 1 });
  setInt(offset + world.index, "uint8", allBonusCoins ? 0x7 : 0x0, { binary: { bitStart: 2, bitLength: 3 }});
  setInt(offset + world.index, "bit", allDkCoins ? 1 : 0, { bit: 5 });
  setInt(offset + world.index, "bit", bossKiddyCleared, { bit: 6 });

  // If level world is Cotton-Top Cove or Mekanos, we update the progression of K3
  if ([0x5f, 0x60].includes(world.index)) {
    const accessible = levels.filter((level) =>
      [0x3, 0x4].includes(level.world) && ["level", "boss"].includes(level.type),
    ).every((level) => getInt(offset + level.index, "bit", { bit: 1 }));

    setInt(offset + 0x61, "bit", accessible ? 1 : 0, { bit: 0 });

    return;
  }

  boss.linkedLevels?.forEach((level) => {
    setInt(offset + level, "bit", allCleared && bossDefeated ? 1 : 0, {
      bit: 0,
    });
  });
}

// prettier-ignore
function updateUsedItems(offset: number): void {
  const hasHoverCraft = getInt(offset, "bit", { bit: 3 });
  const hasTurboSki = getInt(offset, "bit", { bit: 4 });
  const shellUsed = getInt(offset + 0xb, "bit", { bit: 2 });
  const mirrorUsed = getInt(offset + 0x9, "bit", { bit: 3 }) || getInt(offset + 0x19, "bit", { bit: 3 });
  const presentUsed = getInt(offset + 0xf, "bit", { bit: 4 });
  const bowlingUsed = getInt(offset + 0x11, "bit", { bit: 5 });
  const flowerUsed = getInt(offset + 0x7, "bit", { bit: 6 });
  const wrenchUsed = getInt(offset + 0x17, "bit", { bit: 7 });

  setInt(offset - 0xb, "bit", hasHoverCraft, { bit: 0 });
  setInt(offset - 0xb, "bit", hasTurboSki, { bit: 1 });
  setInt(offset - 0xb, "bit", shellUsed, { bit: 2 });
  setInt(offset - 0xb, "bit", mirrorUsed, { bit: 3 });
  setInt(offset - 0xb, "bit", presentUsed, { bit: 4 });
  setInt(offset - 0xb, "bit", bowlingUsed, { bit: 5 });
  setInt(offset - 0xb, "bit", flowerUsed, { bit: 6 });
  setInt(offset - 0xb, "bit", wrenchUsed, { bit: 7 });
}
