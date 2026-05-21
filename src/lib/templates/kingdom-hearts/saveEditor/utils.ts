import { get } from "svelte/store";

import { dataView, gamePlatform, gameRegion } from "$lib/stores";
import { getInt, getString, setInt } from "$lib/utils/bytes";
import {
  customGetRegions,
  getFileOffset,
  getRegionSaves,
  getSlotShifts,
  repackFile,
  resetState,
  unpackFile,
} from "$lib/utils/common/playstation2";
import { getItem } from "$lib/utils/parser";

import type {
  Item,
  ItemBitflags,
  ItemContainer,
  ItemInt,
  ItemString,
  Resource,
} from "$lib/types";

import { abilityList, inventory } from "./utils/resource";

export function setGamePlatform(dataView: DataView, fileName: string): void {
  if (fileName.match(/KHFM/)) {
    gamePlatform.set(1);
  } else {
    gamePlatform.set(0);
  }
}

export function beforeInitDataView(dataView: DataView): DataView {
  const $gamePlatform = get(gamePlatform);

  if ($gamePlatform === 0) {
    return unpackFile(dataView);
  }

  return dataView;
}

export function overrideGetRegions(): string[] {
  const $gamePlatform = get(gamePlatform);

  if ($gamePlatform === 1) {
    return ["finalMix"];
  }

  return customGetRegions();
}

export function onInitFailed(): void {
  resetState();
}

export function beforeItemsParsing(): void {
  const $gamePlatform = get(gamePlatform);

  if ($gamePlatform === 1) {
    gameRegion.set(7);
  }
}

export function overrideParseItem(item: Item): Item {
  const $gamePlatform = get(gamePlatform);
  const $gameRegion = get(gameRegion);

  if ("id" in item && item.id === "difficuty") {
    const itemInt = item as ItemInt;

    itemInt.hidden = [2, 7].includes($gameRegion);

    return itemInt;
  } else if ("id" in item && item.id === "slots") {
    const itemContainer = item as ItemContainer;

    if ($gamePlatform === 1) {
      const saves = getHD15RemixSaves();

      itemContainer.instances = saves.length;

      return itemContainer;
    }

    const saves = getRegionSaves();

    console.log(saves);

    itemContainer.instances = saves.length;

    return itemContainer;
  } else if ("id" in item && item.id?.match(/time/)) {
    const itemInt = item as ItemInt;

    if ([1, 2, 7].includes($gameRegion)) {
      itemInt.operations![0] = { "/": 60 };
    }

    return itemInt;
  } else if (
    "id" in item &&
    item.id === "name" &&
    $gamePlatform === 0 &&
    [2, 7].includes($gameRegion)
  ) {
    const itemString = item as ItemString;

    itemString.length = 0x8;

    return itemString;
  } else if ("id" in item && item.id === "japanExclude") {
    const itemInt = item as ItemInt;

    itemInt.hidden = $gameRegion === 2;

    return itemInt;
  } else if ("id" in item && item.id === "finalMixExclude") {
    const itemInt = item as ItemInt;

    itemInt.hidden = $gameRegion === 7;

    return itemInt;
  } else if ("id" in item && item.id === "ansemsReport") {
    const itemBitflags = item as ItemBitflags;

    itemBitflags.flags.map((flag, index) => {
      if ([10, 11, 12].includes(index) && $gameRegion === 7) {
        flag.hidden = false;
      }
    });

    return itemBitflags;
  } else if ("id" in item && item.id?.match(/japanExclude-/)) {
    const itemBitflags = item as ItemBitflags;

    const [type] = item.id.splitInt();

    itemBitflags.flags.map((flag, index) => {
      if (
        (type === 0 && index === 0 && $gameRegion === 2) ||
        (type === 1 && [4, 5].includes(index) && $gameRegion === 2) ||
        (type === 1 && index === 6 && $gameRegion !== 2)
      ) {
        flag.hidden = true;
      }
    });

    return itemBitflags;
  } else if ("id" in item && item.id?.match(/finalMixOnly-/)) {
    const itemBitflags = item as ItemBitflags;

    itemBitflags.flags.map((flag, index) => {
      if (index === 8 && $gameRegion === 7) {
        flag.separator = true;
      } else if (index === 9 && $gameRegion !== 7) {
        flag.hidden = true;
      }
    });

    return itemBitflags;
  } else if ("id" in item && item.id === "finalMixOnly") {
    const itemInt = item as ItemInt;

    itemInt.hidden = $gameRegion !== 7;

    return itemInt;
  }

  return item;
}

export function overrideShift(
  item: Item,
  shifts: number[],
  instanceIndex: number,
): number[] {
  const $gamePlatform = get(gamePlatform);

  if ("id" in item && item.id === "time-playtime") {
    if ($gamePlatform === 1) {
      return [...shifts, 0x16c40];
    }

    return [...shifts.slice(0, -1), getFileOffset(instanceIndex, "system.bin")];
  }

  return shifts;
}

