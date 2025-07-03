import { get } from "svelte/store";

import { gameTemplate } from "$lib/stores";
import { getInt, getString, setInt } from "$lib/utils/bytes";
import { formatChecksum } from "$lib/utils/checksum";
import { clone } from "$lib/utils/format";
import { getItem, updateResources } from "$lib/utils/parser";

import {
  Item,
  ItemBitflag,
  ItemBitflags,
  ItemChecksum,
  ItemContainer,
  ItemInt,
  ItemString,
  Resource,
} from "$lib/types";

import { recordsNames } from "./utils/resource";

export function overrideGetRegions(dataView: DataView): string[] {
  const $gameTemplate = get(gameTemplate);

  const itemContainer = clone($gameTemplate.items[0] as ItemContainer);
  const itemChecksum = itemContainer.items[0] as ItemChecksum;

  if (dataView.byteLength < itemChecksum.control.offsetEnd) {
    return [];
  }

  const checksum = generateChecksum(itemChecksum, dataView);

  if (checksum === getInt(itemChecksum.offset, "uint16", {}, dataView)) {
    return ["europe_usa_japan"];
  }

  return [];
}

export function overrideParseItem(item: Item, instanceIndex: number): Item {
  if ("id" in item && item.id?.match(/records-/)) {
    const itemInt = item as ItemInt;

    const [, type] = item.id.split("-");

    let shift = instanceIndex;

    switch (type) {
      case "milliseconds":
        shift -= 0xd;
        break;
      case "minutes":
        shift -= 0x11;
        break;
      case "name":
        shift -= 0xc;
        break;
      case "score":
        shift -= 0xd;
        break;
      case "seconds":
        shift -= 0xf;
        break;
    }

    itemInt.offset += getInt(itemInt.offset + shift, "uint8") - 0x10;

    return itemInt;
  }

  return item;
}

export function overrideItem(item: Item): Item {
  if ("id" in item && item.id?.match(/circuitProgression-/)) {
    const itemInt = item as ItemInt;

    const [, , type] = item.id.split("-");
    const [circuitIndex, opponentIndex] = item.id.splitInt();

    itemInt.disabled = isInputDisabled(
      itemInt.offset,
      type,
      circuitIndex,
      opponentIndex,
    );

    return itemInt;
  }

  return item;
}

export function overrideGetInt(
  item: Item,
): [boolean, number | (ItemBitflag & { checked: boolean })[] | undefined] {
  if ("id" in item && item.id?.match(/circuitProgression-/)) {
    const itemInt = item as ItemInt;

    const [, , type] = item.id.split("-");
    const [circuitIndex, opponentIndex] = item.id.splitInt();

    const isDisabled = isInputDisabled(
      itemInt.offset,
      type,
      circuitIndex,
      opponentIndex,
    );

    if (isDisabled) {
      return [true, 0];
    }
  }

  if ("id" in item && item.id?.match(/opponents-/)) {
    const itemBitflags = item as ItemBitflags;

    const [circuit] = item.id.splitInt();

    const offset = itemBitflags.flags[0].offset;

    const int = getInt(offset, "uint8");
    const wins = getInt(offset + 0x79, "uint8");

    const flags = itemBitflags.flags.reduce(
      (flags: (ItemBitflag & { checked: boolean })[], flag) => {
        flags.push({
          ...flag,
          checked: wins > 0 && circuit * 0x4 + flag.bit <= int,
        });

        return flags;
      },
      [],
    );

    return [true, flags];
  } else if ("id" in item && item.id?.match(/number-/)) {
    const itemInt = item as ItemInt;

    const [, , count] = item.id.splitInt();

    let score = "";

    for (let i = count; i >= 0x0; i -= 0x1) {
      score += getInt(itemInt.offset + i, "uint8");
    }

    const int = parseInt(score);

    return [true, int];
  }

  return [false, undefined];
}

