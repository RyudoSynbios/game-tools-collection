import { get } from "svelte/store";

import { gameRegion, gameTemplate } from "$lib/stores";
import { bitToOffset, getInt, setInt } from "$lib/utils/bytes";
import { formatChecksum } from "$lib/utils/checksum";
import { clone } from "$lib/utils/format";
import { getItem, getShift } from "$lib/utils/parser";

import type {
  Item,
  ItemBitflag,
  ItemBitflags,
  ItemChecksum,
  ItemContainer,
  ItemInt,
} from "$lib/types";

import { krocodileKoreLevels, levels, lostWorldLevels } from "./utils/resource";

const LOST_WORLD_PATHS = [0x59, 0x5c, 0x5f, 0x62, 0x65];

export function overrideGetRegions(
  dataView: DataView,
  shift: number,
): string[] {
  const $gameTemplate = get(gameTemplate);

  const itemContainer = $gameTemplate.items[0] as ItemContainer;

  for (let i = 0x0; i < itemContainer.instances; i += 0x1) {
    const itemChecksum = clone(itemContainer.items[0] as ItemChecksum);

    const tmpShift = shift + i * itemContainer.length;

    itemChecksum.offset += tmpShift;
    itemChecksum.control.offsetStart += tmpShift;
    itemChecksum.control.offsetEnd += tmpShift;

    if (dataView.byteLength < itemChecksum.control.offsetEnd) {
      return [];
    }

    const checksum = generateChecksum(itemChecksum, dataView);

    if (
      checksum !== 0x0 &&
      checksum === getInt(itemChecksum.offset, "uint32", {}, dataView)
    ) {
      return ["europe_germany", "usa_japan"];
    }
  }

  return [];
}

export function overrideParseItem(item: Item): Item {
  const $gameRegion = get(gameRegion);

  if ("id" in item && item.id === "time" && $gameRegion !== 0) {
    const itemInt = item as ItemInt;

    itemInt.operations![0] = { "/": 60 };

    return itemInt;
  } else if ("id" in item && item.id?.match(/progression-flags/)) {
    const itemBitflags = item as ItemBitflags;

    const [, , index] = item.id.splitInt();

    const level = levels.find((level) => level.index === index);

    if (!level) {
      return itemBitflags;
    }

    // prettier-ignore
    itemBitflags.flags.map((flag) => {
      if (level.paths && flag.label.match(/^Path /)) {
        const index = parseInt(flag.label.split(" ")[1]) - 1;
        const path = level.paths[index];

        if (path === undefined) {
          return flag;
        }

        flag.offset += bitToOffset(path);
        flag.bit = path % 8;
      } else if (level.kremkoin && flag.label === "Boss Kremkoin") {
        flag.offset += bitToOffset(level.kremkoin);
        flag.bit = level.kremkoin % 8;
      } else if (level.bonusRooms && flag.label.match(/^Bonus Room /)) {
        const index = parseInt(flag.label.split(" ")[2]) - 1;
        const room = level.bonusRooms[index];

        if (!room) {
          return flag;
        }

        flag.offset += bitToOffset(room);
        flag.bit = room % 8;
        flag.separator = index === level.bonusRooms.length - 1;
        flag.hidden = false;
      } else if (level.clearedFlag && !level.kremkoin && flag.label === "Hero's Coin") {
        flag.offset += bitToOffset(level.clearedFlag);
        flag.bit = level.clearedFlag % 8;
        flag.hidden = false;
      } else if (level.clearedFlag && flag.label === "Cleared") {
        flag.offset += bitToOffset(level.clearedFlag);
        flag.bit = level.clearedFlag % 8;
      }

      return flag;
    });
  }

  return item;
}

export function overrideParseContainerItemsShifts(
  item: ItemContainer,
  shifts: number[],
  index: number,
): [boolean, number[] | undefined] {
  if (item.id === "slots") {
    const $gameTemplate = get(gameTemplate);

    const itemContainer = $gameTemplate.items[0] as ItemContainer;
    const itemChecksum = clone(itemContainer.items[0]) as ItemChecksum;

    const shift = getShift(shifts) + index * itemContainer.length;

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

    const mode = getInt(shift + 0xd, "uint8");

    if (index === 1 && mode !== 2) {
      return [true, [-1]];
    }
  }

  return [false, undefined];
}

