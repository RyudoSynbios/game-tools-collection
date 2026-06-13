import { get } from "svelte/store";

import { dataViewAlt, gamePlatform, gameRegion } from "$lib/stores";
import { getBoolean, getInt, setBoolean, setInt } from "$lib/utils/bytes";
import { formatChecksum } from "$lib/utils/checksum";
import {
  extractN64SaveFromGCI,
  injectN64SaveToGCI,
} from "$lib/utils/common/gamecube/zelda";
import { byteswapDataView, getHeaderShift } from "$lib/utils/common/nintendo64";
import { FLA_SIZE } from "$lib/utils/common/nintendo64/srm";
import { getShift } from "$lib/utils/parser";
import { getPlatformRegions, getRegions } from "$lib/utils/validator";

import type {
  Item,
  ItemBoolean,
  ItemChecksum,
  ItemContainer,
  ItemInt,
  ItemString,
  ItemTab,
  RegionValidator,
} from "$lib/types";

import { itemQuantites } from "./utils/resource";

const SAVE_FORMAT = "fla";

export function setGamePlatform(dataView: DataView): void {
  const gamecubeRegions = getPlatformRegions("gamecube") as {
    [key: string]: RegionValidator;
  };

  const isGamecube = getRegions(dataView, 0x0, gamecubeRegions).length > 0;

  if (isGamecube) {
    gamePlatform.set(1);
  } else {
    gamePlatform.set(0);
  }
}

export function initHeaderShift(dataView: DataView): number {
  return getHeaderShift(dataView, SAVE_FORMAT);
}

export function beforeInitDataView(
  dataView: DataView,
  shift: number,
): DataView {
  const $gamePlatform = get(gamePlatform);

  if ($gamePlatform === 1) {
    return extractN64SaveFromGCI(dataView, FLA_SIZE);
  }

  return byteswapDataView(SAVE_FORMAT, dataView, shift);
}

export function overrideGetRegions(
  dataView: DataView,
  shift: number,
): string[] {
  const $dataViewAlt = get(dataViewAlt);
  const $gamePlatform = get(gamePlatform);

  if ($gamePlatform === 1) {
    return getRegions($dataViewAlt.gci);
  }

  return getRegions(dataView, shift);
}

export function overrideParseItem(item: Item): Item | ItemTab {
  const $gameRegion = get(gameRegion);

  if (!hasOwlFile()) {
    if ("id" in item && item.id === "slots") {
      const itemContainer = item as ItemContainer;

      itemContainer.instances = 3;

      return itemContainer;
    } else if ("id" in item && item.id === "checksum") {
      const itemChecksum = item as ItemChecksum;

      itemChecksum.offset += 0x384;

      return itemChecksum;
    } else if ("id" in item && item.id === "owlFile") {
      const itemTab = item as ItemTab;

      itemTab.hidden = true;

      return itemTab;
    } else if ("id" in item && item.id === "mask") {
      const itemBoolean = item as ItemBoolean;

      if (itemBoolean.on) {
        itemBoolean.on += 0x1c;
      }

      return itemBoolean;
    } else if ("id" in item && item.id?.match(/hideoutCode|coloredMasks/)) {
      const itemString = item as ItemString;

      itemString.offset += 0x384;

      return itemString;
    }
  }

  if ("id" in item && item.id === "name" && $gameRegion === 2) {
    const itemString = item as ItemString;

    if (itemString.fallback) {
      itemString.fallback = 0xdf;
    }

    return itemString;
  }

  return item;
}

export function overrideParseContainerItemsShifts(
  item: ItemContainer,
  shifts: number[],
  index: number,
): [boolean, number[] | undefined] {
  if (item.id === "slots" && hasOwlFile()) {
    const shift = getShift(shifts);

    let offset = 0x0;

    if (index === 0) {
      offset = 0x8000;
    } else if (index === 1) {
      offset = 0x10000;
    }

    const isValid = getInt(shift + offset + 0x24, "uint8") === 0x5a;

    if (isValid) {
      return [true, [...shifts, offset]];
    }
  }

  return [false, undefined];
}

