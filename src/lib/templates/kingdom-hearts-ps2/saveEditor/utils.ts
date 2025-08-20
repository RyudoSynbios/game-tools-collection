import { get } from "svelte/store";

import { gameRegion } from "$lib/stores";
import { getInt, getString, setInt } from "$lib/utils/bytes";
import {
  customGetRegions,
  getFileOffset,
  getSaves,
  repackMemoryCard,
  resetMemoryCard,
  unpackMemoryCard,
} from "$lib/utils/common/playstation2";
import { getObjKey } from "$lib/utils/format";
import { getItem, getResource } from "$lib/utils/parser";

import type {
  Item,
  ItemBitflags,
  ItemContainer,
  ItemInt,
  ItemString,
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

export function overrideParseItem(item: Item): Item {
  const $gameRegion = get(gameRegion);

  if ("id" in item && item.id === "slots") {
    const itemContainer = item as ItemContainer;

    const saves = getSaves();

    itemContainer.instances = saves.length;
  } else if ("id" in item && item.id?.match(/time/)) {
    const itemInt = item as ItemInt;

    if ([1, 2].includes($gameRegion)) {
      itemInt.operations![0] = { "/": 60 };
    }

    return itemInt;
  } else if ("id" in item && item.id === "name" && $gameRegion === 2) {
    const itemString = item as ItemString;

    itemString.length = 0x8;

    return itemString;
  } else if ("id" in item && item.id === "japanExclude") {
    const itemInt = item as ItemInt;

    itemInt.hidden = $gameRegion === 2;

    return itemInt;
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
  }

  return item;
}

export function overrideShift(
  item: Item,
  shifts: number[],
  instanceIndex: number,
): number[] {
  if ("id" in item && item.id === "time-playtime") {
    return [...shifts.slice(0, -1), getFileOffset(instanceIndex, "system.bin")];
  }

  return shifts;
}

export function overrideParseContainerItemsShifts(
  item: ItemContainer,
  shifts: number[],
  index: number,
): [boolean, number[] | undefined] {
  if (item.id === "slots") {
    return [true, [getFileOffset(index)]];
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
  }

  return item;
}

export function overrideGetInt(
  item: Item,
): [boolean, number | string | undefined] {
  const $gameRegion = get(gameRegion);

  if ("id" in item && item.id === "name") {
    const itemString = item as ItemString;

    let name = "";

    for (
      let i = 0x0;
      i < itemString.length * ($gameRegion === 2 ? 2 : 1);
      i += 0x1
    ) {
      if ($gameRegion === 2) {
        if ([0x18, 0x19].includes(getInt(itemString.offset + i, "uint8"))) {
          name += getString(itemString.offset + i, 0x1, "uint16", {
            letterBigEndian: true,
            resource: itemString.resource,
          });

          i += 0x1;
        } else {
          if (
            getInt(itemString.offset + i, "uint8") === 0x0 ||
            name.length >= itemString.length
          ) {
            break;
          }

          name += getString(
            itemString.offset + i,
            0x1,
            itemString.letterDataType,
            { resource: itemString.resource },
          );
        }
      } else {
        if (
          getInt(itemString.offset + i, "uint8") === 0x0 ||
          name.length >= itemString.length
        ) {
          break;
        }

        name += getString(
          itemString.offset + i,
          0x1,
          itemString.letterDataType,
          {
            resource: itemString.resource,
          },
        );
      }
    }

    return [true, name];
  } else if ("id" in item && item.id?.match(/item-/)) {
    const itemInt = item as ItemInt;

    if (itemInt.disabled) {
      return [true, 0x0];
    }
  }

  return [false, undefined];
}

export function overrideSetInt(item: Item, value: string): boolean {
  const $gameRegion = get(gameRegion);

  if ("id" in item && item.id === "name" && $gameRegion === 2) {
    const itemString = item as ItemString;

    const letters = getResource("letters") as Resource;

    let count = 0x0;

    for (let i = 0x0; i < itemString.length * 2; i += 0x1, count += 0x1) {
      const offset = itemString.offset + i;

      const index = Object.values(letters).findIndex(
        (letter) => letter === value[count],
      );

      let int = itemString.fallback as number;
      let letterDataType: "uint8" | "uint16" = "uint8";

      if (index !== -1) {
        int = parseInt(getObjKey(letters, index));

        if (int > 0xff) {
          letterDataType = "uint16";

          i += 0x1;
        }
      }

      setInt(offset, letterDataType, int, { bigEndian: true });
    }

    return true;
  }

  return false;
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
  return repackMemoryCard();
}

export function onReset(): void {
  resetMemoryCard();
}

export function getSlotNames(): Resource {
  const saves = getSaves();

  const names = saves.reduce((names: Resource, save, index) => {
    const name = save.directory.name.slice(-2);

    names[index] = `Slot ${name.replace(/^0/, "")}`;

    return names;
  }, {});

  return names;
}
