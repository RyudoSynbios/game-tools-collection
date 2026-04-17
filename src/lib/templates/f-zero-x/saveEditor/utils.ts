import { get } from "svelte/store";

import { gameRegion } from "$lib/stores";
import { getInt, setInt } from "$lib/utils/bytes";
import { formatChecksum } from "$lib/utils/checksum";
import { byteswapDataView, getHeaderShift } from "$lib/utils/common/nintendo64";
import { getObjKey } from "$lib/utils/format";

import type { Item, ItemChecksum, ItemInt } from "$lib/types";

import { machinesDetails } from "./utils/resource";

export function initHeaderShift(dataView: DataView): number {
  return getHeaderShift(dataView, "sra");
}

export function beforeInitDataView(dataView: DataView): DataView {
  return byteswapDataView("sra", dataView);
}

export function overrideItem(item: Item): Item {
  const $gameRegion = get(gameRegion);

  if ("id" in item && item.id === "maxSpeed" && $gameRegion === 1) {
    const itemInt = item as ItemInt;

    itemInt.operations![0] = { "*": 21.6 };

    return itemInt;
  } else if ("id" in item && item.id?.match(/timeAttack-/)) {
    const itemInt = item as ItemInt;

    const [shift] = item.id.splitInt();

    itemInt.disabled = !isTimeAttackCleared(itemInt.offset - shift);

    return itemInt;
  } else if ("id" in item && item.id?.match(/machine-/)) {
    const itemInt = item as ItemInt;

    const [index] = item.id.splitInt();

    const offset = getPlaceOffset(itemInt.offset, "machine", index);

    let isDisabled = true;

    if (index === 5) {
      isDisabled = !isMaxSpeedSet(offset);
    } else {
      isDisabled = !isTimeAttackCleared(offset);
    }

    itemInt.resource = isDisabled ? "empty" : "machines";
    itemInt.disabled = isDisabled;

    return itemInt;
  } else if ("id" in item && item.id?.match(/color-/)) {
    const itemInt = item as ItemInt;

    const [index] = item.id.splitInt();

    const offset = getPlaceOffset(itemInt.offset, "color", index);

    let isDisabled = true;

    if (index === 5) {
      isDisabled = !isMaxSpeedSet(offset);
    } else {
      isDisabled = !isTimeAttackCleared(offset);
    }

    let machine = getInt(itemInt.offset - 0x8, "uint8");

    if (isDisabled) {
      machine = 0x0;
    }

    itemInt.resource = `machine${machine}Colors`;
    itemInt.disabled = isDisabled;

    return itemInt;
  }

  return item;
}

export function overrideGetInt(
  item: Item,
): [boolean, (number | string) | undefined] {
  if ("id" in item && item.id?.match(/timeAttack-/)) {
    const itemInt = item as ItemInt;

    const [shift] = item.id.splitInt();

    if (!isTimeAttackCleared(itemInt.offset - shift)) {
      return [true, ""];
    }
  } else if ("id" in item && item.id?.match(/machine-/)) {
    const itemInt = item as ItemInt;

    const [index] = item.id.splitInt();

    const offset = getPlaceOffset(itemInt.offset, "machine", index);

    let isDisabled = true;

    if (index === 5) {
      isDisabled = !isMaxSpeedSet(offset);
    } else {
      isDisabled = !isTimeAttackCleared(offset);
    }

    if (isDisabled) {
      return [true, 0x0];
    }
  } else if ("id" in item && item.id?.match(/color-/)) {
    const itemInt = item as ItemInt;

    const [index] = item.id.splitInt();

    const offset = getPlaceOffset(itemInt.offset, "color", index);

    let isDisabled = true;

    if (index === 5) {
      isDisabled = !isMaxSpeedSet(offset);
    } else {
      isDisabled = !isTimeAttackCleared(offset);
    }

    if (isDisabled) {
      return [true, 0x0000ff];
    }
  }

  return [false, undefined];
}

export function afterSetInt(item: Item): void {
  if ("id" in item && item.id === "maxSpeed") {
    const itemInt = item as ItemInt;

    const offset = getPlaceOffset(itemInt.offset, "maxSpeed", 0);

    const color = getInt(offset, "uint24", { bigEndian: true });

    // If it seems that the time is set for the first time, we apply the Blue Falcon default color
    if (color === 0x0) {
      setInt(offset, "uint24", 0x0000ff, { bigEndian: true });
    }
  } else if ("id" in item && item.id?.match(/machine-/)) {
    const itemInt = item as ItemInt;

    const machine = getInt(itemInt.offset, "uint8");

    const colors = machinesDetails[machine].colors;
    const color = getObjKey(colors[0], 0);

    setInt(itemInt.offset + 0x8, "uint24", color, { bigEndian: true });
  } else if ("id" in item && item.id?.match(/time-/)) {
    const itemInt = item as ItemInt;

    const [index] = item.id.splitInt();

    const offset = getPlaceOffset(itemInt.offset, "time", index);

    const color = getInt(offset, "uint24", { bigEndian: true });

    // If it seems that the time is set for the first time, we apply the Blue Falcon default color
    if (color === 0x0) {
      setInt(offset, "uint24", 0x0000ff, { bigEndian: true });
    }
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
  return byteswapDataView("sra").buffer;
}

function getPlaceOffset(offset: number, type: string, index: number): number {
  const shift = index * 0x1c;

  switch (type) {
    case "maxSpeed":
      return offset + 0xcc;
    case "machine":
      if (index === 5) {
        return offset - 0xc4;
      }
      return offset - shift - 0x4c;
    case "color":
      if (index === 5) {
        return offset - 0xcc;
      }
      return offset - shift - 0x54;
    case "time":
      return offset + shift + 0x54;
  }

  return offset;
}

function isMaxSpeedSet(offset: number): boolean {
  const maxSpeed = getInt(offset, "float32", {
    bigEndian: true,
  });

  return maxSpeed !== 0;
}

function isTimeAttackCleared(offset: number): boolean {
  const time = getInt(offset, "uint32", {
    bigEndian: true,
  });

  return time !== 0x36ee7f;
}