export function overrideSetInt(
  item: Item,
  value: string,
  flag: ItemBitflag,
): boolean {
  if ("id" in item && item.id?.match(/opponents-/)) {
    const itemBitflags = item as ItemBitflags;

    const [circuit] = item.id.splitInt();

    const offset = itemBitflags.flags[0].offset;

    // Update progression

    const int = circuit * 0x4 + flag.bit + (Boolean(value) ? 0x1 : 0x0);
    const progression = Math.floor((int + 0x1) / 0x4) * 0x4;

    setInt(offset - 0x1, "uint8", progression);
    setInt(offset, "uint8", Math.max(0, int - 0x1));

    // Update total wins

    let wins = getInt(offset + 0x79, "uint8");

    if (int === 0) {
      wins = 0;
    } else if (int > wins - 1) {
      wins = int;
    }

    setInt(offset + 0x79, "uint8", wins);

    // Update circuit wins

    for (let i = 0x0; i < 0x4; i += 0x1) {
      const wins = Math.floor(int / 4) >= i + 0x1 ? 0x4 : 0x0;

      setInt(offset + 0xb + i, "upper4", wins);
    }

    // Update opponents times

    for (let i = 0x0; i < 0x10; i += 0x1) {
      if (int >= i + 0x1) {
        setInt(offset + 0x13 + i * 0x5, "uint8", 0x0);
      }
    }

    return true;
  } else if ("id" in item && item.id?.match(/number-/)) {
    const itemInt = item as ItemInt;

    const [, , count] = item.id.splitInt();

    const int = parseInt(value, 16);

    let start = 0x0;
    let end = 0x2;

    if (count === 5) {
      start = 0x1;
      end = 0x6;
    }

    for (let i = start; i < end; i += 0x1) {
      setInt(itemInt.offset + i, "int8", (int >> (i * 0x4)) & 0xf);
    }

    return true;
  }

  return false;
}

export function afterSetInt(item: Item): void {
  if ("id" in item && item.id?.match(/name-/)) {
    updateResources("names");
  } else if ("id" in item && item.id === "wins") {
    const itemInt = item as ItemInt;

    const opponents = getInt(itemInt.offset - 0x79, "uint8");
    const wins = getInt(itemInt.offset, "uint8");

    if (wins - 1 < opponents) {
      setInt(itemInt.offset - 0x79, "uint8", Math.max(0, wins - 1));
    }
  }
}

export function generateChecksum(
  item: ItemChecksum,
  dataView = new DataView(new ArrayBuffer(0)),
): number {
  let checksum = 0x0;

  for (let i = item.control.offsetStart; i < item.control.offsetEnd; i += 0x1) {
    checksum += getInt(i, "uint8", {}, dataView);

    if (i > item.control.offsetStart) {
      checksum += i - 0x4;
    }
  }

  checksum ^= 0xff;

  return formatChecksum(checksum, item.dataType);
}

export function getNames(): Resource {
  const nameItem = getItem("name-0") as ItemString;

  const names = recordsNames;

  for (let i = 0x0; i < 0x8; i += 0x1) {
    const isActive = getInt(nameItem.offset - 0x102 + i, "uint8");

    if (isActive) {
      names[i] = getString(
        nameItem.offset + i * 0x80,
        nameItem.length,
        nameItem.letterDataType,
        { resource: "letters" },
      );
    }
  }

  return names;
}

function isInputDisabled(
  offset: number,
  type: string,
  circuitIndex: number,
  opponentIndex: number,
): boolean {
  let shift = 0x0;

  switch (type) {
    case "losses":
      shift = 0xb + circuitIndex;
      break;
    case "milliseconds":
      shift = 0xf + (circuitIndex * 0x14 + opponentIndex * 0x5);
      break;
    case "minutes":
      shift = 0x13 + (circuitIndex * 0x14 + opponentIndex * 0x5);
      break;
    case "score":
      shift = 0x5f + circuitIndex * 0x6;
      break;
    case "seconds":
      shift = 0x11 + (circuitIndex * 0x14 + opponentIndex * 0x5);
      break;
  }

  const opponents = getInt(offset - shift, "uint8");
  const wins = getInt(offset + 0x79 - shift, "uint8");

  if (["milliseconds", "minutes", "seconds"].includes(type)) {
    return wins === 0 || opponents < circuitIndex * 4 + opponentIndex;
  }

  return opponents + 1 < (circuitIndex + 1) * 4;
}
