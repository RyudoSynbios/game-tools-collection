import { get } from "svelte/store";

import { dataView, gameTemplate } from "$lib/stores";
import {
  cloneDataView,
  getInt,
  getIntFromArray,
  setInt,
} from "$lib/utils/bytes";
import { formatChecksum } from "$lib/utils/checksum";
import { byteswapDataView, getHeaderShift } from "$lib/utils/common/nintendo64";
import {
  getMpkNoteShift,
  getRegionsFromMpk,
  isMpk,
  isUnpackedMpk,
  repackMpk,
  resetMpk,
  unpackMpk,
} from "$lib/utils/common/nintendo64/mpk";
import { isSrmMpk } from "$lib/utils/common/nintendo64/srm";
import { isInRange, mergeUint8Arrays } from "$lib/utils/format";
import { getClosestItem, getItem } from "$lib/utils/parser";

import type {
  Item,
  ItemBitflag,
  ItemChecksum,
  ItemContainer,
  ItemInt,
  ItemSection,
} from "$lib/types";

import { levelList } from "./utils/resource";

const SAVE_FORMAT = "eep";

let hasEep = false;

export function initHeaderShift(dataView: DataView): number {
  const format = isSrmMpk(dataView) ? "mpk" : SAVE_FORMAT;

  return getHeaderShift(dataView, format);
}

export function beforeInitDataView(
  dataView: DataView,
  shift: number,
): DataView {
  const uint8Arrays = [];

  hasEep = isEep(dataView);

  if (hasEep) {
    const eepData = new Uint8Array(
      byteswapDataView(SAVE_FORMAT, dataView).buffer,
    ).slice(0x0, 0x200);

    uint8Arrays.push(eepData);
    hasEep = true;
  }

  if (isMpk(dataView, shift)) {
    const mpkData = unpackMpk(dataView, shift).buffer;

    uint8Arrays.push(new Uint8Array(mpkData));
  }

  if (uint8Arrays.length > 0) {
    return new DataView(mergeUint8Arrays(...uint8Arrays).buffer);
  }

  return dataView;
}

export function overrideGetRegions(): string[] {
  if (isUnpackedMpk()) {
    return getRegionsFromMpk();
  } else if (hasEep) {
    return ["europe_usa"];
  }

  return [];
}

export function onInitFailed(): void {
  resetMpk();
}

export function overrideParseItem(item: Item): Item {
  if ("id" in item && item.id === "slots") {
    const itemContainer = item as ItemContainer;

    if (isUnpackedMpk()) {
      itemContainer.instanceType = "tabs";
      itemContainer.instances = hasEep ? 5 : 4;
      itemContainer.enumeration = !hasEep ? "Slot %d" : "";
      itemContainer.resource = hasEep ? "slots" : "";
    }

    return itemContainer;
  } else if ("id" in item && item.id?.match(/checksum-/)) {
    const itemChecksum = item as ItemChecksum;

    const [, type] = item.id.split("-");
    const [slotIndex] = item.id.splitInt();

    itemChecksum.disabled = !isSaveFormatDisplayed(type, slotIndex);

    return itemChecksum;
  } else if ("id" in item && item.id?.match(/section-/)) {
    const itemSection = item as ItemSection;

    const [, type] = item.id.split("-");
    const [slotIndex] = item.id.splitInt();

    itemSection.hidden = !isSaveFormatDisplayed(type, slotIndex);

    return itemSection;
  }

  return item;
}

export function overrideParseContainerItemsShifts(
  item: ItemContainer,
  shifts: number[],
  index: number,
): [boolean, number[] | undefined] {
  if (item.id === "slots") {
    if (isUnpackedMpk()) {
      const mpkShifts = getMpkNoteShift();

      if (!hasEep) {
        return [true, [...mpkShifts, index * item.length]];
      }

      if (index === 0) {
        return [true, [0x0]];
      } else {
        return [true, [0x200, ...mpkShifts, (index - 1) * item.length]];
      }
    }
  }

  return [false, undefined];
}

export function overrideItem(item: Item): Item {
  if ("id" in item && item.id === "clearTimeEep") {
    const itemInt = item as ItemInt;

    const sectionItem = getClosestItem("sectionProgression", item) as ItemSection; // prettier-ignore

    const progressionItem = sectionItem.items[0] as ItemInt;

    const progression = getInt(progressionItem.offset, "uint8");

    itemInt.disabled = [0x0, 0x8].includes(progression);

    return itemInt;
  }

  return item;
}

