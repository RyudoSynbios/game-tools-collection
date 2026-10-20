import { get } from "svelte/store";

import { dataView, gamePlatform, gameRegion } from "$lib/stores";
import {
  byteswapOffset,
  getBitflag,
  getInt,
  getString,
  setBitflag,
  setInt,
} from "$lib/utils/bytes";
import { formatChecksum, generateCrcCcitt } from "$lib/utils/checksum";
import {
  customGetRegions,
  getFileOffset,
  isPlaystation2SaveFile,
  repackFile,
  resetState,
  unpackFile,
} from "$lib/utils/common/playstation2";
import { round } from "$lib/utils/format";
import { getClosestItem, getItem } from "$lib/utils/parser";
import { getRegions } from "$lib/utils/validator";

import type {
  Item,
  ItemBitflag,
  ItemBitflagChecked,
  ItemBitflags,
  ItemChecksum,
  ItemContainer,
  ItemInt,
  ItemString,
  Resource,
} from "$lib/types";

export function setGamePlatform(dataView: DataView): void {
  if (isPlaystation2SaveFile(dataView)) {
    gamePlatform.set(1);
  } else {
    gamePlatform.set(0);
  }
}

export function beforeInitDataView(dataView: DataView): DataView {
  const $gamePlatform = get(gamePlatform);

  if ($gamePlatform === 1) {
    return unpackFile(dataView);
  }

  return dataView;
}

export function overrideGetRegions(dataView: DataView): string[] {
  const $gamePlatform = get(gamePlatform);

  if ($gamePlatform === 1) {
    return customGetRegions();
  }

  return getRegions(dataView);
}

export function onInitFailed(): void {
  resetState();
}

export function initShifts(shifts: number[]): number[] {
  const $gamePlatform = get(gamePlatform);

  if ($gamePlatform === 1) {
    return [...shifts, getFileOffset(0)];
  }

  return [...shifts, 0x668];
}

export function overrideParseItem(item: Item): Item {
  const $gamePlatform = get(gamePlatform);
  const $gameRegion = get(gameRegion);

  if ($gamePlatform === 0) {
    if (item.type === "bitflags" && item.id !== "arcadeAwards") {
      item.flags.forEach((flag) => {
        flag.offset = byteswapOffset(flag.offset);
      });
    } else if ("dataType" in item && item.dataType === "bit") {
      item.offset = byteswapOffset(item.offset);
    } else if (
      "dataType" in item &&
      ["int32", "uint32", "float32"].includes(item.dataType)
    ) {
      const itemInt = item as ItemInt;

      itemInt.bigEndian = true;
    }

    if ("id" in item && item.id === "checksum") {
      const itemChecksum = item as ItemChecksum;

      itemChecksum.offset -= 0x1edfc;
      itemChecksum.control.offsetStart -= 0x62c;
      itemChecksum.control.offsetEnd -= 0x1edfc;

      return itemChecksum;
    } else if ("id" in item && item.id === "profiles") {
      const itemContainer = item as ItemContainer;

      itemContainer.instanceType = "section";
      itemContainer.instances = 1;
      itemContainer.resource = undefined;

      return itemContainer;
    } else if ("id" in item && item.id === "mainName") {
      const itemString = item as ItemString;

      itemString.offset += 0x8;

      return itemString;
    } else if ("id" in item && item.id === "unlockedMiniGames") {
      const itemBitflags = item as ItemBitflags;

      itemBitflags.flags = itemBitflags.flags.map((flag) => ({
        ...flag,
        offset: flag.offset - 0x190,
      }));

      return itemBitflags;
    } else if ("id" in item && item.id === "astrolander") {
      const itemContainer = item as ItemContainer;

      itemContainer.length = 0x118;

      return itemContainer;
    } else if ("id" in item && item.id?.match(/minigame-/)) {
      const itemContainer = item as ItemContainer;

      itemContainer.length = 0x1c;

      return itemContainer;
    } else if (
      "id" in item &&
      item.id?.match(/^(minigameScore|minigameTime)$/)
    ) {
      const itemInt = item as ItemInt;

      itemInt.offset -= 0x8;
    }
  }

  if ("id" in item && item.id === "ps2Only") {
    const itemInt = item as ItemInt;

    itemInt.hidden = $gamePlatform !== 1;

    return itemInt;
  } else if ("id" in item && item.id === "profiles") {
    const itemContainer = item as ItemContainer;

    const profileCountItem = getItem("profileCount") as ItemInt;

    let instances = getInt(profileCountItem.offset + getFileOffset(0), "uint8");

    if (instances === 0) {
      instances = 1;

      itemContainer.disableSubinstanceIf = {
        offset: 0x4,
        type: "variable",
        dataType: "uint8",
        operator: "=",
        value: 0x0,
      };
    }

    itemContainer.instances = instances;
  } else if (
    "id" in item &&
    item.id?.match(/^(time|minigameTime)$/) &&
    $gameRegion !== 0
  ) {
    const itemInt = item as ItemInt;

    itemInt.operations![0] = { "/": 60 };

    return itemInt;
  }

  return item;
}

