import { get } from "svelte/store";

import { dataView, gamePlatform, gameRegion } from "$lib/stores";
import { byteswapOffset, getInt, setInt } from "$lib/utils/bytes";
import {
  customGetRegions,
  getFileOffset,
  repackFile,
  resetState,
  unpackFile,
} from "$lib/utils/common/playstation2";

import type {
  Item,
  ItemBitflag,
  ItemBitflags,
  ItemChecksum,
  ItemContainer,
  ItemInt,
  ItemSection,
  Resource,
} from "$lib/types";

import { characterList } from "./utils/resource";

export function setGamePlatform(dataView: DataView, fileName: string): void {
  if (["DBZT2", "DBZSN"].includes(fileName)) {
    gamePlatform.set(0);
  } else {
    gamePlatform.set(1);
  }
}

export function beforeInitDataView(dataView: DataView): DataView {
  return unpackFile(dataView);
}

export function overrideGetRegions(dataView: DataView): string[] {
  const $gamePlatform = get(gamePlatform);

  if ($gamePlatform === 1) {
    return customGetRegions();
  }

  if (
    getInt(0x1f4d, "uint8", {}, dataView) === 0x54 &&
    getInt(0x1f6f, "uint8", {}, dataView) === 0x55
  ) {
    return ["europe_japan"];
  }

  return ["usa"];
}

export function onInitFailed(): void {
  resetState();
}

export function initShifts(shifts: number[]): number[] {
  const $gamePlatform = get(gamePlatform);

  if ($gamePlatform === 1) {
    return [...shifts, getFileOffset(0)];
  }

  return shifts;
}

export function overrideParseItem(item: Item): Item {
  const $gamePlatform = get(gamePlatform);

  if ($gamePlatform === 0) {
    if (hasExtraCharacters()) {
      if (item.type === "bitflags") {
        item.flags.forEach((flag) => {
          flag.offset += flag.offset >= 0x1f32 ? 0xa8 : 0x0;
        });
      } else if ("offset" in item) {
        if (item.offset >= 0x1f32) {
          item.offset += 0xaa;
        }

        if (item.offset >= 0x28e6) {
          item.offset += 0x2;
        }
      }
    }

    if (item.type === "bitflags") {
      item.flags.forEach((flag) => {
        flag.offset = byteswapOffset(flag.offset);
      });
    } else if ("dataType" in item && item.dataType === "bit") {
      item.offset = byteswapOffset(item.offset);

      return item;
    } else if (
      "dataType" in item &&
      ["int32", "uint16", "uint32", "uint64"].includes(item.dataType)
    ) {
      const itemInt = item as ItemInt;

      itemInt.bigEndian = true;
    }

    if ("id" in item && item.id === "extraCharacters") {
      const itemBitflags = item as ItemBitflags;

      itemBitflags.hidden = !hasExtraCharacters();

      return itemBitflags;
    }
  }

  if ("id" in item && item.id?.match(/ubzCharacter-/)) {
    const itemInt = item as ItemInt;

    const [courseIndex] = item.id.splitInt();

    itemInt.hidden = [3, 6].includes(courseIndex);

    return itemInt;
  } else if ("id" in item && item.id?.match(/ubzCharacterTag-/)) {
    const itemInt = item as ItemInt;

    const [courseIndex] = item.id.splitInt();

    itemInt.hidden = ![3, 6].includes(courseIndex);

    return itemInt;
  } else if ("id" in item && item.id === "evolutionZ" && hasExtraCharacters()) {
    const itemContainer = item as ItemContainer;

    itemContainer.instances = 78;

    return itemContainer;
  } else if ("id" in item && item.id?.match(/controllerVibration-/)) {
    const itemInt = item as ItemInt;

    const [index] = item.id.splitInt();

    if (index === 1) {
      itemInt.bit = 2;
    }

    return itemInt;
  } else if ("id" in item && item.id === "wiiOnly") {
    const itemSection = item as ItemSection;

    itemSection.hidden = $gamePlatform === 1;

    return itemSection;
  } else if ("id" in item && item.id === "ps2Only") {
    const itemSection = item as ItemSection;

    itemSection.hidden = $gamePlatform === 0;

    return itemSection;
  }

  return item;
}