export function overrideItem(item: Item): Item {
  if ("id" in item && item.id?.match(/value-/)) {
    const itemInt = item as ItemInt;

    const [, type] = item.id.split("-");

    const { shift, bitStart, valuesMax } = itemQuantites[type];

    const upgrade = getInt(itemInt.offset + shift, "uint8", {
      binary: { bitStart, bitLength: 2 },
    });

    itemInt.max = valuesMax[upgrade];
  } else if ("id" in item && item.id === "magic") {
    const itemInt = item as ItemInt;

    const magicLevel = getInt(itemInt.offset - 0x1, "uint8");
    let max = 0;

    if (magicLevel === 0x1) {
      max = 48;
    } else if (magicLevel === 0x2) {
      max = 96;
    }

    itemInt.max = max;

    return itemInt;
  }

  return item;
}

export function overrideGetInt(
  item: Item,
): [boolean, number | string | undefined] {
  if ("id" in item && item.id === "hideoutCode") {
    const itemString = item as ItemString;

    let string = "";

    for (let i = 0x0; i < itemString.length; i += 0x1) {
      string += getInt(itemString.offset + i, "uint8");
    }

    return [true, string];
  } else if ("id" in item && item.id === "coloredMasks") {
    const itemString = item as ItemString;

    const colors = ["R", "B", "Y", "G"];

    let string = "";

    for (let i = 0x0; i < itemString.length; i += 0x1) {
      string += colors[getInt(itemString.offset + i, "uint8")];
    }

    return [true, string];
  }

  return [false, undefined];
}

export function overrideSetInt(item: Item, value: string): boolean {
  if ("id" in item && item.id === "heartPieces") {
    const itemInt = item as ItemInt;

    const int = parseInt(value);

    if (int === 0x1) {
      setInt(itemInt.offset, "bit", 0x1, { bit: 4 });
      setInt(itemInt.offset, "bit", 0x0, { bit: 5 });
    } else if (int === 0x2) {
      setInt(itemInt.offset, "bit", 0x0, { bit: 4 });
      setInt(itemInt.offset, "bit", 0x1, { bit: 5 });
    } else if (int === 0x3) {
      setInt(itemInt.offset, "bit", 0x1, { bit: 4 });
      setInt(itemInt.offset, "bit", 0x1, { bit: 5 });
    } else {
      setInt(itemInt.offset, "bit", 0x0, { bit: 4 });
      setInt(itemInt.offset, "bit", 0x0, { bit: 5 });
    }

    return true;
  } else if ("id" in item && item.id === "quiver") {
    const itemInt = item as ItemInt;

    const int = parseInt(value);

    if (int === 0x1) {
      setInt(itemInt.offset, "bit", 0x1, { bit: 0 });
      setInt(itemInt.offset, "bit", 0x0, { bit: 1 });
    } else if (int === 0x2) {
      setInt(itemInt.offset, "bit", 0x0, { bit: 0 });
      setInt(itemInt.offset, "bit", 0x1, { bit: 1 });
    } else if (int === 0x3) {
      setInt(itemInt.offset, "bit", 0x1, { bit: 0 });
      setInt(itemInt.offset, "bit", 0x1, { bit: 1 });
    } else {
      setInt(itemInt.offset, "bit", 0x0, { bit: 0 });
      setInt(itemInt.offset, "bit", 0x0, { bit: 1 });
    }

    return true;
  } else if ("id" in item && item.id === "bombBag") {
    const itemInt = item as ItemInt;

    const int = parseInt(value);

    if (int === 0x1) {
      setInt(itemInt.offset, "bit", 0x1, { bit: 3 });
      setInt(itemInt.offset, "bit", 0x0, { bit: 4 });
    } else if (int === 0x2) {
      setInt(itemInt.offset, "bit", 0x0, { bit: 3 });
      setInt(itemInt.offset, "bit", 0x1, { bit: 4 });
    } else if (int === 0x3) {
      setInt(itemInt.offset, "bit", 0x1, { bit: 3 });
      setInt(itemInt.offset, "bit", 0x1, { bit: 4 });
    } else {
      setInt(itemInt.offset, "bit", 0x0, { bit: 3 });
      setInt(itemInt.offset, "bit", 0x0, { bit: 4 });
    }

    return true;
  } else if ("id" in item && item.id === "wallet") {
    const itemInt = item as ItemInt;

    const int = parseInt(value);

    if (int === 0x1) {
      setInt(itemInt.offset, "bit", 0x1, { bit: 4 });
      setInt(itemInt.offset, "bit", 0x0, { bit: 5 });
    } else if (int === 0x2) {
      setInt(itemInt.offset, "bit", 0x0, { bit: 4 });
      setInt(itemInt.offset, "bit", 0x1, { bit: 5 });
    } else {
      setInt(itemInt.offset, "bit", 0x0, { bit: 4 });
      setInt(itemInt.offset, "bit", 0x0, { bit: 5 });
    }

    return true;
  }

  return false;
}