export function overrideGetInt(item: Item): [boolean, number | undefined] {
  if ("id" in item && item.id === "currentLevel") {
    const itemInt = item as ItemInt;

    const level = getInt(itemInt.offset, "uint8");

    if (level === 0x6) {
      return [true, 0x5c];
    }
  } else if ("id" in item && item.id?.match(/progression-cleared/)) {
    const itemInt = item as ItemInt;

    const progression = Math.max(
      0,
      getInt(itemInt.offset, "uint8", { binary: itemInt.binary }) - 0x1,
    );

    return [true, progression];
  }

  return [false, undefined];
}

export function overrideSetInt(item: Item, value: string): boolean {
  if ("id" in item && item.id?.match(/progression-cleared/)) {
    const itemInt = item as ItemInt;

    const [, , index] = item.id.splitInt();

    let progression = parseInt(value) + 0x1;

    if (progression === 0x1) {
      const linkedLevel = levels.find((level) =>
        level.linkedLevels?.includes(index),
      );

      if (linkedLevel) {
        const offset = itemInt.offset - Math.floor(index / 0x4);

        if (getProgression(offset, linkedLevel.index) < 0x2) {
          progression = 0x0;
        }
      }
    }

    setInt(itemInt.offset, "uint8", progression, { binary: itemInt.binary });

    return true;
  }

  return false;
}