export function overrideItem(item: Item): Item {
  if ("id" in item && item.id?.match(/ubzCharacter/)) {
    const itemInt = item as ItemInt;

    const [, shift] = item.id.splitInt();

    const points = getInt(itemInt.offset + 0x2 - shift, "uint16", {
      bigEndian: itemInt.bigEndian,
    });

    itemInt.disabled = points === 0;
    itemInt.resource = points > 0 ? "characters" : "empty";

    return itemInt;
  } else if ("id" in item && item.id === "ziExperience") {
    const itemInt = item as ItemInt;

    const zItem = getInt(itemInt.offset - 0x2, "uint16", {
      bigEndian: itemInt.bigEndian,
    });

    const isMaxLevel = [
      0x0, 0x13, 0x26, 0x39, 0x4c, 0x5f, 0x63, 0x76, 0x89, 0x9c,
    ].includes(zItem);

    itemInt.disabled = isMaxLevel || zItem >= 0x9d;
  }

  return item;
}

export function overrideGetInt(item: Item): [boolean, number | undefined] {
  if ("id" in item && item.id?.match(/ubzCharacter|ziExperience/)) {
    const itemInt = item as ItemInt;

    if (itemInt.disabled) {
      return [true, 0x0];
    }
  }

  return [false, undefined];
}

export function afterSetInt(item: Item, flag: ItemBitflag): void {
  const $gamePlatform = get(gamePlatform);

  if ("id" in item && item.id === "unlockedCharacters") {
    const unlocked = getInt(flag.offset, "bit", { bit: 0 });

    const offset = flag.offset + ($gamePlatform === 0 ? 0x1 : 0x2);

    setInt(offset, "uint16", unlocked ? 1 : 0, {
      bigEndian: $gamePlatform === 0,
    });
  } else if ("id" in item && item.id === "daStatus") {
    const itemInt = item as ItemInt;

    const quantity = getInt(itemInt.offset, "uint16", {
      bigEndian: itemInt.bigEndian,
    });

    const offset = itemInt.offset - ($gamePlatform === 0 ? 0x1 : 0x2);

    setInt(offset, "bit", quantity, { bit: 0 });
  } else if ("id" in item && item.id?.match(/zItem-/)) {
    const itemInt = item as ItemInt;

    const quantity = getInt(itemInt.offset, "uint16", {
      bigEndian: itemInt.bigEndian,
    });

    if (quantity > 0) {
      const offset = itemInt.offset - ($gamePlatform === 0 ? 0x1 : 0x2);

      setInt(offset, "bit", quantity, { bit: 0 });
    }
  }
}

export function generateChecksum(item: ItemChecksum): bigint {
  let checksum = 0x0;

  for (let i = item.control.offsetStart; i < item.control.offsetEnd; i += 0x2) {
    checksum += getInt(i, "uint16", { bigEndian: item.bigEndian });
  }

  const high = (checksum & 0xff).toHex(8);
  const low = ((checksum >>> 0x8) & 0xff).toHex(8);

  return BigInt(`0x${high}${low}`);
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

export function getCharacterNames(): Resource {
  const names: Resource = {};

  characterList.forEach((character) => {
    names[character.index] = character.name;
  });

  characterList.forEach((character) => {
    if (!character.exclusive || (character.exclusive && hasExtraCharacters())) {
      names[character.index] = character.name;
    }
  });

  return names;
}

function hasExtraCharacters(): boolean {
  const $gamePlatform = get(gamePlatform);
  const $gameRegion = get(gameRegion);

  return $gamePlatform === 0 && $gameRegion === 0;
}