export function overrideParseContainerItemsShifts(
  item: ItemContainer,
  shifts: number[],
  index: number,
): [boolean, number[] | undefined] {
  const $gamePlatform = get(gamePlatform);

  if (item.id === "slots") {
    if ($gamePlatform === 1) {
      const saves = getHD15RemixSaves();

      return [true, [saves[index].offset]];
    }

    return getSlotShifts(index);
  }

  return [false, undefined];
}

export function overrideItem(item: Item): Item {
  if ("id" in item && item.id?.match(/item-/)) {
    const itemInt = item as ItemInt;

    const [index] = item.id.splitInt();

    const int = getInt(itemInt.offset - 0x1 - index, "uint8");

    itemInt.disabled = index >= int;

    return itemInt;
  } else if ("id" in item && item.id?.match(/^(score|time)$/)) {
    const itemInt = item as ItemInt;

    const int = getInt(itemInt.offset, "int32");

    itemInt.disabled = int === -1;

    return itemInt;
  }

  return item;
}

export function overrideGetInt(item: Item): [boolean, number | undefined] {
  if ("id" in item && item.id?.match(/^(score|time)$/)) {
    const itemInt = item as ItemInt;

    if (itemInt.disabled) {
      return [true, 0x0];
    }
  }

  return [false, undefined];
}

export function afterSetInt(item: Item): void {
  if ("id" in item && item.id === "level") {
    const itemInt = item as ItemInt;

    const int = getInt(itemInt.offset, "uint8");

    setInt(itemInt.offset + 0x34, "uint8", int);
  } else if ("id" in item && item.id?.match(/trinity-/)) {
    const itemBitflags = item as ItemBitflags;

    const [, type, slotIndex] = item.id.split("-");

    const countItem = getItem(`count-trinity-${type}-${slotIndex}`) as ItemInt;

    const int = itemBitflags.flags.reduce(
      (count, flag) => count + getInt(flag.offset, "bit", { bit: flag.bit }),
      0,
    );

    setInt(countItem.offset, "uint8", int);
  }
}

export function beforeSaving(): ArrayBufferLike {
  const $dataView = get(dataView);
  const $gamePlatform = get(gamePlatform);

  if ($gamePlatform === 0) {
    return repackFile();
  }

  return $dataView.buffer;
}

export function onReset(): void {
  resetState();
}

export function getAbilityNames(): Resource {
  const $gamePlatform = get(gamePlatform);
  const $gameRegion = get(gameRegion);

  const names: Resource = {};

  abilityList.forEach((ability) => {
    if (
      (!ability.finalMix && !ability.hd15Remix) ||
      (ability.finalMix && $gameRegion === 7) ||
      (ability.hd15Remix && $gamePlatform === 1)
    ) {
      names[ability.index] = ability.name;
    }
  });

  names[0x0] = "-";

  return names;
}

export function getItemNames(type: string): Resource {
  const $gameRegion = get(gameRegion);

  const names: Resource = {};

  let subtype = -1;

  switch (type) {
    case "accessories":
      subtype = 0x6;
      break;
    case "items":
      subtype = 0x0;
      break;
    case "weapons":
      subtype = 0x5;
      break;
  }

  inventory.forEach((item) => {
    if (
      (!item.finalMix || $gameRegion === 7) &&
      item.type !== 0x1 &&
      item.type >> 0x4 === subtype
    ) {
      names[item.index] = item.name;
    }
  });

  names[0x0] = "-";

  return names;
}

export function getSlotNames(): Resource {
  const $gamePlatform = get(gamePlatform);

  if ($gamePlatform === 1) {
    const saves = getHD15RemixSaves();

    return saves.reduce((names: Resource, save, index) => {
      names[index] = `Slot ${save.name.replace(/^0/, "")}`;

      return names;
    }, {});
  }

  const saves = getRegionSaves();

  return saves.reduce((names: Resource, save, index) => {
    const name = save.file.name.slice(-2);

    names[index] = `Slot ${name.replace(/^0/, "")}`;

    return names;
  }, {});
}

function getHD15RemixSaves(): { name: string; offset: number }[] {
  const saves = [];

  for (let i = 0x0; i < 0x63; i += 0x1) {
    const offset = 0x1c8 + i * 0x2b0;

    if (getInt(offset, "uint8") === 0x2d) {
      saves.push({
        name: getString(offset + 0x1, 0x2, "uint8"),
        offset: 0x10d30 + i * 0x2d880,
      });
    }
  }

  return saves.sort((a, b) =>
    a.name.localeCompare(b.name, "en", { numeric: true }),
  );
}