export function afterSetInt(item: Item, flag: ItemBitflag): void {
  if ("id" in item && item.id === "currentLevel") {
    const itemInt = item as ItemInt;

    const int = getInt(itemInt.offset, "uint8");

    const level = levels.find((level) => level.index === int);

    if (level) {
      setInt(itemInt.offset - 0x2, "uint8", level.world + 0x1);
      setInt(itemInt.offset + 0x2, "uint8", level.world);
    }
  } else if ("id" in item && item.id?.match(/progression-cleared/)) {
    const itemInt = item as ItemInt;

    const [slotIndex, playerIndex, index] = item.id.splitInt();

    const offset = itemInt.offset - Math.floor(index / 0x4);

    updateLevelProgression(offset, index);
    updateCompletionRate(slotIndex, playerIndex);
  } else if ("id" in item && item.id?.match(/progression-flags/)) {
    const [slotIndex, playerIndex] = item.id.splitInt();

    updateCompletionRate(slotIndex, playerIndex);
    updateHeroCoins(slotIndex, playerIndex);
  } else if ("id" in item && item.id?.match(/visitedLocations/)) {
    const [slotIndex, playerIndex] = item.id.splitInt();

    updateCompletionRate(slotIndex, playerIndex);
  } else if ("id" in item && item.id === "monkeyMuseumLostWorld") {
    const checked = getInt(flag.offset, "bit", { bit: flag.bit });

    for (let i = 0x0; i < 0x4; i += 0x1) {
      setInt(flag.offset + 0x1 + i, "bit", checked, { bit: flag.bit });
    }
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

function updateCompletionRate(slotIndex: number, playerIndex: number): void {
  const completionRateItem = getItem(
    `completionRate-${slotIndex}-${playerIndex}`,
  ) as ItemInt;

  const offset = completionRateItem.offset + 0x49;

  let percent = 0;

  // prettier-ignore
  levels.forEach((level) => {
    if (level.clearedFlag) {
      const cleared = getInt(offset + 0x40 + bitToOffset(level.clearedFlag), "bit", {
        bit: level.clearedFlag % 8,
      });

      if (cleared) {
        if ([0x5d, 0x71].includes(level.index)) {
          percent += 5;
        } else if (level.kremkoin) {
          percent += 2;
        } else {
          percent += 1;
        }
      }
    }

    if (level.bonusRooms) {
      const cleared = level.bonusRooms.every((bonusRoom) => {
        return getInt(offset + bitToOffset(bonusRoom), "bit", {
          bit: bonusRoom % 8,
        });
      });

      percent += cleared ? 1 : 0;
    }
  });

  // Visited locations
  percent += getInt(offset + 0x90, "bit", { bit: 0 }); // Monkey Museum
  percent += getInt(offset + 0x90, "bit", { bit: 1 }); // Funky Flights II
  percent += getInt(offset + 0x90, "bit", { bit: 2 }); // Swanky's Bonus Bonanza
  percent += getInt(offset + 0x90, "bit", { bit: 3 }); // Kong Kollege

  setInt(completionRateItem.offset, "uint8", percent);
}

function updateHeroCoins(slotIndex: number, playerIndex: number): void {
  const completionRateItem = getItem(
    `completionRate-${slotIndex}-${playerIndex}`,
  ) as ItemInt;

  const offset = completionRateItem.offset + 0x69;

  let count = 0;

  for (let i = 0x0; i < 0x5; i += 0x1) {
    count += getInt(offset + i * 0x4, "uint32").toBitCount();
  }

  setInt(completionRateItem.offset + 0x2, "uint8", count);
}

function getProgression(offset: number, level: number): number {
  return getInt(offset + Math.floor(level / 0x4), "uint8", {
    binary: {
      bitStart: (level * 0x2) % 8,
      bitLength: 2,
    },
  });
}

function setProgression(offset: number, level: number, value: number): void {
  setInt(offset + Math.floor(level / 0x4), "uint8", value, {
    binary: {
      bitStart: (level * 0x2) % 8,
      bitLength: 2,
    },
  });
}

function updateLevelProgression(offset: number, index: number): void {
  const level = levels.find((level) => level.index === index);

  if (!level) {
    return;
  }

  const progression = getProgression(offset, index);
  const cleared = progression >= 0x2 ? 0x1 : 0x0;

  // The game exclude "Stronghold Showdown"
  if (index !== 0x40 && level.clearedFlag) {
    setInt(offset + 0x80 + bitToOffset(level.clearedFlag), "bit", cleared, {
      bit: level.clearedFlag % 8,
    });
  }

  // If the level is a boss
  if (level.kremkoin) {
    setInt(offset + 0x40 + bitToOffset(level.kremkoin), "bit", cleared, {
      bit: level.kremkoin % 8,
    });

    const previousWorld = level.world - 0x1;
    const nextWorld = level.world + 0x1;

    const previousProgression = getProgression(offset, previousWorld);
    const nextProgression = getProgression(offset, nextWorld);

    if (cleared) {
      setProgression(offset, level.world, progression);

      if (level.world < 0x7 && nextProgression < 2) {
        setProgression(offset, nextWorld, 0x1);
      }
    } else {
      const value =
        level.world === 0x0 || previousProgression >= 0x2 ? 0x1 : 0x0;

      setProgression(offset, level.world, value);

      if (level.world < 0x7 && nextProgression < 2) {
        setProgression(offset, nextWorld, 0x0);
      }
    }
  }

  if (level.linkedLevels) {
    level.linkedLevels.forEach((linkedLevel) => {
      const linkedProgression = getProgression(offset, linkedLevel);

      if (linkedProgression < 0x2) {
        setProgression(offset, linkedLevel, cleared);
      }
    });
  }

  if (level.paths) {
    updateLevelPath(offset, level.paths, cleared);
  }

  if ([...lostWorldLevels, 0x71].includes(index)) {
    updateLostWorld(offset);
  }

  // If level is "K. Rool Duel", we update the Game Cleared flag
  if (index === 0x5d) {
    setInt(offset + 0xd0, "bit", cleared, { bit: 6 });
  }
}

function updateLevelPath(offset: number, paths: number[], value: number): void {
  paths.forEach((path) => {
    setInt(offset + 0x20 + bitToOffset(path), "bit", value, {
      bit: path % 8,
    });
  });
}

function updateLostWorld(offset: number): void {
  let count = 0;

  lostWorldLevels.forEach((level) => {
    count += getProgression(offset, level) >= 0x2 ? 1 : 0;
  });

  setInt(offset + 0xce, "uint8", count, {
    binary: { bitStart: 0, bitLength: 2 },
  });

  // Krokodile Kore background
  setInt(offset + 0xd1, "bit", count === 5 ? 1 : 0, { bit: 3 });

  let progression = getProgression(offset, 0x71);

  if (progression < 0x2) {
    progression = count === 5 ? 0x1 : 0x0;
  }

  krocodileKoreLevels.forEach((level) => {
    setProgression(offset, level, progression);
  });

  updateLevelPath(offset, LOST_WORLD_PATHS, count === 5 ? 1 : 0);
}
