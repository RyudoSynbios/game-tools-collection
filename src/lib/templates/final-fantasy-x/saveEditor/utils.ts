import { get } from "svelte/store";

import { dataView, fileName, gamePlatform, gameRegion } from "$lib/stores";
import {
  bitToOffset,
  copyInt,
  getInt,
  getString,
  setInt,
} from "$lib/utils/bytes";
import { formatChecksum } from "$lib/utils/checksum";
import {
  customGetRegions,
  getRegionSaves,
  getSlotShifts,
  repackFile,
  resetState,
  unpackFile,
} from "$lib/utils/common/playstation2";
import { isInRange } from "$lib/utils/format";
import { getClosestItem, getItem, updateResources } from "$lib/utils/parser";

import type {
  Item,
  ItemBitflags,
  ItemChecksum,
  ItemContainer,
  ItemInt,
  ItemSection,
  ItemString,
  Resource,
} from "$lib/types";

import { abilityList } from "./utils/resource";

export function setGamePlatform(dataView: DataView, fileName: string): void {
  if (fileName.match(/^ffx_[0-9]{3}$/)) {
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

  if (
    "id" in item &&
    item.id === "internationalOnly" &&
    !isInternationalSave()
  ) {
    const itemInt = item as ItemInt;

    itemInt.hidden = true;
  }

  if ("id" in item && item.id === "slots" && $gamePlatform === 0) {
    const itemContainer = item as ItemContainer;

    const saves = getRegionSaves();

    itemContainer.instances = saves.length;
  } else if (
    "id" in item &&
    item.id === "airshipDestinations" &&
    !isInternationalSave()
  ) {
    const itemBitflags = item as ItemBitflags;

    itemBitflags.flags[0].hidden = true;

    return itemBitflags;
  } else if ("id" in item && item.id?.match(/Name-/) && $gameRegion === 2) {
    const itemString = item as ItemString;

    itemString.length = 0x6;
    itemString.letterBigEndian = true;
    itemString.letterIsAdaptive = true;

    return itemString;
  } else if ("id" in item && item.id?.match(/overdrives-/)) {
    const itemBitflags = item as ItemBitflags;

    const [targetedCharacter, characterIndex] = item.id.splitInt();

    itemBitflags.hidden = targetedCharacter !== characterIndex;

    return itemBitflags;
  } else if ("id" in item && item.id?.match(/relationship-/)) {
    const itemInt = item as ItemInt;

    const [index] = item.id.splitInt();

    itemInt.hidden = !isInRange(index, 1, 6);

    return itemInt;
  } else if ("id" in item && item.id === "abilities") {
    const itemBitflags = item as ItemBitflags;

    itemBitflags.flags = itemBitflags.flags.map((flag) => {
      const ability = abilityList.find(
        (ability) => ability.name === flag.label,
      );

      return {
        ...flag,
        hidden: ability?.international && !isInternationalSave(),
      };
    });

    return itemBitflags;
  } else if (
    "id" in item &&
    item.id === "optionalBosses" &&
    !isInternationalSave()
  ) {
    const itemBitflags = item as ItemBitflags;

    itemBitflags.flags[3].separator = false;

    itemBitflags.flags = itemBitflags.flags.map((flag, index) => {
      return {
        ...flag,
        hidden: index >= 4,
      };
    });

    return itemBitflags;
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
      return [true, [0x0]];
    }

    return getSlotShifts(index);
  }

  return [false, undefined];
}

export function overrideItem(item: Item): Item {
  if ("id" in item && item.id?.match(/slots-/)) {
    const itemInt = item as ItemInt;

    const [index] = item.id.splitInt();

    const slotsItem = getClosestItem("slots", item) as ItemInt;

    const int = getInt(slotsItem.offset, "uint8");

    itemInt.disabled = index >= int;

    return itemInt;
  }

  return item;
}

export function overrideGetInt(item: Item): [boolean, number | undefined] {
  if ("id" in item && item.id?.match(/quantity-/)) {
    const itemInt = item as ItemInt;

    const [itemIndex] = item.id.splitInt();

    const inventory = getInventory(itemInt.offset);

    const itemV = inventory.find((item) => item.index === itemIndex);

    return [true, itemV?.quantity || 0];
  } else if ("id" in item && item.id?.match(/slots-/)) {
    const itemInt = item as ItemInt;

    const [, type] = item.id.split("-");

    if (itemInt.disabled) {
      return [true, type === "team" ? 0x3c : 0x0];
    }
  }

  return [false, undefined];
}

export function overrideSetInt(item: Item, value: string): boolean {
  if ("id" in item && item.id?.match(/quantity-/)) {
    const itemInt = item as ItemInt;

    const [itemIndex] = item.id.splitInt();

    const quantity = parseInt(value);

    updateInventory(itemInt.offset, itemIndex, quantity);

    return true;
  }

  return false;
}