export function overrideGetInt(item: Item): [boolean, number | undefined] {
  if ("id" in item && item.id === "progression") {
    const itemInt = item as ItemInt;

    const progression = getInt(itemInt.offset, "uint8");

    if (progression === 0x0) {
      return [true, 0x1];
    }
  } else if ("id" in item && item.id === "timeAttack") {
    const itemInt = item as ItemInt;

    const progression = getInt(itemInt.offset, "uint8");

    return [true, progression >= 0xb ? 0x1 : 0x0];
  } else if ("id" in item && item.id?.match(/levelProgression-/)) {
    const itemInt = item as ItemInt;

    const progression = getInt(itemInt.offset, "uint8");

    if (progression === 0x8) {
      return [true, 0x0];
    }
  } else if ("id" in item && item.id === "clearTimeEep") {
    const itemInt = item as ItemInt;

    if (itemInt.disabled) {
      return [true, 0x0];
    }
  }

  return [false, undefined];
}

export function overrideSetInt(item: Item, value: string): boolean {
  if ("id" in item && item.id === "timeAttack") {
    const itemInt = item as ItemInt;

    setInt(itemInt.offset, "uint8", value === "1" ? 0xb : 0x0);

    return true;
  } else if ("id" in item && item.id?.match(/levelProgression-/)) {
    const itemInt = item as ItemInt;

    const [slotIndex] = item.id.splitInt();

    const progression = parseInt(value);

    if (isSaveFormatDisplayed("eep", slotIndex)) {
      const sectionItem = getClosestItem(/section-eep-/, item) as ItemSection;
      const timeItem = getItem("clearTimeEep", sectionItem.items) as ItemInt;

      const previous = getInt(itemInt.offset, "uint8");

      const isPreviousSet = ![0x0, 0x8].includes(previous);
      const isProgressionSet = progression !== 0x0;

      if (isPreviousSet && isProgressionSet) {
        return false;
      }

      if (!isPreviousSet && isProgressionSet) {
        setInt(timeItem.offset, "uint16", 0x0, { bigEndian: true });
        generateEepTimeChecksum(timeItem.offset);
      } else if (isPreviousSet && !isProgressionSet) {
        setInt(timeItem.offset, "uint32", -1, { bigEndian: true });
      }
    }
  }

  return false;
}

export function afterSetInt(item: Item, flag: ItemBitflag): void {
  if ("id" in item && item.id === "timeAttack") {
    const itemInt = item as ItemInt;

    updateGlobalProgression(itemInt.offset - 0x79);
  } else if ("id" in item && item.id === "scientists") {
    updateGlobalProgression(flag.offset - 0x78);
  } else if ("id" in item && item.id?.match(/levelProgression-/)) {
    const itemInt = item as ItemInt;

    const [, index] = item.id.splitInt();

    updateGlobalProgression(itemInt.offset - index);
  } else if ("id" in item && item.id === "clearTimeEep") {
    const itemInt = item as ItemInt;

    generateEepTimeChecksum(itemInt.offset);
  }
}

export function generateChecksum(
  item: ItemChecksum,
  dataView?: DataView,
): number {
  let checksums = [0x0, 0x0, 0x0, 0x0];

  if (dataView) {
    dataView = cloneDataView(dataView);
    dataView.setUint32(item.control.offsetEnd - 0x4, 0x0);
  }

  let offset = item.control.offsetStart;
  const length = item.control.offsetEnd - item.control.offsetStart;

  for (let i = 0x0; i < length; i += 0x80) {
    for (let j = 0x0; j < 0x4; j += 0x1) {
      if (offset < item.control.offsetEnd) {
        let int = 0x0;

        for (let k = 0x0; k < 0x21; k += 0x1) {
          for (let bit = 0x7; bit >= 0x0; bit -= 0x1) {
            const xor = (int & 0x80) !== 0x0 ? 0x85 : 0x0;

            int <<= 0x1;

            if (k !== 0x20) {
              int |= getInt(offset, "bit", { bit }, dataView);
            }

            int = (int ^ xor) & 0xff;
          }

          if (k !== 0x20) {
            offset += 0x1;
          }
        }

        checksums[j] = (checksums[j] + int) & 0xff;
      }
    }
  }

  const checksum = getIntFromArray(checksums, 0x0, "uint32", true);

  return formatChecksum(checksum, item.dataType);
}

export function beforeSaving(): ArrayBufferLike {
  const $dataView = get(dataView);

  if (isUnpackedMpk()) {
    if (!hasEep) {
      return repackMpk();
    }

    const dvBuffer = new Uint8Array($dataView.buffer);

    const eepData = dvBuffer.slice(0x0, 0x200);
    const mpkData = dvBuffer.slice(0x200);

    const repackedMpk = repackMpk(new DataView(mpkData.buffer));

    const uint8Array = new Uint8Array(repackedMpk);

    uint8Array.set(eepData);

    return uint8Array.buffer;
  }

  return byteswapDataView(SAVE_FORMAT).buffer;
}

