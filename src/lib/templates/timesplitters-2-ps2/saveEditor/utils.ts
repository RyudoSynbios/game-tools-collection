import { get } from "svelte/store";

import { gameRegion } from "$lib/stores";
import {
  getBitflag,
  getInt,
  getString,
  setBitflag,
  setInt,
} from "$lib/utils/bytes";
import { formatChecksum, generateCrcCcitt } from "$lib/utils/checksum";
import {
  customGetRegions,
  getSaves,
  repackMemoryCard,
  resetMemoryCard,
  unpackMemoryCard,
} from "$lib/utils/common/playstation2";
import { round } from "$lib/utils/format";
import { getItem } from "$lib/utils/parser";

import type {
  Item,
  ItemBitflag,
  ItemBitflags,
  ItemChecksum,
  ItemContainer,
  ItemInt,
  Resource,
} from "$lib/types";

export function beforeInitDataView(dataView: DataView): DataView {
  return unpackMemoryCard(dataView);
}

export function overrideGetRegions(): string[] {
  return customGetRegions();
}

export function onInitFailed(): void {
  resetMemoryCard();
}

export function initShifts(shifts: number[]): number[] {
  const saves = getSaves();

  shifts = [...shifts, saves[0].offset];

  return shifts;
}

export function overrideParseItem(item: Item): Item {
  const $gameRegion = get(gameRegion);

  if ("id" in item && item.id === "profiles") {
    const itemContainer = item as ItemContainer;

    const profileCountItem = getItem("profileCount") as ItemInt;

    const saves = getSaves();

    let instances = getInt(profileCountItem.offset + saves[0].offset, "uint8");

    if (instances === 0) {
      instances = 1;

      itemContainer.disableSubinstanceIf = {
        offset: 0x1c404,
        type: "variable",
        dataType: "uint8",
        operator: "=",
        value: 0x0,
      };
    }

    itemContainer.instances = instances;
  } else if ("id" in item && item.id === "time" && $gameRegion !== 0) {
    const itemInt = item as ItemInt;

    itemInt.operations![0] = { "/": 60 };

    return itemInt;
  }

  return item;
}

export function overrideGetInt(
  item: Item,
): [boolean, number | (ItemBitflag & { checked: boolean })[] | undefined] {
  if ("id" in item && item.id?.match(/unlockables-/)) {
    const itemBitflags = item as ItemBitflags;

    const [, type] = item.id.split("-");

    const flags = itemBitflags.flags.reduce(
      (flags: (ItemBitflag & { checked: boolean })[], flag) => {
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

    const int1 = getInt(itemInt.offset, "int32");
    const int2 = getInt(itemInt.offset + 0x4, "int32");

    if (int1 > 0x0 && int2 <= int1) {
      int = Math.floor((int2 / int1) * 100);
    }

    return [true, int];
  } else if ("id" in item && item.id === "averageSpeed") {
    const itemInt = item as ItemInt;

    const int1 = getInt(itemInt.offset, "float32") / 3600;
    const int2 = getInt(itemInt.offset + 0x1a8, "float32", {
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

    const value = getInt(itemInt.offset, "uint32");

    const playCount = getInt(itemInt.offset - 0xc, "uint32");

    if (value > 0x0 && playCount === 0x0) {
      setInt(itemInt.offset - 0xc, "uint32", 1);
    }

    const shift = type === "arcade" ? 0x596 : 0x738;

    const offset =
      itemInt.offset - index * 0x14 + shift + Math.floor(index / 0x8);

    const bit = ((type === "arcade" ? 5 : 0) + index) % 8;

    for (let i = 0x0; i < 0x4; i += 0x1) {
      setBitflag(offset + i * 0x10, bit, i + 1 <= value);
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
  return repackMemoryCard();
}

export function onReset(): void {
  resetMemoryCard();
}

export function getProfileNames(): Resource {
  const profileCountItem = getItem("profileCount") as ItemInt;

  const names: Resource = {};

  for (let i = 0x0; i < 0x10; i += 0x1) {
    names[i] = getString(
      profileCountItem.offset + 0x1 + i * 0x1f,
      0x8,
      "uint8",
      { endCode: 0x0 },
    );
  }

  return names;
}