export function afterSetInt(item: Item): void {
  if ("id" in item && item.id?.match(/max-/)) {
    const itemInt = item as ItemInt;

    const [, type] = item.id.split("-");

    const { shift, dataType, valuesMax } = itemQuantites[type];

    let value = getInt(itemInt.offset - shift, dataType, {
      bigEndian: dataType === "uint16",
    });

    const upgrade = getInt(itemInt.offset, "uint8", {
      binary: itemInt.binary,
    });

    value = Math.min(value, valuesMax[upgrade]);

    setInt(itemInt.offset - shift, dataType, value, {
      bigEndian: dataType === "uint16",
    });
  } else if ("id" in item && item.id === "maxHealth") {
    const itemInt = item as ItemInt;

    const maxHealth = getInt(itemInt.offset, "uint16", { bigEndian: true });
    const hasDoubleDefense = getBoolean(itemInt.offset + 0xe);

    let int = 0;

    if (hasDoubleDefense) {
      int = maxHealth / 16;
    }

    setInt(itemInt.offset + 0x9f, "uint8", int);
  } else if ("id" in item && item.id === "magicLevel") {
    const itemInt = item as ItemInt;

    const int = getInt(itemInt.offset, "uint8");

    const magic = getInt(itemInt.offset + 0x1, "uint8");

    if (int === 0x1) {
      setBoolean(itemInt.offset + 0x9, false);
      setBoolean(itemInt.offset + 0x8, true);
      setInt(itemInt.offset + 0x1, "uint8", Math.min(48, magic));
    } else if (int === 0x2) {
      setBoolean(itemInt.offset + 0x9, true);
      setBoolean(itemInt.offset + 0x8, true);
      setInt(itemInt.offset + 0x1, "uint8", Math.min(96, magic));
    } else {
      setBoolean(itemInt.offset + 0x9, false);
      setBoolean(itemInt.offset + 0x8, false);
      setInt(itemInt.offset + 0x1, "uint8", Math.min(0, magic));
    }
  } else if ("id" in item && item.id === "doubleDefense") {
    const itemInt = item as ItemInt;

    let int = 0;

    const hasDoubleDefense = getBoolean(itemInt.offset);
    const maxHealth = getInt(itemInt.offset - 0xe, "uint16", {
      bigEndian: true,
    });

    if (hasDoubleDefense) {
      int = maxHealth / 16;
    }

    setInt(itemInt.offset + 0x91, "uint8", int);
  } else if ("id" in item && item.id === "day") {
    const itemInt = item as ItemInt;

    const int = getInt(itemInt.offset, "uint32", { bigEndian: true });

    setInt(itemInt.offset + 0x4, "uint32", int, { bigEndian: true });
  }
}

export function generateChecksum(item: ItemChecksum): number {
  let checksum = 0x0;

  let isOwlFile = false;

  if (hasOwlFile()) {
    isOwlFile = getBoolean(item.offset - 0xfe7);
  }

  for (
    let i = item.control.offsetStart;
    i < item.control.offsetEnd + (isOwlFile ? 0x2000 : 0x0);
    i += 0x1
  ) {
    checksum += getInt(i, "uint8");
  }

  return formatChecksum(checksum, item.dataType);
}

export function beforeSaving(): ArrayBufferLike {
  const $gamePlatform = get(gamePlatform);

  if ($gamePlatform === 1) {
    return injectN64SaveToGCI(FLA_SIZE);
  }

  return byteswapDataView(SAVE_FORMAT).buffer;
}

function hasOwlFile(): boolean {
  const $gamePlatform = get(gamePlatform);
  const $gameRegion = get(gameRegion);

  return $gamePlatform === 1 || $gameRegion !== 2;
}
