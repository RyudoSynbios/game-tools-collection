import { get } from "svelte/store";

import { dataView, dataViewAlt, fileName } from "$lib/stores";
import { getInt, getString, setInt } from "$lib/utils/bytes";

import type { Item, ItemTab } from "$lib/types";

export function onReady(): void {
  const $dataView = get(dataView);
  const $fileName = get(fileName);

  if ($fileName === "RogueLegacyPlayer.rcdat") {
    const nameLength = getInt(0x13, "uint8");
    const enemiesSlainedLength = getInt(0xed + nameLength, "uint32") * 0x8;

    const uint8Array = new Uint8Array(
      $dataView.byteLength - nameLength - enemiesSlainedLength,
    );

    let shift = 0x0;

    for (let i = 0x0; i < uint8Array.length; i += 0x1) {
      uint8Array[i] = getInt(shift + i, "uint8");

      if (i === 0x13) {
        shift += nameLength;
      } else if (i === 0xf0) {
        shift += enemiesSlainedLength;
      }
    }

    const nameArray = new Uint8Array(0x8);

    for (let i = 0x0; i < nameLength; i += 0x1) {
      nameArray[i] = getInt(0x14 + i, "uint8");
    }

    const enemiesSlainedArray = new Uint8Array(enemiesSlainedLength);

    for (let i = 0x0; i < enemiesSlainedLength; i += 0x1) {
      enemiesSlainedArray[i] = getInt(0xf1 + nameLength + i, "uint8");
    }

    dataView.set(new DataView(uint8Array.buffer));

    dataViewAlt.set({
      name: new DataView(nameArray.buffer),
      enemiesSlained: new DataView(enemiesSlainedArray.buffer),
    });
  }
}

export function overrideParseItem(item: Item): Item | ItemTab {
  const $fileName = get(fileName);

  if ("id" in item && item.id === "main") {
    const itemTab = item as ItemTab;

    if ($fileName !== "RogueLegacyPlayer.rcdat") {
      itemTab.disabled = true;
    }

    return itemTab;
  } else if ("id" in item && item.id === "manor") {
    const itemTab = item as ItemTab;

    if ($fileName !== "RogueLegacyBP.rcdat") {
      itemTab.disabled = true;
    }

    return itemTab;
  }

  return item;
}

export function beforeSaving(): ArrayBufferLike {
  const $dataView = get(dataView);
  const $dataViewAlt = get(dataViewAlt);
  const $fileName = get(fileName);

  if ($fileName === "RogueLegacyPlayer.rcdat") {
    const name = getString(0x0, 0x8, "uint8", { zeroTerminated: true }, $dataViewAlt.name); // prettier-ignore

    setInt(0x13, "uint8", name.length);

    const uint8Array = new Uint8Array(
      $dataView.byteLength +
        name.length +
        $dataViewAlt.enemiesSlained.byteLength,
    );

    let shift = 0x0;

    for (let i = 0x0; i < $dataView.byteLength; i += 0x1) {
      uint8Array[shift + i] = getInt(i, "uint8");

      if (i === 0x13) {
        shift += name.length;
      } else if (i === 0xf0) {
        shift += $dataViewAlt.enemiesSlained.byteLength;
      }
    }

    for (let i = 0x0; i < name.length; i += 0x1) {
      uint8Array[0x14 + i] = getInt(i, "uint8", {}, $dataViewAlt.name);
    }

    for (let i = 0x0; i < $dataViewAlt.enemiesSlained.byteLength; i += 0x1) {
      uint8Array[0xf1 + name.length + i] = getInt(i, "uint8", {}, $dataViewAlt.enemiesSlained); // prettier-ignore
    }

    return uint8Array.buffer;
  }

  return $dataView.buffer;
}
