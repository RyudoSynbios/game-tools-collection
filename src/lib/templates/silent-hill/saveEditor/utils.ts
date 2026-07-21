import { get } from "svelte/store";

import { dataView, gameRegion } from "$lib/stores";
import {
  bitToOffset,
  checkNextHiddenFlags,
  copyInt,
  getInt,
  getIntFromItem,
  setInt,
} from "$lib/utils/bytes";
import { formatChecksum } from "$lib/utils/checksum";
import {
  customGetRegions,
  getRegionSaves,
  repackFile,
  resetState,
  unpackFile,
} from "$lib/utils/common/playstation";
import { clone, getPartialValue, makeOperations } from "$lib/utils/format";
import { getClosestItem, getItem } from "$lib/utils/parser";

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

import { itemList, locationList } from "./utils/resource";

export function beforeInitDataView(dataView: DataView): DataView {
  return unpackFile(dataView);
}

export function overrideGetRegions(): string[] {
  return customGetRegions();
}

export function onInitFailed(): void {
  resetState();
}

export function overrideParseItem(item: Item): Item {
  const $gameRegion = get(gameRegion);

  if ("id" in item && item.id === "slots") {
    const itemContainer = item as ItemContainer;

    const slots = getSlots();

    itemContainer.instances = slots.length;
  } else if ("id" in item && item.id === "systemChecksums") {
    const itemSection = item as ItemSection;

    const files = getFiles();

    const dummyItem = clone(itemSection.items[0]) as ItemChecksum;

    itemSection.items.pop();

    files.forEach((file) => {
      itemSection.items.push({
        ...dummyItem,
        name: `Checksum Save Previews ${file.index + 1}`,
        offset: file.offsetPreviews + 0xf8,
        control: {
          offsetStart: file.offsetPreviews,
          offsetEnd: file.offsetPreviews + 0xf8,
        },
      });
    });

    return itemSection;
  } else if ("id" in item && item.id === "language") {
    const itemInt = item as ItemInt;

    itemInt.hidden = $gameRegion !== 0;

    return itemInt;
  }

  return item;
}

export function overrideParseContainerItemsShifts(
  item: ItemContainer,
  shifts: number[],
  index: number,
): [boolean, number[] | undefined] {
  if (item.id === "slots") {
    const slots = getSlots();

    return [true, [slots[index].offsetSlot]];
  } else if (item.id === "system") {
    const files = getFiles();

    return [true, [files[0].offsetOptions]];
  } else if (item.id?.match(/savePreview-/)) {
    const [index] = item.id.splitInt();

    const slots = getSlots();

    return [true, [slots[index].offsetPreview]];
  }

  return [false, undefined];
}

export function overrideItem(item: Item): Item {
  if ("id" in item && item.id?.match(/item-/)) {
    const itemInt = item as ItemInt;

    const [index, shift] = item.id.splitInt();

    const offset = itemInt.offset + 0xab - index * 0x4 - shift;

    const int = getInt(offset, "uint8");

    itemInt.disabled = index >= int;

    return itemInt;
  }

  return item;
}

export function overrideGetInt(item: Item): [boolean, number | undefined] {
  if ("id" in item && item.id === "playtime") {
    const itemInt = item as ItemInt;

    if (itemInt.max !== 999) {
      return [false, undefined];
    }

    let playtime = getIntFromItem(itemInt) as number;

    const enhancedTime = getInt(itemInt.offset + 0xc, "uint8", {
      binary: { bitStart: 1, bitLength: 2 },
    });

    playtime += 290 * enhancedTime;

    return [true, playtime];
  } else if ("id" in item && item.id?.match(/item-/)) {
    const itemInt = item as ItemInt;

    if (itemInt.disabled) {
      return [true, 0x0];
    }
  } else if ("id" in item && item.id === "defeatedShooting") {
    const itemInt = item as ItemInt;

    const int1 = getInt(itemInt.offset, "upper4");
    const int2 = getInt(itemInt.offset + 0x1, "uint8");

    const int = (int1 << 0x8) | int2;

    return [true, int];
  }

  return [false, undefined];
}

export function overrideSetInt(item: Item, value: string): boolean {
  if ("id" in item && item.id === "playtime") {
    const itemInt = item as ItemInt;

    if (itemInt.max !== 999) {
      return false;
    }

    let int = parseInt(value);

    const enhancedTime = Math.floor(int / 290);

    int -= enhancedTime * 290;

    const oldInt = getInt(itemInt.offset, "uint32");

    int = makeOperations(int, itemInt.operations, true);
    int = getPartialValue(oldInt, int, itemInt.operations!);

    setInt(itemInt.offset, "uint32", int);
    setInt(itemInt.offset + 0xc, "uint8", enhancedTime, {
      binary: { bitStart: 1, bitLength: 2 },
    });

    return true;
  } else if ("id" in item && item.id?.match(/item-(\d)-0/)) {
    const itemInt = item as ItemInt;

    const [index, shift] = item.id.splitInt();

    const itemIndex = parseInt(value);
    const previousItemIndex = getInt(itemInt.offset, "uint8");

    const offset = itemInt.offset + 0x164 - index * 0x4 - shift;

    updateItemFlag(offset, itemIndex, previousItemIndex);
  } else if ("id" in item && item.id === "defeatedShooting") {
    const itemInt = item as ItemInt;

    const int = parseInt(value);

    setInt(itemInt.offset, "upper4", int >> 0x8);
    setInt(itemInt.offset + 0x1, "uint8", int);

    return true;
  }

  return false;
}