export function overrideParseContainerItemsShifts(
  item: ItemContainer,
  shifts: number[],
  index: number,
): [boolean, number[] | undefined] {
  const $gamePlatform = get(gamePlatform);
  if ($gamePlatform === 1) {
    return [false, undefined];
  }

  if (item.id?.match(/minigame-/)) {
    const [, type] = item.id.split("-");

    if (type === "retroracer") {
      return [true, [...shifts, -0x50, index * item.length]];
    } else if (type === "astrolander") {
      return [true, [...shifts, -0xa0, index * item.length]];
    }
  }

  return [false, undefined];
}

export function overrideGetInt(
  item: Item,
): [boolean, number | ItemBitflagChecked[] | undefined] {
  if ("id" in item && item.id?.match(/unlockables-/)) {
    const itemBitflags = item as ItemBitflags;

    const [, type] = item.id.split("-");

    const flags = itemBitflags.flags.reduce(
      (flags: ItemBitflagChecked[], flag) => {
        let isChecked = getBitflag(flag.offset, flag.bit);

        let range = { start: -1, end: -1 };

        if (type === "arcadeLevels" && flag.label === "Scrapyard") {
          range = { start: 0, end: 2 };
        } else if (type === "arcadeLevels" && flag.label === "Night Club") {
          range = { start: 3, end: 5 };
        } else if (type === "arcadeLevels" && flag.label === "Hangar") {
          range = { start: 6, end: 8 };
        } else if (type === "arcadeLevels" && flag.label === "Robot Factory") {
          range = { start: 9, end: 11 };
        } else if (type === "arcadeLevels" && flag.label === "Ufotopia") {
          range = { start: 12, end: 14 };
        } else if (type === "arcadeLevels" && flag.label === "Chinese") {
          range = { start: 15, end: 17 };
        } else if (type === "arcadeLevels" && flag.label === "Chasm") {
          range = { start: 18, end: 20 };
        } else if (type === "arcadeLevels" && flag.label === "Circus") {
          range = { start: 24, end: 26 };
        } else if (type === "cheats" && flag.label === "Small Heads") {
          range = { start: 0, end: 41 };
        } else if (type === "cheats" && flag.label === "Paintball") {
          range = { start: 45, end: 65 };
        } else if (type === "gameModes" && flag.label === "Elimination") {
          range = { start: 0, end: 2 };
        }

        if (range.start !== -1 && range.end !== -1) {
          isChecked = true;

          for (let i = range.start; i <= range.end; i += 1) {
            const flag = itemBitflags.flags[i];

            if (!getBitflag(flag.offset, flag.bit)) {
              isChecked = false;
            }
          }
        }

        flags.push({
          ...flag,
          checked: isChecked,
        });

        return flags;
      },
      [],
    );

    return [true, flags];
  } else if ("id" in item && item.id === "percent") {
    const itemInt = item as ItemInt;

    let int = 0;

    const int1 = getInt(itemInt.offset, "int32", {
      bigEndian: itemInt.bigEndian,
    });
    const int2 = getInt(itemInt.offset + 0x4, "int32", {
      bigEndian: itemInt.bigEndian,
    });

    if (int1 > 0x0 && int2 <= int1) {
      int = Math.floor((int2 / int1) * 100);
    }

    return [true, int];
  } else if ("id" in item && item.id === "averageSpeed") {
    const itemInt = item as ItemInt;

    // prettier-ignore
    const int1 = getInt(itemInt.offset, "float32", { bigEndian: itemInt.bigEndian }) / 3600;
    const int2 = getInt(itemInt.offset + 0x1a8, "float32", {
      bigEndian: itemInt.bigEndian,
      operations: [{ "/": 1609.34 }, { round: 1 }],
    });

    const int = round(int2 / int1, 1);

    return [true, int];
  }

  return [false, undefined];
}

