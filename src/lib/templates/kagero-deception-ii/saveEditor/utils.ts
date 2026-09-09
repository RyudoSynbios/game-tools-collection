import { get } from "svelte/store";

import { dataView, dataViewAlt, gameRegion } from "$lib/stores";
import { copyInt, getInt, setInt, setString } from "$lib/utils/bytes";
import {
  customGetRegions,
  getRegionSaves,
  repackFile,
  resetState,
  unpackFile,
} from "$lib/utils/common/playstation";
import { getClosestItem } from "$lib/utils/parser";

import type { Item, ItemContainer, ItemInt, ItemString } from "$lib/types";

import { japanParseItemAdaptater } from "./utils/japan";
import { chapterList } from "./utils/resource";

export function beforeInitDataView(dataView: DataView): DataView {
  return unpackFile(dataView);
}

export function overrideGetRegions(): string[] {
  return customGetRegions();
}

export function onInitFailed(): void {
  resetState();
}

export function beforeItemsParsing(): void {
  initDataViewAlt();
}

export function overrideParseItem(item: Item): Item {
  const $gameRegion = get(gameRegion);

  if ($gameRegion === 2) {
    return japanParseItemAdaptater(item);
  }

  return item;
}

export function overrideParseContainerItemsShifts(
  item: ItemContainer,
  shifts: number[],
  index: number,
): [boolean, number[] | undefined] {
  const $dataViewAlt = get(dataViewAlt);

  if (item.id === "slots" && index * 0x2000 >= $dataViewAlt.saves.byteLength) {
    return [true, [-1]];
  }

  return [false, undefined];
}

export function overrideSetInt(item: Item, value: string): boolean {
  const $dataViewAlt = get(dataViewAlt);

  if ("id" in item && item.id === "trapSlot") {
    const itemInt = item as ItemInt;

    const trapIndex = parseInt(value);

    const dummyInt = getClosestItem("trapSlotDummy", item) as ItemInt;

    const previous = getInt(itemInt.offset, "uint8", {}, $dataViewAlt.saves);

    if (previous !== 0xff) {
      setInt(dummyInt.offset + previous, "bit", 0, { bit: 7 }, "saves");
    }

    if (trapIndex !== 0xff) {
      setInt(dummyInt.offset + trapIndex, "bit", 1, { bit: 7 }, "saves");
    }
  }

  return false;
}

export function afterSetInt(item: Item): void {
  const $dataViewAlt = get(dataViewAlt);

  if ("id" in item && item.id === "name") {
    const itemString = item as ItemString;

    const spItem = getClosestItem("nameSavePreview", item) as ItemString;

    const { offset: offsetSrc, length } = itemString;
    const { offset: offsetDst } = spItem;

    copyInt(offsetSrc, offsetDst, length, $dataViewAlt.saves, "saves");
  } else if ("id" in item && item.id === "chapter") {
    const itemInt = item as ItemInt;

    const spItem = getClosestItem("chapterSavePreview", item) as ItemString;

    const chapterIndex = getInt(itemInt.offset, "uint8", {}, $dataViewAlt.saves); // prettier-ignore

    const chapter = chapterList.find(
      (chapter) => chapter.index === chapterIndex,
    );

    let number = 0x32;
    let chapterName = "";

    if (chapter) {
      number = chapter.number;
      chapterName = chapter.name;
    }

    setInt(itemInt.offset + 0x6, "uint8", number, {}, "saves");
    // prettier-ignore
    setString(spItem.offset, 0x26, "uint8", chapterName, 0x20, {
      endCode: 0xff,
      resource: "letters",
    }, "saves");
  }
}

export function beforeSaving(): ArrayBufferLike {
  dataView.set(exportDataViewAlt());

  return repackFile();
}

export function onReset(): void {
  resetState();
}

function initDataViewAlt(): void {
  const $dataView = get(dataView);

  const saves = getRegionSaves(false);

  const srcData = new Uint8Array($dataView.buffer);
  const destData = new Uint8Array(saves.length * 0x2000);

  let offset = 0x0;

  saves.forEach((save) => {
    for (let i = save.offset + 0x200; i < save.offset + 0x2000; i += 0x80) {
      destData.set(srcData.slice(i, i + 0x7f), offset);

      offset += 0x7f;
    }

    offset += 0x23c;
  });

  dataViewAlt.set({
    saves: new DataView(destData.buffer),
  });
}

function exportDataViewAlt(): DataView {
  const $dataView = get(dataView);
  const $dataViewAlt = get(dataViewAlt);

  const saves = getRegionSaves(false);

  const srcData = new Uint8Array($dataViewAlt.saves.buffer);
  const destData = new Uint8Array($dataView.buffer);

  saves.forEach((save) => {
    let offset = save.offset + 0x200;

    for (let i = save.offset; i < save.offset + 0x1d80; i += 0x7f) {
      const block = new Uint8Array(0x80);

      block.set(srcData.slice(i, i + 0x7f));

      let checksum = 0x0;

      for (let i = 0x0; i < 0x80; i += 0x1) {
        checksum ^= block[i];
      }

      block[0x7f] = checksum + 0x1;

      destData.set(block, offset);

      offset += 0x80;
    }
  });

  return new DataView(destData.buffer);
}