export function onReset(): void {
  resetMpk();
}

function generateEepTimeChecksum(offset: number): void {
  const time = getInt(offset, "uint16", { bigEndian: true });

  const checksum = time ^ 0x55aa;

  setInt(offset + 0x2, "uint16", checksum, { bigEndian: true });
}

function isEep(dataView: DataView): boolean {
  const $gameTemplate = get(gameTemplate);

  const itemContainer = $gameTemplate.items[0] as ItemContainer;
  const itemChecksum = itemContainer.items[0] as ItemChecksum;

  if (dataView.byteLength < itemChecksum.control.offsetEnd) {
    return false;
  }

  const checksum = generateChecksum(itemChecksum, dataView);

  if (
    checksum ===
    getInt(itemChecksum.offset, "uint32", { bigEndian: true }, dataView)
  ) {
    return true;
  }

  return false;
}

function isSaveFormatDisplayed(type: string, slotIndex: number): boolean {
  return (
    (type === "eep" && hasEep && slotIndex === 0) ||
    (type === "mpk" &&
      ((hasEep && slotIndex > 0) || (!hasEep && slotIndex >= 0)))
  );
}

function updateGlobalProgression(offset: number): void {
  const clearedLevels = [0, 0, 0, 0];
  const medals = [0, 0, 0, 0];
  const earthMedals = [0, 0, 0, 0];
  const scientists = getInt(offset + 0x78, "uint8").toBitCount();

  const isTimeAttackUnlocked = getInt(offset + 0x79, "uint8") >= 0xb;

  levelList.forEach((level) => {
    const progression = getInt(offset + level.index, "uint8");

    if (isInRange(level.type, 0x0, 0x2) && isInRange(progression, 0x1, 0x5)) {
      clearedLevels[level.type] += 0x1;
    }

    if (level.index === 0x32 && isInRange(progression, 0x1, 0x5)) {
      clearedLevels[3] += 0x1;
    }

    if (isInRange(progression, 0x1, 0x4)) {
      if (level.type !== 0x4 || level.index === 0x32) {
        earthMedals[progression - 0x1] += 0x1;
      }

      medals[progression - 0x1] += 0x1;
    }
  });

  let progression = 0x1;

  if (!isTimeAttackUnlocked) {
    // Easy Levels Cleared
    if (progression === 0x1 && clearedLevels[0] === 5) {
      progression = 0x2;
    }

    // Medium Levels Cleared
    if (progression === 0x2 && clearedLevels[1] === 8) {
      progression = 0x3;
    }

    // Hard Levels Cleared
    if (progression === 0x3 && clearedLevels[2] === 7) {
      progression = 0x4;
    }

    // Scientists Rescued
    if (progression === 0x4 && scientists === 6) {
      progression = 0x6;
    }

    // Space Shuttle Cleared
    if (progression === 0x6 && clearedLevels[3] === 1) {
      progression = 0x7;
    }

    // Moon Cleared
    if (
      progression === 0x7 &&
      isInRange(getInt(offset + 0x28, "uint8"), 0x1, 0x5)
    ) {
      progression = 0x8;
    }

    // All Earth Golds Cleared
    if (progression === 0x8 && earthMedals[2] + earthMedals[3] === 52) {
      progression = 0x9;
    }

    // All Golds Cleared
    if (progression === 0x9 && medals[2] + medals[3] === 57) {
      progression = 0xa;
    }
  } else {
    progression = 0xb;

    // All Time Attack Golds Cleared
    if (progression === 0xb && medals[2] + medals[3] === 57) {
      progression = 0xc;
    }

    // All Time Attack Platinum Cleared
    if (progression === 0xc && medals[3] === 57) {
      progression = 0xd;
    }
  }

  const totalCleared = clearedLevels.reduce(
    (total, count) => (total += count),
    0,
  );

  let points = 0;

  points += totalCleared * 3 * (isTimeAttackUnlocked ? 2 : 1);
  points += medals[0] + medals[1] * 2 + medals[2] * 3 + medals[3] * 4;

  if (points === 354) {
    points = 360;
  }

  const rank = Math.floor(points / 12);

  setInt(offset + 0x79, "uint8", progression);
  setInt(offset - 0xc, "uint8", rank);
  setInt(offset - 0xe, "uint16", points, { bigEndian: true });

  // Hidden Level Progressions
  setInt(offset + 0x2f, "uint8", 0x5); // Introduction
  setInt(offset + 0x31, "uint8", progression >= 0x5 ? 0x5 : 0x0); // Ending
  setInt(offset + 0x26, "uint8", progression >= 0x7 ? 0x5 : 0x0); // Shuttle Island
}