export function afterSetInt(item: Item): void {
  if ("id" in item && item.id === "playtime") {
    const itemInt = item as ItemInt;

    copyInt(itemInt.offset, itemInt.offset - 0xec, 0x4);
  } else if ("id" in item && item.id?.match(/Name-/)) {
    const itemString = item as ItemString;

    const [slotIndex, index] = item.id.splitInt();

    updateCharacterNames(slotIndex);

    if (index === 0) {
      const savePreviewItem = getItem(
        `mainCharacterName-${slotIndex}`,
      ) as ItemString;

      copyInt(itemString.offset, savePreviewItem.offset, 0xc);
    }
  } else if ("id" in item && item.id?.match(/overdriveMode-/)) {
    const itemInt = item as ItemInt;

    const [index] = item.id.splitInt();

    const count = getInt(itemInt.offset, "uint16");

    const offset = itemInt.offset - index * 0x2 + 0x28 + bitToOffset(index);

    setInt(offset, "bit", count === 0 ? 1 : 0, { bit: index % 8 });
  } else if ("id" in item && item.id?.match(/keyItems-/)) {
    const sectionItem = getClosestItem("alBhedPrimerSection", item, ) as ItemSection; // prettier-ignore
    const countItem = sectionItem.items[0] as ItemInt;

    const flags =
      (getInt(countItem.offset + 0x3840, "uint32") >> 0x4) & 0x3ffffff;

    setInt(countItem.offset, "uint32", flags.toBitCount()); // Count
    setInt(countItem.offset + 0x30c4, "uint32", flags); // Obtained Flags
  }
}

const dataArray = [
  0x0000, 0x1021, 0x2042, 0x3063, 0x4084, 0x50a5, 0x60c6, 0x70e7, 0x8108,
  0x9129, 0xa14a, 0xb16b, 0xc18c, 0xd1ad, 0xe1ce, 0xf1ef, 0x1231, 0x0210,
  0x3273, 0x2252, 0x52b5, 0x4294, 0x72f7, 0x62d6, 0x9339, 0x8318, 0xb37b,
  0xa35a, 0xd3bd, 0xc39c, 0xf3ff, 0xe3de, 0x2462, 0x3443, 0x0420, 0x1401,
  0x64e6, 0x74c7, 0x44a4, 0x5485, 0xa56a, 0xb54b, 0x8528, 0x9509, 0xe5ee,
  0xf5cf, 0xc5ac, 0xd58d, 0x3653, 0x2672, 0x1611, 0x0630, 0x76d7, 0x66f6,
  0x5695, 0x46b4, 0xb75b, 0xa77a, 0x9719, 0x8738, 0xf7df, 0xe7fe, 0xd79d,
  0xc7bc, 0x48c4, 0x58e5, 0x6886, 0x78a7, 0x0840, 0x1861, 0x2802, 0x3823,
  0xc9cc, 0xd9ed, 0xe98e, 0xf9af, 0x8948, 0x9969, 0xa90a, 0xb92b, 0x5af5,
  0x4ad4, 0x7ab7, 0x6a96, 0x1a71, 0x0a50, 0x3a33, 0x2a12, 0xdbfd, 0xcbdc,
  0xfbbf, 0xeb9e, 0x9b79, 0x8b58, 0xbb3b, 0xab1a, 0x6ca6, 0x7c87, 0x4ce4,
  0x5cc5, 0x2c22, 0x3c03, 0x0c60, 0x1c41, 0xedae, 0xfd8f, 0xcdec, 0xddcd,
  0xad2a, 0xbd0b, 0x8d68, 0x9d49, 0x7e97, 0x6eb6, 0x5ed5, 0x4ef4, 0x3e13,
  0x2e32, 0x1e51, 0x0e70, 0xff9f, 0xefbe, 0xdfdd, 0xcffc, 0xbf1b, 0xaf3a,
  0x9f59, 0x8f78, 0x9188, 0x81a9, 0xb1ca, 0xa1eb, 0xd10c, 0xc12d, 0xf14e,
  0xe16f, 0x1080, 0x00a1, 0x30c2, 0x20e3, 0x5004, 0x4025, 0x7046, 0x6067,
  0x83b9, 0x9398, 0xa3fb, 0xb3da, 0xc33d, 0xd31c, 0xe37f, 0xf35e, 0x02b1,
  0x1290, 0x22f3, 0x32d2, 0x4235, 0x5214, 0x6277, 0x7256, 0xb5ea, 0xa5cb,
  0x95a8, 0x8589, 0xf56e, 0xe54f, 0xd52c, 0xc50d, 0x34e2, 0x24c3, 0x14a0,
  0x0481, 0x7466, 0x6447, 0x5424, 0x4405, 0xa7db, 0xb7fa, 0x8799, 0x97b8,
  0xe75f, 0xf77e, 0xc71d, 0xd73c, 0x26d3, 0x36f2, 0x0691, 0x16b0, 0x6657,
  0x7676, 0x4615, 0x5634, 0xd94c, 0xc96d, 0xf90e, 0xe92f, 0x99c8, 0x89e9,
  0xb98a, 0xa9ab, 0x5844, 0x4865, 0x7806, 0x6827, 0x18c0, 0x08e1, 0x3882,
  0x28a3, 0xcb7d, 0xdb5c, 0xeb3f, 0xfb1e, 0x8bf9, 0x9bd8, 0xabbb, 0xbb9a,
  0x4a75, 0x5a54, 0x6a37, 0x7a16, 0x0af1, 0x1ad0, 0x2ab3, 0x3a92, 0xfd2e,
  0xed0f, 0xdd6c, 0xcd4d, 0xbdaa, 0xad8b, 0x9de8, 0x8dc9, 0x7c26, 0x6c07,
  0x5c64, 0x4c45, 0x3ca2, 0x2c83, 0x1ce0, 0x0cc1, 0xef1f, 0xff3e, 0xcf5d,
  0xdf7c, 0xaf9b, 0xbfba, 0x8fd9, 0x9ff8, 0x6e17, 0x7e36, 0x4e55, 0x5e74,
  0x2e93, 0x3eb2, 0x0ed1, 0x0000,
];

