import { get } from "svelte/store";

import { gameJson, gameRegion } from "$lib/stores";
import { getInt, getString, setInt } from "$lib/utils/bytes";
import {
  customGetRegions,
  getSaves,
  getSlots,
  repackMemoryCard,
  resetMemoryCard,
  unpackMemoryCard,
} from "$lib/utils/common/playstation2";
import { getObjKey } from "$lib/utils/format";
import { getItem } from "$lib/utils/parser";

import type {
  Item,
  ItemBitflags,
  ItemContainer,
  ItemInt,
  ItemString,
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

export function overrideItem(item: Item): Item {
  const $gameRegion = get(gameRegion);

  if ("id" in item && item.id === "slots") {
    const itemContainer = item as ItemContainer;

    const saves = getSaves();

    itemContainer.instances = saves.length;
  } else if (
    "id" in item &&
    item.id === "time" &&
    ($gameRegion === 1 || $gameRegion === 2)
  ) {
    const itemInt = item as ItemInt;

    itemInt.operations![0] = { "/": 60 };

    return itemInt;
  } else if ("id" in item && item.id === "name" && $gameRegion === 2) {
    const itemString = item as ItemString;

    itemString.length = 0x8;

    return itemString;
  }

  return item;
}

export function overrideParseContainerItemsShifts(
  item: ItemContainer,
  shifts: number[],
  index: number,
): [boolean, number[] | undefined] {
  if (item.id === "slots") {
    return getSlots(index);
  }

  return [false, undefined];
}

export function overrideGetInt(item: Item): [boolean, string | undefined] {
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
  }

  return [false, undefined];
}

export function overrideSetInt(item: Item, value: string): boolean {
  const $gameRegion = get(gameRegion);
  const $gameJson = get(gameJson);

  if ("id" in item && item.id === "name" && $gameRegion === 2) {
    const itemString = item as ItemString;

    const resource = $gameJson.resources!.letters[2];

    let count = 0x0;

    for (let i = 0x0; i < itemString.length * 2; i += 0x1, count += 0x1) {
      const offset = itemString.offset + i;

      const index = Object.values(resource).findIndex(
        (letter) => letter === value[count],
      );

      let int = itemString.fallback as number;
      let letterDataType: "uint8" | "uint16" = "uint8";

      if (index !== -1) {
        int = parseInt(getObjKey(resource, index));

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

    const split = item.id.split("-");

    const type = split[1];
    const slotIndex = split[2];

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

export function getSlotNames(): string[] {
  const saves = getSaves();

  const names = saves.reduce((names: string[], save) => {
    const name = save.directory.name.slice(-2);

    names.push(`Slot ${name.replace(/^0/, "")}`);

    return names;
  }, []);

  return names;
}
