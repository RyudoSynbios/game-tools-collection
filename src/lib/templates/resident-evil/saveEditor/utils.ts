import { get } from "svelte/store";

import { dataView, gamePlatform, gameRegion } from "$lib/stores";
import { getInt, setInt } from "$lib/utils/bytes";
import {
  customGetRegions,
  getSlotShiftsByIdentifier,
  repackFile,
  resetState,
  unpackFile,
} from "$lib/utils/common/playstation";
import { getObjKey } from "$lib/utils/format";
import { checkValidator, getPlatformRegions } from "$lib/utils/validator";

import type {
  Item,
  ItemContainer,
  ItemInt,
  ItemMessage,
  Validator,
} from "$lib/types";

export function setGamePlatform(dataView: DataView): void {
  const platformRegions = getPlatformRegions("windows").usa as Validator;
  const key = parseInt(getObjKey(platformRegions, 0));
  const validator = platformRegions[key];

  if (checkValidator(validator, key, dataView)) {
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
    return ["usa"];
  }

  return customGetRegions();
}

export function onInitFailed(): void {
  resetState();
}

export function overrideParseItem(item: Item): Item {
  const $gamePlatform = get(gamePlatform);
  const $gameRegion = get(gameRegion);

  if (
    "id" in item &&
    item.id === "time" &&
    ($gamePlatform === 1 || [2, 3, 4, 5].includes($gameRegion))
  ) {
    const itemInt = item as ItemInt;

    itemInt.operations![0] = { "/": 60 };

    return itemInt;
  } else if ("id" in item && item.id === "message") {
    const itemMessage = item as ItemMessage;

    itemMessage.hidden = [0, 2, 4, 6, 8].includes($gameRegion);

    return itemMessage;
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
      if (index === 0) {
        return [false, undefined];
      }

      return [true, [-1]];
    }

    return getSlotShiftsByIdentifier(`${index}`);
  }

  return [false, undefined];
}

export function overrideItem(item: Item): Item {
  if ("id" in item && item.id?.match(/itemSlots-/)) {
    const itemInt = item as ItemInt;

    const character = getInt(itemInt.offset + 0x24, "bit", { bit: 0 });

    if (character === 0x1) {
      itemInt.max = 6;
    }

    return itemInt;
  } else if ("id" in item && item.id?.match(/item-/)) {
    const itemInt = item as ItemInt;

    const [index, shift] = item.id.splitInt();

    const offset = itemInt.offset - 0x11d - index * 0x2 - shift;

    const int = getInt(offset, "uint8");

    itemInt.disabled = index >= int;

    return itemInt;
  }

  return item;
}

export function overrideGetInt(item: Item): [boolean, number | undefined] {
  if ("id" in item && item.id?.match(/item-/)) {
    const itemInt = item as ItemInt;

    if (itemInt.disabled) {
      return [true, 0x0];
    }
  }

  return [false, undefined];
}

export function afterSetInt(item: Item): void {
  if ("id" in item && item.id === "location") {
    const itemInt = item as ItemInt;

    const int = getInt(itemInt.offset, "uint16", { bigEndian: true });

    let camera = 0x0;
    let lastVisitedRoom = 0x0;
    let coordinates = [0, 0];
    let rotation = 0;

    switch (int) {
      case 0x0:
      case 0x500:
        camera = 0x5;
        lastVisitedRoom = 0x1;
        coordinates = [3145, 8286];
        rotation = 2992;
        break;
      case 0x6:
      case 0x506:
        camera = 0x5;
        lastVisitedRoom = 0x7;
        coordinates = [13236, 15957];
        rotation = 3357;
        break;
      case 0x18:
      case 0x518:
        camera = 0x0;
        lastVisitedRoom = 0xb;
        coordinates = [2478, 7634];
        rotation = 3112;
        break;
      case 0x207:
        camera = 0x3;
        lastVisitedRoom = 0x8;
        coordinates = [6860, 19326];
        rotation = 1176;
        break;
      case 0x20e:
        camera = 0x0;
        lastVisitedRoom = 0xd;
        coordinates = [3948, 4769];
        rotation = 88;
        break;
      case 0x303:
        camera = 0x2;
        lastVisitedRoom = 0x0;
        coordinates = [4362, 3576];
        rotation = 1064;
        break;
      case 0x40e:
        camera = 0x0;
        lastVisitedRoom = 0xc;
        coordinates = [2593, 8592];
        rotation = 3136;
        break;
    }

    setInt(itemInt.offset + 0x2, "uint8", camera);
    setInt(itemInt.offset + 0x3, "uint8", lastVisitedRoom);
    setInt(itemInt.offset + 0x2c, "uint16", coordinates[0]);
    setInt(itemInt.offset + 0x2e, "uint16", coordinates[1]);
    setInt(itemInt.offset + 0x30, "uint16", rotation);
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