export function afterSetInt(item: Item, flag: ItemBitflag): void {
  if ("id" in item && item.id?.match(/story-/)) {
    const isChecked = getBitflag(flag.offset, flag.bit);

    const [index] = item.id.splitInt();

    const baseOffset = flag.offset - index * 0x4;

    if (index > 0 && isChecked) {
      for (let i = 0x0; i < index; i += 1) {
        setBitflag(baseOffset + i * 0x4, flag.bit, isChecked);
      }
    } else if (index < 2 && !isChecked) {
      for (let i = index; i <= 2; i += 1) {
        setBitflag(baseOffset + i * 0x4, flag.bit, isChecked);
      }
    }
  } else if ("id" in item && item.id?.match(/award-/)) {
    const itemInt = item as ItemInt;

    const [, type] = item.id.split("-");
    const [index] = item.id.splitInt();

    const value = getInt(itemInt.offset, "uint32", {
      bigEndian: itemInt.bigEndian,
    });

    const playCount = getInt(itemInt.offset - 0xc, "uint32", {
      bigEndian: itemInt.bigEndian,
    });

    if (value > 0x0 && playCount === 0x0) {
      setInt(itemInt.offset - 0xc, "uint32", 1, {
        bigEndian: itemInt.bigEndian,
      });
    }

    const clearedItem = getClosestItem("cleared-0", item) as ItemInt;

    const bit = ((type === "arcade" ? 5 : 0) + index) % 8;

    for (let i = 0x0; i < 0x4; i += 0x1) {
      setBitflag(clearedItem.offset + i * 0x10, bit, i + 1 <= value);
    }
  } else if ("id" in item && item.id?.match(/unlockables-/)) {
    const itemBitflags = item as ItemBitflags;

    const [, type] = item.id.split("-");

    const isChecked = getBitflag(flag.offset, flag.bit);

    let range = { start: -1, end: -1 };

    if (type === "arcadeLevels" && flag.label === "Scrapyard") {
      range = { start: 1, end: 2 };
    } else if (type === "arcadeLevels" && flag.label === "Night Club") {
      range = { start: 4, end: 5 };
    } else if (type === "arcadeLevels" && flag.label === "Hangar") {
      range = { start: 7, end: 8 };
    } else if (type === "arcadeLevels" && flag.label === "Robot Factory") {
      range = { start: 10, end: 11 };
    } else if (type === "arcadeLevels" && flag.label === "Ufotopia") {
      range = { start: 13, end: 14 };
    } else if (type === "arcadeLevels" && flag.label === "Chinese") {
      range = { start: 16, end: 17 };
    } else if (type === "arcadeLevels" && flag.label === "Chasm") {
      range = { start: 19, end: 20 };
    } else if (type === "arcadeLevels" && flag.label === "Circus") {
      range = { start: 25, end: 26 };
    } else if (type === "cheats" && flag.label === "Small Heads") {
      range = { start: 1, end: 41 };
    } else if (type === "cheats" && flag.label === "Paintball") {
      range = { start: 46, end: 65 };
    } else if (type === "gameModes" && flag.label === "Elimination") {
      range = { start: 1, end: 2 };
    }

    if (range.start !== -1 && range.end !== -1) {
      for (let i = range.start; i <= range.end; i += 1) {
        const flag = itemBitflags.flags[i];

        setBitflag(flag.offset, flag.bit, isChecked);
      }
    }
  }
}

export function generateChecksum(item: ItemChecksum): number {
  const checksum = ~generateCrcCcitt(item);

  return formatChecksum(checksum, item.dataType);
}

export function beforeSaving(): ArrayBufferLike {
  const $dataView = get(dataView);
  const $gamePlatform = get(gamePlatform);

  if ($gamePlatform === 1) {
    return repackFile();
  }

  return $dataView.buffer;
}

export function onReset(): void {
  resetState();
}

export function getProfileNames(): Resource {
  const names: Resource = {};

  const profileCountItem = getItem("profileCount") as ItemInt;

  for (let i = 0x0; i < 0x10; i += 0x1) {
    const offset = profileCountItem.offset + 0x1 + i * 0x1f;

    names[i] = getString(offset, 0x8, "uint8", { endCode: 0x0 });
  }

  return names;
}
