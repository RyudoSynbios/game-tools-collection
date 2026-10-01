import { get } from "svelte/store";

import { dataView, gamePlatform, gameRegion } from "$lib/stores";
import { getInt, setInt } from "$lib/utils/bytes";
import { formatChecksum } from "$lib/utils/checksum";
import {
  customGetRegions,
  getFileOffset,
  getSlotShifts,
  repackFile,
  resetState,
  unpackFile,
} from "$lib/utils/common/playstation2";

import type {
  Item,
  ItemBitflag,
  ItemBitflagChecked,
  ItemBitflags,
  ItemChecksum,
  ItemContainer,
  ItemInt,
} from "$lib/types";

export function setGamePlatform(dataView: DataView, fileName: string): void {
  if (fileName === "dmc1.sav") {
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
    return ["europe"];
  }

  return customGetRegions();
}

export function onInitFailed(): void {
  resetState();
}

export function overrideParseItem(item: Item): Item {
  const $gamePlatform = get(gamePlatform);
  const $gameRegion = get(gameRegion);

  if ("id" in item && item.id === "europeOnly") {
    const itemInt = item as ItemInt;

    itemInt.hidden = $gamePlatform !== 0 || $gameRegion !== 0;

    return itemInt;
  } else if ("id" in item && item.id === "ps2Only") {
    const itemInt = item as ItemInt;

    itemInt.hidden = $gamePlatform !== 0;

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

  if (item.id === "slots") {
    if ($gamePlatform === 1) {
      return [true, [index * item.length]];
    }

    return [true, [getFileOffset(0, `SaveData-0${index}`)]];
  } else if (item.id === "system") {
    if ($gamePlatform === 1) {
      return [true, [0x5e60]];
    }

    return getSlotShifts(0);
  }

  return [false, undefined];
}

export function overrideGetInt(
  item: Item,
): [boolean, number | ItemBitflagChecked[] | undefined] {
  if ("id" in item && item.id === "equippedDevilArm") {
    const itemInt = item as ItemInt;

    const devilArm1 = getInt(itemInt.offset, "uint8");
    const devilArm2 = getInt(itemInt.offset + 0x2, "uint8");

    const int = Math.abs(devilArm1 - devilArm2);

    return [true, int];
  } else if ("id" in item && item.id === "item-bitflags") {
    const itemBitflags = item as ItemBitflags;

    const inventory = getInventory(itemBitflags.flags[0].offset);

    const flags = itemBitflags.flags.reduce(
      (flags: ItemBitflagChecked[], flag) => {
        const item = inventory.find((item) => item.index === flag.bit);

        flags.push({
          ...flag,
          checked: (item?.quantity || 0) > 0,
        });

        return flags;
      },
      [],
    );

    return [true, flags];
  } else if ("id" in item && item.id?.match(/item-variable-/)) {
    const itemInt = item as ItemInt;

    const [index] = item.id.splitInt();

    const inventory = getInventory(itemInt.offset);

    const itemV = inventory.find((item) => item.index === index);

    return [true, itemV?.quantity || 0];
  }

  return [false, undefined];
}

export function overrideSetInt(
  item: Item,
  value: string,
  flag: ItemBitflag,
): boolean {
  if ("id" in item && item.id === "equippedDevilArm") {
    const itemInt = item as ItemInt;

    const int = parseInt(value);

    let devilArm1 = int;
    let devilArm2 = 0x0;

    switch (int) {
      case 0x2:
        devilArm1 = 0x0;
        devilArm2 = 0x2;
        break;
      case 0x3:
        devilArm1 = 0x4;
        devilArm2 = 0x1;
        break;
    }

    setInt(itemInt.offset, "uint8", devilArm1);
    setInt(itemInt.offset + 0x2, "uint8", devilArm2);

    return true;
  } else if ("id" in item && item.id === "item-bitflags") {
    updateInventory(flag.offset, flag.bit, value ? 1 : 0);

    return true;
  } else if ("id" in item && item.id?.match(/item-variable-/)) {
    const itemInt = item as ItemInt;

    const [index] = item.id.splitInt();

    updateInventory(itemInt.offset, index, parseInt(value));

    return true;
  }

  return false;
}

export function afterSetInt(item: Item, flag: ItemBitflag): void {
  if ("id" in item && item.id === "unlockedCharacters") {
    const hasUnlockedCharacters = getInt(flag.offset, "uint8", {
      binary: { bitStart: 4, bitLength: 2 },
    });

    setInt(flag.offset, "bit", hasUnlockedCharacters ? 0x1 : 0x0, {
      bit: 6,
    });
  }
}

export function generateChecksum(item: ItemChecksum): number {
  let checksum = 0x0;

  for (let i = item.control.offsetStart; i < item.control.offsetEnd; i += 0x1) {
    checksum += getInt(i, "uint8");
  }

  return formatChecksum(checksum, item.dataType);
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

function getInventory(offset: number): { index: number; quantity: number }[] {
  const inventory: { index: number; quantity: number }[] = [];

  const length = getInt(offset - 0x15, "uint8");

  for (let i = 0x0; i < length; i += 0x1) {
    const itemIndex = getInt(offset + i * 0x4, "uint16", { bigEndian: true });
    const quantity = getInt(offset + 0x2 + i * 0x4, "uint16");

    inventory.push({ index: itemIndex, quantity });
  }

  return inventory;
}

function updateInventory(
  offset: number,
  itemIndex: number,
  value: number,
): void {
  const inventory = getInventory(offset);

  const index = inventory.findIndex((item) => item.index === itemIndex);

  if (value && index !== -1) {
    inventory[index].quantity = value;
  } else if (value) {
    inventory.push({ index: itemIndex, quantity: value });
  } else if (index !== -1) {
    inventory.splice(index, 1);
  }

  inventory
    .sort((a, b) => a.index - b.index)
    .forEach((item, index) => {
      setInt(offset + index * 0x4, "uint16", item.index, { bigEndian: true });
      setInt(offset + index * 0x4 + 0x2, "uint16", item.quantity);
    });

  setInt(offset - 0x15, "uint8", inventory.length);
}
