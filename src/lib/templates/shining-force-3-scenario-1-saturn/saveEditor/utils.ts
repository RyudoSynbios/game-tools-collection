import { get } from "svelte/store";

import { dataView } from "$lib/stores";
import { getInt, setInt } from "$lib/utils/bytes";
import { clone } from "$lib/utils/format";

import type { Item, ItemChecksum, ItemInt, ItemTab } from "$lib/types";

import template from "./template";

export function beforeInitDataView(dataView: DataView): DataView {
  const array = [];

  for (let i = 0x0; i < dataView.byteLength; i += 0x1) {
    if (i >= 0xc0 && i % 0x40 === 0 && dataView.getUint8(i) === 0) {
      i += 0x3;
    } else {
      array.push(dataView.getUint8(i));
    }
  }

  const uint8Array = new Uint8Array(array.length);

  uint8Array.set(array);

  return new DataView(uint8Array.buffer);
}

export function overrideItem(
  item: Item & ItemTab,
  instanceIndex: number,
): Item | ItemTab {
  if ("id" in item && item.id === "friendship") {
    const itemTab = item as ItemTab;
    const itemInt = itemTab.items[0] as ItemInt;

    itemTab.items = [];

    let offset =
      itemInt.offset + instanceIndex * (Math.max(0, instanceIndex - 1) / 2);

    for (
      let i = 0;
      i < Object.keys(template.resources!.characters).length - 1;
      i += 1
    ) {
      const characterIndexReached = i >= instanceIndex;
      const characterIndex = i + (characterIndexReached ? 1 : 0);
      const newItemInt = clone(itemInt);

      if (i > 0 && (!characterIndexReached || i === instanceIndex)) {
        offset += 1;
      }

      if (characterIndexReached) {
        offset += characterIndex - 1;
      }

      newItemInt.name = template.resources!.characters[
        characterIndex
      ] as string;
      newItemInt.offset = offset;

      itemTab.items.push(newItemInt);
    }

    return itemTab;
  }

  return item;
}

export function afterSetInt(item: Item): void {
  if ("id" in item && item.id === "location") {
    const itemInt = item as ItemInt;

    const value = getInt(itemInt.offset, "uint8");

    setInt(itemInt.offset + 0x4, "uint8", value);
  }
}

export function generateChecksum(item: ItemChecksum): number {
  let checksum = 0x0;

  for (
    let i = item.control.offset;
    i < item.control.offset + item.control.length;
    i += 0x1
  ) {
    checksum += getInt(i, "uint8");
  }

  return checksum;
}

export function beforeSaving(): ArrayBufferLike {
  const $dataView = get(dataView);

  const array = [];

  let j = 0x0;

  for (let i = 0x0; i < $dataView.byteLength; i += 0x1) {
    if (i >= 0xc0 && j % 0x40 === 0 && $dataView.getUint8(i) !== 0x80) {
      array.push(0x0, 0x0, 0x0, 0x0);

      j += 0x4;
    }

    array.push($dataView.getUint8(i));

    j += 0x1;
  }

  const uint8Array = new Uint8Array(array.length);

  uint8Array.set(array);

  return uint8Array.buffer;
}