export function generateChecksum(item: ItemChecksum): number {
  let checksum = 0xffff;

  if (item.id === "checksumHeader") {
    return getInt(item.control.offsetEnd - 0x4, "uint16");
  }

  for (let i = item.control.offsetStart; i < item.control.offsetEnd; i += 0x1) {
    const index = getInt(i, "uint8") ^ ((checksum >>> 0x8) & 0xff);

    checksum = dataArray[index] ^ (checksum << 0x8);
  }

  checksum = ~checksum;

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

export function getCharacterNames(slotIndex: number, type: string): Resource {
  if (typeof slotIndex === "string") {
    return {};
  }

  const names: Resource = {};

  let nameType = "character";
  let count = 8;

  if (type === "aeons") {
    nameType = "aeon";
    count = 10;
  }

  const itemString = getItem(`${nameType}Name-${slotIndex}-0`) as ItemString;

  for (let i = 0x0; i < count; i += 0x1) {
    names[i] = getString(
      itemString.offset + i * 0x14,
      itemString.length,
      "uint8",
      {
        letterBigEndian: itemString.letterBigEndian,
        letterIsAdaptive: itemString.letterIsAdaptive,
        endCode: itemString.endCode,
        resource: itemString.resource,
      },
    );
  }

  names[0xff] = "-";

  return names;
}

export function getSlotNames(): Resource {
  const $fileName = get(fileName);
  const $gamePlatform = get(gamePlatform);

  const saves = getRegionSaves();

  if ($gamePlatform === 1) {
    const index = parseInt($fileName.substring(4));

    return { 0x0: `Slot ${index}` };
  }

  const names = saves.reduce((names: Resource, save, index) => {
    const name = save.file.name.slice(-2);

    names[index] = `Slot ${parseInt(name) + 1}`;

    return names;
  }, {});

  return names;
}

export function onSlotChange(slotIndex: number): void {
  updateCharacterNames(slotIndex);
}

export function updateCharacterNames(slotIndex: number): void {
  const values1 = getCharacterNames(slotIndex, "party");
  const values2 = getCharacterNames(slotIndex, "aeons");

  updateResources("characterNames", values1);
  updateResources("aeonsNames", values2);
}

function getInventory(offset: number): { index: number; quantity: number }[] {
  const inventory: { index: number; quantity: number }[] = [];

  for (let i = 0x0; i < 0x70; i += 0x1) {
    const itemIndex = getInt(offset - 0x200 + i * 0x2, "uint16");
    const quantity = getInt(offset + i, "uint8");

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
    setInt(offset + index, "uint8", value);
  } else if (value) {
    const index = inventory.findIndex((item) => item.index === 0xff);

    if (index !== -1) {
      setInt(offset - 0x200 + index * 0x2, "uint16", itemIndex);
      setInt(offset + index, "uint8", value);
    }
  } else if (index !== -1) {
    setInt(offset - 0x200 + index * 0x2, "uint16", 0xff);
    setInt(offset + index, "uint8", 0x0);
  }
}

function isInternationalSave(): boolean {
  const $gameRegion = get(gameRegion);

  return ![1, 2].includes($gameRegion);
}