export function afterSetInt(item: Item, flag: ItemBitflag): void {
  if ("id" in item && item.id === "location") {
    const itemInt = item as ItemInt;

    const locationIndex = getInt(itemInt.offset, "uint16", { bigEndian: true });

    const location = locationList.find(
      (location) => location.index === locationIndex,
    );

    if (location) {
      setInt(itemInt.offset + 0x4, "uint8", location.preview);
      setInt(itemInt.offset + 0x5, "uint8", location.map);
      setInt(itemInt.offset + 0x1a0, "uint32", location.coordinates[0]);
      setInt(itemInt.offset + 0x1a8, "uint32", location.coordinates[1]);
      setInt(itemInt.offset + 0x1a4, "uint16", location.orientation);
    }
  } else if ("id" in item && item.id?.match(/item-(\d)-0/)) {
    const itemInt = item as ItemInt;

    const itemIndex = getInt(itemInt.offset, "uint8");

    let quantity = getInt(itemInt.offset + 0x1, "uint8");

    if (itemIndex !== 0xff && quantity === 0) {
      quantity = 1;
    } else if (itemIndex === 0xff) {
      quantity = 0;
    }

    setInt(itemInt.offset + 0x1, "uint8", quantity);
  } else if ("id" in item && item.id === "hiddenFlags") {
    const itemBitflags = item as ItemBitflags;

    checkNextHiddenFlags(flag, itemBitflags, 8);
  }

  if (
    "id" in item &&
    item.id?.match(/mode|playtime|location|hyperBlasterPowerUp|saves/)
  ) {
    const itemInt = item as ItemInt;

    const itemContainer = getClosestItem(/savePreview-/, item) as ItemContainer;
    const itemSectionSp1 = itemContainer.items[0] as ItemSection;
    const itemSectionSp2 = itemSectionSp1.items[0] as ItemSection;
    const itemSp = itemSectionSp2.items[0] as ItemInt;

    // prettier-ignore
    if (item.id === "saves") {
      copyInt(itemInt.offset, itemSp.offset, 0x2);
    } else {
      const itemSection1 = itemInt.parent as ItemSection;
      const itemLocation = getItem("location", itemSection1.parent!.items) as ItemInt;

      copyInt(itemLocation.offset + 0x1ac, itemSp.offset + 0x4, 0x4); // Playtime (2)
      copyInt(itemLocation.offset + 0x4, itemSp.offset + 0xa); // Location
      copyInt(itemLocation.offset + 0x1b8, itemSp.offset + 0xb); // Mode + Playtime (1) + Hyper Blaster Power Up
    }
  }
}

export function generateChecksum(
  item: ItemChecksum,
  dataView?: DataView,
): number {
  let checksum = 0x0;

  for (let i = item.control.offsetStart; i < item.control.offsetEnd; i += 0x1) {
    checksum ^= getInt(i, "uint8", {}, dataView);
  }

  checksum |= checksum << 0x8;

  return formatChecksum(checksum, item.dataType);
}

export function beforeSaving(): ArrayBufferLike {
  const $dataView = get(dataView);

  const files = getFiles();

  const data = new Uint8Array($dataView.buffer);

  const part = data.slice(files[0].offsetOptions, files[0].offsetSlots);

  files.forEach((file) => {
    data.set(part, file.offsetOptions);
  });

  dataView.set(new DataView(data.buffer));

  return repackFile();
}

export function onReset(): void {
  resetState();
}

export function getSlotNames(): Resource {
  const slots = getSlots();

  const names = slots.reduce((names: Resource, slot, index) => {
    names[index] = `Slot ${slot.file.index + 1}-${slot.index + 1}`;

    return names;
  }, {});

  return names;
}

interface File {
  index: number;
  offsetPreviews: number;
  offsetOptions: number;
  offsetSlots: number;
}

function getFiles(): File[] {
  const files: File[] = [];

  const saves = getRegionSaves();

  for (let i = 0; i < 0xf; i += 0x1) {
    const save = saves.find(
      (save) => save.file.identifier === `SILENT${i.leading0()}`,
    );

    if (save) {
      files.push({
        index: i,
        offsetPreviews: save.offset + 0x204,
        offsetOptions: save.offset + 0x300,
        offsetSlots: save.offset + 0x380,
      });
    }
  }

  return files;
}

interface Slot {
  file: File;
  index: number;
  offsetPreview: number;
  offsetSlot: number;
}

function getSlots(): Slot[] {
  const slots: Slot[] = [];

  const files = getFiles();

  files.forEach((file) => {
    for (let i = 0x0; i < 0xb; i += 0x1) {
      const offset = file.offsetPreviews + i * 0xc;

      const saveCount = getInt(offset, "uint32");

      if (saveCount === 0) {
        break;
      }

      slots.push({
        file,
        index: i,
        offsetPreview: offset,
        offsetSlot: file.offsetSlots + i * 0x280,
      });
    }
  });

  return slots;
}

function updateItemFlag(
  offset: number,
  index: number,
  previousIndex: number,
): void {
  const newItem = itemList.find((item) => item.index === index);
  const previousItem = itemList.find((item) => item.index === previousIndex);

  if (newItem && newItem.obtainedFlag) {
    setInt(offset + bitToOffset(newItem.obtainedFlag), "bit", 1, {
      bit: newItem.obtainedFlag % 8,
    });
  }

  if (previousItem && previousItem.obtainedFlag) {
    let removeObtainedFlag = true;

    if (previousItem.usedFlag) {
      removeObtainedFlag =
        getInt(offset + bitToOffset(previousItem.usedFlag), "bit", {
          bit: previousItem.usedFlag % 8,
        }) === 0;
    }

    if (removeObtainedFlag) {
      setInt(offset + bitToOffset(previousItem.obtainedFlag), "bit", 0, {
        bit: previousItem.obtainedFlag % 8,
      });
    }
  }
}
